// Electoral AI - Manages election cycles, campaigns, and political dynamics
// Integrates with Enhanced Knob APIs for dynamic behavior adjustment

const EventEmitter = require('events');

class ElectoralAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // AI Processing Configuration
            systemId: config.systemId || 'electoral-ai',
            civilizationId: config.civilizationId,
            processingInterval: config.processingInterval || 60000, // 1 minute
            maxElectionsPerTick: config.maxElectionsPerTick || 5,
            
            // Electoral Behavior Parameters
            campaignIntensity: config.campaignIntensity || 0.7,
            voterVolatility: config.voterVolatility || 0.3,
            mediaInfluence: config.mediaInfluence || 0.6,
            economicImpact: config.economicImpact || 0.8
        };
        
        this.activeElections = new Map(); // electionId -> election data
        this.campaignEvents = new Map(); // electionId -> campaign events
        this.pollingData = new Map(); // electionId -> polling history
        this.mediaEvents = new Map(); // electionId -> media coverage events
        
        this.isProcessing = false;
        this.lastUpdate = 0;
        
        // Electoral event types for media coverage
        this.electoralEventTypes = [
            'CAMPAIGN_LAUNCH',
            'POLICY_ANNOUNCEMENT',
            'CANDIDATE_DEBATE',
            'POLLING_RELEASE',
            'ENDORSEMENT',
            'SCANDAL',
            'RALLY_EVENT',
            'ELECTION_RESULTS',
            'COALITION_FORMATION',
            'CAMPAIGN_PROMISE'
        ];
        
        console.log(`🗳️ Electoral AI initialized for civilization ${this.config.civilizationId}`);
    }
    
    // ===== CORE AI PROCESSING =====
    
    async processElectoralEvents(gameState) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        try {
            console.log('🗳️ Processing Electoral AI decisions...');
            
            // Get current knob settings from APIs
            const knobSettings = await this.getEnhancedKnobSettings();
            
            // Process active elections
            const electionUpdates = await this.processActiveElections(gameState, knobSettings);
            
            // Generate campaign activities
            const campaignActivities = await this.generateCampaignActivities(gameState, knobSettings);
            
            // Update polling data
            const pollingUpdates = await this.updatePollingData(gameState, knobSettings);
            
            // Generate media events
            const mediaEvents = await this.generateElectoralMediaEvents(gameState, knobSettings);
            
            // Apply electoral effects to game state
            const effects = await this.applyElectoralEffects([
                ...electionUpdates, 
                ...campaignActivities, 
                ...pollingUpdates,
                ...mediaEvents
            ], knobSettings);
            
            this.emit('electoral-decisions', {
                timestamp: Date.now(),
                elections: this.activeElections.size,
                campaignEvents: campaignActivities.length,
                pollingUpdates: pollingUpdates.length,
                mediaEvents: mediaEvents.length,
                effects
            });
            
            console.log(`✅ Processed ${electionUpdates.length + campaignActivities.length} electoral actions`);
            
        } catch (error) {
            console.error('❌ Electoral AI processing error:', error);
            this.emit('error', error);
        } finally {
            this.isProcessing = false;
            this.lastUpdate = Date.now();
        }
    }
    
    // ===== ENHANCED KNOB INTEGRATION =====
    
    async getEnhancedKnobSettings() {
        const settings = {};
        
        try {
            // Get electoral-specific knobs from the Enhanced Knob API
            const knobCategories = [
                'electoral_frequency',
                'campaign_intensity',
                'voter_engagement',
                'media_coverage',
                'political_stability',
                'coalition_likelihood',
                'scandal_frequency',
                'policy_impact'
            ];
            
            for (const category of knobCategories) {
                try {
                    // This would call the actual Enhanced Knob API
                    // For now, using default values with some variation
                    settings[category] = this.getDefaultKnobValue(category);
                } catch (error) {
                    console.warn(`Failed to get knob setting for ${category}:`, error);
                    settings[category] = this.getDefaultKnobValue(category);
                }
            }
            
        } catch (error) {
            console.error('Failed to get enhanced knob settings:', error);
            // Use default settings
            settings.electoral_frequency = 0.7;
            settings.campaign_intensity = 0.6;
            settings.voter_engagement = 0.5;
            settings.media_coverage = 0.8;
            settings.political_stability = 0.6;
            settings.coalition_likelihood = 0.4;
            settings.scandal_frequency = 0.2;
            settings.policy_impact = 0.7;
        }
        
        return settings;
    }
    
    getDefaultKnobValue(category) {
        const defaults = {
            electoral_frequency: 0.7,
            campaign_intensity: 0.6,
            voter_engagement: 0.5,
            media_coverage: 0.8,
            political_stability: 0.6,
            coalition_likelihood: 0.4,
            scandal_frequency: 0.2,
            policy_impact: 0.7
        };
        
        const baseValue = defaults[category] || 0.5;
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        return Math.max(0, Math.min(1, baseValue + variation));
    }
    
    // ===== ELECTORAL PROCESSING =====
    
    async processActiveElections(gameState, knobSettings) {
        const updates = [];
        const currentTime = Date.now();
        
        // Check for elections that need to start campaigns
        for (const [electionId, election] of this.activeElections) {
            if (election.status === 'scheduled' && 
                currentTime >= election.campaignStartTime) {
                
                const campaignStart = await this.startCampaignPeriod(election, knobSettings);
                updates.push(campaignStart);
                
                // Generate initial media coverage
                const mediaEvent = this.createMediaEvent(election, 'CAMPAIGN_LAUNCH', {
                    title: `Campaign Season Begins for ${election.type} Election`,
                    description: `Political parties launch campaigns for the upcoming ${election.type} election`,
                    parties: election.participatingParties,
                    keyIssues: this.generateKeyIssues(gameState, knobSettings)
                });
                
                this.addMediaEvent(electionId, mediaEvent);
                updates.push(mediaEvent);
            }
            
            // Check for elections that should conclude
            if (election.status === 'campaign_active' && 
                currentTime >= election.electionDate) {
                
                const electionResults = await this.conductElection(election, knobSettings);
                updates.push(electionResults);
                
                // Generate results media coverage
                const resultsEvent = this.createMediaEvent(election, 'ELECTION_RESULTS', {
                    title: `Election Results: ${electionResults.winner} Wins ${election.type} Election`,
                    description: `Final results show ${electionResults.winner} securing victory with ${electionResults.winnerPercentage}% of the vote`,
                    results: electionResults,
                    turnout: electionResults.turnout
                });
                
                this.addMediaEvent(electionId, resultsEvent);
                updates.push(resultsEvent);
            }
        }
        
        return updates;
    }
    
    async generateCampaignActivities(gameState, knobSettings) {
        const activities = [];
        
        // Generate campaign activities for active elections
        for (const [electionId, election] of this.activeElections) {
            if (election.status !== 'campaign_active') continue;
            
            // Determine activity frequency based on knob settings
            const activityChance = knobSettings.campaign_intensity * 0.3; // 30% base chance
            
            if (Math.random() < activityChance) {
                const activity = await this.generateCampaignActivity(election, gameState, knobSettings);
                activities.push(activity);
                
                // Add to campaign events
                if (!this.campaignEvents.has(electionId)) {
                    this.campaignEvents.set(electionId, []);
                }
                this.campaignEvents.get(electionId).push(activity);
                
                // Generate media coverage for significant activities
                if (activity.mediaWorthiness > 0.6) {
                    const mediaEvent = this.createMediaEvent(election, activity.type, {
                        title: activity.title,
                        description: activity.description,
                        party: activity.party,
                        location: activity.location,
                        impact: activity.expectedImpact
                    });
                    
                    this.addMediaEvent(electionId, mediaEvent);
                    activities.push(mediaEvent);
                }
            }
        }
        
        return activities;
    }
    
    async updatePollingData(gameState, knobSettings) {
        const updates = [];
        
        for (const [electionId, election] of this.activeElections) {
            if (election.status !== 'campaign_active') continue;
            
            // Generate polling updates based on campaign activities and events
            const pollChance = knobSettings.media_coverage * 0.2; // 20% base chance
            
            if (Math.random() < pollChance) {
                const pollUpdate = await this.generatePollingUpdate(election, gameState, knobSettings);
                updates.push(pollUpdate);
                
                // Add to polling history
                if (!this.pollingData.has(electionId)) {
                    this.pollingData.set(electionId, []);
                }
                this.pollingData.get(electionId).push(pollUpdate);
                
                // Generate media coverage for significant polling changes
                if (pollUpdate.significantChange) {
                    const mediaEvent = this.createMediaEvent(election, 'POLLING_RELEASE', {
                        title: `New Poll Shows ${pollUpdate.leader} Leading ${election.type} Race`,
                        description: `Latest polling data reveals shifting voter preferences with ${pollUpdate.leader} at ${pollUpdate.leaderPercentage}%`,
                        polling: pollUpdate,
                        trends: pollUpdate.trends
                    });
                    
                    this.addMediaEvent(electionId, mediaEvent);
                    updates.push(mediaEvent);
                }
            }
        }
        
        return updates;
    }
    
    async generateElectoralMediaEvents(gameState, knobSettings) {
        const mediaEvents = [];
        
        // Generate spontaneous electoral media events
        const mediaChance = knobSettings.media_coverage * knobSettings.scandal_frequency * 0.1;
        
        if (Math.random() < mediaChance) {
            for (const [electionId, election] of this.activeElections) {
                if (election.status !== 'campaign_active') continue;
                
                const eventType = this.selectRandomEventType(knobSettings);
                const mediaEvent = await this.generateSpontaneousMediaEvent(
                    election, 
                    eventType, 
                    gameState, 
                    knobSettings
                );
                
                if (mediaEvent) {
                    mediaEvents.push(mediaEvent);
                    this.addMediaEvent(electionId, mediaEvent);
                }
            }
        }
        
        return mediaEvents;
    }
    
    // ===== CAMPAIGN ACTIVITY GENERATION =====
    
    async generateCampaignActivity(election, gameState, knobSettings) {
        const activityTypes = [
            'RALLY_EVENT',
            'POLICY_ANNOUNCEMENT',
            'ENDORSEMENT',
            'CANDIDATE_DEBATE',
            'TOWN_HALL',
            'FUNDRAISER',
            'VOLUNTEER_DRIVE',
            'ADVERTISEMENT_CAMPAIGN'
        ];
        
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const party = this.selectRandomParty(election.participatingParties);
        
        const activity = {
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            electionId: election.id,
            type: activityType,
            party: party,
            timestamp: Date.now(),
            
            // Activity details
            title: this.generateActivityTitle(activityType, party),
            description: this.generateActivityDescription(activityType, party, gameState),
            location: this.generateActivityLocation(),
            
            // Impact metrics
            expectedImpact: this.calculateActivityImpact(activityType, knobSettings),
            mediaWorthiness: this.calculateMediaWorthiness(activityType, knobSettings),
            cost: this.calculateActivityCost(activityType),
            
            // Audience and reach
            targetDemographic: this.selectTargetDemographic(),
            expectedAttendance: this.calculateExpectedAttendance(activityType),
            
            // Key messages
            keyMessages: this.generateKeyMessages(party, gameState),
            
            // Metadata for AI processing
            aiGenerated: true,
            knobInfluence: {
                campaign_intensity: knobSettings.campaign_intensity,
                media_coverage: knobSettings.media_coverage
            }
        };
        
        return activity;
    }
    
    generateActivityTitle(type, party) {
        const titles = {
            'RALLY_EVENT': `${party} Holds Major Rally in Capital District`,
            'POLICY_ANNOUNCEMENT': `${party} Unveils New Policy Platform`,
            'ENDORSEMENT': `${party} Receives Key Endorsement from Labor Union`,
            'CANDIDATE_DEBATE': `${party} Participates in Televised Debate`,
            'TOWN_HALL': `${party} Hosts Community Town Hall Meeting`,
            'FUNDRAISER': `${party} Launches Major Fundraising Campaign`,
            'VOLUNTEER_DRIVE': `${party} Mobilizes Volunteers for Final Push`,
            'ADVERTISEMENT_CAMPAIGN': `${party} Launches New Advertisement Blitz`
        };
        
        return titles[type] || `${party} Campaign Event`;
    }
    
    generateActivityDescription(type, party, gameState) {
        const descriptions = {
            'RALLY_EVENT': `${party} energizes supporters with a high-energy rally focusing on economic growth and security issues.`,
            'POLICY_ANNOUNCEMENT': `${party} presents detailed policy proposals addressing key voter concerns about healthcare and education.`,
            'ENDORSEMENT': `${party} gains significant momentum with endorsement from major labor organization representing 50,000 workers.`,
            'CANDIDATE_DEBATE': `${party} candidate participates in prime-time debate, defending party positions on key issues.`,
            'TOWN_HALL': `${party} engages directly with voters in intimate town hall setting, answering questions on local concerns.`,
            'FUNDRAISER': `${party} launches ambitious fundraising drive to support final weeks of campaign advertising.`,
            'VOLUNTEER_DRIVE': `${party} mobilizes grassroots volunteers for door-to-door campaigning and voter registration.`,
            'ADVERTISEMENT_CAMPAIGN': `${party} unveils new series of advertisements highlighting party achievements and future plans.`
        };
        
        return descriptions[type] || `${party} conducts campaign activities to engage with voters.`;
    }
    
    // ===== POLLING GENERATION =====
    
    async generatePollingUpdate(election, gameState, knobSettings) {
        const parties = election.participatingParties;
        const previousPoll = this.getLatestPoll(election.id);
        
        // Generate new polling numbers with realistic variation
        const newPolling = {};
        let totalPercentage = 0;
        
        for (const party of parties) {
            const previousPercentage = previousPoll ? previousPoll.results[party] || 0 : Math.random() * 30;
            const variation = (Math.random() - 0.5) * 10 * knobSettings.voter_engagement; // ±5% max variation
            const newPercentage = Math.max(0, previousPercentage + variation);
            
            newPolling[party] = newPercentage;
            totalPercentage += newPercentage;
        }
        
        // Normalize to 100%
        for (const party of parties) {
            newPolling[party] = (newPolling[party] / totalPercentage) * 100;
        }
        
        // Determine leader and significant changes
        const sortedParties = parties.sort((a, b) => newPolling[b] - newPolling[a]);
        const leader = sortedParties[0];
        const leaderPercentage = newPolling[leader].toFixed(1);
        
        const significantChange = previousPoll ? 
            Math.abs(newPolling[leader] - (previousPoll.results[leader] || 0)) > 3 : false;
        
        const pollUpdate = {
            id: `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            electionId: election.id,
            timestamp: Date.now(),
            
            // Polling data
            results: newPolling,
            leader: leader,
            leaderPercentage: leaderPercentage,
            marginOfError: 2.5 + Math.random() * 2, // 2.5-4.5% margin of error
            sampleSize: 800 + Math.floor(Math.random() * 1200), // 800-2000 sample size
            
            // Analysis
            significantChange: significantChange,
            trends: this.calculatePollingTrends(newPolling, previousPoll),
            keyIssues: this.generateKeyIssues(gameState, knobSettings),
            
            // Metadata
            aiGenerated: true,
            knobInfluence: {
                voter_engagement: knobSettings.voter_engagement,
                political_stability: knobSettings.political_stability
            }
        };
        
        return pollUpdate;
    }
    
    calculatePollingTrends(currentPolling, previousPoll) {
        if (!previousPoll) return {};
        
        const trends = {};
        for (const [party, percentage] of Object.entries(currentPolling)) {
            const previousPercentage = previousPoll.results[party] || 0;
            const change = percentage - previousPercentage;
            
            if (change > 1) trends[party] = 'rising';
            else if (change < -1) trends[party] = 'falling';
            else trends[party] = 'stable';
        }
        
        return trends;
    }
    
    // ===== MEDIA EVENT GENERATION =====
    
    createMediaEvent(election, eventType, eventData) {
        return {
            id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            electionId: election.id,
            type: eventType,
            timestamp: Date.now(),
            
            // Media content
            headline: eventData.title,
            content: eventData.description,
            category: 'POLITICAL',
            
            // Electoral context
            electionContext: {
                electionType: election.type,
                daysUntilElection: Math.floor((election.electionDate - Date.now()) / (1000 * 60 * 60 * 24)),
                participatingParties: election.participatingParties
            },
            
            // Additional data
            eventData: eventData,
            
            // Media metrics
            importance: this.calculateEventImportance(eventType),
            virality: Math.random() * 100,
            
            // For Witter integration
            witterContent: this.generateWitterContent(eventType, eventData),
            newsContent: this.generateNewsContent(eventType, eventData),
            
            // Metadata
            aiGenerated: true,
            source: 'electoral-ai'
        };
    }
    
    generateWitterContent(eventType, eventData) {
        const witterTemplates = {
            'CAMPAIGN_LAUNCH': [
                `🗳️ Campaign season officially begins! ${eventData.parties?.join(' vs ')} gear up for what promises to be a competitive race. #Election2024`,
                `The gloves are off! Political parties launch campaigns with bold promises and ambitious platforms. Who will win your vote? 🤔`,
                `🎪 Campaign circus is back in town! Candidates hitting the trail with rallies, debates, and endless promises. Democracy in action! 🇺🇸`
            ],
            'POLLING_RELEASE': [
                `📊 NEW POLL: ${eventData.polling?.leader} leads with ${eventData.polling?.leaderPercentage}%! Race is heating up as election day approaches. #Polls`,
                `Polling update shows shifting voter preferences. ${eventData.trends ? 'Significant movement' : 'Steady race'} in latest numbers. 📈`,
                `🔢 Latest poll results are in! Margin of error keeps this race competitive. Every vote will count! #ElectionPolls`
            ],
            'ELECTION_RESULTS': [
                `🎉 ELECTION RESULTS: ${eventData.results?.winner} wins with ${eventData.results?.winnerPercentage}%! Voter turnout: ${eventData.turnout}% 🗳️`,
                `The people have spoken! ${eventData.results?.winner} secures victory in hard-fought election. Democracy works! ✅`,
                `🏆 Election night delivers decisive results. ${eventData.results?.winner} claims mandate with strong showing across key demographics.`
            ],
            'RALLY_EVENT': [
                `🎤 MASSIVE RALLY: ${eventData.party} draws huge crowd in ${eventData.location}! Energy is electric as supporters rally behind their candidate! 🔥`,
                `The crowd goes wild! ${eventData.party} rally packs the venue with enthusiastic supporters. Campaign momentum building! 📢`,
                `🚀 Rally attendance exceeds expectations! ${eventData.party} supporters show up in force to demonstrate their commitment. #Rally`
            ]
        };
        
        const templates = witterTemplates[eventType] || [`Political update: ${eventData.title}`];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    generateNewsContent(eventType, eventData) {
        return {
            headline: eventData.title,
            summary: eventData.description,
            body: this.generateDetailedNewsBody(eventType, eventData),
            category: 'Politics',
            tags: ['election', 'campaign', 'politics', 'democracy'],
            importance: this.calculateEventImportance(eventType)
        };
    }
    
    generateDetailedNewsBody(eventType, eventData) {
        // Generate more detailed news content based on event type
        const templates = {
            'CAMPAIGN_LAUNCH': `As the campaign season officially begins, political parties are mobilizing their resources and volunteers for what promises to be a competitive election. Key issues expected to dominate the campaign include economic policy, healthcare reform, and national security. Campaign strategists predict high voter engagement based on early polling data.`,
            
            'POLLING_RELEASE': `The latest polling data reveals shifting voter preferences as the election approaches. With a margin of error of ${eventData.polling?.marginOfError}%, the race remains competitive among the leading candidates. Political analysts note that undecided voters could play a crucial role in determining the final outcome.`,
            
            'ELECTION_RESULTS': `Election officials have confirmed the results following a day of voting that saw ${eventData.turnout}% voter turnout. The winning candidate secured victory with a platform focused on economic growth and social reform. Opposition parties have conceded defeat while promising to serve as a constructive opposition in the new term.`,
            
            'RALLY_EVENT': `The campaign rally drew thousands of supporters to ${eventData.location}, demonstrating strong grassroots enthusiasm for the candidate's message. Key policy announcements included commitments to job creation, infrastructure investment, and government reform. Security officials reported no incidents during the peaceful gathering.`
        };
        
        return templates[eventType] || `Political developments continue to shape the electoral landscape as candidates compete for voter support.`;
    }
    
    // ===== UTILITY METHODS =====
    
    addMediaEvent(electionId, mediaEvent) {
        if (!this.mediaEvents.has(electionId)) {
            this.mediaEvents.set(electionId, []);
        }
        this.mediaEvents.get(electionId).push(mediaEvent);
        
        // Emit for external systems (Witter, News)
        this.emit('media-event', mediaEvent);
    }
    
    getLatestPoll(electionId) {
        const polls = this.pollingData.get(electionId);
        return polls && polls.length > 0 ? polls[polls.length - 1] : null;
    }
    
    selectRandomParty(parties) {
        return parties[Math.floor(Math.random() * parties.length)];
    }
    
    selectRandomEventType(knobSettings) {
        const weightedEvents = [
            { type: 'POLICY_ANNOUNCEMENT', weight: knobSettings.campaign_intensity },
            { type: 'RALLY_EVENT', weight: knobSettings.campaign_intensity * 0.8 },
            { type: 'ENDORSEMENT', weight: knobSettings.media_coverage * 0.6 },
            { type: 'SCANDAL', weight: knobSettings.scandal_frequency },
            { type: 'CANDIDATE_DEBATE', weight: knobSettings.media_coverage * 0.7 }
        ];
        
        const totalWeight = weightedEvents.reduce((sum, event) => sum + event.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const event of weightedEvents) {
            random -= event.weight;
            if (random <= 0) return event.type;
        }
        
        return 'POLICY_ANNOUNCEMENT';
    }
    
    calculateEventImportance(eventType) {
        const importance = {
            'ELECTION_RESULTS': 100,
            'CANDIDATE_DEBATE': 85,
            'CAMPAIGN_LAUNCH': 80,
            'POLLING_RELEASE': 70,
            'SCANDAL': 90,
            'ENDORSEMENT': 60,
            'RALLY_EVENT': 55,
            'POLICY_ANNOUNCEMENT': 65
        };
        
        return importance[eventType] || 50;
    }
    
    calculateActivityImpact(activityType, knobSettings) {
        const baseImpact = {
            'RALLY_EVENT': 0.7,
            'POLICY_ANNOUNCEMENT': 0.8,
            'ENDORSEMENT': 0.6,
            'CANDIDATE_DEBATE': 0.9,
            'TOWN_HALL': 0.5,
            'FUNDRAISER': 0.4,
            'VOLUNTEER_DRIVE': 0.3,
            'ADVERTISEMENT_CAMPAIGN': 0.6
        };
        
        return (baseImpact[activityType] || 0.5) * knobSettings.campaign_intensity;
    }
    
    calculateMediaWorthiness(activityType, knobSettings) {
        const baseWorthiness = {
            'RALLY_EVENT': 0.8,
            'POLICY_ANNOUNCEMENT': 0.9,
            'ENDORSEMENT': 0.7,
            'CANDIDATE_DEBATE': 0.95,
            'TOWN_HALL': 0.4,
            'FUNDRAISER': 0.3,
            'VOLUNTEER_DRIVE': 0.2,
            'ADVERTISEMENT_CAMPAIGN': 0.5
        };
        
        return (baseWorthiness[activityType] || 0.5) * knobSettings.media_coverage;
    }
    
    generateKeyIssues(gameState, knobSettings) {
        const issues = [
            'Economic Growth and Jobs',
            'Healthcare Reform',
            'Education Funding',
            'National Security',
            'Environmental Policy',
            'Tax Policy',
            'Infrastructure Investment',
            'Social Programs',
            'Government Transparency',
            'Galactic Relations'
        ];
        
        // Select 3-5 key issues based on game state and knobs
        const numIssues = 3 + Math.floor(Math.random() * 3);
        const selectedIssues = [];
        
        while (selectedIssues.length < numIssues && selectedIssues.length < issues.length) {
            const issue = issues[Math.floor(Math.random() * issues.length)];
            if (!selectedIssues.includes(issue)) {
                selectedIssues.push(issue);
            }
        }
        
        return selectedIssues;
    }
    
    // ===== ELECTION MANAGEMENT =====
    
    async startCampaignPeriod(election, knobSettings) {
        election.status = 'campaign_active';
        election.campaignStarted = Date.now();
        
        console.log(`🎪 Campaign period started for ${election.type} election`);
        
        return {
            type: 'CAMPAIGN_START',
            electionId: election.id,
            timestamp: Date.now(),
            data: {
                electionType: election.type,
                participatingParties: election.participatingParties,
                campaignLength: election.campaignLength
            }
        };
    }
    
    async conductElection(election, knobSettings) {
        election.status = 'completed';
        
        // Simulate election results based on polling and campaign effectiveness
        const results = this.calculateElectionResults(election, knobSettings);
        election.results = results;
        
        console.log(`🗳️ Election completed: ${results.winner} wins with ${results.winnerPercentage}%`);
        
        // Schedule next election
        this.scheduleNextElection(election);
        
        return {
            type: 'ELECTION_COMPLETED',
            electionId: election.id,
            timestamp: Date.now(),
            data: results
        };
    }
    
    calculateElectionResults(election, knobSettings) {
        const parties = election.participatingParties;
        const latestPoll = this.getLatestPoll(election.id);
        
        const results = {};
        let totalVotes = 0;
        const baseVotes = 1000000; // Base voter population
        
        // Calculate votes based on polling with some variation
        for (const party of parties) {
            const pollingPercentage = latestPoll ? (latestPoll.results[party] || 0) : Math.random() * 30;
            const variation = (Math.random() - 0.5) * 10; // ±5% variation from polls
            const actualPercentage = Math.max(0, pollingPercentage + variation);
            const votes = Math.floor((actualPercentage / 100) * baseVotes);
            
            results[party] = {
                votes: votes,
                percentage: actualPercentage
            };
            totalVotes += votes;
        }
        
        // Normalize percentages
        for (const party of parties) {
            results[party].percentage = (results[party].votes / totalVotes) * 100;
        }
        
        // Determine winner
        const sortedParties = parties.sort((a, b) => results[b].percentage - results[a].percentage);
        const winner = sortedParties[0];
        
        return {
            winner: winner,
            winnerPercentage: results[winner].percentage.toFixed(1),
            results: results,
            totalVotes: totalVotes,
            turnout: 65 + Math.random() * 25 // 65-90% turnout
        };
    }
    
    scheduleNextElection(completedElection) {
        // Schedule the next election based on the election cycle
        const nextElectionDate = completedElection.electionDate + (completedElection.termLength * 365 * 24 * 60 * 60 * 1000);
        const campaignStartTime = nextElectionDate - (completedElection.campaignLength * 24 * 60 * 60 * 1000);
        
        const nextElection = {
            id: `election_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            civilizationId: completedElection.civilizationId,
            type: completedElection.type,
            electionDate: nextElectionDate,
            campaignStartTime: campaignStartTime,
            campaignLength: completedElection.campaignLength,
            termLength: completedElection.termLength,
            participatingParties: completedElection.participatingParties,
            status: 'scheduled'
        };
        
        this.activeElections.set(nextElection.id, nextElection);
        
        console.log(`📅 Next ${nextElection.type} election scheduled for ${new Date(nextElectionDate).toISOString()}`);
    }
    
    // ===== PUBLIC API =====
    
    addElection(electionData) {
        this.activeElections.set(electionData.id, electionData);
        console.log(`➕ Added election: ${electionData.id} (${electionData.type})`);
    }
    
    getElectionData(electionId) {
        return {
            election: this.activeElections.get(electionId),
            campaignEvents: this.campaignEvents.get(electionId) || [],
            polling: this.pollingData.get(electionId) || [],
            mediaEvents: this.mediaEvents.get(electionId) || []
        };
    }
    
    getAllElections() {
        return Array.from(this.activeElections.values());
    }
    
    getMediaEvents() {
        const allEvents = [];
        for (const events of this.mediaEvents.values()) {
            allEvents.push(...events);
        }
        return allEvents.sort((a, b) => b.timestamp - a.timestamp);
    }
}

module.exports = ElectoralAI;


