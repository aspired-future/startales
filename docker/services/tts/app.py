#!/usr/bin/env python3
"""
TTS (Text-to-Speech) Service using Coqui TTS
Scalable microservice for converting text to speech
"""

import os
import tempfile
import logging
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import torch
import uvicorn
from TTS.api import TTS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="StarTales TTS Service",
    description="Text-to-Speech service using Coqui TTS",
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

# Request models
class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = None
    speed: Optional[float] = 1.0
    language: Optional[str] = "en"

class VoiceCloneRequest(BaseModel):
    text: str
    speaker_wav: str  # Path or URL to speaker audio
    language: Optional[str] = "en"

# Global TTS model
tts_model = None

def load_tts_model():
    """Load TTS model with optimal settings"""
    global tts_model
    
    model_name = os.getenv("MODEL_NAME", "tts_models/en/ljspeech/tacotron2-DDC")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    logger.info(f"Loading TTS model '{model_name}' on device '{device}'")
    
    try:
        tts_model = TTS(model_name=model_name, progress_bar=False, gpu=(device == "cuda"))
        logger.info("TTS model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load TTS model: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Initialize the TTS service"""
    load_tts_model()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "tts",
        "model_loaded": tts_model is not None,
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "model_name": os.getenv("MODEL_NAME", "tts_models/en/ljspeech/tacotron2-DDC")
    }

@app.post("/synthesize")
async def synthesize_speech(request: TTSRequest):
    """
    Convert text to speech
    
    Args:
        request: TTS request with text and optional parameters
    
    Returns:
        Audio file response
    """
    if tts_model is None:
        raise HTTPException(status_code=503, detail="TTS model not loaded")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Create temporary file for output
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            output_path = temp_file.name
        
        logger.info(f"Synthesizing speech for text: {request.text[:50]}...")
        
        # Generate speech
        tts_model.tts_to_file(
            text=request.text,
            file_path=output_path,
            speaker=request.voice,
            language=request.language,
            speed=request.speed
        )
        
        # Return audio file
        return FileResponse(
            output_path,
            media_type="audio/wav",
            filename="speech.wav",
            background=lambda: os.unlink(output_path)  # Clean up after sending
        )
        
    except Exception as e:
        logger.error(f"Speech synthesis failed: {e}")
        # Clean up temp file if it exists
        if 'output_path' in locals():
            try:
                os.unlink(output_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Speech synthesis failed: {str(e)}")

@app.post("/clone-voice")
async def clone_voice_speech(request: VoiceCloneRequest):
    """
    Convert text to speech using voice cloning
    
    Args:
        request: Voice cloning request with text and speaker audio
    
    Returns:
        Audio file response with cloned voice
    """
    if tts_model is None:
        raise HTTPException(status_code=503, detail="TTS model not loaded")
    
    if not hasattr(tts_model, 'tts_with_vc_to_file'):
        raise HTTPException(status_code=501, detail="Voice cloning not supported by current model")
    
    try:
        # Create temporary file for output
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            output_path = temp_file.name
        
        logger.info(f"Cloning voice for text: {request.text[:50]}...")
        
        # Generate speech with voice cloning
        tts_model.tts_with_vc_to_file(
            text=request.text,
            speaker_wav=request.speaker_wav,
            file_path=output_path,
            language=request.language
        )
        
        # Return audio file
        return FileResponse(
            output_path,
            media_type="audio/wav",
            filename="cloned_speech.wav",
            background=lambda: os.unlink(output_path)  # Clean up after sending
        )
        
    except Exception as e:
        logger.error(f"Voice cloning failed: {e}")
        # Clean up temp file if it exists
        if 'output_path' in locals():
            try:
                os.unlink(output_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Voice cloning failed: {str(e)}")

@app.get("/models")
async def list_models():
    """List available TTS models"""
    try:
        available_models = TTS.list_models()
        return {
            "available_models": available_models,
            "current_model": os.getenv("MODEL_NAME", "tts_models/en/ljspeech/tacotron2-DDC"),
            "device": "cuda" if torch.cuda.is_available() else "cpu"
        }
    except Exception as e:
        logger.error(f"Failed to list models: {e}")
        return {
            "available_models": [],
            "current_model": os.getenv("MODEL_NAME", "tts_models/en/ljspeech/tacotron2-DDC"),
            "device": "cuda" if torch.cuda.is_available() else "cpu",
            "error": str(e)
        }

@app.get("/voices")
async def list_voices():
    """List available voices for current model"""
    if tts_model is None:
        raise HTTPException(status_code=503, detail="TTS model not loaded")
    
    try:
        # Get speakers if available
        speakers = getattr(tts_model, 'speakers', [])
        return {
            "voices": speakers if speakers else ["default"],
            "model_supports_speakers": len(speakers) > 0
        }
    except Exception as e:
        logger.error(f"Failed to list voices: {e}")
        return {
            "voices": ["default"],
            "model_supports_speakers": False,
            "error": str(e)
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
