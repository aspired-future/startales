/**
 * Game State Awareness System for Characters
 * 
 * Provides characters with contextual awareness of the current game state,
 * story progression, and specialized knowledge based on their roles and expertise.
 */

export interface GameStateSnapshot {
  // Core Game State
  currentTurn: number;
  gamePhase: 'early' | 'expansion' | 'mid_game' | 'late_game' | 'endgame';
  playerCivilization: {
    id: number;
    name: string;
    species: string;
    government_type: string;
    capital_planet: string;
    total_population: number;
    military_strength: number;
    economic_power: number;
    technology_level: number;
    diplomatic_standing: number;
  };
  
  // Political & Diplomatic Context
  politicalSituation: {
    activeWars: Array<{
      participants: string[];
      duration: number;
      intensity: 'skirmish' | 'conflict' | 'war' | 'total_war';
    }>;
    activeTreaties: Array<{
      type: string;
      participants: string[];
      terms: string[];
    }>;
    diplomaticEvents: Array<{
      type: string;
      participants: string[];
      impact: string;
      timestamp: Date;
    }>;
    politicalParties: Array<{
      name: string;
      support: number;
      platform: string[];
      recent_activities: string[];
    }>;
  };
  
  // Economic Context
  economicSituation: {
    gdp: number;
    unemployment_rate: number;
    inflation_rate: number;
    trade_balance: number;
    major_industries: string[];
    recent_economic_events: Array<{
      type: string;
      impact: string;
      affected_sectors: string[];
    }>;
    budget_status: {
      total_revenue: number;
      total_expenditure: number;
      deficit_surplus: number;
      major_spending_categories: Array<{
        category: string;
        amount: number;
        change_from_previous: number;
      }>;
    };
  };
  
  // Military & Security Context
  militarySituation: {
    total_military_personnel: number;
    active_conflicts: string[];
    threat_level: 'low' | 'moderate' | 'high' | 'critical';
    recent_military_events: Array<{
      type: string;
      location: string;
      outcome: string;
      casualties?: number;
    }>;
    defense_spending: number;
    military_readiness: number;
  };
  
  // Technological & Scientific Context
  technologySituation: {
    research_level: number;
    active_research_projects: Array<{
      name: string;
      field: string;
      progress: number;
      expected_completion: Date;
    }>;
    recent_breakthroughs: Array<{
      technology: string;
      field: string;
      impact: string;
      date: Date;
    }>;
    research_budget: number;
    scientific_institutions: string[];
  };
  
  // Social & Cultural Context
  socialSituation: {
    population_happiness: number;
    social_unrest_level: number;
    major_social_issues: string[];
    cultural_events: Array<{
      type: string;
      significance: string;
      impact: string;
    }>;
    education_level: number;
    healthcare_quality: number;
    recent_social_movements: Array<{
      name: string;
      cause: string;
      support_level: number;
      activities: string[];
    }>;
  };
  
  // Environmental & Planetary Context
  environmentalSituation: {
    climate_stability: number;
    resource_availability: { [resource: string]: number };
    environmental_threats: string[];
    conservation_efforts: string[];
    recent_environmental_events: Array<{
      type: string;
      location: string;
      impact: string;
      response: string;
    }>;
  };
  
  // Recent Events & News
  recentEvents: Array<{
    id: string;
    type: 'political' | 'economic' | 'military' | 'social' | 'technological' | 'environmental';
    title: string;
    description: string;
    impact_level: 'minor' | 'moderate' | 'major' | 'critical';
    affected_areas: string[];
    timestamp: Date;
    public_reaction: string;
  }>;
  
  // Story & Narrative Context
  storyContext: {
    current_storylines: Array<{
      id: string;
      title: string;
      type: string;
      progress: number;
      key_characters: string[];
      recent_developments: string[];
    }>;
    player_reputation: {
      overall: number;
      by_faction: { [faction: string]: number };
      recent_changes: Array<{
        faction: string;
        change: number;
        reason: string;
      }>;
    };
    active_quests: Array<{
      id: string;
      title: string;
      type: string;
      progress: number;
      deadline?: Date;
    }>;
  };
}

export interface SpecialtyKnowledge {
  // Professional Expertise
  profession: {
    field: string;
    expertise_level: number; // 0-100
    specializations: string[];
    years_experience: number;
    professional_network: string[];
    industry_insights: string[];
    current_projects: Array<{
      name: string;
      type: string;
      status: string;
      confidentiality_level: 'public' | 'internal' | 'confidential' | 'classified';
    }>;
  };
  
  // Government & Political Knowledge (for officials)
  government?: {
    department: string;
    clearance_level: number;
    access_to_classified_info: boolean;
    policy_areas: string[];
    budget_oversight: string[];
    recent_briefings: Array<{
      topic: string;
      classification: string;
      key_points: string[];
      date: Date;
    }>;
    upcoming_decisions: Array<{
      decision_type: string;
      timeline: string;
      stakeholders: string[];
      potential_impact: string;
    }>;
  };
  
  // Military Knowledge (for military personnel)
  military?: {
    branch: string;
    rank: string;
    security_clearance: string;
    operational_areas: string[];
    current_assignments: string[];
    intelligence_access: Array<{
      type: string;
      classification: string;
      relevance: string;
    }>;
    tactical_knowledge: string[];
    strategic_awareness: string[];
  };
  
  // Business & Economic Knowledge (for business leaders)
  business?: {
    industry: string;
    company_size: string;
    market_position: string;
    financial_performance: {
      revenue: number;
      profit_margin: number;
      growth_rate: number;
      market_share: number;
    };
    competitive_intelligence: Array<{
      competitor: string;
      strengths: string[];
      weaknesses: string[];
      recent_moves: string[];
    }>;
    market_trends: string[];
    regulatory_concerns: string[];
  };
  
  // Academic & Research Knowledge (for academics/scientists)
  academic?: {
    field: string;
    institution: string;
    research_areas: string[];
    publications: Array<{
      title: string;
      field: string;
      impact_factor: number;
      date: Date;
    }>;
    ongoing_research: Array<{
      project: string;
      funding_source: string;
      expected_outcomes: string[];
      timeline: string;
    }>;
    peer_network: string[];
    conference_participation: string[];
  };
  
  // Media & Journalism Knowledge (for media personnel)
  media?: {
    outlet: string;
    beat: string[];
    sources: Array<{
      name: string;
      reliability: number;
      access_level: string;
      areas_of_knowledge: string[];
    }>;
    investigative_leads: Array<{
      story: string;
      evidence_level: string;
      potential_impact: string;
      risks: string[];
    }>;
    editorial_positions: string[];
    audience_demographics: string[];
  };
  
  // Regional & Local Knowledge
  regional: {
    home_region: string;
    local_politics: Array<{
      issue: string;
      positions: string[];
      key_players: string[];
      recent_developments: string[];
    }>;
    economic_conditions: {
      employment_rate: number;
      major_employers: string[];
      economic_challenges: string[];
      growth_opportunities: string[];
    };
    social_dynamics: {
      community_leaders: string[];
      social_issues: string[];
      cultural_events: string[];
      demographic_trends: string[];
    };
    infrastructure_status: {
      transportation: string;
      utilities: string;
      healthcare: string;
      education: string;
    };
  };
}

export interface CharacterAwarenessContext {
  character: {
    id: string;
    name: string;
    profession: string;
    specialization: string[];
    clearance_level?: number;
    access_privileges: string[];
    information_networks: string[];
  };
  
  gameState: GameStateSnapshot;
  specialtyKnowledge: SpecialtyKnowledge;
  
  // Contextual Filters
  awarenessFilters: {
    // What information this character would realistically know
    security_clearance: number;
    professional_access: string[];
    social_circles: string[];
    information_sources: string[];
    
    // How they would interpret information
    political_bias: number; // -100 to 100
    professional_perspective: string;
    personal_interests: string[];
    cognitive_biases: string[];
  };
  
  // Recent Information Updates
  recentUpdates: Array<{
    source: string;
    information_type: string;
    content: string;
    reliability: number;
    timestamp: Date;
    impact_on_character: string;
  }>;
  
  // Conversation History & Context
  conversationContext: {
    recent_conversations: Array<{
      participant: string;
      topic: string;
      key_points: string[];
      character_position: string;
      timestamp: Date;
    }>;
    ongoing_relationships: Array<{
      character_id: string;
      relationship_type: string;
      current_status: string;
      shared_interests: string[];
      recent_interactions: string[];
    }>;
  };
}

export interface CharacterResponse {
  // Core Response
  response_text: string;
  emotional_tone: 'enthusiastic' | 'concerned' | 'neutral' | 'skeptical' | 'angry' | 'excited' | 'worried';
  confidence_level: number; // 0-100
  
  // Knowledge Demonstration
  specialty_insights: Array<{
    topic: string;
    insight: string;
    expertise_level: number;
    source_of_knowledge: string;
  }>;
  
  // Game State References
  game_state_awareness: Array<{
    aspect: string;
    character_knowledge: string;
    personal_impact: string;
    professional_relevance: string;
  }>;
  
  // Contextual Elements
  references_to_recent_events: string[];
  professional_terminology: string[];
  personal_anecdotes: string[];
  
  // Follow-up Potential
  suggested_topics: string[];
  information_requests: string[];
  offers_to_help: string[];
  
  // Character Development
  character_growth: {
    new_knowledge_gained: string[];
    relationship_changes: string[];
    opinion_shifts: string[];
  };
}

export class GameStateAwarenessService {
  private gameStateCache: Map<string, GameStateSnapshot> = new Map();
  private specialtyKnowledgeCache: Map<string, SpecialtyKnowledge> = new Map();
  private characterContextCache: Map<string, CharacterAwarenessContext> = new Map();
  
  constructor() {
    // Initialize service
  }
  
  /**
   * Get current game state snapshot for character awareness
   */
  async getCurrentGameState(campaignId: string): Promise<GameStateSnapshot> {
    const cacheKey = `gamestate_${campaignId}`;
    
    if (this.gameStateCache.has(cacheKey)) {
      return this.gameStateCache.get(cacheKey)!;
    }
    
    // Gather game state from various sources
    const gameState = await this.gatherGameStateData(campaignId);
    this.gameStateCache.set(cacheKey, gameState);
    
    return gameState;
  }
  
  /**
   * Get specialty knowledge for a character based on their profession and background
   */
  async getSpecialtyKnowledge(characterId: string, character: any): Promise<SpecialtyKnowledge> {
    const cacheKey = `specialty_${characterId}`;
    
    if (this.specialtyKnowledgeCache.has(cacheKey)) {
      return this.specialtyKnowledgeCache.get(cacheKey)!;
    }
    
    const specialtyKnowledge = await this.generateSpecialtyKnowledge(character);
    this.specialtyKnowledgeCache.set(cacheKey, specialtyKnowledge);
    
    return specialtyKnowledge;
  }
  
  /**
   * Create complete awareness context for character interactions
   */
  async createCharacterContext(
    characterId: string, 
    character: any, 
    campaignId: string
  ): Promise<CharacterAwarenessContext> {
    const [gameState, specialtyKnowledge] = await Promise.all([
      this.getCurrentGameState(campaignId),
      this.getSpecialtyKnowledge(characterId, character)
    ]);
    
    const awarenessFilters = this.generateAwarenessFilters(character);
    const recentUpdates = await this.getRecentInformationUpdates(characterId, character);
    const conversationContext = await this.getConversationContext(characterId);
    
    const context: CharacterAwarenessContext = {
      character: {
        id: characterId,
        name: character.name.full_display,
        profession: character.profession.current_job,
        specialization: character.skills ? Object.keys(character.skills) : [],
        clearance_level: this.calculateClearanceLevel(character),
        access_privileges: this.calculateAccessPrivileges(character),
        information_networks: this.calculateInformationNetworks(character)
      },
      gameState,
      specialtyKnowledge,
      awarenessFilters,
      recentUpdates,
      conversationContext
    };
    
    this.characterContextCache.set(characterId, context);
    return context;
  }
  
  /**
   * Generate contextually aware character response
   */
  async generateAwareResponse(
    characterId: string,
    prompt: string,
    context: CharacterAwarenessContext
  ): Promise<CharacterResponse> {
    // Filter game state information based on character's access and knowledge
    const accessibleGameState = this.filterGameStateByAccess(context.gameState, context.awarenessFilters);
    
    // Apply professional perspective to information
    const professionalInsights = this.generateProfessionalInsights(
      accessibleGameState,
      context.specialtyKnowledge,
      prompt
    );
    
    // Generate response with contextual awareness
    const response = await this.generateContextualResponse(
      prompt,
      context,
      accessibleGameState,
      professionalInsights
    );
    
    return response;
  }
  
  private async gatherGameStateData(campaignId: string): Promise<GameStateSnapshot> {
    // This would integrate with existing game state systems
    // For now, return a mock structure
    return {
      currentTurn: 150,
      gamePhase: 'mid_game',
      playerCivilization: {
        id: 1,
        name: "Terran Federation",
        species: "Human",
        government_type: "Democratic Republic",
        capital_planet: "Earth",
        total_population: 12500000000,
        military_strength: 85,
        economic_power: 78,
        technology_level: 82,
        diplomatic_standing: 72
      },
      politicalSituation: {
        activeWars: [],
        activeTreaties: [],
        diplomaticEvents: [],
        politicalParties: []
      },
      economicSituation: {
        gdp: 45000000000000,
        unemployment_rate: 3.2,
        inflation_rate: 2.1,
        trade_balance: 250000000000,
        major_industries: ["Technology", "Manufacturing", "Services", "Mining"],
        recent_economic_events: [],
        budget_status: {
          total_revenue: 3800000000000,
          total_expenditure: 3950000000000,
          deficit_surplus: -150000000000,
          major_spending_categories: []
        }
      },
      militarySituation: {
        total_military_personnel: 2500000,
        active_conflicts: [],
        threat_level: 'moderate',
        recent_military_events: [],
        defense_spending: 850000000000,
        military_readiness: 85
      },
      technologySituation: {
        research_level: 82,
        active_research_projects: [],
        recent_breakthroughs: [],
        research_budget: 180000000000,
        scientific_institutions: []
      },
      socialSituation: {
        population_happiness: 78,
        social_unrest_level: 15,
        major_social_issues: [],
        cultural_events: [],
        education_level: 85,
        healthcare_quality: 82,
        recent_social_movements: []
      },
      environmentalSituation: {
        climate_stability: 75,
        resource_availability: {},
        environmental_threats: [],
        conservation_efforts: [],
        recent_environmental_events: []
      },
      recentEvents: [],
      storyContext: {
        current_storylines: [],
        player_reputation: {
          overall: 72,
          by_faction: {},
          recent_changes: []
        },
        active_quests: []
      }
    };
  }
  
  private async generateSpecialtyKnowledge(character: any): Promise<SpecialtyKnowledge> {
    const profession = character.profession || {};
    const skills = character.skills || {};
    
    const specialtyKnowledge: SpecialtyKnowledge = {
      profession: {
        field: profession.industry || 'General',
        expertise_level: this.calculateExpertiseLevel(character),
        specializations: Object.keys(skills),
        years_experience: this.calculateYearsExperience(character),
        professional_network: this.generateProfessionalNetwork(character),
        industry_insights: this.generateIndustryInsights(character),
        current_projects: this.generateCurrentProjects(character)
      },
      regional: {
        home_region: character.location?.home || 'Capital Region',
        local_politics: [],
        economic_conditions: {
          employment_rate: 96.8,
          major_employers: [],
          economic_challenges: [],
          growth_opportunities: []
        },
        social_dynamics: {
          community_leaders: [],
          social_issues: [],
          cultural_events: [],
          demographic_trends: []
        },
        infrastructure_status: {
          transportation: 'Good',
          utilities: 'Excellent',
          healthcare: 'Good',
          education: 'Excellent'
        }
      }
    };
    
    // Add role-specific knowledge
    if (this.isGovernmentOfficial(character)) {
      specialtyKnowledge.government = this.generateGovernmentKnowledge(character);
    }
    
    if (this.isMilitaryPersonnel(character)) {
      specialtyKnowledge.military = this.generateMilitaryKnowledge(character);
    }
    
    if (this.isBusinessLeader(character)) {
      specialtyKnowledge.business = this.generateBusinessKnowledge(character);
    }
    
    if (this.isAcademic(character)) {
      specialtyKnowledge.academic = this.generateAcademicKnowledge(character);
    }
    
    if (this.isMediaPersonnel(character)) {
      specialtyKnowledge.media = this.generateMediaKnowledge(character);
    }
    
    return specialtyKnowledge;
  }
  
  private generateAwarenessFilters(character: any): any {
    return {
      security_clearance: this.calculateClearanceLevel(character),
      professional_access: this.calculateAccessPrivileges(character),
      social_circles: this.calculateSocialCircles(character),
      information_sources: this.calculateInformationSources(character),
      political_bias: character.opinions?.political_views?.overall || 0,
      professional_perspective: character.profession?.industry || 'general',
      personal_interests: character.personality?.values || [],
      cognitive_biases: this.calculateCognitiveBiases(character)
    };
  }
  
  private async getRecentInformationUpdates(characterId: string, character: any): Promise<any[]> {
    // This would integrate with news, events, and information systems
    return [];
  }
  
  private async getConversationContext(characterId: string): Promise<any> {
    // This would integrate with conversation history systems
    return {
      recent_conversations: [],
      ongoing_relationships: []
    };
  }
  
  private calculateClearanceLevel(character: any): number {
    const profession = character.profession?.current_job || '';
    const category = character.category || '';
    
    if (category === 'official' || profession.includes('government')) {
      return 75; // High clearance for government officials
    } else if (category === 'military') {
      return 80; // Very high clearance for military
    } else if (category === 'business' && character.profession?.career_level === 'executive') {
      return 60; // Moderate clearance for business executives
    } else if (category === 'academic') {
      return 50; // Moderate clearance for academics
    } else if (category === 'media') {
      return 40; // Lower clearance but good information access
    }
    
    return 25; // Basic clearance for citizens
  }
  
  private calculateAccessPrivileges(character: any): string[] {
    const privileges: string[] = ['public_information'];
    const profession = character.profession?.current_job || '';
    const category = character.category || '';
    
    if (category === 'official') {
      privileges.push('government_internal', 'policy_documents', 'budget_details');
    }
    
    if (category === 'military') {
      privileges.push('military_intelligence', 'security_briefings', 'tactical_information');
    }
    
    if (category === 'business') {
      privileges.push('market_data', 'industry_reports', 'financial_information');
    }
    
    if (category === 'academic') {
      privileges.push('research_data', 'scientific_reports', 'academic_networks');
    }
    
    if (category === 'media') {
      privileges.push('press_briefings', 'investigative_sources', 'public_records');
    }
    
    return privileges;
  }
  
  private calculateInformationNetworks(character: any): string[] {
    const networks: string[] = [];
    const category = character.category || '';
    const profession = character.profession?.current_job || '';
    
    networks.push('public_media', 'social_networks');
    
    if (category === 'official') {
      networks.push('government_channels', 'policy_networks', 'diplomatic_circles');
    }
    
    if (category === 'military') {
      networks.push('military_intelligence', 'defense_networks', 'security_briefings');
    }
    
    if (category === 'business') {
      networks.push('industry_associations', 'trade_organizations', 'business_intelligence');
    }
    
    if (category === 'academic') {
      networks.push('research_institutions', 'academic_conferences', 'peer_review_networks');
    }
    
    if (category === 'media') {
      networks.push('press_corps', 'investigative_networks', 'source_networks');
    }
    
    return networks;
  }
  
  private calculateExpertiseLevel(character: any): number {
    const experience = character.background?.career_history?.length || 0;
    const education = character.background?.education?.length || 0;
    const achievements = character.background?.achievements?.length || 0;
    
    return Math.min(100, (experience * 10) + (education * 5) + (achievements * 3));
  }
  
  private calculateYearsExperience(character: any): number {
    const age = character.demographics?.age || 30;
    const educationYears = character.background?.education?.length * 4 || 16;
    return Math.max(0, age - educationYears - 18);
  }
  
  private generateProfessionalNetwork(character: any): string[] {
    // Generate realistic professional networks based on character background
    return ['Professional Association', 'Industry Contacts', 'Alumni Network'];
  }
  
  private generateIndustryInsights(character: any): string[] {
    // Generate industry-specific insights
    return ['Market Trends', 'Regulatory Changes', 'Technology Developments'];
  }
  
  private generateCurrentProjects(character: any): any[] {
    // Generate current professional projects
    return [
      {
        name: 'Current Assignment',
        type: 'Professional',
        status: 'In Progress',
        confidentiality_level: 'internal' as const
      }
    ];
  }
  
  // Role identification methods
  private isGovernmentOfficial(character: any): boolean {
    return character.category === 'official' || 
           character.profession?.industry?.includes('government') ||
           character.profession?.current_job?.includes('minister') ||
           character.profession?.current_job?.includes('secretary');
  }
  
  private isMilitaryPersonnel(character: any): boolean {
    return character.category === 'military' ||
           character.profession?.industry?.includes('military') ||
           character.profession?.industry?.includes('defense');
  }
  
  private isBusinessLeader(character: any): boolean {
    return character.category === 'business' ||
           character.profession?.career_level === 'executive' ||
           character.profession?.current_job?.includes('CEO') ||
           character.profession?.current_job?.includes('Director');
  }
  
  private isAcademic(character: any): boolean {
    return character.category === 'academic' ||
           character.profession?.industry?.includes('education') ||
           character.profession?.industry?.includes('research') ||
           character.profession?.current_job?.includes('Professor');
  }
  
  private isMediaPersonnel(character: any): boolean {
    return character.category === 'media' ||
           character.profession?.industry?.includes('media') ||
           character.profession?.industry?.includes('journalism') ||
           character.profession?.current_job?.includes('journalist');
  }
  
  // Specialty knowledge generators
  private generateGovernmentKnowledge(character: any): any {
    return {
      department: character.profession?.employer || 'General Administration',
      clearance_level: this.calculateClearanceLevel(character),
      access_to_classified_info: this.calculateClearanceLevel(character) > 60,
      policy_areas: this.getGovernmentPolicyAreas(character),
      budget_oversight: this.getBudgetOversightAreas(character),
      recent_briefings: [],
      upcoming_decisions: []
    };
  }
  
  private generateMilitaryKnowledge(character: any): any {
    return {
      branch: this.getMilitaryBranch(character),
      rank: this.getMilitaryRank(character),
      security_clearance: this.getMilitarySecurityClearance(character),
      operational_areas: this.getMilitaryOperationalAreas(character),
      current_assignments: [],
      intelligence_access: [],
      tactical_knowledge: [],
      strategic_awareness: []
    };
  }
  
  private generateBusinessKnowledge(character: any): any {
    return {
      industry: character.profession?.industry || 'General Business',
      company_size: this.getCompanySize(character),
      market_position: this.getMarketPosition(character),
      financial_performance: {
        revenue: this.generateRevenue(character),
        profit_margin: Math.random() * 20 + 5,
        growth_rate: Math.random() * 15 + 2,
        market_share: Math.random() * 30 + 5
      },
      competitive_intelligence: [],
      market_trends: [],
      regulatory_concerns: []
    };
  }
  
  private generateAcademicKnowledge(character: any): any {
    return {
      field: character.profession?.industry || 'General Studies',
      institution: character.profession?.employer || 'University',
      research_areas: Object.keys(character.skills || {}),
      publications: [],
      ongoing_research: [],
      peer_network: [],
      conference_participation: []
    };
  }
  
  private generateMediaKnowledge(character: any): any {
    return {
      outlet: character.profession?.employer || 'News Network',
      beat: this.getMediaBeat(character),
      sources: [],
      investigative_leads: [],
      editorial_positions: [],
      audience_demographics: []
    };
  }
  
  // Helper methods for specialty knowledge generation
  private getGovernmentPolicyAreas(character: any): string[] {
    const job = character.profession?.current_job || '';
    if (job.includes('Treasury')) return ['Economic Policy', 'Fiscal Policy', 'Tax Policy'];
    if (job.includes('Defense')) return ['Defense Policy', 'Military Strategy', 'Security Policy'];
    if (job.includes('Foreign')) return ['Foreign Policy', 'Diplomacy', 'International Relations'];
    return ['General Policy', 'Administration'];
  }
  
  private getBudgetOversightAreas(character: any): string[] {
    const job = character.profession?.current_job || '';
    if (job.includes('Treasury')) return ['Government Budget', 'Tax Revenue', 'Fiscal Planning'];
    if (job.includes('Defense')) return ['Defense Budget', 'Military Procurement'];
    return ['Departmental Budget'];
  }
  
  private getMilitaryBranch(character: any): string {
    const branches = ['Space Navy', 'Planetary Defense Force', 'Special Operations', 'Intelligence'];
    return branches[Math.floor(Math.random() * branches.length)];
  }
  
  private getMilitaryRank(character: any): string {
    const level = character.profession?.career_level || 'mid';
    const ranks = {
      entry: ['Lieutenant', 'Ensign', 'Second Lieutenant'],
      mid: ['Captain', 'Major', 'Commander'],
      senior: ['Colonel', 'Captain', 'Brigadier General'],
      executive: ['General', 'Admiral', 'Field Marshal']
    };
    const rankList = ranks[level as keyof typeof ranks] || ranks.mid;
    return rankList[Math.floor(Math.random() * rankList.length)];
  }
  
  private getMilitarySecurityClearance(character: any): string {
    const clearances = ['Confidential', 'Secret', 'Top Secret', 'Ultra Secret'];
    const level = this.calculateClearanceLevel(character);
    if (level > 90) return 'Ultra Secret';
    if (level > 75) return 'Top Secret';
    if (level > 60) return 'Secret';
    return 'Confidential';
  }
  
  private getMilitaryOperationalAreas(character: any): string[] {
    return ['Sector Defense', 'Strategic Planning', 'Intelligence Operations'];
  }
  
  private getCompanySize(character: any): string {
    const sizes = ['Startup', 'Small Business', 'Medium Enterprise', 'Large Corporation', 'Mega Corporation'];
    const level = character.profession?.career_level || 'mid';
    if (level === 'executive') return sizes[Math.floor(Math.random() * 2) + 3]; // Large or Mega
    if (level === 'senior') return sizes[Math.floor(Math.random() * 2) + 2]; // Medium or Large
    return sizes[Math.floor(Math.random() * 3)]; // Startup to Medium
  }
  
  private getMarketPosition(character: any): string {
    const positions = ['Market Leader', 'Strong Competitor', 'Niche Player', 'Emerging Player'];
    return positions[Math.floor(Math.random() * positions.length)];
  }
  
  private generateRevenue(character: any): number {
    const level = character.profession?.career_level || 'mid';
    const multipliers = { entry: 1, mid: 10, senior: 100, executive: 1000 };
    const base = Math.random() * 100 + 50;
    return base * (multipliers[level as keyof typeof multipliers] || 10) * 1000000;
  }
  
  private getMediaBeat(character: any): string[] {
    const beats = ['Politics', 'Economics', 'Technology', 'Military', 'Social Issues', 'Environment'];
    const numBeats = Math.floor(Math.random() * 3) + 1;
    return beats.slice(0, numBeats);
  }
  
  private calculateSocialCircles(character: any): string[] {
    const circles = ['General Public'];
    const category = character.category || '';
    
    if (category === 'official') circles.push('Government Officials', 'Policy Makers');
    if (category === 'military') circles.push('Military Officers', 'Defense Personnel');
    if (category === 'business') circles.push('Business Leaders', 'Industry Executives');
    if (category === 'academic') circles.push('Academics', 'Researchers');
    if (category === 'media') circles.push('Journalists', 'Media Personnel');
    
    return circles;
  }
  
  private calculateInformationSources(character: any): string[] {
    const sources = ['Public News', 'Social Media'];
    const category = character.category || '';
    
    if (category === 'official') sources.push('Government Briefings', 'Internal Reports');
    if (category === 'military') sources.push('Intelligence Briefings', 'Military Communications');
    if (category === 'business') sources.push('Industry Reports', 'Market Intelligence');
    if (category === 'academic') sources.push('Research Publications', 'Academic Networks');
    if (category === 'media') sources.push('Press Releases', 'Source Networks');
    
    return sources;
  }
  
  private calculateCognitiveBiases(character: any): string[] {
    const biases = [];
    const traits = character.personality?.core_traits || [];
    
    if (traits.includes('ambitious')) biases.push('Optimism Bias');
    if (traits.includes('cautious')) biases.push('Loss Aversion');
    if (traits.includes('analytical')) biases.push('Confirmation Bias');
    if (traits.includes('empathetic')) biases.push('Halo Effect');
    
    return biases;
  }
  
  private filterGameStateByAccess(gameState: GameStateSnapshot, filters: any): Partial<GameStateSnapshot> {
    const filtered: any = {};
    
    // Always include basic public information
    filtered.gamePhase = gameState.gamePhase;
    filtered.playerCivilization = {
      name: gameState.playerCivilization.name,
      species: gameState.playerCivilization.species,
      government_type: gameState.playerCivilization.government_type
    };
    
    // Include information based on clearance level
    if (filters.security_clearance > 30) {
      filtered.economicSituation = gameState.economicSituation;
      filtered.socialSituation = gameState.socialSituation;
    }
    
    if (filters.security_clearance > 60) {
      filtered.politicalSituation = gameState.politicalSituation;
      filtered.militarySituation = gameState.militarySituation;
    }
    
    if (filters.security_clearance > 80) {
      filtered.technologySituation = gameState.technologySituation;
      filtered.storyContext = gameState.storyContext;
    }
    
    // Include information based on professional access
    if (filters.professional_access.includes('government_internal')) {
      filtered.politicalSituation = gameState.politicalSituation;
    }
    
    if (filters.professional_access.includes('military_intelligence')) {
      filtered.militarySituation = gameState.militarySituation;
    }
    
    if (filters.professional_access.includes('financial_information')) {
      filtered.economicSituation = gameState.economicSituation;
    }
    
    return filtered;
  }
  
  private generateProfessionalInsights(
    gameState: Partial<GameStateSnapshot>,
    specialtyKnowledge: SpecialtyKnowledge,
    prompt: string
  ): any[] {
    const insights = [];
    
    // Generate insights based on professional expertise
    if (specialtyKnowledge.government && gameState.politicalSituation) {
      insights.push({
        topic: 'Political Analysis',
        insight: 'Based on current political developments...',
        expertise_level: 85,
        source_of_knowledge: 'Government Experience'
      });
    }
    
    if (specialtyKnowledge.military && gameState.militarySituation) {
      insights.push({
        topic: 'Security Assessment',
        insight: 'From a military perspective...',
        expertise_level: 90,
        source_of_knowledge: 'Military Training'
      });
    }
    
    if (specialtyKnowledge.business && gameState.economicSituation) {
      insights.push({
        topic: 'Economic Impact',
        insight: 'The business implications suggest...',
        expertise_level: 80,
        source_of_knowledge: 'Industry Experience'
      });
    }
    
    return insights;
  }
  
  private async generateContextualResponse(
    prompt: string,
    context: CharacterAwarenessContext,
    gameState: Partial<GameStateSnapshot>,
    insights: any[]
  ): Promise<CharacterResponse> {
    // This would integrate with AI services to generate contextually aware responses
    // For now, return a structured response template
    
    return {
      response_text: `Based on my experience in ${context.specialtyKnowledge.profession.field} and current situation...`,
      emotional_tone: 'neutral',
      confidence_level: 75,
      specialty_insights: insights,
      game_state_awareness: [
        {
          aspect: 'Current Situation',
          character_knowledge: 'I\'m aware of the current developments...',
          personal_impact: 'This affects my work because...',
          professional_relevance: 'From my professional perspective...'
        }
      ],
      references_to_recent_events: [],
      professional_terminology: this.getProfessionalTerminology(context.specialtyKnowledge),
      personal_anecdotes: [],
      suggested_topics: ['Follow-up Questions', 'Related Issues'],
      information_requests: [],
      offers_to_help: ['I can provide more details on...'],
      character_growth: {
        new_knowledge_gained: [],
        relationship_changes: [],
        opinion_shifts: []
      }
    };
  }
  
  private getProfessionalTerminology(specialtyKnowledge: SpecialtyKnowledge): string[] {
    const terms = [];
    
    if (specialtyKnowledge.government) {
      terms.push('policy framework', 'regulatory compliance', 'budget allocation');
    }
    
    if (specialtyKnowledge.military) {
      terms.push('operational readiness', 'strategic assessment', 'threat analysis');
    }
    
    if (specialtyKnowledge.business) {
      terms.push('market dynamics', 'competitive advantage', 'ROI analysis');
    }
    
    if (specialtyKnowledge.academic) {
      terms.push('research methodology', 'peer review', 'empirical evidence');
    }
    
    if (specialtyKnowledge.media) {
      terms.push('source verification', 'editorial standards', 'public interest');
    }
    
    return terms;
  }
  
  /**
   * Clear caches to ensure fresh data
   */
  clearCaches(): void {
    this.gameStateCache.clear();
    this.specialtyKnowledgeCache.clear();
    this.characterContextCache.clear();
  }
  
  /**
   * Update game state cache with new information
   */
  updateGameState(campaignId: string, gameState: GameStateSnapshot): void {
    const cacheKey = `gamestate_${campaignId}`;
    this.gameStateCache.set(cacheKey, gameState);
  }
}


