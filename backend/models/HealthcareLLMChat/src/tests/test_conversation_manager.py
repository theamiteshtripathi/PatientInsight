from backend.models.HealthcareLLMChat.src.model.conversation_manager import ConversationManager

print("Testing ConversationManager")

def test_conversation_manager():
    manager = ConversationManager()
    
    # Test adding messages
    manager.add_message("user", "Hello")
    manager.add_message("assistant", "Hi, how are you feeling today?")
    
    # Test getting messages
    messages = manager.get_messages()
    print("Messages:", messages)
    
    # Test clearing history
    manager.clear_history()
    print("After clearing:", manager.get_messages())

if __name__ == "__main__":
    test_conversation_manager() 