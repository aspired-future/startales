/**
 * MilitaryAPI - Orchestration wrapper for military and warfare systems
 * 
 * This class integrates the existing military systems with the orchestration framework:
 * - War simulation and combat resolution
 * - Military unit management and deployment
 * - Alliance warfare and diplomacy
 * - Intelligence operations and reconnaissance
 * - AI-powered strategic analysis and recommendations
 */

import { BaseAPI, APIConfig, createAPIConfig, createKnobDefinition } from '../BaseAPI';
import {
  APIExecutionContext,
  APTTemplate,
  GameEvent
} from '../types';

// Import existing military systems
import { WarSimulatorService } from '../../../server/military/WarSimulatorService';

interface MilitarySystemResult {
  gameStateUpdates: {
    militaryData?: {
      totalMilitaryStrength: number;
      activeConflicts: any[];
      militaryUnits: any[];
      defensiveCapability: number;
      offensiveCapability: number;
      alliances: any[];
      threatLevel: number;
    };
    diplomaticRelations?: any[];
    intelligenceReports?: any[];
  };
  systemOutputs: {
    combatResults: any[];
    strategicAnalysis: any;
    threatAssessment: any;
    militaryRecommendations: any[];
    intelligenceOperations: any[];
  };
  eventsGenerated: GameEvent[];
  scheduledActions: any[];
}

export class MilitaryAPI extends BaseAPI {
  private warSimulatorService: WarSimulatorService;

  constructor(databasePool: any) {
    const config = createAPIConfig('military', {
      name: 'Military & Warfare System',
      description: 'Manages military operations, warfare, and strategic defense',
      tier: 2, // Inter-civilization system (warfare involves multiple civs)
      executionGroup: 'inter-civ',
      priority: 'high',
      frequency: 'every_tick',
      estimatedExecutionTime: 4000,
      timeoutMs: 45000,
      requiredKnobs: ['military_budget', 'defense_priority', 'aggression_level'],
      optionalKnobs: [
        'military_technology_investment', 'intelligence_budget', 'alliance_cooperation',
        'military_recruitment_rate', 'veteran_retention', 'military_training_intensity',
        'defensive_doctrine', 'offensive_doctrine', 'nuclear_policy'
      ],
      dependsOn: ['population', 'economics'] // Military depends on population and economic resources
    });

    super(config);

    // Initialize military services
    this.warSimulatorService = new WarSimulatorService(databasePool);
  }

  protected initializeKnobs(): void {
    // Core military parameters
    this.registerKnob(createKnobDefinition(
      'military_budget',
      'number',
      0.05,
      {
        description: 'Military spending as fraction of GDP',
        minValue: 0.01,
        maxValue: 0.3,
        required: true,
        category: 'budget'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'defense_priority',
      'number',
      0.6,
      {
        description: 'Priority given to defensive vs offensive capabilities (0=offensive, 1=defensive)',
        minValue: 0.0,
        maxValue: 1.0,
        required: true,
        category: 'strategy'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'aggression_level',
      'number',
      0.3,
      {
        description: 'Overall military aggression and willingness to engage in conflict',
        minValue: 0.0,
        maxValue: 1.0,
        required: true,
        category: 'strategy'
      }
    ));

    // Technology and development
    this.registerKnob(createKnobDefinition(
      'military_technology_investment',
      'number',
      0.15,
      {
        description: 'Fraction of military budget dedicated to R&D',
        minValue: 0.0,
        maxValue: 0.5,
        required: false,
        category: 'technology'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'intelligence_budget',
      'number',
      0.1,
      {
        description: 'Fraction of military budget for intelligence operations',
        minValue: 0.0,
        maxValue: 0.3,
        required: false,
        category: 'intelligence'
      }
    ));

    // Personnel and training
    this.registerKnob(createKnobDefinition(
      'military_recruitment_rate',
      'number',
      0.02,
      {
        description: 'Military recruitment rate as fraction of population',
        minValue: 0.005,
        maxValue: 0.1,
        required: false,
        category: 'personnel'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'veteran_retention',
      'number',
      0.7,
      {
        description: 'Veteran retention rate (experience preservation)',
        minValue: 0.3,
        maxValue: 0.95,
        required: false,
        category: 'personnel'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'military_training_intensity',
      'number',
      0.6,
      {
        description: 'Military training intensity and quality',
        minValue: 0.1,
        maxValue: 1.0,
        required: false,
        category: 'personnel'
      }
    ));

    // Diplomatic and alliance parameters
    this.registerKnob(createKnobDefinition(
      'alliance_cooperation',
      'number',
      0.5,
      {
        description: 'Willingness to cooperate in military alliances',
        minValue: 0.0,
        maxValue: 1.0,
        required: false,
        category: 'diplomacy'
      }
    ));

    // Doctrine parameters
    this.registerKnob(createKnobDefinition(
      'defensive_doctrine',
      'enum',
      'balanced',
      {
        description: 'Defensive military doctrine',
        enumValues: ['fortress', 'mobile_defense', 'balanced', 'forward_defense'],
        required: false,
        category: 'doctrine'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'offensive_doctrine',
      'enum',
      'combined_arms',
      {
        description: 'Offensive military doctrine',
        enumValues: ['blitzkrieg', 'combined_arms', 'attrition', 'asymmetric'],
        required: false,
        category: 'doctrine'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'nuclear_policy',
      'enum',
      'no_first_use',
      {
        description: 'Nuclear weapons policy',
        enumValues: ['no_weapons', 'no_first_use', 'limited_first_use', 'first_strike'],
        required: false,
        category: 'doctrine'
      }
    ));
  }

  protected initializeAPTs(): void {
    // Strategic Military Analysis APT
    this.registerAPT({
      id: 'strategic-military-analysis',
      name: 'Strategic Military Analysis',
      description: 'Analyzes military situation and provides strategic recommendations',
      category: 'inter-civ',
      promptTemplate: `
        Analyze the military strategic situation for this civilization:
        
        Military Status:
        - Military Budget: {militaryBudget}
        - Total Military Strength: {totalMilitaryStrength}
        - Defensive Capability: {defensiveCapability}
        - Offensive Capability: {offensiveCapability}
        - Technology Level: {militaryTechnologyLevel}
        - Personnel Count: {militaryPersonnel}
        
        Current Conflicts: {activeConflicts}
        
        Neighboring Civilizations: {neighboringCivs}
        Alliance Status: {allianceStatus}
        Threat Assessment: {currentThreats}
        
        Recent Military Events: {recentMilitaryEvents}
        
        Economic Context:
        - GDP: {gdp}
        - Economic Growth: {economicGrowth}
        - Population: {population}
        
        Strategic Parameters:
        - Defense Priority: {defensePriority}
        - Aggression Level: {aggressionLevel}
        - Alliance Cooperation: {allianceCooperation}
        
        Provide strategic military analysis including:
        1. Current military position assessment
        2. Threat analysis and risk evaluation
        3. Strategic recommendations for force development
        4. Diplomatic and alliance recommendations
        5. Resource allocation suggestions
        6. Conflict probability assessments
        
        Respond in JSON format with:
        - militaryPosition: object (current strength assessment)
        - threatAnalysis: object (identified threats and risks)
        - strategicRecommendations: array (prioritized recommendations)
        - forceStructureAdvice: object (unit composition and development)
        - diplomaticStrategy: object (alliance and diplomatic recommendations)
        - resourceAllocation: object (budget and investment recommendations)
        - conflictProbabilities: object (likelihood of various conflict scenarios)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'militaryBudget', 'totalMilitaryStrength', 'defensiveCapability', 'offensiveCapability',
        'defensePriority', 'aggressionLevel', 'gdp', 'population'
      ],
      optionalVariables: [
        'militaryTechnologyLevel', 'militaryPersonnel', 'activeConflicts', 'neighboringCivs',
        'allianceStatus', 'currentThreats', 'recentMilitaryEvents', 'economicGrowth',
        'allianceCooperation'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 2500,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 15000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes
      estimatedExecutionTime: 3000,
      memoryUsage: 70 * 1024 * 1024,
      complexity: 'high'
    });

    // Combat Outcome Prediction APT
    this.registerAPT({
      id: 'combat-outcome-prediction',
      name: 'Combat Outcome Prediction',
      description: 'Predicts outcomes of potential military conflicts',
      category: 'inter-civ',
      promptTemplate: `
        Analyze potential combat scenarios and predict outcomes:
        
        Our Military Forces:
        - Total Strength: {ourMilitaryStrength}
        - Unit Composition: {ourUnitComposition}
        - Technology Level: {ourTechnologyLevel}
        - Experience Level: {ourExperienceLevel}
        - Morale: {ourMorale}
        - Supply Status: {ourSupplyStatus}
        
        Enemy Forces (if applicable):
        - Enemy Strength: {enemyMilitaryStrength}
        - Enemy Composition: {enemyUnitComposition}
        - Enemy Technology: {enemyTechnologyLevel}
        - Enemy Experience: {enemyExperienceLevel}
        
        Combat Scenario:
        - Conflict Type: {conflictType}
        - Terrain: {terrain}
        - Weather Conditions: {weatherConditions}
        - Strategic Objectives: {objectives}
        - Time Constraints: {timeConstraints}
        
        Alliance Factors:
        - Our Allies: {ourAllies}
        - Enemy Allies: {enemyAllies}
        - Alliance Reliability: {allianceReliability}
        
        Analyze and predict:
        1. Combat outcome probabilities
        2. Casualty estimates for all sides
        3. Duration of conflict
        4. Economic impact assessment
        5. Post-conflict strategic position
        6. Civilian impact and morale effects
        
        Respond in JSON format with:
        - outcomeProbabilities: object (win/lose/stalemate probabilities)
        - casualtyEstimates: object (estimated losses for all parties)
        - conflictDuration: object (estimated duration ranges)
        - economicImpact: object (cost and economic effects)
        - strategicConsequences: object (post-conflict position analysis)
        - civilianImpact: object (population and morale effects)
        - recommendations: array (tactical and strategic advice)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'ourMilitaryStrength', 'conflictType', 'objectives'
      ],
      optionalVariables: [
        'ourUnitComposition', 'ourTechnologyLevel', 'ourExperienceLevel', 'ourMorale',
        'ourSupplyStatus', 'enemyMilitaryStrength', 'enemyUnitComposition', 'enemyTechnologyLevel',
        'enemyExperienceLevel', 'terrain', 'weatherConditions', 'timeConstraints',
        'ourAllies', 'enemyAllies', 'allianceReliability'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 180000, // 3 minutes
      estimatedExecutionTime: 2500,
      memoryUsage: 60 * 1024 * 1024,
      complexity: 'high'
    });

    // Intelligence Assessment APT
    this.registerAPT({
      id: 'intelligence-assessment',
      name: 'Intelligence Assessment',
      description: 'Analyzes intelligence data and provides security recommendations',
      category: 'inter-civ',
      promptTemplate: `
        Analyze intelligence data and assess security situation:
        
        Intelligence Budget: {intelligenceBudget}
        Intelligence Capabilities: {intelligenceCapabilities}
        
        Gathered Intelligence:
        - Enemy Military Movements: {enemyMovements}
        - Diplomatic Intelligence: {diplomaticIntel}
        - Economic Intelligence: {economicIntel}
        - Technological Intelligence: {techIntel}
        - Internal Security Threats: {internalThreats}
        
        Current Operations:
        - Active Operations: {activeOperations}
        - Surveillance Networks: {surveillanceNetworks}
        - Counter-Intelligence Status: {counterIntelStatus}
        
        Regional Situation:
        - Neighboring Powers: {neighboringPowers}
        - Regional Tensions: {regionalTensions}
        - Alliance Intelligence Sharing: {allianceIntelSharing}
        
        Analyze and provide:
        1. Threat level assessment
        2. Intelligence gaps identification
        3. Counter-intelligence recommendations
        4. Early warning indicators
        5. Resource allocation for intelligence operations
        6. Security vulnerability assessment
        
        Respond in JSON format with:
        - threatLevelAssessment: object (current threat levels by category)
        - intelligenceGaps: array (critical information needs)
        - counterIntelligenceNeeds: array (defensive intelligence priorities)
        - earlyWarningIndicators: array (key indicators to monitor)
        - operationalRecommendations: array (suggested intelligence operations)
        - securityVulnerabilities: array (identified security weaknesses)
        - resourceRequirements: object (budget and capability needs)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'intelligenceBudget', 'intelligenceCapabilities'
      ],
      optionalVariables: [
        'enemyMovements', 'diplomaticIntel', 'economicIntel', 'techIntel', 'internalThreats',
        'activeOperations', 'surveillanceNetworks', 'counterIntelStatus', 'neighboringPowers',
        'regionalTensions', 'allianceIntelSharing'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.35,
      maxTokens: 1800,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 10000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 240000, // 4 minutes
      estimatedExecutionTime: 2000,
      memoryUsage: 55 * 1024 * 1024,
      complexity: 'medium'
    });

    // Military Strategy APT
    this.registerAPT({
      id: 'military-strategy-analysis',
      name: 'Military Strategy Analysis',
      description: 'Analyzes long-term military strategy and force development',
      category: 'civilization',
      promptTemplate: `
        Analyze military strategy and force development priorities:
        
        Current Military Status:
        - Military Strength: {militaryStrength}
        - Force Composition: {forceComposition}
        - Military Technology Level: {militaryTechnologyLevel}
        - Defense Spending: {defenseSpending}
        
        Strategic Environment:
        - Threat Assessment: {threatAssessment}
        - Geopolitical Situation: {geopoliticalSituation}
        - Alliance Relationships: {allianceRelationships}
        - Regional Security: {regionalSecurity}
        
        Military Capabilities:
        - Offensive Capabilities: {offensiveCapabilities}
        - Defensive Capabilities: {defensiveCapabilities}
        - Projection Capabilities: {projectionCapabilities}
        - Special Operations: {specialOperations}
        
        Resource Constraints:
        - Budget Limitations: {budgetLimitations}
        - Personnel Availability: {personnelAvailability}
        - Industrial Capacity: {industrialCapacity}
        - Technology Access: {technologyAccess}
        
        Strategic Objectives:
        - National Security Goals: {nationalSecurityGoals}
        - Military Doctrine: {militaryDoctrine}
        - Deterrence Strategy: {deterrenceStrategy}
        - Power Projection Needs: {powerProjectionNeeds}
        
        Analyze and recommend:
        1. Strategic military priorities
        2. Force structure optimization
        3. Technology investment priorities
        4. Alliance and partnership strategies
        5. Defense budget allocation
        6. Long-term capability development
        
        Respond in JSON format with:
        - strategicPriorities: array (key military development areas)
        - forceStructure: object (optimal military organization)
        - technologyInvestments: array (critical technology priorities)
        - allianceStrategy: object (partnership and cooperation approach)
        - budgetAllocation: object (defense spending optimization)
        - capabilityDevelopment: array (long-term military capabilities)
        - riskMitigation: array (strategic risk management)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'militaryStrength', 'threatAssessment', 'defenseSpending'
      ],
      optionalVariables: [
        'forceComposition', 'militaryTechnologyLevel', 'geopoliticalSituation',
        'allianceRelationships', 'regionalSecurity', 'offensiveCapabilities',
        'defensiveCapabilities', 'projectionCapabilities', 'specialOperations',
        'budgetLimitations', 'personnelAvailability', 'industrialCapacity',
        'technologyAccess', 'nationalSecurityGoals', 'militaryDoctrine',
        'deterrenceStrategy', 'powerProjectionNeeds'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 900000, // 15 minutes
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Comprehensive Threat Assessment APT
    this.registerAPT({
      id: 'comprehensive-threat-assessment',
      name: 'Comprehensive Threat Assessment',
      description: 'Analyzes security threats and vulnerability assessment',
      category: 'civilization',
      promptTemplate: `
        Conduct comprehensive threat assessment and security analysis:
        
        External Threats:
        - Military Threats: {militaryThreats}
        - Terrorist Threats: {terroristThreats}
        - Cyber Threats: {cyberThreats}
        - Economic Warfare: {economicWarfare}
        
        Internal Security:
        - Domestic Instability: {domesticInstability}
        - Criminal Organizations: {criminalOrganizations}
        - Social Unrest Risk: {socialUnrestRisk}
        - Institutional Vulnerabilities: {institutionalVulnerabilities}
        
        Threat Actors:
        - State Actors: {stateActors}
        - Non-State Actors: {nonStateActors}
        - Proxy Groups: {proxyGroups}
        - Criminal Networks: {criminalNetworks}
        
        Vulnerability Assessment:
        - Critical Infrastructure: {criticalInfrastructure}
        - Economic Vulnerabilities: {economicVulnerabilities}
        - Social Vulnerabilities: {socialVulnerabilities}
        - Technological Vulnerabilities: {technologicalVulnerabilities}
        
        Intelligence Capabilities:
        - Intelligence Collection: {intelligenceCollection}
        - Analysis Capabilities: {analysisCapabilities}
        - Early Warning Systems: {earlyWarningSystems}
        - Counter-Intelligence: {counterIntelligence}
        
        Analyze and recommend:
        1. Threat prioritization and risk assessment
        2. Vulnerability mitigation strategies
        3. Intelligence collection priorities
        4. Security enhancement measures
        5. Crisis prevention strategies
        6. Response capability requirements
        
        Respond in JSON format with:
        - threatPrioritization: array (ranked threat assessment)
        - vulnerabilityMitigation: object (security enhancement strategies)
        - intelligencePriorities: array (collection and analysis focus)
        - securityMeasures: array (protective and preventive measures)
        - crisisPrevention: object (early warning and prevention strategies)
        - responseCapabilities: array (crisis response requirements)
        - riskManagement: object (comprehensive risk management approach)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'militaryThreats', 'domesticInstability', 'criticalInfrastructure'
      ],
      optionalVariables: [
        'terroristThreats', 'cyberThreats', 'economicWarfare',
        'criminalOrganizations', 'socialUnrestRisk', 'institutionalVulnerabilities',
        'stateActors', 'nonStateActors', 'proxyGroups', 'criminalNetworks',
        'economicVulnerabilities', 'socialVulnerabilities', 'technologicalVulnerabilities',
        'intelligenceCollection', 'analysisCapabilities', 'earlyWarningSystems',
        'counterIntelligence'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2100,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 13000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 600000, // 10 minutes
      estimatedExecutionTime: 2800,
      memoryUsage: 65 * 1024 * 1024,
      complexity: 'high'
    });

    // Fleet Management APT
    this.registerAPT({
      id: 'fleet-management-optimization',
      name: 'Fleet Management Optimization',
      description: 'Analyzes space fleet composition and deployment strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze space fleet management and optimization strategies:
        
        Current Fleet Status:
        - Fleet Size: {fleetSize}
        - Ship Classes: {shipClasses}
        - Fleet Composition: {fleetComposition}
        - Operational Readiness: {operationalReadiness}
        
        Fleet Capabilities:
        - Combat Effectiveness: {combatEffectiveness}
        - Exploration Capabilities: {explorationCapabilities}
        - Transport Capacity: {transportCapacity}
        - Support Functions: {supportFunctions}
        
        Resource Management:
        - Maintenance Costs: {maintenanceCosts}
        - Fuel Consumption: {fuelConsumption}
        - Crew Requirements: {crewRequirements}
        - Upgrade Needs: {upgradeNeeds}
        
        Strategic Requirements:
        - Defense Needs: {defenseNeeds}
        - Exploration Missions: {explorationMissions}
        - Trade Protection: {tradeProtection}
        - Power Projection: {powerProjection}
        
        Operational Constraints:
        - Budget Limitations: {budgetLimitations}
        - Shipyard Capacity: {shipyardCapacity}
        - Personnel Availability: {personnelAvailability}
        - Technology Limitations: {technologyLimitations}
        
        Analyze and recommend:
        1. Optimal fleet composition
        2. Deployment strategies
        3. Modernization priorities
        4. Resource allocation optimization
        5. Operational efficiency improvements
        6. Future fleet development
        
        Respond in JSON format with:
        - optimalComposition: object (ideal fleet structure)
        - deploymentStrategy: array (fleet positioning and missions)
        - modernizationPlan: array (upgrade and replacement priorities)
        - resourceOptimization: object (cost and efficiency improvements)
        - operationalImprovements: array (efficiency enhancement measures)
        - futureDevelopment: object (long-term fleet evolution)
        - performanceMetrics: object (fleet effectiveness indicators)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'fleetSize', 'fleetComposition', 'combatEffectiveness'
      ],
      optionalVariables: [
        'shipClasses', 'operationalReadiness', 'explorationCapabilities',
        'transportCapacity', 'supportFunctions', 'maintenanceCosts',
        'fuelConsumption', 'crewRequirements', 'upgradeNeeds',
        'defenseNeeds', 'explorationMissions', 'tradeProtection',
        'powerProjection', 'budgetLimitations', 'shipyardCapacity',
        'personnelAvailability', 'technologyLimitations'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 1900,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 11000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 600000, // 10 minutes
      estimatedExecutionTime: 2400,
      memoryUsage: 58 * 1024 * 1024,
      complexity: 'high'
    });

    // Intelligence Analysis Synthesis APT
    this.registerAPT({
      id: 'intelligence-analysis-synthesis',
      name: 'Intelligence Analysis Synthesis',
      description: 'Analyzes intelligence data and provides strategic insights',
      category: 'civilization',
      promptTemplate: `
        Synthesize intelligence data and provide strategic analysis:
        
        Intelligence Sources:
        - Human Intelligence: {humanIntelligence}
        - Signals Intelligence: {signalsIntelligence}
        - Imagery Intelligence: {imageryIntelligence}
        - Open Source Intelligence: {openSourceIntelligence}
        
        Target Analysis:
        - Enemy Capabilities: {enemyCapabilities}
        - Enemy Intentions: {enemyIntentions}
        - Enemy Vulnerabilities: {enemyVulnerabilities}
        - Threat Timeline: {threatTimeline}
        
        Strategic Context:
        - Geopolitical Environment: {geopoliticalEnvironment}
        - Alliance Intelligence: {allianceIntelligence}
        - Economic Intelligence: {economicIntelligence}
        - Technological Intelligence: {technologicalIntelligence}
        
        Intelligence Gaps:
        - Information Needs: {informationNeeds}
        - Collection Priorities: {collectionPriorities}
        - Analysis Limitations: {analysisLimitations}
        - Verification Requirements: {verificationRequirements}
        
        Operational Security:
        - Source Protection: {sourceProtection}
        - Counterintelligence Threats: {counterintelligenceThreats}
        - Information Security: {informationSecurity}
        - Operational Exposure: {operationalExposure}
        
        Analyze and provide:
        1. Strategic intelligence assessment
        2. Threat analysis and predictions
        3. Opportunity identification
        4. Intelligence collection recommendations
        5. Risk assessment and warnings
        6. Decision support insights
        
        Respond in JSON format with:
        - strategicAssessment: object (comprehensive intelligence picture)
        - threatAnalysis: array (identified threats and predictions)
        - opportunities: array (strategic opportunities identified)
        - collectionRecommendations: array (intelligence gathering priorities)
        - riskWarnings: array (potential risks and early warnings)
        - decisionSupport: object (actionable intelligence insights)
        - confidenceLevel: object (reliability assessment of intelligence)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'humanIntelligence', 'enemyCapabilities', 'geopoliticalEnvironment'
      ],
      optionalVariables: [
        'signalsIntelligence', 'imageryIntelligence', 'openSourceIntelligence',
        'enemyIntentions', 'enemyVulnerabilities', 'threatTimeline',
        'allianceIntelligence', 'economicIntelligence', 'technologicalIntelligence',
        'informationNeeds', 'collectionPriorities', 'analysisLimitations',
        'verificationRequirements', 'sourceProtection', 'counterintelligenceThreats',
        'informationSecurity', 'operationalExposure'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes (intelligence changes quickly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Defense Budget Optimization APT
    this.registerAPT({
      id: 'defense-budget-optimization',
      name: 'Defense Budget Optimization',
      description: 'Analyzes defense spending allocation and optimization strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze defense budget allocation and optimization strategies:
        
        Current Budget Status:
        - Total Defense Budget: {totalDefenseBudget}
        - Budget as % of GDP: {budgetGdpPercentage}
        - Budget Growth Trend: {budgetGrowthTrend}
        - Funding Sources: {fundingSources}
        
        Spending Categories:
        - Personnel Costs: {personnelCosts}
        - Equipment Procurement: {equipmentProcurement}
        - Research & Development: {researchDevelopment}
        - Operations & Maintenance: {operationsMaintenance}
        - Infrastructure: {infrastructure}
        
        Strategic Priorities:
        - Threat Response Needs: {threatResponseNeeds}
        - Capability Gaps: {capabilityGaps}
        - Modernization Requirements: {modernizationRequirements}
        - Readiness Levels: {readinessLevels}
        
        Resource Constraints:
        - Economic Limitations: {economicLimitations}
        - Political Constraints: {politicalConstraints}
        - Competing Priorities: {competingPriorities}
        - Efficiency Challenges: {efficiencyChallenges}
        
        Performance Metrics:
        - Cost Effectiveness: {costEffectiveness}
        - Capability Delivered: {capabilityDelivered}
        - Readiness Achieved: {readinessAchieved}
        - Innovation Impact: {innovationImpact}
        
        Analyze and recommend:
        1. Budget allocation optimization
        2. Cost-effectiveness improvements
        3. Priority investment areas
        4. Efficiency enhancement measures
        5. Long-term budget planning
        6. Risk management strategies
        
        Respond in JSON format with:
        - budgetOptimization: object (optimal spending allocation)
        - costEffectiveness: array (efficiency improvement measures)
        - investmentPriorities: array (critical funding areas)
        - efficiencyMeasures: array (cost reduction strategies)
        - longTermPlanning: object (multi-year budget strategy)
        - riskManagement: array (budget risk mitigation)
        - performanceTargets: object (budget effectiveness goals)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'totalDefenseBudget', 'personnelCosts', 'threatResponseNeeds'
      ],
      optionalVariables: [
        'budgetGdpPercentage', 'budgetGrowthTrend', 'fundingSources',
        'equipmentProcurement', 'researchDevelopment', 'operationsMaintenance',
        'infrastructure', 'capabilityGaps', 'modernizationRequirements',
        'readinessLevels', 'economicLimitations', 'politicalConstraints',
        'competingPriorities', 'efficiencyChallenges', 'costEffectiveness',
        'capabilityDelivered', 'readinessAchieved', 'innovationImpact'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 1800,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 10000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 900000, // 15 minutes
      estimatedExecutionTime: 2200,
      memoryUsage: 55 * 1024 * 1024,
      complexity: 'medium'
    });

    // Conflict Resolution APT
    this.registerAPT({
      id: 'conflict-resolution-strategy',
      name: 'Conflict Resolution Strategy',
      description: 'Analyzes diplomatic and military conflict resolution approaches',
      category: 'inter-civ',
      promptTemplate: `
        Analyze conflict resolution strategies and diplomatic solutions:
        
        Conflict Context:
        - Conflict Type: {conflictType}
        - Conflict Intensity: {conflictIntensity}
        - Conflict Duration: {conflictDuration}
        - Root Causes: {rootCauses}
        
        Parties Involved:
        - Primary Adversaries: {primaryAdversaries}
        - Allied Parties: {alliedParties}
        - Neutral Parties: {neutralParties}
        - Mediating Actors: {mediatingActors}
        
        Stakes and Interests:
        - Our Core Interests: {ourCoreInterests}
        - Adversary Interests: {adversaryInterests}
        - Shared Interests: {sharedInterests}
        - Non-Negotiable Issues: {nonNegotiableIssues}
        
        Resolution Options:
        - Diplomatic Solutions: {diplomaticSolutions}
        - Economic Incentives: {economicIncentives}
        - Military Pressure: {militaryPressure}
        - Third-Party Mediation: {thirdPartyMediation}
        
        Constraints and Opportunities:
        - Time Pressures: {timePressures}
        - Resource Limitations: {resourceLimitations}
        - Political Constraints: {politicalConstraints}
        - International Opinion: {internationalOpinion}
        
        Analyze and recommend:
        1. Optimal resolution strategy
        2. Negotiation approach and tactics
        3. Concession and compromise options
        4. Escalation and de-escalation measures
        5. Implementation and monitoring plans
        6. Contingency strategies
        
        Respond in JSON format with:
        - resolutionStrategy: object (comprehensive conflict resolution approach)
        - negotiationTactics: array (diplomatic negotiation strategies)
        - compromiseOptions: array (potential concessions and trade-offs)
        - escalationManagement: object (escalation control measures)
        - implementationPlan: object (resolution execution strategy)
        - contingencyPlans: array (alternative approaches if primary fails)
        - successProbability: number (0-1)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'conflictType', 'primaryAdversaries', 'ourCoreInterests'
      ],
      optionalVariables: [
        'conflictIntensity', 'conflictDuration', 'rootCauses',
        'alliedParties', 'neutralParties', 'mediatingActors',
        'adversaryInterests', 'sharedInterests', 'nonNegotiableIssues',
        'diplomaticSolutions', 'economicIncentives', 'militaryPressure',
        'thirdPartyMediation', 'timePressures', 'resourceLimitations',
        'politicalConstraints', 'internationalOpinion'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes (conflict situations change rapidly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Military Logistics Optimization APT
    this.registerAPT({
      id: 'military-logistics-optimization',
      name: 'Military Logistics Optimization',
      description: 'Analyzes military supply chains and logistics optimization strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze military supply chains and logistics optimization strategies:
        
        Supply Chain Assessment:
        - Supply Lines: {supplyLines}
        - Resource Availability: {resourceAvailability}
        - Transportation Networks: {transportationNetworks}
        - Storage Capacity: {storageCapacity}
        
        Logistics Operations:
        - Distribution Efficiency: {distributionEfficiency}
        - Inventory Management: {inventoryManagement}
        - Procurement Processes: {procurementProcesses}
        - Maintenance Systems: {maintenanceSystems}
        
        Strategic Considerations:
        - Operational Range: {operationalRange}
        - Deployment Speed: {deploymentSpeed}
        - Sustainability Factors: {sustainabilityFactors}
        - Risk Mitigation: {riskMitigation}
        
        Analyze and optimize:
        1. Supply chain efficiency and reliability
        2. Logistics network optimization
        3. Resource allocation and distribution
        4. Strategic deployment capabilities
        5. Risk management and contingency planning
        6. Operational sustainability and maintenance
        
        Respond in JSON format with logistics optimization recommendations.
      `,
      requiredVariables: [
        'supplyLines', 'resourceAvailability', 'distributionEfficiency'
      ],
      optionalVariables: [
        'transportationNetworks', 'storageCapacity', 'inventoryManagement',
        'procurementProcesses', 'maintenanceSystems', 'operationalRange',
        'deploymentSpeed', 'sustainabilityFactors', 'riskMitigation'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 600000, // 10 minutes
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Military Training and Readiness APT
    this.registerAPT({
      id: 'military-training-readiness',
      name: 'Military Training and Readiness',
      description: 'Analyzes military training programs and force readiness optimization',
      category: 'civilization',
      promptTemplate: `
        Analyze military training programs and force readiness optimization:
        
        Training Assessment:
        - Training Programs: {trainingPrograms}
        - Skill Development: {skillDevelopment}
        - Combat Readiness: {combatReadiness}
        - Specialized Training: {specializedTraining}
        
        Force Readiness:
        - Personnel Readiness: {personnelReadiness}
        - Equipment Status: {equipmentStatus}
        - Operational Capability: {operationalCapability}
        - Response Time: {responseTime}
        
        Training Infrastructure:
        - Training Facilities: {trainingFacilities}
        - Simulation Systems: {simulationSystems}
        - Instructor Quality: {instructorQuality}
        - Resource Allocation: {resourceAllocation}
        
        Performance Metrics:
        - Competency Levels: {competencyLevels}
        - Mission Success Rates: {missionSuccessRates}
        - Adaptation Capability: {adaptationCapability}
        - Continuous Improvement: {continuousImprovement}
        
        Analyze and optimize:
        1. Training program effectiveness and efficiency
        2. Force readiness and operational capability
        3. Infrastructure and resource optimization
        4. Performance measurement and improvement
        5. Specialized skill development programs
        6. Continuous training and adaptation strategies
        
        Respond in JSON format with training and readiness optimization recommendations.
      `,
      requiredVariables: [
        'trainingPrograms', 'combatReadiness', 'personnelReadiness'
      ],
      optionalVariables: [
        'skillDevelopment', 'specializedTraining', 'equipmentStatus',
        'operationalCapability', 'responseTime', 'trainingFacilities',
        'simulationSystems', 'instructorQuality', 'resourceAllocation',
        'competencyLevels', 'missionSuccessRates', 'adaptationCapability',
        'continuousImprovement'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 600000, // 10 minutes
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });
  }

  protected async executeSystem(context: APIExecutionContext): Promise<MilitarySystemResult> {
    console.log(`⚔️ Executing Military System for civilization: ${context.civilizationContext?.id || 'unknown'}`);
    
    const civContext = context.civilizationContext;
    if (!civContext) {
      throw new Error('Military system requires civilization context');
    }

    // Execute military analysis and operations
    const [
      strategicAnalysisResult,
      combatPredictionResult,
      intelligenceAssessmentResult,
      militaryData
    ] = await Promise.all([
      this.executeStrategicMilitaryAnalysis(context),
      this.executeCombatOutcomePrediction(context),
      this.executeIntelligenceAssessment(context),
      this.calculateMilitaryData(civContext)
    ]);

    // Process combat operations
    const combatResults = await this.processCombatOperations(civContext, context);
    
    // Update intelligence operations
    const intelligenceOperations = await this.updateIntelligenceOperations(civContext, context);
    
    // Generate military events
    const militaryEvents = this.generateMilitaryEvents(
      strategicAnalysisResult,
      combatPredictionResult,
      intelligenceAssessmentResult
    );

    return {
      gameStateUpdates: {
        militaryData: {
          totalMilitaryStrength: militaryData.totalMilitaryStrength,
          activeConflicts: militaryData.activeConflicts,
          militaryUnits: militaryData.militaryUnits,
          defensiveCapability: militaryData.defensiveCapability,
          offensiveCapability: militaryData.offensiveCapability,
          alliances: militaryData.alliances,
          threatLevel: militaryData.threatLevel
        },
        diplomaticRelations: militaryData.diplomaticRelations,
        intelligenceReports: intelligenceOperations
      },
      systemOutputs: {
        combatResults,
        strategicAnalysis: strategicAnalysisResult,
        threatAssessment: intelligenceAssessmentResult,
        militaryRecommendations: strategicAnalysisResult?.strategicRecommendations || [],
        intelligenceOperations
      },
      eventsGenerated: militaryEvents,
      scheduledActions: []
    };
  }

  protected isRelevantEvent(event: GameEvent, context: APIExecutionContext): boolean {
    const relevantEventTypes = [
      'war_declaration',
      'peace_treaty',
      'alliance_formed',
      'alliance_broken',
      'military_buildup',
      'border_incident',
      'terrorist_attack',
      'coup_attempt',
      'revolution',
      'military_technology_breakthrough',
      'intelligence_operation',
      'diplomatic_crisis',
      'trade_embargo',
      'nuclear_test',
      'military_exercise'
    ];
    
    return relevantEventTypes.includes(event.type);
  }

  // ============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // ============================================================================

  private async executeStrategicMilitaryAnalysis(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      militaryBudget: this.getKnob('military_budget'),
      totalMilitaryStrength: this.calculateMilitaryStrength(civContext),
      defensiveCapability: this.calculateDefensiveCapability(civContext),
      offensiveCapability: this.calculateOffensiveCapability(civContext),
      militaryTechnologyLevel: civContext.technologyData?.militaryTech || 50,
      militaryPersonnel: this.calculateMilitaryPersonnel(civContext),
      activeConflicts: civContext.activeConflicts || [],
      neighboringCivs: this.getNeighboringCivilizations(civContext),
      allianceStatus: civContext.alliances || [],
      currentThreats: this.assessCurrentThreats(civContext),
      recentMilitaryEvents: civContext.recentEvents?.filter(e => 
        ['war_declaration', 'military_buildup', 'border_incident'].includes(e.type)
      ).slice(-3) || [],
      gdp: civContext.economicData?.gdp || 0,
      economicGrowth: civContext.economicData?.gdpGrowthRate || 0,
      population: civContext.total_population,
      defensePriority: this.getKnob('defense_priority'),
      aggressionLevel: this.getKnob('aggression_level'),
      allianceCooperation: this.getKnob('alliance_cooperation')
    };

    try {
      return await this.executeAPT('strategic-military-analysis', variables, context, 'high');
    } catch (error) {
      console.warn('Strategic military analysis APT failed, using fallback:', error);
      return this.calculateFallbackStrategicAnalysis(civContext);
    }
  }

  private async executeCombatOutcomePrediction(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    // Only run if there are active conflicts or high threat level
    const activeConflicts = civContext.activeConflicts || [];
    const threatLevel = this.assessCurrentThreats(civContext).overallThreatLevel || 0;
    
    if (activeConflicts.length === 0 && threatLevel < 0.3) {
      return null; // No combat prediction needed
    }

    const variables = {
      ourMilitaryStrength: this.calculateMilitaryStrength(civContext),
      ourUnitComposition: this.getMilitaryUnitComposition(civContext),
      ourTechnologyLevel: civContext.technologyData?.militaryTech || 50,
      ourExperienceLevel: this.calculateMilitaryExperience(civContext),
      ourMorale: this.calculateMilitaryMorale(civContext),
      ourSupplyStatus: this.calculateSupplyStatus(civContext),
      conflictType: activeConflicts[0]?.type || 'border_skirmish',
      objectives: activeConflicts[0]?.objectives || ['territorial_defense'],
      terrain: civContext.geographyData?.terrain || 'mixed',
      weatherConditions: 'normal',
      ourAllies: civContext.alliances?.filter(a => a.type === 'military') || [],
      allianceReliability: this.calculateAllianceReliability(civContext)
    };

    // Add enemy data if available
    if (activeConflicts.length > 0 && activeConflicts[0].opponent) {
      const enemy = activeConflicts[0].opponent;
      variables['enemyMilitaryStrength'] = enemy.militaryStrength || 0;
      variables['enemyUnitComposition'] = enemy.unitComposition || {};
      variables['enemyTechnologyLevel'] = enemy.technologyLevel || 50;
      variables['enemyExperienceLevel'] = enemy.experienceLevel || 0.5;
    }

    try {
      return await this.executeAPT('combat-outcome-prediction', variables, context, 'high');
    } catch (error) {
      console.warn('Combat outcome prediction APT failed, using fallback:', error);
      return this.calculateFallbackCombatPrediction(civContext);
    }
  }

  private async executeIntelligenceAssessment(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      intelligenceBudget: this.getKnob('intelligence_budget') * this.getKnob('military_budget') * (civContext.economicData?.gdp || 0),
      intelligenceCapabilities: this.calculateIntelligenceCapabilities(civContext),
      enemyMovements: this.getEnemyMovementIntel(civContext),
      diplomaticIntel: this.getDiplomaticIntel(civContext),
      economicIntel: this.getEconomicIntel(civContext),
      techIntel: this.getTechnologicalIntel(civContext),
      internalThreats: this.assessInternalThreats(civContext),
      activeOperations: civContext.intelligenceOperations || [],
      surveillanceNetworks: this.getSurveillanceNetworks(civContext),
      counterIntelStatus: this.getCounterIntelligenceStatus(civContext),
      neighboringPowers: this.getNeighboringCivilizations(civContext),
      regionalTensions: this.assessRegionalTensions(civContext),
      allianceIntelSharing: this.getAllianceIntelligenceSharing(civContext)
    };

    try {
      return await this.executeAPT('intelligence-assessment', variables, context, 'medium');
    } catch (error) {
      console.warn('Intelligence assessment APT failed, using fallback:', error);
      return this.calculateFallbackIntelligenceAssessment(civContext);
    }
  }

  private async calculateMilitaryData(civContext: any): Promise<any> {
    const militaryBudget = this.getKnob('military_budget') * (civContext.economicData?.gdp || 0);
    const militaryStrength = this.calculateMilitaryStrength(civContext);
    
    return {
      totalMilitaryStrength: militaryStrength,
      activeConflicts: civContext.activeConflicts || [],
      militaryUnits: this.getMilitaryUnits(civContext),
      defensiveCapability: this.calculateDefensiveCapability(civContext),
      offensiveCapability: this.calculateOffensiveCapability(civContext),
      alliances: civContext.alliances?.filter(a => a.type === 'military') || [],
      threatLevel: this.assessCurrentThreats(civContext).overallThreatLevel || 0,
      diplomaticRelations: civContext.diplomaticRelations || [],
      militaryBudget,
      personnelCount: this.calculateMilitaryPersonnel(civContext)
    };
  }

  private async processCombatOperations(civContext: any, context: APIExecutionContext): Promise<any[]> {
    // This would integrate with the WarSimulatorService
    // For now, return simulated combat results
    
    const activeConflicts = civContext.activeConflicts || [];
    const results = [];
    
    for (const conflict of activeConflicts) {
      results.push({
        conflictId: conflict.id,
        type: conflict.type,
        outcome: 'ongoing',
        casualties: {
          friendly: Math.floor(Math.random() * 100),
          enemy: Math.floor(Math.random() * 150)
        },
        territoryChange: 0,
        duration: conflict.duration || 1
      });
    }
    
    return results;
  }

  private async updateIntelligenceOperations(civContext: any, context: APIExecutionContext): Promise<any[]> {
    const intelligenceBudget = this.getKnob('intelligence_budget') * this.getKnob('military_budget') * (civContext.economicData?.gdp || 0);
    
    return [
      {
        operationType: 'surveillance',
        target: 'neighboring_powers',
        status: 'active',
        effectiveness: 0.7,
        cost: intelligenceBudget * 0.3
      },
      {
        operationType: 'counter_intelligence',
        target: 'internal_security',
        status: 'active',
        effectiveness: 0.8,
        cost: intelligenceBudget * 0.4
      }
    ];
  }

  private generateMilitaryEvents(
    strategicResult: any,
    combatResult: any,
    intelligenceResult: any
  ): GameEvent[] {
    const events: GameEvent[] = [];
    
    // Generate events based on analysis results
    if (strategicResult?.threatAnalysis?.overallThreatLevel > 0.7) {
      events.push({
        id: `military_threat_${Date.now()}`,
        type: 'military_threat_detected',
        source: 'military_system',
        data: {
          threatLevel: strategicResult.threatAnalysis.overallThreatLevel,
          threats: strategicResult.threatAnalysis.identifiedThreats || []
        },
        timestamp: new Date(),
        priority: 'high',
        processed: false
      });
    }
    
    if (combatResult?.outcomeProbabilities?.win < 0.3) {
      events.push({
        id: `military_disadvantage_${Date.now()}`,
        type: 'military_disadvantage',
        source: 'military_system',
        data: {
          winProbability: combatResult.outcomeProbabilities.win,
          recommendations: combatResult.recommendations || []
        },
        timestamp: new Date(),
        priority: 'critical',
        processed: false
      });
    }
    
    if (intelligenceResult?.securityVulnerabilities?.length > 0) {
      events.push({
        id: `security_vulnerability_${Date.now()}`,
        type: 'security_vulnerability_detected',
        source: 'military_system',
        data: {
          vulnerabilities: intelligenceResult.securityVulnerabilities,
          recommendations: intelligenceResult.operationalRecommendations || []
        },
        timestamp: new Date(),
        priority: 'medium',
        processed: false
      });
    }
    
    return events;
  }

  // Calculation helper methods
  private calculateMilitaryStrength(civContext: any): number {
    const militaryBudget = this.getKnob('military_budget') * (civContext.economicData?.gdp || 0);
    const population = civContext.total_population;
    const recruitmentRate = this.getKnob('military_recruitment_rate');
    const technologyMultiplier = 1 + (civContext.technologyData?.militaryTech || 50) / 100;
    
    return militaryBudget * recruitmentRate * population * technologyMultiplier / 1000000;
  }

  private calculateDefensiveCapability(civContext: any): number {
    const baseStrength = this.calculateMilitaryStrength(civContext);
    const defensePriority = this.getKnob('defense_priority');
    const doctrine = this.getKnob('defensive_doctrine');
    
    let doctrineMultiplier = 1.0;
    switch (doctrine) {
      case 'fortress': doctrineMultiplier = 1.3; break;
      case 'mobile_defense': doctrineMultiplier = 1.1; break;
      case 'forward_defense': doctrineMultiplier = 0.9; break;
      default: doctrineMultiplier = 1.0;
    }
    
    return baseStrength * defensePriority * doctrineMultiplier;
  }

  private calculateOffensiveCapability(civContext: any): number {
    const baseStrength = this.calculateMilitaryStrength(civContext);
    const offensivePriority = 1 - this.getKnob('defense_priority');
    const doctrine = this.getKnob('offensive_doctrine');
    
    let doctrineMultiplier = 1.0;
    switch (doctrine) {
      case 'blitzkrieg': doctrineMultiplier = 1.2; break;
      case 'combined_arms': doctrineMultiplier = 1.1; break;
      case 'attrition': doctrineMultiplier = 0.9; break;
      case 'asymmetric': doctrineMultiplier = 1.0; break;
    }
    
    return baseStrength * offensivePriority * doctrineMultiplier;
  }

  private calculateMilitaryPersonnel(civContext: any): number {
    return civContext.total_population * this.getKnob('military_recruitment_rate');
  }

  // Fallback calculation methods
  private calculateFallbackStrategicAnalysis(civContext: any): any {
    return {
      militaryPosition: {
        strength: 'moderate',
        readiness: 0.7,
        sustainability: 0.6
      },
      threatAnalysis: {
        overallThreatLevel: 0.3,
        identifiedThreats: ['border_tensions']
      },
      strategicRecommendations: [
        'Maintain current force levels',
        'Improve intelligence capabilities',
        'Strengthen alliance relationships'
      ],
      forceStructureAdvice: {
        priorityUnits: ['infantry', 'air_defense'],
        modernizationNeeds: ['communications', 'logistics']
      },
      diplomaticStrategy: {
        allianceRecommendations: ['strengthen_existing'],
        negotiationPriorities: ['border_agreements']
      },
      resourceAllocation: {
        budgetRecommendations: {
          personnel: 0.6,
          equipment: 0.25,
          research: 0.15
        }
      },
      conflictProbabilities: {
        majorWar: 0.1,
        limitedConflict: 0.2,
        borderSkirmish: 0.3
      },
      confidence: 0.4
    };
  }

  private calculateFallbackCombatPrediction(civContext: any): any {
    return {
      outcomeProbabilities: {
        win: 0.5,
        lose: 0.3,
        stalemate: 0.2
      },
      casualtyEstimates: {
        friendly: 1000,
        enemy: 1200,
        civilian: 500
      },
      conflictDuration: {
        minimum: 30,
        expected: 90,
        maximum: 180
      },
      economicImpact: {
        directCost: (civContext.economicData?.gdp || 0) * 0.05,
        indirectCost: (civContext.economicData?.gdp || 0) * 0.03
      },
      strategicConsequences: {
        territorialChange: 0,
        diplomaticImpact: 'moderate',
        allianceEffects: 'neutral'
      },
      civilianImpact: {
        populationEffect: -0.01,
        moraleEffect: -0.1
      },
      recommendations: [
        'Ensure adequate supply lines',
        'Coordinate with allies',
        'Prepare for extended conflict'
      ],
      confidence: 0.3
    };
  }

  private calculateFallbackIntelligenceAssessment(civContext: any): any {
    return {
      threatLevelAssessment: {
        military: 0.3,
        economic: 0.2,
        cyber: 0.4,
        internal: 0.1
      },
      intelligenceGaps: [
        'Enemy force disposition',
        'Technological capabilities',
        'Alliance intentions'
      ],
      counterIntelligenceNeeds: [
        'Communications security',
        'Personnel screening',
        'Facility protection'
      ],
      earlyWarningIndicators: [
        'Military mobilization',
        'Diplomatic tensions',
        'Economic sanctions'
      ],
      operationalRecommendations: [
        'Increase surveillance of borders',
        'Enhance cyber security',
        'Improve intelligence sharing with allies'
      ],
      securityVulnerabilities: [
        'Communications interception',
        'Border security gaps'
      ],
      resourceRequirements: {
        budgetIncrease: 0.1,
        personnelNeeds: 50,
        technologyUpgrades: ['encryption', 'surveillance']
      },
      confidence: 0.5
    };
  }

  // Additional helper methods for military calculations
  private getMilitaryUnitComposition(civContext: any): any {
    return {
      infantry: 0.6,
      armor: 0.2,
      artillery: 0.1,
      airForce: 0.05,
      navy: 0.05
    };
  }

  private calculateMilitaryExperience(civContext: any): number {
    const veteranRetention = this.getKnob('veteran_retention');
    const recentConflicts = (civContext.recentEvents || []).filter(e => 
      ['war_declaration', 'border_incident'].includes(e.type)
    ).length;
    
    return Math.min(1.0, veteranRetention + (recentConflicts * 0.1));
  }

  private calculateMilitaryMorale(civContext: any): number {
    const trainingIntensity = this.getKnob('military_training_intensity');
    const economicConditions = Math.min(1.0, (civContext.economicData?.gdpGrowthRate || 0) + 0.5);
    const populationSupport = 0.7; // Would be calculated from population happiness
    
    return (trainingIntensity + economicConditions + populationSupport) / 3;
  }

  private calculateSupplyStatus(civContext: any): number {
    const militaryBudget = this.getKnob('military_budget') * (civContext.economicData?.gdp || 0);
    const personnelCount = this.calculateMilitaryPersonnel(civContext);
    const supplyPerPerson = militaryBudget / personnelCount;
    
    return Math.min(1.0, supplyPerPerson / 10000); // $10k per person baseline
  }

  private getNeighboringCivilizations(civContext: any): any[] {
    // Would return actual neighboring civilizations
    return civContext.neighbors || [];
  }

  private assessCurrentThreats(civContext: any): any {
    const recentEvents = civContext.recentEvents || [];
    const militaryEvents = recentEvents.filter(e => 
      ['war_declaration', 'military_buildup', 'border_incident', 'alliance_broken'].includes(e.type)
    );
    
    return {
      overallThreatLevel: Math.min(1.0, militaryEvents.length * 0.2),
      identifiedThreats: militaryEvents.map(e => e.type)
    };
  }

  private calculateAllianceReliability(civContext: any): number {
    const alliances = civContext.alliances || [];
    const cooperationLevel = this.getKnob('alliance_cooperation');
    
    return alliances.length > 0 ? cooperationLevel : 0;
  }

  private getMilitaryUnits(civContext: any): any[] {
    // Would return actual military units
    return [];
  }

  private calculateIntelligenceCapabilities(civContext: any): any {
    const budget = this.getKnob('intelligence_budget') * this.getKnob('military_budget') * (civContext.economicData?.gdp || 0);
    const technologyLevel = civContext.technologyData?.communicationsTech || 50;
    
    return {
      signals: technologyLevel / 100,
      human: 0.6,
      cyber: technologyLevel / 100,
      budget: budget
    };
  }

  // Intelligence data gathering methods (would integrate with actual intelligence systems)
  private getEnemyMovementIntel(civContext: any): any[] { return []; }
  private getDiplomaticIntel(civContext: any): any[] { return []; }
  private getEconomicIntel(civContext: any): any[] { return []; }
  private getTechnologicalIntel(civContext: any): any[] { return []; }
  private assessInternalThreats(civContext: any): any[] { return []; }
  private getSurveillanceNetworks(civContext: any): any[] { return []; }
  private getCounterIntelligenceStatus(civContext: any): any { return { effectiveness: 0.7 }; }
  private assessRegionalTensions(civContext: any): any { return { level: 0.3 }; }
  private getAllianceIntelligenceSharing(civContext: any): any { return { active: true, effectiveness: 0.6 }; }
}
