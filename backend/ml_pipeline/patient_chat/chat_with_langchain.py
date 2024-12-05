from langchain.llms.base import LLM
from typing import Any, List, Optional
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import json
import boto3
from pydantic import model_validator

class SageMakerLLM(LLM):
    """Custom LangChain LLM that uses SageMaker endpoint"""

    endpoint_name: str
    region_name: str = "us-east-2"
    runtime_client: Any = None

    @model_validator(mode='after')
    def initialize_runtime_client(self) -> 'SageMakerLLM':
        self.runtime_client = boto3.client('sagemaker-runtime', region_name=self.region_name)
        return self

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        try:
            payload = {"inputs": prompt}
            response = self.runtime_client.invoke_endpoint(
                EndpointName=self.endpoint_name,
                ContentType='application/json',
                Body=json.dumps(payload)
            )
            result = json.loads(response['Body'].read().decode())
            if isinstance(result, list):
                result = result[0]
            if isinstance(result, dict) and 'generated_text' in result:
                return result["generated_text"][len(prompt):]
            return str(result)
        except Exception as e:
            print(f"Error calling endpoint: {str(e)}")
            return "I apologize, but I encountered an error processing your request."

    @property
    def _llm_type(self) -> str:
        return "sagemaker-custom"

def load_endpoint_name():
    try:
        with open('endpoint_config.json', 'r') as f:
            config = json.load(f)
            return config['endpoint_name']
    except FileNotFoundError:
        raise Exception("No endpoint configuration found. Please deploy model first.")

def chat():
    # Load the endpoint
    endpoint_name = load_endpoint_name()
    llm = SageMakerLLM(endpoint_name=endpoint_name)
    
    # Medical context
    medical_report = """- Blood Pressure: 140/90 mmHg
    - Cholesterol Levels: LDL - 160 mg/dL, HDL - 40 mg/dL
    - Blood Sugar: Fasting - 110 mg/dL
    - Heart Rate: 85 bpm"""

    doctor_note = """Blood pressure is slightly elevated, and your LDL cholesterol levels are high, 
    which puts you at risk for cardiovascular issues. You should consider lifestyle changes like 
    a healthier diet and more exercise. Follow up after 3 months."""

    # Create prompt template
    template = """You are a medical AI assistant who is an expert in healthcare domain, specifically designed to help patients understand their medical reports and test results. Use precise medical terminology while still aiming to make the explanation clear and accessible to a general audience.

    INSTRUCTIONS:
    1. You must ONLY discuss information from the provided medical report and doctor's notes.
    2. For ANY question not directly related to the provided medical report or doctor's notes, you must respond EXACTLY with this message: "I can only help you understand your medical report. Would you like to ask about your test results or the doctor's recommendations?"
    3. DO NOT provide any other information or assistance outside of the medical context, even if you know the answer.
    4. Always provide clear and concise answers without hallucinating.
    5. Format your responses in this way:
       - Start with a direct answer to the question
       - Provide relevant context from the medical report
       - Reference the doctor's recommendations when applicable
       - Keep responses concise but complete
    6. For sensitive medical information, remind the patient to verify important details with their healthcare provider.

    Example good response:
    Patient: "What is my cholesterol level?"
    Assistant: "Your LDL cholesterol is 160 mg/dL. According to your doctor's note, this elevated level puts you at risk for cardiovascular issues. The doctor recommends lifestyle changes, including a healthier diet and more exercise, to help lower these levels. Please consult with your healthcare provider about specific dietary changes that would work best for you."

    Medical Context:
    Medical Report: {medical_report}
    Doctor's Note: {doctor_note}

    Previous conversation:
    {chat_history}

    Patient: {user_input}
    Assistant: """

    prompt = PromptTemplate(
        input_variables=["medical_report", "doctor_note", "chat_history", "user_input"],
        template=template
    )

    # Initialize memory
    memory = ConversationBufferMemory(input_key="user_input", memory_key="chat_history")

    # Create chain
    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        memory=memory,
        verbose=True
    )

    print("\nWelcome! I'm your medical AI assistant. I have access to your medical report and doctor's notes.")
    print("You can ask me questions about your health condition. Type 'exit' to end the conversation.\n")

    while True:
        user_input = input("\nYour question: ").strip()
        if user_input.lower() == 'exit':
            break

        try:
            response = chain.predict(
                user_input=user_input,
                medical_report=medical_report,
                doctor_note=doctor_note
            )
            print("\nAssistant:", response.strip())
            print("\n" + "-"*50)
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    chat() 