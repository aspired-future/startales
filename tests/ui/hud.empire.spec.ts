import { test, expect, APIRequestContext } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:4000'

async function fetchJsonWithRetry(request: APIRequestContext, url: string, attempts = 8, delayMs = 500) {
  let lastErr: any
  for (let i = 0; i < attempts; i++) {
    try {
      const resp = await request.get(url)
      const txt = await resp.text()
      return JSON.parse(txt)
    } catch (e) {
      lastErr = e
      await new Promise(r => setTimeout(r, delayMs))
    }
  }
  throw lastErr || new Error('failed to parse json')
}

test('HUD: Empire planet create and production preview', async ({ page, request }) => {
  // Ensure at least one planet exists (seed + pre-tick before navigation)
  await request.post(`${BASE}/api/empire/seed?count=1`)
  const listResp = await fetchJsonWithRetry(request, `${BASE}/api/empire/planets`) as any
  const latestId = listResp.planets?.[0]?.id
  if (latestId) {
    await request.post(`${BASE}/api/empire/planets/${latestId}/tick`)
  }
  await page.goto(`${BASE}/demo/hud`)
  await page.waitForLoadState('domcontentloaded')
  // Debug helpers
  // eslint-disable-next-line no-console
  console.log('Navigated to:', page.url())
  await page.screenshot({ path: 'hud-empire.png', fullPage: true })
  await page.waitForFunction(() => !!document.getElementById('empireCreate'))
  await page.waitForFunction(() => (document.querySelector('#empireStocks')?.textContent || '').length > 0, undefined, { timeout: 15000 })
  const stocks = await page.locator('#empireStocks').textContent()
  expect(stocks && stocks.length > 0).toBeTruthy()

  // Queue progress bar updates after tick
  const add = page.locator('#queueAdd')
  await add.click()
  await page.waitForTimeout(200)
  const before = await page.locator('#queueProg').evaluate((el: any) => el.style.width)
  await page.locator('#queueTick').click()
  await page.waitForTimeout(200)
  const after = await page.locator('#queueProg').evaluate((el: any) => el.style.width)
  expect(before).not.toBe(after)
})


