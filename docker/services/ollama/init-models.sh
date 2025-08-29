#!/bin/bash
# Initialize Ollama models for StarTales

set -e

echo "🚀 Initializing Ollama models for StarTales..."

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama service to be ready..."
while ! curl -f http://ollama:11434/api/tags >/dev/null 2>&1; do
    echo "   Waiting for Ollama..."
    sleep 5
done

echo "✅ Ollama service is ready!"

# Pull required models
MODELS=(
    # LLM Models for text generation
    "llama3.2:3b"           # Fast model for quick responses (2GB)
    "llama3.2:8b"           # Balanced model for general use (4.7GB)
    "codellama:7b"          # Code generation and analysis (3.8GB)
    "mistral:7b"            # Alternative general model (4.1GB)
    
    # Embedding Models for semantic search
    "nomic-embed-text"      # High-quality embeddings (274MB)
    "all-minilm"            # Lightweight embeddings (23MB)
    
    # Specialized Models
    "phi3:mini"             # Lightweight reasoning model (2.3GB)
    "gemma2:2b"             # Google's efficient model (1.6GB)
)

for model in "${MODELS[@]}"; do
    echo "📥 Pulling model: $model"
    if ollama pull "$model"; then
        echo "✅ Successfully pulled: $model"
    else
        echo "❌ Failed to pull: $model"
    fi
done

echo "🎉 Model initialization complete!"

# List all available models
echo "📋 Available models:"
ollama list
