import { Router } from 'express';
const state = { id: 'demo', clock: 0, lastTick: Date.now() };
export const encounterRouter = Router();
encounterRouter.post('/start', (_req, res) => {
    state.clock = 0;
    state.lastTick = Date.now();
    res.json({ ok: true, id: state.id });
});
encounterRouter.post('/tick', (_req, res) => {
    const now = Date.now();
    const deltaMs = now - state.lastTick;
    state.lastTick = now;
    const steps = Math.max(1, Math.floor(deltaMs / 100)); // 10 Hz
    state.clock = Math.min(100, state.clock + steps);
    res.json({ clock: state.clock, hz: 10 });
});
