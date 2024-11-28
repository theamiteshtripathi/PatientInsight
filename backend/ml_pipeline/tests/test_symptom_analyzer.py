import pytest
import sys
from pathlib import Path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))
from unittest.mock import Mock, patch
from backend.ml_pipeline.HealthcareLLMChat.model.symptom_analyzer import SymptomAnalyzer
from backend.config.config import Config

@pytest.fixture
def mock_openai():
    with patch('src.model.symptom_analyzer.OpenAI') as mock:
        # Create a mock response structure
        mock_response = Mock()
        mock_response.choices = [
            Mock(message=Mock(content="Mocked summary response"))
        ]
        
        # Configure the mock client
        mock_instance = mock.return_value
        mock_instance.chat.completions.create.return_value = mock_response
        yield mock

@pytest.fixture
def analyzer():
    return SymptomAnalyzer("fake-api-key")

def test_generate_summary(analyzer, mock_openai):
    # Sample conversation history
    conversation = [
        {"role": "user", "content": "I have a headache"},
        {"role": "assistant", "content": "How long have you had this headache?"},
        {"role": "user", "content": "Since yesterday"}
    ]
    
    # Call the method
    result = analyzer.generate_summary(conversation)
    
    # Assertions
    assert result == "Mocked summary response"
    mock_openai.return_value.chat.completions.create.assert_called_once_with(
        model=Config.GENERATIVE_MODEL_NAME,
        messages=conversation + [{"role": "system", "content": analyzer.summary_prompt}]
    ) 