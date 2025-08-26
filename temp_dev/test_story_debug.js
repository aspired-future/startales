import { chromium } from 'playwright';

async function debugStorySystem() {
  console.log('🎬 Starting Story System Debug...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    permissions: ['microphone'] // For TTS testing
  });
  
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`🖥️ Browser Console [${msg.type()}]:`, msg.text());
  });
  
  // Enable error logging
  page.on('pageerror', error => {
    console.error('🚨 Page Error:', error.message);
  });
  
  try {
    console.log('📡 Navigating to UI...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ path: 'temp_dev/debug_01_initial.png', fullPage: true });
    
    // Wait for the app to load
    console.log('⏳ Waiting for app to load...');
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    
    // Look for the Story tab
    console.log('🔍 Looking for Story tab...');
    const storyTab = await page.locator('button:has-text("Story")').first();
    
    if (await storyTab.isVisible()) {
      console.log('✅ Story tab found, clicking...');
      await storyTab.click();
      await page.waitForTimeout(2000);
      
      console.log('📸 Taking Story tab screenshot...');
      await page.screenshot({ path: 'temp_dev/debug_02_story_tab.png', fullPage: true });
      
      // Check for story events
      console.log('🔍 Looking for story events...');
      const storyEvents = await page.locator('.story-event').count();
      console.log(`📊 Found ${storyEvents} story events`);
      
      if (storyEvents > 0) {
        // Test TTS functionality
        console.log('🎭 Testing TTS functionality...');
        const playButton = await page.locator('button:has-text("Play Narration")').first();
        
        if (await playButton.isVisible()) {
          console.log('🎤 Found TTS play button, testing...');
          
          // Check available voices
          const voices = await page.evaluate(() => {
            return speechSynthesis.getVoices().map(voice => ({
              name: voice.name,
              lang: voice.lang,
              localService: voice.localService
            }));
          });
          
          console.log('🎬 Available TTS voices:', voices);
          
          // Click play button
          await playButton.click();
          await page.waitForTimeout(1000);
          
          console.log('📸 Taking TTS test screenshot...');
          await page.screenshot({ path: 'temp_dev/debug_03_tts_test.png', fullPage: true });
          
          // Check if TTS is working
          const isSpeaking = await page.evaluate(() => {
            return speechSynthesis.speaking;
          });
          
          console.log('🔊 TTS Status - Speaking:', isSpeaking);
          
          // Stop TTS
          await page.evaluate(() => {
            speechSynthesis.cancel();
          });
          
        } else {
          console.log('❌ No TTS play button found');
        }
      } else {
        console.log('❌ No story events found');
      }
      
    } else {
      console.log('❌ Story tab not found, checking available tabs...');
      const tabs = await page.locator('.tab-button').allTextContents();
      console.log('📋 Available tabs:', tabs);
    }
    
    // Check for any error messages
    const errorMessages = await page.locator('.error, .alert-error, [class*="error"]').allTextContents();
    if (errorMessages.length > 0) {
      console.log('🚨 Found error messages:', errorMessages);
    }
    
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ path: 'temp_dev/debug_04_final.png', fullPage: true });
    
  } catch (error) {
    console.error('🚨 Debug Error:', error.message);
    await page.screenshot({ path: 'temp_dev/debug_error.png', fullPage: true });
  }
  
  console.log('🎬 Debug complete! Check temp_dev/ for screenshots.');
  await browser.close();
}

// Run the debug
debugStorySystem().catch(console.error);
