/**
 * Intelligence Engine
 * Core engine for generating domestic and foreign intelligence reports
 */

import { EventEmitter } from 'events';
import { llmService } from '../ai/llmService.js';
import { civilizationVectorMemory } from '../memory/civilizationVectorMemory.js';
import { psychologyVectorMemory } from '../hybrid-simulation/PsychologyVectorMemory.js';
import { aiAnalysisVectorMemory } from '../hybrid-simulation/AIAnalysisVectorMemory.js';
import { witterStorage } from '../memory/witterStorage.js';
import {
  IntelligenceReport,
  IntelligenceReportType,
  IntelligenceEngineConfig,
  IntelligenceSource,
  IntelligenceSection,
  IntelligenceRecommendation,
  GenerateReportRequest,
  GenerateReportResponse,
  ClassificationLevel,
  ThreatLevel,
  ConfidenceLevel,
  ReliabilityLevel,
  SectionType,
  SourceType,
  Priority,
  RecommendationCategory,
  Timeline,
  ResourceRequirement,
  Risk,
  Benefit,
  ReportAnalytics,
  TrendIndicator
} from './types.js';

export class IntelligenceEngine extends EventEmitter {
  private config: IntelligenceEngineConfig;
  private activeReports: Map<string, Promise<IntelligenceReport>>;
  private reportCache: Map<string, IntelligenceReport>;

  constructor(config?: Partial<IntelligenceEngineConfig>) {
    super();
    
    this.config = {
      // AI Configuration
      llmProvider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.3,
      maxTokens: 4000,
      
      // Analysis parameters
      analysisDepth: 'comprehensive',
      historicalContext: 10, // Last 10 ticks
      
      // Memory integration
      useMemoryContext: true,
      memorySearchLimit: 20,
      memoryMinScore: 0.7,
      
      // Quality thresholds
      minConfidence: 0.6,
      minReliability: 0.5,
      
      // Performance settings
      maxConcurrentReports: 5,
      reportTimeout: 300000, // 5 minutes
      
      // Security settings
      enableClassification: true,
      defaultClassification: 'confidential',
      
      // Customization
      customPrompts: {},
      reportTemplates: {},
      
      ...config
    };

    this.activeReports = new Map();
    this.reportCache = new Map();
  }

  // ===== MAIN REPORT GENERATION =====

  /**
   * Generate an intelligence report
   */
  async generateReport(request: GenerateReportRequest): Promise<GenerateReportResponse> {
    const startTime = Date.now();
    const reportId = `report_${request.campaignId}_${request.reportType}_${Date.now()}`;

    try {
      // Check for concurrent report limit
      if (this.activeReports.size >= this.config.maxConcurrentReports) {
        return {
          success: false,
          error: 'Maximum concurrent reports limit reached',
          generationTime: Date.now() - startTime,
          sourcesUsed: 0
        };
      }

      // Create report generation promise
      const reportPromise = this.generateReportInternal(reportId, request);
      this.activeReports.set(reportId, reportPromise);

      // Set timeout
      const timeoutPromise = new Promise<IntelligenceReport>((_, reject) => {
        setTimeout(() => reject(new Error('Report generation timeout')), this.config.reportTimeout);
      });

      try {
        const report = await Promise.race([reportPromise, timeoutPromise]);
        
        // Cache the report
        this.reportCache.set(reportId, report);
        
        this.emit('reportGenerated', { reportId, report, request });
        
        return {
          success: true,
          report,
          generationTime: Date.now() - startTime,
          sourcesUsed: report.sources.length
        };

      } finally {
        this.activeReports.delete(reportId);
      }

    } catch (error) {
      this.activeReports.delete(reportId);
      this.emit('reportError', { reportId, error, request });
      
      return {
        success: false,
        error: error.message,
        generationTime: Date.now() - startTime,
        sourcesUsed: 0
      };
    }
  }

  /**
   * Internal report generation logic
   */
  private async generateReportInternal(
    reportId: string,
    request: GenerateReportRequest
  ): Promise<IntelligenceReport> {
    
    // Determine reporting period
    const reportingPeriod = await this.determineReportingPeriod(request);
    
    // Gather intelligence sources
    const sources = await this.gatherIntelligenceSources(request, reportingPeriod);
    
    // Generate report sections based on type
    const sections = await this.generateReportSections(request, sources, reportingPeriod);
    
    // Generate executive summary
    const executiveSummary = await this.generateExecutiveSummary(sections, sources);
    
    // Extract key findings
    const keyFindings = this.extractKeyFindings(sections);
    
    // Assess threat level
    const threatAssessment = this.assessThreatLevel(sections, sources);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(sections, sources, request);
    
    // Calculate analytics
    const analytics = this.calculateReportAnalytics(sections, sources, reportingPeriod);
    
    // Determine classification
    const classification = this.determineClassification(request, threatAssessment, sources);
    
    // Build final report
    const report: IntelligenceReport = {
      id: reportId,
      campaignId: request.campaignId,
      reportType: request.reportType,
      classification,
      
      generatedAt: new Date(),
      reportingPeriod,
      
      executiveSummary,
      keyFindings,
      threatAssessment,
      recommendations,
      
      sources,
      confidence: this.calculateOverallConfidence(sources, sections),
      reliability: this.calculateOverallReliability(sources),
      
      sections,
      
      generatedBy: 'IntelligenceEngine_v1.0',
      distributionList: request.customConfig?.customPrompts?.distributionList?.split(',') || ['leadership'],
      
      analytics
    };

    return report;
  }

  // ===== SOURCE GATHERING =====

  /**
   * Gather intelligence sources for the report
   */
  private async gatherIntelligenceSources(
    request: GenerateReportRequest,
    reportingPeriod: any
  ): Promise<IntelligenceSource[]> {
    const sources: IntelligenceSource[] = [];

    try {
      // Gather simulation data sources
      const simulationSources = await this.gatherSimulationSources(request.campaignId, reportingPeriod);
      sources.push(...simulationSources);

      // Gather memory-based sources
      if (this.config.useMemoryContext) {
        const memorySources = await this.gatherMemorySources(request.campaignId, reportingPeriod);
        sources.push(...memorySources);
      }

      // Gather psychology analysis sources
      const psychologySources = await this.gatherPsychologySources(request.campaignId, reportingPeriod);
      sources.push(...psychologySources);

      // Gather AI analysis sources
      const aiAnalysisSources = await this.gatherAIAnalysisSources(request.campaignId, reportingPeriod);
      sources.push(...aiAnalysisSources);

      // Gather social media sources
      const socialMediaSources = await this.gatherSocialMediaSources(request.campaignId, reportingPeriod);
      sources.push(...socialMediaSources);

    } catch (error) {
      console.error('Error gathering intelligence sources:', error);
    }

    // Filter sources by reliability and relevance
    return sources.filter(source => 
      source.reliability !== 'unreliable' && 
      source.relevance >= 0.3
    );
  }

  private async gatherSimulationSources(campaignId: number, reportingPeriod: any): Promise<IntelligenceSource[]> {
    // This would integrate with the existing simulation engine
    // For now, return a placeholder source
    return [{
      id: `sim_${campaignId}_${Date.now()}`,
      type: 'simulation_data',
      description: 'Current simulation state and recent changes',
      reliability: 'excellent',
      accessLevel: 'confidential',
      lastUpdated: new Date(),
      data: {
        simulationTick: reportingPeriod.endTick,
        gameState: {} // Would contain actual game state
      },
      accuracy: 0.95,
      timeliness: 1.0,
      relevance: 0.9
    }];
  }

  private async gatherMemorySources(campaignId: number, reportingPeriod: any): Promise<IntelligenceSource[]> {
    const sources: IntelligenceSource[] = [];

    try {
      // Search civilization memory for relevant events
      const civilizationMemories = await civilizationVectorMemory.searchCivilizationMemory(
        campaignId.toString(),
        'important events intelligence analysis',
        { limit: this.config.memorySearchLimit, minScore: this.config.memoryMinScore }
      );

      if (civilizationMemories.length > 0) {
        sources.push({
          id: `civ_memory_${campaignId}_${Date.now()}`,
          type: 'civilization_memory',
          description: `Civilization memory entries (${civilizationMemories.length} entries)`,
          reliability: 'good',
          accessLevel: 'confidential',
          lastUpdated: new Date(),
          data: {
            memoryEntries: civilizationMemories.map(m => m.id)
          },
          accuracy: 0.85,
          timeliness: 0.9,
          relevance: 0.8
        });
      }

    } catch (error) {
      console.error('Error gathering memory sources:', error);
    }

    return sources;
  }

  private async gatherPsychologySources(campaignId: number, reportingPeriod: any): Promise<IntelligenceSource[]> {
    const sources: IntelligenceSource[] = [];

    try {
      // Get recent psychology analyses
      const psychologyAnalyses = await psychologyVectorMemory.getPreviousPsychologyAnalysis(
        campaignId,
        reportingPeriod.endTick + 1,
        undefined,
        10
      );

      if (psychologyAnalyses.length > 0) {
        sources.push({
          id: `psychology_${campaignId}_${Date.now()}`,
          type: 'psychology_memory',
          description: `Population psychology analysis (${psychologyAnalyses.length} analyses)`,
          reliability: 'good',
          accessLevel: 'confidential',
          lastUpdated: new Date(),
          data: {
            analysisResults: psychologyAnalyses
          },
          accuracy: 0.8,
          timeliness: 0.95,
          relevance: 0.85
        });
      }

    } catch (error) {
      console.error('Error gathering psychology sources:', error);
    }

    return sources;
  }

  private async gatherAIAnalysisSources(campaignId: number, reportingPeriod: any): Promise<IntelligenceSource[]> {
    const sources: IntelligenceSource[] = [];

    try {
      // Get recent AI analyses
      const aiAnalyses = await aiAnalysisVectorMemory.getPreviousAIAnalyses(
        campaignId,
        reportingPeriod.endTick + 1,
        undefined,
        15
      );

      if (aiAnalyses.length > 0) {
        sources.push({
          id: `ai_analysis_${campaignId}_${Date.now()}`,
          type: 'ai_analysis',
          description: `AI strategic analysis (${aiAnalyses.length} analyses)`,
          reliability: 'excellent',
          accessLevel: 'secret',
          lastUpdated: new Date(),
          data: {
            analysisResults: aiAnalyses
          },
          accuracy: 0.9,
          timeliness: 0.95,
          relevance: 0.9
        });
      }

    } catch (error) {
      console.error('Error gathering AI analysis sources:', error);
    }

    return sources;
  }

  private async gatherSocialMediaSources(campaignId: number, reportingPeriod: any): Promise<IntelligenceSource[]> {
    const sources: IntelligenceSource[] = [];

    try {
      // Get recent Witter posts for social sentiment
      const recentPosts = await witterStorage.getRecentPosts(campaignId, 200);

      if (recentPosts.length > 0) {
        sources.push({
          id: `social_media_${campaignId}_${Date.now()}`,
          type: 'social_media',
          description: `Social media monitoring (${recentPosts.length} posts analyzed)`,
          reliability: 'fair',
          accessLevel: 'restricted',
          lastUpdated: new Date(),
          data: {
            rawData: recentPosts
          },
          accuracy: 0.7,
          timeliness: 1.0,
          relevance: 0.75
        });
      }

    } catch (error) {
      console.error('Error gathering social media sources:', error);
    }

    return sources;
  }

  // ===== SECTION GENERATION =====

  /**
   * Generate report sections based on type and sources
   */
  private async generateReportSections(
    request: GenerateReportRequest,
    sources: IntelligenceSource[],
    reportingPeriod: any
  ): Promise<IntelligenceSection[]> {
    const sections: IntelligenceSection[] = [];

    // Generate sections based on report type
    switch (request.reportType) {
      case 'domestic_intelligence':
        sections.push(
          await this.generateSituationOverview(sources, 'domestic'),
          await this.generateThreatAnalysis(sources, 'domestic'),
          await this.generateResourceAnalysis(sources),
          await this.generateTrendAnalysis(sources, reportingPeriod)
        );
        break;

      case 'foreign_intelligence':
        sections.push(
          await this.generateSituationOverview(sources, 'foreign'),
          await this.generateThreatAnalysis(sources, 'foreign'),
          await this.generateCapabilityAssessment(sources),
          await this.generatePredictiveAnalysis(sources)
        );
        break;

      case 'strategic_assessment':
        sections.push(
          await this.generateSituationOverview(sources, 'strategic'),
          await this.generateThreatAnalysis(sources, 'strategic'),
          await this.generateOpportunityAssessment(sources),
          await this.generateCapabilityAssessment(sources),
          await this.generatePredictiveAnalysis(sources)
        );
        break;

      default:
        // Generate standard sections for other report types
        sections.push(
          await this.generateSituationOverview(sources, 'general'),
          await this.generateThreatAnalysis(sources, 'general'),
          await this.generateTrendAnalysis(sources, reportingPeriod)
        );
    }

    return sections.filter(section => section.content.length > 0);
  }

  private async generateSituationOverview(sources: IntelligenceSource[], focus: string): Promise<IntelligenceSection> {
    const prompt = this.buildSituationOverviewPrompt(sources, focus);
    
    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a senior intelligence analyst generating situation overviews.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 1000,
        temperature: this.config.temperature
      });

      const content = response.content || 'Unable to generate situation overview.';
      
      return {
        id: `situation_overview_${Date.now()}`,
        title: 'Situation Overview',
        type: 'situation_overview',
        content,
        sources: sources.map(s => s.id),
        confidence: 'high',
        keyPoints: this.extractKeyPoints(content),
        implications: this.extractImplications(content)
      };

    } catch (error) {
      console.error('Error generating situation overview:', error);
      return this.createEmptySection('situation_overview', 'Situation Overview');
    }
  }

  private async generateThreatAnalysis(sources: IntelligenceSource[], focus: string): Promise<IntelligenceSection> {
    const prompt = this.buildThreatAnalysisPrompt(sources, focus);
    
    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a threat assessment specialist analyzing potential risks and threats.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 1200,
        temperature: this.config.temperature
      });

      const content = response.content || 'Unable to generate threat analysis.';
      
      return {
        id: `threat_analysis_${Date.now()}`,
        title: 'Threat Analysis',
        type: 'threat_analysis',
        content,
        sources: sources.map(s => s.id),
        confidence: 'high',
        keyPoints: this.extractKeyPoints(content),
        implications: this.extractImplications(content),
        followUpActions: this.extractFollowUpActions(content)
      };

    } catch (error) {
      console.error('Error generating threat analysis:', error);
      return this.createEmptySection('threat_analysis', 'Threat Analysis');
    }
  }

  private async generateResourceAnalysis(sources: IntelligenceSource[]): Promise<IntelligenceSection> {
    const prompt = this.buildResourceAnalysisPrompt(sources);
    
    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a resource analyst evaluating capabilities and resource allocation.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 800,
        temperature: this.config.temperature
      });

      const content = response.content || 'Unable to generate resource analysis.';
      
      return {
        id: `resource_analysis_${Date.now()}`,
        title: 'Resource Analysis',
        type: 'resource_analysis',
        content,
        sources: sources.map(s => s.id),
        confidence: 'moderate',
        keyPoints: this.extractKeyPoints(content),
        implications: this.extractImplications(content)
      };

    } catch (error) {
      console.error('Error generating resource analysis:', error);
      return this.createEmptySection('resource_analysis', 'Resource Analysis');
    }
  }

  private async generateTrendAnalysis(sources: IntelligenceSource[], reportingPeriod: any): Promise<IntelligenceSection> {
    const prompt = this.buildTrendAnalysisPrompt(sources, reportingPeriod);
    
    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a trend analyst identifying patterns and trajectories over time.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 1000,
        temperature: this.config.temperature
      });

      const content = response.content || 'Unable to generate trend analysis.';
      
      return {
        id: `trend_analysis_${Date.now()}`,
        title: 'Trend Analysis',
        type: 'trend_analysis',
        content,
        sources: sources.map(s => s.id),
        confidence: 'moderate',
        keyPoints: this.extractKeyPoints(content),
        implications: this.extractImplications(content)
      };

    } catch (error) {
      console.error('Error generating trend analysis:', error);
      return this.createEmptySection('trend_analysis', 'Trend Analysis');
    }
  }

  private async generateCapabilityAssessment(sources: IntelligenceSource[]): Promise<IntelligenceSection> {
    const prompt = this.buildCapabilityAssessmentPrompt(sources);
    
    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a capability analyst assessing strengths, weaknesses, and potential.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 1000,
        temperature: this.config.temperature
      });

      const content = response.content || 'Unable to generate capability assessment.';
      
      return {
        id: `capability_assessment_${Date.now()}`,
        title: 'Capability Assessment',
        type: 'capability_assessment',
        content,
        sources: sources.map(s => s.id),
        confidence: 'moderate',
        keyPoints: this.extractKeyPoints(content),
        implications: this.extractImplications(content)
      };

    } catch (error) {
      console.error('Error generating capability assessment:', error);
      return this.createEmptySection('capability_assessment', 'Capability Assessment');
    }
  }

  private async generateOpportunityAssessment(sources: IntelligenceSource[]): Promise<IntelligenceSection> {
    const prompt = this.buildOpportunityAssessmentPrompt(sources);
    
    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a strategic analyst identifying opportunities and advantages.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 800,
        temperature: this.config.temperature
      });

      const content = response.content || 'Unable to generate opportunity assessment.';
      
      return {
        id: `opportunity_assessment_${Date.now()}`,
        title: 'Opportunity Assessment',
        type: 'opportunity_assessment',
        content,
        sources: sources.map(s => s.id),
        confidence: 'moderate',
        keyPoints: this.extractKeyPoints(content),
        implications: this.extractImplications(content)
      };

    } catch (error) {
      console.error('Error generating opportunity assessment:', error);
      return this.createEmptySection('opportunity_assessment', 'Opportunity Assessment');
    }
  }

  private async generatePredictiveAnalysis(sources: IntelligenceSource[]): Promise<IntelligenceSection> {
    const prompt = this.buildPredictiveAnalysisPrompt(sources);
    
    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a predictive analyst forecasting future developments and scenarios.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 1200,
        temperature: this.config.temperature + 0.1 // Slightly higher temperature for creative predictions
      });

      const content = response.content || 'Unable to generate predictive analysis.';
      
      return {
        id: `predictive_analysis_${Date.now()}`,
        title: 'Predictive Analysis',
        type: 'predictive_analysis',
        content,
        sources: sources.map(s => s.id),
        confidence: 'moderate',
        keyPoints: this.extractKeyPoints(content),
        implications: this.extractImplications(content)
      };

    } catch (error) {
      console.error('Error generating predictive analysis:', error);
      return this.createEmptySection('predictive_analysis', 'Predictive Analysis');
    }
  }

  // ===== HELPER METHODS =====

  private async determineReportingPeriod(request: GenerateReportRequest) {
    const endTick = request.endTick || 100; // Default current tick
    const startTick = request.startTick || Math.max(1, endTick - this.config.historicalContext);
    
    return {
      startTick,
      endTick,
      startDate: new Date(Date.now() - (this.config.historicalContext * 120000)), // 120s per tick
      endDate: new Date()
    };
  }

  private async generateExecutiveSummary(sections: IntelligenceSection[], sources: IntelligenceSource[]): Promise<string> {
    const keyContent = sections.map(section => 
      `${section.title}: ${section.keyPoints.slice(0, 2).join('; ')}`
    ).join('\n');

    const prompt = `Generate a concise executive summary for an intelligence report based on the following key findings:

${keyContent}

The summary should be 2-3 paragraphs, highlighting the most critical information and overall assessment.`;

    try {
      const response = await llmService.complete([
        { role: 'system', content: 'You are a senior intelligence officer writing executive summaries.' },
        { role: 'user', content: prompt }
      ], {
        maxTokens: 500,
        temperature: this.config.temperature
      });

      return response.content || 'Executive summary unavailable.';

    } catch (error) {
      console.error('Error generating executive summary:', error);
      return 'Executive summary could not be generated due to technical issues.';
    }
  }

  private extractKeyFindings(sections: IntelligenceSection[]): string[] {
    const findings: string[] = [];
    
    sections.forEach(section => {
      findings.push(...section.keyPoints.slice(0, 2)); // Top 2 points per section
    });

    return findings.slice(0, 8); // Maximum 8 key findings
  }

  private assessThreatLevel(sections: IntelligenceSection[], sources: IntelligenceSource[]): ThreatLevel {
    // Simple threat assessment based on content analysis
    const threatKeywords = {
      'critical': ['crisis', 'emergency', 'critical', 'severe', 'catastrophic'],
      'high': ['threat', 'danger', 'risk', 'concern', 'warning'],
      'moderate': ['issue', 'problem', 'challenge', 'difficulty'],
      'low': ['stable', 'normal', 'routine', 'manageable'],
      'minimal': ['peaceful', 'calm', 'secure', 'safe']
    };

    let threatScore = 0;
    const allContent = sections.map(s => s.content.toLowerCase()).join(' ');

    Object.entries(threatKeywords).forEach(([level, keywords]) => {
      const matches = keywords.filter(keyword => allContent.includes(keyword)).length;
      switch (level) {
        case 'critical': threatScore += matches * 5; break;
        case 'high': threatScore += matches * 4; break;
        case 'moderate': threatScore += matches * 3; break;
        case 'low': threatScore += matches * 2; break;
        case 'minimal': threatScore += matches * 1; break;
      }
    });

    if (threatScore >= 20) return 'critical';
    if (threatScore >= 15) return 'high';
    if (threatScore >= 10) return 'moderate';
    if (threatScore >= 5) return 'low';
    return 'minimal';
  }

  private async generateRecommendations(
    sections: IntelligenceSection[],
    sources: IntelligenceSource[],
    request: GenerateReportRequest
  ): Promise<IntelligenceRecommendation[]> {
    const recommendations: IntelligenceRecommendation[] = [];

    // Extract follow-up actions from sections
    const allActions = sections.flatMap(s => s.followUpActions || []);
    
    if (allActions.length > 0) {
      // Generate structured recommendations from actions
      for (let i = 0; i < Math.min(allActions.length, 5); i++) {
        const action = allActions[i];
        
        recommendations.push({
          id: `rec_${Date.now()}_${i}`,
          priority: this.assessRecommendationPriority(action),
          category: this.categorizeRecommendation(action),
          title: action,
          description: `Recommended action based on intelligence analysis`,
          rationale: `Identified through analysis of current intelligence sources`,
          suggestedActions: [action],
          timeline: this.generateTimeline(action),
          resources: this.estimateResources(action),
          risks: this.assessRisks(action),
          benefits: this.assessBenefits(action),
          status: 'pending',
          dependencies: [],
          prerequisites: []
        });
      }
    }

    return recommendations;
  }

  private calculateReportAnalytics(
    sections: IntelligenceSection[],
    sources: IntelligenceSource[],
    reportingPeriod: any
  ): ReportAnalytics {
    const wordCount = sections.reduce((count, section) => count + section.content.split(' ').length, 0);
    
    return {
      generationTime: 0, // Will be set by caller
      sourceCount: sources.length,
      sectionCount: sections.length,
      wordCount,
      
      overallConfidence: this.calculateOverallConfidence(sources, sections),
      sourceReliability: this.calculateOverallReliability(sources),
      dataFreshness: this.calculateDataFreshness(sources),
      
      sentimentScore: this.calculateSentimentScore(sections),
      urgencyScore: this.calculateUrgencyScore(sections),
      actionabilityScore: this.calculateActionabilityScore(sections),
      
      trends: this.identifyTrends(sections)
    };
  }

  private calculateOverallConfidence(sources: IntelligenceSource[], sections: IntelligenceSection[]): number {
    const sourceConfidence = sources.reduce((sum, source) => sum + source.accuracy, 0) / sources.length;
    return Math.min(1.0, sourceConfidence);
  }

  private calculateOverallReliability(sources: IntelligenceSource[]): ReliabilityLevel {
    const reliabilityScores = {
      'unreliable': 0,
      'questionable': 1,
      'fair': 2,
      'good': 3,
      'excellent': 4
    };

    const avgScore = sources.reduce((sum, source) => 
      sum + reliabilityScores[source.reliability], 0
    ) / sources.length;

    if (avgScore >= 3.5) return 'excellent';
    if (avgScore >= 2.5) return 'good';
    if (avgScore >= 1.5) return 'fair';
    if (avgScore >= 0.5) return 'questionable';
    return 'unreliable';
  }

  private calculateDataFreshness(sources: IntelligenceSource[]): number {
    const now = Date.now();
    const freshnessScores = sources.map(source => {
      const ageMs = now - source.lastUpdated.getTime();
      const ageHours = ageMs / (1000 * 60 * 60);
      
      if (ageHours <= 1) return 1.0;
      if (ageHours <= 6) return 0.8;
      if (ageHours <= 24) return 0.6;
      if (ageHours <= 72) return 0.4;
      return 0.2;
    });

    return freshnessScores.reduce((sum, score) => sum + score, 0) / freshnessScores.length;
  }

  private calculateSentimentScore(sections: IntelligenceSection[]): number {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['success', 'improvement', 'growth', 'opportunity', 'strength'];
    const negativeWords = ['threat', 'risk', 'decline', 'problem', 'weakness'];
    
    let sentiment = 0;
    const allContent = sections.map(s => s.content.toLowerCase()).join(' ');
    
    positiveWords.forEach(word => {
      const matches = (allContent.match(new RegExp(word, 'g')) || []).length;
      sentiment += matches * 0.1;
    });
    
    negativeWords.forEach(word => {
      const matches = (allContent.match(new RegExp(word, 'g')) || []).length;
      sentiment -= matches * 0.1;
    });
    
    return Math.max(-1, Math.min(1, sentiment));
  }

  private calculateUrgencyScore(sections: IntelligenceSection[]): number {
    const urgentKeywords = ['urgent', 'immediate', 'critical', 'emergency', 'crisis'];
    const allContent = sections.map(s => s.content.toLowerCase()).join(' ');
    
    let urgencyScore = 0;
    urgentKeywords.forEach(keyword => {
      const matches = (allContent.match(new RegExp(keyword, 'g')) || []).length;
      urgencyScore += matches * 0.2;
    });
    
    return Math.min(1.0, urgencyScore);
  }

  private calculateActionabilityScore(sections: IntelligenceSection[]): number {
    const actionableKeywords = ['recommend', 'should', 'must', 'action', 'implement'];
    const allContent = sections.map(s => s.content.toLowerCase()).join(' ');
    
    let actionabilityScore = 0;
    actionableKeywords.forEach(keyword => {
      const matches = (allContent.match(new RegExp(keyword, 'g')) || []).length;
      actionabilityScore += matches * 0.15;
    });
    
    return Math.min(1.0, actionabilityScore);
  }

  private identifyTrends(sections: IntelligenceSection[]): TrendIndicator[] {
    // Simple trend identification based on content analysis
    const trends: TrendIndicator[] = [];
    
    const trendKeywords = {
      'increasing': ['increase', 'growth', 'rising', 'expanding'],
      'decreasing': ['decrease', 'decline', 'falling', 'shrinking'],
      'stable': ['stable', 'steady', 'consistent', 'unchanged']
    };
    
    const allContent = sections.map(s => s.content.toLowerCase()).join(' ');
    
    Object.entries(trendKeywords).forEach(([direction, keywords]) => {
      keywords.forEach(keyword => {
        const matches = (allContent.match(new RegExp(keyword, 'g')) || []).length;
        if (matches > 0) {
          trends.push({
            category: keyword,
            direction: direction as any,
            magnitude: Math.min(1.0, matches * 0.2),
            confidence: 0.6,
            description: `${keyword} trend identified in analysis`
          });
        }
      });
    });
    
    return trends.slice(0, 5); // Top 5 trends
  }

  private determineClassification(
    request: GenerateReportRequest,
    threatLevel: ThreatLevel,
    sources: IntelligenceSource[]
  ): ClassificationLevel {
    if (request.classification) {
      return request.classification;
    }

    // Auto-classify based on threat level and sources
    if (threatLevel === 'critical' || threatLevel === 'existential') {
      return 'top_secret';
    }
    
    if (threatLevel === 'high') {
      return 'secret';
    }
    
    const hasSecretSources = sources.some(s => s.accessLevel === 'secret' || s.accessLevel === 'top_secret');
    if (hasSecretSources) {
      return 'secret';
    }
    
    return this.config.defaultClassification;
  }

  // ===== PROMPT BUILDERS =====

  private buildSituationOverviewPrompt(sources: IntelligenceSource[], focus: string): string {
    const sourceDescriptions = sources.map(s => `- ${s.type}: ${s.description}`).join('\n');
    
    return `Generate a comprehensive situation overview with ${focus} focus based on the following intelligence sources:

SOURCES:
${sourceDescriptions}

Provide a detailed analysis covering:
1. Current situation assessment
2. Key developments and changes
3. Significant factors and influences
4. Overall stability and trends

Focus on ${focus} intelligence priorities. Be analytical and objective.`;
  }

  private buildThreatAnalysisPrompt(sources: IntelligenceSource[], focus: string): string {
    const sourceDescriptions = sources.map(s => `- ${s.type}: ${s.description}`).join('\n');
    
    return `Conduct a threat analysis with ${focus} focus based on the following intelligence sources:

SOURCES:
${sourceDescriptions}

Analyze and identify:
1. Current threats and risk factors
2. Threat severity and probability
3. Potential impact and consequences
4. Threat evolution and trends
5. Mitigation considerations

Provide specific, actionable threat assessments.`;
  }

  private buildResourceAnalysisPrompt(sources: IntelligenceSource[]): string {
    const sourceDescriptions = sources.map(s => `- ${s.type}: ${s.description}`).join('\n');
    
    return `Analyze resource capabilities and allocation based on the following intelligence sources:

SOURCES:
${sourceDescriptions}

Assess:
1. Current resource status and availability
2. Resource utilization and efficiency
3. Critical resource gaps or surpluses
4. Resource allocation priorities
5. Future resource requirements

Focus on strategic resource implications.`;
  }

  private buildTrendAnalysisPrompt(sources: IntelligenceSource[], reportingPeriod: any): string {
    const sourceDescriptions = sources.map(s => `- ${s.type}: ${s.description}`).join('\n');
    
    return `Analyze trends and patterns over the reporting period (Tick ${reportingPeriod.startTick} to ${reportingPeriod.endTick}) based on:

SOURCES:
${sourceDescriptions}

Identify and analyze:
1. Significant trends and patterns
2. Trend direction and momentum
3. Underlying drivers and causes
4. Trend implications and projections
5. Trend stability and volatility

Provide data-driven trend insights.`;
  }

  private buildCapabilityAssessmentPrompt(sources: IntelligenceSource[]): string {
    const sourceDescriptions = sources.map(s => `- ${s.type}: ${s.description}`).join('\n');
    
    return `Assess capabilities and capacity based on the following intelligence sources:

SOURCES:
${sourceDescriptions}

Evaluate:
1. Current capabilities and strengths
2. Capability gaps and weaknesses
3. Capability development trends
4. Comparative capability analysis
5. Future capability requirements

Provide comprehensive capability assessment.`;
  }

  private buildOpportunityAssessmentPrompt(sources: IntelligenceSource[]): string {
    const sourceDescriptions = sources.map(s => `- ${s.type}: ${s.description}`).join('\n');
    
    return `Identify opportunities and advantages based on the following intelligence sources:

SOURCES:
${sourceDescriptions}

Analyze:
1. Current opportunities and advantages
2. Opportunity feasibility and potential
3. Opportunity timing and windows
4. Resource requirements for opportunities
5. Opportunity risks and benefits

Focus on actionable opportunities.`;
  }

  private buildPredictiveAnalysisPrompt(sources: IntelligenceSource[]): string {
    const sourceDescriptions = sources.map(s => `- ${s.type}: ${s.description}`).join('\n');
    
    return `Generate predictive analysis and forecasts based on the following intelligence sources:

SOURCES:
${sourceDescriptions}

Provide:
1. Short-term predictions (1-3 ticks)
2. Medium-term forecasts (4-10 ticks)
3. Long-term projections (10+ ticks)
4. Scenario analysis and alternatives
5. Prediction confidence and uncertainty

Base predictions on observable trends and patterns.`;
  }

  // ===== UTILITY METHODS =====

  private extractKeyPoints(content: string): string[] {
    // Simple extraction based on sentence structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 5).map(s => s.trim());
  }

  private extractImplications(content: string): string[] {
    // Look for implication keywords
    const implications: string[] = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes('implication') || 
          sentence.toLowerCase().includes('consequence') ||
          sentence.toLowerCase().includes('result') ||
          sentence.toLowerCase().includes('impact')) {
        implications.push(sentence.trim());
      }
    });
    
    return implications.slice(0, 3);
  }

  private extractFollowUpActions(content: string): string[] {
    // Look for action-oriented sentences
    const actions: string[] = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes('should') || 
          sentence.toLowerCase().includes('recommend') ||
          sentence.toLowerCase().includes('must') ||
          sentence.toLowerCase().includes('action')) {
        actions.push(sentence.trim());
      }
    });
    
    return actions.slice(0, 4);
  }

  private createEmptySection(type: SectionType, title: string): IntelligenceSection {
    return {
      id: `${type}_${Date.now()}`,
      title,
      type,
      content: 'Section content unavailable due to technical issues.',
      sources: [],
      confidence: 'low',
      keyPoints: [],
      implications: []
    };
  }

  private assessRecommendationPriority(action: string): Priority {
    const urgentKeywords = ['urgent', 'immediate', 'critical', 'emergency'];
    const highKeywords = ['important', 'significant', 'major', 'key'];
    
    const actionLower = action.toLowerCase();
    
    if (urgentKeywords.some(keyword => actionLower.includes(keyword))) {
      return 'critical';
    }
    
    if (highKeywords.some(keyword => actionLower.includes(keyword))) {
      return 'high';
    }
    
    return 'medium';
  }

  private categorizeRecommendation(action: string): RecommendationCategory {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('military') || actionLower.includes('defense')) return 'military';
    if (actionLower.includes('economic') || actionLower.includes('financial')) return 'economic';
    if (actionLower.includes('diplomatic') || actionLower.includes('foreign')) return 'diplomatic';
    if (actionLower.includes('technology') || actionLower.includes('research')) return 'technological';
    if (actionLower.includes('social') || actionLower.includes('population')) return 'social';
    if (actionLower.includes('security') || actionLower.includes('intelligence')) return 'security';
    if (actionLower.includes('policy') || actionLower.includes('governance')) return 'policy';
    
    return 'policy'; // Default category
  }

  private generateTimeline(action: string): Timeline {
    // Simple timeline generation based on action urgency
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('immediate') || actionLower.includes('urgent')) {
      return {
        immediate: [action],
        shortTerm: [],
        mediumTerm: [],
        longTerm: []
      };
    }
    
    return {
      immediate: [],
      shortTerm: [action],
      mediumTerm: [],
      longTerm: []
    };
  }

  private estimateResources(action: string): ResourceRequirement[] {
    // Basic resource estimation
    return [
      {
        type: 'personnel',
        amount: 1,
        description: 'Staff time required for implementation',
        critical: false
      },
      {
        type: 'time',
        amount: 1,
        description: 'Implementation timeframe',
        critical: true
      }
    ];
  }

  private assessRisks(action: string): Risk[] {
    return [
      {
        description: 'Implementation may face unforeseen challenges',
        probability: 0.3,
        impact: 0.4,
        mitigation: 'Regular monitoring and adaptive planning'
      }
    ];
  }

  private assessBenefits(action: string): Benefit[] {
    return [
      {
        description: 'Improved situational awareness and decision-making capability',
        probability: 0.7,
        value: 0.6,
        timeframe: 'Short to medium term'
      }
    ];
  }

  /**
   * Get engine status and metrics
   */
  getEngineStatus() {
    return {
      activeReports: this.activeReports.size,
      cachedReports: this.reportCache.size,
      maxConcurrentReports: this.config.maxConcurrentReports,
      config: this.config
    };
  }

  /**
   * Clear report cache
   */
  clearCache(): void {
    this.reportCache.clear();
  }

  /**
   * Update engine configuration
   */
  updateConfig(newConfig: Partial<IntelligenceEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('configUpdated', this.config);
  }
}

// Export singleton instance
export const intelligenceEngine = new IntelligenceEngine();
