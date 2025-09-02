import { test, expect } from '@playwright/test';

test('Debug Navigation Buttons', async ({ page }) => {
  console.log('🔍 Debugging navigation buttons...');
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  // Look for any navigation elements
  const navElements = page.locator('nav, .nav, .navigation, .menu, .nav-accordion, button, a');
  const count = await navElements.count();
  console.log('📱 Total navigation elements found:', count);
  
  // Look for buttons with text
  const buttons = page.locator('button');
  const buttonCount = await buttons.count();
  console.log('🔘 Total buttons found:', buttonCount);
  
  // Get text content of all buttons
  for (let i = 0; i < Math.min(buttonCount, 20); i++) {
    const button = buttons.nth(i);
    const text = await button.textContent();
    if (text && text.trim()) {
      console.log(`🔘 Button ${i}: "${text.trim()}"`);
    }
  }
  
  // Look for specific health-related text
  const healthElements = page.locator('text=Health, text=health, text=HEALTH, text=Welfare, text=welfare');
  const healthCount = await healthElements.count();
  console.log('🏥 Health-related elements found:', healthCount);
  
  // Look for population category
  const populationElements = page.locator('text=Population, text=population, text=POPULATION');
  const popCount = await populationElements.count();
  console.log('👥 Population elements found:', popCount);
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/debug-navigation.png' });
  console.log('🔍 Navigation debug complete - check screenshot at tests/screenshots/debug-navigation.png');
});
