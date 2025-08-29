import { semanticSearchService, SemanticSearchQuery } from './semanticSearch';
import { conversationStorage } from './conversationStorage';
import { getProvider } from '../llm/factory';
import { LLMProvider, ModelMessage, CompletionOptions } from '../llm/types';

export interface MemoryContext {
  campaignId: number;
  conversationId?: string;
  currentMessage?: string;
  entities?: string[];
  actionType?: string;
  gameState?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface MemorySearchConfig {
  maxContextMessages?: number;
  timeWindowHours?: number;
  minRelevanceScore?: number;
  includeEntities?: boolean;
  includeGameState?: boolean;
  boostRecency?: boolean;
  excludeCurrentConversation?: boolean;
}

export interface AIContextOptions {
  provider?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  contextConfig?: MemorySearchConfig;
  systemPrompt?: string;
  enhancePrompt?: boolean;
}

export interface MemoryEnhancedResponse {
  response: string;
  contextUsed: {
    messagesFound: number;
    relevantMessages: Array<{
      id: string;
      content: string;
      role: string;
      score: number;
      timestamp: string;
      entities?: string[];
      actionType?: string;
    }>;
    searchQuery: string;
    searchTime: number;
  };
  originalPrompt: string;
  enhancedPrompt: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * AI Context Service
 * Automatically injects relevant conversation memory into AI responses
 */
export class AIContextService {
  private defaultSearchConfig: MemorySearchConfig = {
    maxContextMessages: 8,
    timeWindowHours: 168, // 1 week
    minRelevanceScore: 0.6,
    includeEntities: true,
    includeGameState: true,
    boostRecency: true,
    excludeCurrentConversation: false
  };

  /**
   * Generate memory-enhanced AI response
   */
  async generateWithMemory(
    prompt: string,
    context: MemoryContext,
    options: AIContextOptions = {}
  ): Promise<MemoryEnhancedResponse> {
    
    const startTime = Date.now();
    
    try {
      // Step 1: Retrieve relevant conversation memory
      const contextMessages = await this.retrieveRelevantContext(
        prompt,
        context,
        options.contextConfig
      );
      
      // Step 2: Enhance prompt with memory context
      const enhancedPrompt = await this.enhancePromptWithMemory(
        prompt,
        contextMessages,
        context,
        options
      );
      
      // Step 3: Generate AI response
      const llmProvider = getProvider(options.provider || 'ollama');
      if (!llmProvider) {
        throw new Error(`LLM provider ${options.provider || 'ollama'} not available`);
      }
      
      const messages: ModelMessage[] = [
        {
          role: 'system',
          content: options.systemPrompt || this.getDefaultSystemPrompt(context)
        },
        {
          role: 'user',
          content: enhancedPrompt
        }
      ];
      
      const completionOptions: CompletionOptions = {
        model: options.model,
        maxTokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7
      };
      
      const response = await llmProvider.complete(messages, completionOptions);
      
      const searchTime = Date.now() - startTime;
      
      return {
        response: response.content,
        contextUsed: {
          messagesFound: contextMessages.length,
          relevantMessages: contextMessages.map(msg => ({
            id: msg.id,
            content: msg.payload.content.substring(0, 200) + (msg.payload.content.length > 200 ? '...' : ''),
            role: msg.payload.role,
            score: msg.score,
            timestamp: msg.payload.timestamp,
            entities: msg.payload.entities,
            actionType: msg.payload.actionType
          })),
          searchQuery: prompt,
          searchTime
        },
        originalPrompt: prompt,
        enhancedPrompt,
        usage: {
          promptTokens: this.estimateTokens(enhancedPrompt),
          completionTokens: this.estimateTokens(response.content),
          totalTokens: this.estimateTokens(enhancedPrompt + response.content)
        }
      };
      
    } catch (error) {
      console.error('❌ Memory-enhanced AI generation failed:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant conversation context using semantic search
   */
  private async retrieveRelevantContext(
    prompt: string,
    context: MemoryContext,
    config?: MemorySearchConfig
  ) {
    const searchConfig = { ...this.defaultSearchConfig, ...config };
    
    // Build semantic search query
    const searchQuery: SemanticSearchQuery = {
      query: prompt,
      campaignId: context.campaignId,
      limit: searchConfig.maxContextMessages || 8,
      minScore: searchConfig.minRelevanceScore || 0.6,
      
      // Time filtering
      timeframe: searchConfig.timeWindowHours ? {
        start: new Date(Date.now() - (searchConfig.timeWindowHours * 60 * 60 * 1000)),
        end: new Date()
      } : undefined,
      
      // Entity boosting if entities are provided
      boost: {
        recency: searchConfig.boostRecency ? 0.2 : 0,
        entities: context.entities && searchConfig.includeEntities ? 
          Object.fromEntries(context.entities.map(e => [e, 1.3])) : undefined,
        actionTypes: context.actionType ? 
          { [context.actionType]: 1.2 } : undefined
      },
      
      // Query expansion for better matching
      expandQuery: true,
      synonyms: this.getGameDomainSynonyms()
    };
    
    // Exclude current conversation if requested
    if (searchConfig.excludeCurrentConversation && context.conversationId) {
      // Note: This would require extending the search API to support conversation exclusion
      // For now, we'll filter results after retrieval
    }
    
    const searchResponse = await semanticSearchService.search(searchQuery);
    
    // Filter out current conversation if needed
    let results = searchResponse.results;
    if (searchConfig.excludeCurrentConversation && context.conversationId) {
      // This is a simplified approach - in a full implementation, we'd need conversation-message mapping
      results = results.filter(result => 
        !result.payload.content.includes(context.currentMessage || '')
      );
    }
    
    return results;
  }

  /**
   * Enhance prompt with relevant memory context
   */
  private async enhancePromptWithMemory(
    originalPrompt: string,
    contextMessages: any[],
    context: MemoryContext,
    options: AIContextOptions
  ): Promise<string> {
    
    if (contextMessages.length === 0) {
      return originalPrompt;
    }
    
    // Build context section
    const memoryContext = this.buildMemoryContextSection(contextMessages, context, options.contextConfig);
    
    // Enhance prompt structure
    const enhancedPrompt = `${memoryContext}

CURRENT REQUEST:
${originalPrompt}

Please provide a helpful response that takes into account the relevant conversation history above. Be specific and reference previous discussions when appropriate.`;

    return enhancedPrompt;
  }

  /**
   * Build memory context section for prompt injection
   */
  private buildMemoryContextSection(
    contextMessages: any[],
    context: MemoryContext,
    config?: MemorySearchConfig
  ) {
    
    const searchConfig = { ...this.defaultSearchConfig, ...config };
    
    let contextSection = "RELEVANT CONVERSATION HISTORY:\n";
    contextSection += "The following messages from previous conversations may be relevant to your response:\n\n";
    
    // Group messages by conversation/topic if possible
    const messagesByActionType = new Map<string, any[]>();
    
    for (const message of contextMessages) {
      const actionType = message.payload.actionType || 'general';
      if (!messagesByActionType.has(actionType)) {
        messagesByActionType.set(actionType, []);
      }
      messagesByActionType.get(actionType)!.push(message);
    }
    
    // Build context with grouped messages
    for (const [actionType, messages] of messagesByActionType) {
      if (messages.length > 0) {
        contextSection += `## ${this.formatActionType(actionType)}:\n`;
        
        for (const message of messages.slice(0, 3)) { // Limit per group
          const timestamp = new Date(message.payload.timestamp).toLocaleDateString();
          const role = message.payload.role;
          const content = this.truncateContent(message.payload.content, 150);
          const entities = message.payload.entities?.join(', ') || '';
          
          contextSection += `- [${timestamp}] ${role}: ${content}`;
          if (entities && searchConfig.includeEntities) {
            contextSection += ` (entities: ${entities})`;
          }
          contextSection += `\n`;
        }
        contextSection += `\n`;
      }
    }
    
    // Add game state context if available and requested
    if (context.gameState && searchConfig.includeGameState) {
      contextSection += `CURRENT GAME STATE:\n`;
      contextSection += this.formatGameState(context.gameState);
      contextSection += `\n`;
    }
    
    contextSection += `---\n\n`;
    
    return contextSection;
  }

  /**
   * Get default system prompt for memory-enhanced responses
   */
  private getDefaultSystemPrompt(context: MemoryContext): string {
    return `You are an intelligent assistant for a space empire simulation game. You have access to the player's conversation history and game state to provide contextually relevant advice.

Key guidelines:
- Reference specific details from conversation history when relevant
- Provide actionable advice based on the player's current situation
- Consider the player's past decisions and preferences
- Maintain consistency with previous recommendations unless circumstances have changed
- Focus on entities like: ${context.entities?.join(', ') || 'trade, strategy, diplomacy, resources'}
- Current action context: ${context.actionType || 'general inquiry'}

Be helpful, specific, and memory-aware in your responses.`;
  }

  /**
   * Get game domain synonyms for better semantic matching
   */
  private getGameDomainSynonyms(): Record<string, string[]> {
    return {
      'trade': ['commerce', 'business', 'exchange', 'market'],
      'mining': ['extraction', 'harvesting', 'drilling'],
      'strategy': ['planning', 'tactics', 'approach'],
      'alliance': ['partnership', 'coalition', 'cooperation'],
      'profit': ['revenue', 'earnings', 'income'],
      'system': ['sector', 'region', 'territory'],
      'expansion': ['growth', 'development', 'colonization'],
      'resources': ['materials', 'assets', 'commodities'],
      'military': ['defense', 'fleet', 'forces'],
      'diplomacy': ['relations', 'negotiations', 'politics']
    };
  }

  /**
   * Format action type for display
   */
  private formatActionType(actionType: string): string {
    return actionType
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Format game state for context
   */
  private formatGameState(gameState: Record<string, any>): string {
    const important = ['credits', 'systems', 'influence', 'military', 'resources'];
    const relevantState = Object.entries(gameState)
      .filter(([key]) => important.some(imp => key.toLowerCase().includes(imp)))
      .slice(0, 5); // Limit context size
    
    return relevantState
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  }

  /**
   * Truncate content for context
   */
  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }
    
    return content.substring(0, maxLength - 3) + '...';
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4); // Rough estimate: ~4 chars per token
  }

  /**
   * Quick memory-enhanced response (simplified interface)
   */
  async quickResponseWithMemory(
    prompt: string,
    campaignId: number,
    options: {
      conversationId?: string;
      entities?: string[];
      actionType?: string;
      maxContext?: number;
    } = {}
  ): Promise<string> {
    
    const context: MemoryContext = {
      campaignId,
      conversationId: options.conversationId,
      entities: options.entities,
      actionType: options.actionType
    };
    
    const contextConfig: MemorySearchConfig = {
      maxContextMessages: options.maxContext || 5,
      minRelevanceScore: 0.5,
      boostRecency: true
    };
    
    const response = await this.generateWithMemory(prompt, context, { contextConfig });
    return response.response;
  }

  /**
   * Conversation-aware response (maintains context within a conversation)
   */
  async conversationResponse(
    prompt: string,
    conversationId: string,
    campaignId: number,
    options: AIContextOptions = {}
  ): Promise<MemoryEnhancedResponse> {
    
    // Get recent messages from this specific conversation
    const conversationMessages = await conversationStorage.getMessages({
      conversationId,
      limit: 10
    });
    
    // Extract entities and action types from conversation
    const entities = new Set<string>();
    let lastActionType = '';
    
    for (const msg of conversationMessages) {
      if (msg.entities) {
        msg.entities.forEach(e => entities.add(e));
      }
      if (msg.actionType) {
        lastActionType = msg.actionType;
      }
    }
    
    const context: MemoryContext = {
      campaignId,
      conversationId,
      entities: Array.from(entities),
      actionType: lastActionType || undefined
    };
    
    // Configure to get broader context but boost current conversation
    const contextConfig: MemorySearchConfig = {
      maxContextMessages: 12,
      timeWindowHours: 72, // 3 days
      minRelevanceScore: 0.4,
      boostRecency: true,
      excludeCurrentConversation: false // Include for context continuity
    };
    
    return await this.generateWithMemory(prompt, context, { 
      ...options, 
      contextConfig 
    });
  }

  /**
   * Get memory statistics
   */
  getStats() {
    return {
      service: 'ai_context',
      defaultConfig: this.defaultSearchConfig,
      availableProviders: ['ollama', 'openai'], // Based on bootstrap
      capabilities: [
        'memory_enhanced_responses',
        'context_injection',
        'conversation_continuity',
        'entity_aware_responses',
        'game_state_integration'
      ]
    };
  }
}

// Export singleton instance
export const aiContextService = new AIContextService();
