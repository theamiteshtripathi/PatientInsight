from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
from backend.ml_pipeline.chat_integration import ChatIntegration
from backend.config.config import Config
from backend.ml_pipeline.RAG.main import main as rag_main
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import io
import datetime
import uuid

chat_routes = Blueprint('chat_routes', __name__)
chat_instances = {}

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('PATIENT_DB_HOST'),
        database=os.getenv('PATIENT_DB_NAME'),
        user=os.getenv('PATIENT_DB_USER'),
        password=os.getenv('PATIENT_DB_PASSWORD'),
        port=os.getenv('PATIENT_DB_PORT')
    )

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
def chat_message():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        message = data.get('message')
        chat_history = data.get('chatHistory', [])
        
        # Generate a session ID if not provided
        session_id = data.get('session_id') or str(uuid.uuid4())
        
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
                
                # After generating the chat response, store it in the database
                try:
                    conn = get_db_connection()
                    cur = conn.cursor()
                    
                    # Store chat summary as PDF
                    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
                    report_name = f"Chat_Summary_{current_time}"
                    
                    # Convert chat history to bytes for storage
                    chat_text = "\n".join([f"{msg.get('role', 'unknown')}: {msg.get('content', '')}" 
                                         for msg in chat_history])
                    
                    cur.execute("""
                        INSERT INTO patient_reports 
                        (user_id, report_name, report_data, report_type, description)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (
                        user_id,
                        report_name,
                        chat_text.encode('utf-8'),  # Convert text to bytes
                        'chat_summary',
                        f'AI Chat Conversation Summary - Session {session_id}'
                    ))
                    
                    conn.commit()
                    print(f"Chat summary stored in database for user {user_id}")
                    
                    cur.close()
                    conn.close()
                    
                except Exception as e:
                    print("Error storing chat summary:", str(e))
                
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

@chat_routes.route('/api/save-report', methods=['POST'])
@cross_origin()
def save_report():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        report_path = data.get('report_path')
        report_name = data.get('report_name', 'Chat Summary')
        report_type = data.get('report_type', 'chat_summary')
        description = data.get('description', '')

        # Debug: Check if the file path is correct
        print(f"Attempting to read file from: {report_path}")

        # Read the PDF file
        with open(report_path, 'rb') as file:
            pdf_data = file.read()

        # Debug: Check if the file was read successfully
        print(f"Read {len(pdf_data)} bytes from the PDF file")

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Insert the report into the database
        insert_query = """
        INSERT INTO patient_reports 
        (user_id, report_name, report_data, report_type, description)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """
        
        cur.execute(insert_query, (
            user_id,
            report_name,
            pdf_data,
            report_type,
            description
        ))

        report_id = cur.fetchone()['id']
        conn.commit()

        # Debug: Confirm the report was saved
        print(f"Report saved with ID: {report_id}")

        # Delete the local file after storing in database
        os.remove(report_path)

        cur.close()
        conn.close()

        return jsonify({
            "message": "Report saved successfully",
            "report_id": report_id
        }), 201

    except Exception as e:
        print("Error saving report:", str(e))
        return jsonify({"error": str(e)}), 500

@chat_routes.route('/api/reports/<int:user_id>', methods=['GET'])
@cross_origin()
def get_user_reports(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Get all reports for the user (without the PDF data)
        cur.execute("""
            SELECT id, report_name, created_at, report_type, description
            FROM patient_reports
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))

        reports = cur.fetchall()
        cur.close()
        conn.close()

        return jsonify(reports), 200

    except Exception as e:
        print("Error fetching reports:", str(e))
        return jsonify({"error": str(e)}), 500

@chat_routes.route('/api/reports/download/<int:report_id>', methods=['GET'])
@cross_origin()
def download_report(report_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Get the report data
        cur.execute("""
            SELECT report_data, report_name
            FROM patient_reports
            WHERE id = %s
        """, (report_id,))

        report = cur.fetchone()
        cur.close()
        conn.close()

        if not report:
            return jsonify({"error": "Report not found"}), 404

        # Create a BytesIO object from the PDF data
        pdf_data = io.BytesIO(report['report_data'])
        
        return send_file(
            pdf_data,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{report['report_name']}.pdf"
        )

    except Exception as e:
        print("Error downloading report:", str(e))
        return jsonify({"error": str(e)}), 500

@chat_routes.route('/api/generate-report', methods=['POST'])
@cross_origin()
def generate_report():
    try:
        data = request.get_json()
        chat_history = data.get('messages', [])
        user_id = data.get('user_id')

        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        result = generate_pdf_report(chat_history, user_id)

        if result['success']:
            return jsonify({
                "message": "Report generated successfully",
                "report_id": result['report_id']
            }), 201
        else:
            return jsonify({"error": result['error']}), 500

    except Exception as e:
        print("Error generating report:", str(e))
        return jsonify({"error": str(e)}), 500

@chat_routes.route('/api/store-report', methods=['POST'])
@cross_origin()
def store_report():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        report_path = data.get('report_path')
        
        print(f"Received request - User ID: {user_id}, Report Path: {report_path}")
        
        if not user_id or not report_path:
            return jsonify({"error": "user_id and report_path are required"}), 400
            
        if not os.path.exists(report_path):
            print(f"File not found at path: {report_path}")
            return jsonify({"error": "Report file not found"}), 404
            
        with open(report_path, 'rb') as file:
            pdf_data = file.read()
            print(f"Successfully read PDF file, size: {len(pdf_data)} bytes")
            
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        insert_query = """
        INSERT INTO patient_reports 
        (user_id, report_name, report_data, report_type, description)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """
        
        report_name = f"Chat Summary - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        print(f"Executing database insert for report: {report_name}")
        
        cur.execute(insert_query, (
            user_id,
            report_name,
            pdf_data,
            'chat_summary',
            'AI Chat Conversation Summary'
        ))
        
        report_id = cur.fetchone()['id']
        conn.commit()
        
        print(f"Successfully stored report with ID: {report_id}")
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Report stored in database successfully",
            "report_id": report_id
        }), 201
        
    except Exception as e:
        print("Error storing report:", str(e))
        import traceback
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
