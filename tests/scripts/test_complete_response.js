import { chromium } from 'playwright';

async function testCompleteResponse() {
  console.log('🎯 Testing Complete AI Response (No Cut-off)...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let ttsStarted = false;
  let ttsCompleted = false;
  let ttsTimeout = false;
  let responseCutOff = false;
  
  // Collect console messages and track TTS events
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Track TTS events
    if (text.includes('🎭 Starting EXCLUSIVE character voice synthesis')) {
      ttsStarted = true;
      console.log('[TTS START] ✅ Character voice synthesis started');
    }
    
    if (text.includes('✅ TTS completed for:')) {
      ttsCompleted = true;
      console.log('[TTS COMPLETE] ✅ TTS completed successfully');
    }
    
    if (text.includes('⚠️ TTS timeout')) {
      ttsTimeout = true;
      console.log('[TTS TIMEOUT] ❌ TTS timed out');
    }
    
    if (text.includes('🕐 Setting TTS timeout')) {
      console.log('[TTS TIMEOUT SET]', text);
    }
    
    // Check for response completion
    if (text.includes('✅ Character voice synthesis completed successfully')) {
      console.log('[RESPONSE COMPLETE] ✅ Full response completed');
    }
    
    // Check for interruptions or cut-offs
    if (text.includes('cancelled') || text.includes('interrupted') || text.includes('stopped')) {
      responseCutOff = true;
      console.log('[RESPONSE CUT] ❌ Response was interrupted:', text);
    }
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    await page.waitForTimeout(5000);
    
    console.log('🔍 Opening WhoseApp...');
    const whoseAppButtons = await page.locator('text=WhoseApp').all();
    if (whoseAppButtons.length > 0) {
      await whoseAppButtons[0].click();
      await page.waitForTimeout(3000);
      
      // Find and click on a conversation
      const conversationElements = await page.locator('[class*="conversation"], [class*="character"]').all();
      if (conversationElements.length > 0) {
        await conversationElements[0].click();
        await page.waitForTimeout(2000);
        
        console.log('🎯 Testing complete AI response...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Send a message that should generate a long response
          console.log('📤 Sending message to trigger long AI response...');
          await messageInput.fill('Give me a detailed briefing on our current galactic situation, including all major threats and opportunities');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            await sendButtons[0].click();
            
            console.log('⏳ Monitoring complete response for 30 seconds...');
            
            const startTime = Date.now();
            const monitorDuration = 30000; // 30 seconds
            
            // Monitor for AI speaking indicator
            let aiSpeakingDetected = false;
            const checkAISpeaking = async () => {
              const aiSpeakingIndicator = page.locator('text=AI Speaking...');
              const isVisible = await aiSpeakingIndicator.isVisible().catch(() => false);
              if (isVisible && !aiSpeakingDetected) {
                aiSpeakingDetected = true;
                console.log('[AI SPEAKING] ✅ AI speaking indicator appeared');
              }
              return isVisible;
            };
            
            // Check periodically for AI speaking status
            const speakingCheckInterval = setInterval(async () => {
              await checkAISpeaking();
            }, 1000);
            
            await page.waitForTimeout(monitorDuration);
            clearInterval(speakingCheckInterval);
            
            // Final check
            const stillSpeaking = await checkAISpeaking();
            
            console.log(`\n🎯 Complete Response Test Results:`);
            console.log(`- TTS started: ${ttsStarted ? '✅ YES' : '❌ NO'}`);
            console.log(`- TTS completed: ${ttsCompleted ? '✅ YES' : '❌ NO'}`);
            console.log(`- TTS timeout: ${ttsTimeout ? '❌ YES' : '✅ NO'}`);
            console.log(`- Response cut off: ${responseCutOff ? '❌ YES' : '✅ NO'}`);
            console.log(`- AI speaking detected: ${aiSpeakingDetected ? '✅ YES' : '❌ NO'}`);
            console.log(`- Still speaking: ${stillSpeaking ? '⚠️ YES' : '✅ NO'}`);
            
            // Check for messages in the conversation
            const messageElements = await page.locator('[class*="message"]').all();
            console.log(`- Total messages: ${messageElements.length}`);
            
            // Look for timeout or completion messages
            const timeoutMessages = consoleMessages.filter(msg => 
              msg.timestamp > startTime && 
              (msg.text.includes('timeout') || msg.text.includes('TTS completed'))
            );
            
            console.log(`- TTS status messages: ${timeoutMessages.length}`);
            
            if (timeoutMessages.length > 0) {
              console.log('\n📊 TTS Status Messages:');
              timeoutMessages.forEach(msg => {
                console.log(`  ${msg.text}`);
              });
            }
            
            // Final assessment
            console.log(`\n🏆 COMPLETE RESPONSE ASSESSMENT:`);
            
            const responseWorking = ttsStarted && 
                                  ttsCompleted && 
                                  !ttsTimeout && 
                                  !responseCutOff &&
                                  aiSpeakingDetected;
            
            if (responseWorking) {
              console.log('✅ COMPLETE RESPONSE SYSTEM WORKING');
              console.log('✅ TTS starts and completes successfully');
              console.log('✅ No timeouts or interruptions');
              console.log('✅ AI speaking indicator functioning');
              console.log('\n🎉 Responses should no longer be cut short!');
            } else {
              console.log('❌ Complete response system needs improvement');
              if (!ttsStarted) console.log('❌ TTS not starting');
              if (!ttsCompleted) console.log('❌ TTS not completing');
              if (ttsTimeout) console.log('❌ TTS timing out');
              if (responseCutOff) console.log('❌ Response being cut off');
              if (!aiSpeakingDetected) console.log('❌ AI speaking indicator not working');
            }
            
            // Show recent TTS activity
            console.log(`\n📊 Recent TTS Activity:`);
            const ttsActivity = consoleMessages.filter(msg => 
              msg.timestamp > startTime && 
              (msg.text.includes('TTS') || msg.text.includes('🎭') || msg.text.includes('synthesis'))
            ).slice(-8);
            
            ttsActivity.forEach(msg => {
              console.log(`  ${msg.text.substring(0, 80)}...`);
            });
            
          } else {
            console.log('❌ Send button not found');
          }
        } else {
          console.log('❌ Message input not found');
        }
      } else {
        console.log('❌ No conversation elements found');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/complete_response.png', 
        fullPage: true 
      });
      
    } else {
      console.log('❌ WhoseApp button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testCompleteResponse().catch(console.error);
