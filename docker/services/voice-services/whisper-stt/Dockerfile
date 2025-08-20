FROM python:3.11-slim

# Install system dependencies including build tools
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    build-essential \
    gcc \
    g++ \
    make \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY docker/services/voice-services/whisper-stt/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY docker/services/voice-services/whisper-stt/ .

# Create models directory
RUN mkdir -p /app/models

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["python", "app.py"]
