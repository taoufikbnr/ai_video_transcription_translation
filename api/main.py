# main.py

from fastapi import FastAPI, UploadFile, HTTPException,File,Form
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import asyncio
from moviepy import VideoFileClip

import logging
from api.utils.clients import whisper_model,groq_client

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

jobs = {}

async def process_video(file_path: str, target_language: str, job_id: str):
    try:
        # Extract audio from video
        with VideoFileClip(file_path) as video:
            audio_path = f"uploads/{job_id}_audio.mp3"
            video.audio.write_audiofile(audio_path)
        
        with open(audio_path, "rb"):
            result = whisper_model.transcribe(audio_path)

        translation = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                messages=[
                    {"role": "system", "content": f"Only Translate the following text to {target_language}.Maintain the original meaning and dont write anything extra:"},
                    {"role": "user", "content": result["text"]}
                ]
            )
        jobs[job_id] = {
            "status": "completed",
            "transcription": result["text"],
            "translation": translation.choices[0].message.content
        }
        
        os.remove(audio_path)
        os.remove(file_path)
        
    except Exception as e:
        jobs[job_id] = {"status": "error","error": str(e)}

@app.post("/upload")
async def upload_video(file: UploadFile = File(...), target_language: str = Form(...)):
    if not file.filename.endswith('.mp4'):
        raise HTTPException(status_code=400, detail="Only MP4 files are allowed")

    job_id = str(uuid.uuid4())
    file_path = f"uploads/{job_id}.mp4"
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    jobs[job_id] = {"status": "processing"}
    
    # processing tasks in background to not block thread
    asyncio.create_task(process_video(file_path, target_language, job_id))
    
    return {"job_id": job_id}

@app.get("/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Transcription Waiter API"}

