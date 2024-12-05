from airflow.utils.email import send_email
import pandas as pd

# Define the email alert function
def send_custom_email(**context):
    dag_run = context['dag_run']
    dag_id = context['dag'].dag_id
    execution_date = context['execution_date']

    # Calculate execution time
    start_time = dag_run.start_date
    end_time = dag_run.end_date
    execution_time = (end_time - start_time).total_seconds() if start_time and end_time else "N/A"
    
    # Initialize the email content with the DAG information
    subject = f"Airflow Notification: DAG {dag_id} Completed"
    html_content = f"""
    <h3>DAG Completion Notification</h3>
    <p>DAG: {dag_id}</p>
    <p>Execution Date: {execution_date} UTC</p>
    <p>Execution Time: {execution_time} seconds</p>
    <p>Status: DAG run completed</p>
    <h4>Task Status:</h4>
    <ul>
    """

    # Loop through each task instance in the DAG run and get its state
    for task_instance in dag_run.get_task_instances():
        task_id = task_instance.task_id
        task_state = task_instance.state
        task_start_time = task_instance.start_date
        task_end_time = task_instance.end_date
        task_execution_time = (
            (task_end_time - task_start_time).total_seconds()
            if task_start_time and task_end_time
            else "N/A"
        )
        try:
            task_execution_time = float(task_execution_time)
            formatted_time = f"{task_execution_time:.2f} seconds"
        except ValueError:
            formatted_time = "Unknown"
        html_content += f"<li>Task <strong>{task_id}</strong>: {task_state}, Execution Time: {formatted_time}</li>"
    # Close the HTML list
    html_content += "</ul>"

    # Define recipients
    recipients = ['pappuru.d@northeastern.edu', 'udayakumar.de@northeastern.edu', 'tripathi.am@northeastern.edu', 'gaddamsreeramulu.r@northeastern.edu', 'amin.sn@northeastern.edu']
    send_email(to=recipients, subject=subject, html_content=html_content)