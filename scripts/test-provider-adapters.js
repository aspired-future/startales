#!/usr/bin/env node

/**
 * Simple test for Provider Adapter Framework
 * Tests the adapter registry and basic functionality
 */

import { AdapterRegistry } from '../src/server/registry/AdapterRegistry.js';

// Mock adapter for testing
class MockLLMAdapter {
  constructor(config, dependencies) {
    this.config = config;
    this.dependencies = dependencies;
  }

  async getCapabilities() {
    return {
      models: ['mock-model'],
      cost: { inputPer1K: 0, outputPer1K: 0, unit: 'tokens' },
      maxTokens: 4096,
      contextWindow: 8192,
      streaming: true,
      languages: ['en'],
      notes: 'Mock adapter for testing'
    };
  }

  async chat(options) {
    return {
      text: `Mock response to: ${options.messages?.[0]?.content || 'test'}`,
      model: 'mock-model',
      finishReason: 'stop'
    };
  }
}

async function testAdapterRegistry() {
  console.log('🧪 Testing Provider Adapter Framework...\n');

  try {
    // 1. Test registry creation
    console.log('1. Creating adapter registry...');
    const registry = new AdapterRegistry();
    console.log('✅ Registry created successfully\n');

    // 2. Test adapter registration
    console.log('2. Registering mock LLM adapter...');
    registry.register('llm', 'mock', 
      (config, deps) => new MockLLMAdapter(config, deps), {
      description: 'Mock LLM adapter for testing'
    });
    console.log('✅ Adapter registered successfully\n');

    // 3. Configure registry to use mock adapter as default
    console.log('3. Configuring registry...');
    await registry.updateConfig({
      providers: {
        llm: {
          default: 'mock'
        }
      },
      providerConfigs: {
        mock: {}
      }
    });
    console.log('✅ Registry configured successfully\n');

    // 4. Test adapter listing
    console.log('4. Listing registered adapters...');
    const adapters = registry.list();
    console.log('✅ Available adapters:');
    for (const [type, typeAdapters] of Object.entries(adapters)) {
      console.log(`   ${type.toUpperCase()}:`);
      for (const adapter of typeAdapters) {
        console.log(`     - ${adapter.id}: ${adapter.description}`);
      }
    }
    console.log();

    // 5. Test adapter retrieval
    console.log('5. Getting LLM adapter...');
    const llmAdapter = await registry.get('llm', { requestId: 'test-001' });
    console.log('✅ LLM adapter retrieved successfully\n');

    // 6. Test adapter capabilities
    console.log('6. Testing adapter capabilities...');
    const capabilities = await llmAdapter.getCapabilities();
    console.log('✅ Capabilities retrieved:');
    console.log(`   Models: ${capabilities.models.join(', ')}`);
    console.log(`   Cost: $${capabilities.cost.inputPer1K}/1K input, $${capabilities.cost.outputPer1K}/1K output`);
    console.log(`   Context Window: ${capabilities.contextWindow} tokens`);
    console.log(`   Streaming: ${capabilities.streaming}`);
    console.log(`   Notes: ${capabilities.notes}\n`);

    // 7. Test adapter functionality
    console.log('7. Testing adapter chat functionality...');
    const response = await llmAdapter.chat({
      messages: [{ role: 'user', content: 'Hello, test adapter!' }]
    });
    console.log('✅ Chat response received:');
    console.log(`   Response: "${response.text}"`);
    console.log(`   Model: ${response.model}`);
    console.log(`   Finish Reason: ${response.finishReason}\n`);

    // 7. Test provider configuration
    console.log('7. Testing provider configuration...');
    registry.setProviderConfig('llm', {
      default: 'mock',
      perCampaign: {},
      perSession: {}
    });
    console.log('✅ Provider configuration set successfully\n');

    // 8. Test context-based resolution
    console.log('8. Testing context-based adapter resolution...');
    const contextAdapter = await registry.get('llm', { 
      requestId: 'test-002',
      campaignId: 'test-campaign'
    });
    console.log('✅ Context-based adapter resolved successfully\n');

    // Summary
    console.log('🎉 All tests passed! Provider Adapter Framework is working correctly.');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Registry creation');
    console.log('   ✅ Adapter registration');
    console.log('   ✅ Adapter listing');
    console.log('   ✅ Adapter retrieval');
    console.log('   ✅ Capability querying');
    console.log('   ✅ Chat functionality');
    console.log('   ✅ Provider configuration');
    console.log('   ✅ Context-based resolution');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Register real adapters (Ollama, OpenAI, etc.)');
    console.log('   2. Test with actual AI models');
    console.log('   3. Implement metrics collection');
    console.log('   4. Add error handling and retry logic');
    console.log('   5. Deploy to production environment');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check that all dependencies are installed');
    console.error('   2. Verify TypeScript compilation is working');
    console.error('   3. Ensure all imports are correctly resolved');
    console.error('   4. Check for any missing environment variables');
    process.exit(1);
  }
}

// Run the test
testAdapterRegistry().catch(console.error);
