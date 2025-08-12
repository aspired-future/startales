import { test, expect } from '@playwright/test'

test('HUD demo saves and ticks', async ({ page, request }) => {
  const health = await request.get('http://127.0.0.1:4000/api/health')
  expect(health.ok()).toBeTruthy()

  await page.goto('http://127.0.0.1:4000/demo/hud')
  await page.getByText('Save').click()
  await page.getByText('Encounter Tick').click()
  await page.getByText('Preview Outcome').click()
  await page.screenshot({ path: 'hud-smoke.png', fullPage: true })
})


