# 🤖 Ollama Usage Guide for StarTales

## Overview
Ollama serves as our unified AI backend, providing both **Large Language Models (LLMs)** for text generation and **Embedding Models** for semantic search and vector operations.

## 🧠 Available Models

### LLM Models (Text Generation)
| Model | Size | Use Case | Memory | Speed |
|-------|------|----------|---------|-------|
| `llama3.2:3b` | 2GB | Quick responses, chat | Low | Fast |
| `llama3.2:8b` | 4.7GB | General purpose, quality | Medium | Medium |
| `codellama:7b` | 3.8GB | Code generation, analysis | Medium | Medium |
| `mistral:7b` | 4.1GB | Alternative general model | Medium | Medium |
| `phi3:mini` | 2.3GB | Reasoning, math | Low | Fast |
| `gemma2:2b` | 1.6GB | Efficient general model | Low | Fast |

### Embedding Models (Vector Search)
| Model | Size | Use Case | Dimensions | Quality |
|-------|------|----------|------------|---------|
| `nomic-embed-text` | 274MB | High-quality embeddings | 768 | High |
| `all-minilm` | 23MB | Lightweight embeddings | 384 | Medium |

## 🚀 API Usage Examples

### Text Generation (LLMs)

```javascript
// Generate AI character dialogue
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3.2:3b',
    prompt: 'As a galactic ambassador, respond to this diplomatic message...',
    stream: false
  })
});

const result = await response.json();
console.log(result.response);
```

```javascript
// Code generation for game mechanics
const codeResponse = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'codellama:7b',
    prompt: 'Generate a JavaScript function to calculate planetary resource yields based on population and technology level',
    stream: false
  })
});
```

### Embeddings (Vector Search)

```javascript
// Generate embeddings for semantic search
const embeddingResponse = await fetch('http://localhost:11434/api/embeddings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'nomic-embed-text',
    prompt: 'Advanced plasma weapon technology for space combat'
  })
});

const embedding = await embeddingResponse.json();
console.log(embedding.embedding); // Array of 768 numbers
```

```javascript
// Batch embeddings for multiple items
const batchEmbeddings = await fetch('http://localhost:11434/api/embeddings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'all-minilm',
    prompt: [
      'Diplomatic relations with alien species',
      'Trade routes between star systems',
      'Military fleet composition and strategy'
    ]
  })
});
```

## 🎮 StarTales Integration Examples

### 1. AI Character Generation
```javascript
// Generate unique character backstories
async function generateCharacterBackstory(species, role, planet) {
  const prompt = `Create a detailed backstory for a ${species} ${role} from ${planet}. Include their motivations, skills, and personality traits.`;
  
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:8b',
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.8,
        max_tokens: 500
      }
    })
  });
  
  return await response.json();
}
```

### 2. Semantic Search for Game Content
```javascript
// Find similar technologies or events
async function findSimilarContent(query, contentDatabase) {
  // Generate embedding for the query
  const queryEmbedding = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nomic-embed-text',
      prompt: query
    })
  });
  
  const queryVector = (await queryEmbedding.json()).embedding;
  
  // Use with Qdrant for similarity search
  const similarItems = await searchSimilarInQdrant(queryVector);
  return similarItems;
}
```

### 3. Dynamic Event Generation
```javascript
// Generate random events based on game state
async function generateGameEvent(gameState) {
  const prompt = `
    Current game state:
    - Player civilization: ${gameState.playerCiv}
    - Current year: ${gameState.year}
    - Technology level: ${gameState.techLevel}
    - Recent events: ${gameState.recentEvents.join(', ')}
    
    Generate a plausible and engaging random event that could occur in this galactic civilization game.
  `;
  
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:3b',
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.9,
        max_tokens: 300
      }
    })
  });
  
  return await response.json();
}
```

## 🔧 Configuration & Optimization

### Model Selection Strategy
```javascript
// Smart model selection based on use case
function selectModel(useCase, priority = 'balanced') {
  const models = {
    'chat': priority === 'speed' ? 'llama3.2:3b' : 'llama3.2:8b',
    'code': 'codellama:7b',
    'reasoning': 'phi3:mini',
    'embeddings': priority === 'speed' ? 'all-minilm' : 'nomic-embed-text'
  };
  
  return models[useCase] || 'llama3.2:3b';
}
```

### Performance Optimization
```javascript
// Streaming for real-time responses
async function streamResponse(model, prompt, onChunk) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: true
    })
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          onChunk(data.response);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}
```

## 🐳 Docker Configuration

### Environment Variables
```yaml
# In docker-compose.yml
ollama:
  environment:
    - OLLAMA_NUM_PARALLEL=4      # Concurrent requests
    - OLLAMA_MAX_LOADED_MODELS=3 # Models in memory
    - OLLAMA_HOST=0.0.0.0
    - OLLAMA_ORIGINS=*
```

### Resource Allocation
```yaml
# Production settings
deploy:
  resources:
    limits:
      cpus: '4.0'
      memory: 16G    # Enough for multiple models
    reservations:
      cpus: '2.0'
      memory: 8G
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Check specific model
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3.2:3b", "prompt": "Hello", "stream": false}'
```

### Model Management
```bash
# List loaded models
curl http://localhost:11434/api/tags

# Pull a new model
curl -X POST http://localhost:11434/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "llama3.2:1b"}'

# Delete a model
curl -X DELETE http://localhost:11434/api/delete \
  -H "Content-Type: application/json" \
  -d '{"name": "unused-model"}'
```

## 🎯 Best Practices

### 1. Model Selection
- **Fast responses**: Use `llama3.2:3b` or `phi3:mini`
- **High quality**: Use `llama3.2:8b` or `mistral:7b`
- **Code tasks**: Use `codellama:7b`
- **Embeddings**: Use `nomic-embed-text` for quality, `all-minilm` for speed

### 2. Memory Management
- Load only needed models
- Use smaller models for real-time interactions
- Cache embeddings for frequently accessed content

### 3. Performance Tips
- Use streaming for long responses
- Batch embedding requests when possible
- Set appropriate temperature (0.1-0.3 for factual, 0.7-0.9 for creative)
- Limit max_tokens to prevent runaway generation

### 4. Integration with Qdrant
```javascript
// Store embeddings in Qdrant for fast similarity search
async function storeInQdrant(text, metadata) {
  // Generate embedding
  const embedding = await generateEmbedding(text);
  
  // Store in Qdrant
  await fetch('http://localhost:6333/collections/game_content/points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      points: [{
        id: metadata.id,
        vector: embedding,
        payload: metadata
      }]
    })
  });
}
```

## 🚀 Getting Started

1. **Start Ollama service**:
   ```bash
   cd docker
   ./start-services.sh ai
   ```

2. **Wait for models to download** (first time only):
   ```bash
   docker logs -f ollama-init
   ```

3. **Test the setup**:
   ```bash
   curl -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d '{"model": "llama3.2:3b", "prompt": "Hello, StarTales!", "stream": false}'
   ```

4. **Generate embeddings**:
   ```bash
   curl -X POST http://localhost:11434/api/embeddings \
     -H "Content-Type: application/json" \
     -d '{"model": "nomic-embed-text", "prompt": "Galactic civilization game"}'
   ```

---

**🎉 You now have a complete AI backend with both LLMs and embeddings running locally!**
