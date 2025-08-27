/**
 * EconomicsAPI - Orchestration wrapper for economic management systems
 * 
 * This class integrates the existing economic systems with the orchestration framework:
 * - Fiscal policy simulation and effects
 * - Inflation tracking and monetary policy
 * - Business cycle management
 * - Economic indicators and analytics
 * - AI-powered economic analysis and recommendations
 */

import { BaseAPI, APIConfig, createAPIConfig, createKnobDefinition } from '../BaseAPI';
import {
  APIExecutionContext,
  APTTemplate,
  GameEvent
} from '../types';

// Import existing economic systems
import { FiscalSimulationService } from '../../../server/fiscal-simulation/FiscalSimulationService';
import { InflationTrackingService } from '../../../server/economics/InflationTrackingService';

interface EconomicSystemResult {
  gameStateUpdates: {
    economicData?: {
      gdp: number;
      gdpGrowthRate: number;
      unemployment: number;
      inflation: number;
      tradeBalance: number;
      fiscalBalance: number;
      monetaryPolicy: any;
    };
    fiscalPolicies?: any[];
    economicIndicators?: any;
  };
  systemOutputs: {
    fiscalEffects: any[];
    inflationAnalysis: any;
    businessCycleStatus: any;
    economicRecommendations: any[];
    policyImpactAssessment: any;
  };
  eventsGenerated: GameEvent[];
  scheduledActions: any[];
}

export class EconomicsAPI extends BaseAPI {
  private fiscalSimulationService: FiscalSimulationService;
  private inflationTrackingService: InflationTrackingService;

  constructor(databasePool: any) {
    const config = createAPIConfig('economics', {
      name: 'Economic Management System',
      description: 'Manages fiscal policy, monetary policy, and economic indicators',
      tier: 1, // Civilization-level system
      executionGroup: 'civilization',
      priority: 'high',
      frequency: 'every_tick',
      estimatedExecutionTime: 3000,
      timeoutMs: 30000,
      requiredKnobs: ['gdp_growth_target', 'inflation_target', 'unemployment_target'],
      optionalKnobs: [
        'fiscal_spending_multiplier', 'tax_rate', 'interest_rate',
        'government_spending', 'social_spending', 'infrastructure_spending',
        'monetary_policy_stance', 'trade_policy_openness'
      ],
      dependsOn: ['population'] // Economics depends on population data
    });

    super(config);

    // Initialize economic services
    this.fiscalSimulationService = new FiscalSimulationService(databasePool);
    this.inflationTrackingService = new InflationTrackingService(databasePool);
  }

  protected initializeKnobs(): void {
    // Core economic targets
    this.registerKnob(createKnobDefinition(
      'gdp_growth_target',
      'number',
      0.03,
      {
        description: 'Target GDP growth rate per period',
        minValue: -0.1,
        maxValue: 0.15,
        required: true,
        category: 'targets'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'inflation_target',
      'number',
      0.02,
      {
        description: 'Target inflation rate',
        minValue: -0.05,
        maxValue: 0.1,
        required: true,
        category: 'targets'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'unemployment_target',
      'number',
      0.05,
      {
        description: 'Target unemployment rate',
        minValue: 0.01,
        maxValue: 0.2,
        required: true,
        category: 'targets'
      }
    ));

    // Fiscal policy knobs
    this.registerKnob(createKnobDefinition(
      'fiscal_spending_multiplier',
      'number',
      1.0,
      {
        description: 'Government spending effectiveness multiplier',
        minValue: 0.1,
        maxValue: 3.0,
        required: false,
        category: 'fiscal'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'tax_rate',
      'number',
      0.25,
      {
        description: 'Overall tax rate (as fraction of GDP)',
        minValue: 0.05,
        maxValue: 0.6,
        required: false,
        category: 'fiscal'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'government_spending',
      'number',
      0.2,
      {
        description: 'Government spending as fraction of GDP',
        minValue: 0.05,
        maxValue: 0.5,
        required: false,
        category: 'fiscal'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'social_spending',
      'number',
      0.15,
      {
        description: 'Social programs spending as fraction of GDP',
        minValue: 0.0,
        maxValue: 0.3,
        required: false,
        category: 'fiscal'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'infrastructure_spending',
      'number',
      0.05,
      {
        description: 'Infrastructure investment as fraction of GDP',
        minValue: 0.0,
        maxValue: 0.2,
        required: false,
        category: 'fiscal'
      }
    ));

    // Monetary policy knobs
    this.registerKnob(createKnobDefinition(
      'interest_rate',
      'number',
      0.05,
      {
        description: 'Central bank interest rate',
        minValue: 0.0,
        maxValue: 0.2,
        required: false,
        category: 'monetary'
      }
    ));

    this.registerKnob(createKnobDefinition(
      'monetary_policy_stance',
      'enum',
      'neutral',
      {
        description: 'Overall monetary policy stance',
        enumValues: ['expansionary', 'neutral', 'contractionary'],
        required: false,
        category: 'monetary'
      }
    ));

    // Trade and external policy
    this.registerKnob(createKnobDefinition(
      'trade_policy_openness',
      'number',
      0.7,
      {
        description: 'Trade policy openness (0=closed, 1=fully open)',
        minValue: 0.0,
        maxValue: 1.0,
        required: false,
        category: 'trade'
      }
    ));

    // Economic stability parameters
    this.registerKnob(createKnobDefinition(
      'economic_stability_priority',
      'number',
      0.6,
      {
        description: 'Priority given to economic stability vs growth',
        minValue: 0.0,
        maxValue: 1.0,
        required: false,
        category: 'policy'
      }
    ));
  }

  protected initializeAPTs(): void {
    // Economic Policy Analysis APT
    this.registerAPT({
      id: 'economic-policy-analysis',
      name: 'Economic Policy Analysis',
      description: 'Analyzes economic conditions and recommends policy adjustments',
      category: 'civilization',
      promptTemplate: `
        Analyze the economic situation and recommend policy adjustments:
        
        Current Economic Indicators:
        - GDP: {currentGDP}
        - GDP Growth Rate: {gdpGrowthRate}
        - Unemployment Rate: {unemploymentRate}
        - Inflation Rate: {inflationRate}
        - Fiscal Balance: {fiscalBalance}
        - Trade Balance: {tradeBalance}
        
        Policy Targets:
        - GDP Growth Target: {gdpGrowthTarget}
        - Inflation Target: {inflationTarget}
        - Unemployment Target: {unemploymentTarget}
        
        Current Policy Settings:
        - Tax Rate: {taxRate}
        - Government Spending: {governmentSpending}
        - Interest Rate: {interestRate}
        - Monetary Policy Stance: {monetaryPolicyStance}
        
        Recent Economic Events: {recentEconomicEvents}
        Population Data: {populationData}
        
        Provide analysis and recommendations for:
        1. Fiscal policy adjustments (spending, taxation)
        2. Monetary policy recommendations
        3. Trade policy considerations
        4. Economic risks and opportunities
        5. Policy implementation timeline
        
        Respond in JSON format with:
        - fiscalRecommendations: object (spending and tax adjustments)
        - monetaryRecommendations: object (interest rate and policy stance)
        - tradeRecommendations: object (trade policy adjustments)
        - riskAssessment: object (economic risks and mitigation strategies)
        - implementationPlan: array (prioritized policy actions)
        - expectedOutcomes: object (projected economic impacts)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'currentGDP', 'gdpGrowthRate', 'unemploymentRate', 'inflationRate',
        'gdpGrowthTarget', 'inflationTarget', 'unemploymentTarget',
        'taxRate', 'governmentSpending', 'interestRate'
      ],
      optionalVariables: [
        'fiscalBalance', 'tradeBalance', 'monetaryPolicyStance',
        'recentEconomicEvents', 'populationData'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
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

    // Fiscal Impact Assessment APT
    this.registerAPT({
      id: 'fiscal-impact-assessment',
      name: 'Fiscal Impact Assessment',
      description: 'Evaluates the impact of proposed fiscal policy changes',
      category: 'civilization',
      promptTemplate: `
        Assess the impact of proposed fiscal policy changes:
        
        Current Fiscal Position:
        - Government Revenue: {governmentRevenue}
        - Government Spending: {governmentSpending}
        - Fiscal Balance: {fiscalBalance}
        - Debt-to-GDP Ratio: {debtToGDPRatio}
        
        Proposed Policy Changes:
        - Spending Changes: {proposedSpendingChanges}
        - Tax Changes: {proposedTaxChanges}
        - New Programs: {newPrograms}
        
        Economic Context:
        - Current GDP: {currentGDP}
        - Economic Growth: {economicGrowth}
        - Unemployment: {unemployment}
        - Inflation: {inflation}
        
        Evaluate:
        1. Short-term economic impact (1-2 periods)
        2. Long-term economic effects (5+ periods)
        3. Fiscal sustainability implications
        4. Distributional effects on different population groups
        5. Implementation challenges and risks
        
        Respond in JSON format with:
        - shortTermImpact: object (immediate economic effects)
        - longTermImpact: object (sustained economic effects)
        - fiscalSustainability: object (debt and deficit implications)
        - distributionalEffects: object (impact on different groups)
        - implementationRisks: array (potential challenges)
        - alternativeOptions: array (alternative policy approaches)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'governmentRevenue', 'governmentSpending', 'fiscalBalance',
        'currentGDP', 'economicGrowth', 'unemployment', 'inflation'
      ],
      optionalVariables: [
        'debtToGDPRatio', 'proposedSpendingChanges', 'proposedTaxChanges',
        'newPrograms'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 1800,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 10000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes
      estimatedExecutionTime: 2000,
      memoryUsage: 55 * 1024 * 1024,
      complexity: 'high'
    });

    // Business Cycle Analysis APT
    this.registerAPT({
      id: 'business-cycle-analysis',
      name: 'Business Cycle Analysis',
      description: 'Analyzes current business cycle phase and predicts transitions',
      category: 'civilization',
      promptTemplate: `
        Analyze the current business cycle phase and predict future transitions:
        
        Economic Indicators:
        - GDP Growth Trend: {gdpGrowthTrend}
        - Employment Trend: {employmentTrend}
        - Investment Levels: {investmentLevels}
        - Consumer Spending: {consumerSpending}
        - Business Confidence: {businessConfidence}
        - Leading Indicators: {leadingIndicators}
        
        Historical Context:
        - Previous Cycle Phases: {previousCyclePhases}
        - Cycle Duration: {cycleDuration}
        - Last Recession: {lastRecession}
        
        External Factors:
        - Global Economic Conditions: {globalConditions}
        - Trade Relationships: {tradeRelationships}
        - Technological Changes: {technologicalChanges}
        
        Analyze:
        1. Current business cycle phase (expansion, peak, contraction, trough)
        2. Probability of phase transition in next 1-3 periods
        3. Key indicators to monitor for early warning
        4. Policy recommendations for current phase
        5. Risk factors that could accelerate or delay transitions
        
        Respond in JSON format with:
        - currentPhase: string (expansion/peak/contraction/trough)
        - phaseConfidence: number (0-1)
        - transitionProbabilities: object (probabilities for next 1-3 periods)
        - keyIndicators: array (most important indicators to monitor)
        - policyRecommendations: array (phase-appropriate policies)
        - riskFactors: array (factors that could change cycle timing)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'gdpGrowthTrend', 'employmentTrend', 'investmentLevels', 'consumerSpending'
      ],
      optionalVariables: [
        'businessConfidence', 'leadingIndicators', 'previousCyclePhases',
        'cycleDuration', 'lastRecession', 'globalConditions',
        'tradeRelationships', 'technologicalChanges'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.35,
      maxTokens: 1600,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 9000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 600000, // 10 minutes
      estimatedExecutionTime: 1800,
      memoryUsage: 50 * 1024 * 1024,
      complexity: 'medium'
    });

    // Market Analysis APT
    this.registerAPT({
      id: 'market-analysis',
      name: 'Market Analysis',
      description: 'Analyzes market conditions and economic trends for strategic planning',
      category: 'civilization',
      promptTemplate: `
        Analyze market conditions and economic trends:
        
        Market Structure:
        - Market Competition Level: {marketCompetitionLevel}
        - Industry Concentration: {industryConcentration}
        - Market Entry Barriers: {marketEntryBarriers}
        - Innovation Rate: {innovationRate}
        
        Economic Performance:
        - GDP Growth: {gdpGrowth}
        - Productivity Growth: {productivityGrowth}
        - Investment Rate: {investmentRate}
        - Export Performance: {exportPerformance}
        
        Financial Markets:
        - Stock Market Performance: {stockMarketPerformance}
        - Credit Availability: {creditAvailability}
        - Interest Rate Environment: {interestRateEnvironment}
        - Currency Stability: {currencyStability}
        
        Consumer and Business Behavior:
        - Consumer Confidence: {consumerConfidence}
        - Business Investment Sentiment: {businessInvestmentSentiment}
        - Spending Patterns: {spendingPatterns}
        - Savings Rate: {savingsRate}
        
        External Factors:
        - Global Market Conditions: {globalMarketConditions}
        - Trade Policy Environment: {tradePolicyEnvironment}
        - Regulatory Changes: {regulatoryChanges}
        - Technological Disruption: {technologicalDisruption}
        
        Analyze and recommend:
        1. Market health and competitiveness assessment
        2. Economic growth opportunities and constraints
        3. Investment priorities and strategies
        4. Market development recommendations
        5. Risk factors and mitigation strategies
        6. Policy interventions for market optimization
        
        Respond in JSON format with:
        - marketHealthScore: number (0-1)
        - growthOpportunities: array (identified growth areas)
        - investmentPriorities: array (strategic investment recommendations)
        - marketDevelopment: object (market enhancement strategies)
        - riskFactors: array (economic risks and challenges)
        - policyRecommendations: array (government intervention suggestions)
        - competitivenessAnalysis: object (market position assessment)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'gdpGrowth', 'marketCompetitionLevel', 'investmentRate'
      ],
      optionalVariables: [
        'industryConcentration', 'marketEntryBarriers', 'innovationRate',
        'productivityGrowth', 'exportPerformance', 'stockMarketPerformance',
        'creditAvailability', 'interestRateEnvironment', 'currencyStability',
        'consumerConfidence', 'businessInvestmentSentiment', 'spendingPatterns',
        'savingsRate', 'globalMarketConditions', 'tradePolicyEnvironment',
        'regulatoryChanges', 'technologicalDisruption'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes
      estimatedExecutionTime: 2500,
      memoryUsage: 60 * 1024 * 1024,
      complexity: 'high'
    });

    // Trade Route Optimization APT
    this.registerAPT({
      id: 'trade-route-optimization',
      name: 'Trade Route Optimization',
      description: 'Analyzes and optimizes inter-civilization trade relationships',
      category: 'inter-civ',
      promptTemplate: `
        Analyze and optimize trade route strategies:
        
        Current Trade Status:
        - Trade Volume: {tradeVolume}
        - Trade Balance: {tradeBalance}
        - Major Trading Partners: {majorTradingPartners}
        - Trade Route Efficiency: {tradeRouteEfficiency}
        
        Export Analysis:
        - Primary Exports: {primaryExports}
        - Export Competitiveness: {exportCompetitiveness}
        - Export Diversification: {exportDiversification}
        - Value-Added Exports: {valueAddedExports}
        
        Import Dependencies:
        - Critical Imports: {criticalImports}
        - Import Substitution Potential: {importSubstitutionPotential}
        - Supply Chain Vulnerabilities: {supplyChainVulnerabilities}
        - Import Cost Trends: {importCostTrends}
        
        Market Opportunities:
        - Untapped Markets: {untappedMarkets}
        - Emerging Trade Partners: {emergingTradePartners}
        - New Product Opportunities: {newProductOpportunities}
        - Trade Agreement Potential: {tradeAgreementPotential}
        
        Infrastructure and Logistics:
        - Transportation Infrastructure: {transportationInfrastructure}
        - Logistics Efficiency: {logisticsEfficiency}
        - Trade Facilitation: {tradeFacilitation}
        - Digital Trade Capabilities: {digitalTradeCapabilities}
        
        Analyze and recommend:
        1. Trade route optimization strategies
        2. Market diversification opportunities
        3. Export promotion priorities
        4. Import substitution strategies
        5. Infrastructure investment needs
        6. Trade policy recommendations
        
        Respond in JSON format with:
        - tradeOptimization: object (route and partner optimization)
        - marketDiversification: array (new market opportunities)
        - exportPromotion: array (export enhancement strategies)
        - importStrategy: object (import optimization and substitution)
        - infrastructureNeeds: array (trade infrastructure priorities)
        - policyRecommendations: array (trade policy suggestions)
        - riskMitigation: array (trade risk management strategies)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'tradeVolume', 'tradeBalance', 'majorTradingPartners'
      ],
      optionalVariables: [
        'tradeRouteEfficiency', 'primaryExports', 'exportCompetitiveness',
        'exportDiversification', 'valueAddedExports', 'criticalImports',
        'importSubstitutionPotential', 'supplyChainVulnerabilities',
        'importCostTrends', 'untappedMarkets', 'emergingTradePartners',
        'newProductOpportunities', 'tradeAgreementPotential',
        'transportationInfrastructure', 'logisticsEfficiency',
        'tradeFacilitation', 'digitalTradeCapabilities'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.35,
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

    // Resource Management APT
    this.registerAPT({
      id: 'resource-management-optimization',
      name: 'Resource Management Optimization',
      description: 'Analyzes natural resource extraction and sustainability strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze resource management and sustainability strategies:
        
        Resource Inventory:
        - Available Natural Resources: {availableNaturalResources}
        - Resource Reserves: {resourceReserves}
        - Resource Quality: {resourceQuality}
        - Extraction Capacity: {extractionCapacity}
        
        Current Utilization:
        - Resource Extraction Rate: {resourceExtractionRate}
        - Resource Efficiency: {resourceEfficiency}
        - Waste Generation: {wasteGeneration}
        - Recycling Rate: {recyclingRate}
        
        Economic Impact:
        - Resource Revenue: {resourceRevenue}
        - Employment in Resource Sector: {employmentInResourceSector}
        - Resource Export Potential: {resourceExportPotential}
        - Value-Added Processing: {valueAddedProcessing}
        
        Environmental Considerations:
        - Environmental Impact: {environmentalImpact}
        - Sustainability Index: {sustainabilityIndex}
        - Renewable Resource Potential: {renewableResourcePotential}
        - Conservation Measures: {conservationMeasures}
        
        Technology and Innovation:
        - Extraction Technology Level: {extractionTechnologyLevel}
        - Processing Technology: {processingTechnology}
        - Alternative Resource Development: {alternativeResourceDevelopment}
        - Research and Development: {researchAndDevelopment}
        
        Analyze and recommend:
        1. Optimal resource extraction strategies
        2. Sustainability and conservation measures
        3. Technology investment priorities
        4. Value-added processing opportunities
        5. Environmental protection strategies
        6. Long-term resource security planning
        
        Respond in JSON format with:
        - extractionStrategy: object (optimal extraction approach)
        - sustainabilityMeasures: array (conservation and sustainability actions)
        - technologyInvestments: array (technology upgrade priorities)
        - valueAddition: object (processing and manufacturing opportunities)
        - environmentalProtection: array (environmental safeguard measures)
        - resourceSecurity: object (long-term resource planning)
        - economicOptimization: object (revenue and employment optimization)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'availableNaturalResources', 'resourceExtractionRate', 'resourceEfficiency'
      ],
      optionalVariables: [
        'resourceReserves', 'resourceQuality', 'extractionCapacity',
        'wasteGeneration', 'recyclingRate', 'resourceRevenue',
        'employmentInResourceSector', 'resourceExportPotential',
        'valueAddedProcessing', 'environmentalImpact', 'sustainabilityIndex',
        'renewableResourcePotential', 'conservationMeasures',
        'extractionTechnologyLevel', 'processingTechnology',
        'alternativeResourceDevelopment', 'researchAndDevelopment'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 900000, // 15 minutes
      estimatedExecutionTime: 2600,
      memoryUsage: 60 * 1024 * 1024,
      complexity: 'high'
    });

    // Industrial Development APT
    this.registerAPT({
      id: 'industrial-development-strategy',
      name: 'Industrial Development Strategy',
      description: 'Analyzes manufacturing and production optimization opportunities',
      category: 'civilization',
      promptTemplate: `
        Analyze industrial development and manufacturing optimization:
        
        Current Industrial Base:
        - Manufacturing Output: {manufacturingOutput}
        - Industrial Capacity Utilization: {industrialCapacityUtilization}
        - Manufacturing Employment: {manufacturingEmployment}
        - Industrial Productivity: {industrialProductivity}
        
        Industry Structure:
        - Key Industries: {keyIndustries}
        - Industry Diversification: {industryDiversification}
        - Value Chain Integration: {valueChainIntegration}
        - Competitive Advantages: {competitiveAdvantages}
        
        Technology and Innovation:
        - Manufacturing Technology Level: {manufacturingTechnologyLevel}
        - Automation Level: {automationLevel}
        - R&D Investment: {rdInvestment}
        - Innovation Ecosystem: {innovationEcosystem}
        
        Infrastructure and Resources:
        - Industrial Infrastructure: {industrialInfrastructure}
        - Energy Availability: {energyAvailability}
        - Raw Material Access: {rawMaterialAccess}
        - Transportation Networks: {transportationNetworks}
        
        Market and Trade:
        - Domestic Market Size: {domesticMarketSize}
        - Export Potential: {exportPotential}
        - Import Competition: {importCompetition}
        - Market Access: {marketAccess}
        
        Analyze and recommend:
        1. Industrial development priorities
        2. Manufacturing efficiency improvements
        3. Technology upgrade strategies
        4. Market expansion opportunities
        5. Infrastructure investment needs
        6. Competitiveness enhancement measures
        
        Respond in JSON format with:
        - developmentPriorities: array (industrial development focus areas)
        - efficiencyImprovements: object (manufacturing optimization strategies)
        - technologyUpgrades: array (technology investment priorities)
        - marketExpansion: object (market development strategies)
        - infrastructureNeeds: array (infrastructure investment priorities)
        - competitivenessStrategy: object (competitive advantage enhancement)
        - policySupport: array (government support recommendations)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'manufacturingOutput', 'industrialCapacityUtilization', 'industrialProductivity'
      ],
      optionalVariables: [
        'manufacturingEmployment', 'keyIndustries', 'industryDiversification',
        'valueChainIntegration', 'competitiveAdvantages', 'manufacturingTechnologyLevel',
        'automationLevel', 'rdInvestment', 'innovationEcosystem',
        'industrialInfrastructure', 'energyAvailability', 'rawMaterialAccess',
        'transportationNetworks', 'domesticMarketSize', 'exportPotential',
        'importCompetition', 'marketAccess'
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

    // Innovation Strategy APT
    this.registerAPT({
      id: 'innovation-strategy-analysis',
      name: 'Innovation Strategy Analysis',
      description: 'Analyzes innovation ecosystem and technology development strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze innovation ecosystem and technology development strategies:
        
        Innovation Infrastructure:
        - R&D Investment: {rdInvestment}
        - Research Institutions: {researchInstitutions}
        - Innovation Hubs: {innovationHubs}
        - Technology Transfer Mechanisms: {technologyTransferMechanisms}
        
        Human Capital:
        - STEM Education Quality: {stemEducationQuality}
        - Skilled Workforce Availability: {skilledWorkforceAvailability}
        - Brain Drain/Gain: {brainDrainGain}
        - Entrepreneurial Culture: {entrepreneurialCulture}
        
        Innovation Performance:
        - Patent Applications: {patentApplications}
        - Scientific Publications: {scientificPublications}
        - Technology Adoption Rate: {technologyAdoptionRate}
        - Innovation Index: {innovationIndex}
        
        Business Environment:
        - Startup Ecosystem: {startupEcosystem}
        - Venture Capital Availability: {ventureCapitalAvailability}
        - Regulatory Environment: {regulatoryEnvironment}
        - Intellectual Property Protection: {intellectualPropertyProtection}
        
        Collaboration Networks:
        - Industry-Academia Partnerships: {industryAcademiaPartnerships}
        - International Collaboration: {internationalCollaboration}
        - Innovation Clusters: {innovationClusters}
        - Knowledge Sharing Platforms: {knowledgeSharingPlatforms}
        
        Analyze and recommend:
        1. Innovation ecosystem strengths and weaknesses
        2. Technology development priorities
        3. Human capital development strategies
        4. Innovation infrastructure investments
        5. Policy frameworks for innovation
        6. International collaboration opportunities
        
        Respond in JSON format with:
        - ecosystemAssessment: object (innovation ecosystem evaluation)
        - technologyPriorities: array (key technology development areas)
        - humanCapitalStrategy: object (workforce and education development)
        - infrastructureInvestments: array (innovation infrastructure needs)
        - policyFramework: array (innovation-supporting policies)
        - collaborationStrategy: object (partnership and networking approach)
        - competitiveAdvantage: array (unique innovation strengths)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'rdInvestment', 'stemEducationQuality', 'innovationIndex'
      ],
      optionalVariables: [
        'researchInstitutions', 'innovationHubs', 'technologyTransferMechanisms',
        'skilledWorkforceAvailability', 'brainDrainGain', 'entrepreneurialCulture',
        'patentApplications', 'scientificPublications', 'technologyAdoptionRate',
        'startupEcosystem', 'ventureCapitalAvailability', 'regulatoryEnvironment',
        'intellectualPropertyProtection', 'industryAcademiaPartnerships',
        'internationalCollaboration', 'innovationClusters', 'knowledgeSharingPlatforms'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 1900,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 11000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 900000, // 15 minutes
      estimatedExecutionTime: 2400,
      memoryUsage: 58 * 1024 * 1024,
      complexity: 'high'
    });

    // Labor Market Analysis APT
    this.registerAPT({
      id: 'labor-market-analysis',
      name: 'Labor Market Analysis',
      description: 'Analyzes employment trends and workforce optimization strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze labor market conditions and workforce optimization:
        
        Employment Metrics:
        - Unemployment Rate: {unemploymentRate}
        - Employment Rate: {employmentRate}
        - Labor Force Participation: {laborForceParticipation}
        - Job Creation Rate: {jobCreationRate}
        
        Workforce Composition:
        - Skills Distribution: {skillsDistribution}
        - Education Levels: {educationLevels}
        - Age Demographics: {ageDemographics}
        - Gender Participation: {genderParticipation}
        
        Job Market Dynamics:
        - Job Vacancies: {jobVacancies}
        - Skills Mismatches: {skillsMismatches}
        - Wage Growth: {wageGrowth}
        - Job Mobility: {jobMobility}
        
        Industry Analysis:
        - Growing Sectors: {growingSectors}
        - Declining Sectors: {decliningSectors}
        - Emerging Occupations: {emergingOccupations}
        - Automation Impact: {automationImpact}
        
        Policy Environment:
        - Labor Regulations: {laborRegulations}
        - Training Programs: {trainingPrograms}
        - Social Safety Net: {socialSafetyNet}
        - Immigration Policy: {immigrationPolicy}
        
        Analyze and recommend:
        1. Labor market health assessment
        2. Skills development priorities
        3. Employment policy recommendations
        4. Workforce training strategies
        5. Industry transition support
        6. Future workforce preparation
        
        Respond in JSON format with:
        - marketHealthScore: number (0-1)
        - skillsDevelopment: array (priority skills training areas)
        - employmentPolicies: array (policy recommendations)
        - workforceTraining: object (training program strategies)
        - industryTransition: array (sector transition support)
        - futureWorkforce: object (future skills preparation)
        - inclusionStrategies: array (workforce inclusion improvements)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'unemploymentRate', 'employmentRate', 'laborForceParticipation'
      ],
      optionalVariables: [
        'jobCreationRate', 'skillsDistribution', 'educationLevels',
        'ageDemographics', 'genderParticipation', 'jobVacancies',
        'skillsMismatches', 'wageGrowth', 'jobMobility', 'growingSectors',
        'decliningSectors', 'emergingOccupations', 'automationImpact',
        'laborRegulations', 'trainingPrograms', 'socialSafetyNet',
        'immigrationPolicy'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 1800,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 10000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes
      estimatedExecutionTime: 2200,
      memoryUsage: 55 * 1024 * 1024,
      complexity: 'medium'
    });

    // Currency Policy APT
    this.registerAPT({
      id: 'currency-policy-analysis',
      name: 'Currency Policy Analysis',
      description: 'Analyzes monetary policy and currency management strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze currency policy and monetary management strategies:
        
        Currency Status:
        - Currency Stability: {currencyStability}
        - Exchange Rate Trends: {exchangeRateTrends}
        - Currency Reserves: {currencyReserves}
        - International Currency Status: {internationalCurrencyStatus}
        
        Monetary Policy:
        - Interest Rates: {interestRates}
        - Money Supply Growth: {moneySupplyGrowth}
        - Inflation Rate: {inflationRate}
        - Central Bank Independence: {centralBankIndependence}
        
        Economic Indicators:
        - GDP Growth: {gdpGrowth}
        - Trade Balance: {tradeBalance}
        - Capital Flows: {capitalFlows}
        - Economic Stability: {economicStability}
        
        International Context:
        - Global Economic Conditions: {globalEconomicConditions}
        - Trading Partner Currencies: {tradingPartnerCurrencies}
        - International Agreements: {internationalAgreements}
        - Currency Competition: {currencyCompetition}
        
        Financial System:
        - Banking System Health: {bankingSystemHealth}
        - Financial Market Development: {financialMarketDevelopment}
        - Payment System Efficiency: {paymentSystemEfficiency}
        - Digital Currency Adoption: {digitalCurrencyAdoption}
        
        Analyze and recommend:
        1. Currency stability assessment
        2. Monetary policy optimization
        3. Exchange rate management
        4. International currency strategy
        5. Financial system development
        6. Digital currency integration
        
        Respond in JSON format with:
        - currencyStabilityScore: number (0-1)
        - monetaryPolicyRecommendations: array (policy adjustments)
        - exchangeRateStrategy: object (currency management approach)
        - internationalStrategy: object (global currency positioning)
        - financialSystemDevelopment: array (financial infrastructure improvements)
        - digitalCurrencyStrategy: object (digital currency adoption plan)
        - riskManagement: array (currency risk mitigation strategies)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'currencyStability', 'inflationRate', 'interestRates'
      ],
      optionalVariables: [
        'exchangeRateTrends', 'currencyReserves', 'internationalCurrencyStatus',
        'moneySupplyGrowth', 'centralBankIndependence', 'gdpGrowth',
        'tradeBalance', 'capitalFlows', 'economicStability',
        'globalEconomicConditions', 'tradingPartnerCurrencies',
        'internationalAgreements', 'currencyCompetition', 'bankingSystemHealth',
        'financialMarketDevelopment', 'paymentSystemEfficiency',
        'digitalCurrencyAdoption'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 1900,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 11000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 300000, // 5 minutes
      estimatedExecutionTime: 2300,
      memoryUsage: 58 * 1024 * 1024,
      complexity: 'high'
    });

    // Economic Crisis Response APT
    this.registerAPT({
      id: 'economic-crisis-response',
      name: 'Economic Crisis Response',
      description: 'Analyzes economic crisis scenarios and response strategies',
      category: 'civilization',
      promptTemplate: `
        Analyze economic crisis scenarios and response strategies:
        
        Crisis Indicators:
        - Economic Volatility: {economicVolatility}
        - Financial Stress Index: {financialStressIndex}
        - Market Confidence: {marketConfidence}
        - Crisis Probability: {crisisProbability}
        
        Economic Vulnerabilities:
        - Debt Levels: {debtLevels}
        - External Dependencies: {externalDependencies}
        - Sectoral Imbalances: {sectoralImbalances}
        - Structural Weaknesses: {structuralWeaknesses}
        
        Crisis Impact Assessment:
        - GDP Impact: {gdpImpact}
        - Employment Impact: {employmentImpact}
        - Financial System Impact: {financialSystemImpact}
        - Social Impact: {socialImpact}
        
        Response Capacity:
        - Fiscal Space: {fiscalSpace}
        - Monetary Policy Room: {monetaryPolicyRoom}
        - International Support: {internationalSupport}
        - Institutional Capacity: {institutionalCapacity}
        
        Historical Context:
        - Previous Crises: {previousCrises}
        - Recovery Patterns: {recoveryPatterns}
        - Policy Effectiveness: {policyEffectiveness}
        - Lessons Learned: {lessonsLearned}
        
        Analyze and recommend:
        1. Crisis risk assessment and early warning
        2. Prevention strategies and safeguards
        3. Crisis response policy framework
        4. Recovery and reconstruction planning
        5. Resilience building measures
        6. International coordination strategies
        
        Respond in JSON format with:
        - crisisRiskScore: number (0-1)
        - preventionStrategies: array (crisis prevention measures)
        - responseFramework: object (crisis response policy structure)
        - recoveryPlan: object (post-crisis recovery strategy)
        - resilienceBuilding: array (long-term resilience measures)
        - internationalCoordination: array (global cooperation strategies)
        - contingencyPlanning: object (emergency response preparations)
        - confidence: number (0-1)
      `,
      requiredVariables: [
        'economicVolatility', 'financialStressIndex', 'debtLevels'
      ],
      optionalVariables: [
        'marketConfidence', 'crisisProbability', 'externalDependencies',
        'sectoralImbalances', 'structuralWeaknesses', 'gdpImpact',
        'employmentImpact', 'financialSystemImpact', 'socialImpact',
        'fiscalSpace', 'monetaryPolicyRoom', 'internationalSupport',
        'institutionalCapacity', 'previousCrises', 'recoveryPatterns',
        'policyEffectiveness', 'lessonsLearned'
      ],
      preferredModel: 'claude-3-sonnet',
      temperature: 0.25,
      maxTokens: 2000,
      outputSchema: {},
      outputFormat: 'json',
      timeoutMs: 12000,
      retryAttempts: 2,
      cacheable: true,
      cacheTTL: 180000, // 3 minutes (crisis info changes quickly)
      estimatedExecutionTime: 2600,
      memoryUsage: 62 * 1024 * 1024,
      complexity: 'high'
    });
  }

  protected async executeSystem(context: APIExecutionContext): Promise<EconomicSystemResult> {
    console.log(`💰 Executing Economics System for civilization: ${context.civilizationContext?.id || 'unknown'}`);
    
    const civContext = context.civilizationContext;
    if (!civContext) {
      throw new Error('Economics system requires civilization context');
    }

    // Execute economic analysis and policy evaluation
    const [
      policyAnalysisResult,
      fiscalImpactResult,
      businessCycleResult,
      economicIndicators
    ] = await Promise.all([
      this.executeEconomicPolicyAnalysis(context),
      this.executeFiscalImpactAssessment(context),
      this.executeBusinessCycleAnalysis(context),
      this.calculateEconomicIndicators(civContext)
    ]);

    // Process fiscal policy effects
    const fiscalEffects = await this.processFiscalPolicyEffects(civContext, context);
    
    // Update inflation tracking
    const inflationAnalysis = await this.updateInflationTracking(civContext, context);
    
    // Generate economic events
    const economicEvents = this.generateEconomicEvents(
      policyAnalysisResult,
      fiscalImpactResult,
      businessCycleResult
    );

    // Create policy impact assessment
    const policyImpactAssessment = {
      policyAnalysis: policyAnalysisResult,
      fiscalImpact: fiscalImpactResult,
      businessCycle: businessCycleResult,
      inflationAnalysis,
      timestamp: new Date()
    };

    return {
      gameStateUpdates: {
        economicData: {
          gdp: economicIndicators.gdp,
          gdpGrowthRate: economicIndicators.gdpGrowthRate,
          unemployment: economicIndicators.unemployment,
          inflation: economicIndicators.inflation,
          tradeBalance: economicIndicators.tradeBalance,
          fiscalBalance: economicIndicators.fiscalBalance,
          monetaryPolicy: {
            interestRate: this.getKnob('interest_rate'),
            stance: this.getKnob('monetary_policy_stance')
          }
        },
        fiscalPolicies: fiscalEffects,
        economicIndicators
      },
      systemOutputs: {
        fiscalEffects,
        inflationAnalysis,
        businessCycleStatus: businessCycleResult,
        economicRecommendations: policyAnalysisResult?.implementationPlan || [],
        policyImpactAssessment
      },
      eventsGenerated: economicEvents,
      scheduledActions: []
    };
  }

  protected isRelevantEvent(event: GameEvent, context: APIExecutionContext): boolean {
    const relevantEventTypes = [
      'policy_change',
      'trade_agreement',
      'economic_crisis',
      'market_crash',
      'inflation_spike',
      'recession',
      'technological_breakthrough',
      'natural_disaster',
      'war_declaration',
      'peace_treaty',
      'resource_discovery',
      'infrastructure_completion'
    ];
    
    return relevantEventTypes.includes(event.type);
  }

  // ============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // ============================================================================

  private async executeEconomicPolicyAnalysis(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      currentGDP: civContext.economicData?.gdp || 0,
      gdpGrowthRate: civContext.economicData?.gdpGrowthRate || 0,
      unemploymentRate: civContext.economicData?.unemployment || 0.05,
      inflationRate: civContext.economicData?.inflation || 0.02,
      fiscalBalance: this.calculateFiscalBalance(civContext),
      tradeBalance: civContext.economicData?.tradeBalance || 0,
      gdpGrowthTarget: this.getKnob('gdp_growth_target'),
      inflationTarget: this.getKnob('inflation_target'),
      unemploymentTarget: this.getKnob('unemployment_target'),
      taxRate: this.getKnob('tax_rate'),
      governmentSpending: this.getKnob('government_spending'),
      interestRate: this.getKnob('interest_rate'),
      monetaryPolicyStance: this.getKnob('monetary_policy_stance'),
      recentEconomicEvents: civContext.recentEvents?.filter(e => 
        ['economic_crisis', 'policy_change', 'trade_agreement'].includes(e.type)
      ).slice(-3) || [],
      populationData: {
        totalPopulation: civContext.total_population,
        unemploymentRate: civContext.economicData?.unemployment || 0.05
      }
    };

    try {
      return await this.executeAPT('economic-policy-analysis', variables, context, 'high');
    } catch (error) {
      console.warn('Economic policy analysis APT failed, using fallback:', error);
      return this.calculateFallbackPolicyAnalysis(civContext);
    }
  }

  private async executeFiscalImpactAssessment(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      governmentRevenue: this.calculateGovernmentRevenue(civContext),
      governmentSpending: this.getKnob('government_spending') * (civContext.economicData?.gdp || 0),
      fiscalBalance: this.calculateFiscalBalance(civContext),
      debtToGDPRatio: 0.6, // Would be calculated from actual debt data
      currentGDP: civContext.economicData?.gdp || 0,
      economicGrowth: civContext.economicData?.gdpGrowthRate || 0,
      unemployment: civContext.economicData?.unemployment || 0.05,
      inflation: civContext.economicData?.inflation || 0.02,
      proposedSpendingChanges: this.getProposedSpendingChanges(civContext),
      proposedTaxChanges: this.getProposedTaxChanges(civContext),
      newPrograms: this.getNewPrograms(civContext)
    };

    try {
      return await this.executeAPT('fiscal-impact-assessment', variables, context, 'medium');
    } catch (error) {
      console.warn('Fiscal impact assessment APT failed, using fallback:', error);
      return this.calculateFallbackFiscalImpact(civContext);
    }
  }

  private async executeBusinessCycleAnalysis(context: APIExecutionContext): Promise<any> {
    const civContext = context.civilizationContext!;
    
    const variables = {
      gdpGrowthTrend: this.calculateGDPGrowthTrend(civContext),
      employmentTrend: this.calculateEmploymentTrend(civContext),
      investmentLevels: this.getKnob('infrastructure_spending') * (civContext.economicData?.gdp || 0),
      consumerSpending: this.calculateConsumerSpending(civContext),
      businessConfidence: 0.7, // Would be calculated from business surveys
      leadingIndicators: this.calculateLeadingIndicators(civContext),
      previousCyclePhases: ['expansion', 'peak'], // Would be from historical data
      cycleDuration: 8, // Average cycle duration in periods
      lastRecession: 12, // Periods since last recession
      globalConditions: 'stable', // Would be from global economic data
      tradeRelationships: this.assessTradeRelationships(civContext),
      technologicalChanges: civContext.technologyData?.researchLevel || 0
    };

    try {
      return await this.executeAPT('business-cycle-analysis', variables, context, 'medium');
    } catch (error) {
      console.warn('Business cycle analysis APT failed, using fallback:', error);
      return this.calculateFallbackBusinessCycle(civContext);
    }
  }

  private async calculateEconomicIndicators(civContext: any): Promise<any> {
    const currentGDP = civContext.economicData?.gdp || civContext.total_population * 50000;
    const gdpGrowthRate = this.calculateGDPGrowth(civContext);
    
    return {
      gdp: currentGDP,
      gdpGrowthRate,
      unemployment: civContext.economicData?.unemployment || 0.05,
      inflation: this.calculateInflation(civContext),
      tradeBalance: this.calculateTradeBalance(civContext),
      fiscalBalance: this.calculateFiscalBalance(civContext),
      consumerPriceIndex: 100 + (this.calculateInflation(civContext) * 100),
      producerPriceIndex: 100 + (this.calculateInflation(civContext) * 1.2 * 100),
      employmentRate: 1 - (civContext.economicData?.unemployment || 0.05),
      laborForceParticipation: 0.65,
      productivityGrowth: gdpGrowthRate * 0.6
    };
  }

  private async processFiscalPolicyEffects(civContext: any, context: APIExecutionContext): Promise<any[]> {
    // This would integrate with the FiscalSimulationService
    // For now, return simulated fiscal effects
    
    const effects = [];
    
    // Government spending effect
    if (this.getKnob('government_spending') > 0.15) {
      effects.push({
        policyType: 'spending',
        category: 'government',
        amount: this.getKnob('government_spending') * (civContext.economicData?.gdp || 0),
        effectSize: this.getKnob('fiscal_spending_multiplier') * 0.8,
        duration: 4 // periods
      });
    }
    
    // Social spending effect
    if (this.getKnob('social_spending') > 0.05) {
      effects.push({
        policyType: 'transfer',
        category: 'social',
        amount: this.getKnob('social_spending') * (civContext.economicData?.gdp || 0),
        effectSize: this.getKnob('fiscal_spending_multiplier') * 0.6,
        duration: 6 // periods
      });
    }
    
    return effects;
  }

  private async updateInflationTracking(civContext: any, context: APIExecutionContext): Promise<any> {
    // This would integrate with the InflationTrackingService
    // For now, return simulated inflation analysis
    
    const currentInflation = this.calculateInflation(civContext);
    const targetInflation = this.getKnob('inflation_target');
    
    return {
      currentInflation,
      targetInflation,
      inflationGap: currentInflation - targetInflation,
      trend: currentInflation > targetInflation ? 'rising' : 'falling',
      components: {
        core: currentInflation * 0.8,
        energy: currentInflation * 1.5,
        food: currentInflation * 1.2,
        housing: currentInflation * 0.9
      },
      outlook: currentInflation > targetInflation * 1.5 ? 'concerning' : 'stable'
    };
  }

  private generateEconomicEvents(
    policyResult: any,
    fiscalResult: any,
    businessCycleResult: any
  ): GameEvent[] {
    const events: GameEvent[] = [];
    
    // Generate events based on analysis results
    if (businessCycleResult?.currentPhase === 'contraction') {
      events.push({
        id: `economic_recession_${Date.now()}`,
        type: 'economic_recession',
        source: 'economics_system',
        data: {
          phase: businessCycleResult.currentPhase,
          severity: businessCycleResult.phaseConfidence || 0.7,
          expectedDuration: 3 // periods
        },
        timestamp: new Date(),
        priority: 'critical',
        processed: false
      });
    }
    
    if (policyResult?.riskAssessment?.inflationRisk > 0.7) {
      events.push({
        id: `inflation_warning_${Date.now()}`,
        type: 'inflation_warning',
        source: 'economics_system',
        data: {
          currentInflation: this.calculateInflation(null),
          targetInflation: this.getKnob('inflation_target'),
          riskLevel: policyResult.riskAssessment.inflationRisk
        },
        timestamp: new Date(),
        priority: 'high',
        processed: false
      });
    }
    
    return events;
  }

  // Calculation helper methods
  private calculateGDPGrowth(civContext: any): number {
    const baseGrowth = this.getKnob('gdp_growth_target');
    const fiscalImpact = (this.getKnob('government_spending') - 0.2) * this.getKnob('fiscal_spending_multiplier');
    const populationGrowth = 0.02; // Would come from population system
    
    return baseGrowth + fiscalImpact + populationGrowth * 0.5;
  }

  private calculateInflation(civContext: any): number {
    const baseInflation = this.getKnob('inflation_target');
    const monetaryImpact = (this.getKnob('interest_rate') - 0.05) * -2; // Lower rates = higher inflation
    const demandPressure = Math.max(0, this.getKnob('government_spending') - 0.25) * 2;
    
    return Math.max(0, baseInflation + monetaryImpact + demandPressure);
  }

  private calculateFiscalBalance(civContext: any): number {
    const gdp = civContext?.economicData?.gdp || civContext?.total_population * 50000 || 0;
    const revenue = this.getKnob('tax_rate') * gdp;
    const spending = (this.getKnob('government_spending') + this.getKnob('social_spending')) * gdp;
    
    return revenue - spending;
  }

  private calculateTradeBalance(civContext: any): number {
    const gdp = civContext?.economicData?.gdp || 0;
    const openness = this.getKnob('trade_policy_openness');
    const competitiveness = 1 - (this.calculateInflation(civContext) - 0.02); // Relative to 2% baseline
    
    return gdp * openness * competitiveness * 0.05; // 5% of GDP baseline
  }

  private calculateGovernmentRevenue(civContext: any): number {
    const gdp = civContext?.economicData?.gdp || 0;
    return this.getKnob('tax_rate') * gdp;
  }

  // Fallback calculation methods
  private calculateFallbackPolicyAnalysis(civContext: any): any {
    return {
      fiscalRecommendations: {
        spendingAdjustment: 0,
        taxAdjustment: 0
      },
      monetaryRecommendations: {
        interestRateChange: 0,
        stanceChange: 'maintain'
      },
      tradeRecommendations: {
        opennessChange: 0
      },
      riskAssessment: {
        inflationRisk: 0.3,
        recessionRisk: 0.2
      },
      implementationPlan: ['Monitor economic indicators'],
      expectedOutcomes: {
        gdpGrowthImpact: 0,
        inflationImpact: 0,
        unemploymentImpact: 0
      },
      confidence: 0.4
    };
  }

  private calculateFallbackFiscalImpact(civContext: any): any {
    return {
      shortTermImpact: {
        gdpEffect: 0.01,
        employmentEffect: 0.005
      },
      longTermImpact: {
        gdpEffect: 0.005,
        productivityEffect: 0.002
      },
      fiscalSustainability: {
        debtImpact: 0.02,
        sustainabilityRisk: 'low'
      },
      distributionalEffects: {
        lowIncome: 0.01,
        middleIncome: 0.005,
        highIncome: 0.002
      },
      implementationRisks: ['Administrative capacity'],
      alternativeOptions: ['Gradual implementation'],
      confidence: 0.3
    };
  }

  private calculateFallbackBusinessCycle(civContext: any): any {
    return {
      currentPhase: 'expansion',
      phaseConfidence: 0.6,
      transitionProbabilities: {
        nextPeriod: { expansion: 0.7, peak: 0.2, contraction: 0.1 },
        twoPeriodsOut: { expansion: 0.5, peak: 0.3, contraction: 0.2 },
        threePeriodsOut: { expansion: 0.4, peak: 0.2, contraction: 0.4 }
      },
      keyIndicators: ['GDP growth', 'Employment', 'Investment'],
      policyRecommendations: ['Monitor inflation', 'Maintain fiscal discipline'],
      riskFactors: ['External shocks', 'Policy uncertainty'],
      confidence: 0.5
    };
  }

  // Additional helper methods
  private calculateGDPGrowthTrend(civContext: any): number[] {
    // Would return historical GDP growth data
    return [0.02, 0.025, 0.03, 0.028, 0.032];
  }

  private calculateEmploymentTrend(civContext: any): number[] {
    // Would return historical employment data
    return [0.95, 0.94, 0.96, 0.97, 0.96];
  }

  private calculateConsumerSpending(civContext: any): number {
    const gdp = civContext?.economicData?.gdp || 0;
    return gdp * 0.6; // Consumer spending typically 60% of GDP
  }

  private calculateLeadingIndicators(civContext: any): any {
    return {
      stockMarket: 100 + Math.random() * 20,
      businessInvestment: this.getKnob('infrastructure_spending'),
      consumerConfidence: 0.7,
      newBusinessFormation: 0.05
    };
  }

  private assessTradeRelationships(civContext: any): string {
    const openness = this.getKnob('trade_policy_openness');
    if (openness > 0.8) return 'strong';
    if (openness > 0.5) return 'moderate';
    return 'limited';
  }

  private getProposedSpendingChanges(civContext: any): any {
    // Would come from recent policy decisions
    return {};
  }

  private getProposedTaxChanges(civContext: any): any {
    // Would come from recent policy decisions
    return {};
  }

  private getNewPrograms(civContext: any): any[] {
    // Would come from recent policy decisions
    return [];
  }
}
