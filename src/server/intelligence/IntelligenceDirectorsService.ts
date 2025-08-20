import { Pool } from 'pg';
import { 
  IntelligenceDirector, 
  IntelligenceAgency, 
  IntelligenceOperation, 
  ThreatAssessment, 
  IntelligenceReport, 
  IntelligenceOversight 
} from './intelligenceSchema.js';

export class IntelligenceDirectorsService {
  constructor(private pool: Pool) {}

  // Intelligence Directors Management
  async getIntelligenceDirectors(civilizationId: number): Promise<IntelligenceDirector[]> {
    const query = `
      SELECT * FROM intelligence_directors 
      WHERE civilization_id = $1 
      ORDER BY 
        CASE director_type 
          WHEN 'coordination' THEN 1 
          WHEN 'foreign' THEN 2 
          WHEN 'domestic' THEN 3 
        END,
        name
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async getIntelligenceDirector(id: number): Promise<IntelligenceDirector | null> {
    const query = 'SELECT * FROM intelligence_directors WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async appointIntelligenceDirector(appointment: Partial<IntelligenceDirector>): Promise<IntelligenceDirector> {
    const query = `
      INSERT INTO intelligence_directors (
        civilization_id, director_type, name, title, security_clearance,
        years_of_service, specializations, background, constitutional_authority, oversight_committee
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      appointment.civilization_id,
      appointment.director_type,
      appointment.name,
      appointment.title,
      appointment.security_clearance || 'top_secret',
      appointment.years_of_service || 0,
      appointment.specializations || [],
      appointment.background,
      appointment.constitutional_authority !== false,
      appointment.oversight_committee
    ]);
    return result.rows[0];
  }

  async updateIntelligenceDirector(id: number, updates: Partial<IntelligenceDirector>): Promise<IntelligenceDirector> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof IntelligenceDirector] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof IntelligenceDirector] !== undefined)
      .map(key => updates[key as keyof IntelligenceDirector]);

    const query = `
      UPDATE intelligence_directors 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  async retireIntelligenceDirector(id: number): Promise<void> {
    const query = `
      UPDATE intelligence_directors 
      SET status = 'retired', updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
    await this.pool.query(query, [id]);
  }

  // Intelligence Agencies Management
  async getIntelligenceAgencies(civilizationId: number): Promise<IntelligenceAgency[]> {
    const query = `
      SELECT ia.*, id.name as director_name, id.title as director_title
      FROM intelligence_agencies ia
      LEFT JOIN intelligence_directors id ON ia.director_id = id.id
      WHERE ia.civilization_id = $1
      ORDER BY ia.agency_name
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async getIntelligenceAgency(civilizationId: number, agencyCode: string): Promise<IntelligenceAgency | null> {
    const query = `
      SELECT ia.*, id.name as director_name, id.title as director_title
      FROM intelligence_agencies ia
      LEFT JOIN intelligence_directors id ON ia.director_id = id.id
      WHERE ia.civilization_id = $1 AND ia.agency_code = $2
    `;
    const result = await this.pool.query(query, [civilizationId, agencyCode]);
    return result.rows[0] || null;
  }

  async updateIntelligenceAgency(civilizationId: number, agencyCode: string, updates: Partial<IntelligenceAgency>): Promise<IntelligenceAgency> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'civilization_id' && key !== 'agency_code' && updates[key as keyof IntelligenceAgency] !== undefined)
      .map((key, index) => `${key} = $${index + 3}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'civilization_id' && key !== 'agency_code' && updates[key as keyof IntelligenceAgency] !== undefined)
      .map(key => updates[key as keyof IntelligenceAgency]);

    const query = `
      UPDATE intelligence_agencies 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE civilization_id = $1 AND agency_code = $2 
      RETURNING *
    `;
    const result = await this.pool.query(query, [civilizationId, agencyCode, ...values]);
    return result.rows[0];
  }

  // Intelligence Operations
  async getIntelligenceOperations(civilizationId: number, filters?: { status?: string; classification?: string; type?: string }): Promise<IntelligenceOperation[]> {
    let query = `
      SELECT io.*, ia.agency_name as lead_agency_name, id.name as created_by_name
      FROM intelligence_operations io
      LEFT JOIN intelligence_agencies ia ON io.lead_agency = ia.id
      LEFT JOIN intelligence_directors id ON io.created_by = id.id
      WHERE io.civilization_id = $1
    `;
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.status) {
      query += ` AND io.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.classification) {
      query += ` AND io.classification_level = $${paramIndex}`;
      params.push(filters.classification);
      paramIndex++;
    }

    if (filters?.type) {
      query += ` AND io.operation_type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    query += ' ORDER BY io.created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createIntelligenceOperation(operation: Partial<IntelligenceOperation>): Promise<IntelligenceOperation> {
    const query = `
      INSERT INTO intelligence_operations (
        civilization_id, operation_name, operation_type, classification_level,
        lead_agency, participating_agencies, target_type, target_description,
        objectives, resources_required, risk_assessment, legal_authorization,
        oversight_notifications, success_metrics, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      operation.civilization_id,
      operation.operation_name,
      operation.operation_type,
      operation.classification_level || 'classified',
      operation.lead_agency,
      operation.participating_agencies || [],
      operation.target_type,
      operation.target_description,
      operation.objectives || [],
      JSON.stringify(operation.resources_required || {}),
      operation.risk_assessment,
      operation.legal_authorization,
      operation.oversight_notifications || [],
      JSON.stringify(operation.success_metrics || {}),
      operation.created_by
    ]);
    return result.rows[0];
  }

  async authorizeIntelligenceOperation(operationId: number, authorizingOfficial: string): Promise<IntelligenceOperation> {
    const query = `
      UPDATE intelligence_operations 
      SET 
        status = 'approved',
        legal_authorization = COALESCE(legal_authorization, '') || CASE 
          WHEN legal_authorization IS NULL OR legal_authorization = '' THEN $2
          ELSE '; Authorized by ' || $2
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [operationId, authorizingOfficial]);
    return result.rows[0];
  }

  async executeIntelligenceOperation(operationId: number): Promise<IntelligenceOperation> {
    const query = `
      UPDATE intelligence_operations 
      SET 
        status = 'active',
        start_date = COALESCE(start_date, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [operationId]);
    return result.rows[0];
  }

  async completeIntelligenceOperation(operationId: number, operationalReport: string, lessonsLearned: string[]): Promise<IntelligenceOperation> {
    const query = `
      UPDATE intelligence_operations 
      SET 
        status = 'completed',
        end_date = CURRENT_TIMESTAMP,
        operational_report = $2,
        lessons_learned = $3,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [operationId, operationalReport, lessonsLearned]);
    return result.rows[0];
  }

  // Threat Assessments
  async getThreatAssessments(civilizationId: number, filters?: { threat_level?: string; threat_type?: string }): Promise<ThreatAssessment[]> {
    let query = `
      SELECT ta.*, id.name as last_updated_by_name
      FROM threat_assessments ta
      LEFT JOIN intelligence_directors id ON ta.last_updated_by = id.id
      WHERE ta.civilization_id = $1
    `;
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.threat_level) {
      query += ` AND ta.threat_level = $${paramIndex}`;
      params.push(filters.threat_level);
      paramIndex++;
    }

    if (filters?.threat_type) {
      query += ` AND ta.threat_type = $${paramIndex}`;
      params.push(filters.threat_type);
      paramIndex++;
    }

    query += ' ORDER BY ta.threat_level DESC, ta.updated_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createThreatAssessment(threat: Partial<ThreatAssessment>): Promise<ThreatAssessment> {
    const query = `
      INSERT INTO threat_assessments (
        civilization_id, threat_name, threat_type, threat_level, classification_level,
        source_agencies, threat_description, indicators, potential_impact,
        likelihood_assessment, recommended_actions, mitigation_strategies,
        intelligence_gaps, confidence_level, last_updated_by, briefed_to
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      threat.civilization_id,
      threat.threat_name,
      threat.threat_type,
      threat.threat_level || 'medium',
      threat.classification_level || 'classified',
      threat.source_agencies || [],
      threat.threat_description,
      threat.indicators || [],
      threat.potential_impact,
      threat.likelihood_assessment || 'possible',
      threat.recommended_actions || [],
      threat.mitigation_strategies || [],
      threat.intelligence_gaps || [],
      threat.confidence_level || 'medium',
      threat.last_updated_by,
      threat.briefed_to || []
    ]);
    return result.rows[0];
  }

  async updateThreatAssessment(id: number, updates: Partial<ThreatAssessment>): Promise<ThreatAssessment> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof ThreatAssessment] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof ThreatAssessment] !== undefined)
      .map(key => updates[key as keyof ThreatAssessment]);

    const query = `
      UPDATE threat_assessments 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  async getCurrentThreats(civilizationId: number, threatLevel?: string): Promise<ThreatAssessment[]> {
    const filters = threatLevel ? { threat_level: threatLevel } : undefined;
    return this.getThreatAssessments(civilizationId, filters);
  }

  // Intelligence Reports
  async getIntelligenceReports(civilizationId: number, filters?: { report_type?: string; classification?: string }): Promise<IntelligenceReport[]> {
    let query = `
      SELECT ir.*, ia.agency_name as author_agency_name, id.name as author_director_name
      FROM intelligence_reports ir
      LEFT JOIN intelligence_agencies ia ON ir.author_agency = ia.id
      LEFT JOIN intelligence_directors id ON ir.author_director = id.id
      WHERE ir.civilization_id = $1
    `;
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.report_type) {
      query += ` AND ir.report_type = $${paramIndex}`;
      params.push(filters.report_type);
      paramIndex++;
    }

    if (filters?.classification) {
      query += ` AND ir.classification_level = $${paramIndex}`;
      params.push(filters.classification);
      paramIndex++;
    }

    query += ' ORDER BY ir.created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createIntelligenceReport(report: Partial<IntelligenceReport>): Promise<IntelligenceReport> {
    const query = `
      INSERT INTO intelligence_reports (
        civilization_id, report_title, report_type, classification_level,
        author_agency, author_director, report_content, key_findings,
        recommendations, sources_methods, distribution_list, related_operations,
        related_threats, confidence_assessment, follow_up_required, follow_up_actions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      report.civilization_id,
      report.report_title,
      report.report_type,
      report.classification_level || 'classified',
      report.author_agency,
      report.author_director,
      report.report_content,
      report.key_findings || [],
      report.recommendations || [],
      report.sources_methods,
      report.distribution_list || [],
      report.related_operations || [],
      report.related_threats || [],
      JSON.stringify(report.confidence_assessment || {}),
      report.follow_up_required || false,
      report.follow_up_actions || []
    ]);
    return result.rows[0];
  }

  async generateDailyBrief(civilizationId: number): Promise<IntelligenceReport> {
    // Get current high-priority threats
    const threats = await this.getCurrentThreats(civilizationId, 'high');
    const activeOperations = await this.getIntelligenceOperations(civilizationId, { status: 'active' });
    
    const briefContent = this.compileDailyBrief(threats, activeOperations);
    
    const dailyBrief: Partial<IntelligenceReport> = {
      civilization_id: civilizationId,
      report_title: `Daily Intelligence Brief - ${new Date().toISOString().split('T')[0]}`,
      report_type: 'daily_brief',
      classification_level: 'top_secret',
      report_content: briefContent.content,
      key_findings: briefContent.keyFindings,
      recommendations: briefContent.recommendations,
      distribution_list: ['Leader', 'Defense Secretary', 'State Secretary', 'National Security Advisor'],
      related_threats: threats.map(t => t.id),
      related_operations: activeOperations.map(op => op.id),
      confidence_assessment: briefContent.confidenceAssessment
    };

    return this.createIntelligenceReport(dailyBrief);
  }

  private compileDailyBrief(threats: ThreatAssessment[], operations: IntelligenceOperation[]) {
    const content = `
DAILY INTELLIGENCE BRIEF
Classification: TOP SECRET
Date: ${new Date().toISOString().split('T')[0]}

EXECUTIVE SUMMARY:
Current threat landscape shows ${threats.length} high-priority threats requiring immediate attention.
${operations.length} active intelligence operations are currently underway.

THREAT ASSESSMENT:
${threats.map(t => `- ${t.threat_name}: ${t.threat_level.toUpperCase()} threat (${t.likelihood_assessment})`).join('\n')}

OPERATIONAL STATUS:
${operations.map(op => `- ${op.operation_name}: ${op.status.toUpperCase()} (${op.operation_type})`).join('\n')}

INTELLIGENCE GAPS:
${threats.flatMap(t => t.intelligence_gaps).slice(0, 5).map(gap => `- ${gap}`).join('\n')}

RECOMMENDED ACTIONS:
${threats.flatMap(t => t.recommended_actions).slice(0, 5).map(action => `- ${action}`).join('\n')}
    `.trim();

    return {
      content,
      keyFindings: [
        `${threats.length} high-priority threats identified`,
        `${operations.length} active operations in progress`,
        'Enhanced security measures recommended'
      ],
      recommendations: [
        'Continue monitoring high-priority threats',
        'Maintain operational security protocols',
        'Brief senior leadership on threat developments'
      ],
      confidenceAssessment: {
        overall_confidence: 'high',
        threat_assessment_confidence: 'medium',
        operational_status_confidence: 'high'
      }
    };
  }

  async distributeIntelligenceReport(reportId: number, distributionList: string[]): Promise<void> {
    const query = `
      UPDATE intelligence_reports 
      SET distribution_list = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
    await this.pool.query(query, [reportId, distributionList]);
  }

  // Intelligence Oversight
  async getIntelligenceOversight(civilizationId: number, filters?: { status?: string; oversight_type?: string }): Promise<IntelligenceOversight[]> {
    let query = `
      SELECT * FROM intelligence_oversight 
      WHERE civilization_id = $1
    `;
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.oversight_type) {
      query += ` AND oversight_type = $${paramIndex}`;
      params.push(filters.oversight_type);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createOversightReview(review: Partial<IntelligenceOversight>): Promise<IntelligenceOversight> {
    const query = `
      INSERT INTO intelligence_oversight (
        civilization_id, oversight_type, oversight_body, review_subject,
        review_type, related_operations, related_agencies, classification_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      review.civilization_id,
      review.oversight_type,
      review.oversight_body,
      review.review_subject,
      review.review_type,
      review.related_operations || [],
      review.related_agencies || [],
      review.classification_level || 'classified'
    ]);
    return result.rows[0];
  }

  async updateOversightStatus(id: number, status: string, findings?: string): Promise<IntelligenceOversight> {
    const query = `
      UPDATE intelligence_oversight 
      SET 
        status = $2,
        findings = COALESCE($3, findings),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [id, status, findings]);
    return result.rows[0];
  }

  // Analytics and Reporting
  async analyzeThreatLandscape(civilizationId: number): Promise<any> {
    const threatsQuery = `
      SELECT 
        threat_type,
        threat_level,
        COUNT(*) as count,
        AVG(CASE 
          WHEN likelihood_assessment = 'certain' THEN 5
          WHEN likelihood_assessment = 'highly_likely' THEN 4
          WHEN likelihood_assessment = 'likely' THEN 3
          WHEN likelihood_assessment = 'possible' THEN 2
          ELSE 1
        END) as avg_likelihood
      FROM threat_assessments 
      WHERE civilization_id = $1
      GROUP BY threat_type, threat_level
      ORDER BY threat_level DESC, count DESC
    `;
    const threats = await this.pool.query(threatsQuery, [civilizationId]);

    const overallQuery = `
      SELECT 
        COUNT(*) as total_threats,
        COUNT(CASE WHEN threat_level IN ('critical', 'imminent') THEN 1 END) as critical_threats,
        COUNT(CASE WHEN threat_level = 'high' THEN 1 END) as high_threats,
        COUNT(CASE WHEN threat_level = 'medium' THEN 1 END) as medium_threats
      FROM threat_assessments 
      WHERE civilization_id = $1
    `;
    const overall = await this.pool.query(overallQuery, [civilizationId]);

    return {
      threat_breakdown: threats.rows,
      overall_assessment: overall.rows[0],
      threat_level_score: this.calculateThreatScore(threats.rows),
      generated_at: new Date()
    };
  }

  async assessOperationalEffectiveness(civilizationId: number, timeframe: string = '30d'): Promise<any> {
    const timeCondition = timeframe === '30d' ? "created_at >= NOW() - INTERVAL '30 days'" :
                         timeframe === '90d' ? "created_at >= NOW() - INTERVAL '90 days'" :
                         timeframe === '1y' ? "created_at >= NOW() - INTERVAL '1 year'" :
                         "TRUE";

    const operationsQuery = `
      SELECT 
        operation_type,
        status,
        COUNT(*) as count,
        AVG(EXTRACT(EPOCH FROM (COALESCE(end_date, CURRENT_TIMESTAMP) - start_date))/86400) as avg_duration_days
      FROM intelligence_operations 
      WHERE civilization_id = $1 AND ${timeCondition}
      GROUP BY operation_type, status
      ORDER BY operation_type, status
    `;
    const operations = await this.pool.query(operationsQuery, [civilizationId]);

    const successQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'compromised' THEN 1 END) as compromised,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COUNT(*) as total
      FROM intelligence_operations 
      WHERE civilization_id = $1 AND ${timeCondition}
    `;
    const success = await this.pool.query(successQuery, [civilizationId]);

    return {
      timeframe,
      operations_by_type_status: operations.rows,
      success_metrics: success.rows[0],
      effectiveness_score: this.calculateEffectivenessScore(success.rows[0]),
      generated_at: new Date()
    };
  }

  async evaluateInterAgencyCoordination(civilizationId: number): Promise<any> {
    const coordinationQuery = `
      SELECT 
        array_length(participating_agencies, 1) as agency_count,
        COUNT(*) as operation_count
      FROM intelligence_operations 
      WHERE civilization_id = $1 AND status IN ('completed', 'active')
      GROUP BY array_length(participating_agencies, 1)
      ORDER BY agency_count
    `;
    const coordination = await this.pool.query(coordinationQuery, [civilizationId]);

    const oversightQuery = `
      SELECT 
        oversight_type,
        COUNT(*) as review_count,
        COUNT(CASE WHEN compliance_status = 'compliant' THEN 1 END) as compliant_count
      FROM intelligence_oversight 
      WHERE civilization_id = $1
      GROUP BY oversight_type
    `;
    const oversight = await this.pool.query(oversightQuery, [civilizationId]);

    return {
      inter_agency_coordination: coordination.rows,
      oversight_compliance: oversight.rows,
      coordination_score: this.calculateCoordinationScore(coordination.rows),
      generated_at: new Date()
    };
  }

  private calculateThreatScore(threats: any[]): number {
    const weights = { critical: 5, imminent: 5, high: 3, medium: 2, low: 1 };
    const totalScore = threats.reduce((sum, threat) => {
      const weight = weights[threat.threat_level as keyof typeof weights] || 1;
      return sum + (weight * threat.count);
    }, 0);
    
    const totalThreats = threats.reduce((sum, threat) => sum + threat.count, 0);
    return totalThreats > 0 ? Math.round((totalScore / totalThreats) * 100) / 100 : 0;
  }

  private calculateEffectivenessScore(metrics: any): number {
    const total = parseInt(metrics.total) || 0;
    const completed = parseInt(metrics.completed) || 0;
    const compromised = parseInt(metrics.compromised) || 0;
    
    if (total === 0) return 0;
    
    const successRate = completed / total;
    const compromiseRate = compromised / total;
    
    // Effectiveness score: success rate minus compromise penalty
    return Math.max(0, Math.round((successRate - (compromiseRate * 0.5)) * 100) / 100);
  }

  private calculateCoordinationScore(coordination: any[]): number {
    const totalOps = coordination.reduce((sum, coord) => sum + coord.operation_count, 0);
    const multiAgencyOps = coordination
      .filter(coord => coord.agency_count > 1)
      .reduce((sum, coord) => sum + coord.operation_count, 0);
    
    return totalOps > 0 ? Math.round((multiAgencyOps / totalOps) * 100) / 100 : 0;
  }
}

// Service instance
let intelligenceDirectorsService: IntelligenceDirectorsService | null = null;

export function getIntelligenceDirectorsService(): IntelligenceDirectorsService {
  if (!intelligenceDirectorsService) {
    throw new Error('IntelligenceDirectorsService not initialized. Call initializeIntelligenceDirectorsService first.');
  }
  return intelligenceDirectorsService;
}

export function initializeIntelligenceDirectorsService(pool: Pool): void {
  intelligenceDirectorsService = new IntelligenceDirectorsService(pool);
}
