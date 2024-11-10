import os

def setup_airflow():
    # Get absolute path to the project root
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Set Airflow home
    airflow_home = os.path.join(project_root, 'backend/data_pipeline/airflow')
    os.environ['AIRFLOW_HOME'] = airflow_home
    
    # Add this line to set PYTHONPATH
    os.environ['PYTHONPATH'] = project_root
    
    # Create necessary directories
    os.makedirs(os.path.join(airflow_home, 'dags'), exist_ok=True)
    os.makedirs(os.path.join(airflow_home, 'logs'), exist_ok=True)
    os.makedirs(os.path.join(airflow_home, 'plugins'), exist_ok=True)
    
    # Create airflow.cfg
    airflow_cfg = os.path.join(airflow_home, 'airflow.cfg')
    if not os.path.exists(airflow_cfg):
        with open(airflow_cfg, 'w') as f:
            f.write(f"""[core]
dags_folder = {os.path.join(airflow_home, 'dags')}
load_examples = False
executor = LocalExecutor

[webserver]
web_server_port = 8080

[database]
sql_alchemy_conn = postgresql://postgres:postgres@localhost:5432/airflow
""")
    
    # Create symbolic link to DAG file
    dag_source = os.path.join(project_root, 'backend/data_pipeline/airflow/dags/patient_insight_dag.py')
    dag_dest = os.path.join(airflow_home, 'dags/patient_insight_dag.py')
    if os.path.exists(dag_source) and not os.path.exists(dag_dest):
        os.symlink(dag_source, dag_dest)
    
    print(f"AIRFLOW_HOME set to: {airflow_home}")
    return airflow_home

if __name__ == "__main__":
    setup_airflow() 