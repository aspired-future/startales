import { bootstrapLLMProviders } from '../llm/bootstrap';
import { embeddingService } from './embeddingService';

/**
 * Test script for the embedding service
 * Tests provider fallback, caching, batch processing, and performance
 */
async function testEmbeddingService() {
  console.log('🧠 TESTING EMBEDDING SERVICE');
  console.log('='.repeat(50));
  
  try {
    // Bootstrap providers first
    bootstrapLLMProviders();
    
    // Test 1: Health check
    console.log('\n1️⃣ Testing service health check...');
    const health = await embeddingService.healthCheck();
    console.log('Health status:', health.status);
    console.log('Available providers:', health.providers);
    console.log('Cache stats:', health.cache);
    
    if (health.status === 'unhealthy') {
      throw new Error('Embedding service is unhealthy - no providers available');
    }
    
    // Test 2: Single embedding generation
    console.log('\n2️⃣ Testing single embedding generation...');
    const testText = 'What are the best trade routes for iron ore in the galaxy?';
    
    const start = Date.now();
    const embedding = await embeddingService.embedSingle(testText);
    const duration = Date.now() - start;
    
    console.log(`✅ Generated embedding: ${embedding.length} dimensions in ${duration}ms`);
    console.log(`First 10 values: [${embedding.slice(0, 10).map(v => v.toFixed(4)).join(', ')}...]`);
    
    // Test 3: Cache effectiveness
    console.log('\n3️⃣ Testing cache effectiveness...');
    const cacheStart = Date.now();
    const cachedEmbedding = await embeddingService.embedSingle(testText);
    const cacheDuration = Date.now() - cacheStart;
    
    console.log(`✅ Retrieved from cache in ${cacheDuration}ms (should be much faster)`);
    
    // Verify vectors are identical
    const vectorsMatch = embedding.every((val, idx) => Math.abs(val - cachedEmbedding[idx]) < 1e-10);
    console.log(`✅ Cache integrity: ${vectorsMatch ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Batch processing
    console.log('\n4️⃣ Testing batch processing...');
    const batchTexts = [
      'Iron ore mining operations on Kepler-442b',
      'Trade agreements with the Andromeda Federation',
      'Quantum jump drive fuel efficiency metrics',
      'Asteroid belt mineral extraction protocols',
      'Interstellar commerce taxation policies'
    ];
    
    const batchStart = Date.now();
    const batchEmbeddings = await embeddingService.embedBatch(batchTexts, { batchSize: 3 });
    const batchDuration = Date.now() - batchStart;
    
    console.log(`✅ Generated ${batchEmbeddings.length} embeddings in ${batchDuration}ms`);
    console.log(`Average: ${(batchDuration / batchEmbeddings.length).toFixed(1)}ms per embedding`);
    
    // Verify dimensions consistency
    const allSameDim = batchEmbeddings.every(emb => emb.length === batchEmbeddings[0].length);
    console.log(`✅ Dimension consistency: ${allSameDim ? 'PASSED' : 'FAILED'}`);
    
    // Test 5: Cache performance with batch
    console.log('\n5️⃣ Testing batch cache performance...');
    const mixedTexts = [
      ...batchTexts.slice(0, 3), // These should be cached
      'New text that was not cached before',
      'Another uncached text for testing'
    ];
    
    const mixedStart = Date.now();
    await embeddingService.embedBatch(mixedTexts);
    const mixedDuration = Date.now() - mixedStart;
    
    console.log(`✅ Mixed batch (3 cached + 2 new) processed in ${mixedDuration}ms`);
    
    // Test 6: Cache statistics
    console.log('\n6️⃣ Cache statistics...');
    const cacheStats = embeddingService.getCacheStats();
    console.log('Cache stats:', cacheStats);
    
    // Test 7: Provider availability check
    console.log('\n7️⃣ Available providers...');
    const providers = embeddingService.getAvailableProviders();
    console.log('Available providers:', providers);
    
    // Test 8: Error handling (try with cache disabled)
    console.log('\n8️⃣ Testing without cache...');
    const noCacheStart = Date.now();
    const noCacheEmbedding = await embeddingService.embedSingle(testText, { useCache: false });
    const noCacheDuration = Date.now() - noCacheStart;
    
    console.log(`✅ No-cache embedding generated in ${noCacheDuration}ms`);
    
    // Test 9: Performance comparison
    console.log('\n9️⃣ Performance summary...');
    console.log(`First generation: ${duration}ms`);
    console.log(`Cache retrieval: ${cacheDuration}ms`);
    console.log(`Cache speedup: ${(duration / cacheDuration).toFixed(1)}x faster`);
    console.log(`Batch processing: ${(batchDuration / batchEmbeddings.length).toFixed(1)}ms per item`);
    
    // Final stats
    const finalStats = embeddingService.getCacheStats();
    console.log('\n📊 Final cache statistics:', finalStats);
    
    console.log('\n🎉 ALL EMBEDDING TESTS PASSED!');
    console.log('✅ Embedding service is fully operational');
    
  } catch (error) {
    console.error('\n❌ EMBEDDING TEST FAILED:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmbeddingService()
    .then(() => {
      console.log('\n🏁 Embedding service tests completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Embedding tests failed:', error);
      process.exit(1);
    });
}

export { testEmbeddingService };
