/**
 * Leader Briefing Engine
 * 
 * AI-powered briefing generation system that creates comprehensive executive
 * briefings for leaders with decision support, threat assessment, and recommendations.
 */

import { 
  LeaderBriefing, 
  BriefingRequest, 
  BriefingSection,
  BriefingType,
  CivilizationStatus,
  ThreatAssessment,
  OpportunityAnalysis,
  Recommendation,
  UrgentMatter,
  PendingDecision,
  AdvisorInput,
  DecisionCategory,
  UrgencyLevel,
  ConfidenceLevel
} from './types';
import { LLMProvider, SimpleLLMProvider } from '../providers/LLMProvider';
import { vectorMemory } from '../storage/VectorMemory';
import { db } from '../storage/db';
import { nanoid } from 'nanoid';

export class LeaderBriefingEngine {
  private llmProvider: LLMProvider;

  constructor() {
    this.llmProvider = new SimpleLLMProvider();
  }

  /**
   * Generate a comprehensive leader briefing
   */
  async generateBriefing(request: BriefingRequest): Promise<LeaderBriefing> {
    const startTime = Date.now();

    try {
      // 1. Gather context and data sources
      const context = await this.gatherBriefingContext(request);
      
      // 2. Generate briefing sections
      const sections = await this.generateBriefingSections(request, context);
      
      // 3. Analyze civilization status
      const civilizationStatus = await this.analyzeCivilizationStatus(context);
      
      // 4. Assess threats and opportunities
      const threatAssessment = await this.assessThreats(context);
      const opportunityAnalysis = await this.analyzeOpportunities(context);
      
      // 5. Generate recommendations
      const recommendations = await this.generateRecommendations(context, sections);
      
      // 6. Identify urgent matters
      const urgentMatters = await this.identifyUrgentMatters(context, sections);
      
      // 7. Generate pending decisions
      const pendingDecisions = await this.generatePendingDecisions(context);
      
      // 8. Collect advisor inputs
      const advisorInputs = await this.collectAdvisorInputs(request);
      
      // 9. Generate executive summary and key points
      const { summary, keyPoints } = await this.generateExecutiveSummary(
        sections, 
        recommendations, 
        urgentMatters,
        civilizationStatus
      );

      const generationTime = Date.now() - startTime;

      const briefing: LeaderBriefing = {
        id: nanoid(),
        type: request.type,
        title: this.generateBriefingTitle(request.type, civilizationStatus),
        summary,
        content: this.assembleBriefingContent(sections, summary),
        
        campaignId: request.campaignId,
        tickId: request.tickId,
        leaderCharacterId: request.leaderCharacterId,
        
        sections,
        keyPoints,
        recommendations,
        urgentMatters,
        pendingDecisions,
        advisorInputs,
        
        civilizationStatus,
        threatAssessment,
        opportunityAnalysis,
        
        generationContext: {
          aiModel: 'gpt-4',
          prompt: 'Executive briefing generation',
          temperature: 0.3,
          confidence: 0.85,
          generationTime,
          sources: context.sources
        },
        
        createdAt: new Date(),
        scheduledFor: request.scheduledFor,
        acknowledged: false,
        priority: this.determineBriefingPriority(urgentMatters, threatAssessment),
        classification: this.determineBriefingClassification(request.type, threatAssessment)
      };

      return briefing;
    } catch (error) {
      console.error('Error generating briefing:', error);
      throw new Error(`Failed to generate briefing: ${error}`);
    }
  }

  /**
   * Gather context and data for briefing generation
   */
  private async gatherBriefingContext(request: BriefingRequest): Promise<any> {
    const context: any = {
      sources: [],
      simulationData: {},
      memoryData: {},
      intelligenceReports: [],
      newsArticles: [],
      recentEvents: request.recentEvents || []
    };

    try {
      // 1. Get simulation data
      context.simulationData = await this.getSimulationData(request.campaignId, request.tickId);
      context.sources.push('simulation_engine');

      // 2. Get memory context
      context.memoryData = await this.getMemoryContext(request.campaignId);
      context.sources.push('memory_systems');

      // 3. Get recent intelligence reports
      context.intelligenceReports = await this.getRecentIntelligenceReports(
        request.campaignId, 
        request.tickId
      );
      if (context.intelligenceReports.length > 0) {
        context.sources.push('intelligence_reports');
      }

      // 4. Get recent news articles
      context.newsArticles = await this.getRecentNewsArticles(
        request.campaignId, 
        request.tickId
      );
      if (context.newsArticles.length > 0) {
        context.sources.push('news_articles');
      }

      // 5. Get advisor data
      context.advisorData = await this.getAdvisorData(request.campaignId);
      if (context.advisorData.length > 0) {
        context.sources.push('advisor_systems');
      }

      return context;
    } catch (error) {
      console.error('Error gathering briefing context:', error);
      return context;
    }
  }

  /**
   * Generate briefing sections based on type and context
   */
  private async generateBriefingSections(
    request: BriefingRequest, 
    context: any
  ): Promise<BriefingSection[]> {
    const sections: BriefingSection[] = [];

    // Define sections based on briefing type
    const sectionTypes = this.getSectionTypesForBriefing(request.type);

    for (const sectionType of sectionTypes) {
      try {
        const section = await this.generateSection(sectionType, context, request);
        sections.push(section);
      } catch (error) {
        console.error(`Error generating section ${sectionType}:`, error);
        // Continue with other sections
      }
    }

    return sections;
  }

  /**
   * Generate a specific briefing section
   */
  private async generateSection(
    sectionType: string, 
    context: any, 
    request: BriefingRequest
  ): Promise<BriefingSection> {
    const prompt = this.buildSectionPrompt(sectionType, context, request);
    
    const response = await this.llmProvider.generateText({
      prompt,
      temperature: 0.3,
      maxTokens: 800,
      model: 'gpt-4'
    });

    const sectionContent = this.parseSectionResponse(response.text, sectionType);

    return {
      id: nanoid(),
      title: this.getSectionTitle(sectionType),
      content: sectionContent.content,
      category: this.getSectionCategory(sectionType),
      priority: this.getSectionPriority(sectionType, context),
      
      metrics: this.extractSectionMetrics(sectionContent, context),
      charts: this.generateSectionCharts(sectionType, context),
      
      sentiment: this.analyzeSectionSentiment(sectionContent.content),
      confidence: response.confidence || 0.8,
      keyInsights: sectionContent.insights || [],
      
      actionRequired: this.determineActionRequired(sectionType, sectionContent),
      suggestedActions: sectionContent.actions || [],
      deadline: this.determineSectionDeadline(sectionType, sectionContent)
    };
  }

  /**
   * Analyze civilization status
   */
  private async analyzeCivilizationStatus(context: any): Promise<CivilizationStatus> {
    const prompt = `Analyze the current status of this civilization based on the following data:

SIMULATION DATA:
${JSON.stringify(context.simulationData, null, 2)}

RECENT EVENTS:
${context.recentEvents.map((e: any) => `- ${e.description || e.title || JSON.stringify(e)}`).join('\n')}

INTELLIGENCE SUMMARY:
${context.intelligenceReports.slice(0, 3).map((r: any) => `- ${r.summary || r.title}`).join('\n')}

Provide a comprehensive civilization status assessment including:
1. Overall status (thriving/stable/concerning/critical/crisis)
2. Key metrics (0-1 scale): economic health, military strength, diplomatic standing, social cohesion, technological advancement
3. Trends for each area (improving/stable/declining)
4. Key strengths, weaknesses, opportunities, and threats (3-5 each)

Format as JSON with the structure:
{
  "overall": "status",
  "economicHealth": 0.0-1.0,
  "militaryStrength": 0.0-1.0,
  "diplomaticStanding": 0.0-1.0,
  "socialCohesion": 0.0-1.0,
  "technologicalAdvancement": 0.0-1.0,
  "economicTrend": "trend",
  "militaryTrend": "trend",
  "diplomaticTrend": "trend",
  "socialTrend": "trend",
  "techTrend": "trend",
  "keyStrengths": ["strength1", "strength2", ...],
  "keyWeaknesses": ["weakness1", "weakness2", ...],
  "emergingOpportunities": ["opportunity1", "opportunity2", ...],
  "immediateThreats": ["threat1", "threat2", ...]
}`;

    try {
      const response = await this.llmProvider.generateText({
        prompt,
        temperature: 0.2,
        maxTokens: 1000,
        model: 'gpt-4'
      });

      const analysis = JSON.parse(response.text);
      return analysis as CivilizationStatus;
    } catch (error) {
      console.error('Error analyzing civilization status:', error);
      return this.getDefaultCivilizationStatus();
    }
  }

  /**
   * Assess threats
   */
  private async assessThreats(context: any): Promise<ThreatAssessment> {
    const prompt = `Assess threats to this civilization based on the following data:

SIMULATION DATA:
${JSON.stringify(context.simulationData, null, 2)}

INTELLIGENCE REPORTS:
${context.intelligenceReports.map((r: any) => `- ${r.summary || r.title}`).join('\n')}

NEWS ARTICLES:
${context.newsArticles.map((a: any) => `- ${a.headline}`).join('\n')}

Identify and assess threats across categories:
- Military threats (external conflicts, defense weaknesses)
- Economic threats (market instability, resource shortages)
- Diplomatic threats (alliance breakdowns, international tensions)
- Internal threats (civil unrest, political instability)
- Technological threats (cyber attacks, tech gaps)
- Environmental threats (disasters, resource depletion)

For each threat, provide:
- Name and description
- Severity (low/medium/high/critical)
- Probability (0-1)
- Timeframe (immediate/short_term/medium_term/long_term)
- Potential impact
- Mitigation strategies

Format as JSON with comprehensive threat assessment structure.`;

    try {
      const response = await this.llmProvider.generateText({
        prompt,
        temperature: 0.2,
        maxTokens: 1200,
        model: 'gpt-4'
      });

      const assessment = JSON.parse(response.text);
      return this.processThreatAssessment(assessment);
    } catch (error) {
      console.error('Error assessing threats:', error);
      return this.getDefaultThreatAssessment();
    }
  }

  /**
   * Analyze opportunities
   */
  private async analyzeOpportunities(context: any): Promise<OpportunityAnalysis> {
    const prompt = `Analyze opportunities for this civilization based on the following data:

SIMULATION DATA:
${JSON.stringify(context.simulationData, null, 2)}

RECENT DEVELOPMENTS:
${context.recentEvents.map((e: any) => `- ${e.description || e.title}`).join('\n')}

Identify opportunities across categories:
- Economic opportunities (market expansion, trade deals, resource discoveries)
- Diplomatic opportunities (alliance building, peace negotiations)
- Technological opportunities (research breakthroughs, innovation)
- Military opportunities (strategic advantages, defense improvements)
- Social opportunities (cultural development, education advances)

For each opportunity, provide:
- Name and description
- Potential (low/medium/high/transformative)
- Benefits and requirements
- Feasibility (0-1)
- Strategic importance
- Timeline and resource requirements

Format as JSON with comprehensive opportunity analysis structure.`;

    try {
      const response = await this.llmProvider.generateText({
        prompt,
        temperature: 0.3,
        maxTokens: 1000,
        model: 'gpt-4'
      });

      const analysis = JSON.parse(response.text);
      return this.processOpportunityAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing opportunities:', error);
      return this.getDefaultOpportunityAnalysis();
    }
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(
    context: any, 
    sections: BriefingSection[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Generate recommendations based on sections and context
    const prompt = `Based on the following briefing sections and context, generate strategic recommendations for the leader:

BRIEFING SECTIONS:
${sections.map(s => `${s.title}: ${s.content.substring(0, 200)}...`).join('\n\n')}

CONTEXT SUMMARY:
- Simulation data available: ${Object.keys(context.simulationData).join(', ')}
- Recent events: ${context.recentEvents.length} events
- Intelligence reports: ${context.intelligenceReports.length} reports

Generate 3-7 strategic recommendations covering:
1. Immediate actions (next 1-2 ticks)
2. Short-term priorities (next 5-10 ticks)
3. Strategic initiatives (longer term)

For each recommendation, provide:
- Title and description
- Category (economic/military/diplomatic/social/technological/etc.)
- Priority (routine/important/urgent/critical/emergency)
- Rationale and expected benefits
- Action steps and timeline
- Resources needed
- Confidence level

Format as JSON array of recommendation objects.`;

    try {
      const response = await this.llmProvider.generateText({
        prompt,
        temperature: 0.4,
        maxTokens: 1500,
        model: 'gpt-4'
      });

      const recommendationData = JSON.parse(response.text);
      
      for (const rec of recommendationData) {
        recommendations.push(this.processRecommendation(rec));
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Identify urgent matters
   */
  private async identifyUrgentMatters(
    context: any, 
    sections: BriefingSection[]
  ): Promise<UrgentMatter[]> {
    const urgentMatters: UrgentMatter[] = [];

    // Look for urgent items in sections
    for (const section of sections) {
      if (section.priority === 'urgent' || section.priority === 'critical' || section.priority === 'emergency') {
        if (section.actionRequired) {
          urgentMatters.push({
            id: nanoid(),
            title: `Urgent: ${section.title}`,
            description: section.content.substring(0, 300),
            urgency: section.priority,
            category: section.category,
            deadline: section.deadline || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
            timeRemaining: this.calculateTimeRemaining(section.deadline),
            consequences: [`Delayed action on ${section.title} may impact civilization stability`],
            stakeholders: ['Leader', 'Cabinet', 'Military Command'],
            immediateActions: section.suggestedActions,
            longerTermActions: [],
            status: 'new',
            createdAt: new Date(),
            updatedAt: new Date(),
            source: 'briefing_analysis'
          });
        }
      }
    }

    // Add context-based urgent matters
    if (context.intelligenceReports) {
      for (const report of context.intelligenceReports.slice(0, 3)) {
        if (report.threatLevel === 'critical' || report.threatLevel === 'high') {
          urgentMatters.push({
            id: nanoid(),
            title: `Intelligence Alert: ${report.title || 'Critical Situation'}`,
            description: report.summary || report.executiveSummary || 'Critical intelligence matter requiring attention',
            urgency: 'critical',
            category: 'security',
            deadline: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
            timeRemaining: '12 hours',
            consequences: ['National security implications', 'Potential strategic disadvantage'],
            stakeholders: ['Leader', 'Intelligence Chief', 'Security Council'],
            immediateActions: ['Review full intelligence report', 'Convene security briefing'],
            longerTermActions: ['Develop response strategy'],
            status: 'new',
            createdAt: new Date(),
            updatedAt: new Date(),
            source: 'intelligence_report'
          });
        }
      }
    }

    return urgentMatters;
  }

  /**
   * Generate pending decisions
   */
  private async generatePendingDecisions(context: any): Promise<PendingDecision[]> {
    const decisions: PendingDecision[] = [];

    // This would typically query a decisions database
    // For now, generate based on context analysis
    
    if (context.simulationData.economy?.gdpChange < -0.05) {
      decisions.push({
        id: nanoid(),
        title: 'Economic Stimulus Response',
        description: 'Economic indicators show significant decline. Immediate intervention may be required.',
        category: 'economic',
        urgency: 'urgent',
        background: 'GDP has declined by more than 5%, indicating potential recession conditions.',
        stakeholders: ['Economic Advisors', 'Business Leaders', 'Labor Representatives'],
        constraints: ['Limited fiscal resources', 'Political opposition to spending'],
        options: [
          {
            id: 'stimulus-1',
            title: 'Aggressive Stimulus Package',
            description: 'Large-scale government spending and tax cuts',
            pros: ['Rapid economic recovery', 'Job creation', 'Business confidence'],
            cons: ['High fiscal cost', 'Potential inflation', 'Debt increase'],
            risks: ['Inflation risk', 'Political backlash'],
            opportunities: ['Economic modernization', 'Infrastructure improvement'],
            expectedOutcomes: [
              {
                description: 'GDP recovery within 2-3 ticks',
                probability: 0.7,
                impact: 'high',
                timeframe: '2-3 ticks',
                metrics: ['GDP growth', 'Employment rate']
              }
            ],
            resourceRequirements: [
              {
                type: 'financial',
                description: 'Government spending',
                quantity: 1000000000,
                unit: 'credits',
                availability: 0.6,
                criticality: 'critical'
              }
            ],
            successProbability: 0.7,
            riskLevel: 0.4,
            costEstimate: 1000000000,
            timeToImplement: 30,
            supportLevel: {
              'Economic Advisors': 0.8,
              'Business Leaders': 0.9,
              'Labor Representatives': 0.7,
              'Fiscal Conservatives': -0.6
            },
            opposition: ['Fiscal Conservative Party', 'Anti-Spending Coalition']
          }
        ],
        riskAssessment: {
          overallRisk: 'medium',
          risks: [
            {
              id: 'inflation-risk',
              description: 'Stimulus may trigger inflation',
              category: 'economic',
              probability: 0.3,
              impact: 0.6,
              riskScore: 0.18,
              mitigation: ['Gradual implementation', 'Inflation monitoring'],
              contingency: ['Monetary policy adjustment'],
              status: 'identified'
            }
          ],
          implementation: 0.3,
          financial: 0.5,
          political: 0.4,
          operational: 0.2,
          strategic: 0.3,
          mitigationStrategies: ['Phased implementation', 'Regular monitoring'],
          contingencyPlans: ['Stimulus reduction if inflation spikes'],
          riskIndicators: ['Inflation rate', 'Public debt ratio'],
          reviewFrequency: 'monthly'
        },
        costBenefitAnalysis: {
          netBenefit: 500000000,
          roi: 0.5,
          paybackPeriod: 24,
          costs: [
            {
              category: 'Government Spending',
              description: 'Direct stimulus payments and programs',
              amount: 1000000000,
              timeframe: '12 months',
              certainty: 0.9
            }
          ],
          benefits: [
            {
              category: 'Economic Growth',
              description: 'Increased GDP and employment',
              value: 1500000000,
              timeframe: '24 months',
              certainty: 0.7,
              quantifiable: true
            }
          ],
          breakEvenPoint: 18,
          sensitivityAnalysis: {
            'GDP multiplier': 0.3,
            'Implementation speed': 0.2,
            'External conditions': 0.4
          },
          assumptions: ['Normal market conditions', 'No external shocks'],
          confidence: 'medium',
          uncertaintyFactors: ['Global economic conditions', 'Political stability']
        },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
        priority: 1
      });
    }

    return decisions;
  }

  /**
   * Collect advisor inputs
   */
  private async collectAdvisorInputs(request: BriefingRequest): Promise<AdvisorInput[]> {
    const advisorInputs: AdvisorInput[] = [];

    // This would typically query advisor systems
    // For now, generate representative inputs
    
    advisorInputs.push({
      advisorId: 'economic-advisor-1',
      advisorName: 'Chief Economic Advisor',
      domain: 'Economics',
      summary: 'Economic indicators show mixed signals with growth in some sectors offset by challenges in others.',
      recommendations: [
        'Monitor inflation indicators closely',
        'Consider targeted sector support',
        'Maintain fiscal discipline while supporting growth'
      ],
      concerns: [
        'Rising unemployment in manufacturing',
        'Potential supply chain disruptions',
        'Currency stability concerns'
      ],
      confidence: 'high',
      urgency: 'important',
      data: {
        gdpGrowth: 0.02,
        inflation: 0.03,
        unemployment: 0.08
      },
      sources: ['Economic Statistics Bureau', 'Central Bank Reports'],
      timestamp: new Date(),
      priority: 2
    });

    return advisorInputs;
  }

  /**
   * Generate executive summary
   */
  private async generateExecutiveSummary(
    sections: BriefingSection[],
    recommendations: Recommendation[],
    urgentMatters: UrgentMatter[],
    civilizationStatus: CivilizationStatus
  ): Promise<{ summary: string; keyPoints: string[] }> {
    const prompt = `Generate an executive summary and key points for a leader briefing based on:

CIVILIZATION STATUS: ${civilizationStatus.overall}
KEY STRENGTHS: ${civilizationStatus.keyStrengths.join(', ')}
KEY WEAKNESSES: ${civilizationStatus.keyWeaknesses.join(', ')}

URGENT MATTERS: ${urgentMatters.length} urgent items requiring attention
TOP RECOMMENDATIONS: ${recommendations.slice(0, 3).map(r => r.title).join(', ')}

BRIEFING SECTIONS:
${sections.map(s => `- ${s.title}: ${s.priority} priority`).join('\n')}

Generate:
1. A concise executive summary (2-3 paragraphs, 150-200 words)
2. 5-7 key points for quick reference

Format as JSON:
{
  "summary": "executive summary text",
  "keyPoints": ["point 1", "point 2", ...]
}`;

    try {
      const response = await this.llmProvider.generateText({
        prompt,
        temperature: 0.3,
        maxTokens: 600,
        model: 'gpt-4'
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Error generating executive summary:', error);
      return {
        summary: 'Executive briefing generated successfully. Review sections for detailed analysis.',
        keyPoints: [
          'Civilization status assessed',
          'Threats and opportunities identified',
          'Strategic recommendations provided',
          'Urgent matters flagged for attention'
        ]
      };
    }
  }

  // Helper Methods

  private getSectionTypesForBriefing(type: BriefingType): string[] {
    const sectionMap: Record<BriefingType, string[]> = {
      daily: ['situation_overview', 'urgent_matters', 'key_decisions'],
      weekly: ['situation_overview', 'economic_status', 'security_update', 'diplomatic_summary'],
      monthly: ['comprehensive_status', 'strategic_analysis', 'long_term_planning'],
      situation: ['situation_analysis', 'immediate_actions', 'risk_assessment'],
      crisis: ['crisis_overview', 'immediate_response', 'resource_mobilization', 'communication_strategy'],
      strategic: ['strategic_assessment', 'long_term_objectives', 'resource_allocation'],
      economic: ['economic_overview', 'market_analysis', 'fiscal_status', 'trade_summary'],
      military: ['military_status', 'threat_assessment', 'readiness_report', 'strategic_positioning'],
      diplomatic: ['diplomatic_status', 'international_relations', 'treaty_obligations', 'negotiation_opportunities'],
      intelligence: ['intelligence_summary', 'threat_analysis', 'operational_updates'],
      custom: ['situation_overview', 'key_analysis', 'recommendations']
    };

    return sectionMap[type] || sectionMap.daily;
  }

  private buildSectionPrompt(sectionType: string, context: any, request: BriefingRequest): string {
    const basePrompt = `Generate a ${sectionType.replace('_', ' ')} section for a leader briefing.

CONTEXT:
- Campaign ID: ${request.campaignId}
- Tick ID: ${request.tickId}
- Briefing Type: ${request.type}

AVAILABLE DATA:
${JSON.stringify(context.simulationData, null, 2)}

RECENT EVENTS:
${context.recentEvents.map((e: any) => `- ${e.description || e.title || JSON.stringify(e)}`).join('\n')}

Generate a comprehensive ${sectionType.replace('_', ' ')} section with:
1. Clear, actionable content
2. Key insights and analysis
3. Specific recommendations if applicable
4. Data-driven conclusions

Keep the content focused, professional, and suitable for executive consumption.
Length: 200-400 words.`;

    return basePrompt;
  }

  private parseSectionResponse(response: string, sectionType: string): any {
    // Simple parsing - in production, this would be more sophisticated
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      content: response,
      insights: lines.filter(line => line.toLowerCase().includes('insight') || line.toLowerCase().includes('key')).slice(0, 3),
      actions: lines.filter(line => line.toLowerCase().includes('recommend') || line.toLowerCase().includes('action')).slice(0, 3)
    };
  }

  private getSectionTitle(sectionType: string): string {
    const titleMap: Record<string, string> = {
      situation_overview: 'Situation Overview',
      urgent_matters: 'Urgent Matters',
      key_decisions: 'Key Decisions Required',
      economic_status: 'Economic Status',
      security_update: 'Security Update',
      diplomatic_summary: 'Diplomatic Summary',
      comprehensive_status: 'Comprehensive Status Assessment',
      strategic_analysis: 'Strategic Analysis',
      long_term_planning: 'Long-term Planning',
      situation_analysis: 'Situation Analysis',
      immediate_actions: 'Immediate Actions Required',
      risk_assessment: 'Risk Assessment',
      crisis_overview: 'Crisis Overview',
      immediate_response: 'Immediate Response',
      resource_mobilization: 'Resource Mobilization',
      communication_strategy: 'Communication Strategy'
    };

    return titleMap[sectionType] || sectionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getSectionCategory(sectionType: string): DecisionCategory {
    const categoryMap: Record<string, DecisionCategory> = {
      economic_status: 'economic',
      economic_overview: 'economic',
      security_update: 'security',
      military_status: 'military',
      diplomatic_summary: 'diplomatic',
      diplomatic_status: 'diplomatic'
    };

    return categoryMap[sectionType] || 'social';
  }

  private getSectionPriority(sectionType: string, context: any): UrgencyLevel {
    if (sectionType.includes('crisis') || sectionType.includes('urgent')) {
      return 'critical';
    }
    if (sectionType.includes('immediate') || sectionType.includes('security')) {
      return 'urgent';
    }
    if (sectionType.includes('strategic') || sectionType.includes('long_term')) {
      return 'important';
    }
    return 'routine';
  }

  private extractSectionMetrics(sectionContent: any, context: any): Record<string, number> {
    // Extract relevant metrics from context
    const metrics: Record<string, number> = {};
    
    if (context.simulationData.economy) {
      metrics.gdpChange = context.simulationData.economy.gdpChange || 0;
      metrics.unemployment = context.simulationData.economy.unemployment || 0;
    }
    
    if (context.simulationData.military) {
      metrics.militaryReadiness = context.simulationData.military.readiness || 0;
    }

    return metrics;
  }

  private generateSectionCharts(sectionType: string, context: any): any[] {
    // Generate relevant charts based on section type and data
    const charts: any[] = [];

    if (sectionType.includes('economic') && context.simulationData.economy) {
      charts.push({
        type: 'line',
        title: 'Economic Indicators Trend',
        data: [
          { period: 'Previous', gdp: 100, unemployment: 5 },
          { period: 'Current', gdp: 102, unemployment: 4.8 }
        ],
        xAxis: 'period',
        yAxis: 'value'
      });
    }

    return charts;
  }

  private analyzeSectionSentiment(content: string): 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive' {
    // Simple sentiment analysis - in production, use proper NLP
    const positiveWords = ['good', 'excellent', 'positive', 'growth', 'success', 'improvement'];
    const negativeWords = ['bad', 'poor', 'negative', 'decline', 'failure', 'crisis'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
    
    const score = positiveCount - negativeCount;
    
    if (score >= 3) return 'very_positive';
    if (score >= 1) return 'positive';
    if (score <= -3) return 'very_negative';
    if (score <= -1) return 'negative';
    return 'neutral';
  }

  private determineActionRequired(sectionType: string, sectionContent: any): boolean {
    return sectionType.includes('urgent') || 
           sectionType.includes('immediate') || 
           sectionType.includes('crisis') ||
           (sectionContent.actions && sectionContent.actions.length > 0);
  }

  private determineSectionDeadline(sectionType: string, sectionContent: any): Date | undefined {
    if (sectionType.includes('urgent') || sectionType.includes('crisis')) {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
    if (sectionType.includes('immediate')) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
    return undefined;
  }

  private generateBriefingTitle(type: BriefingType, status: CivilizationStatus): string {
    const date = new Date().toLocaleDateString();
    const typeTitle = type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    
    return `${typeTitle} Briefing - ${date} (Status: ${status.overall})`;
  }

  private assembleBriefingContent(sections: BriefingSection[], summary: string): string {
    let content = `EXECUTIVE SUMMARY\n${summary}\n\n`;
    
    sections.forEach(section => {
      content += `${section.title.toUpperCase()}\n${section.content}\n\n`;
    });
    
    return content;
  }

  private determineBriefingPriority(urgentMatters: UrgentMatter[], threatAssessment: ThreatAssessment): UrgencyLevel {
    if (urgentMatters.some(m => m.urgency === 'emergency')) return 'emergency';
    if (urgentMatters.some(m => m.urgency === 'critical') || threatAssessment.overallThreatLevel === 'critical') return 'critical';
    if (urgentMatters.some(m => m.urgency === 'urgent') || threatAssessment.overallThreatLevel === 'high') return 'urgent';
    if (urgentMatters.length > 0) return 'important';
    return 'routine';
  }

  private determineBriefingClassification(type: BriefingType, threatAssessment: ThreatAssessment): 'public' | 'restricted' | 'confidential' | 'secret' | 'top_secret' {
    if (type === 'intelligence' || threatAssessment.overallThreatLevel === 'critical') return 'secret';
    if (type === 'military' || type === 'crisis') return 'confidential';
    if (type === 'strategic') return 'restricted';
    return 'public';
  }

  private calculateTimeRemaining(deadline?: Date): string {
    if (!deadline) return 'No deadline set';
    
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days`;
    return `${hours} hours`;
  }

  // Data retrieval methods (would integrate with actual systems)
  
  private async getSimulationData(campaignId: number, tickId: number): Promise<any> {
    // This would integrate with the hybrid simulation engine
    return {
      economy: {
        gdpChange: 0.02,
        unemployment: 0.05,
        inflation: 0.03,
        tradeBalance: 1000000
      },
      military: {
        readiness: 0.85,
        strength: 0.9,
        budgetChange: 0.01
      },
      politics: {
        approval: 0.65,
        stability: 0.8
      },
      technology: {
        researchProgress: 0.15,
        innovations: 2
      },
      social: {
        cohesion: 0.75,
        mood: 0.6
      }
    };
  }

  private async getMemoryContext(campaignId: number): Promise<any> {
    // This would integrate with the memory systems
    return {
      recentEvents: [],
      civilizationHistory: [],
      leaderActions: []
    };
  }

  private async getRecentIntelligenceReports(campaignId: number, tickId: number): Promise<any[]> {
    // This would query the intelligence system
    return [];
  }

  private async getRecentNewsArticles(campaignId: number, tickId: number): Promise<any[]> {
    // This would query the news system
    return [];
  }

  private async getAdvisorData(campaignId: number): Promise<any[]> {
    // This would query advisor systems
    return [];
  }

  // Default fallback methods

  private getDefaultCivilizationStatus(): CivilizationStatus {
    return {
      overall: 'stable',
      economicHealth: 0.7,
      militaryStrength: 0.8,
      diplomaticStanding: 0.6,
      socialCohesion: 0.75,
      technologicalAdvancement: 0.65,
      economicTrend: 'stable',
      militaryTrend: 'stable',
      diplomaticTrend: 'stable',
      socialTrend: 'stable',
      techTrend: 'advancing',
      keyStrengths: ['Strong military', 'Stable economy', 'Advanced technology'],
      keyWeaknesses: ['Diplomatic challenges', 'Social tensions'],
      emergingOpportunities: ['Trade expansion', 'Technology development'],
      immediateThreats: ['Economic uncertainty', 'Regional tensions']
    };
  }

  private getDefaultThreatAssessment(): ThreatAssessment {
    return {
      overallThreatLevel: 'moderate',
      threats: [],
      military: { level: 'low', primaryThreats: [], trend: 'stable', preparedness: 0.8 },
      economic: { level: 'moderate', primaryThreats: ['Market volatility'], trend: 'stable', preparedness: 0.7 },
      diplomatic: { level: 'moderate', primaryThreats: ['Regional tensions'], trend: 'stable', preparedness: 0.6 },
      internal: { level: 'low', primaryThreats: [], trend: 'stable', preparedness: 0.8 },
      technological: { level: 'low', primaryThreats: [], trend: 'improving', preparedness: 0.9 },
      environmental: { level: 'low', primaryThreats: [], trend: 'stable', preparedness: 0.7 }
    };
  }

  private getDefaultOpportunityAnalysis(): OpportunityAnalysis {
    return {
      overallOpportunityLevel: 'moderate',
      opportunities: [],
      economic: { level: 'moderate', keyOpportunities: ['Trade expansion'], readiness: 0.7, recommendedActions: ['Explore new markets'] },
      diplomatic: { level: 'moderate', keyOpportunities: ['Alliance building'], readiness: 0.6, recommendedActions: ['Engage key partners'] },
      technological: { level: 'significant', keyOpportunities: ['Research breakthroughs'], readiness: 0.8, recommendedActions: ['Increase R&D funding'] },
      military: { level: 'moderate', keyOpportunities: ['Defense modernization'], readiness: 0.7, recommendedActions: ['Upgrade systems'] },
      social: { level: 'moderate', keyOpportunities: ['Cultural development'], readiness: 0.6, recommendedActions: ['Invest in education'] }
    };
  }

  private processThreatAssessment(assessment: any): ThreatAssessment {
    // Process and validate threat assessment data
    return assessment;
  }

  private processOpportunityAnalysis(analysis: any): OpportunityAnalysis {
    // Process and validate opportunity analysis data
    return analysis;
  }

  private processRecommendation(rec: any): Recommendation {
    return {
      id: nanoid(),
      title: rec.title || 'Strategic Recommendation',
      description: rec.description || '',
      category: rec.category || 'social',
      priority: rec.priority || 'important',
      rationale: rec.rationale || '',
      expectedBenefits: rec.expectedBenefits || [],
      potentialRisks: rec.potentialRisks || [],
      actionSteps: (rec.actionSteps || []).map((step: any, index: number) => ({
        id: `step-${index}`,
        description: step.description || step,
        responsible: step.responsible || 'Leadership Team',
        deadline: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000),
        dependencies: step.dependencies || [],
        status: 'pending',
        resources: step.resources || []
      })),
      resourcesNeeded: rec.resourcesNeeded || [],
      timeline: rec.timeline || 'To be determined',
      confidence: rec.confidence || 'medium',
      impact: rec.impact || 'medium',
      feasibility: rec.feasibility || 0.7,
      basedOn: rec.basedOn || ['Briefing analysis'],
      supportingData: rec.supportingData || {},
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'ai_analysis'
    };
  }
}

export const leaderBriefingEngine = new LeaderBriefingEngine();
