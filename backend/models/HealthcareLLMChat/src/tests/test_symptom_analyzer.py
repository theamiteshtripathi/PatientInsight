import os
from backend.models.HealthcareLLMChat.src.model.symptom_analyzer import SymptomAnalyzer

print("Testing SymptomAnalyzer")

def test_symptom_analyzer():
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        return
        
    analyzer = SymptomAnalyzer(api_key)
    
    # Simulate a conversation history
    conversation_history = [
        {"role": "assistant", "content": "Hello, how are you feeling today?"},
        {"role": "user", "content": "I have been having severe headaches and feeling dizzy for the past week"},
        {"role": "assistant", "content": "I'm sorry to hear that. Can you tell me more about when these headaches occur and their intensity?"},
        {"role": "user", "content": "They're worse in the morning and make it hard to concentrate. Sometimes light makes them worse."}
    ]
    
    try:
        # Generate and print summary
        print("\nGenerating symptom summary...")
        summary = analyzer.generate_summary(conversation_history)
        print("\nSymptom Summary:")
        print(summary)
    except Exception as e:
        print(f"Error generating summary: {str(e)}")

if __name__ == "__main__":
    test_symptom_analyzer() 