import { Pool } from 'pg';
import { 
  ProductCategory, 
  Product, 
  Material, 
  ProductionChain, 
  CityMarket, 
  MarketDemand, 
  MarketSupply, 
  TradePolicy, 
  ProductTradePolicy,
  CorporationTemplate,
  LeaderTemplate,
  LocationSkills,
  GovernmentContract,
  IndustryStatistics
} from './economicEcosystemSchema';

export class EconomicEcosystemService {
  constructor(private pool: Pool) {}

  // Product and Material Management
  async getProductCategories(strategicOnly: boolean = false): Promise<ProductCategory[]> {
    let query = 'SELECT * FROM product_categories';
    if (strategicOnly) {
      query += " WHERE strategic_importance IN ('high', 'critical')";
    }
    query += ' ORDER BY strategic_importance DESC, category_name';

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const query = 'SELECT * FROM products WHERE category_id = $1 ORDER BY technology_level DESC, product_name';
    const result = await this.pool.query(query, [categoryId]);
    return result.rows;
  }

  async getMaterials(category?: string): Promise<Material[]> {
    let query = 'SELECT * FROM materials';
    const params = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }

    query += ' ORDER BY strategic_value DESC, material_name';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Market Operations
  async getCityMarkets(civilizationId?: number): Promise<CityMarket[]> {
    let query = 'SELECT * FROM city_markets';
    const params = [];

    if (civilizationId) {
      query += ' WHERE civilization_id = $1';
      params.push(civilizationId);
    }

    query += ' ORDER BY gdp_per_capita DESC, population DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getMarketDemand(marketId: number, productId?: number): Promise<MarketDemand[]> {
    let query = `
      SELECT md.*, p.product_name, pc.category_name 
      FROM market_demand md
      JOIN products p ON md.product_id = p.id
      JOIN product_categories pc ON p.category_id = pc.id
      WHERE md.market_id = $1
    `;
    const params = [marketId];

    if (productId) {
      query += ' AND md.product_id = $2';
      params.push(productId);
    }

    query += ' ORDER BY md.base_demand DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getMarketSupply(marketId: number, productId?: number): Promise<MarketSupply[]> {
    let query = `
      SELECT ms.*, p.product_name, pc.category_name 
      FROM market_supply ms
      JOIN products p ON ms.product_id = p.id
      JOIN product_categories pc ON p.category_id = pc.id
      WHERE ms.market_id = $1
    `;
    const params = [marketId];

    if (productId) {
      query += ' AND ms.product_id = $2';
      params.push(productId);
    }

    query += ' ORDER BY ms.domestic_production DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Supply and Demand Calculations
  async calculateMarketEquilibrium(marketId: number, productId: number): Promise<{
    equilibrium_price: number;
    equilibrium_quantity: number;
    market_efficiency: number;
    shortage_surplus: number;
  }> {
    const demand = await this.getMarketDemand(marketId, productId);
    const supply = await this.getMarketSupply(marketId, productId);

    if (demand.length === 0 || supply.length === 0) {
      throw new Error(`No market data found for market ${marketId}, product ${productId}`);
    }

    const demandData = demand[0];
    const supplyData = supply[0];

    // Calculate total supply (domestic + imports)
    const totalSupply = supplyData.domestic_production + supplyData.import_quantity;
    
    // Calculate equilibrium using basic supply/demand curves
    const baseDemand = demandData.base_demand;
    const currentPrice = demandData.current_price;
    const priceElasticity = demandData.price_elasticity;
    const supplyElasticity = supplyData.supply_elasticity;

    // Simplified equilibrium calculation
    // In reality, this would involve more complex economic modeling
    const demandAtCurrentPrice = baseDemand * Math.pow(currentPrice / 100, priceElasticity);
    const supplyAtCurrentPrice = totalSupply * Math.pow(currentPrice / 100, supplyElasticity);

    // Find equilibrium where supply meets demand
    let equilibriumPrice = currentPrice;
    let equilibriumQuantity = Math.min(demandAtCurrentPrice, supplyAtCurrentPrice);

    // Adjust price based on shortage/surplus
    const shortage = demandAtCurrentPrice - supplyAtCurrentPrice;
    if (Math.abs(shortage) > 0.01 * baseDemand) {
      // Significant imbalance - adjust price
      const priceAdjustment = shortage / baseDemand * 0.1; // 10% max adjustment
      equilibriumPrice = currentPrice * (1 + priceAdjustment);
      
      // Recalculate quantities at new price
      const newDemand = baseDemand * Math.pow(equilibriumPrice / 100, priceElasticity);
      const newSupply = totalSupply * Math.pow(equilibriumPrice / 100, supplyElasticity);
      equilibriumQuantity = Math.min(newDemand, newSupply);
    }

    // Calculate market efficiency (0-1 scale)
    const maxPossibleTrade = Math.min(baseDemand, totalSupply);
    const marketEfficiency = maxPossibleTrade > 0 ? equilibriumQuantity / maxPossibleTrade : 0;

    return {
      equilibrium_price: equilibriumPrice,
      equilibrium_quantity: equilibriumQuantity,
      market_efficiency: marketEfficiency,
      shortage_surplus: shortage
    };
  }

  async updateMarketPrices(marketId: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get all products in this market
      const productsQuery = `
        SELECT DISTINCT md.product_id 
        FROM market_demand md 
        WHERE md.market_id = $1
      `;
      const productsResult = await client.query(productsQuery, [marketId]);

      for (const row of productsResult.rows) {
        const productId = row.product_id;
        
        try {
          const equilibrium = await this.calculateMarketEquilibrium(marketId, productId);
          
          // Update demand with new price
          await client.query(`
            UPDATE market_demand 
            SET current_price = $1, last_updated = CURRENT_TIMESTAMP
            WHERE market_id = $2 AND product_id = $3
          `, [equilibrium.equilibrium_price, marketId, productId]);

          // Update supply with new market conditions
          await client.query(`
            UPDATE market_supply 
            SET last_updated = CURRENT_TIMESTAMP
            WHERE market_id = $1 AND product_id = $2
          `, [marketId, productId]);

        } catch (error) {
          console.warn(`Failed to update price for product ${productId} in market ${marketId}:`, error);
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Production Chain Management
  async getProductionChains(corporationId?: number, productId?: number): Promise<ProductionChain[]> {
    let query = `
      SELECT pc.*, p.product_name, lc.company_name 
      FROM production_chains pc
      JOIN products p ON pc.product_id = p.id
      JOIN listed_companies lc ON pc.corporation_id = lc.id
    `;
    const params = [];
    const conditions = [];

    if (corporationId) {
      conditions.push(`pc.corporation_id = $${params.length + 1}`);
      params.push(corporationId);
    }

    if (productId) {
      conditions.push(`pc.product_id = $${params.length + 1}`);
      params.push(productId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY pc.efficiency_rating DESC, pc.output_quantity DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createProductionChain(chainData: Omit<ProductionChain, 'id' | 'created_at'>): Promise<ProductionChain> {
    const query = `
      INSERT INTO production_chains (
        product_id, corporation_id, location_id, input_materials,
        output_quantity, production_time, skill_requirements,
        efficiency_rating, capacity_utilization
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      chainData.product_id,
      chainData.corporation_id,
      chainData.location_id,
      JSON.stringify(chainData.input_materials),
      chainData.output_quantity,
      chainData.production_time,
      JSON.stringify(chainData.skill_requirements),
      chainData.efficiency_rating,
      chainData.capacity_utilization
    ]);

    return result.rows[0];
  }

  // Trade Policy Management
  async getTradePolicies(civilizationId: number, targetCivilizationId?: number): Promise<TradePolicy[]> {
    let query = 'SELECT * FROM trade_policies WHERE source_civilization_id = $1';
    const params = [civilizationId];

    if (targetCivilizationId) {
      query += ' AND target_civilization_id = $2';
      params.push(targetCivilizationId);
    }

    query += ' ORDER BY effective_date DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getProductTradePolicies(tradePolicyId: number): Promise<ProductTradePolicy[]> {
    const query = `
      SELECT ptp.*, pc.category_name 
      FROM product_trade_policies ptp
      JOIN product_categories pc ON ptp.product_category_id = pc.id
      WHERE ptp.trade_policy_id = $1
      ORDER BY ptp.strategic_importance DESC, pc.category_name
    `;
    const result = await this.pool.query(query, [tradePolicyId]);
    return result.rows;
  }

  async calculateTariffImpact(
    sourceCivId: number, 
    targetCivId: number, 
    productCategoryId: number, 
    tradeValue: number
  ): Promise<{
    base_tariff: number;
    product_tariff: number;
    total_tariff_rate: number;
    tariff_amount: number;
    diplomatic_modifier: number;
  }> {
    // Get current trade policy
    const policyQuery = `
      SELECT tp.*, ptp.tariff_rate as product_tariff_rate, tp.diplomatic_modifier
      FROM trade_policies tp
      LEFT JOIN product_trade_policies ptp ON tp.id = ptp.trade_policy_id 
        AND ptp.product_category_id = $3
      WHERE tp.source_civilization_id = $1 AND tp.target_civilization_id = $2
        AND tp.effective_date <= CURRENT_DATE 
        AND (tp.expiry_date IS NULL OR tp.expiry_date > CURRENT_DATE)
      ORDER BY tp.effective_date DESC
      LIMIT 1
    `;

    const result = await this.pool.query(policyQuery, [sourceCivId, targetCivId, productCategoryId]);
    
    if (result.rows.length === 0) {
      // No specific policy - use default rates
      return {
        base_tariff: 0.05, // 5% default
        product_tariff: 0,
        total_tariff_rate: 0.05,
        tariff_amount: tradeValue * 0.05,
        diplomatic_modifier: 1.0
      };
    }

    const policy = result.rows[0];
    const baseTariff = policy.general_tariff_rate || 0;
    const productTariff = policy.product_tariff_rate || 0;
    const diplomaticModifier = policy.diplomatic_modifier || 1.0;

    // Calculate total tariff rate
    const totalTariffRate = (baseTariff + productTariff) * diplomaticModifier;
    const tariffAmount = tradeValue * totalTariffRate;

    return {
      base_tariff: baseTariff,
      product_tariff: productTariff,
      total_tariff_rate: totalTariffRate,
      tariff_amount: tariffAmount,
      diplomatic_modifier: diplomaticModifier
    };
  }

  // Government Procurement
  async getGovernmentContracts(
    civilizationId: number, 
    contractType?: string, 
    status?: string
  ): Promise<GovernmentContract[]> {
    let query = 'SELECT * FROM government_contracts WHERE civilization_id = $1';
    const params = [civilizationId];

    if (contractType) {
      query += ` AND contract_type = $${params.length + 1}`;
      params.push(contractType);
    }

    if (status) {
      query += ` AND contract_status = $${params.length + 1}`;
      params.push(status);
    }

    query += ' ORDER BY contract_value DESC, bidding_deadline ASC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createGovernmentContract(contractData: Omit<GovernmentContract, 'id' | 'created_at'>): Promise<GovernmentContract> {
    const query = `
      INSERT INTO government_contracts (
        civilization_id, issuing_department, contract_type, requirements,
        domestic_preference, security_clearance_required, contract_value,
        bidding_deadline, delivery_deadline, contract_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      contractData.civilization_id,
      contractData.issuing_department,
      contractData.contract_type,
      JSON.stringify(contractData.requirements),
      contractData.domestic_preference,
      contractData.security_clearance_required,
      contractData.contract_value,
      contractData.bidding_deadline,
      contractData.delivery_deadline,
      contractData.contract_status
    ]);

    return result.rows[0];
  }

  // Industry Statistics
  async getIndustryStatistics(
    civilizationId: number, 
    sector?: string, 
    reportingPeriod?: Date
  ): Promise<IndustryStatistics[]> {
    let query = 'SELECT * FROM industry_statistics WHERE civilization_id = $1';
    const params = [civilizationId];

    if (sector) {
      query += ` AND sector = $${params.length + 1}`;
      params.push(sector);
    }

    if (reportingPeriod) {
      query += ` AND reporting_period = $${params.length + 1}`;
      params.push(reportingPeriod);
    }

    query += ' ORDER BY reporting_period DESC, total_revenue DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async calculateTradeBalance(civilizationId: number, period?: Date): Promise<{
    total_exports: number;
    total_imports: number;
    trade_balance: number;
    by_sector: { sector: string; exports: number; imports: number; balance: number }[];
  }> {
    let periodCondition = '';
    const params = [civilizationId];

    if (period) {
      periodCondition = ' AND reporting_period = $2';
      params.push(period);
    } else {
      periodCondition = ' AND reporting_period = (SELECT MAX(reporting_period) FROM industry_statistics WHERE civilization_id = $1)';
    }

    const query = `
      SELECT 
        sector,
        SUM(export_value) as total_exports,
        SUM(import_value) as total_imports,
        SUM(export_value) - SUM(import_value) as trade_balance
      FROM industry_statistics 
      WHERE civilization_id = $1 ${periodCondition}
      GROUP BY sector
      ORDER BY trade_balance DESC
    `;

    const result = await this.pool.query(query, params);
    
    const bySector = result.rows.map(row => ({
      sector: row.sector,
      exports: parseFloat(row.total_exports),
      imports: parseFloat(row.total_imports),
      balance: parseFloat(row.trade_balance)
    }));

    const totalExports = bySector.reduce((sum, s) => sum + s.exports, 0);
    const totalImports = bySector.reduce((sum, s) => sum + s.imports, 0);

    return {
      total_exports: totalExports,
      total_imports: totalImports,
      trade_balance: totalExports - totalImports,
      by_sector: bySector
    };
  }

  // Market Analysis
  async getMarketOverview(civilizationId: number): Promise<any> {
    const [markets, tradeBalance, contracts] = await Promise.all([
      this.getCityMarkets(civilizationId),
      this.calculateTradeBalance(civilizationId),
      this.getGovernmentContracts(civilizationId, undefined, 'open')
    ]);

    // Calculate aggregate market metrics
    const totalPopulation = markets.reduce((sum, market) => sum + market.population, 0);
    const avgGdpPerCapita = markets.reduce((sum, market) => sum + (market.gdp_per_capita * market.population), 0) / totalPopulation;
    const totalGdp = totalPopulation * avgGdpPerCapita;

    return {
      civilization_id: civilizationId,
      markets: markets.length,
      total_population: totalPopulation,
      total_gdp: totalGdp,
      avg_gdp_per_capita: avgGdpPerCapita,
      trade_balance: tradeBalance,
      open_contracts: contracts.length,
      contract_value: contracts.reduce((sum, c) => sum + c.contract_value, 0),
      timestamp: new Date()
    };
  }

  // Location Skills Management
  async getLocationSkills(cityId: number, skillCategory?: string): Promise<LocationSkills[]> {
    let query = 'SELECT * FROM location_skills WHERE city_id = $1';
    const params = [cityId];

    if (skillCategory) {
      query += ' AND skill_category = $2';
      params.push(skillCategory);
    }

    query += ' ORDER BY quality_level DESC, availability_level DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateSkillAvailability(cityId: number, skillCategory: string, specificSkill: string, changes: {
    availability_level?: string;
    quality_level?: number;
    average_cost?: number;
    brain_drain_rate?: number;
  }): Promise<void> {
    const setParts = [];
    const params = [cityId, skillCategory, specificSkill];
    let paramIndex = 4;

    if (changes.availability_level) {
      setParts.push(`availability_level = $${paramIndex++}`);
      params.push(changes.availability_level);
    }

    if (changes.quality_level !== undefined) {
      setParts.push(`quality_level = $${paramIndex++}`);
      params.push(changes.quality_level);
    }

    if (changes.average_cost !== undefined) {
      setParts.push(`average_cost = $${paramIndex++}`);
      params.push(changes.average_cost);
    }

    if (changes.brain_drain_rate !== undefined) {
      setParts.push(`brain_drain_rate = $${paramIndex++}`);
      params.push(changes.brain_drain_rate);
    }

    if (setParts.length === 0) return;

    setParts.push('last_updated = CURRENT_TIMESTAMP');

    const query = `
      UPDATE location_skills 
      SET ${setParts.join(', ')}
      WHERE city_id = $1 AND skill_category = $2 AND specific_skill = $3
    `;

    await this.pool.query(query, params);
  }
}

// Service instance
let economicEcosystemService: EconomicEcosystemService | null = null;

export function getEconomicEcosystemService(): EconomicEcosystemService {
  if (!economicEcosystemService) {
    throw new Error('EconomicEcosystemService not initialized. Call initializeEconomicEcosystemService first.');
  }
  return economicEcosystemService;
}

export function initializeEconomicEcosystemService(pool: Pool): void {
  economicEcosystemService = new EconomicEcosystemService(pool);
}
