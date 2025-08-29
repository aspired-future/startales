import { Pool } from 'pg';
import { Constitution, Amendment } from './types';

export interface ConstitutionCreationParams {
  name: string;
  campaignId: number;
  civilizationId: string;
  governmentType: Constitution['governmentType'];
  foundingPrinciples: string[];
  partySystemType: Constitution['politicalPartySystem']['type'];
  executiveStructure: Constitution['executiveBranch'];
  legislativeStructure: Constitution['legislativeBranch'];
  judicialStructure: Constitution['judicialBranch'];
  billOfRights: Constitution['billOfRights'];
  federalStructure?: Constitution['federalStructure'];
}

export interface AmendmentProposalParams {
  constitutionId: string;
  title: string;
  text: string;
  purpose: string;
  proposalMethod: string;
  proposedBy?: string;
}

export interface ConstitutionalEventParams {
  campaignId: number;
  civilizationId: string;
  constitutionId: string;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  constitutionalImpact?: any;
  stabilityImpact?: number;
  legitimacyImpact?: number;
  publicSupportImpact?: number;
  triggeredBy?: string;
  severity?: number;
}

export class ConstitutionService {
  constructor(private pool: Pool) {}

  /**
   * Create a new constitution
   */
  async createConstitution(params: ConstitutionCreationParams): Promise<Constitution> {
    const client = await this.pool.connect();
    
    try {
      const constitutionId = `constitution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Generate default party system configuration based on type
      const partySystemConfig = this.generatePartySystemConfig(params.partySystemType);
      
      // Generate AI provisions (placeholder for now)
      const aiProvisions = this.generateDefaultAIProvisions();
      
      // Generate constitutional points allocation
      const constitutionalPoints = this.generateDefaultPointsAllocation(params.partySystemType);
      
      const preamble = this.generatePreamble(params.name, params.foundingPrinciples);
      const amendmentProcess = this.generateAmendmentProcess(params.governmentType);
      const emergencyProvisions = this.generateEmergencyProvisions(params.governmentType);

      await client.query(`
        INSERT INTO constitutions (
          id, name, campaign_id, civilization_id, government_type, preamble, founding_principles,
          party_system_type, party_system_description, party_system_constraints,
          party_system_transition_rules, party_system_advantages, party_system_disadvantages,
          party_system_stability_factors, executive_branch, legislative_branch, judicial_branch,
          bill_of_rights, federal_structure, amendment_process, emergency_provisions,
          ai_generated_provisions, constitutional_points, ratification_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      `, [
        constitutionId, params.name, params.campaignId, params.civilizationId, params.governmentType,
        preamble, JSON.stringify(params.foundingPrinciples), params.partySystemType,
        partySystemConfig.description, JSON.stringify(partySystemConfig.constraints),
        JSON.stringify(partySystemConfig.transitionRules), JSON.stringify(partySystemConfig.advantages),
        JSON.stringify(partySystemConfig.disadvantages), JSON.stringify(partySystemConfig.stabilityFactors),
        JSON.stringify(params.executiveStructure), JSON.stringify(params.legislativeStructure),
        JSON.stringify(params.judicialStructure), JSON.stringify(params.billOfRights),
        params.federalStructure ? JSON.stringify(params.federalStructure) : null,
        JSON.stringify(amendmentProcess), JSON.stringify(emergencyProvisions),
        JSON.stringify(aiProvisions), JSON.stringify(constitutionalPoints), 'draft'
      ]);

      // Log constitutional event
      await this.logConstitutionalEvent({
        campaignId: params.campaignId,
        civilizationId: params.civilizationId,
        constitutionId,
        eventType: 'constitution_created',
        eventTitle: `New Constitution Created: ${params.name}`,
        eventDescription: `A new ${params.partySystemType} constitution has been drafted with ${params.governmentType} government structure.`,
        stabilityImpact: 10,
        legitimacyImpact: 15,
        publicSupportImpact: 5,
        severity: 7
      });

      return await this.getConstitutionById(constitutionId);
    } finally {
      client.release();
    }
  }

  /**
   * Get constitution by ID
   */
  async getConstitutionById(constitutionId: string): Promise<Constitution> {
    const result = await this.pool.query(
      'SELECT * FROM constitutions WHERE id = $1',
      [constitutionId]
    );

    if (result.rows.length === 0) {
      throw new Error(`Constitution not found: ${constitutionId}`);
    }

    return this.mapRowToConstitution(result.rows[0]);
  }

  /**
   * Get constitution by civilization
   */
  async getConstitutionByCivilization(campaignId: number, civilizationId: string): Promise<Constitution | null> {
    const result = await this.pool.query(
      'SELECT * FROM constitutions WHERE campaign_id = $1 AND civilization_id = $2 AND ratification_status = $3 ORDER BY adoption_date DESC LIMIT 1',
      [campaignId, civilizationId, 'ratified']
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToConstitution(result.rows[0]);
  }

  /**
   * Get all constitutions for a campaign
   */
  async getConstitutionsByCampaign(campaignId: number): Promise<Constitution[]> {
    const result = await this.pool.query(
      'SELECT * FROM constitutions WHERE campaign_id = $1 ORDER BY adoption_date DESC',
      [campaignId]
    );

    return result.rows.map(row => this.mapRowToConstitution(row));
  }

  /**
   * Update constitution party system
   */
  async updatePartySystem(
    constitutionId: string, 
    newPartySystemType: Constitution['politicalPartySystem']['type'],
    reason: string
  ): Promise<Constitution> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current constitution
      const constitution = await this.getConstitutionById(constitutionId);
      
      // Check if transition is allowed
      const canTransition = constitution.politicalPartySystem.transitionRules.canChangeTo.includes(newPartySystemType);
      if (!canTransition) {
        throw new Error(`Cannot transition from ${constitution.politicalPartySystem.type} to ${newPartySystemType}`);
      }

      // Generate new party system configuration
      const newPartySystemConfig = this.generatePartySystemConfig(newPartySystemType);

      // Update constitution
      await client.query(`
        UPDATE constitutions 
        SET party_system_type = $1, 
            party_system_description = $2,
            party_system_constraints = $3,
            party_system_transition_rules = $4,
            party_system_advantages = $5,
            party_system_disadvantages = $6,
            party_system_stability_factors = $7,
            last_amended = NOW(),
            updated_at = NOW()
        WHERE id = $8
      `, [
        newPartySystemType,
        newPartySystemConfig.description,
        JSON.stringify(newPartySystemConfig.constraints),
        JSON.stringify(newPartySystemConfig.transitionRules),
        JSON.stringify(newPartySystemConfig.advantages),
        JSON.stringify(newPartySystemConfig.disadvantages),
        JSON.stringify(newPartySystemConfig.stabilityFactors),
        constitutionId
      ]);

      // Log constitutional event
      await this.logConstitutionalEvent({
        campaignId: constitution.countryId as any, // This needs to be mapped properly
        civilizationId: constitution.countryId,
        constitutionId,
        eventType: 'party_system_changed',
        eventTitle: `Party System Changed to ${newPartySystemType}`,
        eventDescription: `The political party system has been changed from ${constitution.politicalPartySystem.type} to ${newPartySystemType}. Reason: ${reason}`,
        stabilityImpact: -20,
        legitimacyImpact: -10,
        publicSupportImpact: -15,
        severity: 8
      });

      await client.query('COMMIT');
      return await this.getConstitutionById(constitutionId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Propose constitutional amendment
   */
  async proposeAmendment(params: AmendmentProposalParams): Promise<Amendment> {
    const client = await this.pool.connect();
    
    try {
      const amendmentId = `amendment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Get next amendment number
      const result = await client.query(
        'SELECT COALESCE(MAX(amendment_number), 0) + 1 as next_number FROM constitutional_amendments WHERE constitution_id = $1',
        [params.constitutionId]
      );
      const amendmentNumber = result.rows[0].next_number;

      await client.query(`
        INSERT INTO constitutional_amendments (
          id, constitution_id, amendment_number, title, text, purpose,
          proposal_method, proposed_by, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        amendmentId, params.constitutionId, amendmentNumber, params.title,
        params.text, params.purpose, params.proposalMethod, params.proposedBy, 'proposed'
      ]);

      const amendmentResult = await client.query(
        'SELECT * FROM constitutional_amendments WHERE id = $1',
        [amendmentId]
      );

      return this.mapRowToAmendment(amendmentResult.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Generate AI constitutional provisions
   */
  async generateAIProvisions(constitutionId: string, category: string): Promise<any> {
    // This would integrate with an AI service to generate constitutional provisions
    // For now, return placeholder data
    const provisions = {
      economicRights: {
        provisions: [
          "Every citizen has the right to economic opportunity and fair compensation for their labor",
          "The state shall ensure equal access to economic resources and opportunities",
          "Private property rights are protected, subject to the common good"
        ],
        protections: [
          "Anti-discrimination in employment and business",
          "Protection against economic exploitation",
          "Right to form and join economic associations"
        ],
        limitations: [
          "Economic rights may be limited during national emergencies",
          "Property rights are subject to environmental protection laws",
          "Economic activities must comply with public health and safety standards"
        ],
        enforcementMechanisms: [
          "Economic Rights Commission",
          "Labor courts and tribunals",
          "Ombudsman for economic affairs"
        ]
      }
    };

    // Update constitution with new AI provisions
    await this.pool.query(`
      UPDATE constitutions 
      SET ai_generated_provisions = jsonb_set(
        COALESCE(ai_generated_provisions, '{}'), 
        $1::text[], 
        $2::jsonb
      ),
      updated_at = NOW()
      WHERE id = $3
    `, [`{${category}}`, JSON.stringify(provisions[category]), constitutionId]);

    return provisions[category];
  }

  /**
   * Log constitutional event
   */
  async logConstitutionalEvent(params: ConstitutionalEventParams): Promise<void> {
    await this.pool.query(`
      INSERT INTO constitutional_events (
        campaign_id, civilization_id, constitution_id, event_type, event_title,
        event_description, constitutional_impact, stability_impact, legitimacy_impact,
        public_support_impact, triggered_by, severity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      params.campaignId, params.civilizationId, params.constitutionId,
      params.eventType, params.eventTitle, params.eventDescription,
      params.constitutionalImpact ? JSON.stringify(params.constitutionalImpact) : null,
      params.stabilityImpact || 0, params.legitimacyImpact || 0,
      params.publicSupportImpact || 0, params.triggeredBy, params.severity || 5
    ]);
  }

  /**
   * Get constitutional events
   */
  async getConstitutionalEvents(campaignId: number, civilizationId: string, limit: number = 50): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT * FROM constitutional_events 
      WHERE campaign_id = $1 AND civilization_id = $2 
      ORDER BY event_date DESC 
      LIMIT $3
    `, [campaignId, civilizationId, limit]);

    return result.rows;
  }

  // Private helper methods

  private generatePartySystemConfig(type: Constitution['politicalPartySystem']['type']) {
    const configs = {
      multiparty: {
        description: 'A competitive multi-party system allowing unlimited political parties to form and compete in elections.',
        constraints: {
          maxParties: null,
          minParties: 2,
          partyFormationRequirements: {
            minimumMembers: 1000,
            registrationProcess: 'Submit petition with member signatures and platform to Electoral Commission',
            fundingRequirements: 50000,
            ideologicalRestrictions: ['No parties advocating violent overthrow', 'No discriminatory parties']
          },
          electionParticipation: {
            requiresPartyAffiliation: false,
            independentCandidatesAllowed: true,
            coalitionFormationAllowed: true
          },
          partyOperations: {
            allowedActivities: ['Electoral campaigning', 'Policy advocacy', 'Public demonstrations', 'Fundraising'],
            restrictedActivities: ['Violence', 'Foreign interference', 'Corruption'],
            dissolutionConditions: ['Constitutional violations', 'Illegal activities', 'Foreign control'],
            stateSupervision: false
          }
        },
        transitionRules: {
          canChangeTo: ['two_party', 'single_party'],
          transitionRequirements: {
            constitutionalAmendment: true,
            referendumRequired: true,
            legislativeSupermajority: true,
            transitionPeriod: 24
          }
        },
        advantages: ['Diverse representation', 'Competitive elections', 'Coalition governments', 'Minority voice protection'],
        disadvantages: ['Political fragmentation', 'Coalition instability', 'High campaign costs', 'Voter confusion'],
        stabilityFactors: {
          governmentStability: 75,
          democraticLegitimacy: 90,
          representationQuality: 85,
          decisionMakingEfficiency: 70
        }
      },
      two_party: {
        description: 'A structured two-party system with exactly two major political parties.',
        constraints: {
          maxParties: 2,
          minParties: 2,
          partyFormationRequirements: {
            minimumMembers: 5000000,
            registrationProcess: 'Constitutional recognition as major party',
            fundingRequirements: 10000000,
            ideologicalRestrictions: ['Must represent broad coalition', 'Cannot be single-issue']
          },
          electionParticipation: {
            requiresPartyAffiliation: false,
            independentCandidatesAllowed: true,
            coalitionFormationAllowed: false
          },
          partyOperations: {
            allowedActivities: ['Electoral campaigning', 'Policy development', 'Candidate recruitment'],
            restrictedActivities: ['Preventing third-party access', 'Foreign coordination'],
            dissolutionConditions: ['Loss of major party status', 'Constitutional violation'],
            stateSupervision: true
          }
        },
        transitionRules: {
          canChangeTo: ['multiparty', 'single_party'],
          transitionRequirements: {
            constitutionalAmendment: true,
            referendumRequired: true,
            legislativeSupermajority: true,
            transitionPeriod: 18
          }
        },
        advantages: ['Political stability', 'Clear majorities', 'Simplified choices', 'Moderate policies'],
        disadvantages: ['Limited diversity', 'Polarization risk', 'Barriers to new movements', 'Reduced minority representation'],
        stabilityFactors: {
          governmentStability: 85,
          democraticLegitimacy: 75,
          representationQuality: 65,
          decisionMakingEfficiency: 90
        }
      },
      single_party: {
        description: 'A single-party system with one constitutional governing party.',
        constraints: {
          maxParties: 1,
          minParties: 1,
          partyFormationRequirements: {
            minimumMembers: 10000000,
            registrationProcess: 'Constitutional recognition as sole governing party',
            fundingRequirements: 0,
            ideologicalRestrictions: ['Must adhere to constitutional principles', 'Must represent collective will']
          },
          electionParticipation: {
            requiresPartyAffiliation: true,
            independentCandidatesAllowed: false,
            coalitionFormationAllowed: false
          },
          partyOperations: {
            allowedActivities: ['Policy development', 'Candidate selection', 'Mass mobilization', 'Ideological education'],
            restrictedActivities: ['Opposition formation', 'Counter-revolutionary activities', 'Factional organizing'],
            dissolutionConditions: ['Constitutional violation', 'Abandonment of principles'],
            stateSupervision: false
          }
        },
        transitionRules: {
          canChangeTo: ['multiparty', 'two_party'],
          transitionRequirements: {
            constitutionalAmendment: true,
            referendumRequired: true,
            legislativeSupermajority: true,
            transitionPeriod: 36
          }
        },
        advantages: ['Unity in governance', 'Rapid policy implementation', 'Long-term planning', 'Ideological consistency'],
        disadvantages: ['Limited pluralism', 'Authoritarian risk', 'Reduced political expression', 'Policy stagnation risk'],
        stabilityFactors: {
          governmentStability: 95,
          democraticLegitimacy: 60,
          representationQuality: 70,
          decisionMakingEfficiency: 95
        }
      },
      no_party: {
        description: 'A non-partisan system where political parties are prohibited.',
        constraints: {
          maxParties: 0,
          minParties: 0,
          partyFormationRequirements: {
            minimumMembers: 0,
            registrationProcess: 'Political parties are constitutionally prohibited',
            fundingRequirements: 0,
            ideologicalRestrictions: ['All political parties banned']
          },
          electionParticipation: {
            requiresPartyAffiliation: false,
            independentCandidatesAllowed: true,
            coalitionFormationAllowed: false
          },
          partyOperations: {
            allowedActivities: [],
            restrictedActivities: ['All party activities prohibited'],
            dissolutionConditions: ['N/A - parties prohibited'],
            stateSupervision: true
          }
        },
        transitionRules: {
          canChangeTo: ['multiparty', 'two_party', 'single_party'],
          transitionRequirements: {
            constitutionalAmendment: true,
            referendumRequired: true,
            legislativeSupermajority: true,
            transitionPeriod: 12
          }
        },
        advantages: ['No partisan politics', 'Individual merit focus', 'Reduced political polarization', 'Issue-based governance'],
        disadvantages: ['Lack of organized opposition', 'Difficulty organizing policy alternatives', 'Potential for elite capture', 'Reduced democratic competition'],
        stabilityFactors: {
          governmentStability: 80,
          democraticLegitimacy: 50,
          representationQuality: 60,
          decisionMakingEfficiency: 85
        }
      }
    };

    return configs[type];
  }

  private generateDefaultAIProvisions() {
    return {
      economicRights: { provisions: [], protections: [], limitations: [], enforcementMechanisms: [] },
      socialRights: { provisions: [], protections: [], limitations: [], enforcementMechanisms: [] },
      culturalRights: { provisions: [], protections: [], limitations: [], enforcementMechanisms: [] },
      environmentalRights: { provisions: [], protections: [], limitations: [], enforcementMechanisms: [] },
      digitalRights: { provisions: [], protections: [], limitations: [], enforcementMechanisms: [] },
      governanceInnovations: { provisions: [], mechanisms: [], safeguards: [], evaluationCriteria: [] }
    };
  }

  private generateDefaultPointsAllocation(partySystemType: string) {
    const baseAllocation = {
      executivePower: 150,
      legislativePower: 200,
      judicialPower: 150,
      citizenRights: 200,
      federalismBalance: 100,
      emergencyPowers: 50,
      amendmentDifficulty: 100,
      partySystemFlexibility: 50
    };

    // Adjust based on party system type
    switch (partySystemType) {
      case 'single_party':
        baseAllocation.executivePower += 30;
        baseAllocation.partySystemFlexibility -= 30;
        break;
      case 'two_party':
        baseAllocation.decisionMakingEfficiency = 90;
        baseAllocation.partySystemFlexibility -= 10;
        break;
      case 'multiparty':
        baseAllocation.citizenRights += 20;
        baseAllocation.partySystemFlexibility += 20;
        break;
    }

    return {
      totalPoints: 1000,
      allocatedPoints: baseAllocation,
      pointsHistory: []
    };
  }

  private generatePreamble(name: string, principles: string[]): string {
    return `We, the people of ${name}, in order to establish a just and democratic society based on ${principles.join(', ')}, do ordain and establish this Constitution.`;
  }

  private generateAmendmentProcess(governmentType: string) {
    return {
      proposalMethods: ['Legislative supermajority', 'Constitutional convention', 'Citizen initiative'],
      ratificationMethods: ['Legislative vote', 'Referendum', 'State ratification'],
      requiredThresholds: { proposal: 67, ratification: 60 }
    };
  }

  private generateEmergencyProvisions(governmentType: string) {
    return {
      declarationAuthority: 'Executive with legislative approval',
      scope: ['Suspend certain rights', 'Deploy military', 'Expedited legislation'],
      duration: 30,
      legislativeOversight: true,
      restrictions: ['Cannot suspend elections', 'Cannot dissolve legislature', 'Subject to judicial review']
    };
  }

  private mapRowToConstitution(row: any): Constitution {
    return {
      id: row.id,
      name: row.name,
      countryId: row.civilization_id,
      governmentType: row.government_type,
      preamble: row.preamble,
      foundingPrinciples: row.founding_principles,
      politicalPartySystem: {
        type: row.party_system_type,
        description: row.party_system_description,
        constraints: row.party_system_constraints,
        transitionRules: row.party_system_transition_rules,
        historicalContext: row.party_system_historical_context,
        advantages: row.party_system_advantages,
        disadvantages: row.party_system_disadvantages,
        stabilityFactors: row.party_system_stability_factors
      },
      executiveBranch: row.executive_branch,
      legislativeBranch: row.legislative_branch,
      judicialBranch: row.judicial_branch,
      billOfRights: row.bill_of_rights,
      federalStructure: row.federal_structure,
      amendmentProcess: row.amendment_process,
      emergencyProvisions: row.emergency_provisions,
      aiGeneratedProvisions: row.ai_generated_provisions,
      constitutionalPoints: row.constitutional_points,
      adoptionDate: row.adoption_date,
      lastAmended: row.last_amended,
      amendments: [], // Would be loaded separately
      ratificationStatus: row.ratification_status,
      publicSupport: parseFloat(row.public_support)
    };
  }

  private mapRowToAmendment(row: any): Amendment {
    return {
      id: row.id,
      constitutionId: row.constitution_id,
      number: row.amendment_number,
      title: row.title,
      text: row.text,
      purpose: row.purpose,
      proposedDate: row.proposed_date,
      ratifiedDate: row.ratified_date,
      status: row.status,
      proposalMethod: row.proposal_method,
      ratificationVotes: row.ratification_votes,
      publicSupport: parseFloat(row.public_support)
    };
  }
}
