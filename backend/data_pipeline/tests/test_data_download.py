import unittest
import os
import sys
from dotenv import load_dotenv
from pathlib import Path

# Add the project root directory to the Python path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))

# Loading functions
from backend.data_pipeline.scripts.download import download_pmc_patients_dataset

# Load environment variables
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

# Unit tests
class TestDataDownload(unittest.TestCase):
    def test_download_pmc_patients_dataset(self):
        print("Start tests")
        output_dir = "backend/data_pipeline/data/raw/"
        download_pmc_patients_dataset(output_dir)
        self.assertTrue(os.path.exists(os.path.join(root_path, output_dir, "PMC-Patients.csv")))

if __name__ == "__main__":
    unittest.main()
