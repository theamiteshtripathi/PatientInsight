from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
import sys
import os

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.data.download import download_pmc_patients_dataset
from src.data.preprocess import preprocess_pmc_patients

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2023, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'patient_insight_pipeline',
    default_args=default_args,
    description='A DAG for the PatientInsight data pipeline',
    schedule_interval=timedelta(days=1),
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

