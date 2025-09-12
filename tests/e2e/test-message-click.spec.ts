import { test, expect } from '@playwright/test';

test.describe('WhoseApp Message Click Test', () => {
  test('Click Message button and check result', async ({ page }) => {
    // Capture console messages
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    // Click WhoseApp
    const whoseAppButton = page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' });
    await whoseAppButton.click();
    await page.waitForTimeout(3000);
    
    console.log('=== Clicking first Message button ===');
    
    // Find and click the first Message button
    const messageButton = page.locator('button:has-text("💬 Message")').first();
    
    if (await messageButton.count() > 0) {
      console.log('Message button found, clicking...');
      
      // Take screenshot before click
      await page.screenshot({ path: 'temp_dev/before-message-click.png', fullPage: true });
      
      await messageButton.click();
      await page.waitForTimeout(3000);
      
      // Take screenshot after click
      await page.screenshot({ path: 'temp_dev/after-message-click.png', fullPage: true });
      
      // Check what happened
      const pageText = await page.textContent('body');
      console.log(`Page content length after click: ${pageText?.length || 0}`);
      
      // Look for conversation interface elements
      const sendButtons = await page.locator('text=Send').all();
      const backButtons = await page.locator('text=Back').all();
      const messageInputs = await page.locator('input[type="text"]').all();
      
      console.log(`Send buttons: ${sendButtons.length}`);
      console.log(`Back buttons: ${backButtons.length}`);
      console.log(`Message inputs: ${messageInputs.length}`);
      
      // Check for blank screen
      const hasMinimalContent = pageText && pageText.trim().length < 100;
      if (hasMinimalContent) {
        console.log('⚠️ BLANK SCREEN DETECTED - minimal content');
      } else {
        console.log('✅ Screen has content');
      }
      
      // Look for specific conversation elements
      if (pageText?.includes('Send') || pageText?.includes('Back to')) {
        console.log('✅ SUCCESS: Conversation interface detected!');
      } else {
        console.log('❌ FAILED: No conversation interface found');
        console.log('Page content preview:', pageText?.substring(0, 200));
      }
      
    } else {
      console.log('❌ No Message button found');
    }
  });
});
