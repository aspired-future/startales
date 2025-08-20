/**
 * Natural Language Processor
 * AI-powered analysis layer for generating narrative context and sentiment analysis
 */

import { civilizationVectorMemory } from '../memory/civilizationVectorMemory.js';
import { characterVectorMemory } from '../memory/characterVectorMemory.js';
import { witterStorage } from '../memory/witterStorage.js';
import { llmService } from '../ai/llmService.js';
import { psychologyVectorMemory } from './PsychologyVectorMemory.js';
import { aiAnalysisVectorMemory } from './AIAnalysisVectorMemory.js';
import {
  DeterministicResults,
  NaturalLanguageResults,
  PopulationMood,
  SentimentAnalysis,
  EconomicNarrative,
  MilitaryAssessment,
  DiplomaticNarrative,
  ResearchNarrative,
  NarrativeEvent,
  Prediction,
  AnalysisSource,
  HybridEngineConfig,
  EconomicTrend,
  ThreatAssessment,
  RelationshipAnalysis,
  Innovation
} from './types.js';

export class NaturalLanguageProcessor {
  private config: HybridEngineConfig;

  constructor(config: HybridEngineConfig) {
    this.config = config;
  }

  /**
   * Analyze game state and generate natural language insights
   */
  async analyzeGameState(
    campaignId: number,
    deterministicResults: DeterministicResults
  ): Promise<NaturalLanguageResults> {
    const startTime = Date.now();

    try {
      // Gather analysis sources including previous memory context
      const sources = await this.gatherAnalysisSources(campaignId);
      
      // Get previous psychology and AI analysis for continuity
      const previousPsychology = await psychologyVectorMemory.getPreviousPsychologyAnalysis(
        campaignId,
        Number.MAX_SAFE_INTEGER,
        undefined,
        5
      );
      
      const previousAIAnalysis = await aiAnalysisVectorMemory.getPreviousAIAnalyses(
        campaignId,
        Number.MAX_SAFE_INTEGER,
        undefined,
        5
      );

      // Run parallel analysis tasks with continuity context
      const [
        populationMood,
        economicStory,
        militaryStatus,
        diplomaticSituation,
        researchNarrative
      ] = await Promise.all([
        this.analyzePopulationMood(campaignId, deterministicResults, sources, previousPsychology),
        this.generateEconomicNarrative(deterministicResults, sources, previousAIAnalysis),
        this.assessMilitarySituation(deterministicResults, sources, previousAIAnalysis),
        this.analyzeDiplomaticSituation(deterministicResults, sources, previousAIAnalysis),
        this.analyzeResearchProgress(deterministicResults, sources, previousAIAnalysis)
      ]);

      // Generate cross-cutting analysis
      const overallNarrative = await this.generateOverallNarrative(
        deterministicResults,
        populationMood,
        economicStory,
        militaryStatus,
        diplomaticSituation,
        researchNarrative
      );

      const keyEvents = await this.identifyKeyEvents(
        deterministicResults,
        populationMood,
        economicStory,
        militaryStatus
      );

      const predictions = await this.generatePredictions(
        deterministicResults,
        populationMood,
        economicStory,
        militaryStatus
      );

      const analysisTime = Date.now() - startTime;
      const confidenceScore = this.calculateConfidenceScore(sources, analysisTime);

      return {
        populationMood,
        economicStory,
        militaryStatus,
        diplomaticSituation,
        researchNarrative,
        overallNarrative,
        keyEvents,
        predictions,
        analysisTime,
        confidenceScore,
        sourcesAnalyzed: sources
      };

    } catch (error) {
      console.error('Natural language analysis failed:', error);
      throw new Error(`Natural language analysis failed: ${error.message}`);
    }
  }

  /**
   * Gather all available analysis sources
   */
  private async gatherAnalysisSources(campaignId: number): Promise<AnalysisSource[]> {
    const sources: AnalysisSource[] = [];

    try {
      // Get recent Witter posts
      const recentPosts = await witterStorage.getRecentPosts(campaignId, 100);
      if (recentPosts.length > 0) {
        sources.push({
          type: 'witter_posts',
          count: recentPosts.length,
          timeRange: 'last_24_hours',
          quality: recentPosts.length > 50 ? 'high' : recentPosts.length > 20 ? 'medium' : 'low'
        });
      }

      // Get civilization memory context
      const civMemories = await civilizationVectorMemory.getRecentMemories(
        campaignId.toString(),
        50
      );
      if (civMemories.length > 0) {
        sources.push({
          type: 'economic_data',
          count: civMemories.length,
          timeRange: 'recent_ticks',
          quality: 'high'
        });
      }

      // TODO: Add other source types as they become available
      // - military_reports
      // - diplomatic_cables  
      // - research_reports

    } catch (error) {
      console.warn('Failed to gather some analysis sources:', error);
    }

    return sources;
  }

  /**
   * Analyze population mood and sentiment with continuity from previous analysis
   */
  private async analyzePopulationMood(
    campaignId: number,
    deterministicResults: DeterministicResults,
    sources: AnalysisSource[],
    previousPsychology: any[] = []
  ): Promise<PopulationMood> {
    try {
      // Get recent Witter posts for sentiment analysis
      const recentPosts = await witterStorage.getRecentPosts(campaignId, 100);
      
      // Analyze Witter sentiment
      const witterSentiment = await this.analyzeWitterSentiment(recentPosts);

      // Generate mood analysis prompt with continuity context
      const prompt = this.buildPopulationMoodPrompt(
        deterministicResults,
        witterSentiment,
        recentPosts.slice(0, 20), // Include sample posts
        previousPsychology
      );

      // Get AI analysis
      const response = await llmService.generateText(prompt, {
        maxTokens: 1000,
        temperature: this.config.analysisTemperature
      });

      // Parse AI response into structured mood data
      const moodData = this.parsePopulationMoodResponse(response);

      return {
        ...moodData,
        witterSentiment,
        trendDirection: this.calculateMoodTrend(deterministicResults, witterSentiment)
      };

    } catch (error) {
      console.error('Population mood analysis failed:', error);
      return this.getDefaultPopulationMood();
    }
  }

  /**
   * Analyze Witter posts for sentiment
   */
  private async analyzeWitterSentiment(posts: any[]): Promise<SentimentAnalysis> {
    if (posts.length === 0) {
      return this.getDefaultSentimentAnalysis();
    }

    try {
      const prompt = this.buildSentimentAnalysisPrompt(posts);
      
      const response = await llmService.generateText(prompt, {
        maxTokens: 800,
        temperature: 0.3 // Lower temperature for more consistent sentiment analysis
      });

      return this.parseSentimentAnalysisResponse(response, posts);

    } catch (error) {
      console.error('Witter sentiment analysis failed:', error);
      return this.getDefaultSentimentAnalysis();
    }
  }

  /**
   * Generate economic narrative with continuity from previous AI analysis
   */
  private async generateEconomicNarrative(
    deterministicResults: DeterministicResults,
    sources: AnalysisSource[],
    previousAIAnalysis: any[] = []
  ): Promise<EconomicNarrative> {
    try {
      const prompt = this.buildEconomicNarrativePrompt(deterministicResults);
      
      const response = await llmService.generateText(prompt, {
        maxTokens: 1200,
        temperature: this.config.analysisTemperature
      });

      return this.parseEconomicNarrativeResponse(response, deterministicResults);

    } catch (error) {
      console.error('Economic narrative generation failed:', error);
      return this.getDefaultEconomicNarrative();
    }
  }

  /**
   * Assess military situation with continuity from previous AI analysis
   */
  private async assessMilitarySituation(
    deterministicResults: DeterministicResults,
    sources: AnalysisSource[],
    previousAIAnalysis: any[] = []
  ): Promise<MilitaryAssessment> {
    try {
      const prompt = this.buildMilitaryAssessmentPrompt(deterministicResults);
      
      const response = await llmService.generateText(prompt, {
        maxTokens: 1000,
        temperature: this.config.analysisTemperature
      });

      return this.parseMilitaryAssessmentResponse(response, deterministicResults);

    } catch (error) {
      console.error('Military assessment failed:', error);
      return this.getDefaultMilitaryAssessment();
    }
  }

  /**
   * Analyze diplomatic situation with continuity from previous AI analysis
   */
  private async analyzeDiplomaticSituation(
    deterministicResults: DeterministicResults,
    sources: AnalysisSource[],
    previousAIAnalysis: any[] = []
  ): Promise<DiplomaticNarrative> {
    try {
      const prompt = this.buildDiplomaticAnalysisPrompt(deterministicResults);
      
      const response = await llmService.generateText(prompt, {
        maxTokens: 800,
        temperature: this.config.analysisTemperature
      });

      return this.parseDiplomaticNarrativeResponse(response);

    } catch (error) {
      console.error('Diplomatic analysis failed:', error);
      return this.getDefaultDiplomaticNarrative();
    }
  }

  /**
   * Analyze research progress with continuity from previous AI analysis
   */
  private async analyzeResearchProgress(
    deterministicResults: DeterministicResults,
    sources: AnalysisSource[],
    previousAIAnalysis: any[] = []
  ): Promise<ResearchNarrative> {
    try {
      const prompt = this.buildResearchNarrativePrompt(deterministicResults);
      
      const response = await llmService.generateText(prompt, {
        maxTokens: 800,
        temperature: this.config.analysisTemperature
      });

      return this.parseResearchNarrativeResponse(response);

    } catch (error) {
      console.error('Research narrative generation failed:', error);
      return this.getDefaultResearchNarrative();
    }
  }

  // ===== PROMPT BUILDERS =====

  private buildPopulationMoodPrompt(
    deterministicResults: DeterministicResults,
    witterSentiment: SentimentAnalysis,
    samplePosts: any[],
    previousPsychology: any[] = []
  ): string {
    return `Analyze the population mood for a civilization based on the following data:

ECONOMIC INDICATORS:
- GDP Growth: ${deterministicResults.economic.gdpGrowth}%
- Unemployment: ${deterministicResults.economic.unemployment}%
- Inflation: ${deterministicResults.economic.inflation}%

SOCIAL MEDIA SENTIMENT:
- Overall Sentiment: ${witterSentiment.overallSentiment}
- Top Emotions: Joy(${witterSentiment.emotionalBreakdown.joy}), Anger(${witterSentiment.emotionalBreakdown.anger}), Fear(${witterSentiment.emotionalBreakdown.fear})

SAMPLE POSTS:
${samplePosts.map(post => `"${post.content}" - ${post.author_name}`).join('\n')}

${previousPsychology.length > 0 ? `
PREVIOUS PSYCHOLOGY ANALYSIS (for continuity):
${previousPsychology.slice(0, 3).map(p => 
  `Tick ${p.metadata.tickId}: ${p.psychologyMetrics.overallMood} (${p.psychologyMetrics.trendDirection})`
).join('\n')}

Consider the psychological trends and provide analysis that acknowledges continuity or significant changes.
` : ''}

Provide analysis in JSON format:
{
  "overall": "ecstatic|happy|content|concerned|angry|rebellious",
  "factors": ["factor1", "factor2", ...],
  "demographicBreakdown": {"young_adults": "mood", "professionals": "mood", ...}
}`;
  }

  private buildSentimentAnalysisPrompt(posts: any[]): string {
    const postTexts = posts.slice(0, 50).map(post => post.content).join('\n');
    
    return `Analyze the sentiment of these social media posts from a civilization's population:

POSTS:
${postTexts}

Provide detailed sentiment analysis in JSON format:
{
  "overallSentiment": -1.0 to 1.0,
  "emotionalBreakdown": {
    "joy": 0.0 to 1.0,
    "anger": 0.0 to 1.0,
    "fear": 0.0 to 1.0,
    "sadness": 0.0 to 1.0,
    "surprise": 0.0 to 1.0,
    "trust": 0.0 to 1.0
  },
  "topTopics": [{"topic": "economy", "sentiment": 0.5, "mentions": 15}, ...],
  "influentialPosts": [{"content": "post text", "sentiment": 0.8, "engagement": 25}, ...]
}`;
  }

  private buildEconomicNarrativePrompt(deterministicResults: DeterministicResults): string {
    return `Generate an economic narrative for a civilization based on these indicators:

ECONOMIC DATA:
- GDP: ${deterministicResults.economic.gdp}
- GDP Growth: ${deterministicResults.economic.gdpGrowth}%
- Inflation: ${deterministicResults.economic.inflation}%
- Unemployment: ${deterministicResults.economic.unemployment}%
- Trade Balance: ${deterministicResults.economic.tradeBalance}

RESOURCE PRODUCTION:
${Object.entries(deterministicResults.economic.resourceProduction).map(([resource, amount]) => 
  `- ${resource}: ${amount}`).join('\n')}

Provide economic narrative in JSON format:
{
  "summary": "Brief economic overview",
  "trends": [{"category": "production", "direction": "up", "magnitude": "moderate", "description": "...", "causes": [...], "implications": [...]}],
  "predictions": ["prediction1", "prediction2", ...],
  "concerns": ["concern1", "concern2", ...],
  "opportunities": ["opportunity1", "opportunity2", ...],
  "marketStory": "Narrative about market conditions"
}`;
  }

  private buildMilitaryAssessmentPrompt(deterministicResults: DeterministicResults): string {
    return `Assess the military situation for a civilization:

MILITARY METRICS:
- Total Forces: ${deterministicResults.military.totalForces}
- Readiness Level: ${deterministicResults.military.readinessLevel}
- Morale: ${deterministicResults.military.morale}
- Defensive Capability: ${deterministicResults.military.defensiveCapability}
- Offensive Capability: ${deterministicResults.military.offensiveCapability}
- Threat Level: ${deterministicResults.military.threatLevel}

Provide military assessment in JSON format:
{
  "readiness": "Description of military readiness",
  "morale": "Description of military morale",
  "threats": [{"source": "enemy", "type": "military", "severity": "high", "probability": 0.7, "description": "...", "timeframe": "...", "mitigationOptions": [...]}],
  "opportunities": ["opportunity1", "opportunity2", ...],
  "strategicSituation": "Overall strategic assessment",
  "recommendations": ["recommendation1", "recommendation2", ...]
}`;
  }

  private buildDiplomaticAnalysisPrompt(deterministicResults: DeterministicResults): string {
    return `Analyze the diplomatic situation:

DIPLOMATIC METRICS:
- Active Negotiations: ${deterministicResults.diplomatic.activeNegotiations}
- Trade Agreements: ${deterministicResults.diplomatic.tradeAgreements}
- Conflicts: ${deterministicResults.diplomatic.conflicts}
- Diplomatic Influence: ${deterministicResults.diplomatic.diplomaticInfluence}

Provide diplomatic analysis in JSON format:
{
  "relationships": [{"civilizationId": "civ1", "civilizationName": "Empire", "currentStatus": "...", "trend": "improving", "keyIssues": [...], "opportunities": [...], "riskFactors": [...]}],
  "negotiations": ["negotiation1", "negotiation2", ...],
  "tensions": ["tension1", "tension2", ...],
  "opportunities": ["opportunity1", "opportunity2", ...],
  "overallStanding": "Description of overall diplomatic standing"
}`;
  }

  private buildResearchNarrativePrompt(deterministicResults: DeterministicResults): string {
    return `Analyze research and technology progress:

RESEARCH METRICS:
- Total Projects: ${deterministicResults.research.totalProjects}
- Completion Rate: ${deterministicResults.research.completionRate}%
- Research Efficiency: ${deterministicResults.research.researchEfficiency}
- Technology Level: ${deterministicResults.research.technologyLevel}
- Innovation Index: ${deterministicResults.research.innovationIndex}

Provide research narrative in JSON format:
{
  "breakthroughs": ["breakthrough1", "breakthrough2", ...],
  "setbacks": ["setback1", "setback2", ...],
  "innovations": [{"field": "physics", "type": "breakthrough", "description": "...", "implications": [...], "timeToImplementation": "...", "requiredResources": [...]}],
  "researchClimate": "Description of overall research environment",
  "futureProspects": ["prospect1", "prospect2", ...]
}`;
  }

  // ===== RESPONSE PARSERS =====

  private parsePopulationMoodResponse(response: string): Partial<PopulationMood> {
    try {
      const parsed = JSON.parse(response);
      return {
        overall: parsed.overall || 'content',
        factors: parsed.factors || [],
        demographicBreakdown: parsed.demographicBreakdown || {}
      };
    } catch (error) {
      console.error('Failed to parse population mood response:', error);
      return {
        overall: 'content',
        factors: ['Economic conditions', 'Social stability'],
        demographicBreakdown: {}
      };
    }
  }

  private parseSentimentAnalysisResponse(response: string, posts: any[]): SentimentAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        overallSentiment: parsed.overallSentiment || 0,
        emotionalBreakdown: parsed.emotionalBreakdown || {
          joy: 0.2, anger: 0.1, fear: 0.1, sadness: 0.1, surprise: 0.1, trust: 0.3
        },
        topTopics: parsed.topTopics || [],
        influentialPosts: parsed.influentialPosts?.map((post: any) => ({
          postId: 'unknown',
          author: 'Unknown',
          content: post.content || '',
          sentiment: post.sentiment || 0,
          engagement: post.engagement || 0
        })) || []
      };
    } catch (error) {
      console.error('Failed to parse sentiment analysis response:', error);
      return this.getDefaultSentimentAnalysis();
    }
  }

  private parseEconomicNarrativeResponse(response: string, deterministicResults: DeterministicResults): EconomicNarrative {
    try {
      const parsed = JSON.parse(response);
      return {
        summary: parsed.summary || 'Economic conditions are stable.',
        trends: parsed.trends || [],
        predictions: parsed.predictions || [],
        concerns: parsed.concerns || [],
        opportunities: parsed.opportunities || [],
        marketStory: parsed.marketStory || 'Markets are operating normally.'
      };
    } catch (error) {
      console.error('Failed to parse economic narrative response:', error);
      return this.getDefaultEconomicNarrative();
    }
  }

  private parseMilitaryAssessmentResponse(response: string, deterministicResults: DeterministicResults): MilitaryAssessment {
    try {
      const parsed = JSON.parse(response);
      return {
        readiness: parsed.readiness || 'Military forces are at standard readiness.',
        morale: parsed.morale || 'Morale is stable.',
        threats: parsed.threats || [],
        opportunities: parsed.opportunities || [],
        strategicSituation: parsed.strategicSituation || 'Strategic situation is stable.',
        recommendations: parsed.recommendations || []
      };
    } catch (error) {
      console.error('Failed to parse military assessment response:', error);
      return this.getDefaultMilitaryAssessment();
    }
  }

  private parseDiplomaticNarrativeResponse(response: string): DiplomaticNarrative {
    try {
      const parsed = JSON.parse(response);
      return {
        relationships: parsed.relationships || [],
        negotiations: parsed.negotiations || [],
        tensions: parsed.tensions || [],
        opportunities: parsed.opportunities || [],
        overallStanding: parsed.overallStanding || 'Diplomatic standing is neutral.'
      };
    } catch (error) {
      console.error('Failed to parse diplomatic narrative response:', error);
      return this.getDefaultDiplomaticNarrative();
    }
  }

  private parseResearchNarrativeResponse(response: string): ResearchNarrative {
    try {
      const parsed = JSON.parse(response);
      return {
        breakthroughs: parsed.breakthroughs || [],
        setbacks: parsed.setbacks || [],
        innovations: parsed.innovations || [],
        researchClimate: parsed.researchClimate || 'Research environment is stable.',
        futureProspects: parsed.futureProspects || []
      };
    } catch (error) {
      console.error('Failed to parse research narrative response:', error);
      return this.getDefaultResearchNarrative();
    }
  }

  // ===== UTILITY METHODS =====

  private calculateMoodTrend(
    deterministicResults: DeterministicResults,
    witterSentiment: SentimentAnalysis
  ): 'improving' | 'stable' | 'declining' {
    const economicScore = deterministicResults.economic.gdpGrowth + 
                         (100 - deterministicResults.economic.unemployment) +
                         (100 - deterministicResults.economic.inflation);
    
    const sentimentScore = witterSentiment.overallSentiment * 100;
    
    const combinedScore = (economicScore + sentimentScore) / 2;
    
    if (combinedScore > 60) return 'improving';
    if (combinedScore < 40) return 'declining';
    return 'stable';
  }

  private calculateConfidenceScore(sources: AnalysisSource[], analysisTime: number): number {
    let score = 0.5; // Base confidence
    
    // Increase confidence based on data quality and quantity
    sources.forEach(source => {
      if (source.quality === 'high') score += 0.2;
      else if (source.quality === 'medium') score += 0.1;
      
      if (source.count > 50) score += 0.1;
      else if (source.count > 20) score += 0.05;
    });
    
    // Decrease confidence if analysis took too long (might indicate issues)
    if (analysisTime > this.config.maxNaturalLanguageAnalysisTime) {
      score -= 0.2;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  // ===== DEFAULT VALUES =====

  private getDefaultPopulationMood(): PopulationMood {
    return {
      overall: 'content',
      factors: ['Economic stability', 'Social order'],
      witterSentiment: this.getDefaultSentimentAnalysis(),
      demographicBreakdown: {},
      trendDirection: 'stable'
    };
  }

  private getDefaultSentimentAnalysis(): SentimentAnalysis {
    return {
      overallSentiment: 0,
      emotionalBreakdown: {
        joy: 0.2,
        anger: 0.1,
        fear: 0.1,
        sadness: 0.1,
        surprise: 0.1,
        trust: 0.3
      },
      topTopics: [],
      influentialPosts: []
    };
  }

  private getDefaultEconomicNarrative(): EconomicNarrative {
    return {
      summary: 'Economic conditions are stable with moderate growth.',
      trends: [],
      predictions: ['Continued stable growth expected'],
      concerns: [],
      opportunities: [],
      marketStory: 'Markets are operating within normal parameters.'
    };
  }

  private getDefaultMilitaryAssessment(): MilitaryAssessment {
    return {
      readiness: 'Military forces maintain standard readiness levels.',
      morale: 'Troop morale is stable and within acceptable ranges.',
      threats: [],
      opportunities: [],
      strategicSituation: 'Strategic situation remains stable with no immediate concerns.',
      recommendations: []
    };
  }

  private getDefaultDiplomaticNarrative(): DiplomaticNarrative {
    return {
      relationships: [],
      negotiations: [],
      tensions: [],
      opportunities: [],
      overallStanding: 'Diplomatic relations are stable across all fronts.'
    };
  }

  private getDefaultResearchNarrative(): ResearchNarrative {
    return {
      breakthroughs: [],
      setbacks: [],
      innovations: [],
      researchClimate: 'Research and development activities proceed at normal pace.',
      futureProspects: ['Continued incremental progress expected']
    };
  }

  // ===== CROSS-CUTTING ANALYSIS =====

  private async generateOverallNarrative(
    deterministicResults: DeterministicResults,
    populationMood: PopulationMood,
    economicStory: EconomicNarrative,
    militaryStatus: MilitaryAssessment,
    diplomaticSituation: DiplomaticNarrative,
    researchNarrative: ResearchNarrative
  ): Promise<string> {
    try {
      const prompt = `Generate an overall narrative summary for a civilization based on:

POPULATION: ${populationMood.overall} mood, trending ${populationMood.trendDirection}
ECONOMY: ${economicStory.summary}
MILITARY: ${militaryStatus.strategicSituation}
DIPLOMACY: ${diplomaticSituation.overallStanding}
RESEARCH: ${researchNarrative.researchClimate}

Provide a cohesive 2-3 sentence narrative that captures the civilization's current state and trajectory.`;

      const response = await llmService.generateText(prompt, {
        maxTokens: 200,
        temperature: this.config.analysisTemperature
      });

      return response.trim();

    } catch (error) {
      console.error('Overall narrative generation failed:', error);
      return 'The civilization continues to develop across multiple fronts with stable progress in most sectors.';
    }
  }

  private async identifyKeyEvents(
    deterministicResults: DeterministicResults,
    populationMood: PopulationMood,
    economicStory: EconomicNarrative,
    militaryStatus: MilitaryAssessment
  ): Promise<NarrativeEvent[]> {
    // TODO: Implement key event identification based on significant changes
    return [];
  }

  private async generatePredictions(
    deterministicResults: DeterministicResults,
    populationMood: PopulationMood,
    economicStory: EconomicNarrative,
    militaryStatus: MilitaryAssessment
  ): Promise<Prediction[]> {
    // TODO: Implement prediction generation based on current trends
    return [];
  }
}
