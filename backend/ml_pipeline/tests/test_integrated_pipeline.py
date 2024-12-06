import os
import sys
from pathlib import Path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))
import subprocess
import time
from backend.ml_pipeline.integrated_pipeline import IntegratedPipeline
from backend.config.config import Config

# def ensure_mlflow_server():
#     # Start MLflow server if not already running
#     try:
#         import requests
#         requests.get("http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com:8050")
#     except requests.exceptions.ConnectionError:
#         print("Starting MLflow server...")
#         subprocess.Popen([
#             "mlflow", "server",
#             "--backend-store-uri", "mlruns",
#             "--default-artifact-root", "mlruns",
#             "--host", "0.0.0.0",
#             "--port", "8050"
#         ])
#         time.sleep(5)

def test_integrated_pipeline():
    try:
        # Ensure MLflow server is running
        # ensure_mlflow_server()
        
        # Initialize pipeline
        pipeline = IntegratedPipeline(Config.OPENAI_API_KEY)
        
        # Simulate conversation inputs
        conversation_inputs = [
            "I've been having severe headaches for the past week",
            "They're worse in the morning and light makes them worse",
            "Yes, I also feel nauseous when the headache is severe",
            "About 7-8 out of 10 in terms of pain",
            "bye"
        ]
        
        # Mock input function
        def mock_input(prompt):
            current_input = conversation_inputs.pop(0)
            print(f"{prompt}{current_input}")
            return current_input
        
        # Replace standard input with mock
        import builtins
        builtins.input = mock_input
        
        # Run the pipeline
        print("\nStarting Integrated Pipeline Test...")
        pipeline.run_conversation_and_analysis()
        
    except Exception as e:
        print(f"Error in integrated pipeline: {str(e)}")
        raise e

if __name__ == "__main__":
    Config.validate_env_vars()
    test_integrated_pipeline() 
