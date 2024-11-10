from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.trigger_rule import TriggerRule
from datetime import datetime, timedelta
import sys
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

# Add the project root directory to the Python path
project_root = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(project_root))

from data_pipeline.scripts.download import download_pmc_patients_dataset
from data_pipeline.scripts.preprocess import preprocess_pmc_patients
from data_pipeline.scripts.stats_generation import generate_stats
from data_pipeline.scripts.email_notification import send_custom_email
from ml_pipeline.src.data_processing.pipeline import TensorflowPipeline
from data_pipeline.scripts.pdf_processing import process_patient_pdf

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
    'patient_insight_pipeline',
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
        'output_dir': os.path.join(str(project_root), 'data/raw'),
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
        'input_path': 'data/raw/PMC-Patients.csv',
        'output_path': 'data/processed/PMC-Patients_preprocessed.csv'
    },
    dag=dag,
)

pdf_processing_task = PythonOperator(
    task_id='process_pdf',
    python_callable=process_patient_pdf,
    dag=dag
)

tf_pipeline_task = PythonOperator(
    task_id='tf_pipeline',
    python_callable=lambda: TensorflowPipeline().run_pipeline('data/processed/PMC-Patients_preprocessed.csv'),
    dag=dag,
)

stats_generation = PythonOperator(
    task_id='generate_stats',
    python_callable=generate_stats,
    op_kwargs={
        'csv_file_path': 'data/processed'
    },
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
download_task >> preprocess_task >> [pdf_processing_task, tf_pipeline_task] >> stats_generation >> email_task

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
