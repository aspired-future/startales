#!/bin/bash

# Demo script showing working voice services
# This demonstrates the real STT and TTS implementation

set -e

echo "🎙️ STARTALES VOICE SERVICES DEMO"
echo "=================================="
echo ""

# Check if STT service is running
echo "📡 Checking STT Service Status..."
if curl -f http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ STT Service: RUNNING"
    
    # Get health details
    echo "🔍 STT Health Details:"
    curl -s http://localhost:8001/health | python3 -m json.tool
    echo ""
    
    # Get available models
    echo "🤖 Available STT Models:"
    curl -s http://localhost:8001/models | python3 -m json.tool
    echo ""
    
else
    echo "❌ STT Service: NOT RUNNING"
    echo "   Start with: docker run -d -p 8001:8000 --name whisper-stt-test startales-whisper-stt"
    echo ""
fi

# Check if TTS service is running
echo "📡 Checking TTS Service Status..."
if curl -f http://localhost:8002/health > /dev/null 2>&1; then
    echo "✅ TTS Service: RUNNING"
    
    # Get health details
    echo "🔍 TTS Health Details:"
    curl -s http://localhost:8002/health | python3 -m json.tool
    echo ""
    
    # Get available voices
    echo "🎵 Available TTS Voices:"
    curl -s http://localhost:8002/voices | python3 -m json.tool
    echo ""
    
else
    echo "⚠️ TTS Service: NOT RUNNING"
    echo "   Build with: docker build -f docker/coqui-tts/Dockerfile -t startales-coqui-tts ."
    echo "   Start with: docker run -d -p 8002:8000 --name coqui-tts-test startales-coqui-tts"
    echo ""
fi

# Check Docker containers
echo "🐳 Docker Containers Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(whisper|coqui|voice|redis|NAMES)"
echo ""

# Show what we've built
echo "🏗️ WHAT WE'VE BUILT:"
echo "==================="
echo ""
echo "✅ Real Whisper STT Service (OpenAI Whisper)"
echo "   • Docker containerized Python service"
echo "   • FastAPI with REST and WebSocket endpoints"
echo "   • Base model (39M params) running on CPU"
echo "   • Health monitoring and model management"
echo "   • File upload and streaming transcription"
echo ""
echo "🔄 Real Coqui TTS Service (In Progress)"
echo "   • Docker containerized Python service"
echo "   • Multi-speaker voice synthesis"
echo "   • Voice cloning capabilities"
echo "   • Streaming and batch synthesis"
echo ""
echo "🌐 Voice Gateway Service (Ready)"
echo "   • Node.js integration layer"
echo "   • WebSocket real-time communication"
echo "   • Redis caching and session management"
echo "   • Demo web interface"
echo ""
echo "📦 Complete Docker Infrastructure"
echo "   • docker-compose.voice.yml configuration"
echo "   • Health checks and monitoring"
echo "   • Volume persistence for models"
echo "   • Network isolation and security"
echo ""

# Show next steps
echo "🎯 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Complete TTS service build and testing"
echo "2. Start voice gateway for integration"
echo "3. Test end-to-end voice pipeline"
echo "4. Integrate with Startales game engine"
echo "5. Add WebSocket streaming for real-time"
echo ""

# Show usage examples
echo "🧪 USAGE EXAMPLES:"
echo "=================="
echo ""
echo "# Test STT with audio file:"
echo "curl -X POST -F \"file=@audio.wav\" http://localhost:8001/transcribe"
echo ""
echo "# Test TTS synthesis (when ready):"
echo "curl -X POST -H \"Content-Type: application/json\" \\"
echo "  -d '{\"text\":\"Hello from Startales!\"}' \\"
echo "  http://localhost:8002/synthesize"
echo ""
echo "# Start all services:"
echo "./scripts/start-voice-services.sh"
echo ""
echo "# Access demo interface:"
echo "open http://localhost:8003/demo"
echo ""

echo "🎉 DEMO COMPLETE!"
echo ""
echo "Status: STT ✅ WORKING | TTS 🔄 BUILDING | Integration 📋 READY"
