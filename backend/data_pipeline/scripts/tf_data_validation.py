import os
import sys
import pandas as pd
import tensorflow_data_validation as tfdv

# load exact location of data
root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print("root path: ", root_path)

# CSV location from root
csv_dir = "data/processed/PMC-Patients_preprocessed.csv"
csv_loc = os.path.join(root_path, csv_dir)

# Load your CSV data
data = pd.read_csv(csv_loc)

# Generate statistics from your data
stats = tfdv.generate_statistics_from_dataframe(data)

# Infer schema from the generated statistics
schema = tfdv.infer_schema(stats)

# For new data, generate statistics and compare with the inferred schema
#new_data_stats = tfdv.generate_statistics_from_dataframe(new_data)
#anomalies = tfdv.validate_statistics(new_data_stats, schema)

tfdv.visualize_statistics(stats)
