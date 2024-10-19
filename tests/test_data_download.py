import unittest
import os
from src.data.download import download_pmc_patients_dataset

class TestDataDownload(unittest.TestCase):
    def test_download_pmc_patients_dataset(self):
        output_dir = "data/raw"
        download_pmc_patients_dataset(output_dir)
        self.assertTrue(os.path.exists(os.path.join(output_dir, "PMC-Patients.csv")))

if __name__ == "__main__":
    unittest.main()

