// Central Bank System - Monetary policy, financial stability, and currency management
// Provides comprehensive central banking capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class CentralBankSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('central-bank-system', config);
        
        // System state
        this.state = {
            // Monetary Policy
            monetaryPolicy: {
                federal_funds_rate: 0.0525, // 5.25%
                discount_rate: 0.0575, // 5.75%
                reserve_requirement_ratio: 0.10, // 10%
                money_supply_m1: 5400000000000, // $5.4T
                money_supply_m2: 21200000000000, // $21.2T
                quantitative_easing_balance: 8500000000000, // $8.5T
                inflation_target: 0.02, // 2%
                current_inflation_rate: 0.031, // 3.1%
                policy_transmission_effectiveness: 0.78
            },
            
            // Financial Stability
            financialStability: {
                systemic_risk_index: 0.35, // Lower is better
                bank_capital_adequacy_ratio: 0.145, // 14.5%
                stress_test_pass_rate: 0.92,
                financial_institution_health: 0.82,
                credit_market_stability: 0.75,
                asset_bubble_risk_assessment: 0.28,
                counterparty_risk_monitoring: 0.85,
                macroprudential_policy_effectiveness: 0.73
            },
            
            // Banking Supervision
            bankingSupervision: {
                supervised_institutions: 4850,
                examination_coverage: 0.88,
                regulatory_compliance_rate: 0.91,
                enforcement_actions: 125, // annually
                consumer_protection_effectiveness: 0.84,
                anti_money_laundering_compliance: 0.89,
                cybersecurity_oversight: 0.78,
                resolution_planning_adequacy: 0.82
            },
            
            // Currency Operations
            currencyOperations: {
                currency_in_circulation: 2300000000000, // $2.3T
                currency_demand_forecast_accuracy: 0.87,
                counterfeit_detection_rate: 0.995,
                currency_distribution_efficiency: 0.91,
                digital_currency_research_progress: 0.45,
                international_currency_swaps: 15,
                foreign_exchange_interventions: 8, // annually
                reserve_currency_status_strength: 0.92
            },
            
            // Payment Systems
            paymentSystems: {
                fedwire_daily_volume: 4200000000000, // $4.2T daily
                ach_annual_volume: 29000000000, // 29B transactions
                payment_system_availability: 0.9995,
                real_time_payment_adoption: 0.68,
                cross_border_payment_efficiency: 0.72,
                payment_innovation_support: 0.75,
                cybersecurity_resilience: 0.88,
                operational_risk_management: 0.85
            },
            
            // Market Operations
            marketOperations: {
                open_market_operations_volume: 120000000000, // $120B monthly
                repo_market_functioning: 0.89,
                treasury_market_liquidity: 0.82,
                primary_dealer_relationships: 24,
                market_maker_support: 0.78,
                emergency_lending_facilities: 8,
                lender_of_last_resort_capacity: 0.95,
                market_intervention_effectiveness: 0.81
            },
            
            // Economic Research & Analysis
            economicResearch: {
                economic_forecasting_accuracy: 0.73,
                inflation_forecasting_accuracy: 0.68,
                gdp_forecasting_accuracy: 0.71,
                unemployment_forecasting_accuracy: 0.75,
                financial_stability_analysis_quality: 0.85,
                policy_impact_assessment_capability: 0.79,
                research_publication_influence: 0.88,
                data_collection_comprehensiveness: 0.92
            },
            
            // International Coordination
            internationalCoordination: {
                g7_central_bank_cooperation: 0.89,
                imf_collaboration_level: 0.85,
                bis_participation_effectiveness: 0.91,
                bilateral_central_bank_agreements: 45,
                currency_swap_network_coverage: 0.78,
                international_regulatory_coordination: 0.82,
                global_financial_stability_contribution: 0.87,
                crisis_response_coordination: 0.84
            },
            
            // Financial Innovation
            financialInnovation: {
                fintech_regulatory_framework: 0.72,
                digital_currency_development: 0.45,
                blockchain_technology_assessment: 0.68,
                regulatory_sandbox_effectiveness: 0.75,
                innovation_vs_stability_balance: 0.78,
                emerging_technology_monitoring: 0.81,
                public_private_partnership_strength: 0.73,
                innovation_policy_coordination: 0.69
            },
            
            // Crisis Management
            crisisManagement: {
                crisis_preparedness_level: 0.88,
                emergency_response_capability: 0.92,
                liquidity_provision_capacity: 0.95,
                stress_scenario_planning: 0.86,
                crisis_communication_effectiveness: 0.82,
                interagency_coordination: 0.79,
                recovery_planning_adequacy: 0.84,
                lessons_learned_integration: 0.77
            },
            
            // Transparency & Communication
            transparencyCommunication: {
                policy_communication_clarity: 0.78,
                forward_guidance_effectiveness: 0.74,
                market_expectation_anchoring: 0.81,
                public_accountability_measures: 0.85,
                data_transparency_level: 0.89,
                stakeholder_engagement_quality: 0.76,
                media_relations_effectiveness: 0.72,
                congressional_testimony_impact: 0.79
            },
            
            // Performance Metrics
            performanceMetrics: {
                overall_central_bank_effectiveness: 0.83,
                monetary_policy_success: 0.79,
                financial_stability_maintenance: 0.81,
                banking_supervision_quality: 0.86,
                payment_system_efficiency: 0.89,
                crisis_management_readiness: 0.87
            },
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('monetary_policy_stance', 'float', 0.5, 
            'Monetary policy stance: 0=very accommodative, 1=very restrictive', 0.0, 1.0);
        
        this.addInputKnob('inflation_targeting_strictness', 'float', 0.8, 
            'Strictness of inflation targeting vs other objectives', 0.0, 1.0);
        
        this.addInputKnob('financial_stability_priority', 'float', 0.85, 
            'Priority given to financial stability vs other objectives', 0.0, 1.0);
        
        this.addInputKnob('banking_supervision_intensity', 'float', 0.8, 
            'Intensity of banking supervision and regulatory enforcement', 0.0, 1.0);
        
        this.addInputKnob('crisis_preparedness_investment', 'float', 0.88, 
            'Investment in crisis preparedness and emergency capabilities', 0.0, 1.0);
        
        this.addInputKnob('payment_system_modernization', 'float', 0.75, 
            'Emphasis on payment system modernization and innovation', 0.0, 1.0);
        
        this.addInputKnob('international_cooperation_level', 'float', 0.85, 
            'Level of international central bank cooperation', 0.0, 1.0);
        
        this.addInputKnob('financial_innovation_openness', 'float', 0.7, 
            'Openness to financial innovation vs regulatory caution', 0.0, 1.0);
        
        this.addInputKnob('transparency_commitment', 'float', 0.8, 
            'Commitment to transparency and public communication', 0.0, 1.0);
        
        this.addInputKnob('quantitative_easing_willingness', 'float', 0.6, 
            'Willingness to use unconventional monetary policy tools', 0.0, 1.0);
        
        this.addInputKnob('macroprudential_activism', 'float', 0.73, 
            'Activism in using macroprudential policy tools', 0.0, 1.0);
        
        this.addInputKnob('digital_currency_development_pace', 'float', 0.45, 
            'Pace of central bank digital currency development', 0.0, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('monetary_policy_status', 'object', 
            'Current monetary policy stance, interest rates, and policy effectiveness');
        
        this.addOutputChannel('financial_stability_assessment', 'object', 
            'Financial stability indicators, systemic risks, and stability measures');
        
        this.addOutputChannel('banking_supervision_report', 'object', 
            'Banking supervision activities, compliance, and regulatory enforcement');
        
        this.addOutputChannel('payment_system_performance', 'object', 
            'Payment system operations, efficiency, and modernization progress');
        
        this.addOutputChannel('market_operations_summary', 'object', 
            'Market operations, liquidity provision, and market functioning');
        
        this.addOutputChannel('economic_analysis_insights', 'object', 
            'Economic research, forecasting accuracy, and policy analysis');
        
        this.addOutputChannel('crisis_management_readiness', 'object', 
            'Crisis preparedness, emergency capabilities, and response readiness');
        
        this.addOutputChannel('central_bank_transparency', 'object', 
            'Communication effectiveness, transparency measures, and public engagement');
        
        console.log('🏦 Central Bank System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update monetary policy
            this.updateMonetaryPolicy(gameState, aiInputs);
            
            // Process financial stability
            this.processFinancialStability(gameState, aiInputs);
            
            // Update banking supervision
            this.updateBankingSupervision(aiInputs);
            
            // Process currency operations
            this.processCurrencyOperations(gameState, aiInputs);
            
            // Update payment systems
            this.updatePaymentSystems(aiInputs);
            
            // Process market operations
            this.processMarketOperations(gameState, aiInputs);
            
            // Update economic research
            this.updateEconomicResearch(aiInputs);
            
            // Process international coordination
            this.processInternationalCoordination(aiInputs);
            
            // Update financial innovation
            this.updateFinancialInnovation(aiInputs);
            
            // Process crisis management
            this.processCrisisManagement(gameState, aiInputs);
            
            // Update transparency and communication
            this.updateTransparencyCommunication(aiInputs);
            
            // Calculate performance metrics
            this.calculatePerformanceMetrics(gameState);
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('🏦 Central Bank System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateMonetaryPolicy(gameState, aiInputs) {
        const policyStance = aiInputs.monetary_policy_stance || 0.5;
        const inflationTargeting = aiInputs.inflation_targeting_strictness || 0.8;
        const qeWillingness = aiInputs.quantitative_easing_willingness || 0.6;
        
        const monetary = this.state.monetaryPolicy;
        
        // Update federal funds rate based on policy stance
        // 0 = very accommodative (0-1%), 1 = very restrictive (8-10%)
        monetary.federal_funds_rate = Math.max(0.0, Math.min(0.10, 
            0.01 + policyStance * 0.08));
        
        // Update discount rate (typically 0.5% above fed funds rate)
        monetary.discount_rate = monetary.federal_funds_rate + 0.005;
        
        // Update reserve requirement based on policy stance
        monetary.reserve_requirement_ratio = Math.max(0.05, Math.min(0.15, 
            0.08 + policyStance * 0.05));
        
        // Update money supply based on policy stance
        const moneySupplyMultiplier = 1 + (0.5 - policyStance) * 0.1;
        monetary.money_supply_m1 = Math.floor(monetary.money_supply_m1 * moneySupplyMultiplier);
        monetary.money_supply_m2 = Math.floor(monetary.money_supply_m2 * moneySupplyMultiplier);
        
        // Update quantitative easing balance
        if (policyStance < 0.3 && qeWillingness > 0.7) {
            // Accommodative policy with high QE willingness
            monetary.quantitative_easing_balance = Math.min(12000000000000, 
                monetary.quantitative_easing_balance + 100000000000);
        } else if (policyStance > 0.7) {
            // Restrictive policy - reduce QE balance
            monetary.quantitative_easing_balance = Math.max(5000000000000, 
                monetary.quantitative_easing_balance - 50000000000);
        }
        
        // Update policy transmission effectiveness
        monetary.policy_transmission_effectiveness = Math.min(0.9, 
            0.7 + this.state.financialStability.financial_institution_health * 0.15);
        
        // Process inflation data from game state
        if (gameState.inflationData) {
            this.processInflationData(gameState.inflationData, inflationTargeting);
        }
        
        // Process economic indicators from game state
        if (gameState.economicIndicators) {
            this.processEconomicIndicators(gameState.economicIndicators, policyStance);
        }
    }

    processInflationData(inflationData, targetingStrictness) {
        const monetary = this.state.monetaryPolicy;
        
        if (inflationData.current_rate) {
            monetary.current_inflation_rate = inflationData.current_rate;
            
            // Adjust policy based on inflation targeting strictness
            const inflationGap = monetary.current_inflation_rate - monetary.inflation_target;
            
            if (targetingStrictness > 0.8 && Math.abs(inflationGap) > 0.005) {
                // Strict targeting - adjust rates more aggressively
                if (inflationGap > 0) {
                    monetary.federal_funds_rate = Math.min(0.10, 
                        monetary.federal_funds_rate + inflationGap * 0.5);
                } else {
                    monetary.federal_funds_rate = Math.max(0.0, 
                        monetary.federal_funds_rate + inflationGap * 0.3);
                }
            }
        }
    }

    processEconomicIndicators(indicators, policyStance) {
        const monetary = this.state.monetaryPolicy;
        
        // Adjust policy based on economic conditions
        if (indicators.unemployment_rate > 0.06 && policyStance > 0.5) {
            // High unemployment suggests need for more accommodative policy
            monetary.federal_funds_rate = Math.max(0.0, 
                monetary.federal_funds_rate - 0.0025);
        }
        
        if (indicators.gdp_growth < 0.02 && policyStance > 0.4) {
            // Low growth suggests need for stimulus
            monetary.money_supply_m2 = Math.floor(monetary.money_supply_m2 * 1.02);
        }
    }

    processFinancialStability(gameState, aiInputs) {
        const stabilityPriority = aiInputs.financial_stability_priority || 0.85;
        const macroprudentialActivism = aiInputs.macroprudential_activism || 0.73;
        
        const stability = this.state.financialStability;
        
        // Update systemic risk index based on stability priority
        stability.systemic_risk_index = Math.max(0.2, 
            0.4 - stabilityPriority * 0.15);
        
        // Update bank capital adequacy ratio
        const minCapitalRatio = 0.12 + stabilityPriority * 0.04;
        stability.bank_capital_adequacy_ratio = Math.max(minCapitalRatio, 
            stability.bank_capital_adequacy_ratio);
        
        // Update stress test pass rate
        stability.stress_test_pass_rate = Math.min(0.98, 
            0.85 + stabilityPriority * 0.1);
        
        // Update financial institution health
        stability.financial_institution_health = Math.min(0.95, 
            0.75 + stabilityPriority * 0.15);
        
        // Update macroprudential policy effectiveness
        stability.macroprudential_policy_effectiveness = macroprudentialActivism;
        
        // Update asset bubble risk assessment
        stability.asset_bubble_risk_assessment = Math.max(0.15, 
            0.35 - stabilityPriority * 0.15);
        
        // Update counterparty risk monitoring
        stability.counterparty_risk_monitoring = Math.min(0.95, 
            0.8 + stabilityPriority * 0.12);
        
        // Process financial crisis indicators from game state
        if (gameState.financialCrisisIndicators) {
            this.processFinancialCrisisIndicators(gameState.financialCrisisIndicators, stabilityPriority);
        }
        
        // Process banking sector data from game state
        if (gameState.bankingSectorData) {
            this.processBankingSectorData(gameState.bankingSectorData, macroprudentialActivism);
        }
    }

    processFinancialCrisisIndicators(indicators, stabilityPriority) {
        const stability = this.state.financialStability;
        
        indicators.forEach(indicator => {
            const stabilityResponse = stabilityPriority * 0.8;
            
            if (indicator.type === 'credit_bubble') {
                stability.asset_bubble_risk_assessment = Math.min(0.8, 
                    stability.asset_bubble_risk_assessment + indicator.severity * (1 - stabilityResponse));
            } else if (indicator.type === 'bank_stress') {
                stability.financial_institution_health = Math.max(0.6, 
                    stability.financial_institution_health - indicator.severity * (1 - stabilityResponse));
            }
            
            console.log(`🏦 Central Bank System: Managing ${indicator.type} with ${stabilityResponse.toFixed(2)} response effectiveness`);
        });
    }

    processBankingSectorData(sectorData, macroprudentialActivism) {
        const stability = this.state.financialStability;
        
        if (sectorData.average_capital_ratio) {
            stability.bank_capital_adequacy_ratio = sectorData.average_capital_ratio;
        }
        
        if (sectorData.credit_growth_rate > 0.15 && macroprudentialActivism > 0.8) {
            // High credit growth with active macroprudential policy
            console.log('🏦 Central Bank System: Implementing macroprudential measures for high credit growth');
            stability.macroprudential_policy_effectiveness = Math.min(0.9, 
                stability.macroprudential_policy_effectiveness + 0.05);
        }
    }

    updateBankingSupervision(aiInputs) {
        const supervisionIntensity = aiInputs.banking_supervision_intensity || 0.8;
        
        const supervision = this.state.bankingSupervision;
        
        // Update examination coverage
        supervision.examination_coverage = Math.min(0.95, 
            0.8 + supervisionIntensity * 0.12);
        
        // Update regulatory compliance rate
        supervision.regulatory_compliance_rate = Math.min(0.98, 
            0.85 + supervisionIntensity * 0.1);
        
        // Update enforcement actions (more intensive supervision = more actions)
        supervision.enforcement_actions = Math.floor(100 + 
            supervisionIntensity * 50);
        
        // Update consumer protection effectiveness
        supervision.consumer_protection_effectiveness = Math.min(0.95, 
            0.75 + supervisionIntensity * 0.15);
        
        // Update anti-money laundering compliance
        supervision.anti_money_laundering_compliance = Math.min(0.95, 
            0.85 + supervisionIntensity * 0.08);
        
        // Update cybersecurity oversight
        supervision.cybersecurity_oversight = Math.min(0.9, 
            0.7 + supervisionIntensity * 0.15);
        
        // Update resolution planning adequacy
        supervision.resolution_planning_adequacy = Math.min(0.9, 
            0.75 + supervisionIntensity * 0.12);
    }

    processCurrencyOperations(gameState, aiInputs) {
        const digitalCurrencyPace = aiInputs.digital_currency_development_pace || 0.45;
        const internationalCooperation = aiInputs.international_cooperation_level || 0.85;
        
        const currency = this.state.currencyOperations;
        
        // Update digital currency research progress
        currency.digital_currency_research_progress = digitalCurrencyPace;
        
        // Update currency demand forecast accuracy
        currency.currency_demand_forecast_accuracy = Math.min(0.95, 
            0.8 + this.state.economicResearch.economic_forecasting_accuracy * 0.15);
        
        // Update currency distribution efficiency
        currency.currency_distribution_efficiency = Math.min(0.95, 
            0.85 + digitalCurrencyPace * 0.08);
        
        // Update international currency swaps
        currency.international_currency_swaps = Math.floor(12 + 
            internationalCooperation * 8);
        
        // Update reserve currency status strength
        currency.reserve_currency_status_strength = Math.min(0.98, 
            0.88 + this.state.financialStability.financial_institution_health * 0.08);
        
        // Process currency demand from game state
        if (gameState.currencyDemand) {
            this.processCurrencyDemand(gameState.currencyDemand);
        }
    }

    processCurrencyDemand(demandData) {
        const currency = this.state.currencyOperations;
        
        if (demandData.physical_currency_demand) {
            const demandChange = demandData.physical_currency_demand - currency.currency_in_circulation;
            
            if (Math.abs(demandChange) > currency.currency_in_circulation * 0.05) {
                // Significant demand change
                currency.currency_in_circulation = Math.max(2000000000000, 
                    demandData.physical_currency_demand);
                
                console.log(`🏦 Central Bank System: Adjusting currency supply by ${(demandChange / 1000000000).toFixed(1)}B`);
            }
        }
    }

    updatePaymentSystems(aiInputs) {
        const modernizationEmphasis = aiInputs.payment_system_modernization || 0.75;
        
        const payments = this.state.paymentSystems;
        
        // Update real-time payment adoption
        payments.real_time_payment_adoption = Math.min(0.9, 
            0.6 + modernizationEmphasis * 0.25);
        
        // Update cross-border payment efficiency
        payments.cross_border_payment_efficiency = Math.min(0.85, 
            0.65 + modernizationEmphasis * 0.18);
        
        // Update payment innovation support
        payments.payment_innovation_support = modernizationEmphasis;
        
        // Update cybersecurity resilience
        payments.cybersecurity_resilience = Math.min(0.95, 
            0.8 + modernizationEmphasis * 0.12);
        
        // Update operational risk management
        payments.operational_risk_management = Math.min(0.92, 
            0.8 + modernizationEmphasis * 0.1);
        
        // Update payment system availability (very high baseline)
        payments.payment_system_availability = Math.min(0.9999, 
            0.999 + modernizationEmphasis * 0.0008);
    }

    processMarketOperations(gameState, aiInputs) {
        const policyStance = aiInputs.monetary_policy_stance || 0.5;
        const qeWillingness = aiInputs.quantitative_easing_willingness || 0.6;
        
        const market = this.state.marketOperations;
        
        // Update open market operations volume based on policy stance
        const baseVolume = 100000000000; // $100B
        const stanceMultiplier = 1 + (0.5 - policyStance) * 0.4;
        market.open_market_operations_volume = Math.floor(baseVolume * stanceMultiplier);
        
        // Update repo market functioning
        market.repo_market_functioning = Math.min(0.95, 
            0.8 + this.state.financialStability.credit_market_stability * 0.15);
        
        // Update treasury market liquidity
        market.treasury_market_liquidity = Math.min(0.9, 
            0.75 + market.repo_market_functioning * 0.12);
        
        // Update emergency lending facilities based on QE willingness
        market.emergency_lending_facilities = Math.floor(6 + qeWillingness * 4);
        
        // Update lender of last resort capacity
        market.lender_of_last_resort_capacity = Math.min(0.98, 
            0.9 + qeWillingness * 0.06);
        
        // Update market intervention effectiveness
        market.market_intervention_effectiveness = Math.min(0.9, 
            0.75 + this.state.monetaryPolicy.policy_transmission_effectiveness * 0.15);
        
        // Process market stress from game state
        if (gameState.marketStress) {
            this.processMarketStress(gameState.marketStress, qeWillingness);
        }
    }

    processMarketStress(stressData, qeWillingness) {
        const market = this.state.marketOperations;
        
        stressData.forEach(stress => {
            const interventionCapability = qeWillingness * 0.9;
            
            if (stress.type === 'liquidity_crunch') {
                // Provide emergency liquidity
                market.open_market_operations_volume = Math.floor(
                    market.open_market_operations_volume * (1 + stress.severity * interventionCapability));
                
                console.log(`🏦 Central Bank System: Providing emergency liquidity for ${stress.type}`);
            } else if (stress.type === 'credit_freeze') {
                // Activate emergency lending facilities
                market.emergency_lending_facilities = Math.min(12, 
                    market.emergency_lending_facilities + Math.floor(stress.severity * 3));
            }
        });
    }

    updateEconomicResearch(aiInputs) {
        const transparencyCommitment = aiInputs.transparency_commitment || 0.8;
        
        const research = this.state.economicResearch;
        
        // Update forecasting accuracy based on data quality and methodology
        research.economic_forecasting_accuracy = Math.min(0.85, 
            0.65 + this.state.economicResearch.data_collection_comprehensiveness * 0.18);
        
        // Update inflation forecasting accuracy
        research.inflation_forecasting_accuracy = Math.min(0.8, 
            0.6 + research.economic_forecasting_accuracy * 0.2);
        
        // Update GDP forecasting accuracy
        research.gdp_forecasting_accuracy = Math.min(0.82, 
            0.63 + research.economic_forecasting_accuracy * 0.18);
        
        // Update unemployment forecasting accuracy
        research.unemployment_forecasting_accuracy = Math.min(0.85, 
            0.67 + research.economic_forecasting_accuracy * 0.17);
        
        // Update financial stability analysis quality
        research.financial_stability_analysis_quality = Math.min(0.95, 
            0.8 + this.state.financialStability.systemic_risk_index * (-0.15));
        
        // Update policy impact assessment capability
        research.policy_impact_assessment_capability = Math.min(0.9, 
            0.7 + transparencyCommitment * 0.15);
        
        // Update research publication influence
        research.research_publication_influence = Math.min(0.95, 
            0.8 + research.financial_stability_analysis_quality * 0.12);
    }

    processInternationalCoordination(aiInputs) {
        const cooperationLevel = aiInputs.international_cooperation_level || 0.85;
        
        const international = this.state.internationalCoordination;
        
        // Update G7 central bank cooperation
        international.g7_central_bank_cooperation = Math.min(0.95, 
            0.8 + cooperationLevel * 0.12);
        
        // Update IMF collaboration level
        international.imf_collaboration_level = cooperationLevel;
        
        // Update BIS participation effectiveness
        international.bis_participation_effectiveness = Math.min(0.98, 
            0.85 + cooperationLevel * 0.1);
        
        // Update bilateral central bank agreements
        international.bilateral_central_bank_agreements = Math.floor(35 + 
            cooperationLevel * 20);
        
        // Update currency swap network coverage
        international.currency_swap_network_coverage = Math.min(0.9, 
            0.65 + cooperationLevel * 0.2);
        
        // Update international regulatory coordination
        international.international_regulatory_coordination = Math.min(0.9, 
            0.7 + cooperationLevel * 0.15);
        
        // Update global financial stability contribution
        international.global_financial_stability_contribution = Math.min(0.95, 
            0.8 + this.state.financialStability.macroprudential_policy_effectiveness * 0.12);
        
        // Update crisis response coordination
        international.crisis_response_coordination = Math.min(0.92, 
            0.75 + cooperationLevel * 0.15);
    }

    updateFinancialInnovation(aiInputs) {
        const innovationOpenness = aiInputs.financial_innovation_openness || 0.7;
        const digitalCurrencyPace = aiInputs.digital_currency_development_pace || 0.45;
        
        const innovation = this.state.financialInnovation;
        
        // Update fintech regulatory framework
        innovation.fintech_regulatory_framework = Math.min(0.85, 
            0.6 + innovationOpenness * 0.2);
        
        // Update digital currency development
        innovation.digital_currency_development = digitalCurrencyPace;
        
        // Update blockchain technology assessment
        innovation.blockchain_technology_assessment = Math.min(0.8, 
            0.6 + digitalCurrencyPace * 0.35);
        
        // Update regulatory sandbox effectiveness
        innovation.regulatory_sandbox_effectiveness = Math.min(0.9, 
            0.65 + innovationOpenness * 0.2);
        
        // Update innovation vs stability balance
        innovation.innovation_vs_stability_balance = Math.min(0.9, 
            0.6 + innovationOpenness * 0.2 + this.state.financialStability.financial_stability_priority * 0.1);
        
        // Update emerging technology monitoring
        innovation.emerging_technology_monitoring = Math.min(0.9, 
            0.7 + innovationOpenness * 0.15);
        
        // Update public-private partnership strength
        innovation.public_private_partnership_strength = Math.min(0.85, 
            0.6 + innovationOpenness * 0.2);
        
        // Update innovation policy coordination
        innovation.innovation_policy_coordination = Math.min(0.8, 
            0.6 + innovationOpenness * 0.15);
    }

    processCrisisManagement(gameState, aiInputs) {
        const crisisPreparedness = aiInputs.crisis_preparedness_investment || 0.88;
        
        const crisis = this.state.crisisManagement;
        
        // Update crisis preparedness level
        crisis.crisis_preparedness_level = crisisPreparedness;
        
        // Update emergency response capability
        crisis.emergency_response_capability = Math.min(0.98, 
            0.85 + crisisPreparedness * 0.1);
        
        // Update liquidity provision capacity
        crisis.liquidity_provision_capacity = Math.min(0.99, 
            0.9 + crisisPreparedness * 0.07);
        
        // Update stress scenario planning
        crisis.stress_scenario_planning = Math.min(0.95, 
            0.8 + crisisPreparedness * 0.12);
        
        // Update interagency coordination
        crisis.interagency_coordination = Math.min(0.9, 
            0.7 + crisisPreparedness * 0.15);
        
        // Update recovery planning adequacy
        crisis.recovery_planning_adequacy = Math.min(0.92, 
            0.75 + crisisPreparedness * 0.15);
        
        // Update lessons learned integration
        crisis.lessons_learned_integration = Math.min(0.85, 
            0.7 + crisisPreparedness * 0.12);
        
        // Process financial crises from game state
        if (gameState.financialCrises) {
            this.processFinancialCrises(gameState.financialCrises, crisisPreparedness);
        }
    }

    processFinancialCrises(crises, preparedness) {
        const crisis = this.state.crisisManagement;
        
        crises.forEach(crisisEvent => {
            const responseEffectiveness = preparedness * 0.9;
            
            console.log(`🏦 Central Bank System: Responding to ${crisisEvent.type} crisis with ${responseEffectiveness.toFixed(2)} effectiveness`);
            
            if (crisisEvent.severity > responseEffectiveness) {
                // Crisis exceeds response capability - learn and improve
                crisis.lessons_learned_integration = Math.min(0.9, 
                    crisis.lessons_learned_integration + 0.02);
                crisis.crisis_preparedness_level = Math.min(0.95, 
                    crisis.crisis_preparedness_level + 0.01);
            } else {
                // Successful crisis management
                crisis.emergency_response_capability = Math.min(0.99, 
                    crisis.emergency_response_capability + 0.005);
            }
        });
    }

    updateTransparencyCommunication(aiInputs) {
        const transparencyCommitment = aiInputs.transparency_commitment || 0.8;
        
        const transparency = this.state.transparencyCommunication;
        
        // Update policy communication clarity
        transparency.policy_communication_clarity = Math.min(0.9, 
            0.7 + transparencyCommitment * 0.15);
        
        // Update forward guidance effectiveness
        transparency.forward_guidance_effectiveness = Math.min(0.85, 
            0.65 + transparencyCommitment * 0.18);
        
        // Update market expectation anchoring
        transparency.market_expectation_anchoring = Math.min(0.9, 
            0.7 + transparency.forward_guidance_effectiveness * 0.2);
        
        // Update public accountability measures
        transparency.public_accountability_measures = Math.min(0.95, 
            0.8 + transparencyCommitment * 0.12);
        
        // Update data transparency level
        transparency.data_transparency_level = Math.min(0.95, 
            0.8 + transparencyCommitment * 0.12);
        
        // Update stakeholder engagement quality
        transparency.stakeholder_engagement_quality = Math.min(0.85, 
            0.65 + transparencyCommitment * 0.18);
        
        // Update media relations effectiveness
        transparency.media_relations_effectiveness = Math.min(0.8, 
            0.65 + transparencyCommitment * 0.12);
        
        // Update congressional testimony impact
        transparency.congressional_testimony_impact = Math.min(0.9, 
            0.7 + transparencyCommitment * 0.15);
    }

    calculatePerformanceMetrics(gameState) {
        const metrics = this.state.performanceMetrics;
        
        // Calculate overall central bank effectiveness
        const policyEffectiveness = this.calculateMonetaryPolicyEffectiveness();
        const stabilityMaintenance = this.calculateFinancialStabilityMaintenance();
        const supervisionQuality = this.calculateBankingSupervisionQuality();
        const systemEfficiency = this.calculatePaymentSystemEfficiency();
        
        metrics.overall_central_bank_effectiveness = 
            (policyEffectiveness + stabilityMaintenance + supervisionQuality + systemEfficiency) / 4;
        
        // Calculate monetary policy success
        metrics.monetary_policy_success = policyEffectiveness;
        
        // Calculate financial stability maintenance
        metrics.financial_stability_maintenance = stabilityMaintenance;
        
        // Calculate banking supervision quality
        metrics.banking_supervision_quality = supervisionQuality;
        
        // Calculate payment system efficiency
        metrics.payment_system_efficiency = systemEfficiency;
        
        // Calculate crisis management readiness
        metrics.crisis_management_readiness = this.calculateCrisisManagementReadiness();
    }

    calculateMonetaryPolicyEffectiveness() {
        const monetary = this.state.monetaryPolicy;
        
        // Effectiveness based on inflation targeting and policy transmission
        const inflationTargetingSuccess = 1 - Math.abs(monetary.current_inflation_rate - monetary.inflation_target) / 0.02;
        const transmissionEffectiveness = monetary.policy_transmission_effectiveness;
        
        return (Math.max(0, inflationTargetingSuccess) + transmissionEffectiveness) / 2;
    }

    calculateFinancialStabilityMaintenance() {
        const stability = this.state.financialStability;
        
        return (stability.financial_institution_health + 
                (1 - stability.systemic_risk_index) + 
                stability.stress_test_pass_rate + 
                stability.macroprudential_policy_effectiveness) / 4;
    }

    calculateBankingSupervisionQuality() {
        const supervision = this.state.bankingSupervision;
        
        return (supervision.examination_coverage + 
                supervision.regulatory_compliance_rate + 
                supervision.consumer_protection_effectiveness + 
                supervision.anti_money_laundering_compliance) / 4;
    }

    calculatePaymentSystemEfficiency() {
        const payments = this.state.paymentSystems;
        
        return (payments.payment_system_availability + 
                payments.real_time_payment_adoption + 
                payments.cross_border_payment_efficiency + 
                payments.cybersecurity_resilience) / 4;
    }

    calculateCrisisManagementReadiness() {
        const crisis = this.state.crisisManagement;
        
        return (crisis.crisis_preparedness_level + 
                crisis.emergency_response_capability + 
                crisis.liquidity_provision_capacity + 
                crisis.stress_scenario_planning) / 4;
    }

    generateOutputs() {
        return {
            monetary_policy_status: {
                interest_rates: {
                    federal_funds_rate: this.state.monetaryPolicy.federal_funds_rate,
                    discount_rate: this.state.monetaryPolicy.discount_rate,
                    reserve_requirement: this.state.monetaryPolicy.reserve_requirement_ratio
                },
                money_supply: {
                    m1_supply: this.state.monetaryPolicy.money_supply_m1,
                    m2_supply: this.state.monetaryPolicy.money_supply_m2,
                    qe_balance: this.state.monetaryPolicy.quantitative_easing_balance
                },
                inflation_management: {
                    target_rate: this.state.monetaryPolicy.inflation_target,
                    current_rate: this.state.monetaryPolicy.current_inflation_rate,
                    targeting_success: this.assessInflationTargetingSuccess(),
                    policy_transmission: this.state.monetaryPolicy.policy_transmission_effectiveness
                },
                policy_stance_analysis: this.analyzePolicyStance(),
                monetary_policy_effectiveness: this.assessMonetaryPolicyEffectiveness()
            },
            
            financial_stability_assessment: {
                stability_indicators: {
                    systemic_risk_index: this.state.financialStability.systemic_risk_index,
                    bank_capital_adequacy: this.state.financialStability.bank_capital_adequacy_ratio,
                    stress_test_results: this.state.financialStability.stress_test_pass_rate,
                    institution_health: this.state.financialStability.financial_institution_health
                },
                risk_assessment: {
                    credit_market_stability: this.state.financialStability.credit_market_stability,
                    asset_bubble_risk: this.state.financialStability.asset_bubble_risk_assessment,
                    counterparty_risk: this.state.financialStability.counterparty_risk_monitoring
                },
                macroprudential_policy: {
                    policy_effectiveness: this.state.financialStability.macroprudential_policy_effectiveness,
                    regulatory_measures: this.assessMacroprudentialMeasures(),
                    systemic_risk_mitigation: this.assessSystemicRiskMitigation()
                },
                stability_outlook: this.assessFinancialStabilityOutlook(),
                vulnerability_analysis: this.analyzeFinancialVulnerabilities()
            },
            
            banking_supervision_report: {
                supervision_coverage: {
                    supervised_institutions: this.state.bankingSupervision.supervised_institutions,
                    examination_coverage: this.state.bankingSupervision.examination_coverage,
                    compliance_rate: this.state.bankingSupervision.regulatory_compliance_rate
                },
                enforcement_activities: {
                    enforcement_actions: this.state.bankingSupervision.enforcement_actions,
                    consumer_protection: this.state.bankingSupervision.consumer_protection_effectiveness,
                    aml_compliance: this.state.bankingSupervision.anti_money_laundering_compliance
                },
                risk_management: {
                    cybersecurity_oversight: this.state.bankingSupervision.cybersecurity_oversight,
                    resolution_planning: this.state.bankingSupervision.resolution_planning_adequacy,
                    operational_risk: this.assessOperationalRiskManagement()
                },
                supervision_effectiveness: this.assessSupervisionEffectiveness(),
                regulatory_priorities: this.identifyRegulatoryPriorities()
            },
            
            payment_system_performance: {
                system_operations: {
                    fedwire_volume: this.state.paymentSystems.fedwire_daily_volume,
                    ach_volume: this.state.paymentSystems.ach_annual_volume,
                    system_availability: this.state.paymentSystems.payment_system_availability
                },
                modernization_progress: {
                    real_time_payments: this.state.paymentSystems.real_time_payment_adoption,
                    cross_border_efficiency: this.state.paymentSystems.cross_border_payment_efficiency,
                    innovation_support: this.state.paymentSystems.payment_innovation_support
                },
                security_resilience: {
                    cybersecurity: this.state.paymentSystems.cybersecurity_resilience,
                    operational_risk: this.state.paymentSystems.operational_risk_management,
                    business_continuity: this.assessBusinessContinuity()
                },
                system_efficiency_analysis: this.analyzePaymentSystemEfficiency(),
                modernization_roadmap: this.developPaymentModernizationRoadmap()
            },
            
            market_operations_summary: {
                operations_volume: {
                    open_market_ops: this.state.marketOperations.open_market_operations_volume,
                    repo_market_health: this.state.marketOperations.repo_market_functioning,
                    treasury_liquidity: this.state.marketOperations.treasury_market_liquidity
                },
                market_support: {
                    primary_dealers: this.state.marketOperations.primary_dealer_relationships,
                    market_maker_support: this.state.marketOperations.market_maker_support,
                    emergency_facilities: this.state.marketOperations.emergency_lending_facilities
                },
                crisis_response: {
                    lender_of_last_resort: this.state.marketOperations.lender_of_last_resort_capacity,
                    intervention_effectiveness: this.state.marketOperations.market_intervention_effectiveness,
                    liquidity_provision: this.assessLiquidityProvisionCapacity()
                },
                market_functioning_assessment: this.assessMarketFunctioning(),
                operational_effectiveness: this.assessMarketOperationsEffectiveness()
            },
            
            economic_analysis_insights: {
                forecasting_performance: {
                    economic_accuracy: this.state.economicResearch.economic_forecasting_accuracy,
                    inflation_accuracy: this.state.economicResearch.inflation_forecasting_accuracy,
                    gdp_accuracy: this.state.economicResearch.gdp_forecasting_accuracy,
                    unemployment_accuracy: this.state.economicResearch.unemployment_forecasting_accuracy
                },
                research_quality: {
                    stability_analysis: this.state.economicResearch.financial_stability_analysis_quality,
                    policy_assessment: this.state.economicResearch.policy_impact_assessment_capability,
                    publication_influence: this.state.economicResearch.research_publication_influence
                },
                data_capabilities: {
                    data_comprehensiveness: this.state.economicResearch.data_collection_comprehensiveness,
                    analytical_tools: this.assessAnalyticalCapabilities(),
                    research_infrastructure: this.assessResearchInfrastructure()
                },
                forecasting_improvement_areas: this.identifyForecastingImprovements(),
                research_priorities: this.identifyResearchPriorities()
            },
            
            crisis_management_readiness: {
                preparedness_metrics: {
                    preparedness_level: this.state.crisisManagement.crisis_preparedness_level,
                    response_capability: this.state.crisisManagement.emergency_response_capability,
                    liquidity_capacity: this.state.crisisManagement.liquidity_provision_capacity
                },
                planning_adequacy: {
                    stress_scenarios: this.state.crisisManagement.stress_scenario_planning,
                    recovery_planning: this.state.crisisManagement.recovery_planning_adequacy,
                    interagency_coordination: this.state.crisisManagement.interagency_coordination
                },
                crisis_learning: {
                    lessons_integration: this.state.crisisManagement.lessons_learned_integration,
                    communication_effectiveness: this.state.crisisManagement.crisis_communication_effectiveness,
                    adaptive_capacity: this.assessCrisisAdaptiveCapacity()
                },
                readiness_assessment: this.assessOverallCrisisReadiness(),
                preparedness_gaps: this.identifyPreparednessGaps()
            },
            
            central_bank_transparency: {
                communication_effectiveness: {
                    policy_clarity: this.state.transparencyCommunication.policy_communication_clarity,
                    forward_guidance: this.state.transparencyCommunication.forward_guidance_effectiveness,
                    expectation_anchoring: this.state.transparencyCommunication.market_expectation_anchoring
                },
                accountability_measures: {
                    public_accountability: this.state.transparencyCommunication.public_accountability_measures,
                    data_transparency: this.state.transparencyCommunication.data_transparency_level,
                    stakeholder_engagement: this.state.transparencyCommunication.stakeholder_engagement_quality
                },
                public_relations: {
                    media_effectiveness: this.state.transparencyCommunication.media_relations_effectiveness,
                    congressional_impact: this.state.transparencyCommunication.congressional_testimony_impact,
                    public_understanding: this.assessPublicUnderstanding()
                },
                transparency_assessment: this.assessOverallTransparency(),
                communication_improvement_opportunities: this.identifyCommunicationImprovements()
            }
        };
    }

    assessInflationTargetingSuccess() {
        const monetary = this.state.monetaryPolicy;
        const inflationGap = Math.abs(monetary.current_inflation_rate - monetary.inflation_target);
        
        return {
            target_achievement: inflationGap < 0.005 ? 'excellent' : 
                               inflationGap < 0.01 ? 'good' : 
                               inflationGap < 0.015 ? 'acceptable' : 'poor',
            inflation_gap: inflationGap,
            gap_direction: monetary.current_inflation_rate > monetary.inflation_target ? 'above_target' : 'below_target',
            targeting_credibility: this.calculateInflationTargetingCredibility()
        };
    }

    calculateInflationTargetingCredibility() {
        const monetary = this.state.monetaryPolicy;
        const transparency = this.state.transparencyCommunication;
        
        // Credibility based on targeting success and communication
        const targetingSuccess = 1 - Math.abs(monetary.current_inflation_rate - monetary.inflation_target) / 0.02;
        const communicationCredibility = transparency.forward_guidance_effectiveness;
        
        return Math.max(0, (targetingSuccess + communicationCredibility) / 2);
    }

    analyzePolicyStance() {
        const monetary = this.state.monetaryPolicy;
        
        return {
            current_stance: monetary.federal_funds_rate > 0.05 ? 'restrictive' : 
                           monetary.federal_funds_rate > 0.02 ? 'neutral' : 'accommodative',
            rate_level: monetary.federal_funds_rate,
            policy_tools: {
                conventional_tools: monetary.federal_funds_rate > 0.005 ? 'available' : 'limited',
                unconventional_tools: monetary.quantitative_easing_balance > 7000000000000 ? 'active' : 'available'
            },
            policy_space: this.assessPolicySpace(),
            stance_appropriateness: this.assessPolicyStanceAppropriateness()
        };
    }

    assessPolicySpace() {
        const monetary = this.state.monetaryPolicy;
        
        return {
            rate_cutting_space: monetary.federal_funds_rate,
            rate_hiking_space: 0.10 - monetary.federal_funds_rate,
            qe_expansion_capacity: 15000000000000 - monetary.quantitative_easing_balance,
            unconventional_tools_available: monetary.federal_funds_rate < 0.01 ? 'critical' : 'available'
        };
    }

    assessPolicyStanceAppropriateness() {
        const monetary = this.state.monetaryPolicy;
        const stability = this.state.financialStability;
        
        // Simplified assessment based on inflation and financial stability
        const inflationGap = monetary.current_inflation_rate - monetary.inflation_target;
        const stabilityRisk = stability.systemic_risk_index;
        
        if (inflationGap > 0.01 && monetary.federal_funds_rate < 0.04) {
            return 'too_accommodative';
        } else if (inflationGap < -0.01 && monetary.federal_funds_rate > 0.06) {
            return 'too_restrictive';
        } else if (stabilityRisk > 0.4 && monetary.federal_funds_rate < 0.03) {
            return 'stability_concerns';
        }
        
        return 'appropriate';
    }

    assessMonetaryPolicyEffectiveness() {
        const monetary = this.state.monetaryPolicy;
        
        return {
            transmission_effectiveness: monetary.policy_transmission_effectiveness,
            inflation_control: this.calculateInflationTargetingCredibility(),
            financial_conditions_impact: this.assessFinancialConditionsImpact(),
            economic_stimulus_effect: this.assessEconomicStimulusEffect(),
            overall_effectiveness: this.calculateMonetaryPolicyEffectiveness()
        };
    }

    assessFinancialConditionsImpact() {
        const monetary = this.state.monetaryPolicy;
        const market = this.state.marketOperations;
        
        // Impact on financial conditions through various channels
        return {
            interest_rate_channel: monetary.policy_transmission_effectiveness,
            credit_channel: market.repo_market_functioning,
            asset_price_channel: market.treasury_market_liquidity,
            exchange_rate_channel: this.state.currencyOperations.reserve_currency_status_strength
        };
    }

    assessEconomicStimulusEffect() {
        const monetary = this.state.monetaryPolicy;
        
        // Stimulus effect based on policy stance and tools
        const rateStimulus = monetary.federal_funds_rate < 0.02 ? 'high' : 
                           monetary.federal_funds_rate < 0.04 ? 'moderate' : 'low';
        const qeStimulus = monetary.quantitative_easing_balance > 8000000000000 ? 'active' : 'inactive';
        
        return {
            rate_stimulus: rateStimulus,
            quantitative_easing: qeStimulus,
            money_supply_growth: this.calculateMoneySupplyGrowth(),
            overall_stimulus: this.calculateOverallStimulus()
        };
    }

    calculateMoneySupplyGrowth() {
        // Simplified money supply growth calculation
        const monetary = this.state.monetaryPolicy;
        const baselineM2 = 20000000000000; // $20T baseline
        
        return (monetary.money_supply_m2 - baselineM2) / baselineM2;
    }

    calculateOverallStimulus() {
        const monetary = this.state.monetaryPolicy;
        
        const rateStimulus = Math.max(0, (0.05 - monetary.federal_funds_rate) / 0.05);
        const qeStimulus = Math.min(1.0, (monetary.quantitative_easing_balance - 5000000000000) / 10000000000000);
        
        return (rateStimulus + qeStimulus) / 2;
    }

    assessMacroprudentialMeasures() {
        const stability = this.state.financialStability;
        
        return {
            capital_requirements: stability.bank_capital_adequacy_ratio > 0.14 ? 'strong' : 'adequate',
            stress_testing: stability.stress_test_pass_rate > 0.9 ? 'rigorous' : 'standard',
            systemic_risk_monitoring: stability.counterparty_risk_monitoring > 0.8 ? 'comprehensive' : 'basic',
            policy_tools_deployment: stability.macroprudential_policy_effectiveness > 0.8 ? 'active' : 'moderate'
        };
    }

    assessSystemicRiskMitigation() {
        const stability = this.state.financialStability;
        
        return {
            risk_identification: stability.counterparty_risk_monitoring,
            risk_assessment: 1 - stability.systemic_risk_index,
            mitigation_effectiveness: stability.macroprudential_policy_effectiveness,
            institutional_resilience: stability.financial_institution_health,
            overall_mitigation: (stability.counterparty_risk_monitoring + 
                               (1 - stability.systemic_risk_index) + 
                               stability.macroprudential_policy_effectiveness + 
                               stability.financial_institution_health) / 4
        };
    }

    assessFinancialStabilityOutlook() {
        const stability = this.state.financialStability;
        
        const riskFactors = [
            stability.systemic_risk_index > 0.4,
            stability.asset_bubble_risk_assessment > 0.3,
            stability.credit_market_stability < 0.7,
            stability.financial_institution_health < 0.8
        ].filter(Boolean).length;
        
        return {
            outlook: riskFactors === 0 ? 'stable' : 
                    riskFactors <= 1 ? 'cautious' : 
                    riskFactors <= 2 ? 'concerned' : 'elevated_risk',
            risk_factors: riskFactors,
            stability_trend: this.calculateStabilityTrend(),
            key_vulnerabilities: this.identifyKeyVulnerabilities()
        };
    }

    calculateStabilityTrend() {
        const stability = this.state.financialStability;
        
        // Simplified trend calculation
        const positiveFactors = [
            stability.financial_institution_health > 0.85,
            stability.stress_test_pass_rate > 0.9,
            stability.systemic_risk_index < 0.3,
            stability.macroprudential_policy_effectiveness > 0.8
        ].filter(Boolean).length;
        
        if (positiveFactors >= 3) return 'improving';
        if (positiveFactors >= 2) return 'stable';
        return 'deteriorating';
    }

    identifyKeyVulnerabilities() {
        const vulnerabilities = [];
        const stability = this.state.financialStability;
        
        if (stability.asset_bubble_risk_assessment > 0.35) {
            vulnerabilities.push('asset_bubble_risk');
        }
        
        if (stability.credit_market_stability < 0.7) {
            vulnerabilities.push('credit_market_stress');
        }
        
        if (stability.systemic_risk_index > 0.4) {
            vulnerabilities.push('elevated_systemic_risk');
        }
        
        return vulnerabilities;
    }

    analyzeFinancialVulnerabilities() {
        const stability = this.state.financialStability;
        
        return {
            systemic_vulnerabilities: {
                interconnectedness_risk: stability.counterparty_risk_monitoring < 0.8 ? 'high' : 'moderate',
                concentration_risk: stability.systemic_risk_index > 0.4 ? 'elevated' : 'manageable',
                liquidity_risk: this.state.marketOperations.repo_market_functioning < 0.8 ? 'concerning' : 'stable'
            },
            institutional_vulnerabilities: {
                capital_adequacy: stability.bank_capital_adequacy_ratio < 0.12 ? 'weak' : 'strong',
                asset_quality: stability.financial_institution_health < 0.8 ? 'deteriorating' : 'stable',
                operational_resilience: this.assessInstitutionalOperationalResilience()
            },
            market_vulnerabilities: {
                asset_valuations: stability.asset_bubble_risk_assessment > 0.3 ? 'elevated' : 'reasonable',
                market_liquidity: this.state.marketOperations.treasury_market_liquidity < 0.8 ? 'tight' : 'adequate',
                volatility_risk: this.assessMarketVolatilityRisk()
            },
            vulnerability_mitigation: this.assessVulnerabilityMitigation()
        };
    }

    assessInstitutionalOperationalResilience() {
        const supervision = this.state.bankingSupervision;
        
        return {
            cybersecurity: supervision.cybersecurity_oversight,
            operational_risk: supervision.cybersecurity_oversight > 0.8 ? 'well_managed' : 'needs_attention',
            business_continuity: supervision.resolution_planning_adequacy
        };
    }

    assessMarketVolatilityRisk() {
        const market = this.state.marketOperations;
        const stability = this.state.financialStability;
        
        // Volatility risk based on market functioning and stability
        const marketStress = 1 - market.repo_market_functioning;
        const stabilityStress = stability.systemic_risk_index;
        
        const volatilityRisk = (marketStress + stabilityStress) / 2;
        
        return volatilityRisk > 0.4 ? 'high' : volatilityRisk > 0.25 ? 'moderate' : 'low';
    }

    assessVulnerabilityMitigation() {
        const stability = this.state.financialStability;
        const supervision = this.state.bankingSupervision;
        
        return {
            regulatory_tools: stability.macroprudential_policy_effectiveness,
            supervision_intensity: supervision.examination_coverage,
            crisis_preparedness: this.state.crisisManagement.crisis_preparedness_level,
            international_coordination: this.state.internationalCoordination.crisis_response_coordination,
            overall_mitigation_capacity: (stability.macroprudential_policy_effectiveness + 
                                        supervision.examination_coverage + 
                                        this.state.crisisManagement.crisis_preparedness_level + 
                                        this.state.internationalCoordination.crisis_response_coordination) / 4
        };
    }

    assessOperationalRiskManagement() {
        const supervision = this.state.bankingSupervision;
        const payments = this.state.paymentSystems;
        
        return {
            cybersecurity_oversight: supervision.cybersecurity_oversight,
            operational_resilience: payments.operational_risk_management,
            business_continuity: supervision.resolution_planning_adequacy,
            risk_assessment_quality: (supervision.cybersecurity_oversight + 
                                    payments.operational_risk_management + 
                                    supervision.resolution_planning_adequacy) / 3
        };
    }

    assessSupervisionEffectiveness() {
        const supervision = this.state.bankingSupervision;
        
        return {
            coverage_adequacy: supervision.examination_coverage,
            compliance_achievement: supervision.regulatory_compliance_rate,
            enforcement_impact: this.calculateEnforcementImpact(),
            consumer_protection: supervision.consumer_protection_effectiveness,
            overall_effectiveness: this.calculateBankingSupervisionQuality(),
            effectiveness_rating: this.calculateBankingSupervisionQuality() > 0.9 ? 'excellent' : 
                                 this.calculateBankingSupervisionQuality() > 0.8 ? 'good' : 'adequate'
        };
    }

    calculateEnforcementImpact() {
        const supervision = this.state.bankingSupervision;
        
        // Impact based on enforcement actions and compliance rate
        const enforcementRate = supervision.enforcement_actions / supervision.supervised_institutions;
        const complianceImprovement = supervision.regulatory_compliance_rate;
        
        return Math.min(1.0, enforcementRate * 10 + complianceImprovement) / 2;
    }

    identifyRegulatoryPriorities() {
        const priorities = [];
        const supervision = this.state.bankingSupervision;
        const stability = this.state.financialStability;
        
        if (supervision.cybersecurity_oversight < 0.85) {
            priorities.push({
                area: 'cybersecurity_enhancement',
                priority: 'high',
                rationale: 'Increasing cyber threats to financial institutions'
            });
        }
        
        if (stability.asset_bubble_risk_assessment > 0.3) {
            priorities.push({
                area: 'macroprudential_measures',
                priority: 'medium',
                rationale: 'Elevated asset bubble risk requires attention'
            });
        }
        
        if (supervision.consumer_protection_effectiveness < 0.85) {
            priorities.push({
                area: 'consumer_protection',
                priority: 'medium',
                rationale: 'Consumer protection needs strengthening'
            });
        }
        
        return priorities;
    }

    assessBusinessContinuity() {
        const payments = this.state.paymentSystems;
        
        return {
            system_availability: payments.payment_system_availability,
            resilience_level: payments.cybersecurity_resilience,
            operational_continuity: payments.operational_risk_management,
            recovery_capability: this.calculateRecoveryCapability(),
            continuity_rating: payments.payment_system_availability > 0.999 ? 'excellent' : 
                              payments.payment_system_availability > 0.995 ? 'good' : 'adequate'
        };
    }

    calculateRecoveryCapability() {
        const payments = this.state.paymentSystems;
        const crisis = this.state.crisisManagement;
        
        return (payments.operational_risk_management + 
                crisis.recovery_planning_adequacy) / 2;
    }

    analyzePaymentSystemEfficiency() {
        const payments = this.state.paymentSystems;
        
        return {
            processing_efficiency: {
                fedwire_performance: payments.payment_system_availability,
                ach_volume_handling: Math.min(1.0, payments.ach_annual_volume / 30000000000),
                real_time_capability: payments.real_time_payment_adoption
            },
            cost_efficiency: this.assessPaymentCostEfficiency(),
            innovation_adoption: {
                modernization_progress: payments.payment_innovation_support,
                cross_border_efficiency: payments.cross_border_payment_efficiency,
                technology_integration: this.assessPaymentTechnologyIntegration()
            },
            efficiency_benchmarking: this.benchmarkPaymentEfficiency(),
            improvement_opportunities: this.identifyPaymentImprovementOpportunities()
        };
    }

    assessPaymentCostEfficiency() {
        const payments = this.state.paymentSystems;
        
        // Cost efficiency based on system utilization and modernization
        const utilizationEfficiency = payments.payment_system_availability;
        const modernizationEfficiency = payments.real_time_payment_adoption;
        
        return (utilizationEfficiency + modernizationEfficiency) / 2;
    }

    assessPaymentTechnologyIntegration() {
        const payments = this.state.paymentSystems;
        const innovation = this.state.financialInnovation;
        
        return {
            real_time_systems: payments.real_time_payment_adoption,
            digital_integration: innovation.digital_currency_development,
            blockchain_readiness: innovation.blockchain_technology_assessment,
            fintech_collaboration: innovation.public_private_partnership_strength
        };
    }

    benchmarkPaymentEfficiency() {
        const efficiency = this.calculatePaymentSystemEfficiency();
        
        return {
            current_efficiency: efficiency,
            international_ranking: efficiency > 0.9 ? 'top_tier' : 
                                  efficiency > 0.8 ? 'competitive' : 'developing',
            efficiency_gaps: this.identifyEfficiencyGaps(),
            best_practice_adoption: this.assessBestPracticeAdoption()
        };
    }

    identifyEfficiencyGaps() {
        const gaps = [];
        const payments = this.state.paymentSystems;
        
        if (payments.real_time_payment_adoption < 0.8) {
            gaps.push('real_time_payment_coverage');
        }
        
        if (payments.cross_border_payment_efficiency < 0.8) {
            gaps.push('cross_border_payment_speed');
        }
        
        if (payments.payment_innovation_support < 0.8) {
            gaps.push('innovation_ecosystem_support');
        }
        
        return gaps;
    }

    assessBestPracticeAdoption() {
        const payments = this.state.paymentSystems;
        
        const bestPractices = [
            payments.payment_system_availability > 0.999,
            payments.real_time_payment_adoption > 0.8,
            payments.cybersecurity_resilience > 0.9,
            payments.cross_border_payment_efficiency > 0.8
        ].filter(Boolean).length;
        
        return bestPractices / 4;
    }

    identifyPaymentImprovementOpportunities() {
        const opportunities = [];
        const payments = this.state.paymentSystems;
        
        if (payments.real_time_payment_adoption < 0.8) {
            opportunities.push({
                area: 'real_time_payment_expansion',
                potential_impact: 'high',
                implementation_complexity: 'medium'
            });
        }
        
        if (payments.cross_border_payment_efficiency < 0.8) {
            opportunities.push({
                area: 'cross_border_payment_modernization',
                potential_impact: 'medium',
                implementation_complexity: 'high'
            });
        }
        
        return opportunities;
    }

    developPaymentModernizationRoadmap() {
        const payments = this.state.paymentSystems;
        
        return {
            short_term: this.identifyShortTermPaymentPriorities(),
            medium_term: this.identifyMediumTermPaymentGoals(),
            long_term: this.identifyLongTermPaymentVision(),
            investment_requirements: this.estimatePaymentInvestmentNeeds(),
            success_metrics: this.definePaymentSuccessMetrics()
        };
    }

    identifyShortTermPaymentPriorities() {
        const priorities = [];
        const payments = this.state.paymentSystems;
        
        if (payments.cybersecurity_resilience < 0.9) {
            priorities.push('cybersecurity_enhancement');
        }
        
        if (payments.real_time_payment_adoption < 0.8) {
            priorities.push('real_time_payment_expansion');
        }
        
        return priorities;
    }

    identifyMediumTermPaymentGoals() {
        return [
            'cross_border_payment_modernization',
            'digital_currency_integration',
            'fintech_ecosystem_development',
            'payment_data_analytics'
        ];
    }

    identifyLongTermPaymentVision() {
        return [
            'fully_digital_payment_ecosystem',
            'instant_global_payments',
            'ai_powered_payment_optimization',
            'quantum_secure_payment_infrastructure'
        ];
    }

    estimatePaymentInvestmentNeeds() {
        const payments = this.state.paymentSystems;
        
        return {
            infrastructure_modernization: 5000000000, // $5B
            cybersecurity_enhancement: 2000000000, // $2B
            innovation_support: 1000000000, // $1B
            international_connectivity: 1500000000, // $1.5B
            total_investment: 9500000000 // $9.5B
        };
    }

    definePaymentSuccessMetrics() {
        return {
            availability_target: 0.9999,
            real_time_adoption_target: 0.9,
            cross_border_efficiency_target: 0.85,
            cybersecurity_resilience_target: 0.95,
            innovation_support_target: 0.85
        };
    }

    assessLiquidityProvisionCapacity() {
        const market = this.state.marketOperations;
        const crisis = this.state.crisisManagement;
        
        return {
            normal_operations: market.open_market_operations_volume / 1000000000, // In billions
            emergency_capacity: crisis.liquidity_provision_capacity,
            lender_of_last_resort: market.lender_of_last_resort_capacity,
            facility_utilization: this.calculateFacilityUtilization(),
            capacity_adequacy: crisis.liquidity_provision_capacity > 0.9 ? 'adequate' : 'needs_enhancement'
        };
    }

    calculateFacilityUtilization() {
        const market = this.state.marketOperations;
        
        // Simplified utilization calculation
        return Math.min(1.0, market.emergency_lending_facilities / 10);
    }

    assessMarketFunctioning() {
        const market = this.state.marketOperations;
        
        return {
            repo_market_health: market.repo_market_functioning,
            treasury_market_liquidity: market.treasury_market_liquidity,
            primary_dealer_effectiveness: Math.min(1.0, market.primary_dealer_relationships / 25),
            market_maker_support: market.market_maker_support,
            overall_functioning: (market.repo_market_functioning + 
                                market.treasury_market_liquidity + 
                                market.market_maker_support) / 3,
            functioning_assessment: this.rateMarketFunctioning()
        };
    }

    rateMarketFunctioning() {
        const overallFunctioning = (this.state.marketOperations.repo_market_functioning + 
                                  this.state.marketOperations.treasury_market_liquidity + 
                                  this.state.marketOperations.market_maker_support) / 3;
        
        if (overallFunctioning > 0.9) return 'excellent';
        if (overallFunctioning > 0.8) return 'good';
        if (overallFunctioning > 0.7) return 'adequate';
        return 'impaired';
    }

    assessMarketOperationsEffectiveness() {
        const market = this.state.marketOperations;
        
        return {
            intervention_effectiveness: market.market_intervention_effectiveness,
            liquidity_management: this.assessLiquidityManagement(),
            crisis_response: market.lender_of_last_resort_capacity,
            operational_efficiency: this.calculateOperationalEfficiency(),
            effectiveness_rating: market.market_intervention_effectiveness > 0.85 ? 'highly_effective' : 
                                 market.market_intervention_effectiveness > 0.75 ? 'effective' : 'needs_improvement'
        };
    }

    assessLiquidityManagement() {
        const market = this.state.marketOperations;
        const monetary = this.state.monetaryPolicy;
        
        return {
            open_market_operations: Math.min(1.0, market.open_market_operations_volume / 150000000000),
            repo_operations: market.repo_market_functioning,
            quantitative_easing: Math.min(1.0, monetary.quantitative_easing_balance / 10000000000000),
            emergency_facilities: Math.min(1.0, market.emergency_lending_facilities / 10)
        };
    }

    calculateOperationalEfficiency() {
        const market = this.state.marketOperations;
        
        return (market.repo_market_functioning + 
                market.treasury_market_liquidity + 
                market.market_intervention_effectiveness) / 3;
    }

    assessAnalyticalCapabilities() {
        const research = this.state.economicResearch;
        
        return {
            forecasting_models: research.economic_forecasting_accuracy,
            stability_analysis: research.financial_stability_analysis_quality,
            policy_modeling: research.policy_impact_assessment_capability,
            data_analytics: research.data_collection_comprehensiveness,
            research_infrastructure: this.assessResearchInfrastructure()
        };
    }

    assessResearchInfrastructure() {
        const research = this.state.economicResearch;
        
        return {
            data_systems: research.data_collection_comprehensiveness,
            analytical_tools: research.economic_forecasting_accuracy,
            research_capacity: research.research_publication_influence,
            infrastructure_adequacy: (research.data_collection_comprehensiveness + 
                                    research.economic_forecasting_accuracy + 
                                    research.research_publication_influence) / 3
        };
    }

    identifyForecastingImprovements() {
        const improvements = [];
        const research = this.state.economicResearch;
        
        if (research.inflation_forecasting_accuracy < 0.75) {
            improvements.push({
                area: 'inflation_forecasting',
                current_accuracy: research.inflation_forecasting_accuracy,
                improvement_potential: 'high'
            });
        }
        
        if (research.gdp_forecasting_accuracy < 0.75) {
            improvements.push({
                area: 'gdp_forecasting',
                current_accuracy: research.gdp_forecasting_accuracy,
                improvement_potential: 'medium'
            });
        }
        
        if (research.economic_forecasting_accuracy < 0.8) {
            improvements.push({
                area: 'overall_forecasting_methodology',
                current_accuracy: research.economic_forecasting_accuracy,
                improvement_potential: 'high'
            });
        }
        
        return improvements;
    }

    identifyResearchPriorities() {
        const priorities = [];
        const research = this.state.economicResearch;
        const stability = this.state.financialStability;
        
        if (stability.systemic_risk_index > 0.35) {
            priorities.push({
                area: 'systemic_risk_analysis',
                priority: 'high',
                rationale: 'Elevated systemic risk requires enhanced analysis'
            });
        }
        
        if (research.policy_impact_assessment_capability < 0.8) {
            priorities.push({
                area: 'policy_impact_modeling',
                priority: 'medium',
                rationale: 'Better policy impact assessment needed'
            });
        }
        
        if (this.state.financialInnovation.digital_currency_development > 0.4) {
            priorities.push({
                area: 'digital_currency_research',
                priority: 'medium',
                rationale: 'Digital currency development requires research support'
            });
        }
        
        return priorities;
    }

    assessCrisisAdaptiveCapacity() {
        const crisis = this.state.crisisManagement;
        
        return {
            learning_capability: crisis.lessons_learned_integration,
            response_flexibility: crisis.emergency_response_capability,
            coordination_ability: crisis.interagency_coordination,
            innovation_capacity: this.state.financialInnovation.innovation_vs_stability_balance,
            overall_adaptability: (crisis.lessons_learned_integration + 
                                 crisis.emergency_response_capability + 
                                 crisis.interagency_coordination) / 3
        };
    }

    assessOverallCrisisReadiness() {
        const readiness = this.calculateCrisisManagementReadiness();
        
        return {
            readiness_level: readiness,
            readiness_rating: readiness > 0.9 ? 'excellent' : 
                            readiness > 0.8 ? 'good' : 
                            readiness > 0.7 ? 'adequate' : 'needs_improvement',
            key_strengths: this.identifyCrisisManagementStrengths(),
            improvement_areas: this.identifyCrisisManagementImprovements()
        };
    }

    identifyCrisisManagementStrengths() {
        const strengths = [];
        const crisis = this.state.crisisManagement;
        
        if (crisis.liquidity_provision_capacity > 0.95) {
            strengths.push('excellent_liquidity_provision');
        }
        
        if (crisis.emergency_response_capability > 0.9) {
            strengths.push('strong_emergency_response');
        }
        
        if (crisis.stress_scenario_planning > 0.85) {
            strengths.push('comprehensive_stress_testing');
        }
        
        return strengths;
    }

    identifyCrisisManagementImprovements() {
        const improvements = [];
        const crisis = this.state.crisisManagement;
        
        if (crisis.interagency_coordination < 0.85) {
            improvements.push({
                area: 'interagency_coordination',
                priority: 'high',
                current_level: crisis.interagency_coordination
            });
        }
        
        if (crisis.crisis_communication_effectiveness < 0.85) {
            improvements.push({
                area: 'crisis_communication',
                priority: 'medium',
                current_level: crisis.crisis_communication_effectiveness
            });
        }
        
        return improvements;
    }

    identifyPreparednessGaps() {
        const gaps = [];
        const crisis = this.state.crisisManagement;
        
        if (crisis.recovery_planning_adequacy < 0.9) {
            gaps.push({
                gap: 'recovery_planning',
                severity: 0.9 - crisis.recovery_planning_adequacy,
                priority: 'high'
            });
        }
        
        if (crisis.lessons_learned_integration < 0.8) {
            gaps.push({
                gap: 'lessons_learned_integration',
                severity: 0.8 - crisis.lessons_learned_integration,
                priority: 'medium'
            });
        }
        
        return gaps;
    }

    assessPublicUnderstanding() {
        const transparency = this.state.transparencyCommunication;
        
        return {
            policy_comprehension: transparency.policy_communication_clarity,
            expectation_alignment: transparency.market_expectation_anchoring,
            trust_level: this.calculatePublicTrust(),
            communication_effectiveness: transparency.forward_guidance_effectiveness,
            understanding_assessment: transparency.policy_communication_clarity > 0.8 ? 'good' : 
                                    transparency.policy_communication_clarity > 0.7 ? 'adequate' : 'needs_improvement'
        };
    }

    calculatePublicTrust() {
        const transparency = this.state.transparencyCommunication;
        const monetary = this.state.monetaryPolicy;
        
        // Trust based on transparency and policy credibility
        const transparencyScore = (transparency.policy_communication_clarity + 
                                 transparency.public_accountability_measures + 
                                 transparency.data_transparency_level) / 3;
        
        const credibilityScore = this.calculateInflationTargetingCredibility();
        
        return (transparencyScore + credibilityScore) / 2;
    }

    assessOverallTransparency() {
        const transparency = this.state.transparencyCommunication;
        
        const transparencyScore = (transparency.policy_communication_clarity + 
                                 transparency.data_transparency_level + 
                                 transparency.public_accountability_measures + 
                                 transparency.stakeholder_engagement_quality) / 4;
        
        return {
            transparency_level: transparencyScore,
            transparency_rating: transparencyScore > 0.85 ? 'highly_transparent' : 
                               transparencyScore > 0.75 ? 'transparent' : 'needs_improvement',
            communication_channels: this.assessCommunicationChannels(),
            transparency_impact: this.assessTransparencyImpact()
        };
    }

    assessCommunicationChannels() {
        const transparency = this.state.transparencyCommunication;
        
        return {
            forward_guidance: transparency.forward_guidance_effectiveness,
            media_relations: transparency.media_relations_effectiveness,
            congressional_testimony: transparency.congressional_testimony_impact,
            stakeholder_engagement: transparency.stakeholder_engagement_quality,
            channel_effectiveness: (transparency.forward_guidance_effectiveness + 
                                  transparency.media_relations_effectiveness + 
                                  transparency.congressional_testimony_impact + 
                                  transparency.stakeholder_engagement_quality) / 4
        };
    }

    assessTransparencyImpact() {
        const transparency = this.state.transparencyCommunication;
        const monetary = this.state.monetaryPolicy;
        
        return {
            market_expectation_anchoring: transparency.market_expectation_anchoring,
            policy_transmission_enhancement: monetary.policy_transmission_effectiveness,
            public_accountability: transparency.public_accountability_measures,
            credibility_building: this.calculateInflationTargetingCredibility(),
            overall_impact: (transparency.market_expectation_anchoring + 
                           monetary.policy_transmission_effectiveness + 
                           transparency.public_accountability_measures) / 3
        };
    }

    identifyCommunicationImprovements() {
        const improvements = [];
        const transparency = this.state.transparencyCommunication;
        
        if (transparency.policy_communication_clarity < 0.85) {
            improvements.push({
                area: 'policy_communication_clarity',
                current_level: transparency.policy_communication_clarity,
                improvement_potential: 'high'
            });
        }
        
        if (transparency.media_relations_effectiveness < 0.8) {
            improvements.push({
                area: 'media_relations',
                current_level: transparency.media_relations_effectiveness,
                improvement_potential: 'medium'
            });
        }
        
        if (transparency.stakeholder_engagement_quality < 0.8) {
            improvements.push({
                area: 'stakeholder_engagement',
                current_level: transparency.stakeholder_engagement_quality,
                improvement_potential: 'medium'
            });
        }
        
        return improvements;
    }

    generateFallbackOutputs() {
        return {
            monetary_policy_status: {
                interest_rates: {
                    federal_funds_rate: 0.0525,
                    discount_rate: 0.0575
                },
                inflation_management: { targeting_success: { target_achievement: 'good' } }
            },
            financial_stability_assessment: {
                stability_indicators: {
                    systemic_risk_index: 0.35,
                    bank_capital_adequacy: 0.145
                },
                stability_outlook: { outlook: 'stable' }
            },
            banking_supervision_report: {
                supervision_coverage: { examination_coverage: 0.88 },
                supervision_effectiveness: { effectiveness_rating: 'good' }
            },
            payment_system_performance: {
                system_operations: { system_availability: 0.9995 },
                system_efficiency_analysis: { efficiency_benchmarking: { international_ranking: 'competitive' } }
            },
            market_operations_summary: {
                operations_volume: { open_market_ops: 120000000000 },
                market_functioning_assessment: { functioning_assessment: 'good' }
            },
            economic_analysis_insights: {
                forecasting_performance: { economic_accuracy: 0.73 },
                research_quality: { stability_analysis: 0.85 }
            },
            crisis_management_readiness: {
                preparedness_metrics: { preparedness_level: 0.88 },
                readiness_assessment: { readiness_rating: 'good' }
            },
            central_bank_transparency: {
                communication_effectiveness: { policy_clarity: 0.78 },
                transparency_assessment: { transparency_rating: 'transparent' }
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            overallEffectiveness: this.state.performanceMetrics.overall_central_bank_effectiveness,
            monetaryPolicySuccess: this.state.performanceMetrics.monetary_policy_success,
            financialStability: this.state.performanceMetrics.financial_stability_maintenance,
            federalFundsRate: this.state.monetaryPolicy.federal_funds_rate,
            inflationRate: this.state.monetaryPolicy.current_inflation_rate,
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.monetaryPolicy.federal_funds_rate = 0.0525;
        this.state.monetaryPolicy.current_inflation_rate = 0.031;
        this.state.performanceMetrics.overall_central_bank_effectiveness = 0.83;
        console.log('🏦 Central Bank System reset');
    }
}

module.exports = { CentralBankSystem };
