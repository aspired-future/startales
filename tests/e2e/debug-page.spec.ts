import { test, expect } from '@playwright/test';

test('Debug Page Content', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Take a screenshot to see what's on the page
  await page.screenshot({ path: 'tests/screenshots/debug-page.png', fullPage: true });
  
  // Log the page content
  const pageContent = await page.content();
  console.log('Page title:', await page.title());
  
  // Check for various elements
  const populationElements = await page.locator('text=POPULATION').count();
  console.log(`Population elements found: ${populationElements}`);
  
  const accordionElements = await page.locator('[role="button"]').count();
  console.log(`Accordion elements found: ${accordionElements}`);
  
  const buttonElements = await page.locator('button').count();
  console.log(`Button elements found: ${buttonElements}`);
  
  // List all text content
  const allText = await page.locator('body').textContent();
  console.log('Page text content:', allText?.substring(0, 500) + '...');
  
  console.log('✅ Debug complete - check screenshot at tests/screenshots/debug-page.png');
});

