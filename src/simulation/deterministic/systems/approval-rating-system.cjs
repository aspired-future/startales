// Approval Rating System - Public opinion tracking based on all government actions
// Provides real-time approval metrics with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class ApprovalRatingSystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('approval-rating-system', config);
        
        // System state
        this.state = {
            // Overall Approval Metrics
            overallApproval: 0.65, // 0-1 scale
            approvalTrend: 0.02, // Change per period
            approvalVolatility: 0.15, // How much approval can swing
            
            // Demographic Approval Breakdown
            demographicApproval: {
                age_groups: {
                    young: 0.6,      // 18-35
                    middle: 0.7,     // 36-55  
                    senior: 0.65     // 56+
                },
                income_levels: {
                    low: 0.55,       // Bottom 30%
                    middle: 0.7,     // Middle 40%
                    high: 0.75       // Top 30%
                },
                education: {
                    basic: 0.6,
                    secondary: 0.65,
                    higher: 0.7
                },
                regions: {
                    urban: 0.68,
                    suburban: 0.72,
                    rural: 0.58
                }
            },
            
            // Issue-Based Approval
            issueApproval: {
                economy: 0.6,
                security: 0.7,
                healthcare: 0.55,
                education: 0.65,
                environment: 0.5,
                foreign_policy: 0.6,
                infrastructure: 0.6,
                social_issues: 0.55
            },
            
            // Approval Factors
            approvalFactors: {
                economic_performance: 0.3,    // Weight in overall approval
                policy_effectiveness: 0.25,
                leadership_perception: 0.2,
                crisis_management: 0.15,
                communication_quality: 0.1
            },
            
            // Recent Events Impact
            recentEvents: [],
            eventDecay: 0.95, // How quickly event impact fades
            
            // Polling Data
            pollAccuracy: 0.85,
            pollFrequency: 7, // Days between polls
            lastPollDate: 0,
            
            // Historical Data
            approvalHistory: [],
            maxHistoryLength: 365, // Keep 1 year of daily data
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('government_performance_modifier', 'float', 0.0, 
            'AI adjustment for perceived government performance', -0.3, 0.3);
        
        this.addInputKnob('policy_communication_effectiveness', 'float', 0.7, 
            'How effectively policies are communicated to public', 0.0, 1.0);
        
        this.addInputKnob('crisis_response_quality', 'float', 0.6, 
            'Quality of government crisis response', 0.0, 1.0);
        
        this.addInputKnob('transparency_level', 'float', 0.5, 
            'Government transparency and openness', 0.0, 1.0);
        
        this.addInputKnob('media_relations_quality', 'float', 0.6, 
            'Quality of government media relations', 0.0, 1.0);
        
        this.addInputKnob('public_engagement_level', 'float', 0.4, 
            'Level of public consultation and engagement', 0.0, 1.0);
        
        this.addInputKnob('economic_messaging_effectiveness', 'float', 0.5, 
            'How well economic policies are explained', 0.0, 1.0);
        
        this.addInputKnob('social_media_presence', 'float', 0.6, 
            'Government social media engagement quality', 0.0, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('approval_metrics', 'object', 
            'Current approval ratings and trends');
        
        this.addOutputChannel('demographic_breakdown', 'object', 
            'Approval ratings by demographic groups');
        
        this.addOutputChannel('issue_ratings', 'object', 
            'Approval ratings by policy issue');
        
        this.addOutputChannel('polling_data', 'object', 
            'Polling methodology and accuracy metrics');
        
        this.addOutputChannel('approval_forecast', 'object', 
            'Predicted approval trends and scenarios');
        
        this.addOutputChannel('political_risk_assessment', 'object', 
            'Risk factors and political stability indicators');
        
        console.log('📊 Approval Rating System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update approval based on various factors
            this.updateApprovalFromEconomicPerformance(gameState);
            this.updateApprovalFromPolicyEffectiveness(gameState);
            this.updateApprovalFromCrisisManagement(gameState, aiInputs);
            this.updateApprovalFromCommunication(aiInputs);
            this.updateApprovalFromEvents(gameState);
            
            // Apply AI adjustments
            this.applyAIAdjustments(aiInputs);
            
            // Update demographic breakdowns
            this.updateDemographicApproval(gameState);
            
            // Update issue-based approval
            this.updateIssueApproval(gameState, aiInputs);
            
            // Decay old events
            this.decayEventImpacts();
            
            // Update historical data
            this.updateHistory();
            
            // Generate polling data
            this.generatePollingData();
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('📊 Approval Rating System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateApprovalFromEconomicPerformance(gameState) {
        if (gameState.economicIndicators) {
            const indicators = gameState.economicIndicators;
            
            // GDP growth impact
            if (indicators.gdp_growth > 0.03) {
                this.adjustApproval(0.01, 'Strong economic growth');
            } else if (indicators.gdp_growth < 0) {
                this.adjustApproval(-0.02, 'Economic recession');
            }
            
            // Unemployment impact
            if (indicators.unemployment < 0.05) {
                this.adjustApproval(0.01, 'Low unemployment');
            } else if (indicators.unemployment > 0.1) {
                this.adjustApproval(-0.015, 'High unemployment');
            }
            
            // Inflation impact
            if (indicators.inflation > 0.05) {
                this.adjustApproval(-0.01, 'High inflation');
            }
            
            // Update economic issue approval
            const economicScore = this.calculateEconomicScore(indicators);
            this.state.issueApproval.economy = Math.max(0.1, Math.min(0.9, economicScore));
        }
    }

    calculateEconomicScore(indicators) {
        let score = 0.5; // Neutral baseline
        
        // GDP growth component
        score += Math.min(0.2, indicators.gdp_growth * 5);
        
        // Unemployment component (inverted)
        score += Math.max(-0.2, (0.05 - indicators.unemployment) * 2);
        
        // Inflation component (target 2%)
        const inflationDiff = Math.abs(indicators.inflation - 0.02);
        score -= inflationDiff * 2;
        
        return Math.max(0.1, Math.min(0.9, score));
    }

    updateApprovalFromPolicyEffectiveness(gameState) {
        if (gameState.policyMetrics) {
            const metrics = gameState.policyMetrics;
            
            // Policy implementation rate
            if (metrics.implementation_rate > 0.8) {
                this.adjustApproval(0.005, 'Effective policy implementation');
            } else if (metrics.implementation_rate < 0.5) {
                this.adjustApproval(-0.01, 'Poor policy implementation');
            }
            
            // Policy success rate
            if (metrics.success_rate > 0.7) {
                this.adjustApproval(0.008, 'Successful policies');
            } else if (metrics.success_rate < 0.4) {
                this.adjustApproval(-0.012, 'Failed policies');
            }
        }
    }

    updateApprovalFromCrisisManagement(gameState, aiInputs) {
        const crisisResponse = aiInputs.crisis_response_quality || 0.6;
        
        if (gameState.activeCrises && gameState.activeCrises.length > 0) {
            gameState.activeCrises.forEach(crisis => {
                const impact = crisis.severity * (1 - crisisResponse);
                this.adjustApproval(-impact * 0.1, `Crisis: ${crisis.type}`);
                
                // Update crisis management issue approval
                this.state.issueApproval.security = Math.max(0.1, 
                    this.state.issueApproval.security - impact * 0.05);
            });
        }
    }

    updateApprovalFromCommunication(aiInputs) {
        const commEffectiveness = aiInputs.policy_communication_effectiveness || 0.7;
        const transparency = aiInputs.transparency_level || 0.5;
        const mediaRelations = aiInputs.media_relations_quality || 0.6;
        const publicEngagement = aiInputs.public_engagement_level || 0.4;
        
        // Communication quality impact
        const commScore = (commEffectiveness + transparency + mediaRelations + publicEngagement) / 4;
        
        if (commScore > 0.7) {
            this.adjustApproval(0.003, 'Excellent communication');
        } else if (commScore < 0.4) {
            this.adjustApproval(-0.005, 'Poor communication');
        }
        
        // Update communication factor weight
        this.state.approvalFactors.communication_quality = Math.min(0.2, commScore * 0.25);
    }

    updateApprovalFromEvents(gameState) {
        if (gameState.recentEvents) {
            gameState.recentEvents.forEach(event => {
                if (!this.state.recentEvents.find(e => e.id === event.id)) {
                    const impact = this.calculateEventImpact(event);
                    
                    this.state.recentEvents.push({
                        id: event.id,
                        type: event.type,
                        impact: impact,
                        timestamp: Date.now(),
                        description: event.description
                    });
                    
                    this.adjustApproval(impact, `Event: ${event.type}`);
                }
            });
        }
    }

    calculateEventImpact(event) {
        const impactMap = {
            'natural_disaster': -0.02,
            'terrorist_attack': -0.05,
            'economic_boom': 0.03,
            'diplomatic_success': 0.02,
            'policy_scandal': -0.08,
            'international_recognition': 0.015,
            'infrastructure_success': 0.01,
            'healthcare_breakthrough': 0.02,
            'environmental_disaster': -0.03,
            'military_victory': 0.025
        };
        
        const baseImpact = impactMap[event.type] || 0;
        const severityMultiplier = event.severity || 1.0;
        
        return baseImpact * severityMultiplier;
    }

    applyAIAdjustments(aiInputs) {
        const performanceModifier = aiInputs.government_performance_modifier || 0.0;
        
        // Apply AI performance adjustment
        this.state.overallApproval = Math.max(0.1, Math.min(0.9, 
            this.state.overallApproval + performanceModifier * 0.1));
        
        // Social media presence impact
        const socialMediaPresence = aiInputs.social_media_presence || 0.6;
        if (socialMediaPresence > 0.8) {
            this.adjustApproval(0.002, 'Strong social media presence');
        } else if (socialMediaPresence < 0.3) {
            this.adjustApproval(-0.003, 'Weak social media presence');
        }
    }

    updateDemographicApproval(gameState) {
        if (gameState.demographics) {
            const demographics = gameState.demographics;
            
            // Age group adjustments
            if (demographics.youth_unemployment > 0.15) {
                this.state.demographicApproval.age_groups.young -= 0.01;
            }
            
            if (demographics.senior_healthcare_satisfaction > 0.8) {
                this.state.demographicApproval.age_groups.senior += 0.005;
            }
            
            // Income level adjustments
            if (demographics.income_inequality > 0.4) {
                this.state.demographicApproval.income_levels.low -= 0.01;
                this.state.demographicApproval.income_levels.high += 0.005;
            }
            
            // Regional adjustments
            if (demographics.urban_development_index > 0.7) {
                this.state.demographicApproval.regions.urban += 0.005;
            }
            
            if (demographics.rural_support_programs > 0.6) {
                this.state.demographicApproval.regions.rural += 0.008;
            }
        }
        
        // Normalize demographic approvals
        Object.keys(this.state.demographicApproval).forEach(category => {
            Object.keys(this.state.demographicApproval[category]).forEach(group => {
                this.state.demographicApproval[category][group] = Math.max(0.1, 
                    Math.min(0.9, this.state.demographicApproval[category][group]));
            });
        });
    }

    updateIssueApproval(gameState, aiInputs) {
        // Healthcare approval
        if (gameState.healthcareMetrics) {
            const healthScore = gameState.healthcareMetrics.overall_satisfaction || 0.6;
            this.state.issueApproval.healthcare = this.smoothUpdate(
                this.state.issueApproval.healthcare, healthScore, 0.1);
        }
        
        // Education approval
        if (gameState.educationMetrics) {
            const eduScore = gameState.educationMetrics.system_quality || 0.65;
            this.state.issueApproval.education = this.smoothUpdate(
                this.state.issueApproval.education, eduScore, 0.1);
        }
        
        // Environment approval
        if (gameState.environmentalMetrics) {
            const envScore = gameState.environmentalMetrics.sustainability_index || 0.5;
            this.state.issueApproval.environment = this.smoothUpdate(
                this.state.issueApproval.environment, envScore, 0.1);
        }
        
        // Foreign policy approval
        if (gameState.diplomaticMetrics) {
            const dipScore = gameState.diplomaticMetrics.international_standing || 0.6;
            this.state.issueApproval.foreign_policy = this.smoothUpdate(
                this.state.issueApproval.foreign_policy, dipScore, 0.1);
        }
        
        // Infrastructure approval
        if (gameState.infrastructureMetrics) {
            const infraScore = gameState.infrastructureMetrics.quality_index || 0.6;
            this.state.issueApproval.infrastructure = this.smoothUpdate(
                this.state.issueApproval.infrastructure, infraScore, 0.1);
        }
    }

    smoothUpdate(current, target, rate) {
        return current + (target - current) * rate;
    }

    adjustApproval(amount, reason) {
        const oldApproval = this.state.overallApproval;
        this.state.overallApproval = Math.max(0.1, Math.min(0.9, 
            this.state.overallApproval + amount));
        
        // Update trend
        this.state.approvalTrend = this.state.overallApproval - oldApproval;
        
        // Log significant changes
        if (Math.abs(amount) > 0.01) {
            console.log(`📊 Approval ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount).toFixed(3)} due to: ${reason}`);
        }
    }

    decayEventImpacts() {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        this.state.recentEvents = this.state.recentEvents.filter(event => {
            const age = (now - event.timestamp) / dayInMs;
            
            // Remove events older than 30 days
            if (age > 30) return false;
            
            // Decay impact over time
            event.impact *= this.state.eventDecay;
            
            // Remove events with negligible impact
            return Math.abs(event.impact) > 0.001;
        });
    }

    updateHistory() {
        this.state.approvalHistory.push({
            date: Date.now(),
            approval: this.state.overallApproval,
            trend: this.state.approvalTrend
        });
        
        // Limit history length
        if (this.state.approvalHistory.length > this.state.maxHistoryLength) {
            this.state.approvalHistory.shift();
        }
    }

    generatePollingData() {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (now - this.state.lastPollDate > this.state.pollFrequency * dayInMs) {
            // Add polling error
            const error = (Math.random() - 0.5) * (1 - this.state.pollAccuracy) * 0.2;
            const polledApproval = Math.max(0.1, Math.min(0.9, 
                this.state.overallApproval + error));
            
            this.state.lastPollDate = now;
            
            // Store poll result
            if (!this.state.pollResults) this.state.pollResults = [];
            this.state.pollResults.push({
                date: now,
                approval: polledApproval,
                sampleSize: 1000 + Math.floor(Math.random() * 500),
                marginOfError: 0.03 + Math.random() * 0.02
            });
            
            // Limit poll history
            if (this.state.pollResults.length > 52) { // Keep 1 year of weekly polls
                this.state.pollResults.shift();
            }
        }
    }

    generateOutputs() {
        return {
            approval_metrics: {
                overall_approval: this.state.overallApproval,
                approval_trend: this.state.approvalTrend,
                approval_volatility: this.state.approvalVolatility,
                trend_direction: this.state.approvalTrend > 0.01 ? 'increasing' : 
                                this.state.approvalTrend < -0.01 ? 'decreasing' : 'stable',
                approval_category: this.categorizeApproval(this.state.overallApproval)
            },
            
            demographic_breakdown: {
                by_age: this.state.demographicApproval.age_groups,
                by_income: this.state.demographicApproval.income_levels,
                by_education: this.state.demographicApproval.education,
                by_region: this.state.demographicApproval.regions,
                strongest_support: this.findStrongestSupport(),
                weakest_support: this.findWeakestSupport()
            },
            
            issue_ratings: {
                ...this.state.issueApproval,
                strongest_issue: this.findStrongestIssue(),
                weakest_issue: this.findWeakestIssue(),
                issue_priorities: this.calculateIssuePriorities()
            },
            
            polling_data: {
                last_poll_date: this.state.lastPollDate,
                poll_frequency_days: this.state.pollFrequency,
                poll_accuracy: this.state.pollAccuracy,
                recent_polls: this.state.pollResults?.slice(-5) || [],
                polling_trend: this.calculatePollingTrend()
            },
            
            approval_forecast: {
                short_term_forecast: this.generateShortTermForecast(),
                risk_factors: this.identifyRiskFactors(),
                opportunity_factors: this.identifyOpportunityFactors(),
                scenario_analysis: this.generateScenarioAnalysis()
            },
            
            political_risk_assessment: {
                stability_index: this.calculateStabilityIndex(),
                risk_level: this.assessRiskLevel(),
                key_vulnerabilities: this.identifyVulnerabilities(),
                mitigation_recommendations: this.generateMitigationRecommendations()
            }
        };
    }

    categorizeApproval(approval) {
        if (approval > 0.7) return 'high';
        if (approval > 0.5) return 'moderate';
        if (approval > 0.3) return 'low';
        return 'critical';
    }

    findStrongestSupport() {
        let strongest = { group: '', category: '', approval: 0 };
        
        Object.entries(this.state.demographicApproval).forEach(([category, groups]) => {
            Object.entries(groups).forEach(([group, approval]) => {
                if (approval > strongest.approval) {
                    strongest = { group, category, approval };
                }
            });
        });
        
        return strongest;
    }

    findWeakestSupport() {
        let weakest = { group: '', category: '', approval: 1 };
        
        Object.entries(this.state.demographicApproval).forEach(([category, groups]) => {
            Object.entries(groups).forEach(([group, approval]) => {
                if (approval < weakest.approval) {
                    weakest = { group, category, approval };
                }
            });
        });
        
        return weakest;
    }

    findStrongestIssue() {
        return Object.entries(this.state.issueApproval)
            .reduce((max, [issue, approval]) => 
                approval > max.approval ? { issue, approval } : max, 
                { issue: '', approval: 0 });
    }

    findWeakestIssue() {
        return Object.entries(this.state.issueApproval)
            .reduce((min, [issue, approval]) => 
                approval < min.approval ? { issue, approval } : min, 
                { issue: '', approval: 1 });
    }

    calculateIssuePriorities() {
        return Object.entries(this.state.issueApproval)
            .sort(([,a], [,b]) => a - b) // Sort by approval (lowest first = highest priority)
            .slice(0, 3)
            .map(([issue, approval]) => ({ issue, approval, priority: 'high' }));
    }

    generateShortTermForecast() {
        const currentTrend = this.state.approvalTrend;
        const volatility = this.state.approvalVolatility;
        
        return {
            next_week: Math.max(0.1, Math.min(0.9, 
                this.state.overallApproval + currentTrend * 7)),
            next_month: Math.max(0.1, Math.min(0.9, 
                this.state.overallApproval + currentTrend * 30)),
            confidence_interval: volatility,
            trend_sustainability: Math.abs(currentTrend) < 0.005 ? 'stable' : 
                                 Math.abs(currentTrend) < 0.02 ? 'moderate' : 'volatile'
        };
    }

    identifyRiskFactors() {
        const risks = [];
        
        if (this.state.overallApproval < 0.4) {
            risks.push({ factor: 'low_overall_approval', severity: 'high' });
        }
        
        if (this.state.approvalTrend < -0.02) {
            risks.push({ factor: 'declining_trend', severity: 'medium' });
        }
        
        if (this.state.issueApproval.economy < 0.4) {
            risks.push({ factor: 'economic_dissatisfaction', severity: 'high' });
        }
        
        return risks;
    }

    identifyOpportunityFactors() {
        const opportunities = [];
        
        if (this.state.approvalTrend > 0.01) {
            opportunities.push({ factor: 'positive_momentum', potential: 'medium' });
        }
        
        if (this.state.issueApproval.economy > 0.7) {
            opportunities.push({ factor: 'economic_confidence', potential: 'high' });
        }
        
        return opportunities;
    }

    generateScenarioAnalysis() {
        return {
            optimistic: Math.min(0.9, this.state.overallApproval + 0.15),
            realistic: this.state.overallApproval + this.state.approvalTrend * 30,
            pessimistic: Math.max(0.1, this.state.overallApproval - 0.15)
        };
    }

    calculateStabilityIndex() {
        const approvalStability = 1 - this.state.approvalVolatility;
        const trendStability = 1 - Math.abs(this.state.approvalTrend) * 10;
        const issueStability = 1 - this.calculateIssueVariance();
        
        return (approvalStability + trendStability + issueStability) / 3;
    }

    calculateIssueVariance() {
        const approvals = Object.values(this.state.issueApproval);
        const mean = approvals.reduce((sum, val) => sum + val, 0) / approvals.length;
        const variance = approvals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / approvals.length;
        
        return Math.sqrt(variance);
    }

    assessRiskLevel() {
        const stability = this.calculateStabilityIndex();
        const approval = this.state.overallApproval;
        
        if (approval < 0.3 || stability < 0.4) return 'high';
        if (approval < 0.5 || stability < 0.6) return 'medium';
        return 'low';
    }

    identifyVulnerabilities() {
        const vulnerabilities = [];
        
        // Check demographic vulnerabilities
        Object.entries(this.state.demographicApproval).forEach(([category, groups]) => {
            Object.entries(groups).forEach(([group, approval]) => {
                if (approval < 0.4) {
                    vulnerabilities.push(`Low support among ${group} ${category}`);
                }
            });
        });
        
        // Check issue vulnerabilities
        Object.entries(this.state.issueApproval).forEach(([issue, approval]) => {
            if (approval < 0.4) {
                vulnerabilities.push(`Weak performance on ${issue}`);
            }
        });
        
        return vulnerabilities.slice(0, 5); // Top 5 vulnerabilities
    }

    generateMitigationRecommendations() {
        const recommendations = [];
        
        if (this.state.issueApproval.economy < 0.5) {
            recommendations.push('Focus on economic messaging and visible economic improvements');
        }
        
        if (this.state.overallApproval < 0.5) {
            recommendations.push('Increase public engagement and transparency initiatives');
        }
        
        if (this.state.approvalTrend < -0.01) {
            recommendations.push('Address key policy concerns and improve crisis communication');
        }
        
        return recommendations;
    }

    calculatePollingTrend() {
        if (!this.state.pollResults || this.state.pollResults.length < 2) {
            return 'insufficient_data';
        }
        
        const recent = this.state.pollResults.slice(-3);
        const trend = recent[recent.length - 1].approval - recent[0].approval;
        
        if (trend > 0.02) return 'increasing';
        if (trend < -0.02) return 'decreasing';
        return 'stable';
    }

    generateFallbackOutputs() {
        return {
            approval_metrics: {
                overall_approval: 0.5,
                approval_trend: 0.0,
                approval_volatility: 0.15,
                trend_direction: 'stable',
                approval_category: 'moderate'
            },
            demographic_breakdown: {
                by_age: { young: 0.5, middle: 0.5, senior: 0.5 },
                by_income: { low: 0.5, middle: 0.5, high: 0.5 },
                by_education: { basic: 0.5, secondary: 0.5, higher: 0.5 },
                by_region: { urban: 0.5, suburban: 0.5, rural: 0.5 }
            },
            issue_ratings: {
                economy: 0.5, security: 0.5, healthcare: 0.5,
                education: 0.5, environment: 0.5, foreign_policy: 0.5
            },
            polling_data: { poll_accuracy: 0.85, recent_polls: [] },
            approval_forecast: { next_week: 0.5, next_month: 0.5 },
            political_risk_assessment: { stability_index: 0.6, risk_level: 'medium' }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            overallApproval: this.state.overallApproval,
            approvalTrend: this.state.approvalTrend,
            riskLevel: this.assessRiskLevel(),
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.overallApproval = 0.65;
        this.state.approvalTrend = 0.0;
        this.state.recentEvents = [];
        this.state.approvalHistory = [];
        console.log('📊 Approval Rating System reset');
    }
}

module.exports = { ApprovalRatingSystem };
