# PRD Outline — Galactic Tale Weaver RPG

## 1. Overview
- Product vision and goals
- Personas and use cases

## 2. Requirements
- R-001 Voice-first multiplayer (co-op + competitive)
- R-002 Graphical scenes with generated images (scenes, portraits, items)
- R-003 Alliances and team mechanics with leaderboards
- R-004 Mission Template DSL and content packs
- R-005 Vector memory (campaign + per-player, isolated)
- R-006 Save/resume and branch timelines
- R-007 Provider-agnostic LLM/STT/TTS/Image abstraction
- R-008 Local-first storage and privacy
- R-009 Periodic situation updates
- R-010 Modding (import/export content packs)
 - R-011 Multi-campaign support (parallel games, isolated data)
 - R-012 Scheduling (calendar, recurrence, reminders, pre-session warmups)
 - R-013 AI-generated video for cutscenes and ambient loops

## 3. Non-Functional Requirements
- Latency targets, performance, security, privacy, accessibility

## 4. UX & Accessibility
- Voice controls, captions, UI layout, image display, minimap/timeline

## 5. Data & Persistence
- SQLite schema, vector index, assets cache

## 6. Testing & Validation
- Traceability matrix in `tests/verification/` with TC IDs mapping to requirements
- UI (Playwright), API, unit, integration, performance, security, load, AI model A/B
 - Video tests for generation lifecycle and cache reuse

## 7. Release Plan
- Milestones (MVP → Beta → GA), migration, content packs


