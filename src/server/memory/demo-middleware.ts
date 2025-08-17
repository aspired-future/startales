import express from 'express';
import { bootstrapLLMProviders } from '../llm/bootstrap.js';
import { conversationStorage } from './conversationStorage.js';
import { captureConversations } from './conversationMiddleware.js';
import { 
  captureUserMessage, 
  captureAssistantMessage, 
  createContext,
  getCaptureStats 
} from './messageCapture.js';

/**
 * Demo Express application showing conversation capture middleware integration
 */
async function createDemoApp() {
  const app = express();
  
  // Middleware setup
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Initialize systems
  await bootstrapLLMProviders();
  await conversationStorage.initializeTables();
  
  // Apply conversation capture middleware globally
  app.use(captureConversations());
  
  /**
   * Game API endpoints that will automatically capture conversations
   */
  
  // Trade inquiry endpoint - conversations will be captured automatically
  app.post('/api/campaigns/:campaignId/trade/inquiry', async (req, res) => {
    const { campaignId } = req.params;
    const { query, currentSystem, credits } = req.body;
    
    // Simulate AI response generation
    const response = generateTradeResponse(query, currentSystem);
    
    res.json({
      query,
      response,
      gameState: {
        currentSystem,
        credits,
        timestamp: new Date().toISOString()
      },
      entities: extractEntities(query + ' ' + response),
      actionType: 'trade_inquiry'
    });
  });
  
  // Strategy planning endpoint  
  app.post('/api/campaigns/:campaignId/strategy/plan', async (req, res) => {
    const { campaignId } = req.params;
    const { objectives, currentResources, timeframe } = req.body;
    
    const strategyPlan = generateStrategyPlan(objectives, currentResources);
    
    res.json({
      objectives,
      strategyPlan,
      gameState: {
        resources: currentResources,
        timeframe,
        timestamp: new Date().toISOString()
      },
      entities: ['strategy', 'planning', 'resources'],
      actionType: 'strategy_planning'
    });
  });
  
  // Direct message capture endpoint (bypasses middleware)
  app.post('/api/campaigns/:campaignId/conversations/capture', async (req, res) => {
    const { campaignId } = req.params;
    const { role, content, entities, actionType, gameState } = req.body;
    
    const context = createContext(parseInt(campaignId), {
      entities,
      actionType,
      gameState
    });
    
    let messageId;
    if (role === 'user') {
      messageId = await captureUserMessage(content, context);
    } else if (role === 'assistant') {
      messageId = await captureAssistantMessage(content, context);
    }
    
    res.json({
      messageId,
      role,
      content,
      campaignId: parseInt(campaignId),
      captured: !!messageId
    });
  });
  
  // System status endpoint
  app.get('/api/memory/status', async (req, res) => {
    const captureStats = getCaptureStats();
    const storageHealth = await conversationStorage.healthCheck();
    
    res.json({
      capture: captureStats,
      storage: storageHealth,
      timestamp: new Date().toISOString()
    });
  });
  
  // Get conversations for a campaign
  app.get('/api/campaigns/:campaignId/conversations', async (req, res) => {
    const { campaignId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const conversations = await conversationStorage.getConversations({
      campaignId: parseInt(campaignId),
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
    
    res.json({
      conversations,
      campaignId: parseInt(campaignId),
      count: conversations.length
    });
  });
  
  return app;
}

/**
 * Helper functions to simulate AI responses
 */
function generateTradeResponse(query: string, currentSystem: string): string {
  const responses = [
    `Based on current market conditions in ${currentSystem}, I recommend focusing on rare metal extraction. Platinum and iridium prices are up 23% this quarter.`,
    `The ${currentSystem} system has excellent asteroid mining opportunities. Iron ore demand is particularly high due to ongoing fleet expansions.`,
    `Consider establishing trade routes between ${currentSystem} and nearby industrial systems. Agricultural products show strong profit margins currently.`,
    `Mining operations in ${currentSystem} would benefit from automated extraction platforms. Initial investment pays off within 18 months.`,
    `The galactic market shows increased demand for energy crystals. ${currentSystem} has three unexplored asteroid fields with high energy crystal concentrations.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateStrategyPlan(objectives: string[], resources: any): string {
  return `Strategic Analysis: Based on your objectives (${objectives.join(', ')}) and current resources, I recommend a three-phase approach: 
1. Consolidate existing territories and optimize resource extraction
2. Establish strategic alliances with neighboring systems  
3. Expand into high-value sectors with strong defensive positions
This plan leverages your current strengths while addressing resource limitations.`;
}

function extractEntities(text: string): string[] {
  const entities = [];
  const lowerText = text.toLowerCase();
  
  // Common game entities
  if (lowerText.includes('trade') || lowerText.includes('trading')) entities.push('trade');
  if (lowerText.includes('mining') || lowerText.includes('mine')) entities.push('mining');
  if (lowerText.includes('strategy') || lowerText.includes('strategic')) entities.push('strategy');
  if (lowerText.includes('resource') || lowerText.includes('resources')) entities.push('resources');
  if (lowerText.includes('system') || lowerText.includes('systems')) entities.push('systems');
  if (lowerText.includes('profit') || lowerText.includes('profitable')) entities.push('profit');
  if (lowerText.includes('alliance') || lowerText.includes('ally')) entities.push('alliance');
  if (lowerText.includes('military') || lowerText.includes('fleet')) entities.push('military');
  
  return entities;
}

/**
 * Start the demo server
 */
async function startDemoServer(port = 5000) {
  try {
    const app = await createDemoApp();
    
    const server = app.listen(port, () => {
      console.log('\n🎯 CONVERSATION CAPTURE MIDDLEWARE DEMO SERVER');
      console.log('=' .repeat(50));
      console.log(`📡 Server running on http://localhost:${port}`);
      console.log('');
      console.log('📋 Available endpoints:');
      console.log(`   POST /api/campaigns/{id}/trade/inquiry`);
      console.log(`   POST /api/campaigns/{id}/strategy/plan`);
      console.log(`   POST /api/campaigns/{id}/conversations/capture`);
      console.log(`   GET  /api/campaigns/{id}/conversations`);
      console.log(`   GET  /api/memory/status`);
      console.log('');
      console.log('💡 All conversations are automatically captured and vectorized!');
      console.log('🧠 Test the middleware by making requests to the above endpoints');
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down demo server...');
      server.close(() => {
        console.log('✅ Demo server stopped');
        process.exit(0);
      });
    });
    
    return server;
    
  } catch (error) {
    console.error('❌ Failed to start demo server:', error);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startDemoServer();
}

export { createDemoApp, startDemoServer };
