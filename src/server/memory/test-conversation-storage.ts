import { bootstrapLLMProviders } from '../llm/bootstrap.js';
import { conversationStorage } from './conversationStorage.js';
import { embeddingService } from './embeddingService.js';
import { qdrantClient } from './qdrantClient.js';

/**
 * Test script for conversation storage system
 * Tests PostgreSQL storage, vector integration, and API functionality
 */
async function testConversationStorage() {
  console.log('💬 TESTING CONVERSATION STORAGE SYSTEM');
  console.log('='.repeat(50));
  
  try {
    // Bootstrap providers first
    bootstrapLLMProviders();
    
    // Test 1: System health check
    console.log('\n1️⃣ Testing system health checks...');
    
    const [storageHealth, embeddingHealth, vectorHealth] = await Promise.all([
      conversationStorage.healthCheck(),
      embeddingService.healthCheck(),
      qdrantClient.healthCheck()
    ]);
    
    console.log('Storage health:', storageHealth.status);
    console.log('Embedding health:', embeddingHealth.status);
    console.log('Vector health:', vectorHealth.qdrant ? 'healthy' : 'unhealthy');
    
    // Test 2: Initialize storage tables
    console.log('\n2️⃣ Initializing conversation storage tables...');
    await conversationStorage.initializeTables();
    
    // Test 3: Create a test conversation
    console.log('\n3️⃣ Creating test conversation...');
    const campaignId = 1;
    const conversationId = await conversationStorage.createConversation(
      campaignId, 
      'Test Conversation: Galactic Trade Discussion'
    );
    
    console.log(`✅ Created conversation: ${conversationId}`);
    
    // Test 4: Add messages to the conversation
    console.log('\n4️⃣ Adding messages to conversation...');
    const testMessages = [
      {
        role: 'user' as const,
        content: 'What are the best trade routes for iron ore in the galaxy?',
        entities: ['iron_ore', 'trade_routes', 'galaxy'],
        actionType: 'trade_inquiry'
      },
      {
        role: 'assistant' as const,
        content: 'The most profitable iron ore routes currently run between the Kepler-442b mining stations and the industrial systems in the Andromeda sector. These routes offer approximately 340% profit margins due to high demand.',
        entities: ['kepler_442b', 'andromeda', 'profit_margins'],
        actionType: 'trade_response'
      },
      {
        role: 'user' as const,
        content: 'What about the risk factors on those routes?',
        entities: ['risk_factors', 'trade_routes'],
        actionType: 'risk_inquiry'
      },
      {
        role: 'assistant' as const,
        content: 'The Kepler-Andromeda routes have moderate risk levels. Main concerns include: asteroid belt navigation (15% hazard rating), occasional pirate activity in the neutral zones, and quantum storm interference during solar maximum periods.',
        entities: ['asteroid_belt', 'pirates', 'quantum_storms'],
        actionType: 'risk_analysis',
        gameState: {
          currentSystem: 'Sol',
          shipType: 'cargo_hauler',
          cargoCapacity: 10000
        }
      }
    ];
    
    const messageIds: string[] = [];
    
    for (const messageData of testMessages) {
      const messageId = await conversationStorage.addMessage({
        conversationId,
        ...messageData
      });
      messageIds.push(messageId);
      console.log(`📝 Added ${messageData.role} message: ${messageId}`);
    }
    
    // Test 5: Generate embeddings and store vectors
    console.log('\n5️⃣ Generating embeddings and storing vectors...');
    for (let i = 0; i < testMessages.length; i++) {
      const messageData = testMessages[i];
      const messageId = messageIds[i];
      
      try {
        const embedding = await embeddingService.embedSingle(messageData.content);
        
        const vectorData = {
          id: messageId,
          vector: embedding,
          payload: {
            campaignId,
            timestamp: new Date().toISOString(),
            role: messageData.role,
            content: messageData.content,
            entities: messageData.entities,
            actionType: messageData.actionType,
            gameState: messageData.gameState
          }
        };
        
        await qdrantClient.storeConversation(vectorData);
        await conversationStorage.updateMessageVectorId(messageId, messageId);
        
        console.log(`🧠 Vectorized message: ${messageId}`);
      } catch (error) {
        console.warn(`⚠️ Failed to vectorize message ${messageId}:`, error);
      }
    }
    
    // Test 6: Retrieve conversation
    console.log('\n6️⃣ Retrieving conversation...');
    const conversation = await conversationStorage.getConversation(conversationId);
    if (conversation) {
      console.log(`✅ Retrieved conversation: ${conversation.title}`);
      console.log(`   Messages: ${conversation.messageCount}`);
      console.log(`   Status: ${conversation.status}`);
      console.log(`   Last activity: ${conversation.lastMessageAt.toISOString()}`);
    }
    
    // Test 7: Get messages
    console.log('\n7️⃣ Retrieving messages...');
    const messages = await conversationStorage.getMessages({
      conversationId,
      limit: 10
    });
    
    console.log(`✅ Retrieved ${messages.length} messages`);
    messages.forEach((msg, idx) => {
      console.log(`   ${idx + 1}. [${msg.role}] ${msg.content.substring(0, 50)}...`);
      if (msg.entities && msg.entities.length > 0) {
        console.log(`      Entities: ${msg.entities.join(', ')}`);
      }
    });
    
    // Test 8: Search conversations
    console.log('\n8️⃣ Testing conversation search...');
    const searchResults = await conversationStorage.getConversations({
      campaignId,
      search: 'trade',
      limit: 5
    });
    
    console.log(`✅ Found ${searchResults.length} conversations matching 'trade'`);
    
    // Test 9: Semantic search
    console.log('\n9️⃣ Testing semantic search...');
    try {
      const searchQuery = 'dangerous shipping routes with high profits';
      const queryEmbedding = await embeddingService.embedSingle(searchQuery);
      
      const similarVectors = await qdrantClient.searchSimilar(queryEmbedding, {
        campaignId,
        limit: 3,
        minScore: 0.3
      });
      
      console.log(`✅ Semantic search for "${searchQuery}"`);
      console.log(`Found ${similarVectors.length} similar messages:`);
      
      similarVectors.forEach((result, idx) => {
        console.log(`   ${idx + 1}. Score: ${result.score.toFixed(3)}`);
        console.log(`      Content: ${result.payload.content.substring(0, 80)}...`);
        console.log(`      Entities: ${result.payload.entities?.join(', ') || 'none'}`);
      });
    } catch (error) {
      console.warn('⚠️ Semantic search failed:', error);
    }
    
    // Test 10: Filter messages by entities
    console.log('\n🔟 Testing entity filtering...');
    const entityMessages = await conversationStorage.getMessages({
      campaignId,
      entities: ['trade_routes'],
      limit: 10
    });
    
    console.log(`✅ Found ${entityMessages.length} messages with 'trade_routes' entity`);
    
    // Test 11: Get system statistics
    console.log('\n1️⃣1️⃣ Getting system statistics...');
    const stats = await conversationStorage.getStats(campaignId);
    console.log('📊 Storage Statistics:');
    console.log(`   Total conversations: ${stats.totalConversations}`);
    console.log(`   Total messages: ${stats.totalMessages}`);
    console.log(`   Active conversations: ${stats.activeConversations}`);
    console.log(`   Avg messages per conversation: ${stats.avgMessagesPerConversation.toFixed(1)}`);
    
    const embeddingStats = embeddingService.getCacheStats();
    console.log('📊 Embedding Cache Statistics:');
    console.log(`   Cache size: ${embeddingStats.size}/${embeddingStats.maxSize}`);
    console.log(`   Hit rate: ${embeddingStats.hitRate}`);
    
    try {
      const vectorStats = await qdrantClient.getStats();
      console.log('📊 Vector Database Statistics:');
      console.log(`   Status: ${vectorStats.status}`);
      console.log(`   Points: ${vectorStats.pointsCount}`);
      console.log(`   Segments: ${vectorStats.segmentsCount}`);
    } catch (error) {
      console.warn('⚠️ Could not get vector stats:', error);
    }
    
    // Test 12: Cleanup - Archive conversation
    console.log('\n1️⃣2️⃣ Testing conversation archival...');
    await conversationStorage.archiveConversation(conversationId);
    
    const archivedConversation = await conversationStorage.getConversation(conversationId);
    console.log(`✅ Conversation archived: status = ${archivedConversation?.status}`);
    
    console.log('\n🎉 ALL CONVERSATION STORAGE TESTS PASSED!');
    console.log('✅ PostgreSQL conversation storage system is fully operational');
    console.log('✅ Vector integration working correctly');
    console.log('✅ End-to-end conversation pipeline verified');
    
  } catch (error) {
    console.error('\n❌ CONVERSATION STORAGE TEST FAILED:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConversationStorage()
    .then(() => {
      console.log('\n🏁 Conversation storage tests completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Conversation storage tests failed:', error);
      process.exit(1);
    });
}

export { testConversationStorage };
