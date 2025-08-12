# Product Requirements Document (PRD) — Galactic Tale Weaver RPG

## 1. Overview
- Voice-first, AI-driven space RPG with collaborative and competitive play, generated images and optional AI-generated video, strong player agency, and persistent progression.
- Local-first: all data is stored locally; pluggable multi-LLM/STT/TTS/Image/Video providers.
- Multi-campaign: multiple games can run in parallel with isolated data; sessions are schedulable with recurrence and reminders.

## 2. Goals and Non-Goals
- Goals
  - Deliver fast, vivid narration (2–4 sentences per beat) with high agency and clarity.
  - Support co-op, competitive, and alliance mechanics with fair systems and progression.
  - Provide rich visuals (scene/portrait/item images; upgrade path to video cinematics).
  - Ensure save/resume/branch timelines; strong memory with per-player privacy.
  - Be provider-agnostic for LLM/STT/TTS/Image/Video and embedders.
- Non-Goals (v1)
  - MMO-scale server; centralized cloud hosting; mobile native clients.

## 3. Personas and Use Cases
- Players: small groups seeking AI-GM sessions (co-op adventures, competitive arenas, alliance events).
- GMs/Hosts: configure campaigns, schedule sessions, import content packs, compare model providers.
- Creators: build worlds/missions/items as content packs.

## 4. Key Requirements (Functional)
- R-001 Voice-first multiplayer
  - The system shall support voice-first play with 1:1 and group channels (by room/proximity, team/line, party/alliance), including captions and speaker diarization.
  - Verification: TC001 (UI join/voice/action, transcript and captions visible), TC002 (multiclient sync; channel membership and audio routing validated).
- R-002 Generated images
  - The system shall generate and render scene, portrait, and item images using a campaign style profile with local caching and reuse.
  - Verification: TC003 (image request lifecycle, placeholder→final swap, cache reuse SLA).
- R-003 Alliances and team mechanics
  - The system shall support alliances/teams with shared mechanics and basic leaderboards for competitive modes.
  - Verification: TC004 (team/alliance setup and flows), TC005 (leaderboard updates and scoring rules).
- R-004 Mission Template DSL and content packs
  - The system shall execute missions defined as objective graphs with twists and soft-fail states and load missions from local content packs.
  - Verification: TC006 (graph advancement, twists activation, fail/soft-fail behavior).
- R-005 Vector memory with isolation
  - The system shall provide vector memory with strict per-player privacy and shared campaign memory, supporting hybrid retrieval and summarization.
  - Verification: TC007 (per-player isolation enforced), TC008 (campaign recall relevance and summarization correctness).
- R-006 Save/resume and branch timelines
  - The system shall persist event-sourced state with periodic snapshots, allowing sessions to resume and branch from any snapshot.
  - Verification: TC009 (snapshot+replay resume correctness), TC010 (branch creation and isolation).
- R-007 Provider-agnostic multi-LLM/STT/TTS/Image/Embeddings
  - The system shall provide provider-agnostic adapters selectable at runtime and an A/B harness to compare models. Ollama local models SHALL be supported for LLM and embeddings where available.
  - Verification: TC011 (LLM adapter conformance, including Ollama), TC012 (STT/TTS/Image adapters), TC013 (A/B harness structural and metrics capture).
- R-008 Local-first storage and privacy
  - The system shall store data locally, encrypt provider keys at rest, and apply PII redaction to logs and transcripts per policy.
  - Verification: TC014 (no unintended external writes; key encryption; redaction checks).
- R-009 Periodic situation updates
  - The system shall broadcast periodic situation updates by time or event cadence to keep players synchronized.
  - Verification: TC015 (ticker cadence and content reflect true world/mission state).
- R-010 Modding: content packs
  - The system shall import/export signed content packs for worlds, missions, items, and validate them on load.
  - Verification: TC016 (import/export flows and signature/schema validation).
- R-011 Multi-campaign support
  - The system shall run multiple campaigns in parallel with fully isolated data, assets, vector memories, and schedules.
  - Verification: TC017 (parallel campaign isolation; list/create/clone/archive; no state leakage between campaigns).
- R-012 Scheduling
  - The system shall provide campaign schedules with CRUD, RRULE recurrence, reminders, and pre-session warmups (keys validation, memory prefetch, image pregen).
  - Verification: TC018 (schedule CRUD and recurrence; reminders fired; warmup tasks executed and logged).
- R-013 AI-generated video (upgrade)
  - The system shall, when enabled, generate cutscenes and ambient loops with caching and identity consistency from images/storyboards.
  - Verification: TC019 (video request lifecycle; identity/continuity tolerance checks; cache reuse SLA).
 - R-014 Group chat (global and ad-hoc with invites)
  - The system shall provide a campaign-wide global group chat (voice and text) and support ad-hoc group chats where players can invite others, accept/decline invites, and manage membership with roles (owner/mod/member).
  - Verification: TC020 (global channel join/leave/mute; create ad-hoc channel; invite/accept/decline; role enforcement; voice and text routing; audit log entries).

## 5. Non-Functional Requirements
- Performance targets
  - STT < 800 ms median; GM response < 3 s median; TTS < 1.2 s for ~150 chars.
  - Cached images available < 6 s median; video preview within 5 s (cloud) when enabled.
- Security and Privacy
  - Local-only data by default; encrypted provider keys; PII redaction; consent/PvP controls.
- Accessibility
  - Captions, adjustable speech rate/volume, color contrast, keyboard nav fallback.
- Reliability
  - WebSocket stability; CRDT convergence; retries/backoff for provider calls.

## 6. Gameplay Systems
- Rules/Progression: d20 checks, DCs, advantage/disadvantage, conditions, XP/levels, loot distribution.
- Missions: objective graphs with twists; co-op/competitive modes; rewards (XP/items/artifacts).
- Memory: episodic/semantic/declarative/procedural; per-player privacy; promotion workflow to campaign memory.
- Conversations: 1:1 private channels and group channels (room/team/line), device relays with range/quality rules.

## 7. Visuals and Audio
- Images: prompt templates; campaign style profiles; cache and reuse.
- Video (upgrade): prompt/storyboard/i2v; cached assets; provider-agnostic; ambient loops/cutscenes.
- Audio: voice capture with VAD; TTS per NPC; captions and diarization.

## 8. Architecture Summary
- Client: React UI in `src/ui_frontend` (voice capture, scenes, HUD, campaign browser, schedule editor).
- Server: Node/TS (LLM orchestration, missions, rules, memory, persistence, realtime, images, scheduling; video upgrade).
- Storage: SQLite + vector index (FAISS or SQLite-VSS); local assets cache; structured logs.
- Realtime: WebSockets + CRDT for shared notes/map/inventory.
- Providers: interchangeable adapters for LLM/STT/TTS/Image/Video/Embeddings.

## 9. Data and Persistence
- Tables (subset): `players`, `characters`, `campaigns`, `sessions`, `world_states`, `events`, `memories`, `missions`, `mission_progress`, `inventory`, `items`, `images`, `videos` (upgrade), `llm_messages`, `settings`, `schedules`.
- Snapshots for fast resume; event sourcing for auditability; vector memory with namespaces (`campaign:<id>`, `player:<id>`).

## 10. Scheduling
- Campaign schedules with RRULE; reminders; pre-session warmups (keys validation, memory prefetch, image pregen).
- API: `/campaigns` CRUD/clone/archive; `/schedules` CRUD; optional ICS export.

## 11. Content and Modding
- Packs in `content/packs/` for worlds, missions, items; signed JSON; validation on import.

## 12. Implementation Phases
- Prototype (foundational slice)
  - Voice loop, minimal missions/rules, images (one provider), in-memory server; 1:1/group channels (basic); basic campaign browser and schedule creation.
  - Verification: Playwright smoke; unit tests for schemas/dice/image; latency sanity.
- MVP (playable and comparable)
  - SQLite + vector memory; mission DSL; rules; CRDT realtime; alliances; multi-LLM; scheduling with warmups; content packs.
  - Verification: TC001–TC018 mapped to R-001–R-012; performance/security targets; A/B harness.
- Upgrades (iterative)
  - Audio polish; performance/load; model evaluation/safety; world/economy; seasons/social; modding pipeline; privacy/ops; visuals/3D; timeline/recaps; scheduling UX; AI-generated video (R-013, TC019).

## 13. Acceptance Criteria
- Functional: all R-001…R-012 implemented and passing mapped verification tests; R-013 when video upgrade is enabled.
- Non-functional: performance targets met; memory isolation proven; no unintended external writes; accessibility/captions available.
- Demo: two concurrent campaigns (co-op and competitive with alliances), save/resume/branch, scheduling reminders, A/B LLM compare.

## 14. Metrics and Telemetry
- Latency and token usage per provider; image/video cache hit rates; retention per campaign; completion and fairness metrics.

## 15. Risks and Mitigations
- Latency variability → streaming, caching, prompt compaction, warmups.
- Non-determinism/hallucinations → strict tool schemas, validation, retries, A/B comparison.
- Voice reliability → VAD/denoise, PTT fallback, captions always.
- Safety → content filters with overrides; PvP consent and anti‑griefing rules.

## 16. Out of Scope (initial)
- Cloud-hosted multiplayer and account systems; mobile native apps.

## 17. Traceability (Requirements → Test Cases)
- R-001 → TC001, TC002
- R-002 → TC003
- R-003 → TC004, TC005
- R-004 → TC006
- R-005 → TC007, TC008
- R-006 → TC009, TC010
- R-007 → TC011, TC013
- R-008 → TC014
- R-009 → TC015
- R-010 → TC016
- R-011 → TC017
- R-012 → TC018
- R-013 → TC019
 - R-014 → TC020

## 18. References
- Design: `design/design.md`
- Architecture: `design/architecture.md`
- Providers: `design/providers.md`
- Memory: `design/memory.md`
- Image & Video: `design/image_generation.md`, `design/video_generation.md`
- Verification Plan: `design/verification_plan.md`
- Implementation Phases: `design/implementation_phases.md`
- UI Visual Design: `design/ui_visual_design.md`
