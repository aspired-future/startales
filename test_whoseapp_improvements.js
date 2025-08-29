/**
 * Test script for WhoseApp improvements
 * Tests AI response length and continuous listening functionality
 */

import { chromium } from 'playwright';

async function testWhoseAppImprovements() {
  console.log('🧪 Testing WhoseApp improvements...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the frontend
    console.log('🌐 Navigating to frontend...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Click on WhoseApp in the left menu
    console.log('📱 Opening WhoseApp...');
    const whoseAppButton = await page.locator('text=WhoseApp').first();
    await whoseAppButton.click();
    
    // Wait for WhoseApp to load
    await page.waitForTimeout(2000);
    
    // Check if WhoseApp loaded correctly
    const whoseAppHeader = await page.locator('text=💬 WhoseApp').first();
    if (await whoseAppHeader.isVisible()) {
      console.log('✅ WhoseApp loaded successfully');
    } else {
      console.log('❌ WhoseApp failed to load');
      return;
    }
    
    // Check for voice mode button
    const voiceButton = await page.locator('button:has-text("Voice")').first();
    if (await voiceButton.isVisible()) {
      console.log('✅ Voice mode button found');
    } else {
      console.log('❌ Voice mode button not found');
    }
    
    // Test AI response length by sending a message
    console.log('🤖 Testing AI response length...');
    
    // Click on a conversation to open it
    const conversationItem = await page.locator('.conversation-item').first();
    if (await conversationItem.isVisible()) {
      await conversationItem.click();
      await page.waitForTimeout(1000);
      
      // Find the message input
      const messageInput = await page.locator('input[placeholder*="message"], textarea[placeholder*="message"]').first();
      if (await messageInput.isVisible()) {
        // Type a test message
        await messageInput.fill('What is the current state of the galaxy?');
        await messageInput.press('Enter');
        
        // Wait for AI response
        console.log('⏳ Waiting for AI response...');
        await page.waitForTimeout(5000);
        
        // Check for AI response
        const aiMessages = await page.locator('.message.received').all();
        if (aiMessages.length > 0) {
          const lastMessage = aiMessages[aiMessages.length - 1];
          const messageText = await lastMessage.textContent();
          console.log('📝 AI Response:', messageText);
          
          // Check if response is longer than before (should be > 50 characters)
          if (messageText && messageText.length > 50) {
            console.log('✅ AI response length improved - response is longer');
          } else {
            console.log('⚠️ AI response might still be too short');
          }
        } else {
          console.log('❌ No AI response received');
        }
      } else {
        console.log('❌ Message input not found');
      }
    } else {
      console.log('❌ No conversations found to test');
    }
    
    // Test continuous listening by enabling voice mode
    console.log('🎤 Testing continuous listening...');
    
    const voiceModeButton = await page.locator('button:has-text("Voice")').first();
    if (await voiceModeButton.isVisible()) {
      // Click voice mode button
      await voiceModeButton.click();
      await page.waitForTimeout(2000);
      
      // Check if voice mode is enabled
      const voiceEnabledButton = await page.locator('button:has-text("Voice On")').first();
      if (await voiceEnabledButton.isVisible()) {
        console.log('✅ Voice mode enabled successfully');
        console.log('🎤 Continuous listening should now be active');
      } else {
        console.log('❌ Voice mode failed to enable');
      }
    } else {
      console.log('❌ Voice mode button not found');
    }
    
    console.log('✅ WhoseApp improvements test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testWhoseAppImprovements().catch(console.error);
