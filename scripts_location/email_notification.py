from airflow.utils.email import send_email
import pandas as pd

# Define the email alert function
def send_custom_email(**context):
    dag_run = context['dag_run']
    dag_id = context['dag'].dag_id
    execution_date = context['execution_date']
    
    # Initialize the email content with the DAG information
    subject = f"Airflow Notification: DAG {dag_id} Completed"
    html_content = f"""
    <h3>DAG Completion Notification</h3>
    <p>DAG: {dag_id}</p>
    <p>Execution Date: {execution_date} UTC</p>
    <p>Status: DAG run completed</p>
    <h4>Task Status:</h4>
    <ul>
    """

    # Loop through each task instance in the DAG run and get its state
    for task_instance in dag_run.get_task_instances():
        task_id = task_instance.task_id
        task_state = task_instance.state
        html_content += f"<li>Task <strong>{task_id}</strong>: {task_state}</li>"

    # Close the HTML list
    html_content += "</ul>"

    # Define recipients
    recipients = ['pappuru.d@northeastern.edu', 'udayakumar.de@northeastern.edu', 'tripathi.am@northeastern.edu', 'gaddamsreeramulu.r@northeastern.edu', 'amin.sn@northeastern.edu']
    send_email(to=recipients, subject=subject, html_content=html_content)