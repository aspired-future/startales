import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:4010'

test('HUD Analytics panel loads metrics and snapshots', async ({ page }) => {
  await page.goto(`${BASE}/demo/hud`)
  await page.waitForLoadState('domcontentloaded')
  // Ensure controls render
  await page.waitForSelector('#analyticsLoad')
  // Load analytics and expect some JSON to render
  await page.click('#analyticsLoad')
  await page.waitForFunction(() => (document.querySelector('#analyticsOut')?.textContent || '').length > 2)
  const text = await page.locator('#analyticsOut').textContent()
  expect(text && text.length > 2).toBeTruthy()
  // Snapshot and ensure it still renders
  await page.click('#analyticsSnap')
  await page.waitForTimeout(200)
  const text2 = await page.locator('#analyticsOut').textContent()
  expect(text2 && text2.length > 2).toBeTruthy()
})
