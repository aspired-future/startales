import { BaseAPI } from '../BaseAPI';
import { APIExecutionContext, APIExecutionResult, APIKnobDefinition } from '../types';
import { DatabasePool } from 'pg';

// Inter-civilization system result interface
interface InterCivilizationSystemResult extends APIExecutionResult {
  gameStateUpdates: {
    diplomaticRelations: Record<string, {
      relationshipType: string;
      trustLevel: number;
      tradeVolume: number;
      militaryTensions: number;
      culturalExchange: number;
      activeAgreements: string[];
    }>;
    activeConflicts: Array<{
      id: string;
      participants: string[];
      conflictType: string;
      intensity: number;
      duration: number;
      casualties: number;
    }>;
    tradeNetworks: Array<{
      id: string;
      participants: string[];
      tradeVolume: number;
      primaryGoods: string[];
      tradeBalance: Record<string, number>;
    }>;
    alliances: Array<{
      id: string;
      members: string[];
      allianceType: string;
      strength: number;
      obligations: string[];
    }>;
  };
  systemOutputs: {
    diplomaticRecommendations: any[];
    conflictAnalysis: any[];
    tradeOpportunities: any[];
    allianceStrategies: any[];
  };
}

export class InterCivilizationAPI extends BaseAPI {
  private databasePool: DatabasePool;

  constructor(databasePool: DatabasePool) {
    const config = {
      id: 'inter-civilization-api',
      name: 'Inter-Civilization API',
      description: 'Manages diplomacy, warfare, trade, and interactions between civilizations',
      version: '1.0.0',
      category: 'inter-civ',
      
      // Inter-civilization specific knobs
      knobs: new Map<string, APIKnobDefinition>([
        ['diplomaticAggressiveness', {
          type: 'number',
          defaultValue: 0.5,
          min: 0.0,
          max: 1.0,
          description: 'Level of diplomatic assertiveness in negotiations'
        }],
        ['tradeOpenness', {
          type: 'number',
          defaultValue: 1.0,
          min: 0.0,
          max: 2.0,
          description: 'Openness to international trade and economic cooperation'
        }],
        ['militaryPosture', {
          type: 'enum',
          defaultValue: 'defensive',
          enumValues: ['pacifist', 'defensive', 'balanced', 'aggressive'],
          description: 'Overall military stance toward other civilizations'
        }],
        ['allianceReliability', {
          type: 'number',
          defaultValue: 1.0,
          min: 0.1,
          max: 2.0,
          description: 'Reliability in honoring alliance commitments and agreements'
        }],
        ['culturalExchangeEmphasis', {
          type: 'number',
          defaultValue: 1.0,
          min: 0.0,
          max: 2.0,
          description: 'Emphasis on cultural exchange and soft power projection'
        }],
        ['conflictEscalationTolerance', {
          type: 'number',
          defaultValue: 0.3,
          min: 0.0,
          max: 1.0,
          description: 'Tolerance for conflict escalation before seeking resolution'
        }],
        ['economicIntegrationLevel', {
          type: 'number',
          defaultValue: 1.0,
          min: 0.1,
          max: 2.0,
          description: 'Level of economic integration with other civilizations'
        }],
        ['informationSharing', {
          type: 'enum',
          defaultValue: 'selective',
          enumValues: ['minimal', 'selective', 'open'],
          description: 'Level of information sharing with other civilizations'
        }],
        ['territorialAmbitions', {
          type: 'number',
          defaultValue: 0.5,
          min: 0.0,
          max: 1.0,
          description: 'Level of territorial expansion ambitions'
        }],
        ['peacekeepingCommitment', {
          type: 'number',
          defaultValue: 1.0,
          min: 0.0,
          max: 2.0,
          description: 'Commitment to peacekeeping and conflict prevention'
        }],
        ['technologicalCooperation', {
          type: 'number',
          defaultValue: 1.0,
          min: 0.0,
          max: 2.0,
          description: 'Level of technological cooperation and knowledge sharing'
        }],
        ['immigrationPolicy', {
          type: 'enum',
          defaultValue: 'moderate',
          enumValues: ['restrictive', 'moderate', 'open'],
          description: 'Immigration policy toward other civilizations'
        }]
      ])
    };

    super(config);
    this.databasePool = databasePool;

    // Diplomatic Strategy APT
    this.registerAPT({
      id: 'diplomatic-strategy-analysis',
      name: 'Diplomatic Strategy Analysis',
      description: 'Analyzes diplomatic strategies and international relationship management',
      category: 'inter-civ',
      promptTemplate: `
        Analyze diplomatic strategy and international relationship optimization:
        
        Current Diplomatic Status:
        - Diplomatic Relations: {diplomaticRelations}
        - International Reputation: {internationalReputation}
        - Diplomatic Influence: {diplomaticInfluence}
        - Active Negotiations: {activeNegotiations}
        
        Strategic Objectives:
        - Foreign Policy Goals: {foreignPolicyGoals}
        - Security Interests: {securityInterests}
        - Economic Interests: {economicInterests}
        - Cultural Objectives: {culturalObjectives}
        
        Relationship Analysis:
        - Allied Nations: {alliedNations}
        - Neutral Relations: {neutralRelations}
        - Hostile Relations: {hostileRelations}
        - Potential Partners: {potentialPartners}
        
        Diplomatic Resources:
        - Diplomatic Corps: {diplomaticCorps}
        - Soft Power Assets: {softPowerAssets}
        - Economic Leverage: {economicLeverage}
        - Military Backing: {militaryBacking}
        
        International Context:
        - Global Power Balance: {globalPowerBalance}
        - Regional Dynamics: {regionalDynamics}
        - International Organizations: {internationalOrganizations}
        - Emerging Threats: {emergingThreats}
        
        Analyze and recommend:
        1. Diplomatic strategy optimization
        2. Relationship building priorities
        3. Negotiation approaches and tactics
        4. Conflict prevention strategies
        5. Influence expansion methods
        6. International cooperation opportunities
        
        Respond in JSON format with:
        - strategyOptimization: object (diplomatic approach refinement)
        - relationshipPriorities: array (key relationship building targets)
        - negotiationTactics: array (effective negotiation strategies)
        - conflictPrevention: object (tension reduction and prevention measures)
        - influenceExpansion: array (soft power and influence building methods)
        - cooperationOpportunities: array (multilateral engagement possibilities)
        - riskMitigation: array (diplomatic risk management strategies)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'diplomaticRelations', 'foreignPolicyGoals', 'internationalReputation'
      ],
      optionalVariables: [
        'diplomaticInfluence', 'activeNegotiations', 'securityInterests',
        'economicInterests', 'culturalObjectives', 'alliedNations',
        'neutralRelations', 'hostileRelations', 'potentialPartners',
        'diplomaticCorps', 'softPowerAssets', 'economicLeverage',
        'militaryBacking', 'globalPowerBalance', 'regionalDynamics',
        'internationalOrganizations', 'emergingThreats'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2100,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 13000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes (diplomacy changes quickly)
      estimatedExecutionTime: 2800,
      memoryUsage: 65 * 1024 * 1024,
      complexity: 'high'
    });

    // Treaty Negotiation APT
    this.registerAPT({
      id: 'treaty-negotiation-strategy',
      name: 'Treaty Negotiation Strategy',
      description: 'Analyzes treaty negotiation strategies and agreement optimization',
      category: 'inter-civ',
      promptTemplate: `
        Analyze treaty negotiation strategies and agreement structuring:
        
        Negotiation Context:
        - Treaty Type: {treatyType}
        - Negotiating Parties: {negotiatingParties}
        - Negotiation Stage: {negotiationStage}
        - Time Constraints: {timeConstraints}
        
        Our Position:
        - Core Interests: {coreInterests}
        - Negotiable Items: {negotiableItems}
        - Red Lines: {redLines}
        - Bargaining Power: {bargainingPower}
        
        Other Parties:
        - Their Interests: {theirInterests}
        - Their Constraints: {theirConstraints}
        - Their Alternatives: {theirAlternatives}
        - Power Dynamics: {powerDynamics}
        
        Agreement Structure:
        - Key Provisions: {keyProvisions}
        - Implementation Mechanisms: {implementationMechanisms}
        - Monitoring Systems: {monitoringSystems}
        - Dispute Resolution: {disputeResolution}
        
        Strategic Considerations:
        - Long-term Implications: {longTermImplications}
        - Precedent Effects: {precedentEffects}
        - Domestic Considerations: {domesticConsiderations}
        - International Reactions: {internationalReactions}
        
        Analyze and recommend:
        1. Optimal negotiation strategy
        2. Concession and trade-off analysis
        3. Agreement structure optimization
        4. Implementation planning
        5. Risk assessment and mitigation
        6. Alternative scenario preparation
        
        Respond in JSON format with:
        - negotiationStrategy: object (optimal negotiation approach)
        - concessionAnalysis: array (strategic concession and trade-off options)
        - agreementStructure: object (optimal treaty structure and provisions)
        - implementationPlan: array (execution and monitoring strategies)
        - riskAssessment: object (potential risks and mitigation measures)
        - alternativeScenarios: array (backup strategies and BATNA options)
        - successProbability: number (0-1)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'treatyType', 'negotiatingParties', 'coreInterests'
      ],
      optionalVariables: [
        'negotiationStage', 'timeConstraints', 'negotiableItems',
        'redLines', 'bargainingPower', 'theirInterests', 'theirConstraints',
        'theirAlternatives', 'powerDynamics', 'keyProvisions',
        'implementationMechanisms', 'monitoringSystems', 'disputeResolution',
        'longTermImplications', 'precedentEffects', 'domesticConsiderations',
        'internationalReactions'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 180000, // 3 minutes (negotiations change rapidly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Alliance Formation APT
    this.registerAPT({
      id: 'alliance-formation-strategy',
      name: 'Alliance Formation Strategy',
      description: 'Analyzes alliance formation opportunities and partnership strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze alliance formation opportunities and strategic partnerships:
        
        Strategic Environment:
        - Security Threats: {securityThreats}
        - Power Balance: {powerBalance}
        - Regional Dynamics: {regionalDynamics}
        - Emerging Challenges: {emergingChallenges}
        
        Potential Partners:
        - Compatible Nations: {compatibleNations}
        - Shared Interests: {sharedInterests}
        - Complementary Strengths: {complementaryStrengths}
        - Reliability Assessment: {reliabilityAssessment}
        
        Alliance Options:
        - Military Alliances: {militaryAlliances}
        - Economic Partnerships: {economicPartnerships}
        - Cultural Agreements: {culturalAgreements}
        - Technology Cooperation: {technologyCooperation}
        
        Our Capabilities:
        - Military Strength: {militaryStrength}
        - Economic Resources: {economicResources}
        - Technological Assets: {technologicalAssets}
        - Diplomatic Influence: {diplomaticInfluence}
        
        Alliance Structure:
        - Leadership Models: {leadershipModels}
        - Decision Making: {decisionMaking}
        - Resource Sharing: {resourceSharing}
        - Commitment Levels: {commitmentLevels}
        
        Analyze and recommend:
        1. Optimal alliance strategy
        2. Partner selection and prioritization
        3. Alliance structure design
        4. Negotiation and formation process
        5. Risk management and contingencies
        6. Long-term sustainability planning
        
        Respond in JSON format with:
        - allianceStrategy: object (strategic alliance approach)
        - partnerPrioritization: array (ranked potential partners)
        - structureDesign: object (optimal alliance organization)
        - formationProcess: array (negotiation and establishment steps)
        - riskManagement: array (alliance risk mitigation strategies)
        - sustainabilityPlan: object (long-term alliance maintenance)
        - expectedBenefits: object (projected alliance advantages)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'securityThreats', 'compatibleNations', 'sharedInterests'
      ],
      optionalVariables: [
        'powerBalance', 'regionalDynamics', 'emergingChallenges',
        'complementaryStrengths', 'reliabilityAssessment', 'militaryAlliances',
        'economicPartnerships', 'culturalAgreements', 'technologyCooperation',
        'militaryStrength', 'economicResources', 'technologicalAssets',
        'diplomaticInfluence', 'leadershipModels', 'decisionMaking',
        'resourceSharing', 'commitmentLevels'
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

    // Conflict Mediation APT
    this.registerAPT({
      id: 'conflict-mediation-strategy',
      name: 'Conflict Mediation Strategy',
      description: 'Analyzes conflict mediation approaches and peace-building strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze conflict mediation and peace-building strategies:
        
        Conflict Analysis:
        - Conflict Type: {conflictType}
        - Conflict Parties: {conflictParties}
        - Root Causes: {rootCauses}
        - Escalation Level: {escalationLevel}
        
        Mediation Context:
        - Our Role: {ourRole}
        - Mediation Mandate: {mediationMandate}
        - Available Resources: {availableResources}
        - Time Constraints: {timeConstraints}
        
        Party Positions:
        - Party A Interests: {partyAInterests}
        - Party B Interests: {partyBInterests}
        - Common Ground: {commonGround}
        - Irreconcilable Differences: {irreconcilableDifferences}
        
        Mediation Tools:
        - Diplomatic Channels: {diplomaticChannels}
        - Economic Incentives: {economicIncentives}
        - Security Guarantees: {securityGuarantees}
        - International Support: {internationalSupport}
        
        Peace-building Elements:
        - Ceasefire Mechanisms: {ceasefireMechanisms}
        - Confidence Building: {confidenceBuilding}
        - Reconciliation Processes: {reconciliationProcesses}
        - Long-term Stability: {longTermStability}
        
        Analyze and recommend:
        1. Mediation strategy and approach
        2. Negotiation framework design
        3. Incentive and pressure mechanisms
        4. Peace agreement structure
        5. Implementation and monitoring
        6. Sustainable peace-building
        
        Respond in JSON format with:
        - mediationStrategy: object (mediation approach and tactics)
        - negotiationFramework: object (structured negotiation process)
        - incentiveMechanisms: array (carrots and sticks for compliance)
        - peaceAgreement: object (agreement structure and provisions)
        - implementationPlan: array (execution and monitoring strategies)
        - peaceBuilding: object (long-term reconciliation and stability measures)
        - successProbability: number (0-1)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'conflictType', 'conflictParties', 'rootCauses'
      ],
      optionalVariables: [
        'escalationLevel', 'ourRole', 'mediationMandate', 'availableResources',
        'timeConstraints', 'partyAInterests', 'partyBInterests', 'commonGround',
        'irreconcilableDifferences', 'diplomaticChannels', 'economicIncentives',
        'securityGuarantees', 'internationalSupport', 'ceasefireMechanisms',
        'confidenceBuilding', 'reconciliationProcesses', 'longTermStability'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 180000, // 3 minutes (conflicts change rapidly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Cultural Diplomacy APT
    this.registerAPT({
      id: 'cultural-diplomacy-strategy',
      name: 'Cultural Diplomacy Strategy',
      description: 'Analyzes cultural diplomacy and soft power projection strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze cultural diplomacy and soft power projection strategies:
        
        Cultural Assets:
        - Cultural Heritage: {culturalHeritage}
        - Arts and Entertainment: {artsAndEntertainment}
        - Language and Literature: {languageAndLiterature}
        - Educational Excellence: {educationalExcellence}
        
        Soft Power Resources:
        - Cultural Influence: {culturalInfluence}
        - Media Reach: {mediaReach}
        - Educational Exchanges: {educationalExchanges}
        - Tourism Appeal: {tourismAppeal}
        
        Target Audiences:
        - Foreign Publics: {foreignPublics}
        - Cultural Elites: {culturalElites}
        - Youth Demographics: {youthDemographics}
        - Diaspora Communities: {diasporaCommunities}
        
        Diplomatic Objectives:
        - Image Enhancement: {imageEnhancement}
        - Relationship Building: {relationshipBuilding}
        - Influence Expansion: {influenceExpansion}
        - Conflict Prevention: {conflictPrevention}
        
        Cultural Programs:
        - Exchange Programs: {exchangePrograms}
        - Cultural Events: {culturalEvents}
        - Media Productions: {mediaProductions}
        - Educational Initiatives: {educationalInitiatives}
        
        Analyze and recommend:
        1. Cultural diplomacy strategy optimization
        2. Soft power asset development
        3. Target audience engagement
        4. Program design and implementation
        5. Impact measurement and evaluation
        6. Long-term influence building
        
        Respond in JSON format with:
        - diplomacyStrategy: object (cultural diplomacy approach)
        - assetDevelopment: array (soft power resource enhancement)
        - audienceEngagement: object (target audience strategies)
        - programDesign: array (cultural program recommendations)
        - impactMeasurement: object (evaluation and assessment methods)
        - influenceBuilding: array (long-term soft power strategies)
        - culturalBridge: object (cross-cultural understanding promotion)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'culturalHeritage', 'culturalInfluence', 'foreignPublics'
      ],
      optionalVariables: [
        'artsAndEntertainment', 'languageAndLiterature', 'educationalExcellence',
        'mediaReach', 'educationalExchanges', 'tourismAppeal', 'culturalElites',
        'youthDemographics', 'diasporaCommunities', 'imageEnhancement',
        'relationshipBuilding', 'influenceExpansion', 'conflictPrevention',
        'exchangePrograms', 'culturalEvents', 'mediaProductions',
        'educationalInitiatives'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.35,
      maxTokens: 1900,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 11000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 600000, // 10 minutes
      estimatedExecutionTime: 2400,
      memoryUsage: 58 * 1024 * 1024,
      complexity: 'medium'
    });

    // Economic Diplomacy APT
    this.registerAPT({
      id: 'economic-diplomacy-strategy',
      name: 'Economic Diplomacy Strategy',
      description: 'Analyzes economic diplomacy and trade-based influence strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze economic diplomacy and trade-based influence strategies:
        
        Economic Position:
        - Economic Strength: {economicStrength}
        - Trade Dependencies: {tradeDependencies}
        - Economic Leverage: {economicLeverage}
        - Market Access: {marketAccess}
        
        Trade Relationships:
        - Major Trading Partners: {majorTradingPartners}
        - Trade Balances: {tradeBalances}
        - Strategic Imports: {strategicImports}
        - Export Advantages: {exportAdvantages}
        
        Economic Tools:
        - Investment Capacity: {investmentCapacity}
        - Financial Instruments: {financialInstruments}
        - Technology Transfer: {technologyTransfer}
        - Development Aid: {developmentAid}
        
        Diplomatic Objectives:
        - Economic Integration: {economicIntegration}
        - Market Expansion: {marketExpansion}
        - Resource Security: {resourceSecurity}
        - Influence Building: {influenceBuilding}
        
        Competitive Landscape:
        - Economic Rivals: {economicRivals}
        - Emerging Markets: {emergingMarkets}
        - Trade Blocs: {tradeBlocs}
        - Economic Sanctions: {economicSanctions}
        
        Analyze and recommend:
        1. Economic diplomacy strategy optimization
        2. Trade relationship enhancement
        3. Economic leverage utilization
        4. Investment and aid strategies
        5. Market access expansion
        6. Economic integration planning
        
        Respond in JSON format with:
        - diplomacyStrategy: object (economic diplomacy approach)
        - tradeEnhancement: array (trade relationship improvement strategies)
        - leverageUtilization: object (economic influence maximization)
        - investmentStrategy: array (strategic investment and aid programs)
        - marketExpansion: object (market access and penetration strategies)
        - integrationPlanning: array (economic integration initiatives)
        - competitiveAdvantage: object (economic positioning strategies)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'economicStrength', 'majorTradingPartners', 'economicIntegration'
      ],
      optionalVariables: [
        'tradeDependencies', 'economicLeverage', 'marketAccess', 'tradeBalances',
        'strategicImports', 'exportAdvantages', 'investmentCapacity',
        'financialInstruments', 'technologyTransfer', 'developmentAid',
        'marketExpansion', 'resourceSecurity', 'influenceBuilding',
        'economicRivals', 'emergingMarkets', 'tradeBlocs', 'economicSanctions'
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

    // War Strategy APT
    this.registerAPT({
      id: 'war-strategy-analysis',
      name: 'War Strategy Analysis',
      description: 'Analyzes comprehensive war strategy and military campaign planning',
      category: 'inter-civ',
      promptTemplate: `
        Analyze comprehensive war strategy and military campaign planning:
        
        Strategic Context:
        - War Objectives: {warObjectives}
        - Enemy Analysis: {enemyAnalysis}
        - Allied Support: {alliedSupport}
        - Theater of Operations: {theaterOfOperations}
        
        Military Assets:
        - Force Composition: {forceComposition}
        - Military Capabilities: {militaryCapabilities}
        - Logistical Support: {logisticalSupport}
        - Intelligence Assets: {intelligenceAssets}
        
        Strategic Options:
        - Offensive Operations: {offensiveOperations}
        - Defensive Strategies: {defensiveStrategies}
        - Asymmetric Warfare: {asymmetricWarfare}
        - Coalition Warfare: {coalitionWarfare}
        
        Campaign Planning:
        - Phase Sequencing: {phaseSequencing}
        - Resource Allocation: {resourceAllocation}
        - Timeline Planning: {timelinePlanning}
        - Contingency Plans: {contingencyPlans}
        
        Risk Assessment:
        - Military Risks: {militaryRisks}
        - Political Consequences: {politicalConsequences}
        - Economic Costs: {economicCosts}
        - Escalation Potential: {escalationPotential}
        
        Analyze and recommend:
        1. Optimal war strategy framework
        2. Campaign phase planning
        3. Resource and force allocation
        4. Risk mitigation strategies
        5. Victory condition definition
        6. Exit strategy planning
        
        Respond in JSON format with:
        - strategyFramework: object (comprehensive war strategy)
        - campaignPlanning: array (phased campaign execution plan)
        - forceAllocation: object (optimal military resource distribution)
        - riskMitigation: array (strategic risk management measures)
        - victoryConditions: object (clear success criteria and metrics)
        - exitStrategy: array (war termination and transition planning)
        - successProbability: number (0-1)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'warObjectives', 'enemyAnalysis', 'forceComposition'
      ],
      optionalVariables: [
        'alliedSupport', 'theaterOfOperations', 'militaryCapabilities',
        'logisticalSupport', 'intelligenceAssets', 'offensiveOperations',
        'defensiveStrategies', 'asymmetricWarfare', 'coalitionWarfare',
        'phaseSequencing', 'resourceAllocation', 'timelinePlanning',
        'contingencyPlans', 'militaryRisks', 'politicalConsequences',
        'economicCosts', 'escalationPotential'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.2,
      maxTokens: 2100,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 13000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes (war situations change rapidly)
      estimatedExecutionTime: 2800,
      memoryUsage: 65 * 1024 * 1024,
      complexity: 'high'
    });

    // Battle Tactics APT
    this.registerAPT({
      id: 'battle-tactics-analysis',
      name: 'Battle Tactics Analysis',
      description: 'Analyzes tactical battle planning and engagement optimization',
      category: 'inter-civ',
      promptTemplate: `
        Analyze tactical battle planning and engagement optimization:
        
        Battle Context:
        - Mission Objectives: {missionObjectives}
        - Battlefield Terrain: {battlefieldTerrain}
        - Enemy Forces: {enemyForces}
        - Time Constraints: {timeConstraints}
        
        Our Forces:
        - Unit Composition: {unitComposition}
        - Combat Capabilities: {combatCapabilities}
        - Equipment Status: {equipmentStatus}
        - Morale Level: {moraleLevel}
        
        Tactical Options:
        - Offensive Tactics: {offensiveTactics}
        - Defensive Positions: {defensivePositions}
        - Maneuver Warfare: {maneuverWarfare}
        - Combined Arms: {combinedArms}
        
        Environmental Factors:
        - Weather Conditions: {weatherConditions}
        - Visibility: {visibility}
        - Communication: {communication}
        - Supply Lines: {supplyLines}
        
        Intelligence Picture:
        - Enemy Positions: {enemyPositions}
        - Enemy Intentions: {enemyIntentions}
        - Reinforcements: {reinforcements}
        - Escape Routes: {escapeRoutes}
        
        Analyze and recommend:
        1. Optimal tactical approach
        2. Force deployment strategy
        3. Engagement sequencing
        4. Contingency planning
        5. Casualty minimization
        6. Mission success optimization
        
        Respond in JSON format with:
        - tacticalApproach: object (optimal battle tactics)
        - forceDeployment: array (unit positioning and movement)
        - engagementSequence: array (battle phase execution plan)
        - contingencyPlans: object (alternative tactical options)
        - casualtyMinimization: array (force protection measures)
        - successOptimization: object (mission accomplishment strategies)
        - riskAssessment: array (tactical risks and mitigation)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'missionObjectives', 'battlefieldTerrain', 'unitComposition'
      ],
      optionalVariables: [
        'enemyForces', 'timeConstraints', 'combatCapabilities',
        'equipmentStatus', 'moraleLevel', 'offensiveTactics',
        'defensivePositions', 'maneuverWarfare', 'combinedArms',
        'weatherConditions', 'visibility', 'communication', 'supplyLines',
        'enemyPositions', 'enemyIntentions', 'reinforcements', 'escapeRoutes'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.2,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 120000, // 2 minutes (battle situations change very rapidly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Trade Agreements APT
    this.registerAPT({
      id: 'trade-agreements-optimization',
      name: 'Trade Agreements Optimization',
      description: 'Analyzes trade agreement negotiation and optimization strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze trade agreement negotiation and optimization strategies:
        
        Trade Context:
        - Agreement Type: {agreementType}
        - Trading Partners: {tradingPartners}
        - Trade Volume: {tradeVolume}
        - Market Conditions: {marketConditions}
        
        Our Trade Position:
        - Export Strengths: {exportStrengths}
        - Import Needs: {importNeeds}
        - Competitive Advantages: {competitiveAdvantages}
        - Trade Barriers: {tradeBarriers}
        
        Partner Analysis:
        - Partner Strengths: {partnerStrengths}
        - Partner Needs: {partnerNeeds}
        - Partner Constraints: {partnerConstraints}
        - Alternative Partners: {alternativePartners}
        
        Agreement Structure:
        - Tariff Schedules: {tariffSchedules}
        - Trade Quotas: {tradeQuotas}
        - Service Provisions: {serviceProvisions}
        - Dispute Mechanisms: {disputeMechanisms}
        
        Economic Impact:
        - GDP Effects: {gdpEffects}
        - Employment Impact: {employmentImpact}
        - Industry Effects: {industryEffects}
        - Consumer Benefits: {consumerBenefits}
        
        Analyze and recommend:
        1. Optimal agreement structure
        2. Negotiation strategy and tactics
        3. Economic impact optimization
        4. Risk mitigation measures
        5. Implementation planning
        6. Performance monitoring
        
        Respond in JSON format with:
        - agreementStructure: object (optimal trade agreement framework)
        - negotiationStrategy: array (negotiation tactics and approaches)
        - economicOptimization: object (economic benefit maximization)
        - riskMitigation: array (trade risk management measures)
        - implementationPlan: array (agreement execution strategies)
        - monitoringFramework: object (performance tracking and evaluation)
        - expectedBenefits: object (projected economic gains)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'agreementType', 'tradingPartners', 'exportStrengths'
      ],
      optionalVariables: [
        'tradeVolume', 'marketConditions', 'importNeeds',
        'competitiveAdvantages', 'tradeBarriers', 'partnerStrengths',
        'partnerNeeds', 'partnerConstraints', 'alternativePartners',
        'tariffSchedules', 'tradeQuotas', 'serviceProvisions',
        'disputeMechanisms', 'gdpEffects', 'employmentImpact',
        'industryEffects', 'consumerBenefits'
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

    // Market Penetration APT
    this.registerAPT({
      id: 'market-penetration-strategy',
      name: 'Market Penetration Strategy',
      description: 'Analyzes international market penetration and expansion strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze international market penetration and expansion strategies:
        
        Target Market:
        - Market Size: {marketSize}
        - Market Growth: {marketGrowth}
        - Market Segments: {marketSegments}
        - Customer Preferences: {customerPreferences}
        
        Competitive Landscape:
        - Market Leaders: {marketLeaders}
        - Competitive Intensity: {competitiveIntensity}
        - Barriers to Entry: {barriersToEntry}
        - Differentiation Opportunities: {differentiationOpportunities}
        
        Our Capabilities:
        - Product Portfolio: {productPortfolio}
        - Competitive Advantages: {competitiveAdvantages}
        - Resource Availability: {resourceAvailability}
        - Market Experience: {marketExperience}
        
        Entry Strategies:
        - Direct Investment: {directInvestment}
        - Joint Ventures: {jointVentures}
        - Licensing Agreements: {licensingAgreements}
        - Export Strategies: {exportStrategies}
        
        Market Dynamics:
        - Regulatory Environment: {regulatoryEnvironment}
        - Cultural Factors: {culturalFactors}
        - Economic Conditions: {economicConditions}
        - Technology Adoption: {technologyAdoption}
        
        Analyze and recommend:
        1. Optimal market entry strategy
        2. Competitive positioning approach
        3. Resource allocation planning
        4. Risk assessment and mitigation
        5. Performance metrics and targets
        6. Long-term market development
        
        Respond in JSON format with:
        - entryStrategy: object (optimal market entry approach)
        - competitivePositioning: array (market positioning strategies)
        - resourceAllocation: object (investment and resource planning)
        - riskAssessment: array (market risks and mitigation measures)
        - performanceTargets: object (success metrics and milestones)
        - marketDevelopment: array (long-term expansion strategies)
        - successProbability: number (0-1)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'marketSize', 'marketLeaders', 'productPortfolio'
      ],
      optionalVariables: [
        'marketGrowth', 'marketSegments', 'customerPreferences',
        'competitiveIntensity', 'barriersToEntry', 'differentiationOpportunities',
        'competitiveAdvantages', 'resourceAvailability', 'marketExperience',
        'directInvestment', 'jointVentures', 'licensingAgreements',
        'exportStrategies', 'regulatoryEnvironment', 'culturalFactors',
        'economicConditions', 'technologyAdoption'
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

    // Supply Chain APT
    this.registerAPT({
      id: 'supply-chain-optimization',
      name: 'Supply Chain Optimization',
      description: 'Analyzes international supply chain optimization and logistics strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze international supply chain optimization and logistics strategies:
        
        Supply Chain Structure:
        - Supply Network: {supplyNetwork}
        - Key Suppliers: {keySuppliers}
        - Distribution Channels: {distributionChannels}
        - Logistics Infrastructure: {logisticsInfrastructure}
        
        Performance Metrics:
        - Cost Efficiency: {costEfficiency}
        - Delivery Performance: {deliveryPerformance}
        - Quality Standards: {qualityStandards}
        - Reliability Metrics: {reliabilityMetrics}
        
        Risk Factors:
        - Supply Disruptions: {supplyDisruptions}
        - Geopolitical Risks: {geopoliticalRisks}
        - Natural Disasters: {naturalDisasters}
        - Economic Volatility: {economicVolatility}
        
        Optimization Opportunities:
        - Route Optimization: {routeOptimization}
        - Inventory Management: {inventoryManagement}
        - Supplier Diversification: {supplierDiversification}
        - Technology Integration: {technologyIntegration}
        
        Strategic Considerations:
        - Cost vs Resilience: {costVsResilience}
        - Local vs Global: {localVsGlobal}
        - Sustainability Goals: {sustainabilityGoals}
        - Regulatory Compliance: {regulatoryCompliance}
        
        Analyze and recommend:
        1. Supply chain optimization strategy
        2. Risk mitigation and resilience building
        3. Cost reduction opportunities
        4. Performance improvement measures
        5. Technology and automation integration
        6. Sustainability enhancement
        
        Respond in JSON format with:
        - optimizationStrategy: object (supply chain improvement framework)
        - riskMitigation: array (supply chain risk management measures)
        - costReduction: object (cost optimization opportunities)
        - performanceImprovement: array (efficiency enhancement strategies)
        - technologyIntegration: array (automation and digitalization initiatives)
        - sustainabilityEnhancement: object (environmental and social improvements)
        - resilienceBuilding: array (supply chain robustness measures)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'supplyNetwork', 'keySuppliers', 'costEfficiency'
      ],
      optionalVariables: [
        'distributionChannels', 'logisticsInfrastructure', 'deliveryPerformance',
        'qualityStandards', 'reliabilityMetrics', 'supplyDisruptions',
        'geopoliticalRisks', 'naturalDisasters', 'economicVolatility',
        'routeOptimization', 'inventoryManagement', 'supplierDiversification',
        'technologyIntegration', 'costVsResilience', 'localVsGlobal',
        'sustainabilityGoals', 'regulatoryCompliance'
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

    // Economic Sanctions APT
    this.registerAPT({
      id: 'economic-sanctions-analysis',
      name: 'Economic Sanctions Analysis',
      description: 'Analyzes economic sanctions strategy and impact assessment',
      category: 'inter-civ',
      promptTemplate: `
        Analyze economic sanctions strategy and impact assessment:
        
        Sanctions Context:
        - Target Nation: {targetNation}
        - Policy Objectives: {policyObjectives}
        - International Support: {internationalSupport}
        - Legal Framework: {legalFramework}
        
        Sanctions Design:
        - Sanctions Type: {sanctionsType}
        - Scope and Coverage: {scopeAndCoverage}
        - Exemptions: {exemptions}
        - Implementation Timeline: {implementationTimeline}
        
        Impact Assessment:
        - Economic Impact on Target: {economicImpactTarget}
        - Humanitarian Consequences: {humanitarianConsequences}
        - Third-Party Effects: {thirdPartyEffects}
        - Our Economic Costs: {ourEconomicCosts}
        
        Effectiveness Factors:
        - Target Vulnerability: {targetVulnerability}
        - Alternative Markets: {alternativeMarkets}
        - Sanctions Evasion: {sanctionsEvasion}
        - Multilateral Coordination: {multilateralCoordination}
        
        Strategic Considerations:
        - Escalation Risks: {escalationRisks}
        - Diplomatic Consequences: {diplomaticConsequences}
        - Long-term Relations: {longTermRelations}
        - Exit Strategy: {exitStrategy}
        
        Analyze and recommend:
        1. Optimal sanctions design and implementation
        2. Impact assessment and mitigation
        3. Effectiveness maximization strategies
        4. Risk management and contingencies
        5. Multilateral coordination approaches
        6. Success metrics and evaluation
        
        Respond in JSON format with:
        - sanctionsDesign: object (optimal sanctions framework)
        - impactAssessment: object (comprehensive impact analysis)
        - effectivenessStrategy: array (sanctions effectiveness enhancement)
        - riskManagement: array (sanctions risk mitigation measures)
        - multilateralCoordination: object (international cooperation strategies)
        - successMetrics: array (evaluation criteria and benchmarks)
        - expectedOutcomes: object (projected sanctions results)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'targetNation', 'policyObjectives', 'sanctionsType'
      ],
      optionalVariables: [
        'internationalSupport', 'legalFramework', 'scopeAndCoverage',
        'exemptions', 'implementationTimeline', 'economicImpactTarget',
        'humanitarianConsequences', 'thirdPartyEffects', 'ourEconomicCosts',
        'targetVulnerability', 'alternativeMarkets', 'sanctionsEvasion',
        'multilateralCoordination', 'escalationRisks', 'diplomaticConsequences',
        'longTermRelations', 'exitStrategy'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.2,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes (sanctions situations change rapidly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Currency Exchange APT
    this.registerAPT({
      id: 'currency-exchange-strategy',
      name: 'Currency Exchange Strategy',
      description: 'Analyzes international currency exchange and monetary policy coordination',
      category: 'inter-civ',
      promptTemplate: `
        Analyze international currency exchange and monetary policy coordination:
        
        Currency Position:
        - Currency Strength: {currencyStrength}
        - Exchange Rate Trends: {exchangeRateTrends}
        - Reserve Holdings: {reserveHoldings}
        - International Usage: {internationalUsage}
        
        Trade Impact:
        - Export Competitiveness: {exportCompetitiveness}
        - Import Costs: {importCosts}
        - Trade Balance Effects: {tradeBalanceEffects}
        - Price Stability: {priceStability}
        
        Policy Tools:
        - Interest Rate Policy: {interestRatePolicy}
        - Foreign Exchange Intervention: {forexIntervention}
        - Capital Controls: {capitalControls}
        - Monetary Cooperation: {monetaryCooperation}
        
        Market Dynamics:
        - Speculation Pressure: {speculationPressure}
        - Capital Flows: {capitalFlows}
        - Market Volatility: {marketVolatility}
        - Liquidity Conditions: {liquidityConditions}
        
        International Coordination:
        - Bilateral Agreements: {bilateralAgreements}
        - Multilateral Frameworks: {multilateralFrameworks}
        - Central Bank Cooperation: {centralBankCooperation}
        - Crisis Response Mechanisms: {crisisResponseMechanisms}
        
        Analyze and recommend:
        1. Optimal exchange rate strategy
        2. Monetary policy coordination
        3. Market intervention approaches
        4. Risk management strategies
        5. International cooperation enhancement
        6. Crisis preparedness planning
        
        Respond in JSON format with:
        - exchangeRateStrategy: object (optimal currency management approach)
        - monetaryCoordination: array (international monetary policy alignment)
        - marketIntervention: object (foreign exchange intervention strategies)
        - riskManagement: array (currency risk mitigation measures)
        - cooperationEnhancement: array (international monetary cooperation)
        - crisisPreparedness: object (currency crisis response planning)
        - stabilityMaintenance: array (exchange rate stability measures)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'currencyStrength', 'exchangeRateTrends', 'exportCompetitiveness'
      ],
      optionalVariables: [
        'reserveHoldings', 'internationalUsage', 'importCosts',
        'tradeBalanceEffects', 'priceStability', 'interestRatePolicy',
        'forexIntervention', 'capitalControls', 'monetaryCooperation',
        'speculationPressure', 'capitalFlows', 'marketVolatility',
        'liquidityConditions', 'bilateralAgreements', 'multilateralFrameworks',
        'centralBankCooperation', 'crisisResponseMechanisms'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes (currency markets change rapidly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });

    // Commercial Disputes APT
    this.registerAPT({
      id: 'commercial-disputes-resolution',
      name: 'Commercial Disputes Resolution',
      description: 'Analyzes international commercial dispute resolution and trade conflict management',
      category: 'inter-civ',
      promptTemplate: `
        Analyze international commercial dispute resolution and trade conflict management:
        
        Dispute Context:
        - Dispute Type: {disputeType}
        - Parties Involved: {partiesInvolved}
        - Economic Stakes: {economicStakes}
        - Legal Jurisdiction: {legalJurisdiction}
        
        Dispute Details:
        - Core Issues: {coreIssues}
        - Legal Arguments: {legalArguments}
        - Evidence Available: {evidenceAvailable}
        - Precedent Cases: {precedentCases}
        
        Resolution Options:
        - Negotiation: {negotiation}
        - Mediation: {mediation}
        - Arbitration: {arbitration}
        - Litigation: {litigation}
        
        Strategic Considerations:
        - Relationship Impact: {relationshipImpact}
        - Reputation Effects: {reputationEffects}
        - Time Constraints: {timeConstraints}
        - Cost Implications: {costImplications}
        
        Risk Assessment:
        - Legal Risks: {legalRisks}
        - Commercial Risks: {commercialRisks}
        - Enforcement Challenges: {enforcementChallenges}
        - Escalation Potential: {escalationPotential}
        
        Analyze and recommend:
        1. Optimal dispute resolution strategy
        2. Legal and commercial risk assessment
        3. Negotiation and settlement approaches
        4. Relationship preservation strategies
        5. Enforcement and compliance planning
        6. Future dispute prevention
        
        Respond in JSON format with:
        - resolutionStrategy: object (optimal dispute resolution approach)
        - riskAssessment: object (comprehensive risk evaluation)
        - negotiationApproach: array (settlement negotiation strategies)
        - relationshipPreservation: array (business relationship protection measures)
        - enforcementPlanning: object (resolution enforcement strategies)
        - preventionMeasures: array (future dispute prevention strategies)
        - successProbability: number (0-1)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'disputeType', 'partiesInvolved', 'coreIssues'
      ],
      optionalVariables: [
        'economicStakes', 'legalJurisdiction', 'legalArguments',
        'evidenceAvailable', 'precedentCases', 'negotiation', 'mediation',
        'arbitration', 'litigation', 'relationshipImpact', 'reputationEffects',
        'timeConstraints', 'costImplications', 'legalRisks', 'commercialRisks',
        'enforcementChallenges', 'escalationPotential'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.2,
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

    // Peace Negotiation APT
    this.registerAPT({
      id: 'peace-negotiation-strategy',
      name: 'Peace Negotiation Strategy',
      description: 'Analyzes peace negotiation strategies and post-conflict reconstruction planning',
      category: 'inter-civ',
      promptTemplate: `
        Analyze peace negotiation strategies and post-conflict reconstruction planning:
        
        Conflict Background:
        - Conflict History: {conflictHistory}
        - Root Causes: {rootCauses}
        - Conflict Parties: {conflictParties}
        - International Involvement: {internationalInvolvement}
        
        Negotiation Context:
        - Negotiation Format: {negotiationFormat}
        - Mediator Role: {mediatorRole}
        - Stakeholder Interests: {stakeholderInterests}
        - Power Dynamics: {powerDynamics}
        
        Peace Framework:
        - Ceasefire Terms: {ceasefireTerms}
        - Political Settlement: {politicalSettlement}
        - Security Arrangements: {securityArrangements}
        - Transitional Justice: {transitionalJustice}
        
        Implementation Planning:
        - Monitoring Mechanisms: {monitoringMechanisms}
        - International Support: {internationalSupport}
        - Resource Requirements: {resourceRequirements}
        - Timeline Milestones: {timelineMilestones}
        
        Reconstruction Priorities:
        - Institution Building: {institutionBuilding}
        - Economic Recovery: {economicRecovery}
        - Social Reconciliation: {socialReconciliation}
        - Infrastructure Rebuilding: {infrastructureRebuilding}
        
        Analyze and recommend:
        1. Comprehensive peace negotiation strategy
        2. Sustainable peace framework design
        3. Implementation and monitoring planning
        4. Post-conflict reconstruction priorities
        5. Reconciliation and healing processes
        6. Long-term stability maintenance
        
        Respond in JSON format with:
        - negotiationStrategy: object (comprehensive peace negotiation approach)
        - peaceFramework: object (sustainable peace agreement structure)
        - implementationPlan: array (peace agreement execution strategies)
        - reconstructionPriorities: array (post-conflict rebuilding focus areas)
        - reconciliationProcess: object (social healing and reconciliation strategies)
        - stabilityMaintenance: array (long-term peace sustainability measures)
        - successProbability: number (0-1)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'conflictHistory', 'conflictParties', 'stakeholderInterests'
      ],
      optionalVariables: [
        'rootCauses', 'internationalInvolvement', 'negotiationFormat',
        'mediatorRole', 'powerDynamics', 'ceasefireTerms', 'politicalSettlement',
        'securityArrangements', 'transitionalJustice', 'monitoringMechanisms',
        'internationalSupport', 'resourceRequirements', 'timelineMilestones',
        'institutionBuilding', 'economicRecovery', 'socialReconciliation',
        'infrastructureRebuilding'
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

    // War Economy APT
    this.registerAPT({
      id: 'war-economy-management',
      name: 'War Economy Management',
      description: 'Analyzes wartime economic management and resource mobilization strategies',
      category: 'inter-civ',
      promptTemplate: `
        Analyze wartime economic management and resource mobilization strategies:
        
        Economic Baseline:
        - Pre-war Economy: {preWarEconomy}
        - Economic Capacity: {economicCapacity}
        - Resource Availability: {resourceAvailability}
        - Industrial Base: {industrialBase}
        
        War Requirements:
        - Military Spending: {militarySpending}
        - Defense Production: {defenseProduction}
        - Logistical Needs: {logisticalNeeds}
        - Personnel Mobilization: {personnelMobilization}
        
        Economic Mobilization:
        - Production Conversion: {productionConversion}
        - Resource Allocation: {resourceAllocation}
        - Labor Redeployment: {laborRedeployment}
        - Supply Chain Adaptation: {supplyChainAdaptation}
        
        Financial Management:
        - War Financing: {warFinancing}
        - Debt Management: {debtManagement}
        - Inflation Control: {inflationControl}
        - Currency Stability: {currencyStability}
        
        Civilian Economy:
        - Essential Services: {essentialServices}
        - Consumer Goods: {consumerGoods}
        - Food Security: {foodSecurity}
        - Social Welfare: {socialWelfare}
        
        Analyze and recommend:
        1. Optimal war economy mobilization
        2. Resource allocation and prioritization
        3. Industrial conversion strategies
        4. Financial sustainability planning
        5. Civilian economy maintenance
        6. Post-war economic transition
        
        Respond in JSON format with:
        - mobilizationStrategy: object (war economy mobilization framework)
        - resourcePrioritization: array (strategic resource allocation)
        - industrialConversion: object (production capacity transformation)
        - financialSustainability: array (war financing and economic stability)
        - civilianMaintenance: object (essential civilian economy preservation)
        - transitionPlanning: array (post-war economic recovery preparation)
        - economicResilience: object (wartime economic stability measures)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'preWarEconomy', 'militarySpending', 'resourceAvailability'
      ],
      optionalVariables: [
        'economicCapacity', 'industrialBase', 'defenseProduction',
        'logisticalNeeds', 'personnelMobilization', 'productionConversion',
        'resourceAllocation', 'laborRedeployment', 'supplyChainAdaptation',
        'warFinancing', 'debtManagement', 'inflationControl', 'currencyStability',
        'essentialServices', 'consumerGoods', 'foodSecurity', 'socialWelfare'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes (war economy changes rapidly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });
  }

  protected async executeSystem(context: APIExecutionContext): Promise<InterCivilizationSystemResult> {
    console.log(`🌍 Executing Inter-Civilization System for civilization: ${context.civilizationContext?.id || 'unknown'}`);
    
    const civContext = context.civilizationContext;
    if (!civContext) {
      throw new Error('Inter-civilization system requires civilization context');
    }

    // Execute inter-civilization analysis
    const [
      diplomaticStrategyResult,
      treatyNegotiationResult,
      allianceFormationResult,
      conflictMediationResult,
      culturalDiplomacyResult,
      interCivData
    ] = await Promise.all([
      this.executeDiplomaticStrategyAnalysis(context),
      this.executeTreatyNegotiationStrategy(context),
      this.executeAllianceFormationStrategy(context),
      this.executeConflictMediationStrategy(context),
      this.executeCulturalDiplomacyStrategy(context),
      this.calculateInterCivilizationData(civContext)
    ]);

    // Generate inter-civilization events
    const interCivEvents = this.generateInterCivilizationEvents(
      diplomaticStrategyResult,
      treatyNegotiationResult,
      allianceFormationResult,
      conflictMediationResult,
      culturalDiplomacyResult
    );

    return {
      gameStateUpdates: interCivData,
      systemOutputs: {
        diplomaticRecommendations: diplomaticStrategyResult?.strategyOptimization || [],
        conflictAnalysis: conflictMediationResult?.mediationStrategy || [],
        tradeOpportunities: [], // Will be filled by trade-specific APTs
        allianceStrategies: allianceFormationResult?.allianceStrategy || []
      },
      eventsGenerated: interCivEvents,
      scheduledActions: []
    };
  }

  protected isRelevantEvent(event: any, context: APIExecutionContext): boolean {
    const relevantEventTypes = [
      'diplomatic_meeting',
      'treaty_signed',
      'alliance_formed',
      'alliance_broken',
      'trade_agreement',
      'border_dispute',
      'cultural_exchange',
      'diplomatic_crisis',
      'peace_negotiation',
      'war_declaration',
      'ceasefire_agreement',
      'embassy_established',
      'sanctions_imposed',
      'mediation_request'
    ];
    
    return relevantEventTypes.includes(event.type);
  }

  // ============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // ============================================================================

  private async executeDiplomaticStrategyAnalysis(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      diplomaticRelations: civContext.diplomacy?.relations || {},
      foreignPolicyGoals: civContext.diplomacy?.goals || [],
      internationalReputation: civContext.diplomacy?.reputation || 0.5,
      diplomaticInfluence: civContext.diplomacy?.influence || 0.5,
      securityInterests: civContext.military?.securityInterests || []
    };

    return await this.executeAPT('diplomatic-strategy-analysis', variables, context);
  }

  private async executeTreatyNegotiationStrategy(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      treatyType: 'trade_agreement', // Example default
      negotiatingParties: civContext.diplomacy?.activeNegotiations || [],
      coreInterests: civContext.diplomacy?.coreInterests || [],
      bargainingPower: civContext.diplomacy?.bargainingPower || 0.5
    };

    return await this.executeAPT('treaty-negotiation-strategy', variables, context);
  }

  private async executeAllianceFormationStrategy(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      securityThreats: civContext.military?.threats || [],
      compatibleNations: civContext.diplomacy?.potentialAllies || [],
      sharedInterests: civContext.diplomacy?.sharedInterests || [],
      militaryStrength: civContext.military?.strength || 0.5,
      economicResources: civContext.economy?.resources || 0.5
    };

    return await this.executeAPT('alliance-formation-strategy', variables, context);
  }

  private async executeConflictMediationStrategy(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      conflictType: 'territorial_dispute', // Example default
      conflictParties: civContext.diplomacy?.activeConflicts || [],
      rootCauses: civContext.diplomacy?.conflictCauses || [],
      ourRole: civContext.diplomacy?.mediationRole || 'neutral'
    };

    return await this.executeAPT('conflict-mediation-strategy', variables, context);
  }

  private async executeCulturalDiplomacyStrategy(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      culturalHeritage: civContext.culture?.heritage || 0.5,
      culturalInfluence: civContext.culture?.influence || 0.5,
      foreignPublics: civContext.diplomacy?.targetAudiences || [],
      artsAndEntertainment: civContext.culture?.arts || 0.5,
      educationalExchanges: civContext.education?.exchanges || 0.3
    };

    return await this.executeAPT('cultural-diplomacy-strategy', variables, context);
  }

  private async calculateInterCivilizationData(civContext: any): Promise<any> {
    // Simulate inter-civilization data calculation
    return {
      diplomaticRelations: {
        'civ-alpha': {
          relationshipType: 'allied',
          trustLevel: 0.85,
          tradeVolume: 2500000000,
          militaryTensions: 0.1,
          culturalExchange: 0.7,
          activeAgreements: ['trade_pact', 'defense_alliance', 'cultural_exchange']
        },
        'civ-beta': {
          relationshipType: 'neutral',
          trustLevel: 0.45,
          tradeVolume: 800000000,
          militaryTensions: 0.3,
          culturalExchange: 0.2,
          activeAgreements: ['basic_trade']
        },
        'civ-gamma': {
          relationshipType: 'hostile',
          trustLevel: 0.15,
          tradeVolume: 0,
          militaryTensions: 0.8,
          culturalExchange: 0.0,
          activeAgreements: []
        }
      },
      activeConflicts: [
        {
          id: 'border-dispute-1',
          participants: ['our-civ', 'civ-gamma'],
          conflictType: 'territorial',
          intensity: 0.6,
          duration: 180, // days
          casualties: 1250
        }
      ],
      tradeNetworks: [
        {
          id: 'northern-trade-bloc',
          participants: ['our-civ', 'civ-alpha', 'civ-delta'],
          tradeVolume: 5000000000,
          primaryGoods: ['technology', 'energy', 'rare_materials'],
          tradeBalance: {
            'civ-alpha': 500000000,
            'civ-delta': -200000000
          }
        }
      ],
      alliances: [
        {
          id: 'defense-coalition',
          members: ['our-civ', 'civ-alpha', 'civ-epsilon'],
          allianceType: 'military',
          strength: 0.78,
          obligations: ['mutual_defense', 'intelligence_sharing', 'joint_exercises']
        }
      ]
    };
  }

  private generateInterCivilizationEvents(
    diplomaticResult: any,
    treatyResult: any,
    allianceResult: any,
    conflictResult: any,
    culturalResult: any
  ): any[] {
    const events: any[] = [];
    
    if (diplomaticResult?.relationshipPriorities?.length > 0) {
      events.push({
        id: `diplomatic_opportunity_${Date.now()}`,
        type: 'diplomatic_meeting',
        title: 'Diplomatic Opportunity Identified',
        description: `New diplomatic engagement opportunity with ${diplomaticResult.relationshipPriorities[0]?.target || 'key civilization'}`,
        impact: 'positive',
        severity: 'low',
        timestamp: Date.now(),
        data: {
          targetCivilization: diplomaticResult.relationshipPriorities[0]?.target,
          opportunityType: diplomaticResult.relationshipPriorities[0]?.type,
          expectedBenefits: diplomaticResult.relationshipPriorities[0]?.benefits
        }
      });
    }
    
    if (treatyResult?.successProbability > 0.7) {
      events.push({
        id: `treaty_success_${Date.now()}`,
        type: 'treaty_signed',
        title: 'Treaty Negotiation Success',
        description: 'High probability of successful treaty negotiation completion',
        impact: 'positive',
        severity: 'medium',
        timestamp: Date.now(),
        data: {
          treatyType: treatyResult.negotiationStrategy?.treatyType,
          successProbability: treatyResult.successProbability,
          keyProvisions: treatyResult.agreementStructure?.provisions
        }
      });
    }
    
    if (allianceResult?.expectedBenefits?.strategicValue > 0.6) {
      events.push({
        id: `alliance_opportunity_${Date.now()}`,
        type: 'alliance_formed',
        title: 'Strategic Alliance Opportunity',
        description: 'Valuable alliance formation opportunity identified',
        impact: 'positive',
        severity: 'medium',
        timestamp: Date.now(),
        data: {
          potentialPartners: allianceResult.partnerPrioritization,
          strategicValue: allianceResult.expectedBenefits.strategicValue,
          allianceType: allianceResult.allianceStrategy?.type
        }
      });
    }
    
    if (conflictResult?.successProbability < 0.4) {
      events.push({
        id: `mediation_challenge_${Date.now()}`,
        type: 'diplomatic_crisis',
        title: 'Mediation Challenge',
        description: 'Conflict mediation facing significant challenges',
        impact: 'negative',
        severity: 'medium',
        timestamp: Date.now(),
        data: {
          conflictType: conflictResult.mediationStrategy?.conflictType,
          challenges: conflictResult.riskAssessment?.primaryRisks,
          alternativeApproaches: conflictResult.alternativeScenarios
        }
      });
    }
    
    if (culturalResult?.influenceBuilding?.effectiveness > 0.7) {
      events.push({
        id: `cultural_success_${Date.now()}`,
        type: 'cultural_exchange',
        title: 'Cultural Diplomacy Success',
        description: 'Cultural diplomacy initiatives showing strong positive impact',
        impact: 'positive',
        severity: 'low',
        timestamp: Date.now(),
        data: {
          targetAudiences: culturalResult.audienceEngagement?.targets,
          programs: culturalResult.programDesign,
          effectiveness: culturalResult.influenceBuilding.effectiveness
        }
      });
    }
    
    return events;
  }
}
