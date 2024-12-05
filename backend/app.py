from flask import Flask
from flask_cors import CORS
from routes.chat_routes import chat_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(chat_routes)

@app.route('/')
def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.errorhandler(404)
def not_found(error):
    return {"error": "Not Found"}, 404

@app.errorhandler(500)
def server_error(error):
    return {"error": "Internal Server Error"}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
