import { db } from './src/server/storage/db.ts';

async function resetConversationTables() {
  console.log('🗑️ Resetting conversation tables...');
  
  try {
    // Drop existing tables in correct order (due to foreign key constraints)
    console.log('Dropping existing tables...');
    
    await db.query(`
      DROP TABLE IF EXISTS conversation_messages CASCADE
    `);
    
    await db.query(`
      DROP TABLE IF EXISTS conversations CASCADE
    `);
    
    await db.query(`
      DROP TABLE IF EXISTS character_messages CASCADE
    `);
    
    await db.query(`
      DROP TABLE IF EXISTS character_conversations CASCADE
    `);
    
    console.log('✅ Dropped existing tables');
    
    // Now let's create them fresh
    console.log('Creating fresh tables...');
    
    // Create conversations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        title TEXT,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        message_count INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create conversation_messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        message_index INTEGER NOT NULL,
        entities TEXT[],
        action_type TEXT,
        game_state JSONB,
        vector_id UUID,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(conversation_id, message_index)
      )
    `);
    
    // Create character_conversations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS character_conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        character_id TEXT NOT NULL,
        character_name TEXT NOT NULL,
        character_role TEXT NOT NULL,
        character_department TEXT NOT NULL,
        conversation_type TEXT NOT NULL DEFAULT 'individual' CHECK (conversation_type IN ('individual', 'group', 'channel')),
        participants TEXT[] NOT NULL DEFAULT '{}',
        title TEXT,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        message_count INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create character_messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS character_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES character_conversations(id) ON DELETE CASCADE,
        character_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        message_index INTEGER NOT NULL,
        message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'system')),
        entities TEXT[],
        action_type TEXT,
        game_state JSONB,
        vector_id UUID,
        embedding TEXT, -- Store as TEXT for now, can be converted to VECTOR later when extension is available
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(conversation_id, message_index)
      )
    `);
    
    console.log('✅ Created fresh tables');
    
    // Create indexes
    console.log('Creating indexes...');
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_conversations_campaign_status 
      ON conversations(campaign_id, status, last_message_at DESC)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_conversations_last_message 
      ON conversations(last_message_at DESC)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_index 
      ON conversation_messages(conversation_id, message_index)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_character_conversations_character 
      ON character_conversations(character_id, status, last_message_at DESC)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_character_conversations_type 
      ON character_conversations(conversation_type, status, last_message_at DESC)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_character_messages_conversation 
      ON character_messages(conversation_id, message_index)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_character_messages_character 
      ON character_messages(character_id, timestamp DESC)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_character_messages_sender 
      ON character_messages(sender_id, timestamp DESC)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_character_messages_vector 
      ON character_messages(vector_id) WHERE vector_id IS NOT NULL
    `);
    
    console.log('✅ Created indexes');
    
    console.log('🎉 Conversation tables reset successfully!');
    
  } catch (error) {
    console.error('❌ Failed to reset tables:', error);
  } finally {
    await db.pool.end();
  }
}

resetConversationTables();
