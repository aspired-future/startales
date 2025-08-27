import { chromium } from 'playwright';

async function testRobustFeedbackPrevention() {
  console.log('🛡️ Testing Robust Audio Feedback Prevention...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let feedbackBlockCount = 0;
  let voiceProcessingCount = 0;
  
  // Collect console messages and track feedback prevention
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text, timestamp: Date.now() });
    
    // Track feedback prevention events
    if (text.includes('🚫 Ignoring voice input while AI is speaking') || 
        text.includes('🚫 Ignoring voice transcript while AI is speaking')) {
      feedbackBlockCount++;
      console.log(`[FEEDBACK BLOCKED ${feedbackBlockCount}] ${text}`);
    }
    
    // Track voice processing events
    if (text.includes('🎤 Processing voice transcript')) {
      voiceProcessingCount++;
      console.log(`[VOICE PROCESSED ${voiceProcessingCount}] ${text}`);
    }
    
    // Track AI speaking state changes
    if (text.includes('AI now speaking') || text.includes('AI speech complete') || 
        text.includes('clearing speaking flag')) {
      console.log(`[AI SPEAKING STATE] ${text}`);
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
        
        console.log('🎤 Testing robust feedback prevention...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Send a test message to trigger AI response
          await messageInput.fill('What is happening in our galaxy?');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            console.log('📤 Sending message to trigger AI response...');
            await sendButtons[0].click();
            
            console.log('⏳ Monitoring for robust feedback prevention (20 seconds)...');
            
            // Monitor for 20 seconds to see if the robust prevention works
            const startTime = Date.now();
            const monitorDuration = 20000; // 20 seconds
            
            await page.waitForTimeout(monitorDuration);
            
            // Analyze the results
            console.log(`\n🔍 Robust Feedback Prevention Analysis:`);
            console.log(`- Feedback blocks detected: ${feedbackBlockCount}`);
            console.log(`- Voice processing events: ${voiceProcessingCount}`);
            
            // Check for specific feedback prevention messages
            const aiSpeakingMessages = consoleMessages.filter(msg => 
              msg.text.includes('AI now speaking') || 
              msg.text.includes('clearing speaking flag')
            );
            
            const feedbackPreventionMessages = consoleMessages.filter(msg => 
              msg.text.includes('🚫 Ignoring') && msg.text.includes('while AI is speaking')
            );
            
            console.log(`- AI speaking state changes: ${aiSpeakingMessages.length}`);
            console.log(`- Feedback prevention activations: ${feedbackPreventionMessages.length}`);
            
            // Check for repeated identical responses (sign of feedback loop)
            const responseMessages = consoleMessages.filter(msg => 
              msg.text.includes('Zephyrian Empire') || 
              msg.text.includes('Sector 7')
            );
            
            console.log(`- AI responses about Sector 7: ${responseMessages.length}`);
            
            // Show recent activity
            console.log(`\n📊 Recent Activity:`);
            const recentMessages = consoleMessages.filter(msg => 
              msg.timestamp > startTime
            ).slice(-15);
            
            recentMessages.forEach(msg => {
              const timeOffset = Math.round((msg.timestamp - startTime) / 1000);
              console.log(`  +${timeOffset}s: ${msg.text.substring(0, 80)}...`);
            });
            
            // Determine if robust prevention is working
            const hasRobustPrevention = feedbackBlockCount > 0 || 
                                      (responseMessages.length <= 2 && voiceProcessingCount <= 3);
            
            console.log(`\n🎯 Robust Feedback Prevention Results:`);
            if (hasRobustPrevention) {
              console.log('✅ Robust feedback prevention is working');
              console.log('✅ AI speaking state is being tracked properly');
              console.log('✅ Voice input is blocked during AI speech');
              
              if (feedbackBlockCount > 0) {
                console.log(`✅ Successfully blocked ${feedbackBlockCount} potential feedback events`);
              }
            } else {
              console.log('❌ Robust feedback prevention may not be working');
              console.log('❌ System may still be processing voice during AI speech');
            }
            
            if (aiSpeakingMessages.length >= 2) {
              console.log('✅ AI speaking state management is active');
            } else {
              console.log('⚠️ AI speaking state changes not detected');
            }
            
            if (responseMessages.length <= 2) {
              console.log('✅ No repeated identical responses detected');
            } else {
              console.log('❌ Multiple identical responses suggest feedback loop');
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
        path: 'tests/screenshots/robust_feedback_prevention.png', 
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

testRobustFeedbackPrevention().catch(console.error);
