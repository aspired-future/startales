import { test, expect } from '@playwright/test';

test('Debug Treasury Screen', async ({ page }) => {
  // Navigate to the main page
  await page.goto('http://localhost:5173/');
  
  // Wait for basic page load
  await page.waitForTimeout(2000);
  
  // Take a screenshot to see what's on the page
  await page.screenshot({ path: 'debug-treasury-1.png' });
  
  // Log the page content to see what's available
  const pageContent = await page.content();
  console.log('Page content length:', pageContent.length);
  
  // Look for any buttons or links
  const buttons = await page.locator('button, a').all();
  console.log('Found buttons/links:', buttons.length);
  
  for (let i = 0; i < Math.min(buttons.length, 10); i++) {
    const text = await buttons[i].textContent();
    console.log(`Button ${i}: "${text}"`);
  }
  
  // Look specifically for Treasury
  const treasuryElements = await page.locator('*:has-text("Treasury")').all();
  console.log('Found Treasury elements:', treasuryElements.length);
  
  // Try to find any navigation elements
  const navElements = await page.locator('nav, .nav, .navigation, .menu').all();
  console.log('Found navigation elements:', navElements.length);
  
  // Take another screenshot after some time
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'debug-treasury-2.png' });
});

