# Verification & Testing Plan

## Task 1 — Monorepo Scaffolding (TC001–TC006)

- TC001 Build: pnpm -r build succeeds for server, shared, ui_frontend
- TC002 Workspaces: packages/* and framework_docs included; package.json fields correct
- TC003 TS Strict: strict true across root and packages; tsc --noEmit runs clean
- TC004 Lint/Hooks: ESLint + Prettier + husky (pre-commit lint-staged, commitlint)
- TC005 Tests: Jest (server/shared) and Playwright scaffold (UI shell smoke)
- TC006 No outbound: no external calls during dev bootstrap (mock dns/http/https)

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
  - Director/Beat UI: beat transitions render correctly; recap cards appear at transitions; twist banners show source deck
- Backend (Jest or pytest equivalent)
  - LLM tools schemas: world query/update, rules roll, mission transition
  - Deterministic RNG: seeded `rng.roll` yields reproducible sequences; visible roll artifacts
  - Memory engine: write/read/summarize; isolated namespaces; hybrid vector+keyword retrieval
  - Persistence: event sourcing, snapshots, resume, branch
  - Image pipeline: prompt build, provider call stub, cache record, image-available event
  - Channels/invites: REST + WebSocket events for channel CRUD, membership, invite create/accept/decline; role enforcement and audit log entries
  - Video pipeline: request→progress→finalization flow; identity consistency for i2v
  - Director Model: state machine invariants; beat order; pacing guards
  - Story Decks: schema validation; draw respects weights/prerequisites; provenance recorded for replay
  - DDA: DC/resource adjustments within configured bounds; never violates fail-forward budget
  - Tech Trees: research timers, unlock gating, alliance vs player scopes; no pay-to-win effects in PvP
  - Simulation Consistency: deterministic seeds reproduce step outputs; snapshot state hash stable; drift detection triggers replay and fallback path
  - Accounts & Security: login/logout/session refresh (JWT cookies); rate-limit/lockout; CSRF/CSP headers; audit logs
  - Billing & Entitlements: Stripe webhook idempotency/signature verification; entitlement grant/revoke; no PvP stat effects
  - Friends & Invites: invite/accept/decline/block; presence updates; join-friend’s-session
  - Outcome Meter: band calculations with modifiers; DDA/pity stacking; Classic Mode parity with d20 checks
  - Skills/Expertise & TTC: feasibility gates enforce min skill; time-to-complete scales with skill/expertise/tools; practice/training reduces TTC within caps
  - Telemetry Dashboards & Consent: victory progress and timer endpoints; leaderboard deltas; accessibility labels present; consent/policy toggles enforced for visuals and paid Sim Worlds; entitlement checks verified
  - Alien Species Diversity: non-humanoid species schema (morphology/locomotion/physiology) validates; image generation style tokens produce diverse silhouettes; consistency via style profiles/seed reuse
- Integration (end-to-end)
  - New campaign → select mission pack → multi-user scene → complete objectives → save → resume → branch
  - Parallel campaigns running concurrently without state leakage (two-browser contexts)
  - Create recurring schedule; verify reminders and pre-session warmup logs
  - Trigger twist via deck during Rising → Twist; verify UI banner, mission graph branch, and recap capture
  - Start alliance research, complete mission for resources, research completes and unlocks QoL/cosmetic
  - Single Player flow: start solo campaign, pause/resume, companion actions present; DDA within solo bounds
  - Simulated Worlds flow (if enabled): start sim, step budget enforced, snapshot export/import, reconciled mission progression, hash timeline logged
  - Visibility & Access: invite-only campaign join via invite link and join code; open/public browser discoverability; owner/mod approval queue; moderation actions (kick/ban/role change) reflected in audit log
  - Creation Flows: create preset game; create manual game via AI wizard; verify mission DSL scaffold loads and first session progresses
  - Accounts: magic link or OAuth login → profile → logout → session persists across refresh
  - Billing: Checkout → webhook grants entitlement → cosmetic renders; Billing Portal opens and updates subscription state
  - Friends: A invites B; B accepts; presence shows online; “join friend’s session” connects
  - Encounters: run space dogfight (position/hull clocks) and planetary stealth/diplomacy; Outcome Meter bands advance clocks; transitions (boarding, landing) persist deterministic seed and state; rewards and world state changes applied
  - Cultures & Leaders: load a culture from pack, interact with a leader NPC; reputation/treaty changes persist; persona goals and stance updates visible in subsequent encounters
  - Death & Revial: downed state with visible death clock; rescue stabilizes; if death occurs, apply revival policy per campaign (rewind/clone/permadeath); verify penalties (debuff/scar/XP debt), rescue mission for gear/body, and legacy inheritance; Hardcore confirmation prompts
  - Outcome Meter vs Classic: toggle modes; verify band display and optional d20 visibility; repeated attempts show pity stacking
  - Real-time Encounters: rolling window resolution at 10–20 Hz; Outcome Meter updates live; clocks advance; TTC affected by skill/expertise/tools
  - Dashboards: Victory/Objective panel shows weighted progress; timer countdown visible and accurate; leaderboard deltas update on events; all panels keyboardable and screen-reader friendly
  - Consent & Entitlements: toggling visuals level and Sim Worlds respects privacy/entitlements; opt-outs honored; paid features gated
  - Alien Compendium: species list shows diverse non-humanoid entries with portraits; recurring NPC/ship/building visuals remain consistent across sessions (style profile + seed)
  - Scenario/Game Designer: create a small scenario with factions, cities, bases, ships/vehicles, production chains, and victory conditions; run tick simulation; validate invariants (resource conservation, non-negative supply), performance thresholds, and snapshot/export to pack; launch playtest
  - Government Types: switch government archetypes and verify policy frames, stability/diplomacy modifiers, and doctrine effects apply
- Performance
  - STT < 800ms median; GM response < 3s median; TTS < 1.2s/150 chars; cached image < 6s median
  - Concurrent users: 5–50 voices/min; token usage/latency per provider
  - Large-session targets: Stage Mode batching keeps GM summary median < 4.5s at 50 participants; per-team voice stability; spectator caption throughput validated
  - Player counts: validate 4–6 sweet-spot co-op; 3v3–5v5 competitive; stress at 12 concurrent with acceptable degradation
- Security
  - Encrypted API keys; PII redaction; content safety categories; LAN token auth
- Load/Resilience
  - WebSocket stability; CRDT convergence under churn; retry/backoff for providers
- AI Model Evaluation
  - A/B same scene across providers → validate tool-call structure, compare latency/cost; hallucination checks on constrained tasks

## Cost & Monetization Verification
- Cost Telemetry
  - Unit tests: per-turn token accounting, image/TTS/STT counters, session-level cost projection
  - Integration: provider mix switch reflects in cost metrics; cache hit increases lower image cost
- Entitlements & Gating
  - Cosmetics: entitlement check on render; no stat effects in PvP flows
  - Season Pass: track progression, prestige reset preserves cosmetics
  - Creator Pro Tools: batch pre-gen and analytics gated by entitlement; fallback behavior verified

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
