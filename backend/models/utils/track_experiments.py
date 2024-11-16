import mlflow
from mlflow.tracking import MlflowClient

def analyze_experiments():
    client = MlflowClient()
    experiment = client.get_experiment_by_name("healthcare-chat-system")
    
    # Get all runs for the experiment
    runs = client.search_runs(
        experiment_ids=[experiment.experiment_id],
        order_by=["metrics.symptom_confidence DESC"]
    )
    
    # Analyze metrics
    for run in runs:
        print(f"Run ID: {run.info.run_id}")
        print(f"Metrics: {run.data.metrics}")
        print(f"Parameters: {run.data.params}")
        print("---") 