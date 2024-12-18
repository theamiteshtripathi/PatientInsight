from flask import Blueprint, jsonify, make_response, send_file, request
from flask_cors import cross_origin
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import psycopg2
import io
from reportlab.pdfgen import canvas
from io import BytesIO

load_dotenv()

doctor_bp = Blueprint('doctor', __name__)

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('PATIENT_DB_HOST'),
        database=os.getenv('PATIENT_DB_NAME'),
        user=os.getenv('PATIENT_DB_USER'),
        password=os.getenv('PATIENT_DB_PASSWORD'),
        port=os.getenv('PATIENT_DB_PORT')
    )

@doctor_bp.route('/api/doctor/dashboard-stats', methods=['GET'])
@cross_origin()
def get_dashboard_stats():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get total users count (excluding the first user which is doctor)
        cur.execute("""
            SELECT COUNT(*) as total_patients 
            FROM users 
            WHERE id != 1
        """)
        total_patients = cur.fetchone()['total_patients']
        
        total_appointments = total_patients  # For now, using same count
        
        # Get pending reports count
        cur.execute("""
            SELECT COUNT(*) as pending_reports 
            FROM patient_reports
        """)
        pending_reports = cur.fetchone()['pending_reports']
        
        cur.close()
        conn.close()
        
        return jsonify({
            'total_patients': total_patients,
            'total_appointments': total_appointments,
            'pending_reports': pending_reports
        }), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/api/doctor/patients', methods=['GET'])
@cross_origin()
def get_patients():
    try:
        timeframe = request.args.get('timeframe', 'all')
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Base query with common joins
        base_query = """
            SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.username,
                p.gender,
                p.medical_conditions,
                p.date_of_birth,
                COALESCE(
                    (SELECT MAX(created_at) 
                     FROM patient_reports 
                     WHERE user_id = u.id
                    ),
                    u.created_at
                ) as last_visit
            FROM users u
            LEFT JOIN patientsonboardingform p ON u.id = p.user_id
            WHERE u.id != 1
        """

        # Add timeframe filter
        if timeframe != 'all':
            if timeframe == '24h':
                base_query += " AND EXISTS (SELECT 1 FROM patient_reports pr WHERE pr.user_id = u.id AND pr.created_at >= NOW() - INTERVAL '24 hours')"
            elif timeframe == 'week':
                base_query += " AND EXISTS (SELECT 1 FROM patient_reports pr WHERE pr.user_id = u.id AND pr.created_at >= NOW() - INTERVAL '7 days')"
            elif timeframe == 'month':
                base_query += " AND EXISTS (SELECT 1 FROM patient_reports pr WHERE pr.user_id = u.id AND pr.created_at >= NOW() - INTERVAL '30 days')"

        # Add ordering
        base_query += " ORDER BY u.first_name, u.last_name"
        
        cur.execute(base_query)
        patients = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify(patients), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/api/doctor/patient/<int:patient_id>/details', methods=['GET'])
@cross_origin()
def get_patient_details(patient_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Modified query to return both user ID and onboarding form ID
        cur.execute("""
            SELECT 
                u.id as user_id,
                p.*
            FROM users u
            LEFT JOIN patientsonboardingform p ON u.id = p.user_id
            WHERE u.id = %s
        """, (patient_id,))
        
        details = cur.fetchone()
        cur.close()
        conn.close()
        
        if not details:
            return jsonify({"error": "Patient not found"}), 404
            
        return jsonify(details), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/api/doctor/patient/<int:user_id>/reports', methods=['GET'])
@cross_origin()
def get_patient_reports(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Updated table name from doctor_patient_report to patient_reports
        cur.execute("""
            SELECT id, report_name, created_at, report_type, description 
            FROM patient_reports 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (user_id,))
        
        reports = cur.fetchall()
        print(f"Fetching reports for user_id: {user_id}")
        
        cur.close()
        conn.close()
        
        return jsonify(reports), 200
        
    except Exception as e:
        print("Error in get_patient_reports:", str(e))
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/test', methods=['GET'])
@cross_origin()
def test_connection():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Test query
        cur.execute("SELECT COUNT(*) as count FROM users")
        result = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Connection successful",
            "user_count": result['count']
        }), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/api/reports/view/<int:report_id>', methods=['GET'])
@cross_origin()
def view_report(report_id):
    try:
        print(f"Fetching report ID: {report_id}")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT report_data, report_name, report_type 
            FROM patient_reports 
            WHERE id = %s
        """, (report_id,))
        
        report = cur.fetchone()
        
        if not report:
            print(f"Report {report_id} not found")
            return jsonify({"error": "Report not found"}), 404
            
        if not report['report_data']:
            print(f"Report {report_id} has no data")
            return jsonify({"error": "Report data is empty"}), 404
            
        # Convert report data to bytes if needed
        if isinstance(report['report_data'], memoryview):
            pdf_data = bytes(report['report_data'])
        else:
            pdf_data = report['report_data']
            
        print(f"PDF data size: {len(pdf_data)} bytes")
        
        # Verify PDF starts with PDF header
        if not pdf_data.startswith(b'%PDF'):
            print("Warning: Data does not start with PDF header")
            
        # Create response with proper headers
        response = make_response(pdf_data)
        response.headers.set('Content-Type', 'application/pdf')
        response.headers.set('Content-Disposition', f'inline; filename={report["report_name"]}')
        response.headers.set('Content-Length', len(pdf_data))
        
        # Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', '*')
        
        cur.close()
        conn.close()
        
        return response
        
    except Exception as e:
        print(f"Error viewing report: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/api/doctor/patient/report-pdf/<int:report_id>', methods=['GET'])
def get_patient_report_pdf(report_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Debug print
        print(f"Fetching PDF for report_id: {report_id}")
        
        # Get the PDF data
        cur.execute("""
            SELECT report_data, report_name, created_at 
            FROM patient_reports 
            WHERE id = %s
        """, (report_id,))
        
        result = cur.fetchone()
        if not result:
            print(f"No report found for id: {report_id}")
            return jsonify({"error": "Report not found"}), 404
            
        report_data, report_name, created_at = result
        print(f"Found report: {report_name}, created at: {created_at}")
        
        # Create response with PDF data
        response = make_response(bytes(report_data))
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'inline; filename="{report_name}"'
        response.headers['Access-Control-Allow-Origin'] = 'http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com'
        
        cur.close()
        conn.close()
        return response
        
    except Exception as e:
        print(f"Error in get_patient_report_pdf: {str(e)}")
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/api/doctor/patient/report-annotations/<int:report_id>', methods=['POST'])
def save_report_annotations(report_id):
    try:
        data = request.json
        annotations = data.get('annotations')
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Update the annotations in the database
        cur.execute("""
            UPDATE patient_reports 
            SET annotations = %s, 
                updated_at = NOW() 
            WHERE id = %s
            RETURNING id
        """, (annotations, report_id))
        
        updated = cur.fetchone()
        conn.commit()
        
        if not updated:
            return jsonify({"error": "Report not found"}), 404
            
        return jsonify({"message": "Annotations saved successfully"}), 200
        
    except Exception as e:
        print(f"Error saving annotations: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close() 