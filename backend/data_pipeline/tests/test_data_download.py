import unittest
import os
import sys
from dotenv import load_dotenv
# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_pipeline.scripts.download import download_pmc_patients_dataset

# Load environment variables
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

class TestDataDownload(unittest.TestCase):
    def test_download_pmc_patients_dataset(self):
        output_dir = "data/raw"
        download_pmc_patients_dataset(output_dir)
        self.assertTrue(os.path.exists(os.path.join(output_dir, "PMC-Patients.csv")))

if __name__ == "__main__":
    unittest.main()

