#!/usr/bin/env python3
"""
Real Whisper STT Service
Provides speech-to-text transcription using OpenAI Whisper
"""

import os
import io
import json
import asyncio
import logging
from typing import Optional, Dict, Any
from pathlib import Path

import whisper
import torch
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import redis.asyncio as redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MODEL_SIZE = os.getenv("MODEL_SIZE", "base")
DEVICE = os.getenv("DEVICE", "cpu")
LANGUAGE = os.getenv("LANGUAGE", "en")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Initialize FastAPI app
app = FastAPI(title="Whisper STT Service", version="1.0.0")

# Global variables
whisper_model = None
redis_client = None

class TranscriptionRequest(BaseModel):
    audio_data: str  # Base64 encoded audio
    language: Optional[str] = "en"
    task: str = "transcribe"  # or "translate"

class TranscriptionResponse(BaseModel):
    text: str
    language: str
    confidence: float
    segments: list
    processing_time: float

class StreamingMessage(BaseModel):
    type: str  # "partial" or "final"
    text: str
    confidence: float
    timestamp: float
    speaker_id: Optional[str] = None

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global whisper_model, redis_client
    
    logger.info(f"Loading Whisper model: {MODEL_SIZE}")
    whisper_model = whisper.load_model(MODEL_SIZE, device=DEVICE)
    logger.info(f"Whisper model loaded on device: {DEVICE}")
    
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
        "status": "healthy",
        "model": MODEL_SIZE,
        "device": DEVICE,
        "language": LANGUAGE,
        "redis_connected": redis_client is not None
    }

@app.get("/models")
async def get_models():
    """Get available models"""
    return {
        "current_model": MODEL_SIZE,
        "available_models": ["tiny", "base", "small", "medium", "large"],
        "device": DEVICE
    }

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe uploaded audio file"""
    if not whisper_model:
        raise HTTPException(status_code=503, detail="Whisper model not loaded")
    
    try:
        import time
        start_time = time.time()
        
        # Read audio file
        audio_data = await file.read()
        
        # Save to temporary file
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(audio_data)
        
        # Transcribe
        result = whisper_model.transcribe(
            temp_path,
            language=LANGUAGE,
            task="transcribe",
            fp16=False,
            verbose=False
        )
        
        # Clean up temp file
        os.unlink(temp_path)
        
        processing_time = time.time() - start_time
        
        # Calculate average confidence
        avg_confidence = 0.0
        if "segments" in result and result["segments"]:
            confidences = [seg.get("confidence", 0.0) for seg in result["segments"]]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        
        return TranscriptionResponse(
            text=result["text"].strip(),
            language=result.get("language", LANGUAGE),
            confidence=avg_confidence,
            segments=result.get("segments", []),
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    """WebSocket endpoint for real-time streaming transcription"""
    await websocket.accept()
    
    if not whisper_model:
        await websocket.send_json({"error": "Whisper model not loaded"})
        await websocket.close()
        return
    
    logger.info("WebSocket connection established for streaming")
    
    try:
        audio_buffer = bytearray()
        chunk_size = 16000 * 2  # 1 second of 16kHz 16-bit audio
        
        while True:
            # Receive audio data
            data = await websocket.receive_bytes()
            audio_buffer.extend(data)
            
            # Process when we have enough data
            if len(audio_buffer) >= chunk_size:
                # Extract chunk
                chunk = bytes(audio_buffer[:chunk_size])
                audio_buffer = audio_buffer[chunk_size:]
                
                # Convert to numpy array
                audio_np = np.frombuffer(chunk, dtype=np.int16).astype(np.float32) / 32768.0
                
                # Transcribe chunk
                try:
                    result = whisper_model.transcribe(
                        audio_np,
                        language=LANGUAGE,
                        task="transcribe",
                        fp16=False,
                        verbose=False
                    )
                    
                    # Send partial result
                    response = StreamingMessage(
                        type="partial",
                        text=result["text"].strip(),
                        confidence=0.8,  # Placeholder confidence
                        timestamp=asyncio.get_event_loop().time(),
                        speaker_id="default"
                    )
                    
                    await websocket.send_json(response.dict())
                    
                except Exception as e:
                    logger.error(f"Streaming transcription error: {e}")
                    await websocket.send_json({
                        "error": f"Transcription error: {str(e)}"
                    })
    
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

@app.post("/transcribe/text")
async def transcribe_text_data(request: TranscriptionRequest):
    """Transcribe base64 encoded audio data"""
    if not whisper_model:
        raise HTTPException(status_code=503, detail="Whisper model not loaded")
    
    try:
        import base64
        import time
        
        start_time = time.time()
        
        # Decode base64 audio data
        audio_data = base64.b64decode(request.audio_data)
        
        # Save to temporary file
        temp_path = f"/tmp/audio_{int(time.time())}.wav"
        with open(temp_path, "wb") as f:
            f.write(audio_data)
        
        # Transcribe
        result = whisper_model.transcribe(
            temp_path,
            language=request.language or LANGUAGE,
            task=request.task,
            fp16=False,
            verbose=False
        )
        
        # Clean up
        os.unlink(temp_path)
        
        processing_time = time.time() - start_time
        
        # Calculate confidence
        avg_confidence = 0.0
        if "segments" in result and result["segments"]:
            confidences = [seg.get("confidence", 0.0) for seg in result["segments"]]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        
        return TranscriptionResponse(
            text=result["text"].strip(),
            language=result.get("language", request.language or LANGUAGE),
            confidence=avg_confidence,
            segments=result.get("segments", []),
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Text transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=False
    )
