import { Router } from 'express';
import { getPool } from '../storage/db';
import { TreasuryService } from './TreasuryService';
import { DepartmentBudgetService } from './DepartmentBudgetService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const departmentBudgetRouter = Router();

// Enhanced AI Knobs for Department Budget System
const departmentBudgetKnobsData = {
  // Budget Allocation & Planning
  budget_allocation_efficiency: 0.8,      // Budget allocation efficiency and optimization
  strategic_priority_weighting: 0.7,      // Strategic priority weighting in budget decisions
  cross_department_coordination: 0.7,     // Cross-department budget coordination and alignment
  
  // Fiscal Discipline & Control
  spending_control_strictness: 0.8,       // Spending control and fiscal discipline strictness
  budget_variance_tolerance: 0.6,         // Budget variance tolerance and flexibility
  emergency_fund_management: 0.8,         // Emergency fund management and reserve allocation
  
  // Performance-Based Budgeting
  performance_based_allocation: 0.7,      // Performance-based budget allocation emphasis
  outcome_measurement_rigor: 0.8,         // Outcome measurement and evaluation rigor
  efficiency_incentive_strength: 0.7,     // Efficiency incentive and reward system strength
  
  // Budget Transparency & Accountability
  budget_transparency_level: 0.8,         // Budget transparency and public disclosure level
  accountability_mechanism_strength: 0.8, // Accountability mechanism and oversight strength
  audit_frequency_intensity: 0.7,         // Internal audit frequency and intensity
  
  // Multi-Year Planning & Forecasting
  long_term_planning_horizon: 0.6,        // Long-term budget planning and forecasting horizon
  fiscal_sustainability_focus: 0.8,       // Fiscal sustainability and long-term viability focus
  contingency_planning_thoroughness: 0.7, // Contingency planning and risk management thoroughness
  
  // Resource Optimization & Efficiency
  resource_utilization_optimization: 0.8, // Resource utilization optimization and waste reduction
  shared_service_consolidation: 0.6,      // Shared service consolidation and efficiency gains
  technology_investment_priority: 0.7,    // Technology investment priority and modernization
  
  // Stakeholder Engagement & Communication
  stakeholder_consultation_level: 0.7,    // Stakeholder consultation and engagement level
  budget_communication_clarity: 0.8,      // Budget communication clarity and accessibility
  public_participation_openness: 0.6,     // Public participation in budget process openness
  
  // Innovation & Adaptive Management
  budget_innovation_encouragement: 0.6,   // Budget innovation and creative solution encouragement
  adaptive_management_flexibility: 0.7,   // Adaptive management and mid-cycle adjustment flexibility
  pilot_program_investment: 0.6,          // Pilot program and experimental initiative investment
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Department Budget
const departmentBudgetKnobSystem = new EnhancedKnobSystem(departmentBudgetKnobsData);

// Apply department budget knobs to game state
function applyDepartmentBudgetKnobsToGameState() {
  const knobs = departmentBudgetKnobSystem.knobs;
  
  // Apply budget allocation settings
  const budgetAllocation = (knobs.budget_allocation_efficiency + knobs.strategic_priority_weighting + 
    knobs.cross_department_coordination) / 3;
  
  // Apply fiscal discipline settings
  const fiscalDiscipline = (knobs.spending_control_strictness + knobs.budget_variance_tolerance + 
    knobs.emergency_fund_management) / 3;
  
  // Apply performance-based budgeting settings
  const performanceBasedBudgeting = (knobs.performance_based_allocation + knobs.outcome_measurement_rigor + 
    knobs.efficiency_incentive_strength) / 3;
  
  // Apply transparency and accountability settings
  const transparencyAccountability = (knobs.budget_transparency_level + knobs.accountability_mechanism_strength + 
    knobs.audit_frequency_intensity) / 3;
  
  // Apply multi-year planning settings
  const multiYearPlanning = (knobs.long_term_planning_horizon + knobs.fiscal_sustainability_focus + 
    knobs.contingency_planning_thoroughness) / 3;
  
  // Apply resource optimization settings
  const resourceOptimization = (knobs.resource_utilization_optimization + knobs.shared_service_consolidation + 
    knobs.technology_investment_priority) / 3;
  
  console.log('Applied department budget knobs to game state:', {
    budgetAllocation,
    fiscalDiscipline,
    performanceBasedBudgeting,
    transparencyAccountability,
    multiYearPlanning,
    resourceOptimization
  });
}

const treasuryService = new TreasuryService(getPool());
const departmentBudgetService = new DepartmentBudgetService(getPool(), treasuryService);

// ==================== DEPARTMENT BUDGET MANAGEMENT ====================

/**
 * POST /api/treasury/departments/initialize
 * Initialize budgets for all government departments
 */
departmentBudgetRouter.post('/departments/initialize', async (req, res) => {
  try {
    const { campaignId, fiscalYear } = req.body;
    
    if (!campaignId || !fiscalYear) {
      return res.status(400).json({ error: 'Campaign ID and fiscal year are required' });
    }

    const budgets = await departmentBudgetService.initializeDepartmentBudgets(
      Number(campaignId), 
      Number(fiscalYear)
    );
    
    res.status(201).json({ 
      message: `Initialized budgets for ${budgets.length} departments`,
      budgets 
    });
  } catch (error) {
    console.error('Error initializing department budgets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/treasury/departments/:department/budget
 * Get detailed budget for a specific department
 */
departmentBudgetRouter.get('/departments/:department/budget', async (req, res) => {
  try {
    const { department } = req.params;
    const { campaignId, fiscalYear } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const currentYear = fiscalYear ? Number(fiscalYear) : new Date().getFullYear();
    const budget = await departmentBudgetService.getDepartmentBudget(
      Number(campaignId), 
      department, 
      currentYear
    );
    
    if (!budget) {
      return res.status(404).json({ error: 'Department budget not found' });
    }

    res.json({ budget });
  } catch (error) {
    console.error('Error fetching department budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/treasury/departments/rollup
 * Get comprehensive budget rollup across all departments
 */
departmentBudgetRouter.get('/departments/rollup', async (req, res) => {
  try {
    const { campaignId, fiscalYear } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const currentYear = fiscalYear ? Number(fiscalYear) : new Date().getFullYear();
    const rollup = await departmentBudgetService.generateBudgetRollup(
      Number(campaignId), 
      currentYear
    );
    
    res.json({ rollup });
  } catch (error) {
    console.error('Error generating budget rollup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== SECRETARY SPENDING REQUESTS ====================

/**
 * POST /api/treasury/departments/:department/spending-request
 * Submit a spending request from a department secretary
 */
departmentBudgetRouter.post('/departments/:department/spending-request', async (req, res) => {
  try {
    const { department } = req.params;
    const requestData = req.body;
    
    // Validate required fields
    if (!requestData.secretaryId || !requestData.amount || !requestData.purpose) {
      return res.status(400).json({ error: 'Secretary ID, amount, and purpose are required' });
    }

    // Ensure department matches
    requestData.department = department;

    const lineItem = await departmentBudgetService.submitSpendingRequest(requestData);
    
    res.status(201).json({ 
      message: 'Spending request submitted successfully',
      lineItem 
    });
  } catch (error) {
    console.error('Error submitting spending request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/departments/spending-request/:lineItemId/approve
 * Approve a spending request (Treasury Secretary function)
 */
departmentBudgetRouter.post('/departments/spending-request/:lineItemId/approve', async (req, res) => {
  try {
    const { lineItemId } = req.params;
    const { approverId, notes } = req.body;
    
    if (!approverId) {
      return res.status(400).json({ error: 'Approver ID is required' });
    }

    const approved = await departmentBudgetService.approveSpendingRequest(
      lineItemId, 
      approverId, 
      notes
    );
    
    if (approved) {
      res.json({ message: 'Spending request approved successfully' });
    } else {
      res.status(404).json({ error: 'Spending request not found' });
    }
  } catch (error) {
    console.error('Error approving spending request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== DETAILED LINE ITEM MANAGEMENT ====================

/**
 * GET /api/treasury/departments/:department/line-items
 * Get detailed line items for a department with filtering
 */
departmentBudgetRouter.get('/departments/:department/line-items', async (req, res) => {
  try {
    const { department } = req.params;
    const { campaignId, category, status, priority } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const client = await getPool().connect();
    
    try {
      let query = `
        SELECT 
          dli.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', lie.id,
                'amount', lie.amount,
                'description', lie.description,
                'vendor', lie.vendor,
                'paymentDate', lie.payment_date,
                'category', lie.category
              )
            ) FILTER (WHERE lie.id IS NOT NULL), 
            '[]'
          ) as expenditures,
          COALESCE(
            json_agg(
              json_build_object(
                'id', lim.id,
                'description', lim.description,
                'targetDate', lim.target_date,
                'completedDate', lim.completed_date,
                'status', lim.status
              )
            ) FILTER (WHERE lim.id IS NOT NULL), 
            '[]'
          ) as milestones
        FROM department_line_items dli
        LEFT JOIN line_item_expenditures lie ON dli.id = lie.line_item_id
        LEFT JOIN line_item_milestones lim ON dli.id = lim.line_item_id
        WHERE dli.campaign_id = $1 AND dli.department = $2
      `;
      
      const params = [Number(campaignId), department];
      let paramCount = 2;

      if (category) {
        query += ` AND dli.category = $${++paramCount}`;
        params.push(category as string);
      }

      if (status) {
        query += ` AND dli.status = $${++paramCount}`;
        params.push(status as string);
      }

      if (priority) {
        query += ` AND dli.priority = $${++paramCount}`;
        params.push(priority as string);
      }

      query += `
        GROUP BY dli.id
        ORDER BY dli.priority DESC, dli.budgeted_amount DESC, dli.created_at DESC
      `;

      const result = await client.query(query, params);
      
      const lineItems = result.rows.map(row => ({
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
        budgetPeriod: row.budget_period,
        requestDate: row.request_date,
        approvalDate: row.approval_date,
        spendingDeadline: row.spending_deadline,
        status: row.status,
        priority: row.priority,
        notes: row.notes,
        expenditures: row.expenditures || [],
        milestones: row.milestones || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      res.json({ lineItems });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching department line items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/departments/line-item/:lineItemId/expenditure
 * Record an expenditure against a line item
 */
departmentBudgetRouter.post('/departments/line-item/:lineItemId/expenditure', async (req, res) => {
  try {
    const { lineItemId } = req.params;
    const { amount, description, vendor, invoiceNumber, category, approvedBy } = req.body;
    
    if (!amount || !description || !approvedBy) {
      return res.status(400).json({ error: 'Amount, description, and approver are required' });
    }

    const client = await getPool().connect();
    
    try {
      await client.query('BEGIN');

      // Record the expenditure
      const expenditureId = `exp-${lineItemId}-${Date.now()}`;
      await client.query(`
        INSERT INTO line_item_expenditures (
          id, line_item_id, amount, description, vendor, invoice_number, 
          category, approved_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        expenditureId, lineItemId, Number(amount), description, 
        vendor, invoiceNumber, category || 'other', approvedBy
      ]);

      // Update the line item spent amount
      await client.query(`
        UPDATE department_line_items 
        SET 
          actual_spent = actual_spent + $2,
          updated_at = NOW()
        WHERE id = $1
      `, [lineItemId, Number(amount)]);

      await client.query('COMMIT');

      res.status(201).json({ 
        message: 'Expenditure recorded successfully',
        expenditureId 
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error recording expenditure:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== BUDGET ANALYTICS & REPORTING ====================

/**
 * GET /api/treasury/departments/:department/analytics
 * Get spending analytics for a department
 */
departmentBudgetRouter.get('/departments/:department/analytics', async (req, res) => {
  try {
    const { department } = req.params;
    const { campaignId, periodDays } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const days = periodDays ? Number(periodDays) : 30;
    const client = await getPool().connect();
    
    try {
      // Get spending trends
      const trendResult = await client.query(`
        SELECT 
          DATE(lie.payment_date) as spend_date,
          SUM(lie.amount) as daily_spending,
          COUNT(lie.id) as transaction_count
        FROM line_item_expenditures lie
        JOIN department_line_items dli ON lie.line_item_id = dli.id
        WHERE dli.campaign_id = $1 AND dli.department = $2
        AND lie.payment_date >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(lie.payment_date)
        ORDER BY spend_date
      `, [Number(campaignId), department]);

      // Get category breakdown
      const categoryResult = await client.query(`
        SELECT 
          dli.category,
          SUM(dli.budgeted_amount) as budgeted,
          SUM(dli.actual_spent) as spent,
          COUNT(dli.id) as line_item_count,
          AVG(CASE 
            WHEN dli.budgeted_amount > 0 
            THEN (dli.actual_spent / dli.budgeted_amount) 
            ELSE 0 
          END) as avg_utilization
        FROM department_line_items dli
        WHERE dli.campaign_id = $1 AND dli.department = $2
        GROUP BY dli.category
        ORDER BY SUM(dli.actual_spent) DESC
      `, [Number(campaignId), department]);

      // Get vendor analysis
      const vendorResult = await client.query(`
        SELECT 
          lie.vendor,
          SUM(lie.amount) as total_paid,
          COUNT(lie.id) as transaction_count,
          AVG(lie.amount) as avg_transaction
        FROM line_item_expenditures lie
        JOIN department_line_items dli ON lie.line_item_id = dli.id
        WHERE dli.campaign_id = $1 AND dli.department = $2
        AND lie.vendor IS NOT NULL
        AND lie.payment_date >= NOW() - INTERVAL '${days} days'
        GROUP BY lie.vendor
        ORDER BY SUM(lie.amount) DESC
        LIMIT 10
      `, [Number(campaignId), department]);

      const analytics = {
        department,
        period: `Last ${days} days`,
        spendingTrend: trendResult.rows.map(row => ({
          date: row.spend_date,
          amount: Number(row.daily_spending),
          transactionCount: Number(row.transaction_count)
        })),
        categoryBreakdown: categoryResult.rows.map(row => ({
          category: row.category,
          budgeted: Number(row.budgeted),
          spent: Number(row.spent),
          utilization: Number(row.avg_utilization),
          lineItemCount: Number(row.line_item_count)
        })),
        topVendors: vendorResult.rows.map(row => ({
          vendor: row.vendor,
          totalPaid: Number(row.total_paid),
          transactionCount: Number(row.transaction_count),
          avgTransaction: Number(row.avg_transaction)
        })),
        summary: {
          totalBudgeted: categoryResult.rows.reduce((sum, row) => sum + Number(row.budgeted), 0),
          totalSpent: categoryResult.rows.reduce((sum, row) => sum + Number(row.spent), 0),
          totalTransactions: trendResult.rows.reduce((sum, row) => sum + Number(row.transaction_count), 0),
          avgDailySpending: trendResult.rows.length > 0 ? 
            trendResult.rows.reduce((sum, row) => sum + Number(row.daily_spending), 0) / trendResult.rows.length : 0
        }
      };

      res.json({ analytics });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error generating department analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/treasury/departments/comparison
 * Compare spending across all departments
 */
departmentBudgetRouter.get('/departments/comparison', async (req, res) => {
  try {
    const { campaignId, fiscalYear } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const currentYear = fiscalYear ? Number(fiscalYear) : new Date().getFullYear();
    const client = await getPool().connect();
    
    try {
      const result = await client.query(`
        SELECT 
          db.department,
          db.total_allocated,
          db.total_spent,
          (db.total_allocated - db.total_spent) as remaining,
          CASE 
            WHEN db.total_allocated > 0 
            THEN (db.total_spent / db.total_allocated) 
            ELSE 0 
          END as utilization_rate,
          COUNT(dli.id) as line_item_count,
          AVG(dli.actual_spent) as avg_line_item_spending
        FROM department_budgets db
        LEFT JOIN department_line_items dli ON db.department = dli.department 
          AND db.campaign_id = dli.campaign_id
        WHERE db.campaign_id = $1 AND db.fiscal_year = $2
        GROUP BY db.department, db.total_allocated, db.total_spent
        ORDER BY db.total_allocated DESC
      `, [Number(campaignId), currentYear]);

      const comparison = {
        fiscalYear: currentYear,
        departments: result.rows.map(row => ({
          department: row.department,
          allocated: Number(row.total_allocated),
          spent: Number(row.total_spent),
          remaining: Number(row.remaining),
          utilizationRate: Number(row.utilization_rate),
          lineItemCount: Number(row.line_item_count),
          avgLineItemSpending: Number(row.avg_line_item_spending)
        })),
        totals: {
          totalAllocated: result.rows.reduce((sum, row) => sum + Number(row.total_allocated), 0),
          totalSpent: result.rows.reduce((sum, row) => sum + Number(row.total_spent), 0),
          avgUtilization: result.rows.length > 0 ? 
            result.rows.reduce((sum, row) => sum + Number(row.utilization_rate), 0) / result.rows.length : 0
        }
      };

      res.json({ comparison });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error generating department comparison:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(departmentBudgetRouter, 'department-budget', departmentBudgetKnobSystem, applyDepartmentBudgetKnobsToGameState);

export default departmentBudgetRouter;
