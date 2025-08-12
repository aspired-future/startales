import { test, expect } from '@playwright/test'

test('server health endpoint responds', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  expect(json.ok).toBe(true)
})


