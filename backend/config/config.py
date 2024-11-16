import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # DAG
    DATA_PATH = "zhengyun21/PMC-Patients"
    PERSIST_DIRECTORY = "/Users/deepakuday/Northeastern/MLOps/Project/PatientInsight/backend/models/RAG/chroma_db"
    EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
    GENERATIVE_MODEL_NAME = "gpt-4o-mini"
    COLLECTION_NAME = "Patient_insight"
    N_RESULTS = 3
    
    # API Keys (from environment variables)
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    @classmethod
    def validate_env_vars(cls):
        required_vars = [
            "PINECONE_API_KEY",
            "PINECONE_ENVIRONMENT",
            "PINECONE_INDEX_NAME",
            "OPENAI_API_KEY"
        ]
        
        missing_vars = []
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)
        
        if missing_vars:
            raise EnvironmentError(
                f"Missing required environment variables: {', '.join(missing_vars)}\n"
                "Please check your .env file."
            )
        return True