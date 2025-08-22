// Recurring Events AI - Manages galactic-scale recurring events like Olympics, Summits, Trade Fairs
// Integrates with Enhanced Knob APIs for dynamic event behavior and impact

const EventEmitter = require('events');

class RecurringEventsAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            // AI Processing Configuration
            processingInterval: config.processingInterval || 120000, // 2 minutes
            maxEventsPerTick: config.maxEventsPerTick || 5,
            decisionComplexity: config.decisionComplexity || 'high',
            
            // Event Behavior Parameters
            eventImpactScale: config.eventImpactScale || 0.8,
            participationThreshold: config.participationThreshold || 0.6,
            culturalInfluence: config.culturalInfluence || 0.7,
            
            ...config
        };
        
        this.eventTemplates = new Map(); // eventType -> template data
        this.activeEvents = new Map(); // eventId -> active event data
        this.eventHistory = new Map(); // eventId -> historical data
        this.eventSchedule = new Map(); // timestamp -> scheduled events
        this.participantData = new Map(); // civilizationId -> participation history
        
        this.isProcessing = false;
        this.lastUpdate = Date.now();
        
        // Enhanced Knob Integration
        this.knobEndpoints = {
            state: '/api/state/knobs',
            characters: '/api/characters/knobs',
            commerce: '/api/commerce/knobs',
            governance: '/api/governance/knobs',
            military: '/api/military/knobs',
            health: '/api/health/knobs',
            education: '/api/education/knobs'
        };
        
        // Initialize event templates
        this.initializeEventTemplates();
    }
    
    // ===== CORE AI PROCESSING =====
    
    async processRecurringEvents(gameState) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        try {
            console.log('🎪 Processing Recurring Events AI...');
            
            // Get current knob settings from APIs
            const knobSettings = await this.getEnhancedKnobSettings();
            
            // Check for scheduled events that should start
            const newEvents = await this.checkScheduledEvents(gameState, knobSettings);
            
            // Process active events
            const eventUpdates = await this.processActiveEvents(gameState, knobSettings);
            
            // Generate new event proposals
            const eventProposals = await this.generateEventProposals(gameState, knobSettings);
            
            // Apply all event actions
            const effects = await this.applyEventActions([...newEvents, ...eventUpdates, ...eventProposals], knobSettings);
            
            // Schedule future events
            await this.scheduleFutureEvents(gameState, knobSettings);
            
            this.emit('recurring-events', {
                timestamp: Date.now(),
                newEvents: newEvents.length,
                activeEvents: this.activeEvents.size,
                eventUpdates: eventUpdates.length,
                proposals: eventProposals.length,
                effects
            });
            
            console.log(`✅ Processed ${newEvents.length + eventUpdates.length + eventProposals.length} event actions`);
            
        } catch (error) {
            console.error('❌ Recurring Events AI processing error:', error);
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
            for (const [system, endpoint] of Object.entries(this.knobEndpoints)) {
                const response = await fetch(`http://localhost:4000${endpoint}`);
                if (response.ok) {
                    const data = await response.json();
                    settings[system] = data.knobs;
                }
            }
            
            return settings;
        } catch (error) {
            console.error('Error fetching recurring events knob settings:', error);
            return {};
        }
    }
    
    async updateSystemKnobs(system, knobUpdates) {
        try {
            const endpoint = this.knobEndpoints[system];
            if (!endpoint) return false;
            
            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ knobs: knobUpdates })
            });
            
            return response.ok;
        } catch (error) {
            console.error(`Error updating ${system} knobs:`, error);
            return false;
        }
    }
    
    // ===== EVENT TEMPLATES INITIALIZATION =====
    
    initializeEventTemplates() {
        // Galactic Olympics
        this.eventTemplates.set('galactic_olympics', {
            name: 'Galactic Olympics',
            type: 'galactic_olympics',
            frequency: 4 * 365 * 24 * 60 * 60 * 1000, // Every 4 years
            duration: 30 * 24 * 60 * 60 * 1000, // 30 days
            minParticipants: 3,
            maxParticipants: 20,
            categories: ['athletics', 'technology', 'arts', 'diplomacy', 'innovation'],
            impacts: {
                cultural: 0.8,
                diplomatic: 0.7,
                economic: 0.6,
                social: 0.9
            },
            requirements: {
                minCivilizationLevel: 3,
                minDiplomaticStanding: 0.4
            }
        });
        
        // Galactic Trade Summit
        this.eventTemplates.set('trade_summit', {
            name: 'Galactic Trade Summit',
            type: 'trade_summit',
            frequency: 2 * 365 * 24 * 60 * 60 * 1000, // Every 2 years
            duration: 14 * 24 * 60 * 60 * 1000, // 14 days
            minParticipants: 2,
            maxParticipants: 15,
            categories: ['trade_agreements', 'resource_sharing', 'technology_transfer', 'currency_cooperation'],
            impacts: {
                economic: 0.9,
                diplomatic: 0.6,
                technological: 0.5
            },
            requirements: {
                minEconomicStrength: 0.3,
                minTradeVolume: 1000000
            }
        });
        
        // Interstellar Science Conference
        this.eventTemplates.set('science_conference', {
            name: 'Interstellar Science Conference',
            type: 'science_conference',
            frequency: 3 * 365 * 24 * 60 * 60 * 1000, // Every 3 years
            duration: 21 * 24 * 60 * 60 * 1000, // 21 days
            minParticipants: 2,
            maxParticipants: 12,
            categories: ['research_collaboration', 'knowledge_sharing', 'joint_projects', 'innovation_showcase'],
            impacts: {
                technological: 0.9,
                educational: 0.8,
                cultural: 0.4,
                economic: 0.3
            },
            requirements: {
                minResearchLevel: 0.5,
                minEducationIndex: 0.4
            }
        });
        
        // Galactic Peace Summit
        this.eventTemplates.set('peace_summit', {
            name: 'Galactic Peace Summit',
            type: 'peace_summit',
            frequency: 5 * 365 * 24 * 60 * 60 * 1000, // Every 5 years
            duration: 7 * 24 * 60 * 60 * 1000, // 7 days
            minParticipants: 2,
            maxParticipants: 10,
            categories: ['conflict_resolution', 'peace_treaties', 'disarmament', 'humanitarian_cooperation'],
            impacts: {
                diplomatic: 0.9,
                military: -0.3, // Reduces military tension
                social: 0.6,
                cultural: 0.5
            },
            requirements: {
                minConflictLevel: 0.3, // Only when there's some conflict
                minDiplomaticCapability: 0.4
            }
        });
        
        // Cultural Exchange Festival
        this.eventTemplates.set('cultural_festival', {
            name: 'Galactic Cultural Exchange Festival',
            type: 'cultural_festival',
            frequency: 1.5 * 365 * 24 * 60 * 60 * 1000, // Every 1.5 years
            duration: 10 * 24 * 60 * 60 * 1000, // 10 days
            minParticipants: 3,
            maxParticipants: 25,
            categories: ['art_exhibition', 'music_performance', 'culinary_exchange', 'literature_sharing'],
            impacts: {
                cultural: 0.9,
                social: 0.8,
                diplomatic: 0.5,
                tourism: 0.7
            },
            requirements: {
                minCulturalDiversity: 0.3,
                minArtisticDevelopment: 0.2
            }
        });
        
        // Emergency Crisis Response Summit
        this.eventTemplates.set('crisis_summit', {
            name: 'Emergency Crisis Response Summit',
            type: 'crisis_summit',
            frequency: 0, // Event-driven, not scheduled
            duration: 3 * 24 * 60 * 60 * 1000, // 3 days
            minParticipants: 2,
            maxParticipants: 8,
            categories: ['crisis_response', 'resource_allocation', 'joint_action', 'humanitarian_aid'],
            impacts: {
                diplomatic: 0.7,
                military: 0.4,
                social: 0.6,
                economic: -0.2 // Costs resources
            },
            requirements: {
                crisisLevel: 0.7, // Only during major crises
                minResponseCapability: 0.3
            }
        });
    }
    
    // ===== EVENT SCHEDULING =====
    
    async scheduleFutureEvents(gameState, knobSettings) {
        const currentTime = Date.now();
        const characters = knobSettings.characters || {};
        
        // Schedule regular recurring events
        for (const [eventType, template] of this.eventTemplates.entries()) {
            if (template.frequency === 0) continue; // Skip event-driven events
            
            // Check if this event type needs to be scheduled
            const lastEvent = this.getLastEventOfType(eventType);
            const nextScheduledTime = lastEvent ? 
                lastEvent.endTime + template.frequency : 
                currentTime + (template.frequency * Math.random() * 0.3); // Random start within 30% of frequency
            
            // Only schedule if not already scheduled and time has come
            if (nextScheduledTime <= currentTime + (7 * 24 * 60 * 60 * 1000)) { // Within next week
                if (!this.isEventScheduled(eventType, nextScheduledTime)) {
                    await this.scheduleEvent(eventType, nextScheduledTime, knobSettings);
                }
            }
        }
    }
    
    async scheduleEvent(eventType, scheduledTime, knobSettings) {
        const template = this.eventTemplates.get(eventType);
        if (!template) return;
        
        const eventId = `${eventType}_${scheduledTime}_${Math.random().toString(36).substr(2, 9)}`;
        
        const scheduledEvent = {
            id: eventId,
            type: eventType,
            template,
            scheduledTime,
            status: 'scheduled',
            participants: [],
            created: Date.now()
        };
        
        this.eventSchedule.set(scheduledTime, scheduledEvent);
        
        console.log(`📅 Scheduled ${template.name} for ${new Date(scheduledTime).toISOString()}`);
    }
    
    // ===== EVENT PROCESSING =====
    
    async checkScheduledEvents(gameState, knobSettings) {
        const newEvents = [];
        const currentTime = Date.now();
        
        // Check scheduled events that should start
        for (const [scheduledTime, scheduledEvent] of this.eventSchedule.entries()) {
            if (scheduledTime <= currentTime && scheduledEvent.status === 'scheduled') {
                try {
                    const startedEvent = await this.startScheduledEvent(scheduledEvent, gameState, knobSettings);
                    if (startedEvent) {
                        newEvents.push(startedEvent);
                        this.eventSchedule.delete(scheduledTime);
                    }
                } catch (error) {
                    console.error(`Error starting scheduled event ${scheduledEvent.id}:`, error);
                }
            }
        }
        
        return newEvents;
    }
    
    async startScheduledEvent(scheduledEvent, gameState, knobSettings) {
        const template = scheduledEvent.template;
        
        // Find eligible participants
        const eligibleParticipants = await this.findEligibleParticipants(template, gameState, knobSettings);
        
        if (eligibleParticipants.length < template.minParticipants) {
            console.log(`⚠️ Not enough participants for ${template.name} (${eligibleParticipants.length}/${template.minParticipants})`);
            return null;
        }
        
        // Select participants
        const selectedParticipants = this.selectEventParticipants(eligibleParticipants, template);
        
        // Create active event
        const activeEvent = {
            id: scheduledEvent.id,
            type: scheduledEvent.type,
            template,
            participants: selectedParticipants,
            startTime: Date.now(),
            endTime: Date.now() + template.duration,
            status: 'active',
            progress: 0.0,
            outcomes: {},
            activities: []
        };
        
        this.activeEvents.set(activeEvent.id, activeEvent);
        
        return {
            id: `event_start_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'event_start',
            eventId: activeEvent.id,
            eventType: activeEvent.type,
            participants: selectedParticipants,
            reasoning: `Starting ${template.name} with ${selectedParticipants.length} participants`,
            consequences: this.generateEventStartConsequences(activeEvent, knobSettings)
        };
    }
    
    async processActiveEvents(gameState, knobSettings) {
        const eventUpdates = [];
        const currentTime = Date.now();
        
        for (const [eventId, activeEvent] of this.activeEvents.entries()) {
            try {
                // Update event progress
                const progressUpdate = this.calculateEventProgress(activeEvent, currentTime);
                activeEvent.progress = progressUpdate.progress;
                
                // Generate event activities
                const activities = await this.generateEventActivities(activeEvent, gameState, knobSettings);
                activeEvent.activities.push(...activities);
                
                // Check if event should end
                if (currentTime >= activeEvent.endTime || activeEvent.progress >= 1.0) {
                    const endResult = await this.endEvent(activeEvent, knobSettings);
                    eventUpdates.push(endResult);
                    this.activeEvents.delete(eventId);
                } else {
                    // Generate ongoing event effects
                    const ongoingEffects = await this.generateOngoingEventEffects(activeEvent, knobSettings);
                    if (ongoingEffects) {
                        eventUpdates.push(ongoingEffects);
                    }
                }
                
            } catch (error) {
                console.error(`Error processing active event ${eventId}:`, error);
            }
        }
        
        return eventUpdates;
    }
    
    async generateEventProposals(gameState, knobSettings) {
        const proposals = [];
        const state = knobSettings.state || {};
        
        // Check for crisis-driven events
        if (gameState.crisisLevel > 0.7) {
            const crisisProposal = await this.generateCrisisSummitProposal(gameState, knobSettings);
            if (crisisProposal) proposals.push(crisisProposal);
        }
        
        // Check for special opportunity events
        const opportunityEvents = await this.identifyOpportunityEvents(gameState, knobSettings);
        proposals.push(...opportunityEvents);
        
        return proposals;
    }
    
    // ===== EVENT ACTIVITIES GENERATION =====
    
    async generateEventActivities(activeEvent, gameState, knobSettings) {
        const activities = [];
        const template = activeEvent.template;
        
        // Generate activities based on event type and progress
        switch (activeEvent.type) {
            case 'galactic_olympics':
                activities.push(...await this.generateOlympicsActivities(activeEvent, knobSettings));
                break;
            case 'trade_summit':
                activities.push(...await this.generateTradeSummitActivities(activeEvent, knobSettings));
                break;
            case 'science_conference':
                activities.push(...await this.generateScienceConferenceActivities(activeEvent, knobSettings));
                break;
            case 'peace_summit':
                activities.push(...await this.generatePeaceSummitActivities(activeEvent, knobSettings));
                break;
            case 'cultural_festival':
                activities.push(...await this.generateCulturalFestivalActivities(activeEvent, knobSettings));
                break;
            case 'crisis_summit':
                activities.push(...await this.generateCrisisSummitActivities(activeEvent, knobSettings));
                break;
        }
        
        return activities;
    }
    
    async generateOlympicsActivities(activeEvent, knobSettings) {
        const activities = [];
        const characters = knobSettings.characters || {};
        
        // Generate competitive events
        if (Math.random() < 0.4) {
            activities.push({
                type: 'athletic_competition',
                category: 'athletics',
                participants: this.selectRandomParticipants(activeEvent.participants, 3),
                outcome: 'medal_ceremony',
                impact: {
                    cultural: '+1',
                    social: '+1'
                }
            });
        }
        
        // Generate technology showcases
        if (Math.random() < 0.3) {
            activities.push({
                type: 'technology_showcase',
                category: 'technology',
                participants: this.selectRandomParticipants(activeEvent.participants, 2),
                outcome: 'innovation_recognition',
                impact: {
                    education: '+1',
                    commerce: '+1'
                }
            });
        }
        
        return activities;
    }
    
    async generateTradeSummitActivities(activeEvent, knobSettings) {
        const activities = [];
        const commerce = knobSettings.commerce || {};
        
        // Generate trade negotiations
        if (Math.random() < 0.5) {
            activities.push({
                type: 'trade_negotiation',
                category: 'trade_agreements',
                participants: this.selectRandomParticipants(activeEvent.participants, 2),
                outcome: 'trade_deal_signed',
                impact: {
                    commerce: '+2',
                    state: '+1'
                }
            });
        }
        
        return activities;
    }
    
    async generateScienceConferenceActivities(activeEvent, knobSettings) {
        const activities = [];
        
        // Generate research presentations
        if (Math.random() < 0.4) {
            activities.push({
                type: 'research_presentation',
                category: 'knowledge_sharing',
                participants: this.selectRandomParticipants(activeEvent.participants, 1),
                outcome: 'breakthrough_shared',
                impact: {
                    education: '+2',
                    health: '+1'
                }
            });
        }
        
        return activities;
    }
    
    async generatePeaceSummitActivities(activeEvent, knobSettings) {
        const activities = [];
        
        // Generate peace negotiations
        if (Math.random() < 0.6) {
            activities.push({
                type: 'peace_negotiation',
                category: 'conflict_resolution',
                participants: this.selectRandomParticipants(activeEvent.participants, 2),
                outcome: 'ceasefire_agreement',
                impact: {
                    state: '+2',
                    military: '-1'
                }
            });
        }
        
        return activities;
    }
    
    async generateCulturalFestivalActivities(activeEvent, knobSettings) {
        const activities = [];
        
        // Generate cultural performances
        if (Math.random() < 0.5) {
            activities.push({
                type: 'cultural_performance',
                category: 'art_exhibition',
                participants: this.selectRandomParticipants(activeEvent.participants, 1),
                outcome: 'cultural_appreciation',
                impact: {
                    characters: '+1',
                    state: '+1'
                }
            });
        }
        
        return activities;
    }
    
    async generateCrisisSummitActivities(activeEvent, knobSettings) {
        const activities = [];
        
        // Generate crisis response planning
        if (Math.random() < 0.7) {
            activities.push({
                type: 'crisis_response_planning',
                category: 'joint_action',
                participants: activeEvent.participants,
                outcome: 'coordinated_response',
                impact: {
                    governance: '+2',
                    military: '+1'
                }
            });
        }
        
        return activities;
    }
    
    // ===== EVENT CONSEQUENCES =====
    
    generateEventStartConsequences(activeEvent, knobSettings) {
        const consequences = {};
        const template = activeEvent.template;
        
        // Apply start-of-event impacts
        for (const [impactType, impactValue] of Object.entries(template.impacts)) {
            if (this.knobEndpoints[impactType]) {
                consequences[impactType] = {
                    [`${activeEvent.type}_participation`]: `+${Math.floor(impactValue * 2)}`
                };
            }
        }
        
        return consequences;
    }
    
    async generateOngoingEventEffects(activeEvent, knobSettings) {
        // Generate effects based on recent activities
        const recentActivities = activeEvent.activities.slice(-3);
        if (recentActivities.length === 0) return null;
        
        const consequences = {};
        
        for (const activity of recentActivities) {
            for (const [system, effect] of Object.entries(activity.impact)) {
                if (this.knobEndpoints[system]) {
                    if (!consequences[system]) consequences[system] = {};
                    consequences[system][`${activity.type}_effect`] = effect;
                }
            }
        }
        
        return {
            id: `event_ongoing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'event_ongoing_effects',
            eventId: activeEvent.id,
            reasoning: `Ongoing effects from ${activeEvent.template.name}`,
            consequences
        };
    }
    
    async endEvent(activeEvent, knobSettings) {
        // Calculate final outcomes
        const outcomes = await this.calculateEventOutcomes(activeEvent);
        activeEvent.outcomes = outcomes;
        
        // Move to history
        this.eventHistory.set(activeEvent.id, {
            ...activeEvent,
            completedAt: Date.now()
        });
        
        // Update participant data
        for (const participantId of activeEvent.participants) {
            this.updateParticipantHistory(participantId, activeEvent);
        }
        
        return {
            id: `event_end_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'event_end',
            eventId: activeEvent.id,
            eventType: activeEvent.type,
            outcomes,
            reasoning: `Completed ${activeEvent.template.name} with ${activeEvent.activities.length} activities`,
            consequences: this.generateEventEndConsequences(activeEvent, outcomes, knobSettings)
        };
    }
    
    async calculateEventOutcomes(activeEvent) {
        const outcomes = {
            success: activeEvent.progress >= 0.8,
            participationLevel: activeEvent.participants.length / activeEvent.template.maxParticipants,
            activitiesCompleted: activeEvent.activities.length,
            culturalImpact: this.calculateCulturalImpact(activeEvent),
            economicImpact: this.calculateEconomicImpact(activeEvent),
            diplomaticImpact: this.calculateDiplomaticImpact(activeEvent)
        };
        
        return outcomes;
    }
    
    generateEventEndConsequences(activeEvent, outcomes, knobSettings) {
        const consequences = {};
        const template = activeEvent.template;
        
        // Apply end-of-event impacts based on success
        const successMultiplier = outcomes.success ? 1.5 : 0.7;
        
        for (const [impactType, impactValue] of Object.entries(template.impacts)) {
            if (this.knobEndpoints[impactType]) {
                const finalImpact = Math.floor(impactValue * successMultiplier * 3);
                consequences[impactType] = {
                    [`${activeEvent.type}_completion`]: `+${finalImpact}`,
                    [`galactic_event_participation`]: outcomes.success ? 'high' : 'medium'
                };
            }
        }
        
        return consequences;
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    async findEligibleParticipants(template, gameState, knobSettings) {
        const eligible = [];
        
        // In a real implementation, this would check actual civilization data
        // For now, simulate eligible civilizations
        const simulatedCivilizations = ['civ_alpha', 'civ_beta', 'civ_gamma', 'civ_delta', 'civ_epsilon'];
        
        for (const civId of simulatedCivilizations) {
            if (this.checkEligibility(civId, template, gameState)) {
                eligible.push(civId);
            }
        }
        
        return eligible;
    }
    
    checkEligibility(civilizationId, template, gameState) {
        // Simplified eligibility check
        return Math.random() > 0.3; // 70% chance of eligibility
    }
    
    selectEventParticipants(eligibleParticipants, template) {
        const maxParticipants = Math.min(template.maxParticipants, eligibleParticipants.length);
        const numParticipants = Math.max(template.minParticipants, 
            Math.floor(Math.random() * (maxParticipants - template.minParticipants + 1)) + template.minParticipants);
        
        // Randomly select participants
        const shuffled = [...eligibleParticipants].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, numParticipants);
    }
    
    selectRandomParticipants(participants, count) {
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, participants.length));
    }
    
    calculateEventProgress(activeEvent, currentTime) {
        const elapsed = currentTime - activeEvent.startTime;
        const duration = activeEvent.endTime - activeEvent.startTime;
        const timeProgress = Math.min(1.0, elapsed / duration);
        
        // Factor in activities completed
        const activityProgress = Math.min(1.0, activeEvent.activities.length / 10);
        
        // Weighted average
        const progress = (timeProgress * 0.7) + (activityProgress * 0.3);
        
        return { progress, timeProgress, activityProgress };
    }
    
    calculateCulturalImpact(activeEvent) {
        return activeEvent.activities.filter(a => a.category.includes('cultural') || a.category.includes('art')).length * 0.2;
    }
    
    calculateEconomicImpact(activeEvent) {
        return activeEvent.activities.filter(a => a.category.includes('trade') || a.category.includes('economic')).length * 0.3;
    }
    
    calculateDiplomaticImpact(activeEvent) {
        return activeEvent.activities.filter(a => a.category.includes('diplomatic') || a.category.includes('peace')).length * 0.25;
    }
    
    getLastEventOfType(eventType) {
        for (const event of this.eventHistory.values()) {
            if (event.type === eventType) {
                return event;
            }
        }
        return null;
    }
    
    isEventScheduled(eventType, scheduledTime) {
        for (const scheduledEvent of this.eventSchedule.values()) {
            if (scheduledEvent.type === eventType && 
                Math.abs(scheduledEvent.scheduledTime - scheduledTime) < 24 * 60 * 60 * 1000) {
                return true;
            }
        }
        return false;
    }
    
    updateParticipantHistory(participantId, activeEvent) {
        let history = this.participantData.get(participantId);
        if (!history) {
            history = {
                participantId,
                eventsParticipated: [],
                totalEvents: 0,
                successfulEvents: 0
            };
            this.participantData.set(participantId, history);
        }
        
        history.eventsParticipated.push({
            eventId: activeEvent.id,
            eventType: activeEvent.type,
            startTime: activeEvent.startTime,
            endTime: activeEvent.endTime,
            success: activeEvent.outcomes.success
        });
        
        history.totalEvents++;
        if (activeEvent.outcomes.success) {
            history.successfulEvents++;
        }
        
        // Keep only recent history
        if (history.eventsParticipated.length > 20) {
            history.eventsParticipated = history.eventsParticipated.slice(-20);
        }
    }
    
    async generateCrisisSummitProposal(gameState, knobSettings) {
        return {
            id: `crisis_proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'crisis_event_proposal',
            eventType: 'crisis_summit',
            reasoning: 'High crisis level requires emergency summit',
            urgency: 'high',
            consequences: {
                governance: {
                    crisis_response_readiness: '+2'
                },
                state: {
                    emergency_diplomacy: 'high'
                }
            }
        };
    }
    
    async identifyOpportunityEvents(gameState, knobSettings) {
        const opportunities = [];
        
        // Check for special conditions that might trigger bonus events
        if (gameState.technologicalBreakthrough) {
            opportunities.push({
                id: `tech_showcase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'special_tech_showcase',
                reasoning: 'Recent technological breakthrough warrants special showcase',
                consequences: {
                    education: { technology_showcase: '+2' },
                    commerce: { innovation_promotion: '+1' }
                }
            });
        }
        
        return opportunities;
    }
    
    // ===== ACTION APPLICATION =====
    
    async applyEventActions(actions, knobSettings) {
        const effects = {
            systemUpdates: {},
            eventsStarted: 0,
            eventsCompleted: 0,
            activitiesGenerated: 0
        };
        
        for (const action of actions) {
            try {
                // Apply consequences to relevant systems
                for (const [system, knobUpdates] of Object.entries(action.consequences)) {
                    if (this.knobEndpoints[system]) {
                        await this.updateSystemKnobs(system, knobUpdates);
                        effects.systemUpdates[system] = knobUpdates;
                    }
                }
                
                // Track action types
                if (action.type === 'event_start') {
                    effects.eventsStarted++;
                } else if (action.type === 'event_end') {
                    effects.eventsCompleted++;
                } else if (action.type === 'event_ongoing_effects') {
                    effects.activitiesGenerated++;
                }
                
            } catch (error) {
                console.error(`Error applying event action ${action.id}:`, error);
            }
        }
        
        return effects;
    }
    
    // ===== ANALYTICS & REPORTING =====
    
    getRecurringEventsAnalytics() {
        const activeEvents = Array.from(this.activeEvents.values());
        const historicalEvents = Array.from(this.eventHistory.values());
        const scheduledEvents = Array.from(this.eventSchedule.values());
        
        return {
            activeEvents: activeEvents.length,
            scheduledEvents: scheduledEvents.length,
            completedEvents: historicalEvents.length,
            eventTypes: this.getEventTypeDistribution([...activeEvents, ...historicalEvents]),
            averageParticipation: this.calculateAverageParticipation(historicalEvents),
            successRate: this.calculateEventSuccessRate(historicalEvents),
            upcomingEvents: this.getUpcomingEvents()
        };
    }
    
    getEventTypeDistribution(events) {
        const distribution = {};
        for (const event of events) {
            distribution[event.type] = (distribution[event.type] || 0) + 1;
        }
        return distribution;
    }
    
    calculateAverageParticipation(events) {
        if (events.length === 0) return 0;
        return events.reduce((sum, e) => sum + e.participants.length, 0) / events.length;
    }
    
    calculateEventSuccessRate(events) {
        if (events.length === 0) return 0;
        const successful = events.filter(e => e.outcomes && e.outcomes.success).length;
        return successful / events.length;
    }
    
    getUpcomingEvents() {
        const upcoming = [];
        const currentTime = Date.now();
        const oneMonthFromNow = currentTime + (30 * 24 * 60 * 60 * 1000);
        
        for (const [scheduledTime, event] of this.eventSchedule.entries()) {
            if (scheduledTime > currentTime && scheduledTime <= oneMonthFromNow) {
                upcoming.push({
                    eventType: event.type,
                    scheduledTime,
                    daysUntil: Math.ceil((scheduledTime - currentTime) / (24 * 60 * 60 * 1000))
                });
            }
        }
        
        return upcoming.sort((a, b) => a.scheduledTime - b.scheduledTime);
    }
    
    // ===== LIFECYCLE MANAGEMENT =====
    
    start() {
        console.log('🎪 Starting Recurring Events AI system...');
        this.emit('started');
    }
    
    stop() {
        console.log('🎪 Stopping Recurring Events AI system...');
        this.emit('stopped');
    }
    
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            lastUpdate: this.lastUpdate,
            eventTemplates: this.eventTemplates.size,
            activeEvents: this.activeEvents.size,
            scheduledEvents: this.eventSchedule.size,
            eventHistory: this.eventHistory.size,
            config: this.config
        };
    }
}

module.exports = { RecurringEventsAI };
