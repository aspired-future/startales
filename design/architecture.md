# Galactic Tale Weaver RPG — Technical Architecture

## System Overview
- Client: React/TypeScript UI in `src/ui_frontend` with voice capture, scene rendering, and WebSocket sync
- Server: Node.js/TypeScript services for LLM orchestration, memory, missions, rules, persistence, realtime, and image generation
- Storage: SQLite + vector index (FAISS or SQLite-VSS), local assets cache, logs
- Realtime: WebSocket hub + CRDT doc (Automerge/Yjs) for shared notes/inventory/map
- Providers: pluggable LLM/STT/TTS/Image adapters (OpenAI, Anthropic, Google, xAI, Stable Diffusion/SDXL)

## Modules
- LLM Orchestrator
  - Routes prompts to chosen model; validates tool/function call schemas
  - Tools: world.query/update, mission.advance, rules.skill_check, rng.roll (seeded), memory.retrieve/write, image.request, npc.speak
- Narrative Engine (GM/NPCs)
  - GM prompt templates; NPC persona runners; pacing/situation summarizer
- Mission Engine
  - DSL parser + runtime; objective graph transitions; twists/fail states
- Rules Engine
  - D20 checks; status effects; initiative (optional); XP/leveling; loot distribution
- Memory Engine
  - Embedding adapters; stores/retrieves episodic/semantic/declarative/procedural memory
  - Namespaces: `campaign:<id>`, `player:<id>`; hard boundary between player memories
- Image Generation Service
  - Prompt templating from scene state; adapters (OpenAI Images, SDXL/Automatic1111, ComfyUI); style tokens; caching & deduplication
- Persistence
  - SQLite schema (campaigns, sessions, world_states, events, memories, missions, items, alliances, llm_messages, settings)
  - Event sourcing + periodic snapshots; save/resume and branching
- Realtime/Multiplayer
  - Presence, party/team/alliances, voice room metadata, event fan-out

## Data Model Highlights (SQLite)
- `players`, `characters`, `alliances` (memberships, reputation), `campaigns`, `sessions`
- `world_states` (versioned), `events` (event-sourced), `missions` + `mission_progress`
- `memories` (owner_namespace, type, vector embedding, metadata)
- `inventory`, `items`, `artifacts`, `factions`
- `images` (hash, prompt, style, path, rights, created_at)
- `llm_messages` (telemetry), `settings`

## Vector Memory
- Embedding: provider-agnostic; default OpenAI text-embedding-3-large or local alternatives
- Index: FAISS/SQLite-VSS; metadata filters on `owner_namespace`, `type`, `tags`
- Write policy: every significant event, fact, NPC relation, location, and player note
- Retrieval:
  - Action Interpreter requests relevant context via hybrid search (vector + keyword)
  - Per-player recall excludes others’ private memories; GM can access campaign memory
  - Time-decay and recency boosting; summarization tasks create dense summaries

## Determinism and Replayability
- RNG with deterministic seeds per scene/encounter for reproducibility; store seeds with events
- Visible dice roll artifacts published to clients for transparency

## Image Generation Pipeline
1) Scene/Portrait/Item request from Narrative Engine
2) Prompt builder: style + lore + world biome + lighting + banned words filter
3) Provider adapter; async job with streaming progress
4) Cache image to `data/assets/` with SHA-256 of prompt + seed; store record in `images`
5) UI subscribes to asset-available event; displays placeholder until ready

## API Surfaces
- WebSocket: session events, world deltas, captions, image-available, situation updates
- REST:
  - `/campaigns` list/create/clone/archive; schedule CRUD; calendar feed (ICS)
  - `/sessions` create/resume/branch; list by campaign; snapshots
  - `/missions` list/install/run
  - `/memory/query` vector search (scoped)
  - `/images/request` generate by type (scene|portrait|item)
  - `/providers` list/select; `/metrics` telemetry

## Multi-Provider Abstraction
- `LLMProvider`, `STTProvider`, `TTSProvider`, `ImageProvider`, `EmbeddingProvider`
- Adapters: OpenAI, Anthropic (Claude), Google (Gemini), xAI (Grok); SDXL/ComfyUI for images
- Config at runtime; supports A/B and shadow runs; logs usage/latency locally

## Security & Privacy
- Local-only DB/assets by default; optional LAN with token auth
- Encrypted provider keys per OS user profile; PII redaction pipeline
- Content safety with configurable categories; human-in-the-loop overrides

## Save/Resume & Branching
- Snapshot job stores `world_states` JSON blobs and vector memory checkpoints
- Resume loads latest snapshot + replays tail events; branch creates new `campaign`

## Scheduling Service
- Stores per-campaign schedules with recurrence rules; emits upcoming-session events
- Pre-session tasks: warm-up providers, prefetch memories and probable images, validate keys
- Integrations: local notifications; optional ICS feed export and webhook/email

## File Layout
- `src/ui_frontend/` React/Tailwind/Three.js; voice capture; asset viewer; alliance/party UI
- `src/server/llm/` providers, tools; `engine/*` narrative/missions/rules
- `src/server/memory/` embeddings, stores, summarizers
- `src/server/images/` prompt builders, providers, cache
- `src/server/persistence/` sqlite, migrations, snapshots
- `src/server/realtime/` ws hub, presence, CRDT
- `content/packs/` worlds, missions, items, factions
- `scripts/database/` init/migrate/seed
- `tests/` unit, integration, verification, performance, security, load

## Observability
- Structured logs for prompts, tool calls, latency, tokens; session replay timeline
- Image cache hit/miss; model A/B metrics; safety triggers

## Performance Targets
- STT < 800 ms; LLM GM response < 3 s median; TTS < 1.2 s/150 chars; image generation streamed with placeholders and < 6 s cached median


