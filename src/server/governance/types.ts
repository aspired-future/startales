/**
 * Governance & Democratic Systems - Core Types
 * 
 * Defines comprehensive governance modeling including constitutional frameworks,
 * democratic elections, legislative bodies, political parties, and voter psychology.
 * Integrates with psychology system for realistic political behavior.
 */

export interface Constitution {
  id: string;
  name: string;
  countryId: string;
  governmentType: 'presidential' | 'parliamentary' | 'semi_presidential' | 'constitutional_monarchy';
  
  // Constitutional Framework
  preamble: string;
  foundingPrinciples: string[];
  
  // Government Structure
  executiveBranch: {
    headOfState: 'president' | 'monarch' | 'governor_general';
    headOfGovernment: 'president' | 'prime_minister' | 'chancellor';
    termLength: number; // in years
    termLimits?: number; // null for no limits
    electionMethod: 'direct' | 'electoral_college' | 'parliamentary_appointment';
    powers: string[];
    impeachmentProcess?: {
      grounds: string[];
      procedure: string;
      requiredVotes: number; // percentage
    };
  };
  
  legislativeBranch: {
    structure: 'unicameral' | 'bicameral';
    chambers: {
      name: string; // e.g., "House of Representatives", "Senate", "Parliament"
      seats: number;
      termLength: number;
      electionMethod: 'direct' | 'proportional' | 'mixed' | 'appointed';
      powers: string[];
      leadership: {
        speakerTitle: string;
        electionMethod: 'internal' | 'executive_appointment';
      };
    }[];
    legislativeProcess: {
      billIntroduction: string[];
      committeeSystem: boolean;
      votingThresholds: {
        simple: number; // percentage
        supermajority: number; // percentage
        constitutional: number; // percentage
      };
    };
  };
  
  judicialBranch: {
    structure: 'unified' | 'federal' | 'dual';
    courts: {
      level: 'local' | 'appellate' | 'supreme';
      name: string;
      jurisdiction: string[];
      judgeSelection: 'elected' | 'appointed' | 'merit_based';
      termLength?: number; // null for life tenure
      judges: number;
    }[];
    judicialReview: boolean;
    independenceGuarantees: string[];
  };
  
  // Rights and Freedoms
  billOfRights: {
    category: string;
    rights: string[];
  }[];
  
  // Federal Structure (if applicable)
  federalStructure?: {
    type: 'federal' | 'unitary' | 'confederation';
    stateProvincePowers: string[];
    localGovernmentPowers: string[];
    powerDivision: {
      federal: string[];
      state: string[];
      concurrent: string[];
    };
  };
  
  // Amendment Process
  amendmentProcess: {
    proposalMethods: string[];
    ratificationMethods: string[];
    requiredThresholds: {
      proposal: number;
      ratification: number;
    };
  };
  
  // Emergency Powers
  emergencyProvisions: {
    declarationAuthority: string;
    scope: string[];
    duration: number; // in days
    legislativeOversight: boolean;
    restrictions: string[];
  };
  
  // Metadata
  adoptionDate: Date;
  lastAmended?: Date;
  amendments: Amendment[];
  ratificationStatus: 'draft' | 'pending' | 'ratified' | 'suspended';
  publicSupport: number; // 0-100 percentage
}

export interface Amendment {
  id: string;
  constitutionId: string;
  number: number;
  title: string;
  text: string;
  purpose: string;
  proposedDate: Date;
  ratifiedDate?: Date;
  status: 'proposed' | 'ratified' | 'rejected' | 'expired';
  proposalMethod: string;
  ratificationVotes: {
    for: number;
    against: number;
    abstain: number;
  };
  publicSupport: number;
}

export interface PoliticalParty {
  id: string;
  name: string;
  abbreviation: string;
  countryId: string;
  
  // Party Identity
  ideology: string[];
  politicalSpectrum: {
    economic: number; // -100 (far left) to 100 (far right)
    social: number; // -100 (authoritarian) to 100 (libertarian)
    foreign: number; // -100 (isolationist) to 100 (interventionist)
  };
  
  // Platform and Policies
  platform: {
    category: string;
    positions: {
      issue: string;
      stance: string;
      priority: number; // 1-10
    }[];
  }[];
  
  // Organization
  leadership: {
    chairperson: string;
    secretary: string;
    treasurer: string;
    spokesperson: string;
  };
  
  membership: {
    total: number;
    active: number;
    demographics: {
      ageGroups: { [ageRange: string]: number };
      education: { [level: string]: number };
      income: { [bracket: string]: number };
      geography: { [region: string]: number };
    };
  };
  
  // Electoral Performance
  electoralHistory: {
    election: string;
    office: string;
    votes: number;
    percentage: number;
    seats: number;
    result: 'won' | 'lost' | 'coalition';
  }[];
  
  currentRepresentation: {
    executive: boolean;
    legislative: {
      chamber: string;
      seats: number;
      percentage: number;
    }[];
    judicial: number;
    local: number;
  };
  
  // Resources
  finances: {
    treasury: number;
    fundraising: number;
    expenditures: number;
    donations: {
      individual: number;
      corporate: number;
      foreign: number;
    };
  };
  
  // Public Standing
  approval: {
    overall: number;
    byDemographic: { [group: string]: number };
    trending: 'up' | 'down' | 'stable';
  };
  
  // Metadata
  founded: Date;
  status: 'active' | 'inactive' | 'banned' | 'dissolved';
  coalitions: string[]; // IDs of allied parties
  rivals: string[]; // IDs of opposing parties
}

export interface Election {
  id: string;
  name: string;
  countryId: string;
  type: 'presidential' | 'legislative' | 'judicial' | 'referendum' | 'local';
  
  // Election Details
  office: string;
  seats?: number; // for legislative elections
  electionDate: Date;
  registrationDeadline: Date;
  campaignPeriod: {
    start: Date;
    end: Date;
  };
  
  // Electoral System
  votingSystem: 'plurality' | 'majority' | 'proportional' | 'mixed' | 'ranked_choice';
  districts?: {
    id: string;
    name: string;
    seats: number;
    population: number;
    boundaries: string;
  }[];
  
  // Candidates and Parties
  candidates: {
    id: string;
    name: string;
    partyId?: string;
    independent: boolean;
    platform: string;
    experience: string[];
    endorsements: string[];
    qualifications: {
      age: number;
      citizenship: boolean;
      residency: number; // years
      other: string[];
    };
  }[];
  
  // Campaign Finance
  campaignFinance: {
    candidateId: string;
    raised: number;
    spent: number;
    sources: {
      individual: number;
      party: number;
      pac: number;
      selfFunded: number;
    };
    expenditures: {
      advertising: number;
      staff: number;
      events: number;
      travel: number;
      other: number;
    };
  }[];
  
  // Voter Information
  eligibleVoters: number;
  registeredVoters: number;
  expectedTurnout: number;
  
  // Results (if completed)
  results?: {
    turnout: number;
    votes: {
      candidateId: string;
      votes: number;
      percentage: number;
    }[];
    winner?: string;
    margin: number;
    spoiledBallots: number;
    contestedResults: boolean;
  };
  
  // Election Integrity
  oversight: {
    electionCommission: string;
    internationalObservers: string[];
    domesticMonitors: string[];
    securityMeasures: string[];
  };
  
  // Metadata
  status: 'scheduled' | 'campaigning' | 'voting' | 'counting' | 'completed' | 'contested';
  previousElection?: string;
  nextElection?: Date;
}

export interface LegislativeSession {
  id: string;
  chamber: string;
  sessionNumber: number;
  startDate: Date;
  endDate?: Date;
  
  // Session Details
  agenda: {
    priority: number;
    item: string;
    sponsor: string;
    status: 'pending' | 'committee' | 'floor' | 'passed' | 'failed';
  }[];
  
  // Membership
  members: {
    legislatorId: string;
    name: string;
    partyId: string;
    district: string;
    committees: string[];
    leadership: string[];
  }[];
  
  // Party Composition
  partyComposition: {
    partyId: string;
    seats: number;
    percentage: number;
    leadership: boolean;
  }[];
  
  // Legislative Activity
  billsIntroduced: number;
  billsPassed: number;
  billsFailed: number;
  amendments: number;
  votingRecord: {
    billId: string;
    title: string;
    voteDate: Date;
    result: 'passed' | 'failed';
    votes: {
      for: number;
      against: number;
      abstain: number;
      absent: number;
    };
    partyLineVoting: boolean;
  }[];
  
  // Committees
  committees: {
    id: string;
    name: string;
    jurisdiction: string[];
    chair: string;
    members: string[];
    meetings: number;
    billsReviewed: number;
  }[];
  
  // Public Engagement
  publicHearings: number;
  citizenTestimony: number;
  mediaAttention: number;
  approval: number;
  
  // Metadata
  status: 'active' | 'recess' | 'adjourned' | 'dissolved';
  productivity: number; // bills passed / bills introduced
  bipartisanship: number; // percentage of bipartisan votes
}

export interface VoterProfile {
  id: string;
  citizenId: string; // Links to Population system
  psychologyId: string; // Links to Psychology system
  
  // Voting Eligibility
  eligible: boolean;
  registered: boolean;
  registrationDate?: Date;
  votingDistrict: string;
  
  // Political Identity
  partyAffiliation?: string;
  politicalLeanings: {
    economic: number; // -100 to 100
    social: number; // -100 to 100
    foreign: number; // -100 to 100
  };
  
  // Issue Priorities
  issuePriorities: {
    issue: string;
    importance: number; // 1-10
    position: number; // -100 to 100
  }[];
  
  // Voting Behavior
  votingHistory: {
    electionId: string;
    participated: boolean;
    method: 'in_person' | 'absentee' | 'early' | 'online';
    voteChoice?: string; // candidate/party ID
  }[];
  
  turnoutProbability: number; // 0-100
  voteSwingPotential: number; // 0-100, likelihood to change vote
  
  // Information Sources
  informationSources: {
    source: string;
    trust: number; // 0-100
    frequency: number; // 0-100
  }[];
  
  // Social Influence
  politicalDiscussion: number; // 0-100, frequency of political talk
  socialInfluence: {
    family: number; // 0-100
    friends: number; // 0-100
    media: number; // 0-100
    party: number; // 0-100
  };
  
  // Demographic Factors
  demographics: {
    age: number;
    education: string;
    income: number;
    occupation: string;
    religion?: string;
    ethnicity?: string;
    geography: string;
  };
  
  // Metadata
  lastUpdated: Date;
  dataQuality: number; // 0-100
  predictiveAccuracy: number; // 0-100, how well we predict their votes
}

export interface GovernmentOfficial {
  id: string;
  citizenId: string;
  psychologyId: string;
  
  // Office Details
  office: string;
  title: string;
  level: 'federal' | 'state' | 'local';
  branch: 'executive' | 'legislative' | 'judicial';
  
  // Term Information
  termStart: Date;
  termEnd: Date;
  termNumber: number;
  electedAppointed: 'elected' | 'appointed' | 'inherited';
  
  // Political Affiliation
  partyId?: string;
  politicalAlignment: {
    economic: number;
    social: number;
    foreign: number;
  };
  
  // Performance Metrics
  approval: {
    overall: number;
    byDemographic: { [group: string]: number };
    trending: 'up' | 'down' | 'stable';
  };
  
  // Legislative Record (if applicable)
  legislativeRecord?: {
    billsSponsored: number;
    billsPassed: number;
    votingRecord: {
      partyLine: number; // percentage
      bipartisan: number; // percentage
      attendance: number; // percentage
    };
    committeeWork: string[];
  };
  
  // Executive Actions (if applicable)
  executiveRecord?: {
    executiveOrders: number;
    vetoes: number;
    appointments: number;
    budgetProposals: number;
    foreignPolicy: string[];
  };
  
  // Judicial Record (if applicable)
  judicialRecord?: {
    casesHeard: number;
    decisionsWritten: number;
    judicialPhilosophy: string;
    majorRulings: string[];
  };
  
  // Public Engagement
  publicAppearances: number;
  mediaInterviews: number;
  socialMediaActivity: number;
  townHalls: number;
  
  // Scandals and Controversies
  controversies: {
    type: string;
    description: string;
    date: Date;
    resolved: boolean;
    impact: number; // -100 to 100
  }[];
  
  // Metadata
  status: 'active' | 'suspended' | 'resigned' | 'impeached' | 'term_expired';
  successor?: string;
  legacy: string[];
}

export interface GovernanceAnalytics {
  countryId: string;
  
  // Democratic Health
  democraticHealth: {
    overallScore: number; // 0-100
    components: {
      electoralProcess: number;
      governmentFunctioning: number;
      politicalParticipation: number;
      politicalCulture: number;
      civilLiberties: number;
    };
  };
  
  // Political Stability
  stability: {
    governmentStability: number; // 0-100
    politicalRisk: number; // 0-100
    institutionalStrength: number; // 0-100
    ruleOfLaw: number; // 0-100
  };
  
  // Electoral Metrics
  electoralMetrics: {
    voterTurnout: number;
    competitiveness: number; // margin of victory
    partySystemFragmentation: number;
    incumbentAdvantage: number;
  };
  
  // Public Trust
  publicTrust: {
    government: number;
    legislature: number;
    judiciary: number;
    elections: number;
    politicalParties: number;
  };
  
  // Representation Quality
  representation: {
    descriptiveRepresentation: number; // demographic match
    substantiveRepresentation: number; // policy match
    responsiveness: number; // to public opinion
    accountability: number; // electoral accountability
  };
  
  // Policy Outcomes
  policyEffectiveness: {
    economicPolicy: number;
    socialPolicy: number;
    foreignPolicy: number;
    environmentalPolicy: number;
  };
  
  // Trends and Predictions
  trends: {
    polarization: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
    participation: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
    trust: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
    stability: { current: number; trend: 'increasing' | 'decreasing' | 'stable' };
  };
  
  // Metadata
  analysisDate: Date;
  dataQuality: number;
  confidence: number;
}

// Governance System Events
export const GOVERNANCE_EVENTS = {
  ELECTION_CALLED: 'election_called',
  ELECTION_COMPLETED: 'election_completed',
  GOVERNMENT_FORMED: 'government_formed',
  GOVERNMENT_DISSOLVED: 'government_dissolved',
  CONSTITUTION_AMENDED: 'constitution_amended',
  PARTY_FORMED: 'party_formed',
  PARTY_DISSOLVED: 'party_dissolved',
  SCANDAL_ERUPTED: 'scandal_erupted',
  VOTE_OF_NO_CONFIDENCE: 'vote_of_no_confidence',
  IMPEACHMENT_PROCEEDINGS: 'impeachment_proceedings'
} as const;

// Government Types and Systems
export const GOVERNMENT_TYPES = {
  PRESIDENTIAL: {
    name: 'Presidential System',
    executiveSelection: 'direct_election',
    executiveLegislativeRelation: 'separation_of_powers',
    headOfState: 'president',
    headOfGovernment: 'president'
  },
  PARLIAMENTARY: {
    name: 'Parliamentary System',
    executiveSelection: 'legislative_appointment',
    executiveLegislativeRelation: 'fusion_of_powers',
    headOfState: 'monarch_or_president',
    headOfGovernment: 'prime_minister'
  },
  SEMI_PRESIDENTIAL: {
    name: 'Semi-Presidential System',
    executiveSelection: 'dual_executive',
    executiveLegislativeRelation: 'mixed',
    headOfState: 'president',
    headOfGovernment: 'prime_minister'
  }
} as const;

// Electoral Systems
export const ELECTORAL_SYSTEMS = {
  PLURALITY: 'First Past the Post',
  MAJORITY: 'Two-Round System',
  PROPORTIONAL: 'Proportional Representation',
  MIXED: 'Mixed Member Proportional',
  RANKED_CHOICE: 'Ranked Choice Voting'
} as const;
