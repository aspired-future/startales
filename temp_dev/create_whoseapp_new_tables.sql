-- WhoseApp Database Schema - New Tables with Different Names
-- Create new tables that don't conflict with existing ones

-- WhoseApp conversations table (separate from existing conversations)
CREATE TABLE IF NOT EXISTS whoseapp_conversations (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500),
  conversation_type VARCHAR(50) NOT NULL DEFAULT 'direct',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- WhoseApp conversation participants table
CREATE TABLE IF NOT EXISTS whoseapp_participants (
  id SERIAL PRIMARY KEY,
  conversation_id VARCHAR(255) NOT NULL REFERENCES whoseapp_conversations(id) ON DELETE CASCADE,
  participant_id VARCHAR(255) NOT NULL,
  participant_type VARCHAR(50) NOT NULL DEFAULT 'character',
  participant_name VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE NULL,
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'member',
  unread_count INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(conversation_id, participant_id)
);

-- WhoseApp messages table
CREATE TABLE IF NOT EXISTS whoseapp_messages (
  id VARCHAR(255) PRIMARY KEY,
  conversation_id VARCHAR(255) NOT NULL REFERENCES whoseapp_conversations(id) ON DELETE CASCADE,
  sender_id VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_type VARCHAR(50) NOT NULL DEFAULT 'character',
  content TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  reply_to_id VARCHAR(255) NULL REFERENCES whoseapp_messages(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'
);

-- WhoseApp channels table
CREATE TABLE IF NOT EXISTS whoseapp_channels (
  id VARCHAR(255) PRIMARY KEY REFERENCES whoseapp_conversations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  channel_type VARCHAR(50) NOT NULL DEFAULT 'general',
  confidentiality_level VARCHAR(50) NOT NULL DEFAULT 'public',
  department_id VARCHAR(255) NULL,
  project_id VARCHAR(255) NULL,
  mission_id VARCHAR(255) NULL,
  cabinet_decision_id VARCHAR(255) NULL,
  max_participants INTEGER DEFAULT NULL,
  auto_archive_hours INTEGER DEFAULT NULL
);

-- WhoseApp message reactions table
CREATE TABLE IF NOT EXISTS whoseapp_reactions (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) NOT NULL REFERENCES whoseapp_messages(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  reaction_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id, reaction_type)
);

-- WhoseApp message attachments table
CREATE TABLE IF NOT EXISTS whoseapp_attachments (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) NOT NULL REFERENCES whoseapp_messages(id) ON DELETE CASCADE,
  filename VARCHAR(500) NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  file_url VARCHAR(1000) NOT NULL,
  thumbnail_url VARCHAR(1000) NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- WhoseApp conversation settings table
CREATE TABLE IF NOT EXISTS whoseapp_settings (
  id SERIAL PRIMARY KEY,
  conversation_id VARCHAR(255) NOT NULL REFERENCES whoseapp_conversations(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  notifications_enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  auto_read_enabled BOOLEAN DEFAULT true,
  custom_name VARCHAR(255) NULL,
  is_muted BOOLEAN DEFAULT false,
  muted_until TIMESTAMP WITH TIME ZONE NULL,
  UNIQUE(conversation_id, user_id)
);

-- Triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_whoseapp_conversations_updated_at ON whoseapp_conversations;
CREATE TRIGGER update_whoseapp_conversations_updated_at
  BEFORE UPDATE ON whoseapp_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_whoseapp_messages_updated_at ON whoseapp_messages;
CREATE TRIGGER update_whoseapp_messages_updated_at
  BEFORE UPDATE ON whoseapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update conversation updated_at when messages are added
CREATE OR REPLACE FUNCTION update_whoseapp_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE whoseapp_conversations 
  SET updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update conversation when message is added
DROP TRIGGER IF EXISTS update_whoseapp_conversation_on_new_message ON whoseapp_messages;
CREATE TRIGGER update_whoseapp_conversation_on_new_message
  AFTER INSERT ON whoseapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_whoseapp_conversation_on_message();

-- Function to increment unread counts
CREATE OR REPLACE FUNCTION increment_whoseapp_unread_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment unread count for all participants except the sender
  UPDATE whoseapp_participants 
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id 
    AND participant_id != NEW.sender_id
    AND is_active = true;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to increment unread counts on new messages
DROP TRIGGER IF EXISTS increment_whoseapp_unread_on_message ON whoseapp_messages;
CREATE TRIGGER increment_whoseapp_unread_on_message
  AFTER INSERT ON whoseapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_whoseapp_unread_counts();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_whoseapp_conversations_type ON whoseapp_conversations(conversation_type);
CREATE INDEX IF NOT EXISTS idx_whoseapp_conversations_created_by ON whoseapp_conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_whoseapp_conversations_updated_at ON whoseapp_conversations(updated_at);
CREATE INDEX IF NOT EXISTS idx_whoseapp_conversations_active ON whoseapp_conversations(is_active);

CREATE INDEX IF NOT EXISTS idx_whoseapp_participants_conversation ON whoseapp_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whoseapp_participants_participant ON whoseapp_participants(participant_id);
CREATE INDEX IF NOT EXISTS idx_whoseapp_participants_active ON whoseapp_participants(is_active);
CREATE INDEX IF NOT EXISTS idx_whoseapp_participants_unread ON whoseapp_participants(unread_count);

CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_conversation ON whoseapp_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_sender ON whoseapp_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_created_at ON whoseapp_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_type ON whoseapp_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_deleted ON whoseapp_messages(is_deleted);
CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_reply_to ON whoseapp_messages(reply_to_id);

CREATE INDEX IF NOT EXISTS idx_whoseapp_channels_name ON whoseapp_channels(name);
CREATE INDEX IF NOT EXISTS idx_whoseapp_channels_type ON whoseapp_channels(channel_type);
CREATE INDEX IF NOT EXISTS idx_whoseapp_channels_confidentiality ON whoseapp_channels(confidentiality_level);

CREATE INDEX IF NOT EXISTS idx_whoseapp_reactions_message ON whoseapp_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_whoseapp_reactions_user ON whoseapp_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_whoseapp_attachments_message ON whoseapp_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_whoseapp_settings_conversation ON whoseapp_settings(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whoseapp_settings_user ON whoseapp_settings(user_id);
