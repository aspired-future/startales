import express from 'express';
import { unifiedVideoService } from '../UnifiedVideoService.js';

export const createUnifiedVideoTestRoutes = () => {
  const router = express.Router();

  // Test unified video generation with provider selection
  router.post('/test/unified/generate', async (req, res) => {
    const { 
      prompt, 
      duration = 8, 
      aspectRatio = '16:9', 
      style = 'cinematic', 
      quality = 'high',
      priority = 'normal',
      context = {}
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    try {
      console.log(`🎬 Unified Test: Generating video with prompt: "${prompt}"`);
      
      const result = await unifiedVideoService.generateVideo({
        prompt,
        duration,
        aspectRatio,
        style,
        quality,
        priority,
        context
      });

      res.json({
        success: true,
        message: `Video generation initiated with ${result.provider}`,
        video: result,
        provider: result.provider,
        promptLength: prompt.length
      });

    } catch (error) {
      console.error('Unified video generation test failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate video with unified service'
      });
    }
  });

  // Test event-specific video generation
  router.post('/test/unified/event-video', async (req, res) => {
    const { eventType, context = {}, options = {} } = req.body;

    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: 'Event type is required'
      });
    }

    try {
      console.log(`🎬 Unified Event Test: Generating ${eventType} video`);
      
      const result = await unifiedVideoService.generateEventVideo(eventType, context, options);

      res.json({
        success: true,
        message: `Event video generated for ${eventType} with ${result.provider}`,
        eventType,
        context,
        video: result,
        provider: result.provider,
        enhancedPrompt: result.prompt?.substring(0, 200) + '...'
      });

    } catch (error) {
      console.error('Unified event video generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate event video'
      });
    }
  });

  // Test provider comparison
  router.post('/test/unified/compare-providers', async (req, res) => {
    const { prompt = 'A futuristic space station with glowing lights', testProviders = ['veo3', 'runway', 'pika'] } = req.body;

    try {
      const results = [];
      
      for (const provider of testProviders) {
        try {
          console.log(`🎬 Testing provider: ${provider}`);
          
          // This would require modifying the service to allow provider selection
          // For now, we'll simulate by checking capabilities
          const capabilities = unifiedVideoService.getProviderCapabilities();
          
          if (capabilities[provider]) {
            results.push({
              provider,
              available: true,
              capabilities: capabilities[provider],
              testResult: 'Would generate video with this provider'
            });
          } else {
            results.push({
              provider,
              available: false,
              error: 'Provider not available'
            });
          }
        } catch (error) {
          results.push({
            provider,
            available: false,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        message: 'Provider comparison completed',
        prompt,
        results,
        totalProviders: testProviders.length,
        availableProviders: results.filter(r => r.available).length
      });

    } catch (error) {
      console.error('Provider comparison failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to compare providers'
      });
    }
  });

  // Get provider capabilities and status
  router.get('/test/unified/providers', async (req, res) => {
    try {
      const capabilities = unifiedVideoService.getProviderCapabilities();
      const status = await unifiedVideoService.getProviderStatus();
      const activeGenerations = unifiedVideoService.getActiveGenerations();

      res.json({
        success: true,
        providers: Object.keys(capabilities),
        capabilities,
        status,
        activeGenerations,
        totalProviders: Object.keys(capabilities).length,
        availableProviders: Object.values(status).filter(s => s.available).length
      });

    } catch (error) {
      console.error('Failed to get provider information:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get provider information'
      });
    }
  });

  // Check video status
  router.get('/test/unified/status/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
      const status = await unifiedVideoService.checkVideoStatus(videoId);
      
      res.json({
        success: true,
        videoId,
        status
      });

    } catch (error) {
      console.error('Status check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check video status'
      });
    }
  });

  // Cancel video generation
  router.post('/test/unified/cancel/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
      const cancelled = await unifiedVideoService.cancelVideo(videoId);
      
      res.json({
        success: cancelled,
        videoId,
        message: cancelled ? 'Video generation cancelled' : 'Failed to cancel video generation'
      });

    } catch (error) {
      console.error('Cancellation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel video generation'
      });
    }
  });

  // Test all event types with unified service
  router.post('/test/unified/all-events', async (req, res) => {
    const eventTypes = [
      'major_discovery',
      'political_crisis',
      'economic_milestone',
      'military_conflict',
      'natural_disaster',
      'technology_breakthrough',
      'population_milestone',
      'colony_established',
      'diplomatic_achievement'
    ];

    const results = [];

    try {
      for (const eventType of eventTypes) {
        try {
          console.log(`🎬 Unified Test: Generating ${eventType} video`);
          
          const result = await unifiedVideoService.generateEventVideo(eventType, {
            location: 'Test System',
            campaignId: 'test'
          }, {
            duration: 6,
            quality: 'standard'
          });

          results.push({
            eventType,
            success: true,
            video: result,
            provider: result.provider,
            duration: result.duration
          });

          console.log(`✅ ${eventType}: Generated with ${result.provider}`);
        } catch (error) {
          results.push({
            eventType,
            success: false,
            error: error.message
          });
          console.error(`❌ ${eventType}: Failed - ${error.message}`);
        }
      }

      res.json({
        success: true,
        message: `Generated videos for ${results.filter(r => r.success).length}/${eventTypes.length} event types`,
        results,
        totalEvents: eventTypes.length,
        successfulGenerations: results.filter(r => r.success).length,
        failedGenerations: results.filter(r => !r.success).length
      });

    } catch (error) {
      console.error('Bulk event generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate videos for all events',
        partialResults: results
      });
    }
  });

  // Performance benchmark test
  router.post('/test/unified/benchmark', async (req, res) => {
    const { iterations = 3, prompt = 'A futuristic space scene' } = req.body;

    try {
      const benchmarkResults = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        try {
          const result = await unifiedVideoService.generateVideo({
            prompt: `${prompt} (iteration ${i + 1})`,
            duration: 5,
            quality: 'standard'
          });
          
          const endTime = Date.now();
          
          benchmarkResults.push({
            iteration: i + 1,
            success: true,
            provider: result.provider,
            generationTime: endTime - startTime,
            videoId: result.videoId,
            status: result.status
          });
          
        } catch (error) {
          benchmarkResults.push({
            iteration: i + 1,
            success: false,
            error: error.message,
            generationTime: Date.now() - startTime
          });
        }
      }

      const successfulRuns = benchmarkResults.filter(r => r.success);
      const averageTime = successfulRuns.length > 0 
        ? successfulRuns.reduce((sum, r) => sum + r.generationTime, 0) / successfulRuns.length 
        : 0;

      res.json({
        success: true,
        message: `Benchmark completed: ${successfulRuns.length}/${iterations} successful`,
        results: benchmarkResults,
        statistics: {
          totalIterations: iterations,
          successfulRuns: successfulRuns.length,
          failedRuns: iterations - successfulRuns.length,
          averageGenerationTime: Math.round(averageTime),
          successRate: (successfulRuns.length / iterations) * 100
        }
      });

    } catch (error) {
      console.error('Benchmark test failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to run benchmark test'
      });
    }
  });

  return router;
};

export default createUnifiedVideoTestRoutes;

