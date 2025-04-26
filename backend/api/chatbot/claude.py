from fastapi import APIRouter

router = APIRouter()

@router.post("/chatbot/claude")
async def chat_with_claude(prompt: str):
    # Simulate a Claude response
    return {"response": f"Simulated Claude response to: {prompt}"}
