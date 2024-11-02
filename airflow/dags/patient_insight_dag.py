from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from scripts_location.download import download_pmc_patients_dataset
from scripts_location.preprocess import preprocess_pmc_patients

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 9, 9),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    'catchup': False,
}

dag = DAG(
    'patient_insight_pipeline',
    default_args=default_args,
    description='A DAG for the PatientInsight data pipeline',
    schedule=timedelta(days=1),
    max_active_runs=1,
)

download_task = PythonOperator(
    task_id='download_data',
    python_callable=download_pmc_patients_dataset,
    op_kwargs={'output_dir': 'data/raw'},
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

download_task >> preprocess_task
