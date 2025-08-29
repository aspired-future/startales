/**
 * Security Analytics Engine
 * Provides comprehensive analytics for security and defense systems
 */

import { 
  PoliceForce, 
  NationalGuard, 
  Prison, 
  SecurityAnalyticsData,
  SecurityEvent,
  SecurityRecommendation,
  Officer,
  GuardMember,
  Inmate
} from './types';

export interface SecurityMetrics {
  policeEffectiveness: number;
  guardReadiness: number;
  prisonSecurity: number;
  overallSafety: number;
  budgetUtilization: number;
  personnelEfficiency: number;
  publicTrust: number;
  systemResilience: number;
}

export interface ThreatAssessment {
  crimeLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  securityGaps: string[];
  vulnerabilities: string[];
  riskFactors: string[];
  mitigation: string[];
}

export interface PerformanceTrends {
  crimeReduction: number[];
  responseTime: number[];
  clearanceRate: number[];
  recidivism: number[];
  corruption: number[];
  publicSafety: number[];
}

export interface ResourceAllocation {
  policeAllocation: number;
  guardAllocation: number;
  prisonAllocation: number;
  optimalDistribution: {
    police: number;
    guard: number;
    prison: number;
  };
  efficiency: number;
}

export interface SecurityHealth {
  overall: number;
  components: {
    lawEnforcement: number;
    nationalSecurity: number;
    corrections: number;
    publicSafety: number;
  };
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  concerns: string[];
}

export class SecurityAnalytics {
  calculateSecurityMetrics(
    policeForces: PoliceForce[], 
    nationalGuards: NationalGuard[], 
    prisons: Prison[]
  ): SecurityMetrics {
    const policeEffectiveness = this.calculatePoliceEffectiveness(policeForces);
    const guardReadiness = this.calculateGuardReadiness(nationalGuards);
    const prisonSecurity = this.calculatePrisonSecurity(prisons);
    
    const overallSafety = (policeEffectiveness + guardReadiness + prisonSecurity) / 3;
    const budgetUtilization = this.calculateBudgetUtilization(policeForces, nationalGuards, prisons);
    const personnelEfficiency = this.calculatePersonnelEfficiency(policeForces, nationalGuards, prisons);
    const publicTrust = this.calculatePublicTrust(policeForces);
    const systemResilience = this.calculateSystemResilience(policeForces, nationalGuards, prisons);

    return {
      policeEffectiveness,
      guardReadiness,
      prisonSecurity,
      overallSafety,
      budgetUtilization,
      personnelEfficiency,
      publicTrust,
      systemResilience
    };
  }

  assessThreat(
    policeForces: PoliceForce[], 
    nationalGuards: NationalGuard[], 
    prisons: Prison[],
    events: SecurityEvent[]
  ): ThreatAssessment {
    const crimeEvents = events.filter(e => e.type === 'Crime').length;
    const corruptionEvents = events.filter(e => e.type === 'Corruption').length;
    const emergencyEvents = events.filter(e => e.type === 'Emergency').length;
    
    const avgPolicePerformance = policeForces.length > 0 
      ? policeForces.reduce((sum, f) => sum + f.performance.crimeReduction, 0) / policeForces.length 
      : 0;
    
    const avgGuardReadiness = nationalGuards.length > 0 
      ? nationalGuards.reduce((sum, g) => sum + g.readiness, 0) / nationalGuards.length 
      : 0;

    const avgPrisonSecurity = prisons.length > 0 
      ? prisons.reduce((sum, p) => sum + p.performance.security, 0) / prisons.length 
      : 0;

    let crimeLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    if (crimeEvents > 20 || avgPolicePerformance < 40) crimeLevel = 'Critical';
    else if (crimeEvents > 10 || avgPolicePerformance < 60) crimeLevel = 'High';
    else if (crimeEvents > 5 || avgPolicePerformance < 75) crimeLevel = 'Medium';
    else crimeLevel = 'Low';

    const securityGaps = this.identifySecurityGaps(policeForces, nationalGuards, prisons);
    const vulnerabilities = this.identifyVulnerabilities(policeForces, nationalGuards, prisons);
    const riskFactors = this.identifyRiskFactors(events, policeForces, prisons);
    const mitigation = this.suggestMitigation(securityGaps, vulnerabilities, riskFactors);

    return {
      crimeLevel,
      securityGaps,
      vulnerabilities,
      riskFactors,
      mitigation
    };
  }

  analyzePerformanceTrends(
    policeForces: PoliceForce[], 
    prisons: Prison[],
    historicalData?: any[]
  ): PerformanceTrends {
    // Generate simulated trend data (in real implementation, this would use historical data)
    const generateTrend = (base: number, volatility: number = 5) => {
      return Array.from({ length: 12 }, (_, i) => {
        const seasonal = Math.sin((i / 12) * 2 * Math.PI) * 3;
        const random = (Math.random() - 0.5) * volatility;
        return Math.max(0, Math.min(100, base + seasonal + random));
      });
    };

    const avgCrimeReduction = policeForces.length > 0 
      ? policeForces.reduce((sum, f) => sum + f.performance.crimeReduction, 0) / policeForces.length 
      : 50;
    
    const avgResponseTime = policeForces.length > 0 
      ? policeForces.reduce((sum, f) => sum + f.performance.responseTime, 0) / policeForces.length 
      : 10;
    
    const avgClearanceRate = policeForces.length > 0 
      ? policeForces.reduce((sum, f) => sum + f.performance.clearanceRate, 0) / policeForces.length 
      : 60;
    
    const avgRecidivism = prisons.length > 0 
      ? prisons.reduce((sum, p) => sum + p.performance.recidivism, 0) / prisons.length 
      : 30;
    
    const avgCorruption = policeForces.length > 0 
      ? policeForces.reduce((sum, f) => sum + f.corruption, 0) / policeForces.length 
      : 15;

    return {
      crimeReduction: generateTrend(avgCrimeReduction),
      responseTime: generateTrend(avgResponseTime, 2),
      clearanceRate: generateTrend(avgClearanceRate),
      recidivism: generateTrend(avgRecidivism, 3),
      corruption: generateTrend(avgCorruption, 2),
      publicSafety: generateTrend((avgCrimeReduction + avgClearanceRate) / 2)
    };
  }

  analyzeResourceAllocation(
    policeForces: PoliceForce[], 
    nationalGuards: NationalGuard[], 
    prisons: Prison[]
  ): ResourceAllocation {
    const totalBudget = [
      ...policeForces.map(f => f.budget),
      ...nationalGuards.map(g => g.budget),
      ...prisons.map(p => p.budget)
    ].reduce((sum, budget) => sum + budget, 0);

    const policeAllocation = policeForces.reduce((sum, f) => sum + f.budget, 0) / totalBudget * 100;
    const guardAllocation = nationalGuards.reduce((sum, g) => sum + g.budget, 0) / totalBudget * 100;
    const prisonAllocation = prisons.reduce((sum, p) => sum + p.budget, 0) / totalBudget * 100;

    // Calculate optimal distribution based on performance and needs
    const policeNeed = this.calculatePoliceNeed(policeForces);
    const guardNeed = this.calculateGuardNeed(nationalGuards);
    const prisonNeed = this.calculatePrisonNeed(prisons);
    
    const totalNeed = policeNeed + guardNeed + prisonNeed;
    
    const optimalDistribution = {
      police: (policeNeed / totalNeed) * 100,
      guard: (guardNeed / totalNeed) * 100,
      prison: (prisonNeed / totalNeed) * 100
    };

    const efficiency = this.calculateAllocationEfficiency(
      { police: policeAllocation, guard: guardAllocation, prison: prisonAllocation },
      optimalDistribution
    );

    return {
      policeAllocation,
      guardAllocation,
      prisonAllocation,
      optimalDistribution,
      efficiency
    };
  }

  assessSecurityHealth(
    policeForces: PoliceForce[], 
    nationalGuards: NationalGuard[], 
    prisons: Prison[]
  ): SecurityHealth {
    const lawEnforcement = this.calculatePoliceEffectiveness(policeForces);
    const nationalSecurity = this.calculateGuardReadiness(nationalGuards);
    const corrections = this.calculatePrisonSecurity(prisons);
    const publicSafety = this.calculatePublicSafety(policeForces, prisons);

    const overall = (lawEnforcement + nationalSecurity + corrections + publicSafety) / 4;

    let status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
    if (overall >= 90) status = 'Excellent';
    else if (overall >= 75) status = 'Good';
    else if (overall >= 60) status = 'Fair';
    else if (overall >= 40) status = 'Poor';
    else status = 'Critical';

    const concerns = this.identifyHealthConcerns(policeForces, nationalGuards, prisons, overall);

    return {
      overall,
      components: {
        lawEnforcement,
        nationalSecurity,
        corrections,
        publicSafety
      },
      status,
      concerns
    };
  }

  generateOptimizationRecommendations(
    policeForces: PoliceForce[], 
    nationalGuards: NationalGuard[], 
    prisons: Prison[]
  ): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];

    // Analyze police forces
    policeForces.forEach(force => {
      if (force.performance.crimeReduction < 60) {
        recommendations.push({
          type: 'Personnel Training',
          priority: 'High',
          description: `Enhance training programs for ${force.name}`,
          impact: 'Improve crime reduction by 15-25%',
          cost: 150000,
          timeframe: '6-9 months'
        });
      }

      if (force.corruption > 25) {
        recommendations.push({
          type: 'Policy Change',
          priority: 'Critical',
          description: `Implement anti-corruption measures for ${force.name}`,
          impact: 'Reduce corruption by 40-60%',
          cost: 75000,
          timeframe: '3-6 months'
        });
      }

      if (force.performance.responseTime > 12) {
        recommendations.push({
          type: 'Equipment Upgrade',
          priority: 'Medium',
          description: `Improve response capabilities for ${force.name}`,
          impact: 'Reduce response time by 20-30%',
          cost: 200000,
          timeframe: '4-8 months'
        });
      }
    });

    // Analyze national guard
    nationalGuards.forEach(guard => {
      if (guard.readiness < 75) {
        recommendations.push({
          type: 'Equipment Upgrade',
          priority: 'High',
          description: `Modernize equipment for ${guard.name}`,
          impact: 'Increase readiness by 15-20%',
          cost: 500000,
          timeframe: '8-12 months'
        });
      }

      if (guard.performance.training < 70) {
        recommendations.push({
          type: 'Personnel Training',
          priority: 'Medium',
          description: `Enhance training programs for ${guard.name}`,
          impact: 'Improve overall effectiveness by 10-15%',
          cost: 250000,
          timeframe: '6-10 months'
        });
      }
    });

    // Analyze prisons
    prisons.forEach(prison => {
      if (prison.performance.overcrowding > 15) {
        recommendations.push({
          type: 'Facility Improvement',
          priority: 'High',
          description: `Expand capacity for ${prison.name}`,
          impact: 'Reduce overcrowding and improve conditions',
          cost: 2000000,
          timeframe: '12-24 months'
        });
      }

      if (prison.performance.rehabilitation < 50) {
        recommendations.push({
          type: 'Program Expansion',
          priority: 'Medium',
          description: `Expand rehabilitation programs at ${prison.name}`,
          impact: 'Reduce recidivism by 10-20%',
          cost: 300000,
          timeframe: '6-12 months'
        });
      }

      if (prison.performance.security < 70) {
        recommendations.push({
          type: 'Equipment Upgrade',
          priority: 'High',
          description: `Upgrade security systems at ${prison.name}`,
          impact: 'Improve security by 15-25%',
          cost: 400000,
          timeframe: '4-8 months'
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Private helper methods
  private calculatePoliceEffectiveness(policeForces: PoliceForce[]): number {
    if (policeForces.length === 0) return 0;
    
    const totalScore = policeForces.reduce((sum, force) => {
      const performance = force.performance;
      const score = (
        performance.crimeReduction * 0.3 +
        (100 - performance.responseTime * 5) * 0.2 +
        performance.clearanceRate * 0.25 +
        performance.communityTrust * 0.15 +
        performance.officerSafety * 0.1
      );
      return sum + Math.max(0, Math.min(100, score));
    }, 0);
    
    return totalScore / policeForces.length;
  }

  private calculateGuardReadiness(nationalGuards: NationalGuard[]): number {
    if (nationalGuards.length === 0) return 0;
    
    const totalReadiness = nationalGuards.reduce((sum, guard) => {
      const performance = guard.performance;
      const readiness = (
        performance.readiness * 0.3 +
        performance.training * 0.25 +
        performance.equipment * 0.2 +
        performance.morale * 0.15 +
        performance.effectiveness * 0.1
      );
      return sum + Math.max(0, Math.min(100, readiness));
    }, 0);
    
    return totalReadiness / nationalGuards.length;
  }

  private calculatePrisonSecurity(prisons: Prison[]): number {
    if (prisons.length === 0) return 0;
    
    const totalSecurity = prisons.reduce((sum, prison) => {
      const performance = prison.performance;
      const security = (
        performance.security * 0.4 +
        performance.safety * 0.3 +
        (100 - performance.overcrowding) * 0.2 +
        performance.budgetEfficiency * 0.1
      );
      return sum + Math.max(0, Math.min(100, security));
    }, 0);
    
    return totalSecurity / prisons.length;
  }

  private calculateBudgetUtilization(policeForces: PoliceForce[], nationalGuards: NationalGuard[], prisons: Prison[]): number {
    const allBudgets = [
      ...policeForces.map(f => ({ budget: f.budget, performance: f.performance.budgetEfficiency })),
      ...nationalGuards.map(g => ({ budget: g.budget, performance: 75 })), // Estimated performance
      ...prisons.map(p => ({ budget: p.budget, performance: p.performance.budgetEfficiency }))
    ];
    
    if (allBudgets.length === 0) return 0;
    
    const weightedEfficiency = allBudgets.reduce((sum, item) => {
      return sum + (item.performance * item.budget);
    }, 0);
    
    const totalBudget = allBudgets.reduce((sum, item) => sum + item.budget, 0);
    
    return totalBudget > 0 ? weightedEfficiency / totalBudget : 0;
  }

  private calculatePersonnelEfficiency(policeForces: PoliceForce[], nationalGuards: NationalGuard[], prisons: Prison[]): number {
    const policeEfficiency = policeForces.reduce((sum, force) => {
      const avgPerformance = force.officers.reduce((s, o) => s + o.performance, 0) / force.officers.length || 0;
      return sum + avgPerformance;
    }, 0) / (policeForces.length || 1);
    
    const guardEfficiency = nationalGuards.reduce((sum, guard) => {
      return sum + guard.performance.effectiveness;
    }, 0) / (nationalGuards.length || 1);
    
    const prisonEfficiency = prisons.reduce((sum, prison) => {
      return sum + prison.performance.budgetEfficiency;
    }, 0) / (prisons.length || 1);
    
    return (policeEfficiency + guardEfficiency + prisonEfficiency) / 3;
  }

  private calculatePublicTrust(policeForces: PoliceForce[]): number {
    if (policeForces.length === 0) return 50;
    
    const totalTrust = policeForces.reduce((sum, force) => {
      const trust = force.performance.communityTrust - force.corruption;
      return sum + Math.max(0, Math.min(100, trust));
    }, 0);
    
    return totalTrust / policeForces.length;
  }

  private calculateSystemResilience(policeForces: PoliceForce[], nationalGuards: NationalGuard[], prisons: Prison[]): number {
    const diversification = Math.min(100, (policeForces.length + nationalGuards.length + prisons.length) * 10);
    const redundancy = Math.min(100, policeForces.length * 20);
    const adaptability = 70 + Math.random() * 20; // Simulated adaptability score
    
    return (diversification + redundancy + adaptability) / 3;
  }

  private calculatePublicSafety(policeForces: PoliceForce[], prisons: Prison[]): number {
    const policeContribution = this.calculatePoliceEffectiveness(policeForces) * 0.7;
    const prisonContribution = this.calculatePrisonSecurity(prisons) * 0.3;
    
    return policeContribution + prisonContribution;
  }

  private identifySecurityGaps(policeForces: PoliceForce[], nationalGuards: NationalGuard[], prisons: Prison[]): string[] {
    const gaps: string[] = [];
    
    if (policeForces.length === 0) gaps.push('No police forces established');
    if (nationalGuards.length === 0) gaps.push('No national guard units');
    if (prisons.length === 0) gaps.push('No correctional facilities');
    
    policeForces.forEach(force => {
      if (force.specialUnits.length === 0) gaps.push(`${force.name} lacks specialized units`);
      if (force.performance.responseTime > 15) gaps.push(`${force.name} has slow response times`);
    });
    
    prisons.forEach(prison => {
      if (prison.performance.overcrowding > 20) gaps.push(`${prison.name} is severely overcrowded`);
      if (prison.programs.length < 3) gaps.push(`${prison.name} lacks rehabilitation programs`);
    });
    
    return gaps;
  }

  private identifyVulnerabilities(policeForces: PoliceForce[], nationalGuards: NationalGuard[], prisons: Prison[]): string[] {
    const vulnerabilities: string[] = [];
    
    policeForces.forEach(force => {
      if (force.corruption > 30) vulnerabilities.push(`High corruption in ${force.name}`);
      if (force.performance.communityTrust < 40) vulnerabilities.push(`Low public trust in ${force.name}`);
    });
    
    nationalGuards.forEach(guard => {
      if (guard.readiness < 60) vulnerabilities.push(`Low readiness in ${guard.name}`);
      if (guard.performance.morale < 50) vulnerabilities.push(`Poor morale in ${guard.name}`);
    });
    
    prisons.forEach(prison => {
      if (prison.performance.security < 60) vulnerabilities.push(`Security concerns at ${prison.name}`);
      if (prison.performance.recidivism > 40) vulnerabilities.push(`High recidivism from ${prison.name}`);
    });
    
    return vulnerabilities;
  }

  private identifyRiskFactors(events: SecurityEvent[], policeForces: PoliceForce[], prisons: Prison[]): string[] {
    const risks: string[] = [];
    
    const recentCrimes = events.filter(e => e.type === 'Crime' && e.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
    if (recentCrimes > 10) risks.push('High recent crime activity');
    
    const corruptionEvents = events.filter(e => e.type === 'Corruption').length;
    if (corruptionEvents > 5) risks.push('Systemic corruption issues');
    
    const escapeEvents = events.filter(e => e.type === 'Escape').length;
    if (escapeEvents > 0) risks.push('Prison security breaches');
    
    return risks;
  }

  private suggestMitigation(securityGaps: string[], vulnerabilities: string[], riskFactors: string[]): string[] {
    const mitigation: string[] = [];
    
    if (securityGaps.some(gap => gap.includes('response times'))) {
      mitigation.push('Implement rapid response protocols and improve dispatch systems');
    }
    
    if (vulnerabilities.some(vuln => vuln.includes('corruption'))) {
      mitigation.push('Establish independent oversight and anti-corruption units');
    }
    
    if (riskFactors.some(risk => risk.includes('crime activity'))) {
      mitigation.push('Increase patrol frequency and community policing initiatives');
    }
    
    if (securityGaps.some(gap => gap.includes('overcrowded'))) {
      mitigation.push('Expand prison capacity and implement alternative sentencing');
    }
    
    return mitigation;
  }

  private calculatePoliceNeed(policeForces: PoliceForce[]): number {
    return policeForces.reduce((sum, force) => {
      const performanceGap = Math.max(0, 80 - force.performance.crimeReduction);
      const corruptionPenalty = force.corruption;
      return sum + performanceGap + corruptionPenalty;
    }, 0);
  }

  private calculateGuardNeed(nationalGuards: NationalGuard[]): number {
    return nationalGuards.reduce((sum, guard) => {
      const readinessGap = Math.max(0, 85 - guard.readiness);
      const performanceGap = Math.max(0, 80 - guard.performance.effectiveness);
      return sum + readinessGap + performanceGap;
    }, 0);
  }

  private calculatePrisonNeed(prisons: Prison[]): number {
    return prisons.reduce((sum, prison) => {
      const overcrowdingPenalty = Math.max(0, prison.performance.overcrowding);
      const securityGap = Math.max(0, 85 - prison.performance.security);
      const recidivismPenalty = Math.max(0, prison.performance.recidivism - 25);
      return sum + overcrowdingPenalty + securityGap + recidivismPenalty;
    }, 0);
  }

  private calculateAllocationEfficiency(current: any, optimal: any): number {
    const policeDiff = Math.abs(current.police - optimal.police);
    const guardDiff = Math.abs(current.guard - optimal.guard);
    const prisonDiff = Math.abs(current.prison - optimal.prison);
    
    const totalDifference = policeDiff + guardDiff + prisonDiff;
    return Math.max(0, 100 - totalDifference);
  }

  private identifyHealthConcerns(policeForces: PoliceForce[], nationalGuards: NationalGuard[], prisons: Prison[], overall: number): string[] {
    const concerns: string[] = [];
    
    if (overall < 60) concerns.push('Overall security system performance is below acceptable levels');
    
    const avgPolicePerformance = this.calculatePoliceEffectiveness(policeForces);
    if (avgPolicePerformance < 60) concerns.push('Police effectiveness needs improvement');
    
    const avgGuardReadiness = this.calculateGuardReadiness(nationalGuards);
    if (avgGuardReadiness < 70) concerns.push('National Guard readiness is insufficient');
    
    const avgPrisonSecurity = this.calculatePrisonSecurity(prisons);
    if (avgPrisonSecurity < 70) concerns.push('Prison security systems require attention');
    
    const avgCorruption = policeForces.reduce((sum, f) => sum + f.corruption, 0) / (policeForces.length || 1);
    if (avgCorruption > 25) concerns.push('Corruption levels are concerning');
    
    return concerns;
  }
}
