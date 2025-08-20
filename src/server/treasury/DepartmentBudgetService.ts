import { Pool } from 'pg';
import { TreasuryService } from './TreasuryService';

export interface DepartmentBudget {
  department: string;
  secretaryId: string;
  fiscalYear: number;
  campaignId: number;
  
  // Budget Allocation
  totalAllocated: number;
  totalSpent: number;
  totalEncumbered: number;
  remainingBalance: number;
  
  // Budget Categories
  categories: {
    [category: string]: {
      allocated: number;
      spent: number;
      remaining: number;
      lineItems: DepartmentLineItem[];
    };
  };
  
  // Spending Authority
  spendingLimits: {
    dailyLimit: number;
    transactionLimit: number;
    approvalRequired: number; // Amount above which Treasury approval needed
  };
  
  // Performance Metrics
  utilizationRate: number; // Percentage of budget used
  burnRate: number; // Daily spending rate
  projectedDepletion: Date | null; // When budget will run out
  
  // Status
  status: 'active' | 'frozen' | 'closed' | 'under_review';
  lastUpdated: Date;
}

export interface DepartmentLineItem {
  id: string;
  department: string;
  category: string;
  subcategory: string;
  
  // Financial Details
  budgetedAmount: number;
  actualSpent: number;
  encumberedAmount: number;
  varianceAmount: number;
  variancePercentage: number;
  
  // Item Details
  description: string;
  purpose: string;
  vendor?: string;
  contractNumber?: string;
  
  // Approval Chain
  requestedBy: string;
  approvedBy: string;
  secretaryApproval: boolean;
  treasuryApproval: boolean;
  
  // Timeline
  budgetPeriod: string; // 'Q1', 'Q2', etc.
  requestDate: Date;
  approvalDate?: Date;
  spendingDeadline?: Date;
  
  // Status & Priority
  status: 'planned' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'overrun';
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  // Tracking
  milestones: LineItemMilestone[];
  expenditures: LineItemExpenditure[];
}

export interface LineItemMilestone {
  id: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'delayed' | 'cancelled';
  notes?: string;
}

export interface LineItemExpenditure {
  id: string;
  amount: number;
  description: string;
  vendor?: string;
  invoiceNumber?: string;
  paymentDate: Date;
  approvedBy: string;
  category: 'personnel' | 'equipment' | 'services' | 'supplies' | 'travel' | 'other';
}

export interface BudgetRollupSummary {
  campaignId: number;
  fiscalYear: number;
  
  // Government-wide Totals
  totalGovernmentBudget: number;
  totalGovernmentSpent: number;
  totalGovernmentRemaining: number;
  
  // Department Breakdown
  departmentSummaries: {
    [department: string]: {
      allocated: number;
      spent: number;
      remaining: number;
      utilizationRate: number;
      categoryBreakdown: {
        [category: string]: {
          allocated: number;
          spent: number;
          lineItemCount: number;
        };
      };
    };
  };
  
  // Top Spending Categories
  topSpendingCategories: Array<{
    category: string;
    totalSpent: number;
    percentage: number;
  }>;
  
  // Budget Alerts
  alerts: Array<{
    type: 'overrun' | 'underutilized' | 'approval_needed' | 'deadline_approaching';
    department: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface SecretarySpendingRequest {
  secretaryId: string;
  department: string;
  category: string;
  subcategory?: string;
  amount: number;
  purpose: string;
  description: string;
  justification: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  vendor?: string;
  expectedDelivery?: Date;
  milestones?: Array<{
    description: string;
    targetDate: Date;
  }>;
}

export class DepartmentBudgetService {
  constructor(
    private pool: Pool,
    private treasuryService: TreasuryService
  ) {}

  // ==================== DEPARTMENT BUDGET INITIALIZATION ====================

  async initializeDepartmentBudgets(campaignId: number, fiscalYear: number): Promise<DepartmentBudget[]> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get all cabinet departments
      const departmentsResult = await client.query(`
        SELECT DISTINCT department, user_id as secretary_id
        FROM cabinet_members 
        WHERE status = 'active'
        ORDER BY department
      `);

      const departments = [
        { department: 'Defense', secretaryId: 'ai-secretary-defense', baseAllocation: 300000 },
        { department: 'State', secretaryId: 'ai-secretary-state', baseAllocation: 150000 },
        { department: 'Treasury', secretaryId: 'ai-secretary-treasury', baseAllocation: 100000 },
        { department: 'Interior', secretaryId: 'ai-secretary-interior', baseAllocation: 200000 },
        { department: 'Science', secretaryId: 'ai-secretary-science', baseAllocation: 150000 },
        { department: 'Justice', secretaryId: 'ai-attorney-general', baseAllocation: 100000 },
        { department: 'Commerce', secretaryId: 'ai-secretary-commerce', baseAllocation: 120000 },
        { department: 'Intelligence', secretaryId: 'ai-director-intelligence', baseAllocation: 80000 },
        { department: 'Administration', secretaryId: 'ai-chief-staff', baseAllocation: 50000 }
      ];

      const budgets: DepartmentBudget[] = [];

      for (const dept of departments) {
        // Create department budget record
        await client.query(`
          INSERT INTO department_budgets (
            id, campaign_id, fiscal_year, department, secretary_id,
            total_allocated, spending_limits, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
          ON CONFLICT (campaign_id, fiscal_year, department) DO UPDATE SET
            total_allocated = EXCLUDED.total_allocated,
            secretary_id = EXCLUDED.secretary_id
        `, [
          `dept-budget-${campaignId}-${dept.department}-${fiscalYear}`,
          campaignId,
          fiscalYear,
          dept.department,
          dept.secretaryId,
          dept.baseAllocation,
          JSON.stringify({
            dailyLimit: dept.baseAllocation * 0.05, // 5% daily limit
            transactionLimit: dept.baseAllocation * 0.1, // 10% transaction limit
            approvalRequired: dept.baseAllocation * 0.2 // 20% requires Treasury approval
          })
        ]);

        // Initialize standard budget categories for each department
        const categories = await this.getStandardCategoriesForDepartment(dept.department);
        
        for (const category of categories) {
          const categoryAllocation = Math.floor(dept.baseAllocation * category.percentage);
          
          await client.query(`
            INSERT INTO department_line_items (
              id, campaign_id, department, category, subcategory,
              budgeted_amount, description, purpose, status, priority,
              requested_by, approved_by, secretary_approval
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved', $9, $10, $11, true)
            ON CONFLICT (id) DO NOTHING
          `, [
            `line-${campaignId}-${dept.department}-${category.name}-${fiscalYear}`,
            campaignId,
            dept.department,
            category.name,
            category.subcategory,
            categoryAllocation,
            category.description,
            category.purpose,
            category.priority,
            dept.secretaryId,
            dept.secretaryId
          ]);
        }

        const budget = await this.getDepartmentBudget(campaignId, dept.department, fiscalYear);
        if (budget) budgets.push(budget);
      }

      await client.query('COMMIT');
      return budgets;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ==================== DEPARTMENT BUDGET MANAGEMENT ====================

  async getDepartmentBudget(campaignId: number, department: string, fiscalYear: number): Promise<DepartmentBudget | null> {
    const client = await this.pool.connect();
    
    try {
      // Get department budget summary
      const budgetResult = await client.query(`
        SELECT * FROM department_budgets 
        WHERE campaign_id = $1 AND department = $2 AND fiscal_year = $3
      `, [campaignId, department, fiscalYear]);

      if (budgetResult.rows.length === 0) return null;

      const budgetRow = budgetResult.rows[0];

      // Get line items grouped by category
      const lineItemsResult = await client.query(`
        SELECT 
          category,
          subcategory,
          SUM(budgeted_amount) as allocated,
          SUM(actual_spent) as spent,
          SUM(encumbered_amount) as encumbered,
          COUNT(*) as line_item_count,
          json_agg(
            json_build_object(
              'id', id,
              'subcategory', subcategory,
              'budgetedAmount', budgeted_amount,
              'actualSpent', actual_spent,
              'encumberedAmount', encumbered_amount,
              'description', description,
              'status', status,
              'priority', priority
            )
          ) as line_items
        FROM department_line_items 
        WHERE campaign_id = $1 AND department = $2
        GROUP BY category, subcategory
        ORDER BY category, subcategory
      `, [campaignId, department]);

      const categories: DepartmentBudget['categories'] = {};
      let totalSpent = 0;
      let totalEncumbered = 0;

      for (const row of lineItemsResult.rows) {
        const allocated = Number(row.allocated);
        const spent = Number(row.spent);
        const encumbered = Number(row.encumbered);
        
        categories[row.category] = {
          allocated,
          spent,
          remaining: allocated - spent - encumbered,
          lineItems: row.line_items || []
        };
        
        totalSpent += spent;
        totalEncumbered += encumbered;
      }

      const totalAllocated = Number(budgetRow.total_allocated);
      const remainingBalance = totalAllocated - totalSpent - totalEncumbered;
      const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) : 0;
      
      // Calculate burn rate (simplified - last 30 days)
      const burnRateResult = await client.query(`
        SELECT AVG(daily_spending) as avg_daily_spending
        FROM (
          SELECT DATE(payment_date) as spend_date, SUM(amount) as daily_spending
          FROM line_item_expenditures lie
          JOIN department_line_items dli ON lie.line_item_id = dli.id
          WHERE dli.campaign_id = $1 AND dli.department = $2
          AND lie.payment_date >= NOW() - INTERVAL '30 days'
          GROUP BY DATE(payment_date)
        ) daily_totals
      `, [campaignId, department]);

      const burnRate = Number(burnRateResult.rows[0]?.avg_daily_spending || 0);
      const projectedDepletion = burnRate > 0 ? 
        new Date(Date.now() + (remainingBalance / burnRate) * 24 * 60 * 60 * 1000) : null;

      return {
        department,
        secretaryId: budgetRow.secretary_id,
        fiscalYear,
        campaignId,
        totalAllocated,
        totalSpent,
        totalEncumbered,
        remainingBalance,
        categories,
        spendingLimits: budgetRow.spending_limits || {
          dailyLimit: totalAllocated * 0.05,
          transactionLimit: totalAllocated * 0.1,
          approvalRequired: totalAllocated * 0.2
        },
        utilizationRate,
        burnRate,
        projectedDepletion,
        status: budgetRow.status,
        lastUpdated: budgetRow.updated_at
      };
      
    } finally {
      client.release();
    }
  }

  // ==================== SECRETARY SPENDING REQUESTS ====================

  async submitSpendingRequest(request: SecretarySpendingRequest): Promise<DepartmentLineItem> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const lineItemId = `line-${Date.now()}-${request.department}-${request.category}`;
      
      // Create the line item
      const result = await client.query(`
        INSERT INTO department_line_items (
          id, campaign_id, department, category, subcategory,
          budgeted_amount, description, purpose, vendor,
          requested_by, status, priority, request_date,
          secretary_approval, treasury_approval
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), true, $13)
        RETURNING *
      `, [
        lineItemId,
        1, // TODO: Get from context
        request.department,
        request.category,
        request.subcategory,
        request.amount,
        request.description,
        request.purpose,
        request.vendor,
        request.secretaryId,
        request.urgency === 'emergency' ? 'approved' : 'pending',
        request.urgency === 'emergency' ? 'critical' : 'high',
        request.urgency !== 'emergency' // Emergency requests auto-approved
      ]);

      // Add milestones if provided
      if (request.milestones && request.milestones.length > 0) {
        for (const milestone of request.milestones) {
          await client.query(`
            INSERT INTO line_item_milestones (
              id, line_item_id, description, target_date, status
            ) VALUES ($1, $2, $3, $4, 'pending')
          `, [
            `milestone-${lineItemId}-${Date.now()}`,
            lineItemId,
            milestone.description,
            milestone.targetDate
          ]);
        }
      }

      await client.query('COMMIT');
      return this.mapLineItem(result.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async approveSpendingRequest(lineItemId: string, approverId: string, notes?: string): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        UPDATE department_line_items 
        SET 
          status = 'approved',
          approved_by = $2,
          approval_date = NOW(),
          treasury_approval = true,
          notes = COALESCE(notes, '') || $3
        WHERE id = $1
        RETURNING *
      `, [lineItemId, approverId, notes ? `\nApproval notes: ${notes}` : '']);

      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  // ==================== BUDGET ROLLUP & REPORTING ====================

  async generateBudgetRollup(campaignId: number, fiscalYear: number): Promise<BudgetRollupSummary> {
    const client = await this.pool.connect();
    
    try {
      // Get government-wide totals
      const totalsResult = await client.query(`
        SELECT 
          SUM(total_allocated) as total_budget,
          SUM(total_spent) as total_spent
        FROM department_budgets 
        WHERE campaign_id = $1 AND fiscal_year = $2
      `, [campaignId, fiscalYear]);

      const totalGovernmentBudget = Number(totalsResult.rows[0]?.total_budget || 0);
      const totalGovernmentSpent = Number(totalsResult.rows[0]?.total_spent || 0);
      const totalGovernmentRemaining = totalGovernmentBudget - totalGovernmentSpent;

      // Get department summaries
      const departmentResult = await client.query(`
        SELECT 
          db.department,
          db.total_allocated as allocated,
          db.total_spent as spent,
          (db.total_allocated - db.total_spent) as remaining,
          CASE 
            WHEN db.total_allocated > 0 THEN (db.total_spent / db.total_allocated)
            ELSE 0 
          END as utilization_rate
        FROM department_budgets db
        WHERE db.campaign_id = $1 AND db.fiscal_year = $2
        ORDER BY db.total_allocated DESC
      `, [campaignId, fiscalYear]);

      const departmentSummaries: BudgetRollupSummary['departmentSummaries'] = {};

      for (const dept of departmentResult.rows) {
        // Get category breakdown for this department
        const categoryResult = await client.query(`
          SELECT 
            category,
            SUM(budgeted_amount) as allocated,
            SUM(actual_spent) as spent,
            COUNT(*) as line_item_count
          FROM department_line_items 
          WHERE campaign_id = $1 AND department = $2
          GROUP BY category
          ORDER BY SUM(budgeted_amount) DESC
        `, [campaignId, dept.department]);

        const categoryBreakdown: any = {};
        for (const cat of categoryResult.rows) {
          categoryBreakdown[cat.category] = {
            allocated: Number(cat.allocated),
            spent: Number(cat.spent),
            lineItemCount: Number(cat.line_item_count)
          };
        }

        departmentSummaries[dept.department] = {
          allocated: Number(dept.allocated),
          spent: Number(dept.spent),
          remaining: Number(dept.remaining),
          utilizationRate: Number(dept.utilization_rate),
          categoryBreakdown
        };
      }

      // Get top spending categories across all departments
      const topCategoriesResult = await client.query(`
        SELECT 
          category,
          SUM(actual_spent) as total_spent,
          (SUM(actual_spent) / $2 * 100) as percentage
        FROM department_line_items 
        WHERE campaign_id = $1 AND actual_spent > 0
        GROUP BY category
        ORDER BY SUM(actual_spent) DESC
        LIMIT 10
      `, [campaignId, totalGovernmentSpent || 1]);

      const topSpendingCategories = topCategoriesResult.rows.map(row => ({
        category: row.category,
        totalSpent: Number(row.total_spent),
        percentage: Number(row.percentage)
      }));

      // Generate alerts
      const alerts: BudgetRollupSummary['alerts'] = [];

      // Check for budget overruns
      const overrunResult = await client.query(`
        SELECT department, category, budgeted_amount, actual_spent
        FROM department_line_items 
        WHERE campaign_id = $1 AND actual_spent > budgeted_amount
      `, [campaignId]);

      for (const overrun of overrunResult.rows) {
        alerts.push({
          type: 'overrun',
          department: overrun.department,
          message: `${overrun.category} category is over budget by ${overrun.actual_spent - overrun.budgeted_amount}`,
          severity: 'high'
        });
      }

      // Check for underutilized budgets
      for (const [dept, summary] of Object.entries(departmentSummaries)) {
        if (summary.utilizationRate < 0.3) {
          alerts.push({
            type: 'underutilized',
            department: dept,
            message: `Only ${(summary.utilizationRate * 100).toFixed(1)}% of budget utilized`,
            severity: 'medium'
          });
        }
      }

      return {
        campaignId,
        fiscalYear,
        totalGovernmentBudget,
        totalGovernmentSpent,
        totalGovernmentRemaining,
        departmentSummaries,
        topSpendingCategories,
        alerts
      };
      
    } finally {
      client.release();
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private async getStandardCategoriesForDepartment(department: string): Promise<Array<{
    name: string;
    subcategory?: string;
    percentage: number;
    description: string;
    purpose: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }>> {
    const standardCategories = {
      'Defense': [
        { name: 'Personnel', percentage: 0.4, description: 'Military personnel salaries and benefits', purpose: 'Maintain military readiness', priority: 'critical' as const },
        { name: 'Operations', percentage: 0.25, description: 'Day-to-day military operations', purpose: 'Operational readiness', priority: 'critical' as const },
        { name: 'Procurement', percentage: 0.2, description: 'Military equipment and weapons', purpose: 'Equipment modernization', priority: 'high' as const },
        { name: 'Research', percentage: 0.1, description: 'Military R&D programs', purpose: 'Technological advancement', priority: 'medium' as const },
        { name: 'Infrastructure', percentage: 0.05, description: 'Base maintenance and construction', purpose: 'Facility upkeep', priority: 'medium' as const }
      ],
      'State': [
        { name: 'Diplomatic Operations', percentage: 0.3, description: 'Embassy operations and diplomatic missions', purpose: 'Foreign relations', priority: 'critical' as const },
        { name: 'Foreign Aid', percentage: 0.25, description: 'International assistance programs', purpose: 'Diplomatic influence', priority: 'high' as const },
        { name: 'Trade Promotion', percentage: 0.2, description: 'Trade mission and economic diplomacy', purpose: 'Economic partnerships', priority: 'high' as const },
        { name: 'Cultural Exchange', percentage: 0.15, description: 'Cultural and educational programs', purpose: 'Soft power projection', priority: 'medium' as const },
        { name: 'Administration', percentage: 0.1, description: 'Department administrative costs', purpose: 'Operational support', priority: 'medium' as const }
      ],
      'Treasury': [
        { name: 'Tax Administration', percentage: 0.3, description: 'Tax collection and enforcement', purpose: 'Revenue generation', priority: 'critical' as const },
        { name: 'Financial Operations', percentage: 0.25, description: 'Government financial management', purpose: 'Fiscal oversight', priority: 'critical' as const },
        { name: 'Debt Service', percentage: 0.2, description: 'Government debt payments', purpose: 'Debt management', priority: 'critical' as const },
        { name: 'Economic Analysis', percentage: 0.15, description: 'Economic research and forecasting', purpose: 'Policy support', priority: 'high' as const },
        { name: 'Administration', percentage: 0.1, description: 'Department operations', purpose: 'Administrative support', priority: 'medium' as const }
      ],
      'Interior': [
        { name: 'Infrastructure', percentage: 0.4, description: 'Public works and infrastructure projects', purpose: 'National development', priority: 'high' as const },
        { name: 'Natural Resources', percentage: 0.25, description: 'Resource management and conservation', purpose: 'Resource stewardship', priority: 'high' as const },
        { name: 'Public Services', percentage: 0.2, description: 'Citizen services and programs', purpose: 'Public welfare', priority: 'medium' as const },
        { name: 'Environmental', percentage: 0.1, description: 'Environmental protection programs', purpose: 'Environmental stewardship', priority: 'medium' as const },
        { name: 'Administration', percentage: 0.05, description: 'Department operations', purpose: 'Administrative support', priority: 'low' as const }
      ],
      'Science': [
        { name: 'Research Grants', percentage: 0.4, description: 'Scientific research funding', purpose: 'Scientific advancement', priority: 'high' as const },
        { name: 'Technology Development', percentage: 0.3, description: 'Technology innovation programs', purpose: 'Technological progress', priority: 'high' as const },
        { name: 'Education Programs', percentage: 0.15, description: 'STEM education initiatives', purpose: 'Human capital development', priority: 'medium' as const },
        { name: 'Infrastructure', percentage: 0.1, description: 'Research facilities and equipment', purpose: 'Research capability', priority: 'medium' as const },
        { name: 'Administration', percentage: 0.05, description: 'Department operations', purpose: 'Administrative support', priority: 'low' as const }
      ],
      'Justice': [
        { name: 'Law Enforcement', percentage: 0.4, description: 'Police and federal law enforcement', purpose: 'Public safety', priority: 'critical' as const },
        { name: 'Courts', percentage: 0.25, description: 'Judicial system operations', purpose: 'Justice administration', priority: 'critical' as const },
        { name: 'Corrections', percentage: 0.2, description: 'Prison and rehabilitation programs', purpose: 'Criminal justice', priority: 'high' as const },
        { name: 'Legal Services', percentage: 0.1, description: 'Government legal representation', purpose: 'Legal support', priority: 'medium' as const },
        { name: 'Administration', percentage: 0.05, description: 'Department operations', purpose: 'Administrative support', priority: 'low' as const }
      ]
    };

    return standardCategories[department as keyof typeof standardCategories] || [
      { name: 'Operations', percentage: 0.6, description: 'General operations', purpose: 'Department operations', priority: 'medium' as const },
      { name: 'Personnel', percentage: 0.3, description: 'Staff salaries and benefits', purpose: 'Human resources', priority: 'high' as const },
      { name: 'Administration', percentage: 0.1, description: 'Administrative costs', purpose: 'Administrative support', priority: 'low' as const }
    ];
  }

  private mapLineItem(row: any): DepartmentLineItem {
    return {
      id: row.id,
      department: row.department,
      category: row.category,
      subcategory: row.subcategory,
      budgetedAmount: Number(row.budgeted_amount),
      actualSpent: Number(row.actual_spent),
      encumberedAmount: Number(row.encumbered_amount),
      varianceAmount: Number(row.actual_spent) - Number(row.budgeted_amount),
      variancePercentage: Number(row.budgeted_amount) > 0 ? 
        ((Number(row.actual_spent) - Number(row.budgeted_amount)) / Number(row.budgeted_amount)) * 100 : 0,
      description: row.description,
      purpose: row.purpose,
      vendor: row.vendor,
      contractNumber: row.contract_number,
      requestedBy: row.requested_by,
      approvedBy: row.approved_by,
      secretaryApproval: row.secretary_approval,
      treasuryApproval: row.treasury_approval,
      budgetPeriod: row.budget_period || 'FY2024',
      requestDate: row.request_date,
      approvalDate: row.approval_date,
      spendingDeadline: row.spending_deadline,
      status: row.status,
      priority: row.priority,
      milestones: [], // TODO: Load from milestones table
      expenditures: [] // TODO: Load from expenditures table
    };
  }
}
