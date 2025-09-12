import { test, expect } from '@playwright/test';

test.describe('Simple WhoseApp Test', () => {
  test('Test if SimpleWhoseApp shows characters and buttons', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Navigate to the game
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    console.log('=== STEP 1: Looking for WhoseApp ===');
    
    // Find and click WhoseApp button
    const whoseAppButton = page.locator('text=📞 WhoseApp').first();
    await whoseAppButton.click();
    await page.waitForTimeout(2000);
    
    console.log('=== STEP 2: Checking for SimpleWhoseApp logs ===');
    
    // Wait for our SimpleWhoseApp to load
    await page.waitForTimeout(5000);
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/simple-whoseapp-test.png', fullPage: true });
    console.log('Screenshot saved: temp_dev/simple-whoseapp-test.png');
    
    console.log('=== STEP 3: Looking for character directory ===');
    
    // Look for our SimpleWhoseApp content
    const directoryTitle = await page.locator('text=Character Directory').all();
    console.log(`Found ${directoryTitle.length} "Character Directory" titles`);
    
    const loadingText = await page.locator('text=Loading characters').all();
    console.log(`Found ${loadingText.length} loading indicators`);
    
    // Look for character names that should be loaded from API
    const characterNames = ['Elena', 'Marcus', 'Sarah', 'Ambassador', 'General'];
    let foundCharacters = 0;
    
    for (const name of characterNames) {
      const elements = await page.locator(`text=${name}`).all();
      if (elements.length > 0) {
        console.log(`✅ Found character: ${name}`);
        foundCharacters++;
      }
    }
    
    console.log(`Total characters found: ${foundCharacters}`);
    
    // Look for our Message and Call buttons
    const messageButtons = await page.locator('text=💬 Message').all();
    const callButtons = await page.locator('text=📞 Call').all();
    console.log(`Message buttons: ${messageButtons.length}`);
    console.log(`Call buttons: ${callButtons.length}`);
    
    if (messageButtons.length > 0) {
      console.log('🎉 SUCCESS: Found Message buttons!');
      
      // Test clicking a Message button
      console.log('=== STEP 4: Testing Message button ===');
      await messageButtons[0].click();
      await page.waitForTimeout(3000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'temp_dev/simple-whoseapp-conversation.png', fullPage: true });
      console.log('Conversation screenshot saved');
      
      // Look for conversation interface
      const backButtons = await page.locator('text=Back, text=←').all();
      const sendButtons = await page.locator('text=Send').all();
      console.log(`Back buttons: ${backButtons.length}`);
      console.log(`Send buttons: ${sendButtons.length}`);
      
      if (backButtons.length > 0 || sendButtons.length > 0) {
        console.log('🎉 SUCCESS: Conversation interface loaded!');
      } else {
        console.log('❌ ISSUE: Conversation interface not found');
      }
    } else {
      console.log('❌ ISSUE: No Message buttons found');
    }
    
    console.log('=== TEST COMPLETE ===');
  });
});
