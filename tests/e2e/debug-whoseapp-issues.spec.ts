import { test, expect } from '@playwright/test';

test.describe('WhoseApp Issues Debug', () => {
  test('Debug duplicate screens and button functionality', async ({ page }) => {
    // Capture all console messages
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    console.log('=== STEP 1: Check for duplicate WhoseApp elements ===');
    
    // Look for all WhoseApp related elements
    const whoseAppButtons = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseAppButtons.length} elements with "WhoseApp" text`);
    
    const characterDirectories = await page.locator('text=Character Directory').all();
    console.log(`Found ${characterDirectories.length} "Character Directory" elements`);
    
    const characterTables = await page.locator('table.standard-data-table').all();
    console.log(`Found ${characterTables.length} character tables`);
    
    // Take initial screenshot
    await page.screenshot({ path: 'temp_dev/debug-initial-duplicates.png', fullPage: true });
    
    console.log('=== STEP 2: Click WhoseApp and check what happens ===');
    
    // Click the ComprehensiveHUD WhoseApp button
    const hudWhoseAppButton = page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' });
    if (await hudWhoseAppButton.count() > 0) {
      console.log('Clicking ComprehensiveHUD WhoseApp button');
      await hudWhoseAppButton.click();
      await page.waitForTimeout(3000);
      
      // Check what changed
      const characterDirectoriesAfter = await page.locator('text=Character Directory').all();
      console.log(`After click: Found ${characterDirectoriesAfter.length} "Character Directory" elements`);
      
      const characterTablesAfter = await page.locator('table.standard-data-table').all();
      console.log(`After click: Found ${characterTablesAfter.length} character tables`);
      
      await page.screenshot({ path: 'temp_dev/debug-after-whoseapp-click.png', fullPage: true });
    }
    
    console.log('=== STEP 3: Look for Message/Call buttons ===');
    
    // Find all Message buttons
    const messageButtons = await page.locator('button:has-text("💬 Message")').all();
    console.log(`Found ${messageButtons.length} Message buttons`);
    
    const callButtons = await page.locator('button:has-text("📞 Call")').all();
    console.log(`Found ${callButtons.length} Call buttons`);
    
    // Check if buttons are visible
    for (let i = 0; i < messageButtons.length; i++) {
      const isVisible = await messageButtons[i].isVisible();
      const boundingBox = await messageButtons[i].boundingBox();
      console.log(`Message button ${i}: Visible=${isVisible}, BoundingBox=${JSON.stringify(boundingBox)}`);
    }
    
    for (let i = 0; i < callButtons.length; i++) {
      const isVisible = await callButtons[i].isVisible();
      const boundingBox = await callButtons[i].boundingBox();
      console.log(`Call button ${i}: Visible=${isVisible}, BoundingBox=${JSON.stringify(boundingBox)}`);
    }
    
    console.log('=== STEP 4: Try clicking a Message button ===');
    
    if (messageButtons.length > 0) {
      // Find the first visible Message button
      let clickableButton = null;
      for (let i = 0; i < messageButtons.length; i++) {
        if (await messageButtons[i].isVisible()) {
          clickableButton = messageButtons[i];
          console.log(`Found clickable Message button at index ${i}`);
          break;
        }
      }
      
      if (clickableButton) {
        console.log('Attempting to click Message button...');
        
        // Scroll button into view first
        await clickableButton.scrollIntoView();
        await page.waitForTimeout(1000);
        
        // Take screenshot before click
        await page.screenshot({ path: 'temp_dev/debug-before-message-click.png', fullPage: true });
        
        // Click the button
        await clickableButton.click();
        await page.waitForTimeout(3000);
        
        // Take screenshot after click
        await page.screenshot({ path: 'temp_dev/debug-after-message-click.png', fullPage: true });
        
        // Check what happened
        const pageContent = await page.textContent('body');
        if (pageContent?.includes('Send') || pageContent?.includes('Back')) {
          console.log('✅ SUCCESS: Conversation interface opened!');
        } else {
          console.log('❌ FAILED: No conversation interface detected');
        }
        
        // Look for conversation elements
        const conversationElements = await page.locator('text=Send, text=Back, input[type="text"]').all();
        console.log(`Found ${conversationElements.length} conversation interface elements`);
        
        // Check for blank screen indicators
        const hasContent = pageContent && pageContent.trim().length > 100;
        console.log(`Page has content: ${hasContent}`);
        console.log(`Page content length: ${pageContent?.length || 0}`);
        
      } else {
        console.log('❌ No visible Message buttons found to click');
        
        // Try to make buttons visible by scrolling
        console.log('Attempting to scroll table to reveal buttons...');
        const table = page.locator('table.standard-data-table').first();
        if (await table.count() > 0) {
          await table.scrollIntoView();
          
          // Try horizontal scroll
          await page.keyboard.press('End');
          await page.waitForTimeout(1000);
          
          // Check again after scroll
          const messageButtonsAfterScroll = await page.locator('button:has-text("💬 Message")').all();
          let visibleAfterScroll = 0;
          for (let i = 0; i < messageButtonsAfterScroll.length; i++) {
            if (await messageButtonsAfterScroll[i].isVisible()) {
              visibleAfterScroll++;
            }
          }
          console.log(`After scroll: ${visibleAfterScroll} visible Message buttons`);
          
          await page.screenshot({ path: 'temp_dev/debug-after-scroll.png', fullPage: true });
        }
      }
    } else {
      console.log('❌ No Message buttons found at all');
    }
    
    console.log('=== STEP 5: Check for CSS/Layout issues ===');
    
    // Check table overflow
    const tables = await page.locator('table.standard-data-table').all();
    for (let i = 0; i < tables.length; i++) {
      const tableBox = await tables[i].boundingBox();
      const containerBox = await tables[i].locator('..').boundingBox();
      console.log(`Table ${i}: Table width=${tableBox?.width}, Container width=${containerBox?.width}`);
      
      if (tableBox && containerBox && tableBox.width > containerBox.width) {
        console.log(`⚠️ Table ${i} is wider than container - overflow issue detected`);
      }
    }
    
    console.log('=== DEBUG COMPLETE ===');
  });
});
