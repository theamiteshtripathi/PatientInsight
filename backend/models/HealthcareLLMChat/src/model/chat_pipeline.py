from openai import OpenAI
import time
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
        self.metrics = {
            "total_messages": 0,
            "emergency_count": 0,
            "response_times": [],
            "model_calls": 0
        }
        
    def start_conversation(self) -> tuple[str, dict]:
        start_time = time.time()
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
        
        metrics = {
            "response_time": time.time() - start_time,
            "model_calls": 1
        }
        self.metrics["model_calls"] += 1
        self.metrics["response_times"].append(metrics["response_time"])
        
        return initial_message, metrics
    
    def get_response(self, user_input: str) -> tuple[str, dict]:
        start_time = time.time()
        self.metrics["total_messages"] += 1
        
        # Check for emergencies first
        is_emergency, emergency_msg = self.emergency_detector.check_emergency(user_input)
        if is_emergency:
            self.metrics["emergency_count"] += 1
            return emergency_msg, {
                "is_emergency": True,
                "response_time": time.time() - start_time
            }
            
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
        
        response_time = time.time() - start_time
        self.metrics["response_times"].append(response_time)
        self.metrics["model_calls"] += 1
        
        return assistant_response, {
            "is_emergency": False,
            "response_time": response_time,
            "total_messages": self.metrics["total_messages"],
            "model_calls": self.metrics["model_calls"]
        }
        
    def generate_summary(self) -> tuple[str, dict]:
        start_time = time.time()
        summary = self.symptom_analyzer.generate_summary(
            self.conversation_manager.get_messages()
        )
        
        final_metrics = {
            "total_duration": time.time() - start_time,
            "total_messages": self.metrics["total_messages"],
            "emergency_count": self.metrics["emergency_count"],
            "avg_response_time": sum(self.metrics["response_times"]) / len(self.metrics["response_times"]),
            "total_model_calls": self.metrics["model_calls"]
        }
        
        return summary, final_metrics