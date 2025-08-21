/**
 * Game Master AI - The Witty Storyteller and Plot Twist Generator
 * 
 * This AI system is responsible for:
 * - Creating engaging storylines and plot twists
 * - Injecting humor and entertainment into the game
 * - Managing galactic events and crises
 * - Balancing gameplay for maximum fun
 * - Coordinating with all other AI systems for narrative coherence
 */

class GameMasterAI {
    constructor(gameConfig) {
        this.gameConfig = gameConfig;
        this.personality = this.generatePersonality(gameConfig);
        this.activeStorylines = new Map();
        this.plotTwistQueue = [];
        this.humorLevel = gameConfig.humorLevel || 'high';
        this.entertainmentFocus = gameConfig.entertainmentFocus || 'balanced';
        this.lastEventTime = Date.now();
        this.eventCooldowns = new Map();
        
        // Story generation parameters
        this.storyArcs = {
            political: { weight: 0.3, active: [] },
            economic: { weight: 0.25, active: [] },
            military: { weight: 0.2, active: [] },
            social: { weight: 0.15, active: [] },
            mysterious: { weight: 0.1, active: [] }
        };
        
        // Humor and entertainment settings
        this.comedyStyles = ['witty', 'sarcastic', 'absurd', 'clever', 'punny'];
        this.currentComedyStyle = this.selectComedyStyle();
        
        console.log(`🎭 Game Master AI initialized with ${this.personality.name} personality`);
    }

    generatePersonality(gameConfig) {
        const personalities = [
            {
                name: "The Cosmic Comedian",
                traits: ["witty", "observant", "timing-focused", "pop-culture-savvy"],
                humorStyle: "observational comedy with galactic twist",
                catchphrase: "In space, no one can hear you laugh... but they can see the plot twists coming!"
            },
            {
                name: "The Sarcastic Sage",
                traits: ["sarcastic", "wise", "cynical-but-caring", "dramatic"],
                humorStyle: "dry wit with profound insights",
                catchphrase: "Oh sure, another 'peaceful' diplomatic mission. What could possibly go wrong?"
            },
            {
                name: "The Chaos Conductor",
                traits: ["unpredictable", "energetic", "mischievous", "creative"],
                humorStyle: "absurdist humor with unexpected twists",
                catchphrase: "Buckle up, space cadets! Reality is about to get... interesting."
            },
            {
                name: "The Punning Professor",
                traits: ["intellectual", "pun-loving", "educational", "dad-joke-master"],
                humorStyle: "clever wordplay with educational moments",
                catchphrase: "That situation is really out of this world... literally!"
            }
        ];
        
        return personalities[Math.floor(Math.random() * personalities.length)];
    }

    selectComedyStyle() {
        const weights = {
            witty: 0.3,
            sarcastic: 0.25,
            clever: 0.2,
            absurd: 0.15,
            punny: 0.1
        };
        
        const random = Math.random();
        let cumulative = 0;
        
        for (const [style, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (random <= cumulative) return style;
        }
        
        return 'witty';
    }

    /**
     * Main AI processing function - called every simulation tick
     */
    async processGameMasterTick(gameState, allCivs, activeEvents) {
        const decisions = {
            newEvents: [],
            plotTwists: [],
            characterInjections: [],
            humorInjections: [],
            storyProgression: [],
            balanceAdjustments: [],
            visualContent: []
        };

        try {
            // Analyze current game state for entertainment opportunities
            const gameAnalysis = this.analyzeGameState(gameState, allCivs, activeEvents);
            
            // Generate story content based on analysis
            if (this.shouldCreateNewStoryline(gameAnalysis)) {
                const newStoryline = await this.generateStoryline(gameAnalysis);
                decisions.newEvents.push(newStoryline);
            }

            // Check for plot twist opportunities
            if (this.shouldInjectPlotTwist(gameAnalysis)) {
                const plotTwist = await this.generatePlotTwist(gameAnalysis);
                decisions.plotTwists.push(plotTwist);
            }

            // Inject humor and entertainment
            const humorOpportunity = this.findHumorOpportunity(gameAnalysis);
            if (humorOpportunity) {
                decisions.humorInjections.push(humorOpportunity);
            }

            // Balance gameplay for maximum fun
            const balanceAdjustment = this.assessGameBalance(gameAnalysis);
            if (balanceAdjustment) {
                decisions.balanceAdjustments.push(balanceAdjustment);
            }

            // Progress existing storylines
            decisions.storyProgression = this.progressActiveStorylines(gameAnalysis);

            // Generate visual content for story enhancement
            const visualContent = await this.generateVisualContent(gameAnalysis, decisions);
            decisions.visualContent.push(...visualContent);

            // Generate Witter posts through characters to tell the story
            // Note: In actual implementation, these would be passed from the simulation engine
            const witterPosts = await this.generateStoryWitterPosts(gameAnalysis, decisions);
            decisions.witterPosts = witterPosts;

            return decisions;

        } catch (error) {
            console.error('🎭 Game Master AI processing error:', error);
            return decisions;
        }
    }

    analyzeGameState(gameState, allCivs, activeEvents) {
        return {
            // Game pacing analysis
            pacing: this.analyzePacing(gameState, activeEvents),
            
            // Player engagement metrics
            engagement: this.analyzePlayerEngagement(allCivs),
            
            // Dramatic tension levels
            tension: this.analyzeDramaticTension(gameState, allCivs),
            
            // Comedy opportunities
            comedyOpportunities: this.findComedyOpportunities(gameState, allCivs),
            
            // Story arc progression
            storyProgression: this.analyzeStoryProgression(),
            
            // Balance issues
            balanceIssues: this.identifyBalanceIssues(allCivs),
            
            // Event fatigue
            eventFatigue: this.assessEventFatigue(activeEvents),
            
            // Inter-civ dynamics
            civDynamics: this.analyzeCivDynamics(allCivs)
        };
    }

    analyzePacing(gameState, activeEvents) {
        const recentEvents = activeEvents.filter(e => 
            Date.now() - e.timestamp < 300000 // Last 5 minutes
        );
        
        return {
            eventDensity: recentEvents.length,
            intensity: this.calculateIntensity(recentEvents),
            playerActionRate: gameState.recentPlayerActions || 0,
            recommendation: this.getPacingRecommendation(recentEvents.length)
        };
    }

    getPacingRecommendation(eventCount) {
        if (eventCount < 2) return 'accelerate';
        if (eventCount > 8) return 'slow_down';
        return 'maintain';
    }

    analyzePlayerEngagement(allCivs) {
        const humanPlayers = allCivs.filter(civ => civ.playerType === 'human');
        
        return {
            activePlayerCount: humanPlayers.filter(p => p.lastActivity > Date.now() - 600000).length,
            averageSessionTime: this.calculateAverageSessionTime(humanPlayers),
            interactionFrequency: this.calculateInteractionFrequency(humanPlayers),
            boredomRisk: this.assessBoredomRisk(humanPlayers)
        };
    }

    analyzeDramaticTension(gameState, allCivs) {
        const conflicts = this.identifyActiveConflicts(allCivs);
        const alliances = this.identifyActiveAlliances(allCivs);
        
        return {
            conflictLevel: conflicts.length,
            allianceStability: this.assessAllianceStability(alliances),
            economicTension: this.assessEconomicTension(allCivs),
            politicalTension: this.assessPoliticalTension(allCivs),
            overallTension: this.calculateOverallTension(conflicts, alliances, allCivs)
        };
    }

    findComedyOpportunities(gameState, allCivs) {
        const opportunities = [];
        
        // Look for ironic situations
        const ironicSituations = this.findIronicSituations(allCivs);
        opportunities.push(...ironicSituations);
        
        // Find absurd contrasts
        const absurdContrasts = this.findAbsurdContrasts(gameState, allCivs);
        opportunities.push(...absurdContrasts);
        
        // Identify perfect timing for jokes
        const timingOpportunities = this.findTimingOpportunities(gameState);
        opportunities.push(...timingOpportunities);
        
        return opportunities;
    }

    shouldCreateNewStoryline(analysis) {
        // Don't create new storylines if there's event fatigue
        if (analysis.eventFatigue > 0.7) return false;
        
        // Create storylines if engagement is dropping
        if (analysis.engagement.boredomRisk > 0.6) return true;
        
        // Create storylines if pacing needs acceleration
        if (analysis.pacing.recommendation === 'accelerate') return true;
        
        // Random chance based on game conditions
        const baseChance = 0.1;
        const engagementMultiplier = 1 - analysis.engagement.boredomRisk;
        const tensionMultiplier = 1 - (analysis.tension.overallTension / 10);
        
        return Math.random() < (baseChance * engagementMultiplier * tensionMultiplier);
    }

    async generateStoryline(analysis) {
        const storylineTypes = [
            'galactic_mystery',
            'economic_upheaval',
            'diplomatic_crisis',
            'technological_breakthrough',
            'cultural_phenomenon',
            'environmental_challenge',
            'ancient_discovery',
            'trade_war',
            'migration_crisis',
            'resource_shortage'
        ];
        
        const selectedType = this.selectStorylineType(storylineTypes, analysis);
        const storyline = await this.createStorylineContent(selectedType, analysis);
        
        return {
            id: `storyline_${Date.now()}`,
            type: selectedType,
            content: storyline,
            duration: this.calculateStorylineDuration(selectedType),
            affectedCivs: this.selectAffectedCivs(selectedType, analysis),
            humorLevel: this.calculateHumorLevel(selectedType),
            timestamp: Date.now()
        };
    }

    async createStorylineContent(type, analysis) {
        const templates = this.getStorylineTemplates(type);
        const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
        
        return {
            title: this.generateWittyTitle(type, analysis),
            description: this.generateStoryDescription(selectedTemplate, analysis),
            initialEvent: this.generateInitialEvent(selectedTemplate, analysis),
            plotPoints: this.generatePlotPoints(selectedTemplate, analysis),
            comedicElements: this.generateComedyElements(type, analysis),
            resolution: this.generateResolutionOptions(selectedTemplate, analysis)
        };
    }

    generateWittyTitle(type, analysis) {
        const titles = {
            galactic_mystery: [
                "The Case of the Missing Quasar",
                "Who Moved My Black Hole?",
                "The Curious Incident of the Wormhole in the Night-Time",
                "CSI: Cosmic Space Investigation"
            ],
            economic_upheaval: [
                "The Great Galactic Recession (Again)",
                "When Currencies Collide: A Space Opera",
                "The Wolf of Wall Street... In Space!",
                "Too Big to Fail: Galactic Edition"
            ],
            diplomatic_crisis: [
                "Lost in Translation: A Diplomatic Comedy",
                "The Ambassador's New Clothes",
                "Peace Talks: What Could Go Wrong?",
                "Diplomatic Immunity: Not What You Think"
            ]
        };
        
        const typetitles = titles[type] || ["An Interesting Development"];
        return typetitles[Math.floor(Math.random() * typeTitle.length)];
    }

    shouldInjectPlotTwist(analysis) {
        // Check if any storylines are ready for a twist
        const readyStorylines = Array.from(this.activeStorylines.values())
            .filter(s => s.readyForTwist);
        
        if (readyStorylines.length === 0) return false;
        
        // Higher chance if tension is low (need to spice things up)
        const tensionFactor = 1 - (analysis.tension.overallTension / 10);
        const baseTwistChance = 0.15;
        
        return Math.random() < (baseTwistChance + tensionFactor * 0.1);
    }

    async generatePlotTwist(analysis) {
        const twistTypes = [
            'unexpected_alliance',
            'hidden_agenda_revealed',
            'mysterious_benefactor',
            'double_agent_exposed',
            'ancient_technology_activated',
            'cosmic_phenomenon',
            'character_revelation',
            'resource_discovery',
            'time_paradox',
            'alternate_dimension'
        ];
        
        const selectedTwist = twistTypes[Math.floor(Math.random() * twistTypes.length)];
        
        return {
            id: `twist_${Date.now()}`,
            type: selectedTwist,
            content: await this.createTwistContent(selectedTwist, analysis),
            impact: this.calculateTwistImpact(selectedTwist),
            humorRating: this.calculateTwistHumor(selectedTwist),
            affectedStorylines: this.selectAffectedStorylines(selectedTwist),
            timestamp: Date.now()
        };
    }

    findHumorOpportunity(analysis) {
        // Look for situations ripe for comedy
        const opportunities = analysis.comedyOpportunities;
        
        if (opportunities.length === 0) return null;
        
        const bestOpportunity = opportunities.reduce((best, current) => 
            current.comedyPotential > best.comedyPotential ? current : best
        );
        
        return {
            type: 'humor_injection',
            content: this.generateHumorContent(bestOpportunity),
            timing: 'immediate',
            style: this.currentComedyStyle,
            targetAudience: 'all_players'
        };
    }

    generateHumorContent(opportunity) {
        const humorGenerators = {
            witty: () => this.generateWittyComment(opportunity),
            sarcastic: () => this.generateSarcasticObservation(opportunity),
            absurd: () => this.generateAbsurdSituation(opportunity),
            clever: () => this.generateCleverWordplay(opportunity),
            punny: () => this.generatePun(opportunity)
        };
        
        const generator = humorGenerators[this.currentComedyStyle] || humorGenerators.witty;
        return generator();
    }

    generateWittyComment(opportunity) {
        const templates = [
            "Well, that's one way to handle {situation}. I'm sure {character} has everything under control... right?",
            "Ah yes, the classic {situation} maneuver. I haven't seen that since the Great {historical_event} of 2387.",
            "Ladies and gentlemen, we have a {situation}. Please keep your arms and tentacles inside the spacecraft at all times.",
            "Breaking news: {character} discovers that {situation} is more complicated than expected. In other news, water is wet."
        ];
        
        return this.fillTemplate(templates[Math.floor(Math.random() * templates.length)], opportunity);
    }

    assessGameBalance(analysis) {
        const imbalances = analysis.balanceIssues;
        
        if (imbalances.length === 0) return null;
        
        const mostCritical = imbalances.reduce((critical, current) => 
            current.severity > critical.severity ? current : critical
        );
        
        return {
            type: 'balance_adjustment',
            issue: mostCritical,
            recommendation: this.generateBalanceRecommendation(mostCritical),
            humorousExplanation: this.generateHumorousBalanceExplanation(mostCritical)
        };
    }

    generateHumorousBalanceExplanation(imbalance) {
        const explanations = {
            economic: "Looks like someone's been playing Monopoly with the galactic economy again!",
            military: "Remember folks, it's not the size of your fleet, it's how you use it... but size helps too.",
            diplomatic: "Diplomacy: the art of saying 'nice doggie' until you can find a rock.",
            technological: "With great technology comes great... wait, how does this thing work again?"
        };
        
        return explanations[imbalance.category] || "Well, this is awkward...";
    }

    /**
     * Generate visual content (images and videos) to enhance the story
     */
    async generateVisualContent(gameAnalysis, decisions) {
        const visualContent = [];
        
        try {
            // Generate content for major events
            for (const event of decisions.newEvents) {
                const eventVisuals = await this.generateEventVisuals(event, gameAnalysis);
                visualContent.push(...eventVisuals);
            }
            
            // Generate content for plot twists
            for (const twist of decisions.plotTwists) {
                const twistVisuals = await this.generatePlotTwistVisuals(twist, gameAnalysis);
                visualContent.push(...twistVisuals);
            }
            
            // Generate ambient/atmospheric content
            const atmosphericContent = await this.generateAtmosphericVisuals(gameAnalysis);
            visualContent.push(...atmosphericContent);
            
            // Generate character introduction visuals
            for (const character of decisions.characterInjections) {
                const characterVisuals = await this.generateCharacterVisuals(character, gameAnalysis);
                visualContent.push(...characterVisuals);
            }
            
            // Generate periodic cinematic content
            if (this.shouldGenerateCinematicContent(gameAnalysis)) {
                const cinematicContent = await this.generateCinematicContent(gameAnalysis);
                visualContent.push(...cinematicContent);
            }
            
        } catch (error) {
            console.error('🎬 Visual content generation error:', error);
        }
        
        return visualContent;
    }

    async generateEventVisuals(event, gameAnalysis) {
        const visuals = [];
        
        // Generate event announcement image
        const announcementImage = await this.generateEventAnnouncementImage(event);
        if (announcementImage) {
            visuals.push({
                id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'image',
                category: 'event_announcement',
                title: `${event.type} - ${event.content.title}`,
                description: 'Visual announcement for major story event',
                imagePrompt: announcementImage.prompt,
                imageUrl: announcementImage.url,
                displayDuration: 8000, // 8 seconds
                priority: 'high',
                targetAudience: 'all_players',
                relatedEventId: event.id,
                timestamp: Date.now()
            });
        }
        
        // Generate event progression video for major events
        if (event.impact && event.impact === 'high') {
            const progressionVideo = await this.generateEventProgressionVideo(event);
            if (progressionVideo) {
                visuals.push({
                    id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'video',
                    category: 'event_progression',
                    title: `${event.content.title} - Unfolding`,
                    description: 'Cinematic progression of major story event',
                    videoPrompt: progressionVideo.prompt,
                    videoUrl: progressionVideo.url,
                    duration: progressionVideo.duration,
                    priority: 'high',
                    targetAudience: 'all_players',
                    relatedEventId: event.id,
                    timestamp: Date.now()
                });
            }
        }
        
        return visuals;
    }

    async generatePlotTwistVisuals(twist, gameAnalysis) {
        const visuals = [];
        
        // Generate dramatic reveal image
        const revealImage = await this.generatePlotTwistRevealImage(twist);
        if (revealImage) {
            visuals.push({
                id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'image',
                category: 'plot_twist',
                title: `Plot Twist: ${twist.type}`,
                description: 'Dramatic visual reveal of plot twist',
                imagePrompt: revealImage.prompt,
                imageUrl: revealImage.url,
                displayDuration: 10000, // 10 seconds
                priority: 'very_high',
                targetAudience: 'all_players',
                relatedTwistId: twist.id,
                timestamp: Date.now(),
                effects: ['dramatic_zoom', 'suspense_music', 'screen_shake']
            });
        }
        
        // Generate consequences video
        const consequencesVideo = await this.generateTwistConsequencesVideo(twist);
        if (consequencesVideo) {
            visuals.push({
                id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'video',
                category: 'twist_consequences',
                title: `${twist.type} - Consequences`,
                description: 'Visual representation of plot twist consequences',
                videoPrompt: consequencesVideo.prompt,
                videoUrl: consequencesVideo.url,
                duration: consequencesVideo.duration,
                priority: 'high',
                targetAudience: 'affected_players',
                relatedTwistId: twist.id,
                timestamp: Date.now()
            });
        }
        
        return visuals;
    }

    async generateAtmosphericVisuals(gameAnalysis) {
        const visuals = [];
        
        // Generate ambient galaxy scenes based on current tension
        if (Math.random() < 0.3) { // 30% chance per tick
            const ambientScene = await this.generateAmbientGalaxyScene(gameAnalysis);
            if (ambientScene) {
                visuals.push({
                    id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'image',
                    category: 'atmospheric',
                    title: 'Galactic Vista',
                    description: 'Atmospheric view of the galaxy',
                    imagePrompt: ambientScene.prompt,
                    imageUrl: ambientScene.url,
                    displayDuration: 15000, // 15 seconds
                    priority: 'low',
                    targetAudience: 'all_players',
                    timestamp: Date.now(),
                    mood: ambientScene.mood
                });
            }
        }
        
        // Generate civilization-specific scenes
        if (Math.random() < 0.2) { // 20% chance per tick
            const civScene = await this.generateCivilizationScene(gameAnalysis);
            if (civScene) {
                visuals.push({
                    id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'image',
                    category: 'civilization_scene',
                    title: `${civScene.civilization} - Daily Life`,
                    description: 'Glimpse into civilization daily life',
                    imagePrompt: civScene.prompt,
                    imageUrl: civScene.url,
                    displayDuration: 12000, // 12 seconds
                    priority: 'medium',
                    targetAudience: civScene.targetPlayers,
                    timestamp: Date.now()
                });
            }
        }
        
        return visuals;
    }

    async generateCharacterVisuals(character, gameAnalysis) {
        const visuals = [];
        
        // Generate character introduction image
        const introImage = await this.generateCharacterIntroImage(character);
        if (introImage) {
            visuals.push({
                id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'image',
                category: 'character_introduction',
                title: `Introducing ${character.name}`,
                description: `New character enters the story: ${character.role}`,
                imagePrompt: introImage.prompt,
                imageUrl: introImage.url,
                displayDuration: 8000, // 8 seconds
                priority: 'medium',
                targetAudience: 'all_players',
                relatedCharacterId: character.id,
                timestamp: Date.now()
            });
        }
        
        // Generate character action video if they're taking significant action
        if (character.urgency > 0.7) {
            const actionVideo = await this.generateCharacterActionVideo(character, gameAnalysis);
            if (actionVideo) {
                visuals.push({
                    id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'video',
                    category: 'character_action',
                    title: `${character.name} Takes Action`,
                    description: `${character.name} responds to current events`,
                    videoPrompt: actionVideo.prompt,
                    videoUrl: actionVideo.url,
                    duration: actionVideo.duration,
                    priority: 'medium',
                    targetAudience: 'relevant_players',
                    relatedCharacterId: character.id,
                    timestamp: Date.now()
                });
            }
        }
        
        return visuals;
    }

    shouldGenerateCinematicContent(gameAnalysis) {
        // Generate cinematic content during high-tension moments
        if (gameAnalysis.tension.overallTension > 7) return Math.random() < 0.4;
        if (gameAnalysis.pacing.eventDensity > 5) return Math.random() < 0.3;
        if (gameAnalysis.engagement.boredomRisk > 0.6) return Math.random() < 0.5;
        
        // Regular cinematic content
        return Math.random() < 0.1; // 10% base chance
    }

    async generateCinematicContent(gameAnalysis) {
        const cinematics = [];
        
        // Generate epic establishing shots
        const establishingShot = await this.generateEstablishingShot(gameAnalysis);
        if (establishingShot) {
            cinematics.push({
                id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'video',
                category: 'cinematic',
                title: 'Galactic Overview',
                description: 'Epic cinematic view of the current galactic situation',
                videoPrompt: establishingShot.prompt,
                videoUrl: establishingShot.url,
                duration: establishingShot.duration,
                priority: 'high',
                targetAudience: 'all_players',
                timestamp: Date.now(),
                effects: ['epic_music', 'slow_zoom', 'particle_effects']
            });
        }
        
        return cinematics;
    }

    // Image generation methods
    async generateEventAnnouncementImage(event) {
        const prompts = {
            galactic_mystery: `A mysterious cosmic phenomenon in deep space, swirling energy patterns, unknown alien artifacts, dramatic lighting, sci-fi concept art style, 4K resolution`,
            economic_upheaval: `Bustling galactic trading hub with holographic displays showing market data, alien traders in distress, futuristic architecture, cyberpunk aesthetic`,
            diplomatic_crisis: `Tense diplomatic meeting in a grand space station chamber, representatives from different alien species, formal attire, dramatic shadows`,
            technological_breakthrough: `Advanced laboratory with glowing technology, scientists celebrating, holographic displays of breakthrough data, bright optimistic lighting`,
            cultural_phenomenon: `Diverse alien cultures celebrating together, colorful festivals, unique architecture from different civilizations, joyful atmosphere`
        };
        
        const basePrompt = prompts[event.type] || `Dramatic space scene representing ${event.type}, cinematic lighting, sci-fi art style`;
        
        // Add personality-specific humor elements
        const humorElements = this.addHumorToPrompt(basePrompt, event);
        
        return {
            prompt: humorElements,
            url: await this.callImageGenerationAPI(humorElements),
            style: 'cinematic_scifi'
        };
    }

    async generatePlotTwistRevealImage(twist) {
        const prompts = {
            unexpected_alliance: `Two former enemy fleets joining formation in space, dramatic reveal moment, epic scale, cinematic composition`,
            hidden_agenda_revealed: `Shadowy figure removing a mask to reveal their true identity, dramatic lighting, noir style, high contrast`,
            mysterious_benefactor: `Silhouetted figure watching from shadows as events unfold, mysterious atmosphere, backlighting`,
            double_agent_exposed: `Character in formal attire with dual loyalties symbols, split lighting showing two sides, tension`,
            ancient_technology_activated: `Ancient alien machinery coming to life, glowing runes and energy, archaeological discovery scene`,
            cosmic_phenomenon: `Massive space anomaly affecting multiple star systems, awe-inspiring scale, cosmic horror elements`
        };
        
        const basePrompt = prompts[twist.type] || `Dramatic revelation scene for ${twist.type}, high tension, cinematic lighting`;
        const humorElements = this.addHumorToPrompt(basePrompt, twist);
        
        return {
            prompt: humorElements,
            url: await this.callImageGenerationAPI(humorElements),
            style: 'dramatic_reveal'
        };
    }

    async generateAmbientGalaxyScene(gameAnalysis) {
        const moodPrompts = {
            peaceful: `Serene galaxy view with gentle nebulae, soft colors, peaceful space stations, calm atmosphere`,
            tense: `Galaxy with ominous red lighting, military fleets in formation, storm clouds in nebulae, foreboding atmosphere`,
            chaotic: `Galaxy in turmoil with explosions, debris fields, emergency signals, dramatic action`,
            mysterious: `Galaxy shrouded in cosmic mysteries, strange phenomena, unexplored regions, sense of wonder`
        };
        
        const mood = this.determineMoodFromAnalysis(gameAnalysis);
        const prompt = moodPrompts[mood] || moodPrompts.peaceful;
        
        return {
            prompt: this.addHumorToPrompt(prompt, { mood }),
            url: await this.callImageGenerationAPI(prompt),
            mood: mood
        };
    }

    async generateCharacterIntroImage(character) {
        const categoryPrompts = {
            diplomats: `Distinguished alien diplomat in formal attire, elegant meeting chamber, professional lighting, portrait style`,
            businessLeaders: `Successful alien business executive in modern office, holographic displays, confident pose, corporate aesthetic`,
            military: `Decorated military officer in uniform, command bridge background, authoritative presence, heroic lighting`,
            scientists: `Brilliant alien scientist in advanced laboratory, surrounded by research equipment, intellectual atmosphere`,
            citizens: `Everyday alien citizen in their natural environment, relatable and approachable, documentary style`
        };
        
        const basePrompt = categoryPrompts[character.category] || `Alien character representing ${character.role}, detailed portrait`;
        const personalizedPrompt = `${basePrompt}, ${character.traits.join(', ')} personality traits, ${character.civilization} cultural elements`;
        
        return {
            prompt: this.addHumorToPrompt(personalizedPrompt, character),
            url: await this.callImageGenerationAPI(personalizedPrompt),
            style: 'character_portrait'
        };
    }

    // Video generation methods
    async generateEventProgressionVideo(event) {
        const videoPrompts = {
            galactic_mystery: `Time-lapse of mysterious phenomenon spreading across star systems, 15 seconds, dramatic music`,
            economic_upheaval: `Market crash visualization with falling numbers and panicked traders, 12 seconds, tense atmosphere`,
            diplomatic_crisis: `Montage of diplomatic meetings escalating to conflict, 18 seconds, building tension`,
            technological_breakthrough: `Laboratory discovery leading to celebration and implementation, 20 seconds, triumphant music`
        };
        
        const basePrompt = videoPrompts[event.type] || `${event.type} unfolding over time, cinematic sequence`;
        
        return {
            prompt: this.addHumorToPrompt(basePrompt, event),
            url: await this.callVideoGenerationAPI(basePrompt),
            duration: this.calculateVideoDuration(event)
        };
    }

    async generateEstablishingShot(gameAnalysis) {
        const tension = gameAnalysis.tension.overallTension;
        let prompt = `Epic establishing shot of the galaxy, `;
        
        if (tension > 8) {
            prompt += `war-torn with battle fleets, explosions in the distance, dramatic red lighting`;
        } else if (tension > 6) {
            prompt += `tense atmosphere with military buildups, ominous lighting, storm clouds in nebulae`;
        } else if (tension > 4) {
            prompt += `busy trade routes and diplomatic activity, balanced lighting, sense of activity`;
        } else {
            prompt += `peaceful with thriving civilizations, gentle lighting, harmonious colors`;
        }
        
        prompt += `, slow camera movement, epic orchestral music, 25 seconds`;
        
        return {
            prompt: this.addHumorToPrompt(prompt, { tension }),
            url: await this.callVideoGenerationAPI(prompt),
            duration: 25000
        };
    }

    // Utility methods for visual generation
    addHumorToPrompt(basePrompt, context) {
        if (this.humorLevel === 'low') return basePrompt;
        
        const humorElements = {
            witty: `, with subtle visual jokes and clever details`,
            sarcastic: `, with ironic visual elements and unexpected contrasts`,
            absurd: `, with surreal and unexpected visual elements`,
            clever: `, with hidden visual puns and smart references`,
            punny: `, with visual wordplay and amusing details`
        };
        
        const humorAddition = humorElements[this.currentComedyStyle] || '';
        return basePrompt + humorAddition;
    }

    determineMoodFromAnalysis(gameAnalysis) {
        const tension = gameAnalysis.tension.overallTension;
        const eventDensity = gameAnalysis.pacing.eventDensity;
        
        if (tension > 7 || eventDensity > 6) return 'chaotic';
        if (tension > 5 || eventDensity > 4) return 'tense';
        if (tension < 3 && eventDensity < 2) return 'peaceful';
        return 'mysterious';
    }

    calculateVideoDuration(event) {
        const baseDuration = 15000; // 15 seconds
        const impactMultiplier = event.impact === 'high' ? 1.5 : event.impact === 'medium' ? 1.2 : 1.0;
        return Math.floor(baseDuration * impactMultiplier);
    }

    /**
     * Generate Witter posts through characters to enhance storytelling
     * Integrates with existing Character AI and Witter systems
     */
    async generateStoryWitterPosts(gameAnalysis, decisions, characterAI = null, witterState = null) {
        const witterPosts = [];
        
        try {
            // Get existing characters from Character AI system if available
            const availableCharacters = characterAI ? characterAI.getActiveCharacters() : [];
            
            // Generate posts for major events
            for (const event of decisions.newEvents) {
                const eventPosts = await this.generateEventWitterPosts(event, gameAnalysis, availableCharacters);
                witterPosts.push(...eventPosts);
            }
            
            // Generate posts for plot twists
            for (const twist of decisions.plotTwists) {
                const twistPosts = await this.generatePlotTwistWitterPosts(twist, gameAnalysis, availableCharacters);
                witterPosts.push(...twistPosts);
            }
            
            // Generate character reaction posts using existing characters
            const reactionPosts = await this.generateCharacterReactionPosts(gameAnalysis, decisions, availableCharacters);
            witterPosts.push(...reactionPosts);
            
            // Generate ambient story posts
            const ambientPosts = await this.generateAmbientStoryPosts(gameAnalysis, availableCharacters);
            witterPosts.push(...ambientPosts);
            
            // Generate humor posts based on current events
            const humorPosts = await this.generateHumorWitterPosts(gameAnalysis, decisions, availableCharacters);
            witterPosts.push(...humorPosts);
            
            // If we have access to the Witter state, add posts directly
            if (witterState && witterPosts.length > 0) {
                this.addPostsToWitterState(witterPosts, witterState);
            }
            
        } catch (error) {
            console.error('🐦 Witter post generation error:', error);
        }
        
        return witterPosts;
    }

    /**
     * Add generated posts to the existing Witter state system
     */
    addPostsToWitterState(posts, witterState) {
        for (const post of posts) {
            // Convert our post format to match Witter state format
            const witterPost = {
                id: witterState.globalPostCounter++,
                characterId: post.authorId,
                characterName: post.authorName,
                characterType: post.authorType,
                content: post.content,
                timestamp: post.timestamp,
                likes: post.engagement?.likes || Math.floor(Math.random() * 100) + 10,
                reposts: post.engagement?.reposts || Math.floor(Math.random() * 20) + 2,
                comments: post.engagement?.comments || Math.floor(Math.random() * 10) + 1,
                hashtags: post.hashtags || [],
                category: post.category || 'story',
                priority: post.priority || 'medium',
                storyRelated: true,
                gameMasterGenerated: true
            };
            
            witterState.posts.unshift(witterPost); // Add to beginning for latest posts
        }
        
        // Keep only the most recent 1000 posts to manage memory
        if (witterState.posts.length > 1000) {
            witterState.posts = witterState.posts.slice(0, 1000);
        }
    }

    async generateEventWitterPosts(event, gameAnalysis, availableCharacters = []) {
        const posts = [];
        
        // Generate breaking news post
        const breakingNewsPost = this.createBreakingNewsPost(event);
        if (breakingNewsPost) {
            posts.push(breakingNewsPost);
        }
        
        // Generate expert commentary posts using existing characters when possible
        const expertPosts = this.generateExpertCommentaryPosts(event, gameAnalysis, availableCharacters);
        posts.push(...expertPosts);
        
        // Generate citizen reaction posts using existing characters when possible
        const citizenPosts = this.generateCitizenReactionPosts(event, gameAnalysis, availableCharacters);
        posts.push(...citizenPosts);
        
        return posts;
    }

    createBreakingNewsPost(event) {
        const newsTemplates = {
            galactic_mystery: [
                "🚨 BREAKING: Mysterious energy signatures detected in Sector {sector}! Scientists baffled by unprecedented readings. More updates to follow... #GalacticMystery #Breaking",
                "⚡ ALERT: Unknown phenomenon spreading across multiple star systems. Civilian vessels advised to avoid affected areas. #SpaceAlert #Mystery",
                "🔍 DEVELOPING: First contact protocols activated as unidentified signals flood communication networks. What could this mean? #FirstContact #Breaking"
            ],
            economic_upheaval: [
                "📉 MARKET CRASH: Galactic Trade Index plummets 40% in minutes! Emergency trading halts implemented across all major exchanges. #MarketCrash #Economy",
                "💰 BREAKING: Major trade routes disrupted as economic shockwaves ripple through the galaxy. Businesses scrambling to adapt. #TradeWar #Economics",
                "🏦 URGENT: Central banks coordinate emergency response as currency values fluctuate wildly. Citizens advised to remain calm. #EconomicCrisis"
            ],
            diplomatic_crisis: [
                "🕊️ CRISIS: Diplomatic talks collapse as tensions reach breaking point between major civilizations. Peace hangs in the balance. #DiplomaticCrisis #Peace",
                "⚠️ ALERT: Ambassadors recalled from multiple worlds as relations deteriorate rapidly. War fears mounting. #Diplomacy #Crisis",
                "🤝 BREAKING: Emergency peace summit called as galaxy teeters on the brink of conflict. Will cooler heads prevail? #PeaceSummit #Diplomacy"
            ]
        };
        
        const templates = newsTemplates[event.type] || [
            `🚨 BREAKING: Major ${event.type} event unfolding across the galaxy. Stay tuned for updates. #Breaking #News`
        ];
        
        const template = templates[Math.floor(Math.random() * templates.length)];
        const content = this.personalizePostContent(template, event);
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: 'galactic_news_network',
            authorName: 'Galactic News Network',
            authorType: 'news_organization',
            content: content,
            timestamp: Date.now(),
            category: 'breaking_news',
            priority: 'high',
            relatedEventId: event.id,
            hashtags: this.extractHashtags(content),
            engagement: {
                likes: Math.floor(Math.random() * 10000) + 5000,
                reposts: Math.floor(Math.random() * 2000) + 1000,
                comments: Math.floor(Math.random() * 500) + 200
            }
        };
    }

    generateExpertCommentaryPosts(event, gameAnalysis, availableCharacters = []) {
        const posts = [];
        
        // Try to use existing characters first
        const relevantExperts = availableCharacters.filter(char => 
            ['diplomats', 'businessLeaders', 'military', 'scientists'].includes(char.category)
        );
        
        if (relevantExperts.length > 0) {
            // Use existing characters
            const numPosts = Math.min(relevantExperts.length, 3);
            for (let i = 0; i < numPosts; i++) {
                const character = relevantExperts[i];
                const expertPost = this.createExpertPostFromCharacter(event, character, gameAnalysis);
                if (expertPost) {
                    posts.push(expertPost);
                }
            }
        } else {
            // Fallback to generated experts
            const expertTypes = ['economist', 'diplomat', 'military_analyst', 'scientist', 'historian'];
            const numPosts = Math.floor(Math.random() * 2) + 2;
            
            for (let i = 0; i < numPosts; i++) {
                const expertType = expertTypes[Math.floor(Math.random() * expertTypes.length)];
                const expertPost = this.createExpertPost(event, expertType, gameAnalysis);
                if (expertPost) {
                    posts.push(expertPost);
                }
            }
        }
        
        return posts;
    }

    createExpertPostFromCharacter(event, character, gameAnalysis) {
        // Map character categories to expert templates
        const categoryToExpertType = {
            'diplomats': 'diplomat',
            'businessLeaders': 'economist',
            'military': 'military_analyst',
            'scientists': 'scientist'
        };
        
        const expertType = categoryToExpertType[character.category] || 'expert';
        const expertTemplates = this.getExpertTemplates();
        const templates = expertTemplates[expertType] || {};
        const template = templates[event.type];
        
        if (!template) return null;
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: character.id,
            authorName: character.name,
            authorType: 'expert',
            expertise: expertType,
            content: template,
            timestamp: Date.now() + Math.floor(Math.random() * 3600000),
            category: 'expert_analysis',
            priority: 'medium',
            relatedEventId: event.id,
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 5000) + 1000,
                reposts: Math.floor(Math.random() * 1000) + 200,
                comments: Math.floor(Math.random() * 200) + 50
            }
        };
    }

    getExpertTemplates() {
        return {
            economist: {
                galactic_mystery: "As an economist, I'm concerned about the market implications of this phenomenon. Historical data suggests similar events led to 15-20% GDP fluctuations. Diversification is key. #EconomicAnalysis",
                economic_upheaval: "This crash was predictable given the overheated markets. I've been warning about unsustainable growth patterns for months. Time for structural reforms. #MarketAnalysis",
                diplomatic_crisis: "Economic sanctions rarely work without multilateral support. The trade implications of this crisis could reshape galactic commerce for decades. #TradePolicy"
            },
            diplomat: {
                galactic_mystery: "In my 30 years of diplomatic service, I've never seen anything like this. We need calm, measured responses and international cooperation. Panic helps no one. #Diplomacy",
                diplomatic_crisis: "Back-channel communications are still active. There's always hope for peaceful resolution if all parties show flexibility. History teaches us that wars benefit no one. #Peace",
                economic_upheaval: "Economic instability often leads to political upheaval. Now more than ever, we need strong diplomatic ties to weather this storm together. #Unity"
            },
            military_analyst: {
                galactic_mystery: "Unknown phenomena require defensive postures. I recommend increased patrol schedules and enhanced sensor networks until we understand what we're dealing with. #Defense",
                diplomatic_crisis: "Military buildup is concerning, but it's often a negotiating tactic. Real conflicts have different signatures. Still, vigilance is warranted. #MilitaryAnalysis",
                economic_upheaval: "Economic warfare is still warfare. Cyber attacks on financial systems are a real threat during market instability. Secure your networks. #CyberSecurity"
            },
            scientist: {
                galactic_mystery: "The energy signatures don't match any known natural phenomena. We need more data before drawing conclusions. Science, not speculation, will solve this. #Science",
                economic_upheaval: "Market behavior follows predictable patterns, much like physical systems. This volatility suggests external manipulation rather than natural correction. #DataScience",
                diplomatic_crisis: "Game theory suggests that cooperation yields better outcomes than conflict. Perhaps our leaders should consult more mathematicians. #GameTheory"
            },
            historian: {
                galactic_mystery: "History shows us that 'unprecedented' events often have precedents we've forgotten. I'm researching similar occurrences from the archives. #History",
                diplomatic_crisis: "The parallels to the Crisis of 2387 are striking. That conflict was resolved through cultural exchange programs. Perhaps we should try that approach again. #HistoricalPerspective",
                economic_upheaval: "Every major economic crisis has led to innovation and reform. This too shall pass, but we must learn from it. #EconomicHistory"
            }
        };
    }

    createExpertPost(event, expertType, gameAnalysis) {
        const expertTemplates = {
            economist: {
                galactic_mystery: "As an economist, I'm concerned about the market implications of this phenomenon. Historical data suggests similar events led to 15-20% GDP fluctuations. Diversification is key. #EconomicAnalysis",
                economic_upheaval: "This crash was predictable given the overheated markets. I've been warning about unsustainable growth patterns for months. Time for structural reforms. #MarketAnalysis",
                diplomatic_crisis: "Economic sanctions rarely work without multilateral support. The trade implications of this crisis could reshape galactic commerce for decades. #TradePolicy"
            },
            diplomat: {
                galactic_mystery: "In my 30 years of diplomatic service, I've never seen anything like this. We need calm, measured responses and international cooperation. Panic helps no one. #Diplomacy",
                diplomatic_crisis: "Back-channel communications are still active. There's always hope for peaceful resolution if all parties show flexibility. History teaches us that wars benefit no one. #Peace",
                economic_upheaval: "Economic instability often leads to political upheaval. Now more than ever, we need strong diplomatic ties to weather this storm together. #Unity"
            },
            military_analyst: {
                galactic_mystery: "Unknown phenomena require defensive postures. I recommend increased patrol schedules and enhanced sensor networks until we understand what we're dealing with. #Defense",
                diplomatic_crisis: "Military buildup is concerning, but it's often a negotiating tactic. Real conflicts have different signatures. Still, vigilance is warranted. #MilitaryAnalysis",
                economic_upheaval: "Economic warfare is still warfare. Cyber attacks on financial systems are a real threat during market instability. Secure your networks. #CyberSecurity"
            },
            scientist: {
                galactic_mystery: "The energy signatures don't match any known natural phenomena. We need more data before drawing conclusions. Science, not speculation, will solve this. #Science",
                economic_upheaval: "Market behavior follows predictable patterns, much like physical systems. This volatility suggests external manipulation rather than natural correction. #DataScience",
                diplomatic_crisis: "Game theory suggests that cooperation yields better outcomes than conflict. Perhaps our leaders should consult more mathematicians. #GameTheory"
            },
            historian: {
                galactic_mystery: "History shows us that 'unprecedented' events often have precedents we've forgotten. I'm researching similar occurrences from the archives. #History",
                diplomatic_crisis: "The parallels to the Crisis of 2387 are striking. That conflict was resolved through cultural exchange programs. Perhaps we should try that approach again. #HistoricalPerspective",
                economic_upheaval: "Every major economic crisis has led to innovation and reform. This too shall pass, but we must learn from it. #EconomicHistory"
            }
        };
        
        const templates = expertTemplates[expertType] || {};
        const template = templates[event.type];
        
        if (!template) return null;
        
        const expertNames = {
            economist: ['Dr. Elena Vasquez', 'Prof. Marcus Chen', 'Dr. Zara Al-Rashid'],
            diplomat: ['Ambassador Keth Vorthak', 'Envoy Sarah Rodriguez', 'Minister Lyra Moonwhisper'],
            military_analyst: ['General Hayes', 'Admiral Voss', 'Colonel Park'],
            scientist: ['Dr. Quantum Flux', 'Prof. Nova Sterling', 'Dr. Cosmos Webb'],
            historian: ['Dr. Archive Keeper', 'Prof. Temporal Studies', 'Dr. Chronicle Sage']
        };
        
        const names = expertNames[expertType] || ['Expert Analyst'];
        const authorName = names[Math.floor(Math.random() * names.length)];
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: `expert_${expertType}_${Math.floor(Math.random() * 1000)}`,
            authorName: authorName,
            authorType: 'expert',
            expertise: expertType,
            content: template,
            timestamp: Date.now() + Math.floor(Math.random() * 3600000), // Stagger posts over an hour
            category: 'expert_analysis',
            priority: 'medium',
            relatedEventId: event.id,
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 5000) + 1000,
                reposts: Math.floor(Math.random() * 1000) + 200,
                comments: Math.floor(Math.random() * 200) + 50
            }
        };
    }

    generateCitizenReactionPosts(event, gameAnalysis) {
        const posts = [];
        const numPosts = Math.floor(Math.random() * 5) + 3; // 3-7 citizen posts
        
        for (let i = 0; i < numPosts; i++) {
            const citizenPost = this.createCitizenReactionPost(event, gameAnalysis);
            if (citizenPost) {
                posts.push(citizenPost);
            }
        }
        
        return posts;
    }

    createCitizenReactionPost(event, gameAnalysis) {
        const reactionTemplates = [
            "Well, this is just great. As if we didn't have enough to worry about already. 😤 #JustMyLuck",
            "Anyone else getting major déjà vu from this? Feels like we've been here before... #History",
            "My grandmother always said 'interesting times' were a curse. She was right. 😅 #Wisdom",
            "Time to stock up on supplies again. Why is it always something? 🛒 #Prepared",
            "At least the memes will be good. Silver lining, right? 😂 #Humor",
            "Calling my mom to tell her I love her. You never know... 💕 #Family",
            "This is why I don't trust politicians. They never tell us the whole truth. 🙄 #Politics",
            "My cat is acting weird too. Animals always know first. 🐱 #PetWisdom",
            "Great, there goes my vacation plans. Thanks, universe. ✈️❌ #Travel",
            "Anyone want to start a betting pool on how this ends? 🎲 #Gambling"
        ];
        
        const eventSpecificTemplates = {
            galactic_mystery: [
                "Okay but what if it's aliens? Like, ACTUAL aliens? 👽 #AlienTheory",
                "My conspiracy theorist uncle is having a field day with this one 🛸 #Conspiracy",
                "Scientists say 'don't panic' but have you SEEN the readings? 📊😱 #Panic",
                "Time to rewatch all my favorite sci-fi movies for research 🎬 #SciFi"
            ],
            economic_upheaval: [
                "There goes my retirement fund. Again. 📉💸 #Broke",
                "Time to learn how to grow my own food, I guess 🌱 #SelfSufficient",
                "Rich get richer, poor get poorer. Tale as old as time 💰 #Inequality",
                "My crypto portfolio is somehow doing better than the stock market 🚀 #Crypto"
            ],
            diplomatic_crisis: [
                "Why can't we all just get along? Asking for a galaxy... 🌌 #Peace",
                "Politicians arguing while we pay the price. Typical. 🤦‍♀️ #Politics",
                "Time to dust off the old protest signs 📢 #Activism",
                "My neighbor is from [other civilization]. Still a good neighbor. 🏠 #Unity"
            ]
        };
        
        const allTemplates = [...reactionTemplates, ...(eventSpecificTemplates[event.type] || [])];
        const template = allTemplates[Math.floor(Math.random() * allTemplates.length)];
        
        const citizenNames = [
            'Alex StarGazer', 'Jordan Cosmos', 'Sam Nebula', 'Casey Orbit', 'Riley Galaxy',
            'Morgan Stellar', 'Avery Comet', 'Quinn Asteroid', 'Sage Pulsar', 'River Void'
        ];
        
        const authorName = citizenNames[Math.floor(Math.random() * citizenNames.length)];
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: `citizen_${Math.floor(Math.random() * 100000)}`,
            authorName: authorName,
            authorType: 'citizen',
            content: template,
            timestamp: Date.now() + Math.floor(Math.random() * 7200000), // Spread over 2 hours
            category: 'citizen_reaction',
            priority: 'low',
            relatedEventId: event.id,
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 500) + 10,
                reposts: Math.floor(Math.random() * 100) + 5,
                comments: Math.floor(Math.random() * 50) + 2
            }
        };
    }

    async generatePlotTwistWitterPosts(twist, gameAnalysis, availableCharacters = []) {
        const posts = [];
        
        // Generate dramatic reveal posts
        const revealPost = this.createPlotTwistRevealPost(twist);
        if (revealPost) {
            posts.push(revealPost);
        }
        
        // Generate shocked reaction posts using existing characters when possible
        const reactionPosts = this.generateTwistReactionPosts(twist, availableCharacters);
        posts.push(...reactionPosts);
        
        return posts;
    }

    createPlotTwistRevealPost(twist) {
        const revealTemplates = {
            unexpected_alliance: "🤝 SHOCKING: Former enemies announce surprise alliance! 'The galaxy has changed, and so must we,' says joint statement. #UnexpectedAlliance #Politics",
            hidden_agenda_revealed: "🎭 EXPOSED: Leaked documents reveal hidden agenda behind recent policies. The truth is finally out! #Exposed #Truth #Politics",
            mysterious_benefactor: "🕵️ REVEALED: Anonymous benefactor behind major infrastructure projects identified as [CLASSIFIED]. Plot thickens! #Mystery #Benefactor",
            double_agent_exposed: "🕵️‍♀️ BETRAYAL: Trusted advisor revealed as double agent in stunning security breach. How deep does this go? #DoubleAgent #Betrayal #Security",
            ancient_technology_activated: "⚡ INCREDIBLE: Ancient alien technology comes online after millennia! Scientists scramble to understand implications. #AncientTech #Aliens #Science",
            cosmic_phenomenon: "🌌 UNPRECEDENTED: Cosmic event defies all known physics! Reality itself seems to be shifting. What does this mean for us all? #CosmicEvent #Physics #Reality"
        };
        
        const template = revealTemplates[twist.type] || `🚨 PLOT TWIST: ${twist.type} changes everything! #PlotTwist #Breaking`;
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: 'galactic_insider',
            authorName: 'Galactic Insider',
            authorType: 'investigative_journalist',
            content: template,
            timestamp: Date.now(),
            category: 'plot_twist',
            priority: 'very_high',
            relatedTwistId: twist.id,
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 20000) + 10000,
                reposts: Math.floor(Math.random() * 5000) + 2000,
                comments: Math.floor(Math.random() * 1000) + 500
            }
        };
    }

    generateTwistReactionPosts(twist) {
        const posts = [];
        const reactionTemplates = [
            "I KNEW IT! I've been saying this for months! Finally vindicated! 🎉 #CalledIt",
            "My mind is officially blown 🤯 Did NOT see that coming #PlotTwist",
            "Wait, what? I need to read this again... and again... 📖 #Confused",
            "This explains SO much! All the pieces are falling into place 🧩 #Revelation",
            "Okay universe, what's next? I'm ready for anything at this point 🎢 #BringIt",
            "My conspiracy theory group is going WILD right now 📱💬 #Vindicated",
            "Time to update all my predictions. Back to the drawing board! 📊 #Recalculating"
        ];
        
        const numReactions = Math.floor(Math.random() * 4) + 3; // 3-6 reactions
        
        for (let i = 0; i < numReactions; i++) {
            const template = reactionTemplates[Math.floor(Math.random() * reactionTemplates.length)];
            const citizenNames = ['Shocked Citizen', 'Plot Theorist', 'Galaxy Watcher', 'Truth Seeker', 'Reality Checker'];
            const authorName = citizenNames[Math.floor(Math.random() * citizenNames.length)];
            
            posts.push({
                id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                authorId: `reactor_${Math.floor(Math.random() * 10000)}`,
                authorName: authorName,
                authorType: 'citizen',
                content: template,
                timestamp: Date.now() + Math.floor(Math.random() * 1800000), // Within 30 minutes
                category: 'twist_reaction',
                priority: 'medium',
                relatedTwistId: twist.id,
                hashtags: this.extractHashtags(template),
                engagement: {
                    likes: Math.floor(Math.random() * 1000) + 100,
                    reposts: Math.floor(Math.random() * 200) + 20,
                    comments: Math.floor(Math.random() * 100) + 10
                }
            });
        }
        
        return posts;
    }

    async generateCharacterReactionPosts(gameAnalysis, decisions, availableCharacters = []) {
        const posts = [];
        
        // Generate posts from injected characters
        for (const character of decisions.characterInjections) {
            const characterPost = this.createCharacterIntroPost(character);
            if (characterPost) {
                posts.push(characterPost);
            }
        }
        
        // Generate posts from existing active characters reacting to events
        const activeCharacterPosts = this.generateActiveCharacterPosts(availableCharacters, gameAnalysis, decisions);
        posts.push(...activeCharacterPosts);
        
        return posts;
    }

    generateActiveCharacterPosts(availableCharacters, gameAnalysis, decisions) {
        const posts = [];
        
        // Select a few characters to post reactions
        const reactingCharacters = availableCharacters
            .filter(char => Math.random() < 0.3) // 30% chance each character posts
            .slice(0, 3); // Max 3 character posts per tick
        
        for (const character of reactingCharacters) {
            const reactionPost = this.createCharacterReactionPost(character, gameAnalysis, decisions);
            if (reactionPost) {
                posts.push(reactionPost);
            }
        }
        
        return posts;
    }

    createCharacterReactionPost(character, gameAnalysis, decisions) {
        const reactionTemplates = {
            diplomats: [
                "Monitoring the situation closely. Diplomatic channels remain open and we're committed to peaceful solutions. 🕊️ #Diplomacy #Peace",
                "In times like these, dialogue is more important than ever. I'm reaching out to all parties involved. 🤝 #Unity #Communication",
                "History shows us that cooler heads prevail. Let's focus on what unites us, not what divides us. 🌍 #Wisdom #Hope"
            ],
            businessLeaders: [
                "Market volatility creates opportunities for those who stay calm and think strategically. 📈 #Business #Strategy",
                "Our supply chains are resilient, but we're monitoring the situation and adjusting as needed. 💼 #Leadership #Adaptation",
                "Investing in our people and communities during uncertain times. That's how we build lasting success. 🚀 #Investment #Community"
            ],
            military: [
                "Our forces remain vigilant and ready to protect what matters most. Security is our top priority. 🛡️ #Defense #Security",
                "Training and preparation are key. Our personnel are the best in the galaxy and they're ready for anything. ⚔️ #Military #Readiness",
                "Strength through unity. Working closely with our allies to ensure galactic stability. 🤝 #Alliance #Strength"
            ],
            scientists: [
                "Fascinating developments! The data is still coming in, but early analysis suggests... 🔬 #Science #Research #Data",
                "Science doesn't sleep! Our teams are working around the clock to understand these phenomena. 🌌 #Discovery #Innovation",
                "Every crisis is an opportunity to learn something new about our universe. Stay curious! 🧪 #Science #Learning"
            ],
            citizens: [
                "Just trying to stay positive and help my community through these interesting times. 💪 #Community #Resilience",
                "Anyone else feeling like we're living in a sci-fi movie? At least it's not boring! 😅 #Life #Perspective",
                "Grateful for strong leadership and hoping for the best. We've been through tough times before. 🙏 #Hope #Gratitude"
            ]
        };
        
        const templates = reactionTemplates[character.category] || reactionTemplates.citizens;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: character.id,
            authorName: character.name,
            authorType: character.category,
            content: template,
            timestamp: Date.now() + Math.floor(Math.random() * 1800000), // Within 30 minutes
            category: 'character_reaction',
            priority: 'low',
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 1000) + 100,
                reposts: Math.floor(Math.random() * 200) + 20,
                comments: Math.floor(Math.random() * 100) + 10
            }
        };
    }

    createCharacterIntroPost(character) {
        const introTemplates = {
            diplomats: [
                "Honored to serve the galaxy in these challenging times. Diplomacy is not just my profession—it's my calling. 🕊️ #Diplomacy #Service",
                "Every crisis is an opportunity for understanding. I look forward to building bridges where others see walls. 🌉 #Unity #Peace",
                "In my years of service, I've learned that listening is more powerful than speaking. Ready to listen. 👂 #Diplomacy #Wisdom"
            ],
            businessLeaders: [
                "Excited to announce my new role! In times of uncertainty, bold leadership and smart investments pave the way forward. 💼 #Business #Leadership",
                "Market volatility creates opportunity for those brave enough to act. Let's build something amazing together! 🚀 #Entrepreneurship #Growth",
                "Success isn't just about profit—it's about creating value for everyone. Ready to make a difference! 💰 #Business #Impact"
            ],
            military: [
                "Proud to serve and protect. In uncertain times, strong defense ensures peaceful tomorrows. 🛡️ #Military #Service #Protection",
                "Vigilance is the price of freedom. I stand ready to defend what we hold dear. ⚔️ #Defense #Freedom #Duty",
                "Strategy, honor, and dedication—these are the pillars of effective defense. Ready for duty! 🎖️ #Military #Honor"
            ],
            scientists: [
                "Science doesn't sleep, and neither do I! Excited to tackle the mysteries our galaxy keeps throwing at us. 🔬 #Science #Research #Discovery",
                "Every question leads to ten more questions. That's what makes science so thrilling! Ready to explore the unknown. 🌌 #Science #Curiosity",
                "Data doesn't lie, but it sure loves to surprise us. Looking forward to some surprising discoveries! 📊 #Science #Data #Discovery"
            ],
            citizens: [
                "Just an ordinary citizen trying to make sense of these extraordinary times. We're all in this together! 🤝 #Community #Unity",
                "Sometimes the best insights come from everyday people. Happy to share my perspective! 👥 #CitizenVoice #Community",
                "They say the voice of the people matters. Well, here's mine! Ready to speak up for what's right. 📢 #Democracy #Voice"
            ]
        };
        
        const templates = introTemplates[character.category] || [
            `New to the scene but ready to make a difference! Excited to contribute to our galaxy's future. ✨ #NewBeginnings #Ready`
        ];
        
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: character.id,
            authorName: character.name,
            authorType: character.category,
            content: template,
            timestamp: Date.now() + Math.floor(Math.random() * 3600000), // Within an hour
            category: 'character_intro',
            priority: 'medium',
            relatedCharacterId: character.id,
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 2000) + 500,
                reposts: Math.floor(Math.random() * 400) + 100,
                comments: Math.floor(Math.random() * 200) + 50
            }
        };
    }

    async generateAmbientStoryPosts(gameAnalysis, availableCharacters = []) {
        const posts = [];
        
        // Generate atmospheric posts based on current game state
        if (Math.random() < 0.4) { // 40% chance
            const ambientPost = this.createAmbientStoryPost(gameAnalysis, availableCharacters);
            if (ambientPost) {
                posts.push(ambientPost);
            }
        }
        
        return posts;
    }

    createAmbientStoryPost(gameAnalysis, availableCharacters = []) {
        const mood = this.determineMoodFromAnalysis(gameAnalysis);
        
        const ambientTemplates = {
            peaceful: [
                "Beautiful sunset over New Terra tonight. Sometimes it's the simple moments that remind us what we're fighting for. 🌅 #Peace #Beauty #Home",
                "Trade ships arriving on schedule, markets stable, children playing in the parks. This is what prosperity looks like. 🚢 #Prosperity #Life",
                "The galaxy feels calm tonight. Here's hoping it stays that way. 🌌 #Peace #Hope #Gratitude"
            ],
            tense: [
                "Anyone else notice the increased security patrols lately? Probably nothing, but... 👮‍♀️ #Security #Tension #Observation",
                "Emergency broadcasts testing more frequently. 'Just routine maintenance' they say. Sure. 📻 #Emergency #Tension #Suspicious",
                "My neighbor's been stockpiling supplies. Starting to think they know something we don't. 📦 #Preparation #Tension #Worry"
            ],
            chaotic: [
                "Third emergency siren this week. New normal, I guess? 🚨 #Emergency #Chaos #NewNormal",
                "Supply lines disrupted again. Good thing I learned to cook with whatever's available. 🍲 #Adaptation #Chaos #Survival",
                "Communication networks keep glitching. Hope this message gets through! 📡 #Communication #Chaos #Connection"
            ],
            mysterious: [
                "Strange lights in the sky again last night. Probably just atmospheric phenomena... right? 🌟 #Mystery #Sky #Wonder",
                "My grandmother's old stories about 'the time before' are starting to make more sense. 📚 #Mystery #History #Wisdom",
                "Found this weird artifact while cleaning out the attic. Anyone know what this symbol means? 🔍 #Mystery #Artifact #Ancient"
            ]
        };
        
        const templates = ambientTemplates[mood] || ambientTemplates.peaceful;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        const ambientNames = [
            'Daily Observer', 'Galaxy Watcher', 'Neighborhood Voice', 'Local Resident',
            'Community Member', 'Ordinary Citizen', 'Street Reporter', 'Life Chronicler'
        ];
        
        const authorName = ambientNames[Math.floor(Math.random() * ambientNames.length)];
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: `ambient_${Math.floor(Math.random() * 10000)}`,
            authorName: authorName,
            authorType: 'citizen',
            content: template,
            timestamp: Date.now() + Math.floor(Math.random() * 14400000), // Within 4 hours
            category: 'ambient_story',
            priority: 'low',
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 300) + 50,
                reposts: Math.floor(Math.random() * 50) + 10,
                comments: Math.floor(Math.random() * 30) + 5
            }
        };
    }

    async generateHumorWitterPosts(gameAnalysis, decisions, availableCharacters = []) {
        const posts = [];
        
        if (this.humorLevel !== 'low' && Math.random() < 0.6) { // 60% chance if humor is enabled
            const humorPost = this.createHumorPost(gameAnalysis, decisions, availableCharacters);
            if (humorPost) {
                posts.push(humorPost);
            }
        }
        
        return posts;
    }

    createHumorPost(gameAnalysis, decisions, availableCharacters = []) {
        const humorTemplates = {
            witty: [
                "Breaking: Local politician promises to 'fix everything.' Scientists baffled by this unprecedented claim. 🤔 #Politics #Humor #Impossible",
                "Galaxy's problems solved by committee. Committee still in formation. Formation committee being formed. 📋 #Bureaucracy #Humor #Infinite",
                "Economic experts predict market will either go up, down, or sideways. Truly groundbreaking analysis! 📈📉 #Economics #Humor #Obvious"
            ],
            sarcastic: [
                "Oh great, another 'unprecedented' crisis. Because we were getting bored with the last five. 🙄 #Sarcasm #Crisis #Bored",
                "Politicians calling for unity while arguing about everything. Peak leadership right there. 👏 #Politics #Sarcasm #Unity",
                "Emergency meeting to discuss scheduling the emergency meeting about the emergency. Efficiency! ⏰ #Bureaucracy #Sarcasm #Meetings"
            ],
            absurd: [
                "My pet rock has started giving better political advice than most pundits. Considering a career change for it. 🪨 #Absurd #Politics #PetRock",
                "Local man solves galactic crisis by turning it off and on again. IT support vindicated. 💻 #Absurd #ITSupport #Simple",
                "Breaking: Alien invasion postponed due to scheduling conflicts. Invaders apologize for inconvenience. 👽 #Absurd #Aliens #Polite"
            ],
            punny: [
                "This economic situation is really out of this world... literally, since we're in space. 🚀 #Puns #Economics #Space",
                "Diplomatic relations are really taking off... unlike my career in comedy. 🛸 #Puns #Diplomacy #Comedy",
                "The galaxy's problems are really stellar... in the worst possible way. ⭐ #Puns #Problems #Stellar"
            ]
        };
        
        const templates = humorTemplates[this.currentComedyStyle] || humorTemplates.witty;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return {
            id: `witter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId: 'cosmic_comedian',
            authorName: 'Cosmic Comedian',
            authorType: 'comedian',
            content: template,
            timestamp: Date.now() + Math.floor(Math.random() * 7200000), // Within 2 hours
            category: 'humor',
            priority: 'low',
            hashtags: this.extractHashtags(template),
            engagement: {
                likes: Math.floor(Math.random() * 5000) + 1000,
                reposts: Math.floor(Math.random() * 1000) + 200,
                comments: Math.floor(Math.random() * 500) + 100
            }
        };
    }

    // Utility methods for Witter posts
    personalizePostContent(template, context) {
        // Replace placeholders with context-specific information
        let content = template;
        
        if (context.affectedCivs && context.affectedCivs.length > 0) {
            content = content.replace('{civilization}', context.affectedCivs[0]);
        }
        
        content = content.replace('{sector}', `Sector ${Math.floor(Math.random() * 999) + 1}`);
        content = content.replace('{percentage}', `${Math.floor(Math.random() * 50) + 10}%`);
        content = content.replace('{time}', this.getRandomTimeReference());
        
        return content;
    }

    getRandomTimeReference() {
        const references = ['this morning', 'earlier today', 'just now', 'moments ago', 'this afternoon', 'recently'];
        return references[Math.floor(Math.random() * references.length)];
    }

    extractHashtags(content) {
        const hashtagRegex = /#\w+/g;
        const matches = content.match(hashtagRegex);
        return matches ? matches.map(tag => tag.substring(1)) : [];
    }

    // API integration methods (these would integrate with actual image/video generation services)
    async callImageGenerationAPI(prompt) {
        // This would integrate with services like DALL-E, Midjourney, Stable Diffusion, etc.
        // For now, return a placeholder URL
        const encodedPrompt = encodeURIComponent(prompt);
        return `https://api.imagegeneration.service/generate?prompt=${encodedPrompt}&style=cinematic_scifi&resolution=4k`;
    }

    async callVideoGenerationAPI(prompt) {
        // This would integrate with services like RunwayML, Pika Labs, etc.
        // For now, return a placeholder URL
        const encodedPrompt = encodeURIComponent(prompt);
        return `https://api.videogeneration.service/generate?prompt=${encodedPrompt}&duration=auto&quality=hd`;
    }

    // Utility methods for story generation
    getStorylineTemplates(type) {
        const templates = {
            galactic_mystery: [
                {
                    setup: "Strange signals detected from {location}",
                    complications: ["investigation reveals ancient technology", "multiple factions get involved", "signals contain hidden message"],
                    resolution: ["technology is activated", "mystery solved with consequences", "new questions arise"]
                }
            ],
            economic_upheaval: [
                {
                    setup: "Market crash in {sector} sector",
                    complications: ["ripple effects across galaxy", "emergency measures fail", "black market emerges"],
                    resolution: ["new economic system", "return to stability", "permanent changes"]
                }
            ]
        };
        
        return templates[type] || [{ setup: "Something interesting happens", complications: ["it gets complicated"], resolution: ["it resolves somehow"] }];
    }

    // Integration with other AI systems
    coordinateWithCharacterAI(characterAI, gameState) {
        // Share story context with Character AI
        const storyContext = this.getActiveStoryContext();
        characterAI.updateStoryContext(storyContext);
        
        // Request character actions that support current storylines
        const characterRequests = this.generateCharacterActionRequests();
        return characterAI.processStoryRequests(characterRequests);
    }

    coordinateWithCivAI(civAI, gameState) {
        // Provide story hooks for civilization AI
        const storyHooks = this.generateCivStoryHooks();
        civAI.updateStoryHooks(storyHooks);
        
        // Get feedback on story impact
        return civAI.assessStoryImpact(this.activeStorylines);
    }

    // Cost optimization methods
    optimizeProcessing() {
        // Reduce processing frequency during low-activity periods
        const activityLevel = this.assessCurrentActivity();
        
        if (activityLevel < 0.3) {
            return { processingFrequency: 0.5, detailLevel: 'low' };
        } else if (activityLevel > 0.8) {
            return { processingFrequency: 1.5, detailLevel: 'high' };
        }
        
        return { processingFrequency: 1.0, detailLevel: 'medium' };
    }

    // Public API methods
    getActiveStorylines() {
        return Array.from(this.activeStorylines.values());
    }

    getPersonalityInfo() {
        return {
            name: this.personality.name,
            traits: this.personality.traits,
            humorStyle: this.personality.humorStyle,
            catchphrase: this.personality.catchphrase,
            currentComedyStyle: this.currentComedyStyle
        };
    }

    injectManualEvent(eventData) {
        // Allow manual story injection for testing or special events
        const event = {
            id: `manual_${Date.now()}`,
            ...eventData,
            source: 'manual',
            timestamp: Date.now()
        };
        
        this.activeStorylines.set(event.id, event);
        return event;
    }
}

module.exports = GameMasterAI;
