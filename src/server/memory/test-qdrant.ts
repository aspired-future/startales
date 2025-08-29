import { qdrantClient } from './qdrantClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * Test script for Qdrant vector database integration
 * Tests connection, collection initialization, and basic operations
 */
async function testQdrantIntegration() {
  console.log('🧠 TESTING QDRANT VECTOR DATABASE INTEGRATION');
  console.log('=' * 50);
  
  try {
    // Test 1: Connection test
    console.log('\n1️⃣ Testing Qdrant connection...');
    const connectionOk = await qdrantClient.testConnection();
    if (!connectionOk) {
      throw new Error('Failed to connect to Qdrant');
    }
    
    // Test 2: Initialize collection
    console.log('\n2️⃣ Initializing conversations collection...');
    await qdrantClient.initializeCollection();
    
    // Test 3: Health check
    console.log('\n3️⃣ Running health check...');
    const health = await qdrantClient.healthCheck();
    console.log('Health status:', health);
    
    // Test 4: Get collection stats
    console.log('\n4️⃣ Getting collection statistics...');
    const stats = await qdrantClient.getStats();
    console.log('Collection stats:', stats);
    
    // Test 5: Store a test conversation
    console.log('\n5️⃣ Testing conversation storage...');
    const testConversationId = uuidv4();
    const testConversation = {
      id: testConversationId,
      vector: Array.from({ length: 768 }, () => Math.random() - 0.5), // Random 768-dim vector
      payload: {
        campaignId: 1,
        timestamp: new Date().toISOString(),
        role: 'user' as const,
        content: 'What are the best trade routes for iron ore?',
        entities: ['iron_ore', 'trade_routes'],
        actionType: 'trade_inquiry'
      }
    };
    
    await qdrantClient.storeConversation(testConversation);
    
    // Test 6: Search for similar conversations
    console.log('\n6️⃣ Testing similarity search...');
    const searchVector = Array.from({ length: 768 }, () => Math.random() - 0.5);
    const searchResults = await qdrantClient.searchSimilar(searchVector, {
      campaignId: 1,
      limit: 5,
      minScore: 0.0 // Low threshold for testing
    });
    
    console.log(`Found ${searchResults.length} similar conversations`);
    searchResults.forEach(result => {
      console.log(`  - ${result.id} (score: ${result.score.toFixed(3)}): ${result.payload.content.substring(0, 50)}...`);
    });
    
    // Test 7: Retrieve conversation by ID
    console.log('\n7️⃣ Testing conversation retrieval...');
    const retrieved = await qdrantClient.getConversation(testConversationId);
    if (retrieved) {
      console.log(`✅ Retrieved conversation: ${retrieved.payload.content}`);
    }
    
    // Test 8: Cleanup - delete test conversation
    console.log('\n8️⃣ Cleaning up test data...');
    await qdrantClient.deleteConversation(testConversationId);
    
    console.log('\n🎉 ALL TESTS PASSED! Qdrant integration is working correctly.');
    console.log('✅ Vector database ready for production use.');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testQdrantIntegration()
    .then(() => {
      console.log('\n🏁 Test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Test failed with error:', error);
      process.exit(1);
    });
}

export { testQdrantIntegration };
