import { test, expect } from '@playwright/test';

test('Find Navigation Structure', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Look for any accordion elements
  const accordionElements = page.locator('[class*="accordion"]');
  const accordionCount = await accordionElements.count();
  console.log('Accordion elements found:', accordionCount);

  // Log all accordion texts
  for (let i = 0; i < accordionCount; i++) {
    const accordionText = await accordionElements.nth(i).textContent();
    console.log(`Accordion ${i}:`, accordionText);
  }

  // Look for any elements with "Population" text
  const populationElements = page.locator('text=Population');
  const populationCount = await populationElements.count();
  console.log('Elements with "Population":', populationCount);

  // Look for any elements with "Household" text
  const householdElements = page.locator('text=Household');
  const householdCount = await householdElements.count();
  console.log('Elements with "Household":', householdCount);

  // Look for any elements with "Economics" text
  const economicsElements = page.locator('text=Economics');
  const economicsCount = await economicsElements.count();
  console.log('Elements with "Economics":', economicsCount);

  // Look for any button elements and log their text
  const buttonElements = page.locator('button');
  const buttonCount = await buttonElements.count();
  console.log('Total buttons found:', buttonCount);

  // Log all button texts
  for (let i = 0; i < buttonCount; i++) {
    const buttonText = await buttonElements.nth(i).textContent();
    console.log(`Button ${i}:`, buttonText);
  }

  // Look for any nav elements
  const navElements = page.locator('[class*="nav"]');
  const navCount = await navElements.count();
  console.log('Nav elements found:', navCount);

  // Log all nav element texts
  for (let i = 0; i < navCount; i++) {
    const navText = await navElements.nth(i).textContent();
    console.log(`Nav element ${i}:`, navText);
  }

  // Look for any elements with "POPULATION" (uppercase)
  const populationUpperElements = page.locator('text=POPULATION');
  const populationUpperCount = await populationUpperElements.count();
  console.log('Elements with "POPULATION":', populationUpperCount);

  // Look for any elements with "HOUSEHOLDS" (uppercase)
  const householdsUpperElements = page.locator('text=HOUSEHOLDS');
  const householdsUpperCount = await householdsUpperElements.count();
  console.log('Elements with "HOUSEHOLDS":', householdsUpperCount);

  // Take a screenshot
  await page.screenshot({ path: 'test-results/find-navigation.png', fullPage: true });
});

