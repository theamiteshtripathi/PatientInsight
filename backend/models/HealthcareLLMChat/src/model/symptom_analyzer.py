from typing import Dict, Any
import json
import openai

class SymptomAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        
    def generate_summary(self, conversation_history: list) -> str:
        summary_prompt = """Based on the conversation, provide a structured summary of the patient's symptoms including:
        - Primary symptoms
        - Duration
        - Intensity
        - Associated symptoms
        - Triggers
        Format as a clear medical summary."""
        
        messages = conversation_history + [{"role": "system", "content": summary_prompt}]
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            api_key=self.api_key
        )
        
        return response.choices[0].message.content