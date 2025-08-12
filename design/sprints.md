Title: Updated 8-Sprint Plan (with End-of-Sprint Demos)

Sprint 1: Core Loop, Setup, Outcome Meter (Foundational)
- Realtime & Voice Foundation
  - WS gateway: join/leave, captions/action routing, heartbeat, rate limits
  - Voice loop: VAD/PTT → STT → captions per speaker
  - Demo: two clients join; speak; captions visible; channel membership enforced
- GM Loop & Outcome Meter (MVP)
  - HUD (bands, chance bar, modifiers, momentum), Classic toggle
  - Band math + DDA/pity; Classic parity for one check type
  - Demo: toggle Outcome vs Classic; bands update; repeated attempts show pity
- Campaign Setup Screens
  - Resolution (Outcome/Classic), Revial (Standard/Story/Hardcore)
  - Win criteria/time limit, Visual generation level, Lifetime scope
  - Demo: setup chooses options; settings persist and reflect in-session
- Skills/Expertise & TTC (Foundations)
  - Split skills vs expertise; feasibility gates; TTC function; tool hooks
  - Demo: skills and expertise listed; contextual actions; ranks/specializations reduce TTC
- Health & Injuries (Foundations)
  - Health thresholds, status effects; treatment actions (Stabilize/Bandage/Splint/Medkit)
  - Death Clock HUD v1
  - Demo: health panel shows effects; treatment reduces timers
- Encounters (Realtime skeleton)
  - Rolling window resolution (10–20 Hz) for one encounter type; clocks advance
  - Demo: live encounter; bands advance clocks
- Cost Tooling
  - Ensure `npm run cost` usable; stub telemetry emit points
  - Demo: sample session cost JSON

Sprint 2: Persistence, Memory, Images
- Task: SQLite schema + event sourcing + snapshots
  - Test: Resume from snapshot; branch creation (TC009–TC010)
  - Demo: Save → resume → branch timeline
- Task: Vector memory (campaign/player scopes) + hybrid retrieval
  - Test: Isolation (TC007–TC008)
- Task: Image pipeline (prompt builder, cache, placeholder→final)
  - Test: Placeholder→final swap; cache reuse SLA (TC003)

Sprint 3: Narrative Scaffolding (Director + Decks + DDA)
- Task: Director Model v1 (beat state, pacing guardrails)
  - Test: Beat-state invariants
- Task: Story Decks v1 (twists/complications with weights)
  - Test: Deck schema + prerequisites; provenance recorded
  - Demo: Rising → Twist injection visible in HUD + recap
- Task: DDA bounds (DC/resource scaling within budget)
  - Test: DDA safety tests

Sprint 4: Alliances, Tech Trees, Stage Foundations, Cost Telemetry
- Task: Alliances (team setup, stash, reputation)
  - Test: Alliance creation, membership flows
- Task: Tech Trees (alliance/player QoL/cosmetics, timers)
  - Test: Timers, gating, no pay-to-win (PvP unaffected)
- Task: Stage Mode v1 (raise-hand, moderator approve/deny/mute)
  - Test: Speaker roster flows
- Task: Fireteams scaffolding (squad CRUD, per-team voice)
  - Test: Team routing events
- Task: Cost telemetry v1 (tokens/STT/TTS/images; session projection)
  - Test: Within ±10% of calculator assumptions
  - Demo: Alliance research unlock + stage flow + cost dashboard snapshot
 - Task: Leaderboards (Campaign)
  - Details: alliances and individual leaderboards per campaign; debounced event-driven updates; idempotent scoring events; tie-breakers
  - Test: scoring idempotency, caps/diminishing returns, tie-break policy ordering
  - Demo: campaign alliances/individuals boards update live after scoring events
 - Task: Leaderboards (Global Users)
  - Details: opt-in privacy (pseudonymous handle), periodic rollups, caching, regional filters
  - Test: opt-in/out respected; pagination; cache freshness; region filters
  - Demo: global users board shows aggregated metrics; opt-out hides user

Sprint 5: Live Ops + Shareables + Monetization MVP
- Task: Daily Contracts rotation (UI surfacing)
  - Test: Rotation correctness (TC024)
- Task: Weekly Anomaly activation/teardown (mutators)
  - Test: Apply/teardown behaviors (TC025)
- Task: Recap Cards (3–5 beats with hero image, seed code)
  - Test: Recap correctness + seed reproducibility (TC028)
- Task: Monetization MVP (cosmetics entitlements, Season Pass cosmetic/QoL track)
  - Test: Entitlement checks; prestige preserves cosmetics (TC030–TC033)
  - Demo: Contract → anomaly run → recap share + cosmetic render

Sprint 6: Large-Session Hardening (50 participants) + Spectators
- Task: Batching windows (Director-aligned) and perf tuning
  - Test: GM summary median < 4.5s @ 50 participants; per-team voice stability
- Task: Spectators/Casts minimal (caption-only, spoiler guard)
  - Test: Spectator caption throughput; spoiler guard on
  - Demo: 30–50 simulated clients run with stage, fireteams, spectators

Sprint 7: Single Player Mode (Solo + Companions)
- Task: Solo scaffolding (offline/local, pause/resume)
  - Test: Pause/resume resumes identical state (TC034)
- Task: Companion NPCs + Solo DDA tuning
  - Test: Companion actions present; DDA within solo bounds (TC035)
  - Demo: Solo run → pause → resume → beat completion

Sprint 8: Simulation Alpha + Consistency
Designer/Systems Track (parallel across Sprints 4–8)
- Army & Logistics: unit templates, supply/morale/readiness, doctrines; encounters integration
  - Demo: unit template/doctrines affect bands/TTC; logistics lines reflected
- Ship Designer: hull/module budgets, capabilities (carrier/boarding/stealth/e-war); constraints validation
  - Demo: two ship templates with different loadouts; constraints validated; capabilities unlock actions
- Government Types: policies, stability, diplomacy stances
  - Demo: switch government; effects apply to events/AI stances
- Scenario/Game Designer: map editor, object palette, economy/production/routes; validation; snapshot/export
  - Demo: small scenario built; tick simulation; invariants checked; playtest launched
- Win Criteria/Time Limits: weighted objectives; timers; dashboards
  - Demo: configure criteria and timer; end-of-session evaluation
- Visual Generation Levels: style profile enforcement; entitlement checks for high-tier visuals & Sim Worlds
  - Demo: toggle levels; consistent visuals; gating verified
- Task: SimulationProvider interface + registry + procedural provider
  - Test: Deterministic seeds reproduce outputs (TC036)
- Task: `/simulation` start/step/stop + snapshot export/import
  - Test: Snapshot I/O (TC037)
- Task: Reconciliation to mission/world + invariants
  - Test: Reconciliation invariants (TC038)
- Task: Consistency guardrails (hashes, drift detection, replay/fallback)
  - Test: Hash stability, drift detection, fallback (TC039–TC041)
  - Demo: Sim-enabled mission with step budget, snapshot timeline, hash report