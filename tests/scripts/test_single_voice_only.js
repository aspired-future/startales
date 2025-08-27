import { chromium } from 'playwright';

async function testSingleVoiceOnly() {
  console.log('🎭 Testing Single Character Voice Only (No Robotic Interruption)...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let speechSynthesisEvents = [];
  let characterVoiceStarted = false;
  let roboticVoiceDetected = false;
  let speechCancellations = 0;
  
  // Collect console messages and track voice events
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Track speech synthesis events
    if (text.includes('🎭 Starting EXCLUSIVE character voice synthesis')) {
      characterVoiceStarted = true;
      console.log('[CHARACTER VOICE] ✅ Exclusive character voice started');
    }
    
    if (text.includes('🔇 Cancelled any existing speech synthesis')) {
      speechCancellations++;
      console.log(`[SPEECH CANCEL ${speechCancellations}] Cancelled existing speech`);
    }
    
    if (text.includes('🚫 All other TTS disabled')) {
      console.log('[TTS DISABLED] ✅ Other TTS systems disabled');
    }
    
    if (text.includes('✅ Character voice synthesis completed')) {
      console.log('[CHARACTER VOICE] ✅ Character voice completed successfully');
    }
    
    if (text.includes('🔇 NO FALLBACK - preventing robotic voice')) {
      console.log('[NO FALLBACK] ✅ Robotic voice fallback prevented');
    }
    
    // Check for any basic TTS calls (should not happen)
    if (text.includes('TTS Fallback') || text.includes('Basic TTS')) {
      roboticVoiceDetected = true;
      console.log('[ROBOTIC VOICE] ❌ Robotic voice detected!');
    }
    
    // Track speech synthesis state
    if (text.includes('Speech synthesis still active')) {
      console.log('[SPEECH STATE] ⚠️ Speech synthesis was still active');
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
        
        console.log('🎭 Testing single character voice only...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Send a message to trigger AI response
          console.log('📤 Sending message to trigger character voice...');
          await messageInput.fill('Tell me about our current diplomatic situation');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            await sendButtons[0].click();
            
            console.log('⏳ Monitoring for single voice synthesis (25 seconds)...');
            
            const startTime = Date.now();
            const monitorDuration = 25000; // 25 seconds
            
            // Reset counters
            const initialCancellations = speechCancellations;
            
            await page.waitForTimeout(monitorDuration);
            
            const cancellationsInTest = speechCancellations - initialCancellations;
            
            console.log(`\n🎭 Single Voice Test Results:`);
            console.log(`- Character voice started: ${characterVoiceStarted ? '✅ YES' : '❌ NO'}`);
            console.log(`- Robotic voice detected: ${roboticVoiceDetected ? '❌ YES' : '✅ NO'}`);
            console.log(`- Speech cancellations: ${cancellationsInTest}`);
            
            // Check for AI speaking indicator
            const aiSpeakingIndicator = page.locator('text=AI Speaking...');
            const wasAISpeaking = await aiSpeakingIndicator.isVisible().catch(() => false);
            console.log(`- AI speaking indicator shown: ${wasAISpeaking ? '✅ YES' : '❌ NO'}`);
            
            // Check for interrupt button
            const interruptButton = page.locator('button[title="Stop AI Response"]');
            const wasInterruptVisible = await interruptButton.isVisible().catch(() => false);
            console.log(`- Interrupt button available: ${wasInterruptVisible ? '✅ YES' : '❌ NO'}`);
            
            // Analyze console messages for voice conflicts
            const voiceConflictMessages = consoleMessages.filter(msg => 
              msg.timestamp > startTime && 
              (msg.text.includes('TTS Fallback') || 
               msg.text.includes('Basic TTS') ||
               msg.text.includes('robotic') ||
               msg.text.includes('interrupted'))
            );
            
            console.log(`- Voice conflict messages: ${voiceConflictMessages.length}`);
            
            if (voiceConflictMessages.length > 0) {
              console.log('⚠️ Voice conflict messages detected:');
              voiceConflictMessages.forEach(msg => {
                console.log(`  ${msg.text}`);
              });
            }
            
            // Check for exclusive voice messages
            const exclusiveVoiceMessages = consoleMessages.filter(msg => 
              msg.timestamp > startTime && 
              (msg.text.includes('EXCLUSIVE character voice') || 
               msg.text.includes('All other TTS disabled') ||
               msg.text.includes('NO FALLBACK'))
            );
            
            console.log(`- Exclusive voice protection messages: ${exclusiveVoiceMessages.length}`);
            
            // Final assessment
            console.log(`\n🎯 Single Voice Assessment:`);
            
            const singleVoiceWorking = characterVoiceStarted && 
                                     !roboticVoiceDetected && 
                                     exclusiveVoiceMessages.length > 0 &&
                                     voiceConflictMessages.length === 0;
            
            if (singleVoiceWorking) {
              console.log('✅ SINGLE CHARACTER VOICE WORKING PERFECTLY');
              console.log('✅ No robotic voice interruptions detected');
              console.log('✅ Exclusive voice protection active');
              console.log('✅ No voice conflicts or fallbacks');
              console.log('\n🎉 Character voice isolation successful!');
            } else {
              console.log('❌ Single voice system needs improvement');
              if (!characterVoiceStarted) console.log('❌ Character voice did not start');
              if (roboticVoiceDetected) console.log('❌ Robotic voice still detected');
              if (voiceConflictMessages.length > 0) console.log('❌ Voice conflicts detected');
              if (exclusiveVoiceMessages.length === 0) console.log('❌ Exclusive voice protection not active');
            }
            
            // Show recent voice-related activity
            console.log(`\n📊 Recent Voice Activity:`);
            const voiceActivity = consoleMessages.filter(msg => 
              msg.timestamp > startTime && 
              (msg.text.includes('🎭') || msg.text.includes('🔇') || msg.text.includes('TTS'))
            ).slice(-10);
            
            voiceActivity.forEach(msg => {
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
        path: 'tests/screenshots/single_voice_only.png', 
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

testSingleVoiceOnly().catch(console.error);
