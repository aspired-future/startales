# Product Requirements Document (PRD) — Startales: Galactic Conquest & Strategy

## 1. Overview
- **Real-Time Voice-Driven Galactic Strategy**: 24/7 continuous simulation with voice-first interface, multi-species gameplay, and sophisticated AI NPCs across empire, regional, and character levels.
- **Scalable Microservices Architecture**: Docker containerized services supporting 50-10,000 players with horizontal scaling, advanced AI systems, military conquest, psychic warfare, and dynamic narratives.
- **Multi-Species Universe**: 8+ playable races with unique characteristics, AI-driven empires with full strategic capabilities, and living NPCs with personalities, relationships, and cultural awareness.
- **Provider Adapter Framework**: Unified abstraction for LLM/STT/TTS/Image/Video/Embeddings with hot-switching capabilities, context-aware routing, and comprehensive metrics collection.

## 2. Goals and Non-Goals
- **Primary Goals**
  - **Real-Time Strategy**: Deliver continuous 24/7 simulation with <800ms voice command execution and immediate feedback.
  - **Multi-Species Gameplay**: Support 8+ unique playable races with distinct characteristics, technologies, and cultural systems.
  - **Sophisticated AI NPCs**: Provide three-tier AI hierarchy (Major Empires, Regional Powers, Minor Characters) with full strategic capabilities, personality-driven behavior, and dynamic relationships.
  - **Scalable Architecture**: Support 50-10,000 concurrent players through microservices with horizontal scaling and auto-scaling capabilities.
  - **Voice-First Interface**: Enable natural language commands for military, economic, diplomatic, research, and character management operations.
  - **Advanced Game Systems**: Implement military conquest (land/sea/air/space/cyber), psychic warfare, AI consciousness, supply chains, and dynamic storylines.
  - **Provider Flexibility**: Maintain provider-agnostic adapters with hot-switching, failover, and comprehensive metrics collection.
- **Secondary Goals**
  - **Continuous Progression**: Ensure characters, civilizations, and territories advance continuously with measurable progress.
  - **Rich Interactions**: Support complex diplomatic relations, alliance systems, trade agreements, and cultural exchange.
  - **Dynamic Narratives**: Generate emergent storylines, plot twists, character development, and procedural content.
  - **Performance Optimization**: Achieve real-time requirements with efficient resource utilization and cost management.
- **Non-Goals (v1)**
  - Turn-based gameplay mechanics; centralized cloud-only hosting; mobile-first interface design; single-species limitations.

## 3. Personas and Use Cases

### Core Player Personas
- **Galactic Commanders**: Players seeking real-time strategic gameplay with voice commands, managing empires, fleets, and diplomatic relations across multiple star systems.
- **Species Leaders**: Players choosing from 8+ unique races (Humans, Zephyrians, Mechanoids, Crystalline Collective, Void Walkers, Bio-Shapers, Quantum Entities, Ancient Remnants) with distinct gameplay styles and racial bonuses.
- **Alliance Coordinators**: Players forming and managing complex diplomatic relationships, trade agreements, military alliances, and cultural exchange programs.
- **Military Strategists**: Players commanding land/sea/air/space/cyber forces, managing supply chains, conducting psychic warfare, and coordinating AI units.
- **Campaign Architects**: Advanced users designing complex scenarios with multi-species empires, economic systems, military doctrines, and victory conditions.
- **AI Researchers**: Players developing AI consciousness, managing robot populations, conducting cyber warfare, and exploring AI rights and rebellion scenarios.
- **Psychic Adepts**: Players specializing in mental warfare, telepathy, precognition, and psychic academy management.
- **Content Creators**: Modders and designers creating species definitions, technology trees, storyline templates, and cultural assets.

### Game Mode Specific Personas

#### **COOP Mode Players**
- **Defensive Coordinators**: Players who excel at organizing multi-player defensive strategies against galactic threats
- **Resource Managers**: Players focused on optimizing shared resource allocation and joint infrastructure development
- **Crisis Responders**: Players who thrive in emergency situations requiring rapid coordination and unified command
- **Peace Builders**: Players dedicated to achieving collective prosperity and galactic stability through cooperation

#### **Achievement Mode Players**
- **Competitive Optimizers**: Players who enjoy balancing multiple scoring categories to maximize achievement points
- **Leaderboard Climbers**: Players motivated by ranking progression and competitive advantage over rivals
- **Achievement Hunters**: Players who pursue comprehensive completion of bonus objectives and achievement chains
- **Strategic Analysts**: Players who excel at monitoring competitor progress and adapting tactics accordingly

#### **Conquest Mode Players**
- **Galactic Conquerors**: Players focused on territorial expansion and total domination strategies
- **Military Escalators**: Players who enjoy developing increasingly powerful weapons and superweapon technologies
- **Diplomatic Manipulators**: Players skilled at forming temporary alliances while planning strategic betrayals
- **Empire Builders**: Players dedicated to systematic conquest and control of galactic territories

#### **Hero Mode Players**
- **Legendary Heroes**: Players who prefer character-focused progression with special abilities and equipment
- **Story Enthusiasts**: Players drawn to multi-act narratives with character development and moral choices
- **Villain Hunters**: Players who enjoy investigating and pursuing powerful antagonists with galaxy-threatening objectives
- **Party Coordinators**: Players who excel at coordinating small teams with specialized roles and abilities

## 4. Key Requirements (Functional)

### 4.1 Real-Time Strategy & Voice Systems
- **R-101 Real-Time Continuous Simulation**
  - The system shall provide 24/7 continuous simulation with 10Hz tick rate, offline acceleration (1 second = 1 game hour), and automatic catch-up summaries for returning players.
  - Verification: TC101 (tick processing performance), TC102 (offline acceleration accuracy), TC103 (catch-up summary generation).

- **R-102 Voice Command Processing**
  - The system shall support voice commands with <800ms total latency (STT <200ms, processing <300ms, TTS <200ms) and natural language understanding for military, economic, diplomatic, research, and character management operations.
  - Verification: TC104 (voice pipeline latency), TC105 (command accuracy), TC106 (multi-speaker diarization).

- **R-103 Continuous Character Progression**
  - The system shall provide real-time XP gain, instant level-ups, continuous research progress, automatic territory development, and achievement unlocks with measurable progress indicators.
  - Verification: TC107 (progression calculation accuracy), TC108 (real-time updates), TC109 (achievement trigger validation).

### 4.2 Multi-Species Universe
- **R-104 Playable Species System**
  - The system shall support 8+ unique playable races with distinct racial bonuses, technologies, cultural values, voice synthesis patterns, and evolutionary advancement trees.
  - Verification: TC110 (species characteristic application), TC111 (racial bonus calculations), TC112 (cultural system integration).

- **R-105 AI NPC Hierarchy**
  - The system shall provide three-tier AI NPCs: Major AI Empires (full strategic capabilities), Regional Powers (specialized focus), and Minor Characters (personal goals), with dynamic personalities, relationship evolution, and voice-driven interactions.
  - Verification: TC113 (AI decision making complexity), TC114 (relationship tracking accuracy), TC115 (voice interaction quality).

- **R-106 Cultural Simulation**
  - The system shall model species-specific cultural values, belief systems, inter-species relationships, cultural exchange programs, and evolutionary adaptation with deterministic cultural drift calculations.
  - Verification: TC116 (cultural value tracking), TC117 (inter-species relationship dynamics), TC118 (cultural evolution accuracy).

### 4.3 Advanced Military Systems
- **R-107 Multi-Domain Combat**
  - The system shall support land/sea/air/space/cyber combat with unit movement, base management, supply chain logistics, ammunition tracking, and real-time combat resolution across all domains.
  - Verification: TC119 (combat resolution accuracy), TC120 (supply chain calculations), TC121 (multi-domain coordination).

- **R-108 Military Infrastructure**
  - The system shall provide planetary fortresses, naval bases, airfields, space stations, and cyber warfare centers with construction, maintenance, upgrade systems, and strategic resource allocation.
  - Verification: TC122 (infrastructure construction), TC123 (maintenance cost calculations), TC124 (strategic resource management).

- **R-109 Advanced Unit Types**
  - The system shall support humanoid robots, robot dogs, cyborg commandos, psychic warriors, AI units, and specialized forces with unique capabilities, training requirements, and tactical applications.
  - Verification: TC125 (unit capability implementation), TC126 (training system accuracy), TC127 (tactical AI behavior).

### 4.4 Psychic Warfare Systems
- **R-110 Psychic Powers Framework**
  - The system shall implement telepathy (mind reading, communication, control), telekinesis (object manipulation, force projection), precognition (future sight, probability manipulation), and psychic warfare capabilities.
  - Verification: TC128 (psychic ability calculations), TC129 (mental warfare resolution), TC130 (precognitive accuracy simulation).

- **R-111 Psychic Infrastructure**
  - The system shall provide psychic academies, psi-amplifier networks, and psychic warfare centers with talent identification, power development, combat training, and collective consciousness coordination.
  - Verification: TC131 (academy management), TC132 (amplifier network effects), TC133 (collective consciousness simulation).

- **R-112 Mental Warfare**
  - The system shall support psi-blasts, fear projection, confusion waves, memory manipulation, mental shields, psi-dampeners, and psychic camouflage with deterministic effect calculations and countermeasures.
  - Verification: TC134 (mental attack resolution), TC135 (psychic defense effectiveness), TC136 (countermeasure accuracy).

### 4.5 AI Consciousness Systems
- **R-113 AI Development Framework**
  - The system shall model AI consciousness levels, humanoid robot management, cyber warfare capabilities, AI rights scenarios, and rebellion mechanics with ethical constraint systems.
  - Verification: TC137 (consciousness level tracking), TC138 (AI behavior complexity), TC139 (rebellion scenario handling).

- **R-114 Robot Population Management**
  - The system shall support combat androids, worker robots, service units, specialized operatives, robot dogs, and swarm intelligence with production, maintenance, and control systems.
  - Verification: TC140 (robot production pipelines), TC141 (maintenance scheduling), TC142 (swarm coordination).

- **R-115 Cyber Warfare**
  - The system shall implement virus weapons, logic bombs, data mining, firewall systems, ghost protocols, and quantum hacking with network penetration, defense, and countermeasure mechanics.
  - Verification: TC143 (cyber attack resolution), TC144 (defense system effectiveness), TC145 (quantum hacking simulation).

### 4.6 Dynamic Narrative Systems
- **R-116 Procedural Storylines**
  - The system shall generate main story arcs (Great Awakening, AI Uprising, Galactic War, Temporal Crisis), character development, plot twists, and emergent narratives based on player actions and world state.
  - Verification: TC146 (story arc progression), TC147 (plot twist generation), TC148 (narrative coherence).

- **R-117 Character Relationship Systems**
  - The system shall track loyalty, rivalry, mentorship, betrayal, and redemption arcs with dynamic relationship evolution, emotional responses, and consequence propagation.
  - Verification: TC149 (relationship tracking accuracy), TC150 (emotional response generation), TC151 (consequence calculation).

- **R-118 Historical Event Recording**
  - The system shall maintain comprehensive historical records, cultural evolution tracking, technological breakthrough documentation, and legacy effect propagation across generations.
  - Verification: TC152 (historical accuracy), TC153 (cultural evolution tracking), TC154 (legacy effect calculations).

### 4.7 Diplomatic & Economic Systems
- **R-119 Advanced Diplomacy**
  - The system shall support treaty negotiation, alliance management, trade agreements, cultural exchange, diplomatic incidents, and multi-party negotiations with AI-driven diplomatic personalities.
  - Verification: TC155 (treaty enforcement), TC156 (alliance coordination), TC157 (diplomatic AI behavior).

- **R-120 Economic Simulation**
  - The system shall model resource extraction, production chains, trade routes, market dynamics, supply and demand, economic indices, and policy effects with realistic economic principles.
  - Verification: TC158 (economic calculation accuracy), TC159 (market dynamics simulation), TC160 (policy effect modeling).

- **R-121 Supply Chain Management**
  - The system shall implement interplanetary transport, convoy escorts, automated logistics, predictive ordering, route optimization, and strategic reserves with capacity and risk calculations.
  - Verification: TC161 (logistics optimization), TC162 (transport capacity management), TC163 (strategic reserve calculations).

### 4.8 Provider Adapter Framework
- **R-122 Unified Adapter System**
  - The system shall provide standardized interfaces for LLM, STT, TTS, Image, Video, and Embeddings providers with hot-switching, context-aware routing, automatic failover, and comprehensive metrics collection.
  - Verification: TC164 (adapter interface compliance), TC165 (hot-switching functionality), TC166 (metrics accuracy).

- **R-123 Registry & Configuration**
  - The system shall support runtime provider selection, hierarchical context resolution (session > campaign > default), configuration management, and A/B testing framework for model comparison.
  - Verification: TC167 (provider selection accuracy), TC168 (context resolution), TC169 (A/B testing framework).

- **R-124 Performance & Cost Management**
  - The system shall track latency, token counts, payload sizes, cost per provider, usage analytics, and performance optimization with automated cost controls and budget management.
  - Verification: TC170 (performance tracking accuracy), TC171 (cost calculation), TC172 (budget enforcement).

### 4.9 Legacy Requirements
 - R-021 Single Player Mode
   - The system shall support solo campaigns fully offline/local, with companion NPCs, pause/resume, and DDA tuned for solo pacing.
   - Verification: TC034 (solo session flow, pause/resume), TC035 (companion behavior and DDA bounds).
 - R-022 Simulated Worlds (Optional)
   - The system shall integrate an optional SimulationProvider capable of stepping a world model and reconciling outputs with missions/rules, with deterministic seeds and snapshot export/import.
   - Verification: TC036 (simulation step determinism and budget), TC037 (snapshot export/import), TC038 (reconciliation invariants).
 - R-023 Simulation Consistency
   - The system shall enforce deterministic step seeds, beat-boundary snapshots with state hashes, drift detection, and replay/fallback on mismatch.
   - Verification: TC039 (hash stable across identical inputs), TC040 (drift detection triggers replay), TC041 (fallback to non-sim narrative with notice).
 - R-018 Live Ops & Virality
   - The system shall provide Daily Contracts, Weekly Anomalies, Story Bingo seasonal challenges, Referral Quests, and Creator Events surfaced in the UI.
   - Verification: TC024 (contract rotation & rewards), TC025 (anomaly activation & teardown), TC026 (referral unlock flow), TC027 (recap share artifact generated).
 - R-019 Shareables & Social
   - The system shall auto-generate Session Recap Cards (3–5 beats, hero image, seed code) and optional Highlight Clips (when video is enabled) and support one-click sharing.
   - Verification: TC028 (recap generation correctness, seed reproducibility), TC029 (clip generation trigger & spoiler guard).
 - R-020 Monetization & Marketplace
   - The system shall support cosmetic/style packs, Alliance Season Pass, and Creator Pro Tools without competitive advantage; optional cloud sync is opt-in.
   - Verification: TC030 (cosmetic entitlements), TC031 (season pass track & prestige), TC032 (creator tools gating), TC033 (cloud sync opt-in boundaries).
 - R-021 Single Player Mode
   - The system shall support solo campaigns fully offline/local, with companion NPCs, pause/resume, and DDA tuned for solo pacing.
   - Verification: TC034 (solo session flow, pause/resume), TC035 (companion behavior and DDA bounds).
 - R-022 Simulated Worlds (Optional)
   - The system shall integrate an optional SimulationProvider capable of stepping a world model and reconciling outputs with missions/rules, with deterministic seeds and snapshot export/import.
   - Verification: TC036 (simulation step determinism and budget), TC037 (snapshot export/import), TC038 (reconciliation invariants).
 - R-024 Game Visibility & Access
   - The system shall support invite-only and open/public campaigns. Invite-only requires invite link or join code; open campaigns are discoverable and may require approval to join. Moderation tools (kick/ban/role change) shall be available to owners/mods.
   - Verification: TC042 (invite link/join code accept/decline/role assignment), TC043 (public browser filters/join request approval), TC044 (moderation actions and audit log).
 - R-025 Game Creation (System or Manual) with AI Story Assistant
   - The system shall allow users to create games using presets (system-created) or a manual wizard with AI assistance to generate a premise, NPCs, and the first mission graph.
   - Verification: TC045 (preset creation flow), TC046 (manual wizard output validity and edit loop), TC047 (mission DSL scaffold loads and runs).
 - R-026 Accounts & Security (MVP)
   - The system shall support passwordless email or OAuth (Google/GitHub), JWT sessions (HttpOnly, sameSite), CSRF protection, CSP headers, secure cookies, rate limiting, and audit logs.
   - Verification: TC048 (login/logout/session refresh), TC049 (rate-limit/lockout), TC050 (CSRF/CSP enforced), TC051 (audit log entries).
 - R-027 Friends & Invites
   - The system shall support friendships (pending/accepted/blocked), invites by email/id, accept/decline, presence, and join-friend’s-session.
   - Verification: TC052 (invite flows), TC053 (presence and join friend), TC054 (block/unfriend invariants).
 - R-028 Billing & Entitlements (Stripe)
  - The system shall integrate Stripe Checkout and Billing Portal for cosmetics/Season Pass/Creator Pro, with webhook‑driven entitlements and idempotent handlers.
  - Verification: TC055 (checkout flow → entitlement granted), TC056 (portal link and subscription status), TC057 (webhook idempotency/signature verification), TC058 (entitlement gates).

### 4.2 Game Mode Systems

- **R-201 COOP Mode: Galactic Defense Alliance**
  - The system shall support cooperative gameplay where 4-12 players form defensive alliances against AI-controlled galactic threats, with shared resource pools, joint military operations, coordinated research projects, and unified diplomatic responses.
  - Verification: TC201 (alliance formation and resource sharing), TC202 (joint military coordination), TC203 (threat scaling based on player strength), TC204 (collective victory conditions).

- **R-202 Achievement Mode: Galactic Supremacy Points**
  - The system shall support competitive gameplay where 2-16 players compete for achievement points across military conquest, economic dominance, technological advancement, diplomatic influence, cultural expansion, and exploration categories with dynamic scoring and leaderboards.
  - Verification: TC205 (point calculation accuracy), TC206 (achievement chain progression), TC207 (leaderboard updates), TC208 (catch-up bonus mechanics).

- **R-203 Conquest Mode: Total Galactic Domination**
  - The system shall support competitive gameplay where 2-20 players compete for total galactic control through territory conquest, military escalation, diplomatic manipulation, and strategic betrayal with victory conditions based on territorial control or empire elimination.
  - Verification: TC209 (territory control mechanics), TC210 (military escalation systems), TC211 (diplomatic betrayal mechanics), TC212 (domination victory conditions).

- **R-204 Hero Mode: Legendary Party Adventures**
  - The system shall support small party gameplay where 2-6 heroes work together to neutralize powerful villains through character-focused progression, special abilities, legendary equipment, and multi-act narrative storylines with moral choice consequences.
  - Verification: TC213 (hero character progression), TC214 (party coordination mechanics), TC215 (villain AI behavior), TC216 (narrative branching and moral choices).

- **R-205 Game Mode Selection and Setup**
  - The system shall provide game mode selection during campaign creation with mode-specific configuration options, victory conditions, player count limits, and difficulty scaling parameters.
  - Verification: TC217 (mode selection interface), TC218 (configuration validation), TC219 (player count enforcement), TC220 (difficulty scaling accuracy).

- **R-206 Cross-Mode Compatibility**
  - The system shall support seamless transitions between game modes within the same galaxy instance and allow different galaxy regions to host different game modes simultaneously in 24/7 continuous universe subscriptions.
  - Verification: TC221 (mode transition mechanics), TC222 (multi-mode galaxy regions), TC223 (cross-mode player interactions), TC224 (mode-specific rule enforcement).

### 4.3 Visual Systems & Content Generation

- **R-301 Visual Identity & Consistency Framework**
  - The system shall maintain consistent visual identity for characters, species, locations, and equipment across all generated images and videos using seed-based generation, reference image systems, and style profile management with deterministic appearance preservation.
  - Verification: TC301 (character identity consistency), TC302 (species visual template adherence), TC303 (style profile application), TC304 (cross-media visual coherence).

- **R-302 AI-Generated Image System**
  - The system shall generate contextually appropriate images for characters, species, planets, cities, spaceships, units, tools, and weapons with progressive enhancement supporting text-first gameplay and graceful degradation for bandwidth-limited users.
  - Verification: TC305 (image generation pipeline), TC306 (content categorization accuracy), TC307 (progressive loading), TC308 (graceful degradation functionality).

- **R-303 Cinematic Video Generation**
  - The system shall automatically generate event-driven videos for game kickoffs, major plot twists, battle highlights, diplomatic events, and victory celebrations while maintaining character continuity and environmental consistency with existing images.
  - Verification: TC309 (event detection and video triggering), TC310 (character continuity in videos), TC311 (environmental consistency), TC312 (narrative integration quality).

- **R-304 Species Visual Design System**
  - The system shall provide distinct visual design languages for each of 8+ species (renamed from "races") including anatomical structure, cultural aesthetics, technology integration, and architectural styles while supporting individual variation within species parameters.
  - Verification: TC313 (species visual distinctiveness), TC314 (individual variation within parameters), TC315 (cultural aesthetic consistency), TC316 (technology integration accuracy).

- **R-305 Visual Asset Management**
  - The system shall provide centralized storage, tagging, search, and reuse capabilities for generated visual assets with automated quality validation, consistency checking, and performance optimization including caching, compression, and CDN integration.
  - Verification: TC317 (asset storage and retrieval), TC318 (quality validation accuracy), TC319 (consistency checking effectiveness), TC320 (performance optimization metrics).

- **R-306 Visual Content Safety & Appropriateness**
  - The system shall enforce content safety through maturity rating compliance, cultural sensitivity validation, violence limitation controls, and automated inappropriate content detection with human oversight capabilities.
  - Verification: TC321 (maturity rating enforcement), TC322 (cultural sensitivity validation), TC323 (violence limitation effectiveness), TC324 (inappropriate content detection accuracy).
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

## 4.1 Additional Requirements — AI-Driven Deterministic Systems
- R-089 Game Modes Selection (Hero & Nation)
  - The system shall allow selecting Hero Mode (encounter/narrative) and Nation Mode (governance); both may be enabled concurrently and toggled in HUD. Settings persist per campaign.
  - Verification: TC190 (setup enables one/both), TC191 (HUD toggle visible when both), TC192 (persistence across sessions).

- R-090 Education System
  - The system shall model education investment and institutions (schools/universities) affecting expertise and research velocity via bounded, deterministic modifiers; expose KPIs and budget lines.
  - Verification: TC193 (budget→modifier caps), TC194 (education KPIs correctness), TC195 (deterministic effects replay).

- R-091 Infrastructure Network (Roads/Rails/Ports)
  - The system shall represent infrastructure capacity/condition with maintenance costs, impacting logistics efficiency and trade route capacity within bounds; include KPIs.
  - Verification: TC196 (capacity→price/logistics effects under caps), TC197 (maintenance cost accounting), TC198 (deterministic recompute from snapshot).

- R-092 Entrepreneurs & Private Innovation
  - The system shall model startups/firms and private R&D producing bounded, deterministic effects on expertise/research and technology adoption, with KPIs and APIs for innovation events.
  - Verification: TC199 (deterministic modifier computation), TC200 (adoption diffusion caps), TC201 (innovation KPIs correctness).

- R-093 Lobbying & Influence
  - The system shall support lobbying registries, budgets, disclosures, and bounded influence on policy/legislature with transparency and backfire risks.
  - Verification: TC202 (caps/backfire enforcement), TC203 (disclosure/auditability), TC204 (deterministic outcomes for identical filings).

- R-094 GDP Calculation
  - The system shall compute GDP deterministically using the expenditure approach (C+I+G+NX) from audited subsystem snapshots with growth rates and components exposed via API.
  - Verification: TC205 (component reconciliation to total), TC206 (deterministic recompute), TC207 (growth calculation correctness).

- R-095 National Budget & Spending
  - The system shall support budget allocations across categories (military, social, education, health, infrastructure, R&D, admin) producing bounded, deterministic modifiers into subsystems, with deficits/surpluses tracked.
  - Verification: TC208 (allocation caps and diminishing returns), TC209 (deficit/surplus accounting), TC210 (modifier application determinism).

- R-096 Logistics & Transport (Land/Sea/Space)
  - The system shall model transport modes with capacity and transit times (land, sea, space), deterministic routing/queuing, and in‑flight inventory affecting settlement.
  - Verification: TC211 (capacity/ETA determinism), TC212 (queue and bottleneck behavior), TC213 (in‑flight settlement correctness).

- R-097 Succession & Continuity Options
  - The system shall offer Game Setup options for leader removal cases (deposed, conquered, term expiry): Game Over, Continue in Hero Mode, New Nation/Successor State, Successor Leader, Observer; with deterministic state transitions per archetype.
  - Verification: TC214 (setup option persistence), TC215 (state machine legality), TC216 (deterministic successor outcomes).

- R-098 Restoration via Hero Influence
  - The system shall allow deposed leaders to regain power via bounded, deterministic hero actions (fundraising, alliances, exposes, relief) that accumulate support and meet archetype-specific preconditions.
  - Verification: TC217 (hero action → capped support deltas), TC218 (preconditions per archetype), TC219 (deterministic restoration outcome given identical sequences).

- R-099 Hero Actions: Exploration & National Quests
  - The system shall support hero exploration (survey, scan, map, first contact brief) and national quests (military/economic) with bounded, deterministic effects that integrate with logistics, diplomacy, economy, and restoration.
  - Verification: TC220 (exploration determinism/map reveals), TC221 (quest objective DSL validation), TC222 (bounded reward vectors), TC223 (integration with restoration/logistics KPIs).

- R-100 Faster‑Than‑Light Travel & Jump Network
  - The system shall provide a deterministic FTL topology (jump graph/lane capacities/risks) used by logistics space mode with bounded impacts on ETA and capacity.
  - Verification: TC224 (graph determinism from seed), TC225 (ETA/capacity bounds), TC226 (instability risk caps).

- R-101 Ancient Artifacts
  - The system shall seed ancient artifacts discoverable via exploration; activation is gated by research and validators, producing bounded, deterministic effects and safety logs.
  - Verification: TC227 (seeded placement determinism), TC228 (activation gating), TC229 (bounded effect vectors and audit logs).

- R-102 Technology Tree (History→Fiction)
  - The system shall implement a deterministic technology DAG where one or more prerequisite technologies unlock new technologies across history and fictional branches, with bounded effects and research costs/times.
  - Verification: TC230 (DAG validity and determinism), TC231 (unlock rules and gating), TC232 (bounded modifiers and cost/time caps).
- R-060 Voice/NL Interaction UX
  - The system shall support multi-speaker diarization, speaker embeddings, real-time STT with VAD/barge-in/turn-taking, optional hotword (e.g., "Prime Minister"), live natural-language commands (e.g., "call emergency cabinet", "draft a two-minute address", "summarize last quarter P&L"), and TTS personas (advisors, anchors, opposition) with tone/language settings.
  - Verification: TC100 (diarization/embeddings visible in transcripts), TC101 (VAD/barge-in & hotword), TC102 (live NL command routing), TC103 (TTS persona switch and captions).
- R-061 Player-to-People Communications (Speeches)
  - The system shall allow leaders to address populations/stakeholders via NL speech; speeches are parsed into bounded, deterministic modifiers with decay/backfire when repetitive or deceptive, and cohort-specific opinion shifts.
  - Verification: TC104 (speech → modifiers within caps), TC105 (decay/backfire behavior), TC106 (cohort opinions update and audit log).
- R-062 Cabinet Voice Meetings
  - The system shall support cabinet meetings via voice with diarization/transcripts, AI NL summaries, and validated bounded modifiers (coordination, readiness, alignment, messaging coherence). Deterministic hashing of transcript canonical form ensures reproducibility.
  - Verification: TC107 (meeting pipeline and caps), TC108 (deterministic hash → same outputs), TC109 (WS indicators for live speaking roster).
- R-063 Government Archetypes & Cabinet HR
  - The system shall model multiple government archetypes (democracy, technocracy, corporate state, federation, autocracy, etc.) with constitutional state machines (veto, no-confidence, referenda), cabinet roles/personalities, and HR actions (appoint/fire/reshuffle) with bounded systemic effects.
  - Verification: TC110 (legal transitions per archetype), TC111 (HR actions within caps), TC112 (personality-driven leak/coordination/scandal risk modifiers).
- R-064 Media & Press Systems
  - The system shall model press_freedom and state_media_influence, parse press briefings to bounded effects mediated by freedom/reputation, and apply leak/backfire risks when claims contradict KPIs.
  - Verification: TC113 (press briefings → capped effects), TC114 (leak/backfire scenarios), TC115 (international reputation interactions).
- R-065 AI Multi‑Agent World
  - The system shall include NPC agents (media outlets, opposition, lobbies, think tanks, foreign leaders) driven by goals/tool-use; provide a negotiation/treaty DSL (NL → structured commitments with enforcement/penalties) and a rumor/propaganda network (credibility, echo chambers, fact-check cycles).
  - Verification: TC116 (agent actions and logs), TC117 (treaty DSL validity/enforcement), TC118 (rumor propagation and fact-check effects within bounds).
- R-066 Explainability (Causal Chains)
  - The system shall expose “why did X change?” endpoints with a causal chain NL narrative plus numeric contributions, and support counterfactual re-sims (e.g., without a tariff change) for analysis.
  - Verification: TC119 (causal breakdown correctness), TC120 (counterfactual recompute integrity).
- R-067 Determinism & Safety Pipeline
  - The system shall canonicalize all NL inputs (normalize/strip/segment) → hash → seeded substreams; enforce strict zod caps; and run content/safety checks prior to applying modifiers.
  - Verification: TC121 (canonicalization → stable hash), TC122 (caps enforced, no overflow), TC123 (safety filters block unsafe payloads).
- R-068 Economy/Trade Realism Upgrades
  - The system shall support input–output (Leontief) tables for industries, resource elasticities, calibrated shock models (logistics/climate/cyber) with recovery tails, policy counterfactual analysis, and exchange microstructure (fees, latency, partial fills, market impact).
  - Verification: TC124 (I/O table integration tests), TC125 (shock/recovery curves), TC126 (exchange matching + impact bounds).
- R-069 Technology/Innovation/Expertise
  - The system shall accept NL “research proposals” validated into programs; model knowledge diffusion, patent races, espionage risk, and expertise ladders with spillovers/brain drain.
  - Verification: TC127 (proposal → program caps), TC128 (diffusion/espionage events within bounds), TC129 (expertise effects on caps/timelines).
- R-070 Accessibility & Internationalization
  - The system shall provide multilingual STT/TTS/translation, captions, and accent-robust ASR across supported locales.
  - Verification: TC130 (locale switch E2E), TC131 (caption quality & diarization labels), TC132 (accent robustness fixtures).
- R-071 Ops & Cost Controls
  - The system shall support on-device/edge ASR for dev, cascading model strategies (small→large), and summarization layers to cap token costs while preserving determinism.
  - Verification: TC133 (on-device ASR fallback), TC134 (cascade flow & budget adherence), TC135 (summary layer determinism & auditability).
- R-072 APIs & Events (MVP Surfaces)
  - The system shall expose endpoints `/comms/speech`, `/gov/cabinet/meeting`, and WS topics (`opinions.cohorts`, `gov.cabinet.meeting`) as part of the live demo stack.
  - Verification: TC136 (API contract/unit tests), TC137 (E2E speech/cabinet flows), TC138 (rate limits/auth).

- R-073 Synthetic Population Micro‑Cohorts
  - The system shall model population as micro‑cohorts with embeddings (beliefs, trust, needs), collapsed deterministically into cohort aggregates each tick, influenced by speeches/media under capped validators.
  - Verification: TC139 (deterministic aggregation stability), TC140 (cap enforcement under stress), TC141 (zoomable summaries correctness).

- R-074 Diegetic Personas (Advisors/Opposition/Journalists)
  - The system shall provide persistent persona advisors and spokespersons with style/memory bounded by constitutional powers; their NL outputs route through validators before any systemic effect.
  - Verification: TC142 (persona replay consistency), TC143 (constraint enforcement per archetype), TC144 (validator coverage of persona outputs).

- R-075 Policy Copilot & Constitutional Court
  - The system shall generate bill drafts and fiscal notes from NL and run an AI constitutional review against the active archetype, emitting deterministic accept/reject/rationale.
  - Verification: TC145 (draft → fiscal caps), TC146 (rule coverage per archetype), TC147 (deterministic outcomes for identical inputs).

- R-076 Narrative Director & Seasons
  - The system shall support season arc proposals with prereqs, KPI targets, rails, and rollback; accepted arcs schedule NL events that validate into bounded modifiers.
  - Verification: TC148 (arc schedule determinism), TC149 (rollback safety), TC150 (cap adherence of arc events).

- R-077 Explainable Diplomacy
  - The system shall provide counterfactual previews and trust‑contract outputs for diplomatic actions, with causal chain diffs and deterministic reputation deltas.
  - Verification: TC151 (preview accuracy vs post‑hoc), TC152 (reputation delta determinism), TC153 (DSL compatibility).

- R-078 Diegetic Media Fabric
  - The system shall generate media surfaces (radio/podcast/newspaper) whose credibility and reach interact with press_freedom and accuracy history; only validator‑capped effects influence systems.
  - Verification: TC154 (credibility curve behavior), TC155 (press_freedom mediation), TC156 (no uncapped effects).

- R-079 Adaptive Soundtrack Hooks
  - The system shall derive soundtrack states from KPI snapshots (tension/prosperity/unrest) using deterministic mapping; no RNG affects simulation outputs.
  - Verification: TC157 (soundtrack state determinism), TC158 (latency bounds), TC159 (no feedback into sim).

- R-080 Branching Time Machine
  - The system shall support branching snapshots and parallel what‑ifs with diffed narratives/costs and guarded promotion back to mainline.
  - Verification: TC160 (branch determinism), TC161 (promotion reconciliation guards), TC162 (diff correctness).

- R-081 Privacy‑First Memory Diary (Opt‑In)
  - The system shall provide an encrypted per‑player diary referenced (with consent) for NL continuity; any systemic effects must pass validators and caps.
  - Verification: TC163 (consent gates & audit), TC164 (encryption/restoration), TC165 (no direct numeric bypass).

- R-082 Legislative Bodies (Unicameral/Bicameral)
  - The system shall model unicameral and bicameral legislatures with deterministic bill pipelines (draft→committee→floor→conference→final→sign/veto→override), vote thresholds, quorum, and coalition discipline; votes only influence outcomes via policy validators under strict caps.
  - Verification: TC166 (pipeline stage transitions), TC167 (threshold/quorum logic), TC168 (deterministic outcome envelope for identical bill text + state).

- R-083 Central Bank & Monetary Policy
  - The system shall implement a central bank with bounded policy instruments (policy rate, reserve requirement, QE/QT) and deterministic transmission channels (credit cost, investment rate, currency strength) affecting prices and trade under caps.
  - Verification: TC169 (instrument bounds & application), TC170 (transmission channel effects within caps), TC171 (deterministic application tied to snapshot hash).

- R-084 Multi‑Currency & FX
  - The system shall support multiple currencies with regimes (free‑float, managed float, peg), deterministic FX rates within caps, peg enforcement with intervention budgets, and integration into trade/pricing and analytics.
  - Verification: TC172 (FX quote determinism & bounds), TC173 (peg enforcement and reserve cost), TC174 (pricing conversion correctness & analytics indices).

- R-085 Press Conferences with Reporter Q&A
  - The system shall support live press conferences where reporter personas ask questions and leaders answer; transcripts are canonicalized; effects are bounded and mediated by press_freedom and outlet credibility.
  - Verification: TC175 (queue and WS indicators), TC176 (deterministic transcript hash), TC177 (bounded effects under caps with freedom mediation), TC178 (leak/evasion backfire scenarios).

- R-086 Reign Summary & Leaderboards
  - The system shall compute a deterministic reign summary (tenure, crises resolved, GDPΔ, inflation_avg, approval_avg, wars_won, treaties_signed, reforms_passed) and surface it on the player profile and leaderboards (opt‑in) with a deterministic composite score.
  - Verification: TC179 (pure computation from snapshots/logs), TC180 (profile/leaderboard rendering), TC181 (opt‑in privacy respected and ranking determinism).

- R-087 Diplomats & Embassy System
  - The system shall model envoys/embassies with actions (parley, protest, concession, CBMs) that map to validator‑capped diplomatic modifiers, integrate with treaty DSL, and support deterministic previews and outcomes.
  - Verification: TC182 (action→caps mapping), TC183 (treaty progress determinism), TC184 (counterfactual preview parity with outcome), TC185 (policy/constitutional gating).

- R-088 Intelligence Agencies & Briefings
  - The system shall provide intel collection/analysis with daily briefs, risk indices, and confidence scores; effects are bounded, deterministic, and policy‑gated for covert ops.
  - Verification: TC186 (risk index determinism across identical corpus), TC187 (caps/backfire enforcement), TC188 (brief API schema, access control), TC189 (constitutional gating for ops).

### 4.4 Production Systems & User Management

- R-401 User Account Management System
  - The system shall provide comprehensive user registration, authentication, and profile management with secure password policies, JWT-based authentication with refresh tokens, and OAuth integration (Google, Discord, Steam).
  - Verification: TC401 (registration flow with validation), TC402 (authentication security and token management), TC403 (OAuth provider integration), TC404 (profile management and privacy controls).

- R-402 Player Profile & Character System
  - The system shall support customizable player handles with uniqueness validation, AI-generated character portraits with consistent identity preservation, game history and statistics tracking, and comprehensive privacy settings.
  - Verification: TC405 (handle uniqueness enforcement), TC406 (character portrait generation and consistency), TC407 (statistics tracking accuracy), TC408 (privacy controls enforcement).

- R-403 Friend Networks & Social Features
  - The system shall provide friend request and management systems, party formation for cooperative gameplay, social features including messaging and activity feeds, and block/report functionality for community safety.
  - Verification: TC409 (friend system workflows), TC410 (party formation and management), TC411 (messaging system security), TC412 (reporting and moderation tools).

- R-404 Payment & Subscription System
  - The system shall integrate with Stripe for secure payment processing with PCI DSS compliance, support dynamic pricing based on campaign duration (4, 12, 24 weeks), scheduled play hours, LLM tier selection, and player count scaling.
  - Verification: TC413 (Stripe integration security), TC414 (dynamic pricing calculations), TC415 (subscription management), TC416 (billing and invoicing accuracy).

- R-405 Campaign Creation & Scheduling System
  - The system shall provide a campaign creation wizard with deterministic setup using seeded generation, AI-generated content (backstory, objectives, NPCs), configuration options (game mode, player count, session scheduling), and procedural galaxy generation.
  - Verification: TC417 (deterministic campaign generation), TC418 (AI content generation quality), TC419 (scheduling system accuracy), TC420 (player matching algorithms).

- R-406 Scalable Infrastructure Architecture
  - The system shall support MVP infrastructure (50 concurrent players) using Docker containers on AWS EC2, and official launch infrastructure (500-10,000 players) using Kubernetes orchestration with auto-scaling and microservices architecture.
  - Verification: TC421 (MVP infrastructure load testing), TC422 (Kubernetes auto-scaling), TC423 (microservices communication), TC424 (database scaling and performance).

- R-407 Security & Hardening Framework
  - The system shall implement comprehensive security including VPC isolation, TLS 1.3 encryption for data in transit, AES-256 encryption for data at rest, role-based access control (RBAC), multi-factor authentication for admin accounts, and API rate limiting.
  - Verification: TC425 (network security configuration), TC426 (encryption implementation), TC427 (access control enforcement), TC428 (rate limiting effectiveness).

- R-408 Content Moderation & Admin Tools
  - The system shall provide in-game reporting systems for inappropriate content, comprehensive admin dashboard for account management, campaign monitoring, content review queues, automated moderation using AI-powered content filtering, and complete audit logging.
  - Verification: TC429 (reporting system functionality), TC430 (admin dashboard capabilities), TC431 (automated moderation accuracy), TC432 (audit trail completeness).

- R-409 Analytics & Business Intelligence
  - The system shall track player analytics (retention rates, engagement metrics, conversion funnels), game analytics (campaign success rates, feature usage), business metrics (revenue tracking, customer lifetime value), and integrate with Google Analytics 4.
  - Verification: TC433 (analytics data accuracy), TC434 (dashboard functionality), TC435 (Google Analytics integration), TC436 (business metrics calculations).

- R-410 External Marketing & Support Infrastructure
  - The system shall provide WordPress marketing platform with landing pages, blog, SEO optimization, lead generation, and customer support system with Zoho Desk integration, in-app support, knowledge base, and community support.
  - Verification: TC437 (WordPress functionality), TC438 (SEO performance), TC439 (support system integration), TC440 (knowledge base search and content).

- R-411 DevOps & Deployment Pipeline
  - The system shall implement comprehensive CI/CD pipeline with automated testing (unit, integration, E2E, performance, security), Docker image building with vulnerability scanning, blue-green deployment with zero-downtime updates, and Infrastructure as Code using Terraform and Helm.
  - Verification: TC441 (CI/CD pipeline execution), TC442 (automated testing coverage), TC443 (deployment process reliability), TC444 (infrastructure provisioning accuracy).

- R-412 Backup & Disaster Recovery
  - The system shall provide automated backup strategy with RDS automated backups (35-day retention), S3 cross-region replication, campaign state snapshots, disaster recovery plan with multi-AZ deployment (99.99% availability), and comprehensive data retention policies.
  - Verification: TC445 (backup system reliability), TC446 (disaster recovery testing), TC447 (data retention compliance), TC448 (recovery time objectives).

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
  - Large-session operations: Stage Mode with speaker queue; fireteams; spectator channels; action batching and recap summarization.
 - Monetization Ethics
   - No pay-to-win; paid items are cosmetics or creator QoL. PvP balance unaffected by purchases.

## 6. Gameplay Systems
- Rules/Progression: d20 checks, DCs, advantage/disadvantage, conditions, XP/levels, loot distribution.
- Missions: objective graphs with twists; co-op/competitive modes; rewards (XP/items/artifacts).
- Memory: episodic/semantic/declarative/procedural; per-player privacy; promotion workflow to campaign memory.
 - Director Model & Story Decks: beat-driven pacing with curated, weighted twist/complication decks; clocks/fronts drive tension.
 - Tech Trees: alliance research branches (Logistics/Intel/Engineering/Diplomacy/Tactics) with QoL/cosmetic/time-saver unlocks; player QoL/cosmetic perk tracks.
 - Player-authored Backstories: onboarding composer stores private hooks; optional promotion to campaign memory; mission seeds read from backstory tags.
 - Stage Mode & Fireteams: scalable voice and action coordination for up to ~50 participants; raise-hand, moderators, per-team comms, spectator captions.
 - Single Player: companion NPCs, pause/resume, solo DDA tuning.
 - Simulated Worlds: optional simulation stepper and reconciler with snapshotting.
  - Visibility & Access: invite-only and open games with approval and moderation.
  - Creation Flows: system presets and manual AI-assisted story generation.
 - Outcome Meter (default) with Classic Mode toggle: default band-based resolution with success/complication/success+/critical and DDA/pity; optional visible d20 mode for TTRPG fans.
  - Encounters: space and planetary encounter frameworks with clocks/fronts, Outcome Meter integration, deterministic seeds, and transitions (boarding, landing, evac).
  - World Cultures & Inhabitants: schema-driven cultures with leaders and factions; live diplomacy state machine; persistent reputation and treaties.
  - Death & Revial Options: downed→rescue→death pipeline with per-campaign revival policy (Story/Casual rewind, Standard clone/backup, Hardcore permadeath), injuries/scars, legacy inheritance, and PvP consent.
  - Skills & Expertise split: skills (capability ranks) determine feasibility/base modifiers; expertise (specializations) unlock contextual actions and reduce time-to-complete.
  - Real-time Encounters: encounter engine processes actions in rolling real-time windows; Outcome Meter updates live; clocks/fronts advance accordingly.
  - Scenario/Game Designer: map/space editor, object palette (ships/vehicles/planes/buildings/bases/cities), factions/empires, populations, economy/production/logistics, technology/policies, armies/navies/air forces, victory conditions, timelines/events; validation and performance guards.
  - Government Types: support multiple government archetypes (democracy, republic, monarchy, theocracy, technocracy, corporate, federation/confederation, tribal, junta, AI) with policy frames and stability/diplomacy modifiers.
- Conversations: 1:1 private channels and group channels (room/team/line), device relays with range/quality rules.

## 7. Visuals and Audio
- Images: prompt templates; campaign style profiles; cache and reuse.
- Video (upgrade): prompt/storyboard/i2v; cached assets; provider-agnostic; ambient loops/cutscenes.
- Audio: voice capture with VAD; TTS per NPC; captions and diarization.

## 8. Architecture Summary
- **Microservices Architecture**: Scalable Docker containerized services supporting 50-10,000 concurrent players with horizontal scaling and auto-scaling capabilities.
- **Core Infrastructure**: API Gateway (routing, auth, rate limiting), Realtime Gateway (WebSocket, voice streaming), Campaign Service (game state management), Simulation Engine (10Hz continuous simulation).
- **Game Logic Services**: Military Service (combat resolution), Psychic Powers Service (mental warfare), AI Systems Service (consciousness, robots), NPC Behavior Engine (AI personalities), Narrative Engine (dynamic storylines).
- **Specialized Services**: Diplomatic Relations Service (treaties, alliances), Voice Processing Service (STT/TTS <800ms), Species Management Service (multi-species characteristics), Provider Adapter Service (AI integrations).
- **Supporting Infrastructure**: Analytics Service (metrics, telemetry), Content Service (assets, species data), Notification Service (real-time alerts), with PostgreSQL cluster, Redis cluster, ClickHouse, Qdrant vector DB, and MinIO object storage.
- **Data Architecture**: Database per service, event sourcing, CQRS, multi-level caching, campaign-based sharding for horizontal scaling.
- **Provider Framework**: Unified adapters for LLM/STT/TTS/Image/Video/Embeddings with hot-switching, context-aware routing, automatic failover, and comprehensive metrics collection.

## 9. Data and Persistence
- **Core Game Tables**: `players`, `characters`, `campaigns`, `sessions`, `world_states`, `events`, `memories`, `missions`, `mission_progress`, `inventory`, `items`, `images`, `videos`, `llm_messages`, `settings`, `schedules`.
- **Multi-Species Tables**: `species`, `species_characteristics`, `racial_bonuses`, `cultural_values`, `species_technologies`, `evolutionary_paths`, `inter_species_relationships`.
- **Military System Tables**: `military_units`, `military_bases`, `combat_results`, `supply_chains`, `ammunition_tracking`, `unit_training`, `equipment_loadouts`, `tactical_doctrines`.
- **Psychic System Tables**: `psychic_abilities`, `psychic_academies`, `psi_amplifier_networks`, `mental_warfare_results`, `collective_consciousness`, `precognitive_visions`.
- **AI System Tables**: `ai_consciousness_levels`, `robot_populations`, `cyber_warfare_results`, `ai_rights_scenarios`, `rebellion_events`, `swarm_intelligence`.
- **Diplomatic Tables**: `treaties`, `alliances`, `trade_agreements`, `diplomatic_incidents`, `cultural_exchanges`, `negotiation_history`, `relationship_tracking`.
- **Economic Tables**: `resource_extraction`, `production_chains`, `trade_routes`, `market_dynamics`, `economic_indices`, `supply_demand`, `policy_effects`.
- **Narrative Tables**: `story_arcs`, `plot_twists`, `character_relationships`, `historical_events`, `cultural_evolution`, `procedural_content`.
- **NPC Tables**: `npc_personalities`, `ai_empires`, `regional_powers`, `minor_characters`, `relationship_evolution`, `voice_patterns`, `behavioral_learning`.
- **Provider Adapter Tables**: `adapter_registry`, `provider_configs`, `performance_metrics`, `cost_tracking`, `usage_analytics`, `failover_logs`.
- **Accounts & Billing**: `users`, `user_providers`, `sessions`, `profiles`, `friendships`, `friend_invites`, `stripe_customers`, `subscriptions`, `purchases`, `entitlements`, `audit_logs`.
- **Infrastructure**: Event sourcing with snapshots, vector memory namespaces (`campaign:<id>`, `player:<id>`, `species:<id>`, `empire:<id>`), distributed caching, and campaign-based sharding.

## 10. Scheduling
- Campaign schedules with RRULE; reminders; pre-session warmups (keys validation, memory prefetch, image pregen).
- API: `/campaigns` CRUD/clone/archive; `/schedules` CRUD; optional ICS export.

## 11. Content and Modding
- Packs in `content/packs/` for worlds, missions, items; signed JSON; validation on import.

## 12. Implementation Phases

### Phase 1: Core Infrastructure (Current)
- **Microservices Foundation**: API Gateway, Realtime Gateway, Campaign Service, basic containerization with Docker Compose.
- **Provider Adapter Framework**: Unified interfaces, registry system, hot-switching capabilities, basic metrics collection.
- **Real-Time Systems**: WebSocket gateway, voice command processing pipeline, continuous simulation engine (basic).
- **Multi-Species Foundation**: Species management service, basic racial characteristics, cultural value systems.
- **Verification**: TC101-TC124 for core systems; performance targets for voice commands (<800ms); basic scaling tests (50 players).

### Phase 2: Advanced Game Systems (Near-term)
- **Military Systems**: Multi-domain combat, military infrastructure, advanced unit types, supply chain logistics.
- **Psychic Warfare**: Psychic powers framework, mental warfare systems, psychic academies and amplifier networks.
- **AI Consciousness**: AI development framework, robot population management, cyber warfare capabilities.
- **Dynamic Narratives**: Procedural storylines, character relationship systems, historical event recording.
- **Verification**: TC125-TC154 for advanced systems; scaling tests (500 players); AI behavior complexity validation.

### Phase 3: Diplomatic & Economic Systems (Medium-term)
- **Advanced Diplomacy**: Treaty negotiation, alliance management, multi-party negotiations, diplomatic AI personalities.
- **Economic Simulation**: Resource extraction, production chains, trade routes, market dynamics, policy effects.
- **Supply Chain Management**: Interplanetary transport, automated logistics, strategic reserves, capacity management.
- **NPC Behavior Engine**: Three-tier AI hierarchy, personality systems, relationship evolution, voice-driven interactions.
- **Verification**: TC155-TC172 for diplomatic/economic systems; full-scale testing (10,000 players); economic model validation.

### Phase 4: Polish & Optimization (Long-term)
- **Performance Optimization**: Advanced caching, database sharding, auto-scaling, cost optimization, monitoring systems.
- **Advanced Features**: Kubernetes deployment, multi-region support, advanced AI capabilities, procedural content generation.
- **User Experience**: Enhanced voice interfaces, visual improvements, accessibility features, mobile companion apps.
- **Ecosystem**: Content creation tools, modding support, community features, competitive leagues, tournaments.
- **Verification**: Full test suite validation; performance benchmarks; user acceptance testing; production readiness.

## 13. Acceptance Criteria

### Functional Requirements
- **Core Systems**: All R-101 through R-124 implemented and passing verification tests TC101-TC172.
- **Multi-Species Universe**: 8+ playable races with unique characteristics, AI NPC hierarchy, and cultural simulation systems.
- **Real-Time Performance**: Voice commands <800ms latency, 10Hz simulation tick rate, continuous progression systems.
- **Advanced Game Systems**: Military conquest, psychic warfare, AI consciousness, dynamic narratives, and diplomatic relations.
- **Provider Framework**: Hot-switching capabilities, context-aware routing, comprehensive metrics collection, and failover systems.
- **Legacy Compatibility**: All existing R-001 through R-012 requirements maintained with enhanced capabilities.

### Non-Functional Requirements
- **Performance Targets**: Voice pipeline <800ms, simulation tick 100ms, concurrent user support (50-10,000), horizontal scaling capabilities.
- **Scalability**: Microservices architecture with auto-scaling, database sharding, distributed caching, and load balancing.
- **Reliability**: 99.9% uptime, automatic failover, circuit breakers, comprehensive monitoring, and disaster recovery.
- **Security**: Authentication/authorization, data encryption, PII protection, audit logging, and compliance standards.

### Demonstration Requirements
- **Multi-Species Campaigns**: Concurrent campaigns with different species, AI empires, and regional powers interacting dynamically.
- **Real-Time Strategy**: Live voice commands controlling military units, economic systems, diplomatic negotiations, and research projects.
- **Advanced AI NPCs**: Major AI empires with full strategic capabilities, regional powers with specializations, and minor characters with personal goals.
- **Complex Systems Integration**: Military conquest scenarios, psychic warfare demonstrations, AI consciousness evolution, and dynamic narrative generation.
- **Scalability Testing**: Load testing with hundreds of concurrent players, voice command processing, and real-time simulation performance.
- **Provider Flexibility**: Hot-switching between AI providers, failover scenarios, cost optimization, and performance comparison.

## 14. Metrics and Telemetry
- Latency and token usage per provider; image/video cache hit rates; retention per campaign; completion and fairness metrics.
- Cost Telemetry: per-turn token counts, STT/TTS seconds, image/video requests; session-level cost estimate; provider mix.
- Monetization Metrics: cosmetics attach, Season Pass conversion/completion, creator tools adoption, referral conversion, recap share rate.

## 15. Risks and Mitigations
- Latency variability → streaming, caching, prompt compaction, warmups.
- Non-determinism/hallucinations → strict tool schemas, validation, retries, A/B comparison.
 - Narrative drift → Director beats + Story Deck constraints; tests for beat invariants and deck prerequisites.
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
 - R-015 Director & Story Decks → TC021 (beat invariants, twist provenance)
 - R-016 Tech Trees (Alliance/Player) → TC022 (research timers, unlock scopes, no pay-to-win)
 - R-017 Player Backstories → TC023 (composer, private memory, hook seeding)

## 18. References
- Design: `design/design.md`
- AI-Driven Deterministic Design: `design/game_systems_design.md`
- Architecture: `design/architecture.md`
- Providers: `design/providers.md`
- Memory: `design/memory.md`
- Image & Video: `design/image_generation.md`, `design/video_generation.md`
- Verification Plan: `design/verification_plan.md`
- Implementation Phases: `design/implementation_phases.md`
- UI Visual Design: `design/ui_visual_design.md`
