# Sprint 2 Tasks Plan

## Task 1: SQLite Database with Event Sourcing
- Set up SQLite database for campaign persistence
- Implement event sourcing pattern for simulation state changes
- Create snapshot system for efficient state reconstruction
- Database schema for events, snapshots, campaigns

## Task 2: Vector Memory System
- Implement vector embeddings for campaign/player memory
- Create memory storage and retrieval system
- Add semantic search capabilities
- Memory context for AI interactions

## Task 3: Image Pipeline System
- Create image prompt builder for game assets
- Implement caching system for generated images
- Add placeholder → final image swap functionality
- Image request lifecycle management

## Demo Requirements:
- save → resume → branch campaigns
- placeholder→final image swap
- Memory-aware interactions

## APIs:
- snapshot/resume endpoints
- image request lifecycle endpoints
- memory query endpoints
