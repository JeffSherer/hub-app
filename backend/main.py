from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from api.chatbot import openai, claude
from api.multimodal import gemini
from routes.fine_tune import router as fine_tune_router

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Allow frontend (localhost:3000) to talk to backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all your routers
app.include_router(openai.router)
app.include_router(claude.router)
app.include_router(gemini.router)
app.include_router(fine_tune_router)

# Simple health check route
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Hub backend is running"}
