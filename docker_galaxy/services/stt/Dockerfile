# STT (Speech-to-Text) Service - Whisper
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY docker_galaxy/services/stt/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy STT service code
COPY docker_galaxy/services/stt/app.py .

# Create non-root user
RUN useradd -m -u 1001 sttuser && chown -R sttuser:sttuser /app
USER sttuser

# Create model cache directory
RUN mkdir -p /app/models

# Expose STT port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start STT service
CMD ["python", "app.py"]
