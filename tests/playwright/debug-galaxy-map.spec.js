import { test, expect } from '@playwright/test';

test('Debug Galaxy Map Access', async ({ page }) => {
  console.log('🔍 Debugging Galaxy Map Access...');
  
  // Navigate to the application
  await page.goto('http://localhost:5174');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot of the initial page
  await page.screenshot({ path: 'tests/screenshots/debug-initial-page.png', fullPage: true });
  
  // Check what's actually on the page
  const title = await page.title();
  console.log('Page title:', title);
  
  // Look for any galaxy map related elements
  const galaxyMapElements = await page.locator('*').filter({ hasText: 'Galaxy' }).count();
  console.log('Elements containing "Galaxy":', galaxyMapElements);
  
  // Check if there are any navigation elements
  const navElements = await page.locator('nav, .nav, [role="navigation"]').count();
  console.log('Navigation elements found:', navElements);
  
  // Look for buttons or links
  const buttons = await page.locator('button').count();
  const links = await page.locator('a').count();
  console.log('Buttons found:', buttons);
  console.log('Links found:', links);
  
  // Try to find any text that might lead to the galaxy map
  const pageText = await page.textContent('body');
  console.log('Page contains "Enhanced":', pageText.includes('Enhanced'));
  console.log('Page contains "Galaxy":', pageText.includes('Galaxy'));
  console.log('Page contains "Map":', pageText.includes('Map'));
  
  // Look for any clickable elements with galaxy-related text
  const galaxyClickables = await page.locator('button, a, [role="button"]').filter({ hasText: /galaxy|map/i }).count();
  console.log('Galaxy-related clickable elements:', galaxyClickables);
  
  if (galaxyClickables > 0) {
    console.log('Found galaxy-related clickables, trying to click...');
    const firstGalaxyElement = page.locator('button, a, [role="button"]').filter({ hasText: /galaxy|map/i }).first();
    const elementText = await firstGalaxyElement.textContent();
    console.log('Clicking on:', elementText);
    
    await firstGalaxyElement.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot after clicking
    await page.screenshot({ path: 'tests/screenshots/debug-after-click.png', fullPage: true });
    
    // Check if we now have the enhanced galaxy map
    const enhancedMap = await page.locator('.enhanced-galaxy-map').count();
    console.log('Enhanced galaxy map elements after click:', enhancedMap);
  }
  
  // List all visible text on the page for debugging
  const allText = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    return elements
      .filter(el => el.textContent && el.textContent.trim().length > 0)
      .map(el => el.textContent.trim())
      .filter(text => text.length < 100) // Avoid huge text blocks
      .slice(0, 20); // Limit to first 20 for debugging
  });
  
  console.log('Visible text elements:', allText);
});
