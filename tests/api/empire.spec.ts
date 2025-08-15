import { describe, it, expect } from 'vitest'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { empireRouter } from '../../src/server/routes/empire'

describe('Empire API', () => {
  it('creates a planet and lists planets', async () => {
    const app = express()
    app.use(cors())
    app.use('/api/empire', empireRouter)
    const server = http.createServer(app)
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port

    const created = await fetch(`http://127.0.0.1:${port}/api/empire/planets`, { method: 'POST' })
    expect(created.ok).toBe(true)
    const { id } = await created.json()
    expect(id).toBeTypeOf('number')

    const list = await fetch(`http://127.0.0.1:${port}/api/empire/planets`)
    expect(list.ok).toBe(true)
    const json = await list.json()
    expect(Array.isArray(json.planets)).toBe(true)
    expect(json.planets.length).toBeGreaterThan(0)

    const prod = await fetch(`http://127.0.0.1:${port}/api/empire/planets/${id}/production`)
    expect(prod.ok).toBe(true)
    const pjson = await prod.json()
    expect(Array.isArray(pjson.deposits)).toBe(true)

    const tick = await fetch(`http://127.0.0.1:${port}/api/empire/planets/${id}/tick`, { method: 'POST' })
    expect(tick.ok).toBe(true)
    const stocks = await fetch(`http://127.0.0.1:${port}/api/empire/planets/${id}/stockpiles`)
    expect(stocks.ok).toBe(true)
    const sjson = await stocks.json()
    expect(Array.isArray(sjson.stockpiles)).toBe(true)

    const qAdd = await fetch(`http://127.0.0.1:${port}/api/empire/planets/${id}/queues`, { method: 'POST' })
    expect(qAdd.ok).toBe(true)
    const q = await qAdd.json()
    expect(q).toHaveProperty('id')
    const qTick = await fetch(`http://127.0.0.1:${port}/api/empire/queues/${q.id}/tick`, { method: 'POST' })
    expect(qTick.ok).toBe(true)

    const train = await fetch(`http://127.0.0.1:${port}/api/empire/planets/${id}/units/infantry`, { method: 'POST' })
    // may fail if resources insufficient; ensure endpoint responds expectedly
    expect([200,201,400]).toContain(train.status)
    const units = await fetch(`http://127.0.0.1:${port}/api/empire/planets/${id}/units`)
    expect(units.ok).toBe(true)

    server.close()
  })
})


