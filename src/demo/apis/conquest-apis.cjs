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

    console.log('Conquest APIs setup complete');
}

module.exports = { setupConquestAPIs };
