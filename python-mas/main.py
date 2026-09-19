import os
from dotenv import load_dotenv

# Load env variables before importing anything that uses them
load_dotenv()

from graph import mas_graph

def run_mas(message: str, language: str = "hi", form_context: str = ""):
    print(f"\n--- Starting MAS with query: '{message}' ---")
    
    # Initial state
    inputs = {
        "message": message,
        "language": language,
        "formContext": form_context,
        "intent": "",
        "finalReply": ""
    }
    
    # Invoke graph
    result = mas_graph.invoke(inputs)
    
    print("✅ [MAS] Execution Complete.")
    print(f"Detected Intent: {result['intent']}")
    print(f"Final Reply: {result['finalReply']}")
    print("-" * 50)

if __name__ == "__main__":
    if not os.getenv("SARVAM_API_KEY"):
        print("⚠️ Warning: SARVAM_API_KEY not found in .env")
        
    print("Welcome to Paytm Saarthi (Python MAS Edition)")
    
    # Test cases
    run_mas("Mera emi kitna hoga?", "hi")
    run_mas("What is the problem in the form?", "en")
    run_mas("Mera kal ka loan history batao", "hi")
    run_mas("Namaste bhai", "hi")
