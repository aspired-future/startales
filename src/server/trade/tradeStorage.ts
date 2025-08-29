import { initDatabase } from '../persistence/database';
import { TradePrice, TradeRoute, TradeContract, TradeAnalytics } from './tradeEngine';

/**
 * Trade storage and management using SQLite database
 */
export class TradeStorage {
  
  /**
   * Initialize trade tables in the database
   */
  static async initializeTradeTables(): Promise<void> {
    const db = await initDatabase();
    
    // Trade prices table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS trade_prices (
        resource_id TEXT PRIMARY KEY,
        current_price REAL NOT NULL,
        supply INTEGER NOT NULL,
        demand INTEGER NOT NULL,
        trend TEXT NOT NULL CHECK (trend IN ('rising', 'falling', 'stable')),
        last_updated INTEGER NOT NULL,
        price_history TEXT NOT NULL -- JSON array of price history
      )
    `);
    
    // Trade routes table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS trade_routes (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        resources TEXT NOT NULL, -- JSON array of resource IDs
        distance REAL NOT NULL,
        travel_time INTEGER NOT NULL,
        capacity INTEGER NOT NULL,
        tariff_rate REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'blocked')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used DATETIME,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
      )
    `);
    
    // Trade contracts table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS trade_contracts (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'exchange')),
        resource_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price_per_unit REAL NOT NULL,
        total_value REAL NOT NULL,
        counterparty TEXT NOT NULL,
        route_id TEXT,
        status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'failed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivery_deadline DATETIME,
        completed_at DATETIME,
        terms TEXT NOT NULL, -- JSON object with payment and delivery terms
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY (route_id) REFERENCES trade_routes(id) ON DELETE SET NULL
      )
    `);
    
    // Create indexes
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_trade_routes_campaign 
      ON trade_routes(campaign_id, status);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_trade_contracts_campaign_status 
      ON trade_contracts(campaign_id, status);
    `);
    
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_trade_contracts_resource 
      ON trade_contracts(resource_id, status);
    `);
    
    console.log('✅ Trade tables initialized');
  }
  
  /**
   * Save or update trade prices
   */
  static async savePrices(prices: Record<string, TradePrice>): Promise<void> {
    const db = await initDatabase();
    
    await db.run('BEGIN TRANSACTION');
    
    try {
      for (const [resourceId, priceData] of Object.entries(prices)) {
        await db.run(`
          INSERT OR REPLACE INTO trade_prices (
            resource_id, current_price, supply, demand, trend, last_updated, price_history
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          resourceId,
          priceData.currentPrice,
          priceData.supply,
          priceData.demand,
          priceData.trend,
          priceData.lastUpdated,
          JSON.stringify(priceData.priceHistory)
        ]);
      }
      
      await db.run('COMMIT');
      console.log(`💰 Updated prices for ${Object.keys(prices).length} resources`);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }
  
  /**
   * Get all current trade prices
   */
  static async getPrices(): Promise<Record<string, TradePrice>> {
    const db = await initDatabase();
    
    const rows = await db.all('SELECT * FROM trade_prices');
    const prices: Record<string, TradePrice> = {};
    
    for (const row of rows) {
      prices[row.resource_id] = {
        resourceId: row.resource_id,
        currentPrice: row.current_price,
        supply: row.supply,
        demand: row.demand,
        trend: row.trend,
        lastUpdated: row.last_updated,
        priceHistory: JSON.parse(row.price_history)
      };
    }
    
    return prices;
  }
  
  /**
   * Get price for a specific resource
   */
  static async getResourcePrice(resourceId: string): Promise<TradePrice | null> {
    const db = await initDatabase();
    
    const row = await db.get(
      'SELECT * FROM trade_prices WHERE resource_id = ?',
      [resourceId]
    );
    
    if (!row) return null;
    
    return {
      resourceId: row.resource_id,
      currentPrice: row.current_price,
      supply: row.supply,
      demand: row.demand,
      trend: row.trend,
      lastUpdated: row.last_updated,
      priceHistory: JSON.parse(row.price_history)
    };
  }
  
  /**
   * Save a trade route
   */
  static async saveRoute(route: TradeRoute): Promise<void> {
    const db = await initDatabase();
    
    await db.run(`
      INSERT OR REPLACE INTO trade_routes (
        id, campaign_id, name, origin, destination, resources, distance,
        travel_time, capacity, tariff_rate, status, created_at, last_used
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      route.id,
      route.campaignId,
      route.name,
      route.origin,
      route.destination,
      JSON.stringify(route.resources),
      route.distance,
      route.travelTime,
      route.capacity,
      route.tariffRate,
      route.status,
      route.createdAt.toISOString(),
      route.lastUsed?.toISOString() || null
    ]);
    
    console.log(`🚢 Trade route saved: ${route.name} (${route.origin} → ${route.destination})`);
  }
  
  /**
   * Get all trade routes for a campaign
   */
  static async getRoutes(campaignId: number, status?: string): Promise<TradeRoute[]> {
    const db = await initDatabase();
    
    let query = 'SELECT * FROM trade_routes WHERE campaign_id = ?';
    const params: any[] = [campaignId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const rows = await db.all(query, params);
    
    return rows.map(row => ({
      id: row.id,
      campaignId: row.campaign_id,
      name: row.name,
      origin: row.origin,
      destination: row.destination,
      resources: JSON.parse(row.resources),
      distance: row.distance,
      travelTime: row.travel_time,
      capacity: row.capacity,
      tariffRate: row.tariff_rate,
      status: row.status,
      createdAt: new Date(row.created_at),
      lastUsed: row.last_used ? new Date(row.last_used) : undefined
    }));
  }
  
  /**
   * Get route by ID
   */
  static async getRoute(routeId: string): Promise<TradeRoute | null> {
    const db = await initDatabase();
    
    const row = await db.get('SELECT * FROM trade_routes WHERE id = ?', [routeId]);
    
    if (!row) return null;
    
    return {
      id: row.id,
      campaignId: row.campaign_id,
      name: row.name,
      origin: row.origin,
      destination: row.destination,
      resources: JSON.parse(row.resources),
      distance: row.distance,
      travelTime: row.travel_time,
      capacity: row.capacity,
      tariffRate: row.tariff_rate,
      status: row.status,
      createdAt: new Date(row.created_at),
      lastUsed: row.last_used ? new Date(row.last_used) : undefined
    };
  }
  
  /**
   * Save a trade contract
   */
  static async saveContract(contract: TradeContract): Promise<void> {
    const db = await initDatabase();
    
    await db.run(`
      INSERT OR REPLACE INTO trade_contracts (
        id, campaign_id, type, resource_id, quantity, price_per_unit,
        total_value, counterparty, route_id, status, created_at,
        delivery_deadline, completed_at, terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      contract.id,
      contract.campaignId,
      contract.type,
      contract.resourceId,
      contract.quantity,
      contract.pricePerUnit,
      contract.totalValue,
      contract.counterparty,
      contract.routeId || null,
      contract.status,
      contract.createdAt.toISOString(),
      contract.deliveryDeadline?.toISOString() || null,
      contract.completedAt?.toISOString() || null,
      JSON.stringify(contract.terms)
    ]);
    
    console.log(`📄 Trade contract saved: ${contract.type} ${contract.quantity} ${contract.resourceId} (${contract.id})`);
  }
  
  /**
   * Get all trade contracts for a campaign
   */
  static async getContracts(campaignId: number, status?: string): Promise<TradeContract[]> {
    const db = await initDatabase();
    
    let query = 'SELECT * FROM trade_contracts WHERE campaign_id = ?';
    const params: any[] = [campaignId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const rows = await db.all(query, params);
    
    return rows.map(row => ({
      id: row.id,
      campaignId: row.campaign_id,
      type: row.type,
      resourceId: row.resource_id,
      quantity: row.quantity,
      pricePerUnit: row.price_per_unit,
      totalValue: row.total_value,
      counterparty: row.counterparty,
      routeId: row.route_id,
      status: row.status,
      createdAt: new Date(row.created_at),
      deliveryDeadline: row.delivery_deadline ? new Date(row.delivery_deadline) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      terms: JSON.parse(row.terms)
    }));
  }
  
  /**
   * Get contract by ID
   */
  static async getContract(contractId: string): Promise<TradeContract | null> {
    const db = await initDatabase();
    
    const row = await db.get('SELECT * FROM trade_contracts WHERE id = ?', [contractId]);
    
    if (!row) return null;
    
    return {
      id: row.id,
      campaignId: row.campaign_id,
      type: row.type,
      resourceId: row.resource_id,
      quantity: row.quantity,
      pricePerUnit: row.price_per_unit,
      totalValue: row.total_value,
      counterparty: row.counterparty,
      routeId: row.route_id,
      status: row.status,
      createdAt: new Date(row.created_at),
      deliveryDeadline: row.delivery_deadline ? new Date(row.delivery_deadline) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      terms: JSON.parse(row.terms)
    };
  }
  
  /**
   * Update contract status
   */
  static async updateContractStatus(
    contractId: string, 
    status: TradeContract['status'],
    completedAt?: Date
  ): Promise<void> {
    const db = await initDatabase();
    
    const params: any[] = [status];
    let query = 'UPDATE trade_contracts SET status = ?';
    
    if (completedAt && status === 'completed') {
      query += ', completed_at = ?';
      params.push(completedAt.toISOString());
    }
    
    query += ' WHERE id = ?';
    params.push(contractId);
    
    await db.run(query, params);
    
    console.log(`📄 Contract ${contractId} status updated to: ${status}`);
  }
  
  /**
   * Update route status and last used time
   */
  static async updateRouteStatus(
    routeId: string, 
    status: TradeRoute['status'],
    lastUsed?: Date
  ): Promise<void> {
    const db = await initDatabase();
    
    const params: any[] = [status];
    let query = 'UPDATE trade_routes SET status = ?';
    
    if (lastUsed) {
      query += ', last_used = ?';
      params.push(lastUsed.toISOString());
    }
    
    query += ' WHERE id = ?';
    params.push(routeId);
    
    await db.run(query, params);
    
    console.log(`🚢 Route ${routeId} status updated to: ${status}`);
  }
  
  /**
   * Delete a trade route
   */
  static async deleteRoute(routeId: string): Promise<void> {
    const db = await initDatabase();
    
    await db.run('DELETE FROM trade_routes WHERE id = ?', [routeId]);
    console.log(`🗑️ Route ${routeId} deleted`);
  }
  
  /**
   * Delete a trade contract
   */
  static async deleteContract(contractId: string): Promise<void> {
    const db = await initDatabase();
    
    await db.run('DELETE FROM trade_contracts WHERE id = ?', [contractId]);
    console.log(`🗑️ Contract ${contractId} deleted`);
  }
  
  /**
   * Get trade statistics for a campaign
   */
  static async getTradeStats(campaignId: number): Promise<{
    totalRoutes: number;
    activeRoutes: number;
    totalContracts: number;
    activeContracts: number;
    completedContracts: number;
    totalTradeVolume: number;
  }> {
    const db = await initDatabase();
    
    const routeStats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM trade_routes 
      WHERE campaign_id = ?
    `, [campaignId]);
    
    const contractStats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('active', 'pending') THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'completed' THEN total_value ELSE 0 END) as total_volume
      FROM trade_contracts 
      WHERE campaign_id = ?
    `, [campaignId]);
    
    return {
      totalRoutes: routeStats.total || 0,
      activeRoutes: routeStats.active || 0,
      totalContracts: contractStats.total || 0,
      activeContracts: contractStats.active || 0,
      completedContracts: contractStats.completed || 0,
      totalTradeVolume: contractStats.total_volume || 0
    };
  }
}
