/**
 * Technology & Cyber Warfare Systems - Core Engine
 * Sprint 16: Technology acquisition, cyber warfare, and research acceleration
 */

import { 
  Technology, TechnologyCategory, TechnologyLevel, AcquisitionMethod, TechnologyEra,
  CivilizationTech, ResearchProject, ResearchMilestone,
  CyberOperation, CyberOperationType, OperationStatus, CyberAsset, CyberOperationOutcome,
  IntelligenceData, TechnologyTransfer, ReverseEngineeringProject,
  TechnologySample, AnalysisResult, TechnologyAnalyticsData, TechnologyRecommendation,
  PsychicPower, TechTreeNode, InnovationEvent, InnovationSource
} from './types.js';
import { DynamicTechTreeGenerator } from './DynamicTechTreeGenerator.js';
import { InnovationEngine } from './InnovationEngine.js';

export class TechnologyEngine {
  private technologies: Map<string, Technology> = new Map();
  private psychicPowers: Map<string, PsychicPower> = new Map();
  private civilizations: Map<string, CivilizationTech> = new Map();
  private researchProjects: Map<string, ResearchProject> = new Map();
  private cyberOperations: Map<string, CyberOperation> = new Map();
  private technologyTransfers: Map<string, TechnologyTransfer> = new Map();
  private reverseEngineeringProjects: Map<string, ReverseEngineeringProject> = new Map();
  private intelligenceData: Map<string, IntelligenceData> = new Map();
  private techTreeGenerator: DynamicTechTreeGenerator;
  private innovationEngine: InnovationEngine;
  private gameSeed: number;

  constructor(gameSeed?: number) {
    this.gameSeed = gameSeed || Date.now();
    this.techTreeGenerator = new DynamicTechTreeGenerator(this.gameSeed);
    this.innovationEngine = new InnovationEngine(this.gameSeed);
    
    this.initializeDynamicTechTree();
    this.initializeSampleCivilizations();
  }

  // Technology Management
  createTechnology(params: {
    name: string;
    category: TechnologyCategory;
    level: TechnologyLevel;
    description: string;
    complexity: number;
    researchCost: number;
    implementationCost: number;
    maintenanceCost: number;
    prerequisites?: string[];
    economicBonus?: number;
    militaryBonus?: number;
    researchBonus?: number;
    acquisitionMethod?: AcquisitionMethod;
    sourceId?: string;
    securityLevel?: number;
    vulnerabilityScore?: number;
  }): Technology {
    const id = `tech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const technology: Technology = {
      id,
      name: params.name,
      category: params.category,
      level: params.level,
      description: params.description,
      complexity: Math.max(1, Math.min(10, params.complexity)),
      researchCost: params.researchCost,
      implementationCost: params.implementationCost,
      maintenanceCost: params.maintenanceCost,
      prerequisites: params.prerequisites || [],
      unlocks: [],
      economicBonus: params.economicBonus || 0,
      militaryBonus: params.militaryBonus || 0,
      researchBonus: params.researchBonus || 0,
      acquisitionMethod: params.acquisitionMethod || 'Research',
      acquisitionDate: new Date(),
      sourceId: params.sourceId,
      acquisitionCost: params.researchCost,
      implementationProgress: 0,
      operationalStatus: 'Research',
      securityLevel: params.securityLevel || Math.floor(Math.random() * 5) + 3,
      vulnerabilityScore: params.vulnerabilityScore || Math.floor(Math.random() * 5) + 3,
      metadata: {
        discoveredBy: params.sourceId || 'Unknown',
        patents: [],
        classifications: [],
        exportRestrictions: params.level === 'Advanced' || params.level === 'Cutting-Edge',
        dualUse: params.category === 'Military' || Math.random() > 0.7
      }
    };

    this.technologies.set(id, technology);
    return technology;
  }

  // Civilization Management
  createCivilization(params: {
    name: string;
    techLevel: TechnologyLevel;
    researchCapacity?: number;
    innovationRate?: number;
    technologyAdoption?: number;
    strengths?: TechnologyCategory[];
    weaknesses?: TechnologyCategory[];
    cyberDefense?: number;
    counterIntelligence?: number;
    informationSecurity?: number;
  }): CivilizationTech {
    const id = `civ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const civilization: CivilizationTech = {
      civilizationId: id,
      name: params.name,
      techLevel: params.techLevel,
      technologies: [],
      researchProjects: [],
      researchCapacity: params.researchCapacity || Math.floor(Math.random() * 1000) + 500,
      innovationRate: params.innovationRate || Math.random() * 0.5 + 0.3,
      technologyAdoption: params.technologyAdoption || Math.random() * 0.4 + 0.4,
      strengths: params.strengths || this.generateRandomStrengths(),
      weaknesses: params.weaknesses || this.generateRandomWeaknesses(),
      cyberDefense: params.cyberDefense || Math.floor(Math.random() * 5) + 3,
      counterIntelligence: params.counterIntelligence || Math.floor(Math.random() * 5) + 3,
      informationSecurity: params.informationSecurity || Math.floor(Math.random() * 5) + 3
    };

    this.civilizations.set(id, civilization);
    return civilization;
  }

  // Research Project Management
  startResearchProject(params: {
    civilizationId: string;
    name: string;
    targetTechnology: string;
    category: TechnologyCategory;
    budget: number;
    researchers: number;
    estimatedDuration: number; // in days
    securityClearance?: string;
    collaborators?: string[];
  }): ResearchProject {
    const id = `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startDate = new Date();
    const estimatedCompletion = new Date(startDate.getTime() + params.estimatedDuration * 24 * 60 * 60 * 1000);

    const project: ResearchProject = {
      id,
      name: params.name,
      targetTechnology: params.targetTechnology,
      category: params.category,
      startDate,
      estimatedCompletion,
      budget: params.budget,
      budgetSpent: 0,
      researchers: params.researchers,
      facilities: this.generateResearchFacilities(params.category),
      progress: 0,
      milestones: this.generateResearchMilestones(params.name, estimatedCompletion),
      collaborators: params.collaborators || [],
      securityClearance: params.securityClearance as any || 'Restricted',
      breakthroughs: [],
      setbacks: [],
      spinoffTechnologies: []
    };

    this.researchProjects.set(id, project);
    
    // Add to civilization
    const civilization = this.civilizations.get(params.civilizationId);
    if (civilization) {
      civilization.researchProjects.push(project);
    }

    return project;
  }

  // Cyber Operations
  launchCyberOperation(params: {
    operatorId: string;
    targetId: string;
    name: string;
    type: CyberOperationType;
    primaryObjective: string;
    secondaryObjectives?: string[];
    targetTechnologies?: string[];
    duration: number; // in days
    budget: number;
    personnel: number;
  }): CyberOperation {
    const id = `cyber_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const operator = this.civilizations.get(params.operatorId);
    const target = this.civilizations.get(params.targetId);
    
    if (!operator || !target) {
      throw new Error('Invalid operator or target civilization');
    }

    const operation: CyberOperation = {
      id,
      name: params.name,
      type: params.type,
      startDate: new Date(),
      duration: params.duration,
      operatorId: params.operatorId,
      targetId: params.targetId,
      assets: this.generateCyberAssets(params.personnel),
      primaryObjective: params.primaryObjective,
      secondaryObjectives: params.secondaryObjectives || [],
      targetTechnologies: params.targetTechnologies || [],
      status: 'Planning',
      progress: 0,
      detectionRisk: this.calculateDetectionRisk(operator, target),
      successProbability: this.calculateSuccessProbability(operator, target, params.type),
      budget: params.budget,
      personnel: params.personnel,
      tools: this.generateCyberTools(params.type),
      intelligence: [],
      stolenTechnologies: [],
      compromisedSystems: [],
      evidenceLeft: 0,
      attribution: 0
    };

    this.cyberOperations.set(id, operation);
    return operation;
  }

  executeCyberOperation(operationId: string): CyberOperationOutcome {
    const operation = this.cyberOperations.get(operationId);
    if (!operation) {
      throw new Error('Cyber operation not found');
    }

    const operator = this.civilizations.get(operation.operatorId);
    const target = this.civilizations.get(operation.targetId);
    
    if (!operator || !target) {
      throw new Error('Invalid operator or target civilization');
    }

    // Simulate operation execution
    const success = Math.random() < (operation.successProbability / 100);
    const detected = Math.random() < (operation.detectionRisk / 10);
    
    const outcome: CyberOperationOutcome = {
      success,
      detectionLevel: this.determineDetectionLevel(detected, success, operator, target),
      technologiesAcquired: [],
      dataAcquired: [],
      economicDamage: 0,
      militaryDamage: 0,
      operationalCost: operation.budget * (0.8 + Math.random() * 0.4),
      assetsLost: [],
      reputationDamage: 0,
      diplomaticFallout: 0,
      securityUpgrades: []
    };

    if (success) {
      // Acquire technologies
      if (operation.targetTechnologies.length > 0) {
        for (const techId of operation.targetTechnologies) {
          if (Math.random() < 0.7) { // 70% chance to acquire each targeted tech
            const tech = this.technologies.get(techId);
            if (tech) {
              const stolenTech = this.createStolenTechnology(tech, operation.operatorId);
              outcome.technologiesAcquired.push(stolenTech);
              operation.stolenTechnologies.push(techId);
            }
          }
        }
      }

      // Generate intelligence data
      outcome.dataAcquired = this.generateIntelligenceData(target, operation.type);
      
      // Calculate damage
      outcome.economicDamage = Math.floor(Math.random() * 1000000) + 100000;
      outcome.militaryDamage = Math.floor(Math.random() * 500000) + 50000;
    }

    // Handle detection consequences
    if (detected) {
      outcome.reputationDamage = Math.floor(Math.random() * 50) + 10;
      outcome.diplomaticFallout = Math.floor(Math.random() * 30) + 5;
      outcome.securityUpgrades = this.generateSecurityUpgrades(target);
      
      // Potential retaliation
      if (Math.random() < 0.3) {
        outcome.retaliation = this.planRetaliation(target, operator, operation);
      }
    }

    operation.outcome = outcome;
    operation.status = success ? 'Completed' : 'Failed';
    operation.endDate = new Date();

    return outcome;
  }

  // Technology Transfer
  transferTechnology(params: {
    sourceId: string;
    recipientId: string;
    technologyId: string;
    transferMethod: 'Sale' | 'License' | 'Gift' | 'Exchange' | 'Theft' | 'Conquest';
    cost?: number;
    restrictions?: string[];
    duration?: number;
    royalties?: number;
  }): TechnologyTransfer {
    const id = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const technology = this.technologies.get(params.technologyId);
    if (!technology) {
      throw new Error('Technology not found');
    }

    const transfer: TechnologyTransfer = {
      id,
      sourceId: params.sourceId,
      recipientId: params.recipientId,
      technologyId: params.technologyId,
      transferDate: new Date(),
      transferMethod: params.transferMethod,
      cost: params.cost || 0,
      restrictions: params.restrictions || [],
      duration: params.duration,
      royalties: params.royalties,
      adaptationRequired: technology.complexity > 5,
      adaptationCost: technology.implementationCost * 0.3,
      adaptationTime: Math.floor(technology.complexity * 30), // days
      successProbability: Math.max(50, 100 - technology.complexity * 5),
      implementationSuccess: false,
      performanceDegradation: 0,
      localImprovements: [],
      securityMeasures: this.generateSecurityMeasures(technology),
      leakageRisk: Math.floor(Math.random() * 5) + 1
    };

    // Simulate implementation
    if (Math.random() < (transfer.successProbability / 100)) {
      transfer.implementationSuccess = true;
      transfer.performanceDegradation = Math.floor(Math.random() * 20); // 0-20% degradation
      
      if (Math.random() < 0.3) {
        transfer.localImprovements = this.generateLocalImprovements(technology);
      }
    }

    this.technologyTransfers.set(id, transfer);
    return transfer;
  }

  // Reverse Engineering
  startReverseEngineering(params: {
    civilizationId: string;
    targetTechnologyId: string;
    budget: number;
    researchers: number;
    samples: TechnologySample[];
  }): ReverseEngineeringProject {
    const id = `reverse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const technology = this.technologies.get(params.targetTechnologyId);
    
    if (!technology) {
      throw new Error('Target technology not found');
    }

    const estimatedDuration = technology.complexity * 60; // days
    const project: ReverseEngineeringProject = {
      id,
      civilizationId: params.civilizationId,
      targetTechnologyId: params.targetTechnologyId,
      startDate: new Date(),
      estimatedCompletion: new Date(Date.now() + estimatedDuration * 24 * 60 * 60 * 1000),
      budget: params.budget,
      researchers: params.researchers,
      facilities: this.generateResearchFacilities(technology.category),
      samples: params.samples,
      progress: 0,
      understanding: 0,
      reproduction: 0,
      technicalChallenges: this.generateTechnicalChallenges(technology),
      materialChallenges: this.generateMaterialChallenges(technology),
      knowledgeGaps: this.generateKnowledgeGaps(technology),
      discoveries: [],
      improvements: [],
      alternativeApproaches: [],
      success: false
    };

    this.reverseEngineeringProjects.set(id, project);
    return project;
  }

  // Analytics and Reporting
  generateTechnologyAnalytics(civilizationId?: string): TechnologyAnalyticsData {
    const technologies = civilizationId 
      ? Array.from(this.technologies.values()).filter(t => 
          this.civilizations.get(civilizationId)?.technologies.includes(t))
      : Array.from(this.technologies.values());

    const cyberOps = Array.from(this.cyberOperations.values());
    const transfers = Array.from(this.technologyTransfers.values());
    const reverseProjects = Array.from(this.reverseEngineeringProjects.values());

    return {
      totalTechnologies: technologies.length,
      technologiesByCategory: this.groupByCategory(technologies),
      technologiesByLevel: this.groupByLevel(technologies),
      averageComplexity: this.calculateAverageComplexity(technologies),
      
      activeResearchProjects: Array.from(this.researchProjects.values()).length,
      researchBudget: this.calculateTotalResearchBudget(),
      researchEfficiency: this.calculateResearchEfficiency(),
      innovationRate: this.calculateInnovationRate(),
      
      acquisitionsByMethod: this.groupByAcquisitionMethod(technologies),
      acquisitionCosts: this.calculateTotalAcquisitionCosts(technologies),
      acquisitionSuccess: this.calculateAcquisitionSuccessRate(),
      
      activeCyberOperations: cyberOps.filter(op => op.status === 'Active').length,
      cyberSuccessRate: this.calculateCyberSuccessRate(cyberOps),
      technologiesStolen: this.countStolenTechnologies(cyberOps),
      cyberDefenseRating: this.calculateAverageCyberDefense(),
      
      transfersIn: transfers.filter(t => t.recipientId === civilizationId).length,
      transfersOut: transfers.filter(t => t.sourceId === civilizationId).length,
      reverseEngineeringProjects: reverseProjects.length,
      reverseEngineeringSuccess: this.calculateReverseEngineeringSuccess(reverseProjects),
      
      economicImpact: this.calculateEconomicImpact(technologies),
      militaryImpact: this.calculateMilitaryImpact(technologies),
      researchImpact: this.calculateResearchImpact(technologies),
      
      vulnerabilityScore: this.calculateVulnerabilityScore(technologies),
      securityIncidents: this.countSecurityIncidents(),
      counterIntelligenceEffectiveness: this.calculateCounterIntelligenceEffectiveness(),
      
      technologyGap: this.calculateTechnologyGaps(civilizationId),
      competitiveAdvantages: this.identifyCompetitiveAdvantages(civilizationId),
      strategicVulnerabilities: this.identifyStrategicVulnerabilities(civilizationId),
      
      projectedGrowth: this.calculateProjectedGrowth(),
      emergingTechnologies: this.identifyEmergingTechnologies(),
      obsoleteTechnologies: this.identifyObsoleteTechnologies(),
      
      researchPriorities: this.generateResearchPriorities(civilizationId),
      acquisitionTargets: this.generateAcquisitionTargets(civilizationId),
      securityUpgrades: this.generateSecurityRecommendations(civilizationId),
      collaborationOpportunities: this.identifyCollaborationOpportunities(civilizationId)
    };
  }

  generateRecommendations(civilizationId: string): TechnologyRecommendation[] {
    const recommendations: TechnologyRecommendation[] = [];
    const civilization = this.civilizations.get(civilizationId);
    
    if (!civilization) {
      return recommendations;
    }

    // Research recommendations
    const researchGaps = this.identifyResearchGaps(civilization);
    for (const gap of researchGaps) {
      recommendations.push({
        type: 'Research',
        priority: 'High',
        description: `Develop ${gap} technology`,
        rationale: `Critical gap in ${gap} capabilities`,
        estimatedCost: Math.floor(Math.random() * 1000000) + 500000,
        estimatedBenefit: Math.floor(Math.random() * 2000000) + 1000000,
        timeframe: '2-3 years',
        risks: ['Technical challenges', 'Budget overruns'],
        dependencies: []
      });
    }

    // Acquisition recommendations
    const acquisitionTargets = this.identifyAcquisitionTargets(civilization);
    for (const target of acquisitionTargets) {
      recommendations.push({
        type: 'Acquire',
        priority: 'Medium',
        technologyId: target,
        description: `Acquire ${target} technology`,
        rationale: `Faster than internal development`,
        estimatedCost: Math.floor(Math.random() * 500000) + 100000,
        estimatedBenefit: Math.floor(Math.random() * 1000000) + 500000,
        timeframe: '6-12 months',
        risks: ['Technology transfer restrictions', 'Adaptation challenges'],
        dependencies: []
      });
    }

    // Security recommendations
    if (civilization.cyberDefense < 7) {
      recommendations.push({
        type: 'Defend',
        priority: 'Critical',
        description: 'Upgrade cyber defense capabilities',
        rationale: 'Current defenses are inadequate against modern threats',
        estimatedCost: Math.floor(Math.random() * 200000) + 100000,
        estimatedBenefit: Math.floor(Math.random() * 500000) + 300000,
        timeframe: '3-6 months',
        risks: ['Implementation complexity', 'Staff training requirements'],
        dependencies: []
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Utility Methods
  private initializeDynamicTechTree(): void {
    // Generate dynamic tech tree based on game seed
    const startingEra: TechnologyEra = 'Digital'; // Can be configured per game
    const gameType = 'rapid'; // Fast progression to space age
    
    const techTreeData = this.techTreeGenerator.generateTechTree(startingEra, gameType);
    
    // Store technologies
    for (const tech of techTreeData.technologies) {
      this.technologies.set(tech.id, tech);
    }
    
    // Store psychic powers
    for (const power of techTreeData.psychicPowers) {
      this.psychicPowers.set(power.id, power);
    }
    
    console.log(`Initialized dynamic tech tree with ${techTreeData.technologies.length} technologies and ${techTreeData.psychicPowers.length} psychic powers`);
  }

  private initializeSampleCivilizations(): void {
    const sampleCivs = [
      { name: 'Tech Republic', level: 'Advanced' as TechnologyLevel },
      { name: 'Industrial Empire', level: 'Intermediate' as TechnologyLevel },
      { name: 'Research Federation', level: 'Cutting-Edge' as TechnologyLevel }
    ];

    for (const civ of sampleCivs) {
      this.createCivilization({
        name: civ.name,
        techLevel: civ.level
      });
    }
  }

  private generateRandomStrengths(): TechnologyCategory[] {
    const categories: TechnologyCategory[] = ['Military', 'Industrial', 'Medical', 'Computing', 'Energy'];
    const count = Math.floor(Math.random() * 3) + 1;
    return categories.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private generateRandomWeaknesses(): TechnologyCategory[] {
    const categories: TechnologyCategory[] = ['Biotechnology', 'Nanotechnology', 'Quantum', 'Space', 'Materials'];
    const count = Math.floor(Math.random() * 2) + 1;
    return categories.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private generateResearchFacilities(category: TechnologyCategory): string[] {
    const facilities = [
      `${category} Research Lab`,
      `Advanced ${category} Facility`,
      `${category} Testing Center`,
      `Experimental ${category} Lab`
    ];
    return facilities.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateResearchMilestones(projectName: string, completion: Date): ResearchMilestone[] {
    const milestones: ResearchMilestone[] = [];
    const count = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < count; i++) {
      const progress = ((i + 1) / count) * 100;
      const targetDate = new Date(Date.now() + (completion.getTime() - Date.now()) * (i + 1) / count);
      
      milestones.push({
        id: `milestone_${i + 1}`,
        name: `${projectName} Milestone ${i + 1}`,
        description: `Phase ${i + 1} completion`,
        targetDate,
        progress: 0,
        significance: i === count - 1 ? 'Breakthrough' : 'Major'
      });
    }
    
    return milestones;
  }

  private generateCyberAssets(personnel: number): CyberAsset[] {
    const assets: CyberAsset[] = [];
    
    for (let i = 0; i < personnel; i++) {
      assets.push({
        id: `asset_${i + 1}`,
        name: `Cyber Operative ${i + 1}`,
        type: 'Human',
        capability: ['Hacking', 'Social Engineering', 'Data Analysis'],
        reliability: Math.floor(Math.random() * 5) + 5,
        coverStatus: 'Intact'
      });
    }
    
    return assets;
  }

  private calculateDetectionRisk(operator: CivilizationTech, target: CivilizationTech): number {
    const operatorSkill = (operator.cyberDefense + operator.counterIntelligence) / 2;
    const targetDefense = (target.cyberDefense + target.informationSecurity) / 2;
    
    return Math.max(1, Math.min(10, 10 - (operatorSkill - targetDefense)));
  }

  private calculateSuccessProbability(operator: CivilizationTech, target: CivilizationTech, type: CyberOperationType): number {
    const operatorCapability = operator.cyberDefense * 10;
    const targetResistance = target.cyberDefense * 8;
    const typeModifier = type === 'Technology Theft' ? 0.8 : 1.0;
    
    return Math.max(10, Math.min(90, (operatorCapability - targetResistance) * typeModifier + 50));
  }

  private generateCyberTools(type: CyberOperationType): string[] {
    const baseTools = ['Network Scanner', 'Encryption Breaker', 'Social Engineering Kit'];
    const specializedTools = {
      'Technology Theft': ['Data Extractor', 'File System Analyzer'],
      'Sabotage': ['System Disruptor', 'Logic Bomb'],
      'Surveillance': ['Network Monitor', 'Traffic Analyzer']
    };
    
    return [...baseTools, ...(specializedTools[type] || [])];
  }

  private determineDetectionLevel(detected: boolean, success: boolean, operator: CivilizationTech, target: CivilizationTech): CyberOperationOutcome['detectionLevel'] {
    if (!detected) return 'Undetected';
    
    const attributionDifficulty = operator.counterIntelligence - target.counterIntelligence;
    
    if (attributionDifficulty > 3) return 'Suspected';
    if (attributionDifficulty > 0) return 'Detected';
    if (attributionDifficulty > -3) return 'Attributed';
    return 'Exposed';
  }

  private createStolenTechnology(originalTech: Technology, operatorId: string): Technology {
    return {
      ...originalTech,
      id: `stolen_${originalTech.id}_${Date.now()}`,
      acquisitionMethod: 'Cyber Theft',
      acquisitionDate: new Date(),
      sourceId: operatorId,
      implementationProgress: 0,
      operationalStatus: 'Development',
      securityLevel: Math.max(1, originalTech.securityLevel - 2),
      vulnerabilityScore: originalTech.vulnerabilityScore + 2
    };
  }

  private generateIntelligenceData(target: CivilizationTech, operationType: CyberOperationType): IntelligenceData[] {
    const intelligence: IntelligenceData[] = [];
    const count = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < count; i++) {
      intelligence.push({
        id: `intel_${Date.now()}_${i}`,
        type: 'Technical',
        classification: 'Secret',
        content: `Intelligence data from ${target.name}`,
        source: `Cyber Operation`,
        reliability: Math.floor(Math.random() * 5) + 5,
        timeliness: Math.floor(Math.random() * 3) + 8,
        acquisitionDate: new Date(),
        strategicValue: Math.floor(Math.random() * 5) + 5,
        economicValue: Math.floor(Math.random() * 1000000) + 100000,
        militaryValue: Math.floor(Math.random() * 500000) + 50000,
        relatedTechnologies: [],
        implications: [`Impact on ${target.name} operations`]
      });
    }
    
    return intelligence;
  }

  private generateSecurityUpgrades(target: CivilizationTech): string[] {
    return [
      'Enhanced Firewall Systems',
      'Advanced Intrusion Detection',
      'Multi-Factor Authentication',
      'Network Segmentation',
      'Security Awareness Training'
    ];
  }

  private planRetaliation(target: CivilizationTech, operator: CivilizationTech, originalOp: CyberOperation): CyberOperation {
    return {
      id: `retaliation_${Date.now()}`,
      name: `Retaliation for ${originalOp.name}`,
      type: 'Disruption',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
      duration: 30,
      operatorId: target.civilizationId,
      targetId: operator.civilizationId,
      assets: [],
      primaryObjective: 'Disrupt operations in response to cyber attack',
      secondaryObjectives: [],
      targetTechnologies: [],
      status: 'Planning',
      progress: 0,
      detectionRisk: 5,
      successProbability: 60,
      budget: originalOp.budget * 0.8,
      personnel: Math.floor(originalOp.personnel * 0.6),
      tools: [],
      intelligence: [],
      stolenTechnologies: [],
      compromisedSystems: [],
      evidenceLeft: 0,
      attribution: 0
    };
  }

  private generateSecurityMeasures(technology: Technology): string[] {
    const measures = [
      'Access Control Lists',
      'Encryption Requirements',
      'Need-to-Know Basis',
      'Regular Security Audits',
      'Background Checks'
    ];
    
    return measures.slice(0, Math.floor(technology.securityLevel / 2) + 1);
  }

  private generateLocalImprovements(technology: Technology): string[] {
    return [
      `Improved ${technology.category} efficiency`,
      `Enhanced ${technology.name} performance`,
      `Reduced implementation costs`,
      `Better integration capabilities`
    ];
  }

  private generateTechnicalChallenges(technology: Technology): string[] {
    return [
      `Complex ${technology.category} algorithms`,
      `Advanced material requirements`,
      `Precision manufacturing needs`,
      `Integration complexity`
    ];
  }

  private generateMaterialChallenges(technology: Technology): string[] {
    return [
      'Rare earth elements required',
      'Specialized manufacturing equipment',
      'High-purity materials needed',
      'Custom component fabrication'
    ];
  }

  private generateKnowledgeGaps(technology: Technology): string[] {
    return [
      `Theoretical ${technology.category} principles`,
      'Manufacturing processes',
      'Quality control methods',
      'Performance optimization techniques'
    ];
  }

  // Analytics helper methods
  private groupByCategory(technologies: Technology[]): Record<TechnologyCategory, number> {
    const result = {} as Record<TechnologyCategory, number>;
    for (const tech of technologies) {
      result[tech.category] = (result[tech.category] || 0) + 1;
    }
    return result;
  }

  private groupByLevel(technologies: Technology[]): Record<TechnologyLevel, number> {
    const result = {} as Record<TechnologyLevel, number>;
    for (const tech of technologies) {
      result[tech.level] = (result[tech.level] || 0) + 1;
    }
    return result;
  }

  private groupByAcquisitionMethod(technologies: Technology[]): Record<AcquisitionMethod, number> {
    const result = {} as Record<AcquisitionMethod, number>;
    for (const tech of technologies) {
      result[tech.acquisitionMethod] = (result[tech.acquisitionMethod] || 0) + 1;
    }
    return result;
  }

  private calculateAverageComplexity(technologies: Technology[]): number {
    if (technologies.length === 0) return 0;
    return technologies.reduce((sum, tech) => sum + tech.complexity, 0) / technologies.length;
  }

  private calculateTotalResearchBudget(): number {
    return Array.from(this.researchProjects.values())
      .reduce((sum, project) => sum + project.budget, 0);
  }

  private calculateResearchEfficiency(): number {
    const projects = Array.from(this.researchProjects.values());
    if (projects.length === 0) return 0;
    
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
    return avgProgress / 100;
  }

  private calculateInnovationRate(): number {
    const civs = Array.from(this.civilizations.values());
    if (civs.length === 0) return 0;
    
    return civs.reduce((sum, civ) => sum + civ.innovationRate, 0) / civs.length;
  }

  private calculateTotalAcquisitionCosts(technologies: Technology[]): number {
    return technologies.reduce((sum, tech) => sum + tech.acquisitionCost, 0);
  }

  private calculateAcquisitionSuccessRate(): number {
    const transfers = Array.from(this.technologyTransfers.values());
    if (transfers.length === 0) return 0;
    
    const successful = transfers.filter(t => t.implementationSuccess).length;
    return (successful / transfers.length) * 100;
  }

  private calculateCyberSuccessRate(operations: CyberOperation[]): number {
    if (operations.length === 0) return 0;
    
    const successful = operations.filter(op => op.outcome?.success).length;
    return (successful / operations.length) * 100;
  }

  private countStolenTechnologies(operations: CyberOperation[]): number {
    return operations.reduce((sum, op) => sum + op.stolenTechnologies.length, 0);
  }

  private calculateAverageCyberDefense(): number {
    const civs = Array.from(this.civilizations.values());
    if (civs.length === 0) return 0;
    
    return civs.reduce((sum, civ) => sum + civ.cyberDefense, 0) / civs.length;
  }

  private calculateReverseEngineeringSuccess(projects: ReverseEngineeringProject[]): number {
    if (projects.length === 0) return 0;
    
    const successful = projects.filter(p => p.success).length;
    return (successful / projects.length) * 100;
  }

  private calculateEconomicImpact(technologies: Technology[]): number {
    return technologies.reduce((sum, tech) => sum + tech.economicBonus, 0);
  }

  private calculateMilitaryImpact(technologies: Technology[]): number {
    return technologies.reduce((sum, tech) => sum + tech.militaryBonus, 0);
  }

  private calculateResearchImpact(technologies: Technology[]): number {
    return technologies.reduce((sum, tech) => sum + tech.researchBonus, 0);
  }

  private calculateVulnerabilityScore(technologies: Technology[]): number {
    if (technologies.length === 0) return 0;
    
    return technologies.reduce((sum, tech) => sum + tech.vulnerabilityScore, 0) / technologies.length;
  }

  private countSecurityIncidents(): number {
    return Array.from(this.cyberOperations.values())
      .filter(op => op.outcome?.detectionLevel !== 'Undetected').length;
  }

  private calculateCounterIntelligenceEffectiveness(): number {
    const civs = Array.from(this.civilizations.values());
    if (civs.length === 0) return 0;
    
    return civs.reduce((sum, civ) => sum + civ.counterIntelligence, 0) / civs.length;
  }

  private calculateTechnologyGaps(civilizationId?: string): Record<string, number> {
    // Simplified implementation
    return {
      'Tech Republic': Math.floor(Math.random() * 50),
      'Industrial Empire': Math.floor(Math.random() * 30),
      'Research Federation': Math.floor(Math.random() * 20)
    };
  }

  private identifyCompetitiveAdvantages(civilizationId?: string): TechnologyCategory[] {
    const civilization = civilizationId ? this.civilizations.get(civilizationId) : null;
    return civilization?.strengths || ['Computing', 'AI'];
  }

  private identifyStrategicVulnerabilities(civilizationId?: string): TechnologyCategory[] {
    const civilization = civilizationId ? this.civilizations.get(civilizationId) : null;
    return civilization?.weaknesses || ['Biotechnology', 'Space'];
  }

  private calculateProjectedGrowth(): number {
    return Math.random() * 20 + 5; // 5-25% growth
  }

  private identifyEmergingTechnologies(): string[] {
    return ['Quantum Computing', 'Brain-Computer Interfaces', 'Fusion Energy', 'Advanced AI'];
  }

  private identifyObsoleteTechnologies(): string[] {
    return ['Legacy Systems', 'Outdated Protocols', 'Deprecated Standards'];
  }

  private generateResearchPriorities(civilizationId?: string): string[] {
    return ['AI Development', 'Quantum Technologies', 'Energy Systems', 'Biotechnology'];
  }

  private generateAcquisitionTargets(civilizationId?: string): string[] {
    return ['Advanced Computing', 'Neural Networks', 'Nanotechnology'];
  }

  private generateSecurityRecommendations(civilizationId?: string): string[] {
    return ['Upgrade Firewalls', 'Implement Zero Trust', 'Enhance Monitoring'];
  }

  private identifyCollaborationOpportunities(civilizationId?: string): string[] {
    return ['Joint Research Projects', 'Technology Sharing Agreements', 'Academic Partnerships'];
  }

  private identifyResearchGaps(civilization: CivilizationTech): string[] {
    return civilization.weaknesses.map(weakness => weakness.toString());
  }

  private identifyAcquisitionTargets(civilization: CivilizationTech): string[] {
    return Array.from(this.technologies.keys()).slice(0, 3);
  }

  // Getters for external access
  getTechnologies(): Technology[] {
    return Array.from(this.technologies.values());
  }

  getCivilizations(): CivilizationTech[] {
    return Array.from(this.civilizations.values());
  }

  getResearchProjects(): ResearchProject[] {
    return Array.from(this.researchProjects.values());
  }

  getCyberOperations(): CyberOperation[] {
    return Array.from(this.cyberOperations.values());
  }

  getTechnologyTransfers(): TechnologyTransfer[] {
    return Array.from(this.technologyTransfers.values());
  }

  getReverseEngineeringProjects(): ReverseEngineeringProject[] {
    return Array.from(this.reverseEngineeringProjects.values());
  }

  getIntelligenceData(): IntelligenceData[] {
    return Array.from(this.intelligenceData.values());
  }

  // Dynamic Tech Tree Methods
  generateNewTechTree(startingEra: TechnologyEra, gameType: 'rapid' | 'standard' | 'extended' = 'rapid'): void {
    this.technologies.clear();
    this.psychicPowers.clear();
    
    const techTreeData = this.techTreeGenerator.generateTechTree(startingEra, gameType);
    
    for (const tech of techTreeData.technologies) {
      this.technologies.set(tech.id, tech);
    }
    
    for (const power of techTreeData.psychicPowers) {
      this.psychicPowers.set(power.id, power);
    }
  }

  getVisibleTechnologies(civilizationId: string): Technology[] {
    const civilization = this.civilizations.get(civilizationId);
    if (!civilization) return [];
    
    return Array.from(this.technologies.values()).filter(tech => 
      tech.treeState === 'Discovered' || 
      tech.treeState === 'Unlocked' ||
      (civilization.discoveredNodes && civilization.discoveredNodes.includes(tech.id))
    );
  }

  // Innovation System Methods
  triggerCorporateInnovation(params: {
    civilizationId: string;
    corporationId: string;
    researchBudget: number;
    targetCategory?: TechnologyCategory;
    competitivePressure: number;
  }): InnovationEvent {
    const civilization = this.civilizations.get(params.civilizationId);
    if (!civilization) {
      throw new Error('Civilization not found');
    }

    return this.innovationEngine.triggerCorporateInnovation({
      civilization,
      corporationId: params.corporationId,
      researchBudget: params.researchBudget,
      targetMarket: params.targetCategory,
      competitivePressure: params.competitivePressure
    });
  }

  executeInnovationEvent(eventId: string): any {
    const techTree = this.getTechTreeForInnovation();
    return this.innovationEngine.executeInnovation(
      eventId, 
      Array.from(this.technologies.values()),
      techTree
    );
  }

  private getTechTreeForInnovation(): TechTreeNode[] {
    return Array.from(this.technologies.values()).map(tech => ({
      technologyId: tech.id,
      position: { x: 0, y: 0 },
      state: tech.treeState,
      discoveryProbability: 0.1,
      prerequisiteConnections: [],
      unlockConnections: [],
      discoveryTriggers: [],
      hiddenConditions: [],
      researchPriority: 5,
      deadEndProbability: tech.isDeadEnd ? 1.0 : 0.1,
      breakthroughPotential: 0.3
    }));
  }

  // Psychic Powers Management
  getPsychicPowers(): PsychicPower[] {
    return Array.from(this.psychicPowers.values());
  }

  getInnovationEvents(): InnovationEvent[] {
    return this.innovationEngine.getInnovationEvents();
  }
}
