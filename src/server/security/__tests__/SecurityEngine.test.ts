/**
 * Security Engine Tests
 * Comprehensive tests for security and defense systems functionality
 */

import { SecurityEngine } from '../SecurityEngine.js';
import { 
  PoliceType, 
  Jurisdiction, 
  AgencyType, 
  ThreatLevel, 
  PrisonType, 
  SecurityLevel,
  InmateType,
  IntelligenceType,
  SecuritySpecialization
} from '../types.js';

describe('SecurityEngine', () => {
  let engine: SecurityEngine;

  beforeEach(() => {
    engine = new SecurityEngine();
  });

  describe('Police Force Management', () => {
    it('should create a local police force', () => {
      const force = engine.createPoliceForce(
        'city_001',
        'Metro Police Department',
        'Local',
        'City',
        5000000
      );

      expect(force.id).toBeDefined();
      expect(force.name).toBe('Metro Police Department');
      expect(force.type).toBe('Local');
      expect(force.jurisdiction).toBe('City');
      expect(force.budget).toBe(5000000);
      expect(force.officers).toHaveLength(0);
      expect(force.equipment).toBeDefined();
      expect(force.performance).toBeDefined();
      expect(force.securityClearance).toBe('None');
    });

    it('should create a federal police force with higher security clearance', () => {
      const force = engine.createPoliceForce(
        undefined,
        'Federal Bureau of Investigation',
        'Federal',
        'Federal',
        15000000
      );

      expect(force.type).toBe('Federal');
      expect(force.jurisdiction).toBe('Federal');
      expect(force.securityClearance).toBe('Secret');
      expect(force.cityId).toBeUndefined();
    });

    it('should create a secret police force with special characteristics', () => {
      const force = engine.createPoliceForce(
        undefined,
        'State Security Service',
        'Secret Police',
        'National',
        25000000
      );

      expect(force.type).toBe('Secret Police');
      expect(force.jurisdiction).toBe('National');
      expect(force.securityClearance).toBe('Secret');
      expect(force.communityRelations).toBeLessThan(60); // Lower than normal
      expect(force.corruption).toBeGreaterThan(10); // Higher than normal
    });

    it('should hire officers and update performance', () => {
      const force = engine.createPoliceForce(
        'city_001',
        'Test Police',
        'Local',
        'City',
        1000000
      );

      const officer1 = engine.hireOfficer(force.id, 'Officer Smith', 'Officer');
      const officer2 = engine.hireOfficer(force.id, 'Sergeant Jones', 'Sergeant');

      expect(officer1.name).toBe('Officer Smith');
      expect(officer1.rank).toBe('Officer');
      expect(officer2.rank).toBe('Sergeant');

      const updatedForce = engine.getPoliceForce(force.id);
      expect(updatedForce?.officers).toHaveLength(2);
    });

    it('should create special units with specialized equipment', () => {
      const force = engine.createPoliceForce(
        'city_001',
        'Test Police',
        'Local',
        'City',
        1000000
      );

      const swatUnit = engine.createSpecialUnit(force.id, 'SWAT Team Alpha', 'SWAT', 500000);
      const cyberUnit = engine.createSpecialUnit(force.id, 'Cyber Crime Unit', 'Cybercrime', 300000);

      expect(swatUnit.type).toBe('SWAT');
      expect(cyberUnit.type).toBe('Cybercrime');
      expect(swatUnit.equipment).toBeDefined();
      expect(cyberUnit.equipment).toBeDefined();

      const updatedForce = engine.getPoliceForce(force.id);
      expect(updatedForce?.specialUnits).toHaveLength(2);
    });

    it('should throw error when hiring officer for non-existent force', () => {
      expect(() => {
        engine.hireOfficer('invalid_id', 'Officer Test', 'Officer');
      }).toThrow('Police force not found');
    });
  });

  describe('Federal Agency Management', () => {
    it('should create federal agencies with different types', () => {
      const intelligence = engine.createFederalAgency(
        'Central Intelligence Agency',
        'Intelligence Service',
        'Langley, VA',
        50000000
      );

      const cyberSecurity = engine.createFederalAgency(
        'Cyber Security Division',
        'Cyber Security',
        'Fort Meade, MD',
        30000000
      );

      expect(intelligence.type).toBe('Intelligence Service');
      expect(intelligence.securityClearance).toBe('Top Secret');
      expect(cyberSecurity.type).toBe('Cyber Security');
      expect(cyberSecurity.securityClearance).toBe('Secret');
    });

    it('should recruit federal agents with appropriate clearances', () => {
      const agency = engine.createFederalAgency(
        'Test Agency',
        'Intelligence Service',
        'Washington, DC',
        10000000
      );

      const agent = engine.recruitFederalAgent(agency.id, 'Agent Smith', 'Senior Agent');

      expect(agent.name).toBe('Agent Smith');
      expect(agent.rank).toBe('Senior Agent');
      expect(agent.securityClearance).toBe('Top Secret');
      expect(agent.cover).toBeDefined();
      expect(agent.status).toBe('Active');
    });

    it('should create intelligence operations', () => {
      const agency = engine.createFederalAgency(
        'Test Agency',
        'Intelligence Service',
        'Washington, DC',
        10000000
      );

      const operation = engine.createIntelligenceOperation(
        agency.id,
        'Operation Nightwatch',
        'Counter Intelligence',
        'Foreign Operatives',
        'Monitor and neutralize foreign intelligence activities',
        1000000
      );

      expect(operation.codename).toBe('Operation Nightwatch');
      expect(operation.type).toBe('Counter Intelligence');
      expect(operation.status).toBe('Planning');
      expect(operation.classification).toBe('Secret');
      expect(operation.budget).toBe(1000000);
    });

    it('should throw error when recruiting for non-existent agency', () => {
      expect(() => {
        engine.recruitFederalAgent('invalid_id', 'Agent Test', 'Agent');
      }).toThrow('Federal agency not found');
    });
  });

  describe('Personal Security Management', () => {
    it('should create personal security for high-profile individuals', () => {
      const security = engine.createPersonalSecurity(
        'President Alexander Hamilton',
        'Mr. President',
        'President of the Republic',
        'Critical',
        10000000
      );

      expect(security.protectedPerson.name).toBe('President Alexander Hamilton');
      expect(security.protectedPerson.title).toBe('Mr. President');
      expect(security.threatLevel).toBe('Critical');
      expect(security.budget).toBe(10000000);
      expect(security.securityProtocols).toBeDefined();
      expect(security.equipment).toBeDefined();
      expect(security.performance).toBeDefined();
    });

    it('should assign security agents with specializations', () => {
      const security = engine.createPersonalSecurity(
        'Prime Minister Johnson',
        'Prime Minister',
        'Head of Government',
        'High',
        5000000
      );

      const agent1 = engine.assignSecurityAgent(
        security.id,
        'Agent Miller',
        ['Close Protection', 'Threat Assessment']
      );

      const agent2 = engine.assignSecurityAgent(
        security.id,
        'Agent Clark',
        ['Counter Surveillance', 'Emergency Response']
      );

      expect(agent1.specialization).toContain('Close Protection');
      expect(agent1.specialization).toContain('Threat Assessment');
      expect(agent2.specialization).toContain('Counter Surveillance');
      expect(agent2.specialization).toContain('Emergency Response');

      const updatedSecurity = engine.getPersonalSecurity(security.id);
      expect(updatedSecurity?.securityDetail).toHaveLength(2);
    });

    it('should generate appropriate threat assessments based on threat level', () => {
      const criticalSecurity = engine.createPersonalSecurity(
        'President',
        'President',
        'Head of State',
        'Critical',
        15000000
      );

      const lowSecurity = engine.createPersonalSecurity(
        'Mayor',
        'Mayor',
        'City Official',
        'Low',
        500000
      );

      expect(criticalSecurity.protectedPerson.threatAssessment.sources.length).toBeGreaterThan(
        lowSecurity.protectedPerson.threatAssessment.sources.length
      );
      expect(criticalSecurity.securityProtocols.length).toBeGreaterThan(
        lowSecurity.securityProtocols.length
      );
    });

    it('should throw error when assigning agent to non-existent security detail', () => {
      expect(() => {
        engine.assignSecurityAgent('invalid_id', 'Agent Test', ['Close Protection']);
      }).toThrow('Personal security detail not found');
    });
  });

  describe('National Guard Management', () => {
    it('should create national guard units', () => {
      const guard = engine.createNationalGuard('National Guard Corps', 20000000);

      expect(guard.name).toBe('National Guard Corps');
      expect(guard.budget).toBe(20000000);
      expect(guard.personnel).toHaveLength(0);
      expect(guard.deployments).toHaveLength(0);
      expect(guard.readiness).toBeGreaterThan(70);
      expect(guard.performance).toBeDefined();
    });

    it('should enlist guard members', () => {
      const guard = engine.createNationalGuard('Test Guard', 10000000);
      
      const member1 = engine.enlistGuardMember(guard.id, 'Colonel Anderson', 'Colonel');
      const member2 = engine.enlistGuardMember(guard.id, 'Major Lee', 'Major');

      expect(member1.rank).toBe('Colonel');
      expect(member2.rank).toBe('Major');

      const updatedGuard = engine.getNationalGuard(guard.id);
      expect(updatedGuard?.personnel).toHaveLength(2);
    });

    it('should create deployments', () => {
      const guard = engine.createNationalGuard('Test Guard', 10000000);
      const member = engine.enlistGuardMember(guard.id, 'Soldier Smith', 'Private');

      const deployment = engine.createDeployment(
        guard.id,
        'Border Security Operation',
        'Southern Border',
        [member.id]
      );

      expect(deployment.mission).toBe('Border Security Operation');
      expect(deployment.location).toBe('Southern Border');
      expect(deployment.personnel).toContain(member.id);
      expect(deployment.status).toBe('Planning');
    });
  });

  describe('Prison Management', () => {
    it('should create different types of prisons', () => {
      const civilianPrison = engine.createPrison(
        'Central Correctional Facility',
        'Civilian',
        2000,
        'Maximum',
        8000000
      );

      const powCamp = engine.createPrison(
        'POW Detention Camp',
        'POW',
        1000,
        'Supermax',
        5000000
      );

      expect(civilianPrison.type).toBe('Civilian');
      expect(civilianPrison.security).toBe('Maximum');
      expect(powCamp.type).toBe('POW');
      expect(powCamp.security).toBe('Supermax');
      expect(powCamp.facilities.length).toBeGreaterThan(civilianPrison.facilities.length);
    });

    it('should admit inmates and track population', () => {
      const prison = engine.createPrison(
        'Test Prison',
        'Civilian',
        100,
        'Medium',
        1000000
      );

      const inmate1 = engine.admitInmate(prison.id, 'John Criminal', 'Civilian', 'Theft', 24);
      const inmate2 = engine.admitInmate(prison.id, 'Jane Offender', 'Civilian', 'Fraud', 36);

      expect(inmate1.name).toBe('John Criminal');
      expect(inmate1.sentence).toBe(24);
      expect(inmate2.sentence).toBe(36);

      const updatedPrison = engine.getPrison(prison.id);
      expect(updatedPrison?.population).toBe(2);
      expect(updatedPrison?.inmates).toHaveLength(2);
    });

    it('should create rehabilitation programs', () => {
      const prison = engine.createPrison(
        'Test Prison',
        'Civilian',
        100,
        'Medium',
        1000000
      );

      const program = engine.createRehabProgram(
        prison.id,
        'Job Training Program',
        'Job Training',
        200000
      );

      expect(program.name).toBe('Job Training Program');
      expect(program.type).toBe('Job Training');
      expect(program.budget).toBe(200000);
      expect(program.active).toBe(true);

      const updatedPrison = engine.getPrison(prison.id);
      expect(updatedPrison?.programs).toHaveLength(1);
    });

    it('should throw error when admitting to non-existent prison', () => {
      expect(() => {
        engine.admitInmate('invalid_id', 'Test Inmate', 'Civilian', 'Test Crime', 12);
      }).toThrow('Prison not found');
    });

    it('should throw error when prison is at capacity', () => {
      const prison = engine.createPrison(
        'Small Prison',
        'Civilian',
        1,
        'Medium',
        500000
      );

      // Fill to capacity
      engine.admitInmate(prison.id, 'Inmate 1', 'Civilian', 'Crime 1', 12);

      // Try to exceed capacity
      expect(() => {
        engine.admitInmate(prison.id, 'Inmate 2', 'Civilian', 'Crime 2', 12);
      }).toThrow('Prison at capacity');
    });
  });

  describe('Security Events', () => {
    it('should record security events', () => {
      const event = engine.recordSecurityEvent(
        'Crime',
        'Downtown District',
        'Medium',
        'Armed robbery reported'
      );

      expect(event.type).toBe('Crime');
      expect(event.location).toBe('Downtown District');
      expect(event.severity).toBe('Medium');
      expect(event.description).toBe('Armed robbery reported');
      expect(event.resolved).toBe(false);
      expect(event.timestamp).toBeInstanceOf(Date);
    });

    it('should retrieve recent events', () => {
      // Record multiple events
      engine.recordSecurityEvent('Crime', 'Location 1', 'Low', 'Event 1');
      engine.recordSecurityEvent('Investigation', 'Location 2', 'High', 'Event 2');
      engine.recordSecurityEvent('Emergency', 'Location 3', 'Critical', 'Event 3');

      const recentEvents = engine.getRecentEvents(2);
      expect(recentEvents).toHaveLength(2);
      expect(recentEvents[0].description).toBe('Event 3'); // Most recent first
      expect(recentEvents[1].description).toBe('Event 2');
    });
  });

  describe('Analytics and Reporting', () => {
    it('should generate comprehensive security analytics', () => {
      // Create some security infrastructure
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const agency = engine.createFederalAgency('Test Agency', 'Intelligence Service', 'DC', 5000000);
      const security = engine.createPersonalSecurity('VIP', 'VIP', 'Official', 'High', 2000000);
      const guard = engine.createNationalGuard('Test Guard', 3000000);
      const prison = engine.createPrison('Test Prison', 'Civilian', 100, 'Medium', 1000000);

      const analytics = engine.generateSecurityAnalytics();

      expect(analytics.policeForces).toHaveLength(1);
      expect(analytics.federalAgencies).toHaveLength(1);
      expect(analytics.personalSecurity).toHaveLength(1);
      expect(analytics.nationalGuard).toHaveLength(1);
      expect(analytics.prisons).toHaveLength(1);
      expect(analytics.totalBudget).toBe(12000000);
      expect(analytics.totalPersonnel).toBe(0); // No personnel hired yet
      expect(analytics.overallSecurity).toBeGreaterThan(0);
      expect(analytics.recommendations).toBeDefined();
    });

    it('should provide security recommendations based on performance', () => {
      // Create a police force with poor performance
      const police = engine.createPoliceForce('city_001', 'Poor Police', 'Local', 'City', 1000000);
      
      // Manually set poor performance for testing
      const force = engine.getPoliceForce(police.id);
      if (force) {
        force.performance.crimeReduction = 30; // Below 50 threshold
        force.corruption = 40; // Above 30 threshold
      }

      const analytics = engine.generateSecurityAnalytics();
      
      expect(analytics.recommendations.length).toBeGreaterThan(0);
      expect(analytics.recommendations.some(r => r.type === 'Personnel Training')).toBe(true);
      expect(analytics.recommendations.some(r => r.type === 'Policy Change')).toBe(true);
    });
  });

  describe('Data Retrieval', () => {
    it('should retrieve all entities by type', () => {
      // Create entities
      engine.createPoliceForce('city_001', 'Police 1', 'Local', 'City', 1000000);
      engine.createPoliceForce('city_002', 'Police 2', 'State', 'State', 2000000);
      engine.createFederalAgency('Agency 1', 'Intelligence Service', 'DC', 5000000);
      engine.createPersonalSecurity('VIP 1', 'VIP', 'Official', 'High', 1000000);
      engine.createNationalGuard('Guard 1', 3000000);
      engine.createPrison('Prison 1', 'Civilian', 100, 'Medium', 1000000);

      expect(engine.getAllPoliceForces()).toHaveLength(2);
      expect(engine.getAllFederalAgencies()).toHaveLength(1);
      expect(engine.getAllPersonalSecurity()).toHaveLength(1);
      expect(engine.getAllNationalGuards()).toHaveLength(1);
      expect(engine.getAllPrisons()).toHaveLength(1);
    });

    it('should retrieve specific entities by ID', () => {
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const agency = engine.createFederalAgency('Test Agency', 'Intelligence Service', 'DC', 5000000);

      expect(engine.getPoliceForce(police.id)).toBeDefined();
      expect(engine.getFederalAgency(agency.id)).toBeDefined();
      expect(engine.getPoliceForce('invalid_id')).toBeUndefined();
      expect(engine.getFederalAgency('invalid_id')).toBeUndefined();
    });
  });
});
