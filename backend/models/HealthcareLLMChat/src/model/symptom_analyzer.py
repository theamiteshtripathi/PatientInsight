from openai import OpenAI

class SymptomAnalyzer:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        
    def generate_summary(self, conversation_history: list) -> str:
        summary_prompt = """Based on the conversation, provide a structured summary of the patient's symptoms including:
        - Primary symptoms
        - Duration
        - Intensity
        - Associated symptoms
        - Triggers
        Format as a clear, concise medical summary."""
        
        messages = conversation_history + [{"role": "system", "content": summary_prompt}]
        
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        
        return response.choices[0].message.content