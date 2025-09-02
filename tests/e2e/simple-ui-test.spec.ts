import { test, expect } from '@playwright/test';

test('Simple UI Test - Check if UI loads without HealthScreen', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5173');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/simple-ui-test.png', fullPage: true });
  
  // Log the page title
  console.log('Page title:', await page.title());
  
  // Check if there are any navigation elements
  const navElements = page.locator('nav, .nav, .navigation, .menu, .nav-accordion');
  const count = await navElements.count();
  console.log('Navigation elements found:', count);
  
  // Look for any text that might indicate what page we're on
  const bodyText = await page.textContent('body');
  console.log('Body text preview:', bodyText?.substring(0, 500));
  
  // Look for Population or other navigation elements
  const populationElements = page.locator('text=Population, text=POPULATION, text=Government, text=Economy');
  const popCount = await populationElements.count();
  console.log('Population/Government/Economy elements found:', popCount);
  
  if (popCount > 0) {
    console.log('✅ Found navigation elements!');
    for (let i = 0; i < Math.min(popCount, 5); i++) {
      const element = populationElements.nth(i);
      const text = await element.textContent();
      console.log(`  Element ${i}: "${text}"`);
    }
  }
  
  // Check if there are any buttons or clickable elements
  const buttons = page.locator('button, [role="button"], .btn, .button, [onclick]');
  const buttonCount = await buttons.count();
  console.log(`Found ${buttonCount} buttons/clickable elements`);
  
  if (buttonCount > 0) {
    console.log('✅ UI is loading with interactive elements!');
  }
});

