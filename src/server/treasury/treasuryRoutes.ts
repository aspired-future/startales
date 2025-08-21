import { Router } from 'express';
import { getPool } from '../storage/db';
import { TreasuryService } from './TreasuryService';
import { DepartmentBudgetService } from './DepartmentBudgetService';
import departmentBudgetRouter from './departmentBudgetRoutes';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const treasuryRouter = Router();
const treasuryService = new TreasuryService(getPool());
const departmentBudgetService = new DepartmentBudgetService(getPool(), treasuryService);

// Enhanced AI Knobs for Treasury System
const treasuryKnobsData = {
  // Budget Planning & Management
  budget_planning_horizon: 0.7,         // Budget planning time horizon and forecasting
  budget_flexibility: 0.6,              // Budget reallocation and adjustment flexibility
  contingency_reserve_ratio: 0.8,       // Emergency and contingency fund allocation
  
  // Revenue Management
  tax_collection_efficiency: 0.8,       // Tax collection and compliance efficiency
  revenue_diversification: 0.6,         // Revenue source diversification strategy
  tax_policy_optimization: 0.7,         // Tax policy design and optimization
  
  // Expenditure Control
  spending_oversight_strictness: 0.8,   // Government spending oversight and control
  procurement_efficiency: 0.7,          // Government procurement process efficiency
  cost_benefit_analysis_rigor: 0.8,     // Cost-benefit analysis requirements
  
  // Debt Management
  debt_sustainability_focus: 0.9,       // Debt sustainability and management focus
  borrowing_cost_optimization: 0.8,     // Government borrowing cost optimization
  debt_transparency: 0.8,               // Public debt transparency and reporting
  
  // Financial Controls & Compliance
  financial_controls_strictness: 0.9,   // Financial controls and audit requirements
  anti_fraud_measures: 0.9,             // Anti-fraud and corruption prevention
  regulatory_compliance_level: 0.8,     // Financial regulatory compliance level
  
  // Investment & Asset Management
  sovereign_wealth_management: 0.6,     // Sovereign wealth fund management
  public_asset_optimization: 0.7,       // Public asset management and optimization
  infrastructure_investment_priority: 0.8, // Infrastructure investment prioritization
  
  // Economic Stabilization
  counter_cyclical_policy: 0.6,         // Counter-cyclical fiscal policy implementation
  automatic_stabilizers: 0.7,           // Automatic fiscal stabilizer mechanisms
  crisis_response_readiness: 0.8,       // Financial crisis response preparedness
  
  // Intergovernmental Finance
  federal_state_coordination: 0.7,      // Federal-state financial coordination
  local_government_support: 0.6,        // Local government financial support
  fiscal_equalization: 0.5,             // Fiscal equalization between regions
  
  // Technology & Innovation
  financial_system_digitization: 0.7,   // Treasury system digitization and automation
  blockchain_adoption: 0.4,             // Blockchain and digital currency adoption
  data_analytics_usage: 0.6,            // Financial data analytics and AI usage
  
  // Transparency & Accountability
  public_financial_transparency: 0.8,   // Public financial reporting transparency
  citizen_engagement_level: 0.6,        // Citizen participation in budget process
  parliamentary_oversight: 0.8,         // Legislative oversight of treasury operations
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Treasury
const treasuryKnobSystem = new EnhancedKnobSystem(treasuryKnobsData);

// Apply treasury knobs to game state
function applyTreasuryKnobsToGameState() {
  const knobs = treasuryKnobSystem.knobs;
  
  // Apply budget management settings
  const budgetManagement = (knobs.budget_planning_horizon + knobs.budget_flexibility + 
    knobs.contingency_reserve_ratio) / 3;
  
  // Apply revenue management settings
  const revenueManagement = (knobs.tax_collection_efficiency + knobs.revenue_diversification + 
    knobs.tax_policy_optimization) / 3;
  
  // Apply expenditure control settings
  const expenditureControl = (knobs.spending_oversight_strictness + knobs.procurement_efficiency + 
    knobs.cost_benefit_analysis_rigor) / 3;
  
  // Apply debt management settings
  const debtManagement = (knobs.debt_sustainability_focus + knobs.borrowing_cost_optimization + 
    knobs.debt_transparency) / 3;
  
  // Apply financial controls settings
  const financialControls = (knobs.financial_controls_strictness + knobs.anti_fraud_measures + 
    knobs.regulatory_compliance_level) / 3;
  
  // Apply transparency and accountability settings
  const transparency = (knobs.public_financial_transparency + knobs.citizen_engagement_level + 
    knobs.parliamentary_oversight) / 3;
  
  console.log('Applied treasury knobs to game state:', {
    budgetManagement,
    revenueManagement,
    expenditureControl,
    debtManagement,
    financialControls,
    transparency
  });
}

// Mount department budget routes
treasuryRouter.use('/', departmentBudgetRouter);

// ==================== BUDGET MANAGEMENT ENDPOINTS ====================

/**
 * GET /api/treasury/budget/current
 * Get the current active budget for a campaign
 */
treasuryRouter.get('/budget/current', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const budget = await treasuryService.getCurrentBudget(Number(campaignId));
    
    if (!budget) {
      return res.status(404).json({ error: 'No active budget found' });
    }

    res.json({ budget });
  } catch (error) {
    console.error('Error fetching current budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/treasury/budget/:budgetId
 * Get a specific budget by ID
 */
treasuryRouter.get('/budget/:budgetId', async (req, res) => {
  try {
    const { budgetId } = req.params;
    
    const budget = await treasuryService.getBudget(budgetId);
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ budget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/budget
 * Create a new budget
 */
treasuryRouter.post('/budget', async (req, res) => {
  try {
    const budgetData = req.body;
    
    // Validate required fields
    if (!budgetData.campaignId || !budgetData.fiscalYear) {
      return res.status(400).json({ error: 'Campaign ID and fiscal year are required' });
    }

    const budget = await treasuryService.createBudget(budgetData);
    
    res.status(201).json({ budget });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/treasury/budget/:budgetId
 * Update an existing budget
 */
treasuryRouter.put('/budget/:budgetId', async (req, res) => {
  try {
    const { budgetId } = req.params;
    const updates = req.body;
    
    const budget = await treasuryService.updateBudget(budgetId, updates);
    
    res.json({ budget });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/treasury/budget/:budgetId/line-items
 * Get budget line items for a specific budget
 */
treasuryRouter.get('/budget/:budgetId/line-items', async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { department } = req.query;
    
    const lineItems = await treasuryService.getBudgetLineItems(budgetId, department as string);
    
    res.json({ lineItems });
  } catch (error) {
    console.error('Error fetching budget line items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/budget/line-item
 * Create a new budget line item
 */
treasuryRouter.post('/budget/line-item', async (req, res) => {
  try {
    const lineItemData = req.body;
    
    // Validate required fields
    if (!lineItemData.budgetId || !lineItemData.department || !lineItemData.category) {
      return res.status(400).json({ error: 'Budget ID, department, and category are required' });
    }

    const lineItem = await treasuryService.createBudgetLineItem(lineItemData);
    
    res.status(201).json({ lineItem });
  } catch (error) {
    console.error('Error creating budget line item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/treasury/budget/line-item/:lineItemId
 * Update a budget line item
 */
treasuryRouter.put('/budget/line-item/:lineItemId', async (req, res) => {
  try {
    const { lineItemId } = req.params;
    const updates = req.body;
    
    const lineItem = await treasuryService.updateBudgetLineItem(lineItemId, updates);
    
    res.json({ lineItem });
  } catch (error) {
    console.error('Error updating budget line item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== TAX REVENUE ENDPOINTS ====================

/**
 * GET /api/treasury/revenue/summary
 * Get tax revenue summary for a campaign
 */
treasuryRouter.get('/revenue/summary', async (req, res) => {
  try {
    const { campaignId, periodDays } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const summary = await treasuryService.getTaxRevenueSummary(
      Number(campaignId), 
      periodDays ? Number(periodDays) : 30
    );
    
    res.json({ summary });
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/revenue/collect-taxes
 * Manually trigger tax collection from all sources
 */
treasuryRouter.post('/revenue/collect-taxes', async (req, res) => {
  try {
    const { campaignId, tickId } = req.body;
    
    if (!campaignId || !tickId) {
      return res.status(400).json({ error: 'Campaign ID and tick ID are required' });
    }

    // Collect from households
    const householdCollections = await treasuryService.collectTaxesFromHouseholds(
      Number(campaignId), 
      Number(tickId)
    );

    // Collect from corporations
    const corporateCollections = await treasuryService.collectCorporateTaxes(
      Number(campaignId), 
      Number(tickId)
    );

    const totalCollections = [...householdCollections, ...corporateCollections];
    const totalAmount = totalCollections.reduce((sum, collection) => sum + collection.collectedAmount, 0);
    
    res.json({ 
      collections: totalCollections,
      totalAmount,
      collectionCount: totalCollections.length
    });
  } catch (error) {
    console.error('Error collecting taxes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/revenue/record-collection
 * Record a manual tax collection
 */
treasuryRouter.post('/revenue/record-collection', async (req, res) => {
  try {
    const collectionData = req.body;
    
    // Validate required fields
    if (!collectionData.campaignId || !collectionData.taxType || !collectionData.collectedAmount) {
      return res.status(400).json({ error: 'Campaign ID, tax type, and collected amount are required' });
    }

    const collection = await treasuryService.recordTaxCollection(collectionData);
    
    res.status(201).json({ collection });
  } catch (error) {
    console.error('Error recording tax collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== EXPENDITURE MANAGEMENT ENDPOINTS ====================

/**
 * GET /api/treasury/expenditures
 * Get expenditures for a campaign
 */
treasuryRouter.get('/expenditures', async (req, res) => {
  try {
    const { campaignId, department, status } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const expenditures = await treasuryService.getExpenditures(
      Number(campaignId),
      department as string,
      status as string
    );
    
    res.json({ expenditures });
  } catch (error) {
    console.error('Error fetching expenditures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/expenditures/request
 * Request a new expenditure
 */
treasuryRouter.post('/expenditures/request', async (req, res) => {
  try {
    const expenditureData = req.body;
    
    // Validate required fields
    if (!expenditureData.campaignId || !expenditureData.amount || !expenditureData.purpose) {
      return res.status(400).json({ error: 'Campaign ID, amount, and purpose are required' });
    }

    const expenditure = await treasuryService.requestExpenditure(expenditureData);
    
    res.status(201).json({ expenditure });
  } catch (error) {
    console.error('Error requesting expenditure:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/expenditures/:expenditureId/authorize
 * Authorize an expenditure (Treasury Secretary function)
 */
treasuryRouter.post('/expenditures/:expenditureId/authorize', async (req, res) => {
  try {
    const { expenditureId } = req.params;
    const { authorizingOfficer } = req.body;
    
    if (!authorizingOfficer) {
      return res.status(400).json({ error: 'Authorizing officer is required' });
    }

    const authorization = await treasuryService.authorizeExpenditure(expenditureId, authorizingOfficer);
    
    res.json({ authorization });
  } catch (error) {
    console.error('Error authorizing expenditure:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== FISCAL POLICY ENDPOINTS ====================

/**
 * GET /api/treasury/policies
 * Get fiscal policies for a campaign
 */
treasuryRouter.get('/policies', async (req, res) => {
  try {
    const { campaignId, policyType } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const policies = await treasuryService.getFiscalPolicies(
      Number(campaignId),
      policyType as string
    );
    
    res.json({ policies });
  } catch (error) {
    console.error('Error fetching fiscal policies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/policies
 * Create a new fiscal policy
 */
treasuryRouter.post('/policies', async (req, res) => {
  try {
    const policyData = req.body;
    
    // Validate required fields
    if (!policyData.campaignId || !policyData.policyName || !policyData.policyType) {
      return res.status(400).json({ error: 'Campaign ID, policy name, and policy type are required' });
    }

    const policy = await treasuryService.createFiscalPolicy(policyData);
    
    res.status(201).json({ policy });
  } catch (error) {
    console.error('Error creating fiscal policy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== REPORTING & ANALYTICS ENDPOINTS ====================

/**
 * GET /api/treasury/summary
 * Get comprehensive budget summary for a campaign
 */
treasuryRouter.get('/summary', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const summary = await treasuryService.generateBudgetSummary(Number(campaignId));
    
    res.json({ summary });
  } catch (error) {
    console.error('Error generating budget summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/treasury/fiscal-health
 * Get fiscal health metrics for a campaign
 */
treasuryRouter.get('/fiscal-health', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const fiscalHealth = await treasuryService.calculateFiscalHealth(Number(campaignId));
    
    res.json({ fiscalHealth });
  } catch (error) {
    console.error('Error calculating fiscal health:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== TREASURY SECRETARY DASHBOARD ENDPOINTS ====================

/**
 * GET /api/treasury/dashboard
 * Get comprehensive dashboard data for Treasury Secretary
 */
treasuryRouter.get('/dashboard', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const cId = Number(campaignId);
    const currentYear = new Date().getFullYear();

    // Get all key data in parallel
    const [
      currentBudget,
      budgetSummary,
      revenueSummary,
      fiscalHealth,
      pendingExpenditures,
      activePolicies,
      departmentRollup
    ] = await Promise.all([
      treasuryService.getCurrentBudget(cId),
      treasuryService.generateBudgetSummary(cId),
      treasuryService.getTaxRevenueSummary(cId),
      treasuryService.calculateFiscalHealth(cId),
      treasuryService.getExpenditures(cId, undefined, 'pending'),
      treasuryService.getFiscalPolicies(cId),
      departmentBudgetService.generateBudgetRollup(cId, currentYear)
    ]);

    const dashboard = {
      currentBudget,
      budgetSummary,
      revenueSummary,
      fiscalHealth,
      pendingExpenditures: {
        count: pendingExpenditures.length,
        totalAmount: pendingExpenditures.reduce((sum, exp) => sum + exp.amount, 0),
        expenditures: pendingExpenditures.slice(0, 10) // Top 10 pending
      },
      activePolicies: {
        count: activePolicies.filter(p => p.status === 'active').length,
        policies: activePolicies.filter(p => p.status === 'active')
      },
      departmentBudgets: {
        totalGovernmentBudget: departmentRollup.totalGovernmentBudget,
        totalGovernmentSpent: departmentRollup.totalGovernmentSpent,
        totalGovernmentRemaining: departmentRollup.totalGovernmentRemaining,
        departmentSummaries: departmentRollup.departmentSummaries,
        topSpendingCategories: departmentRollup.topSpendingCategories.slice(0, 5),
        departmentAlerts: departmentRollup.alerts
      },
      alerts: [] as string[]
    };

    // Generate alerts based on fiscal health
    if (fiscalHealth.currentDeficit < -100000) {
      dashboard.alerts.push('High budget deficit detected');
    }
    if (fiscalHealth.debtToGdpRatio > 0.8) {
      dashboard.alerts.push('Debt-to-GDP ratio exceeds recommended threshold');
    }
    if (revenueSummary.collectionEfficiency < 0.85) {
      dashboard.alerts.push('Tax collection efficiency below target');
    }
    if (pendingExpenditures.length > 20) {
      dashboard.alerts.push(`${pendingExpenditures.length} expenditures awaiting approval`);
    }

    // Add department budget alerts
    dashboard.alerts.push(...departmentRollup.alerts.map(alert => 
      `${alert.department}: ${alert.message}`
    ));

    res.json({ dashboard });
  } catch (error) {
    console.error('Error generating Treasury dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== CABINET INTEGRATION ENDPOINTS ====================

/**
 * GET /api/treasury/department-budgets/:department
 * Get budget allocation and spending for a specific department
 */
treasuryRouter.get('/department-budgets/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const budget = await treasuryService.getCurrentBudget(Number(campaignId));
    if (!budget) {
      return res.status(404).json({ error: 'No active budget found' });
    }

    const lineItems = await treasuryService.getBudgetLineItems(budget.id, department);
    const expenditures = await treasuryService.getExpenditures(Number(campaignId), department);

    const departmentBudget = {
      department,
      totalAllocated: lineItems.reduce((sum, item) => sum + item.allocatedAmount, 0),
      totalSpent: lineItems.reduce((sum, item) => sum + item.spentAmount, 0),
      remainingBalance: lineItems.reduce((sum, item) => sum + item.remainingAmount, 0),
      lineItems,
      recentExpenditures: expenditures.slice(0, 10),
      spendingTrend: expenditures.length > 0 ? 'stable' : 'no_activity'
    };

    res.json({ departmentBudget });
  } catch (error) {
    console.error('Error fetching department budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/treasury/department-budgets/:department/allocate
 * Allocate additional budget to a department (Treasury Secretary authority)
 */
treasuryRouter.post('/department-budgets/:department/allocate', async (req, res) => {
  try {
    const { department } = req.params;
    const { campaignId, amount, category, authorizedBy, justification } = req.body;
    
    if (!campaignId || !amount || !authorizedBy) {
      return res.status(400).json({ error: 'Campaign ID, amount, and authorizing officer are required' });
    }

    const budget = await treasuryService.getCurrentBudget(Number(campaignId));
    if (!budget) {
      return res.status(404).json({ error: 'No active budget found' });
    }

    const lineItem = await treasuryService.createBudgetLineItem({
      budgetId: budget.id,
      department,
      category: category || 'supplemental',
      allocatedAmount: Number(amount),
      authorizedBy,
      spendingAuthority: `ai-secretary-${department.toLowerCase()}`,
      description: `Additional budget allocation for ${department}`,
      justification: justification || 'Treasury Secretary discretionary allocation'
    });

    res.status(201).json({ 
      message: `Successfully allocated ${amount} to ${department}`,
      lineItem 
    });
  } catch (error) {
    console.error('Error allocating department budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(treasuryRouter, 'treasury', treasuryKnobSystem, applyTreasuryKnobsToGameState);

export default treasuryRouter;
