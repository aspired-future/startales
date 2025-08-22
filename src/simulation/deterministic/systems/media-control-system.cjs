// Media Control System - Enhanced media oversight and press conference management
// Integrates with news-generation-system for comprehensive media simulation

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class MediaControlSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('media-control-system', config);
        
        // Core media control state
        this.mediaState = {
            // Press conferences and government communications
            pressConferences: {
                scheduled: [],
                completed: [],
                nextScheduled: null,
                leaderAppearances: 0,
                secretaryAppearances: 0,
                averageImpact: 0.5,
                totalCoverage: 0
            },
            
            // Press secretary performance
            pressSecretary: {
                name: 'Sarah Mitchell',
                communicationSkill: 0.85,
                mediaRelationsSkill: 0.80,
                crisisManagementSkill: 0.75,
                effectivenessVsLeader: 0.75,
                currentApprovalRating: 0.72,
                controversyCount: 0,
                successfulBriefings: 0
            },
            
            // Media outlet control and relationships
            mediaOutlets: new Map([
                ['GNN', {
                    name: 'Galactic News Network',
                    type: 'public_broadcaster',
                    governmentStake: 0.25,
                    credibilityRating: 0.85,
                    politicalBias: 0.1,
                    complianceScore: 0.95,
                    relationship: 'cooperative'
                }],
                ['INS', {
                    name: 'Independent News Service',
                    type: 'private_independent',
                    governmentStake: 0.0,
                    credibilityRating: 0.78,
                    politicalBias: -0.15,
                    complianceScore: 0.88,
                    relationship: 'neutral'
                }],
                ['NIS', {
                    name: 'National Information Service',
                    type: 'state_owned',
                    governmentStake: 1.0,
                    credibilityRating: 0.65,
                    politicalBias: 0.45,
                    complianceScore: 1.0,
                    relationship: 'controlled'
                }]
            ]),
            
            // Press freedom and control metrics
            pressFreedomScore: 75,
            mediaIndependence: 0.68,
            publicTrustInMedia: 0.71,
            internationalRanking: 45,
            
            // Policy enforcement
            activePolicies: [
                {
                    name: 'Broadcasting Licensing Act',
                    type: 'licensing',
                    controlIntensity: 0.60,
                    complianceRate: 0.95
                },
                {
                    name: 'National Security Information Guidelines',
                    type: 'content_regulation',
                    controlIntensity: 0.75,
                    complianceRate: 0.88
                }
            ]
        };
    }

    initializeInputKnobs() {
        // Press Freedom and Control (1-6)
        this.addInputKnob('press_freedom_level', 'float', 0.75, 
            'Overall press freedom level (0-1)', 0, 1);
        
        this.addInputKnob('censorship_intensity', 'float', 0.25, 
            'Media censorship intensity (0-1)', 0, 1);
        
        this.addInputKnob('government_media_influence', 'float', 0.30, 
            'Government influence over media content (0-1)', 0, 1);
        
        this.addInputKnob('propaganda_effectiveness', 'float', 0.50, 
            'State propaganda effectiveness (0-1)', 0, 1);
        
        this.addInputKnob('information_transparency', 'float', 0.70, 
            'Government information transparency (0-1)', 0, 1);
        
        this.addInputKnob('journalist_safety_protection', 'float', 0.80, 
            'Protection for journalists and press (0-1)', 0, 1);
        
        // Content and Editorial Control (7-12)
        this.addInputKnob('editorial_independence', 'float', 0.65, 
            'Editorial independence from government (0-1)', 0, 1);
        
        this.addInputKnob('content_diversity_promotion', 'float', 0.60, 
            'Promotion of diverse media content (0-1)', 0, 1);
        
        this.addInputKnob('fact_checking_enforcement', 'float', 0.70, 
            'Fact-checking standards enforcement (0-1)', 0, 1);
        
        this.addInputKnob('misinformation_countermeasures', 'float', 0.55, 
            'Countermeasures against misinformation (0-1)', 0, 1);
        
        this.addInputKnob('investigative_journalism_support', 'float', 0.50, 
            'Support for investigative journalism (0-1)', 0, 1);
        
        this.addInputKnob('public_interest_prioritization', 'float', 0.60, 
            'Prioritization of public interest content (0-1)', 0, 1);
        
        // Regulatory and Legal Framework (13-18)
        this.addInputKnob('licensing_strictness', 'float', 0.40, 
            'Media licensing strictness (0-1)', 0, 1);
        
        this.addInputKnob('ownership_concentration_limits', 'float', 0.50, 
            'Limits on media ownership concentration (0-1)', 0, 1);
        
        this.addInputKnob('foreign_media_restrictions', 'float', 0.30, 
            'Restrictions on foreign media ownership (0-1)', 0, 1);
        
        this.addInputKnob('media_funding_transparency', 'float', 0.65, 
            'Transparency of media funding sources (0-1)', 0, 1);
        
        this.addInputKnob('regulatory_enforcement_consistency', 'float', 0.70, 
            'Consistency of regulatory enforcement (0-1)', 0, 1);
        
        this.addInputKnob('appeal_process_fairness', 'float', 0.75, 
            'Fairness of media regulation appeals (0-1)', 0, 1);
        
        // Crisis and Emergency Powers (19-24)
        this.addInputKnob('emergency_broadcast_authority', 'float', 0.60, 
            'Government emergency broadcast authority (0-1)', 0, 1);
        
        this.addInputKnob('crisis_information_control', 'float', 0.45, 
            'Information control during crises (0-1)', 0, 1);
        
        this.addInputKnob('national_security_exemptions', 'float', 0.40, 
            'National security media exemptions (0-1)', 0, 1);
        
        this.addInputKnob('wartime_media_restrictions', 'float', 0.35, 
            'Media restrictions during wartime (0-1)', 0, 1);
        
        this.addInputKnob('public_safety_override_authority', 'float', 0.50, 
            'Public safety media override authority (0-1)', 0, 1);
        
        this.addInputKnob('international_media_coordination', 'float', 0.45, 
            'International media coordination level (0-1)', 0, 1);
        
        // Press Conference Management (25-30)
        this.addInputKnob('press_conference_frequency', 'float', 0.60, 
            'Frequency of press conferences (0-1)', 0, 1);
        
        this.addInputKnob('leader_personal_appearance_rate', 'float', 0.40, 
            'Rate of leader vs press secretary appearances (0-1)', 0, 1);
        
        this.addInputKnob('press_access_level', 'float', 0.70, 
            'Media access to press events (0-1)', 0, 1);
        
        this.addInputKnob('question_screening_intensity', 'float', 0.30, 
            'Pre-screening intensity for questions (0-1)', 0, 1);
        
        this.addInputKnob('hostile_question_management', 'float', 0.50, 
            'Management of hostile questions (0-1)', 0, 1);
        
        this.addInputKnob('message_coordination_effectiveness', 'float', 0.65, 
            'Effectiveness of coordinated messaging (0-1)', 0, 1);
    }

    initializeOutputKnobs() {
        // Press Freedom Metrics
        this.addOutputKnob('calculated_press_freedom_score', 'float', 75, 
            'Calculated press freedom score (0-100)');
        
        this.addOutputKnob('media_independence_level', 'float', 0.68, 
            'Level of media independence (0-1)');
        
        this.addOutputKnob('public_trust_in_media', 'float', 0.71, 
            'Public trust in media institutions (0-1)');
        
        // Government Communication Effectiveness
        this.addOutputKnob('government_message_reach', 'float', 0.65, 
            'Effectiveness of government messaging (0-1)');
        
        this.addOutputKnob('press_conference_impact', 'float', 0.55, 
            'Average impact of press conferences (0-1)');
        
        this.addOutputKnob('leader_vs_secretary_effectiveness', 'float', 1.25, 
            'Leader effectiveness multiplier vs secretary');
        
        // Media Control Effectiveness
        this.addOutputKnob('media_compliance_rate', 'float', 0.91, 
            'Overall media compliance with policies (0-1)');
        
        this.addOutputKnob('information_control_effectiveness', 'float', 0.45, 
            'Effectiveness of information control (0-1)');
        
        this.addOutputKnob('international_media_reputation', 'float', 0.68, 
            'International reputation for media freedom (0-1)');
        
        // Crisis Communication Readiness
        this.addOutputKnob('crisis_communication_readiness', 'float', 0.72, 
            'Readiness for crisis communications (0-1)');
        
        this.addOutputKnob('emergency_broadcast_capability', 'float', 0.85, 
            'Emergency broadcast system capability (0-1)');
        
        this.addOutputKnob('media_coordination_effectiveness', 'float', 0.60, 
            'Cross-media coordination effectiveness (0-1)');
    }

    simulateStep(timeDelta) {
        const inputs = this.getCurrentInputs();
        
        // Update press freedom metrics
        this.updatePressFreedomMetrics(inputs, timeDelta);
        
        // Simulate press conferences
        this.simulatePressConferences(inputs, timeDelta);
        
        // Update media outlet relationships
        this.updateMediaOutletRelationships(inputs, timeDelta);
        
        // Calculate policy effectiveness
        this.updatePolicyEffectiveness(inputs, timeDelta);
        
        // Update press secretary performance
        this.updatePressSecretaryPerformance(inputs, timeDelta);
        
        // Calculate output metrics
        this.calculateOutputMetrics(inputs);
        
        return this.getOutputs();
    }

    updatePressFreedomMetrics(inputs, timeDelta) {
        // Calculate press freedom score based on input knobs
        const freedomFactors = [
            inputs.press_freedom_level * 25,
            (1 - inputs.censorship_intensity) * 20,
            (1 - inputs.government_media_influence) * 15,
            inputs.journalist_safety_protection * 15,
            inputs.editorial_independence * 12.5,
            inputs.information_transparency * 12.5
        ];
        
        const newScore = freedomFactors.reduce((sum, factor) => sum + factor, 0);
        
        // Smooth transition
        this.mediaState.pressFreedomScore = this.smoothTransition(
            this.mediaState.pressFreedomScore, 
            newScore, 
            timeDelta * 0.1
        );
        
        // Update media independence
        this.mediaState.mediaIndependence = this.smoothTransition(
            this.mediaState.mediaIndependence,
            inputs.editorial_independence * 0.7 + (1 - inputs.government_media_influence) * 0.3,
            timeDelta * 0.05
        );
        
        // Update public trust
        const trustFactors = [
            inputs.fact_checking_enforcement,
            inputs.information_transparency,
            (1 - inputs.censorship_intensity),
            inputs.investigative_journalism_support
        ];
        
        const targetTrust = trustFactors.reduce((sum, factor) => sum + factor, 0) / 4;
        this.mediaState.publicTrustInMedia = this.smoothTransition(
            this.mediaState.publicTrustInMedia,
            targetTrust,
            timeDelta * 0.03
        );
    }

    simulatePressConferences(inputs, timeDelta) {
        const conferenceFrequency = inputs.press_conference_frequency;
        const leaderAppearanceRate = inputs.leader_personal_appearance_rate;
        
        // Simulate press conference scheduling based on frequency
        const shouldSchedule = Math.random() < conferenceFrequency * timeDelta * 0.1;
        
        if (shouldSchedule && this.mediaState.pressConferences.scheduled.length < 3) {
            const isLeaderPresenting = Math.random() < leaderAppearanceRate;
            
            const conference = {
                id: `conf_${Date.now()}`,
                title: this.generateConferenceTitle(),
                presenter: isLeaderPresenting ? 'leader' : 'secretary',
                scheduledTime: Date.now() + (Math.random() * 7 * 24 * 60 * 60 * 1000), // Next week
                expectedImpact: isLeaderPresenting ? 0.8 : 0.6,
                politicalRisk: isLeaderPresenting ? 0.65 : 0.25,
                topics: this.generateConferenceTopics()
            };
            
            this.mediaState.pressConferences.scheduled.push(conference);
            
            if (isLeaderPresenting) {
                this.mediaState.pressConferences.leaderAppearances++;
            } else {
                this.mediaState.pressConferences.secretaryAppearances++;
            }
        }
        
        // Simulate completed conferences
        this.mediaState.pressConferences.scheduled.forEach((conf, index) => {
            if (conf.scheduledTime <= Date.now()) {
                const completedConf = this.simulateConferenceExecution(conf, inputs);
                this.mediaState.pressConferences.completed.push(completedConf);
                this.mediaState.pressConferences.scheduled.splice(index, 1);
            }
        });
    }

    simulateConferenceExecution(conference, inputs) {
        const isLeader = conference.presenter === 'leader';
        const questionScreening = inputs.question_screening_intensity;
        const hostileManagement = inputs.hostile_question_management;
        const messageCoordination = inputs.message_coordination_effectiveness;
        
        // Simulate Q&A session
        const totalQuestions = Math.floor(Math.random() * 15) + 5;
        const hostileQuestions = Math.floor(totalQuestions * (0.3 - questionScreening * 0.2));
        const answeredQuestions = Math.floor(totalQuestions * (0.8 + (isLeader ? 0.1 : 0.05)));
        
        // Calculate impact
        const answerRate = answeredQuestions / totalQuestions;
        const hostileRate = hostileQuestions / totalQuestions;
        
        let impact = 0.5 + (answerRate * 0.3) - (hostileRate * 0.2);
        impact += messageCoordination * 0.1;
        
        if (isLeader) {
            impact += 0.25; // Leader presence bonus
        }
        
        // Apply hostile question management
        impact += hostileManagement * hostileRate * 0.2;
        
        // Clamp impact
        impact = Math.max(0, Math.min(1, impact));
        
        return {
            ...conference,
            status: 'completed',
            completedTime: Date.now(),
            questionsAsked: totalQuestions,
            questionsAnswered: answeredQuestions,
            hostileQuestions: hostileQuestions,
            finalImpact: impact,
            mediaCoverage: impact * 0.8 + Math.random() * 0.2,
            publicReception: impact * 0.7 + Math.random() * 0.3
        };
    }

    updateMediaOutletRelationships(inputs, timeDelta) {
        const governmentInfluence = inputs.government_media_influence;
        const pressFreedom = inputs.press_freedom_level;
        const licensing = inputs.licensing_strictness;
        
        this.mediaState.mediaOutlets.forEach((outlet, key) => {
            // Update compliance based on government pressure
            if (outlet.type === 'private_independent') {
                const pressureEffect = governmentInfluence * licensing * 0.5;
                outlet.complianceScore = this.smoothTransition(
                    outlet.complianceScore,
                    0.7 + pressureEffect * 0.3,
                    timeDelta * 0.02
                );
            }
            
            // Update credibility based on press freedom
            const credibilityTarget = outlet.credibilityRating * (0.8 + pressFreedom * 0.2);
            outlet.credibilityRating = this.smoothTransition(
                outlet.credibilityRating,
                credibilityTarget,
                timeDelta * 0.01
            );
            
            // Update relationship status
            if (outlet.complianceScore > 0.9) {
                outlet.relationship = 'cooperative';
            } else if (outlet.complianceScore < 0.6) {
                outlet.relationship = 'adversarial';
            } else {
                outlet.relationship = 'neutral';
            }
        });
    }

    updatePolicyEffectiveness(inputs, timeDelta) {
        const enforcement = inputs.regulatory_enforcement_consistency;
        const transparency = inputs.media_funding_transparency;
        
        this.mediaState.activePolicies.forEach(policy => {
            // Update compliance rates based on enforcement
            const targetCompliance = policy.controlIntensity * enforcement;
            policy.complianceRate = this.smoothTransition(
                policy.complianceRate,
                targetCompliance,
                timeDelta * 0.03
            );
        });
    }

    updatePressSecretaryPerformance(inputs, timeDelta) {
        const secretary = this.mediaState.pressSecretary;
        const messageCoordination = inputs.message_coordination_effectiveness;
        const pressAccess = inputs.press_access_level;
        
        // Performance improves with experience and good policies
        const performanceBoost = (messageCoordination + pressAccess) * 0.1 * timeDelta;
        
        secretary.mediaRelationsSkill = Math.min(1.0, 
            secretary.mediaRelationsSkill + performanceBoost * 0.01);
        
        secretary.communicationSkill = Math.min(1.0,
            secretary.communicationSkill + performanceBoost * 0.005);
        
        // Update approval rating based on recent performance
        const recentConferences = this.mediaState.pressConferences.completed.slice(-5);
        if (recentConferences.length > 0) {
            const avgImpact = recentConferences.reduce((sum, conf) => 
                sum + (conf.presenter === 'secretary' ? conf.finalImpact : 0), 0) / 
                recentConferences.filter(conf => conf.presenter === 'secretary').length;
            
            if (!isNaN(avgImpact)) {
                secretary.currentApprovalRating = this.smoothTransition(
                    secretary.currentApprovalRating,
                    avgImpact * 0.8 + 0.2,
                    timeDelta * 0.02
                );
            }
        }
    }

    calculateOutputMetrics(inputs) {
        // Update all output knobs
        this.setOutput('calculated_press_freedom_score', this.mediaState.pressFreedomScore);
        this.setOutput('media_independence_level', this.mediaState.mediaIndependence);
        this.setOutput('public_trust_in_media', this.mediaState.publicTrustInMedia);
        
        // Government communication effectiveness
        const recentConferences = this.mediaState.pressConferences.completed.slice(-10);
        const avgImpact = recentConferences.length > 0 ? 
            recentConferences.reduce((sum, conf) => sum + conf.finalImpact, 0) / recentConferences.length : 0.5;
        
        this.setOutput('press_conference_impact', avgImpact);
        this.setOutput('government_message_reach', avgImpact * 0.8 + inputs.propaganda_effectiveness * 0.2);
        
        // Leader effectiveness multiplier
        const leaderConferences = recentConferences.filter(conf => conf.presenter === 'leader');
        const secretaryConferences = recentConferences.filter(conf => conf.presenter === 'secretary');
        
        let effectivenessMultiplier = 1.25;
        if (leaderConferences.length > 0 && secretaryConferences.length > 0) {
            const leaderAvg = leaderConferences.reduce((sum, conf) => sum + conf.finalImpact, 0) / leaderConferences.length;
            const secretaryAvg = secretaryConferences.reduce((sum, conf) => sum + conf.finalImpact, 0) / secretaryConferences.length;
            effectivenessMultiplier = secretaryAvg > 0 ? leaderAvg / secretaryAvg : 1.25;
        }
        
        this.setOutput('leader_vs_secretary_effectiveness', effectivenessMultiplier);
        
        // Media control effectiveness
        const avgCompliance = this.mediaState.activePolicies.reduce((sum, policy) => 
            sum + policy.complianceRate, 0) / this.mediaState.activePolicies.length;
        
        this.setOutput('media_compliance_rate', avgCompliance);
        this.setOutput('information_control_effectiveness', 
            inputs.government_media_influence * avgCompliance);
        
        // International reputation
        const reputationFactors = [
            inputs.press_freedom_level,
            inputs.journalist_safety_protection,
            (1 - inputs.censorship_intensity),
            inputs.appeal_process_fairness
        ];
        
        const reputation = reputationFactors.reduce((sum, factor) => sum + factor, 0) / 4;
        this.setOutput('international_media_reputation', reputation);
        
        // Crisis readiness
        const crisisReadiness = (
            inputs.emergency_broadcast_authority +
            inputs.crisis_information_control +
            inputs.message_coordination_effectiveness
        ) / 3;
        
        this.setOutput('crisis_communication_readiness', crisisReadiness);
        this.setOutput('emergency_broadcast_capability', inputs.emergency_broadcast_authority);
        this.setOutput('media_coordination_effectiveness', inputs.message_coordination_effectiveness);
    }

    generateConferenceTitle() {
        const titles = [
            'Economic Policy Update',
            'Foreign Relations Briefing',
            'Domestic Affairs Review',
            'Infrastructure Progress Report',
            'Healthcare Policy Announcement',
            'Education Reform Discussion',
            'Environmental Policy Update',
            'Trade Relations Briefing',
            'Security Assessment Review',
            'Technology Initiative Launch'
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    }

    generateConferenceTopics() {
        const topics = ['economy', 'foreign_policy', 'domestic', 'infrastructure', 'healthcare', 
                       'education', 'environment', 'trade', 'security', 'technology'];
        const numTopics = Math.floor(Math.random() * 3) + 1;
        const selectedTopics = [];
        
        for (let i = 0; i < numTopics; i++) {
            const topic = topics[Math.floor(Math.random() * topics.length)];
            if (!selectedTopics.includes(topic)) {
                selectedTopics.push(topic);
            }
        }
        
        return selectedTopics;
    }

    smoothTransition(current, target, rate) {
        return current + (target - current) * rate;
    }

    // API integration methods
    getMediaControlDashboard() {
        return {
            pressFreedomScore: this.mediaState.pressFreedomScore,
            mediaIndependence: this.mediaState.mediaIndependence,
            publicTrust: this.mediaState.publicTrustInMedia,
            pressConferences: {
                scheduled: this.mediaState.pressConferences.scheduled.length,
                completed: this.mediaState.pressConferences.completed.length,
                leaderAppearances: this.mediaState.pressConferences.leaderAppearances,
                secretaryAppearances: this.mediaState.pressConferences.secretaryAppearances
            },
            pressSecretary: this.mediaState.pressSecretary,
            mediaOutlets: Array.from(this.mediaState.mediaOutlets.values())
        };
    }

    getPressConferences(status = null) {
        if (status === 'scheduled') {
            return this.mediaState.pressConferences.scheduled;
        } else if (status === 'completed') {
            return this.mediaState.pressConferences.completed;
        }
        return [
            ...this.mediaState.pressConferences.scheduled,
            ...this.mediaState.pressConferences.completed
        ];
    }

    schedulePressConference(data) {
        const conference = {
            id: `conf_${Date.now()}`,
            title: data.title,
            presenter: data.presenterType === 'leader_personal' ? 'leader' : 'secretary',
            scheduledTime: new Date(data.scheduledDate).getTime(),
            expectedImpact: data.presenterType === 'leader_personal' ? 0.8 : 0.6,
            politicalRisk: data.presenterType === 'leader_personal' ? 0.65 : 0.25,
            topics: data.topics || []
        };
        
        this.mediaState.pressConferences.scheduled.push(conference);
        return conference;
    }
}

module.exports = { MediaControlSystem };
