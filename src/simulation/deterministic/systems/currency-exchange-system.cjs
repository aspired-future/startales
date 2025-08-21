// Currency Exchange System - Multi-civilization currency trading and exchange rates
// Comprehensive foreign exchange simulation with AI-adjustable parameters

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class CurrencyExchangeSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('currency-exchange-system', config);
        
        // Core currency state
        this.currencyState = {
            // Base currency (this civilization's currency)
            baseCurrency: {
                code: config.baseCurrencyCode || 'GC', // Galactic Credits
                name: config.baseCurrencyName || 'Galactic Credits',
                symbol: config.baseCurrencySymbol || '₲',
                totalSupply: config.initialSupply || 1000000000000,
                inflationRate: 0.02,
                interestRate: 0.025
            },
            
            // Foreign currencies (other civilizations)
            foreignCurrencies: new Map([
                ['AC', { // Alpha Centauri Credits
                    name: 'Alpha Centauri Credits',
                    symbol: 'α₵',
                    exchangeRate: 1.15, // vs base currency
                    volatility: 0.12,
                    tradingVolume: 500000000,
                    economicStrength: 0.85,
                    politicalStability: 0.78,
                    tradeBalance: 2500000000
                }],
                ['VD', { // Vega Dollars
                    name: 'Vega Dollars',
                    symbol: 'V$',
                    exchangeRate: 0.92,
                    volatility: 0.18,
                    tradingVolume: 300000000,
                    economicStrength: 0.72,
                    politicalStability: 0.65,
                    tradeBalance: -1200000000
                }],
                ['SC', { // Sirius Coins
                    name: 'Sirius Coins',
                    symbol: '☆',
                    exchangeRate: 2.34,
                    volatility: 0.25,
                    tradingVolume: 150000000,
                    economicStrength: 0.68,
                    politicalStability: 0.55,
                    tradeBalance: 800000000
                }],
                ['PC', { // Proxima Credits
                    name: 'Proxima Credits',
                    symbol: 'Ᵽ',
                    exchangeRate: 0.78,
                    volatility: 0.15,
                    tradingVolume: 400000000,
                    economicStrength: 0.80,
                    politicalStability: 0.82,
                    tradeBalance: 1800000000
                }]
            ]),
            
            // Exchange market data
            exchangeMarket: {
                totalDailyVolume: 0,
                majorPairs: new Map(),
                crossRates: new Map(),
                marketSentiment: 0.6,
                liquidityIndex: 0.75
            },
            
            // Central bank reserves
            reserves: {
                foreignReserves: new Map([
                    ['AC', 50000000000],
                    ['VD', 30000000000],
                    ['SC', 15000000000],
                    ['PC', 40000000000]
                ]),
                goldReserves: 25000000000, // Universal store of value
                totalReserves: 0 // Calculated
            },
            
            // Trade flows
            tradeFlows: {
                exports: new Map(),
                imports: new Map(),
                netFlows: new Map(),
                tradeBalance: 0
            },
            
            // Market participants
            participants: {
                centralBanks: { count: 5, volume: 0.4 },
                commercialBanks: { count: 500, volume: 0.35 },
                corporations: { count: 10000, volume: 0.15 },
                speculators: { count: 50000, volume: 0.10 }
            },
            
            // Economic indicators affecting exchange rates
            economicFactors: {
                gdpGrowth: 0.025,
                inflation: 0.02,
                unemployment: 0.05,
                currentAccount: 0.02, // % of GDP
                fiscalBalance: -0.03, // % of GDP
                debtToGDP: 0.60
            },
            
            lastUpdate: Date.now()
        };
        
        this.initializeInputKnobs();
        this.initializeOutputChannels();
        this.calculateInitialValues();
        
        // Start currency simulation
        this.startCurrencySimulation();
    }

    initializeInputKnobs() {
        // Monetary Policy Controls
        this.addInputKnob('interest_rate_policy', 'float', 0.025, 
            'Central bank interest rate (affects currency strength)', 0, 0.15);
        
        this.addInputKnob('money_supply_growth', 'float', 0.05, 
            'Rate of money supply expansion (0-0.20)', 0, 0.20);
        
        this.addInputKnob('foreign_exchange_intervention', 'float', 0.2, 
            'Level of FX market intervention (0-1)', 0, 1);
        
        // Trade Policy Controls
        this.addInputKnob('trade_policy_stance', 'float', 0.6, 
            'Trade openness and promotion (0-1)', 0, 1);
        
        this.addInputKnob('export_promotion_spending', 'float', 0.3, 
            'Government spending on export promotion (0-1)', 0, 1);
        
        this.addInputKnob('import_tariff_levels', 'float', 0.15, 
            'Average import tariff rates (0-0.50)', 0, 0.50);
        
        // Capital Flow Controls
        this.addInputKnob('capital_controls', 'float', 0.1, 
            'Restrictions on capital flows (0-1)', 0, 1);
        
        this.addInputKnob('foreign_investment_incentives', 'float', 0.5, 
            'Incentives for foreign direct investment (0-1)', 0, 1);
        
        this.addInputKnob('currency_convertibility', 'float', 0.9, 
            'Ease of currency conversion (0-1)', 0, 1);
        
        // Reserve Management
        this.addInputKnob('reserve_accumulation_target', 'float', 0.4, 
            'Target level of foreign reserves (0-1)', 0, 1);
        
        this.addInputKnob('reserve_diversification', 'float', 0.6, 
            'Diversification of reserve holdings (0-1)', 0, 1);
        
        // Market Development
        this.addInputKnob('fx_market_development', 'float', 0.5, 
            'Investment in FX market infrastructure (0-1)', 0, 1);
        
        this.addInputKnob('currency_hedging_support', 'float', 0.4, 
            'Support for currency hedging instruments (0-1)', 0, 1);
        
        // International Relations
        this.addInputKnob('diplomatic_currency_agreements', 'float', 0.3, 
            'Bilateral currency swap agreements (0-1)', 0, 1);
        
        this.addInputKnob('regional_currency_integration', 'float', 0.2, 
            'Participation in regional currency unions (0-1)', 0, 1);
    }

    initializeOutputChannels() {
        // Exchange Rate Data
        this.addOutputChannel('exchange_rates', 'object', 
            'Current exchange rates for all currency pairs');
        
        this.addOutputChannel('currency_volatility', 'object', 
            'Volatility measures for all currencies');
        
        this.addOutputChannel('exchange_rate_trends', 'object', 
            'Short and long-term exchange rate trends');
        
        // Market Activity
        this.addOutputChannel('trading_volumes', 'object', 
            'Daily trading volumes by currency pair');
        
        this.addOutputChannel('market_liquidity', 'object', 
            'Liquidity conditions in FX markets');
        
        // Economic Impact
        this.addOutputChannel('trade_competitiveness', 'object', 
            'Currency impact on trade competitiveness');
        
        this.addOutputChannel('inflation_pressure', 'object', 
            'Exchange rate impact on domestic inflation');
        
        // Reserve Status
        this.addOutputChannel('reserve_adequacy', 'object', 
            'Foreign reserve levels and adequacy metrics');
        
        this.addOutputChannel('reserve_composition', 'object', 
            'Breakdown of foreign currency reserves');
        
        // Risk Assessment
        this.addOutputChannel('currency_risk', 'object', 
            'Currency risk assessment and vulnerabilities');
        
        this.addOutputChannel('capital_flow_analysis', 'object', 
            'Analysis of capital inflows and outflows');
        
        // Policy Recommendations
        this.addOutputChannel('fx_policy_recommendations', 'object', 
            'AI-generated foreign exchange policy recommendations');
    }

    calculateInitialValues() {
        // Calculate total reserves
        let totalReserves = this.currencyState.reserves.goldReserves;
        for (let [currency, amount] of this.currencyState.reserves.foreignReserves) {
            const exchangeRate = this.currencyState.foreignCurrencies.get(currency).exchangeRate;
            totalReserves += amount / exchangeRate;
        }
        this.currencyState.reserves.totalReserves = totalReserves;
        
        // Initialize major pairs
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            this.currencyState.exchangeMarket.majorPairs.set(
                `${this.currencyState.baseCurrency.code}/${code}`, 
                {
                    rate: currency.exchangeRate,
                    volume: currency.tradingVolume,
                    spread: 0.001 + currency.volatility * 0.01
                }
            );
        }
    }

    startCurrencySimulation() {
        // Simulate currency markets every 3 seconds (3 game days)
        this.currencyInterval = setInterval(() => {
            this.processCurrencyTick();
        }, 3000);
        
        console.log(`💱 Currency Exchange System started for ${this.systemId}`);
    }

    processCurrencyTick() {
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.currencyState.lastUpdate) / 1000; // seconds
        
        // Update exchange rates based on economic factors and policies
        this.updateExchangeRates(timeDelta);
        this.updateTradingVolumes(timeDelta);
        this.updateReserves(timeDelta);
        this.updateTradeFlows(timeDelta);
        this.processMarketEvents(timeDelta);
        
        // Generate outputs for AI consumption
        this.generateCurrencyOutputs();
        
        this.currencyState.lastUpdate = currentTime;
        
        // Emit update event
        this.emit('currencyUpdate', {
            timestamp: currentTime,
            baseCurrency: this.currencyState.baseCurrency.code,
            majorRates: Object.fromEntries(this.currencyState.exchangeMarket.majorPairs)
        });
    }

    updateExchangeRates(timeDelta) {
        const inputs = this.getCurrentInputs();
        
        // Interest rate differential impact
        const baseRate = inputs.interest_rate_policy;
        
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            // Assume foreign interest rates (simplified)
            const foreignRate = baseRate + (Math.random() - 0.5) * 0.02;
            const rateDifferential = baseRate - foreignRate;
            
            // Economic fundamentals impact
            const economicStrengthDiff = currency.economicStrength - 0.75; // Assume base = 0.75
            const stabilityDiff = currency.politicalStability - 0.70; // Assume base = 0.70
            
            // Trade balance impact
            const tradeImpact = currency.tradeBalance / 10000000000 * 0.01; // Normalize
            
            // Policy impacts
            const interventionImpact = inputs.foreign_exchange_intervention * 
                                    (Math.random() - 0.5) * 0.02;
            const tradeImpact2 = (inputs.trade_policy_stance - 0.5) * 0.01;
            
            // Calculate total impact
            const totalImpact = rateDifferential * 0.1 + 
                              economicStrengthDiff * 0.05 + 
                              stabilityDiff * 0.03 + 
                              tradeImpact + 
                              interventionImpact + 
                              tradeImpact2 + 
                              (Math.random() - 0.5) * currency.volatility * 0.02;
            
            // Update exchange rate
            currency.exchangeRate *= (1 + totalImpact * timeDelta / 86400);
            
            // Update volatility based on market conditions
            currency.volatility = Math.max(0.05, 
                currency.volatility + (Math.random() - 0.5) * 0.01);
            
            // Update major pairs
            const pairKey = `${this.currencyState.baseCurrency.code}/${code}`;
            if (this.currencyState.exchangeMarket.majorPairs.has(pairKey)) {
                this.currencyState.exchangeMarket.majorPairs.get(pairKey).rate = currency.exchangeRate;
            }
        }
    }

    updateTradingVolumes(timeDelta) {
        const inputs = this.getCurrentInputs();
        
        let totalVolume = 0;
        
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            // Volume affected by market development and liquidity
            const marketDevImpact = inputs.fx_market_development * 0.2;
            const liquidityImpact = this.currencyState.exchangeMarket.liquidityIndex * 0.15;
            const volatilityImpact = currency.volatility * 0.1;
            
            // Random daily variation
            const randomFactor = (Math.random() - 0.5) * 0.1;
            
            const volumeChange = (marketDevImpact + liquidityImpact + volatilityImpact + randomFactor) 
                               * timeDelta / 86400;
            
            currency.tradingVolume *= (1 + volumeChange);
            currency.tradingVolume = Math.max(10000000, currency.tradingVolume); // Minimum volume
            
            totalVolume += currency.tradingVolume;
            
            // Update major pairs volume
            const pairKey = `${this.currencyState.baseCurrency.code}/${code}`;
            if (this.currencyState.exchangeMarket.majorPairs.has(pairKey)) {
                this.currencyState.exchangeMarket.majorPairs.get(pairKey).volume = currency.tradingVolume;
            }
        }
        
        this.currencyState.exchangeMarket.totalDailyVolume = totalVolume;
    }

    updateReserves(timeDelta) {
        const inputs = this.getCurrentInputs();
        
        // Reserve accumulation based on policy
        const targetReserveRatio = inputs.reserve_accumulation_target;
        const currentReserveRatio = this.currencyState.reserves.totalReserves / 
                                   this.currencyState.economicFactors.gdpGrowth; // Simplified
        
        if (currentReserveRatio < targetReserveRatio) {
            // Accumulate reserves
            const accumulation = (targetReserveRatio - currentReserveRatio) * 0.1 * timeDelta / 86400;
            
            // Distribute accumulation across currencies based on diversification policy
            const diversification = inputs.reserve_diversification;
            
            for (let [code, amount] of this.currencyState.reserves.foreignReserves) {
                const currency = this.currencyState.foreignCurrencies.get(code);
                const weight = currency.economicStrength * diversification + 
                              (1 - diversification) * 0.25; // Equal weight if no diversification
                
                const additionalReserves = accumulation * weight * 1000000000; // Scale up
                this.currencyState.reserves.foreignReserves.set(code, amount + additionalReserves);
            }
        }
        
        // Recalculate total reserves
        let totalReserves = this.currencyState.reserves.goldReserves;
        for (let [currency, amount] of this.currencyState.reserves.foreignReserves) {
            const exchangeRate = this.currencyState.foreignCurrencies.get(currency).exchangeRate;
            totalReserves += amount / exchangeRate;
        }
        this.currencyState.reserves.totalReserves = totalReserves;
    }

    updateTradeFlows(timeDelta) {
        const inputs = this.getCurrentInputs();
        
        // Update trade flows based on exchange rates and policies
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            // Export competitiveness based on exchange rate
            const competitiveness = 1 / currency.exchangeRate; // Lower rate = more competitive
            const exportPromotion = inputs.export_promotion_spending;
            const tradeOpenness = inputs.trade_policy_stance;
            
            // Calculate export flows
            const baseExports = 1000000000; // $1B base
            const exportMultiplier = competitiveness * (1 + exportPromotion) * tradeOpenness;
            const exports = baseExports * exportMultiplier * (1 + (Math.random() - 0.5) * 0.1);
            
            // Calculate import flows (affected by tariffs and exchange rates)
            const importCost = currency.exchangeRate * (1 + inputs.import_tariff_levels);
            const baseImports = 800000000; // $800M base
            const importMultiplier = tradeOpenness / importCost;
            const imports = baseImports * importMultiplier * (1 + (Math.random() - 0.5) * 0.1);
            
            this.currencyState.tradeFlows.exports.set(code, exports);
            this.currencyState.tradeFlows.imports.set(code, imports);
            this.currencyState.tradeFlows.netFlows.set(code, exports - imports);
        }
        
        // Calculate total trade balance
        let totalBalance = 0;
        for (let [code, netFlow] of this.currencyState.tradeFlows.netFlows) {
            totalBalance += netFlow;
        }
        this.currencyState.tradeFlows.tradeBalance = totalBalance;
    }

    processMarketEvents(timeDelta) {
        // Generate random currency market events
        if (Math.random() < 0.0005 * timeDelta) { // Very low probability events
            const events = [
                'Central bank intervention',
                'Major trade agreement signed',
                'Political crisis in trading partner',
                'Commodity price shock',
                'Interest rate surprise',
                'Currency swap agreement',
                'Capital flow restrictions imposed',
                'Economic data surprise'
            ];
            
            const event = events[Math.floor(Math.random() * events.length)];
            const targetCurrency = Array.from(this.currencyState.foreignCurrencies.keys())
                [Math.floor(Math.random() * this.currencyState.foreignCurrencies.size)];
            
            const impact = (Math.random() - 0.5) * 0.1; // ±10% impact
            
            // Apply immediate impact to target currency
            const currency = this.currencyState.foreignCurrencies.get(targetCurrency);
            currency.exchangeRate *= (1 + impact);
            
            console.log(`💱 Currency event: ${event} affecting ${targetCurrency}, impact: ${(impact * 100).toFixed(2)}%`);
        }
    }

    generateCurrencyOutputs() {
        const inputs = this.getCurrentInputs();
        
        // Exchange Rates Output
        const exchangeRates = {};
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            exchangeRates[code] = {
                rate: currency.exchangeRate,
                change24h: (Math.random() - 0.5) * 0.05, // Simplified daily change
                symbol: currency.symbol,
                name: currency.name
            };
        }
        this.setOutput('exchange_rates', exchangeRates);
        
        // Currency Volatility Output
        const volatilityData = {};
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            volatilityData[code] = {
                volatility: currency.volatility,
                riskLevel: currency.volatility > 0.2 ? 'high' : currency.volatility > 0.1 ? 'medium' : 'low',
                trend: Math.random() > 0.5 ? 'increasing' : 'decreasing'
            };
        }
        this.setOutput('currency_volatility', volatilityData);
        
        // Exchange Rate Trends Output
        this.setOutput('exchange_rate_trends', {
            shortTerm: this.analyzeShortTermTrends(),
            longTerm: this.analyzeLongTermTrends(),
            technicalIndicators: this.calculateTechnicalIndicators(),
            forecastConfidence: Math.random() * 0.4 + 0.6 // 60-100%
        });
        
        // Trading Volumes Output
        const volumeData = {};
        for (let [pairKey, pairData] of this.currencyState.exchangeMarket.majorPairs) {
            volumeData[pairKey] = {
                volume: pairData.volume,
                volumeChange: (Math.random() - 0.5) * 0.2,
                marketShare: pairData.volume / this.currencyState.exchangeMarket.totalDailyVolume
            };
        }
        this.setOutput('trading_volumes', volumeData);
        
        // Market Liquidity Output
        this.setOutput('market_liquidity', {
            overallLiquidity: this.currencyState.exchangeMarket.liquidityIndex,
            bidAskSpreads: this.calculateBidAskSpreads(),
            marketDepth: this.assessMarketDepth(),
            liquidityRisk: this.assessLiquidityRisk()
        });
        
        // Trade Competitiveness Output
        this.setOutput('trade_competitiveness', {
            overallCompetitiveness: this.calculateTradeCompetitiveness(),
            exportCompetitiveness: this.calculateExportCompetitiveness(),
            importCostIndex: this.calculateImportCostIndex(),
            competitivenessRanking: this.calculateCompetitivenessRanking()
        });
        
        // Inflation Pressure Output
        this.setOutput('inflation_pressure', {
            importInflationPressure: this.calculateImportInflationPressure(),
            exchangeRatePassThrough: this.calculateExchangeRatePassThrough(),
            inflationRisk: this.assessInflationRisk(),
            policyResponse: this.recommendInflationResponse()
        });
        
        // Reserve Adequacy Output
        this.setOutput('reserve_adequacy', {
            totalReserves: this.currencyState.reserves.totalReserves,
            reserveAdequacyRatio: this.calculateReserveAdequacyRatio(),
            monthsOfImports: this.calculateMonthsOfImportCover(),
            adequacyAssessment: this.assessReserveAdequacy()
        });
        
        // Reserve Composition Output
        const reserveComposition = {};
        for (let [code, amount] of this.currencyState.reserves.foreignReserves) {
            const exchangeRate = this.currencyState.foreignCurrencies.get(code).exchangeRate;
            reserveComposition[code] = {
                amount: amount,
                valueInBaseCurrency: amount / exchangeRate,
                percentage: (amount / exchangeRate) / this.currencyState.reserves.totalReserves * 100
            };
        }
        reserveComposition.gold = {
            amount: this.currencyState.reserves.goldReserves,
            percentage: this.currencyState.reserves.goldReserves / this.currencyState.reserves.totalReserves * 100
        };
        this.setOutput('reserve_composition', reserveComposition);
        
        // Currency Risk Output
        this.setOutput('currency_risk', {
            overallRisk: this.assessOverallCurrencyRisk(),
            volatilityRisk: this.assessVolatilityRisk(),
            liquidityRisk: this.assessLiquidityRisk(),
            counterpartyRisk: this.assessCounterpartyRisk(),
            riskMitigation: this.recommendRiskMitigation()
        });
        
        // Capital Flow Analysis Output
        this.setOutput('capital_flow_analysis', {
            netCapitalFlows: this.calculateNetCapitalFlows(),
            fdiFlows: this.calculateFDIFlows(),
            portfolioFlows: this.calculatePortfolioFlows(),
            hotMoneyFlows: this.calculateHotMoneyFlows(),
            flowStability: this.assessFlowStability()
        });
        
        // FX Policy Recommendations Output
        this.setOutput('fx_policy_recommendations', {
            monetaryPolicy: this.recommendMonetaryPolicy(),
            interventionStrategy: this.recommendInterventionStrategy(),
            reserveManagement: this.recommendReserveManagement(),
            capitalControls: this.recommendCapitalControls(),
            tradePolicy: this.recommendTradePolicy()
        });
    }

    // Helper methods for analysis
    analyzeShortTermTrends() {
        const trends = {};
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            trends[code] = {
                direction: Math.random() > 0.5 ? 'strengthening' : 'weakening',
                momentum: Math.random(),
                support: currency.exchangeRate * (0.95 + Math.random() * 0.05),
                resistance: currency.exchangeRate * (1.05 + Math.random() * 0.05)
            };
        }
        return trends;
    }

    analyzeLongTermTrends() {
        const trends = {};
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            trends[code] = {
                fundamentalDirection: currency.economicStrength > 0.7 ? 'strengthening' : 'weakening',
                cyclicalPosition: Math.random() > 0.5 ? 'overvalued' : 'undervalued',
                structuralFactors: this.identifyStructuralFactors(code)
            };
        }
        return trends;
    }

    calculateTechnicalIndicators() {
        return {
            rsi: Math.random() * 100,
            macd: (Math.random() - 0.5) * 0.02,
            bollingerBands: {
                upper: 1.05,
                middle: 1.00,
                lower: 0.95
            }
        };
    }

    calculateBidAskSpreads() {
        const spreads = {};
        for (let [pairKey, pairData] of this.currencyState.exchangeMarket.majorPairs) {
            spreads[pairKey] = pairData.spread;
        }
        return spreads;
    }

    assessMarketDepth() {
        return this.currencyState.exchangeMarket.liquidityIndex * 100;
    }

    assessLiquidityRisk() {
        return this.currencyState.exchangeMarket.liquidityIndex < 0.3 ? 'high' : 
               this.currencyState.exchangeMarket.liquidityIndex < 0.6 ? 'medium' : 'low';
    }

    calculateTradeCompetitiveness() {
        let totalCompetitiveness = 0;
        let count = 0;
        
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            totalCompetitiveness += 1 / currency.exchangeRate; // Lower rate = more competitive
            count++;
        }
        
        return totalCompetitiveness / count;
    }

    calculateExportCompetitiveness() {
        const inputs = this.getCurrentInputs();
        return this.calculateTradeCompetitiveness() * (1 + inputs.export_promotion_spending);
    }

    calculateImportCostIndex() {
        let totalCost = 0;
        let count = 0;
        
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            totalCost += currency.exchangeRate;
            count++;
        }
        
        return totalCost / count;
    }

    calculateCompetitivenessRanking() {
        return Math.floor(Math.random() * 50) + 1; // Rank 1-50
    }

    calculateImportInflationPressure() {
        const importCostChange = (this.calculateImportCostIndex() - 1.0) * 0.3; // 30% pass-through
        return Math.max(0, importCostChange);
    }

    calculateExchangeRatePassThrough() {
        return 0.3 + Math.random() * 0.4; // 30-70% pass-through
    }

    assessInflationRisk() {
        const pressure = this.calculateImportInflationPressure();
        if (pressure > 0.05) return 'high';
        if (pressure > 0.02) return 'medium';
        return 'low';
    }

    recommendInflationResponse() {
        const risk = this.assessInflationRisk();
        if (risk === 'high') return 'Consider tightening monetary policy';
        if (risk === 'medium') return 'Monitor closely, prepare policy response';
        return 'No immediate action needed';
    }

    calculateReserveAdequacyRatio() {
        // Simplified: reserves as % of GDP
        return this.currencyState.reserves.totalReserves / 2500000000000 * 100; // Assume $2.5T GDP
    }

    calculateMonthsOfImportCover() {
        let totalImports = 0;
        for (let [code, imports] of this.currencyState.tradeFlows.imports) {
            totalImports += imports;
        }
        const monthlyImports = totalImports / 12;
        return this.currencyState.reserves.totalReserves / monthlyImports;
    }

    assessReserveAdequacy() {
        const months = this.calculateMonthsOfImportCover();
        if (months > 6) return 'adequate';
        if (months > 3) return 'marginal';
        return 'inadequate';
    }

    assessOverallCurrencyRisk() {
        const volatilityRisk = this.assessVolatilityRisk();
        const liquidityRisk = this.assessLiquidityRisk();
        
        const riskScores = { low: 1, medium: 2, high: 3 };
        const avgRisk = (riskScores[volatilityRisk] + riskScores[liquidityRisk]) / 2;
        
        if (avgRisk > 2.5) return 'high';
        if (avgRisk > 1.5) return 'medium';
        return 'low';
    }

    assessVolatilityRisk() {
        let avgVolatility = 0;
        let count = 0;
        
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            avgVolatility += currency.volatility;
            count++;
        }
        
        avgVolatility /= count;
        
        if (avgVolatility > 0.2) return 'high';
        if (avgVolatility > 0.1) return 'medium';
        return 'low';
    }

    assessCounterpartyRisk() {
        let avgStability = 0;
        let count = 0;
        
        for (let [code, currency] of this.currencyState.foreignCurrencies) {
            avgStability += currency.politicalStability;
            count++;
        }
        
        avgStability /= count;
        
        if (avgStability < 0.6) return 'high';
        if (avgStability < 0.8) return 'medium';
        return 'low';
    }

    recommendRiskMitigation() {
        return [
            'Diversify currency exposure',
            'Use hedging instruments',
            'Monitor political developments',
            'Maintain adequate reserves'
        ];
    }

    calculateNetCapitalFlows() {
        return (Math.random() - 0.5) * 10000000000; // ±$10B
    }

    calculateFDIFlows() {
        const inputs = this.getCurrentInputs();
        return inputs.foreign_investment_incentives * 5000000000 + 
               (Math.random() - 0.5) * 2000000000;
    }

    calculatePortfolioFlows() {
        return (Math.random() - 0.5) * 8000000000; // ±$8B
    }

    calculateHotMoneyFlows() {
        const inputs = this.getCurrentInputs();
        return (1 - inputs.capital_controls) * (Math.random() - 0.5) * 3000000000;
    }

    assessFlowStability() {
        const inputs = this.getCurrentInputs();
        const stability = inputs.capital_controls * 0.3 + 
                         inputs.foreign_investment_incentives * 0.4 + 
                         Math.random() * 0.3;
        
        if (stability > 0.7) return 'stable';
        if (stability > 0.4) return 'moderate';
        return 'volatile';
    }

    identifyStructuralFactors(currencyCode) {
        return [
            'Economic diversification',
            'Institutional quality',
            'Trade relationships',
            'Resource endowments'
        ];
    }

    recommendMonetaryPolicy() {
        const inputs = this.getCurrentInputs();
        const recommendations = [];
        
        if (this.assessInflationRisk() === 'high') {
            recommendations.push('Consider raising interest rates');
        }
        
        if (this.assessOverallCurrencyRisk() === 'high') {
            recommendations.push('Increase FX intervention readiness');
        }
        
        return recommendations;
    }

    recommendInterventionStrategy() {
        const inputs = this.getCurrentInputs();
        
        if (inputs.foreign_exchange_intervention < 0.3) {
            return 'Consider more active FX intervention';
        }
        
        return 'Maintain current intervention level';
    }

    recommendReserveManagement() {
        const adequacy = this.assessReserveAdequacy();
        
        if (adequacy === 'inadequate') {
            return 'Urgently build up foreign reserves';
        }
        
        if (adequacy === 'marginal') {
            return 'Gradually increase reserve levels';
        }
        
        return 'Maintain current reserve levels';
    }

    recommendCapitalControls() {
        const flowStability = this.assessFlowStability();
        
        if (flowStability === 'volatile') {
            return 'Consider implementing capital flow measures';
        }
        
        return 'Maintain current capital account openness';
    }

    recommendTradePolicy() {
        const competitiveness = this.calculateTradeCompetitiveness();
        
        if (competitiveness < 0.8) {
            return 'Enhance export promotion and competitiveness measures';
        }
        
        return 'Maintain current trade policy stance';
    }

    // Cleanup method
    destroy() {
        if (this.currencyInterval) {
            clearInterval(this.currencyInterval);
        }
        console.log(`💱 Currency Exchange System stopped for ${this.systemId}`);
    }
}

module.exports = { CurrencyExchangeSystem };
