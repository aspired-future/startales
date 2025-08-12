# Galactic Tale Weaver RPG — Product Design

## Vision
An immersive, voice-first, multiplayer space RPG where an AI Game Master (GM) orchestrates fast, cinematic adventures. Players collaborate or compete in dynamic missions, form alliances, level up, collect gear/artifacts, and shape a persistent universe. The game supports generated scene art and portraits, multi‑LLM backends, local-first storage, and resumable sessions.

## Player Experience Goals
- Fast, vivid narration (2–4 sentences per beat) with frequent situation updates
- Fully open-ended actions: players can attempt anything at any time
- Voice-driven by default; graphical UI provides scene art, objective HUD, party panel, minimap/timeline, and speech captions
- Collaborative and competitive modes, including team/alliance mechanics
- Meaningful progression: levels, skills, reputations, items/artifacts, and ship upgrades
- Save/resume and branch timelines; local-first privacy and control

## Game Modes
- Co-op Campaign: party completes mission arcs together; shared rewards and faction reputation
- Competitive Missions: team-vs-team objectives (control points, extraction, heist vs defense); optional permadeath arenas
- Alliances: cross-session groups with shared stash, research trees, and alliance missions; diplomacy/war states
- Freeplay Sandbox: emergent events in open sectors; players set their own goals
- Single Player: fully offline/local play with companion NPCs; pause/resume; DDA tuned for solo pacing

## Core Loop
1) Join session (select character, alliance/team)
2) Speak an intent; Action Interpreter yields structured action
3) GM narrates outcome; Rules Engine resolves checks; world state changes
4) Mission Engine advances objectives; Memory Engine stores episodic/semantic traces
5) Periodic situation updates; generated images illustrate scenes and NPCs
6) Persist state; players earn XP/loot; optional branching save

## Progression
- Attributes: Might, Agility, Intellect, Will, Presence, Tech
- Skills: Piloting, Hacking, Diplomacy, Xenology, Medicine, Stealth, Gunnery, Survival
- Checks: d20 + attribute + skill vs DC; advantage/disadvantage
- XP/Levels: tiers unlock perks, subclass features, ship modules
- Items/Artifacts: rarity tiers, affixes, active/passive effects; crafting and research
- Factions/Alliances: reputation tracks; alliance tech tree buffs

## Health, Injuries, and Medic/Medicines
- Health Model: per-character health with thresholds (Healthy, Wounded, Critical, Downed). Status effects (Bleeding, Fracture, Burn, Poison, Radiation) carry severity and timers.
- Injuries: persistent wounds/scars applied on severe failures or lethal hits; drive temporary debuffs and recovery goals; may become flavorful traits.
- Medic Skills: the Medicine skill unlocks actions (Stabilize, Field Heal, Surgery, Detox, Debride, Splint) with Outcome Meter bands affecting recovery time/cost.
- Medicines & Gear: consumables (medkits, coagulants, nanites, antitoxins, stim packs) plus clinic/bay facilities; items reduce timers/severity or convert complications to resource costs.
- Recovery: time-based ticks, facility bonuses, and rest; severe injuries require Surgery or clinic time. Logs recorded in vector memory for recap and audit.

## Skills (Capabilities)
- Core skills are ranked 0–5 and represent broad capabilities. They determine whether an action is feasible and provide the base modifier for outcomes and time-to-complete.
- Families (examples): Piloting, Navigation, Hacking, Engineering, Mechanics, Medicine, Survival, Stealth, Gunnery, Diplomacy, Xenology, Science, Linguistics, Demolitions, Security, Trade/Crafting, Leadership.

## Expertise (Specializations)
- Expertise are focused specializations under a skill (e.g., Piloting: Evasion; Hacking: Infiltration; Medicine: Trauma). They unlock contextual actions and band upgrades, and reduce time-to-complete for relevant tasks.
- Ranks 0–3 stack with the parent skill for time and band shifts; incompatible expertise do not apply.

## Task Time & Feasibility Model
- Feasibility: each action/task declares minimum skill rank (and sometimes required expertise). If below minimum, the action is not available unless alternative methods/tools are used.
- Time-to-complete (TTC): computed as a function of base task difficulty, skill rank, relevant expertise, tools/gear quality, and situational modifiers.
  - TTC = baseTime × difficultyFactor × (1 − skillFactor − expertiseFactor − toolFactor) × situational
  - Outcome Meter bands can trade time vs risk (faster = more risk of complication; slower = safer).
- Cooldowns & Recovery: certain actions impose cooldowns; failed attempts may increase TTC or require additional resources.
- Practice/Training: repeated success reduces TTC marginally up to a cap; formal training can upgrade expertise.

## Equipment: Tools, Weapons, Gear (Individuals)
- Tools: scanners, hacking kits, med scanners, engineering tools, demolition kits; unlock contextual actions and provide small band shifts when applicable.
- Weapons: ballistic/energy, melee; stats include damage band, accuracy modifier, noise/visibility, recoil, and tags (stun, silent, armor‑piercing, non‑lethal).
- Armor/Outfits: defense band, resistances (radiation/toxin/thermal), mobility modifiers, pockets/slots; stealth/camouflage attributes affect detection bands.
- Loadout & Encumbrance: slots with encumbrance thresholds; heavy load reduces agility/stealth bands and increases TTC for movement tasks.

### Armies & Unit Equipment
- Unit Templates: infantry, armor, artillery, air defense, special forces, logistics, engineers; equipment slots (primary/secondary systems, armor, tools, comms, sensors) and stats (readiness, supply, morale).
- Arsenal: small arms, crew‑served weapons, vehicle‑mounted systems; ammo/resource links tie to logistics supply; doctrine modifies band outcomes and TTC for entrench/build/repair.

### Ship Design (Space & Sea)
- Hull Classes: Corvette, Frigate, Destroyer, Cruiser, Carrier, Dreadnought (space); Patrol Boat, Corvette, Frigate, Destroyer, Carrier, Submarine (sea).
- Core Stats: hull integrity, tonnage/mass, power budget, crew, cargo, signature (radar/IR/EM/sonar), maintenance.
- Modules (slots): Propulsion (sublight/FTL/sea), Power (reactors/capacitors), Weapons (ballistic/energy/missile/PD/torpedo/railgun/flak) with arcs/cooldowns, Defenses (armor/shields/ECM/decoys), Sensors (radar/lidar/gravitic/sonar), Hangars/Drone Bays/Marine Barracks, Logistics (fuel/magazines/repair bay/stores), Command & Control.
- Capabilities: FTL class, carrier ops, boarding, stealth, e‑war, survey; capabilities unlock actions and modify bands and encounter TTC.
- Constraints & Balance: power/tonnage/signature budgets; tech tier gates; supply/maintenance costs scale with size; designer validates constraints.
- Designer Flow: pick hull → allocate budgets → install modules → set doctrine/loadout → validate → save template.

## Missions and Worlds
- Mission Template DSL (objective graph) with twists, fail states, rewards
- Worlds: sector definitions (planets, stations, hazards, factions, biomes) with style guides for image generation
- Seeding: base cooperative storyline and competitive scenarios (see `content/packs`)

## Scenario/Game Designer (Complex World & Systems)
- Purpose: Allow creators or hosts to design complex scenarios ranging from small adventuring parties to empire-scale simulations.
- Authoring Surfaces:
  - Map/Space Editor: hex/grid/world map, orbital layers, sea/air/space lanes; draw biomes and regions; place POIs and waypoints
  - Object Palette: units, ships (space & sea), vehicles, planes/aircraft, buildings, factories, bases, cities, resources/minerals nodes
  - Factions/Empires: create empires/kingdoms/houses with banners, leaders, policies, tech levels, doctrines
  - Government Types: Democracy, Republic, Monarchy, Theocracy, Technocracy, Corporate State, Federation, Confederation, Tribal, Military Junta, AI Governance; each grants policy frames (tax/trade/draft/press), stability modifiers, diplomacy stances
  - Populations & Demographics: size, growth, culture tags, happiness/order indices
  - Economy: currencies, price indices, production chains (inputs→process→outputs), factories, logistics (supply lines, depots), trade routes, market rules
  - Technology & Policies: research trees, laws (tax, draft, trade), infrastructure upgrades
  - Armies & Navies/Air Forces: OOB templates, doctrines, readiness/supply/morale, ROE
  - Victory/Fail Conditions: objective sets (territory, GDP, tech, reputation), timers, soft-fail arcs
  - Timelines & Events: scripted or procedural events with triggers, conditions, and actions
  - NPC Leadership: leaders with traits/goals; diplomacy matrix and stance logic
- Data Model (Designer Objects):
  - World: maps, regions, lanes, climate, hazards
  - Faction: name/emblem, government, leaders, policies, tech, relations
  - Population: size, growth, culture, happiness
  - Economy: currency, markets, commodities, resource nodes, factories, recipes, routes
  - Military: units, templates, supply, morale, doctrines
  - Assets: ships (space/sea), vehicles, planes, buildings, bases, cities with stats & slots
  - Logistics: supply lines, depots, throughput, attrition
  - Rules: turn/tick rate, DDA bounds, consent rules, revial policy
  - Objectives: victory/fail conditions
  - Content: missions, encounters, decks, NPCs, items
- Simulation Hooks:
  - Real-time tick (10–20 Hz) updates economy production/consumption, logistics flow, population changes, market prices, and unit readiness; Outcome Meter mediates high-level actions
  - Deterministic seeds; snapshot/export to packs; playtest mode launches session from current state
- Balance/Validation:
  - Invariants: conservation of resources, supply non-negative, no impossible production chains, soft bounds on growth/inflation
  - Feasibility: objects reference valid assets/templates; tech/policy prerequisites satisfied
  - Performance: capped object counts per layer with paging/LOD

## Encounters (Space and Planetary)
- Purpose: Provide focused scenarios that test navigation, combat, stealth, diplomacy, and exploration, integrated with the Mission and Rules engines.
- Flow (real-time): Detect/choose encounter → real-time ticks (10–20 Hz) aggregate actions within rolling windows (1–3 s) for resolution → Outcome Meter preview (bands, costs) updates live → apply actions (skill, expertise, gear, momentum) → advance encounter clocks/fronts → rewards/changes (reputation, items, world state).
- Space Encounters:
  - Types: dogfight, chase, blockade run, boarding prep, minefield navigation, anomaly traversal, distress response.
  - Systems: ship stats/modules, position/escape clocks, subsystem strain, boarding transition. Outcome Meter bands map to hull/system stress, position change, opportunity costs.
- Planetary Encounters:
  - Types: tactical skirmish, stealth infiltration, hazardous traversal, ritual/diplomacy summit, trade/crafting event, wilderness survival.
  - Systems: terrain tags, visibility/noise, local law/consent rules, resource clock (supplies), faction witnesses.
- Diplomacy & Social:
  - Negotiation bands (refuse/reluctant/agree/pledge) with risk preview; Momentum converts complications to costs (tribute, delay, reputation hit).
- Transitions: boarding (space → interior), landing (space → planetary), evac (planetary → space). Store deterministic seeds and encounter state for replay.

## Narrative Systems: Director Model, Story Decks, Plot Twists
- Director Model: maintains act/beat structure (Inciting → Rising → Twist → Climax → Denouement) per mission/run. Exposes current beat to GM/Narrative Engine and enforces pacing guardrails (short beats, stakes, recap points).
- Story Decks: curated, weighted card sets (events, complications, NPC agendas, environmental hazards). The Mission Engine draws from appropriate decks based on biome, faction, beat, and clocks to provide coherent twists and avoid repetition.
- Plot Twists: declared as typed cards (betrayal, time pressure, scarce resource, moral dilemma, hidden agenda). Each twist defines triggers, constraints, counterplay, and payoff hooks. Twists integrate with mission objective graphs as optional or soft-fail branches.
- Clocks & Fronts: public HUD clocks for visible tension; hidden GM clocks drive background threats. Reaching thresholds injects deck cards or advances fronts.
- DDA (Dynamic Difficulty): scale DCs, resource drip, and encounter pressure within bounds to preserve intended drama curve while respecting fail-forward.

## Voice and Graphics
- Voice: STT for player input (Whisper or local), TTS for GM/NPCs
- Graphics: generated images for scenes/NPCs/items via image models; cached for reuse
- UI: portrait overlays, scene cards, minimap/timeline, objective HUD, alliance/party panels, transcript captions

## Conversations (1:1 and Group)
- Direct (1:1): private voice/text channels between players (and player↔NPC), with isolated transcripts and optional encryption
- Group: auto-formed channels by proximity/room or by team/line; party/alliance channels; GM broadcast channel for situation updates
- Channel rules: join/leave controls, push-to-talk or VAD, per-channel volume/mute; captions and diarization per speaker
- Cross-channel relays: devices/artifacts can bridge channels (“same line”) with range/quality constraints managed by rules engine
 - Global channel: a campaign-wide "All-Hands" group chat (voice + text) that all players can join/leave; muted by default on join to prevent disruption
 - Ad-hoc groups with invites: players can create named group chats (voice + text) and invite others; invitees can accept/decline; owners/mods can remove members
 - Moderation: per-channel roles (owner/mod/member), mute/kick, invite-only toggle; audit log of joins/leaves/invites in campaign events

## GM Principles and UX Patterns (Video-game forward with Classic toggle)
- Agency-first: “yes, and…”, fail-forward, meaningful consequences; no railroading
- Pacing: short, vivid beats (2–4 sentences), clear stakes, frequent summaries
- Choice architecture: always surface 2–3 concrete options and allow freeform actions
- Ask questions to co-create specifics (names, motives, details)
- Rules transparency & drama (default Outcome Meter): show success bands (fail/complication/success/critical), a live chance bar, listed modifiers, and expected costs; keep a Classic Mode toggle to reveal d20 and modifiers for TTRPG fans.
- Encounter clocks/fronts track threats/tension visibly in the HUD
- “What can I do?” helper lists context-aware intents; toggle initiative/turn mode when combat starts
- Recaps: quick “Previously on…” at session start; periodic radio-style updates; end-of-session codas

## Memory Model (Vector-first)
- Separate namespaces: game/campaign memory vs per-player memory (no mixing)
- Memory types: episodic (events), semantic (facts/entities), declarative (lore/rules), procedural (systems)
- Embeddings stored locally (FAISS or SQLite-VSS) with metadata (owner, time, source, tags)
- Retrieval policies: intent-aware routing; per-player recalls exclude other players’ private memories by default

## Competitive and Alliance Design
- Teams: lobby selection or GM-assigned; dynamic alliances during missions (negotiated by players)
- Objectives: symmetric/asymmetric goals (heist vs defense, relay control, artifact extraction)
- Scoring: objective ticks, artifact capture, reputation swings; leaderboards per season
- Conflict rules: consent settings, safe zones, neutral space with law enforcement NPCs

## Alliance & Player Tech Trees
- Alliance Tech Trees: 3–5 branches (Logistics, Intel, Engineering, Diplomacy, Tactics). Nodes grant non-pay-to-win benefits: QoL, cosmetics, pre-session warmups (prefetch, pre-gen images), small in-run conveniences (additional quick-intent slots), and limited matchmaking perks. Unlocks cost alliance resources from missions and time-gated research. Seasonal prestige resets keep metas fresh; legacy cosmetics persist.
- Player Perk Tracks: personal meta progression that is cosmetic/QoL (HUD themes, recap frames, voice skins, loadout templates), not raw power. Separate from in-run character levels/gear.
- Creator Tech: optional creator-focused research (batch pre-generation, style consistency assistant) unlocked via play or pro tooling purchase.

## Simulated Worlds Mode (Optional)
- Overview: Integrate a simulation backend (Genie-like learned world models or procedural sandbox) to generate consistent world state and visuals, coordinated with the Narrative and Mission Engines.
- Providers: `SimulationProvider` adapters (local procedural sandbox; optional cloud learned world model). Select per campaign.
- Loop: `simulation.step` advances physics/agents within a budget; Director/Mission Engines reconcile sim outputs with objective graphs and rules; images/video can be derived from sim frames.
- Controls: step budget per beat; determinism via seeded step streams; export/import sim snapshots.
- Performance tiers: local procedural (CPU/GPU light) vs cloud learned model (GPU minutes billed). Fallback to non-sim narrative when disabled.

## World Cultures & Inhabitants
- Culture Schema: origin myth, governance, leaders, values/virtues, taboos, rituals, technology tier, economy, language motifs, art/style tokens, conflict history.
- Inhabitants & Factions: native species with physiological traits and social structures; factions with agendas, resources, and conflicts; notable leaders with public roles and secret goals.
- Generation & Packs: content packs define canonical cultures/leaders; AI can extend within schema; NPC personas inherit culture traits and goals.
- Live Interactions: leader/NPC personas maintain goals, memory of player actions, and adjust stance (diplomacy state machine: hostile ↔ neutral ↔ allied). Reputation and treaties persist in world state and vector memory.

## Ancient Artifacts (Optional System)
- Purpose: Introduce rare, high-impact relics with lore, risks, and progression hooks that can reshape encounters, economies, and diplomacy.
- Generation & Rarity: procedural + handcrafted sets; tiers (Common → Legendary → Mythic); provenance (ancient culture, site, epoch) and set bonuses.
- Mechanics:
  - Discovery: missions/encounters yield clues → excavation or recovery, with hazards and rival factions.
  - Identification: research pipeline (labs/scholars) reveals powers/risks over time; partial use pre-identification increases risk of backlash.
  - Powers & Costs: active/passive effects that shift Outcome Meter bands, unlock actions, or modify TTC; drawbacks (corruption, instability, faction attention) and maintenance costs.
  - Attunement & Limits: per-character or per-ship attunement slots and compatibility; over-attunement penalties.
  - Economy & Politics: black market prices, museum prestige, faction demands; crafting/synthesis of lower-tier fragments into higher-tier relics.
- UX & Consistency:
  - Lore cards with culture tags; image/portrait consistency via style profiles and seed reuse across sessions.
  - Optional toggle in setup/scenario designer to enable/disable artifact content or constrain tiers.

## Generated Images — Player-Facing
- Scene Cards: location/environment art (1024×576)
- Character Portraits: NPC/player visuals in a consistent art style
- Item/Artifact Cards: iconography with lore captions
- Map Tiles: stitched backgrounds with overlays for points of interest

## Periodic Situation Updates
- Every 90s or after 3 major events, the GM broadcasts a concise radio-style update; UI displays ticker + speaks via TTS

## Save/Resume
- Event-sourced session history + periodic snapshots; resumable and branchable timelines

## Multi-Campaign & Scheduling
- Multiple campaigns can run in parallel, each with fully isolated state, assets, and vector memories
- Campaign browser: create, clone, archive, branch from snapshot; per-campaign style profile and provider settings
- Scheduling: calendar-like per-campaign session schedule with time zone support and recurrence (RRULE-like)
  - Player invites and RSVP; reminders via desktop notifications and email/webhook (optional)
  - Auto-prepare session: prefetch memories, preload likely images/NPC portraits, warm up models
  - At start time: offer one-click resume of the last session or start a new one; auto-create a snapshot on end

## Game Visibility & Access
- Visibility: campaigns can be `invite-only` or `open`.
  - Invite-only: only invited users (or those with a join code) can join; supports allowlist/denylist and per-role invites (owner/mod/member).
  - Open (public): discoverable in the public browser; optional approval queue for join requests; max participants and Stage Mode defaults enforced.
- Joining:
  - Direct invite: invite link/token; accept/decline; role assigned on accept.
  - Join code: short-lived code to join invite-only campaigns without direct link; rate-limited.
  - Public browser: filter/search open games by tags (biome, difficulty, anomaly), player count, language.
- Moderation: owner/mods can kick/ban, toggle visibility, rotate join codes, and enable approval.

## Content & Modding
- Content packs in `content/packs` for worlds, missions, factions, items; import/export as signed JSON bundles

## Live Ops & Virality
- Daily Contracts: short, self-contained missions surfaced on Top Bar with rotating objectives; rewards are cosmetics/QoL and alliance resources.
- Weekly Anomalies: sector-wide mutators (e.g., low gravity, comms interference) that alter rules for a week; playlists rotate for co-op and competitive.
- Story Bingo: seasonal meta-challenges (grid of narrative feats) granting titles, frames, and style tokens.
- Referral Quests: invite a friend and complete a mission together to unlock duo cosmetics and a temporary XP QoL booster (in-run only).
- Creator Events: UGC jams with featured decks/worlds; in-client highlight rail.

## Shareables & Social
- Session Recap Cards: auto-generated 3–5 beat summaries with hero scene image; one-click share with a replay seed code (opt-in).
- Highlight Clips (when video upgrade is on): 15–30s cutdowns sourced from recent events with captions; streamer-safe mode hides spoilers.
- AI Postcards: posterized scene/portrait posters with campaign emblem; cosmetic watermark for paid users can be toggled.

## Monetization & Economy (Fun-first, Ethical)
## Leaderboards & Scoring
- Scopes:
  - Global (User): optional, opt-in aggregation across campaigns; shows user-level metrics (score, reputation, achievements). Privacy-preserving (pseudonymous handle), regional filters, and opt-out.
  - Campaign (In-Game): alliances leaderboard and individual leaderboard per campaign; reset on archive or season end.
- Metrics & Sources:
  - Objective score (mission/encounter ticks), wealth (net worth/GDP), domination (control %, territory), reputation, ELO/MMR for competitive playlists, seasonal points.
  - Anti-abuse: per-campaign caps, diminishing returns, duplicate-event guards, idempotent scoring events, anomaly detection.
- Seasonality:
  - Seasons per campaign and optional global seasons; start/end with rollover state and reward tiers; prestige retains cosmetics/titles.
- Tie-breaking:
  - Score → fewer attempts/time → recent activity → ELO → stable alphabetical.
- Update cadence:
  - Near-real-time for campaign boards (event-driven with debounce); periodic for global (hourly/daily jobs) with caching.
- Data & APIs:
  - Tables: `scores`, `leaderboards`, `score_events` with idempotency; snapshots for season rollovers.
  - REST: `/campaigns/:id/leaderboards/{alliances|individuals}`; `/leaderboards/global/users` with filters; pagination and privacy filters.
- UI:
  - Right rail tab for campaign boards; global accessible from Lobby; filters (scope, timeframe, region), search, and details drill-down.
- Cosmetics & Style Packs: portrait/scene styles, frames, emblems, TTS voice skins; no competitive advantage.
- Alliance Season Pass: cosmetics, titles, recap frames, and additional anomaly playlists. Seasonal prestige resets retain cosmetics.
- Creator Pro Tools: batch asset pre-generation, style consistency assistant, marketplace analytics (optional purchase).
- Optional Cloud Sync: cross-device and marketplace connectivity is opt-in; default remains local-first.

## Cost & Revenue Overview (Operational Assumptions)
- Operating Cost Profiles (session-wide, amortized):
  - Local-first (Ollama/Whisper/SDXL): ≈ $0 marginal cloud cost; infra VM only.
  - Standard Hybrid (cloud LLM mini + local STT/TTS/Images): ≈ $0.10–$0.40 per player-hour.
  - Premium (Claude/GPT-4‑class + cloud images, optional video): ≈ $0.30–$1.50 per player-hour.
- 50-player, 2‑hour event cost (GM batching, shared media):
  - Standard Hybrid: ≈ $10–$40 total.
  - Premium: ≈ $50–$150 total.
- Revenue Levers (see Business Summary for detail):
  - Cosmetics/style packs, Alliance Season Pass, content packs, Creator Pro Tools, optional cloud sync.
  - Target blended ARPDAU: $0.05–$0.20; season ARPPU: $15–$30; creator ARPPU: $5–$20/mo.
 - Simulated Worlds (when cloud GPU used): add ~$0.05–$0.30 per player-hour depending on step rate and clip export.

## Player-authored Backstories and Hooks
- Backstory Composer: onboarding flow allows players to write/import backstories (text or short audio). The system turns them into structured hooks (relationships, goals, secrets) stored in private `player:<id>` memory.
- Consent & Promotion: players can selectively “canonize” elements into shared `campaign:<id>` memory; audit log records promotions.
- Hook Integration: Mission Engine seeds personal side objectives and twist weights from backstory tags (e.g., rival factions, lost artifacts). Safety pipeline redacts disallowed content and offers reframing.

## Game Creation (System or Manual) with AI Story Assistant
- System-created games: choose a preset world/mission pack; AI seeds mission arcs and NPCs automatically.
- Manual creation: a guided wizard with AI assistance to co-author the premise, factions, key NPCs, and the first mission objective graph.
  - Steps: pick genre/style, write a short prompt, select tone; AI proposes a synopsis, starter NPCs, and a Mission DSL scaffold; user can accept/edit.
  - Outputs: a new campaign with `content/packs` skeleton, style profile, initial mission graph, optional story beats in Director Model, and setup steps to choose: (a) default resolution mode (Outcome Meter or Classic), (b) Revial Options (death/respawn model), (c) Win Criteria & Time Limit (optional), (d) Visual Generation level (off/characters/worlds/everything), (e) Lifetime Scope (one life ↔ civilization lifetime). The Classic toggle is also available in settings per session.

## Win Criteria & Time Limits (Optional)
- Victory Modes: Points (score thresholds), Wealth (net worth, GDP), Domination (territory/control), Reputation (faction standing), Technological (research milestones), Cultural (influence indices), Narrative (story beats), Custom composites.
- Time Limits: fixed duration (real-time or in-game ticks), sudden death, overtime rules; visible timers and progress dashboards.
- Setup: select one or multiple criteria with weights; choose time constraints; enable/disable mid-campaign by owner, with audit.

## Visual Generation Options & Consistency
- Levels: Off, Characters Only, Worlds/Locations Only, Everything (characters+items+worlds+vehicles+ships+cities).
- Per-Type/Per-Player Toggle: players can opt-out of certain visuals; campaign maintains consistent style profile.
- Style Profiles: enforce global art direction tokens; seed/ID reuse ensures continuity for recurring NPCs/ships/buildings.
- Paid Options: high-tier visual generation and Simulated Worlds are gated as paid features; toggles available in setup and settings with entitlement checks.

## Lifetime Scope
- One Life: character-centric arcs with limited timeline.
- Civilization Lifetime: long-horizon simulation with populations/economy/empires; supports generational play and succession.
## Death & Revival (Revial) Options
- Downed → Rescue → Death pipeline:
  - Downed state with visible death clock (encounter clock). Teammates can stabilize/revive, extract, or spend Momentum/resources to pause the clock.
  - If the clock expires (or lethal hit under Hardcore), character death triggers the revival policy below.
- Revial Options (per-campaign setup; overridable per-session by owner):
  - Story/Casual: limited rewinds/branching checkpoint restores per session (auto-snapshots). Minimal penalties.
  - Standard (default): clone/backup respawn with small, recoverable costs (temporary debuff/scar, minor XP debt/cap, gear repair bill). Optional rescue missions for body/gear.
  - Hardcore/Permadeath (opt-in): character retires permanently; obituary/legacy generated; no revive.
- Injuries/Scars & Legacy:
  - Persistent wounds/scars with cures or time-based recovery; may grant flavorful traits (small boon with cost).
  - Legacy system for replacements: partial inheritance of codex unlocks, titles, 1–2 bound items; partial reputation persists in alliance.
- PvP consent: lethal PvP subject to consent/toggles; non-lethal alternatives default.
- UX: lethality warnings in setup, visible death clock HUD, Hardcore confirmation prompts, post-death recap with next-arc hooks.

## Safety & Privacy
- Local-first; provider keys stored encrypted locally
- Redaction filters for PII in transcripts; configurable content safety

## Accounts, Security, Friends, and Billing (MVP)
- Accounts (optional cloud-enabled): passwordless email magic or OAuth (Google/GitHub). Short‑lived JWT (HttpOnly, sameSite) for session. Local‑first guest/offline mode always available.
- Security: rate limiting and IP/device fingerprinting for auth endpoints; CSRF for browser POSTs; CSP headers; secure cookies; audit logs; secret rotation; provider keys never stored raw.
- Friends & Invites: friendships (pending/accepted/blocked), friend_invites; flows: invite by email/id → accept/decline → presence; block/unfriend. “Join friend’s session” shortcut.
- Billing (Stripe): products for cosmetics, Season Pass, Creator Pro; Stripe Checkout + Billing Portal; webhooks grant entitlements; idempotent handlers with signature verification.
- Entitlements: single source of truth `entitlements(user_id, sku, scope, expires_at)`; UI gates for cosmetics/season pass; no PvP stat effects.
- External Portal (optional): a separate Next.js OpenSaaS app for accounts/billing can mint JWTs for this server; integrate via OAuth/JWT.

## Success Metrics
- Session retention, average scene latency, image generation cache hit rate, collaborative completion rate, competitive fairness (Elo spread)

## Player Count & Scaling Guidance
- Recommended co-op sweet spot: 4–6 players for fastest pacing and GM cadence.
- Competitive playlists: 6–10 total players (e.g., 3v3 to 5v5) with per-team voice.
- Large-session support: up to 50 concurrent participants per session using Stage Mode and fireteams:
  - Stage Mode: limited speakers (GM, commanders, NPC voices), many listeners; "raise hand" to request to speak; per-team voice rooms.
  - Fireteams/Subgroups: players organized into 4–6 person squads with local voice and action windows; the Director coordinates inter-squad beats.
  - Action Batching: intents collected per beat window; GM/Director resolves in batches and broadcasts concise summaries.
  - Summarization & Recaps: per-fireteam recaps roll up into a session-wide update to maintain coherence.
  - Media & Caching: aggressive asset prefetch and cache; placeholders-first render pipeline.
- Spectators & Casts: optional read-only spectators with caption stream and scene media; streamer-safe settings.
- Expectation: with Stage Mode and batching, 50-person sessions remain coherent; free-talk for all participants is disabled by default.


