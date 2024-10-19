import pandas as pd
import os

def preprocess_pmc_patients(input_path, output_path):
    # Read the CSV file
    df = pd.read_csv(input_path)
    
    # Perform basic preprocessing steps
    df['age'] = df['age'].str.extract('(\d+)').astype(float)
    df['gender'] = df['gender'].map({'M': 'Male', 'F': 'Female'})
    
    # Save the preprocessed data
    df.to_csv(output_path, index=False)
    print(f"Preprocessed data saved to {output_path}")

if __name__ == "__main__":
    input_path = "data/raw/PMC-Patients.csv"
    output_path = "data/processed/PMC-Patients_preprocessed.csv"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    preprocess_pmc_patients(input_path, output_path)

