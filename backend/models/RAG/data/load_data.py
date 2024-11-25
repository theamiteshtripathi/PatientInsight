import boto3
import pandas as pd
import io
from backend.config.config import Config

def load_full_data():
    """
    Load patient data from S3 bucket
    Returns a list of dictionaries containing patient descriptions
    """
    try:
        # Initialize S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
            region_name=Config.AWS_REGION
        )
        
        # Get the object from S3
        response = s3_client.get_object(
            Bucket=Config.S3_BUCKET,
            Key=Config.S3_PATH
        )
        
        # Read CSV content
        df = pd.read_csv(io.BytesIO(response['Body'].read()))
        
        # Convert to the required format
        patients_description = [{"patient": row["patient"]} for _, row in df.iterrows()][:10]
        
        print(f"Successfully loaded {len(patients_description)} patient records")
        return patients_description
        
    except Exception as e:
        raise Exception(f"Error loading data from S3: {str(e)}")

def test_data_loading():
    """Test function to verify data loading and show sample"""
    try:
        data = load_full_data()
        print("\nFirst patient record:")
        print(f"Patient description: {data[0]['patient'][:200]}...")  # Show first 200 characters
        return True
    except Exception as e:
        print(f"Failed to load data: {str(e)}")
        return False

if __name__ == "__main__":
    test_data_loading()
