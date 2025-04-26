from fastapi import APIRouter

router = APIRouter()

@router.post("/chatbot/openai")
async def chat_with_openai(prompt: str):
    # Right now, we simulate a response
    return {"response": f"Simulated OpenAI response to: {prompt}"}
