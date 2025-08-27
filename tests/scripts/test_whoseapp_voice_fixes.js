import { chromium } from 'playwright';

async function testWhoseAppVoiceFixes() {
  console.log('🎤 Testing WhoseApp Voice Fixes...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  const networkRequests = [];
  
  // Collect console messages and network requests
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    // Log voice and Character AI related messages
    if (text.includes('Character AI') || text.includes('Speaking AI') || 
        text.includes('voice') || text.includes('TTS') || text.includes('STT') ||
        text.includes('interact-aware') || text.includes('🔊') || text.includes('🎤')) {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/characters/') && url.includes('interact-aware')) {
      networkRequests.push({
        method: request.method(),
        url: url,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(3000);
    
    console.log('🔍 Opening WhoseApp...');
    
    // Find WhoseApp button
    const whoseAppButtons = await page.locator('text=WhoseApp').all();
    if (whoseAppButtons.length > 0) {
      await whoseAppButtons[0].click();
      await page.waitForTimeout(3000);
      
      console.log('🎯 Testing Voice Controls...');
      
      // Check for duplicate voice controls (should NOT exist)
      const recordButtons = await page.locator('text=Record').all();
      const stopButtons = await page.locator('text=Stop').all();
      
      console.log(`\n🔍 Voice Controls Analysis:`);
      console.log(`- Record buttons found: ${recordButtons.length} (should be 0)`);
      console.log(`- Stop buttons found: ${stopButtons.length} (should be 0)`);
      
      if (recordButtons.length === 0 && stopButtons.length === 0) {
        console.log('✅ Duplicate voice controls successfully removed');
      } else {
        console.log('❌ Duplicate voice controls still present');
      }
      
      // Check for the mic button next to send (should show ⌨️ when off, 🎤 when on)
      const micButtons = await page.locator('button').filter({ hasText: /⌨️|🎤/ }).all();
      console.log(`- Mic buttons found: ${micButtons.length} (should be 1)`);
      
      if (micButtons.length > 0) {
        console.log('✅ Mic button next to Send found');
        
        // Test voice mode toggle
        console.log('🎤 Testing voice mode toggle...');
        await micButtons[0].click();
        await page.waitForTimeout(2000);
        
        // Check if voice mode is active
        const voiceStatus = await page.locator('text=Voice controls ready').all();
        console.log(`- Voice status indicators: ${voiceStatus.length}`);
        
        // Test sending a voice message
        console.log('💬 Testing voice conversation...');
        const messageInput = await page.locator('input[placeholder*="Message"]').first();
        if (await messageInput.isVisible()) {
          await messageInput.fill('what do you think of the latest civilization developments?');
          
          // Find and click send button
          const sendButtons = await page.locator('text=Send').all();
          if (sendButtons.length > 0) {
            await sendButtons[0].click();
            console.log('📤 Message sent, waiting for Character AI response...');
            
            // Wait for Character AI response
            await page.waitForTimeout(8000);
            
            // Check for Character AI API calls
            const characterAICalls = networkRequests.filter(req => 
              req.url.includes('interact-aware')
            );
            
            console.log(`\n🤖 Character AI Integration:`);
            console.log(`- Character AI API calls: ${characterAICalls.length}`);
            
            if (characterAICalls.length > 0) {
              console.log('✅ Character AI integration working');
              characterAICalls.forEach(call => {
                console.log(`  - API Call: ${call.method} ${call.url}`);
              });
            } else {
              console.log('❌ No Character AI API calls detected');
            }
            
            // Check for voice-related console messages
            const voiceMessages = consoleMessages.filter(msg => 
              msg.text.includes('Speaking AI') || 
              msg.text.includes('TTS') ||
              msg.text.includes('Character AI response') ||
              msg.text.includes('🔊') ||
              msg.text.includes('voice')
            );
            
            console.log(`\n🔊 Voice Processing:`);
            console.log(`- Voice-related messages: ${voiceMessages.length}`);
            
            if (voiceMessages.length > 0) {
              console.log('✅ Voice processing detected:');
              voiceMessages.slice(0, 5).forEach(msg => console.log(`  - ${msg.text}`));
            } else {
              console.log('❌ No voice processing messages found');
            }
            
            // Check for voice output processing
            const voiceOutputMessages = consoleMessages.filter(msg => 
              msg.text.includes('✅ AI response spoken') || 
              msg.text.includes('✅ Basic TTS fallback') ||
              msg.text.includes('🔊 Speaking AI response')
            );
            
            console.log(`- Voice output messages: ${voiceOutputMessages.length}`);
            if (voiceOutputMessages.length > 0) {
              console.log('✅ Voice output working');
            } else {
              console.log('❌ Voice output not detected');
            }
            
            // Check for messages in the conversation
            const messageElements = await page.locator('.message, .chat-message, [class*="message"]').all();
            console.log(`\n💬 Conversation Analysis:`);
            console.log(`- Messages displayed: ${messageElements.length}`);
            
            if (messageElements.length >= 2) {
              console.log('✅ Conversation flow working (user + AI response)');
            } else {
              console.log('❌ Missing AI response in conversation');
            }
          }
        }
      } else {
        console.log('❌ Mic button not found');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/whoseapp_voice_fixes.png', 
        fullPage: true 
      });
      
      console.log(`\n🎯 WhoseApp Voice Fixes Summary:`);
      if (recordButtons.length === 0 && stopButtons.length === 0) {
        console.log('✅ Duplicate voice controls removed');
      } else {
        console.log('❌ Duplicate voice controls still present');
      }
      
      if (micButtons.length > 0) {
        console.log('✅ Single mic button next to Send working');
      } else {
        console.log('❌ Mic button missing');
      }
      
      if (networkRequests.length > 0) {
        console.log('✅ Character AI integration active');
      } else {
        console.log('❌ Character AI integration not working');
      }
      
      const voiceOutputMessages = consoleMessages.filter(msg => 
        msg.text.includes('✅ AI response spoken') || 
        msg.text.includes('✅ Basic TTS fallback') ||
        msg.text.includes('🔊 Speaking AI response')
      );
      
      if (voiceOutputMessages.length > 0) {
        console.log('✅ Voice output processing detected');
      } else {
        console.log('❌ Voice output not working');
      }
      
    } else {
      console.log('❌ WhoseApp button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testWhoseAppVoiceFixes().catch(console.error);
