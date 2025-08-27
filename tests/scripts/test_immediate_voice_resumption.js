import { chromium } from 'playwright';

async function testImmediateVoiceResumption() {
  console.log('⚡ Testing Immediate Voice Resumption...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let speechCompletedTime = null;
  let voiceResumedTime = null;
  let resumptionDelay = null;
  
  // Collect console messages and track timing
  page.on('console', msg => {
    const text = msg.text();
    const timestamp = Date.now();
    consoleMessages.push({ text, timestamp });
    
    // Track speech completion
    if (text.includes('🎤 Speech synthesis finished - ready for immediate voice input')) {
      speechCompletedTime = timestamp;
      console.log('[SPEECH COMPLETE] ✅ Speech synthesis finished');
    }
    
    // Track voice resumption
    if (text.includes('🎤 Voice listening resumed immediately')) {
      voiceResumedTime = timestamp;
      console.log('[VOICE RESUMED] ✅ Voice listening resumed');
      
      // Calculate delay
      if (speechCompletedTime) {
        resumptionDelay = voiceResumedTime - speechCompletedTime;
        console.log(`[TIMING] ⚡ Resumption delay: ${resumptionDelay}ms`);
      }
    }
    
    // Track immediate resumption messages
    if (text.includes('immediately resuming voice listening')) {
      console.log('[IMMEDIATE RESUME] ✅ Immediate resumption initiated');
    }
    
    // Track any delays
    if (text.includes('Minimal 100ms delay')) {
      console.log('[MINIMAL DELAY] ✅ Using minimal delay for cleanup');
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
        
        console.log('⚡ Testing immediate voice resumption...');
        
        // Find message input and voice button
        const messageInput = await page.locator('input, textarea').first();
        const voiceButtons = await page.locator('button').filter({ hasText: /🎤/ }).all();
        
        if (await messageInput.isVisible() && voiceButtons.length > 0) {
          
          // Enable voice mode
          console.log('\n🎤 Enabling voice mode...');
          await voiceButtons[0].click();
          await page.waitForTimeout(2000);
          
          const buttonText = await voiceButtons[0].textContent();
          console.log(`🎤 Voice button state: "${buttonText}"`);
          
          if (buttonText && buttonText.includes('Listening')) {
            console.log('✅ Voice mode activated');
            
            // Send message to trigger AI response and test resumption timing
            console.log('\n📤 Sending message to test immediate resumption...');
            await messageInput.fill('Give me a brief status update');
            
            const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
            if (sendButtons.length > 0) {
              // Reset timing variables
              speechCompletedTime = null;
              voiceResumedTime = null;
              resumptionDelay = null;
              
              await sendButtons[0].click();
              
              console.log('⏳ Monitoring immediate resumption timing...');
              await page.waitForTimeout(20000); // Wait for AI response and resumption
              
              // Analysis
              console.log(`\n⚡ Immediate Resumption Results:`);
              console.log(`- Speech completion detected: ${speechCompletedTime ? '✅ YES' : '❌ NO'}`);
              console.log(`- Voice resumption detected: ${voiceResumedTime ? '✅ YES' : '❌ NO'}`);
              
              if (resumptionDelay !== null) {
                console.log(`- Resumption delay: ${resumptionDelay}ms`);
                
                if (resumptionDelay < 1000) {
                  console.log('✅ EXCELLENT: Sub-second resumption');
                } else if (resumptionDelay < 2000) {
                  console.log('✅ GOOD: Under 2 second resumption');
                } else if (resumptionDelay < 5000) {
                  console.log('⚠️ ACCEPTABLE: Under 5 second resumption');
                } else {
                  console.log('❌ TOO SLOW: Over 5 second resumption');
                }
              } else {
                console.log('❌ Could not measure resumption delay');
              }
              
              // Check if voice mode is still active
              const finalButtonText = await voiceButtons[0].textContent();
              const voiceStillActive = finalButtonText && finalButtonText.includes('Listening');
              console.log(`- Voice mode still active: ${voiceStillActive ? '✅ YES' : '❌ NO'}`);
              
              // Final assessment
              console.log(`\n🏆 IMMEDIATE RESUMPTION ASSESSMENT:`);
              
              const immediateResumptionWorking = speechCompletedTime && 
                                               voiceResumedTime && 
                                               resumptionDelay !== null && 
                                               resumptionDelay < 2000 &&
                                               voiceStillActive;
              
              if (immediateResumptionWorking) {
                console.log('✅ IMMEDIATE VOICE RESUMPTION WORKING PERFECTLY');
                console.log('✅ Voice resumes immediately after AI speech');
                console.log('✅ Natural conversation flow achieved');
                console.log('✅ No unnecessary delays');
                console.log('\n⚡ You can now have instant back-and-forth conversations!');
              } else {
                console.log('❌ Immediate resumption needs improvement');
                if (!speechCompletedTime || !voiceResumedTime) {
                  console.log('❌ Speech completion or resumption not detected');
                }
                if (resumptionDelay === null || resumptionDelay >= 2000) {
                  console.log('❌ Resumption delay too long or not measured');
                }
                if (!voiceStillActive) {
                  console.log('❌ Voice mode not staying active');
                }
              }
              
              // Show timing events
              console.log(`\n📊 Timing Events:`);
              const timingEvents = consoleMessages.filter(msg => 
                msg.text.includes('Speech synthesis finished') || 
                msg.text.includes('Voice listening resumed') ||
                msg.text.includes('immediately resuming') ||
                msg.text.includes('Minimal') ||
                msg.text.includes('ready for immediate')
              );
              
              timingEvents.forEach(msg => {
                const relativeTime = speechCompletedTime ? 
                  `+${msg.timestamp - speechCompletedTime}ms` : 
                  'baseline';
                console.log(`  ${relativeTime}: ${msg.text.substring(0, 70)}...`);
              });
              
            } else {
              console.log('❌ Send button not found');
            }
          } else {
            console.log('❌ Voice mode not activated');
          }
        } else {
          console.log('❌ Message input or voice button not found');
        }
      } else {
        console.log('❌ No conversation elements found');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/immediate_voice_resumption.png', 
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

testImmediateVoiceResumption().catch(console.error);
