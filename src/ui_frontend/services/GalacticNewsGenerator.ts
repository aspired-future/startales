import { GeneratedWitt, GameMasterPersonality } from './ContentGenerator';

export interface GalacticNewsContext {
  factionMovements?: FactionMovement[];
  tradeRoutes?: TradeRoute[];
  playerAchievements?: PlayerAchievement[];
  economicData?: EconomicData;
  allianceUpdates?: AllianceUpdate[];
  discoveries?: Discovery[];
  politicalEvents?: PoliticalEvent[];
}

export interface FactionMovement {
  factionId: string;
  factionName: string;
  movementType: 'MILITARY' | 'EXPANSION' | 'DIPLOMATIC' | 'ECONOMIC';
  location: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TradeRoute {
  routeId: string;
  origin: string;
  destination: string;
  status: 'ACTIVE' | 'DISRUPTED' | 'NEW' | 'CLOSED';
  commodities: string[];
  profitability: number;
}

export interface PlayerAchievement {
  playerId: string;
  playerName: string;
  achievementType: 'COLONIZATION' | 'BATTLE_VICTORY' | 'DISCOVERY' | 'ECONOMIC' | 'DIPLOMATIC' | 'TECHNOLOGICAL';
  description: string;
  location?: string;
  impact: 'PERSONAL' | 'LOCAL' | 'REGIONAL' | 'GALACTIC';
  timestamp: Date;
}

export interface EconomicData {
  marketTrends: MarketTrend[];
  resourceDiscoveries: ResourceDiscovery[];
  tradeOpportunities: TradeOpportunity[];
}

export interface MarketTrend {
  commodity: string;
  priceChange: number; // Percentage change
  volume: number;
  trend: 'RISING' | 'FALLING' | 'STABLE' | 'VOLATILE';
  forecast: string;
}

export interface ResourceDiscovery {
  resourceType: string;
  location: string;
  quantity: 'SMALL' | 'MODERATE' | 'LARGE' | 'MASSIVE';
  discoveredBy: string;
  marketImpact: 'MINIMAL' | 'MODERATE' | 'SIGNIFICANT' | 'REVOLUTIONARY';
}

export interface TradeOpportunity {
  commodity: string;
  buyLocation: string;
  sellLocation: string;
  profitMargin: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeWindow: string;
}

export interface AllianceUpdate {
  allianceId: string;
  allianceName: string;
  updateType: 'FORMATION' | 'DISSOLUTION' | 'EXPANSION' | 'CONFLICT' | 'COOPERATION' | 'RECRUITMENT';
  description: string;
  involvedParties: string[];
  impact: 'MINOR' | 'MODERATE' | 'MAJOR' | 'GAME_CHANGING';
}

export interface Discovery {
  discoveryType: 'SCIENTIFIC' | 'ARCHAEOLOGICAL' | 'TECHNOLOGICAL' | 'BIOLOGICAL' | 'ASTRONOMICAL';
  title: string;
  description: string;
  discoveredBy: string;
  location: string;
  significance: 'MINOR' | 'NOTABLE' | 'MAJOR' | 'REVOLUTIONARY';
}

export interface PoliticalEvent {
  eventType: 'ELECTION' | 'TREATY' | 'CONFLICT' | 'NEGOTIATION' | 'POLICY_CHANGE' | 'LEADERSHIP_CHANGE';
  title: string;
  description: string;
  involvedFactions: string[];
  impact: 'LOCAL' | 'REGIONAL' | 'GALACTIC';
  consequences: string[];
}

export class GalacticNewsGenerator {
  private personality: GameMasterPersonality;
  private newsTemplates: Map<string, string[]>;
  private simulatedInteractions: Map<string, SimulatedInteraction[]>;

  constructor(personality: GameMasterPersonality) {
    this.personality = personality;
    this.newsTemplates = new Map();
    this.simulatedInteractions = new Map();
    this.initializeNewsTemplates();
  }

  private initializeNewsTemplates() {
    // Galactic News Templates
    this.newsTemplates.set('FACTION_MOVEMENT', [
      "🚨 BREAKING: {faction_name} forces have been spotted near {location}! Intelligence suggests {movement_type} operations underway.",
      "⚔️ MILITARY UPDATE: {faction_name} has {action} in the {location} sector. Strategic implications are {impact_level}.",
      "🌍 EXPANSION ALERT: {faction_name} establishes new {facility_type} in {location}. Local populations {reaction}.",
      "🤝 DIPLOMATIC MOVEMENT: {faction_name} delegation arrives at {location} for {purpose}. Negotiations expected to {outcome}."
    ]);

    this.newsTemplates.set('TRADE_ROUTE', [
      "💰 TRADE ALERT: New {commodity} route discovered between {origin} and {destination}! Profit margins estimated at {profitability}%.",
      "⚠️ ROUTE DISRUPTION: {origin}-{destination} trade lane experiencing {disruption_type}. {commodity} prices expected to {price_change}.",
      "🚀 COMMERCE BOOM: {route_name} trade corridor sees {volume_change}% increase in traffic. {commodity} traders celebrating!",
      "📈 MARKET OPPORTUNITY: Savvy traders exploiting {commodity} shortage between {origin} and {destination}."
    ]);

    this.newsTemplates.set('PLAYER_ACHIEVEMENT', [
      "🎉 GALACTIC ACHIEVEMENT: Commander {player_name} successfully {achievement}! The {location} sector celebrates this historic moment.",
      "⭐ LEGENDARY STATUS: {player_name} becomes the first to {achievement} in {location}. Other players take note!",
      "🏆 BREAKTHROUGH: {player_name}'s {achievement} opens new possibilities for {impact_area}. Innovation at its finest!",
      "🌟 RISING STAR: {player_name} proves that {achievement} is possible. Inspiring the next generation of explorers!"
    ]);

    this.newsTemplates.set('ECONOMIC_UPDATE', [
      "📊 MARKET REPORT: {commodity} prices {trend_direction} by {percentage}% following {event}. Analysts predict {forecast}.",
      "💎 RESOURCE DISCOVERY: {quantity} {resource_type} deposits found in {location}! Market impact expected to be {impact_level}.",
      "🔄 TRADE OPPORTUNITY: Buy {commodity} in {buy_location}, sell in {sell_location} for {profit_margin}% profit. Risk level: {risk}.",
      "📈 ECONOMIC FORECAST: {sector} showing {trend} growth. Smart investors focusing on {opportunity_areas}."
    ]);

    this.newsTemplates.set('ALLIANCE_UPDATE', [
      "🤝 ALLIANCE NEWS: {alliance_name} {action} with {parties}. This {impact_level} development changes the political landscape.",
      "⚔️ FACTION CONFLICT: Tensions rise between {alliance_name} and {opposing_faction}. Diplomatic solutions being explored.",
      "🌟 COOPERATION SUCCESS: {alliance_name} joint operation in {location} achieves {success}. Unity proves powerful!",
      "📢 RECRUITMENT DRIVE: {alliance_name} seeks skilled commanders for {purpose}. Benefits include {benefits}."
    ]);

    this.newsTemplates.set('DISCOVERY', [
      "🔬 SCIENTIFIC BREAKTHROUGH: {discovery_title} discovered in {location}! This {significance_level} find could {implications}.",
      "🏛️ ARCHAEOLOGICAL WONDER: Ancient {artifact_type} unearthed in {location} by {discoverer}. Historians are {reaction}!",
      "🚀 TECHNOLOGICAL LEAP: New {technology_type} developed by {discoverer}. Applications include {applications}.",
      "👽 BIOLOGICAL MARVEL: Unique {species_type} found in {location}. Scientists studying {unique_properties}."
    ]);

    this.newsTemplates.set('POLITICAL_EVENT', [
      "🏛️ POLITICAL UPDATE: {event_title} in {location} results in {outcome}. {involved_factions} respond with {reactions}.",
      "📜 TREATY SIGNED: Historic {treaty_type} agreement between {parties}. Terms include {key_terms}.",
      "⚖️ POLICY CHANGE: New {policy_type} regulations affect {affected_areas}. Citizens react with {public_reaction}.",
      "👑 LEADERSHIP CHANGE: {new_leader} assumes control of {faction/location}. First priority: {priority}."
    ]);

    this.newsTemplates.set('ROLEPLAY_UPDATE', [
      "📖 CIVILIZATION CHRONICLE: {civilization_name} reports {development_type} in their {sector}. Cultural impact: {impact}.",
      "🎭 DIPLOMATIC RELATIONS: {faction_a} and {faction_b} {relationship_change}. Ambassador {diplomat_name} states: '{quote}'",
      "🏛️ CULTURAL DEVELOPMENT: {location} unveils new {cultural_project}. Citizens describe it as '{citizen_reaction}'.",
      "📚 HISTORICAL MOMENT: {event_description} marks a new chapter for {civilization_name}. Legacy secured!"
    ]);
  }

  async generateGalacticNews(context: GalacticNewsContext, maxItems: number = 10): Promise<GeneratedWitt[]> {
    const newsItems: GeneratedWitt[] = [];
    
    // Generate faction movement news
    if (context.factionMovements) {
      for (const movement of context.factionMovements.slice(0, 2)) {
        const newsItem = this.generateFactionMovementNews(movement);
        if (newsItem) newsItems.push(newsItem);
      }
    }

    // Generate trade route news
    if (context.tradeRoutes) {
      for (const route of context.tradeRoutes.slice(0, 2)) {
        const newsItem = this.generateTradeRouteNews(route);
        if (newsItem) newsItems.push(newsItem);
      }
    }

    // Generate player achievement news
    if (context.playerAchievements) {
      for (const achievement of context.playerAchievements.slice(0, 3)) {
        const newsItem = this.generatePlayerAchievementNews(achievement);
        if (newsItem) newsItems.push(newsItem);
      }
    }

    // Generate economic news
    if (context.economicData) {
      const economicNews = this.generateEconomicNews(context.economicData);
      newsItems.push(...economicNews.slice(0, 2));
    }

    // Generate alliance news
    if (context.allianceUpdates) {
      for (const update of context.allianceUpdates.slice(0, 2)) {
        const newsItem = this.generateAllianceNews(update);
        if (newsItem) newsItems.push(newsItem);
      }
    }

    // Generate discovery news
    if (context.discoveries) {
      for (const discovery of context.discoveries.slice(0, 2)) {
        const newsItem = this.generateDiscoveryNews(discovery);
        if (newsItem) newsItems.push(newsItem);
      }
    }

    // Generate political news
    if (context.politicalEvents) {
      for (const event of context.politicalEvents.slice(0, 2)) {
        const newsItem = this.generatePoliticalNews(event);
        if (newsItem) newsItems.push(newsItem);
      }
    }

    // Shuffle and limit results
    const shuffledNews = this.shuffleArray(newsItems);
    return shuffledNews.slice(0, maxItems);
  }

  private generateFactionMovementNews(movement: FactionMovement): GeneratedWitt | null {
    const templates = this.newsTemplates.get('FACTION_MOVEMENT');
    if (!templates) return null;

    const template = this.selectRandomTemplate(templates);
    const content = this.fillFactionMovementTemplate(template, movement);

    return {
      authorId: 'galactic_news_network',
      authorType: 'PERSONALITY',
      authorName: 'Galactic News Network',
      content,
      metadata: {
        gameContext: movement.location,
        relevantEntities: [movement.factionName, movement.location],
        personalityFactors: this.personality.traits
      },
      visibility: movement.impact === 'CRITICAL' ? 'UNIVERSAL' : 'TARGETED'
    };
  }

  private generateTradeRouteNews(route: TradeRoute): GeneratedWitt | null {
    const templates = this.newsTemplates.get('TRADE_ROUTE');
    if (!templates) return null;

    const template = this.selectRandomTemplate(templates);
    const content = this.fillTradeRouteTemplate(template, route);

    return {
      authorId: 'trade_intelligence_bureau',
      authorType: 'PERSONALITY',
      authorName: 'Trade Intelligence Bureau',
      content,
      metadata: {
        gameContext: `${route.origin}-${route.destination}`,
        relevantEntities: [route.origin, route.destination, ...route.commodities],
        personalityFactors: this.personality.traits
      },
      visibility: 'PERSONALIZED'
    };
  }

  private generatePlayerAchievementNews(achievement: PlayerAchievement): GeneratedWitt | null {
    const templates = this.newsTemplates.get('PLAYER_ACHIEVEMENT');
    if (!templates) return null;

    const template = this.selectRandomTemplate(templates);
    const content = this.fillPlayerAchievementTemplate(template, achievement);

    return {
      authorId: 'achievement_herald',
      authorType: 'PERSONALITY',
      authorName: 'Achievement Herald',
      content,
      metadata: {
        gameContext: achievement.location || 'Galaxy',
        relevantEntities: [achievement.playerName, achievement.location || 'Galaxy'],
        personalityFactors: this.personality.traits
      },
      visibility: achievement.impact === 'GALACTIC' ? 'UNIVERSAL' : 'PERSONALIZED'
    };
  }

  private generateEconomicNews(economicData: EconomicData): GeneratedWitt[] {
    const newsItems: GeneratedWitt[] = [];
    const templates = this.newsTemplates.get('ECONOMIC_UPDATE');
    if (!templates) return newsItems;

    // Market trends
    for (const trend of economicData.marketTrends.slice(0, 2)) {
      const template = this.selectRandomTemplate(templates);
      const content = this.fillMarketTrendTemplate(template, trend);
      
      newsItems.push({
        authorId: 'economic_analysis_corp',
        authorType: 'PERSONALITY',
        authorName: 'Economic Analysis Corp',
        content,
        metadata: {
          gameContext: 'Galactic Markets',
          relevantEntities: [trend.commodity],
          personalityFactors: this.personality.traits
        },
        visibility: 'PERSONALIZED'
      });
    }

    // Resource discoveries
    for (const discovery of economicData.resourceDiscoveries.slice(0, 1)) {
      const template = this.selectRandomTemplate(templates);
      const content = this.fillResourceDiscoveryTemplate(template, discovery);
      
      newsItems.push({
        authorId: 'resource_scouts_guild',
        authorType: 'PERSONALITY',
        authorName: 'Resource Scouts Guild',
        content,
        metadata: {
          gameContext: discovery.location,
          relevantEntities: [discovery.resourceType, discovery.location, discovery.discoveredBy],
          personalityFactors: this.personality.traits
        },
        visibility: discovery.marketImpact === 'REVOLUTIONARY' ? 'UNIVERSAL' : 'PERSONALIZED'
      });
    }

    return newsItems;
  }

  private generateAllianceNews(update: AllianceUpdate): GeneratedWitt | null {
    const templates = this.newsTemplates.get('ALLIANCE_UPDATE');
    if (!templates) return null;

    const template = this.selectRandomTemplate(templates);
    const content = this.fillAllianceUpdateTemplate(template, update);

    return {
      authorId: 'diplomatic_observer',
      authorType: 'PERSONALITY',
      authorName: 'Diplomatic Observer',
      content,
      metadata: {
        gameContext: 'Galactic Politics',
        relevantEntities: [update.allianceName, ...update.involvedParties],
        personalityFactors: this.personality.traits
      },
      visibility: update.impact === 'GAME_CHANGING' ? 'UNIVERSAL' : 'PERSONALIZED'
    };
  }

  private generateDiscoveryNews(discovery: Discovery): GeneratedWitt | null {
    const templates = this.newsTemplates.get('DISCOVERY');
    if (!templates) return null;

    const template = this.selectRandomTemplate(templates);
    const content = this.fillDiscoveryTemplate(template, discovery);

    return {
      authorId: 'science_chronicle',
      authorType: 'PERSONALITY',
      authorName: 'Science Chronicle',
      content,
      metadata: {
        gameContext: discovery.location,
        relevantEntities: [discovery.title, discovery.location, discovery.discoveredBy],
        personalityFactors: this.personality.traits
      },
      visibility: discovery.significance === 'REVOLUTIONARY' ? 'UNIVERSAL' : 'PERSONALIZED'
    };
  }

  private generatePoliticalNews(event: PoliticalEvent): GeneratedWitt | null {
    const templates = this.newsTemplates.get('POLITICAL_EVENT');
    if (!templates) return null;

    const template = this.selectRandomTemplate(templates);
    const content = this.fillPoliticalEventTemplate(template, event);

    return {
      authorId: 'political_correspondent',
      authorType: 'PERSONALITY',
      authorName: 'Political Correspondent',
      content,
      metadata: {
        gameContext: 'Galactic Politics',
        relevantEntities: [event.title, ...event.involvedFactions],
        personalityFactors: this.personality.traits
      },
      visibility: event.impact === 'GALACTIC' ? 'UNIVERSAL' : 'PERSONALIZED'
    };
  }

  // Template filling methods
  private fillFactionMovementTemplate(template: string, movement: FactionMovement): string {
    return template
      .replace('{faction_name}', movement.factionName)
      .replace('{location}', movement.location)
      .replace('{movement_type}', movement.movementType.toLowerCase())
      .replace('{impact_level}', movement.impact.toLowerCase())
      .replace('{action}', this.getMovementAction(movement.movementType))
      .replace('{facility_type}', this.getRandomFacilityType())
      .replace('{reaction}', this.getRandomReaction())
      .replace('{purpose}', this.getRandomDiplomaticPurpose())
      .replace('{outcome}', this.getRandomOutcome());
  }

  private fillTradeRouteTemplate(template: string, route: TradeRoute): string {
    return template
      .replace('{commodity}', route.commodities[0] || 'goods')
      .replace('{origin}', route.origin)
      .replace('{destination}', route.destination)
      .replace('{profitability}', route.profitability.toString())
      .replace('{disruption_type}', this.getRandomDisruption())
      .replace('{price_change}', route.profitability > 0 ? 'rise' : 'fall')
      .replace('{route_name}', `${route.origin}-${route.destination}`)
      .replace('{volume_change}', Math.abs(route.profitability).toString());
  }

  private fillPlayerAchievementTemplate(template: string, achievement: PlayerAchievement): string {
    return template
      .replace('{player_name}', achievement.playerName)
      .replace('{achievement}', achievement.description)
      .replace('{location}', achievement.location || 'the galaxy')
      .replace('{impact_area}', this.getImpactArea(achievement.achievementType));
  }

  private fillMarketTrendTemplate(template: string, trend: MarketTrend): string {
    return template
      .replace('{commodity}', trend.commodity)
      .replace('{trend_direction}', trend.priceChange > 0 ? 'rise' : 'fall')
      .replace('{percentage}', Math.abs(trend.priceChange).toString())
      .replace('{event}', this.getRandomMarketEvent())
      .replace('{forecast}', trend.forecast);
  }

  private fillResourceDiscoveryTemplate(template: string, discovery: ResourceDiscovery): string {
    return template
      .replace('{quantity}', discovery.quantity.toLowerCase())
      .replace('{resource_type}', discovery.resourceType)
      .replace('{location}', discovery.location)
      .replace('{impact_level}', discovery.marketImpact.toLowerCase());
  }

  private fillAllianceUpdateTemplate(template: string, update: AllianceUpdate): string {
    return template
      .replace('{alliance_name}', update.allianceName)
      .replace('{action}', this.getAllianceAction(update.updateType))
      .replace('{parties}', update.involvedParties.join(' and '))
      .replace('{impact_level}', update.impact.toLowerCase())
      .replace('{opposing_faction}', update.involvedParties[0] || 'rival faction')
      .replace('{success}', this.getRandomSuccess())
      .replace('{purpose}', this.getRandomPurpose())
      .replace('{benefits}', this.getRandomBenefits());
  }

  private fillDiscoveryTemplate(template: string, discovery: Discovery): string {
    return template
      .replace('{discovery_title}', discovery.title)
      .replace('{location}', discovery.location)
      .replace('{significance_level}', discovery.significance.toLowerCase())
      .replace('{implications}', this.getDiscoveryImplications(discovery.discoveryType))
      .replace('{artifact_type}', this.getRandomArtifactType())
      .replace('{discoverer}', discovery.discoveredBy)
      .replace('{reaction}', this.getRandomScientificReaction())
      .replace('{technology_type}', this.getRandomTechnologyType())
      .replace('{applications}', this.getRandomApplications())
      .replace('{species_type}', this.getRandomSpeciesType())
      .replace('{unique_properties}', this.getRandomProperties());
  }

  private fillPoliticalEventTemplate(template: string, event: PoliticalEvent): string {
    return template
      .replace('{event_title}', event.title)
      .replace('{location}', 'the galactic senate')
      .replace('{outcome}', this.getRandomPoliticalOutcome())
      .replace('{involved_factions}', event.involvedFactions.join(' and '))
      .replace('{reactions}', this.getRandomReactions())
      .replace('{treaty_type}', this.getRandomTreatyType())
      .replace('{parties}', event.involvedFactions.join(' and '))
      .replace('{key_terms}', this.getRandomTreatyTerms())
      .replace('{policy_type}', this.getRandomPolicyType())
      .replace('{affected_areas}', this.getRandomAffectedAreas())
      .replace('{public_reaction}', this.getRandomPublicReaction())
      .replace('{new_leader}', this.getRandomLeaderName())
      .replace('{faction/location}', event.involvedFactions[0] || 'the region')
      .replace('{priority}', this.getRandomPriority());
  }

  // Helper methods for random content
  private selectRandomTemplate(templates: string[]): string {
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getMovementAction(type: string): string {
    const actions = {
      MILITARY: 'deployed forces',
      EXPANSION: 'established presence',
      DIPLOMATIC: 'initiated talks',
      ECONOMIC: 'increased investment'
    };
    return actions[type as keyof typeof actions] || 'taken action';
  }

  private getRandomFacilityType(): string {
    const facilities = ['outpost', 'trading hub', 'research station', 'military base', 'diplomatic embassy'];
    return facilities[Math.floor(Math.random() * facilities.length)];
  }

  private getRandomReaction(): string {
    const reactions = ['welcome the development', 'express cautious optimism', 'remain watchful', 'celebrate the news'];
    return reactions[Math.floor(Math.random() * reactions.length)];
  }

  private getRandomDiplomaticPurpose(): string {
    const purposes = ['peace negotiations', 'trade discussions', 'alliance talks', 'territorial agreements'];
    return purposes[Math.floor(Math.random() * purposes.length)];
  }

  private getRandomOutcome(): string {
    const outcomes = ['succeed', 'face challenges', 'show promise', 'require careful navigation'];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  private getRandomDisruption(): string {
    const disruptions = ['pirate activity', 'technical difficulties', 'political tensions', 'resource shortages'];
    return disruptions[Math.floor(Math.random() * disruptions.length)];
  }

  private getImpactArea(achievementType: string): string {
    const areas = {
      COLONIZATION: 'galactic expansion',
      BATTLE_VICTORY: 'military strategy',
      DISCOVERY: 'scientific advancement',
      ECONOMIC: 'trade and commerce',
      DIPLOMATIC: 'interstellar relations',
      TECHNOLOGICAL: 'innovation and progress'
    };
    return areas[achievementType as keyof typeof areas] || 'galactic development';
  }

  private getRandomMarketEvent(): string {
    const events = ['supply disruptions', 'increased demand', 'new trade agreements', 'technological breakthroughs'];
    return events[Math.floor(Math.random() * events.length)];
  }

  private getAllianceAction(type: string): string {
    const actions = {
      FORMATION: 'formed an alliance',
      DISSOLUTION: 'ended their partnership',
      EXPANSION: 'welcomed new members',
      CONFLICT: 'entered into dispute',
      COOPERATION: 'strengthened ties',
      RECRUITMENT: 'opened recruitment'
    };
    return actions[type as keyof typeof actions] || 'made changes';
  }

  private getRandomSuccess(): string {
    const successes = ['outstanding results', 'remarkable progress', 'unprecedented cooperation', 'strategic victory'];
    return successes[Math.floor(Math.random() * successes.length)];
  }

  private getRandomPurpose(): string {
    const purposes = ['expansion efforts', 'defensive operations', 'exploration missions', 'trade initiatives'];
    return purposes[Math.floor(Math.random() * purposes.length)];
  }

  private getRandomBenefits(): string {
    const benefits = ['advanced technology access', 'strategic positioning', 'resource sharing', 'mutual defense'];
    return benefits[Math.floor(Math.random() * benefits.length)];
  }

  private getDiscoveryImplications(type: string): string {
    const implications = {
      SCIENTIFIC: 'revolutionize our understanding',
      ARCHAEOLOGICAL: 'rewrite galactic history',
      TECHNOLOGICAL: 'transform daily life',
      BIOLOGICAL: 'advance medical science',
      ASTRONOMICAL: 'expand exploration possibilities'
    };
    return implications[type as keyof typeof implications] || 'change everything';
  }

  private getRandomArtifactType(): string {
    const artifacts = ['temple complex', 'technological device', 'cultural monument', 'mysterious structure'];
    return artifacts[Math.floor(Math.random() * artifacts.length)];
  }

  private getRandomScientificReaction(): string {
    const reactions = ['ecstatic', 'amazed', 'puzzled but excited', 'working around the clock'];
    return reactions[Math.floor(Math.random() * reactions.length)];
  }

  private getRandomTechnologyType(): string {
    const technologies = ['propulsion system', 'communication device', 'energy source', 'manufacturing process'];
    return technologies[Math.floor(Math.random() * technologies.length)];
  }

  private getRandomApplications(): string {
    const applications = ['faster travel', 'improved communication', 'enhanced security', 'better resource management'];
    return applications[Math.floor(Math.random() * applications.length)];
  }

  private getRandomSpeciesType(): string {
    const species = ['intelligent organism', 'symbiotic life form', 'energy-based entity', 'crystalline being'];
    return species[Math.floor(Math.random() * species.length)];
  }

  private getRandomProperties(): string {
    const properties = ['telepathic abilities', 'energy manipulation', 'rapid adaptation', 'collective consciousness'];
    return properties[Math.floor(Math.random() * properties.length)];
  }

  private getRandomPoliticalOutcome(): string {
    const outcomes = ['significant policy changes', 'new leadership appointments', 'revised trade agreements', 'diplomatic breakthroughs'];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  private getRandomReactions(): string {
    const reactions = ['measured responses', 'enthusiastic support', 'cautious optimism', 'strategic planning'];
    return reactions[Math.floor(Math.random() * reactions.length)];
  }

  private getRandomTreatyType(): string {
    const treaties = ['non-aggression pact', 'trade agreement', 'mutual defense treaty', 'cultural exchange accord'];
    return treaties[Math.floor(Math.random() * treaties.length)];
  }

  private getRandomTreatyTerms(): string {
    const terms = ['resource sharing protocols', 'territorial boundaries', 'technology exchange', 'dispute resolution mechanisms'];
    return terms[Math.floor(Math.random() * terms.length)];
  }

  private getRandomPolicyType(): string {
    const policies = ['trade regulation', 'security protocol', 'environmental protection', 'technological standard'];
    return policies[Math.floor(Math.random() * policies.length)];
  }

  private getRandomAffectedAreas(): string {
    const areas = ['all major trade routes', 'frontier territories', 'core worlds', 'industrial sectors'];
    return areas[Math.floor(Math.random() * areas.length)];
  }

  private getRandomPublicReaction(): string {
    const reactions = ['widespread approval', 'mixed feelings', 'cautious acceptance', 'enthusiastic support'];
    return reactions[Math.floor(Math.random() * reactions.length)];
  }

  private getRandomLeaderName(): string {
    const names = ['Admiral Starweaver', 'Governor Nebulos', 'Commander Voidstrike', 'Chancellor Cosmicwind'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private getRandomPriority(): string {
    const priorities = ['economic recovery', 'military modernization', 'diplomatic outreach', 'technological advancement'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  }
}

export interface SimulatedInteraction {
  type: 'LIKE' | 'SHARE' | 'COMMENT';
  authorId: string;
  authorName: string;
  authorType: string;
  content?: string; // For comments
  timestamp: Date;
  likes?: number; // For comment likes
}

export default GalacticNewsGenerator;
