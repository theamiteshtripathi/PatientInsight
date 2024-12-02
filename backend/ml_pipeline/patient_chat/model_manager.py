import json
import sagemaker
import boto3
from sagemaker.huggingface import HuggingFaceModel, get_huggingface_llm_image_uri
from backend.config.config import Config
import os

class MedicalChatModel:
    def __init__(self):
        self.role = Config.EXECUTION_ROLE
        self.endpoint_name = None
        self.runtime_client = boto3.client('sagemaker-runtime', region_name='us-east-2')
        
        # Hub Model configuration
        self.hub_config = {
            'HF_MODEL_ID': 'aaditya/Llama3-OpenBioLLM-8B',
            'SM_NUM_GPUS': json.dumps(1) #,
            #'HUGGING_FACE_HUB_TOKEN': Config.HUGGING_FACE_TOKEN
        }

    def create_medical_prompt(self, medical_report, doctor_note, patient_question):
        """Creates a formatted prompt for the medical chat model"""
        return f"""Task: You are a knowledgeable medical AI assistant. Provide a detailed and helpful response to the patient's question only based on their medical report.
        If a patient is asking a question which is outside the scope of patient's medical diagnosis, do not encourage it and persuade them to ask questions on there health.  

        Medical Report:
        {medical_report}

        Doctor's Note: {doctor_note}

        Patient Question: {patient_question}

        Response:
        """

    def deploy_model(self):
        """Deploy the model to SageMaker and save the endpoint name"""
        try:
            print("Starting deployment...")
            huggingface_model = HuggingFaceModel(
                image_uri=get_huggingface_llm_image_uri("huggingface", version="2.2.0"),
                env=self.hub_config,
                role=self.role
            )

            predictor = huggingface_model.deploy(
                initial_instance_count=1,
                instance_type="ml.g5.2xlarge",  
                container_startup_health_check_timeout=300,
                model_data_download_timeout=300,
                max_new_tokens=2000,
                temperature=0.7,
                top_p=0.9,
                do_sample=True
            )

            self.endpoint_name = predictor.endpoint_name
            print(f"Model deployed successfully. Endpoint name: {self.endpoint_name}")
            return self.endpoint_name

        except Exception as e:
            print(f"Error deploying model: {str(e)}")
            return None

    def load_endpoint(self, endpoint_name):
        """Load an existing endpoint"""
        try:
            # Verify the endpoint exists
            sagemaker_client = boto3.client('sagemaker')
            sagemaker_client.describe_endpoint(EndpointName=endpoint_name)
            self.endpoint_name = endpoint_name
            print(f"Successfully loaded endpoint: {endpoint_name}")
            return True
        except Exception as e:
            print(f"Error loading endpoint: {str(e)}")
            return False

    def get_prediction(self, medical_report, doctor_note, patient_question):
        """Make inference using the deployed model"""
        if not self.endpoint_name:
            raise Exception("No endpoint available. Please deploy model or load endpoint first.")

        try:
            # Create the prompt
            prompt = self.create_medical_prompt(medical_report, doctor_note, patient_question)
            
            # Prepare payload
            payload = {
                "inputs": prompt
            }
            
            # Make the prediction
            response = self.runtime_client.invoke_endpoint(
                EndpointName=self.endpoint_name,
                ContentType='application/json',
                Body=json.dumps(payload)
            )
            
            # Process the result
            result = json.loads(response['Body'].read().decode())
            
            if isinstance(result, list):
                result = result[0]
            if isinstance(result, dict) and 'generated_text' in result:
                result = result["generated_text"][len(prompt):]
                
            return result
        
        except Exception as e:
            print(f"Error making prediction: {str(e)}")
            return None
