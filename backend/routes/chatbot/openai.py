from fastapi import APIRouter
import os

router = APIRouter()

USE_SIMULATION = os.getenv("USE_SIMULATION", "True").lower() == "true"

@router.post("/chatbot/openai")
async def chat_with_openai(prompt: str):
    if USE_SIMULATION:
        return {"response": f"[Simulated OpenAI] Echo: {prompt}"}
    
    # (Placeholder for real API call when you're ready)
    return {"response": "Real OpenAI API call not yet implemented"}
