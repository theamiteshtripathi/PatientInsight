from backend.app import app
from backend.config.config import Config

if __name__ == "__main__":
    Config.validate_env_vars()
    app.run(host='0.0.0.0', port=8000, debug=True) 