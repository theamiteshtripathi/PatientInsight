import os

# Get the absolute path to the project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

AIRFLOW_CONFIG = {
    'dags_folder': os.path.join(PROJECT_ROOT, 'backend/data_pipeline/dags'),
    'plugins_folder': os.path.join(PROJECT_ROOT, 'backend/data_pipeline/plugins'),
    'logs_folder': os.path.join(PROJECT_ROOT, 'logs/airflow'),
    'sql_alchemy_conn': 'postgresql://user:password@localhost:5432/patient_insight'
}
