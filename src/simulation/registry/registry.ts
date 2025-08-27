import { SimulationProvider, SimulationProviderName } from './types';

const providers = new Map<SimulationProviderName, SimulationProvider>();

export function registerSimulationProvider(provider: SimulationProvider) {
  providers.set(provider.name, provider);
}

export function getSimulationProvider(name: SimulationProviderName): SimulationProvider | undefined {
  return providers.get(name);
}

export function listSimulationProviders(): SimulationProviderName[] {
  return Array.from(providers.keys());
}


