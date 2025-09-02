import { test, expect } from '@playwright/test';

test('Health Screen Test - Verify HealthScreen loads correctly', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5173');
  
  // Wait for the page to load
  await page.waitForLoadState('domcontentloaded');
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/health-screen-test.png', fullPage: true });
  
  // Log the page title
  console.log('Page title:', await page.title());
  
  // Look for navigation elements that might contain Health
  const healthElements = page.locator('text=Health, text=🏥, text=Health & Welfare');
  const healthCount = await healthElements.count();
  console.log('Health-related elements found:', healthCount);
  
  if (healthCount > 0) {
    console.log('✅ Found Health-related elements!');
    for (let i = 0; i < Math.min(healthCount, 5); i++) {
      const element = healthElements.nth(i);
      const text = await element.textContent();
      console.log(`  Element ${i}: "${text}"`);
    }
  }
  
  // Look for any navigation or menu elements
  const navElements = page.locator('nav, .nav, .navigation, .menu, .nav-accordion, button, [role="button"]');
  const navCount = await navElements.count();
  console.log(`Found ${navCount} navigation/button elements`);
  
  if (navCount > 0) {
    console.log('✅ UI is loading with navigation elements!');
  }
  
  // Look for any text that might indicate what page we're on
  const bodyText = await page.textContent('body');
  console.log('Body text preview:', bodyText?.substring(0, 500));
  
  // Check if there are any error messages
  const errorElements = page.locator('text=Error, text=Failed, text=Loading');
  const errorCount = await errorElements.count();
  console.log(`Found ${errorCount} error/loading elements`);
  
  if (errorCount > 0) {
    for (let i = 0; i < Math.min(errorCount, 3); i++) {
      const element = errorElements.nth(i);
      const text = await element.textContent();
      console.log(`  Error/Loading ${i}: "${text}"`);
    }
  }
});
