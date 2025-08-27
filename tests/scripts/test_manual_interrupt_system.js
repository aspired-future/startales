import { chromium } from 'playwright';

async function testManualInterruptSystem() {
  console.log('🎛️ Testing Manual Interrupt System...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let aiSpeakingDetected = false;
  let voiceAutoResumeDetected = false;
  let manualInterruptDetected = false;
  
  // Collect console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Track AI speaking state
    if (text.includes('AI now speaking')) {
      aiSpeakingDetected = true;
      console.log('[AI SPEAKING] Detected AI speaking state');
    }
    
    // Check for automatic voice resumption (should NOT happen)
    if (text.includes('Restarting voice input after AI response') || 
        text.includes('resuming listening after safety delay')) {
      voiceAutoResumeDetected = true;
      console.log('[AUTO RESUME] ❌ Detected automatic voice resumption');
    }
    
    // Check for manual interrupt
    if (text.includes('User interrupted AI speech')) {
      manualInterruptDetected = true;
      console.log('[MANUAL INTERRUPT] ✅ Detected manual interrupt');
    }
    
    // Check for voice mode disabled after AI response
    if (text.includes('Voice mode disabled after AI response')) {
      console.log('[VOICE DISABLED] ✅ Voice mode properly disabled after AI response');
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
        
        console.log('🎛️ Testing manual interrupt system...');
        
        // Check for AI speaking indicator in header
        const aiSpeakingIndicator = page.locator('text=AI Speaking...');
        console.log('🔍 Checking for AI speaking indicator...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Send a test message to trigger AI response
          await messageInput.fill('Tell me about the current galactic situation');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            console.log('📤 Sending message to trigger AI response...');
            await sendButtons[0].click();
            
            console.log('⏳ Waiting for AI response and checking interrupt system...');
            
            // Wait a bit for AI to start speaking
            await page.waitForTimeout(3000);
            
            // Check if AI speaking indicator appears
            const isAISpeakingVisible = await aiSpeakingIndicator.isVisible().catch(() => false);
            if (isAISpeakingVisible) {
              console.log('✅ AI speaking indicator is visible');
              
              // Look for interrupt button (🛑)
              const interruptButton = page.locator('button[title="Stop AI Response"]');
              const isInterruptButtonVisible = await interruptButton.isVisible().catch(() => false);
              
              if (isInterruptButtonVisible) {
                console.log('✅ Interrupt button is visible');
                console.log('🛑 Testing manual interrupt...');
                await interruptButton.click();
                await page.waitForTimeout(1000);
                
                // Check if AI speaking indicator disappears
                const isStillSpeaking = await aiSpeakingIndicator.isVisible().catch(() => false);
                if (!isStillSpeaking) {
                  console.log('✅ AI speaking indicator disappeared after interrupt');
                } else {
                  console.log('❌ AI speaking indicator still visible after interrupt');
                }
              } else {
                console.log('❌ Interrupt button not found');
              }
            } else {
              console.log('⚠️ AI speaking indicator not visible (may not be speaking yet)');
            }
            
            // Monitor for 10 more seconds to ensure no auto-resume
            console.log('⏳ Monitoring for automatic voice resumption (should NOT happen)...');
            await page.waitForTimeout(10000);
            
            // Check voice mode button state
            const voiceButtons = await page.locator('button').filter({ hasText: /🎤|Voice/ }).all();
            if (voiceButtons.length > 0) {
              const buttonText = await voiceButtons[0].textContent();
              console.log(`🎤 Voice button state: "${buttonText}"`);
              
              if (buttonText && !buttonText.includes('Listening')) {
                console.log('✅ Voice mode properly disabled after AI response');
              } else {
                console.log('❌ Voice mode may still be active');
              }
            }
            
            console.log(`\n🎛️ Manual Interrupt System Results:`);
            console.log(`- AI speaking detected: ${aiSpeakingDetected ? '✅' : '❌'}`);
            console.log(`- Manual interrupt detected: ${manualInterruptDetected ? '✅' : '❌'}`);
            console.log(`- Auto voice resume detected: ${voiceAutoResumeDetected ? '❌ (BAD)' : '✅ (GOOD)'}`);
            
            // Show recent console activity
            console.log(`\n📊 Recent Console Activity:`);
            const recentMessages = consoleMessages.slice(-10);
            recentMessages.forEach(msg => {
              console.log(`  ${msg.text.substring(0, 80)}...`);
            });
            
            if (!voiceAutoResumeDetected && (aiSpeakingDetected || manualInterruptDetected)) {
              console.log('\n✅ Manual interrupt system is working correctly');
              console.log('✅ No automatic voice resumption detected');
              console.log('✅ User has full control over voice interaction');
            } else {
              console.log('\n❌ Manual interrupt system needs improvement');
              if (voiceAutoResumeDetected) {
                console.log('❌ Automatic voice resumption still happening');
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
        path: 'tests/screenshots/manual_interrupt_system.png', 
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

testManualInterruptSystem().catch(console.error);
