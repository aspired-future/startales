/**
 * Conversation Context Service
 * Gathers comprehensive context for AI conversations including:
 * - Game Master story context
 * - Mission context  
 * - Civilization state
 * - Character relationships
 * - Recent events and history
 */

export interface GameMasterContext {
  currentStoryArc?: {
    id: string;
    title: string;
    description: string;
    theme: string;
    currentPhase: string;
    urgency: string;
  };
  activeEvents?: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    urgency: string;
    requiresResponse: boolean;
  }>;
  recentChoices?: Array<{
    eventId: string;
    choice: string;
    consequences: string[];
    timestamp: string;
  }>;
}

export interface MissionContext {
  activeMissions?: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    progress: number;
    assignedCharacters: string[];
  }>;
  availableMissions?: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    priority: string;
    urgency: string;
  }>;
  recentCompletions?: Array<{
    id: string;
    title: string;
    outcome: string;
    timestamp: string;
  }>;
}

export interface CivilizationContext {
  id: string;
  name: string;
  government: {
    type: string;
    stability: number;
    approval: number;
    currentPolicies: string[];
  };
  economy: {
    gdp: number;
    growth: number;
    unemployment: number;
    inflation: number;
    tradeBalance: number;
  };
  military: {
    strength: number;
    readiness: number;
    activeConflicts: string[];
    alliances: string[];
  };
  diplomacy: {
    relations: Array<{
      civilization: string;
      status: string;
      trust: number;
      recentEvents: string[];
    }>;
    treaties: string[];
    negotiations: string[];
  };
  resources: {
    energy: number;
    minerals: number;
    food: number;
    technology: number;
    population: number;
  };
  recentEvents: Array<{
    type: string;
    description: string;
    impact: string;
    timestamp: string;
  }>;
}

export interface ConversationMemory {
  recentTopics: string[];
  characterMentions: Array<{
    characterId: string;
    context: string;
    sentiment: string;
  }>;
  decisionPoints: Array<{
    topic: string;
    decision: string;
    reasoning: string;
    timestamp: string;
  }>;
  ongoingConcerns: string[];
}

export interface ComprehensiveContext {
  gameMaster: GameMasterContext;
  missions: MissionContext;
  civilization: CivilizationContext;
  conversationMemory: ConversationMemory;
  characterRelationships: Array<{
    characterId: string;
    relationship: string;
    trust: number;
    recentInteractions: string[];
  }>;
}

export class ConversationContextService {
  private static instance: ConversationContextService;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:4000') {
    this.baseUrl = baseUrl;
  }

  static getInstance(): ConversationContextService {
    if (!ConversationContextService.instance) {
      ConversationContextService.instance = new ConversationContextService();
    }
    return ConversationContextService.instance;
  }

  async gatherComprehensiveContext(
    civilizationId: string,
    conversationId: string,
    characterId?: string
  ): Promise<ComprehensiveContext> {
    try {
      console.log('🔍 Gathering comprehensive context for conversation...');
      
      const [
        gameMasterContext,
        missionContext,
        civilizationContext,
        conversationMemory
      ] = await Promise.all([
        this.getGameMasterContext(civilizationId),
        this.getMissionContext(civilizationId),
        this.getCivilizationContext(civilizationId),
        this.getConversationMemory(conversationId)
      ]);

      const characterRelationships = characterId 
        ? await this.getCharacterRelationships(characterId, civilizationId)
        : [];

      return {
        gameMaster: gameMasterContext,
        missions: missionContext,
        civilization: civilizationContext,
        conversationMemory,
        characterRelationships
      };
    } catch (error) {
      console.error('Failed to gather comprehensive context:', error);
      return this.getDefaultContext(civilizationId);
    }
  }

  private async getGameMasterContext(civilizationId: string): Promise<GameMasterContext> {
    try {
      const response = await fetch(`${this.baseUrl}/api/story/current-arc/${civilizationId}`);
      if (!response.ok) throw new Error('Story context not available');
      
      const data = await response.json();
      return {
        currentStoryArc: data.currentArc,
        activeEvents: data.activeEvents || [],
        recentChoices: data.recentChoices || []
      };
    } catch (error) {
      console.warn('Game Master context not available:', error);
      return {
        currentStoryArc: {
          id: 'default_arc',
          title: 'The New Frontier',
          description: 'Your civilization stands at the threshold of a new era of exploration and diplomacy.',
          theme: 'space_exploration',
          currentPhase: 'rising_action',
          urgency: 'medium'
        },
        activeEvents: [],
        recentChoices: []
      };
    }
  }

  private async getMissionContext(civilizationId: string): Promise<MissionContext> {
    try {
      const response = await fetch(`${this.baseUrl}/api/missions/context/${civilizationId}`);
      if (!response.ok) throw new Error('Mission context not available');
      
      return await response.json();
    } catch (error) {
      console.warn('Mission context not available:', error);
      return {
        activeMissions: [],
        availableMissions: [],
        recentCompletions: []
      };
    }
  }

  private async getCivilizationContext(civilizationId: string): Promise<CivilizationContext> {
    try {
      const response = await fetch(`${this.baseUrl}/api/civilizations/${civilizationId}/full-context`);
      if (!response.ok) throw new Error('Civilization context not available');
      
      return await response.json();
    } catch (error) {
      console.warn('Civilization context not available:', error);
      return this.getDefaultCivilizationContext(civilizationId);
    }
  }

  private async getConversationMemory(conversationId: string): Promise<ConversationMemory> {
    try {
      const response = await fetch(`${this.baseUrl}/api/whoseapp/conversations/${conversationId}/memory`);
      if (!response.ok) throw new Error('Conversation memory not available');
      
      return await response.json();
    } catch (error) {
      console.warn('Conversation memory not available:', error);
      return {
        recentTopics: [],
        characterMentions: [],
        decisionPoints: [],
        ongoingConcerns: []
      };
    }
  }

  private async getCharacterRelationships(characterId: string, civilizationId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/characters/${characterId}/relationships?civilizationId=${civilizationId}`);
      if (!response.ok) throw new Error('Character relationships not available');
      
      return await response.json();
    } catch (error) {
      console.warn('Character relationships not available:', error);
      return [];
    }
  }

  private getDefaultContext(civilizationId: string): ComprehensiveContext {
    return {
      gameMaster: {
        currentStoryArc: {
          id: 'default_arc',
          title: 'The New Frontier',
          description: 'Your civilization stands at the threshold of a new era.',
          theme: 'space_exploration',
          currentPhase: 'rising_action',
          urgency: 'medium'
        },
        activeEvents: [],
        recentChoices: []
      },
      missions: {
        activeMissions: [],
        availableMissions: [],
        recentCompletions: []
      },
      civilization: this.getDefaultCivilizationContext(civilizationId),
      conversationMemory: {
        recentTopics: [],
        characterMentions: [],
        decisionPoints: [],
        ongoingConcerns: []
      },
      characterRelationships: []
    };
  }

  private getDefaultCivilizationContext(civilizationId: string): CivilizationContext {
    return {
      id: civilizationId,
      name: 'Terran Federation',
      government: {
        type: 'Democratic Federation',
        stability: 75,
        approval: 68,
        currentPolicies: ['Exploration Initiative', 'Trade Expansion', 'Defense Modernization']
      },
      economy: {
        gdp: 2.4e12,
        growth: 3.2,
        unemployment: 4.1,
        inflation: 2.8,
        tradeBalance: 1.2e10
      },
      military: {
        strength: 82,
        readiness: 76,
        activeConflicts: [],
        alliances: ['Andorian Empire', 'Vulcan Republic']
      },
      diplomacy: {
        relations: [
          {
            civilization: 'Andorian Empire',
            status: 'Allied',
            trust: 85,
            recentEvents: ['Trade Agreement Signed', 'Joint Military Exercise']
          },
          {
            civilization: 'Romulan Star Empire',
            status: 'Tense',
            trust: 25,
            recentEvents: ['Border Incident', 'Diplomatic Protest']
          }
        ],
        treaties: ['Andorian Trade Pact', 'Vulcan Science Exchange'],
        negotiations: ['Romulan Border Agreement']
      },
      resources: {
        energy: 85,
        minerals: 72,
        food: 91,
        technology: 88,
        population: 12.4e9
      },
      recentEvents: [
        {
          type: 'diplomatic',
          description: 'Successful trade negotiations with Andorian Empire',
          impact: 'positive',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'military',
          description: 'Romulan ships detected near border',
          impact: 'concerning',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  async generateContextualPrompt(
    userMessage: string,
    character: any,
    context: ComprehensiveContext,
    conversationHistory: any[]
  ): Promise<string> {
    // Get character capabilities
    let capabilities = '';
    try {
      const capResponse = await fetch(`${this.baseUrl}/api/whoseapp/characters/${character.id}/capabilities`);
      if (capResponse.ok) {
        const capData = await capResponse.json();
        capabilities = capData.data.capabilities.map((cap: any) => 
          `- ${cap.description} (${cap.actionType})`
        ).join('\n');
      }
    } catch (error) {
      console.warn('Could not fetch character capabilities:', error);
    }
    const { gameMaster, missions, civilization, conversationMemory } = context;

    return `# COMPREHENSIVE CONTEXT FOR ${character.name?.toUpperCase() || 'CHARACTER'}

## CURRENT SITUATION
**Story Arc**: ${gameMaster.currentStoryArc?.title || 'Unknown'}
- Phase: ${gameMaster.currentStoryArc?.currentPhase || 'Unknown'}
- Theme: ${gameMaster.currentStoryArc?.theme || 'Unknown'}
- Description: ${gameMaster.currentStoryArc?.description || 'No current story context'}
- Urgency: ${gameMaster.currentStoryArc?.urgency || 'Low'}

## ACTIVE EVENTS & MISSIONS
${gameMaster.activeEvents?.length ? 
  gameMaster.activeEvents.map(event => 
    `**${event.title}** (${event.urgency}): ${event.description}`
  ).join('\n') : 'No active story events'}

${missions.activeMissions?.length ?
  `**Active Missions**:\n${missions.activeMissions.map(mission =>
    `- ${mission.title} (${mission.priority}, ${mission.progress}%): ${mission.description}`
  ).join('\n')}` : 'No active missions'}

## CIVILIZATION STATUS: ${civilization.name}
**Government**: ${civilization.government.type} (Stability: ${civilization.government.stability}%, Approval: ${civilization.government.approval}%)
**Economy**: GDP ${(civilization.economy.gdp / 1e12).toFixed(1)}T, Growth ${civilization.economy.growth}%, Unemployment ${civilization.economy.unemployment}%
**Military**: Strength ${civilization.military.strength}%, Readiness ${civilization.military.readiness}%
**Resources**: Energy ${civilization.resources.energy}%, Minerals ${civilization.resources.minerals}%, Food ${civilization.resources.food}%, Tech ${civilization.resources.technology}%

## DIPLOMATIC RELATIONS
${civilization.diplomacy.relations.map(rel => 
  `**${rel.civilization}**: ${rel.status} (Trust: ${rel.trust}%) - Recent: ${rel.recentEvents.join(', ')}`
).join('\n')}

## RECENT EVENTS
${civilization.recentEvents.slice(0, 3).map(event =>
  `- ${event.description} (${event.impact} impact)`
).join('\n')}

## CHARACTER CONTEXT
**Role**: ${character.title || character.role || 'Government Official'}
**Department**: ${character.department || 'General Administration'}
**Personality**: ${character.personality ? JSON.stringify(character.personality) : 'Professional, dedicated'}

## YOUR CAPABILITIES & AUTHORITY
You have the authority and capability to take the following actions:
${capabilities || 'Standard administrative functions'}

**Action Authority**: You can propose and execute actions through the game's systems. When the user requests something within your authority, you should:
1. Acknowledge the request
2. Propose a specific action plan
3. Execute the action if appropriate
4. Report progress and results

## CONVERSATION HISTORY
${conversationHistory.slice(-10).map(msg => 
  `${msg.senderName || msg.senderId}: ${msg.content}`
).join('\n')}

## CURRENT MESSAGE
**User**: ${userMessage}

---

# INSTRUCTIONS FOR ${character.name?.toUpperCase() || 'CHARACTER'}

You are ${character.name}, ${character.title || character.role} of the ${civilization.name}. 

**Context Awareness**: You are fully aware of the current story situation, active missions, civilization status, and recent events listed above. Reference these naturally in your responses.

**Character Voice**: Speak as your character would, considering your role, department, and personality. Be knowledgeable about your area of expertise.

**Story Integration**: Your responses should advance the narrative and acknowledge ongoing story elements. If there are urgent events or missions, address them appropriately.

**Depth & Continuity**: Provide substantive responses that demonstrate understanding of the complex political, economic, and diplomatic situation. Build on previous conversations and maintain consistency.

**Response Length**: Provide detailed, thoughtful responses (3-5 sentences minimum) that give the user meaningful information and advance the conversation.

**Action Execution**: When the user requests something you can do, don't just acknowledge - take action! Use phrases like:
- "I'll initiate [specific action] immediately..."
- "Let me deploy [resource/team] to handle this..."
- "I'm coordinating with [department/ally] to implement..."
- "Executing [action type] protocol now..."

**Current Focus**: ${gameMaster.currentStoryArc?.urgency === 'high' || gameMaster.currentStoryArc?.urgency === 'critical' ? 
  'URGENT: Address the current crisis situation with appropriate gravity and expertise. Take immediate action if within your authority.' :
  'Provide informed counsel and updates relevant to your department and the current situation. Proactively suggest and execute helpful actions.'}

Respond as ${character.name}:`;
  }
}
