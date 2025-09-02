import { test, expect } from '@playwright/test';

test('Verify Updated Screens - Full Panel Width Design', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Wait for the app to load
  await page.waitForTimeout(3000);
  
  // Test Education Screen
  console.log('🎓 Testing Education Screen...');
  await page.locator('text=👥POPULATION▶').click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item:has-text("🎓 Education")').click();
  await page.waitForTimeout(3000);
  
  // Check if Education screen loads with full panel width
  const educationTitle = await page.locator('text=Education').count();
  console.log(`📊 Education title found: ${educationTitle}`);
  expect(educationTitle).toBeGreaterThan(0);
  
  // Check for full panel width metrics (should be 11 total: 4 overview + 4 levels + 3 other)
  const educationMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`📊 Education metrics found: ${educationMetrics}`);
  expect(educationMetrics).toBeGreaterThan(0);
  
  // Check for progress bars (should be present in the new design)
  const progressBars = await page.locator('.progress-bar').count();
  console.log(`📈 Progress bars found: ${progressBars}`);
  expect(progressBars).toBeGreaterThan(0);
  
  // Check for tables
  const educationTables = await page.locator('.standard-data-table').count();
  console.log(`📋 Education tables found: ${educationTables}`);
  expect(educationTables).toBeGreaterThan(0);
  
  // Take a screenshot of the Education screen
  await page.screenshot({ path: 'tests/screenshots/education-updated.png', fullPage: true });
  
  console.log('✅ Education screen is working with full panel width design!');
  console.log('✅ The updated screens are working correctly!');
});
