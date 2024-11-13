from backend.config.config import Config

class Retriever:
    def __init__(self, collection):
        self.collection = collection

    def retrieve(self, query, n_results=Config.N_RESULTS):
        results = self.collection.query(query_texts=[query], n_results=n_results)
        return [doc for doc in results['documents'][0]]