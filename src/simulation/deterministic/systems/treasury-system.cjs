// Treasury System - Government financial management, fiscal policy, and budget operations
// Provides comprehensive treasury capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class TreasurySystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('treasury-system', config);
        
        // System state
        this.state = {
            // Government Finances
            governmentBudget: {
                total_revenue: 500000000000, // $500B
                total_expenditure: 520000000000, // $520B
                budget_deficit: 20000000000, // $20B deficit
                debt_to_gdp_ratio: 0.65,
                fiscal_balance: -0.02 // -2% of GDP
            },
            
            // Revenue Sources
            revenueStreams: {
                income_tax: {
                    amount: 200000000000,
                    percentage: 0.4,
                    efficiency: 0.85,
                    compliance_rate: 0.92
                },
                corporate_tax: {
                    amount: 100000000000,
                    percentage: 0.2,
                    efficiency: 0.8,
                    compliance_rate: 0.88
                },
                sales_tax: {
                    amount: 80000000000,
                    percentage: 0.16,
                    efficiency: 0.9,
                    compliance_rate: 0.95
                },
                property_tax: {
                    amount: 60000000000,
                    percentage: 0.12,
                    efficiency: 0.85,
                    compliance_rate: 0.9
                },
                customs_duties: {
                    amount: 30000000000,
                    percentage: 0.06,
                    efficiency: 0.75,
                    compliance_rate: 0.85
                },
                other_revenue: {
                    amount: 30000000000,
                    percentage: 0.06,
                    efficiency: 0.7,
                    compliance_rate: 0.8
                }
            },
            
            // Expenditure Categories
            expenditureCategories: {
                defense: {
                    amount: 100000000000,
                    percentage: 0.192,
                    efficiency: 0.75,
                    priority: 'high'
                },
                healthcare: {
                    amount: 90000000000,
                    percentage: 0.173,
                    efficiency: 0.7,
                    priority: 'high'
                },
                education: {
                    amount: 80000000000,
                    percentage: 0.154,
                    efficiency: 0.8,
                    priority: 'high'
                },
                social_security: {
                    amount: 85000000000,
                    percentage: 0.163,
                    efficiency: 0.85,
                    priority: 'high'
                },
                infrastructure: {
                    amount: 60000000000,
                    percentage: 0.115,
                    efficiency: 0.65,
                    priority: 'medium'
                },
                debt_service: {
                    amount: 45000000000,
                    percentage: 0.087,
                    efficiency: 1.0,
                    priority: 'mandatory'
                },
                administration: {
                    amount: 35000000000,
                    percentage: 0.067,
                    efficiency: 0.6,
                    priority: 'medium'
                },
                other_spending: {
                    amount: 25000000000,
                    percentage: 0.048,
                    efficiency: 0.55,
                    priority: 'low'
                }
            },
            
            // Debt Management
            publicDebt: {
                total_debt: 650000000000, // $650B
                domestic_debt: 450000000000,
                foreign_debt: 200000000000,
                average_interest_rate: 0.035,
                debt_maturity_profile: {
                    short_term: 0.2, // < 1 year
                    medium_term: 0.5, // 1-10 years
                    long_term: 0.3 // > 10 years
                }
            },
            
            // Cash Management
            cashManagement: {
                treasury_balance: 25000000000,
                daily_cash_flow: 500000000,
                cash_reserves: 15000000000,
                liquidity_ratio: 0.8,
                cash_forecast_accuracy: 0.9
            },
            
            // Tax Administration
            taxAdministration: {
                collection_efficiency: 0.88,
                audit_coverage: 0.05,
                dispute_resolution_time: 180, // days
                digital_services_adoption: 0.7,
                taxpayer_satisfaction: 0.65
            },
            
            // Fiscal Policy Tools
            fiscalPolicyTools: {
                tax_multiplier: 1.2,
                spending_multiplier: 1.5,
                automatic_stabilizers: 0.3,
                discretionary_fiscal_space: 0.15
            },
            
            // Financial Markets Interface
            marketInterface: {
                bond_yields: {
                    short_term: 0.025,
                    medium_term: 0.035,
                    long_term: 0.045
                },
                credit_rating: 'AA',
                market_confidence: 0.75,
                borrowing_costs: 0.035
            },
            
            // Performance Metrics
            performanceMetrics: {
                budget_execution_rate: 0.95,
                revenue_forecast_accuracy: 0.92,
                expenditure_control: 0.88,
                debt_sustainability_index: 0.7,
                fiscal_transparency_score: 0.8
            },
            
            // Risk Management
            fiscalRisks: {
                contingent_liabilities: 50000000000,
                economic_shock_exposure: 0.4,
                demographic_pressure: 0.3,
                climate_change_costs: 20000000000
            },
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('fiscal_policy_stance', 'float', 0.0, 
            'Fiscal policy stance: -1 (contractionary) to +1 (expansionary)', -1.0, 1.0);
        
        this.addInputKnob('tax_policy_efficiency', 'float', 0.8, 
            'Tax collection efficiency and compliance improvement', 0.5, 1.0);
        
        this.addInputKnob('spending_prioritization', 'object', {
            defense: 0.192, healthcare: 0.173, education: 0.154, social_security: 0.163,
            infrastructure: 0.115, administration: 0.067, other: 0.136
        }, 'Budget allocation across spending categories');
        
        this.addInputKnob('debt_management_strategy', 'string', 'balanced', 
            'Debt management approach: conservative, balanced, aggressive');
        
        this.addInputKnob('revenue_optimization_level', 'float', 0.6, 
            'Level of revenue optimization and tax policy reforms', 0.0, 1.0);
        
        this.addInputKnob('expenditure_efficiency_target', 'float', 0.75, 
            'Target efficiency for government spending', 0.5, 0.95);
        
        this.addInputKnob('fiscal_transparency_level', 'float', 0.8, 
            'Level of fiscal transparency and public reporting', 0.0, 1.0);
        
        this.addInputKnob('cash_management_optimization', 'float', 0.7, 
            'Optimization of government cash management', 0.0, 1.0);
        
        this.addInputKnob('digital_transformation_pace', 'float', 0.6, 
            'Pace of digital transformation in treasury operations', 0.0, 1.0);
        
        this.addInputKnob('contingency_reserve_level', 'float', 0.05, 
            'Contingency reserves as percentage of budget', 0.0, 0.15);
        
        this.addInputKnob('infrastructure_investment_boost', 'float', 0.0, 
            'Additional infrastructure investment as stimulus', 0.0, 0.5);
        
        this.addInputKnob('social_spending_adjustment', 'float', 0.0, 
            'Adjustment to social spending levels', -0.3, 0.3);
        
        // Define structured output channels
        this.addOutputChannel('fiscal_position', 'object', 
            'Current fiscal position and budget status');
        
        this.addOutputChannel('revenue_performance', 'object', 
            'Tax collection and revenue generation performance');
        
        this.addOutputChannel('expenditure_analysis', 'object', 
            'Government spending analysis and efficiency metrics');
        
        this.addOutputChannel('debt_status', 'object', 
            'Public debt position and sustainability metrics');
        
        this.addOutputChannel('cash_position', 'object', 
            'Treasury cash management and liquidity status');
        
        this.addOutputChannel('fiscal_policy_impact', 'object', 
            'Economic impact of current fiscal policy measures');
        
        this.addOutputChannel('market_indicators', 'object', 
            'Financial market indicators and government borrowing costs');
        
        this.addOutputChannel('fiscal_forecast', 'object', 
            'Budget projections and fiscal sustainability outlook');
        
        console.log('💰 Treasury System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update fiscal policy based on AI inputs
            this.updateFiscalPolicy(aiInputs);
            
            // Process revenue collection
            this.processRevenueCollection(gameState, aiInputs);
            
            // Update expenditure allocation
            this.updateExpenditureAllocation(aiInputs);
            
            // Manage public debt
            this.managePublicDebt(gameState, aiInputs);
            
            // Update cash management
            this.updateCashManagement(aiInputs);
            
            // Process tax administration improvements
            this.processTaxAdministration(aiInputs);
            
            // Update market interface
            this.updateMarketInterface(gameState);
            
            // Calculate performance metrics
            this.calculatePerformanceMetrics();
            
            // Assess fiscal risks
            this.assessFiscalRisks(gameState);
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('💰 Treasury System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateFiscalPolicy(aiInputs) {
        const policyStance = aiInputs.fiscal_policy_stance || 0.0;
        const infrastructureBoost = aiInputs.infrastructure_investment_boost || 0.0;
        const socialAdjustment = aiInputs.social_spending_adjustment || 0.0;
        
        // Apply fiscal policy stance to spending
        const stanceMultiplier = 1 + (policyStance * 0.1);
        
        // Update total expenditure based on policy stance
        const baseExpenditure = 520000000000;
        this.state.governmentBudget.total_expenditure = baseExpenditure * stanceMultiplier;
        
        // Apply infrastructure boost
        if (infrastructureBoost > 0) {
            const infrastructureIncrease = this.state.governmentBudget.total_expenditure * infrastructureBoost;
            this.state.expenditureCategories.infrastructure.amount += infrastructureIncrease;
            this.state.governmentBudget.total_expenditure += infrastructureIncrease;
        }
        
        // Apply social spending adjustment
        if (socialAdjustment !== 0) {
            const socialIncrease = this.state.expenditureCategories.social_security.amount * socialAdjustment;
            this.state.expenditureCategories.social_security.amount += socialIncrease;
            this.state.governmentBudget.total_expenditure += socialIncrease;
        }
        
        // Update fiscal balance
        this.updateFiscalBalance();
    }

    updateFiscalBalance() {
        const revenue = this.state.governmentBudget.total_revenue;
        const expenditure = this.state.governmentBudget.total_expenditure;
        
        this.state.governmentBudget.budget_deficit = expenditure - revenue;
        
        // Assume GDP of $1T for fiscal balance calculation
        const gdp = 1000000000000;
        this.state.governmentBudget.fiscal_balance = (revenue - expenditure) / gdp;
    }

    processRevenueCollection(gameState, aiInputs) {
        const taxEfficiency = aiInputs.tax_policy_efficiency || 0.8;
        const revenueOptimization = aiInputs.revenue_optimization_level || 0.6;
        
        let totalRevenue = 0;
        
        // Update each revenue stream
        Object.entries(this.state.revenueStreams).forEach(([streamName, stream]) => {
            // Apply efficiency improvements
            stream.efficiency = Math.min(0.95, stream.efficiency + (taxEfficiency - 0.8) * 0.1);
            
            // Apply revenue optimization
            if (revenueOptimization > 0.7) {
                stream.compliance_rate = Math.min(0.98, stream.compliance_rate + 0.02);
            }
            
            // Calculate actual revenue
            const baseAmount = stream.amount;
            const efficiencyFactor = stream.efficiency * stream.compliance_rate;
            stream.actual_amount = baseAmount * efficiencyFactor;
            
            totalRevenue += stream.actual_amount;
        });
        
        // Apply economic conditions from game state
        if (gameState.economicIndicators) {
            const gdpGrowth = gameState.economicIndicators.gdp_growth || 0.02;
            const unemploymentRate = gameState.economicIndicators.unemployment || 0.05;
            
            // GDP growth affects tax revenue
            const growthMultiplier = 1 + gdpGrowth;
            totalRevenue *= growthMultiplier;
            
            // Unemployment affects income tax
            const unemploymentImpact = 1 - (unemploymentRate * 0.5);
            this.state.revenueStreams.income_tax.actual_amount *= unemploymentImpact;
        }
        
        this.state.governmentBudget.total_revenue = totalRevenue;
        this.updateFiscalBalance();
    }

    updateExpenditureAllocation(aiInputs) {
        const spendingPriorities = aiInputs.spending_prioritization || {};
        const efficiencyTarget = aiInputs.expenditure_efficiency_target || 0.75;
        
        // Update spending allocation if provided
        if (Object.keys(spendingPriorities).length > 0) {
            this.reallocateSpending(spendingPriorities);
        }
        
        // Update efficiency for all categories
        Object.values(this.state.expenditureCategories).forEach(category => {
            // Gradually move toward efficiency target
            const efficiencyGap = efficiencyTarget - category.efficiency;
            category.efficiency += efficiencyGap * 0.1; // 10% improvement per period
            
            // Calculate effective spending
            category.effective_amount = category.amount * category.efficiency;
        });
    }

    reallocateSpending(priorities) {
        const totalBudget = this.state.governmentBudget.total_expenditure;
        
        // Normalize priorities
        const totalPriority = Object.values(priorities).reduce((sum, val) => sum + val, 0);
        
        if (totalPriority > 0) {
            Object.entries(priorities).forEach(([category, priority]) => {
                if (this.state.expenditureCategories[category]) {
                    const normalizedPriority = priority / totalPriority;
                    this.state.expenditureCategories[category].amount = totalBudget * normalizedPriority;
                    this.state.expenditureCategories[category].percentage = normalizedPriority;
                }
            });
        }
    }

    managePublicDebt(gameState, aiInputs) {
        const debtStrategy = aiInputs.debt_management_strategy || 'balanced';
        
        // Update debt based on fiscal balance
        const annualDeficit = this.state.governmentBudget.budget_deficit;
        if (annualDeficit > 0) {
            this.state.publicDebt.total_debt += annualDeficit;
        }
        
        // Apply debt management strategy
        this.applyDebtStrategy(debtStrategy);
        
        // Update debt-to-GDP ratio
        const gdp = 1000000000000; // $1T baseline
        this.state.governmentBudget.debt_to_gdp_ratio = this.state.publicDebt.total_debt / gdp;
        
        // Update interest costs
        this.updateInterestCosts();
        
        // Assess debt sustainability
        this.assessDebtSustainability(gameState);
    }

    applyDebtStrategy(strategy) {
        const debt = this.state.publicDebt;
        
        switch (strategy) {
            case 'conservative':
                // Focus on reducing debt, higher domestic share
                debt.domestic_debt = debt.total_debt * 0.8;
                debt.foreign_debt = debt.total_debt * 0.2;
                debt.average_interest_rate = Math.max(0.025, debt.average_interest_rate - 0.005);
                break;
                
            case 'aggressive':
                // Accept higher debt for growth, more foreign borrowing
                debt.domestic_debt = debt.total_debt * 0.6;
                debt.foreign_debt = debt.total_debt * 0.4;
                debt.average_interest_rate = Math.min(0.05, debt.average_interest_rate + 0.005);
                break;
                
            case 'balanced':
            default:
                // Maintain current structure
                debt.domestic_debt = debt.total_debt * 0.7;
                debt.foreign_debt = debt.total_debt * 0.3;
                break;
        }
    }

    updateInterestCosts() {
        const totalDebt = this.state.publicDebt.total_debt;
        const avgRate = this.state.publicDebt.average_interest_rate;
        
        const annualInterestCost = totalDebt * avgRate;
        this.state.expenditureCategories.debt_service.amount = annualInterestCost;
        
        // Update debt service percentage
        const totalExpenditure = this.state.governmentBudget.total_expenditure;
        this.state.expenditureCategories.debt_service.percentage = annualInterestCost / totalExpenditure;
    }

    assessDebtSustainability(gameState) {
        const debtToGDP = this.state.governmentBudget.debt_to_gdp_ratio;
        const fiscalBalance = this.state.governmentBudget.fiscal_balance;
        
        // Simple debt sustainability calculation
        let sustainabilityIndex = 1.0;
        
        // Debt level impact
        if (debtToGDP > 0.9) sustainabilityIndex -= 0.3;
        else if (debtToGDP > 0.7) sustainabilityIndex -= 0.2;
        else if (debtToGDP > 0.5) sustainabilityIndex -= 0.1;
        
        // Fiscal balance impact
        if (fiscalBalance < -0.05) sustainabilityIndex -= 0.2; // Deficit > 5% GDP
        else if (fiscalBalance < -0.03) sustainabilityIndex -= 0.1; // Deficit > 3% GDP
        
        // Economic growth impact
        if (gameState.economicIndicators) {
            const gdpGrowth = gameState.economicIndicators.gdp_growth || 0.02;
            if (gdpGrowth < 0) sustainabilityIndex -= 0.2; // Recession
            else if (gdpGrowth > 0.04) sustainabilityIndex += 0.1; // Strong growth
        }
        
        this.state.performanceMetrics.debt_sustainability_index = Math.max(0, Math.min(1, sustainabilityIndex));
    }

    updateCashManagement(aiInputs) {
        const cashOptimization = aiInputs.cash_management_optimization || 0.7;
        const contingencyLevel = aiInputs.contingency_reserve_level || 0.05;
        
        const cash = this.state.cashManagement;
        
        // Update liquidity ratio based on optimization
        cash.liquidity_ratio = Math.min(0.95, 0.6 + cashOptimization * 0.3);
        
        // Update cash reserves based on contingency level
        const totalBudget = this.state.governmentBudget.total_expenditure;
        cash.cash_reserves = totalBudget * contingencyLevel;
        
        // Update treasury balance
        const dailyCashFlow = this.state.governmentBudget.total_revenue / 365;
        cash.daily_cash_flow = dailyCashFlow;
        cash.treasury_balance = Math.max(cash.cash_reserves, dailyCashFlow * 30); // 30 days minimum
        
        // Improve forecast accuracy with optimization
        cash.cash_forecast_accuracy = Math.min(0.98, 0.8 + cashOptimization * 0.15);
    }

    processTaxAdministration(aiInputs) {
        const digitalPace = aiInputs.digital_transformation_pace || 0.6;
        const transparencyLevel = aiInputs.fiscal_transparency_level || 0.8;
        
        const taxAdmin = this.state.taxAdministration;
        
        // Digital transformation improves efficiency
        taxAdmin.digital_services_adoption = Math.min(0.95, 
            taxAdmin.digital_services_adoption + digitalPace * 0.05);
        
        // Improved digital services increase taxpayer satisfaction
        taxAdmin.taxpayer_satisfaction = Math.min(0.9, 
            0.5 + taxAdmin.digital_services_adoption * 0.4);
        
        // Digital transformation improves collection efficiency
        taxAdmin.collection_efficiency = Math.min(0.95, 
            taxAdmin.collection_efficiency + digitalPace * 0.02);
        
        // Transparency affects compliance
        if (transparencyLevel > 0.8) {
            Object.values(this.state.revenueStreams).forEach(stream => {
                stream.compliance_rate = Math.min(0.98, stream.compliance_rate + 0.01);
            });
        }
        
        // Update audit coverage based on digital capabilities
        taxAdmin.audit_coverage = Math.min(0.1, 0.03 + taxAdmin.digital_services_adoption * 0.05);
        
        // Reduce dispute resolution time with digital systems
        taxAdmin.dispute_resolution_time = Math.max(60, 
            240 - taxAdmin.digital_services_adoption * 120);
    }

    updateMarketInterface(gameState) {
        const marketInterface = this.state.marketInterface;
        
        // Update bond yields based on fiscal position
        const debtToGDP = this.state.governmentBudget.debt_to_gdp_ratio;
        const fiscalBalance = this.state.governmentBudget.fiscal_balance;
        
        // Base yields
        let shortTermYield = 0.025;
        let mediumTermYield = 0.035;
        let longTermYield = 0.045;
        
        // Debt level impact on yields
        const debtPremium = Math.max(0, (debtToGDP - 0.6) * 0.1); // Premium above 60% debt-to-GDP
        
        // Fiscal balance impact
        const deficitPremium = Math.max(0, -fiscalBalance * 0.5); // Premium for deficits
        
        // Apply premiums
        shortTermYield += debtPremium + deficitPremium;
        mediumTermYield += debtPremium + deficitPremium;
        longTermYield += debtPremium + deficitPremium;
        
        marketInterface.bond_yields.short_term = shortTermYield;
        marketInterface.bond_yields.medium_term = mediumTermYield;
        marketInterface.bond_yields.long_term = longTermYield;
        
        // Update average borrowing cost
        marketInterface.borrowing_costs = (shortTermYield + mediumTermYield + longTermYield) / 3;
        this.state.publicDebt.average_interest_rate = marketInterface.borrowing_costs;
        
        // Update market confidence
        let confidence = 0.8; // Base confidence
        
        if (debtToGDP > 0.8) confidence -= 0.2;
        else if (debtToGDP < 0.5) confidence += 0.1;
        
        if (fiscalBalance < -0.05) confidence -= 0.15;
        else if (fiscalBalance > 0) confidence += 0.1;
        
        marketInterface.market_confidence = Math.max(0.3, Math.min(1.0, confidence));
        
        // Update credit rating
        marketInterface.credit_rating = this.calculateCreditRating();
    }

    calculateCreditRating() {
        const debtToGDP = this.state.governmentBudget.debt_to_gdp_ratio;
        const fiscalBalance = this.state.governmentBudget.fiscal_balance;
        const sustainabilityIndex = this.state.performanceMetrics.debt_sustainability_index;
        
        let score = 100; // Start with perfect score
        
        // Debt level impact
        if (debtToGDP > 0.9) score -= 30;
        else if (debtToGDP > 0.7) score -= 20;
        else if (debtToGDP > 0.5) score -= 10;
        
        // Fiscal balance impact
        if (fiscalBalance < -0.05) score -= 25;
        else if (fiscalBalance < -0.03) score -= 15;
        else if (fiscalBalance > 0) score += 5;
        
        // Sustainability impact
        score += (sustainabilityIndex - 0.5) * 20;
        
        // Convert score to rating
        if (score >= 90) return 'AAA';
        if (score >= 80) return 'AA';
        if (score >= 70) return 'A';
        if (score >= 60) return 'BBB';
        if (score >= 50) return 'BB';
        if (score >= 40) return 'B';
        return 'CCC';
    }

    calculatePerformanceMetrics() {
        const metrics = this.state.performanceMetrics;
        
        // Budget execution rate
        const plannedExpenditure = 520000000000; // Original budget
        const actualExpenditure = this.state.governmentBudget.total_expenditure;
        metrics.budget_execution_rate = Math.min(1.0, actualExpenditure / plannedExpenditure);
        
        // Revenue forecast accuracy
        const plannedRevenue = 500000000000; // Original forecast
        const actualRevenue = this.state.governmentBudget.total_revenue;
        const forecastError = Math.abs(actualRevenue - plannedRevenue) / plannedRevenue;
        metrics.revenue_forecast_accuracy = Math.max(0.5, 1 - forecastError);
        
        // Expenditure control
        const avgEfficiency = Object.values(this.state.expenditureCategories)
            .reduce((sum, cat) => sum + cat.efficiency, 0) / 
            Object.keys(this.state.expenditureCategories).length;
        metrics.expenditure_control = avgEfficiency;
        
        // Fiscal transparency score
        const transparencyLevel = this.state.taxAdministration.digital_services_adoption;
        metrics.fiscal_transparency_score = Math.min(1.0, 0.6 + transparencyLevel * 0.3);
    }

    assessFiscalRisks(gameState) {
        const risks = this.state.fiscalRisks;
        
        // Update contingent liabilities based on economic conditions
        if (gameState.economicIndicators) {
            const gdpGrowth = gameState.economicIndicators.gdp_growth || 0.02;
            if (gdpGrowth < 0) {
                risks.contingent_liabilities *= 1.1; // Increase in recession
            }
        }
        
        // Economic shock exposure
        const debtToGDP = this.state.governmentBudget.debt_to_gdp_ratio;
        risks.economic_shock_exposure = Math.min(1.0, debtToGDP * 0.8);
        
        // Demographic pressure (aging population)
        risks.demographic_pressure = Math.min(1.0, 0.2 + 
            this.state.expenditureCategories.social_security.percentage);
        
        // Climate change costs
        if (gameState.environmentalMetrics) {
            const climateRisk = gameState.environmentalMetrics.climate_risk || 0.3;
            risks.climate_change_costs = 10000000000 + (climateRisk * 30000000000);
        }
    }

    generateOutputs() {
        return {
            fiscal_position: {
                total_revenue: this.state.governmentBudget.total_revenue,
                total_expenditure: this.state.governmentBudget.total_expenditure,
                budget_balance: -this.state.governmentBudget.budget_deficit,
                fiscal_balance_percent_gdp: this.state.governmentBudget.fiscal_balance,
                debt_to_gdp_ratio: this.state.governmentBudget.debt_to_gdp_ratio,
                fiscal_stance: this.categorizeFiscalStance(),
                sustainability_rating: this.assessSustainabilityRating()
            },
            
            revenue_performance: {
                revenue_streams: this.getRevenueStreamSummary(),
                total_revenue: this.state.governmentBudget.total_revenue,
                collection_efficiency: this.state.taxAdministration.collection_efficiency,
                compliance_rate: this.calculateOverallComplianceRate(),
                revenue_growth: this.calculateRevenueGrowth(),
                tax_burden: this.calculateTaxBurden()
            },
            
            expenditure_analysis: {
                spending_by_category: this.getSpendingByCategorySummary(),
                expenditure_efficiency: this.calculateOverallExpenditureEfficiency(),
                priority_alignment: this.assessPriorityAlignment(),
                spending_effectiveness: this.calculateSpendingEffectiveness()
            },
            
            debt_status: {
                total_debt: this.state.publicDebt.total_debt,
                debt_composition: this.getDebtComposition(),
                debt_to_gdp_ratio: this.state.governmentBudget.debt_to_gdp_ratio,
                average_interest_rate: this.state.publicDebt.average_interest_rate,
                debt_service_ratio: this.calculateDebtServiceRatio(),
                sustainability_index: this.state.performanceMetrics.debt_sustainability_index,
                maturity_profile: this.state.publicDebt.debt_maturity_profile
            },
            
            cash_position: {
                treasury_balance: this.state.cashManagement.treasury_balance,
                cash_reserves: this.state.cashManagement.cash_reserves,
                daily_cash_flow: this.state.cashManagement.daily_cash_flow,
                liquidity_ratio: this.state.cashManagement.liquidity_ratio,
                cash_forecast_accuracy: this.state.cashManagement.cash_forecast_accuracy,
                liquidity_status: this.assessLiquidityStatus()
            },
            
            fiscal_policy_impact: {
                fiscal_multiplier_effect: this.calculateFiscalMultiplierEffect(),
                economic_stimulus_impact: this.calculateStimulusImpact(),
                automatic_stabilizer_effect: this.state.fiscalPolicyTools.automatic_stabilizers,
                discretionary_fiscal_space: this.state.fiscalPolicyTools.discretionary_fiscal_space,
                policy_effectiveness: this.assessPolicyEffectiveness()
            },
            
            market_indicators: {
                bond_yields: this.state.marketInterface.bond_yields,
                credit_rating: this.state.marketInterface.credit_rating,
                market_confidence: this.state.marketInterface.market_confidence,
                borrowing_costs: this.state.marketInterface.borrowing_costs,
                risk_premium: this.calculateRiskPremium(),
                market_access: this.assessMarketAccess()
            },
            
            fiscal_forecast: {
                projected_deficit: this.projectDeficit(),
                debt_trajectory: this.projectDebtTrajectory(),
                revenue_projections: this.projectRevenue(),
                expenditure_projections: this.projectExpenditure(),
                fiscal_risks: this.state.fiscalRisks,
                policy_recommendations: this.generatePolicyRecommendations()
            }
        };
    }

    categorizeFiscalStance() {
        const fiscalBalance = this.state.governmentBudget.fiscal_balance;
        
        if (fiscalBalance > 0.01) return 'contractionary';
        if (fiscalBalance < -0.03) return 'expansionary';
        return 'neutral';
    }

    assessSustainabilityRating() {
        const index = this.state.performanceMetrics.debt_sustainability_index;
        
        if (index > 0.8) return 'sustainable';
        if (index > 0.6) return 'manageable';
        if (index > 0.4) return 'concerning';
        return 'unsustainable';
    }

    getRevenueStreamSummary() {
        const summary = {};
        
        Object.entries(this.state.revenueStreams).forEach(([stream, data]) => {
            summary[stream] = {
                amount: data.actual_amount || data.amount,
                percentage: data.percentage,
                efficiency: data.efficiency,
                compliance_rate: data.compliance_rate
            };
        });
        
        return summary;
    }

    calculateOverallComplianceRate() {
        const streams = Object.values(this.state.revenueStreams);
        const weightedCompliance = streams.reduce((sum, stream) => 
            sum + (stream.compliance_rate * stream.percentage), 0);
        
        return weightedCompliance;
    }

    calculateRevenueGrowth() {
        // Simplified calculation - would use historical data in real implementation
        const currentRevenue = this.state.governmentBudget.total_revenue;
        const baselineRevenue = 500000000000;
        
        return (currentRevenue - baselineRevenue) / baselineRevenue;
    }

    calculateTaxBurden() {
        const gdp = 1000000000000; // $1T baseline
        return this.state.governmentBudget.total_revenue / gdp;
    }

    getSpendingByCategorySummary() {
        const summary = {};
        
        Object.entries(this.state.expenditureCategories).forEach(([category, data]) => {
            summary[category] = {
                amount: data.amount,
                percentage: data.percentage,
                efficiency: data.efficiency,
                effective_amount: data.effective_amount || data.amount * data.efficiency,
                priority: data.priority
            };
        });
        
        return summary;
    }

    calculateOverallExpenditureEfficiency() {
        const categories = Object.values(this.state.expenditureCategories);
        const weightedEfficiency = categories.reduce((sum, cat) => 
            sum + (cat.efficiency * cat.percentage), 0);
        
        return weightedEfficiency;
    }

    assessPriorityAlignment() {
        const highPrioritySpending = Object.values(this.state.expenditureCategories)
            .filter(cat => cat.priority === 'high')
            .reduce((sum, cat) => sum + cat.percentage, 0);
        
        return {
            high_priority_percentage: highPrioritySpending,
            alignment_score: Math.min(1.0, highPrioritySpending / 0.6) // Target 60% for high priority
        };
    }

    calculateSpendingEffectiveness() {
        const totalEffectiveSpending = Object.values(this.state.expenditureCategories)
            .reduce((sum, cat) => sum + (cat.amount * cat.efficiency), 0);
        
        return totalEffectiveSpending / this.state.governmentBudget.total_expenditure;
    }

    getDebtComposition() {
        const debt = this.state.publicDebt;
        
        return {
            domestic_debt: debt.domestic_debt,
            foreign_debt: debt.foreign_debt,
            domestic_percentage: (debt.domestic_debt / debt.total_debt * 100).toFixed(1),
            foreign_percentage: (debt.foreign_debt / debt.total_debt * 100).toFixed(1)
        };
    }

    calculateDebtServiceRatio() {
        const debtService = this.state.expenditureCategories.debt_service.amount;
        const totalRevenue = this.state.governmentBudget.total_revenue;
        
        return debtService / totalRevenue;
    }

    assessLiquidityStatus() {
        const ratio = this.state.cashManagement.liquidity_ratio;
        
        if (ratio > 0.8) return 'strong';
        if (ratio > 0.6) return 'adequate';
        if (ratio > 0.4) return 'tight';
        return 'critical';
    }

    calculateFiscalMultiplierEffect() {
        const taxMultiplier = this.state.fiscalPolicyTools.tax_multiplier;
        const spendingMultiplier = this.state.fiscalPolicyTools.spending_multiplier;
        
        return {
            tax_multiplier: taxMultiplier,
            spending_multiplier: spendingMultiplier,
            net_effect: (spendingMultiplier + taxMultiplier) / 2
        };
    }

    calculateStimulusImpact() {
        const fiscalBalance = this.state.governmentBudget.fiscal_balance;
        const spendingMultiplier = this.state.fiscalPolicyTools.spending_multiplier;
        
        // Stimulus impact as percentage of GDP
        return Math.abs(fiscalBalance) * spendingMultiplier;
    }

    assessPolicyEffectiveness() {
        const executionRate = this.state.performanceMetrics.budget_execution_rate;
        const efficiency = this.calculateOverallExpenditureEfficiency();
        const transparency = this.state.performanceMetrics.fiscal_transparency_score;
        
        return (executionRate + efficiency + transparency) / 3;
    }

    calculateRiskPremium() {
        const baseYield = 0.025; // Risk-free rate
        const actualYield = this.state.marketInterface.borrowing_costs;
        
        return actualYield - baseYield;
    }

    assessMarketAccess() {
        const confidence = this.state.marketInterface.market_confidence;
        const creditRating = this.state.marketInterface.credit_rating;
        
        let accessScore = confidence;
        
        // Credit rating impact
        const ratingScores = {
            'AAA': 1.0, 'AA': 0.9, 'A': 0.8, 'BBB': 0.7,
            'BB': 0.6, 'B': 0.5, 'CCC': 0.4
        };
        
        accessScore = (accessScore + (ratingScores[creditRating] || 0.4)) / 2;
        
        if (accessScore > 0.8) return 'excellent';
        if (accessScore > 0.6) return 'good';
        if (accessScore > 0.4) return 'limited';
        return 'restricted';
    }

    projectDeficit() {
        const currentDeficit = this.state.governmentBudget.budget_deficit;
        const debtServiceGrowth = this.state.publicDebt.average_interest_rate;
        
        // Simple projection assuming debt service grows with interest rates
        return {
            next_year: currentDeficit * (1 + debtServiceGrowth),
            three_year: currentDeficit * Math.pow(1 + debtServiceGrowth, 3),
            five_year: currentDeficit * Math.pow(1 + debtServiceGrowth, 5)
        };
    }

    projectDebtTrajectory() {
        const currentDebt = this.state.publicDebt.total_debt;
        const annualDeficit = this.state.governmentBudget.budget_deficit;
        
        return {
            next_year: currentDebt + annualDeficit,
            three_year: currentDebt + (annualDeficit * 3),
            five_year: currentDebt + (annualDeficit * 5),
            debt_to_gdp_projection: {
                next_year: (currentDebt + annualDeficit) / 1000000000000,
                three_year: (currentDebt + annualDeficit * 3) / 1000000000000,
                five_year: (currentDebt + annualDeficit * 5) / 1000000000000
            }
        };
    }

    projectRevenue() {
        const currentRevenue = this.state.governmentBudget.total_revenue;
        const growthRate = 0.03; // Assume 3% nominal growth
        
        return {
            next_year: currentRevenue * (1 + growthRate),
            three_year: currentRevenue * Math.pow(1 + growthRate, 3),
            five_year: currentRevenue * Math.pow(1 + growthRate, 5)
        };
    }

    projectExpenditure() {
        const currentExpenditure = this.state.governmentBudget.total_expenditure;
        const growthRate = 0.025; // Assume 2.5% growth
        
        return {
            next_year: currentExpenditure * (1 + growthRate),
            three_year: currentExpenditure * Math.pow(1 + growthRate, 3),
            five_year: currentExpenditure * Math.pow(1 + growthRate, 5)
        };
    }

    generatePolicyRecommendations() {
        const recommendations = [];
        
        // Debt sustainability
        if (this.state.performanceMetrics.debt_sustainability_index < 0.6) {
            recommendations.push('Implement fiscal consolidation measures to improve debt sustainability');
        }
        
        // Revenue efficiency
        if (this.state.taxAdministration.collection_efficiency < 0.85) {
            recommendations.push('Enhance tax administration and digital services to improve collection efficiency');
        }
        
        // Expenditure efficiency
        if (this.calculateOverallExpenditureEfficiency() < 0.75) {
            recommendations.push('Improve expenditure efficiency through better program management');
        }
        
        // Market confidence
        if (this.state.marketInterface.market_confidence < 0.7) {
            recommendations.push('Strengthen fiscal transparency and communication to improve market confidence');
        }
        
        return recommendations;
    }

    generateFallbackOutputs() {
        return {
            fiscal_position: {
                total_revenue: 500000000000,
                total_expenditure: 520000000000,
                budget_balance: -20000000000,
                fiscal_balance_percent_gdp: -0.02,
                debt_to_gdp_ratio: 0.65,
                fiscal_stance: 'neutral'
            },
            revenue_performance: {
                total_revenue: 500000000000,
                collection_efficiency: 0.85,
                compliance_rate: 0.9
            },
            expenditure_analysis: {
                expenditure_efficiency: 0.75,
                spending_effectiveness: 0.75
            },
            debt_status: {
                total_debt: 650000000000,
                debt_to_gdp_ratio: 0.65,
                sustainability_index: 0.7
            },
            cash_position: {
                treasury_balance: 25000000000,
                liquidity_status: 'adequate'
            },
            fiscal_policy_impact: {
                policy_effectiveness: 0.7
            },
            market_indicators: {
                credit_rating: 'AA',
                market_confidence: 0.75,
                borrowing_costs: 0.035
            },
            fiscal_forecast: {
                policy_recommendations: []
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            fiscalBalance: this.state.governmentBudget.fiscal_balance,
            debtToGDP: this.state.governmentBudget.debt_to_gdp_ratio,
            marketConfidence: this.state.marketInterface.market_confidence,
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.governmentBudget.budget_deficit = 20000000000;
        this.state.governmentBudget.debt_to_gdp_ratio = 0.65;
        this.state.marketInterface.market_confidence = 0.75;
        console.log('💰 Treasury System reset');
    }
}

module.exports = { TreasurySystem };
