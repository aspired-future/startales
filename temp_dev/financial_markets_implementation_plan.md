# Financial Markets System - Implementation Plan

## Overview
This document provides a detailed implementation roadmap for creating a comprehensive financial markets system including stock markets, bond markets (government and corporate), and multi-currency trading capabilities.

## Phase 1: Core Market Infrastructure (Foundation)

### **1.1 Database Schema Design**
**Files to Create:**
- `src/server/markets/marketsSchema.ts`
- `src/server/markets/stockMarketSchema.ts`
- `src/server/markets/bondMarketSchema.ts`

**Key Tables:**
```sql
-- Stock Market Tables
CREATE TABLE stock_markets (
  id VARCHAR(255) PRIMARY KEY,
  civilization_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  market_cap DECIMAL(20,2) DEFAULT 0,
  daily_volume DECIMAL(20,2) DEFAULT 0,
  volatility DECIMAL(5,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE market_indices (
  id VARCHAR(255) PRIMARY KEY,
  market_id VARCHAR(255) REFERENCES stock_markets(id),
  name VARCHAR(255) NOT NULL,
  current_value DECIMAL(10,2) NOT NULL,
  base_value DECIMAL(10,2) DEFAULT 100,
  daily_change DECIMAL(5,4) DEFAULT 0,
  constituents JSONB DEFAULT '[]',
  weights JSONB DEFAULT '{}'
);

CREATE TABLE stocks (
  id VARCHAR(255) PRIMARY KEY,
  market_id VARCHAR(255) REFERENCES stock_markets(id),
  company_id VARCHAR(255),
  symbol VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  current_price DECIMAL(10,4) NOT NULL,
  market_cap DECIMAL(20,2),
  volume DECIMAL(20,0) DEFAULT 0,
  fundamentals JSONB DEFAULT '{}',
  sentiment JSONB DEFAULT '{}'
);

-- Bond Market Tables
CREATE TABLE government_bonds (
  id VARCHAR(255) PRIMARY KEY,
  issuer_id VARCHAR(255) NOT NULL, -- Government/Treasury ID
  currency VARCHAR(10) NOT NULL,
  face_value DECIMAL(15,2) NOT NULL,
  coupon_rate DECIMAL(5,4) NOT NULL,
  maturity_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  bond_type VARCHAR(50),
  current_price DECIMAL(10,4),
  current_yield DECIMAL(5,4),
  credit_rating VARCHAR(10)
);

CREATE TABLE corporate_bonds (
  id VARCHAR(255) PRIMARY KEY,
  issuer_id VARCHAR(255) NOT NULL, -- Company ID
  currency VARCHAR(10) NOT NULL,
  face_value DECIMAL(15,2) NOT NULL,
  coupon_rate DECIMAL(5,4) NOT NULL,
  maturity_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  bond_type VARCHAR(50),
  seniority VARCHAR(20),
  current_price DECIMAL(10,4),
  current_yield DECIMAL(5,4),
  credit_spread DECIMAL(5,4),
  credit_rating VARCHAR(10)
);

-- Market Data Tables
CREATE TABLE market_data_history (
  id SERIAL PRIMARY KEY,
  security_id VARCHAR(255) NOT NULL,
  security_type VARCHAR(20) NOT NULL, -- 'stock', 'government_bond', 'corporate_bond'
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  open_price DECIMAL(10,4),
  high_price DECIMAL(10,4),
  low_price DECIMAL(10,4),
  close_price DECIMAL(10,4),
  volume DECIMAL(20,0),
  additional_data JSONB DEFAULT '{}'
);

-- Multi-Currency Support
CREATE TABLE currency_exchange_rates (
  id SERIAL PRIMARY KEY,
  base_currency VARCHAR(10) NOT NULL,
  quote_currency VARCHAR(10) NOT NULL,
  exchange_rate DECIMAL(10,6) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  volatility DECIMAL(5,4) DEFAULT 0
);
```

### **1.2 Core Service Layer**
**Files to Create:**
- `src/server/markets/StockMarketService.ts`
- `src/server/markets/BondMarketService.ts`
- `src/server/markets/MarketDataService.ts`
- `src/server/markets/CurrencyService.ts`

**Key Service Classes:**
```typescript
class StockMarketService {
  // Market Operations
  async createStockMarket(civilizationId: string, config: MarketConfig): Promise<StockMarket>;
  async getMarketData(marketId: string): Promise<MarketData>;
  async updateStockPrices(marketId: string, factors: EconomicFactors): Promise<void>;
  
  // Stock Operations
  async listStock(companyId: string, marketId: string, ipo: IPOData): Promise<Stock>;
  async updateStockFundamentals(stockId: string, financials: CompanyFinancials): Promise<void>;
  async calculateMarketIndices(marketId: string): Promise<MarketIndices>;
  
  // Trading Simulation
  async simulateTrading(marketId: string, volume: number, sentiment: MarketSentiment): Promise<TradingResult>;
}

class BondMarketService {
  // Government Bond Operations
  async issueGovernmentBond(issuerId: string, bondDetails: BondIssuance): Promise<GovernmentBond>;
  async updateGovernmentBondYields(factors: EconomicFactors): Promise<void>;
  async calculateYieldCurve(issuerId: string, currency: string): Promise<YieldCurve>;
  
  // Corporate Bond Operations
  async issueCorporateBond(companyId: string, bondDetails: BondIssuance): Promise<CorporateBond>;
  async updateCorporateBondSpreads(creditFactors: CreditFactors): Promise<void>;
  async assessCreditRisk(companyId: string): Promise<CreditAssessment>;
  
  // Multi-Currency Bonds
  async createForeignBond(issuerId: string, details: ForeignBondDetails): Promise<ForeignBond>;
  async calculateCurrencyHedgedReturns(bondId: string): Promise<HedgedReturns>;
}
```

### **1.3 API Routes**
**Files to Create:**
- `src/server/markets/stockMarketRoutes.ts`
- `src/server/markets/bondMarketRoutes.ts`
- `src/server/markets/marketDataRoutes.ts`

**Key API Endpoints:**
```typescript
// Stock Market APIs
GET /api/markets/stocks/:marketId - Get stock market overview
GET /api/markets/stocks/:marketId/indices - Get market indices
GET /api/markets/stocks/:marketId/stocks - List all stocks
GET /api/markets/stocks/stock/:stockId - Get individual stock data
POST /api/markets/stocks/:marketId/ipo - List new company (IPO)

// Bond Market APIs
GET /api/markets/bonds/government/:issuerId - Get government bonds
GET /api/markets/bonds/corporate/:issuerId - Get corporate bonds
GET /api/markets/bonds/yield-curve/:issuerId/:currency - Get yield curve
POST /api/markets/bonds/government/issue - Issue government bond
POST /api/markets/bonds/corporate/issue - Issue corporate bond

// Market Data APIs
GET /api/markets/data/:securityId/history - Get price history
GET /api/markets/data/:marketId/sentiment - Get market sentiment
GET /api/markets/data/currencies - Get exchange rates
POST /api/markets/data/update - Update market data (internal)
```

## Phase 2: Economic Integration (Market Dynamics)

### **2.1 Economic Factors Integration**
**Files to Create:**
- `src/server/markets/EconomicMarketIntegration.ts`
- `src/server/markets/MarketEffectsCalculator.ts`

**Key Integration Points:**
```typescript
class EconomicMarketIntegration {
  // GDP Growth Effects
  async applyGDPEffects(gdpGrowth: number, marketData: MarketData): Promise<MarketData> {
    // Stock market effects
    const stockMultiplier = this.calculateGDPStockMultiplier(gdpGrowth);
    await this.updateStockPrices(marketData.stocks, stockMultiplier);
    
    // Bond market effects
    const yieldAdjustment = this.calculateGDPYieldEffect(gdpGrowth);
    await this.updateBondYields(marketData.bonds, yieldAdjustment);
    
    return marketData;
  }
  
  // Corporate Profitability Effects
  async applyCorporateEarnings(earnings: EarningsData[], marketData: MarketData): Promise<void> {
    for (const earning of earnings) {
      const priceEffect = this.calculateEarningsEffect(earning);
      await this.updateStockPrice(earning.companyId, priceEffect);
      
      // Update corporate bond spreads based on improved financials
      const spreadEffect = this.calculateCreditSpreadEffect(earning);
      await this.updateCorporateBondSpread(earning.companyId, spreadEffect);
    }
  }
  
  // Central Bank Policy Effects
  async applyCentralBankPolicy(policyChange: PolicyChange, markets: FinancialMarkets): Promise<void> {
    // Interest rate effects on bonds
    const bondPriceEffect = this.calculateInterestRateEffect(policyChange.rateChange);
    await this.updateAllBondPrices(markets.bonds, bondPriceEffect);
    
    // Stock market effects (discount rate changes)
    const stockValuationEffect = this.calculateDiscountRateEffect(policyChange.rateChange);
    await this.updateStockValuations(markets.stocks, stockValuationEffect);
    
    // Currency effects
    const currencyEffect = this.calculateCurrencyEffect(policyChange);
    await this.updateExchangeRates(currencyEffect);
  }
  
  // Fiscal Policy Effects
  async applyFiscalPolicy(fiscalChange: FiscalChange, markets: FinancialMarkets): Promise<void> {
    // Government spending effects on specific sectors
    const sectorEffects = this.calculateSectoralEffects(fiscalChange.spending);
    await this.applySectoralEffects(markets.stocks, sectorEffects);
    
    // Government debt issuance effects
    const bondSupplyEffect = this.calculateBondSupplyEffect(fiscalChange.deficit);
    await this.updateGovernmentBondYields(bondSupplyEffect);
    
    // Tax policy effects on corporate earnings
    const taxEffects = this.calculateTaxEffects(fiscalChange.taxes);
    await this.updateCorporateValuations(markets.stocks, taxEffects);
  }
  
  // Inflation Effects
  async applyInflationEffects(inflationRate: number, markets: FinancialMarkets): Promise<void> {
    // Real yield adjustments for bonds
    const realYieldEffect = this.calculateRealYieldEffect(inflationRate);
    await this.updateBondRealYields(markets.bonds, realYieldEffect);
    
    // Stock valuation effects (discount rate changes)
    const valuationEffect = this.calculateInflationValuationEffect(inflationRate);
    await this.updateStockValuations(markets.stocks, valuationEffect);
    
    // Sectoral rotation effects
    const sectorRotation = this.calculateInflationSectorEffects(inflationRate);
    await this.applySectorRotation(markets.stocks, sectorRotation);
  }
}
```

### **2.2 Market Sentiment Integration**
**Files to Create:**
- `src/server/markets/MarketSentimentService.ts`
- `src/server/markets/SentimentAnalyzer.ts`

**Key Components:**
```typescript
class MarketSentimentService {
  // News Sentiment Analysis
  async analyzeNewsSentiment(newsEvents: NewsEvent[]): Promise<SentimentScore> {
    const economicNews = newsEvents.filter(n => n.category === 'economic');
    const corporateNews = newsEvents.filter(n => n.category === 'corporate');
    const politicalNews = newsEvents.filter(n => n.category === 'political');
    
    return {
      economic: this.calculateNewsSentiment(economicNews),
      corporate: this.calculateNewsSentiment(corporateNews),
      political: this.calculateNewsSentiment(politicalNews),
      overall: this.calculateOverallSentiment([economicNews, corporateNews, politicalNews])
    };
  }
  
  // Social Media Sentiment
  async analyzeSocialMediaSentiment(posts: SocialMediaPost[]): Promise<SocialSentiment> {
    const marketPosts = posts.filter(p => p.tags.includes('market') || p.tags.includes('economy'));
    
    return {
      bullishPercentage: this.calculateBullishPercentage(marketPosts),
      fearGreedIndex: this.calculateFearGreedIndex(marketPosts),
      volumeWeightedSentiment: this.calculateVolumeWeightedSentiment(marketPosts)
    };
  }
  
  // Technical Sentiment Indicators
  async calculateTechnicalSentiment(marketData: MarketData): Promise<TechnicalSentiment> {
    return {
      marketBreadth: this.calculateMarketBreadth(marketData.stocks),
      volumeAnalysis: this.analyzeVolumePatterns(marketData.volume),
      momentumIndicators: this.calculateMomentum(marketData.priceHistory),
      volatilityIndex: this.calculateVolatilityIndex(marketData.priceHistory)
    };
  }
}
```

## Phase 3: Advanced Market Features

### **3.1 Multi-Currency Trading System**
**Files to Create:**
- `src/server/markets/MultiCurrencyService.ts`
- `src/server/markets/CurrencyHedgingService.ts`
- `src/server/markets/ForeignBondService.ts`

**Key Features:**
```typescript
class MultiCurrencyService {
  // Foreign Government Bonds
  async createForeignGovernmentBond(
    issuingCountry: string,
    denominatedCurrency: string,
    tradingCurrency: string,
    bondDetails: BondDetails
  ): Promise<ForeignGovernmentBond> {
    const bond = await this.createBond(bondDetails);
    
    // Calculate currency-adjusted metrics
    const currencyAdjusted = await this.calculateCurrencyAdjustedMetrics(
      bond,
      denominatedCurrency,
      tradingCurrency
    );
    
    return { ...bond, currencyAdjusted };
  }
  
  // Currency Hedging
  async createCurrencyHedge(
    bondId: string,
    hedgeRatio: number,
    hedgeInstrument: HedgeInstrument
  ): Promise<CurrencyHedge> {
    const hedge = {
      bondId,
      hedgeRatio,
      instrument: hedgeInstrument,
      cost: await this.calculateHedgeCost(hedgeInstrument),
      effectiveness: await this.calculateHedgeEffectiveness(hedgeInstrument)
    };
    
    await this.storeCurrencyHedge(hedge);
    return hedge;
  }
  
  // Cross-Currency Arbitrage Detection
  async detectArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
    const opportunities = [];
    
    // Check government bond yield differentials
    const yieldDifferentials = await this.calculateYieldDifferentials();
    
    // Adjust for currency risk and transaction costs
    const riskAdjustedOpportunities = this.adjustForRisk(yieldDifferentials);
    
    return riskAdjustedOpportunities.filter(opp => opp.expectedReturn > 0);
  }
}
```

### **3.2 Risk Management System**
**Files to Create:**
- `src/server/markets/RiskManagementService.ts`
- `src/server/markets/SystemicRiskMonitor.ts`
- `src/server/markets/StressTestingService.ts`

**Key Components:**
```typescript
class SystemicRiskMonitor {
  // Market Risk Monitoring
  async monitorMarketRisk(): Promise<MarketRiskAssessment> {
    const volatilitySpikes = await this.detectVolatilitySpikes();
    const correlationBreakdown = await this.analyzeCorrelationBreakdown();
    const liquidityDrought = await this.assessLiquidityConditions();
    
    return {
      riskLevel: this.calculateOverallRiskLevel([volatilitySpikes, correlationBreakdown, liquidityDrought]),
      specificRisks: { volatilitySpikes, correlationBreakdown, liquidityDrought },
      recommendations: this.generateRiskRecommendations()
    };
  }
  
  // Credit Risk Assessment
  async assessCreditRisk(): Promise<CreditRiskAssessment> {
    const corporateDefaults = await this.calculateDefaultProbabilities();
    const sovereignRisk = await this.assessSovereignRisk();
    const contagionRisk = await this.analyzeContagionRisk();
    
    return {
      overallCreditHealth: this.calculateCreditHealth([corporateDefaults, sovereignRisk]),
      sectoralRisks: await this.calculateSectoralCreditRisks(),
      contagionProbability: contagionRisk,
      earlyWarningIndicators: await this.getEarlyWarningIndicators()
    };
  }
  
  // Stress Testing
  async runStressTest(scenario: StressScenario): Promise<StressTestResult> {
    // Apply stress scenario to all markets
    const stressedMarkets = await this.applyStressScenario(scenario);
    
    // Calculate losses and impacts
    const portfolioLosses = await this.calculatePortfolioLosses(stressedMarkets);
    const systemicImpact = await this.assessSystemicImpact(stressedMarkets);
    
    return {
      scenario,
      portfolioLosses,
      systemicImpact,
      recoveryTime: this.estimateRecoveryTime(stressedMarkets),
      mitigationStrategies: this.suggestMitigationStrategies(stressedMarkets)
    };
  }
}
```

## Phase 4: Natural Language Integration

### **4.1 Financial News Generation**
**Files to Create:**
- `src/server/markets/FinancialNewsGenerator.ts`
- `src/server/markets/MarketCommentaryService.ts`

**Key Features:**
```typescript
class FinancialNewsGenerator {
  // Market Movement News
  async generateMarketNews(marketChanges: MarketChange[]): Promise<NewsStory[]> {
    const stories = [];
    
    for (const change of marketChanges) {
      if (Math.abs(change.percentChange) > 2) { // Significant moves
        const story = await this.createMarketMoveStory(change);
        stories.push(story);
      }
    }
    
    // Generate sector rotation stories
    const sectorRotation = this.analyzeSectorRotation(marketChanges);
    if (sectorRotation.significance > 0.5) {
      stories.push(await this.createSectorRotationStory(sectorRotation));
    }
    
    return stories;
  }
  
  // Economic Policy Impact News
  async generatePolicyImpactNews(
    policyChange: PolicyChange,
    marketReaction: MarketReaction
  ): Promise<NewsStory[]> {
    const stories = [];
    
    // Central bank policy news
    if (policyChange.type === 'monetary') {
      stories.push(await this.createMonetaryPolicyStory(policyChange, marketReaction));
    }
    
    // Fiscal policy news
    if (policyChange.type === 'fiscal') {
      stories.push(await this.createFiscalPolicyStory(policyChange, marketReaction));
    }
    
    return stories;
  }
  
  // Corporate Earnings News
  async generateEarningsNews(
    earnings: EarningsReport[],
    marketReactions: StockReaction[]
  ): Promise<NewsStory[]> {
    const stories = [];
    
    // Individual company earnings
    for (const earning of earnings) {
      const reaction = marketReactions.find(r => r.companyId === earning.companyId);
      if (reaction && Math.abs(reaction.priceChange) > 5) {
        stories.push(await this.createEarningsStory(earning, reaction));
      }
    }
    
    // Sector earnings trends
    const sectorTrends = this.analyzeSectorEarningsTrends(earnings);
    for (const trend of sectorTrends) {
      if (trend.significance > 0.7) {
        stories.push(await this.createSectorEarningsStory(trend));
      }
    }
    
    return stories;
  }
}
```

### **4.2 Social Media Market Integration**
**Files to Create:**
- `src/server/markets/MarketSocialMediaService.ts`
- `src/server/markets/InvestorSentimentGenerator.ts`

**Integration Points:**
```typescript
class MarketSocialMediaService {
  // Generate Investor Posts
  async generateInvestorPosts(marketPerformance: MarketPerformance): Promise<SocialMediaPost[]> {
    const posts = [];
    
    // Bull market posts
    if (marketPerformance.trend === 'bullish') {
      posts.push(...await this.generateBullishPosts(marketPerformance));
    }
    
    // Bear market posts
    if (marketPerformance.trend === 'bearish') {
      posts.push(...await this.generateBearishPosts(marketPerformance));
    }
    
    // Volatility posts
    if (marketPerformance.volatility > 0.3) {
      posts.push(...await this.generateVolatilityPosts(marketPerformance));
    }
    
    return posts;
  }
  
  // Economic Commentary Posts
  async generateEconomicCommentary(economicData: EconomicData): Promise<SocialMediaPost[]> {
    const posts = [];
    
    // GDP growth commentary
    if (economicData.gdpGrowth !== null) {
      posts.push(await this.createGDPCommentary(economicData.gdpGrowth));
    }
    
    // Inflation commentary
    if (economicData.inflationRate !== null) {
      posts.push(await this.createInflationCommentary(economicData.inflationRate));
    }
    
    // Employment commentary
    if (economicData.unemploymentRate !== null) {
      posts.push(await this.createEmploymentCommentary(economicData.unemploymentRate));
    }
    
    return posts;
  }
}
```

## Phase 5: Demo and Analytics

### **5.1 Financial Markets Demo**
**Files to Create:**
- `src/demo/financial-markets.ts`

**Demo Features:**
- Real-time market data display
- Interactive trading simulation
- Economic factor impact visualization
- Multi-currency bond trading interface
- Risk management dashboard

### **5.2 Analytics Integration**
**Files to Modify:**
- `src/server/analytics/analyticsService.ts` - Add financial market metrics

**New Metrics:**
```typescript
interface FinancialMarketMetrics {
  stockMarket: {
    marketCapitalization: number;
    dailyVolume: number;
    volatilityIndex: number;
    marketBreadth: number;
    sectorPerformance: Record<string, number>;
  };
  
  bondMarket: {
    governmentYieldCurve: YieldCurve;
    corporateBondSpreads: Record<string, number>;
    bondMarketSize: number;
    creditQuality: CreditQualityDistribution;
  };
  
  currencyMarkets: {
    exchangeRateVolatility: Record<string, number>;
    foreignInvestmentFlows: number;
    currencyStrength: number;
  };
  
  riskMetrics: {
    systemicRiskLevel: number;
    marketStressIndicators: StressIndicator[];
    creditRiskDistribution: CreditRiskDistribution;
  };
}
```

## Integration Timeline

### **Month 1: Foundation (Phase 1)**
- Database schema design and implementation
- Core service layer development
- Basic API endpoints
- Initial market data structures

### **Month 2: Economic Integration (Phase 2)**
- GDP, inflation, and policy integration
- Corporate earnings integration
- Market sentiment analysis
- Basic price discovery mechanisms

### **Month 3: Advanced Features (Phase 3)**
- Multi-currency trading system
- Risk management implementation
- Stress testing capabilities
- Advanced market microstructure

### **Month 4: Natural Language & Analytics (Phases 4-5)**
- Financial news generation
- Social media integration
- Demo interface development
- Analytics dashboard integration

## Success Metrics

### **Technical Metrics**
- Market prices respond realistically to economic factors
- Multi-currency trading functions correctly
- Risk management systems detect systemic risks
- Natural language generation reflects market conditions

### **Gameplay Metrics**
- Players understand market reactions to their policies
- Economic decisions have clear market consequences
- Financial markets enhance strategic depth
- Market narratives enrich civilization storytelling

This comprehensive implementation plan will create a sophisticated financial markets system that enhances both economic realism and narrative depth while providing strategic gameplay elements around financial market dynamics.
