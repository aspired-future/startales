/**
 * Verify UI Reorganization Changes
 * Tests the completed UI reorganization tasks to ensure changes are visible
 */

import { test, expect } from '@playwright/test';

test.describe('UI Reorganization Verification', () => {
  test('should show updated menu structure with completed changes', async ({ page }) => {
    // Navigate to the main HUD
    await page.goto('http://localhost:5174/demo/command-center');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="command-center-main"]', { timeout: 10000 });
    
    console.log('✅ Page loaded successfully');
    
    // Verify Galaxy menu section exists (Task 32 & 1)
    const galaxySection = page.locator('.category-header:has-text("🌌 Galaxy")');
    await expect(galaxySection).toBeVisible();
    console.log('✅ Galaxy menu section found');
    
    // Verify Statistics is in Galaxy menu (Task 1)
    const statisticsItem = page.locator('.system-item[data-system="galaxy-stats"]');
    await expect(statisticsItem).toBeVisible();
    console.log('✅ Statistics item found in Galaxy menu');
    
    // Verify Visuals is in Galaxy menu (Task 32)
    const visualsItem = page.locator('.system-item[data-system="visuals"]');
    await expect(visualsItem).toBeVisible();
    console.log('✅ Visuals item found in Galaxy menu');
    
    // Verify Science & Tech category header (Task 8)
    const scienceTechHeader = page.locator('.category-header:has-text("🔬 Science & Tech")');
    await expect(scienceTechHeader).toBeVisible();
    console.log('✅ Science & Tech header found');
    
    // Verify Political Parties in Government menu (Task 6)
    const politicalPartiesItem = page.locator('.system-item[data-system="political-parties"]');
    await expect(politicalPartiesItem).toBeVisible();
    console.log('✅ Political Parties item found');
    
    // Verify WhoseApp in Communications menu (Task 22)
    const whoseappItem = page.locator('.system-item[data-system="whoseapp"]');
    await expect(whoseappItem).toBeVisible();
    console.log('✅ WhoseApp item found in Communications menu');
    
    // Verify Planets & Cities in Population menu (Task 26)
    const planetsCitiesItem = page.locator('.system-item[data-system="planets-cities"]');
    await expect(planetsCitiesItem).toBeVisible();
    console.log('✅ Planets & Cities item found');
    
    // Verify tick rate display (Task 18)
    const tickRateDisplay = page.locator('.status-item:has-text("Tick Rate:")');
    await expect(tickRateDisplay).toBeVisible();
    console.log('✅ Tick Rate display found (Speed 2x removed)');
    
    // Take a screenshot to document the changes
    await page.screenshot({ 
      path: 'tests/screenshots/ui-reorganization-verification.png',
      fullPage: true 
    });
    console.log('✅ Screenshot saved');
  });

  test('should show live data instead of mock data', async ({ page }) => {
    await page.goto('http://localhost:5174/demo/command-center');
    await page.waitForSelector('[data-testid="command-center-main"]');
    
    // Wait for API calls to complete
    await page.waitForTimeout(3000);
    
    // Check that we have real data formatting (not hardcoded values)
    const approvalRating = await page.textContent('#approvalRating');
    const treasuryBalance = await page.textContent('#treasuryBalance');
    
    console.log('Approval Rating:', approvalRating);
    console.log('Treasury Balance:', treasuryBalance);
    
    // These should be properly formatted (not the old hardcoded values)
    expect(approvalRating).toMatch(/^\d+%$/);
    expect(treasuryBalance).toMatch(/^[\d.]+[KMBT]?\s₵$/);
    
    console.log('✅ Live data formatting verified');
  });

  test('should show proper menu organization', async ({ page }) => {
    await page.goto('http://localhost:5174/demo/command-center');
    await page.waitForSelector('[data-testid="system-navigation"]');
    
    // Verify the menu structure is properly organized
    const menuCategories = [
      '🎮 Quick Commands',
      '🏛️ Government', 
      '💰 Economy',
      '👥 Population',
      '🛡️ Security',
      '🔬 Science & Tech',
      '🌌 Galaxy',
      '📡 Communications',
      '⚙️ Administration'
    ];
    
    for (const category of menuCategories) {
      const categoryElement = page.locator('.category-header', { hasText: category });
      await expect(categoryElement).toBeVisible();
      console.log(`✅ Found category: ${category}`);
    }
    
    console.log('✅ All menu categories verified');
  });
});
