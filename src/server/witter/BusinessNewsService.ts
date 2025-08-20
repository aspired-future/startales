import { Pool } from 'pg';
import { getFinancialMarketsService } from '../financial-markets/FinancialMarketsService.js';

export interface BusinessNewsPost {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'MEDIA' | 'ANALYST' | 'CITIZEN' | 'CORPORATE';
  authorAvatar: string;
  content: string;
  timestamp: Date;
  metadata: {
    category: 'BUSINESS_NEWS' | 'MARKET_ANALYSIS' | 'EARNINGS' | 'ECONOMIC_POLICY' | 'COMPANY_NEWS';
    newsType: 'BREAKING' | 'ANALYSIS' | 'EARNINGS_REPORT' | 'MARKET_UPDATE' | 'POLICY_ANNOUNCEMENT';
    relatedCompanies?: string[];
    relatedSectors?: string[];
    marketImpact?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    urgency?: 'HIGH' | 'MEDIUM' | 'LOW';
    sourceCredibility?: number; // 1-10 scale
  };
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface MarketCommentary {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorType: 'INVESTOR' | 'TRADER' | 'ANALYST' | 'CITIZEN';
  content: string;
  timestamp: Date;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  expertise: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class BusinessNewsService {
  private pool: Pool;
  private financialService: any;

  constructor(pool: Pool) {
    this.pool = pool;
    this.financialService = getFinancialMarketsService();
  }

  // Generate business news posts based on market data
  async generateBusinessNews(civilizationId: number, count: number = 5): Promise<BusinessNewsPost[]> {
    const posts: BusinessNewsPost[] = [];

    try {
      // Get market data for context
      const exchanges = await this.financialService.getStockExchanges(civilizationId);
      const companies = await this.financialService.getListedCompanies();
      const topPerformers = await this.financialService.getTopPerformingCompanies(civilizationId, 5);
      const sectorPerformance = await this.financialService.getSectorPerformance(civilizationId);

      // Generate different types of business news
      const newsTypes = [
        'market_update',
        'earnings_report', 
        'sector_analysis',
        'economic_policy',
        'company_announcement',
        'market_sentiment'
      ];

      for (let i = 0; i < count; i++) {
        const newsType = newsTypes[Math.floor(Math.random() * newsTypes.length)];
        const post = await this.generateNewsPost(newsType, {
          civilizationId,
          exchanges,
          companies,
          topPerformers,
          sectorPerformance
        });
        
        if (post) {
          posts.push(post);
        }
      }

      return posts;
    } catch (error) {
      console.error('Error generating business news:', error);
      return [];
    }
  }

  private async generateNewsPost(newsType: string, context: any): Promise<BusinessNewsPost | null> {
    const { civilizationId, companies, topPerformers, sectorPerformance } = context;

    switch (newsType) {
      case 'market_update':
        return this.generateMarketUpdate(civilizationId, sectorPerformance);
      
      case 'earnings_report':
        return this.generateEarningsReport(companies);
      
      case 'sector_analysis':
        return this.generateSectorAnalysis(sectorPerformance);
      
      case 'economic_policy':
        return this.generateEconomicPolicyNews(civilizationId);
      
      case 'company_announcement':
        return this.generateCompanyAnnouncement(companies);
      
      case 'market_sentiment':
        return this.generateMarketSentiment(topPerformers);
      
      default:
        return null;
    }
  }

  private async generateMarketUpdate(civilizationId: number, sectorPerformance: any[]): Promise<BusinessNewsPost> {
    const marketMovement = Math.random() > 0.5 ? 'up' : 'down';
    const percentage = (Math.random() * 4 + 0.5).toFixed(2);
    
    const content = marketMovement === 'up' 
      ? `📈 MARKET UPDATE: Major indices close ${percentage}% higher as investor confidence grows. Technology and healthcare sectors leading the rally. #Markets #Investing`
      : `📉 MARKET UPDATE: Markets decline ${percentage}% amid economic uncertainty. Defensive sectors showing resilience while growth stocks face pressure. #Markets #Economy`;

    return {
      id: `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'galactic_financial_news',
      authorName: 'Galactic Financial News',
      authorType: 'MEDIA',
      authorAvatar: '📰',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'BUSINESS_NEWS',
        newsType: 'MARKET_UPDATE',
        relatedSectors: sectorPerformance.slice(0, 3).map(s => s.sector),
        marketImpact: marketMovement === 'up' ? 'POSITIVE' : 'NEGATIVE',
        urgency: 'MEDIUM',
        sourceCredibility: 9
      },
      metrics: {
        likes: Math.floor(Math.random() * 200) + 50,
        shares: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 50) + 10
      }
    };
  }

  private async generateEarningsReport(companies: any[]): Promise<BusinessNewsPost> {
    const company = companies[Math.floor(Math.random() * Math.min(companies.length, 10))];
    if (!company) return null;

    const beatExpectations = Math.random() > 0.4;
    const earningsChange = beatExpectations 
      ? `+${(Math.random() * 30 + 5).toFixed(1)}%`
      : `-${(Math.random() * 15 + 2).toFixed(1)}%`;

    const content = beatExpectations
      ? `🎯 EARNINGS BEAT: ${company.company_name} (${company.company_symbol}) reports strong Q4 results, earnings ${earningsChange} vs. expectations. Stock surges in after-hours trading. #Earnings #${company.company_symbol}`
      : `⚠️ EARNINGS MISS: ${company.company_name} (${company.company_symbol}) falls short of Q4 expectations, earnings ${earningsChange}. Management cites market headwinds. #Earnings #${company.company_symbol}`;

    return {
      id: `earnings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'market_insider',
      authorName: 'Market Insider',
      authorType: 'MEDIA',
      authorAvatar: '💼',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'EARNINGS',
        newsType: 'EARNINGS_REPORT',
        relatedCompanies: [company.company_symbol],
        relatedSectors: [company.sector],
        marketImpact: beatExpectations ? 'POSITIVE' : 'NEGATIVE',
        urgency: 'HIGH',
        sourceCredibility: 8
      },
      metrics: {
        likes: Math.floor(Math.random() * 150) + 30,
        shares: Math.floor(Math.random() * 80) + 15,
        comments: Math.floor(Math.random() * 40) + 8
      }
    };
  }

  private async generateSectorAnalysis(sectorPerformance: any[]): Promise<BusinessNewsPost> {
    const sector = sectorPerformance[Math.floor(Math.random() * Math.min(sectorPerformance.length, 5))];
    if (!sector) return null;

    const trend = sector.avg_daily_change > 0 ? 'outperforming' : 'underperforming';
    const changePercent = Math.abs(sector.avg_daily_change).toFixed(2);

    const content = `📊 SECTOR SPOTLIGHT: ${sector.sector} sector ${trend} with ${changePercent}% average change. ${sector.company_count} companies tracked with total market cap of $${(sector.total_market_cap / 1e12).toFixed(2)}T. Key drivers include innovation and regulatory changes. #SectorAnalysis #${sector.sector.replace(/\s+/g, '')}`;

    return {
      id: `sector_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'sector_analyst_pro',
      authorName: 'Sector Analyst Pro',
      authorType: 'ANALYST',
      authorAvatar: '📈',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'MARKET_ANALYSIS',
        newsType: 'ANALYSIS',
        relatedSectors: [sector.sector],
        marketImpact: trend === 'outperforming' ? 'POSITIVE' : 'NEGATIVE',
        urgency: 'MEDIUM',
        sourceCredibility: 7
      },
      metrics: {
        likes: Math.floor(Math.random() * 120) + 25,
        shares: Math.floor(Math.random() * 60) + 12,
        comments: Math.floor(Math.random() * 30) + 6
      }
    };
  }

  private async generateEconomicPolicyNews(civilizationId: number): Promise<BusinessNewsPost> {
    const policies = [
      'interest rate adjustment',
      'trade policy update',
      'tax reform proposal',
      'infrastructure spending bill',
      'regulatory framework changes'
    ];

    const policy = policies[Math.floor(Math.random() * policies.length)];
    const impact = Math.random() > 0.5 ? 'positive' : 'mixed';

    const content = `🏛️ POLICY UPDATE: Government announces new ${policy} with ${impact} market implications. Financial analysts expect sector rotation as investors adjust portfolios. Treasury and Commerce departments coordinating implementation. #EconomicPolicy #Markets`;

    return {
      id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'economic_times',
      authorName: 'Economic Times',
      authorType: 'MEDIA',
      authorAvatar: '🏛️',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'ECONOMIC_POLICY',
        newsType: 'POLICY_ANNOUNCEMENT',
        marketImpact: impact === 'positive' ? 'POSITIVE' : 'NEUTRAL',
        urgency: 'HIGH',
        sourceCredibility: 9
      },
      metrics: {
        likes: Math.floor(Math.random() * 300) + 80,
        shares: Math.floor(Math.random() * 150) + 40,
        comments: Math.floor(Math.random() * 80) + 20
      }
    };
  }

  private async generateCompanyAnnouncement(companies: any[]): Promise<BusinessNewsPost> {
    const company = companies[Math.floor(Math.random() * Math.min(companies.length, 15))];
    if (!company) return null;

    const announcements = [
      'strategic partnership',
      'new product launch',
      'expansion into new markets',
      'leadership change',
      'acquisition deal',
      'R&D breakthrough'
    ];

    const announcement = announcements[Math.floor(Math.random() * announcements.length)];
    
    const content = `🚀 COMPANY NEWS: ${company.company_name} announces major ${announcement}. CEO expects significant revenue impact in coming quarters. Stock price reacts positively to the news. #${company.company_symbol} #CorporateNews`;

    return {
      id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'corporate_watch',
      authorName: 'Corporate Watch',
      authorType: 'MEDIA',
      authorAvatar: '🏢',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'COMPANY_NEWS',
        newsType: 'BREAKING',
        relatedCompanies: [company.company_symbol],
        relatedSectors: [company.sector],
        marketImpact: 'POSITIVE',
        urgency: 'MEDIUM',
        sourceCredibility: 8
      },
      metrics: {
        likes: Math.floor(Math.random() * 180) + 40,
        shares: Math.floor(Math.random() * 90) + 20,
        comments: Math.floor(Math.random() * 45) + 10
      }
    };
  }

  private async generateMarketSentiment(topPerformers: any[]): Promise<BusinessNewsPost> {
    const performer = topPerformers[Math.floor(Math.random() * topPerformers.length)];
    const sentiment = Math.random() > 0.6 ? 'bullish' : 'cautious';
    
    const content = sentiment === 'bullish'
      ? `🐂 MARKET SENTIMENT: Investors remain bullish as ${performer?.company_name || 'leading companies'} continue strong performance. Options activity suggests continued optimism despite global uncertainties. #MarketSentiment #Bullish`
      : `🐻 MARKET SENTIMENT: Growing caution among institutional investors as volatility increases. Defensive positioning evident in recent trading patterns. Risk management taking priority. #MarketSentiment #Volatility`;

    return {
      id: `sentiment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: 'market_pulse',
      authorName: 'Market Pulse',
      authorType: 'ANALYST',
      authorAvatar: '📊',
      content,
      timestamp: new Date(),
      metadata: {
        category: 'MARKET_ANALYSIS',
        newsType: 'ANALYSIS',
        relatedCompanies: performer ? [performer.company_symbol] : [],
        marketImpact: sentiment === 'bullish' ? 'POSITIVE' : 'NEUTRAL',
        urgency: 'LOW',
        sourceCredibility: 7
      },
      metrics: {
        likes: Math.floor(Math.random() * 100) + 20,
        shares: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 25) + 5
      }
    };
  }

  // Generate citizen commentary on business news
  async generateMarketCommentary(businessPost: BusinessNewsPost, count: number = 3): Promise<MarketCommentary[]> {
    const comments: MarketCommentary[] = [];

    const citizenTypes = [
      { type: 'INVESTOR', expertise: 'HIGH', name: 'Portfolio Manager' },
      { type: 'TRADER', expertise: 'MEDIUM', name: 'Day Trader' },
      { type: 'ANALYST', expertise: 'HIGH', name: 'Financial Analyst' },
      { type: 'CITIZEN', expertise: 'LOW', name: 'Retail Investor' }
    ];

    for (let i = 0; i < count; i++) {
      const citizen = citizenTypes[Math.floor(Math.random() * citizenTypes.length)];
      const sentiment = this.determineSentiment(businessPost.metadata.marketImpact);
      
      const comment = await this.generateComment(citizen, businessPost, sentiment);
      if (comment) {
        comments.push(comment);
      }
    }

    return comments;
  }

  private determineSentiment(marketImpact?: string): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    if (marketImpact === 'POSITIVE') {
      return Math.random() > 0.3 ? 'BULLISH' : 'NEUTRAL';
    } else if (marketImpact === 'NEGATIVE') {
      return Math.random() > 0.3 ? 'BEARISH' : 'NEUTRAL';
    }
    return 'NEUTRAL';
  }

  private async generateComment(citizen: any, post: BusinessNewsPost, sentiment: string): Promise<MarketCommentary> {
    const commentTemplates = {
      BULLISH: [
        "Great news! This could drive significant upside 📈",
        "Finally some positive momentum in this sector 🚀",
        "Been waiting for this catalyst. Time to add to positions 💪",
        "Strong fundamentals support this move higher 📊",
        "Market is finally recognizing the value here 💎"
      ],
      BEARISH: [
        "Concerning developments. Risk management is key 📉",
        "This could pressure margins going forward ⚠️",
        "Market seems to be overlooking the risks here 🚨",
        "Might be time to take some profits off the table 💰",
        "Headwinds are building in this space 🌪️"
      ],
      NEUTRAL: [
        "Interesting development. Need to see more data 🤔",
        "Mixed signals in the market right now 📊",
        "Waiting for more clarity before making moves ⏳",
        "Market reaction seems measured and appropriate 📈",
        "Good to see transparency from management 👍"
      ]
    };

    const templates = commentTemplates[sentiment] || commentTemplates.NEUTRAL;
    const content = templates[Math.floor(Math.random() * templates.length)];

    return {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId: post.id,
      authorId: `${citizen.type.toLowerCase()}_${Math.random().toString(36).substr(2, 6)}`,
      authorName: `${citizen.name} ${Math.floor(Math.random() * 999) + 1}`,
      authorType: citizen.type,
      content,
      timestamp: new Date(Date.now() + Math.random() * 3600000), // Random time in next hour
      sentiment,
      expertise: citizen.expertise
    };
  }

  // Get business news for Witter feed integration
  async getBusinessNewsForFeed(civilizationId: number, limit: number = 10): Promise<BusinessNewsPost[]> {
    return this.generateBusinessNews(civilizationId, limit);
  }

  // Get market commentary for a specific post
  async getMarketCommentaryForPost(postId: string, limit: number = 5): Promise<MarketCommentary[]> {
    // In a real implementation, this would fetch from database
    // For now, generate fresh commentary
    const mockPost: BusinessNewsPost = {
      id: postId,
      authorId: 'mock',
      authorName: 'Mock',
      authorType: 'MEDIA',
      authorAvatar: '📰',
      content: 'Mock business news post',
      timestamp: new Date(),
      metadata: {
        category: 'BUSINESS_NEWS',
        newsType: 'MARKET_UPDATE',
        marketImpact: 'POSITIVE'
      },
      metrics: { likes: 0, shares: 0, comments: 0 }
    };

    return this.generateMarketCommentary(mockPost, limit);
  }
}

let businessNewsService: BusinessNewsService;

export function initializeBusinessNewsService(pool: Pool): void {
  businessNewsService = new BusinessNewsService(pool);
  console.log('✅ Business News Service initialized');
}

export function getBusinessNewsService(): BusinessNewsService {
  if (!businessNewsService) {
    throw new Error('Business News Service not initialized');
  }
  return businessNewsService;
}

export default BusinessNewsService;
