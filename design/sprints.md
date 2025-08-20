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

Unified Sprint 11 — Incentive Response & Psychology Systems [Tasks 54-55] ✅ COMPLETED
- Realistic citizen responses to incentives and comprehensive human psychology modeling
- Fear/motivation systems, behavioral economics, risk assessment, social influence
- Demo: incentive response testing, psychological factor analysis, behavioral prediction accuracy
- APIs: GET /api/incentives/responses, GET /api/psychology/factors, POST /api/behavior/predict

Unified Sprint 12 — Governance & Democratic Systems [Tasks 56-57]
- Constitutional framework with Presidential and Parliamentary democracy options
- Election systems with periodic legislative, executive, and judicial elections
- Legislative bodies (Congress, Parliament, Senate) with constitutional powers and procedures
- Political parties, campaign systems, voter psychology integration
- Demo: constitution creation, election campaigns, legislative sessions, democratic processes
- APIs: GET /api/governance/constitution, POST /api/elections/campaign, GET /api/legislature/sessions

Unified Sprint 13 — Legal & Justice Systems [Tasks 58-59]
- Comprehensive legal framework following constitutional law
- Court system hierarchy (Local, Appeals, Supreme) with judicial appointments/elections
- Crime modeling, corruption tracking, legal case processing
- Law enforcement integration with psychology system for realistic crime patterns
- Demo: court proceedings, crime investigation, legal case management, corruption tracking
- APIs: GET /api/legal/courts, POST /api/crime/report, GET /api/justice/cases

Unified Sprint 14 — Security & Defense Systems [Tasks 60-61]
- Police force management with community policing and law enforcement
- National Guard deployment for domestic security and emergency response
- Prison systems for civilians and prisoners of war (POWs)
- Military justice system and wartime legal procedures
- Demo: police operations, prison management, military tribunals, security operations
- APIs: GET /api/security/police, POST /api/prisons/inmate, GET /api/military/justice

Unified Sprint 15 — Demographics & Lifecycle Systems [Tasks 62-63]
- Comprehensive lifespan tracking with birth, aging, and death modeling
- Casualty tracking from warfare, crime, natural disasters, and disease
- Population demographics evolution over time with realistic mortality rates
- Plunder and resource capture from conquered territories and defeated enemies
- Demo: population lifecycle, casualty reports, demographic transitions, conquest rewards
- APIs: GET /api/demographics/lifecycle, POST /api/casualties/report, GET /api/conquest/plunder

Unified Sprint 16 — Technology & Cyber Warfare [Tasks 64-65]
- Technology acquisition from conquered civilizations and defeated enemies
- Cyber warfare capabilities with technology theft and digital espionage
- Research acceleration through captured technology and stolen innovations
- Technology transfer and reverse engineering systems
- Demo: technology conquest, cyber attacks, research integration, innovation theft
- APIs: GET /api/technology/conquest, POST /api/cyber/attack, GET /api/research/stolen

Add-ons in S11:
- Branching time machine UI (parallel what‑ifs) with diffed narratives and promotion safeguards
 - Explainable diplomacy interacts with FX and central bank credibility in counterfactuals
 - Diplomats & Embassy workflows integrated with treaty DSL and previews
 - Hero Exploration & National Quests integration with sim/logistics (bounded effects)
 - FTL Jump Network (seeded lanes/nodes) and Ancient Artifacts discovery/activation (bounded effects)
 - Technology Tree (DAG) with research flows and bounded effects; UI and APIs

Unified Sprint 12 — Game Mode Foundation & Setup System [Tasks 70-74]
- Game mode selection and configuration system with mode-specific setup options
- Campaign creation interface with game mode selection (COOP, Achievement, Conquest, Hero)
- Victory condition framework with mode-specific win/loss criteria
- Player count validation and matchmaking for different game modes
- Mode-specific UI components and HUD elements
- Demo: game mode selection, campaign setup with different modes, mode-specific victory tracking
- APIs: GET /api/game-modes, POST /api/campaigns/:id/mode, GET /api/campaigns/:id/victory-status

Unified Sprint 13 — Alliance & Hero Party Foundation [Tasks 59-61, 68]
- Empire alliance system with diplomatic negotiations and treaty management
- Hero party formation and management with shared resources and coordination
- Intergalactic quest system with dynamic generation and shared encounters
- Comprehensive gifting and tribute system with cross-entity resource transfers
- Integration with COOP mode alliance mechanics and Hero mode party systems
- Demo: alliance formation, hero party quests, diplomatic gifts, tribute payments, shared adventures
- APIs: GET /api/alliances, POST /api/hero-parties, GET /api/quests/intergalactic, POST /api/gifts/send

## Extended Development Phases

### Phase 2: Game Mode Implementation (Sprints 14-17)

Unified Sprint 14 — COOP Mode: Galactic Defense Alliance [Task 75]
- Cooperative gameplay mechanics with shared resource pools and joint operations
- Galactic threat system with AI-controlled villain empires and cosmic disasters
- Alliance coordination tools and unified command structure
- Threat scaling based on combined player strength and coordination effectiveness
- Demo: multi-player defense against galactic threats, resource sharing, joint military operations
- APIs: GET /api/campaigns/:id/threats, POST /api/campaigns/:id/alliance-action, GET /api/campaigns/:id/alliance-status

Unified Sprint 15 — Achievement Mode: Galactic Supremacy Points [Task 76]
- Competitive point-based gameplay across multiple achievement categories
- Dynamic scoring system with point multipliers and achievement chains
- Real-time leaderboards with category breakdowns and competitive intelligence
- Balance mechanisms including catch-up bonuses and diminishing returns
- Demo: competitive point accumulation, leaderboard tracking, achievement chain progression
- APIs: GET /api/campaigns/:id/leaderboard, POST /api/campaigns/:id/achievements, GET /api/campaigns/:id/achievements/:playerId

Unified Sprint 16 — Conquest Mode: Total Galactic Domination [Task 77]
- Territory control mechanics with system-by-system conquest
- Military escalation systems including superweapons and alliance warfare
- Diplomatic manipulation with betrayal mechanics and espionage networks
- Victory conditions based on territorial control and empire elimination
- Demo: territorial conquest, military escalation, diplomatic betrayal, galactic domination
- APIs: GET /api/campaigns/:id/territory, POST /api/campaigns/:id/conquest, GET /api/campaigns/:id/military-status

Unified Sprint 17 — Hero Mode: Legendary Party Adventures [Task 78]
- Character-focused progression with special abilities and legendary equipment
- Villain AI system with adaptive tactics and personality-driven behavior
- Multi-act narrative structure with moral choices and story consequences
- Party coordination mechanics with specialized roles and combination attacks
- Demo: hero party adventures, villain confrontations, narrative progression, moral choices
- APIs: GET /api/campaigns/:id/heroes, POST /api/campaigns/:id/hero-action, GET /api/campaigns/:id/villain-status, GET /api/campaigns/:id/story-progress

### Phase 3: Advanced Multiplayer Systems (Sprints 18-21)

Unified Sprint 18 — Alliance Economic Integration [Task 62]
- Alliance trade networks, shared resources, and economic warfare capabilities
- Joint infrastructure projects and alliance currencies
- Demo: alliance trade benefits, economic warfare, shared projects
- APIs: GET /api/alliances/:id/economy, POST /api/alliances/:id/trade-agreement

Unified Sprint 19 — Real-Time Communication & Coordination [Task 63]
- Alliance diplomatic channels and hero party real-time coordination
- Secure messaging, tactical planning, and emergency protocols
- Integration with game mode-specific communication needs
- Demo: diplomatic negotiations, party quest coordination, real-time strategy
- APIs: WebSocket channels for alliance:{id} and party:{id}

Unified Sprint 20 — AI Diplomacy & Quest Generation [Tasks 64-65]
- AI-powered diplomatic negotiations and treaty generation
- Dynamic quest creation with adaptive narratives and encounters
- Mode-specific AI behavior (COOP threats, Achievement competition, Conquest warfare, Hero villains)
- Demo: AI diplomatic negotiations, procedural quest generation, adaptive difficulty
- APIs: POST /api/diplomacy/negotiate, GET /api/quests/generate

Unified Sprint 21 — Galaxy Events & Intelligence Networks [Tasks 66-67]
- Galaxy-wide persistent events and alliance intelligence sharing
- Coordinated espionage and information warfare capabilities
- Cross-mode event system supporting all game modes
- Demo: galaxy-wide events, alliance intelligence operations, persistent world changes
- APIs: GET /api/galaxy/events, POST /api/intelligence/alliance-operation

### Phase 4: Visual Systems Implementation (Sprints 22-25)

Unified Sprint 22 — Visual Foundation & Style Systems [Task 79]
- Style profile management system with campaign-wide visual consistency
- Character identity preservation using seed-based generation
- Basic image generation pipeline for portraits and simple scenes
- Visual asset database schema and storage systems
- Demo: character portrait generation with consistent identity, style profile selection
- APIs: POST /api/images/character, GET /api/visual/identity/:entityId, POST /api/visual/style-profile

Unified Sprint 23 — Environmental & Equipment Visuals [Task 80]
- Planet, city, and space environment image generation
- Spaceship, weapon, and equipment visualization systems
- Damage states and condition representation
- Species-specific architectural and technology design languages
- Demo: environmental scene generation, equipment visualization with damage states
- APIs: POST /api/images/environment, POST /api/images/item, GET /api/visual/species-templates

Unified Sprint 24 — Video Generation & Cinematic Events [Task 81]
- Event-driven video generation for major plot developments
- Character continuity system for videos using reference images
- Cinematic sequence creation for game kickoffs and endings
- Cross-media consistency validation between images and videos
- Demo: automated video generation for plot events, character continuity across media
- APIs: POST /api/videos/event, POST /api/videos/cinematic, GET /api/videos/job/:jobId

Unified Sprint 25 — Visual Integration & Performance Optimization [Task 82]
- UI integration with progressive enhancement and graceful degradation
- Performance optimization with caching, compression, and CDN integration
- Real-time visual generation and quality validation systems
- Cross-game mode visual consistency and game-specific visual triggers
- Demo: complete visual system integration, performance benchmarks, cross-mode consistency
- APIs: GET /api/visual/validate, POST /api/visual/optimize, GET /api/visual/performance-metrics

### Phase 5: Analytics & Optimization (Sprint 26)

Unified Sprint 26 — Comprehensive Analytics & Real-Time Integration [Tasks 56-58, 69]
- Complete real-time simulation integration with AI analysis → deterministic simulation → AI interpretation
- Alliance and hero analytics dashboard with performance metrics
- Comprehensive economic metrics and realistic policy impact simulation
- Visual analytics integration showing performance data with generated charts and infographics
- Demo: full real-time economic simulation, alliance performance analysis, hero progression tracking, visual analytics
- APIs: GET /api/simulation/realtime, GET /api/analytics/comprehensive, GET /api/analytics/alliances, GET /api/analytics/visual

## Production Readiness Phases

### Phase A: MVP Production Infrastructure (Sprints 27-32)
**Target**: Support 50 concurrent players with basic production infrastructure for playtesting

Unified Sprint 27 — User Management & Authentication Foundation [Task 83]
- User registration, login, and profile management with secure password policies
- JWT-based authentication with refresh tokens and session management
- OAuth integration (Google, Discord, Steam) for social login options
- Player handle system with uniqueness validation and character creation
- Demo: complete user registration flow, social login, profile management, character creation
- APIs: POST /api/auth/register, POST /api/auth/login, GET /api/users/profile, POST /api/users/character

Unified Sprint 28 — Payment System & Campaign Pricing [Task 84]
- Stripe integration for secure payment processing with PCI DSS compliance
- Dynamic pricing system based on campaign duration (4, 12, 24 weeks) and play hours
- LLM tier pricing (premium vs. free/low-cost options) and player count scaling
- Basic subscription management and billing system
- Demo: campaign pricing calculator, payment flow, subscription management, billing dashboard
- APIs: POST /api/payments/create-intent, GET /api/pricing/calculate, POST /api/subscriptions/create

Unified Sprint 29 — Campaign Creation & Scheduling System [Task 85]
- Campaign creation wizard with deterministic setup and seeded generation
- AI-generated campaign content (backstory, objectives, NPCs, map generation)
- Scheduling system for weekly recurring and 24-hour one-shot campaigns
- Player matching and campaign registration system
- Demo: complete campaign creation flow, AI content generation, scheduling interface, player matching
- APIs: POST /api/campaigns/create, GET /api/campaigns/available, POST /api/campaigns/join

Unified Sprint 30 — MVP Infrastructure & Deployment [Task 86]
- Docker containerization of all services for production deployment
- AWS EC2 infrastructure setup with load balancing and auto-scaling
- RDS PostgreSQL for user data and campaign metadata
- S3 storage for assets and backups with CloudFront CDN
- Demo: production deployment, load testing with 50 concurrent players, monitoring dashboard
- APIs: Health checks, monitoring endpoints, deployment automation

Unified Sprint 31 — Basic Admin Tools & Content Moderation [Task 87]
- Player reporting system for inappropriate content and behavior
- Basic admin dashboard for account management (suspend, ban, warnings)
- Campaign monitoring tools and intervention capabilities
- Automated content filtering for text and basic moderation queue
- Demo: player reporting flow, admin moderation tools, campaign oversight, content review
- APIs: POST /api/reports/create, GET /api/admin/users, POST /api/admin/moderate

Unified Sprint 32 — MVP Analytics & WordPress Marketing Site [Task 88]
- Basic player analytics (retention, engagement, conversion tracking)
- WordPress marketing site with landing pages, pricing, and blog
- Google Analytics 4 integration and basic business metrics
- Zoho Desk integration for customer support ticketing
- Demo: analytics dashboard, marketing site, support system, lead generation
- APIs: GET /api/analytics/players, GET /api/analytics/campaigns, WordPress REST API integration

### Phase B: Official Launch Infrastructure (Sprints 33-40)
**Target**: Support 500-10,000 players with full production features and scalability

Unified Sprint 33 — Kubernetes Orchestration & Microservices [Task 89]
- EKS cluster setup with auto-scaling and resource management
- Microservices architecture (User, Payment, Campaign, Game Server Manager, Analytics, Admin)
- Service mesh implementation for inter-service communication
- Advanced monitoring and observability with Prometheus and Grafana
- Demo: Kubernetes deployment, auto-scaling demonstration, service mesh monitoring
- APIs: Service discovery, health checks, metrics endpoints

Unified Sprint 34 — Advanced Security & Hardening [Task 90]
- VPC isolation with private subnets and security groups
- TLS 1.3 encryption for all data in transit, AES-256 for data at rest
- AWS Secrets Manager for secure credential management
- Multi-factor authentication for admin accounts and API rate limiting
- Demo: security audit, penetration testing results, compliance verification
- APIs: Enhanced authentication endpoints, security monitoring APIs

Unified Sprint 35 — Scalable Database & Caching Architecture [Task 91]
- RDS Multi-AZ with read replicas for high availability
- DynamoDB for session data and real-time features
- ElastiCache Redis for caching and session management
- Database sharding strategy for campaign data isolation
- Demo: database failover testing, performance benchmarks, caching effectiveness
- APIs: Database health endpoints, cache management APIs

Unified Sprint 36 — Advanced Analytics & Business Intelligence [Task 92]
- Comprehensive player analytics with churn prediction and cohort analysis
- Advanced game analytics with feature adoption and usage patterns
- Business intelligence dashboard with revenue forecasting and CLV analysis
- Real-time analytics pipeline with streaming data processing
- Demo: advanced analytics dashboard, predictive models, business intelligence reports
- APIs: GET /api/analytics/advanced, GET /api/analytics/business, GET /api/analytics/realtime

Unified Sprint 37 — Enhanced Admin Tools & Moderation [Task 93]
- Advanced admin dashboard with comprehensive account management
- AI-powered content moderation with machine learning models
- Complete audit logging and compliance reporting
- Escalation system for different violation types and automated responses
- Demo: advanced moderation tools, AI content filtering, audit reports, escalation workflows
- APIs: GET /api/admin/advanced, POST /api/moderation/ai-review, GET /api/audit/reports

Unified Sprint 38 — Friend Networks & Social Features [Task 94]
- Comprehensive friend system with requests and management
- Party formation for cooperative gameplay across campaigns
- Social features including messaging, activity feeds, and community tools
- Block and report functionality with social graph management
- Demo: social features integration, party formation, community tools, safety features
- APIs: GET /api/social/friends, POST /api/social/party, GET /api/social/feed

Unified Sprint 39 — DevOps & CI/CD Pipeline [Task 95]
- Comprehensive CI/CD pipeline with automated testing (unit, integration, E2E, performance, security)
- Blue-green deployment with zero-downtime updates and automatic rollback
- Infrastructure as Code using Terraform and Helm charts
- Environment management (dev/staging/production) with proper secret handling
- Demo: complete CI/CD workflow, automated deployment, rollback procedures
- APIs: Deployment status endpoints, environment health checks

Unified Sprint 40 — Backup & Disaster Recovery [Task 96]
- Automated backup strategy with RDS backups and S3 cross-region replication
- Disaster recovery plan with multi-AZ deployment (99.99% availability)
- Data retention policies and compliance management
- Automated failover procedures and recovery testing
- Demo: disaster recovery simulation, backup restoration, compliance reporting
- APIs: Backup status endpoints, recovery management APIs

### Phase C: Scale & Optimization (Sprints 41-44)
**Target**: Performance optimization, cost reduction, and advanced features for massive scale

Unified Sprint 41 — Performance Optimization & Cost Management [Task 97]
- Advanced caching strategies with CDN optimization and edge computing
- Database query optimization and connection pooling improvements
- Resource optimization through monitoring and right-sizing
- Cost optimization with reserved instances, spot instances, and usage analytics
- Demo: performance benchmarks, cost reduction analysis, optimization recommendations
- APIs: GET /api/performance/metrics, GET /api/costs/analysis, GET /api/optimization/recommendations

Unified Sprint 42 — Advanced Social & Community Features [Task 98]
- Enhanced community tools with forums, Discord integration, and player-generated content
- Tournament and competitive league systems with rankings and rewards
- Content creator tools and modding support with community marketplace
- Referral programs and viral growth mechanisms
- Demo: community platform, tournament system, content creation tools, viral features
- APIs: GET /api/community/forums, POST /api/tournaments/create, GET /api/content/marketplace

Unified Sprint 43 — Mobile Companion App & Cross-Platform [Task 99]
- Mobile companion app for iOS and Android with basic campaign monitoring
- Cross-platform synchronization and notification systems
- Mobile-optimized UI for essential features and emergency campaign management
- Push notifications for campaign events and social interactions
- Demo: mobile app functionality, cross-platform sync, notification system
- APIs: Mobile API endpoints, push notification services, sync protocols

Unified Sprint 44 — International Expansion & Localization [Task 100]
- Multi-language support with localization for major markets
- Regional deployment with CDN optimization for global performance
- Currency support and regional pricing strategies
- Compliance with international regulations (GDPR, CCPA, etc.)
- Demo: multi-language interface, regional deployment, compliance verification
- APIs: Localization endpoints, regional configuration APIs, compliance reporting

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