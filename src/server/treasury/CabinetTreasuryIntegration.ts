import { Pool } from 'pg';
import { TreasuryService } from './TreasuryService';
import { DepartmentBudgetService } from './DepartmentBudgetService';

export interface CabinetSecretaryAuthority {
  secretaryId: string;
  department: string;
  name: string;
  title: string;
  
  // Budget Authority
  budgetAuthority: {
    totalBudget: number;
    availableBalance: number;
    spendingLimits: {
      dailyLimit: number;
      transactionLimit: number;
      approvalRequired: number; // Amount requiring Treasury approval
    };
  };
  
  // Spending Powers
  spendingPowers: {
    canAuthorizeExpenditure: boolean;
    canReallocateBudget: boolean;
    canRequestSupplemental: boolean;
    canApproveContracts: boolean;
    maxContractValue: number;
  };
  
  // Current Status
  status: {
    budgetUtilization: number; // Percentage of budget used
    pendingApprovals: number; // Number of items awaiting approval
    monthlyBurnRate: number; // Current spending rate
    projectedOverrun: boolean; // Will exceed budget at current rate
  };
}

export interface SecretaryBudgetRequest {
  secretaryId: string;
  department: string;
  requestType: 'expenditure' | 'reallocation' | 'supplemental' | 'contract';
  
  // Request Details
  amount: number;
  purpose: string;
  justification: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  
  // Expenditure Details (if applicable)
  category?: string;
  vendor?: string;
  contractDetails?: {
    contractType: string;
    duration: string;
    deliverables: string[];
    milestones: Array<{
      description: string;
      targetDate: Date;
      paymentAmount: number;
    }>;
  };
  
  // Reallocation Details (if applicable)
  fromCategory?: string;
  toCategory?: string;
  
  // Timeline
  requestedDate: Date;
  requiredByDate?: Date;
}

export interface TreasuryApprovalWorkflow {
  requestId: string;
  requestType: string;
  department: string;
  amount: number;
  
  // Approval Chain
  approvalChain: Array<{
    approverRole: 'secretary' | 'treasury' | 'leader';
    approverId: string;
    approverName: string;
    required: boolean;
    approved?: boolean;
    approvedAt?: Date;
    notes?: string;
  }>;
  
  // Current Status
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  
  // Decision Details
  finalDecision?: {
    approved: boolean;
    approvedBy: string;
    approvedAt: Date;
    conditions?: string[];
    notes?: string;
  };
}

export class CabinetTreasuryIntegration {
  constructor(
    private pool: Pool,
    private treasuryService: TreasuryService,
    private departmentBudgetService: DepartmentBudgetService
  ) {}

  // ==================== SECRETARY AUTHORITY MANAGEMENT ====================

  async getSecretaryAuthority(secretaryId: string, campaignId: number): Promise<CabinetSecretaryAuthority | null> {
    const client = await this.pool.connect();
    
    try {
      // Get cabinet member details
      const memberResult = await client.query(`
        SELECT cm.*, gr.department
        FROM cabinet_members cm
        JOIN government_roles gr ON cm.role_id = gr.id
        WHERE cm.user_id = $1 AND cm.status = 'active'
      `, [secretaryId]);

      if (memberResult.rows.length === 0) return null;

      const member = memberResult.rows[0];
      const department = member.department;
      const currentYear = new Date().getFullYear();

      // Get department budget
      const budget = await this.departmentBudgetService.getDepartmentBudget(
        campaignId, 
        department, 
        currentYear
      );

      if (!budget) return null;

      // Get pending approvals count
      const pendingResult = await client.query(`
        SELECT COUNT(*) as pending_count
        FROM department_line_items 
        WHERE department = $1 AND campaign_id = $2 
        AND status IN ('planned', 'pending')
      `, [department, campaignId]);

      const pendingApprovals = Number(pendingResult.rows[0]?.pending_count || 0);

      // Determine spending powers based on department and role
      const spendingPowers = this.determineSpendingPowers(department, member.title);

      return {
        secretaryId,
        department,
        name: member.name,
        title: member.title,
        budgetAuthority: {
          totalBudget: budget.totalAllocated,
          availableBalance: budget.remainingBalance,
          spendingLimits: budget.spendingLimits
        },
        spendingPowers,
        status: {
          budgetUtilization: budget.utilizationRate,
          pendingApprovals,
          monthlyBurnRate: budget.burnRate * 30, // Convert daily to monthly
          projectedOverrun: budget.projectedDepletion ? 
            budget.projectedDepletion < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : false
        }
      };
      
    } finally {
      client.release();
    }
  }

  // ==================== BUDGET REQUEST PROCESSING ====================

  async submitBudgetRequest(request: SecretaryBudgetRequest): Promise<TreasuryApprovalWorkflow> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const requestId = `req-${request.department}-${Date.now()}`;
      
      // Determine approval chain based on amount and type
      const approvalChain = this.buildApprovalChain(request);
      
      // Create the request record
      await client.query(`
        INSERT INTO budget_requests (
          id, secretary_id, department, request_type, amount, purpose, 
          justification, urgency, category, vendor, contract_details,
          from_category, to_category, requested_date, required_by_date,
          approval_chain, current_step, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'pending')
      `, [
        requestId, request.secretaryId, request.department, request.requestType,
        request.amount, request.purpose, request.justification, request.urgency,
        request.category, request.vendor, 
        request.contractDetails ? JSON.stringify(request.contractDetails) : null,
        request.fromCategory, request.toCategory, request.requestedDate,
        request.requiredByDate, JSON.stringify(approvalChain), 0
      ]);

      // If it's an emergency request, auto-approve at secretary level
      if (request.urgency === 'emergency') {
        await this.processApprovalStep(requestId, request.secretaryId, true, 'Emergency authorization');
      }

      await client.query('COMMIT');

      return {
        requestId,
        requestType: request.requestType,
        department: request.department,
        amount: request.amount,
        approvalChain,
        currentStep: request.urgency === 'emergency' ? 1 : 0,
        status: request.urgency === 'emergency' ? 'approved' : 'pending'
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async processApprovalStep(
    requestId: string, 
    approverId: string, 
    approved: boolean, 
    notes?: string
  ): Promise<TreasuryApprovalWorkflow> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current request
      const requestResult = await client.query(`
        SELECT * FROM budget_requests WHERE id = $1
      `, [requestId]);

      if (requestResult.rows.length === 0) {
        throw new Error('Budget request not found');
      }

      const request = requestResult.rows[0];
      const approvalChain = request.approval_chain;
      const currentStep = request.current_step;

      // Update the current approval step
      if (currentStep < approvalChain.length) {
        approvalChain[currentStep].approved = approved;
        approvalChain[currentStep].approvedAt = new Date();
        approvalChain[currentStep].notes = notes;
      }

      let newStatus = request.status;
      let newStep = currentStep;

      if (approved) {
        // Move to next step or complete
        if (currentStep + 1 >= approvalChain.length) {
          newStatus = 'approved';
          await this.executeApprovedRequest(request);
        } else {
          newStep = currentStep + 1;
        }
      } else {
        newStatus = 'rejected';
      }

      // Update the request
      await client.query(`
        UPDATE budget_requests 
        SET approval_chain = $2, current_step = $3, status = $4, updated_at = NOW()
        WHERE id = $1
      `, [requestId, JSON.stringify(approvalChain), newStep, newStatus]);

      await client.query('COMMIT');

      return {
        requestId,
        requestType: request.request_type,
        department: request.department,
        amount: Number(request.amount),
        approvalChain,
        currentStep: newStep,
        status: newStatus,
        finalDecision: newStatus === 'approved' || newStatus === 'rejected' ? {
          approved: newStatus === 'approved',
          approvedBy: approverId,
          approvedAt: new Date(),
          notes
        } : undefined
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ==================== AUTOMATED BUDGET OPERATIONS ====================

  async executeApprovedRequest(request: any): Promise<void> {
    switch (request.request_type) {
      case 'expenditure':
        await this.executeExpenditureRequest(request);
        break;
      case 'reallocation':
        await this.executeReallocationRequest(request);
        break;
      case 'supplemental':
        await this.executeSupplementalRequest(request);
        break;
      case 'contract':
        await this.executeContractRequest(request);
        break;
    }
  }

  private async executeExpenditureRequest(request: any): Promise<void> {
    // Create expenditure record
    await this.treasuryService.requestExpenditure({
      campaignId: 1, // TODO: Get from context
      budgetId: `budget-1-${new Date().getFullYear()}`, // TODO: Get actual budget ID
      lineItemId: `line-1-${request.department}-${request.category}`, // TODO: Get actual line item
      department: request.department,
      category: request.category || 'operations',
      amount: Number(request.amount),
      requestedBy: request.secretary_id,
      authorizedBy: request.secretary_id,
      approvedBy: 'ai-secretary-treasury',
      purpose: request.purpose,
      description: request.justification,
      expenditureType: 'operational'
    });
  }

  private async executeReallocationRequest(request: any): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Reduce allocation from source category
      await client.query(`
        UPDATE department_line_items 
        SET budgeted_amount = budgeted_amount - $3,
            updated_at = NOW()
        WHERE department = $1 AND category = $2 AND campaign_id = 1
      `, [request.department, request.from_category, Number(request.amount)]);

      // Increase allocation to target category
      await client.query(`
        UPDATE department_line_items 
        SET budgeted_amount = budgeted_amount + $3,
            updated_at = NOW()
        WHERE department = $1 AND category = $2 AND campaign_id = 1
      `, [request.department, request.to_category, Number(request.amount)]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async executeSupplementalRequest(request: any): Promise<void> {
    // Create supplemental budget line item
    await this.departmentBudgetService.submitSpendingRequest({
      secretaryId: request.secretary_id,
      department: request.department,
      category: 'supplemental',
      amount: Number(request.amount),
      purpose: request.purpose,
      description: request.justification,
      justification: 'Approved supplemental budget request',
      urgency: 'routine'
    });
  }

  private async executeContractRequest(request: any): Promise<void> {
    // Create contract-based line item with milestones
    const contractDetails = request.contract_details ? JSON.parse(request.contract_details) : null;
    
    const lineItem = await this.departmentBudgetService.submitSpendingRequest({
      secretaryId: request.secretary_id,
      department: request.department,
      category: 'contracts',
      amount: Number(request.amount),
      purpose: request.purpose,
      description: request.justification,
      justification: `Contract: ${contractDetails?.contractType || 'Service Agreement'}`,
      urgency: 'routine',
      vendor: request.vendor,
      milestones: contractDetails?.milestones || []
    });
  }

  // ==================== HELPER METHODS ====================

  private determineSpendingPowers(department: string, title: string): CabinetSecretaryAuthority['spendingPowers'] {
    const basePowers = {
      canAuthorizeExpenditure: true,
      canReallocateBudget: true,
      canRequestSupplemental: true,
      canApproveContracts: true,
      maxContractValue: 50000 // Default $50k contract authority
    };

    // Adjust based on department
    switch (department) {
      case 'Defense':
        return { ...basePowers, maxContractValue: 500000 }; // $500k for defense contracts
      case 'State':
        return { ...basePowers, maxContractValue: 200000 }; // $200k for diplomatic contracts
      case 'Treasury':
        return { ...basePowers, maxContractValue: 1000000 }; // $1M for Treasury Secretary
      case 'Interior':
        return { ...basePowers, maxContractValue: 300000 }; // $300k for infrastructure contracts
      default:
        return basePowers;
    }
  }

  private buildApprovalChain(request: SecretaryBudgetRequest): TreasuryApprovalWorkflow['approvalChain'] {
    const chain: TreasuryApprovalWorkflow['approvalChain'] = [];

    // Secretary approval (always required)
    chain.push({
      approverRole: 'secretary',
      approverId: request.secretaryId,
      approverName: `${request.department} Secretary`,
      required: true
    });

    // Treasury approval based on amount and type
    if (request.amount > 100000 || request.requestType === 'supplemental') {
      chain.push({
        approverRole: 'treasury',
        approverId: 'ai-secretary-treasury',
        approverName: 'Treasury Secretary',
        required: true
      });
    }

    // Leader approval for very large amounts
    if (request.amount > 500000) {
      chain.push({
        approverRole: 'leader',
        approverId: 'leader-character-id', // TODO: Get actual leader ID
        approverName: 'Government Leader',
        required: true
      });
    }

    return chain;
  }
}

// Add the budget_requests table to the schema
export async function initializeBudgetRequestsTable(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS budget_requests (
        id TEXT PRIMARY KEY,
        secretary_id TEXT NOT NULL,
        department TEXT NOT NULL,
        request_type TEXT NOT NULL CHECK (request_type IN ('expenditure', 'reallocation', 'supplemental', 'contract')),
        
        -- Request Details
        amount NUMERIC NOT NULL,
        purpose TEXT NOT NULL,
        justification TEXT NOT NULL,
        urgency TEXT NOT NULL CHECK (urgency IN ('routine', 'urgent', 'emergency')),
        
        -- Type-specific Details
        category TEXT,
        vendor TEXT,
        contract_details JSONB,
        from_category TEXT,
        to_category TEXT,
        
        -- Timeline
        requested_date TIMESTAMP NOT NULL DEFAULT NOW(),
        required_by_date TIMESTAMP,
        
        -- Approval Workflow
        approval_chain JSONB NOT NULL DEFAULT '[]',
        current_step INT NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_budget_requests_secretary ON budget_requests(secretary_id);
      CREATE INDEX IF NOT EXISTS idx_budget_requests_department ON budget_requests(department);
      CREATE INDEX IF NOT EXISTS idx_budget_requests_status ON budget_requests(status);
      CREATE INDEX IF NOT EXISTS idx_budget_requests_type ON budget_requests(request_type);
    `);
    
    console.log('Budget requests table initialized successfully');
  } finally {
    client.release();
  }
}
