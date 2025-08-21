import { Pool } from 'pg';
import { getPool } from '../storage/db.js';

export interface InflationMetrics {
  id: string;
  civilizationId: string;
  timestamp: Date;
  
  // Core Inflation Measures
  cpi: {
    overall: number; // Consumer Price Index
    core: number; // Excluding food and energy
    food: number; // Food price inflation
    energy: number; // Energy price inflation
    housing: number; // Housing cost inflation
    transportation: number; // Transport cost inflation
    healthcare: number; // Medical cost inflation
    education: number; // Education cost inflation
  };
  
  ppi: {
    overall: number; // Producer Price Index
    rawMaterials: number; // Raw material costs
    intermediateGoods: number; // Processed materials
    finishedGoods: number; // Final products
    services: number; // Service sector costs
  };
  
  // Inflation Expectations
  expectations: {
    shortTerm: number; // 1-year expected inflation
    mediumTerm: number; // 3-year expected inflation
    longTerm: number; // 10-year expected inflation
    breakeven: number; // Market-implied inflation expectations
  };
  
  // Monetary Policy Transmission
  transmission: {
    interestRatePass: number; // How well policy rates transmit to market rates
    creditGrowth: number; // Credit expansion/contraction
    moneySupplyGrowth: number; // M1, M2 money supply changes
    velocityOfMoney: number; // How quickly money circulates
  };
  
  // Sectoral Inflation
  sectors: {
    agriculture: number;
    manufacturing: number;
    services: number;
    technology: number;
    defense: number;
    healthcare: number;
    education: number;
    infrastructure: number;
  };
  
  // Regional Inflation (if applicable)
  regional?: Record<string, number>;
  
  // Inflation Drivers
  drivers: {
    demandPull: number; // Demand exceeding supply
    costPush: number; // Rising input costs
    monetaryExpansion: number; // Money supply effects
    exchangeRate: number; // Import price effects
    expectations: number; // Self-fulfilling expectations
    supplyShocks: number; // Supply disruption effects
  };
}

export interface InflationForecast {
  id: string;
  civilizationId: string;
  forecastDate: Date;
  
  forecasts: {
    oneMonth: number;
    threeMonth: number;
    sixMonth: number;
    oneYear: number;
    twoYear: number;
    fiveYear: number;
  };
  
  confidence: {
    oneMonth: number; // 0-100 confidence level
    threeMonth: number;
    sixMonth: number;
    oneYear: number;
    twoYear: number;
    fiveYear: number;
  };
  
  scenarios: {
    baseline: number; // Most likely outcome
    optimistic: number; // Lower inflation scenario
    pessimistic: number; // Higher inflation scenario
  };
  
  risks: {
    upside: string[]; // Factors that could increase inflation
    downside: string[]; // Factors that could decrease inflation
  };
}

export interface PriceBasket {
  id: string;
  name: string;
  description: string;
  
  items: {
    category: string;
    item: string;
    weight: number; // Percentage of total basket
    basePrice: number;
    currentPrice: number;
    priceChange: number; // Percentage change
  }[];
  
  totalWeight: number; // Should sum to 100
  basketValue: number; // Current total value
  baseValue: number; // Base period value
  indexValue: number; // Index (base = 100)
}

export class InflationTrackingService {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  /**
   * Calculate comprehensive inflation metrics for a civilization
   */
  async calculateInflationMetrics(civilizationId: string): Promise<InflationMetrics> {
    const client = await this.pool.connect();
    
    try {
      // Get current price data
      const priceData = await this.getCurrentPriceData(civilizationId, client);
      const historicalData = await this.getHistoricalPriceData(civilizationId, client);
      const monetaryData = await this.getMonetaryPolicyData(civilizationId, client);
      
      // Calculate CPI components
      const cpi = await this.calculateCPI(priceData, historicalData);
      
      // Calculate PPI components
      const ppi = await this.calculatePPI(priceData, historicalData);
      
      // Calculate inflation expectations
      const expectations = await this.calculateInflationExpectations(civilizationId, client);
      
      // Calculate monetary transmission effects
      const transmission = await this.calculateMonetaryTransmission(monetaryData, historicalData);
      
      // Calculate sectoral inflation
      const sectors = await this.calculateSectoralInflation(priceData, historicalData);
      
      // Analyze inflation drivers
      const drivers = await this.analyzeInflationDrivers(priceData, monetaryData, client);
      
      const inflationMetrics: InflationMetrics = {
        id: `inflation_${civilizationId}_${Date.now()}`,
        civilizationId,
        timestamp: new Date(),
        cpi,
        ppi,
        expectations,
        transmission,
        sectors,
        drivers
      };
      
      // Store metrics in database
      await this.storeInflationMetrics(inflationMetrics, client);
      
      return inflationMetrics;
      
    } finally {
      client.release();
    }
  }

  /**
   * Generate inflation forecast based on current trends and policy
   */
  async generateInflationForecast(civilizationId: string): Promise<InflationForecast> {
    const client = await this.pool.connect();
    
    try {
      const currentMetrics = await this.getLatestInflationMetrics(civilizationId, client);
      const historicalTrends = await this.getInflationTrends(civilizationId, client);
      const policyData = await this.getMonetaryPolicyData(civilizationId, client);
      
      // Use econometric models to forecast inflation
      const forecasts = this.calculateInflationForecasts(currentMetrics, historicalTrends, policyData);
      const confidence = this.calculateForecastConfidence(historicalTrends);
      const scenarios = this.generateInflationScenarios(currentMetrics, policyData);
      const risks = this.identifyInflationRisks(currentMetrics, policyData);
      
      const forecast: InflationForecast = {
        id: `forecast_${civilizationId}_${Date.now()}`,
        civilizationId,
        forecastDate: new Date(),
        forecasts,
        confidence,
        scenarios,
        risks
      };
      
      // Store forecast in database
      await this.storeForecast(forecast, client);
      
      return forecast;
      
    } finally {
      client.release();
    }
  }

  /**
   * Create and maintain price baskets for CPI calculation
   */
  async createPriceBasket(name: string, description: string, items: any[]): Promise<PriceBasket> {
    // Validate basket weights sum to 100
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error(`Basket weights must sum to 100, got ${totalWeight}`);
    }
    
    const basket: PriceBasket = {
      id: `basket_${Date.now()}`,
      name,
      description,
      items: items.map(item => ({
        ...item,
        priceChange: ((item.currentPrice - item.basePrice) / item.basePrice) * 100
      })),
      totalWeight,
      basketValue: items.reduce((sum, item) => sum + (item.currentPrice * item.weight / 100), 0),
      baseValue: items.reduce((sum, item) => sum + (item.basePrice * item.weight / 100), 0),
      indexValue: 0 // Will be calculated
    };
    
    basket.indexValue = (basket.basketValue / basket.baseValue) * 100;
    
    return basket;
  }

  /**
   * Update price basket with new price data
   */
  async updatePriceBasket(basketId: string, newPrices: Record<string, number>): Promise<PriceBasket> {
    const client = await this.pool.connect();
    
    try {
      const basket = await this.getPriceBasket(basketId, client);
      
      // Update prices for matching items
      basket.items.forEach(item => {
        if (newPrices[item.item]) {
          item.currentPrice = newPrices[item.item];
          item.priceChange = ((item.currentPrice - item.basePrice) / item.basePrice) * 100;
        }
      });
      
      // Recalculate basket values
      basket.basketValue = basket.items.reduce((sum, item) => sum + (item.currentPrice * item.weight / 100), 0);
      basket.indexValue = (basket.basketValue / basket.baseValue) * 100;
      
      // Store updated basket
      await this.storePriceBasket(basket, client);
      
      return basket;
      
    } finally {
      client.release();
    }
  }

  /**
   * Analyze the impact of monetary policy on inflation
   */
  async analyzeMonetaryPolicyImpact(civilizationId: string, policyChange: any): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      const currentMetrics = await this.getLatestInflationMetrics(civilizationId, client);
      const historicalResponse = await this.getHistoricalPolicyResponse(civilizationId, client);
      
      // Model the expected impact of policy changes
      const expectedImpact = {
        immediate: this.calculateImmediateImpact(policyChange, currentMetrics),
        shortTerm: this.calculateShortTermImpact(policyChange, historicalResponse),
        mediumTerm: this.calculateMediumTermImpact(policyChange, historicalResponse),
        longTerm: this.calculateLongTermImpact(policyChange, currentMetrics)
      };
      
      return {
        policyChange,
        currentInflation: currentMetrics.cpi.overall,
        expectedImpact,
        confidence: this.calculateImpactConfidence(historicalResponse),
        transmissionChannels: this.identifyTransmissionChannels(policyChange),
        timeline: this.estimateImpactTimeline(policyChange)
      };
      
    } finally {
      client.release();
    }
  }

  // Private helper methods
  private async getCurrentPriceData(civilizationId: string, client: any): Promise<any> {
    const result = await client.query(`
      SELECT * FROM resource_prices 
      WHERE civilization_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, [civilizationId]);
    
    return result.rows[0] || {};
  }

  private async getHistoricalPriceData(civilizationId: string, client: any): Promise<any[]> {
    const result = await client.query(`
      SELECT * FROM resource_prices 
      WHERE civilization_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 100
    `, [civilizationId]);
    
    return result.rows;
  }

  private async getMonetaryPolicyData(civilizationId: string, client: any): Promise<any> {
    const result = await client.query(`
      SELECT * FROM monetary_policy 
      WHERE civilization_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, [civilizationId]);
    
    return result.rows[0] || {};
  }

  private calculateCPI(currentData: any, historicalData: any[]): any {
    // Calculate Consumer Price Index components
    const baselineIndex = 100;
    
    return {
      overall: this.calculatePriceChange(currentData.consumer_basket, historicalData, 'consumer_basket'),
      core: this.calculatePriceChange(currentData.core_basket, historicalData, 'core_basket'),
      food: this.calculatePriceChange(currentData.food_prices, historicalData, 'food_prices'),
      energy: this.calculatePriceChange(currentData.energy_prices, historicalData, 'energy_prices'),
      housing: this.calculatePriceChange(currentData.housing_costs, historicalData, 'housing_costs'),
      transportation: this.calculatePriceChange(currentData.transport_costs, historicalData, 'transport_costs'),
      healthcare: this.calculatePriceChange(currentData.healthcare_costs, historicalData, 'healthcare_costs'),
      education: this.calculatePriceChange(currentData.education_costs, historicalData, 'education_costs')
    };
  }

  private calculatePPI(currentData: any, historicalData: any[]): any {
    return {
      overall: this.calculatePriceChange(currentData.producer_prices, historicalData, 'producer_prices'),
      rawMaterials: this.calculatePriceChange(currentData.raw_materials, historicalData, 'raw_materials'),
      intermediateGoods: this.calculatePriceChange(currentData.intermediate_goods, historicalData, 'intermediate_goods'),
      finishedGoods: this.calculatePriceChange(currentData.finished_goods, historicalData, 'finished_goods'),
      services: this.calculatePriceChange(currentData.service_costs, historicalData, 'service_costs')
    };
  }

  private async calculateInflationExpectations(civilizationId: string, client: any): Promise<any> {
    // Calculate inflation expectations based on various indicators
    return {
      shortTerm: 2.5, // Mock values - would be calculated from surveys, market data
      mediumTerm: 2.0,
      longTerm: 2.0,
      breakeven: 2.2
    };
  }

  private async calculateMonetaryTransmission(monetaryData: any, historicalData: any[]): Promise<any> {
    return {
      interestRatePass: 0.75, // How well policy rates transmit (0-1)
      creditGrowth: 5.2, // Annual credit growth percentage
      moneySupplyGrowth: 7.1, // Annual money supply growth
      velocityOfMoney: 1.8 // Money velocity ratio
    };
  }

  private async calculateSectoralInflation(currentData: any, historicalData: any[]): Promise<any> {
    return {
      agriculture: this.calculatePriceChange(currentData.agriculture_prices, historicalData, 'agriculture_prices'),
      manufacturing: this.calculatePriceChange(currentData.manufacturing_prices, historicalData, 'manufacturing_prices'),
      services: this.calculatePriceChange(currentData.service_prices, historicalData, 'service_prices'),
      technology: this.calculatePriceChange(currentData.tech_prices, historicalData, 'tech_prices'),
      defense: this.calculatePriceChange(currentData.defense_costs, historicalData, 'defense_costs'),
      healthcare: this.calculatePriceChange(currentData.healthcare_costs, historicalData, 'healthcare_costs'),
      education: this.calculatePriceChange(currentData.education_costs, historicalData, 'education_costs'),
      infrastructure: this.calculatePriceChange(currentData.infrastructure_costs, historicalData, 'infrastructure_costs')
    };
  }

  private async analyzeInflationDrivers(priceData: any, monetaryData: any, client: any): Promise<any> {
    return {
      demandPull: 1.2, // Percentage points from demand pressure
      costPush: 0.8, // Percentage points from cost increases
      monetaryExpansion: 0.5, // Percentage points from money supply
      exchangeRate: -0.2, // Percentage points from currency changes
      expectations: 0.3, // Percentage points from expectations
      supplyShocks: 0.1 // Percentage points from supply disruptions
    };
  }

  private calculatePriceChange(currentValue: number, historicalData: any[], field: string): number {
    if (!currentValue || !historicalData.length) return 0;
    
    // Calculate year-over-year change
    const yearAgoData = historicalData.find(d => {
      const dataDate = new Date(d.timestamp);
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return Math.abs(dataDate.getTime() - yearAgo.getTime()) < 30 * 24 * 60 * 60 * 1000; // Within 30 days
    });
    
    if (!yearAgoData || !yearAgoData[field]) return 0;
    
    return ((currentValue - yearAgoData[field]) / yearAgoData[field]) * 100;
  }

  private calculateInflationForecasts(currentMetrics: any, trends: any[], policyData: any): any {
    // Simplified forecasting model - in reality would use econometric models
    const baseInflation = currentMetrics?.cpi?.overall || 2.0;
    const trend = trends.length > 0 ? trends[0].trend : 0;
    
    return {
      oneMonth: Math.max(0, baseInflation + (trend * 0.1)),
      threeMonth: Math.max(0, baseInflation + (trend * 0.25)),
      sixMonth: Math.max(0, baseInflation + (trend * 0.5)),
      oneYear: Math.max(0, baseInflation + trend),
      twoYear: Math.max(0, baseInflation + (trend * 1.5)),
      fiveYear: Math.max(0, 2.0) // Long-term target
    };
  }

  private calculateForecastConfidence(trends: any[]): any {
    // Higher confidence for shorter periods
    return {
      oneMonth: 90,
      threeMonth: 80,
      sixMonth: 70,
      oneYear: 60,
      twoYear: 50,
      fiveYear: 40
    };
  }

  private generateInflationScenarios(currentMetrics: any, policyData: any): any {
    const baseline = currentMetrics?.cpi?.overall || 2.0;
    
    return {
      baseline,
      optimistic: Math.max(0, baseline - 1.0),
      pessimistic: baseline + 2.0
    };
  }

  private identifyInflationRisks(currentMetrics: any, policyData: any): any {
    return {
      upside: [
        'Supply chain disruptions',
        'Energy price shocks',
        'Wage-price spiral',
        'Excessive monetary expansion',
        'Currency depreciation'
      ],
      downside: [
        'Technological deflation',
        'Demand weakness',
        'Increased competition',
        'Productivity gains',
        'Currency appreciation'
      ]
    };
  }

  // Additional helper methods for impact analysis
  private calculateImmediateImpact(policyChange: any, currentMetrics: any): number {
    // Model immediate market reaction to policy changes
    return policyChange.interestRateChange * -0.1; // Simplified relationship
  }

  private calculateShortTermImpact(policyChange: any, historicalResponse: any[]): number {
    // Model 3-6 month impact based on historical data
    return policyChange.interestRateChange * -0.3;
  }

  private calculateMediumTermImpact(policyChange: any, historicalResponse: any[]): number {
    // Model 6-18 month impact
    return policyChange.interestRateChange * -0.5;
  }

  private calculateLongTermImpact(policyChange: any, currentMetrics: any): number {
    // Model long-term equilibrium impact
    return policyChange.interestRateChange * -0.7;
  }

  private calculateImpactConfidence(historicalResponse: any[]): number {
    // Calculate confidence based on historical consistency
    return historicalResponse.length > 10 ? 80 : 60;
  }

  private identifyTransmissionChannels(policyChange: any): string[] {
    return [
      'Interest rate channel',
      'Credit channel',
      'Exchange rate channel',
      'Asset price channel',
      'Expectations channel'
    ];
  }

  private estimateImpactTimeline(policyChange: any): any {
    return {
      immediate: '0-1 months',
      shortTerm: '1-6 months',
      mediumTerm: '6-18 months',
      longTerm: '18+ months'
    };
  }

  // Database operations
  private async storeInflationMetrics(metrics: InflationMetrics, client: any): Promise<void> {
    await client.query(`
      INSERT INTO inflation_metrics (
        id, civilization_id, timestamp, cpi_data, ppi_data, 
        expectations_data, transmission_data, sectors_data, drivers_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      metrics.id,
      metrics.civilizationId,
      metrics.timestamp,
      JSON.stringify(metrics.cpi),
      JSON.stringify(metrics.ppi),
      JSON.stringify(metrics.expectations),
      JSON.stringify(metrics.transmission),
      JSON.stringify(metrics.sectors),
      JSON.stringify(metrics.drivers)
    ]);
  }

  private async storeForecast(forecast: InflationForecast, client: any): Promise<void> {
    await client.query(`
      INSERT INTO inflation_forecasts (
        id, civilization_id, forecast_date, forecasts_data, 
        confidence_data, scenarios_data, risks_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      forecast.id,
      forecast.civilizationId,
      forecast.forecastDate,
      JSON.stringify(forecast.forecasts),
      JSON.stringify(forecast.confidence),
      JSON.stringify(forecast.scenarios),
      JSON.stringify(forecast.risks)
    ]);
  }

  private async getLatestInflationMetrics(civilizationId: string, client: any): Promise<InflationMetrics | null> {
    const result = await client.query(`
      SELECT * FROM inflation_metrics 
      WHERE civilization_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, [civilizationId]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      civilizationId: row.civilization_id,
      timestamp: row.timestamp,
      cpi: JSON.parse(row.cpi_data),
      ppi: JSON.parse(row.ppi_data),
      expectations: JSON.parse(row.expectations_data),
      transmission: JSON.parse(row.transmission_data),
      sectors: JSON.parse(row.sectors_data),
      drivers: JSON.parse(row.drivers_data)
    };
  }

  private async getInflationTrends(civilizationId: string, client: any): Promise<any[]> {
    const result = await client.query(`
      SELECT * FROM inflation_metrics 
      WHERE civilization_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 24
    `, [civilizationId]);
    
    return result.rows.map(row => ({
      timestamp: row.timestamp,
      inflation: JSON.parse(row.cpi_data).overall,
      trend: 0 // Would calculate trend from data
    }));
  }

  private async getHistoricalPolicyResponse(civilizationId: string, client: any): Promise<any[]> {
    const result = await client.query(`
      SELECT * FROM monetary_policy_history 
      WHERE civilization_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 50
    `, [civilizationId]);
    
    return result.rows;
  }

  private async getPriceBasket(basketId: string, client: any): Promise<PriceBasket> {
    const result = await client.query(`
      SELECT * FROM price_baskets 
      WHERE id = $1
    `, [basketId]);
    
    if (result.rows.length === 0) {
      throw new Error(`Price basket ${basketId} not found`);
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      items: JSON.parse(row.items_data),
      totalWeight: row.total_weight,
      basketValue: row.basket_value,
      baseValue: row.base_value,
      indexValue: row.index_value
    };
  }

  private async storePriceBasket(basket: PriceBasket, client: any): Promise<void> {
    await client.query(`
      INSERT INTO price_baskets (
        id, name, description, items_data, total_weight, 
        basket_value, base_value, index_value
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        items_data = $4,
        basket_value = $6,
        index_value = $8,
        updated_at = CURRENT_TIMESTAMP
    `, [
      basket.id,
      basket.name,
      basket.description,
      JSON.stringify(basket.items),
      basket.totalWeight,
      basket.basketValue,
      basket.baseValue,
      basket.indexValue
    ]);
  }
}

export default InflationTrackingService;
