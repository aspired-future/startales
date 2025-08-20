/**
 * Hybrid Integrator
 * Combines deterministic calculations with natural language analysis
 * Implements bidirectional influence between hard data and soft intelligence
 */

import { CampaignState } from '../sim/types.js';
import {
  DeterministicResults,
  NaturalLanguageResults,
  HybridResults,
  SentimentModifiers,
  NarrativeContext,
  EmergentEvent,
  PolicyRecommendation,
  CrisisAlert,
  HybridEngineConfig,
  EventEffect,
  PlayerChoice
} from './types.js';

export class HybridIntegrator {
  private config: HybridEngineConfig;

  constructor(config: HybridEngineConfig) {
    this.config = config;
  }

  /**
   * Integrate deterministic and natural language results
   */
  async integrateEffects(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults
  ): Promise<HybridResults> {
    const startTime = Date.now();

    try {
      // Phase 1: Calculate sentiment-based modifiers
      const sentimentModifiers = this.calculateSentimentModifiers(
        naturalLanguageResults
      );

      // Phase 2: Apply modifiers to deterministic results
      const modifiedCampaignState = this.applyModifiersToState(
        deterministicResults.campaignState,
        sentimentModifiers
      );

      // Phase 3: Generate narrative context from modified results
      const narrativeContext = this.generateNarrativeContext(
        deterministicResults,
        naturalLanguageResults,
        sentimentModifiers
      );

      // Phase 4: Detect emergent events and crises
      const emergentEvents = await this.detectEmergentEvents(
        deterministicResults,
        naturalLanguageResults,
        sentimentModifiers
      );

      // Phase 5: Generate policy recommendations
      const policyRecommendations = await this.generatePolicyRecommendations(
        deterministicResults,
        naturalLanguageResults,
        sentimentModifiers
      );

      // Phase 6: Detect crisis alerts
      const crisisAlerts = this.detectCrises(
        deterministicResults,
        naturalLanguageResults,
        sentimentModifiers
      );

      const integrationTime = Date.now() - startTime;

      return {
        sentimentModifiers,
        narrativeContext,
        emergentEvents,
        policyRecommendations,
        crisisAlerts,
        finalCampaignState: modifiedCampaignState,
        integrationTime,
        modificationsApplied: this.getModificationsSummary(sentimentModifiers),
        narrativeEnhancements: this.getNarrativeEnhancements(narrativeContext)
      };

    } catch (error) {
      console.error('Hybrid integration failed:', error);
      throw new Error(`Hybrid integration failed: ${error.message}`);
    }
  }

  /**
   * Calculate sentiment-based modifiers from natural language analysis
   */
  private calculateSentimentModifiers(
    naturalLanguageResults: NaturalLanguageResults
  ): SentimentModifiers {
    const { populationMood, economicStory, militaryStatus } = naturalLanguageResults;

    // Base modifiers from population mood
    const moodMultiplier = this.getMoodMultiplier(populationMood.overall);
    
    // Economic confidence from economic narrative
    const economicConfidence = this.calculateEconomicConfidence(economicStory);
    
    // Military morale from military assessment
    const militaryMorale = this.calculateMilitaryMorale(militaryStatus);
    
    // Leadership trust from overall sentiment
    const leadershipTrust = naturalLanguageResults.populationMood.witterSentiment.overallSentiment;

    // Calculate individual modifiers
    const productionEfficiency = this.clampModifier(
      (moodMultiplier * 0.6 + economicConfidence * 0.4) * 0.2, -0.2, 0.2
    );

    const researchSpeed = this.clampModifier(
      (moodMultiplier * 0.4 + economicConfidence * 0.3 + leadershipTrust * 0.3) * 0.3, -0.3, 0.3
    );

    const militaryMoraleModifier = this.clampModifier(
      (militaryMorale * 0.7 + moodMultiplier * 0.3) * 0.4, -0.4, 0.4
    );

    const taxCompliance = this.clampModifier(
      (leadershipTrust * 0.6 + economicConfidence * 0.4) * 0.5, -0.5, 0.5
    );

    const tradeEfficiency = this.clampModifier(
      (economicConfidence * 0.5 + moodMultiplier * 0.3 + leadershipTrust * 0.2) * 0.3, -0.3, 0.3
    );

    const diplomaticInfluence = this.clampModifier(
      (leadershipTrust * 0.5 + moodMultiplier * 0.3 + militaryMorale * 0.2) * 0.2, -0.2, 0.2
    );

    return {
      productionEfficiency,
      researchSpeed,
      militaryMorale: militaryMoraleModifier,
      taxCompliance,
      tradeEfficiency,
      diplomaticInfluence,
      modifierSources: {
        populationMood: moodMultiplier,
        economicConfidence,
        militaryMorale,
        leadershipTrust
      }
    };
  }

  /**
   * Apply sentiment modifiers to campaign state
   */
  private applyModifiersToState(
    originalState: CampaignState,
    modifiers: SentimentModifiers
  ): CampaignState {
    // Create a deep copy of the state
    const modifiedState = JSON.parse(JSON.stringify(originalState)) as CampaignState;

    // Apply production efficiency modifier
    if (modifiers.productionEfficiency !== 0) {
      Object.keys(modifiedState.resources).forEach(resource => {
        const currentAmount = modifiedState.resources[resource] || 0;
        const modifier = 1 + modifiers.productionEfficiency;
        modifiedState.resources[resource] = Math.floor(currentAmount * modifier);
      });
    }

    // Apply research speed modifier to queues
    if (modifiers.researchSpeed !== 0) {
      modifiedState.queues = modifiedState.queues.map(queue => {
        if (queue.type === 'research') {
          const modifier = 1 + modifiers.researchSpeed;
          return {
            ...queue,
            progress: Math.min(queue.totalTime, queue.progress * modifier)
          };
        }
        return queue;
      });
    }

    // Apply tax compliance modifier to credits
    if (modifiers.taxCompliance !== 0) {
      const taxModifier = 1 + modifiers.taxCompliance;
      const currentCredits = modifiedState.resources.credits || 0;
      modifiedState.resources.credits = Math.floor(currentCredits * taxModifier);
    }

    // Store modifiers in state for reference
    modifiedState.sentimentModifiers = modifiers;

    return modifiedState;
  }

  /**
   * Generate narrative context from integrated results
   */
  private generateNarrativeContext(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults,
    sentimentModifiers: SentimentModifiers
  ): NarrativeContext {
    const economicTrends = this.extractEconomicTrends(
      deterministicResults,
      naturalLanguageResults,
      sentimentModifiers
    );

    const militaryEvents = this.extractMilitaryEvents(
      deterministicResults,
      naturalLanguageResults
    );

    const researchBreakthroughs = naturalLanguageResults.researchNarrative.breakthroughs;

    const populationEvents = this.extractPopulationEvents(
      naturalLanguageResults.populationMood,
      sentimentModifiers
    );

    const diplomaticDevelopments = naturalLanguageResults.diplomaticSituation.negotiations.concat(
      naturalLanguageResults.diplomaticSituation.opportunities
    );

    return {
      economicTrends,
      militaryEvents,
      researchBreakthroughs,
      populationEvents,
      diplomaticDevelopments,
      historicalComparisons: this.generateHistoricalComparisons(deterministicResults),
      futureImplications: this.generateFutureImplications(naturalLanguageResults),
      strategicInsights: this.generateStrategicInsights(deterministicResults, naturalLanguageResults)
    };
  }

  /**
   * Detect emergent events based on integrated analysis
   */
  private async detectEmergentEvents(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults,
    sentimentModifiers: SentimentModifiers
  ): Promise<EmergentEvent[]> {
    const events: EmergentEvent[] = [];

    // Economic crisis detection
    if (deterministicResults.economic.gdpGrowth < -5 && 
        naturalLanguageResults.populationMood.overall === 'angry') {
      events.push(this.createEconomicCrisisEvent(deterministicResults, naturalLanguageResults));
    }

    // Research breakthrough detection
    if (deterministicResults.research.breakthroughProbability > 0.8) {
      events.push(this.createResearchBreakthroughEvent(deterministicResults, naturalLanguageResults));
    }

    // Social unrest detection
    if (naturalLanguageResults.populationMood.overall === 'rebellious' &&
        sentimentModifiers.taxCompliance < -0.3) {
      events.push(this.createSocialUnrestEvent(naturalLanguageResults, sentimentModifiers));
    }

    // Military opportunity detection
    if (deterministicResults.military.readinessLevel > 0.8 &&
        naturalLanguageResults.militaryStatus.opportunities.length > 0) {
      events.push(this.createMilitaryOpportunityEvent(deterministicResults, naturalLanguageResults));
    }

    return events;
  }

  /**
   * Generate policy recommendations
   */
  private async generatePolicyRecommendations(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults,
    sentimentModifiers: SentimentModifiers
  ): Promise<PolicyRecommendation[]> {
    const recommendations: PolicyRecommendation[] = [];

    // Economic policy recommendations
    if (deterministicResults.economic.unemployment > 10) {
      recommendations.push({
        id: `econ_unemployment_${Date.now()}`,
        category: 'economic',
        priority: 'high',
        title: 'Address High Unemployment',
        description: 'Implement job creation programs to reduce unemployment',
        rationale: [
          `Current unemployment at ${deterministicResults.economic.unemployment}%`,
          'High unemployment affecting population mood',
          'Economic growth potential being constrained'
        ],
        expectedEffects: [
          'Reduced unemployment rate',
          'Improved population sentiment',
          'Increased economic productivity'
        ],
        risks: [
          'Increased government spending',
          'Potential inflation pressure'
        ],
        alternatives: [
          'Private sector incentives',
          'Education and training programs'
        ],
        implementationSteps: [
          'Assess current job market conditions',
          'Design targeted employment programs',
          'Allocate budget for implementation',
          'Launch programs and monitor effectiveness'
        ],
        resourceRequirements: {
          credits: 10000,
          materials: 5000
        },
        timeframe: '2-3 ticks for full implementation'
      });
    }

    // Military recommendations
    if (deterministicResults.military.readinessLevel < 0.5) {
      recommendations.push({
        id: `mil_readiness_${Date.now()}`,
        category: 'military',
        priority: 'medium',
        title: 'Improve Military Readiness',
        description: 'Enhance military preparedness and training',
        rationale: [
          `Current readiness at ${deterministicResults.military.readinessLevel * 100}%`,
          'Potential security vulnerabilities identified'
        ],
        expectedEffects: [
          'Improved defensive capabilities',
          'Enhanced deterrent effect',
          'Better crisis response capacity'
        ],
        risks: [
          'Increased military spending',
          'Potential diplomatic tensions'
        ],
        alternatives: [
          'Diplomatic security arrangements',
          'Technology-focused improvements'
        ],
        implementationSteps: [
          'Assess current military capabilities',
          'Develop training programs',
          'Upgrade equipment and facilities',
          'Conduct readiness exercises'
        ],
        resourceRequirements: {
          credits: 15000,
          materials: 8000,
          energy: 3000
        },
        timeframe: '3-4 ticks for significant improvement'
      });
    }

    // Research recommendations
    if (deterministicResults.research.researchEfficiency < 0.6) {
      recommendations.push({
        id: `research_efficiency_${Date.now()}`,
        category: 'research',
        priority: 'medium',
        title: 'Boost Research Efficiency',
        description: 'Improve research infrastructure and processes',
        rationale: [
          `Research efficiency at ${deterministicResults.research.researchEfficiency * 100}%`,
          'Falling behind in technological advancement'
        ],
        expectedEffects: [
          'Faster research completion',
          'Higher breakthrough probability',
          'Improved innovation capacity'
        ],
        risks: [
          'High upfront investment costs',
          'Uncertain return on investment'
        ],
        alternatives: [
          'International research partnerships',
          'Private sector collaboration'
        ],
        implementationSteps: [
          'Evaluate current research infrastructure',
          'Identify efficiency bottlenecks',
          'Invest in new equipment and facilities',
          'Implement process improvements'
        ],
        resourceRequirements: {
          credits: 12000,
          materials: 6000,
          energy: 4000
        },
        timeframe: '2-3 ticks for noticeable improvement'
      });
    }

    return recommendations;
  }

  /**
   * Detect crisis situations
   */
  private detectCrises(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults,
    sentimentModifiers: SentimentModifiers
  ): CrisisAlert[] {
    const crises: CrisisAlert[] = [];

    // Economic crisis
    if (deterministicResults.economic.gdpGrowth < -10 || 
        deterministicResults.economic.unemployment > 20) {
      crises.push({
        id: `economic_crisis_${Date.now()}`,
        type: 'economic',
        severity: 'critical',
        title: 'Economic Crisis Detected',
        description: 'Severe economic downturn threatening civilization stability',
        causes: [
          `GDP declining at ${deterministicResults.economic.gdpGrowth}%`,
          `Unemployment at ${deterministicResults.economic.unemployment}%`,
          'Population confidence severely impacted'
        ],
        currentEffects: [
          'Reduced production capacity',
          'Social unrest potential',
          'Government revenue decline'
        ],
        projectedConsequences: [
          'Continued economic contraction',
          'Possible social upheaval',
          'Long-term development setbacks'
        ],
        immediateActions: [
          'Emergency economic stimulus',
          'Unemployment relief programs',
          'Market stabilization measures'
        ],
        strategicResponses: [
          'Comprehensive economic reform',
          'Infrastructure investment program',
          'International economic cooperation'
        ],
        preventiveMeasures: [
          'Economic diversification',
          'Improved fiscal management',
          'Early warning systems'
        ],
        timeToImpact: 1,
        windowForAction: 2
      });
    }

    // Social crisis
    if (naturalLanguageResults.populationMood.overall === 'rebellious' &&
        sentimentModifiers.taxCompliance < -0.4) {
      crises.push({
        id: `social_crisis_${Date.now()}`,
        type: 'social',
        severity: 'serious',
        title: 'Social Unrest Crisis',
        description: 'Population rebellion threatening government stability',
        causes: [
          'Widespread population dissatisfaction',
          'Loss of confidence in leadership',
          'Economic hardship and inequality'
        ],
        currentEffects: [
          'Reduced tax compliance',
          'Potential for civil disorder',
          'Government authority challenged'
        ],
        projectedConsequences: [
          'Escalating social conflict',
          'Government instability',
          'Economic disruption'
        ],
        immediateActions: [
          'Address immediate grievances',
          'Improve communication with population',
          'Implement emergency social programs'
        ],
        strategicResponses: [
          'Comprehensive social reform',
          'Leadership restructuring',
          'Long-term inequality reduction'
        ],
        preventiveMeasures: [
          'Regular population sentiment monitoring',
          'Proactive social policies',
          'Transparent governance'
        ],
        timeToImpact: 1,
        windowForAction: 3
      });
    }

    return crises;
  }

  // ===== UTILITY METHODS =====

  private getMoodMultiplier(mood: string): number {
    const moodValues = {
      'ecstatic': 1.0,
      'happy': 0.6,
      'content': 0.2,
      'concerned': -0.2,
      'angry': -0.6,
      'rebellious': -1.0
    };
    return moodValues[mood] || 0;
  }

  private calculateEconomicConfidence(economicStory: any): number {
    // Analyze economic narrative for confidence indicators
    const positiveIndicators = economicStory.opportunities?.length || 0;
    const negativeIndicators = economicStory.concerns?.length || 0;
    
    return this.clampModifier((positiveIndicators - negativeIndicators) * 0.1, -1, 1);
  }

  private calculateMilitaryMorale(militaryStatus: any): number {
    // Extract morale indicators from military assessment
    const morale = militaryStatus.morale || '';
    
    if (morale.includes('high') || morale.includes('excellent')) return 0.8;
    if (morale.includes('good') || morale.includes('strong')) return 0.4;
    if (morale.includes('stable') || morale.includes('adequate')) return 0.0;
    if (morale.includes('low') || morale.includes('poor')) return -0.4;
    if (morale.includes('critical') || morale.includes('terrible')) return -0.8;
    
    return 0.0;
  }

  private clampModifier(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private extractEconomicTrends(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults,
    sentimentModifiers: SentimentModifiers
  ): string[] {
    const trends: string[] = [];
    
    if (deterministicResults.economic.gdpGrowth > 3) {
      trends.push('Strong economic growth continues');
    } else if (deterministicResults.economic.gdpGrowth < -2) {
      trends.push('Economic contraction observed');
    }
    
    if (sentimentModifiers.productionEfficiency > 0.1) {
      trends.push('Production efficiency boosted by positive sentiment');
    } else if (sentimentModifiers.productionEfficiency < -0.1) {
      trends.push('Production efficiency hampered by negative sentiment');
    }
    
    return trends;
  }

  private extractMilitaryEvents(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults
  ): string[] {
    const events: string[] = [];
    
    if (deterministicResults.military.readinessLevel > 0.8) {
      events.push('Military forces at high readiness');
    }
    
    if (naturalLanguageResults.militaryStatus.threats.length > 0) {
      events.push(`${naturalLanguageResults.militaryStatus.threats.length} potential threats identified`);
    }
    
    return events;
  }

  private extractPopulationEvents(populationMood: any, sentimentModifiers: SentimentModifiers): string[] {
    const events: string[] = [];
    
    if (populationMood.trendDirection === 'improving') {
      events.push('Population sentiment improving');
    } else if (populationMood.trendDirection === 'declining') {
      events.push('Population sentiment declining');
    }
    
    if (Math.abs(sentimentModifiers.taxCompliance) > 0.2) {
      events.push(`Tax compliance ${sentimentModifiers.taxCompliance > 0 ? 'increased' : 'decreased'} significantly`);
    }
    
    return events;
  }

  private generateHistoricalComparisons(deterministicResults: DeterministicResults): string[] {
    // TODO: Implement historical comparison logic
    return ['Current economic indicators comparable to previous growth periods'];
  }

  private generateFutureImplications(naturalLanguageResults: NaturalLanguageResults): string[] {
    // TODO: Implement future implications logic
    return naturalLanguageResults.predictions.map(p => p.description);
  }

  private generateStrategicInsights(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults
  ): string[] {
    const insights: string[] = [];
    
    // Economic insights
    if (deterministicResults.economic.gdpGrowth > 5 && 
        naturalLanguageResults.populationMood.overall === 'happy') {
      insights.push('Strong economic performance creating positive feedback loop with population satisfaction');
    }
    
    // Military insights
    if (deterministicResults.military.readinessLevel > 0.7 && 
        naturalLanguageResults.militaryStatus.threats.length === 0) {
      insights.push('High military readiness providing strategic deterrent effect');
    }
    
    return insights;
  }

  private getModificationsSummary(sentimentModifiers: SentimentModifiers): string[] {
    const modifications: string[] = [];
    
    Object.entries(sentimentModifiers).forEach(([key, value]) => {
      if (key !== 'modifierSources' && Math.abs(value) > 0.05) {
        modifications.push(`${key}: ${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`);
      }
    });
    
    return modifications;
  }

  private getNarrativeEnhancements(narrativeContext: NarrativeContext): string[] {
    const enhancements: string[] = [];
    
    if (narrativeContext.economicTrends.length > 0) {
      enhancements.push(`${narrativeContext.economicTrends.length} economic trends identified`);
    }
    
    if (narrativeContext.strategicInsights.length > 0) {
      enhancements.push(`${narrativeContext.strategicInsights.length} strategic insights generated`);
    }
    
    return enhancements;
  }

  // ===== EVENT CREATORS =====

  private createEconomicCrisisEvent(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults
  ): EmergentEvent {
    return {
      id: `economic_crisis_${Date.now()}`,
      type: 'crisis',
      severity: 'major',
      title: 'Economic Crisis Unfolds',
      description: 'A severe economic downturn is impacting all sectors of society, with rising unemployment and declining production.',
      triggers: [
        `GDP growth at ${deterministicResults.economic.gdpGrowth}%`,
        'Population anger reaching critical levels',
        'Market confidence collapse'
      ],
      effects: [
        {
          target: 'economic',
          modifier: -0.2,
          duration: 3,
          description: 'Reduced economic efficiency'
        },
        {
          target: 'population',
          modifier: -0.3,
          duration: 5,
          description: 'Increased social unrest'
        }
      ],
      duration: 5,
      playerChoices: [
        {
          id: 'stimulus_package',
          title: 'Emergency Economic Stimulus',
          description: 'Deploy massive government spending to stimulate the economy',
          consequences: [
            {
              target: 'economic',
              modifier: 0.15,
              duration: 2,
              description: 'Short-term economic boost'
            }
          ],
          requirements: ['Sufficient government reserves'],
          cost: { credits: 50000 }
        },
        {
          id: 'austerity_measures',
          title: 'Implement Austerity Measures',
          description: 'Cut government spending to restore fiscal confidence',
          consequences: [
            {
              target: 'population',
              modifier: -0.2,
              duration: 3,
              description: 'Increased social hardship'
            }
          ],
          requirements: ['Political will for unpopular measures'],
          cost: {}
        }
      ],
      storyContext: 'The economic foundations of the civilization are being tested as never before.',
      characterInvolvement: ['Economic advisors', 'Labor leaders', 'Business representatives'],
      publicReaction: 'Widespread concern and calls for immediate government action'
    };
  }

  private createResearchBreakthroughEvent(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults
  ): EmergentEvent {
    return {
      id: `research_breakthrough_${Date.now()}`,
      type: 'breakthrough',
      severity: 'moderate',
      title: 'Scientific Breakthrough Achieved',
      description: 'Researchers have made a significant discovery that could transform multiple sectors.',
      triggers: [
        `Breakthrough probability at ${deterministicResults.research.breakthroughProbability * 100}%`,
        'High research efficiency',
        'Favorable research climate'
      ],
      effects: [
        {
          target: 'research',
          modifier: 0.3,
          duration: 4,
          description: 'Accelerated research progress'
        },
        {
          target: 'population',
          modifier: 0.1,
          duration: 2,
          description: 'Increased national pride'
        }
      ],
      duration: 4,
      playerChoices: [
        {
          id: 'commercialize_research',
          title: 'Rapid Commercialization',
          description: 'Fast-track the breakthrough into practical applications',
          consequences: [
            {
              target: 'economic',
              modifier: 0.2,
              duration: 3,
              description: 'Economic benefits from new technology'
            }
          ],
          requirements: ['Industrial capacity'],
          cost: { credits: 20000, materials: 10000 }
        },
        {
          id: 'further_research',
          title: 'Deepen Research',
          description: 'Invest more resources to fully understand the implications',
          consequences: [
            {
              target: 'research',
              modifier: 0.4,
              duration: 2,
              description: 'Enhanced research capabilities'
            }
          ],
          requirements: ['Research infrastructure'],
          cost: { credits: 15000, energy: 5000 }
        }
      ],
      storyContext: 'A moment of scientific triumph that could reshape the future of the civilization.',
      characterInvolvement: ['Lead researchers', 'Science advisors', 'Technology entrepreneurs'],
      publicReaction: 'Excitement and optimism about future possibilities'
    };
  }

  private createSocialUnrestEvent(
    naturalLanguageResults: NaturalLanguageResults,
    sentimentModifiers: SentimentModifiers
  ): EmergentEvent {
    return {
      id: `social_unrest_${Date.now()}`,
      type: 'crisis',
      severity: 'major',
      title: 'Social Unrest Erupts',
      description: 'Widespread protests and civil disobedience are challenging government authority.',
      triggers: [
        'Population mood reached rebellious levels',
        `Tax compliance dropped to ${sentimentModifiers.taxCompliance * 100}%`,
        'Loss of confidence in leadership'
      ],
      effects: [
        {
          target: 'population',
          modifier: -0.4,
          duration: 4,
          description: 'Severe social disruption'
        },
        {
          target: 'economic',
          modifier: -0.2,
          duration: 3,
          description: 'Economic disruption from unrest'
        }
      ],
      duration: 4,
      playerChoices: [
        {
          id: 'address_grievances',
          title: 'Address Core Grievances',
          description: 'Implement immediate reforms to address population concerns',
          consequences: [
            {
              target: 'population',
              modifier: 0.3,
              duration: 3,
              description: 'Improved population satisfaction'
            }
          ],
          requirements: ['Political flexibility'],
          cost: { credits: 30000 }
        },
        {
          id: 'maintain_order',
          title: 'Maintain Public Order',
          description: 'Use security forces to restore order and stability',
          consequences: [
            {
              target: 'population',
              modifier: -0.2,
              duration: 5,
              description: 'Suppressed but unresolved tensions'
            }
          ],
          requirements: ['Loyal security forces'],
          cost: {}
        }
      ],
      storyContext: 'The social contract between government and people is being severely tested.',
      characterInvolvement: ['Protest leaders', 'Security officials', 'Community representatives'],
      publicReaction: 'Deep divisions between supporters and opponents of the government'
    };
  }

  private createMilitaryOpportunityEvent(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults
  ): EmergentEvent {
    return {
      id: `military_opportunity_${Date.now()}`,
      type: 'opportunity',
      severity: 'moderate',
      title: 'Strategic Military Opportunity',
      description: 'Military intelligence has identified a strategic opportunity that could significantly enhance security.',
      triggers: [
        `Military readiness at ${deterministicResults.military.readinessLevel * 100}%`,
        'Strategic opportunities identified',
        'Favorable tactical situation'
      ],
      effects: [
        {
          target: 'military',
          modifier: 0.2,
          duration: 3,
          description: 'Enhanced strategic position'
        }
      ],
      duration: 2,
      playerChoices: [
        {
          id: 'seize_opportunity',
          title: 'Seize the Opportunity',
          description: 'Act decisively to capitalize on the strategic advantage',
          consequences: [
            {
              target: 'military',
              modifier: 0.3,
              duration: 4,
              description: 'Significant strategic gains'
            }
          ],
          requirements: ['Military readiness', 'Political authorization'],
          cost: { credits: 25000, materials: 15000 }
        },
        {
          id: 'cautious_approach',
          title: 'Cautious Assessment',
          description: 'Gather more intelligence before making any moves',
          consequences: [
            {
              target: 'military',
              modifier: 0.1,
              duration: 2,
              description: 'Reduced risk but limited gains'
            }
          ],
          requirements: ['Intelligence capabilities'],
          cost: { credits: 5000 }
        }
      ],
      storyContext: 'A moment when military preparedness creates new strategic possibilities.',
      characterInvolvement: ['Military commanders', 'Intelligence officers', 'Strategic advisors'],
      publicReaction: 'Mixed reactions depending on risk tolerance and strategic understanding'
    };
  }
}
