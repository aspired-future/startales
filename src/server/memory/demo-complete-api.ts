import express from 'express';
import { bootstrapLLMProviders } from '../llm/bootstrap';
import { conversationStorage } from './conversationStorage';
import { conversationRouter } from './conversationAPI';
import { captureConversations } from './conversationMiddleware';
import { 
  captureUserMessage, 
  captureAssistantMessage, 
  createContext 
} from './messageCapture';

/**
 * Complete Vector Memory System Demo
 * Showcases all integrated APIs and features working together
 */
async function createCompleteDemo() {
  const app = express();
  
  // Middleware setup
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // CORS for frontend testing
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  // Initialize systems
  console.log('🔧 Initializing Vector Memory System...');
  await bootstrapLLMProviders();
  await conversationStorage.initializeTables();
  console.log('✅ System initialized successfully');
  
  // Apply conversation capture middleware globally
  app.use(captureConversations());
  
  // Mount the complete memory API
  app.use('/api/memory', conversationRouter);
  
  // Demo route: Homepage with API documentation
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vector Memory System Demo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .endpoint { background: #f4f4f4; padding: 15px; margin: 10px 0; border-left: 4px solid #007acc; }
          .method { display: inline-block; padding: 2px 8px; color: white; border-radius: 3px; font-size: 12px; }
          .get { background: #61affe; }
          .post { background: #49cc90; }
          .put { background: #fca130; }
          .delete { background: #f93e3e; }
          h1 { color: #333; }
          h2 { color: #007acc; margin-top: 30px; }
          code { background: #f8f8f8; padding: 2px 4px; }
        </style>
      </head>
      <body>
        <h1>🧠 Vector Memory & AI Context System</h1>
        <p>Complete API demo showcasing semantic search, conversation capture, and AI memory integration.</p>
        
        <h2>🏥 System Health</h2>
        <div class="endpoint">
          <span class="method get">GET</span> <code>/api/memory/health</code>
          <br>Check overall system health (storage, embedding, vector database)
        </div>
        
        <h2>💬 Conversation Management</h2>
        <div class="endpoint">
          <span class="method get">GET</span> <code>/api/memory/conversations</code>
          <br>List conversations with filtering and pagination
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/conversations</code>
          <br>Create new conversation
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/conversations/:id/messages</code>
          <br>Add message to conversation (auto-vectorized)
        </div>
        
        <h2>🔍 Advanced Semantic Search</h2>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/search</code>
          <br>Advanced search with entity filtering, time ranges, boosts, and grouping
        </div>
        <div class="endpoint">
          <span class="method get">GET</span> <code>/api/memory/search/quick?q={query}&campaignId={id}</code>
          <br>Quick semantic search with minimal parameters
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/search/entity</code>
          <br>Entity-focused search with automatic entity boosting
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/search/recent</code>
          <br>Time-filtered search with recency boosting
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/search/conversation</code>
          <br>Search within specific conversations
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/search/similar</code>
          <br>Find messages similar to a given message ID
        </div>
        <div class="endpoint">
          <span class="method get">GET</span> <code>/api/memory/search/suggestions?campaignId={id}</code>
          <br>Get intelligent search suggestions based on conversation history
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/memory/search/batch</code>
          <br>Execute multiple searches in parallel (up to 10)
        </div>
        
        <h2>📊 Analytics & Statistics</h2>
        <div class="endpoint">
          <span class="method get">GET</span> <code>/api/memory/stats</code>
          <br>Get comprehensive system usage statistics
        </div>
        
        <h2>🎮 Game Integration Examples</h2>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/campaigns/:id/trade/inquiry</code>
          <br>Trade inquiry endpoint (automatically captures conversations)
        </div>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/api/campaigns/:id/strategy/plan</code>
          <br>Strategy planning endpoint (automatically captures conversations)
        </div>
        
        <h2>🧪 Test Endpoints</h2>
        <div class="endpoint">
          <span class="method post">POST</span> <code>/demo/populate-test-data</code>
          <br>Populate system with comprehensive test conversations for demo purposes
        </div>
        <div class="endpoint">
          <span class="method get">GET</span> <code>/demo/search-examples</code>
          <br>Interactive search examples and tutorials
        </div>
        
        <hr>
        <p><strong>Pro Tip:</strong> All conversations are automatically captured and vectorized in the background. Try the trade and strategy endpoints, then search for related content!</p>
        <p><strong>Status:</strong> <span id="status">Checking...</span></p>
        
        <script>
          fetch('/api/memory/health')
            .then(r => r.json())
            .then(data => {
              document.getElementById('status').textContent = data.status === 'healthy' ? '🟢 All systems operational' : '🟡 System degraded';
              document.getElementById('status').style.color = data.status === 'healthy' ? 'green' : 'orange';
            })
            .catch(() => {
              document.getElementById('status').textContent = '🔴 System offline';
              document.getElementById('status').style.color = 'red';
            });
        </script>
      </body>
      </html>
    `);
  });
  
  // Demo route: Populate test data
  app.post('/demo/populate-test-data', async (req, res) => {
    try {
      const campaignId = 1;
      
      console.log('📝 Populating comprehensive test data...');
      
      // Rich test dataset covering various game scenarios
      const testConversations = [
        // Trade & Economics
        {
          title: 'Mining Profitability Analysis',
          messages: [
            { role: 'user', content: 'What are the most profitable mining operations in nearby star systems?', entities: ['mining', 'profit', 'star_systems'], actionType: 'trade_inquiry' },
            { role: 'assistant', content: 'Based on current market data, platinum mining in the Kepler-442 system yields 8,400 credits per unit with minimal competition. Iron ore in Wolf-359 is also highly profitable at 2,150 credits per unit.', entities: ['platinum', 'kepler_442', 'iron_ore', 'wolf_359', 'profit'], actionType: 'trade_inquiry' }
          ]
        },
        
        // Diplomacy & Alliances
        {
          title: 'Terran Federation Alliance Negotiations',
          messages: [
            { role: 'user', content: 'Should we pursue an alliance with the Terran Federation for better trade protection?', entities: ['alliance', 'terran_federation', 'trade_protection'], actionType: 'diplomatic_action' },
            { role: 'assistant', content: 'A Terran Federation alliance would provide excellent trade route protection and reduce piracy by 65%. However, it requires 15% revenue sharing and military cooperation commitments.', entities: ['alliance', 'trade_routes', 'piracy', 'revenue_sharing', 'military'], actionType: 'diplomatic_action' },
            { role: 'user', content: 'What about their recent conflicts with the Zephyrian Empire?', entities: ['terran_federation', 'zephyrian_empire', 'conflicts'], actionType: 'diplomatic_action' },
            { role: 'assistant', content: 'The Terran-Zephyrian conflict centers on disputed asteroid mining rights. An alliance with Terra could make us targets for Zephyrian raids, but also grants access to superior defense technologies.', entities: ['zephyrian_empire', 'asteroid_mining', 'defense_technology'], actionType: 'diplomatic_action' }
          ]
        },
        
        // Strategic Planning
        {
          title: 'Galactic Expansion Strategy',
          messages: [
            { role: 'user', content: 'How should we approach expanding into the Andromeda sector?', entities: ['expansion', 'andromeda_sector', 'strategy'], actionType: 'strategy_planning' },
            { role: 'assistant', content: 'I recommend a three-phase Andromeda expansion: Phase 1 - Establish mining outposts and fuel stations, Phase 2 - Build defensive platforms and sensor networks, Phase 3 - Colonize habitable worlds. Timeline: 24 months, estimated cost: 2.8M credits.', entities: ['expansion', 'mining_outposts', 'defensive_platforms', 'colonization', 'timeline'], actionType: 'strategy_planning' }
          ]
        },
        
        // Resource Management
        {
          title: 'Multi-System Resource Optimization',
          messages: [
            { role: 'user', content: 'How can we optimize resource distribution across our 7 controlled systems?', entities: ['resource_management', 'optimization', 'distribution'], actionType: 'management_query' },
            { role: 'assistant', content: 'Implement automated resource distribution networks with priority allocation: 45% industrial development, 25% military infrastructure, 20% research facilities, 10% exploration. This maximizes efficiency while maintaining security.', entities: ['automation', 'industrial', 'military', 'research', 'exploration'], actionType: 'management_query' }
          ]
        },
        
        // Market Analysis
        {
          title: 'Quantum Technology Market Trends',
          messages: [
            { role: 'user', content: 'What are the latest trends in quantum technology markets?', entities: ['market_trends', 'quantum_technology'], actionType: 'market_analysis' },
            { role: 'assistant', content: 'Quantum computing components are experiencing unprecedented demand. Quantum processors up 89%, entanglement modules up 156%. Driven by FTL communication development and AI research breakthroughs.', entities: ['quantum_computing', 'quantum_processors', 'entanglement', 'ftl_communication', 'ai_research'], actionType: 'market_analysis' }
          ]
        }
      ];
      
      const messageIds = [];
      let conversationCount = 0;
      
      for (const testConversation of testConversations) {
        conversationCount++;
        
        for (const [index, message] of testConversation.messages.entries()) {
          const context = createContext(campaignId, {
            entities: message.entities,
            actionType: message.actionType,
            gameState: { 
              scenario: testConversation.title,
              messageIndex: index,
              totalMessages: testConversation.messages.length
            }
          });
          
          let messageId;
          if (message.role === 'user') {
            messageId = await captureUserMessage(message.content, context);
          } else {
            messageId = await captureAssistantMessage(message.content, context);
          }
          
          if (messageId) {
            messageIds.push(messageId);
          }
        }
      }
      
      console.log(`✅ Created ${conversationCount} conversations with ${messageIds.length} messages`);
      
      // Wait for background processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      res.json({
        success: true,
        data: {
          conversations: conversationCount,
          messages: messageIds.length,
          messageIds: messageIds.slice(0, 5) // Show first 5 IDs
        },
        message: 'Test data populated successfully. Try searching for "mining profits", "alliance benefits", or "expansion strategy"!'
      });
      
    } catch (error) {
      console.error('Failed to populate test data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to populate test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Demo route: Interactive search examples
  app.get('/demo/search-examples', (req, res) => {
    res.json({
      title: 'Vector Memory Search Examples',
      examples: [
        {
          name: 'Basic Semantic Search',
          endpoint: 'GET /api/memory/search/quick',
          params: { q: 'mining profits', campaignId: 1 },
          description: 'Find all mentions of mining profitability'
        },
        {
          name: 'Entity-Focused Search',
          endpoint: 'POST /api/memory/search/entity',
          body: { query: 'trade opportunities', entity: 'alliance', campaignId: 1 },
          description: 'Search for trade opportunities specifically mentioning alliances'
        },
        {
          name: 'Recent Conversations',
          endpoint: 'POST /api/memory/search/recent',
          body: { query: 'strategic planning', campaignId: 1, hours: 24 },
          description: 'Find strategic planning discussions from the last 24 hours'
        },
        {
          name: 'Advanced Search with Boosts',
          endpoint: 'POST /api/memory/search',
          body: {
            query: 'system expansion and development',
            campaignId: 1,
            boost: {
              entities: { 'expansion': 2.0, 'strategy': 1.5 },
              roles: { 'assistant': 1.2 }
            },
            entities: { include: ['expansion', 'strategy'] },
            limit: 10
          },
          description: 'Complex search with entity boosting and filtering'
        },
        {
          name: 'Search Suggestions',
          endpoint: 'GET /api/memory/search/suggestions',
          params: { campaignId: 1, limit: 5 },
          description: 'Get intelligent search suggestions based on conversation history'
        }
      ]
    });
  });
  
  // Demo game endpoints that automatically capture conversations
  app.post('/api/campaigns/:campaignId/trade/inquiry', async (req, res) => {
    const { campaignId } = req.params;
    const { query, currentSystem, credits, playerShip } = req.body;
    
    // Generate contextual AI response
    const responses = [
      `Based on your location in ${currentSystem || 'your current system'}, I recommend focusing on rare metal extraction. Current market prices show platinum at 8,400 credits/unit and iridium at 12,200 credits/unit.`,
      `With ${credits || 'your available'} credits, consider establishing automated mining platforms in nearby asteroid fields. ROI typically within 18 months for rare earth operations.`,
      `The galactic market is experiencing high demand for quantum materials. ${currentSystem || 'Your system'} has untapped quantum crystal deposits worth investigating.`,
      `Trade route analysis suggests optimal profits through ${currentSystem || 'local'} to Core Worlds shipping. Energy crystals and processed metals show strongest margins.`
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({
      query,
      response,
      gameState: {
        currentSystem: currentSystem || 'Unknown',
        credits: credits || 0,
        timestamp: new Date().toISOString(),
        playerShip: playerShip || 'Unknown'
      },
      entities: ['trade', 'mining', 'profit', 'market_analysis'],
      actionType: 'trade_inquiry'
    });
  });
  
  app.post('/api/campaigns/:campaignId/strategy/plan', async (req, res) => {
    const { campaignId } = req.params;
    const { objectives, currentResources, timeframe, playerLevel } = req.body;
    
    const strategyTypes = [
      'economic_expansion', 'military_buildup', 'diplomatic_outreach', 
      'technological_advancement', 'territorial_expansion'
    ];
    
    const selectedStrategy = strategyTypes[Math.floor(Math.random() * strategyTypes.length)];
    
    const response = `Strategic Analysis for Campaign ${campaignId}: Based on your objectives and available resources, I recommend a ${selectedStrategy.replace('_', ' ')} approach. Phase 1: Consolidation and optimization (6 months), Phase 2: Strategic implementation (12 months), Phase 3: Expansion and growth (ongoing). This plan maximizes your current strengths while addressing key limitations.`;
    
    res.json({
      objectives: objectives || ['expansion', 'profit', 'security'],
      strategyPlan: response,
      strategy: selectedStrategy,
      gameState: {
        resources: currentResources || { credits: 100000, influence: 75 },
        timeframe: timeframe || '18 months',
        playerLevel: playerLevel || 15,
        timestamp: new Date().toISOString()
      },
      entities: ['strategy', 'planning', 'objectives', selectedStrategy],
      actionType: 'strategy_planning'
    });
  });
  
  return app;
}

/**
 * Start the complete demo server
 */
async function startCompleteDemo(port = 5001) {
  try {
    const app = await createCompleteDemo();
    
    const server = app.listen(port, () => {
      console.log('\n🎯 COMPLETE VECTOR MEMORY SYSTEM DEMO');
      console.log('=' .repeat(50));
      console.log(`📡 Server running on http://localhost:${port}`);
      console.log('');
      console.log('🔍 Available Features:');
      console.log('   ✅ Automatic conversation capture & vectorization');
      console.log('   ✅ Advanced semantic search with filtering');
      console.log('   ✅ Entity-based search with boosting');
      console.log('   ✅ Time-range and recency-based search');
      console.log('   ✅ Multi-conversation search & comparison');
      console.log('   ✅ Intelligent search suggestions');
      console.log('   ✅ Batch search operations');
      console.log('   ✅ Real-time conversation analytics');
      console.log('   ✅ Game integration examples');
      console.log('');
      console.log('🚀 Quick Start:');
      console.log(`   1. Visit http://localhost:${port} for API documentation`);
      console.log(`   2. POST http://localhost:${port}/demo/populate-test-data to add sample conversations`);
      console.log(`   3. GET http://localhost:${port}/api/memory/search/quick?q=mining&campaignId=1 to test search`);
      console.log(`   4. POST http://localhost:${port}/api/campaigns/1/trade/inquiry to test auto-capture`);
      console.log('');
      console.log('💡 The system automatically captures and vectorizes all conversations!');
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
    console.error('❌ Failed to start complete demo:', error);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startCompleteDemo();
}

export { createCompleteDemo, startCompleteDemo };
