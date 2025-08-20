/**
 * Legal Engine Unit Tests
 * 
 * Comprehensive tests for the Legal & Justice Systems Engine including
 * courts, law enforcement, crimes, corruption cases, and legal case processing.
 */

import { LegalEngine } from '../LegalEngine.js';
import { Crime, LegalCase, CorruptionCase, Court, LawEnforcementAgency } from '../types.js';

describe('LegalEngine', () => {
  let legalEngine: LegalEngine;

  beforeEach(() => {
    legalEngine = new LegalEngine();
  });

  describe('Court System', () => {
    test('should create a court with proper structure', () => {
      const courtData = {
        name: 'Test District Court',
        level: 'district' as const,
        jurisdiction: ['Criminal law', 'Civil law'],
        judges: [{
          id: 'judge_1',
          name: 'Judge Smith',
          title: 'District Judge',
          appointmentDate: new Date(),
          experience: 15,
          specialization: ['Criminal law'],
          philosophy: 'Balanced',
          approval: 75
        }],
        budget: 10000000
      };

      const court = legalEngine.createCourt(courtData);

      expect(court).toBeDefined();
      expect(court.name).toBe('Test District Court');
      expect(court.level).toBe('district');
      expect(court.judges).toHaveLength(1);
      expect(court.budget).toBe(10000000);
      expect(court.status).toBe('operational');
      expect(court.caseload).toBeDefined();
      expect(court.performance).toBeDefined();
    });

    test('should initialize with default courts', () => {
      const courts = legalEngine.getAllCourts();
      
      expect(courts.length).toBeGreaterThan(0);
      
      // Should have different court levels
      const levels = courts.map(c => c.level);
      expect(levels).toContain('supreme');
      expect(levels).toContain('district');
      expect(levels).toContain('local');
    });

    test('should retrieve court by ID', () => {
      const courts = legalEngine.getAllCourts();
      const firstCourt = courts[0];
      
      const retrievedCourt = legalEngine.getCourt(firstCourt.id);
      
      expect(retrievedCourt).toBeDefined();
      expect(retrievedCourt?.id).toBe(firstCourt.id);
      expect(retrievedCourt?.name).toBe(firstCourt.name);
    });

    test('should return undefined for non-existent court', () => {
      const court = legalEngine.getCourt('non_existent_id');
      expect(court).toBeUndefined();
    });
  });

  describe('Law Enforcement Agencies', () => {
    test('should create a law enforcement agency', () => {
      const agencyData = {
        name: 'Test Police Department',
        type: 'police' as const,
        jurisdiction: 'City limits',
        personnel: {
          officers: 100,
          detectives: 15,
          specialists: 5,
          civilians: 20,
          total: 140
        },
        budget: 15000000
      };

      const agency = legalEngine.createLawEnforcementAgency(agencyData);

      expect(agency).toBeDefined();
      expect(agency.name).toBe('Test Police Department');
      expect(agency.type).toBe('police');
      expect(agency.personnel.officers).toBe(100);
      expect(agency.budget).toBe(15000000);
      expect(agency.status).toBe('operational');
      expect(agency.performance).toBeDefined();
      expect(agency.operations).toBeDefined();
    });

    test('should initialize with default law enforcement agencies', () => {
      const agencies = legalEngine.getAllLawEnforcementAgencies();
      
      expect(agencies.length).toBeGreaterThan(0);
      
      // Should have different agency types
      const types = agencies.map(a => a.type);
      expect(types).toContain('police');
      expect(types).toContain('state_police');
      expect(types).toContain('federal');
    });

    test('should retrieve agency by ID', () => {
      const agencies = legalEngine.getAllLawEnforcementAgencies();
      const firstAgency = agencies[0];
      
      const retrievedAgency = legalEngine.getLawEnforcementAgency(firstAgency.id);
      
      expect(retrievedAgency).toBeDefined();
      expect(retrievedAgency?.id).toBe(firstAgency.id);
      expect(retrievedAgency?.name).toBe(firstAgency.name);
    });
  });

  describe('Crime Reporting and Investigation', () => {
    test('should report a crime with proper investigation setup', () => {
      const crimeData = {
        type: 'violent' as const,
        category: 'assault',
        location: 'Downtown Park',
        description: 'Assault incident in the park',
        perpetrator: {
          motives: ['anger'],
          mentalState: 'agitated'
        },
        victims: [{
          type: 'individual' as const,
          impact: { physical: 70, financial: 0, psychological: 50, social: 30 }
        }],
        reportedBy: 'Witness'
      };

      const crime = legalEngine.reportCrime(crimeData);

      expect(crime).toBeDefined();
      expect(crime.type).toBe('violent');
      expect(crime.category).toBe('assault');
      expect(crime.severity).toBe('felony'); // Violent crimes are typically felonies
      expect(crime.investigation).toBeDefined();
      expect(crime.investigation.status).toBe('reported');
      expect(crime.investigation.solvability).toBeGreaterThan(0);
      expect(crime.communityImpact).toBeDefined();
      expect(crime.preventionFactors).toBeDefined();
    });

    test('should assign appropriate severity based on crime type', () => {
      const violentCrime = legalEngine.reportCrime({
        type: 'violent',
        category: 'homicide',
        location: 'Street',
        description: 'Homicide case',
        perpetrator: { motives: ['unknown'], mentalState: 'unknown' },
        victims: [{ type: 'individual', impact: { physical: 100, financial: 0, psychological: 100, social: 100 } }],
        reportedBy: 'Police'
      });

      const propertyCrime = legalEngine.reportCrime({
        type: 'property',
        category: 'theft',
        location: 'Store',
        description: 'Theft incident',
        perpetrator: { motives: ['financial'], mentalState: 'desperate' },
        victims: [{ type: 'business', impact: { physical: 0, financial: 500, psychological: 10, social: 5 } }],
        reportedBy: 'Store Owner'
      });

      expect(violentCrime.severity).toBe('capital'); // Homicide is capital
      expect(propertyCrime.severity).toBe('misdemeanor'); // Simple theft is misdemeanor
    });

    test('should calculate solvability based on available evidence', () => {
      const crimeWithKnownPerpetrator = legalEngine.reportCrime({
        type: 'property',
        category: 'burglary',
        location: 'Residence',
        description: 'Burglary with known suspect',
        perpetrator: { id: 'suspect_123', motives: ['financial'], mentalState: 'desperate' },
        victims: [{ type: 'individual', impact: { physical: 0, financial: 2000, psychological: 40, social: 20 } }],
        reportedBy: 'Homeowner'
      });

      const crimeWithUnknownPerpetrator = legalEngine.reportCrime({
        type: 'property',
        category: 'vandalism',
        location: 'Public Property',
        description: 'Vandalism with no witnesses',
        perpetrator: { motives: ['unknown'], mentalState: 'unknown' },
        victims: [{ type: 'government', impact: { physical: 0, financial: 300, psychological: 0, social: 10 } }],
        reportedBy: 'City Worker'
      });

      expect(crimeWithKnownPerpetrator.investigation.solvability)
        .toBeGreaterThan(crimeWithUnknownPerpetrator.investigation.solvability);
    });

    test('should retrieve crimes by ID', () => {
      const crime = legalEngine.reportCrime({
        type: 'cyber',
        category: 'fraud',
        location: 'Online',
        description: 'Online fraud case',
        perpetrator: { motives: ['financial'], mentalState: 'calculated' },
        victims: [{ type: 'individual', impact: { physical: 0, financial: 5000, psychological: 60, social: 30 } }],
        reportedBy: 'Victim'
      });

      const retrievedCrime = legalEngine.getCrime(crime.id);
      
      expect(retrievedCrime).toBeDefined();
      expect(retrievedCrime?.id).toBe(crime.id);
      expect(retrievedCrime?.type).toBe('cyber');
    });

    test('should get all crimes', () => {
      // Report multiple crimes
      legalEngine.reportCrime({
        type: 'violent',
        category: 'assault',
        location: 'Street',
        description: 'Street assault',
        perpetrator: { motives: ['anger'], mentalState: 'agitated' },
        victims: [{ type: 'individual', impact: { physical: 50, financial: 0, psychological: 40, social: 20 } }],
        reportedBy: 'Witness'
      });

      legalEngine.reportCrime({
        type: 'property',
        category: 'theft',
        location: 'Mall',
        description: 'Mall theft',
        perpetrator: { motives: ['financial'], mentalState: 'desperate' },
        victims: [{ type: 'business', impact: { physical: 0, financial: 200, psychological: 5, social: 5 } }],
        reportedBy: 'Security'
      });

      const allCrimes = legalEngine.getAllCrimes();
      expect(allCrimes.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Corruption Cases', () => {
    test('should report corruption case with proper structure', () => {
      const corruptionData = {
        type: 'bribery' as const,
        officialId: 'official_123',
        office: 'City Planning Department',
        level: 'local' as const,
        description: 'Bribery for permit approval',
        monetaryValue: 50000,
        detectionMethod: 'whistleblower' as const,
        evidenceStrength: 75
      };

      const corruptionCase = legalEngine.reportCorruption(corruptionData);

      expect(corruptionCase).toBeDefined();
      expect(corruptionCase.type).toBe('bribery');
      expect(corruptionCase.officialId).toBe('official_123');
      expect(corruptionCase.level).toBe('local');
      expect(corruptionCase.monetaryValue).toBe(50000);
      expect(corruptionCase.investigationStatus).toBe('alleged');
      expect(corruptionCase.consequences).toBeDefined();
      expect(corruptionCase.preventionMeasures).toBeDefined();
    });

    test('should calculate media attention based on monetary value and level', () => {
      const highValueFederalCase = legalEngine.reportCorruption({
        type: 'embezzlement',
        officialId: 'fed_official_1',
        office: 'Federal Agency',
        level: 'federal',
        description: 'Large embezzlement case',
        monetaryValue: 1000000,
        detectionMethod: 'audit',
        evidenceStrength: 85
      });

      const lowValueLocalCase = legalEngine.reportCorruption({
        type: 'nepotism',
        officialId: 'local_official_1',
        office: 'City Council',
        level: 'local',
        description: 'Nepotism in hiring',
        monetaryValue: 0,
        detectionMethod: 'complaint',
        evidenceStrength: 40
      });

      expect(highValueFederalCase.mediaAttention)
        .toBeGreaterThan(lowValueLocalCase.mediaAttention);
    });

    test('should generate appropriate prevention measures', () => {
      const corruptionCase = legalEngine.reportCorruption({
        type: 'fraud',
        officialId: 'official_456',
        office: 'State Treasury',
        level: 'state',
        description: 'Financial fraud case',
        monetaryValue: 250000,
        detectionMethod: 'audit',
        evidenceStrength: 90
      });

      expect(corruptionCase.preventionMeasures).toBeDefined();
      expect(corruptionCase.preventionMeasures.length).toBeGreaterThan(0);
      
      const measures = corruptionCase.preventionMeasures.map(m => m.measure);
      expect(measures.some(m => m.includes('audit') || m.includes('oversight') || m.includes('ethics')))
        .toBe(true);
    });
  });

  describe('Legal Case Management', () => {
    test('should file a legal case with proper assignment', () => {
      const caseData = {
        title: 'State v. Defendant',
        type: 'criminal' as const,
        category: 'theft',
        severity: 'felony' as const,
        plaintiff: {
          type: 'government' as const,
          name: 'State Prosecutor',
          representation: 'District Attorney Office'
        },
        defendant: {
          type: 'individual' as const,
          name: 'John Doe',
          representation: 'Public Defender'
        }
      };

      const legalCase = legalEngine.fileLegalCase(caseData);

      expect(legalCase).toBeDefined();
      expect(legalCase.title).toBe('State v. Defendant');
      expect(legalCase.type).toBe('criminal');
      expect(legalCase.severity).toBe('felony');
      expect(legalCase.status).toBe('filed');
      expect(legalCase.caseNumber).toBeDefined();
      expect(legalCase.courtId).toBeDefined();
      expect(legalCase.assignedJudge).toBeDefined();
      expect(legalCase.assignedProsecutor).toBeDefined(); // Criminal cases get prosecutors
    });

    test('should assign cases to appropriate courts based on severity', () => {
      const capitalCase = legalEngine.fileLegalCase({
        title: 'State v. Murderer',
        type: 'criminal',
        category: 'homicide',
        severity: 'capital',
        plaintiff: { type: 'government', name: 'State', representation: 'DA' },
        defendant: { type: 'individual', name: 'Defendant', representation: 'Attorney' }
      });

      const misdemeanorCase = legalEngine.fileLegalCase({
        title: 'City v. Jaywalker',
        type: 'criminal',
        category: 'traffic',
        severity: 'misdemeanor',
        plaintiff: { type: 'government', name: 'City', representation: 'City Attorney' },
        defendant: { type: 'individual', name: 'Defendant', representation: 'Self' }
      });

      const courts = legalEngine.getAllCourts();
      const capitalCourt = courts.find(c => c.id === capitalCase.courtId);
      const misdemeanorCourt = courts.find(c => c.id === misdemeanorCase.courtId);

      // Capital cases should go to higher courts
      expect(capitalCourt?.level).not.toBe('local');
      // Misdemeanor cases can go to local courts
      expect(misdemeanorCourt).toBeDefined();
    });

    test('should process legal case through court system', () => {
      const legalCase = legalEngine.fileLegalCase({
        title: 'Test Case',
        type: 'civil',
        category: 'contract_dispute',
        severity: 'misdemeanor',
        plaintiff: { type: 'individual', name: 'Plaintiff', representation: 'Attorney' },
        defendant: { type: 'individual', name: 'Defendant', representation: 'Attorney' }
      });

      expect(legalCase.status).toBe('filed');

      // Process through discovery
      const discoveryCase = legalEngine.processLegalCase(legalCase.id);
      expect(discoveryCase.status).toBe('discovery');
      expect(discoveryCase.hearingDates.length).toBeGreaterThan(0);

      // Process to trial
      const trialCase = legalEngine.processLegalCase(legalCase.id);
      expect(trialCase.status).toBe('trial');
      expect(trialCase.trialDate).toBeDefined();

      // Process to deliberation
      const deliberationCase = legalEngine.processLegalCase(legalCase.id);
      expect(deliberationCase.status).toBe('deliberation');

      // Process to verdict
      const verdictCase = legalEngine.processLegalCase(legalCase.id);
      expect(verdictCase.status).toBe('verdict');
      expect(verdictCase.verdict).toBeDefined();
    });

    test('should generate case numbers in proper format', () => {
      const case1 = legalEngine.fileLegalCase({
        title: 'Case 1',
        type: 'civil',
        category: 'tort',
        severity: 'misdemeanor',
        plaintiff: { type: 'individual', name: 'P1', representation: 'Attorney' },
        defendant: { type: 'individual', name: 'D1', representation: 'Attorney' }
      });

      const case2 = legalEngine.fileLegalCase({
        title: 'Case 2',
        type: 'criminal',
        category: 'theft',
        severity: 'felony',
        plaintiff: { type: 'government', name: 'State', representation: 'DA' },
        defendant: { type: 'individual', name: 'D2', representation: 'PD' }
      });

      expect(case1.caseNumber).toMatch(/^\d{4}-\d{4}$/);
      expect(case2.caseNumber).toMatch(/^\d{4}-\d{4}$/);
      expect(case1.caseNumber).not.toBe(case2.caseNumber);
    });
  });

  describe('System Analytics', () => {
    test('should generate comprehensive analytics', () => {
      // Create some test data
      legalEngine.reportCrime({
        type: 'violent',
        category: 'assault',
        location: 'Street',
        description: 'Test assault',
        perpetrator: { motives: ['anger'], mentalState: 'agitated' },
        victims: [{ type: 'individual', impact: { physical: 50, financial: 0, psychological: 40, social: 20 } }],
        reportedBy: 'Witness'
      });

      legalEngine.reportCorruption({
        type: 'bribery',
        officialId: 'official_test',
        office: 'Test Office',
        level: 'local',
        description: 'Test bribery',
        monetaryValue: 10000,
        detectionMethod: 'audit',
        evidenceStrength: 60
      });

      const analytics = legalEngine.generateLegalAnalytics('test_jurisdiction');

      expect(analytics).toBeDefined();
      expect(analytics.jurisdiction).toBe('test_jurisdiction');
      expect(analytics.justiceHealth).toBeDefined();
      expect(analytics.crimeStatistics).toBeDefined();
      expect(analytics.courtPerformance).toBeDefined();
      expect(analytics.corruptionMetrics).toBeDefined();
      expect(analytics.lawEnforcement).toBeDefined();
      expect(analytics.trends).toBeDefined();
      expect(analytics.predictions).toBeDefined();
      expect(analytics.dataQuality).toBeGreaterThan(0);
      expect(analytics.confidence).toBeGreaterThan(0);
    });

    test('should track system health metrics', () => {
      const analytics = legalEngine.generateLegalAnalytics('test_jurisdiction');
      
      expect(analytics.justiceHealth.overallScore).toBeGreaterThanOrEqual(0);
      expect(analytics.justiceHealth.overallScore).toBeLessThanOrEqual(100);
      expect(analytics.justiceHealth.components.accessToJustice).toBeGreaterThanOrEqual(0);
      expect(analytics.justiceHealth.components.fairness).toBeGreaterThanOrEqual(0);
      expect(analytics.justiceHealth.components.efficiency).toBeGreaterThanOrEqual(0);
      expect(analytics.justiceHealth.components.transparency).toBeGreaterThanOrEqual(0);
      expect(analytics.justiceHealth.components.accountability).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Time Simulation', () => {
    test('should simulate time step without errors', () => {
      const initialCrimes = legalEngine.getAllCrimes().length;
      const initialCases = legalEngine.getAllLegalCases().length;
      
      // Run simulation
      expect(() => legalEngine.simulateTimeStep()).not.toThrow();
      
      // System should still be functional
      const finalCrimes = legalEngine.getAllCrimes().length;
      const finalCases = legalEngine.getAllLegalCases().length;
      
      // Crimes might increase due to random generation
      expect(finalCrimes).toBeGreaterThanOrEqual(initialCrimes);
      // Cases should remain the same or increase
      expect(finalCases).toBeGreaterThanOrEqual(initialCases);
    });

    test('should generate legal events during simulation', () => {
      const initialEvents = legalEngine.getLegalEvents().length;
      
      // Add some activity to generate events
      legalEngine.reportCrime({
        type: 'property',
        category: 'theft',
        location: 'Store',
        description: 'Simulation theft',
        perpetrator: { motives: ['financial'], mentalState: 'desperate' },
        victims: [{ type: 'business', impact: { physical: 0, financial: 100, psychological: 5, social: 5 } }],
        reportedBy: 'Owner'
      });

      const finalEvents = legalEngine.getLegalEvents().length;
      expect(finalEvents).toBeGreaterThan(initialEvents);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid case processing', () => {
      expect(() => legalEngine.processLegalCase('invalid_id'))
        .toThrow('Legal case not found: invalid_id');
    });

    test('should handle missing required fields gracefully', () => {
      // The engine should handle missing optional fields without crashing
      const crime = legalEngine.reportCrime({
        type: 'property',
        category: 'theft',
        location: 'Unknown',
        description: 'Minimal crime report',
        perpetrator: { motives: [], mentalState: 'unknown' },
        victims: [],
        reportedBy: 'Anonymous'
      });

      expect(crime).toBeDefined();
      expect(crime.victims).toEqual([]);
      expect(crime.perpetrator.motives).toEqual([]);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain unique IDs for all entities', () => {
      const crime1 = legalEngine.reportCrime({
        type: 'property',
        category: 'theft',
        location: 'Store A',
        description: 'First theft',
        perpetrator: { motives: ['financial'], mentalState: 'desperate' },
        victims: [{ type: 'business', impact: { physical: 0, financial: 100, psychological: 5, social: 5 } }],
        reportedBy: 'Owner'
      });

      const crime2 = legalEngine.reportCrime({
        type: 'property',
        category: 'theft',
        location: 'Store B',
        description: 'Second theft',
        perpetrator: { motives: ['financial'], mentalState: 'desperate' },
        victims: [{ type: 'business', impact: { physical: 0, financial: 200, psychological: 5, social: 5 } }],
        reportedBy: 'Owner'
      });

      expect(crime1.id).not.toBe(crime2.id);
    });

    test('should maintain referential integrity between entities', () => {
      const courts = legalEngine.getAllCourts();
      const agencies = legalEngine.getAllLawEnforcementAgencies();
      
      expect(courts.length).toBeGreaterThan(0);
      expect(agencies.length).toBeGreaterThan(0);
      
      // File a case and ensure it references a valid court
      const legalCase = legalEngine.fileLegalCase({
        title: 'Integrity Test Case',
        type: 'criminal',
        category: 'theft',
        severity: 'felony',
        plaintiff: { type: 'government', name: 'State', representation: 'DA' },
        defendant: { type: 'individual', name: 'Defendant', representation: 'PD' }
      });

      const assignedCourt = courts.find(c => c.id === legalCase.courtId);
      expect(assignedCourt).toBeDefined();
    });
  });
});
