import { Request, Response, NextFunction } from 'express';
import { conversationStorage } from './conversationStorage';
import { embeddingService } from './embeddingService';
import { qdrantClient } from './qdrantClient';

export interface ConversationContext {
  campaignId: number;
  conversationId?: string;
  userId?: string;
  sessionId?: string;
  gameState?: Record<string, any>;
  entities?: string[];
  actionType?: string;
  autoVectorize?: boolean;
}

export interface CapturedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  context: ConversationContext;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

/**
 * Conversation Capture Middleware
 * Automatically captures and processes conversations for the Vector Memory system
 */
export class ConversationCapture {
  private processingQueue: CapturedMessage[] = [];
  private isProcessing = false;
  private batchSize = 5;
  private processingInterval = 2000; // 2 seconds
  
  constructor() {
    // Start background processing
    this.startBackgroundProcessing();
  }

  /**
   * Express middleware factory for capturing conversations
   */
  captureMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Store original response methods
      const originalSend = res.send;
      const originalJson = res.json;

      // Override response methods to capture data (preserve 'this' context)
      const self = this;
      res.send = function(body: any) {
        // Capture the interaction if context is available
        self.captureInteraction(req, body, 'response');
        return originalSend.call(this, body);
      };

      res.json = function(body: any) {
        // Capture the interaction if context is available
        self.captureInteraction(req, body, 'response');
        return originalJson.call(this, body);
      };

      // Capture request data
      this.captureInteraction(req, req.body, 'request');
      
      next();
    };
  }

  /**
   * Manually capture a conversation message
   */
  async captureMessage(message: CapturedMessage): Promise<string | null> {
    try {
      // Validate required context
      if (!message.context.campaignId) {
        console.warn('⚠️ Cannot capture message without campaign ID');
        return null;
      }

      // Ensure we have a conversation ID
      let conversationId = message.context.conversationId;
      if (!conversationId) {
        // Create a new conversation
        const title = this.generateConversationTitle(message);
        conversationId = await conversationStorage.createConversation(
          message.context.campaignId,
          title
        );
        message.context.conversationId = conversationId;
      }

      // Add message to storage
      const messageId = await conversationStorage.addMessage({
        conversationId,
        role: message.role,
        content: message.content,
        entities: message.context.entities,
        actionType: message.context.actionType,
        gameState: message.context.gameState
      });

      // Queue for vectorization if enabled
      if (message.context.autoVectorize !== false) {
        this.queueForVectorization({
          ...message,
          metadata: { ...message.metadata, messageId, conversationId }
        });
      }

      console.log(`📝 Captured ${message.role} message: ${messageId}`);
      return messageId;

    } catch (error) {
      console.error('❌ Failed to capture message:', error);
      return null;
    }
  }

  /**
   * Capture interaction from Express request/response
   */
  private captureInteraction(req: Request, body: any, type: 'request' | 'response'): void {
    try {
      // Extract conversation context from request
      const context = this.extractContext(req);
      if (!context || !context.campaignId) {
        return; // Skip if no valid context
      }

      // Determine message content and role
      const { content, role } = this.extractMessageFromBody(body, type);
      if (!content) {
        return; // Skip if no extractable content
      }

      // Create captured message
      const message: CapturedMessage = {
        role,
        content,
        context,
        timestamp: new Date(),
        metadata: {
          source: 'middleware',
          endpoint: req.path,
          method: req.method,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        }
      };

      // Queue for processing
      this.queueForVectorization(message);

    } catch (error) {
      console.error('❌ Failed to capture interaction:', error);
    }
  }

  /**
   * Extract conversation context from Express request
   */
  private extractContext(req: Request): ConversationContext | null {
    // Try various sources for context
    const context: Partial<ConversationContext> = {};

    // Campaign ID from various sources
    context.campaignId = 
      req.params.campaignId ? parseInt(req.params.campaignId) :
      req.body?.campaignId ? parseInt(req.body.campaignId) :
      req.query?.campaignId ? parseInt(req.query.campaignId as string) :
      req.headers['x-campaign-id'] ? parseInt(req.headers['x-campaign-id'] as string) :
      undefined;

    // Other context fields
    context.conversationId = 
      req.params.conversationId ||
      req.body?.conversationId ||
      req.query?.conversationId as string ||
      req.headers['x-conversation-id'] as string;

    context.userId = 
      req.body?.userId ||
      req.query?.userId as string ||
      req.headers['x-user-id'] as string;

    context.sessionId = 
      req.sessionID ||
      req.body?.sessionId ||
      req.headers['x-session-id'] as string;

    context.entities = 
      req.body?.entities ||
      req.query?.entities ? (req.query.entities as string).split(',') :
      undefined;

    context.actionType = 
      req.body?.actionType ||
      req.query?.actionType as string ||
      this.inferActionType(req.path, req.method);

    context.gameState = req.body?.gameState;

    // Auto-vectorization (default true, can be disabled)
    context.autoVectorize = 
      req.body?.autoVectorize !== false &&
      req.query?.autoVectorize !== 'false' &&
      req.headers['x-auto-vectorize'] !== 'false';

    return context.campaignId ? context as ConversationContext : null;
  }

  /**
   * Extract message content and role from request/response body
   */
  private extractMessageFromBody(body: any, type: 'request' | 'response'): { content: string; role: 'user' | 'assistant' | 'system' } {
    if (!body || typeof body !== 'object') {
      return { content: '', role: 'system' };
    }

    // Direct message extraction
    if (body.content && body.role) {
      return { content: body.content, role: body.role };
    }

    // Common patterns
    if (body.message) {
      return {
        content: typeof body.message === 'string' ? body.message : JSON.stringify(body.message),
        role: type === 'request' ? 'user' : 'assistant'
      };
    }

    if (body.query || body.prompt) {
      return {
        content: body.query || body.prompt,
        role: 'user'
      };
    }

    if (body.response || body.answer) {
      return {
        content: typeof body.response === 'string' ? body.response : body.answer,
        role: 'assistant'
      };
    }

    // Text extraction from various fields
    const textFields = ['text', 'data', 'result', 'output'];
    for (const field of textFields) {
      if (body[field] && typeof body[field] === 'string') {
        return {
          content: body[field],
          role: type === 'request' ? 'user' : 'assistant'
        };
      }
    }

    // Fallback to stringify if contains meaningful content
    if (Object.keys(body).length > 0 && !this.isSystemResponse(body)) {
      return {
        content: JSON.stringify(body, null, 2),
        role: type === 'request' ? 'user' : 'assistant'
      };
    }

    return { content: '', role: 'system' };
  }

  /**
   * Check if response is system/meta response (should not be captured)
   */
  private isSystemResponse(body: any): boolean {
    const systemFields = ['status', 'error', 'success', 'code', 'timestamp', 'meta'];
    const bodyKeys = Object.keys(body);
    
    // If body only contains system fields, it's a system response
    return bodyKeys.length > 0 && bodyKeys.every(key => systemFields.includes(key));
  }

  /**
   * Infer action type from request path and method
   */
  private inferActionType(path: string, method: string): string {
    const pathLower = path.toLowerCase();
    
    if (pathLower.includes('trade')) return 'trade_operation';
    if (pathLower.includes('campaign')) return 'campaign_action';
    if (pathLower.includes('search')) return 'search_query';
    if (pathLower.includes('message')) return 'message_exchange';
    if (pathLower.includes('memory')) return 'memory_operation';
    
    if (method === 'POST') return 'create_action';
    if (method === 'PUT' || method === 'PATCH') return 'update_action';
    if (method === 'DELETE') return 'delete_action';
    if (method === 'GET') return 'query_action';
    
    return 'unknown_action';
  }

  /**
   * Generate conversation title from first message
   */
  private generateConversationTitle(message: CapturedMessage): string {
    const content = message.content;
    const actionType = message.context.actionType;
    
    // Extract first meaningful sentence or phrase
    const firstSentence = content.split(/[.!?]/)[0].trim();
    const shortTitle = firstSentence.length > 60 ? 
      firstSentence.substring(0, 57) + '...' : 
      firstSentence;
    
    // Add action type context if available
    if (actionType && actionType !== 'unknown_action') {
      const actionLabel = actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `${actionLabel}: ${shortTitle}`;
    }
    
    return shortTitle || 'Conversation';
  }

  /**
   * Queue message for background vectorization
   */
  private queueForVectorization(message: CapturedMessage): void {
    this.processingQueue.push(message);
    
    // Trigger immediate processing if queue is getting large
    if (this.processingQueue.length >= this.batchSize && !this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Start background processing of queued messages
   */
  private startBackgroundProcessing(): void {
    setInterval(() => {
      if (this.processingQueue.length > 0 && !this.isProcessing) {
        this.processQueue();
      }
    }, this.processingInterval);
  }

  /**
   * Process queued messages for vectorization
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const batch = this.processingQueue.splice(0, this.batchSize);

    console.log(`🔄 Processing ${batch.length} messages for vectorization...`);

    try {
      for (const message of batch) {
        await this.processMessageVectorization(message);
      }
    } catch (error) {
      console.error('❌ Batch processing failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process individual message vectorization
   */
  private async processMessageVectorization(message: CapturedMessage): Promise<void> {
    try {
      // Skip if already processed or no conversation context
      if (!message.context.conversationId || !message.metadata?.messageId) {
        // Need to capture the message first
        const messageId = await this.captureMessage(message);
        if (!messageId) return;
        
        message.metadata = { ...message.metadata, messageId };
      }

      // Generate embedding
      const embedding = await embeddingService.embedSingle(message.content);

      // Store in vector database
      const vectorData = {
        id: message.metadata!.messageId,
        vector: embedding,
        payload: {
          campaignId: message.context.campaignId,
          timestamp: (message.timestamp || new Date()).toISOString(),
          role: message.role,
          content: message.content,
          entities: message.context.entities || [],
          gameState: message.context.gameState,
          actionType: message.context.actionType
        }
      };

      await qdrantClient.storeConversation(vectorData);

      // Update message with vector ID
      await conversationStorage.updateMessageVectorId(
        message.metadata!.messageId,
        message.metadata!.messageId
      );

      console.log(`🧠 Vectorized message: ${message.metadata!.messageId}`);

    } catch (error) {
      console.error('❌ Failed to vectorize message:', error);
    }
  }

  /**
   * Get processing statistics
   */
  getStats() {
    return {
      queueLength: this.processingQueue.length,
      isProcessing: this.isProcessing,
      batchSize: this.batchSize,
      processingInterval: this.processingInterval
    };
  }

  /**
   * Configure processing parameters
   */
  configure(options: {
    batchSize?: number;
    processingInterval?: number;
  }) {
    if (options.batchSize) this.batchSize = options.batchSize;
    if (options.processingInterval) this.processingInterval = options.processingInterval;
  }
}

// Export singleton instance
export const conversationCapture = new ConversationCapture();

// Export convenience middleware function
export const captureConversations = () => conversationCapture.captureMiddleware();
