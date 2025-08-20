/**
 * Security & Defense Systems Types
 * Defines data structures for police, national guard, and prison systems
 */

export interface PoliceForce {
  id: string;
  cityId?: string; // Optional for federal/secret police
  name: string;
  type: PoliceType;
  officers: Officer[];
  budget: number;
  equipment: Equipment[];
  performance: PolicePerformance;
  communityRelations: number; // 0-100 scale
  corruption: number; // 0-100 scale
  specialUnits: SpecialUnit[];
  jurisdiction: Jurisdiction;
  securityClearance: SecurityClearance;
  created: Date;
  updated: Date;
}

export type PoliceType = 
  | 'Local' 
  | 'State' 
  | 'Federal' 
  | 'Secret Police' 
  | 'Intelligence';

export type Jurisdiction = 
  | 'City' 
  | 'County' 
  | 'State' 
  | 'Federal' 
  | 'National' 
  | 'International';

export interface Officer {
  id: string;
  name: string;
  rank: OfficerRank;
  experience: number; // years
  performance: number; // 0-100 scale
  corruption: number; // 0-100 scale
  specializations: string[];
  status: OfficerStatus;
  assigned: string; // unit or patrol area
  hired: Date;
}

export type OfficerRank = 
  | 'Recruit' 
  | 'Officer' 
  | 'Corporal' 
  | 'Sergeant' 
  | 'Lieutenant' 
  | 'Captain' 
  | 'Major' 
  | 'Chief';

export type OfficerStatus = 
  | 'Active' 
  | 'Suspended' 
  | 'Investigation' 
  | 'Leave' 
  | 'Retired' 
  | 'Terminated';

export interface SpecialUnit {
  id: string;
  name: string;
  type: SpecialUnitType;
  officers: string[]; // officer IDs
  equipment: Equipment[];
  budget: number;
  performance: number; // 0-100 scale
  active: boolean;
}

export type SpecialUnitType = 
  | 'SWAT' 
  | 'Detective' 
  | 'Traffic' 
  | 'Narcotics' 
  | 'Cybercrime' 
  | 'Internal Affairs' 
  | 'Community Policing'
  | 'Counter Intelligence'
  | 'Counter Terrorism'
  | 'Organized Crime'
  | 'Financial Crimes'
  | 'Border Security'
  | 'Surveillance'
  | 'Covert Operations';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  quantity: number;
  condition: number; // 0-100 scale
  cost: number;
  maintenanceCost: number;
  acquired: Date;
}

export type EquipmentType = 
  | 'Weapons' 
  | 'Vehicles' 
  | 'Communications' 
  | 'Protective Gear' 
  | 'Surveillance' 
  | 'Forensics';

export interface PolicePerformance {
  crimeReduction: number; // percentage
  responseTime: number; // minutes
  clearanceRate: number; // percentage of solved cases
  communityTrust: number; // 0-100 scale
  officerSafety: number; // 0-100 scale
  budgetEfficiency: number; // 0-100 scale
  intelligenceGathering?: number; // 0-100 scale (for intelligence agencies)
  covertOperations?: number; // 0-100 scale (for secret police)
  surveillanceEffectiveness?: number; // 0-100 scale (for surveillance units)
}

export interface NationalGuard {
  id: string;
  name: string;
  personnel: GuardMember[];
  budget: number;
  equipment: Equipment[];
  readiness: number; // 0-100 scale
  deployments: Deployment[];
  bases: MilitaryBase[];
  performance: GuardPerformance;
  created: Date;
  updated: Date;
}

export interface GuardMember {
  id: string;
  name: string;
  rank: MilitaryRank;
  experience: number; // years
  specializations: string[];
  status: GuardStatus;
  unit: string;
  security_clearance: SecurityClearance;
  enlisted: Date;
}

export type MilitaryRank = 
  | 'Private' 
  | 'Corporal' 
  | 'Sergeant' 
  | 'Staff Sergeant' 
  | 'Lieutenant' 
  | 'Captain' 
  | 'Major' 
  | 'Colonel' 
  | 'General';

export type GuardStatus = 
  | 'Active' 
  | 'Reserve' 
  | 'Deployed' 
  | 'Training' 
  | 'Medical Leave' 
  | 'Discharged';

export type SecurityClearance = 
  | 'None' 
  | 'Confidential' 
  | 'Secret' 
  | 'Top Secret';

export interface Deployment {
  id: string;
  mission: string;
  location: string;
  personnel: string[]; // guard member IDs
  startDate: Date;
  endDate?: Date;
  status: DeploymentStatus;
  objective: string;
  success: boolean;
}

export type DeploymentStatus = 
  | 'Planning' 
  | 'Active' 
  | 'Completed' 
  | 'Failed' 
  | 'Cancelled';

export interface MilitaryBase {
  id: string;
  name: string;
  location: string;
  capacity: number;
  personnel: number;
  facilities: Facility[];
  security: number; // 0-100 scale
  operational: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity: number;
  condition: number; // 0-100 scale
  operational: boolean;
}

export type FacilityType = 
  | 'Barracks' 
  | 'Training' 
  | 'Medical' 
  | 'Command' 
  | 'Storage' 
  | 'Communications';

export interface GuardPerformance {
  readiness: number; // 0-100 scale
  training: number; // 0-100 scale
  equipment: number; // 0-100 scale
  morale: number; // 0-100 scale
  effectiveness: number; // 0-100 scale
}

export interface Prison {
  id: string;
  name: string;
  type: PrisonType;
  capacity: number;
  population: number;
  inmates: Inmate[];
  staff: PrisonStaff[];
  security: SecurityLevel;
  budget: number;
  facilities: PrisonFacility[];
  programs: RehabProgram[];
  performance: PrisonPerformance;
  created: Date;
  updated: Date;
}

export type PrisonType = 
  | 'Civilian' 
  | 'Military' 
  | 'POW' 
  | 'Juvenile' 
  | 'Maximum Security' 
  | 'Medium Security' 
  | 'Minimum Security';

export type SecurityLevel = 
  | 'Minimum' 
  | 'Medium' 
  | 'Maximum' 
  | 'Supermax';

export interface Inmate {
  id: string;
  name: string;
  type: InmateType;
  crime: string;
  sentence: number; // months
  served: number; // months
  behavior: number; // 0-100 scale
  rehabilitation: number; // 0-100 scale
  status: InmateStatus;
  cellBlock: string;
  programs: string[]; // program IDs
  admitted: Date;
  release?: Date;
}

export type InmateType = 
  | 'Civilian' 
  | 'Military' 
  | 'POW' 
  | 'Political';

export type InmateStatus = 
  | 'Incarcerated' 
  | 'Parole' 
  | 'Released' 
  | 'Transferred' 
  | 'Deceased' 
  | 'Escaped';

export interface PrisonStaff {
  id: string;
  name: string;
  role: StaffRole;
  experience: number; // years
  performance: number; // 0-100 scale
  corruption: number; // 0-100 scale
  assigned: string; // facility or unit
  hired: Date;
}

export type StaffRole = 
  | 'Warden' 
  | 'Guard' 
  | 'Counselor' 
  | 'Medical' 
  | 'Education' 
  | 'Maintenance' 
  | 'Administration';

export interface PrisonFacility {
  id: string;
  name: string;
  type: PrisonFacilityType;
  capacity: number;
  condition: number; // 0-100 scale
  security: number; // 0-100 scale
  operational: boolean;
}

export type PrisonFacilityType = 
  | 'Cell Block' 
  | 'Cafeteria' 
  | 'Medical' 
  | 'Education' 
  | 'Recreation' 
  | 'Workshop' 
  | 'Visitation' 
  | 'Administration';

export interface RehabProgram {
  id: string;
  name: string;
  type: ProgramType;
  participants: string[]; // inmate IDs
  staff: string[]; // staff IDs
  budget: number;
  effectiveness: number; // 0-100 scale
  active: boolean;
}

export type ProgramType = 
  | 'Education' 
  | 'Vocational' 
  | 'Substance Abuse' 
  | 'Mental Health' 
  | 'Anger Management' 
  | 'Job Training';

export interface PrisonPerformance {
  security: number; // 0-100 scale
  rehabilitation: number; // 0-100 scale
  recidivism: number; // percentage
  safety: number; // 0-100 scale
  overcrowding: number; // percentage over capacity
  budgetEfficiency: number; // 0-100 scale
}

export interface PersonalSecurity {
  id: string;
  protectedPerson: ProtectedPerson;
  securityDetail: SecurityAgent[];
  threatLevel: ThreatLevel;
  securityProtocols: SecurityProtocol[];
  budget: number;
  equipment: SecurityEquipment[];
  performance: PersonalSecurityPerformance;
  created: Date;
  updated: Date;
}

export interface ProtectedPerson {
  id: string;
  name: string;
  title: string;
  position: string;
  clearanceLevel: SecurityClearance;
  threatAssessment: ThreatAssessment;
  securityRequirements: SecurityRequirement[];
}

export interface SecurityAgent {
  id: string;
  name: string;
  rank: SecurityRank;
  specialization: SecuritySpecialization[];
  experience: number; // years
  performance: number; // 0-100 scale
  clearance: SecurityClearance;
  status: AgentStatus;
  assigned: string; // detail or shift
  recruited: Date;
}

export type SecurityRank = 
  | 'Agent' 
  | 'Senior Agent' 
  | 'Team Leader' 
  | 'Detail Commander' 
  | 'Security Chief';

export type SecuritySpecialization = 
  | 'Close Protection' 
  | 'Advance Security' 
  | 'Counter Surveillance' 
  | 'Threat Assessment' 
  | 'Emergency Response' 
  | 'Cyber Security' 
  | 'Medical Support' 
  | 'Transportation Security';

export type ThreatLevel = 
  | 'Minimal' 
  | 'Low' 
  | 'Moderate' 
  | 'High' 
  | 'Critical' 
  | 'Extreme';

export interface SecurityProtocol {
  id: string;
  name: string;
  type: ProtocolType;
  description: string;
  procedures: string[];
  triggerConditions: string[];
  active: boolean;
  classification: ClassificationLevel;
}

export type ProtocolType = 
  | 'Movement Security' 
  | 'Residence Security' 
  | 'Event Security' 
  | 'Emergency Evacuation' 
  | 'Threat Response' 
  | 'Communication Security' 
  | 'Counter Surveillance';

export interface SecurityEquipment {
  id: string;
  name: string;
  type: SecurityEquipmentType;
  quantity: number;
  condition: number; // 0-100 scale
  classification: ClassificationLevel;
  assigned: string; // agent or detail
}

export type SecurityEquipmentType = 
  | 'Armored Vehicles' 
  | 'Communications' 
  | 'Surveillance Detection' 
  | 'Protective Gear' 
  | 'Medical Equipment' 
  | 'Counter Surveillance' 
  | 'Emergency Response';

export interface SecurityRequirement {
  type: RequirementType;
  level: 'Basic' | 'Enhanced' | 'Maximum';
  description: string;
  mandatory: boolean;
}

export type RequirementType = 
  | 'Physical Protection' 
  | 'Advance Security' 
  | 'Residence Security' 
  | 'Transportation Security' 
  | 'Communication Security' 
  | 'Medical Support' 
  | 'Counter Intelligence';

export interface PersonalSecurityPerformance {
  threatPrevention: number; // 0-100 scale
  responseTime: number; // seconds
  protocolCompliance: number; // 0-100 scale
  situationalAwareness: number; // 0-100 scale
  coordination: number; // 0-100 scale
  discretion: number; // 0-100 scale
}

export interface ThreatAssessment {
  level: ThreatLevel;
  sources: ThreatSource[];
  vulnerabilities: string[];
  mitigation: string[];
  lastUpdated: Date;
}

export type ThreatSource = 
  | 'Political Opposition' 
  | 'Terrorist Groups' 
  | 'Foreign Agents' 
  | 'Criminal Organizations' 
  | 'Domestic Extremists' 
  | 'Lone Wolf' 
  | 'Cyber Threats';

export interface SecurityAnalyticsData {
  policeForces: PoliceForce[];
  nationalGuard: NationalGuard[];
  prisons: Prison[];
  federalAgencies: FederalAgency[];
  personalSecurity: PersonalSecurity[];
  totalBudget: number;
  totalPersonnel: number;
  overallSecurity: number; // 0-100 scale
  crimeRate: number; // per 100,000 population
  publicSafety: number; // 0-100 scale
  systemEfficiency: number; // 0-100 scale
  recommendations: SecurityRecommendation[];
}

export interface SecurityRecommendation {
  type: RecommendationType;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  impact: string;
  cost: number;
  timeframe: string;
}

export type RecommendationType = 
  | 'Budget Increase' 
  | 'Personnel Training' 
  | 'Equipment Upgrade' 
  | 'Policy Change' 
  | 'Facility Improvement' 
  | 'Program Expansion';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  response: string;
  resolved: boolean;
  timestamp: Date;
}

export interface IntelligenceOperation {
  id: string;
  codename: string;
  type: IntelligenceType;
  status: OperationStatus;
  classification: ClassificationLevel;
  target: string;
  objective: string;
  agents: string[]; // officer IDs
  startDate: Date;
  endDate?: Date;
  budget: number;
  success: boolean;
  intelligence: IntelligenceReport[];
}

export type IntelligenceType = 
  | 'Surveillance' 
  | 'Infiltration' 
  | 'Counter Intelligence' 
  | 'Cyber Operations' 
  | 'Economic Espionage' 
  | 'Political Monitoring' 
  | 'Terrorism Prevention';

export type OperationStatus = 
  | 'Planning' 
  | 'Active' 
  | 'Suspended' 
  | 'Completed' 
  | 'Compromised' 
  | 'Cancelled';

export type ClassificationLevel = 
  | 'Unclassified' 
  | 'Restricted' 
  | 'Confidential' 
  | 'Secret' 
  | 'Top Secret' 
  | 'Ultra Secret';

export interface IntelligenceReport {
  id: string;
  operationId: string;
  classification: ClassificationLevel;
  summary: string;
  details: string;
  reliability: number; // 0-100 scale
  actionable: boolean;
  timestamp: Date;
}

export interface FederalAgency {
  id: string;
  name: string;
  type: AgencyType;
  headquarters: string;
  budget: number;
  personnel: FederalAgent[];
  operations: IntelligenceOperation[];
  jurisdiction: Jurisdiction;
  securityClearance: SecurityClearance;
  performance: AgencyPerformance;
  created: Date;
  updated: Date;
}

export type AgencyType = 
  | 'Federal Bureau' 
  | 'Intelligence Service' 
  | 'Secret Police' 
  | 'Border Agency' 
  | 'Financial Crimes' 
  | 'Counter Terrorism' 
  | 'Cyber Security';

export interface FederalAgent {
  id: string;
  name: string;
  rank: FederalRank;
  specialization: string[];
  securityClearance: SecurityClearance;
  experience: number; // years
  performance: number; // 0-100 scale
  cover: AgentCover;
  status: AgentStatus;
  assigned: string; // operation or department
  recruited: Date;
}

export type FederalRank = 
  | 'Agent' 
  | 'Senior Agent' 
  | 'Supervisory Agent' 
  | 'Assistant Director' 
  | 'Deputy Director' 
  | 'Director';

export interface AgentCover {
  identity: string;
  occupation: string;
  background: string;
  active: boolean;
  compromised: boolean;
}

export type AgentStatus = 
  | 'Active' 
  | 'Undercover' 
  | 'Deep Cover' 
  | 'Suspended' 
  | 'Retired' 
  | 'Compromised' 
  | 'Missing' 
  | 'Deceased';

export interface AgencyPerformance {
  intelligenceGathering: number; // 0-100 scale
  operationalSuccess: number; // 0-100 scale
  securityMaintenance: number; // 0-100 scale
  threatPrevention: number; // 0-100 scale
  publicSafety: number; // 0-100 scale
  budgetEfficiency: number; // 0-100 scale
}

export interface SurveillanceNetwork {
  id: string;
  name: string;
  type: SurveillanceType;
  coverage: string[]; // areas or targets
  equipment: SurveillanceEquipment[];
  operators: string[]; // agent IDs
  dataCollection: SurveillanceData[];
  active: boolean;
  classification: ClassificationLevel;
}

export type SurveillanceType = 
  | 'Physical Surveillance' 
  | 'Electronic Surveillance' 
  | 'Cyber Surveillance' 
  | 'Communications Intercept' 
  | 'Financial Monitoring' 
  | 'Social Media Monitoring';

export interface SurveillanceEquipment {
  id: string;
  name: string;
  type: string;
  capability: string;
  range: string;
  status: 'Operational' | 'Maintenance' | 'Compromised';
}

export interface SurveillanceData {
  id: string;
  networkId: string;
  target: string;
  type: string;
  content: string;
  classification: ClassificationLevel;
  timestamp: Date;
  analyzed: boolean;
}

export type SecurityEventType = 
  | 'Crime' 
  | 'Riot' 
  | 'Escape' 
  | 'Corruption' 
  | 'Emergency' 
  | 'Deployment' 
  | 'Investigation'
  | 'Intelligence Operation'
  | 'Counter Intelligence'
  | 'Surveillance'
  | 'Covert Action'
  | 'Security Breach';
