# Galactic Tale Weaver RPG — Business Summary

## Product Summary
Galactic Tale Weaver is a voice-first, AI-driven space RPG with generated visuals. Players collaborate or compete in dynamic missions, form alliances, and progress through a persistent universe. Multi‑LLM support, local-first storage, and modular content packs enable extensibility and privacy.

## Key Features
- Voice-first multiplayer with AI GM and NPCs
- Graphical scenes with generated images (scenes, portraits, items)
- Cooperative and competitive modes; alliances and seasonal leaderboards
- Vector memory with per-player privacy and campaign context
- Mission Template DSL and content packs for fast story creation
- Save/resume and branching timelines
- Provider-agnostic (OpenAI, Anthropic, Gemini, Grok, SDXL)

## Benefits
- Immersive, low-friction play (no typing required)
- Infinite replayability via procedural missions and content packs
- Strong sense of progression (levels, gear, factions, alliances)
- Privacy-first local storage; no central servers required
- Flexible research/evaluation environment for LLMs and images

## Target Users
- TTRPG groups seeking faster sessions with AI GM support
- Narrative gamers who want co-op and light competitive play
- Creators/streamers needing dynamic content and visuals

## Monetization (optional)
- Premium content packs (worlds, factions, artifacts)
- Cosmetic style packs for image generation; portrait/scene frames, emblems; TTS voice skins
- Alliance Season Pass: cosmetics, titles, recap frames, additional anomaly playlists; seasonal prestige (no pay-to-win)
- Pro tooling for creators (scenario editor, batch pre-gen, style consistency assistant, analytics)
- Optional cloud sync for marketplace and cross-device (default local-first)

## Marketing Strategy
- Community-first: Discord, Actual Play streams, content jam events; referral quests
- Partnerships: TTRPG creators, sci‑fi artists (LoRA style packs)
- UGC: modding contests for mission/world packs; in-client features rail
- Thought leadership: blogs/devlogs on AI GM design, vector memory, multi‑LLM A/B
- KPIs: session retention, recap share rate, referral conversion, creator pack attach rate, season participation

## Competitive Landscape
- AI‑assisted TTRPG tools, narrative RPGs, VTTs; differentiation via voice‑first play, image‑rich scenes, alliance competitive modes, and local-first privacy

## Roadmap (high-level)
- MVP: co-op campaign, basic competitive mode, generated scene/portrait images, local saves, vector memory
- Beta: alliances, seasonal leaderboards, mission editor, content pack marketplace
- GA: robust CRDT multiplayer, performance/load hardening, expanded device support

## Operating Costs (Estimates)
- Local-first profile (Ollama/Whisper/SDXL): near-zero marginal cloud cost; infra VM ~$40–$150/mo.
- Standard hybrid (cloud LLM mini, local media): ~$0.10–$0.40 per player-hour; 50 players × 2h ≈ $10–$40/event.
- Premium (Claude/GPT-4‑class, cloud images/video): ~$0.30–$1.50 per player-hour; 50×2h ≈ $50–$150/event.

## Revenue Sources & Model (Estimates)
- Cosmetics & Style Packs
  - Items: portrait/scene styles, frames, emblems, TTS voice skins
  - Price points: $5–$20; attach rate 2–5% monthly active
- Alliance Season Pass (90 days)
  - Cosmetic/QoL track; seasonal anomalies playlists access
  - Price: $10–$20/season; conversion 3–8% of actives; completion 30–60%
- Content Packs (worlds/missions/items)
  - Price: $5–$15 per pack; attach rate 5–15% of creators/party hosts
- Creator Pro Tools (subscription)
  - Batch pre-gen, style consistency, analytics
  - Price: $5–$20/mo; conversion 5–15% of active creators
- Optional Cloud Sync (subscription add-on)
  - Cross-device save, marketplace connectivity
  - Price: $2–$5/mo; conversion 5–15% of groups

## Unit Economics Targets
- Blended ARPDAU: $0.05–$0.20
- Season ARPPU: $15–$30
- Creator ARPPU: $5–$20/mo
- Gross margin (standard hybrid): >70% post infra and provider fees

## KPI Dashboard
- D1/D7 retention; session length; recap share rate; referral conversion
- Creator pack attach; Season Pass conversion/completion; cosmetics attach
- Cost per player-hour; provider mix; cache hit rates; anomaly participation

