# AI-Generated Video Design

## Goals
- Generate short cinematic clips (3–20s) for scene transitions, mission intros/outros, and highlights
- Maintain campaign art style coherence and character continuity
- Stream generation progress; cache assets locally; safe content by default

## Use Cases
- Cutscenes: mission briefing, arrival at location, victory/defeat stingers
- Ambient loops: subtle background motion for scene panels
- Highlights: auto-generated recap snippets from recent events

## Providers
- Cloud: Pika, Runway, OpenAI (if available)
- Local: AnimateDiff/Deforum pipelines with SDXL checkpoints; ControlNet for consistency; frame-interpolation for smoothness

## Inputs
- Prompt-only (style + scene description + motion cues)
- Image-to-video (use generated scene image as keyframe)
- Storyboard (sequence of frames + timings)
- Reference characters (NPC/player portraits) to preserve identity

## Pipeline
1) Request from Narrative Engine: `{ type: 'cutscene'|'ambient'|'highlight', scene_state, style_profile, durationSec, source: 'prompt'|'i2v'|'storyboard' }`
2) Prompt/storyboard builder: style tokens, motion verbs, shot language, safety filter, negative prompts
3) Provider adapter dispatch; async job with progress events (queue position, eta, partial previews)
4) Cache to `data/assets/video/` using SHA-256 of (prompt+seed+duration); store DB record in `videos`
5) Publish `video-available` event; UI swaps placeholder → video element with controls

## Data Model Additions (SQLite)
- `videos(id, campaign_id, hash, prompt, style, duration_sec, path, provider, seed, created_at, rights_json)`

## API
- POST `/videos/request` → { jobId }
- GET `/videos/job/:jobId` → status/progress
- GET `/videos/:id` → metadata

## UI
- Scene panel supports video with graceful fallback to images
- Toggle autoplay/loop/mute; captions/alt text generated from prompt/context

## Style Consistency & Identity
- Use the same `style_profile` as images
- For consistent characters, feed portrait image/embeddings as reference; pin seeds

## Safety
- Content filters and maturity ratings; human override for blocked content

## Verification Tests
- TC0V1: Request cutscene video and see progress then final asset
- TC0V2: Image-to-video preserves character identity within tolerance (hash/feature similarity)
- TC0V3: Cache reuse on identical prompt+seed+duration; SLA for cached video playback
- TC0V4: Safety block when disallowed terms are detected; override path logged

## Performance Targets
- Preview within 5s for cloud providers; local pipelines optimized via low-res preview then upscale
