/**
 * Espionage Operations & Spy Networks
 * Task 46: Information Classification & Espionage System
 * 
 * Manages spy networks, intelligence gathering operations, and counter-intelligence
 */

import { InformationAsset, InformationType, SecurityLevel, informationClassification } from './informationClassification';

export enum SpyType {
  CORPORATE_INFILTRATOR = 'CORPORATE_INFILTRATOR',
  RESEARCH_SCIENTIST = 'RESEARCH_SCIENTIST', 
  GOVERNMENT_LIAISON = 'GOVERNMENT_LIAISON',
  MILITARY_CONTACT = 'MILITARY_CONTACT',
  DIPLOMATIC_ASSET = 'DIPLOMATIC_ASSET',
  CYBER_OPERATIVE = 'CYBER_OPERATIVE',
  INDUSTRIAL_SABOTEUR = 'INDUSTRIAL_SABOTEUR',
  DOUBLE_AGENT = 'DOUBLE_AGENT'
}

export enum OperationType {
  INTELLIGENCE_GATHERING = 'INTELLIGENCE_GATHERING',
  TECHNOLOGY_THEFT = 'TECHNOLOGY_THEFT',
  MARKET_MANIPULATION = 'MARKET_MANIPULATION',
  SABOTAGE = 'SABOTAGE',
  DISINFORMATION = 'DISINFORMATION',
  COUNTER_INTELLIGENCE = 'COUNTER_INTELLIGENCE',
  ASSET_RECRUITMENT = 'ASSET_RECRUITMENT',
  SURVEILLANCE = 'SURVEILLANCE'
}

export enum OperationStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  COMPROMISED = 'COMPROMISED',
  ABORTED = 'ABORTED'
}

export interface SpyAgent {
  id: string;
  codename: string;
  realName?: string; // Only known to handlers
  type: SpyType;
  organization: string; // Employing organization
  targetOrganization: string; // Organization being infiltrated
  coverIdentity: string;
  skillLevel: number; // 1-10
  trustworthiness: number; // 0-1
  exposure: number; // 0-1 (risk of being discovered)
  accessLevel: number; // 1-10 (clearance in target org)
  specialties: string[];
  status: 'active' | 'deep_cover' | 'burned' | 'retired' | 'captured' | 'deceased';
  recruitedAt: Date;
  lastContact: Date;
  successfulOperations: number;
  failedOperations: number;
  handler: string;
  location: string;
  cost: number; // Monthly maintenance cost
  metadata: {
    psychProfile?: string;
    motivations?: string[];
    vulnerabilities?: string[];
    contacts?: string[];
    equipment?: string[];
  };
}

export interface EspionageOperation {
  id: string;
  codename: string;
  type: OperationType;
  description: string;
  targetOrganization: string;
  operatingOrganization: string;
  assignedAgents: string[]; // Spy agent IDs
  objectives: string[];
  status: OperationStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  estimatedDuration: number; // days
  actualDuration?: number;
  budget: number;
  actualCost?: number;
  successProbability: number; // 0-1
  riskLevel: number; // 0-1
  discoveryRisk: number; // 0-1
  expectedIntelligence: InformationType[];
  acquiredIntelligence: string[]; // Information asset IDs
  complications: string[];
  coverStory: string;
  extractionPlan?: string;
  handler: string;
  approvedBy: string;
  results?: {
    success: boolean;
    intelligenceGathered: number;
    assetsCompromised: number;
    collateralDamage: string[];
    followUpRequired: boolean;
  };
}

export interface CounterIntelligenceAlert {
  id: string;
  type: 'suspicious_activity' | 'security_breach' | 'agent_compromise' | 'information_leak';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedAssets: string[];
  suspectedOrganization?: string;
  detectedAt: Date;
  investigationStatus: 'open' | 'investigating' | 'resolved' | 'false_alarm';
  assignedInvestigator?: string;
  evidence: string[];
  recommendations: string[];
}

export interface IntelligenceNetwork {
  id: string;
  name: string;
  organization: string;
  agents: string[]; // Spy agent IDs
  operations: string[]; // Operation IDs
  budget: number;
  effectiveness: number; // 0-1
  securityRating: number; // 0-1
  coverDepth: number; // 0-1
  geographicReach: string[];
  specializations: OperationType[];
  networkHandler: string;
  establishedAt: Date;
  lastRestructure?: Date;
  compromisedAgents: number;
  successfulOperations: number;
  totalOperations: number;
}

export class EspionageOperationsService {
  private spyAgents: Map<string, SpyAgent> = new Map();
  private operations: Map<string, EspionageOperation> = new Map();
  private networks: Map<string, IntelligenceNetwork> = new Map();
  private counterIntelAlerts: Map<string, CounterIntelligenceAlert> = new Map();

  /**
   * Recruit a new spy agent
   */
  recruitAgent(
    codename: string,
    type: SpyType,
    organization: string,
    targetOrg: string,
    coverIdentity: string,
    handler: string
  ): SpyAgent {
    const agent: SpyAgent = {
      id: this.generateAgentId(),
      codename,
      type,
      organization,
      targetOrganization: targetOrg,
      coverIdentity,
      skillLevel: this.generateSkillLevel(type),
      trustworthiness: 0.8, // Start with high trust
      exposure: 0.1, // Low initial exposure
      accessLevel: 1, // Start with minimal access
      specialties: this.getTypeSpecialties(type),
      status: 'active',
      recruitedAt: new Date(),
      lastContact: new Date(),
      successfulOperations: 0,
      failedOperations: 0,
      handler,
      location: 'unknown',
      cost: this.calculateAgentCost(type),
      metadata: {
        motivations: this.generateMotivations(type),
        equipment: this.getStandardEquipment(type)
      }
    };

    this.spyAgents.set(agent.id, agent);
    return agent;
  }

  /**
   * Plan a new espionage operation
   */
  planOperation(
    codename: string,
    type: OperationType,
    description: string,
    targetOrg: string,
    operatingOrg: string,
    objectives: string[],
    handler: string,
    approvedBy: string
  ): EspionageOperation {
    const operation: EspionageOperation = {
      id: this.generateOperationId(),
      codename,
      type,
      description,
      targetOrganization: targetOrg,
      operatingOrganization: operatingOrg,
      assignedAgents: [],
      objectives,
      status: OperationStatus.PLANNING,
      priority: 'medium',
      startDate: new Date(),
      estimatedDuration: this.estimateOperationDuration(type),
      budget: this.estimateOperationBudget(type),
      successProbability: 0.6, // Base probability
      riskLevel: this.calculateOperationRisk(type),
      discoveryRisk: this.calculateDiscoveryRisk(type),
      expectedIntelligence: this.getExpectedIntelligenceTypes(type),
      acquiredIntelligence: [],
      complications: [],
      coverStory: this.generateCoverStory(type, targetOrg),
      handler,
      approvedBy
    };

    this.operations.set(operation.id, operation);
    return operation;
  }

  /**
   * Assign agents to an operation
   */
  assignAgentsToOperation(operationId: string, agentIds: string[]): EspionageOperation {
    const operation = this.operations.get(operationId);
    if (!operation) {
      throw new Error('Operation not found');
    }

    // Verify agents exist and are available
    const agents = agentIds.map(id => {
      const agent = this.spyAgents.get(id);
      if (!agent) {
        throw new Error(`Agent ${id} not found`);
      }
      if (agent.status !== 'active' && agent.status !== 'deep_cover') {
        throw new Error(`Agent ${agent.codename} is not available (status: ${agent.status})`);
      }
      return agent;
    });

    operation.assignedAgents = agentIds;
    
    // Recalculate success probability based on assigned agents
    operation.successProbability = this.calculateOperationSuccessProbability(operation, agents);
    
    return operation;
  }

  /**
   * Execute an espionage operation
   */
  executeOperation(operationId: string): EspionageOperation {
    const operation = this.operations.get(operationId);
    if (!operation) {
      throw new Error('Operation not found');
    }

    if (operation.status !== OperationStatus.PLANNING) {
      throw new Error(`Operation ${operation.codename} is not in planning status`);
    }

    operation.status = OperationStatus.ACTIVE;
    operation.startDate = new Date();

    // Simulate operation execution
    const success = Math.random() < operation.successProbability;
    const agents = operation.assignedAgents.map(id => this.spyAgents.get(id)!);

    if (success) {
      // Successful operation
      operation.status = OperationStatus.COMPLETED;
      operation.results = {
        success: true,
        intelligenceGathered: this.generateIntelligenceFromOperation(operation),
        assetsCompromised: 0,
        collateralDamage: [],
        followUpRequired: Math.random() < 0.3
      };

      // Update agent success records
      agents.forEach(agent => {
        agent.successfulOperations++;
        agent.trustworthiness = Math.min(1, agent.trustworthiness + 0.05);
        agent.skillLevel = Math.min(10, agent.skillLevel + 0.1);
        agent.lastContact = new Date();
      });

    } else {
      // Failed operation
      const compromised = Math.random() < operation.discoveryRisk;
      
      operation.status = compromised ? OperationStatus.COMPROMISED : OperationStatus.ABORTED;
      operation.results = {
        success: false,
        intelligenceGathered: 0,
        assetsCompromised: compromised ? Math.floor(Math.random() * agents.length) + 1 : 0,
        collateralDamage: compromised ? ['Cover blown', 'Security alert raised'] : [],
        followUpRequired: true
      };

      // Update agent failure records and exposure
      agents.forEach(agent => {
        agent.failedOperations++;
        agent.trustworthiness = Math.max(0, agent.trustworthiness - 0.1);
        agent.exposure = Math.min(1, agent.exposure + (compromised ? 0.3 : 0.1));
        
        if (compromised && Math.random() < 0.5) {
          agent.status = 'burned';
        }
      });

      // Generate counter-intelligence alert for target organization
      if (compromised) {
        this.generateCounterIntelAlert(operation, 'security_breach');
      }
    }

    operation.actualDuration = Math.ceil(Math.random() * operation.estimatedDuration * 1.5);
    operation.actualCost = operation.budget * (0.8 + Math.random() * 0.4); // 80-120% of budget

    return operation;
  }

  /**
   * Generate intelligence assets from successful operation
   */
  private generateIntelligenceFromOperation(operation: EspionageOperation): number {
    const intelligenceCount = Math.floor(Math.random() * 3) + 1; // 1-3 pieces of intelligence
    
    for (let i = 0; i < intelligenceCount; i++) {
      const intelType = operation.expectedIntelligence[
        Math.floor(Math.random() * operation.expectedIntelligence.length)
      ];
      
      const title = this.generateIntelligenceTitle(operation, intelType);
      const content = this.generateIntelligenceContent(operation, intelType);
      
      const asset = informationClassification.classifyInformation(
        title,
        content,
        intelType,
        operation.targetOrganization,
        {
          acquisitionMethod: 'espionage',
          acquisitionCost: operation.actualCost! / intelligenceCount,
          riskLevel: operation.riskLevel > 0.7 ? 'high' : operation.riskLevel > 0.4 ? 'medium' : 'low',
          verificationStatus: 'partially_verified'
        }
      );
      
      operation.acquiredIntelligence.push(asset.id);
    }
    
    return intelligenceCount;
  }

  /**
   * Generate counter-intelligence alert
   */
  private generateCounterIntelAlert(
    operation: EspionageOperation, 
    type: CounterIntelligenceAlert['type']
  ): CounterIntelligenceAlert {
    const alert: CounterIntelligenceAlert = {
      id: this.generateAlertId(),
      type,
      severity: operation.riskLevel > 0.7 ? 'high' : operation.riskLevel > 0.4 ? 'medium' : 'low',
      description: `Suspicious activity detected related to ${operation.type.toLowerCase().replace('_', ' ')}`,
      affectedAssets: operation.acquiredIntelligence,
      suspectedOrganization: operation.operatingOrganization,
      detectedAt: new Date(),
      investigationStatus: 'open',
      evidence: [
        'Unusual access patterns detected',
        'Security protocol violations',
        'Unauthorized information requests'
      ],
      recommendations: [
        'Increase security monitoring',
        'Review access permissions',
        'Conduct security audit'
      ]
    };

    this.counterIntelAlerts.set(alert.id, alert);
    return alert;
  }

  /**
   * Create intelligence network
   */
  createIntelligenceNetwork(
    name: string,
    organization: string,
    handler: string,
    budget: number,
    specializations: OperationType[]
  ): IntelligenceNetwork {
    const network: IntelligenceNetwork = {
      id: this.generateNetworkId(),
      name,
      organization,
      agents: [],
      operations: [],
      budget,
      effectiveness: 0.5, // Start at medium effectiveness
      securityRating: 0.7, // Start with good security
      coverDepth: 0.6, // Medium cover depth
      geographicReach: [],
      specializations,
      networkHandler: handler,
      establishedAt: new Date(),
      compromisedAgents: 0,
      successfulOperations: 0,
      totalOperations: 0
    };

    this.networks.set(network.id, network);
    return network;
  }

  /**
   * Add agent to intelligence network
   */
  addAgentToNetwork(networkId: string, agentId: string): void {
    const network = this.networks.get(networkId);
    const agent = this.spyAgents.get(agentId);
    
    if (!network) throw new Error('Network not found');
    if (!agent) throw new Error('Agent not found');
    
    if (!network.agents.includes(agentId)) {
      network.agents.push(agentId);
      
      // Update network effectiveness based on agent quality
      this.updateNetworkEffectiveness(network);
    }
  }

  /**
   * Update network effectiveness based on agents
   */
  private updateNetworkEffectiveness(network: IntelligenceNetwork): void {
    const agents = network.agents.map(id => this.spyAgents.get(id)!).filter(Boolean);
    
    if (agents.length === 0) {
      network.effectiveness = 0;
      return;
    }

    const avgSkill = agents.reduce((sum, agent) => sum + agent.skillLevel, 0) / agents.length;
    const avgTrust = agents.reduce((sum, agent) => sum + agent.trustworthiness, 0) / agents.length;
    const avgExposure = agents.reduce((sum, agent) => sum + agent.exposure, 0) / agents.length;
    
    network.effectiveness = (avgSkill / 10 * 0.4) + (avgTrust * 0.3) + ((1 - avgExposure) * 0.3);
    network.securityRating = (avgTrust * 0.5) + ((1 - avgExposure) * 0.5);
  }

  /**
   * Get available agents for operation type
   */
  getAvailableAgents(
    operationType: OperationType,
    targetOrganization?: string
  ): SpyAgent[] {
    return Array.from(this.spyAgents.values())
      .filter(agent => {
        // Must be active or in deep cover
        if (agent.status !== 'active' && agent.status !== 'deep_cover') {
          return false;
        }
        
        // If target org specified, agent must have access
        if (targetOrganization && agent.targetOrganization !== targetOrganization) {
          return false;
        }
        
        // Check if agent has relevant specialties
        return this.agentSuitableForOperation(agent, operationType);
      })
      .sort((a, b) => b.skillLevel - a.skillLevel);
  }

  /**
   * Check if agent is suitable for operation type
   */
  private agentSuitableForOperation(agent: SpyAgent, operationType: OperationType): boolean {
    const suitableTypes: Record<OperationType, SpyType[]> = {
      [OperationType.INTELLIGENCE_GATHERING]: [
        SpyType.CORPORATE_INFILTRATOR, SpyType.GOVERNMENT_LIAISON, SpyType.DIPLOMATIC_ASSET
      ],
      [OperationType.TECHNOLOGY_THEFT]: [
        SpyType.RESEARCH_SCIENTIST, SpyType.CORPORATE_INFILTRATOR, SpyType.CYBER_OPERATIVE
      ],
      [OperationType.MARKET_MANIPULATION]: [
        SpyType.CORPORATE_INFILTRATOR, SpyType.GOVERNMENT_LIAISON
      ],
      [OperationType.SABOTAGE]: [
        SpyType.INDUSTRIAL_SABOTEUR, SpyType.CYBER_OPERATIVE
      ],
      [OperationType.DISINFORMATION]: [
        SpyType.DIPLOMATIC_ASSET, SpyType.DOUBLE_AGENT
      ],
      [OperationType.COUNTER_INTELLIGENCE]: [
        SpyType.DOUBLE_AGENT, SpyType.GOVERNMENT_LIAISON
      ],
      [OperationType.ASSET_RECRUITMENT]: [
        SpyType.DIPLOMATIC_ASSET, SpyType.CORPORATE_INFILTRATOR
      ],
      [OperationType.SURVEILLANCE]: [
        SpyType.CYBER_OPERATIVE, SpyType.CORPORATE_INFILTRATOR
      ]
    };

    return suitableTypes[operationType].includes(agent.type);
  }

  // Utility methods for generating realistic data
  private generateSkillLevel(type: SpyType): number {
    const baseSkills: Record<SpyType, number> = {
      [SpyType.CORPORATE_INFILTRATOR]: 6,
      [SpyType.RESEARCH_SCIENTIST]: 7,
      [SpyType.GOVERNMENT_LIAISON]: 5,
      [SpyType.MILITARY_CONTACT]: 6,
      [SpyType.DIPLOMATIC_ASSET]: 7,
      [SpyType.CYBER_OPERATIVE]: 8,
      [SpyType.INDUSTRIAL_SABOTEUR]: 5,
      [SpyType.DOUBLE_AGENT]: 9
    };

    return Math.min(10, baseSkills[type] + Math.floor(Math.random() * 3));
  }

  private getTypeSpecialties(type: SpyType): string[] {
    const specialties: Record<SpyType, string[]> = {
      [SpyType.CORPORATE_INFILTRATOR]: ['social_engineering', 'document_theft', 'insider_trading'],
      [SpyType.RESEARCH_SCIENTIST]: ['technical_analysis', 'research_theft', 'prototype_access'],
      [SpyType.GOVERNMENT_LIAISON]: ['policy_intelligence', 'regulatory_insight', 'political_connections'],
      [SpyType.MILITARY_CONTACT]: ['defense_intelligence', 'weapons_systems', 'strategic_planning'],
      [SpyType.DIPLOMATIC_ASSET]: ['international_relations', 'treaty_negotiations', 'cultural_intelligence'],
      [SpyType.CYBER_OPERATIVE]: ['hacking', 'digital_surveillance', 'data_extraction'],
      [SpyType.INDUSTRIAL_SABOTEUR]: ['sabotage', 'disruption', 'equipment_tampering'],
      [SpyType.DOUBLE_AGENT]: ['deception', 'counter_intelligence', 'information_manipulation']
    };

    return specialties[type];
  }

  private calculateAgentCost(type: SpyType): number {
    const baseCosts: Record<SpyType, number> = {
      [SpyType.CORPORATE_INFILTRATOR]: 5000,
      [SpyType.RESEARCH_SCIENTIST]: 8000,
      [SpyType.GOVERNMENT_LIAISON]: 6000,
      [SpyType.MILITARY_CONTACT]: 7000,
      [SpyType.DIPLOMATIC_ASSET]: 9000,
      [SpyType.CYBER_OPERATIVE]: 10000,
      [SpyType.INDUSTRIAL_SABOTEUR]: 4000,
      [SpyType.DOUBLE_AGENT]: 15000
    };

    return baseCosts[type] * (0.8 + Math.random() * 0.4); // ±20% variation
  }

  private generateMotivations(type: SpyType): string[] {
    const motivations = ['money', 'ideology', 'coercion', 'ego', 'revenge'];
    return motivations.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private getStandardEquipment(type: SpyType): string[] {
    const equipment: Record<SpyType, string[]> = {
      [SpyType.CORPORATE_INFILTRATOR]: ['fake_credentials', 'recording_device', 'encrypted_phone'],
      [SpyType.RESEARCH_SCIENTIST]: ['lab_access_card', 'data_storage', 'technical_scanner'],
      [SpyType.GOVERNMENT_LIAISON]: ['diplomatic_immunity', 'secure_communications', 'expense_account'],
      [SpyType.MILITARY_CONTACT]: ['security_clearance', 'encrypted_radio', 'tactical_gear'],
      [SpyType.DIPLOMATIC_ASSET]: ['diplomatic_pouch', 'cultural_cover', 'language_skills'],
      [SpyType.CYBER_OPERATIVE]: ['hacking_tools', 'vpn_access', 'malware_kit'],
      [SpyType.INDUSTRIAL_SABOTEUR]: ['sabotage_kit', 'explosives', 'technical_tools'],
      [SpyType.DOUBLE_AGENT]: ['multiple_identities', 'dead_drops', 'counter_surveillance']
    };

    return equipment[type];
  }

  // Additional utility methods...
  private estimateOperationDuration(type: OperationType): number {
    const durations: Record<OperationType, number> = {
      [OperationType.INTELLIGENCE_GATHERING]: 30,
      [OperationType.TECHNOLOGY_THEFT]: 60,
      [OperationType.MARKET_MANIPULATION]: 90,
      [OperationType.SABOTAGE]: 14,
      [OperationType.DISINFORMATION]: 45,
      [OperationType.COUNTER_INTELLIGENCE]: 120,
      [OperationType.ASSET_RECRUITMENT]: 180,
      [OperationType.SURVEILLANCE]: 60
    };

    return durations[type] * (0.7 + Math.random() * 0.6); // ±30% variation
  }

  private estimateOperationBudget(type: OperationType): number {
    const budgets: Record<OperationType, number> = {
      [OperationType.INTELLIGENCE_GATHERING]: 50000,
      [OperationType.TECHNOLOGY_THEFT]: 100000,
      [OperationType.MARKET_MANIPULATION]: 200000,
      [OperationType.SABOTAGE]: 75000,
      [OperationType.DISINFORMATION]: 80000,
      [OperationType.COUNTER_INTELLIGENCE]: 150000,
      [OperationType.ASSET_RECRUITMENT]: 120000,
      [OperationType.SURVEILLANCE]: 60000
    };

    return budgets[type] * (0.8 + Math.random() * 0.4); // ±20% variation
  }

  private calculateOperationRisk(type: OperationType): number {
    const risks: Record<OperationType, number> = {
      [OperationType.INTELLIGENCE_GATHERING]: 0.3,
      [OperationType.TECHNOLOGY_THEFT]: 0.6,
      [OperationType.MARKET_MANIPULATION]: 0.4,
      [OperationType.SABOTAGE]: 0.8,
      [OperationType.DISINFORMATION]: 0.5,
      [OperationType.COUNTER_INTELLIGENCE]: 0.7,
      [OperationType.ASSET_RECRUITMENT]: 0.4,
      [OperationType.SURVEILLANCE]: 0.3
    };

    return risks[type];
  }

  private calculateDiscoveryRisk(type: OperationType): number {
    return this.calculateOperationRisk(type) * 0.7; // Discovery risk is typically lower than general risk
  }

  private getExpectedIntelligenceTypes(type: OperationType): InformationType[] {
    const types: Record<OperationType, InformationType[]> = {
      [OperationType.INTELLIGENCE_GATHERING]: [InformationType.MARKET_INTELLIGENCE, InformationType.FINANCIAL_RECORDS],
      [OperationType.TECHNOLOGY_THEFT]: [InformationType.TECHNOLOGY_SPECS, InformationType.RESEARCH_DATA],
      [OperationType.MARKET_MANIPULATION]: [InformationType.MARKET_INTELLIGENCE, InformationType.TRADE_SECRETS],
      [OperationType.SABOTAGE]: [InformationType.TECHNOLOGY_SPECS, InformationType.FINANCIAL_RECORDS],
      [OperationType.DISINFORMATION]: [InformationType.DIPLOMATIC_CABLES, InformationType.MARKET_INTELLIGENCE],
      [OperationType.COUNTER_INTELLIGENCE]: [InformationType.PERSONNEL_FILES, InformationType.MILITARY_PLANS],
      [OperationType.ASSET_RECRUITMENT]: [InformationType.PERSONNEL_FILES, InformationType.FINANCIAL_RECORDS],
      [OperationType.SURVEILLANCE]: [InformationType.DIPLOMATIC_CABLES, InformationType.PERSONNEL_FILES]
    };

    return types[type];
  }

  private calculateOperationSuccessProbability(operation: EspionageOperation, agents: SpyAgent[]): number {
    if (agents.length === 0) return 0.1;

    const avgSkill = agents.reduce((sum, agent) => sum + agent.skillLevel, 0) / agents.length;
    const avgTrust = agents.reduce((sum, agent) => sum + agent.trustworthiness, 0) / agents.length;
    const avgExposure = agents.reduce((sum, agent) => sum + agent.exposure, 0) / agents.length;

    let probability = 0.3; // Base probability
    probability += (avgSkill / 10) * 0.4; // Skill factor
    probability += avgTrust * 0.2; // Trust factor
    probability -= avgExposure * 0.3; // Exposure penalty
    probability -= operation.riskLevel * 0.2; // Risk penalty

    return Math.max(0.05, Math.min(0.95, probability));
  }

  private generateCoverStory(type: OperationType, targetOrg: string): string {
    const stories = [
      `Routine business meeting with ${targetOrg}`,
      `Technology partnership discussion`,
      `Market research collaboration`,
      `Academic exchange program`,
      `Consulting engagement`,
      `Joint venture exploration`
    ];

    return stories[Math.floor(Math.random() * stories.length)];
  }

  private generateIntelligenceTitle(operation: EspionageOperation, type: InformationType): string {
    const titles: Record<InformationType, string[]> = {
      [InformationType.RESEARCH_DATA]: ['Advanced Research Findings', 'Experimental Results', 'R&D Progress Report'],
      [InformationType.TECHNOLOGY_SPECS]: ['Technical Specifications', 'System Architecture', 'Product Blueprint'],
      [InformationType.MARKET_INTELLIGENCE]: ['Market Analysis', 'Competitive Intelligence', 'Industry Forecast'],
      [InformationType.MILITARY_PLANS]: ['Strategic Operations Plan', 'Defense Capabilities', 'Military Readiness'],
      [InformationType.DIPLOMATIC_CABLES]: ['Diplomatic Communications', 'Policy Briefing', 'International Relations'],
      [InformationType.FINANCIAL_RECORDS]: ['Financial Statement', 'Budget Allocation', 'Investment Portfolio'],
      [InformationType.PERSONNEL_FILES]: ['Employee Records', 'Executive Profiles', 'Organizational Chart'],
      [InformationType.TRADE_SECRETS]: ['Proprietary Process', 'Manufacturing Secrets', 'Formula Documentation']
    };

    const typeTitle = titles[type][Math.floor(Math.random() * titles[type].length)];
    return `${operation.targetOrganization} - ${typeTitle}`;
  }

  private generateIntelligenceContent(operation: EspionageOperation, type: InformationType): string {
    // Generate realistic but generic intelligence content
    const contents = [
      `Classified information obtained from ${operation.targetOrganization} regarding ${type.toLowerCase().replace('_', ' ')}. `,
      `Internal documents reveal strategic plans and operational details. `,
      `Analysis indicates significant competitive advantages and potential vulnerabilities. `,
      `Recommendations for strategic response and countermeasures included.`
    ];

    return contents.join('') + `Acquired through Operation ${operation.codename}.`;
  }

  // ID generators
  private generateAgentId(): string {
    return 'AGT-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateOperationId(): string {
    return 'OPS-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateNetworkId(): string {
    return 'NET-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateAlertId(): string {
    return 'ALT-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Getters
  getSpyAgents(): SpyAgent[] {
    return Array.from(this.spyAgents.values());
  }

  getOperations(): EspionageOperation[] {
    return Array.from(this.operations.values());
  }

  getIntelligenceNetworks(): IntelligenceNetwork[] {
    return Array.from(this.networks.values());
  }

  getCounterIntelligenceAlerts(): CounterIntelligenceAlert[] {
    return Array.from(this.counterIntelAlerts.values());
  }
}

export const espionageOperations = new EspionageOperationsService();
