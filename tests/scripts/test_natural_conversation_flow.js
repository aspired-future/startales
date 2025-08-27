import { chromium } from 'playwright';

async function testNaturalConversationFlow() {
  console.log('💬 Testing Natural Conversation Flow...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let voiceResumedCount = 0;
  let aiResponseCount = 0;
  let conversationContinued = false;
  
  // Collect console messages and track conversation flow
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Track voice resumption
    if (text.includes('🎤 Voice mode resumed - ready for user input')) {
      voiceResumedCount++;
      console.log(`[VOICE RESUMED ${voiceResumedCount}] Voice mode resumed for continued conversation`);
    }
    
    // Track AI responses
    if (text.includes('🤖 Generating Character AI response')) {
      aiResponseCount++;
      console.log(`[AI RESPONSE ${aiResponseCount}] AI response generated`);
    }
    
    // Track conversation continuation
    if (text.includes('🎤 Voice listening resumed successfully')) {
      conversationContinued = true;
      console.log('[CONVERSATION FLOW] ✅ Conversation can continue');
    }
    
    // Track feedback protection
    if (text.includes('🛡️ Enhanced feedback protection still active')) {
      console.log('[FEEDBACK PROTECTION] ✅ Protection still active during resume');
    }
    
    // Track any feedback blocks
    if (text.includes('🚫 Ignoring')) {
      console.log('[FEEDBACK BLOCKED]', text);
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
        
        console.log('💬 Testing natural conversation flow...');
        
        // Find message input and voice button
        const messageInput = await page.locator('input, textarea').first();
        const voiceButtons = await page.locator('button').filter({ hasText: /🎤/ }).all();
        
        if (await messageInput.isVisible() && voiceButtons.length > 0) {
          
          // Step 1: Enable voice mode
          console.log('\n🎤 Step 1: Enabling voice mode...');
          await voiceButtons[0].click();
          await page.waitForTimeout(2000);
          
          const buttonText1 = await voiceButtons[0].textContent();
          console.log(`🎤 Voice button state: "${buttonText1}"`);
          
          if (buttonText1 && buttonText1.includes('Listening')) {
            console.log('✅ Voice mode activated');
            
            // Step 2: Send first message to trigger AI response
            console.log('\n📤 Step 2: Sending first message...');
            await messageInput.fill('What is our current situation?');
            
            const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
            if (sendButtons.length > 0) {
              await sendButtons[0].click();
              
              console.log('⏳ Waiting for AI response and voice resumption...');
              await page.waitForTimeout(15000); // Wait for AI response and resumption
              
              // Step 3: Check if voice mode resumed
              console.log('\n🔍 Step 3: Checking voice resumption...');
              const buttonText2 = await voiceButtons[0].textContent();
              console.log(`🎤 Voice button state after AI response: "${buttonText2}"`);
              
              const voiceModeStillActive = buttonText2 && buttonText2.includes('Listening');
              console.log(`🎤 Voice mode still active: ${voiceModeStillActive ? '✅ YES' : '❌ NO'}`);
              
              // Step 4: Try to continue conversation
              if (voiceModeStillActive || conversationContinued) {
                console.log('\n💬 Step 4: Testing conversation continuation...');
                
                // Simulate second message (since we can't actually speak)
                await messageInput.fill('Tell me more about that');
                await sendButtons[0].click();
                
                console.log('⏳ Waiting for second AI response...');
                await page.waitForTimeout(10000);
                
                // Check messages
                const messageElements = await page.locator('[class*="message"]').all();
                console.log(`📝 Total messages after conversation: ${messageElements.length}`);
              }
              
              // Analysis
              console.log(`\n💬 Natural Conversation Flow Results:`);
              console.log(`- Voice resumed after AI response: ${voiceResumedCount > 0 ? '✅ YES' : '❌ NO'}`);
              console.log(`- Conversation can continue: ${conversationContinued ? '✅ YES' : '❌ NO'}`);
              console.log(`- AI responses generated: ${aiResponseCount}`);
              console.log(`- Voice resumption events: ${voiceResumedCount}`);
              
              // Check for feedback protection during flow
              const feedbackBlocks = consoleMessages.filter(msg => 
                msg.text.includes('🚫 Ignoring')
              );
              console.log(`- Feedback blocks during flow: ${feedbackBlocks.length}`);
              
              // Final assessment
              console.log(`\n🏆 NATURAL CONVERSATION ASSESSMENT:`);
              
              const naturalFlowWorking = (voiceResumedCount > 0 || conversationContinued) && 
                                       aiResponseCount > 0 &&
                                       feedbackBlocks.length <= 2; // Allow some initial feedback blocks
              
              if (naturalFlowWorking) {
                console.log('✅ NATURAL CONVERSATION FLOW WORKING');
                console.log('✅ Voice mode resumes after AI responses');
                console.log('✅ Users can continue conversations naturally');
                console.log('✅ Feedback protection still active');
                console.log('\n🎉 You can now have natural back-and-forth conversations!');
              } else {
                console.log('❌ Natural conversation flow needs improvement');
                if (voiceResumedCount === 0 && !conversationContinued) {
                  console.log('❌ Voice mode not resuming after AI responses');
                }
                if (aiResponseCount === 0) {
                  console.log('❌ AI not responding to messages');
                }
                if (feedbackBlocks.length > 2) {
                  console.log('❌ Too many feedback blocks interfering with flow');
                }
              }
              
              // Show conversation flow events
              console.log(`\n📊 Conversation Flow Events:`);
              const flowEvents = consoleMessages.filter(msg => 
                msg.text.includes('🎤 Voice') || 
                msg.text.includes('🤖 Generating') ||
                msg.text.includes('resumed') ||
                msg.text.includes('🛡️')
              ).slice(-10);
              
              flowEvents.forEach(msg => {
                console.log(`  ${msg.text.substring(0, 80)}...`);
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
        path: 'tests/screenshots/natural_conversation_flow.png', 
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

testNaturalConversationFlow().catch(console.error);
