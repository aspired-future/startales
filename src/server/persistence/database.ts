import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import crypto from 'crypto';

export interface GameEvent {
  id?: number;
  campaignId: number;
  eventType: string;
  eventData: any;
  timestamp: Date;
  sequenceNumber: number;
  checksum?: string;
}

export interface CampaignSnapshot {
  id?: number;
  campaignId: number;
  sequenceNumber: number;
  state: any;
  timestamp: Date;
  checksum: string;
}

export interface Campaign {
  id?: number;
  name: string;
  seed: string;
  createdAt: Date;
  lastPlayed?: Date;
  currentSequence: number;
  parentCampaignId?: number; // For branching
  branchPoint?: number; // Sequence number where branch occurred
  status: 'active' | 'paused' | 'completed' | 'archived';
}

let db: Database | null = null;

/**
 * Initialize SQLite database with event sourcing schema
 */
export async function initDatabase(dbPath?: string): Promise<Database> {
  if (db) return db;
  
  const databasePath = dbPath || path.join(process.cwd(), 'data', 'campaigns.db');
  
  // Ensure data directory exists
  const fs = await import('fs/promises');
  await fs.mkdir(path.dirname(databasePath), { recursive: true });
  
  db = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });
  
  // Enable WAL mode for better concurrency
  await db.exec('PRAGMA journal_mode = WAL;');
  await db.exec('PRAGMA synchronous = NORMAL;');
  await db.exec('PRAGMA cache_size = 1000;');
  await db.exec('PRAGMA foreign_keys = ON;');
  
  await createTables();
  
  console.log(`📁 Database initialized at: ${databasePath}`);
  return db;
}

/**
 * Create database tables for event sourcing
 */
async function createTables(): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  
  // Campaigns table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      seed TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_played DATETIME,
      current_sequence INTEGER DEFAULT 0,
      parent_campaign_id INTEGER REFERENCES campaigns(id),
      branch_point INTEGER,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
      metadata TEXT DEFAULT '{}'
    )
  `);
  
  // Events table - core of event sourcing
  await db.exec(`
    CREATE TABLE IF NOT EXISTS game_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      event_data TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      sequence_number INTEGER NOT NULL,
      checksum TEXT,
      UNIQUE(campaign_id, sequence_number)
    )
  `);
  
  // Snapshots table - for efficient state reconstruction
  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaign_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      sequence_number INTEGER NOT NULL,
      state TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      checksum TEXT NOT NULL,
      UNIQUE(campaign_id, sequence_number)
    )
  `);
  
  // Create indexes for performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_events_campaign_sequence 
    ON game_events(campaign_id, sequence_number);
  `);
  
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_snapshots_campaign_sequence 
    ON campaign_snapshots(campaign_id, sequence_number DESC);
  `);
  
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_campaigns_status 
    ON campaigns(status, last_played DESC);
  `);
  
  console.log('✅ Database tables created successfully');
}

/**
 * Create a new campaign
 */
export async function createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'currentSequence'>): Promise<number> {
  if (!db) await initDatabase();
  
  const result = await db!.run(`
    INSERT INTO campaigns (name, seed, status, parent_campaign_id, branch_point, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    campaign.name,
    campaign.seed,
    campaign.status || 'active',
    campaign.parentCampaignId || null,
    campaign.branchPoint || null,
    JSON.stringify({})
  ]);
  
  console.log(`📝 Created campaign: ${campaign.name} (ID: ${result.lastID})`);
  return result.lastID!;
}

/**
 * Get campaign by ID
 */
export async function getCampaign(campaignId: number): Promise<Campaign | null> {
  if (!db) await initDatabase();
  
  const row = await db!.get(`
    SELECT * FROM campaigns WHERE id = ?
  `, [campaignId]);
  
  if (!row) return null;
  
  return {
    id: row.id,
    name: row.name,
    seed: row.seed,
    createdAt: new Date(row.created_at),
    lastPlayed: row.last_played ? new Date(row.last_played) : undefined,
    currentSequence: row.current_sequence,
    parentCampaignId: row.parent_campaign_id,
    branchPoint: row.branch_point,
    status: row.status
  };
}

/**
 * Append an event to the campaign's event stream
 */
export async function appendEvent(event: Omit<GameEvent, 'id' | 'timestamp' | 'sequenceNumber'>): Promise<number> {
  if (!db) await initDatabase();
  
  try {
    await db!.run('BEGIN TRANSACTION');
    
    // Get next sequence number
    const sequenceResult = await db!.get(`
      SELECT COALESCE(MAX(sequence_number), 0) + 1 as next_sequence
      FROM game_events WHERE campaign_id = ?
    `, [event.campaignId]);
    
    const sequenceNumber = sequenceResult.next_sequence;
    
    // Insert event
    const result = await db!.run(`
      INSERT INTO game_events (campaign_id, event_type, event_data, sequence_number, checksum)
      VALUES (?, ?, ?, ?, ?)
    `, [
      event.campaignId,
      event.eventType,
      JSON.stringify(event.eventData),
      sequenceNumber,
      generateChecksum(event.eventData)
    ]);
    
    // Update campaign sequence
    await db!.run(`
      UPDATE campaigns 
      SET current_sequence = ?, last_played = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [sequenceNumber, event.campaignId]);
    
    await db!.run('COMMIT');
    
    console.log(`📄 Event appended: ${event.eventType} (Seq: ${sequenceNumber})`);
    return result.lastID!;
  } catch (error) {
    await db!.run('ROLLBACK');
    throw error;
  }
}

/**
 * Get events for a campaign from a specific sequence number
 */
export async function getEvents(campaignId: number, fromSequence: number = 1): Promise<GameEvent[]> {
  if (!db) await initDatabase();
  
  const rows = await db!.all(`
    SELECT * FROM game_events 
    WHERE campaign_id = ? AND sequence_number >= ?
    ORDER BY sequence_number ASC
  `, [campaignId, fromSequence]);
  
  return rows.map(row => ({
    id: row.id,
    campaignId: row.campaign_id,
    eventType: row.event_type,
    eventData: JSON.parse(row.event_data),
    timestamp: new Date(row.timestamp),
    sequenceNumber: row.sequence_number,
    checksum: row.checksum
  }));
}

/**
 * Create a snapshot of campaign state
 */
export async function createSnapshot(snapshot: Omit<CampaignSnapshot, 'id' | 'timestamp'>): Promise<number> {
  if (!db) await initDatabase();
  
  const result = await db!.run(`
    INSERT OR REPLACE INTO campaign_snapshots (campaign_id, sequence_number, state, checksum)
    VALUES (?, ?, ?, ?)
  `, [
    snapshot.campaignId,
    snapshot.sequenceNumber,
    JSON.stringify(snapshot.state),
    snapshot.checksum
  ]);
  
  console.log(`📸 Snapshot created at sequence ${snapshot.sequenceNumber}`);
  return result.lastID!;
}

/**
 * Get the most recent snapshot for a campaign
 */
export async function getLatestSnapshot(campaignId: number): Promise<CampaignSnapshot | null> {
  if (!db) await initDatabase();
  
  const row = await db!.get(`
    SELECT * FROM campaign_snapshots 
    WHERE campaign_id = ?
    ORDER BY sequence_number DESC
    LIMIT 1
  `, [campaignId]);
  
  if (!row) return null;
  
  return {
    id: row.id,
    campaignId: row.campaign_id,
    sequenceNumber: row.sequence_number,
    state: JSON.parse(row.state),
    timestamp: new Date(row.timestamp),
    checksum: row.checksum
  };
}

/**
 * Branch a campaign from a specific point
 */
export async function branchCampaign(
  parentCampaignId: number,
  branchPoint: number,
  newName: string
): Promise<number> {
  const parentCampaign = await getCampaign(parentCampaignId);
  if (!parentCampaign) {
    throw new Error(`Parent campaign ${parentCampaignId} not found`);
  }
  
  const branchCampaignId = await createCampaign({
    name: newName,
    seed: parentCampaign.seed + `-branch-${Date.now()}`,
    status: 'active',
    parentCampaignId,
    branchPoint
  });
  
  console.log(`🌿 Branched campaign: ${newName} from ${parentCampaign.name} at sequence ${branchPoint}`);
  return branchCampaignId;
}

/**
 * Generate checksum for data integrity
 */
function generateChecksum(data: any): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex').substring(0, 16);
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('📁 Database connection closed');
  }
}
