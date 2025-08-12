import { Router } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
const db = { campaigns: [] };
const createCampaignSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    styleProfile: z.string().optional()
});
export const campaignsRouter = Router();
campaignsRouter.get('/', (req, res) => {
    const includeArchived = req.query.includeArchived === 'true';
    const list = includeArchived ? db.campaigns : db.campaigns.filter(c => !c.archived);
    res.json(list);
});
campaignsRouter.post('/', (req, res) => {
    const parsed = createCampaignSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error.flatten());
    const now = new Date().toISOString();
    const campaign = { id: nanoid(), createdAt: now, archived: false, ...parsed.data };
    db.campaigns.push(campaign);
    res.status(201).json(campaign);
});
campaignsRouter.post('/:id/clone', (req, res) => {
    const base = db.campaigns.find(c => c.id === req.params.id);
    if (!base)
        return res.status(404).json({ error: 'Not found' });
    const clone = { ...base, id: nanoid(), title: `${base.title} (Clone)`, createdAt: new Date().toISOString(), archived: false };
    db.campaigns.push(clone);
    res.status(201).json(clone);
});
campaignsRouter.post('/:id/archive', (req, res) => {
    const c = db.campaigns.find(c => c.id === req.params.id);
    if (!c)
        return res.status(404).json({ error: 'Not found' });
    c.archived = true;
    res.json(c);
});
