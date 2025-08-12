const providers = new Map();
export function registerSimulationProvider(provider) {
    providers.set(provider.name, provider);
}
export function getSimulationProvider(name) {
    return providers.get(name);
}
export function listSimulationProviders() {
    return Array.from(providers.keys());
}
