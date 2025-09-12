import { test, expect } from '@playwright/test';

test.describe('Direct WhoseApp Test', () => {
  test('Test standalone WhoseApp functionality', async ({ page }) => {
    // Capture all console messages
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Navigate directly to our test page
    await page.goto('http://localhost:5174/test-whoseapp.html');
    await page.waitForLoadState('networkidle');
    
    console.log('=== DIRECT WHOSEAPP TEST ===');
    
    // Wait for characters to load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'temp_dev/direct-whoseapp-initial.png', fullPage: true });
    
    // Check for character directory
    const directoryTitle = await page.locator('text=Character Directory').first();
    if (await directoryTitle.isVisible()) {
      console.log('✅ Character Directory found!');
    } else {
      console.log('❌ Character Directory not found');
    }
    
    // Look for character cards
    const messageButtons = await page.locator('text=💬 Message').all();
    const callButtons = await page.locator('text=📞 Call').all();
    
    console.log(`Found ${messageButtons.length} Message buttons`);
    console.log(`Found ${callButtons.length} Call buttons`);
    
    if (messageButtons.length > 0) {
      console.log('🎉 SUCCESS: Found Message buttons!');
      
      // Test clicking a Message button
      console.log('=== Testing Message Button ===');
      await messageButtons[0].click();
      await page.waitForTimeout(2000);
      
      // Take conversation screenshot
      await page.screenshot({ path: 'temp_dev/direct-whoseapp-conversation.png', fullPage: true });
      
      // Check if conversation interface appeared
      const conversationTitle = await page.locator('h2').filter({ hasText: /Conversation|💬/ }).first();
      if (await conversationTitle.isVisible()) {
        console.log('✅ Conversation interface loaded!');
        
        // Test text input
        const messageInput = await page.locator('#message-input');
        if (await messageInput.isVisible()) {
          console.log('✅ Message input found!');
          
          // Type and send a test message
          await messageInput.fill('Hello, this is a test message');
          await page.locator('text=Send').click();
          await page.waitForTimeout(2000);
          
          // Check if message appeared
          const messages = await page.locator('#messages').textContent();
          if (messages && messages.includes('Hello, this is a test message')) {
            console.log('🎉 SUCCESS: Text messaging works!');
          }
          
          // Test voice mode toggle
          const voiceModeBtn = await page.locator('#voice-mode-btn');
          if (await voiceModeBtn.isVisible()) {
            console.log('✅ Voice mode button found!');
            await voiceModeBtn.click();
            await page.waitForTimeout(1000);
            
            const recordBtn = await page.locator('#record-btn');
            if (await recordBtn.isVisible()) {
              console.log('🎉 SUCCESS: Voice interface works!');
            }
          }
        }
      }
      
      // Test going back
      const backBtn = await page.locator('text=← Back');
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForTimeout(1000);
        
        const directoryAgain = await page.locator('text=Character Directory').first();
        if (await directoryAgain.isVisible()) {
          console.log('✅ Back navigation works!');
        }
      }
      
    } else {
      console.log('❌ No Message buttons found');
      
      // Debug: show page content
      const pageText = await page.textContent('body');
      console.log('Page content preview:', pageText?.substring(0, 200));
    }
    
    console.log('=== DIRECT TEST COMPLETE ===');
  });
});
