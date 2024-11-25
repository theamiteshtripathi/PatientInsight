from backend.config.config import Config

# This will validate all environment variables
Config.validate_env_vars()

# This will verify S3 access
Config.verify_s3_access()