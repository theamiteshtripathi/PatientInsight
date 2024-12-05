from flask import Blueprint, request, jsonify
from langchain_community.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from backend.config.config import Config

chat_llm_bp = Blueprint('chat_llm', __name__)

# Store chat sessions
chat_sessions = {}

def create_llm_chain():
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7,
        openai_api_key=Config.OPENAI_API_KEY
    )
    
    medical_report = """- Blood Pressure: 140/90 mmHg
    - Cholesterol Levels: LDL - 160 mg/dL, HDL - 40 mg/dL
    - Blood Sugar: Fasting - 110 mg/dL
    - Heart Rate: 85 bpm"""
 
    doctor_note = """Blood pressure is slightly elevated, and your LDL cholesterol levels are high, 
    which puts you at risk for cardiovascular issues. You should consider lifestyle changes like 
    a healthier diet and more exercise. Follow up after 3 months."""
    
    template = """You are a medical AI assistant who is an expert in healthcare domain, specifically designed to help patients understand their medical reports and test results. Use precise medical terminology while still aiming to make the explanation clear and accessible to a general audience.
 
    INSTRUCTIONS:
    1. You must ONLY discuss information from the provided medical report and doctor's notes.
    2. For ANY question not directly related to the provided medical report or doctor's notes, you must respond EXACTLY with this message: "I can only help you understand your medical report. Would you like to ask about your test results or the doctor's recommendations?"
    3. DO NOT provide any other information or assistance outside of the medical context, even if you know the answer.
    4. Always provide clear and concise answers without hallucinating.
    5. Format your responses in this way:
       - Start with a direct answer to the question
       - Provide relevant context from the medical report
       - Reference the doctor's recommendations when applicable
       - Keep responses concise but complete
    6. For sensitive medical information, remind the patient to verify important details with their healthcare provider.
 
    Medical Context:
    Medical Report: {medical_report}
    Doctor's Note: {doctor_note}
 
    Previous conversation:
    {chat_history}
 
    Patient: {user_input}
    Assistant: """
    
    prompt = PromptTemplate(
        input_variables=["medical_report", "doctor_note", "chat_history", "user_input"],
        template=template
    )
    
    memory = ConversationBufferMemory(input_key="user_input", memory_key="chat_history")
    
    return LLMChain(
        llm=llm,
        prompt=prompt,
        memory=memory,
        verbose=True
    ), medical_report, doctor_note

@chat_llm_bp.route('/chat_llm/start', methods=['POST'])
def start_chat():
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if not session_id:
            return jsonify({'status': 'error', 'error': 'Session ID is required'}), 400
            
        chain, medical_report, doctor_note = create_llm_chain()
        chat_sessions[session_id] = {
            'chain': chain,
            'medical_report': medical_report,
            'doctor_note': doctor_note
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
            medical_report=session['medical_report'],
            doctor_note=session['doctor_note']
        )
        
        return jsonify({
            'status': 'success',
            'message': response.strip()
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500