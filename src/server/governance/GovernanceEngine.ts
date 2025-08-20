/**
 * Governance Engine - Democratic Systems Core Engine
 * 
 * Implements comprehensive governance modeling including constitutional frameworks,
 * democratic elections, legislative bodies, political parties, and voter psychology.
 * Integrates with psychology system for realistic political behavior.
 */

import { 
  Constitution,
  Amendment,
  PoliticalParty,
  Election,
  LegislativeSession,
  VoterProfile,
  GovernmentOfficial,
  GovernanceAnalytics,
  GOVERNANCE_EVENTS,
  GOVERNMENT_TYPES,
  ELECTORAL_SYSTEMS
} from './types.js';

export class GovernanceEngine {
  private constitutions: Map<string, Constitution> = new Map();
  private amendments: Map<string, Amendment[]> = new Map();
  private politicalParties: Map<string, PoliticalParty> = new Map();
  private elections: Map<string, Election> = new Map();
  private legislativeSessions: Map<string, LegislativeSession> = new Map();
  private voterProfiles: Map<string, VoterProfile> = new Map();
  private governmentOfficials: Map<string, GovernmentOfficial> = new Map();
  private governanceEvents: any[] = [];

  constructor() {}

  /**
   * Create a new constitution for a country
   */
  createConstitution(params: {
    name: string;
    countryId: string;
    governmentType: Constitution['governmentType'];
    foundingPrinciples: string[];
    executiveStructure: Constitution['executiveBranch'];
    legislativeStructure: Constitution['legislativeBranch'];
    judicialStructure: Constitution['judicialBranch'];
    billOfRights: Constitution['billOfRights'];
    federalStructure?: Constitution['federalStructure'];
  }): Constitution {
    const constitutionId = `constitution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const constitution: Constitution = {
      id: constitutionId,
      name: params.name,
      countryId: params.countryId,
      governmentType: params.governmentType,
      preamble: this.generatePreamble(params.name, params.foundingPrinciples),
      foundingPrinciples: params.foundingPrinciples,
      executiveBranch: params.executiveStructure,
      legislativeBranch: params.legislativeStructure,
      judicialBranch: params.judicialStructure,
      billOfRights: params.billOfRights,
      federalStructure: params.federalStructure,
      amendmentProcess: this.generateAmendmentProcess(params.governmentType),
      emergencyProvisions: this.generateEmergencyProvisions(params.governmentType),
      adoptionDate: new Date(),
      amendments: [],
      ratificationStatus: 'draft',
      publicSupport: 50 // Start neutral
    };

    this.constitutions.set(constitutionId, constitution);
    this.amendments.set(constitutionId, []);

    this.logGovernanceEvent({
      type: GOVERNANCE_EVENTS.CONSTITUTION_AMENDED,
      constitutionId,
      countryId: params.countryId,
      action: 'created',
      timestamp: new Date()
    });

    return constitution;
  }

  /**
   * Propose and process constitutional amendment
   */
  proposeAmendment(params: {
    constitutionId: string;
    title: string;
    text: string;
    purpose: string;
    proposalMethod: string;
  }): Amendment {
    const constitution = this.constitutions.get(params.constitutionId);
    if (!constitution) {
      throw new Error(`Constitution not found: ${params.constitutionId}`);
    }

    const amendments = this.amendments.get(params.constitutionId) || [];
    const amendmentNumber = amendments.length + 1;

    const amendment: Amendment = {
      id: `amendment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      constitutionId: params.constitutionId,
      number: amendmentNumber,
      title: params.title,
      text: params.text,
      purpose: params.purpose,
      proposedDate: new Date(),
      status: 'proposed',
      proposalMethod: params.proposalMethod,
      ratificationVotes: { for: 0, against: 0, abstain: 0 },
      publicSupport: Math.random() * 100 // Initial polling
    };

    amendments.push(amendment);
    this.amendments.set(params.constitutionId, amendments);

    return amendment;
  }

  /**
   * Create a political party
   */
  createPoliticalParty(params: {
    name: string;
    abbreviation: string;
    countryId: string;
    ideology: string[];
    politicalSpectrum: PoliticalParty['politicalSpectrum'];
    platform: PoliticalParty['platform'];
    leadership: PoliticalParty['leadership'];
  }): PoliticalParty {
    const partyId = `party_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const party: PoliticalParty = {
      id: partyId,
      name: params.name,
      abbreviation: params.abbreviation,
      countryId: params.countryId,
      ideology: params.ideology,
      politicalSpectrum: params.politicalSpectrum,
      platform: params.platform,
      leadership: params.leadership,
      membership: this.generateInitialMembership(),
      electoralHistory: [],
      currentRepresentation: this.generateInitialRepresentation(),
      finances: this.generateInitialFinances(),
      approval: {
        overall: 40 + Math.random() * 20, // 40-60% initial approval
        byDemographic: {},
        trending: 'stable'
      },
      founded: new Date(),
      status: 'active',
      coalitions: [],
      rivals: []
    };

    this.politicalParties.set(partyId, party);

    this.logGovernanceEvent({
      type: GOVERNANCE_EVENTS.PARTY_FORMED,
      partyId,
      countryId: params.countryId,
      partyName: params.name,
      timestamp: new Date()
    });

    return party;
  }

  /**
   * Schedule and manage elections
   */
  scheduleElection(params: {
    name: string;
    countryId: string;
    type: Election['type'];
    office: string;
    electionDate: Date;
    votingSystem: Election['votingSystem'];
    candidates: Election['candidates'];
    eligibleVoters: number;
  }): Election {
    const electionId = `election_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const election: Election = {
      id: electionId,
      name: params.name,
      countryId: params.countryId,
      type: params.type,
      office: params.office,
      electionDate: params.electionDate,
      registrationDeadline: new Date(params.electionDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days before
      campaignPeriod: {
        start: new Date(params.electionDate.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 days before
        end: new Date(params.electionDate.getTime() - 1 * 24 * 60 * 60 * 1000) // 1 day before
      },
      votingSystem: params.votingSystem,
      candidates: params.candidates,
      campaignFinance: this.generateCampaignFinance(params.candidates),
      eligibleVoters: params.eligibleVoters,
      registeredVoters: Math.floor(params.eligibleVoters * (0.7 + Math.random() * 0.2)), // 70-90% registration
      expectedTurnout: 50 + Math.random() * 30, // 50-80% expected turnout
      oversight: this.generateElectionOversight(),
      status: 'scheduled'
    };

    this.elections.set(electionId, election);

    this.logGovernanceEvent({
      type: GOVERNANCE_EVENTS.ELECTION_CALLED,
      electionId,
      countryId: params.countryId,
      electionType: params.type,
      electionDate: params.electionDate,
      timestamp: new Date()
    });

    return election;
  }

  /**
   * Conduct election and calculate results
   */
  conductElection(electionId: string): Election {
    const election = this.elections.get(electionId);
    if (!election) {
      throw new Error(`Election not found: ${electionId}`);
    }

    if (election.status !== 'scheduled' && election.status !== 'campaigning') {
      throw new Error(`Election cannot be conducted in status: ${election.status}`);
    }

    // Calculate voter turnout based on various factors
    const actualTurnout = this.calculateVoterTurnout(election);
    const totalVotes = Math.floor(election.registeredVoters * (actualTurnout / 100));

    // Simulate voting based on voter psychology and candidate appeal
    const voteResults = this.simulateVoting(election, totalVotes);

    // Determine winner based on electoral system
    const winner = this.determineElectionWinner(election, voteResults);

    election.results = {
      turnout: actualTurnout,
      votes: voteResults,
      winner: winner?.candidateId,
      margin: winner ? winner.margin : 0,
      spoiledBallots: Math.floor(totalVotes * 0.01), // 1% spoiled ballots
      contestedResults: winner ? winner.margin < 2 : false // Contest if margin < 2%
    };

    election.status = election.results.contestedResults ? 'contested' : 'completed';

    this.logGovernanceEvent({
      type: GOVERNANCE_EVENTS.ELECTION_COMPLETED,
      electionId,
      countryId: election.countryId,
      winner: election.results.winner,
      turnout: actualTurnout,
      margin: election.results.margin,
      timestamp: new Date()
    });

    return election;
  }

  /**
   * Create legislative session
   */
  createLegislativeSession(params: {
    chamber: string;
    sessionNumber: number;
    startDate: Date;
    members: LegislativeSession['members'];
    partyComposition: LegislativeSession['partyComposition'];
  }): LegislativeSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: LegislativeSession = {
      id: sessionId,
      chamber: params.chamber,
      sessionNumber: params.sessionNumber,
      startDate: params.startDate,
      agenda: this.generateLegislativeAgenda(),
      members: params.members,
      partyComposition: params.partyComposition,
      billsIntroduced: 0,
      billsPassed: 0,
      billsFailed: 0,
      amendments: 0,
      votingRecord: [],
      committees: this.generateCommittees(params.chamber, params.members),
      publicHearings: 0,
      citizenTestimony: 0,
      mediaAttention: 50,
      approval: 45 + Math.random() * 20, // 45-65% initial approval
      status: 'active',
      productivity: 0,
      bipartisanship: 50
    };

    this.legislativeSessions.set(sessionId, session);

    return session;
  }

  /**
   * Create voter profile linked to citizen and psychology
   */
  createVoterProfile(params: {
    citizenId: string;
    psychologyId: string;
    demographics: VoterProfile['demographics'];
    votingDistrict: string;
  }): VoterProfile {
    const voterProfileId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate political leanings based on demographics and psychology
    const politicalLeanings = this.generatePoliticalLeanings(params.demographics);
    
    const voterProfile: VoterProfile = {
      id: voterProfileId,
      citizenId: params.citizenId,
      psychologyId: params.psychologyId,
      eligible: this.determineVotingEligibility(params.demographics),
      registered: Math.random() > 0.3, // 70% registration rate
      registrationDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) : undefined,
      votingDistrict: params.votingDistrict,
      partyAffiliation: this.determinePartyAffiliation(politicalLeanings),
      politicalLeanings,
      issuePriorities: this.generateIssuePriorities(params.demographics, politicalLeanings),
      votingHistory: [],
      turnoutProbability: this.calculateTurnoutProbability(params.demographics, politicalLeanings),
      voteSwingPotential: this.calculateSwingPotential(politicalLeanings),
      informationSources: this.generateInformationSources(params.demographics),
      politicalDiscussion: 30 + Math.random() * 40, // 30-70%
      socialInfluence: this.generateSocialInfluence(params.demographics),
      demographics: params.demographics,
      lastUpdated: new Date(),
      dataQuality: 80 + Math.random() * 15, // 80-95%
      predictiveAccuracy: 70 + Math.random() * 20 // 70-90%
    };

    this.voterProfiles.set(voterProfileId, voterProfile);

    return voterProfile;
  }

  /**
   * Create government official
   */
  createGovernmentOfficial(params: {
    citizenId: string;
    psychologyId: string;
    office: string;
    title: string;
    level: GovernmentOfficial['level'];
    branch: GovernmentOfficial['branch'];
    termStart: Date;
    termEnd: Date;
    electedAppointed: GovernmentOfficial['electedAppointed'];
    partyId?: string;
  }): GovernmentOfficial {
    const officialId = `official_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const official: GovernmentOfficial = {
      id: officialId,
      citizenId: params.citizenId,
      psychologyId: params.psychologyId,
      office: params.office,
      title: params.title,
      level: params.level,
      branch: params.branch,
      termStart: params.termStart,
      termEnd: params.termEnd,
      termNumber: 1,
      electedAppointed: params.electedAppointed,
      partyId: params.partyId,
      politicalAlignment: this.generatePoliticalAlignment(params.partyId),
      approval: {
        overall: 50 + Math.random() * 20, // 50-70% honeymoon period
        byDemographic: {},
        trending: 'stable'
      },
      publicAppearances: 0,
      mediaInterviews: 0,
      socialMediaActivity: 0,
      townHalls: 0,
      controversies: [],
      status: 'active',
      legacy: []
    };

    // Add branch-specific records
    if (params.branch === 'legislative') {
      official.legislativeRecord = {
        billsSponsored: 0,
        billsPassed: 0,
        votingRecord: {
          partyLine: 80 + Math.random() * 15, // 80-95%
          bipartisan: 15 + Math.random() * 10, // 15-25%
          attendance: 85 + Math.random() * 10 // 85-95%
        },
        committeeWork: []
      };
    } else if (params.branch === 'executive') {
      official.executiveRecord = {
        executiveOrders: 0,
        vetoes: 0,
        appointments: 0,
        budgetProposals: 0,
        foreignPolicy: []
      };
    } else if (params.branch === 'judicial') {
      official.judicialRecord = {
        casesHeard: 0,
        decisionsWritten: 0,
        judicialPhilosophy: this.generateJudicialPhilosophy(),
        majorRulings: []
      };
    }

    this.governmentOfficials.set(officialId, official);

    return official;
  }

  /**
   * Generate comprehensive governance analytics
   */
  generateGovernanceAnalytics(countryId: string): GovernanceAnalytics {
    const constitution = Array.from(this.constitutions.values()).find(c => c.countryId === countryId);
    const parties = Array.from(this.politicalParties.values()).filter(p => p.countryId === countryId);
    const elections = Array.from(this.elections.values()).filter(e => e.countryId === countryId);
    const voters = Array.from(this.voterProfiles.values());

    return {
      countryId,
      democraticHealth: this.calculateDemocraticHealth(constitution, parties, elections),
      stability: this.calculatePoliticalStability(constitution, parties, elections),
      electoralMetrics: this.calculateElectoralMetrics(elections),
      publicTrust: this.calculatePublicTrust(constitution, parties, elections),
      representation: this.calculateRepresentationQuality(parties, voters),
      policyEffectiveness: this.calculatePolicyEffectiveness(countryId),
      trends: this.calculateGovernanceTrends(countryId),
      analysisDate: new Date(),
      dataQuality: 85,
      confidence: 80
    };
  }

  /**
   * Simulate time step for governance system
   */
  simulateTimeStep(): void {
    // Update party approval ratings
    this.updatePartyApprovals();
    
    // Process ongoing elections
    this.processElections();
    
    // Update legislative sessions
    this.updateLegislativeSessions();
    
    // Update official approval ratings
    this.updateOfficialApprovals();
    
    // Generate random political events
    this.generatePoliticalEvents();
  }

  // Private helper methods

  private generatePreamble(name: string, principles: string[]): string {
    return `We, the people of ${name}, in order to ${principles.join(', ')}, do ordain and establish this Constitution.`;
  }

  private generateAmendmentProcess(governmentType: Constitution['governmentType']): Constitution['amendmentProcess'] {
    const baseThreshold = governmentType === 'parliamentary' ? 60 : 67;
    
    return {
      proposalMethods: [
        'Legislative proposal with supermajority',
        'Constitutional convention',
        'Citizen initiative'
      ],
      ratificationMethods: [
        'Legislative ratification',
        'Popular referendum',
        'State/provincial ratification'
      ],
      requiredThresholds: {
        proposal: baseThreshold,
        ratification: baseThreshold + 5
      }
    };
  }

  private generateEmergencyProvisions(governmentType: Constitution['governmentType']): Constitution['emergencyProvisions'] {
    return {
      declarationAuthority: governmentType === 'presidential' ? 'President' : 'Prime Minister with Cabinet approval',
      scope: [
        'Suspend certain civil liberties',
        'Deploy military for domestic security',
        'Impose curfews and movement restrictions',
        'Control media and communications'
      ],
      duration: governmentType === 'parliamentary' ? 30 : 60,
      legislativeOversight: true,
      restrictions: [
        'Cannot suspend elections indefinitely',
        'Cannot dissolve legislature',
        'Cannot suspend judicial review'
      ]
    };
  }

  private generateInitialMembership(): PoliticalParty['membership'] {
    const total = 1000 + Math.floor(Math.random() * 50000);
    return {
      total,
      active: Math.floor(total * (0.3 + Math.random() * 0.4)), // 30-70% active
      demographics: {
        ageGroups: {
          '18-29': Math.random() * 30,
          '30-44': Math.random() * 35,
          '45-64': Math.random() * 25,
          '65+': Math.random() * 15
        },
        education: {
          'high_school': Math.random() * 40,
          'college': Math.random() * 35,
          'graduate': Math.random() * 25
        },
        income: {
          'low': Math.random() * 30,
          'middle': Math.random() * 50,
          'high': Math.random() * 20
        },
        geography: {
          'urban': Math.random() * 60,
          'suburban': Math.random() * 30,
          'rural': Math.random() * 20
        }
      }
    };
  }

  private generateInitialRepresentation(): PoliticalParty['currentRepresentation'] {
    return {
      executive: false,
      legislative: [],
      judicial: 0,
      local: Math.floor(Math.random() * 50)
    };
  }

  private generateInitialFinances(): PoliticalParty['finances'] {
    const treasury = Math.floor(Math.random() * 1000000);
    return {
      treasury,
      fundraising: Math.floor(treasury * 0.2),
      expenditures: Math.floor(treasury * 0.15),
      donations: {
        individual: Math.floor(treasury * 0.6),
        corporate: Math.floor(treasury * 0.3),
        foreign: Math.floor(treasury * 0.1)
      }
    };
  }

  private generateCampaignFinance(candidates: Election['candidates']): Election['campaignFinance'] {
    return candidates.map(candidate => ({
      candidateId: candidate.id,
      raised: Math.floor(Math.random() * 10000000), // Up to $10M
      spent: Math.floor(Math.random() * 8000000), // Up to $8M
      sources: {
        individual: Math.floor(Math.random() * 4000000),
        party: Math.floor(Math.random() * 2000000),
        pac: Math.floor(Math.random() * 3000000),
        selfFunded: Math.floor(Math.random() * 1000000)
      },
      expenditures: {
        advertising: Math.floor(Math.random() * 4000000),
        staff: Math.floor(Math.random() * 2000000),
        events: Math.floor(Math.random() * 1000000),
        travel: Math.floor(Math.random() * 500000),
        other: Math.floor(Math.random() * 500000)
      }
    }));
  }

  private generateElectionOversight(): Election['oversight'] {
    return {
      electionCommission: 'Independent Electoral Commission',
      internationalObservers: ['UN Electoral Assistance', 'Democracy International'],
      domesticMonitors: ['Citizens Election Watch', 'Transparency Coalition'],
      securityMeasures: [
        'Ballot security protocols',
        'Voter verification systems',
        'Poll monitoring',
        'Cybersecurity measures'
      ]
    };
  }

  private generateLegislativeAgenda(): LegislativeSession['agenda'] {
    const priorities = [
      'Budget appropriations',
      'Healthcare reform',
      'Infrastructure investment',
      'Education funding',
      'Environmental protection',
      'Economic development',
      'Social security reform',
      'Immigration policy',
      'Criminal justice reform',
      'Technology regulation'
    ];

    return priorities.slice(0, 5 + Math.floor(Math.random() * 5)).map((item, index) => ({
      priority: index + 1,
      item,
      sponsor: `Legislator ${Math.floor(Math.random() * 100)}`,
      status: 'pending'
    }));
  }

  private generateCommittees(chamber: string, members: LegislativeSession['members']): LegislativeSession['committees'] {
    const committeeNames = [
      'Appropriations',
      'Foreign Affairs',
      'Judiciary',
      'Armed Services',
      'Energy and Commerce',
      'Education and Labor',
      'Transportation',
      'Agriculture',
      'Veterans Affairs',
      'Intelligence'
    ];

    return committeeNames.slice(0, 6 + Math.floor(Math.random() * 4)).map(name => ({
      id: `committee_${name.toLowerCase().replace(/\s+/g, '_')}`,
      name: `${chamber} Committee on ${name}`,
      jurisdiction: [`${name} policy and oversight`],
      chair: members[Math.floor(Math.random() * members.length)].legislatorId,
      members: members.slice(0, 5 + Math.floor(Math.random() * 10)).map(m => m.legislatorId),
      meetings: 0,
      billsReviewed: 0
    }));
  }

  private generatePoliticalLeanings(demographics: VoterProfile['demographics']): VoterProfile['politicalLeanings'] {
    // Base leanings on demographic factors
    let economic = 0;
    let social = 0;
    let foreign = 0;

    // Age effects
    if (demographics.age < 35) {
      social += 20; // More socially liberal
      economic -= 10; // Slightly more economically liberal
    } else if (demographics.age > 65) {
      social -= 15; // More socially conservative
      economic += 10; // Slightly more economically conservative
    }

    // Education effects
    if (demographics.education === 'graduate') {
      social += 15;
      foreign += 10;
    } else if (demographics.education === 'high_school') {
      social -= 10;
      foreign -= 5;
    }

    // Income effects
    if (demographics.income > 100000) {
      economic += 20; // More economically conservative
    } else if (demographics.income < 30000) {
      economic -= 20; // More economically liberal
    }

    // Geography effects
    if (demographics.geography === 'urban') {
      social += 15;
      economic -= 5;
    } else if (demographics.geography === 'rural') {
      social -= 15;
      economic += 5;
    }

    // Add randomness
    economic += (Math.random() - 0.5) * 40;
    social += (Math.random() - 0.5) * 40;
    foreign += (Math.random() - 0.5) * 40;

    // Clamp to -100 to 100 range
    return {
      economic: Math.max(-100, Math.min(100, economic)),
      social: Math.max(-100, Math.min(100, social)),
      foreign: Math.max(-100, Math.min(100, foreign))
    };
  }

  private determineVotingEligibility(demographics: VoterProfile['demographics']): boolean {
    return demographics.age >= 18; // Basic age requirement
  }

  private determinePartyAffiliation(leanings: VoterProfile['politicalLeanings']): string | undefined {
    // Simplified party affiliation based on political leanings
    const parties = Array.from(this.politicalParties.values());
    if (parties.length === 0) return undefined;

    // Find closest party based on political spectrum
    let closestParty = parties[0];
    let minDistance = Infinity;

    parties.forEach(party => {
      const distance = Math.sqrt(
        Math.pow(party.politicalSpectrum.economic - leanings.economic, 2) +
        Math.pow(party.politicalSpectrum.social - leanings.social, 2) +
        Math.pow(party.politicalSpectrum.foreign - leanings.foreign, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestParty = party;
      }
    });

    // Only affiliate if reasonably close (within 50 points distance)
    return minDistance < 50 ? closestParty.id : undefined;
  }

  private generateIssuePriorities(
    demographics: VoterProfile['demographics'], 
    leanings: VoterProfile['politicalLeanings']
  ): VoterProfile['issuePriorities'] {
    const issues = [
      'Economy', 'Healthcare', 'Education', 'Environment', 'Immigration',
      'Crime', 'Foreign Policy', 'Social Issues', 'Technology', 'Infrastructure'
    ];

    return issues.map(issue => ({
      issue,
      importance: Math.floor(1 + Math.random() * 10),
      position: Math.floor(-100 + Math.random() * 200)
    }));
  }

  private calculateTurnoutProbability(
    demographics: VoterProfile['demographics'],
    leanings: VoterProfile['politicalLeanings']
  ): number {
    let probability = 60; // Base 60%

    // Age effects
    if (demographics.age > 65) probability += 20;
    else if (demographics.age < 25) probability -= 15;

    // Education effects
    if (demographics.education === 'graduate') probability += 15;
    else if (demographics.education === 'high_school') probability -= 10;

    // Income effects
    if (demographics.income > 75000) probability += 10;
    else if (demographics.income < 25000) probability -= 10;

    // Political engagement (based on strength of leanings)
    const engagementLevel = (Math.abs(leanings.economic) + Math.abs(leanings.social) + Math.abs(leanings.foreign)) / 3;
    probability += engagementLevel * 0.3;

    return Math.max(10, Math.min(95, probability));
  }

  private calculateSwingPotential(leanings: VoterProfile['politicalLeanings']): number {
    // Moderate voters have higher swing potential
    const moderateScore = 100 - (Math.abs(leanings.economic) + Math.abs(leanings.social) + Math.abs(leanings.foreign)) / 3;
    return Math.max(5, Math.min(80, moderateScore));
  }

  private generateInformationSources(demographics: VoterProfile['demographics']): VoterProfile['informationSources'] {
    const sources = [
      'Television News', 'Newspapers', 'Social Media', 'Radio', 'Online News',
      'Political Websites', 'Friends and Family', 'Political Parties'
    ];

    return sources.map(source => ({
      source,
      trust: Math.floor(20 + Math.random() * 60), // 20-80%
      frequency: Math.floor(10 + Math.random() * 80) // 10-90%
    }));
  }

  private generateSocialInfluence(demographics: VoterProfile['demographics']): VoterProfile['socialInfluence'] {
    return {
      family: Math.floor(40 + Math.random() * 40), // 40-80%
      friends: Math.floor(30 + Math.random() * 40), // 30-70%
      media: Math.floor(20 + Math.random() * 50), // 20-70%
      party: Math.floor(10 + Math.random() * 60) // 10-70%
    };
  }

  private generatePoliticalAlignment(partyId?: string): GovernmentOfficial['politicalAlignment'] {
    if (partyId) {
      const party = this.politicalParties.get(partyId);
      if (party) {
        return {
          economic: party.politicalSpectrum.economic + (Math.random() - 0.5) * 20,
          social: party.politicalSpectrum.social + (Math.random() - 0.5) * 20,
          foreign: party.politicalSpectrum.foreign + (Math.random() - 0.5) * 20
        };
      }
    }

    return {
      economic: (Math.random() - 0.5) * 200,
      social: (Math.random() - 0.5) * 200,
      foreign: (Math.random() - 0.5) * 200
    };
  }

  private generateJudicialPhilosophy(): string {
    const philosophies = [
      'Originalist', 'Living Constitution', 'Textualist', 'Pragmatist',
      'Natural Law', 'Legal Realist', 'Formalist', 'Functionalist'
    ];
    return philosophies[Math.floor(Math.random() * philosophies.length)];
  }

  private calculateVoterTurnout(election: Election): number {
    // Base turnout on election type and competitiveness
    let baseTurnout = election.expectedTurnout;

    // Adjust for election type
    if (election.type === 'presidential') baseTurnout += 10;
    else if (election.type === 'local') baseTurnout -= 15;

    // Adjust for competitiveness (closer races drive higher turnout)
    const competitiveness = this.calculateElectionCompetitiveness(election);
    baseTurnout += competitiveness * 0.3;

    // Add randomness
    baseTurnout += (Math.random() - 0.5) * 10;

    return Math.max(20, Math.min(90, baseTurnout));
  }

  private calculateElectionCompetitiveness(election: Election): number {
    // Simplified competitiveness based on number of viable candidates
    const viableCandidates = election.candidates.filter(c => 
      c.experience.length > 0 && c.endorsements.length > 0
    ).length;

    return Math.min(50, viableCandidates * 10);
  }

  private simulateVoting(election: Election, totalVotes: number): Election['results']['votes'] {
    // Simplified voting simulation - distribute votes among candidates
    const votes = election.candidates.map(candidate => {
      const baseVotes = Math.floor(totalVotes / election.candidates.length);
      const variation = Math.floor((Math.random() - 0.5) * totalVotes * 0.4);
      return {
        candidateId: candidate.id,
        votes: Math.max(0, baseVotes + variation),
        percentage: 0 // Will be calculated after
      };
    });

    // Normalize to ensure total votes match
    const actualTotal = votes.reduce((sum, v) => sum + v.votes, 0);
    votes.forEach(v => {
      v.percentage = (v.votes / actualTotal) * 100;
    });

    return votes.sort((a, b) => b.votes - a.votes);
  }

  private determineElectionWinner(election: Election, voteResults: Election['results']['votes']): { candidateId: string; margin: number } | null {
    if (voteResults.length === 0) return null;

    const winner = voteResults[0];
    const runnerUp = voteResults[1];

    const margin = runnerUp ? winner.percentage - runnerUp.percentage : winner.percentage;

    // Check if winner meets threshold for electoral system
    if (election.votingSystem === 'majority' && winner.percentage < 50) {
      // Would require runoff election
      return null;
    }

    return {
      candidateId: winner.candidateId,
      margin
    };
  }

  // Analytics calculation methods (simplified implementations)
  private calculateDemocraticHealth(constitution?: Constitution, parties?: PoliticalParty[], elections?: Election[]): GovernanceAnalytics['democraticHealth'] {
    return {
      overallScore: 70 + Math.random() * 20,
      components: {
        electoralProcess: 75 + Math.random() * 15,
        governmentFunctioning: 70 + Math.random() * 20,
        politicalParticipation: 65 + Math.random() * 25,
        politicalCulture: 60 + Math.random() * 30,
        civilLiberties: 80 + Math.random() * 15
      }
    };
  }

  private calculatePoliticalStability(constitution?: Constitution, parties?: PoliticalParty[], elections?: Election[]): GovernanceAnalytics['stability'] {
    return {
      governmentStability: 70 + Math.random() * 20,
      politicalRisk: 30 + Math.random() * 40,
      institutionalStrength: 75 + Math.random() * 20,
      ruleOfLaw: 80 + Math.random() * 15
    };
  }

  private calculateElectoralMetrics(elections?: Election[]): GovernanceAnalytics['electoralMetrics'] {
    return {
      voterTurnout: 60 + Math.random() * 25,
      competitiveness: 15 + Math.random() * 20,
      partySystemFragmentation: 30 + Math.random() * 40,
      incumbentAdvantage: 10 + Math.random() * 15
    };
  }

  private calculatePublicTrust(constitution?: Constitution, parties?: PoliticalParty[], elections?: Election[]): GovernanceAnalytics['publicTrust'] {
    return {
      government: 45 + Math.random() * 30,
      legislature: 40 + Math.random() * 25,
      judiciary: 60 + Math.random() * 25,
      elections: 70 + Math.random() * 20,
      politicalParties: 35 + Math.random() * 30
    };
  }

  private calculateRepresentationQuality(parties?: PoliticalParty[], voters?: VoterProfile[]): GovernanceAnalytics['representation'] {
    return {
      descriptiveRepresentation: 60 + Math.random() * 25,
      substantiveRepresentation: 55 + Math.random() * 30,
      responsiveness: 50 + Math.random() * 35,
      accountability: 65 + Math.random() * 25
    };
  }

  private calculatePolicyEffectiveness(countryId: string): GovernanceAnalytics['policyEffectiveness'] {
    return {
      economicPolicy: 60 + Math.random() * 25,
      socialPolicy: 55 + Math.random() * 30,
      foreignPolicy: 50 + Math.random() * 35,
      environmentalPolicy: 45 + Math.random() * 40
    };
  }

  private calculateGovernanceTrends(countryId: string): GovernanceAnalytics['trends'] {
    const trends: ('increasing' | 'decreasing' | 'stable')[] = ['increasing', 'decreasing', 'stable'];
    
    return {
      polarization: { current: 40 + Math.random() * 40, trend: trends[Math.floor(Math.random() * 3)] },
      participation: { current: 60 + Math.random() * 25, trend: trends[Math.floor(Math.random() * 3)] },
      trust: { current: 45 + Math.random() * 30, trend: trends[Math.floor(Math.random() * 3)] },
      stability: { current: 70 + Math.random() * 20, trend: trends[Math.floor(Math.random() * 3)] }
    };
  }

  // System update methods
  private updatePartyApprovals(): void {
    this.politicalParties.forEach(party => {
      // Simulate approval changes
      const change = (Math.random() - 0.5) * 5; // ±2.5% change
      party.approval.overall = Math.max(10, Math.min(90, party.approval.overall + change));
      
      // Update trending
      if (change > 1) party.approval.trending = 'up';
      else if (change < -1) party.approval.trending = 'down';
      else party.approval.trending = 'stable';
    });
  }

  private processElections(): void {
    const now = new Date();
    this.elections.forEach(election => {
      if (election.status === 'scheduled' && election.electionDate <= now) {
        this.conductElection(election.id);
      }
    });
  }

  private updateLegislativeSessions(): void {
    this.legislativeSessions.forEach(session => {
      if (session.status === 'active') {
        // Simulate legislative activity
        session.billsIntroduced += Math.floor(Math.random() * 3);
        session.billsPassed += Math.floor(Math.random() * 2);
        session.publicHearings += Math.floor(Math.random() * 2);
        
        // Update productivity
        session.productivity = session.billsIntroduced > 0 ? 
          (session.billsPassed / session.billsIntroduced) * 100 : 0;
      }
    });
  }

  private updateOfficialApprovals(): void {
    this.governmentOfficials.forEach(official => {
      if (official.status === 'active') {
        // Simulate approval changes
        const change = (Math.random() - 0.5) * 3; // ±1.5% change
        official.approval.overall = Math.max(15, Math.min(85, official.approval.overall + change));
        
        // Update trending
        if (change > 0.5) official.approval.trending = 'up';
        else if (change < -0.5) official.approval.trending = 'down';
        else official.approval.trending = 'stable';
      }
    });
  }

  private generatePoliticalEvents(): void {
    // Randomly generate political events
    if (Math.random() < 0.1) { // 10% chance per time step
      const eventTypes = ['scandal', 'policy_announcement', 'coalition_formed', 'party_split'];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      this.logGovernanceEvent({
        type: eventType,
        description: `Random ${eventType} event occurred`,
        timestamp: new Date()
      });
    }
  }

  private logGovernanceEvent(event: any): void {
    this.governanceEvents.push({
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    });
    
    // Keep only last 1000 events
    if (this.governanceEvents.length > 1000) {
      this.governanceEvents = this.governanceEvents.slice(-1000);
    }
  }

  // Public getter methods
  getAllConstitutions(): Constitution[] { return Array.from(this.constitutions.values()); }
  getConstitution(id: string): Constitution | undefined { return this.constitutions.get(id); }
  getAllPoliticalParties(): PoliticalParty[] { return Array.from(this.politicalParties.values()); }
  getPoliticalParty(id: string): PoliticalParty | undefined { return this.politicalParties.get(id); }
  getAllElections(): Election[] { return Array.from(this.elections.values()); }
  getElection(id: string): Election | undefined { return this.elections.get(id); }
  getAllLegislativeSessions(): LegislativeSession[] { return Array.from(this.legislativeSessions.values()); }
  getLegislativeSession(id: string): LegislativeSession | undefined { return this.legislativeSessions.get(id); }
  getAllVoterProfiles(): VoterProfile[] { return Array.from(this.voterProfiles.values()); }
  getVoterProfile(id: string): VoterProfile | undefined { return this.voterProfiles.get(id); }
  getAllGovernmentOfficials(): GovernmentOfficial[] { return Array.from(this.governmentOfficials.values()); }
  getGovernmentOfficial(id: string): GovernmentOfficial | undefined { return this.governmentOfficials.get(id); }
  getGovernanceEvents(limit?: number): any[] { 
    return limit ? this.governanceEvents.slice(-limit) : this.governanceEvents; 
  }
}
