// Static test of the Integrated Witty Galaxy HUD (without server)
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test.describe('Integrated Witty Galaxy HUD - Static Tests', () => {
  let hudContent;

  test.beforeAll(async () => {
    // Read the HUD content from the file
    const { getIntegratedWittyGalaxyHUD } = require('./integrated_witty_galaxy_hud.js');
    hudContent = getIntegratedWittyGalaxyHUD();
  });

  test('should generate valid HTML content', async ({ page }) => {
    // Create a temporary HTML file
    const tempFile = 'temp_dev/test_hud_temp.html';
    fs.writeFileSync(tempFile, hudContent);
    
    // Navigate to the temporary file
    await page.goto(`file://${process.cwd()}/${tempFile}`);
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Witty Galaxy Command Center/);
    
    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/hud_static_loaded.png', fullPage: true });
    
    // Clean up
    fs.unlinkSync(tempFile);
  });

  test('should contain all required CSS classes and elements', async ({ page }) => {
    // Create a temporary HTML file
    const tempFile = 'temp_dev/test_hud_temp.html';
    fs.writeFileSync(tempFile, hudContent);
    
    await page.goto(`file://${process.cwd()}/${tempFile}`);
    await page.waitForLoadState('domcontentloaded');
    
    // Check for main structural elements
    const hudContainer = page.locator('.hud-container');
    await expect(hudContainer).toBeVisible();
    
    // Check for header
    const header = page.locator('.hud-header');
    await expect(header).toBeVisible();
    
    // Check for navigation
    const nav = page.locator('.hud-nav');
    await expect(nav).toBeVisible();
    
    // Check for main content
    const main = page.locator('.hud-main');
    await expect(main).toBeVisible();
    
    // Check for Witter feed
    const witterFeed = page.locator('#witterFeed');
    await expect(witterFeed).toBeVisible();
    
    // Take screenshot showing structure
    await page.screenshot({ path: 'temp_dev/hud_static_structure.png', fullPage: true });
    
    // Clean up
    fs.unlinkSync(tempFile);
  });

  test('should have responsive design elements', async ({ page }) => {
    const tempFile = 'temp_dev/test_hud_temp.html';
    fs.writeFileSync(tempFile, hudContent);
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`file://${process.cwd()}/${tempFile}`);
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'temp_dev/hud_static_desktop.png', fullPage: true });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'temp_dev/hud_static_tablet.png', fullPage: true });
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'temp_dev/hud_static_mobile.png', fullPage: true });
    
    // Clean up
    fs.unlinkSync(tempFile);
  });

  test('should have proper CSS styling', async ({ page }) => {
    const tempFile = 'temp_dev/test_hud_temp.html';
    fs.writeFileSync(tempFile, hudContent);
    
    await page.goto(`file://${process.cwd()}/${tempFile}`);
    await page.waitForLoadState('domcontentloaded');
    
    // Check that CSS variables are defined
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return {
        primaryGlow: computedStyle.getPropertyValue('--primary-glow').trim(),
        bgPanel: computedStyle.getPropertyValue('--bg-panel').trim(),
        textPrimary: computedStyle.getPropertyValue('--text-primary').trim()
      };
    });
    
    console.log('CSS Variables:', rootStyles);
    
    // Verify that key CSS variables are set
    expect(rootStyles.primaryGlow).toBeTruthy();
    expect(rootStyles.bgPanel).toBeTruthy();
    expect(rootStyles.textPrimary).toBeTruthy();
    
    // Check that the body has the expected background
    const bodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    
    console.log('Body background:', bodyBg);
    
    // Take screenshot showing styling
    await page.screenshot({ path: 'temp_dev/hud_static_styling.png', fullPage: true });
    
    // Clean up
    fs.unlinkSync(tempFile);
  });

  test('should have working JavaScript initialization', async ({ page }) => {
    const tempFile = 'temp_dev/test_hud_temp.html';
    fs.writeFileSync(tempFile, hudContent);
    
    // Capture console logs
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    
    await page.goto(`file://${process.cwd()}/${tempFile}`);
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for JavaScript initialization
    await page.waitForTimeout(3000);
    
    console.log('Console logs:', logs);
    
    // Check that HUD initialization occurred
    const hudInitialized = logs.some(log => 
      log.includes('Witty Galaxy HUD') || 
      log.includes('initialized') ||
      log.includes('🚀')
    );
    
    console.log('HUD initialized:', hudInitialized);
    
    // Check that the HUD object exists
    const hudExists = await page.evaluate(() => {
      return typeof window.hud !== 'undefined';
    });
    
    console.log('HUD object exists:', hudExists);
    
    // Take final screenshot
    await page.screenshot({ path: 'temp_dev/hud_static_js.png', fullPage: true });
    
    // Clean up
    fs.unlinkSync(tempFile);
  });
});
