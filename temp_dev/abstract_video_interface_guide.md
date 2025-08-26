# Abstract Video Provider Interface - Complete Guide

## 🎬 Overview

The Abstract Video Provider Interface allows you to use **any video generation service** (VEO 3, Runway, Pika Labs, Luma AI, etc.) interchangeably in your Game Master system. This provides flexibility, redundancy, and the ability to choose the best provider for each situation.

## 🏗️ Architecture

### Core Components

1. **`IVideoProvider`** - Abstract base class defining the interface
2. **Concrete Providers** - VEO3Provider, RunwayProvider, PikaProvider
3. **`VideoProviderFactory`** - Creates and manages provider instances
4. **`VideoProviderManager`** - Handles multi-provider operations with fallback
5. **`UnifiedVideoService`** - High-level service with game integration

### Provider Hierarchy

```
IVideoProvider (Abstract)
├── VEO3Provider (Google VEO 3)
├── RunwayProvider (Runway Gen-3)
├── PikaProvider (Pika Labs)
└── [Your Custom Provider]
```

## 🔌 Adding New Providers

### Step 1: Implement the Interface

```typescript
import { IVideoProvider, VideoGenerationRequest, VideoGenerationResponse, VideoProviderCapabilities } from './IVideoProvider.js';

export class YourCustomProvider extends IVideoProvider {
  constructor(config: VideoProviderConfig) {
    super(config);
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    // Your implementation here
    const videoId = this.generateVideoId();
    
    // Make API call to your service
    const response = await fetch('https://your-api.com/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: request.prompt,
        duration: request.duration,
        // ... other parameters
      })
    });

    const data = await response.json();
    
    return {
      videoId: data.id || videoId,
      status: this.mapStatus(data.status),
      videoUrl: data.videoUrl,
      // ... other response fields
    };
  }

  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    // Implementation for status checking
  }

  async cancelGeneration(videoId: string): Promise<boolean> {
    // Implementation for cancellation
  }

  getCapabilities(): VideoProviderCapabilities {
    return {
      name: 'Your Provider',
      version: '1.0.0',
      supportedAspectRatios: ['16:9', '9:16', '1:1'],
      supportedResolutions: ['1080p', '4K'],
      supportedFrameRates: [24, 30],
      supportedStyles: ['cinematic', 'realistic'],
      maxDuration: 30,
      minDuration: 2,
      maxPromptLength: 1000,
      costPerSecond: 0.25,
      averageGenerationTime: 90
    };
  }

  async isAvailable(): Promise<boolean> {
    // Check if your service is available
  }

  async validateConfig(): Promise<boolean> {
    // Validate your configuration
  }
}
```

### Step 2: Register Your Provider

```typescript
import { VideoProviderFactory } from './VideoProviderFactory.js';
import { YourCustomProvider } from './YourCustomProvider.js';

const factory = VideoProviderFactory.getInstance();
factory.registerProvider('your-provider', YourCustomProvider);
```

### Step 3: Configure and Use

```typescript
import { videoProviderManager } from './VideoProviderFactory.js';

// Configure your provider
videoProviderManager.setProviderConfig('your-provider', {
  apiKey: process.env.YOUR_API_KEY,
  timeout: 120000,
  defaultQuality: 'high'
});

// Use it for generation
const result = await videoProviderManager.generateVideo({
  prompt: 'A futuristic space station',
  duration: 10,
  quality: 'high'
});
```

## 🚀 Usage Examples

### Basic Video Generation

```typescript
import { unifiedVideoService } from './UnifiedVideoService.js';

// Generate a video with automatic provider selection
const video = await unifiedVideoService.generateVideo({
  prompt: 'A cinematic space battle with glowing ships',
  duration: 8,
  aspectRatio: '16:9',
  style: 'cinematic',
  quality: 'high',
  priority: 'normal'
});

console.log(`Generated with ${video.provider}: ${video.videoUrl}`);
```

### Event-Specific Generation

```typescript
// Generate video for a specific game event
const discoveryVideo = await unifiedVideoService.generateEventVideo(
  'major_discovery',
  {
    discoveryType: 'alien_civilization',
    location: 'Proxima Centauri',
    characterId: 'commander_alpha'
  },
  {
    duration: 10,
    priority: 'high'
  }
);
```

### Provider Comparison

```typescript
// Get capabilities of all providers
const capabilities = unifiedVideoService.getProviderCapabilities();

console.log('Available providers:');
Object.entries(capabilities).forEach(([name, caps]) => {
  console.log(`${name}: ${caps.maxDuration}s max, $${caps.costPerSecond}/sec`);
});

// Check provider status
const status = await unifiedVideoService.getProviderStatus();
console.log('Provider availability:', status);
```

### Manual Provider Selection

```typescript
import { videoProviderFactory } from './VideoProviderFactory.js';

// Use a specific provider directly
const veo3 = videoProviderFactory.createProvider('veo3', {
  apiKey: process.env.GOOGLE_API_KEY
});

const video = await veo3.generateVideo({
  prompt: 'A peaceful alien landscape',
  duration: 6
});
```

## 🔧 Configuration

### Environment Variables

```bash
# Provider API Keys
GOOGLE_API_KEY=your_google_api_key_here
RUNWAY_API_KEY=your_runway_api_key_here  
PIKA_API_KEY=your_pika_api_key_here

# Optional: Custom endpoints
RUNWAY_BASE_URL=https://api.runwayml.com/v1
PIKA_BASE_URL=https://api.pika.art/v1
```

### Provider Priority

```typescript
import { videoProviderManager } from './VideoProviderFactory.js';

// Set provider priority based on criteria
videoProviderManager.setBestProvider('speed');   // Fastest generation
videoProviderManager.setBestProvider('quality'); // Best quality output  
videoProviderManager.setBestProvider('cost');    // Most cost-effective
```

### Fallback Configuration

```typescript
// Configure primary and fallback providers
const manager = new VideoProviderManager(
  'veo3',                    // Primary provider
  ['runway', 'pika']         // Fallback providers
);
```

## 🧪 Testing

### API Endpoints

The system provides comprehensive test endpoints:

```bash
# Test unified video generation
POST /api/video/test/unified/generate
{
  "prompt": "A futuristic city at sunset",
  "duration": 8,
  "quality": "high"
}

# Test event-specific generation
POST /api/video/test/unified/event-video
{
  "eventType": "major_discovery",
  "context": { "location": "Mars Colony" }
}

# Get provider information
GET /api/video/test/unified/providers

# Check video status
GET /api/video/test/unified/status/:videoId

# Cancel generation
POST /api/video/test/unified/cancel/:videoId

# Performance benchmark
POST /api/video/test/unified/benchmark
{
  "iterations": 5,
  "prompt": "Test video generation"
}
```

### Test Script

```bash
# Run comprehensive tests
curl -X POST http://localhost:4000/api/video/test/unified/all-events

# Test provider comparison
curl -X POST http://localhost:4000/api/video/test/unified/compare-providers \
  -H "Content-Type: application/json" \
  -d '{"testProviders": ["veo3", "runway", "pika"]}'
```

## 📊 Provider Comparison

| Provider | Max Duration | Cost/sec | Avg Time | Strengths |
|----------|-------------|----------|----------|-----------|
| **VEO 3** | 60s | $0.10 | 120s | High quality, long videos |
| **Runway** | 10s | $0.95 | 90s | Realistic, fast generation |
| **Pika** | 4s | $0.50 | 60s | Quick, animated style |

## 🎯 Best Practices

### 1. **Provider Selection Strategy**

```typescript
// For critical game moments
request.priority = 'critical';  // Uses fastest provider

// For high-quality cutscenes  
request.priority = 'high';      // Uses best quality provider

// For background content
request.priority = 'normal';    // Uses most cost-effective
```

### 2. **Error Handling**

```typescript
try {
  const video = await unifiedVideoService.generateVideo(request);
} catch (error) {
  // Automatic fallback is built-in
  console.error('All providers failed:', error);
  // Use static fallback video
}
```

### 3. **Monitoring**

```typescript
// Monitor active generations
const active = unifiedVideoService.getActiveGenerations();
console.log(`${active.length} videos currently generating`);

// Check provider metrics
const status = await unifiedVideoService.getProviderStatus();
Object.entries(status).forEach(([name, info]) => {
  console.log(`${name}: ${info.available ? 'Available' : 'Unavailable'}`);
});
```

## 🔮 Future Enhancements

### Planned Features

1. **Dynamic Provider Selection** - AI-based provider choice
2. **Quality Validation** - Automatic video quality assessment
3. **Cost Optimization** - Smart provider selection based on budget
4. **Batch Generation** - Multiple videos in parallel
5. **Custom Models** - Support for fine-tuned models

### Extension Points

```typescript
// Custom provider with special features
export class AdvancedProvider extends IVideoProvider {
  async generateVideoWithMusic(request: VideoGenerationRequest & { musicStyle: string }) {
    // Generate video with synchronized music
  }
  
  async generateInteractiveVideo(request: VideoGenerationRequest & { choices: string[] }) {
    // Generate branching interactive video
  }
}
```

## 🎬 Integration with Game Master

The abstract interface is fully integrated with the Game Master system:

1. **Automatic Fallback** - If primary provider fails, automatically tries alternatives
2. **Visual Consistency** - All providers use the same style guidelines
3. **Event Context** - Providers receive game context for better generation
4. **Real-time Broadcasting** - Generated videos are broadcast via WebSocket
5. **UI Integration** - Videos appear as full-screen popups in the game

## 🚀 Ready to Use!

The abstract video provider interface is now fully implemented and ready for production use. You can:

1. **Use multiple providers** with automatic fallback
2. **Add new providers** easily by implementing the interface
3. **Test all functionality** with comprehensive test endpoints
4. **Monitor performance** with built-in metrics
5. **Ensure visual consistency** across all providers

**The Game Master can now generate videos using the best available provider for each situation, ensuring reliability and quality!** 🎬✨

