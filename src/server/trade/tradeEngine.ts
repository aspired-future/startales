import { CampaignState } from '../../simulation/engine/engine';
import { nanoid } from 'nanoid';

export interface TradeResource {
  id: string;
  name: string;
  category: 'raw_materials' | 'manufactured' | 'energy' | 'food' | 'luxury' | 'technology';
  basePrice: number; // Base price in credits
  volatility: number; // 0-1, how much price can fluctuate
  perishable: boolean;
  description: string;
}

export interface TradePrice {
  resourceId: string;
  currentPrice: number;
  priceHistory: Array<{ step: number; price: number; volume: number }>;
  supply: number;
  demand: number;
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: number; // Campaign step
}

export interface TradeRoute {
  id: string;
  campaignId: number;
  name: string;
  origin: string;
  destination: string;
  resources: string[]; // Resource IDs
  distance: number; // In space units
  travelTime: number; // In simulation steps
  capacity: number; // Max cargo per shipment
  tariffRate: number; // 0-1, additional cost multiplier
  status: 'active' | 'suspended' | 'blocked';
  createdAt: Date;
  lastUsed?: Date;
}

export interface TradeContract {
  id: string;
  campaignId: number;
  type: 'buy' | 'sell' | 'exchange';
  resourceId: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  counterparty: string; // Trading partner name
  routeId?: string; // Optional route for delivery
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'failed';
  createdAt: Date;
  deliveryDeadline?: Date;
  completedAt?: Date;
  terms: {
    paymentMethod: 'credits' | 'barter' | 'deferred';
    deliveryTerms: 'immediate' | 'scheduled' | 'on_demand';
    penalties?: number; // Late delivery penalty rate
  };
}

export interface TradeAnalytics {
  totalTradeVolume: number;
  averagePrices: Record<string, number>;
  priceIndices: {
    rawMaterialsIndex: number;
    manufacturedIndex: number;
    overallIndex: number;
  };
  tradeBalance: number; // Net imports vs exports
  activeContracts: number;
  completedContracts: number;
  topTradingPartners: Array<{ name: string; volume: number }>;
}

/**
 * Core trade engine handling pricing, routes, and contracts
 */
export class TradeEngine {
  
  private static readonly TRADE_RESOURCES: TradeResource[] = [
    {
      id: 'iron_ore',
      name: 'Iron Ore',
      category: 'raw_materials',
      basePrice: 15,
      volatility: 0.3,
      perishable: false,
      description: 'Essential raw material for manufacturing'
    },
    {
      id: 'rare_metals',
      name: 'Rare Metals',
      category: 'raw_materials',
      basePrice: 120,
      volatility: 0.5,
      perishable: false,
      description: 'High-value metals for advanced technology'
    },
    {
      id: 'manufactured_goods',
      name: 'Manufactured Goods',
      category: 'manufactured',
      basePrice: 45,
      volatility: 0.2,
      perishable: false,
      description: 'Processed industrial products'
    },
    {
      id: 'energy_cells',
      name: 'Energy Cells',
      category: 'energy',
      basePrice: 30,
      volatility: 0.4,
      perishable: true,
      description: 'Portable energy storage units'
    },
    {
      id: 'food_supplies',
      name: 'Food Supplies',
      category: 'food',
      basePrice: 8,
      volatility: 0.6,
      perishable: true,
      description: 'Essential nutrition for population'
    },
    {
      id: 'luxury_items',
      name: 'Luxury Items',
      category: 'luxury',
      basePrice: 200,
      volatility: 0.3,
      perishable: false,
      description: 'High-value consumer goods'
    },
    {
      id: 'tech_components',
      name: 'Technology Components',
      category: 'technology',
      basePrice: 85,
      volatility: 0.4,
      perishable: false,
      description: 'Advanced technological components'
    }
  ];
  
  /**
   * Get all available trade resources
   */
  static getTradeResources(): TradeResource[] {
    return [...this.TRADE_RESOURCES];
  }
  
  /**
   * Get resource by ID
   */
  static getResource(resourceId: string): TradeResource | null {
    return this.TRADE_RESOURCES.find(r => r.id === resourceId) || null;
  }
  
  /**
   * Calculate current prices based on supply, demand, and market conditions
   */
  static calculatePrices(
    campaignState: CampaignState,
    previousPrices: Record<string, TradePrice> = {},
    rng: () => number
  ): Record<string, TradePrice> {
    const currentPrices: Record<string, TradePrice> = {};
    
    for (const resource of this.TRADE_RESOURCES) {
      const previousPrice = previousPrices[resource.id];
      const basePrice = resource.basePrice;
      
      // Calculate supply based on campaign resources and production
      let supply = campaignState.resources[resource.id] || 0;
      
      // Add production-based supply estimation
      if (resource.category === 'raw_materials') {
        supply += (campaignState.buildings.mine || 0) * 20;
      } else if (resource.category === 'manufactured') {
        supply += (campaignState.buildings.factory || 0) * 15;
      } else if (resource.category === 'food') {
        supply += (campaignState.buildings.farm || 0) * 25;
      } else if (resource.category === 'energy') {
        supply += (campaignState.buildings.power_plant || 0) * 30;
      }
      
      // Calculate demand based on population and buildings
      const population = Object.values(campaignState.buildings).reduce((sum, count) => sum + count * 100, 700);
      let demand = population * 0.1; // Base population demand
      
      // Add building-specific demand
      if (resource.category === 'raw_materials') {
        demand += (campaignState.buildings.factory || 0) * 10;
      } else if (resource.category === 'energy') {
        demand += Object.values(campaignState.buildings).reduce((sum, count) => sum + count * 5, 0);
      } else if (resource.category === 'food') {
        demand += population * 0.3;
      }
      
      // Calculate supply/demand ratio
      const supplyDemandRatio = supply / Math.max(demand, 1);
      
      // Price adjustment based on supply/demand
      let priceMultiplier = 1;
      if (supplyDemandRatio < 0.5) {
        priceMultiplier = 1.8; // High demand, low supply
      } else if (supplyDemandRatio < 0.8) {
        priceMultiplier = 1.3; // Moderate scarcity
      } else if (supplyDemandRatio > 2.0) {
        priceMultiplier = 0.6; // Oversupply
      } else if (supplyDemandRatio > 1.5) {
        priceMultiplier = 0.8; // Moderate oversupply
      }
      
      // Add volatility-based random variation
      const volatilityFactor = 1 + (rng() - 0.5) * resource.volatility;
      
      // Calculate final price
      let currentPrice = basePrice * priceMultiplier * volatilityFactor;
      
      // Smooth price changes (prevent extreme jumps)
      if (previousPrice) {
        const maxChange = 0.3; // Maximum 30% change per step
        const priceChange = (currentPrice - previousPrice.currentPrice) / previousPrice.currentPrice;
        if (Math.abs(priceChange) > maxChange) {
          currentPrice = previousPrice.currentPrice * (1 + Math.sign(priceChange) * maxChange);
        }
      }
      
      // Determine trend
      let trend: 'rising' | 'falling' | 'stable' = 'stable';
      if (previousPrice) {
        const change = (currentPrice - previousPrice.currentPrice) / previousPrice.currentPrice;
        if (change > 0.05) trend = 'rising';
        else if (change < -0.05) trend = 'falling';
      }
      
      // Update price history
      const priceHistory = previousPrice ? [...previousPrice.priceHistory] : [];
      priceHistory.push({
        step: campaignState.step,
        price: currentPrice,
        volume: Math.floor(Math.min(supply, demand))
      });
      
      // Keep only last 20 price points
      if (priceHistory.length > 20) {
        priceHistory.shift();
      }
      
      currentPrices[resource.id] = {
        resourceId: resource.id,
        currentPrice: Math.round(currentPrice * 100) / 100,
        priceHistory,
        supply: Math.round(supply),
        demand: Math.round(demand),
        trend,
        lastUpdated: campaignState.step
      };
    }
    
    return currentPrices;
  }
  
  /**
   * Create a new trade route
   */
  static createTradeRoute(
    campaignId: number,
    routeData: Omit<TradeRoute, 'id' | 'campaignId' | 'createdAt' | 'status'>
  ): TradeRoute {
    return {
      id: nanoid(),
      campaignId,
      ...routeData,
      status: 'active',
      createdAt: new Date()
    };
  }
  
  /**
   * Create a new trade contract
   */
  static createTradeContract(
    campaignId: number,
    contractData: Omit<TradeContract, 'id' | 'campaignId' | 'createdAt' | 'status' | 'totalValue'>
  ): TradeContract {
    const totalValue = contractData.quantity * contractData.pricePerUnit;
    
    return {
      id: nanoid(),
      campaignId,
      ...contractData,
      totalValue,
      status: 'pending',
      createdAt: new Date()
    };
  }
  
  /**
   * Calculate trade analytics for a campaign
   */
  static calculateTradeAnalytics(
    prices: Record<string, TradePrice>,
    contracts: TradeContract[],
    routes: TradeRoute[]
  ): TradeAnalytics {
    const completedContracts = contracts.filter(c => c.status === 'completed');
    const activeContracts = contracts.filter(c => c.status === 'active' || c.status === 'pending');
    
    // Calculate total trade volume
    const totalTradeVolume = completedContracts.reduce((sum, contract) => {
      return sum + contract.totalValue;
    }, 0);
    
    // Calculate average prices
    const averagePrices: Record<string, number> = {};
    Object.entries(prices).forEach(([resourceId, priceData]) => {
      averagePrices[resourceId] = priceData.currentPrice;
    });
    
    // Calculate price indices
    const rawMaterialsPrices = this.TRADE_RESOURCES
      .filter(r => r.category === 'raw_materials')
      .map(r => prices[r.id]?.currentPrice || r.basePrice);
    const manufacturedPrices = this.TRADE_RESOURCES
      .filter(r => r.category === 'manufactured')
      .map(r => prices[r.id]?.currentPrice || r.basePrice);
    
    const rawMaterialsIndex = rawMaterialsPrices.reduce((sum, price) => sum + price, 0) / rawMaterialsPrices.length;
    const manufacturedIndex = manufacturedPrices.reduce((sum, price) => sum + price, 0) / manufacturedPrices.length;
    const overallIndex = Object.values(averagePrices).reduce((sum, price) => sum + price, 0) / Object.values(averagePrices).length;
    
    // Calculate trade balance (exports - imports)
    const exports = completedContracts.filter(c => c.type === 'sell').reduce((sum, c) => sum + c.totalValue, 0);
    const imports = completedContracts.filter(c => c.type === 'buy').reduce((sum, c) => sum + c.totalValue, 0);
    const tradeBalance = exports - imports;
    
    // Calculate top trading partners
    const partnerVolumes: Record<string, number> = {};
    completedContracts.forEach(contract => {
      partnerVolumes[contract.counterparty] = (partnerVolumes[contract.counterparty] || 0) + contract.totalValue;
    });
    
    const topTradingPartners = Object.entries(partnerVolumes)
      .map(([name, volume]) => ({ name, volume }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
    
    return {
      totalTradeVolume: Math.round(totalTradeVolume),
      averagePrices,
      priceIndices: {
        rawMaterialsIndex: Math.round(rawMaterialsIndex * 100) / 100,
        manufacturedIndex: Math.round(manufacturedIndex * 100) / 100,
        overallIndex: Math.round(overallIndex * 100) / 100
      },
      tradeBalance: Math.round(tradeBalance),
      activeContracts: activeContracts.length,
      completedContracts: completedContracts.length,
      topTradingPartners
    };
  }
  
  /**
   * Apply tariff to a trade route
   */
  static applyTariff(basePrice: number, tariffRate: number): number {
    return basePrice * (1 + tariffRate);
  }
  
  /**
   * Check if a contract can be executed based on available resources
   */
  static canExecuteContract(contract: TradeContract, campaignState: CampaignState): boolean {
    if (contract.type === 'sell') {
      // Check if we have enough resources to sell
      const available = campaignState.resources[contract.resourceId] || 0;
      return available >= contract.quantity;
    } else if (contract.type === 'buy') {
      // Check if we have enough credits to buy
      return campaignState.resources.credits >= contract.totalValue;
    }
    
    return true; // Exchange contracts have different validation logic
  }
  
  /**
   * Execute a trade contract (modify campaign state)
   */
  static executeContract(contract: TradeContract, campaignState: CampaignState): CampaignState {
    const newState = { ...campaignState, resources: { ...campaignState.resources } };
    
    if (contract.type === 'sell') {
      // Sell resources, gain credits
      newState.resources[contract.resourceId] = Math.max(0, 
        (newState.resources[contract.resourceId] || 0) - contract.quantity);
      newState.resources.credits += contract.totalValue;
    } else if (contract.type === 'buy') {
      // Buy resources, spend credits
      newState.resources.credits = Math.max(0, newState.resources.credits - contract.totalValue);
      newState.resources[contract.resourceId] = 
        (newState.resources[contract.resourceId] || 0) + contract.quantity;
    }
    
    return newState;
  }
}
