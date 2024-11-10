import os
from dotenv import load_dotenv
import requests
from datasets import load_dataset
import logging

# Load environment variables
load_dotenv()


# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

def download_pmc_patients_dataset(output_dir: str) -> None:
    logging.info(f"Starting download to {output_dir}")
    
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        url = "https://huggingface.co/datasets/zhengyun21/PMC-Patients/resolve/main/PMC-Patients.csv"
        output_path = os.path.join(output_dir, "PMC-Patients.csv")
        response = requests.get(url)
        response.raise_for_status()
        
        print("Downloading dataset")
        with open(output_path, "wb") as f:
            f.write(response.content)
        
        print(f"Dataset downloaded to {output_path}")
        logging.info("Download completed successfully")
        
    except Exception as e:
        logging.error(f"Download failed: {str(e)}")
        raise

if __name__ == "__main__":
    print("Start script")
    output_dir = "data/raw"
    download_pmc_patients_dataset(output_dir)
