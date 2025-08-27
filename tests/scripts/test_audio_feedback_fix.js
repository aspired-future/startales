import { chromium } from 'playwright';

async function testAudioFeedbackFix() {
  console.log('🔊 Testing Audio Feedback Loop Fix...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let voiceInputCount = 0;
  let aiResponseCount = 0;
  
  // Collect console messages and track voice activity
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text, timestamp: Date.now() });
    
    // Track voice input events
    if (text.includes('Voice input processed') || text.includes('🎤')) {
      voiceInputCount++;
      console.log(`[VOICE INPUT ${voiceInputCount}] ${text}`);
    }
    
    // Track AI response events
    if (text.includes('Speaking AI response') || text.includes('🔊')) {
      aiResponseCount++;
      console.log(`[AI RESPONSE ${aiResponseCount}] ${text}`);
    }
    
    // Track audio isolation events
    if (text.includes('Pausing listening') || text.includes('Resuming listening') || 
        text.includes('🔇') || text.includes('waiting for AI response')) {
      console.log(`[AUDIO CONTROL] ${text}`);
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
        
        console.log('🎤 Testing voice conversation with feedback prevention...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Send a test message to trigger AI response
          await messageInput.fill('What is the current status?');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            console.log('📤 Sending message to trigger AI response...');
            await sendButtons[0].click();
            
            console.log('⏳ Monitoring for audio feedback loop...');
            
            // Wait and monitor for 15 seconds to see if feedback loop occurs
            const startTime = Date.now();
            const monitorDuration = 15000; // 15 seconds
            
            await page.waitForTimeout(monitorDuration);
            
            // Analyze the results
            console.log(`\n🔍 Audio Feedback Analysis (${monitorDuration/1000}s monitoring):`);
            console.log(`- Voice inputs detected: ${voiceInputCount}`);
            console.log(`- AI responses triggered: ${aiResponseCount}`);
            
            // Check for feedback loop indicators
            const feedbackMessages = consoleMessages.filter(msg => 
              msg.text.includes('military force near Sector 7') || 
              msg.text.includes('pressing diplomatic concern')
            );
            
            const audioControlMessages = consoleMessages.filter(msg => 
              msg.text.includes('Pausing listening') || 
              msg.text.includes('Resuming listening') ||
              msg.text.includes('waiting for AI response')
            );
            
            console.log(`- Potential feedback messages: ${feedbackMessages.length}`);
            console.log(`- Audio control messages: ${audioControlMessages.length}`);
            
            // Check timing between events
            const recentMessages = consoleMessages.filter(msg => 
              msg.timestamp > startTime
            );
            
            console.log(`\n📊 Recent Activity:`);
            recentMessages.slice(-10).forEach(msg => {
              const timeOffset = Math.round((msg.timestamp - startTime) / 1000);
              console.log(`  +${timeOffset}s: ${msg.text.substring(0, 80)}...`);
            });
            
            // Determine if feedback loop is fixed
            const hasFeedbackLoop = feedbackMessages.length > 2 || 
                                  (voiceInputCount > 3 && aiResponseCount > 3);
            
            console.log(`\n🎯 Audio Feedback Test Results:`);
            if (!hasFeedbackLoop) {
              console.log('✅ Audio feedback loop appears to be fixed');
              console.log('✅ AI responses are not triggering continuous voice input');
              console.log('✅ Audio isolation is working properly');
            } else {
              console.log('❌ Audio feedback loop still detected');
              console.log('❌ System may still be hearing itself speak');
              console.log('❌ Need to improve audio isolation timing');
            }
            
            if (audioControlMessages.length > 0) {
              console.log('✅ Audio control mechanisms are active');
            } else {
              console.log('⚠️ Audio control messages not detected');
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
        path: 'tests/screenshots/audio_feedback_test.png', 
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

testAudioFeedbackFix().catch(console.error);
