import pandas as pd
import pickle
import os
from backend.config.config import Config
from backend.ml_pipeline.monitoring.age_drift_monitor import AgeDriftMonitor

def setup_baseline():
    try:
        # Read the preprocessed training data
        training_data_path = os.path.join(
            Config.PROJECT_ROOT,
            "backend/data_pipeline/data/processed/PMC-Patients_preprocessed.csv"
        )
        df = pd.read_csv(training_data_path)
        
        # Get age distribution from training data
        baseline_ages = df['age_years'].dropna().values
        
        # Initialize monitor and set baseline
        monitor = AgeDriftMonitor()
        monitor.set_baseline(baseline_ages)
        
        # Save baseline distribution
        baseline_path = os.path.join(Config.MODEL_ARTIFACTS_PATH, 'baseline_age_distribution.pkl')
        os.makedirs(os.path.dirname(baseline_path), exist_ok=True)
        
        with open(baseline_path, 'wb') as f:
            pickle.dump(baseline_ages, f)
            
        print(f"Baseline distribution saved with {len(baseline_ages)} samples")
        print(f"Age distribution statistics:")
        print(f"Mean: {baseline_ages.mean():.2f}")
        print(f"Std: {baseline_ages.std():.2f}")
        print(f"Min: {baseline_ages.min():.2f}")
        print(f"Max: {baseline_ages.max():.2f}")
        
    except Exception as e:
        print(f"Error setting up baseline: {e}")
        raise

if __name__ == "__main__":
    setup_baseline() 