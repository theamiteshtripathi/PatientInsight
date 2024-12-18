from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.trigger_rule import TriggerRule
from airflow.models import Variable
from airflow.decorators import dag, task
from datetime import datetime, timedelta
import sys
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variabless
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

# Add the project root directory to the Python path
root_path = Path(__file__).parent.parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))

# Loading script files
from backend.data_pipeline.scripts.download import download_pmc_patients_dataset
from backend.data_pipeline.scripts.preprocess import preprocess_pmc_patients
from backend.data_pipeline.scripts.stats_generation import generate_stats
from backend.data_pipeline.scripts.email_notification import send_custom_email
from backend.ml_pipeline.RAG.setup_embeddings import setup

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2023, 1, 1),
    'email': ['pappuru.d@northeastern.edu', 'udayakumar.de@northeastern.edu', 'tripathi.am@northeastern.edu', 'gaddamsreeramulu.r@northeastern.edu', 'amin.sn@northeastern.edu'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=2),
}

dag = DAG(
    'data_pipeline',
    default_args=default_args,
    description='Pipeline for processing patient data',
    schedule_interval=timedelta(days=1),
    catchup=False,
    max_active_runs=1,
    tags=['patient', 'healthcare']
)

download_task = PythonOperator(
    task_id='download_data',
    python_callable=download_pmc_patients_dataset,
    op_kwargs={
        'output_dir': 'backend/data_pipeline/data/raw/',
        'bucket_name': "{{ dag_run.conf.get('bucket_name', 'manual_trigger') }}",
        'object_key': "{{ dag_run.conf.get('object_key', 'manual_trigger') }}"
    },
    retries=2,
    retry_delay=timedelta(minutes=1),
    execution_timeout=timedelta(minutes=5),
    dag=dag,
)

preprocess_task = PythonOperator(
    task_id='preprocess_data',
    python_callable=preprocess_pmc_patients,
    op_kwargs={
        'input_path': 'backend/data_pipeline/data/raw/PMC-Patients.csv',
        'output_path': 'backend/data_pipeline/data/processed/PMC-Patients_preprocessed.csv'
    },
    dag=dag,
)

stats_generation = PythonOperator(
    task_id='generate_stats',
    python_callable=generate_stats,
    op_kwargs={
        'csv_file_dir': 'backend/data_pipeline/data/processed/'
    },
    dag=dag,
)

embeddings_generator = PythonOperator(
    task_id='generate_embeddings',
    python_callable=setup,
    dag=dag,
)

email_task = PythonOperator(
    task_id="send_email",
    python_callable=send_custom_email,
    provide_context=True,
    dag=dag,
    trigger_rule=TriggerRule.ALL_DONE
)

# Set dependencies
download_task >> preprocess_task >> [stats_generation, embeddings_generator] >> email_task

if __name__ == "__main__":
    from airflow.utils.dag_cycle_tester import check_cycle
    check_cycle(dag)
    print("DAG cycle check passed")
    
    # Test DAG structure
    print("\nDAG Task Dependencies:")
    for task in dag.tasks:
        print(f"\nTask: {task.task_id}")
        print(f"Upstream: {[t.task_id for t in task.upstream_list]}")
        print(f"Downstream: {[t.task_id for t in task.downstream_list]}")

    dag.test()
