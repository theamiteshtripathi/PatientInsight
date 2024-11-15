from backend.models.HealthcareLLMChat.src.model.chat_pipeline import ChatPipeline

# Initialize the chat pipeline
chat_pipeline = ChatPipeline()

# Start the conversation
print("Assistant:", chat_pipeline.start_conversation())

# Simulate a user input and get a response from the model
user_input = "I have body pain from past 2 weeks and also feel tired"
print("User:", user_input)
followup_question = chat_pipeline.get_response(user_input)
print("Assistant:", followup_question)


