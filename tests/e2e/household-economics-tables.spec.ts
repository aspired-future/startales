import { test, expect } from '@playwright/test';

test('Household Economics Tables and Scrolling', async ({ page }) => {
  // Navigate to the UI
  await page.goto('http://localhost:5173/');
  
  // Wait for basic page load
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Click on Population accordion
  await page.locator('text=👥POPULATION▶').click();
  await page.waitForTimeout(1000);
  
  // Click on Households
  await page.locator('.nav-item:has-text("🏠 Households")').click();
  await page.waitForTimeout(3000);
  
  // Wait for the Household Economics screen to load
  await page.waitForSelector('text=Household Economics', { timeout: 10000 });
  
  console.log('✅ Household Economics screen loaded');
  
  // Check Overview tab content
  const overviewMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`📊 Overview metrics found: ${overviewMetrics}`);
  expect(overviewMetrics).toBeGreaterThan(0);
  
  // Check for specific data in Overview
  const totalPopulation = await page.locator('text=150,000').count();
  console.log(`👥 Total population elements: ${totalPopulation}`);
  expect(totalPopulation).toBeGreaterThan(0);
  
  // Click on Demand tab
  await page.locator('.base-screen-tab:has-text("Demand")').click();
  await page.waitForTimeout(2000);
  
  // Check Demand table
  const demandTableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`📋 Demand table rows: ${demandTableRows}`);
  expect(demandTableRows).toBeGreaterThan(0);
  
  // Check if table has horizontal scroll
  const tableContainer = page.locator('.standard-table-container');
  const hasHorizontalScroll = await tableContainer.evaluate(el => {
    return el.scrollWidth > el.clientWidth;
  });
  console.log(`📜 Table has horizontal scroll: ${hasHorizontalScroll}`);
  
  // Click on Mobility tab
  await page.locator('.base-screen-tab:has-text("Mobility")').click();
  await page.waitForTimeout(2000);
  
  // Check Mobility content
  const mobilityStats = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`🎓 Mobility stats found: ${mobilityStats}`);
  expect(mobilityStats).toBeGreaterThan(0);
  
  // Click on Wellbeing tab
  await page.locator('.base-screen-tab:has-text("Wellbeing")').click();
  await page.waitForTimeout(2000);
  
  // Check Wellbeing content
  const wellbeingMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`💖 Wellbeing metrics found: ${wellbeingMetrics}`);
  expect(wellbeingMetrics).toBeGreaterThan(0);
  
  // Click on Analytics tab
  await page.locator('.base-screen-tab:has-text("Analytics")').click();
  await page.waitForTimeout(2000);
  
  // Check Analytics table
  const analyticsTableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`📊 Analytics table rows: ${analyticsTableRows}`);
  expect(analyticsTableRows).toBeGreaterThan(0);
  
  // Test vertical scrolling by checking if we can scroll down
  const screenContent = page.locator('.screen-content');
  const initialScrollTop = await screenContent.evaluate(el => el.scrollTop);
  
  // Scroll down
  await screenContent.evaluate(el => el.scrollTop = 500);
  await page.waitForTimeout(1000);
  
  const finalScrollTop = await screenContent.evaluate(el => el.scrollTop);
  console.log(`📜 Vertical scroll test - Initial: ${initialScrollTop}, Final: ${finalScrollTop}`);
  expect(finalScrollTop).toBeGreaterThan(initialScrollTop);
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/household-economics-tables.png', fullPage: true });
  
  console.log('✅ All table and scrolling tests passed!');
});

