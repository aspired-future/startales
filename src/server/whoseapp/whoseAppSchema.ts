/**
 * WhoseApp Database Schema
 * Tables for real-time messaging, conversations, and character activities
 */

import { Pool } from 'pg';

export async function initializeWhoseAppSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // WhoseApp Conversations - Group chats, channels, direct messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_conversations (
        id VARCHAR(50) PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        conversation_type VARCHAR(20) NOT NULL, -- 'direct', 'group', 'channel'
        title VARCHAR(200),
        description TEXT,
        participants TEXT[] NOT NULL, -- Array of character IDs
        created_by VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_message TEXT,
        last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unread_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // WhoseApp Messages - Individual messages within conversations
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_messages (
        id VARCHAR(50) PRIMARY KEY,
        conversation_id VARCHAR(50) NOT NULL REFERENCES whoseapp_conversations(id) ON DELETE CASCADE,
        sender_id VARCHAR(50) NOT NULL, -- Character ID or 'system'
        content TEXT NOT NULL,
        message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file', 'system', 'action'
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        is_read BOOLEAN DEFAULT false,
        reply_to VARCHAR(50), -- Reference to another message ID
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Character Activities - Real-time activity feed for characters
    await client.query(`
      CREATE TABLE IF NOT EXISTS character_activities (
        id VARCHAR(50) PRIMARY KEY,
        character_id VARCHAR(50) NOT NULL,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        activity_type VARCHAR(30) NOT NULL, -- 'message', 'status_update', 'location_change', 'meeting', 'decision'
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        priority VARCHAR(10) DEFAULT 'low', -- 'low', 'medium', 'high', 'urgent'
        is_public BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // WhoseApp User Preferences - Settings and preferences per civilization
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_preferences (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        notification_settings JSONB DEFAULT '{
          "messages": true,
          "activities": true,
          "status_updates": true,
          "meetings": true,
          "urgent_only": false
        }'::jsonb,
        privacy_settings JSONB DEFAULT '{
          "show_online_status": true,
          "allow_direct_messages": true,
          "show_activity": true
        }'::jsonb,
        display_settings JSONB DEFAULT '{
          "theme": "default",
          "compact_mode": false,
          "show_timestamps": true
        }'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // WhoseApp Channels - Public channels for different topics
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_channels (
        id VARCHAR(50) PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        channel_type VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'official'
        created_by VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        member_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        permissions JSONB DEFAULT '{
          "can_post": ["all"],
          "can_read": ["all"],
          "can_invite": ["moderators", "admins"]
        }'::jsonb,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // WhoseApp Channel Members - Track channel membership
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_channel_members (
        id SERIAL PRIMARY KEY,
        channel_id VARCHAR(50) NOT NULL REFERENCES whoseapp_channels(id) ON DELETE CASCADE,
        character_id VARCHAR(50) NOT NULL,
        role VARCHAR(20) DEFAULT 'member', -- 'member', 'moderator', 'admin'
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_read_message_id VARCHAR(50),
        is_muted BOOLEAN DEFAULT false,
        UNIQUE(channel_id, character_id)
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whoseapp_conversations_civ 
      ON whoseapp_conversations(civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whoseapp_conversations_active 
      ON whoseapp_conversations(civilization_id, is_active, last_message_time DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_conversation 
      ON whoseapp_messages(conversation_id, timestamp DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whoseapp_messages_civ 
      ON whoseapp_messages(civilization_id, timestamp DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_character_activities_civ 
      ON character_activities(civilization_id, timestamp DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_character_activities_char 
      ON character_activities(character_id, timestamp DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whoseapp_channels_civ 
      ON whoseapp_channels(civilization_id, is_active);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whoseapp_channel_members_channel 
      ON whoseapp_channel_members(channel_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whoseapp_channel_members_char 
      ON whoseapp_channel_members(character_id);
    `);

    await client.query('COMMIT');
    console.log('✅ WhoseApp schema initialized successfully');

    // Insert seed data
    await insertWhoseAppSeedData(pool);

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Insert seed data for WhoseApp
 */
async function insertWhoseAppSeedData(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create default channels for each civilization
    const civResult = await client.query('SELECT id FROM civilizations LIMIT 5');
    
    for (const civ of civResult.rows) {
      const civId = civ.id;

      // Create default channels
      const defaultChannels = [
        {
          id: `general-${civId}`,
          name: 'General Discussion',
          description: 'General conversation and updates',
          type: 'public'
        },
        {
          id: `announcements-${civId}`,
          name: 'Official Announcements',
          description: 'Important government announcements and updates',
          type: 'official'
        },
        {
          id: `economy-${civId}`,
          name: 'Economic Affairs',
          description: 'Discussion about economic policies and market updates',
          type: 'public'
        },
        {
          id: `security-${civId}`,
          name: 'Security Briefings',
          description: 'Security updates and defense coordination',
          type: 'private'
        }
      ];

      for (const channel of defaultChannels) {
        await client.query(`
          INSERT INTO whoseapp_channels (
            id, civilization_id, name, description, channel_type, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [
          channel.id,
          civId,
          channel.name,
          channel.description,
          channel.type,
          'system'
        ]);
      }

      // Create default preferences
      await client.query(`
        INSERT INTO whoseapp_preferences (civilization_id)
        VALUES ($1)
        ON CONFLICT DO NOTHING
      `, [civId]);

      // Create some sample activities
      const sampleActivities = [
        {
          id: `activity-welcome-${civId}`,
          character_id: 'system',
          activity_type: 'system',
          content: '🎉 Welcome to WhoseApp! Stay connected with your government officials and fellow citizens.',
          priority: 'medium'
        },
        {
          id: `activity-channels-${civId}`,
          character_id: 'system',
          activity_type: 'system',
          content: '📢 Default communication channels have been set up. Join the conversation!',
          priority: 'low'
        }
      ];

      for (const activity of sampleActivities) {
        await client.query(`
          INSERT INTO character_activities (
            id, character_id, civilization_id, activity_type, content, priority
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [
          activity.id,
          activity.character_id,
          civId,
          activity.activity_type,
          activity.content,
          activity.priority
        ]);
      }
    }

    await client.query('COMMIT');
    console.log('📱 WhoseApp seed data inserted successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ WhoseApp seed data insertion failed:', error);
  } finally {
    client.release();
  }
}
