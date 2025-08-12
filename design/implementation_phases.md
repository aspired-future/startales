# Implementation Phases — Galactic Tale Weaver RPG

## Prototype (Foundational Slice)
- Scope
  - Voice loop: STT → AI GM → TTS; streaming captions
  - React UI: scene card, transcript, objectives HUD, campaign browser, minimal schedule creation
  - Backend: Express/TS with in-memory `campaigns` and `schedules`; basic `/sessions` stub
  - Channels: 1:1 and group (room/team/line) routing (basic), transcripts
  - Images: one provider (e.g., SDXL/OpenAI Images), caching, placeholder→final swap
  - Missions: linear flow; rules: d20 + mods; XP/loot stubs
- Deliverables
  - Provider abstraction (LLM/STT/TTS/Image/Embeddings) with ≥1 backend
  - WebSocket presence/events (basic); REST: `/campaigns`, `/schedules`, `/images/request` (stub)
  - Content pack loader (worlds, missions, items) minimal read
- Verification gates
  - UI Playwright smoke: voice fixture→caption; image placeholder→final
  - Backend unit: schema validation, dice, image request
  - Latency sanity (GM < 4s median)
- Requirements covered (partial): R-001, R-002, R-004, R-009, R-012
- Exit demo
  - Create campaign → schedule session → two clients join → speak intent → GM reply + scene image

## MVP (Playable and Comparable)
- Scope
  - Persistence: SQLite + vector index (FAISS/SQLite-VSS); event sourcing + snapshots; resume/branch
  - Memory: scoped vector memory (`campaign:<id>`, `player:<id>`) with hybrid retrieval + summarization
  - Missions: DSL objective graph (twists/fail/soft-fail); co-op and competitive; rewards (XP/items)
  - Rules: d20 + advantage/disadvantage; DCs; conditions; leveling; loot distribution
  - Realtime: WebSocket + CRDT (notes/map/inventory); multi-client sync
  - Conversations: private 1:1 and group channels; device “relays” with range rules
  - Alliances: team setup, shared stash, reputation; basic leaderboards
  - Images: prompt builder, style profiles per campaign; asset lifecycle events
  - Scheduling: CRUD + RRULE recurrence; reminders; pre-session warmups (keys, memory prefetch, pre-gen images)
  - Multi-LLM: OpenAI + ≥1 (Anthropic/Gemini/Grok); A/B harness (latency/cost/structure)
- Deliverables
  - DB schema and migrations; snapshot job; ICS export/local notifications
  - Provider adapters (LLM≥2, STT≥1, TTS≥1, Image≥1, Embeddings≥1)
  - Content packs functional (worlds, missions, items)
- Verification gates
  - Tests mapped to R-001…R-012 (TC001–TC018) including parallel campaign isolation and scheduling
  - UI: CRDT convergence; channel privacy; mission HUD and situation ticker
  - Backend: rules/missions/memory/persistence; API contracts; A/B tool-call validity
  - Performance: STT < 800ms; GM < 3s median; TTS < 1.2s/150 chars; cached images < 6s
  - Security: memory isolation; key encryption; no unintended external writes
- Exit demo
  - Two campaigns in parallel (co-op and competitive with alliances); save/resume/branch; scheduling reminders; A/B compare two LLMs

## Upgrades (Iterative Enhancements)
- U1 Voice/audio polish: VAD/AGC/denoise, speaker diarization, NPC voice sets, PTT overlays (tests: latency, diarization accuracy)
- U2 Performance/load: streaming LLM, prompt compaction, caches/prefetch; 50 concurrent actions/min (load tests)
- U3 Model eval/safety: shadow runs, hallucination checks on tool calls, retries/backoff, safety gates (tests: categories, overrides)
- U4 World systems: factions agendas, economy/crafting/research, ship/base upgrades, dynamic events (tests: economy/progression invariants)
- U5 Competitive seasons/social: seasons, MMR/Elo, tournaments (Void Arena), anti‑griefing, PvP consent (tests: scoring/consent)
- U6 Modding pipeline: signed packs, creator tools, validation/sandbox (tests: signature/schema)
- U7 Privacy/ops: DB field encryption, key vault, backups/import/export, opt‑in analytics (tests: encryption, restore)
- U8 Visuals: map/tactical, optional 3D (Three.js), style/LoRA packs (tests: render perf, cache hits)
- U9 Timeline/recaps: branch visualization, “Previously on…” generator, shareable recaps (tests: event→timeline correctness)
- U10 Scheduling UX: calendar with recurrence editor, invites/RSVP, ICS import/export, device notifications (tests: timezone/recurrence)
- U11 AI‑generated video: cutscenes/ambient loops/highlights; provider‑agnostic (Pika/Runway/AnimateDiff); caching and identity consistency
  - Docs: `framework_docs/video_generation.md`
  - Requirements: R-013; Verification: TC019 (lifecycle, identity, cache reuse)

## Phase Acceptance Summary
- Each phase must reach green on its verification gates before proceeding
- Keep files ≤ 1000 lines; maintain local-first storage and per-player memory isolation at all stages
- Update `tests/verification/` traceability when new requirements or upgrades are added
