import { describe, it, expect } from 'vitest'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { mapRouter } from '../../src/server/routes/map'
import { tradeRouter } from '../../src/server/routes/trade'

describe('Trade prices API', () => {
  it('returns prices for a system', async () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/map', mapRouter)
    app.use('/api/trade', tradeRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port

    // init at least one system via map init
    const init = await fetch(`http://127.0.0.1:${port}/api/map/campaigns/1/map/init`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seed: 1, systems: 1, planetsPerSystem: 1 }) })
    expect(init.ok).toBe(true)
    const systemsRes = await fetch(`http://127.0.0.1:${port}/api/map/systems`).then(r=>r.json())
    const sysId = systemsRes.systems?.[0]?.id
    expect(sysId).toBeTypeOf('number')

    const prices = await fetch(`http://127.0.0.1:${port}/api/trade/prices?system=${sysId}`)
    expect(prices.ok).toBe(true)
    const json = await prices.json()
    expect(Array.isArray(json.prices)).toBe(true)
    // Prices should be >= 1 and numeric
    for (const p of json.prices) expect(p.price).toBeGreaterThanOrEqual(1)
    server.close()
  })
})


