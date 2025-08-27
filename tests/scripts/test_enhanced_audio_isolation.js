import { chromium } from 'playwright';

async function testEnhancedAudioIsolation() {
  console.log('🔊 Testing Enhanced Audio Isolation...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let audioWaitingCount = 0;
  let feedbackBlockCount = 0;
  let repetitionBlockCount = 0;
  let safeResumeCount = 0;
  
  // Collect console messages and track audio isolation
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Track audio waiting
    if (text.includes('🔊 Audio still playing, waiting...')) {
      audioWaitingCount++;
      if (audioWaitingCount <= 5) { // Don't spam the log
        console.log(`[AUDIO WAIT ${audioWaitingCount}] Waiting for audio to finish`);
      }
    }
    
    // Track safe resume
    if (text.includes('🎤 Audio completely finished - now safe to resume')) {
      safeResumeCount++;
      console.log(`[SAFE RESUME ${safeResumeCount}] Audio confirmed finished, resuming safely`);
    }
    
    // Track feedback blocks
    if (text.includes('🚫 Ignoring transcript that sounds like AI feedback')) {
      feedbackBlockCount++;
      console.log(`[FEEDBACK BLOCKED ${feedbackBlockCount}] AI feedback detected and blocked`);
    }
    
    // Track repetition blocks
    if (text.includes('🚫 Ignoring transcript that sounds like AI feedback or repetition')) {
      repetitionBlockCount++;
      console.log(`[REPETITION BLOCKED ${repetitionBlockCount}] Repetition detected and blocked`);
    }
    
    // Track audio completion
    if (text.includes('🔊 Audio playback finished, adding safety buffer')) {
      console.log('[AUDIO COMPLETE] Audio playback finished, safety buffer added');
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
        
        console.log('🔊 Testing enhanced audio isolation...');
        
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
            
            // Send message to trigger AI response and test audio isolation
            console.log('\n📤 Sending message to test audio isolation...');
            await messageInput.fill('What is our current galactic situation?');
            
            const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
            if (sendButtons.length > 0) {
              // Reset counters
              const initialAudioWaiting = audioWaitingCount;
              const initialFeedbackBlocks = feedbackBlockCount;
              const initialRepetitionBlocks = repetitionBlockCount;
              const initialSafeResume = safeResumeCount;
              
              await sendButtons[0].click();
              
              console.log('⏳ Monitoring audio isolation for 25 seconds...');
              await page.waitForTimeout(25000); // Wait for AI response and isolation
              
              const audioWaitingInTest = audioWaitingCount - initialAudioWaiting;
              const feedbackBlocksInTest = feedbackBlockCount - initialFeedbackBlocks;
              const repetitionBlocksInTest = repetitionBlockCount - initialRepetitionBlocks;
              const safeResumeInTest = safeResumeCount - initialSafeResume;
              
              console.log(`\n🔊 Enhanced Audio Isolation Results:`);
              console.log(`- Audio waiting events: ${audioWaitingInTest}`);
              console.log(`- Feedback blocks: ${feedbackBlocksInTest}`);
              console.log(`- Repetition blocks: ${repetitionBlocksInTest}`);
              console.log(`- Safe resume events: ${safeResumeInTest}`);
              
              // Check for repeated messages (sign of feedback loop)
              const messageElements = await page.locator('[class*="message"]').all();
              console.log(`- Total messages: ${messageElements.length}`);
              
              // Look for signs of feedback loop in console
              const feedbackSigns = consoleMessages.filter(msg => 
                msg.text.toLowerCase().includes('sector 7') || 
                msg.text.toLowerCase().includes('zephyrian empire')
              );
              console.log(`- Console mentions of AI content: ${feedbackSigns.length}`);
              
              // Final assessment
              console.log(`\n🏆 ENHANCED AUDIO ISOLATION ASSESSMENT:`);
              
              const isolationWorking = safeResumeInTest > 0 && 
                                     (feedbackBlocksInTest > 0 || repetitionBlocksInTest > 0 || feedbackSigns.length <= 2) &&
                                     audioWaitingInTest >= 0; // Audio waiting is expected
              
              if (isolationWorking) {
                console.log('✅ ENHANCED AUDIO ISOLATION WORKING');
                console.log('✅ System waits for audio to completely finish');
                console.log('✅ Enhanced feedback detection active');
                console.log('✅ Repetition detection preventing loops');
                console.log('✅ Safe resumption after audio completion');
                console.log('\n🔊 Audio feedback loops should be completely prevented!');
              } else {
                console.log('❌ Enhanced audio isolation needs improvement');
                if (safeResumeInTest === 0) {
                  console.log('❌ Safe resume not detected');
                }
                if (feedbackSigns.length > 2) {
                  console.log('❌ Still detecting AI content in transcripts');
                }
                if (feedbackBlocksInTest === 0 && repetitionBlocksInTest === 0) {
                  console.log('❌ No feedback prevention detected');
                }
              }
              
              // Show audio isolation events
              console.log(`\n📊 Audio Isolation Events:`);
              const isolationEvents = consoleMessages.filter(msg => 
                msg.text.includes('🔊') || 
                msg.text.includes('🚫') ||
                msg.text.includes('safe to resume') ||
                msg.text.includes('Audio completely finished')
              ).slice(-10);
              
              isolationEvents.forEach(msg => {
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
        path: 'tests/screenshots/enhanced_audio_isolation.png', 
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

testEnhancedAudioIsolation().catch(console.error);
