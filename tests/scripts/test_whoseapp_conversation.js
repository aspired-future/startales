/**
 * Test script for WhoseApp conversational functionality
 * Tests STT/TTS, console errors, and UI interactions
 */

import { chromium } from 'playwright';

async function testWhoseAppConversation() {
  console.log('🚀 Starting WhoseApp Conversational Test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for visibility
  });
  
  const context = await browser.newContext({
    permissions: ['microphone'] // Grant microphone permission
  });
  
  const page = await context.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text, timestamp: new Date().toISOString() });
    console.log(`[${type.toUpperCase()}] ${text}`);
  });
  
  // Collect errors
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error('❌ Page Error:', error.message);
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    console.log('🔍 Looking for WhoseApp button...');
    // Try to find WhoseApp in the left menu first
    const leftMenuWhoseApp = page.locator('[data-testid="left-menu"] button:has-text("WhoseApp")');
    if (await leftMenuWhoseApp.count() > 0) {
      console.log('📱 Clicking WhoseApp in left menu...');
      await leftMenuWhoseApp.click();
    } else {
      // Try right panel
      console.log('📱 Looking for WhoseApp in right panel...');
      const rightPanelWhoseApp = page.locator('[data-testid="right-panel"] button:has-text("WhoseApp")');
      if (await rightPanelWhoseApp.count() > 0) {
        await rightPanelWhoseApp.click();
      } else {
        // Try any WhoseApp button
        console.log('📱 Looking for any WhoseApp button...');
        await page.click('text=WhoseApp');
      }
    }
    
    // Wait for WhoseApp to load
    console.log('⏳ Waiting for WhoseApp interface...');
    await page.waitForSelector('.whoseapp-main', { timeout: 10000 });
    
    console.log('✅ WhoseApp loaded successfully!');
    
    // Look for the mic button next to send
    console.log('🎤 Looking for mic button...');
    const micButton = page.locator('button:has-text("🎤")');
    
    if (await micButton.count() > 0) {
      console.log('✅ Mic button found!');
      
      // Test clicking the mic button
      console.log('🎤 Testing mic button click...');
      await micButton.click();
      
      // Wait a moment for voice mode to activate
      await page.waitForTimeout(2000);
      
      // Check if voice mode is active (button should change to 🔴 or similar)
      const isListening = await page.locator('button:has-text("🔴")').count() > 0;
      console.log(`🎤 Voice mode active: ${isListening}`);
      
      // Click again to stop
      if (isListening) {
        console.log('🔇 Stopping voice mode...');
        await page.click('button:has-text("🔴")');
      }
      
    } else {
      console.log('❌ Mic button not found');
    }
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'tests/screenshots/whoseapp_conversation_test.png', fullPage: true });
    
    console.log('📊 Test Summary:');
    console.log(`- Console Messages: ${consoleMessages.length}`);
    console.log(`- Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('❌ Errors found:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // Filter and show relevant console messages
    const relevantMessages = consoleMessages.filter(msg => 
      msg.text.includes('🎤') || 
      msg.text.includes('voice') || 
      msg.text.includes('STT') || 
      msg.text.includes('TTS') ||
      msg.text.includes('error') ||
      msg.text.includes('WhoseApp')
    );
    
    if (relevantMessages.length > 0) {
      console.log('📝 Relevant Console Messages:');
      relevantMessages.forEach(msg => 
        console.log(`  [${msg.type}] ${msg.text}`)
      );
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testWhoseAppConversation().catch(console.error);
