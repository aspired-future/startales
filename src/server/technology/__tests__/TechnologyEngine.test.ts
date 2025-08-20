/**
 * Technology & Cyber Warfare Systems - TechnologyEngine Tests
 * Sprint 16: Unit tests for technology acquisition and cyber warfare engine
 */

import { TechnologyEngine } from '../TechnologyEngine.js';
import { TechnologyCategory, TechnologyLevel, AcquisitionMethod, CyberOperationType } from '../types.js';

describe('TechnologyEngine', () => {
  let engine: TechnologyEngine;

  beforeEach(() => {
    engine = new TechnologyEngine();
  });

  describe('Technology Management', () => {
    test('should create a new technology', () => {
      const techParams = {
        name: 'Test Technology',
        category: 'Computing' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        description: 'A test technology',
        complexity: 7,
        researchCost: 1000000,
        implementationCost: 500000,
        maintenanceCost: 100000
      };

      const technology = engine.createTechnology(techParams);

      expect(technology.name).toBe('Test Technology');
      expect(technology.category).toBe('Computing');
      expect(technology.level).toBe('Advanced');
      expect(technology.complexity).toBe(7);
      expect(technology.researchCost).toBe(1000000);
      expect(technology.implementationProgress).toBe(0);
      expect(technology.operationalStatus).toBe('Research');
      expect(technology.id).toBeDefined();
      expect(technology.acquisitionDate).toBeInstanceOf(Date);
    });

    test('should enforce complexity bounds', () => {
      const techParams = {
        name: 'Test Technology',
        category: 'Computing' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        description: 'A test technology',
        complexity: 15, // Above max
        researchCost: 1000000,
        implementationCost: 500000,
        maintenanceCost: 100000
      };

      const technology = engine.createTechnology(techParams);
      expect(technology.complexity).toBe(10); // Should be capped at 10
    });

    test('should get all technologies', () => {
      const initialCount = engine.getTechnologies().length;
      
      engine.createTechnology({
        name: 'Tech 1',
        category: 'Computing' as TechnologyCategory,
        level: 'Basic' as TechnologyLevel,
        description: 'Test tech 1',
        complexity: 5,
        researchCost: 100000,
        implementationCost: 50000,
        maintenanceCost: 10000
      });

      engine.createTechnology({
        name: 'Tech 2',
        category: 'AI' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        description: 'Test tech 2',
        complexity: 8,
        researchCost: 500000,
        implementationCost: 250000,
        maintenanceCost: 50000
      });

      const technologies = engine.getTechnologies();
      expect(technologies.length).toBe(initialCount + 2);
    });
  });

  describe('Civilization Management', () => {
    test('should create a new civilization', () => {
      const civParams = {
        name: 'Test Civilization',
        techLevel: 'Advanced' as TechnologyLevel,
        researchCapacity: 1000,
        innovationRate: 0.5,
        cyberDefense: 7
      };

      const civilization = engine.createCivilization(civParams);

      expect(civilization.name).toBe('Test Civilization');
      expect(civilization.techLevel).toBe('Advanced');
      expect(civilization.researchCapacity).toBe(1000);
      expect(civilization.innovationRate).toBe(0.5);
      expect(civilization.cyberDefense).toBe(7);
      expect(civilization.civilizationId).toBeDefined();
      expect(civilization.technologies).toEqual([]);
      expect(civilization.researchProjects).toEqual([]);
    });

    test('should get all civilizations', () => {
      const initialCount = engine.getCivilizations().length;

      engine.createCivilization({
        name: 'Civ 1',
        techLevel: 'Basic' as TechnologyLevel
      });

      engine.createCivilization({
        name: 'Civ 2',
        techLevel: 'Advanced' as TechnologyLevel
      });

      const civilizations = engine.getCivilizations();
      expect(civilizations.length).toBe(initialCount + 2);
    });
  });

  describe('Research Project Management', () => {
    test('should start a research project', () => {
      const civilization = engine.createCivilization({
        name: 'Research Civ',
        techLevel: 'Advanced' as TechnologyLevel
      });

      const projectParams = {
        civilizationId: civilization.civilizationId,
        name: 'Test Research Project',
        targetTechnology: 'Advanced AI',
        category: 'AI' as TechnologyCategory,
        budget: 2000000,
        researchers: 50,
        estimatedDuration: 365
      };

      const project = engine.startResearchProject(projectParams);

      expect(project.name).toBe('Test Research Project');
      expect(project.targetTechnology).toBe('Advanced AI');
      expect(project.category).toBe('AI');
      expect(project.budget).toBe(2000000);
      expect(project.researchers).toBe(50);
      expect(project.progress).toBe(0);
      expect(project.budgetSpent).toBe(0);
      expect(project.id).toBeDefined();
      expect(project.milestones.length).toBeGreaterThan(0);
    });

    test('should get all research projects', () => {
      const civilization = engine.createCivilization({
        name: 'Research Civ',
        techLevel: 'Advanced' as TechnologyLevel
      });

      const initialCount = engine.getResearchProjects().length;

      engine.startResearchProject({
        civilizationId: civilization.civilizationId,
        name: 'Project 1',
        targetTechnology: 'Tech 1',
        category: 'Computing' as TechnologyCategory,
        budget: 1000000,
        researchers: 25,
        estimatedDuration: 180
      });

      const projects = engine.getResearchProjects();
      expect(projects.length).toBe(initialCount + 1);
    });
  });

  describe('Cyber Operations', () => {
    test('should launch a cyber operation', () => {
      const operator = engine.createCivilization({
        name: 'Operator Civ',
        techLevel: 'Advanced' as TechnologyLevel,
        cyberDefense: 8
      });

      const target = engine.createCivilization({
        name: 'Target Civ',
        techLevel: 'Intermediate' as TechnologyLevel,
        cyberDefense: 5
      });

      const opParams = {
        operatorId: operator.civilizationId,
        targetId: target.civilizationId,
        name: 'Test Cyber Operation',
        type: 'Technology Theft' as CyberOperationType,
        primaryObjective: 'Steal advanced computing technology',
        duration: 30,
        budget: 500000,
        personnel: 10
      };

      const operation = engine.launchCyberOperation(opParams);

      expect(operation.name).toBe('Test Cyber Operation');
      expect(operation.type).toBe('Technology Theft');
      expect(operation.operatorId).toBe(operator.civilizationId);
      expect(operation.targetId).toBe(target.civilizationId);
      expect(operation.status).toBe('Planning');
      expect(operation.progress).toBe(0);
      expect(operation.budget).toBe(500000);
      expect(operation.personnel).toBe(10);
      expect(operation.assets.length).toBe(10); // Should create assets for personnel
      expect(operation.detectionRisk).toBeGreaterThan(0);
      expect(operation.successProbability).toBeGreaterThan(0);
    });

    test('should execute a cyber operation', () => {
      const operator = engine.createCivilization({
        name: 'Operator Civ',
        techLevel: 'Advanced' as TechnologyLevel,
        cyberDefense: 8
      });

      const target = engine.createCivilization({
        name: 'Target Civ',
        techLevel: 'Intermediate' as TechnologyLevel,
        cyberDefense: 5
      });

      const operation = engine.launchCyberOperation({
        operatorId: operator.civilizationId,
        targetId: target.civilizationId,
        name: 'Test Operation',
        type: 'Data Theft' as CyberOperationType,
        primaryObjective: 'Steal intelligence data',
        duration: 15,
        budget: 200000,
        personnel: 5
      });

      const outcome = engine.executeCyberOperation(operation.id);

      expect(outcome).toBeDefined();
      expect(outcome.success).toBeDefined();
      expect(outcome.detectionLevel).toBeDefined();
      expect(outcome.operationalCost).toBeGreaterThan(0);
      expect(operation.status).toMatch(/Completed|Failed/);
      expect(operation.endDate).toBeInstanceOf(Date);
    });

    test('should throw error for invalid civilization in cyber operation', () => {
      expect(() => {
        engine.launchCyberOperation({
          operatorId: 'invalid-id',
          targetId: 'another-invalid-id',
          name: 'Test Operation',
          type: 'Data Theft' as CyberOperationType,
          primaryObjective: 'Test objective',
          duration: 15,
          budget: 100000,
          personnel: 3
        });
      }).toThrow('Invalid operator or target civilization');
    });

    test('should get all cyber operations', () => {
      const operator = engine.createCivilization({
        name: 'Operator Civ',
        techLevel: 'Advanced' as TechnologyLevel
      });

      const target = engine.createCivilization({
        name: 'Target Civ',
        techLevel: 'Basic' as TechnologyLevel
      });

      const initialCount = engine.getCyberOperations().length;

      engine.launchCyberOperation({
        operatorId: operator.civilizationId,
        targetId: target.civilizationId,
        name: 'Operation 1',
        type: 'Surveillance' as CyberOperationType,
        primaryObjective: 'Monitor target activities',
        duration: 60,
        budget: 300000,
        personnel: 7
      });

      const operations = engine.getCyberOperations();
      expect(operations.length).toBe(initialCount + 1);
    });
  });

  describe('Technology Transfer', () => {
    test('should transfer technology', () => {
      const source = engine.createCivilization({
        name: 'Source Civ',
        techLevel: 'Advanced' as TechnologyLevel
      });

      const recipient = engine.createCivilization({
        name: 'Recipient Civ',
        techLevel: 'Intermediate' as TechnologyLevel
      });

      const technology = engine.createTechnology({
        name: 'Transfer Tech',
        category: 'Energy' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        description: 'Technology for transfer',
        complexity: 6,
        researchCost: 800000,
        implementationCost: 400000,
        maintenanceCost: 80000
      });

      const transferParams = {
        sourceId: source.civilizationId,
        recipientId: recipient.civilizationId,
        technologyId: technology.id,
        transferMethod: 'Sale' as const,
        cost: 1000000
      };

      const transfer = engine.transferTechnology(transferParams);

      expect(transfer.sourceId).toBe(source.civilizationId);
      expect(transfer.recipientId).toBe(recipient.civilizationId);
      expect(transfer.technologyId).toBe(technology.id);
      expect(transfer.transferMethod).toBe('Sale');
      expect(transfer.cost).toBe(1000000);
      expect(transfer.adaptationRequired).toBeDefined();
      expect(transfer.successProbability).toBeGreaterThan(0);
      expect(transfer.implementationSuccess).toBeDefined();
    });

    test('should throw error for invalid technology in transfer', () => {
      const source = engine.createCivilization({
        name: 'Source Civ',
        techLevel: 'Advanced' as TechnologyLevel
      });

      const recipient = engine.createCivilization({
        name: 'Recipient Civ',
        techLevel: 'Basic' as TechnologyLevel
      });

      expect(() => {
        engine.transferTechnology({
          sourceId: source.civilizationId,
          recipientId: recipient.civilizationId,
          technologyId: 'invalid-tech-id',
          transferMethod: 'Gift'
        });
      }).toThrow('Technology not found');
    });

    test('should get all technology transfers', () => {
      const source = engine.createCivilization({
        name: 'Source Civ',
        techLevel: 'Advanced' as TechnologyLevel
      });

      const recipient = engine.createCivilization({
        name: 'Recipient Civ',
        techLevel: 'Basic' as TechnologyLevel
      });

      const technology = engine.createTechnology({
        name: 'Test Tech',
        category: 'Medical' as TechnologyCategory,
        level: 'Intermediate' as TechnologyLevel,
        description: 'Medical technology',
        complexity: 4,
        researchCost: 300000,
        implementationCost: 150000,
        maintenanceCost: 30000
      });

      const initialCount = engine.getTechnologyTransfers().length;

      engine.transferTechnology({
        sourceId: source.civilizationId,
        recipientId: recipient.civilizationId,
        technologyId: technology.id,
        transferMethod: 'License',
        cost: 200000
      });

      const transfers = engine.getTechnologyTransfers();
      expect(transfers.length).toBe(initialCount + 1);
    });
  });

  describe('Reverse Engineering', () => {
    test('should start reverse engineering project', () => {
      const civilization = engine.createCivilization({
        name: 'Reverse Engineering Civ',
        techLevel: 'Intermediate' as TechnologyLevel
      });

      const targetTech = engine.createTechnology({
        name: 'Target Technology',
        category: 'Robotics' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        description: 'Advanced robotics technology',
        complexity: 9,
        researchCost: 2000000,
        implementationCost: 1000000,
        maintenanceCost: 200000
      });

      const projectParams = {
        civilizationId: civilization.civilizationId,
        targetTechnologyId: targetTech.id,
        budget: 1500000,
        researchers: 30,
        samples: []
      };

      const project = engine.startReverseEngineering(projectParams);

      expect(project.civilizationId).toBe(civilization.civilizationId);
      expect(project.targetTechnologyId).toBe(targetTech.id);
      expect(project.budget).toBe(1500000);
      expect(project.researchers).toBe(30);
      expect(project.progress).toBe(0);
      expect(project.understanding).toBe(0);
      expect(project.reproduction).toBe(0);
      expect(project.success).toBe(false);
      expect(project.technicalChallenges.length).toBeGreaterThan(0);
      expect(project.estimatedCompletion).toBeInstanceOf(Date);
    });

    test('should throw error for invalid target technology', () => {
      const civilization = engine.createCivilization({
        name: 'Test Civ',
        techLevel: 'Basic' as TechnologyLevel
      });

      expect(() => {
        engine.startReverseEngineering({
          civilizationId: civilization.civilizationId,
          targetTechnologyId: 'invalid-tech-id',
          budget: 500000,
          researchers: 15,
          samples: []
        });
      }).toThrow('Target technology not found');
    });

    test('should get all reverse engineering projects', () => {
      const civilization = engine.createCivilization({
        name: 'Test Civ',
        techLevel: 'Intermediate' as TechnologyLevel
      });

      const technology = engine.createTechnology({
        name: 'Test Tech',
        category: 'Space' as TechnologyCategory,
        level: 'Cutting-Edge' as TechnologyLevel,
        description: 'Space technology',
        complexity: 10,
        researchCost: 5000000,
        implementationCost: 2500000,
        maintenanceCost: 500000
      });

      const initialCount = engine.getReverseEngineeringProjects().length;

      engine.startReverseEngineering({
        civilizationId: civilization.civilizationId,
        targetTechnologyId: technology.id,
        budget: 2000000,
        researchers: 40,
        samples: []
      });

      const projects = engine.getReverseEngineeringProjects();
      expect(projects.length).toBe(initialCount + 1);
    });
  });

  describe('Analytics', () => {
    test('should generate technology analytics', () => {
      // Create some test data
      const civilization = engine.createCivilization({
        name: 'Analytics Test Civ',
        techLevel: 'Advanced' as TechnologyLevel
      });

      engine.createTechnology({
        name: 'Analytics Tech 1',
        category: 'Computing' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        description: 'Test technology 1',
        complexity: 7,
        researchCost: 1000000,
        implementationCost: 500000,
        maintenanceCost: 100000
      });

      engine.createTechnology({
        name: 'Analytics Tech 2',
        category: 'AI' as TechnologyCategory,
        level: 'Cutting-Edge' as TechnologyLevel,
        description: 'Test technology 2',
        complexity: 9,
        researchCost: 2000000,
        implementationCost: 1000000,
        maintenanceCost: 200000
      });

      const analytics = engine.generateTechnologyAnalytics();

      expect(analytics.totalTechnologies).toBeGreaterThan(0);
      expect(analytics.technologiesByCategory).toBeDefined();
      expect(analytics.technologiesByLevel).toBeDefined();
      expect(analytics.averageComplexity).toBeGreaterThan(0);
      expect(analytics.activeResearchProjects).toBeGreaterThanOrEqual(0);
      expect(analytics.activeCyberOperations).toBeGreaterThanOrEqual(0);
      expect(analytics.transfersIn).toBeGreaterThanOrEqual(0);
      expect(analytics.transfersOut).toBeGreaterThanOrEqual(0);
      expect(analytics.economicImpact).toBeGreaterThanOrEqual(0);
      expect(analytics.militaryImpact).toBeGreaterThanOrEqual(0);
      expect(analytics.researchImpact).toBeGreaterThanOrEqual(0);
    });

    test('should generate recommendations', () => {
      const civilization = engine.createCivilization({
        name: 'Recommendation Test Civ',
        techLevel: 'Intermediate' as TechnologyLevel,
        cyberDefense: 4 // Low cyber defense to trigger recommendations
      });

      const recommendations = engine.generateRecommendations(civilization.civilizationId);

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      // Check that recommendations have required fields
      recommendations.forEach(rec => {
        expect(rec.type).toBeDefined();
        expect(rec.priority).toBeDefined();
        expect(rec.description).toBeDefined();
        expect(rec.rationale).toBeDefined();
        expect(rec.estimatedCost).toBeGreaterThan(0);
        expect(rec.estimatedBenefit).toBeGreaterThan(0);
        expect(rec.timeframe).toBeDefined();
        expect(Array.isArray(rec.risks)).toBe(true);
        expect(Array.isArray(rec.dependencies)).toBe(true);
      });

      // Should include security recommendation due to low cyber defense
      const securityRecs = recommendations.filter(rec => rec.type === 'Defend');
      expect(securityRecs.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty analytics gracefully', () => {
      const emptyEngine = new TechnologyEngine();
      // Clear the initialized data
      emptyEngine.getTechnologies().length = 0;
      
      const analytics = emptyEngine.generateTechnologyAnalytics();
      expect(analytics.totalTechnologies).toBeGreaterThanOrEqual(0);
      expect(analytics.averageComplexity).toBeGreaterThanOrEqual(0);
    });

    test('should handle invalid civilization ID in recommendations', () => {
      const recommendations = engine.generateRecommendations('invalid-civ-id');
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(0);
    });

    test('should handle cyber operation execution for non-existent operation', () => {
      expect(() => {
        engine.executeCyberOperation('non-existent-operation-id');
      }).toThrow('Cyber operation not found');
    });
  });
});
