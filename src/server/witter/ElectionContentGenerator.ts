import { EventEmitter } from 'events';

export interface ElectionWitt {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'politician' | 'journalist' | 'citizen' | 'analyst' | 'party_official';
  content: string;
  timestamp: Date;
  
  // Election context
  electionId?: string;
  electionType?: string;
  partyAffiliation?: string;
  
  // Content metadata
  category: 'campaign_update' | 'polling' | 'debate' | 'policy' | 'endorsement' | 'results' | 'analysis';
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  
  // Media attachments
  hasImage?: boolean;
  hasVideo?: boolean;
  hasLink?: boolean;
  
  // AI generation metadata
  aiGenerated: boolean;
  generationContext: string;
}

export interface ElectionNewsArticle {
  id: string;
  headline: string;
  summary: string;
  body: string;
  author: string;
  category: 'breaking' | 'analysis' | 'feature' | 'opinion';
  
  // Election context
  electionId?: string;
  electionType?: string;
  
  // Content metadata
  tags: string[];
  importance: number; // 0-100
  readTime: number; // minutes
  
  // Publication info
  publishedAt: Date;
  updatedAt?: Date;
  
  // AI generation metadata
  aiGenerated: boolean;
  sources: string[];
}

export class ElectionContentGenerator extends EventEmitter {
  private politicalPersonalities: Map<string, any> = new Map();
  private contentTemplates: Map<string, string[]> = new Map();
  private recentElectionEvents: any[] = [];

  constructor() {
    super();
    this.initializePoliticalPersonalities();
    this.initializeContentTemplates();
  }

  /**
   * Initialize political personalities for content generation
   */
  private initializePoliticalPersonalities(): void {
    const personalities = [
      {
        id: 'pol_001',
        name: 'Senator Maria Rodriguez',
        type: 'politician',
        party: 'Progressive Alliance',
        personality: 'charismatic_reformer',
        topics: ['healthcare', 'education', 'economic_equality'],
        tone: 'inspirational'
      },
      {
        id: 'pol_002',
        name: 'Governor James Chen',
        type: 'politician',
        party: 'Conservative Coalition',
        personality: 'pragmatic_conservative',
        topics: ['security', 'fiscal_responsibility', 'traditional_values'],
        tone: 'authoritative'
      },
      {
        id: 'jour_001',
        name: 'Sarah Mitchell',
        type: 'journalist',
        outlet: 'Galactic News Network',
        specialty: 'political_analysis',
        tone: 'analytical'
      },
      {
        id: 'jour_002',
        name: 'David Park',
        type: 'journalist',
        outlet: 'Capital Tribune',
        specialty: 'campaign_coverage',
        tone: 'investigative'
      },
      {
        id: 'analyst_001',
        name: 'Dr. Elena Vasquez',
        type: 'analyst',
        specialty: 'polling_expert',
        tone: 'data_driven'
      },
      {
        id: 'citizen_001',
        name: 'Alex Thompson',
        type: 'citizen',
        demographic: 'young_professional',
        interests: ['climate', 'jobs', 'housing'],
        tone: 'concerned'
      }
    ];

    personalities.forEach(personality => {
      this.politicalPersonalities.set(personality.id, personality);
    });
  }

  /**
   * Initialize content templates for different types of election content
   */
  private initializeContentTemplates(): void {
    const templates = {
      campaign_launch: [
        "🎪 Campaign season is officially here! {party} kicks off with ambitious platform focusing on {issues}. Ready for the debates! #Election2024",
        "The race begins! {candidate} launches campaign with promise to {promise}. Will voters buy it? 🤔 #CampaignTrail",
        "🚀 {party} enters the race with bold vision for {topic}. Campaign promises {specific_promise}. Game on! #Politics"
      ],
      
      polling_update: [
        "📊 NEW POLL: {leader} leads with {percentage}%! {trend} since last poll. Margin of error ±{margin}%. Race is {description}! #Polls",
        "Polling update shows {party} {trend_direction} to {percentage}%. {analysis} #ElectionPolls #Data",
        "🔢 Latest numbers: {breakdown}. {insight} with {days} days until election! #PollWatch"
      ],
      
      debate_coverage: [
        "🎤 DEBATE NIGHT: {candidate} delivers strong performance on {topic}. {reaction} from audience. Who won? You decide! #Debate",
        "Sparks fly in tonight's debate! {candidate1} vs {candidate2} on {issue}. {key_moment} was the highlight. #DebateNight",
        "📺 Debate recap: {winner} dominated discussion on {topic}. {loser} struggled with {weakness}. Polls will tell the story. #Politics"
      ],
      
      campaign_activity: [
        "🎪 HUGE RALLY: {candidate} draws {attendance} supporters in {location}! Energy is electric! {key_message} #Rally #Campaign",
        "On the campaign trail: {candidate} visits {location}, promises {promise}. Local voters {reaction}. #CampaignTrail",
        "📢 {party} announces {policy} at {location} event. {impact} for {demographic} voters. Smart politics? #PolicyNews"
      ],
      
      election_results: [
        "🎉 ELECTION CALLED: {winner} wins with {percentage}%! Turnout: {turnout}%. {reaction} #ElectionResults #Democracy",
        "The people have spoken! {winner} secures victory with {margin} margin. {concession} from {loser}. #Election2024",
        "🏆 VICTORY: {winner} claims mandate with {percentage}% of vote. {analysis} What's next? #ElectionNight"
      ],
      
      policy_analysis: [
        "📋 POLICY DEEP DIVE: {candidate}'s {policy} plan would {impact}. Cost: {cost}. Feasible? {analysis} #PolicyAnalysis",
        "Breaking down {party}'s platform: {policy} promises {benefit} but critics say {criticism}. Reality check: {assessment}",
        "🔍 Fact-checking {candidate}'s claim about {topic}: {verdict}. The details matter in this election. #FactCheck"
      ],
      
      endorsement: [
        "🤝 BIG ENDORSEMENT: {endorser} backs {candidate} for {reason}. {impact} for campaign momentum! #Endorsement",
        "Surprise endorsement: {endorser} chooses {candidate} over {alternative}. {analysis} #Politics #Endorsements",
        "📰 {organization} endorses {candidate}, citing {reason}. {reaction} from other campaigns. #EndorsementNews"
      ]
    };

    Object.entries(templates).forEach(([category, templateList]) => {
      this.contentTemplates.set(category, templateList);
    });
  }

  /**
   * Generate Witter content for election events
   */
  async generateElectionWitts(electionEvent: any, count: number = 5): Promise<ElectionWitt[]> {
    const witts: ElectionWitt[] = [];
    const eventType = electionEvent.type;
    
    // Generate witts from different perspectives
    const perspectives = this.selectPerspectives(eventType, count);
    
    for (const perspective of perspectives) {
      const witt = await this.generateWittFromPerspective(electionEvent, perspective);
      if (witt) {
        witts.push(witt);
      }
    }

    return witts;
  }

  /**
   * Generate news articles for election events
   */
  async generateElectionNews(electionEvent: any): Promise<ElectionNewsArticle[]> {
    const articles: ElectionNewsArticle[] = [];
    const eventType = electionEvent.type;

    // Generate different types of articles based on event importance
    if (electionEvent.importance > 80) {
      // Breaking news
      const breakingNews = await this.generateBreakingNews(electionEvent);
      articles.push(breakingNews);
    }

    if (electionEvent.importance > 60) {
      // Analysis piece
      const analysis = await this.generateAnalysisArticle(electionEvent);
      articles.push(analysis);
    }

    // Feature article for major events
    if (['ELECTION_RESULTS', 'CAMPAIGN_LAUNCH', 'CANDIDATE_DEBATE'].includes(eventType)) {
      const feature = await this.generateFeatureArticle(electionEvent);
      articles.push(feature);
    }

    return articles;
  }

  /**
   * Select perspectives for content generation
   */
  private selectPerspectives(eventType: string, count: number): any[] {
    const allPersonalities = Array.from(this.politicalPersonalities.values());
    const perspectives = [];

    // Always include a journalist for major events
    const journalists = allPersonalities.filter(p => p.type === 'journalist');
    if (journalists.length > 0) {
      perspectives.push(journalists[Math.floor(Math.random() * journalists.length)]);
    }

    // Add politicians based on event type
    if (['CAMPAIGN_LAUNCH', 'POLICY_ANNOUNCEMENT', 'RALLY_EVENT'].includes(eventType)) {
      const politicians = allPersonalities.filter(p => p.type === 'politician');
      if (politicians.length > 0) {
        perspectives.push(politicians[Math.floor(Math.random() * politicians.length)]);
      }
    }

    // Add analysts for polling and results
    if (['POLLING_RELEASE', 'ELECTION_RESULTS'].includes(eventType)) {
      const analysts = allPersonalities.filter(p => p.type === 'analyst');
      if (analysts.length > 0) {
        perspectives.push(analysts[Math.floor(Math.random() * analysts.length)]);
      }
    }

    // Fill remaining slots with citizens
    while (perspectives.length < count) {
      const citizens = allPersonalities.filter(p => p.type === 'citizen');
      if (citizens.length > 0) {
        const citizen = citizens[Math.floor(Math.random() * citizens.length)];
        if (!perspectives.includes(citizen)) {
          perspectives.push(citizen);
        }
      } else {
        break;
      }
    }

    return perspectives.slice(0, count);
  }

  /**
   * Generate a witt from a specific perspective
   */
  private async generateWittFromPerspective(electionEvent: any, perspective: any): Promise<ElectionWitt | null> {
    const eventType = electionEvent.type;
    const templates = this.getTemplatesForEventType(eventType);
    
    if (!templates || templates.length === 0) {
      return null;
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    const content = this.fillTemplate(template, electionEvent, perspective);

    const witt: ElectionWitt = {
      id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: perspective.id,
      authorName: perspective.name,
      authorType: perspective.type,
      content,
      timestamp: new Date(),
      
      electionId: electionEvent.electionId,
      electionType: electionEvent.electionContext?.electionType,
      partyAffiliation: perspective.party,
      
      category: this.mapEventTypeToCategory(eventType),
      sentiment: this.determineSentiment(content, perspective),
      engagement: this.generateEngagementMetrics(perspective.type, eventType),
      
      hasImage: Math.random() > 0.7, // 30% chance of image
      hasVideo: Math.random() > 0.9, // 10% chance of video
      hasLink: Math.random() > 0.8,  // 20% chance of link
      
      aiGenerated: true,
      generationContext: `${eventType}_${perspective.type}`
    };

    return witt;
  }

  /**
   * Generate breaking news article
   */
  private async generateBreakingNews(electionEvent: any): Promise<ElectionNewsArticle> {
    const headline = this.generateNewsHeadline(electionEvent, 'breaking');
    const summary = this.generateNewsSummary(electionEvent);
    const body = this.generateNewsBody(electionEvent, 'breaking');

    return {
      id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      headline,
      summary,
      body,
      author: this.selectNewsAuthor('breaking'),
      category: 'breaking',
      
      electionId: electionEvent.electionId,
      electionType: electionEvent.electionContext?.electionType,
      
      tags: this.generateNewsTags(electionEvent),
      importance: electionEvent.importance,
      readTime: Math.ceil(body.length / 200), // Rough estimate
      
      publishedAt: new Date(),
      
      aiGenerated: true,
      sources: ['Campaign Officials', 'Election Commission', 'Field Reports']
    };
  }

  /**
   * Generate analysis article
   */
  private async generateAnalysisArticle(electionEvent: any): Promise<ElectionNewsArticle> {
    const headline = this.generateNewsHeadline(electionEvent, 'analysis');
    const summary = this.generateNewsSummary(electionEvent);
    const body = this.generateNewsBody(electionEvent, 'analysis');

    return {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      headline,
      summary,
      body,
      author: this.selectNewsAuthor('analysis'),
      category: 'analysis',
      
      electionId: electionEvent.electionId,
      electionType: electionEvent.electionContext?.electionType,
      
      tags: this.generateNewsTags(electionEvent),
      importance: electionEvent.importance - 10, // Analysis is slightly less urgent
      readTime: Math.ceil(body.length / 180), // Longer read time for analysis
      
      publishedAt: new Date(),
      
      aiGenerated: true,
      sources: ['Political Experts', 'Historical Data', 'Polling Analysis']
    };
  }

  /**
   * Generate feature article
   */
  private async generateFeatureArticle(electionEvent: any): Promise<ElectionNewsArticle> {
    const headline = this.generateNewsHeadline(electionEvent, 'feature');
    const summary = this.generateNewsSummary(electionEvent);
    const body = this.generateNewsBody(electionEvent, 'feature');

    return {
      id: `feature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      headline,
      summary,
      body,
      author: this.selectNewsAuthor('feature'),
      category: 'feature',
      
      electionId: electionEvent.electionId,
      electionType: electionEvent.electionContext?.electionType,
      
      tags: this.generateNewsTags(electionEvent),
      importance: electionEvent.importance - 20, // Features are less time-sensitive
      readTime: Math.ceil(body.length / 160), // Longest read time
      
      publishedAt: new Date(),
      
      aiGenerated: true,
      sources: ['Interviews', 'Campaign Documents', 'Public Records']
    };
  }

  // Helper methods for content generation

  private getTemplatesForEventType(eventType: string): string[] | undefined {
    const mapping: { [key: string]: string } = {
      'CAMPAIGN_LAUNCH': 'campaign_launch',
      'POLLING_RELEASE': 'polling_update',
      'CANDIDATE_DEBATE': 'debate_coverage',
      'RALLY_EVENT': 'campaign_activity',
      'ELECTION_RESULTS': 'election_results',
      'POLICY_ANNOUNCEMENT': 'policy_analysis',
      'ENDORSEMENT': 'endorsement'
    };

    const templateKey = mapping[eventType];
    return templateKey ? this.contentTemplates.get(templateKey) : undefined;
  }

  private fillTemplate(template: string, electionEvent: any, perspective: any): string {
    let content = template;
    
    // Replace common placeholders
    const replacements: { [key: string]: string } = {
      '{party}': electionEvent.eventData?.party || 'Progressive Alliance',
      '{candidate}': perspective.name || 'Candidate',
      '{percentage}': electionEvent.eventData?.polling?.leaderPercentage || '45.2',
      '{location}': electionEvent.eventData?.location || 'Capital City',
      '{issue}': this.selectRandomIssue(),
      '{topic}': this.selectRandomTopic(),
      '{days}': electionEvent.electionContext?.daysUntilElection?.toString() || '30',
      '{attendance}': (1000 + Math.floor(Math.random() * 9000)).toLocaleString(),
      '{margin}': (2.5 + Math.random() * 2).toFixed(1),
      '{turnout}': (65 + Math.random() * 25).toFixed(1)
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return content;
  }

  private selectRandomIssue(): string {
    const issues = [
      'healthcare reform', 'economic growth', 'education funding', 
      'climate action', 'national security', 'tax policy',
      'infrastructure', 'social programs', 'government transparency'
    ];
    return issues[Math.floor(Math.random() * issues.length)];
  }

  private selectRandomTopic(): string {
    const topics = [
      'the economy', 'healthcare', 'education', 'security',
      'the environment', 'jobs', 'housing', 'transportation'
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private mapEventTypeToCategory(eventType: string): ElectionWitt['category'] {
    const mapping: { [key: string]: ElectionWitt['category'] } = {
      'CAMPAIGN_LAUNCH': 'campaign_update',
      'POLLING_RELEASE': 'polling',
      'CANDIDATE_DEBATE': 'debate',
      'POLICY_ANNOUNCEMENT': 'policy',
      'ENDORSEMENT': 'endorsement',
      'ELECTION_RESULTS': 'results',
      'RALLY_EVENT': 'campaign_update'
    };

    return mapping[eventType] || 'campaign_update';
  }

  private determineSentiment(content: string, perspective: any): 'positive' | 'negative' | 'neutral' {
    // Simple sentiment analysis based on content and perspective
    const positiveWords = ['victory', 'success', 'great', 'excellent', 'strong', 'wins', 'leads'];
    const negativeWords = ['fails', 'loses', 'weak', 'disappointing', 'struggles', 'behind'];
    
    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private generateEngagementMetrics(authorType: string, eventType: string): { likes: number; shares: number; comments: number } {
    // Base engagement based on author type and event importance
    const baseEngagement = {
      politician: { likes: 500, shares: 100, comments: 50 },
      journalist: { likes: 300, shares: 150, comments: 75 },
      analyst: { likes: 200, shares: 80, comments: 40 },
      citizen: { likes: 50, shares: 20, comments: 10 }
    };

    const base = baseEngagement[authorType as keyof typeof baseEngagement] || baseEngagement.citizen;
    
    // Multiply by event importance factor
    const importanceMultiplier = ['ELECTION_RESULTS', 'CANDIDATE_DEBATE'].includes(eventType) ? 2 : 1;
    
    return {
      likes: Math.floor(base.likes * importanceMultiplier * (0.5 + Math.random())),
      shares: Math.floor(base.shares * importanceMultiplier * (0.5 + Math.random())),
      comments: Math.floor(base.comments * importanceMultiplier * (0.5 + Math.random()))
    };
  }

  private generateNewsHeadline(electionEvent: any, category: string): string {
    const headlines = {
      breaking: [
        `BREAKING: ${electionEvent.eventData?.title || 'Major Election Development'}`,
        `URGENT: ${electionEvent.headline || 'Election News Update'}`,
        `DEVELOPING: ${electionEvent.eventData?.party || 'Political Party'} ${electionEvent.type.replace('_', ' ')}`
      ],
      analysis: [
        `Analysis: What ${electionEvent.eventData?.title || 'Recent Events'} Mean for the Election`,
        `Deep Dive: ${electionEvent.type.replace('_', ' ')} Impact on Voter Sentiment`,
        `Expert Analysis: ${electionEvent.eventData?.party || 'Campaign'} Strategy Breakdown`
      ],
      feature: [
        `Inside the Campaign: ${electionEvent.eventData?.title || 'Election Story'}`,
        `The Road to Victory: ${electionEvent.eventData?.party || 'Party'} Campaign Journey`,
        `Election 2024: ${electionEvent.type.replace('_', ' ')} Shapes the Race`
      ]
    };

    const categoryHeadlines = headlines[category as keyof typeof headlines] || headlines.breaking;
    return categoryHeadlines[Math.floor(Math.random() * categoryHeadlines.length)];
  }

  private generateNewsSummary(electionEvent: any): string {
    return electionEvent.eventData?.description || 
           electionEvent.content || 
           `Latest developments in the ongoing election campaign as ${electionEvent.type.replace('_', ' ').toLowerCase()} shapes voter sentiment and campaign strategies.`;
  }

  private generateNewsBody(electionEvent: any, category: string): string {
    const baseParagraphs = [
      electionEvent.eventData?.description || 'Election developments continue to shape the political landscape.',
      'Campaign officials report strong engagement from voters across key demographics.',
      'Political analysts are closely monitoring the impact on polling numbers and voter sentiment.',
      'The election commission confirms all procedures are following established protocols.'
    ];

    if (category === 'analysis') {
      baseParagraphs.push(
        'Historical data suggests similar events have had significant impact on election outcomes.',
        'Experts recommend voters carefully consider all available information before making decisions.',
        'The long-term implications of these developments may extend beyond the current election cycle.'
      );
    }

    if (category === 'feature') {
      baseParagraphs.push(
        'Behind-the-scenes sources reveal the strategic thinking driving campaign decisions.',
        'Voter interviews across the district show mixed reactions to recent developments.',
        'Campaign volunteers report increased activity and engagement from supporters.'
      );
    }

    return baseParagraphs.join('\n\n');
  }

  private selectNewsAuthor(category: string): string {
    const authors = {
      breaking: ['Sarah Mitchell', 'David Park', 'Elena Rodriguez'],
      analysis: ['Dr. Elena Vasquez', 'Prof. Michael Chen', 'Sarah Mitchell'],
      feature: ['David Park', 'Maria Santos', 'James Wilson']
    };

    const categoryAuthors = authors[category as keyof typeof authors] || authors.breaking;
    return categoryAuthors[Math.floor(Math.random() * categoryAuthors.length)];
  }

  private generateNewsTags(electionEvent: any): string[] {
    const baseTags = ['election', 'politics', 'campaign', 'democracy'];
    
    if (electionEvent.electionContext?.electionType) {
      baseTags.push(electionEvent.electionContext.electionType);
    }

    if (electionEvent.eventData?.party) {
      baseTags.push('party-politics');
    }

    const eventTypeTags: { [key: string]: string[] } = {
      'POLLING_RELEASE': ['polls', 'polling-data', 'voter-sentiment'],
      'CANDIDATE_DEBATE': ['debate', 'candidates', 'policy'],
      'ELECTION_RESULTS': ['results', 'victory', 'voter-turnout'],
      'RALLY_EVENT': ['rally', 'campaign-event', 'supporters']
    };

    const additionalTags = eventTypeTags[electionEvent.type] || [];
    return [...baseTags, ...additionalTags];
  }

  /**
   * Process election event and generate all content
   */
  async processElectionEvent(electionEvent: any): Promise<{
    witts: ElectionWitt[];
    news: ElectionNewsArticle[];
  }> {
    this.recentElectionEvents.push(electionEvent);
    
    // Keep only recent events (last 50)
    if (this.recentElectionEvents.length > 50) {
      this.recentElectionEvents = this.recentElectionEvents.slice(-50);
    }

    const witts = await this.generateElectionWitts(electionEvent, 3 + Math.floor(Math.random() * 3));
    const news = await this.generateElectionNews(electionEvent);

    // Emit events for external systems
    this.emit('contentGenerated', {
      electionEvent,
      witts,
      news,
      timestamp: new Date()
    });

    return { witts, news };
  }
}


