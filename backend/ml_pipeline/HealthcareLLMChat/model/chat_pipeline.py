from openai import OpenAI
from .conversation_manager import ConversationManager
from .emergency_detector import EmergencyDetector
from .symptom_analyzer import SymptomAnalyzer
from ..utils.prompt_templates import SYSTEM_PROMPT, INITIAL_PROMPT, FOLLOW_UP_PROMPT

class ChatPipeline:
    def __init__(self, api_key: str = None):
        self.client = OpenAI(api_key=api_key)
        self.conversation_manager = ConversationManager()
        self.emergency_detector = EmergencyDetector()
        self.symptom_analyzer = SymptomAnalyzer(api_key)


        
    def start_conversation(self) -> str:
        # Clear any existing conversation history
        self.conversation_manager.clear_history()
        
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": INITIAL_PROMPT}
        ]
        
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        
        initial_message = response.choices[0].message.content
        self.conversation_manager.add_message("assistant", initial_message)
        return initial_message
    
    def get_response(self, user_input: str) -> str:
        # Check for emergencies first
        is_emergency, emergency_msg = self.emergency_detector.check_emergency(user_input)
        if is_emergency:
            return emergency_msg
            
        # Add user input to history
        self.conversation_manager.add_message("user", user_input)
        
        # Prepare messages for GPT
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(self.conversation_manager.get_messages())
        messages.append({"role": "system", "content": FOLLOW_UP_PROMPT})
        
        # Get response from GPT
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        
        assistant_response = response.choices[0].message.content
        self.conversation_manager.add_message("assistant", assistant_response)
        return assistant_response
        
    def generate_summary(self) -> str:
        return self.symptom_analyzer.generate_summary(
            self.conversation_manager.get_messages()
        )
        
    def get_conversation_history(self) -> list:
        """Returns the conversation history in a format suitable for MLflow logging"""
        messages = self.conversation_manager.get_messages()
        return [{"role": msg["role"], "content": msg["content"]} for msg in messages]