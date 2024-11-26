from backend.config.config import Config
from sentence_transformers import SentenceTransformer


class Retriever:
    def __init__(self, index):
        self.index = index
        self.embedding_model = SentenceTransformer(Config.EMBEDDING_MODEL_NAME)

    def retrieve(self, query, n_results=Config.N_RESULTS):
        # Generate embedding for the query
        query_embedding = self.embedding_model.encode(query).tolist()
        
        # Query Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=n_results,         
            include_metadata=True   
        )
        
        # Extract documents and scores separately
        documents = [match.metadata["text"] for match in results.matches]
        scores = [match.score for match in results.matches]
        
        return documents, scores