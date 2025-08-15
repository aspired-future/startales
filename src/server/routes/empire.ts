import { Router } from 'express'
import { generatePlanetData } from './generator.js'
import { upsertPlanet, listPlanets, getPlanetDeposits, getStockpiles, applyProductionTick, listQueuesByPlanet, createQueueAuto, tickQueue, listUnitsByPlanet, enqueueInfantry, upsertSystem, countSystems, initDb } from '../storage/db.js'

export const empireRouter = Router()

let inited = false
async function ensureInit(){
  if (!inited) { await initDb(); inited = true }
}

empireRouter.get('/planets', async (_req, res) => {
  await ensureInit()
  const rows = await listPlanets()
  res.json({ planets: rows })
})

// Latest planet helper
empireRouter.get('/planets/latest', async (_req, res) => {
  await ensureInit()
  const rows = await listPlanets()
  const latest = rows?.[0]
  if (!latest) return res.json({ planet: null, stockpiles: [] })
  const stocks = await getStockpiles(latest.id)
  res.json({ planet: latest, stockpiles: stocks })
})

empireRouter.post('/planets', async (_req, res) => {
  await ensureInit()
  // simple: generate a new planet and persist with deposits
  const p = generatePlanetData()
  const deposits = (p.resources as string[]).map(r => ({ resource: r, richness: Math.floor(Math.random()*3)+2 }))
  let systemId: number | undefined
  if (await countSystems() === 0) {
    systemId = await upsertSystem({ name: 'Vezara Sector', sector: 'A', x: 0, y: 0 })
  }
  const id = await upsertPlanet({ name: p.name, biome: p.biome, gravity: p.gravity, deposits, systemId })
  res.status(201).json({ id })
})

// Seed helper: create N planets (for setup/tests)
empireRouter.post('/seed', async (req, res) => {
  await ensureInit()
  const raw = (req.query.count as string) || String(req.body?.count || '1')
  const n = Math.max(1, Math.min(20, Number(raw) || 1))
  const created: number[] = []
  for (let i=0;i<n;i++){
    const p = generatePlanetData()
    const deposits = (p.resources as string[]).map(r => ({ resource: r, richness: Math.floor(Math.random()*3)+2 }))
    const id = await upsertPlanet({ name: p.name, biome: p.biome, gravity: p.gravity, deposits })
    created.push(id)
  }
  res.status(201).json({ created })
})

empireRouter.get('/planets/:id/production', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_planet_id' })
  const deposits = await getPlanetDeposits(id)
  // naive production preview: richness × 10 per tick
  const production = deposits.map((d: any) => ({ resource: d.resource, perTick: d.richness * 10 }))
  res.json({ deposits, production })
})

empireRouter.get('/planets/:id/stockpiles', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_planet_id' })
  const stocks = await getStockpiles(id)
  res.json({ stockpiles: stocks })
})

empireRouter.post('/planets/:id/tick', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_planet_id' })
  const stocks = await applyProductionTick(id)
  res.json({ stockpiles: stocks })
})

empireRouter.get('/planets/:id/queues', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_planet_id' })
  res.json({ queues: await listQueuesByPlanet(id) })
})

empireRouter.post('/planets/:id/queues', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_planet_id' })
  try {
    const q = await createQueueAuto(id)
    res.status(201).json(q)
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'queue_error' })
  }
})

empireRouter.post('/queues/:queueId/tick', async (req, res) => {
  await ensureInit()
  const qid = Number(req.params.queueId)
  if (!Number.isFinite(qid)) return res.status(400).json({ error: 'bad_queue_id' })
  const q = await tickQueue(qid, 15)
  res.json(q)
})

empireRouter.get('/planets/:id/units', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_planet_id' })
  res.json({ units: await listUnitsByPlanet(id) })
})

empireRouter.post('/planets/:id/units/infantry', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_planet_id' })
  try {
    const q = await enqueueInfantry(id)
    res.status(201).json(q)
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'enqueue_error' })
  }
})


