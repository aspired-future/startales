import { test, expect } from '@playwright/test';

test('Comprehensive Debug - Find all elements on the page', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5173');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/comprehensive-debug.png', fullPage: true });
  
  // Log the page title
  console.log('Page title:', await page.title());
  
  // Get all text content on the page
  const bodyText = await page.textContent('body');
  console.log('Full body text:', bodyText);
  
  // Look for any elements with text
  const allElements = page.locator('*');
  const count = await allElements.count();
  console.log('Total elements on page:', count);
  
  // Look for specific classes that might contain navigation
  const navClasses = [
    '.nav-accordion', '.nav', '.navigation', '.menu', '.sidebar',
    '.accordion', '.panel', '.tab', '.button', '.btn'
  ];
  
  for (const className of navClasses) {
    const elements = page.locator(className);
    const elementCount = await elements.count();
    if (elementCount > 0) {
      console.log(`Found ${elementCount} elements with class ${className}`);
      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        const element = elements.nth(i);
        const text = await element.textContent();
        const tagName = await element.evaluate(el => el.tagName);
        console.log(`  ${i}: <${tagName}>${text}</${tagName}>`);
      }
    }
  }
  
  // Look for any text containing "Population", "Health", "Government", etc.
  const keywords = ['Population', 'Health', 'Government', 'Economy', 'Military', 'Science'];
  for (const keyword of keywords) {
    const elements = page.locator(`text=${keyword}`);
    const count = await elements.count();
    if (count > 0) {
      console.log(`Found ${count} elements containing "${keyword}"`);
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = elements.nth(i);
        const text = await element.textContent();
        console.log(`  ${i}: "${text}"`);
      }
    }
  }
  
  // Check for any buttons or clickable elements
  const buttons = page.locator('button, [role="button"], .btn, .button, [onclick]');
  const buttonCount = await buttons.count();
  console.log(`Found ${buttonCount} buttons/clickable elements`);
  
  if (buttonCount > 0) {
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const tagName = await button.evaluate(el => el.tagName);
      console.log(`  Button ${i}: <${tagName}>${text}</${tagName}>`);
    }
  }
  
  // Check for any divs with text content
  const divs = page.locator('div');
  const divCount = await divs.count();
  console.log(`Found ${divCount} div elements`);
  
  // Look for divs with text content
  const divsWithText = page.locator('div:has-text("")');
  const divsWithTextCount = await divsWithText.count();
  console.log(`Found ${divsWithTextCount} divs with text content`);
  
  if (divsWithTextCount > 0) {
    for (let i = 0; i < Math.min(divsWithTextCount, 5); i++) {
      const div = divsWithText.nth(i);
      const text = await div.textContent();
      console.log(`  Div ${i}: "${text?.substring(0, 100)}"`);
    }
  }
});

