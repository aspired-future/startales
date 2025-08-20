# Startales Microservices Docker Configuration

This directory contains all Docker-related files organized by microservice architecture principles.

## 🏗️ Microservices Architecture

### Service Organization
```
docker/
├── services/
│   ├── api/              # Core API services (lightweight)
│   ├── ui/               # Frontend UI service (lightweight)
│   ├── database/         # Database services (moderate resources)
│   ├── ai-services/      # LLM services (resource intensive)
│   ├── voice-services/   # STT/TTS services (resource intensive)
│   └── game-engine/      # Game simulation services
├── docker-compose.master.yml  # Master orchestration
└── start-services.sh     # Smart startup script
```

### Resource-Intensive Services (Separated for Scaling)
- **AI Services**: Ollama LLM, AI Gateway (8GB+ RAM recommended)
- **Voice Services**: Whisper STT, Coqui TTS (6GB+ RAM recommended)
- **Core Services**: API, UI, Database (2GB+ RAM minimum)

## 🚀 Quick Start

### Option 1: Smart Startup Script (Recommended)
```bash
# Lightweight core services only
./docker/start-services.sh core

# Core + AI services (requires 8GB+ RAM)
./docker/start-services.sh ai

# Core + Voice services (requires 6GB+ RAM)  
./docker/start-services.sh voice

# Everything (requires 16GB+ RAM)
./docker/start-services.sh full

# Show service status
./docker/start-services.sh --status

# Stop all services
./docker/start-services.sh --stop
```

### Option 2: Direct Docker Compose
```bash
# Core services only
docker compose -f docker/docker-compose.master.yml up -d api ui postgres redis nats

# With AI services
docker compose -f docker/docker-compose.master.yml --profile ai up -d

# With Voice services
docker compose -f docker/docker-compose.master.yml --profile voice up -d

# Everything
docker compose -f docker/docker-compose.master.yml --profile full up -d
```

## Available Demos

When running the demo environment, the following demos are available:

### Game Systems
- `/demo/hud` - Comprehensive game HUD with all systems
- `/demo/simulation` - Simulation engine demo
- `/demo/population` - Population system demo
- `/demo/professions` - Professions and industries demo

### Governance & Politics
- `/demo/policies` - Policy creation and management
- `/demo/leader-communications` - Comprehensive leader communications system (briefings, speeches, decisions)
- `/demo/speech` - Redirects to leader communications system
- `/demo/cabinet` - Cabinet & Bureaucracy Management System with voice/text command interface
- `/demo/delegation` - Delegation & Authority Management System
- `/demo/military` - Enhanced War Simulator with AI-driven morale, alliance warfare, sensor networks & intelligence operations

### Economy & Trade
- `/demo/trade` - Trade and economy system

### Voice & Communication
- `/demo/voice` - STT/TTS voice demo (requires voice services)

### Social Network
- Witter Feed UI at `http://localhost:5173`
- Witter API at `http://localhost:4000/api/witter/feed`

## Quick Start

```bash
# Start main demo environment
docker compose -f docker/docker-compose.demo.yml up -d

# Start with voice services
docker compose -f docker/docker-compose.voice.yml up -d

# View logs
docker compose -f docker/docker-compose.demo.yml logs -f

# Stop services
docker compose -f docker/docker-compose.demo.yml down
```

## Service Ports

- **UI**: http://localhost:5173
- **API**: http://localhost:4000
- **Whisper STT**: http://localhost:8001
- **Coqui TTS**: http://localhost:8002
- **Voice Gateway**: http://localhost:8003
