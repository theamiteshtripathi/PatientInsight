from backend.models.RAG.src.generator import Generator
from backend.config.config import Config

def test_generator():
    # Test query
    query = "signs of agitation and paranoia, anxiety and combative behavior"
    
    # Sample context (simulating retrieved documents)
    context = """Patient exhibited signs of agitation and paranoia. Was given 0.5mg lorazepam which helped calm them.
                Another patient showed similar defensive behavior. Responded well to quiet environment and gentle approach.
                Case of elderly patient with anxiety and combative behavior. Successfully managed with low-dose antipsychotics."""
    
    try:
        # Initialize generator
        generator = Generator()
        
        # Generate response
        print("Generating response...")
        response = generator.generate(context, query)
        
        print("\nOriginal Query:")
        print(query)
        print("\nSimilar Cases Context:")
        print(context)
        print("\nGenerated Analysis:")
        print(response)
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    Config.validate_env_vars()
    test_generator() 