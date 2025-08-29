import { Pool } from 'pg';
import { 
  Currency, 
  ExchangeRate, 
  CurrencyPolicy, 
  CurrencyTransaction, 
  CurrencyReserve, 
  CurrencyUnion, 
  CurrencyUnionMember, 
  ExchangeRateHistory,
  CurrencyMarketData,
  CurrencyIntervention
} from './currencyExchangeSchema';

export class CurrencyExchangeService {
  constructor(private pool: Pool) {}

  // Currency Management
  async getCurrencies(filters?: { civilization_id?: number; is_active?: boolean; is_reserve?: boolean }): Promise<Currency[]> {
    let query = 'SELECT * FROM currencies WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.civilization_id) {
      query += ` AND civilization_id = $${paramIndex}`;
      params.push(filters.civilization_id);
      paramIndex++;
    }

    if (filters?.is_active !== undefined) {
      query += ` AND is_active = $${paramIndex}`;
      params.push(filters.is_active);
      paramIndex++;
    }

    if (filters?.is_reserve !== undefined) {
      query += ` AND is_reserve_currency = $${paramIndex}`;
      params.push(filters.is_reserve);
      paramIndex++;
    }

    query += ' ORDER BY is_reserve_currency DESC, currency_code ASC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getCurrency(currencyCode: string): Promise<Currency | null> {
    const query = 'SELECT * FROM currencies WHERE currency_code = $1';
    const result = await this.pool.query(query, [currencyCode]);
    return result.rows[0] || null;
  }

  async createCurrency(currency: Partial<Currency>): Promise<Currency> {
    const query = `
      INSERT INTO currencies (
        civilization_id, currency_code, currency_name, currency_symbol, 
        base_value, is_reserve_currency
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      currency.civilization_id,
      currency.currency_code,
      currency.currency_name,
      currency.currency_symbol,
      currency.base_value || 1.0,
      currency.is_reserve_currency || false
    ]);
    return result.rows[0];
  }

  async updateCurrency(currencyCode: string, updates: Partial<Currency>): Promise<Currency> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'currency_code' && updates[key as keyof Currency] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'currency_code' && updates[key as keyof Currency] !== undefined)
      .map(key => updates[key as keyof Currency]);

    const query = `
      UPDATE currencies 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE currency_code = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [currencyCode, ...values]);
    return result.rows[0];
  }

  async deactivateCurrency(currencyCode: string): Promise<void> {
    const query = `
      UPDATE currencies 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP 
      WHERE currency_code = $1
    `;
    await this.pool.query(query, [currencyCode]);
  }

  // Exchange Rate Management
  async getExchangeRates(filters?: { base_currency?: string; quote_currency?: string }): Promise<ExchangeRate[]> {
    let query = `
      SELECT er.*, 
             bc.currency_code as base_currency_code, bc.currency_name as base_currency_name,
             qc.currency_code as quote_currency_code, qc.currency_name as quote_currency_name
      FROM exchange_rates er
      JOIN currencies bc ON er.base_currency_id = bc.id
      JOIN currencies qc ON er.quote_currency_id = qc.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.base_currency) {
      query += ` AND bc.currency_code = $${paramIndex}`;
      params.push(filters.base_currency);
      paramIndex++;
    }

    if (filters?.quote_currency) {
      query += ` AND qc.currency_code = $${paramIndex}`;
      params.push(filters.quote_currency);
      paramIndex++;
    }

    query += ' ORDER BY er.last_updated DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getExchangeRate(baseCurrency: string, quoteCurrency: string): Promise<ExchangeRate | null> {
    const query = `
      SELECT er.*, 
             bc.currency_code as base_currency_code, bc.currency_name as base_currency_name,
             qc.currency_code as quote_currency_code, qc.currency_name as quote_currency_name
      FROM exchange_rates er
      JOIN currencies bc ON er.base_currency_id = bc.id
      JOIN currencies qc ON er.quote_currency_id = qc.id
      WHERE bc.currency_code = $1 AND qc.currency_code = $2
    `;
    const result = await this.pool.query(query, [baseCurrency, quoteCurrency]);
    return result.rows[0] || null;
  }

  async calculateExchangeRate(baseCurrency: string, quoteCurrency: string): Promise<number> {
    // Get current market rate
    const existingRate = await this.getExchangeRate(baseCurrency, quoteCurrency);
    if (existingRate) {
      return existingRate.exchange_rate;
    }

    // Calculate rate based on base values and economic factors
    const baseC = await this.getCurrency(baseCurrency);
    const quoteC = await this.getCurrency(quoteCurrency);
    
    if (!baseC || !quoteC) {
      throw new Error(`Currency not found: ${baseCurrency} or ${quoteCurrency}`);
    }

    // Base rate from purchasing power parity
    let rate = quoteC.base_value / baseC.base_value;

    // Apply economic adjustments
    rate *= await this.getEconomicAdjustment(baseC.civilization_id, quoteC.civilization_id);
    
    // Apply market sentiment and volatility
    rate *= await this.getMarketSentimentFactor(baseC.id, quoteC.id);

    return rate;
  }

  async updateExchangeRate(baseCurrency: string, quoteCurrency: string, newRate: number): Promise<ExchangeRate> {
    const spread = await this.calculateSpread(baseCurrency, quoteCurrency);
    const bidRate = newRate * (1 - spread / 2);
    const askRate = newRate * (1 + spread / 2);

    const query = `
      INSERT INTO exchange_rates (base_currency_id, quote_currency_id, exchange_rate, bid_rate, ask_rate, spread)
      SELECT bc.id, qc.id, $3, $4, $5, $6
      FROM currencies bc, currencies qc
      WHERE bc.currency_code = $1 AND qc.currency_code = $2
      ON CONFLICT (base_currency_id, quote_currency_id)
      DO UPDATE SET 
        exchange_rate = $3,
        bid_rate = $4,
        ask_rate = $5,
        spread = $6,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await this.pool.query(query, [baseCurrency, quoteCurrency, newRate, bidRate, askRate, spread]);
    
    // Record in history
    await this.recordExchangeRateHistory(baseCurrency, quoteCurrency, newRate);
    
    return result.rows[0];
  }

  private async calculateSpread(baseCurrency: string, quoteCurrency: string): Promise<number> {
    // Get trading volume and volatility
    const rateData = await this.getExchangeRate(baseCurrency, quoteCurrency);
    const volume = rateData?.daily_volume || 100000;
    const volatility = rateData?.volatility || 0.02;

    // Base spread
    let spread = 0.001; // 0.1%

    // Adjust for volume (higher volume = lower spread)
    spread *= Math.max(0.1, 1 / Math.log(volume / 10000 + 1));

    // Adjust for volatility
    spread *= (1 + volatility * 10);

    // Cap spread at 5%
    return Math.min(spread, 0.05);
  }

  private async getEconomicAdjustment(baseCivId: number, quoteCivId: number): Promise<number> {
    // Get market data for both currencies
    const baseMarketData = await this.getCurrencyMarketData(baseCivId);
    const quoteMarketData = await this.getCurrencyMarketData(quoteCivId);

    if (!baseMarketData || !quoteMarketData) {
      return 1.0; // No adjustment if no data
    }

    // Interest rate differential effect
    const interestDiff = baseMarketData.interest_rate - quoteMarketData.interest_rate;
    const interestAdjustment = 1 + (interestDiff * 0.1); // 10% impact per 1% interest difference

    // Inflation differential effect
    const inflationDiff = baseMarketData.inflation_rate - quoteMarketData.inflation_rate;
    const inflationAdjustment = 1 - (inflationDiff * 0.05); // 5% impact per 1% inflation difference

    // Economic growth differential
    const growthDiff = baseMarketData.economic_growth_rate - quoteMarketData.economic_growth_rate;
    const growthAdjustment = 1 + (growthDiff * 0.02); // 2% impact per 1% growth difference

    // Political stability differential
    const stabilityDiff = (baseMarketData.political_stability_score - quoteMarketData.political_stability_score) / 100;
    const stabilityAdjustment = 1 + (stabilityDiff * 0.1); // 10% impact for full stability difference

    return interestAdjustment * inflationAdjustment * growthAdjustment * stabilityAdjustment;
  }

  private async getMarketSentimentFactor(baseCurrencyId: number, quoteCurrencyId: number): Promise<number> {
    // Simple sentiment based on recent transaction volume and price movements
    const recentTransactions = await this.pool.query(`
      SELECT AVG(exchange_rate) as avg_rate, COUNT(*) as transaction_count
      FROM currency_transactions 
      WHERE (from_currency_id = $1 AND to_currency_id = $2)
         OR (from_currency_id = $2 AND to_currency_id = $1)
      AND created_at >= NOW() - INTERVAL '24 hours'
    `, [baseCurrencyId, quoteCurrencyId]);

    const transactionCount = parseInt(recentTransactions.rows[0]?.transaction_count) || 0;
    
    // Higher transaction volume indicates higher confidence
    const volumeFactor = Math.min(1.1, 1 + (transactionCount / 1000));
    
    // Add some random market sentiment (±2%)
    const randomSentiment = 1 + (Math.random() - 0.5) * 0.04;
    
    return volumeFactor * randomSentiment;
  }

  async getCurrencyMarketData(civilizationId: number): Promise<CurrencyMarketData | null> {
    const query = `
      SELECT cmd.* 
      FROM currency_market_data cmd
      JOIN currencies c ON cmd.currency_id = c.id
      WHERE c.civilization_id = $1
      ORDER BY cmd.recorded_at DESC
      LIMIT 1
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows[0] || null;
  }

  // Currency Transactions
  async executeCurrencyTransaction(transaction: Partial<CurrencyTransaction>): Promise<CurrencyTransaction> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current exchange rate
      const fromCurrency = await this.getCurrency(transaction.from_currency_id?.toString() || '');
      const toCurrency = await this.getCurrency(transaction.to_currency_id?.toString() || '');
      
      if (!fromCurrency || !toCurrency) {
        throw new Error('Invalid currency IDs');
      }

      const exchangeRate = await this.calculateExchangeRate(fromCurrency.currency_code, toCurrency.currency_code);
      const toAmount = (transaction.from_amount || 0) * exchangeRate;
      const transactionFee = (transaction.from_amount || 0) * 0.001; // 0.1% fee

      // Create transaction record
      const query = `
        INSERT INTO currency_transactions (
          transaction_type, from_currency_id, to_currency_id, from_amount, 
          to_amount, exchange_rate, transaction_fee, initiator_type, initiator_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const result = await client.query(query, [
        transaction.transaction_type,
        transaction.from_currency_id,
        transaction.to_currency_id,
        transaction.from_amount,
        toAmount,
        exchangeRate,
        transactionFee,
        transaction.initiator_type,
        transaction.initiator_id
      ]);

      // Update exchange rate based on transaction volume
      await this.updateExchangeRateFromTransaction(fromCurrency.currency_code, toCurrency.currency_code, transaction.from_amount || 0);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async updateExchangeRateFromTransaction(fromCurrency: string, toCurrency: string, amount: number): Promise<void> {
    // Update daily volume
    const query = `
      UPDATE exchange_rates 
      SET daily_volume = daily_volume + $3,
          last_updated = CURRENT_TIMESTAMP
      FROM currencies bc, currencies qc
      WHERE exchange_rates.base_currency_id = bc.id 
        AND exchange_rates.quote_currency_id = qc.id
        AND bc.currency_code = $1 
        AND qc.currency_code = $2
    `;
    await this.pool.query(query, [fromCurrency, toCurrency, amount]);
  }

  async getCurrencyTransactions(filters?: { 
    civilization_id?: number; 
    currency_code?: string; 
    transaction_type?: string;
    settlement_status?: string;
    limit?: number;
  }): Promise<CurrencyTransaction[]> {
    let query = `
      SELECT ct.*, 
             fc.currency_code as from_currency_code, fc.currency_name as from_currency_name,
             tc.currency_code as to_currency_code, tc.currency_name as to_currency_name
      FROM currency_transactions ct
      JOIN currencies fc ON ct.from_currency_id = fc.id
      JOIN currencies tc ON ct.to_currency_id = tc.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.civilization_id) {
      query += ` AND (fc.civilization_id = $${paramIndex} OR tc.civilization_id = $${paramIndex})`;
      params.push(filters.civilization_id);
      paramIndex++;
    }

    if (filters?.currency_code) {
      query += ` AND (fc.currency_code = $${paramIndex} OR tc.currency_code = $${paramIndex})`;
      params.push(filters.currency_code);
      paramIndex++;
    }

    if (filters?.transaction_type) {
      query += ` AND ct.transaction_type = $${paramIndex}`;
      params.push(filters.transaction_type);
      paramIndex++;
    }

    if (filters?.settlement_status) {
      query += ` AND ct.settlement_status = $${paramIndex}`;
      params.push(filters.settlement_status);
      paramIndex++;
    }

    query += ` ORDER BY ct.created_at DESC`;

    if (filters?.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async settleCurrencyTransaction(transactionId: number): Promise<CurrencyTransaction> {
    const query = `
      UPDATE currency_transactions 
      SET settlement_status = 'settled', settled_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [transactionId]);
    return result.rows[0];
  }

  // Currency Policies
  async getCurrencyPolicy(currencyCode: string): Promise<CurrencyPolicy | null> {
    const query = `
      SELECT cp.*, c.currency_code, c.currency_name
      FROM currency_policies cp
      JOIN currencies c ON cp.currency_id = c.id
      WHERE c.currency_code = $1
      ORDER BY cp.effective_date DESC
      LIMIT 1
    `;
    const result = await this.pool.query(query, [currencyCode]);
    return result.rows[0] || null;
  }

  async setCurrencyPolicy(currencyCode: string, policy: Partial<CurrencyPolicy>): Promise<CurrencyPolicy> {
    const query = `
      INSERT INTO currency_policies (
        currency_id, policy_type, target_currency_id, target_rate, 
        intervention_bands, reserve_requirements, capital_controls, effective_date, created_by
      )
      SELECT c.id, $2, $3, $4, $5, $6, $7, $8, $9
      FROM currencies c
      WHERE c.currency_code = $1
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      currencyCode,
      policy.policy_type,
      policy.target_currency_id,
      policy.target_rate,
      JSON.stringify(policy.intervention_bands),
      policy.reserve_requirements,
      JSON.stringify(policy.capital_controls),
      policy.effective_date || new Date(),
      policy.created_by
    ]);
    return result.rows[0];
  }

  async executeCurrencyIntervention(intervention: Partial<CurrencyIntervention>): Promise<CurrencyIntervention> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Record the intervention
      const query = `
        INSERT INTO currency_interventions (
          currency_id, intervention_type, target_rate, intervention_amount,
          intervention_currency_id, executed_by
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const result = await client.query(query, [
        intervention.currency_id,
        intervention.intervention_type,
        intervention.target_rate,
        intervention.intervention_amount,
        intervention.intervention_currency_id,
        intervention.executed_by
      ]);

      // Apply intervention effects to exchange rate
      if (intervention.target_rate && intervention.currency_id && intervention.intervention_currency_id) {
        await this.applyInterventionEffects(intervention.currency_id, intervention.intervention_currency_id, intervention.target_rate, intervention.intervention_amount || 0);
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async applyInterventionEffects(currencyId: number, interventionCurrencyId: number, targetRate: number, amount: number): Promise<void> {
    // Calculate intervention impact based on amount and market size
    const marketData = await this.pool.query(`
      SELECT daily_volume FROM exchange_rates 
      WHERE base_currency_id = $1 AND quote_currency_id = $2
    `, [currencyId, interventionCurrencyId]);

    const dailyVolume = marketData.rows[0]?.daily_volume || 1000000;
    const interventionImpact = Math.min(0.1, amount / dailyVolume); // Max 10% impact

    // Adjust exchange rate towards target
    const currentRate = await this.pool.query(`
      SELECT exchange_rate FROM exchange_rates 
      WHERE base_currency_id = $1 AND quote_currency_id = $2
    `, [currencyId, interventionCurrencyId]);

    if (currentRate.rows[0]) {
      const current = currentRate.rows[0].exchange_rate;
      const adjustment = (targetRate - current) * interventionImpact;
      const newRate = current + adjustment;

      await this.pool.query(`
        UPDATE exchange_rates 
        SET exchange_rate = $3, last_updated = CURRENT_TIMESTAMP
        WHERE base_currency_id = $1 AND quote_currency_id = $2
      `, [currencyId, interventionCurrencyId, newRate]);
    }
  }

  // Currency Reserves
  async getCurrencyReserves(civilizationId: number): Promise<CurrencyReserve[]> {
    const query = `
      SELECT cr.*, c.currency_code, c.currency_name, c.currency_symbol
      FROM currency_reserves cr
      JOIN currencies c ON cr.currency_id = c.id
      WHERE cr.civilization_id = $1
      ORDER BY cr.reserve_amount DESC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async updateCurrencyReserves(civilizationId: number, currencyCode: string, reserveType: string, amount: number): Promise<CurrencyReserve> {
    const query = `
      INSERT INTO currency_reserves (civilization_id, currency_id, reserve_amount, reserve_type)
      SELECT $1, c.id, $3, $4
      FROM currencies c
      WHERE c.currency_code = $2
      ON CONFLICT (civilization_id, currency_id, reserve_type)
      DO UPDATE SET 
        reserve_amount = $3,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await this.pool.query(query, [civilizationId, currencyCode, amount, reserveType]);
    return result.rows[0];
  }

  // Currency Unions
  async getCurrencyUnions(): Promise<CurrencyUnion[]> {
    const query = `
      SELECT cu.*, c.currency_code as common_currency_code, c.currency_name as common_currency_name
      FROM currency_unions cu
      JOIN currencies c ON cu.common_currency_id = c.id
      WHERE cu.is_active = true
      ORDER BY cu.created_at DESC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async createCurrencyUnion(unionName: string, commonCurrencyCode: string): Promise<CurrencyUnion> {
    const query = `
      INSERT INTO currency_unions (union_name, common_currency_id)
      SELECT $1, c.id
      FROM currencies c
      WHERE c.currency_code = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [unionName, commonCurrencyCode]);
    return result.rows[0];
  }

  async joinCurrencyUnion(unionId: number, civilizationId: number, votingWeight: number = 0.25): Promise<CurrencyUnionMember> {
    const query = `
      INSERT INTO currency_union_members (union_id, civilization_id, voting_weight)
      VALUES ($1, $2, $3)
      ON CONFLICT (union_id, civilization_id)
      DO UPDATE SET 
        is_active = true,
        voting_weight = $3,
        joined_date = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await this.pool.query(query, [unionId, civilizationId, votingWeight]);
    return result.rows[0];
  }

  async leaveCurrencyUnion(unionId: number, civilizationId: number): Promise<void> {
    const query = `
      UPDATE currency_union_members 
      SET is_active = false 
      WHERE union_id = $1 AND civilization_id = $2
    `;
    await this.pool.query(query, [unionId, civilizationId]);
  }

  // Exchange Rate History
  async getExchangeRateHistory(baseCurrency: string, quoteCurrency: string, days: number = 30): Promise<ExchangeRateHistory[]> {
    const query = `
      SELECT erh.*, 
             bc.currency_code as base_currency_code,
             qc.currency_code as quote_currency_code
      FROM exchange_rate_history erh
      JOIN currencies bc ON erh.base_currency_id = bc.id
      JOIN currencies qc ON erh.quote_currency_id = qc.id
      WHERE bc.currency_code = $1 AND qc.currency_code = $2
        AND erh.recorded_at >= NOW() - INTERVAL '${days} days'
      ORDER BY erh.recorded_at DESC
    `;
    const result = await this.pool.query(query, [baseCurrency, quoteCurrency]);
    return result.rows;
  }

  private async recordExchangeRateHistory(baseCurrency: string, quoteCurrency: string, rate: number): Promise<void> {
    const query = `
      INSERT INTO exchange_rate_history (base_currency_id, quote_currency_id, exchange_rate)
      SELECT bc.id, qc.id, $3
      FROM currencies bc, currencies qc
      WHERE bc.currency_code = $1 AND qc.currency_code = $2
    `;
    await this.pool.query(query, [baseCurrency, quoteCurrency, rate]);
  }

  // Analytics and Reporting
  async getCurrencyStrengthIndex(): Promise<any[]> {
    const query = `
      SELECT 
        c.currency_code,
        c.currency_name,
        AVG(er.exchange_rate) as avg_rate,
        AVG(er.volatility) as avg_volatility,
        SUM(er.daily_volume) as total_volume,
        COUNT(*) as pair_count
      FROM currencies c
      JOIN exchange_rates er ON c.id = er.base_currency_id
      WHERE c.is_active = true
      GROUP BY c.id, c.currency_code, c.currency_name
      ORDER BY avg_rate DESC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getCurrencyMarketSummary(): Promise<any> {
    const query = `
      SELECT 
        COUNT(DISTINCT c.id) as total_currencies,
        COUNT(DISTINCT er.id) as total_pairs,
        SUM(er.daily_volume) as total_volume,
        AVG(er.volatility) as avg_volatility,
        COUNT(DISTINCT cu.id) as active_unions
      FROM currencies c
      LEFT JOIN exchange_rates er ON c.id = er.base_currency_id OR c.id = er.quote_currency_id
      LEFT JOIN currency_unions cu ON cu.is_active = true
      WHERE c.is_active = true
    `;
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getReserveAdequacyAssessment(civilizationId: number): Promise<any> {
    const query = `
      SELECT 
        c.currency_code,
        cr.reserve_amount,
        cr.reserve_type,
        cmd.market_cap,
        cmd.circulating_supply,
        (cr.reserve_amount / NULLIF(cmd.circulating_supply, 0)) * 100 as reserve_ratio
      FROM currency_reserves cr
      JOIN currencies c ON cr.currency_id = c.id
      LEFT JOIN currency_market_data cmd ON c.id = cmd.currency_id
      WHERE cr.civilization_id = $1
      ORDER BY reserve_ratio DESC NULLS LAST
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }
}

// Service instance
let currencyExchangeService: CurrencyExchangeService | null = null;

export function getCurrencyExchangeService(): CurrencyExchangeService {
  if (!currencyExchangeService) {
    throw new Error('CurrencyExchangeService not initialized. Call initializeCurrencyExchangeService first.');
  }
  return currencyExchangeService;
}

export function initializeCurrencyExchangeService(pool: Pool): void {
  currencyExchangeService = new CurrencyExchangeService(pool);
}
