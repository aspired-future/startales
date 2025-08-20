import { Pool } from 'pg';

/**
 * Treasury Database Schema
 * 
 * Integrates with existing systems:
 * - tax_rates table (corp_tax, tariff_default, vat)
 * - households (income sources)
 * - corps (corporate tax base)
 * - tariffs (trade revenue)
 * - cabinet_members (Treasury Secretary authority)
 */

export interface GovernmentBudget {
  id: string;
  campaignId: number;
  fiscalYear: number;
  budgetType: 'annual' | 'supplemental' | 'emergency';
  
  // Revenue Projections
  projectedRevenue: number;
  actualRevenue: number;
  revenueVariance: number;
  
  // Expenditure Allocations
  totalAllocated: number;
  totalSpent: number;
  remainingBalance: number;
  
  // Department Allocations
  departmentAllocations: {
    [department: string]: {
      allocated: number;
      spent: number;
      remaining: number;
      percentage: number;
    };
  };
  
  // Fiscal Health Metrics
  deficitSurplus: number;
  debtToGdpRatio: number;
  
  // Approval & Status
  status: 'draft' | 'proposed' | 'approved' | 'active' | 'closed';
  approvedBy: string;
  approvedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetLineItem {
  id: string;
  budgetId: string;
  department: string;
  category: string;
  subcategory?: string;
  
  // Financial Details
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  encumberedAmount: number; // Committed but not yet spent
  
  // Authorization
  authorizedBy: string;
  spendingAuthority: string; // Cabinet member with spending authority
  
  // Status & Tracking
  status: 'active' | 'frozen' | 'transferred' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  // Metadata
  description: string;
  justification?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxCollection {
  id: string;
  campaignId: number;
  tickId: number;
  
  // Tax Details
  taxType: 'corp_tax' | 'vat' | 'tariff' | 'income_tax' | 'property_tax' | 'other';
  taxSource: string; // Source identifier (corp_id, household_tier, trade_route, etc.)
  
  // Collection Details
  baseAmount: number; // Amount before tax rate
  taxRate: number; // Applied tax rate
  collectedAmount: number; // Actual collected amount
  
  // Collection Efficiency
  collectionEfficiency: number; // 0.0 to 1.0
  uncollectedAmount: number;
  
  // Geographic/Administrative
  regionId?: number;
  systemId?: number;
  
  // Metadata
  collectionDate: Date;
  collectedBy: string; // Treasury official/system
  notes?: string;
}

export interface GovernmentExpenditure {
  id: string;
  campaignId: number;
  budgetId: string;
  lineItemId: string;
  
  // Expenditure Details
  department: string;
  category: string;
  subcategory?: string;
  amount: number;
  
  // Authorization Chain
  requestedBy: string;
  authorizedBy: string; // Cabinet member
  approvedBy: string; // Treasury Secretary or delegate
  
  // Purpose & Justification
  purpose: string;
  description: string;
  beneficiary?: string; // Who/what receives the funds
  
  // Tracking
  expenditureType: 'operational' | 'capital' | 'transfer' | 'debt_service' | 'emergency';
  paymentMethod: 'direct' | 'contract' | 'grant' | 'subsidy';
  
  // Status
  status: 'pending' | 'approved' | 'disbursed' | 'completed' | 'cancelled';
  
  // Dates
  requestedAt: Date;
  authorizedAt?: Date;
  approvedAt?: Date;
  disbursedAt?: Date;
  completedAt?: Date;
}

export interface FiscalPolicy {
  id: string;
  campaignId: number;
  
  // Policy Details
  policyName: string;
  policyType: 'tax_policy' | 'spending_policy' | 'debt_policy' | 'monetary_policy';
  description: string;
  
  // Policy Parameters
  parameters: {
    [key: string]: any;
  };
  
  // Economic Impact
  projectedImpact: {
    revenueImpact: number;
    expenditureImpact: number;
    gdpImpact: number;
    employmentImpact: number;
  };
  
  // Implementation
  implementationDate: Date;
  expirationDate?: Date;
  status: 'draft' | 'proposed' | 'approved' | 'active' | 'expired' | 'repealed';
  
  // Authority
  proposedBy: string;
  approvedBy: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtInstrument {
  id: string;
  campaignId: number;
  
  // Debt Details
  instrumentType: 'bond' | 'note' | 'bill' | 'loan' | 'other';
  principalAmount: number;
  interestRate: number;
  maturityDate: Date;
  
  // Current Status
  outstandingBalance: number;
  accruedInterest: number;
  
  // Payment Schedule
  paymentFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  nextPaymentDate: Date;
  nextPaymentAmount: number;
  
  // Metadata
  issueDate: Date;
  issuedBy: string;
  purpose: string;
  
  // Status
  status: 'active' | 'matured' | 'defaulted' | 'refinanced';
}

export interface TreasuryReport {
  id: string;
  campaignId: number;
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  
  // Reporting Period
  periodStart: Date;
  periodEnd: Date;
  
  // Financial Summary
  totalRevenue: number;
  totalExpenditures: number;
  netPosition: number;
  
  // Revenue Breakdown
  revenueBySource: {
    [source: string]: number;
  };
  
  // Expenditure Breakdown
  expenditureByDepartment: {
    [department: string]: number;
  };
  
  // Key Metrics
  metrics: {
    debtToGdpRatio: number;
    revenueGrowthRate: number;
    expenditureGrowthRate: number;
    budgetVariance: number;
  };
  
  // Generated Report Data
  reportData: any;
  
  // Metadata
  generatedAt: Date;
  generatedBy: string;
}

export class TreasurySchema {
  constructor(private pool: Pool) {}

  async initializeTables(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Government Budgets
      await client.query(`
        CREATE TABLE IF NOT EXISTS government_budgets (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          fiscal_year INT NOT NULL,
          budget_type TEXT NOT NULL CHECK (budget_type IN ('annual', 'supplemental', 'emergency')),
          
          -- Revenue Projections
          projected_revenue NUMERIC NOT NULL DEFAULT 0,
          actual_revenue NUMERIC NOT NULL DEFAULT 0,
          revenue_variance NUMERIC NOT NULL DEFAULT 0,
          
          -- Expenditure Allocations
          total_allocated NUMERIC NOT NULL DEFAULT 0,
          total_spent NUMERIC NOT NULL DEFAULT 0,
          remaining_balance NUMERIC NOT NULL DEFAULT 0,
          
          -- Department Allocations (JSONB)
          department_allocations JSONB NOT NULL DEFAULT '{}',
          
          -- Fiscal Health
          deficit_surplus NUMERIC NOT NULL DEFAULT 0,
          debt_to_gdp_ratio NUMERIC NOT NULL DEFAULT 0,
          
          -- Approval & Status
          status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'proposed', 'approved', 'active', 'closed')),
          approved_by TEXT,
          approved_at TIMESTAMP,
          
          -- Metadata
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, fiscal_year, budget_type)
        );
      `);

      // Budget Line Items
      await client.query(`
        CREATE TABLE IF NOT EXISTS budget_line_items (
          id TEXT PRIMARY KEY,
          budget_id TEXT NOT NULL REFERENCES government_budgets(id) ON DELETE CASCADE,
          department TEXT NOT NULL,
          category TEXT NOT NULL,
          subcategory TEXT,
          
          -- Financial Details
          allocated_amount NUMERIC NOT NULL DEFAULT 0,
          spent_amount NUMERIC NOT NULL DEFAULT 0,
          remaining_amount NUMERIC NOT NULL DEFAULT 0,
          encumbered_amount NUMERIC NOT NULL DEFAULT 0,
          
          -- Authorization
          authorized_by TEXT NOT NULL,
          spending_authority TEXT NOT NULL, -- Cabinet member ID
          
          -- Status & Tracking
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'transferred', 'closed')),
          priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
          
          -- Metadata
          description TEXT NOT NULL,
          justification TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Tax Collections (integrates with existing tax_rates table)
      await client.query(`
        CREATE TABLE IF NOT EXISTS tax_collections (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          tick_id INT NOT NULL,
          
          -- Tax Details
          tax_type TEXT NOT NULL CHECK (tax_type IN ('corp_tax', 'vat', 'tariff', 'income_tax', 'property_tax', 'other')),
          tax_source TEXT NOT NULL, -- Source identifier
          
          -- Collection Details
          base_amount NUMERIC NOT NULL DEFAULT 0,
          tax_rate NUMERIC NOT NULL DEFAULT 0,
          collected_amount NUMERIC NOT NULL DEFAULT 0,
          
          -- Collection Efficiency
          collection_efficiency NUMERIC NOT NULL DEFAULT 1.0 CHECK (collection_efficiency >= 0 AND collection_efficiency <= 1),
          uncollected_amount NUMERIC NOT NULL DEFAULT 0,
          
          -- Geographic/Administrative
          region_id INT,
          system_id INT REFERENCES systems(id),
          
          -- Metadata
          collection_date TIMESTAMP NOT NULL DEFAULT NOW(),
          collected_by TEXT NOT NULL,
          notes TEXT,
          
          -- Indexes for performance
          INDEX idx_tax_collections_campaign_tick (campaign_id, tick_id),
          INDEX idx_tax_collections_type (tax_type),
          INDEX idx_tax_collections_source (tax_source),
          INDEX idx_tax_collections_date (collection_date)
        );
      `);

      // Government Expenditures
      await client.query(`
        CREATE TABLE IF NOT EXISTS government_expenditures (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          budget_id TEXT NOT NULL REFERENCES government_budgets(id),
          line_item_id TEXT NOT NULL REFERENCES budget_line_items(id),
          
          -- Expenditure Details
          department TEXT NOT NULL,
          category TEXT NOT NULL,
          subcategory TEXT,
          amount NUMERIC NOT NULL,
          
          -- Authorization Chain
          requested_by TEXT NOT NULL,
          authorized_by TEXT NOT NULL, -- Cabinet member
          approved_by TEXT NOT NULL, -- Treasury Secretary
          
          -- Purpose & Justification
          purpose TEXT NOT NULL,
          description TEXT NOT NULL,
          beneficiary TEXT,
          
          -- Tracking
          expenditure_type TEXT NOT NULL CHECK (expenditure_type IN ('operational', 'capital', 'transfer', 'debt_service', 'emergency')),
          payment_method TEXT NOT NULL CHECK (payment_method IN ('direct', 'contract', 'grant', 'subsidy')),
          
          -- Status
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'disbursed', 'completed', 'cancelled')),
          
          -- Dates
          requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
          authorized_at TIMESTAMP,
          approved_at TIMESTAMP,
          disbursed_at TIMESTAMP,
          completed_at TIMESTAMP,
          
          -- Indexes
          INDEX idx_expenditures_campaign (campaign_id),
          INDEX idx_expenditures_budget (budget_id),
          INDEX idx_expenditures_department (department),
          INDEX idx_expenditures_status (status),
          INDEX idx_expenditures_type (expenditure_type)
        );
      `);

      // Fiscal Policies
      await client.query(`
        CREATE TABLE IF NOT EXISTS fiscal_policies (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          
          -- Policy Details
          policy_name TEXT NOT NULL,
          policy_type TEXT NOT NULL CHECK (policy_type IN ('tax_policy', 'spending_policy', 'debt_policy', 'monetary_policy')),
          description TEXT NOT NULL,
          
          -- Policy Parameters
          parameters JSONB NOT NULL DEFAULT '{}',
          
          -- Economic Impact
          projected_impact JSONB NOT NULL DEFAULT '{}',
          
          -- Implementation
          implementation_date TIMESTAMP NOT NULL,
          expiration_date TIMESTAMP,
          status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'proposed', 'approved', 'active', 'expired', 'repealed')),
          
          -- Authority
          proposed_by TEXT NOT NULL,
          approved_by TEXT,
          
          -- Metadata
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Debt Instruments
      await client.query(`
        CREATE TABLE IF NOT EXISTS debt_instruments (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          
          -- Debt Details
          instrument_type TEXT NOT NULL CHECK (instrument_type IN ('bond', 'note', 'bill', 'loan', 'other')),
          principal_amount NUMERIC NOT NULL,
          interest_rate NUMERIC NOT NULL,
          maturity_date TIMESTAMP NOT NULL,
          
          -- Current Status
          outstanding_balance NUMERIC NOT NULL,
          accrued_interest NUMERIC NOT NULL DEFAULT 0,
          
          -- Payment Schedule
          payment_frequency TEXT NOT NULL CHECK (payment_frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual')),
          next_payment_date TIMESTAMP NOT NULL,
          next_payment_amount NUMERIC NOT NULL,
          
          -- Metadata
          issue_date TIMESTAMP NOT NULL DEFAULT NOW(),
          issued_by TEXT NOT NULL,
          purpose TEXT NOT NULL,
          
          -- Status
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matured', 'defaulted', 'refinanced'))
        );
      `);

      // Treasury Reports
      await client.query(`
        CREATE TABLE IF NOT EXISTS treasury_reports (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
          
          -- Reporting Period
          period_start TIMESTAMP NOT NULL,
          period_end TIMESTAMP NOT NULL,
          
          -- Financial Summary
          total_revenue NUMERIC NOT NULL DEFAULT 0,
          total_expenditures NUMERIC NOT NULL DEFAULT 0,
          net_position NUMERIC NOT NULL DEFAULT 0,
          
          -- Revenue & Expenditure Breakdown
          revenue_by_source JSONB NOT NULL DEFAULT '{}',
          expenditure_by_department JSONB NOT NULL DEFAULT '{}',
          
          -- Key Metrics
          metrics JSONB NOT NULL DEFAULT '{}',
          
          -- Generated Report Data
          report_data JSONB NOT NULL DEFAULT '{}',
          
          -- Metadata
          generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          generated_by TEXT NOT NULL
        );
      `);

      // Department Budget Management Tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS department_budgets (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          fiscal_year INT NOT NULL,
          department TEXT NOT NULL,
          secretary_id TEXT NOT NULL,
          
          -- Budget Totals
          total_allocated NUMERIC NOT NULL DEFAULT 0,
          total_spent NUMERIC NOT NULL DEFAULT 0,
          total_encumbered NUMERIC NOT NULL DEFAULT 0,
          
          -- Spending Controls
          spending_limits JSONB NOT NULL DEFAULT '{}',
          
          -- Status & Metadata
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed', 'under_review')),
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, fiscal_year, department)
        );
      `);

      // Department Line Items (Detailed Budget Breakdown)
      await client.query(`
        CREATE TABLE IF NOT EXISTS department_line_items (
          id TEXT PRIMARY KEY,
          campaign_id INT NOT NULL,
          department TEXT NOT NULL,
          category TEXT NOT NULL,
          subcategory TEXT,
          
          -- Financial Details
          budgeted_amount NUMERIC NOT NULL DEFAULT 0,
          actual_spent NUMERIC NOT NULL DEFAULT 0,
          encumbered_amount NUMERIC NOT NULL DEFAULT 0,
          
          -- Item Details
          description TEXT NOT NULL,
          purpose TEXT NOT NULL,
          vendor TEXT,
          contract_number TEXT,
          
          -- Approval Chain
          requested_by TEXT NOT NULL,
          approved_by TEXT,
          secretary_approval BOOLEAN NOT NULL DEFAULT false,
          treasury_approval BOOLEAN NOT NULL DEFAULT false,
          
          -- Timeline
          budget_period TEXT NOT NULL DEFAULT 'FY2024',
          request_date TIMESTAMP NOT NULL DEFAULT NOW(),
          approval_date TIMESTAMP,
          spending_deadline TIMESTAMP,
          
          -- Status & Priority
          status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'approved', 'in_progress', 'completed', 'cancelled', 'overrun')),
          priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
          
          -- Notes & Tracking
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Line Item Milestones
      await client.query(`
        CREATE TABLE IF NOT EXISTS line_item_milestones (
          id TEXT PRIMARY KEY,
          line_item_id TEXT NOT NULL REFERENCES department_line_items(id) ON DELETE CASCADE,
          description TEXT NOT NULL,
          target_date TIMESTAMP NOT NULL,
          completed_date TIMESTAMP,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'delayed', 'cancelled')),
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Line Item Expenditures (Detailed Spending Tracking)
      await client.query(`
        CREATE TABLE IF NOT EXISTS line_item_expenditures (
          id TEXT PRIMARY KEY,
          line_item_id TEXT NOT NULL REFERENCES department_line_items(id) ON DELETE CASCADE,
          amount NUMERIC NOT NULL,
          description TEXT NOT NULL,
          vendor TEXT,
          invoice_number TEXT,
          payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
          approved_by TEXT NOT NULL,
          category TEXT NOT NULL CHECK (category IN ('personnel', 'equipment', 'services', 'supplies', 'travel', 'other')),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Create indexes for performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_government_budgets_campaign ON government_budgets(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_government_budgets_fiscal_year ON government_budgets(fiscal_year);
        CREATE INDEX IF NOT EXISTS idx_government_budgets_status ON government_budgets(status);
        
        CREATE INDEX IF NOT EXISTS idx_budget_line_items_budget ON budget_line_items(budget_id);
        CREATE INDEX IF NOT EXISTS idx_budget_line_items_department ON budget_line_items(department);
        CREATE INDEX IF NOT EXISTS idx_budget_line_items_status ON budget_line_items(status);
        CREATE INDEX IF NOT EXISTS idx_budget_line_items_authority ON budget_line_items(spending_authority);
        
        CREATE INDEX IF NOT EXISTS idx_fiscal_policies_campaign ON fiscal_policies(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_fiscal_policies_type ON fiscal_policies(policy_type);
        CREATE INDEX IF NOT EXISTS idx_fiscal_policies_status ON fiscal_policies(status);
        
        CREATE INDEX IF NOT EXISTS idx_debt_instruments_campaign ON debt_instruments(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_debt_instruments_status ON debt_instruments(status);
        CREATE INDEX IF NOT EXISTS idx_debt_instruments_maturity ON debt_instruments(maturity_date);
        
        CREATE INDEX IF NOT EXISTS idx_treasury_reports_campaign ON treasury_reports(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_treasury_reports_type ON treasury_reports(report_type);
        CREATE INDEX IF NOT EXISTS idx_treasury_reports_period ON treasury_reports(period_start, period_end);
        
        -- Department Budget Indexes
        CREATE INDEX IF NOT EXISTS idx_department_budgets_campaign ON department_budgets(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_department_budgets_department ON department_budgets(department);
        CREATE INDEX IF NOT EXISTS idx_department_budgets_secretary ON department_budgets(secretary_id);
        CREATE INDEX IF NOT EXISTS idx_department_budgets_fiscal_year ON department_budgets(fiscal_year);
        
        CREATE INDEX IF NOT EXISTS idx_department_line_items_campaign ON department_line_items(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_department_line_items_department ON department_line_items(department);
        CREATE INDEX IF NOT EXISTS idx_department_line_items_category ON department_line_items(category);
        CREATE INDEX IF NOT EXISTS idx_department_line_items_status ON department_line_items(status);
        CREATE INDEX IF NOT EXISTS idx_department_line_items_requested_by ON department_line_items(requested_by);
        
        CREATE INDEX IF NOT EXISTS idx_line_item_milestones_line_item ON line_item_milestones(line_item_id);
        CREATE INDEX IF NOT EXISTS idx_line_item_milestones_target_date ON line_item_milestones(target_date);
        
        CREATE INDEX IF NOT EXISTS idx_line_item_expenditures_line_item ON line_item_expenditures(line_item_id);
        CREATE INDEX IF NOT EXISTS idx_line_item_expenditures_payment_date ON line_item_expenditures(payment_date);
        CREATE INDEX IF NOT EXISTS idx_line_item_expenditures_category ON line_item_expenditures(category);
      `);

      await client.query('COMMIT');
      console.log('Treasury schema initialized successfully');
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error initializing Treasury schema:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async seedTreasurySystem(campaignId: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create initial budget for current fiscal year
      const currentYear = new Date().getFullYear();
      const budgetId = `budget-${campaignId}-${currentYear}`;
      
      await client.query(`
        INSERT INTO government_budgets (
          id, campaign_id, fiscal_year, budget_type,
          projected_revenue, total_allocated, status
        ) VALUES ($1, $2, $3, 'annual', 1000000, 1000000, 'active')
        ON CONFLICT (campaign_id, fiscal_year, budget_type) DO NOTHING
      `, [budgetId, campaignId, currentYear]);

      // Create department budget allocations
      const departments = [
        { dept: 'Defense', allocation: 300000, authority: 'ai-secretary-defense' },
        { dept: 'State', allocation: 150000, authority: 'ai-secretary-state' },
        { dept: 'Treasury', allocation: 100000, authority: 'ai-secretary-treasury' },
        { dept: 'Interior', allocation: 200000, authority: 'ai-secretary-interior' },
        { dept: 'Science', allocation: 150000, authority: 'ai-secretary-science' },
        { dept: 'Justice', allocation: 100000, authority: 'ai-attorney-general' }
      ];

      for (const dept of departments) {
        const lineItemId = `line-${campaignId}-${dept.dept.toLowerCase()}-${currentYear}`;
        await client.query(`
          INSERT INTO budget_line_items (
            id, budget_id, department, category,
            allocated_amount, remaining_amount, authorized_by, spending_authority,
            description
          ) VALUES ($1, $2, $3, 'operations', $4, $4, 'treasury-secretary', $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [
          lineItemId, budgetId, dept.dept, dept.allocation, dept.authority,
          `${dept.dept} Department operational budget for fiscal year ${currentYear}`
        ]);
      }

      // Initialize basic fiscal policies
      const policies = [
        {
          id: `policy-corp-tax-${campaignId}`,
          name: 'Corporate Tax Policy',
          type: 'tax_policy',
          description: 'Standard corporate income tax rate',
          parameters: { rate: 0.2, threshold: 50000 }
        },
        {
          id: `policy-vat-${campaignId}`,
          name: 'Value Added Tax Policy', 
          type: 'tax_policy',
          description: 'Standard VAT rate on goods and services',
          parameters: { rate: 0.05, exemptions: ['food', 'medicine'] }
        }
      ];

      for (const policy of policies) {
        await client.query(`
          INSERT INTO fiscal_policies (
            id, campaign_id, policy_name, policy_type, description,
            parameters, implementation_date, status, proposed_by
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'active', 'ai-secretary-treasury')
          ON CONFLICT (id) DO NOTHING
        `, [
          policy.id, campaignId, policy.name, policy.type, policy.description,
          JSON.stringify(policy.parameters)
        ]);
      }

      await client.query('COMMIT');
      console.log(`Treasury system seeded for campaign ${campaignId}`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error seeding Treasury system:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
