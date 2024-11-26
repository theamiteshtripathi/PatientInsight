from openai import OpenAI
from backend.config.config import Config

class SymptomAnalyzer:
    summary_prompt = """Analyze the conversation and create a structured clinical summary including:

    Chief Complaint:
    - Main symptom(s) the patient presented with
    
    History of Present Illness:
    - Onset and timeline
    - Character/Quality of symptoms
    - Location and radiation
    - Severity (1-10 scale if mentioned)
    - Pattern (constant vs intermittent)
    - Aggravating factors
    - Relieving factors
    - Associated symptoms
    
    Relevant Context:
    - Impact on daily activities
    - Previous similar episodes
    - Current medications/treatments tried
    
    Red Flags:
    - Any concerning symptoms that require immediate attention

    Format this as a clear, professional medical summary using bullet points where appropriate."""


    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        
    def generate_summary(self, conversation_history: list) -> str:
        messages = conversation_history + [{"role": "system", "content": self.summary_prompt}]
        
        response = self.client.chat.completions.create(
            model=Config.GENERATIVE_MODEL_NAME,
            messages=messages
        )
        
        return response.choices[0].message.content