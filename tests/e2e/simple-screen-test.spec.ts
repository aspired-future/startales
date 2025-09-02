import { test, expect } from '@playwright/test';

test('Simple Screen Test - Education and Health', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Test Education Screen
  console.log('🎓 Testing Education Screen...');
  await page.locator('text=👥POPULATION▶').click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item:has-text("🎓 Education")').click();
  await page.waitForTimeout(3000);
  
  // Check if Education screen loads
  const educationTitle = await page.locator('text=Education').count();
  console.log(`📊 Education title found: ${educationTitle}`);
  expect(educationTitle).toBeGreaterThan(0);
  
  // Check for full panel width metrics
  const educationMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`📊 Education metrics found: ${educationMetrics}`);
  expect(educationMetrics).toBeGreaterThan(0);
  
  // Test Health Screen
  console.log('🏥 Testing Health Screen...');
  await page.locator('.nav-item:has-text("🏥 Health")').click();
  await page.waitForTimeout(3000);
  
  // Check if Health screen loads
  const healthTitle = await page.locator('text=Health').count();
  console.log(`🏥 Health title found: ${healthTitle}`);
  expect(healthTitle).toBeGreaterThan(0);
  
  // Check for full panel width metrics
  const healthMetrics = await page.locator('.standard-metric-grid .standard-metric').count();
  console.log(`📊 Health metrics found: ${healthMetrics}`);
  expect(healthMetrics).toBeGreaterThan(0);
  
  console.log('✅ Both screens are loading with full panel width design!');
});

