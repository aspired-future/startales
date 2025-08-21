// Policy System - Deterministic policy management with AI-adjustable parameters
// Input knobs for AI control, structured outputs for AI and game consumption

const DeterministicSystemInterface = require('../deterministic-system-interface.cjs');

class PolicySystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('PolicySystem');
        
        // Core policy state
        this.policyState = {
            activePolicies: new Map(),
            policyQueue: [],
            implementationProgress: new Map(),
            policyEffects: new Map(),
            publicSupport: new Map(),
            
            // System metrics
            totalPolicies: 0,
            activeCount: 0,
            pendingCount: 0,
            effectivenessScore: 0.75,
            implementationSpeed: 0.6,
            
            // Resource allocation
            policyBudget: 1000000,
            usedBudget: 0,
            staffingLevel: 0.8,
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('policy_implementation_speed', 'float', 0.6, 'Speed of policy implementation (0-1)', 0, 1);
        this.addInputKnob('policy_budget_allocation', 'float', 0.7, 'Percentage of budget allocated to policies (0-1)', 0, 1);
        this.addInputKnob('public_consultation_level', 'float', 0.5, 'Level of public consultation required (0-1)', 0, 1);
        this.addInputKnob('policy_review_frequency', 'float', 0.3, 'Frequency of policy reviews (0-1)', 0, 1);
        this.addInputKnob('emergency_policy_threshold', 'float', 0.8, 'Threshold for emergency policy implementation (0-1)', 0, 1);
        this.addInputKnob('inter_department_coordination', 'float', 0.6, 'Level of coordination between departments (0-1)', 0, 1);
        this.addInputKnob('policy_transparency_level', 'float', 0.7, 'Level of policy transparency to public (0-1)', 0, 1);
        this.addInputKnob('stakeholder_engagement_depth', 'float', 0.5, 'Depth of stakeholder engagement (0-1)', 0, 1);
        this.addInputKnob('policy_innovation_tolerance', 'float', 0.4, 'Tolerance for innovative/experimental policies (0-1)', 0, 1);
        this.addInputKnob('regulatory_compliance_strictness', 'float', 0.8, 'Strictness of regulatory compliance (0-1)', 0, 1);
        
        // Define structured output channels
        this.addOutputChannel('active_policy_count', 'int', 'Number of currently active policies');
        this.addOutputChannel('policy_effectiveness_score', 'float', 'Overall effectiveness of policy implementation (0-1)');
        this.addOutputChannel('public_policy_support', 'float', 'Average public support for current policies (0-1)');
        this.addOutputChannel('policy_implementation_backlog', 'int', 'Number of policies waiting for implementation');
        this.addOutputChannel('budget_utilization_rate', 'float', 'Percentage of policy budget currently utilized (0-1)');
        this.addOutputChannel('policy_conflict_indicators', 'array', 'List of policies with conflicting objectives');
        this.addOutputChannel('policy_success_metrics', 'map', 'Success metrics for each policy category');
        this.addOutputChannel('stakeholder_satisfaction_levels', 'map', 'Satisfaction levels by stakeholder group');
        this.addOutputChannel('policy_innovation_index', 'float', 'Index measuring policy innovation and adaptability (0-1)');
        this.addOutputChannel('regulatory_compliance_status', 'map', 'Compliance status for each regulatory area');
        
        console.log('🏛️ Policy System initialized with AI integration');
    }
    
    async processTick(gameState, aiInputs) {
        try {
            // Apply AI inputs to system parameters
            this.applyAIInputs(aiInputs);
            
            // Process policy implementation
            this.processImplementationQueue();
            
            // Update policy effects
            this.updatePolicyEffects(gameState);
            
            // Calculate public support
            this.calculatePublicSupport(gameState);
            
            // Assess policy conflicts
            this.assessPolicyConflicts();
            
            // Update system metrics
            this.updateSystemMetrics();
            
            // Generate structured outputs
            const outputs = this.generateOutputs();
            
            this.policyState.lastUpdate = Date.now();
            
            return {
                success: true,
                outputs: outputs,
                systemState: this.getSystemSnapshot(),
                recommendations: this.generatePolicyRecommendations(gameState, aiInputs)
            };
            
        } catch (error) {
            console.error('🏛️ Policy System processing error:', error);
            return {
                success: false,
                error: error.message,
                outputs: this.generateOutputs() // Return current state even on error
            };
        }
    }
    
    applyAIInputs(aiInputs) {
        // Apply implementation speed adjustments
        if (aiInputs.policy_implementation_speed !== undefined) {
            this.policyState.implementationSpeed = aiInputs.policy_implementation_speed;
        }
        
        // Apply budget allocation
        if (aiInputs.policy_budget_allocation !== undefined) {
            const totalBudget = this.policyState.policyBudget;
            this.policyState.usedBudget = Math.min(
                totalBudget * aiInputs.policy_budget_allocation,
                totalBudget
            );
        }
        
        // Apply other AI inputs to internal parameters
        this.publicConsultationLevel = aiInputs.public_consultation_level || 0.5;
        this.reviewFrequency = aiInputs.policy_review_frequency || 0.3;
        this.emergencyThreshold = aiInputs.emergency_policy_threshold || 0.8;
        this.coordinationLevel = aiInputs.inter_department_coordination || 0.6;
        this.transparencyLevel = aiInputs.policy_transparency_level || 0.7;
        this.stakeholderEngagement = aiInputs.stakeholder_engagement_depth || 0.5;
        this.innovationTolerance = aiInputs.policy_innovation_tolerance || 0.4;
        this.complianceStrictness = aiInputs.regulatory_compliance_strictness || 0.8;
    }
    
    processImplementationQueue() {
        const implementationCapacity = Math.floor(
            this.policyState.implementationSpeed * 10 * this.policyState.staffingLevel
        );
        
        let processed = 0;
        for (const policy of this.policyState.policyQueue) {
            if (processed >= implementationCapacity) break;
            
            // Check if policy meets implementation criteria
            if (this.canImplementPolicy(policy)) {
                this.implementPolicy(policy);
                processed++;
            }
        }
        
        // Remove implemented policies from queue
        this.policyState.policyQueue = this.policyState.policyQueue.filter(
            policy => !this.policyState.activePolicies.has(policy.id)
        );
    }
    
    canImplementPolicy(policy) {
        // Check budget constraints
        const estimatedCost = this.estimatePolicyCost(policy);
        if (this.policyState.usedBudget + estimatedCost > this.policyState.policyBudget) {
            return false;
        }
        
        // Check public consultation requirements
        if (policy.requiresConsultation && policy.consultationLevel < this.publicConsultationLevel) {
            return false;
        }
        
        // Check emergency status
        if (policy.isEmergency && policy.urgency < this.emergencyThreshold) {
            return false;
        }
        
        // Check for conflicts with existing policies
        if (this.hasConflictingPolicies(policy)) {
            return false;
        }
        
        return true;
    }
    
    implementPolicy(policy) {
        // Add to active policies
        this.policyState.activePolicies.set(policy.id, {
            ...policy,
            implementedAt: Date.now(),
            status: 'active',
            effectiveness: this.calculateInitialEffectiveness(policy),
            publicSupport: this.calculateInitialPublicSupport(policy)
        });
        
        // Update budget
        const cost = this.estimatePolicyCost(policy);
        this.policyState.usedBudget += cost;
        
        // Initialize policy effects tracking
        this.policyState.policyEffects.set(policy.id, {
            economicImpact: 0,
            socialImpact: 0,
            environmentalImpact: 0,
            politicalImpact: 0,
            cumulativeEffect: 0
        });
        
        // Initialize public support tracking
        this.policyState.publicSupport.set(policy.id, {
            overall: this.calculateInitialPublicSupport(policy),
            byDemographic: this.calculateDemographicSupport(policy),
            trend: 'stable'
        });
        
        console.log(`🏛️ Policy implemented: ${policy.title}`);
    }
    
    updatePolicyEffects(gameState) {
        for (const [policyId, policy] of this.policyState.activePolicies) {
            const effects = this.policyState.policyEffects.get(policyId);
            
            // Calculate policy effects based on game state and time active
            const timeActive = Date.now() - policy.implementedAt;
            const maturityFactor = Math.min(timeActive / (30 * 24 * 60 * 60 * 1000), 1); // 30 days to full maturity
            
            // Update economic impact
            effects.economicImpact = this.calculateEconomicImpact(policy, gameState, maturityFactor);
            
            // Update social impact
            effects.socialImpact = this.calculateSocialImpact(policy, gameState, maturityFactor);
            
            // Update environmental impact
            effects.environmentalImpact = this.calculateEnvironmentalImpact(policy, gameState, maturityFactor);
            
            // Update political impact
            effects.politicalImpact = this.calculatePoliticalImpact(policy, gameState, maturityFactor);
            
            // Calculate cumulative effect
            effects.cumulativeEffect = (
                effects.economicImpact + 
                effects.socialImpact + 
                effects.environmentalImpact + 
                effects.politicalImpact
            ) / 4;
            
            // Update policy effectiveness based on results
            policy.effectiveness = Math.max(0, Math.min(1, 
                policy.effectiveness + (effects.cumulativeEffect * 0.1)
            ));
        }
    }
    
    calculatePublicSupport(gameState) {
        for (const [policyId, policy] of this.policyState.activePolicies) {
            const support = this.policyState.publicSupport.get(policyId);
            const effects = this.policyState.policyEffects.get(policyId);
            
            // Base support change on policy effects
            let supportChange = 0;
            
            // Economic effects influence support
            supportChange += effects.economicImpact * 0.3;
            
            // Social effects influence support
            supportChange += effects.socialImpact * 0.4;
            
            // Environmental effects influence support
            supportChange += effects.environmentalImpact * 0.2;
            
            // Political effects influence support
            supportChange += effects.politicalImpact * 0.1;
            
            // Apply transparency bonus
            supportChange *= (1 + this.transparencyLevel * 0.2);
            
            // Apply stakeholder engagement bonus
            supportChange *= (1 + this.stakeholderEngagement * 0.15);
            
            // Update support with dampening
            support.overall = Math.max(0, Math.min(1, 
                support.overall + (supportChange * 0.05)
            ));
            
            // Determine trend
            if (supportChange > 0.1) {
                support.trend = 'rising';
            } else if (supportChange < -0.1) {
                support.trend = 'falling';
            } else {
                support.trend = 'stable';
            }
            
            // Update demographic support
            support.byDemographic = this.updateDemographicSupport(policy, support.byDemographic, effects);
        }
    }
    
    assessPolicyConflicts() {
        const conflicts = [];
        const activePolicies = Array.from(this.policyState.activePolicies.values());
        
        for (let i = 0; i < activePolicies.length; i++) {
            for (let j = i + 1; j < activePolicies.length; j++) {
                const policy1 = activePolicies[i];
                const policy2 = activePolicies[j];
                
                const conflictLevel = this.calculatePolicyConflict(policy1, policy2);
                
                if (conflictLevel > 0.5) {
                    conflicts.push({
                        policy1: policy1.id,
                        policy2: policy2.id,
                        conflictLevel: conflictLevel,
                        conflictType: this.identifyConflictType(policy1, policy2),
                        recommendedAction: this.getConflictResolution(policy1, policy2, conflictLevel)
                    });
                }
            }
        }
        
        this.policyConflicts = conflicts;
    }
    
    updateSystemMetrics() {
        this.policyState.totalPolicies = this.policyState.activePolicies.size + this.policyState.policyQueue.length;
        this.policyState.activeCount = this.policyState.activePolicies.size;
        this.policyState.pendingCount = this.policyState.policyQueue.length;
        
        // Calculate overall effectiveness
        if (this.policyState.activePolicies.size > 0) {
            const totalEffectiveness = Array.from(this.policyState.activePolicies.values())
                .reduce((sum, policy) => sum + policy.effectiveness, 0);
            this.policyState.effectivenessScore = totalEffectiveness / this.policyState.activePolicies.size;
        }
    }
    
    generateOutputs() {
        // Calculate policy success metrics by category
        const successMetrics = new Map();
        const categories = ['economic', 'social', 'environmental', 'security', 'governance'];
        
        for (const category of categories) {
            const categoryPolicies = Array.from(this.policyState.activePolicies.values())
                .filter(policy => policy.category === category);
            
            if (categoryPolicies.length > 0) {
                const avgEffectiveness = categoryPolicies
                    .reduce((sum, policy) => sum + policy.effectiveness, 0) / categoryPolicies.length;
                const avgSupport = categoryPolicies
                    .reduce((sum, policy) => sum + this.policyState.publicSupport.get(policy.id).overall, 0) / categoryPolicies.length;
                
                successMetrics.set(category, {
                    effectiveness: avgEffectiveness,
                    publicSupport: avgSupport,
                    activeCount: categoryPolicies.length
                });
            }
        }
        
        // Calculate stakeholder satisfaction
        const stakeholderSatisfaction = new Map();
        const stakeholderGroups = ['citizens', 'businesses', 'government', 'military', 'scientists'];
        
        for (const group of stakeholderGroups) {
            stakeholderSatisfaction.set(group, this.calculateStakeholderSatisfaction(group));
        }
        
        // Calculate average public support
        let avgPublicSupport = 0;
        if (this.policyState.publicSupport.size > 0) {
            const totalSupport = Array.from(this.policyState.publicSupport.values())
                .reduce((sum, support) => sum + support.overall, 0);
            avgPublicSupport = totalSupport / this.policyState.publicSupport.size;
        }
        
        return {
            active_policy_count: this.policyState.activeCount,
            policy_effectiveness_score: this.policyState.effectivenessScore,
            public_policy_support: avgPublicSupport,
            policy_implementation_backlog: this.policyState.pendingCount,
            budget_utilization_rate: this.policyState.usedBudget / this.policyState.policyBudget,
            policy_conflict_indicators: this.policyConflicts || [],
            policy_success_metrics: successMetrics,
            stakeholder_satisfaction_levels: stakeholderSatisfaction,
            policy_innovation_index: this.calculateInnovationIndex(),
            regulatory_compliance_status: this.calculateComplianceStatus()
        };
    }
    
    generatePolicyRecommendations(gameState, aiInputs) {
        const recommendations = [];
        
        // Budget recommendations
        if (this.policyState.usedBudget / this.policyState.policyBudget > 0.9) {
            recommendations.push({
                type: 'budget',
                priority: 'high',
                message: 'Policy budget utilization is very high. Consider increasing budget allocation or reviewing policy priorities.',
                suggestedAction: 'increase_budget_allocation'
            });
        }
        
        // Effectiveness recommendations
        if (this.policyState.effectivenessScore < 0.6) {
            recommendations.push({
                type: 'effectiveness',
                priority: 'medium',
                message: 'Overall policy effectiveness is below optimal levels. Consider reviewing implementation processes.',
                suggestedAction: 'review_implementation_speed'
            });
        }
        
        // Conflict recommendations
        if (this.policyConflicts && this.policyConflicts.length > 0) {
            recommendations.push({
                type: 'conflicts',
                priority: 'high',
                message: `${this.policyConflicts.length} policy conflicts detected. Resolution required to improve effectiveness.`,
                suggestedAction: 'resolve_policy_conflicts'
            });
        }
        
        // Public support recommendations
        const avgSupport = Array.from(this.policyState.publicSupport.values())
            .reduce((sum, support) => sum + support.overall, 0) / this.policyState.publicSupport.size;
        
        if (avgSupport < 0.5) {
            recommendations.push({
                type: 'public_support',
                priority: 'medium',
                message: 'Public support for policies is low. Consider increasing transparency and stakeholder engagement.',
                suggestedAction: 'increase_transparency_level'
            });
        }
        
        return recommendations;
    }
    
    // Helper methods for calculations
    estimatePolicyCost(policy) {
        const baseCost = 10000;
        const scopeMultiplier = policy.scope === 'galactic' ? 3 : policy.scope === 'planetary' ? 2 : 1;
        const complexityMultiplier = policy.complexity || 1;
        return baseCost * scopeMultiplier * complexityMultiplier;
    }
    
    calculateInitialEffectiveness(policy) {
        let effectiveness = 0.5; // Base effectiveness
        
        // Adjust based on policy attributes
        if (policy.evidenceBased) effectiveness += 0.2;
        if (policy.stakeholderInput) effectiveness += 0.15;
        if (policy.pilotTested) effectiveness += 0.1;
        
        // Adjust based on system parameters
        effectiveness *= (1 + this.coordinationLevel * 0.2);
        effectiveness *= (1 + this.innovationTolerance * 0.1);
        
        return Math.max(0, Math.min(1, effectiveness));
    }
    
    calculateInitialPublicSupport(policy) {
        let support = 0.5; // Base support
        
        // Adjust based on policy type
        if (policy.category === 'social') support += 0.1;
        if (policy.category === 'economic' && policy.benefitsMiddleClass) support += 0.15;
        if (policy.category === 'environmental') support += 0.05;
        
        // Adjust based on transparency and engagement
        support *= (1 + this.transparencyLevel * 0.3);
        support *= (1 + this.stakeholderEngagement * 0.2);
        
        return Math.max(0, Math.min(1, support));
    }
    
    calculateEconomicImpact(policy, gameState, maturityFactor) {
        // Simplified economic impact calculation
        let impact = 0;
        
        if (policy.category === 'economic') {
            impact = (policy.expectedEconomicBenefit || 0.1) * maturityFactor;
        } else {
            impact = (policy.economicSideEffects || 0) * maturityFactor;
        }
        
        return Math.max(-1, Math.min(1, impact));
    }
    
    calculateSocialImpact(policy, gameState, maturityFactor) {
        // Simplified social impact calculation
        let impact = 0;
        
        if (policy.category === 'social') {
            impact = (policy.expectedSocialBenefit || 0.1) * maturityFactor;
        } else {
            impact = (policy.socialSideEffects || 0) * maturityFactor;
        }
        
        return Math.max(-1, Math.min(1, impact));
    }
    
    calculateEnvironmentalImpact(policy, gameState, maturityFactor) {
        // Simplified environmental impact calculation
        let impact = 0;
        
        if (policy.category === 'environmental') {
            impact = (policy.expectedEnvironmentalBenefit || 0.1) * maturityFactor;
        } else {
            impact = (policy.environmentalSideEffects || 0) * maturityFactor;
        }
        
        return Math.max(-1, Math.min(1, impact));
    }
    
    calculatePoliticalImpact(policy, gameState, maturityFactor) {
        // Simplified political impact calculation
        let impact = 0;
        
        if (policy.category === 'governance') {
            impact = (policy.expectedPoliticalBenefit || 0.1) * maturityFactor;
        } else {
            impact = (policy.politicalSideEffects || 0) * maturityFactor;
        }
        
        return Math.max(-1, Math.min(1, impact));
    }
    
    calculateStakeholderSatisfaction(stakeholderGroup) {
        // Calculate satisfaction based on policies affecting this stakeholder group
        const relevantPolicies = Array.from(this.policyState.activePolicies.values())
            .filter(policy => policy.affectedStakeholders && policy.affectedStakeholders.includes(stakeholderGroup));
        
        if (relevantPolicies.length === 0) return 0.5; // Neutral if no relevant policies
        
        const avgEffectiveness = relevantPolicies
            .reduce((sum, policy) => sum + policy.effectiveness, 0) / relevantPolicies.length;
        
        const avgSupport = relevantPolicies
            .reduce((sum, policy) => sum + this.policyState.publicSupport.get(policy.id).overall, 0) / relevantPolicies.length;
        
        return (avgEffectiveness + avgSupport) / 2;
    }
    
    calculateInnovationIndex() {
        const innovativePolicies = Array.from(this.policyState.activePolicies.values())
            .filter(policy => policy.isInnovative || policy.isExperimental);
        
        const innovationRatio = innovativePolicies.length / Math.max(1, this.policyState.activePolicies.size);
        const avgInnovationSuccess = innovativePolicies.length > 0 
            ? innovativePolicies.reduce((sum, policy) => sum + policy.effectiveness, 0) / innovativePolicies.length
            : 0.5;
        
        return (innovationRatio + avgInnovationSuccess) / 2;
    }
    
    calculateComplianceStatus() {
        const complianceAreas = ['legal', 'ethical', 'environmental', 'financial', 'security'];
        const complianceStatus = new Map();
        
        for (const area of complianceAreas) {
            const relevantPolicies = Array.from(this.policyState.activePolicies.values())
                .filter(policy => policy.complianceAreas && policy.complianceAreas.includes(area));
            
            let complianceScore = 1.0; // Start with full compliance
            
            for (const policy of relevantPolicies) {
                const policyCompliance = policy.complianceScore || 0.8;
                complianceScore = Math.min(complianceScore, policyCompliance);
            }
            
            // Apply strictness factor
            complianceScore *= this.complianceStrictness;
            
            complianceStatus.set(area, {
                score: complianceScore,
                status: complianceScore > 0.8 ? 'compliant' : complianceScore > 0.6 ? 'warning' : 'non-compliant',
                affectedPolicies: relevantPolicies.length
            });
        }
        
        return complianceStatus;
    }
    
    hasConflictingPolicies(newPolicy) {
        for (const [existingId, existingPolicy] of this.policyState.activePolicies) {
            if (this.calculatePolicyConflict(newPolicy, existingPolicy) > 0.7) {
                return true;
            }
        }
        return false;
    }
    
    calculatePolicyConflict(policy1, policy2) {
        let conflictLevel = 0;
        
        // Check for direct conflicts in objectives
        if (policy1.objectives && policy2.objectives) {
            const conflictingObjectives = policy1.objectives.filter(obj1 => 
                policy2.objectives.some(obj2 => this.areObjectivesConflicting(obj1, obj2))
            );
            conflictLevel += conflictingObjectives.length * 0.3;
        }
        
        // Check for resource conflicts
        if (policy1.requiredResources && policy2.requiredResources) {
            const sharedResources = policy1.requiredResources.filter(res => 
                policy2.requiredResources.includes(res)
            );
            conflictLevel += sharedResources.length * 0.2;
        }
        
        // Check for stakeholder conflicts
        if (policy1.affectedStakeholders && policy2.affectedStakeholders) {
            const sharedStakeholders = policy1.affectedStakeholders.filter(stake => 
                policy2.affectedStakeholders.includes(stake)
            );
            conflictLevel += sharedStakeholders.length * 0.1;
        }
        
        return Math.min(1, conflictLevel);
    }
    
    areObjectivesConflicting(obj1, obj2) {
        // Simplified conflict detection
        const conflictPairs = [
            ['increase', 'decrease'],
            ['expand', 'reduce'],
            ['strengthen', 'weaken'],
            ['centralize', 'decentralize']
        ];
        
        for (const [word1, word2] of conflictPairs) {
            if ((obj1.includes(word1) && obj2.includes(word2)) || 
                (obj1.includes(word2) && obj2.includes(word1))) {
                return true;
            }
        }
        
        return false;
    }
    
    identifyConflictType(policy1, policy2) {
        if (policy1.category === policy2.category) {
            return 'category_overlap';
        }
        
        if (policy1.scope === policy2.scope) {
            return 'scope_conflict';
        }
        
        return 'resource_conflict';
    }
    
    getConflictResolution(policy1, policy2, conflictLevel) {
        if (conflictLevel > 0.8) {
            return 'suspend_one_policy';
        } else if (conflictLevel > 0.6) {
            return 'modify_implementation';
        } else {
            return 'coordinate_implementation';
        }
    }
    
    updateDemographicSupport(policy, currentSupport, effects) {
        // Update support by demographic group based on policy effects
        const demographics = ['young_adults', 'middle_aged', 'elderly', 'urban', 'rural', 'educated', 'working_class'];
        const updatedSupport = { ...currentSupport };
        
        for (const demo of demographics) {
            const currentLevel = updatedSupport[demo] || 0.5;
            let change = 0;
            
            // Different demographics respond differently to policy effects
            if (demo === 'young_adults') {
                change = effects.socialImpact * 0.4 + effects.environmentalImpact * 0.3;
            } else if (demo === 'elderly') {
                change = effects.socialImpact * 0.3 + effects.economicImpact * 0.4;
            } else if (demo === 'working_class') {
                change = effects.economicImpact * 0.5 + effects.socialImpact * 0.2;
            } else if (demo === 'educated') {
                change = effects.environmentalImpact * 0.3 + effects.politicalImpact * 0.3;
            }
            
            updatedSupport[demo] = Math.max(0, Math.min(1, currentLevel + change * 0.1));
        }
        
        return updatedSupport;
    }
    
    calculateDemographicSupport(policy) {
        // Calculate initial demographic support based on policy characteristics
        const demographics = ['young_adults', 'middle_aged', 'elderly', 'urban', 'rural', 'educated', 'working_class'];
        const support = {};
        
        for (const demo of demographics) {
            let baseSupport = 0.5;
            
            // Adjust based on policy category and demographic preferences
            if (policy.category === 'social' && ['young_adults', 'urban', 'educated'].includes(demo)) {
                baseSupport += 0.2;
            }
            
            if (policy.category === 'economic' && ['working_class', 'middle_aged'].includes(demo)) {
                baseSupport += 0.15;
            }
            
            if (policy.category === 'environmental' && ['young_adults', 'educated', 'urban'].includes(demo)) {
                baseSupport += 0.25;
            }
            
            support[demo] = Math.max(0, Math.min(1, baseSupport));
        }
        
        return support;
    }
    
    getSystemSnapshot() {
        return {
            activePolicies: this.policyState.activeCount,
            pendingPolicies: this.policyState.pendingCount,
            effectivenessScore: this.policyState.effectivenessScore,
            budgetUtilization: this.policyState.usedBudget / this.policyState.policyBudget,
            implementationSpeed: this.policyState.implementationSpeed,
            conflictCount: this.policyConflicts ? this.policyConflicts.length : 0,
            lastUpdate: this.policyState.lastUpdate
        };
    }
    
    // Public API methods for integration with existing policy APIs
    addPolicyToQueue(policyData) {
        const policy = {
            id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...policyData,
            queuedAt: Date.now(),
            status: 'queued'
        };
        
        this.policyState.policyQueue.push(policy);
        return policy;
    }
    
    getPolicyStatus(policyId) {
        if (this.policyState.activePolicies.has(policyId)) {
            return {
                status: 'active',
                policy: this.policyState.activePolicies.get(policyId),
                effects: this.policyState.policyEffects.get(policyId),
                publicSupport: this.policyState.publicSupport.get(policyId)
            };
        }
        
        const queuedPolicy = this.policyState.policyQueue.find(p => p.id === policyId);
        if (queuedPolicy) {
            return {
                status: 'queued',
                policy: queuedPolicy,
                queuePosition: this.policyState.policyQueue.indexOf(queuedPolicy) + 1
            };
        }
        
        return null;
    }
    
    deactivatePolicy(policyId) {
        if (this.policyState.activePolicies.has(policyId)) {
            const policy = this.policyState.activePolicies.get(policyId);
            
            // Return budget
            const cost = this.estimatePolicyCost(policy);
            this.policyState.usedBudget = Math.max(0, this.policyState.usedBudget - cost);
            
            // Remove from active policies
            this.policyState.activePolicies.delete(policyId);
            this.policyState.policyEffects.delete(policyId);
            this.policyState.publicSupport.delete(policyId);
            
            console.log(`🏛️ Policy deactivated: ${policy.title}`);
            return true;
        }
        
        return false;
    }
}

module.exports = PolicySystem;
