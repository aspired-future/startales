/**
 * Memory System API Routes
 * 
 * REST API endpoints for the Vector Memory & AI Context System
 * including character memory, civilization memory, conversations, and embeddings.
 */

import express from 'express';
import { witterStorage } from './witterStorage.js';
import { characterVectorMemory } from './characterVectorMemory.js';
import { civilizationVectorMemory } from './civilizationVectorMemory.js';
import { enhancedConversationStorage } from './conversationStorageNew.js';
import { memoryMigrationService } from './migrationService.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Memory & AI Context System
const memoryKnobsData = {
  // Memory Storage & Retrieval
  memory_retention_duration: 0.8,          // Memory retention duration and long-term storage
  memory_retrieval_accuracy: 0.9,          // Memory retrieval accuracy and search precision
  contextual_memory_association: 0.8,      // Contextual memory association and relationship mapping
  
  // Vector Memory & Embeddings
  embedding_quality_optimization: 0.8,     // Embedding quality optimization and semantic accuracy
  vector_similarity_threshold: 0.7,        // Vector similarity threshold and matching sensitivity
  dimensional_space_efficiency: 0.7,       // Dimensional space efficiency and storage optimization
  
  // Character Memory & Personality
  character_memory_depth: 0.8,             // Character memory depth and personality retention
  behavioral_pattern_recognition: 0.8,     // Behavioral pattern recognition and trait analysis
  emotional_memory_integration: 0.7,       // Emotional memory integration and affective context
  
  // Conversation & Context Management
  conversation_context_preservation: 0.9,  // Conversation context preservation and continuity
  dialogue_history_organization: 0.8,      // Dialogue history organization and thread management
  context_window_optimization: 0.8,        // Context window optimization and relevance filtering
  
  // Civilization & Collective Memory
  collective_memory_synthesis: 0.8,        // Collective memory synthesis and cultural knowledge
  historical_event_prioritization: 0.8,    // Historical event prioritization and significance weighting
  cultural_knowledge_preservation: 0.8,    // Cultural knowledge preservation and tradition maintenance
  
  // AI Learning & Adaptation
  adaptive_learning_rate: 0.7,             // Adaptive learning rate and knowledge acquisition speed
  memory_consolidation_efficiency: 0.8,    // Memory consolidation efficiency and information integration
  forgetting_curve_optimization: 0.6,      // Forgetting curve optimization and selective retention
  
  // Privacy & Data Security
  memory_privacy_protection: 0.9,          // Memory privacy protection and data confidentiality
  access_control_granularity: 0.8,         // Access control granularity and permission management
  data_anonymization_strength: 0.8,        // Data anonymization strength and identity protection
  
  // Performance & Scalability
  memory_query_performance: 0.8,           // Memory query performance and response speed
  storage_compression_efficiency: 0.7,     // Storage compression efficiency and space optimization
  concurrent_access_handling: 0.8,         // Concurrent access handling and multi-user support
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Memory
const memoryKnobSystem = new EnhancedKnobSystem(memoryKnobsData);

// Apply memory knobs to game state
function applyMemoryKnobsToGameState() {
  const knobs = memoryKnobSystem.knobs;
  
  // Apply memory storage settings
  const memoryStorage = (knobs.memory_retention_duration + knobs.memory_retrieval_accuracy + 
    knobs.contextual_memory_association) / 3;
  
  // Apply vector memory settings
  const vectorMemory = (knobs.embedding_quality_optimization + knobs.vector_similarity_threshold + 
    knobs.dimensional_space_efficiency) / 3;
  
  // Apply character memory settings
  const characterMemory = (knobs.character_memory_depth + knobs.behavioral_pattern_recognition + 
    knobs.emotional_memory_integration) / 3;
  
  // Apply conversation management settings
  const conversationManagement = (knobs.conversation_context_preservation + knobs.dialogue_history_organization + 
    knobs.context_window_optimization) / 3;
  
  // Apply collective memory settings
  const collectiveMemory = (knobs.collective_memory_synthesis + knobs.historical_event_prioritization + 
    knobs.cultural_knowledge_preservation) / 3;
  
  // Apply privacy settings
  const privacy = (knobs.memory_privacy_protection + knobs.access_control_granularity + 
    knobs.data_anonymization_strength) / 3;
  
  console.log('Applied memory knobs to game state:', {
    memoryStorage,
    vectorMemory,
    characterMemory,
    conversationManagement,
    collectiveMemory,
    privacy
  });
}

// Helper function for async error handling
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ===== CHARACTER MEMORY MANAGEMENT =====

/**
 * GET /api/memory/characters/:characterId - Get character memory
 */
router.get('/characters/:characterId', asyncHandler(async (req: any, res: any) => {
  const { characterId } = req.params;
  const { limit = 50, includeEmbeddings = false } = req.query;

  const memories = await characterVectorMemory.getCharacterMemories(
    characterId,
    Number(limit),
    includeEmbeddings === 'true'
  );

  res.json({
    success: true,
    data: memories,
    characterId,
    count: memories.length
  });
}));

/**
 * POST /api/memory/characters/:characterId - Store character memory
 */
router.post('/characters/:characterId', asyncHandler(async (req: any, res: any) => {
  const { characterId } = req.params;
  const { content, metadata, campaignId } = req.body;

  if (!content || !campaignId) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['content', 'campaignId']
    });
  }

  const memory = await characterVectorMemory.storeCharacterMemory(
    characterId,
    content,
    metadata || {},
    Number(campaignId)
  );

  res.status(201).json({
    success: true,
    data: memory
  });
}));

/**
 * POST /api/memory/characters/:characterId/search - Search character memories
 */
router.post('/characters/:characterId/search', asyncHandler(async (req: any, res: any) => {
  const { characterId } = req.params;
  const { query, limit = 10, threshold = 0.7 } = req.body;

  if (!query) {
    return res.status(400).json({
      error: 'Missing required field: query'
    });
  }

  const results = await characterVectorMemory.searchCharacterMemories(
    characterId,
    query,
    Number(limit),
    Number(threshold)
  );

  res.json({
    success: true,
    data: results,
    query,
    characterId,
    count: results.length
  });
}));

// ===== CIVILIZATION MEMORY MANAGEMENT =====

/**
 * GET /api/memory/civilizations/:civilizationId - Get civilization memory
 */
router.get('/civilizations/:civilizationId', asyncHandler(async (req: any, res: any) => {
  const { civilizationId } = req.params;
  const { limit = 50, category } = req.query;

  const memories = await civilizationVectorMemory.getCivilizationMemories(
    civilizationId,
    Number(limit),
    category
  );

  res.json({
    success: true,
    data: memories,
    civilizationId,
    count: memories.length
  });
}));

/**
 * POST /api/memory/civilizations/:civilizationId - Store civilization memory
 */
router.post('/civilizations/:civilizationId', asyncHandler(async (req: any, res: any) => {
  const { civilizationId } = req.params;
  const { content, category, significance, metadata, campaignId } = req.body;

  if (!content || !campaignId) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['content', 'campaignId']
    });
  }

  const memory = await civilizationVectorMemory.storeCivilizationMemory(
    civilizationId,
    content,
    category || 'general',
    significance || 0.5,
    metadata || {},
    Number(campaignId)
  );

  res.status(201).json({
    success: true,
    data: memory
  });
}));

// ===== CONVERSATION MANAGEMENT =====

/**
 * GET /api/memory/conversations/:conversationId - Get conversation history
 */
router.get('/conversations/:conversationId', asyncHandler(async (req: any, res: any) => {
  const { conversationId } = req.params;
  const { limit = 50, includeContext = true } = req.query;

  const conversation = await enhancedConversationStorage.getConversation(
    conversationId,
    Number(limit),
    includeContext === 'true'
  );

  res.json({
    success: true,
    data: conversation,
    conversationId
  });
}));

/**
 * POST /api/memory/conversations - Create new conversation
 */
router.post('/conversations', asyncHandler(async (req: any, res: any) => {
  const { participants, metadata, campaignId } = req.body;

  if (!participants || !campaignId) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['participants', 'campaignId']
    });
  }

  const conversation = await enhancedConversationStorage.createConversation(
    participants,
    metadata || {},
    Number(campaignId)
  );

  res.status(201).json({
    success: true,
    data: conversation
  });
}));

/**
 * POST /api/memory/conversations/:conversationId/messages - Add message to conversation
 */
router.post('/conversations/:conversationId/messages', asyncHandler(async (req: any, res: any) => {
  const { conversationId } = req.params;
  const { senderId, content, messageType, metadata } = req.body;

  if (!senderId || !content) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['senderId', 'content']
    });
  }

  const message = await enhancedConversationStorage.addMessage(
    conversationId,
    senderId,
    content,
    messageType || 'text',
    metadata || {}
  );

  res.status(201).json({
    success: true,
    data: message
  });
}));

// ===== WITTER MEMORY INTEGRATION =====

/**
 * GET /api/memory/witter/posts - Get witter posts from memory
 */
router.get('/witter/posts', asyncHandler(async (req: any, res: any) => {
  const { campaignId, characterId, limit = 50, offset = 0 } = req.query;

  if (!campaignId) {
    return res.status(400).json({
      error: 'Missing required parameter: campaignId'
    });
  }

  const posts = await witterStorage.getWitterPosts(
    Number(campaignId),
    characterId,
    Number(limit),
    Number(offset)
  );

  res.json({
    success: true,
    data: posts,
    count: posts.length,
    pagination: {
      limit: Number(limit),
      offset: Number(offset)
    }
  });
}));

// ===== MEMORY ANALYTICS & MIGRATION =====

/**
 * GET /api/memory/analytics - Get memory system analytics
 */
router.get('/analytics', asyncHandler(async (req: any, res: any) => {
  const { campaignId } = req.query;

  if (!campaignId) {
    return res.status(400).json({
      error: 'Missing required parameter: campaignId'
    });
  }

  const analytics = await memoryMigrationService.getMemoryAnalytics(Number(campaignId));

  res.json({
    success: true,
    data: analytics,
    campaignId
  });
}));

/**
 * POST /api/memory/migrate - Migrate memory data
 */
router.post('/migrate', asyncHandler(async (req: any, res: any) => {
  const { fromCampaignId, toCampaignId, memoryTypes } = req.body;

  if (!fromCampaignId || !toCampaignId) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['fromCampaignId', 'toCampaignId']
    });
  }

  const result = await memoryMigrationService.migrateMemoryData(
    Number(fromCampaignId),
    Number(toCampaignId),
    memoryTypes || ['character', 'civilization', 'conversation']
  );

  res.json({
    success: true,
    data: result
  });
}));

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'memory', memoryKnobSystem, applyMemoryKnobsToGameState);

export default router;
