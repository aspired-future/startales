// Military System - Defense operations, military readiness, and security management
// Provides comprehensive military capabilities with AI integration knobs

const { DeterministicSystemInterface } = require('../deterministic-system-interface.cjs');

class MilitarySystem extends DeterministicSystemInterface {
    constructor(config = {}) {
        super('military-system', config);
        
        // System state
        this.state = {
            // Military Readiness
            overallReadiness: 0.7, // 0-1 scale
            personnelReadiness: 0.75,
            equipmentReadiness: 0.65,
            logisticsReadiness: 0.7,
            intelligenceReadiness: 0.6,
            
            // Force Structure
            activePersonnel: 50000,
            reservePersonnel: 25000,
            civilianPersonnel: 15000,
            
            // Military Branches
            branches: {
                army: {
                    personnel: 25000,
                    readiness: 0.75,
                    equipment_status: 0.7,
                    training_level: 0.8
                },
                navy: {
                    personnel: 12000,
                    readiness: 0.7,
                    equipment_status: 0.65,
                    training_level: 0.75
                },
                air_force: {
                    personnel: 8000,
                    readiness: 0.8,
                    equipment_status: 0.6,
                    training_level: 0.85
                },
                space_force: {
                    personnel: 3000,
                    readiness: 0.6,
                    equipment_status: 0.5,
                    training_level: 0.7
                },
                cyber_command: {
                    personnel: 2000,
                    readiness: 0.85,
                    equipment_status: 0.9,
                    training_level: 0.9
                }
            },
            
            // Defense Capabilities
            defensiveCapabilities: {
                border_security: 0.7,
                air_defense: 0.65,
                naval_defense: 0.6,
                cyber_defense: 0.8,
                space_defense: 0.4,
                homeland_security: 0.75
            },
            
            // Military Assets
            assets: {
                ground_vehicles: 1500,
                aircraft: 200,
                naval_vessels: 50,
                satellites: 12,
                cyber_systems: 100,
                bases: 25
            },
            
            // Budget and Resources
            budget: {
                total_budget: 50000000000, // $50B
                personnel_costs: 0.4,
                equipment_procurement: 0.25,
                operations_maintenance: 0.2,
                research_development: 0.1,
                infrastructure: 0.05
            },
            
            // Threat Assessment
            threatLevel: 0.3, // 0-1 scale
            identifiedThreats: [],
            threatSources: new Map(),
            
            // Operations
            activeOperations: [],
            deployments: new Map(),
            exerciseSchedule: [],
            
            // Intelligence
            intelligenceCapacity: 0.6,
            surveillanceCapacity: 0.7,
            reconnaissanceAssets: 50,
            
            // Training and Doctrine
            trainingPrograms: new Map(),
            militaryDoctrine: 'defensive',
            trainingEffectiveness: 0.75,
            
            // International Cooperation
            alliances: [],
            jointExercises: [],
            militaryAgreements: [],
            
            lastUpdate: Date.now()
        };
        
        // Define AI-adjustable input knobs
        this.addInputKnob('defense_readiness_level', 'float', 0.7, 
            'Overall military readiness and alert status', 0.3, 1.0);
        
        this.addInputKnob('military_budget_allocation', 'object', {
            personnel: 0.4, equipment: 0.25, operations: 0.2, research: 0.1, infrastructure: 0.05
        }, 'Budget allocation across military categories');
        
        this.addInputKnob('threat_assessment_level', 'float', 0.3, 
            'Current threat level assessment', 0.0, 1.0);
        
        this.addInputKnob('internal_security_focus', 'float', 0.5, 
            'Focus on internal vs external security', 0.0, 1.0);
        
        this.addInputKnob('border_security_emphasis', 'float', 0.7, 
            'Emphasis on border and perimeter security', 0.0, 1.0);
        
        this.addInputKnob('cyber_defense_priority', 'float', 0.8, 
            'Priority level for cyber defense capabilities', 0.0, 1.0);
        
        this.addInputKnob('intelligence_gathering_intensity', 'float', 0.6, 
            'Intensity of intelligence and surveillance operations', 0.0, 1.0);
        
        this.addInputKnob('training_intensity', 'float', 0.7, 
            'Intensity and frequency of military training', 0.0, 1.0);
        
        this.addInputKnob('international_cooperation_level', 'float', 0.5, 
            'Level of international military cooperation', 0.0, 1.0);
        
        this.addInputKnob('force_modernization_rate', 'float', 0.3, 
            'Rate of military equipment and doctrine modernization', 0.0, 1.0);
        
        this.addInputKnob('reserve_activation_level', 'float', 0.1, 
            'Level of reserve force activation', 0.0, 1.0);
        
        this.addInputKnob('military_transparency', 'float', 0.4, 
            'Level of military transparency and public disclosure', 0.0, 1.0);
        
        // Define structured output channels
        this.addOutputChannel('military_readiness', 'object', 
            'Current military readiness across all branches and capabilities');
        
        this.addOutputChannel('force_structure', 'object', 
            'Military force composition and deployment status');
        
        this.addOutputChannel('defense_capabilities', 'object', 
            'Current defensive and offensive military capabilities');
        
        this.addOutputChannel('threat_analysis', 'object', 
            'Current threat assessment and security situation');
        
        this.addOutputChannel('military_operations', 'object', 
            'Active military operations and deployments');
        
        this.addOutputChannel('resource_utilization', 'object', 
            'Military budget utilization and resource efficiency');
        
        this.addOutputChannel('training_status', 'object', 
            'Military training programs and effectiveness metrics');
        
        this.addOutputChannel('international_relations', 'object', 
            'Military alliances and international cooperation status');
        
        console.log('🎖️ Military System initialized');
    }

    async processTick(gameState, aiInputs) {
        try {
            // Update military readiness based on AI inputs
            this.updateMilitaryReadiness(aiInputs);
            
            // Process budget allocation
            this.processBudgetAllocation(aiInputs);
            
            // Update threat assessment
            this.updateThreatAssessment(gameState, aiInputs);
            
            // Process training and doctrine
            this.processTrainingAndDoctrine(aiInputs);
            
            // Update force structure
            this.updateForceStructure(aiInputs);
            
            // Process operations
            this.processOperations(gameState, aiInputs);
            
            // Update international cooperation
            this.updateInternationalCooperation(aiInputs);
            
            // Calculate defense capabilities
            this.calculateDefenseCapabilities(aiInputs);
            
            // Update equipment and maintenance
            this.updateEquipmentStatus(aiInputs);
            
            this.state.lastUpdate = Date.now();
            
            return this.generateOutputs();
            
        } catch (error) {
            console.error('🎖️ Military System processing error:', error);
            return this.generateFallbackOutputs();
        }
    }

    updateMilitaryReadiness(aiInputs) {
        const targetReadiness = aiInputs.defense_readiness_level || 0.7;
        const trainingIntensity = aiInputs.training_intensity || 0.7;
        
        // Smooth transition to target readiness
        this.state.overallReadiness = this.smoothTransition(
            this.state.overallReadiness, targetReadiness, 0.1);
        
        // Update branch readiness based on training and resources
        Object.keys(this.state.branches).forEach(branch => {
            const branchData = this.state.branches[branch];
            
            // Training impact on readiness
            const trainingImpact = trainingIntensity * 0.2;
            branchData.readiness = Math.min(1.0, 
                branchData.readiness + trainingImpact - 0.05); // Natural decay
            
            // Equipment status impact
            branchData.readiness = Math.min(branchData.readiness, 
                branchData.equipment_status + 0.1);
        });
        
        // Calculate component readiness
        this.updateComponentReadiness(aiInputs);
    }

    updateComponentReadiness(aiInputs) {
        // Personnel readiness
        const trainingIntensity = aiInputs.training_intensity || 0.7;
        this.state.personnelReadiness = Math.min(1.0, 
            0.6 + trainingIntensity * 0.3);
        
        // Equipment readiness
        const modernizationRate = aiInputs.force_modernization_rate || 0.3;
        this.state.equipmentReadiness = Math.min(1.0, 
            this.state.equipmentReadiness + modernizationRate * 0.05 - 0.02);
        
        // Logistics readiness
        this.state.logisticsReadiness = Math.min(1.0, 
            0.5 + (this.state.budget.operations_maintenance * 2));
        
        // Intelligence readiness
        const intelIntensity = aiInputs.intelligence_gathering_intensity || 0.6;
        this.state.intelligenceReadiness = Math.min(1.0, 
            0.4 + intelIntensity * 0.5);
    }

    processBudgetAllocation(aiInputs) {
        const allocation = aiInputs.military_budget_allocation || this.state.budget;
        
        // Update budget allocation
        if (typeof allocation === 'object') {
            Object.keys(allocation).forEach(category => {
                if (this.state.budget.hasOwnProperty(category + '_costs') || 
                    this.state.budget.hasOwnProperty(category)) {
                    const key = category + '_costs';
                    if (this.state.budget.hasOwnProperty(key)) {
                        this.state.budget[key] = allocation[category];
                    } else {
                        this.state.budget[category] = allocation[category];
                    }
                }
            });
        }
        
        // Calculate budget efficiency
        this.calculateBudgetEfficiency();
    }

    calculateBudgetEfficiency() {
        // Higher personnel spending improves readiness
        const personnelEffect = this.state.budget.personnel_costs * 1.5;
        
        // Equipment spending improves capabilities
        const equipmentEffect = this.state.budget.equipment_procurement * 2;
        
        // R&D spending improves modernization
        const rdEffect = this.state.budget.research_development * 3;
        
        // Apply budget effects to readiness
        this.state.personnelReadiness = Math.min(1.0, 
            this.state.personnelReadiness + personnelEffect * 0.1);
        
        this.state.equipmentReadiness = Math.min(1.0, 
            this.state.equipmentReadiness + equipmentEffect * 0.05);
    }

    updateThreatAssessment(gameState, aiInputs) {
        const aiThreatLevel = aiInputs.threat_assessment_level || 0.3;
        
        // Update threat level
        this.state.threatLevel = this.smoothTransition(
            this.state.threatLevel, aiThreatLevel, 0.2);
        
        // Process external threats from game state
        if (gameState.externalThreats) {
            this.processExternalThreats(gameState.externalThreats);
        }
        
        // Process diplomatic tensions
        if (gameState.diplomaticTensions) {
            this.processDiplomaticThreats(gameState.diplomaticTensions);
        }
        
        // Update defense posture based on threats
        this.updateDefensePosture();
    }

    processExternalThreats(threats) {
        this.state.identifiedThreats = [];
        
        threats.forEach(threat => {
            this.state.identifiedThreats.push({
                id: threat.id,
                type: threat.type,
                severity: threat.severity,
                source: threat.source,
                timeframe: threat.timeframe,
                countermeasures: this.generateCountermeasures(threat)
            });
            
            // Update threat sources map
            this.state.threatSources.set(threat.source, {
                severity: threat.severity,
                lastUpdate: Date.now()
            });
        });
    }

    processDiplomaticThreats(tensions) {
        Object.entries(tensions).forEach(([country, tensionLevel]) => {
            if (tensionLevel > 0.7) {
                this.state.identifiedThreats.push({
                    id: `diplomatic_${country}`,
                    type: 'diplomatic_tension',
                    severity: tensionLevel,
                    source: country,
                    timeframe: 'ongoing',
                    countermeasures: ['diplomatic_engagement', 'defensive_preparations']
                });
            }
        });
    }

    generateCountermeasures(threat) {
        const countermeasures = [];
        
        switch (threat.type) {
            case 'cyber_attack':
                countermeasures.push('enhance_cyber_defense', 'incident_response', 'attribution_investigation');
                break;
            case 'territorial_dispute':
                countermeasures.push('border_reinforcement', 'diplomatic_negotiation', 'international_mediation');
                break;
            case 'terrorist_threat':
                countermeasures.push('intelligence_gathering', 'security_screening', 'counter_terrorism_operations');
                break;
            case 'military_buildup':
                countermeasures.push('force_readiness_increase', 'alliance_coordination', 'deterrent_positioning');
                break;
            default:
                countermeasures.push('threat_monitoring', 'contingency_planning', 'force_preparation');
        }
        
        return countermeasures;
    }

    updateDefensePosture() {
        if (this.state.threatLevel > 0.8) {
            this.state.militaryDoctrine = 'high_alert';
            this.adjustReadinessLevels(0.9);
        } else if (this.state.threatLevel > 0.6) {
            this.state.militaryDoctrine = 'elevated';
            this.adjustReadinessLevels(0.8);
        } else if (this.state.threatLevel > 0.4) {
            this.state.militaryDoctrine = 'normal';
            this.adjustReadinessLevels(0.7);
        } else {
            this.state.militaryDoctrine = 'peacetime';
            this.adjustReadinessLevels(0.6);
        }
    }

    adjustReadinessLevels(targetLevel) {
        Object.keys(this.state.branches).forEach(branch => {
            this.state.branches[branch].readiness = this.smoothTransition(
                this.state.branches[branch].readiness, targetLevel, 0.2);
        });
    }

    processTrainingAndDoctrine(aiInputs) {
        const trainingIntensity = aiInputs.training_intensity || 0.7;
        
        // Update training effectiveness
        this.state.trainingEffectiveness = Math.min(1.0, 
            0.5 + trainingIntensity * 0.4);
        
        // Process training programs
        this.updateTrainingPrograms(trainingIntensity);
        
        // Update military doctrine based on threat environment
        this.updateMilitaryDoctrine(aiInputs);
    }

    updateTrainingPrograms(intensity) {
        const programs = [
            'basic_combat_training',
            'advanced_tactical_training',
            'leadership_development',
            'technical_specialization',
            'joint_operations_training',
            'cyber_warfare_training'
        ];
        
        programs.forEach(program => {
            this.state.trainingPrograms.set(program, {
                intensity: intensity,
                effectiveness: Math.min(1.0, 0.4 + intensity * 0.6),
                participants: Math.floor(this.state.activePersonnel * 0.1),
                lastUpdate: Date.now()
            });
        });
    }

    updateMilitaryDoctrine(aiInputs) {
        const internalFocus = aiInputs.internal_security_focus || 0.5;
        const cooperationLevel = aiInputs.international_cooperation_level || 0.5;
        
        // Determine doctrine based on focus areas
        if (internalFocus > 0.7) {
            this.state.militaryDoctrine = 'homeland_defense';
        } else if (cooperationLevel > 0.7) {
            this.state.militaryDoctrine = 'coalition_based';
        } else if (this.state.threatLevel > 0.6) {
            this.state.militaryDoctrine = 'forward_defense';
        } else {
            this.state.militaryDoctrine = 'balanced_defense';
        }
    }

    updateForceStructure(aiInputs) {
        const reserveActivation = aiInputs.reserve_activation_level || 0.1;
        
        // Calculate active force levels
        const baseActive = 50000;
        const reserveActivated = Math.floor(this.state.reservePersonnel * reserveActivation);
        
        this.state.activePersonnel = baseActive + reserveActivated;
        
        // Distribute personnel across branches
        this.redistributePersonnel();
        
        // Update force capabilities based on structure
        this.updateForceCapabilities();
    }

    redistributePersonnel() {
        const total = this.state.activePersonnel;
        
        // Standard distribution percentages
        const distribution = {
            army: 0.5,
            navy: 0.24,
            air_force: 0.16,
            space_force: 0.06,
            cyber_command: 0.04
        };
        
        Object.keys(distribution).forEach(branch => {
            this.state.branches[branch].personnel = Math.floor(total * distribution[branch]);
        });
    }

    updateForceCapabilities() {
        // Calculate capabilities based on personnel and equipment
        Object.keys(this.state.branches).forEach(branch => {
            const branchData = this.state.branches[branch];
            const personnelFactor = branchData.personnel / 10000; // Normalize
            const equipmentFactor = branchData.equipment_status;
            const trainingFactor = branchData.training_level;
            
            branchData.capability_index = Math.min(1.0, 
                (personnelFactor * 0.4 + equipmentFactor * 0.4 + trainingFactor * 0.2));
        });
    }

    processOperations(gameState, aiInputs) {
        // Update active operations based on threat level and doctrine
        this.updateActiveOperations(aiInputs);
        
        // Process deployments
        this.updateDeployments(aiInputs);
        
        // Schedule exercises
        this.scheduleExercises(aiInputs);
    }

    updateActiveOperations(aiInputs) {
        const internalFocus = aiInputs.internal_security_focus || 0.5;
        const borderEmphasis = aiInputs.border_security_emphasis || 0.7;
        
        this.state.activeOperations = [];
        
        // Border security operations
        if (borderEmphasis > 0.6) {
            this.state.activeOperations.push({
                name: 'Border Security Patrol',
                type: 'border_security',
                personnel: Math.floor(this.state.activePersonnel * 0.1),
                status: 'ongoing',
                effectiveness: borderEmphasis
            });
        }
        
        // Internal security operations
        if (internalFocus > 0.6) {
            this.state.activeOperations.push({
                name: 'Homeland Security Operations',
                type: 'internal_security',
                personnel: Math.floor(this.state.activePersonnel * 0.05),
                status: 'ongoing',
                effectiveness: internalFocus
            });
        }
        
        // Cyber defense operations
        const cyberPriority = aiInputs.cyber_defense_priority || 0.8;
        if (cyberPriority > 0.5) {
            this.state.activeOperations.push({
                name: 'Cyber Defense Operations',
                type: 'cyber_defense',
                personnel: this.state.branches.cyber_command.personnel,
                status: 'continuous',
                effectiveness: cyberPriority
            });
        }
    }

    updateDeployments(aiInputs) {
        const cooperationLevel = aiInputs.international_cooperation_level || 0.5;
        
        this.state.deployments.clear();
        
        // International deployments based on cooperation level
        if (cooperationLevel > 0.6) {
            this.state.deployments.set('peacekeeping_mission', {
                personnel: Math.floor(this.state.activePersonnel * 0.02),
                location: 'international',
                duration: 365, // days
                purpose: 'peacekeeping'
            });
        }
        
        // Training deployments
        this.state.deployments.set('training_exercises', {
            personnel: Math.floor(this.state.activePersonnel * 0.05),
            location: 'various',
            duration: 30,
            purpose: 'training'
        });
    }

    scheduleExercises(aiInputs) {
        const trainingIntensity = aiInputs.training_intensity || 0.7;
        const cooperationLevel = aiInputs.international_cooperation_level || 0.5;
        
        this.state.exerciseSchedule = [];
        
        // Domestic exercises
        const domesticExercises = Math.floor(trainingIntensity * 12); // Up to 12 per year
        for (let i = 0; i < domesticExercises; i++) {
            this.state.exerciseSchedule.push({
                name: `Domestic Exercise ${i + 1}`,
                type: 'domestic',
                participants: Math.floor(this.state.activePersonnel * 0.1),
                duration: 7,
                effectiveness: trainingIntensity
            });
        }
        
        // International joint exercises
        if (cooperationLevel > 0.5) {
            const jointExercises = Math.floor(cooperationLevel * 6); // Up to 6 per year
            for (let i = 0; i < jointExercises; i++) {
                this.state.exerciseSchedule.push({
                    name: `Joint Exercise ${i + 1}`,
                    type: 'international',
                    participants: Math.floor(this.state.activePersonnel * 0.05),
                    duration: 14,
                    effectiveness: cooperationLevel
                });
            }
        }
    }

    updateInternationalCooperation(aiInputs) {
        const cooperationLevel = aiInputs.international_cooperation_level || 0.5;
        
        // Update alliances based on cooperation level
        if (cooperationLevel > 0.7) {
            this.state.alliances = [
                { name: 'Defense Alliance Alpha', strength: 0.8, members: 5 },
                { name: 'Security Partnership Beta', strength: 0.6, members: 3 }
            ];
        } else if (cooperationLevel > 0.4) {
            this.state.alliances = [
                { name: 'Security Partnership Beta', strength: 0.6, members: 3 }
            ];
        } else {
            this.state.alliances = [];
        }
        
        // Update military agreements
        this.updateMilitaryAgreements(cooperationLevel);
    }

    updateMilitaryAgreements(cooperationLevel) {
        this.state.militaryAgreements = [];
        
        if (cooperationLevel > 0.6) {
            this.state.militaryAgreements.push(
                { type: 'intelligence_sharing', partners: 4, effectiveness: 0.7 },
                { type: 'joint_training', partners: 3, effectiveness: 0.8 },
                { type: 'equipment_standardization', partners: 2, effectiveness: 0.6 }
            );
        } else if (cooperationLevel > 0.3) {
            this.state.militaryAgreements.push(
                { type: 'intelligence_sharing', partners: 2, effectiveness: 0.5 }
            );
        }
    }

    calculateDefenseCapabilities(aiInputs) {
        const borderEmphasis = aiInputs.border_security_emphasis || 0.7;
        const cyberPriority = aiInputs.cyber_defense_priority || 0.8;
        const internalFocus = aiInputs.internal_security_focus || 0.5;
        
        // Border security capability
        this.state.defensiveCapabilities.border_security = Math.min(1.0, 
            0.4 + borderEmphasis * 0.5 + this.state.branches.army.readiness * 0.1);
        
        // Cyber defense capability
        this.state.defensiveCapabilities.cyber_defense = Math.min(1.0, 
            0.5 + cyberPriority * 0.3 + this.state.branches.cyber_command.readiness * 0.2);
        
        // Homeland security capability
        this.state.defensiveCapabilities.homeland_security = Math.min(1.0, 
            0.5 + internalFocus * 0.3 + this.state.overallReadiness * 0.2);
        
        // Air defense capability
        this.state.defensiveCapabilities.air_defense = Math.min(1.0, 
            0.4 + this.state.branches.air_force.readiness * 0.4 + 
            this.state.equipmentReadiness * 0.2);
        
        // Naval defense capability
        this.state.defensiveCapabilities.naval_defense = Math.min(1.0, 
            0.4 + this.state.branches.navy.readiness * 0.4 + 
            this.state.logisticsReadiness * 0.2);
        
        // Space defense capability
        this.state.defensiveCapabilities.space_defense = Math.min(1.0, 
            0.2 + this.state.branches.space_force.readiness * 0.6 + 
            this.state.intelligenceReadiness * 0.2);
    }

    updateEquipmentStatus(aiInputs) {
        const modernizationRate = aiInputs.force_modernization_rate || 0.3;
        const maintenanceBudget = this.state.budget.operations_maintenance || 0.2;
        
        // Update equipment readiness based on maintenance and modernization
        Object.keys(this.state.branches).forEach(branch => {
            const branchData = this.state.branches[branch];
            
            // Maintenance impact
            const maintenanceImpact = maintenanceBudget * 2; // Convert to 0-0.4 range
            
            // Modernization impact
            const modernizationImpact = modernizationRate * 0.5;
            
            // Natural degradation
            const degradation = 0.02;
            
            branchData.equipment_status = Math.max(0.1, Math.min(1.0, 
                branchData.equipment_status + maintenanceImpact + modernizationImpact - degradation));
        });
        
        // Update overall equipment readiness
        const avgEquipmentStatus = Object.values(this.state.branches)
            .reduce((sum, branch) => sum + branch.equipment_status, 0) / 
            Object.keys(this.state.branches).length;
        
        this.state.equipmentReadiness = avgEquipmentStatus;
    }

    smoothTransition(current, target, rate) {
        return current + (target - current) * rate;
    }

    generateOutputs() {
        return {
            military_readiness: {
                overall_readiness: this.state.overallReadiness,
                personnel_readiness: this.state.personnelReadiness,
                equipment_readiness: this.state.equipmentReadiness,
                logistics_readiness: this.state.logisticsReadiness,
                intelligence_readiness: this.state.intelligenceReadiness,
                readiness_category: this.categorizeReadiness(this.state.overallReadiness),
                branch_readiness: this.getBranchReadiness()
            },
            
            force_structure: {
                active_personnel: this.state.activePersonnel,
                reserve_personnel: this.state.reservePersonnel,
                civilian_personnel: this.state.civilianPersonnel,
                branch_distribution: this.getBranchDistribution(),
                force_capability_index: this.calculateOverallCapabilityIndex(),
                deployment_status: this.getDeploymentStatus()
            },
            
            defense_capabilities: {
                ...this.state.defensiveCapabilities,
                overall_defense_index: this.calculateOverallDefenseIndex(),
                capability_gaps: this.identifyCapabilityGaps(),
                strength_areas: this.identifyStrengthAreas()
            },
            
            threat_analysis: {
                current_threat_level: this.state.threatLevel,
                threat_category: this.categorizeThreatLevel(this.state.threatLevel),
                identified_threats: this.state.identifiedThreats,
                threat_sources: Array.from(this.state.threatSources.entries()),
                defense_posture: this.state.militaryDoctrine,
                risk_assessment: this.generateRiskAssessment()
            },
            
            military_operations: {
                active_operations: this.state.activeOperations,
                deployments: Array.from(this.state.deployments.entries()),
                exercise_schedule: this.state.exerciseSchedule,
                operational_tempo: this.calculateOperationalTempo(),
                mission_readiness: this.calculateMissionReadiness()
            },
            
            resource_utilization: {
                budget_allocation: this.state.budget,
                budget_efficiency: this.calculateBudgetEfficiencyScore(),
                resource_constraints: this.identifyResourceConstraints(),
                investment_priorities: this.generateInvestmentPriorities()
            },
            
            training_status: {
                training_effectiveness: this.state.trainingEffectiveness,
                training_programs: Array.from(this.state.trainingPrograms.entries()),
                military_doctrine: this.state.militaryDoctrine,
                professional_development: this.assessProfessionalDevelopment()
            },
            
            international_relations: {
                alliances: this.state.alliances,
                military_agreements: this.state.militaryAgreements,
                joint_exercises: this.state.jointExercises,
                cooperation_index: this.calculateCooperationIndex(),
                diplomatic_military_status: this.assessDiplomaticMilitaryStatus()
            }
        };
    }

    categorizeReadiness(readiness) {
        if (readiness > 0.8) return 'high';
        if (readiness > 0.6) return 'moderate';
        if (readiness > 0.4) return 'low';
        return 'critical';
    }

    getBranchReadiness() {
        const readiness = {};
        Object.entries(this.state.branches).forEach(([branch, data]) => {
            readiness[branch] = {
                readiness: data.readiness,
                personnel: data.personnel,
                equipment_status: data.equipment_status,
                training_level: data.training_level
            };
        });
        return readiness;
    }

    getBranchDistribution() {
        const distribution = {};
        const total = this.state.activePersonnel;
        
        Object.entries(this.state.branches).forEach(([branch, data]) => {
            distribution[branch] = {
                personnel: data.personnel,
                percentage: (data.personnel / total * 100).toFixed(1)
            };
        });
        
        return distribution;
    }

    calculateOverallCapabilityIndex() {
        const capabilities = Object.values(this.state.branches)
            .map(branch => branch.capability_index || 0.5);
        
        return capabilities.reduce((sum, cap) => sum + cap, 0) / capabilities.length;
    }

    getDeploymentStatus() {
        const deployed = Array.from(this.state.deployments.values())
            .reduce((sum, deployment) => sum + deployment.personnel, 0);
        
        return {
            total_deployed: deployed,
            deployment_percentage: (deployed / this.state.activePersonnel * 100).toFixed(1),
            available_for_deployment: this.state.activePersonnel - deployed
        };
    }

    calculateOverallDefenseIndex() {
        const capabilities = Object.values(this.state.defensiveCapabilities);
        return capabilities.reduce((sum, cap) => sum + cap, 0) / capabilities.length;
    }

    identifyCapabilityGaps() {
        const gaps = [];
        
        Object.entries(this.state.defensiveCapabilities).forEach(([capability, level]) => {
            if (level < 0.5) {
                gaps.push({
                    capability,
                    current_level: level,
                    gap_severity: 0.5 - level,
                    priority: level < 0.3 ? 'high' : 'medium'
                });
            }
        });
        
        return gaps.sort((a, b) => b.gap_severity - a.gap_severity);
    }

    identifyStrengthAreas() {
        const strengths = [];
        
        Object.entries(this.state.defensiveCapabilities).forEach(([capability, level]) => {
            if (level > 0.7) {
                strengths.push({
                    capability,
                    strength_level: level,
                    advantage: level - 0.7
                });
            }
        });
        
        return strengths.sort((a, b) => b.strength_level - a.strength_level);
    }

    categorizeThreatLevel(level) {
        if (level > 0.8) return 'critical';
        if (level > 0.6) return 'high';
        if (level > 0.4) return 'moderate';
        if (level > 0.2) return 'low';
        return 'minimal';
    }

    generateRiskAssessment() {
        return {
            overall_risk: this.state.threatLevel,
            readiness_risk: 1 - this.state.overallReadiness,
            capability_risk: 1 - this.calculateOverallDefenseIndex(),
            resource_risk: this.assessResourceRisk(),
            mitigation_strategies: this.generateMitigationStrategies()
        };
    }

    assessResourceRisk() {
        const personnelBudget = this.state.budget.personnel_costs || 0.4;
        const equipmentBudget = this.state.budget.equipment_procurement || 0.25;
        
        // Risk increases if budgets are too low
        let risk = 0;
        if (personnelBudget < 0.3) risk += 0.3;
        if (equipmentBudget < 0.2) risk += 0.2;
        
        return Math.min(1.0, risk);
    }

    generateMitigationStrategies() {
        const strategies = [];
        
        if (this.state.overallReadiness < 0.6) {
            strategies.push('Increase training intensity and frequency');
        }
        
        if (this.state.threatLevel > 0.6) {
            strategies.push('Enhance intelligence gathering and threat monitoring');
        }
        
        if (this.state.equipmentReadiness < 0.6) {
            strategies.push('Accelerate equipment modernization program');
        }
        
        return strategies;
    }

    calculateOperationalTempo() {
        const activeOps = this.state.activeOperations.length;
        const deployments = this.state.deployments.size;
        const exercises = this.state.exerciseSchedule.length;
        
        const tempo = (activeOps * 0.4 + deployments * 0.3 + exercises * 0.3) / 10;
        return Math.min(1.0, tempo);
    }

    calculateMissionReadiness() {
        return (this.state.overallReadiness + this.calculateOverallDefenseIndex()) / 2;
    }

    calculateBudgetEfficiencyScore() {
        // Higher readiness per dollar spent = higher efficiency
        const totalBudget = this.state.budget.total_budget || 50000000000;
        const readinessPerDollar = this.state.overallReadiness / (totalBudget / 1000000000); // Per billion
        
        return Math.min(1.0, readinessPerDollar * 10); // Normalize to 0-1
    }

    identifyResourceConstraints() {
        const constraints = [];
        
        if (this.state.budget.personnel_costs < 0.35) {
            constraints.push('Insufficient personnel funding');
        }
        
        if (this.state.budget.equipment_procurement < 0.2) {
            constraints.push('Limited equipment procurement budget');
        }
        
        if (this.state.budget.research_development < 0.08) {
            constraints.push('Inadequate R&D investment');
        }
        
        return constraints;
    }

    generateInvestmentPriorities() {
        const priorities = [];
        
        // Prioritize based on capability gaps
        const gaps = this.identifyCapabilityGaps();
        gaps.slice(0, 3).forEach(gap => {
            priorities.push({
                area: gap.capability,
                priority: gap.priority,
                investment_type: 'capability_improvement'
            });
        });
        
        // Add modernization priorities
        if (this.state.equipmentReadiness < 0.6) {
            priorities.push({
                area: 'equipment_modernization',
                priority: 'high',
                investment_type: 'modernization'
            });
        }
        
        return priorities;
    }

    assessProfessionalDevelopment() {
        return {
            leadership_programs: this.state.trainingPrograms.has('leadership_development'),
            technical_training: this.state.trainingPrograms.has('technical_specialization'),
            career_progression: this.state.trainingEffectiveness,
            retention_rate: Math.min(1.0, 0.7 + this.state.trainingEffectiveness * 0.2)
        };
    }

    calculateCooperationIndex() {
        const allianceStrength = this.state.alliances.reduce((sum, alliance) => 
            sum + alliance.strength, 0) / Math.max(1, this.state.alliances.length);
        
        const agreementCount = this.state.militaryAgreements.length / 5; // Normalize
        
        return Math.min(1.0, (allianceStrength + agreementCount) / 2);
    }

    assessDiplomaticMilitaryStatus() {
        return {
            alliance_strength: this.calculateCooperationIndex(),
            international_standing: Math.min(1.0, 0.5 + this.calculateCooperationIndex() * 0.3),
            conflict_risk: this.state.threatLevel,
            cooperation_opportunities: this.state.alliances.length + this.state.militaryAgreements.length
        };
    }

    generateFallbackOutputs() {
        return {
            military_readiness: {
                overall_readiness: 0.6,
                personnel_readiness: 0.6,
                equipment_readiness: 0.6,
                logistics_readiness: 0.6,
                intelligence_readiness: 0.6,
                readiness_category: 'moderate'
            },
            force_structure: {
                active_personnel: 50000,
                reserve_personnel: 25000,
                force_capability_index: 0.6
            },
            defense_capabilities: {
                border_security: 0.6,
                air_defense: 0.6,
                naval_defense: 0.6,
                cyber_defense: 0.6,
                overall_defense_index: 0.6
            },
            threat_analysis: {
                current_threat_level: 0.3,
                threat_category: 'low',
                defense_posture: 'normal'
            },
            military_operations: {
                active_operations: [],
                operational_tempo: 0.5,
                mission_readiness: 0.6
            },
            resource_utilization: {
                budget_efficiency: 0.6,
                resource_constraints: []
            },
            training_status: {
                training_effectiveness: 0.7,
                military_doctrine: 'balanced_defense'
            },
            international_relations: {
                alliances: [],
                cooperation_index: 0.4
            }
        };
    }

    // System interface methods
    getSystemStatus() {
        return {
            systemId: this.systemId,
            overallReadiness: this.state.overallReadiness,
            threatLevel: this.state.threatLevel,
            activePersonnel: this.state.activePersonnel,
            lastUpdate: this.state.lastUpdate,
            isOperational: true
        };
    }

    reset() {
        this.state.overallReadiness = 0.7;
        this.state.threatLevel = 0.3;
        this.state.identifiedThreats = [];
        this.state.activeOperations = [];
        console.log('🎖️ Military System reset');
    }
}

module.exports = { MilitarySystem };
