from fastapi import FastAPI
from api.chatbot import openai, claude
from api.multimodal import gemini

app = FastAPI()

# Include the new routers
app.include_router(openai.router)
app.include_router(claude.router)
app.include_router(gemini.router)

# Keep your original health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Hub backend is running"}