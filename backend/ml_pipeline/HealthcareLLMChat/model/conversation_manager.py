class ConversationManager:
    def __init__(self):
        self.messages = []
        
    def add_message(self, role: str, content: str):
        """Add a message to the conversation history"""
        self.messages.append({"role": role, "content": content})
        
    def get_messages(self):
        """Get all messages in the conversation"""
        return self.messages
        
    def clear_history(self):
        """Clear the conversation history"""
        self.messages = []