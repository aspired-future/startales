Title: Unified Sprint Plan (1–12) with Demos

# Unified Plan Overview

This unified plan merges the previous lettered (A–L) and numbered (1–8) tracks into a single 12‑sprint sequence focused on building a comprehensive real-world economic simulation engine. Each sprint lists the demo surface and primary APIs.

## Core Vision: Realistic Economic Simulation
- **Real-World Accuracy**: All systems model actual economic, social, and political dynamics
- **Deterministic Money Flow**: No mysterious appearance/disappearance of resources or money  
- **Human Psychology**: Citizens respond to incentives, fears, and desires like real people
- **AI + Deterministic Hybrid**: Combine deterministic calculations with AI natural language interpretation
- **Real-Time Simulation**: Each tick includes AI analysis → simulation → AI interpretation
- **Resource Conservation**: All resources and property have traceable origins and destinations

See `design/comprehensive-economic-engine-architecture.md` for detailed technical architecture.

Unified Sprint 1 — Core Loop + Simulation Engine HUD
- Core Loop/Outcome Meter foundations (bands, chance bar, Classic toggle) and Simulation Engine HUD
- Demo: /demo/hud
- APIs: POST /api/sim/step, GET /api/analytics/empire, GET /api/analytics/snapshots
Add-ons in S1:
- Game Setup: enable Hero and Nation modes (both allowed); HUD toggle visible when both
- Succession options in Setup: on deposition/conquest/term expiry (Game Over | Hero Mode | New Nation | Successor Leader | Observer)

Unified Sprint 2 — Persistence, Memory, Images
- SQLite + event sourcing + snapshots; vector memory (campaign/player); image pipeline (prompt builder, cache)
- Demo: save → resume → branch; placeholder→final image swap
- APIs: snapshot/resume endpoints (as planned), image request lifecycle

Unified Sprint 3 — Policies & Advisors
- Policy console (free‑form text → capped modifiers with approval), Advisors (query/propose) integrated with engine
- Demo: approve policy → step → KPI delta; advisor propose→approve→step
- APIs: POST /api/policies, POST /api/policies/activate, GET /api/policies/active, POST /api/advisors/:domain/{query|propose}

Add-ons in S3:
- Policy Drafting Copilot (NL → bill → fiscal note → capped modifiers) and AI Constitutional Court validator
- Persona Advisors (diegetic) with persistent style/memory, bounded by constitutional constraints
 - Lobbying & Disclosures: registry, budgets, filings → bounded agenda/scheduling biases; transparency/backfire
- Succession state machine hooks for archetypes (monarchy, democracy, empire)
 - Restoration via Hero Influence: support deltas from encounters with caps and precondition gating

Unified Sprint 4 — Core Economic Engine with Money Conservation [Task 47]
- Foundational economic engine with strict money flow tracking and conservation laws
- Transaction auditing, balance sheet maintenance, supply/demand modeling
- Demo: money conservation validation, transaction tracking, economic metrics
- APIs: GET /api/economy/transactions, GET /api/economy/balances, POST /api/economy/validate

Add-ons in S4:
- Currencies & FX v1 (free‑float) integrated in price quotes and analytics indices
- Central Bank scaffolding: config and read-only analytics hooks
- Infrastructure Network v1: roads/rails/ports capacity + maintenance hooks influencing logistics/trade
 - Entrepreneurs & Private Innovation v1: startup registry, private R&D hooks into research/adoption
 - GDP components groundwork (C,I,NX) flowing from trade/corporate subsystems
- Logistics & Transport v1: modes, shipments with ETAs/queues, in‑flight inventory affecting settlement

Unified Sprint 5 — Population & Demographics Engine [Task 48]
- Individual citizen modeling with psychological profiles and incentive responses
- Career progression, skill development, and realistic life transitions
- Demo: citizen behavior simulation, incentive response testing, demographic evolution
- APIs: GET /api/population/citizens, GET /api/population/demographics, POST /api/population/incentives

Add-ons in S5:
- Causal Explainability dashboards (why KPIs changed) with counterfactual runner hooks
 - Monetary/FX analytics panels (inflation, FX baskets)
- Education KPIs and budget lines (effect hooks to research/expertise)
 - Innovation KPIs (startup_count, private_RnD_spend, patents, adoption_index)
 - GDP total/growth panel and API; National Budget UI (allocations, caps, deficit)

Unified Sprint 6 — Profession & Industry System [Task 49]
- Comprehensive profession modeling with realistic salaries and career paths
- Unemployment tracking by demographics, labor market dynamics, small business opportunities
- Demo: profession salary analysis, unemployment dashboard, career progression simulation
- APIs: GET /api/professions, GET /api/labor/unemployment, GET /api/careers/progression

Add-ons in S6:
- Diegetic Media Fabric (headlines/podcast front page) driven by press_freedom + credibility
- Persona press secretary and opposition spokesperson with bounded media effects
 - Legislative session ticker: bills advancing with NL summaries (no direct numeric impact without validators)
 - Press Conferences (Q&A): reporter queue + live indicators; bounded messaging/credibility effects; transcripts and recap
 - Intel Brief (Daily): minimal agency brief panel and risk indices (analysis only)

Unified Sprint 7 — Small Business & Entrepreneurship Engine [Task 50]
- Comprehensive small business ecosystem with financial tracking and market dynamics
- Business creation/failure modeling, employee management, competition effects
- Demo: business creation simulation, financial tracking dashboard, market competition analysis
- APIs: GET /api/businesses, POST /api/businesses/create, GET /api/businesses/finances

Add-ons in S7:
- Recap “writer’s room” arc tying beats to season narrative (deterministic schedule + rollback plan)

Unified Sprint 8 — City Specialization & Geography Engine [Task 51]
- Realistic city development with economic specializations and geographic advantages
- Infrastructure development, quality of life factors, inter-city economic relationships
- Demo: city specialization evolution, infrastructure impact analysis, economic performance comparison
- APIs: GET /api/cities, GET /api/cities/specializations, GET /api/infrastructure

Add-ons in S8:
- Adaptive Soundtrack hooks (react to KPIs) and cosmetic radio skins for media personas
 - Currency skins and commemorative coins cosmetics tied to FX events (visual only)

Unified Sprint 9 — Immigration & Migration System [Task 52]
- Comprehensive population movement modeling with legal/illegal immigration and internal migration
- Cultural and social factors, integration challenges, policy effects on migration flows
- Demo: migration flow visualization, policy impact on immigration, integration outcome tracking
- APIs: GET /api/migration/flows, POST /api/migration/policies, GET /api/migration/integration

Add-ons in S9:
- Model cascading and budget enforcement for media/voice features; diary access audit panel (opt‑in)
 - Reign Summary computation job and initial leaderboards integration (opt‑in)

Unified Sprint 10 — AI Analysis & Interpretation Engine [Task 53]
- AI-powered analysis providing natural language interpretation of economic and social dynamics
- Pre-simulation analysis, trend prediction, post-simulation interpretation, narrative generation
- Demo: AI economic analysis, trend prediction accuracy, narrative event generation
- APIs: GET /api/ai/analysis, POST /api/ai/predict, GET /api/ai/interpret

Add-ons in S10:
- Player fingerprinting (opt‑in) for pacing and companion style; bounded by determinism

Unified Sprint 11 — Incentive Response & Psychology Systems [Tasks 54-55]
- Realistic citizen responses to incentives and comprehensive human psychology modeling
- Fear/motivation systems, behavioral economics, risk assessment, social influence
- Demo: incentive response testing, psychological factor analysis, behavioral prediction accuracy
- APIs: GET /api/incentives/responses, GET /api/psychology/factors, POST /api/behavior/predict

Add-ons in S11:
- Branching time machine UI (parallel what‑ifs) with diffed narratives and promotion safeguards
 - Explainable diplomacy interacts with FX and central bank credibility in counterfactuals
 - Diplomats & Embassy workflows integrated with treaty DSL and previews
 - Hero Exploration & National Quests integration with sim/logistics (bounded effects)
 - FTL Jump Network (seeded lanes/nodes) and Ancient Artifacts discovery/activation (bounded effects)
 - Technology Tree (DAG) with research flows and bounded effects; UI and APIs

Unified Sprint 12 — Real-Time Integration & Economic Analytics [Tasks 56-58]
- Complete real-time simulation integration with AI analysis → deterministic simulation → AI interpretation
- Comprehensive economic metrics dashboard and realistic policy impact simulation
- Demo: full real-time economic simulation, policy impact analysis, comprehensive analytics dashboard
- APIs: GET /api/simulation/realtime, GET /api/analytics/comprehensive, POST /api/policies/simulate

Add-ons in S12:
- Media/agent scaling tests; soundtrack mixer perf; treaty DSL stress with many agents

# Near-term Insert: Engine, Policies/Advisors, Trade, Analytics, CI (detail retained)

Sprint A: Simulation Engine (MVP) [Task 36]
- Engine host & seed PRNG (36.1)
- Reducers: production → queues → logistics-cap (stub) → prices → readiness/science proxies → apply modifiers → KPIs + Vezies (36.2)
- Persistence & dev API: POST /api/sim/step (36.3)
- Analytics integration: GET /api/analytics/empire prefers engine snapshot (36.4)
- HUD: Step Engine button + last KPIs/logs (36.5)
- Demo: /demo/hud Step Engine shows KPI bar movement, queue progress; kpi_snapshots updated

Sprint B: Policies/Laws (Free-form) & AI Advisors (MVP) [Task 37]
- Policies storage & create endpoint (suggestions placeholder) (37.1)
- Approval & capped modifiers; engine reads active modifiers (37.2)
- Advisors endpoints (query/propose) + pending actions (37.3)
- Engine executes approved proposals on next step (37.4)
- HUD panels (Policies/Advisors) (37.5)
- Demo: approve a policy → Step Engine → KPI delta within band; advisor propose→approve → Step Engine → effect visible

Sprint C: Trade, Corporations, Markets (Phase 1–2) [Task 34]
- Price model & endpoint (34.1)
- Routes & tariffs + effects (34.2)
- Contracts API (spot, offtake) (34.3)
- Corps registry + sector KPIs (34.4)
- Economy indices & policies/taxes endpoints (34.5)
- UI panels (Trade, Economy, Corp) (34.6)
- Engine reflects tariffs/policies in KPIs
- Demo: prices vary with scarcity+tariffs; create contract → after step stockpiles change; indices respond to policy/tax slider

Sprint D: Analytics & KPIs (Consolidation) [Task 39]
- Schema & snapshot repository (39.1)
- Snapshot computation service (39.2)
- Analytics APIs (latest, trends) (39.3)
- HUD Analytics screen (39.4)
- Demo: analytics panels render; trends visible after multiple steps; bounded expectations

Sprint E: Verification & CI [Task 38]
- API tests: engine & scoring (38.1)
- API tests: policies & advisors (38.2)
- UI tests: HUD flows (Engine/Policies/Advisors/Prices) (38.3)
- CI plumbing: compose Postgres; server on 4010; BASE_URL; artifacts (38.4)
- Demo: green CI run with screenshots; brief seeded replay walkthrough

<!-- Lettered block consolidated into Unified Sprints above -->

Dependencies & Notes
- A precedes B (engine modifiers applied in B)
- C can proceed after A snapshotting; D consolidates analytics
- E can start in parallel but completes after C/D


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