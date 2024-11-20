#CICD
from backend.models.integrated_pipeline import IntegratedPipeline
from backend.config.config import Config

def evaluate_pipeline():
    # Test cases that represent typical conversations
    test_cases = [
        {
            "inputs": [
                "I've been having severe headaches",
                "They occur in the morning",
                "Yes, with nausea",
                "bye"
            ],
            "expected_symptoms": ["headache", "morning", "nausea"]
        }
    ]
    
    # Run each test case through the pipeline
    pipeline = IntegratedPipeline(Config.OPENAI_API_KEY)
    
    for test_case in test_cases:
        # Mock user inputs
        inputs = iter(test_case["inputs"])
        def mock_input(_):
            return next(inputs)
            
        # Run conversation
        pipeline.run_conversation_and_analysis()
        
        # Verify outputs contain expected symptoms
        # Add your verification logic here

if __name__ == "__main__":
    evaluate_pipeline() 