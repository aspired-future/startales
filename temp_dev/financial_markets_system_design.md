# Comprehensive Financial Markets System Design

## Overview
Design and implement a realistic financial markets system including stock markets, corporate bond markets, and government bond markets that respond dynamically to economic conditions, policy decisions, and market sentiment. The system supports multi-currency trading and integrates with all economic simulation components.

## Core Market Components

### **1. Stock Market System**

#### **Stock Market Structure**
```typescript
interface StockMarket {
  id: string;
  civilizationId: string;
  name: string; // e.g., "New York Stock Exchange", "London Stock Exchange"
  currency: string;
  
  // Market Indices
  indices: {
    overall: MarketIndex; // Main market index (e.g., S&P 500 equivalent)
    sectors: Record<string, MarketIndex>; // Technology, Finance, Energy, etc.
    smallCap: MarketIndex; // Small company index
    largeCap: MarketIndex; // Large company index
  };
  
  // Market Characteristics
  characteristics: {
    marketCapitalization: number; // Total market value
    dailyVolume: number; // Trading volume
    volatility: number; // Market volatility index
    liquidity: number; // Market liquidity measure
    internationalAccess: boolean; // Foreign investor access
  };
  
  // Trading Sessions
  tradingSessions: {
    preMarket: TradingSession;
    regular: TradingSession;
    afterHours: TradingSession;
  };
  
  // Market Makers and Participants
  participants: {
    institutionalInvestors: number; // Pension funds, insurance companies
    retailInvestors: number; // Individual investors
    foreignInvestors: number; // International participation
    algorithmicTrading: number; // Automated trading percentage
  };
}

interface MarketIndex {
  id: string;
  name: string;
  value: number; // Current index value
  baseValue: number; // Starting value (e.g., 100 or 1000)
  constituents: string[]; // Company IDs in the index
  weights: Record<string, number>; // Company weightings
  
  // Performance Metrics
  performance: {
    dailyChange: number; // Percentage change today
    weeklyChange: number; // 7-day performance
    monthlyChange: number; // 30-day performance
    yearlyChange: number; // 365-day performance
    allTimeHigh: number;
    allTimeLow: number;
  };
  
  // Market Metrics
  metrics: {
    priceToEarnings: number; // P/E ratio
    dividendYield: number; // Average dividend yield
    marketBreadth: number; // Percentage of stocks advancing
    volatilityIndex: number; // Fear/greed indicator
  };
}
```

#### **Individual Stock System**
```typescript
interface Stock {
  id: string;
  companyId: string;
  symbol: string; // Trading symbol (e.g., "AAPL", "GOOGL")
  companyName: string;
  sector: string; // Technology, Healthcare, Finance, etc.
  
  // Current Trading Data
  trading: {
    currentPrice: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    marketCap: number;
  };
  
  // Financial Metrics
  fundamentals: {
    earnings: number; // Annual earnings
    revenue: number; // Annual revenue
    bookValue: number; // Book value per share
    dividendYield: number; // Annual dividend yield
    peRatio: number; // Price-to-earnings ratio
    debtToEquity: number; // Debt-to-equity ratio
    returnOnEquity: number; // ROE percentage
  };
  
  // Market Sentiment
  sentiment: {
    analystRating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    institutionalOwnership: number; // Percentage owned by institutions
    shortInterest: number; // Percentage of shares sold short
    socialSentiment: number; // Social media sentiment score
  };
  
  // Corporate Actions
  corporateActions: {
    dividends: DividendPayment[];
    stockSplits: StockSplit[];
    earnings: EarningsReport[];
    announcements: CorporateAnnouncement[];
  };
}
```

### **2. Bond Market System**

#### **Government Bond Market**
```typescript
interface GovernmentBond {
  id: string;
  issuerId: string; // Government/Treasury ID
  currency: string;
  
  // Bond Characteristics
  characteristics: {
    faceValue: number; // Par value
    couponRate: number; // Annual interest rate
    maturity: Date; // Maturity date
    issueDate: Date;
    bondType: 'treasury_bill' | 'treasury_note' | 'treasury_bond' | 'inflation_protected';
  };
  
  // Current Market Data
  market: {
    currentPrice: number; // Market price
    yield: number; // Current yield to maturity
    duration: number; // Price sensitivity to interest rates
    convexity: number; // Second-order price sensitivity
    spread: number; // Spread over benchmark
  };
  
  // Credit Information
  credit: {
    rating: string; // AAA, AA+, etc.
    ratingAgency: string;
    defaultProbability: number; // Probability of default
    recoveryRate: number; // Expected recovery if default
  };
  
  // Market Dynamics
  dynamics: {
    tradingVolume: number;
    bidAskSpread: number;
    liquidity: number; // Ease of trading
    foreignOwnership: number; // International investor percentage
  };
}
```

#### **Corporate Bond Market**
```typescript
interface CorporateBond {
  id: string;
  issuerId: string; // Company ID
  currency: string;
  
  // Bond Characteristics
  characteristics: {
    faceValue: number;
    couponRate: number;
    maturity: Date;
    issueDate: Date;
    bondType: 'investment_grade' | 'high_yield' | 'convertible' | 'callable';
    seniority: 'senior' | 'subordinated' | 'junior';
  };
  
  // Current Market Data
  market: {
    currentPrice: number;
    yield: number;
    creditSpread: number; // Spread over government bonds
    duration: number;
    convexity: number;
  };
  
  // Credit Analysis
  credit: {
    rating: string; // Investment grade: AAA-BBB, High yield: BB-D
    ratingAgency: string;
    defaultProbability: number;
    recoveryRate: number;
    creditSpreadHistory: number[];
  };
  
  // Issuer Information
  issuer: {
    companyFinancials: CompanyFinancials;
    industryRisk: number;
    businessRisk: number;
    financialRisk: number;
  };
}
```

### **3. Multi-Currency Trading System**

#### **Currency Integration**
```typescript
interface MultiCurrencyMarket {
  baseCurrency: string; // Home currency
  supportedCurrencies: string[]; // All tradeable currencies
  
  // Cross-Currency Trading
  crossCurrencyBonds: {
    foreignGovernmentBonds: ForeignGovernmentBond[];
    eurobonds: Eurobond[]; // Bonds issued in foreign currency
    currencyHedging: CurrencyHedge[];
  };
  
  // Exchange Rate Integration
  exchangeRates: {
    spotRates: Record<string, number>; // Current exchange rates
    forwardRates: Record<string, number>; // Future exchange rates
    volatility: Record<string, number>; // Currency volatility
  };
  
  // Currency Risk Management
  riskManagement: {
    hedgingInstruments: HedgingInstrument[];
    currencyExposure: Record<string, number>;
    hedgeRatios: Record<string, number>;
  };
}

interface ForeignGovernmentBond {
  id: string;
  issuingCountry: string;
  denominatedCurrency: string;
  tradingCurrency: string;
  
  // Currency-Adjusted Metrics
  currencyAdjusted: {
    localYield: number; // Yield in local currency
    hedgedYield: number; // Currency-hedged yield
    unhedgedReturn: number; // Total return including FX
    currencyRisk: number; // FX volatility component
  };
}
```

## Market Dynamics & Economic Integration

### **1. Economic Factor Integration**

#### **GDP Growth Impact**
```typescript
interface GDPMarketEffects {
  stockMarketImpact: {
    overallMarketMultiplier: number; // GDP growth -> market performance
    sectoralEffects: Record<string, number>; // Different sectors react differently
    earningsGrowthExpectation: number; // Expected corporate earnings growth
    valuationMultiples: number; // P/E ratio adjustments
  };
  
  bondMarketImpact: {
    governmentBondYields: number; // Growth -> higher yields
    corporateBondSpreads: number; // Growth -> tighter spreads
    inflationExpectations: number; // Growth -> inflation concerns
    creditQuality: number; // Growth -> improved credit metrics
  };
}
```

#### **Corporate Profitability Integration**
```typescript
interface ProfitabilityMarketEffects {
  // Individual Stock Effects
  stockPriceImpact: {
    earningsMultiplier: number; // Earnings -> stock price
    revenueGrowthImpact: number; // Revenue growth -> valuation
    marginImprovementEffect: number; // Profit margins -> premium
    guidanceEffect: number; // Forward guidance -> sentiment
  };
  
  // Sector-Wide Effects
  sectorEffects: {
    sectorRotation: Record<string, number>; // Money flows between sectors
    relativeValuations: Record<string, number>; // Sector P/E ratios
    dividendPolicy: Record<string, number>; // Dividend sustainability
  };
  
  // Bond Market Effects
  corporateBondImpact: {
    creditSpreadTightening: number; // Better profits -> lower spreads
    refinancingCapacity: number; // Ability to refinance debt
    defaultProbabilityReduction: number; // Lower default risk
  };
}
```

#### **Central Bank Policy Integration**
```typescript
interface CentralBankMarketEffects {
  // Interest Rate Effects
  interestRateImpact: {
    bondPriceInverse: number; // Rate up -> bond price down
    yieldCurveShift: number; // Parallel or non-parallel shifts
    creditSpreadEffects: number; // Risk-on/risk-off behavior
    currencyStrengthening: number; // Higher rates -> stronger currency
  };
  
  // Stock Market Effects
  equityMarketImpact: {
    discountRateEffect: number; // Higher rates -> lower valuations
    sectorRotation: Record<string, number>; // Rate-sensitive sectors
    dividendStockImpact: number; // Competition with bonds
    growthVsValueRotation: number; // Style rotation effects
  };
  
  // Quantitative Easing Effects
  qeEffects: {
    bondPurchaseImpact: number; // Direct bond buying
    portfolioRebalancing: number; // Investors buy riskier assets
    liquidityInjection: number; // More money chasing assets
    currencyWeakening: number; // Money printing -> currency decline
  };
}
```

#### **Fiscal Policy Integration**
```typescript
interface FiscalPolicyMarketEffects {
  // Government Spending Effects
  spendingImpact: {
    infrastructureStocks: number; // Infrastructure spending -> construction stocks
    defenseStocks: number; // Military spending -> defense contractors
    socialSpending: number; // Healthcare/education spending effects
    fiscalMultiplier: number; // Overall economic stimulus effect
  };
  
  // Tax Policy Effects
  taxPolicyImpact: {
    corporateTaxEffects: number; // Corporate tax -> after-tax earnings
    capitalGainsTaxEffects: number; // Investment behavior changes
    dividendTaxEffects: number; // Dividend policy adjustments
    repatriationEffects: number; // International tax policy
  };
  
  // Government Debt Effects
  debtImpact: {
    bondSupplyIncrease: number; // More issuance -> higher yields
    crowdingOutEffect: number; // Government borrowing -> private investment
    creditRatingRisk: number; // Debt levels -> sovereign rating
    currencyRisk: number; // Fiscal sustainability concerns
  };
}
```

### **2. Market Sentiment Integration**

#### **Sentiment Calculation System**
```typescript
interface MarketSentiment {
  // Aggregate Sentiment Measures
  overallSentiment: {
    bullishPercentage: number; // Percentage of bullish investors
    fearGreedIndex: number; // 0-100 fear to greed scale
    volatilityIndex: number; // Market volatility (VIX equivalent)
    putCallRatio: number; // Options sentiment indicator
  };
  
  // News and Social Media Sentiment
  newsSentiment: {
    economicNewsScore: number; // Economic news sentiment
    corporateNewsScore: number; // Company-specific news
    politicalNewsScore: number; // Political stability news
    internationalNewsScore: number; // Global events impact
  };
  
  // Technical Indicators
  technicalSentiment: {
    marketBreadth: number; // Advancing vs. declining stocks
    volumeAnalysis: number; // Volume patterns
    momentumIndicators: number; // Price momentum
    supportResistanceLevels: number; // Technical analysis
  };
  
  // Behavioral Finance Factors
  behavioralFactors: {
    herding: number; // Following the crowd
    overconfidence: number; // Excessive optimism/pessimism
    lossAversion: number; // Fear of losses
    recencyBias: number; // Overweighting recent events
  };
}
```

### **3. Inflation Integration**

#### **Inflation Market Effects**
```typescript
interface InflationMarketEffects {
  // Bond Market Effects
  bondMarketImpact: {
    realYieldAdjustment: number; // Nominal yield - inflation
    inflationProtectedBonds: number; // TIPS performance
    yieldCurveFlattening: number; // Long-term inflation expectations
    creditSpreadWidening: number; // Inflation -> credit concerns
  };
  
  // Stock Market Effects
  equityMarketImpact: {
    valuationCompression: number; // Higher discount rates
    sectoralRotation: Record<string, number>; // Inflation beneficiaries vs. victims
    pricingPowerStocks: number; // Companies that can raise prices
    commodityStocks: number; // Resource companies benefit
  };
  
  // Currency Effects
  currencyImpact: {
    realExchangeRates: number; // Inflation-adjusted currency values
    internationalCompetitiveness: number; // Export/import effects
    foreignInvestmentFlows: number; // International capital movements
  };
}
```

## Market Microstructure

### **1. Trading Mechanisms**

#### **Order Book System**
```typescript
interface OrderBook {
  symbol: string;
  
  // Bid and Ask Orders
  bids: Order[]; // Buy orders (highest price first)
  asks: Order[]; // Sell orders (lowest price first)
  
  // Market Data
  marketData: {
    lastPrice: number;
    bidPrice: number;
    askPrice: number;
    bidSize: number;
    askSize: number;
    spread: number; // Ask - Bid
  };
  
  // Trading Activity
  activity: {
    volume: number; // Shares traded
    trades: Trade[]; // Recent trades
    vwap: number; // Volume-weighted average price
    turnover: number; // Trading value
  };
}

interface Order {
  id: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number; // For limit orders
  stopPrice?: number; // For stop orders
  timeInForce: 'day' | 'gtc' | 'ioc' | 'fok'; // Good till canceled, etc.
  timestamp: Date;
}
```

#### **Market Making System**
```typescript
interface MarketMaker {
  id: string;
  type: 'designated' | 'electronic' | 'institutional';
  
  // Market Making Activity
  activity: {
    quotedSpreads: Record<string, number>; // Spreads for each security
    volumeProvided: Record<string, number>; // Liquidity provision
    inventoryLimits: Record<string, number>; // Position limits
    riskManagement: RiskParameters;
  };
  
  // Economic Incentives
  incentives: {
    rebates: number; // Payment for providing liquidity
    fees: number; // Costs for taking liquidity
    inventoryCosts: number; // Cost of holding positions
    adverseSelectionCosts: number; // Cost of informed trading
  };
}
```

### **2. Price Discovery Mechanisms**

#### **Fundamental Valuation Models**
```typescript
interface ValuationModel {
  // Discounted Cash Flow Models
  dcfModel: {
    projectedCashFlows: number[]; // Future cash flow projections
    discountRate: number; // Cost of capital
    terminalValue: number; // Long-term value
    presentValue: number; // Current fair value
  };
  
  // Relative Valuation Models
  relativeValuation: {
    peRatio: number; // Price-to-earnings
    pbRatio: number; // Price-to-book
    psRatio: number; // Price-to-sales
    evEbitda: number; // Enterprise value to EBITDA
    peerComparison: PeerMetrics[];
  };
  
  // Bond Valuation Models
  bondValuation: {
    yieldToMaturity: number;
    creditSpreadModel: number;
    optionAdjustedSpread: number; // For callable bonds
    durationRisk: number;
  };
}
```

## Integration Architecture

### **1. Real-Time Market Updates**

#### **Market Data Engine**
```typescript
class MarketDataEngine {
  // Price Updates
  updateStockPrices(economicFactors: EconomicFactors): void;
  updateBondYields(monetaryPolicy: MonetaryPolicy, fiscalPolicy: FiscalPolicy): void;
  updateCurrencyRates(tradeBalance: TradeBalance, interestRateDiff: number): void;
  
  // Sentiment Updates
  updateMarketSentiment(newsEvents: NewsEvent[], socialMedia: SocialMediaData): void;
  calculateFearGreedIndex(marketMetrics: MarketMetrics): number;
  
  // Volume and Liquidity
  updateTradingVolume(economicActivity: EconomicActivity): void;
  adjustLiquidity(marketStress: MarketStress): void;
}
```

#### **Economic Integration Service**
```typescript
class EconomicMarketIntegration {
  // GDP Integration
  applyGDPEffects(gdpGrowth: number, marketData: MarketData): MarketData;
  
  // Inflation Integration
  applyInflationEffects(inflationRate: number, bondMarket: BondMarket): BondMarket;
  
  // Policy Integration
  applyCentralBankPolicy(policyChange: PolicyChange, markets: FinancialMarkets): FinancialMarkets;
  applyFiscalPolicy(fiscalChange: FiscalChange, markets: FinancialMarkets): FinancialMarkets;
  
  // Corporate Integration
  applyCorporateEarnings(earnings: EarningsData, stockMarket: StockMarket): StockMarket;
}
```

### **2. Risk Management System**

#### **Systemic Risk Monitoring**
```typescript
interface SystemicRiskMonitor {
  // Market Risk Measures
  marketRisk: {
    volatilitySpikes: number; // Sudden volatility increases
    correlationBreakdown: number; // Diversification failure
    liquidityDrought: number; // Market liquidity disappearance
    flashCrashRisk: number; // Rapid price decline risk
  };
  
  // Credit Risk Measures
  creditRisk: {
    defaultProbabilities: Record<string, number>; // Individual default risks
    creditContagion: number; // Interconnected default risk
    bondSpreadWidening: number; // Credit stress indicator
    bankingSystemStress: number; // Financial sector health
  };
  
  // Currency Risk Measures
  currencyRisk: {
    exchangeRateVolatility: Record<string, number>;
    currencyCrisis: number; // Sudden devaluation risk
    capitalFlightRisk: number; // Foreign investment withdrawal
  };
}
```

## Natural Language Integration

### **1. Market Commentary Generation**

#### **Financial News Generation**
```typescript
class FinancialNewsGenerator {
  // Market Movement News
  generateMarketNews(marketChanges: MarketChange[]): NewsStory[];
  
  // Economic Policy News
  generatePolicyImpactNews(policyChange: PolicyChange, marketReaction: MarketReaction): NewsStory[];
  
  // Corporate News
  generateCorporateNews(earnings: EarningsReport[], marketReaction: StockReaction[]): NewsStory[];
  
  // Bond Market News
  generateBondMarketNews(yieldChanges: YieldChange[], economicContext: EconomicContext): NewsStory[];
}
```

#### **Social Media Market Sentiment**
```typescript
class MarketSocialMediaGenerator {
  // Investor Sentiment Posts
  generateInvestorPosts(marketPerformance: MarketPerformance): SocialMediaPost[];
  
  // Economic Commentary
  generateEconomicCommentary(economicData: EconomicData): SocialMediaPost[];
  
  // Policy Reaction Posts
  generatePolicyReactionPosts(policyAnnouncement: PolicyAnnouncement): SocialMediaPost[];
}
```

## Implementation Phases

### **Phase 1: Core Market Infrastructure**
1. **Stock Market Foundation**: Basic stock trading, indices, market data
2. **Bond Market Foundation**: Government and corporate bonds, yield calculations
3. **Multi-Currency Support**: Foreign exchange integration, currency risk

### **Phase 2: Economic Integration**
1. **GDP Integration**: Economic growth effects on markets
2. **Inflation Integration**: Price level effects on bonds and stocks
3. **Policy Integration**: Central bank and fiscal policy transmission

### **Phase 3: Advanced Features**
1. **Sentiment Analysis**: News and social media sentiment integration
2. **Risk Management**: Systemic risk monitoring and stress testing
3. **Market Microstructure**: Order books, market making, liquidity provision

### **Phase 4: Natural Language Integration**
1. **Market Commentary**: AI-generated financial news and analysis
2. **Social Media Integration**: Realistic investor sentiment and discussions
3. **Economic Narrative**: Market movements driving civilization storylines

This comprehensive financial markets system will provide realistic market dynamics that respond to all economic factors while creating engaging financial narratives and strategic depth for economic decision-making.
