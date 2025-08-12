# Memory Design (Vector-First, Scoped)

## Principles
- Separate memory scopes; never mix player private memory with other players.
- Campaign memory accessible to GM/engine; player memory private by default.
- Event-sourced writes; summarization to control growth.

## Scopes
- `campaign:<campaign_id>` — world facts, NPC relations, locations, shared logbook
- `player:<player_id>` — backstory, preferences, personal notes, discovered secrets

## Types
- Episodic: timestamped events and dialogues
- Semantic: extracted facts/entities with embeddings for recall
- Declarative: canonical lore/rules
- Procedural: systems/how-to (rules mechanics)

## Storage
- SQLite tables: `memories(id, campaign_id, owner_namespace, type, content, embedding, tags_json, created_at)`
- Vector index: FAISS or SQLite-VSS; hybrid search (vector + keyword)
- Assets: links to audio/image artifacts for rich recall

## Embeddings
- Provider-agnostic; default `text-embedding-3-large` or local options
- Metadata includes: `owner_namespace`, `session_id`, `mission_id`, `recency_score`, `confidence`

## Retrieval
- Action Interpreter requests kNN results with filters (scope/type/tags)
- Recency/time-decay boosting; deduplicate near-duplicates
- Player queries only hit `player:<id>` and `campaign:<id>` when explicitly allowed

## Summarization
- Periodic jobs compress long histories into dense summaries with citations
- Replace clusters with summary entries + pointers to raw events

## Privacy & Sharing
- Sharing workflow: player may promote specific entries from `player:<id>` to `campaign:<id>`
- Audit log for promotions; reversible where safe

## Example Metadata
```json
{
  "owner_namespace": "player:42",
  "type": "semantic",
  "tags": ["npc:choir_envoy", "artifact:quantum_relay"],
  "mission_id": "echoes_of_dyson_gate",
  "recency_score": 0.83,
  "confidence": 0.92
}
```

## Guardrails
- All tool calls that mutate memory must include `owner_namespace` and pass server-side validation
- Unit tests enforce isolation and correct filtering
