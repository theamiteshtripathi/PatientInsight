import os
from dotenv import load_dotenv
import pandas as pd
import ast

# Load environment variables
load_dotenv()

# Access AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

def preprocess_pmc_patients(input_path, output_path):
    print('Function call')
    # load exact location of data
    root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print("root path: ", root_path)

    input_path = os.path.join(root_path, input_path)
    output_path = os.path.join(root_path, output_path)


    # Read the CSV file
    df = pd.read_csv(input_path)
    
    # Select important features
    important_features = ['patient_uid', 'PMID', 'title', 'patient', 'age', 'gender', 'relevant_articles', 'similar_patients']
    df = df[important_features]
    
    # Clean and transform data
    df['age'] = df['age'].apply(lambda x:list(ast.literal_eval(x)) if pd.notna(x) else list([[]]))
    df['age'] = df['age'].apply(lambda x: x[0])

    df['age_years'] = df['age'].apply(lambda x: sum(x[0] if x[1] == 'year' 
                                                 else x[0] / 12 if x[1] == 'month' 
                                                 else x[0] / 52 if x[1] == 'week' 
                                                 else x[0] / 365 if x[1] == 'day' 
                                                 else x[0] / 8760 
                                                 for item in [x] if len(item) == 2))


    df['relevant_articles'] = df['relevant_articles'].apply(lambda x: x if pd.notna(x) else {})
    df['similar_patients'] = df['similar_patients'].apply(lambda x: x if pd.notna(x) else {})
    
    # Convert gender to binary
    df['gender'] = df['gender'].map({'M': 1, 'F': 0})
    
    # Save the preprocessed data
    df.to_csv(output_path, index=False)
    print(f"Preprocessed data saved to {output_path}")

if __name__ == "__main__":
    print('Script start')
    input_path = "data/raw/PMC-Patients.csv"
    output_path = "data/processed/PMC-Patients_preprocessed.csv"
    preprocess_pmc_patients(input_path, output_path)
