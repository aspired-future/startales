/**
 * Technology & Cyber Warfare Systems - TechnologyAnalytics Tests
 * Sprint 16: Unit tests for technology analytics and intelligence
 */

import { TechnologyAnalytics } from '../TechnologyAnalytics';
import { 
  Technology, TechnologyCategory, TechnologyLevel, AcquisitionMethod,
  ResearchProject, CyberOperation, TechnologyTransfer, ReverseEngineeringProject,
  CivilizationTech
} from '../types';

describe('TechnologyAnalytics', () => {
  let analytics: TechnologyAnalytics;

  beforeEach(() => {
    analytics = new TechnologyAnalytics();
  });

  // Helper function to create sample technology
  const createSampleTechnology = (overrides: Partial<Technology> = {}): Technology => ({
    id: `tech_${Date.now()}_${Math.random()}`,
    name: 'Sample Technology',
    category: 'Computing',
    level: 'Advanced',
    description: 'A sample technology for testing',
    complexity: 7,
    researchCost: 1000000,
    implementationCost: 500000,
    maintenanceCost: 100000,
    prerequisites: [],
    unlocks: [],
    economicBonus: 50000,
    militaryBonus: 25000,
    researchBonus: 10000,
    acquisitionMethod: 'Research',
    acquisitionDate: new Date(),
    acquisitionCost: 1000000,
    implementationProgress: 50,
    operationalStatus: 'Development',
    securityLevel: 6,
    vulnerabilityScore: 4,
    metadata: {
      discoveredBy: 'Test Lab',
      patents: [],
      classifications: [],
      exportRestrictions: false,
      dualUse: false
    },
    ...overrides
  });

  // Helper function to create sample research project
  const createSampleResearchProject = (overrides: Partial<ResearchProject> = {}): ResearchProject => ({
    id: `research_${Date.now()}_${Math.random()}`,
    name: 'Sample Research Project',
    targetTechnology: 'Advanced AI',
    category: 'AI',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    estimatedCompletion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    budget: 2000000,
    budgetSpent: 500000,
    researchers: 25,
    facilities: ['AI Research Lab', 'Computing Center'],
    progress: 25,
    milestones: [],
    collaborators: [],
    securityClearance: 'Restricted',
    breakthroughs: ['Neural Network Optimization'],
    setbacks: [],
    spinoffTechnologies: [],
    ...overrides
  });

  // Helper function to create sample cyber operation
  const createSampleCyberOperation = (overrides: Partial<CyberOperation> = {}): CyberOperation => ({
    id: `cyber_${Date.now()}_${Math.random()}`,
    name: 'Sample Cyber Operation',
    type: 'Technology Theft',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    duration: 30,
    operatorId: 'operator_1',
    targetId: 'target_1',
    assets: [],
    primaryObjective: 'Steal advanced computing technology',
    secondaryObjectives: [],
    targetTechnologies: ['tech_1', 'tech_2'],
    status: 'Completed',
    progress: 100,
    detectionRisk: 6,
    successProbability: 75,
    budget: 500000,
    personnel: 8,
    tools: ['Network Scanner', 'Data Extractor'],
    outcome: {
      success: true,
      detectionLevel: 'Suspected',
      technologiesAcquired: [createSampleTechnology()],
      dataAcquired: [],
      economicDamage: 2000000,
      militaryDamage: 500000,
      operationalCost: 450000,
      assetsLost: [],
      reputationDamage: 15,
      diplomaticFallout: 10,
      securityUpgrades: ['Enhanced Firewall']
    },
    intelligence: [],
    stolenTechnologies: ['tech_1'],
    compromisedSystems: ['system_1'],
    evidenceLeft: 3,
    attribution: 4,
    ...overrides
  });

  describe('Technology Portfolio Analysis', () => {
    test('should analyze empty technology portfolio', () => {
      const analysis = analytics.analyzeTechnologyPortfolio([]);
      
      expect(analysis.diversityIndex).toBe(0);
      expect(analysis.maturityScore).toBe(0);
      expect(analysis.innovationPotential).toBe(0);
      expect(analysis.riskProfile).toBe(0);
      expect(analysis.competitivePosition).toBe('Unknown');
      expect(analysis.acquisitionEfficiency).toBe(0);
    });

    test('should analyze technology portfolio with diverse technologies', () => {
      const technologies = [
        createSampleTechnology({ category: 'Computing', level: 'Advanced', complexity: 8 }),
        createSampleTechnology({ category: 'AI', level: 'Cutting-Edge', complexity: 9 }),
        createSampleTechnology({ category: 'Energy', level: 'Intermediate', complexity: 5 }),
        createSampleTechnology({ category: 'Medical', level: 'Basic', complexity: 3 }),
        createSampleTechnology({ category: 'Military', level: 'Experimental', complexity: 10 })
      ];

      const analysis = analytics.analyzeTechnologyPortfolio(technologies);

      expect(analysis.diversityIndex).toBeGreaterThan(0);
      expect(analysis.maturityScore).toBeGreaterThan(0);
      expect(analysis.innovationPotential).toBeGreaterThan(0);
      expect(analysis.riskProfile).toBeGreaterThan(0);
      expect(analysis.competitivePosition).toMatch(/Leader|Strong|Competitive|Developing|Lagging/);
      expect(analysis.acquisitionEfficiency).toBeGreaterThan(0);
      
      // Check portfolio balance
      expect(Object.keys(analysis.portfolioBalance)).toContain('Computing');
      expect(Object.keys(analysis.portfolioBalance)).toContain('AI');
      expect(analysis.portfolioBalance['Computing']).toBe(1);
      expect(analysis.portfolioBalance['AI']).toBe(1);
      
      // Check level distribution
      expect(Object.keys(analysis.levelDistribution)).toContain('Advanced');
      expect(Object.keys(analysis.levelDistribution)).toContain('Basic');
      expect(analysis.levelDistribution['Advanced']).toBe(1);
      expect(analysis.levelDistribution['Basic']).toBe(1);
    });

    test('should calculate high maturity score for advanced technologies', () => {
      const technologies = [
        createSampleTechnology({ level: 'Advanced', complexity: 8 }),
        createSampleTechnology({ level: 'Cutting-Edge', complexity: 9 }),
        createSampleTechnology({ level: 'Advanced', complexity: 7 })
      ];

      const analysis = analytics.analyzeTechnologyPortfolio(technologies);
      expect(analysis.maturityScore).toBeGreaterThan(60); // Should be high for advanced tech
    });

    test('should calculate competitive position correctly', () => {
      // Test "Leader" position with mostly advanced technologies
      const leaderTechnologies = Array(10).fill(null).map(() => 
        createSampleTechnology({ level: 'Advanced', complexity: 8 })
      );
      
      const leaderAnalysis = analytics.analyzeTechnologyPortfolio(leaderTechnologies);
      expect(leaderAnalysis.competitivePosition).toBe('Leader');

      // Test "Lagging" position with mostly basic technologies
      const laggingTechnologies = Array(10).fill(null).map(() => 
        createSampleTechnology({ level: 'Basic', complexity: 2 })
      );
      
      const laggingAnalysis = analytics.analyzeTechnologyPortfolio(laggingTechnologies);
      expect(laggingAnalysis.competitivePosition).toBe('Lagging');
    });
  });

  describe('Research Performance Analysis', () => {
    test('should analyze empty research projects', () => {
      const analysis = analytics.analyzeResearchPerformance([]);
      
      expect(analysis.completionRate).toBe(0);
      expect(analysis.averageDelay).toBe(0);
      expect(analysis.budgetEfficiency).toBe(0);
      expect(analysis.breakthroughRate).toBe(0);
      expect(analysis.collaborationIndex).toBe(0);
    });

    test('should analyze research performance with completed projects', () => {
      const projects = [
        createSampleResearchProject({
          progress: 100,
          actualCompletion: new Date(),
          budgetSpent: 1800000,
          budget: 2000000,
          breakthroughs: ['Major Discovery', 'Process Improvement'],
          collaborators: ['Partner Lab']
        }),
        createSampleResearchProject({
          progress: 75,
          budgetSpent: 1500000,
          budget: 2000000,
          breakthroughs: ['Innovation'],
          collaborators: []
        }),
        createSampleResearchProject({
          progress: 50,
          budgetSpent: 900000,
          budget: 2000000,
          breakthroughs: [],
          setbacks: ['Technical Challenge'],
          collaborators: ['University', 'Research Institute']
        })
      ];

      const analysis = analytics.analyzeResearchPerformance(projects);

      expect(analysis.completionRate).toBeGreaterThan(0);
      expect(analysis.budgetEfficiency).toBeGreaterThan(0);
      expect(analysis.breakthroughRate).toBeGreaterThan(0);
      expect(analysis.collaborationIndex).toBeGreaterThan(0);
      expect(analysis.riskManagement).toBeGreaterThan(0);
      expect(analysis.resourceUtilization).toBeGreaterThan(0);
    });

    test('should calculate completion rate correctly', () => {
      const projects = [
        createSampleResearchProject({ actualCompletion: new Date() }), // Completed
        createSampleResearchProject({ actualCompletion: new Date() }), // Completed
        createSampleResearchProject({ actualCompletion: undefined }), // Not completed
        createSampleResearchProject({ actualCompletion: undefined })  // Not completed
      ];

      const analysis = analytics.analyzeResearchPerformance(projects);
      expect(analysis.completionRate).toBe(50); // 2 out of 4 completed
    });

    test('should calculate collaboration index correctly', () => {
      const projects = [
        createSampleResearchProject({ collaborators: ['Partner 1'] }),
        createSampleResearchProject({ collaborators: ['Partner 1', 'Partner 2'] }),
        createSampleResearchProject({ collaborators: [] }),
        createSampleResearchProject({ collaborators: [] })
      ];

      const analysis = analytics.analyzeResearchPerformance(projects);
      expect(analysis.collaborationIndex).toBe(50); // 2 out of 4 have collaborators
    });
  });

  describe('Cyber Warfare Analysis', () => {
    test('should analyze empty cyber operations', () => {
      const analysis = analytics.analyzeCyberWarfare([]);
      
      expect(analysis.operationalSuccess).toBe(0);
      expect(analysis.detectionRate).toBe(0);
      expect(analysis.attributionRisk).toBe(0);
      expect(analysis.costEffectiveness).toBe(0);
      expect(analysis.technologicalGains).toBe(0);
    });

    test('should analyze cyber warfare operations', () => {
      const operations = [
        createSampleCyberOperation({
          outcome: {
            success: true,
            detectionLevel: 'Undetected',
            technologiesAcquired: [createSampleTechnology()],
            dataAcquired: [],
            economicDamage: 1000000,
            militaryDamage: 200000,
            operationalCost: 400000,
            assetsLost: [],
            reputationDamage: 0,
            diplomaticFallout: 0,
            securityUpgrades: []
          }
        }),
        createSampleCyberOperation({
          outcome: {
            success: false,
            detectionLevel: 'Detected',
            technologiesAcquired: [],
            dataAcquired: [],
            economicDamage: 0,
            militaryDamage: 0,
            operationalCost: 500000,
            assetsLost: ['asset_1'],
            reputationDamage: 25,
            diplomaticFallout: 15,
            securityUpgrades: ['Enhanced Security']
          }
        }),
        createSampleCyberOperation({
          outcome: {
            success: true,
            detectionLevel: 'Attributed',
            technologiesAcquired: [createSampleTechnology(), createSampleTechnology()],
            dataAcquired: [],
            economicDamage: 2000000,
            militaryDamage: 500000,
            operationalCost: 600000,
            assetsLost: [],
            reputationDamage: 30,
            diplomaticFallout: 20,
            securityUpgrades: []
          }
        })
      ];

      const analysis = analytics.analyzeCyberWarfare(operations);

      expect(analysis.operationalSuccess).toBeCloseTo(66.67, 1); // 2 out of 3 successful
      expect(analysis.detectionRate).toBeCloseTo(66.67, 1); // 2 out of 3 detected
      expect(analysis.attributionRisk).toBeCloseTo(33.33, 1); // 1 out of 3 attributed
      expect(analysis.technologicalGains).toBe(30); // 3 technologies * 10
      expect(analysis.costEffectiveness).toBeGreaterThan(0);
    });

    test('should calculate detection rate correctly', () => {
      const operations = [
        createSampleCyberOperation({ outcome: { ...createSampleCyberOperation().outcome!, detectionLevel: 'Undetected' } }),
        createSampleCyberOperation({ outcome: { ...createSampleCyberOperation().outcome!, detectionLevel: 'Suspected' } }),
        createSampleCyberOperation({ outcome: { ...createSampleCyberOperation().outcome!, detectionLevel: 'Detected' } }),
        createSampleCyberOperation({ outcome: { ...createSampleCyberOperation().outcome!, detectionLevel: 'Attributed' } })
      ];

      const analysis = analytics.analyzeCyberWarfare(operations);
      expect(analysis.detectionRate).toBe(75); // 3 out of 4 detected (not undetected)
    });
  });

  describe('Technology Transfer Analysis', () => {
    test('should analyze empty technology transfers', () => {
      const analysis = analytics.analyzeTechnologyTransfer([]);
      
      expect(analysis.transferSuccess).toBe(0);
      expect(analysis.adaptationEfficiency).toBe(0);
      expect(analysis.implementationSpeed).toBe(0);
      expect(analysis.costBenefit).toBe(0);
    });

    test('should analyze technology transfers', () => {
      const transfers: TechnologyTransfer[] = [
        {
          id: 'transfer_1',
          sourceId: 'source_1',
          recipientId: 'recipient_1',
          technologyId: 'tech_1',
          transferDate: new Date(),
          transferMethod: 'Sale',
          cost: 1000000,
          restrictions: [],
          adaptationRequired: true,
          adaptationCost: 200000,
          adaptationTime: 90,
          successProbability: 80,
          implementationSuccess: true,
          performanceDegradation: 10,
          localImprovements: ['Efficiency Boost'],
          securityMeasures: ['Access Control'],
          leakageRisk: 3
        },
        {
          id: 'transfer_2',
          sourceId: 'source_2',
          recipientId: 'recipient_2',
          technologyId: 'tech_2',
          transferDate: new Date(),
          transferMethod: 'License',
          cost: 500000,
          restrictions: ['Export Control'],
          adaptationRequired: false,
          adaptationCost: 0,
          adaptationTime: 0,
          successProbability: 95,
          implementationSuccess: true,
          performanceDegradation: 5,
          localImprovements: [],
          securityMeasures: ['Encryption'],
          leakageRisk: 2
        }
      ];

      const analysis = analytics.analyzeTechnologyTransfer(transfers);

      expect(analysis.transferSuccess).toBe(100); // Both successful
      expect(analysis.adaptationEfficiency).toBe(92.5); // Average of (100-10) and (100-5)
      expect(analysis.implementationSpeed).toBeGreaterThan(0);
      expect(analysis.costBenefit).toBeGreaterThan(0);
    });
  });

  describe('Reverse Engineering Analysis', () => {
    test('should analyze empty reverse engineering projects', () => {
      const analysis = analytics.analyzeReverseEngineering([]);
      
      expect(analysis.successRate).toBe(0);
      expect(analysis.understandingDepth).toBe(0);
      expect(analysis.reproductionCapability).toBe(0);
      expect(analysis.timeEfficiency).toBe(0);
    });

    test('should analyze reverse engineering projects', () => {
      const projects: ReverseEngineeringProject[] = [
        {
          id: 'reverse_1',
          civilizationId: 'civ_1',
          targetTechnologyId: 'tech_1',
          startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          estimatedCompletion: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          budget: 1000000,
          researchers: 20,
          facilities: ['Reverse Engineering Lab'],
          samples: [],
          progress: 75,
          understanding: 80,
          reproduction: 70,
          technicalChallenges: ['Material Analysis'],
          materialChallenges: ['Rare Elements'],
          knowledgeGaps: ['Manufacturing Process'],
          discoveries: ['New Alloy'],
          improvements: ['Enhanced Efficiency'],
          alternativeApproaches: ['Different Architecture'],
          success: true
        },
        {
          id: 'reverse_2',
          civilizationId: 'civ_2',
          targetTechnologyId: 'tech_2',
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          estimatedCompletion: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000),
          budget: 800000,
          researchers: 15,
          facilities: ['Analysis Center'],
          samples: [],
          progress: 40,
          understanding: 45,
          reproduction: 30,
          technicalChallenges: ['Complex Algorithms'],
          materialChallenges: [],
          knowledgeGaps: ['Core Principles'],
          discoveries: [],
          improvements: [],
          alternativeApproaches: [],
          success: false
        }
      ];

      const analysis = analytics.analyzeReverseEngineering(projects);

      expect(analysis.successRate).toBe(50); // 1 out of 2 successful
      expect(analysis.understandingDepth).toBe(62.5); // Average of 80 and 45
      expect(analysis.reproductionCapability).toBe(50); // Average of 70 and 30
      expect(analysis.timeEfficiency).toBeGreaterThan(0);
    });
  });

  describe('Predictive Analytics', () => {
    test('should generate technology forecast', () => {
      const technologies = [
        createSampleTechnology({ category: 'AI', level: 'Cutting-Edge' }),
        createSampleTechnology({ category: 'Quantum', level: 'Experimental' }),
        createSampleTechnology({ category: 'Computing', level: 'Advanced' })
      ];

      const projects = [
        createSampleResearchProject({ category: 'AI', targetTechnology: 'Next-Gen AI' }),
        createSampleResearchProject({ category: 'Quantum', targetTechnology: 'Quantum Computing' })
      ];

      const forecast = analytics.generateTechnologyForecast(technologies, projects, 5);

      expect(Array.isArray(forecast.emergingTechnologies)).toBe(true);
      expect(forecast.emergingTechnologies.length).toBeGreaterThan(0);
      expect(typeof forecast.obsolescenceRisk).toBe('object');
      expect(Array.isArray(forecast.investmentPriorities)).toBe(true);
      expect(Array.isArray(forecast.competitiveThreats)).toBe(true);
      expect(Array.isArray(forecast.opportunityAreas)).toBe(true);
      expect(typeof forecast.resourceRequirements).toBe('object');
      expect(typeof forecast.timelineProjections).toBe('object');
      expect(typeof forecast.riskAssessment).toBe('object');
    });
  });

  describe('Competitive Intelligence', () => {
    test('should generate competitive analysis', () => {
      const ownTechnologies = [
        createSampleTechnology({ category: 'Computing', level: 'Advanced' }),
        createSampleTechnology({ category: 'AI', level: 'Intermediate' })
      ];

      const competitorTechnologies = [
        createSampleTechnology({ category: 'Computing', level: 'Cutting-Edge' }),
        createSampleTechnology({ category: 'AI', level: 'Advanced' }),
        createSampleTechnology({ category: 'Quantum', level: 'Experimental' })
      ];

      const civilizations: CivilizationTech[] = [
        {
          civilizationId: 'civ_1',
          name: 'Own Civilization',
          techLevel: 'Advanced',
          technologies: ownTechnologies,
          researchProjects: [],
          researchCapacity: 1000,
          innovationRate: 0.6,
          technologyAdoption: 0.7,
          strengths: ['Computing'],
          weaknesses: ['Quantum'],
          cyberDefense: 7,
          counterIntelligence: 6,
          informationSecurity: 8
        },
        {
          civilizationId: 'civ_2',
          name: 'Competitor Civilization',
          techLevel: 'Cutting-Edge',
          technologies: competitorTechnologies,
          researchProjects: [],
          researchCapacity: 1200,
          innovationRate: 0.8,
          technologyAdoption: 0.8,
          strengths: ['AI', 'Quantum'],
          weaknesses: ['Energy'],
          cyberDefense: 9,
          counterIntelligence: 8,
          informationSecurity: 9
        }
      ];

      const analysis = analytics.generateCompetitiveAnalysis(
        ownTechnologies,
        competitorTechnologies,
        civilizations
      );

      expect(typeof analysis.technologyGaps).toBe('object');
      expect(Array.isArray(analysis.competitiveAdvantages)).toBe(true);
      expect(Array.isArray(analysis.vulnerabilities)).toBe(true);
      expect(typeof analysis.benchmarkScores).toBe('object');
      expect(typeof analysis.marketPosition).toBe('string');
      expect(Array.isArray(analysis.strategicRecommendations)).toBe(true);
      expect(typeof analysis.threatAssessment).toBe('object');
      expect(typeof analysis.opportunityMatrix).toBe('object');

      // Check that gaps are identified correctly
      expect(analysis.technologyGaps['Quantum']).toBe(1); // Competitor has 1, we have 0
    });
  });

  describe('Security Analytics', () => {
    test('should analyze security posture', () => {
      const technologies = [
        createSampleTechnology({ securityLevel: 8, vulnerabilityScore: 3 }),
        createSampleTechnology({ securityLevel: 6, vulnerabilityScore: 5 }),
        createSampleTechnology({ securityLevel: 7, vulnerabilityScore: 4 })
      ];

      const operations = [
        createSampleCyberOperation({ outcome: { ...createSampleCyberOperation().outcome!, success: false, detectionLevel: 'Detected' } }),
        createSampleCyberOperation({ outcome: { ...createSampleCyberOperation().outcome!, success: true, detectionLevel: 'Undetected' } })
      ];

      const civilizations: CivilizationTech[] = [
        {
          civilizationId: 'civ_1',
          name: 'Test Civilization',
          techLevel: 'Advanced',
          technologies: [],
          researchProjects: [],
          researchCapacity: 1000,
          innovationRate: 0.5,
          technologyAdoption: 0.6,
          strengths: [],
          weaknesses: [],
          cyberDefense: 8,
          counterIntelligence: 7,
          informationSecurity: 9
        }
      ];

      const analysis = analytics.analyzeSecurityPosture(technologies, operations, civilizations);

      expect(analysis.overallSecurityScore).toBeGreaterThan(0);
      expect(analysis.vulnerabilityIndex).toBeGreaterThan(0);
      expect(analysis.threatExposure).toBeGreaterThan(0);
      expect(analysis.defenseEffectiveness).toBeGreaterThanOrEqual(0);
      expect(analysis.incidentResponse).toBeGreaterThanOrEqual(0);
      expect(analysis.securityInvestment).toBeGreaterThanOrEqual(0);
      expect(analysis.complianceScore).toBeGreaterThanOrEqual(0);
      expect(analysis.riskMitigation).toBeGreaterThan(0);
      expect(typeof analysis.securityTrends).toBe('object');
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle null and undefined values gracefully', () => {
      // Test with null arrays (should be treated as empty)
      expect(() => {
        analytics.analyzeTechnologyPortfolio(null as any);
      }).not.toThrow();

      expect(() => {
        analytics.analyzeResearchPerformance(undefined as any);
      }).not.toThrow();
    });

    test('should handle invalid data gracefully', () => {
      // Test with technologies missing required fields
      const invalidTechnologies = [
        { ...createSampleTechnology(), complexity: null as any },
        { ...createSampleTechnology(), securityLevel: undefined as any }
      ];

      expect(() => {
        analytics.analyzeTechnologyPortfolio(invalidTechnologies);
      }).not.toThrow();
    });

    test('should return consistent results for empty datasets', () => {
      const portfolioAnalysis = analytics.analyzeTechnologyPortfolio([]);
      const researchAnalysis = analytics.analyzeResearchPerformance([]);
      const cyberAnalysis = analytics.analyzeCyberWarfare([]);
      const transferAnalysis = analytics.analyzeTechnologyTransfer([]);
      const reverseAnalysis = analytics.analyzeReverseEngineering([]);

      // All should return valid objects with zero values
      expect(portfolioAnalysis.diversityIndex).toBe(0);
      expect(researchAnalysis.completionRate).toBe(0);
      expect(cyberAnalysis.operationalSuccess).toBe(0);
      expect(transferAnalysis.transferSuccess).toBe(0);
      expect(reverseAnalysis.successRate).toBe(0);
    });
  });
});
