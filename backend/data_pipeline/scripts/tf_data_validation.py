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
        
    def validate_data(self) -> Dict[str, Any]:
        """Validate data using pandas-based checks"""
        try:
            data = pd.read_csv(self.csv_loc)
            
            # Basic statistics
            stats = {
                'row_count': len(data),
                'column_count': len(data.columns),
                'missing_values': data.isnull().sum().to_dict(),
                'dtypes': data.dtypes.astype(str).to_dict()
            }
            
            # Data quality checks
            validation_results = {
                'completeness': self._check_completeness(data),
                'value_ranges': self._check_value_ranges(data),
                'data_types': self._check_data_types(data),
                'duplicates': self._check_duplicates(data)
            }
            
            # Generate validation report
            report = {
                'validation_time': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'stats': stats,
                'validation_results': validation_results,
                'is_valid': all(validation_results.values())
            }
            
            return report
            
        except Exception as e:
            logging.error(f"Data validation failed: {str(e)}")
            return {
                'error': str(e),
                'is_valid': False
            }

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

    def save_validation_report(self, report: Dict, output_path: str = None):
        """Save validation report to file"""
        if output_path is None:
            output_path = os.path.join(self.root_path, 'data/processed/validation_report.txt')
            
        with open(output_path, 'w') as f:
            f.write(self.generate_validation_report(report))
