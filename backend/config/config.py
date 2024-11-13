class Config:
    # DAG
    DATA_PATH = "zhengyun21/PMC-Patients"
    PERSIST_DIRECTORY = "/Users/deepakuday/Northeastern/MLOps/Project/PatientInsight/backend/models/RAG/chroma_db"
    EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
    GENERATIVE_MODEL_NAME = "gpt3.5"
    COLLECTION_NAME = "Patient_insight"
    N_RESULTS = 3