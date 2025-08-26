import { Pool } from 'pg';
import { EventEmitter } from 'events';

export interface ElectionCycle {
  id: string;
  civilizationId: string;
  electionType: 'presidential' | 'legislative' | 'local' | 'referendum';
  scheduledDate: Date;
  termLength: number; // in simulation steps/years
  status: 'scheduled' | 'campaign_active' | 'voting' | 'completed' | 'cancelled';
  
  // Election Configuration
  votingSystem: 'fptp' | 'proportional' | 'mixed' | 'ranked_choice';
  eligibleVoters: number;
  turnoutRate?: number;
  
  // Campaign Period
  campaignStartDate: Date;
  campaignLength: number; // in simulation steps/days
  
  // Results
  results?: ElectionResults;
  
  created_at: Date;
  updated_at: Date;
}

export interface ElectionResults {
  totalVotes: number;
  turnout: number;
  partyResults: PartyElectionResult[];
  winner?: string; // party ID for presidential, coalition for legislative
  coalitionFormed?: string[];
  
  // Detailed breakdown
  demographicBreakdown: {
    [demographic: string]: {
      [partyId: string]: number;
    };
  };
  
  regionalBreakdown: {
    [region: string]: {
      [partyId: string]: number;
    };
  };
}

export interface PartyElectionResult {
  partyId: string;
  partyName: string;
  votes: number;
  percentage: number;
  seats?: number; // for legislative elections
  seatChange?: number; // change from previous election
}

export interface CampaignPromise {
  id: string;
  partyId: string;
  electionId: string;
  category: 'economy' | 'social' | 'security' | 'environment' | 'foreign' | 'governance';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  specificity: number; // 0-100, how specific/measurable the promise is
  popularityBoost: number; // estimated impact on voter support
  
  // Implementation tracking (post-election)
  implemented?: boolean;
  implementationProgress?: number; // 0-100
  voterSatisfaction?: number; // 0-100
}

export interface CampaignActivity {
  id: string;
  partyId: string;
  electionId: string;
  activityType: 'rally' | 'debate' | 'advertisement' | 'door_to_door' | 'social_media' | 'endorsement';
  location?: string;
  targetDemographic?: string;
  cost: number;
  effectiveness: number; // 0-100
  mediaAttention: number; // 0-100
  
  // Content for media coverage
  title: string;
  description: string;
  keyMessages: string[];
  
  scheduledDate: Date;
  completed: boolean;
  
  // Results
  attendees?: number;
  mediaReach?: number;
  supportGained?: number;
}

export interface PollResult {
  id: string;
  electionId: string;
  pollDate: Date;
  sampleSize: number;
  marginOfError: number;
  
  partySupport: {
    [partyId: string]: {
      percentage: number;
      trend: 'rising' | 'falling' | 'stable';
      confidence: number; // 0-100
    };
  };
  
  // Issue polling
  keyIssues: {
    issue: string;
    importance: number; // 0-100
    partyLeader?: string; // which party is trusted most on this issue
  }[];
  
  // Demographic breakdown
  demographicSupport: {
    [demographic: string]: {
      [partyId: string]: number;
    };
  };
}

export class ElectoralEngine extends EventEmitter {
  private pool: Pool;
  private activeElections: Map<string, ElectionCycle> = new Map();
  private campaignPromises: Map<string, CampaignPromise[]> = new Map();
  private campaignActivities: Map<string, CampaignActivity[]> = new Map();
  private pollHistory: Map<string, PollResult[]> = new Map();

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  /**
   * Initialize electoral system for a civilization
   */
  async initializeElectoralSystem(civilizationId: string, constitutionType: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create electoral cycles table
      await client.query(`
        CREATE TABLE IF NOT EXISTS electoral_cycles (
          id VARCHAR(255) PRIMARY KEY,
          civilization_id VARCHAR(255) NOT NULL,
          election_type VARCHAR(50) NOT NULL,
          scheduled_date TIMESTAMP NOT NULL,
          term_length INTEGER NOT NULL,
          status VARCHAR(50) DEFAULT 'scheduled',
          voting_system VARCHAR(50) NOT NULL,
          eligible_voters INTEGER DEFAULT 0,
          turnout_rate DECIMAL(5,2),
          campaign_start_date TIMESTAMP NOT NULL,
          campaign_length INTEGER NOT NULL,
          results JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create campaign promises table
      await client.query(`
        CREATE TABLE IF NOT EXISTS campaign_promises (
          id VARCHAR(255) PRIMARY KEY,
          party_id VARCHAR(255) NOT NULL,
          election_id VARCHAR(255) NOT NULL,
          category VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          priority VARCHAR(20) DEFAULT 'medium',
          specificity INTEGER DEFAULT 50,
          popularity_boost DECIMAL(5,2) DEFAULT 0,
          implemented BOOLEAN DEFAULT FALSE,
          implementation_progress INTEGER DEFAULT 0,
          voter_satisfaction INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (election_id) REFERENCES electoral_cycles(id)
        );
      `);

      // Create campaign activities table
      await client.query(`
        CREATE TABLE IF NOT EXISTS campaign_activities (
          id VARCHAR(255) PRIMARY KEY,
          party_id VARCHAR(255) NOT NULL,
          election_id VARCHAR(255) NOT NULL,
          activity_type VARCHAR(50) NOT NULL,
          location VARCHAR(255),
          target_demographic VARCHAR(100),
          cost DECIMAL(12,2) DEFAULT 0,
          effectiveness INTEGER DEFAULT 50,
          media_attention INTEGER DEFAULT 0,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          key_messages JSONB DEFAULT '[]',
          scheduled_date TIMESTAMP NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          attendees INTEGER DEFAULT 0,
          media_reach INTEGER DEFAULT 0,
          support_gained DECIMAL(5,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (election_id) REFERENCES electoral_cycles(id)
        );
      `);

      // Create polls table
      await client.query(`
        CREATE TABLE IF NOT EXISTS election_polls (
          id VARCHAR(255) PRIMARY KEY,
          election_id VARCHAR(255) NOT NULL,
          poll_date TIMESTAMP NOT NULL,
          sample_size INTEGER NOT NULL,
          margin_of_error DECIMAL(4,2) NOT NULL,
          party_support JSONB NOT NULL,
          key_issues JSONB DEFAULT '[]',
          demographic_support JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (election_id) REFERENCES electoral_cycles(id)
        );
      `);

      // Schedule initial elections based on constitution type
      await this.scheduleInitialElections(civilizationId, constitutionType, client);

      await client.query('COMMIT');
      
      console.log(`✅ Electoral system initialized for civilization ${civilizationId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Schedule initial elections based on government type
   */
  private async scheduleInitialElections(
    civilizationId: string, 
    constitutionType: string, 
    client: any
  ): Promise<void> {
    const now = new Date();
    const elections: Partial<ElectionCycle>[] = [];

    switch (constitutionType) {
      case 'presidential':
        // Presidential election every 4 years
        elections.push({
          civilizationId,
          electionType: 'presidential',
          scheduledDate: new Date(now.getTime() + (4 * 365 * 24 * 60 * 60 * 1000)), // 4 years
          termLength: 4,
          votingSystem: 'fptp',
          campaignStartDate: new Date(now.getTime() + (4 * 365 * 24 * 60 * 60 * 1000) - (90 * 24 * 60 * 60 * 1000)), // 90 days before
          campaignLength: 90
        });
        
        // Legislative elections every 2 years
        elections.push({
          civilizationId,
          electionType: 'legislative',
          scheduledDate: new Date(now.getTime() + (2 * 365 * 24 * 60 * 60 * 1000)), // 2 years
          termLength: 2,
          votingSystem: 'proportional',
          campaignStartDate: new Date(now.getTime() + (2 * 365 * 24 * 60 * 60 * 1000) - (60 * 24 * 60 * 60 * 1000)), // 60 days before
          campaignLength: 60
        });
        break;

      case 'parliamentary':
        // Parliamentary elections every 5 years (or when called)
        elections.push({
          civilizationId,
          electionType: 'legislative',
          scheduledDate: new Date(now.getTime() + (5 * 365 * 24 * 60 * 60 * 1000)), // 5 years
          termLength: 5,
          votingSystem: 'mixed',
          campaignStartDate: new Date(now.getTime() + (5 * 365 * 24 * 60 * 60 * 1000) - (45 * 24 * 60 * 60 * 1000)), // 45 days before
          campaignLength: 45
        });
        break;

      case 'semi_presidential':
        // Both presidential and legislative
        elections.push({
          civilizationId,
          electionType: 'presidential',
          scheduledDate: new Date(now.getTime() + (6 * 365 * 24 * 60 * 60 * 1000)), // 6 years
          termLength: 6,
          votingSystem: 'ranked_choice',
          campaignStartDate: new Date(now.getTime() + (6 * 365 * 24 * 60 * 60 * 1000) - (75 * 24 * 60 * 60 * 1000)),
          campaignLength: 75
        });
        
        elections.push({
          civilizationId,
          electionType: 'legislative',
          scheduledDate: new Date(now.getTime() + (4 * 365 * 24 * 60 * 60 * 1000)), // 4 years
          termLength: 4,
          votingSystem: 'proportional',
          campaignStartDate: new Date(now.getTime() + (4 * 365 * 24 * 60 * 60 * 1000) - (60 * 24 * 60 * 60 * 1000)),
          campaignLength: 60
        });
        break;
    }

    // Insert elections into database
    for (const election of elections) {
      const electionId = `election_${civilizationId}_${election.electionType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await client.query(`
        INSERT INTO electoral_cycles (
          id, civilization_id, election_type, scheduled_date, term_length,
          voting_system, campaign_start_date, campaign_length, eligible_voters
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        electionId,
        election.civilizationId,
        election.electionType,
        election.scheduledDate,
        election.termLength,
        election.votingSystem,
        election.campaignStartDate,
        election.campaignLength,
        100000 // Default eligible voters, should be updated from demographics
      ]);

      // Cache in memory
      this.activeElections.set(electionId, {
        id: electionId,
        status: 'scheduled',
        created_at: now,
        updated_at: now,
        ...election
      } as ElectionCycle);
    }
  }

  /**
   * Process electoral events during simulation tick
   */
  async processElectoralEvents(currentDate: Date): Promise<void> {
    for (const [electionId, election] of this.activeElections) {
      // Check if campaign should start
      if (election.status === 'scheduled' && currentDate >= election.campaignStartDate) {
        await this.startCampaignPeriod(electionId);
      }
      
      // Check if voting should begin
      if (election.status === 'campaign_active' && currentDate >= election.scheduledDate) {
        await this.conductElection(electionId);
      }
      
      // Generate campaign activities and polling during active campaigns
      if (election.status === 'campaign_active') {
        await this.processCampaignActivities(electionId, currentDate);
        await this.generatePollingData(electionId, currentDate);
      }
    }
  }

  /**
   * Start campaign period for an election
   */
  private async startCampaignPeriod(electionId: string): Promise<void> {
    const election = this.activeElections.get(electionId);
    if (!election) return;

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update election status
      await client.query(`
        UPDATE electoral_cycles 
        SET status = 'campaign_active', updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1
      `, [electionId]);

      election.status = 'campaign_active';
      election.updated_at = new Date();

      // Generate initial campaign promises for each party
      await this.generateCampaignPromises(electionId, client);

      // Generate initial polling data
      await this.generateInitialPolling(electionId, client);

      await client.query('COMMIT');

      // Emit event for media coverage
      this.emit('campaignStarted', {
        electionId,
        election,
        timestamp: new Date()
      });

      console.log(`📢 Campaign period started for election ${electionId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Generate campaign promises for all parties
   */
  private async generateCampaignPromises(electionId: string, client: any): Promise<void> {
    const election = this.activeElections.get(electionId);
    if (!election) return;

    // Get all active parties for this civilization
    const partiesResult = await client.query(`
      SELECT id, party_name, ideology, support_percentage 
      FROM political_parties 
      WHERE civilization_id = $1 AND support_percentage > 5
      ORDER BY support_percentage DESC
    `, [election.civilizationId]);

    const promiseCategories = ['economy', 'social', 'security', 'environment', 'foreign', 'governance'];
    const promises: CampaignPromise[] = [];

    for (const party of partiesResult.rows) {
      // Generate 3-5 promises per party
      const numPromises = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numPromises; i++) {
        const category = promiseCategories[Math.floor(Math.random() * promiseCategories.length)];
        const promise = this.generatePromiseForCategory(party, category, electionId);
        promises.push(promise);

        // Insert into database
        await client.query(`
          INSERT INTO campaign_promises (
            id, party_id, election_id, category, title, description,
            priority, specificity, popularity_boost
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          promise.id,
          promise.partyId,
          promise.electionId,
          promise.category,
          promise.title,
          promise.description,
          promise.priority,
          promise.specificity,
          promise.popularityBoost
        ]);
      }
    }

    this.campaignPromises.set(electionId, promises);
  }

  /**
   * Generate a campaign promise for a specific category
   */
  private generatePromiseForCategory(party: any, category: string, electionId: string): CampaignPromise {
    const promiseTemplates = {
      economy: [
        { title: "Economic Growth Initiative", desc: "Implement policies to boost GDP growth by {percent}% over {years} years" },
        { title: "Tax Reform Package", desc: "Reduce taxes for {group} while maintaining essential services" },
        { title: "Infrastructure Investment", desc: "Invest {amount} credits in modernizing transportation and energy infrastructure" }
      ],
      social: [
        { title: "Healthcare Expansion", desc: "Provide universal healthcare coverage for all citizens" },
        { title: "Education Reform", desc: "Increase education funding by {percent}% and reduce class sizes" },
        { title: "Social Safety Net", desc: "Strengthen unemployment benefits and social support programs" }
      ],
      security: [
        { title: "Defense Modernization", desc: "Upgrade military capabilities to ensure galactic security" },
        { title: "Border Security", desc: "Enhance border protection and immigration controls" },
        { title: "Cybersecurity Initiative", desc: "Protect critical infrastructure from cyber threats" }
      ],
      environment: [
        { title: "Clean Energy Transition", desc: "Achieve {percent}% renewable energy by {year}" },
        { title: "Environmental Protection", desc: "Strengthen environmental regulations and conservation efforts" },
        { title: "Climate Action Plan", desc: "Reduce carbon emissions by {percent}% over {years} years" }
      ],
      foreign: [
        { title: "Diplomatic Relations", desc: "Strengthen alliances and improve diplomatic ties" },
        { title: "Trade Agreements", desc: "Negotiate favorable trade deals to boost exports" },
        { title: "Galactic Cooperation", desc: "Lead efforts in galactic peacekeeping and cooperation" }
      ],
      governance: [
        { title: "Government Transparency", desc: "Increase government accountability and reduce corruption" },
        { title: "Democratic Reforms", desc: "Strengthen democratic institutions and citizen participation" },
        { title: "Administrative Efficiency", desc: "Streamline government operations and reduce bureaucracy" }
      ]
    };

    const templates = promiseTemplates[category as keyof typeof promiseTemplates];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Fill in template variables
    let title = template.title;
    let description = template.desc
      .replace('{percent}', (10 + Math.floor(Math.random() * 20)).toString())
      .replace('{years}', (2 + Math.floor(Math.random() * 4)).toString())
      .replace('{amount}', (1000000 + Math.floor(Math.random() * 9000000)).toLocaleString())
      .replace('{group}', ['middle class families', 'small businesses', 'working families'][Math.floor(Math.random() * 3)])
      .replace('{year}', (2030 + Math.floor(Math.random() * 20)).toString());

    return {
      id: `promise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      partyId: party.id,
      electionId,
      category: category as CampaignPromise['category'],
      title,
      description,
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as CampaignPromise['priority'],
      specificity: 30 + Math.floor(Math.random() * 50), // 30-80% specificity
      popularityBoost: -2 + Math.random() * 6 // -2% to +4% popularity impact
    };
  }

  /**
   * Generate initial polling data
   */
  private async generateInitialPolling(electionId: string, client: any): Promise<void> {
    const election = this.activeElections.get(electionId);
    if (!election) return;

    // Get parties and their current support
    const partiesResult = await client.query(`
      SELECT id, party_name, support_percentage 
      FROM political_parties 
      WHERE civilization_id = $1
      ORDER BY support_percentage DESC
    `, [election.civilizationId]);

    const partySupport: { [key: string]: any } = {};
    let totalSupport = 0;

    // Add some randomness to current support levels
    for (const party of partiesResult.rows) {
      const baseSupport = parseFloat(party.support_percentage);
      const variation = (Math.random() - 0.5) * 10; // ±5% variation
      const adjustedSupport = Math.max(0, Math.min(100, baseSupport + variation));
      
      partySupport[party.id] = {
        percentage: adjustedSupport,
        trend: Math.random() > 0.5 ? 'rising' : 'falling',
        confidence: 70 + Math.random() * 25 // 70-95% confidence
      };
      
      totalSupport += adjustedSupport;
    }

    // Normalize to 100%
    for (const partyId in partySupport) {
      partySupport[partyId].percentage = (partySupport[partyId].percentage / totalSupport) * 100;
    }

    const poll: PollResult = {
      id: `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      electionId,
      pollDate: new Date(),
      sampleSize: 1000 + Math.floor(Math.random() * 2000),
      marginOfError: 2.5 + Math.random() * 2, // 2.5-4.5% margin of error
      partySupport,
      keyIssues: [
        { issue: 'Economy', importance: 80 + Math.random() * 20, partyLeader: this.getRandomPartyId(partiesResult.rows) },
        { issue: 'Healthcare', importance: 70 + Math.random() * 20, partyLeader: this.getRandomPartyId(partiesResult.rows) },
        { issue: 'Security', importance: 60 + Math.random() * 20, partyLeader: this.getRandomPartyId(partiesResult.rows) },
        { issue: 'Environment', importance: 50 + Math.random() * 30, partyLeader: this.getRandomPartyId(partiesResult.rows) }
      ],
      demographicSupport: {}
    };

    // Insert poll into database
    await client.query(`
      INSERT INTO election_polls (
        id, election_id, poll_date, sample_size, margin_of_error,
        party_support, key_issues, demographic_support
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      poll.id,
      poll.electionId,
      poll.pollDate,
      poll.sampleSize,
      poll.marginOfError,
      JSON.stringify(poll.partySupport),
      JSON.stringify(poll.keyIssues),
      JSON.stringify(poll.demographicSupport)
    ]);

    // Cache in memory
    if (!this.pollHistory.has(electionId)) {
      this.pollHistory.set(electionId, []);
    }
    this.pollHistory.get(electionId)!.push(poll);

    // Emit event for media coverage
    this.emit('pollReleased', {
      electionId,
      poll,
      timestamp: new Date()
    });
  }

  private getRandomPartyId(parties: any[]): string {
    return parties[Math.floor(Math.random() * parties.length)].id;
  }

  /**
   * Process campaign activities during active campaign
   */
  private async processCampaignActivities(electionId: string, currentDate: Date): Promise<void> {
    // Generate random campaign activities
    if (Math.random() < 0.3) { // 30% chance per tick
      await this.generateCampaignActivity(electionId, currentDate);
    }
  }

  /**
   * Generate polling data during campaign
   */
  private async generatePollingData(electionId: string, currentDate: Date): Promise<void> {
    // Generate new poll every few days
    const lastPoll = this.pollHistory.get(electionId)?.slice(-1)[0];
    if (!lastPoll || (currentDate.getTime() - lastPoll.pollDate.getTime()) > (3 * 24 * 60 * 60 * 1000)) {
      await this.generateUpdatedPolling(electionId, currentDate);
    }
  }

  /**
   * Generate updated polling based on campaign activities
   */
  private async generateUpdatedPolling(electionId: string, currentDate: Date): Promise<void> {
    // Implementation would update party support based on campaign effectiveness
    // This is a simplified version
    const client = await this.pool.connect();
    
    try {
      await this.generateInitialPolling(electionId, client);
    } finally {
      client.release();
    }
  }

  /**
   * Generate a campaign activity
   */
  private async generateCampaignActivity(electionId: string, currentDate: Date): Promise<void> {
    const election = this.activeElections.get(electionId);
    if (!election) return;

    const client = await this.pool.connect();
    
    try {
      // Get random party
      const partiesResult = await client.query(`
        SELECT id, party_name FROM political_parties 
        WHERE civilization_id = $1 
        ORDER BY RANDOM() LIMIT 1
      `, [election.civilizationId]);

      if (partiesResult.rows.length === 0) return;
      
      const party = partiesResult.rows[0];
      const activityTypes = ['rally', 'debate', 'advertisement', 'door_to_door', 'social_media', 'endorsement'];
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];

      const activity: CampaignActivity = {
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        partyId: party.id,
        electionId,
        activityType: activityType as CampaignActivity['activityType'],
        location: this.generateRandomLocation(),
        targetDemographic: this.generateRandomDemographic(),
        cost: 1000 + Math.random() * 50000,
        effectiveness: 30 + Math.random() * 70,
        mediaAttention: Math.random() * 100,
        title: this.generateActivityTitle(activityType, party.party_name),
        description: this.generateActivityDescription(activityType, party.party_name),
        keyMessages: this.generateKeyMessages(),
        scheduledDate: currentDate,
        completed: false,
        attendees: 100 + Math.floor(Math.random() * 5000),
        mediaReach: 1000 + Math.floor(Math.random() * 100000),
        supportGained: -1 + Math.random() * 3 // -1% to +2% support change
      };

      // Insert into database
      await client.query(`
        INSERT INTO campaign_activities (
          id, party_id, election_id, activity_type, location, target_demographic,
          cost, effectiveness, media_attention, title, description, key_messages,
          scheduled_date, completed, attendees, media_reach, support_gained
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        activity.id, activity.partyId, activity.electionId, activity.activityType,
        activity.location, activity.targetDemographic, activity.cost, activity.effectiveness,
        activity.mediaAttention, activity.title, activity.description,
        JSON.stringify(activity.keyMessages), activity.scheduledDate, activity.completed,
        activity.attendees, activity.mediaReach, activity.supportGained
      ]);

      // Cache in memory
      if (!this.campaignActivities.has(electionId)) {
        this.campaignActivities.set(electionId, []);
      }
      this.campaignActivities.get(electionId)!.push(activity);

      // Emit event for media coverage
      this.emit('campaignActivity', {
        electionId,
        activity,
        timestamp: new Date()
      });

    } finally {
      client.release();
    }
  }

  private generateRandomLocation(): string {
    const locations = [
      'Capital City Center', 'University District', 'Industrial Quarter',
      'Suburban Mall', 'Downtown Plaza', 'Community Center',
      'City Hall', 'Convention Center', 'Public Park'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private generateRandomDemographic(): string {
    const demographics = [
      'Young Voters', 'Senior Citizens', 'Working Families',
      'Small Business Owners', 'Students', 'Veterans',
      'Rural Communities', 'Urban Professionals', 'Middle Class'
    ];
    return demographics[Math.floor(Math.random() * demographics.length)];
  }

  private generateActivityTitle(activityType: string, partyName: string): string {
    const titles = {
      rally: `${partyName} Rally for Change`,
      debate: `${partyName} Policy Debate`,
      advertisement: `${partyName} Campaign Advertisement`,
      door_to_door: `${partyName} Community Outreach`,
      social_media: `${partyName} Digital Campaign`,
      endorsement: `${partyName} Endorsement Event`
    };
    return titles[activityType as keyof typeof titles] || `${partyName} Campaign Event`;
  }

  private generateActivityDescription(activityType: string, partyName: string): string {
    const descriptions = {
      rally: `${partyName} holds a public rally to energize supporters and outline key policy positions.`,
      debate: `${partyName} participates in a policy debate addressing key voter concerns.`,
      advertisement: `${partyName} launches a new advertising campaign highlighting their platform.`,
      door_to_door: `${partyName} volunteers engage in door-to-door campaigning in local neighborhoods.`,
      social_media: `${partyName} launches a coordinated social media campaign to reach younger voters.`,
      endorsement: `${partyName} receives endorsements from key community leaders and organizations.`
    };
    return descriptions[activityType as keyof typeof descriptions] || `${partyName} conducts campaign activities.`;
  }

  private generateKeyMessages(): string[] {
    const messages = [
      'Economic prosperity for all citizens',
      'Stronger security and defense',
      'Investment in education and healthcare',
      'Environmental protection and sustainability',
      'Government transparency and accountability',
      'Support for working families',
      'Innovation and technological advancement',
      'Social justice and equality'
    ];
    
    // Return 2-4 random messages
    const numMessages = 2 + Math.floor(Math.random() * 3);
    const selectedMessages = [];
    const usedIndices = new Set();
    
    while (selectedMessages.length < numMessages && selectedMessages.length < messages.length) {
      const index = Math.floor(Math.random() * messages.length);
      if (!usedIndices.has(index)) {
        usedIndices.add(index);
        selectedMessages.push(messages[index]);
      }
    }
    
    return selectedMessages;
  }

  /**
   * Conduct election and calculate results
   */
  private async conductElection(electionId: string): Promise<void> {
    const election = this.activeElections.get(electionId);
    if (!election) return;

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Calculate election results based on polling and campaign effectiveness
      const results = await this.calculateElectionResults(electionId);

      // Update election with results
      await client.query(`
        UPDATE electoral_cycles 
        SET status = 'completed', results = $1, turnout_rate = $2, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3
      `, [JSON.stringify(results), results.turnout, electionId]);

      // Update party support percentages based on results
      for (const partyResult of results.partyResults) {
        await client.query(`
          UPDATE political_parties 
          SET support_percentage = $1, updated_at = CURRENT_TIMESTAMP 
          WHERE id = $2
        `, [partyResult.percentage, partyResult.partyId]);
      }

      election.status = 'completed';
      election.results = results;
      election.turnoutRate = results.turnout;
      election.updated_at = new Date();

      // Schedule next election
      await this.scheduleNextElection(election, client);

      await client.query('COMMIT');

      // Emit event for media coverage
      this.emit('electionCompleted', {
        electionId,
        election,
        results,
        timestamp: new Date()
      });

      console.log(`🗳️ Election completed: ${electionId}, Winner: ${results.winner}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Calculate election results
   */
  private async calculateElectionResults(electionId: string): Promise<ElectionResults> {
    const election = this.activeElections.get(electionId)!;
    const latestPoll = this.pollHistory.get(electionId)?.slice(-1)[0];
    
    if (!latestPoll) {
      throw new Error(`No polling data available for election ${electionId}`);
    }

    const totalVotes = Math.floor(election.eligibleVoters * (0.6 + Math.random() * 0.3)); // 60-90% turnout
    const turnout = (totalVotes / election.eligibleVoters) * 100;

    const partyResults: PartyElectionResult[] = [];
    let totalPercentage = 0;

    // Convert polling percentages to vote counts with some variation
    for (const [partyId, support] of Object.entries(latestPoll.partySupport)) {
      const variation = (Math.random() - 0.5) * 6; // ±3% variation from polls
      const actualPercentage = Math.max(0, support.percentage + variation);
      const votes = Math.floor((actualPercentage / 100) * totalVotes);

      // Get party name
      const client = await this.pool.connect();
      try {
        const partyResult = await client.query('SELECT party_name FROM political_parties WHERE id = $1', [partyId]);
        const partyName = partyResult.rows[0]?.party_name || 'Unknown Party';

        partyResults.push({
          partyId,
          partyName,
          votes,
          percentage: actualPercentage,
          seats: election.electionType === 'legislative' ? Math.floor((actualPercentage / 100) * 100) : undefined // Assume 100 total seats
        });

        totalPercentage += actualPercentage;
      } finally {
        client.release();
      }
    }

    // Normalize percentages to 100%
    for (const result of partyResults) {
      result.percentage = (result.percentage / totalPercentage) * 100;
      result.votes = Math.floor((result.percentage / 100) * totalVotes);
    }

    // Sort by percentage
    partyResults.sort((a, b) => b.percentage - a.percentage);

    // Determine winner
    let winner: string | undefined;
    let coalitionFormed: string[] | undefined;

    if (election.electionType === 'presidential') {
      winner = partyResults[0].partyId;
    } else if (election.electionType === 'legislative') {
      if (partyResults[0].percentage > 50) {
        winner = partyResults[0].partyId;
      } else {
        // Form coalition
        coalitionFormed = [partyResults[0].partyId, partyResults[1].partyId];
        winner = 'coalition';
      }
    }

    return {
      totalVotes,
      turnout,
      partyResults,
      winner,
      coalitionFormed,
      demographicBreakdown: {},
      regionalBreakdown: {}
    };
  }

  /**
   * Schedule next election
   */
  private async scheduleNextElection(completedElection: ElectionCycle, client: any): Promise<void> {
    const nextElectionDate = new Date(completedElection.scheduledDate);
    nextElectionDate.setFullYear(nextElectionDate.getFullYear() + completedElection.termLength);

    const campaignStartDate = new Date(nextElectionDate);
    campaignStartDate.setDate(campaignStartDate.getDate() - completedElection.campaignLength);

    const nextElectionId = `election_${completedElection.civilizationId}_${completedElection.electionType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await client.query(`
      INSERT INTO electoral_cycles (
        id, civilization_id, election_type, scheduled_date, term_length,
        voting_system, campaign_start_date, campaign_length, eligible_voters
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      nextElectionId,
      completedElection.civilizationId,
      completedElection.electionType,
      nextElectionDate,
      completedElection.termLength,
      completedElection.votingSystem,
      campaignStartDate,
      completedElection.campaignLength,
      completedElection.eligibleVoters
    ]);

    // Cache in memory
    this.activeElections.set(nextElectionId, {
      id: nextElectionId,
      civilizationId: completedElection.civilizationId,
      electionType: completedElection.electionType,
      scheduledDate: nextElectionDate,
      termLength: completedElection.termLength,
      status: 'scheduled',
      votingSystem: completedElection.votingSystem,
      eligibleVoters: completedElection.eligibleVoters,
      campaignStartDate,
      campaignLength: completedElection.campaignLength,
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log(`📅 Next ${completedElection.electionType} election scheduled for ${nextElectionDate.toISOString()}`);
  }

  /**
   * Get electoral data for a civilization
   */
  async getElectoralData(civilizationId: string): Promise<{
    activeElections: ElectionCycle[];
    recentPolls: PollResult[];
    campaignActivities: CampaignActivity[];
    campaignPromises: CampaignPromise[];
  }> {
    const activeElections = Array.from(this.activeElections.values())
      .filter(election => election.civilizationId === civilizationId);

    const recentPolls: PollResult[] = [];
    const campaignActivities: CampaignActivity[] = [];
    const campaignPromises: CampaignPromise[] = [];

    for (const election of activeElections) {
      const polls = this.pollHistory.get(election.id) || [];
      recentPolls.push(...polls.slice(-3)); // Last 3 polls

      const activities = this.campaignActivities.get(election.id) || [];
      campaignActivities.push(...activities.slice(-10)); // Last 10 activities

      const promises = this.campaignPromises.get(election.id) || [];
      campaignPromises.push(...promises);
    }

    return {
      activeElections,
      recentPolls,
      campaignActivities,
      campaignPromises
    };
  }
}


