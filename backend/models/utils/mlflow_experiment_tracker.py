from datetime import datetime
import mlflow
import time

class MLflowExperimentTracker:
    def __init__(self):
        # Set tracking URI with file store
        mlflow.set_tracking_uri("http://localhost:8050")
        
        # Create or get experiment
        try:
            mlflow.create_experiment("healthcare-chat-rag-system")
        except Exception:
            pass
        
        mlflow.set_experiment("healthcare-chat-rag-system")
        
    def start_run(self):
        mlflow.start_run()
        self.start_time = time.time()
        
    def end_run(self, metrics, parameters, artifacts):
        try:
            # Calculate execution time
            execution_time = time.time() - self.start_time
            
            # Log metrics
            mlflow.log_metric("pipeline_execution_time", execution_time)
            mlflow.log_metric("num_retrieved_samples", metrics["num_retrieved_samples"])
            
            # Log parameters
            mlflow.log_param("summarization_model", parameters["summarization_model"])
            mlflow.log_param("embedding_model", parameters["embedding_model"])
            mlflow.log_param("n_results", parameters["n_results"])
            
            # Log artifacts
            mlflow.log_text(artifacts["summary_prompt"], "summarization_prompt.txt")
            mlflow.log_text(artifacts["doctor_report_prompt"], "doctor_report_prompt.txt")
            mlflow.log_text(artifacts["pipeline_output"], "pipeline_output.txt")
            
            mlflow.end_run()
        except Exception as e:
            print(f"Error logging to MLflow: {str(e)}")
            mlflow.end_run(status="FAILED") 