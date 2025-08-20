/**
 * TypeScript interfaces for the Memory System
 * Includes Witter posts, conversations, and memory collections
 */

// Witter System Types
export interface WitterPost {
  id: string;
  characterId: string;
  authorName: string;
  authorType: 'PERSONALITY' | 'PLAYER' | 'SYSTEM';
  content: string;
  timestamp: Date;
  likes: number;
  shares: number;
  comments: number;
  isLiked: boolean;
  isShared: boolean;
  metadata?: {
    gameContext?: string;
    location?: string;
    category?: string;
    topics?: string[];
    personality?: string;
    [key: string]: any;
  };
  campaignId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WitterComment {
  id: string;
  postId: string;
  characterId: string;
  authorName: string;
  authorType: 'PERSONALITY' | 'PLAYER' | 'SYSTEM';
  avatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: number;
  isLiked: boolean;
  campaignId?: number;
  createdAt: Date;
}

export interface WitterInteraction {
  id: number;
  postId: string;
  characterId: string;
  interactionType: 'like' | 'share' | 'comment' | 'view';
  timestamp: Date;
  metadata?: Record<string, any>;
  campaignId?: number;
  createdAt: Date;
}

// Conversation System Types
export type ConversationType = 'character-player' | 'player-player' | 'alliance' | 'party' | 'system';
export type SenderType = 'player' | 'character' | 'system';

export interface Conversation {
  id: string;
  campaignId: number;
  participantIds: string[];
  conversationType: ConversationType;
  isPrivate: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  content: string;
  timestamp: Date;
  messageIndex: number;
  entities?: string[];
  actionType?: string;
  gameState?: Record<string, any>;
  vectorId?: string;
  isStoredInMemory: boolean;
  campaignId?: number;
  createdAt: Date;
}

// Memory Collection Types
export interface CharacterMemoryCollection {
  id: number;
  characterId: string;
  collectionName: string;
  campaignId?: number;
  memoryCount: number;
  lastUpdated: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface CivilizationMemoryCollection {
  id: number;
  civilizationId: string;
  collectionName: string;
  campaignId?: number;
  memoryCount: number;
  lastUpdated: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Vector Memory Types
export interface CharacterMemoryEntry {
  id: string;
  vector: number[];
  payload: {
    characterId: string;
    campaignId?: number;
    timestamp: string;
    contentType: 'witter_post' | 'conversation' | 'event';
    content: string;
    metadata?: Record<string, any>;
    originalId?: string; // Reference to original post/message ID
  };
}

export interface CivilizationMemoryEntry {
  id: string;
  vector: number[];
  payload: {
    civilizationId: string;
    campaignId?: number;
    timestamp: string;
    contentType: 'leader_speech' | 'intelligence_report' | 'galactic_news' | 'major_event' | 'ai_analysis';
    content: string;
    classification?: 'PUBLIC' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
    metadata?: Record<string, any>;
    originalId?: string;
  };
}

// Privacy and Classification Types
export interface PrivacyRule {
  conversationType: ConversationType;
  isStorable: boolean;
  requiresConsent?: boolean;
  retentionPeriod?: number; // days
  description: string;
}

export interface MemorySearchQuery {
  query: string;
  characterId?: string;
  civilizationId?: string;
  contentType?: string[];
  timeRange?: {
    start?: Date;
    end?: Date;
  };
  limit?: number;
  threshold?: number;
}

export interface MemorySearchResult {
  id: string;
  score: number;
  content: string;
  contentType: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Database Operation Types
export interface CreateWitterPostData {
  id: string;
  characterId: string;
  authorName: string;
  authorType?: 'PERSONALITY' | 'PLAYER' | 'SYSTEM';
  content: string;
  timestamp?: Date;
  likes?: number;
  shares?: number;
  comments?: number;
  isLiked?: boolean;
  isShared?: boolean;
  metadata?: Record<string, any>;
  campaignId?: number;
}

export interface CreateConversationData {
  id: string;
  campaignId: number;
  participantIds: string[];
  conversationType: ConversationType;
  isPrivate?: boolean;
  metadata?: Record<string, any>;
}

export interface CreateMessageData {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  content: string;
  timestamp?: Date;
  messageIndex: number;
  entities?: string[];
  actionType?: string;
  gameState?: Record<string, any>;
  campaignId?: number;
}

// Migration Types
export interface MigrationResult {
  success: boolean;
  postsProcessed: number;
  conversationsProcessed: number;
  vectorsCreated: number;
  errors: string[];
  duration: number;
}

export interface LegacyWittPost {
  id: string;
  authorId: string;
  authorName: string;
  authorType: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  isLiked: boolean;
  isShared: boolean;
  metadata?: Record<string, any>;
}
