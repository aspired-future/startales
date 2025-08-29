/**
 * Legal Analytics - Justice System Performance & Insights
 * 
 * Provides comprehensive analytics for legal system performance including
 * crime statistics, court efficiency, corruption metrics, law enforcement
 * effectiveness, and justice system health indicators.
 */

import { 
  LegalCase,
  Court,
  Crime,
  CorruptionCase,
  LawEnforcementAgency,
  LegalSystemAnalytics,
  JusticeHealthMetrics,
  CrimeAnalytics,
  CourtAnalytics,
  CorruptionAnalytics,
  LawEnforcementAnalytics
} from './types';

export class LegalAnalytics {
  private analyticsHistory: Map<string, LegalSystemAnalytics[]> = new Map();

  /**
   * Generate comprehensive legal system analytics
   */
  generateComprehensiveAnalytics(
    jurisdiction: string,
    legalCases: LegalCase[],
    courts: Court[],
    crimes: Crime[],
    corruptionCases: CorruptionCase[],
    lawEnforcementAgencies: LawEnforcementAgency[]
  ): LegalSystemAnalytics {
    const analytics: LegalSystemAnalytics = {
      jurisdiction,
      justiceHealth: this.calculateJusticeHealth(courts, legalCases, lawEnforcementAgencies),
      crimeStatistics: this.calculateCrimeStatistics(crimes),
      courtPerformance: this.calculateCourtPerformance(courts, legalCases),
      corruptionMetrics: this.calculateCorruptionMetrics(corruptionCases),
      lawEnforcement: this.calculateLawEnforcementMetrics(lawEnforcementAgencies),
      trends: this.calculateLegalTrends(jurisdiction, crimes, legalCases, corruptionCases),
      predictions: this.generateLegalPredictions(jurisdiction, crimes, legalCases, corruptionCases),
      analysisDate: new Date(),
      dataQuality: this.calculateDataQuality(legalCases, courts, crimes, corruptionCases, lawEnforcementAgencies),
      confidence: this.calculateAnalysisConfidence(legalCases, courts, crimes, corruptionCases, lawEnforcementAgencies)
    };

    // Store in history
    this.storeAnalyticsHistory(jurisdiction, analytics);

    return analytics;
  }

  /**
   * Calculate overall justice system health
   */
  private calculateJusticeHealth(
    courts: Court[],
    legalCases: LegalCase[],
    agencies: LawEnforcementAgency[]
  ): JusticeHealthMetrics {
    const accessToJustice = this.calculateAccessToJustice(courts, legalCases);
    const fairness = this.calculateFairness(legalCases, courts);
    const efficiency = this.calculateEfficiency(courts, legalCases);
    const transparency = this.calculateTransparency(courts, agencies);
    const accountability = this.calculateAccountability(agencies, courts);

    const overallScore = (accessToJustice + fairness + efficiency + transparency + accountability) / 5;

    return {
      overallScore,
      components: {
        accessToJustice,
        fairness,
        efficiency,
        transparency,
        accountability
      }
    };
  }

  /**
   * Calculate access to justice metrics
   */
  private calculateAccessToJustice(courts: Court[], legalCases: LegalCase[]): number {
    let score = 70; // Base score

    // Court availability
    const courtsPerCapita = courts.length / 1000000; // Per million population
    score += Math.min(20, courtsPerCapita * 10);

    // Case processing time
    const avgProcessingTime = courts.length > 0 ? 
      courts.reduce((sum, c) => sum + c.performance.averageCaseTime, 0) / courts.length : 180;
    
    if (avgProcessingTime < 90) score += 10;
    else if (avgProcessingTime > 365) score -= 15;

    // Court costs vs income
    const avgCost = legalCases.length > 0 ? 
      legalCases.reduce((sum, c) => sum + c.cost, 0) / legalCases.length : 10000;
    
    if (avgCost < 5000) score += 5;
    else if (avgCost > 25000) score -= 10;

    // Legal representation availability
    const representationRate = 75 + Math.random() * 20; // Simulated 75-95%
    score += (representationRate - 70) * 0.2;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate fairness metrics
   */
  private calculateFairness(legalCases: LegalCase[], courts: Court[]): number {
    let score = 70; // Base score

    // Conviction rate consistency
    const criminalCases = legalCases.filter(c => c.type === 'criminal');
    const convictionRate = criminalCases.length > 0 ? 
      criminalCases.filter(c => c.verdict?.decision === 'guilty').length / criminalCases.length : 0.6;
    
    // Ideal conviction rate is around 60-80%
    if (convictionRate >= 0.6 && convictionRate <= 0.8) score += 10;
    else if (convictionRate < 0.4 || convictionRate > 0.9) score -= 15;

    // Sentencing consistency
    const sentencedCases = criminalCases.filter(c => c.sentence);
    const sentenceVariability = this.calculateSentenceVariability(sentencedCases);
    score += Math.max(-10, Math.min(10, (50 - sentenceVariability) * 0.2));

    // Judge diversity and experience
    const allJudges = courts.flatMap(c => c.judges);
    const avgExperience = allJudges.length > 0 ? 
      allJudges.reduce((sum, j) => sum + j.experience, 0) / allJudges.length : 10;
    
    if (avgExperience >= 10) score += 5;
    if (avgExperience >= 15) score += 5;

    // Appeal success rate (should be moderate)
    const appealRate = 15 + Math.random() * 15; // Simulated 15-30%
    if (appealRate >= 10 && appealRate <= 25) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate efficiency metrics
   */
  private calculateEfficiency(courts: Court[], legalCases: LegalCase[]): number {
    let score = 60; // Base score

    // Case backlog
    const totalBacklog = courts.reduce((sum, c) => sum + c.caseload.backlog, 0);
    const totalCapacity = courts.reduce((sum, c) => sum + c.caseload.pending + c.caseload.inProgress, 0);
    
    const backlogRatio = totalCapacity > 0 ? totalBacklog / totalCapacity : 0;
    score += Math.max(-20, Math.min(20, (0.2 - backlogRatio) * 100));

    // Processing time
    const avgProcessingTime = courts.length > 0 ? 
      courts.reduce((sum, c) => sum + c.performance.averageCaseTime, 0) / courts.length : 180;
    
    if (avgProcessingTime < 60) score += 15;
    else if (avgProcessingTime < 120) score += 10;
    else if (avgProcessingTime > 365) score -= 20;

    // Clearance rate
    const avgClearanceRate = courts.length > 0 ? 
      courts.reduce((sum, c) => sum + c.performance.clearanceRate, 0) / courts.length : 85;
    
    score += (avgClearanceRate - 80) * 0.5;

    // Resource utilization
    const utilizationRate = 75 + Math.random() * 20; // Simulated 75-95%
    score += (utilizationRate - 70) * 0.3;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate transparency metrics
   */
  private calculateTransparency(courts: Court[], agencies: LawEnforcementAgency[]): number {
    let score = 55; // Base score

    // Court proceedings openness
    const publicHearings = 85 + Math.random() * 10; // Simulated 85-95%
    score += (publicHearings - 80) * 0.5;

    // Record accessibility
    const recordAccess = 70 + Math.random() * 25; // Simulated 70-95%
    score += (recordAccess - 60) * 0.3;

    // Agency transparency
    const agencyTransparency = agencies.length > 0 ? 
      agencies.reduce((sum, a) => sum + a.publicRelations.transparency, 0) / agencies.length : 70;
    
    score += (agencyTransparency - 60) * 0.4;

    // Media access
    const mediaAccess = 60 + Math.random() * 30; // Simulated 60-90%
    score += (mediaAccess - 50) * 0.2;

    // Public reporting
    const publicReporting = 65 + Math.random() * 25; // Simulated 65-90%
    score += (publicReporting - 60) * 0.3;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate accountability metrics
   */
  private calculateAccountability(agencies: LawEnforcementAgency[], courts: Court[]): number {
    let score = 65; // Base score

    // Oversight mechanisms
    const oversightScore = agencies.length > 0 ? 
      agencies.filter(a => a.oversight.externalOversight.length > 0).length / agencies.length * 100 : 70;
    
    score += (oversightScore - 50) * 0.3;

    // Complaint handling
    const totalComplaints = agencies.reduce((sum, a) => sum + a.incidents.complaints, 0);
    const totalActions = agencies.reduce((sum, a) => sum + a.incidents.disciplinaryActions, 0);
    
    const actionRate = totalComplaints > 0 ? totalActions / totalComplaints : 0.3;
    if (actionRate >= 0.2 && actionRate <= 0.5) score += 10;

    // Body camera usage
    const bodyCameraRate = agencies.length > 0 ? 
      agencies.filter(a => a.oversight.bodyCamera).length / agencies.length * 100 : 60;
    
    score += (bodyCameraRate - 50) * 0.2;

    // Judicial conduct
    const judicialConduct = 80 + Math.random() * 15; // Simulated 80-95%
    score += (judicialConduct - 75) * 0.4;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate comprehensive crime statistics
   */
  private calculateCrimeStatistics(crimes: Crime[]): CrimeAnalytics {
    const totalCrimes = crimes.length;
    const population = 1000000; // Simulated population
    const crimeRate = (totalCrimes / population) * 100000;

    // Calculate clearance rate
    const solvedCrimes = crimes.filter(c => c.investigation.status === 'solved').length;
    const clearanceRate = totalCrimes > 0 ? (solvedCrimes / totalCrimes) * 100 : 0;

    // Crime by type
    const byType = this.calculateCrimeByType(crimes);

    // Crime by severity
    const bySeverity = {
      misdemeanor: crimes.filter(c => c.severity === 'misdemeanor').length,
      felony: crimes.filter(c => c.severity === 'felony').length,
      capital: crimes.filter(c => c.severity === 'capital').length
    };

    // Victimization analysis
    const victimization = this.calculateVictimizationMetrics(crimes);

    return {
      totalCrimes,
      crimeRate,
      clearanceRate,
      byType,
      bySeverity,
      victimization
    };
  }

  /**
   * Calculate crime statistics by type
   */
  private calculateCrimeByType(crimes: Crime[]): { [crimeType: string]: any } {
    const crimeTypes = ['violent', 'property', 'white_collar', 'drug', 'cyber', 'public_order'];
    const byType: any = {};

    crimeTypes.forEach(type => {
      const typeCrimes = crimes.filter(c => c.type === type);
      const solvedTypeCrimes = typeCrimes.filter(c => c.investigation.status === 'solved');
      
      byType[type] = {
        count: typeCrimes.length,
        rate: (typeCrimes.length / 1000000) * 100000, // Per 100k population
        clearanceRate: typeCrimes.length > 0 ? (solvedTypeCrimes.length / typeCrimes.length) * 100 : 0,
        trend: this.calculateCrimeTrend(type),
        severity: this.calculateAverageSeverity(typeCrimes),
        communityImpact: this.calculateAverageCommunityImpact(typeCrimes)
      };
    });

    return byType;
  }

  /**
   * Calculate victimization metrics
   */
  private calculateVictimizationMetrics(crimes: Crime[]): CrimeAnalytics['victimization'] {
    const allVictims = crimes.flatMap(c => c.victims);
    
    const individualVictims = allVictims.filter(v => v.type === 'individual').length;
    const businessVictims = allVictims.filter(v => v.type === 'business').length;
    const governmentVictims = allVictims.filter(v => v.type === 'government').length;

    // Calculate repeat victimization (simulated)
    const repeatVictimization = 15 + Math.random() * 20; // 15-35%

    return {
      individualVictims,
      businessVictims,
      governmentVictims,
      repeatVictimization
    };
  }

  /**
   * Calculate court performance metrics
   */
  private calculateCourtPerformance(courts: Court[], legalCases: LegalCase[]): CourtAnalytics {
    const totalBacklog = courts.reduce((sum, c) => sum + c.caseload.backlog, 0);
    
    const averageProcessingTime = courts.length > 0 ? 
      courts.reduce((sum, c) => sum + c.performance.averageCaseTime, 0) / courts.length : 0;

    const clearanceRate = courts.length > 0 ? 
      courts.reduce((sum, c) => sum + c.performance.clearanceRate, 0) / courts.length : 0;

    // Calculate appeal and reversal rates
    const appealRate = 15 + Math.random() * 15; // Simulated 15-30%
    const reversalRate = 10 + Math.random() * 15; // Simulated 10-25%

    // Performance by court level
    const byCourtLevel = this.calculateCourtPerformanceByLevel(courts);

    return {
      caseBacklog: totalBacklog,
      averageProcessingTime,
      clearanceRate,
      appealRate,
      reversalRate,
      byCourtLevel
    };
  }

  /**
   * Calculate court performance by level
   */
  private calculateCourtPerformanceByLevel(courts: Court[]): { [level: string]: any } {
    const levels = ['local', 'district', 'appellate', 'supreme'];
    const byLevel: any = {};

    levels.forEach(level => {
      const levelCourts = courts.filter(c => c.level === level);
      
      if (levelCourts.length > 0) {
        const totalCaseload = levelCourts.reduce((sum, c) => 
          sum + c.caseload.pending + c.caseload.inProgress, 0);
        
        const avgEfficiency = levelCourts.reduce((sum, c) => 
          sum + c.performance.efficiency, 0) / levelCourts.length;
        
        const avgPublicConfidence = levelCourts.reduce((sum, c) => 
          sum + c.performance.publicConfidence, 0) / levelCourts.length;

        byLevel[level] = {
          courts: levelCourts.length,
          caseload: totalCaseload,
          efficiency: avgEfficiency,
          publicConfidence: avgPublicConfidence,
          budget: levelCourts.reduce((sum, c) => sum + c.budget, 0)
        };
      }
    });

    return byLevel;
  }

  /**
   * Calculate corruption metrics
   */
  private calculateCorruptionMetrics(corruptionCases: CorruptionCase[]): CorruptionAnalytics {
    const reportedCases = corruptionCases.length;
    const substantiatedCases = corruptionCases.filter(c => c.investigationStatus === 'substantiated').length;
    const convictions = corruptionCases.filter(c => c.consequences.official.convicted).length;

    const convictionRate = substantiatedCases > 0 ? (convictions / substantiatedCases) * 100 : 0;

    const averageMonetaryValue = reportedCases > 0 ? 
      corruptionCases.reduce((sum, c) => sum + c.monetaryValue, 0) / reportedCases : 0;

    // Corruption by type
    const byType = this.calculateCorruptionByType(corruptionCases);

    // Corruption by government level
    const byLevel = {
      local: corruptionCases.filter(c => c.level === 'local').length,
      state: corruptionCases.filter(c => c.level === 'state').length,
      federal: corruptionCases.filter(c => c.level === 'federal').length
    };

    // Prevention effectiveness
    const preventionEffectiveness = 60 + Math.random() * 25;
    const publicAwareness = 45 + Math.random() * 35;

    return {
      reportedCases,
      substantiatedCases,
      convictionRate,
      averageMonetaryValue,
      byType,
      byLevel,
      preventionEffectiveness,
      publicAwareness
    };
  }

  /**
   * Calculate corruption by type
   */
  private calculateCorruptionByType(corruptionCases: CorruptionCase[]): { [type: string]: any } {
    const corruptionTypes = ['bribery', 'embezzlement', 'fraud', 'nepotism', 'abuse_of_power'];
    const byType: any = {};

    corruptionTypes.forEach(type => {
      const typeCases = corruptionCases.filter(c => c.type === type);
      const convictions = typeCases.filter(c => c.consequences.official.convicted).length;
      
      const averageValue = typeCases.length > 0 ? 
        typeCases.reduce((sum, c) => sum + c.monetaryValue, 0) / typeCases.length : 0;

      byType[type] = {
        cases: typeCases.length,
        convictions,
        convictionRate: typeCases.length > 0 ? (convictions / typeCases.length) * 100 : 0,
        averageValue,
        trend: this.calculateCorruptionTrend(type)
      };
    });

    return byType;
  }

  /**
   * Calculate law enforcement metrics
   */
  private calculateLawEnforcementMetrics(agencies: LawEnforcementAgency[]): LawEnforcementAnalytics {
    const totalAgencies = agencies.length;
    const totalOfficers = agencies.reduce((sum, a) => sum + a.personnel.officers, 0);

    // Performance metrics
    const performance = {
      crimeReduction: agencies.length > 0 ? 
        agencies.reduce((sum, a) => sum + a.performance.crimeReduction, 0) / agencies.length : 0,
      publicSafety: agencies.length > 0 ? 
        agencies.reduce((sum, a) => sum + a.performance.publicSafety, 0) / agencies.length : 0,
      communityTrust: agencies.length > 0 ? 
        agencies.reduce((sum, a) => sum + a.performance.communityTrust, 0) / agencies.length : 0,
      responseTime: agencies.length > 0 ? 
        agencies.reduce((sum, a) => sum + a.operations.patrol.responseTime, 0) / agencies.length : 0
    };

    // Accountability metrics
    const accountability = {
      complaints: agencies.reduce((sum, a) => sum + a.incidents.complaints, 0),
      disciplinaryActions: agencies.reduce((sum, a) => sum + a.incidents.disciplinaryActions, 0),
      useOfForceIncidents: agencies.reduce((sum, a) => sum + a.incidents.useOfForce, 0),
      bodyCamera: agencies.length > 0 ? 
        (agencies.filter(a => a.oversight.bodyCamera).length / agencies.length) * 100 : 0
    };

    // Community relations
    const communityRelations = {
      programParticipation: agencies.reduce((sum, a) => sum + a.communityPrograms.length, 0),
      publicApproval: agencies.length > 0 ? 
        agencies.reduce((sum, a) => sum + a.publicRelations.approval, 0) / agencies.length : 0,
      diversityIndex: 60 + Math.random() * 30 // Simulated diversity index
    };

    return {
      totalAgencies,
      totalOfficers,
      performance,
      accountability,
      communityRelations
    };
  }

  /**
   * Calculate legal system trends
   */
  private calculateLegalTrends(
    jurisdiction: string,
    crimes: Crime[],
    legalCases: LegalCase[],
    corruptionCases: CorruptionCase[]
  ): LegalSystemAnalytics['trends'] {
    // Get historical data for trend calculation
    const historicalData = this.getHistoricalData(jurisdiction);
    
    return {
      crimeRates: {
        current: crimes.length,
        trend: this.calculateTrend(historicalData.map(h => h.crimeStatistics.totalCrimes))
      },
      courtEfficiency: {
        current: 70, // Simulated current efficiency
        trend: this.calculateTrend(historicalData.map(h => h.courtPerformance.clearanceRate))
      },
      publicTrust: {
        current: 60, // Simulated current trust
        trend: this.calculateTrend(historicalData.map(h => h.justiceHealth.overallScore))
      },
      corruption: {
        current: corruptionCases.length,
        trend: this.calculateTrend(historicalData.map(h => h.corruptionMetrics.reportedCases))
      }
    };
  }

  /**
   * Generate legal system predictions
   */
  private generateLegalPredictions(
    jurisdiction: string,
    crimes: Crime[],
    legalCases: LegalCase[],
    corruptionCases: CorruptionCase[]
  ): LegalSystemAnalytics['predictions'] {
    // Crime forecasts by type
    const crimeForecasts = {
      violent: {
        predicted: crimes.filter(c => c.type === 'violent').length * (1 + (Math.random() - 0.5) * 0.2),
        confidence: 75
      },
      property: {
        predicted: crimes.filter(c => c.type === 'property').length * (1 + (Math.random() - 0.5) * 0.15),
        confidence: 80
      },
      cyber: {
        predicted: crimes.filter(c => c.type === 'cyber').length * (1.1 + Math.random() * 0.3),
        confidence: 65
      }
    };

    // Court load predictions
    const courtloadPredictions = {
      local: { predicted: 150 + Math.floor(Math.random() * 50), confidence: 80 },
      district: { predicted: 75 + Math.floor(Math.random() * 25), confidence: 75 },
      supreme: { predicted: 25 + Math.floor(Math.random() * 10), confidence: 85 }
    };

    // Corruption risk assessment
    const corruptionRisk = {
      local: {
        risk: 20 + Math.random() * 20,
        mitigation: ['Ethics training', 'Regular audits', 'Transparency measures']
      },
      state: {
        risk: 15 + Math.random() * 20,
        mitigation: ['Oversight committees', 'Whistleblower protection', 'Financial disclosure']
      },
      federal: {
        risk: 10 + Math.random() * 15,
        mitigation: ['Independent prosecutors', 'Media scrutiny', 'Congressional oversight']
      }
    };

    return {
      crimeForecasts,
      courtloadPredictions,
      corruptionRisk
    };
  }

  /**
   * Calculate data quality score
   */
  private calculateDataQuality(
    legalCases: LegalCase[],
    courts: Court[],
    crimes: Crime[],
    corruptionCases: CorruptionCase[],
    agencies: LawEnforcementAgency[]
  ): number {
    let score = 85; // Base score

    // Data completeness
    const totalRecords = legalCases.length + courts.length + crimes.length + corruptionCases.length + agencies.length;
    if (totalRecords < 10) score -= 20;
    else if (totalRecords > 100) score += 10;

    // Data recency
    const recentData = [...legalCases, ...crimes, ...corruptionCases]
      .filter(item => {
        const date = 'filingDate' in item ? item.filingDate : 
                    'dateTime' in item ? item.dateTime : 
                    'discoveryDate' in item ? item.discoveryDate : new Date();
        return (Date.now() - date.getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 days
      }).length;
    
    const recentDataRatio = totalRecords > 0 ? recentData / totalRecords : 0;
    score += (recentDataRatio - 0.3) * 20;

    return Math.max(50, Math.min(100, score));
  }

  /**
   * Calculate analysis confidence
   */
  private calculateAnalysisConfidence(
    legalCases: LegalCase[],
    courts: Court[],
    crimes: Crime[],
    corruptionCases: CorruptionCase[],
    agencies: LawEnforcementAgency[]
  ): number {
    let confidence = 80; // Base confidence

    // Sample size effect
    const totalSampleSize = legalCases.length + crimes.length + corruptionCases.length;
    if (totalSampleSize < 20) confidence -= 25;
    else if (totalSampleSize > 100) confidence += 10;

    // Data diversity
    const crimeTypes = new Set(crimes.map(c => c.type)).size;
    const caseTypes = new Set(legalCases.map(c => c.type)).size;
    
    confidence += Math.min(10, (crimeTypes + caseTypes) * 2);

    // System maturity
    const avgCourtAge = courts.length > 0 ? 
      courts.reduce((sum, c) => sum + (Date.now() - c.established.getTime()), 0) / courts.length : 0;
    
    const yearsOperating = avgCourtAge / (365 * 24 * 60 * 60 * 1000);
    if (yearsOperating > 5) confidence += 5;
    if (yearsOperating > 10) confidence += 5;

    return Math.max(50, Math.min(95, confidence));
  }

  // Helper methods

  private calculateSentenceVariability(sentencedCases: LegalCase[]): number {
    if (sentencedCases.length < 2) return 0;

    // Simplified variability calculation
    const sentences = sentencedCases
      .filter(c => c.sentence?.type === 'imprisonment')
      .map(c => c.sentence?.duration || 0);

    if (sentences.length < 2) return 0;

    const mean = sentences.reduce((sum, s) => sum + s, 0) / sentences.length;
    const variance = sentences.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / sentences.length;
    
    return Math.sqrt(variance) / mean * 100; // Coefficient of variation as percentage
  }

  private calculateCrimeTrend(crimeType: string): 'increasing' | 'decreasing' | 'stable' {
    const trends: ('increasing' | 'decreasing' | 'stable')[] = ['increasing', 'decreasing', 'stable'];
    return trends[Math.floor(Math.random() * 3)];
  }

  private calculateAverageSeverity(crimes: Crime[]): number {
    if (crimes.length === 0) return 0;
    
    const severityScores = crimes.map(c => {
      switch (c.severity) {
        case 'misdemeanor': return 1;
        case 'felony': return 2;
        case 'capital': return 3;
        default: return 1;
      }
    });

    return severityScores.reduce((sum, s) => sum + s, 0) / severityScores.length;
  }

  private calculateAverageCommunityImpact(crimes: Crime[]): number {
    if (crimes.length === 0) return 0;
    
    return crimes.reduce((sum, c) => sum + c.communityImpact.fearLevel, 0) / crimes.length;
  }

  private calculateCorruptionTrend(corruptionType: string): 'increasing' | 'decreasing' | 'stable' {
    const trends: ('increasing' | 'decreasing' | 'stable')[] = ['increasing', 'decreasing', 'stable'];
    return trends[Math.floor(Math.random() * 3)];
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const recent = values.slice(-3); // Last 3 values
    const older = values.slice(-6, -3); // Previous 3 values
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + v, 0) / older.length;
    
    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (changePercent > 5) return 'increasing';
    if (changePercent < -5) return 'decreasing';
    return 'stable';
  }

  private getHistoricalData(jurisdiction: string): LegalSystemAnalytics[] {
    return this.analyticsHistory.get(jurisdiction) || [];
  }

  private storeAnalyticsHistory(jurisdiction: string, analytics: LegalSystemAnalytics): void {
    const history = this.analyticsHistory.get(jurisdiction) || [];
    history.push(analytics);
    
    // Keep only last 12 months of data
    if (history.length > 12) {
      history.splice(0, history.length - 12);
    }
    
    this.analyticsHistory.set(jurisdiction, history);
  }

  /**
   * Generate legal system insights
   */
  generateInsights(analytics: LegalSystemAnalytics): string[] {
    const insights: string[] = [];

    // Justice health insights
    if (analytics.justiceHealth.overallScore < 60) {
      insights.push('Justice system health is below acceptable levels. Consider comprehensive reforms.');
    }

    if (analytics.justiceHealth.components.accessToJustice < 50) {
      insights.push('Access to justice is critically low. Increase court availability and reduce costs.');
    }

    // Crime insights
    if (analytics.crimeStatistics.clearanceRate < 50) {
      insights.push('Crime clearance rate is concerning. Enhance investigative capabilities.');
    }

    if (analytics.crimeStatistics.crimeRate > 5000) {
      insights.push('Crime rate is high. Implement comprehensive crime prevention strategies.');
    }

    // Court performance insights
    if (analytics.courtPerformance.caseBacklog > 1000) {
      insights.push('Court backlog is excessive. Consider adding judges or streamlining processes.');
    }

    if (analytics.courtPerformance.averageProcessingTime > 365) {
      insights.push('Case processing time is too long. Implement efficiency measures.');
    }

    // Corruption insights
    if (analytics.corruptionMetrics.reportedCases > 50) {
      insights.push('Corruption levels are concerning. Strengthen oversight and prevention measures.');
    }

    if (analytics.corruptionMetrics.convictionRate < 30) {
      insights.push('Corruption conviction rate is low. Improve investigation and prosecution capabilities.');
    }

    // Law enforcement insights
    if (analytics.lawEnforcement.performance.communityTrust < 50) {
      insights.push('Community trust in law enforcement is low. Implement community policing initiatives.');
    }

    if (analytics.lawEnforcement.accountability.complaints > 100) {
      insights.push('High number of law enforcement complaints. Strengthen accountability measures.');
    }

    return insights;
  }

  /**
   * Generate recommendations for legal system improvement
   */
  generateRecommendations(analytics: LegalSystemAnalytics): string[] {
    const recommendations: string[] = [];

    // Justice health recommendations
    if (analytics.justiceHealth.components.efficiency < 70) {
      recommendations.push('Implement case management systems to improve court efficiency');
      recommendations.push('Consider alternative dispute resolution mechanisms');
    }

    if (analytics.justiceHealth.components.transparency < 60) {
      recommendations.push('Enhance public access to court records and proceedings');
      recommendations.push('Implement regular public reporting on justice system performance');
    }

    // Crime prevention recommendations
    if (analytics.crimeStatistics.byType.violent?.trend === 'increasing') {
      recommendations.push('Expand violence prevention programs and community interventions');
    }

    if (analytics.crimeStatistics.byType.cyber?.count > 50) {
      recommendations.push('Enhance cybercrime investigation capabilities and public awareness');
    }

    // Court improvement recommendations
    if (analytics.courtPerformance.caseBacklog > 500) {
      recommendations.push('Increase judicial resources and consider night/weekend court sessions');
    }

    // Corruption prevention recommendations
    if (analytics.corruptionMetrics.byLevel.local > 10) {
      recommendations.push('Implement mandatory ethics training for local officials');
      recommendations.push('Establish independent oversight bodies for local government');
    }

    // Law enforcement recommendations
    if (analytics.lawEnforcement.accountability.bodyCamera < 80) {
      recommendations.push('Expand body camera programs for all patrol officers');
    }

    if (analytics.lawEnforcement.performance.communityTrust < 60) {
      recommendations.push('Implement community policing initiatives and citizen advisory boards');
    }

    return recommendations;
  }
}
