/**
 * Natural Language Integrator
 * 
 * Integrates leader communications with existing simulation systems,
 * enabling natural language flows to influence deterministic calculations
 * and vice versa.
 */

import { leaderBriefingEngine } from './LeaderBriefingEngine.js';
import { leaderSpeechEngine } from './LeaderSpeechEngine.js';
import { decisionSupportEngine } from './DecisionSupportEngine.js';
import { hybridSimulationEngine } from '../hybrid-simulation/HybridSimulationEngine.js';
import { civilizationVectorMemory } from '../memory/CivilizationVectorMemory.js';
import { db } from '../storage/db.js';
import { 
  LeaderBriefing, 
  LeaderSpeech, 
  PendingDecision,
  SimulationInfluence,
  NaturalLanguageContext,
  SystemIntegrationEvent
} from './types.js';

/**
 * Natural Language Integrator Class
 * 
 * Orchestrates the bidirectional flow between natural language communications
 * and deterministic simulation systems.
 */
export class NaturalLanguageIntegrator {
  private integrationHistory: SystemIntegrationEvent[] = [];
  
  /**
   * Process simulation tick with natural language integration
   */
  async processTickIntegration(
    campaignId: number,
    tickId: number,
    simulationResults: any
  ): Promise<{
    briefings: LeaderBriefing[];
    speeches: LeaderSpeech[];
    decisions: PendingDecision[];
    influences: SimulationInfluence[];
  }> {
    console.log(`🔄 Processing natural language integration for tick ${tickId}`);
    
    try {
      // 1. Generate context from simulation results
      const nlContext = await this.generateNaturalLanguageContext(
        campaignId, 
        tickId, 
        simulationResults
      );
      
      // 2. Generate automatic briefings based on significant events
      const briefings = await this.generateAutomaticBriefings(
        campaignId, 
        tickId, 
        nlContext
      );
      
      // 3. Generate pending decisions based on simulation state
      const decisions = await this.generatePendingDecisions(
        campaignId, 
        tickId, 
        nlContext
      );
      
      // 4. Process any scheduled speeches
      const speeches = await this.processScheduledSpeeches(
        campaignId, 
        tickId
      );
      
      // 5. Calculate simulation influences from recent communications
      const influences = await this.calculateSimulationInfluences(
        campaignId, 
        tickId
      );
      
      // 6. Store integration event
      await this.recordIntegrationEvent({
        id: `integration-${campaignId}-${tickId}-${Date.now()}`,
        campaignId,
        tickId,
        timestamp: new Date(),
        briefingsGenerated: briefings.length,
        speechesProcessed: speeches.length,
        decisionsCreated: decisions.length,
        influencesApplied: influences.length,
        context: nlContext,
        success: true
      });
      
      console.log(`✅ Natural language integration complete: ${briefings.length} briefings, ${speeches.length} speeches, ${decisions.length} decisions, ${influences.length} influences`);
      
      return {
        briefings,
        speeches,
        decisions,
        influences
      };
      
    } catch (error) {
      console.error('❌ Natural language integration failed:', error);
      
      // Record failed integration
      await this.recordIntegrationEvent({
        id: `integration-${campaignId}-${tickId}-${Date.now()}`,
        campaignId,
        tickId,
        timestamp: new Date(),
        briefingsGenerated: 0,
        speechesProcessed: 0,
        decisionsCreated: 0,
        influencesApplied: 0,
        context: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
  
  /**
   * Generate natural language context from simulation results
   */
  private async generateNaturalLanguageContext(
    campaignId: number,
    tickId: number,
    simulationResults: any
  ): Promise<NaturalLanguageContext> {
    // Extract key metrics and changes
    const economicChanges = this.analyzeEconomicChanges(simulationResults);
    const socialChanges = this.analyzeSocialChanges(simulationResults);
    const politicalChanges = this.analyzePoliticalChanges(simulationResults);
    const militaryChanges = this.analyzeMilitaryChanges(simulationResults);
    
    // Get recent civilization memory for context
    const recentMemory = await civilizationVectorMemory.searchMemories(
      `civilization-${campaignId}`,
      'Recent significant events and developments',
      {
        limit: 10,
        minScore: 0.7,
        timeRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          end: new Date()
        }
      }
    );
    
    return {
      campaignId,
      tickId,
      timestamp: new Date(),
      economicSituation: {
        gdpChange: economicChanges.gdpChange,
        unemploymentRate: economicChanges.unemploymentRate,
        inflationRate: economicChanges.inflationRate,
        tradeBalance: economicChanges.tradeBalance,
        keyTrends: economicChanges.trends,
        significance: economicChanges.significance
      },
      socialDynamics: {
        populationMood: socialChanges.mood,
        approvalRating: socialChanges.approvalRating,
        socialUnrest: socialChanges.unrest,
        culturalShifts: socialChanges.culturalShifts,
        keyEvents: socialChanges.events,
        significance: socialChanges.significance
      },
      politicalClimate: {
        stabilityIndex: politicalChanges.stability,
        coalitionStrength: politicalChanges.coalitionStrength,
        oppositionActivity: politicalChanges.opposition,
        policyEffectiveness: politicalChanges.policyEffectiveness,
        upcomingEvents: politicalChanges.upcomingEvents,
        significance: politicalChanges.significance
      },
      securityStatus: {
        threatLevel: militaryChanges.threatLevel,
        militaryReadiness: militaryChanges.readiness,
        internalSecurity: militaryChanges.internalSecurity,
        diplomaticTensions: militaryChanges.diplomaticTensions,
        activeConflicts: militaryChanges.conflicts,
        significance: militaryChanges.significance
      },
      recentContext: recentMemory.map(memory => ({
        content: memory.content,
        timestamp: memory.timestamp,
        relevance: memory.score
      })),
      overallSignificance: Math.max(
        economicChanges.significance,
        socialChanges.significance,
        politicalChanges.significance,
        militaryChanges.significance
      )
    };
  }
  
  /**
   * Generate automatic briefings for significant events
   */
  private async generateAutomaticBriefings(
    campaignId: number,
    tickId: number,
    context: NaturalLanguageContext
  ): Promise<LeaderBriefing[]> {
    const briefings: LeaderBriefing[] = [];
    
    // Generate briefings based on significance thresholds
    if (context.overallSignificance >= 0.8) {
      // Critical situation briefing
      const briefing = await leaderBriefingEngine.generateBriefing({
        campaignId,
        tickId,
        leaderCharacterId: 'leader-1',
        type: 'crisis',
        priority: 'critical',
        detailLevel: 'comprehensive',
        includeRecommendations: true,
        includeDecisionSupport: true,
        recentEvents: context.recentContext.map(ctx => ctx.content),
        timeframe: '24h'
      });
      briefings.push(briefing);
      
    } else if (context.overallSignificance >= 0.6) {
      // Important developments briefing
      const briefing = await leaderBriefingEngine.generateBriefing({
        campaignId,
        tickId,
        leaderCharacterId: 'leader-1',
        type: 'strategic',
        priority: 'important',
        detailLevel: 'standard',
        includeRecommendations: true,
        includeDecisionSupport: false,
        recentEvents: context.recentContext.slice(0, 5).map(ctx => ctx.content),
        timeframe: '3d'
      });
      briefings.push(briefing);
      
    } else if (tickId % 10 === 0) {
      // Regular daily briefing every 10 ticks
      const briefing = await leaderBriefingEngine.generateBriefing({
        campaignId,
        tickId,
        leaderCharacterId: 'leader-1',
        type: 'daily',
        priority: 'routine',
        detailLevel: 'summary',
        includeRecommendations: false,
        includeDecisionSupport: false,
        timeframe: '24h'
      });
      briefings.push(briefing);
    }
    
    return briefings;
  }
  
  /**
   * Generate pending decisions based on simulation context
   */
  private async generatePendingDecisions(
    campaignId: number,
    tickId: number,
    context: NaturalLanguageContext
  ): Promise<PendingDecision[]> {
    const decisions: PendingDecision[] = [];
    
    // Economic decisions
    if (context.economicSituation.significance >= 0.7) {
      if (context.economicSituation.unemploymentRate > 0.1) {
        const decision = await decisionSupportEngine.generateDecisionSupport({
          campaignId,
          tickId,
          leaderCharacterId: 'leader-1',
          decisionTitle: 'Address High Unemployment',
          decisionDescription: `Unemployment has reached ${(context.economicSituation.unemploymentRate * 100).toFixed(1)}%, requiring immediate policy intervention.`,
          category: 'economic',
          urgency: context.economicSituation.unemploymentRate > 0.15 ? 'critical' : 'urgent',
          includeRiskAssessment: true,
          includeCostBenefit: true,
          includeStakeholderAnalysis: true,
          analysisDepth: 'comprehensive',
          objectives: ['Reduce unemployment', 'Stimulate job creation', 'Support affected workers'],
          constraints: ['Budget limitations', 'Political feasibility', 'Time constraints']
        });
        decisions.push(decision);
      }
      
      if (Math.abs(context.economicSituation.inflationRate) > 0.05) {
        const decision = await decisionSupportEngine.generateDecisionSupport({
          campaignId,
          tickId,
          leaderCharacterId: 'leader-1',
          decisionTitle: context.economicSituation.inflationRate > 0 ? 'Combat High Inflation' : 'Address Deflation',
          decisionDescription: `Inflation rate is at ${(context.economicSituation.inflationRate * 100).toFixed(1)}%, requiring monetary policy adjustments.`,
          category: 'economic',
          urgency: Math.abs(context.economicSituation.inflationRate) > 0.08 ? 'urgent' : 'important',
          includeRiskAssessment: true,
          includeCostBenefit: true,
          analysisDepth: 'standard'
        });
        decisions.push(decision);
      }
    }
    
    // Social decisions
    if (context.socialDynamics.significance >= 0.7) {
      if (context.socialDynamics.approvalRating < 0.4) {
        const decision = await decisionSupportEngine.generateDecisionSupport({
          campaignId,
          tickId,
          leaderCharacterId: 'leader-1',
          decisionTitle: 'Improve Public Approval',
          decisionDescription: `Public approval has dropped to ${(context.socialDynamics.approvalRating * 100).toFixed(1)}%, threatening political stability.`,
          category: 'social',
          urgency: context.socialDynamics.approvalRating < 0.3 ? 'urgent' : 'important',
          includeStakeholderAnalysis: true,
          analysisDepth: 'comprehensive'
        });
        decisions.push(decision);
      }
      
      if (context.socialDynamics.socialUnrest > 0.6) {
        const decision = await decisionSupportEngine.generateDecisionSupport({
          campaignId,
          tickId,
          leaderCharacterId: 'leader-1',
          decisionTitle: 'Address Social Unrest',
          decisionDescription: `Social unrest levels are high at ${(context.socialDynamics.socialUnrest * 100).toFixed(1)}%, requiring immediate attention.`,
          category: 'social',
          urgency: context.socialDynamics.socialUnrest > 0.8 ? 'critical' : 'urgent',
          includeRiskAssessment: true,
          analysisDepth: 'comprehensive'
        });
        decisions.push(decision);
      }
    }
    
    // Security decisions
    if (context.securityStatus.significance >= 0.7) {
      if (context.securityStatus.threatLevel > 0.7) {
        const decision = await decisionSupportEngine.generateDecisionSupport({
          campaignId,
          tickId,
          leaderCharacterId: 'leader-1',
          decisionTitle: 'Respond to Security Threats',
          decisionDescription: `Threat level is elevated at ${(context.securityStatus.threatLevel * 100).toFixed(1)}%, requiring security response.`,
          category: 'military',
          urgency: context.securityStatus.threatLevel > 0.85 ? 'critical' : 'urgent',
          includeRiskAssessment: true,
          analysisDepth: 'comprehensive'
        });
        decisions.push(decision);
      }
    }
    
    return decisions;
  }
  
  /**
   * Process scheduled speeches
   */
  private async processScheduledSpeeches(
    campaignId: number,
    tickId: number
  ): Promise<LeaderSpeech[]> {
    try {
      // Get scheduled speeches for this tick
      const query = `
        SELECT * FROM leader_speeches 
        WHERE campaign_id = $1 
          AND status = 'scheduled' 
          AND scheduled_for <= NOW()
        ORDER BY scheduled_for ASC
      `;
      
      const result = await db.query(query, [campaignId]);
      const speeches: LeaderSpeech[] = [];
      
      for (const row of result.rows) {
        const speech: LeaderSpeech = {
          id: row.id,
          type: row.type,
          title: row.title,
          content: row.content,
          summary: row.summary,
          campaignId: row.campaign_id,
          tickId: row.tick_id,
          leaderCharacterId: row.leader_character_id,
          audience: JSON.parse(row.audience || '{}'),
          venue: row.venue,
          occasion: row.occasion,
          tone: row.tone,
          duration: row.duration,
          keyMessages: JSON.parse(row.key_messages || '[]'),
          expectedImpact: JSON.parse(row.expected_impact || '{}'),
          actualImpact: JSON.parse(row.actual_impact || '{}'),
          simulationEffects: JSON.parse(row.simulation_effects || '[]'),
          publicReaction: JSON.parse(row.public_reaction || '{}'),
          generationContext: JSON.parse(row.generation_context || '{}'),
          createdAt: new Date(row.created_at),
          scheduledFor: row.scheduled_for ? new Date(row.scheduled_for) : undefined,
          deliveredAt: new Date(),
          status: 'delivered',
          priority: row.priority
        };
        
        // Apply speech effects
        const effects = await leaderSpeechEngine.applySpeechEffects(speech);
        speech.simulationEffects = effects;
        
        // Update speech status
        await db.query(
          'UPDATE leader_speeches SET status = $1, delivered_at = $2, simulation_effects = $3, updated_at = NOW() WHERE id = $4',
          ['delivered', new Date(), JSON.stringify(effects), speech.id]
        );
        
        speeches.push(speech);
      }
      
      return speeches;
      
    } catch (error) {
      console.error('Error processing scheduled speeches:', error);
      return [];
    }
  }
  
  /**
   * Calculate simulation influences from recent communications
   */
  private async calculateSimulationInfluences(
    campaignId: number,
    tickId: number
  ): Promise<SimulationInfluence[]> {
    const influences: SimulationInfluence[] = [];
    
    try {
      // Get recent speeches with effects
      const speechQuery = `
        SELECT * FROM leader_speeches 
        WHERE campaign_id = $1 
          AND delivered_at >= NOW() - INTERVAL '7 days'
          AND simulation_effects IS NOT NULL
          AND simulation_effects != '[]'
        ORDER BY delivered_at DESC
      `;
      
      const speechResult = await db.query(speechQuery, [campaignId]);
      
      for (const row of speechResult.rows) {
        const effects = JSON.parse(row.simulation_effects || '[]');
        
        for (const effect of effects) {
          influences.push({
            id: `speech-${row.id}-${effect.type}-${Date.now()}`,
            source: 'speech',
            sourceId: row.id,
            type: effect.type,
            category: effect.category,
            magnitude: effect.magnitude,
            duration: effect.duration,
            target: effect.target,
            description: effect.description,
            confidence: effect.confidence,
            timestamp: new Date(row.delivered_at),
            tickId,
            campaignId
          });
        }
      }
      
      // Get recent implemented decisions
      const decisionQuery = `
        SELECT di.*, pd.title, pd.category 
        FROM decision_implementations di
        JOIN pending_decisions pd ON di.decision_id = pd.id
        WHERE di.campaign_id = $1 
          AND di.implementation_date >= NOW() - INTERVAL '7 days'
          AND di.effects IS NOT NULL
          AND di.effects != '[]'
        ORDER BY di.implementation_date DESC
      `;
      
      const decisionResult = await db.query(decisionQuery, [campaignId]);
      
      for (const row of decisionResult.rows) {
        const effects = JSON.parse(row.effects || '[]');
        
        for (const effect of effects) {
          influences.push({
            id: `decision-${row.id}-${effect.type}-${Date.now()}`,
            source: 'decision',
            sourceId: row.decision_id,
            type: effect.type,
            category: effect.category || row.category,
            magnitude: effect.magnitude,
            duration: effect.duration,
            target: effect.target,
            description: effect.description,
            confidence: effect.confidence,
            timestamp: new Date(row.implementation_date),
            tickId,
            campaignId
          });
        }
      }
      
      return influences;
      
    } catch (error) {
      console.error('Error calculating simulation influences:', error);
      return [];
    }
  }
  
  /**
   * Record integration event for tracking and analytics
   */
  private async recordIntegrationEvent(event: SystemIntegrationEvent): Promise<void> {
    try {
      this.integrationHistory.push(event);
      
      // Keep only last 100 events in memory
      if (this.integrationHistory.length > 100) {
        this.integrationHistory = this.integrationHistory.slice(-100);
      }
      
      // Store in civilization memory for context
      await civilizationVectorMemory.storeMemory(
        `civilization-${event.campaignId}`,
        {
          id: event.id,
          content: `Natural language integration processed: ${event.briefingsGenerated} briefings, ${event.speechesProcessed} speeches, ${event.decisionsCreated} decisions, ${event.influencesApplied} influences applied to simulation.`,
          contentType: 'system_integration',
          timestamp: event.timestamp,
          metadata: {
            tickId: event.tickId,
            success: event.success,
            briefingsGenerated: event.briefingsGenerated,
            speechesProcessed: event.speechesProcessed,
            decisionsCreated: event.decisionsCreated,
            influencesApplied: event.influencesApplied,
            error: event.error
          }
        }
      );
      
    } catch (error) {
      console.error('Error recording integration event:', error);
    }
  }
  
  // Analysis helper methods
  private analyzeEconomicChanges(simulationResults: any) {
    return {
      gdpChange: simulationResults.economy?.gdpChange || 0,
      unemploymentRate: simulationResults.economy?.unemploymentRate || 0.05,
      inflationRate: simulationResults.economy?.inflationRate || 0.02,
      tradeBalance: simulationResults.economy?.tradeBalance || 0,
      trends: simulationResults.economy?.trends || [],
      significance: Math.abs(simulationResults.economy?.gdpChange || 0) * 2 + 
                   Math.abs(simulationResults.economy?.unemploymentRate || 0) * 3 +
                   Math.abs(simulationResults.economy?.inflationRate || 0) * 2
    };
  }
  
  private analyzeSocialChanges(simulationResults: any) {
    return {
      mood: simulationResults.social?.populationMood || 0.5,
      approvalRating: simulationResults.social?.approvalRating || 0.5,
      unrest: simulationResults.social?.socialUnrest || 0.1,
      culturalShifts: simulationResults.social?.culturalShifts || [],
      events: simulationResults.social?.events || [],
      significance: Math.abs(0.5 - (simulationResults.social?.populationMood || 0.5)) * 2 +
                   Math.abs(0.5 - (simulationResults.social?.approvalRating || 0.5)) * 3 +
                   (simulationResults.social?.socialUnrest || 0.1) * 2
    };
  }
  
  private analyzePoliticalChanges(simulationResults: any) {
    return {
      stability: simulationResults.political?.stabilityIndex || 0.7,
      coalitionStrength: simulationResults.political?.coalitionStrength || 0.6,
      opposition: simulationResults.political?.oppositionActivity || 0.3,
      policyEffectiveness: simulationResults.political?.policyEffectiveness || 0.5,
      upcomingEvents: simulationResults.political?.upcomingEvents || [],
      significance: Math.abs(0.7 - (simulationResults.political?.stabilityIndex || 0.7)) * 3 +
                   (simulationResults.political?.oppositionActivity || 0.3) * 2
    };
  }
  
  private analyzeMilitaryChanges(simulationResults: any) {
    return {
      threatLevel: simulationResults.military?.threatLevel || 0.2,
      readiness: simulationResults.military?.militaryReadiness || 0.7,
      internalSecurity: simulationResults.military?.internalSecurity || 0.8,
      diplomaticTensions: simulationResults.military?.diplomaticTensions || 0.3,
      conflicts: simulationResults.military?.activeConflicts || [],
      significance: (simulationResults.military?.threatLevel || 0.2) * 3 +
                   Math.abs(0.7 - (simulationResults.military?.militaryReadiness || 0.7)) * 2 +
                   (simulationResults.military?.diplomaticTensions || 0.3) * 2
    };
  }
  
  /**
   * Get integration history for analytics
   */
  getIntegrationHistory(limit: number = 50): SystemIntegrationEvent[] {
    return this.integrationHistory.slice(-limit);
  }
  
  /**
   * Get integration statistics
   */
  getIntegrationStats(timeframe: string = '24h'): {
    totalIntegrations: number;
    successRate: number;
    averageBriefings: number;
    averageSpeeches: number;
    averageDecisions: number;
    averageInfluences: number;
  } {
    const cutoff = timeframe === '24h' ? 24 * 60 * 60 * 1000 :
                   timeframe === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                   30 * 24 * 60 * 60 * 1000;
    
    const recentEvents = this.integrationHistory.filter(
      event => Date.now() - event.timestamp.getTime() < cutoff
    );
    
    if (recentEvents.length === 0) {
      return {
        totalIntegrations: 0,
        successRate: 0,
        averageBriefings: 0,
        averageSpeeches: 0,
        averageDecisions: 0,
        averageInfluences: 0
      };
    }
    
    const successful = recentEvents.filter(event => event.success);
    
    return {
      totalIntegrations: recentEvents.length,
      successRate: successful.length / recentEvents.length,
      averageBriefings: successful.reduce((sum, event) => sum + event.briefingsGenerated, 0) / successful.length,
      averageSpeeches: successful.reduce((sum, event) => sum + event.speechesProcessed, 0) / successful.length,
      averageDecisions: successful.reduce((sum, event) => sum + event.decisionsCreated, 0) / successful.length,
      averageInfluences: successful.reduce((sum, event) => sum + event.influencesApplied, 0) / successful.length
    };
  }
}

// Export singleton instance
export const naturalLanguageIntegrator = new NaturalLanguageIntegrator();
