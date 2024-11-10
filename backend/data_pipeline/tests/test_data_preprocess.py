import unittest
import pandas as pd
import os
from dotenv import load_dotenv
import sys

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts_location.preprocess import preprocess_pmc_patients

# Load environment variables
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

class TestDataPreprocess(unittest.TestCase):
    def test_preprocess_pmc_patients(self):
        input_path = "data/raw/PMC-Patients.csv"
        output_path = "data/processed/PMC-Patients_preprocessed.csv"
        
        preprocess_pmc_patients(input_path, output_path)
        
        self.assertTrue(os.path.exists(output_path))
        
        df = pd.read_csv(output_path)
        
        self.assertIn("gender", df.columns)
        self.assertTrue("age",  df.columns)
        self.assertTrue(df["gender"].isin([0, 1]).all())

if __name__ == "__main__":
    unittest.main()
