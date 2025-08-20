import { Witt, Follow } from '../components/Witter/WitterFeed';
import { GameMasterPersonality } from './ContentGenerator';
import { SimulatedInteractionService } from './SimulatedInteractionService';
import { DynamicNPCGenerator } from './DynamicNPCGenerator';

export interface PlayerProfile {
  id: string;
  name: string;
  type: 'PLAYER' | 'CITIZEN' | 'PERSONALITY' | 'CITY_LEADER' | 'PLANET_LEADER' | 'DIVISION_LEADER';
  avatar?: string;
  location: {
    currentSystem: string;
    currentPlanet: string;
    currentCity?: string;
    coordinates?: { x: number; y: number; z: number };
  };
  stats: {
    followerCount: number;
    followingCount: number;
    wittCount: number;
    joinDate: Date;
    lastActive: Date;
  };
  achievements: PlayerAchievement[];
  faction?: {
    id: string;
    name: string;
    rank: string;
    role: string;
  };
  civilization?: {
    id: string;
    name: string;
    type: string;
    level: number;
  };
  reputation: {
    overall: number; // 0-100
    categories: {
      military: number;
      economic: number;
      diplomatic: number;
      scientific: number;
      cultural: number;
    };
  };
  personalityTraits?: {
    humor: number; // 0-1
    aggression: number; // 0-1
    cooperation: number; // 0-1
    ambition: number; // 0-1
    curiosity: number; // 0-1
  };
}

export interface PlayerAchievement {
  id: string;
  title: string;
  description: string;
  category: 'MILITARY' | 'ECONOMIC' | 'DIPLOMATIC' | 'SCIENTIFIC' | 'CULTURAL' | 'EXPLORATION';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  dateEarned: Date;
  publiclyVisible: boolean;
}

export interface PlayerInteraction {
  id: string;
  playerId: string;
  targetId: string; // Witt ID or Comment ID
  targetType: 'WITT' | 'COMMENT';
  interactionType: 'LIKE' | 'SHARE' | 'COMMENT' | 'REPLY';
  content?: string; // For comments/replies
  timestamp: Date;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'FRIENDS' | 'PRIVATE';
}

export interface NPCResponse {
  npcId: string;
  npcProfile: PlayerProfile;
  responseType: 'LIKE' | 'COMMENT' | 'SHARE';
  content?: string;
  timestamp: Date;
  triggerFactors: {
    playerReputation: number;
    contentRelevance: number;
    locationProximity: number;
    factionRelation: number;
    personalityMatch: number;
  };
}

export class PlayerInteractionService {
  private personality: GameMasterPersonality;
  private simulatedInteractionService: SimulatedInteractionService;
  private dynamicNPCGenerator: DynamicNPCGenerator;
  private playerProfiles: Map<string, PlayerProfile>;
  private interactionHistory: Map<string, PlayerInteraction[]>;
  private followerGraph: Map<string, Set<string>>; // playerId -> Set of follower IDs

  constructor(personality: GameMasterPersonality) {
    this.personality = personality;
    this.simulatedInteractionService = new SimulatedInteractionService(personality);
    this.dynamicNPCGenerator = new DynamicNPCGenerator(personality);
    this.playerProfiles = new Map();
    this.interactionHistory = new Map();
    this.followerGraph = new Map();
  }

  // Initialize follower graphs for existing NPCs
  private initializeFollowerGraphs() {
    const allNPCs = this.dynamicNPCGenerator.getAllNPCs();
    allNPCs.forEach(npc => {
      if (!this.followerGraph.has(npc.id)) {
        this.followerGraph.set(npc.id, new Set());
      }
    });
  }

  // Register a player profile
  async registerPlayerProfile(profile: PlayerProfile): Promise<void> {
    this.playerProfiles.set(profile.id, profile);
    this.followerGraph.set(profile.id, new Set());
    
    // Sync with backend
    try {
      await fetch('/api/witter/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
    } catch (error) {
      console.error('Failed to sync player profile:', error);
    }
  }

  // Get profile by ID (player or NPC)
  getProfile(profileId: string): PlayerProfile | null {
    return this.playerProfiles.get(profileId) || this.dynamicNPCGenerator.getNPCById(profileId) || null;
  }

  // Handle player interaction with content
  async handlePlayerInteraction(interaction: PlayerInteraction): Promise<void> {
    // Store the interaction
    const playerInteractions = this.interactionHistory.get(interaction.playerId) || [];
    playerInteractions.push(interaction);
    this.interactionHistory.set(interaction.playerId, playerInteractions);

    // Distribute to followers if public
    if (interaction.visibility === 'PUBLIC' || interaction.visibility === 'FOLLOWERS') {
      await this.distributeToFollowers(interaction);
    }

    // Generate NPC responses
    await this.generateNPCResponses(interaction);

    // Sync with backend
    try {
      await fetch('/api/witter/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interaction)
      });
    } catch (error) {
      console.error('Failed to sync interaction:', error);
    }
  }

  // Generate NPC responses to player content
  private async generateNPCResponses(playerInteraction: PlayerInteraction): Promise<NPCResponse[]> {
    const responses: NPCResponse[] = [];
    const playerProfile = this.getProfile(playerInteraction.playerId);
    
    if (!playerProfile) return responses;

    // Get relevant NPCs based on location, faction, and content
    const relevantNPCs = this.getRelevantNPCs(playerProfile, playerInteraction);

    for (const npc of relevantNPCs) {
      const responseChance = this.calculateResponseChance(npc, playerProfile, playerInteraction);
      
      if (Math.random() < responseChance) {
        const response = await this.generateNPCResponse(npc, playerProfile, playerInteraction);
        if (response) {
          responses.push(response);
          
          // Create interaction record for the NPC response
          const npcInteraction: PlayerInteraction = {
            id: `npc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            playerId: npc.id,
            targetId: playerInteraction.targetId,
            targetType: playerInteraction.targetType,
            interactionType: response.responseType,
            content: response.content,
            timestamp: response.timestamp,
            visibility: 'PUBLIC'
          };

          await this.handlePlayerInteraction(npcInteraction);
        }
      }
    }

    return responses;
  }

  // Get NPCs that might respond to a player's content
  private getRelevantNPCs(playerProfile: PlayerProfile, interaction: PlayerInteraction): PlayerProfile[] {
    const relevantNPCs: PlayerProfile[] = [];
    
    // Get NPCs from the same system first (most likely to interact)
    const sameSystemNPCs = this.dynamicNPCGenerator.getNPCsByLocation(
      playerProfile.location.currentSystem.split(' ')[0].toLowerCase()
    );
    
    // Get some NPCs from other systems for diversity
    const allNPCs = this.dynamicNPCGenerator.getAllNPCs();
    const otherSystemNPCs = allNPCs.filter(npc => 
      !npc.location.currentSystem.toLowerCase().includes(playerProfile.location.currentSystem.split(' ')[0].toLowerCase())
    ).slice(0, 20); // Limit to 20 for performance
    
    const candidateNPCs = [...sameSystemNPCs, ...otherSystemNPCs];
    
    for (const npc of candidateNPCs) {
      let relevanceScore = 0;

      // Location proximity
      const distance = this.calculateDistance(playerProfile.location, npc.location);
      if (distance < 10) relevanceScore += 0.4; // Same system
      else if (distance < 100) relevanceScore += 0.2; // Nearby systems

      // Faction relations
      if (playerProfile.faction && npc.faction) {
        if (playerProfile.faction.id === npc.faction.id) relevanceScore += 0.3;
        else relevanceScore += 0.1; // Different factions still interact
      }

      // Reputation compatibility
      const reputationMatch = this.calculateReputationMatch(playerProfile, npc);
      relevanceScore += reputationMatch * 0.2;

      // Personality compatibility
      if (playerProfile.personalityTraits && npc.personalityTraits) {
        const personalityMatch = this.calculatePersonalityMatch(playerProfile.personalityTraits, npc.personalityTraits);
        relevanceScore += personalityMatch * 0.1;
      }

      // Include if relevance score is above threshold
      if (relevanceScore > 0.3) {
        relevantNPCs.push(npc);
      }
    }

    return relevantNPCs.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(playerProfile, a);
      const scoreB = this.calculateRelevanceScore(playerProfile, b);
      return scoreB - scoreA;
    }).slice(0, 8); // Top 8 most relevant NPCs
  }

  // Calculate response chance for an NPC
  private calculateResponseChance(npc: PlayerProfile, player: PlayerProfile, interaction: PlayerInteraction): number {
    let baseChance = 0.1; // 10% base chance

    // Adjust based on NPC type
    switch (npc.type) {
      case 'PERSONALITY':
        baseChance = 0.3; // Personalities are more active
        break;
      case 'CITY_LEADER':
      case 'PLANET_LEADER':
        baseChance = 0.2; // Leaders respond to relevant content
        break;
      case 'DIVISION_LEADER':
        baseChance = 0.15; // Military leaders are selective
        break;
      case 'CITIZEN':
        baseChance = 0.25; // Citizens are social
        break;
    }

    // Adjust based on player reputation
    const reputationBonus = player.reputation.overall / 100 * 0.2;
    baseChance += reputationBonus;

    // Adjust based on location proximity
    const distance = this.calculateDistance(player.location, npc.location);
    if (distance < 1) baseChance += 0.3; // Same location
    else if (distance < 10) baseChance += 0.1; // Same system

    // Adjust based on interaction type
    if (interaction.interactionType === 'COMMENT') baseChance += 0.1; // More likely to respond to comments
    if (interaction.interactionType === 'SHARE') baseChance += 0.05; // Shares get some attention

    return Math.min(baseChance, 0.8); // Cap at 80%
  }

  // Generate an NPC response
  private async generateNPCResponse(npc: PlayerProfile, player: PlayerProfile, interaction: PlayerInteraction): Promise<NPCResponse | null> {
    const responseTypes: ('LIKE' | 'COMMENT' | 'SHARE')[] = ['LIKE', 'COMMENT', 'SHARE'];
    const weights = [0.6, 0.3, 0.1]; // Likes are most common, comments less so, shares rare
    
    const responseType = this.weightedRandom(responseTypes, weights);
    let content: string | undefined;

    if (responseType === 'COMMENT') {
      content = await this.generateNPCComment(npc, player, interaction);
    }

    const triggerFactors = {
      playerReputation: player.reputation.overall,
      contentRelevance: this.calculateContentRelevance(npc, interaction),
      locationProximity: 100 - this.calculateDistance(player.location, npc.location),
      factionRelation: this.calculateFactionRelation(npc, player),
      personalityMatch: npc.personalityTraits && player.personalityTraits 
        ? this.calculatePersonalityMatch(npc.personalityTraits, player.personalityTraits) * 100
        : 50
    };

    return {
      npcId: npc.id,
      npcProfile: npc,
      responseType,
      content,
      timestamp: new Date(Date.now() + Math.random() * 300000), // 0-5 minutes delay
      triggerFactors
    };
  }

  // Generate NPC comment content
  private async generateNPCComment(npc: PlayerProfile, player: PlayerProfile, interaction: PlayerInteraction): Promise<string> {
    const templates = this.getNPCCommentTemplates(npc.type, npc.personalityTraits);
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return this.fillNPCCommentTemplate(template, npc, player, interaction);
  }

  // Get comment templates based on NPC type and personality
  private getNPCCommentTemplates(npcType: string, traits?: PlayerProfile['personalityTraits']): string[] {
    const baseTemplates = {
      CITIZEN: [
        "Great point, {playerName}! I've seen similar things here in {location}.",
        "Thanks for sharing this! Really helpful for those of us in {location}.",
        "Interesting perspective from {playerLocation}! Here in {npcLocation} we've had different experiences.",
        "This is exactly what we needed to hear! Keep up the great work!"
      ],
      PERSONALITY: [
        "Fascinating insights, {playerName}. This aligns with my research on {topic}.",
        "Your experience in {playerLocation} provides valuable data for my analysis.",
        "I appreciate you sharing this with the galactic community. Knowledge is power!",
        "This reminds me of similar patterns I've observed across {systems} systems."
      ],
      CITY_LEADER: [
        "As mayor of {npcLocation}, I can confirm similar developments here.",
        "Thank you for bringing this to our attention, {playerName}. We'll investigate.",
        "This could have implications for our policies here in {npcLocation}.",
        "Excellent work, Commander! Your efforts benefit all our communities."
      ],
      PLANET_LEADER: [
        "The planetary council will be very interested in this development.",
        "Your achievements reflect well on all citizens of {playerLocation}.",
        "This strategic insight could reshape our approach across the sector.",
        "Outstanding leadership, {playerName}. The galaxy needs more like you."
      ],
      DIVISION_LEADER: [
        "Solid tactical analysis, {playerName}. My forces have noted similar patterns.",
        "This intelligence is valuable for our operations in the {region} sector.",
        "Your military acumen is impressive. Consider joining our ranks!",
        "Strategic implications are significant. Will coordinate with command."
      ]
    };

    let templates = baseTemplates[npcType as keyof typeof baseTemplates] || baseTemplates.CITIZEN;

    // Modify based on personality traits
    if (traits) {
      if (traits.humor > 0.7) {
        templates = templates.map(t => t + " 😄");
      }
      if (traits.aggression > 0.7) {
        templates = templates.map(t => t.replace(/great|excellent|outstanding/gi, "impressive"));
      }
      if (traits.cooperation > 0.8) {
        templates = templates.map(t => t + " Let's work together on this!");
      }
    }

    return templates;
  }

  // Fill NPC comment template with contextual data
  private fillNPCCommentTemplate(template: string, npc: PlayerProfile, player: PlayerProfile, interaction: PlayerInteraction): string {
    return template
      .replace(/{playerName}/g, player.name)
      .replace(/{playerLocation}/g, `${player.location.currentCity || player.location.currentPlanet}`)
      .replace(/{npcLocation}/g, `${npc.location.currentCity || npc.location.currentPlanet}`)
      .replace(/{location}/g, `${npc.location.currentCity || npc.location.currentPlanet}`)
      .replace(/{topic}/g, this.extractTopicFromInteraction(interaction))
      .replace(/{systems}/g, Math.floor(Math.random() * 50 + 10).toString())
      .replace(/{region}/g, npc.location.currentSystem);
  }

  // Distribute interaction to followers
  private async distributeToFollowers(interaction: PlayerInteraction): Promise<void> {
    const followers = this.followerGraph.get(interaction.playerId) || new Set();
    
    for (const followerId of followers) {
      // Create personalized feed entry for each follower
      try {
        await fetch('/api/witter/feed/distribute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            followerId,
            interaction,
            timestamp: new Date()
          })
        });
      } catch (error) {
        console.error(`Failed to distribute to follower ${followerId}:`, error);
      }
    }
  }

  // Follow/unfollow functionality
  async handleFollow(followerId: string, targetId: string, isFollowing: boolean): Promise<void> {
    const followerSet = this.followerGraph.get(targetId) || new Set();
    
    if (isFollowing) {
      followerSet.delete(followerId);
    } else {
      followerSet.add(followerId);
    }
    
    this.followerGraph.set(targetId, followerSet);

    // Update follower counts
    const targetProfile = this.getProfile(targetId);
    const followerProfile = this.getProfile(followerId);
    
    if (targetProfile) {
      targetProfile.stats.followerCount = followerSet.size;
    }
    
    if (followerProfile) {
      const followingCount = Array.from(this.followerGraph.entries())
        .filter(([_, followers]) => followers.has(followerId)).length;
      followerProfile.stats.followingCount = followingCount;
    }

    // Sync with backend
    try {
      await fetch('/api/witter/follow', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId, targetId })
      });
    } catch (error) {
      console.error('Failed to sync follow status:', error);
    }
  }

  // Get personalized feed for a player
  async getPersonalizedFeed(playerId: string, limit: number = 20): Promise<Witt[]> {
    const following = Array.from(this.followerGraph.entries())
      .filter(([_, followers]) => followers.has(playerId))
      .map(([targetId]) => targetId);

    // Get content from followed users + some general content
    try {
      const response = await fetch(`/api/witter/feed/personalized`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          following,
          limit
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.witts;
      }
    } catch (error) {
      console.error('Failed to fetch personalized feed:', error);
    }

    return [];
  }

  // Utility methods
  private calculateDistance(loc1: PlayerProfile['location'], loc2: PlayerProfile['location']): number {
    if (!loc1.coordinates || !loc2.coordinates) return 1000; // Unknown distance
    
    const dx = loc1.coordinates.x - loc2.coordinates.x;
    const dy = loc1.coordinates.y - loc2.coordinates.y;
    const dz = loc1.coordinates.z - loc2.coordinates.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private calculateReputationMatch(player1: PlayerProfile, player2: PlayerProfile): number {
    const categories = ['military', 'economic', 'diplomatic', 'scientific', 'cultural'] as const;
    let totalDiff = 0;
    
    for (const category of categories) {
      const diff = Math.abs(player1.reputation.categories[category] - player2.reputation.categories[category]);
      totalDiff += diff;
    }
    
    return 1 - (totalDiff / (categories.length * 100)); // Normalize to 0-1
  }

  private calculatePersonalityMatch(traits1: NonNullable<PlayerProfile['personalityTraits']>, traits2: NonNullable<PlayerProfile['personalityTraits']>): number {
    const keys = Object.keys(traits1) as (keyof typeof traits1)[];
    let totalDiff = 0;
    
    for (const key of keys) {
      totalDiff += Math.abs(traits1[key] - traits2[key]);
    }
    
    return 1 - (totalDiff / keys.length); // Normalize to 0-1
  }

  private calculateRelevanceScore(player: PlayerProfile, npc: PlayerProfile): number {
    let score = 0;
    
    // Location proximity
    const distance = this.calculateDistance(player.location, npc.location);
    score += Math.max(0, 100 - distance) / 100 * 0.4;
    
    // Reputation match
    score += this.calculateReputationMatch(player, npc) * 0.3;
    
    // Personality match
    if (player.personalityTraits && npc.personalityTraits) {
      score += this.calculatePersonalityMatch(player.personalityTraits, npc.personalityTraits) * 0.2;
    }
    
    // Faction relations
    score += this.calculateFactionRelation(player, npc) / 100 * 0.1;
    
    return score;
  }

  private calculateContentRelevance(npc: PlayerProfile, interaction: PlayerInteraction): number {
    // Simple content relevance based on interaction type and NPC interests
    let relevance = 50; // Base relevance
    
    if (interaction.interactionType === 'COMMENT' && interaction.content) {
      const content = interaction.content.toLowerCase();
      
      // Check for keywords relevant to NPC type
      switch (npc.type) {
        case 'DIVISION_LEADER':
          if (content.includes('military') || content.includes('battle') || content.includes('defense')) {
            relevance += 30;
          }
          break;
        case 'CITY_LEADER':
          if (content.includes('city') || content.includes('infrastructure') || content.includes('community')) {
            relevance += 30;
          }
          break;
        case 'PERSONALITY':
          if (content.includes('research') || content.includes('discovery') || content.includes('science')) {
            relevance += 30;
          }
          break;
      }
    }
    
    return Math.min(relevance, 100);
  }

  private calculateFactionRelation(player1: PlayerProfile, player2: PlayerProfile): number {
    if (!player1.faction || !player2.faction) return 50; // Neutral
    
    if (player1.faction.id === player2.faction.id) return 90; // Same faction
    
    // Different factions - could implement faction relationship matrix here
    return 30; // Slightly negative by default
  }

  private extractTopicFromInteraction(interaction: PlayerInteraction): string {
    const topics = ['galactic trade', 'exploration', 'technology', 'diplomacy', 'culture', 'security'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private weightedRandom<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[0]; // Fallback
  }

  // Get all profiles (for UI display)
  getAllProfiles(): PlayerProfile[] {
    // Initialize follower graphs for any new NPCs
    this.initializeFollowerGraphs();
    return [...this.playerProfiles.values(), ...this.dynamicNPCGenerator.getAllNPCs()];
  }

  // Get follower count for a profile
  getFollowerCount(profileId: string): number {
    return this.followerGraph.get(profileId)?.size || 0;
  }

  // Check if one user follows another
  isFollowing(followerId: string, targetId: string): boolean {
    return this.followerGraph.get(targetId)?.has(followerId) || false;
  }

  // Get population statistics
  getPopulationStats(): any {
    return this.dynamicNPCGenerator.getPopulationStats();
  }

  // Get NPCs by location
  getNPCsByLocation(systemId?: string, planetId?: string, cityId?: string): PlayerProfile[] {
    return this.dynamicNPCGenerator.getNPCsByLocation(systemId, planetId, cityId);
  }

  // Get NPCs by type
  getNPCsByType(type: string): PlayerProfile[] {
    return this.dynamicNPCGenerator.getNPCsByType(type);
  }

  // Force generation of NPCs for a specific location
  async generateNPCsForLocation(locationId: string, count: number): Promise<PlayerProfile[]> {
    const newNPCs = await this.dynamicNPCGenerator.forceGenerateNPCs(locationId, count);
    
    // Initialize follower graphs for new NPCs
    newNPCs.forEach(npc => {
      if (!this.followerGraph.has(npc.id)) {
        this.followerGraph.set(npc.id, new Set());
      }
    });
    
    return newNPCs;
  }

  // Get dynamic NPC generator (for advanced operations)
  getDynamicNPCGenerator(): DynamicNPCGenerator {
    return this.dynamicNPCGenerator;
  }
}

export default PlayerInteractionService;
