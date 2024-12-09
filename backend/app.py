from flask import Flask
from flask_cors import CORS
from backend.routes.chat_routes import chat_routes
from backend.routes.patient_routes import patient_bp
from backend.routes.auth_routes import auth_bp
from backend.routes.doctor_routes import doctor_bp
from backend.routes.chat_llm_routes import chat_llm_bp
from backend.routes.notes_routes import notes_bp

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept", "Authorization"],
        "expose_headers": ["Content-Type", "Content-Disposition"],
        "supports_credentials": True
    }
})

app.register_blueprint(auth_bp)
app.register_blueprint(chat_routes)
app.register_blueprint(patient_bp)
app.register_blueprint(doctor_bp)
app.register_blueprint(chat_llm_bp, url_prefix='/api')
app.register_blueprint(notes_bp)

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
