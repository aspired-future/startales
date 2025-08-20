#!/usr/bin/env node

/**
 * Test script for real Provider Adapters
 * Tests actual LLM adapters with the registry
 */

import { AdapterRegistry } from '../src/server/registry/AdapterRegistry.js';
import { OllamaLLMAdapter } from '../src/server/providers/OllamaLLMAdapter.js';
import { OpenAILLMAdapter } from '../src/server/providers/OpenAILLMAdapter.js';
import { AnthropicLLMAdapter } from '../src/server/providers/AnthropicLLMAdapter.js';

async function testRealAdapters() {
  console.log('🧪 Testing Real Provider Adapters...\n');

  try {
    // 1. Create registry
    console.log('1. Creating adapter registry...');
    const registry = new AdapterRegistry();
    console.log('✅ Registry created successfully\n');

    // 2. Register real adapters
    console.log('2. Registering real LLM adapters...');
    
    // Register Ollama adapter (should work without API key for local)
    registry.register('llm', 'ollama', 
      (config, deps) => new OllamaLLMAdapter(config, deps), {
      description: 'Ollama local LLM adapter'
    });
    
    // Register OpenAI adapter (requires API key)
    registry.register('llm', 'openai', 
      (config, deps) => new OpenAILLMAdapter(config, deps), {
      description: 'OpenAI LLM adapter'
    });
    
    // Register Anthropic adapter (requires API key)
    registry.register('llm', 'anthropic', 
      (config, deps) => new AnthropicLLMAdapter(config, deps), {
      description: 'Anthropic Claude LLM adapter'
    });
    
    console.log('✅ Real adapters registered successfully\n');

    // 3. Configure registry to use Ollama as default (most likely to work locally)
    console.log('3. Configuring registry...');
    await registry.updateConfig({
      providers: {
        llm: {
          default: 'ollama'
        }
      },
      providerConfigs: {
        ollama: {
          baseUrl: 'http://localhost:11434'
        },
        openai: {
          apiKeyRef: 'OPENAI_API_KEY'
        },
        anthropic: {
          apiKeyRef: 'ANTHROPIC_API_KEY'
        }
      }
    });
    console.log('✅ Registry configured successfully\n');

    // 4. List available adapters
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
    const llmAdapter = await registry.get('llm', { requestId: 'test-real-001' });
    console.log('✅ LLM adapter retrieved successfully\n');

    // 6. Test adapter capabilities
    console.log('6. Testing adapter capabilities...');
    try {
      const capabilities = await llmAdapter.getCapabilities();
      console.log('✅ Capabilities retrieved:');
      console.log(`   Models: ${capabilities.models.join(', ')}`);
      console.log(`   Cost: $${capabilities.cost.inputPer1K}/1K input, $${capabilities.cost.outputPer1K}/1K output`);
      console.log(`   Context Window: ${capabilities.contextWindow} tokens`);
      console.log(`   Streaming: ${capabilities.streaming}`);
      console.log(`   Notes: ${capabilities.notes}\n`);
    } catch (error) {
      console.log(`⚠️  Capabilities test failed (this is expected if Ollama is not running): ${error.message}\n`);
    }

    // 7. Test adapter functionality (only if capabilities worked)
    console.log('7. Testing adapter chat functionality...');
    try {
      const response = await llmAdapter.chat({
        messages: [{ role: 'user', content: 'Say "Hello from adapter test!" and nothing else.' }],
        maxTokens: 50
      });
      console.log('✅ Chat response received:');
      console.log(`   Response: "${response.text}"`);
      console.log(`   Model: ${response.model}`);
      console.log(`   Finish Reason: ${response.finishReason}\n`);
    } catch (error) {
      console.log(`⚠️  Chat test failed (this is expected if Ollama is not running): ${error.message}\n`);
    }

    // 8. Test different providers if available
    console.log('8. Testing provider switching...');
    
    // Try OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      console.log('   Testing OpenAI adapter...');
      try {
        await registry.updateConfig({
          providers: {
            llm: {
              default: 'openai'
            }
          },
          providerConfigs: {
            openai: {
              apiKeyRef: 'OPENAI_API_KEY'
            }
          }
        });
        
        const openaiAdapter = await registry.get('llm', { requestId: 'test-openai-001' });
        const openaiResponse = await openaiAdapter.chat({
          messages: [{ role: 'user', content: 'Say "Hello from OpenAI!" and nothing else.' }],
          maxTokens: 50
        });
        console.log(`   ✅ OpenAI response: "${openaiResponse.text}"`);
      } catch (error) {
        console.log(`   ⚠️  OpenAI test failed: ${error.message}`);
      }
    } else {
      console.log('   ⚠️  OpenAI API key not found, skipping OpenAI test');
    }

    // Try Anthropic if API key is available
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('   Testing Anthropic adapter...');
      try {
        await registry.updateConfig({
          providers: {
            llm: {
              default: 'anthropic'
            }
          },
          providerConfigs: {
            anthropic: {
              apiKeyRef: 'ANTHROPIC_API_KEY'
            }
          }
        });
        
        const anthropicAdapter = await registry.get('llm', { requestId: 'test-anthropic-001' });
        const anthropicResponse = await anthropicAdapter.chat({
          messages: [{ role: 'user', content: 'Say "Hello from Claude!" and nothing else.' }],
          maxTokens: 50
        });
        console.log(`   ✅ Anthropic response: "${anthropicResponse.text}"`);
      } catch (error) {
        console.log(`   ⚠️  Anthropic test failed: ${error.message}`);
      }
    } else {
      console.log('   ⚠️  Anthropic API key not found, skipping Anthropic test');
    }

    console.log('\n🎉 Real adapter tests completed!');

    console.log('\n📊 Test Summary:');
    console.log('   ✅ Registry creation and configuration');
    console.log('   ✅ Real adapter registration');
    console.log('   ✅ Adapter listing and retrieval');
    console.log('   ⚠️  Capabilities and chat tests depend on service availability');
    console.log('   ⚠️  Provider switching tests depend on API keys');

    console.log('\n💡 Next steps:');
    console.log('   1. Start Ollama locally: `ollama serve`');
    console.log('   2. Pull a model: `ollama pull llama2` or `ollama pull mistral`');
    console.log('   3. Set API keys in .env file for cloud providers');
    console.log('   4. Run tests again to verify full functionality');
    console.log('   5. Implement STT/TTS/Image adapters');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check that all dependencies are installed');
    console.error('   2. Verify TypeScript compilation is working');
    console.error('   3. Ensure all imports are correctly resolved');
    console.error('   4. Check for any missing environment variables');
    console.error('   5. Verify Ollama is running if testing local adapters');
  }
}

testRealAdapters().catch(console.error);
