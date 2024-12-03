from flask import Flask
from flask_cors import CORS
from backend.routes.chat_routes import chat_routes
from backend.routes.patient_routes import patient_bp
from backend.routes.auth_routes import auth_bp
from backend.routes.doctor_routes import doctor_bp

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["OPTIONS", "POST", "GET"],
        "allow_headers": ["Content-Type"]
    }
})

app.register_blueprint(auth_bp)
app.register_blueprint(chat_routes)
app.register_blueprint(patient_bp)
app.register_blueprint(doctor_bp)

@app.route('/')
def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
