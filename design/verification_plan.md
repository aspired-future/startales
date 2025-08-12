# Verification & Testing Plan

## Goals
- Validate voice-first multiplayer RPG with generated images, cooperative/competitive modes, alliances, and vector memory isolation.
- Ensure provider-agnostic behavior across OpenAI/Anthropic/Gemini/Grok and image backends.
- Guarantee local-first storage, save/resume correctness, and performance targets.

## Traceability
- Requirements map to test cases in `tests/verification/` with IDs:
  - R-001 Voice-first multiplayer → TC001_* (UI join/voice/action), TC002_* (multiclient sync)
  - R-002 Generated images → TC003_* (scene/portrait/item image lifecycle)
  - R-003 Alliances/competitive → TC004_* (team setup, scoring, alliances), TC005_* (leaderboard)
  - R-004 Missions DSL → TC006_* (graph advancement, twists, fail states)
  - R-005 Vector memory (scoped) → TC007_* (per-player isolation), TC008_* (campaign recall)
  - R-006 Save/resume/branch → TC009_* (snapshot+replay), TC010_* (branch)
  - R-007 Multi-provider → TC011_* (LLM adapters), TC012_* (STT/TTS/Image), TC013_* (A/B harness)
  - R-008 Local-first privacy → TC014_* (no external writes, key encryption)
  - R-009 Situation updates → TC015_* (ticker cadence + content)
  - R-010 Modding packs → TC016_* (import/export, signature)
  - R-011 Multi-campaign → TC017_* (parallel campaign isolation, list/create/branch)
  - R-012 Scheduling → TC018_* (schedule CRUD, reminders, pre-session warmup)
  - R-013 AI-generated video → TC019_* (video request lifecycle, identity consistency, cache reuse)
  - R-014 Group chat (global + ad-hoc invites) → TC020_* (channel create/join/leave, invite flows, roles, voice+text routing)

## Test Suites
- UI (Playwright)
  - Voice input fixture (WAV) → transcript rendered; GM TTS caption card; image placeholders → final
  - Two-browser session: CRDT notes converge; alliance formation flow; team HUD and scoring updates
  - Group chat: global channel join/leave/mute; create ad-hoc channel, send/receive messages and voice; invite/accept/decline flows
  - Situation ticker every 90s or 3 major events
- Backend (Jest or pytest equivalent)
  - LLM tools schemas: world query/update, rules roll, mission transition
  - Deterministic RNG: seeded `rng.roll` yields reproducible sequences; visible roll artifacts
  - Memory engine: write/read/summarize; isolated namespaces; hybrid vector+keyword retrieval
  - Persistence: event sourcing, snapshots, resume, branch
  - Image pipeline: prompt build, provider call stub, cache record, image-available event
  - Channels/invites: REST + WebSocket events for channel CRUD, membership, invite create/accept/decline; role enforcement and audit log entries
  - Video pipeline: request→progress→finalization flow; identity consistency for i2v
- Integration (end-to-end)
  - New campaign → select mission pack → multi-user scene → complete objectives → save → resume → branch
  - Parallel campaigns running concurrently without state leakage (two-browser contexts)
  - Create recurring schedule; verify reminders and pre-session warmup logs
- Performance
  - STT < 800ms median; GM response < 3s median; TTS < 1.2s/150 chars; cached image < 6s median
  - Concurrent users: 5–50 voices/min; token usage/latency per provider
- Security
  - Encrypted API keys; PII redaction; content safety categories; LAN token auth
- Load/Resilience
  - WebSocket stability; CRDT convergence under churn; retry/backoff for providers
- AI Model Evaluation
  - A/B same scene across providers → validate tool-call structure, compare latency/cost; hallucination checks on constrained tasks

## Test Artifacts
- `tests/scripts/voice_input_fixture.wav`
- `tests/utils/llm_stub_adapter.ts` (record/replay for deterministic assertions, not bypassing failures)
- Example Playwright tag for image lifecycle: ensure `data-testid="scene-image"` swaps from placeholder to final within SLA

## Coverage Targets
- 100% of mission/rules/memory/persistence/image services by unit tests
- 90%+ UI components critical to voice, mission HUD, alliances, images

## CI Hooks
- Local runner script to execute unit → integration → UI → performance smoke
- Save test logs, screenshots, and image cache stats in `temp_dev/test_artifacts`
