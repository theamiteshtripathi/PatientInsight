from sentence_transformers import SentenceTransformer
import chromadb
from backend.config.config import Config
from backend.models.RAG.data.load_data import load_full_data

print(Config.PERSIST_DIRECTORY)

class EmbeddingsHandler:
    def __init__(self):
        self.embedding_model = SentenceTransformer(Config.EMBEDDING_MODEL_NAME)
        self.chroma_client = chromadb.PersistentClient(path=Config.PERSIST_DIRECTORY)
        self.collection = self.chroma_client.get_or_create_collection(name=Config.COLLECTION_NAME)

    def upsert_embeddings(self):
        data = load_full_data() 
        
        for idx, record in enumerate(data):
            description = record["patient"]
            embedding = self.embedding_model.encode(description)
            # Upsert to avoid duplicates
            self.collection.upsert(
                documents=[description],
                ids=[f"patient_{idx}"],
                embeddings=[embedding]
            )