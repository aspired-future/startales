#!/usr/bin/env python3
"""
Real Coqui TTS Service
Provides text-to-speech synthesis using Coqui TTS
"""

import os
import io
import json
import asyncio
import logging
import tempfile
import base64
from typing import Optional, Dict, Any, List
from pathlib import Path

import torch
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
import redis.asyncio as redis
from TTS.api import TTS
import soundfile as sf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MODEL_NAME = os.getenv("MODEL_NAME", "tts_models/en/ljspeech/tacotron2-DDC")
DEVICE = os.getenv("DEVICE", "cpu")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Initialize FastAPI app
app = FastAPI(title="Coqui TTS Service", version="1.0.0")

# Global variables
tts_model = None
redis_client = None

class TTSRequest(BaseModel):
    text: str
    speaker_id: Optional[str] = None
    language: Optional[str] = "en"
    speed: Optional[float] = 1.0
    emotion: Optional[str] = "neutral"

class TTSResponse(BaseModel):
    audio_data: str  # Base64 encoded audio
    sample_rate: int
    duration: float
    processing_time: float
    speaker_id: Optional[str] = None

class VoiceInfo(BaseModel):
    id: str
    name: str
    language: str
    gender: str
    description: str

class StreamingTTSMessage(BaseModel):
    type: str  # "audio_chunk" or "complete"
    audio_data: str  # Base64 encoded
    chunk_index: int
    total_chunks: Optional[int] = None
    speaker_id: Optional[str] = None

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global tts_model, redis_client
    
    logger.info(f"Loading TTS model: {MODEL_NAME}")
    try:
        tts_model = TTS(model_name=MODEL_NAME, progress_bar=False)
        if DEVICE == "cuda" and torch.cuda.is_available():
            tts_model = tts_model.to(DEVICE)
        logger.info(f"TTS model loaded on device: {DEVICE}")
    except Exception as e:
        logger.error(f"Failed to load TTS model: {e}")
        # Fallback to a simpler model
        try:
            tts_model = TTS(model_name="tts_models/en/ljspeech/fast_pitch", progress_bar=False)
            logger.info("Loaded fallback TTS model")
        except Exception as e2:
            logger.error(f"Failed to load fallback model: {e2}")
            tts_model = None
    
    # Initialize Redis connection
    try:
        redis_client = redis.from_url(REDIS_URL)
        await redis_client.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
        redis_client = None

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global redis_client
    if redis_client:
        await redis_client.close()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if tts_model else "degraded",
        "model": MODEL_NAME,
        "device": DEVICE,
        "redis_connected": redis_client is not None,
        "model_loaded": tts_model is not None
    }

@app.get("/models")
async def get_models():
    """Get available TTS models"""
    return {
        "current_model": MODEL_NAME,
        "available_models": [
            "tts_models/en/ljspeech/tacotron2-DDC",
            "tts_models/en/ljspeech/fast_pitch",
            "tts_models/en/ljspeech/glow-tts",
            "tts_models/en/vctk/vits"
        ],
        "device": DEVICE
    }

@app.get("/voices", response_model=List[VoiceInfo])
async def get_voices():
    """Get available voices"""
    # Default voices for English models
    voices = [
        VoiceInfo(
            id="default",
            name="Default Voice",
            language="en",
            gender="female",
            description="Default English voice"
        ),
        VoiceInfo(
            id="speaker_0",
            name="Speaker 0",
            language="en", 
            gender="neutral",
            description="Neutral English voice"
        )
    ]
    
    # Add model-specific voices if available
    if tts_model and hasattr(tts_model, 'speakers'):
        for i, speaker in enumerate(tts_model.speakers or []):
            voices.append(VoiceInfo(
                id=f"speaker_{i}",
                name=f"Speaker {i}",
                language="en",
                gender="neutral",
                description=f"Model speaker {i}"
            ))
    
    return voices

@app.post("/synthesize", response_model=TTSResponse)
async def synthesize_speech(request: TTSRequest):
    """Synthesize speech from text"""
    if not tts_model:
        raise HTTPException(status_code=503, detail="TTS model not loaded")
    
    try:
        import time
        start_time = time.time()
        
        # Create temporary file for output
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            output_path = tmp_file.name
        
        # Synthesize speech
        if hasattr(tts_model, 'tts_to_file'):
            # Multi-speaker model
            if request.speaker_id and hasattr(tts_model, 'speakers') and tts_model.speakers:
                tts_model.tts_to_file(
                    text=request.text,
                    file_path=output_path,
                    speaker=request.speaker_id
                )
            else:
                tts_model.tts_to_file(
                    text=request.text,
                    file_path=output_path
                )
        else:
            # Single speaker model
            wav = tts_model.tts(text=request.text)
            sf.write(output_path, wav, 22050)
        
        # Read the generated audio
        audio_data, sample_rate = sf.read(output_path)
        
        # Clean up temp file
        os.unlink(output_path)
        
        # Convert to bytes and encode
        audio_bytes = io.BytesIO()
        sf.write(audio_bytes, audio_data, sample_rate, format='WAV')
        audio_bytes.seek(0)
        
        # Encode to base64
        audio_b64 = base64.b64encode(audio_bytes.read()).decode('utf-8')
        
        processing_time = time.time() - start_time
        duration = len(audio_data) / sample_rate
        
        return TTSResponse(
            audio_data=audio_b64,
            sample_rate=sample_rate,
            duration=duration,
            processing_time=processing_time,
            speaker_id=request.speaker_id
        )
        
    except Exception as e:
        logger.error(f"TTS synthesis error: {e}")
        raise HTTPException(status_code=500, detail=f"Synthesis failed: {str(e)}")

@app.post("/synthesize/stream")
async def synthesize_speech_stream(request: TTSRequest):
    """Stream synthesized speech in chunks"""
    if not tts_model:
        raise HTTPException(status_code=503, detail="TTS model not loaded")
    
    async def generate_audio_stream():
        try:
            # Create temporary file for output
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
                output_path = tmp_file.name
            
            # Synthesize speech
            if hasattr(tts_model, 'tts_to_file'):
                if request.speaker_id and hasattr(tts_model, 'speakers') and tts_model.speakers:
                    tts_model.tts_to_file(
                        text=request.text,
                        file_path=output_path,
                        speaker=request.speaker_id
                    )
                else:
                    tts_model.tts_to_file(
                        text=request.text,
                        file_path=output_path
                    )
            else:
                wav = tts_model.tts(text=request.text)
                sf.write(output_path, wav, 22050)
            
            # Stream the audio file in chunks
            chunk_size = 4096
            with open(output_path, 'rb') as f:
                while True:
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    yield chunk
            
            # Clean up
            os.unlink(output_path)
            
        except Exception as e:
            logger.error(f"Streaming TTS error: {e}")
            yield b""  # Empty chunk to signal error
    
    return StreamingResponse(
        generate_audio_stream(),
        media_type="audio/wav",
        headers={"Content-Disposition": "attachment; filename=speech.wav"}
    )

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    """WebSocket endpoint for real-time TTS streaming"""
    await websocket.accept()
    
    if not tts_model:
        await websocket.send_json({"error": "TTS model not loaded"})
        await websocket.close()
        return
    
    logger.info("WebSocket connection established for TTS streaming")
    
    try:
        while True:
            # Receive text data
            data = await websocket.receive_json()
            
            if "text" not in data:
                await websocket.send_json({"error": "Missing 'text' field"})
                continue
            
            text = data["text"]
            speaker_id = data.get("speaker_id")
            
            try:
                # Create temporary file
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
                    output_path = tmp_file.name
                
                # Synthesize
                if hasattr(tts_model, 'tts_to_file'):
                    if speaker_id and hasattr(tts_model, 'speakers') and tts_model.speakers:
                        tts_model.tts_to_file(
                            text=text,
                            file_path=output_path,
                            speaker=speaker_id
                        )
                    else:
                        tts_model.tts_to_file(text=text, file_path=output_path)
                else:
                    wav = tts_model.tts(text=text)
                    sf.write(output_path, wav, 22050)
                
                # Read and encode audio
                with open(output_path, 'rb') as f:
                    audio_data = f.read()
                
                audio_b64 = base64.b64encode(audio_data).decode('utf-8')
                
                # Send response
                response = StreamingTTSMessage(
                    type="complete",
                    audio_data=audio_b64,
                    chunk_index=0,
                    total_chunks=1,
                    speaker_id=speaker_id
                )
                
                await websocket.send_json(response.dict())
                
                # Clean up
                os.unlink(output_path)
                
            except Exception as e:
                logger.error(f"WebSocket TTS error: {e}")
                await websocket.send_json({"error": f"TTS error: {str(e)}"})
    
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=False
    )
