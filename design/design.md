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

## Missions and Worlds
- Mission Template DSL (objective graph) with twists, fail states, rewards
- Worlds: sector definitions (planets, stations, hazards, factions, biomes) with style guides for image generation
- Seeding: base cooperative storyline and competitive scenarios (see `content/packs`)

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

## GM Principles and UX Patterns (DnD-inspired)
- Agency-first: “yes, and…”, fail-forward, meaningful consequences; no railroading
- Pacing: short, vivid beats (2–4 sentences), clear stakes, frequent summaries
- Choice architecture: always surface 2–3 concrete options and allow freeform actions
- Ask questions to co-create specifics (names, motives, details)
- Rules transparency & drama: visible dice/results (d20 + mods), consistent DCs, advantage/disadvantage, hero points/inspiration
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

## Content & Modding
- Content packs in `content/packs` for worlds, missions, factions, items; import/export as signed JSON bundles

## Safety & Privacy
- Local-first; provider keys stored encrypted locally
- Redaction filters for PII in transcripts; configurable content safety

## Success Metrics
- Session retention, average scene latency, image generation cache hit rate, collaborative completion rate, competitive fairness (Elo spread)


