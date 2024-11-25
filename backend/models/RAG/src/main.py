from backend.models.RAG.src.embeddings import EmbeddingsHandler
from backend.models.RAG.src.retriever import Retriever
from backend.models.RAG.src.generator import Generator
from backend.config.config import Config

def main(query):
    # Initialize handlers
    embeddings_handler = EmbeddingsHandler()
    
    # Retrieve documents using existing embeddings
    retriever = Retriever(embeddings_handler.index)
    retrieved_docs = retriever.retrieve(query)
    print("Retrieved Documents:", retrieved_docs)
    
    # Generate answer
    context = " ".join(retrieved_docs)
    generator = Generator()
    answer = generator.generate(context, query)
    print("Generated Answer:", answer['content'])

    return answer

if __name__ == "__main__":
    # Validate environment variables first
    Config.validate_env_vars()
    query = "She seemed to feel threatened by us and it was difficult to calm her down."
    main(query) 
