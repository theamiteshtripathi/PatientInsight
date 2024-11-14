import boto3

class S3Handler:
    def __init__(self):
        self.s3 = boto3.client('s3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
        self.bucket = 'patient-insight-pdfs'
    
    def upload_pdf(self, patient_id, pdf_file):
        key = f'patients/{patient_id}/medical_history.pdf'
        self.s3.upload_file(pdf_file, self.bucket, key) 