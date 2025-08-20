FROM python:3.10-slim

# Install system dependencies including build tools
RUN apt-get update && apt-get install -y \
    espeak-ng \
    espeak-ng-data \
    libsndfile1 \
    curl \
    git \
    build-essential \
    gcc \
    g++ \
    make \
    cmake \
    pkg-config \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY docker/services/voice-services/coqui-tts/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY docker/services/voice-services/coqui-tts/ .

# Create directories
RUN mkdir -p /app/models /app/cache

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["python", "app.py"]
