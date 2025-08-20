import { test, expect } from '@playwright/test';

test.describe('Galactic Civilization Demo', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo
    await page.goto('http://localhost:5173');
  });

  test('should load the main landing page', async ({ page }) => {
    // Check for the main title
    await expect(page.locator('h1')).toContainText('StarTales - Galactic Civilization Simulator');
    
    // Check for the launch demo button
    await expect(page.locator('button:has-text("Launch Game Demo")')).toBeVisible();
    
    // Check for feature cards
    await expect(page.locator('text=Deep Civilizations')).toBeVisible();
    await expect(page.locator('text=Alien Races')).toBeVisible();
    await expect(page.locator('text=Complex Characters')).toBeVisible();
    await expect(page.locator('text=Galactic Exploration')).toBeVisible();
  });

  test('should launch the game HUD', async ({ page }) => {
    // Click the launch demo button
    await page.click('button:has-text("Launch Game Demo")');
    
    // Wait for the game HUD to load
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Check for the main HUD bar
    await expect(page.locator('.hud-bar')).toBeVisible();
    await expect(page.locator('h1:has-text("StarTales")')).toBeVisible();
    
    // Check for player status
    await expect(page.locator('text=Commander_Alpha')).toBeVisible();
    await expect(page.locator('text=Sol System - Earth Orbit')).toBeVisible();
    
    // Check for HUD control buttons
    await expect(page.locator('button:has-text("Witter Feed")')).toBeVisible();
    await expect(page.locator('button:has-text("Exploration")')).toBeVisible();
    await expect(page.locator('button:has-text("Civilizations")')).toBeVisible();
    await expect(page.locator('button:has-text("Galactic Map")')).toBeVisible();
  });

  test('should open and display Witter Feed panel', async ({ page }) => {
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // The Witter Feed should be visible by default
    await expect(page.locator('.hud-panel:has-text("Witter Feed")')).toBeVisible();
    
    // Check for Witter content
    await expect(page.locator('.witter-feed')).toBeVisible();
    
    // Wait for content to load (give it time for the personality to initialize)
    await page.waitForTimeout(3000);
    
    // Check if there are any witts or loading states
    const hasWitts = await page.locator('.witt-item').count() > 0;
    const hasLoading = await page.locator('text=Initializing').isVisible();
    
    expect(hasWitts || hasLoading).toBeTruthy();
  });

  test('should open Civilization Browser', async ({ page }) => {
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Click the Civilizations button
    await page.click('button:has-text("Civilizations")');
    
    // Check for the civilization browser panel
    await expect(page.locator('.hud-panel:has-text("Civilizations")')).toBeVisible();
    await expect(page.locator('.civilization-browser')).toBeVisible();
    
    // Check for the search controls
    await expect(page.locator('input[placeholder*="Search civilizations"]')).toBeVisible();
    
    // Check for tabs
    await expect(page.locator('button:has-text("Overview")')).toBeVisible();
    await expect(page.locator('button:has-text("Civilizations")')).toBeVisible();
    await expect(page.locator('button:has-text("Races")')).toBeVisible();
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check for galaxy stats or loading
    const hasStats = await page.locator('.galaxy-stats').isVisible();
    const hasLoading = await page.locator('text=Initializing').isVisible();
    
    expect(hasStats || hasLoading).toBeTruthy();
  });

  test('should open Exploration Dashboard', async ({ page }) => {
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Click the Exploration button
    await page.click('button:has-text("Exploration")');
    
    // Check for the exploration dashboard panel
    await expect(page.locator('.hud-panel:has-text("Exploration")')).toBeVisible();
    await expect(page.locator('.exploration-dashboard')).toBeVisible();
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check for exploration content or loading
    const hasExploration = await page.locator('.exploration-content').isVisible();
    const hasLoading = await page.locator('text=Initializing').isVisible();
    
    expect(hasExploration || hasLoading).toBeTruthy();
  });

  test('should open Galactic Map', async ({ page }) => {
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Click the Galactic Map button
    await page.click('button:has-text("Galactic Map")');
    
    // Check for the galactic map panel
    await expect(page.locator('.hud-panel:has-text("Galactic Map")')).toBeVisible();
    await expect(page.locator('.galactic-map')).toBeVisible();
    
    // Check for map controls
    await expect(page.locator('button:has-text("🔍+")')).toBeVisible();
    await expect(page.locator('button:has-text("🔍-")')).toBeVisible();
    await expect(page.locator('button:has-text("🎯 Center")')).toBeVisible();
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check for star systems or loading
    const hasSystems = await page.locator('.star-system').count() > 0;
    const hasLoading = await page.locator('text=Initializing').isVisible();
    
    expect(hasSystems || hasLoading).toBeTruthy();
  });

  test('should display game status bar', async ({ page }) => {
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Check for the status bar
    await expect(page.locator('.game-status-bar')).toBeVisible();
    
    // Check for status items
    await expect(page.locator('text=Exploration Level')).toBeVisible();
    await expect(page.locator('text=Discoveries')).toBeVisible();
    await expect(page.locator('text=Known Races')).toBeVisible();
    await expect(page.locator('text=Systems Online')).toBeVisible();
  });

  test('should handle panel interactions', async ({ page }) => {
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Open Civilizations panel
    await page.click('button:has-text("Civilizations")');
    await expect(page.locator('.hud-panel:has-text("Civilizations")')).toBeVisible();
    
    // Try to minimize the panel
    const minimizeBtn = page.locator('.hud-panel:has-text("Civilizations") .hud-panel-control:has-text("🔽")');
    if (await minimizeBtn.isVisible()) {
      await minimizeBtn.click();
      await expect(page.locator('.hud-panel:has-text("Civilizations").minimized')).toBeVisible();
    }
    
    // Close the panel
    const closeBtn = page.locator('.hud-panel:has-text("Civilizations") .hud-panel-control:has-text("✕")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(page.locator('.hud-panel:has-text("Civilizations")')).not.toBeVisible();
    }
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Wait for initialization
    await page.waitForTimeout(5000);
    
    // Check that there are no critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Failed to resolve import') && // Expected during development
      !error.includes('WebSocket') && // Expected if WebSocket server isn't running
      !error.includes('fetch') // Expected if API server isn't running
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the demo
    await page.goto('http://localhost:5173');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('StarTales');
    
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Check that the HUD adapts to mobile
    await expect(page.locator('.hud-bar')).toBeVisible();
    await expect(page.locator('.game-status-bar')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the demo
    await page.goto('http://localhost:5173');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('StarTales');
    
    // Launch the game
    await page.click('button:has-text("Launch Game Demo")');
    await expect(page.locator('.game-hud')).toBeVisible();
    
    // Open a panel and check it works
    await page.click('button:has-text("Civilizations")');
    await expect(page.locator('.civilization-browser')).toBeVisible();
  });
});
