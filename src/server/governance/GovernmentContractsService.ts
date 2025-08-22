import { Pool } from 'pg';

/**
 * Government Contracts Service
 * Manages government contracts for defense, infrastructure, and custom projects
 */

export interface ContractType {
  id: string;
  name: string;
  description: string;
  category: 'defense' | 'infrastructure' | 'research' | 'social' | 'custom';
  
  // Contract Characteristics
  typicalDuration: number; // in months
  complexityLevel: number; // 1-10
  riskLevel: number; // 1-10
  
  // Requirements
  requiredCapabilities: string[];
  securityClearanceRequired: boolean;
  minimumCompanySize: 'small' | 'medium' | 'large' | 'any';
  
  // Evaluation Criteria
  evaluationCriteria: {
    technical: number; // weight 0-100
    cost: number; // weight 0-100
    schedule: number; // weight 0-100
    experience: number; // weight 0-100
    innovation: number; // weight 0-100
  };
}

export interface GovernmentContract {
  id: string;
  campaignId: number;
  civilizationId: string;
  
  // Contract Details
  title: string;
  description: string;
  contractTypeId: string;
  category: 'defense' | 'infrastructure' | 'research' | 'social' | 'custom';
  
  // Financial Information
  totalValue: number;
  budgetAllocated: number;
  fundingSource: string; // department or fund
  paymentSchedule: 'milestone' | 'monthly' | 'completion' | 'custom';
  
  // Timeline
  startDate: Date;
  endDate: Date;
  duration: number; // in months
  
  // Priority and Status
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planning' | 'bidding' | 'awarded' | 'active' | 'completed' | 'cancelled' | 'disputed';
  
  // Requirements
  requirements: {
    technical: string[];
    performance: string[];
    compliance: string[];
    deliverables: string[];
  };
  
  // Bidding Information
  biddingProcess: {
    openDate: Date;
    closeDate: Date;
    method: 'open_competitive' | 'limited_competitive' | 'sole_source' | 'emergency';
    minimumBidders: number;
    prequalificationRequired: boolean;
  };
  
  // Award Information
  awardedTo?: {
    contractorId: string;
    contractorName: string;
    bidAmount: number;
    awardDate: Date;
    awardReason: string;
  };
  
  // Performance Tracking
  performance?: {
    schedulePerformance: number; // 0-100
    costPerformance: number; // 0-100
    qualityRating: number; // 0-100
    milestonesMet: number;
    totalMilestones: number;
    issuesReported: number;
  };
  
  // Metadata
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractBid {
  id: string;
  contractId: string;
  
  // Bidder Information
  bidderId: string;
  bidderName: string;
  bidderType: 'corporation' | 'small_business' | 'nonprofit' | 'individual';
  
  // Bid Details
  bidAmount: number;
  proposedDuration: number; // in months
  proposedStartDate: Date;
  
  // Technical Proposal
  technicalApproach: string;
  keyPersonnel: string[];
  subcontractors: string[];
  pastPerformance: string[];
  
  // Evaluation Scores
  evaluationScores?: {
    technical: number; // 0-100
    cost: number; // 0-100
    schedule: number; // 0-100
    experience: number; // 0-100
    innovation: number; // 0-100
    totalScore: number; // weighted average
  };
  
  // Status
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ContractFunding {
  id: string;
  contractId: string;
  
  // Funding Details
  fundingSource: string;
  amount: number;
  fiscalYear: number;
  
  // Allocation
  allocationType: 'initial' | 'supplemental' | 'modification' | 'emergency';
  allocationDate: Date;
  availableUntil: Date;
  
  // Status
  status: 'allocated' | 'obligated' | 'disbursed' | 'expired';
  amountObligated: number;
  amountDisbursed: number;
  
  // Metadata
  authorizedBy: string;
  createdAt: Date;
}

export class GovernmentContractsService {
  constructor(private pool: Pool) {}

  // Get all contract types
  async getContractTypes(): Promise<ContractType[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM contract_types ORDER BY category, name
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get contracts for a civilization
  async getContracts(
    campaignId: number,
    civilizationId: string,
    filters?: {
      category?: string;
      status?: string;
      priority?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ contracts: GovernmentContract[]; total: number }> {
    const client = await this.pool.connect();
    try {
      let whereClause = 'WHERE campaign_id = $1 AND civilization_id = $2';
      const params: any[] = [campaignId, civilizationId];
      let paramIndex = 3;

      if (filters?.category) {
        whereClause += ` AND category = $${paramIndex}`;
        params.push(filters.category);
        paramIndex++;
      }

      if (filters?.status) {
        whereClause += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters?.priority) {
        whereClause += ` AND priority = $${paramIndex}`;
        params.push(filters.priority);
        paramIndex++;
      }

      // Get total count
      const countResult = await client.query(`
        SELECT COUNT(*) FROM government_contracts ${whereClause}
      `, params);

      // Get contracts with pagination
      let query = `
        SELECT gc.*, ct.name as contract_type_name
        FROM government_contracts gc
        LEFT JOIN contract_types ct ON gc.contract_type_id = ct.id
        ${whereClause}
        ORDER BY 
          CASE priority 
            WHEN 'critical' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            WHEN 'low' THEN 4 
          END,
          created_at DESC
      `;

      if (filters?.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
        paramIndex++;
      }

      if (filters?.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(filters.offset);
      }

      const result = await client.query(query, params);

      return {
        contracts: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Create new contract
  async createContract(contract: Omit<GovernmentContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<GovernmentContract> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO government_contracts (
          campaign_id, civilization_id, title, description, contract_type_id, category,
          total_value, budget_allocated, funding_source, payment_schedule,
          start_date, end_date, duration, priority, status,
          requirements, bidding_process, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING *
      `, [
        contract.campaignId,
        contract.civilizationId,
        contract.title,
        contract.description,
        contract.contractTypeId,
        contract.category,
        contract.totalValue,
        contract.budgetAllocated,
        contract.fundingSource,
        contract.paymentSchedule,
        contract.startDate,
        contract.endDate,
        contract.duration,
        contract.priority,
        contract.status,
        JSON.stringify(contract.requirements),
        JSON.stringify(contract.biddingProcess),
        contract.createdBy
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update contract
  async updateContract(
    contractId: string,
    updates: Partial<GovernmentContract>
  ): Promise<GovernmentContract | null> {
    const client = await this.pool.connect();
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      // Build dynamic update query
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'createdAt') {
          const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updateFields.push(`${dbKey} = $${paramIndex}`);
          
          if (typeof value === 'object' && value !== null) {
            values.push(JSON.stringify(value));
          } else {
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(contractId);

      const result = await client.query(`
        UPDATE government_contracts 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);

      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Submit bid for contract
  async submitBid(bid: Omit<ContractBid, 'id' | 'submittedAt'>): Promise<ContractBid> {
    const client = await this.pool.connect();
    try {
      // Check if contract is still accepting bids
      const contractResult = await client.query(`
        SELECT status, bidding_process FROM government_contracts WHERE id = $1
      `, [bid.contractId]);

      if (contractResult.rows.length === 0) {
        throw new Error('Contract not found');
      }

      const contract = contractResult.rows[0];
      if (contract.status !== 'bidding') {
        throw new Error('Contract is not accepting bids');
      }

      const biddingProcess = contract.bidding_process;
      if (new Date() > new Date(biddingProcess.closeDate)) {
        throw new Error('Bidding period has closed');
      }

      const result = await client.query(`
        INSERT INTO contract_bids (
          contract_id, bidder_id, bidder_name, bidder_type,
          bid_amount, proposed_duration, proposed_start_date,
          technical_approach, key_personnel, subcontractors, past_performance,
          status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        ) RETURNING *
      `, [
        bid.contractId,
        bid.bidderId,
        bid.bidderName,
        bid.bidderType,
        bid.bidAmount,
        bid.proposedDuration,
        bid.proposedStartDate,
        bid.technicalApproach,
        JSON.stringify(bid.keyPersonnel),
        JSON.stringify(bid.subcontractors),
        JSON.stringify(bid.pastPerformance),
        'submitted'
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Award contract
  async awardContract(
    contractId: string,
    winningBidId: string,
    awardReason: string,
    awardedBy: string
  ): Promise<GovernmentContract> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Get winning bid details
      const bidResult = await client.query(`
        SELECT * FROM contract_bids WHERE id = $1
      `, [winningBidId]);

      if (bidResult.rows.length === 0) {
        throw new Error('Winning bid not found');
      }

      const winningBid = bidResult.rows[0];

      // Update contract with award information
      const contractResult = await client.query(`
        UPDATE government_contracts 
        SET 
          status = 'awarded',
          awarded_to = $1,
          approved_by = $2,
          updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `, [
        JSON.stringify({
          contractorId: winningBid.bidder_id,
          contractorName: winningBid.bidder_name,
          bidAmount: winningBid.bid_amount,
          awardDate: new Date(),
          awardReason
        }),
        awardedBy,
        contractId
      ]);

      // Update winning bid status
      await client.query(`
        UPDATE contract_bids 
        SET status = 'accepted', reviewed_at = NOW(), reviewed_by = $1
        WHERE id = $2
      `, [awardedBy, winningBidId]);

      // Update losing bids
      await client.query(`
        UPDATE contract_bids 
        SET status = 'rejected', reviewed_at = NOW(), reviewed_by = $1,
            rejection_reason = 'Contract awarded to another bidder'
        WHERE contract_id = $2 AND id != $3 AND status = 'submitted'
      `, [awardedBy, contractId, winningBidId]);

      await client.query('COMMIT');
      return contractResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get contract performance metrics
  async getContractPerformance(
    campaignId: number,
    civilizationId: string
  ): Promise<{
    totalContracts: number;
    activeContracts: number;
    completedContracts: number;
    totalValue: number;
    averagePerformance: {
      schedule: number;
      cost: number;
      quality: number;
    };
    contractsByCategory: Record<string, number>;
    contractsByPriority: Record<string, number>;
  }> {
    const client = await this.pool.connect();
    try {
      // Get overall statistics
      const statsResult = await client.query(`
        SELECT 
          COUNT(*) as total_contracts,
          COUNT(*) FILTER (WHERE status = 'active') as active_contracts,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_contracts,
          SUM(total_value) as total_value,
          AVG((performance->>'schedulePerformance')::numeric) as avg_schedule,
          AVG((performance->>'costPerformance')::numeric) as avg_cost,
          AVG((performance->>'qualityRating')::numeric) as avg_quality
        FROM government_contracts 
        WHERE campaign_id = $1 AND civilization_id = $2
      `, [campaignId, civilizationId]);

      // Get contracts by category
      const categoryResult = await client.query(`
        SELECT category, COUNT(*) as count
        FROM government_contracts 
        WHERE campaign_id = $1 AND civilization_id = $2
        GROUP BY category
      `, [campaignId, civilizationId]);

      // Get contracts by priority
      const priorityResult = await client.query(`
        SELECT priority, COUNT(*) as count
        FROM government_contracts 
        WHERE campaign_id = $1 AND civilization_id = $2
        GROUP BY priority
      `, [campaignId, civilizationId]);

      const stats = statsResult.rows[0];
      const contractsByCategory = categoryResult.rows.reduce((acc, row) => {
        acc[row.category] = parseInt(row.count);
        return acc;
      }, {});
      const contractsByPriority = priorityResult.rows.reduce((acc, row) => {
        acc[row.priority] = parseInt(row.count);
        return acc;
      }, {});

      return {
        totalContracts: parseInt(stats.total_contracts),
        activeContracts: parseInt(stats.active_contracts),
        completedContracts: parseInt(stats.completed_contracts),
        totalValue: parseFloat(stats.total_value) || 0,
        averagePerformance: {
          schedule: parseFloat(stats.avg_schedule) || 0,
          cost: parseFloat(stats.avg_cost) || 0,
          quality: parseFloat(stats.avg_quality) || 0
        },
        contractsByCategory,
        contractsByPriority
      };
    } finally {
      client.release();
    }
  }

  // Update contract performance
  async updateContractPerformance(
    contractId: string,
    performance: {
      schedulePerformance?: number;
      costPerformance?: number;
      qualityRating?: number;
      milestonesMet?: number;
      totalMilestones?: number;
      issuesReported?: number;
    }
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        UPDATE government_contracts 
        SET performance = performance || $1::jsonb, updated_at = NOW()
        WHERE id = $2
      `, [JSON.stringify(performance), contractId]);
    } finally {
      client.release();
    }
  }

  // Allocate funding to contract
  async allocateFunding(funding: Omit<ContractFunding, 'id' | 'createdAt'>): Promise<ContractFunding> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO contract_funding (
          contract_id, funding_source, amount, fiscal_year,
          allocation_type, allocation_date, available_until,
          status, amount_obligated, amount_disbursed, authorized_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        ) RETURNING *
      `, [
        funding.contractId,
        funding.fundingSource,
        funding.amount,
        funding.fiscalYear,
        funding.allocationType,
        funding.allocationDate,
        funding.availableUntil,
        funding.status,
        funding.amountObligated,
        funding.amountDisbursed,
        funding.authorizedBy
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

