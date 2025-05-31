# clients.py

import whisper
import groq
import os
from dotenv import load_dotenv

load_dotenv()

def initialize_whisper():
    model_name = os.getenv("WHISPER_MODEL", "base")
    try:
        model = whisper.load_model(model_name)
        print(f"Whisper model '{model_name}' initialized successfully.")
        return model
    except Exception as e:
        print(f"Error initializing Whisper model: {e}")
        return None

def initialize_groq():
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY is required and not set in .env file")

    try:
        groq_client = groq.Client(api_key=groq_api_key)
        return groq_client
    except Exception as e:
        print(f"Error initializing Groq client: {e}")
        return None

whisper_model = initialize_whisper()
groq_client = initialize_groq()

