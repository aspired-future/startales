import { test, expect } from '@playwright/test';

test.describe('WhoseApp Direct Access Test', () => {
  test('Test WhoseApp by directly accessing the screen', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Navigate to the game
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    console.log('=== STEP 1: Looking for screen navigation ===');
    
    // Look for any navigation elements that might lead to WhoseApp
    const screenButtons = await page.locator('button, [role="button"]').all();
    console.log(`Found ${screenButtons.length} buttons`);
    
    // Look specifically for communications or WhoseApp related buttons
    for (let i = 0; i < Math.min(screenButtons.length, 20); i++) {
      const text = await screenButtons[i].textContent();
      if (text && (text.includes('WhoseApp') || text.includes('Communication') || text.includes('📱') || text.includes('💬'))) {
        console.log(`Found relevant button: "${text}"`);
        
        console.log('=== STEP 2: Clicking WhoseApp/Communication button ===');
        await screenButtons[i].click();
        await page.waitForTimeout(3000);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/debug-whoseapp-direct.png', fullPage: true });
        console.log('Screenshot saved: temp_dev/debug-whoseapp-direct.png');
        
        // Check for characters
        console.log('=== STEP 3: Looking for character elements ===');
        
        // Look for character names from the API
        const characterNames = ['Elena', 'Marcus', 'Sarah', 'Ambassador', 'General', 'Dr.'];
        let foundCharacters = 0;
        
        for (const name of characterNames) {
          const elements = await page.locator(`text=${name}`).all();
          if (elements.length > 0) {
            console.log(`Found character name: ${name} (${elements.length} elements)`);
            foundCharacters++;
          }
        }
        
        console.log(`Total character names found: ${foundCharacters}`);
        
        // Look for Message and Call buttons
        const messageButtons = await page.locator('text=💬 Message').all();
        const callButtons = await page.locator('text=📞 Call').all();
        console.log(`Found ${messageButtons.length} Message buttons`);
        console.log(`Found ${callButtons.length} Call buttons`);
        
        // Look for loading states
        const loadingElements = await page.locator('text=Loading, text=loading').all();
        console.log(`Found ${loadingElements.length} loading indicators`);
        
        // Look for error messages
        const errorElements = await page.locator('text=error, text=Error, text=failed, text=Failed').all();
        console.log(`Found ${errorElements.length} error messages`);
        
        // Check if character data is actually loading
        console.log('=== STEP 4: Checking API calls ===');
        
        // Wait a bit more for API calls
        await page.waitForTimeout(5000);
        
        // Take another screenshot after waiting
        await page.screenshot({ path: 'temp_dev/debug-whoseapp-after-wait.png', fullPage: true });
        console.log('Screenshot saved: temp_dev/debug-whoseapp-after-wait.png');
        
        // Check again for characters
        const charactersAfterWait = await page.locator('text=Elena, text=Marcus, text=Sarah').all();
        console.log(`Characters found after wait: ${charactersAfterWait.length}`);
        
        const messageButtonsAfterWait = await page.locator('text=💬 Message').all();
        const callButtonsAfterWait = await page.locator('text=📞 Call').all();
        console.log(`Message buttons after wait: ${messageButtonsAfterWait.length}`);
        console.log(`Call buttons after wait: ${callButtonsAfterWait.length}`);
        
        if (messageButtonsAfterWait.length > 0) {
          console.log('=== SUCCESS: Found Message buttons! ===');
          
          // Test clicking a Message button
          console.log('=== STEP 5: Testing Message button click ===');
          await messageButtonsAfterWait[0].click();
          await page.waitForTimeout(2000);
          
          // Take screenshot after clicking Message
          await page.screenshot({ path: 'temp_dev/debug-message-click-result.png', fullPage: true });
          console.log('Screenshot saved: temp_dev/debug-message-click-result.png');
          
          // Check if conversation interface appears
          const conversationElements = await page.locator('text=conversation, text=Conversation, text=Send, text=Back').all();
          console.log(`Conversation interface elements: ${conversationElements.length}`);
          
          if (conversationElements.length > 0) {
            console.log('=== SUCCESS: Conversation interface loaded! ===');
          } else {
            console.log('=== ISSUE: Conversation interface did not load ===');
          }
        } else {
          console.log('=== ISSUE: No Message buttons found after wait ===');
        }
        
        break; // Exit the loop after testing the first relevant button
      }
    }
    
    console.log('=== TEST COMPLETE ===');
  });
});
