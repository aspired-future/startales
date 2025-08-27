import seedrandom from 'seedrandom';
import { initDb } from '../storage/db.js';
import { PolicyStorage } from '../policies/policyStorage.js';
import { PolicyEngine } from '../policies/policyEngine.js';

// Mock database transaction interface for now
const db = {
  transaction: async (callback: (tx: any) => Promise<any>) => {
    // For now, just execute the callback with a mock transaction
    return callback({});
  }
};

// Types for simulation state
export interface CampaignState {
  id: number;
  step: number;
  resources: Record<string, number>;
  buildings: Record<string, number>;
  queues: QueueItem[];
  policies: PolicyEffect[];
  kpis: Record<string, any>;
  veziesEvents: VeziesEvent[];
}

export interface QueueItem {
  id: string;
  type: 'building' | 'research' | 'military';
  itemId: string;
  progress: number;
  totalTime: number;
  priority: number;
}

export interface PolicyEffect {
  id: string;
  type: string;
  modifier: number;
  duration: number;
  remaining: number;
}

export interface VeziesEvent {
  type: 'queue_complete' | 'planet_discovered' | 'research_breakthrough';
  data: Record<string, any>;
  timestamp: Date;
}

export interface SimulationStep {
  campaignId: number;
  seed: string;
  actions?: any[];
}

/**
 * Core simulation engine that advances campaign state on a fixed tick
 * with deterministic behavior using seeded PRNG
 */
export async function step({ campaignId, seed, actions = [] }: SimulationStep): Promise<CampaignState> {
  // Initialize PRNG with seed for deterministic outcomes
  const rng = seedrandom(seed);
  
  // Start database transaction for atomic state updates
  return db.transaction(async (tx) => {
    try {
      // Load current campaign state
      const state = await loadCampaignState(campaignId, tx);
      
      // Apply pending actions to state
      const stateWithActions = applyPendingActions(state, actions);
      
      // Run reducers in the specified order for deterministic processing
      const afterProduction = productionReducer(stateWithActions, rng);
      const afterQueues = queueReducer(afterProduction, rng);
      const afterLogistics = logisticsCapReducer(afterQueues, rng);
      const afterPrices = priceReducer(afterLogistics, rng);
      const afterProxies = readinessAndScienceReducer(afterPrices, rng);
      const afterPolicies = policyModifierReducer(afterProxies, rng);
      const finalState = kpiAndVeziesReducer(afterPolicies, rng);
      
      // Increment step counter
      finalState.step += 1;
      
      // Persist state changes and KPI snapshots
      await persistStateChanges(finalState, tx);
      await persistKpiSnapshot(campaignId, finalState.kpis, finalState.step, tx);
      
      // Emit Vezies events
      await emitVeziesEvents(finalState.veziesEvents, tx);
      
      return finalState;
    } catch (error) {
      // Transaction will automatically rollback on error
      console.error('Simulation step failed:', error);
      throw error;
    }
  });
}

/**
 * Load campaign state from database
 */
async function loadCampaignState(campaignId: number, tx: any): Promise<CampaignState> {
  // TODO: Load actual campaign data from database
  // For now, return a mock state structure
  return {
    id: campaignId,
    step: 0,
    resources: {
      credits: 1000,
      materials: 500,
      energy: 200,
      food: 300
    },
    buildings: {
      factory: 2,
      mine: 1,
      farm: 3,
      power_plant: 1
    },
    queues: [],
    policies: [],
    kpis: {},
    veziesEvents: []
  };
}

/**
 * Apply pending actions to the current state
 */
function applyPendingActions(state: CampaignState, actions: any[]): CampaignState {
  // TODO: Process pending actions (build orders, policy changes, etc.)
  // For now, return state unchanged
  return { ...state };
}

/**
 * Production reducer - calculates resource production
 */
function productionReducer(state: CampaignState, rng: () => number): CampaignState {
  const newState = { ...state, resources: { ...state.resources } };
  
  // Base production rates per building type
  const productionRates = {
    factory: { credits: 50, materials: 0, energy: -10, food: 0 },
    mine: { credits: 0, materials: 30, energy: -5, food: 0 },
    power_plant: { credits: 0, materials: 0, energy: 40, food: 0 },
    farm: { credits: 0, materials: 0, energy: -3, food: 25 },
    research_lab: { credits: -20, materials: -5, energy: -15, food: 0 },
    habitat: { credits: 0, materials: 0, energy: -8, food: -12 }
  };
  
  // Calculate total production from all buildings
  Object.entries(newState.buildings).forEach(([buildingType, count]) => {
    const rates = productionRates[buildingType as keyof typeof productionRates];
    if (!rates) return;
    
    Object.entries(rates).forEach(([resource, baseRate]) => {
      if (baseRate === 0) return;
      
      // Apply deterministic variation (±5%) based on RNG
      const variation = 1 + (rng() - 0.5) * 0.1;
      const production = Math.floor(baseRate * count * variation);
      
      newState.resources[resource] = Math.max(0, 
        (newState.resources[resource] || 0) + production
      );
    });
  });
  
  // Apply population-based consumption
  const totalPopulation = Object.values(newState.buildings).reduce((sum, count) => sum + count * 100, 0);
  const populationConsumption = {
    food: Math.floor(totalPopulation * 0.1),
    energy: Math.floor(totalPopulation * 0.05)
  };
  
  Object.entries(populationConsumption).forEach(([resource, consumption]) => {
    newState.resources[resource] = Math.max(0, 
      (newState.resources[resource] || 0) - consumption
    );
  });
  
  return newState;
}

/**
 * Queue reducer - processes building and research queues
 */
function queueReducer(state: CampaignState, rng: () => number): CampaignState {
  const newState = { 
    ...state, 
    queues: [...state.queues], 
    veziesEvents: [...state.veziesEvents],
    buildings: { ...state.buildings },
    resources: { ...state.resources }
  };
  
  // Sort queues by priority (higher priority first)
  const sortedQueues = [...newState.queues].sort((a, b) => b.priority - a.priority);
  
  // Process each queue item
  const completedQueues: string[] = [];
  
  newState.queues = sortedQueues.map(item => {
    const updatedItem = { ...item };
    
    // Calculate progress based on available resources and efficiency
    const efficiency = calculateQueueEfficiency(newState, updatedItem, rng);
    const progressIncrement = Math.max(0.1, efficiency); // Minimum progress to avoid stalling
    
    updatedItem.progress += progressIncrement;
    
    // Check if item is completed
    if (updatedItem.progress >= updatedItem.totalTime) {
      // Complete the queue item
      const success = completeQueueItem(newState, updatedItem);
      
      if (success) {
        // Add completion event
        newState.veziesEvents.push({
          type: 'queue_complete',
          data: { 
            itemId: updatedItem.itemId, 
            type: updatedItem.type,
            completionTime: updatedItem.totalTime,
            efficiency: efficiency
          },
          timestamp: new Date()
        });
        
        completedQueues.push(updatedItem.id);
        return null; // Mark for removal
      } else {
        // Reset progress if completion failed (e.g., insufficient resources)
        updatedItem.progress = updatedItem.totalTime - 1;
      }
    }
    
    return updatedItem;
  }).filter(Boolean) as QueueItem[]; // Remove completed items
  
  return newState;
}

/**
 * Calculate queue efficiency based on available resources and other factors
 */
function calculateQueueEfficiency(state: CampaignState, item: QueueItem, rng: () => number): number {
  let efficiency = 1.0;
  
  // Base efficiency varies by queue type
  switch (item.type) {
    case 'building':
      // Building efficiency depends on materials and energy
      const materialsRatio = Math.min(1, (state.resources.materials || 0) / 100);
      const energyRatio = Math.min(1, (state.resources.energy || 0) / 50);
      efficiency = (materialsRatio + energyRatio) / 2;
      break;
      
    case 'research':
      // Research efficiency depends on credits and energy
      const creditsRatio = Math.min(1, (state.resources.credits || 0) / 200);
      const researchEnergyRatio = Math.min(1, (state.resources.energy || 0) / 100);
      efficiency = (creditsRatio + researchEnergyRatio) / 2;
      break;
      
    case 'military':
      // Military efficiency depends on materials and credits
      const militaryMaterialsRatio = Math.min(1, (state.resources.materials || 0) / 150);
      const militaryCreditsRatio = Math.min(1, (state.resources.credits || 0) / 100);
      efficiency = (militaryMaterialsRatio + militaryCreditsRatio) / 2;
      break;
  }
  
  // Apply small random variation (±10%) for realism
  const variation = 1 + (rng() - 0.5) * 0.2;
  efficiency = Math.max(0.1, Math.min(2.0, efficiency * variation));
  
  return efficiency;
}

/**
 * Complete a queue item and apply its effects
 */
function completeQueueItem(state: CampaignState, item: QueueItem): boolean {
  try {
    switch (item.type) {
      case 'building':
        // Consume resources for building completion
        const buildingCosts = getBuildingCosts(item.itemId);
        if (!canAffordCosts(state.resources, buildingCosts)) {
          return false; // Cannot complete due to insufficient resources
        }
        
        // Deduct costs and add building
        Object.entries(buildingCosts).forEach(([resource, cost]) => {
          state.resources[resource] = (state.resources[resource] || 0) - cost;
        });
        state.buildings[item.itemId] = (state.buildings[item.itemId] || 0) + 1;
        break;
        
      case 'research':
        // Consume resources for research completion
        const researchCosts = getResearchCosts(item.itemId);
        if (!canAffordCosts(state.resources, researchCosts)) {
          return false;
        }
        
        // Deduct costs and apply research effects
        Object.entries(researchCosts).forEach(([resource, cost]) => {
          state.resources[resource] = (state.resources[resource] || 0) - cost;
        });
        // TODO: Apply specific research benefits
        break;
        
      case 'military':
        // Consume resources for military unit completion
        const militaryCosts = getMilitaryCosts(item.itemId);
        if (!canAffordCosts(state.resources, militaryCosts)) {
          return false;
        }
        
        // Deduct costs and add military units
        Object.entries(militaryCosts).forEach(([resource, cost]) => {
          state.resources[resource] = (state.resources[resource] || 0) - cost;
        });
        // TODO: Add military units to state
        break;
        
      default:
        return false; // Unknown queue type
    }
    
    return true; // Successfully completed
  } catch (error) {
    console.error('Error completing queue item:', error);
    return false;
  }
}

/**
 * Get building costs for completion
 */
function getBuildingCosts(buildingId: string): Record<string, number> {
  const costs: Record<string, Record<string, number>> = {
    factory: { materials: 100, credits: 200, energy: 50 },
    mine: { materials: 80, credits: 150, energy: 30 },
    power_plant: { materials: 120, credits: 300, energy: 0 },
    farm: { materials: 60, credits: 100, energy: 20 },
    research_lab: { materials: 150, credits: 400, energy: 100 },
    habitat: { materials: 200, credits: 250, energy: 75 }
  };
  
  return costs[buildingId] || { materials: 50, credits: 100, energy: 25 };
}

/**
 * Get research costs for completion
 */
function getResearchCosts(researchId: string): Record<string, number> {
  // Base research costs - can be expanded later
  return { credits: 500, energy: 200, materials: 50 };
}

/**
 * Get military unit costs for completion
 */
function getMilitaryCosts(unitId: string): Record<string, number> {
  const costs: Record<string, Record<string, number>> = {
    infantry: { credits: 100, materials: 50, energy: 25 },
    vehicle: { credits: 300, materials: 200, energy: 100 },
    aircraft: { credits: 800, materials: 400, energy: 300 }
  };
  
  return costs[unitId] || { credits: 100, materials: 50, energy: 25 };
}

/**
 * Check if state has enough resources to afford costs
 */
function canAffordCosts(resources: Record<string, number>, costs: Record<string, number>): boolean {
  return Object.entries(costs).every(([resource, cost]) => {
    return (resources[resource] || 0) >= cost;
  });
}

/**
 * Logistics capacity reducer - enforces logistics limits
 */
function logisticsCapReducer(state: CampaignState, rng: () => number): CampaignState {
  const newState = { ...state, resources: { ...state.resources } };
  
  // Calculate total logistics capacity based on infrastructure
  const logisticsBuildings = ['factory', 'mine', 'farm']; // Buildings that contribute to logistics
  const totalLogisticsCapacity = logisticsBuildings.reduce((total, building) => {
    return total + (newState.buildings[building] || 0) * 50; // Each building adds 50 capacity
  }, 200); // Base capacity of 200
  
  // Calculate current resource load (resources consume logistics capacity)
  const resourceLoad = Object.values(newState.resources).reduce((total, amount) => {
    return total + Math.floor(amount / 10); // Every 10 resources = 1 logistics point
  }, 0);
  
  // Apply logistics constraints if over capacity
  if (resourceLoad > totalLogisticsCapacity) {
    const overage = resourceLoad - totalLogisticsCapacity;
    const reductionFactor = Math.max(0.5, 1 - (overage / totalLogisticsCapacity));
    
    // Reduce resource production efficiency for next tick
    Object.keys(newState.resources).forEach(resource => {
      if (newState.resources[resource] > 0) {
        const reduction = Math.floor(newState.resources[resource] * (1 - reductionFactor) * 0.1);
        newState.resources[resource] = Math.max(0, newState.resources[resource] - reduction);
      }
    });
    
    // Add logistics strain indicator to KPIs
    newState.kpis = { ...newState.kpis, logistics_strain: overage / totalLogisticsCapacity };
  } else {
    newState.kpis = { ...newState.kpis, logistics_strain: 0 };
  }
  
  // Store logistics metrics
  newState.kpis = { 
    ...newState.kpis, 
    logistics_capacity: totalLogisticsCapacity,
    logistics_usage: resourceLoad,
    logistics_efficiency: Math.min(1, totalLogisticsCapacity / Math.max(1, resourceLoad))
  };
  
  return newState;
}

/**
 * Price reducer - adjusts resource prices based on supply/demand
 */
function priceReducer(state: CampaignState, rng: () => number): CampaignState {
  const newState = { ...state, kpis: { ...state.kpis } };
  
  // Base prices for resources
  const basePrices = {
    credits: 1.0, // Credits are the base currency
    materials: 2.0,
    energy: 1.5,
    food: 1.2
  };
  
  // Calculate supply/demand ratios
  const prices: Record<string, number> = {};
  
  Object.keys(basePrices).forEach(resource => {
    const currentStock = newState.resources[resource] || 0;
    const basePrice = basePrices[resource as keyof typeof basePrices];
    
    // Simple supply/demand model: more supply = lower price, less supply = higher price
    const supplyFactor = Math.max(0.1, Math.min(3.0, 1000 / Math.max(1, currentStock)));
    
    // Apply market volatility (±15% random variation)
    const volatility = 1 + (rng() - 0.5) * 0.3;
    
    // Calculate final price with bounds
    const finalPrice = Math.max(0.1, Math.min(10.0, basePrice * supplyFactor * volatility));
    prices[resource] = Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
  });
  
  // Store price information in KPIs
  newState.kpis = { ...newState.kpis, resource_prices: prices };
  
  // Calculate market indicators
  const avgPriceChange = Object.values(prices).reduce((sum, price, index) => {
    const basePrice = Object.values(basePrices)[index];
    return sum + (price - basePrice) / basePrice;
  }, 0) / Object.keys(prices).length;
  
  newState.kpis.market_volatility = Math.abs(avgPriceChange);
  newState.kpis.inflation_rate = Math.max(-0.5, Math.min(0.5, avgPriceChange));
  
  return newState;
}

/**
 * Readiness and science reducer - calculates military/research proxies
 */
function readinessAndScienceReducer(state: CampaignState, rng: () => number): CampaignState {
  const newState = { ...state, kpis: { ...state.kpis } };
  
  // Calculate military readiness based on resources and infrastructure
  const militaryFactors = {
    materials: Math.min(1, (newState.resources.materials || 0) / 500),
    energy: Math.min(1, (newState.resources.energy || 0) / 300),
    credits: Math.min(1, (newState.resources.credits || 0) / 1000),
    infrastructure: Math.min(1, (newState.buildings.factory || 0) / 5)
  };
  
  const militaryReadiness = Object.values(militaryFactors).reduce((sum, factor) => sum + factor, 0) / 4;
  
  // Apply random events that can affect readiness (±10%)
  const readinessModifier = 1 + (rng() - 0.5) * 0.2;
  newState.kpis.military_readiness = Math.max(0, Math.min(1, militaryReadiness * readinessModifier));
  
  // Calculate science progress based on research infrastructure and resources
  const scienceFactors = {
    research_labs: Math.min(1, (newState.buildings.research_lab || 0) / 3),
    energy: Math.min(1, (newState.resources.energy || 0) / 400),
    credits: Math.min(1, (newState.resources.credits || 0) / 800),
    population: Math.min(1, Object.values(newState.buildings).reduce((sum, count) => sum + count * 100, 0) / 2000)
  };
  
  const scienceProgress = Object.values(scienceFactors).reduce((sum, factor) => sum + factor, 0) / 4;
  
  // Apply research breakthrough chances (small random boosts)
  const breakthroughChance = rng();
  let scienceModifier = 1;
  
  if (breakthroughChance > 0.95) {
    // Major breakthrough (5% chance)
    scienceModifier = 1.5;
    newState.veziesEvents.push({
      type: 'research_breakthrough',
      data: { type: 'major', multiplier: 1.5 },
      timestamp: new Date()
    });
  } else if (breakthroughChance > 0.85) {
    // Minor breakthrough (10% chance)
    scienceModifier = 1.2;
    newState.veziesEvents.push({
      type: 'research_breakthrough',
      data: { type: 'minor', multiplier: 1.2 },
      timestamp: new Date()
    });
  }
  
  newState.kpis.science_progress = Math.max(0, Math.min(1, scienceProgress * scienceModifier));
  
  // Calculate technology level proxy
  const technologyLevel = Math.min(10, 
    (newState.kpis.science_progress || 0) * 5 + 
    (newState.buildings.research_lab || 0) * 0.5
  );
  
  newState.kpis.technology_level = Math.round(technologyLevel * 10) / 10; // Round to 1 decimal
  
  // Calculate defense capability
  const defenseFactor = militaryReadiness * 0.7 + (newState.kpis.logistics_efficiency || 0) * 0.3;
  newState.kpis.defense_capability = Math.round(defenseFactor * 100) / 100;
  
  return newState;
}

/**
 * Policy modifier reducer - applies active policy effects
 */
function policyModifierReducer(state: CampaignState, rng: () => number): CampaignState {
  const newState = { ...state, policies: [...state.policies] };
  
  // Process active policies and apply their effects
  newState.policies = newState.policies.map(policy => {
    const updatedPolicy = { ...policy };
    updatedPolicy.remaining -= 1;
    
    // Apply policy effects to resources or other state
    switch (policy.type) {
      case 'tax_boost':
        newState.resources.credits = (newState.resources.credits || 0) + policy.modifier;
        break;
      case 'production_bonus':
        // Policy effects are already factored into production calculations
        break;
    }
    
    return updatedPolicy.remaining > 0 ? updatedPolicy : null;
  }).filter(Boolean) as PolicyEffect[];
  
  return newState;
}

/**
 * KPI and Vezies reducer - calculates KPIs and generates events
 */
function kpiAndVeziesReducer(state: CampaignState, rng: () => number): CampaignState {
  const newState = { ...state };
  
  // Calculate key performance indicators
  newState.kpis = {
    total_population: Object.values(state.buildings).reduce((sum, count) => sum + count * 100, 0),
    total_resources: Object.values(state.resources).reduce((sum, amount) => sum + amount, 0),
    production_rate: Object.values(state.buildings).reduce((sum, count) => sum + count, 0) * 10,
    queue_efficiency: state.queues.length > 0 ? 
      state.queues.reduce((sum, item) => sum + (item.progress / item.totalTime), 0) / state.queues.length : 1.0
  };
  
  return newState;
}

/**
 * Persist state changes to database
 */
async function persistStateChanges(state: CampaignState, tx: any): Promise<void> {
  // TODO: Implement actual database persistence
  // For now, just log the state changes
  console.log(`Persisting state for campaign ${state.id}, step ${state.step}`);
}

/**
 * Persist KPI snapshot to database
 */
async function persistKpiSnapshot(campaignId: number, kpis: Record<string, number>, step: number, tx: any): Promise<void> {
  // TODO: Insert KPI data into kpi_snapshots table
  console.log(`Persisting KPI snapshot for campaign ${campaignId}, step ${step}:`, kpis);
}

/**
 * Emit Vezies events
 */
async function emitVeziesEvents(events: VeziesEvent[], tx: any): Promise<void> {
  // TODO: Process and emit events to the Vezies system
  if (events.length > 0) {
    console.log(`Emitting ${events.length} Vezies events:`, events);
  }
}
