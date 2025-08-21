// Migration System - Handles both internal and inter-civilization population movement
// Input knobs for AI control, structured outputs for AI and game consumption

const DeterministicSystemInterface = require('../deterministic-system-interface.cjs');

class MigrationSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('MigrationSystem');
        
        // Core migration state
        this.migrationState = {
            // Internal migration (within civilization)
            internalMigration: {
                ruralToUrban: { rate: 0.02, volume: 0, factors: new Map() },
                urbanToRural: { rate: 0.005, volume: 0, factors: new Map() },
                interRegional: { rate: 0.015, volume: 0, factors: new Map() },
                seasonalMigration: { rate: 0.01, volume: 0, factors: new Map() }
            },
            
            // Inter-civilization migration
            interCivMigration: {
                immigration: { rate: 0.003, volume: 0, applications: new Map() },
                emigration: { rate: 0.002, volume: 0, destinations: new Map() },
                refugees: { rate: 0.001, volume: 0, crises: new Map() },
                skillMigration: { rate: 0.004, volume: 0, sectors: new Map() }
            },
            
            // Migration infrastructure
            infrastructure: {
                transportCapacity: 100000,
                processingCenters: 50,
                integrationPrograms: 25,
                borderSecurity: 0.7
            },
            
            // Population tracking
            demographics: {
                totalPopulation: config.initialPopulation || 1000000,
                migrantPopulation: 0,
                nativeBornPopulation: 0,
                temporaryResidents: 0
            },
            
            // Economic impacts
            economicEffects: {
                laborMarketImpact: 0,
                skillGaps: new Map(),
                wageEffects: new Map(),
                fiscalImpact: 0
            },
            
            lastUpdate: Date.now()
        };

        // Define AI-adjustable input knobs
        this.addInputKnob('immigration_policy_openness', 'float', 0.5, 'Openness of immigration policies (0-1)', 0, 1);
        this.addInputKnob('internal_mobility_support', 'float', 0.6, 'Support for internal population mobility (0-1)', 0, 1);
        this.addInputKnob('refugee_acceptance_rate', 'float', 0.4, 'Rate of refugee acceptance (0-1)', 0, 1);
        this.addInputKnob('skilled_migration_incentives', 'float', 0.7, 'Incentives for skilled migration (0-1)', 0, 1);
        this.addInputKnob('border_security_level', 'float', 0.7, 'Level of border security enforcement (0-1)', 0, 1);
        this.addInputKnob('integration_program_funding', 'float', 0.5, 'Funding for migrant integration programs (0-1)', 0, 1);
        this.addInputKnob('regional_development_investment', 'float', 0.4, 'Investment in regional development to reduce migration pressure (0-1)', 0, 1);
        this.addInputKnob('migration_processing_efficiency', 'float', 0.6, 'Efficiency of migration application processing (0-1)', 0, 1);
        this.addInputKnob('temporary_worker_programs', 'float', 0.3, 'Scale of temporary worker programs (0-1)', 0, 1);
        this.addInputKnob('return_migration_incentives', 'float', 0.2, 'Incentives for return migration (0-1)', 0, 1);
        this.addInputKnob('urban_development_policy', 'float', 0.5, 'Urban development to manage internal migration (0-1)', 0, 1);
        this.addInputKnob('diplomatic_migration_agreements', 'int', 3, 'Number of bilateral migration agreements', 0, 15);

        // Define structured output channels
        this.addOutputChannel('total_migration_volume', 'float', 'Total volume of all migration types');
        this.addOutputChannel('internal_migration_patterns', 'map', 'Patterns of internal population movement');
        this.addOutputChannel('inter_civ_migration_balance', 'float', 'Net migration balance with other civilizations');
        this.addOutputChannel('migrant_integration_success_rate', 'float', 'Success rate of migrant integration (0-1)');
        this.addOutputChannel('labor_market_impact', 'map', 'Impact of migration on different labor sectors');
        this.addOutputChannel('demographic_changes', 'map', 'Changes in population demographics due to migration');
        this.addOutputChannel('migration_pressure_indicators', 'array', 'Indicators of migration pressure in different regions');
        this.addOutputChannel('border_security_effectiveness', 'float', 'Effectiveness of border security measures (0-1)');
        this.addOutputChannel('refugee_crisis_response', 'map', 'Response capacity to refugee crises');
        this.addOutputChannel('skill_migration_gaps', 'array', 'Skills gaps filled or created by migration');
        this.addOutputChannel('migration_infrastructure_capacity', 'float', 'Current capacity utilization of migration infrastructure (0-1)');
        this.addOutputChannel('cultural_diversity_index', 'float', 'Index of cultural diversity due to migration (0-1)');

        console.log('🚶 Migration System initialized with internal and inter-civ capabilities');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Apply AI inputs to system parameters
            this.applyAIInputs(aiInputs);
            
            // Process internal migration
            this.processInternalMigration(gameState);
            
            // Process inter-civilization migration
            this.processInterCivMigration(gameState);
            
            // Update migration infrastructure
            this.updateMigrationInfrastructure();
            
            // Calculate economic impacts
            this.calculateEconomicImpacts(gameState);
            
            // Update demographics
            this.updateDemographics();
            
            // Process integration programs
            this.processIntegrationPrograms();
            
            // Generate structured outputs
            const outputs = this.generateOutputs();
            
            this.migrationState.lastUpdate = Date.now();
            
            return {
                success: true,
                outputs: outputs,
                systemState: this.getSystemSnapshot(),
                recommendations: this.generateMigrationRecommendations(gameState, aiInputs)
            };
            
        } catch (error) {
            console.error('🚶 Migration System processing error:', error);
            return {
                success: false,
                error: error.message,
                outputs: this.generateOutputs()
            };
        }
    }

    applyAIInputs(aiInputs) {
        // Apply immigration policy settings
        this.immigrationOpenness = aiInputs.immigration_policy_openness || 0.5;
        this.internalMobilitySupport = aiInputs.internal_mobility_support || 0.6;
        this.refugeeAcceptanceRate = aiInputs.refugee_acceptance_rate || 0.4;
        this.skilledMigrationIncentives = aiInputs.skilled_migration_incentives || 0.7;
        
        // Apply security and processing settings
        this.borderSecurityLevel = aiInputs.border_security_level || 0.7;
        this.migrationState.infrastructure.borderSecurity = this.borderSecurityLevel;
        this.processingEfficiency = aiInputs.migration_processing_efficiency || 0.6;
        
        // Apply program funding and development
        this.integrationFunding = aiInputs.integration_program_funding || 0.5;
        this.regionalDevelopment = aiInputs.regional_development_investment || 0.4;
        this.temporaryWorkerPrograms = aiInputs.temporary_worker_programs || 0.3;
        this.returnMigrationIncentives = aiInputs.return_migration_incentives || 0.2;
        this.urbanDevelopmentPolicy = aiInputs.urban_development_policy || 0.5;
        this.migrationAgreements = aiInputs.diplomatic_migration_agreements || 3;
    }

    processInternalMigration(gameState) {
        const internal = this.migrationState.internalMigration;
        
        // Process rural to urban migration
        this.processRuralToUrbanMigration(internal.ruralToUrban, gameState);
        
        // Process urban to rural migration
        this.processUrbanToRuralMigration(internal.urbanToRural, gameState);
        
        // Process inter-regional migration
        this.processInterRegionalMigration(internal.interRegional, gameState);
        
        // Process seasonal migration
        this.processSeasonalMigration(internal.seasonalMigration, gameState);
    }

    processRuralToUrbanMigration(migrationData, gameState) {
        // Base migration rate affected by various factors
        let effectiveRate = migrationData.rate;
        
        // Economic opportunities in cities increase migration
        const urbanEconomicOpportunities = this.getUrbanEconomicScore(gameState);
        effectiveRate *= (1 + urbanEconomicOpportunities * 0.5);
        
        // Rural development investment reduces migration pressure
        effectiveRate *= (1 - this.regionalDevelopment * 0.3);
        
        // Urban development policy affects capacity
        const urbanCapacity = this.urbanDevelopmentPolicy;
        effectiveRate *= (0.5 + urbanCapacity * 0.5);
        
        // Internal mobility support facilitates migration
        effectiveRate *= (1 + this.internalMobilitySupport * 0.2);
        
        // Calculate migration volume
        const ruralPopulation = this.getRuralPopulation(gameState);
        migrationData.volume = ruralPopulation * effectiveRate;
        
        // Update migration factors
        migrationData.factors.set('economic_opportunities', urbanEconomicOpportunities);
        migrationData.factors.set('rural_development', this.regionalDevelopment);
        migrationData.factors.set('urban_capacity', urbanCapacity);
        migrationData.factors.set('mobility_support', this.internalMobilitySupport);
    }

    processUrbanToRuralMigration(migrationData, gameState) {
        // Base migration rate (typically lower than rural to urban)
        let effectiveRate = migrationData.rate;
        
        // Rural development investment increases attractiveness
        effectiveRate *= (1 + this.regionalDevelopment * 0.4);
        
        // Urban overcrowding increases outmigration
        const urbanCrowding = this.getUrbanCrowdingScore(gameState);
        effectiveRate *= (1 + urbanCrowding * 0.3);
        
        // Return migration incentives
        effectiveRate *= (1 + this.returnMigrationIncentives * 0.6);
        
        // Calculate migration volume
        const urbanPopulation = this.getUrbanPopulation(gameState);
        migrationData.volume = urbanPopulation * effectiveRate;
        
        // Update migration factors
        migrationData.factors.set('rural_development', this.regionalDevelopment);
        migrationData.factors.set('urban_crowding', urbanCrowding);
        migrationData.factors.set('return_incentives', this.returnMigrationIncentives);
    }

    processInterRegionalMigration(migrationData, gameState) {
        // Base inter-regional migration rate
        let effectiveRate = migrationData.rate;
        
        // Regional economic disparities drive migration
        const regionalDisparities = this.getRegionalEconomicDisparities(gameState);
        effectiveRate *= (1 + regionalDisparities * 0.4);
        
        // Regional development reduces disparities
        effectiveRate *= (1 - this.regionalDevelopment * 0.2);
        
        // Mobility support facilitates movement
        effectiveRate *= (1 + this.internalMobilitySupport * 0.3);
        
        // Calculate migration volume
        const totalPopulation = this.migrationState.demographics.totalPopulation;
        migrationData.volume = totalPopulation * effectiveRate;
        
        // Update migration factors
        migrationData.factors.set('regional_disparities', regionalDisparities);
        migrationData.factors.set('development_investment', this.regionalDevelopment);
        migrationData.factors.set('mobility_support', this.internalMobilitySupport);
    }

    processSeasonalMigration(migrationData, gameState) {
        // Seasonal migration for work (agriculture, tourism, etc.)
        let effectiveRate = migrationData.rate;
        
        // Temporary worker programs facilitate seasonal migration
        effectiveRate *= (1 + this.temporaryWorkerPrograms * 0.5);
        
        // Economic seasonality affects demand
        const seasonalDemand = this.getSeasonalLaborDemand(gameState);
        effectiveRate *= (1 + seasonalDemand * 0.3);
        
        // Mobility support affects ease of movement
        effectiveRate *= (1 + this.internalMobilitySupport * 0.2);
        
        // Calculate migration volume
        const workingPopulation = this.getWorkingPopulation(gameState);
        migrationData.volume = workingPopulation * effectiveRate;
        
        // Update migration factors
        migrationData.factors.set('temporary_programs', this.temporaryWorkerPrograms);
        migrationData.factors.set('seasonal_demand', seasonalDemand);
        migrationData.factors.set('mobility_support', this.internalMobilitySupport);
    }

    processInterCivMigration(gameState) {
        const interCiv = this.migrationState.interCivMigration;
        
        // Process immigration
        this.processImmigration(interCiv.immigration, gameState);
        
        // Process emigration
        this.processEmigration(interCiv.emigration, gameState);
        
        // Process refugee flows
        this.processRefugeeFlows(interCiv.refugees, gameState);
        
        // Process skilled migration
        this.processSkilledMigration(interCiv.skillMigration, gameState);
    }

    processImmigration(immigrationData, gameState) {
        // Base immigration rate affected by policy openness
        let effectiveRate = immigrationData.rate * this.immigrationOpenness;
        
        // Economic attractiveness increases immigration
        const economicAttractiveness = this.getEconomicAttractiveness(gameState);
        effectiveRate *= (1 + economicAttractiveness * 0.6);
        
        // Border security affects actual immigration
        const securityEffect = 1 - (this.borderSecurityLevel * 0.3);
        effectiveRate *= securityEffect;
        
        // Processing efficiency affects application success
        effectiveRate *= (0.5 + this.processingEfficiency * 0.5);
        
        // Migration agreements facilitate immigration
        const agreementBonus = Math.min(this.migrationAgreements / 10, 0.3);
        effectiveRate *= (1 + agreementBonus);
        
        // Calculate immigration volume
        const globalMigrantPool = this.getGlobalMigrantPool(gameState);
        immigrationData.volume = globalMigrantPool * effectiveRate;
        
        // Update applications by source
        this.updateImmigrationApplications(immigrationData, gameState);
    }

    processEmigration(emigrationData, gameState) {
        // Base emigration rate
        let effectiveRate = emigrationData.rate;
        
        // Economic conditions affect emigration desire
        const economicPushFactors = this.getEconomicPushFactors(gameState);
        effectiveRate *= (1 + economicPushFactors * 0.4);
        
        // Immigration openness of other civilizations affects opportunities
        const externalOpportunities = this.getExternalOpportunities(gameState);
        effectiveRate *= (1 + externalOpportunities * 0.3);
        
        // Return migration incentives reduce emigration
        effectiveRate *= (1 - this.returnMigrationIncentives * 0.2);
        
        // Calculate emigration volume
        const totalPopulation = this.migrationState.demographics.totalPopulation;
        emigrationData.volume = totalPopulation * effectiveRate;
        
        // Update destinations
        this.updateEmigrationDestinations(emigrationData, gameState);
    }

    processRefugeeFlows(refugeeData, gameState) {
        // Base refugee rate affected by global crises
        const globalCrises = this.getGlobalCrises(gameState);
        let effectiveRate = refugeeData.rate * (1 + globalCrises * 2);
        
        // Refugee acceptance rate affects actual intake
        effectiveRate *= this.refugeeAcceptanceRate;
        
        // Border security affects refugee flows
        const securityEffect = 1 - (this.borderSecurityLevel * 0.2); // Less impact on refugees
        effectiveRate *= securityEffect;
        
        // International pressure and agreements
        const internationalPressure = this.getInternationalPressure(gameState);
        effectiveRate *= (1 + internationalPressure * 0.3);
        
        // Calculate refugee volume
        const globalRefugeePool = this.getGlobalRefugeePool(gameState);
        refugeeData.volume = globalRefugeePool * effectiveRate;
        
        // Update crisis tracking
        this.updateRefugeeCrises(refugeeData, gameState);
    }

    processSkilledMigration(skillMigrationData, gameState) {
        // Base skilled migration rate
        let effectiveRate = skillMigrationData.rate;
        
        // Skilled migration incentives
        effectiveRate *= (1 + this.skilledMigrationIncentives * 0.8);
        
        // Economic opportunities for skilled workers
        const skilledDemand = this.getSkilledLaborDemand(gameState);
        effectiveRate *= (1 + skilledDemand * 0.6);
        
        // Processing efficiency for skilled migrants (usually higher)
        const skilledProcessingBonus = this.processingEfficiency * 1.2;
        effectiveRate *= (0.5 + skilledProcessingBonus * 0.5);
        
        // Calculate skilled migration volume
        const globalSkilledPool = this.getGlobalSkilledPool(gameState);
        skillMigrationData.volume = globalSkilledPool * effectiveRate;
        
        // Update sectors
        this.updateSkilledMigrationSectors(skillMigrationData, gameState);
    }

    updateMigrationInfrastructure() {
        const infrastructure = this.migrationState.infrastructure;
        
        // Update transport capacity based on internal mobility support
        infrastructure.transportCapacity = Math.floor(
            100000 * (1 + this.internalMobilitySupport * 0.5)
        );
        
        // Update processing centers based on efficiency investment
        infrastructure.processingCenters = Math.floor(
            50 * (1 + this.processingEfficiency * 0.8)
        );
        
        // Update integration programs based on funding
        infrastructure.integrationPrograms = Math.floor(
            25 * (1 + this.integrationFunding * 1.2)
        );
        
        // Border security already updated in applyAIInputs
    }

    calculateEconomicImpacts(gameState) {
        const effects = this.migrationState.economicEffects;
        
        // Calculate labor market impact
        const totalMigration = this.getTotalMigrationVolume();
        effects.laborMarketImpact = this.calculateLaborMarketImpact(totalMigration, gameState);
        
        // Update skill gaps
        this.updateSkillGaps(effects.skillGaps, gameState);
        
        // Calculate wage effects
        this.calculateWageEffects(effects.wageEffects, totalMigration, gameState);
        
        // Calculate fiscal impact
        effects.fiscalImpact = this.calculateFiscalImpact(totalMigration, gameState);
    }

    updateDemographics() {
        const demographics = this.migrationState.demographics;
        const interCiv = this.migrationState.interCivMigration;
        
        // Update migrant population
        const netInterCivMigration = 
            interCiv.immigration.volume + interCiv.refugees.volume + interCiv.skillMigration.volume - 
            interCiv.emigration.volume;
        
        demographics.migrantPopulation += netInterCivMigration;
        demographics.migrantPopulation = Math.max(0, demographics.migrantPopulation);
        
        // Update total population
        demographics.totalPopulation += netInterCivMigration;
        
        // Update native-born population (grows naturally, affected by emigration)
        demographics.nativeBornPopulation = demographics.totalPopulation - demographics.migrantPopulation;
        
        // Update temporary residents
        demographics.temporaryResidents = this.temporaryWorkerPrograms * 10000; // Simplified
    }

    processIntegrationPrograms() {
        // Integration success depends on funding and program quality
        const baseSuccessRate = 0.6;
        const fundingBonus = this.integrationFunding * 0.3;
        const programCapacity = this.migrationState.infrastructure.integrationPrograms / 25; // Normalized
        
        this.integrationSuccessRate = Math.min(1, baseSuccessRate + fundingBonus * programCapacity);
    }

    generateOutputs() {
        // Calculate total migration volume
        const totalMigrationVolume = this.getTotalMigrationVolume();
        
        // Calculate internal migration patterns
        const internalPatterns = this.getInternalMigrationPatterns();
        
        // Calculate inter-civ migration balance
        const interCivBalance = this.getInterCivMigrationBalance();
        
        // Calculate labor market impact by sector
        const laborMarketImpact = this.getLaborMarketImpactBySector();
        
        // Calculate demographic changes
        const demographicChanges = this.getDemographicChanges();
        
        // Identify migration pressure indicators
        const pressureIndicators = this.getMigrationPressureIndicators();
        
        // Calculate border security effectiveness
        const borderEffectiveness = this.getBorderSecurityEffectiveness();
        
        // Get refugee crisis response capacity
        const refugeeResponse = this.getRefugeeCrisisResponse();
        
        // Identify skill migration gaps
        const skillGaps = this.getSkillMigrationGaps();
        
        // Calculate infrastructure capacity utilization
        const infrastructureCapacity = this.getInfrastructureCapacityUtilization();
        
        // Calculate cultural diversity index
        const culturalDiversity = this.getCulturalDiversityIndex();
        
        return {
            total_migration_volume: totalMigrationVolume,
            internal_migration_patterns: internalPatterns,
            inter_civ_migration_balance: interCivBalance,
            migrant_integration_success_rate: this.integrationSuccessRate || 0.6,
            labor_market_impact: laborMarketImpact,
            demographic_changes: demographicChanges,
            migration_pressure_indicators: pressureIndicators,
            border_security_effectiveness: borderEffectiveness,
            refugee_crisis_response: refugeeResponse,
            skill_migration_gaps: skillGaps,
            migration_infrastructure_capacity: infrastructureCapacity,
            cultural_diversity_index: culturalDiversity
        };
    }

    generateMigrationRecommendations(gameState, aiInputs) {
        const recommendations = [];
        
        // Infrastructure capacity recommendations
        const capacityUtilization = this.getInfrastructureCapacityUtilization();
        if (capacityUtilization > 0.9) {
            recommendations.push({
                type: 'infrastructure',
                priority: 'high',
                message: 'Migration infrastructure is at capacity. Consider increasing processing efficiency or expanding facilities.',
                suggestedAction: 'increase_migration_processing_efficiency'
            });
        }
        
        // Integration success recommendations
        if ((this.integrationSuccessRate || 0.6) < 0.5) {
            recommendations.push({
                type: 'integration',
                priority: 'medium',
                message: 'Migrant integration success rate is low. Consider increasing program funding.',
                suggestedAction: 'increase_integration_program_funding'
            });
        }
        
        // Regional development recommendations
        const internalMigrationPressure = this.getInternalMigrationPressure();
        if (internalMigrationPressure > 0.7) {
            recommendations.push({
                type: 'regional_development',
                priority: 'medium',
                message: 'High internal migration pressure detected. Consider increasing regional development investment.',
                suggestedAction: 'increase_regional_development_investment'
            });
        }
        
        // Skilled migration recommendations
        const skillGaps = this.getSkillMigrationGaps();
        if (skillGaps.length > 5) {
            recommendations.push({
                type: 'skilled_migration',
                priority: 'medium',
                message: 'Multiple skill gaps detected. Consider increasing skilled migration incentives.',
                suggestedAction: 'increase_skilled_migration_incentives'
            });
        }
        
        return recommendations;
    }

    // Helper calculation methods
    getTotalMigrationVolume() {
        const internal = this.migrationState.internalMigration;
        const interCiv = this.migrationState.interCivMigration;
        
        return internal.ruralToUrban.volume + internal.urbanToRural.volume + 
               internal.interRegional.volume + internal.seasonalMigration.volume +
               interCiv.immigration.volume + interCiv.emigration.volume + 
               interCiv.refugees.volume + interCiv.skillMigration.volume;
    }

    getInternalMigrationPatterns() {
        const internal = this.migrationState.internalMigration;
        return new Map([
            ['rural_to_urban', { volume: internal.ruralToUrban.volume, rate: internal.ruralToUrban.rate }],
            ['urban_to_rural', { volume: internal.urbanToRural.volume, rate: internal.urbanToRural.rate }],
            ['inter_regional', { volume: internal.interRegional.volume, rate: internal.interRegional.rate }],
            ['seasonal', { volume: internal.seasonalMigration.volume, rate: internal.seasonalMigration.rate }]
        ]);
    }

    getInterCivMigrationBalance() {
        const interCiv = this.migrationState.interCivMigration;
        const inflow = interCiv.immigration.volume + interCiv.refugees.volume + interCiv.skillMigration.volume;
        const outflow = interCiv.emigration.volume;
        return inflow - outflow;
    }

    getLaborMarketImpactBySector() {
        const sectors = ['agriculture', 'manufacturing', 'services', 'technology', 'healthcare'];
        const impact = new Map();
        
        for (const sector of sectors) {
            impact.set(sector, {
                migrantParticipation: Math.random() * 0.3, // Simplified
                wageImpact: (Math.random() - 0.5) * 0.1,
                jobCompetition: Math.random() * 0.2
            });
        }
        
        return impact;
    }

    getDemographicChanges() {
        const demographics = this.migrationState.demographics;
        return new Map([
            ['total_population', demographics.totalPopulation],
            ['migrant_population', demographics.migrantPopulation],
            ['native_born_population', demographics.nativeBornPopulation],
            ['temporary_residents', demographics.temporaryResidents],
            ['migrant_percentage', demographics.migrantPopulation / demographics.totalPopulation]
        ]);
    }

    getMigrationPressureIndicators() {
        return [
            {
                region: 'rural_areas',
                pressure: this.getInternalMigrationPressure(),
                factors: ['economic_opportunities', 'infrastructure_development']
            },
            {
                region: 'urban_centers',
                pressure: this.getUrbanCrowdingScore(),
                factors: ['housing_availability', 'job_market_saturation']
            },
            {
                region: 'border_regions',
                pressure: this.getBorderMigrationPressure(),
                factors: ['cross_border_economic_disparities', 'security_situation']
            }
        ];
    }

    getBorderSecurityEffectiveness() {
        // Effectiveness based on security level and actual migration control
        const baseEffectiveness = this.borderSecurityLevel;
        const migrationVolume = this.migrationState.interCivMigration.immigration.volume;
        const capacityStrain = Math.min(migrationVolume / 50000, 1); // Normalized strain
        
        return Math.max(0.1, baseEffectiveness * (1 - capacityStrain * 0.3));
    }

    getRefugeeCrisisResponse() {
        const refugeeVolume = this.migrationState.interCivMigration.refugees.volume;
        const responseCapacity = this.refugeeAcceptanceRate * 100000; // Simplified capacity
        
        return new Map([
            ['current_refugees', refugeeVolume],
            ['response_capacity', responseCapacity],
            ['capacity_utilization', Math.min(refugeeVolume / responseCapacity, 1)],
            ['integration_programs', this.migrationState.infrastructure.integrationPrograms]
        ]);
    }

    getSkillMigrationGaps() {
        const sectors = ['technology', 'healthcare', 'engineering', 'finance', 'education'];
        const gaps = [];
        
        for (const sector of sectors) {
            if (Math.random() > 0.6) { // 40% chance of gap
                gaps.push({
                    sector: sector,
                    severity: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
                    migrant_contribution: Math.random() * 0.5,
                    recommendation: 'increase_skilled_migration_incentives'
                });
            }
        }
        
        return gaps;
    }

    getInfrastructureCapacityUtilization() {
        const totalMigration = this.getTotalMigrationVolume();
        const totalCapacity = this.migrationState.infrastructure.transportCapacity + 
                             this.migrationState.infrastructure.processingCenters * 1000;
        
        return Math.min(totalMigration / totalCapacity, 1);
    }

    getCulturalDiversityIndex() {
        const migrantRatio = this.migrationState.demographics.migrantPopulation / 
                            this.migrationState.demographics.totalPopulation;
        
        // Simplified diversity calculation based on migrant population
        return Math.min(migrantRatio * 2, 1); // Cap at 1.0
    }

    // Simplified helper methods for game state analysis
    getUrbanEconomicScore(gameState) { return Math.random() * 0.5 + 0.3; }
    getRuralPopulation(gameState) { return this.migrationState.demographics.totalPopulation * 0.3; }
    getUrbanCrowdingScore(gameState) { return Math.random() * 0.4; }
    getUrbanPopulation(gameState) { return this.migrationState.demographics.totalPopulation * 0.7; }
    getRegionalEconomicDisparities(gameState) { return Math.random() * 0.6; }
    getSeasonalLaborDemand(gameState) { return Math.random() * 0.3; }
    getWorkingPopulation(gameState) { return this.migrationState.demographics.totalPopulation * 0.6; }
    getEconomicAttractiveness(gameState) { return Math.random() * 0.7 + 0.2; }
    getGlobalMigrantPool(gameState) { return 500000; }
    getEconomicPushFactors(gameState) { return Math.random() * 0.4; }
    getExternalOpportunities(gameState) { return Math.random() * 0.5; }
    getGlobalCrises(gameState) { return Math.random() * 0.3; }
    getGlobalRefugeePool(gameState) { return 100000; }
    getInternationalPressure(gameState) { return Math.random() * 0.2; }
    getSkilledLaborDemand(gameState) { return Math.random() * 0.6 + 0.2; }
    getGlobalSkilledPool(gameState) { return 200000; }
    getInternalMigrationPressure() { return Math.random() * 0.8; }
    getBorderMigrationPressure() { return Math.random() * 0.6; }

    updateImmigrationApplications(immigrationData, gameState) {
        const sources = ['terran_federation', 'centauri_republic', 'vegan_collective'];
        for (const source of sources) {
            const applications = Math.floor(immigrationData.volume * Math.random() * 0.4);
            immigrationData.applications.set(source, applications);
        }
    }

    updateEmigrationDestinations(emigrationData, gameState) {
        const destinations = ['terran_federation', 'centauri_republic', 'vegan_collective'];
        for (const destination of destinations) {
            const emigrants = Math.floor(emigrationData.volume * Math.random() * 0.4);
            emigrationData.destinations.set(destination, emigrants);
        }
    }

    updateRefugeeCrises(refugeeData, gameState) {
        const crises = ['conflict_zone_alpha', 'natural_disaster_beta', 'economic_collapse_gamma'];
        for (const crisis of crises) {
            if (Math.random() > 0.7) { // 30% chance of active crisis
                const refugees = Math.floor(refugeeData.volume * Math.random() * 0.5);
                refugeeData.crises.set(crisis, refugees);
            }
        }
    }

    updateSkilledMigrationSectors(skillMigrationData, gameState) {
        const sectors = ['technology', 'healthcare', 'engineering', 'finance', 'research'];
        for (const sector of sectors) {
            const migrants = Math.floor(skillMigrationData.volume * Math.random() * 0.3);
            skillMigrationData.sectors.set(sector, migrants);
        }
    }

    calculateLaborMarketImpact(totalMigration, gameState) {
        // Simplified calculation
        const populationRatio = totalMigration / this.migrationState.demographics.totalPopulation;
        return Math.min(populationRatio * 2, 0.5); // Cap at 50% impact
    }

    updateSkillGaps(skillGaps, gameState) {
        const sectors = ['technology', 'healthcare', 'engineering'];
        for (const sector of sectors) {
            const gap = Math.random() * 0.4; // 0 to 40% gap
            skillGaps.set(sector, gap);
        }
    }

    calculateWageEffects(wageEffects, totalMigration, gameState) {
        const sectors = ['low_skill', 'medium_skill', 'high_skill'];
        for (const sector of sectors) {
            // Migration generally has small wage effects
            const effect = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5%
            wageEffects.set(sector, effect);
        }
    }

    calculateFiscalImpact(totalMigration, gameState) {
        // Simplified fiscal impact calculation
        const migrantContribution = totalMigration * 30000; // Average contribution per migrant
        const migrantCosts = totalMigration * 25000; // Average costs per migrant
        return migrantContribution - migrantCosts;
    }

    getSystemSnapshot() {
        return {
            totalMigrationVolume: this.getTotalMigrationVolume(),
            internalMigrationVolume: this.migrationState.internalMigration.ruralToUrban.volume + 
                                   this.migrationState.internalMigration.urbanToRural.volume +
                                   this.migrationState.internalMigration.interRegional.volume,
            interCivMigrationBalance: this.getInterCivMigrationBalance(),
            migrantPopulation: this.migrationState.demographics.migrantPopulation,
            integrationSuccessRate: this.integrationSuccessRate || 0.6,
            infrastructureCapacity: this.getInfrastructureCapacityUtilization(),
            lastUpdate: this.migrationState.lastUpdate
        };
    }

    // Public API methods for integration with existing migration APIs
    getMigrationStatistics() {
        return {
            internal: this.getInternalMigrationPatterns(),
            interCiv: {
                immigration: this.migrationState.interCivMigration.immigration.volume,
                emigration: this.migrationState.interCivMigration.emigration.volume,
                refugees: this.migrationState.interCivMigration.refugees.volume,
                skilled: this.migrationState.interCivMigration.skillMigration.volume
            },
            demographics: this.getDemographicChanges(),
            infrastructure: this.migrationState.infrastructure
        };
    }

    updateMigrationPolicy(policyChanges) {
        if (policyChanges.immigrationOpenness !== undefined) {
            this.immigrationOpenness = policyChanges.immigrationOpenness;
        }
        if (policyChanges.refugeeAcceptance !== undefined) {
            this.refugeeAcceptanceRate = policyChanges.refugeeAcceptance;
        }
        if (policyChanges.borderSecurity !== undefined) {
            this.borderSecurityLevel = policyChanges.borderSecurity;
            this.migrationState.infrastructure.borderSecurity = policyChanges.borderSecurity;
        }
        
        return this.getSystemSnapshot();
    }
}

module.exports = MigrationSystem;
