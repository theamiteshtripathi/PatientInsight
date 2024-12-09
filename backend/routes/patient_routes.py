from flask import Blueprint, request, jsonify, make_response, send_file
from flask_cors import cross_origin
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from datetime import datetime
import io

load_dotenv()

patient_bp = Blueprint('patient', __name__)

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('PATIENT_DB_HOST'),
        database=os.getenv('PATIENT_DB_NAME'),
        user=os.getenv('PATIENT_DB_USER'),
        password=os.getenv('PATIENT_DB_PASSWORD'),
        port=os.getenv('PATIENT_DB_PORT')
    )

@patient_bp.route('/api/patientsonboardingform', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_patient():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print
        
        # First check if a profile already exists for this user_id
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT id FROM patientsonboardingform 
            WHERE user_id = %s
        """, (data.get('user_id'),))
        
        existing_profile = cur.fetchone()
        
        if existing_profile:
            cur.close()
            conn.close()
            return jsonify({"error": "Profile already exists for this user"}), 409
        
        # Set default values for missing fields
        default_data = {
            'user_id': None,
            'first_name': '',
            'last_name': '',
            'date_of_birth': None,
            'gender': '',
            'phone_number': '',
            'address': '',
            'blood_type': '',
            'height': None,
            'weight': None,
            'medical_conditions': '',
            'allergies': '',
            'emergency_contact_name': '',
            'emergency_contact_relationship': '',
            'emergency_contact_phone': '',
            'notifications_enabled': False,
            'data_sharing_allowed': False
        }
        
        # Update default values with received data
        default_data.update(data)
        
        # Validate required fields
        if not default_data['user_id']:
            return jsonify({"error": "user_id is required"}), 400
            
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        insert_query = """
        INSERT INTO patientsonboardingform (
            user_id, first_name, last_name, date_of_birth, gender,
            phone_number, address, blood_type, height, weight,
            medical_conditions, allergies, emergency_contact_name,
            emergency_contact_relationship, emergency_contact_phone,
            notifications_enabled, data_sharing_allowed
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) RETURNING id;
        """
        
        values = (
            default_data['user_id'],
            default_data['first_name'],
            default_data['last_name'],
            default_data['date_of_birth'],
            default_data['gender'],
            default_data['phone_number'],
            default_data['address'],
            default_data['blood_type'],
            default_data['height'],
            default_data['weight'],
            default_data['medical_conditions'],
            default_data['allergies'],
            default_data['emergency_contact_name'],
            default_data['emergency_contact_relationship'],
            default_data['emergency_contact_phone'],
            default_data['notifications_enabled'],
            default_data['data_sharing_allowed']
        )
        
        print("Executing query with values:", values)  # Debug print
        
        cur.execute(insert_query, values)
        patient_id = cur.fetchone()['id']
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Patient profile created successfully",
            "patient_id": patient_id
        }), 201
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/test-db-connection', methods=['GET'])
def test_db_connection():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.close()
        conn.close()
        return jsonify({"message": "Database connection successful"}), 200
    except Exception as e:
        return jsonify({"error": f"Database connection failed: {str(e)}"}), 500

@patient_bp.route('/api/patient-profile/<int:user_id>', methods=['GET'])
@cross_origin()
def get_patient_profile(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT * FROM patientsonboardingform 
            WHERE user_id = %s
        """, (user_id,))
        
        profile = cur.fetchone()
        cur.close()
        conn.close()
        
        if profile:
            return jsonify(profile), 200
        else:
            return jsonify({"error": "Profile not found"}), 404
            
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/patient-profile/<int:user_id>', methods=['PUT'])
@cross_origin()
def update_patient_profile(user_id):
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # First check if a record exists
        cur.execute("""
            SELECT id FROM patientsonboardingform 
            WHERE user_id = %s
        """, (user_id,))
        
        existing_record = cur.fetchone()
        
        if existing_record:
            # Update existing record
            update_query = """
            UPDATE patientsonboardingform SET
                first_name = %s,
                last_name = %s,
                date_of_birth = %s,
                gender = %s,
                phone_number = %s,
                address = %s,
                blood_type = %s,
                height = %s,
                weight = %s,
                medical_conditions = %s,
                allergies = %s,
                emergency_contact_name = %s,
                emergency_contact_relationship = %s,
                emergency_contact_phone = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = %s
            RETURNING *;
            """
        else:
            # Insert new record if none exists
            update_query = """
            INSERT INTO patientsonboardingform (
                first_name, last_name, date_of_birth, gender,
                phone_number, address, blood_type, height, weight,
                medical_conditions, allergies, emergency_contact_name,
                emergency_contact_relationship, emergency_contact_phone,
                user_id
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *;
            """
        
        values = (
            data['first_name'],
            data['last_name'],
            data['date_of_birth'],
            data['gender'],
            data['phone_number'],
            data['address'],
            data['blood_type'],
            data['height'],
            data['weight'],
            data['medical_conditions'],
            data['allergies'],
            data['emergency_contact_name'],
            data['emergency_contact_relationship'],
            data['emergency_contact_phone'],
            user_id
        )
        
        cur.execute(update_query, values)
        updated_profile = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Profile updated successfully",
            "profile": updated_profile
        }), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/patient-profile/delete-multiple', methods=['DELETE'])
@cross_origin()
def delete_multiple_patients():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Delete records with ids 3, 5, and 7
        cur.execute("""
            DELETE FROM patientsonboardingform 
            WHERE id IN (3, 5, 7)
            RETURNING id;
        """)
        
        deleted_ids = cur.fetchall()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Records deleted successfully",
            "deleted_ids": [record['id'] for record in deleted_ids]
        }), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT p.*, pof.* 
            FROM patients p
            LEFT JOIN patientsonboardingform pof ON p.id = pof.patient_id
            ORDER BY p.last_visit_date DESC
        """)
        
        patients = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify(patients)
        
    except Exception as e:
        print(f"Error fetching patients: {str(e)}")
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/doctor/patient/reports/<int:user_id>', methods=['GET'])
@cross_origin()
def get_patient_reports(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        print(f"Fetching reports for user_id: {user_id}")  # Debug log
        
        # Modified query to only use patient_reports table
        cur.execute("""
            SELECT 
                id,
                user_id,
                created_at,
                report_name,
                report_type,
                description
            FROM patient_reports 
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))
        
        reports = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify(reports)
        
    except Exception as e:
        print(f"Error in get_patient_reports: {str(e)}")
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/doctor/patient/onboarding/<int:user_id>', methods=['GET'])
@cross_origin()
def get_patient_onboarding(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get patient onboarding data
        cur.execute("""
            SELECT 
                id,
                user_id,
                first_name,
                last_name,
                date_of_birth,
                gender,
                phone_number,
                address,
                blood_type,
                height,
                weight,
                medical_conditions,
                allergies,
                emergency_contact_name,
                emergency_contact_relationship,
                emergency_contact_phone,
                created_at,
                updated_at
            FROM patientsonboardingform 
            WHERE user_id = %s
        """, (user_id,))
        
        patient_data = cur.fetchone()
        
        if patient_data:
            # Convert datetime objects to strings
            if patient_data['created_at']:
                patient_data['created_at'] = patient_data['created_at'].isoformat()
            if patient_data['updated_at']:
                patient_data['updated_at'] = patient_data['updated_at'].isoformat()
            
            # Format date of birth if exists
            if patient_data['date_of_birth']:
                patient_data['date_of_birth'] = patient_data['date_of_birth'].isoformat()
        
        cur.close()
        conn.close()
        
        return jsonify(patient_data if patient_data else {})
        
    except Exception as e:
        print(f"Error fetching patient onboarding: {str(e)}")
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/patient/review', methods=['POST'])
def save_patient_review():
    try:
        data = request.json
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            UPDATE patient_reports 
            SET doctor_review = %s, 
                status = 'Reviewed',
                reviewed_at = %s
            WHERE id = %s
        """, (
            data['doctorSummary'],
            datetime.now(),
            data['patientId']
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"message": "Review saved successfully"})
        
    except Exception as e:
        print(f"Error saving review: {str(e)}")
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/doctor/save-edited-report', methods=['POST'])
@cross_origin()
def save_edited_report():
    try:
        if 'pdf' not in request.files:
            return jsonify({"error": "No PDF file provided"}), 400
            
        pdf_file = request.files['pdf']
        user_id = request.form.get('user_id')
        
        if not user_id:
            return jsonify({"error": "No user ID provided"}), 400
            
        # Read PDF data
        pdf_data = pdf_file.read()
        
        # Generate report name
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_name = f"doctor_report_{timestamp}.pdf"
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Insert into doctor_patient_report table
        cur.execute("""
            INSERT INTO doctor_patient_report 
            (user_id, report_data, report_name)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (user_id, psycopg2.Binary(pdf_data), report_name))
        
        report_id = cur.fetchone()['id']
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Report saved successfully",
            "report_id": report_id
        }), 201
        
    except Exception as e:
        print(f"Error saving edited report: {str(e)}")
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/doctor/patient/report-pdf/<int:report_id>', methods=['GET'])
@cross_origin()
def get_patient_report_pdf(report_id):
    try:
        print(f"Fetching PDF for report_id: {report_id}")  # Debug log
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Try to get report from patient_reports first
        cur.execute("""
            SELECT report_data, report_name 
            FROM patient_reports 
            WHERE id = %s
        """, (report_id,))
        
        report = cur.fetchone()
        print(f"Found in patient_reports: {report is not None}")  # Debug log
        
        # If not found in patient_reports, try doctor_patient_report
        if not report:
            cur.execute("""
                SELECT report_data, report_name 
                FROM doctor_patient_report 
                WHERE id = %s
            """, (report_id,))
            report = cur.fetchone()
            print(f"Found in doctor_patient_report: {report is not None}")  # Debug log
        
        if not report:
            cur.close()
            conn.close()
            return jsonify({"error": "Report not found"}), 404
            
        if not report['report_data']:
            cur.close()
            conn.close()
            return jsonify({"error": "Report data is empty"}), 404
            
        # Debug log
        print(f"Report name: {report['report_name']}")
        print(f"Report data type: {type(report['report_data'])}")
        print(f"Report data length: {len(report['report_data']) if report['report_data'] else 0}")
        
        # Convert the binary data to bytes
        pdf_data = bytes(report['report_data'])
        
        # Create a BytesIO object
        pdf_io = io.BytesIO(pdf_data)
        pdf_io.seek(0)
        
        # Create response with PDF
        response = send_file(
            pdf_io,
            mimetype='application/pdf',
            as_attachment=False,
            download_name=report['report_name'] if report['report_name'] else 'report.pdf'
        )
        
        # Add CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        
        cur.close()
        conn.close()
        
        return response
        
    except Exception as e:
        print(f"Detailed error in get_patient_report_pdf: {str(e)}")
        import traceback
        traceback.print_exc()  # Print full stack trace
        return jsonify({"error": str(e)}), 500

@patient_bp.route('/api/doctor/save-report-notes', methods=['POST'])
@cross_origin()
def save_report_notes():
    try:
        notes = request.form.get('notes')
        user_id = request.form.get('user_id')
        report_id = request.form.get('report_id')

        if not all([notes, user_id, report_id]):
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Create a new report with the edited notes
        cur.execute("""
            INSERT INTO doctor_patient_report 
            (user_id, report_data, report_name, created_at)
            VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING id
        """, (
            user_id,
            notes.encode('utf-8'),  # Convert notes to bytes
            f"Doctor_Notes_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        ))

        new_report_id = cur.fetchone()['id']
        
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "Notes saved successfully",
            "report_id": new_report_id
        })

    except Exception as e:
        print(f"Error saving notes: {str(e)}")
        return jsonify({"error": str(e)}), 500