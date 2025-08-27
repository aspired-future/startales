/**
 * StarTales API Wrappers - Orchestration Integration
 * 
 * This module exports all the API wrapper classes that integrate existing
 * server systems with the orchestration framework.
 */

// Base API class and utilities
export { BaseAPI, APIConfig, createAPIConfig, createKnobDefinition } from '../BaseAPI';

// Specific API implementations
export { PopulationAPI } from './PopulationAPI';
export { EconomicsAPI } from './EconomicsAPI';
export { MilitaryAPI } from './MilitaryAPI';
export { GovernanceAPI } from './GovernanceAPI';
export { TechnologyAPI } from './TechnologyAPI';
export { CulturalAPI } from './CulturalAPI';
export { InterCivilizationAPI } from './InterCivilizationAPI';
export { GalacticAPI } from './GalacticAPI';
export { SpecializedSystemsAPI } from './SpecializedSystemsAPI';

// Re-export types for convenience
export type {
  KnobDefinition,
  APIHealthStatus
} from '../BaseAPI';
