import { test, expect } from '@playwright/test';

test('Test Health Screen Direct Access', async ({ page }) => {
  console.log('🏥 Testing Health Screen directly...');
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('📱 Console:', msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  // Navigate directly to the Health screen URL
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  // Try to find any navigation that might lead to Health
  const allButtons = page.locator('button');
  const buttonCount = await allButtons.count();
  console.log('🔘 Total buttons found:', buttonCount);
  
  // Look for any text that might be related to health or population
  const healthText = page.locator('text=Health, text=health, text=HEALTH, text=Population, text=population, text=POPULATION, text=Welfare, text=welfare');
  const healthCount = await healthText.count();
  console.log('🏥 Health/Population related elements found:', healthCount);
  
  // Get all text content to see what's available
  const bodyText = await page.textContent('body');
  console.log('📄 Body text length:', bodyText?.length || 0);
  
  // Look for specific patterns
  if (bodyText) {
    if (bodyText.includes('Health')) {
      console.log('✅ Found "Health" in page content');
    }
    if (bodyText.includes('Population')) {
      console.log('✅ Found "Population" in page content');
    }
    if (bodyText.includes('Civilization')) {
      console.log('✅ Found "Civilization" in page content');
    }
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/health-direct-test.png' });
  console.log('🏥 Health direct test complete - check screenshot at tests/screenshots/health-direct-test.png');
});

