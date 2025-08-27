// Conquest and Planet Merge APIs

const {
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
} = require('../game-state/conquest-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const conquestKnobsData = {
  // Military Strategy
  military_aggression_level: 0.5,        // AI can control military aggression (0.0-1.0)
  conquest_priority: 0.6,                // AI can prioritize conquest campaigns (0.0-1.0)
  defensive_posture: 0.7,                // AI can adjust defensive strategies (0.0-1.0)
  strategic_patience: 0.5,               // AI can control campaign timing (0.0-1.0)
  
  // Diplomatic Approach
  diplomatic_conquest_preference: 0.4,   // AI can prefer diplomatic solutions (0.0-1.0)
  alliance_formation_priority: 0.6,      // AI can prioritize alliance building (0.0-1.0)
  negotiation_flexibility: 0.5,          // AI can adjust negotiation stance (0.0-1.0)
  cultural_assimilation_focus: 0.6,      // AI can focus on cultural integration (0.0-1.0)
  
  // Resource Management
  conquest_resource_allocation: 0.7,     // AI can allocate resources to conquest (0.0-1.0)
  integration_investment: 0.6,           // AI can invest in integration processes (0.0-1.0)
  infrastructure_development: 0.5,       // AI can develop conquered territories (0.0-1.0)
  economic_exploitation_balance: 0.4,    // AI can balance exploitation vs development (0.0-1.0)
  
  // Integration Strategy
  integration_speed_priority: 0.5,       // AI can prioritize integration speed (0.0-1.0)
  cultural_preservation: 0.6,            // AI can preserve conquered cultures (0.0-1.0)
  population_relocation: 0.3,            // AI can relocate populations (0.0-1.0)
  governance_model_adaptation: 0.7,      // AI can adapt governance models (0.0-1.0)
  
  // Intelligence Operations
  intelligence_gathering_focus: 0.8,     // AI can focus on intelligence gathering (0.0-1.0)
  sabotage_operations: 0.3,              // AI can conduct sabotage operations (0.0-1.0)
  propaganda_campaigns: 0.5,             // AI can run propaganda campaigns (0.0-1.0)
  counter_intelligence: 0.7,             // AI can enhance counter-intelligence (0.0-1.0)
  
  // Risk Management
  civilian_casualty_minimization: 0.8,   // AI can minimize civilian casualties (0.0-1.0)
  collateral_damage_tolerance: 0.2,      // AI can tolerate collateral damage (0.0-1.0)
  retreat_threshold: 0.3,                // AI can set retreat thresholds (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const conquestKnobSystem = new EnhancedKnobSystem(conquestKnobsData);

// Backward compatibility - expose knobs directly
const conquestKnobs = conquestKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateConquestStructuredOutputs() {
  const campaigns = conquestGameState.activeCampaigns;
  const discoveries = conquestGameState.planetDiscoveries;
  const integrations = conquestGameState.integrationProcesses;
  
  return {
    // High-level conquest metrics for AI decision-making
    conquest_metrics: {
      active_campaigns: campaigns.length,
      successful_conquests: campaigns.filter(c => c.status === 'completed' && c.outcome === 'victory').length,
      ongoing_integrations: integrations.filter(i => i.status === 'in_progress').length,
      total_controlled_planets: calculateControlledPlanets(),
      conquest_efficiency: calculateConquestEfficiency(),
      integration_success_rate: calculateIntegrationSuccessRate(),
      military_strength_index: calculateMilitaryStrengthIndex()
    },
    
    // Campaign analysis for AI strategic planning
    campaign_analysis: {
      campaign_success_patterns: analyzeCampaignSuccessPatterns(),
      resource_allocation_effectiveness: analyzeResourceAllocation(),
      diplomatic_vs_military_outcomes: analyzeDiplomaticVsMilitaryOutcomes(),
      integration_challenges: analyzeIntegrationChallenges(),
      expansion_opportunities: identifyExpansionOpportunities()
    },
    
    // Strategic assessment for AI feedback
    strategic_assessment: {
      territorial_expansion_rate: assessTerritorialExpansion(),
      military_readiness: assessMilitaryReadiness(),
      integration_capacity: assessIntegrationCapacity(),
      diplomatic_reputation: assessDiplomaticReputation(),
      resistance_management: assessResistanceManagement()
    },
    
    // Conquest alerts and recommendations for AI attention
    ai_alerts: generateConquestAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      military_resource_requirements: calculateMilitaryResourceRequirements(),
      diplomatic_relationship_impacts: calculateDiplomaticImpacts(),
      economic_integration_benefits: calculateEconomicBenefits(),
      cultural_assimilation_progress: calculateCulturalAssimilation(),
      population_management_data: calculatePopulationManagement(),
      intelligence_operation_results: calculateIntelligenceResults()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...conquestKnobs }
  };
}

function setupConquestAPIs(app) {
    console.log('Setting up Conquest APIs...');

    // Get all active campaigns
    app.get('/api/conquest/campaigns', (req, res) => {
        try {
            const { status, type } = req.query;
            let campaigns = conquestGameState.activeCampaigns;

            if (status) {
                campaigns = campaigns.filter(c => c.status === status);
            }

            if (type) {
                const isConquest = type === 'conquest';
                campaigns = campaigns.filter(c => isConquest ? c.defendingCiv : !c.defendingCiv);
            }

            res.json({
                success: true,
                data: campaigns,
                total: campaigns.length
            });
        } catch (error) {
            console.error('Failed to get campaigns:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get campaigns',
                details: error.message
            });
        }
    });

    // Get specific campaign details
    app.get('/api/conquest/campaigns/:campaignId', (req, res) => {
        try {
            const { campaignId } = req.params;
            const campaign = conquestGameState.activeCampaigns.find(c => c.id === campaignId);

            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    error: 'Campaign not found'
                });
            }

            res.json({
                success: true,
                data: campaign
            });
        } catch (error) {
            console.error('Failed to get campaign:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get campaign',
                details: error.message
            });
        }
    });

    // Start new campaign
    app.post('/api/conquest/campaigns', (req, res) => {
        try {
            const { targetSystem, targetPlanet, campaignType, forces } = req.body;

            if (!targetSystem || !targetPlanet || !campaignType) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: targetSystem, targetPlanet, campaignType'
                });
            }

            const campaign = initiateCampaign(targetSystem, targetPlanet, campaignType, forces);

            res.json({
                success: true,
                data: campaign,
                message: `Campaign ${campaign.name} initiated successfully`
            });
        } catch (error) {
            console.error('Failed to create campaign:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create campaign',
                details: error.message
            });
        }
    });

    // Update campaign progress
    app.patch('/api/conquest/campaigns/:campaignId/progress', (req, res) => {
        try {
            const { campaignId } = req.params;
            const { progressDelta } = req.body;

            if (typeof progressDelta !== 'number') {
                return res.status(400).json({
                    success: false,
                    error: 'progressDelta must be a number'
                });
            }

            const campaign = updateCampaignProgress(campaignId, progressDelta);

            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    error: 'Campaign not found'
                });
            }

            res.json({
                success: true,
                data: campaign,
                message: `Campaign progress updated to ${campaign.progress}%`
            });
        } catch (error) {
            console.error('Failed to update campaign progress:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update campaign progress',
                details: error.message
            });
        }
    });

    // Complete campaign manually
    app.post('/api/conquest/campaigns/:campaignId/complete', (req, res) => {
        try {
            const { campaignId } = req.params;
            const merger = completeCampaign(campaignId);

            if (!merger) {
                return res.status(404).json({
                    success: false,
                    error: 'Campaign not found'
                });
            }

            res.json({
                success: true,
                data: merger,
                message: 'Campaign completed successfully'
            });
        } catch (error) {
            console.error('Failed to complete campaign:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to complete campaign',
                details: error.message
            });
        }
    });

    // Get discovered planets
    app.get('/api/conquest/discoveries', (req, res) => {
        try {
            const { status, discoveredBy } = req.query;
            let planets = conquestGameState.discoveredPlanets;

            if (status) {
                planets = planets.filter(p => p.status === status);
            }

            if (discoveredBy) {
                planets = planets.filter(p => p.discoveredBy === discoveredBy);
            }

            res.json({
                success: true,
                data: planets,
                total: planets.length
            });
        } catch (error) {
            console.error('Failed to get discoveries:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get discoveries',
                details: error.message
            });
        }
    });

    // Discover new planet
    app.post('/api/conquest/discoveries', (req, res) => {
        try {
            const { systemName, coordinates, discovererCiv } = req.body;

            if (!systemName || !coordinates || !discovererCiv) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: systemName, coordinates, discovererCiv'
                });
            }

            const discovery = discoverPlanet(systemName, coordinates, discovererCiv);

            res.json({
                success: true,
                data: discovery,
                message: `Planet ${discovery.name} discovered in ${systemName} system`
            });
        } catch (error) {
            console.error('Failed to discover planet:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to discover planet',
                details: error.message
            });
        }
    });

    // Claim discovered planet
    app.post('/api/conquest/discoveries/:planetId/claim', (req, res) => {
        try {
            const { planetId } = req.params;
            const { claimantCiv } = req.body;

            if (!claimantCiv) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field: claimantCiv'
                });
            }

            const result = claimPlanet(planetId, claimantCiv);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    error: 'Planet not found'
                });
            }

            // Check if a campaign was automatically started
            const isNewCampaign = result.hasOwnProperty('forces');

            res.json({
                success: true,
                data: result,
                message: isNewCampaign 
                    ? `Colonization campaign started for ${result.name}`
                    : `Claim registered for planet ${result.name}`
            });
        } catch (error) {
            console.error('Failed to claim planet:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to claim planet',
                details: error.message
            });
        }
    });

    // Get completed mergers
    app.get('/api/conquest/mergers', (req, res) => {
        try {
            const { type, status } = req.query;
            let mergers = conquestGameState.completedMergers;

            if (type) {
                mergers = mergers.filter(m => m.type === type);
            }

            if (status) {
                mergers = mergers.filter(m => m.integrationStatus === status);
            }

            res.json({
                success: true,
                data: mergers,
                total: mergers.length
            });
        } catch (error) {
            console.error('Failed to get mergers:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get mergers',
                details: error.message
            });
        }
    });

    // Get active integrations
    app.get('/api/conquest/integrations', (req, res) => {
        try {
            res.json({
                success: true,
                data: conquestGameState.activeIntegrations,
                total: conquestGameState.activeIntegrations.length
            });
        } catch (error) {
            console.error('Failed to get integrations:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get integrations',
                details: error.message
            });
        }
    });

    // Update integration progress
    app.patch('/api/conquest/integrations/:planetId/progress', (req, res) => {
        try {
            const { planetId } = req.params;
            const { daysPassed } = req.body;

            if (typeof daysPassed !== 'number' || daysPassed <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'daysPassed must be a positive number'
                });
            }

            const integration = updateIntegrationProgress(planetId, daysPassed);

            if (!integration) {
                return res.status(404).json({
                    success: false,
                    error: 'Integration not found'
                });
            }

            res.json({
                success: true,
                data: integration,
                message: `Integration progress updated for ${planetId}`
            });
        } catch (error) {
            console.error('Failed to update integration progress:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update integration progress',
                details: error.message
            });
        }
    });

    // Get merge templates
    app.get('/api/conquest/templates', (req, res) => {
        try {
            res.json({
                success: true,
                data: conquestGameState.mergeTemplates
            });
        } catch (error) {
            console.error('Failed to get merge templates:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get merge templates',
                details: error.message
            });
        }
    });

    // Get integration metrics
    app.get('/api/conquest/metrics', (req, res) => {
        try {
            // Update metrics before returning
            updateGlobalIntegrationMetrics();

            res.json({
                success: true,
                data: conquestGameState.integrationMetrics
            });
        } catch (error) {
            console.error('Failed to get integration metrics:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get integration metrics',
                details: error.message
            });
        }
    });

    // Simulate time passage (for testing)
    app.post('/api/conquest/simulate', (req, res) => {
        try {
            const { days = 1 } = req.body;

            // Update all active campaigns
            conquestGameState.activeCampaigns.forEach(campaign => {
                if (campaign.status === 'active') {
                    const progressIncrease = Math.random() * 10 + 2; // 2-12% per day
                    updateCampaignProgress(campaign.id, progressIncrease);
                }
            });

            // Update all active integrations
            conquestGameState.activeIntegrations.forEach(integration => {
                updateIntegrationProgress(integration.planetId, days);
            });

            res.json({
                success: true,
                message: `Simulated ${days} day(s) of progress`,
                data: {
                    activeCampaigns: conquestGameState.activeCampaigns.length,
                    activeIntegrations: conquestGameState.activeIntegrations.length,
                    completedMergers: conquestGameState.completedMergers.length
                }
            });
        } catch (error) {
            console.error('Failed to simulate time passage:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to simulate time passage',
                details: error.message
            });
        }
    });

    // Get conquest overview/dashboard data
    app.get('/api/conquest/overview', (req, res) => {
        try {
            const overview = {
                activeCampaigns: conquestGameState.activeCampaigns.length,
                activeCampaignsByType: {
                    conquest: conquestGameState.activeCampaigns.filter(c => c.defendingCiv).length,
                    discovery: conquestGameState.activeCampaigns.filter(c => !c.defendingCiv).length
                },
                discoveredPlanets: conquestGameState.discoveredPlanets.length,
                discoveredPlanetsByStatus: {
                    discovered: conquestGameState.discoveredPlanets.filter(p => p.status === 'discovered').length,
                    surveyed: conquestGameState.discoveredPlanets.filter(p => p.status === 'surveyed').length,
                    claimed: conquestGameState.discoveredPlanets.filter(p => p.status === 'claimed').length,
                    colonized: conquestGameState.discoveredPlanets.filter(p => p.status === 'colonized').length
                },
                completedMergers: conquestGameState.completedMergers.length,
                activeIntegrations: conquestGameState.activeIntegrations.length,
                integrationMetrics: conquestGameState.integrationMetrics,
                recentActivity: [
                    ...conquestGameState.activeCampaigns.slice(-3).map(c => ({
                        type: 'campaign',
                        action: 'started',
                        target: c.name,
                        date: c.startDate
                    })),
                    ...conquestGameState.completedMergers.slice(-3).map(m => ({
                        type: 'merger',
                        action: 'completed',
                        target: m.planet,
                        date: m.completionDate
                    }))
                ].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5)
            };

            res.json({
                success: true,
                data: overview
            });
        } catch (error) {
            console.error('Failed to get conquest overview:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get conquest overview',
                details: error.message
            });
        }
    });

    // Helper functions for conquest structured outputs (streamlined)
    function calculateControlledPlanets() {
        const integrations = conquestGameState.integrationProcesses;
        return integrations.filter(i => i.status === 'completed').length;
    }

    function calculateConquestEfficiency() {
        const campaigns = conquestGameState.activeCampaigns;
        const completed = campaigns.filter(c => c.status === 'completed');
        const successful = completed.filter(c => c.outcome === 'victory');
        return completed.length > 0 ? successful.length / completed.length : 0.5;
    }

    function calculateIntegrationSuccessRate() {
        const integrations = conquestGameState.integrationProcesses;
        const completed = integrations.filter(i => i.status === 'completed');
        const successful = completed.filter(i => i.integrationScore > 0.7);
        return completed.length > 0 ? successful.length / completed.length : 0.6;
    }

    function calculateMilitaryStrengthIndex() {
        const aggression = conquestKnobs.military_aggression_level;
        const resourceAllocation = conquestKnobs.conquest_resource_allocation;
        const intelligence = conquestKnobs.intelligence_gathering_focus;
        return (aggression + resourceAllocation + intelligence) / 3;
    }

    function analyzeCampaignSuccessPatterns() {
        const campaigns = conquestGameState.activeCampaigns;
        const diplomatic = campaigns.filter(c => c.approach === 'diplomatic');
        const military = campaigns.filter(c => c.approach === 'military');
        const diplomaticSuccess = diplomatic.filter(c => c.outcome === 'victory').length;
        const militarySuccess = military.filter(c => c.outcome === 'victory').length;
        
        return {
            diplomatic_campaigns: diplomatic.length,
            military_campaigns: military.length,
            diplomatic_success_rate: diplomatic.length > 0 ? diplomaticSuccess / diplomatic.length : 0,
            military_success_rate: military.length > 0 ? militarySuccess / military.length : 0
        };
    }

    function analyzeResourceAllocation() {
        const resourceAllocation = conquestKnobs.conquest_resource_allocation;
        const integrationInvestment = conquestKnobs.integration_investment;
        const infrastructureDev = conquestKnobs.infrastructure_development;
        const effectiveness = (resourceAllocation + integrationInvestment + infrastructureDev) / 3;
        return { allocation_effectiveness: effectiveness, resource_focus: resourceAllocation };
    }

    function analyzeDiplomaticVsMilitaryOutcomes() {
        const diplomaticPreference = conquestKnobs.diplomatic_conquest_preference;
        const militaryAggression = conquestKnobs.military_aggression_level;
        const campaigns = conquestGameState.activeCampaigns;
        const diplomaticCampaigns = campaigns.filter(c => c.approach === 'diplomatic').length;
        const militaryCampaigns = campaigns.filter(c => c.approach === 'military').length;
        
        return {
            diplomatic_preference: diplomaticPreference,
            military_aggression: militaryAggression,
            diplomatic_campaigns: diplomaticCampaigns,
            military_campaigns: militaryCampaigns,
            approach_balance: diplomaticCampaigns + militaryCampaigns > 0 ? diplomaticCampaigns / (diplomaticCampaigns + militaryCampaigns) : 0.5
        };
    }

    function analyzeIntegrationChallenges() {
        const integrations = conquestGameState.integrationProcesses;
        const challengingIntegrations = integrations.filter(i => i.resistanceLevel > 0.6).length;
        const culturalPreservation = conquestKnobs.cultural_preservation;
        const speedPriority = conquestKnobs.integration_speed_priority;
        
        return {
            challenging_integrations: challengingIntegrations,
            total_integrations: integrations.length,
            cultural_preservation_focus: culturalPreservation,
            speed_vs_quality_balance: speedPriority
        };
    }

    function identifyExpansionOpportunities() {
        const discoveries = conquestGameState.planetDiscoveries;
        const unclaimedPlanets = discoveries.filter(d => d.status === 'discovered' && !d.claimed).length;
        const expansionReadiness = conquestKnobs.conquest_priority;
        const strategicPatience = conquestKnobs.strategic_patience;
        
        return {
            unclaimed_planets: unclaimedPlanets,
            expansion_readiness: expansionReadiness,
            strategic_patience: strategicPatience,
            expansion_opportunity_score: unclaimedPlanets * expansionReadiness * (1 - strategicPatience)
        };
    }

    function assessTerritorialExpansion() {
        const controlledPlanets = calculateControlledPlanets();
        const activeCampaigns = conquestGameState.activeCampaigns.length;
        const expansionRate = controlledPlanets / Math.max(1, Date.now() - conquestGameState.gameStartTime) * 86400000; // per day
        return { controlled_planets: controlledPlanets, active_campaigns: activeCampaigns, expansion_rate: expansionRate };
    }

    function assessMilitaryReadiness() {
        const aggression = conquestKnobs.military_aggression_level;
        const resourceAllocation = conquestKnobs.conquest_resource_allocation;
        const intelligence = conquestKnobs.intelligence_gathering_focus;
        const counterIntel = conquestKnobs.counter_intelligence;
        const readiness = (aggression + resourceAllocation + intelligence + counterIntel) / 4;
        return { readiness_score: readiness, aggression_level: aggression, intelligence_capability: intelligence };
    }

    function assessIntegrationCapacity() {
        const integrations = conquestGameState.integrationProcesses;
        const ongoingIntegrations = integrations.filter(i => i.status === 'in_progress').length;
        const integrationInvestment = conquestKnobs.integration_investment;
        const culturalFocus = conquestKnobs.cultural_assimilation_focus;
        const capacity = integrationInvestment * (1 - ongoingIntegrations * 0.1); // Capacity decreases with load
        return { current_load: ongoingIntegrations, investment_level: integrationInvestment, available_capacity: capacity };
    }

    function assessDiplomaticReputation() {
        const diplomaticPreference = conquestKnobs.diplomatic_conquest_preference;
        const civilianProtection = conquestKnobs.civilian_casualty_minimization;
        const culturalPreservation = conquestKnobs.cultural_preservation;
        const negotiationFlex = conquestKnobs.negotiation_flexibility;
        const reputation = (diplomaticPreference + civilianProtection + culturalPreservation + negotiationFlex) / 4;
        return { reputation_score: reputation, diplomatic_approach: diplomaticPreference, civilian_protection: civilianProtection };
    }

    function assessResistanceManagement() {
        const integrations = conquestGameState.integrationProcesses;
        const highResistance = integrations.filter(i => i.resistanceLevel > 0.7).length;
        const culturalPreservation = conquestKnobs.cultural_preservation;
        const propagandaCampaigns = conquestKnobs.propaganda_campaigns;
        const managementEffectiveness = (culturalPreservation + propagandaCampaigns) / 2;
        return { high_resistance_cases: highResistance, management_effectiveness: managementEffectiveness };
    }

    function generateConquestAIAlerts() {
        const alerts = [];
        
        // Military overextension alert
        const campaigns = conquestGameState.activeCampaigns;
        if (campaigns.length > 5) {
            alerts.push({ type: 'military_overextension', severity: 'high', message: 'Too many simultaneous campaigns may strain resources' });
        }
        
        // Integration backlog alert
        const integrations = conquestGameState.integrationProcesses;
        const stalled = integrations.filter(i => i.status === 'stalled').length;
        if (stalled > 3) {
            alerts.push({ type: 'integration_backlog', severity: 'medium', message: 'Multiple integration processes have stalled' });
        }
        
        // Diplomatic reputation alert
        const reputation = assessDiplomaticReputation();
        if (reputation.reputation_score < 0.4) {
            alerts.push({ type: 'diplomatic_reputation', severity: 'high', message: 'Poor diplomatic reputation may hinder future negotiations' });
        }
        
        // Resource strain alert
        const resourceAllocation = conquestKnobs.conquest_resource_allocation;
        if (resourceAllocation > 0.8 && campaigns.length > 3) {
            alerts.push({ type: 'resource_strain', severity: 'medium', message: 'High resource allocation to conquest may impact other systems' });
        }
        
        return alerts;
    }

    function calculateMilitaryResourceRequirements() {
        const campaigns = conquestGameState.activeCampaigns;
        const activeMilitary = campaigns.filter(c => c.approach === 'military').length;
        const resourceAllocation = conquestKnobs.conquest_resource_allocation;
        const aggression = conquestKnobs.military_aggression_level;
        
        return {
            active_military_campaigns: activeMilitary,
            resource_allocation_level: resourceAllocation,
            estimated_resource_drain: activeMilitary * resourceAllocation * aggression,
            military_readiness_impact: assessMilitaryReadiness().readiness_score
        };
    }

    function calculateDiplomaticImpacts() {
        const campaigns = conquestGameState.activeCampaigns;
        const diplomaticCampaigns = campaigns.filter(c => c.approach === 'diplomatic').length;
        const reputation = assessDiplomaticReputation();
        const alliancePriority = conquestKnobs.alliance_formation_priority;
        
        return {
            diplomatic_campaigns: diplomaticCampaigns,
            reputation_impact: reputation.reputation_score,
            alliance_building_focus: alliancePriority,
            diplomatic_capital_available: reputation.reputation_score * alliancePriority
        };
    }

    function calculateEconomicBenefits() {
        const integrations = conquestGameState.integrationProcesses;
        const completed = integrations.filter(i => i.status === 'completed');
        const economicValue = completed.reduce((sum, i) => sum + (i.economicValue || 0), 0);
        const infrastructureDev = conquestKnobs.infrastructure_development;
        const exploitationBalance = conquestKnobs.economic_exploitation_balance;
        
        return {
            completed_integrations: completed.length,
            total_economic_value: economicValue,
            infrastructure_investment: infrastructureDev,
            sustainable_exploitation: 1 - exploitationBalance // Lower exploitation = more sustainable
        };
    }

    function calculateCulturalAssimilation() {
        const integrations = conquestGameState.integrationProcesses;
        const culturalPreservation = conquestKnobs.cultural_preservation;
        const assimilationFocus = conquestKnobs.cultural_assimilation_focus;
        const governanceAdaptation = conquestKnobs.governance_model_adaptation;
        
        const avgCulturalIntegration = integrations.length > 0 ? 
            integrations.reduce((sum, i) => sum + (i.culturalIntegrationScore || 0), 0) / integrations.length : 0;
        
        return {
            cultural_preservation_level: culturalPreservation,
            assimilation_focus: assimilationFocus,
            governance_adaptation: governanceAdaptation,
            average_cultural_integration: avgCulturalIntegration
        };
    }

    function calculatePopulationManagement() {
        const integrations = conquestGameState.integrationProcesses;
        const populationRelocation = conquestKnobs.population_relocation;
        const civilianProtection = conquestKnobs.civilian_casualty_minimization;
        
        const totalPopulation = integrations.reduce((sum, i) => sum + (i.populationSize || 0), 0);
        const relocatedPopulation = totalPopulation * populationRelocation;
        
        return {
            total_managed_population: totalPopulation,
            relocation_policy_strength: populationRelocation,
            civilian_protection_level: civilianProtection,
            estimated_relocated_population: relocatedPopulation
        };
    }

    function calculateIntelligenceResults() {
        const intelligenceFocus = conquestKnobs.intelligence_gathering_focus;
        const sabotageOps = conquestKnobs.sabotage_operations;
        const propaganda = conquestKnobs.propaganda_campaigns;
        const counterIntel = conquestKnobs.counter_intelligence;
        
        const campaigns = conquestGameState.activeCampaigns;
        const intelSupportedCampaigns = campaigns.filter(c => c.hasIntelligenceSupport).length;
        
        return {
            intelligence_focus_level: intelligenceFocus,
            sabotage_operations_level: sabotageOps,
            propaganda_campaign_strength: propaganda,
            counter_intelligence_capability: counterIntel,
            intel_supported_campaigns: intelSupportedCampaigns,
            overall_intelligence_effectiveness: (intelligenceFocus + counterIntel) / 2
        };
    }

    // Apply AI knobs to actual conquest game state
    function applyConquestKnobsToGameState() {
        const campaigns = conquestGameState.activeCampaigns;
        const integrations = conquestGameState.integrationProcesses;
        
        // Apply military aggression to campaign outcomes
        const militaryAggression = conquestKnobs.military_aggression_level;
        campaigns.forEach(campaign => {
            if (campaign.approach === 'military' && campaign.status === 'active') {
                campaign.aggressionLevel = militaryAggression;
                campaign.successProbability = Math.min(0.95, campaign.basSuccessProbability * (1 + militaryAggression * 0.3));
                if (militaryAggression > 0.8) {
                    campaign.expectedDuration *= 0.7; // Faster but potentially more costly
                    campaign.resourceCost *= 1.3;
                }
            }
        });
        
        // Apply diplomatic preference to campaign selection
        const diplomaticPreference = conquestKnobs.diplomatic_conquest_preference;
        campaigns.forEach(campaign => {
            if (campaign.status === 'planning') {
                if (diplomaticPreference > 0.6) {
                    campaign.preferredApproach = 'diplomatic';
                    campaign.diplomaticSuccessBonus = diplomaticPreference * 0.2;
                } else {
                    campaign.preferredApproach = 'military';
                }
            }
        });
        
        // Apply integration investment to integration processes
        const integrationInvestment = conquestKnobs.integration_investment;
        integrations.forEach(integration => {
            if (integration.status === 'in_progress') {
                integration.investmentLevel = integrationInvestment;
                integration.progressRate = integration.baseProgressRate * (1 + integrationInvestment * 0.5);
                if (integrationInvestment > 0.7) {
                    integration.resistanceDecayRate *= 1.4; // Higher investment reduces resistance faster
                }
            }
        });
        
        // Apply cultural preservation to integration outcomes
        const culturalPreservation = conquestKnobs.cultural_preservation;
        integrations.forEach(integration => {
            integration.culturalPreservationLevel = culturalPreservation;
            if (culturalPreservation > 0.6) {
                integration.resistanceLevel *= 0.8; // Less resistance when culture is preserved
                integration.loyaltyGrowthRate *= 1.3; // Faster loyalty growth
            }
            integration.culturalIntegrationScore = culturalPreservation;
        });
        
        // Apply intelligence focus to campaign intelligence support
        const intelligenceFocus = conquestKnobs.intelligence_gathering_focus;
        campaigns.forEach(campaign => {
            if (intelligenceFocus > 0.6) {
                campaign.hasIntelligenceSupport = true;
                campaign.intelligenceQuality = intelligenceFocus;
                campaign.successProbability *= (1 + intelligenceFocus * 0.2);
            }
        });
        
        // Apply civilian casualty minimization to campaign conduct
        const civilianProtection = conquestKnobs.civilian_casualty_minimization;
        campaigns.forEach(campaign => {
            campaign.civilianProtectionLevel = civilianProtection;
            if (civilianProtection > 0.7) {
                campaign.diplomaticReputationImpact = 'positive';
                campaign.postConquestResistance *= 0.6; // Less resistance due to humane conduct
            } else if (civilianProtection < 0.3) {
                campaign.diplomaticReputationImpact = 'negative';
                campaign.postConquestResistance *= 1.4; // More resistance due to harsh conduct
            }
        });
        
        console.log('🎛️ Conquest knobs applied to game state:', {
            military_aggression: conquestKnobs.military_aggression_level,
            diplomatic_preference: conquestKnobs.diplomatic_conquest_preference,
            integration_investment: conquestKnobs.integration_investment,
            cultural_preservation: conquestKnobs.cultural_preservation,
            intelligence_focus: conquestKnobs.intelligence_gathering_focus
        });
    }

    // ===== AI INTEGRATION ENDPOINTS =====
    
    // Enhanced AI knob endpoints with multi-format input support
    app.get('/api/conquest/knobs', (req, res) => {
        const knobData = conquestKnobSystem.getKnobsWithMetadata();
        res.json({
            ...knobData,
            system: 'conquest',
            description: 'AI-adjustable parameters for conquest system with enhanced input support',
            input_help: conquestKnobSystem.getKnobDescriptions()
        });
    });

    app.post('/api/conquest/knobs', (req, res) => {
        const { knobs, source = 'ai' } = req.body;
        
        if (!knobs || typeof knobs !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid knobs data. Expected object with knob values.',
                help: conquestKnobSystem.getKnobDescriptions().examples
            });
        }
        
        // Update knobs using enhanced system
        const updateResult = conquestKnobSystem.updateKnobs(knobs, source);
        
        // Apply knobs to game state
        try {
            applyConquestKnobsToGameState();
        } catch (error) {
            console.error('Error applying conquest knobs to game state:', error);
        }
        
        res.json({
            success: updateResult.success,
            system: 'conquest',
            ...updateResult,
            message: 'Conquest knobs updated successfully using enhanced input processing'
        });
    });

    // Get knob help/documentation
    app.get('/api/conquest/knobs/help', (req, res) => {
        res.json({
            system: 'conquest',
            help: conquestKnobSystem.getKnobDescriptions(),
            current_values: conquestKnobSystem.getKnobsWithMetadata()
        });
    });

    // Get structured outputs for AI consumption
    app.get('/api/conquest/ai-data', (req, res) => {
        const structuredData = generateConquestStructuredOutputs();
        res.json({
            ...structuredData,
            description: 'Structured conquest data for AI analysis and decision-making'
        });
    });

    // Get cross-system integration data
    app.get('/api/conquest/cross-system', (req, res) => {
        const outputs = generateConquestStructuredOutputs();
        res.json({
            military_data: outputs.cross_system_data.military_resource_requirements,
            diplomatic_data: outputs.cross_system_data.diplomatic_relationship_impacts,
            economic_data: outputs.cross_system_data.economic_integration_benefits,
            cultural_data: outputs.cross_system_data.cultural_assimilation_progress,
            population_data: outputs.cross_system_data.population_management_data,
            intelligence_data: outputs.cross_system_data.intelligence_operation_results,
            conquest_summary: outputs.conquest_metrics,
            timestamp: outputs.timestamp
        });
    });

    console.log('Conquest APIs setup complete');
}

module.exports = { setupConquestAPIs };
