import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/playwright',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  // Don't start a web server, use the existing one
  reporter: [['html'], ['list']]
});
