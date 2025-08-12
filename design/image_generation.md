# Image Generation Design

## Goals
- Fast, consistent, and safe image generation for scenes, portraits, and items
- Local caching and reuse; style coherence across a campaign

## Providers
- Images: OpenAI Images, Stable Diffusion (SDXL via AUTOMATIC1111 or ComfyUI), optional local diffusion backends
- Video (overview; see `video_generation.md` for details): provider-agnostic (e.g., Pika, Runway, AnimateDiff-based local)

## Prompt Templates
- Scene: `[style tokens], [location/biome], [factions/NPCs], [lighting], [mood], [era], cinematic, high detail, safe content`
- Portrait: `[style tokens], [species], [role], [costume], [expression], bust portrait, soft rim light`
- Item: `[style tokens], isolated object on dark gradient, [material], [tech level], studio lighting`

## Pipeline
1) Request from Narrative Engine with `type`, `scene_state`, `style_profile`
2) Build prompt; validate against banned terms; add negative prompts
3) Generate (async); stream progress; cache with SHA-256(prompt+seed)
4) Store to `data/assets/` and `images` table with metadata and rights
5) Publish `image-available` event; UI swaps placeholder → final

## Style Consistency
- Campaign `style_profile` (e.g., “inked space opera,” “retro-futurist neon”)
- Optional LoRA/Checkpoint; seed pinning per NPC/major location

## Safety
- Content filter; configurable maturity rating; human override role

## Cinematics and Video (summary)
- Short scene loops and cutscene clips can be generated from prompts, storyboards, or reference frames
- Videos reuse the same `style_profile` and seed strategies to maintain coherence with images
- See `framework_docs/video_generation.md` for full pipeline and APIs


