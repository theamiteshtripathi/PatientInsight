from openai import OpenAI
from backend.config.config import Config

class Generator:
    def __init__(self):
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)

    def generate(self, context, query):
        prompt = f"""As a medical professional, provide a comprehensive analysis of this patient case and similar cases from our database.

Original Patient Description:
{query}

Similar Patient Cases from Database:
{context}

Please provide a detailed analysis in the following format:

1. Current Patient Case:
   - Present the full patient description as provided

2. Analysis of Similar Cases:
   - Describe how these cases relate to the current patient
   - Detail what treatments were used in these similar cases
   - Highlight the outcomes and effectiveness of treatments

3. Recommended Treatment Approach:
   - Based on the similar cases, outline potential treatment strategies
   - Include any relevant medical considerations

Please maintain a professional medical tone throughout the analysis."""

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a medical professional analyzing patient cases and providing treatment recommendations based on similar cases."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=250
        )
        
        return response.choices[0].message.content
