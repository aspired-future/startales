#!/bin/bash

# Start Voice Services for Startales
# This script starts the STT, TTS, and Voice Gateway services using Docker Compose

set -e

echo "🎙️ Starting Startales Voice Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

# Build and start services
echo "🔨 Building Docker images..."
docker-compose -f docker/docker-compose.voice.yml build

echo "🚀 Starting services..."
docker-compose -f docker/docker-compose.voice.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check Whisper STT
if curl -f http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ Whisper STT Service: Ready"
else
    echo "⚠️ Whisper STT Service: Not ready"
fi

# Check Coqui TTS
if curl -f http://localhost:8002/health > /dev/null 2>&1; then
    echo "✅ Coqui TTS Service: Ready"
else
    echo "⚠️ Coqui TTS Service: Not ready"
fi

# Check Voice Gateway
if curl -f http://localhost:8003/health > /dev/null 2>&1; then
    echo "✅ Voice Gateway Service: Ready"
else
    echo "⚠️ Voice Gateway Service: Not ready"
fi

# Check Redis
if docker-compose -f docker/docker-compose.voice.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: Ready"
else
    echo "⚠️ Redis: Not ready"
fi

echo ""
echo "🎉 Voice services started!"
echo ""
echo "📊 Service URLs:"
echo "   • Whisper STT:    http://localhost:8001"
echo "   • Coqui TTS:      http://localhost:8002"
echo "   • Voice Gateway:  http://localhost:8003"
echo "   • Demo Interface: http://localhost:8003/demo"
echo ""
echo "🔧 Management Commands:"
echo "   • View logs:      docker-compose -f docker/docker-compose.voice.yml logs -f"
echo "   • Stop services:  docker-compose -f docker/docker-compose.voice.yml down"
echo "   • Restart:        docker-compose -f docker/docker-compose.voice.yml restart"
echo ""
echo "🧪 Test the services:"
echo "   1. Open http://localhost:8003/demo in your browser"
echo "   2. Upload an audio file to test STT"
echo "   3. Enter text to test TTS"
echo "   4. Try real-time voice recording"
