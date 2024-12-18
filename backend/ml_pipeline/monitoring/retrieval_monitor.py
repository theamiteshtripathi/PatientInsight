import numpy as np
from datetime import datetime
import mlflow
from backend.ml_pipeline.monitoring.age_drift_monitor import AgeDriftMonitor 

class RetrievalMonitor:
    def __init__(self, score_threshold=0.5):
        self.score_threshold = score_threshold
        self.score_history = []
        
    def monitor_retrieval_scores(self, scores, query):
        """Monitor retrieval scores and trigger alerts if needed"""
        avg_score = np.mean(scores)
        min_score = np.min(scores)
        
        # Log to MLflow
        mlflow.log_metrics({
            'retrieval_score_avg': avg_score,
            'retrieval_score_min': min_score,
            'retrieval_score_std': np.std(scores)
        })
        
        self.score_history.append({
            'timestamp': datetime.now(),
            'scores': scores,
            'avg_score': avg_score
        })
        
        # Check for low scores
        if min_score < self.score_threshold:
            self.trigger_alert(
                "Low Retrieval Score Detected",
                f"Query: {query}\nScores: {scores}\nAvg Score: {avg_score}"
            )
            
        return avg_score, min_score
    
    def trigger_alert(self, title, message):
        AgeDriftMonitor.send_email_alert(title, message)