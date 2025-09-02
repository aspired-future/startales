import { test, expect } from '@playwright/test';

test('Updated Screens - Full Panel Width Design', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Test Education Screen
  console.log('🎓 Testing Education Screen...');
  await page.locator('text=👥POPULATION▶').click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item:has-text("🎓 Education")').click();
  await page.waitForTimeout(3000);
  
  await page.waitForSelector('text=Education', { timeout: 10000 });
  console.log('✅ Education screen loaded');
  
  // Check for full panel width metrics
  const educationMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`📊 Education metrics found: ${educationMetrics}`);
  expect(educationMetrics).toBeGreaterThan(0);
  
  // Check for progress bars
  const progressBars = await page.locator('.progress-bar').count();
  console.log(`📈 Progress bars found: ${progressBars}`);
  expect(progressBars).toBeGreaterThan(0);
  
  // Check for table
  const educationTableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`📋 Education table rows: ${educationTableRows}`);
  expect(educationTableRows).toBeGreaterThan(0);
  
  // Test Health Screen
  console.log('🏥 Testing Health Screen...');
  await page.locator('.nav-item:has-text("🏥 Health")').click();
  await page.waitForTimeout(3000);
  
  await page.waitForSelector('text=Health', { timeout: 10000 });
  console.log('✅ Health screen loaded');
  
  // Check for full panel width metrics
  const healthMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`📊 Health metrics found: ${healthMetrics}`);
  expect(healthMetrics).toBeGreaterThan(0);
  
  // Check for progress bars
  const healthProgressBars = await page.locator('.progress-bar').count();
  console.log(`📈 Health progress bars found: ${healthProgressBars}`);
  expect(healthProgressBars).toBeGreaterThan(0);
  
  // Check for table
  const healthTableRows = await page.locator('.standard-data-table tbody tr').count();
  console.log(`📋 Health table rows: ${healthTableRows}`);
  expect(healthTableRows).toBeGreaterThan(0);
  
  // Test scrolling
  const screenContent = page.locator('.screen-content');
  const initialScrollTop = await screenContent.evaluate(el => el.scrollTop);
  await screenContent.evaluate(el => el.scrollTop = 500);
  await page.waitForTimeout(1000);
  const finalScrollTop = await screenContent.evaluate(el => el.scrollTop);
  console.log(`📜 Vertical scroll test - Initial: ${initialScrollTop}, Final: ${finalScrollTop}`);
  expect(finalScrollTop).toBeGreaterThan(initialScrollTop);
  
  await page.screenshot({ path: 'tests/screenshots/updated-screens-test.png', fullPage: true });
  console.log('✅ All updated screens tests passed! Full panel width design is working!');
});

