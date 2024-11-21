import os
import pandas as pd
from ydata_profiling import ProfileReport
import sys
from pathlib import Path

def generate_stats(csv_file_path):
    # Pointing to the start of the project
    root_path = Path(__file__).parent.parent.parent.parent.absolute()
    sys.path.append(str(root_path))
    
    print("root path: ", root_path)

    data_location = "backend/data_pipeline/"

    csv_dir = os.path.join(root_path, data_location, csv_file_path)

    csv_path = os.path.join(csv_dir, "PMC-Patients_preprocessed.csv")
    
    # Load your CSV file into a DataFrame
    df = pd.read_csv(csv_path)

    # Generate the report
    profile = ProfileReport(df, minimal=True)
    stat_report = os.path.join(csv_dir, "stats_report.html")
    
    try:
        profile.to_file(stat_report)
    except Exception as e:
        print(f"Error: {e}")
        raise Exception("Unable to generate stats report")

    
    print(f"Stats generated successfully")

if __name__ == "__main__":
    print("Start script")
    csv_file_path = "data/processed"
    generate_stats(csv_file_path)