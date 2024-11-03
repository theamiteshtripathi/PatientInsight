import os
from dotenv import load_dotenv
import requests
from datasets import load_dataset

# Load environment variables
load_dotenv()


# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

def download_pmc_patients_dataset(output_dir):
    print('Function call')
    
    # root path
    root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print("root path: ", root_path)
    output_dir = os.path.join(root_path, "data/raw")
    
    # Check directories
    os.makedirs(output_dir, exist_ok=True)

    url = "https://huggingface.co/datasets/zhengyun21/PMC-Patients/resolve/main/PMC-Patients.csv"
    output_path = os.path.join(output_dir, "PMC-Patients.csv")
    response = requests.get(url)
    response.raise_for_status()
    
    print("Downloading dataset")
    with open(output_path, "wb") as f:
        f.write(response.content)
    
    print(f"Dataset downloaded to {output_path}")

if __name__ == "__main__":
    print("Start script")
    output_dir = "data/raw"
    download_pmc_patients_dataset(output_dir)
