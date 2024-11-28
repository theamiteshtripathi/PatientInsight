import pytest
import sys
from pathlib import Path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))
from unittest.mock import Mock, patch, MagicMock
from backend.ml_pipeline.integrated_pipeline import IntegratedPipeline
from backend.config.config import Config

@pytest.fixture
def mock_dependencies():
    with patch('backend.ml_pipeline.integrated_pipeline.ChatPipeline') as mock_chat, \
         patch('backend.ml_pipeline.integrated_pipeline.MLflowExperimentTracker') as mock_mlflow, \
         patch('backend.ml_pipeline.integrated_pipeline.rag_main') as mock_rag, \
         patch('backend.ml_pipeline.integrated_pipeline.SymptomAnalyzer') as mock_analyzer, \
         patch('backend.ml_pipeline.integrated_pipeline.Generator') as mock_generator:
        
        # Setup mock returns
        mock_chat.return_value.start_conversation.return_value = "Hello, how can I help you today?"
        mock_chat.return_value.get_response.return_value = "I understand your symptoms."
        mock_chat.return_value.generate_summary.return_value = "Patient reports headache"
        mock_chat.return_value.get_conversation_history.return_value = [
            {"role": "assistant", "content": "Hello"},
            {"role": "user", "content": "I have a headache"},
        ]
        
        mock_rag.return_value = {
            'content': 'Medical analysis result',
            'retrieved_documents': ['doc1', 'doc2'],
            'retrieval_scores': [0.8, 0.7],
            'usage': {
                'input_cost': 0.01,
                'output_cost': 0.02,
                'total_cost': 0.03,
                'prompt_tokens': 100,
                'completion_tokens': 50,
                'total_tokens': 150
            }
        }
        
        mock_analyzer.return_value.summary_prompt = "Summary prompt"
        mock_generator.DOCTOR_REPORT_PROMPT = "Doctor report prompt"
        
        yield {
            'chat': mock_chat,
            'mlflow': mock_mlflow,
            'rag': mock_rag,
            'analyzer': mock_analyzer,
            'generator': mock_generator
        }

@pytest.fixture
def pipeline(mock_dependencies):
    return IntegratedPipeline(api_key="test-key")

def test_pipeline_initialization(pipeline, mock_dependencies):
    assert pipeline.chat_pipeline is not None
    assert pipeline.mlflow_tracker is not None

def test_get_summary_prompt(pipeline):
    result = pipeline._get_summary_prompt()
    assert result == "Summary prompt"

def test_get_doctor_report_prompt(pipeline):
    result = pipeline._get_doctor_report_prompt()
    assert result == "Doctor report prompt"

@patch('builtins.input', side_effect=['I have a headache', 'quit'])
@patch('builtins.print')
def test_run_conversation_and_analysis(mock_print, mock_input, pipeline, mock_dependencies):
    # Run the conversation
    pipeline.run_conversation_and_analysis()
    
    # Verify chat pipeline interactions
    mock_dependencies['chat'].return_value.start_conversation.assert_called_once()
    mock_dependencies['chat'].return_value.get_response.assert_called_once_with('I have a headache')
    mock_dependencies['chat'].return_value.generate_summary.assert_called_once()
    
    # Verify MLflow tracking
    mlflow_mock = mock_dependencies['mlflow'].return_value
    mlflow_mock.start_run.assert_called_once()
    mlflow_mock.end_run.assert_called_once()
    
    # Verify the end_run parameters
    end_run_args = mlflow_mock.end_run.call_args[0]
    metrics, parameters, artifacts = end_run_args
    
    # Check metrics
    assert metrics['num_retrieved_samples'] == Config.N_RESULTS
    assert metrics['total_cost'] == 0.03
    assert metrics['retrieval_score_1'] == 0.8
    assert metrics['retrieval_score_2'] == 0.7
    
    # Check parameters
    assert parameters['summarization_model'] == Config.GENERATIVE_MODEL_NAME
    assert parameters['embedding_model'] == Config.EMBEDDING_MODEL_NAME
    
    # Check artifacts
    assert "SYMPTOM SUMMARY" in artifacts['pipeline_output']
    assert "MEDICAL ANALYSIS" in artifacts['pipeline_output']

def test_pipeline_error_handling(pipeline):
   
    pass