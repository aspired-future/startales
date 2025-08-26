import express from 'express';
import { Pool } from 'pg';
import { ConstitutionService } from './ConstitutionService.js';

export function createConstitutionRoutes(pool: Pool): express.Router {
  const router = express.Router();
  const constitutionService = new ConstitutionService(pool);

  // Get all constitutions for a campaign
  router.get('/campaign/:campaignId', async (req, res) => {
    try {
      const { campaignId } = req.params;
      const constitutions = await constitutionService.getConstitutionsByCampaign(parseInt(campaignId));
      
      res.json({
        success: true,
        data: constitutions,
        message: 'Constitutions retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching constitutions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch constitutions',
        details: error.message
      });
    }
  });

  // Get constitution by civilization
  router.get('/civilization/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const constitution = await constitutionService.getConstitutionByCivilization(
        parseInt(campaignId), 
        civilizationId
      );
      
      if (!constitution) {
        return res.status(404).json({
          success: false,
          error: 'Constitution not found for this civilization'
        });
      }

      res.json({
        success: true,
        data: constitution,
        message: 'Constitution retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching constitution:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch constitution',
        details: error.message
      });
    }
  });

  // Get specific constitution by ID
  router.get('/:constitutionId', async (req, res) => {
    try {
      const { constitutionId } = req.params;
      const constitution = await constitutionService.getConstitutionById(constitutionId);
      
      res.json({
        success: true,
        data: constitution,
        message: 'Constitution retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching constitution:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch constitution',
        details: error.message
      });
    }
  });

  // Create new constitution
  router.post('/', async (req, res) => {
    try {
      const {
        name,
        campaignId,
        civilizationId,
        governmentType,
        foundingPrinciples,
        partySystemType,
        executiveStructure,
        legislativeStructure,
        judicialStructure,
        billOfRights,
        federalStructure
      } = req.body;

      // Validate required fields
      if (!name || !campaignId || !civilizationId || !governmentType || !partySystemType) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['name', 'campaignId', 'civilizationId', 'governmentType', 'partySystemType']
        });
      }

      const constitution = await constitutionService.createConstitution({
        name,
        campaignId: parseInt(campaignId),
        civilizationId,
        governmentType,
        foundingPrinciples: foundingPrinciples || [],
        partySystemType,
        executiveStructure: executiveStructure || {},
        legislativeStructure: legislativeStructure || {},
        judicialStructure: judicialStructure || {},
        billOfRights: billOfRights || [],
        federalStructure
      });

      res.status(201).json({
        success: true,
        data: constitution,
        message: 'Constitution created successfully'
      });
    } catch (error) {
      console.error('Error creating constitution:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create constitution',
        details: error.message
      });
    }
  });

  // Update party system
  router.put('/:constitutionId/party-system', async (req, res) => {
    try {
      const { constitutionId } = req.params;
      const { newPartySystemType, reason } = req.body;

      if (!newPartySystemType || !reason) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['newPartySystemType', 'reason']
        });
      }

      const constitution = await constitutionService.updatePartySystem(
        constitutionId,
        newPartySystemType,
        reason
      );

      res.json({
        success: true,
        data: constitution,
        message: 'Party system updated successfully'
      });
    } catch (error) {
      console.error('Error updating party system:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update party system',
        details: error.message
      });
    }
  });

  // Propose constitutional amendment
  router.post('/:constitutionId/amendments', async (req, res) => {
    try {
      const { constitutionId } = req.params;
      const { title, text, purpose, proposalMethod, proposedBy } = req.body;

      if (!title || !text || !purpose || !proposalMethod) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['title', 'text', 'purpose', 'proposalMethod']
        });
      }

      const amendment = await constitutionService.proposeAmendment({
        constitutionId,
        title,
        text,
        purpose,
        proposalMethod,
        proposedBy
      });

      res.status(201).json({
        success: true,
        data: amendment,
        message: 'Amendment proposed successfully'
      });
    } catch (error) {
      console.error('Error proposing amendment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to propose amendment',
        details: error.message
      });
    }
  });

  // Generate AI constitutional provisions
  router.post('/:constitutionId/ai-provisions/:category', async (req, res) => {
    try {
      const { constitutionId, category } = req.params;
      const { context, requirements } = req.body;

      const validCategories = [
        'economicRights', 'socialRights', 'culturalRights', 
        'environmentalRights', 'digitalRights', 'governanceInnovations'
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category',
          validCategories
        });
      }

      const provisions = await constitutionService.generateAIProvisions(constitutionId, category);

      res.json({
        success: true,
        data: provisions,
        message: `AI provisions generated for ${category}`
      });
    } catch (error) {
      console.error('Error generating AI provisions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI provisions',
        details: error.message
      });
    }
  });

  // Get constitutional events
  router.get('/:constitutionId/events', async (req, res) => {
    try {
      const { constitutionId } = req.params;
      const { campaignId, civilizationId, limit } = req.query;

      if (!campaignId || !civilizationId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required query parameters',
          required: ['campaignId', 'civilizationId']
        });
      }

      const events = await constitutionService.getConstitutionalEvents(
        parseInt(campaignId as string),
        civilizationId as string,
        limit ? parseInt(limit as string) : 50
      );

      res.json({
        success: true,
        data: events,
        message: 'Constitutional events retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching constitutional events:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch constitutional events',
        details: error.message
      });
    }
  });

  // Get constitutional templates
  router.get('/templates/all', async (req, res) => {
    try {
      const templates = await constitutionService.getConstitutionsByCampaign(0); // Templates have campaignId 0
      
      res.json({
        success: true,
        data: templates,
        message: 'Constitutional templates retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching constitutional templates:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch constitutional templates',
        details: error.message
      });
    }
  });

  // Get party system options and their characteristics
  router.get('/party-systems/options', async (req, res) => {
    try {
      const partySystemOptions = {
        multiparty: {
          name: 'Multi-Party System',
          description: 'Competitive system allowing unlimited political parties',
          advantages: [
            'Diverse representation of political viewpoints',
            'Competitive elections promote accountability',
            'Coalition governments encourage compromise',
            'Protection of minority political voices',
            'Innovation in policy through competition'
          ],
          disadvantages: [
            'Potential for political fragmentation',
            'Coalition instability',
            'Increased campaign costs',
            'Voter confusion with many choices',
            'Possible extremist party participation'
          ],
          stabilityFactors: {
            governmentStability: 75,
            democraticLegitimacy: 90,
            representationQuality: 85,
            decisionMakingEfficiency: 70
          },
          recommendedFor: ['Large diverse populations', 'Established democracies', 'Pluralistic societies']
        },
        two_party: {
          name: 'Two-Party System',
          description: 'Structured system with exactly two major political parties',
          advantages: [
            'Political stability and predictability',
            'Clear governing majorities',
            'Simplified voter choices',
            'Moderate, centrist policies',
            'Strong opposition oversight',
            'Efficient decision-making'
          ],
          disadvantages: [
            'Limited political diversity',
            'Potential for polarization',
            'Barriers to new political movements',
            'Reduced representation of minority views',
            'Risk of political stagnation'
          ],
          stabilityFactors: {
            governmentStability: 85,
            democraticLegitimacy: 75,
            representationQuality: 65,
            decisionMakingEfficiency: 90
          },
          recommendedFor: ['Stable democracies', 'Societies with clear ideological divisions', 'Need for decisive governance']
        },
        single_party: {
          name: 'Single-Party System',
          description: 'One constitutional governing party with internal democracy',
          advantages: [
            'Unity and stability in governance',
            'Rapid implementation of policies',
            'Long-term strategic planning',
            'Ideological consistency',
            'Efficient resource allocation',
            'Strong social mobilization'
          ],
          disadvantages: [
            'Limited political pluralism',
            'Potential for authoritarianism',
            'Reduced individual political expression',
            'Risk of policy stagnation',
            'Limited checks on power',
            'Suppression of dissent'
          ],
          stabilityFactors: {
            governmentStability: 95,
            democraticLegitimacy: 60,
            representationQuality: 70,
            decisionMakingEfficiency: 95
          },
          recommendedFor: ['Revolutionary periods', 'Nation-building phases', 'Crisis situations requiring unity']
        },
        no_party: {
          name: 'Non-Partisan System',
          description: 'System where political parties are prohibited',
          advantages: [
            'No partisan politics',
            'Individual merit focus',
            'Reduced political polarization',
            'Issue-based governance',
            'Direct representation',
            'Reduced corruption from party politics'
          ],
          disadvantages: [
            'Lack of organized opposition',
            'Difficulty organizing policy alternatives',
            'Potential for elite capture',
            'Reduced democratic competition',
            'Weak policy coordination',
            'Limited accountability mechanisms'
          ],
          stabilityFactors: {
            governmentStability: 80,
            democraticLegitimacy: 50,
            representationQuality: 60,
            decisionMakingEfficiency: 85
          },
          recommendedFor: ['Small communities', 'Traditional societies', 'Post-conflict reconciliation']
        }
      };

      res.json({
        success: true,
        data: partySystemOptions,
        message: 'Party system options retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching party system options:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch party system options',
        details: error.message
      });
    }
  });

  // Constitutional health check
  router.get('/:constitutionId/health-check', async (req, res) => {
    try {
      const { constitutionId } = req.params;
      const constitution = await constitutionService.getConstitutionById(constitutionId);
      
      // Calculate constitutional health metrics
      const healthMetrics = {
        overallHealth: 85, // This would be calculated based on various factors
        components: {
          structuralIntegrity: 90,
          rightsProtection: 85,
          governanceEfficiency: 80,
          adaptability: 75,
          publicSupport: constitution.publicSupport,
          institutionalBalance: 85
        },
        recommendations: [
          'Consider updating digital rights provisions',
          'Review emergency powers limitations',
          'Strengthen judicial independence guarantees'
        ],
        riskFactors: [
          'Low public support in certain demographics',
          'Potential for constitutional crisis during emergencies',
          'Outdated provisions regarding technology governance'
        ]
      };

      res.json({
        success: true,
        data: healthMetrics,
        message: 'Constitutional health check completed'
      });
    } catch (error) {
      console.error('Error performing constitutional health check:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to perform constitutional health check',
        details: error.message
      });
    }
  });

  return router;
}
