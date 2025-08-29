import express from 'express';
import { getFinancialMarketsService } from './FinancialMarketsService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Financial Markets System
const financialMarketsKnobsData = {
  // Market Structure & Regulation
  market_transparency: 0.8,             // Market transparency and disclosure requirements
  insider_trading_enforcement: 0.9,     // Insider trading enforcement strength
  market_manipulation_controls: 0.8,    // Market manipulation prevention measures
  
  // Trading & Liquidity
  high_frequency_trading_limits: 0.6,   // High-frequency trading restrictions
  market_maker_incentives: 0.7,         // Market maker participation incentives
  circuit_breaker_sensitivity: 0.7,     // Circuit breaker trigger sensitivity
  
  // Capital Markets
  ipo_approval_speed: 0.6,               // IPO approval process speed
  listing_requirements_strictness: 0.8,  // Stock exchange listing requirements
  delisting_threshold: 0.7,              // Delisting criteria strictness
  
  // Bond Markets
  government_bond_issuance: 0.6,         // Government bond issuance frequency
  corporate_bond_rating_standards: 0.8,  // Corporate bond rating standards
  yield_curve_management: 0.5,           // Yield curve management intervention
  
  // Risk Management
  margin_requirements: 0.7,              // Margin trading requirements
  leverage_limits: 0.6,                  // Maximum leverage allowed
  stress_testing_frequency: 0.8,         // Financial stress testing frequency
  
  // Market Access & Participation
  foreign_investment_openness: 0.6,      // Foreign investor access level
  retail_investor_protection: 0.8,       // Retail investor protection measures
  institutional_investor_privileges: 0.5, // Institutional investor special access
  
  // Technology & Innovation
  algorithmic_trading_oversight: 0.7,    // Algorithmic trading oversight level
  blockchain_integration: 0.4,           // Blockchain technology adoption
  digital_asset_regulation: 0.6,         // Digital asset regulatory framework
  
  // Market Stability
  volatility_dampening_measures: 0.6,    // Volatility reduction mechanisms
  crisis_intervention_readiness: 0.9,    // Crisis intervention preparedness
  systemic_risk_monitoring: 0.8,         // Systemic risk monitoring intensity
  
  // Information & Analytics
  real_time_data_availability: 0.8,      // Real-time market data access
  market_sentiment_tracking: 0.7,        // Market sentiment analysis depth
  economic_indicator_integration: 0.8,   // Economic indicator integration level
  
  // Cross-Border Integration
  international_market_linkages: 0.5,    // International market connectivity
  cross_listing_facilitation: 0.6,       // Cross-listing process facilitation
  currency_hedging_instruments: 0.7,     // Currency hedging tool availability
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Financial Markets
const financialMarketsKnobSystem = new EnhancedKnobSystem(financialMarketsKnobsData);

// Apply financial markets knobs to game state
function applyFinancialMarketsKnobsToGameState() {
  const knobs = financialMarketsKnobSystem.knobs;
  
  // Apply market structure and regulation settings
  const marketIntegrity = (knobs.market_transparency + knobs.insider_trading_enforcement + 
    knobs.market_manipulation_controls) / 3;
  
  // Apply trading and liquidity settings
  const marketLiquidity = (knobs.high_frequency_trading_limits + knobs.market_maker_incentives + 
    knobs.circuit_breaker_sensitivity) / 3;
  
  // Apply capital markets settings
  const capitalMarketEfficiency = (knobs.ipo_approval_speed + knobs.listing_requirements_strictness + 
    knobs.delisting_threshold) / 3;
  
  // Apply risk management settings
  const riskManagement = (knobs.margin_requirements + knobs.leverage_limits + 
    knobs.stress_testing_frequency) / 3;
  
  // Apply market access settings
  const marketAccessibility = (knobs.foreign_investment_openness + knobs.retail_investor_protection + 
    knobs.institutional_investor_privileges) / 3;
  
  // Apply market stability settings
  const marketStability = (knobs.volatility_dampening_measures + knobs.crisis_intervention_readiness + 
    knobs.systemic_risk_monitoring) / 3;
  
  console.log('Applied financial markets knobs to game state:', {
    marketIntegrity,
    marketLiquidity,
    capitalMarketEfficiency,
    riskManagement,
    marketAccessibility,
    marketStability
  });
}

/**
 * GET /api/financial-markets/overview/:civilization - Get complete market overview
 */
router.get('/overview/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const overview = await service.getMarketOverview(civilizationId);

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching market overview:', error);
    res.status(500).json({
      error: 'Failed to fetch market overview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/exchanges/:civilization - Get stock exchanges
 */
router.get('/exchanges/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const exchanges = await service.getStockExchanges(civilizationId);

    res.json({
      success: true,
      data: exchanges,
      count: exchanges.length
    });
  } catch (error) {
    console.error('Error fetching stock exchanges:', error);
    res.status(500).json({
      error: 'Failed to fetch stock exchanges',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/stocks/companies - Get listed companies
 */
router.get('/stocks/companies', async (req, res) => {
  try {
    const exchangeId = req.query.exchange_id ? parseInt(req.query.exchange_id as string) : undefined;
    const sector = req.query.sector as string;
    
    const service = getFinancialMarketsService();
    const companies = await service.getListedCompanies(exchangeId, sector);

    res.json({
      success: true,
      data: companies,
      count: companies.length
    });
  } catch (error) {
    console.error('Error fetching listed companies:', error);
    res.status(500).json({
      error: 'Failed to fetch listed companies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/stocks/company/:symbol - Get company details
 */
router.get('/stocks/company/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const exchangeId = req.query.exchange_id ? parseInt(req.query.exchange_id as string) : undefined;
    
    const service = getFinancialMarketsService();
    const company = await service.getCompanyDetails(symbol, exchangeId);

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        message: `No company found with symbol: ${symbol}`
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({
      error: 'Failed to fetch company details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/stocks/company/:companyId/history - Get stock price history
 */
router.get('/stocks/company/:companyId/history', async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    
    const service = getFinancialMarketsService();
    const history = await service.getStockPriceHistory(companyId, days);

    res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('Error fetching stock price history:', error);
    res.status(500).json({
      error: 'Failed to fetch stock price history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/financial-markets/stocks/company/:companyId/price - Update stock price
 */
router.put('/stocks/company/:companyId/price', async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    const { price, volume } = req.body;
    
    if (!price || price <= 0) {
      return res.status(400).json({
        error: 'Invalid price',
        message: 'Price must be a positive number'
      });
    }

    const service = getFinancialMarketsService();
    await service.updateStockPrice(companyId, price, volume || 0);

    res.json({
      success: true,
      message: 'Stock price updated successfully'
    });
  } catch (error) {
    console.error('Error updating stock price:', error);
    res.status(500).json({
      error: 'Failed to update stock price',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/financial-markets/stocks/trade - Execute stock trade
 */
router.post('/stocks/trade', async (req, res) => {
  try {
    const { civilization_id, company_id, transaction_type, quantity, price } = req.body;
    
    if (!civilization_id || !company_id || !transaction_type || !quantity) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'civilization_id, company_id, transaction_type, and quantity are required'
      });
    }

    if (!['stock_buy', 'stock_sell'].includes(transaction_type)) {
      return res.status(400).json({
        error: 'Invalid transaction type',
        message: 'transaction_type must be stock_buy or stock_sell'
      });
    }

    const service = getFinancialMarketsService();
    const transaction = await service.executeStockTrade(
      civilization_id,
      company_id,
      transaction_type,
      quantity,
      price
    );

    res.json({
      success: true,
      data: transaction,
      message: 'Stock trade executed successfully'
    });
  } catch (error) {
    console.error('Error executing stock trade:', error);
    res.status(500).json({
      error: 'Failed to execute stock trade',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/bonds/:civilization - Get bond issues
 */
router.get('/bonds/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const issuerType = req.query.issuer_type as 'government' | 'corporate';
    
    const service = getFinancialMarketsService();
    const bonds = await service.getBondIssues(civilizationId, issuerType);

    res.json({
      success: true,
      data: bonds,
      count: bonds.length
    });
  } catch (error) {
    console.error('Error fetching bond issues:', error);
    res.status(500).json({
      error: 'Failed to fetch bond issues',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/bonds/government/:civilization - Get government bonds
 */
router.get('/bonds/government/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const bonds = await service.getBondIssues(civilizationId, 'government');

    res.json({
      success: true,
      data: bonds,
      count: bonds.length
    });
  } catch (error) {
    console.error('Error fetching government bonds:', error);
    res.status(500).json({
      error: 'Failed to fetch government bonds',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/bonds/corporate/:civilization - Get corporate bonds
 */
router.get('/bonds/corporate/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const bonds = await service.getBondIssues(civilizationId, 'corporate');

    res.json({
      success: true,
      data: bonds,
      count: bonds.length
    });
  } catch (error) {
    console.error('Error fetching corporate bonds:', error);
    res.status(500).json({
      error: 'Failed to fetch corporate bonds',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/bonds/:bondId/details - Get bond details
 */
router.get('/bonds/:bondId/details', async (req, res) => {
  try {
    const bondId = parseInt(req.params.bondId);
    
    const service = getFinancialMarketsService();
    const bond = await service.getBondDetails(bondId);

    if (!bond) {
      return res.status(404).json({
        error: 'Bond not found',
        message: `No bond found with ID: ${bondId}`
      });
    }

    res.json({
      success: true,
      data: bond
    });
  } catch (error) {
    console.error('Error fetching bond details:', error);
    res.status(500).json({
      error: 'Failed to fetch bond details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/bonds/yield-curve/:civilization - Get government yield curve
 */
router.get('/bonds/yield-curve/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const yieldCurve = await service.getYieldCurve(civilizationId);

    res.json({
      success: true,
      data: yieldCurve
    });
  } catch (error) {
    console.error('Error fetching yield curve:', error);
    res.status(500).json({
      error: 'Failed to fetch yield curve',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/financial-markets/bonds/:bondId/price - Update bond price
 */
router.put('/bonds/:bondId/price', async (req, res) => {
  try {
    const bondId = parseInt(req.params.bondId);
    const { price, yield: bondYield, volume } = req.body;
    
    if (!price || price <= 0) {
      return res.status(400).json({
        error: 'Invalid price',
        message: 'Price must be a positive number'
      });
    }

    const service = getFinancialMarketsService();
    
    // Calculate yield if not provided
    const finalYield = bondYield || await service.calculateBondYield(bondId, price);
    
    await service.updateBondPrice(bondId, price, finalYield, volume || 0);

    res.json({
      success: true,
      message: 'Bond price updated successfully'
    });
  } catch (error) {
    console.error('Error updating bond price:', error);
    res.status(500).json({
      error: 'Failed to update bond price',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/financial-markets/bonds/trade - Execute bond trade
 */
router.post('/bonds/trade', async (req, res) => {
  try {
    const { civilization_id, bond_id, transaction_type, face_value_amount, price } = req.body;
    
    if (!civilization_id || !bond_id || !transaction_type || !face_value_amount) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'civilization_id, bond_id, transaction_type, and face_value_amount are required'
      });
    }

    if (!['bond_buy', 'bond_sell'].includes(transaction_type)) {
      return res.status(400).json({
        error: 'Invalid transaction type',
        message: 'transaction_type must be bond_buy or bond_sell'
      });
    }

    const service = getFinancialMarketsService();
    const transaction = await service.executeBondTrade(
      civilization_id,
      bond_id,
      transaction_type,
      face_value_amount,
      price
    );

    res.json({
      success: true,
      data: transaction,
      message: 'Bond trade executed successfully'
    });
  } catch (error) {
    console.error('Error executing bond trade:', error);
    res.status(500).json({
      error: 'Failed to execute bond trade',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/indices/:civilization - Get market indices
 */
router.get('/indices/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const indices = await service.getMarketIndices(civilizationId);

    res.json({
      success: true,
      data: indices,
      count: indices.length
    });
  } catch (error) {
    console.error('Error fetching market indices:', error);
    res.status(500).json({
      error: 'Failed to fetch market indices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/financial-markets/indices/:indexId/update - Update market index
 */
router.put('/indices/:indexId/update', async (req, res) => {
  try {
    const indexId = parseInt(req.params.indexId);
    
    const service = getFinancialMarketsService();
    const updatedIndex = await service.updateMarketIndex(indexId);

    res.json({
      success: true,
      data: updatedIndex,
      message: 'Market index updated successfully'
    });
  } catch (error) {
    console.error('Error updating market index:', error);
    res.status(500).json({
      error: 'Failed to update market index',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/sentiment/:civilization - Get market sentiment
 */
router.get('/sentiment/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    
    const service = getFinancialMarketsService();
    const sentiment = await service.getMarketSentiment(civilizationId, days);

    res.json({
      success: true,
      data: sentiment,
      count: sentiment.length
    });
  } catch (error) {
    console.error('Error fetching market sentiment:', error);
    res.status(500).json({
      error: 'Failed to fetch market sentiment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/financial-markets/sentiment/:civilization/update - Update market sentiment
 */
router.post('/sentiment/:civilization/update', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const economicFactors = req.body;
    
    if (!economicFactors) {
      return res.status(400).json({
        error: 'Missing economic factors',
        message: 'Economic factors data is required'
      });
    }

    const service = getFinancialMarketsService();
    const sentiment = await service.updateMarketSentiment(civilizationId, economicFactors);

    res.json({
      success: true,
      data: sentiment,
      message: 'Market sentiment updated successfully'
    });
  } catch (error) {
    console.error('Error updating market sentiment:', error);
    res.status(500).json({
      error: 'Failed to update market sentiment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/economic-factors/:civilization - Get economic factors
 */
router.get('/economic-factors/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    
    const service = getFinancialMarketsService();
    const factors = await service.getEconomicFactors(civilizationId, days);

    res.json({
      success: true,
      data: factors,
      count: factors.length
    });
  } catch (error) {
    console.error('Error fetching economic factors:', error);
    res.status(500).json({
      error: 'Failed to fetch economic factors',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/financial-markets/economic-factors/:civilization/update - Update economic factors
 */
router.post('/economic-factors/:civilization/update', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const factors = req.body;
    
    const service = getFinancialMarketsService();
    const updatedFactors = await service.updateEconomicFactors(civilizationId, factors);

    res.json({
      success: true,
      data: updatedFactors,
      message: 'Economic factors updated successfully'
    });
  } catch (error) {
    console.error('Error updating economic factors:', error);
    res.status(500).json({
      error: 'Failed to update economic factors',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/portfolio/:civilization - Get portfolio holdings
 */
router.get('/portfolio/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const portfolioType = req.query.portfolio_type as string || 'government_reserves';
    
    const service = getFinancialMarketsService();
    const holdings = await service.getPortfolioHoldings(civilizationId, portfolioType);

    res.json({
      success: true,
      data: holdings,
      count: holdings.length
    });
  } catch (error) {
    console.error('Error fetching portfolio holdings:', error);
    res.status(500).json({
      error: 'Failed to fetch portfolio holdings',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/financial-markets/portfolio/:civilization/update-values - Update portfolio values
 */
router.put('/portfolio/:civilization/update-values', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    await service.updatePortfolioValues(civilizationId);

    res.json({
      success: true,
      message: 'Portfolio values updated successfully'
    });
  } catch (error) {
    console.error('Error updating portfolio values:', error);
    res.status(500).json({
      error: 'Failed to update portfolio values',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/portfolio/:civilization/performance - Get portfolio performance
 */
router.get('/portfolio/:civilization/performance', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const performance = await service.getPortfolioPerformance(civilizationId);

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    res.status(500).json({
      error: 'Failed to fetch portfolio performance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/transactions/:civilization - Get transaction history
 */
router.get('/transactions/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    
    const service = getFinancialMarketsService();
    const transactions = await service.getTransactionHistory(civilizationId, days);

    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/leaders - Get corporate leaders
 */
router.get('/leaders', async (req, res) => {
  try {
    const companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
    const position = req.query.position as string;
    
    const service = getFinancialMarketsService();
    const leaders = await service.getCorporateLeaders(companyId, position);

    res.json({
      success: true,
      data: leaders,
      count: leaders.length
    });
  } catch (error) {
    console.error('Error fetching corporate leaders:', error);
    res.status(500).json({
      error: 'Failed to fetch corporate leaders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/leaders/:leaderId - Get corporate leader details
 */
router.get('/leaders/:leaderId', async (req, res) => {
  try {
    const leaderId = parseInt(req.params.leaderId);
    
    const service = getFinancialMarketsService();
    const leader = await service.getCorporateLeaderDetails(leaderId);

    if (!leader) {
      return res.status(404).json({
        error: 'Corporate leader not found',
        message: `No leader found with ID: ${leaderId}`
      });
    }

    res.json({
      success: true,
      data: leader
    });
  } catch (error) {
    console.error('Error fetching corporate leader details:', error);
    res.status(500).json({
      error: 'Failed to fetch corporate leader details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/companies/:companyId/leaders - Get company leaders
 */
router.get('/companies/:companyId/leaders', async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    
    const service = getFinancialMarketsService();
    const leaders = await service.getCorporateLeadersByCompany(companyId);

    res.json({
      success: true,
      data: leaders,
      count: leaders.length
    });
  } catch (error) {
    console.error('Error fetching company leaders:', error);
    res.status(500).json({
      error: 'Failed to fetch company leaders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/companies/:companyId/profile - Get company with leaders
 */
router.get('/companies/:companyId/profile', async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    
    const service = getFinancialMarketsService();
    const profile = await service.getCompanyWithLeaders(companyId);

    if (!profile) {
      return res.status(404).json({
        error: 'Company not found',
        message: `No company found with ID: ${companyId}`
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({
      error: 'Failed to fetch company profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/leaders/witter/:handle - Get leader by Witter handle
 */
router.get('/leaders/witter/:handle', async (req, res) => {
  try {
    const handle = req.params.handle;
    
    const service = getFinancialMarketsService();
    const leader = await service.getLeaderByWitterHandle(handle);

    if (!leader) {
      return res.status(404).json({
        error: 'Leader not found',
        message: `No leader found with Witter handle: ${handle}`
      });
    }

    res.json({
      success: true,
      data: leader
    });
  } catch (error) {
    console.error('Error fetching leader by Witter handle:', error);
    res.status(500).json({
      error: 'Failed to fetch leader by Witter handle',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/leaders/available/:civilization - Get available leaders for contact
 */
router.get('/leaders/available/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const availability = req.query.availability as 'high' | 'medium' | 'low' || 'medium';
    
    const service = getFinancialMarketsService();
    const leaders = await service.getAvailableLeadersForContact(civilizationId, availability);

    res.json({
      success: true,
      data: leaders,
      count: leaders.length
    });
  } catch (error) {
    console.error('Error fetching available leaders:', error);
    res.status(500).json({
      error: 'Failed to fetch available leaders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/financial-markets/leaders/:leaderId/statement - Add public statement
 */
router.post('/leaders/:leaderId/statement', async (req, res) => {
  try {
    const leaderId = parseInt(req.params.leaderId);
    const { statement } = req.body;
    
    if (!statement) {
      return res.status(400).json({
        error: 'Missing statement',
        message: 'Statement text is required'
      });
    }

    const service = getFinancialMarketsService();
    await service.updateLeaderPublicStatement(leaderId, statement);

    res.json({
      success: true,
      message: 'Public statement added successfully'
    });
  } catch (error) {
    console.error('Error adding public statement:', error);
    res.status(500).json({
      error: 'Failed to add public statement',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/sectors/:sector/companies - Get companies by sector
 */
router.get('/sectors/:sector/companies', async (req, res) => {
  try {
    const sector = req.params.sector;
    const exchangeId = req.query.exchange_id ? parseInt(req.query.exchange_id as string) : undefined;
    
    const service = getFinancialMarketsService();
    const companies = await service.getCompaniesBySector(sector, exchangeId);

    res.json({
      success: true,
      data: companies,
      count: companies.length
    });
  } catch (error) {
    console.error('Error fetching companies by sector:', error);
    res.status(500).json({
      error: 'Failed to fetch companies by sector',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/analytics/:civilization/sectors - Get sector performance
 */
router.get('/analytics/:civilization/sectors', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFinancialMarketsService();
    const sectorPerformance = await service.getSectorPerformance(civilizationId);

    res.json({
      success: true,
      data: sectorPerformance
    });
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    res.status(500).json({
      error: 'Failed to fetch sector performance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/analytics/:civilization/top-performers - Get top performing companies
 */
router.get('/analytics/:civilization/top-performers', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    const service = getFinancialMarketsService();
    const topPerformers = await service.getTopPerformingCompanies(civilizationId, limit);

    res.json({
      success: true,
      data: topPerformers,
      count: topPerformers.length
    });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({
      error: 'Failed to fetch top performers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/financial-markets/companies/:companyId/news - Get company news
 */
router.get('/companies/:companyId/news', async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    
    const service = getFinancialMarketsService();
    const news = await service.getCompanyNews(companyId);

    if (!news) {
      return res.status(404).json({
        error: 'Company not found',
        message: `No company found with ID: ${companyId}`
      });
    }

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching company news:', error);
    res.status(500).json({
      error: 'Failed to fetch company news',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'financial-markets', financialMarketsKnobSystem, applyFinancialMarketsKnobsToGameState);

export default router;
