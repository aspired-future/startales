const { test, expect } = require('@playwright/test');

test('Political Parties Screen Design Upgrade', async ({ page }) => {
  // Navigate to the Political Parties screen
  await page.goto('http://localhost:5175');
  
  // Wait for the page to load
  await page.waitForSelector('.live-game-hud', { timeout: 10000 });
  
  // Click on the Political Parties button in the left panel
  await page.click('text=Political Parties');
  
  // Wait for the Political Parties screen to load
  await page.waitForSelector('.standard-screen-container', { timeout: 10000 });
  
  // Check for standardized design elements
  await expect(page.locator('.standard-screen-container')).toBeVisible();
  await expect(page.locator('.standard-dashboard')).toBeVisible();
  await expect(page.locator('.standard-panel')).toBeVisible();
  await expect(page.locator('.standard-metric')).toBeVisible();
  await expect(page.locator('.standard-metric-value')).toBeVisible();
  await expect(page.locator('.standard-action-buttons')).toBeVisible();
  await expect(page.locator('.standard-btn')).toBeVisible();
  await expect(page.locator('.standard-data-table')).toBeVisible();
  await expect(page.locator('.whoseapp-btn')).toBeVisible();
  await expect(page.locator('.popup-toggle-container')).toBeVisible();
  
  // Check for government theme
  await expect(page.locator('.government-theme')).toBeVisible();
  
  // Check for specific Political Parties content
  await expect(page.locator('text=Political Parties Overview')).toBeVisible();
  await expect(page.locator('text=Party Performance Summary')).toBeVisible();
  await expect(page.locator('text=Political Parties Details')).toBeVisible();
  
  // Test tab navigation
  const tabs = ['Overview', 'Leadership', 'Coalitions', 'Electoral', 'Campaigns', 'Policy', 'Witter'];
  
  for (const tab of tabs) {
    await page.click(`text=${tab}`);
    await page.waitForTimeout(500);
    
    // Take screenshot of each tab
    await page.screenshot({ 
      path: `tests/screenshots/political_parties_${tab.toLowerCase()}.png`,
      fullPage: true 
    });
    
    // Verify tab content is visible
    await expect(page.locator('.standard-panel')).toBeVisible();
  }
  
  // Test hover effects on buttons
  const buttons = page.locator('.standard-btn');
  const buttonCount = await buttons.count();
  
  for (let i = 0; i < Math.min(buttonCount, 3); i++) {
    await buttons.nth(i).hover();
    await page.waitForTimeout(200);
  }
  
  // Test WhoseApp button functionality
  await page.click('.whoseapp-btn');
  await page.waitForTimeout(500);
  
  // Test popup toggle
  await page.click('.popup-toggle-container input[type="checkbox"]');
  await page.waitForTimeout(500);
  
  // Take final screenshot
  await page.screenshot({ 
    path: 'tests/screenshots/political_parties_final.png',
    fullPage: true 
  });
  
  // Verify table structure
  const tableHeaders = page.locator('.standard-data-table th');
  await expect(tableHeaders).toHaveCount(8); // Party, Leader, Type, Support, Approval, Seats, Trend, Actions
  
  // Verify party items are displayed
  await expect(page.locator('.party-item')).toBeVisible();
  
  // Verify coalition items are displayed (on coalitions tab)
  await page.click('text=Coalitions');
  await page.waitForTimeout(500);
  await expect(page.locator('.coalition-item')).toBeVisible();
  
  console.log('✅ Political Parties screen design upgrade test completed successfully');
});

