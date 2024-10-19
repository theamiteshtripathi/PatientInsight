import unittest
import pandas as pd
import os
from src.data.preprocess import preprocess_pmc_patients

class TestDataPreprocess(unittest.TestCase):
    def test_preprocess_pmc_patients(self):
        input_path = "data/raw/PMC-Patients.csv"
        output_path = "data/processed/PMC-Patients_preprocessed.csv"
        
        preprocess_pmc_patients(input_path, output_path)
        
        self.assertTrue(os.path.exists(output_path))
        
        df = pd.read_csv(output_path)
        self.assertIn("age", df.columns)
        self.assertIn("gender", df.columns)
        self.assertTrue(df["age"].dtype in ["float64", "int64"])
        self.assertTrue(df["gender"].isin(["Male", "Female"]).all())

if __name__ == "__main__":
    unittest.main()

