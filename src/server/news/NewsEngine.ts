/**
 * News Generation Engine
 * 
 * AI-powered news generation system that creates civilization and galactic news
 * based on simulation results, with multi-perspective outlets and realistic bias.
 */

import { 
  NewsArticle, 
  NewsOutlet, 
  NewsGenerationRequest, 
  NewsGenerationResponse,
  NewsCategory,
  NewsScope,
  NewsPriority,
  NewsOutletType,
  NewsEventTrigger
} from './types.js';
import { LLMProvider, SimpleLLMProvider } from '../providers/LLMProvider.js';
import { vectorMemory } from '../storage/VectorMemory.js';
import { db } from '../storage/db.js';
import { nanoid } from 'nanoid';

export class NewsEngine {
  private llmProvider: LLMProvider;
  private outlets: Map<string, NewsOutlet> = new Map();
  private eventTriggers: Map<string, NewsEventTrigger> = new Map();

  constructor() {
    this.llmProvider = new SimpleLLMProvider();
    this.initializeDefaultOutlets();
    this.initializeEventTriggers();
  }

  /**
   * Generate news articles based on simulation results and context
   */
  async generateNews(request: NewsGenerationRequest): Promise<NewsGenerationResponse> {
    const startTime = Date.now();
    const articles: NewsArticle[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 1. Analyze simulation results to identify newsworthy events
      const newsworthyEvents = await this.identifyNewsworthyEvents(request);
      
      if (newsworthyEvents.length === 0) {
        warnings.push('No newsworthy events identified from simulation results');
      }

      // 2. Select appropriate outlets for coverage
      const selectedOutlets = await this.selectOutletsForCoverage(request, newsworthyEvents);

      // 3. Generate articles from different perspectives
      for (const event of newsworthyEvents) {
        const eventOutlets = selectedOutlets.filter(outlet => 
          this.shouldOutletCoverEvent(outlet, event)
        );

        for (const outlet of eventOutlets) {
          if (articles.length >= request.maxArticles) break;

          try {
            const article = await this.generateArticleForOutlet(
              event, 
              outlet, 
              request
            );
            articles.push(article);
          } catch (error) {
            errors.push(`Failed to generate article for outlet ${outlet.name}: ${error}`);
          }
        }

        if (articles.length >= request.maxArticles) break;
      }

      // 4. Calculate quality metrics
      const qualityMetrics = this.calculateQualityMetrics(articles, request);
      
      // 5. Calculate generation statistics
      const generationStats = {
        totalTime: Date.now() - startTime,
        averageConfidence: articles.reduce((sum, a) => sum + a.generationContext.confidence, 0) / articles.length || 0,
        perspectivesCovered: new Set(articles.map(a => a.outletId)).size,
        categoriesCovered: [...new Set(articles.map(a => a.category))] as NewsCategory[],
        scopesCovered: [...new Set(articles.map(a => a.scope))] as NewsScope[]
      };

      return {
        success: true,
        articlesGenerated: articles.length,
        articles,
        generationStats,
        qualityMetrics,
        errors,
        warnings
      };

    } catch (error) {
      return {
        success: false,
        articlesGenerated: 0,
        articles: [],
        generationStats: {
          totalTime: Date.now() - startTime,
          averageConfidence: 0,
          perspectivesCovered: 0,
          categoriesCovered: [],
          scopesCovered: []
        },
        qualityMetrics: {
          factualConsistency: 0,
          perspectiveDiversity: 0,
          relevanceScore: 0,
          engagementPotential: 0
        },
        errors: [`Critical error in news generation: ${error}`],
        warnings
      };
    }
  }

  /**
   * Identify newsworthy events from simulation results
   */
  private async identifyNewsworthyEvents(request: NewsGenerationRequest): Promise<any[]> {
    const events: any[] = [];

    // Analyze simulation results for significant changes
    if (request.simulationResults) {
      const significantChanges = this.analyzeSimulationChanges(request.simulationResults);
      events.push(...significantChanges);
    }

    // Check recent events
    if (request.recentEvents) {
      const filteredEvents = request.recentEvents.filter(event => 
        this.isEventNewsworthy(event, request)
      );
      events.push(...filteredEvents);
    }

    // Analyze memory for trending topics
    if (request.civilizationMemory || request.aiAnalysisMemory) {
      const memoryEvents = await this.extractEventsFromMemory(request);
      events.push(...memoryEvents);
    }

    // Sort by newsworthiness score
    return events.sort((a, b) => (b.newsworthiness || 0) - (a.newsworthiness || 0));
  }

  /**
   * Analyze simulation results for significant changes
   */
  private analyzeSimulationChanges(simulationResults: any): any[] {
    const events: any[] = [];
    
    // Economic changes
    if (simulationResults.economy) {
      const economicChanges = this.detectEconomicChanges(simulationResults.economy);
      events.push(...economicChanges);
    }

    // Political changes
    if (simulationResults.politics) {
      const politicalChanges = this.detectPoliticalChanges(simulationResults.politics);
      events.push(...politicalChanges);
    }

    // Military changes
    if (simulationResults.military) {
      const militaryChanges = this.detectMilitaryChanges(simulationResults.military);
      events.push(...militaryChanges);
    }

    // Technology changes
    if (simulationResults.technology) {
      const techChanges = this.detectTechnologyChanges(simulationResults.technology);
      events.push(...techChanges);
    }

    // Social changes
    if (simulationResults.social) {
      const socialChanges = this.detectSocialChanges(simulationResults.social);
      events.push(...socialChanges);
    }

    return events;
  }

  /**
   * Detect economic changes worthy of news coverage
   */
  private detectEconomicChanges(economy: any): any[] {
    const events: any[] = [];
    
    // GDP changes
    if (economy.gdpChange && Math.abs(economy.gdpChange) > 0.02) {
      events.push({
        type: 'economic',
        category: 'economy' as NewsCategory,
        scope: 'civilization' as NewsScope,
        priority: Math.abs(economy.gdpChange) > 0.05 ? 'high' as NewsPriority : 'medium' as NewsPriority,
        title: economy.gdpChange > 0 ? 'Economic Growth Reported' : 'Economic Decline Observed',
        data: { gdpChange: economy.gdpChange, ...economy },
        newsworthiness: Math.abs(economy.gdpChange) * 100
      });
    }

    // Unemployment changes
    if (economy.unemploymentChange && Math.abs(economy.unemploymentChange) > 0.01) {
      events.push({
        type: 'economic',
        category: 'economy' as NewsCategory,
        scope: 'national' as NewsScope,
        priority: Math.abs(economy.unemploymentChange) > 0.03 ? 'high' as NewsPriority : 'medium' as NewsPriority,
        title: economy.unemploymentChange > 0 ? 'Unemployment Rises' : 'Job Market Improves',
        data: { unemploymentChange: economy.unemploymentChange, ...economy },
        newsworthiness: Math.abs(economy.unemploymentChange) * 80
      });
    }

    // Trade changes
    if (economy.tradeBalance && Math.abs(economy.tradeBalance) > 1000000) {
      events.push({
        type: 'economic',
        category: 'trade' as NewsCategory,
        scope: 'civilization' as NewsScope,
        priority: 'medium' as NewsPriority,
        title: economy.tradeBalance > 0 ? 'Trade Surplus Achieved' : 'Trade Deficit Grows',
        data: { tradeBalance: economy.tradeBalance, ...economy },
        newsworthiness: Math.abs(economy.tradeBalance) / 100000
      });
    }

    return events;
  }

  /**
   * Detect political changes worthy of news coverage
   */
  private detectPoliticalChanges(politics: any): any[] {
    const events: any[] = [];

    // Leadership changes
    if (politics.leadershipChange) {
      events.push({
        type: 'political',
        category: 'politics' as NewsCategory,
        scope: 'civilization' as NewsScope,
        priority: 'breaking' as NewsPriority,
        title: 'Leadership Change Announced',
        data: politics,
        newsworthiness: 95
      });
    }

    // Policy changes
    if (politics.newPolicies && politics.newPolicies.length > 0) {
      events.push({
        type: 'political',
        category: 'politics' as NewsCategory,
        scope: 'national' as NewsScope,
        priority: 'high' as NewsPriority,
        title: 'New Policies Implemented',
        data: politics,
        newsworthiness: 70
      });
    }

    // Approval rating changes
    if (politics.approvalChange && Math.abs(politics.approvalChange) > 0.1) {
      events.push({
        type: 'political',
        category: 'politics' as NewsCategory,
        scope: 'national' as NewsScope,
        priority: 'medium' as NewsPriority,
        title: politics.approvalChange > 0 ? 'Leader Approval Rises' : 'Leader Approval Falls',
        data: politics,
        newsworthiness: Math.abs(politics.approvalChange) * 60
      });
    }

    return events;
  }

  /**
   * Detect military changes worthy of news coverage
   */
  private detectMilitaryChanges(military: any): any[] {
    const events: any[] = [];

    // Military actions
    if (military.actions && military.actions.length > 0) {
      events.push({
        type: 'military',
        category: 'military' as NewsCategory,
        scope: 'galactic' as NewsScope,
        priority: 'breaking' as NewsPriority,
        title: 'Military Action Reported',
        data: military,
        newsworthiness: 90
      });
    }

    // Defense spending changes
    if (military.budgetChange && Math.abs(military.budgetChange) > 0.05) {
      events.push({
        type: 'military',
        category: 'military' as NewsCategory,
        scope: 'national' as NewsScope,
        priority: 'medium' as NewsPriority,
        title: military.budgetChange > 0 ? 'Defense Spending Increased' : 'Defense Budget Cut',
        data: military,
        newsworthiness: Math.abs(military.budgetChange) * 50
      });
    }

    return events;
  }

  /**
   * Detect technology changes worthy of news coverage
   */
  private detectTechnologyChanges(technology: any): any[] {
    const events: any[] = [];

    // New discoveries
    if (technology.discoveries && technology.discoveries.length > 0) {
      events.push({
        type: 'technology',
        category: 'technology' as NewsCategory,
        scope: 'civilization' as NewsScope,
        priority: 'high' as NewsPriority,
        title: 'Scientific Breakthrough Announced',
        data: technology,
        newsworthiness: 80
      });
    }

    // Research progress
    if (technology.researchProgress && technology.researchProgress > 0.2) {
      events.push({
        type: 'technology',
        category: 'technology' as NewsCategory,
        scope: 'national' as NewsScope,
        priority: 'medium' as NewsPriority,
        title: 'Research Milestone Achieved',
        data: technology,
        newsworthiness: technology.researchProgress * 40
      });
    }

    return events;
  }

  /**
   * Detect social changes worthy of news coverage
   */
  private detectSocialChanges(social: any): any[] {
    const events: any[] = [];

    // Population mood changes
    if (social.moodChange && Math.abs(social.moodChange) > 0.15) {
      events.push({
        type: 'social',
        category: 'social' as NewsCategory,
        scope: 'national' as NewsScope,
        priority: 'medium' as NewsPriority,
        title: social.moodChange > 0 ? 'Public Mood Improves' : 'Social Unrest Growing',
        data: social,
        newsworthiness: Math.abs(social.moodChange) * 50
      });
    }

    // Cultural events
    if (social.culturalEvents && social.culturalEvents.length > 0) {
      events.push({
        type: 'social',
        category: 'culture' as NewsCategory,
        scope: 'local' as NewsScope,
        priority: 'low' as NewsPriority,
        title: 'Cultural Event Celebrated',
        data: social,
        newsworthiness: 30
      });
    }

    return events;
  }

  /**
   * Extract newsworthy events from memory systems
   */
  private async extractEventsFromMemory(request: NewsGenerationRequest): Promise<any[]> {
    const events: any[] = [];

    try {
      // Search civilization memory for recent significant events
      if (request.civilizationMemory) {
        const memoryEvents = request.civilizationMemory
          .filter((memory: any) => memory.importance === 'high' || memory.importance === 'critical')
          .map((memory: any) => ({
            type: 'memory',
            category: this.categorizeMemeoryEvent(memory),
            scope: 'civilization' as NewsScope,
            priority: memory.importance === 'critical' ? 'breaking' as NewsPriority : 'high' as NewsPriority,
            title: memory.content.substring(0, 100),
            data: memory,
            newsworthiness: memory.importance === 'critical' ? 85 : 65
          }));
        events.push(...memoryEvents);
      }

      // Search AI analysis memory for insights
      if (request.aiAnalysisMemory) {
        const analysisEvents = request.aiAnalysisMemory
          .filter((analysis: any) => analysis.analysisMetrics?.noveltyScore > 0.7)
          .map((analysis: any) => ({
            type: 'analysis',
            category: 'technology' as NewsCategory,
            scope: 'civilization' as NewsScope,
            priority: 'medium' as NewsPriority,
            title: `Analysis: ${analysis.content.substring(0, 80)}`,
            data: analysis,
            newsworthiness: analysis.analysisMetrics.noveltyScore * 60
          }));
        events.push(...analysisEvents);
      }
    } catch (error) {
      console.error('Error extracting events from memory:', error);
    }

    return events;
  }

  /**
   * Categorize memory event for news classification
   */
  private categorizeMemeoryEvent(memory: any): NewsCategory {
    const content = memory.content.toLowerCase();
    
    if (content.includes('economic') || content.includes('trade') || content.includes('market')) {
      return 'economy';
    }
    if (content.includes('political') || content.includes('policy') || content.includes('government')) {
      return 'politics';
    }
    if (content.includes('military') || content.includes('defense') || content.includes('war')) {
      return 'military';
    }
    if (content.includes('technology') || content.includes('research') || content.includes('discovery')) {
      return 'technology';
    }
    if (content.includes('social') || content.includes('culture') || content.includes('population')) {
      return 'social';
    }
    if (content.includes('diplomacy') || content.includes('treaty') || content.includes('alliance')) {
      return 'diplomacy';
    }
    if (content.includes('space') || content.includes('galactic') || content.includes('planet')) {
      return 'space';
    }
    
    return 'social'; // Default category
  }

  /**
   * Check if an event is newsworthy based on request criteria
   */
  private isEventNewsworthy(event: any, request: NewsGenerationRequest): boolean {
    // Check if event category is requested
    if (request.categories.length > 0 && !request.categories.includes(event.category)) {
      return false;
    }

    // Check if event scope is requested
    if (request.scope.length > 0 && !request.scope.includes(event.scope)) {
      return false;
    }

    // Check minimum priority
    if (request.minPriority) {
      const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4, 'breaking': 5 };
      const eventPriority = priorityOrder[event.priority] || 1;
      const minPriority = priorityOrder[request.minPriority] || 1;
      
      if (eventPriority < minPriority) {
        return false;
      }
    }

    // Check newsworthiness threshold
    return (event.newsworthiness || 0) > 20;
  }

  /**
   * Select appropriate outlets for covering events
   */
  private async selectOutletsForCoverage(
    request: NewsGenerationRequest, 
    events: any[]
  ): Promise<NewsOutlet[]> {
    let availableOutlets = Array.from(this.outlets.values());

    // Filter by target outlets if specified
    if (request.targetOutlets && request.targetOutlets.length > 0) {
      availableOutlets = availableOutlets.filter(outlet => 
        request.targetOutlets!.includes(outlet.id)
      );
    }

    // Ensure perspective diversity if requested
    if (request.perspectiveDiversity) {
      const perspectives = ['far-left', 'left', 'center-left', 'center', 'center-right', 'right', 'far-right'];
      const selectedOutlets: NewsOutlet[] = [];
      
      for (const perspective of perspectives) {
        const outletsWithPerspective = availableOutlets.filter(outlet => 
          outlet.perspective.politicalLean === perspective
        );
        if (outletsWithPerspective.length > 0) {
          selectedOutlets.push(outletsWithPerspective[0]);
        }
      }
      
      return selectedOutlets;
    }

    return availableOutlets;
  }

  /**
   * Check if an outlet should cover a specific event
   */
  private shouldOutletCoverEvent(outlet: NewsOutlet, event: any): boolean {
    // Check if outlet specializes in this category
    if (outlet.specializations.length > 0 && !outlet.specializations.includes(event.category)) {
      return Math.random() < 0.3; // 30% chance to cover outside specialization
    }

    // Government outlets more likely to cover political events favorably
    if (outlet.type === 'government' && event.category === 'politics') {
      return outlet.perspective.governmentStance !== 'opposition';
    }

    // Opposition outlets more likely to cover negative government news
    if (outlet.type === 'opposition' && event.category === 'politics') {
      return outlet.perspective.governmentStance === 'opposition';
    }

    // Corporate outlets more likely to cover economic news
    if (outlet.type === 'corporate' && event.category === 'economy') {
      return true;
    }

    // Foreign outlets more likely to cover galactic/diplomatic events
    if (outlet.type === 'foreign' && (event.scope === 'galactic' || event.category === 'diplomacy')) {
      return true;
    }

    return true; // Default: outlet covers the event
  }

  /**
   * Generate an article for a specific outlet covering an event
   */
  private async generateArticleForOutlet(
    event: any, 
    outlet: NewsOutlet, 
    request: NewsGenerationRequest
  ): Promise<NewsArticle> {
    const prompt = this.buildNewsPrompt(event, outlet, request);
    
    const startTime = Date.now();
    const response = await this.llmProvider.generateText({
      prompt,
      temperature: 0.7,
      maxTokens: 800,
      model: 'gpt-4'
    });
    const generationTime = Date.now() - startTime;

    // Parse the response to extract article components
    const articleContent = this.parseArticleResponse(response.text);
    
    // Calculate factual accuracy based on outlet reliability
    const factualAccuracy = outlet.perspective.reliability * (1 - outlet.perspective.sensationalism * 0.3);
    
    // Estimate reach based on outlet characteristics
    const estimatedReach = outlet.reach * (event.newsworthiness / 100);
    
    // Calculate public reaction
    const publicReaction = this.calculatePublicReaction(event, outlet, articleContent);

    const article: NewsArticle = {
      id: nanoid(),
      headline: articleContent.headline,
      subheadline: articleContent.subheadline,
      content: articleContent.content,
      summary: articleContent.summary,
      
      category: event.category,
      scope: event.scope,
      priority: event.priority,
      
      outletId: outlet.id,
      outletName: outlet.name,
      outletPerspective: outlet.perspective,
      
      sourceEvents: [event.id || nanoid()],
      relatedEntities: event.relatedEntities || [],
      factualAccuracy,
      
      estimatedReach,
      publicReaction,
      
      publishedAt: new Date(),
      tickId: request.tickId,
      campaignId: request.campaignId,
      tags: this.generateTags(event, outlet),
      
      generationContext: {
        aiModel: 'gpt-4',
        prompt,
        temperature: 0.7,
        confidence: response.confidence || 0.8,
        generationTime
      }
    };

    return article;
  }

  /**
   * Build AI prompt for news article generation
   */
  private buildNewsPrompt(event: any, outlet: NewsOutlet, request: NewsGenerationRequest): string {
    return `Generate a news article for "${outlet.name}", a ${outlet.type} news outlet with the following characteristics:

OUTLET PROFILE:
- Political Lean: ${outlet.perspective.politicalLean}
- Government Stance: ${outlet.perspective.governmentStance}
- Economic View: ${outlet.perspective.economicView}
- Reliability: ${outlet.perspective.reliability}/1.0
- Sensationalism: ${outlet.perspective.sensationalism}/1.0
- Target Audience: ${outlet.targetAudience.join(', ')}

EVENT TO COVER:
- Type: ${event.type}
- Category: ${event.category}
- Priority: ${event.priority}
- Title: ${event.title}
- Data: ${JSON.stringify(event.data, null, 2)}

REQUIREMENTS:
1. Write from the outlet's perspective and bias
2. Include headline, subheadline, content (400-600 words), and summary (50 words)
3. Reflect the outlet's reliability and sensationalism levels
4. Target the outlet's audience
5. Use appropriate tone for the event priority
6. Include relevant quotes or data points

FORMAT:
HEADLINE: [Compelling headline reflecting outlet bias]
SUBHEADLINE: [Supporting subheadline]
SUMMARY: [50-word summary]
CONTENT: [Full article content 400-600 words]

Generate the article now:`;
  }

  /**
   * Parse AI response to extract article components
   */
  private parseArticleResponse(response: string): {
    headline: string;
    subheadline?: string;
    content: string;
    summary: string;
  } {
    const lines = response.split('\n');
    let headline = '';
    let subheadline = '';
    let summary = '';
    let content = '';
    
    let currentSection = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('HEADLINE:')) {
        headline = trimmedLine.replace('HEADLINE:', '').trim();
        currentSection = 'headline';
      } else if (trimmedLine.startsWith('SUBHEADLINE:')) {
        subheadline = trimmedLine.replace('SUBHEADLINE:', '').trim();
        currentSection = 'subheadline';
      } else if (trimmedLine.startsWith('SUMMARY:')) {
        summary = trimmedLine.replace('SUMMARY:', '').trim();
        currentSection = 'summary';
      } else if (trimmedLine.startsWith('CONTENT:')) {
        content = trimmedLine.replace('CONTENT:', '').trim();
        currentSection = 'content';
      } else if (trimmedLine && currentSection) {
        // Continue building the current section
        if (currentSection === 'content') {
          content += (content ? '\n\n' : '') + trimmedLine;
        } else if (currentSection === 'summary' && !summary) {
          summary = trimmedLine;
        } else if (currentSection === 'headline' && !headline) {
          headline = trimmedLine;
        } else if (currentSection === 'subheadline' && !subheadline) {
          subheadline = trimmedLine;
        }
      }
    }

    // Fallbacks if parsing fails
    if (!headline) {
      headline = response.split('\n')[0] || 'Breaking News';
    }
    if (!content) {
      content = response;
    }
    if (!summary) {
      summary = content.substring(0, 200) + '...';
    }

    return { headline, subheadline, content, summary };
  }

  /**
   * Calculate public reaction to an article
   */
  private calculatePublicReaction(event: any, outlet: NewsOutlet, articleContent: any): {
    sentiment: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
    engagement: number;
    controversyLevel: number;
  } {
    // Base sentiment on event type and outlet bias
    let sentimentScore = 0;
    
    // Positive events generally get positive coverage
    if (event.type === 'economic' && event.data.gdpChange > 0) {
      sentimentScore += 0.3;
    }
    
    // Outlet bias affects sentiment
    if (outlet.perspective.governmentStance === 'supportive' && event.category === 'politics') {
      sentimentScore += 0.2;
    } else if (outlet.perspective.governmentStance === 'opposition' && event.category === 'politics') {
      sentimentScore -= 0.2;
    }
    
    // Sensationalism increases engagement but can affect sentiment
    const engagement = Math.min(1, outlet.perspective.sensationalism * 0.7 + (event.newsworthiness / 100) * 0.3);
    
    // Controversy based on political lean and event type
    let controversyLevel = 0;
    if (event.category === 'politics' || event.category === 'military') {
      controversyLevel = 0.6 + outlet.perspective.sensationalism * 0.3;
    } else {
      controversyLevel = outlet.perspective.sensationalism * 0.4;
    }
    
    // Convert sentiment score to category
    let sentiment: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
    if (sentimentScore < -0.3) sentiment = 'very-negative';
    else if (sentimentScore < -0.1) sentiment = 'negative';
    else if (sentimentScore < 0.1) sentiment = 'neutral';
    else if (sentimentScore < 0.3) sentiment = 'positive';
    else sentiment = 'very-positive';

    return {
      sentiment,
      engagement: Math.max(0, Math.min(1, engagement)),
      controversyLevel: Math.max(0, Math.min(1, controversyLevel))
    };
  }

  /**
   * Generate tags for an article
   */
  private generateTags(event: any, outlet: NewsOutlet): string[] {
    const tags: string[] = [];
    
    tags.push(event.category);
    tags.push(event.scope);
    tags.push(outlet.type);
    
    if (event.data) {
      // Add specific tags based on event data
      if (event.data.gdpChange) tags.push('gdp');
      if (event.data.unemploymentChange) tags.push('unemployment');
      if (event.data.leadershipChange) tags.push('leadership');
      if (event.data.militaryAction) tags.push('military-action');
      if (event.data.discovery) tags.push('discovery');
    }
    
    return tags;
  }

  /**
   * Calculate quality metrics for generated articles
   */
  private calculateQualityMetrics(articles: NewsArticle[], request: NewsGenerationRequest): {
    factualConsistency: number;
    perspectiveDiversity: number;
    relevanceScore: number;
    engagementPotential: number;
  } {
    if (articles.length === 0) {
      return {
        factualConsistency: 0,
        perspectiveDiversity: 0,
        relevanceScore: 0,
        engagementPotential: 0
      };
    }

    // Factual consistency: how consistent facts are across outlets
    const avgAccuracy = articles.reduce((sum, a) => sum + a.factualAccuracy, 0) / articles.length;
    const accuracyVariance = articles.reduce((sum, a) => sum + Math.pow(a.factualAccuracy - avgAccuracy, 2), 0) / articles.length;
    const factualConsistency = Math.max(0, 1 - accuracyVariance);

    // Perspective diversity: how different the outlet perspectives are
    const perspectives = new Set(articles.map(a => a.outletPerspective.politicalLean));
    const perspectiveDiversity = Math.min(1, perspectives.size / 7); // 7 possible political leans

    // Relevance score: how relevant articles are to simulation state
    const relevanceScore = articles.reduce((sum, a) => sum + a.generationContext.confidence, 0) / articles.length;

    // Engagement potential: predicted public interest
    const engagementPotential = articles.reduce((sum, a) => sum + a.publicReaction.engagement, 0) / articles.length;

    return {
      factualConsistency,
      perspectiveDiversity,
      relevanceScore,
      engagementPotential
    };
  }

  /**
   * Initialize default news outlets with different perspectives
   */
  private initializeDefaultOutlets(): void {
    const defaultOutlets: NewsOutlet[] = [
      {
        id: 'gov-herald',
        name: 'The Government Herald',
        type: 'government',
        civilizationId: 'default',
        perspective: {
          politicalLean: 'center',
          governmentStance: 'supportive',
          economicView: 'mixed',
          reliability: 0.8,
          sensationalism: 0.2
        },
        targetAudience: ['general-public', 'government-workers'],
        specializations: ['politics', 'economy', 'military'],
        credibility: 0.75,
        reach: 0.6,
        metadata: {
          founded: new Date('2150-01-01'),
          headquarters: 'Capital City',
          ownershipType: 'government',
          language: 'Standard',
          format: 'text'
        }
      },
      {
        id: 'independent-times',
        name: 'Independent Times',
        type: 'independent',
        civilizationId: 'default',
        perspective: {
          politicalLean: 'center-left',
          governmentStance: 'neutral',
          economicView: 'mixed',
          reliability: 0.85,
          sensationalism: 0.3
        },
        targetAudience: ['intellectuals', 'professionals'],
        specializations: ['politics', 'social', 'technology'],
        credibility: 0.8,
        reach: 0.4,
        metadata: {
          founded: new Date('2145-06-15'),
          headquarters: 'Metro District',
          ownershipType: 'private',
          language: 'Standard',
          format: 'text'
        }
      },
      {
        id: 'corporate-news',
        name: 'Corporate News Network',
        type: 'corporate',
        civilizationId: 'default',
        perspective: {
          politicalLean: 'center-right',
          governmentStance: 'neutral',
          economicView: 'capitalist',
          reliability: 0.7,
          sensationalism: 0.4
        },
        targetAudience: ['business-leaders', 'investors'],
        specializations: ['economy', 'trade', 'technology'],
        credibility: 0.7,
        reach: 0.3,
        metadata: {
          founded: new Date('2140-03-20'),
          headquarters: 'Financial District',
          ownershipType: 'private',
          language: 'Standard',
          format: 'mixed'
        }
      },
      {
        id: 'peoples-voice',
        name: 'The People\'s Voice',
        type: 'opposition',
        civilizationId: 'default',
        perspective: {
          politicalLean: 'left',
          governmentStance: 'critical',
          economicView: 'socialist',
          reliability: 0.75,
          sensationalism: 0.5
        },
        targetAudience: ['workers', 'activists'],
        specializations: ['social', 'politics', 'crime'],
        credibility: 0.65,
        reach: 0.25,
        metadata: {
          founded: new Date('2148-11-10'),
          headquarters: 'Workers District',
          ownershipType: 'cooperative',
          language: 'Standard',
          format: 'text'
        }
      },
      {
        id: 'galactic-observer',
        name: 'Galactic Observer',
        type: 'foreign',
        civilizationId: 'galactic-federation',
        perspective: {
          politicalLean: 'center',
          governmentStance: 'neutral',
          economicView: 'mixed',
          reliability: 0.9,
          sensationalism: 0.1
        },
        targetAudience: ['diplomats', 'galactic-citizens'],
        specializations: ['diplomacy', 'space', 'military'],
        credibility: 0.85,
        reach: 0.15,
        metadata: {
          founded: new Date('2100-01-01'),
          headquarters: 'Galactic Station Alpha',
          ownershipType: 'public',
          language: 'Galactic Standard',
          format: 'mixed'
        }
      }
    ];

    for (const outlet of defaultOutlets) {
      this.outlets.set(outlet.id, outlet);
    }
  }

  /**
   * Initialize event triggers for automatic news generation
   */
  private initializeEventTriggers(): void {
    const defaultTriggers: NewsEventTrigger[] = [
      {
        id: 'economic-crisis',
        name: 'Economic Crisis',
        description: 'Triggers when economic indicators show significant decline',
        eventTypes: ['economic-decline', 'market-crash', 'unemployment-spike'],
        thresholds: { gdpChange: -0.05, unemploymentChange: 0.03 },
        categories: ['economy', 'politics'],
        priority: 'breaking',
        scope: 'civilization',
        urgency: 0.9,
        preferredOutlets: ['government', 'independent', 'corporate'],
        excludedOutlets: [],
        contentTemplate: 'Economic crisis reporting template',
        requiredElements: ['statistics', 'expert-quotes', 'government-response'],
        optionalElements: ['historical-comparison', 'future-outlook'],
        metadata: {
          createdAt: new Date(),
          triggerCount: 0,
          averageImpact: 0
        }
      },
      {
        id: 'military-action',
        name: 'Military Action',
        description: 'Triggers when military actions are detected',
        eventTypes: ['military-deployment', 'conflict', 'defense-action'],
        thresholds: { militaryActivity: 0.7 },
        categories: ['military', 'politics', 'diplomacy'],
        priority: 'breaking',
        scope: 'galactic',
        urgency: 0.95,
        preferredOutlets: ['government', 'foreign'],
        excludedOutlets: ['entertainment'],
        contentTemplate: 'Military action reporting template',
        requiredElements: ['official-statement', 'casualty-report', 'strategic-analysis'],
        optionalElements: ['international-reaction', 'historical-context'],
        metadata: {
          createdAt: new Date(),
          triggerCount: 0,
          averageImpact: 0
        }
      }
    ];

    for (const trigger of defaultTriggers) {
      this.eventTriggers.set(trigger.id, trigger);
    }
  }

  /**
   * Get all registered news outlets
   */
  getOutlets(): NewsOutlet[] {
    return Array.from(this.outlets.values());
  }

  /**
   * Get outlet by ID
   */
  getOutlet(id: string): NewsOutlet | undefined {
    return this.outlets.get(id);
  }

  /**
   * Add or update a news outlet
   */
  setOutlet(outlet: NewsOutlet): void {
    this.outlets.set(outlet.id, outlet);
  }

  /**
   * Remove a news outlet
   */
  removeOutlet(id: string): boolean {
    return this.outlets.delete(id);
  }
}

export const newsEngine = new NewsEngine();
