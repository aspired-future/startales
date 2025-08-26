# 🎮 Startales Provider Configuration Guide

## Overview

Startales uses an **abstract provider system** that supports multiple AI providers for different services:

- **LLM (Language Models)**: Ollama, OpenAI, Anthropic, Google Gemini, xAI Grok
- **Image Generation**: Google Imagen, DALL-E, Stable Diffusion  
- **Video Generation**: Google VEO 3, Runway, Pika
- **Speech-to-Text**: Whisper API, local Whisper
- **Text-to-Speech**: OpenAI TTS, ElevenLabs, system TTS

## 🦙 Recommended Setup: Ollama + Google Service Account

### Why This Configuration?

1. **Ollama for LLM**: 
   - ✅ **Free** after initial setup
   - ✅ **Fast** local inference
   - ✅ **Private** - no data sent to external APIs
   - ✅ **Reliable** - no API rate limits
   - ✅ **Multiple models** available (llama3.2, codellama, etc.)

2. **Google Service Account for Images/Video**:
   - ✅ **High quality** Imagen 3.0 generation
   - ✅ **Advanced video** with VEO 3
   - ✅ **Cost effective** with service account billing
   - ✅ **Enterprise ready** authentication

## 🚀 Quick Setup

### Step 1: Install and Configure Ollama

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Or download from https://ollama.ai/

# Start Ollama server
ollama serve

# Pull recommended models
ollama pull llama3.2          # Main model (4GB)
ollama pull codellama:13b     # Code generation (7GB)
ollama pull qwen2.5:14b       # Analysis tasks (8GB)
```

### Step 2: Set Up Google Service Account

1. **Place your service account file** in the project root:
   ```
   startales/
   ├── lively-galaxy-7950344e0de7.json  ← Your service account file
   ├── src/
   └── ...
   ```

2. **Or set environment variable**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=./lively-galaxy-7950344e0de7.json
   ```

### Step 3: Test Configuration

```bash
# Run the test script
node temp_dev/test_provider_config.js
```

## 📋 Configuration Files

### Provider Configuration (`src/server/config/providers.json`)

```json
{
  "providers": {
    "llm": { "default": "ollama" },
    "image": { "default": "google-imagen" },
    "video": { "default": "veo3" }
  },
  "providerConfigs": {
    "ollama": {
      "host": "http://localhost:11434",
      "models": {
        "default": "llama3.2",
        "coding": "codellama:13b",
        "creative": "llama3.1:8b"
      }
    },
    "google-imagen": {
      "serviceAccountPath": "./lively-galaxy-7950344e0de7.json",
      "projectId": "lively-galaxy-795034"
    }
  }
}
```

## 🔧 Advanced Configuration

### Environment Variables

```bash
# AI Provider Selection
AI_PROVIDER=ollama
AI_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434

# Google Service Account
GOOGLE_APPLICATION_CREDENTIALS=./lively-galaxy-7950344e0de7.json

# Image Generation
IMAGE_PROVIDER=google-imagen

# Optional: Direct API keys (if not using service account)
GOOGLE_API_KEY=your_api_key_here
OPENAI_API_KEY=your_openai_key_here
```

### Per-Campaign Provider Overrides

You can configure different providers for different campaigns:

```json
{
  "providers": {
    "llm": {
      "default": "ollama",
      "perCampaign": {
        "campaign-123": "openai",
        "campaign-456": "anthropic"
      }
    }
  }
}
```

### Runtime Provider Switching

The system supports **hot-switching** providers during runtime:

```typescript
// Switch LLM provider for a specific session
await registry.switchProvider('llm', 'anthropic', { 
  sessionId: 'session-789' 
});

// Switch image provider globally
await registry.switchProvider('image', 'dall-e');
```

## 🧪 Testing Your Setup

### 1. Test Ollama Connection

```bash
curl http://localhost:11434/api/tags
```

### 2. Test Ollama Generation

```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2",
    "prompt": "Write a greeting for a space game.",
    "stream": false
  }'
```

### 3. Test Google Service Account

```bash
# Check if file exists and is valid JSON
cat lively-galaxy-7950344e0de7.json | jq .type
# Should output: "service_account"
```

### 4. Run Full Test Suite

```bash
node temp_dev/test_provider_config.js
```

## 🎯 Usage Examples

### LLM Generation (Ollama)

```typescript
import { getRegistry } from './src/server/registry/AdapterRegistry';

const registry = getRegistry();
const llmAdapter = await registry.getAdapter('llm');

const result = await llmAdapter.chat({
  messages: [
    { role: 'user', content: 'Generate a space station description' }
  ],
  model: 'llama3.2',
  temperature: 0.7
});

console.log(result.text);
```

### Image Generation (Google Imagen)

```typescript
import { UnifiedImageGenerationService } from './src/server/visual/UnifiedImageGenerationService';

const imageService = new UnifiedImageGenerationService();

const result = await imageService.generateImage({
  prompt: 'A futuristic space station orbiting Earth',
  aspectRatio: '16:9',
  style: 'digital-art',
  quality: 'hd'
});

console.log('Generated image URL:', result.images[0].url);
```

### Story Generation with Mixed Providers

```typescript
// Use Ollama for text generation
const storyText = await llmAdapter.chat({
  messages: [{ role: 'user', content: 'Create a space adventure story' }],
  model: 'llama3.2'
});

// Use Google Imagen for story illustration
const storyImage = await imageService.generateImage({
  prompt: `Illustrate this story: ${storyText.text.substring(0, 200)}`,
  style: 'concept-art'
});
```

## 🔍 Troubleshooting

### Ollama Issues

**Problem**: `curl: (7) Failed to connect to localhost port 11434`
**Solution**: 
```bash
ollama serve  # Start Ollama server
```

**Problem**: `model 'llama3.2' not found`
**Solution**:
```bash
ollama pull llama3.2  # Download the model
```

### Google Service Account Issues

**Problem**: `service account file not found`
**Solution**: 
- Ensure file is in project root
- Check file name matches exactly: `lively-galaxy-7950344e0de7.json`
- Verify file permissions (readable)

**Problem**: `Invalid service account file`
**Solution**:
- Verify JSON is valid: `cat file.json | jq .`
- Check required fields: `type`, `private_key`, `client_email`

### Performance Issues

**Problem**: Slow Ollama responses
**Solution**:
- Use smaller models: `llama3.2` (4GB) vs `llama3.1:70b` (40GB)
- Increase system RAM
- Use GPU acceleration if available

**Problem**: Image generation timeouts
**Solution**:
- Check Google Cloud quotas
- Verify service account has proper permissions
- Use fallback providers in configuration

## 📊 Provider Comparison

| Provider | Cost | Speed | Quality | Privacy | Setup |
|----------|------|-------|---------|---------|-------|
| **Ollama** | Free* | Fast | Good | High | Medium |
| **OpenAI** | $$ | Fast | Excellent | Low | Easy |
| **Google** | $ | Medium | Excellent | Medium | Medium |
| **Anthropic** | $$ | Medium | Excellent | Low | Easy |

*After initial hardware/setup costs

## 🎮 Game-Specific Optimizations

### For Story Generation
- **Model**: `llama3.1:8b` (creative writing)
- **Temperature**: 0.8-0.9 (more creative)
- **Max Tokens**: 2000+ (longer stories)

### For Character Dialogue  
- **Model**: `llama3.2` (conversational)
- **Temperature**: 0.7 (balanced)
- **Max Tokens**: 500 (concise responses)

### For Game Analysis
- **Model**: `qwen2.5:14b` (analytical)
- **Temperature**: 0.3 (more focused)
- **Max Tokens**: 1000 (detailed analysis)

### For Code Generation
- **Model**: `codellama:13b` (programming)
- **Temperature**: 0.2 (precise)
- **Max Tokens**: 1500 (complete functions)

## 🔄 Migration Guide

### From OpenAI to Ollama

1. **Install Ollama** (see Step 1 above)
2. **Update configuration**:
   ```json
   {
     "providers": {
       "llm": { "default": "ollama" }
     }
   }
   ```
3. **Test compatibility** with existing prompts
4. **Adjust temperature/tokens** as needed

### From DALL-E to Google Imagen

1. **Set up service account** (see Step 2 above)
2. **Update configuration**:
   ```json
   {
     "providers": {
       "image": { "default": "google-imagen" }
     }
   }
   ```
3. **Test image quality** and adjust prompts
4. **Monitor costs** and quotas

## 📈 Monitoring and Metrics

The system automatically tracks:
- **Request latency** per provider
- **Token usage** and costs
- **Success/failure rates**
- **Provider availability**

Access metrics via:
```typescript
const stats = await registry.getProviderStats('ollama');
console.log('Average latency:', stats.averageLatencyMs);
console.log('Success rate:', stats.successRate);
```

## 🎯 Next Steps

1. **Run the test script** to verify your setup
2. **Start the game server** and test story generation
3. **Monitor performance** and adjust models as needed
4. **Explore advanced features** like provider switching
5. **Set up monitoring** for production use

---

**Need Help?** 
- Check the test script output for specific issues
- Review server logs for detailed error messages  
- Consult the provider documentation for advanced configuration
