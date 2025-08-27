/**
 * DependencyValidator - Validates system dependencies to prevent infinite loops
 * 
 * This class is responsible for:
 * - Detecting circular dependencies between systems
 * - Validating dependency chains and depth limits
 * - Ensuring proper execution order
 * - Preventing cross-tier dependency issues
 */

import { EventEmitter } from 'events';
import {
  SystemDefinition,
  ValidationResult
} from './types';

interface DependencyNode {
  systemId: string;
  dependencies: string[];
  dependents: string[];
  tier: number;
  executionGroup: string;
  depth: number;
}

interface DependencyPath {
  path: string[];
  isCycle: boolean;
  depth: number;
}

export class DependencyValidator extends EventEmitter {
  private dependencyGraph: Map<string, DependencyNode> = new Map();
  private validationCache: Map<string, ValidationResult> = new Map();
  private cacheTimeout = 60000; // 1 minute cache

  constructor() {
    super();
  }

  /**
   * Build dependency graph from system definitions
   */
  buildDependencyGraph(systems: SystemDefinition[]): void {
    console.log(`🔍 Building dependency graph for ${systems.length} systems...`);
    
    // Clear existing graph
    this.dependencyGraph.clear();
    this.validationCache.clear();
    
    // Create nodes for all systems
    for (const system of systems) {
      const node: DependencyNode = {
        systemId: system.id,
        dependencies: [...system.dependsOn],
        dependents: [],
        tier: system.tier,
        executionGroup: system.executionGroup,
        depth: 0
      };
      
      this.dependencyGraph.set(system.id, node);
    }
    
    // Build dependent relationships and calculate depths
    for (const system of systems) {
      for (const dependencyId of system.dependsOn) {
        const dependencyNode = this.dependencyGraph.get(dependencyId);
        if (dependencyNode) {
          dependencyNode.dependents.push(system.id);
        }
      }
    }
    
    // Calculate dependency depths
    this.calculateDependencyDepths();
    
    console.log(`✅ Dependency graph built with ${this.dependencyGraph.size} nodes`);
    this.emit('graphBuilt', this.dependencyGraph.size);
  }

  /**
   * Validate all dependencies for circular references and other issues
   */
  validateDependencies(): ValidationResult {
    const cacheKey = 'full_validation';
    const cached = this.getCachedValidation(cacheKey);
    if (cached) return cached;
    
    console.log('🔍 Validating system dependencies...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 1. Check for circular dependencies
    const cycles = this.detectCircularDependencies();
    if (cycles.length > 0) {
      errors.push(`Circular dependencies detected:`);
      cycles.forEach(cycle => {
        errors.push(`  - ${cycle.path.join(' → ')}`);
      });
    }
    
    // 2. Check for missing dependencies
    const missingDeps = this.findMissingDependencies();
    if (missingDeps.length > 0) {
      errors.push(`Missing dependencies:`);
      missingDeps.forEach(missing => {
        errors.push(`  - System '${missing.systemId}' depends on non-existent '${missing.missingDep}'`);
      });
    }
    
    // 3. Check for cross-tier dependency issues
    const crossTierIssues = this.findCrossTierIssues();
    if (crossTierIssues.length > 0) {
      warnings.push(`Cross-tier dependency issues:`);
      crossTierIssues.forEach(issue => {
        warnings.push(`  - ${issue}`);
      });
    }
    
    // 4. Check for excessive dependency depth
    const depthIssues = this.findDepthIssues();
    if (depthIssues.length > 0) {
      warnings.push(`Excessive dependency depth:`);
      depthIssues.forEach(issue => {
        warnings.push(`  - ${issue}`);
      });
    }
    
    // 5. Check for isolated systems
    const isolatedSystems = this.findIsolatedSystems();
    if (isolatedSystems.length > 0) {
      warnings.push(`Isolated systems (no dependencies or dependents):`);
      isolatedSystems.forEach(systemId => {
        warnings.push(`  - ${systemId}`);
      });
    }
    
    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings
    };
    
    // Cache the result
    this.cacheValidation(cacheKey, result);
    
    if (result.valid) {
      console.log('✅ Dependency validation passed');
    } else {
      console.log(`❌ Dependency validation failed with ${errors.length} errors`);
    }
    
    this.emit('validationComplete', result);
    return result;
  }

  /**
   * Get safe execution order that respects all dependencies
   */
  getExecutionOrder(): string[] {
    console.log('📋 Calculating execution order...');
    
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];
    
    const visit = (systemId: string) => {
      if (visiting.has(systemId)) {
        throw new Error(`Circular dependency detected involving ${systemId}`);
      }
      
      if (visited.has(systemId)) {
        return;
      }
      
      const node = this.dependencyGraph.get(systemId);
      if (!node) {
        throw new Error(`System ${systemId} not found in dependency graph`);
      }
      
      visiting.add(systemId);
      
      // Visit all dependencies first
      for (const dependencyId of node.dependencies) {
        visit(dependencyId);
      }
      
      visiting.delete(systemId);
      visited.add(systemId);
      order.push(systemId);
    };
    
    // Visit all systems
    for (const systemId of this.dependencyGraph.keys()) {
      if (!visited.has(systemId)) {
        visit(systemId);
      }
    }
    
    console.log(`✅ Execution order calculated for ${order.length} systems`);
    return order;
  }

  /**
   * Get execution order grouped by tiers for parallel execution
   */
  getTieredExecutionOrder(): Map<number, string[][]> {
    const executionOrder = this.getExecutionOrder();
    const tieredOrder = new Map<number, string[][]>();
    
    // Group by tiers first
    const tierGroups = new Map<number, string[]>();
    for (const systemId of executionOrder) {
      const node = this.dependencyGraph.get(systemId);
      if (node) {
        if (!tierGroups.has(node.tier)) {
          tierGroups.set(node.tier, []);
        }
        tierGroups.get(node.tier)!.push(systemId);
      }
    }
    
    // Within each tier, create parallel execution groups
    for (const [tier, systems] of tierGroups) {
      const parallelGroups = this.createParallelGroups(systems);
      tieredOrder.set(tier, parallelGroups);
    }
    
    return tieredOrder;
  }

  /**
   * Validate a specific system's dependencies
   */
  validateSystem(systemId: string): ValidationResult {
    const cacheKey = `system_${systemId}`;
    const cached = this.getCachedValidation(cacheKey);
    if (cached) return cached;
    
    const node = this.dependencyGraph.get(systemId);
    if (!node) {
      const result: ValidationResult = {
        valid: false,
        errors: [`System ${systemId} not found in dependency graph`],
        warnings: []
      };
      this.cacheValidation(cacheKey, result);
      return result;
    }
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check if dependencies exist
    for (const depId of node.dependencies) {
      if (!this.dependencyGraph.has(depId)) {
        errors.push(`Dependency '${depId}' does not exist`);
      }
    }
    
    // Check for self-dependency
    if (node.dependencies.includes(systemId)) {
      errors.push(`System cannot depend on itself`);
    }
    
    // Check dependency depth
    if (node.depth > 10) {
      warnings.push(`Dependency depth (${node.depth}) is very high`);
    }
    
    // Check cross-tier dependencies
    for (const depId of node.dependencies) {
      const depNode = this.dependencyGraph.get(depId);
      if (depNode && depNode.tier > node.tier) {
        warnings.push(`Depends on higher tier system '${depId}' (tier ${depNode.tier})`);
      }
    }
    
    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings
    };
    
    this.cacheValidation(cacheKey, result);
    return result;
  }

  /**
   * Check if adding a dependency would create a cycle
   */
  wouldCreateCycle(fromSystemId: string, toSystemId: string): boolean {
    // Temporarily add the dependency and check for cycles
    const fromNode = this.dependencyGraph.get(fromSystemId);
    if (!fromNode) return false;
    
    const originalDeps = [...fromNode.dependencies];
    fromNode.dependencies.push(toSystemId);
    
    const cycles = this.detectCircularDependencies();
    const wouldCycle = cycles.some(cycle => 
      cycle.path.includes(fromSystemId) && cycle.path.includes(toSystemId)
    );
    
    // Restore original dependencies
    fromNode.dependencies = originalDeps;
    
    return wouldCycle;
  }

  /**
   * Get systems that can be executed in parallel (no dependencies between them)
   */
  getParallelizableSystems(systemIds: string[]): string[][] {
    return this.createParallelGroups(systemIds);
  }

  /**
   * Get dependency path between two systems
   */
  getDependencyPath(fromSystemId: string, toSystemId: string): string[] | null {
    const visited = new Set<string>();
    const path: string[] = [];
    
    const findPath = (currentId: string, targetId: string): boolean => {
      if (currentId === targetId) {
        path.push(currentId);
        return true;
      }
      
      if (visited.has(currentId)) {
        return false;
      }
      
      visited.add(currentId);
      path.push(currentId);
      
      const node = this.dependencyGraph.get(currentId);
      if (node) {
        for (const depId of node.dependencies) {
          if (findPath(depId, targetId)) {
            return true;
          }
        }
      }
      
      path.pop();
      return false;
    };
    
    return findPath(fromSystemId, toSystemId) ? path : null;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private detectCircularDependencies(): DependencyPath[] {
    const cycles: DependencyPath[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();
    
    const visit = (systemId: string, path: string[] = []) => {
      if (visiting.has(systemId)) {
        // Found a cycle
        const cycleStart = path.indexOf(systemId);
        const cyclePath = path.slice(cycleStart).concat([systemId]);
        cycles.push({
          path: cyclePath,
          isCycle: true,
          depth: cyclePath.length - 1
        });
        return;
      }
      
      if (visited.has(systemId)) {
        return;
      }
      
      visiting.add(systemId);
      path.push(systemId);
      
      const node = this.dependencyGraph.get(systemId);
      if (node) {
        for (const depId of node.dependencies) {
          visit(depId, [...path]);
        }
      }
      
      visiting.delete(systemId);
      visited.add(systemId);
      path.pop();
    };
    
    for (const systemId of this.dependencyGraph.keys()) {
      if (!visited.has(systemId)) {
        visit(systemId);
      }
    }
    
    return cycles;
  }

  private findMissingDependencies(): Array<{systemId: string, missingDep: string}> {
    const missing: Array<{systemId: string, missingDep: string}> = [];
    
    for (const [systemId, node] of this.dependencyGraph) {
      for (const depId of node.dependencies) {
        if (!this.dependencyGraph.has(depId)) {
          missing.push({ systemId, missingDep: depId });
        }
      }
    }
    
    return missing;
  }

  private findCrossTierIssues(): string[] {
    const issues: string[] = [];
    
    for (const [systemId, node] of this.dependencyGraph) {
      for (const depId of node.dependencies) {
        const depNode = this.dependencyGraph.get(depId);
        if (depNode && depNode.tier > node.tier) {
          issues.push(
            `System '${systemId}' (tier ${node.tier}) depends on '${depId}' (tier ${depNode.tier})`
          );
        }
      }
    }
    
    return issues;
  }

  private findDepthIssues(): string[] {
    const issues: string[] = [];
    
    for (const [systemId, node] of this.dependencyGraph) {
      if (node.depth > 5) {
        issues.push(`System '${systemId}' has dependency depth of ${node.depth}`);
      }
    }
    
    return issues;
  }

  private findIsolatedSystems(): string[] {
    const isolated: string[] = [];
    
    for (const [systemId, node] of this.dependencyGraph) {
      if (node.dependencies.length === 0 && node.dependents.length === 0) {
        isolated.push(systemId);
      }
    }
    
    return isolated;
  }

  private calculateDependencyDepths(): void {
    const visited = new Set<string>();
    
    const calculateDepth = (systemId: string): number => {
      if (visited.has(systemId)) {
        return 0; // Prevent infinite recursion
      }
      
      visited.add(systemId);
      
      const node = this.dependencyGraph.get(systemId);
      if (!node || node.dependencies.length === 0) {
        return 0;
      }
      
      let maxDepth = 0;
      for (const depId of node.dependencies) {
        const depDepth = calculateDepth(depId);
        maxDepth = Math.max(maxDepth, depDepth + 1);
      }
      
      node.depth = maxDepth;
      return maxDepth;
    };
    
    for (const systemId of this.dependencyGraph.keys()) {
      visited.clear();
      calculateDepth(systemId);
    }
  }

  private createParallelGroups(systemIds: string[]): string[][] {
    const groups: string[][] = [];
    const processed = new Set<string>();
    
    while (processed.size < systemIds.length) {
      const currentGroup: string[] = [];
      
      for (const systemId of systemIds) {
        if (processed.has(systemId)) continue;
        
        const node = this.dependencyGraph.get(systemId);
        if (!node) continue;
        
        // Check if all dependencies are already processed
        const dependenciesSatisfied = node.dependencies.every(dep => 
          processed.has(dep) || !systemIds.includes(dep)
        );
        
        // Check if this system conflicts with any in current group
        const conflictsWithGroup = currentGroup.some(groupSystemId => {
          const groupNode = this.dependencyGraph.get(groupSystemId);
          return groupNode && (
            groupNode.dependencies.includes(systemId) ||
            node.dependencies.includes(groupSystemId)
          );
        });
        
        if (dependenciesSatisfied && !conflictsWithGroup) {
          currentGroup.push(systemId);
          processed.add(systemId);
        }
      }
      
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      } else {
        // If no progress, add remaining systems individually to avoid infinite loop
        const remaining = systemIds.filter(id => !processed.has(id));
        if (remaining.length > 0) {
          groups.push([remaining[0]]);
          processed.add(remaining[0]);
        }
      }
    }
    
    return groups;
  }

  private getCachedValidation(key: string): ValidationResult | null {
    const cached = this.validationCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached;
    }
    return null;
  }

  private cacheValidation(key: string, result: ValidationResult): void {
    this.validationCache.set(key, {
      ...result,
      timestamp: Date.now()
    } as any);
  }
}
