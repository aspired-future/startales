/**
 * WhoseApp Database Schema
 * 
 * Defines the database structure for WhoseApp conversations, messages,
 * channels, and participant management
 */

import { Pool } from 'pg';

export const whoseAppSchema = `
  -- Conversations table
  CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500),
    conversation_type VARCHAR(50) NOT NULL DEFAULT 'direct', -- 'direct', 'group', 'channel'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    
    -- Indexes will be created separately
  );

  -- Conversation participants table
  CREATE TABLE IF NOT EXISTS conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    participant_id VARCHAR(255) NOT NULL, -- user_id or character_id
    participant_type VARCHAR(50) NOT NULL DEFAULT 'character', -- 'user', 'character', 'system'
    participant_name VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE NULL,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(50) DEFAULT 'member', -- 'admin', 'moderator', 'member'
    unread_count INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint to prevent duplicate participants
    UNIQUE(conversation_id, participant_id),
    
    -- Indexes will be created separately
  );

  -- Messages table
  CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_type VARCHAR(50) NOT NULL DEFAULT 'character', -- 'user', 'character', 'system'
    content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'text', -- 'text', 'voice', 'system', 'action'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    reply_to_id VARCHAR(255) NULL REFERENCES messages(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    
    -- Indexes will be created separately
  );

  -- Channels table (extends conversations for channel-specific features)
  CREATE TABLE IF NOT EXISTS channels (
    id VARCHAR(255) PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel_type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'department', 'project', 'emergency', 'cabinet', 'general'
    confidentiality_level VARCHAR(50) NOT NULL DEFAULT 'public', -- 'public', 'restricted', 'classified', 'top_secret'
    department_id VARCHAR(255) NULL,
    project_id VARCHAR(255) NULL,
    mission_id VARCHAR(255) NULL,
    cabinet_decision_id VARCHAR(255) NULL,
    max_participants INTEGER DEFAULT NULL,
    auto_archive_hours INTEGER DEFAULT NULL,
    
    -- Indexes will be created separately
  );

  -- Message reactions table
  CREATE TABLE IF NOT EXISTS message_reactions (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(255) NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    reaction_type VARCHAR(50) NOT NULL, -- 'like', 'dislike', 'laugh', 'angry', 'sad', 'love'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint to prevent duplicate reactions
    UNIQUE(message_id, user_id, reaction_type),
    
    -- Indexes will be created separately
  );

  -- Message attachments table
  CREATE TABLE IF NOT EXISTS message_attachments (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(255) NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes will be created separately
  );

  -- Conversation settings table
  CREATE TABLE IF NOT EXISTS conversation_settings (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    notifications_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    auto_read_enabled BOOLEAN DEFAULT true,
    custom_name VARCHAR(255) NULL,
    is_muted BOOLEAN DEFAULT false,
    muted_until TIMESTAMP WITH TIME ZONE NULL,
    
    -- Unique constraint
    UNIQUE(conversation_id, user_id),
    
    -- Indexes will be created separately
  );

  -- Functions for updating timestamps
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Triggers for auto-updating timestamps
  DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
  CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
  CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  -- Function to update conversation updated_at when messages are added
  CREATE OR REPLACE FUNCTION update_conversation_on_message()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE conversations 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Trigger to update conversation when message is added
  DROP TRIGGER IF EXISTS update_conversation_on_new_message ON messages;
  CREATE TRIGGER update_conversation_on_new_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_on_message();

  -- Function to increment unread counts
  CREATE OR REPLACE FUNCTION increment_unread_counts()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Increment unread count for all participants except the sender
    UPDATE conversation_participants 
    SET unread_count = unread_count + 1
    WHERE conversation_id = NEW.conversation_id 
      AND participant_id != NEW.sender_id
      AND is_active = true;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Trigger to increment unread counts on new messages
  DROP TRIGGER IF EXISTS increment_unread_on_message ON messages;
  CREATE TRIGGER increment_unread_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION increment_unread_counts();

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(conversation_type);
  CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
  CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at);
  CREATE INDEX IF NOT EXISTS idx_conversations_active ON conversations(is_active);
  
  CREATE INDEX IF NOT EXISTS idx_conv_participants_conversation ON conversation_participants(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_conv_participants_participant ON conversation_participants(participant_id);
  CREATE INDEX IF NOT EXISTS idx_conv_participants_active ON conversation_participants(is_active);
  CREATE INDEX IF NOT EXISTS idx_conv_participants_unread ON conversation_participants(unread_count);
  
  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
  CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
  CREATE INDEX IF NOT EXISTS idx_messages_deleted ON messages(is_deleted);
  CREATE INDEX IF NOT EXISTS idx_messages_reply_to ON messages(reply_to_id);
  
  CREATE INDEX IF NOT EXISTS idx_channels_name ON channels(name);
  CREATE INDEX IF NOT EXISTS idx_channels_type ON channels(channel_type);
  CREATE INDEX IF NOT EXISTS idx_channels_confidentiality ON channels(confidentiality_level);
  CREATE INDEX IF NOT EXISTS idx_channels_department ON channels(department_id);
  CREATE INDEX IF NOT EXISTS idx_channels_project ON channels(project_id);
  
  CREATE INDEX IF NOT EXISTS idx_reactions_message ON message_reactions(message_id);
  CREATE INDEX IF NOT EXISTS idx_reactions_user ON message_reactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_reactions_type ON message_reactions(reaction_type);
  
  CREATE INDEX IF NOT EXISTS idx_attachments_message ON message_attachments(message_id);
  CREATE INDEX IF NOT EXISTS idx_attachments_type ON message_attachments(file_type);
  
  CREATE INDEX IF NOT EXISTS idx_conv_settings_conversation ON conversation_settings(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_conv_settings_user ON conversation_settings(user_id);
`;

export async function initializeWhoseAppSchema(pool: Pool): Promise<void> {
  try {
    console.log('🗄️ Initializing WhoseApp database schema...');
    await pool.query(whoseAppSchema);
    console.log('✅ WhoseApp schema initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize WhoseApp schema:', error);
    throw error;
  }
}
