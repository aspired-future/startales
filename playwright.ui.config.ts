import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/ui',
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  // Don't start a webserver - we'll run it manually
  // webServer: {
  //   command: 'npm run ui',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: true,
  // }
});
