/**
 * Governance System REST API Routes
 * 
 * Provides comprehensive REST API endpoints for the governance and democratic systems.
 * Includes constitutional frameworks, elections, political parties, legislative bodies,
 * and voter psychology integration.
 * 
 * API Endpoints:
 * - GET /api/governance/health - System health check
 * - GET /api/governance/constitution/:countryId - Get country constitution
 * - POST /api/governance/constitution - Create new constitution
 * - POST /api/governance/amendment - Propose constitutional amendment
 * - GET /api/governance/parties - Get all political parties
 * - POST /api/governance/parties - Create new political party
 * - GET /api/governance/elections - Get all elections
 * - POST /api/governance/elections - Schedule new election
 * - POST /api/governance/elections/:id/conduct - Conduct election
 * - GET /api/governance/legislature/:sessionId - Get legislative session
 * - POST /api/governance/legislature - Create legislative session
 * - GET /api/governance/voters - Get voter profiles
 * - POST /api/governance/voters - Create voter profile
 * - GET /api/governance/officials - Get government officials
 * - POST /api/governance/officials - Create government official
 * - GET /api/governance/analytics/:countryId - Get governance analytics
 * - POST /api/governance/simulate - Simulate governance time step
 */

import { Router, Request, Response } from 'express';
import { GovernanceEngine } from './GovernanceEngine.js';
import { 
  Constitution,
  PoliticalParty,
  Election,
  LegislativeSession,
  VoterProfile,
  GovernmentOfficial,
  GOVERNMENT_TYPES,
  ELECTORAL_SYSTEMS
} from './types.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = Router();

// Enhanced AI Knobs for Governance System
const governanceKnobsData = {
  // Democratic Institutions & Processes
  democratic_institution_strength: 0.8,   // Democratic institution strength and independence
  electoral_system_fairness: 0.8,         // Electoral system fairness and representation
  voting_accessibility: 0.8,              // Voting accessibility and participation ease
  
  // Constitutional Framework & Rule of Law
  constitutional_adherence: 0.9,          // Constitutional adherence and respect
  rule_of_law_strength: 0.9,              // Rule of law strength and enforcement
  judicial_independence: 0.9,             // Judicial independence from political influence
  
  // Political Participation & Representation
  citizen_political_engagement: 0.7,      // Citizen political engagement and participation
  minority_representation: 0.7,           // Minority group representation and rights
  political_party_diversity: 0.6,         // Political party diversity and competition
  
  // Government Transparency & Accountability
  government_transparency: 0.8,           // Government transparency and information access
  public_accountability_mechanisms: 0.8,  // Public accountability and oversight mechanisms
  corruption_prevention: 0.8,             // Corruption prevention and anti-corruption measures
  
  // Civil Liberties & Human Rights
  civil_liberties_protection: 0.9,        // Civil liberties and individual rights protection
  freedom_of_expression: 0.8,             // Freedom of expression and speech protection
  freedom_of_assembly: 0.8,               // Freedom of assembly and association protection
  
  // Government Efficiency & Service Delivery
  bureaucratic_efficiency: 0.6,           // Government bureaucratic efficiency and responsiveness
  public_service_quality: 0.7,            // Public service delivery quality and effectiveness
  policy_implementation_effectiveness: 0.7, // Policy implementation effectiveness and follow-through
  
  // Federalism & Decentralization
  federal_state_balance: 0.6,             // Federal-state power balance and distribution
  local_government_autonomy: 0.7,         // Local government autonomy and decision-making power
  subsidiarity_principle: 0.6,            // Subsidiarity principle application and respect
  
  // Crisis Management & Emergency Powers
  emergency_response_capability: 0.8,     // Government emergency response capability
  crisis_leadership_effectiveness: 0.7,   // Crisis leadership and decision-making effectiveness
  emergency_powers_limitation: 0.8,       // Emergency powers limitation and oversight
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Governance
const governanceKnobSystem = new EnhancedKnobSystem(governanceKnobsData);

// Apply governance knobs to game state
function applyGovernanceKnobsToGameState() {
  const knobs = governanceKnobSystem.knobs;
  
  // Apply democratic institutions settings
  const democraticInstitutions = (knobs.democratic_institution_strength + knobs.electoral_system_fairness + 
    knobs.voting_accessibility) / 3;
  
  // Apply constitutional framework settings
  const constitutionalFramework = (knobs.constitutional_adherence + knobs.rule_of_law_strength + 
    knobs.judicial_independence) / 3;
  
  // Apply political participation settings
  const politicalParticipation = (knobs.citizen_political_engagement + knobs.minority_representation + 
    knobs.political_party_diversity) / 3;
  
  // Apply transparency and accountability settings
  const transparencyAccountability = (knobs.government_transparency + knobs.public_accountability_mechanisms + 
    knobs.corruption_prevention) / 3;
  
  // Apply civil liberties settings
  const civilLiberties = (knobs.civil_liberties_protection + knobs.freedom_of_expression + 
    knobs.freedom_of_assembly) / 3;
  
  // Apply government efficiency settings
  const governmentEfficiency = (knobs.bureaucratic_efficiency + knobs.public_service_quality + 
    knobs.policy_implementation_effectiveness) / 3;
  
  console.log('Applied governance knobs to game state:', {
    democraticInstitutions,
    constitutionalFramework,
    politicalParticipation,
    transparencyAccountability,
    civilLiberties,
    governmentEfficiency
  });
}

// Initialize governance engine
const governanceEngine = new GovernanceEngine();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: 'Governance & Democratic Systems Engine',
      version: '1.0.0',
      components: {
        governanceEngine: 'operational',
        constitutionalFramework: 'operational',
        electoralSystem: 'operational',
        politicalParties: 'operational',
        legislativeSystem: 'operational',
        voterProfiles: 'operational',
        governmentOfficials: 'operational'
      },
      metrics: {
        totalConstitutions: governanceEngine.getAllConstitutions().length,
        totalParties: governanceEngine.getAllPoliticalParties().length,
        totalElections: governanceEngine.getAllElections().length,
        totalVoters: governanceEngine.getAllVoterProfiles().length,
        totalOfficials: governanceEngine.getAllGovernmentOfficials().length,
        systemUptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      }
    };

    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Governance system health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get constitution for a country
 */
router.get('/constitution/:countryId', (req: Request, res: Response) => {
  try {
    const { countryId } = req.params;
    
    const constitution = governanceEngine.getAllConstitutions()
      .find(c => c.countryId === countryId);

    if (!constitution) {
      return res.status(404).json({
        error: 'Constitution not found',
        message: `No constitution found for country: ${countryId}`
      });
    }

    res.json({
      constitution,
      governmentType: GOVERNMENT_TYPES[constitution.governmentType.toUpperCase() as keyof typeof GOVERNMENT_TYPES],
      ratificationStatus: constitution.ratificationStatus,
      publicSupport: constitution.publicSupport,
      amendmentCount: constitution.amendments.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get constitution',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new constitution
 */
router.post('/constitution', (req: Request, res: Response) => {
  try {
    const {
      name,
      countryId,
      governmentType,
      foundingPrinciples,
      executiveStructure,
      legislativeStructure,
      judicialStructure,
      billOfRights,
      federalStructure
    } = req.body;

    if (!name || !countryId || !governmentType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name, countryId, and governmentType are required'
      });
    }

    const constitution = governanceEngine.createConstitution({
      name,
      countryId,
      governmentType,
      foundingPrinciples: foundingPrinciples || [],
      executiveStructure: executiveStructure || {
        headOfState: 'president',
        headOfGovernment: 'president',
        termLength: 4,
        electionMethod: 'direct',
        powers: ['Execute laws', 'Command military', 'Foreign policy']
      },
      legislativeStructure: legislativeStructure || {
        structure: 'bicameral',
        chambers: [{
          name: 'House of Representatives',
          seats: 435,
          termLength: 2,
          electionMethod: 'direct',
          powers: ['Pass laws', 'Control budget'],
          leadership: { speakerTitle: 'Speaker', electionMethod: 'internal' }
        }],
        legislativeProcess: {
          billIntroduction: ['Any member'],
          committeeSystem: true,
          votingThresholds: { simple: 51, supermajority: 67, constitutional: 75 }
        }
      },
      judicialStructure: judicialStructure || {
        structure: 'unified',
        courts: [{
          level: 'supreme',
          name: 'Supreme Court',
          jurisdiction: ['Constitutional review'],
          judgeSelection: 'appointed',
          judges: 9
        }],
        judicialReview: true,
        independenceGuarantees: ['Life tenure', 'Salary protection']
      },
      billOfRights: billOfRights || [{
        category: 'Civil Liberties',
        rights: ['Freedom of speech', 'Freedom of religion', 'Due process']
      }],
      federalStructure
    });

    res.status(201).json({
      message: 'Constitution created successfully',
      constitution,
      governmentTypeInfo: GOVERNMENT_TYPES[governmentType.toUpperCase() as keyof typeof GOVERNMENT_TYPES]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create constitution',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Propose constitutional amendment
 */
router.post('/amendment', (req: Request, res: Response) => {
  try {
    const {
      constitutionId,
      title,
      text,
      purpose,
      proposalMethod
    } = req.body;

    if (!constitutionId || !title || !text) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'constitutionId, title, and text are required'
      });
    }

    const amendment = governanceEngine.proposeAmendment({
      constitutionId,
      title,
      text,
      purpose: purpose || 'Constitutional improvement',
      proposalMethod: proposalMethod || 'Legislative proposal'
    });

    res.status(201).json({
      message: 'Constitutional amendment proposed successfully',
      amendment
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to propose amendment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all political parties
 */
router.get('/parties', (req: Request, res: Response) => {
  try {
    const { 
      countryId,
      status = 'active',
      limit = 20,
      offset = 0,
      sortBy = 'founded',
      sortOrder = 'desc'
    } = req.query;

    let parties = governanceEngine.getAllPoliticalParties();

    // Apply filters
    if (countryId) {
      parties = parties.filter(p => p.countryId === countryId);
    }
    
    if (status) {
      parties = parties.filter(p => p.status === status);
    }

    // Apply sorting
    parties.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'founded':
          aVal = a.founded.getTime();
          bVal = b.founded.getTime();
          break;
        case 'approval':
          aVal = a.approval.overall;
          bVal = b.approval.overall;
          break;
        case 'membership':
          aVal = a.membership.total;
          bVal = b.membership.total;
          break;
        default:
          aVal = a.founded.getTime();
          bVal = b.founded.getTime();
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedParties = parties.slice(startIndex, endIndex);

    res.json({
      parties: paginatedParties,
      pagination: {
        total: parties.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < parties.length
      },
      summary: {
        totalParties: parties.length,
        byStatus: parties.reduce((acc: any, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {}),
        averageApproval: parties.length > 0 ? 
          parties.reduce((sum, p) => sum + p.approval.overall, 0) / parties.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get political parties',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new political party
 */
router.post('/parties', (req: Request, res: Response) => {
  try {
    const {
      name,
      abbreviation,
      countryId,
      ideology,
      politicalSpectrum,
      platform,
      leadership
    } = req.body;

    if (!name || !countryId || !ideology) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name, countryId, and ideology are required'
      });
    }

    const party = governanceEngine.createPoliticalParty({
      name,
      abbreviation: abbreviation || name.substring(0, 3).toUpperCase(),
      countryId,
      ideology: Array.isArray(ideology) ? ideology : [ideology],
      politicalSpectrum: politicalSpectrum || {
        economic: 0,
        social: 0,
        foreign: 0
      },
      platform: platform || [{
        category: 'General',
        positions: [{
          issue: 'Government Reform',
          stance: 'Support democratic principles',
          priority: 5
        }]
      }],
      leadership: leadership || {
        chairperson: 'TBD',
        secretary: 'TBD',
        treasurer: 'TBD',
        spokesperson: 'TBD'
      }
    });

    res.status(201).json({
      message: 'Political party created successfully',
      party,
      politicalSpectrum: party.politicalSpectrum,
      initialMembership: party.membership.total
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create political party',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all elections
 */
router.get('/elections', (req: Request, res: Response) => {
  try {
    const { 
      countryId,
      type,
      status,
      limit = 20,
      offset = 0,
      sortBy = 'electionDate',
      sortOrder = 'desc'
    } = req.query;

    let elections = governanceEngine.getAllElections();

    // Apply filters
    if (countryId) {
      elections = elections.filter(e => e.countryId === countryId);
    }
    
    if (type) {
      elections = elections.filter(e => e.type === type);
    }
    
    if (status) {
      elections = elections.filter(e => e.status === status);
    }

    // Apply sorting
    elections.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'electionDate':
          aVal = a.electionDate.getTime();
          bVal = b.electionDate.getTime();
          break;
        case 'eligibleVoters':
          aVal = a.eligibleVoters;
          bVal = b.eligibleVoters;
          break;
        case 'expectedTurnout':
          aVal = a.expectedTurnout;
          bVal = b.expectedTurnout;
          break;
        default:
          aVal = a.electionDate.getTime();
          bVal = b.electionDate.getTime();
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedElections = elections.slice(startIndex, endIndex);

    res.json({
      elections: paginatedElections,
      pagination: {
        total: elections.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < elections.length
      },
      summary: {
        totalElections: elections.length,
        byType: elections.reduce((acc: any, e) => {
          acc[e.type] = (acc[e.type] || 0) + 1;
          return acc;
        }, {}),
        byStatus: elections.reduce((acc: any, e) => {
          acc[e.status] = (acc[e.status] || 0) + 1;
          return acc;
        }, {}),
        upcomingElections: elections.filter(e => 
          e.electionDate > new Date() && e.status === 'scheduled'
        ).length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get elections',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Schedule new election
 */
router.post('/elections', (req: Request, res: Response) => {
  try {
    const {
      name,
      countryId,
      type,
      office,
      electionDate,
      votingSystem,
      candidates,
      eligibleVoters
    } = req.body;

    if (!name || !countryId || !type || !office || !electionDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name, countryId, type, office, and electionDate are required'
      });
    }

    const election = governanceEngine.scheduleElection({
      name,
      countryId,
      type,
      office,
      electionDate: new Date(electionDate),
      votingSystem: votingSystem || 'plurality',
      candidates: candidates || [],
      eligibleVoters: eligibleVoters || 1000000
    });

    res.status(201).json({
      message: 'Election scheduled successfully',
      election,
      electoralSystem: ELECTORAL_SYSTEMS[election.votingSystem.toUpperCase() as keyof typeof ELECTORAL_SYSTEMS],
      campaignPeriod: election.campaignPeriod,
      registrationDeadline: election.registrationDeadline
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to schedule election',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Conduct election
 */
router.post('/elections/:id/conduct', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const election = governanceEngine.conductElection(id);

    res.json({
      message: 'Election conducted successfully',
      election,
      results: election.results,
      winner: election.results?.winner ? {
        candidateId: election.results.winner,
        candidate: election.candidates.find(c => c.id === election.results?.winner)
      } : null,
      turnoutAnalysis: {
        expectedTurnout: election.expectedTurnout,
        actualTurnout: election.results?.turnout,
        difference: election.results ? election.results.turnout - election.expectedTurnout : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to conduct election',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get legislative session
 */
router.get('/legislature/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = governanceEngine.getLegislativeSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Legislative session not found',
        message: `No legislative session found with ID: ${sessionId}`
      });
    }

    res.json({
      session,
      productivity: {
        billsIntroduced: session.billsIntroduced,
        billsPassed: session.billsPassed,
        billsFailed: session.billsFailed,
        successRate: session.billsIntroduced > 0 ? 
          (session.billsPassed / session.billsIntroduced) * 100 : 0
      },
      partyControl: session.partyComposition.find(p => p.leadership),
      committeeCount: session.committees.length,
      publicEngagement: {
        hearings: session.publicHearings,
        testimony: session.citizenTestimony,
        mediaAttention: session.mediaAttention
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get legislative session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create legislative session
 */
router.post('/legislature', (req: Request, res: Response) => {
  try {
    const {
      chamber,
      sessionNumber,
      startDate,
      members,
      partyComposition
    } = req.body;

    if (!chamber || !sessionNumber || !startDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'chamber, sessionNumber, and startDate are required'
      });
    }

    const session = governanceEngine.createLegislativeSession({
      chamber,
      sessionNumber,
      startDate: new Date(startDate),
      members: members || [],
      partyComposition: partyComposition || []
    });

    res.status(201).json({
      message: 'Legislative session created successfully',
      session,
      agenda: session.agenda,
      committees: session.committees,
      memberCount: session.members.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create legislative session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get voter profiles
 */
router.get('/voters', (req: Request, res: Response) => {
  try {
    const { 
      votingDistrict,
      partyAffiliation,
      eligible,
      registered,
      limit = 50,
      offset = 0
    } = req.query;

    let voters = governanceEngine.getAllVoterProfiles();

    // Apply filters
    if (votingDistrict) {
      voters = voters.filter(v => v.votingDistrict === votingDistrict);
    }
    
    if (partyAffiliation) {
      voters = voters.filter(v => v.partyAffiliation === partyAffiliation);
    }
    
    if (eligible !== undefined) {
      voters = voters.filter(v => v.eligible === (eligible === 'true'));
    }
    
    if (registered !== undefined) {
      voters = voters.filter(v => v.registered === (registered === 'true'));
    }

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedVoters = voters.slice(startIndex, endIndex);

    res.json({
      voters: paginatedVoters,
      pagination: {
        total: voters.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < voters.length
      },
      analytics: {
        totalVoters: voters.length,
        eligibilityRate: voters.length > 0 ? 
          (voters.filter(v => v.eligible).length / voters.length) * 100 : 0,
        registrationRate: voters.length > 0 ? 
          (voters.filter(v => v.registered).length / voters.length) * 100 : 0,
        averageTurnoutProbability: voters.length > 0 ? 
          voters.reduce((sum, v) => sum + v.turnoutProbability, 0) / voters.length : 0,
        partyAffiliationDistribution: voters.reduce((acc: any, v) => {
          const party = v.partyAffiliation || 'Independent';
          acc[party] = (acc[party] || 0) + 1;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get voter profiles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create voter profile
 */
router.post('/voters', (req: Request, res: Response) => {
  try {
    const {
      citizenId,
      psychologyId,
      demographics,
      votingDistrict
    } = req.body;

    if (!citizenId || !psychologyId || !demographics || !votingDistrict) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'citizenId, psychologyId, demographics, and votingDistrict are required'
      });
    }

    const voterProfile = governanceEngine.createVoterProfile({
      citizenId,
      psychologyId,
      demographics,
      votingDistrict
    });

    res.status(201).json({
      message: 'Voter profile created successfully',
      voterProfile,
      eligibility: {
        eligible: voterProfile.eligible,
        registered: voterProfile.registered,
        turnoutProbability: voterProfile.turnoutProbability
      },
      politicalProfile: {
        leanings: voterProfile.politicalLeanings,
        partyAffiliation: voterProfile.partyAffiliation,
        swingPotential: voterProfile.voteSwingPotential
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create voter profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get government officials
 */
router.get('/officials', (req: Request, res: Response) => {
  try {
    const { 
      office,
      level,
      branch,
      status = 'active',
      limit = 20,
      offset = 0
    } = req.query;

    let officials = governanceEngine.getAllGovernmentOfficials();

    // Apply filters
    if (office) {
      officials = officials.filter(o => o.office.toLowerCase().includes((office as string).toLowerCase()));
    }
    
    if (level) {
      officials = officials.filter(o => o.level === level);
    }
    
    if (branch) {
      officials = officials.filter(o => o.branch === branch);
    }
    
    if (status) {
      officials = officials.filter(o => o.status === status);
    }

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedOfficials = officials.slice(startIndex, endIndex);

    res.json({
      officials: paginatedOfficials,
      pagination: {
        total: officials.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < officials.length
      },
      summary: {
        totalOfficials: officials.length,
        byBranch: officials.reduce((acc: any, o) => {
          acc[o.branch] = (acc[o.branch] || 0) + 1;
          return acc;
        }, {}),
        byLevel: officials.reduce((acc: any, o) => {
          acc[o.level] = (acc[o.level] || 0) + 1;
          return acc;
        }, {}),
        averageApproval: officials.length > 0 ? 
          officials.reduce((sum, o) => sum + o.approval.overall, 0) / officials.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get government officials',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create government official
 */
router.post('/officials', (req: Request, res: Response) => {
  try {
    const {
      citizenId,
      psychologyId,
      office,
      title,
      level,
      branch,
      termStart,
      termEnd,
      electedAppointed,
      partyId
    } = req.body;

    if (!citizenId || !psychologyId || !office || !title || !level || !branch || !termStart || !termEnd || !electedAppointed) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'citizenId, psychologyId, office, title, level, branch, termStart, termEnd, and electedAppointed are required'
      });
    }

    const official = governanceEngine.createGovernmentOfficial({
      citizenId,
      psychologyId,
      office,
      title,
      level,
      branch,
      termStart: new Date(termStart),
      termEnd: new Date(termEnd),
      electedAppointed,
      partyId
    });

    res.status(201).json({
      message: 'Government official created successfully',
      official,
      termInfo: {
        termLength: Math.floor((official.termEnd.getTime() - official.termStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
        daysRemaining: Math.floor((official.termEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      },
      politicalProfile: {
        alignment: official.politicalAlignment,
        partyAffiliation: official.partyId
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create government official',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get governance analytics for a country
 */
router.get('/analytics/:countryId', (req: Request, res: Response) => {
  try {
    const { countryId } = req.params;
    
    const analytics = governanceEngine.generateGovernanceAnalytics(countryId);

    res.json({
      message: 'Governance analytics generated successfully',
      analytics,
      summary: {
        democraticHealthScore: analytics.democraticHealth.overallScore,
        stabilityScore: analytics.stability.governmentStability,
        publicTrustAverage: Object.values(analytics.publicTrust).reduce((sum, val) => sum + val, 0) / Object.values(analytics.publicTrust).length,
        representationQuality: Object.values(analytics.representation).reduce((sum, val) => sum + val, 0) / Object.values(analytics.representation).length
      },
      recommendations: this.generateGovernanceRecommendations(analytics)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate governance analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Simulate governance system time step
 */
router.post('/simulate', (req: Request, res: Response) => {
  try {
    const { steps = 1 } = req.body;

    const results = [];
    for (let i = 0; i < steps; i++) {
      governanceEngine.simulateTimeStep();
      results.push({
        step: i + 1,
        timestamp: new Date(),
        constitutionCount: governanceEngine.getAllConstitutions().length,
        partyCount: governanceEngine.getAllPoliticalParties().length,
        electionCount: governanceEngine.getAllElections().length,
        eventCount: governanceEngine.getGovernanceEvents(10).length
      });
    }

    res.json({
      message: `Governance simulation completed for ${steps} time step(s)`,
      results,
      totalSteps: steps,
      completedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to simulate governance system',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to generate governance recommendations
function generateGovernanceRecommendations(analytics: any): string[] {
  const recommendations: string[] = [];
  
  if (analytics.democraticHealth.overallScore < 60) {
    recommendations.push('Consider electoral reforms to strengthen democratic processes');
  }
  
  if (analytics.stability.politicalRisk > 60) {
    recommendations.push('Implement measures to reduce political risk and instability');
  }
  
  if (analytics.publicTrust.government < 40) {
    recommendations.push('Focus on transparency and accountability to rebuild public trust');
  }
  
  if (analytics.electoralMetrics.voterTurnout < 50) {
    recommendations.push('Develop voter engagement initiatives to increase participation');
  }
  
  if (analytics.representation.responsiveness < 50) {
    recommendations.push('Improve mechanisms for government responsiveness to public opinion');
  }
  
  return recommendations;
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'governance', governanceKnobSystem, applyGovernanceKnobsToGameState);

export default router;
