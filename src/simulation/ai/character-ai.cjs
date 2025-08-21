/**
 * Character AI - Strategic Character Simulation System
 * 
 * This AI system manages:
 * - Dynamic character behavior based on game conditions
 * - Strategic character interactions and consequences
 * - Character injection and lifecycle management
 * - Real actions with real game impact
 * - Cost-optimized selective character simulation
 */

class CharacterAI {
    constructor(gameConfig) {
        this.gameConfig = gameConfig;
        this.activeCharacters = new Map();
        this.characterPool = new Map();
        this.interactionQueue = [];
        this.actionCooldowns = new Map();
        this.storyContext = null;
        
        // Character categories and their simulation priorities
        this.characterCategories = {
            leaders: { priority: 1.0, maxActive: 5, simulationFrequency: 1.0 },
            diplomats: { priority: 0.8, maxActive: 8, simulationFrequency: 0.7 },
            businessLeaders: { priority: 0.7, maxActive: 10, simulationFrequency: 0.6 },
            military: { priority: 0.6, maxActive: 6, simulationFrequency: 0.5 },
            scientists: { priority: 0.5, maxActive: 4, simulationFrequency: 0.4 },
            citizens: { priority: 0.3, maxActive: 15, simulationFrequency: 0.2 },
            minorCharacters: { priority: 0.2, maxActive: 20, simulationFrequency: 0.1 }
        };
        
        // Action types and their impact levels
        this.actionTypes = {
            diplomatic: { impact: 'high', cost: 'high', frequency: 'low' },
            economic: { impact: 'medium', cost: 'medium', frequency: 'medium' },
            social: { impact: 'low', cost: 'low', frequency: 'high' },
            military: { impact: 'high', cost: 'high', frequency: 'very_low' },
            political: { impact: 'high', cost: 'medium', frequency: 'low' },
            cultural: { impact: 'medium', cost: 'low', frequency: 'medium' }
        };
        
        console.log('🎭 Character AI system initialized');
    }

    /**
     * Main processing function - called every simulation tick
     */
    async processCharacterTick(gameState, allCivs, activeEvents) {
        const decisions = {
            characterActions: [],
            newCharacters: [],
            characterUpdates: [],
            interactions: [],
            consequences: []
        };

        try {
            // Analyze game conditions for character opportunities
            const gameAnalysis = this.analyzeGameConditions(gameState, allCivs, activeEvents);
            
            // Determine which characters should be active this tick
            const activeCharacterList = this.selectActiveCharacters(gameAnalysis);
            
            // Process actions for active characters
            for (const character of activeCharacterList) {
                const characterDecisions = await this.processCharacter(character, gameAnalysis);
                this.mergeCharacterDecisions(decisions, characterDecisions);
                
                // Update last contact time for characters who sent messages
                if (characterDecisions.messages && characterDecisions.messages.length > 0) {
                    this.updateCharacterLastContact(character.id);
                }
            }
            
            // Check if new characters should be injected
            const newCharacterNeeds = this.assessNewCharacterNeeds(gameAnalysis);
            if (newCharacterNeeds.length > 0) {
                const newCharacters = await this.injectNewCharacters(newCharacterNeeds, gameAnalysis);
                decisions.newCharacters.push(...newCharacters);
            }
            
            // Process pending interactions
            const interactions = await this.processInteractionQueue(gameAnalysis);
            decisions.interactions.push(...interactions);
            
            return decisions;

        } catch (error) {
            console.error('🎭 Character AI processing error:', error);
            return decisions;
        }
    }

    analyzeGameConditions(gameState, allCivs, activeEvents) {
        return {
            // Diplomatic conditions
            diplomaticTension: this.analyzeDiplomaticTension(allCivs),
            activeConflicts: this.identifyActiveConflicts(allCivs),
            tradeDisputes: this.identifyTradeDisputes(allCivs),
            
            // Economic conditions
            economicOpportunities: this.identifyEconomicOpportunities(gameState, allCivs),
            marketVolatility: this.assessMarketVolatility(gameState),
            resourceScarcity: this.identifyResourceScarcity(allCivs),
            
            // Social and political conditions
            socialUnrest: this.assessSocialUnrest(allCivs),
            politicalChanges: this.identifyPoliticalChanges(allCivs),
            culturalEvents: this.identifyCulturalEvents(activeEvents),
            
            // Military conditions
            militaryTensions: this.assessMilitaryTensions(allCivs),
            securityThreats: this.identifySecurityThreats(activeEvents),
            
            // Story context
            storyOpportunities: this.identifyStoryOpportunities(activeEvents),
            characterGaps: this.identifyCharacterGaps(activeEvents)
        };
    }

    selectActiveCharacters(gameAnalysis) {
        const activeList = [];
        const totalBudget = this.calculateProcessingBudget();
        let usedBudget = 0;
        
        // Sort characters by relevance to current game conditions
        const relevanceScores = this.calculateCharacterRelevance(gameAnalysis);
        const sortedCharacters = Array.from(this.characterPool.values())
            .sort((a, b) => relevanceScores.get(b.id) - relevanceScores.get(a.id));
        
        for (const character of sortedCharacters) {
            const characterCost = this.calculateCharacterProcessingCost(character, gameAnalysis);
            
            if (usedBudget + characterCost <= totalBudget) {
                activeList.push(character);
                usedBudget += characterCost;
                
                // Respect category limits
                const categoryCount = activeList.filter(c => c.category === character.category).length;
                const categoryLimit = this.characterCategories[character.category]?.maxActive || 5;
                
                if (categoryCount >= categoryLimit) {
                    // Skip remaining characters in this category
                    continue;
                }
            }
        }
        
        return activeList;
    }

    calculateCharacterRelevance(gameAnalysis) {
        const relevanceScores = new Map();
        
        for (const [characterId, character] of this.characterPool) {
            let score = 0;
            
            // Base relevance by category
            score += this.characterCategories[character.category]?.priority || 0.1;
            
            // Boost based on current game conditions
            if (character.category === 'diplomats' && gameAnalysis.diplomaticTension > 0.6) {
                score += 0.5;
            }
            
            if (character.category === 'businessLeaders' && gameAnalysis.economicOpportunities.length > 0) {
                score += 0.4;
            }
            
            if (character.category === 'military' && gameAnalysis.militaryTensions > 0.7) {
                score += 0.6;
            }
            
            // Boost for story relevance
            if (this.storyContext && this.isCharacterRelevantToStory(character, this.storyContext)) {
                score += 0.3;
            }
            
            // Reduce score for recently active characters (to distribute activity)
            const lastActivity = character.lastActivity || 0;
            const timeSinceActivity = Date.now() - lastActivity;
            if (timeSinceActivity < 300000) { // 5 minutes
                score *= 0.5;
            }
            
            relevanceScores.set(characterId, score);
        }
        
        return relevanceScores;
    }

    async processCharacter(character, gameAnalysis) {
        const decisions = {
            actions: [],
            interactions: [],
            stateChanges: [],
            messages: []
        };

        // Determine character's current motivations and goals
        const motivations = this.analyzeCharacterMotivations(character, gameAnalysis);
        
        // Generate potential actions based on motivations
        const potentialActions = this.generatePotentialActions(character, motivations, gameAnalysis);
        
        // Select and execute the most appropriate action
        const selectedAction = this.selectBestAction(potentialActions, character, gameAnalysis);
        
        if (selectedAction) {
            const actionResult = await this.executeCharacterAction(character, selectedAction, gameAnalysis);
            decisions.actions.push(actionResult);
            
            // Update character state based on action
            const stateUpdate = this.updateCharacterState(character, selectedAction, actionResult);
            decisions.stateChanges.push(stateUpdate);
        }
        
        // Check for interaction opportunities
        const interactions = this.identifyInteractionOpportunities(character, gameAnalysis);
        decisions.interactions.push(...interactions);
        
        // Check if character should send messages to leader
        const leaderMessages = this.generateLeaderMessages(character, gameAnalysis, motivations);
        decisions.messages.push(...leaderMessages);
        
        return decisions;
    }

    analyzeCharacterMotivations(character, gameAnalysis) {
        const motivations = {
            primary: [],
            secondary: [],
            urgency: 0
        };
        
        // Base motivations by character type
        switch (character.category) {
            case 'diplomats':
                if (gameAnalysis.activeConflicts.length > 0) {
                    motivations.primary.push('resolve_conflict');
                    motivations.urgency += 0.8;
                }
                if (gameAnalysis.tradeDisputes.length > 0) {
                    motivations.primary.push('mediate_trade_dispute');
                    motivations.urgency += 0.6;
                }
                break;
                
            case 'businessLeaders':
                if (gameAnalysis.economicOpportunities.length > 0) {
                    motivations.primary.push('exploit_opportunity');
                    motivations.urgency += 0.7;
                }
                if (gameAnalysis.resourceScarcity.length > 0) {
                    motivations.primary.push('secure_resources');
                    motivations.urgency += 0.9;
                }
                break;
                
            case 'military':
                if (gameAnalysis.securityThreats.length > 0) {
                    motivations.primary.push('address_threat');
                    motivations.urgency += 1.0;
                }
                if (gameAnalysis.militaryTensions > 0.7) {
                    motivations.primary.push('prepare_defenses');
                    motivations.urgency += 0.8;
                }
                break;
                
            case 'citizens':
                if (gameAnalysis.socialUnrest > 0.6) {
                    motivations.primary.push('voice_concerns');
                    motivations.urgency += 0.5;
                }
                break;
        }
        
        // Personal motivations based on character traits
        if (character.traits.includes('ambitious')) {
            motivations.secondary.push('seek_advancement');
        }
        if (character.traits.includes('greedy')) {
            motivations.secondary.push('maximize_profit');
        }
        if (character.traits.includes('patriotic')) {
            motivations.secondary.push('serve_civilization');
        }
        
        return motivations;
    }

    generatePotentialActions(character, motivations, gameAnalysis) {
        const actions = [];
        
        // Generate actions based on primary motivations
        for (const motivation of motivations.primary) {
            const motivationActions = this.getActionsForMotivation(motivation, character, gameAnalysis);
            actions.push(...motivationActions);
        }
        
        // Add some random/opportunistic actions
        const opportunisticActions = this.generateOpportunisticActions(character, gameAnalysis);
        actions.push(...opportunisticActions);
        
        // Filter actions based on character capabilities and constraints
        return actions.filter(action => this.canCharacterPerformAction(character, action, gameAnalysis));
    }

    getActionsForMotivation(motivation, character, gameAnalysis) {
        const actionMap = {
            resolve_conflict: [
                { type: 'diplomatic', action: 'initiate_peace_talks', target: 'conflicting_parties' },
                { type: 'diplomatic', action: 'propose_mediation', target: 'neutral_party' },
                { type: 'social', action: 'public_appeal_for_peace', target: 'public' }
            ],
            exploit_opportunity: [
                { type: 'economic', action: 'propose_business_deal', target: 'opportunity_owner' },
                { type: 'economic', action: 'form_consortium', target: 'other_businesses' },
                { type: 'political', action: 'lobby_for_favorable_policy', target: 'government' }
            ],
            address_threat: [
                { type: 'military', action: 'increase_security_level', target: 'own_forces' },
                { type: 'diplomatic', action: 'demand_explanation', target: 'threat_source' },
                { type: 'military', action: 'coordinate_defense', target: 'allied_forces' }
            ],
            voice_concerns: [
                { type: 'social', action: 'organize_protest', target: 'government' },
                { type: 'social', action: 'petition_leaders', target: 'leadership' },
                { type: 'cultural', action: 'create_awareness_campaign', target: 'public' }
            ]
        };
        
        return actionMap[motivation] || [];
    }

    async executeCharacterAction(character, action, gameAnalysis) {
        const result = {
            characterId: character.id,
            action: action,
            timestamp: Date.now(),
            success: false,
            consequences: [],
            gameImpact: {}
        };

        try {
            // Simulate action execution based on type
            switch (action.type) {
                case 'diplomatic':
                    result.gameImpact = await this.executeDiplomaticAction(character, action, gameAnalysis);
                    break;
                case 'economic':
                    result.gameImpact = await this.executeEconomicAction(character, action, gameAnalysis);
                    break;
                case 'military':
                    result.gameImpact = await this.executeMilitaryAction(character, action, gameAnalysis);
                    break;
                case 'social':
                    result.gameImpact = await this.executeSocialAction(character, action, gameAnalysis);
                    break;
                case 'political':
                    result.gameImpact = await this.executePoliticalAction(character, action, gameAnalysis);
                    break;
                case 'cultural':
                    result.gameImpact = await this.executeCulturalAction(character, action, gameAnalysis);
                    break;
            }
            
            result.success = true;
            result.consequences = this.calculateActionConsequences(character, action, result.gameImpact);
            
        } catch (error) {
            console.error(`Character action execution failed for ${character.id}:`, error);
            result.success = false;
            result.consequences = [{ type: 'failure', description: 'Action failed to execute' }];
        }
        
        return result;
    }

    async executeDiplomaticAction(character, action, gameAnalysis) {
        const impact = {
            type: 'diplomatic',
            affectedCivs: [],
            relationshipChanges: [],
            newAgreements: [],
            conflictResolutions: []
        };

        switch (action.action) {
            case 'initiate_peace_talks':
                impact.affectedCivs = this.identifyConflictingParties(gameAnalysis);
                impact.relationshipChanges = this.simulatePeaceTalkImpact(character, impact.affectedCivs);
                break;
                
            case 'propose_mediation':
                impact.affectedCivs = [action.target];
                impact.newAgreements = this.simulateMediationProposal(character, action.target);
                break;
                
            case 'public_appeal_for_peace':
                impact.affectedCivs = ['all'];
                impact.relationshipChanges = this.simulatePublicAppealImpact(character);
                break;
        }
        
        return impact;
    }

    async executeEconomicAction(character, action, gameAnalysis) {
        const impact = {
            type: 'economic',
            affectedMarkets: [],
            tradeAgreements: [],
            economicChanges: [],
            resourceFlows: []
        };

        switch (action.action) {
            case 'propose_business_deal':
                impact.tradeAgreements = this.simulateBusinessDeal(character, action.target);
                impact.economicChanges = this.calculateDealEconomicImpact(impact.tradeAgreements);
                break;
                
            case 'form_consortium':
                impact.affectedMarkets = this.identifyRelevantMarkets(action.target);
                impact.economicChanges = this.simulateConsortiumFormation(character, action.target);
                break;
                
            case 'lobby_for_favorable_policy':
                impact.economicChanges = this.simulatePolicyLobbyingImpact(character, action.target);
                break;
        }
        
        return impact;
    }

    assessNewCharacterNeeds(gameAnalysis) {
        const needs = [];
        
        // Check for diplomatic character needs
        if (gameAnalysis.activeConflicts.length > 0 && this.getDiplomatCount() < 2) {
            needs.push({
                category: 'diplomats',
                urgency: 0.9,
                specialization: 'conflict_resolution',
                reason: 'Active conflicts require diplomatic intervention'
            });
        }
        
        // Check for business character needs
        if (gameAnalysis.economicOpportunities.length > 2 && this.getBusinessLeaderCount() < 3) {
            needs.push({
                category: 'businessLeaders',
                urgency: 0.7,
                specialization: 'opportunity_exploitation',
                reason: 'Multiple economic opportunities available'
            });
        }
        
        // Check for military character needs
        if (gameAnalysis.securityThreats.length > 0 && this.getMilitaryCount() < 1) {
            needs.push({
                category: 'military',
                urgency: 1.0,
                specialization: 'threat_assessment',
                reason: 'Security threats detected'
            });
        }
        
        // Story-driven character needs
        if (this.storyContext && this.storyContext.requiredCharacters) {
            for (const requiredChar of this.storyContext.requiredCharacters) {
                if (!this.hasCharacterType(requiredChar.type)) {
                    needs.push({
                        category: requiredChar.category,
                        urgency: 0.8,
                        specialization: requiredChar.specialization,
                        reason: `Required for story: ${this.storyContext.title}`
                    });
                }
            }
        }
        
        return needs;
    }

    async injectNewCharacters(needs, gameAnalysis) {
        const newCharacters = [];
        
        for (const need of needs) {
            const character = await this.generateNewCharacter(need, gameAnalysis);
            newCharacters.push(character);
            this.characterPool.set(character.id, character);
        }
        
        return newCharacters;
    }

    async generateNewCharacter(need, gameAnalysis) {
        const character = {
            id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            category: need.category,
            specialization: need.specialization,
            name: this.generateCharacterName(need.category),
            traits: this.generateCharacterTraits(need.category, need.specialization),
            background: this.generateCharacterBackground(need.category, need.specialization),
            motivations: this.generateInitialMotivations(need.category, need.specialization),
            capabilities: this.generateCharacterCapabilities(need.category, need.specialization),
            relationships: new Map(),
            reputation: this.generateInitialReputation(need.category),
            resources: this.generateInitialResources(need.category),
            lastActivity: Date.now(),
            createdAt: Date.now(),
            injectionReason: need.reason
        };
        
        return character;
    }

    generateLeaderMessages(character, gameAnalysis, motivations) {
        const messages = [];
        
        // Check if character should contact leader based on various conditions
        const shouldContact = this.shouldContactLeader(character, gameAnalysis, motivations);
        
        if (!shouldContact) return messages;
        
        // Generate message based on character type and current conditions
        const messageType = this.determineMessageType(character, gameAnalysis, motivations);
        const messageContent = this.generateMessageContent(character, messageType, gameAnalysis);
        
        if (messageContent) {
            messages.push({
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                fromCharacterId: character.id,
                fromCharacterName: character.name,
                toLeader: true,
                messageType: messageType,
                subject: messageContent.subject,
                content: messageContent.content,
                urgency: messageContent.urgency,
                category: character.category,
                timestamp: Date.now(),
                gameConditions: this.summarizeRelevantConditions(gameAnalysis, character),
                suggestedActions: messageContent.suggestedActions || [],
                requiresResponse: messageContent.requiresResponse || false
            });
        }
        
        return messages;
    }

    shouldContactLeader(character, gameAnalysis, motivations) {
        // Base contact probability by character category
        const baseProbabilities = {
            leaders: 0.05, // Other leaders rarely contact directly
            diplomats: 0.15,
            businessLeaders: 0.12,
            military: 0.18,
            scientists: 0.08,
            citizens: 0.06,
            minorCharacters: 0.03
        };
        
        let contactProbability = baseProbabilities[character.category] || 0.05;
        
        // Increase probability based on urgency of motivations
        if (motivations.urgency > 0.8) {
            contactProbability *= 3;
        } else if (motivations.urgency > 0.6) {
            contactProbability *= 2;
        }
        
        // Increase probability based on game conditions
        if (gameAnalysis.activeConflicts && gameAnalysis.activeConflicts.length > 0) {
            contactProbability *= 1.5;
        }
        
        if (gameAnalysis.economicOpportunities && gameAnalysis.economicOpportunities.length > 2) {
            contactProbability *= 1.3;
        }
        
        if (gameAnalysis.securityThreats && gameAnalysis.securityThreats.length > 0) {
            contactProbability *= 2;
        }
        
        if (gameAnalysis.socialUnrest > 0.7) {
            contactProbability *= 1.8;
        }
        
        // Story context influence
        if (this.storyContext && this.isCharacterRelevantToStory(character, this.storyContext)) {
            contactProbability *= 2;
        }
        
        // Character traits influence
        if (character.traits.includes('proactive')) {
            contactProbability *= 1.4;
        }
        if (character.traits.includes('cautious')) {
            contactProbability *= 0.7;
        }
        if (character.traits.includes('ambitious')) {
            contactProbability *= 1.2;
        }
        
        // Reputation influence (higher reputation characters more likely to contact)
        const avgReputation = (character.reputation.diplomatic + character.reputation.social) / 20;
        contactProbability *= (0.5 + avgReputation);
        
        // Recent activity cooldown (don't spam the leader)
        const timeSinceLastContact = Date.now() - (character.lastLeaderContact || 0);
        if (timeSinceLastContact < 3600000) { // Less than 1 hour
            contactProbability *= 0.1;
        } else if (timeSinceLastContact < 7200000) { // Less than 2 hours
            contactProbability *= 0.5;
        }
        
        return Math.random() < Math.min(contactProbability, 0.8);
    }

    determineMessageType(character, gameAnalysis, motivations) {
        const possibleTypes = [];
        
        // Based on character category
        switch (character.category) {
            case 'diplomats':
                possibleTypes.push('diplomatic_update', 'conflict_alert', 'negotiation_opportunity');
                break;
            case 'businessLeaders':
                possibleTypes.push('economic_opportunity', 'market_alert', 'resource_request');
                break;
            case 'military':
                possibleTypes.push('security_threat', 'military_recommendation', 'defense_update');
                break;
            case 'scientists':
                possibleTypes.push('research_breakthrough', 'technology_opportunity', 'scientific_concern');
                break;
            case 'citizens':
                possibleTypes.push('public_concern', 'community_issue', 'social_movement');
                break;
            default:
                possibleTypes.push('general_update', 'personal_request', 'information_sharing');
        }
        
        // Based on current game conditions
        if (gameAnalysis.activeConflicts && gameAnalysis.activeConflicts.length > 0) {
            possibleTypes.push('conflict_alert', 'diplomatic_update', 'security_threat');
        }
        
        if (gameAnalysis.economicOpportunities && gameAnalysis.economicOpportunities.length > 0) {
            possibleTypes.push('economic_opportunity', 'market_alert');
        }
        
        if (gameAnalysis.securityThreats && gameAnalysis.securityThreats.length > 0) {
            possibleTypes.push('security_threat', 'military_recommendation');
        }
        
        // Based on motivations
        if (motivations.primary.includes('resolve_conflict')) {
            possibleTypes.push('diplomatic_update', 'conflict_alert');
        }
        
        if (motivations.primary.includes('exploit_opportunity')) {
            possibleTypes.push('economic_opportunity', 'resource_request');
        }
        
        if (motivations.primary.includes('address_threat')) {
            possibleTypes.push('security_threat', 'military_recommendation');
        }
        
        // Select most appropriate type
        return possibleTypes[Math.floor(Math.random() * possibleTypes.length)] || 'general_update';
    }

    generateMessageContent(character, messageType, gameAnalysis) {
        const contentGenerators = {
            diplomatic_update: () => this.generateDiplomaticUpdate(character, gameAnalysis),
            conflict_alert: () => this.generateConflictAlert(character, gameAnalysis),
            negotiation_opportunity: () => this.generateNegotiationOpportunity(character, gameAnalysis),
            economic_opportunity: () => this.generateEconomicOpportunity(character, gameAnalysis),
            market_alert: () => this.generateMarketAlert(character, gameAnalysis),
            resource_request: () => this.generateResourceRequest(character, gameAnalysis),
            security_threat: () => this.generateSecurityThreat(character, gameAnalysis),
            military_recommendation: () => this.generateMilitaryRecommendation(character, gameAnalysis),
            defense_update: () => this.generateDefenseUpdate(character, gameAnalysis),
            research_breakthrough: () => this.generateResearchBreakthrough(character, gameAnalysis),
            technology_opportunity: () => this.generateTechnologyOpportunity(character, gameAnalysis),
            scientific_concern: () => this.generateScientificConcern(character, gameAnalysis),
            public_concern: () => this.generatePublicConcern(character, gameAnalysis),
            community_issue: () => this.generateCommunityIssue(character, gameAnalysis),
            social_movement: () => this.generateSocialMovement(character, gameAnalysis),
            general_update: () => this.generateGeneralUpdate(character, gameAnalysis)
        };
        
        const generator = contentGenerators[messageType] || contentGenerators.general_update;
        return generator();
    }

    generateDiplomaticUpdate(character, gameAnalysis) {
        const updates = [
            {
                subject: "Diplomatic Relations Status Update",
                content: `Leader, I wanted to update you on the current diplomatic climate. ${this.getRandomDiplomaticSituation(gameAnalysis)} I recommend we ${this.getRandomDiplomaticAction()}.`,
                urgency: "medium",
                requiresResponse: true,
                suggestedActions: ["schedule_diplomatic_meeting", "review_alliance_status", "prepare_negotiation_strategy"]
            },
            {
                subject: "Inter-Civilization Communication Patterns",
                content: `I've been monitoring communication patterns between civilizations. ${this.getRandomDiplomaticObservation()} This could impact our ${this.getRandomDiplomaticArea()}.`,
                urgency: "low",
                requiresResponse: false,
                suggestedActions: ["diplomatic_intelligence_review", "adjust_communication_strategy"]
            },
            {
                subject: "Alliance Opportunity Assessment",
                content: `Leader, I've identified a potential alliance opportunity that could strengthen our position. ${this.getRandomAllianceOpportunity()} Shall I proceed with preliminary discussions?`,
                urgency: "medium",
                requiresResponse: true,
                suggestedActions: ["authorize_preliminary_talks", "conduct_background_research", "assess_strategic_value"]
            }
        ];
        
        return updates[Math.floor(Math.random() * updates.length)];
    }

    generateConflictAlert(character, gameAnalysis) {
        const alerts = [
            {
                subject: "🚨 URGENT: Escalating Conflict Detected",
                content: `Leader, tensions between ${this.getRandomCivilizations()} have reached critical levels. ${this.getRandomConflictDetails()} Immediate diplomatic intervention may be required.`,
                urgency: "high",
                requiresResponse: true,
                suggestedActions: ["emergency_diplomatic_session", "contact_neutral_mediators", "prepare_peacekeeping_forces"]
            },
            {
                subject: "Conflict De-escalation Opportunity",
                content: `I've identified a window for de-escalating the current conflict. ${this.getRandomDeescalationOpportunity()} We should act quickly before the situation deteriorates further.`,
                urgency: "high",
                requiresResponse: true,
                suggestedActions: ["initiate_peace_talks", "offer_mediation_services", "coordinate_with_allies"]
            }
        ];
        
        return alerts[Math.floor(Math.random() * alerts.length)];
    }

    generateEconomicOpportunity(character, gameAnalysis) {
        const opportunities = [
            {
                subject: "Major Trade Opportunity Identified",
                content: `Leader, I've discovered a significant trade opportunity worth approximately ${this.getRandomTradeValue()} credits. ${this.getRandomTradeDetails()} This could boost our economic growth by ${this.getRandomPercentage()}%.`,
                urgency: "medium",
                requiresResponse: true,
                suggestedActions: ["authorize_trade_negotiations", "allocate_investment_capital", "assess_risk_factors"]
            },
            {
                subject: "Market Expansion Proposal",
                content: `Our analysis shows potential for expanding into the ${this.getRandomMarketSector()} sector. ${this.getRandomMarketOpportunity()} I recommend we move quickly to secure our position.`,
                urgency: "medium",
                requiresResponse: true,
                suggestedActions: ["market_research_authorization", "capital_allocation_review", "partnership_exploration"]
            },
            {
                subject: "Resource Acquisition Opportunity",
                content: `A rare opportunity has emerged to secure ${this.getRandomResource()} at below-market rates. ${this.getRandomResourceDetails()} This could provide strategic advantages for years to come.`,
                urgency: "high",
                requiresResponse: true,
                suggestedActions: ["authorize_resource_purchase", "negotiate_long_term_contract", "assess_strategic_value"]
            }
        ];
        
        return opportunities[Math.floor(Math.random() * opportunities.length)];
    }

    generateSecurityThreat(character, gameAnalysis) {
        const threats = [
            {
                subject: "🔴 SECURITY ALERT: Threat Level Elevated",
                content: `Leader, our intelligence indicates ${this.getRandomSecurityThreat()}. ${this.getRandomThreatDetails()} I recommend immediate defensive measures.`,
                urgency: "high",
                requiresResponse: true,
                suggestedActions: ["increase_security_level", "deploy_defensive_forces", "coordinate_with_intelligence"]
            },
            {
                subject: "Border Security Concern",
                content: `Unusual activity detected near our ${this.getRandomBorderArea()}. ${this.getRandomBorderActivity()} While not immediately threatening, it warrants attention.`,
                urgency: "medium",
                requiresResponse: false,
                suggestedActions: ["increase_border_patrols", "enhance_surveillance", "diplomatic_inquiry"]
            }
        ];
        
        return threats[Math.floor(Math.random() * threats.length)];
    }

    generatePublicConcern(character, gameAnalysis) {
        const concerns = [
            {
                subject: "Growing Public Concern: Economic Policies",
                content: `Leader, I'm hearing increasing concerns from citizens about ${this.getRandomPublicIssue()}. ${this.getRandomPublicSentiment()} Perhaps we should consider addressing this publicly.`,
                urgency: "medium",
                requiresResponse: false,
                suggestedActions: ["public_address", "policy_review", "community_outreach"]
            },
            {
                subject: "Community Initiative Proposal",
                content: `The community has organized around ${this.getRandomCommunityIssue()}. ${this.getRandomCommunityAction()} They're looking for government support or at least acknowledgment.`,
                urgency: "low",
                requiresResponse: false,
                suggestedActions: ["community_meeting", "policy_consideration", "public_statement"]
            }
        ];
        
        return concerns[Math.floor(Math.random() * concerns.length)];
    }

    generateGeneralUpdate(character, gameAnalysis) {
        return {
            subject: `Update from ${character.role}`,
            content: `Leader, I wanted to keep you informed about developments in my area of responsibility. ${this.getRandomGeneralUpdate(character)} Everything remains under control, but I thought you should be aware.`,
            urgency: "low",
            requiresResponse: false,
            suggestedActions: ["acknowledge_update", "request_detailed_report"]
        };
    }

    // Helper methods for generating random content
    getRandomDiplomaticSituation(gameAnalysis) {
        const situations = [
            "Relations with the Zephyrian Alliance have cooled following recent trade disputes.",
            "The Terran Federation has expressed interest in expanding our mutual defense pact.",
            "Neutral civilizations are showing increased interest in our diplomatic initiatives.",
            "Recent cultural exchanges have improved our standing with several key partners."
        ];
        return situations[Math.floor(Math.random() * situations.length)];
    }

    getRandomDiplomaticAction() {
        const actions = [
            "schedule a high-level diplomatic summit",
            "send a goodwill delegation to key partners",
            "review our current treaty obligations",
            "consider offering additional trade incentives"
        ];
        return actions[Math.floor(Math.random() * actions.length)];
    }

    getRandomTradeValue() {
        return (Math.floor(Math.random() * 900) + 100) + "M";
    }

    getRandomPercentage() {
        return Math.floor(Math.random() * 15) + 5;
    }

    getRandomResource() {
        const resources = ["quantum crystals", "rare earth minerals", "energy cells", "advanced alloys", "bio-materials"];
        return resources[Math.floor(Math.random() * resources.length)];
    }

    getRandomSecurityThreat() {
        const threats = [
            "increased pirate activity in the outer sectors",
            "unusual military buildups near our borders",
            "cyber intrusion attempts on our defense networks",
            "suspicious civilian vessel movements"
        ];
        return threats[Math.floor(Math.random() * threats.length)];
    }

    getRandomPublicIssue() {
        const issues = [
            "rising cost of living",
            "employment opportunities in rural areas",
            "access to advanced healthcare",
            "educational system reforms"
        ];
        return issues[Math.floor(Math.random() * issues.length)];
    }

    getRandomGeneralUpdate(character) {
        const updates = [
            `Recent developments in ${character.category} operations have been proceeding smoothly.`,
            `I've been coordinating with other departments to improve efficiency.`,
            `Some minor challenges have emerged, but we're addressing them proactively.`,
            `The team has been performing exceptionally well under current conditions.`
        ];
        return updates[Math.floor(Math.random() * updates.length)];
    }

    // Additional helper methods for message generation
    getRandomCivilizations() {
        const civs = ["the Zephyrian Alliance and the Terran Federation", "the Outer Rim Colonies and the Core Worlds", "the Merchant Guild and the Mining Consortium"];
        return civs[Math.floor(Math.random() * civs.length)];
    }

    getRandomConflictDetails() {
        const details = [
            "Border skirmishes have been reported in three sectors.",
            "Trade embargo declarations have escalated tensions.",
            "Military exercises near disputed territories are being interpreted as provocative.",
            "Diplomatic communications have ceased entirely."
        ];
        return details[Math.floor(Math.random() * details.length)];
    }

    getRandomDeescalationOpportunity() {
        const opportunities = [
            "Both sides have agreed to neutral mediation.",
            "Economic pressures are making continued conflict costly.",
            "Public opinion in both civilizations favors peaceful resolution.",
            "A face-saving compromise has been identified."
        ];
        return opportunities[Math.floor(Math.random() * opportunities.length)];
    }

    getRandomTradeDetails() {
        const details = [
            "The partner civilization has surplus production capacity.",
            "New shipping routes have reduced transportation costs.",
            "Favorable exchange rates make this particularly attractive.",
            "Long-term contracts could secure preferential pricing."
        ];
        return details[Math.floor(Math.random() * details.length)];
    }

    getRandomMarketSector() {
        const sectors = ["biotechnology", "quantum computing", "space logistics", "renewable energy", "advanced materials"];
        return sectors[Math.floor(Math.random() * sectors.length)];
    }

    getRandomMarketOpportunity() {
        const opportunities = [
            "Early market entry could establish us as the dominant player.",
            "Existing competitors have shown weaknesses we could exploit.",
            "Consumer demand is growing faster than supply.",
            "Regulatory changes favor our business model."
        ];
        return opportunities[Math.floor(Math.random() * opportunities.length)];
    }

    getRandomResourceDetails() {
        const details = [
            "The supplier needs quick payment due to cash flow issues.",
            "Political instability in the region may affect future availability.",
            "Our competitors are also interested, so timing is critical.",
            "This represents a 40% discount from current market prices."
        ];
        return details[Math.floor(Math.random() * details.length)];
    }

    getRandomThreatDetails() {
        const details = [
            "Intelligence suggests this may be a coordinated effort.",
            "The timing coincides with other suspicious activities.",
            "Our current defenses may not be adequate for this threat level.",
            "Civilian populations could be at risk if this escalates."
        ];
        return details[Math.floor(Math.random() * details.length)];
    }

    getRandomBorderArea() {
        const areas = ["northern frontier", "eastern trade corridor", "southern mining region", "western agricultural zones"];
        return areas[Math.floor(Math.random() * areas.length)];
    }

    getRandomBorderActivity() {
        const activities = [
            "Unidentified vessels have been conducting surveillance.",
            "Communication intercepts suggest intelligence gathering.",
            "Increased civilian traffic patterns seem unusual.",
            "Military patrols have reported equipment malfunctions."
        ];
        return activities[Math.floor(Math.random() * activities.length)];
    }

    getRandomPublicSentiment() {
        const sentiments = [
            "Town halls have been particularly heated lately.",
            "Social media discussions show growing frustration.",
            "Community leaders are requesting meetings.",
            "Petition signatures are increasing daily."
        ];
        return sentiments[Math.floor(Math.random() * sentiments.length)];
    }

    getRandomCommunityIssue() {
        const issues = [
            "improved public transportation",
            "better educational facilities",
            "environmental protection measures",
            "support for local businesses"
        ];
        return issues[Math.floor(Math.random() * issues.length)];
    }

    getRandomCommunityAction() {
        const actions = [
            "They've organized volunteer committees and fundraising efforts.",
            "Local businesses have pledged support for the initiative.",
            "They've prepared detailed proposals and impact studies.",
            "Media coverage has been positive and supportive."
        ];
        return actions[Math.floor(Math.random() * actions.length)];
    }

    getRandomDiplomaticObservation() {
        const observations = [
            "Increased diplomatic traffic suggests major negotiations underway.",
            "Communication encryption patterns have changed significantly.",
            "Several civilizations are coordinating their messaging.",
            "Diplomatic immunity requests have spiked recently."
        ];
        return observations[Math.floor(Math.random() * observations.length)];
    }

    getRandomDiplomaticArea() {
        const areas = ["trade relationships", "security arrangements", "cultural exchange programs", "technological cooperation"];
        return areas[Math.floor(Math.random() * areas.length)];
    }

    getRandomAllianceOpportunity() {
        const opportunities = [
            "Their strategic interests align well with ours.",
            "They possess complementary military capabilities.",
            "Economic synergies could benefit both civilizations.",
            "They're seeking reliable partners for long-term cooperation."
        ];
        return opportunities[Math.floor(Math.random() * opportunities.length)];
    }

    // Method to update character's last leader contact time
    updateCharacterLastContact(characterId) {
        const character = this.characterPool.get(characterId);
        if (character) {
            character.lastLeaderContact = Date.now();
            this.characterPool.set(characterId, character);
        }
    }

    // Method to merge character decisions into main decisions object
    mergeCharacterDecisions(mainDecisions, characterDecisions) {
        if (characterDecisions.actions) {
            mainDecisions.characterActions.push(...characterDecisions.actions);
        }
        if (characterDecisions.interactions) {
            mainDecisions.interactions.push(...characterDecisions.interactions);
        }
        if (characterDecisions.stateChanges) {
            mainDecisions.characterUpdates.push(...characterDecisions.stateChanges);
        }
        if (characterDecisions.messages) {
            mainDecisions.characterActions.push(...characterDecisions.messages.map(msg => ({
                type: 'leader_message',
                ...msg
            })));
        }
    }

    summarizeRelevantConditions(gameAnalysis, character) {
        const relevantConditions = {};
        
        // Include conditions relevant to character type
        switch (character.category) {
            case 'diplomats':
                relevantConditions.diplomaticTension = gameAnalysis.diplomaticTension;
                relevantConditions.activeConflicts = gameAnalysis.activeConflicts?.length || 0;
                break;
            case 'businessLeaders':
                relevantConditions.economicOpportunities = gameAnalysis.economicOpportunities?.length || 0;
                relevantConditions.marketVolatility = gameAnalysis.marketVolatility;
                break;
            case 'military':
                relevantConditions.securityThreats = gameAnalysis.securityThreats?.length || 0;
                relevantConditions.militaryTensions = gameAnalysis.militaryTensions;
                break;
            case 'citizens':
                relevantConditions.socialUnrest = gameAnalysis.socialUnrest;
                relevantConditions.politicalChanges = gameAnalysis.politicalChanges?.length || 0;
                break;
        }
        
        return relevantConditions;
    }

    isCharacterRelevantToStory(character, storyContext) {
        if (!storyContext) return false;
        
        // Check if character category is relevant to current story
        const relevantCategories = storyContext.relevantCharacterCategories || [];
        if (relevantCategories.includes(character.category)) return true;
        
        // Check if character has traits relevant to story
        const relevantTraits = storyContext.relevantTraits || [];
        const hasRelevantTrait = character.traits.some(trait => relevantTraits.includes(trait));
        if (hasRelevantTrait) return true;
        
        // Check if character's civilization is involved in story
        const involvedCivs = storyContext.involvedCivilizations || [];
        if (involvedCivs.includes(character.civilization)) return true;
        
        return false;
    }

    // Integration with Game Master AI
    updateStoryContext(storyContext) {
        this.storyContext = storyContext;
        
        // Adjust character priorities based on story needs
        this.adjustCharacterPriorities(storyContext);
    }

    processStoryRequests(requests) {
        const responses = [];
        
        for (const request of requests) {
            const response = this.processStoryRequest(request);
            responses.push(response);
        }
        
        return responses;
    }

    // Cost optimization methods
    calculateProcessingBudget() {
        // Dynamic budget based on game activity and player count
        const baseTokens = 1000;
        const playerMultiplier = Math.min(this.gameConfig.playerCount / 10, 2.0);
        const activityMultiplier = this.assessCurrentActivity();
        
        return Math.floor(baseTokens * playerMultiplier * activityMultiplier);
    }

    optimizeCharacterSelection() {
        // Implement smart character selection to minimize costs while maximizing impact
        const activeCharacters = Array.from(this.activeCharacters.values());
        
        // Deactivate characters that haven't been relevant recently
        const cutoffTime = Date.now() - 600000; // 10 minutes
        const staleCharacters = activeCharacters.filter(char => 
            char.lastRelevantAction < cutoffTime && char.category !== 'leaders'
        );
        
        for (const char of staleCharacters) {
            this.activeCharacters.delete(char.id);
        }
    }

    // Public API methods
    getActiveCharacters() {
        return Array.from(this.activeCharacters.values());
    }

    getCharacterById(characterId) {
        return this.characterPool.get(characterId);
    }

    forceCharacterAction(characterId, actionData) {
        const character = this.characterPool.get(characterId);
        if (!character) return null;
        
        return this.executeCharacterAction(character, actionData, {});
    }

    getCharacterStats() {
        return {
            totalCharacters: this.characterPool.size,
            activeCharacters: this.activeCharacters.size,
            charactersByCategory: this.getCharacterCountsByCategory(),
            averageActivityLevel: this.calculateAverageActivityLevel()
        };
    }
}

module.exports = CharacterAI;
