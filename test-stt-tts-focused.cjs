const { chromium } = require('playwright');

async function focusedSTTTTSTest() {
  console.log('🎭 Focused STT/TTS Test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 800,
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
    if (text.includes('Voice') || text.includes('STT') || text.includes('TTS') || 
        text.includes('Speech') || text.includes('Audio') || text.includes('Recording') ||
        text.includes('🎤') || text.includes('🔊')) {
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
    
    // Check what's actually in the DOM
    console.log('🔍 Analyzing DOM for voice elements...');
    
    const voiceElements = await page.evaluate(() => {
      const elements = {
        voiceButtons: [],
        ttsButtons: [],
        micButtons: [],
        recordingElements: [],
        voiceControls: [],
        speechElements: []
      };
      
      // Find all buttons with voice-related text or icons
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        const title = btn.title?.toLowerCase() || '';
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
        
        if (text.includes('🎤') || text.includes('voice') || text.includes('mic') || 
            title.includes('voice') || ariaLabel.includes('voice')) {
          elements.voiceButtons.push({
            text: btn.textContent?.trim(),
            title: btn.title,
            className: btn.className,
            id: btn.id
          });
        }
        
        if (text.includes('🔊') || text.includes('speak') || text.includes('tts') ||
            title.includes('speak') || ariaLabel.includes('speak')) {
          elements.ttsButtons.push({
            text: btn.textContent?.trim(),
            title: btn.title,
            className: btn.className,
            id: btn.id
          });
        }
      });
      
      // Find voice control elements
      const voiceControlSelectors = [
        '.voice-controls', '.voice-control', '[data-testid*="voice"]',
        '.recording', '.speech', '.audio-controls'
      ];
      
      voiceControlSelectors.forEach(selector => {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
          elements.voiceControls.push({
            selector,
            className: el.className,
            id: el.id,
            textContent: el.textContent?.substring(0, 100)
          });
        });
      });
      
      return elements;
    });
    
    console.log('📊 Voice Elements Found:');
    console.log(`   Voice Buttons: ${voiceElements.voiceButtons.length}`);
    voiceElements.voiceButtons.forEach((btn, i) => {
      console.log(`     ${i + 1}. "${btn.text}" (${btn.className})`);
    });
    
    console.log(`   TTS Buttons: ${voiceElements.ttsButtons.length}`);
    voiceElements.ttsButtons.forEach((btn, i) => {
      console.log(`     ${i + 1}. "${btn.text}" (${btn.className})`);
    });
    
    console.log(`   Voice Controls: ${voiceElements.voiceControls.length}`);
    voiceElements.voiceControls.forEach((ctrl, i) => {
      console.log(`     ${i + 1}. ${ctrl.selector} (${ctrl.className})`);
    });
    
    // Test browser voice capabilities
    console.log('🔍 Testing browser voice capabilities...');
    
    const browserCapabilities = await page.evaluate(() => {
      return {
        speechSynthesis: 'speechSynthesis' in window,
        speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
        mediaRecorder: 'MediaRecorder' in window,
        getUserMedia: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        availableVoices: window.speechSynthesis ? window.speechSynthesis.getVoices().length : 0,
        voiceService: typeof window.voiceService !== 'undefined',
        dynamicVoiceGenerator: typeof window.dynamicVoiceGenerator !== 'undefined'
      };
    });
    
    console.log('📊 Browser Capabilities:');
    Object.entries(browserCapabilities).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? '✅' : '❌'} ${typeof value === 'number' ? `(${value})` : ''}`);
    });
    
    // Test if we can start a conversation and find voice features there
    console.log('🔍 Testing conversation voice features...');
    
    const characterItems = await page.$$('.character-item');
    if (characterItems.length > 0) {
      // Click text button to start conversation
      const textButton = await characterItems[0].$('button:has-text("💬"), button:has-text("Text")');
      if (textButton) {
        console.log('🖱️ Starting conversation...');
        await textButton.click();
        await page.waitForTimeout(2000);
        
        // Look for voice elements in the conversation
        const conversationVoiceElements = await page.evaluate(() => {
          const elements = {
            voiceMessageButtons: [],
            recordingIndicators: [],
            audioElements: []
          };
          
          // Look for voice message buttons
          const buttons = document.querySelectorAll('button');
          buttons.forEach(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            if (text.includes('🎤') || text.includes('voice message')) {
              elements.voiceMessageButtons.push({
                text: btn.textContent?.trim(),
                className: btn.className,
                visible: btn.offsetParent !== null
              });
            }
          });
          
          // Look for recording indicators
          const recordingEls = document.querySelectorAll('.recording, [data-recording], .voice-recording');
          recordingEls.forEach(el => {
            elements.recordingIndicators.push({
              className: el.className,
              visible: el.offsetParent !== null
            });
          });
          
          // Look for audio elements
          const audioEls = document.querySelectorAll('audio');
          audioEls.forEach(el => {
            elements.audioElements.push({
              src: el.src,
              controls: el.controls,
              className: el.className
            });
          });
          
          return elements;
        });
        
        console.log('📊 Conversation Voice Elements:');
        console.log(`   Voice Message Buttons: ${conversationVoiceElements.voiceMessageButtons.length}`);
        conversationVoiceElements.voiceMessageButtons.forEach((btn, i) => {
          console.log(`     ${i + 1}. "${btn.text}" (visible: ${btn.visible})`);
        });
        
        console.log(`   Recording Indicators: ${conversationVoiceElements.recordingIndicators.length}`);
        console.log(`   Audio Elements: ${conversationVoiceElements.audioElements.length}`);
        
        // Try to click a voice message button if found
        if (conversationVoiceElements.voiceMessageButtons.length > 0) {
          const voiceBtn = await page.$('button:has-text("🎤")');
          if (voiceBtn) {
            console.log('🖱️ Testing voice message button...');
            await voiceBtn.click();
            await page.waitForTimeout(1000);
            
            // Check if recording UI appeared
            const recordingUI = await page.$('.recording, [data-recording="true"], .voice-recording');
            if (recordingUI) {
              console.log('✅ Recording UI appeared');
              
              // Try to stop recording
              const stopBtn = await page.$('button:has-text("⏹️"), button:has-text("Stop")');
              if (stopBtn) {
                await page.waitForTimeout(2000);
                await stopBtn.click();
                console.log('✅ Recording stopped');
              }
            } else {
              console.log('❌ Recording UI did not appear');
            }
          }
        }
      }
    }
    
    // Test TTS functionality
    console.log('🔍 Testing TTS functionality...');
    
    const ttsTest = await page.evaluate(async () => {
      if (window.speechSynthesis) {
        try {
          const utterance = new SpeechSynthesisUtterance('Testing text to speech');
          utterance.rate = 1;
          utterance.pitch = 1;
          utterance.volume = 0.1; // Low volume for testing
          
          window.speechSynthesis.speak(utterance);
          
          // Wait a bit and check if speaking
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const isSpeaking = window.speechSynthesis.speaking;
          
          // Cancel the speech
          window.speechSynthesis.cancel();
          
          return { success: true, wasSpeaking: isSpeaking };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
      return { success: false, error: 'Speech synthesis not available' };
    });
    
    console.log('📊 TTS Test Result:');
    console.log(`   TTS Success: ${ttsTest.success ? '✅' : '❌'}`);
    if (ttsTest.success) {
      console.log(`   Was Speaking: ${ttsTest.wasSpeaking ? '✅' : '❌'}`);
    } else {
      console.log(`   Error: ${ttsTest.error}`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-stt-tts-focused.png', fullPage: true });
    
    // Final summary
    console.log('\n📋 STT/TTS Focused Test Summary:');
    console.log('=====================================');
    console.log(`Speech Synthesis Available: ${browserCapabilities.speechSynthesis ? '✅' : '❌'}`);
    console.log(`Speech Recognition Available: ${browserCapabilities.speechRecognition ? '✅' : '❌'}`);
    console.log(`Media Recorder Available: ${browserCapabilities.mediaRecorder ? '✅' : '❌'}`);
    console.log(`Voice Service Loaded: ${browserCapabilities.voiceService ? '✅' : '❌'}`);
    console.log(`Dynamic Voice Generator: ${browserCapabilities.dynamicVoiceGenerator ? '✅' : '❌'}`);
    console.log(`Available Voices: ${browserCapabilities.availableVoices}`);
    console.log(`Voice Buttons Found: ${voiceElements.voiceButtons.length}`);
    console.log(`TTS Buttons Found: ${voiceElements.ttsButtons.length}`);
    console.log(`TTS Functionality: ${ttsTest.success ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Error during focused STT/TTS testing:', error);
    await page.screenshot({ path: 'debug-stt-tts-focused-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

focusedSTTTTSTest().catch(console.error);

