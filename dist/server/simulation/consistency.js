import { createHash } from 'node:crypto';
export function computeHashFromEvents(events) {
    const h = createHash('sha256');
    for (const e of events)
        h.update(JSON.stringify(e));
    return h.digest('hex');
}
export async function getStableStateHash(provider, handle, fallbackEvents) {
    if (provider.getStateHash)
        return provider.getStateHash(handle);
    if (fallbackEvents)
        return computeHashFromEvents(fallbackEvents);
    // If no state available, hash basic handle fields (last resort)
    return createHash('sha256').update(`${handle.provider}:${handle.campaignId}:${handle.sessionId}:${handle.seed}:${handle.currentStep}`).digest('hex');
}
