import os
import sys
from pathlib import Path

# Add the project root directory to the Python path
root_path = Path(__file__).parent.parent.parent.parent.absolute()
sys.path.append(str(root_path))

from backend.ml_pipeline.RAG.embeddings import EmbeddingsHandler
print("working")
def setup():
    print("Starting one-time embedding generation...")
    embeddings_handler = EmbeddingsHandler()
    index = embeddings_handler.upsert_embeddings()
    print("Embeddings generated and stored in Pinecone successfully!")

if __name__ == "__main__":
    setup() 