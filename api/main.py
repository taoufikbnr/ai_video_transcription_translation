# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import whisper
from moviepy import VideoFileClip

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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
@app.post("/upload")
async def upload_video():
    model = whisper.load_model("base")

    # Load and extract audio from video
    video = VideoFileClip("./welcome.mp4")
    video.audio.write_audiofile("temp_audio.wav")

    # Transcribe audio
    result = model.transcribe("temp_audio.wav")
    print("Transcript:\n", result["text"])
    

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Transcription Waiter API"}

