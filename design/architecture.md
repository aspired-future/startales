# Galactic Tale Weaver RPG — Technical Architecture

## System Overview
- Client: React/TypeScript UI in `src/ui_frontend` with voice capture, scene rendering, and WebSocket sync
- Server: Node.js/TypeScript services for LLM orchestration, memory, missions, rules, persistence, realtime, and image generation
- Storage: SQLite + vector index (FAISS or SQLite-VSS), local assets cache, logs
- Realtime: WebSocket hub + CRDT doc (Automerge/Yjs) for shared notes/inventory/map
- Providers: pluggable LLM/STT/TTS/Image adapters (OpenAI, Anthropic, Google, xAI, Stable Diffusion/SDXL)
 - Optional Simulation: pluggable SimulationProvider (procedural sandbox local; optional cloud learned world model)

## Microservices and Containerization
- Philosophy: independently deployable services with clear APIs, stateless compute, and stateful stores as managed services. All services run in Docker with health probes and resource limits. Local dev uses docker-compose; prod uses Kubernetes.
- Core Services:
  - api-gateway: Express/Node HTTP API for sessions, campaigns, audio routes; aggregates downstream services; rate limits and auth.
  - narrative-svc: LLM orchestration, Director Model, Story Decks, GM personality application, Outcome Meter logic.
  - memory-svc: vector memory (Qdrant/FAISS) with hybrid retrieval, summarization workers.
  - media-svc: image generation queue and cache; optional video workers.
  - sim-svc (optional): world simulation stepper with deterministic seeds and snapshotting.
  - event-bus: NATS for eventing between services (session events, scoring, logs).
  - auth-svc (optional external): JWT/OAuth provider or integrate with external portal.
- Data Stores:
  - Postgres: canonical relational store (campaigns, users, entitlements, sessions, leaderboards)
  - Qdrant: vector embeddings for memory and search
  - Redis: ephemeral caches, rate limits, WS presence
- Container Set:
  - `api` (Node) depends_on: `narrative`, `memory`, `media`, `nats`, `postgres`, `qdrant`
  - `narrative` (Node) depends_on: `ollama`, `nats`
  - `memory` (Node) depends_on: `qdrant`
  - `media` (Node/Python) depends_on: `nats`
  - `sim` (Node/Python) optional
  - `ollama` (ollama/ollama) with pulled models (llama3, codellama as needed)
  - `qdrant/qdrant`, `nats`, `postgres` images
- Scaling:
  - Stateless services scale horizontally behind a gateway; sticky sessions only for WS if needed (Redis-based session store).
  - Narrative-svc batches actions per beat; per-session sharding by campaignId; warm model contexts per shard.
  - Cost telemetry per service; autoscaling on latency/queue depth.

## GM Personality Application
- The `narrative-svc` injects personality tokens into LLM system prompts and adjusts Director weights and Story Deck sampling. TTS voice selection maps from `ttsProfile`.
- Personality registry provided via `content/personality_presets.json` and exposed via API for the game designer UI.

## Modules
- LLM Orchestrator
  - Routes prompts to chosen model; validates tool/function call schemas
  - Tools: world.query/update, mission.advance, rules.skill_check, rng.roll (seeded), memory.retrieve/write, image.request, npc.speak
- Narrative Engine (GM/NPCs)
  - GM prompt templates; NPC persona runners; pacing/situation summarizer; Director Model
- Mission Engine
  - DSL parser + runtime; objective graph transitions; twists/fail states
- Rules Engine
  - D20 checks; status effects; initiative (optional); XP/leveling; loot distribution
  - Dynamic Difficulty Adjustment (DDA): bounded scaling of DCs, resource drip, encounter intensity; integrates with Director Model beats
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
   - Stage Mode: speaker queue, raise-hand, moderator controls; per-team voice rooms; spectator channels
## Director Model & Story Decks
- Director Model
  - Maintains mission/run beat state (Inciting, Rising, Twist, Climax, Denouement) and exposes APIs for pacing and recap checkpoints.
  - Enforces concise narration windows and injects recap/situation updates at transitions.
  - Coordinates with DDA caps to keep drama curve within bounds.
- Story Decks
  - Structured, signed JSON decks of twists/complications/NPC agendas/environmental hazards with weights, prerequisites, and payoffs.
  - Mission Engine queries decks by biome, faction, current beat, and active clocks; draws cards to create coherent twists.
  - Deck provenance captured for replay/debug.

 

## Data Model Highlights (SQLite)
- `players`, `characters`, `alliances` (memberships, reputation), `campaigns`, `sessions`
- `world_states` (versioned), `events` (event-sourced), `missions` + `mission_progress`
- `memories` (owner_namespace, type, vector embedding, metadata)
- `inventory`, `items`, `artifacts`, `factions`
- `images` (hash, prompt, style, path, rights, created_at)
- `llm_messages` (telemetry), `settings`
 - `decks` (id, type, weights, provenance)
 - `director_state` (campaign_id, session_id, beat, active_clocks)
 - `tech_trees` (entity_type: alliance|player, tree_json, progress)
 - `simulation_snapshots` (campaign_id, session_id, seed, step, path)

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

## Simulation Consistency & Replayability
- Lockstep integration: the Director advances beats only after simulation completes an authorized step window; step budgets are enforced.
- Deterministic seeds: simulation seeds derive from `{campaignId, sessionId, beatId, stepIndex}`; identical inputs yield identical outputs.
- Snapshotting: take lightweight simulation snapshots at beat boundaries and key events; store `simulation_snapshot_id` with event log.
- Hashing: persist a provider-reported or computed state hash per snapshot/beat to detect drift across runs.
- Reconciliation: a pure function maps simulation outputs to mission/world state changes; invariants prevent illegal transitions.
- Drift handling: on hash mismatch or invariant violation, quarantine the step, attempt replay once, then fallback to non-sim narrative with a user-facing notice and logs.

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
  - `/director` get/set beat; `/decks` list/install
  - `/stage` speaker roster, raise-hand, approve/deny/mute
  - `/fireteams` CRUD squads; assign channels; squad summaries
  - `/tech-trees` get/progress; `/tech-trees/research` start/complete
  - `/simulation` start/step/stop; export/import snapshots; provider select
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
  - `engine/director/` director model state machine, recap generator
  - `engine/decks/` deck registry, loaders, validators
  - `engine/progression/` tech trees (alliance, player) models and services
- `src/server/memory/` embeddings, stores, summarizers
- `src/server/images/` prompt builders, providers, cache
- `src/server/persistence/` sqlite, migrations, snapshots
- `src/server/realtime/` ws hub, presence, CRDT
 - `src/server/simulation/` providers (procedural, cloud), stepper, reconciler
- `content/packs/` worlds, missions, items, factions
- `scripts/database/` init/migrate/seed
- `tests/` unit, integration, verification, performance, security, load

## Observability
- Structured logs for prompts, tool calls, latency, tokens; session replay timeline
- Image cache hit/miss; model A/B metrics; safety triggers
 - Cost telemetry: per-turn token, STT/TTS seconds, image/video requests, per-session cost estimates; provider mix and cache amortization
 - Simulation telemetry: step budgets vs actual, snapshot IDs, state hash timeline, reconciliation decisions, drift alerts

## Performance Targets
 - STT < 800 ms; LLM GM response < 3 s median; TTS < 1.2 s/150 chars; image generation streamed with placeholders and < 6 s cached median
 - Large sessions: < 4.5 s median GM summaries at ~50 participants with Stage Mode and action batching


