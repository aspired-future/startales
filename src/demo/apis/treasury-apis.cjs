/**
 * Treasury Operations API - Financial management, budget allocation, and fiscal policy
 */

const express = require('express');
const router = express.Router();
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const treasuryKnobsData = {
  // Budget Management
  budget_allocation_efficiency: 0.7,       // AI can control budget allocation optimization (0.0-1.0)
  spending_oversight_strictness: 0.6,      // AI can control spending oversight (0.0-1.0)
  revenue_optimization_focus: 0.8,         // AI can control revenue generation focus (0.0-1.0)
  fiscal_discipline_level: 0.7,            // AI can control fiscal responsibility (0.0-1.0)
  
  // Tax Policy & Revenue
  tax_collection_efficiency: 0.75,         // AI can control tax collection effectiveness (0.0-1.0)
  tax_policy_progressiveness: 0.6,         // AI can control tax progressiveness (0.0-1.0)
  corporate_tax_enforcement: 0.7,          // AI can control corporate tax collection (0.0-1.0)
  tax_evasion_prevention: 0.65,            // AI can control anti-evasion measures (0.0-1.0)
  
  // Government Spending
  infrastructure_spending_priority: 0.6,   // AI can control infrastructure investment (0.0-1.0)
  social_program_funding: 0.5,             // AI can control social spending (0.0-1.0)
  defense_budget_allocation: 0.4,          // AI can control military spending (0.0-1.0)
  education_funding_priority: 0.7,         // AI can control education investment (0.0-1.0)
  healthcare_budget_allocation: 0.6,       // AI can control healthcare spending (0.0-1.0)
  research_development_funding: 0.5,       // AI can control R&D investment (0.0-1.0)
  
  // Debt & Financial Management
  debt_management_strategy: 0.6,           // AI can control debt management approach (0.0-1.0)
  borrowing_cost_optimization: 0.7,        // AI can optimize borrowing costs (0.0-1.0)
  debt_to_gdp_target: 0.4,                 // AI can control debt ratio targets (0.0-1.0)
  emergency_fund_allocation: 0.3,          // AI can control emergency reserves (0.0-1.0)
  
  // Economic Policy Coordination
  monetary_fiscal_coordination: 0.7,       // AI can coordinate with central bank (0.0-1.0)
  economic_stimulus_readiness: 0.5,        // AI can control stimulus preparedness (0.0-1.0)
  counter_cyclical_policy: 0.6,            // AI can control economic cycle response (0.0-1.0)
  inflation_response_sensitivity: 0.7,     // AI can control inflation response (0.0-1.0)
  
  // Financial Transparency & Accountability
  budget_transparency_level: 0.8,          // AI can control budget transparency (0.0-1.0)
  financial_reporting_frequency: 0.7,      // AI can control reporting frequency (0.0-1.0)
  audit_compliance_strictness: 0.8,        // AI can control audit requirements (0.0-1.0)
  public_financial_disclosure: 0.6,        // AI can control public disclosure (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const treasuryKnobSystem = new EnhancedKnobSystem(treasuryKnobsData);

// Backward compatibility - expose knobs directly
const treasuryKnobs = treasuryKnobSystem.knobs;

// Treasury state tracking
const treasuryState = {
  budget: {
    totalBudget: 2500000000000, // $2.5 trillion
    allocatedBudget: 2200000000000,
    remainingBudget: 300000000000,
    budgetUtilization: 0.88
  },
  revenue: {
    totalRevenue: 2400000000000,
    taxRevenue: 1800000000000,
    corporateTaxes: 400000000000,
    otherRevenue: 200000000000,
    revenueGrowthRate: 0.03
  },
  expenditures: {
    infrastructure: 450000000000,
    socialPrograms: 600000000000,
    defense: 350000000000,
    education: 300000000000,
    healthcare: 400000000000,
    researchDevelopment: 100000000000,
    other: 200000000000
  },
  debt: {
    totalDebt: 15000000000000,
    debtToGdpRatio: 0.65,
    interestPayments: 300000000000,
    averageInterestRate: 0.02,
    creditRating: 'AAA'
  },
  reserves: {
    emergencyFund: 500000000000,
    strategicReserve: 200000000000,
    contingencyFund: 100000000000,
    totalReserves: 800000000000
  },
  performance: {
    budgetAccuracy: 0.92,
    spendingEfficiency: 0.85,
    revenueProjectionAccuracy: 0.88,
    fiscalHealthScore: 0.78
  }
};

// Structured Outputs - For AI consumption, HUD display, and game state
function generateTreasuryStructuredOutputs() {
  return {
    // High-level treasury metrics for AI decision-making
    treasury_metrics: {
      budget_utilization: treasuryState.budget.budgetUtilization,
      revenue_growth: treasuryState.revenue.revenueGrowthRate,
      debt_ratio: treasuryState.debt.debtToGdpRatio,
      fiscal_health: treasuryState.performance.fiscalHealthScore,
      spending_efficiency: treasuryState.performance.spendingEfficiency,
      budget_balance: calculateBudgetBalance(),
      liquidity_position: calculateLiquidityPosition(),
      financial_stability: calculateFinancialStability()
    },
    
    // Treasury analysis for AI strategic planning
    treasury_analysis: {
      budget_allocation_analysis: analyzeBudgetAllocation(),
      revenue_optimization_opportunities: analyzeRevenueOptimization(),
      spending_efficiency_assessment: analyzeSpendingEfficiency(),
      debt_sustainability_analysis: analyzeDebtSustainability(),
      fiscal_policy_effectiveness: analyzeFiscalPolicyEffectiveness()
    },
    
    // Treasury effectiveness assessment for AI feedback
    effectiveness_assessment: {
      budget_management_quality: assessBudgetManagementQuality(),
      revenue_collection_effectiveness: assessRevenueCollectionEffectiveness(),
      spending_oversight_strength: assessSpendingOversightStrength(),
      debt_management_capability: assessDebtManagementCapability(),
      fiscal_transparency_level: assessFiscalTransparencyLevel()
    },
    
    // Treasury alerts and recommendations for AI attention
    ai_alerts: generateTreasuryAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      budget_availability: calculateBudgetAvailability(),
      spending_capacity: calculateSpendingCapacity(),
      revenue_projections: calculateRevenueProjections(),
      fiscal_policy_impact: calculateFiscalPolicyImpact(),
      economic_coordination_data: calculateEconomicCoordinationData(),
      financial_health_indicators: calculateFinancialHealthIndicators()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...treasuryKnobs }
  };
}

// Treasury API endpoints
router.get('/', (req, res) => {
  try {
    const { category, timeframe, detail_level } = req.query;
    
    let treasuryData = {
      budget_summary: {
        total_budget: treasuryState.budget.totalBudget,
        allocated: treasuryState.budget.allocatedBudget,
        remaining: treasuryState.budget.remainingBudget,
        utilization_rate: treasuryState.budget.budgetUtilization
      },
      revenue_summary: {
        total_revenue: treasuryState.revenue.totalRevenue,
        tax_revenue: treasuryState.revenue.taxRevenue,
        growth_rate: treasuryState.revenue.revenueGrowthRate
      },
      debt_summary: {
        total_debt: treasuryState.debt.totalDebt,
        debt_to_gdp: treasuryState.debt.debtToGdpRatio,
        credit_rating: treasuryState.debt.creditRating
      },
      performance_indicators: treasuryState.performance
    };
    
    if (detail_level === 'full') {
      treasuryData.detailed_expenditures = treasuryState.expenditures;
      treasuryData.reserves = treasuryState.reserves;
    }
    
    res.json({
      success: true,
      data: treasuryData,
      fiscal_discipline: treasuryKnobs.fiscal_discipline_level,
      budget_efficiency: treasuryKnobs.budget_allocation_efficiency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get treasury data',
      details: error.message
    });
  }
});

// Budget allocation endpoint
router.get('/budget', (req, res) => {
  try {
    const { category, fiscal_year } = req.query;
    
    let budgetData = {
      total_budget: treasuryState.budget.totalBudget,
      allocation_breakdown: treasuryState.expenditures,
      budget_utilization: treasuryState.budget.budgetUtilization,
      remaining_budget: treasuryState.budget.remainingBudget,
      allocation_efficiency: treasuryKnobs.budget_allocation_efficiency
    };
    
    if (category) {
      budgetData.category_details = {
        allocated: treasuryState.expenditures[category] || 0,
        utilization: Math.random() * 0.3 + 0.7, // Mock utilization
        efficiency_score: Math.random() * 0.4 + 0.6
      };
    }
    
    res.json({
      success: true,
      data: budgetData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get budget data',
      details: error.message
    });
  }
});

// Revenue management endpoint
router.get('/revenue', (req, res) => {
  try {
    const { source, timeframe } = req.query;
    
    let revenueData = {
      total_revenue: treasuryState.revenue.totalRevenue,
      revenue_sources: {
        tax_revenue: treasuryState.revenue.taxRevenue,
        corporate_taxes: treasuryState.revenue.corporateTaxes,
        other_revenue: treasuryState.revenue.otherRevenue
      },
      growth_rate: treasuryState.revenue.revenueGrowthRate,
      collection_efficiency: treasuryKnobs.tax_collection_efficiency,
      optimization_level: treasuryKnobs.revenue_optimization_focus
    };
    
    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get revenue data',
      details: error.message
    });
  }
});

// Debt management endpoint
router.get('/debt', (req, res) => {
  try {
    const { metric, projection } = req.query;
    
    let debtData = {
      total_debt: treasuryState.debt.totalDebt,
      debt_to_gdp_ratio: treasuryState.debt.debtToGdpRatio,
      interest_payments: treasuryState.debt.interestPayments,
      average_interest_rate: treasuryState.debt.averageInterestRate,
      credit_rating: treasuryState.debt.creditRating,
      management_strategy: treasuryKnobs.debt_management_strategy,
      sustainability_score: calculateDebtSustainability()
    };
    
    res.json({
      success: true,
      data: debtData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get debt data',
      details: error.message
    });
  }
});

// Financial reserves endpoint
router.get('/reserves', (req, res) => {
  try {
    const { type, status } = req.query;
    
    let reservesData = {
      total_reserves: treasuryState.reserves.totalReserves,
      emergency_fund: treasuryState.reserves.emergencyFund,
      strategic_reserve: treasuryState.reserves.strategicReserve,
      contingency_fund: treasuryState.reserves.contingencyFund,
      reserve_adequacy: calculateReserveAdequacy(),
      emergency_readiness: treasuryKnobs.emergency_fund_allocation
    };
    
    res.json({
      success: true,
      data: reservesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get reserves data',
      details: error.message
    });
  }
});

// Budget allocation update endpoint
router.post('/budget/allocate', (req, res) => {
  try {
    const { category, amount, justification } = req.body;
    
    if (treasuryState.expenditures.hasOwnProperty(category)) {
      const oldAmount = treasuryState.expenditures[category];
      treasuryState.expenditures[category] = amount;
      
      // Update budget utilization
      const totalAllocated = Object.values(treasuryState.expenditures).reduce((sum, val) => sum + val, 0);
      treasuryState.budget.allocatedBudget = totalAllocated;
      treasuryState.budget.remainingBudget = treasuryState.budget.totalBudget - totalAllocated;
      treasuryState.budget.budgetUtilization = totalAllocated / treasuryState.budget.totalBudget;
      
      res.json({
        success: true,
        data: {
          category: category,
          old_amount: oldAmount,
          new_amount: amount,
          budget_utilization: treasuryState.budget.budgetUtilization,
          remaining_budget: treasuryState.budget.remainingBudget
        },
        message: 'Budget allocation updated successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid budget category'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update budget allocation',
      details: error.message
    });
  }
});

// Helper functions for treasury structured outputs (streamlined)
function calculateBudgetBalance() {
  const revenue = treasuryState.revenue.totalRevenue;
  const expenditures = Object.values(treasuryState.expenditures).reduce((sum, val) => sum + val, 0);
  return (revenue - expenditures) / revenue; // As percentage of revenue
}

function calculateLiquidityPosition() {
  const reserves = treasuryState.reserves.totalReserves;
  const monthlyExpenditure = Object.values(treasuryState.expenditures).reduce((sum, val) => sum + val, 0) / 12;
  return reserves / monthlyExpenditure; // Months of expenditure coverage
}

function calculateFinancialStability() {
  const budgetBalance = calculateBudgetBalance();
  const debtRatio = treasuryState.debt.debtToGdpRatio;
  const liquidity = Math.min(calculateLiquidityPosition() / 6, 1); // Normalize to 6 months max
  return (Math.max(budgetBalance, 0) + (1 - Math.min(debtRatio, 1)) + liquidity) / 3;
}

function analyzeBudgetAllocation() {
  const allocations = treasuryState.expenditures;
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const distribution = {};
  Object.keys(allocations).forEach(key => {
    distribution[key] = allocations[key] / total;
  });
  
  const efficiency = treasuryKnobs.budget_allocation_efficiency;
  return { distribution, efficiency_score: efficiency, balance_score: calculateAllocationBalance() };
}

function calculateAllocationBalance() {
  const allocations = Object.values(treasuryState.expenditures);
  const mean = allocations.reduce((sum, val) => sum + val, 0) / allocations.length;
  const variance = allocations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allocations.length;
  return 1 / (1 + variance / Math.pow(mean, 2)); // Lower variance = better balance
}

function analyzeRevenueOptimization() {
  const taxEfficiency = treasuryKnobs.tax_collection_efficiency;
  const revenueOptimization = treasuryKnobs.revenue_optimization_focus;
  const corporateEnforcement = treasuryKnobs.corporate_tax_enforcement;
  const evasionPrevention = treasuryKnobs.tax_evasion_prevention;
  
  const optimizationScore = (taxEfficiency + revenueOptimization + corporateEnforcement + evasionPrevention) / 4;
  const potentialIncrease = (1 - optimizationScore) * 0.2; // Up to 20% potential increase
  
  return {
    optimization_score: optimizationScore,
    potential_revenue_increase: potentialIncrease,
    collection_efficiency: taxEfficiency,
    enforcement_strength: corporateEnforcement
  };
}

function analyzeSpendingEfficiency() {
  const oversight = treasuryKnobs.spending_oversight_strictness;
  const efficiency = treasuryState.performance.spendingEfficiency;
  const budgetAccuracy = treasuryState.performance.budgetAccuracy;
  
  const overallEfficiency = (oversight + efficiency + budgetAccuracy) / 3;
  return {
    efficiency_score: overallEfficiency,
    oversight_level: oversight,
    budget_accuracy: budgetAccuracy,
    waste_reduction_potential: 1 - overallEfficiency
  };
}

function analyzeDebtSustainability() {
  const debtRatio = treasuryState.debt.debtToGdpRatio;
  const interestRate = treasuryState.debt.averageInterestRate;
  const managementStrategy = treasuryKnobs.debt_management_strategy;
  const borrowingOptimization = treasuryKnobs.borrowing_cost_optimization;
  
  // Simple sustainability metric
  const sustainability = Math.max(0, 1 - (debtRatio * interestRate * 10)) * managementStrategy;
  
  return {
    sustainability_score: sustainability,
    debt_ratio: debtRatio,
    management_effectiveness: managementStrategy,
    borrowing_efficiency: borrowingOptimization
  };
}

function calculateDebtSustainability() {
  return analyzeDebtSustainability().sustainability_score;
}

function analyzeFiscalPolicyEffectiveness() {
  const fiscalDiscipline = treasuryKnobs.fiscal_discipline_level;
  const coordination = treasuryKnobs.monetary_fiscal_coordination;
  const stimulusReadiness = treasuryKnobs.economic_stimulus_readiness;
  const counterCyclical = treasuryKnobs.counter_cyclical_policy;
  
  const effectiveness = (fiscalDiscipline + coordination + stimulusReadiness + counterCyclical) / 4;
  return {
    policy_effectiveness: effectiveness,
    fiscal_discipline: fiscalDiscipline,
    coordination_level: coordination,
    stimulus_capability: stimulusReadiness
  };
}

function assessBudgetManagementQuality() {
  const allocationEfficiency = treasuryKnobs.budget_allocation_efficiency;
  const budgetAccuracy = treasuryState.performance.budgetAccuracy;
  const utilization = treasuryState.budget.budgetUtilization;
  
  const quality = (allocationEfficiency + budgetAccuracy + Math.min(utilization, 1)) / 3;
  return { quality_score: quality, allocation_efficiency: allocationEfficiency, accuracy: budgetAccuracy };
}

function assessRevenueCollectionEffectiveness() {
  const collectionEfficiency = treasuryKnobs.tax_collection_efficiency;
  const enforcement = treasuryKnobs.corporate_tax_enforcement;
  const evasionPrevention = treasuryKnobs.tax_evasion_prevention;
  const revenueGrowth = treasuryState.revenue.revenueGrowthRate;
  
  const effectiveness = (collectionEfficiency + enforcement + evasionPrevention + Math.min(revenueGrowth * 10, 1)) / 4;
  return { effectiveness_score: effectiveness, collection_efficiency: collectionEfficiency, enforcement_level: enforcement };
}

function assessSpendingOversightStrength() {
  const oversight = treasuryKnobs.spending_oversight_strictness;
  const auditCompliance = treasuryKnobs.audit_compliance_strictness;
  const transparency = treasuryKnobs.budget_transparency_level;
  const spendingEfficiency = treasuryState.performance.spendingEfficiency;
  
  const strength = (oversight + auditCompliance + transparency + spendingEfficiency) / 4;
  return { oversight_strength: strength, compliance_level: auditCompliance, transparency_level: transparency };
}

function assessDebtManagementCapability() {
  const managementStrategy = treasuryKnobs.debt_management_strategy;
  const borrowingOptimization = treasuryKnobs.borrowing_cost_optimization;
  const sustainability = calculateDebtSustainability();
  const creditRating = treasuryState.debt.creditRating === 'AAA' ? 1.0 : treasuryState.debt.creditRating === 'AA' ? 0.9 : 0.8;
  
  const capability = (managementStrategy + borrowingOptimization + sustainability + creditRating) / 4;
  return { capability_score: capability, management_strategy: managementStrategy, credit_rating: creditRating };
}

function assessFiscalTransparencyLevel() {
  const transparency = treasuryKnobs.budget_transparency_level;
  const reporting = treasuryKnobs.financial_reporting_frequency;
  const disclosure = treasuryKnobs.public_financial_disclosure;
  const auditCompliance = treasuryKnobs.audit_compliance_strictness;
  
  const transparencyLevel = (transparency + reporting + disclosure + auditCompliance) / 4;
  return { transparency_level: transparencyLevel, reporting_frequency: reporting, public_disclosure: disclosure };
}

function generateTreasuryAIAlerts() {
  const alerts = [];
  
  // Budget utilization alert
  const utilization = treasuryState.budget.budgetUtilization;
  if (utilization > 0.95) {
    alerts.push({ type: 'budget_overutilization', severity: 'high', message: 'Budget utilization is critically high' });
  } else if (utilization < 0.7) {
    alerts.push({ type: 'budget_underutilization', severity: 'medium', message: 'Budget utilization is low, funds may be idle' });
  }
  
  // Debt sustainability alert
  const debtRatio = treasuryState.debt.debtToGdpRatio;
  if (debtRatio > 0.8) {
    alerts.push({ type: 'high_debt_ratio', severity: 'critical', message: 'Debt-to-GDP ratio is dangerously high' });
  } else if (debtRatio > 0.6) {
    alerts.push({ type: 'elevated_debt_ratio', severity: 'medium', message: 'Debt-to-GDP ratio is elevated' });
  }
  
  // Revenue growth alert
  const revenueGrowth = treasuryState.revenue.revenueGrowthRate;
  if (revenueGrowth < 0) {
    alerts.push({ type: 'revenue_decline', severity: 'high', message: 'Revenue is declining' });
  } else if (revenueGrowth < 0.02) {
    alerts.push({ type: 'slow_revenue_growth', severity: 'medium', message: 'Revenue growth is below target' });
  }
  
  // Fiscal discipline alert
  const fiscalDiscipline = treasuryKnobs.fiscal_discipline_level;
  if (fiscalDiscipline < 0.5) {
    alerts.push({ type: 'weak_fiscal_discipline', severity: 'medium', message: 'Fiscal discipline levels are concerning' });
  }
  
  // Reserve adequacy alert
  const reserveAdequacy = calculateReserveAdequacy();
  if (reserveAdequacy < 0.3) {
    alerts.push({ type: 'low_reserves', severity: 'high', message: 'Financial reserves are inadequate' });
  }
  
  return alerts;
}

function calculateBudgetAvailability() {
  const remainingBudget = treasuryState.budget.remainingBudget;
  const totalBudget = treasuryState.budget.totalBudget;
  const allocationEfficiency = treasuryKnobs.budget_allocation_efficiency;
  
  return {
    remaining_budget: remainingBudget,
    availability_ratio: remainingBudget / totalBudget,
    allocation_efficiency: allocationEfficiency,
    emergency_allocation_capacity: remainingBudget * 0.5 // 50% can be used for emergencies
  };
}

function calculateSpendingCapacity() {
  const totalBudget = treasuryState.budget.totalBudget;
  const currentSpending = Object.values(treasuryState.expenditures).reduce((sum, val) => sum + val, 0);
  const spendingEfficiency = treasuryState.performance.spendingEfficiency;
  
  return {
    total_capacity: totalBudget,
    current_spending: currentSpending,
    remaining_capacity: totalBudget - currentSpending,
    efficiency_multiplier: spendingEfficiency,
    effective_capacity: (totalBudget - currentSpending) * spendingEfficiency
  };
}

function calculateRevenueProjections() {
  const currentRevenue = treasuryState.revenue.totalRevenue;
  const growthRate = treasuryState.revenue.revenueGrowthRate;
  const optimizationFocus = treasuryKnobs.revenue_optimization_focus;
  const collectionEfficiency = treasuryKnobs.tax_collection_efficiency;
  
  const projectedGrowth = growthRate * (1 + optimizationFocus * 0.2);
  const nextYearRevenue = currentRevenue * (1 + projectedGrowth);
  
  return {
    current_revenue: currentRevenue,
    projected_growth_rate: projectedGrowth,
    next_year_projection: nextYearRevenue,
    optimization_potential: (1 - collectionEfficiency) * currentRevenue * 0.1,
    revenue_stability: collectionEfficiency
  };
}

function calculateFiscalPolicyImpact() {
  const fiscalDiscipline = treasuryKnobs.fiscal_discipline_level;
  const stimulusReadiness = treasuryKnobs.economic_stimulus_readiness;
  const counterCyclical = treasuryKnobs.counter_cyclical_policy;
  const coordination = treasuryKnobs.monetary_fiscal_coordination;
  
  return {
    policy_effectiveness: (fiscalDiscipline + stimulusReadiness + counterCyclical + coordination) / 4,
    stimulus_capacity: stimulusReadiness * treasuryState.budget.remainingBudget,
    counter_cyclical_strength: counterCyclical,
    coordination_level: coordination,
    fiscal_multiplier: 1 + (fiscalDiscipline * 0.5)
  };
}

function calculateEconomicCoordinationData() {
  const coordination = treasuryKnobs.monetary_fiscal_coordination;
  const inflationResponse = treasuryKnobs.inflation_response_sensitivity;
  const stimulusReadiness = treasuryKnobs.economic_stimulus_readiness;
  
  return {
    coordination_effectiveness: coordination,
    policy_synchronization: (coordination + inflationResponse) / 2,
    economic_response_capability: stimulusReadiness,
    fiscal_monetary_alignment: coordination * 0.9 + 0.1
  };
}

function calculateFinancialHealthIndicators() {
  const budgetBalance = calculateBudgetBalance();
  const debtSustainability = calculateDebtSustainability();
  const liquidityPosition = Math.min(calculateLiquidityPosition() / 6, 1);
  const fiscalHealth = treasuryState.performance.fiscalHealthScore;
  
  return {
    overall_health_score: (Math.max(budgetBalance, 0) + debtSustainability + liquidityPosition + fiscalHealth) / 4,
    budget_balance: budgetBalance,
    debt_sustainability: debtSustainability,
    liquidity_adequacy: liquidityPosition,
    fiscal_performance: fiscalHealth,
    financial_stability_rating: calculateFinancialStability()
  };
}

function calculateReserveAdequacy() {
  const reserves = treasuryState.reserves.totalReserves;
  const monthlyExpenditure = Object.values(treasuryState.expenditures).reduce((sum, val) => sum + val, 0) / 12;
  const adequacyRatio = reserves / (monthlyExpenditure * 3); // 3 months target
  return Math.min(adequacyRatio, 1);
}

// Apply AI knobs to actual treasury game state
function applyTreasuryKnobsToGameState() {
  // Apply budget allocation efficiency
  const allocationEfficiency = treasuryKnobs.budget_allocation_efficiency;
  treasuryState.performance.spendingEfficiency = allocationEfficiency * 0.9 + 0.1;
  
  // Apply fiscal discipline to budget management
  const fiscalDiscipline = treasuryKnobs.fiscal_discipline_level;
  treasuryState.performance.budgetAccuracy = fiscalDiscipline * 0.8 + 0.2;
  
  // Apply revenue optimization to collection rates
  const revenueOptimization = treasuryKnobs.revenue_optimization_focus;
  const collectionEfficiency = treasuryKnobs.tax_collection_efficiency;
  treasuryState.revenue.revenueGrowthRate = Math.max(0, (revenueOptimization + collectionEfficiency) / 2 * 0.05);
  
  // Apply debt management to debt metrics
  const debtManagement = treasuryKnobs.debt_management_strategy;
  const borrowingOptimization = treasuryKnobs.borrowing_cost_optimization;
  treasuryState.debt.averageInterestRate = Math.max(0.01, 0.03 - (borrowingOptimization * 0.01));
  
  // Apply spending priorities to budget allocation
  const infraPriority = treasuryKnobs.infrastructure_spending_priority;
  const socialPriority = treasuryKnobs.social_program_funding;
  const defensePriority = treasuryKnobs.defense_budget_allocation;
  const educationPriority = treasuryKnobs.education_funding_priority;
  const healthcarePriority = treasuryKnobs.healthcare_budget_allocation;
  const rdPriority = treasuryKnobs.research_development_funding;
  
  // Normalize priorities and apply to budget
  const totalPriority = infraPriority + socialPriority + defensePriority + educationPriority + healthcarePriority + rdPriority;
  const baseBudget = treasuryState.budget.totalBudget * 0.8; // 80% for main categories
  
  treasuryState.expenditures.infrastructure = baseBudget * (infraPriority / totalPriority);
  treasuryState.expenditures.socialPrograms = baseBudget * (socialPriority / totalPriority);
  treasuryState.expenditures.defense = baseBudget * (defensePriority / totalPriority);
  treasuryState.expenditures.education = baseBudget * (educationPriority / totalPriority);
  treasuryState.expenditures.healthcare = baseBudget * (healthcarePriority / totalPriority);
  treasuryState.expenditures.researchDevelopment = baseBudget * (rdPriority / totalPriority);
  
  // Update budget utilization
  const totalAllocated = Object.values(treasuryState.expenditures).reduce((sum, val) => sum + val, 0);
  treasuryState.budget.allocatedBudget = totalAllocated;
  treasuryState.budget.remainingBudget = treasuryState.budget.totalBudget - totalAllocated;
  treasuryState.budget.budgetUtilization = totalAllocated / treasuryState.budget.totalBudget;
  
  // Apply emergency fund allocation
  const emergencyAllocation = treasuryKnobs.emergency_fund_allocation;
  treasuryState.reserves.emergencyFund = treasuryState.budget.totalBudget * emergencyAllocation * 0.1;
  
  // Update fiscal health score
  const budgetBalance = calculateBudgetBalance();
  const debtSustainability = calculateDebtSustainability();
  const transparency = treasuryKnobs.budget_transparency_level;
  treasuryState.performance.fiscalHealthScore = (Math.max(budgetBalance, 0) + debtSustainability + transparency + fiscalDiscipline) / 4;
  
  console.log('🎛️ Treasury knobs applied to game state:', {
    budget_allocation_efficiency: treasuryKnobs.budget_allocation_efficiency,
    fiscal_discipline: treasuryKnobs.fiscal_discipline_level,
    revenue_optimization: treasuryKnobs.revenue_optimization_focus,
    debt_management: treasuryKnobs.debt_management_strategy,
    spending_efficiency: treasuryState.performance.spendingEfficiency,
    fiscal_health: treasuryState.performance.fiscalHealthScore
  });
}

// ===== AI INTEGRATION ENDPOINTS =====

// Enhanced AI knob endpoints with multi-format input support
router.get('/knobs', (req, res) => {
  const knobData = treasuryKnobSystem.getKnobsWithMetadata();
  res.json({
    ...knobData,
    system: 'treasury',
    description: 'AI-adjustable parameters for treasury system with enhanced input support',
    input_help: treasuryKnobSystem.getKnobDescriptions()
  });
});

router.post('/knobs', (req, res) => {
  const { knobs, source = 'ai' } = req.body;
  
  if (!knobs || typeof knobs !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid knobs data. Expected object with knob values.',
      help: treasuryKnobSystem.getKnobDescriptions().examples
    });
  }
  
  // Update knobs using enhanced system
  const updateResult = treasuryKnobSystem.updateKnobs(knobs, source);
  
  // Apply knobs to game state
  try {
    applyTreasuryKnobsToGameState();
  } catch (error) {
    console.error('Error applying treasury knobs to game state:', error);
  }
  
  res.json({
    success: updateResult.success,
    system: 'treasury',
    ...updateResult,
    message: 'Treasury knobs updated successfully using enhanced input processing'
  });
});

// Get knob help/documentation
router.get('/knobs/help', (req, res) => {
  res.json({
    system: 'treasury',
    help: treasuryKnobSystem.getKnobDescriptions(),
    current_values: treasuryKnobSystem.getKnobsWithMetadata()
  });
});

// Get structured outputs for AI consumption
router.get('/ai-data', (req, res) => {
  const structuredData = generateTreasuryStructuredOutputs();
  res.json({
    ...structuredData,
    description: 'Structured treasury data for AI analysis and decision-making'
  });
});

// Get cross-system integration data
router.get('/cross-system', (req, res) => {
  const outputs = generateTreasuryStructuredOutputs();
  res.json({
    budget_data: outputs.cross_system_data.budget_availability,
    spending_data: outputs.cross_system_data.spending_capacity,
    revenue_data: outputs.cross_system_data.revenue_projections,
    policy_data: outputs.cross_system_data.fiscal_policy_impact,
    coordination_data: outputs.cross_system_data.economic_coordination_data,
    health_data: outputs.cross_system_data.financial_health_indicators,
    treasury_summary: outputs.treasury_metrics,
    timestamp: outputs.timestamp
  });
});

module.exports = router;
