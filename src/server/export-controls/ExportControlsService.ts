/**
 * Export Controls Service
 * Manages export policies, technology restrictions, and approval processes
 */

import { Pool } from 'pg';

export interface ExportControlPolicy {
  id: string;
  campaignId: string;
  civilizationId: string;
  name: string;
  description: string;
  type: 'technology' | 'resource' | 'military' | 'dual_use' | 'strategic' | 'cultural';
  status: 'active' | 'suspended' | 'under_review' | 'expired';
  
  // Target Specifications
  targetCivilizations: string[]; // Empty array = applies to all
  targetTechnologies: string[];
  targetResources: string[];
  targetCategories: string[];
  
  // Control Level
  controlLevel: 'prohibited' | 'restricted' | 'licensed' | 'monitored' | 'unrestricted';
  requiresApproval: boolean;
  approvalAuthority: 'leader' | 'cabinet' | 'legislature' | 'intelligence' | 'military';
  
  // Conditions
  conditions: ExportCondition[];
  exceptions: ExportException[];
  
  // Timing
  effectiveDate: Date;
  expirationDate?: Date;
  reviewDate?: Date;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  rationale: string;
  securityClassification: 'public' | 'restricted' | 'confidential' | 'secret' | 'top_secret';
}

export interface ExportCondition {
  id: string;
  type: 'quantity_limit' | 'time_restriction' | 'end_use_verification' | 'relationship_status' | 'security_clearance';
  description: string;
  parameters: any;
  mandatory: boolean;
}

export interface ExportException {
  id: string;
  type: 'humanitarian' | 'scientific_cooperation' | 'alliance_member' | 'emergency' | 'diplomatic';
  description: string;
  conditions: string[];
  approvalRequired: boolean;
}

export interface ExportLicense {
  id: string;
  campaignId: string;
  civilizationId: string;
  applicantId: string; // Character or organization
  
  // Application Details
  applicationDate: Date;
  requestedItems: ExportItem[];
  destinationCivilization: string;
  endUse: string;
  endUser: string;
  
  // Status
  status: 'pending' | 'under_review' | 'approved' | 'denied' | 'suspended' | 'expired';
  reviewedBy: string[];
  approvedBy?: string;
  
  // License Terms
  licenseNumber?: string;
  issuedDate?: Date;
  expirationDate?: Date;
  conditions: string[];
  restrictions: string[];
  
  // Compliance
  complianceReports: ComplianceReport[];
  violations: Violation[];
  
  // AI Analysis
  riskAssessment: RiskAssessment;
  aiRecommendation: 'approve' | 'deny' | 'conditional' | 'investigate';
  confidenceScore: number; // 0-100
}

export interface ExportItem {
  itemId: string;
  itemType: 'technology' | 'resource' | 'equipment' | 'information';
  name: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  controlClassification: string;
  sensitivityLevel: number; // 1-10
}

export interface ComplianceReport {
  id: string;
  reportDate: Date;
  reportedBy: string;
  status: 'compliant' | 'minor_violation' | 'major_violation' | 'under_investigation';
  findings: string[];
  corrective_actions: string[];
}

export interface Violation {
  id: string;
  violationType: 'unauthorized_export' | 'end_use_violation' | 'quantity_exceeded' | 'destination_violation' | 'reporting_failure';
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  discoveredDate: Date;
  investigationStatus: 'open' | 'closed' | 'pending';
  penalties: string[];
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  mitigationMeasures: string[];
  monitoringRequirements: string[];
  reviewFrequency: 'monthly' | 'quarterly' | 'annually' | 'as_needed';
}

export interface RiskFactor {
  category: 'political' | 'security' | 'economic' | 'technological' | 'diplomatic';
  level: number; // 1-10
  description: string;
  weight: number; // 0-1
}

export interface ExportStatistics {
  totalPolicies: number;
  activePolicies: number;
  totalLicenses: number;
  pendingApplications: number;
  approvalRate: number;
  averageProcessingTime: number; // in days
  complianceRate: number;
  violationCount: number;
  restrictedCivilizations: string[];
  controlledTechnologies: string[];
}

export class ExportControlsService {
  constructor(private pool: Pool) {}

  /**
   * Get all export control policies for a civilization
   */
  async getPolicies(campaignId: string, civilizationId: string, status?: ExportControlPolicy['status']): Promise<ExportControlPolicy[]> {
    try {
      let query = `
        SELECT * FROM export_control_policies 
        WHERE campaign_id = $1 AND civilization_id = $2
      `;
      const params: any[] = [campaignId, civilizationId];

      if (status) {
        query += ` AND status = $3`;
        params.push(status);
      }

      query += ` ORDER BY effective_date DESC`;

      const result = await this.pool.query(query, params);
      return result.rows.map(row => this.mapRowToPolicy(row));
    } catch (error) {
      console.error('Error getting export control policies:', error);
      throw error;
    }
  }

  /**
   * Create a new export control policy
   */
  async createPolicy(policy: Omit<ExportControlPolicy, 'id' | 'createdAt' | 'lastModified'>): Promise<ExportControlPolicy> {
    try {
      const id = `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      const result = await this.pool.query(`
        INSERT INTO export_control_policies (
          id, campaign_id, civilization_id, name, description, type, status,
          target_civilizations, target_technologies, target_resources, target_categories,
          control_level, requires_approval, approval_authority, conditions, exceptions,
          effective_date, expiration_date, review_date, created_by, created_at,
          last_modified, rationale, security_classification
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24
        ) RETURNING *
      `, [
        id, policy.campaignId, policy.civilizationId, policy.name, policy.description,
        policy.type, policy.status, JSON.stringify(policy.targetCivilizations),
        JSON.stringify(policy.targetTechnologies), JSON.stringify(policy.targetResources),
        JSON.stringify(policy.targetCategories), policy.controlLevel, policy.requiresApproval,
        policy.approvalAuthority, JSON.stringify(policy.conditions), JSON.stringify(policy.exceptions),
        policy.effectiveDate, policy.expirationDate, policy.reviewDate, policy.createdBy,
        now, now, policy.rationale, policy.securityClassification
      ]);

      return this.mapRowToPolicy(result.rows[0]);
    } catch (error) {
      console.error('Error creating export control policy:', error);
      throw error;
    }
  }

  /**
   * Apply for an export license
   */
  async applyForLicense(application: Omit<ExportLicense, 'id' | 'applicationDate' | 'status' | 'riskAssessment' | 'aiRecommendation' | 'confidenceScore'>): Promise<ExportLicense> {
    try {
      const id = `license_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const applicationDate = new Date();

      // Perform AI risk assessment
      const riskAssessment = await this.performRiskAssessment(application);
      const aiRecommendation = this.generateAIRecommendation(riskAssessment);
      const confidenceScore = this.calculateConfidenceScore(riskAssessment);

      const result = await this.pool.query(`
        INSERT INTO export_licenses (
          id, campaign_id, civilization_id, applicant_id, application_date,
          requested_items, destination_civilization, end_use, end_user, status,
          reviewed_by, conditions, restrictions, compliance_reports, violations,
          risk_assessment, ai_recommendation, confidence_score
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING *
      `, [
        id, application.campaignId, application.civilizationId, application.applicantId,
        applicationDate, JSON.stringify(application.requestedItems), application.destinationCivilization,
        application.endUse, application.endUser, 'pending', JSON.stringify([]),
        JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), JSON.stringify([]),
        JSON.stringify(riskAssessment), aiRecommendation, confidenceScore
      ]);

      return this.mapRowToLicense(result.rows[0]);
    } catch (error) {
      console.error('Error applying for export license:', error);
      throw error;
    }
  }

  /**
   * Review and approve/deny a license application
   */
  async reviewLicense(licenseId: string, reviewerId: string, decision: 'approved' | 'denied', conditions?: string[], restrictions?: string[]): Promise<ExportLicense> {
    try {
      const license = await this.getLicense(licenseId);
      if (!license) throw new Error('License not found');

      const updates: any = {
        status: decision,
        reviewed_by: JSON.stringify([...license.reviewedBy, reviewerId])
      };

      if (decision === 'approved') {
        updates.approved_by = reviewerId;
        updates.issued_date = new Date();
        updates.license_number = `EL-${Date.now()}`;
        updates.expiration_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
        if (conditions) updates.conditions = JSON.stringify(conditions);
        if (restrictions) updates.restrictions = JSON.stringify(restrictions);
      }

      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [licenseId, ...Object.values(updates)];

      const result = await this.pool.query(`
        UPDATE export_licenses 
        SET ${setClause}, last_modified = NOW()
        WHERE id = $1
        RETURNING *
      `, values);

      return this.mapRowToLicense(result.rows[0]);
    } catch (error) {
      console.error('Error reviewing license:', error);
      throw error;
    }
  }

  /**
   * Check if an export is permitted under current policies
   */
  async checkExportPermission(
    campaignId: string,
    civilizationId: string,
    destinationCivilization: string,
    items: ExportItem[]
  ): Promise<{
    permitted: boolean;
    requiredLicenses: string[];
    blockedItems: ExportItem[];
    warnings: string[];
    recommendations: string[];
  }> {
    try {
      const policies = await this.getPolicies(campaignId, civilizationId, 'active');
      
      let permitted = true;
      const requiredLicenses: string[] = [];
      const blockedItems: ExportItem[] = [];
      const warnings: string[] = [];
      const recommendations: string[] = [];

      for (const item of items) {
        const applicablePolicies = policies.filter(policy => 
          this.isPolicyApplicable(policy, destinationCivilization, item)
        );

        for (const policy of applicablePolicies) {
          switch (policy.controlLevel) {
            case 'prohibited':
              permitted = false;
              blockedItems.push(item);
              warnings.push(`${item.name} is prohibited for export to ${destinationCivilization}`);
              break;
            
            case 'restricted':
            case 'licensed':
              requiredLicenses.push(policy.id);
              recommendations.push(`License required for ${item.name} under policy ${policy.name}`);
              break;
            
            case 'monitored':
              recommendations.push(`Export of ${item.name} will be monitored under policy ${policy.name}`);
              break;
          }
        }
      }

      return {
        permitted,
        requiredLicenses,
        blockedItems,
        warnings,
        recommendations
      };
    } catch (error) {
      console.error('Error checking export permission:', error);
      throw error;
    }
  }

  /**
   * Get export statistics for a civilization
   */
  async getExportStatistics(campaignId: string, civilizationId: string): Promise<ExportStatistics> {
    try {
      const [policiesResult, licensesResult] = await Promise.all([
        this.pool.query('SELECT status FROM export_control_policies WHERE campaign_id = $1 AND civilization_id = $2', [campaignId, civilizationId]),
        this.pool.query('SELECT status, application_date, reviewed_by FROM export_licenses WHERE campaign_id = $1 AND civilization_id = $2', [campaignId, civilizationId])
      ]);

      const policies = policiesResult.rows;
      const licenses = licensesResult.rows;

      const totalPolicies = policies.length;
      const activePolicies = policies.filter(p => p.status === 'active').length;
      const totalLicenses = licenses.length;
      const pendingApplications = licenses.filter(l => l.status === 'pending').length;
      const approvedLicenses = licenses.filter(l => l.status === 'approved').length;
      const approvalRate = totalLicenses > 0 ? (approvedLicenses / totalLicenses) * 100 : 0;

      // Calculate average processing time (mock calculation)
      const averageProcessingTime = 14; // days

      return {
        totalPolicies,
        activePolicies,
        totalLicenses,
        pendingApplications,
        approvalRate,
        averageProcessingTime,
        complianceRate: 95, // Mock value
        violationCount: 2, // Mock value
        restrictedCivilizations: [], // Would be calculated from policies
        controlledTechnologies: [] // Would be calculated from policies
      };
    } catch (error) {
      console.error('Error getting export statistics:', error);
      throw error;
    }
  }

  /**
   * Get a specific license by ID
   */
  async getLicense(licenseId: string): Promise<ExportLicense | null> {
    try {
      const result = await this.pool.query('SELECT * FROM export_licenses WHERE id = $1', [licenseId]);
      if (result.rows.length === 0) return null;
      return this.mapRowToLicense(result.rows[0]);
    } catch (error) {
      console.error('Error getting license:', error);
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private mapRowToPolicy(row: any): ExportControlPolicy {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      civilizationId: row.civilization_id,
      name: row.name,
      description: row.description,
      type: row.type,
      status: row.status,
      targetCivilizations: row.target_civilizations ? JSON.parse(row.target_civilizations) : [],
      targetTechnologies: row.target_technologies ? JSON.parse(row.target_technologies) : [],
      targetResources: row.target_resources ? JSON.parse(row.target_resources) : [],
      targetCategories: row.target_categories ? JSON.parse(row.target_categories) : [],
      controlLevel: row.control_level,
      requiresApproval: row.requires_approval,
      approvalAuthority: row.approval_authority,
      conditions: row.conditions ? JSON.parse(row.conditions) : [],
      exceptions: row.exceptions ? JSON.parse(row.exceptions) : [],
      effectiveDate: row.effective_date,
      expirationDate: row.expiration_date,
      reviewDate: row.review_date,
      createdBy: row.created_by,
      createdAt: row.created_at,
      lastModified: row.last_modified,
      rationale: row.rationale,
      securityClassification: row.security_classification
    };
  }

  private mapRowToLicense(row: any): ExportLicense {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      civilizationId: row.civilization_id,
      applicantId: row.applicant_id,
      applicationDate: row.application_date,
      requestedItems: row.requested_items ? JSON.parse(row.requested_items) : [],
      destinationCivilization: row.destination_civilization,
      endUse: row.end_use,
      endUser: row.end_user,
      status: row.status,
      reviewedBy: row.reviewed_by ? JSON.parse(row.reviewed_by) : [],
      approvedBy: row.approved_by,
      licenseNumber: row.license_number,
      issuedDate: row.issued_date,
      expirationDate: row.expiration_date,
      conditions: row.conditions ? JSON.parse(row.conditions) : [],
      restrictions: row.restrictions ? JSON.parse(row.restrictions) : [],
      complianceReports: row.compliance_reports ? JSON.parse(row.compliance_reports) : [],
      violations: row.violations ? JSON.parse(row.violations) : [],
      riskAssessment: row.risk_assessment ? JSON.parse(row.risk_assessment) : { overallRisk: 'medium', factors: [], mitigationMeasures: [], monitoringRequirements: [], reviewFrequency: 'quarterly' },
      aiRecommendation: row.ai_recommendation,
      confidenceScore: row.confidence_score
    };
  }

  private isPolicyApplicable(policy: ExportControlPolicy, destinationCivilization: string, item: ExportItem): boolean {
    // Check if policy applies to this destination
    if (policy.targetCivilizations.length > 0 && !policy.targetCivilizations.includes(destinationCivilization)) {
      return false;
    }

    // Check if policy applies to this item type
    if (policy.targetTechnologies.length > 0 && item.itemType === 'technology' && !policy.targetTechnologies.includes(item.itemId)) {
      return false;
    }

    if (policy.targetResources.length > 0 && item.itemType === 'resource' && !policy.targetResources.includes(item.itemId)) {
      return false;
    }

    return true;
  }

  private async performRiskAssessment(application: Partial<ExportLicense>): Promise<RiskAssessment> {
    // Mock AI risk assessment - would integrate with actual AI system
    const factors: RiskFactor[] = [
      {
        category: 'political',
        level: Math.floor(Math.random() * 5) + 1,
        description: 'Political stability of destination civilization',
        weight: 0.3
      },
      {
        category: 'security',
        level: Math.floor(Math.random() * 5) + 1,
        description: 'Security implications of technology transfer',
        weight: 0.4
      },
      {
        category: 'economic',
        level: Math.floor(Math.random() * 5) + 1,
        description: 'Economic impact on domestic industry',
        weight: 0.2
      },
      {
        category: 'diplomatic',
        level: Math.floor(Math.random() * 5) + 1,
        description: 'Impact on diplomatic relations',
        weight: 0.1
      }
    ];

    const weightedRisk = factors.reduce((sum, factor) => sum + (factor.level * factor.weight), 0);
    const overallRisk = weightedRisk < 2 ? 'low' : weightedRisk < 3.5 ? 'medium' : weightedRisk < 4.5 ? 'high' : 'critical';

    return {
      overallRisk,
      factors,
      mitigationMeasures: ['Regular compliance monitoring', 'End-use verification'],
      monitoringRequirements: ['Quarterly reports', 'Site inspections'],
      reviewFrequency: 'quarterly'
    };
  }

  private generateAIRecommendation(riskAssessment: RiskAssessment): 'approve' | 'deny' | 'conditional' | 'investigate' {
    switch (riskAssessment.overallRisk) {
      case 'low': return 'approve';
      case 'medium': return 'conditional';
      case 'high': return 'investigate';
      case 'critical': return 'deny';
      default: return 'investigate';
    }
  }

  private calculateConfidenceScore(riskAssessment: RiskAssessment): number {
    // Mock confidence calculation based on risk factors
    const baseConfidence = 85;
    const riskPenalty = riskAssessment.factors.reduce((penalty, factor) => penalty + (factor.level * 2), 0);
    return Math.max(50, baseConfidence - riskPenalty);
  }
}

export default ExportControlsService;

