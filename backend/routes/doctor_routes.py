from flask import Blueprint, jsonify, make_response
from flask_cors import cross_origin
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import psycopg2

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
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get all users except the first one (doctor)
        cur.execute("""
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
            ORDER BY u.first_name, u.last_name
        """)
        
        patients = cur.fetchall()
        print(f"Found {len(patients)} patients")  # Debug log
        
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
        
        # Get patient onboarding details
        cur.execute("""
            SELECT * FROM patientsonboardingform 
            WHERE user_id = %s
        """, (patient_id,))
        
        details = cur.fetchone()
        cur.close()
        conn.close()
        
        return jsonify(details), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@doctor_bp.route('/api/doctor/patient/<int:patient_id>/reports', methods=['GET'])
@cross_origin()
def get_patient_reports(patient_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get patient reports
        cur.execute("""
            SELECT id, report_name, created_at, report_type, description 
            FROM patient_reports 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (patient_id,))
        
        reports = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify(reports), 200
        
    except Exception as e:
        print("Error:", str(e))
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
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT report_data FROM patient_reports WHERE id = %s", (report_id,))
        report = cur.fetchone()
        
        if not report:
            return jsonify({"error": "Report not found"}), 404
        
        cur.close()
        conn.close()
        
        response = make_response(report['report_data'])
        response.headers.set('Content-Type', 'application/pdf')
        response.headers.set('Content-Disposition', 'inline', filename=f'report_{report_id}.pdf')
        
        return response
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500 