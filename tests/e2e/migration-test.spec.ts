import { test, expect } from '@playwright/test';

test('Migration Screen Test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Navigate to Migration screen
  await page.locator('text=👥POPULATION▶').click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item:has-text("🚶 Migration")').click();
  await page.waitForTimeout(3000);
  
  // Check if screen loads
  await page.waitForSelector('text=Migration Management', { timeout: 10000 });
  console.log('✅ Migration screen loaded');
  
  // Check for tabs
  const overviewTab = await page.locator('.base-screen-tab:has-text("Overview")').count();
  console.log(`📊 Overview tab found: ${overviewTab}`);
  expect(overviewTab).toBeGreaterThan(0);
  
  const flowsTab = await page.locator('.base-screen-tab:has-text("Flows")').count();
  console.log(`🌊 Flows tab found: ${flowsTab}`);
  expect(flowsTab).toBeGreaterThan(0);
  
  const policiesTab = await page.locator('.base-screen-tab:has-text("Policies")').count();
  console.log(`📋 Policies tab found: ${policiesTab}`);
  expect(policiesTab).toBeGreaterThan(0);
  
  const integrationTab = await page.locator('.base-screen-tab:has-text("Integration")').count();
  console.log(`🤝 Integration tab found: ${integrationTab}`);
  expect(integrationTab).toBeGreaterThan(0);
  
  const analyticsTab = await page.locator('.base-screen-tab:has-text("Analytics")').count();
  console.log(`📈 Analytics tab found: ${analyticsTab}`);
  expect(analyticsTab).toBeGreaterThan(0);
  
  // Check for data on Overview tab
  const totalMigrants = await page.locator('text=2,850,000').count();
  console.log(`👥 Total migrants elements: ${totalMigrants}`);
  expect(totalMigrants).toBeGreaterThan(0);
  
  const annualInflow = await page.locator('text=185,000').count();
  console.log(`📈 Annual inflow elements: ${annualInflow}`);
  expect(annualInflow).toBeGreaterThan(0);
  
  // Test Flows tab
  await page.locator('.base-screen-tab:has-text("Flows")').click();
  await page.waitForTimeout(2000);
  
  const flowTableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`🌊 Flow table rows: ${flowTableRows}`);
  expect(flowTableRows).toBeGreaterThan(0);
  
  // Test Policies tab
  await page.locator('.base-screen-tab:has-text("Policies")').click();
  await page.waitForTimeout(2000);
  
  const policyTableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`📋 Policy table rows: ${policyTableRows}`);
  expect(policyTableRows).toBeGreaterThan(0);
  
  // Test Integration tab
  await page.locator('.base-screen-tab:has-text("Integration")').click();
  await page.waitForTimeout(2000);
  
  const integrationTableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`🤝 Integration table rows: ${integrationTableRows}`);
  expect(integrationTableRows).toBeGreaterThan(0);
  
  // Test Analytics tab
  await page.locator('.base-screen-tab:has-text("Analytics")').click();
  await page.waitForTimeout(2000);
  
  const analyticsMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`📈 Analytics metrics: ${analyticsMetrics}`);
  expect(analyticsMetrics).toBeGreaterThan(0);
  
  // Test scrolling
  const screenContent = page.locator('.screen-content');
  const initialScrollTop = await screenContent.evaluate(el => el.scrollTop);
  await screenContent.evaluate(el => el.scrollTop = 500);
  await page.waitForTimeout(1000);
  const finalScrollTop = await screenContent.evaluate(el => el.scrollTop);
  console.log(`📜 Vertical scroll test - Initial: ${initialScrollTop}, Final: ${finalScrollTop}`);
  expect(finalScrollTop).toBeGreaterThan(initialScrollTop);
  
  // Test table horizontal scrolling
  const tableContainer = page.locator('.standard-table-container');
  const hasHorizontalScroll = await tableContainer.evaluate(el => {
    return el.scrollWidth > el.clientWidth;
  });
  console.log(`📜 Table has horizontal scroll: ${hasHorizontalScroll}`);
  
  await page.screenshot({ path: 'tests/screenshots/migration-test.png', fullPage: true });
  console.log('✅ All Migration screen tests passed!');
});

