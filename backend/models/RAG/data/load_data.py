from datasets import load_dataset
from backend.config.config import Config


def load_full_data():
    # Load the full dataset
    dataset = load_dataset(Config.DATA_PATH)
    print(dataset["train"][0])
    patients_description = [{"patient": entry["patient"]} for entry in dataset["train"]]
    return patients_description


if __name__ == "__main__":
    load_full_data()