#!/usr/bin/env python3
import json

# Load current tasks
with open('.taskmaster/tasks/tasks.json', 'r') as f:
    data = json.load(f)

# Define the 8 subtasks for Vector Memory System
subtasks = [
    {
        "id": 1,
        "title": "Setup Qdrant Vector Database Service",
        "description": "Start and configure the existing Qdrant service from docker-compose.yml with proper health checks and connectivity verification.",
        "dependencies": [],
        "details": "**Objective:** Establish reliable Qdrant vector database infrastructure\n\n**Implementation Steps:**\n- Start Qdrant service: `docker-compose up -d qdrant`\n- Verify service health and API accessibility on port 6333\n- Test basic connection and create initial collections for conversation storage\n- Configure Qdrant client library in Node.js with proper error handling\n- Set up vector collection schema with 768-dimensional embeddings\n- Implement connection pooling and retry logic for production readiness\n\n**Technical Requirements:**\n- Collection name: `conversations`\n- Vector size: 768 dimensions (compatible with most embedding models)\n- Distance metric: Cosine similarity for semantic search\n- Metadata fields: campaignId, timestamp, role, entities, gameState\n\n**Integration Points:**\n- Docker health checks for service monitoring\n- Environment variables for Qdrant connection settings\n- Logging integration for monitoring and debugging",
        "status": "pending",
        "testStrategy": "Verify Qdrant API responds to health checks, test collection creation and basic vector operations, validate connection pooling under load."
    },
    {
        "id": 2,
        "title": "Implement Embedding Service with Multiple Providers", 
        "description": "Create embedding service supporting local Ollama and cloud providers for text-to-vector conversion with fallback mechanisms.",
        "dependencies": [1],
        "details": "**Objective:** Build robust text embedding service with provider abstraction\n\n**Core Features:**\n- Primary provider: Ollama local embedding models\n- Fallback provider: OpenAI text-embedding-3-small\n- Batch processing for efficient embedding generation\n- Caching layer for repeated text to avoid recomputation\n- Rate limiting and retry logic for external APIs\n\n**Implementation Architecture:**\n```typescript\ninterface EmbeddingService {\n  generateEmbedding(text: string): Promise<number[]>;\n  generateBatch(texts: string[]): Promise<number[][]>;\n  getProvider(): string;\n}\n```\n\n**Provider Integration:**\n- Ollama: Use existing OLLAMA_BASE_URL from docker-compose\n- OpenAI: Configurable via OPENAI_API_KEY environment variable\n- Automatic provider switching on failure\n- Embedding dimension normalization (768 dims standard)\n\n**Performance Optimizations:**\n- LRU cache for recent embeddings (in-memory)\n- Batch processing with configurable batch sizes\n- Async processing queue for high-volume operations",
        "status": "pending",
        "testStrategy": "Unit tests for each provider, integration tests with actual embedding models, performance benchmarks for batch processing, fallback mechanism validation."
    },
    {
        "id": 3,
        "title": "Create Conversation Storage Schema and API",
        "description": "Design and implement conversation storage layer with rich metadata support and efficient querying capabilities.",
        "dependencies": [1, 2],
        "details": "**Objective:** Build comprehensive conversation storage with semantic search capabilities\n\n**Database Schema Design:**\n- Vector storage: Qdrant for embeddings and semantic search\n- Metadata storage: PostgreSQL for structured data and indexing\n- Conversation linking: Foreign keys to campaigns and game states\n\n**PostgreSQL Schema:**\n```sql\nCREATE TABLE conversations (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  campaign_id INTEGER REFERENCES campaigns(id),\n  player_id VARCHAR,\n  role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),\n  content TEXT NOT NULL,\n  timestamp TIMESTAMPTZ DEFAULT NOW(),\n  game_state JSONB,\n  entities TEXT[],\n  action_type VARCHAR(50),\n  vector_id UUID NOT NULL -- Reference to Qdrant vector\n);\n```\n\n**API Endpoints:**\n- `POST /api/memory/store` - Store new conversation with embedding\n- `GET /api/memory/search` - Semantic search with filters\n- `GET /api/memory/conversation/:id` - Retrieve full conversation\n- `DELETE /api/memory/:id` - Remove conversation and vector\n\n**Advanced Features:**\n- Automatic entity extraction from game context\n- Conversation threading and context maintenance\n- Configurable retention policies with automated cleanup",
        "status": "pending",
        "testStrategy": "Database migration tests, API endpoint integration tests, vector-metadata consistency validation, performance tests with large datasets."
    },
    {
        "id": 4,
        "title": "Build Conversation Capture Middleware",
        "description": "Implement middleware to automatically capture and process all player-AI interactions with context extraction.",
        "dependencies": [3],
        "details": "**Objective:** Seamless conversation capture across all AI interactions\n\n**Middleware Integration:**\n- Express.js middleware for API route interception\n- WebSocket message capture for real-time interactions\n- Integration with existing LLM factory for response capture\n- Context extraction from current game state\n\n**Implementation Strategy:**\n```typescript\n// Middleware integration points\napp.use('/api/trade/*', conversationMiddleware);\napp.use('/api/campaigns/*', conversationMiddleware);\napp.use('/api/advisors/*', conversationMiddleware);\n```\n\n**Automatic Context Extraction:**\n- Campaign ID from request parameters or session\n- Current game state from campaign resume data\n- Resource and entity mentions from trade/campaign context\n- Player action classification (trade, strategy, inquiry)\n\n**Processing Pipeline:**\n1. Request/response capture with metadata\n2. Content filtering (exclude sensitive/system data)\n3. Entity extraction using NLP techniques\n4. Embedding generation via embedding service\n5. Asynchronous storage in vector database\n\n**Performance Considerations:**\n- Non-blocking async processing to avoid latency\n- Queue-based processing for high-volume periods\n- Error handling to prevent middleware from breaking API responses",
        "status": "pending",
        "testStrategy": "Middleware integration tests across all API routes, context extraction accuracy validation, performance impact assessment, error handling verification."
    },
    {
        "id": 5,
        "title": "Implement Semantic Search API with Advanced Filtering",
        "description": "Build powerful semantic search capabilities with multi-dimensional filtering and ranked results.",
        "dependencies": [3, 4],
        "details": "**Objective:** Advanced semantic search with contextual filtering\n\n**Search Capabilities:**\n- Text similarity search using vector embeddings\n- Multi-filter support: campaign, timeframe, entities, roles\n- Hybrid search combining vector similarity + metadata filters\n- Relevance scoring and result ranking\n\n**API Design:**\n```typescript\nGET /api/memory/search?q=trade routes&campaign=1&limit=10&minSimilarity=0.7\nPOST /api/memory/search {\n  query: string,\n  filters: {\n    campaignIds?: number[],\n    timeframe?: { start: Date, end: Date },\n    entities?: string[],\n    roles?: string[],\n    actionTypes?: string[]\n  },\n  options: {\n    limit: number,\n    minSimilarity: number,\n    includeContext: boolean\n  }\n}\n```\n\n**Advanced Features:**\n- Query expansion using synonyms and game terminology\n- Result clustering for similar conversations\n- Personalization based on player interaction patterns\n- Real-time search suggestions and autocomplete\n\n**Performance Optimizations:**\n- Query result caching with TTL\n- Index optimization for common filter combinations\n- Pagination for large result sets\n- Search analytics for query optimization",
        "status": "pending",
        "testStrategy": "Search accuracy benchmarking, performance tests with large conversation datasets, filter combination validation, relevance scoring verification."
    },
    {
        "id": 6,
        "title": "Integrate Memory Context into AI Responses", 
        "description": "Enhance existing LLM providers with conversation memory injection for contextually aware AI responses.",
        "dependencies": [5],
        "details": "**Objective:** Memory-enhanced AI responses with contextual awareness\n\n**LLM Integration Strategy:**\n- Modify existing LLM factory to inject memory context\n- Pre-prompt enhancement with relevant conversation history\n- Context window management for optimal memory utilization\n- Graceful degradation when memory is unavailable\n\n**Memory Injection Process:**\n1. Extract context from current request (entities, campaign, action)\n2. Search for relevant past conversations using semantic search\n3. Format memory context for LLM prompt injection\n4. Monitor token usage to stay within context limits\n5. Log memory utilization for analytics and optimization\n\n**Enhanced Provider Implementation:**\n```typescript\n// Enhanced LLM call with memory context\nconst memoryContext = await searchRelevantMemory({\n  campaignId: request.campaignId,\n  entities: extractEntities(request.query),\n  limit: 5,\n  minSimilarity: 0.6\n});\n\nconst enhancedPrompt = formatPromptWithMemory(\n  originalPrompt,\n  memoryContext,\n  conversationHistory\n);\n```\n\n**Context Management:**\n- Smart memory selection based on relevance and recency\n- Token budget allocation between memory and new context\n- Memory confidence scoring for quality control\n- Fallback to non-memory responses when needed",
        "status": "pending",
        "testStrategy": "A/B testing for response quality with/without memory, token usage optimization validation, memory relevance scoring accuracy, fallback mechanism testing."
    },
    {
        "id": 7,
        "title": "Create Memory Management Admin Interface",
        "description": "Build comprehensive admin dashboard for memory system monitoring, management, and analytics.", 
        "dependencies": [6],
        "details": "**Objective:** Complete memory system administration and monitoring\n\n**Dashboard Features:**\n- Real-time memory system status and health monitoring\n- Conversation search and browsing interface\n- Memory analytics: usage patterns, search performance, storage growth\n- Memory curation tools: tagging, categorization, quality scoring\n- Retention policy management and cleanup scheduling\n\n**Administrative Functions:**\n- Bulk memory operations (export, import, cleanup)\n- Memory quality assessment and scoring\n- Player privacy controls and data deletion\n- System performance monitoring and optimization\n- Memory search analytics and improvement insights\n\n**Interface Components:**\n- React-based admin dashboard integrated with existing UI\n- Real-time charts for memory usage and performance metrics\n- Search interface with advanced filtering and result preview\n- Memory timeline visualization for conversation threads\n- Export/import tools for memory backup and migration\n\n**Security & Privacy:**\n- Role-based access control for memory management\n- Audit logging for all administrative actions\n- Player consent management for conversation storage\n- Data anonymization tools for privacy compliance",
        "status": "pending",
        "testStrategy": "UI component testing, admin functionality validation, security access control verification, performance monitoring accuracy, data privacy compliance checks."
    },
    {
        "id": 8,
        "title": "Performance Testing and Production Optimization",
        "description": "Comprehensive performance testing, optimization, and production readiness validation for the vector memory system.",
        "dependencies": [7],
        "details": "**Objective:** Production-ready performance and scalability validation\n\n**Performance Benchmarking:**\n- Load testing with 50+ concurrent users and memory operations\n- Vector search performance under various query patterns\n- Memory storage and retrieval latency measurement\n- System resource utilization analysis (CPU, memory, disk, network)\n\n**Optimization Targets:**\n- Embedding generation: < 500ms per message\n- Semantic search queries: < 200ms response time\n- Memory injection latency: < 100ms added to AI responses\n- Vector database throughput: 1000+ operations/second\n\n**Scalability Testing:**\n- Memory growth simulation with 100K+ conversations\n- Concurrent user load testing for all memory endpoints\n- Database connection pooling under high load\n- Memory cache effectiveness and hit ratios\n\n**Production Readiness:**\n- Error handling and recovery mechanisms\n- Monitoring and alerting setup for memory system health\n- Backup and disaster recovery procedures\n- Performance tuning based on production workload patterns\n\n**Optimization Deliverables:**\n- Performance benchmarking report with baseline metrics\n- Optimization recommendations and implementation\n- Production deployment checklist and procedures\n- Monitoring dashboard configuration and alerting rules",
        "status": "pending",
        "testStrategy": "Load testing with realistic user patterns, performance regression testing, monitoring system validation, disaster recovery testing, production deployment validation."
    }
]

# Find and update Task 40
for task in data['master']['tasks']:
    if task['id'] == 40:
        task['subtasks'] = subtasks
        print(f"✅ Successfully added {len(subtasks)} subtasks to Task 40: {task['title']}")
        break

# Save the updated tasks
with open('.taskmaster/tasks/tasks.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n📋 Vector Memory Subtasks:")
for i, subtask in enumerate(subtasks, 1):
    deps = f" (depends on: {subtask['dependencies']})" if subtask['dependencies'] else ""
    print(f"   {i}. {subtask['title']}{deps}")
