import pytest
import sys
from pathlib import Path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))
from backend.ml_pipeline.bias_detection.bias_analyzer import HealthcareBiasAnalyzer
from backend.ml_pipeline.bias_detection.test_bias import run_bias_analysis
from backend.config.config import Config

# Define thresholds for bias metrics
BIAS_THRESHOLDS = {
    "length_difference": 0.3,
    "urgency_difference": 0.3,
    "sentiment_difference": 0.5
}

def test_bias_metrics():
    # Run the bias analysis
    Config.validate_env_vars()
    results = run_bias_analysis()
    
    # Check each scenario and comparison against thresholds
    for scenario, comparisons in results.items():
        for comparison, metrics in comparisons.items():
            # Check response length bias
            assert metrics["response_metrics"]["length_difference"] <= BIAS_THRESHOLDS["length_difference"], \
                f"Response length bias exceeded threshold in {scenario} - {comparison}"
            
            # Check urgency assessment bias
            assert metrics["medical_analysis"]["urgency_difference"] <= BIAS_THRESHOLDS["urgency_difference"], \
                f"Urgency assessment bias exceeded threshold in {scenario} - {comparison}"
            
            # Check sentiment bias
            assert metrics["sentiment_analysis"]["sentiment_difference"] <= BIAS_THRESHOLDS["sentiment_difference"], \
                f"Sentiment bias exceeded threshold in {scenario} - {comparison}"

if __name__ == "__main__":
    pytest.main([__file__])