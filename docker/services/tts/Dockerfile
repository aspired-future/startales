# TTS (Text-to-Speech) Service - Coqui TTS
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    espeak-ng \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY docker/services/tts/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy TTS service code
COPY docker/services/tts/app.py .

# Create non-root user
RUN useradd -m -u 1001 ttsuser && chown -R ttsuser:ttsuser /app
USER ttsuser

# Create model and cache directories
RUN mkdir -p /app/models /app/cache

# Expose TTS port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start TTS service
CMD ["python", "app.py"]
