import { test, expect } from '@playwright/test';

test.describe('Character Communications Test', () => {
  test('Test Character Communications bypass', async ({ page }) => {
    // Capture all console messages
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Navigate to the game
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    console.log('=== Looking for Character Communications button ===');
    
    // Look for our new Character Communications button
    const charCommButtons = await page.locator('text=Character Communications').all();
    console.log(`Found ${charCommButtons.length} Character Communications buttons`);
    
    if (charCommButtons.length > 0) {
      console.log('=== Clicking Character Communications ===');
      await charCommButtons[0].click();
      await page.waitForTimeout(3000);
      
      // Take screenshot
      await page.screenshot({ path: 'temp_dev/character-comm-test.png', fullPage: true });
      console.log('Character Communications screenshot saved');
      
      // Check for our SimpleWhoseApp content
      const pageText = await page.textContent('body');
      
      if (pageText?.includes('Character Directory')) {
        console.log('🎉 SUCCESS: Found Character Directory!');
      } else {
        console.log('❌ No Character Directory found');
      }
      
      if (pageText?.includes('Elena') || pageText?.includes('Marcus') || pageText?.includes('Sarah')) {
        console.log('🎉 SUCCESS: Found character names!');
      } else {
        console.log('❌ No character names found');
      }
      
      const messageButtons = await page.locator('text=💬 Message').all();
      const callButtons = await page.locator('text=📞 Call').all();
      console.log(`Message buttons: ${messageButtons.length}`);
      console.log(`Call buttons: ${callButtons.length}`);
      
      if (messageButtons.length > 0) {
        console.log('🎉 SUCCESS: Found working Message buttons!');
        
        // Test clicking Message
        await messageButtons[0].click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: 'temp_dev/character-comm-conversation.png', fullPage: true });
        console.log('Conversation screenshot saved');
        
        const conversationElements = await page.locator('text=Send, text=Back').all();
        if (conversationElements.length > 0) {
          console.log('🎉 SUCCESS: Conversation interface works!');
        }
      }
      
    } else {
      console.log('❌ No Character Communications button found');
      
      // Look for any communication-related buttons
      const allButtons = await page.locator('button').all();
      console.log(`Total buttons found: ${allButtons.length}`);
      
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        const text = await allButtons[i].textContent();
        if (text && (text.includes('Comm') || text.includes('Character') || text.includes('💬'))) {
          console.log(`Found related button: "${text}"`);
        }
      }
    }
    
    console.log('=== Test complete ===');
  });
});
