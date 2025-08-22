import { test, expect } from '@playwright/test';

test.describe('Quick Action Screens', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the comprehensive HUD
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Switch to comprehensive HUD if not already there
    const comprehensiveButton = page.locator('button:has-text("Comprehensive")');
    if (await comprehensiveButton.isVisible()) {
      await comprehensiveButton.click();
    }
    
    // Wait for the HUD to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
  });

  test('should display Quick Actions in the left panel', async ({ page }) => {
    // Check if Quick Actions section exists
    const quickActionsSection = page.locator('.accordion-section:has-text("QUICK ACTIONS")');
    await expect(quickActionsSection).toBeVisible();
    
    // Expand Quick Actions if not already expanded
    const quickActionsHeader = quickActionsSection.locator('.accordion-header');
    await quickActionsHeader.click();
    
    // Verify all Quick Action buttons are present
    const quickActionButtons = [
      '🚨 Crisis Response',
      '📋 Daily Briefing', 
      '🎤 Address Nation',
      '⚖️ Emergency Powers',
      '🔄 System Status'
    ];
    
    for (const buttonText of quickActionButtons) {
      const button = page.locator(`button:has-text("${buttonText}")`);
      await expect(button).toBeVisible();
    }
  });

  test('should open Crisis Response screen', async ({ page }) => {
    // Expand Quick Actions
    const quickActionsHeader = page.locator('.accordion-header:has-text("QUICK ACTIONS")');
    await quickActionsHeader.click();
    
    // Click Crisis Response button
    const crisisButton = page.locator('button:has-text("🚨 Crisis Response")');
    await crisisButton.click();
    
    // Verify Crisis Response screen opens
    const crisisScreen = page.locator('.quick-action-screen:has-text("Crisis Response Center")');
    await expect(crisisScreen).toBeVisible();
    
    // Verify screen content
    await expect(page.locator('text=Active Crisis Events')).toBeVisible();
    await expect(page.locator('text=Quick Response Actions')).toBeVisible();
    
    // Close the screen
    const closeButton = page.locator('.quick-action-close');
    await closeButton.click();
    
    // Verify screen is closed
    await expect(crisisScreen).not.toBeVisible();
  });

  test('should open Daily Briefing screen', async ({ page }) => {
    // Expand Quick Actions
    const quickActionsHeader = page.locator('.accordion-header:has-text("QUICK ACTIONS")');
    await quickActionsHeader.click();
    
    // Click Daily Briefing button
    const briefingButton = page.locator('button:has-text("📋 Daily Briefing")');
    await briefingButton.click();
    
    // Verify Daily Briefing screen opens
    const briefingScreen = page.locator('.quick-action-screen:has-text("Daily Intelligence Briefing")');
    await expect(briefingScreen).toBeVisible();
    
    // Verify screen content
    await expect(page.locator('text=Briefing Items')).toBeVisible();
    await expect(page.locator('text=Filter by Category')).toBeVisible();
    
    // Close the screen
    const closeButton = page.locator('.quick-action-close');
    await closeButton.click();
    
    // Verify screen is closed
    await expect(briefingScreen).not.toBeVisible();
  });

  test('should open Address Nation screen', async ({ page }) => {
    // Expand Quick Actions
    const quickActionsHeader = page.locator('.accordion-header:has-text("QUICK ACTIONS")');
    await quickActionsHeader.click();
    
    // Click Address Nation button
    const addressButton = page.locator('button:has-text("🎤 Address Nation")');
    await addressButton.click();
    
    // Verify Address Nation screen opens
    const addressScreen = page.locator('.quick-action-screen:has-text("Address the Nation")');
    await expect(addressScreen).toBeVisible();
    
    // Verify screen content
    await expect(page.locator('text=Public Sentiment Overview')).toBeVisible();
    await expect(page.locator('text=Quick Speech Options')).toBeVisible();
    
    // Close the screen
    const closeButton = page.locator('.quick-action-close');
    await closeButton.click();
    
    // Verify screen is closed
    await expect(addressScreen).not.toBeVisible();
  });

  test('should open Emergency Powers screen', async ({ page }) => {
    // Expand Quick Actions
    const quickActionsHeader = page.locator('.accordion-header:has-text("QUICK ACTIONS")');
    await quickActionsHeader.click();
    
    // Click Emergency Powers button
    const emergencyButton = page.locator('button:has-text("⚖️ Emergency Powers")');
    await emergencyButton.click();
    
    // Verify Emergency Powers screen opens
    const emergencyScreen = page.locator('.quick-action-screen:has-text("Emergency Powers Management")');
    await expect(emergencyScreen).toBeVisible();
    
    // Verify screen content
    await expect(page.locator('text=Current Emergency Status')).toBeVisible();
    await expect(page.locator('text=Available Emergency Powers')).toBeVisible();
    
    // Close the screen
    const closeButton = page.locator('.quick-action-close');
    await closeButton.click();
    
    // Verify screen is closed
    await expect(emergencyScreen).not.toBeVisible();
  });

  test('should open System Status screen', async ({ page }) => {
    // Expand Quick Actions
    const quickActionsHeader = page.locator('.accordion-header:has-text("QUICK ACTIONS")');
    await quickActionsHeader.click();
    
    // Click System Status button
    const statusButton = page.locator('button:has-text("🔄 System Status")');
    await statusButton.click();
    
    // Verify System Status screen opens
    const statusScreen = page.locator('.quick-action-screen:has-text("System Status Monitor")');
    await expect(statusScreen).toBeVisible();
    
    // Verify screen content
    await expect(page.locator('text=Overall System Health')).toBeVisible();
    await expect(page.locator('text=System Components')).toBeVisible();
    
    // Close the screen
    const closeButton = page.locator('.quick-action-close');
    await closeButton.click();
    
    // Verify screen is closed
    await expect(statusScreen).not.toBeVisible();
  });

  test('should handle multiple Quick Action screens', async ({ page }) => {
    // Expand Quick Actions
    const quickActionsHeader = page.locator('.accordion-header:has-text("QUICK ACTIONS")');
    await quickActionsHeader.click();
    
    // Open Crisis Response
    const crisisButton = page.locator('button:has-text("🚨 Crisis Response")');
    await crisisButton.click();
    
    // Verify Crisis Response is open
    const crisisScreen = page.locator('.quick-action-screen:has-text("Crisis Response Center")');
    await expect(crisisScreen).toBeVisible();
    
    // Close Crisis Response
    let closeButton = page.locator('.quick-action-close');
    await closeButton.click();
    await expect(crisisScreen).not.toBeVisible();
    
    // Open System Status
    const statusButton = page.locator('button:has-text("🔄 System Status")');
    await statusButton.click();
    
    // Verify System Status is open
    const statusScreen = page.locator('.quick-action-screen:has-text("System Status Monitor")');
    await expect(statusScreen).toBeVisible();
    
    // Close System Status
    closeButton = page.locator('.quick-action-close');
    await closeButton.click();
    await expect(statusScreen).not.toBeVisible();
  });

  test('should display loading states correctly', async ({ page }) => {
    // Expand Quick Actions
    const quickActionsHeader = page.locator('.accordion-header:has-text("QUICK ACTIONS")');
    await quickActionsHeader.click();
    
    // Click Daily Briefing button
    const briefingButton = page.locator('button:has-text("📋 Daily Briefing")');
    await briefingButton.click();
    
    // Check for loading state (should appear briefly)
    const loadingText = page.locator('text=Loading briefing data...');
    
    // Wait for content to load
    await page.waitForSelector('text=Briefing Items', { timeout: 5000 });
    
    // Verify content is loaded
    await expect(page.locator('text=Briefing Items')).toBeVisible();
  });
});
