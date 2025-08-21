/**
 * Security & Defense Systems API Routes
 * Provides REST API endpoints for police, federal agencies, and personal security
 */

import express from 'express';
import { SecurityEngine } from './SecurityEngine.js';
import { SecurityAnalytics } from './SecurityAnalytics.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Security System
const securityKnobsData = {
  // Law Enforcement & Policing
  police_force_size: 0.7,                 // Police force size and deployment level
  community_policing_emphasis: 0.6,       // Community policing vs traditional enforcement
  police_training_standards: 0.8,         // Police training quality and standards
  
  // Crime Prevention & Response
  crime_prevention_priority: 0.8,         // Crime prevention vs reactive response
  emergency_response_speed: 0.8,          // Emergency response time and efficiency
  investigation_thoroughness: 0.7,        // Criminal investigation depth and quality
  
  // Security Technology & Surveillance
  surveillance_technology_adoption: 0.6,  // Surveillance technology deployment level
  cybersecurity_investment: 0.8,          // Cybersecurity infrastructure investment
  biometric_security_usage: 0.5,          // Biometric security system deployment
  
  // Federal & National Security
  federal_security_coordination: 0.7,     // Federal security agency coordination
  intelligence_sharing: 0.8,              // Intelligence sharing between agencies
  national_security_priority: 0.8,        // National security threat response priority
  
  // Border & Immigration Security
  border_security_strictness: 0.7,        // Border control and security measures
  immigration_enforcement: 0.6,           // Immigration law enforcement intensity
  customs_inspection_thoroughness: 0.7,   // Customs and trade security inspection
  
  // Personal & Private Security
  private_security_regulation: 0.6,       // Private security industry regulation
  personal_protection_accessibility: 0.5, // Personal security service accessibility
  corporate_security_standards: 0.7,      // Corporate security requirement standards
  
  // Prison & Correctional Security
  prison_security_level: 0.8,             // Prison security measures and protocols
  rehabilitation_vs_punishment: 0.6,      // Rehabilitation vs punishment emphasis
  prisoner_rights_protection: 0.7,        // Prisoner rights and treatment standards
  
  // Public Safety & Emergency Management
  disaster_preparedness: 0.8,             // Disaster and emergency preparedness
  public_safety_education: 0.6,           // Public safety awareness and education
  crisis_communication: 0.8,              // Crisis communication and coordination
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Security
const securityKnobSystem = new EnhancedKnobSystem(securityKnobsData);

// Apply security knobs to game state
function applySecurityKnobsToGameState() {
  const knobs = securityKnobSystem.knobs;
  
  // Apply law enforcement settings
  const lawEnforcement = (knobs.police_force_size + knobs.community_policing_emphasis + 
    knobs.police_training_standards) / 3;
  
  // Apply crime prevention settings
  const crimePrevention = (knobs.crime_prevention_priority + knobs.emergency_response_speed + 
    knobs.investigation_thoroughness) / 3;
  
  // Apply security technology settings
  const securityTechnology = (knobs.surveillance_technology_adoption + knobs.cybersecurity_investment + 
    knobs.biometric_security_usage) / 3;
  
  // Apply federal security settings
  const federalSecurity = (knobs.federal_security_coordination + knobs.intelligence_sharing + 
    knobs.national_security_priority) / 3;
  
  // Apply border security settings
  const borderSecurity = (knobs.border_security_strictness + knobs.immigration_enforcement + 
    knobs.customs_inspection_thoroughness) / 3;
  
  // Apply public safety settings
  const publicSafety = (knobs.disaster_preparedness + knobs.public_safety_education + 
    knobs.crisis_communication) / 3;
  
  console.log('Applied security knobs to game state:', {
    lawEnforcement,
    crimePrevention,
    securityTechnology,
    federalSecurity,
    borderSecurity,
    publicSafety
  });
}

const securityEngine = new SecurityEngine();
const securityAnalytics = new SecurityAnalytics();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: ['police', 'federal-agencies', 'personal-security', 'national-guard', 'prisons']
  });
});

// Police Force Management
router.post('/police', (req, res) => {
  try {
    const { cityId, name, type = 'Local', jurisdiction = 'City', budget } = req.body;
    const force = securityEngine.createPoliceForce(cityId, name, type, jurisdiction, budget);
    res.json(force);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/police', (req, res) => {
  const forces = securityEngine.getAllPoliceForces();
  res.json(forces);
});

router.get('/police/:id', (req, res) => {
  const force = securityEngine.getPoliceForce(req.params.id);
  if (!force) {
    return res.status(404).json({ error: 'Police force not found' });
  }
  res.json(force);
});

router.post('/police/:id/officers', (req, res) => {
  try {
    const { name, rank = 'Recruit' } = req.body;
    const officer = securityEngine.hireOfficer(req.params.id, name, rank);
    res.json(officer);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/police/:id/units', (req, res) => {
  try {
    const { name, type, budget } = req.body;
    const unit = securityEngine.createSpecialUnit(req.params.id, name, type, budget);
    res.json(unit);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Federal Agencies Management
router.post('/federal-agencies', (req, res) => {
  try {
    const { name, type, headquarters, budget } = req.body;
    const agency = securityEngine.createFederalAgency(name, type, headquarters, budget);
    res.json(agency);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/federal-agencies', (req, res) => {
  const agencies = securityEngine.getAllFederalAgencies();
  res.json(agencies);
});

router.get('/federal-agencies/:id', (req, res) => {
  const agency = securityEngine.getFederalAgency(req.params.id);
  if (!agency) {
    return res.status(404).json({ error: 'Federal agency not found' });
  }
  res.json(agency);
});

router.post('/federal-agencies/:id/agents', (req, res) => {
  try {
    const { name, rank = 'Agent' } = req.body;
    const agent = securityEngine.recruitFederalAgent(req.params.id, name, rank);
    res.json(agent);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/federal-agencies/:id/operations', (req, res) => {
  try {
    const { codename, type, target, objective, budget } = req.body;
    const operation = securityEngine.createIntelligenceOperation(
      req.params.id, 
      codename, 
      type, 
      target, 
      objective, 
      budget
    );
    res.json(operation);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Personal Security Management
router.post('/personal-security', (req, res) => {
  try {
    const { protectedPersonName, title, position, threatLevel, budget } = req.body;
    const security = securityEngine.createPersonalSecurity(
      protectedPersonName, 
      title, 
      position, 
      threatLevel, 
      budget
    );
    res.json(security);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/personal-security', (req, res) => {
  const securities = securityEngine.getAllPersonalSecurity();
  res.json(securities);
});

router.get('/personal-security/:id', (req, res) => {
  const security = securityEngine.getPersonalSecurity(req.params.id);
  if (!security) {
    return res.status(404).json({ error: 'Personal security detail not found' });
  }
  res.json(security);
});

router.post('/personal-security/:id/agents', (req, res) => {
  try {
    const { name, specializations = [] } = req.body;
    const agent = securityEngine.assignSecurityAgent(req.params.id, name, specializations);
    res.json(agent);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// National Guard Management
router.post('/national-guard', (req, res) => {
  try {
    const { name, budget } = req.body;
    const guard = securityEngine.createNationalGuard(name, budget);
    res.json(guard);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/national-guard', (req, res) => {
  const guards = securityEngine.getAllNationalGuards();
  res.json(guards);
});

router.get('/national-guard/:id', (req, res) => {
  const guard = securityEngine.getNationalGuard(req.params.id);
  if (!guard) {
    return res.status(404).json({ error: 'National Guard not found' });
  }
  res.json(guard);
});

router.post('/national-guard/:id/personnel', (req, res) => {
  try {
    const { name, rank = 'Private' } = req.body;
    const member = securityEngine.enlistGuardMember(req.params.id, name, rank);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/national-guard/:id/deployments', (req, res) => {
  try {
    const { mission, location, personnelIds = [] } = req.body;
    const deployment = securityEngine.createDeployment(req.params.id, mission, location, personnelIds);
    res.json(deployment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Prison Management
router.post('/prisons', (req, res) => {
  try {
    const { name, type, capacity, security, budget } = req.body;
    const prison = securityEngine.createPrison(name, type, capacity, security, budget);
    res.json(prison);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/prisons', (req, res) => {
  const prisons = securityEngine.getAllPrisons();
  res.json(prisons);
});

router.get('/prisons/:id', (req, res) => {
  const prison = securityEngine.getPrison(req.params.id);
  if (!prison) {
    return res.status(404).json({ error: 'Prison not found' });
  }
  res.json(prison);
});

router.post('/prisons/:id/inmates', (req, res) => {
  try {
    const { name, type, crime, sentence } = req.body;
    const inmate = securityEngine.admitInmate(req.params.id, name, type, crime, sentence);
    res.json(inmate);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/prisons/:id/programs', (req, res) => {
  try {
    const { name, type, budget } = req.body;
    const program = securityEngine.createRehabProgram(req.params.id, name, type, budget);
    res.json(program);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Security Events
router.post('/events', (req, res) => {
  try {
    const { type, location, severity, description } = req.body;
    const event = securityEngine.recordSecurityEvent(type, location, severity, description);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/events', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const events = securityEngine.getRecentEvents(limit);
  res.json(events);
});

router.get('/events/all', (req, res) => {
  const events = securityEngine.getSecurityEvents();
  res.json(events);
});

// Analytics and Reporting
router.get('/analytics', (req, res) => {
  const analytics = securityEngine.generateSecurityAnalytics();
  res.json(analytics);
});

router.get('/analytics/metrics', (req, res) => {
  const policeForces = securityEngine.getAllPoliceForces();
  const nationalGuards = securityEngine.getAllNationalGuards();
  const prisons = securityEngine.getAllPrisons();
  
  const metrics = securityAnalytics.calculateSecurityMetrics(policeForces, nationalGuards, prisons);
  res.json(metrics);
});

router.get('/analytics/threat-assessment', (req, res) => {
  const policeForces = securityEngine.getAllPoliceForces();
  const nationalGuards = securityEngine.getAllNationalGuards();
  const prisons = securityEngine.getAllPrisons();
  const events = securityEngine.getSecurityEvents();
  
  const assessment = securityAnalytics.assessThreat(policeForces, nationalGuards, prisons, events);
  res.json(assessment);
});

router.get('/analytics/performance-trends', (req, res) => {
  const policeForces = securityEngine.getAllPoliceForces();
  const prisons = securityEngine.getAllPrisons();
  
  const trends = securityAnalytics.analyzePerformanceTrends(policeForces, prisons);
  res.json(trends);
});

router.get('/analytics/resource-allocation', (req, res) => {
  const policeForces = securityEngine.getAllPoliceForces();
  const nationalGuards = securityEngine.getAllNationalGuards();
  const prisons = securityEngine.getAllPrisons();
  
  const allocation = securityAnalytics.analyzeResourceAllocation(policeForces, nationalGuards, prisons);
  res.json(allocation);
});

router.get('/analytics/security-health', (req, res) => {
  const policeForces = securityEngine.getAllPoliceForces();
  const nationalGuards = securityEngine.getAllNationalGuards();
  const prisons = securityEngine.getAllPrisons();
  
  const health = securityAnalytics.assessSecurityHealth(policeForces, nationalGuards, prisons);
  res.json(health);
});

router.get('/analytics/recommendations', (req, res) => {
  const policeForces = securityEngine.getAllPoliceForces();
  const nationalGuards = securityEngine.getAllNationalGuards();
  const prisons = securityEngine.getAllPrisons();
  
  const recommendations = securityAnalytics.generateOptimizationRecommendations(policeForces, nationalGuards, prisons);
  res.json(recommendations);
});

// Demo data generation
router.post('/demo/generate', (req, res) => {
  try {
    // Create sample police forces
    const localPolice = securityEngine.createPoliceForce(
      'city_001', 
      'Metro Police Department', 
      'Local', 
      'City', 
      5000000
    );
    
    const federalBureau = securityEngine.createPoliceForce(
      undefined, 
      'Federal Bureau of Investigation', 
      'Federal', 
      'Federal', 
      15000000
    );
    
    const secretPolice = securityEngine.createPoliceForce(
      undefined, 
      'State Security Service', 
      'Secret Police', 
      'National', 
      25000000
    );

    // Add officers
    securityEngine.hireOfficer(localPolice.id, 'Officer John Smith', 'Officer');
    securityEngine.hireOfficer(localPolice.id, 'Sergeant Jane Doe', 'Sergeant');
    securityEngine.hireOfficer(federalBureau.id, 'Agent Robert Johnson', 'Agent');
    securityEngine.hireOfficer(secretPolice.id, 'Agent Sarah Wilson', 'Agent');

    // Create special units
    securityEngine.createSpecialUnit(localPolice.id, 'SWAT Team Alpha', 'SWAT', 500000);
    securityEngine.createSpecialUnit(federalBureau.id, 'Counter Terrorism Unit', 'Counter Terrorism', 2000000);
    securityEngine.createSpecialUnit(secretPolice.id, 'Surveillance Division', 'Surveillance', 3000000);

    // Create federal agencies
    const intelligence = securityEngine.createFederalAgency(
      'Central Intelligence Agency', 
      'Intelligence Service', 
      'Langley, VA', 
      50000000
    );
    
    const cyberSecurity = securityEngine.createFederalAgency(
      'Cyber Security Division', 
      'Cyber Security', 
      'Fort Meade, MD', 
      30000000
    );

    // Recruit federal agents
    securityEngine.recruitFederalAgent(intelligence.id, 'Agent Michael Brown', 'Senior Agent');
    securityEngine.recruitFederalAgent(cyberSecurity.id, 'Agent Lisa Davis', 'Agent');

    // Create intelligence operations
    securityEngine.createIntelligenceOperation(
      intelligence.id,
      'Operation Nightwatch',
      'Counter Intelligence',
      'Foreign Operatives',
      'Monitor and neutralize foreign intelligence activities',
      1000000
    );

    // Create personal security for leader
    const presidentSecurity = securityEngine.createPersonalSecurity(
      'President Alexander Hamilton',
      'Mr. President',
      'President of the Republic',
      'Critical',
      10000000
    );

    // Assign security agents
    securityEngine.assignSecurityAgent(
      presidentSecurity.id,
      'Agent David Miller',
      ['Close Protection', 'Threat Assessment']
    );
    
    securityEngine.assignSecurityAgent(
      presidentSecurity.id,
      'Agent Emily Clark',
      ['Counter Surveillance', 'Emergency Response']
    );

    // Create National Guard
    const nationalGuard = securityEngine.createNationalGuard('National Guard Corps', 20000000);
    securityEngine.enlistGuardMember(nationalGuard.id, 'Colonel James Anderson', 'Colonel');
    securityEngine.enlistGuardMember(nationalGuard.id, 'Major Patricia Lee', 'Major');

    // Create deployment
    securityEngine.createDeployment(
      nationalGuard.id,
      'Border Security Operation',
      'Southern Border',
      []
    );

    // Create prisons
    const civilianPrison = securityEngine.createPrison(
      'Central Correctional Facility',
      'Civilian',
      2000,
      'Maximum',
      8000000
    );
    
    const militaryPrison = securityEngine.createPrison(
      'Military Detention Center',
      'Military',
      500,
      'Maximum',
      3000000
    );
    
    const powCamp = securityEngine.createPrison(
      'POW Detention Camp',
      'POW',
      1000,
      'Supermax',
      5000000
    );

    // Admit inmates
    securityEngine.admitInmate(civilianPrison.id, 'John Criminal', 'Civilian', 'Armed Robbery', 60);
    securityEngine.admitInmate(militaryPrison.id, 'Sergeant Traitor', 'Military', 'Desertion', 24);
    securityEngine.admitInmate(powCamp.id, 'Enemy Soldier', 'POW', 'Prisoner of War', 0);

    // Create rehabilitation programs
    securityEngine.createRehabProgram(civilianPrison.id, 'Job Training Program', 'Job Training', 200000);
    securityEngine.createRehabProgram(civilianPrison.id, 'Education Program', 'Education', 150000);

    // Record some security events
    securityEngine.recordSecurityEvent('Crime', 'Downtown District', 'Medium', 'Armed robbery reported');
    securityEngine.recordSecurityEvent('Intelligence Operation', 'Classified Location', 'High', 'Counter-intelligence operation initiated');
    securityEngine.recordSecurityEvent('Surveillance', 'Government District', 'Low', 'Routine surveillance sweep completed');

    res.json({ 
      message: 'Demo data generated successfully',
      summary: {
        policeForces: 3,
        federalAgencies: 2,
        personalSecurity: 1,
        nationalGuard: 1,
        prisons: 3,
        officers: 4,
        agents: 4,
        inmates: 3,
        events: 3
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'security', securityKnobSystem, applySecurityKnobsToGameState);

export default router;
