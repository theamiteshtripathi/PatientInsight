from datasets import load_dataset
from backend.config.config import Config


def load_full_data():
    # Load the full dataset
    dataset = load_dataset(Config.DATA_PATH)
    patients_description = [{"patient": entry["patient"]} for entry in dataset["train"]]
    patients_description = patients_description
    return patients_description
