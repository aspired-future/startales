import { registerProvider } from './factory';
import { OllamaProvider } from './providers/ollama';
import { OpenAIProvider } from './providers/openai';

/**
 * Bootstrap LLM providers - registers all available providers
 * Call this once during application startup
 */
export function bootstrapLLMProviders() {
  console.log('🚀 Bootstrapping LLM providers...');
  
  // Register Ollama provider (local)
  try {
    const ollama = new OllamaProvider();
    registerProvider(ollama);
    console.log('✅ Registered Ollama provider');
  } catch (error) {
    console.warn('⚠️ Failed to register Ollama provider:', error);
  }
  
  // Register OpenAI provider (cloud) - only if API key available
  try {
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAIProvider();
      registerProvider(openai);
      console.log('✅ Registered OpenAI provider');
    } else {
      console.log('ℹ️ OpenAI API key not found, skipping OpenAI provider registration');
    }
  } catch (error) {
    console.warn('⚠️ Failed to register OpenAI provider:', error);
  }
  
  console.log('🎯 LLM provider bootstrap completed');
}
