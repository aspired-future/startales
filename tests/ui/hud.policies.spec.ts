import { test, expect, APIRequestContext } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:4010'

async function getJson(request: APIRequestContext, url: string) {
  const r = await request.get(url)
  const t = await r.text()
  try { return JSON.parse(t) } catch { throw new Error('bad json from '+url+': '+t) }
}

test('HUD: Policies activate and Step Engine updates analytics', async ({ page, request }) => {
  // Ensure DB/server endpoints respond
  const health = await getJson(request, `${BASE}/api/health`)
  expect(health && health.ok).toBeTruthy()

  // Seed at least one planet and a tick to stabilize HUD
  await request.post(`${BASE}/api/empire/seed?count=1`)
  const latest = await getJson(request, `${BASE}/api/empire/planets/latest`).catch(() => ({ planet: null }))
  if (latest && latest.planet && latest.planet.id) {
    await request.post(`${BASE}/api/empire/planets/${latest.planet.id}/tick`)
  }

  // Navigate HUD
  await page.goto(`${BASE}/demo/hud`)
  await page.waitForLoadState('domcontentloaded')

  // Load analytics baseline
  await page.click('#analyticsLoad')
  await page.waitForFunction(() => (document.querySelector('#analyticsOut')?.textContent || '').length > 2)
  const beforeText = await page.locator('#analyticsOut').textContent()
  const before = beforeText ? JSON.parse(beforeText) : { metrics: {} }
  const beforeGDP = Number(before?.metrics?.economy?.gdpProxy || 0)

  // Create a simple policy and activate small multipliers
  await page.fill('#polTitle', 'Safety Policy')
  await page.fill('#polBody', 'Improve safety standards across facilities.')
  await page.click('#polCreate')
  await page.waitForTimeout(200)
  await page.click('#polActivate')
  await page.waitForFunction(() => (document.querySelector('#polOut')?.textContent || '').includes('activeModifiers') || (document.querySelector('#polOut')?.textContent || '').includes('activated'))

  // Step engine (production tick + optional queue tick)
  await page.click('#stepEngine')
  await page.waitForTimeout(500)

  // Reload analytics and assert non-decreasing GDP proxy (ideally increased)
  await page.click('#analyticsLoad')
  await page.waitForFunction(() => (document.querySelector('#analyticsOut')?.textContent || '').length > 2)
  const afterText = await page.locator('#analyticsOut').textContent()
  const after = afterText ? JSON.parse(afterText) : { metrics: {} }
  const afterGDP = Number(after?.metrics?.economy?.gdpProxy || 0)
  expect(afterGDP).toBeGreaterThanOrEqual(beforeGDP)
})
