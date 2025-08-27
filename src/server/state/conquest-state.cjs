// Civilization/Planet Merge System - Conquest and Discovery State Management

const conquestGameState = {
    // Active conquest campaigns
    activeCampaigns: [
        {
            id: 'campaign-001',
            name: 'Operation Starfall',
            targetSystem: 'kepler-442',
            targetPlanet: 'kepler-442b',
            attackingCiv: 'terran-federation',
            defendingCiv: 'zephyrian-empire',
            status: 'active', // active, completed, failed, planning
            startDate: '2387.156',
            estimatedCompletion: '2387.198',
            progress: 67,
            forces: {
                attacking: {
                    fleets: 12,
                    troops: 250000,
                    strength: 8500
                },
                defending: {
                    fleets: 8,
                    troops: 180000,
                    strength: 6200
                }
            },
            objectives: [
                { id: 'obj-1', name: 'Establish orbital superiority', status: 'completed', priority: 'high' },
                { id: 'obj-2', name: 'Neutralize planetary defenses', status: 'in-progress', priority: 'high' },
                { id: 'obj-3', name: 'Secure major population centers', status: 'pending', priority: 'medium' },
                { id: 'obj-4', name: 'Establish provisional government', status: 'pending', priority: 'low' }
            ]
        },
        {
            id: 'campaign-002',
            name: 'Centauri Expansion',
            targetSystem: 'proxima-centauri',
            targetPlanet: 'proxima-b',
            attackingCiv: 'terran-federation',
            defendingCiv: null, // Unoccupied planet
            status: 'planning',
            startDate: null,
            estimatedCompletion: null,
            progress: 15,
            forces: {
                attacking: {
                    fleets: 6,
                    troops: 50000,
                    strength: 3200
                },
                defending: null
            },
            objectives: [
                { id: 'obj-5', name: 'Survey planetary resources', status: 'completed', priority: 'high' },
                { id: 'obj-6', name: 'Establish orbital infrastructure', status: 'pending', priority: 'high' },
                { id: 'obj-7', name: 'Deploy colonization fleet', status: 'pending', priority: 'medium' },
                { id: 'obj-8', name: 'Establish permanent settlement', status: 'pending', priority: 'medium' }
            ]
        }
    ],

    // Discovered but unclaimed planets
    discoveredPlanets: [
        {
            id: 'planet-discovery-001',
            name: 'New Terra',
            system: 'wolf-359',
            coordinates: { x: -15, y: 8, z: -3 },
            discoveredBy: 'terran-federation',
            discoveryDate: '2387.134',
            status: 'surveyed', // discovered, surveyed, claimed, colonized
            habitability: 0.87,
            resources: {
                minerals: 'abundant',
                water: 'moderate',
                atmosphere: 'breathable',
                energy: 'solar-optimal'
            },
            threats: ['hostile-wildlife', 'unstable-weather'],
            colonizationCost: 125000,
            estimatedValue: 890000,
            claimants: ['terran-federation', 'martian-republic']
        },
        {
            id: 'planet-discovery-002',
            name: 'Crystalline World',
            system: 'barnards-star',
            coordinates: { x: 22, y: -18, z: 11 },
            discoveredBy: 'zephyrian-empire',
            discoveryDate: '2387.089',
            status: 'discovered',
            habitability: 0.23,
            resources: {
                minerals: 'rare-crystals',
                water: 'scarce',
                atmosphere: 'toxic',
                energy: 'geothermal'
            },
            threats: ['radiation', 'crystal-storms'],
            colonizationCost: 450000,
            estimatedValue: 2100000,
            claimants: ['zephyrian-empire']
        }
    ],

    // Completed mergers and integrations
    completedMergers: [
        {
            id: 'merger-001',
            type: 'conquest',
            planet: 'europa-station',
            system: 'sol',
            fromCiv: 'jovian-collective',
            toCiv: 'terran-federation',
            completionDate: '2387.098',
            integrationStatus: 'fully-integrated',
            integrationTime: 45, // days
            populationTransfer: {
                original: 2800000,
                relocated: 280000,
                remaining: 2520000,
                satisfaction: 0.72
            },
            economicImpact: {
                gdpChange: 12.5,
                tradeRouteChanges: 3,
                resourceAccess: ['helium-3', 'ice-mining']
            },
            culturalIntegration: {
                languageAdoption: 0.45,
                customsRetention: 0.78,
                intermarriage: 0.12
            }
        }
    ],

    // Merge templates and policies
    mergeTemplates: {
        conquest: {
            name: 'Military Conquest',
            phases: [
                { name: 'Military Occupation', duration: 30, requirements: ['military-superiority'] },
                { name: 'Provisional Government', duration: 60, requirements: ['administrative-staff'] },
                { name: 'Cultural Integration', duration: 180, requirements: ['cultural-programs'] },
                { name: 'Full Integration', duration: 365, requirements: ['economic-integration'] }
            ],
            policies: {
                populationTreatment: 'standard', // harsh, standard, lenient
                culturalPreservation: 'moderate', // none, minimal, moderate, full
                economicIntegration: 'gradual', // immediate, gradual, delayed
                militaryPresence: 'heavy' // light, moderate, heavy
            }
        },
        discovery: {
            name: 'Peaceful Colonization',
            phases: [
                { name: 'Survey and Assessment', duration: 45, requirements: ['survey-fleet'] },
                { name: 'Infrastructure Development', duration: 120, requirements: ['construction-fleet'] },
                { name: 'Initial Settlement', duration: 90, requirements: ['colonist-transport'] },
                { name: 'Established Colony', duration: 180, requirements: ['self-sufficiency'] }
            ],
            policies: {
                environmentalProtection: 'high', // low, moderate, high
                indigenousRights: 'respected', // ignored, limited, respected, prioritized
                developmentSpeed: 'sustainable', // rapid, balanced, sustainable
                resourceExtraction: 'regulated' // unrestricted, managed, regulated, prohibited
            }
        },
        diplomacy: {
            name: 'Diplomatic Annexation',
            phases: [
                { name: 'Negotiation', duration: 90, requirements: ['diplomatic-mission'] },
                { name: 'Treaty Ratification', duration: 30, requirements: ['legislative-approval'] },
                { name: 'Peaceful Transition', duration: 120, requirements: ['transition-team'] },
                { name: 'Administrative Integration', duration: 240, requirements: ['bureaucratic-merger'] }
            ],
            policies: {
                autonomyLevel: 'high', // none, limited, moderate, high
                existingLeadership: 'retained', // replaced, mixed, retained
                economicTerms: 'favorable', // exploitative, standard, favorable
                culturalRights: 'guaranteed' // restricted, protected, guaranteed
            }
        }
    },

    // Integration metrics and tracking
    integrationMetrics: {
        totalPlanetsControlled: 47,
        planetsUnderIntegration: 3,
        averageIntegrationTime: 156, // days
        successRate: 0.89,
        populationSatisfaction: 0.76,
        economicEfficiency: 0.83,
        culturalDiversity: 0.67,
        rebellionRisk: 0.12
    },

    // Active integration processes
    activeIntegrations: [
        {
            planetId: 'titan-base',
            phase: 'Cultural Integration',
            progress: 0.34,
            timeRemaining: 119, // days
            challenges: ['language-barriers', 'religious-differences'],
            successProbability: 0.78
        },
        {
            planetId: 'mars-colony-7',
            phase: 'Economic Integration',
            progress: 0.67,
            timeRemaining: 45,
            challenges: ['currency-conversion', 'trade-regulations'],
            successProbability: 0.92
        }
    ]
};

// Core functions for conquest and discovery management
function initiateCampaign(targetSystem, targetPlanet, campaignType, forces) {
    const campaignId = `campaign-${Date.now()}`;
    const newCampaign = {
        id: campaignId,
        name: `Operation ${generateOperationName()}`,
        targetSystem,
        targetPlanet,
        attackingCiv: 'terran-federation', // Default to player civ
        defendingCiv: getDefendingCiv(targetPlanet),
        status: 'planning',
        startDate: getCurrentGameDate(),
        estimatedCompletion: null,
        progress: 0,
        forces,
        objectives: generateObjectives(campaignType)
    };

    conquestGameState.activeCampaigns.push(newCampaign);
    return newCampaign;
}

function updateCampaignProgress(campaignId, progressDelta) {
    const campaign = conquestGameState.activeCampaigns.find(c => c.id === campaignId);
    if (campaign) {
        campaign.progress = Math.min(100, campaign.progress + progressDelta);
        
        // Update objectives based on progress
        updateObjectiveStatus(campaign);
        
        // Check for campaign completion
        if (campaign.progress >= 100) {
            completeCampaign(campaignId);
        }
    }
    return campaign;
}

function completeCampaign(campaignId) {
    const campaign = conquestGameState.activeCampaigns.find(c => c.id === campaignId);
    if (!campaign) return null;

    campaign.status = 'completed';
    
    // Create merger record
    const merger = {
        id: `merger-${Date.now()}`,
        type: campaign.defendingCiv ? 'conquest' : 'discovery',
        planet: campaign.targetPlanet,
        system: campaign.targetSystem,
        fromCiv: campaign.defendingCiv,
        toCiv: campaign.attackingCiv,
        completionDate: getCurrentGameDate(),
        integrationStatus: 'beginning',
        integrationTime: 0,
        populationTransfer: generatePopulationData(campaign),
        economicImpact: calculateEconomicImpact(campaign),
        culturalIntegration: initializeCulturalMetrics()
    };

    conquestGameState.completedMergers.push(merger);
    
    // Start integration process
    startIntegrationProcess(campaign.targetPlanet, merger.type);
    
    return merger;
}

function discoverPlanet(systemName, coordinates, discovererCiv) {
    const planetId = `planet-discovery-${Date.now()}`;
    const discovery = {
        id: planetId,
        name: generatePlanetName(),
        system: systemName,
        coordinates,
        discoveredBy: discovererCiv,
        discoveryDate: getCurrentGameDate(),
        status: 'discovered',
        habitability: Math.random() * 0.9 + 0.1,
        resources: generatePlanetResources(),
        threats: generatePlanetThreats(),
        colonizationCost: Math.floor(Math.random() * 400000) + 50000,
        estimatedValue: Math.floor(Math.random() * 2000000) + 100000,
        claimants: [discovererCiv]
    };

    conquestGameState.discoveredPlanets.push(discovery);
    return discovery;
}

function claimPlanet(planetId, claimantCiv) {
    const planet = conquestGameState.discoveredPlanets.find(p => p.id === planetId);
    if (!planet) return null;

    if (!planet.claimants.includes(claimantCiv)) {
        planet.claimants.push(claimantCiv);
    }

    // If only one claimant, automatically approve
    if (planet.claimants.length === 1) {
        planet.status = 'claimed';
        return initiateCampaign(planet.system, planet.name, 'discovery', generateColonizationForces());
    }

    return planet;
}

function startIntegrationProcess(planetId, integrationType) {
    const template = conquestGameState.mergeTemplates[integrationType];
    if (!template) return null;

    const integration = {
        planetId,
        phase: template.phases[0].name,
        progress: 0,
        timeRemaining: template.phases[0].duration,
        challenges: generateIntegrationChallenges(integrationType),
        successProbability: calculateSuccessProbability(integrationType)
    };

    conquestGameState.activeIntegrations.push(integration);
    return integration;
}

function updateIntegrationProgress(planetId, daysPassed) {
    const integration = conquestGameState.activeIntegrations.find(i => i.planetId === planetId);
    if (!integration) return null;

    integration.timeRemaining -= daysPassed;
    integration.progress = Math.max(0, 1 - (integration.timeRemaining / getCurrentPhaseDuration(integration)));

    // Check for phase completion
    if (integration.timeRemaining <= 0) {
        advanceIntegrationPhase(integration);
    }

    return integration;
}

function advanceIntegrationPhase(integration) {
    const currentTemplate = getCurrentIntegrationTemplate(integration);
    const currentPhaseIndex = currentTemplate.phases.findIndex(p => p.name === integration.phase);
    
    if (currentPhaseIndex < currentTemplate.phases.length - 1) {
        // Move to next phase
        const nextPhase = currentTemplate.phases[currentPhaseIndex + 1];
        integration.phase = nextPhase.name;
        integration.timeRemaining = nextPhase.duration;
        integration.progress = 0;
    } else {
        // Integration complete
        completeIntegration(integration);
    }
}

function completeIntegration(integration) {
    // Remove from active integrations
    const index = conquestGameState.activeIntegrations.findIndex(i => i.planetId === integration.planetId);
    if (index !== -1) {
        conquestGameState.activeIntegrations.splice(index, 1);
    }

    // Update merger record
    const merger = conquestGameState.completedMergers.find(m => m.planet === integration.planetId);
    if (merger) {
        merger.integrationStatus = 'fully-integrated';
        merger.integrationTime = calculateTotalIntegrationTime(integration);
    }

    // Update global metrics
    updateGlobalIntegrationMetrics();
}

// Helper functions
function generateOperationName() {
    const prefixes = ['Starfall', 'Nebula', 'Phoenix', 'Thunder', 'Lightning', 'Storm', 'Dawn', 'Twilight'];
    const suffixes = ['Strike', 'Wing', 'Force', 'Guard', 'Shield', 'Sword', 'Lance', 'Hammer'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generatePlanetName() {
    const prefixes = ['New', 'Nova', 'Alpha', 'Beta', 'Prime', 'Greater', 'Lesser'];
    const names = ['Terra', 'Eden', 'Haven', 'Sanctuary', 'Horizon', 'Frontier', 'Outpost', 'Colony'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]}`;
}

function generatePlanetResources() {
    const mineralTypes = ['abundant', 'moderate', 'scarce', 'rare-crystals', 'precious-metals'];
    const waterTypes = ['abundant', 'moderate', 'scarce', 'ice-caps', 'underground'];
    const atmosphereTypes = ['breathable', 'toxic', 'thin', 'dense', 'corrosive'];
    const energyTypes = ['solar-optimal', 'geothermal', 'wind', 'tidal', 'nuclear'];

    return {
        minerals: mineralTypes[Math.floor(Math.random() * mineralTypes.length)],
        water: waterTypes[Math.floor(Math.random() * waterTypes.length)],
        atmosphere: atmosphereTypes[Math.floor(Math.random() * atmosphereTypes.length)],
        energy: energyTypes[Math.floor(Math.random() * energyTypes.length)]
    };
}

function generatePlanetThreats() {
    const allThreats = ['hostile-wildlife', 'unstable-weather', 'radiation', 'seismic-activity', 
                      'toxic-environment', 'extreme-temperatures', 'magnetic-storms', 'crystal-storms'];
    const numThreats = Math.floor(Math.random() * 3);
    const threats = [];
    
    for (let i = 0; i < numThreats; i++) {
        const threat = allThreats[Math.floor(Math.random() * allThreats.length)];
        if (!threats.includes(threat)) {
            threats.push(threat);
        }
    }
    
    return threats;
}

function generateObjectives(campaignType) {
    const objectiveTemplates = {
        conquest: [
            'Establish orbital superiority',
            'Neutralize planetary defenses',
            'Secure major population centers',
            'Establish provisional government'
        ],
        discovery: [
            'Survey planetary resources',
            'Establish orbital infrastructure',
            'Deploy colonization fleet',
            'Establish permanent settlement'
        ]
    };

    const templates = objectiveTemplates[campaignType] || objectiveTemplates.conquest;
    return templates.map((name, index) => ({
        id: `obj-${Date.now()}-${index}`,
        name,
        status: 'pending',
        priority: index < 2 ? 'high' : index < 3 ? 'medium' : 'low'
    }));
}

function getCurrentGameDate() {
    // Simulate current game date
    const baseYear = 2387;
    const dayOfYear = Math.floor(Math.random() * 365) + 1;
    return `${baseYear}.${dayOfYear.toString().padStart(3, '0')}`;
}

function getDefendingCiv(planetName) {
    // Simulate checking if planet is occupied
    const occupiedPlanets = {
        'kepler-442b': 'zephyrian-empire',
        'proxima-b': null,
        'europa-station': 'jovian-collective'
    };
    return occupiedPlanets[planetName] || null;
}

function updateObjectiveStatus(campaign) {
    // Simulate objective completion based on progress
    campaign.objectives.forEach((obj, index) => {
        const requiredProgress = (index + 1) * (100 / campaign.objectives.length);
        if (campaign.progress >= requiredProgress && obj.status === 'pending') {
            obj.status = index === campaign.objectives.length - 1 ? 'completed' : 'in-progress';
        }
    });
}

function generatePopulationData(campaign) {
    const basePopulation = Math.floor(Math.random() * 5000000) + 1000000;
    const relocationRate = campaign.defendingCiv ? 0.1 : 0; // Only for conquest
    
    return {
        original: basePopulation,
        relocated: Math.floor(basePopulation * relocationRate),
        remaining: Math.floor(basePopulation * (1 - relocationRate)),
        satisfaction: Math.random() * 0.4 + 0.5 // 0.5 to 0.9
    };
}

function calculateEconomicImpact(campaign) {
    return {
        gdpChange: Math.random() * 20 + 5, // 5% to 25% increase
        tradeRouteChanges: Math.floor(Math.random() * 5) + 1,
        resourceAccess: generateNewResources()
    };
}

function generateNewResources() {
    const resources = ['helium-3', 'rare-earth-metals', 'deuterium', 'antimatter', 'exotic-matter', 
                      'quantum-crystals', 'bio-materials', 'ice-mining', 'solar-energy', 'geothermal'];
    const count = Math.floor(Math.random() * 3) + 1;
    return resources.sort(() => 0.5 - Math.random()).slice(0, count);
}

function initializeCulturalMetrics() {
    return {
        languageAdoption: Math.random() * 0.3 + 0.2, // 0.2 to 0.5
        customsRetention: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
        intermarriage: Math.random() * 0.2 + 0.05 // 0.05 to 0.25
    };
}

function generateColonizationForces() {
    return {
        attacking: {
            fleets: Math.floor(Math.random() * 8) + 2,
            troops: Math.floor(Math.random() * 100000) + 25000,
            strength: Math.floor(Math.random() * 3000) + 1500
        },
        defending: null
    };
}

function generateIntegrationChallenges(integrationType) {
    const challengeTypes = {
        conquest: ['resistance-movements', 'language-barriers', 'cultural-conflicts', 'economic-disruption'],
        discovery: ['environmental-adaptation', 'supply-chain-issues', 'equipment-failures', 'personnel-shortages'],
        diplomacy: ['bureaucratic-delays', 'political-opposition', 'legal-complications', 'public-resistance']
    };

    const challenges = challengeTypes[integrationType] || challengeTypes.conquest;
    const numChallenges = Math.floor(Math.random() * 3) + 1;
    return challenges.sort(() => 0.5 - Math.random()).slice(0, numChallenges);
}

function calculateSuccessProbability(integrationType) {
    const baseProbabilities = {
        conquest: 0.75,
        discovery: 0.90,
        diplomacy: 0.85
    };
    
    const base = baseProbabilities[integrationType] || 0.75;
    const variance = (Math.random() - 0.5) * 0.2; // ±0.1
    return Math.max(0.1, Math.min(0.99, base + variance));
}

function getCurrentPhaseDuration(integration) {
    const template = getCurrentIntegrationTemplate(integration);
    const phase = template.phases.find(p => p.name === integration.phase);
    return phase ? phase.duration : 30;
}

function getCurrentIntegrationTemplate(integration) {
    // Determine template based on integration type
    const merger = conquestGameState.completedMergers.find(m => m.planet === integration.planetId);
    const templateType = merger ? merger.type : 'conquest';
    return conquestGameState.mergeTemplates[templateType] || conquestGameState.mergeTemplates.conquest;
}

function calculateTotalIntegrationTime(integration) {
    const template = getCurrentIntegrationTemplate(integration);
    return template.phases.reduce((total, phase) => total + phase.duration, 0);
}

function updateGlobalIntegrationMetrics() {
    const metrics = conquestGameState.integrationMetrics;
    
    // Recalculate based on completed mergers
    const completedMergers = conquestGameState.completedMergers;
    const fullyIntegrated = completedMergers.filter(m => m.integrationStatus === 'fully-integrated');
    
    metrics.successRate = fullyIntegrated.length / completedMergers.length;
    metrics.averageIntegrationTime = fullyIntegrated.reduce((sum, m) => sum + m.integrationTime, 0) / fullyIntegrated.length;
    metrics.populationSatisfaction = fullyIntegrated.reduce((sum, m) => sum + m.populationTransfer.satisfaction, 0) / fullyIntegrated.length;
}

module.exports = {
    conquestGameState,
    initiateCampaign,
    updateCampaignProgress,
    completeCampaign,
    discoverPlanet,
    claimPlanet,
    startIntegrationProcess,
    updateIntegrationProgress,
    advanceIntegrationPhase,
    completeIntegration,
    updateGlobalIntegrationMetrics
};

