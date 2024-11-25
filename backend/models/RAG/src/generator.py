from openai import OpenAI
from backend.config.config import Config

class Generator:
    DOCTOR_REPORT_PROMPT = """As a medical professional, provide a comprehensive analysis of this patient case and similar cases from our database.

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

    def __init__(self):
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)

    def generate(self, context, query):
        # Cost per token in USD
        INPUT_TOKEN_COST = Config.GENERATIVE_MODEL_INPUT_COST
        OUTPUT_TOKEN_COST = Config.GENERATIVE_MODEL_OUTPUT_COST

        prompt = self.DOCTOR_REPORT_PROMPT.format(
            query=query,
            context=context
        )

        response = self.client.chat.completions.create(
            model=Config.GENERATIVE_MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a medical professional analyzing patient cases and providing treatment recommendations based on similar cases."},
                {"role": "user", "content": prompt}
            ],
            temperature=Config.GENERATIVE_MODEL_TEMPERATURE,
            max_tokens=Config.GENERATIVE_MODEL_MAX_TOKENS
        )
        
        # Calculate costs
        input_cost = response.usage.prompt_tokens * INPUT_TOKEN_COST
        output_cost = response.usage.completion_tokens * OUTPUT_TOKEN_COST
        total_cost = input_cost + output_cost
        
        return {
            'content': response.choices[0].message.content,
            'usage': {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens,
                'input_cost': input_cost,
                'output_cost': output_cost,
                'total_cost': total_cost
            }
        }
