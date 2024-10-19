from datasets import load_dataset
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

def download_pmc_patients_dataset(output_dir):
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "PMC-Patients.csv")
    
    # Load the dataset
    dataset = load_dataset("zhengyun21/PMC-Patients")
    
    # Save the dataset to CSV
    dataset['train'].to_csv(output_path, index=False)
    
    print(f"Dataset downloaded and saved to {output_path}")

if __name__ == "__main__":
    output_dir = "data/raw"
    download_pmc_patients_dataset(output_dir)
