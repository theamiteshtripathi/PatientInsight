from airflow import DAG
from airflow.operators.empty import EmptyOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2023, 1, 1)
}

with DAG('test_dag', 
         default_args=default_args,
         schedule_interval=timedelta(days=1)) as dag:
    
    t1 = EmptyOperator(task_id='test_task') 