# main.py

from fastapi import FastAPI

import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import logging

# Initialize Logger
logger = logging.getLogger(__name__)



app = FastAPI(
    title="AI Video Transcription Transclation",
    description="Application for handling video Transcription  ",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,

)

# Include routers

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Transcription Waiter API"}

