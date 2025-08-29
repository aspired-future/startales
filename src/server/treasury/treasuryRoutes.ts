import { Router } from 'express';
import { getPool } from '../storage/db';
import { TreasuryService } from './TreasuryService';
import { DepartmentBudgetService } from './DepartmentBudgetService';
import departmentBudgetRouter from './departmentBudgetRoutes';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const treasuryRouter = Router();
const treasuryService = new TreasuryService(getPool());
const departmentBudgetService = new DepartmentBudgetService(getPool(), treasuryService);

// Enhanced Knob System for Treasury & Tax Management
const treasuryKnobSystem = new EnhancedKnobSystem('treasury', {
  // Tax Policy & Collection Knobs (8 knobs)
  'income-tax-rate': {
    id: 'income-tax-rate',
    name: 'Income Tax Rate',
    description: 'Base income tax rate for citizens',
    category: 'tax-policy',
    type: 'percentage',
    min: 0,
    max: 100,
    default: 25,
    step: 0.5,
    unit: '%'
  },
  'corporate-tax-rate': {
    id: 'corporate-tax-rate',
    name: 'Corporate Tax Rate',
    description: 'Tax rate applied to corporate profits',
    category: 'tax-policy',
    type: 'percentage',
    min: 0,
    max: 50,
    default: 21,
    step: 0.5,
    unit: '%'
  },
  'sales-tax-rate': {
    id: 'sales-tax-rate',
    name: 'Sales Tax Rate',
    description: 'Tax rate on goods and services',
    category: 'tax-policy',
    type: 'percentage',
    min: 0,
    max: 25,
    default: 8.5,
    step: 0.25,
    unit: '%'
  },
  'property-tax-rate': {
    id: 'property-tax-rate',
    name: 'Property Tax Rate',
    description: 'Annual tax rate on property values',
    category: 'tax-policy',
    type: 'percentage',
    min: 0,
    max: 5,
    default: 1.2,
    step: 0.1,
    unit: '%'
  },
  'luxury-tax-rate': {
    id: 'luxury-tax-rate',
    name: 'Luxury Tax Rate',
    description: 'Additional tax on luxury goods and services',
    category: 'tax-policy',
    type: 'percentage',
    min: 0,
    max: 100,
    default: 15,
    step: 1,
    unit: '%'
  },
  'import-tariff-rate': {
    id: 'import-tariff-rate',
    name: 'Import Tariff Rate',
    description: 'Average tariff rate on imported goods',
    category: 'tax-policy',
    type: 'percentage',
    min: 0,
    max: 50,
    default: 5,
    step: 0.5,
    unit: '%'
  },
  'tax-collection-efficiency': {
    id: 'tax-collection-efficiency',
    name: 'Tax Collection Efficiency',
    description: 'Effectiveness of tax collection systems',
    category: 'tax-policy',
    type: 'percentage',
    min: 50,
    max: 100,
    default: 85,
    step: 1,
    unit: '%'
  },
  'tax-evasion-enforcement': {
    id: 'tax-evasion-enforcement',
    name: 'Tax Evasion Enforcement',
    description: 'Intensity of tax evasion prevention and prosecution',
    category: 'tax-policy',
    type: 'scale',
    min: 1,
    max: 10,
    default: 6,
    step: 1,
    unit: 'level'
  },

  // Budget Allocation & Spending Knobs (8 knobs)
  'defense-spending-allocation': {
    id: 'defense-spending-allocation',
    name: 'Defense Spending Allocation',
    description: 'Percentage of budget allocated to defense',
    category: 'budget-allocation',
    type: 'percentage',
    min: 5,
    max: 50,
    default: 15,
    step: 0.5,
    unit: '%'
  },
  'education-spending-allocation': {
    id: 'education-spending-allocation',
    name: 'Education Spending Allocation',
    description: 'Percentage of budget allocated to education',
    category: 'budget-allocation',
    type: 'percentage',
    min: 5,
    max: 30,
    default: 18,
    step: 0.5,
    unit: '%'
  },
  'healthcare-spending-allocation': {
    id: 'healthcare-spending-allocation',
    name: 'Healthcare Spending Allocation',
    description: 'Percentage of budget allocated to healthcare',
    category: 'budget-allocation',
    type: 'percentage',
    min: 5,
    max: 35,
    default: 20,
    step: 0.5,
    unit: '%'
  },
  'infrastructure-spending-allocation': {
    id: 'infrastructure-spending-allocation',
    name: 'Infrastructure Spending Allocation',
    description: 'Percentage of budget allocated to infrastructure',
    category: 'budget-allocation',
    type: 'percentage',
    min: 3,
    max: 25,
    default: 12,
    step: 0.5,
    unit: '%'
  },
  'social-services-allocation': {
    id: 'social-services-allocation',
    name: 'Social Services Allocation',
    description: 'Percentage of budget allocated to social services',
    category: 'budget-allocation',
    type: 'percentage',
    min: 5,
    max: 30,
    default: 15,
    step: 0.5,
    unit: '%'
  },
  'research-development-allocation': {
    id: 'research-development-allocation',
    name: 'Research & Development Allocation',
    description: 'Percentage of budget allocated to R&D',
    category: 'budget-allocation',
    type: 'percentage',
    min: 1,
    max: 15,
    default: 5,
    step: 0.25,
    unit: '%'
  },
  'emergency-reserves-target': {
    id: 'emergency-reserves-target',
    name: 'Emergency Reserves Target',
    description: 'Target percentage of GDP to maintain in emergency reserves',
    category: 'budget-allocation',
    type: 'percentage',
    min: 2,
    max: 20,
    default: 8,
    step: 0.5,
    unit: '% GDP'
  },
  'debt-service-priority': {
    id: 'debt-service-priority',
    name: 'Debt Service Priority',
    description: 'Priority level for debt service payments',
    category: 'budget-allocation',
    type: 'scale',
    min: 1,
    max: 10,
    default: 9,
    step: 1,
    unit: 'priority'
  },

  // Revenue Management & Optimization Knobs (8 knobs)
  'revenue-diversification-target': {
    id: 'revenue-diversification-target',
    name: 'Revenue Diversification Target',
    description: 'Target level of revenue source diversification',
    category: 'revenue-management',
    type: 'percentage',
    min: 30,
    max: 90,
    default: 65,
    step: 1,
    unit: '%'
  },
  'tax-incentive-aggressiveness': {
    id: 'tax-incentive-aggressiveness',
    name: 'Tax Incentive Aggressiveness',
    description: 'How aggressively to use tax incentives for economic growth',
    category: 'revenue-management',
    type: 'scale',
    min: 1,
    max: 10,
    default: 5,
    step: 1,
    unit: 'level'
  },
  'public-asset-monetization': {
    id: 'public-asset-monetization',
    name: 'Public Asset Monetization',
    description: 'Level of public asset monetization for revenue',
    category: 'revenue-management',
    type: 'scale',
    min: 1,
    max: 10,
    default: 4,
    step: 1,
    unit: 'level'
  },
  'user-fee-optimization': {
    id: 'user-fee-optimization',
    name: 'User Fee Optimization',
    description: 'Optimization level for government service user fees',
    category: 'revenue-management',
    type: 'scale',
    min: 1,
    max: 10,
    default: 6,
    step: 1,
    unit: 'level'
  },
  'sin-tax-strategy': {
    id: 'sin-tax-strategy',
    name: 'Sin Tax Strategy',
    description: 'Strategy for taxes on alcohol, tobacco, and other vice products',
    category: 'revenue-management',
    type: 'scale',
    min: 1,
    max: 10,
    default: 7,
    step: 1,
    unit: 'level'
  },
  'carbon-tax-implementation': {
    id: 'carbon-tax-implementation',
    name: 'Carbon Tax Implementation',
    description: 'Level of carbon tax implementation for environmental revenue',
    category: 'revenue-management',
    type: 'scale',
    min: 0,
    max: 10,
    default: 3,
    step: 1,
    unit: 'level'
  },
  'digital-economy-taxation': {
    id: 'digital-economy-taxation',
    name: 'Digital Economy Taxation',
    description: 'Approach to taxing digital economy transactions',
    category: 'revenue-management',
    type: 'scale',
    min: 1,
    max: 10,
    default: 5,
    step: 1,
    unit: 'level'
  },
  'international-tax-cooperation': {
    id: 'international-tax-cooperation',
    name: 'International Tax Cooperation',
    description: 'Level of cooperation with international tax initiatives',
    category: 'revenue-management',
    type: 'scale',
    min: 1,
    max: 10,
    default: 6,
    step: 1,
    unit: 'level'
  }
});

// Apply treasury knobs to game state
function applyTreasuryKnobsToGameState(campaignId: string, civilizationId: string) {
  // This function will be called by the simulation engine to apply knob settings
  console.log(`Applied treasury knobs to game state for campaign ${campaignId}, civilization ${civilizationId}`);
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

// ==================== ENHANCED TAX LINE ITEMS ENDPOINTS ====================

/**
 * GET /api/treasury/tax-line-items
 * Get detailed tax line items with collection efficiency and evasion rates
 */
treasuryRouter.get('/tax-line-items', async (req, res) => {
  try {
    const { campaignId, civilizationId } = req.query;
    
    if (!campaignId || !civilizationId) {
      return res.status(400).json({ error: 'Campaign ID and Civilization ID are required' });
    }

    const knobValues = await treasuryKnobSystem.getKnobValues(campaignId as string, civilizationId as string);
    
    const taxLineItems = {
      collections: [
        {
          source: 'Individual Income Tax',
          rate: knobValues['income-tax-rate'],
          baseAmount: 1000000000,
          collectedAmount: calculateIncomeTaxRevenue(knobValues),
          efficiency: knobValues['tax-collection-efficiency'],
          evasionRate: calculateEvasionRate(knobValues, 'income')
        },
        {
          source: 'Corporate Income Tax',
          rate: knobValues['corporate-tax-rate'],
          baseAmount: 500000000,
          collectedAmount: calculateCorporateTaxRevenue(knobValues),
          efficiency: knobValues['tax-collection-efficiency'],
          evasionRate: calculateEvasionRate(knobValues, 'corporate')
        },
        {
          source: 'Sales & Use Tax',
          rate: knobValues['sales-tax-rate'],
          baseAmount: 800000000,
          collectedAmount: calculateSalesTaxRevenue(knobValues),
          efficiency: knobValues['tax-collection-efficiency'],
          evasionRate: calculateEvasionRate(knobValues, 'sales')
        },
        {
          source: 'Property Tax',
          rate: knobValues['property-tax-rate'],
          baseAmount: 2000000000,
          collectedAmount: calculatePropertyTaxRevenue(knobValues),
          efficiency: knobValues['tax-collection-efficiency'],
          evasionRate: calculateEvasionRate(knobValues, 'property')
        },
        {
          source: 'Luxury Goods Tax',
          rate: knobValues['luxury-tax-rate'],
          baseAmount: 100000000,
          collectedAmount: calculateLuxuryTaxRevenue(knobValues),
          efficiency: knobValues['tax-collection-efficiency'],
          evasionRate: calculateEvasionRate(knobValues, 'luxury')
        },
        {
          source: 'Import Tariffs',
          rate: knobValues['import-tariff-rate'],
          baseAmount: 300000000,
          collectedAmount: calculateTariffRevenue(knobValues),
          efficiency: knobValues['tax-collection-efficiency'],
          evasionRate: calculateEvasionRate(knobValues, 'tariff')
        }
      ]
    };
    
    // Calculate totals
    const totalCollected = taxLineItems.collections.reduce((sum, item) => sum + item.collectedAmount, 0);
    const totalPotential = taxLineItems.collections.reduce((sum, item) => sum + item.baseAmount, 0);
    
    res.json({
      success: true,
      data: {
        ...taxLineItems,
        summary: {
          totalCollected,
          totalPotential,
          overallEfficiency: knobValues['tax-collection-efficiency'],
          enforcementLevel: knobValues['tax-evasion-enforcement']
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting tax line items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tax line items'
    });
  }
});

/**
 * GET /api/treasury/budget-allocation-breakdown
 * Get budget allocation breakdown based on current knob settings
 */
treasuryRouter.get('/budget-allocation-breakdown', async (req, res) => {
  try {
    const { campaignId, civilizationId } = req.query;
    
    if (!campaignId || !civilizationId) {
      return res.status(400).json({ error: 'Campaign ID and Civilization ID are required' });
    }

    const knobValues = await treasuryKnobSystem.getKnobValues(campaignId as string, civilizationId as string);
    
    const budgetAllocation = {
      defense: {
        allocation: knobValues['defense-spending-allocation'],
        amount: calculateBudgetAmount(knobValues, 'defense-spending-allocation')
      },
      education: {
        allocation: knobValues['education-spending-allocation'],
        amount: calculateBudgetAmount(knobValues, 'education-spending-allocation')
      },
      healthcare: {
        allocation: knobValues['healthcare-spending-allocation'],
        amount: calculateBudgetAmount(knobValues, 'healthcare-spending-allocation')
      },
      infrastructure: {
        allocation: knobValues['infrastructure-spending-allocation'],
        amount: calculateBudgetAmount(knobValues, 'infrastructure-spending-allocation')
      },
      socialServices: {
        allocation: knobValues['social-services-allocation'],
        amount: calculateBudgetAmount(knobValues, 'social-services-allocation')
      },
      researchDevelopment: {
        allocation: knobValues['research-development-allocation'],
        amount: calculateBudgetAmount(knobValues, 'research-development-allocation')
      },
      emergencyReserves: {
        target: knobValues['emergency-reserves-target'],
        currentLevel: calculateCurrentReserveLevel(knobValues)
      },
      debtService: {
        priority: knobValues['debt-service-priority'],
        amount: calculateDebtServiceAmount(knobValues)
      }
    };
    
    res.json({
      success: true,
      data: budgetAllocation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting budget allocation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get budget allocation'
    });
  }
});

// Helper functions for revenue calculations
function calculateIncomeTaxRevenue(knobValues: any): number {
  const baseRevenue = 1000000000;
  const rate = knobValues['income-tax-rate'] / 100;
  const efficiency = knobValues['tax-collection-efficiency'] / 100;
  return baseRevenue * rate * efficiency;
}

function calculateCorporateTaxRevenue(knobValues: any): number {
  const baseRevenue = 500000000;
  const rate = knobValues['corporate-tax-rate'] / 100;
  const efficiency = knobValues['tax-collection-efficiency'] / 100;
  return baseRevenue * rate * efficiency;
}

function calculateSalesTaxRevenue(knobValues: any): number {
  const baseRevenue = 800000000;
  const rate = knobValues['sales-tax-rate'] / 100;
  const efficiency = knobValues['tax-collection-efficiency'] / 100;
  return baseRevenue * rate * efficiency;
}

function calculatePropertyTaxRevenue(knobValues: any): number {
  const baseRevenue = 2000000000;
  const rate = knobValues['property-tax-rate'] / 100;
  const efficiency = knobValues['tax-collection-efficiency'] / 100;
  return baseRevenue * rate * efficiency;
}

function calculateLuxuryTaxRevenue(knobValues: any): number {
  const baseRevenue = 100000000;
  const rate = knobValues['luxury-tax-rate'] / 100;
  const efficiency = knobValues['tax-collection-efficiency'] / 100;
  return baseRevenue * rate * efficiency;
}

function calculateTariffRevenue(knobValues: any): number {
  const baseRevenue = 300000000;
  const rate = knobValues['import-tariff-rate'] / 100;
  const efficiency = knobValues['tax-collection-efficiency'] / 100;
  return baseRevenue * rate * efficiency;
}

function calculateBudgetAmount(knobValues: any, allocationKey: string): number {
  const totalBudget = 5000000000; // $5B total budget
  const allocation = knobValues[allocationKey] / 100;
  return totalBudget * allocation;
}

function calculateCurrentReserveLevel(knobValues: any): number {
  // Simulate current reserve level based on various factors
  return Math.random() * knobValues['emergency-reserves-target'];
}

function calculateDebtServiceAmount(knobValues: any): number {
  const totalDebt = 2000000000; // $2B total debt
  const interestRate = 0.03; // 3% average interest rate
  const priority = knobValues['debt-service-priority'] / 10;
  return totalDebt * interestRate * priority;
}

function calculateEvasionRate(knobValues: any, taxType: string): number {
  const baseEvasionRates: { [key: string]: number } = {
    income: 15,
    corporate: 20,
    sales: 8,
    property: 5,
    luxury: 25,
    tariff: 12
  };
  
  const enforcementLevel = knobValues['tax-evasion-enforcement'];
  const baseRate = baseEvasionRates[taxType] || 10;
  
  // Higher enforcement reduces evasion
  const enforcementReduction = (enforcementLevel - 1) * 2; // 0-18% reduction
  return Math.max(1, baseRate - enforcementReduction);
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(treasuryRouter, treasuryKnobSystem);

export default treasuryRouter;
