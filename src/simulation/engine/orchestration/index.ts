/**
 * StarTales Orchestration System - Main Export Module
 * 
 * This module exports all the core orchestration components for the StarTales
 * galactic civilization simulator. It provides a unified interface for:
 * - Game state management and aggregation
 * - API system registration and discovery
 * - Execution control with timeout and cancellation
 * - Circuit breaker fault tolerance
 * - Dependency validation and loop prevention
 */

// Core Types and Interfaces
export * from './types';

// Core Infrastructure Components
export { GameStateManager } from './GameStateManager';
export { APIRegistry } from './APIRegistry';
export { ExecutionController } from './ExecutionController';
export { CircuitBreaker, CircuitBreakerManager } from './CircuitBreaker';
export { DependencyValidator } from './DependencyValidator';

// APT System Components
export { APTEngine } from './APTEngine';
export { APTCache } from './APTCache';
export { APTScheduler } from './APTScheduler';
export { FallbackManager } from './FallbackManager';

// Master Orchestration
export { MasterOrchestrator } from './MasterOrchestrator';

// API Wrappers
export * from './apis';

// Event Bus
export { EventBus, createEventBusWithTables } from './EventBus';

// Performance Monitoring
export { PerformanceMonitor } from './PerformanceMonitor';

// Parallel Execution Engine
export { ParallelExecutionEngine, createParallelExecutionEngine } from './ParallelExecutionEngine';

// Governance Orchestration Wrapper
export { GovernanceOrchestrationWrapper } from './apis/GovernanceOrchestrationWrapper';

// Testing Suites
export { PerformanceBenchmarkSuite, createPerformanceBenchmarkSuite } from './tests/PerformanceBenchmarkSuite';
export { ChaosEngineeringTests, createChaosEngineeringTests } from './tests/ChaosEngineeringTests';

// Re-export key interfaces for external use
export type {
  IGameStateManager,
  IAPIRegistry,
  IExecutionController,
  IAPTEngine,
  IOrchestrator,
  GameStateSnapshot,
  CivilizationContext,
  APIExecutionContext,
  APIExecutionResult,
  SystemDefinition,
  APTTemplate,
  APTExecutionRequest,
  APTExecutionResult,
  OrchestrationConfig
} from './types';
