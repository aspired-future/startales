import { Pool } from 'pg';
import { 
  StockExchange, 
  ListedCompany, 
  StockPriceHistory, 
  BondIssue, 
  BondPriceHistory, 
  CreditRating, 
  MarketIndex, 
  MarketSentiment, 
  MarketTransaction, 
  PortfolioHolding, 
  MarketEconomicFactors,
  CorporateLeader 
} from './financialMarketsSchema.js';

export class FinancialMarketsService {
  constructor(private pool: Pool) {}

  // Stock Market Operations
  async getStockExchanges(civilizationId?: number): Promise<StockExchange[]> {
    let query = 'SELECT * FROM stock_exchanges';
    const params = [];

    if (civilizationId) {
      query += ' WHERE civilization_id = $1';
      params.push(civilizationId);
    }

    query += ' ORDER BY market_cap DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getListedCompanies(exchangeId?: number, sector?: string): Promise<ListedCompany[]> {
    let query = 'SELECT * FROM listed_companies';
    const params = [];
    const conditions = [];

    if (exchangeId) {
      conditions.push(`exchange_id = $${params.length + 1}`);
      params.push(exchangeId);
    }

    if (sector) {
      conditions.push(`sector = $${params.length + 1}`);
      params.push(sector);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY market_cap DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getCompanyDetails(symbol: string, exchangeId?: number): Promise<ListedCompany | null> {
    let query = 'SELECT * FROM listed_companies WHERE company_symbol = $1';
    const params = [symbol];

    if (exchangeId) {
      query += ' AND exchange_id = $2';
      params.push(exchangeId);
    }

    const result = await this.pool.query(query, params);
    return result.rows[0] || null;
  }

  async updateStockPrice(companyId: number, newPrice: number, volume: number = 0): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current price for change calculation
      const currentResult = await client.query('SELECT current_price FROM listed_companies WHERE id = $1', [companyId]);
      const currentPrice = currentResult.rows[0]?.current_price || newPrice;
      
      // Calculate daily change
      const dailyChangePercent = ((newPrice - currentPrice) / currentPrice) * 100;

      // Update company current price
      await client.query(`
        UPDATE listed_companies 
        SET previous_close = current_price, 
            current_price = $1, 
            daily_change_percent = $2,
            market_cap = shares_outstanding * $1
        WHERE id = $3
      `, [newPrice, dailyChangePercent, companyId]);

      // Insert price history
      await client.query(`
        INSERT INTO stock_price_history (company_id, trading_date, open_price, high_price, low_price, close_price, volume, adjusted_close)
        VALUES ($1, CURRENT_DATE, $2, $2, $2, $2, $3, $2)
        ON CONFLICT (company_id, trading_date)
        DO UPDATE SET 
          high_price = GREATEST(stock_price_history.high_price, $2),
          low_price = LEAST(stock_price_history.low_price, $2),
          close_price = $2,
          volume = stock_price_history.volume + $3,
          adjusted_close = $2
      `, [companyId, newPrice, volume]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getStockPriceHistory(companyId: number, days: number = 30): Promise<StockPriceHistory[]> {
    const query = `
      SELECT * FROM stock_price_history 
      WHERE company_id = $1 AND trading_date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY trading_date DESC
    `;
    const result = await this.pool.query(query, [companyId]);
    return result.rows;
  }

  // Bond Market Operations
  async getBondIssues(civilizationId?: number, issuerType?: 'government' | 'corporate'): Promise<BondIssue[]> {
    let query = 'SELECT * FROM bond_issues';
    const params = [];
    const conditions = [];

    if (civilizationId) {
      conditions.push(`issuer_id = $${params.length + 1}`);
      params.push(civilizationId);
    }

    if (issuerType) {
      conditions.push(`issuer_type = $${params.length + 1}`);
      params.push(issuerType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY maturity_date ASC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getBondDetails(bondId: number): Promise<BondIssue | null> {
    const query = 'SELECT * FROM bond_issues WHERE id = $1';
    const result = await this.pool.query(query, [bondId]);
    return result.rows[0] || null;
  }

  async updateBondPrice(bondId: number, newPrice: number, newYield: number, volume: number = 0): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update bond current price and yield
      await client.query(`
        UPDATE bond_issues 
        SET current_price = $1, yield_to_maturity = $2
        WHERE id = $3
      `, [newPrice, newYield, bondId]);

      // Insert price history
      await client.query(`
        INSERT INTO bond_price_history (bond_id, trading_date, price, yield, volume)
        VALUES ($1, CURRENT_DATE, $2, $3, $4)
        ON CONFLICT (bond_id, trading_date)
        DO UPDATE SET 
          price = $2,
          yield = $3,
          volume = bond_price_history.volume + $4
      `, [bondId, newPrice, newYield, volume]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async calculateBondYield(bondId: number, marketPrice: number): Promise<number> {
    const bond = await this.getBondDetails(bondId);
    if (!bond) throw new Error(`Bond not found: ${bondId}`);

    const yearsToMaturity = (new Date(bond.maturity_date).getTime() - Date.now()) / (365.25 * 24 * 60 * 60 * 1000);
    const annualCoupon = bond.face_value * bond.coupon_rate;
    
    // Simplified yield to maturity calculation
    const yieldToMaturity = (annualCoupon + (bond.face_value - marketPrice) / yearsToMaturity) / 
                           ((bond.face_value + marketPrice) / 2);
    
    return yieldToMaturity;
  }

  async getYieldCurve(civilizationId: number): Promise<{ maturity: string; yield: number }[]> {
    const query = `
      SELECT 
        EXTRACT(YEAR FROM (maturity_date - CURRENT_DATE)) as years_to_maturity,
        AVG(yield_to_maturity) as avg_yield
      FROM bond_issues 
      WHERE issuer_type = 'government' AND issuer_id = $1 AND yield_to_maturity IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM (maturity_date - CURRENT_DATE))
      ORDER BY years_to_maturity ASC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    
    return result.rows.map(row => ({
      maturity: `${row.years_to_maturity}Y`,
      yield: parseFloat(row.avg_yield)
    }));
  }

  // Market Sentiment and Analysis
  async updateMarketSentiment(civilizationId: number, economicFactors: MarketEconomicFactors): Promise<MarketSentiment> {
    // Calculate sentiment components
    const economicConfidence = this.calculateEconomicConfidence(economicFactors);
    const policyUncertainty = this.calculatePolicyUncertainty(economicFactors);
    const geopoliticalRisk = this.calculateGeopoliticalRisk(economicFactors);
    
    // Overall sentiment (-1 to 1)
    const overallSentiment = Math.max(-1, Math.min(1, 
      economicConfidence * 0.6 - policyUncertainty * 0.3 - geopoliticalRisk * 0.1
    ));
    
    // Fear & Greed Index (0 to 100)
    const fearGreedIndex = Math.max(0, Math.min(100, 
      50 + (overallSentiment * 40) + (economicConfidence * 30) - (policyUncertainty * 20)
    ));
    
    // Volatility Index
    const volatilityIndex = this.calculateVolatilityIndex(economicFactors, policyUncertainty, geopoliticalRisk);
    
    const sentimentDrivers = {
      gdp_growth_impact: economicFactors.gdp_growth_rate * 10,
      inflation_impact: -Math.abs(economicFactors.inflation_rate - 0.02) * 5,
      interest_rate_impact: -economicFactors.interest_rate * 2,
      fiscal_policy_impact: -economicFactors.fiscal_balance_gdp * 3,
      political_stability_impact: (1 - policyUncertainty) * 0.5
    };

    const query = `
      INSERT INTO market_sentiment (
        civilization_id, sentiment_date, overall_sentiment, fear_greed_index,
        volatility_index, economic_confidence, policy_uncertainty, geopolitical_risk, sentiment_drivers
      ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (civilization_id, sentiment_date)
      DO UPDATE SET 
        overall_sentiment = $2,
        fear_greed_index = $3,
        volatility_index = $4,
        economic_confidence = $5,
        policy_uncertainty = $6,
        geopolitical_risk = $7,
        sentiment_drivers = $8
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      civilizationId,
      overallSentiment,
      fearGreedIndex,
      volatilityIndex,
      economicConfidence,
      policyUncertainty,
      geopoliticalRisk,
      JSON.stringify(sentimentDrivers)
    ]);

    return result.rows[0];
  }

  private calculateEconomicConfidence(factors: MarketEconomicFactors): number {
    const gdpComponent = Math.max(0, Math.min(1, factors.gdp_growth_rate * 10));
    const unemploymentComponent = Math.max(0, Math.min(1, (0.1 - factors.unemployment_rate) * 10));
    const inflationComponent = Math.max(0, Math.min(1, 1 - Math.abs(factors.inflation_rate - 0.02) * 20));
    const tradeComponent = Math.max(0, Math.min(1, (factors.trade_balance / 100000000000 + 1) / 2));
    
    return (gdpComponent * 0.3 + unemploymentComponent * 0.25 + inflationComponent * 0.25 + tradeComponent * 0.2);
  }

  private calculatePolicyUncertainty(factors: MarketEconomicFactors): number {
    const fiscalUncertainty = Math.abs(factors.fiscal_balance_gdp) * 2;
    const debtUncertainty = Math.max(0, (factors.debt_to_gdp - 0.6) * 2);
    const interestRateUncertainty = Math.abs(factors.interest_rate - 0.03) * 5;
    
    return Math.max(0, Math.min(1, (fiscalUncertainty + debtUncertainty + interestRateUncertainty) / 3));
  }

  private calculateGeopoliticalRisk(factors: MarketEconomicFactors): number {
    // Simplified geopolitical risk based on currency strength and trade balance volatility
    const currencyRisk = Math.abs(factors.currency_strength_index - 100) / 100;
    const tradeRisk = Math.abs(factors.trade_balance) / 50000000000 / 100;
    
    return Math.max(0, Math.min(1, (currencyRisk + tradeRisk) / 2));
  }

  private calculateVolatilityIndex(factors: MarketEconomicFactors, policyUncertainty: number, geopoliticalRisk: number): number {
    const baseVolatility = 15; // Base volatility percentage
    const economicVolatility = Math.abs(factors.gdp_growth_rate - 0.03) * 100;
    const inflationVolatility = Math.abs(factors.inflation_rate - 0.02) * 200;
    const policyVolatility = policyUncertainty * 20;
    const geopoliticalVolatility = geopoliticalRisk * 15;
    
    return baseVolatility + economicVolatility + inflationVolatility + policyVolatility + geopoliticalVolatility;
  }

  async getMarketSentiment(civilizationId: number, days: number = 30): Promise<MarketSentiment[]> {
    const query = `
      SELECT * FROM market_sentiment 
      WHERE civilization_id = $1 AND sentiment_date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY sentiment_date DESC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  // Market Indices
  async getMarketIndices(civilizationId: number): Promise<MarketIndex[]> {
    const query = 'SELECT * FROM market_indices WHERE civilization_id = $1 ORDER BY index_type, index_name';
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async updateMarketIndex(indexId: number): Promise<MarketIndex> {
    // Get index components and calculate weighted value
    const componentsQuery = `
      SELECT 
        ic.component_type,
        ic.component_id,
        ic.weight,
        CASE 
          WHEN ic.component_type = 'stock' THEN lc.current_price
          WHEN ic.component_type = 'bond' THEN bi.current_price
        END as current_price
      FROM index_components ic
      LEFT JOIN listed_companies lc ON ic.component_type = 'stock' AND ic.component_id = lc.id
      LEFT JOIN bond_issues bi ON ic.component_type = 'bond' AND ic.component_id = bi.id
      WHERE ic.index_id = $1
    `;
    
    const componentsResult = await this.pool.query(componentsQuery, [indexId]);
    const components = componentsResult.rows;
    
    if (components.length === 0) {
      throw new Error(`No components found for index ${indexId}`);
    }

    // Calculate weighted index value
    let totalWeightedValue = 0;
    let totalWeight = 0;
    
    for (const component of components) {
      if (component.current_price) {
        totalWeightedValue += component.current_price * component.weight;
        totalWeight += component.weight;
      }
    }
    
    const indexValue = totalWeight > 0 ? totalWeightedValue / totalWeight : 1000;
    
    // Get previous value for change calculation
    const indexQuery = 'SELECT current_value FROM market_indices WHERE id = $1';
    const indexResult = await this.pool.query(indexQuery, [indexId]);
    const previousValue = indexResult.rows[0]?.current_value || indexValue;
    
    const dailyChangePercent = ((indexValue - previousValue) / previousValue) * 100;

    // Update index
    const updateQuery = `
      UPDATE market_indices 
      SET current_value = $1, daily_change_percent = $2, component_count = $3
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await this.pool.query(updateQuery, [indexValue, dailyChangePercent, components.length, indexId]);
    return result.rows[0];
  }

  // Trading Operations
  async executeStockTrade(
    civilizationId: number,
    companyId: number,
    transactionType: 'stock_buy' | 'stock_sell',
    quantity: number,
    price?: number
  ): Promise<MarketTransaction> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get company details
      const companyResult = await client.query('SELECT * FROM listed_companies WHERE id = $1', [companyId]);
      const company = companyResult.rows[0];
      
      if (!company) {
        throw new Error(`Company not found: ${companyId}`);
      }

      const tradePrice = price || company.current_price;
      const totalValue = quantity * tradePrice;
      const commission = totalValue * 0.001; // 0.1% commission

      // Insert transaction
      const transactionQuery = `
        INSERT INTO market_transactions (
          civilization_id, transaction_type, security_type, security_id,
          quantity, price, total_value, currency_code, commission
        ) VALUES ($1, $2, 'stock', $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const transactionResult = await client.query(transactionQuery, [
        civilizationId,
        transactionType,
        companyId,
        quantity,
        tradePrice,
        totalValue,
        'TER', // Default currency - should be dynamic
        commission
      ]);

      // Update portfolio holdings
      await this.updatePortfolioHolding(
        client,
        civilizationId,
        'government_reserves',
        'stock',
        companyId,
        transactionType === 'stock_buy' ? quantity : -quantity,
        tradePrice
      );

      // Update stock price with market impact
      const priceImpact = this.calculatePriceImpact(quantity, company.shares_outstanding, transactionType);
      const newPrice = company.current_price * (1 + priceImpact);
      
      await client.query(`
        UPDATE listed_companies 
        SET current_price = $1, daily_change_percent = $2
        WHERE id = $3
      `, [newPrice, ((newPrice - company.current_price) / company.current_price) * 100, companyId]);

      await client.query('COMMIT');
      return transactionResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async executeBondTrade(
    civilizationId: number,
    bondId: number,
    transactionType: 'bond_buy' | 'bond_sell',
    faceValueAmount: number,
    price?: number
  ): Promise<MarketTransaction> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get bond details
      const bondResult = await client.query('SELECT * FROM bond_issues WHERE id = $1', [bondId]);
      const bond = bondResult.rows[0];
      
      if (!bond) {
        throw new Error(`Bond not found: ${bondId}`);
      }

      const tradePrice = price || bond.current_price;
      const totalValue = (faceValueAmount * tradePrice) / 100; // Price is percentage of face value
      const commission = totalValue * 0.0005; // 0.05% commission for bonds

      // Insert transaction
      const transactionQuery = `
        INSERT INTO market_transactions (
          civilization_id, transaction_type, security_type, security_id,
          quantity, price, total_value, currency_code, commission
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const securityType = bond.issuer_type === 'government' ? 'government_bond' : 'corporate_bond';
      
      const transactionResult = await client.query(transactionQuery, [
        civilizationId,
        transactionType,
        securityType,
        bondId,
        faceValueAmount,
        tradePrice,
        totalValue,
        bond.currency_code,
        commission
      ]);

      // Update portfolio holdings
      await this.updatePortfolioHolding(
        client,
        civilizationId,
        'government_reserves',
        securityType,
        bondId,
        transactionType === 'bond_buy' ? faceValueAmount : -faceValueAmount,
        tradePrice
      );

      await client.query('COMMIT');
      return transactionResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private calculatePriceImpact(tradeQuantity: number, sharesOutstanding: number, transactionType: string): number {
    const tradeRatio = tradeQuantity / sharesOutstanding;
    const baseImpact = Math.sqrt(tradeRatio) * 0.01; // Square root impact model
    return transactionType === 'stock_buy' ? baseImpact : -baseImpact;
  }

  private async updatePortfolioHolding(
    client: any,
    civilizationId: number,
    portfolioType: string,
    securityType: string,
    securityId: number,
    quantityChange: number,
    price: number
  ): Promise<void> {
    const query = `
      INSERT INTO portfolio_holdings (
        civilization_id, portfolio_type, security_type, security_id,
        quantity, average_cost, current_value, currency_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'TER')
      ON CONFLICT (civilization_id, portfolio_type, security_type, security_id)
      DO UPDATE SET 
        quantity = portfolio_holdings.quantity + $5,
        average_cost = CASE 
          WHEN portfolio_holdings.quantity + $5 > 0 THEN
            (portfolio_holdings.average_cost * portfolio_holdings.quantity + $6 * $5) / 
            (portfolio_holdings.quantity + $5)
          ELSE $6
        END,
        current_value = (portfolio_holdings.quantity + $5) * $6,
        last_updated = CURRENT_TIMESTAMP
    `;

    await client.query(query, [
      civilizationId,
      portfolioType,
      securityType,
      securityId,
      quantityChange,
      price,
      quantityChange * price
    ]);
  }

  // Portfolio Management
  async getPortfolioHoldings(civilizationId: number, portfolioType: string = 'government_reserves'): Promise<PortfolioHolding[]> {
    const query = 'SELECT * FROM portfolio_holdings WHERE civilization_id = $1 AND portfolio_type = $2 ORDER BY current_value DESC';
    const result = await this.pool.query(query, [civilizationId, portfolioType]);
    return result.rows;
  }

  async updatePortfolioValues(civilizationId: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update stock holdings
      await client.query(`
        UPDATE portfolio_holdings 
        SET 
          current_value = quantity * lc.current_price,
          unrealized_gain_loss = (quantity * lc.current_price) - (quantity * average_cost),
          last_updated = CURRENT_TIMESTAMP
        FROM listed_companies lc
        WHERE portfolio_holdings.security_type = 'stock' 
          AND portfolio_holdings.security_id = lc.id
          AND portfolio_holdings.civilization_id = $1
      `, [civilizationId]);

      // Update bond holdings
      await client.query(`
        UPDATE portfolio_holdings 
        SET 
          current_value = (quantity * bi.current_price) / 100,
          unrealized_gain_loss = ((quantity * bi.current_price) / 100) - (quantity * average_cost),
          last_updated = CURRENT_TIMESTAMP
        FROM bond_issues bi
        WHERE portfolio_holdings.security_type IN ('government_bond', 'corporate_bond')
          AND portfolio_holdings.security_id = bi.id
          AND portfolio_holdings.civilization_id = $1
      `, [civilizationId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Economic Integration
  async updateEconomicFactors(civilizationId: number, factors: Partial<MarketEconomicFactors>): Promise<MarketEconomicFactors> {
    const query = `
      INSERT INTO market_economic_factors (
        civilization_id, factor_date, gdp_growth_rate, inflation_rate, interest_rate,
        unemployment_rate, fiscal_balance_gdp, debt_to_gdp, currency_strength_index, trade_balance
      ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (civilization_id, factor_date)
      DO UPDATE SET 
        gdp_growth_rate = COALESCE($2, market_economic_factors.gdp_growth_rate),
        inflation_rate = COALESCE($3, market_economic_factors.inflation_rate),
        interest_rate = COALESCE($4, market_economic_factors.interest_rate),
        unemployment_rate = COALESCE($5, market_economic_factors.unemployment_rate),
        fiscal_balance_gdp = COALESCE($6, market_economic_factors.fiscal_balance_gdp),
        debt_to_gdp = COALESCE($7, market_economic_factors.debt_to_gdp),
        currency_strength_index = COALESCE($8, market_economic_factors.currency_strength_index),
        trade_balance = COALESCE($9, market_economic_factors.trade_balance)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      civilizationId,
      factors.gdp_growth_rate,
      factors.inflation_rate,
      factors.interest_rate,
      factors.unemployment_rate,
      factors.fiscal_balance_gdp,
      factors.debt_to_gdp,
      factors.currency_strength_index,
      factors.trade_balance
    ]);

    return result.rows[0];
  }

  async getEconomicFactors(civilizationId: number, days: number = 30): Promise<MarketEconomicFactors[]> {
    const query = `
      SELECT * FROM market_economic_factors 
      WHERE civilization_id = $1 AND factor_date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY factor_date DESC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  // Analytics and Reporting
  async getMarketOverview(civilizationId: number): Promise<any> {
    const [exchanges, indices, sentiment, economicFactors] = await Promise.all([
      this.getStockExchanges(civilizationId),
      this.getMarketIndices(civilizationId),
      this.getMarketSentiment(civilizationId, 1),
      this.getEconomicFactors(civilizationId, 1)
    ]);

    return {
      exchanges,
      indices,
      sentiment: sentiment[0],
      economicFactors: economicFactors[0],
      timestamp: new Date()
    };
  }

  async getPortfolioPerformance(civilizationId: number): Promise<any> {
    const holdings = await this.getPortfolioHoldings(civilizationId);
    
    const totalValue = holdings.reduce((sum, holding) => sum + holding.current_value, 0);
    const totalCost = holdings.reduce((sum, holding) => sum + (holding.quantity * holding.average_cost), 0);
    const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.unrealized_gain_loss, 0);
    const returnPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      returnPercent,
      holdingsCount: holdings.length,
      holdings
    };
  }

  async getTransactionHistory(civilizationId: number, days: number = 30): Promise<MarketTransaction[]> {
    const query = `
      SELECT * FROM market_transactions 
      WHERE civilization_id = $1 AND transaction_date >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
      ORDER BY transaction_date DESC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  // Corporate Leaders Management
  async getCorporateLeaders(companyId?: number, position?: string): Promise<CorporateLeader[]> {
    let query = 'SELECT * FROM corporate_leaders';
    const params = [];
    const conditions = [];

    if (companyId) {
      conditions.push(`company_id = $${params.length + 1}`);
      params.push(companyId);
    }

    if (position) {
      conditions.push(`position ILIKE $${params.length + 1}`);
      params.push(`%${position}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY influence_level DESC, company_id';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getCorporateLeaderDetails(leaderId: number): Promise<CorporateLeader | null> {
    const query = 'SELECT * FROM corporate_leaders WHERE id = $1';
    const result = await this.pool.query(query, [leaderId]);
    return result.rows[0] || null;
  }

  async getCorporateLeadersByCompany(companyId: number): Promise<CorporateLeader[]> {
    const query = 'SELECT * FROM corporate_leaders WHERE company_id = $1 ORDER BY influence_level DESC';
    const result = await this.pool.query(query, [companyId]);
    return result.rows;
  }

  async getCompanyWithLeaders(companyId: number): Promise<{ company: ListedCompany; leaders: CorporateLeader[] } | null> {
    const companyQuery = 'SELECT * FROM listed_companies WHERE id = $1';
    const companyResult = await this.pool.query(companyQuery, [companyId]);
    
    if (companyResult.rows.length === 0) {
      return null;
    }

    const leaders = await this.getCorporateLeadersByCompany(companyId);
    
    return {
      company: companyResult.rows[0],
      leaders
    };
  }

  async getLeaderByWitterHandle(handle: string): Promise<CorporateLeader | null> {
    const query = 'SELECT * FROM corporate_leaders WHERE witter_handle = $1';
    const result = await this.pool.query(query, [handle]);
    return result.rows[0] || null;
  }

  async getAvailableLeadersForContact(civilizationId: number, availability: 'high' | 'medium' | 'low' = 'medium'): Promise<CorporateLeader[]> {
    const query = `
      SELECT cl.* FROM corporate_leaders cl
      JOIN listed_companies lc ON cl.company_id = lc.id
      JOIN stock_exchanges se ON lc.exchange_id = se.id
      WHERE se.civilization_id = $1 
        AND cl.contact_availability IN ($2, 'high')
      ORDER BY cl.influence_level DESC, cl.contact_availability DESC
    `;
    
    const availabilityLevels = availability === 'high' ? ['high'] : 
                              availability === 'medium' ? ['high', 'medium'] : 
                              ['high', 'medium', 'low'];
    
    const result = await this.pool.query(query, [civilizationId, availabilityLevels.join("','")]);
    return result.rows;
  }

  async updateLeaderPublicStatement(leaderId: number, statement: string): Promise<void> {
    const query = `
      UPDATE corporate_leaders 
      SET public_statements = public_statements || $1::jsonb
      WHERE id = $2
    `;
    await this.pool.query(query, [JSON.stringify([statement]), leaderId]);
  }

  async getCompaniesBySector(sector: string, exchangeId?: number): Promise<ListedCompany[]> {
    let query = 'SELECT * FROM listed_companies WHERE sector = $1';
    const params = [sector];

    if (exchangeId) {
      query += ' AND exchange_id = $2';
      params.push(exchangeId);
    }

    query += ' ORDER BY market_cap DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getSectorPerformance(civilizationId: number): Promise<any[]> {
    const query = `
      SELECT 
        lc.sector,
        COUNT(*) as company_count,
        SUM(lc.market_cap) as total_market_cap,
        AVG(lc.daily_change_percent) as avg_daily_change,
        AVG(lc.pe_ratio) as avg_pe_ratio,
        AVG(lc.dividend_yield) as avg_dividend_yield
      FROM listed_companies lc
      JOIN stock_exchanges se ON lc.exchange_id = se.id
      WHERE se.civilization_id = $1
      GROUP BY lc.sector
      ORDER BY total_market_cap DESC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async getTopPerformingCompanies(civilizationId: number, limit: number = 10): Promise<ListedCompany[]> {
    const query = `
      SELECT lc.* FROM listed_companies lc
      JOIN stock_exchanges se ON lc.exchange_id = se.id
      WHERE se.civilization_id = $1
      ORDER BY lc.daily_change_percent DESC
      LIMIT $2
    `;
    const result = await this.pool.query(query, [civilizationId, limit]);
    return result.rows;
  }

  async getCompanyNews(companyId: number): Promise<any> {
    const company = await this.getCompanyDetails('', companyId);
    if (!company) return null;

    return {
      company_name: company.company_name,
      recent_developments: company.recent_developments,
      stock_performance: {
        current_price: company.current_price,
        daily_change: company.daily_change_percent,
        market_cap: company.market_cap
      },
      business_highlights: {
        revenue: company.annual_revenue,
        employees: company.employee_count,
        competitive_advantages: company.competitive_advantages
      }
    };
  }

  // Enhanced company details method
  async getCompanyDetails(symbol: string, companyId?: number): Promise<ListedCompany | null> {
    let query: string;
    let params: any[];

    if (companyId) {
      query = 'SELECT * FROM listed_companies WHERE id = $1';
      params = [companyId];
    } else {
      query = 'SELECT * FROM listed_companies WHERE company_symbol = $1';
      params = [symbol];
    }

    const result = await this.pool.query(query, params);
    return result.rows[0] || null;
  }
}

// Service instance
let financialMarketsService: FinancialMarketsService | null = null;

export function getFinancialMarketsService(): FinancialMarketsService {
  if (!financialMarketsService) {
    throw new Error('FinancialMarketsService not initialized. Call initializeFinancialMarketsService first.');
  }
  return financialMarketsService;
}

export function initializeFinancialMarketsService(pool: Pool): void {
  financialMarketsService = new FinancialMarketsService(pool);
}
