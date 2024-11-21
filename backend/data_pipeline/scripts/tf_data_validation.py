import os
import pandas as pd
import numpy as np
from typing import Dict, Any
import logging
from datetime import datetime

class DataValidator:
    def __init__(self):
        self.root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.csv_dir = "data/processed/PMC-Patients_preprocessed.csv"
        self.csv_loc = os.path.join(self.root_path, self.csv_dir)
        
    def validate_data(self, data: pd.DataFrame = None) -> Dict[str, Any]:
        """Validate the data against defined rules"""
        validation_results = {
            'is_valid': True,
            'anomalies': []
        }
        
        if data is not None:
            completeness = self._check_completeness(data)
            value_ranges = self._check_value_ranges(data)
            data_types = self._check_data_types(data)
            duplicates = self._check_duplicates(data)
            
            validation_results['is_valid'] = all([
                completeness, value_ranges, data_types, duplicates
            ])
            
        return validation_results

    def _check_completeness(self, data: pd.DataFrame) -> bool:
        """Check for missing values in required fields"""
        required_columns = ['patient_uid', 'PMID', 'age_years', 'gender']
        missing_required = data[required_columns].isnull().sum()
        return all(missing_required == 0)

    def _check_value_ranges(self, data: pd.DataFrame) -> bool:
        """Check if values are within expected ranges"""
        try:
            age_valid = data['age_years'].between(0, 120).all()
            gender_valid = data['gender'].isin([0, 1]).all()
            return age_valid and gender_valid
        except:
            return False

    def _check_data_types(self, data: pd.DataFrame) -> bool:
        """Verify data types of important columns"""
        try:
            type_checks = {
                'patient_uid': pd.api.types.is_string_dtype(data['patient_uid']),
                'age_years': pd.api.types.is_numeric_dtype(data['age_years']),
                'gender': pd.api.types.is_numeric_dtype(data['gender'])
            }
            return all(type_checks.values())
        except:
            return False

    def _check_duplicates(self, data: pd.DataFrame) -> bool:
        """Check for duplicate records"""
        return not data['patient_uid'].duplicated().any()

    def generate_validation_report(self, validation_results: Dict) -> str:
        """Generate a human-readable validation report"""
        report = []
        report.append("Data Validation Report")
        report.append("=" * 20)
        
        # Add basic stats
        report.append("\nBasic Statistics:")
        report.append(f"Total Records: {validation_results['stats']['row_count']}")
        report.append(f"Total Columns: {validation_results['stats']['column_count']}")
        
        # Add validation results
        report.append("\nValidation Results:")
        for check, result in validation_results['validation_results'].items():
            report.append(f"{check}: {'✓' if result else '✗'}")
        
        # Add overall status
        report.append(f"\nOverall Status: {'PASSED' if validation_results['is_valid'] else 'FAILED'}")
        
        return "\n".join(report)

    def save_validation_report(self, validation_results: Dict[str, Any]) -> None:
        """Save validation results to a log file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_dir = "logs/validation"
        os.makedirs(log_dir, exist_ok=True)
        
        log_file = os.path.join(log_dir, f"validation_report_{timestamp}.log")
        logging.basicConfig(filename=log_file, level=logging.INFO)
        logging.info(f"Validation Results: {validation_results}")
