from backend.ml_pipeline.RAG.embeddings import EmbeddingsHandler
print("working")
def setup():
    print("Starting one-time embedding generation...")
    embeddings_handler = EmbeddingsHandler()
    index = embeddings_handler.upsert_embeddings()
    print("Embeddings generated and stored in Pinecone successfully!")

if __name__ == "__main__":
    setup() 