import os
from backend.models.HealthcareLLMChat.src.model.chat_pipeline import ChatPipeline

def main():
    # Initialize the chat pipeline with your API key
    api_key = os.getenv("OPENAI_API_KEY")
    chat_pipeline = ChatPipeline(api_key)
    
    # Start conversation
    print("Assistant:", chat_pipeline.start_conversation())
    
    while True:
        # Get user input
        user_input = input("\nUser: ")
        
        # Check for exit condition
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("\nGenerating final summary...")
            summary = chat_pipeline.generate_summary()
            print("\nSYMPTOM SUMMARY:")
            print(summary)
            break
            
        # Get response
        response = chat_pipeline.get_response(user_input)
        print("Assistant:", response)

if __name__ == "__main__":
    main()


