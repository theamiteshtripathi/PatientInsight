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
