import { test, expect } from '@playwright/test';

test.describe('Debug Current State', () => {
  test('See what is actually displayed in WhoseApp', async ({ page }) => {
    // Capture all console messages
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Navigate to the game
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    console.log('=== Page loaded ===');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'temp_dev/debug-initial-state.png', fullPage: true });
    console.log('Initial screenshot saved');
    
    // Look for the specific ComprehensiveHUD WhoseApp button
    const whoseAppButton = page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' });
    const whoseAppButtonCount = await whoseAppButton.count();
    console.log(`Found ${whoseAppButtonCount} ComprehensiveHUD WhoseApp buttons`);
    
    if (whoseAppButtonCount > 0) {
      console.log('=== Clicking ComprehensiveHUD WhoseApp button ===');
      await whoseAppButton.click();
      await page.waitForTimeout(3000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'temp_dev/debug-after-whoseapp-click.png', fullPage: true });
      console.log('After click screenshot saved');
      
      // Check what's visible
      const pageText = await page.textContent('body');
      console.log('=== Page content analysis ===');
      
      if (pageText?.includes('Character Directory')) {
        console.log('✅ Found "Character Directory" text');
      } else {
        console.log('❌ No "Character Directory" text found');
      }
      
      if (pageText?.includes('Loading characters')) {
        console.log('🔄 Found "Loading characters" text');
      }
      
      if (pageText?.includes('Elena') || pageText?.includes('Marcus') || pageText?.includes('Sarah')) {
        console.log('✅ Found character names');
      } else {
        console.log('❌ No character names found');
      }
      
      if (pageText?.includes('Message') || pageText?.includes('Call')) {
        console.log('✅ Found Message/Call buttons');
      } else {
        console.log('❌ No Message/Call buttons found');
      }
      
      // Check for our SimpleWhoseApp console logs
      console.log('=== Looking for SimpleWhoseApp logs ===');
      // The logs should appear in the browser console above
      
    } else {
      console.log('❌ No WhoseApp buttons found');
    }
  });
});
