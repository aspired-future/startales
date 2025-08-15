import { Router } from 'express'
import { getKpiBasics, getLatestKpiSnapshot, listKpiSnapshots, writeKpiSnapshot, setPolicy, listPolicies, /* setTaxRate, listTaxRates */ } from '../storage/db.js'

export const analyticsRouter = Router()

// GET /api/analytics/empire?scope=campaign|region&id=1
analyticsRouter.get('/empire', async (req, res) => {
  try {
    const scope = (req.query.scope as string) === 'region' ? 'region' : 'campaign'
    const id = Number(req.query.id || 1)
    const latest = await getLatestKpiSnapshot(scope, id)
    // If no snapshot yet, synthesize from basic aggregates
    const basics = await getKpiBasics()
    const fallback = {
      economy: { gdpProxy: basics.stockpileTotal, tradeVolume: Math.round(basics.stockpileTotal * 0.1), budgetBalance: 0, inflationProxy: 0 },
      military: { fleetStrength: basics.unitCount, readiness: 0.8, losses7d: 0 },
      population: { population: 1000, morale: 0.7, stability: 0.8 },
      science: { velocity: basics.queueCount, breakthroughs: 0 },
      infrastructure: { uptime: 0.95, capacityUtil: 0.5 }
    }
    const data = latest?.metrics && Object.keys(latest.metrics || {}).length ? latest.metrics : fallback
    res.json({ scope, id, ts: latest?.ts, metrics: data })
  } catch (e) {
    // Safe default
    res.json({ scope: 'campaign', id: 1, ts: new Date().toISOString(), metrics: { economy: { gdpProxy: 0, tradeVolume: 0, budgetBalance: 0, inflationProxy: 0 }, military: { fleetStrength: 0, readiness: 0.8, losses7d: 0 }, population: { population: 0, morale: 0.7, stability: 0.8 }, science: { velocity: 0, breakthroughs: 0 }, infrastructure: { uptime: 0.95, capacityUtil: 0.5 } } })
  }
})

// GET /api/analytics/trends?scope=campaign|region&id=1&window=30
analyticsRouter.get('/trends', async (req, res) => {
  const scope = (req.query.scope as string) === 'region' ? 'region' : 'campaign'
  const id = Number(req.query.id || 1)
  const windowCount = Math.max(1, Math.min(200, Number(req.query.window || 30)))
  const rows = await listKpiSnapshots(scope, id, windowCount)
  res.json({ scope, id, window: windowCount, series: rows })
})

// POST /api/analytics/snapshot { scope, id, metrics }
analyticsRouter.post('/snapshot', async (req, res) => {
  try {
    const scope = (req.body?.scope === 'region') ? 'region' : 'campaign'
    const id = Number(req.body?.id || 1)
    const metrics = req.body?.metrics || {}
    await writeKpiSnapshot(scope, id, metrics)
    res.status(201).json({ ok: true })
  } catch (e: any) {
    res.status(500).json({ error: 'server_error', detail: String(e?.message || e) })
  }
})

// POST /api/economy/policies { type, value }
analyticsRouter.post('/policies', async (req, res) => {
  try {
    const { type, value } = req.body || {}
    if (!type) return res.status(400).json({ error: 'missing_type' })
    await setPolicy(String(type), value ?? {})
    // Best-effort list
    let list: any[] = []
    try { list = await listPolicies(10) } catch {}
    res.status(201).json({ ok: true, policies: list })
  } catch (e: any) {
    res.status(500).json({ error: 'server_error', detail: String(e?.message || e) })
  }
})

analyticsRouter.get('/policies', async (_req, res) => {
  try {
    res.json({ policies: await listPolicies(20) })
  } catch {
    res.json({ policies: [] })
  }
})

// POST /api/economy/taxes { taxType, rate }
analyticsRouter.post('/taxes', async (req, res) => {
  const { taxType, rate } = req.body || {}
  const r = Number(rate)
  if (!taxType || !Number.isFinite(r)) return res.status(400).json({ error: 'bad_input' })
  // No-op for legacy compatibility; acknowledge and return empty/current taxes list
  res.status(201).json({ ok: true, taxes: [] })
})

analyticsRouter.get('/taxes', async (_req, res) => {
  // Legacy-safe: return empty list if not available
  res.json({ taxes: [] })
})
