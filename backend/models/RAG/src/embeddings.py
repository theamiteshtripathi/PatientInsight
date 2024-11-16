from sentence_transformers import SentenceTransformer
import pinecone
from backend.config.config import Config
from backend.models.RAG.data.load_data import load_full_data

class EmbeddingsHandler:
    def __init__(self):
        self.embedding_model = SentenceTransformer(Config.EMBEDDING_MODEL_NAME)
        
        # Initialize Pinecone
        pinecone.init(
            api_key=Config.PINECONE_API_KEY,
            environment=Config.PINECONE_ENVIRONMENT
        )
        
        # Create or get index
        dimension = self.embedding_model.get_sentence_embedding_dimension()
        if Config.PINECONE_INDEX_NAME not in pinecone.list_indexes():
            pinecone.create_index(
                name=Config.PINECONE_INDEX_NAME,
                dimension=dimension,
                metric="cosine"
            )
        self.index = pinecone.Index(Config.PINECONE_INDEX_NAME)

    def upsert_embeddings(self):
        data = load_full_data()
        batch_size = 100
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            
            # Prepare batch data
            ids = [f"patient_{i+idx}" for idx in range(len(batch))]
            texts = [record["patient"] for record in batch]
            embeddings = self.embedding_model.encode(texts)
            
            # Create vectors list for batch upsert
            vectors = []
            for id, embedding, text in zip(ids, embeddings, texts):
                vectors.append((id, embedding.tolist(), {"text": text}))
            
            # Upsert to Pinecone
            self.index.upsert(vectors=vectors)
        
        return self.index