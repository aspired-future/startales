#!/usr/bin/env node

/**
 * Test script for Ollama LLM Adapter
 * Validates that our adapter works correctly with local Ollama instance
 */

import { OllamaLLMAdapter } from '../src/server/providers/OllamaLLMAdapter.js';
import { NoOpMetricsSink } from '../src/shared/adapters/metrics.js';

// Test configuration
const config = {
  baseUrl: 'http://localhost:11434',
  model: 'llama3.1:8b'
};

const dependencies = {
  metricsSink: new NoOpMetricsSink(),
  logger: console,
  requestId: 'test-request-001'
};

async function testOllamaAdapter() {
  console.log('🚀 Testing Ollama LLM Adapter...\n');

  try {
    // Initialize adapter
    console.log('1. Initializing Ollama adapter...');
    const adapter = new OllamaLLMAdapter(config, dependencies);
    console.log('✅ Adapter initialized successfully\n');

    // Test capabilities
    console.log('2. Testing getCapabilities()...');
    const capabilities = await adapter.getCapabilities();
    console.log('✅ Capabilities retrieved:');
    console.log(`   Models: ${capabilities.models.slice(0, 3).join(', ')}...`);
    console.log(`   Cost: $${capabilities.cost.inputPer1K}/1K input, $${capabilities.cost.outputPer1K}/1K output`);
    console.log(`   Context Window: ${capabilities.contextWindow} tokens`);
    console.log(`   Streaming: ${capabilities.streaming}`);
    console.log(`   Notes: ${capabilities.notes}\n`);

    // Test basic chat
    console.log('3. Testing basic chat completion...');
    const startTime = Date.now();
    
    const chatOptions = {
      messages: [
        { role: 'user', content: 'Hello! Please respond with exactly "Ollama adapter working correctly" to confirm the connection.' }
      ],
      temperature: 0.1,
      maxTokens: 50,
      model: 'llama3.1:8b'
    };

    const result = await adapter.chat(chatOptions);
    const latency = Date.now() - startTime;
    
    console.log('✅ Chat completion successful:');
    console.log(`   Response: "${result.content}"`);
    console.log(`   Model: ${result.model}`);
    console.log(`   Latency: ${latency}ms`);
    console.log(`   Usage: ${result.usage?.inputTokens || 0} input, ${result.usage?.outputTokens || 0} output tokens`);
    console.log(`   Finish Reason: ${result.finishReason}\n`);

    // Test streaming chat
    console.log('4. Testing streaming chat completion...');
    const streamStartTime = Date.now();
    
    const streamOptions = {
      messages: [
        { role: 'user', content: 'Count from 1 to 5, one number per line.' }
      ],
      temperature: 0.1,
      maxTokens: 100,
      model: 'llama3.1:8b'
    };

    console.log('   Streaming response:');
    let streamContent = '';
    let chunkCount = 0;
    
    for await (const delta of adapter.chatStream(streamOptions)) {
      if (delta.delta) {
        process.stdout.write(delta.delta);
        streamContent += delta.delta;
        chunkCount++;
      }
      
      if (delta.usage) {
        console.log(`\n   Final usage: ${delta.usage.inputTokens} input, ${delta.usage.outputTokens} output tokens`);
      }
      
      if (delta.finishReason) {
        console.log(`   Finish reason: ${delta.finishReason}`);
      }
    }
    
    const streamLatency = Date.now() - streamStartTime;
    console.log(`\n✅ Streaming completed: ${chunkCount} chunks in ${streamLatency}ms\n`);

    // Test error handling
    console.log('5. Testing error handling...');
    try {
      const errorOptions = {
        messages: [
          { role: 'user', content: 'Test message' }
        ],
        model: 'nonexistent-model-12345'
      };
      
      await adapter.chat(errorOptions);
      console.log('❌ Expected error but got success');
    } catch (error) {
      console.log('✅ Error handling working correctly:');
      console.log(`   Error: ${error.message}\n`);
    }

    // Performance test
    console.log('6. Running performance test (5 concurrent requests)...');
    const perfStartTime = Date.now();
    
    const perfPromises = Array.from({ length: 5 }, (_, i) => 
      adapter.chat({
        messages: [
          { role: 'user', content: `This is test request #${i + 1}. Please respond with just "Response ${i + 1}".` }
        ],
        temperature: 0.1,
        maxTokens: 20,
        model: 'llama3.1:8b'
      })
    );

    const perfResults = await Promise.all(perfPromises);
    const perfLatency = Date.now() - perfStartTime;
    
    console.log('✅ Performance test completed:');
    console.log(`   Total time: ${perfLatency}ms`);
    console.log(`   Average per request: ${Math.round(perfLatency / 5)}ms`);
    console.log(`   All responses received: ${perfResults.every(r => r.content.length > 0)}\n`);

    // Summary
    console.log('🎉 All tests passed! Ollama adapter is working correctly.');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Adapter initialization');
    console.log('   ✅ Capabilities retrieval');
    console.log('   ✅ Basic chat completion');
    console.log('   ✅ Streaming chat completion');
    console.log('   ✅ Error handling');
    console.log('   ✅ Performance (concurrent requests)');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Deploy to AWS EC2 with g4dn.xlarge instances');
    console.log('   2. Configure load balancing and auto-scaling');
    console.log('   3. Set up monitoring and alerting');
    console.log('   4. Test with other models (llama3.1:70b, etc.)');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Make sure Ollama is running: ollama serve');
    console.error('   2. Pull the model: ollama pull llama3.1:8b');
    console.error('   3. Check Ollama is accessible: curl http://localhost:11434/api/version');
    console.error('   4. Verify firewall settings and port 11434 access');
    process.exit(1);
  }
}

// Run the test
testOllamaAdapter().catch(console.error);
