import { test, expect } from '@playwright/test';

test.describe('Voice Functionality Debug', () => {
  test('Debug voice transcription and AI response issues', async ({ page }) => {
    // Capture all console messages and network requests
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    await page.goto('http://localhost:5175');
    await page.waitForLoadState('networkidle');
    
    console.log('=== STEP 1: Open WhoseApp ===');
    
    // Click WhoseApp
    const whoseAppButton = page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' });
    await whoseAppButton.click();
    await page.waitForTimeout(3000);
    
    console.log('=== STEP 2: Click Call button to test voice ===');
    
    // Click on CHARACTERS tab first to see the characters
    const charactersTab = page.locator('text=CHARACTERS');
    if (await charactersTab.count() > 0) {
      await charactersTab.click();
      await page.waitForTimeout(2000);
    }
    
    // Find and click a Call button
    const callButton = page.locator('button:has-text("📞 Call")').first();
    
    if (await callButton.count() > 0) {
      console.log('Call button found, clicking...');
      
      await callButton.click();
      await page.waitForTimeout(3000);
      
      console.log('=== STEP 3: Check voice interface elements ===');
      
      // Look for voice interface elements
      const voiceElements = await page.locator('text=Switch to Voice, text=Voice mode, text=Start Call, text=End Call').all();
      console.log(`Found ${voiceElements.length} voice interface elements`);
      
      // Check for microphone permission prompts
      const micElements = await page.locator('text=microphone, text=permission, text=Allow').all();
      console.log(`Found ${micElements.length} microphone permission elements`);
      
      // Look for "Switch to Voice" button
      const switchToVoiceBtn = page.locator('button:has-text("Switch to Voice")');
      if (await switchToVoiceBtn.count() > 0) {
        console.log('=== STEP 4: Click Switch to Voice ===');
        await switchToVoiceBtn.click();
        await page.waitForTimeout(2000);
        
        // Check what happens after switching to voice
        const voiceActiveElements = await page.locator('text=Listening, text=Recording, text=Voice active').all();
        console.log(`Found ${voiceActiveElements.length} voice active indicators`);
      }
      
      // Take screenshot
      await page.screenshot({ path: 'temp_dev/voice-interface-debug.png', fullPage: true });
      
    } else {
      console.log('❌ No Call button found');
      
      // Take screenshot to see what's available
      await page.screenshot({ path: 'temp_dev/no-call-button-debug.png', fullPage: true });
    }
    
    console.log('=== STEP 5: Test direct API calls ===');
    
    // Test STT service directly from browser
    await page.evaluate(async () => {
      try {
        console.log('Testing STT service from browser...');
        const response = await fetch('http://localhost:4000/api/stt/health');
        const data = await response.json();
        console.log('STT Health Response:', data);
      } catch (error) {
        console.error('STT Health Error:', error);
      }
      
      try {
        console.log('Testing AI service from browser...');
        const response = await fetch('http://localhost:4000/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'Hello, test message' })
        });
        const data = await response.json();
        console.log('AI Generate Response:', data);
      } catch (error) {
        console.error('AI Generate Error:', error);
      }
    });
    
    await page.waitForTimeout(2000);
  });
});
