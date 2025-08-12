import { Router } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
const db = { schedules: [] };
const createScheduleSchema = z.object({
    campaignId: z.string().min(1),
    title: z.string().min(1),
    startsAt: z.string().datetime(),
    durationMin: z.number().int().positive(),
    rrule: z.string().optional(),
    timezone: z.string().optional(),
    remindersMin: z.array(z.number().int().positive()).optional()
});
export const schedulesRouter = Router();
schedulesRouter.get('/', (req, res) => {
    const { campaignId } = req.query;
    const list = campaignId ? db.schedules.filter(s => s.campaignId === campaignId) : db.schedules;
    res.json(list);
});
schedulesRouter.post('/', (req, res) => {
    const parsed = createScheduleSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error.flatten());
    const now = new Date().toISOString();
    const schedule = { id: nanoid(), createdAt: now, ...parsed.data };
    db.schedules.push(schedule);
    res.status(201).json(schedule);
});
schedulesRouter.put('/:id', (req, res) => {
    const idx = db.schedules.findIndex(s => s.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: 'Not found' });
    const merged = { ...db.schedules[idx], ...req.body };
    db.schedules[idx] = merged;
    res.json(merged);
});
schedulesRouter.delete('/:id', (req, res) => {
    const idx = db.schedules.findIndex(s => s.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: 'Not found' });
    const removed = db.schedules.splice(idx, 1)[0];
    res.json(removed);
});
