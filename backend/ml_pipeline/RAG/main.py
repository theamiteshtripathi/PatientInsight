from backend.ml_pipeline.RAG.embeddings import EmbeddingsHandler
from backend.ml_pipeline.RAG.retriever import Retriever
from backend.ml_pipeline.RAG.generator import Generator
from backend.config.config import Config

def main(query):
    # Initialize handlers
    embeddings_handler = EmbeddingsHandler()
    
    # Retrieve documents using existing embeddings
    retriever = Retriever(embeddings_handler.index)
    retrieved_docs, retrieval_scores = retriever.retrieve(query)
    print("Retrieved Documents:", retrieved_docs)
    print("Retrieval Scores:", retrieval_scores)
    
    # Generate answer
    context = " ".join(retrieved_docs)
    generator = Generator()
    answer = generator.generate(context, query)
    
    # Add retrieved documents and scores to the response
    answer['retrieved_documents'] = retrieved_docs
    answer['retrieval_scores'] = retrieval_scores
    print("Generated Answer:", answer['content'])

    return answer

if __name__ == "__main__":
    # Validate environment variables first
    Config.validate_env_vars()
    query = "She seemed to feel threatened by us and it was difficult to calm her down."
    main(query) 
