/**
 * Real-time Game State Integration for Character Awareness
 * 
 * Monitors game state changes and updates character contexts in real-time
 */

import { EventEmitter } from 'events';
import { GameStateAwarenessService, GameStateSnapshot } from './GameStateAwareness';
import { ContextualCharacterAI } from './ContextualCharacterAI';

export interface GameStateChange {
  type: 'political' | 'economic' | 'military' | 'social' | 'technological' | 'environmental';
  category: string;
  description: string;
  impact_level: 'minor' | 'moderate' | 'major' | 'critical';
  affected_areas: string[];
  timestamp: Date;
  data: any;
}

export interface CharacterNotification {
  characterId: string;
  notificationType: 'information_update' | 'relevant_event' | 'professional_alert' | 'security_briefing';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  requires_response?: boolean;
  confidentiality_level?: 'public' | 'internal' | 'confidential' | 'classified';
}

export class GameStateIntegration extends EventEmitter {
  private gameStateService: GameStateAwarenessService;
  private contextualAI: ContextualCharacterAI;
  private activeCharacters: Map<string, any> = new Map();
  private gameStateHistory: GameStateSnapshot[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private lastGameStateUpdate: Date = new Date();
  
  constructor() {
    super();
    this.gameStateService = new GameStateAwarenessService();
    this.contextualAI = new ContextualCharacterAI();
  }
  
  /**
   * Start monitoring game state changes
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }
    
    console.log('🎮 Starting game state monitoring for character awareness...');
    
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkGameStateChanges();
      } catch (error) {
        console.error('❌ Error monitoring game state:', error);
      }
    }, intervalMs);
    
    // Initial check
    this.checkGameStateChanges();
  }
  
  /**
   * Stop monitoring game state changes
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛑 Stopped game state monitoring');
    }
  }
  
  /**
   * Register character for game state awareness
   */
  registerCharacter(characterId: string, character: any): void {
    this.activeCharacters.set(characterId, character);
    console.log(`👤 Registered character ${character.name?.full_display || characterId} for game state awareness`);
  }
  
  /**
   * Unregister character from game state awareness
   */
  unregisterCharacter(characterId: string): void {
    this.activeCharacters.delete(characterId);
    console.log(`👤 Unregistered character ${characterId} from game state awareness`);
  }
  
  /**
   * Manually trigger game state update
   */
  async triggerGameStateUpdate(campaignId: string = 'default_campaign'): Promise<void> {
    console.log('🔄 Manually triggering game state update...');
    await this.processGameStateUpdate(campaignId);
  }
  
  /**
   * Inject specific game event for character awareness
   */
  async injectGameEvent(event: GameStateChange, campaignId: string = 'default_campaign'): Promise<void> {
    console.log(`📢 Injecting game event: ${event.description}`);
    
    // Update game state with new event
    const currentGameState = await this.gameStateService.getCurrentGameState(campaignId);
    currentGameState.recentEvents.push({
      id: `event_${Date.now()}`,
      type: event.type,
      title: event.category,
      description: event.description,
      impact_level: event.impact_level,
      affected_areas: event.affected_areas,
      timestamp: event.timestamp,
      public_reaction: this.generatePublicReaction(event)
    });
    
    // Update game state cache
    this.gameStateService.updateGameState(campaignId, currentGameState);
    
    // Notify relevant characters
    await this.notifyRelevantCharacters(event, campaignId);
    
    // Emit event for external listeners
    this.emit('gameStateChange', event);
  }
  
  /**
   * Check for game state changes and update character awareness
   */
  private async checkGameStateChanges(campaignId: string = 'default_campaign'): Promise<void> {
    try {
      const currentGameState = await this.gameStateService.getCurrentGameState(campaignId);
      
      // Compare with previous state to detect changes
      const changes = this.detectGameStateChanges(currentGameState);
      
      if (changes.length > 0) {
        console.log(`🎯 Detected ${changes.length} game state changes`);
        
        // Process each change
        for (const change of changes) {
          await this.processGameStateChange(change, campaignId);
        }
        
        // Update last update timestamp
        this.lastGameStateUpdate = new Date();
      }
      
      // Store current state for next comparison
      this.gameStateHistory.push(currentGameState);
      
      // Keep only recent history (last 10 states)
      if (this.gameStateHistory.length > 10) {
        this.gameStateHistory.shift();
      }
      
    } catch (error) {
      console.error('❌ Error checking game state changes:', error);
    }
  }
  
  /**
   * Detect changes between current and previous game state
   */
  private detectGameStateChanges(currentState: GameStateSnapshot): GameStateChange[] {
    const changes: GameStateChange[] = [];
    
    if (this.gameStateHistory.length === 0) {
      // First run, no changes to detect
      return changes;
    }
    
    const previousState = this.gameStateHistory[this.gameStateHistory.length - 1];
    
    // Check for political changes
    if (currentState.politicalSituation.activeWars.length !== previousState.politicalSituation.activeWars.length) {
      changes.push({
        type: 'political',
        category: 'Military Conflict',
        description: currentState.politicalSituation.activeWars.length > previousState.politicalSituation.activeWars.length 
          ? 'New military conflict has begun' 
          : 'Military conflict has ended',
        impact_level: 'major',
        affected_areas: ['Military', 'Diplomacy', 'Public Opinion'],
        timestamp: new Date(),
        data: { 
          current_wars: currentState.politicalSituation.activeWars.length,
          previous_wars: previousState.politicalSituation.activeWars.length
        }
      });
    }
    
    // Check for economic changes
    const economicChange = Math.abs(currentState.economicSituation.gdp - previousState.economicSituation.gdp) / previousState.economicSituation.gdp;
    if (economicChange > 0.05) { // 5% change threshold
      changes.push({
        type: 'economic',
        category: 'GDP Change',
        description: currentState.economicSituation.gdp > previousState.economicSituation.gdp 
          ? 'Significant economic growth detected' 
          : 'Economic decline detected',
        impact_level: economicChange > 0.15 ? 'critical' : economicChange > 0.10 ? 'major' : 'moderate',
        affected_areas: ['Economy', 'Employment', 'Public Welfare'],
        timestamp: new Date(),
        data: {
          current_gdp: currentState.economicSituation.gdp,
          previous_gdp: previousState.economicSituation.gdp,
          change_percentage: economicChange * 100
        }
      });
    }
    
    // Check for social changes
    const happinessChange = Math.abs(currentState.socialSituation.population_happiness - previousState.socialSituation.population_happiness);
    if (happinessChange > 10) { // 10 point change threshold
      changes.push({
        type: 'social',
        category: 'Population Mood',
        description: currentState.socialSituation.population_happiness > previousState.socialSituation.population_happiness 
          ? 'Population happiness has increased significantly' 
          : 'Population happiness has declined',
        impact_level: happinessChange > 25 ? 'major' : 'moderate',
        affected_areas: ['Social Stability', 'Political Support', 'Public Order'],
        timestamp: new Date(),
        data: {
          current_happiness: currentState.socialSituation.population_happiness,
          previous_happiness: previousState.socialSituation.population_happiness,
          change: happinessChange
        }
      });
    }
    
    // Check for military changes
    if (currentState.militarySituation.threat_level !== previousState.militarySituation.threat_level) {
      changes.push({
        type: 'military',
        category: 'Threat Level',
        description: `Threat level changed from ${previousState.militarySituation.threat_level} to ${currentState.militarySituation.threat_level}`,
        impact_level: this.getThreatLevelImpact(currentState.militarySituation.threat_level),
        affected_areas: ['National Security', 'Military Readiness', 'Public Safety'],
        timestamp: new Date(),
        data: {
          current_threat: currentState.militarySituation.threat_level,
          previous_threat: previousState.militarySituation.threat_level
        }
      });
    }
    
    // Check for new events
    const newEvents = currentState.recentEvents.filter(event => 
      !previousState.recentEvents.some(prevEvent => prevEvent.id === event.id)
    );
    
    for (const event of newEvents) {
      changes.push({
        type: event.type,
        category: event.title,
        description: event.description,
        impact_level: event.impact_level,
        affected_areas: event.affected_areas,
        timestamp: event.timestamp,
        data: event
      });
    }
    
    return changes;
  }
  
  /**
   * Process a specific game state change
   */
  private async processGameStateChange(change: GameStateChange, campaignId: string): Promise<void> {
    console.log(`🔄 Processing game state change: ${change.description}`);
    
    // Notify relevant characters
    await this.notifyRelevantCharacters(change, campaignId);
    
    // Update character knowledge
    await this.updateCharacterKnowledge(change);
    
    // Emit change event
    this.emit('gameStateChange', change);
  }
  
  /**
   * Notify characters relevant to a game state change
   */
  private async notifyRelevantCharacters(change: GameStateChange, campaignId: string): Promise<void> {
    const notifications: CharacterNotification[] = [];
    
    for (const [characterId, character] of this.activeCharacters) {
      const relevance = this.calculateChangeRelevance(change, character);
      
      if (relevance.isRelevant) {
        const notification = this.createCharacterNotification(
          characterId,
          character,
          change,
          relevance
        );
        
        notifications.push(notification);
        
        // Update character's knowledge
        await this.contextualAI.updateCharacterKnowledge(characterId, {
          type: change.type,
          content: change.description,
          source: 'Game State Monitor',
          reliability: 95,
          timestamp: change.timestamp
        });
      }
    }
    
    if (notifications.length > 0) {
      console.log(`📬 Generated ${notifications.length} character notifications`);
      this.emit('characterNotifications', notifications);
    }
  }
  
  /**
   * Calculate how relevant a change is to a specific character
   */
  private calculateChangeRelevance(change: GameStateChange, character: any): any {
    let relevanceScore = 0;
    const reasons: string[] = [];
    
    const profession = character.profession?.current_job || '';
    const category = character.category || '';
    const skills = Object.keys(character.skills || {});
    
    // Professional relevance
    if (change.type === 'political' && (category === 'official' || profession.includes('minister'))) {
      relevanceScore += 80;
      reasons.push('Government official - directly relevant to political changes');
    }
    
    if (change.type === 'military' && category === 'military') {
      relevanceScore += 90;
      reasons.push('Military personnel - critical security information');
    }
    
    if (change.type === 'economic' && (category === 'business' || profession.includes('economic'))) {
      relevanceScore += 75;
      reasons.push('Business/economic professional - relevant to economic changes');
    }
    
    if (change.type === 'technological' && (category === 'academic' || skills.includes('technology'))) {
      relevanceScore += 70;
      reasons.push('Academic/technical background - relevant to technological developments');
    }
    
    if (change.type === 'social' && category === 'media') {
      relevanceScore += 65;
      reasons.push('Media professional - relevant for public interest stories');
    }
    
    // Impact level relevance
    if (change.impact_level === 'critical') {
      relevanceScore += 30;
      reasons.push('Critical impact - affects everyone');
    } else if (change.impact_level === 'major') {
      relevanceScore += 20;
      reasons.push('Major impact - significant public interest');
    }
    
    // Location relevance
    const characterLocation = character.location?.current || character.location?.home || '';
    if (change.affected_areas.some(area => characterLocation.includes(area))) {
      relevanceScore += 25;
      reasons.push('Local area affected');
    }
    
    // Clearance level for sensitive information
    const clearanceLevel = this.calculateCharacterClearance(character);
    if (change.type === 'military' && clearanceLevel < 60) {
      relevanceScore -= 40; // Reduce relevance for classified military info
      reasons.push('Limited security clearance');
    }
    
    return {
      isRelevant: relevanceScore >= 50,
      score: relevanceScore,
      reasons,
      priority: this.calculateNotificationPriority(relevanceScore, change.impact_level)
    };
  }
  
  /**
   * Create character notification for a game state change
   */
  private createCharacterNotification(
    characterId: string,
    character: any,
    change: GameStateChange,
    relevance: any
  ): CharacterNotification {
    
    const notificationType = this.determineNotificationType(change, character);
    const confidentialityLevel = this.determineConfidentialityLevel(change, character);
    
    return {
      characterId,
      notificationType,
      priority: relevance.priority,
      title: this.generateNotificationTitle(change, character),
      content: this.generateNotificationContent(change, character, relevance),
      source: 'Game State Monitor',
      timestamp: change.timestamp,
      requires_response: change.impact_level === 'critical' && relevance.score > 80,
      confidentiality_level: confidentialityLevel
    };
  }
  
  /**
   * Update character knowledge based on game state change
   */
  private async updateCharacterKnowledge(change: GameStateChange): Promise<void> {
    const updatePromises = Array.from(this.activeCharacters.entries()).map(async ([characterId, character]) => {
      const relevance = this.calculateChangeRelevance(change, character);
      
      if (relevance.isRelevant) {
        await this.contextualAI.updateCharacterKnowledge(characterId, {
          type: change.type,
          content: `${change.category}: ${change.description}`,
          source: 'Real-time Game Monitor',
          reliability: 90,
          timestamp: change.timestamp
        });
      }
    });
    
    await Promise.all(updatePromises);
  }
  
  // Helper methods
  private getThreatLevelImpact(threatLevel: string): 'minor' | 'moderate' | 'major' | 'critical' {
    switch (threatLevel) {
      case 'critical': return 'critical';
      case 'high': return 'major';
      case 'moderate': return 'moderate';
      case 'low': return 'minor';
      default: return 'moderate';
    }
  }
  
  private calculateCharacterClearance(character: any): number {
    const profession = character.profession?.current_job || '';
    const category = character.category || '';
    
    if (category === 'official' || profession.includes('minister')) return 75;
    if (category === 'military') return 80;
    if (category === 'business' && character.profession?.career_level === 'executive') return 60;
    if (category === 'academic') return 50;
    if (category === 'media') return 40;
    
    return 25;
  }
  
  private calculateNotificationPriority(
    relevanceScore: number, 
    impactLevel: string
  ): 'low' | 'normal' | 'high' | 'urgent' {
    if (impactLevel === 'critical' && relevanceScore > 80) return 'urgent';
    if (impactLevel === 'major' && relevanceScore > 70) return 'high';
    if (relevanceScore > 60) return 'high';
    if (relevanceScore > 50) return 'normal';
    return 'low';
  }
  
  private determineNotificationType(
    change: GameStateChange, 
    character: any
  ): 'information_update' | 'relevant_event' | 'professional_alert' | 'security_briefing' {
    
    const category = character.category || '';
    
    if (change.type === 'military' && category === 'military') return 'security_briefing';
    if (change.impact_level === 'critical') return 'professional_alert';
    if (this.calculateChangeRelevance(change, character).score > 70) return 'relevant_event';
    
    return 'information_update';
  }
  
  private determineConfidentialityLevel(
    change: GameStateChange, 
    character: any
  ): 'public' | 'internal' | 'confidential' | 'classified' {
    
    if (change.type === 'military' && change.impact_level === 'critical') return 'classified';
    if (change.type === 'political' && character.category === 'official') return 'confidential';
    if (change.impact_level === 'major') return 'internal';
    
    return 'public';
  }
  
  private generateNotificationTitle(change: GameStateChange, character: any): string {
    const profession = character.profession?.current_job || 'Professional';
    
    switch (change.type) {
      case 'political':
        return `Political Update: ${change.category}`;
      case 'military':
        return `Security Alert: ${change.category}`;
      case 'economic':
        return `Economic Update: ${change.category}`;
      case 'social':
        return `Social Development: ${change.category}`;
      case 'technological':
        return `Technology Update: ${change.category}`;
      default:
        return `Important Update: ${change.category}`;
    }
  }
  
  private generateNotificationContent(
    change: GameStateChange, 
    character: any, 
    relevance: any
  ): string {
    
    let content = change.description;
    
    // Add professional context
    const profession = character.profession?.current_job || '';
    if (profession) {
      content += `\n\nAs ${profession}, this development may affect your work in the following areas: ${change.affected_areas.join(', ')}.`;
    }
    
    // Add relevance explanation
    if (relevance.reasons.length > 0) {
      content += `\n\nRelevance: ${relevance.reasons.join('; ')}.`;
    }
    
    // Add impact assessment
    content += `\n\nImpact Level: ${change.impact_level.toUpperCase()}`;
    
    return content;
  }
  
  private generatePublicReaction(event: GameStateChange): string {
    const reactions = {
      political: ['Public debate intensifies', 'Citizens express mixed reactions', 'Political analysts weigh in'],
      military: ['Security concerns raised', 'Public calls for transparency', 'Defense experts provide analysis'],
      economic: ['Market responds to news', 'Economic analysts assess impact', 'Business leaders react'],
      social: ['Social media buzzes with discussion', 'Community leaders respond', 'Public opinion divided'],
      technological: ['Tech community excited', 'Experts discuss implications', 'Innovation praised'],
      environmental: ['Environmental groups respond', 'Scientists provide analysis', 'Public awareness increases']
    };
    
    const typeReactions = reactions[event.type] || reactions.social;
    return typeReactions[Math.floor(Math.random() * typeReactions.length)];
  }
  
  /**
   * Process manual game state update
   */
  private async processGameStateUpdate(campaignId: string): Promise<void> {
    // This would integrate with actual game state systems
    // For now, simulate some changes
    
    const mockChanges: GameStateChange[] = [
      {
        type: 'economic',
        category: 'Budget Announcement',
        description: 'Treasury Secretary announces new budget allocation priorities',
        impact_level: 'moderate',
        affected_areas: ['Government Spending', 'Public Services', 'Economic Policy'],
        timestamp: new Date(),
        data: { budget_increase: 5.2 }
      },
      {
        type: 'political',
        category: 'Diplomatic Meeting',
        description: 'High-level diplomatic meeting scheduled with neighboring civilization',
        impact_level: 'moderate',
        affected_areas: ['Foreign Relations', 'Trade', 'Security'],
        timestamp: new Date(),
        data: { meeting_type: 'bilateral', participants: 2 }
      }
    ];
    
    for (const change of mockChanges) {
      await this.processGameStateChange(change, campaignId);
    }
  }
  
  /**
   * Get monitoring status and statistics
   */
  getMonitoringStatus(): any {
    return {
      is_monitoring: this.monitoringInterval !== null,
      active_characters: this.activeCharacters.size,
      last_update: this.lastGameStateUpdate,
      game_state_history_length: this.gameStateHistory.length,
      registered_characters: Array.from(this.activeCharacters.keys())
    };
  }
}


