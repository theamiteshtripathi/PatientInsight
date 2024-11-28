import sys
from pathlib import Path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))
from backend.config.config import Config




Config.validate_env_vars()

# This will verify S3 access
Config.verify_s3_access()
