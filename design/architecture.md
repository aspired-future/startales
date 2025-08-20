# Startales: Galactic Conquest & Strategy — Technical Architecture

## System Overview
- **Real-Time Voice-Driven Strategy**: 24/7 continuous simulation with voice-first interface and <800ms command execution
- **Multi-Species Galaxy**: 8+ playable races with sophisticated AI NPCs at empire, regional, and character levels
- **Scalable Microservices**: Docker containerized services supporting 50-10,000 players with horizontal scaling
- **Advanced AI Systems**: Military conquest, psychic warfare, AI consciousness, dynamic narratives, and multi-agent diplomacy
- **Provider Adapter Framework**: Unified abstraction for LLM/STT/TTS/Image/Video/Embeddings with hot-switching capabilities

## Architecture Paradigm Shift
**From Turn-Based RPG to Real-Time Galactic Strategy:**
- **Continuous Simulation**: Universe evolves 24/7 with 10Hz tick rate, accelerated offline progression
- **Voice Command Interface**: Natural language commands execute immediately with real-time feedback
- **Massive Scale**: Designed to support thousands of concurrent players across multiple star systems
- **Complex Systems**: Military bases, supply chains, psychic academies, AI development labs, diplomatic networks
- **Living NPCs**: AI-driven characters with personalities, relationships, learning, and cultural awareness

---

## Microservices Architecture

### Core Infrastructure Services

#### 1. API Gateway Service
- **Purpose**: Single entry point, routing, authentication, rate limiting
- **Technology**: Node.js + Express + Redis
- **Scaling**: 2-5 instances behind NGINX load balancer
- **Responsibilities**:
  - Request routing to appropriate services
  - JWT authentication and authorization
  - Rate limiting and DDoS protection
  - Request/response transformation
  - API versioning and circuit breakers

#### 2. Realtime Gateway Service (WebSocket)
- **Purpose**: WebSocket connections, real-time communication, voice streaming
- **Technology**: Node.js + ws + Redis Pub/Sub + WebRTC
- **Scaling**: 5-20 instances with sticky sessions
- **Responsibilities**:
  - WebSocket connection management (10,000+ concurrent)
  - Real-time message routing and presence tracking
  - Voice command streaming and processing
  - Channel management and authentication
  - Backpressure handling and rate limiting

### Game Logic Services

#### 3. Campaign Service
- **Purpose**: Campaign management, game state, player coordination
- **Technology**: Node.js + PostgreSQL + Redis
- **Scaling**: 2-10 instances with database sharding
- **Responsibilities**:
  - Campaign CRUD operations and session management
  - Player management and alliance coordination
  - Game state persistence and synchronization
  - Multi-species race management

#### 4. Simulation Engine Service
- **Purpose**: Real-time game simulation, physics, continuous progression
- **Technology**: Node.js + PostgreSQL + Redis + NATS
- **Scaling**: 5-50 instances (CPU intensive, auto-scaling)
- **Responsibilities**:
  - 10Hz game tick processing with offline acceleration
  - Military unit movement and combat resolution
  - Economic simulation and resource management
  - Territory development and population growth
  - Psychic power calculations and AI behavior

#### 5. Military Service
- **Purpose**: Combat resolution, unit management, base operations
- **Technology**: Node.js + PostgreSQL + Redis
- **Scaling**: 3-15 instances with combat queue processing
- **Responsibilities**:
  - Land/sea/air/space/cyber combat resolution
  - Military base management and construction
  - Supply chain logistics and ammunition tracking
  - Unit training and equipment management
  - Strategic AI for NPC military decisions

#### 6. Provider Adapter Service
- **Purpose**: AI provider integrations with hot-switching capabilities
- **Technology**: Node.js + Redis Queue + Registry Pattern
- **Scaling**: 3-15 instances with provider load balancing
- **Responsibilities**:
  - LLM request processing with context-aware routing
  - STT/TTS processing for voice commands and responses
  - Image/video generation for scenes and characters
  - Provider failover and load balancing
  - Response caching and metrics collection

---

## Real-Time Systems

### Continuous Simulation Engine
```yaml
Tick Processing (10Hz):
  - Military unit movements and combat resolution
  - Economic production and resource generation
  - Research progress and technology advancement
  - Population growth and territory development
  - Diplomatic relationship evolution
  - AI NPC decision making and learning

Offline Acceleration:
  - 1 second = 1 game hour when no players online
  - Automatic catch-up summaries for returning players
  - Event logging for historical analysis
  - State snapshots for quick restoration
```

### Voice Command Processing
```yaml
Voice Pipeline (<800ms total):
  1. Audio capture and noise reduction (50ms)
  2. Speech-to-text conversion (200ms)
  3. Natural language understanding (150ms)
  4. Command validation and routing (100ms)
  5. Action execution and response (200ms)
  6. Text-to-speech synthesis (100ms)

Command Categories:
  - Military: "Deploy 5th Fleet to Alpha Centauri"
  - Economic: "Increase mining on asteroid belt"
  - Diplomatic: "Open negotiations with Zephyrians"
  - Research: "Prioritize psychic warfare research"
  - Character: "Promote General Chen to Admiral"
```

---

## Multi-Species System Architecture

### Species Management
```yaml
Playable Races (8 Core + Expandable):
  - Humans: Balanced, diplomatic, adaptable
  - Zephyrians: Psychic masters, telepathic networks
  - Mechanoids: AI-based, technological superiority
  - Crystalline Collective: Hive-mind, perfect coordination
  - Void Walkers: Energy beings, temporal manipulation
  - Bio-Shapers: Genetic masters, living technology
  - Quantum Entities: Probability manipulation
  - Ancient Remnants: Precursor technology, artifacts

Species Characteristics:
  - Unique racial bonuses and penalties
  - Species-specific technologies and units
  - Cultural values and diplomatic preferences
  - Voice synthesis and language patterns
  - Evolutionary paths and advancement trees
```

### AI NPC Hierarchy
```yaml
Tier 1 - Major AI Empires:
  - Full strategic capabilities matching players
  - Complex diplomatic maneuvering
  - Long-term planning and adaptation
  - Personality-driven decision making
  - Voice-driven interactions with unique speech patterns

Tier 2 - Regional Powers:
  - Specialized focus areas (trade, military, research)
  - Limited but effective tactical options
  - Reactive to major power actions
  - Opportunistic expansion and alliances

Tier 3 - Minor Characters:
  - Personal goals and motivations
  - Expertise in specific domains
  - Relationship-driven behavior
  - Emergent storylines and development
```

---

## Provider Adapter Framework

### Adapter Registry System
```yaml
Core Interfaces:
  - LLMAdapter: Chat, embeddings, tool calling
  - STTAdapter: Speech recognition, streaming
  - TTSAdapter: Voice synthesis, character voices
  - ImageGenAdapter: Scene, portrait, item generation
  - VideoGenAdapter: Cutscenes, ambient loops
  - EmbeddingsAdapter: Text vectorization

Registry Features:
  - Runtime provider selection and hot-switching
  - Context-based routing (session > campaign > default)
  - Automatic failover and load balancing
  - Performance metrics and cost tracking
  - A/B testing framework for model comparison
```

---

## Performance Targets

### Real-Time Requirements
```yaml
Voice Commands:
  - Speech-to-text: <200ms
  - Command processing: <300ms
  - Response generation: <300ms
  - Text-to-speech: <200ms
  - Total latency: <800ms

Game Simulation:
  - Tick processing: 100ms (10Hz)
  - Combat resolution: <500ms
  - Diplomatic actions: <1s
  - Research updates: <2s

Scalability Targets:
  - Phase 1: 50 players per server
  - Phase 2: 500 players per server
  - Phase 3: 10,000 players per server
```

This architecture provides a comprehensive foundation for building Startales as a massive, real-time, voice-driven galactic strategy game with sophisticated AI systems, multi-species gameplay, and scalable microservices infrastructure.
