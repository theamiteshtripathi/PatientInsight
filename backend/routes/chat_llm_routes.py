from flask import Blueprint, request, jsonify
from langchain_community.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from backend.config.config import Config
import psycopg2
from psycopg2.extras import RealDictCursor
import os

chat_llm_bp = Blueprint('chat_llm', __name__)

# Store chat sessions
chat_sessions = {}

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('PATIENT_DB_HOST'),
        database=os.getenv('PATIENT_DB_NAME'),
        user=os.getenv('PATIENT_DB_USER'),
        password=os.getenv('PATIENT_DB_PASSWORD'),
        port=os.getenv('PATIENT_DB_PORT')
    )

def get_user_medical_data(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get the latest record for the user
        cur.execute("""
            SELECT medicine_notes, prescription 
            FROM doctor_notes 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT 1
        """, (user_id,))
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if result:
            return result['medicine_notes'], result['prescription']
        return None, None
    except Exception as e:
        print(f"Database error: {str(e)}")
        return None, None

def create_llm_chain(user_id):
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7,
        openai_api_key=Config.OPENAI_API_KEY
    )
    
    # Fetch user's medical data
    medical_notes, prescription = get_user_medical_data(user_id)
    
    if not medical_notes or not prescription:
        raise Exception("No medical data found for this user")
    
    template = """You are a medical AI assistant who is an expert in healthcare domain, specifically designed to help patients understand their medical reports and test results. Use precise medical terminology while still aiming to make the explanation clear and accessible to a general audience.
 
    INSTRUCTIONS:
    1. You must ONLY discuss information from the provided medical report and doctor's notes and answer to patient's questions.
    2. If there is any question which is not related to the medical report or doctor's notes, redirect the patient to ask questions related to the medical report or doctor's notes.
    3. DO NOT provide any other information or assistance outside of the medical context, even if you know the answer.
    4. Always provide clear and concise answers without hallucinating.
    5. Format your responses in this way:
       - Start with a direct answer to the question
       - Provide relevant context from the medical report
       - Reference the doctor's recommendations when applicable
       - Keep responses concise but complete
    6. For sensitive medical information, remind the patient to verify important details with their healthcare provider.
 
    Medical Context:
    Medical Report: {medical_notes}
    Doctor's Note: {prescription}
 
    Previous conversation:
    {chat_history}
 
    Patient: {user_input}
    Assistant: """
    
    prompt = PromptTemplate(
        input_variables=["medical_notes", "prescription", "chat_history", "user_input"],
        template=template
    )
    
    memory = ConversationBufferMemory(input_key="user_input", memory_key="chat_history")
    
    return LLMChain(
        llm=llm,
        prompt=prompt,
        memory=memory,
        verbose=True
    ), medical_notes, prescription

@chat_llm_bp.route('/chat_llm/start', methods=['POST'])
def start_chat():
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        user_id = data.get('user_id')  # Add user_id to request
        
        if not session_id or not user_id:
            return jsonify({'status': 'error', 'error': 'Session ID and User ID are required'}), 400
            
        chain, medical_notes, prescription = create_llm_chain(user_id)
        chat_sessions[session_id] = {
            'chain': chain,
            'medical_report': medical_notes,
            'doctor_note': prescription,
            'user_id': user_id  # Store user_id in session
        }
        
        return jsonify({
            'status': 'success',
            'message': "Welcome! I'm your medical AI assistant. I have access to your medical report and doctor's notes. How can I help you understand your health condition?"
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@chat_llm_bp.route('/chat_llm/message', methods=['POST'])
def chat_message():
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        user_message = data.get('message')
        
        if not session_id or not user_message:
            return jsonify({'status': 'error', 'error': 'Session ID and message are required'}), 400
            
        session = chat_sessions.get(session_id)
        if not session:
            return jsonify({'status': 'error', 'error': 'Session not found'}), 404
            
        response = session['chain'].predict(
            user_input=user_message,
            medical_notes=session['medical_report'],
            prescription=session['doctor_note'],
            chat_history=""
        )
        
        return jsonify({
            'status': 'success',
            'message': response.strip()
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500