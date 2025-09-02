import { test, expect } from '@playwright/test';

test('Simple Household Economics test', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Take a screenshot to see what's loaded
  await page.screenshot({ path: 'test-results/simple-household-test-initial.png', fullPage: true });

  // Log the page title
  const title = await page.title();
  console.log('Page title:', title);

  // Log all text content to see what's available
  const bodyText = await page.textContent('body');
  console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));

  // Check if React is loaded
  const reactRoot = page.locator('#root');
  await expect(reactRoot).toBeVisible();

  // Look for any navigation elements
  const navElements = page.locator('[class*="nav"]');
  const navCount = await navElements.count();
  console.log('Navigation elements found:', navCount);

  // Look for any accordion elements
  const accordionElements = page.locator('[class*="accordion"]');
  const accordionCount = await accordionElements.count();
  console.log('Accordion elements found:', accordionCount);

  // Look for any button elements
  const buttonElements = page.locator('button');
  const buttonCount = await buttonElements.count();
  console.log('Button elements found:', buttonCount);

  // Log all button texts
  for (let i = 0; i < buttonCount; i++) {
    const buttonText = await buttonElements.nth(i).textContent();
    console.log(`Button ${i}:`, buttonText);
  }

  // Look for any text containing "Population" or "Household"
  const populationText = page.locator('text=Population');
  const householdText = page.locator('text=Household');
  
  const populationCount = await populationText.count();
  const householdCount = await householdText.count();
  
  console.log('Elements with "Population":', populationCount);
  console.log('Elements with "Household":', householdCount);

  // Take another screenshot
  await page.screenshot({ path: 'test-results/simple-household-test-final.png', fullPage: true });
});

