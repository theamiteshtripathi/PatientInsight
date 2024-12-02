from backend.ml_pipeline.patient_chat.model_manager import MedicalChatModel
import json

def deploy():
    model = MedicalChatModel()
    endpoint_name = model.deploy_model()
    
    if endpoint_name:
        # Save the endpoint name to a file
        with open('endpoint_config.json', 'w') as f:
            json.dump({'endpoint_name': endpoint_name}, f)
        print(f"Model deployed successfully. Endpoint name saved: {endpoint_name}")
    else:
        print("Failed to deploy model")

if __name__ == "__main__":
    deploy() 