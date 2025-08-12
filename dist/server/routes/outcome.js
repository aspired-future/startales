import { Router } from 'express';
import { previewOutcome } from '../rules/outcome.js';
import { previewTTC } from '../rules/ttc.js';
export const outcomeRouter = Router();
outcomeRouter.post('/preview', (req, res) => {
    const { dc, attribute, skill, modifiers = 0, momentum = 0, attempts = 0 } = req.body || {};
    if ([dc, attribute, skill].some(v => typeof v !== 'number')) {
        return res.status(400).json({ error: 'dc_attribute_skill_required' });
    }
    const result = previewOutcome({ dc, attribute, skill, modifiers, momentum, attempts });
    res.json(result);
});
// TTC preview
outcomeRouter.post('/ttc', (req, res) => {
    const { baseTimeSec, difficultyFactor, skillRank, expertiseRank = 0, toolQuality = 0, situational = 1 } = req.body || {};
    if (typeof baseTimeSec !== 'number' || typeof difficultyFactor !== 'number' || typeof skillRank !== 'number') {
        return res.status(400).json({ error: 'baseTimeSec_difficultyFactor_skillRank_required' });
    }
    const out = previewTTC({ baseTimeSec, difficultyFactor, skillRank, expertiseRank, toolQuality, situational });
    res.json(out);
});
// Classic d20 outcome quick preview (parity check)
outcomeRouter.post('/classic', (req, res) => {
    const { dc, attribute, skill, modifiers = 0 } = req.body || {};
    if ([dc, attribute, skill].some(v => typeof v !== 'number')) {
        return res.status(400).json({ error: 'dc_attribute_skill_required' });
    }
    const totalMod = attribute + skill + modifiers;
    // success chance ~ P(d20 + totalMod >= dc)
    let success = 0;
    for (let roll = 1; roll <= 20; roll++) {
        if (roll + totalMod >= dc)
            success++;
    }
    const p = success / 20;
    res.json({ successChance: p, totalModifier: totalMod });
});
