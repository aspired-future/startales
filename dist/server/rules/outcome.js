/** Simple band calculator for Sprint 1 */
export function previewOutcome(input) {
    const baseMod = input.attribute + input.skill + (input.modifiers ?? 0);
    const pityBonus = Math.min(3, Math.floor((input.attempts ?? 0) / 3)); // +1 every 3 attempts up to +3
    const total = baseMod + pityBonus;
    // Map margin to bands. margin = total - dc
    const margin = total - input.dc;
    // Convert margin to distribution with soft steps
    // Start with a baseline: 25/25/40/10, then shift by margin*5% per step
    let bands = { fail: 0.25, complication: 0.25, success: 0.4, critical: 0.1 };
    const shift = Math.max(-4, Math.min(4, Math.round(margin))); // clamp
    const per = 0.05 * shift;
    // Success takes half the shift, critical a quarter, complication decreases with success, fail takes remaining
    bands.success = clamp01(bands.success + per * 0.5);
    bands.critical = clamp01(bands.critical + per * 0.25);
    bands.complication = clamp01(bands.complication - per * 0.4);
    // Re-normalize with fail as remainder
    bands.fail = clamp01(1 - (bands.success + bands.critical + bands.complication));
    // Momentum converts 5% of complication to success per point (cap 20%)
    const momentum = Math.max(0, Math.min(4, input.momentum ?? 0));
    const convert = Math.min(0.2, 0.05 * momentum, bands.complication);
    bands.complication = clamp01(bands.complication - convert);
    bands.success = clamp01(bands.success + convert);
    const expectedCost = bands.complication * 1 + bands.fail * 2; // arbitrary cost units
    const notes = [];
    if (pityBonus > 0)
        notes.push(`pity_bonus:+${pityBonus}`);
    if (momentum > 0)
        notes.push(`momentum_convert:${(convert * 100).toFixed(0)}%`);
    return {
        chance: bands,
        totalModifier: total,
        expectedCost,
        notes,
    };
}
function clamp01(n) {
    if (n < 0)
        return 0;
    if (n > 1)
        return 1;
    return Number(n.toFixed(6));
}
