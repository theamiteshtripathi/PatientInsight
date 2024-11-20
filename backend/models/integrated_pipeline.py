from backend.models.HealthcareLLMChat.src.model.chat_pipeline import ChatPipeline
from backend.models.utils.mlflow_experiment_tracker import MLflowExperimentTracker
from backend.models.RAG.src.main import main as rag_main
from backend.config.config import Config
import time

class IntegratedPipeline:
    def __init__(self, api_key: str = None):
        self.chat_pipeline = ChatPipeline(api_key)
        self.mlflow_tracker = MLflowExperimentTracker()

    def _get_summary_prompt(self):
        return """
        Please provide a concise summary of the patient's symptoms and concerns 
        in a structured format including:
        - Primary symptoms
        - Duration
        - Intensity
        - Associated symptoms
        - Triggers or factors that worsen/improve symptoms
        """
    
    def _get_doctor_report_prompt(self):
        return """
        Based on the patient's symptoms, please provide:
        1. Initial assessment
        2. Potential diagnoses to consider
        3. Recommended next steps or immediate actions
        4. Red flags or warning signs to monitor
        """
        
    def run_conversation_and_analysis(self):
        # Start MLflow tracking
        self.mlflow_tracker.start_run()
        start_time = time.time()
        
        # Start chat conversation
        print("Assistant:", self.chat_pipeline.start_conversation())
        
        while True:
            user_input = input("\nUser: ")
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                # Generate summary and analysis
                summary = self.chat_pipeline.generate_summary()
                medical_analysis = rag_main(summary)
                
                # Print outputs
                print("\nSYMPTOM SUMMARY:")
                print(summary)
                print("\nMEDICAL ANALYSIS:")
                print(medical_analysis)
                
                # Prepare MLflow data
                metrics = {
                    "num_retrieved_samples": Config.N_RESULTS,
                }
                
                parameters = {
                    "summarization_model": "gpt-4o-mini",
                    "embedding_model": Config.EMBEDDING_MODEL_NAME,
                    "n_results": Config.N_RESULTS
                }
                
                artifacts = {
                    "summary_prompt": self._get_summary_prompt(),
                    "doctor_report_prompt": self._get_doctor_report_prompt(),
                    "pipeline_output": f"SYMPTOM SUMMARY:\n{summary}\n\nMEDICAL ANALYSIS:\n{medical_analysis}",
                    "conversation_history": self.chat_pipeline.conversation_manager.get_messages()
                }
                
                # End MLflow run
                self.mlflow_tracker.end_run(metrics, parameters, artifacts)
                break
            
            # Continue conversation
            response = self.chat_pipeline.get_response(user_input)
            print("Assistant:", response)

if __name__ == "__main__":
    Config.validate_env_vars()
    pipeline = IntegratedPipeline(Config.OPENAI_API_KEY)
    pipeline.run_conversation_and_analysis() 