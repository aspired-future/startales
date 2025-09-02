import { test, expect } from '@playwright/test';

test('Debug Household Economics Console Logs', async ({ page }) => {
  // Navigate to the UI
  await page.goto('http://localhost:5173/');
  
  // Wait for basic page load
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Open browser console to capture logs
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });
  
  // Click on Population accordion
  await page.locator('text=👥POPULATION▶').click();
  await page.waitForTimeout(1000);
  
  // Click on Households
  await page.locator('.nav-item:has-text("🏠 Households")').click();
  await page.waitForTimeout(3000);
  
  // Wait for the Household Economics screen to load
  await page.waitForSelector('text=Household Economics', { timeout: 10000 });
  
  // Check if we can see the console logs for Household Economics
  console.log('✅ Household Economics screen loaded, checking for console logs...');
  
  // Wait a bit more for any async operations
  await page.waitForTimeout(5000);
  
  // Check if the Overview tab has content
  const overviewContent = await page.locator('.standard-metric-grid').count();
  console.log(`📊 Overview content elements found: ${overviewContent}`);
  
  // Check if there are any error messages
  const errorElements = await page.locator('.error-message, .error-container').count();
  console.log(`❌ Error elements found: ${errorElements}`);
  
  // Check if there are loading elements
  const loadingElements = await page.locator('.loading-container, .loading-spinner').count();
  console.log(`⏳ Loading elements found: ${loadingElements}`);
  
  // Check for specific data elements
  const totalPopulationElements = await page.locator('text=150,000').count();
  console.log(`👥 Total population elements found: ${totalPopulationElements}`);
  
  const giniElements = await page.locator('text=42.0%').count();
  console.log(`📈 Gini coefficient elements found: ${giniElements}`);
  
  // Check if tables have data
  const tableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`📋 Table rows found: ${tableRows}`);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'tests/screenshots/household-economics-debug.png', fullPage: true });
  
  // Verify the screen is working
  expect(await page.locator('text=Household Economics').count()).toBeGreaterThan(0);
  console.log('✅ Household Economics screen verification completed');
});
