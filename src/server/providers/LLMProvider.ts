/**
 * LLM Provider
 * 
 * Simple placeholder for LLM functionality
 */

export interface LLMProvider {
  generateText(prompt: string): Promise<string>;
}

export class SimpleLLMProvider implements LLMProvider {
  async generateText(prompt: string): Promise<string> {
    // Simple placeholder implementation
    return `Generated response for: ${prompt.substring(0, 50)}...`;
  }
}

export const defaultLLMProvider = new SimpleLLMProvider();
