import mlflow
import time
from datetime import datetime

class MLflowTracker:
    def __init__(self):
        mlflow.set_tracking_uri("http://localhost:5000")
        mlflow.set_experiment("healthcare-chat-system")
        
    def start_conversation_tracking(self):
        mlflow.start_run()
        self.start_time = time.time()
        
    def end_conversation_tracking(self, metrics):
        duration = time.time() - self.start_time
        
        # Log metrics
        mlflow.log_metric("conversation_duration", duration)
        mlflow.log_metric("num_user_messages", metrics["num_messages"])
        mlflow.log_metric("emergency_detected", 1 if metrics["emergency_detected"] else 0)
        mlflow.log_metric("symptom_confidence", metrics["symptom_confidence"])
        
        # Log model parameters
        mlflow.log_param("model_version", "gpt-4o-mini")
        mlflow.log_param("embedding_model", "sentence-transformer")
        
        # Log conversation artifacts
        mlflow.log_dict(metrics["conversation_history"], "conversation.json")
        mlflow.log_text(metrics["symptom_summary"], "symptom_summary.txt")
        mlflow.log_text(metrics["medical_analysis"], "medical_analysis.txt")
        
        mlflow.end_run() 