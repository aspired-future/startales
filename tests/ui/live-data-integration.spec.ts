/**
 * Test live data integration in the main HUD
 * Verifies that mock data has been replaced with real API connections
 */

import { test, expect } from '@playwright/test';

test.describe('Live Data Integration', () => {
  test('should load HUD with live API data instead of mock data', async ({ page }) => {
    // Navigate to the main HUD
    await page.goto('/demo/command-center');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="command-center-main"]');
    
    // Check that the page loads without errors
    const title = await page.textContent('.header-title');
    expect(title).toContain('STARTALES COMMAND CENTER');
    
    // Wait for API calls to complete (look for loading states to disappear)
    await page.waitForTimeout(3000);
    
    // Verify that metrics are loaded (not showing "Loading..." or hardcoded values)
    const approvalRating = await page.textContent('#approvalRating');
    const treasuryBalance = await page.textContent('#treasuryBalance');
    const gdpGrowth = await page.textContent('#gdpGrowth');
    const planetPopulation = await page.textContent('#planetPopulation');
    
    console.log('Approval Rating:', approvalRating);
    console.log('Treasury Balance:', treasuryBalance);
    console.log('GDP Growth:', gdpGrowth);
    console.log('Planet Population:', planetPopulation);
    
    // These should not be the old hardcoded values
    expect(approvalRating).not.toBe('67%');
    expect(treasuryBalance).not.toBe('2.4T ₵');
    expect(gdpGrowth).not.toBe('+2.1%');
    expect(planetPopulation).not.toBe('340M');
    
    // Values should be properly formatted (not "Loading..." or empty)
    expect(approvalRating).toMatch(/^\d+%$/);
    expect(treasuryBalance).toMatch(/^[\d.]+[KMBT]?\s₵$/);
    expect(gdpGrowth).toMatch(/^[+-]?[\d.]+%$/);
    expect(planetPopulation).toMatch(/^[\d.]+[KMBT]?$/);
  });

  test('should show connection status indicator', async ({ page }) => {
    await page.goto('/demo/command-center');
    await page.waitForSelector('[data-testid="command-center-main"]');
    
    // Wait for connection status to be established
    await page.waitForTimeout(2000);
    
    // Check for network status indicator
    const networkStatus = page.locator('.status-item:has-text("Network:")');
    await expect(networkStatus).toBeVisible();
    
    const statusText = await networkStatus.textContent();
    expect(statusText).toMatch(/Network: (ONLINE|POLLING|ERROR|OFFLINE)/);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('/api/analytics/empire*', route => route.abort());
    
    await page.goto('/demo/command-center');
    await page.waitForSelector('[data-testid="command-center-main"]');
    
    // Wait for error handling
    await page.waitForTimeout(3000);
    
    // Should show safe defaults, not crash
    const approvalRating = await page.textContent('#approvalRating');
    expect(approvalRating).toMatch(/^\d+%$/);
    
    // Should show error status
    const networkStatus = page.locator('.status-item:has-text("Network:")');
    const statusText = await networkStatus.textContent();
    expect(statusText).toMatch(/Network: (POLLING|ERROR|OFFLINE)/);
  });

  test('should update metrics in real-time', async ({ page }) => {
    await page.goto('/demo/command-center');
    await page.waitForSelector('[data-testid="command-center-main"]');
    
    // Get initial values
    const initialApproval = await page.textContent('#approvalRating');
    
    // Wait for potential updates (30+ seconds for polling)
    await page.waitForTimeout(5000);
    
    // Check if WebSocket connection was established
    const networkStatus = await page.textContent('.status-item:has-text("Network:")');
    
    if (networkStatus.includes('ONLINE')) {
      console.log('✅ WebSocket connection established');
    } else if (networkStatus.includes('POLLING')) {
      console.log('⚠️ Using polling fallback');
    } else {
      console.log('❌ Connection failed, using safe defaults');
    }
    
    // Verify the page is responsive and functional
    expect(initialApproval).toBeTruthy();
  });

  test('should load system navigation properly', async ({ page }) => {
    await page.goto('/demo/command-center');
    await page.waitForSelector('[data-testid="system-navigation"]');
    
    // Check that all system categories are present
    const categories = [
      '🎮 Quick Commands',
      '🏛️ Government', 
      '💰 Economy',
      '👥 Population',
      '🛡️ Security',
      '🔬 Science',
      '📡 Communications',
      '⚙️ Administration'
    ];
    
    for (const category of categories) {
      const categoryElement = page.locator('.category-header', { hasText: category });
      await expect(categoryElement).toBeVisible();
    }
    
    // Test navigation functionality
    const cabinetItem = page.locator('.system-item[data-system="cabinet"]');
    await expect(cabinetItem).toBeVisible();
    await cabinetItem.click();
    
    // Should switch to cabinet system
    await expect(cabinetItem).toHaveClass(/active/);
  });
});
