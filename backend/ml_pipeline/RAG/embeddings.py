from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from backend.config.config import Config
from backend.ml_pipeline.RAG.data.load_data import load_full_data
from tqdm import tqdm

class EmbeddingsHandler:
    def __init__(self):
        self.embedding_model = SentenceTransformer(Config.EMBEDDING_MODEL_NAME)
        
        # Initialize Pinecone with environment
        self.pc = Pinecone(
            api_key=Config.PINECONE_API_KEY
        )
        
        # Create or get index
        dimension = self.embedding_model.get_sentence_embedding_dimension()
        indexes = self.pc.list_indexes()
        
        if Config.PINECONE_INDEX_NAME not in indexes.names():
            # Define the serverless spec with the region
            spec = ServerlessSpec(
                cloud="aws",  
                region=Config.PINECONE_ENVIRONMENT
            )
            self.pc.create_index(
                name=Config.PINECONE_INDEX_NAME,
                dimension=dimension,
                metric='cosine',
                spec=spec
            )
            
        self.index = self.pc.Index(Config.PINECONE_INDEX_NAME)

    def upsert_embeddings(self):
        
        data = load_full_data()
        batch_size = 100
        
        for i in tqdm(range(0, len(data), batch_size), desc="Generating embeddings"):
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