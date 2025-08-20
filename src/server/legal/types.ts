/**
 * Legal & Justice Systems - Core Types
 * 
 * Defines comprehensive legal framework including court systems, crime modeling,
 * corruption tracking, law enforcement, and justice processes. Integrates with
 * governance and psychology systems for realistic legal behavior.
 */

export interface LegalCase {
  id: string;
  caseNumber: string;
  courtId: string;
  
  // Case Details
  title: string;
  type: 'criminal' | 'civil' | 'constitutional' | 'administrative' | 'military';
  category: string; // e.g., 'theft', 'contract_dispute', 'constitutional_review'
  severity: 'minor' | 'moderate' | 'serious' | 'severe' | 'capital';
  
  // Parties Involved
  plaintiff: {
    id: string;
    name: string;
    type: 'individual' | 'corporation' | 'government' | 'organization';
    representation: string; // lawyer/attorney ID
  };
  
  defendant: {
    id: string;
    name: string;
    type: 'individual' | 'corporation' | 'government' | 'organization';
    representation: string;
    custody: boolean; // if in custody
  };
  
  // Legal Proceedings
  filingDate: Date;
  hearingDates: Date[];
  trialDate?: Date;
  verdict?: {
    decision: 'guilty' | 'not_guilty' | 'liable' | 'not_liable' | 'dismissed' | 'settled';
    reasoning: string;
    unanimity: boolean;
    dissent?: string;
  };
  
  // Sentencing (if applicable)
  sentence?: {
    type: 'imprisonment' | 'fine' | 'community_service' | 'probation' | 'death' | 'damages';
    duration?: number; // in days for imprisonment/probation
    amount?: number; // for fines/damages
    conditions: string[];
    appealable: boolean;
  };
  
  // Case Status
  status: 'filed' | 'discovery' | 'trial' | 'deliberation' | 'verdict' | 'sentencing' | 'appeal' | 'closed';
  priority: number; // 1-10
  publicInterest: number; // 0-100
  mediaAttention: number; // 0-100
  
  // Evidence and Documentation
  evidence: {
    id: string;
    type: 'physical' | 'documentary' | 'testimonial' | 'digital' | 'forensic';
    description: string;
    reliability: number; // 0-100
    admissible: boolean;
  }[];
  
  witnesses: {
    id: string;
    name: string;
    type: 'fact' | 'expert' | 'character';
    credibility: number; // 0-100
    testimony: string;
  }[];
  
  // Legal Precedents
  precedents: {
    caseId: string;
    relevance: number; // 0-100
    jurisdiction: string;
    outcome: string;
  }[];
  
  // Metadata
  assignedJudge: string;
  assignedProsecutor?: string; // for criminal cases
  estimatedDuration: number; // in days
  actualDuration?: number;
  cost: number; // court costs
  complexity: number; // 1-10
}

export interface Court {
  id: string;
  name: string;
  level: 'local' | 'district' | 'appellate' | 'supreme' | 'specialized';
  jurisdiction: string[];
  
  // Court Structure
  judges: {
    id: string;
    name: string;
    title: string;
    appointmentDate: Date;
    termEnd?: Date; // null for life tenure
    experience: number; // years
    specialization: string[];
    philosophy: string;
    approval: number; // 0-100
  }[];
  
  // Court Operations
  caseload: {
    pending: number;
    inProgress: number;
    completed: number;
    backlog: number;
  };
  
  caseTypes: {
    type: string;
    percentage: number;
    averageDuration: number;
  }[];
  
  // Performance Metrics
  performance: {
    averageCaseTime: number; // days
    clearanceRate: number; // cases resolved / cases filed
    reverseRate: number; // percentage of cases overturned on appeal
    efficiency: number; // 0-100
    publicConfidence: number; // 0-100
  };
  
  // Resources
  budget: number;
  staffing: {
    judges: number;
    clerks: number;
    bailiffs: number;
    administrators: number;
  };
  
  facilities: {
    courtrooms: number;
    capacity: number;
    technology: string[];
    accessibility: boolean;
  };
  
  // Metadata
  established: Date;
  lastReform?: Date;
  status: 'operational' | 'suspended' | 'reformed' | 'abolished';
}

export interface Crime {
  id: string;
  type: 'violent' | 'property' | 'white_collar' | 'cyber' | 'drug' | 'public_order' | 'corruption';
  category: string; // specific crime type
  severity: 'misdemeanor' | 'felony' | 'capital';
  
  // Crime Details
  location: string;
  dateTime: Date;
  description: string;
  
  // Perpetrator Information
  perpetrator: {
    id?: string; // citizen ID if known
    psychologyId?: string; // psychology profile if available
    demographics?: {
      age?: number;
      gender?: string;
      education?: string;
      income?: number;
      employment?: string;
    };
    criminalHistory?: {
      priorOffenses: number;
      lastOffense?: Date;
      riskLevel: 'low' | 'medium' | 'high';
    };
    motives: string[];
    mentalState: string;
  };
  
  // Victim Information
  victims: {
    id?: string; // citizen ID if applicable
    type: 'individual' | 'business' | 'government' | 'organization';
    impact: {
      physical: number; // 0-100
      financial: number; // actual amount
      psychological: number; // 0-100
      social: number; // 0-100
    };
  }[];
  
  // Investigation
  investigation: {
    status: 'reported' | 'investigating' | 'solved' | 'cold' | 'closed';
    leadInvestigator: string;
    evidenceCollected: string[];
    witnessesInterviewed: number;
    suspectsIdentified: number;
    clearanceTime?: number; // days to solve
    solvability: number; // 0-100 probability of solving
  };
  
  // Legal Proceedings
  charges?: {
    charge: string;
    statute: string;
    penalty: string;
    evidenceStrength: number; // 0-100
  }[];
  
  caseId?: string; // linked legal case
  
  // Social Impact
  communityImpact: {
    fearLevel: number; // 0-100
    trustInPolice: number; // 0-100
    mediaAttention: number; // 0-100
    politicalResponse: string[];
  };
  
  // Prevention and Response
  preventionFactors: {
    factor: string;
    effectiveness: number; // 0-100
  }[];
  
  // Metadata
  reportedBy: string;
  reportingDelay: number; // hours between crime and report
  jurisdiction: string;
  priority: number; // 1-10
}

export interface CorruptionCase {
  id: string;
  type: 'bribery' | 'embezzlement' | 'fraud' | 'nepotism' | 'abuse_of_power' | 'conflict_of_interest';
  
  // Corruption Details
  officialId: string; // government official involved
  office: string;
  level: 'local' | 'state' | 'federal';
  description: string;
  
  // Financial Impact
  monetaryValue: number;
  publicFundsInvolved: boolean;
  beneficiaries: string[];
  
  // Detection and Investigation
  detectionMethod: 'whistleblower' | 'audit' | 'investigation' | 'media' | 'complaint';
  investigationStatus: 'alleged' | 'investigating' | 'substantiated' | 'unsubstantiated' | 'prosecuted';
  
  // Evidence
  evidenceStrength: number; // 0-100
  witnesses: number;
  documentation: string[];
  
  // Consequences
  consequences: {
    official: {
      suspended: boolean;
      resigned: boolean;
      prosecuted: boolean;
      convicted: boolean;
      sentence?: string;
    };
    institutional: {
      reformsImplemented: string[];
      oversightIncreased: boolean;
      publicTrustImpact: number; // -100 to 100
    };
    political: {
      partyImpact: number; // -100 to 100
      electoralConsequences: string[];
      policyChanges: string[];
    };
  };
  
  // Prevention Measures
  preventionMeasures: {
    measure: string;
    effectiveness: number; // 0-100
    implementationCost: number;
  }[];
  
  // Metadata
  discoveryDate: Date;
  reportingDate: Date;
  resolutionDate?: Date;
  publicDisclosure: boolean;
  mediaAttention: number; // 0-100
  whistleblowerProtection: boolean;
}

export interface LawEnforcementAgency {
  id: string;
  name: string;
  type: 'police' | 'sheriff' | 'state_police' | 'federal' | 'specialized';
  jurisdiction: string;
  
  // Organization
  leadership: {
    chief: string;
    deputies: string[];
    commanders: string[];
  };
  
  personnel: {
    officers: number;
    detectives: number;
    specialists: number;
    civilians: number;
    total: number;
  };
  
  // Operations
  operations: {
    patrol: {
      beats: number;
      coverage: number; // 0-100 percentage of jurisdiction
      responseTime: number; // average minutes
    };
    investigation: {
      activeInvestigations: number;
      clearanceRate: number; // 0-100
      detectiveWorkload: number;
    };
    specialUnits: {
      name: string;
      personnel: number;
      specialization: string;
      equipment: string[];
    }[];
  };
  
  // Performance Metrics
  performance: {
    crimeReduction: number; // year-over-year percentage
    publicSafety: number; // 0-100
    communityTrust: number; // 0-100
    responseEfficiency: number; // 0-100
    investigationSuccess: number; // 0-100
  };
  
  // Community Relations
  communityPrograms: {
    program: string;
    participation: number;
    effectiveness: number; // 0-100
  }[];
  
  publicRelations: {
    approval: number; // 0-100
    complaints: number;
    commendations: number;
    transparency: number; // 0-100
  };
  
  // Resources and Equipment
  budget: number;
  equipment: {
    vehicles: number;
    weapons: number;
    technology: string[];
    facilities: string[];
  };
  
  training: {
    hoursPerOfficer: number;
    programs: string[];
    certifications: string[];
    continuingEducation: boolean;
  };
  
  // Accountability
  oversight: {
    internalAffairs: boolean;
    externalOversight: string[];
    bodyCamera: boolean;
    useOfForcePolicy: string;
  };
  
  incidents: {
    useOfForce: number;
    complaints: number;
    disciplinaryActions: number;
    lawsuits: number;
  };
  
  // Metadata
  established: Date;
  lastReform?: Date;
  accreditation: string[];
  status: 'operational' | 'reformed' | 'disbanded' | 'merged';
}

export interface LegalSystemAnalytics {
  jurisdiction: string;
  
  // Justice System Health
  justiceHealth: {
    overallScore: number; // 0-100
    components: {
      accessToJustice: number;
      fairness: number;
      efficiency: number;
      transparency: number;
      accountability: number;
    };
  };
  
  // Crime Statistics
  crimeStatistics: {
    totalCrimes: number;
    crimeRate: number; // per 100,000 population
    clearanceRate: number; // percentage solved
    
    byType: {
      [crimeType: string]: {
        count: number;
        rate: number;
        clearanceRate: number;
        trend: 'increasing' | 'decreasing' | 'stable';
      };
    };
    
    bySeverity: {
      misdemeanor: number;
      felony: number;
      capital: number;
    };
    
    victimization: {
      individualVictims: number;
      businessVictims: number;
      governmentVictims: number;
      repeatVictimization: number; // percentage
    };
  };
  
  // Court Performance
  courtPerformance: {
    caseBacklog: number;
    averageProcessingTime: number; // days
    clearanceRate: number; // cases resolved / cases filed
    appealRate: number; // percentage of cases appealed
    reversalRate: number; // percentage of appeals successful
    
    byCourtLevel: {
      [level: string]: {
        caseload: number;
        efficiency: number;
        publicConfidence: number;
      };
    };
  };
  
  // Corruption Metrics
  corruptionMetrics: {
    reportedCases: number;
    substantiatedCases: number;
    convictionRate: number;
    averageMonetaryValue: number;
    
    byType: {
      [corruptionType: string]: {
        cases: number;
        convictions: number;
        averageValue: number;
      };
    };
    
    byLevel: {
      local: number;
      state: number;
      federal: number;
    };
    
    preventionEffectiveness: number; // 0-100
    publicAwareness: number; // 0-100
  };
  
  // Law Enforcement Performance
  lawEnforcement: {
    totalAgencies: number;
    totalOfficers: number;
    
    performance: {
      crimeReduction: number; // year-over-year
      publicSafety: number; // 0-100
      communityTrust: number; // 0-100
      responseTime: number; // average minutes
    };
    
    accountability: {
      complaints: number;
      disciplinaryActions: number;
      useOfForceIncidents: number;
      bodyCamera: number; // percentage with cameras
    };
    
    communityRelations: {
      programParticipation: number;
      publicApproval: number; // 0-100
      diversityIndex: number; // 0-100
    };
  };
  
  // Legal System Trends
  trends: {
    crimeRates: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
    courtEfficiency: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
    publicTrust: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
    corruption: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
  };
  
  // Predictive Insights
  predictions: {
    crimeForecasts: { [crimeType: string]: { predicted: number; confidence: number } };
    courtloadPredictions: { [courtLevel: string]: { predicted: number; confidence: number } };
    corruptionRisk: { [level: string]: { risk: number; mitigation: string[] } };
  };
  
  // Metadata
  analysisDate: Date;
  dataQuality: number; // 0-100
  confidence: number; // 0-100
}

// Crime Categories and Definitions
export const CRIME_CATEGORIES = {
  VIOLENT: {
    name: 'Violent Crimes',
    types: ['homicide', 'assault', 'robbery', 'sexual_assault', 'kidnapping', 'domestic_violence'],
    severity: 'serious',
    priority: 9
  },
  PROPERTY: {
    name: 'Property Crimes',
    types: ['burglary', 'theft', 'motor_vehicle_theft', 'arson', 'vandalism'],
    severity: 'moderate',
    priority: 6
  },
  WHITE_COLLAR: {
    name: 'White Collar Crimes',
    types: ['fraud', 'embezzlement', 'money_laundering', 'tax_evasion', 'insider_trading'],
    severity: 'serious',
    priority: 7
  },
  CYBER: {
    name: 'Cyber Crimes',
    types: ['hacking', 'identity_theft', 'cyber_fraud', 'data_breach', 'ransomware'],
    severity: 'serious',
    priority: 8
  },
  DRUG: {
    name: 'Drug Crimes',
    types: ['possession', 'distribution', 'manufacturing', 'trafficking'],
    severity: 'moderate',
    priority: 5
  },
  PUBLIC_ORDER: {
    name: 'Public Order Crimes',
    types: ['disorderly_conduct', 'public_intoxication', 'loitering', 'noise_violations'],
    severity: 'minor',
    priority: 3
  },
  CORRUPTION: {
    name: 'Corruption Crimes',
    types: ['bribery', 'abuse_of_power', 'conflict_of_interest', 'nepotism'],
    severity: 'serious',
    priority: 9
  }
} as const;

// Legal System Events
export const LEGAL_EVENTS = {
  CASE_FILED: 'case_filed',
  CASE_RESOLVED: 'case_resolved',
  VERDICT_REACHED: 'verdict_reached',
  SENTENCE_IMPOSED: 'sentence_imposed',
  APPEAL_FILED: 'appeal_filed',
  CORRUPTION_DISCOVERED: 'corruption_discovered',
  COURT_REFORM: 'court_reform',
  LAW_ENFORCEMENT_INCIDENT: 'law_enforcement_incident'
} as const;

// Sentencing Guidelines
export const SENTENCING_GUIDELINES = {
  MISDEMEANOR: {
    imprisonment: { min: 0, max: 365 }, // days
    fine: { min: 0, max: 5000 },
    probation: { min: 0, max: 365 }
  },
  FELONY: {
    imprisonment: { min: 365, max: 7300 }, // 1-20 years
    fine: { min: 1000, max: 100000 },
    probation: { min: 365, max: 1825 }
  },
  CAPITAL: {
    imprisonment: { min: 7300, max: -1 }, // 20 years to life
    fine: { min: 10000, max: 1000000 },
    death: true
  }
} as const;
