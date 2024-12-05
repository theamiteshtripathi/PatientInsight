from langchain_community.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from backend.config.config import Config
 
def chat():
    # Initialize OpenAI LLMs
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7,
        openai_api_key=Config.OPENAI_API_KEY
    )
    # Medical context (same as before)
    medical_report = """- Blood Pressure: 140/90 mmHg
    - Cholesterol Levels: LDL - 160 mg/dL, HDL - 40 mg/dL
    - Blood Sugar: Fasting - 110 mg/dL
    - Heart Rate: 85 bpm"""
 
    doctor_note = """Blood pressure is slightly elevated, and your LDL cholesterol levels are high, 
    which puts you at risk for cardiovascular issues. You should consider lifestyle changes like 
    a healthier diet and more exercise. Follow up after 3 months."""
 
    # Create prompt template (same as before)
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