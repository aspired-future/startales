import { test, expect } from '@playwright/test';

test.describe('WhoseApp Blank Screen Debug', () => {
  test('Debug blank screen when clicking Message/Call buttons', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Capture any page errors
    page.on('pageerror', error => {
      console.log(`PAGE ERROR: ${error.message}`);
    });

    // Navigate to the game
    await page.goto('http://localhost:5174');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('=== STEP 1: Page loaded ===');
    
    // Look for WhoseApp in the interface
    console.log('=== STEP 2: Looking for WhoseApp ===');
    
    // Try to find WhoseApp screen or button
    const whoseAppElements = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseAppElements.length} WhoseApp elements`);
    
    if (whoseAppElements.length === 0) {
      // Try alternative selectors
      const communicationElements = await page.locator('text=Communication').all();
      const messageElements = await page.locator('text=Message').all();
      console.log(`Found ${communicationElements.length} Communication elements`);
      console.log(`Found ${messageElements.length} Message elements`);
      
      // Take a screenshot to see what's on screen
      await page.screenshot({ path: 'temp_dev/debug-homepage.png', fullPage: true });
      console.log('Screenshot saved: temp_dev/debug-homepage.png');
      
      // Look for any clickable elements that might lead to WhoseApp
      const clickableElements = await page.locator('button, [role="button"], a').all();
      console.log(`Found ${clickableElements.length} clickable elements`);
      
      for (let i = 0; i < Math.min(clickableElements.length, 10); i++) {
        const text = await clickableElements[i].textContent();
        console.log(`  Clickable ${i}: "${text}"`);
      }
    }
    
    // Try to navigate to WhoseApp
    if (whoseAppElements.length > 0) {
      console.log('=== STEP 3: Clicking WhoseApp ===');
      await whoseAppElements[0].click();
      await page.waitForTimeout(2000);
      
      // Take screenshot of WhoseApp interface
      await page.screenshot({ path: 'temp_dev/debug-whoseapp-main.png', fullPage: true });
      console.log('Screenshot saved: temp_dev/debug-whoseapp-main.png');
      
      console.log('=== STEP 4: Looking for Characters ===');
      
      // Check if characters are loading
      const loadingText = await page.locator('text=Loading characters').all();
      console.log(`Found ${loadingText.length} loading indicators`);
      
      // Wait for characters to load
      await page.waitForTimeout(3000);
      
      // Look for character elements
      const characterElements = await page.locator('text=Elena, text=Marcus, text=Sarah').all();
      console.log(`Found ${characterElements.length} character names`);
      
      // Look for Message and Call buttons
      const messageButtons = await page.locator('text=💬 Message').all();
      const callButtons = await page.locator('text=📞 Call').all();
      console.log(`Found ${messageButtons.length} Message buttons`);
      console.log(`Found ${callButtons.length} Call buttons`);
      
      if (messageButtons.length > 0) {
        console.log('=== STEP 5: Clicking Message Button ===');
        
        // Take screenshot before clicking
        await page.screenshot({ path: 'temp_dev/debug-before-message-click.png', fullPage: true });
        
        // Click the first Message button
        await messageButtons[0].click();
        await page.waitForTimeout(2000);
        
        // Take screenshot after clicking
        await page.screenshot({ path: 'temp_dev/debug-after-message-click.png', fullPage: true });
        console.log('Screenshots saved: before and after message click');
        
        // Check what's visible on screen
        const conversationElements = await page.locator('text=conversation, text=Conversation').all();
        const unifiedElements = await page.locator('[class*="unified"], [class*="Unified"]').all();
        const blankElements = await page.locator('div:empty').all();
        
        console.log(`Found ${conversationElements.length} conversation elements`);
        console.log(`Found ${unifiedElements.length} unified elements`);
        console.log(`Found ${blankElements.length} empty div elements`);
        
        // Check if there are any error messages
        const errorElements = await page.locator('text=error, text=Error, text=failed, text=Failed').all();
        console.log(`Found ${errorElements.length} error messages`);
        
        // Get page title and URL
        const title = await page.title();
        const url = page.url();
        console.log(`Page title: ${title}`);
        console.log(`Page URL: ${url}`);
        
        // Check if the conversation interface loaded
        const backButtons = await page.locator('text=Back, text=←').all();
        const sendButtons = await page.locator('text=Send').all();
        console.log(`Found ${backButtons.length} back buttons`);
        console.log(`Found ${sendButtons.length} send buttons`);
        
      } else {
        console.log('ERROR: No Message buttons found!');
      }
    } else {
      console.log('ERROR: WhoseApp not found on page!');
    }
    
    console.log('=== DEBUG COMPLETE ===');
  });
});
