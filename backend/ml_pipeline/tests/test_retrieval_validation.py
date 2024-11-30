import pytest
import sys
from pathlib import Path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))
from backend.ml_pipeline.integrated_pipeline import IntegratedPipeline
from backend.config.config import Config

RETRIEVAL_SCORE_THRESHOLD = 0.5

class TestRetrievalValidation:
    def test_retrieval_scores(self):
        # Initialize pipeline
        pipeline = IntegratedPipeline(Config.OPENAI_API_KEY)
        
        # Test scenarios to validate
        test_conversations = {
            "headache": [
                "I've been having severe headaches",
                "They're worse in the morning and light makes them worse",
                "No previous history of migraines",
                "bye"
            ],
            "chest_pain": [
                "I've been having chest pain for the last 2 days",
                "The pain is sharp and gets worse when I breathe deeply",
                "No fever or cough",
                "bye"
            ]
        }

        failed_scenarios = []
        
        for scenario, conversation in test_conversations.items():
            # Mock input function for this conversation
            conversation_iter = iter(conversation)
            def mock_input(_):
                return next(conversation_iter)
            
            # Replace standard input with mock
            import builtins
            original_input = builtins.input
            builtins.input = mock_input
            
            try:
                # Run the conversation until 'bye'
                pipeline.chat_pipeline.start_conversation()
                for message in conversation[:-1]:  # All messages except 'bye'
                    pipeline.chat_pipeline.get_response(message)
                
                # Generate summary and get RAG analysis
                summary = pipeline.chat_pipeline.generate_summary()
                from backend.ml_pipeline.RAG.main import main as rag_main
                medical_analysis_response = rag_main(summary)
                
                # Get retrieval scores directly from the response
                retrieval_scores = medical_analysis_response.get('retrieval_scores', [])
                
                # Validate each retrieval score
                for i, score in enumerate(retrieval_scores, 1):
                    if score < RETRIEVAL_SCORE_THRESHOLD:
                        failed_scenarios.append(
                            f"{scenario} - Document {i}: score {score:.3f}"
                        )
                
            finally:
                # Restore original input function
                builtins.input = original_input
        
        # Assert no scenarios failed
        assert not failed_scenarios, (
            f"The following scenarios had retrieval scores below {RETRIEVAL_SCORE_THRESHOLD}:\n"
            + "\n".join(failed_scenarios)
        )

if __name__ == "__main__":
    Config.validate_env_vars()
    pytest.main([__file__])