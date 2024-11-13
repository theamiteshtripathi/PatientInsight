from backend.models.RAG.src.embeddings import EmbeddingsHandler
from backend.models.RAG.src.retriever import Retriever
from backend.models.RAG.src.generator import Generator
from backend.config.config import Config

def main(query):
    # Step 1: Generate and store embeddings
    embeddings_handler = EmbeddingsHandler()
    embeddings_handler.upsert_embeddings()
    
    # Step 2: Retrieve documents
    retriever = Retriever(embeddings_handler.collection)
    retrieved_docs = retriever.retrieve(query)
    print(retrieved_docs)
    
    # # Step 3: Generate answer
    # context = " ".join(retrieved_docs)
    # generator = Generator()
    # answer = generator.generate(context, query)
    # print("Answer:", answer)

if __name__ == "__main__":
    query = "A patient with the symtoms of dry cough"
    main(query)