/**
 * Legal Analytics Unit Tests
 * 
 * Tests for the Legal Analytics system including justice health metrics,
 * crime statistics, court performance, corruption analytics, and insights generation.
 */

import { LegalAnalytics } from '../LegalAnalytics';
import { 
  LegalCase, 
  Court, 
  Crime, 
  CorruptionCase, 
  LawEnforcementAgency,
  LegalSystemAnalytics 
} from '../types';

describe('LegalAnalytics', () => {
  let legalAnalytics: LegalAnalytics;
  let mockLegalCases: LegalCase[];
  let mockCourts: Court[];
  let mockCrimes: Crime[];
  let mockCorruptionCases: CorruptionCase[];
  let mockAgencies: LawEnforcementAgency[];

  beforeEach(() => {
    legalAnalytics = new LegalAnalytics();
    
    // Create mock data
    mockCourts = [
      {
        id: 'court_1',
        name: 'Supreme Court',
        level: 'supreme',
        jurisdiction: ['Constitutional law'],
        judges: [{
          id: 'judge_1',
          name: 'Chief Justice',
          title: 'Chief Justice',
          appointmentDate: new Date('2020-01-01'),
          experience: 20,
          specialization: ['Constitutional law'],
          philosophy: 'Balanced',
          approval: 80
        }],
        caseload: { pending: 25, inProgress: 15, completed: 200, backlog: 10 },
        caseTypes: [],
        performance: {
          averageCaseTime: 180,
          clearanceRate: 90,
          reverseRate: 10,
          efficiency: 85,
          publicConfidence: 75
        },
        budget: 50000000,
        staffing: { judges: 1, clerks: 2, bailiffs: 1, administrators: 1 },
        facilities: { courtrooms: 3, capacity: 200, technology: ['Digital'], accessibility: true },
        established: new Date('1990-01-01'),
        status: 'operational'
      },
      {
        id: 'court_2',
        name: 'District Court',
        level: 'district',
        jurisdiction: ['Federal crimes'],
        judges: [{
          id: 'judge_2',
          name: 'District Judge',
          title: 'Judge',
          appointmentDate: new Date('2018-01-01'),
          experience: 15,
          specialization: ['Criminal law'],
          philosophy: 'Conservative',
          approval: 70
        }],
        caseload: { pending: 150, inProgress: 75, completed: 800, backlog: 50 },
        caseTypes: [],
        performance: {
          averageCaseTime: 120,
          clearanceRate: 85,
          reverseRate: 15,
          efficiency: 80,
          publicConfidence: 70
        },
        budget: 25000000,
        staffing: { judges: 5, clerks: 10, bailiffs: 5, administrators: 3 },
        facilities: { courtrooms: 8, capacity: 500, technology: ['Audio/Video'], accessibility: true },
        established: new Date('1995-01-01'),
        status: 'operational'
      }
    ];

    mockLegalCases = [
      {
        id: 'case_1',
        caseNumber: '2024-0001',
        courtId: 'court_1',
        title: 'Constitutional Challenge',
        type: 'constitutional',
        category: 'civil_rights',
        severity: 'felony',
        plaintiff: { type: 'individual', name: 'Plaintiff', representation: 'ACLU' },
        defendant: { type: 'government', name: 'State', representation: 'AG Office' },
        filingDate: new Date('2024-01-01'),
        hearingDates: [new Date('2024-02-01')],
        status: 'trial',
        priority: 8,
        publicInterest: 90,
        mediaAttention: 85,
        evidence: [],
        witnesses: [],
        precedents: [],
        assignedJudge: 'judge_1',
        estimatedDuration: 365,
        cost: 100000,
        complexity: 9,
        verdict: undefined,
        sentence: undefined,
        trialDate: new Date('2024-03-01')
      },
      {
        id: 'case_2',
        caseNumber: '2024-0002',
        courtId: 'court_2',
        title: 'State v. Defendant',
        type: 'criminal',
        category: 'theft',
        severity: 'felony',
        plaintiff: { type: 'government', name: 'State', representation: 'DA' },
        defendant: { type: 'individual', name: 'John Doe', representation: 'Public Defender' },
        filingDate: new Date('2024-01-15'),
        hearingDates: [],
        status: 'verdict',
        priority: 6,
        publicInterest: 30,
        mediaAttention: 20,
        evidence: [],
        witnesses: [],
        precedents: [],
        assignedJudge: 'judge_2',
        assignedProsecutor: 'prosecutor_1',
        estimatedDuration: 180,
        cost: 25000,
        complexity: 5,
        verdict: { decision: 'guilty', reasoning: 'Evidence was clear', unanimity: true },
        sentence: { type: 'imprisonment', duration: 730, conditions: ['Good behavior'], appealable: true },
        trialDate: new Date('2024-02-15')
      }
    ];

    mockCrimes = [
      {
        id: 'crime_1',
        type: 'violent',
        category: 'assault',
        severity: 'felony',
        location: 'Downtown',
        dateTime: new Date('2024-01-10'),
        description: 'Assault case',
        perpetrator: { id: 'perp_1', motives: ['anger'], mentalState: 'agitated' },
        victims: [{ type: 'individual', impact: { physical: 70, financial: 0, psychological: 50, social: 30 } }],
        investigation: {
          status: 'solved',
          leadInvestigator: 'detective_1',
          evidenceCollected: ['witness_statement', 'video'],
          witnessesInterviewed: 2,
          suspectsIdentified: 1,
          solvability: 85,
          clearanceTime: 30
        },
        communityImpact: {
          fearLevel: 60,
          trustInPolice: 70,
          mediaAttention: 40,
          politicalResponse: ['Increased patrols']
        },
        preventionFactors: [
          { factor: 'Better lighting', effectiveness: 70 },
          { factor: 'Security cameras', effectiveness: 80 }
        ],
        reportedBy: 'Witness',
        reportingDelay: 0,
        jurisdiction: 'local',
        priority: 7
      },
      {
        id: 'crime_2',
        type: 'property',
        category: 'theft',
        severity: 'misdemeanor',
        location: 'Shopping Mall',
        dateTime: new Date('2024-01-20'),
        description: 'Shoplifting incident',
        perpetrator: { motives: ['financial'], mentalState: 'desperate' },
        victims: [{ type: 'business', impact: { physical: 0, financial: 200, psychological: 5, social: 5 } }],
        investigation: {
          status: 'investigating',
          leadInvestigator: 'officer_1',
          evidenceCollected: ['security_footage'],
          witnessesInterviewed: 1,
          suspectsIdentified: 0,
          solvability: 60
        },
        communityImpact: {
          fearLevel: 20,
          trustInPolice: 75,
          mediaAttention: 10,
          politicalResponse: []
        },
        preventionFactors: [
          { factor: 'Security tags', effectiveness: 85 },
          { factor: 'Store security', effectiveness: 75 }
        ],
        reportedBy: 'Store Manager',
        reportingDelay: 2,
        jurisdiction: 'local',
        priority: 3
      }
    ];

    mockCorruptionCases = [
      {
        id: 'corruption_1',
        type: 'bribery',
        officialId: 'official_1',
        office: 'City Planning',
        level: 'local',
        description: 'Bribery for permit approval',
        monetaryValue: 50000,
        publicFundsInvolved: false,
        beneficiaries: ['contractor_1'],
        detectionMethod: 'whistleblower',
        investigationStatus: 'substantiated',
        evidenceStrength: 80,
        witnesses: 2,
        documentation: ['bank_records', 'emails'],
        consequences: {
          official: { suspended: true, resigned: false, prosecuted: true, convicted: true },
          institutional: { reformsImplemented: ['Ethics training'], oversightIncreased: true, publicTrustImpact: -15 },
          political: { partyImpact: -10, electoralConsequences: [], policyChanges: ['Transparency measures'] }
        },
        preventionMeasures: [
          { measure: 'Ethics training', effectiveness: 70, implementationCost: 25000 },
          { measure: 'Regular audits', effectiveness: 80, implementationCost: 100000 }
        ],
        discoveryDate: new Date('2024-01-05'),
        reportingDate: new Date('2024-01-06'),
        publicDisclosure: true,
        mediaAttention: 75,
        whistleblowerProtection: true
      }
    ];

    mockAgencies = [
      {
        id: 'agency_1',
        name: 'Metropolitan Police',
        type: 'police',
        jurisdiction: 'City',
        leadership: { chief: 'Chief_1', deputies: ['Deputy_1'], commanders: ['Commander_1'] },
        personnel: { officers: 500, detectives: 75, specialists: 25, civilians: 100, total: 700 },
        operations: {
          patrol: { beats: 20, coverage: 85, responseTime: 8 },
          investigation: { activeInvestigations: 50, clearanceRate: 70, detectiveWorkload: 15 },
          specialUnits: []
        },
        performance: {
          crimeReduction: 5,
          publicSafety: 75,
          communityTrust: 65,
          responseEfficiency: 80,
          investigationSuccess: 70
        },
        communityPrograms: [],
        publicRelations: { approval: 65, complaints: 50, commendations: 25, transparency: 70 },
        budget: 75000000,
        equipment: { vehicles: 100, weapons: 500, technology: ['Radios'], facilities: ['HQ'] },
        training: { hoursPerOfficer: 40, programs: ['Basic'], certifications: ['Peace officer'], continuingEducation: true },
        oversight: { internalAffairs: true, externalOversight: ['Civilian board'], bodyCamera: true, useOfForcePolicy: 'Progressive' },
        incidents: { useOfForce: 25, complaints: 50, disciplinaryActions: 15, lawsuits: 5 },
        established: new Date('2000-01-01'),
        accreditation: [],
        status: 'operational'
      }
    ];
  });

  describe('Comprehensive Analytics Generation', () => {
    test('should generate complete legal system analytics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      expect(analytics).toBeDefined();
      expect(analytics.jurisdiction).toBe('test_jurisdiction');
      expect(analytics.justiceHealth).toBeDefined();
      expect(analytics.crimeStatistics).toBeDefined();
      expect(analytics.courtPerformance).toBeDefined();
      expect(analytics.corruptionMetrics).toBeDefined();
      expect(analytics.lawEnforcement).toBeDefined();
      expect(analytics.trends).toBeDefined();
      expect(analytics.predictions).toBeDefined();
      expect(analytics.analysisDate).toBeInstanceOf(Date);
      expect(analytics.dataQuality).toBeGreaterThan(0);
      expect(analytics.confidence).toBeGreaterThan(0);
    });

    test('should calculate data quality based on sample size and recency', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      expect(analytics.dataQuality).toBeGreaterThanOrEqual(50);
      expect(analytics.dataQuality).toBeLessThanOrEqual(100);
    });

    test('should calculate confidence based on sample size and diversity', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      expect(analytics.confidence).toBeGreaterThanOrEqual(50);
      expect(analytics.confidence).toBeLessThanOrEqual(95);
    });
  });

  describe('Justice Health Metrics', () => {
    test('should calculate overall justice health score', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const justiceHealth = analytics.justiceHealth;
      
      expect(justiceHealth.overallScore).toBeGreaterThan(0);
      expect(justiceHealth.overallScore).toBeLessThanOrEqual(100);
      expect(justiceHealth.components.accessToJustice).toBeGreaterThan(0);
      expect(justiceHealth.components.fairness).toBeGreaterThan(0);
      expect(justiceHealth.components.efficiency).toBeGreaterThan(0);
      expect(justiceHealth.components.transparency).toBeGreaterThan(0);
      expect(justiceHealth.components.accountability).toBeGreaterThan(0);
    });

    test('should calculate access to justice based on court availability and costs', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const accessScore = analytics.justiceHealth.components.accessToJustice;
      expect(accessScore).toBeGreaterThan(0);
      expect(accessScore).toBeLessThanOrEqual(100);
    });

    test('should calculate fairness based on conviction rates and sentencing', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const fairnessScore = analytics.justiceHealth.components.fairness;
      expect(fairnessScore).toBeGreaterThan(0);
      expect(fairnessScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Crime Statistics', () => {
    test('should calculate comprehensive crime statistics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const crimeStats = analytics.crimeStatistics;
      
      expect(crimeStats.totalCrimes).toBe(mockCrimes.length);
      expect(crimeStats.crimeRate).toBeGreaterThan(0);
      expect(crimeStats.clearanceRate).toBeGreaterThanOrEqual(0);
      expect(crimeStats.clearanceRate).toBeLessThanOrEqual(100);
      expect(crimeStats.byType).toBeDefined();
      expect(crimeStats.bySeverity).toBeDefined();
      expect(crimeStats.victimization).toBeDefined();
    });

    test('should calculate clearance rate correctly', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const solvedCrimes = mockCrimes.filter(c => c.investigation.status === 'solved').length;
      const expectedClearanceRate = (solvedCrimes / mockCrimes.length) * 100;
      
      expect(analytics.crimeStatistics.clearanceRate).toBe(expectedClearanceRate);
    });

    test('should categorize crimes by type with statistics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const byType = analytics.crimeStatistics.byType;
      
      expect(byType.violent).toBeDefined();
      expect(byType.violent.count).toBe(1); // One violent crime in mock data
      expect(byType.property).toBeDefined();
      expect(byType.property.count).toBe(1); // One property crime in mock data
      
      // Each type should have rate, clearanceRate, trend, etc.
      Object.values(byType).forEach((typeStats: any) => {
        expect(typeStats.rate).toBeGreaterThanOrEqual(0);
        expect(typeStats.clearanceRate).toBeGreaterThanOrEqual(0);
        expect(typeStats.trend).toMatch(/^(increasing|decreasing|stable)$/);
      });
    });

    test('should calculate victimization metrics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const victimization = analytics.crimeStatistics.victimization;
      
      expect(victimization.individualVictims).toBe(1); // One individual victim
      expect(victimization.businessVictims).toBe(1); // One business victim
      expect(victimization.governmentVictims).toBe(0); // No government victims
      expect(victimization.repeatVictimization).toBeGreaterThanOrEqual(15);
      expect(victimization.repeatVictimization).toBeLessThanOrEqual(35);
    });
  });

  describe('Court Performance Analytics', () => {
    test('should calculate court performance metrics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const courtPerf = analytics.courtPerformance;
      
      expect(courtPerf.caseBacklog).toBe(60); // Sum of backlog from mock courts
      expect(courtPerf.averageProcessingTime).toBe(150); // Average of 180 and 120
      expect(courtPerf.clearanceRate).toBe(87.5); // Average of 90 and 85
      expect(courtPerf.appealRate).toBeGreaterThanOrEqual(15);
      expect(courtPerf.appealRate).toBeLessThanOrEqual(30);
      expect(courtPerf.reversalRate).toBeGreaterThanOrEqual(10);
      expect(courtPerf.reversalRate).toBeLessThanOrEqual(25);
    });

    test('should break down performance by court level', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const byLevel = analytics.courtPerformance.byCourtLevel;
      
      expect(byLevel.supreme).toBeDefined();
      expect(byLevel.supreme.courts).toBe(1);
      expect(byLevel.supreme.caseload).toBe(40); // 25 + 15 from supreme court
      
      expect(byLevel.district).toBeDefined();
      expect(byLevel.district.courts).toBe(1);
      expect(byLevel.district.caseload).toBe(225); // 150 + 75 from district court
    });
  });

  describe('Corruption Analytics', () => {
    test('should calculate corruption metrics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const corruption = analytics.corruptionMetrics;
      
      expect(corruption.reportedCases).toBe(1);
      expect(corruption.substantiatedCases).toBe(1);
      expect(corruption.convictionRate).toBe(100); // 1 conviction out of 1 substantiated
      expect(corruption.averageMonetaryValue).toBe(50000);
      expect(corruption.byType).toBeDefined();
      expect(corruption.byLevel).toBeDefined();
    });

    test('should categorize corruption by type', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const byType = analytics.corruptionMetrics.byType;
      
      expect(byType.bribery).toBeDefined();
      expect(byType.bribery.cases).toBe(1);
      expect(byType.bribery.convictions).toBe(1);
      expect(byType.bribery.averageValue).toBe(50000);
      
      // Other types should exist but have zero cases
      expect(byType.embezzlement.cases).toBe(0);
      expect(byType.fraud.cases).toBe(0);
    });

    test('should categorize corruption by government level', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const byLevel = analytics.corruptionMetrics.byLevel;
      
      expect(byLevel.local).toBe(1); // One local corruption case
      expect(byLevel.state).toBe(0);
      expect(byLevel.federal).toBe(0);
    });
  });

  describe('Law Enforcement Analytics', () => {
    test('should calculate law enforcement metrics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const lawEnforcement = analytics.lawEnforcement;
      
      expect(lawEnforcement.totalAgencies).toBe(1);
      expect(lawEnforcement.totalOfficers).toBe(500);
      expect(lawEnforcement.performance).toBeDefined();
      expect(lawEnforcement.accountability).toBeDefined();
      expect(lawEnforcement.communityRelations).toBeDefined();
    });

    test('should calculate performance metrics from agency data', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const performance = analytics.lawEnforcement.performance;
      
      expect(performance.crimeReduction).toBe(5); // From mock agency
      expect(performance.publicSafety).toBe(75);
      expect(performance.communityTrust).toBe(65);
      expect(performance.responseTime).toBe(8);
    });

    test('should calculate accountability metrics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const accountability = analytics.lawEnforcement.accountability;
      
      expect(accountability.complaints).toBe(50);
      expect(accountability.disciplinaryActions).toBe(15);
      expect(accountability.useOfForceIncidents).toBe(25);
      expect(accountability.bodyCamera).toBe(100); // 100% have body cameras
    });
  });

  describe('Trends and Predictions', () => {
    test('should calculate system trends', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const trends = analytics.trends;
      
      expect(trends.crimeRates).toBeDefined();
      expect(trends.crimeRates.current).toBe(mockCrimes.length);
      expect(trends.crimeRates.trend).toMatch(/^(increasing|decreasing|stable)$/);
      
      expect(trends.courtEfficiency).toBeDefined();
      expect(trends.publicTrust).toBeDefined();
      expect(trends.corruption).toBeDefined();
    });

    test('should generate predictions for different crime types', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const predictions = analytics.predictions;
      
      expect(predictions.crimeForecasts).toBeDefined();
      expect(predictions.crimeForecasts.violent).toBeDefined();
      expect(predictions.crimeForecasts.violent.predicted).toBeGreaterThan(0);
      expect(predictions.crimeForecasts.violent.confidence).toBeGreaterThan(0);
      
      expect(predictions.courtloadPredictions).toBeDefined();
      expect(predictions.corruptionRisk).toBeDefined();
    });

    test('should assess corruption risk by government level', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      const corruptionRisk = analytics.predictions.corruptionRisk;
      
      expect(corruptionRisk.local).toBeDefined();
      expect(corruptionRisk.local.risk).toBeGreaterThan(0);
      expect(corruptionRisk.local.mitigation).toBeInstanceOf(Array);
      expect(corruptionRisk.local.mitigation.length).toBeGreaterThan(0);
      
      expect(corruptionRisk.state).toBeDefined();
      expect(corruptionRisk.federal).toBeDefined();
    });
  });

  describe('Insights Generation', () => {
    let analytics: LegalSystemAnalytics;

    beforeEach(() => {
      analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );
    });

    test('should generate insights based on analytics data', () => {
      const insights = legalAnalytics.generateInsights(analytics);
      
      expect(insights).toBeInstanceOf(Array);
      expect(insights.length).toBeGreaterThanOrEqual(0);
      
      // Each insight should be a string
      insights.forEach(insight => {
        expect(typeof insight).toBe('string');
        expect(insight.length).toBeGreaterThan(0);
      });
    });

    test('should generate recommendations for system improvement', () => {
      const recommendations = legalAnalytics.generateRecommendations(analytics);
      
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThanOrEqual(0);
      
      // Each recommendation should be a string
      recommendations.forEach(recommendation => {
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length).toBeGreaterThan(0);
      });
    });

    test('should provide insights for low justice health scores', () => {
      // Create analytics with low justice health
      const lowHealthAnalytics = { ...analytics };
      lowHealthAnalytics.justiceHealth.overallScore = 45;
      
      const insights = legalAnalytics.generateInsights(lowHealthAnalytics);
      
      const healthInsight = insights.find(insight => 
        insight.includes('Justice system health') || insight.includes('below acceptable')
      );
      expect(healthInsight).toBeDefined();
    });

    test('should provide insights for high crime rates', () => {
      // Create analytics with high crime rate
      const highCrimeAnalytics = { ...analytics };
      highCrimeAnalytics.crimeStatistics.crimeRate = 6000;
      
      const insights = legalAnalytics.generateInsights(highCrimeAnalytics);
      
      const crimeInsight = insights.find(insight => 
        insight.includes('Crime rate is high') || insight.includes('crime prevention')
      );
      expect(crimeInsight).toBeDefined();
    });

    test('should provide recommendations for court efficiency', () => {
      // Create analytics with low court efficiency
      const lowEfficiencyAnalytics = { ...analytics };
      lowEfficiencyAnalytics.justiceHealth.components.efficiency = 45;
      
      const recommendations = legalAnalytics.generateRecommendations(lowEfficiencyAnalytics);
      
      const efficiencyRec = recommendations.find(rec => 
        rec.includes('case management') || rec.includes('efficiency')
      );
      expect(efficiencyRec).toBeDefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty data sets gracefully', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'empty_jurisdiction',
        [], // No legal cases
        [], // No courts
        [], // No crimes
        [], // No corruption cases
        []  // No agencies
      );

      expect(analytics).toBeDefined();
      expect(analytics.crimeStatistics.totalCrimes).toBe(0);
      expect(analytics.crimeStatistics.clearanceRate).toBe(0);
      expect(analytics.courtPerformance.caseBacklog).toBe(0);
      expect(analytics.corruptionMetrics.reportedCases).toBe(0);
      expect(analytics.lawEnforcement.totalAgencies).toBe(0);
    });

    test('should handle single data points without errors', () => {
      const singleCrime = [mockCrimes[0]];
      const singleCourt = [mockCourts[0]];
      
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'single_jurisdiction',
        [],
        singleCourt,
        singleCrime,
        [],
        []
      );

      expect(analytics.crimeStatistics.totalCrimes).toBe(1);
      expect(analytics.crimeStatistics.clearanceRate).toBe(100); // Single solved crime
      expect(analytics.courtPerformance.averageProcessingTime).toBe(180);
    });

    test('should maintain score bounds (0-100) for all metrics', () => {
      const analytics = legalAnalytics.generateComprehensiveAnalytics(
        'test_jurisdiction',
        mockLegalCases,
        mockCourts,
        mockCrimes,
        mockCorruptionCases,
        mockAgencies
      );

      // Check justice health components
      Object.values(analytics.justiceHealth.components).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });

      // Check clearance rates
      expect(analytics.crimeStatistics.clearanceRate).toBeGreaterThanOrEqual(0);
      expect(analytics.crimeStatistics.clearanceRate).toBeLessThanOrEqual(100);
      expect(analytics.courtPerformance.clearanceRate).toBeGreaterThanOrEqual(0);
      expect(analytics.courtPerformance.clearanceRate).toBeLessThanOrEqual(100);
    });
  });
});
