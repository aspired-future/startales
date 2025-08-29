/**
 * Security & Defense Systems Engine
 * Manages police forces, national guard, and prison systems
 */

import { 
  PoliceForce, 
  Officer, 
  NationalGuard, 
  GuardMember, 
  Prison, 
  Inmate, 
  SecurityAnalyticsData,
  SecurityEvent,
  PolicePerformance,
  GuardPerformance,
  PrisonPerformance,
  Equipment,
  SpecialUnit,
  Deployment,
  RehabProgram,
  SecurityRecommendation,
  OfficerRank,
  MilitaryRank,
  PrisonType,
  SecurityLevel,
  InmateType,
  InmateStatus,
  SpecialUnitType,
  EquipmentType,
  ProgramType,
  RecommendationType,
  FederalAgency,
  FederalAgent,
  PersonalSecurity,
  SecurityAgent,
  ProtectedPerson,
  IntelligenceOperation,
  SurveillanceNetwork,
  PoliceType,
  Jurisdiction,
  SecurityClearance,
  AgencyType,
  FederalRank,
  AgentStatus,
  IntelligenceType,
  ThreatLevel,
  SecurityProtocol,
  SecuritySpecialization,
  ThreatSource
} from './types';

export class SecurityEngine {
  private policeForces: Map<string, PoliceForce> = new Map();
  private nationalGuards: Map<string, NationalGuard> = new Map();
  private prisons: Map<string, Prison> = new Map();
  private federalAgencies: Map<string, FederalAgency> = new Map();
  private personalSecurity: Map<string, PersonalSecurity> = new Map();
  private surveillanceNetworks: Map<string, SurveillanceNetwork> = new Map();
  private securityEvents: SecurityEvent[] = [];

  // Police Force Management
  createPoliceForce(
    cityId: string | undefined, 
    name: string, 
    type: PoliceType, 
    jurisdiction: Jurisdiction, 
    budget: number
  ): PoliceForce {
    const force: PoliceForce = {
      id: `police_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cityId,
      name,
      type,
      officers: [],
      budget,
      equipment: this.generateInitialEquipment(type === 'Federal' || type === 'Secret Police' ? 'federal' : 'police'),
      performance: this.calculateInitialPolicePerformance(type),
      communityRelations: type === 'Secret Police' ? 20 + Math.random() * 30 : 50 + Math.random() * 30,
      corruption: type === 'Secret Police' ? 10 + Math.random() * 30 : Math.random() * 20,
      specialUnits: [],
      jurisdiction,
      securityClearance: type === 'Federal' || type === 'Secret Police' ? 'Secret' : 'None',
      created: new Date(),
      updated: new Date()
    };

    this.policeForces.set(force.id, force);
    return force;
  }

  hireOfficer(forceId: string, name: string, rank: OfficerRank = 'Recruit'): Officer {
    const force = this.policeForces.get(forceId);
    if (!force) throw new Error('Police force not found');

    const officer: Officer = {
      id: `officer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      rank,
      experience: rank === 'Recruit' ? 0 : Math.random() * 10,
      performance: 60 + Math.random() * 30, // 60-90 initial
      corruption: Math.random() * 10, // 0-10 initial
      specializations: [],
      status: 'Active',
      assigned: 'General Patrol',
      hired: new Date()
    };

    force.officers.push(officer);
    force.updated = new Date();
    this.updatePolicePerformance(forceId);
    
    return officer;
  }

  createSpecialUnit(forceId: string, name: string, type: SpecialUnitType, budget: number): SpecialUnit {
    const force = this.policeForces.get(forceId);
    if (!force) throw new Error('Police force not found');

    const unit: SpecialUnit = {
      id: `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      officers: [],
      equipment: this.generateSpecializedEquipment(type),
      budget,
      performance: 70 + Math.random() * 20, // 70-90 initial
      active: true
    };

    force.specialUnits.push(unit);
    force.updated = new Date();
    
    return unit;
  }

  // National Guard Management
  createNationalGuard(name: string, budget: number): NationalGuard {
    const guard: NationalGuard = {
      id: `guard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      personnel: [],
      budget,
      equipment: this.generateInitialEquipment('military'),
      readiness: 70 + Math.random() * 20, // 70-90 initial
      deployments: [],
      bases: [],
      performance: this.calculateInitialGuardPerformance(),
      created: new Date(),
      updated: new Date()
    };

    this.nationalGuards.set(guard.id, guard);
    return guard;
  }

  enlistGuardMember(guardId: string, name: string, rank: MilitaryRank = 'Private'): GuardMember {
    const guard = this.nationalGuards.get(guardId);
    if (!guard) throw new Error('National Guard not found');

    const member: GuardMember = {
      id: `guard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      rank,
      experience: rank === 'Private' ? 0 : Math.random() * 15,
      specializations: [],
      status: 'Active',
      unit: 'General Infantry',
      security_clearance: 'None',
      enlisted: new Date()
    };

    guard.personnel.push(member);
    guard.updated = new Date();
    this.updateGuardPerformance(guardId);
    
    return member;
  }

  createDeployment(guardId: string, mission: string, location: string, personnelIds: string[]): Deployment {
    const guard = this.nationalGuards.get(guardId);
    if (!guard) throw new Error('National Guard not found');

    const deployment: Deployment = {
      id: `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mission,
      location,
      personnel: personnelIds,
      startDate: new Date(),
      status: 'Planning',
      objective: mission,
      success: false
    };

    guard.deployments.push(deployment);
    guard.updated = new Date();
    
    return deployment;
  }

  // Prison Management
  createPrison(name: string, type: PrisonType, capacity: number, security: SecurityLevel, budget: number): Prison {
    const prison: Prison = {
      id: `prison_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      capacity,
      population: 0,
      inmates: [],
      staff: [],
      security,
      budget,
      facilities: this.generatePrisonFacilities(type, capacity),
      programs: [],
      performance: this.calculateInitialPrisonPerformance(),
      created: new Date(),
      updated: new Date()
    };

    this.prisons.set(prison.id, prison);
    return prison;
  }

  admitInmate(prisonId: string, name: string, type: InmateType, crime: string, sentence: number): Inmate {
    const prison = this.prisons.get(prisonId);
    if (!prison) throw new Error('Prison not found');
    if (prison.population >= prison.capacity) throw new Error('Prison at capacity');

    const inmate: Inmate = {
      id: `inmate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      crime,
      sentence,
      served: 0,
      behavior: 60 + Math.random() * 30, // 60-90 initial
      rehabilitation: 30 + Math.random() * 20, // 30-50 initial
      status: 'Incarcerated',
      cellBlock: this.assignCellBlock(prison, type),
      programs: [],
      admitted: new Date()
    };

    prison.inmates.push(inmate);
    prison.population++;
    prison.updated = new Date();
    this.updatePrisonPerformance(prisonId);
    
    return inmate;
  }

  createRehabProgram(prisonId: string, name: string, type: ProgramType, budget: number): RehabProgram {
    const prison = this.prisons.get(prisonId);
    if (!prison) throw new Error('Prison not found');

    const program: RehabProgram = {
      id: `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      participants: [],
      staff: [],
      budget,
      effectiveness: 60 + Math.random() * 30, // 60-90 initial
      active: true
    };

    prison.programs.push(program);
    prison.updated = new Date();
    
    return program;
  }

  // Performance Calculations
  private updatePolicePerformance(forceId: string): void {
    const force = this.policeForces.get(forceId);
    if (!force) return;

    const avgOfficerPerformance = force.officers.reduce((sum, officer) => sum + officer.performance, 0) / force.officers.length || 0;
    const avgCorruption = force.officers.reduce((sum, officer) => sum + officer.corruption, 0) / force.officers.length || 0;
    
    force.performance = {
      crimeReduction: Math.max(0, avgOfficerPerformance - avgCorruption - 20 + Math.random() * 20),
      responseTime: Math.max(5, 15 - (avgOfficerPerformance / 10) + Math.random() * 5),
      clearanceRate: Math.max(20, avgOfficerPerformance - avgCorruption + Math.random() * 20),
      communityTrust: Math.max(0, force.communityRelations - avgCorruption),
      officerSafety: Math.max(50, avgOfficerPerformance + Math.random() * 20),
      budgetEfficiency: Math.max(30, 80 - (force.budget / 1000000) * 10 + Math.random() * 20)
    };
  }

  private updateGuardPerformance(guardId: string): void {
    const guard = this.nationalGuards.get(guardId);
    if (!guard) return;

    const avgExperience = guard.personnel.reduce((sum, member) => sum + member.experience, 0) / guard.personnel.length || 0;
    
    guard.performance = {
      readiness: Math.max(50, guard.readiness + avgExperience * 2),
      training: Math.max(60, 70 + avgExperience + Math.random() * 20),
      equipment: Math.max(50, 80 - (guard.equipment.length * 2) + Math.random() * 20),
      morale: Math.max(40, 70 + Math.random() * 30),
      effectiveness: Math.max(50, (guard.readiness + avgExperience * 3) / 2)
    };
  }

  private updatePrisonPerformance(prisonId: string): void {
    const prison = this.prisons.get(prisonId);
    if (!prison) return;

    const avgBehavior = prison.inmates.reduce((sum, inmate) => sum + inmate.behavior, 0) / prison.inmates.length || 0;
    const avgRehab = prison.inmates.reduce((sum, inmate) => sum + inmate.rehabilitation, 0) / prison.inmates.length || 0;
    const overcrowding = Math.max(0, (prison.population / prison.capacity - 1) * 100);
    
    prison.performance = {
      security: Math.max(30, 90 - overcrowding - (100 - avgBehavior)),
      rehabilitation: Math.max(20, avgRehab + prison.programs.length * 5),
      recidivism: Math.max(10, 40 - avgRehab / 2 + overcrowding / 2),
      safety: Math.max(40, avgBehavior - overcrowding),
      overcrowding,
      budgetEfficiency: Math.max(30, 80 - (prison.budget / 1000000) * 5)
    };
  }

  // Helper Methods
  private generateInitialEquipment(type: 'police' | 'military'): Equipment[] {
    const equipment: Equipment[] = [];
    
    if (type === 'police') {
      equipment.push(
        { id: 'eq1', name: 'Patrol Cars', type: 'Vehicles', quantity: 10, condition: 85, cost: 300000, maintenanceCost: 5000, acquired: new Date() },
        { id: 'eq2', name: 'Radios', type: 'Communications', quantity: 50, condition: 90, cost: 25000, maintenanceCost: 500, acquired: new Date() },
        { id: 'eq3', name: 'Body Armor', type: 'Protective Gear', quantity: 50, condition: 95, cost: 75000, maintenanceCost: 1000, acquired: new Date() }
      );
    } else {
      equipment.push(
        { id: 'eq1', name: 'Military Vehicles', type: 'Vehicles', quantity: 5, condition: 80, cost: 500000, maintenanceCost: 10000, acquired: new Date() },
        { id: 'eq2', name: 'Communications Gear', type: 'Communications', quantity: 100, condition: 85, cost: 100000, maintenanceCost: 2000, acquired: new Date() },
        { id: 'eq3', name: 'Combat Equipment', type: 'Weapons', quantity: 100, condition: 90, cost: 200000, maintenanceCost: 5000, acquired: new Date() }
      );
    }
    
    return equipment;
  }

  private generateSpecializedEquipment(type: SpecialUnitType): Equipment[] {
    const equipment: Equipment[] = [];
    
    switch (type) {
      case 'SWAT':
        equipment.push(
          { id: 'swat1', name: 'Tactical Gear', type: 'Protective Gear', quantity: 20, condition: 95, cost: 100000, maintenanceCost: 2000, acquired: new Date() },
          { id: 'swat2', name: 'Armored Vehicle', type: 'Vehicles', quantity: 1, condition: 90, cost: 200000, maintenanceCost: 5000, acquired: new Date() }
        );
        break;
      case 'Detective':
        equipment.push(
          { id: 'det1', name: 'Forensic Kit', type: 'Forensics', quantity: 10, condition: 90, cost: 50000, maintenanceCost: 1000, acquired: new Date() },
          { id: 'det2', name: 'Surveillance Equipment', type: 'Surveillance', quantity: 15, condition: 85, cost: 75000, maintenanceCost: 1500, acquired: new Date() }
        );
        break;
      case 'Cybercrime':
        equipment.push(
          { id: 'cyber1', name: 'Computer Forensics', type: 'Forensics', quantity: 5, condition: 95, cost: 100000, maintenanceCost: 2000, acquired: new Date() },
          { id: 'cyber2', name: 'Network Analysis Tools', type: 'Surveillance', quantity: 10, condition: 90, cost: 80000, maintenanceCost: 1600, acquired: new Date() }
        );
        break;
      default:
        equipment.push(
          { id: 'gen1', name: 'Standard Equipment', type: 'Protective Gear', quantity: 10, condition: 80, cost: 25000, maintenanceCost: 500, acquired: new Date() }
        );
    }
    
    return equipment;
  }

  private generatePrisonFacilities(type: PrisonType, capacity: number): any[] {
    const facilities = [
      { id: 'cell1', name: 'Cell Block A', type: 'Cell Block', capacity: Math.floor(capacity * 0.4), condition: 80, security: 85, operational: true },
      { id: 'cell2', name: 'Cell Block B', type: 'Cell Block', capacity: Math.floor(capacity * 0.4), condition: 80, security: 85, operational: true },
      { id: 'cafe1', name: 'Main Cafeteria', type: 'Cafeteria', capacity: Math.floor(capacity * 0.8), condition: 75, security: 70, operational: true },
      { id: 'med1', name: 'Medical Wing', type: 'Medical', capacity: Math.floor(capacity * 0.1), condition: 85, security: 80, operational: true },
      { id: 'rec1', name: 'Recreation Area', type: 'Recreation', capacity: Math.floor(capacity * 0.3), condition: 70, security: 60, operational: true }
    ];

    if (type === 'POW') {
      facilities.push(
        { id: 'inter1', name: 'Interrogation Rooms', type: 'Administration', capacity: 10, condition: 90, security: 95, operational: true },
        { id: 'iso1', name: 'Isolation Wing', type: 'Cell Block', capacity: Math.floor(capacity * 0.1), condition: 85, security: 95, operational: true }
      );
    }

    return facilities;
  }

  private assignCellBlock(prison: Prison, inmateType: InmateType): string {
    if (inmateType === 'POW') return 'POW Block';
    if (inmateType === 'Military') return 'Military Block';
    return `Block ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`;
  }

  private calculateInitialPolicePerformance(): PolicePerformance {
    return {
      crimeReduction: 40 + Math.random() * 30,
      responseTime: 8 + Math.random() * 7,
      clearanceRate: 50 + Math.random() * 30,
      communityTrust: 60 + Math.random() * 25,
      officerSafety: 70 + Math.random() * 20,
      budgetEfficiency: 65 + Math.random() * 25
    };
  }

  private calculateInitialGuardPerformance(): GuardPerformance {
    return {
      readiness: 70 + Math.random() * 20,
      training: 75 + Math.random() * 15,
      equipment: 80 + Math.random() * 15,
      morale: 70 + Math.random() * 20,
      effectiveness: 75 + Math.random() * 15
    };
  }

  private calculateInitialPrisonPerformance(): PrisonPerformance {
    return {
      security: 75 + Math.random() * 15,
      rehabilitation: 50 + Math.random() * 20,
      recidivism: 25 + Math.random() * 15,
      safety: 70 + Math.random() * 20,
      overcrowding: Math.random() * 20,
      budgetEfficiency: 60 + Math.random() * 25
    };
  }

  // Federal Agency Management
  createFederalAgency(name: string, type: AgencyType, headquarters: string, budget: number): FederalAgency {
    const agency: FederalAgency = {
      id: `agency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      headquarters,
      budget,
      personnel: [],
      operations: [],
      jurisdiction: type === 'Border Agency' ? 'Federal' : 'National',
      securityClearance: type === 'Secret Police' || type === 'Intelligence Service' ? 'Top Secret' : 'Secret',
      performance: this.calculateInitialAgencyPerformance(),
      created: new Date(),
      updated: new Date()
    };

    this.federalAgencies.set(agency.id, agency);
    return agency;
  }

  recruitFederalAgent(agencyId: string, name: string, rank: FederalRank = 'Agent'): FederalAgent {
    const agency = this.federalAgencies.get(agencyId);
    if (!agency) throw new Error('Federal agency not found');

    const agent: FederalAgent = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      rank,
      specialization: [],
      securityClearance: agency.securityClearance,
      experience: rank === 'Agent' ? 0 : Math.random() * 15,
      performance: 70 + Math.random() * 25, // 70-95 initial
      cover: {
        identity: name,
        occupation: 'Government Employee',
        background: 'Standard Background',
        active: false,
        compromised: false
      },
      status: 'Active',
      assigned: 'General Operations',
      recruited: new Date()
    };

    agency.personnel.push(agent);
    agency.updated = new Date();
    
    return agent;
  }

  createIntelligenceOperation(
    agencyId: string, 
    codename: string, 
    type: IntelligenceType, 
    target: string, 
    objective: string, 
    budget: number
  ): IntelligenceOperation {
    const agency = this.federalAgencies.get(agencyId);
    if (!agency) throw new Error('Federal agency not found');

    const operation: IntelligenceOperation = {
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      codename,
      type,
      status: 'Planning',
      classification: 'Secret',
      target,
      objective,
      agents: [],
      startDate: new Date(),
      budget,
      success: false,
      intelligence: []
    };

    agency.operations.push(operation);
    agency.updated = new Date();
    
    return operation;
  }

  // Personal Security Management
  createPersonalSecurity(
    protectedPersonName: string, 
    title: string, 
    position: string, 
    threatLevel: ThreatLevel, 
    budget: number
  ): PersonalSecurity {
    const protectedPerson: ProtectedPerson = {
      id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: protectedPersonName,
      title,
      position,
      clearanceLevel: 'Top Secret',
      threatAssessment: {
        level: threatLevel,
        sources: this.generateThreatSources(threatLevel),
        vulnerabilities: this.generateVulnerabilities(position),
        mitigation: this.generateMitigationStrategies(threatLevel),
        lastUpdated: new Date()
      },
      securityRequirements: this.generateSecurityRequirements(position, threatLevel)
    };

    const personalSecurity: PersonalSecurity = {
      id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      protectedPerson,
      securityDetail: [],
      threatLevel,
      securityProtocols: this.generateSecurityProtocols(threatLevel),
      budget,
      equipment: this.generatePersonalSecurityEquipment(threatLevel),
      performance: this.calculateInitialPersonalSecurityPerformance(),
      created: new Date(),
      updated: new Date()
    };

    this.personalSecurity.set(personalSecurity.id, personalSecurity);
    return personalSecurity;
  }

  assignSecurityAgent(
    securityId: string, 
    name: string, 
    specializations: SecuritySpecialization[]
  ): SecurityAgent {
    const security = this.personalSecurity.get(securityId);
    if (!security) throw new Error('Personal security detail not found');

    const agent: SecurityAgent = {
      id: `secagent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      rank: 'Agent',
      specialization: specializations,
      experience: Math.random() * 10,
      performance: 75 + Math.random() * 20, // 75-95 initial
      clearance: 'Secret',
      status: 'Active',
      assigned: 'Personal Protection Detail',
      recruited: new Date()
    };

    security.securityDetail.push(agent);
    security.updated = new Date();
    this.updatePersonalSecurityPerformance(securityId);
    
    return agent;
  }

  // Event Management
  recordSecurityEvent(type: any, location: string, severity: any, description: string): SecurityEvent {
    const event: SecurityEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      location,
      severity,
      description,
      response: 'Under Investigation',
      resolved: false,
      timestamp: new Date()
    };

    this.securityEvents.push(event);
    return event;
  }

  // Analytics and Reporting
  generateSecurityAnalytics(): SecurityAnalyticsData {
    const policeForces = Array.from(this.policeForces.values());
    const nationalGuards = Array.from(this.nationalGuards.values());
    const prisons = Array.from(this.prisons.values());
    const federalAgencies = Array.from(this.federalAgencies.values());
    const personalSecurity = Array.from(this.personalSecurity.values());

    const totalBudget = [
      ...policeForces.map(f => f.budget),
      ...nationalGuards.map(g => g.budget),
      ...prisons.map(p => p.budget),
      ...federalAgencies.map(a => a.budget),
      ...personalSecurity.map(s => s.budget)
    ].reduce((sum, budget) => sum + budget, 0);

    const totalPersonnel = [
      ...policeForces.map(f => f.officers.length),
      ...nationalGuards.map(g => g.personnel.length),
      ...prisons.map(p => p.staff.length),
      ...federalAgencies.map(a => a.personnel.length),
      ...personalSecurity.map(s => s.securityDetail.length)
    ].reduce((sum, count) => sum + count, 0);

    const avgPolicePerformance = policeForces.length > 0 
      ? policeForces.reduce((sum, f) => sum + f.performance.crimeReduction, 0) / policeForces.length 
      : 0;

    const avgGuardReadiness = nationalGuards.length > 0 
      ? nationalGuards.reduce((sum, g) => sum + g.readiness, 0) / nationalGuards.length 
      : 0;

    const avgPrisonSecurity = prisons.length > 0 
      ? prisons.reduce((sum, p) => sum + p.performance.security, 0) / prisons.length 
      : 0;

    const overallSecurity = (avgPolicePerformance + avgGuardReadiness + avgPrisonSecurity) / 3;

    return {
      policeForces,
      nationalGuard: nationalGuards,
      prisons,
      federalAgencies,
      personalSecurity,
      totalBudget,
      totalPersonnel,
      overallSecurity,
      crimeRate: Math.max(0, 1000 - avgPolicePerformance * 10),
      publicSafety: overallSecurity,
      systemEfficiency: totalBudget > 0 ? (overallSecurity / (totalBudget / 1000000)) * 10 : 0,
      recommendations: this.generateRecommendations(policeForces, nationalGuards, prisons, federalAgencies, personalSecurity)
    };
  }

  private generateRecommendations(policeForces: PoliceForce[], nationalGuards: NationalGuard[], prisons: Prison[]): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];

    // Police recommendations
    policeForces.forEach(force => {
      if (force.performance.crimeReduction < 50) {
        recommendations.push({
          type: 'Personnel Training',
          priority: 'High',
          description: `${force.name} needs improved training programs`,
          impact: 'Increase crime reduction effectiveness',
          cost: 100000,
          timeframe: '6 months'
        });
      }
      if (force.corruption > 30) {
        recommendations.push({
          type: 'Policy Change',
          priority: 'Critical',
          description: `${force.name} requires anti-corruption measures`,
          impact: 'Reduce corruption and improve public trust',
          cost: 50000,
          timeframe: '3 months'
        });
      }
    });

    // Guard recommendations
    nationalGuards.forEach(guard => {
      if (guard.readiness < 70) {
        recommendations.push({
          type: 'Equipment Upgrade',
          priority: 'Medium',
          description: `${guard.name} needs equipment modernization`,
          impact: 'Improve operational readiness',
          cost: 500000,
          timeframe: '12 months'
        });
      }
    });

    // Prison recommendations
    prisons.forEach(prison => {
      if (prison.performance.overcrowding > 20) {
        recommendations.push({
          type: 'Facility Improvement',
          priority: 'High',
          description: `${prison.name} requires capacity expansion`,
          impact: 'Reduce overcrowding and improve conditions',
          cost: 2000000,
          timeframe: '18 months'
        });
      }
      if (prison.performance.rehabilitation < 40) {
        recommendations.push({
          type: 'Program Expansion',
          priority: 'Medium',
          description: `${prison.name} needs more rehabilitation programs`,
          impact: 'Reduce recidivism rates',
          cost: 200000,
          timeframe: '9 months'
        });
      }
    });

    return recommendations;
  }

  // Getters
  getAllPoliceForces(): PoliceForce[] {
    return Array.from(this.policeForces.values());
  }

  getAllNationalGuards(): NationalGuard[] {
    return Array.from(this.nationalGuards.values());
  }

  getAllPrisons(): Prison[] {
    return Array.from(this.prisons.values());
  }

  getPoliceForce(id: string): PoliceForce | undefined {
    return this.policeForces.get(id);
  }

  getNationalGuard(id: string): NationalGuard | undefined {
    return this.nationalGuards.get(id);
  }

  getPrison(id: string): Prison | undefined {
    return this.prisons.get(id);
  }

  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  getRecentEvents(limit: number = 10): SecurityEvent[] {
    return this.securityEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getAllFederalAgencies(): FederalAgency[] {
    return Array.from(this.federalAgencies.values());
  }

  getAllPersonalSecurity(): PersonalSecurity[] {
    return Array.from(this.personalSecurity.values());
  }

  getFederalAgency(id: string): FederalAgency | undefined {
    return this.federalAgencies.get(id);
  }

  getPersonalSecurity(id: string): PersonalSecurity | undefined {
    return this.personalSecurity.get(id);
  }

  // Additional helper methods for new functionality
  private calculateInitialPolicePerformance(type: PoliceType): PolicePerformance {
    const base = {
      crimeReduction: 40 + Math.random() * 30,
      responseTime: 8 + Math.random() * 7,
      clearanceRate: 50 + Math.random() * 30,
      communityTrust: 60 + Math.random() * 25,
      officerSafety: 70 + Math.random() * 20,
      budgetEfficiency: 65 + Math.random() * 25
    };

    if (type === 'Federal' || type === 'Secret Police' || type === 'Intelligence') {
      return {
        ...base,
        intelligenceGathering: 60 + Math.random() * 30,
        covertOperations: type === 'Secret Police' ? 70 + Math.random() * 25 : 40 + Math.random() * 30,
        surveillanceEffectiveness: 65 + Math.random() * 25
      };
    }

    return base;
  }

  private calculateInitialAgencyPerformance(): any {
    return {
      intelligenceGathering: 70 + Math.random() * 20,
      operationalSuccess: 65 + Math.random() * 25,
      securityMaintenance: 75 + Math.random() * 15,
      threatPrevention: 70 + Math.random() * 20,
      publicSafety: 60 + Math.random() * 30,
      budgetEfficiency: 70 + Math.random() * 20
    };
  }

  private calculateInitialPersonalSecurityPerformance(): any {
    return {
      threatPrevention: 80 + Math.random() * 15,
      responseTime: 2 + Math.random() * 3, // seconds
      protocolCompliance: 85 + Math.random() * 10,
      situationalAwareness: 80 + Math.random() * 15,
      coordination: 75 + Math.random() * 20,
      discretion: 70 + Math.random() * 25
    };
  }

  private updatePersonalSecurityPerformance(securityId: string): void {
    const security = this.personalSecurity.get(securityId);
    if (!security) return;

    const avgPerformance = security.securityDetail.reduce((sum, agent) => sum + agent.performance, 0) / security.securityDetail.length || 0;
    const avgExperience = security.securityDetail.reduce((sum, agent) => sum + agent.experience, 0) / security.securityDetail.length || 0;
    
    security.performance = {
      threatPrevention: Math.max(60, avgPerformance + avgExperience * 2),
      responseTime: Math.max(1, 5 - avgExperience / 2),
      protocolCompliance: Math.max(70, avgPerformance + Math.random() * 10),
      situationalAwareness: Math.max(60, avgPerformance + avgExperience),
      coordination: Math.max(50, avgPerformance - security.securityDetail.length * 2 + 10),
      discretion: Math.max(60, avgPerformance + Math.random() * 15)
    };
  }

  private generateInitialEquipment(type: 'police' | 'military' | 'federal'): Equipment[] {
    const equipment: Equipment[] = [];
    
    if (type === 'police') {
      equipment.push(
        { id: 'eq1', name: 'Patrol Cars', type: 'Vehicles', quantity: 10, condition: 85, cost: 300000, maintenanceCost: 5000, acquired: new Date() },
        { id: 'eq2', name: 'Radios', type: 'Communications', quantity: 50, condition: 90, cost: 25000, maintenanceCost: 500, acquired: new Date() },
        { id: 'eq3', name: 'Body Armor', type: 'Protective Gear', quantity: 50, condition: 95, cost: 75000, maintenanceCost: 1000, acquired: new Date() }
      );
    } else if (type === 'federal') {
      equipment.push(
        { id: 'eq1', name: 'Unmarked Vehicles', type: 'Vehicles', quantity: 15, condition: 90, cost: 450000, maintenanceCost: 7500, acquired: new Date() },
        { id: 'eq2', name: 'Encrypted Communications', type: 'Communications', quantity: 75, condition: 95, cost: 150000, maintenanceCost: 3000, acquired: new Date() },
        { id: 'eq3', name: 'Surveillance Equipment', type: 'Surveillance', quantity: 30, condition: 92, cost: 200000, maintenanceCost: 4000, acquired: new Date() },
        { id: 'eq4', name: 'Covert Gear', type: 'Protective Gear', quantity: 25, condition: 88, cost: 125000, maintenanceCost: 2500, acquired: new Date() }
      );
    } else {
      equipment.push(
        { id: 'eq1', name: 'Military Vehicles', type: 'Vehicles', quantity: 5, condition: 80, cost: 500000, maintenanceCost: 10000, acquired: new Date() },
        { id: 'eq2', name: 'Communications Gear', type: 'Communications', quantity: 100, condition: 85, cost: 100000, maintenanceCost: 2000, acquired: new Date() },
        { id: 'eq3', name: 'Combat Equipment', type: 'Weapons', quantity: 100, condition: 90, cost: 200000, maintenanceCost: 5000, acquired: new Date() }
      );
    }
    
    return equipment;
  }

  private generateThreatSources(threatLevel: ThreatLevel): ThreatSource[] {
    const sources: ThreatSource[] = [];
    
    switch (threatLevel) {
      case 'Extreme':
      case 'Critical':
        sources.push('Terrorist Groups', 'Foreign Agents', 'Political Opposition', 'Criminal Organizations');
        break;
      case 'High':
        sources.push('Political Opposition', 'Domestic Extremists', 'Criminal Organizations');
        break;
      case 'Moderate':
        sources.push('Political Opposition', 'Lone Wolf');
        break;
      default:
        sources.push('Lone Wolf');
    }
    
    return sources;
  }

  private generateVulnerabilities(position: string): string[] {
    const vulnerabilities = [
      'Public appearances',
      'Routine travel patterns',
      'Residence security',
      'Communication intercepts'
    ];
    
    if (position.includes('President') || position.includes('Prime Minister')) {
      vulnerabilities.push('International travel', 'State functions', 'Media exposure');
    }
    
    return vulnerabilities;
  }

  private generateMitigationStrategies(threatLevel: ThreatLevel): string[] {
    const strategies = [
      'Advance security sweeps',
      'Route diversification',
      'Counter-surveillance measures',
      'Secure communications'
    ];
    
    if (threatLevel === 'Critical' || threatLevel === 'Extreme') {
      strategies.push('Decoy operations', 'Intelligence coordination', 'Emergency protocols');
    }
    
    return strategies;
  }

  private generateSecurityRequirements(position: string, threatLevel: ThreatLevel): any[] {
    const requirements = [
      { type: 'Physical Protection', level: 'Enhanced', description: '24/7 close protection detail', mandatory: true },
      { type: 'Advance Security', level: 'Enhanced', description: 'Pre-event security assessments', mandatory: true },
      { type: 'Transportation Security', level: 'Maximum', description: 'Armored vehicle convoy', mandatory: true }
    ];
    
    if (threatLevel === 'Critical' || threatLevel === 'Extreme') {
      requirements.push(
        { type: 'Counter Intelligence', level: 'Maximum', description: 'Active threat monitoring', mandatory: true },
        { type: 'Medical Support', level: 'Enhanced', description: 'Medical team on standby', mandatory: true }
      );
    }
    
    return requirements;
  }

  private generateSecurityProtocols(threatLevel: ThreatLevel): SecurityProtocol[] {
    const protocols: SecurityProtocol[] = [
      {
        id: 'prot1',
        name: 'Standard Movement Protocol',
        type: 'Movement Security',
        description: 'Standard procedures for protected person movement',
        procedures: ['Route planning', 'Advance team deployment', 'Perimeter security'],
        triggerConditions: ['Scheduled movement'],
        active: true,
        classification: 'Confidential'
      }
    ];
    
    if (threatLevel === 'Critical' || threatLevel === 'Extreme') {
      protocols.push({
        id: 'prot2',
        name: 'Emergency Evacuation Protocol',
        type: 'Emergency Evacuation',
        description: 'Rapid evacuation procedures for high-threat situations',
        procedures: ['Immediate extraction', 'Safe house relocation', 'Communication lockdown'],
        triggerConditions: ['Imminent threat', 'Security breach'],
        active: true,
        classification: 'Secret'
      });
    }
    
    return protocols;
  }

  private generatePersonalSecurityEquipment(threatLevel: ThreatLevel): any[] {
    const equipment = [
      { id: 'pse1', name: 'Armored Limousine', type: 'Armored Vehicles', quantity: 2, condition: 95, classification: 'Secret', assigned: 'Primary Detail' },
      { id: 'pse2', name: 'Secure Communications', type: 'Communications', quantity: 10, condition: 90, classification: 'Secret', assigned: 'All Agents' },
      { id: 'pse3', name: 'Body Armor', type: 'Protective Gear', quantity: 15, condition: 92, classification: 'Confidential', assigned: 'Security Detail' }
    ];
    
    if (threatLevel === 'Critical' || threatLevel === 'Extreme') {
      equipment.push(
        { id: 'pse4', name: 'Counter-Surveillance Suite', type: 'Counter Surveillance', quantity: 5, condition: 88, classification: 'Secret', assigned: 'Advance Team' },
        { id: 'pse5', name: 'Medical Kit', type: 'Medical Equipment', quantity: 3, condition: 95, classification: 'Confidential', assigned: 'Medical Support' }
      );
    }
    
    return equipment;
  }

  private generateRecommendations(
    policeForces: PoliceForce[], 
    nationalGuards: NationalGuard[], 
    prisons: Prison[],
    federalAgencies: FederalAgency[],
    personalSecurity: PersonalSecurity[]
  ): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];

    // Police recommendations
    policeForces.forEach(force => {
      if (force.performance.crimeReduction < 50) {
        recommendations.push({
          type: 'Personnel Training',
          priority: 'High',
          description: `${force.name} needs improved training programs`,
          impact: 'Increase crime reduction effectiveness',
          cost: 100000,
          timeframe: '6 months'
        });
      }
      if (force.corruption > 30) {
        recommendations.push({
          type: 'Policy Change',
          priority: 'Critical',
          description: `${force.name} requires anti-corruption measures`,
          impact: 'Reduce corruption and improve public trust',
          cost: 50000,
          timeframe: '3 months'
        });
      }
    });

    // Federal agency recommendations
    federalAgencies.forEach(agency => {
      if (agency.performance.intelligenceGathering < 60) {
        recommendations.push({
          type: 'Equipment Upgrade',
          priority: 'High',
          description: `${agency.name} needs enhanced intelligence capabilities`,
          impact: 'Improve intelligence gathering effectiveness',
          cost: 750000,
          timeframe: '9 months'
        });
      }
    });

    // Personal security recommendations
    personalSecurity.forEach(security => {
      if (security.threatLevel === 'Critical' || security.threatLevel === 'Extreme') {
        if (security.securityDetail.length < 10) {
          recommendations.push({
            type: 'Personnel Training',
            priority: 'Critical',
            description: `${security.protectedPerson.name} needs expanded security detail`,
            impact: 'Enhanced personal protection',
            cost: 500000,
            timeframe: '3 months'
          });
        }
      }
    });

    return recommendations;
  }
}
