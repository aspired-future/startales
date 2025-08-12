const registry = new Map();
export function registerProvider(provider) {
    registry.set(provider.name, provider);
}
export function getProvider(name) {
    const p = registry.get(name);
    if (!p)
        throw new Error(`LLM provider not registered: ${name}`);
    return p;
}
export function listProviders() {
    return Array.from(registry.keys());
}
const sttRegistry = new Map();
const ttsRegistry = new Map();
export function registerSTTProvider(provider) {
    sttRegistry.set(provider.name, provider);
}
export function getSTTProvider(name) {
    const p = sttRegistry.get(name);
    if (!p)
        throw new Error(`STT provider not registered: ${name}`);
    return p;
}
export function listSTTProviders() {
    return Array.from(sttRegistry.keys());
}
export function registerTTSProvider(provider) {
    ttsRegistry.set(provider.name, provider);
}
export function getTTSProvider(name) {
    const p = ttsRegistry.get(name);
    if (!p)
        throw new Error(`TTS provider not registered: ${name}`);
    return p;
}
export function listTTSProviders() {
    return Array.from(ttsRegistry.keys());
}
