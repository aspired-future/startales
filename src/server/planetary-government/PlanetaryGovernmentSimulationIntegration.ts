import { Pool } from 'pg';

/**
 * Planetary Government Simulation Integration
 * Connects planetary government AI knobs with the simulation engines
 */

export interface PlanetaryGovernmentKnobs {
  // Economic Management
  budgetAllocation: { value: number; min: number; max: number; description: string };
  taxationPolicy: { value: number; min: number; max: number; description: string };
  tradeOpenness: { value: number; min: number; max: number; description: string };
  economicDiversification: { value: number; min: number; max: number; description: string };
  infrastructureInvestment: { value: number; min: number; max: number; description: string };
  resourceExploitation: { value: number; min: number; max: number; description: string };
  businessRegulation: { value: number; min: number; max: number; description: string };
  innovationIncentives: { value: number; min: number; max: number; description: string };
  
  // Population & Social
  immigrationPolicy: { value: number; min: number; max: number; description: string };
  educationInvestment: { value: number; min: number; max: number; description: string };
  healthcareInvestment: { value: number; min: number; max: number; description: string };
  housingPolicy: { value: number; min: number; max: number; description: string };
  socialServices: { value: number; min: number; max: number; description: string };
  culturalPreservation: { value: number; min: number; max: number; description: string };
  
  // Governance & Administration
  autonomyAssertion: { value: number; min: number; max: number; description: string };
  bureaucracyEfficiency: { value: number; min: number; max: number; description: string };
  transparencyLevel: { value: number; min: number; max: number; description: string };
  participatoryGovernance: { value: number; min: number; max: number; description: string };
  interCityCoordination: { value: number; min: number; max: number; description: string };
  emergencyPreparedness: { value: number; min: number; max: number; description: string };
  
  // Environmental & Infrastructure
  environmentalProtection: { value: number; min: number; max: number; description: string };
  sustainabilityFocus: { value: number; min: number; max: number; description: string };
  planetaryPlanning: { value: number; min: number; max: number; description: string };
  energyPolicy: { value: number; min: number; max: number; description: string };
  transportationDevelopment: { value: number; min: number; max: number; description: string };
}

export interface PlanetaryGovernmentSimulationResults {
  economicImpact: {
    gdpChange: number;
    employmentChange: number;
    inflationChange: number;
    budgetBalance: number;
    tradeBalance: number;
  };
  socialImpact: {
    approvalChange: number;
    qualityOfLifeChange: number;
    educationChange: number;
    healthcareChange: number;
    socialCohesion: number;
  };
  environmentalImpact: {
    sustainabilityChange: number;
    energyEfficiencyChange: number;
    resourceDepletion: number;
    environmentalHealth: number;
  };
  infrastructureImpact: {
    developmentChange: number;
    transportationChange: number;
    communicationChange: number;
    utilityChange: number;
  };
  governanceImpact: {
    autonomyChange: number;
    efficiencyChange: number;
    transparencyChange: number;
    citizenParticipation: number;
  };
  recommendations: string[];
  alerts: string[];
  nextActions: string[];
}

export class PlanetaryGovernmentSimulationIntegration {
  constructor(private pool: Pool) {}

  /**
   * Run AI-powered simulation for planetary government
   */
  async runAISimulation(planetaryGovernmentId: number, knobs: PlanetaryGovernmentKnobs): Promise<PlanetaryGovernmentSimulationResults> {
    console.log(`🤖 Running AI simulation for planetary government ${planetaryGovernmentId}`);
    
    // Get current government data
    const governmentData = await this.getGovernmentData(planetaryGovernmentId);
    
    // Calculate economic impacts based on AI knobs
    const economicImpact = this.calculateEconomicImpact(knobs, governmentData);
    
    // Calculate social impacts
    const socialImpact = this.calculateSocialImpact(knobs, governmentData);
    
    // Calculate environmental impacts
    const environmentalImpact = this.calculateEnvironmentalImpact(knobs, governmentData);
    
    // Calculate infrastructure impacts
    const infrastructureImpact = this.calculateInfrastructureImpact(knobs, governmentData);
    
    // Calculate governance impacts
    const governanceImpact = this.calculateGovernanceImpact(knobs, governmentData);
    
    // Generate AI recommendations
    const recommendations = this.generateRecommendations(knobs, governmentData);
    const alerts = this.generateAlerts(knobs, governmentData);
    const nextActions = this.generateNextActions(knobs, governmentData);
    
    const results: PlanetaryGovernmentSimulationResults = {
      economicImpact,
      socialImpact,
      environmentalImpact,
      infrastructureImpact,
      governanceImpact,
      recommendations,
      alerts,
      nextActions
    };
    
    // Record simulation results
    await this.recordSimulationResults(planetaryGovernmentId, results);
    
    return results;
  }

  /**
   * Run deterministic simulation
   */
  async runDeterministicSimulation(planetaryGovernmentId: number, knobs: PlanetaryGovernmentKnobs): Promise<PlanetaryGovernmentSimulationResults> {
    console.log(`⚙️ Running deterministic simulation for planetary government ${planetaryGovernmentId}`);
    
    // Deterministic calculations based on mathematical models
    const governmentData = await this.getGovernmentData(planetaryGovernmentId);
    
    return {
      economicImpact: {
        gdpChange: this.calculateDeterministicGDPChange(knobs),
        employmentChange: this.calculateDeterministicEmploymentChange(knobs),
        inflationChange: this.calculateDeterministicInflationChange(knobs),
        budgetBalance: this.calculateBudgetBalance(knobs, governmentData),
        tradeBalance: this.calculateTradeBalance(knobs, governmentData)
      },
      socialImpact: {
        approvalChange: this.calculateApprovalChange(knobs),
        qualityOfLifeChange: this.calculateQualityOfLifeChange(knobs),
        educationChange: this.calculateEducationChange(knobs),
        healthcareChange: this.calculateHealthcareChange(knobs),
        socialCohesion: this.calculateSocialCohesion(knobs)
      },
      environmentalImpact: {
        sustainabilityChange: this.calculateSustainabilityChange(knobs),
        energyEfficiencyChange: this.calculateEnergyEfficiencyChange(knobs),
        resourceDepletion: this.calculateResourceDepletion(knobs),
        environmentalHealth: this.calculateEnvironmentalHealth(knobs)
      },
      infrastructureImpact: {
        developmentChange: this.calculateInfrastructureDevelopment(knobs),
        transportationChange: this.calculateTransportationChange(knobs),
        communicationChange: this.calculateCommunicationChange(knobs),
        utilityChange: this.calculateUtilityChange(knobs)
      },
      governanceImpact: {
        autonomyChange: this.calculateAutonomyChange(knobs),
        efficiencyChange: this.calculateEfficiencyChange(knobs),
        transparencyChange: this.calculateTransparencyChange(knobs),
        citizenParticipation: this.calculateCitizenParticipation(knobs)
      },
      recommendations: this.generateDeterministicRecommendations(knobs),
      alerts: this.generateDeterministicAlerts(knobs),
      nextActions: this.generateDeterministicNextActions(knobs)
    };
  }

  /**
   * Run orchestrator simulation (combines AI and deterministic)
   */
  async runOrchestratorSimulation(planetaryGovernmentId: number): Promise<void> {
    console.log(`🎭 Running orchestrator simulation for planetary government ${planetaryGovernmentId}`);
    
    try {
      // Get current knobs
      const knobs = await this.getCurrentKnobs(planetaryGovernmentId);
      
      // Run both AI and deterministic simulations
      const [aiResults, deterministicResults] = await Promise.all([
        this.runAISimulation(planetaryGovernmentId, knobs),
        this.runDeterministicSimulation(planetaryGovernmentId, knobs)
      ]);
      
      // Combine and analyze results
      const combinedResults = this.combineSimulationResults(aiResults, deterministicResults);
      
      // Apply results to government
      await this.applySimulationResults(planetaryGovernmentId, combinedResults);
      
      console.log(`✅ Orchestrator simulation completed for planetary government ${planetaryGovernmentId}`);
    } catch (error) {
      console.error(`❌ Orchestrator simulation failed for planetary government ${planetaryGovernmentId}:`, error);
    }
  }

  private async getGovernmentData(planetaryGovernmentId: number): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM planetary_governments WHERE id = $1',
      [planetaryGovernmentId]
    );
    return result.rows[0];
  }

  private async getCurrentKnobs(planetaryGovernmentId: number): Promise<PlanetaryGovernmentKnobs> {
    const result = await this.pool.query(
      'SELECT knob_settings FROM planetary_government_knobs WHERE planetary_government_id = $1',
      [planetaryGovernmentId]
    );
    
    if (result.rows.length === 0) {
      return this.getDefaultKnobs();
    }
    
    return result.rows[0].knob_settings;
  }

  private getDefaultKnobs(): PlanetaryGovernmentKnobs {
    return {
      // Economic Management
      budgetAllocation: { value: 50, min: 0, max: 100, description: "Budget allocation strategy" },
      taxationPolicy: { value: 50, min: 0, max: 100, description: "Revenue vs growth balance" },
      tradeOpenness: { value: 50, min: 0, max: 100, description: "Interplanetary trade openness" },
      economicDiversification: { value: 50, min: 0, max: 100, description: "Specialization vs diversification" },
      infrastructureInvestment: { value: 50, min: 0, max: 100, description: "Infrastructure priority" },
      resourceExploitation: { value: 50, min: 0, max: 100, description: "Extraction vs conservation" },
      businessRegulation: { value: 50, min: 0, max: 100, description: "Business oversight level" },
      innovationIncentives: { value: 50, min: 0, max: 100, description: "R&D investment" },
      
      // Population & Social
      immigrationPolicy: { value: 50, min: 0, max: 100, description: "Population openness" },
      educationInvestment: { value: 50, min: 0, max: 100, description: "Education system priority" },
      healthcareInvestment: { value: 50, min: 0, max: 100, description: "Healthcare funding" },
      housingPolicy: { value: 50, min: 0, max: 100, description: "Affordable housing balance" },
      socialServices: { value: 50, min: 0, max: 100, description: "Social safety net level" },
      culturalPreservation: { value: 50, min: 0, max: 100, description: "Local vs civilization culture" },
      
      // Governance & Administration
      autonomyAssertion: { value: 50, min: 0, max: 100, description: "Independence from central gov" },
      bureaucracyEfficiency: { value: 50, min: 0, max: 100, description: "Streamlined vs thorough admin" },
      transparencyLevel: { value: 50, min: 0, max: 100, description: "Government openness" },
      participatoryGovernance: { value: 50, min: 0, max: 100, description: "Citizen involvement" },
      interCityCoordination: { value: 50, min: 0, max: 100, description: "City coordination level" },
      emergencyPreparedness: { value: 50, min: 0, max: 100, description: "Crisis response investment" },
      
      // Environmental & Infrastructure
      environmentalProtection: { value: 50, min: 0, max: 100, description: "Development vs conservation" },
      sustainabilityFocus: { value: 50, min: 0, max: 100, description: "Long-term vs short-term focus" },
      planetaryPlanning: { value: 50, min: 0, max: 100, description: "Coordinated vs organic development" },
      energyPolicy: { value: 50, min: 0, max: 100, description: "Renewable vs traditional energy" },
      transportationDevelopment: { value: 50, min: 0, max: 100, description: "Transportation network investment" }
    };
  }

  // Economic impact calculations
  private calculateEconomicImpact(knobs: PlanetaryGovernmentKnobs, governmentData: any) {
    return {
      gdpChange: (knobs.budgetAllocation.value / 100) * 0.05 + 
                 (knobs.innovationIncentives.value / 100) * 0.03 - 0.02,
      employmentChange: (knobs.economicDiversification.value / 100) * 0.04 + 
                       (knobs.educationInvestment.value / 100) * 0.02 - 0.01,
      inflationChange: (knobs.taxationPolicy.value / 100) * 0.02 - 0.01,
      budgetBalance: governmentData.planetary_budget * (knobs.budgetAllocation.value / 100 - 0.5),
      tradeBalance: (knobs.tradeOpenness.value / 100) * 1000000000 - 500000000
    };
  }

  // Social impact calculations
  private calculateSocialImpact(knobs: PlanetaryGovernmentKnobs, governmentData: any) {
    return {
      approvalChange: (knobs.transparencyLevel.value / 100) * 0.06 + 
                     (knobs.socialServices.value / 100) * 0.04 - 0.03,
      qualityOfLifeChange: (knobs.healthcareInvestment.value / 100) * 0.05 + 
                          (knobs.housingPolicy.value / 100) * 0.03 - 0.02,
      educationChange: (knobs.educationInvestment.value / 100) * 0.08 - 0.02,
      healthcareChange: (knobs.healthcareInvestment.value / 100) * 0.07 - 0.01,
      socialCohesion: (knobs.culturalPreservation.value / 100) * 0.04 + 
                     (knobs.participatoryGovernance.value / 100) * 0.03 - 0.01
    };
  }

  // Environmental impact calculations
  private calculateEnvironmentalImpact(knobs: PlanetaryGovernmentKnobs, governmentData: any) {
    return {
      sustainabilityChange: (knobs.sustainabilityFocus.value / 100) * 0.06 - 0.01,
      energyEfficiencyChange: (knobs.energyPolicy.value / 100) * 0.05 - 0.01,
      resourceDepletion: (knobs.resourceExploitation.value / 100) * 0.04,
      environmentalHealth: (knobs.environmentalProtection.value / 100) * 0.08 - 0.02
    };
  }

  // Infrastructure impact calculations
  private calculateInfrastructureImpact(knobs: PlanetaryGovernmentKnobs, governmentData: any) {
    return {
      developmentChange: (knobs.infrastructureInvestment.value / 100) * 0.08 - 0.02,
      transportationChange: (knobs.transportationDevelopment.value / 100) * 0.06 - 0.01,
      communicationChange: (knobs.interCityCoordination.value / 100) * 0.04,
      utilityChange: (knobs.planetaryPlanning.value / 100) * 0.05 - 0.01
    };
  }

  // Governance impact calculations
  private calculateGovernanceImpact(knobs: PlanetaryGovernmentKnobs, governmentData: any) {
    return {
      autonomyChange: (knobs.autonomyAssertion.value / 100) * 0.03,
      efficiencyChange: (knobs.bureaucracyEfficiency.value / 100) * 0.04 - 0.01,
      transparencyChange: (knobs.transparencyLevel.value / 100) * 0.05,
      citizenParticipation: (knobs.participatoryGovernance.value / 100) * 0.06
    };
  }

  // Deterministic calculation methods
  private calculateDeterministicGDPChange(knobs: PlanetaryGovernmentKnobs): number {
    return (knobs.budgetAllocation.value + knobs.innovationIncentives.value) / 200 * 0.08 - 0.02;
  }

  private calculateDeterministicEmploymentChange(knobs: PlanetaryGovernmentKnobs): number {
    return (knobs.economicDiversification.value + knobs.educationInvestment.value) / 200 * 0.06 - 0.01;
  }

  private calculateDeterministicInflationChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.taxationPolicy.value / 100 * 0.03 - 0.015;
  }

  private calculateBudgetBalance(knobs: PlanetaryGovernmentKnobs, governmentData: any): number {
    const spending = knobs.budgetAllocation.value / 100;
    const revenue = knobs.taxationPolicy.value / 100;
    return governmentData.planetary_budget * (revenue - spending);
  }

  private calculateTradeBalance(knobs: PlanetaryGovernmentKnobs, governmentData: any): number {
    return knobs.tradeOpenness.value / 100 * 2000000000 - 1000000000;
  }

  private calculateApprovalChange(knobs: PlanetaryGovernmentKnobs): number {
    return (knobs.transparencyLevel.value + knobs.socialServices.value) / 200 * 0.1 - 0.03;
  }

  private calculateQualityOfLifeChange(knobs: PlanetaryGovernmentKnobs): number {
    return (knobs.healthcareInvestment.value + knobs.housingPolicy.value + knobs.educationInvestment.value) / 300 * 0.12 - 0.02;
  }

  private calculateEducationChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.educationInvestment.value / 100 * 0.1 - 0.02;
  }

  private calculateHealthcareChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.healthcareInvestment.value / 100 * 0.09 - 0.01;
  }

  private calculateSocialCohesion(knobs: PlanetaryGovernmentKnobs): number {
    return (knobs.culturalPreservation.value + knobs.participatoryGovernance.value) / 200 * 0.08;
  }

  private calculateSustainabilityChange(knobs: PlanetaryGovernmentKnobs): number {
    return (knobs.sustainabilityFocus.value + knobs.environmentalProtection.value) / 200 * 0.1 - 0.02;
  }

  private calculateEnergyEfficiencyChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.energyPolicy.value / 100 * 0.08 - 0.01;
  }

  private calculateResourceDepletion(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.resourceExploitation.value / 100 * 0.06;
  }

  private calculateEnvironmentalHealth(knobs: PlanetaryGovernmentKnobs): number {
    return (knobs.environmentalProtection.value + knobs.sustainabilityFocus.value) / 200 * 0.12 - 0.03;
  }

  private calculateInfrastructureDevelopment(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.infrastructureInvestment.value / 100 * 0.1 - 0.02;
  }

  private calculateTransportationChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.transportationDevelopment.value / 100 * 0.08 - 0.01;
  }

  private calculateCommunicationChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.interCityCoordination.value / 100 * 0.06;
  }

  private calculateUtilityChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.planetaryPlanning.value / 100 * 0.07 - 0.01;
  }

  private calculateAutonomyChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.autonomyAssertion.value / 100 * 0.05;
  }

  private calculateEfficiencyChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.bureaucracyEfficiency.value / 100 * 0.06 - 0.01;
  }

  private calculateTransparencyChange(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.transparencyLevel.value / 100 * 0.08;
  }

  private calculateCitizenParticipation(knobs: PlanetaryGovernmentKnobs): number {
    return knobs.participatoryGovernance.value / 100 * 0.09;
  }

  // Recommendation generation
  private generateRecommendations(knobs: PlanetaryGovernmentKnobs, governmentData: any): string[] {
    const recommendations: string[] = [];
    
    if (knobs.budgetAllocation.value < 40) {
      recommendations.push("Consider increasing budget allocation for economic growth");
    }
    if (knobs.transparencyLevel.value < 50) {
      recommendations.push("Improving transparency could boost citizen approval");
    }
    if (knobs.sustainabilityFocus.value < 60) {
      recommendations.push("Long-term sustainability investments recommended");
    }
    if (knobs.interCityCoordination.value > 80) {
      recommendations.push("High coordination is improving efficiency");
    }
    
    return recommendations;
  }

  private generateAlerts(knobs: PlanetaryGovernmentKnobs, governmentData: any): string[] {
    const alerts: string[] = [];
    
    if (knobs.resourceExploitation.value > 80) {
      alerts.push("HIGH: Resource exploitation may cause environmental damage");
    }
    if (knobs.budgetAllocation.value > 90) {
      alerts.push("MEDIUM: High budget allocation may create fiscal risk");
    }
    if (knobs.autonomyAssertion.value > 85) {
      alerts.push("LOW: High autonomy may strain central government relations");
    }
    
    return alerts;
  }

  private generateNextActions(knobs: PlanetaryGovernmentKnobs, governmentData: any): string[] {
    return [
      "Review quarterly performance metrics",
      "Assess citizen feedback on recent policies",
      "Evaluate infrastructure project outcomes",
      "Plan next budget cycle allocations"
    ];
  }

  private generateDeterministicRecommendations(knobs: PlanetaryGovernmentKnobs): string[] {
    return [
      "Optimize budget allocation based on economic models",
      "Balance taxation policy for growth and revenue",
      "Coordinate infrastructure investments with city planning"
    ];
  }

  private generateDeterministicAlerts(knobs: PlanetaryGovernmentKnobs): string[] {
    const alerts: string[] = [];
    
    if (knobs.taxationPolicy.value > 75) {
      alerts.push("High taxation may reduce economic growth");
    }
    if (knobs.budgetAllocation.value < 30) {
      alerts.push("Low budget allocation may limit government effectiveness");
    }
    
    return alerts;
  }

  private generateDeterministicNextActions(knobs: PlanetaryGovernmentKnobs): string[] {
    return [
      "Analyze economic impact of current policies",
      "Review resource allocation efficiency",
      "Update governance protocols"
    ];
  }

  private combineSimulationResults(
    aiResults: PlanetaryGovernmentSimulationResults, 
    deterministicResults: PlanetaryGovernmentSimulationResults
  ): PlanetaryGovernmentSimulationResults {
    // Weighted combination of AI and deterministic results
    const aiWeight = 0.6;
    const deterministicWeight = 0.4;
    
    return {
      economicImpact: {
        gdpChange: aiResults.economicImpact.gdpChange * aiWeight + deterministicResults.economicImpact.gdpChange * deterministicWeight,
        employmentChange: aiResults.economicImpact.employmentChange * aiWeight + deterministicResults.economicImpact.employmentChange * deterministicWeight,
        inflationChange: aiResults.economicImpact.inflationChange * aiWeight + deterministicResults.economicImpact.inflationChange * deterministicWeight,
        budgetBalance: aiResults.economicImpact.budgetBalance * aiWeight + deterministicResults.economicImpact.budgetBalance * deterministicWeight,
        tradeBalance: aiResults.economicImpact.tradeBalance * aiWeight + deterministicResults.economicImpact.tradeBalance * deterministicWeight
      },
      socialImpact: {
        approvalChange: aiResults.socialImpact.approvalChange * aiWeight + deterministicResults.socialImpact.approvalChange * deterministicWeight,
        qualityOfLifeChange: aiResults.socialImpact.qualityOfLifeChange * aiWeight + deterministicResults.socialImpact.qualityOfLifeChange * deterministicWeight,
        educationChange: aiResults.socialImpact.educationChange * aiWeight + deterministicResults.socialImpact.educationChange * deterministicWeight,
        healthcareChange: aiResults.socialImpact.healthcareChange * aiWeight + deterministicResults.socialImpact.healthcareChange * deterministicWeight,
        socialCohesion: aiResults.socialImpact.socialCohesion * aiWeight + deterministicResults.socialImpact.socialCohesion * deterministicWeight
      },
      environmentalImpact: {
        sustainabilityChange: aiResults.environmentalImpact.sustainabilityChange * aiWeight + deterministicResults.environmentalImpact.sustainabilityChange * deterministicWeight,
        energyEfficiencyChange: aiResults.environmentalImpact.energyEfficiencyChange * aiWeight + deterministicResults.environmentalImpact.energyEfficiencyChange * deterministicWeight,
        resourceDepletion: aiResults.environmentalImpact.resourceDepletion * aiWeight + deterministicResults.environmentalImpact.resourceDepletion * deterministicWeight,
        environmentalHealth: aiResults.environmentalImpact.environmentalHealth * aiWeight + deterministicResults.environmentalImpact.environmentalHealth * deterministicWeight
      },
      infrastructureImpact: {
        developmentChange: aiResults.infrastructureImpact.developmentChange * aiWeight + deterministicResults.infrastructureImpact.developmentChange * deterministicWeight,
        transportationChange: aiResults.infrastructureImpact.transportationChange * aiWeight + deterministicResults.infrastructureImpact.transportationChange * deterministicWeight,
        communicationChange: aiResults.infrastructureImpact.communicationChange * aiWeight + deterministicResults.infrastructureImpact.communicationChange * deterministicWeight,
        utilityChange: aiResults.infrastructureImpact.utilityChange * aiWeight + deterministicResults.infrastructureImpact.utilityChange * deterministicWeight
      },
      governanceImpact: {
        autonomyChange: aiResults.governanceImpact.autonomyChange * aiWeight + deterministicResults.governanceImpact.autonomyChange * deterministicWeight,
        efficiencyChange: aiResults.governanceImpact.efficiencyChange * aiWeight + deterministicResults.governanceImpact.efficiencyChange * deterministicWeight,
        transparencyChange: aiResults.governanceImpact.transparencyChange * aiWeight + deterministicResults.governanceImpact.transparencyChange * deterministicWeight,
        citizenParticipation: aiResults.governanceImpact.citizenParticipation * aiWeight + deterministicResults.governanceImpact.citizenParticipation * deterministicWeight
      },
      recommendations: [...aiResults.recommendations, ...deterministicResults.recommendations],
      alerts: [...aiResults.alerts, ...deterministicResults.alerts],
      nextActions: [...aiResults.nextActions, ...deterministicResults.nextActions]
    };
  }

  private async recordSimulationResults(planetaryGovernmentId: number, results: PlanetaryGovernmentSimulationResults): Promise<void> {
    await this.pool.query(`
      INSERT INTO planetary_government_metrics (
        planetary_government_id, 
        economic_metrics, 
        social_metrics, 
        environmental_metrics, 
        infrastructure_metrics, 
        governance_metrics,
        recommendations,
        alerts
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      planetaryGovernmentId,
      JSON.stringify(results.economicImpact),
      JSON.stringify(results.socialImpact),
      JSON.stringify(results.environmentalImpact),
      JSON.stringify(results.infrastructureImpact),
      JSON.stringify(results.governanceImpact),
      JSON.stringify(results.recommendations),
      JSON.stringify(results.alerts)
    ]);
  }

  private async applySimulationResults(planetaryGovernmentId: number, results: PlanetaryGovernmentSimulationResults): Promise<void> {
    // Apply simulation results to the planetary government
    const government = await this.getGovernmentData(planetaryGovernmentId);
    
    const updatedApproval = Math.max(0, Math.min(100, 
      government.approval_rating + results.socialImpact.approvalChange
    ));
    
    const updatedQualityOfLife = Math.max(0, Math.min(100, 
      government.quality_of_life + results.socialImpact.qualityOfLifeChange
    ));
    
    const updatedEnvironmentalHealth = Math.max(0, Math.min(100, 
      government.environmental_health + results.environmentalImpact.environmentalHealth
    ));
    
    await this.pool.query(`
      UPDATE planetary_governments 
      SET 
        approval_rating = $1,
        quality_of_life = $2,
        environmental_health = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [updatedApproval, updatedQualityOfLife, updatedEnvironmentalHealth, planetaryGovernmentId]);
  }
}
