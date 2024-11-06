import os
import pandas as pd
from ydata_profiling import ProfileReport

def generate_stats(csv_file_path):
    print('Function call')
    
    # root path
    root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print("root path: ", root_path)
    csv_dir = os.path.join(root_path, csv_file_path)

    csv_path = os.path.join(csv_dir, "PMC-Patients_preprocessed.csv")
    
    # Load your CSV file into a DataFrame
    df = pd.read_csv(csv_path)

    # Generate the report
    profile = ProfileReport(df)
    profile.to_file(os.path.join(csv_dir, "stats_report.html"))
    
    print(f"Stats generated successfully")

if __name__ == "__main__":
    print("Start script")
    csv_file_path = "data/processed"
    generate_stats(csv_file_path)