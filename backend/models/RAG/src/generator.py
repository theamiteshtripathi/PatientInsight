from transformers import pipeline
from backend.config.config import Config

class Generator:
    def __init__(self):
        self.generator_pipeline = pipeline("text-generation", model=Config.GENERATIVE_MODEL_NAME, max_length=150)

    def generate(self, context, query):
        prompt = f"{context}\n\nQuestion: {query}\nAnswer:"
        response = self.generator_pipeline(prompt, num_return_sequences=1)
        return response[0]['generated_text']