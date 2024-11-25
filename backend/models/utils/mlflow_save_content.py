import mlflow
import tempfile
import os

def save_content_as_artifact(content: str, artifact_path: str) -> None:
    """
    Save content to a temporary file and log it as an MLflow artifact.
    
    Args:
        content: String content to save
        artifact_path: Desired path/name for the artifact in MLflow
    """
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
        f.write(content)
        temp_path = f.name

    mlflow.log_artifact(temp_path, artifact_path)
    os.unlink(temp_path) 