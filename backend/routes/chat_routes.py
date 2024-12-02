from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from backend.ml_pipeline.chat_integration import ChatIntegration
from backend.config.config import Config
from backend.ml_pipeline.RAG.main import main as rag_main

chat_routes = Blueprint('chat_routes', __name__)
chat_instances = {}

@chat_routes.route('/api/chat/start', methods=['POST'])
@cross_origin()
def start_chat():
    try:
        session_id = request.json.get('session_id')
        chat_instances[session_id] = ChatIntegration(Config.OPENAI_API_KEY)
        initial_message = chat_instances[session_id].chat_pipeline.start_conversation()
        return jsonify({'status': 'success', 'message': initial_message})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@chat_routes.route('/api/chat/message', methods=['POST'])
@cross_origin()
def send_message():
    try:
        session_id = request.json.get('session_id')
        message = request.json.get('message')
        
        if session_id not in chat_instances:
            return jsonify({'status': 'error', 'error': 'Chat session not found'}), 404
            
        chat_instance = chat_instances[session_id]
        
        # Check if user wants to end chat
        if message.lower() in ['quit', 'exit', 'bye']:
            try:
                summary = chat_instance.chat_pipeline.generate_summary()
                medical_analysis_response = rag_main(summary)
                medical_analysis = medical_analysis_response['content']
                
                # Generate PDF report
                pdf_file = chat_instance.generate_pdf(summary, medical_analysis)
                
                return jsonify({
                    'status': 'success',
                    'message': 'Chat ended',
                    'summary': summary,
                    'medical_analysis': medical_analysis,
                    'pdf_path': pdf_file
                })
            except Exception as e:
                return jsonify({
                    'status': 'error',
                    'error': f'Error generating report: {str(e)}'
                }), 500
        
        response = chat_instance.chat_pipeline.get_response(message)
        return jsonify({
            'status': 'success',
            'message': response
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500
