#!/usr/bin/env python3
"""
STT (Speech-to-Text) Service using OpenAI Whisper
Scalable microservice for converting audio to text
"""

import os
import tempfile
import logging
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import torch
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="StarTales STT Service",
    description="Speech-to-Text service using OpenAI Whisper",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None

def load_whisper_model():
    """Load Whisper model with optimal settings"""
    global model
    
    model_size = os.getenv("MODEL_SIZE", "base")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    logger.info(f"Loading Whisper model '{model_size}' on device '{device}'")
    
    try:
        model = whisper.load_model(model_size, device=device)
        logger.info("Whisper model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load Whisper model: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Initialize the STT service"""
    load_whisper_model()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "stt",
        "model_loaded": model is not None,
        "device": "cuda" if torch.cuda.is_available() else "cpu"
    }

@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = None
):
    """
    Transcribe audio file to text
    
    Args:
        audio: Audio file (wav, mp3, m4a, etc.)
        language: Optional language code (e.g., 'en', 'es', 'fr')
    
    Returns:
        Transcription result with text and metadata
    """
    if model is None:
        raise HTTPException(status_code=503, detail="STT model not loaded")
    
    # Validate file type
    if not audio.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Transcribe audio
        logger.info(f"Transcribing audio file: {audio.filename}")
        
        transcribe_options = {}
        if language:
            transcribe_options["language"] = language
        
        result = model.transcribe(temp_file_path, **transcribe_options)
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        # Return structured result
        return {
            "text": result["text"].strip(),
            "language": result.get("language", "unknown"),
            "segments": [
                {
                    "start": seg["start"],
                    "end": seg["end"],
                    "text": seg["text"].strip()
                }
                for seg in result.get("segments", [])
            ],
            "confidence": sum(seg.get("avg_logprob", 0) for seg in result.get("segments", [])) / max(len(result.get("segments", [])), 1)
        }
        
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        # Clean up temp file if it exists
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.get("/models")
async def list_models():
    """List available Whisper models"""
    return {
        "available_models": [
            "tiny", "base", "small", "medium", "large", "large-v2", "large-v3"
        ],
        "current_model": os.getenv("MODEL_SIZE", "base"),
        "device": "cuda" if torch.cuda.is_available() else "cpu"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )
