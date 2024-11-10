from ml_pipeline.src.data_processing.pipeline import TensorflowPipeline
from ml_pipeline.src.config.pipeline_config import PIPELINE_CONFIG

# Initialize pipeline
pipeline = TensorflowPipeline(PIPELINE_CONFIG)

# Run pipeline
results = pipeline.run_pipeline('backend/data/processed/PMC-Patients_preprocessed.csv')

# Check results
if 'dataset' in results:
    print("Pipeline successful!")
    # Print first few examples from the dataset
    for example in results['dataset'].take(1):
        print("Example from transformed dataset:", example)
else:
    print("Pipeline failed:", results['validation_results']['anomalies'])