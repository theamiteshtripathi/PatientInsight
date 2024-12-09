-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- For encryption

-- Core Patient Information Table
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    enable_notifications BOOLEAN DEFAULT FALSE,
    allow_data_sharing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medical Information Table (Contains sensitive health data)
CREATE TABLE patient_medical_info (
    medical_info_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id),
    height VARCHAR(10),
    weight VARCHAR(10),
    blood_type VARCHAR(10),
    medical_conditions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    current_medications TEXT[] DEFAULT '{}',
    recent_surgeries TEXT[] DEFAULT '{}',
    family_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient
        FOREIGN KEY(patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE
);

-- Emergency Contacts Table
CREATE TABLE emergency_contacts (
    contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id),
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient
        FOREIGN KEY(patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE
);

-- Medical Documents Table
CREATE TABLE medical_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id),
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,  -- S3 path
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,  -- For additional document metadata
    CONSTRAINT fk_patient
        FOREIGN KEY(patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE
);

-- Audit Trail Table
CREATE TABLE audit_trail (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL,  -- INSERT, UPDATE, DELETE
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    old_values JSONB,
    new_values JSONB
);

-- Create indexes
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_medical_documents_patient_id ON medical_documents(patient_id);
CREATE INDEX idx_audit_trail_record_id ON audit_trail(record_id);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_trail (
            table_name, record_id, action, changed_by, old_values, new_values
        ) VALUES (
            TG_TABLE_NAME,
            NEW.patient_id,
            TG_OP,
            current_user,
            NULL,
            to_jsonb(NEW)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_trail (
            table_name, record_id, action, changed_by, old_values, new_values
        ) VALUES (
            TG_TABLE_NAME,
            NEW.patient_id,
            TG_OP,
            current_user,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_trail (
            table_name, record_id, action, changed_by, old_values, new_values
        ) VALUES (
            TG_TABLE_NAME,
            OLD.patient_id,
            TG_OP,
            current_user,
            to_jsonb(OLD),
            NULL
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER patients_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER medical_documents_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON medical_documents
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();