# Provider Abstraction

## Interfaces
- `LLMProvider.complete(messages, tools?, options)`
- `EmbeddingProvider.embed(texts)`
- `STTProvider.transcribe(stream|buffer, options)`
- `TTSProvider.synthesize(text, voice, style)`
- `ImageProvider.generate(prompt, params)`
 - `VideoProvider.generate(request, params)`
 - Tool contracts (validated JSON): `world.query/update`, `mission.advance`, `rules.skill_check`, `rng.roll`, `memory.retrieve/write`, `image.request`, `npc.speak`

## Supported Providers
- LLM: OpenAI, Anthropic (Claude), Google (Gemini), xAI (Grok), Ollama (local)
- Embeddings: OpenAI, Ollama (local), other local alternatives
- STT: Whisper API, Whisper.cpp/Vosk
- TTS: OpenAI, ElevenLabs, Coqui, Edge-TTS
- Images: OpenAI Images, SDXL via AUTOMATIC1111/ComfyUI
 - Video: Pika, Runway, local AnimateDiff/Deforum

## Selection & Config
- Runtime-selectable via settings; A/B or shadow mode supported
- Env vars (example):
  - `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `XAI_API_KEY`
  - `OLLAMA_BASE_URL` (e.g., `http://localhost:11434`), optional `OLLAMA_API_KEY` if required by gateway
  - `IMAGE_HOST_URL` (A1111/ComfyUI), `VIDEO_HOST_URL` (local video pipeline), `EMBEDDINGS_PROVIDER`

## Validation & Safety
- Strict tool schema validation; retries/backoff for transient failures
- Token/latency logging; redaction pipeline applied to inputs/outputs when enabled
 - Ollama notes: enforce model whitelist (e.g., `llama3`, `mistral`, `phi3`), set sensible context/temperature defaults, and handle streaming chunk protocol
