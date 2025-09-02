import { test, expect } from '@playwright/test';

test.describe('Debug Science Technology Screen', () => {
  test('Debug Science Technology screen loading', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: 'debug-science-tech-initial.png' });
    
    // Click on Science & Tech section to expand it
    const scienceSection = page.locator('text=🔬SCIENCE & TECH▶');
    await expect(scienceSection).toBeVisible();
    await scienceSection.click();
    await page.waitForTimeout(2000);
    
    // Take a screenshot after expanding science section
    await page.screenshot({ path: 'debug-science-tech-expanded.png' });
    
    // Click on Government R&D
    const governmentResearchButton = page.locator('button').filter({ hasText: 'Government R&D' });
    await expect(governmentResearchButton).toBeVisible();
    await governmentResearchButton.click();
    await page.waitForTimeout(3000);
    
    // Take a screenshot of the screen
    await page.screenshot({ path: 'debug-science-tech-screen.png' });
    
    // Log page content to see what's rendered
    const pageContent = await page.content();
    console.log('Page content:', pageContent.substring(0, 2000));
    
    // Log console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
    
    // Check if the screen title is present
    const screenTitle = page.locator('h2');
    const titleText = await screenTitle.textContent();
    console.log('Screen title:', titleText);
    
    // Check if the technology theme is present
    const themeContainer = page.locator('.standard-screen-container.technology-theme');
    const themeExists = await themeContainer.count();
    console.log('Technology theme containers found:', themeExists);
    
    // Check if tabs are present
    const tabs = page.locator('.base-screen-tab');
    const tabCount = await tabs.count();
    console.log('Tabs found:', tabCount);
    
    // List all tab texts
    for (let i = 0; i < tabCount; i++) {
      const tabText = await tabs.nth(i).textContent();
      console.log(`Tab ${i}:`, tabText);
    }
  });
});

