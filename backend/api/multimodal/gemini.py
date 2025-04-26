from fastapi import APIRouter

router = APIRouter()

@router.post("/multimodal/gemini")
async def multimodal_query(prompt: str):
    return {"response": f"Simulated Gemini response to: {prompt}"}
