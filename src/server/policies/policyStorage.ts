import { initDatabase } from '../persistence/database';
import { Policy, PolicyModifier } from './policyEngine';
import { nanoid } from 'nanoid';

/**
 * Policy storage and management using SQLite database
 */
export class PolicyStorage {
  
  /**
   * Initialize policy tables in the database
   */
  static async initializePolicyTables(): Promise<void> {
    const db = await initDatabase();
    
    // Policies table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS policies (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        raw_text TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('draft', 'pending_approval', 'active', 'rejected', 'expired')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        activated_at DATETIME,
        expires_at DATETIME,
        approval_required BOOLEAN DEFAULT FALSE,
        risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
        estimated_impact TEXT NOT NULL,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
      )
    `);
    
    // Policy modifiers table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS policy_modifiers (
        id TEXT PRIMARY KEY,
        policy_id TEXT NOT NULL,
        type TEXT NOT NULL,
        target TEXT NOT NULL,
        operation TEXT NOT NULL CHECK (operation IN ('multiply', 'add', 'set')),
        value REAL NOT NULL,
        cap REAL NOT NULL,
        duration INTEGER,
        description TEXT NOT NULL,
        FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_policies_campaign_status 
      ON policies(campaign_id, status);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_policy_modifiers_policy 
      ON policy_modifiers(policy_id);
    `);
    
    console.log('✅ Policy tables initialized');
  }
  
  /**
   * Save a new policy to the database
   */
  static async savePolicy(policy: Omit<Policy, 'id' | 'createdAt'>): Promise<string> {
    const db = await initDatabase();
    const policyId = nanoid();
    
    await db.run('BEGIN TRANSACTION');
    
    try {
      // Insert policy
      await db.run(`
        INSERT INTO policies (
          id, campaign_id, title, description, raw_text, status,
          approval_required, risk_level, estimated_impact
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        policyId,
        policy.campaignId,
        policy.title,
        policy.description,
        policy.rawText,
        policy.status,
        policy.approvalRequired ? 1 : 0,
        policy.riskLevel,
        policy.estimatedImpact
      ]);
      
      // Insert modifiers
      for (const modifier of policy.modifiers) {
        await db.run(`
          INSERT INTO policy_modifiers (
            id, policy_id, type, target, operation, value, cap, duration, description
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          nanoid(),
          policyId,
          modifier.type,
          modifier.target,
          modifier.operation,
          modifier.value,
          modifier.cap,
          modifier.duration || null,
          modifier.description
        ]);
      }
      
      await db.run('COMMIT');
      console.log(`📋 Policy saved: ${policy.title} (ID: ${policyId})`);
      return policyId;
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }
  
  /**
   * Get policy by ID with all modifiers
   */
  static async getPolicyById(policyId: string): Promise<Policy | null> {
    const db = await initDatabase();
    
    // Get policy
    const policyRow = await db.get(`
      SELECT * FROM policies WHERE id = ?
    `, [policyId]);
    
    if (!policyRow) return null;
    
    // Get modifiers
    const modifierRows = await db.all(`
      SELECT * FROM policy_modifiers WHERE policy_id = ?
    `, [policyId]);
    
    const modifiers: PolicyModifier[] = modifierRows.map((row: any) => ({
      id: row.id,
      type: row.type,
      target: row.target,
      operation: row.operation,
      value: row.value,
      cap: row.cap,
      duration: row.duration,
      description: row.description
    }));
    
    return {
      id: policyRow.id,
      campaignId: policyRow.campaign_id,
      title: policyRow.title,
      description: policyRow.description,
      rawText: policyRow.raw_text,
      modifiers,
      status: policyRow.status,
      createdAt: new Date(policyRow.created_at),
      activatedAt: policyRow.activated_at ? new Date(policyRow.activated_at) : undefined,
      expiresAt: policyRow.expires_at ? new Date(policyRow.expires_at) : undefined,
      approvalRequired: Boolean(policyRow.approval_required),
      riskLevel: policyRow.risk_level,
      estimatedImpact: policyRow.estimated_impact
    };
  }
  
  /**
   * Get all policies for a campaign
   */
  static async getPoliciesForCampaign(
    campaignId: number, 
    status?: string
  ): Promise<Policy[]> {
    const db = await initDatabase();
    
    let query = `
      SELECT * FROM policies 
      WHERE campaign_id = ?
    `;
    const params: any[] = [campaignId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const policyRows = await db.all(query, params);
    
    // Get modifiers for all policies
    const policies: Policy[] = [];
    
    for (const policyRow of policyRows) {
      const modifierRows = await db.all(`
        SELECT * FROM policy_modifiers WHERE policy_id = ?
      `, [policyRow.id]);
      
      const modifiers: PolicyModifier[] = modifierRows.map((row: any) => ({
        id: row.id,
        type: row.type,
        target: row.target,
        operation: row.operation,
        value: row.value,
        cap: row.cap,
        duration: row.duration,
        description: row.description
      }));
      
      policies.push({
        id: policyRow.id,
        campaignId: policyRow.campaign_id,
        title: policyRow.title,
        description: policyRow.description,
        rawText: policyRow.raw_text,
        modifiers,
        status: policyRow.status,
        createdAt: new Date(policyRow.created_at),
        activatedAt: policyRow.activated_at ? new Date(policyRow.activated_at) : undefined,
        expiresAt: policyRow.expires_at ? new Date(policyRow.expires_at) : undefined,
        approvalRequired: Boolean(policyRow.approval_required),
        riskLevel: policyRow.risk_level,
        estimatedImpact: policyRow.estimated_impact
      });
    }
    
    return policies;
  }
  
  /**
   * Update policy status
   */
  static async updatePolicyStatus(
    policyId: string, 
    status: Policy['status'],
    activatedAt?: Date
  ): Promise<void> {
    const db = await initDatabase();
    
    const params: any[] = [status];
    let query = 'UPDATE policies SET status = ?';
    
    if (activatedAt && status === 'active') {
      query += ', activated_at = ?';
      params.push(activatedAt.toISOString());
    }
    
    query += ' WHERE id = ?';
    params.push(policyId);
    
    await db.run(query, params);
    
    console.log(`📋 Policy ${policyId} status updated to: ${status}`);
  }
  
  /**
   * Get active policy modifiers for a campaign
   */
  static async getActivePolicyModifiers(campaignId: number): Promise<PolicyModifier[]> {
    const activePolicies = await this.getPoliciesForCampaign(campaignId, 'active');
    
    const allModifiers: PolicyModifier[] = [];
    for (const policy of activePolicies) {
      allModifiers.push(...policy.modifiers);
    }
    
    return allModifiers;
  }
  
  /**
   * Delete a policy and all its modifiers
   */
  static async deletePolicy(policyId: string): Promise<void> {
    const db = await initDatabase();
    
    await db.run('BEGIN TRANSACTION');
    
    try {
      await db.run('DELETE FROM policy_modifiers WHERE policy_id = ?', [policyId]);
      await db.run('DELETE FROM policies WHERE id = ?', [policyId]);
      
      await db.run('COMMIT');
      console.log(`🗑️ Policy ${policyId} deleted`);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }
  
  /**
   * Get policy statistics for a campaign
   */
  static async getPolicyStats(campaignId: number): Promise<{
    total: number;
    active: number;
    pending: number;
    draft: number;
    byRiskLevel: { low: number; medium: number; high: number };
  }> {
    const db = await initDatabase();
    
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'pending_approval' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END) as low_risk,
        SUM(CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END) as medium_risk,
        SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_risk
      FROM policies 
      WHERE campaign_id = ?
    `, [campaignId]);
    
    return {
      total: stats.total || 0,
      active: stats.active || 0,
      pending: stats.pending || 0,
      draft: stats.draft || 0,
      byRiskLevel: {
        low: stats.low_risk || 0,
        medium: stats.medium_risk || 0,
        high: stats.high_risk || 0
      }
    };
  }
}
