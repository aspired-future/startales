/**
 * GameStateManager - Central hub for game state aggregation and management
 * 
 * This class is responsible for:
 * - Aggregating state from all game systems
 * - Providing full game state context to APIs
 * - Managing state updates and persistence
 * - Maintaining state consistency across systems
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import {
  GameStateSnapshot,
  CivilizationContext,
  GalacticContext,
  EconomicSituation,
  PoliticalSituation,
  MilitarySituation,
  TechnologicalSituation,
  SocialSituation,
  IGameStateManager,
  GameEvent,
  CrisisEvent,
  PerformanceMetrics
} from './types';

export class GameStateManager extends EventEmitter implements IGameStateManager {
  private pool: Pool;
  private currentState: GameStateSnapshot | null = null;
  private stateCache: Map<string, any> = new Map();
  private cacheTimeout: number = 30000; // 30 seconds
  private lastStateUpdate: Date = new Date();

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  /**
   * Get the complete current game state by aggregating from all systems
   */
  async getCurrentState(): Promise<GameStateSnapshot> {
    try {
      // Check if we have a recent cached state
      if (this.currentState && this.isStateFresh()) {
        return this.currentState;
      }

      console.log('🔄 Aggregating fresh game state from all systems...');
      const startTime = performance.now();

      // Aggregate state from all systems in parallel
      const [
        coreGameData,
        civilizations,
        galacticContext,
        economicSituation,
        politicalSituation,
        militarySituation,
        technologicalSituation,
        socialSituation,
        activeEvents,
        activeCrises,
        performanceMetrics
      ] = await Promise.all([
        this.getCoreGameData(),
        this.getAllCivilizations(),
        this.getGalacticContext(),
        this.getEconomicSituation(),
        this.getPoliticalSituation(),
        this.getMilitarySituation(),
        this.getTechnologicalSituation(),
        this.getSocialSituation(),
        this.getActiveEvents(),
        this.getActiveCrises(),
        this.getPerformanceMetrics()
      ]);

      // Construct complete game state
      this.currentState = {
        currentTick: coreGameData.currentTick,
        currentTurn: coreGameData.currentTurn,
        gamePhase: this.determineGamePhase(coreGameData.currentTurn),
        timestamp: new Date(),
        
        civilizations,
        galacticContext,
        economicSituation,
        politicalSituation,
        militarySituation,
        technologicalSituation,
        socialSituation,
        
        activeEvents,
        activeCrises,
        performanceMetrics
      };

      this.lastStateUpdate = new Date();
      
      const aggregationTime = performance.now() - startTime;
      console.log(`✅ Game state aggregated in ${aggregationTime.toFixed(2)}ms`);
      
      // Emit state update event
      this.emit('stateUpdated', this.currentState);
      
      return this.currentState;
    } catch (error) {
      console.error('❌ Failed to get current game state:', error);
      throw new Error(`Game state aggregation failed: ${error.message}`);
    }
  }

  /**
   * Update the game state with partial updates
   */
  async updateState(updates: Partial<GameStateSnapshot>): Promise<void> {
    try {
      console.log('🔄 Updating game state with changes...');
      
      // Get current state if not cached
      if (!this.currentState) {
        await this.getCurrentState();
      }

      // Apply updates to current state
      this.currentState = {
        ...this.currentState!,
        ...updates,
        timestamp: new Date()
      };

      // Persist critical updates to database
      await this.persistStateUpdates(updates);
      
      // Update cache timestamp
      this.lastStateUpdate = new Date();
      
      // Emit update event
      this.emit('stateUpdated', this.currentState, updates);
      
      console.log('✅ Game state updated successfully');
    } catch (error) {
      console.error('❌ Failed to update game state:', error);
      throw new Error(`Game state update failed: ${error.message}`);
    }
  }

  /**
   * Get specific civilization state
   */
  async getCivilizationState(civilizationId: string): Promise<CivilizationContext> {
    try {
      const cacheKey = `civ_${civilizationId}`;
      
      // Check cache first
      if (this.stateCache.has(cacheKey)) {
        const cached = this.stateCache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      // Query civilization data from database
      const civQuery = `
        SELECT 
          c.*,
          p.total_population,
          p.demographics,
          p.growth_rate,
          e.gdp,
          e.gdp_growth_rate,
          e.unemployment,
          e.inflation,
          m.total_forces,
          m.readiness,
          m.defense_budget,
          t.research_level,
          t.active_projects,
          cu.cultural_index,
          cu.social_cohesion
        FROM civilizations c
        LEFT JOIN population_data p ON c.id = p.civilization_id
        LEFT JOIN economic_data e ON c.id = e.civilization_id
        LEFT JOIN military_data m ON c.id = m.civilization_id
        LEFT JOIN technology_data t ON c.id = t.civilization_id
        LEFT JOIN culture_data cu ON c.id = cu.civilization_id
        WHERE c.id = $1
      `;

      const result = await this.pool.query(civQuery, [civilizationId]);
      
      if (result.rows.length === 0) {
        throw new Error(`Civilization ${civilizationId} not found`);
      }

      const row = result.rows[0];
      
      // Get system states and knob settings
      const [systemStates, knobSettings, recentEvents, recentDecisions] = await Promise.all([
        this.getCivilizationSystemStates(civilizationId),
        this.getCivilizationKnobSettings(civilizationId),
        this.getCivilizationRecentEvents(civilizationId),
        this.getCivilizationRecentDecisions(civilizationId)
      ]);

      const civilizationContext: CivilizationContext = {
        id: row.id,
        name: row.name,
        species: row.species,
        government_type: row.government_type,
        capital_planet: row.capital_planet,
        
        total_population: row.total_population || 0,
        military_strength: row.total_forces || 0,
        economic_power: row.gdp || 0,
        technology_level: row.research_level || 0,
        diplomatic_standing: row.diplomatic_standing || 0,
        
        populationData: {
          totalPopulation: row.total_population || 0,
          demographics: row.demographics || {},
          growthRate: row.growth_rate || 0,
          healthIndex: row.health_index || 50,
          educationIndex: row.education_index || 50
        },
        
        economicData: {
          gdp: row.gdp || 0,
          gdpGrowthRate: row.gdp_growth_rate || 0,
          unemployment: row.unemployment || 0,
          inflation: row.inflation || 0,
          tradeBalance: row.trade_balance || 0
        },
        
        militaryData: {
          totalForces: row.total_forces || 0,
          readiness: row.readiness || 0,
          activeConflicts: [],
          defenseBudget: row.defense_budget || 0
        },
        
        technologyData: {
          researchLevel: row.research_level || 0,
          activeProjects: row.active_projects || [],
          innovations: [],
          techTree: {}
        },
        
        cultureData: {
          culturalIndex: row.cultural_index || 50,
          traditions: [],
          languages: [row.primary_language || 'Standard'],
          socialCohesion: row.social_cohesion || 50
        },
        
        systemStates,
        knobSettings,
        recentEvents,
        recentDecisions
      };

      // Cache the result
      this.stateCache.set(cacheKey, {
        data: civilizationContext,
        timestamp: Date.now()
      });

      return civilizationContext;
    } catch (error) {
      console.error(`❌ Failed to get civilization state for ${civilizationId}:`, error);
      throw new Error(`Civilization state retrieval failed: ${error.message}`);
    }
  }

  /**
   * Update specific civilization state
   */
  async updateCivilizationState(
    civilizationId: string, 
    updates: Partial<CivilizationContext>
  ): Promise<void> {
    try {
      console.log(`🔄 Updating civilization ${civilizationId} state...`);
      
      // Update civilization data in database
      if (updates.populationData) {
        await this.updatePopulationData(civilizationId, updates.populationData);
      }
      
      if (updates.economicData) {
        await this.updateEconomicData(civilizationId, updates.economicData);
      }
      
      if (updates.militaryData) {
        await this.updateMilitaryData(civilizationId, updates.militaryData);
      }
      
      if (updates.technologyData) {
        await this.updateTechnologyData(civilizationId, updates.technologyData);
      }
      
      if (updates.cultureData) {
        await this.updateCultureData(civilizationId, updates.cultureData);
      }
      
      if (updates.systemStates) {
        await this.updateSystemStates(civilizationId, updates.systemStates);
      }
      
      if (updates.knobSettings) {
        await this.updateKnobSettings(civilizationId, updates.knobSettings);
      }

      // Invalidate cache
      this.stateCache.delete(`civ_${civilizationId}`);
      
      // Invalidate full state cache
      this.currentState = null;
      
      console.log(`✅ Civilization ${civilizationId} state updated successfully`);
      
      // Emit civilization update event
      this.emit('civilizationUpdated', civilizationId, updates);
    } catch (error) {
      console.error(`❌ Failed to update civilization ${civilizationId} state:`, error);
      throw new Error(`Civilization state update failed: ${error.message}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private isStateFresh(): boolean {
    return Date.now() - this.lastStateUpdate.getTime() < this.cacheTimeout;
  }

  private async getCoreGameData(): Promise<{currentTick: number, currentTurn: number}> {
    const result = await this.pool.query(`
      SELECT current_tick, current_turn 
      FROM game_state 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    
    return result.rows[0] || { currentTick: 0, currentTurn: 0 };
  }

  private async getAllCivilizations(): Promise<Map<string, CivilizationContext>> {
    const civilizations = new Map<string, CivilizationContext>();
    
    const result = await this.pool.query('SELECT id FROM civilizations WHERE active = true');
    
    for (const row of result.rows) {
      const civContext = await this.getCivilizationState(row.id);
      civilizations.set(row.id, civContext);
    }
    
    return civilizations;
  }

  private async getGalacticContext(): Promise<GalacticContext> {
    const result = await this.pool.query(`
      SELECT 
        galaxy_size,
        explored_systems,
        total_systems
      FROM galactic_state 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);
    
    const row = result.rows[0] || {};
    
    return {
      galaxySize: row.galaxy_size || 1000,
      exploredSystems: row.explored_systems || 0,
      totalSystems: row.total_systems || 1000,
      activeExplorations: [],
      cosmicEvents: [],
      galacticMarkets: [],
      environmentalFactors: []
    };
  }

  private async getEconomicSituation(): Promise<EconomicSituation> {
    const result = await this.pool.query(`
      SELECT 
        SUM(gdp) as global_gdp,
        AVG(trade_volume) as trade_volume,
        AVG(market_stability) as market_stability,
        AVG(inflation) as inflation
      FROM economic_data
    `);
    
    const row = result.rows[0] || {};
    
    return {
      globalGDP: row.global_gdp || 0,
      tradeVolume: row.trade_volume || 0,
      marketStability: row.market_stability || 50,
      inflation: row.inflation || 0
    };
  }

  private async getPoliticalSituation(): Promise<PoliticalSituation> {
    return {
      stability: 50,
      activeWars: [],
      activeTreaties: [],
      diplomaticEvents: []
    };
  }

  private async getMilitarySituation(): Promise<MilitarySituation> {
    return {
      globalTension: 30,
      activeConflicts: [],
      militaryBuildups: []
    };
  }

  private async getTechnologicalSituation(): Promise<TechnologicalSituation> {
    return {
      globalTechLevel: 50,
      breakthroughs: [],
      researchCollaborations: []
    };
  }

  private async getSocialSituation(): Promise<SocialSituation> {
    return {
      globalCohesion: 60,
      culturalExchanges: [],
      socialMovements: []
    };
  }

  private async getActiveEvents(): Promise<GameEvent[]> {
    const result = await this.pool.query(`
      SELECT * FROM game_events 
      WHERE processed = false 
      ORDER BY priority DESC, timestamp ASC
    `);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      source: row.source,
      target: row.target,
      data: row.data,
      timestamp: row.timestamp,
      priority: row.priority,
      processed: row.processed
    }));
  }

  private async getActiveCrises(): Promise<CrisisEvent[]> {
    const result = await this.pool.query(`
      SELECT * FROM crisis_events 
      WHERE resolved = false 
      ORDER BY severity DESC, start_time ASC
    `);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      severity: row.severity,
      affectedCivilizations: row.affected_civilizations || [],
      startTime: row.start_time,
      estimatedDuration: row.estimated_duration || 0
    }));
  }

  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    // This would be populated by the performance monitoring system
    return {
      averageTickTime: 0,
      maxTickTime: 0,
      minTickTime: 0,
      systemExecutionTimes: new Map(),
      aptExecutionTimes: new Map(),
      memoryUsage: 0,
      cpuUsage: 0,
      systemSuccessRates: new Map(),
      aptSuccessRates: new Map(),
      cacheHitRates: new Map(),
      cacheSize: 0
    };
  }

  private determineGamePhase(currentTurn: number): 'early' | 'expansion' | 'mid_game' | 'late_game' | 'endgame' {
    if (currentTurn < 50) return 'early';
    if (currentTurn < 150) return 'expansion';
    if (currentTurn < 300) return 'mid_game';
    if (currentTurn < 500) return 'late_game';
    return 'endgame';
  }

  private async getCivilizationSystemStates(civilizationId: string): Promise<Map<string, any>> {
    const result = await this.pool.query(`
      SELECT system_id, state_data 
      FROM civilization_system_states 
      WHERE civilization_id = $1
    `, [civilizationId]);
    
    const systemStates = new Map<string, any>();
    for (const row of result.rows) {
      systemStates.set(row.system_id, row.state_data);
    }
    
    return systemStates;
  }

  private async getCivilizationKnobSettings(civilizationId: string): Promise<Map<string, number>> {
    const result = await this.pool.query(`
      SELECT knob_name, knob_value 
      FROM civilization_knob_settings 
      WHERE civilization_id = $1
    `, [civilizationId]);
    
    const knobSettings = new Map<string, number>();
    for (const row of result.rows) {
      knobSettings.set(row.knob_name, row.knob_value);
    }
    
    return knobSettings;
  }

  private async getCivilizationRecentEvents(civilizationId: string): Promise<GameEvent[]> {
    const result = await this.pool.query(`
      SELECT * FROM game_events 
      WHERE target = $1 OR source = $1
      ORDER BY timestamp DESC 
      LIMIT 50
    `, [civilizationId]);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      source: row.source,
      target: row.target,
      data: row.data,
      timestamp: row.timestamp,
      priority: row.priority,
      processed: row.processed
    }));
  }

  private async getCivilizationRecentDecisions(civilizationId: string): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT * FROM civilization_decisions 
      WHERE civilization_id = $1
      ORDER BY timestamp DESC 
      LIMIT 20
    `, [civilizationId]);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      description: row.description,
      timestamp: row.timestamp,
      outcome: row.outcome
    }));
  }

  private async persistStateUpdates(updates: Partial<GameStateSnapshot>): Promise<void> {
    // Persist critical state changes to database
    if (updates.currentTick !== undefined || updates.currentTurn !== undefined) {
      await this.pool.query(`
        INSERT INTO game_state (current_tick, current_turn, state_data, created_at)
        VALUES ($1, $2, $3, NOW())
      `, [
        updates.currentTick || this.currentState?.currentTick || 0,
        updates.currentTurn || this.currentState?.currentTurn || 0,
        JSON.stringify(updates)
      ]);
    }
  }

  // Update helper methods for civilization data
  private async updatePopulationData(civilizationId: string, data: any): Promise<void> {
    await this.pool.query(`
      UPDATE population_data 
      SET total_population = $2, demographics = $3, growth_rate = $4, updated_at = NOW()
      WHERE civilization_id = $1
    `, [civilizationId, data.totalPopulation, JSON.stringify(data.demographics), data.growthRate]);
  }

  private async updateEconomicData(civilizationId: string, data: any): Promise<void> {
    await this.pool.query(`
      UPDATE economic_data 
      SET gdp = $2, gdp_growth_rate = $3, unemployment = $4, inflation = $5, updated_at = NOW()
      WHERE civilization_id = $1
    `, [civilizationId, data.gdp, data.gdpGrowthRate, data.unemployment, data.inflation]);
  }

  private async updateMilitaryData(civilizationId: string, data: any): Promise<void> {
    await this.pool.query(`
      UPDATE military_data 
      SET total_forces = $2, readiness = $3, defense_budget = $4, updated_at = NOW()
      WHERE civilization_id = $1
    `, [civilizationId, data.totalForces, data.readiness, data.defenseBudget]);
  }

  private async updateTechnologyData(civilizationId: string, data: any): Promise<void> {
    await this.pool.query(`
      UPDATE technology_data 
      SET research_level = $2, active_projects = $3, updated_at = NOW()
      WHERE civilization_id = $1
    `, [civilizationId, data.researchLevel, JSON.stringify(data.activeProjects)]);
  }

  private async updateCultureData(civilizationId: string, data: any): Promise<void> {
    await this.pool.query(`
      UPDATE culture_data 
      SET cultural_index = $2, social_cohesion = $3, updated_at = NOW()
      WHERE civilization_id = $1
    `, [civilizationId, data.culturalIndex, data.socialCohesion]);
  }

  private async updateSystemStates(civilizationId: string, systemStates: Map<string, any>): Promise<void> {
    for (const [systemId, stateData] of systemStates) {
      await this.pool.query(`
        INSERT INTO civilization_system_states (civilization_id, system_id, state_data, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (civilization_id, system_id) 
        DO UPDATE SET state_data = $3, updated_at = NOW()
      `, [civilizationId, systemId, JSON.stringify(stateData)]);
    }
  }

  private async updateKnobSettings(civilizationId: string, knobSettings: Map<string, number>): Promise<void> {
    for (const [knobName, knobValue] of knobSettings) {
      await this.pool.query(`
        INSERT INTO civilization_knob_settings (civilization_id, knob_name, knob_value, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (civilization_id, knob_name) 
        DO UPDATE SET knob_value = $3, updated_at = NOW()
      `, [civilizationId, knobName, knobValue]);
    }
  }
}
