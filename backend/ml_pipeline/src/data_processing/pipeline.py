from .transformation import DataTransformer
from data_pipeline.scripts.tf_data_validation import DataValidator
import pandas as pd
import logging
from typing import Dict, Any

class TensorflowPipeline:
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.validator = DataValidator()
        self.transformer = DataTransformer(self.config)
        
    def run_pipeline(self, data_path: str) -> Dict[str, Any]:
        logging.info("Starting TensorFlow pipeline processing")
        
        try:
            # Load and validate data
            logging.info(f"Loading data from {data_path}")
            df = pd.read_csv(data_path)
            logging.info(f"Loaded {len(df)} records")
            
            # Data validation
            validation_results = self.validator.validate_data()
            logging.info("Validation complete")
            
            if validation_results['is_valid']:
                # Transform features
                dataset, feature_columns = self.transformer.transform_features(df)
                logging.info(f"Transformed {len(feature_columns)} features")
                
                # Save validation report
                self.validator.save_validation_report(validation_results)
                
                return {
                    'validation_results': validation_results,
                    'dataset': dataset,
                    'feature_columns': feature_columns,
                    'records_processed': len(df)
                }
            else:
                raise ValueError("Data validation failed")
                
        except Exception as e:
            logging.error(f"Pipeline failed: {str(e)}")
            raise
