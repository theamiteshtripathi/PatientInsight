
    import sys
from pathlib import Path
# Add the project root directory to the Python path
root_path = Path(__file__).parent.parent.absolute()
sys.path.append(str(root_path))
 
from backend.app import app
from backend.config.config import Config
 
@app.errorhandler(404)
def not_found(error):
    return {"error": "Not Found"}, 404
 
@app.errorhandler(500)
def server_error(error):
    return {"error": "Internal Server Error"}, 500
 
if __name__ == "__main__":
    Config.validate_env_vars()
    app.run(host='0.0.0.0', port=8000, debug=True)