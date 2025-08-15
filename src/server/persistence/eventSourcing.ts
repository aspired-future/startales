import { step, CampaignState } from '../sim/engine.js';
import { 
  initDatabase, 
  createCampaign, 
  getCampaign, 
  appendEvent, 
  getEvents, 
  createSnapshot, 
  getLatestSnapshot,
  branchCampaign,
  GameEvent,
  CampaignSnapshot,
  Campaign
} from './database.js';
import crypto from 'crypto';

export interface SavedCampaign {
  id: number;
  name: string;
  seed: string;
  currentSequence: number;
  lastPlayed?: Date;
  status: string;
  canResume: boolean;
}

export interface CampaignBranch {
  id: number;
  name: string;
  parentId: number;
  branchPoint: number;
  createdAt: Date;
}

/**
 * Initialize the event sourcing system
 */
export async function initEventSourcing(): Promise<void> {
  await initDatabase();
  console.log('🎯 Event sourcing system initialized');
}

/**
 * Save a new campaign or save progress to existing campaign
 */
export async function saveCampaign(
  name: string, 
  seed: string, 
  initialState?: CampaignState
): Promise<number> {
  const campaignId = await createCampaign({
    name,
    seed,
    status: 'active'
  });
  
  // If initial state provided, create initial snapshot
  if (initialState) {
    await appendEvent({
      campaignId,
      eventType: 'campaign_created',
      eventData: { initialState }
    });
    
    await createSnapshot({
      campaignId,
      sequenceNumber: 1,
      state: initialState,
      checksum: generateStateChecksum(initialState)
    });
  }
  
  return campaignId;
}

/**
 * Resume a campaign and reconstruct its current state
 */
export async function resumeCampaign(campaignId: number): Promise<CampaignState> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`);
  }
  
  console.log(`📂 Resuming campaign: ${campaign.name} (Sequence: ${campaign.currentSequence})`);
  
  // Get the latest snapshot
  const latestSnapshot = await getLatestSnapshot(campaignId);
  let currentState: CampaignState;
  let fromSequence = 1;
  
  if (latestSnapshot) {
    currentState = latestSnapshot.state;
    fromSequence = latestSnapshot.sequenceNumber + 1;
    console.log(`📸 Loaded snapshot from sequence ${latestSnapshot.sequenceNumber}`);
  } else {
    // No snapshot, start with default state
    currentState = createDefaultState(campaignId, campaign.seed);
    console.log('🆕 No snapshot found, starting with default state');
  }
  
  // Replay events from the snapshot point
  const events = await getEvents(campaignId, fromSequence);
  
  if (events.length > 0) {
    console.log(`⏩ Replaying ${events.length} events from sequence ${fromSequence}`);
    currentState = await replayEvents(currentState, events);
  }
  
  return currentState;
}

/**
 * Execute a simulation step and persist the event
 */
export async function executeStep(
  campaignId: number, 
  seed: string, 
  actions: any[] = []
): Promise<CampaignState> {
  // Get current state
  const currentState = await resumeCampaign(campaignId);
  
  // Execute simulation step
  const newState = await step({
    campaignId,
    seed,
    actions
  });
  
  // Record the simulation step as an event
  await appendEvent({
    campaignId,
    eventType: 'simulation_step',
    eventData: {
      seed,
      actions,
      resultingState: newState,
      step: newState.step
    }
  });
  
  // Create periodic snapshots (every 10 steps)
  if (newState.step % 10 === 0) {
    await createSnapshot({
      campaignId,
      sequenceNumber: (await getCampaign(campaignId))!.currentSequence,
      state: newState,
      checksum: generateStateChecksum(newState)
    });
    console.log(`📸 Auto-snapshot created at step ${newState.step}`);
  }
  
  return newState;
}

/**
 * Branch a campaign from a specific step
 */
export async function branchCampaignFromStep(
  parentCampaignId: number,
  branchName: string,
  fromStep: number
): Promise<number> {
  // Find the sequence number for the given step
  const events = await getEvents(parentCampaignId);
  const targetEvent = events.find(e => 
    e.eventType === 'simulation_step' && 
    e.eventData.step === fromStep
  );
  
  if (!targetEvent) {
    throw new Error(`Step ${fromStep} not found in campaign ${parentCampaignId}`);
  }
  
  const branchCampaignId = await branchCampaign(
    parentCampaignId,
    targetEvent.sequenceNumber,
    branchName
  );
  
  // Copy events up to the branch point
  const eventsToReplay = events.filter(e => e.sequenceNumber <= targetEvent.sequenceNumber);
  
  for (const event of eventsToReplay) {
    await appendEvent({
      campaignId: branchCampaignId,
      eventType: event.eventType,
      eventData: event.eventData
    });
  }
  
  // Create snapshot at branch point
  const branchState = await resumeCampaign(branchCampaignId);
  await createSnapshot({
    campaignId: branchCampaignId,
    sequenceNumber: eventsToReplay.length,
    state: branchState,
    checksum: generateStateChecksum(branchState)
  });
  
  console.log(`🌿 Campaign branched: ${branchName} from step ${fromStep}`);
  return branchCampaignId;
}

/**
 * List all saved campaigns
 */
export async function listCampaigns(): Promise<SavedCampaign[]> {
  const db = await initDatabase();
  
  const rows = await db.all(`
    SELECT 
      id, name, seed, current_sequence, last_played, status,
      CASE WHEN current_sequence > 0 THEN 1 ELSE 0 END as can_resume
    FROM campaigns 
    WHERE status != 'archived'
    ORDER BY last_played DESC, created_at DESC
  `);
  
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    seed: row.seed,
    currentSequence: row.current_sequence,
    lastPlayed: row.last_played ? new Date(row.last_played) : undefined,
    status: row.status,
    canResume: Boolean(row.can_resume)
  }));
}

/**
 * Get campaign branches
 */
export async function getCampaignBranches(campaignId: number): Promise<CampaignBranch[]> {
  const db = await initDatabase();
  
  const rows = await db.all(`
    SELECT id, name, parent_campaign_id, branch_point, created_at
    FROM campaigns 
    WHERE parent_campaign_id = ?
    ORDER BY created_at DESC
  `, [campaignId]);
  
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    parentId: row.parent_campaign_id,
    branchPoint: row.branch_point,
    createdAt: new Date(row.created_at)
  }));
}

/**
 * Replay events to reconstruct state
 */
async function replayEvents(initialState: CampaignState, events: GameEvent[]): Promise<CampaignState> {
  let currentState = { ...initialState };
  
  for (const event of events) {
    switch (event.eventType) {
      case 'simulation_step':
        // For simulation steps, we can use the resulting state directly
        if (event.eventData.resultingState) {
          currentState = event.eventData.resultingState;
        }
        break;
      case 'campaign_created':
        if (event.eventData.initialState) {
          currentState = event.eventData.initialState;
        }
        break;
      // Add more event types as needed
    }
  }
  
  return currentState;
}

/**
 * Create default campaign state
 */
function createDefaultState(campaignId: number, seed: string): CampaignState {
  return {
    id: campaignId,
    step: 0,
    resources: {
      credits: 1000,
      materials: 500,
      energy: 200,
      food: 300
    },
    buildings: {
      factory: 2,
      mine: 1,
      farm: 3,
      power_plant: 1
    },
    queues: [],
    policies: [],
    kpis: {},
    veziesEvents: []
  };
}

/**
 * Generate checksum for state integrity
 */
function generateStateChecksum(state: CampaignState): string {
  return crypto.createHash('sha256').update(JSON.stringify(state)).digest('hex').substring(0, 16);
}
