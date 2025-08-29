/**
 * LLM Service
 * High-level service for text generation using the LLM provider system
 */

import { getProvider } from '../llm/factory';
import { ModelMessage, CompletionOptions, CompletionResponse } from '../llm/types';

export interface TextGenerationOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  systemPrompt?: string;
}

export class LLMService {
  private defaultProvider: string;
  private defaultModel: string;

  constructor(
    defaultProvider: string = 'openai',
    defaultModel: string = 'gpt-4'
  ) {
    this.defaultProvider = defaultProvider;
    this.defaultModel = defaultModel;
  }

  /**
   * Generate text using the configured LLM provider
   */
  async generateText(
    prompt: string,
    options: TextGenerationOptions = {}
  ): Promise<string> {
    try {
      const provider = getProvider(this.defaultProvider);
      
      const messages: ModelMessage[] = [];
      
      // Add system prompt if provided
      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt
        });
      }
      
      // Add user prompt
      messages.push({
        role: 'user',
        content: prompt
      });

      const completionOptions: CompletionOptions = {
        maxTokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        model: options.model || this.defaultModel
      };

      const response = await provider.complete(messages, completionOptions);
      
      return response.text;

    } catch (error) {
      console.error('LLM text generation failed:', error);
      
      // Return a fallback response instead of throwing
      return this.getFallbackResponse(prompt);
    }
  }

  /**
   * Generate structured analysis using a specific prompt template
   */
  async generateAnalysis(
    analysisType: string,
    data: any,
    template: string,
    options: TextGenerationOptions = {}
  ): Promise<string> {
    const systemPrompt = `You are an expert analyst specializing in ${analysisType}. 
Provide detailed, accurate analysis based on the provided data. 
Format your response according to the specified template.`;

    const prompt = template.replace(/\{\{data\}\}/g, JSON.stringify(data, null, 2));

    return this.generateText(prompt, {
      ...options,
      systemPrompt
    });
  }

  /**
   * Generate narrative text for storytelling
   */
  async generateNarrative(
    context: string,
    style: 'formal' | 'casual' | 'dramatic' | 'technical' = 'formal',
    options: TextGenerationOptions = {}
  ): Promise<string> {
    const stylePrompts = {
      formal: 'Write in a formal, professional tone suitable for official reports.',
      casual: 'Write in a conversational, accessible tone.',
      dramatic: 'Write with engaging, dramatic flair to capture attention.',
      technical: 'Write with precise, technical language for expert audiences.'
    };

    const systemPrompt = `You are a skilled writer creating narrative content. 
${stylePrompts[style]} 
Focus on clarity, accuracy, and engaging storytelling.`;

    return this.generateText(context, {
      ...options,
      systemPrompt,
      temperature: options.temperature || 0.8 // Higher creativity for narratives
    });
  }

  /**
   * Get a fallback response when LLM generation fails
   */
  private getFallbackResponse(prompt: string): string {
    // Analyze prompt to provide contextual fallback
    if (prompt.toLowerCase().includes('sentiment')) {
      return JSON.stringify({
        overallSentiment: 0,
        emotionalBreakdown: {
          joy: 0.2, anger: 0.1, fear: 0.1, sadness: 0.1, surprise: 0.1, trust: 0.3
        },
        topTopics: [],
        influentialPosts: []
      });
    }

    if (prompt.toLowerCase().includes('economic')) {
      return JSON.stringify({
        summary: 'Economic conditions are stable with moderate activity across all sectors.',
        trends: [],
        predictions: ['Continued stable performance expected'],
        concerns: [],
        opportunities: [],
        marketStory: 'Markets are operating within normal parameters.'
      });
    }

    if (prompt.toLowerCase().includes('military')) {
      return JSON.stringify({
        readiness: 'Military forces maintain standard operational readiness.',
        morale: 'Personnel morale is stable and within acceptable ranges.',
        threats: [],
        opportunities: [],
        strategicSituation: 'Strategic situation remains stable with no immediate concerns.',
        recommendations: []
      });
    }

    if (prompt.toLowerCase().includes('diplomatic')) {
      return JSON.stringify({
        relationships: [],
        negotiations: [],
        tensions: [],
        opportunities: [],
        overallStanding: 'Diplomatic relations remain stable across all active channels.'
      });
    }

    if (prompt.toLowerCase().includes('research')) {
      return JSON.stringify({
        breakthroughs: [],
        setbacks: [],
        innovations: [],
        researchClimate: 'Research and development activities continue at normal pace.',
        futureProspects: ['Steady incremental progress expected across all research areas']
      });
    }

    if (prompt.toLowerCase().includes('population') || prompt.toLowerCase().includes('mood')) {
      return JSON.stringify({
        overall: 'content',
        factors: ['Economic stability', 'Social order', 'Effective governance'],
        demographicBreakdown: {}
      });
    }

    // Generic fallback
    return 'Analysis completed. Current conditions are stable with normal operational parameters maintained across all monitored systems.';
  }

  /**
   * Update the default provider and model
   */
  updateDefaults(provider: string, model: string): void {
    this.defaultProvider = provider;
    this.defaultModel = model;
  }

  /**
   * Get current configuration
   */
  getConfiguration(): { provider: string; model: string } {
    return {
      provider: this.defaultProvider,
      model: this.defaultModel
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
