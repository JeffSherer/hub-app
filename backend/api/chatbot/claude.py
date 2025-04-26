from fastapi import APIRouter
import os

router = APIRouter()

USE_SIMULATION = os.getenv("USE_SIMULATION", "True").lower() == "true"

@router.post("/chatbot/claude")
async def chat_with_claude(prompt: str):
    if USE_SIMULATION:
        return {"response": f"[Simulated Claude] Echo: {prompt}"}
    
    # (Placeholder for real API call when you're ready)
    return {"response": "Real Claude API call not yet implemented"}
