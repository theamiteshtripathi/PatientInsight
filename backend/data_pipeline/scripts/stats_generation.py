import os
import pandas as pd
from ydata_profiling import ProfileReport
import sys
from pathlib import Path
import time
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)


def generate_stats(csv_file_dir):
    # Start time
    start_time = time.time()
    
    # Pointing to the start of the project
    root_path = Path(__file__).parent.parent.parent.parent.absolute()
    sys.path.append(str(root_path))
    
    # Check if output dir exists
    output_dir = os.path.join(root_path, csv_file_dir)
    print(f"Starting stat generation and saving to: {output_dir}")

    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
    except Exception as e:
        print(f"Invalid directory: {str(e)}")
        raise

    csv_path = os.path.join(output_dir, "PMC-Patients_preprocessed.csv")
    
    if os.path.exists(csv_path):
        print('Preprocessed file exists. Continuing to generate stats report')
    else:
        raise Exception('File not found in the processed directory')
    
    # Load your CSV file into a DataFrame
    df = pd.read_csv(csv_path)

    # Include only required columns in the stat generation
    included_columns = ['title', 'patient', 'gender', 'age_years']
    df = df[included_columns]

    # Generate the report
    profile = ProfileReport(df, minimal=True)
    stat_report = os.path.join(output_dir, "stats_report.html")
    
    try:
        profile.to_file(stat_report)
    except Exception as e:
        print(f"Error: {e}")
        raise Exception("Unable to generate stats report")
    
    print(f"Stats report saved to: {stat_report}")
    
    if os.path.exists(stat_report):
        print('Stats report successfully generated, Exiting script successfully')
    else:
        raise Exception('File not found in the processed directory')
    
    # Calculating time elapsed
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Time elapsed: {elapsed_time:.2f} seconds")

if __name__ == "__main__":
    print("Start script")
    csv_file_dir = "backend/data_pipeline/data/processed/"
    generate_stats(csv_file_dir)