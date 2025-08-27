import express from 'express';
import cors from 'cors';
import witterRoutes from './routes/witter.js';

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'witter-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Witter API routes
app.use('/api/witter', witterRoutes);

// AI service endpoints (mock for now)
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, maxTokens = 150, temperature = 0.8, model = 'gpt-4o-mini' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Mock AI response based on prompt content
    let content = '';
    
    if (prompt.includes('funny') || prompt.includes('humor')) {
      const funnyResponses = [
        "My quantum coffee maker achieved sentience and now judges my breakfast choices ☕🤖 #TechLife",
        "Tried to parallel park my hover car. Ended up in orbit. The parking meter is still running 🚗🌌 #SpaceProblems",
        "My AI assistant just filed a complaint with HR about my work-life balance. I don't even have HR! 🤖📝 #FutureProblems",
        "Accidentally ordered 500 units of 'artisanal space cheese' because my smart fridge detected I was 'mildly peckish' 🧀💸 #SmartHomeFail"
      ];
      content = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
    } else if (prompt.includes('political') || prompt.includes('snarky')) {
      const politicalResponses = [
        "Another 'emergency' tax for 'galactic defense.' Pretty sure that's code for the Chancellor's new yacht 🛥️💸 #TaxTheRich",
        "They call it 'strategic resource reallocation' when it's literally just moving money from education to military 📚➡️💀 #BudgetReality",
        "The 'Universal Prosperity Initiative' sure is prosperous... for someone. Spoiler: it's not the working class 💼😤 #EconomicReality"
      ];
      content = politicalResponses[Math.floor(Math.random() * politicalResponses.length)];
    } else if (prompt.includes('official') || prompt.includes('announcement')) {
      const officialResponses = [
        "📊 INFRASTRUCTURE UPDATE: Hyperspace Lane 7 maintenance completed ahead of schedule. Travel time reduced by 18%. Next phase begins Q4 2387.",
        "🔬 BREAKTHROUGH: Quantum computing trials show 85% success rate in 72-hour testing. Commercial deployment expected by mid-2388.",
        "🛡️ SECURITY UPDATE: Pirate activity in Outer Rim sectors decreased 35% following joint patrol operations. Trade routes Alpha-7 through Delta-12 now secure."
      ];
      content = officialResponses[Math.floor(Math.random() * officialResponses.length)];
    } else {
      // Generic response
      content = "Just another day in the galaxy! 🌌 Things are... interesting out here. #GalacticLife";
    }
    
    res.json({
      content,
      model: model,
      usage: {
        prompt_tokens: Math.floor(prompt.length / 4),
        completion_tokens: Math.floor(content.length / 4),
        total_tokens: Math.floor((prompt.length + content.length) / 4)
      }
    });
    
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Image generation endpoint (mock)
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const { prompt, style = 'meme', size = '512x512' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Simulate image generation delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Return a placeholder image URL
    const imageUrl = `https://picsum.photos/${size.replace('x', '/')}?random=${Math.random()}`;
    
    res.json({
      imageUrl,
      prompt,
      style,
      size,
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({
      error: 'Image generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/witter/feed',
      'GET /api/witter/filters',
      'GET /api/witter/post/:id',
      'POST /api/witter/post/:id/like',
      'POST /api/witter/post/:id/share',
      'GET /api/witter/post/:id/comments',
      'POST /api/witter/post/:id/comment',
      'GET /api/witter/profile/:id',
      'POST /api/witter/profile/:id/follow',
      'POST /api/ai/generate',
      'POST /api/ai/generate-image'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Witter AI API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🐦 Witter feed: http://localhost:${PORT}/api/witter/feed`);
  console.log(`🎯 AI generation: http://localhost:${PORT}/api/ai/generate`);
});

export default app;