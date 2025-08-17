import { conversationCapture, CapturedMessage, ConversationContext } from './conversationMiddleware.js';

/**
 * Simple helper functions for capturing messages without middleware
 */

/**
 * Capture a user message
 */
export async function captureUserMessage(
  content: string, 
  context: ConversationContext
): Promise<string | null> {
  return await conversationCapture.captureMessage({
    role: 'user',
    content,
    context,
    timestamp: new Date()
  });
}

/**
 * Capture an assistant message
 */
export async function captureAssistantMessage(
  content: string, 
  context: ConversationContext
): Promise<string | null> {
  return await conversationCapture.captureMessage({
    role: 'assistant',
    content,
    context,
    timestamp: new Date()
  });
}

/**
 * Capture a system message
 */
export async function captureSystemMessage(
  content: string, 
  context: ConversationContext
): Promise<string | null> {
  return await conversationCapture.captureMessage({
    role: 'system',
    content,
    context,
    timestamp: new Date()
  });
}

/**
 * Capture a conversation exchange (user query + assistant response)
 */
export async function captureExchange(
  userMessage: string,
  assistantResponse: string,
  context: ConversationContext
): Promise<{ userMessageId: string | null; assistantMessageId: string | null }> {
  
  // Capture user message first
  const userMessageId = await captureUserMessage(userMessage, context);
  
  // Use the same conversation for the assistant response
  if (userMessageId) {
    context = { ...context }; // Keep existing conversation context
  }
  
  // Capture assistant response
  const assistantMessageId = await captureAssistantMessage(assistantResponse, context);
  
  return { userMessageId, assistantMessageId };
}

/**
 * Start a new conversation with title
 */
export async function startConversation(
  campaignId: number,
  title: string,
  firstMessage?: {
    content: string;
    role: 'user' | 'assistant' | 'system';
    entities?: string[];
    actionType?: string;
    gameState?: Record<string, any>;
  }
): Promise<string | null> {
  
  const context: ConversationContext = {
    campaignId,
    autoVectorize: true
  };
  
  if (firstMessage) {
    context.entities = firstMessage.entities;
    context.actionType = firstMessage.actionType;
    context.gameState = firstMessage.gameState;
    
    return await conversationCapture.captureMessage({
      role: firstMessage.role,
      content: firstMessage.content,
      context,
      timestamp: new Date(),
      metadata: { title }
    });
  }
  
  return null;
}

/**
 * Create context from campaign and optional parameters
 */
export function createContext(
  campaignId: number,
  options: {
    conversationId?: string;
    userId?: string;
    sessionId?: string;
    entities?: string[];
    actionType?: string;
    gameState?: Record<string, any>;
    autoVectorize?: boolean;
  } = {}
): ConversationContext {
  return {
    campaignId,
    conversationId: options.conversationId,
    userId: options.userId,
    sessionId: options.sessionId,
    entities: options.entities,
    actionType: options.actionType,
    gameState: options.gameState,
    autoVectorize: options.autoVectorize !== false // Default to true
  };
}

/**
 * Get capture statistics
 */
export function getCaptureStats() {
  return conversationCapture.getStats();
}

/**
 * Configure capture processing
 */
export function configureCaptureProcessing(options: {
  batchSize?: number;
  processingInterval?: number;
}) {
  conversationCapture.configure(options);
}
