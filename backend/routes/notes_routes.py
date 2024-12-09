from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

notes_bp = Blueprint('notes', __name__)

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('PATIENT_DB_HOST'),
        database=os.getenv('PATIENT_DB_NAME'),
        user=os.getenv('PATIENT_DB_USER'),
        password=os.getenv('PATIENT_DB_PASSWORD'),
        port=os.getenv('PATIENT_DB_PORT')
    )

# Create doctor_notes table if it doesn't exist
def create_notes_table():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # First, drop the existing table if it exists
        # cur.execute("""
        #     DROP TABLE IF EXISTS doctor_notes CASCADE;
        # """)
        
        # Create the table with the correct constraints
        cur.execute("""
            CREATE TABLE doctor_notes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                report_id INTEGER REFERENCES patient_reports(id),
                prescription TEXT,
                medicine_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Add the unique constraint
        cur.execute("""
            ALTER TABLE doctor_notes 
            ADD CONSTRAINT unique_user_report 
            UNIQUE (user_id, report_id)
        """)
        
        conn.commit()
    except Exception as e:
        print(f"Error creating/updating table: {str(e)}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

# Call this when the blueprint is registered
create_notes_table()

@notes_bp.route('/api/notes/save', methods=['POST'])
@cross_origin()
def save_doctor_notes():
    try:
        data = request.json
        user_id = data.get('user_id')
        report_id = data.get('report_id')
        prescription = data.get('prescription')
        medicine_notes = data.get('medicine_notes')

        print("Received data:", {
            "user_id": user_id,
            "report_id": report_id,
            "prescription": prescription,
            "medicine_notes": medicine_notes
        })

        if not report_id:
            return jsonify({"error": "Report ID is required"}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # First check if a record exists
        cur.execute("""
            SELECT id FROM doctor_notes 
            WHERE user_id = %s AND report_id = %s
        """, (user_id, report_id))
        
        existing_note = cur.fetchone()
        
        if existing_note:
            # Update existing record
            cur.execute("""
                UPDATE doctor_notes 
                SET prescription = %s,
                    medicine_notes = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s AND report_id = %s
                RETURNING id
            """, (prescription, medicine_notes, user_id, report_id))
        else:
            # Insert new record
            cur.execute("""
                INSERT INTO doctor_notes 
                (user_id, report_id, prescription, medicine_notes)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (user_id, report_id, prescription, medicine_notes))

        notes_id = cur.fetchone()['id']
        conn.commit()
        
        cur.close()
        conn.close()

        return jsonify({
            'message': 'Notes saved successfully',
            'notes_id': notes_id
        }), 200

    except Exception as e:
        print('Error saving doctor notes:', str(e))
        return jsonify({'error': str(e)}), 500

@notes_bp.route('/api/notes/<int:patient_id>', methods=['GET'])
@cross_origin()
def get_patient_notes(patient_id):
    try:
        report_id = request.args.get('report_id')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get notes including the ID
        cur.execute("""
            SELECT id, prescription, medicine_notes 
            FROM doctor_notes 
            WHERE user_id = %s AND report_id = %s
        """, (patient_id, report_id))
        
        notes = cur.fetchone()
        
        cur.close()
        conn.close()

        if notes:
            return jsonify(notes), 200
        return jsonify({'id': None, 'prescription': '', 'medicine_notes': ''}), 200

    except Exception as e:
        print('Error fetching patient notes:', str(e))
        return jsonify({'error': 'Failed to fetch notes'}), 500