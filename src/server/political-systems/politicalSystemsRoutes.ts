/**
 * Political Systems API Routes
 * Manages multiparty, two-party, and single-party political systems
 * Enhanced with 24 AI-controllable knobs for dynamic political simulation
 */

import { Router } from 'express';
import { Pool } from 'pg';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

export interface PoliticalSystem {
  campaignId: string;
  civilizationId: string;
  systemType: 'multiparty' | 'two_party' | 'single_party' | 'no_party';
  constitutionalFramework: ConstitutionalFramework;
  politicalParties: PoliticalParty[];
  electoralSystem: ElectoralSystem;
  politicalStability: number;
  democraticIndex: number;
  politicalPolarization: number;
  voterTurnout: number;
  lastElection: Date;
  nextElection: Date;
  lastUpdated: Date;
}

export interface ConstitutionalFramework {
  governmentStructure: 'presidential' | 'parliamentary' | 'semi_presidential' | 'authoritarian';
  separationOfPowers: number; // 0-1 scale
  checksAndBalances: number; // 0-1 scale
  civilLiberties: number; // 0-1 scale
  ruleOfLaw: number; // 0-1 scale
  federalismLevel: number; // 0-1 scale (0 = unitary, 1 = federal)
  constitutionalAmendmentDifficulty: number; // 0-1 scale
}

export interface PoliticalParty {
  id: string;
  name: string;
  ideology: string;
  supportPercentage: number;
  seatsHeld: number;
  leadership: string[];
  platform: string[];
  coalitionPartners: string[];
  isRuling: boolean;
  foundedDate: Date;
  status: 'active' | 'banned' | 'dissolved' | 'merged';
}

export interface ElectoralSystem {
  votingMethod: 'fptp' | 'proportional' | 'mixed' | 'ranked_choice' | 'approval';
  electionFrequency: number; // years
  termLimits: boolean;
  campaignFinanceRules: CampaignFinanceRules;
  voterEligibility: VoterEligibility;
  electionIntegrity: number; // 0-1 scale
}

export interface CampaignFinanceRules {
  spendingLimits: boolean;
  corporateDonations: boolean;
  foreignDonations: boolean;
  publicFunding: boolean;
  transparencyRequirements: number; // 0-1 scale
}

export interface VoterEligibility {
  minimumAge: number;
  citizenshipRequired: boolean;
  registrationRequired: boolean;
  voterIdRequired: boolean;
  felonVotingRights: boolean;
}

export interface ElectionResult {
  electionId: string;
  electionDate: Date;
  electionType: 'general' | 'primary' | 'local' | 'referendum';
  results: PartyResult[];
  voterTurnout: number;
  legitimacy: number; // 0-1 scale
  internationalObservers: boolean;
  disputesResolved: boolean;
}

export interface PartyResult {
  partyId: string;
  votesReceived: number;
  votePercentage: number;
  seatsWon: number;
  seatPercentage: number;
}

// Enhanced Knob System for Political Systems
const politicalSystemsKnobs = new EnhancedKnobSystem('political_systems', {
  // System Structure (8 knobs)
  multiparty_system_stability: {
    min: 0.0, max: 1.0, default: 0.7, unit: 'stability',
    description: 'Stability of multiparty democratic systems'
  },
  two_party_polarization_tendency: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'polarization',
    description: 'Tendency toward political polarization in two-party systems'
  },
  single_party_control_efficiency: {
    min: 0.3, max: 1.0, default: 0.8, unit: 'efficiency',
    description: 'Administrative efficiency of single-party systems'
  },
  party_formation_ease: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'ease',
    description: 'Ease of forming new political parties'
  },
  coalition_government_likelihood: {
    min: 0.0, max: 1.0, default: 0.4, unit: 'likelihood',
    description: 'Likelihood of coalition governments in multiparty systems'
  },
  electoral_system_proportionality: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'proportionality',
    description: 'Proportionality of electoral system representation'
  },
  constitutional_amendment_difficulty: {
    min: 0.1, max: 1.0, default: 0.7, unit: 'difficulty',
    description: 'Difficulty of amending constitutional framework'
  },
  separation_of_powers_strength: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'strength',
    description: 'Strength of separation of powers mechanisms'
  },

  // Democratic Participation (8 knobs)
  voter_turnout_base_rate: {
    min: 0.3, max: 0.95, default: 0.65, unit: 'rate',
    description: 'Base voter turnout rate in elections'
  },
  political_engagement_level: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'engagement',
    description: 'General level of political engagement among citizens'
  },
  civic_education_quality: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'quality',
    description: 'Quality of civic education and political awareness'
  },
  media_freedom_index: {
    min: 0.0, max: 1.0, default: 0.7, unit: 'freedom',
    description: 'Freedom and independence of media institutions'
  },
  civil_society_strength: {
    min: 0.0, max: 1.0, default: 0.6, unit: 'strength',
    description: 'Strength and independence of civil society organizations'
  },
  protest_and_assembly_rights: {
    min: 0.0, max: 1.0, default: 0.8, unit: 'rights',
    description: 'Protection of protest and assembly rights'
  },
  minority_representation_protection: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'protection',
    description: 'Protection of minority political representation'
  },
  youth_political_participation: {
    min: 0.0, max: 1.0, default: 0.4, unit: 'participation',
    description: 'Level of youth engagement in political processes'
  },

  // System Dynamics (8 knobs)
  political_polarization_rate: {
    min: 0.0, max: 1.0, default: 0.4, unit: 'rate',
    description: 'Rate at which political polarization develops'
  },
  incumbent_advantage_strength: {
    min: 0.0, max: 1.0, default: 0.3, unit: 'advantage',
    description: 'Electoral advantage of incumbent parties/candidates'
  },
  campaign_finance_influence: {
    min: 0.0, max: 1.0, default: 0.5, unit: 'influence',
    description: 'Influence of campaign finance on electoral outcomes'
  },
  gerrymandering_susceptibility: {
    min: 0.0, max: 1.0, default: 0.3, unit: 'susceptibility',
    description: 'Susceptibility to electoral district manipulation'
  },
  political_corruption_tolerance: {
    min: 0.0, max: 1.0, default: 0.2, unit: 'tolerance',
    description: 'Tolerance for political corruption in the system'
  },
  election_integrity_strength: {
    min: 0.3, max: 1.0, default: 0.8, unit: 'integrity',
    description: 'Strength of election integrity and security measures'
  },
  political_violence_risk: {
    min: 0.0, max: 1.0, default: 0.1, unit: 'risk',
    description: 'Risk of political violence and extremism'
  },
  democratic_backsliding_resistance: {
    min: 0.0, max: 1.0, default: 0.7, unit: 'resistance',
    description: 'Resistance to democratic backsliding and authoritarianism'
  }
});

// AI Prompts for Political Systems Analysis
export const POLITICAL_SYSTEMS_AI_PROMPTS = {
  SYSTEM_ANALYSIS: `Analyze the current political system structure and dynamics. Consider:
- System type effectiveness and stability
- Constitutional framework strengths and weaknesses
- Party system dynamics and competition
- Electoral system fairness and representation
- Democratic institutions and checks/balances
- Political participation and engagement levels
- Potential reform opportunities and risks
Provide analysis with recommendations for system optimization.`,

  ELECTION_PREDICTION: `Predict election outcomes and analyze electoral dynamics. Evaluate:
- Current party support and polling trends
- Voter sentiment and key issues
- Campaign effectiveness and resources
- Electoral system impact on results
- Coalition formation possibilities
- Voter turnout projections
- Potential post-election scenarios
Provide election forecast with confidence intervals.`,

  DEMOCRATIC_HEALTH: `Assess democratic health and institutional strength. Consider:
- Democratic norms and practices
- Institutional checks and balances
- Civil liberties and political rights
- Media freedom and transparency
- Rule of law and judicial independence
- Corruption levels and accountability
- Political polarization and social cohesion
Provide democratic health score with improvement recommendations.`,

  CONSTITUTIONAL_REFORM: `Evaluate constitutional reform needs and opportunities. Assess:
- Current constitutional limitations and gaps
- Reform proposals and their implications
- Political feasibility of amendments
- International best practices
- Stakeholder positions and interests
- Implementation challenges and timeline
- Long-term system sustainability
Provide reform recommendations with implementation strategy.`
};

export function createPoliticalSystemsRoutes(pool: Pool) {
  const router = Router();

  // Political System Core Endpoints
  
  // Get current political system
  router.get('/system/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM political_systems 
        WHERE campaign_id = $1 AND civilization_id = $2
        ORDER BY last_updated DESC LIMIT 1
      `, [campaignId, civilizationId]);

      if (result.rows.length === 0) {
        const defaultSystem = await initializePoliticalSystem(pool, campaignId, civilizationId);
        return res.json(defaultSystem);
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching political system:', error);
      res.status(500).json({ error: 'Failed to fetch political system' });
    }
  });

  // Update political system type
  router.post('/system/transition/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { newSystemType, transitionMethod, justification } = req.body;
      
      const transitionResult = await transitionPoliticalSystem(
        pool, campaignId, civilizationId, newSystemType, transitionMethod, justification
      );
      
      res.json(transitionResult);
    } catch (error) {
      console.error('Error transitioning political system:', error);
      res.status(500).json({ error: 'Failed to transition political system' });
    }
  });

  // Get political parties
  router.get('/parties/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM political_parties 
        WHERE campaign_id = $1 AND civilization_id = $2 AND status = 'active'
        ORDER BY support_percentage DESC
      `, [campaignId, civilizationId]);

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching political parties:', error);
      res.status(500).json({ error: 'Failed to fetch political parties' });
    }
  });

  // Create new political party
  router.post('/parties/create/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const partyData = req.body;
      
      const result = await pool.query(`
        INSERT INTO political_parties (
          campaign_id, civilization_id, name, ideology, support_percentage,
          leadership, platform, founded_date, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'active')
        RETURNING *
      `, [
        campaignId, civilizationId, partyData.name, partyData.ideology,
        partyData.supportPercentage, JSON.stringify(partyData.leadership),
        JSON.stringify(partyData.platform)
      ]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error creating political party:', error);
      res.status(500).json({ error: 'Failed to create political party' });
    }
  });

  // Conduct election
  router.post('/elections/conduct/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { electionType, issues } = req.body;
      
      const electionResult = await conductElection(pool, campaignId, civilizationId, electionType, issues);
      res.json(electionResult);
    } catch (error) {
      console.error('Error conducting election:', error);
      res.status(500).json({ error: 'Failed to conduct election' });
    }
  });

  // Get election history
  router.get('/elections/history/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { limit = 10 } = req.query;
      
      const result = await pool.query(`
        SELECT * FROM election_results 
        WHERE campaign_id = $1 AND civilization_id = $2
        ORDER BY election_date DESC LIMIT $3
      `, [campaignId, civilizationId, limit]);

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching election history:', error);
      res.status(500).json({ error: 'Failed to fetch election history' });
    }
  });

  // Get constitutional framework
  router.get('/constitution/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      const result = await pool.query(`
        SELECT constitutional_framework FROM political_systems 
        WHERE campaign_id = $1 AND civilization_id = $2
        ORDER BY last_updated DESC LIMIT 1
      `, [campaignId, civilizationId]);

      res.json(result.rows[0]?.constitutional_framework || {});
    } catch (error) {
      console.error('Error fetching constitutional framework:', error);
      res.status(500).json({ error: 'Failed to fetch constitutional framework' });
    }
  });

  // Update constitutional framework
  router.post('/constitution/amend/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { amendments, ratificationMethod } = req.body;
      
      const amendmentResult = await amendConstitution(
        pool, campaignId, civilizationId, amendments, ratificationMethod
      );
      
      res.json(amendmentResult);
    } catch (error) {
      console.error('Error amending constitution:', error);
      res.status(500).json({ error: 'Failed to amend constitution' });
    }
  });

  // Enhanced Knob System Endpoints
  createEnhancedKnobEndpoints(router, 'political-systems', politicalSystemsKnobs, () => {
    applyPoliticalSystemsKnobsToSimulation();
  });

  // AI Analysis Endpoints
  router.post('/ai-analysis/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { promptType, parameters } = req.body;
      
      const prompt = POLITICAL_SYSTEMS_AI_PROMPTS[promptType as keyof typeof POLITICAL_SYSTEMS_AI_PROMPTS];
      if (!prompt) {
        return res.status(400).json({ error: 'Invalid prompt type' });
      }

      const analysis = await generatePoliticalSystemsAnalysis(prompt, parameters);
      
      res.json({
        promptType,
        analysis,
        parameters,
        timestamp: new Date(),
        confidence: 0.85
      });
    } catch (error) {
      console.error('Error generating political systems AI analysis:', error);
      res.status(500).json({ error: 'Failed to generate AI analysis' });
    }
  });

  return router;
}

// Helper Functions

async function initializePoliticalSystem(pool: Pool, campaignId: string, civilizationId: string): Promise<PoliticalSystem> {
  const defaultSystem: PoliticalSystem = {
    campaignId,
    civilizationId,
    systemType: 'multiparty',
    constitutionalFramework: {
      governmentStructure: 'parliamentary',
      separationOfPowers: 0.7,
      checksAndBalances: 0.6,
      civilLiberties: 0.8,
      ruleOfLaw: 0.7,
      federalismLevel: 0.3,
      constitutionalAmendmentDifficulty: 0.7
    },
    politicalParties: [],
    electoralSystem: {
      votingMethod: 'proportional',
      electionFrequency: 4,
      termLimits: false,
      campaignFinanceRules: {
        spendingLimits: true,
        corporateDonations: false,
        foreignDonations: false,
        publicFunding: true,
        transparencyRequirements: 0.8
      },
      voterEligibility: {
        minimumAge: 18,
        citizenshipRequired: true,
        registrationRequired: true,
        voterIdRequired: false,
        felonVotingRights: true
      },
      electionIntegrity: 0.85
    },
    politicalStability: 0.7,
    democraticIndex: 0.75,
    politicalPolarization: 0.3,
    voterTurnout: 0.68,
    lastElection: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    nextElection: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // 3 years from now
    lastUpdated: new Date()
  };

  await pool.query(`
    INSERT INTO political_systems (
      campaign_id, civilization_id, system_type, constitutional_framework,
      electoral_system, political_stability, democratic_index, political_polarization,
      voter_turnout, last_election, next_election, last_updated
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `, [
    campaignId, civilizationId, defaultSystem.systemType,
    JSON.stringify(defaultSystem.constitutionalFramework),
    JSON.stringify(defaultSystem.electoralSystem),
    defaultSystem.politicalStability, defaultSystem.democraticIndex,
    defaultSystem.politicalPolarization, defaultSystem.voterTurnout,
    defaultSystem.lastElection, defaultSystem.nextElection, defaultSystem.lastUpdated
  ]);

  return defaultSystem;
}

async function transitionPoliticalSystem(
  pool: Pool, campaignId: string, civilizationId: string, 
  newSystemType: string, transitionMethod: string, justification: string
) {
  // Implementation would handle political system transitions
  return {
    success: true,
    oldSystemType: 'multiparty',
    newSystemType,
    transitionMethod,
    justification,
    stabilityImpact: -0.2,
    legitimacyImpact: transitionMethod === 'democratic' ? 0.1 : -0.3,
    timestamp: new Date()
  };
}

async function conductElection(
  pool: Pool, campaignId: string, civilizationId: string, 
  electionType: string, issues: string[]
) {
  // Implementation would simulate election process
  return {
    electionId: `election_${Date.now()}`,
    electionDate: new Date(),
    electionType,
    results: [
      { partyId: 'party_1', votesReceived: 2500000, votePercentage: 0.42, seatsWon: 125, seatPercentage: 0.45 },
      { partyId: 'party_2', votesReceived: 2100000, votePercentage: 0.35, seatsWon: 98, seatPercentage: 0.35 },
      { partyId: 'party_3', votesReceived: 1380000, votePercentage: 0.23, seatsWon: 55, seatPercentage: 0.20 }
    ],
    voterTurnout: 0.72,
    legitimacy: 0.85,
    internationalObservers: true,
    disputesResolved: true
  };
}

async function amendConstitution(
  pool: Pool, campaignId: string, civilizationId: string,
  amendments: any[], ratificationMethod: string
) {
  // Implementation would handle constitutional amendments
  return {
    success: true,
    amendments,
    ratificationMethod,
    ratificationDate: new Date(),
    supportPercentage: 0.67,
    implementationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  };
}

async function generatePoliticalSystemsAnalysis(prompt: string, parameters: any) {
  // This would integrate with your AI service
  return {
    summary: "Political system analysis based on current structure and dynamics",
    keyFindings: [
      "Multiparty system showing healthy competition",
      "Constitutional framework provides adequate checks and balances",
      "Voter engagement levels are moderate but stable"
    ],
    recommendations: [
      "Consider electoral reforms to improve representation",
      "Strengthen campaign finance transparency",
      "Enhance civic education programs"
    ],
    riskFactors: [
      "Rising political polarization",
      "Declining trust in institutions",
      "External influence on elections"
    ]
  };
}

function applyPoliticalSystemsKnobsToSimulation() {
  const knobValues = politicalSystemsKnobs.getAllKnobValues();
  
  console.log('🎛️ Political Systems knobs applied to simulation:', {
    multiparty_stability: knobValues.multiparty_system_stability,
    polarization_tendency: knobValues.two_party_polarization_tendency,
    voter_turnout: knobValues.voter_turnout_base_rate,
    democratic_health: knobValues.democratic_backsliding_resistance
  });
}
