/**
 * APIRegistry - Central registry for all game system APIs
 * 
 * This class is responsible for:
 * - Registering and discovering game system APIs
 * - Managing system definitions and metadata
 * - Providing system lookup and categorization
 * - Validating system configurations
 */

import { EventEmitter } from 'events';
import {
  SystemDefinition,
  IAPIRegistry,
  ValidationResult
} from './types';

export class APIRegistry extends EventEmitter implements IAPIRegistry {
  private systems: Map<string, SystemDefinition> = new Map();
  private systemsByTier: Map<number, SystemDefinition[]> = new Map();
  private systemsByGroup: Map<string, SystemDefinition[]> = new Map();
  private dependencyGraph: Map<string, string[]> = new Map();

  constructor() {
    super();
    this.initializeTierMaps();
    this.registerDefaultSystems();
  }

  /**
   * Register a new system in the registry
   */
  registerSystem(definition: SystemDefinition): void {
    try {
      console.log(`📝 Registering system: ${definition.id}`);
      
      // Validate system definition
      const validation = this.validateSystemDefinition(definition);
      if (!validation.valid) {
        throw new Error(`Invalid system definition: ${validation.errors.join(', ')}`);
      }

      // Check for duplicate registration
      if (this.systems.has(definition.id)) {
        console.warn(`⚠️ System ${definition.id} already registered, updating...`);
      }

      // Register the system
      this.systems.set(definition.id, definition);
      
      // Update tier mapping
      if (!this.systemsByTier.has(definition.tier)) {
        this.systemsByTier.set(definition.tier, []);
      }
      
      // Remove from old tier if updating
      for (const [tier, systems] of this.systemsByTier) {
        const index = systems.findIndex(s => s.id === definition.id);
        if (index !== -1) {
          systems.splice(index, 1);
        }
      }
      
      this.systemsByTier.get(definition.tier)!.push(definition);
      
      // Update group mapping
      if (!this.systemsByGroup.has(definition.executionGroup)) {
        this.systemsByGroup.set(definition.executionGroup, []);
      }
      
      // Remove from old group if updating
      for (const [group, systems] of this.systemsByGroup) {
        const index = systems.findIndex(s => s.id === definition.id);
        if (index !== -1) {
          systems.splice(index, 1);
        }
      }
      
      this.systemsByGroup.get(definition.executionGroup)!.push(definition);
      
      // Update dependency graph
      this.dependencyGraph.set(definition.id, definition.dependsOn);
      
      console.log(`✅ System ${definition.id} registered successfully`);
      
      // Emit registration event
      this.emit('systemRegistered', definition);
    } catch (error) {
      console.error(`❌ Failed to register system ${definition.id}:`, error);
      throw error;
    }
  }

  /**
   * Get a system definition by ID
   */
  getSystem(systemId: string): SystemDefinition | undefined {
    return this.systems.get(systemId);
  }

  /**
   * Get all registered systems
   */
  getAllSystems(): SystemDefinition[] {
    return Array.from(this.systems.values());
  }

  /**
   * Get systems by tier (1=Civilization, 2=Inter-Civ, 3=Galactic)
   */
  getSystemsByTier(tier: 1 | 2 | 3): SystemDefinition[] {
    return this.systemsByTier.get(tier) || [];
  }

  /**
   * Get systems by execution group
   */
  getSystemsByGroup(group: 'civilization' | 'inter-civ' | 'galactic'): SystemDefinition[] {
    return this.systemsByGroup.get(group) || [];
  }

  /**
   * Get systems by priority
   */
  getSystemsByPriority(priority: 'low' | 'medium' | 'high' | 'critical'): SystemDefinition[] {
    return Array.from(this.systems.values()).filter(system => system.priority === priority);
  }

  /**
   * Get systems by frequency
   */
  getSystemsByFrequency(frequency: 'every_tick' | 'periodic' | 'event_driven' | 'on_demand'): SystemDefinition[] {
    return Array.from(this.systems.values()).filter(system => system.frequency === frequency);
  }

  /**
   * Get system dependencies
   */
  getSystemDependencies(systemId: string): string[] {
    return this.dependencyGraph.get(systemId) || [];
  }

  /**
   * Get systems that depend on a given system
   */
  getSystemDependents(systemId: string): string[] {
    const dependents: string[] = [];
    
    for (const [system, dependencies] of this.dependencyGraph) {
      if (dependencies.includes(systemId)) {
        dependents.push(system);
      }
    }
    
    return dependents;
  }

  /**
   * Validate the entire registry for consistency
   */
  validateRegistry(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for circular dependencies
    const cycles = this.detectCircularDependencies();
    if (cycles.length > 0) {
      errors.push(`Circular dependencies detected: ${cycles.join(', ')}`);
    }

    // Check for missing dependencies
    for (const [systemId, dependencies] of this.dependencyGraph) {
      for (const dependency of dependencies) {
        if (!this.systems.has(dependency)) {
          errors.push(`System ${systemId} depends on non-existent system ${dependency}`);
        }
      }
    }

    // Check for cross-tier dependencies (potential issues)
    for (const system of this.systems.values()) {
      for (const dependencyId of system.dependsOn) {
        const dependency = this.systems.get(dependencyId);
        if (dependency && dependency.tier > system.tier) {
          warnings.push(
            `System ${system.id} (tier ${system.tier}) depends on ${dependencyId} (tier ${dependency.tier}). ` +
            'This may cause execution order issues.'
          );
        }
      }
    }

    // Check for systems with excessive dependencies
    for (const system of this.systems.values()) {
      if (system.dependsOn.length > system.maxDepth) {
        warnings.push(
          `System ${system.id} has ${system.dependsOn.length} dependencies, ` +
          `exceeding max depth of ${system.maxDepth}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get execution order for all systems
   */
  getExecutionOrder(): SystemDefinition[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: SystemDefinition[] = [];

    const visit = (systemId: string) => {
      if (visiting.has(systemId)) {
        throw new Error(`Circular dependency detected involving ${systemId}`);
      }
      
      if (visited.has(systemId)) {
        return;
      }

      visiting.add(systemId);
      
      const dependencies = this.dependencyGraph.get(systemId) || [];
      for (const dependency of dependencies) {
        visit(dependency);
      }
      
      visiting.delete(systemId);
      visited.add(systemId);
      
      const system = this.systems.get(systemId);
      if (system) {
        order.push(system);
      }
    };

    // Visit all systems
    for (const systemId of this.systems.keys()) {
      if (!visited.has(systemId)) {
        visit(systemId);
      }
    }

    return order;
  }

  /**
   * Get systems ready for execution (all dependencies satisfied)
   */
  getReadySystems(completedSystems: Set<string>): SystemDefinition[] {
    const ready: SystemDefinition[] = [];

    for (const system of this.systems.values()) {
      const dependenciesSatisfied = system.dependsOn.every(dep => completedSystems.has(dep));
      
      if (dependenciesSatisfied && !completedSystems.has(system.id)) {
        ready.push(system);
      }
    }

    // Sort by priority
    return ready.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Remove a system from the registry
   */
  unregisterSystem(systemId: string): boolean {
    if (!this.systems.has(systemId)) {
      return false;
    }

    // Check if other systems depend on this one
    const dependents = this.getSystemDependents(systemId);
    if (dependents.length > 0) {
      throw new Error(
        `Cannot unregister system ${systemId}: it is required by ${dependents.join(', ')}`
      );
    }

    // Remove from all mappings
    const system = this.systems.get(systemId)!;
    this.systems.delete(systemId);
    
    // Remove from tier mapping
    const tierSystems = this.systemsByTier.get(system.tier);
    if (tierSystems) {
      const index = tierSystems.findIndex(s => s.id === systemId);
      if (index !== -1) {
        tierSystems.splice(index, 1);
      }
    }
    
    // Remove from group mapping
    const groupSystems = this.systemsByGroup.get(system.executionGroup);
    if (groupSystems) {
      const index = groupSystems.findIndex(s => s.id === systemId);
      if (index !== -1) {
        groupSystems.splice(index, 1);
      }
    }
    
    // Remove from dependency graph
    this.dependencyGraph.delete(systemId);

    console.log(`✅ System ${systemId} unregistered successfully`);
    this.emit('systemUnregistered', systemId);
    
    return true;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private initializeTierMaps(): void {
    this.systemsByTier.set(1, []); // Civilization systems
    this.systemsByTier.set(2, []); // Inter-civilization systems
    this.systemsByTier.set(3, []); // Galactic systems
    
    this.systemsByGroup.set('civilization', []);
    this.systemsByGroup.set('inter-civ', []);
    this.systemsByGroup.set('galactic', []);
  }

  private validateSystemDefinition(definition: SystemDefinition): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!definition.id) errors.push('System ID is required');
    if (!definition.name) errors.push('System name is required');
    if (!definition.tier || ![1, 2, 3].includes(definition.tier)) {
      errors.push('System tier must be 1, 2, or 3');
    }
    if (!definition.executionGroup || !['civilization', 'inter-civ', 'galactic'].includes(definition.executionGroup)) {
      errors.push('Execution group must be civilization, inter-civ, or galactic');
    }
    if (!definition.priority || !['low', 'medium', 'high', 'critical'].includes(definition.priority)) {
      errors.push('Priority must be low, medium, high, or critical');
    }
    if (!definition.frequency || !['every_tick', 'periodic', 'event_driven', 'on_demand'].includes(definition.frequency)) {
      errors.push('Frequency must be every_tick, periodic, event_driven, or on_demand');
    }

    // Validation rules
    if (definition.timeoutMs && definition.timeoutMs < 1000) {
      warnings.push('Timeout less than 1 second may cause issues');
    }
    
    if (definition.estimatedExecutionTime && definition.estimatedExecutionTime > 10000) {
      warnings.push('Estimated execution time over 10 seconds may impact performance');
    }
    
    if (definition.dependsOn && definition.dependsOn.length > 10) {
      warnings.push('System has many dependencies, consider simplification');
    }

    // Tier consistency checks
    if (definition.tier === 1 && definition.executionGroup !== 'civilization') {
      errors.push('Tier 1 systems must have civilization execution group');
    }
    if (definition.tier === 2 && definition.executionGroup !== 'inter-civ') {
      errors.push('Tier 2 systems must have inter-civ execution group');
    }
    if (definition.tier === 3 && definition.executionGroup !== 'galactic') {
      errors.push('Tier 3 systems must have galactic execution group');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private detectCircularDependencies(): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const cycles: string[] = [];

    const visit = (systemId: string, path: string[] = []) => {
      if (visiting.has(systemId)) {
        const cycleStart = path.indexOf(systemId);
        const cycle = path.slice(cycleStart).concat([systemId]);
        cycles.push(cycle.join(' → '));
        return;
      }
      
      if (visited.has(systemId)) {
        return;
      }

      visiting.add(systemId);
      path.push(systemId);
      
      const dependencies = this.dependencyGraph.get(systemId) || [];
      for (const dependency of dependencies) {
        visit(dependency, [...path]);
      }
      
      visiting.delete(systemId);
      visited.add(systemId);
      path.pop();
    };

    for (const systemId of this.systems.keys()) {
      if (!visited.has(systemId)) {
        visit(systemId);
      }
    }

    return cycles;
  }

  private registerDefaultSystems(): void {
    // Register default civilization systems (Tier 1)
    const civilizationSystems: Partial<SystemDefinition>[] = [
      {
        id: 'population',
        name: 'Population Management',
        tier: 1,
        executionGroup: 'civilization',
        dependsOn: [],
        priority: 'high',
        frequency: 'every_tick',
        estimatedExecutionTime: 2000,
        aptCount: 3
      },
      {
        id: 'economics',
        name: 'Economic Systems',
        tier: 1,
        executionGroup: 'civilization',
        dependsOn: ['population'],
        priority: 'high',
        frequency: 'every_tick',
        estimatedExecutionTime: 3000,
        aptCount: 4
      },
      {
        id: 'military',
        name: 'Military Systems',
        tier: 1,
        executionGroup: 'civilization',
        dependsOn: ['population', 'economics'],
        priority: 'critical',
        frequency: 'every_tick',
        estimatedExecutionTime: 2000,
        aptCount: 2
      },
      {
        id: 'technology',
        name: 'Technology Research',
        tier: 1,
        executionGroup: 'civilization',
        dependsOn: ['economics'],
        priority: 'medium',
        frequency: 'every_tick',
        estimatedExecutionTime: 2000,
        aptCount: 3
      },
      {
        id: 'governance',
        name: 'Government Systems',
        tier: 1,
        executionGroup: 'civilization',
        dependsOn: ['population', 'economics'],
        priority: 'high',
        frequency: 'every_tick',
        estimatedExecutionTime: 2000,
        aptCount: 3
      },
      {
        id: 'culture',
        name: 'Cultural Development',
        tier: 1,
        executionGroup: 'civilization',
        dependsOn: ['population'],
        priority: 'medium',
        frequency: 'every_tick',
        estimatedExecutionTime: 1000,
        aptCount: 2
      }
    ];

    // Register inter-civilization systems (Tier 2)
    const interCivSystems: Partial<SystemDefinition>[] = [
      {
        id: 'diplomacy',
        name: 'Diplomatic Relations',
        tier: 2,
        executionGroup: 'inter-civ',
        dependsOn: ['governance', 'culture'],
        priority: 'high',
        frequency: 'every_tick',
        estimatedExecutionTime: 3000,
        aptCount: 4
      },
      {
        id: 'trade',
        name: 'Inter-Civilization Trade',
        tier: 2,
        executionGroup: 'inter-civ',
        dependsOn: ['economics', 'diplomacy'],
        priority: 'medium',
        frequency: 'every_tick',
        estimatedExecutionTime: 2000,
        aptCount: 3
      },
      {
        id: 'warfare',
        name: 'Military Conflicts',
        tier: 2,
        executionGroup: 'inter-civ',
        dependsOn: ['military', 'diplomacy'],
        priority: 'critical',
        frequency: 'event_driven',
        estimatedExecutionTime: 4000,
        aptCount: 5
      }
    ];

    // Register galactic systems (Tier 3)
    const galacticSystems: Partial<SystemDefinition>[] = [
      {
        id: 'galaxy',
        name: 'Galaxy Management',
        tier: 3,
        executionGroup: 'galactic',
        dependsOn: [],
        priority: 'medium',
        frequency: 'periodic',
        estimatedExecutionTime: 2000,
        aptCount: 2
      },
      {
        id: 'exploration',
        name: 'Galaxy Exploration',
        tier: 3,
        executionGroup: 'galactic',
        dependsOn: ['technology', 'military'],
        priority: 'medium',
        frequency: 'every_tick',
        estimatedExecutionTime: 3000,
        aptCount: 3
      },
      {
        id: 'gamemaster',
        name: 'Game Master AI',
        tier: 3,
        executionGroup: 'galactic',
        dependsOn: ['*'], // Depends on all other systems
        priority: 'low',
        frequency: 'periodic',
        estimatedExecutionTime: 3000,
        aptCount: 4
      }
    ];

    // Register all default systems
    const allSystems = [...civilizationSystems, ...interCivSystems, ...galacticSystems];
    
    for (const systemDef of allSystems) {
      const fullDefinition: SystemDefinition = {
        description: `Default ${systemDef.name} system`,
        executionMode: systemDef.tier === 1 ? 'parallel' : 'sequential',
        maxDepth: 5,
        timeoutMs: 30000,
        memoryUsage: 100 * 1024 * 1024, // 100MB
        interval: systemDef.frequency === 'periodic' ? 300000 : undefined, // 5 minutes
        apiEndpoint: `/api/${systemDef.id}`,
        requiredKnobs: [],
        optionalKnobs: [],
        ...systemDef
      } as SystemDefinition;

      this.registerSystem(fullDefinition);
    }

    console.log(`✅ Registered ${allSystems.length} default systems`);
  }
}
