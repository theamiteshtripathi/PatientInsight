from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

# Define the blueprint
auth_bp = Blueprint('auth', __name__)

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('PATIENT_DB_HOST'),
        database=os.getenv('PATIENT_DB_NAME'),
        user=os.getenv('PATIENT_DB_USER'),
        password=os.getenv('PATIENT_DB_PASSWORD'),
        port=os.getenv('PATIENT_DB_PORT')
    )

@auth_bp.route('/api/register', methods=['POST', 'OPTIONS'])
@cross_origin()
def register():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if username or email already exists
        cur.execute(
            "SELECT * FROM users WHERE username = %s OR email = %s",
            (data['username'], data['email'])
        )
        
        if cur.fetchone():
            return jsonify({"error": "Username or email already exists"}), 400
        
        # Insert new user
        insert_query = """
        INSERT INTO users (username, email, password, first_name, last_name)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, username, email, first_name, last_name;
        """
        
        cur.execute(insert_query, (
            data['username'],
            data['email'],
            data['password'],
            data['firstName'],
            data['lastName']
        ))
        
        new_user = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Registration successful",
            "user": {
                "id": new_user['id'],
                "username": new_user['username'],
                "email": new_user['email'],
                "firstName": new_user['first_name'],
                "lastName": new_user['last_name']
            }
        }), 201
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/api/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Find user and check if they have a profile
        cur.execute("""
            SELECT 
                u.id, 
                u.username, 
                u.email, 
                u.first_name, 
                u.last_name,
                CASE 
                    WHEN p.id IS NOT NULL THEN true 
                    ELSE false 
                END as has_profile
            FROM users u
            LEFT JOIN patientsonboardingform p ON u.id = p.user_id
            WHERE u.email = %s AND u.password = %s
        """, (data['email'], data['password']))
        
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if user:
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "email": user['email'],
                    "first_name": user['first_name'],
                    "last_name": user['last_name'],
                    "hasProfile": user['has_profile']
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
            
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500