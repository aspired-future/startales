# Startales: Galactic Conquest & Strategy — Product Design

## Vision
A massive, real-time, voice-driven galactic strategy game where players command multi-species empires across a living universe. Experience 24/7 continuous simulation with sophisticated AI NPCs, advanced military systems, psychic warfare, AI consciousness, and dynamic narratives. The game features scalable microservices architecture supporting thousands of concurrent players, with PC-first design and mobile companion capabilities.

## Player Experience Goals
- **Real-Time Strategy**: Voice commands execute in <800ms with immediate feedback and continuous 10Hz simulation
- **Multi-Species Immersion**: Choose from 8+ unique species with distinct characteristics, technologies, and cultural systems
- **Voice-First Interface**: Natural language commands for military, economic, diplomatic, research, and character operations
- **Living Universe**: 24/7 continuous simulation with AI empires, regional powers, and minor characters that evolve independently
- **Advanced Warfare**: Command land/sea/air/space/cyber forces, psychic powers, AI units, and complex supply chains
- **Dynamic Narratives**: Experience emergent storylines, plot twists, character development, and procedural content
- **Visual Consistency**: Rich, AI-generated visuals with consistent character, species, and environmental design
- **Cinematic Events**: AI-generated videos for major plot events, battles, and campaign milestones
- **Massive Scale**: Participate in galaxy-spanning conflicts with thousands of concurrent players
- **Cross-Platform**: PC-first experience with mobile companion apps for monitoring and basic commands
- **Persistent Progression**: Characters, civilizations, and territories advance continuously with measurable progress

## Game Modes & Subscription Tiers

### Core Game Modes

#### **COOP Mode: Galactic Defense Alliance**
- **Objective**: Multiple civilizations work together to defend against external threats from other galaxies
- **Player Count**: 4-12 players forming defensive alliances
- **Threats**: AI-controlled villain empires, cosmic disasters, interdimensional invasions
- **Victory Conditions**: Successfully repel all major threats, establish galactic peace, achieve collective prosperity
- **Unique Features**: Shared resource pools, joint military operations, coordinated research projects, unified diplomatic responses
- **Difficulty Scaling**: Threat intensity scales with combined player strength and coordination effectiveness

#### **Achievement Mode: Galactic Supremacy Points**
- **Objective**: Players compete to accumulate the most achievement points across multiple categories
- **Player Count**: 2-16 players in competitive environment
- **Scoring Categories**: Military conquest, economic dominance, technological advancement, diplomatic influence, cultural expansion, exploration achievements
- **Victory Conditions**: Highest total points at end of campaign period or first to reach point threshold
- **Unique Features**: Dynamic point multipliers, achievement chains, bonus objectives, leaderboard tracking
- **Balance Mechanisms**: Catch-up bonuses, diminishing returns on repeated strategies, rotating bonus categories

#### **Conquest Mode: Total Galactic Domination**
- **Objective**: Eliminate or subjugate all other player civilizations to achieve total galactic control
- **Player Count**: 2-20 players in direct competition
- **Victory Conditions**: Control 75% of galaxy territory, eliminate all rival empires, or achieve diplomatic hegemony
- **Unique Features**: Territory control mechanics, siege warfare, espionage systems, betrayal mechanics
- **Escalation Systems**: Increasing military technology, superweapons, alliance warfare, final confrontation events

#### **Hero Mode: Legendary Party Adventures**
- **Objective**: Small party of heroes works together to neutralize powerful villains with galaxy-threatening objectives
- **Player Count**: 2-6 heroes forming an elite party
- **Villain Types**: Rogue AI consciousness, psychic overlords, ancient awakened entities, interdimensional conquerors
- **Victory Conditions**: Defeat the primary villain, prevent galactic catastrophe, rescue key NPCs or artifacts
- **Unique Features**: Character-focused progression, special abilities, legendary equipment, dynamic villain responses
- **Narrative Structure**: Multi-act storylines, plot twists, character development arcs, moral choice consequences

### Subscription Tiers & Access

#### Scheduled Operations (Slot-Based Subscription)
- **Weekly Time Slots**: Players purchase specific recurring time slots (e.g., "Tuesdays 8PM EST, 3 hours")
- **Session Groups**: 4-8 players per session with consistent group membership
- **Game Mode Selection**: Each slot can be configured for specific game modes (COOP, Achievement, Conquest, Hero)
- **Slot Pricing**: Pay per weekly slot (e.g., $15/month per 3-hour weekly slot)
- **Multiple Slots**: Players can subscribe to multiple slots for different campaigns or game modes
- **Session Preparation**: Pre-session briefings and strategic planning through mobile companion apps

#### 24/7 Continuous Universe (Usage-Based Subscription)
- **Always-On Galaxy**: Persistent universe that evolves continuously with real-time simulation
- **Multi-Mode Support**: Different galaxy regions can host different game modes simultaneously
- **Usage Metering**: Charged based on active playtime and AI interactions (voice commands, LLM calls)
- **Tiered Limits**: Monthly hour caps with overage charges to control costs
- **AI Delegation**: Automated empire management when players are offline
- **Real-Time Interaction**: Join and leave at any time, interact with ongoing galactic events

#### Hybrid Subscription Options
- **Scheduled + Continuous**: Combine weekly slots with limited 24/7 access
- **Tournament Access**: Premium competitive events and leagues across all game modes
- **Creator Mode**: Advanced modding tools and content creation capabilities for custom game modes
- **Enterprise Groups**: Custom pricing for larger organizations or gaming groups

#### Free Trial (Limited)
- **Trial Duration**: 7 days with strict usage limits
- **Game Mode Access**: Limited to COOP mode with AI-controlled allies
- **AI Call Limits**: Maximum 50 voice commands or 2 hours of gameplay
- **Feature Restrictions**: Limited to 1 species, basic AI opponents, no premium content
- **Conversion Focus**: Showcase core gameplay while minimizing LLM costs

## Core Loop (Varies by Game Mode)

### Universal Core Loop
1) **Game Setup**: Choose game mode, species, establish empire/heroes, select starting territories and initial focus
2) **Voice Commands**: Issue natural language orders for military deployment, economic development, diplomatic negotiations, research priorities
3) **Real-Time Execution**: Commands execute immediately with <800ms latency; continuous 10Hz simulation processes all player and AI actions
4) **AI Responses**: Sophisticated AI empires/villains react dynamically with counter-strategies, diplomatic proposals, and military maneuvers
5) **Continuous Progression**: Characters level up, territories develop, research advances, and relationships evolve in real-time
6) **Strategic Updates**: Receive voice alerts and visual updates on critical events, battle outcomes, diplomatic developments, and opportunities
7) **Persistent Universe**: All actions have lasting consequences; the galaxy continues evolving with AI delegation when players are offline

### Mode-Specific Variations

#### **COOP Mode Loop**
- **Threat Assessment**: Monitor incoming galactic threats and coordinate defensive strategies
- **Alliance Coordination**: Synchronize resource sharing, joint military operations, and research collaboration
- **Crisis Response**: React to emergent threats with unified command structure and shared objectives
- **Victory Progress**: Track collective achievements toward galactic peace and prosperity

#### **Achievement Mode Loop**
- **Point Optimization**: Balance multiple scoring categories to maximize achievement points
- **Competitive Analysis**: Monitor rival players' progress and adapt strategies accordingly
- **Bonus Pursuit**: Identify and pursue high-value bonus objectives and achievement chains
- **Leaderboard Climbing**: Track ranking progression and adjust tactics for competitive advantage

#### **Conquest Mode Loop**
- **Territory Expansion**: Systematically conquer and control galactic territories
- **Military Escalation**: Develop increasingly powerful military technologies and superweapons
- **Diplomatic Manipulation**: Form temporary alliances while planning eventual betrayals
- **Domination Progress**: Monitor path to total galactic control and eliminate remaining threats

#### **Hero Mode Loop**
- **Villain Tracking**: Investigate and pursue the primary villain's activities and objectives
- **Party Coordination**: Coordinate specialized hero abilities and legendary equipment
- **Story Progression**: Advance through multi-act narrative with character development
- **Heroic Actions**: Make moral choices that affect story outcomes and character growth

## Visual Systems & Consistency Framework

### Text-First Design with Visual Enhancement
- **Progressive Enhancement**: Core gameplay is fully functional with text-only interface
- **Visual Augmentation**: AI-generated images and videos enhance but never replace text content
- **Graceful Degradation**: All features work without visuals for bandwidth-limited players
- **Optional Visuals**: Players can enable/disable visual generation based on preferences and performance

### Visual Content Categories

#### **Character & Species Visuals**
- **Species Templates**: Each of 8+ species has consistent visual identity and cultural aesthetics
- **Individual Variation**: Characters show genetic diversity within species parameters
- **Identity Preservation**: Seed-based generation ensures characters look consistent across appearances
- **Progression Visualization**: Character appearance evolves with experience, equipment, and story events
- **Expression System**: Emotional states and reactions reflected in facial expressions and body language

#### **Environmental & Location Visuals**
- **Planetary Environments**: Diverse biomes from desert worlds to gas giant stations
- **Architectural Styles**: Species-specific building designs and urban planning aesthetics
- **Space Environments**: Nebulae, star systems, space stations, and fleet formations
- **Scale Representation**: From intimate character scenes to galaxy-wide strategic overviews

#### **Technology & Equipment Visuals**
- **Spaceships & Vehicles**: Species-distinctive designs with visible damage states and modifications
- **Weapons & Tools**: Technology level and species origin reflected in visual design
- **Military Assets**: Ground, naval, air, and space forces with appropriate scale and detail
- **Condition States**: Visual representation of equipment condition from pristine to battle-damaged

### Visual Consistency Systems

#### **Style Profile Management**
- **Campaign Themes**: Each campaign has a consistent art style (e.g., "Gritty Space Opera", "Bio-Organic Horror")
- **Species Aesthetics**: Visual design languages unique to each species while fitting campaign style
- **Temporal Consistency**: Technology and fashion appropriate to campaign era and advancement level
- **Cross-Media Coherence**: Images and videos maintain identical visual identity for characters and locations

#### **Identity Preservation Technology**
- **Seed-Based Generation**: Deterministic character appearance using unique identity seeds
- **Reference Image System**: Master portraits ensure consistency across multiple appearances
- **Variation Control**: Clothing, expressions, and poses change while maintaining core identity
- **Cross-Session Continuity**: Characters look identical across different game sessions and campaigns

### Cinematic Video Generation

#### **Event-Driven Videos**
- **Game Kickoff**: Campaign introduction videos showcasing setting and key characters
- **Major Plot Twists**: Dramatic reveals and story developments enhanced with cinematic sequences
- **Battle Highlights**: Epic combat sequences showing key moments from major conflicts
- **Diplomatic Events**: Formal ceremonies, treaty signings, and first contact scenarios
- **Victory Celebrations**: Campaign conclusions and major achievement milestones

#### **Video Consistency Framework**
- **Character Continuity**: Videos use existing character portraits as reference for identical appearance
- **Environmental Matching**: Locations in videos match previously generated environmental images
- **Style Preservation**: All videos maintain campaign art style and visual consistency
- **Narrative Integration**: Video content directly supports and enhances text-based storytelling

## Player Presence & Delegation System

### Active Presence Requirements
- **Critical Decisions**: Major military operations, diplomatic negotiations, research priorities require player presence
- **Real-Time Events**: Battles, first contact scenarios, alliance meetings need synchronized participation
- **Strategic Planning**: Resource allocation, territory expansion, technology research benefit from direct player input
- **Visual Moments**: Important cinematic events and character interactions benefit from player witness

### AI Delegation (Between Sessions)
- **Routine Operations**: Basic resource gathering, standard production, defensive postures continue automatically
- **Defensive Actions**: AI can respond to immediate threats with pre-approved defensive strategies
- **Economic Management**: Trade routes, resource processing, infrastructure maintenance operate autonomously
- **Diplomatic Protocols**: AI maintains existing relationships but cannot make new major agreements
- **Visual Generation**: AI continues generating routine visuals (environmental updates, equipment states)

### Session Scheduling System
- **Recurring Time Slots**: Players commit to weekly 2-4 hour sessions at consistent times
- **Group Formation**: 4-8 players form persistent campaign groups with shared storylines
- **Session Preparation**: Mobile apps provide briefings, strategic updates, and planning tools between sessions
- **Visual Previews**: Pre-session image generation for key locations and characters
- **Makeup Sessions**: Flexible scheduling for missed sessions with catch-up mechanics
- **Cross-Group Interactions**: Scheduled inter-group events for larger conflicts and diplomacy

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

## GM Personality System (Per-Game Tone & Voice)
- Purpose: Each campaign/game configures a distinct GM personality that sets tone, narrative style, humor, and pacing. The Director Model and Story Decks adapt weights to match personality. The TTS voice/filters and visual frames use matching styles.
- Personality Schema:
  - id, name, synopsis (1–2 sentences)
  - tone (e.g., humorous, inspirational, adventurous, competitive, grim, cozy, mysterious)
  - diction/style tokens (e.g., pulp, noir, epic, documentary, Saturday-matinee)
  - pacing target (beats per 5 min), recap cadence, quip frequency
  - safety/consent emphasis (light ↔ intense)
  - twist profile (surprise vs foreshadow, irony vs fate)
  - encounter tilt (social, exploration, combat, puzzle)
  - image style defaults (scene/portrait tags)
  - ttsProfile (voice hints: timbre, speaking rate)
- Recommended Presets (examples):
  - Humorous Pulp: light, quippy, Saturday-matinee; frequent comedic asides; slapstick complications; bright pulp visuals; faster TTS.
  - Inspirational Epic: heroic, aspirational; long-arc payoffs; soaring diction; orchestral/epic imagery; measured TTS.
  - Adventurous Explorer: wonder-forward; descriptive vistas; discovery clocks; cartography imagery; balanced pacing.
  - Competitive Sportscaster: energetic commentary; score focus; fair-play tone; highlight reels; crisp staccato TTS; HUD emphasis.
  - Cozy Wholesome: gentle stakes; community/repair beats; soft palettes; slower cadence; low combat tilt.
  - Hardboiled Noir: terse, metaphor-rich; moral dilemmas; low-key lighting; mystery decks weight; gravelly TTS.
  - Grim Survival: scarcity & tension; hazard clocks; muted visuals; slower recovery; safety prompts emphasized.
  - High Diplomacy: politics and intrigue; formal diction; reputation swings; portrait-first visuals.
  - Mythic Saga: ritual and prophecy; archetypal beats; mythic scenery; choral cadence.
  - Cosmic Horror (consent-gated): dread pacing; redaction-friendly narration; oblique visuals; strict safety tools.
- Designer Flow:
  - Choose a preset or "Custom" → review generated synopsis and sliders (tone, pacing, twist, encounter tilt) → preview sample narration and TTS voice → save to campaign style profile.
  - The LLM prompt preamble includes personality tokens; Director beat weights and Story Deck sampling adapt accordingly. Session recaps and social cards inherit style.

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
### Game Resources & Currencies (Examples)
- Universal/Monetary
  - Credits (primary soft currency), Bonds/IOUs, Trade Vouchers, Alliance Scrip
  - Black‑market Chits, Bounties, Insurance Tokens
- Ship/Personal (adventuring)
  - Fuel Cells, Energy Cells, Power Cores, Coolant, Spare Parts, Repair Kits
  - Medkits, Nanites (medical/repair), Stims, Rations, Water, Oxygen Canisters
  - Ammunition (Ballistic/Energy/Missile), Grenades, Drone Batteries
  - Encryption Keys, Access Cards, Hacking Modules, Decoders
- Exploration/Discovery
  - Survey Data, Map Fragments, Geological Samples, Biological Samples, Anomaly Readings
  - Star Charts, Jump Coordinates, Relic Shards, Ancient Scripts
- Research & Intel
  - Research Points, Prototype Blueprints, Tech Samples, Datacores, Algorithm Licenses
  - Intel Reports, Signals Intercepts, Agent Leads, Decryption Progress
- Empire/Colony Management
  - Alloys/Metals (Iron, Titanium, Durasteel), Rare Elements (Iridium, Palladium, Neutronium)
  - Polymers, Ceramics, Superconductors, Quantum Crystals
  - Food, Water, Medical Supplies, Consumer Goods, Luxury Goods
  - Construction Materials, Habitat Modules, Reactors, Terraforming Units
  - Population, Workforce, Specialists (Scientists/Engineers/Doctors), Morale, Stability
  - Influence, Authority, Legitimacy, Governance Capacity, Corruption Index
  - Logistics Capacity (Freight Tonnage, Throughput), Fuel Reserves, Spare Parts Stock
- Production & Logistics
  - Ore, Refined Metals, Components, Circuits, Microfusion Cores
  - Shipyard Time, Fabricator Cycles, 3D‑Printer Spools, Assembly Hours
  - Trade Routes, Convoy Slots, Docking Priority Tokens
- Social & Reputation
  - Reputation (per Faction), Favor, Diplomatic Capital, Alliance Standing
  - Social Credits, Festival Tokens, Cultural Prestige, Media Reach
- Exotic/Artifacts (rare)
  - Dark Matter Shards, Zero‑Point Crystals, Psionic Resonators, Ancient Keys
  - Attunement Slots, Relic Integrity, Stabilizer Gel, Vault Clearance
- Environmental/Survival
  - Radiation Shielding, Thermal Gel, Filters, Air Quality Index, Habitat Integrity

Notes:
- Campaigns select a resource profile (light, standard, empire‑heavy) and can rename/scope resources.
- HUD surfaces a compact subset (Credits, Fuel, Supplies, Spare Parts, Alloys by default), with drill‑down to inventory/empire ledgers.
- Economy validation (designer): conservation, non‑negative stores, bottlenecks and soft bounds; conversion chains defined in content packs.

### Interstellar Trade, Corporations & Markets (Macro‑Economy; No Player Equity Investing)
- Trade Model
  - Supply/Demand: each planet/system tracks demand curves and export capacity per resource; prices adjust by stockpiles, throughput, distance, risk, and policy.
  - Routes & Logistics: create trade routes between planets/systems with convoy capacities, tariffs, and security risk; yields fees/taxes, affects relations.
  - Contracts: spot deliveries, long-term offtake, futures (delivery at time T), and options (right to buy/sell). DDA adjusts margins by difficulty/anomalies.
  - Diplomacy: treaties unlock preferential tariffs, exclusive lanes; embargoes/sanctions raise risk and costs.
- Corporations (Player- and AI-owned)
  - Formation: register corp with homeworld jurisdiction; select sector (Mining, Logistics, Manufacturing, Energy, Agriculture, Biotech, Finance, Trade, Research, Infrastructure).
  - No Player Equity Investing: players cannot buy/sell shares; markets act as macro indicators only. Corporations are NPC/player‑owned for operational purposes (facilities, routes, contracts) but equity is not a gameplay instrument.
  - Governance: simplified—policy hooks (compliance, reporting) and reputation affect contract terms, tariffs, and route priority.
  - Operations: own facilities, convoys, IP (blueprints), and contracts; KPIs (output, margin, on‑time delivery) feed economy health and indices.
- Stock Markets
  - Indices Only: per‑region/system economy indices (Resource Index, Logistics Index, Manufacturing PMI, Energy Index) derived from corp KPIs and trade volumes. No order entry, portfolios, or player trading.
  - Events: earnings snapshots, facility online/offline, piracy incidents, policy changes; news/sentiment affect indices (bounded).
- Investing Between Parties (Players, NPCs, Aliens)
  - Disabled for MVP: No equity investing or funds. Credit/loans remain narrative hooks only for contracts/logistics (no margin accounts).
- Government & Policy (Economy Management)
  - Laws & Policies: define tariffs, subsidies, standards (safety, environmental), price caps/floors (for crises), and labor policies. Policies influence supply/demand, uptime, and route risk.
  - Taxation: progressive corp tax, trade tariffs, VAT‑like sales tax; adjustable rates per region/system. Taxes fund Government Budget categories (Defense, Infrastructure, Research Subsidies) which apply bonuses/penalties to convoys, facility output, and research speeds.
  - Incentives: subsidies reduce effective costs, tax credits boost sector output, grants trigger corp KPIs (and index gains) with diminishing returns.
- UI & HUD
  - Trade Panel: live prices, demand/supply heatmap, contract builder, convoy planner; alerts on policy/tariff changes and anomalies.
  - Economy Panel: indices dashboard (Resource, Logistics, Manufacturing, Energy), corp KPIs by sector, news/sentiment, budget/tax sliders (authorized roles only).
  - Corporation Sheet: sector, facilities, routes, contracts, KPIs; compliance flags; no cap table or equity UI.
- Data & APIs (initial targets)
  - Tables: `corps(id, name, sector, hq_system_id)`, `corp_kpis(corp_id, ts, output, margin, on_time_rate)`, `indices(region, ts, resource_idx, logistics_idx, mfg_idx, energy_idx)`, `contracts(id, buyer_system_id, seller_system_id, resource, qty, price, deliver_at)`, `tariffs(system_id, resource, rate)`, `routes(id, from_system_id, to_system_id, capacity, risk)`, `policies(id, region, type, value, effective_at)`, `tax_rates(region, corp_tax, tariff_default, vat)`.
  - REST (examples): `/api/trade/prices?system=:id`, `/api/trade/contract`, `/api/corps`, `/api/economy/indices?region=:id`, `/api/economy/policies`, `/api/economy/taxes`.
- Scoring & Balance
  - Story/Discovery Vezies for treaty/proposal outcomes and market-impacting events; Empire Vezies for trade throughput, profitability, and route stability; Social Vezies for joint ventures and funds performance.
  - Anti-exploit: rate limits, transaction taxes, bounded index moves, idempotent contracts; insider info flagged by audit with narrative consequences.
  - Simulation Tick: recompute prices from supply/demand + tariffs/subsidies, decay sentiment, apply logistics delays/attrition; event-driven jumps.

### Empire Analytics & KPIs (Economy, Military, Population, Science)
- Objectives
  - Provide a unified health dashboard for the empire with actionable KPIs that respond to player and NPC decisions.
  - KPIs influence difficulty pacing, resource availability, event generation, and policy effectiveness.
- KPI Categories (non-exhaustive)
  - Economy: GDP proxy (production value), trade volume, budget balance (tax revenue vs spend), inflation proxy (price drift), unemployment proxy (idle workforce), logistics throughput, facility uptime.
  - Military: fleet strength (power index), readiness % (supply/ammo/fuel), losses (7/30‑day), mobilization level, logistics readiness.
  - Population & Society: total population, growth rate, morale, stability/unrest, health index, education index, migration.
  - Science & Research: tech velocity (research points/tick), labs uptime, breakthroughs count, policy impact on R&D.
  - Infrastructure & Environment: power capacity utilization, habitat integrity, hazard incidents, pollution index.
- Data Model (snapshots)
  - `kpi_snapshots(scope, region_or_campaign_id, ts, metrics JSONB)` capturing category metrics per tick; schema versioned.
  - Aggregations: rolling windows (7/30 ticks) for trends; alert thresholds with hysteresis.
- APIs
  - `GET /api/analytics/empire?scope=campaign` → latest snapshot with categorized KPIs and trend deltas.
  - `GET /api/analytics/trends?window=30` → time series for charts (economy, military, population, science).
  - `POST /api/economy/policies` and `POST /api/economy/taxes` (authorized) adjust levers; effects propagate to KPIs on next tick.
- HUD Analytics Screen
  - Panels: Economy (indices, budget sliders, revenue/spend charts), Military (strength/readiness, supply), Population (growth/morale/stability), Science (velocity/breakthroughs), Infrastructure (uptime/capacity), Alerts (threshold breaches, decisions needed).
  - Controls: authorized players can adjust taxes/policies via sliders/toggles; show projected impacts with confidence bands.
  - Accessibility: color‑blind safe palettes, clear icons, and tooltips for each KPI; keyboard navigable.
- Simulation & Decisions
  - On each tick, recompute KPIs from in‑world state (stockpiles, routes, contracts, units, population models). Policies/taxes apply multiplicative/additive modifiers with caps.
  - Player/NPC actions (build, allocate fleet, enact policy) update inputs feeding KPIs; alerts drive narrative events.
- Verification
  - KPI math unit‑tested; API returns stable shapes; HUD charts/elements verified via Playwright; thresholds/alerts tested with fixtures.

### Planetary Resources, Mining, and Construction (Empire Mode)
- Planet Resource Profiles
  - Each planet is procedurally assigned a resource profile at generation: biome, hazard level, and per‑resource richness (0–5) for key categories (e.g., Alloys/Metals, Rare Elements, Polymers, Fuel, Food/Water, Biotech, Exotic Gas, Relic Sites).
  - Special nodes: high‑yield deposits, relic veins, geothermal vents, and strategic choke points; may require specific tech to exploit.
- Survey & Claim
  - Scanning missions reveal the resource map (fog‑of‑war). Claiming requires presence, influence, or treaties. Hostile worlds may require pacification before exploitation.
- Extraction & Processing
  - Facilities: Mines, Wells, Collectors, Farms, Reactors, Refineries, Fabricators, Shipyards, Research Labs, Habitats, Logistics Hubs, Defense Turrets.
  - Yield model: \(base\_yield = richness\ * facility\_tier\ * tech\_multiplier\ * workforce\_efficiency\ * uptime\). Uptime depends on power, maintenance, morale, and hazard downtime.
  - Conversion chains (examples):
    - Ore → Refined Metals → Alloys → Components → Ships/Vehicles/Buildings
    - Raw Organics → Food/Medical Supplies → Population Growth/Upkeep
    - Fuel/Gas → Power → Production Uptime/Throughput
  - Depletion/Regeneration: soft depletion with diminishing returns; renewable sources (solar, farms) stabilize; sustainability tech reduces depletion slope.
- Logistics & Upkeep
  - Stockpiles per planet/system; convoy routes with throughput caps; convoy slots and docking priority tokens gate movement.
  - Upkeep costs per tick: power, spare parts, workforce rations/wages; shortages reduce uptime and morale.
  - Risk: piracy/raids cause loss; escorts and defenses mitigate.
- Construction & Requirements
  - Buildings (examples):
    - Mine (T1→T3): Alloys + Components + Power; workforce required; output Metals.
    - Refinery/Fabricator: Refined Metals + Polymers + Power; outputs Alloys/Components.
    - Shipyard: High Alloys + Components + Reactors + Shipyard Time; enables ship construction queues.
    - Habitat/Research: Construction Materials + Power + Upkeep; boosts workforce/science output.
  - Ships (examples):
    - Corvette: Alloys (x), Components (y), Power Cores (z), Ammunition (start), Crew; requires Shipyard Time.
    - Frigate/Cruiser scale costs non‑linearly and consume more Shipyard Time and Upkeep.
  - Vehicles & Armies:
    - Vehicles: Alloys + Components + Fuel capacity; Factory Time.
    - Armies: Equipment (Alloys/Polymers), Training Time, Supplies (Food/Medical), Upkeep.
  - Expansion Gating: founding colonies/outposts requires Construction Materials, Habitat Modules, Food/Water reserves, and Logistics Capacity.
- Technology & Policy Modifiers
  - Tech tree unlocks facility tiers, extraction enhancers (e.g., deep‑core drills), cleaner processing (reduced pollution), and logistics efficiency.
  - Policies impact morale/efficiency (e.g., safety standards reduce accidents, minor throughput penalty; subsidies raise upkeep but increase workforce retention).
- Events & Hazards
  - Accidents, strikes, storms, quakes, and anomalies can temporarily reduce yield/uptime or damage facilities; missions can mitigate/repair.
- UI & Feedback
  - HUD shows compact resource panel; planet sheet displays production/consumption, stockpiles, and bottlenecks with alerts.
  - Empire Ledger: per‑tick balance of inputs/outputs, logistics flows, and construction queues; filter by planet/system.
- Data & APIs (initial schema targets)
  - Tables: `planets(id, biome, hazard)`, `deposits(planet_id, resource, richness)`, `facilities(id, planet_id, type, tier, uptime, workforce)`, `stockpiles(planet_id, resource, amount)`, `queues(planet_id, item_type, spec, progress)`.
  - Endpoints: `/api/empire/planets`, `/api/empire/planets/:id/production`, `/api/empire/build`, `/api/empire/queue`, `/api/empire/stockpiles`.
- Scoring & Balance
  - Empire Vezies increase on expansion milestones (new colony, first shipyard online, logistics throughput goals). Anti‑snowball via upkeep, logistics caps, and anomaly events.

#### Production Ticks, Stockpiles, and Build Queues (MVP implemented)
- Tick Model (MVP)
  - Each planet advances production in discrete ticks (manual button in demo; scheduled in full game).
  - Per tick, each discovered deposit adds to stockpiles: gain = richness × yieldFactor (MVP: 10).
  - Hazards/events can apply uptime penalties (future: storms, strikes, raids) that reduce tick yield.
- Stockpiles
  - Per‑planet resource buckets accumulate from production; consumed by construction queues and upkeep.
  - UI: show current stockpiles, recent delta, and bottleneck highlights (insufficient inputs).
- Build/Training Queues (MVP)
  - Queues live per planet (buildings, vehicles, ships, units). Each entry has:
    - Item Type (e.g., build:demo), Cost (resource + amount), Work Required, Progress, Status.
  - Creation checks stockpiles; costs are reserved/consumed at submission time (MVP: immediate deduct).
  - Work is applied per tick (MVP: manual “Work Tick” applies a flat progress increment). On completion, status → done and entitlements (building/unit) become available.
  - Parallelism via multiple facilities increases per‑tick work capacity (future: facility throughput and workforce).
- Logistics & Consumption (Next)
  - Upkeep will consume supplies each tick (power, spare parts, food). Shortages impose penalties (reduced uptime/morale) and can stall queues.
  - Convoys move resources between planets with throughput limits and risk (piracy). Routing UI to balance flows.
- Data & APIs (MVP state)
  - Tables: `planets`, `deposits`, `stockpiles`, `queues` with minimal fields.
  - Endpoints (implemented):
    - `GET /api/empire/planets` • `POST /api/empire/planets` (generate/persist)
    - `GET /api/empire/planets/:id/production` (preview)
    - `GET /api/empire/planets/:id/stockpiles` • `POST /api/empire/planets/:id/tick`
    - `GET /api/empire/planets/:id/queues` • `POST /api/empire/planets/:id/queues` • `POST /api/empire/queues/:queueId/tick`
  - HUD Demo: “Empire — Planets & Production” with create planet, production tick, stockpiles, and queue controls.
### Equipment, Vehicles, and Units (Empire & Hero Modes)
- Equipment Categories (examples)
  - Mining/Extraction: Surface Drill (T1–T3), Deep‑core Drill (T2+), Helium‑3 Extractor, Geothermal Tap, Harvester Drones (ore, organics), Survey Scanner, Seismic Charge Kit, Atmospheric Skimmer, Portable Ore Processor.
  - Hazard/Survival: EVA Suit (tiers), Radiation Shielding Packs, Thermal Gel Injectors, Life‑Support Modules, Environmental Filters, Hazard Drones.
  - Construction: Mobile Fabricator Rig, Industrial 3D Printer, Crane Mech, Habitat Modules, Terraforming Units (atmo scrubbers, soil enrichers).
  - Logistics: Cargo Haulers (ground), Tanker Rigs, Shuttlecraft, Landing Craft, Convoy Escorts, Tug Drones, Container Pods.
  - Military Gear: Small Arms (ballistic/energy), Heavy Weapons (AT/AA), Powered Armor, Shield Emitters, Field Med Stations, Mobile Artillery, Point‑Defense Turrets.
  - Diplomatic Kits: Protocol Suites, Universal Translation Cores, Gift Packs (cultural), Cultural Archives, Envoy Shuttle (prestige paint/TTs).
  - Scientific Kits: Modular Lab, Sample Kits (bio/geo), Datacore Arrays, High‑Gain Sensor Masts, Research Drones.
  - Covert Kits: Cloak Nets, Signal Spoofers, ECM Pucks, Hacking Modules, Clean Room Identity Kits, Silent Transports.

- Unit Types (examples)
  - Civilian/Support: Workers, Engineers, Scientists, Medics, Logistics Crews, Construction Teams, Mining Crews (with rigs).
  - Military (Ground): Infantry (Light/Line/Elite), Marines, Recon, Mechanized (IFV), Armor (Tank), Mobile Artillery, Air Wing (VTOL), Defense Batteries (point‑defense/AA).
  - Naval/Space: Corvette, Frigate, Cruiser (see Shipyard line), Patrol Craft, Carrier (late tech), Orbital Defense Platforms.
  - Diplomatic: Envoy, Negotiation Team, Cultural Exchange Team, Mediation Taskforce (with protection detail).
  - Logistics: Freighter Convoy, Tanker, Tug, Shuttle Squadron, Supply Column.
  - Covert/Special: Operatives, Recon Teams (stealth), Saboteurs, Electronic Warfare Teams, Counter‑intel Cells.
  - Drone Variants: Worker Drones, Combat Drones, Sensor Drones; reduced manpower, higher component upkeep.

- Unit Attributes & Costs
  - Attributes: manpower, training time, morale/cohesion, speed/mobility, combat power, armor/shields, stealth/sensor, diplomacy rating (diplomatic units), science output (scientific teams).
  - Build Costs: Alloys, Components, Power Cores, Fuel reserves, Ammunition/Spare Parts; some require Shipyard/Factory/Academy time slots.
  - Upkeep: Food/Water, Wages, Supplies (ammo/parts), Fuel/Energy; shortages reduce readiness and morale.
  - Equipment Loadouts: slots for weapon, armor, utility (scanner/hacking), support (med, ECM). Tech unlocks tiers and modifiers.
  - Capacity & Command: transport capacity (shuttles/ships), command points (officer corps) gate max deployed units per theater.
  - Tech/Policy Prereqs: advanced units require research branches (e.g., shields, fusion armor) and policies (e.g., conscription, professional army).

- Construction & Training Pipelines
  - Buildings enable queues: Academy (troops), Factory (vehicles), Shipyard (space). Each queue consumes time and resources; parallelism via additional facilities and logistics caps.
  - Veteran Upgrades: units gain traits on milestones; reinforcement merges consume extra supplies.

- UI & API
  - HUD: roster summary (deployed/reserve), readiness %, supply status; hero loadout editor for Equipment slots.
  - APIs (initial targets): `/api/empire/units`, `/api/empire/units/train`, `/api/empire/equipment`, `/api/empire/loadouts`, `/api/empire/queues`.

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

### Vezy Score System (Vezy.ai)
- Score Categories:
  - Story Vezies: narrative choices, character development, completing character/party arcs, backstory integration
  - Empire Vezies: expansion, governance stability, logistics efficiency, fleet readiness, economic milestones
  - Discovery Vezies: exploration, surveying, uncovering lore/artifacts, first-contact outcomes
  - Social Vezies: multiplayer interactions, alliance missions, diplomacy success, referrals/events
- Setup: per-campaign target goals entered during game setup; can be adjusted by owners/mods between sessions (with audit)
- HUD: category progress bars (session and campaign totals) and a combined Vezy Score
- Events: unified `score_events` schema with category, value, owner (player/alliance), provenance, idempotency key
- Leaderboards: filterable by category and total; campaign/local and optional global

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
  - Outputs: a new campaign with `content/packs` skeleton, style profile, initial mission graph, optional story beats in Director Model, and setup steps to choose:
    - Resolution Mode (Outcome or Classic)
    - Game Modes: Hero Mode, Empire Mode (both can be enabled together)
    - Vezy Score Goals: targets for Story Vezies, Empire Vezies, Discovery Vezies, Social Vezies
    - Backstory: text field used by AI Assistant to seed hooks and civilization personalities
    - Revial Options (death/respawn model)
    - Win Criteria & Time Limit (optional)
    - Visual Generation level (off/characters/worlds/everything)
    - Lifetime Scope (one life ↔ civilization lifetime)

### Galaxy Map & Planet Setup (Initial, Evolves Over Time)
- During game setup, the galaxy map is generated and stored as the canonical starting state. It can evolve as the story progresses (expansion, terraforming, conquest, anomalies).
- Inputs (setup wizard):
  - Seed (deterministic), map size (sectors/regions), number of star systems, initial habitable planets per region
  - Generation profile: resource richness curve (scarce/standard/abundant), hazard profile, faction/empire homeworlds (optional)
  - Naming/style profile for systems/planets (ties into art/style presets)
- Outputs (persisted on campaign create):
  - `systems`: id, name, sector, coordinates
  - `planets`: id, system_id, name, biome, gravity, hazard, tags (homeworld/capital)
  - `deposits`: planet_id, resource, richness (0–5)
  - Optional `factions`: id, name, home_system_id, relations
- Evolution rules (runtime):
  - Narrative and empire actions can add/remove/alter: deposits, stockpiles, ownership, hazards; unlock terraforming/colonization; create outposts/shipyards
  - Deterministic re-generation allowed from seed for testing; deltas recorded as events/snapshots for save/resume
- API (planned):
  - `POST /api/campaigns/:id/map/init` to create initial systems/planets from seed & profile at campaign creation
  - Read endpoints for map browse; existing empire endpoints manage ongoing changes (mining, stockpiles, facilities, queues)

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


## Governance: Free-form Laws & Policies (Affecting Economy)
- Model
  - Laws/Policies are free-form text entries defined per campaign or per region/system (e.g., “Worker Safety Mandate”, “Open Trade Charter”, “Emergency Budget Freeze”).
  - Each entry contains: title, body (markdown allowed), scope (campaign|region|system), effective_at, optional expires_at, author, tags (economy, labor, environment, defense, research), and advisory impact notes.
  - AI-assisted interpretation: the engine parses policy text via prompt templates to extract suggested modifiers with confidence bands.
- Engine Integration (Deterministic Application)
  - Parsed modifiers are advisory; owners/mods approve them to become active rule modifiers.
  - Active modifiers map to capped scalars used by the simulation:
    - Production: uptime_mult (0.8–1.1), throughput_mult (0.8–1.1)
    - Logistics: capacity_mult (0.8–1.2), risk_delta (−0.1–0.1)
    - Prices: tariff_delta (−0.1–0.2), subsidy_delta (−0.15–0.15)
    - Science: velocity_mult (0.8–1.2)
    - Military: readiness_mult (0.9–1.1)
  - Conflicts resolved by precedence and clamping; all changes logged with rationale.
- UX & Workflow
  - Policy Console: compose free-form policy/law text, add tags/scope; see AI-suggested impacts and confidence; approve/adjust sliders; publish.
  - Audit & History: timeline of adopted/retired policies with impact diffs on KPIs.
- APIs (initial)
  - POST `/api/policies` { title, body, scope, tags } → returns suggested modifiers
  - POST `/api/policies/activate` { policyId, modifiers } → engine applies on next tick
  - GET `/api/policies/active` → current active modifiers with caps & provenance

## Advisors (AI Counselors)
- Concept
  - Players can consult specialized AI advisors for actionable guidance. Advisors synthesize current state (KPIs, stockpiles, queues, policies, events) into recommendations.
- Advisor Types
  - Economy Advisor: pricing, tariffs, subsidies, facility throughput, bottlenecks.
  - Military Advisor: readiness, supply, force composition, training/build plans.
  - Science Advisor: research velocity, lab uptime, queue prioritization.
  - Logistics Advisor: route capacity, stockpile balancing, convoy risk.
  - Governance Advisor: policy/law suggestions with projected KPI impact and risks.
  - Diplomacy/Trade Advisor: treaties, contracts, trade flows, tariff negotiations.
- UX
  - Advisor Panel per domain with “Ask” input; quick questions; recommended actions summarized with confidence and expected KPI deltas; one-click “Propose Action”.
  - Advisors include rationale and risk notes; all suggestions are reversible proposals until approved.
- APIs (initial)
  - POST `/api/advisors/:domain/query` { question } → { recommendations[], projectedImpact }
  - POST `/api/advisors/:domain/propose` { action } → creates pending engine action for approval
- Engine Tie-in
  - Approved advisor proposals convert to engine actions (policy changes, queue priorities, tariff adjustments, transfers) executed next tick.

## Production Systems & Scalability

### User Management & Authentication System
- **User Accounts**: Comprehensive registration, login, and profile management with secure password policies
- **Authentication**: JWT-based authentication with refresh tokens, OAuth integration (Google, Discord, Steam)
- **Player Profiles**: 
  - Customizable player handles with uniqueness validation
  - AI-generated character portraits with consistent identity preservation
  - Game history, statistics, and achievement tracking
  - Privacy settings and profile visibility controls
- **Friend Networks**: 
  - Friend requests and management system
  - Party formation for cooperative gameplay
  - Social features including messaging and activity feeds
  - Block and report functionality for community safety

### Payment & Subscription Architecture
- **Stripe Integration**: Secure payment processing with PCI DSS compliance
- **Dynamic Pricing Model**:
  - **Campaign-Based Pricing**: Charged per campaign based on duration (4, 12, 24 weeks) and scheduled play hours
  - **LLM Tier Pricing**: Different rates for premium AI models (GPT-4, Claude, Gemini) vs. free/low-cost options (Ollama)
  - **Player Count Scaling**: Pricing adjustments based on campaign size (2-50+ players)
  - **Subscription Options**: Monthly/annual subscriptions with discounts for regular players
- **Billing Management**: Automated invoicing, payment history, subscription changes, proration handling
- **Revenue Analytics**: Real-time revenue tracking, conversion metrics, churn analysis, customer lifetime value

### Campaign Management & Scheduling System
- **Campaign Creation Wizard**:
  - **Deterministic Setup**: Seeded generation ensuring reproducible campaign experiences
  - **AI-Generated Content**: Automated backstory creation, objective generation, NPC character development
  - **Configuration Options**: Game mode selection, player count limits, session scheduling, difficulty settings
  - **Map Generation**: Procedural galaxy generation with customizable size and complexity
- **Scheduling System**:
  - **Weekly Recurring Campaigns**: Regular scheduled sessions with consistent player groups
  - **24-Hour One-Shot Campaigns**: Quick, intensive gaming experiences
  - **Flexible Scheduling**: Time zone support, session length customization (2-8 hours)
- **Player Matching**: Automated matchmaking based on preferences, skill level, and availability
- **Campaign Lifecycle**: Registration, payment processing, player notifications, execution, completion tracking

### Scalable Infrastructure Architecture

#### MVP Infrastructure (50 Concurrent Players)
- **Deployment Model**: Docker containers on AWS EC2 instances
- **Central Services**: Single EC2 instance hosting user accounts, payments, campaign management
- **Game Servers**: Dedicated containers per campaign with auto-scaling based on demand
- **Database Strategy**: 
  - RDS PostgreSQL for user data, payments, and campaign metadata
  - SQLite per campaign for isolated game state management
- **Load Distribution**: Application Load Balancer with health checks and failover
- **Asset Storage**: S3 for generated images/videos, backups; CloudFront CDN for global distribution

#### Official Launch Infrastructure (500-10,000 Players)
- **Kubernetes Orchestration**: EKS cluster with auto-scaling and resource management
- **Microservices Architecture**:
  - **User Service**: Account management, authentication, profiles, social features
  - **Payment Service**: Stripe integration, billing, subscription management
  - **Campaign Service**: Creation, scheduling, matchmaking, lifecycle management
  - **Game Server Manager**: Container orchestration, scaling, health monitoring
  - **Analytics Service**: Player metrics, engagement tracking, business intelligence
  - **Admin Service**: Moderation tools, support systems, content review
- **Database Scaling**:
  - RDS Multi-AZ with read replicas for high availability
  - DynamoDB for session data and real-time features
  - ElastiCache Redis for caching and session management
- **Auto-Scaling**: Horizontal pod autoscaling based on CPU, memory, and player count metrics
- **Multi-Region Deployment**: Primary region with disaster recovery capabilities

### Security & Hardening Framework
- **Network Security**: VPC isolation, private subnets, security groups, network ACLs
- **Data Protection**: 
  - TLS 1.3 encryption for all data in transit
  - AES-256 encryption for data at rest
  - Secure key management via AWS Secrets Manager
- **Access Control**: 
  - Role-based access control (RBAC) with least privilege principles
  - Multi-factor authentication for administrative accounts
  - API rate limiting and DDoS protection via CloudFlare
- **Compliance**: GDPR compliance, data retention policies, right to deletion
- **Monitoring**: Real-time security monitoring, audit logging, incident response procedures

### Content Moderation & Admin Tools
- **Player Reporting System**: In-game reporting for inappropriate content and behavior
- **Admin Dashboard**:
  - **Account Management**: Suspend, ban, warning system with escalation procedures
  - **Campaign Monitoring**: Real-time campaign oversight and intervention capabilities
  - **Content Review**: Queue system for flagged messages, actions, and generated content
  - **Analytics Integration**: Player engagement metrics, retention analysis, behavior patterns
- **Automated Moderation**: AI-powered content filtering for text and generated images
- **Audit Trail**: Complete logging of admin actions, player reports, and moderation decisions

### Analytics & Business Intelligence
- **Player Analytics**:
  - Retention metrics (1-day, 7-day, 30-day retention rates)
  - Engagement tracking (session length, actions per session, feature usage)
  - Conversion funnel analysis (signup → payment → campaign completion)
  - Churn prediction and prevention strategies
- **Game Analytics**:
  - Campaign success rates and completion statistics
  - Feature adoption and usage patterns
  - Performance metrics (latency, errors, resource utilization)
  - Player feedback and satisfaction scores
- **Business Metrics**:
  - Revenue tracking and forecasting
  - Customer acquisition cost (CAC) and lifetime value (CLV)
  - Pricing optimization and A/B testing results
- **Integration**: Google Analytics 4, custom event tracking, real-time dashboards

### External Marketing & Support Infrastructure
- **WordPress Marketing Platform**:
  - **Landing Pages**: Feature showcases, pricing information, player testimonials
  - **Content Marketing**: Regular blog posts, patch notes, community highlights
  - **SEO Optimization**: Structured data, meta optimization, performance tuning
  - **Lead Generation**: Newsletter signup, beta access, referral programs
- **Customer Support System**:
  - **Zoho Desk Integration**: Comprehensive ticketing system with WordPress integration
  - **In-App Support**: Help documentation, FAQ, contact forms within player accounts
  - **Knowledge Base**: Searchable documentation, video tutorials, troubleshooting guides
  - **Community Support**: Player forums, Discord server, community moderation

### DevOps & Deployment Pipeline
- **Development Workflow**:
  - **Local Development**: Cursor IDE with Docker Compose for comprehensive local testing
  - **Version Control**: GitHub with feature branch workflow and mandatory pull request reviews
  - **Code Quality**: ESLint, Prettier, TypeScript strict mode, comprehensive test coverage
- **CI/CD Pipeline**:
  - **Automated Testing**: Unit tests, integration tests, E2E tests, performance tests, security scans
  - **Build Process**: Docker image creation, vulnerability scanning, artifact management
  - **Deployment Strategy**: Blue-green deployment with zero-downtime updates and automatic rollback
- **Infrastructure as Code**: Terraform for AWS provisioning, Helm charts for Kubernetes deployment
- **Environment Management**: Separate dev/staging/production environments with proper secret management

### Backup & Disaster Recovery
- **Automated Backup Strategy**:
  - RDS automated backups with point-in-time recovery (35-day retention)
  - S3 cross-region replication for critical assets and campaign data
  - Campaign state snapshots with lifecycle management and cost optimization
- **Disaster Recovery Plan**:
  - Multi-AZ deployment for 99.99% availability
  - Cross-region backup with 4-hour RPO and 1-hour RTO targets
  - Automated failover procedures and comprehensive runbooks
- **Data Retention Policies**:
  - User data: 7 years (regulatory compliance)
  - Campaign data: 2 years (analytics and support)
  - System logs: 90 days (security and debugging)

### Performance Optimization Strategy
- **Caching Architecture**:
  - Redis for session data and frequently accessed content
  - CloudFront CDN for static assets and cacheable API responses
  - Application-level caching for expensive AI computations
- **Database Optimization**:
  - Query optimization with comprehensive indexing strategy
  - Connection pooling and read replica utilization
  - Table partitioning for large datasets (events, analytics)
- **Resource Management**:
  - Container resource limits and requests optimization
  - Auto-scaling policies based on real-time metrics
  - Cost optimization through reserved instances and spot instances

### Cost Management & Revenue Model
- **Infrastructure Cost Optimization**:
  - MVP Phase: $1,000-2,000/month (supporting 50 players)
  - Official Launch: $10,000-25,000/month (supporting 500-10,000 players)
  - Ongoing optimization through monitoring and right-sizing
- **Revenue Projections**:
  - Campaign pricing: $10-50 per player per campaign
  - Target gross margin: 60-70% after infrastructure and AI costs
  - Subscription model with premium features and priority access

## Simulation Engine Notes (Integration)
- Policies/Laws Flow
  - Free-form text → AI parser → suggested modifiers (capped) → owner approval → engine applies as active modifiers until changed/expired.
- Advisors Flow
  - Advisor reads latest KPIs/snapshots and pending queues → proposes actions with expected deltas → on approval, enqueued into `step()`.
- Determinism & Audit
  - AI parsing generates proposals only; deterministic modifiers are applied only after human approval.
  - Every modifier includes provenance: policyId, author, approvedAt, scope, clamps used.
- Verification
  - Unit tests for modifier application; end-to-end tests for advisor propose→approve→tick → KPI delta within expected bands.


