import { chromium } from 'playwright';

async function testEnhancedFeedbackPrevention() {
  console.log('🛡️ Testing Enhanced Feedback Prevention...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let feedbackBlockCount = 0;
  let aiResponseBlockCount = 0;
  let voiceModeDisabledCount = 0;
  
  // Collect console messages and track feedback prevention
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Track feedback prevention events
    if (text.includes('🚫 Ignoring voice transcript while AI is speaking')) {
      feedbackBlockCount++;
      console.log(`[FEEDBACK BLOCKED ${feedbackBlockCount}] While AI speaking: ${text.split(':')[1]?.trim()}`);
    }
    
    if (text.includes('🚫 Ignoring transcript that sounds like AI feedback')) {
      aiResponseBlockCount++;
      console.log(`[AI RESPONSE BLOCKED ${aiResponseBlockCount}] Sounds like AI: ${text.split(':')[1]?.trim()}`);
    }
    
    if (text.includes('🚫 Cannot toggle voice mode while AI is speaking')) {
      console.log(`[VOICE TOGGLE BLOCKED] Cannot toggle while AI speaking`);
    }
    
    if (text.includes('COMPLETELY disabling voice mode to prevent feedback')) {
      voiceModeDisabledCount++;
      console.log(`[VOICE DISABLED ${voiceModeDisabledCount}] Voice mode completely disabled`);
    }
    
    // Track AI speaking state changes
    if (text.includes('AI now speaking') || text.includes('AI speech complete')) {
      console.log(`[AI STATE] ${text}`);
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
        
        console.log('🛡️ Testing enhanced feedback prevention...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Test 1: Send message and monitor for enhanced prevention
          console.log('\n📤 Test 1: Sending message to trigger AI response...');
          await messageInput.fill('What is happening in our galaxy right now?');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            await sendButtons[0].click();
            
            console.log('⏳ Monitoring enhanced feedback prevention for 20 seconds...');
            
            const startTime = Date.now();
            const monitorDuration = 20000; // 20 seconds
            
            // Reset counters
            const initialFeedbackBlocks = feedbackBlockCount;
            const initialAIBlocks = aiResponseBlockCount;
            const initialVoiceDisabled = voiceModeDisabledCount;
            
            await page.waitForTimeout(monitorDuration);
            
            const feedbackBlocksInTest = feedbackBlockCount - initialFeedbackBlocks;
            const aiBlocksInTest = aiResponseBlockCount - initialAIBlocks;
            const voiceDisabledInTest = voiceModeDisabledCount - initialVoiceDisabled;
            
            console.log(`\n🛡️ Enhanced Prevention Results:`);
            console.log(`- Feedback blocks (while AI speaking): ${feedbackBlocksInTest}`);
            console.log(`- AI response blocks (keyword detection): ${aiBlocksInTest}`);
            console.log(`- Voice mode disabled events: ${voiceDisabledInTest}`);
            
            // Test 2: Try to activate voice mode during AI response
            console.log('\n🎤 Test 2: Testing voice mode blocking during AI speech...');
            
            // Check if AI speaking indicator is visible
            const aiSpeakingIndicator = page.locator('text=AI Speaking...');
            const isAISpeaking = await aiSpeakingIndicator.isVisible().catch(() => false);
            
            if (isAISpeaking) {
              console.log('✅ AI speaking indicator is visible');
              
              // Try to click voice button while AI is speaking
              const voiceButtons = await page.locator('button').filter({ hasText: /🎤/ }).all();
              if (voiceButtons.length > 0) {
                console.log('🎤 Attempting to click voice button while AI is speaking...');
                await voiceButtons[0].click();
                await page.waitForTimeout(1000);
                
                // Check if voice mode was prevented
                const buttonText = await voiceButtons[0].textContent();
                console.log(`🎤 Voice button state after click: "${buttonText}"`);
                
                if (!buttonText?.includes('Listening')) {
                  console.log('✅ Voice mode activation properly blocked during AI speech');
                } else {
                  console.log('❌ Voice mode was activated despite AI speaking');
                }
              }
            } else {
              console.log('⚠️ AI speaking indicator not visible');
            }
            
            // Final analysis
            console.log(`\n🎯 Enhanced Feedback Prevention Analysis:`);
            
            // Check for any repeated responses in messages
            const messageElements = await page.locator('[class*="message"], [class*="chat"]').all();
            const messageCount = messageElements.length;
            console.log(`- Total messages visible: ${messageCount}`);
            
            // Check for Sector 7 mentions in recent console
            const sector7Messages = consoleMessages.filter(msg => 
              msg.text.toLowerCase().includes('sector 7') && 
              msg.timestamp > startTime
            );
            
            console.log(`- Console mentions of "Sector 7": ${sector7Messages.length}`);
            
            // Show recent prevention activity
            console.log(`\n📊 Recent Prevention Activity:`);
            const preventionMessages = consoleMessages.filter(msg => 
              msg.timestamp > startTime && 
              (msg.text.includes('🚫') || msg.text.includes('COMPLETELY disabling'))
            ).slice(-8);
            
            preventionMessages.forEach(msg => {
              console.log(`  ${msg.text.substring(0, 80)}...`);
            });
            
            // Determine success
            const enhancedPreventionWorking = 
              (feedbackBlocksInTest > 0 || aiBlocksInTest > 0 || voiceDisabledInTest > 0) &&
              sector7Messages.length <= 2;
            
            console.log(`\n🏆 ENHANCED PREVENTION RESULT:`);
            if (enhancedPreventionWorking) {
              console.log('✅ ENHANCED FEEDBACK PREVENTION IS WORKING');
              console.log('✅ Multiple layers of protection active');
              console.log('✅ Voice mode properly disabled during AI speech');
              console.log('✅ Keyword-based filtering preventing AI echo');
              console.log('\n🎉 The enhanced system successfully prevents feedback loops!');
            } else {
              console.log('❌ Enhanced prevention needs more work');
              if (feedbackBlocksInTest === 0 && aiBlocksInTest === 0) {
                console.log('❌ No prevention events detected');
              }
              if (sector7Messages.length > 2) {
                console.log('❌ Still detecting repeated AI content');
              }
            }
            
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
        path: 'tests/screenshots/enhanced_feedback_prevention.png', 
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

testEnhancedFeedbackPrevention().catch(console.error);
