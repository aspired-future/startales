/**
 * Government Contracts Enhanced Knob System
 * 24 AI-controllable knobs for contract management
 */

export interface GovernmentContractsKnobs {
  // Bidding Process Knobs (1-8)
  competitiveBiddingRate: number;       // 0-100: Percentage of contracts using competitive bidding
  biddingPeriodLength: number;          // 0-100: Length of bidding periods (days scaled)
  prequalificationStrictness: number;   // 0-100: Strictness of bidder prequalification
  smallBusinessPreference: number;      // 0-100: Preference given to small businesses
  localContractorBonus: number;         // 0-100: Bonus for local/domestic contractors
  emergencyContractThreshold: number;   // 0-100: Threshold for emergency procurement
  solesourceJustificationLevel: number; // 0-100: Difficulty of sole-source justification
  bidProtestResolutionTime: number;     // 0-100: Speed of resolving bid protests

  // Contract Performance Knobs (9-16)
  performanceMonitoringIntensity: number; // 0-100: Frequency of performance reviews
  milestoneFlexibility: number;          // 0-100: Flexibility in milestone adjustments
  qualityStandardStrictness: number;     // 0-100: Strictness of quality requirements
  scheduleComplianceWeight: number;      // 0-100: Importance of meeting deadlines
  costOverrunTolerance: number;          // 0-100: Tolerance for budget overruns
  contractModificationEase: number;      // 0-100: Ease of modifying contracts
  performanceBonusPenaltyRate: number;   // 0-100: Rate of performance bonuses/penalties
  contractorRatingImpact: number;        // 0-100: Impact of ratings on future contracts

  // Financial Management Knobs (17-24)
  budgetAllocationSpeed: number;         // 0-100: Speed of budget allocation
  paymentProcessingTime: number;         // 0-100: Speed of contractor payments
  fundingSourceDiversification: number; // 0-100: Use of multiple funding sources
  fiscalYearCarryoverRate: number;       // 0-100: Rate of unused funds carried over
  contractValueInflationAdjustment: number; // 0-100: Automatic inflation adjustments
  auditFrequency: number;                // 0-100: Frequency of contract audits
  fraudDetectionSensitivity: number;     // 0-100: Sensitivity of fraud detection
  contractTerminationPenalty: number;    // 0-100: Penalty for contract termination
}

export const DEFAULT_GOVERNMENT_CONTRACTS_KNOBS: GovernmentContractsKnobs = {
  // Bidding Process Knobs
  competitiveBiddingRate: 85,
  biddingPeriodLength: 60,
  prequalificationStrictness: 50,
  smallBusinessPreference: 30,
  localContractorBonus: 20,
  emergencyContractThreshold: 15,
  solesourceJustificationLevel: 70,
  bidProtestResolutionTime: 45,

  // Contract Performance Knobs
  performanceMonitoringIntensity: 60,
  milestoneFlexibility: 40,
  qualityStandardStrictness: 75,
  scheduleComplianceWeight: 70,
  costOverrunTolerance: 25,
  contractModificationEase: 35,
  performanceBonusPenaltyRate: 50,
  contractorRatingImpact: 65,

  // Financial Management Knobs
  budgetAllocationSpeed: 55,
  paymentProcessingTime: 70,
  fundingSourceDiversification: 40,
  fiscalYearCarryoverRate: 20,
  contractValueInflationAdjustment: 30,
  auditFrequency: 45,
  fraudDetectionSensitivity: 60,
  contractTerminationPenalty: 55
};

export const CONTRACT_CATEGORY_KNOB_PRESETS: Record<string, Partial<GovernmentContractsKnobs>> = {
  'defense': {
    competitiveBiddingRate: 70,
    prequalificationStrictness: 85,
    smallBusinessPreference: 15,
    emergencyContractThreshold: 25,
    performanceMonitoringIntensity: 85,
    qualityStandardStrictness: 90,
    scheduleComplianceWeight: 85,
    auditFrequency: 70,
    fraudDetectionSensitivity: 80
  },
  'infrastructure': {
    competitiveBiddingRate: 95,
    biddingPeriodLength: 80,
    localContractorBonus: 40,
    milestoneFlexibility: 60,
    costOverrunTolerance: 35,
    contractModificationEase: 50,
    budgetAllocationSpeed: 40,
    fiscalYearCarryoverRate: 30
  },
  'research': {
    competitiveBiddingRate: 60,
    prequalificationStrictness: 40,
    smallBusinessPreference: 50,
    milestoneFlexibility: 70,
    qualityStandardStrictness: 60,
    contractModificationEase: 65,
    performanceBonusPenaltyRate: 70,
    contractValueInflationAdjustment: 50
  },
  'social': {
    competitiveBiddingRate: 90,
    smallBusinessPreference: 60,
    localContractorBonus: 50,
    performanceMonitoringIntensity: 70,
    milestoneFlexibility: 55,
    costOverrunTolerance: 40,
    paymentProcessingTime: 85,
    auditFrequency: 55
  }
};

/**
 * AI Prompts for Government Contracts System
 */
export const GOVERNMENT_CONTRACTS_AI_PROMPTS = {
  CONTRACT_OPTIMIZATION: `
    Optimize contract management for {category} contracts:
    
    Current Performance:
    - Average Schedule Performance: {schedulePerformance}%
    - Average Cost Performance: {costPerformance}%
    - Average Quality Rating: {qualityRating}%
    - Active Contracts: {activeContracts}
    
    Current Knob Settings:
    - Competitive Bidding Rate: {competitiveBiddingRate}%
    - Performance Monitoring: {performanceMonitoringIntensity}%
    - Quality Standards: {qualityStandardStrictness}%
    
    Recommend knob adjustments to improve overall performance.
  `,

  BIDDING_STRATEGY: `
    Analyze bidding strategy for {contractTitle}:
    
    Contract Details:
    - Value: {totalValue}
    - Duration: {duration} months
    - Category: {category}
    - Priority: {priority}
    
    Market Conditions:
    - Available Contractors: {availableContractors}
    - Market Competition: {marketCompetition}
    - Economic Climate: {economicClimate}
    
    Current Settings:
    - Bidding Period: {biddingPeriodLength}
    - Prequalification: {prequalificationStrictness}%
    - Small Business Preference: {smallBusinessPreference}%
    
    Recommend bidding approach and timeline.
  `,

  PERFORMANCE_ANALYSIS: `
    Analyze contractor performance for ongoing contracts:
    
    Contractor: {contractorName}
    Contract Performance:
    - Schedule: {schedulePerformance}% (Target: ≥80%)
    - Cost: {costPerformance}% (Target: ≥85%)
    - Quality: {qualityRating}% (Target: ≥75%)
    - Issues Reported: {issuesReported}
    
    Contract Settings:
    - Monitoring Intensity: {performanceMonitoringIntensity}%
    - Milestone Flexibility: {milestoneFlexibility}%
    - Modification Ease: {contractModificationEase}%
    
    Recommend performance improvement actions.
  `,

  BUDGET_ALLOCATION: `
    Optimize budget allocation across contract categories:
    
    Available Budget: {totalBudget}
    Current Allocation:
    - Defense: {defenseAllocation} ({defensePercentage}%)
    - Infrastructure: {infrastructureAllocation} ({infrastructurePercentage}%)
    - Research: {researchAllocation} ({researchPercentage}%)
    - Social: {socialAllocation} ({socialPercentage}%)
    
    Priority Factors:
    - Economic Growth: {economicGrowthPriority}
    - National Security: {nationalSecurityPriority}
    - Social Welfare: {socialWelfarePriority}
    - Innovation: {innovationPriority}
    
    Recommend optimal budget distribution.
  `,

  RISK_ASSESSMENT: `
    Assess contract risks and mitigation strategies:
    
    Contract: {contractTitle}
    Risk Factors:
    - Technical Complexity: {technicalComplexity}/10
    - Market Competition: {marketCompetition}/10
    - Contractor Experience: {contractorExperience}/10
    - Timeline Pressure: {timelinePressure}/10
    
    Current Risk Settings:
    - Quality Standards: {qualityStandardStrictness}%
    - Cost Overrun Tolerance: {costOverrunTolerance}%
    - Performance Monitoring: {performanceMonitoringIntensity}%
    
    Identify key risks and recommend mitigation measures.
  `
};

/**
 * Knob Descriptions for UI
 */
export const GOVERNMENT_CONTRACTS_KNOB_DESCRIPTIONS = {
  competitiveBiddingRate: "Percentage of contracts awarded through competitive bidding",
  biddingPeriodLength: "Duration allowed for contractors to prepare and submit bids",
  prequalificationStrictness: "Strictness of contractor prequalification requirements",
  smallBusinessPreference: "Preference given to small business contractors in awards",
  localContractorBonus: "Bonus points for local or domestic contractors",
  emergencyContractThreshold: "Threshold for bypassing normal procurement for emergencies",
  solesourceJustificationLevel: "Difficulty level for justifying sole-source contracts",
  bidProtestResolutionTime: "Speed of resolving contractor bid protests and disputes",
  
  performanceMonitoringIntensity: "Frequency and depth of contractor performance monitoring",
  milestoneFlexibility: "Flexibility allowed in adjusting contract milestones",
  qualityStandardStrictness: "Strictness of quality standards and acceptance criteria",
  scheduleComplianceWeight: "Importance placed on meeting contract deadlines",
  costOverrunTolerance: "Tolerance for contractor cost overruns before penalties",
  contractModificationEase: "Ease of modifying contracts after award",
  performanceBonusPenaltyRate: "Rate of performance bonuses and penalties applied",
  contractorRatingImpact: "Impact of performance ratings on future contract awards",
  
  budgetAllocationSpeed: "Speed of allocating budget funds to awarded contracts",
  paymentProcessingTime: "Speed of processing payments to contractors",
  fundingSourceDiversification: "Use of multiple funding sources for contracts",
  fiscalYearCarryoverRate: "Rate of unused contract funds carried to next fiscal year",
  contractValueInflationAdjustment: "Automatic adjustment of contract values for inflation",
  auditFrequency: "Frequency of contract audits and compliance reviews",
  fraudDetectionSensitivity: "Sensitivity of fraud detection systems",
  contractTerminationPenalty: "Penalty applied for early contract termination"
};
