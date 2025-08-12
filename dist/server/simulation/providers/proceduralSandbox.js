import { randomUUID } from 'node:crypto';
function seededRng(seed) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seed.length; i++)
        h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
    return () => (h = Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9 >>> 0) / 4294967296;
}
export class ProceduralSandboxProvider {
    constructor() {
        this.name = 'procedural-sandbox';
        this.capabilities = {
            deterministicSeeds: true,
            supportsFrames: false,
            maxRecommendedStepsPerSecond: 120,
        };
    }
    async start(options) {
        return {
            campaignId: options.campaignId,
            sessionId: options.sessionId,
            provider: this.name,
            seed: options.seed,
            currentStep: 0,
        };
    }
    async step(input) {
        const rng = seededRng(input.handle.seed + ':' + input.handle.currentStep.toString());
        const steps = Math.max(0, Math.min(input.maxSteps, 1000));
        const events = Array.from({ length: Math.ceil(steps / 10) }, () => ({
            type: 'proc.event',
            value: Math.floor(rng() * 1000),
            step: input.handle.currentStep,
        }));
        const handle = { ...input.handle, currentStep: input.handle.currentStep + steps };
        return { handle, stepsApplied: steps, events };
    }
    async stop(_handle) {
        return;
    }
    async exportSnapshot(handle) {
        const snapshotId = randomUUID();
        // In a real implementation, write snapshot state to disk/db and return path
        const storagePath = `data/sim/${handle.campaignId}/${handle.sessionId}/${snapshotId}.json`;
        return { handle, snapshotId, storagePath };
    }
    async importSnapshot(_snapshotPath, into) {
        // Load snapshot and create a new handle
        return {
            campaignId: into.campaignId,
            sessionId: into.sessionId,
            provider: this.name,
            seed: into.seed,
            currentStep: 0,
        };
    }
}
