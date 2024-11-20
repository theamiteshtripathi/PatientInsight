import subprocess
import os
import time

def start_mlflow_server():
    # Create mlruns directory if it doesn't exist
    if not os.path.exists("mlruns"):
        os.makedirs("mlruns")
    
    # Start MLflow server
    print("Starting MLflow server...")
    subprocess.Popen([
        "mlflow", "server",
        "--backend-store-uri", "mlruns",
        "--default-artifact-root", "mlruns",
        "--host", "0.0.0.0",
        "--port", "8050"
    ])
    
    # Wait for server to start
    time.sleep(5)
    print("MLflow server is running at http://localhost:8050")

if __name__ == "__main__":
    start_mlflow_server() 