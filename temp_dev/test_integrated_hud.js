// Playwright test for the Integrated Witty Galaxy HUD
const { test, expect } = require('@playwright/test');

test.describe('Integrated Witty Galaxy HUD', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for desktop testing
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should load the integrated HUD successfully', async ({ page }) => {
    // Navigate to the integrated HUD
    await page.goto('http://localhost:4000/demo/witty-galaxy-hud');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Witty Galaxy Command Center/);
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'temp_dev/hud_loaded.png', fullPage: true });
  });

  test('should display main HUD components', async ({ page }) => {
    await page.goto('http://localhost:4000/demo/witty-galaxy-hud');
    await page.waitForLoadState('networkidle');
    
    // Check for main header
    const header = page.locator('.hud-header');
    await expect(header).toBeVisible();
    
    // Check for main navigation
    const nav = page.locator('.hud-nav');
    await expect(nav).toBeVisible();
    
    // Check for main content area
    const mainContent = page.locator('.hud-main');
    await expect(mainContent).toBeVisible();
    
    // Check for Witter feed section
    const witterFeed = page.locator('#witterFeed');
    await expect(witterFeed).toBeVisible();
    
    // Take screenshot of main components
    await page.screenshot({ path: 'temp_dev/hud_components.png', fullPage: true });
  });

  test('should have working navigation buttons', async ({ page }) => {
    await page.goto('http://localhost:4000/demo/witty-galaxy-hud');
    await page.waitForLoadState('networkidle');
    
    // Test Galaxy Map button
    const galaxyMapBtn = page.locator('button:has-text("Galaxy Map")');
    if (await galaxyMapBtn.isVisible()) {
      await galaxyMapBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'temp_dev/galaxy_map_clicked.png' });
    }
    
    // Test Witter Network button
    const witterBtn = page.locator('button:has-text("Witter Network")');
    if (await witterBtn.isVisible()) {
      // This opens in new tab, so we just verify it's clickable
      await expect(witterBtn).toBeEnabled();
    }
  });

  test('should display system metrics', async ({ page }) => {
    await page.goto('http://localhost:4000/demo/witty-galaxy-hud');
    await page.waitForLoadState('networkidle');
    
    // Wait for metrics to load
    await page.waitForTimeout(2000);
    
    // Check for population metric
    const populationMetric = page.locator('#populationCount');
    if (await populationMetric.isVisible()) {
      const populationText = await populationMetric.textContent();
      console.log('Population:', populationText);
    }
    
    // Check for economic metric
    const economicMetric = page.locator('#economicStatus');
    if (await economicMetric.isVisible()) {
      const economicText = await economicMetric.textContent();
      console.log('Economic Status:', economicText);
    }
    
    // Take screenshot of metrics
    await page.screenshot({ path: 'temp_dev/system_metrics.png' });
  });

  test('should handle real-time updates', async ({ page }) => {
    await page.goto('http://localhost:4000/demo/witty-galaxy-hud');
    await page.waitForLoadState('networkidle');
    
    // Wait for WebSocket connection
    await page.waitForTimeout(3000);
    
    // Check console for WebSocket connection messages
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('WebSocket') || msg.text().includes('Real-time')) {
        logs.push(msg.text());
      }
    });
    
    // Wait for potential real-time updates
    await page.waitForTimeout(5000);
    
    console.log('WebSocket logs:', logs);
    
    // Take final screenshot
    await page.screenshot({ path: 'temp_dev/realtime_updates.png', fullPage: true });
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:4000/demo/witty-galaxy-hud');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'temp_dev/hud_desktop.png', fullPage: true });
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'temp_dev/hud_tablet.png', fullPage: true });
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'temp_dev/hud_mobile.png', fullPage: true });
  });

  test('should load visual systems integration', async ({ page }) => {
    await page.goto('http://localhost:4000/demo/witty-galaxy-hud');
    await page.waitForLoadState('networkidle');
    
    // Wait for visual systems to initialize
    await page.waitForTimeout(5000);
    
    // Check console for visual systems messages
    const visualLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('Visual systems') || msg.text().includes('🎨')) {
        visualLogs.push(msg.text());
      }
    });
    
    // Wait for visual content to load
    await page.waitForTimeout(3000);
    
    console.log('Visual systems logs:', visualLogs);
    
    // Check for avatar images in Witter feed
    const avatars = page.locator('.witter-avatar img');
    const avatarCount = await avatars.count();
    console.log('Avatar images found:', avatarCount);
    
    // Take screenshot showing visual integration
    await page.screenshot({ path: 'temp_dev/visual_integration.png', fullPage: true });
  });
});
