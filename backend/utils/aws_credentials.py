from dotenv import load_dotenv
import os

def get_aws_credentials():
    load_dotenv()
    return {
        'AWS_ACCESS_KEY_ID': os.getenv('AWS_ACCESS_KEY_ID'),
        'AWS_SECRET_ACCESS_KEY': os.getenv('AWS_SECRET_ACCESS_KEY')
    } 