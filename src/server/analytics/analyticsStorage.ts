import { initDatabase } from '../persistence/database';
import { KPISnapshot, TrendAnalysis, EmpireAnalytics } from './analyticsEngine';

/**
 * Analytics storage and management using SQLite database
 */
export class AnalyticsStorage {
  
  /**
   * Initialize analytics tables in the database
   */
  static async initializeAnalyticsTables(): Promise<void> {
    const db = await initDatabase();
    
    // KPI snapshots table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS kpi_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER NOT NULL,
        step INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        -- Core Empire KPIs
        population INTEGER NOT NULL,
        gdp REAL NOT NULL,
        gdp_growth_rate REAL NOT NULL DEFAULT 0,
        credits REAL NOT NULL,
        credit_growth_rate REAL NOT NULL DEFAULT 0,
        
        -- Resource KPIs
        total_resources REAL NOT NULL,
        resource_diversity INTEGER NOT NULL,
        resource_efficiency REAL NOT NULL,
        
        -- Infrastructure KPIs
        total_buildings INTEGER NOT NULL,
        infrastructure_index REAL NOT NULL,
        development_level TEXT NOT NULL CHECK (development_level IN ('primitive', 'developing', 'advanced', 'futuristic')),
        
        -- Economic KPIs
        trade_volume REAL NOT NULL DEFAULT 0,
        trade_balance REAL NOT NULL DEFAULT 0,
        market_indices TEXT NOT NULL DEFAULT '{}', -- JSON: {rawMaterials, manufactured, overall}
        
        -- Governance KPIs
        active_policies INTEGER NOT NULL DEFAULT 0,
        policy_effectiveness REAL NOT NULL DEFAULT 0,
        stability_index REAL NOT NULL,
        
        -- Research & Innovation KPIs
        research_points REAL NOT NULL DEFAULT 0,
        research_rate REAL NOT NULL DEFAULT 0,
        innovation_index REAL NOT NULL DEFAULT 0,
        
        -- Military & Security KPIs
        military_strength REAL NOT NULL DEFAULT 0,
        defense_index REAL NOT NULL DEFAULT 0,
        security_level REAL NOT NULL DEFAULT 0,
        
        -- Social KPIs
        population_growth REAL NOT NULL DEFAULT 0,
        satisfaction_index REAL NOT NULL DEFAULT 0,
        education_level REAL NOT NULL DEFAULT 0,
        health_index REAL NOT NULL DEFAULT 0,
        
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
        UNIQUE(campaign_id, step)
      )
    `);
    
    // Trend analysis cache table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS trend_analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER NOT NULL,
        period INTEGER NOT NULL,
        start_step INTEGER NOT NULL,
        end_step INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        trends TEXT NOT NULL, -- JSON: trend data
        correlations TEXT NOT NULL, -- JSON: correlation data
        insights TEXT NOT NULL, -- JSON: insights data
        
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes for performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_campaign_step 
      ON kpi_snapshots(campaign_id, step DESC);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_timestamp 
      ON kpi_snapshots(timestamp DESC);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_trend_analyses_campaign 
      ON trend_analyses(campaign_id, created_at DESC);
    `);
    
    console.log('✅ Analytics tables initialized');
  }
  
  /**
   * Save a KPI snapshot
   */
  static async saveKPISnapshot(snapshot: KPISnapshot): Promise<void> {
    const db = await initDatabase();
    
    await db.run(`
      INSERT OR REPLACE INTO kpi_snapshots (
        campaign_id, step, timestamp, population, gdp, gdp_growth_rate, credits, credit_growth_rate,
        total_resources, resource_diversity, resource_efficiency, total_buildings, infrastructure_index, 
        development_level, trade_volume, trade_balance, market_indices, active_policies, 
        policy_effectiveness, stability_index, research_points, research_rate, innovation_index,
        military_strength, defense_index, security_level, population_growth, satisfaction_index,
        education_level, health_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      snapshot.campaignId,
      snapshot.step,
      snapshot.timestamp.toISOString(),
      snapshot.population,
      snapshot.gdp,
      snapshot.gdpGrowthRate,
      snapshot.credits,
      snapshot.creditGrowthRate,
      snapshot.totalResources,
      snapshot.resourceDiversity,
      snapshot.resourceEfficiency,
      snapshot.totalBuildings,
      snapshot.infrastructureIndex,
      snapshot.developmentLevel,
      snapshot.tradeVolume,
      snapshot.tradeBalance,
      JSON.stringify(snapshot.marketIndices),
      snapshot.activePolicies,
      snapshot.policyEffectiveness,
      snapshot.stabilityIndex,
      snapshot.researchPoints,
      snapshot.researchRate,
      snapshot.innovationIndex,
      snapshot.militaryStrength,
      snapshot.defenseIndex,
      snapshot.securityLevel,
      snapshot.populationGrowth,
      snapshot.satisfactionIndex,
      snapshot.educationLevel,
      snapshot.healthIndex
    ]);
    
    console.log(`📊 KPI snapshot saved for campaign ${snapshot.campaignId}, step ${snapshot.step}`);
  }
  
  /**
   * Get KPI snapshots for a campaign
   */
  static async getKPISnapshots(
    campaignId: number,
    limit?: number,
    fromStep?: number,
    toStep?: number
  ): Promise<KPISnapshot[]> {
    const db = await initDatabase();
    
    let query = 'SELECT * FROM kpi_snapshots WHERE campaign_id = ?';
    const params: any[] = [campaignId];
    
    if (fromStep !== undefined) {
      query += ' AND step >= ?';
      params.push(fromStep);
    }
    
    if (toStep !== undefined) {
      query += ' AND step <= ?';
      params.push(toStep);
    }
    
    query += ' ORDER BY step DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }
    
    const rows = await db.all(query, params);
    
    return rows.map(row => ({
      step: row.step,
      timestamp: new Date(row.timestamp),
      campaignId: row.campaign_id,
      
      // Core Empire KPIs
      population: row.population,
      gdp: row.gdp,
      gdpGrowthRate: row.gdp_growth_rate,
      credits: row.credits,
      creditGrowthRate: row.credit_growth_rate,
      
      // Resource KPIs
      totalResources: row.total_resources,
      resourceDiversity: row.resource_diversity,
      resourceEfficiency: row.resource_efficiency,
      
      // Infrastructure KPIs
      totalBuildings: row.total_buildings,
      infrastructureIndex: row.infrastructure_index,
      developmentLevel: row.development_level,
      
      // Economic KPIs
      tradeVolume: row.trade_volume,
      tradeBalance: row.trade_balance,
      marketIndices: JSON.parse(row.market_indices),
      
      // Governance KPIs
      activePolicies: row.active_policies,
      policyEffectiveness: row.policy_effectiveness,
      stabilityIndex: row.stability_index,
      
      // Research & Innovation KPIs
      researchPoints: row.research_points,
      researchRate: row.research_rate,
      innovationIndex: row.innovation_index,
      
      // Military & Security KPIs
      militaryStrength: row.military_strength,
      defenseIndex: row.defense_index,
      securityLevel: row.security_level,
      
      // Social KPIs
      populationGrowth: row.population_growth,
      satisfactionIndex: row.satisfaction_index,
      educationLevel: row.education_level,
      healthIndex: row.health_index
    }));
  }
  
  /**
   * Get the latest KPI snapshot for a campaign
   */
  static async getLatestKPISnapshot(campaignId: number): Promise<KPISnapshot | null> {
    const snapshots = await this.getKPISnapshots(campaignId, 1);
    return snapshots.length > 0 ? snapshots[0] : null;
  }
  
  /**
   * Save trend analysis cache
   */
  static async saveTrendAnalysis(
    campaignId: number,
    trendAnalysis: TrendAnalysis
  ): Promise<void> {
    const db = await initDatabase();
    
    await db.run(`
      INSERT INTO trend_analyses (
        campaign_id, period, start_step, end_step, trends, correlations, insights
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      campaignId,
      trendAnalysis.period,
      trendAnalysis.startStep,
      trendAnalysis.endStep,
      JSON.stringify(trendAnalysis.trends),
      JSON.stringify(trendAnalysis.correlations),
      JSON.stringify(trendAnalysis.insights)
    ]);
    
    console.log(`📈 Trend analysis cached for campaign ${campaignId} (${trendAnalysis.period} steps)`);
  }
  
  /**
   * Get cached trend analysis
   */
  static async getCachedTrendAnalysis(
    campaignId: number,
    maxAge: number = 300000 // 5 minutes in milliseconds
  ): Promise<TrendAnalysis | null> {
    const db = await initDatabase();
    
    const row = await db.get(`
      SELECT * FROM trend_analyses 
      WHERE campaign_id = ? 
        AND created_at > datetime('now', '-${maxAge / 1000} seconds')
      ORDER BY created_at DESC 
      LIMIT 1
    `, [campaignId]);
    
    if (!row) return null;
    
    return {
      period: row.period,
      startStep: row.start_step,
      endStep: row.end_step,
      trends: JSON.parse(row.trends),
      correlations: JSON.parse(row.correlations),
      insights: JSON.parse(row.insights)
    };
  }
  
  /**
   * Get analytics statistics for a campaign
   */
  static async getAnalyticsStats(campaignId: number): Promise<{
    totalSnapshots: number;
    firstSnapshot: Date | null;
    lastSnapshot: Date | null;
    stepRange: { min: number; max: number } | null;
    dataCompleteness: number; // Percentage of expected snapshots
  }> {
    const db = await initDatabase();
    
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total_snapshots,
        MIN(timestamp) as first_snapshot,
        MAX(timestamp) as last_snapshot,
        MIN(step) as min_step,
        MAX(step) as max_step
      FROM kpi_snapshots 
      WHERE campaign_id = ?
    `, [campaignId]);
    
    const totalSnapshots = stats.total_snapshots || 0;
    const firstSnapshot = stats.first_snapshot ? new Date(stats.first_snapshot) : null;
    const lastSnapshot = stats.last_snapshot ? new Date(stats.last_snapshot) : null;
    const stepRange = stats.min_step !== null ? {
      min: stats.min_step,
      max: stats.max_step
    } : null;
    
    // Calculate data completeness (assuming we should have one snapshot per step)
    const expectedSnapshots = stepRange ? (stepRange.max - stepRange.min + 1) : 0;
    const dataCompleteness = expectedSnapshots > 0 ? (totalSnapshots / expectedSnapshots) * 100 : 0;
    
    return {
      totalSnapshots,
      firstSnapshot,
      lastSnapshot,
      stepRange,
      dataCompleteness: Math.min(100, dataCompleteness)
    };
  }
  
  /**
   * Get KPI trends for specific metrics
   */
  static async getKPITrends(
    campaignId: number,
    kpis: string[],
    steps: number = 20
  ): Promise<Record<string, Array<{ step: number; value: number; timestamp: Date }>>> {
    const db = await initDatabase();
    
    const snapshots = await this.getKPISnapshots(campaignId, steps);
    const trends: Record<string, Array<{ step: number; value: number; timestamp: Date }>> = {};
    
    // Initialize trends for each requested KPI
    kpis.forEach(kpi => {
      trends[kpi] = [];
    });
    
    // Map database column names to KPI names
    const columnMap: Record<string, string> = {
      population: 'population',
      gdp: 'gdp',
      credits: 'credits',
      totalResources: 'total_resources',
      infrastructureIndex: 'infrastructure_index',
      stabilityIndex: 'stability_index',
      militaryStrength: 'military_strength',
      satisfactionIndex: 'satisfaction_index'
    };
    
    // Extract trend data for each KPI
    snapshots.reverse().forEach(snapshot => {
      kpis.forEach(kpi => {
        const value = snapshot[kpi as keyof KPISnapshot] as number;
        if (typeof value === 'number') {
          trends[kpi].push({
            step: snapshot.step,
            value,
            timestamp: snapshot.timestamp
          });
        }
      });
    });
    
    return trends;
  }
  
  /**
   * Delete old snapshots to manage storage
   */
  static async cleanupOldSnapshots(
    campaignId: number,
    keepRecentSteps: number = 100
  ): Promise<number> {
    const db = await initDatabase();
    
    const result = await db.run(`
      DELETE FROM kpi_snapshots 
      WHERE campaign_id = ? 
        AND step < (
          SELECT MAX(step) - ? 
          FROM kpi_snapshots 
          WHERE campaign_id = ?
        )
    `, [campaignId, keepRecentSteps, campaignId]);
    
    const deletedCount = result.changes || 0;
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} old KPI snapshots for campaign ${campaignId}`);
    }
    
    return deletedCount;
  }
  
  /**
   * Get empire rankings across all campaigns (for leaderboard)
   */
  static async getEmpireRankings(
    kpi: keyof KPISnapshot = 'gdp',
    limit: number = 10
  ): Promise<Array<{
    campaignId: number;
    value: number;
    step: number;
    timestamp: Date;
    rank: number;
  }>> {
    const db = await initDatabase();
    
    const columnName = this.getColumnName(kpi);
    
    const rows = await db.all(`
      SELECT DISTINCT
        campaign_id,
        ${columnName} as value,
        step,
        timestamp,
        ROW_NUMBER() OVER (ORDER BY ${columnName} DESC) as rank
      FROM kpi_snapshots s1
      WHERE step = (
        SELECT MAX(step) 
        FROM kpi_snapshots s2 
        WHERE s2.campaign_id = s1.campaign_id
      )
      ORDER BY ${columnName} DESC
      LIMIT ?
    `, [limit]);
    
    return rows.map(row => ({
      campaignId: row.campaign_id,
      value: row.value,
      step: row.step,
      timestamp: new Date(row.timestamp),
      rank: row.rank
    }));
  }
  
  /**
   * Map KPI names to database column names
   */
  private static getColumnName(kpi: keyof KPISnapshot): string {
    const columnMap: Record<string, string> = {
      population: 'population',
      gdp: 'gdp',
      credits: 'credits',
      totalResources: 'total_resources',
      resourceDiversity: 'resource_diversity',
      resourceEfficiency: 'resource_efficiency',
      totalBuildings: 'total_buildings',
      infrastructureIndex: 'infrastructure_index',
      tradeVolume: 'trade_volume',
      tradeBalance: 'trade_balance',
      activePolicies: 'active_policies',
      policyEffectiveness: 'policy_effectiveness',
      stabilityIndex: 'stability_index',
      researchPoints: 'research_points',
      researchRate: 'research_rate',
      innovationIndex: 'innovation_index',
      militaryStrength: 'military_strength',
      defenseIndex: 'defense_index',
      securityLevel: 'security_level',
      populationGrowth: 'population_growth',
      satisfactionIndex: 'satisfaction_index',
      educationLevel: 'education_level',
      healthIndex: 'health_index'
    };
    
    return columnMap[kpi as string] || 'gdp';
  }
}




