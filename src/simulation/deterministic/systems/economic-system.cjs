// Economic System - Deterministic economic simulation with AI-adjustable parameters
// Comprehensive economic model with fiscal, monetary, and trade components

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class EconomicSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('economic-system', config);
        
        // Core economic state
        this.economicState = {
            // Macroeconomic indicators
            gdp: config.initialGDP || 2500000000000, // $2.5 trillion
            gdpGrowthRate: 0.025, // 2.5% annual
            inflation: 0.02, // 2% annual
            unemployment: 0.05, // 5%
            interestRate: 0.025, // 2.5%
            
            // Fiscal metrics
            governmentRevenue: 0, // Calculated
            governmentSpending: 0, // Calculated
            fiscalBalance: 0, // Revenue - Spending
            publicDebt: config.initialDebt || 1000000000000, // $1 trillion
            debtToGDP: 0.4, // 40%
            
            // Monetary metrics
            moneySupply: 0, // Calculated
            velocityOfMoney: 1.5,
            reserveRatio: 0.10, // 10%
            
            // Trade metrics
            exports: 0, // Calculated
            imports: 0, // Calculated
            tradeBalance: 0,
            currentAccount: 0,
            exchangeRate: 1.0, // Relative to baseline
            
            // Sectoral breakdown
            sectors: {
                agriculture: { share: 0.03, growth: 0.01 },
                manufacturing: { share: 0.22, growth: 0.02 },
                services: { share: 0.65, growth: 0.03 },
                technology: { share: 0.10, growth: 0.08 }
            },
            
            // Market conditions
            stockMarketIndex: 1000,
            marketVolatility: 0.15,
            consumerConfidence: 0.75,
            businessConfidence: 0.70,
            
            // Income and wealth
            medianIncome: 55000,
            incomeInequality: 0.35, // Gini coefficient
            wealthDistribution: {
                top1Percent: 0.32,
                top10Percent: 0.70,
                bottom50Percent: 0.02
            },
            
            lastUpdate: Date.now()
        };
        
        this.initializeInputKnobs();
        this.initializeOutputChannels();

        // Business cycle state (expansion, peak, contraction, trough)
        this.businessCycle = {
            phase: 'expansion', // expansion | peak | contraction | trough
            phaseDayCounter: 0,
            phaseLengthDays: 365, // default ~1 year per phase
            lastPhaseChange: Date.now()
        };
        
        // Start economic simulation (can be disabled in tests)
        if (config.autoStart !== false) {
            this.startSimulation();
        }
    }

    initializeInputKnobs() {
        // Fiscal Policy Knobs
        this.defineInputKnob('tax_rate', {
            name: 'Corporate Tax Rate',
            description: 'Corporate income tax rate as percentage',
            aiDescription: 'Adjust corporate taxes to balance revenue generation with business competitiveness',
            type: 'number',
            defaultValue: 25.0,
            constraints: { min: 10.0, max: 50.0 },
            category: 'fiscal',
            impact: 'high',
            expectedEffects: [
                'Higher rates increase government revenue but may reduce business investment',
                'Lower rates stimulate business growth but reduce fiscal capacity',
                'Affects international competitiveness and capital flows'
            ],
            updateFrequency: 'quarterly'
        });

        this.defineInputKnob('income_tax_rate', {
            name: 'Income Tax Rate',
            description: 'Personal income tax rate (average effective rate)',
            aiDescription: 'Balance government revenue with consumer spending power',
            type: 'number',
            defaultValue: 22.0,
            constraints: { min: 5.0, max: 45.0 },
            category: 'fiscal',
            impact: 'high',
            expectedEffects: [
                'Higher rates increase revenue but reduce consumer spending',
                'Lower rates boost consumption but may increase inequality',
                'Affects work incentives and economic growth'
            ],
            updateFrequency: 'quarterly'
        });

        this.defineInputKnob('government_spending_level', {
            name: 'Government Spending Level',
            description: 'Government spending as percentage of GDP',
            aiDescription: 'Control government expenditure to manage economic stimulus and fiscal balance',
            type: 'number',
            defaultValue: 35.0,
            constraints: { min: 15.0, max: 55.0 },
            category: 'fiscal',
            impact: 'critical',
            expectedEffects: [
                'Higher spending stimulates economy but increases debt',
                'Lower spending reduces fiscal burden but may slow growth',
                'Affects public services and infrastructure quality'
            ],
            updateFrequency: 'quarterly'
        });

        // Monetary Policy Knobs
        this.defineInputKnob('interest_rate_target', {
            name: 'Central Bank Interest Rate',
            description: 'Target interest rate set by central bank',
            aiDescription: 'Control monetary policy to manage inflation and economic growth',
            type: 'number',
            defaultValue: 2.5,
            constraints: { min: 0.0, max: 15.0 },
            category: 'monetary',
            impact: 'critical',
            expectedEffects: [
                'Higher rates reduce inflation but may slow growth',
                'Lower rates stimulate growth but may increase inflation',
                'Affects currency strength and capital flows'
            ],
            updateFrequency: 'realtime'
        });

        this.defineInputKnob('reserve_requirement', {
            name: 'Bank Reserve Requirement',
            description: 'Required reserves as percentage of deposits',
            aiDescription: 'Control money supply and banking system stability',
            type: 'number',
            defaultValue: 10.0,
            constraints: { min: 2.0, max: 25.0 },
            category: 'monetary',
            impact: 'medium',
            expectedEffects: [
                'Higher requirements reduce money supply and lending',
                'Lower requirements increase liquidity and credit',
                'Affects banking profitability and financial stability'
            ],
            updateFrequency: 'quarterly'
        });

        // Trade Policy Knobs
        this.defineInputKnob('trade_openness', {
            name: 'Trade Policy Openness',
            description: 'Overall openness to international trade (0=protectionist, 1=free trade)',
            aiDescription: 'Balance domestic industry protection with international competitiveness',
            type: 'number',
            defaultValue: 0.7,
            constraints: { min: 0.0, max: 1.0 },
            category: 'trade',
            impact: 'high',
            expectedEffects: [
                'Higher openness increases trade volume and efficiency',
                'Lower openness protects domestic industries but may reduce competitiveness',
                'Affects consumer prices and product variety'
            ],
            updateFrequency: 'quarterly'
        });

        this.defineInputKnob('export_promotion_spending', {
            name: 'Export Promotion Spending',
            description: 'Government spending on export promotion as % of GDP',
            aiDescription: 'Invest in export promotion to improve trade balance',
            type: 'number',
            defaultValue: 0.5,
            constraints: { min: 0.0, max: 3.0 },
            category: 'trade',
            impact: 'medium',
            expectedEffects: [
                'Higher spending improves export competitiveness',
                'Increases government expenditure',
                'May improve trade balance over time'
            ],
            updateFrequency: 'quarterly'
        });

        // Investment and Innovation Knobs
        this.defineInputKnob('rd_investment_incentives', {
            name: 'R&D Investment Incentives',
            description: 'Tax incentives and subsidies for R&D as % of GDP',
            aiDescription: 'Promote innovation and technological advancement',
            type: 'number',
            defaultValue: 1.2,
            constraints: { min: 0.0, max: 5.0 },
            category: 'innovation',
            impact: 'high',
            expectedEffects: [
                'Higher incentives boost innovation and productivity',
                'Increases government spending but may generate long-term returns',
                'Affects technological competitiveness'
            ],
            updateFrequency: 'quarterly'
        });

        this.defineInputKnob('infrastructure_investment', {
            name: 'Infrastructure Investment Level',
            description: 'Public infrastructure investment as % of GDP',
            aiDescription: 'Invest in infrastructure to boost productivity and economic capacity',
            type: 'number',
            defaultValue: 3.5,
            constraints: { min: 1.0, max: 8.0 },
            category: 'investment',
            impact: 'high',
            expectedEffects: [
                'Higher investment improves productivity and competitiveness',
                'Increases government spending and debt',
                'Creates jobs and stimulates economic activity'
            ],
            updateFrequency: 'quarterly'
        });

        // Regulatory Knobs
        this.defineInputKnob('business_regulation_level', {
            name: 'Business Regulation Level',
            description: 'Overall level of business regulation (0=minimal, 1=heavy)',
            aiDescription: 'Balance business freedom with consumer protection and stability',
            type: 'number',
            defaultValue: 0.5,
            constraints: { min: 0.0, max: 1.0 },
            category: 'regulation',
            impact: 'medium',
            expectedEffects: [
                'Higher regulation increases stability but may reduce innovation',
                'Lower regulation promotes business growth but may increase risks',
                'Affects business confidence and investment'
            ],
            updateFrequency: 'quarterly'
        });

        this.defineInputKnob('financial_regulation_strictness', {
            name: 'Financial Regulation Strictness',
            description: 'Strictness of financial sector regulation',
            aiDescription: 'Control financial system risk while maintaining credit availability',
            type: 'number',
            defaultValue: 0.6,
            constraints: { min: 0.2, max: 1.0 },
            category: 'regulation',
            impact: 'high',
            expectedEffects: [
                'Higher strictness reduces financial risks but may limit credit',
                'Lower strictness increases credit availability but raises systemic risk',
                'Affects banking profitability and stability'
            ],
            updateFrequency: 'quarterly'
        });

        // Labor Market Knobs
        this.defineInputKnob('minimum_wage_level', {
            name: 'Minimum Wage Level',
            description: 'Minimum wage as percentage of median wage',
            aiDescription: 'Balance worker welfare with employment opportunities',
            type: 'number',
            defaultValue: 45.0,
            constraints: { min: 20.0, max: 80.0 },
            category: 'labor',
            impact: 'medium',
            expectedEffects: [
                'Higher minimum wage improves worker welfare but may reduce employment',
                'Lower minimum wage may increase employment but worsen inequality',
                'Affects consumer spending and business costs'
            ],
            updateFrequency: 'yearly'
        });

        this.defineInputKnob('labor_market_flexibility', {
            name: 'Labor Market Flexibility',
            description: 'Flexibility of hiring/firing and work arrangements',
            aiDescription: 'Balance worker protection with business adaptability',
            type: 'number',
            defaultValue: 0.6,
            constraints: { min: 0.2, max: 1.0 },
            category: 'labor',
            impact: 'medium',
            expectedEffects: [
                'Higher flexibility improves business adaptability and employment',
                'Lower flexibility provides worker security but may reduce hiring',
                'Affects economic dynamism and innovation'
            ],
            updateFrequency: 'yearly'
        });
    }

    initializeOutputChannels() {
        // Core Economic Indicators
        this.defineOutputChannel('economic_indicators', {
            name: 'Core Economic Indicators',
            description: 'Key macroeconomic metrics and trends',
            aiInterpretation: 'Monitor overall economic health and identify policy needs',
            dataType: 'metric',
            category: 'macroeconomic',
            priority: 'critical',
            updateFrequency: 'daily',
            structure: {
                required: ['gdp', 'gdpGrowthRate', 'inflation', 'unemployment'],
                fields: {
                    gdp: { type: 'number' },
                    gdpGrowthRate: { type: 'number' },
                    inflation: { type: 'number' },
                    unemployment: { type: 'number' }
                }
            },
            significanceThresholds: {
                'gdpGrowthRate': { below: -0.01, above: 0.06 }, // Recession or overheating
                'inflation': { below: -0.005, above: 0.05 }, // Deflation or high inflation
                'unemployment': { above: 0.08 } // High unemployment
            },
            gameDisplayFormat: {
                gdp: 'currency_abbreviated',
                gdpGrowthRate: 'percentage_2dp',
                inflation: 'percentage_2dp',
                unemployment: 'percentage_1dp'
            }
        });

        // Business Cycle Output
        this.defineOutputChannel('business_cycle', {
            name: 'Business Cycle Phase',
            description: 'Current macroeconomic business cycle phase and timing',
            aiInterpretation: 'Use phase to modulate policies and expectations (expansion/peak/contraction/trough)',
            dataType: 'metric',
            category: 'macroeconomic',
            priority: 'high',
            updateFrequency: 'daily',
            structure: {
                required: ['phase', 'phaseDayCounter', 'phaseLengthDays'],
                fields: {
                    phase: { type: 'string' },
                    phaseDayCounter: { type: 'number' },
                    phaseLengthDays: { type: 'number' }
                }
            }
        });

        // Fiscal Status
        this.defineOutputChannel('fiscal_status', {
            name: 'Government Fiscal Status',
            description: 'Government revenue, spending, and debt metrics',
            aiInterpretation: 'Monitor fiscal sustainability and policy space',
            dataType: 'metric',
            category: 'fiscal',
            priority: 'high',
            updateFrequency: 'daily',
            structure: {
                required: ['revenue', 'spending', 'balance', 'debt', 'debtToGDP'],
                fields: {
                    revenue: { type: 'number' },
                    spending: { type: 'number' },
                    balance: { type: 'number' },
                    debt: { type: 'number' },
                    debtToGDP: { type: 'number' }
                }
            },
            significanceThresholds: {
                'debtToGDP': { above: 0.9 }, // High debt warning
                'balance': { below: -0.05 } // Large deficit warning
            }
        });

        // Monetary Conditions
        this.defineOutputChannel('monetary_conditions', {
            name: 'Monetary and Financial Conditions',
            description: 'Interest rates, money supply, and financial market conditions',
            aiInterpretation: 'Assess monetary policy effectiveness and financial stability',
            dataType: 'metric',
            category: 'monetary',
            priority: 'high',
            updateFrequency: 'daily',
            structure: {
                required: ['interestRate', 'moneySupply', 'stockMarketIndex', 'marketVolatility'],
                fields: {
                    interestRate: { type: 'number' },
                    moneySupply: { type: 'number' },
                    stockMarketIndex: { type: 'number' },
                    marketVolatility: { type: 'number' }
                }
            },
            significanceThresholds: {
                'marketVolatility': { above: 0.3 }, // High volatility warning
                'stockMarketIndex': { change: 0.1 } // 10% market movement
            }
        });

        // Trade and External Balance
        this.defineOutputChannel('trade_balance', {
            name: 'Trade and External Balance',
            description: 'Import/export data and external economic relationships',
            aiInterpretation: 'Monitor international competitiveness and external vulnerabilities',
            dataType: 'metric',
            category: 'trade',
            priority: 'medium',
            updateFrequency: 'daily',
            structure: {
                required: ['exports', 'imports', 'tradeBalance', 'currentAccount'],
                fields: {
                    exports: { type: 'number' },
                    imports: { type: 'number' },
                    tradeBalance: { type: 'number' },
                    currentAccount: { type: 'number' }
                }
            },
            significanceThresholds: {
                'currentAccount': { below: -0.05, above: 0.05 } // Large external imbalance
            }
        });

        // Sectoral Performance
        this.defineOutputChannel('sectoral_performance', {
            name: 'Economic Sector Performance',
            description: 'Performance metrics for different economic sectors',
            aiInterpretation: 'Identify sectoral strengths and weaknesses for targeted policies',
            dataType: 'metric',
            category: 'sectoral',
            priority: 'medium',
            updateFrequency: 'weekly',
            structure: {
                required: ['sectors'],
                fields: {
                    sectors: { type: 'object' }
                }
            }
        });

        // Income and Inequality
        this.defineOutputChannel('income_distribution', {
            name: 'Income and Wealth Distribution',
            description: 'Income levels, inequality, and wealth distribution metrics',
            aiInterpretation: 'Monitor social equity and economic inclusion',
            dataType: 'metric',
            category: 'social',
            priority: 'medium',
            updateFrequency: 'weekly',
            structure: {
                required: ['medianIncome', 'incomeInequality', 'wealthDistribution'],
                fields: {
                    medianIncome: { type: 'number' },
                    incomeInequality: { type: 'number' },
                    wealthDistribution: { type: 'object' }
                }
            },
            significanceThresholds: {
                'incomeInequality': { above: 0.5 } // High inequality warning
            }
        });

        // Economic Events
        this.defineOutputChannel('economic_events', {
            name: 'Significant Economic Events',
            description: 'Notable economic developments and milestones',
            aiInterpretation: 'React to significant economic changes and crises',
            dataType: 'event',
            category: 'events',
            priority: 'high',
            updateFrequency: 'realtime',
            structure: {
                required: ['eventType', 'description', 'severity', 'impact'],
                fields: {
                    eventType: { type: 'string' },
                    description: { type: 'string' },
                    severity: { type: 'string' },
                    impact: { type: 'object' }
                }
            }
        });

        // Economic Forecasts
        this.defineOutputChannel('economic_forecasts', {
            name: 'Economic Forecasts',
            description: 'Short and medium-term economic projections',
            aiInterpretation: 'Plan future policies based on economic projections',
            dataType: 'prediction',
            category: 'forecasting',
            priority: 'medium',
            updateFrequency: 'weekly',
            structure: {
                required: ['shortTerm', 'mediumTerm', 'confidence'],
                fields: {
                    shortTerm: { type: 'object' },
                    mediumTerm: { type: 'object' },
                    confidence: { type: 'object' }
                }
            }
        });

        // Business Environment
        this.defineOutputChannel('business_environment', {
            name: 'Business Environment Indicators',
            description: 'Metrics affecting business operations and investment',
            aiInterpretation: 'Assess conditions for business growth and investment',
            dataType: 'metric',
            category: 'business',
            priority: 'medium',
            updateFrequency: 'daily',
            structure: {
                required: ['businessConfidence', 'investmentLevel', 'regulatoryBurden'],
                fields: {
                    businessConfidence: { type: 'number' },
                    investmentLevel: { type: 'number' },
                    regulatoryBurden: { type: 'number' }
                }
            }
        });
    }

    // Core Simulation Logic
    startSimulation() {
        // Daily economic updates
        setInterval(() => {
            this.updateEconomy();
        }, 1000); // Every second = 1 game day
        
        // Weekly detailed analysis
        setInterval(() => {
            this.performDetailedAnalysis();
        }, 7000); // Every 7 seconds = 1 game week
        
        console.log('Economic system simulation started');
    }

    updateEconomy() {
        const inputs = this.getAllInputs();
        const state = this.economicState;
        
        // Advance business cycle
        this.advanceBusinessCycle();

        // Update core economic indicators
        this.updateGDP(inputs);
        this.updateInflation(inputs);
        this.updateUnemployment(inputs);
        this.updateInterestRates(inputs);
        
        // Update fiscal metrics
        this.updateFiscalMetrics(inputs);
        
        // Update monetary metrics
        this.updateMonetaryMetrics(inputs);
        
        // Update trade metrics
        this.updateTradeMetrics(inputs);
        
        // Update market conditions
        this.updateMarketConditions(inputs);
        
        // Update sectoral performance
        this.updateSectoralPerformance(inputs);
        
        // Update income distribution
        this.updateIncomeDistribution(inputs);
        
        // Output all metrics
        this.outputEconomicData();
        
        state.lastUpdate = Date.now();
    }

    advanceBusinessCycle() {
        const cycle = this.businessCycle;
        cycle.phaseDayCounter += 1;
        
        // Transition logic at end of phase
        if (cycle.phaseDayCounter >= cycle.phaseLengthDays) {
            const next = {
                expansion: 'peak',
                peak: 'contraction',
                contraction: 'trough',
                trough: 'expansion'
            }[cycle.phase] || 'expansion';
            cycle.phase = next;
            cycle.phaseDayCounter = 0;
            
            // Randomize next phase length within reasonable bounds (0.5–1.5 years)
            const base = 365;
            const jitter = 0.5 + Math.random(); // 0.5–1.5
            cycle.phaseLengthDays = Math.max(120, Math.min(720, Math.floor(base * jitter)));
            cycle.lastPhaseChange = Date.now();
        }
    }

    updateGDP(inputs) {
        const state = this.economicState;
        const cycle = this.businessCycle;
        
        // Base growth rate
        let growthRate = 0.025; // 2.5% annual base
        
        // Fiscal policy effects
        const spendingEffect = (inputs.government_spending_level - 35) * 0.001; // Multiplier effect
        const taxEffect = -(inputs.tax_rate + inputs.income_tax_rate - 47) * 0.0005; // Tax burden effect
        
        // Monetary policy effects
        const interestRateEffect = -(inputs.interest_rate_target - 2.5) * 0.002;
        
        // Investment effects
        const infrastructureEffect = (inputs.infrastructure_investment - 3.5) * 0.003;
        const rdEffect = (inputs.rd_investment_incentives - 1.2) * 0.005;
        
        // Trade effects
        const tradeEffect = (inputs.trade_openness - 0.7) * 0.01;
        
        // Regulation effects
        const regulationEffect = -(inputs.business_regulation_level - 0.5) * 0.005;
        
        // Labor market effects
        const laborFlexibilityEffect = (inputs.labor_market_flexibility - 0.6) * 0.003;
        
        // Combine all effects
        growthRate += spendingEffect + taxEffect + interestRateEffect + 
                     infrastructureEffect + rdEffect + tradeEffect + 
                     regulationEffect + laborFlexibilityEffect;
        
        // Business cycle modulation
        const phaseModifiers = {
            expansion: 1.0,
            peak: 0.6,
            contraction: -0.8,
            trough: 0.3
        };
        const cycleMod = phaseModifiers[cycle.phase] ?? 1.0;
        // Blend towards cycle effect proportionally, keeping policy effects influential
        growthRate = growthRate * 0.7 + (growthRate >= 0 ? 0.03 : -0.03) * cycleMod * 0.3;
        
        // Add some randomness for market volatility
        growthRate += (Math.random() - 0.5) * 0.01 * state.marketVolatility;
        
        // Ensure reasonable bounds
        growthRate = Math.max(-0.08, Math.min(0.12, growthRate));
        
        // Update GDP (daily growth)
        const dailyGrowthRate = growthRate / 365;
        state.gdp *= (1 + dailyGrowthRate);
        state.gdpGrowthRate = growthRate;
    }

    updateInflation(inputs) {
        const state = this.economicState;
        
        // Base inflation target
        let inflation = 0.02; // 2% target
        
        // Monetary policy effects
        const interestRateEffect = -(inputs.interest_rate_target - 2.5) * 0.3;
        const moneySupplyEffect = (state.moneySupply / state.gdp - 0.8) * 0.1;
        
        // Fiscal policy effects
        const spendingEffect = (inputs.government_spending_level - 35) * 0.0003;
        
        // Supply-side effects
        const regulationEffect = (inputs.business_regulation_level - 0.5) * 0.005;
        const tradeEffect = -(inputs.trade_openness - 0.7) * 0.01; // More trade = lower prices
        
        // Labor market effects
        const wageEffect = (inputs.minimum_wage_level - 45) * 0.0001;
        
        // Economic growth effects (Phillips curve)
        const growthEffect = (state.gdpGrowthRate - 0.025) * 0.2;
        
        inflation += interestRateEffect + moneySupplyEffect + spendingEffect + 
                    regulationEffect + tradeEffect + wageEffect + growthEffect;
        
        // Add volatility
        inflation += (Math.random() - 0.5) * 0.005;
        
        // Ensure reasonable bounds
        inflation = Math.max(-0.02, Math.min(0.15, inflation));
        
        state.inflation = inflation;
    }

    updateUnemployment(inputs) {
        const state = this.economicState;
        
        // Natural rate of unemployment
        let unemployment = 0.05; // 5% natural rate
        
        // Economic growth effects (Okun's law)
        const growthEffect = -(state.gdpGrowthRate - 0.025) * 2;
        
        // Labor market flexibility effects
        const flexibilityEffect = -(inputs.labor_market_flexibility - 0.6) * 0.03;
        
        // Minimum wage effects
        const minWageEffect = (inputs.minimum_wage_level - 45) * 0.0002;
        
        // Government spending effects (job creation)
        const spendingEffect = -(inputs.government_spending_level - 35) * 0.0005;
        
        // Regulation effects
        const regulationEffect = (inputs.business_regulation_level - 0.5) * 0.01;
        
        unemployment += growthEffect + flexibilityEffect + minWageEffect + 
                       spendingEffect + regulationEffect;
        
        // Gradual adjustment (unemployment is sticky)
        const targetUnemployment = Math.max(0.02, Math.min(0.15, unemployment));
        state.unemployment += (targetUnemployment - state.unemployment) * 0.05; // 5% daily adjustment
    }

    updateInterestRates(inputs) {
        const state = this.economicState;
        
        // Central bank sets rates based on target
        const targetRate = inputs.interest_rate_target;
        
        // Gradual adjustment to target
        state.interestRate += (targetRate - state.interestRate) * 0.1; // 10% daily adjustment
        
        // Market rates adjust based on risk and central bank rate
        const riskPremium = state.debtToGDP * 0.02; // Higher debt = higher risk
        const inflationPremium = Math.max(0, state.inflation - 0.02) * 0.5; // Inflation risk
        
        state.interestRate = Math.max(0, state.interestRate + riskPremium + inflationPremium);
    }

    updateFiscalMetrics(inputs) {
        const state = this.economicState;
        
        // Calculate government revenue
        const corporateTaxRevenue = state.gdp * 0.12 * (inputs.tax_rate / 100); // Corporate profits ~12% of GDP
        const incomeTaxRevenue = state.gdp * 0.45 * (inputs.income_tax_rate / 100); // Personal income ~45% of GDP
        const otherRevenue = state.gdp * 0.08; // Other taxes and fees
        
        state.governmentRevenue = corporateTaxRevenue + incomeTaxRevenue + otherRevenue;
        
        // Calculate government spending
        state.governmentSpending = state.gdp * (inputs.government_spending_level / 100);
        
        // Calculate fiscal balance
        state.fiscalBalance = state.governmentRevenue - state.governmentSpending;
        
        // Update debt
        const dailyDeficit = -state.fiscalBalance / 365;
        state.publicDebt += dailyDeficit;
        state.publicDebt *= (1 + state.interestRate / 365); // Interest on debt
        
        // Calculate debt-to-GDP ratio
        state.debtToGDP = state.publicDebt / state.gdp;
    }

    updateMonetaryMetrics(inputs) {
        const state = this.economicState;
        
        // Update reserve ratio
        state.reserveRatio = inputs.reserve_requirement / 100;
        
        // Calculate money supply (simplified money multiplier model)
        const moneyMultiplier = 1 / state.reserveRatio;
        const monetaryBase = state.gdp * 0.15; // Base money ~15% of GDP
        state.moneySupply = monetaryBase * moneyMultiplier;
        
        // Adjust for central bank policy
        const policyAdjustment = (inputs.interest_rate_target - 2.5) * -0.02;
        state.moneySupply *= (1 + policyAdjustment);
    }

    updateTradeMetrics(inputs) {
        const state = this.economicState;
        
        // Calculate exports (based on competitiveness and trade openness)
        const baseExports = state.gdp * 0.25; // 25% of GDP base
        const competitivenessEffect = (1 - state.inflation) * (1 + state.gdpGrowthRate);
        const tradeOpennessEffect = inputs.trade_openness;
        const exportPromotionEffect = 1 + (inputs.export_promotion_spending / 100);
        const exchangeRateEffect = 1 / state.exchangeRate; // Lower exchange rate = more competitive
        
        state.exports = baseExports * competitivenessEffect * tradeOpennessEffect * 
                       exportPromotionEffect * exchangeRateEffect;
        
        // Calculate imports (based on domestic demand and trade openness)
        const baseImports = state.gdp * 0.23; // 23% of GDP base
        const demandEffect = 1 + state.gdpGrowthRate;
        const incomeEffect = 1 + (state.medianIncome / 55000 - 1) * 0.5;
        
        state.imports = baseImports * demandEffect * tradeOpennessEffect * 
                       incomeEffect * state.exchangeRate;
        
        // Calculate trade balance
        state.tradeBalance = state.exports - state.imports;
        
        // Update exchange rate (simplified)
        const tradeBalanceEffect = state.tradeBalance / state.gdp * 0.1;
        const interestRateEffect = (state.interestRate - 0.025) * 0.05;
        const inflationEffect = -state.inflation * 0.1;
        
        const exchangeRateChange = tradeBalanceEffect + interestRateEffect + inflationEffect;
        state.exchangeRate *= (1 + exchangeRateChange / 365);
        state.exchangeRate = Math.max(0.5, Math.min(2.0, state.exchangeRate));
        
        // Calculate current account (simplified)
        state.currentAccount = state.tradeBalance + (state.gdp * 0.02); // Net investment income
    }

    updateMarketConditions(inputs) {
        const state = this.economicState;
        
        // Update stock market index
        const growthEffect = state.gdpGrowthRate * 10;
        const interestRateEffect = -(state.interestRate - 0.025) * 20;
        const inflationEffect = -(state.inflation - 0.02) * 15;
        const confidenceEffect = (state.businessConfidence - 0.7) * 5;
        
        const marketReturn = (growthEffect + interestRateEffect + inflationEffect + confidenceEffect) / 365;
        const volatilityShock = (Math.random() - 0.5) * state.marketVolatility * 0.02;
        
        state.stockMarketIndex *= (1 + marketReturn + volatilityShock);
        state.stockMarketIndex = Math.max(100, state.stockMarketIndex);
        
        // Update market volatility
        const regulationEffect = -(inputs.financial_regulation_strictness - 0.6) * 0.1;
        const economicUncertaintyEffect = Math.abs(state.gdpGrowthRate - 0.025) * 2;
        
        state.marketVolatility = 0.15 + regulationEffect + economicUncertaintyEffect;
        state.marketVolatility = Math.max(0.05, Math.min(0.5, state.marketVolatility));
        
        // Update confidence indicators
        const economicPerformance = (state.gdpGrowthRate + 0.02) / 0.07; // Normalized performance
        const stabilityFactor = 1 - Math.abs(state.inflation - 0.02) * 10;
        const employmentFactor = 1 - state.unemployment * 2;
        
        state.businessConfidence = (economicPerformance + stabilityFactor + employmentFactor) / 3;
        state.businessConfidence = Math.max(0.2, Math.min(1.0, state.businessConfidence));
        
        state.consumerConfidence = state.businessConfidence * 0.9 + 
                                  (1 - state.unemployment) * 0.3 + 
                                  (state.medianIncome / 55000 - 1) * 0.2;
        state.consumerConfidence = Math.max(0.2, Math.min(1.0, state.consumerConfidence));
    }

    updateSectoralPerformance(inputs) {
        const state = this.economicState;
        
        // Update each sector based on policies and conditions
        const sectors = state.sectors;
        
        // Agriculture
        sectors.agriculture.growth = 0.01 + (inputs.infrastructure_investment - 3.5) * 0.001;
        
        // Manufacturing
        sectors.manufacturing.growth = 0.02 + 
                                     (inputs.trade_openness - 0.7) * 0.01 +
                                     (inputs.infrastructure_investment - 3.5) * 0.002 +
                                     -(inputs.business_regulation_level - 0.5) * 0.005;
        
        // Services
        sectors.services.growth = 0.03 + 
                                (state.consumerConfidence - 0.75) * 0.02 +
                                -(inputs.business_regulation_level - 0.5) * 0.003;
        
        // Technology
        sectors.technology.growth = 0.08 + 
                                  (inputs.rd_investment_incentives - 1.2) * 0.01 +
                                  (inputs.labor_market_flexibility - 0.6) * 0.02 +
                                  -(inputs.business_regulation_level - 0.5) * 0.01;
        
        // Ensure reasonable bounds for all sectors
        for (const sector of Object.values(sectors)) {
            sector.growth = Math.max(-0.05, Math.min(0.15, sector.growth));
        }
    }

    updateIncomeDistribution(inputs) {
        const state = this.economicState;
        
        // Update median income based on economic growth and policies
        const growthEffect = state.gdpGrowthRate;
        const minWageEffect = (inputs.minimum_wage_level - 45) * 0.001;
        const taxEffect = -(inputs.income_tax_rate - 22) * 0.002;
        
        const incomeGrowth = (growthEffect + minWageEffect + taxEffect) / 365;
        state.medianIncome *= (1 + incomeGrowth);
        
        // Update inequality (Gini coefficient)
        const taxProgressivityEffect = -(inputs.income_tax_rate - 22) * 0.002;
        const minWageInequalityEffect = -(inputs.minimum_wage_level - 45) * 0.001;
        const educationEffect = -(inputs.rd_investment_incentives - 1.2) * 0.01;
        const regulationEffect = -(inputs.business_regulation_level - 0.5) * 0.02;
        
        const inequalityChange = (taxProgressivityEffect + minWageInequalityEffect + 
                                educationEffect + regulationEffect) / 365;
        
        state.incomeInequality += inequalityChange;
        state.incomeInequality = Math.max(0.15, Math.min(0.7, state.incomeInequality));
        
        // Update wealth distribution (simplified)
        const wealthConcentrationEffect = state.incomeInequality;
        state.wealthDistribution.top1Percent = 0.2 + wealthConcentrationEffect * 0.3;
        state.wealthDistribution.top10Percent = 0.5 + wealthConcentrationEffect * 0.4;
        state.wealthDistribution.bottom50Percent = 0.1 - wealthConcentrationEffect * 0.15;
        
        // Normalize to ensure they make sense
        state.wealthDistribution.top1Percent = Math.max(0.1, Math.min(0.5, state.wealthDistribution.top1Percent));
        state.wealthDistribution.top10Percent = Math.max(0.4, Math.min(0.8, state.wealthDistribution.top10Percent));
        state.wealthDistribution.bottom50Percent = Math.max(0.01, Math.min(0.2, state.wealthDistribution.bottom50Percent));
    }

    outputEconomicData() {
        const state = this.economicState;
        
        // Core economic indicators
        this.setOutput('economic_indicators', {
            gdp: state.gdp,
            gdpGrowthRate: state.gdpGrowthRate,
            inflation: state.inflation,
            unemployment: state.unemployment,
            interestRate: state.interestRate,
            timestamp: Date.now()
        });

        // Business cycle output
        this.setOutput('business_cycle', {
            phase: this.businessCycle.phase,
            phaseDayCounter: this.businessCycle.phaseDayCounter,
            phaseLengthDays: this.businessCycle.phaseLengthDays
        });
        
        // Fiscal status
        this.setOutput('fiscal_status', {
            revenue: state.governmentRevenue,
            spending: state.governmentSpending,
            balance: state.fiscalBalance,
            debt: state.publicDebt,
            debtToGDP: state.debtToGDP,
            timestamp: Date.now()
        });
        
        // Monetary conditions
        this.setOutput('monetary_conditions', {
            interestRate: state.interestRate,
            moneySupply: state.moneySupply,
            reserveRatio: state.reserveRatio,
            stockMarketIndex: state.stockMarketIndex,
            marketVolatility: state.marketVolatility,
            timestamp: Date.now()
        });
        
        // Trade balance
        this.setOutput('trade_balance', {
            exports: state.exports,
            imports: state.imports,
            tradeBalance: state.tradeBalance,
            currentAccount: state.currentAccount,
            exchangeRate: state.exchangeRate,
            timestamp: Date.now()
        });
        
        // Sectoral performance
        this.setOutput('sectoral_performance', {
            sectors: state.sectors,
            totalGrowthContribution: this.calculateTotalGrowthContribution(),
            timestamp: Date.now()
        });
        
        // Income distribution
        this.setOutput('income_distribution', {
            medianIncome: state.medianIncome,
            incomeInequality: state.incomeInequality,
            wealthDistribution: state.wealthDistribution,
            timestamp: Date.now()
        });
        
        // Business environment
        this.setOutput('business_environment', {
            businessConfidence: state.businessConfidence,
            consumerConfidence: state.consumerConfidence,
            investmentLevel: this.calculateInvestmentLevel(),
            regulatoryBurden: this.calculateRegulatoryBurden(),
            timestamp: Date.now()
        });
    }

    calculateTotalGrowthContribution() {
        const sectors = this.economicState.sectors;
        let totalContribution = 0;
        
        for (const [sectorName, sector] of Object.entries(sectors)) {
            totalContribution += sector.share * sector.growth;
        }
        
        return totalContribution;
    }

    calculateInvestmentLevel() {
        const inputs = this.getAllInputs();
        const state = this.economicState;
        
        let investmentLevel = 0.2; // Base 20% of GDP
        investmentLevel += (inputs.infrastructure_investment / 100);
        investmentLevel += (inputs.rd_investment_incentives / 100);
        investmentLevel += (state.businessConfidence - 0.7) * 0.1;
        investmentLevel -= (state.interestRate - 0.025) * 2;
        
        return Math.max(0.1, Math.min(0.4, investmentLevel));
    }

    calculateRegulatoryBurden() {
        const inputs = this.getAllInputs();
        
        let burden = inputs.business_regulation_level * 0.4;
        burden += inputs.financial_regulation_strictness * 0.3;
        burden += (inputs.tax_rate / 100) * 0.3;
        
        return Math.max(0.1, Math.min(1.0, burden));
    }

    performDetailedAnalysis() {
        // Check for economic events
        this.checkForEconomicEvents();
        
        // Update forecasts
        this.updateForecasts();
        
        // Cleanup old data
        this.cleanup();
    }

    checkForEconomicEvents() {
        const state = this.economicState;
        const events = [];
        
        // Recession detection
        if (state.gdpGrowthRate < -0.01) {
            events.push({
                eventType: 'recession_warning',
                description: `Economic contraction detected: GDP growth at ${(state.gdpGrowthRate * 100).toFixed(2)}%`,
                severity: 'high',
                impact: {
                    unemployment: 'increasing',
                    businessConfidence: 'declining',
                    fiscalBalance: 'deteriorating'
                },
                timestamp: Date.now()
            });
        }
        
        // High inflation
        if (state.inflation > 0.05) {
            events.push({
                eventType: 'inflation_alert',
                description: `High inflation detected: ${(state.inflation * 100).toFixed(2)}% annual rate`,
                severity: 'medium',
                impact: {
                    purchasingPower: 'declining',
                    interestRates: 'pressure_to_increase',
                    socialStability: 'at_risk'
                },
                timestamp: Date.now()
            });
        }
        
        // Debt crisis warning
        if (state.debtToGDP > 0.9) {
            events.push({
                eventType: 'debt_crisis_warning',
                description: `High government debt: ${(state.debtToGDP * 100).toFixed(1)}% of GDP`,
                severity: 'high',
                impact: {
                    fiscalSpace: 'limited',
                    interestRates: 'rising',
                    creditRating: 'at_risk'
                },
                timestamp: Date.now()
            });
        }
        
        // Market crash
        const marketChange = (state.stockMarketIndex / 1000 - 1);
        if (marketChange < -0.2) {
            events.push({
                eventType: 'market_crash',
                description: `Stock market down ${(Math.abs(marketChange) * 100).toFixed(1)}% from baseline`,
                severity: 'high',
                impact: {
                    wealthEffect: 'negative',
                    businessInvestment: 'declining',
                    consumerSpending: 'at_risk'
                },
                timestamp: Date.now()
            });
        }
        
        if (events.length > 0) {
            this.setOutput('economic_events', events);
        }
    }

    updateForecasts() {
        const state = this.economicState;
        const inputs = this.getAllInputs();
        
        // Simple forecasting model
        const shortTermForecast = this.generateForecast(90); // 3 months
        const mediumTermForecast = this.generateForecast(730); // 2 years
        
        this.setOutput('economic_forecasts', {
            shortTerm: shortTermForecast,
            mediumTerm: mediumTermForecast,
            confidence: {
                shortTerm: 0.75,
                mediumTerm: 0.55
            },
            assumptions: {
                policyStability: 'current policies maintained',
                externalShocks: 'none assumed',
                technologicalChange: 'gradual'
            },
            timestamp: Date.now()
        });
    }

    generateForecast(days) {
        const state = this.economicState;
        const years = days / 365;
        
        // Project key indicators
        const projectedGDP = state.gdp * Math.pow(1 + state.gdpGrowthRate, years);
        const projectedInflation = state.inflation; // Assume stable
        const projectedUnemployment = state.unemployment; // Assume stable
        
        return {
            gdp: projectedGDP,
            gdpGrowthRate: state.gdpGrowthRate,
            inflation: projectedInflation,
            unemployment: projectedUnemployment,
            timeHorizon: `${years} years`,
            keyRisks: [
                'Policy changes',
                'External economic shocks',
                'Technological disruption'
            ]
        };
    }

    // Public API
    getEconomicSummary() {
        const state = this.economicState;
        return {
            gdp: state.gdp,
            growth: state.gdpGrowthRate,
            inflation: state.inflation,
            unemployment: state.unemployment,
            fiscalBalance: state.fiscalBalance,
            debtToGDP: state.debtToGDP,
            lastUpdate: state.lastUpdate
        };
    }
}

module.exports = { EconomicSystem };

