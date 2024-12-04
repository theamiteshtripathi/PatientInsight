from flask import Flask
from flask_cors import CORS
from routes.chat_routes import chat_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://frontend-service"]}})

app.register_blueprint(chat_routes)

@app.route('/')
def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
