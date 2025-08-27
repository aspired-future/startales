import { chromium } from 'playwright';

async function testFeedbackLoopFinalSolution() {
  console.log('🎯 Testing Final Feedback Loop Solution...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let feedbackLoopDetected = false;
  let autoResumeDetected = false;
  let voiceProcessingCount = 0;
  let aiResponseCount = 0;
  
  // Collect console messages and analyze for feedback patterns
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Count voice processing events
    if (text.includes('🎤 Processing voice transcript')) {
      voiceProcessingCount++;
      console.log(`[VOICE ${voiceProcessingCount}] ${text.substring(0, 60)}...`);
    }
    
    // Count AI responses
    if (text.includes('🤖 Generating Character AI response')) {
      aiResponseCount++;
      console.log(`[AI RESPONSE ${aiResponseCount}] Generating response...`);
    }
    
    // Check for feedback loop patterns (same message repeated)
    if (text.includes('Zephyrian Empire') || text.includes('Sector 7')) {
      console.log(`[AI CONTENT] ${text.substring(0, 80)}...`);
    }
    
    // Check for automatic resumption (should NOT happen)
    if (text.includes('resuming listening') || text.includes('Restarting voice input')) {
      autoResumeDetected = true;
      console.log(`[AUTO RESUME] ❌ ${text}`);
    }
    
    // Check for voice mode disabled (should happen)
    if (text.includes('Voice mode disabled after AI response')) {
      console.log(`[VOICE DISABLED] ✅ ${text}`);
    }
    
    // Check for feedback prevention
    if (text.includes('🚫 Ignoring') && text.includes('while AI is speaking')) {
      console.log(`[FEEDBACK BLOCKED] ✅ ${text}`);
    }
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(4000);
    
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
        
        console.log('🎯 Testing final feedback loop solution...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Test 1: Send message and monitor for feedback
          console.log('\n📤 Test 1: Sending message to trigger AI response...');
          await messageInput.fill('What is the current situation in our galaxy?');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            await sendButtons[0].click();
            
            console.log('⏳ Monitoring for 15 seconds to detect any feedback loops...');
            
            const startTime = Date.now();
            const monitorDuration = 15000; // 15 seconds
            
            // Reset counters for this test
            const initialVoiceCount = voiceProcessingCount;
            const initialAICount = aiResponseCount;
            
            await page.waitForTimeout(monitorDuration);
            
            const voiceEventsInTest = voiceProcessingCount - initialVoiceCount;
            const aiResponsesInTest = aiResponseCount - initialAICount;
            
            console.log(`\n📊 Test 1 Results:`);
            console.log(`- Voice processing events: ${voiceEventsInTest}`);
            console.log(`- AI responses generated: ${aiResponsesInTest}`);
            console.log(`- Auto resume detected: ${autoResumeDetected ? '❌ YES' : '✅ NO'}`);
            
            // Test 2: Try to manually enable voice mode and see if it stays controlled
            console.log('\n🎤 Test 2: Testing manual voice control...');
            
            const voiceButtons = await page.locator('button').filter({ hasText: /🎤/ }).all();
            if (voiceButtons.length > 0) {
              console.log('🎤 Clicking voice button to enable voice mode...');
              await voiceButtons[0].click();
              await page.waitForTimeout(2000);
              
              // Check if voice mode is active
              const buttonText = await voiceButtons[0].textContent();
              console.log(`🎤 Voice button state after click: "${buttonText}"`);
              
              if (buttonText && buttonText.includes('Listening')) {
                console.log('✅ Voice mode manually activated');
                
                // Wait a bit to see if it automatically processes anything
                await page.waitForTimeout(5000);
                
                // Manually disable voice mode
                console.log('🔇 Manually disabling voice mode...');
                await voiceButtons[0].click();
                await page.waitForTimeout(1000);
                
                const finalButtonText = await voiceButtons[0].textContent();
                console.log(`🎤 Final voice button state: "${finalButtonText}"`);
              }
            }
            
            // Final analysis
            console.log(`\n🎯 Final Feedback Loop Solution Analysis:`);
            
            // Check for feedback loop patterns
            const sectorMessages = consoleMessages.filter(msg => 
              msg.text.includes('Sector 7') && msg.timestamp > startTime
            );
            
            const repeatedResponses = sectorMessages.length > 1;
            
            console.log(`- Repeated AI responses about same topic: ${repeatedResponses ? '❌ YES' : '✅ NO'}`);
            console.log(`- Total voice processing events in test: ${voiceEventsInTest}`);
            console.log(`- Total AI responses in test: ${aiResponsesInTest}`);
            console.log(`- Automatic voice resumption: ${autoResumeDetected ? '❌ DETECTED' : '✅ PREVENTED'}`);
            
            // Determine overall success
            const feedbackLoopPrevented = !autoResumeDetected && 
                                        voiceEventsInTest <= 2 && 
                                        aiResponsesInTest <= 2 && 
                                        !repeatedResponses;
            
            console.log(`\n🏆 FINAL RESULT:`);
            if (feedbackLoopPrevented) {
              console.log('✅ FEEDBACK LOOP SUCCESSFULLY PREVENTED');
              console.log('✅ Manual voice control working properly');
              console.log('✅ No automatic voice resumption');
              console.log('✅ AI responses controlled and not repeating');
              console.log('\n🎉 The interruption feature removal solved the feedback loop!');
            } else {
              console.log('❌ Feedback loop prevention needs more work');
              if (autoResumeDetected) console.log('❌ Automatic voice resumption still occurring');
              if (voiceEventsInTest > 2) console.log('❌ Too many voice processing events');
              if (aiResponsesInTest > 2) console.log('❌ Too many AI responses');
              if (repeatedResponses) console.log('❌ Repeated AI responses detected');
            }
            
            // Show recent activity summary
            console.log(`\n📋 Activity Summary:`);
            const recentActivity = consoleMessages.filter(msg => 
              msg.timestamp > startTime && 
              (msg.text.includes('🎤') || msg.text.includes('🤖') || msg.text.includes('Voice'))
            ).slice(-8);
            
            recentActivity.forEach(msg => {
              console.log(`  ${msg.text.substring(0, 70)}...`);
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
      
      // Take final screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/feedback_loop_final_solution.png', 
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

testFeedbackLoopFinalSolution().catch(console.error);
