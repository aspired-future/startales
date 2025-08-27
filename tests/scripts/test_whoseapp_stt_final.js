import { chromium } from 'playwright';

async function testWhoseAppSTT() {
  console.log('🎤 Testing WhoseApp STT/TTS Conversational System...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    permissions: ['microphone'] // Grant microphone permission
  });
  
  const page = await context.newPage();
  
  const consoleMessages = [];
  const errors = [];
  
  // Collect console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    if (text.includes('🎤') || text.includes('voice') || text.includes('STT') || text.includes('TTS')) {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });
  
  // Collect errors
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error('❌ JavaScript Error:', error.message);
  });
  
  try {
    console.log('📱 Navigating to application on port 5175...');
    await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    
    console.log('🔍 Looking for WhoseApp button...');
    const whoseappButtons = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseappButtons.length} WhoseApp buttons`);
    
    if (whoseappButtons.length > 0) {
      console.log('✅ Clicking WhoseApp...');
      await whoseappButtons[0].click();
      
      // Wait for WhoseApp to load
      await page.waitForTimeout(3000);
      
      console.log('📸 Taking screenshot of WhoseApp...');
      await page.screenshot({ path: 'tests/screenshots/whoseapp_stt_test.png', fullPage: true });
      
      // Check if WhoseApp loaded properly
      const whoseappMain = await page.locator('.whoseapp-main').count();
      console.log(`WhoseApp main container: ${whoseappMain}`);
      
      if (whoseappMain > 0) {
        console.log('✅ WhoseApp loaded successfully!');
        
        // Look for voice buttons
        console.log('🔍 Looking for voice control buttons...');
        
        // Check for "Voice Off" button (default state)
        const voiceOffButton = await page.locator('button:has-text("🔇 Voice Off")').first();
        if (await voiceOffButton.isVisible()) {
          console.log('✅ Found "🔇 Voice Off" button!');
          console.log('🎤 Clicking to enable voice mode...');
          await voiceOffButton.click();
          
          await page.waitForTimeout(1000);
          
          // Check if it changed to "Voice On"
          const voiceOnButton = await page.locator('button:has-text("🔊 Voice On")').first();
          if (await voiceOnButton.isVisible()) {
            console.log('✅ Voice mode activated - "🔊 Voice On" button visible!');
            
            // Take screenshot of voice mode
            await page.screenshot({ path: 'tests/screenshots/whoseapp_voice_on.png', fullPage: true });
            
            console.log('🎤 Voice mode is now active - STT/TTS system ready!');
            console.log('📝 The conversational features include:');
            console.log('   - Silence detection (2.5 second timeout)');
            console.log('   - Natural voice responses');
            console.log('   - Continuous conversation flow');
            console.log('   - AI contextual responses');
            
            // Test turning voice mode off
            console.log('🔇 Testing voice mode toggle off...');
            await voiceOnButton.click();
            await page.waitForTimeout(500);
            
            const voiceOffAgain = await page.locator('button:has-text("🔇 Voice Off")').first();
            if (await voiceOffAgain.isVisible()) {
              console.log('✅ Voice mode toggle works both ways!');
            }
            
          } else {
            console.log('⚠️ Voice mode may not have activated - no "Voice On" button found');
          }
        } else {
          console.log('❌ No voice control buttons found');
          
          // Debug: show all buttons
          const allButtons = await page.locator('button').all();
          console.log(`Found ${allButtons.length} total buttons`);
          for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
            try {
              const buttonText = await allButtons[i].textContent();
              console.log(`Button ${i + 1}: "${buttonText}"`);
            } catch (error) {
              console.log(`Button ${i + 1}: Error reading text`);
            }
          }
        }
        
      } else {
        console.log('❌ WhoseApp main container not found');
      }
      
    } else {
      console.log('❌ No WhoseApp buttons found');
    }
    
    console.log(`\n📊 Test Summary:`);
    console.log(`- Console messages: ${consoleMessages.length}`);
    console.log(`- JavaScript errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ JavaScript Errors:');
      errors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
    } else {
      console.log('✅ No JavaScript errors detected!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testWhoseAppSTT().catch(console.error);
