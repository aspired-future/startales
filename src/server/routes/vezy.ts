import { Router } from 'express'
import { getGoals, setGoals, getScore, addEvent, initDb } from '../storage/db.js'

export type VezyCategory = 'story' | 'empire' | 'discovery' | 'social'

export interface VezyGoals { story: number; empire: number; discovery: number; social: number }
export interface VezyScore { story: number; empire: number; discovery: number; social: number }

// DB-backed goals/score

export const vezyRouter = Router()
let inited = false
async function ensureInit(){ if (!inited){ await initDb(); inited = true } }

vezyRouter.get('/goals', async (_req, res) => { await ensureInit(); res.json(await getGoals()) })

vezyRouter.post('/goals', async (req, res) => { await ensureInit(); res.json(await setGoals(req.body || {})) })

vezyRouter.get('/score', async (_req, res) => { await ensureInit(); res.json(await getScore()) })

vezyRouter.post('/event', async (req, res) => {
  await ensureInit()
  const { category, value } = req.body || {}
  const v = Number(value)
  if (!['story', 'empire', 'discovery', 'social'].includes(category)) {
    return res.status(400).json({ error: 'invalid_category' })
  }
  if (!Number.isFinite(v)) return res.status(400).json({ error: 'invalid_value' })
  const s = await addEvent(category, v)
  const g = await getGoals()
  res.json({ score: s, goals: g })
})

// no character-specific endpoints (captured in story points)


