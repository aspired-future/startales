import { Router } from 'express'
import { listSystems, listPlanetsBySystem, upsertSystem, upsertPlanet, initDb } from '../storage/db.js'

export const mapRouter = Router()

let inited = false
async function ensureInit(){ if (!inited) { await initDb(); inited = true } }

mapRouter.get('/systems', async (_req, res) => {
  await ensureInit()
  const systems = await listSystems()
  res.json({ systems })
})

mapRouter.get('/systems/:id/planets', async (req, res) => {
  await ensureInit()
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad_system_id' })
  const planets = await listPlanetsBySystem(id)
  res.json({ planets })
})

// Initialize galaxy map for a campaign (deterministic by seed)
mapRouter.post('/campaigns/:id/map/init', async (req, res) => {
  await ensureInit()
  const { seed = Date.now(), systems = 1, planetsPerSystem = 1 } = req.body || {}
  // Simple LCG for deterministic pseudo-random
  let state = Number(seed) >>> 0
  const rand = () => (state = (1664525 * state + 1013904223) >>> 0) / 0xffffffff
  const biomes = ['Desert','Oceanic','Jungle','Temperate','Arctic','Volcanic','Barren','Swamp','Savanna']
  const resources = ['Alloys','Fuel','Rare Crystals','Food','Water','Biotech','Exotic Gas','Relic Sites']
  const created: { systemId: number; planetIds: number[] }[] = []
  for (let si = 0; si < Math.max(1, Math.min(50, Number(systems) || 1)); si++) {
    const sysName = `Sys-${Math.floor(rand()*900+100)}`
    const sx = +(rand()*1000 - 500).toFixed(2)
    const sy = +(rand()*1000 - 500).toFixed(2)
    const systemId = await upsertSystem({ name: sysName, sector: 'Alpha', x: sx, y: sy })
    const planetIds: number[] = []
    for (let pi = 0; pi < Math.max(1, Math.min(20, Number(planetsPerSystem) || 1)); pi++) {
      const name = `P-${Math.floor(rand()*900+100)}`
      const biome = biomes[Math.floor(rand()*biomes.length)]
      const gravity = +(0.6 + rand()*0.9).toFixed(2)
      const deps = Array.from({ length: 3 }, () => ({ resource: resources[Math.floor(rand()*resources.length)], richness: 2 + Math.floor(rand()*3) }))
      const pid = await upsertPlanet({ name, biome, gravity, deposits: deps, systemId })
      planetIds.push(pid)
    }
    created.push({ systemId, planetIds })
  }
  res.status(201).json({ created })
})


