import { Pool } from 'pg';
import { 
  GovernmentBudget, 
  BudgetLineItem, 
  TaxCollection, 
  GovernmentExpenditure, 
  FiscalPolicy, 
  DebtInstrument, 
  TreasuryReport 
} from './treasurySchema';

export interface BudgetSummary {
  totalRevenue: number;
  totalExpenditures: number;
  netPosition: number;
  departmentBreakdown: { [department: string]: number };
  fiscalHealth: {
    deficitSurplus: number;
    debtToGdpRatio: number;
    revenueGrowthRate: number;
  };
}

export interface TaxRevenueSummary {
  totalCollected: number;
  collectionsByType: { [taxType: string]: number };
  collectionEfficiency: number;
  uncollectedAmount: number;
  projectedRevenue: number;
}

export interface ExpenditureAuthorization {
  expenditureId: string;
  authorized: boolean;
  reason?: string;
  authorizedBy: string;
  authorizedAt: Date;
}

export interface FiscalHealthMetrics {
  currentDeficit: number;
  debtToGdpRatio: number;
  interestPayments: number;
  revenueGrowth: number;
  expenditureGrowth: number;
  budgetVariance: number;
  creditRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
  fiscalSustainability: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

export class TreasuryService {
  constructor(private pool: Pool) {}

  // ==================== BUDGET MANAGEMENT ====================

  async createBudget(budgetData: Partial<GovernmentBudget>): Promise<GovernmentBudget> {
    const client = await this.pool.connect();
    
    try {
      const budgetId = `budget-${budgetData.campaignId}-${budgetData.fiscalYear}-${Date.now()}`;
      
      const result = await client.query(`
        INSERT INTO government_budgets (
          id, campaign_id, fiscal_year, budget_type,
          projected_revenue, total_allocated, status, approved_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        budgetId,
        budgetData.campaignId,
        budgetData.fiscalYear,
        budgetData.budgetType || 'annual',
        budgetData.projectedRevenue || 0,
        budgetData.totalAllocated || 0,
        budgetData.status || 'draft',
        budgetData.approvedBy
      ]);

      return this.mapBudget(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getBudget(budgetId: string): Promise<GovernmentBudget | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM government_budgets WHERE id = $1',
        [budgetId]
      );

      return result.rows.length > 0 ? this.mapBudget(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  async getCurrentBudget(campaignId: number): Promise<GovernmentBudget | null> {
    const client = await this.pool.connect();
    
    try {
      const currentYear = new Date().getFullYear();
      const result = await client.query(`
        SELECT * FROM government_budgets 
        WHERE campaign_id = $1 AND fiscal_year = $2 AND budget_type = 'annual'
        ORDER BY created_at DESC LIMIT 1
      `, [campaignId, currentYear]);

      return result.rows.length > 0 ? this.mapBudget(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  async updateBudget(budgetId: string, updates: Partial<GovernmentBudget>): Promise<GovernmentBudget> {
    const client = await this.pool.connect();
    
    try {
      const setClause = [];
      const values = [];
      let paramCount = 0;

      if (updates.projectedRevenue !== undefined) {
        setClause.push(`projected_revenue = $${++paramCount}`);
        values.push(updates.projectedRevenue);
      }
      if (updates.totalAllocated !== undefined) {
        setClause.push(`total_allocated = $${++paramCount}`);
        values.push(updates.totalAllocated);
      }
      if (updates.status !== undefined) {
        setClause.push(`status = $${++paramCount}`);
        values.push(updates.status);
      }
      if (updates.departmentAllocations !== undefined) {
        setClause.push(`department_allocations = $${++paramCount}`);
        values.push(JSON.stringify(updates.departmentAllocations));
      }

      setClause.push(`updated_at = NOW()`);
      values.push(budgetId);

      const result = await client.query(`
        UPDATE government_budgets 
        SET ${setClause.join(', ')}
        WHERE id = $${values.length}
        RETURNING *
      `, values);

      return this.mapBudget(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // ==================== BUDGET LINE ITEMS ====================

  async createBudgetLineItem(lineItemData: Partial<BudgetLineItem>): Promise<BudgetLineItem> {
    const client = await this.pool.connect();
    
    try {
      const lineItemId = `line-${lineItemData.budgetId}-${Date.now()}`;
      
      const result = await client.query(`
        INSERT INTO budget_line_items (
          id, budget_id, department, category, subcategory,
          allocated_amount, authorized_by, spending_authority,
          description, priority
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        lineItemId,
        lineItemData.budgetId,
        lineItemData.department,
        lineItemData.category,
        lineItemData.subcategory,
        lineItemData.allocatedAmount || 0,
        lineItemData.authorizedBy,
        lineItemData.spendingAuthority,
        lineItemData.description,
        lineItemData.priority || 'medium'
      ]);

      return this.mapBudgetLineItem(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getBudgetLineItems(budgetId: string, department?: string): Promise<BudgetLineItem[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM budget_line_items WHERE budget_id = $1';
      const params = [budgetId];

      if (department) {
        query += ' AND department = $2';
        params.push(department);
      }

      query += ' ORDER BY department, category';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapBudgetLineItem(row));
    } finally {
      client.release();
    }
  }

  async updateBudgetLineItem(lineItemId: string, updates: Partial<BudgetLineItem>): Promise<BudgetLineItem> {
    const client = await this.pool.connect();
    
    try {
      const setClause = [];
      const values = [];
      let paramCount = 0;

      if (updates.allocatedAmount !== undefined) {
        setClause.push(`allocated_amount = $${++paramCount}`);
        values.push(updates.allocatedAmount);
      }
      if (updates.spentAmount !== undefined) {
        setClause.push(`spent_amount = $${++paramCount}`);
        values.push(updates.spentAmount);
        
        // Update remaining amount
        setClause.push(`remaining_amount = allocated_amount - $${paramCount}`);
      }
      if (updates.status !== undefined) {
        setClause.push(`status = $${++paramCount}`);
        values.push(updates.status);
      }

      setClause.push(`updated_at = NOW()`);
      values.push(lineItemId);

      const result = await client.query(`
        UPDATE budget_line_items 
        SET ${setClause.join(', ')}
        WHERE id = $${values.length}
        RETURNING *
      `, values);

      return this.mapBudgetLineItem(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // ==================== TAX COLLECTION ====================

  async recordTaxCollection(collectionData: Partial<TaxCollection>): Promise<TaxCollection> {
    const client = await this.pool.connect();
    
    try {
      const collectionId = `tax-${collectionData.campaignId}-${Date.now()}`;
      
      const result = await client.query(`
        INSERT INTO tax_collections (
          id, campaign_id, tick_id, tax_type, tax_source,
          base_amount, tax_rate, collected_amount, collection_efficiency,
          uncollected_amount, collected_by, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        collectionId,
        collectionData.campaignId,
        collectionData.tickId,
        collectionData.taxType,
        collectionData.taxSource,
        collectionData.baseAmount || 0,
        collectionData.taxRate || 0,
        collectionData.collectedAmount || 0,
        collectionData.collectionEfficiency || 1.0,
        collectionData.uncollectedAmount || 0,
        collectionData.collectedBy || 'treasury-system',
        collectionData.notes
      ]);

      return this.mapTaxCollection(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getTaxRevenueSummary(campaignId: number, periodDays: number = 30): Promise<TaxRevenueSummary> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          tax_type,
          SUM(collected_amount) as total_collected,
          SUM(uncollected_amount) as total_uncollected,
          AVG(collection_efficiency) as avg_efficiency,
          COUNT(*) as collection_count
        FROM tax_collections 
        WHERE campaign_id = $1 
        AND collection_date >= NOW() - INTERVAL '${periodDays} days'
        GROUP BY tax_type
      `, [campaignId]);

      const collectionsByType: { [key: string]: number } = {};
      let totalCollected = 0;
      let totalUncollected = 0;
      let totalEfficiency = 0;
      let typeCount = 0;

      for (const row of result.rows) {
        collectionsByType[row.tax_type] = Number(row.total_collected);
        totalCollected += Number(row.total_collected);
        totalUncollected += Number(row.total_uncollected);
        totalEfficiency += Number(row.avg_efficiency);
        typeCount++;
      }

      return {
        totalCollected,
        collectionsByType,
        collectionEfficiency: typeCount > 0 ? totalEfficiency / typeCount : 0,
        uncollectedAmount: totalUncollected,
        projectedRevenue: totalCollected * 1.1 // Simple projection
      };
    } finally {
      client.release();
    }
  }

  // ==================== EXPENDITURE MANAGEMENT ====================

  async requestExpenditure(expenditureData: Partial<GovernmentExpenditure>): Promise<GovernmentExpenditure> {
    const client = await this.pool.connect();
    
    try {
      const expenditureId = `exp-${expenditureData.campaignId}-${Date.now()}`;
      
      const result = await client.query(`
        INSERT INTO government_expenditures (
          id, campaign_id, budget_id, line_item_id, department, category,
          amount, requested_by, authorized_by, approved_by, purpose, description,
          expenditure_type, payment_method, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        expenditureId,
        expenditureData.campaignId,
        expenditureData.budgetId,
        expenditureData.lineItemId,
        expenditureData.department,
        expenditureData.category,
        expenditureData.amount,
        expenditureData.requestedBy,
        expenditureData.authorizedBy,
        expenditureData.approvedBy,
        expenditureData.purpose,
        expenditureData.description,
        expenditureData.expenditureType || 'operational',
        expenditureData.paymentMethod || 'direct',
        'pending'
      ]);

      return this.mapExpenditure(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async authorizeExpenditure(expenditureId: string, authorizingOfficer: string): Promise<ExpenditureAuthorization> {
    const client = await this.pool.connect();
    
    try {
      // Check if expenditure exists and get details
      const expenditureResult = await client.query(
        'SELECT * FROM government_expenditures WHERE id = $1',
        [expenditureId]
      );

      if (expenditureResult.rows.length === 0) {
        throw new Error('Expenditure not found');
      }

      const expenditure = expenditureResult.rows[0];

      // Check budget availability
      const lineItemResult = await client.query(
        'SELECT remaining_amount FROM budget_line_items WHERE id = $1',
        [expenditure.line_item_id]
      );

      if (lineItemResult.rows.length === 0) {
        throw new Error('Budget line item not found');
      }

      const remainingAmount = Number(lineItemResult.rows[0].remaining_amount);
      const requestedAmount = Number(expenditure.amount);

      if (remainingAmount < requestedAmount) {
        return {
          expenditureId,
          authorized: false,
          reason: `Insufficient budget. Available: ${remainingAmount}, Requested: ${requestedAmount}`,
          authorizedBy: authorizingOfficer,
          authorizedAt: new Date()
        };
      }

      // Authorize the expenditure
      await client.query(`
        UPDATE government_expenditures 
        SET status = 'approved', approved_at = NOW(), approved_by = $2
        WHERE id = $1
      `, [expenditureId, authorizingOfficer]);

      // Update budget line item
      await client.query(`
        UPDATE budget_line_items 
        SET spent_amount = spent_amount + $2, remaining_amount = remaining_amount - $2
        WHERE id = $1
      `, [expenditure.line_item_id, requestedAmount]);

      return {
        expenditureId,
        authorized: true,
        authorizedBy: authorizingOfficer,
        authorizedAt: new Date()
      };
    } finally {
      client.release();
    }
  }

  async getExpenditures(campaignId: number, department?: string, status?: string): Promise<GovernmentExpenditure[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM government_expenditures WHERE campaign_id = $1';
      const params = [campaignId];
      let paramCount = 1;

      if (department) {
        query += ` AND department = $${++paramCount}`;
        params.push(department);
      }

      if (status) {
        query += ` AND status = $${++paramCount}`;
        params.push(status);
      }

      query += ' ORDER BY requested_at DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapExpenditure(row));
    } finally {
      client.release();
    }
  }

  // ==================== FISCAL POLICY MANAGEMENT ====================

  async createFiscalPolicy(policyData: Partial<FiscalPolicy>): Promise<FiscalPolicy> {
    const client = await this.pool.connect();
    
    try {
      const policyId = `policy-${policyData.campaignId}-${Date.now()}`;
      
      const result = await client.query(`
        INSERT INTO fiscal_policies (
          id, campaign_id, policy_name, policy_type, description,
          parameters, projected_impact, implementation_date, status, proposed_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        policyId,
        policyData.campaignId,
        policyData.policyName,
        policyData.policyType,
        policyData.description,
        JSON.stringify(policyData.parameters || {}),
        JSON.stringify(policyData.projectedImpact || {}),
        policyData.implementationDate || new Date(),
        policyData.status || 'draft',
        policyData.proposedBy
      ]);

      return this.mapFiscalPolicy(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getFiscalPolicies(campaignId: number, policyType?: string): Promise<FiscalPolicy[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM fiscal_policies WHERE campaign_id = $1';
      const params = [campaignId];

      if (policyType) {
        query += ' AND policy_type = $2';
        params.push(policyType);
      }

      query += ' ORDER BY implementation_date DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapFiscalPolicy(row));
    } finally {
      client.release();
    }
  }

  // ==================== FISCAL HEALTH & REPORTING ====================

  async calculateFiscalHealth(campaignId: number): Promise<FiscalHealthMetrics> {
    const client = await this.pool.connect();
    
    try {
      // Get current budget
      const budgetResult = await client.query(`
        SELECT * FROM government_budgets 
        WHERE campaign_id = $1 AND status = 'active'
        ORDER BY fiscal_year DESC LIMIT 1
      `, [campaignId]);

      if (budgetResult.rows.length === 0) {
        throw new Error('No active budget found');
      }

      const budget = budgetResult.rows[0];
      
      // Calculate key metrics
      const currentDeficit = Number(budget.actual_revenue) - Number(budget.total_spent);
      const debtToGdpRatio = Number(budget.debt_to_gdp_ratio);
      
      // Get debt service payments
      const debtResult = await client.query(`
        SELECT SUM(next_payment_amount) as total_debt_service
        FROM debt_instruments 
        WHERE campaign_id = $1 AND status = 'active'
      `, [campaignId]);
      
      const interestPayments = Number(debtResult.rows[0]?.total_debt_service || 0);

      // Calculate growth rates (simplified)
      const revenueGrowth = Number(budget.revenue_variance) / Number(budget.projected_revenue);
      const expenditureGrowth = (Number(budget.total_spent) - Number(budget.total_allocated)) / Number(budget.total_allocated);
      const budgetVariance = (Number(budget.actual_revenue) - Number(budget.projected_revenue)) / Number(budget.projected_revenue);

      // Determine credit rating and fiscal sustainability
      let creditRating: FiscalHealthMetrics['creditRating'] = 'AAA';
      let fiscalSustainability: FiscalHealthMetrics['fiscalSustainability'] = 'excellent';

      if (debtToGdpRatio > 0.6 || currentDeficit < -100000) {
        creditRating = 'AA';
        fiscalSustainability = 'good';
      }
      if (debtToGdpRatio > 0.8 || currentDeficit < -200000) {
        creditRating = 'A';
        fiscalSustainability = 'fair';
      }
      if (debtToGdpRatio > 1.0 || currentDeficit < -300000) {
        creditRating = 'BBB';
        fiscalSustainability = 'poor';
      }
      if (debtToGdpRatio > 1.2 || currentDeficit < -500000) {
        creditRating = 'B';
        fiscalSustainability = 'critical';
      }

      return {
        currentDeficit,
        debtToGdpRatio,
        interestPayments,
        revenueGrowth,
        expenditureGrowth,
        budgetVariance,
        creditRating,
        fiscalSustainability
      };
    } finally {
      client.release();
    }
  }

  async generateBudgetSummary(campaignId: number): Promise<BudgetSummary> {
    const client = await this.pool.connect();
    
    try {
      // Get revenue summary
      const revenueResult = await client.query(`
        SELECT SUM(collected_amount) as total_revenue
        FROM tax_collections 
        WHERE campaign_id = $1 
        AND collection_date >= DATE_TRUNC('year', NOW())
      `, [campaignId]);

      // Get expenditure summary by department
      const expenditureResult = await client.query(`
        SELECT department, SUM(amount) as total_spent
        FROM government_expenditures 
        WHERE campaign_id = $1 
        AND status IN ('approved', 'disbursed', 'completed')
        AND requested_at >= DATE_TRUNC('year', NOW())
        GROUP BY department
      `, [campaignId]);

      const totalRevenue = Number(revenueResult.rows[0]?.total_revenue || 0);
      let totalExpenditures = 0;
      const departmentBreakdown: { [department: string]: number } = {};

      for (const row of expenditureResult.rows) {
        const amount = Number(row.total_spent);
        departmentBreakdown[row.department] = amount;
        totalExpenditures += amount;
      }

      const netPosition = totalRevenue - totalExpenditures;

      // Get fiscal health metrics
      const fiscalHealth = await this.calculateFiscalHealth(campaignId);

      return {
        totalRevenue,
        totalExpenditures,
        netPosition,
        departmentBreakdown,
        fiscalHealth: {
          deficitSurplus: fiscalHealth.currentDeficit,
          debtToGdpRatio: fiscalHealth.debtToGdpRatio,
          revenueGrowthRate: fiscalHealth.revenueGrowth
        }
      };
    } finally {
      client.release();
    }
  }

  // ==================== INTEGRATION WITH EXISTING SYSTEMS ====================

  async collectTaxesFromHouseholds(campaignId: number, tickId: number): Promise<TaxCollection[]> {
    const client = await this.pool.connect();
    
    try {
      // Get household economic data
      const householdResult = await client.query(`
        SELECT tier_name, total_income, population_count
        FROM household_economic_status 
        WHERE campaign_id = $1
      `, [campaignId]);

      const collections: TaxCollection[] = [];

      for (const household of householdResult.rows) {
        const incomeBase = Number(household.total_income);
        const taxRate = 0.15; // 15% income tax rate
        const collectedAmount = incomeBase * taxRate;

        const collection = await this.recordTaxCollection({
          campaignId,
          tickId,
          taxType: 'income_tax',
          taxSource: `household-${household.tier_name}`,
          baseAmount: incomeBase,
          taxRate,
          collectedAmount,
          collectionEfficiency: 0.95, // 95% collection efficiency
          uncollectedAmount: collectedAmount * 0.05,
          collectedBy: 'treasury-automated-system'
        });

        collections.push(collection);
      }

      return collections;
    } finally {
      client.release();
    }
  }

  async collectCorporateTaxes(campaignId: number, tickId: number): Promise<TaxCollection[]> {
    const client = await this.pool.connect();
    
    try {
      // Get corporate data
      const corpResult = await client.query(`
        SELECT c.id, c.name, COALESCE(SUM(ck.output * ck.margin), 0) as profit
        FROM corps c
        LEFT JOIN corp_kpis ck ON c.id = ck.corp_id
        WHERE ck.ts >= NOW() - INTERVAL '30 days'
        GROUP BY c.id, c.name
      `);

      const collections: TaxCollection[] = [];

      for (const corp of corpResult.rows) {
        const profit = Number(corp.profit);
        if (profit <= 0) continue;

        const taxRate = 0.2; // 20% corporate tax rate
        const collectedAmount = profit * taxRate;

        const collection = await this.recordTaxCollection({
          campaignId,
          tickId,
          taxType: 'corp_tax',
          taxSource: `corp-${corp.id}`,
          baseAmount: profit,
          taxRate,
          collectedAmount,
          collectionEfficiency: 0.9, // 90% collection efficiency for corps
          uncollectedAmount: collectedAmount * 0.1,
          collectedBy: 'treasury-automated-system'
        });

        collections.push(collection);
      }

      return collections;
    } finally {
      client.release();
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private mapBudget(row: any): GovernmentBudget {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      fiscalYear: row.fiscal_year,
      budgetType: row.budget_type,
      projectedRevenue: Number(row.projected_revenue),
      actualRevenue: Number(row.actual_revenue),
      revenueVariance: Number(row.revenue_variance),
      totalAllocated: Number(row.total_allocated),
      totalSpent: Number(row.total_spent),
      remainingBalance: Number(row.remaining_balance),
      departmentAllocations: row.department_allocations || {},
      deficitSurplus: Number(row.deficit_surplus),
      debtToGdpRatio: Number(row.debt_to_gdp_ratio),
      status: row.status,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapBudgetLineItem(row: any): BudgetLineItem {
    return {
      id: row.id,
      budgetId: row.budget_id,
      department: row.department,
      category: row.category,
      subcategory: row.subcategory,
      allocatedAmount: Number(row.allocated_amount),
      spentAmount: Number(row.spent_amount),
      remainingAmount: Number(row.remaining_amount),
      encumberedAmount: Number(row.encumbered_amount),
      authorizedBy: row.authorized_by,
      spendingAuthority: row.spending_authority,
      status: row.status,
      priority: row.priority,
      description: row.description,
      justification: row.justification,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapTaxCollection(row: any): TaxCollection {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      tickId: row.tick_id,
      taxType: row.tax_type,
      taxSource: row.tax_source,
      baseAmount: Number(row.base_amount),
      taxRate: Number(row.tax_rate),
      collectedAmount: Number(row.collected_amount),
      collectionEfficiency: Number(row.collection_efficiency),
      uncollectedAmount: Number(row.uncollected_amount),
      regionId: row.region_id,
      systemId: row.system_id,
      collectionDate: row.collection_date,
      collectedBy: row.collected_by,
      notes: row.notes
    };
  }

  private mapExpenditure(row: any): GovernmentExpenditure {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      budgetId: row.budget_id,
      lineItemId: row.line_item_id,
      department: row.department,
      category: row.category,
      subcategory: row.subcategory,
      amount: Number(row.amount),
      requestedBy: row.requested_by,
      authorizedBy: row.authorized_by,
      approvedBy: row.approved_by,
      purpose: row.purpose,
      description: row.description,
      beneficiary: row.beneficiary,
      expenditureType: row.expenditure_type,
      paymentMethod: row.payment_method,
      status: row.status,
      requestedAt: row.requested_at,
      authorizedAt: row.authorized_at,
      approvedAt: row.approved_at,
      disbursedAt: row.disbursed_at,
      completedAt: row.completed_at
    };
  }

  private mapFiscalPolicy(row: any): FiscalPolicy {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      policyName: row.policy_name,
      policyType: row.policy_type,
      description: row.description,
      parameters: row.parameters || {},
      projectedImpact: row.projected_impact || {},
      implementationDate: row.implementation_date,
      expirationDate: row.expiration_date,
      status: row.status,
      proposedBy: row.proposed_by,
      approvedBy: row.approved_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
