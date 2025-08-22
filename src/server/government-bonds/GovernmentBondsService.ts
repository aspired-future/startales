/**
 * Government Bonds Service
 * Handles bond issuance, trading, and management operations
 */

import { Pool } from 'pg';

export interface GovernmentBond {
  id: number;
  civilizationId: string;
  bondSeries: string;
  bondType: 'treasury' | 'infrastructure' | 'war' | 'development' | 'green';
  issueDate: Date;
  maturityDate: Date;
  currencyCode: string;
  faceValue: number;
  couponRate: number;
  issuePrice: number;
  totalIssued: number;
  totalOutstanding: number;
  callable: boolean;
  callPrice?: number;
  callDate?: Date;
  creditRating: string;
  purpose: string;
  collateralType: string;
  taxTreatment: string;
  minimumPurchase: number;
  isActive: boolean;
}

export interface BondHolder {
  id: number;
  bondId: number;
  holderType: 'government' | 'bank' | 'fund' | 'individual' | 'foreign_gov';
  holderId?: string;
  holderName: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentValue: number;
  accruedInterest: number;
  lastInterestPayment?: Date;
  isActive: boolean;
}

export interface BondMarketPrice {
  id: number;
  bondId: number;
  priceDate: Date;
  bidPrice: number;
  askPrice: number;
  lastTradePrice?: number;
  volumeTraded: number;
  yieldToMaturity: number;
  creditSpread: number;
  duration: number;
}

export interface BondAuction {
  id: number;
  civilizationId: string;
  auctionType: 'competitive' | 'non_competitive' | 'dutch';
  bondSeries: string;
  auctionDate: Date;
  settlementDate: Date;
  bondsOffered: number;
  bondsSold: number;
  averagePrice: number;
  bidToCoverRatio: number;
  auctionStatus: 'scheduled' | 'open' | 'closed' | 'settled';
  totalProceeds: number;
}

export interface BondIssuanceRequest {
  civilizationId: string;
  bondType: string;
  purpose: string;
  faceValue: number;
  couponRate: number;
  maturityYears: number;
  currencyCode: string;
  totalAmount: number;
  callable?: boolean;
  callPrice?: number;
  callYears?: number;
  collateralType?: string;
  taxTreatment?: string;
}

export interface DebtServiceSummary {
  totalOutstandingDebt: number;
  monthlyDebtService: number;
  annualDebtService: number;
  debtToGdpRatio: number;
  averageInterestRate: number;
  averageMaturity: number;
  currencyBreakdown: { [currency: string]: number };
  nextPaymentDate: Date;
  nextPaymentAmount: number;
}

export class GovernmentBondsService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Get all active bonds for a civilization
   */
  async getBondsByCivilization(civilizationId: string): Promise<GovernmentBond[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          id, civilization_id, bond_series, bond_type, issue_date, maturity_date,
          currency_code, face_value, coupon_rate, issue_price, total_issued,
          total_outstanding, callable, call_price, call_date, credit_rating,
          purpose, collateral_type, tax_treatment, minimum_purchase, is_active,
          created_at, updated_at
        FROM government_bonds 
        WHERE civilization_id = $1 AND is_active = true
        ORDER BY issue_date DESC
      `, [civilizationId]);

      return result.rows.map(row => ({
        id: row.id,
        civilizationId: row.civilization_id,
        bondSeries: row.bond_series,
        bondType: row.bond_type,
        issueDate: row.issue_date,
        maturityDate: row.maturity_date,
        currencyCode: row.currency_code,
        faceValue: parseFloat(row.face_value),
        couponRate: parseFloat(row.coupon_rate),
        issuePrice: parseFloat(row.issue_price),
        totalIssued: parseInt(row.total_issued),
        totalOutstanding: parseInt(row.total_outstanding),
        callable: row.callable,
        callPrice: row.call_price ? parseFloat(row.call_price) : undefined,
        callDate: row.call_date,
        creditRating: row.credit_rating,
        purpose: row.purpose,
        collateralType: row.collateral_type,
        taxTreatment: row.tax_treatment,
        minimumPurchase: parseFloat(row.minimum_purchase),
        isActive: row.is_active
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Issue new government bonds
   */
  async issueBonds(request: BondIssuanceRequest): Promise<number> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const issueDate = new Date();
      const maturityDate = new Date();
      maturityDate.setFullYear(issueDate.getFullYear() + request.maturityYears);

      let callDate = null;
      if (request.callable && request.callYears) {
        callDate = new Date();
        callDate.setFullYear(issueDate.getFullYear() + request.callYears);
      }

      // Generate bond series identifier
      const bondSeries = `${request.bondType.toUpperCase()}-${issueDate.getFullYear()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

      // Calculate number of bonds to issue
      const totalBonds = Math.floor(request.totalAmount / request.faceValue);
      const issuePrice = request.faceValue * 0.98; // Slight discount

      const result = await client.query(`
        INSERT INTO government_bonds (
          civilization_id, bond_series, bond_type, issue_date, maturity_date,
          currency_code, face_value, coupon_rate, issue_price, total_issued,
          total_outstanding, callable, call_price, call_date, credit_rating,
          purpose, collateral_type, tax_treatment, minimum_purchase
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING id
      `, [
        request.civilizationId,
        bondSeries,
        request.bondType,
        issueDate,
        maturityDate,
        request.currencyCode,
        request.faceValue,
        request.couponRate,
        issuePrice,
        totalBonds,
        totalBonds,
        request.callable || false,
        request.callPrice,
        callDate,
        'A+', // Default rating for new issues
        request.purpose,
        request.collateralType || 'general_obligation',
        request.taxTreatment || 'taxable',
        request.faceValue
      ]);

      const bondId = result.rows[0].id;

      // Create interest payment schedule
      for (let year = 1; year <= request.maturityYears; year++) {
        const paymentDate = new Date(issueDate);
        paymentDate.setFullYear(paymentDate.getFullYear() + year);
        
        await client.query(`
          INSERT INTO bond_interest_payments (
            bond_id, payment_date, coupon_rate, payment_per_bond, total_payment,
            bonds_outstanding, currency_code, payment_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          bondId,
          paymentDate,
          request.couponRate,
          request.faceValue * request.couponRate,
          totalBonds * request.faceValue * request.couponRate,
          totalBonds,
          request.currencyCode,
          'scheduled'
        ]);
      }

      // Create debt service schedule entries
      const monthlyPayments = request.maturityYears * 12;
      const monthlyInterest = (totalBonds * request.faceValue * request.couponRate) / 12;

      for (let month = 1; month <= monthlyPayments; month++) {
        const paymentDate = new Date(issueDate);
        paymentDate.setMonth(paymentDate.getMonth() + month);
        
        const isMaturity = month === monthlyPayments;
        const paymentType = isMaturity ? 'both' : 'interest';
        const amount = isMaturity ? (monthlyInterest + (totalBonds * request.faceValue)) : monthlyInterest;

        await client.query(`
          INSERT INTO debt_service_schedule (
            civilization_id, payment_date, payment_type, bond_series,
            currency_code, scheduled_amount
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          request.civilizationId,
          paymentDate,
          paymentType,
          bondSeries,
          request.currencyCode,
          amount
        ]);
      }

      await client.query('COMMIT');
      return bondId;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get bond market prices for a specific bond
   */
  async getBondMarketPrices(bondId: number, days: number = 30): Promise<BondMarketPrice[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          id, bond_id, price_date, bid_price, ask_price, last_trade_price,
          volume_traded, yield_to_maturity, credit_spread, duration
        FROM bond_market_prices 
        WHERE bond_id = $1 
          AND price_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY price_date DESC
      `, [bondId]);

      return result.rows.map(row => ({
        id: row.id,
        bondId: row.bond_id,
        priceDate: row.price_date,
        bidPrice: parseFloat(row.bid_price),
        askPrice: parseFloat(row.ask_price),
        lastTradePrice: row.last_trade_price ? parseFloat(row.last_trade_price) : undefined,
        volumeTraded: parseInt(row.volume_traded),
        yieldToMaturity: parseFloat(row.yield_to_maturity),
        creditSpread: parseFloat(row.credit_spread),
        duration: parseFloat(row.duration)
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get debt service summary for a civilization
   */
  async getDebtServiceSummary(civilizationId: string): Promise<DebtServiceSummary> {
    const client = await this.pool.connect();
    try {
      // Get total outstanding debt
      const debtResult = await client.query(`
        SELECT 
          SUM(total_outstanding * face_value) as total_debt,
          AVG(coupon_rate) as avg_rate,
          AVG(EXTRACT(YEAR FROM maturity_date) - EXTRACT(YEAR FROM CURRENT_DATE)) as avg_maturity,
          currency_code,
          SUM(total_outstanding * face_value) as currency_amount
        FROM government_bonds 
        WHERE civilization_id = $1 AND is_active = true
        GROUP BY currency_code
      `, [civilizationId]);

      let totalOutstandingDebt = 0;
      let averageInterestRate = 0;
      let averageMaturity = 0;
      const currencyBreakdown: { [currency: string]: number } = {};

      if (debtResult.rows.length > 0) {
        totalOutstandingDebt = debtResult.rows.reduce((sum, row) => sum + parseFloat(row.total_debt || 0), 0);
        averageInterestRate = debtResult.rows.reduce((sum, row) => sum + parseFloat(row.avg_rate || 0), 0) / debtResult.rows.length;
        averageMaturity = debtResult.rows.reduce((sum, row) => sum + parseFloat(row.avg_maturity || 0), 0) / debtResult.rows.length;

        debtResult.rows.forEach(row => {
          currencyBreakdown[row.currency_code] = parseFloat(row.currency_amount);
        });
      }

      // Get upcoming debt service
      const serviceResult = await client.query(`
        SELECT 
          MIN(payment_date) as next_payment_date,
          SUM(CASE WHEN payment_date >= CURRENT_DATE AND payment_date < CURRENT_DATE + INTERVAL '1 month' THEN scheduled_amount ELSE 0 END) as monthly_service,
          SUM(CASE WHEN payment_date >= CURRENT_DATE AND payment_date < CURRENT_DATE + INTERVAL '1 year' THEN scheduled_amount ELSE 0 END) as annual_service
        FROM debt_service_schedule 
        WHERE civilization_id = $1 AND payment_date >= CURRENT_DATE
      `, [civilizationId]);

      const serviceRow = serviceResult.rows[0];
      const monthlyDebtService = parseFloat(serviceRow.monthly_service || 0);
      const annualDebtService = parseFloat(serviceRow.annual_service || 0);
      const nextPaymentDate = serviceRow.next_payment_date || new Date();

      // Get next payment amount
      const nextPaymentResult = await client.query(`
        SELECT scheduled_amount
        FROM debt_service_schedule 
        WHERE civilization_id = $1 AND payment_date = $2
        LIMIT 1
      `, [civilizationId, nextPaymentDate]);

      const nextPaymentAmount = nextPaymentResult.rows.length > 0 ? 
        parseFloat(nextPaymentResult.rows[0].scheduled_amount) : 0;

      // Estimate debt-to-GDP ratio (simplified calculation)
      const debtToGdpRatio = totalOutstandingDebt / (totalOutstandingDebt * 0.15); // Placeholder calculation

      return {
        totalOutstandingDebt,
        monthlyDebtService,
        annualDebtService,
        debtToGdpRatio,
        averageInterestRate,
        averageMaturity,
        currencyBreakdown,
        nextPaymentDate,
        nextPaymentAmount
      };

    } finally {
      client.release();
    }
  }

  /**
   * Get bond holders for a specific bond
   */
  async getBondHolders(bondId: number): Promise<BondHolder[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          id, bond_id, holder_type, holder_id, holder_name, quantity,
          purchase_price, purchase_date, current_value, accrued_interest,
          last_interest_payment, is_active
        FROM bond_holders 
        WHERE bond_id = $1 AND is_active = true
        ORDER BY quantity DESC
      `, [bondId]);

      return result.rows.map(row => ({
        id: row.id,
        bondId: row.bond_id,
        holderType: row.holder_type,
        holderId: row.holder_id,
        holderName: row.holder_name,
        quantity: parseInt(row.quantity),
        purchasePrice: parseFloat(row.purchase_price),
        purchaseDate: row.purchase_date,
        currentValue: parseFloat(row.current_value),
        accruedInterest: parseFloat(row.accrued_interest),
        lastInterestPayment: row.last_interest_payment,
        isActive: row.is_active
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get recent bond auctions for a civilization
   */
  async getBondAuctions(civilizationId: string, limit: number = 10): Promise<BondAuction[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          id, civilization_id, auction_type, bond_series, auction_date,
          settlement_date, bonds_offered, bonds_sold, average_price,
          bid_to_cover_ratio, auction_status, total_proceeds
        FROM bond_auctions 
        WHERE civilization_id = $1
        ORDER BY auction_date DESC
        LIMIT $2
      `, [civilizationId, limit]);

      return result.rows.map(row => ({
        id: row.id,
        civilizationId: row.civilization_id,
        auctionType: row.auction_type,
        bondSeries: row.bond_series,
        auctionDate: row.auction_date,
        settlementDate: row.settlement_date,
        bondsOffered: parseInt(row.bonds_offered),
        bondsSold: parseInt(row.bonds_sold),
        averagePrice: parseFloat(row.average_price),
        bidToCoverRatio: parseFloat(row.bid_to_cover_ratio),
        auctionStatus: row.auction_status,
        totalProceeds: parseFloat(row.total_proceeds)
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Update bond market prices
   */
  async updateBondMarketPrice(bondId: number, bidPrice: number, askPrice: number, lastTradePrice?: number, volume?: number): Promise<void> {
    const client = await this.pool.connect();
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await client.query(`
        INSERT INTO bond_market_prices (
          bond_id, price_date, bid_price, ask_price, last_trade_price, volume_traded
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (bond_id, price_date) 
        DO UPDATE SET 
          bid_price = EXCLUDED.bid_price,
          ask_price = EXCLUDED.ask_price,
          last_trade_price = EXCLUDED.last_trade_price,
          volume_traded = EXCLUDED.volume_traded
      `, [bondId, today, bidPrice, askPrice, lastTradePrice, volume || 0]);
    } finally {
      client.release();
    }
  }

  /**
   * Calculate bond yield to maturity
   */
  calculateYieldToMaturity(faceValue: number, couponRate: number, currentPrice: number, yearsToMaturity: number): number {
    // Simplified YTM calculation using approximation formula
    const annualCoupon = faceValue * couponRate;
    const approximateYTM = (annualCoupon + (faceValue - currentPrice) / yearsToMaturity) / 
                          ((faceValue + currentPrice) / 2);
    return approximateYTM;
  }

  /**
   * Get credit rating for a civilization
   */
  async getCreditRating(civilizationId: string): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT rating_agency, rating, outlook, rating_date, rating_rationale
        FROM credit_ratings 
        WHERE civilization_id = $1 AND is_current = true
        ORDER BY rating_date DESC
        LIMIT 1
      `, [civilizationId]);

      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}
