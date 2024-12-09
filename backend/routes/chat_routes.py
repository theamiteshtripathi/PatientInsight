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
from datetime import datetime as dt
import uuid
from reportlab.pdfgen import canvas
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

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
        
        chat_instance = chat_instances[session_id]
        
        # Check if user wants to end chat
        if message.lower() in ['quit', 'exit', 'bye']:
            try:
                summary = chat_instance.chat_pipeline.generate_summary()
                medical_analysis_response = rag_main(summary)
                medical_analysis = medical_analysis_response['content']
                
                # Create PDF content
                def create_pdf(output):
                    doc = SimpleDocTemplate(
                        output,
                        pagesize=letter,
                        rightMargin=72,
                        leftMargin=72,
                        topMargin=72,
                        bottomMargin=72
                    )

                    # Create styles
                    styles = getSampleStyleSheet()
                    title_style = ParagraphStyle(
                        'CustomTitle',
                        parent=styles['Heading1'],
                        fontSize=20,
                        alignment=1,  # Center alignment
                        spaceAfter=30
                    )
                    
                    heading_style = ParagraphStyle(
                        'CustomHeading',
                        parent=styles['Heading2'],
                        fontSize=14,
                        spaceAfter=12,
                        spaceBefore=12
                    )
                    
                    normal_style = ParagraphStyle(
                        'CustomNormal',
                        parent=styles['Normal'],
                        fontSize=12,
                        spaceAfter=12
                    )

                    # Build content
                    story = []
                    
                    # Title
                    story.append(Paragraph("Medical Analysis Report", title_style))
                    
                    # Timestamp
                    timestamp = dt.now().strftime('%Y-%m-%d %H:%M:%S')
                    story.append(Paragraph(f"Generated on: {timestamp}", normal_style))
                    story.append(Spacer(1, 20))
                    
                    # Chat Summary
                    story.append(Paragraph("Chat Summary:", heading_style))
                    # Clean and format summary text
                    clean_summary = summary.replace('###', '')\
                                         .replace('**', '')\
                                         .replace('- -', '-')\
                                         .strip()
                    
                    for line in clean_summary.split('\n'):
                        if line.strip():
                            story.append(Paragraph(line.strip(), normal_style))
                    
                    story.append(Spacer(1, 20))
                    
                    # Medical Analysis
                    story.append(Paragraph("Medical Analysis:", heading_style))
                    # Clean and format medical analysis text
                    clean_analysis = medical_analysis.replace('###', '')\
                                                   .replace('**', '')\
                                                   .replace('- -', '-')\
                                                   .strip()
                    
                    for line in clean_analysis.split('\n'):
                        if line.strip():
                            story.append(Paragraph(line.strip(), normal_style))

                    # Build the PDF
                    doc.build(story)

                # Create PDF for database
                buffer = BytesIO()
                create_pdf(buffer)
                pdf_data = buffer.getvalue()
                
                # Create local file
                timestamp = dt.now().strftime('%Y-%m-%d_%H-%M-%S')
                local_filename = f"medical_report_{timestamp}.pdf"
                reports_dir = os.path.join('backend', 'ml_pipeline', 'reports')
                os.makedirs(reports_dir, exist_ok=True)
                local_filepath = os.path.join(reports_dir, local_filename)
                
                # Create local PDF file
                with open(local_filepath, 'wb') as f:
                    create_pdf(f)
                
                # Store in database
                conn = get_db_connection()
                cur = conn.cursor(cursor_factory=RealDictCursor)
                
                cur.execute("""
                    INSERT INTO patient_reports 
                    (user_id, report_name, report_data, report_type, description)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    user_id,
                    local_filename,
                    psycopg2.Binary(pdf_data),
                    'chat_summary',
                    'AI Chat Conversation Summary'
                ))
                
                report_id = cur.fetchone()['id']
                conn.commit()
                
                cur.close()
                conn.close()
                
                return jsonify({
                    'status': 'chat_ended',
                    'summary': summary,
                    'medical_analysis': medical_analysis,
                    'report_id': report_id
                })
                
            except Exception as e:
                print(f"Error generating summary: {str(e)}")
                import traceback
                traceback.print_exc()
                return jsonify({'status': 'error', 'error': str(e)}), 500
        
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
        
        print(f"Attempting to store report - User ID: {user_id}, Path: {report_path}")
        
        if not user_id or not report_path:
            return jsonify({"error": "user_id and report_path are required"}), 400
            
        if not os.path.exists(report_path):
            print(f"File not found at path: {report_path}")
            return jsonify({"error": "Report file not found"}), 404
            
        try:
            # Read the PDF file in binary mode
            with open(report_path, 'rb') as file:
                pdf_data = file.read()
                
            # Verify it's a valid PDF
            if not pdf_data.startswith(b'%PDF'):
                print("Warning: File does not appear to be a valid PDF!")
                
            print(f"Successfully read PDF file, size: {len(pdf_data)} bytes")
            
            # Debug: Save first few bytes
            print(f"First 20 bytes of PDF: {pdf_data[:20]}")
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            report_name = f"Chat_Summary_{dt.now().strftime('%Y-%m-%d_%H-%M-%S')}"
            print(f"Generated report name: {report_name}")
            
            # Use psycopg2.Binary for proper binary data handling
            binary_data = psycopg2.Binary(pdf_data)
            
            insert_query = """
            INSERT INTO patient_reports 
            (user_id, report_name, report_data, report_type, description)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
            """
            
            cur.execute(insert_query, (
                user_id,
                report_name,
                binary_data,
                'chat_summary',
                'AI Chat Conversation Summary'
            ))
            
            report_id = cur.fetchone()['id']
            conn.commit()
            
            print(f"Successfully stored report with ID: {report_id}")
            
            # Verify the stored data
            cur.execute("SELECT report_data FROM patient_reports WHERE id = %s", (report_id,))
            stored_data = cur.fetchone()
            if stored_data:
                print(f"Verified stored data size: {len(stored_data['report_data'])} bytes")
            
            cur.close()
            conn.close()
            
            # Clean up the temporary file
            os.remove(report_path)
            print(f"Cleaned up temporary file: {report_path}")
            
            return jsonify({
                "message": "Report stored successfully",
                "report_id": report_id
            }), 201
            
        except IOError as e:
            print(f"Error reading file: {str(e)}")
            return jsonify({"error": f"Error reading PDF file: {str(e)}"}), 500
            
        except psycopg2.Error as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
