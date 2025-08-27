const { chromium } = require('playwright');

async function testContinuousVoice() {
  console.log('🎭 Testing Continuous Voice Conversation...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--allow-running-insecure-content',
      '--disable-web-security',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });
  
  const context = await browser.newContext({
    permissions: ['microphone', 'camera']
  });
  
  const page = await context.newPage();
  
  // Listen for voice-related console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('🎤') || text.includes('🔊') || text.includes('🗣️') || 
        text.includes('🔇') || text.includes('Voice') || text.includes('transcript') ||
        text.includes('Continuous') || text.includes('listening') || text.includes('silence')) {
      console.log(`🌐 Browser:`, text);
    }
  });
  
  try {
    console.log('🌐 Loading game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    console.log('📱 Navigating to WhoseApp...');
    await page.click('button:has-text("WhoseApp")');
    await page.waitForTimeout(2000);
    
    console.log('👥 Going to Characters tab...');
    await page.click('button:has-text("Characters")');
    await page.waitForTimeout(2000);
    
    // Start a conversation with a character
    console.log('🖱️ Starting conversation with first character...');
    const textButtons = await page.$$('button:has-text("💬 Text")');
    if (textButtons.length > 0) {
      await textButtons[0].click();
      await page.waitForTimeout(2000);
      
      // Check current voice mode status
      console.log('🔍 Checking voice mode status...');
      const voiceModeButton = await page.$('button[title*="voice mode"], button:has-text("⌨️"), button:has-text("🎤")');
      
      if (voiceModeButton) {
        const buttonText = await voiceModeButton.textContent();
        const isCurrentlyVoiceMode = buttonText?.includes('🎤');
        
        console.log(`📊 Current mode: ${isCurrentlyVoiceMode ? 'Voice (🎤)' : 'Text (⌨️)'}`);
        
        if (!isCurrentlyVoiceMode) {
          console.log('🖱️ Switching to voice mode...');
          await voiceModeButton.click();
          await page.waitForTimeout(2000);
        }
        
        // Check if continuous listening started
        console.log('🔍 Checking continuous listening status...');
        const listeningStatus = await page.evaluate(() => {
          return {
            voiceServiceAvailable: typeof window.voiceService !== 'undefined',
            isContinuouslyListening: window.voiceService ? window.voiceService.isContinuouslyListening() : false,
            speechRecognitionSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
          };
        });
        
        console.log('📊 Listening Status:');
        Object.entries(listeningStatus).forEach(([key, value]) => {
          console.log(`   ${key}: ${value ? '✅' : '❌'}`);
        });
        
        // Look for visual indicators
        console.log('🔍 Looking for visual indicators...');
        const pulsingIndicator = await page.$('[style*="pulse"], .pulse, [style*="animation"]');
        if (pulsingIndicator) {
          console.log('✅ Found pulsing listening indicator');
        } else {
          console.log('❌ No pulsing indicator found');
        }
        
        // Test voice transcript simulation
        console.log('🎤 Simulating voice transcript...');
        const testTranscript = "Hello, what's the current diplomatic situation?";
        
        await page.evaluate((transcript) => {
          if (window.voiceService && window.voiceService.isContinuouslyListening()) {
            // Simulate receiving a transcript
            console.log('🗣️ Simulating user speech:', transcript);
            
            // Find the WhoseApp component and trigger voice transcript
            const whoseAppElement = document.querySelector('.whoseapp-main');
            if (whoseAppElement) {
              // Trigger a custom event to simulate voice transcript
              const event = new CustomEvent('voiceTranscript', { 
                detail: { transcript } 
              });
              whoseAppElement.dispatchEvent(event);
            }
          }
        }, testTranscript);
        
        await page.waitForTimeout(3000);
        
        // Check if message appeared in chat
        console.log('🔍 Checking for transcript in chat...');
        const messages = await page.$$('.message-item, .message');
        console.log(`📊 Found ${messages.length} messages in chat`);
        
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          const messageText = await lastMessage.textContent();
          console.log(`💬 Last message: "${messageText?.substring(0, 100)}..."`);
          
          if (messageText?.includes(testTranscript)) {
            console.log('✅ Voice transcript appeared in chat');
          } else {
            console.log('❌ Voice transcript not found in chat');
          }
        }
        
        // Check for character response
        console.log('🔍 Waiting for character response...');
        await page.waitForTimeout(2000);
        
        const updatedMessages = await page.$$('.message-item, .message');
        if (updatedMessages.length > messages.length) {
          console.log('✅ Character response detected');
          
          const characterMessage = updatedMessages[updatedMessages.length - 1];
          const responseText = await characterMessage.textContent();
          console.log(`🤖 Character response: "${responseText?.substring(0, 100)}..."`);
        } else {
          console.log('❌ No character response detected');
        }
        
        // Test manual message to trigger voice response
        console.log('📝 Testing manual message with voice response...');
        const messageInput = await page.$('textarea[placeholder*="Message"]');
        if (messageInput) {
          await messageInput.fill('What are your recommendations for our next diplomatic meeting?');
          await page.keyboard.press('Enter');
          await page.waitForTimeout(3000);
          
          // Check for TTS activity
          const finalMessages = await page.$$('.message-item, .message');
          console.log(`📊 Final message count: ${finalMessages.length}`);
        }
        
      } else {
        console.log('❌ Voice mode toggle not found');
      }
      
    } else {
      console.log('❌ No text buttons found to start conversation');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-continuous-voice.png', fullPage: true });
    
    console.log('✅ Continuous voice test completed');
    
  } catch (error) {
    console.error('❌ Error during continuous voice testing:', error);
    await page.screenshot({ path: 'debug-continuous-voice-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testContinuousVoice().catch(console.error);

