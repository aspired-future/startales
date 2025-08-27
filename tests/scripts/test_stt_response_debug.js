import { chromium } from 'playwright';

async function testSTTResponseDebug() {
  console.log('🔍 Testing STT Response Debug...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  let sttDetected = false;
  let aiResponseStarted = false;
  let networkErrors = [];
  
  // Collect console messages and network errors
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ text, timestamp: Date.now() });
    
    // Track STT events
    if (text.includes('🎤 Processing voice transcript')) {
      sttDetected = true;
      console.log('[STT] ✅ Voice transcript processed:', text.split(':')[1]?.trim());
    }
    
    // Track AI response events
    if (text.includes('🤖 Generating Character AI response')) {
      aiResponseStarted = true;
      console.log('[AI RESPONSE] ✅ AI response generation started');
    }
    
    // Track errors
    if (text.includes('❌') || text.includes('Failed') || text.includes('Error')) {
      console.log('[ERROR] ❌', text);
    }
    
    // Track network issues
    if (text.includes('ECONNREFUSED') || text.includes('500') || text.includes('fetch')) {
      console.log('[NETWORK] ⚠️', text);
    }
  });
  
  // Track network failures
  page.on('response', response => {
    if (!response.ok()) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`[NETWORK ERROR] ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
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
        
        console.log('🔍 Testing STT and AI response...');
        
        // Find message input
        const messageInput = await page.locator('input, textarea').first();
        if (await messageInput.isVisible()) {
          
          // Test 1: Send a text message first to check AI response
          console.log('\n📤 Test 1: Sending text message to check AI response...');
          await messageInput.fill('What is our current situation?');
          
          const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
          if (sendButtons.length > 0) {
            await sendButtons[0].click();
            
            console.log('⏳ Waiting for AI response to text message...');
            await page.waitForTimeout(10000);
            
            // Check if AI responded to text
            const messages = await page.locator('[class*="message"]').all();
            console.log(`📝 Total messages visible: ${messages.length}`);
            
            // Test 2: Try voice mode
            console.log('\n🎤 Test 2: Testing voice mode...');
            const voiceButtons = await page.locator('button').filter({ hasText: /🎤/ }).all();
            if (voiceButtons.length > 0) {
              console.log('🎤 Clicking voice button...');
              await voiceButtons[0].click();
              await page.waitForTimeout(2000);
              
              const buttonText = await voiceButtons[0].textContent();
              console.log(`🎤 Voice button state: "${buttonText}"`);
              
              if (buttonText && buttonText.includes('Listening')) {
                console.log('✅ Voice mode activated');
                
                // Simulate speaking by typing (since we can't actually speak in test)
                console.log('💬 Simulating voice input by typing...');
                await messageInput.fill('Tell me about the galaxy');
                await page.keyboard.press('Enter');
                
                console.log('⏳ Waiting for AI response to voice input...');
                await page.waitForTimeout(15000);
              } else {
                console.log('❌ Voice mode not activated');
              }
            }
            
            // Analysis
            console.log(`\n🔍 STT Response Debug Results:`);
            console.log(`- STT detected: ${sttDetected ? '✅ YES' : '❌ NO'}`);
            console.log(`- AI response started: ${aiResponseStarted ? '✅ YES' : '❌ NO'}`);
            console.log(`- Network errors: ${networkErrors.length}`);
            
            if (networkErrors.length > 0) {
              console.log('\n🌐 Network Errors:');
              networkErrors.forEach(error => {
                console.log(`  ${error.status} ${error.url}`);
              });
            }
            
            // Show recent console activity
            console.log(`\n📊 Recent Console Activity:`);
            const recentMessages = consoleMessages.slice(-15);
            recentMessages.forEach(msg => {
              console.log(`  ${msg.text.substring(0, 100)}...`);
            });
            
            // Diagnosis
            console.log(`\n🎯 Diagnosis:`);
            if (sttDetected && !aiResponseStarted) {
              console.log('🔍 STT working but AI response not starting');
              console.log('💡 Possible issues:');
              console.log('   - Backend server not running');
              console.log('   - Character AI API not responding');
              console.log('   - Network connectivity issues');
            } else if (!sttDetected && !aiResponseStarted) {
              console.log('🔍 Neither STT nor AI response working');
              console.log('💡 Possible issues:');
              console.log('   - Frontend/backend communication broken');
              console.log('   - Voice service not initialized');
            } else if (sttDetected && aiResponseStarted) {
              console.log('✅ Both STT and AI response working');
              console.log('💡 Check for voice synthesis issues');
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
      
      // Take screenshot for debugging
      await page.screenshot({ 
        path: 'tests/screenshots/stt_response_debug.png', 
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

testSTTResponseDebug().catch(console.error);
