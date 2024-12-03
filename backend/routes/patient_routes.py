from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

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
            notifications_enabled = %s,
            data_sharing_allowed = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = %s
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
            data['notifications_enabled'],
            data['data_sharing_allowed'],
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