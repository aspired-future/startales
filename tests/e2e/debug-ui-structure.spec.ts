import { test, expect } from '@playwright/test';

test('Debug UI Structure - Examine what elements are actually present', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Wait for basic page load
  await page.waitForLoadState('domcontentloaded');
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/debug-ui-structure.png', fullPage: true });
  
  // Log the page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Look for navigation elements
  const navElements = await page.locator('.nav-accordion, .nav-item, [class*="nav"], [class*="accordion"]').count();
  console.log('Navigation elements found:', navElements);
  
  // Look for any text containing "POPULATION"
  const populationText = await page.locator('text=POPULATION').count();
  console.log('Elements with "POPULATION" text:', populationText);
  
  // Look for any text containing "Household"
  const householdText = await page.locator('text=Household').count();
  console.log('Elements with "Household" text:', householdText);
  
  // Get all text content to see what's actually on the page
  const bodyText = await page.locator('body').textContent();
  console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
  
  // Look for any buttons or clickable elements
  const buttons = await page.locator('button, [role="button"], .btn, .nav-item').count();
  console.log('Buttons/clickable elements found:', buttons);
  
  // Check if React root is populated
  const rootContent = await page.locator('#root').textContent();
  console.log('Root content (first 200 chars):', rootContent?.substring(0, 200));
});

