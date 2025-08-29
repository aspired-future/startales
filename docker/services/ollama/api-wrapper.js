#!/usr/bin/env node
/**
 * Ollama API Wrapper for StarTales
 * Provides simplified endpoints for both LLMs and embeddings
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://ollama:11434';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Model configurations
const MODELS = {
  // LLM Models
  fast: 'llama3.2:3b',
  balanced: 'llama3.2:8b',
  code: 'codellama:7b',
  reasoning: 'phi3:mini',
  creative: 'mistral:7b',
  
  // Embedding Models
  embeddings: 'nomic-embed-text',
  embeddings_fast: 'all-minilm'
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'ollama-wrapper',
    models: MODELS,
    ollama_url: OLLAMA_BASE_URL
  });
});

// List available models
app.get('/models', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    
    res.json({
      available_models: data.models || [],
      configured_models: MODELS,
      ollama_status: response.ok ? 'healthy' : 'unhealthy'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate text (simplified LLM endpoint)
app.post('/generate', async (req, res) => {
  const { 
    prompt, 
    model = 'balanced', 
    temperature = 0.7, 
    max_tokens = 500,
    stream = false,
    system = null
  } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const modelName = MODELS[model] || model;
    const fullPrompt = system ? `${system}\n\nUser: ${prompt}\nAssistant:` : prompt;
    
    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: fullPrompt,
        stream: stream,
        options: {
          temperature: temperature,
          num_predict: max_tokens
        }
      })
    });

    if (stream) {
      // Stream response
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Transfer-Encoding', 'chunked');
      
      ollamaResponse.body.pipe(res);
    } else {
      // Regular response
      const data = await ollamaResponse.json();
      res.json({
        response: data.response,
        model: modelName,
        done: data.done,
        context: data.context
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate embeddings (simplified embedding endpoint)
app.post('/embeddings', async (req, res) => {
  const { 
    text, 
    texts, 
    model = 'embeddings' 
  } = req.body;

  if (!text && !texts) {
    return res.status(400).json({ error: 'Either text or texts array is required' });
  }

  try {
    const modelName = MODELS[model] || model;
    const inputTexts = texts || [text];
    const embeddings = [];

    // Process each text
    for (const inputText of inputTexts) {
      const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: inputText
        })
      });

      const data = await ollamaResponse.json();
      embeddings.push({
        text: inputText,
        embedding: data.embedding,
        dimensions: data.embedding?.length || 0
      });
    }

    res.json({
      embeddings: texts ? embeddings : embeddings[0],
      model: modelName,
      total_tokens: inputTexts.reduce((sum, t) => sum + t.length, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat completion (OpenAI-compatible endpoint)
app.post('/chat/completions', async (req, res) => {
  const { 
    messages, 
    model = 'balanced', 
    temperature = 0.7, 
    max_tokens = 500,
    stream = false
  } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const modelName = MODELS[model] || model;
    
    // Convert messages to prompt
    let prompt = '';
    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `System: ${message.content}\n\n`;
      } else if (message.role === 'user') {
        prompt += `User: ${message.content}\n`;
      } else if (message.role === 'assistant') {
        prompt += `Assistant: ${message.content}\n`;
      }
    }
    prompt += 'Assistant:';

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: stream,
        options: {
          temperature: temperature,
          num_predict: max_tokens
        }
      })
    });

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      ollamaResponse.body.pipe(res);
    } else {
      const data = await ollamaResponse.json();
      
      // OpenAI-compatible response format
      res.json({
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: modelName,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: data.response
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: prompt.length,
          completion_tokens: data.response?.length || 0,
          total_tokens: prompt.length + (data.response?.length || 0)
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Semantic search helper
app.post('/search', async (req, res) => {
  const { 
    query, 
    documents, 
    top_k = 5,
    threshold = 0.7,
    model = 'embeddings'
  } = req.body;

  if (!query || !documents) {
    return res.status(400).json({ error: 'Query and documents are required' });
  }

  try {
    const modelName = MODELS[model] || model;
    
    // Generate query embedding
    const queryResponse = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: query
      })
    });
    
    const queryData = await queryResponse.json();
    const queryEmbedding = queryData.embedding;

    // Generate document embeddings and calculate similarities
    const results = [];
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const docText = typeof doc === 'string' ? doc : doc.text || doc.content;
      
      const docResponse = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: docText
        })
      });
      
      const docData = await docResponse.json();
      const docEmbedding = docData.embedding;
      
      // Calculate cosine similarity
      const similarity = cosineSimilarity(queryEmbedding, docEmbedding);
      
      if (similarity >= threshold) {
        results.push({
          index: i,
          document: doc,
          similarity: similarity,
          text: docText
        });
      }
    }

    // Sort by similarity and return top_k
    results.sort((a, b) => b.similarity - a.similarity);
    const topResults = results.slice(0, top_k);

    res.json({
      query: query,
      results: topResults,
      total_matches: results.length,
      model: modelName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Utility function for cosine similarity
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🤖 Ollama API Wrapper running on port ${PORT}`);
  console.log(`🔗 Ollama backend: ${OLLAMA_BASE_URL}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /models - List models`);
  console.log(`   POST /generate - Generate text`);
  console.log(`   POST /embeddings - Generate embeddings`);
  console.log(`   POST /chat/completions - OpenAI-compatible chat`);
  console.log(`   POST /search - Semantic search`);
});

module.exports = app;
