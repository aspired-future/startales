/**
 * War Simulator Service
 * 
 * Comprehensive military combat system with alliance warfare, sensor networks,
 * intelligence operations, and AI-driven morale mechanics.
 */

import { db } from '../storage/db';
import { 
  MilitaryUnit,
  UnitType,
  CombatDomain,
  MoraleSystem,
  MoraleFactors,
  MoraleEvent,
  MoraleRecommendation,
  CombatStats,
  BattleResult,
  AllianceIntegration,
  SensorNetwork,
  IntelligenceOperation
} from './types';

export class WarSimulatorService {

  // ===== CORE BATTLE SIMULATION =====

  async simulateBattle(
    attackingUnits: MilitaryUnit[],
    defendingUnits: MilitaryUnit[],
    battleConditions: BattleConditions
  ): Promise<BattleResult> {
    try {
      // Pre-battle analysis
      const preBattleAnalysis = await this.analyzePreBattle(attackingUnits, defendingUnits, battleConditions);
      
      // Initialize battle state
      const battleState = this.initializeBattleState(attackingUnits, defendingUnits, battleConditions);
      
      // Execute battle phases
      const phases = await this.executeBattlePhases(battleState);
      
      // Calculate final results
      const result = await this.calculateBattleResults(battleState, phases);
      
      // Update unit morale based on battle outcome
      await this.updatePostBattleMorale(attackingUnits, defendingUnits, result);
      
      // Log battle for historical analysis
      await this.logBattleHistory(result);
      
      return result;
    } catch (error) {
      console.error('Battle simulation failed:', error);
      throw new Error('Failed to simulate battle');
    }
  }

  private async analyzePreBattle(
    attackers: MilitaryUnit[],
    defenders: MilitaryUnit[],
    conditions: BattleConditions
  ): Promise<PreBattleAnalysis> {
    // Analyze force compositions
    const attackerStrength = this.calculateForceStrength(attackers);
    const defenderStrength = this.calculateForceStrength(defenders);
    
    // Analyze morale factors
    const attackerMorale = await this.analyzeAverageMorale(attackers);
    const defenderMorale = await this.analyzeAverageMorale(defenders);
    
    // Analyze terrain and environmental factors
    const terrainAdvantage = this.calculateTerrainAdvantage(conditions.terrain, attackers, defenders);
    
    // Analyze technology advantages
    const techAdvantage = this.calculateTechnologyAdvantage(attackers, defenders);
    
    // AI prediction of battle outcome
    const prediction = await this.predictBattleOutcome(
      attackerStrength,
      defenderStrength,
      attackerMorale,
      defenderMorale,
      terrainAdvantage,
      techAdvantage,
      conditions
    );
    
    return {
      attackerStrength,
      defenderStrength,
      attackerMorale,
      defenderMorale,
      terrainAdvantage,
      techAdvantage,
      prediction,
      recommendedTactics: await this.generateTacticalRecommendations(attackers, defenders, conditions)
    };
  }

  private calculateForceStrength(units: MilitaryUnit[]): ForceStrength {
    let totalStrength = 0;
    let totalSize = 0;
    const domainStrength: Record<CombatDomain, number> = {
      land: 0,
      sea: 0,
      air: 0,
      space: 0,
      cyber: 0,
      'multi-domain': 0
    };
    
    for (const unit of units) {
      const unitStrength = this.calculateUnitStrength(unit);
      totalStrength += unitStrength;
      totalSize += unit.size;
      domainStrength[unit.domain] += unitStrength;
    }
    
    return {
      total: totalStrength,
      size: totalSize,
      byDomain: domainStrength,
      averageExperience: units.reduce((sum, u) => sum + u.experience.totalExperience, 0) / units.length,
      averageTraining: units.reduce((sum, u) => sum + u.training.overallTraining, 0) / units.length,
      averageTechnology: units.reduce((sum, u) => sum + u.technology.level, 0) / units.length
    };
  }

  private calculateUnitStrength(unit: MilitaryUnit): number {
    let baseStrength = unit.size;
    
    // Apply morale modifiers
    const moraleModifier = unit.morale.combatEffects.attackBonus / 100;
    baseStrength *= (1 + moraleModifier);
    
    // Apply experience modifiers
    const experienceModifier = unit.experience.experienceBonus;
    baseStrength *= experienceModifier;
    
    // Apply training modifiers
    const trainingModifier = unit.training.trainingBonus;
    baseStrength *= (1 + trainingModifier);
    
    // Apply technology modifiers
    const techModifier = unit.technology.level / 100;
    baseStrength *= (1 + techModifier);
    
    // Apply equipment condition
    const equipmentModifier = unit.condition.equipment.operational / 100;
    baseStrength *= equipmentModifier;
    
    // Apply supply status
    const supplyModifier = Math.min(
      unit.supply.ammunition.current / unit.supply.ammunition.maximum,
      unit.supply.fuel.current / unit.supply.fuel.maximum
    );
    baseStrength *= supplyModifier;
    
    return baseStrength;
  }

  // ===== AI-DRIVEN MORALE ANALYSIS =====

  async analyzeUnitMorale(unit: MilitaryUnit): Promise<MoraleAnalysisResult> {
    try {
      // Gather current morale factors
      const factors = await this.gatherMoraleFactors(unit);
      
      // AI analysis of morale trends
      const trends = await this.analyzeMoraleTrends(unit.morale.moraleHistory);
      
      // Generate AI recommendations
      const recommendations = await this.generateMoraleRecommendations(unit, factors);
      
      // Predict future morale
      const prediction = await this.predictMoraleChanges(unit, factors, trends);
      
      // Update unit's morale AI analysis
      unit.morale.aiAnalysis = {
        primaryMoraleDrivers: this.identifyPrimaryDrivers(factors),
        riskFactors: this.identifyRiskFactors(factors),
        recommendations,
        moraleProjection: prediction,
        comparison: await this.compareMoraleToOthers(unit),
        emergingFactors: await this.detectEmergingFactors(unit),
        factorWeights: await this.calculateFactorWeights(factors),
        lastAnalyzed: new Date(),
        analysisVersion: '1.0'
      };
      
      return {
        currentMorale: unit.morale.currentMorale,
        factors,
        trends,
        recommendations,
        prediction,
        riskLevel: this.calculateMoraleRiskLevel(factors),
        actionRequired: this.determineActionRequired(unit.morale.currentMorale, factors)
      };
    } catch (error) {
      console.error('Morale analysis failed:', error);
      throw new Error('Failed to analyze unit morale');
    }
  }

  private async gatherMoraleFactors(unit: MilitaryUnit): Promise<MoraleFactors> {
    // This would integrate with various game systems to gather real data
    return {
      leadership: {
        commanderCompetence: unit.command.commander.leadership.competence / 100,
        commanderCharisma: unit.command.commander.leadership.charisma / 100,
        commandStructureEfficiency: unit.command.commandEfficiency,
        trustInCommand: this.calculateTrustInCommand(unit)
      },
      combat: {
        recentVictories: await this.getRecentVictories(unit.id),
        recentDefeats: await this.getRecentDefeats(unit.id),
        casualtyRate: this.calculateCasualtyRate(unit),
        combatIntensity: this.calculateRecentCombatIntensity(unit),
        lastBattleOutcome: await this.getLastBattleOutcome(unit.id)
      },
      supply: {
        foodQuality: unit.supply.food.quality,
        equipmentCondition: unit.condition.equipment.operational / 100,
        medicalCare: unit.supply.medical.current / unit.supply.medical.maximum,
        payStatus: await this.getPayStatus(unit.id),
        comfortLevel: this.calculateComfortLevel(unit)
      },
      social: {
        unitCohesion: this.calculateUnitCohesion(unit),
        homeSupport: await this.getHomeSupportLevel(unit.allegiance.civilization),
        causeBeliefStrength: await this.getCauseBeliefStrength(unit),
        culturalFactors: this.calculateCulturalFactors(unit),
        religiousFactors: this.calculateReligiousFactors(unit)
      },
      environment: {
        weatherConditions: this.getWeatherImpact(unit.location),
        terrainFamiliarity: this.getTerrainFamiliarity(unit),
        deploymentDuration: this.getDeploymentDuration(unit),
        restQuality: this.calculateRestQuality(unit),
        communicationWithHome: this.getCommunicationQuality(unit)
      },
      strategic: {
        warProgress: await this.getWarProgress(unit.allegiance.civilization),
        alliedSupport: this.getAlliedSupport(unit),
        enemyStrength: await this.getPerceivedEnemyStrength(unit),
        missionClarity: this.getMissionClarity(unit),
        expectedDuration: await this.getExpectedWarDuration(unit)
      },
      technology: {
        equipmentSuperiority: this.calculateEquipmentSuperiority(unit),
        trainingAdequacy: unit.training.overallTraining / 100,
        technologicalConfidence: this.calculateTechConfidence(unit),
        maintenanceQuality: unit.condition.maintenance.maintenanceEfficiency / 100
      },
      psychological: {
        enemyPropagandaEffect: await this.getEnemyPropagandaEffect(unit),
        ownPropagandaEffect: await this.getOwnPropagandaEffect(unit),
        informationWarfare: await this.getInformationWarfareEffect(unit),
        psychologicalOperations: await this.getPsychOpsEffect(unit)
      }
    };
  }

  private async generateMoraleRecommendations(
    unit: MilitaryUnit,
    factors: MoraleFactors
  ): Promise<MoraleRecommendation[]> {
    const recommendations: MoraleRecommendation[] = [];
    
    // Analyze each factor category for improvement opportunities
    if (factors.leadership.commanderCompetence < 0.6) {
      recommendations.push({
        id: `leadership_${unit.id}_${Date.now()}`,
        type: 'short-term',
        priority: 'high',
        category: 'leadership',
        title: 'Improve Command Competence',
        description: 'Commander requires additional training or replacement to improve unit confidence',
        expectedImpact: 15,
        cost: 1000,
        timeToImplement: 7,
        requirements: ['Training facility access', 'Command approval'],
        risks: ['Temporary leadership disruption']
      });
    }
    
    if (factors.supply.foodQuality < 0.5) {
      recommendations.push({
        id: `supply_${unit.id}_${Date.now()}`,
        type: 'immediate',
        priority: 'critical',
        category: 'supply',
        title: 'Improve Food Quality',
        description: 'Poor food quality is significantly impacting morale. Immediate supply improvement needed.',
        expectedImpact: 20,
        cost: 500,
        timeToImplement: 1,
        requirements: ['Supply chain access', 'Logistics support'],
        risks: ['Supply route vulnerability']
      });
    }
    
    if (factors.combat.casualtyRate > 0.1) {
      recommendations.push({
        id: `medical_${unit.id}_${Date.now()}`,
        type: 'immediate',
        priority: 'critical',
        category: 'medical',
        title: 'Enhanced Medical Support',
        description: 'High casualty rate requires immediate medical reinforcement and better protective equipment',
        expectedImpact: 25,
        cost: 2000,
        timeToImplement: 2,
        requirements: ['Medical personnel', 'Medical supplies', 'Evacuation capability'],
        risks: ['Resource allocation from other units']
      });
    }
    
    if (factors.social.unitCohesion < 0.6) {
      recommendations.push({
        id: `cohesion_${unit.id}_${Date.now()}`,
        type: 'short-term',
        priority: 'medium',
        category: 'social',
        title: 'Unit Cohesion Activities',
        description: 'Implement team-building exercises and shared experiences to improve unit cohesion',
        expectedImpact: 12,
        cost: 200,
        timeToImplement: 3,
        requirements: ['Rest period', 'Activity resources'],
        risks: ['Time away from operational duties']
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async updatePostBattleMorale(
    attackers: MilitaryUnit[],
    defenders: MilitaryUnit[],
    result: BattleResult
  ): Promise<void> {
    // Update morale for all participating units based on battle outcome
    for (const unit of [...attackers, ...defenders]) {
      const wasAttacker = attackers.includes(unit);
      const won = wasAttacker ? result.outcome === 'attacker-victory' : result.outcome === 'defender-victory';
      
      // Calculate morale change based on battle outcome
      let moraleChange = 0;
      
      if (won) {
        moraleChange = 10 + (result.decisiveness * 10); // 10-20 point boost for victory
      } else {
        moraleChange = -(5 + (result.decisiveness * 15)); // -5 to -20 point loss for defeat
      }
      
      // Adjust for casualties
      const casualtyRate = this.calculateBattleCasualtyRate(unit, result);
      moraleChange -= casualtyRate * 30; // Heavy casualties reduce morale gain or increase loss
      
      // Adjust for unit's morale resilience
      const resilience = unit.morale.factors.social.unitCohesion;
      moraleChange *= (0.5 + resilience); // High cohesion units are more resilient
      
      // Apply morale change
      unit.morale.currentMorale = Math.max(0, Math.min(100, unit.morale.currentMorale + moraleChange));
      
      // Create morale history entry
      const moraleEvent: MoraleEvent = {
        type: 'combat',
        subtype: won ? 'victory' : 'defeat',
        severity: result.decisiveness > 0.7 ? 'major' : result.decisiveness > 0.4 ? 'moderate' : 'minor',
        duration: 'medium'
      };
      
      unit.morale.moraleHistory.push({
        timestamp: new Date(),
        morale: unit.morale.currentMorale,
        event: moraleEvent,
        impact: moraleChange,
        description: `Battle ${won ? 'victory' : 'defeat'} with ${casualtyRate * 100}% casualties`,
        factors: unit.morale.factors
      });
      
      // Update unit in database
      await this.updateUnitMorale(unit);
    }
  }

  // ===== ALLIANCE & COALITION WARFARE =====

  async coordinateAllianceAttack(
    allianceUnits: AllianceForce[],
    target: MilitaryUnit[],
    coordinationLevel: number
  ): Promise<AllianceBattleResult> {
    try {
      // Analyze alliance coordination efficiency
      const coordinationEfficiency = await this.calculateCoordinationEfficiency(allianceUnits);
      
      // Plan joint operations
      const operationPlan = await this.planJointOperation(allianceUnits, target, coordinationLevel);
      
      // Execute coordinated attack
      const phases = await this.executeCoordinatedAttack(operationPlan);
      
      // Calculate alliance battle results
      const result = await this.calculateAllianceBattleResults(phases, allianceUnits);
      
      // Update alliance relationships based on performance
      await this.updateAllianceRelationships(allianceUnits, result);
      
      return result;
    } catch (error) {
      console.error('Alliance attack coordination failed:', error);
      throw new Error('Failed to coordinate alliance attack');
    }
  }

  private async calculateCoordinationEfficiency(allianceUnits: AllianceForce[]): Promise<number> {
    let totalEfficiency = 0;
    let totalWeight = 0;
    
    for (const force of allianceUnits) {
      const units = force.units;
      const weight = units.reduce((sum, unit) => sum + unit.size, 0);
      
      // Calculate efficiency factors
      const languageBarrier = 1 - force.integration.languageBarriers;
      const culturalCompatibility = force.integration.culturalCompatibility;
      const trustLevel = force.integration.trustLevel;
      const integrationLevel = force.integration.integrationLevel;
      const communicationQuality = units.reduce((sum, unit) => 
        sum + unit.combatStats.support.communication.networkCapability, 0) / units.length;
      
      const forceEfficiency = (
        languageBarrier * 0.2 +
        culturalCompatibility * 0.2 +
        trustLevel * 0.3 +
        integrationLevel * 0.2 +
        communicationQuality * 0.1
      );
      
      totalEfficiency += forceEfficiency * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? totalEfficiency / totalWeight : 0;
  }

  // ===== SENSOR NETWORKS & INTELLIGENCE =====

  async deploySensorNetwork(
    units: MilitaryUnit[],
    coverage: SensorCoverage,
    duration: number
  ): Promise<SensorNetworkDeployment> {
    try {
      // Analyze sensor capabilities
      const sensorCapabilities = this.analyzeSensorCapabilities(units);
      
      // Calculate optimal sensor placement
      const placement = await this.calculateOptimalSensorPlacement(sensorCapabilities, coverage);
      
      // Deploy sensors
      const deployment = await this.executeSensorDeployment(placement, duration);
      
      // Initialize intelligence collection
      await this.initializeIntelligenceCollection(deployment);
      
      return deployment;
    } catch (error) {
      console.error('Sensor network deployment failed:', error);
      throw new Error('Failed to deploy sensor network');
    }
  }

  async conductIntelligenceOperation(
    operationType: IntelligenceOperationType,
    target: IntelligenceTarget,
    assets: MilitaryUnit[]
  ): Promise<IntelligenceOperationResult> {
    try {
      // Plan intelligence operation
      const operationPlan = await this.planIntelligenceOperation(operationType, target, assets);
      
      // Execute operation
      const execution = await this.executeIntelligenceOperation(operationPlan);
      
      // Analyze collected intelligence
      const analysis = await this.analyzeCollectedIntelligence(execution.intelligence);
      
      // Update threat assessments
      await this.updateThreatAssessments(analysis);
      
      return {
        success: execution.success,
        intelligence: analysis,
        casualties: execution.casualties,
        exposure: execution.exposure,
        followUpRecommendations: await this.generateFollowUpRecommendations(analysis)
      };
    } catch (error) {
      console.error('Intelligence operation failed:', error);
      throw new Error('Failed to conduct intelligence operation');
    }
  }

  // ===== UTILITY METHODS =====

  private calculateTrustInCommand(unit: MilitaryUnit): number {
    // Calculate trust based on commander history and recent decisions
    const commander = unit.command.commander;
    const successRate = commander.experience.victories / 
      (commander.experience.victories + commander.experience.defeats + commander.experience.draws);
    
    const leadershipScore = (
      commander.leadership.charisma +
      commander.leadership.competence +
      commander.leadership.courage
    ) / 300;
    
    return (successRate * 0.6) + (leadershipScore * 0.4);
  }

  private async getRecentVictories(unitId: string): Promise<number> {
    const result = await db.query(`
      SELECT COUNT(*) as victories
      FROM battle_history 
      WHERE (attacker_units @> $1 OR defender_units @> $1)
      AND outcome IN ('attacker-victory', 'defender-victory')
      AND created_at > NOW() - INTERVAL '30 days'
    `, [JSON.stringify([unitId])]);
    
    return parseInt(result.rows[0]?.victories || '0');
  }

  private async getRecentDefeats(unitId: string): Promise<number> {
    const result = await db.query(`
      SELECT COUNT(*) as defeats
      FROM battle_history 
      WHERE (attacker_units @> $1 OR defender_units @> $1)
      AND outcome NOT IN ('attacker-victory', 'defender-victory')
      AND created_at > NOW() - INTERVAL '30 days'
    `, [JSON.stringify([unitId])]);
    
    return parseInt(result.rows[0]?.defeats || '0');
  }

  private calculateCasualtyRate(unit: MilitaryUnit): number {
    const currentStrength = unit.condition.personnel.currentStrength;
    const authorizedStrength = unit.condition.personnel.authorizedStrength;
    return 1 - (currentStrength / authorizedStrength);
  }

  private async updateUnitMorale(unit: MilitaryUnit): Promise<void> {
    await db.query(`
      UPDATE military_units 
      SET morale = $1, updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(unit.morale), unit.id]);
  }

  private identifyPrimaryDrivers(factors: MoraleFactors): string[] {
    const drivers: Array<{factor: string, impact: number}> = [];
    
    // Analyze each factor category for impact
    Object.entries(factors).forEach(([category, categoryFactors]) => {
      Object.entries(categoryFactors).forEach(([factor, value]) => {
        const impact = Math.abs(0.5 - (value as number)); // Distance from neutral
        drivers.push({ factor: `${category}.${factor}`, impact });
      });
    });
    
    // Return top 5 drivers
    return drivers
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5)
      .map(d => d.factor);
  }

  private identifyRiskFactors(factors: MoraleFactors): string[] {
    const risks: string[] = [];
    
    // Identify factors that are critically low
    if (factors.leadership.commanderCompetence < 0.3) risks.push('Command incompetence');
    if (factors.supply.foodQuality < 0.3) risks.push('Poor food quality');
    if (factors.combat.casualtyRate > 0.2) risks.push('High casualty rate');
    if (factors.social.unitCohesion < 0.3) risks.push('Poor unit cohesion');
    if (factors.strategic.warProgress < -0.5) risks.push('Losing war');
    
    return risks;
  }

  private calculateMoraleRiskLevel(factors: MoraleFactors): 'low' | 'medium' | 'high' | 'critical' {
    const riskFactors = this.identifyRiskFactors(factors);
    
    if (riskFactors.length >= 3) return 'critical';
    if (riskFactors.length >= 2) return 'high';
    if (riskFactors.length >= 1) return 'medium';
    return 'low';
  }

  private determineActionRequired(currentMorale: number, factors: MoraleFactors): boolean {
    return currentMorale < 30 || this.calculateMoraleRiskLevel(factors) === 'critical';
  }
}

// ===== SUPPORTING INTERFACES =====

export interface BattleConditions {
  terrain: TerrainType;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  visibility: number; // 0-1
  temperature: number;
  duration: number; // expected battle duration in hours
}

export interface BattleResult {
  outcome: 'attacker-victory' | 'defender-victory' | 'stalemate' | 'mutual-destruction';
  decisiveness: number; // 0-1 (how decisive the victory was)
  duration: number; // actual battle duration in hours
  
  // Casualties
  attackerCasualties: CasualtyReport;
  defenderCasualties: CasualtyReport;
  
  // Battle Analysis
  keyFactors: string[];
  turningPoints: BattleTurningPoint[];
  
  // Post-Battle Status
  territoryControl: TerritoryControl;
  strategicImpact: StrategicImpact;
  
  // Lessons Learned
  tacticalLessons: string[];
  strategicLessons: string[];
}

export interface PreBattleAnalysis {
  attackerStrength: ForceStrength;
  defenderStrength: ForceStrength;
  attackerMorale: number;
  defenderMorale: number;
  terrainAdvantage: number; // -1 to 1
  techAdvantage: number; // -1 to 1
  prediction: BattlePrediction;
  recommendedTactics: TacticalRecommendation[];
}

export interface ForceStrength {
  total: number;
  size: number;
  byDomain: Record<CombatDomain, number>;
  averageExperience: number;
  averageTraining: number;
  averageTechnology: number;
}

export interface MoraleAnalysisResult {
  currentMorale: number;
  factors: MoraleFactors;
  trends: MoraleTrends;
  recommendations: MoraleRecommendation[];
  prediction: MoraleProjection;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

export interface AllianceForce {
  allianceId: string;
  units: MilitaryUnit[];
  integration: AllianceIntegration;
  commandStructure: AllianceCommandStructure;
}

export interface AllianceBattleResult extends BattleResult {
  alliancePerformance: AlliancePerformanceMetrics;
  coordinationEfficiency: number;
  trustImpact: Record<string, number>; // alliance ID -> trust change
}

export interface SensorNetworkDeployment {
  deploymentId: string;
  sensors: DeployedSensor[];
  coverage: SensorCoverage;
  detectionCapability: DetectionCapability;
  vulnerabilities: SensorVulnerability[];
  maintenanceRequirements: MaintenanceRequirement[];
}

export interface IntelligenceOperationResult {
  success: boolean;
  intelligence: CollectedIntelligence;
  casualties: CasualtyReport;
  exposure: number; // 0-1 (how exposed the operation was)
  followUpRecommendations: string[];
}

export const warSimulatorService = new WarSimulatorService();
