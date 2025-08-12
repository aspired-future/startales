import { Router } from 'express';
import { GM_PERSONALITY_PRESETS } from '../narrative/personalities.js';
export const personalitiesRouter = Router();
personalitiesRouter.get('/', (_req, res) => {
    res.json({ presets: GM_PERSONALITY_PRESETS });
});
