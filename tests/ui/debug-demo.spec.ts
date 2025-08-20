import { test, expect } from '@playwright/test';

test.describe('Debug Demo', () => {
  test('debug button click and page state', async ({ page }) => {
    // Navigate to the demo
    await page.goto('http://localhost:5173');
    
    // Take a screenshot of the initial page
    await page.screenshot({ path: 'debug-initial.png' });
    
    // Check if the button exists
    const button = page.locator('button:has-text("Launch Game Demo")');
    await expect(button).toBeVisible();
    console.log('Button found and visible');
    
    // Click the button
    await button.click();
    console.log('Button clicked');
    
    // Wait for loading to complete - look for the actual game HUD
    try {
      await page.waitForSelector('.game-hud', { timeout: 10000 });
      console.log('Game HUD appeared');
    } catch (error) {
      console.log('Game HUD did not appear, checking for loading state');
      const loadingElement = await page.locator('.game-hud-loading').isVisible();
      console.log('Loading element visible:', loadingElement);
      
      if (loadingElement) {
        console.log('Still in loading state, waiting longer...');
        await page.waitForTimeout(5000);
      }
    }
    
    // Take a screenshot after clicking
    await page.screenshot({ path: 'debug-after-click.png' });
    
    // Check what's on the page now
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page contains GameHUD:', pageContent.includes('game-hud'));
    console.log('Page contains Launch Game Demo:', pageContent.includes('Launch Game Demo'));
    
    // Capture all console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const message = `${msg.type()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log('Console:', message);
    });
    
    // Look for the game HUD element
    const gameHud = page.locator('.game-hud');
    const isGameHudVisible = await gameHud.isVisible().catch(() => false);
    console.log('Game HUD visible:', isGameHudVisible);
    
    // Check for any elements with "game" in class name
    const gameElements = await page.locator('[class*="game"]').count();
    console.log('Elements with "game" in class:', gameElements);
    
    // Check for any elements with "hud" in class name
    const hudElements = await page.locator('[class*="hud"]').count();
    console.log('Elements with "hud" in class:', hudElements);
    
    // List all class names that contain "game" or "hud"
    const gameClassNames = await page.locator('[class*="game"], [class*="hud"]').evaluateAll(elements => 
      elements.map(el => el.className).filter(className => className.includes('game') || className.includes('hud'))
    );
    console.log('Game/HUD class names found:', gameClassNames);
    
    if (!isGameHudVisible) {
      // Check what elements are actually present
      const allElements = await page.locator('*').count();
      console.log('Total elements on page:', allElements);
      
      // Check for any error messages
      const errorElements = await page.locator('[class*="error"], [class*="Error"]').count();
      console.log('Error elements found:', errorElements);
      
      // Check if GameHUD component rendered at all
      const gameHudText = await page.locator('text=Game HUD').count();
      console.log('Text "Game HUD" found:', gameHudText);
      
      // Check for error element
      const errorElement = await page.locator('.game-hud-error').count();
      console.log('GameHUD error element found:', errorElement);
      
      if (errorElement > 0) {
        const errorText = await page.locator('.game-hud-error').textContent();
        console.log('GameHUD error text:', errorText);
      }
    }
    
    // Print all console messages at the end
    console.log('All console messages:', consoleMessages);
  });
});
