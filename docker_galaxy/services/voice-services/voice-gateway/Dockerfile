FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    ffmpeg

# Set working directory
WORKDIR /app

# Copy voice gateway package files first
COPY docker_galaxy/services/voice-services/voice-gateway/package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY src/ ./src/
COPY docker_galaxy/services/voice-services/voice-gateway/ ./

# Create necessary directories
RUN mkdir -p /app/temp /app/logs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["node", "voice-server.cjs"]
