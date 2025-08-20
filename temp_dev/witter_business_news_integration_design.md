# Witter Business News & Market Commentary Integration Design

## Overview
Design and implement comprehensive business news and market commentary integration for the Witter social media platform, creating realistic financial journalism and citizen market participation that responds to economic events, policy changes, and market movements.

## Core Integration Components

### **1. Official Media Business News System**

#### **News Agency Personas**
```typescript
interface NewsAgency {
  id: string;
  name: string; // "Financial Times", "Economic Herald", "Business Daily"
  type: 'financial' | 'general_business' | 'trade_publication' | 'government_economic';
  
  // Agency Characteristics
  characteristics: {
    credibility: number; // 0-100 reputation score
    bias: 'neutral' | 'pro_business' | 'pro_government' | 'populist';
    expertise: string[]; // ['markets', 'policy', 'corporate', 'international']
    audience: 'institutional' | 'retail' | 'general_public' | 'professional';
    updateFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  };
  
  // Content Style
  contentStyle: {
    tone: 'formal' | 'analytical' | 'accessible' | 'sensational';
    depth: 'headline' | 'summary' | 'detailed' | 'investigative';
    speed: 'breaking' | 'timely' | 'considered' | 'retrospective';
    focus: string[]; // ['earnings', 'policy', 'markets', 'trends']
  };
  
  // Witter Presence
  witterPresence: {
    handle: string; // @FinancialTimes, @EconomicHerald
    followers: number;
    verificationStatus: boolean;
    postingPattern: PostingPattern;
    engagementStyle: EngagementStyle;
  };
}
```

#### **Business News Categories**
```typescript
interface BusinessNewsCategory {
  // Market News
  marketNews: {
    dailyMarketSummary: MarketSummaryNews;
    sectorRotation: SectorNews;
    individualStocks: StockNews;
    bondMarketNews: BondNews;
    currencyNews: CurrencyNews;
    commodityNews: CommodityNews;
  };
  
  // Corporate News
  corporateNews: {
    earningsReports: EarningsNews;
    corporateAnnouncements: CorporateAnnouncementNews;
    mergerAcquisitions: MANews;
    executiveChanges: ExecutiveNews;
    productLaunches: ProductNews;
    corporateStrategy: StrategyNews;
  };
  
  // Economic Policy News
  policyNews: {
    centralBankNews: MonetaryPolicyNews;
    fiscalPolicyNews: FiscalPolicyNews;
    regulatoryNews: RegulatoryNews;
    tradeNews: TradeNews;
    taxPolicyNews: TaxNews;
    budgetNews: BudgetNews;
  };
  
  // Economic Indicators
  economicNews: {
    gdpReports: GDPNews;
    inflationReports: InflationNews;
    employmentReports: EmploymentNews;
    tradeBalanceNews: TradeNews;
    consumerConfidence: ConsumerNews;
    businessSentiment: BusinessSentimentNews;
  };
}
```

### **2. Citizen Market Commentary System**

#### **Investor Persona Types**
```typescript
interface InvestorPersona {
  id: string;
  type: 'retail_investor' | 'day_trader' | 'long_term_investor' | 'business_owner' | 'retiree' | 'young_professional';
  
  // Financial Profile
  financialProfile: {
    investmentExperience: 'novice' | 'intermediate' | 'experienced' | 'professional';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
    portfolioSize: 'small' | 'medium' | 'large' | 'institutional';
    investmentStyle: 'value' | 'growth' | 'income' | 'momentum' | 'contrarian';
    timeHorizon: 'short_term' | 'medium_term' | 'long_term' | 'retirement';
  };
  
  // Knowledge Level
  knowledgeLevel: {
    marketKnowledge: number; // 0-100 understanding of markets
    economicLiteracy: number; // 0-100 understanding of economics
    technicalAnalysis: number; // 0-100 chart reading ability
    fundamentalAnalysis: number; // 0-100 company analysis ability
    policyUnderstanding: number; // 0-100 policy impact comprehension
  };
  
  // Communication Style
  communicationStyle: {
    tone: 'optimistic' | 'pessimistic' | 'analytical' | 'emotional' | 'humorous';
    complexity: 'simple' | 'moderate' | 'complex' | 'technical';
    frequency: 'occasional' | 'regular' | 'frequent' | 'constant';
    reactiveness: 'immediate' | 'considered' | 'delayed' | 'contrarian';
  };
  
  // Interests and Focus
  interests: {
    sectors: string[]; // ['technology', 'healthcare', 'finance']
    companies: string[]; // Specific companies they follow
    economicIndicators: string[]; // ['inflation', 'employment', 'gdp']
    policyAreas: string[]; // ['monetary_policy', 'fiscal_policy', 'regulation']
  };
}
```

#### **Citizen Commentary Types**
```typescript
interface CitizenCommentaryType {
  // Market Reaction Posts
  marketReactions: {
    dailyMarketCommentary: string; // "Markets up again! My portfolio is finally recovering"
    stockSpecificCommentary: string; // "Why is $TECH down when they just beat earnings?"
    sectorCommentary: string; // "Defense stocks are on fire with the new budget"
    volatilityReactions: string; // "This market is crazy! Up 3% yesterday, down 2% today"
  };
  
  // Economic Impact Posts
  economicImpact: {
    inflationComplaints: string; // "Groceries cost 20% more than last year!"
    interestRateReactions: string; // "Great, higher rates mean my mortgage just went up"
    employmentCommentary: string; // "Job market is hot right now, got three offers"
    taxPolicyReactions: string; // "New tax policy is killing small businesses"
  };
  
  // Investment Strategy Posts
  investmentStrategy: {
    buyingOpportunities: string; // "This dip is a buying opportunity"
    sellingDecisions: string; // "Taking profits on my tech stocks"
    portfolioUpdates: string; // "Rebalancing into bonds with rates this high"
    investmentAdvice: string; // "Dollar cost averaging is the way to go"
  };
  
  // Company-Specific Posts
  companyCommentary: {
    earningsReactions: string; // "Blown away by $CORP's earnings beat"
    productLaunches: string; // "New product from $TECH looks amazing"
    executiveChanges: string; // "Not sure about the new CEO at $COMPANY"
    corporateStrategy: string; // "$CORP's acquisition makes no sense"
  };
}
```

### **3. News Generation Engine**

#### **Economic Event Triggers**
```typescript
interface NewsEventTrigger {
  // Market Movement Triggers
  marketTriggers: {
    significantMove: number; // >2% market move triggers news
    volumeSpike: number; // Unusual volume triggers coverage
    volatilitySpike: number; // High volatility triggers analysis
    sectorRotation: number; // Significant sector moves
  };
  
  // Economic Data Triggers
  economicTriggers: {
    gdpRelease: boolean; // GDP data release
    inflationData: boolean; // CPI/PPI release
    employmentData: boolean; // Jobs report
    centralBankMeeting: boolean; // Policy announcements
  };
  
  // Policy Event Triggers
  policyTriggers: {
    budgetAnnouncement: boolean; // Government budget
    taxPolicyChange: boolean; // Tax rate changes
    regulatoryChanges: boolean; // New regulations
    tradePolicy: boolean; // Trade agreements/disputes
  };
  
  // Corporate Event Triggers
  corporateTriggers: {
    earningsRelease: boolean; // Quarterly earnings
    corporateAnnouncements: boolean; // Major announcements
    executiveChanges: boolean; // Leadership changes
    mergerActivity: boolean; // M&A activity
  };
}
```

#### **News Content Generation**
```typescript
class BusinessNewsGenerator {
  // Market News Generation
  async generateMarketNews(marketData: MarketData, triggers: MarketTrigger[]): Promise<NewsPost[]> {
    const posts = [];
    
    // Daily market summary
    if (this.isMarketClose()) {
      posts.push(await this.generateMarketSummary(marketData));
    }
    
    // Significant moves
    for (const trigger of triggers) {
      if (trigger.significance > 0.7) {
        posts.push(await this.generateSignificantMoveNews(trigger, marketData));
      }
    }
    
    // Sector analysis
    const sectorRotation = this.analyzeSectorRotation(marketData);
    if (sectorRotation.significance > 0.5) {
      posts.push(await this.generateSectorNews(sectorRotation));
    }
    
    return posts;
  }
  
  // Corporate News Generation
  async generateCorporateNews(corporateEvents: CorporateEvent[]): Promise<NewsPost[]> {
    const posts = [];
    
    for (const event of corporateEvents) {
      switch (event.type) {
        case 'earnings':
          posts.push(await this.generateEarningsNews(event));
          break;
        case 'announcement':
          posts.push(await this.generateAnnouncementNews(event));
          break;
        case 'executive_change':
          posts.push(await this.generateExecutiveNews(event));
          break;
      }
    }
    
    return posts;
  }
  
  // Policy News Generation
  async generatePolicyNews(policyEvents: PolicyEvent[]): Promise<NewsPost[]> {
    const posts = [];
    
    for (const event of policyEvents) {
      // Generate official policy news
      posts.push(await this.generateOfficialPolicyNews(event));
      
      // Generate market impact analysis
      const marketImpact = await this.analyzePolicyMarketImpact(event);
      posts.push(await this.generatePolicyImpactNews(event, marketImpact));
      
      // Generate sector-specific analysis
      const sectorImpacts = await this.analyzePolicySectorImpacts(event);
      for (const impact of sectorImpacts) {
        if (impact.significance > 0.6) {
          posts.push(await this.generateSectorPolicyNews(event, impact));
        }
      }
    }
    
    return posts;
  }
}
```

### **4. Citizen Commentary Generation**

#### **Market Reaction Commentary**
```typescript
class CitizenMarketCommentary {
  // Generate market reaction posts
  async generateMarketReactionPosts(
    marketData: MarketData,
    personas: InvestorPersona[]
  ): Promise<WitterPost[]> {
    const posts = [];
    
    for (const persona of personas) {
      // Daily market reactions
      if (Math.abs(marketData.dailyChange) > 1) {
        posts.push(await this.generateMarketReactionPost(persona, marketData));
      }
      
      // Portfolio impact posts
      if (this.shouldPostPortfolioUpdate(persona, marketData)) {
        posts.push(await this.generatePortfolioUpdatePost(persona, marketData));
      }
      
      // Sector-specific commentary
      const sectorInterests = this.getPersonaSectorInterests(persona);
      for (const sector of sectorInterests) {
        const sectorData = marketData.sectors[sector];
        if (Math.abs(sectorData.change) > 2) {
          posts.push(await this.generateSectorCommentaryPost(persona, sector, sectorData));
        }
      }
    }
    
    return posts;
  }
  
  // Generate company-specific commentary
  async generateCompanyCommentary(
    companyEvents: CompanyEvent[],
    personas: InvestorPersona[]
  ): Promise<WitterPost[]> {
    const posts = [];
    
    for (const event of companyEvents) {
      // Find personas interested in this company
      const interestedPersonas = personas.filter(p => 
        p.interests.companies.includes(event.companyId) ||
        p.interests.sectors.includes(event.sector)
      );
      
      for (const persona of interestedPersonas) {
        posts.push(await this.generateCompanyEventPost(persona, event));
      }
    }
    
    return posts;
  }
  
  // Generate economic impact commentary
  async generateEconomicImpactPosts(
    economicData: EconomicData,
    personas: InvestorPersona[]
  ): Promise<WitterPost[]> {
    const posts = [];
    
    // Inflation impact posts
    if (economicData.inflationRate > 3) {
      const affectedPersonas = personas.filter(p => 
        p.type === 'retiree' || p.type === 'business_owner'
      );
      
      for (const persona of affectedPersonas) {
        posts.push(await this.generateInflationImpactPost(persona, economicData.inflationRate));
      }
    }
    
    // Interest rate impact posts
    if (economicData.interestRateChange !== 0) {
      const affectedPersonas = personas.filter(p => 
        p.financialProfile.portfolioSize === 'large' || 
        p.type === 'business_owner'
      );
      
      for (const persona of affectedPersonas) {
        posts.push(await this.generateInterestRatePost(persona, economicData.interestRateChange));
      }
    }
    
    return posts;
  }
}
```

## Integration Architecture

### **1. Witter Service Enhancement**

#### **Enhanced Witter Service**
```typescript
class EnhancedWitterService extends WitterService {
  private businessNewsGenerator: BusinessNewsGenerator;
  private citizenCommentaryGenerator: CitizenMarketCommentary;
  private newsAgencies: NewsAgency[];
  private investorPersonas: InvestorPersona[];
  
  // Business news integration
  async generateBusinessNews(economicEvents: EconomicEvent[]): Promise<WitterPost[]> {
    const posts = [];
    
    // Official news agency posts
    for (const agency of this.newsAgencies) {
      const agencyPosts = await this.businessNewsGenerator.generateNewsForAgency(
        agency,
        economicEvents
      );
      posts.push(...agencyPosts);
    }
    
    // Citizen commentary posts
    const citizenPosts = await this.citizenCommentaryGenerator.generateCommentary(
      economicEvents,
      this.investorPersonas
    );
    posts.push(...citizenPosts);
    
    return posts;
  }
  
  // Market-specific content generation
  async generateMarketContent(marketData: MarketData): Promise<WitterPost[]> {
    const posts = [];
    
    // Breaking market news
    if (this.isSignificantMarketMove(marketData)) {
      posts.push(...await this.generateBreakingMarketNews(marketData));
    }
    
    // Market close summary
    if (this.isMarketClose()) {
      posts.push(...await this.generateMarketCloseSummary(marketData));
    }
    
    // Citizen market reactions
    posts.push(...await this.generateCitizenMarketReactions(marketData));
    
    return posts;
  }
  
  // Company-specific content
  async generateCompanyContent(companyEvents: CompanyEvent[]): Promise<WitterPost[]> {
    const posts = [];
    
    for (const event of companyEvents) {
      // Official company news
      posts.push(...await this.generateOfficialCompanyNews(event));
      
      // Analyst commentary
      posts.push(...await this.generateAnalystCommentary(event));
      
      // Investor reactions
      posts.push(...await this.generateInvestorReactions(event));
    }
    
    return posts;
  }
}
```

### **2. Economic Event Integration**

#### **Event Monitoring System**
```typescript
class EconomicEventMonitor {
  // Monitor for business news triggers
  async monitorEconomicEvents(): Promise<EconomicEvent[]> {
    const events = [];
    
    // Market events
    const marketEvents = await this.checkMarketEvents();
    events.push(...marketEvents);
    
    // Policy events
    const policyEvents = await this.checkPolicyEvents();
    events.push(...policyEvents);
    
    // Corporate events
    const corporateEvents = await this.checkCorporateEvents();
    events.push(...corporateEvents);
    
    // Economic data releases
    const dataEvents = await this.checkEconomicDataReleases();
    events.push(...dataEvents);
    
    return events;
  }
  
  // Check for significant market movements
  private async checkMarketEvents(): Promise<MarketEvent[]> {
    const marketData = await this.getLatestMarketData();
    const events = [];
    
    // Significant index moves
    if (Math.abs(marketData.indexChange) > 2) {
      events.push({
        type: 'significant_market_move',
        data: marketData,
        significance: Math.abs(marketData.indexChange) / 10
      });
    }
    
    // Sector rotation
    const sectorRotation = this.detectSectorRotation(marketData);
    if (sectorRotation.significance > 0.5) {
      events.push({
        type: 'sector_rotation',
        data: sectorRotation,
        significance: sectorRotation.significance
      });
    }
    
    return events;
  }
}
```

### **3. Content Personalization**

#### **Persona-Based Content Generation**
```typescript
class PersonalizedContentGenerator {
  // Generate content based on persona characteristics
  generatePersonalizedPost(
    persona: InvestorPersona,
    event: EconomicEvent
  ): WitterPost {
    const content = this.generateContentForPersona(persona, event);
    const style = this.applyPersonaStyle(content, persona);
    const hashtags = this.generateRelevantHashtags(event, persona);
    
    return {
      authorId: persona.id,
      content: style.content,
      hashtags,
      timestamp: new Date(),
      engagement: this.predictEngagement(persona, event),
      sentiment: style.sentiment
    };
  }
  
  // Apply persona communication style
  private applyPersonaStyle(content: string, persona: InvestorPersona): StyledContent {
    let styledContent = content;
    
    // Apply tone
    switch (persona.communicationStyle.tone) {
      case 'optimistic':
        styledContent = this.addOptimisticTone(styledContent);
        break;
      case 'pessimistic':
        styledContent = this.addPessimisticTone(styledContent);
        break;
      case 'analytical':
        styledContent = this.addAnalyticalTone(styledContent);
        break;
      case 'emotional':
        styledContent = this.addEmotionalTone(styledContent);
        break;
    }
    
    // Apply complexity level
    styledContent = this.adjustComplexity(styledContent, persona.communicationStyle.complexity);
    
    return {
      content: styledContent,
      sentiment: this.calculateSentiment(styledContent)
    };
  }
}
```

## Implementation Plan

### **Phase 1: Core Infrastructure**
1. **Enhanced Witter Service** - Extend existing Witter with business news capabilities
2. **News Agency System** - Create official media outlet personas and content generation
3. **Investor Persona System** - Develop citizen investor profiles and commentary styles

### **Phase 2: Content Generation**
1. **Business News Generator** - Market, corporate, and policy news generation
2. **Citizen Commentary Generator** - Realistic investor and citizen market reactions
3. **Event Monitoring System** - Real-time economic event detection and triggering

### **Phase 3: Integration**
1. **Economic System Integration** - Connect with Treasury, Inflation, and Markets systems
2. **Real-time Updates** - Market hours, earnings seasons, policy announcement timing
3. **Personalization Engine** - Persona-based content customization

### **Phase 4: Advanced Features**
1. **Sentiment Analysis** - Track market sentiment through social media
2. **Trending Topics** - Business and market trending hashtags and discussions
3. **Influence Networks** - How news and commentary spread through the platform

## Expected Outcomes

### **Realistic Financial Ecosystem**
- **Official Business News** - Professional financial journalism covering all economic events
- **Citizen Market Participation** - Authentic investor voices with varying expertise levels
- **Market Sentiment Tracking** - Social media sentiment reflecting real market conditions
- **Economic Policy Discussion** - Public debate about fiscal and monetary policy decisions

### **Enhanced Narrative Depth**
- **Market Stories** - Financial news drives civilization economic narratives
- **Citizen Reactions** - Realistic public response to economic conditions and policies
- **Business Cycles** - Social media reflects economic booms, busts, and recoveries
- **Investment Culture** - Development of civilization-specific investment attitudes and behaviors

This comprehensive business news and market commentary system will create a realistic financial media ecosystem that enhances economic simulation depth while providing engaging social media content that reflects real market dynamics and citizen participation.
