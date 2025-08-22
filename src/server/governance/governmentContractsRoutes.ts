import express from 'express';
import { Pool } from 'pg';
import { GovernmentContractsService } from './GovernmentContractsService';
import {
  DEFAULT_GOVERNMENT_CONTRACTS_KNOBS,
  CONTRACT_CATEGORY_KNOB_PRESETS,
  GOVERNMENT_CONTRACTS_AI_PROMPTS,
  GOVERNMENT_CONTRACTS_KNOB_DESCRIPTIONS,
  GovernmentContractsKnobs
} from './governmentContractsKnobs';

export function createGovernmentContractsRoutes(pool: Pool): express.Router {
  const router = express.Router();
  const contractsService = new GovernmentContractsService(pool);

  // Get all contract types
  router.get('/types', async (req, res) => {
    try {
      const types = await contractsService.getContractTypes();
      res.json({
        success: true,
        data: types,
        message: 'Contract types retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching contract types:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contract types',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get contracts for a civilization
  router.get('/civilization/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { category, status, priority, limit, offset } = req.query;

      const filters: any = {};
      if (category) filters.category = category as string;
      if (status) filters.status = status as string;
      if (priority) filters.priority = priority as string;
      if (limit) filters.limit = parseInt(limit as string);
      if (offset) filters.offset = parseInt(offset as string);

      const result = await contractsService.getContracts(
        parseInt(campaignId),
        civilizationId,
        filters
      );

      res.json({
        success: true,
        data: result,
        message: 'Contracts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contracts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create new contract
  router.post('/civilization/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const contractData = {
        ...req.body,
        campaignId: parseInt(campaignId),
        civilizationId
      };

      // Validate required fields
      const requiredFields = [
        'title', 'description', 'contractTypeId', 'category',
        'totalValue', 'budgetAllocated', 'fundingSource', 'paymentSchedule',
        'startDate', 'endDate', 'duration', 'priority', 'status',
        'requirements', 'biddingProcess', 'createdBy'
      ];

      const missingFields = requiredFields.filter(field => !contractData[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: ' + missingFields.join(', ')
        });
      }

      // Validate enums
      const validCategories = ['defense', 'infrastructure', 'research', 'social', 'custom'];
      const validPriorities = ['critical', 'high', 'medium', 'low'];
      const validStatuses = ['planning', 'bidding', 'awarded', 'active', 'completed', 'cancelled', 'disputed'];
      const validPaymentSchedules = ['milestone', 'monthly', 'completion', 'custom'];

      if (!validCategories.includes(contractData.category)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category. Must be one of: ' + validCategories.join(', ')
        });
      }

      if (!validPriorities.includes(contractData.priority)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid priority. Must be one of: ' + validPriorities.join(', ')
        });
      }

      if (!validStatuses.includes(contractData.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
      }

      if (!validPaymentSchedules.includes(contractData.paymentSchedule)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment schedule. Must be one of: ' + validPaymentSchedules.join(', ')
        });
      }

      const contract = await contractsService.createContract(contractData);

      res.status(201).json({
        success: true,
        data: contract,
        message: 'Contract created successfully'
      });
    } catch (error) {
      console.error('Error creating contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update contract
  router.put('/contract/:contractId', async (req, res) => {
    try {
      const { contractId } = req.params;
      const updates = req.body;

      const contract = await contractsService.updateContract(contractId, updates);

      if (!contract) {
        return res.status(404).json({
          success: false,
          error: 'Contract not found'
        });
      }

      res.json({
        success: true,
        data: contract,
        message: 'Contract updated successfully'
      });
    } catch (error) {
      console.error('Error updating contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Submit bid for contract
  router.post('/contract/:contractId/bids', async (req, res) => {
    try {
      const { contractId } = req.params;
      const bidData = {
        ...req.body,
        contractId
      };

      // Validate required fields
      const requiredFields = [
        'bidderId', 'bidderName', 'bidderType', 'bidAmount',
        'proposedDuration', 'proposedStartDate', 'technicalApproach',
        'keyPersonnel', 'subcontractors', 'pastPerformance'
      ];

      const missingFields = requiredFields.filter(field => !bidData[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: ' + missingFields.join(', ')
        });
      }

      // Validate bidder type
      const validBidderTypes = ['corporation', 'small_business', 'nonprofit', 'individual'];
      if (!validBidderTypes.includes(bidData.bidderType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bidder type. Must be one of: ' + validBidderTypes.join(', ')
        });
      }

      const bid = await contractsService.submitBid(bidData);

      res.status(201).json({
        success: true,
        data: bid,
        message: 'Bid submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting bid:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit bid',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Award contract
  router.post('/contract/:contractId/award', async (req, res) => {
    try {
      const { contractId } = req.params;
      const { winningBidId, awardReason, awardedBy } = req.body;

      if (!winningBidId || !awardReason || !awardedBy) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: winningBidId, awardReason, awardedBy'
        });
      }

      const contract = await contractsService.awardContract(
        contractId,
        winningBidId,
        awardReason,
        awardedBy
      );

      res.json({
        success: true,
        data: contract,
        message: 'Contract awarded successfully'
      });
    } catch (error) {
      console.error('Error awarding contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to award contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get contract performance metrics
  router.get('/civilization/:campaignId/:civilizationId/performance', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;

      const performance = await contractsService.getContractPerformance(
        parseInt(campaignId),
        civilizationId
      );

      res.json({
        success: true,
        data: performance,
        message: 'Contract performance metrics retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching contract performance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contract performance',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update contract performance
  router.put('/contract/:contractId/performance', async (req, res) => {
    try {
      const { contractId } = req.params;
      const performance = req.body;

      // Validate performance metrics (0-100)
      const validMetrics = ['schedulePerformance', 'costPerformance', 'qualityRating'];
      for (const metric of validMetrics) {
        if (performance[metric] !== undefined) {
          const value = performance[metric];
          if (typeof value !== 'number' || value < 0 || value > 100) {
            return res.status(400).json({
              success: false,
              error: `Invalid ${metric}: must be a number between 0 and 100`
            });
          }
        }
      }

      await contractsService.updateContractPerformance(contractId, performance);

      res.json({
        success: true,
        message: 'Contract performance updated successfully'
      });
    } catch (error) {
      console.error('Error updating contract performance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update contract performance',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Allocate funding to contract
  router.post('/contract/:contractId/funding', async (req, res) => {
    try {
      const { contractId } = req.params;
      const fundingData = {
        ...req.body,
        contractId
      };

      // Validate required fields
      const requiredFields = [
        'fundingSource', 'amount', 'fiscalYear', 'allocationType',
        'allocationDate', 'availableUntil', 'status', 'authorizedBy'
      ];

      const missingFields = requiredFields.filter(field => !fundingData[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: ' + missingFields.join(', ')
        });
      }

      // Validate enums
      const validAllocationTypes = ['initial', 'supplemental', 'modification', 'emergency'];
      const validStatuses = ['allocated', 'obligated', 'disbursed', 'expired'];

      if (!validAllocationTypes.includes(fundingData.allocationType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid allocation type. Must be one of: ' + validAllocationTypes.join(', ')
        });
      }

      if (!validStatuses.includes(fundingData.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
      }

      const funding = await contractsService.allocateFunding(fundingData);

      res.status(201).json({
        success: true,
        data: funding,
        message: 'Funding allocated successfully'
      });
    } catch (error) {
      console.error('Error allocating funding:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to allocate funding',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get contract dashboard data
  router.get('/civilization/:campaignId/:civilizationId/dashboard', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const campaignIdNum = parseInt(campaignId);

      // Get contracts summary
      const contractsResult = await contractsService.getContracts(
        campaignIdNum,
        civilizationId,
        { limit: 10 }
      );

      // Get performance metrics
      const performance = await contractsService.getContractPerformance(
        campaignIdNum,
        civilizationId
      );

      // Get recent contracts by status
      const recentContracts = await Promise.all([
        contractsService.getContracts(campaignIdNum, civilizationId, { status: 'bidding', limit: 5 }),
        contractsService.getContracts(campaignIdNum, civilizationId, { status: 'active', limit: 5 }),
        contractsService.getContracts(campaignIdNum, civilizationId, { status: 'completed', limit: 5 })
      ]);

      const dashboard = {
        summary: {
          totalContracts: performance.totalContracts,
          activeContracts: performance.activeContracts,
          completedContracts: performance.completedContracts,
          totalValue: performance.totalValue
        },
        performance: performance.averagePerformance,
        distribution: {
          byCategory: performance.contractsByCategory,
          byPriority: performance.contractsByPriority
        },
        recentActivity: {
          bidding: recentContracts[0].contracts,
          active: recentContracts[1].contracts,
          completed: recentContracts[2].contracts
        },
        upcomingDeadlines: contractsResult.contracts
          .filter(c => c.status === 'active' || c.status === 'bidding')
          .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
          .slice(0, 5)
      };

      res.json({
        success: true,
        data: dashboard,
        message: 'Contract dashboard data retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching contract dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contract dashboard',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get knob settings for government contracts
  router.get('/knobs', async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          defaultKnobs: DEFAULT_GOVERNMENT_CONTRACTS_KNOBS,
          categoryPresets: CONTRACT_CATEGORY_KNOB_PRESETS,
          descriptions: GOVERNMENT_CONTRACTS_KNOB_DESCRIPTIONS
        },
        message: 'Government contracts knobs retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching government contracts knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch government contracts knobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get AI prompts for government contracts
  router.get('/ai-prompts', async (req, res) => {
    try {
      res.json({
        success: true,
        data: GOVERNMENT_CONTRACTS_AI_PROMPTS,
        message: 'Government contracts AI prompts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching AI prompts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch AI prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Apply category preset to contracts
  router.post('/civilization/:campaignId/:civilizationId/apply-category-preset', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { category } = req.body;

      if (!category || !CONTRACT_CATEGORY_KNOB_PRESETS[category]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category. Available categories: ' + Object.keys(CONTRACT_CATEGORY_KNOB_PRESETS).join(', ')
        });
      }

      const preset = CONTRACT_CATEGORY_KNOB_PRESETS[category];
      const knobSettings = { ...DEFAULT_GOVERNMENT_CONTRACTS_KNOBS, ...preset };

      res.json({
        success: true,
        data: {
          appliedCategory: category,
          knobSettings
        },
        message: 'Category preset applied successfully'
      });
    } catch (error) {
      console.error('Error applying category preset:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply category preset',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Generate AI analysis for contracts
  router.post('/civilization/:campaignId/:civilizationId/ai-analysis', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { promptType, parameters } = req.body;

      if (!promptType || !GOVERNMENT_CONTRACTS_AI_PROMPTS[promptType as keyof typeof GOVERNMENT_CONTRACTS_AI_PROMPTS]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid prompt type. Available types: ' + Object.keys(GOVERNMENT_CONTRACTS_AI_PROMPTS).join(', ')
        });
      }

      const prompt = GOVERNMENT_CONTRACTS_AI_PROMPTS[promptType as keyof typeof GOVERNMENT_CONTRACTS_AI_PROMPTS];
      
      // Replace parameters in prompt template
      let processedPrompt = prompt;
      if (parameters) {
        Object.entries(parameters).forEach(([key, value]) => {
          processedPrompt = processedPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
        });
      }

      res.json({
        success: true,
        data: {
          promptType,
          processedPrompt,
          parameters,
          // Mock AI response
          aiResponse: `AI analysis for ${promptType} would be generated here based on the current contract situation.`
        },
        message: 'AI analysis generated successfully'
      });
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}
