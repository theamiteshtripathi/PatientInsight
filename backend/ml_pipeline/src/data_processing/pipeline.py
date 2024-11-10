from .transformation import DataTransformer
from ...data_pipeline.scripts.tf_data_validation import DataValidator
import pandas as pd
import logging
from typing import Dict, Any

class TensorflowPipeline:
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.validator = DataValidator()
        self.transformer = DataTransformer(self.config)
        
    def run_pipeline(self, data_path: str) -> Dict[str, Any]:
        logging.info("Starting pipeline")
        
        # Validate data
        validation_results = self.validator.validate_data()
        
        # Load and transform data if validation passes
        if validation_results['is_valid']:
            df = pd.read_csv(data_path)
            dataset, feature_columns = self.transformer.transform_features(df)
            
            # Save validation report
            self.validator.save_validation_report(validation_results)
            
            return {
                'validation_results': validation_results,
                'dataset': dataset,
                'feature_columns': feature_columns
            }
        else:
            logging.error("Data validation failed")
            return {'validation_results': validation_results}
