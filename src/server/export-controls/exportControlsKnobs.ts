/**
 * Export Controls System AI Knobs Configuration
 * 24 AI-controllable parameters for export policy management and approval processes
 */

export interface ExportControlsKnobs {
  // Policy Management (6 knobs)
  policyStrictness: number;                // 0-100: Overall strictness of export policies
  automaticPolicyUpdates: number;          // 0-100: Frequency of AI-driven policy updates
  threatResponseSensitivity: number;       // 0-100: Sensitivity to security threats
  diplomaticConsiderations: number;        // 0-100: Weight of diplomatic relations in decisions
  economicImpactWeight: number;           // 0-100: Consideration of economic consequences
  technologicalAdvantageProtection: number; // 0-100: Priority on protecting tech advantages

  // License Processing (6 knobs)
  approvalProcessSpeed: number;            // 0-100: Speed of license approval process
  riskAssessmentThoroughness: number;      // 0-100: Depth of risk assessment analysis
  aiRecommendationWeight: number;          // 0-100: Influence of AI recommendations
  humanOversightLevel: number;             // 0-100: Level of human oversight required
  documentationRequirements: number;       // 0-100: Strictness of documentation requirements
  complianceMonitoringIntensity: number;   // 0-100: Intensity of compliance monitoring

  // Risk Assessment (6 knobs)
  politicalRiskWeight: number;             // 0-100: Weight of political risk factors
  securityRiskWeight: number;              // 0-100: Weight of security risk factors
  economicRiskWeight: number;              // 0-100: Weight of economic risk factors
  technologicalRiskWeight: number;         // 0-100: Weight of technological risk factors
  diplomaticRiskWeight: number;            // 0-100: Weight of diplomatic risk factors
  riskToleranceLevel: number;              // 0-100: Overall risk tolerance

  // Enforcement & Compliance (6 knobs)
  violationDetectionSensitivity: number;   // 0-100: Sensitivity of violation detection
  penaltySeverity: number;                 // 0-100: Severity of penalties for violations
  investigationThoroughness: number;       // 0-100: Thoroughness of violation investigations
  complianceReportingFrequency: number;    // 0-100: Frequency of required compliance reports
  auditFrequency: number;                  // 0-100: Frequency of compliance audits
  enforcementConsistency: number;          // 0-100: Consistency of enforcement actions
}

/**
 * Default knob settings for balanced export control management
 */
export const EXPORT_CONTROLS_KNOBS: ExportControlsKnobs = {
  // Policy Management
  policyStrictness: 65,
  automaticPolicyUpdates: 40,
  threatResponseSensitivity: 70,
  diplomaticConsiderations: 60,
  economicImpactWeight: 55,
  technologicalAdvantageProtection: 75,

  // License Processing
  approvalProcessSpeed: 60,
  riskAssessmentThoroughness: 80,
  aiRecommendationWeight: 70,
  humanOversightLevel: 65,
  documentationRequirements: 70,
  complianceMonitoringIntensity: 75,

  // Risk Assessment
  politicalRiskWeight: 25,
  securityRiskWeight: 35,
  economicRiskWeight: 15,
  technologicalRiskWeight: 15,
  diplomaticRiskWeight: 10,
  riskToleranceLevel: 45,

  // Enforcement & Compliance
  violationDetectionSensitivity: 75,
  penaltySeverity: 60,
  investigationThoroughness: 80,
  complianceReportingFrequency: 50,
  auditFrequency: 40,
  enforcementConsistency: 85
};

/**
 * AI Prompts for Export Controls System Analysis
 */
export const EXPORT_CONTROLS_AI_PROMPTS = {
  POLICY_OPTIMIZATION: `
    Optimize export control policies for civilization {civilizationId}:
    
    Current Policy Performance:
    - Total Active Policies: {activePolicies}
    - License Approval Rate: {approvalRate}%
    - Average Processing Time: {processingTime} days
    - Compliance Rate: {complianceRate}%
    - Violation Count: {violationCount}
    
    Current Settings:
    - Policy Strictness: {policyStrictness}%
    - Threat Response Sensitivity: {threatResponseSensitivity}%
    - Diplomatic Considerations: {diplomaticConsiderations}%
    - Economic Impact Weight: {economicImpactWeight}%
    
    Recommend policy adjustments to improve security while maintaining trade relations.
  `,

  RISK_ASSESSMENT: `
    Assess export license risk for application {licenseId}:
    
    Application Details:
    - Destination: {destinationCivilization}
    - Items: {requestedItems}
    - End Use: {endUse}
    - Total Value: {totalValue}
    
    Risk Factors:
    - Political Stability: {politicalStability}/10
    - Security Threat Level: {securityThreat}/10
    - Economic Impact: {economicImpact}/10
    - Technology Sensitivity: {techSensitivity}/10
    
    Risk Weights:
    - Political Risk Weight: {politicalRiskWeight}%
    - Security Risk Weight: {securityRiskWeight}%
    - Economic Risk Weight: {economicRiskWeight}%
    - Technology Risk Weight: {technologicalRiskWeight}%
    
    Provide comprehensive risk assessment and recommendation.
  `,

  COMPLIANCE_ANALYSIS: `
    Analyze export compliance for civilization {civilizationId}:
    
    Compliance Metrics:
    - Active Licenses: {activeLicenses}
    - Compliance Rate: {complianceRate}%
    - Recent Violations: {recentViolations}
    - Audit Findings: {auditFindings}
    
    Monitoring Settings:
    - Compliance Monitoring Intensity: {complianceMonitoringIntensity}%
    - Violation Detection Sensitivity: {violationDetectionSensitivity}%
    - Audit Frequency: {auditFrequency}%
    - Enforcement Consistency: {enforcementConsistency}%
    
    Recommend compliance improvements and monitoring adjustments.
  `,

  DIPLOMATIC_IMPACT: `
    Evaluate diplomatic impact of export control decisions:
    
    Current Situation:
    - Target Civilization: {targetCivilization}
    - Relationship Status: {relationshipStatus}
    - Recent Trade Volume: {tradeVolume}
    - Pending Applications: {pendingApplications}
    
    Policy Context:
    - Diplomatic Considerations Weight: {diplomaticConsiderations}%
    - Economic Impact Weight: {economicImpactWeight}%
    - Security Priority: {securityPriority}%
    
    Proposed Action: {proposedAction}
    
    Assess potential diplomatic consequences and recommend approach.
  `,

  TECHNOLOGY_PROTECTION: `
    Analyze technology protection effectiveness:
    
    Technology Portfolio:
    - Critical Technologies: {criticalTechnologies}
    - Export Requests: {exportRequests}
    - Technology Advantage Score: {techAdvantageScore}/100
    
    Protection Settings:
    - Technological Advantage Protection: {technologicalAdvantageProtection}%
    - Policy Strictness: {policyStrictness}%
    - Risk Tolerance: {riskToleranceLevel}%
    
    Recent Activity:
    - Approved Tech Exports: {approvedTechExports}
    - Denied Applications: {deniedApplications}
    - Competitor Analysis: {competitorAnalysis}
    
    Evaluate technology protection strategy and recommend adjustments.
  `,

  ECONOMIC_BALANCE: `
    Balance export controls with economic interests:
    
    Economic Metrics:
    - Export Revenue: {exportRevenue}
    - Trade Balance: {tradeBalance}
    - Industry Impact: {industryImpact}
    - Employment Effects: {employmentEffects}
    
    Control Settings:
    - Economic Impact Weight: {economicImpactWeight}%
    - Policy Strictness: {policyStrictness}%
    - Approval Process Speed: {approvalProcessSpeed}%
    
    Trade Relationships:
    - Key Trading Partners: {tradingPartners}
    - Restricted Markets: {restrictedMarkets}
    - Pending Trade Deals: {pendingDeals}
    
    Recommend optimal balance between security and economic interests.
  `,

  THREAT_RESPONSE: `
    Respond to emerging security threats:
    
    Threat Assessment:
    - Threat Type: {threatType}
    - Severity Level: {severityLevel}/10
    - Affected Technologies: {affectedTechnologies}
    - Target Civilizations: {targetCivilizations}
    
    Current Response Capability:
    - Threat Response Sensitivity: {threatResponseSensitivity}%
    - Policy Update Speed: {automaticPolicyUpdates}%
    - Risk Assessment Thoroughness: {riskAssessmentThoroughness}%
    
    Recommended Actions:
    - Immediate Policy Changes: {immediateChanges}
    - Enhanced Monitoring: {enhancedMonitoring}
    - Diplomatic Notifications: {diplomaticNotifications}
    
    Develop comprehensive threat response strategy.
  `,

  LICENSE_PROCESSING: `
    Optimize license processing efficiency:
    
    Processing Metrics:
    - Average Processing Time: {averageProcessingTime} days
    - Approval Rate: {approvalRate}%
    - Backlog Size: {backlogSize}
    - Customer Satisfaction: {customerSatisfaction}%
    
    Process Settings:
    - Approval Process Speed: {approvalProcessSpeed}%
    - Human Oversight Level: {humanOversightLevel}%
    - Documentation Requirements: {documentationRequirements}%
    - AI Recommendation Weight: {aiRecommendationWeight}%
    
    Recommend process improvements to balance speed, accuracy, and security.
  `,

  VIOLATION_INVESTIGATION: `
    Investigate export control violation:
    
    Violation Details:
    - Violation Type: {violationType}
    - Severity: {severity}
    - Involved Parties: {involvedParties}
    - Estimated Impact: {estimatedImpact}
    
    Investigation Parameters:
    - Investigation Thoroughness: {investigationThoroughness}%
    - Violation Detection Sensitivity: {violationDetectionSensitivity}%
    - Penalty Severity: {penaltySeverity}%
    - Enforcement Consistency: {enforcementConsistency}%
    
    Evidence: {availableEvidence}
    
    Conduct thorough investigation and recommend enforcement actions.
  `,

  STRATEGIC_REVIEW: `
    Conduct strategic review of export control system:
    
    System Performance:
    - Overall Effectiveness: {overallEffectiveness}%
    - Security Incidents Prevented: {incidentsPrevented}
    - Economic Impact: {economicImpact}
    - Diplomatic Relations: {diplomaticRelations}
    
    Key Metrics:
    - Policy Coverage: {policyCoverage}%
    - Compliance Rate: {complianceRate}%
    - Processing Efficiency: {processingEfficiency}%
    - Stakeholder Satisfaction: {stakeholderSatisfaction}%
    
    Strategic Objectives:
    - Security Goals: {securityGoals}
    - Economic Goals: {economicGoals}
    - Diplomatic Goals: {diplomaticGoals}
    
    Provide comprehensive strategic recommendations for system improvement.
  `
};

export default { EXPORT_CONTROLS_KNOBS, EXPORT_CONTROLS_AI_PROMPTS };

