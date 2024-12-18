from scipy import stats
import numpy as np
from datetime import datetime
import mlflow
from backend.config.config import Config
import smtplib
from email.mime.text import MIMEText
import pickle
import os


class AgeDriftMonitor:
    def __init__(self):
        self.baseline_distribution = self._load_baseline()
        self.drift_threshold = 0.05  # p-value threshold for KS test
        
    def _load_baseline(self):
        """Load baseline distribution from saved file"""
        baseline_path = os.path.join(Config.MODEL_ARTIFACTS_PATH, 'baseline_age_distribution.pkl')
        try:
            with open(baseline_path, 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            print("Warning: Baseline distribution not found. Please run setup_baseline.py first.")
            return None
            
    def check_drift(self, current_ages):
        """Perform Kolmogorov-Smirnov test for distribution drift"""
        if self.baseline_distribution is None:
            raise ValueError("Baseline distribution not set. Run setup_baseline.py first.")
            
        statistic, p_value = stats.ks_2samp(self.baseline_distribution, 
                                          np.array(current_ages))
        
        is_drift = p_value < self.drift_threshold
        
        # Log to MLflow
        mlflow.log_metrics({
            'age_drift_statistic': statistic,
            'age_drift_p_value': p_value,
            'age_distribution_mean': np.mean(current_ages),
            'age_distribution_std': np.std(current_ages)
        })
        
        if is_drift:
            self.trigger_alert(
                "Age Distribution Drift Detected", 
                f"Drift detected in age distribution!\n"
                f"p-value: {p_value:.4f}\n"
                f"statistic: {statistic:.4f}\n"
                f"Current distribution mean: {np.mean(current_ages):.2f}\n"
                f"Baseline distribution mean: {np.mean(self.baseline_distribution):.2f}"
            )
        
        return is_drift, p_value, statistic
    
    def trigger_alert(self, title, message):
        self.send_email_alert(title, message)
    
    @staticmethod
    def send_email_alert(title, message):
        msg = MIMEText(message)
        msg['Subject'] = f"Model Monitor Alert: {title}"
        msg['From'] = Config.ALERT_EMAIL_FROM
        msg['To'] = Config.ALERT_EMAIL_TO
        
        with smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT) as server:
            server.starttls()
            server.login(Config.SMTP_USERNAME, Config.SMTP_PASSWORD)
            server.send_message(msg) 