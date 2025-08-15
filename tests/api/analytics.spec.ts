import { describe, it, expect } from 'vitest'

const _rawBase = (process.env.BASE_URL && process.env.BASE_URL.trim()) ? process.env.BASE_URL.trim() : 'http://localhost:4010'
const BASE = /^https?:\/\//.test(_rawBase) ? _rawBase.replace(/\/+$/, '') : 'http://localhost:4010'

describe('Analytics API', () => {
	it('returns latest empire analytics with metrics', async () => {
		const res = await fetch(`${BASE}/api/analytics/empire?scope=campaign&id=1` as any)
		expect(res.ok).toBe(true)
		const json = await res.json()
		expect(json.metrics).toBeTruthy()
		expect(json.metrics.economy).toBeTruthy()
		expect(json.metrics.military).toBeTruthy()
	})

	it('accepts snapshot and shows in trends', async () => {
		const snap = { scope: 'campaign', id: 1, metrics: { economy: { gdpProxy: 123 }, military: { fleetStrength: 2 } } }
		const post = await fetch(`${BASE}/api/analytics/snapshot` as any, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snap) })
		expect(post.ok).toBe(true)
		const res = await fetch(`${BASE}/api/analytics/trends?scope=campaign&id=1&window=5` as any)
		expect(res.ok).toBe(true)
		const json = await res.json()
		expect(Array.isArray(json.series)).toBe(true)
	})

	it('sets and lists policies', async () => {
		const body = { type: 'subsidy', value: { sector: 'Mining', bonus: 0.1 } }
		const post = await fetch(`${BASE}/api/analytics/policies` as any, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
		expect(post.ok).toBe(true)
		const list = await fetch(`${BASE}/api/analytics/policies` as any)
		expect(list.ok).toBe(true)
	})

	it('sets and lists taxes', async () => {
		const post = await fetch(`${BASE}/api/analytics/taxes` as any, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taxType: 'trade', rate: 0.05 }) })
		expect(post.ok).toBe(true)
		const list = await fetch(`${BASE}/api/analytics/taxes` as any)
		expect(list.ok).toBe(true)
	})
})
