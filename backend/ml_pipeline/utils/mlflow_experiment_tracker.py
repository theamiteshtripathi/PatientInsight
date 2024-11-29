from datetime import datetime
import mlflow
import sagemaker_mlflow
import time

class MLflowExperimentTracker:
    def __init__(self):
        # Set tracking URI with file store
        mlflow.set_tracking_uri("arn:aws:sagemaker:us-east-2:167325058662:mlflow-tracking-server/patient-insight")
        
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
            mlflow.log_metric("input_cost", metrics["input_cost"])
            mlflow.log_metric("output_cost", metrics["output_cost"])
            mlflow.log_metric("total_cost", metrics["total_cost"])
            mlflow.log_metric("prompt_tokens", metrics["prompt_tokens"])
            mlflow.log_metric("completion_tokens", metrics["completion_tokens"])
            mlflow.log_metric("total_tokens", metrics["total_tokens"])
            
            # Log retrieval scores if they exist
            for metric_name, value in metrics.items():
                if metric_name.startswith("retrieval_score_"):
                    mlflow.log_metric(metric_name, value)
            
            # Log parameters
            mlflow.log_param("summarization_model", parameters["summarization_model"])
            mlflow.log_param("embedding_model", parameters["embedding_model"])
            mlflow.log_param("retrieved_samples", parameters["n_results"])
            mlflow.log_param("temperature", parameters["temperature"])
            mlflow.log_param("max_tokens", parameters["max_tokens"])
            
            # Log artifacts
            mlflow.log_text(artifacts["summary_prompt"], "summarization_prompt.txt")
            mlflow.log_text(artifacts["doctor_report_prompt"], "doctor_report_prompt.txt")
            mlflow.log_text(artifacts["pipeline_output"], "pipeline_output.txt")
            for name, prompt in artifacts["prompt_templates"].items():
                mlflow.log_text(prompt, f"{name}.txt")
            
            mlflow.end_run()
        except Exception as e:
            print(f"Error logging to MLflow: {str(e)}")
            mlflow.end_run(status="FAILED") 