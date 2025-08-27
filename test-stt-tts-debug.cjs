const { chromium } = require('playwright');

async function debugSTTTTSSystems() {
  console.log('🎭 Starting Playwright STT/TTS Debug Test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    devtools: true,
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
  
  // Listen for console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Voice') || text.includes('STT') || text.includes('TTS') || 
        text.includes('Speech') || text.includes('Audio') || text.includes('Recording')) {
      console.log(`🌐 Browser [${msg.type()}]:`, text);
    }
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.log(`🔴 Page Error:`, error.message);
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
    
    // Test 1: Check if Voice Controls are present
    console.log('🔍 Test 1: Checking for Voice Controls...');
    const voiceControls = await page.$('.voice-controls, [data-testid="voice-controls"]');
    if (voiceControls) {
      console.log('✅ Voice Controls found');
    } else {
      console.log('❌ Voice Controls not found');
    }
    
    // Test 2: Test character voice buttons
    console.log('🔍 Test 2: Testing character voice buttons...');
    const characterItems = await page.$$('.character-item');
    
    if (characterItems.length > 0) {
      const firstCharacter = characterItems[0];
      
      // Look for TTS button (speaker icon)
      const ttsButton = await firstCharacter.$('button:has-text("🔊"), .tts-button, [title*="speak"], [aria-label*="speak"]');
      if (ttsButton) {
        console.log('✅ TTS button found on character');
        
        console.log('🖱️ Clicking TTS button...');
        await ttsButton.click();
        await page.waitForTimeout(3000);
        
        // Check if speech synthesis is working
        const speechActive = await page.evaluate(() => {
          return window.speechSynthesis && window.speechSynthesis.speaking;
        });
        
        if (speechActive) {
          console.log('✅ TTS is active and speaking');
        } else {
          console.log('❌ TTS not active or not speaking');
        }
      } else {
        console.log('❌ TTS button not found on character');
      }
    }
    
    // Test 3: Test conversation voice features
    console.log('🔍 Test 3: Testing conversation voice features...');
    
    // Start a conversation with a character
    if (characterItems.length > 0) {
      const textButton = await characterItems[0].$('button:has-text("💬 Text"), button:has-text("Text")');
      if (textButton) {
        console.log('🖱️ Starting conversation...');
        await textButton.click();
        await page.waitForTimeout(2000);
        
        // Look for voice message controls in conversation
        const voiceMessageButton = await page.$('button:has-text("🎤"), .voice-message-button, [title*="voice"], [aria-label*="voice"]');
        if (voiceMessageButton) {
          console.log('✅ Voice message button found in conversation');
          
          console.log('🖱️ Testing voice message recording...');
          await voiceMessageButton.click();
          await page.waitForTimeout(1000);
          
          // Check if recording started
          const isRecording = await page.evaluate(() => {
            return document.querySelector('.recording, [data-recording="true"]') !== null;
          });
          
          if (isRecording) {
            console.log('✅ Voice recording started');
            
            // Stop recording after 2 seconds
            await page.waitForTimeout(2000);
            const stopButton = await page.$('button:has-text("⏹️"), .stop-recording, [title*="stop"]');
            if (stopButton) {
              await stopButton.click();
              console.log('✅ Voice recording stopped');
            }
          } else {
            console.log('❌ Voice recording did not start');
          }
        } else {
          console.log('❌ Voice message button not found in conversation');
        }
      }
    }
    
    // Test 4: Test channel voice features
    console.log('🔍 Test 4: Testing channel voice features...');
    
    // Go to Channels tab
    const channelsTab = await page.$('button:has-text("Channels")');
    if (channelsTab) {
      console.log('🖱️ Switching to Channels tab...');
      await channelsTab.click();
      await page.waitForTimeout(2000);
      
      // Select a channel
      const channelItems = await page.$$('.channel-item');
      if (channelItems.length > 0) {
        console.log('🖱️ Selecting first channel...');
        await channelItems[0].click();
        await page.waitForTimeout(2000);
        
        // Look for channel voice controls
        const channelVoiceControls = await page.$('.channel-voice-controls, .voice-participants');
        if (channelVoiceControls) {
          console.log('✅ Channel voice controls found');
          
          // Test speaking indicators
          const speakingIndicators = await page.$$('.speaking-indicator, .participant-speaking');
          console.log(`🔍 Found ${speakingIndicators.length} speaking indicators`);
          
          // Test voice enable/disable for channel
          const voiceToggle = await page.$('button:has-text("🎤"), .voice-toggle, [title*="voice"]');
          if (voiceToggle) {
            console.log('🖱️ Testing voice toggle...');
            await voiceToggle.click();
            await page.waitForTimeout(1000);
          }
        } else {
          console.log('❌ Channel voice controls not found');
        }
      }
    }
    
    // Test 5: Test Voice Service functionality
    console.log('🔍 Test 5: Testing Voice Service functionality...');
    
    const voiceServiceTest = await page.evaluate(() => {
      // Test if Voice Service is available
      const hasVoiceService = window.voiceService !== undefined;
      
      // Test Speech Recognition availability
      const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      
      // Test Speech Synthesis availability
      const hasSpeechSynthesis = 'speechSynthesis' in window;
      
      // Test MediaRecorder availability
      const hasMediaRecorder = 'MediaRecorder' in window;
      
      return {
        hasVoiceService,
        hasSpeechRecognition,
        hasSpeechSynthesis,
        hasMediaRecorder,
        availableVoices: window.speechSynthesis ? window.speechSynthesis.getVoices().length : 0
      };
    });
    
    console.log('📊 Voice Service Test Results:');
    console.log(`   Voice Service Available: ${voiceServiceTest.hasVoiceService ? '✅' : '❌'}`);
    console.log(`   Speech Recognition: ${voiceServiceTest.hasSpeechRecognition ? '✅' : '❌'}`);
    console.log(`   Speech Synthesis: ${voiceServiceTest.hasSpeechSynthesis ? '✅' : '❌'}`);
    console.log(`   Media Recorder: ${voiceServiceTest.hasMediaRecorder ? '✅' : '❌'}`);
    console.log(`   Available Voices: ${voiceServiceTest.availableVoices}`);
    
    // Test 6: Test Dynamic Voice Generation
    console.log('🔍 Test 6: Testing Dynamic Voice Generation...');
    
    const dynamicVoiceTest = await page.evaluate(() => {
      // Test if Dynamic Voice Generator is available
      const hasDynamicVoiceGenerator = window.dynamicVoiceGenerator !== undefined;
      
      if (hasDynamicVoiceGenerator) {
        try {
          // Test voice generation for a mock character
          const mockCharacter = {
            id: 'test_char',
            name: 'Test Character',
            age: 35,
            gender: 'female',
            personality: ['confident', 'diplomatic'],
            background: 'military',
            species: 'human'
          };
          
          const generatedVoice = window.dynamicVoiceGenerator.generateVoiceProfile(mockCharacter);
          return {
            hasDynamicVoiceGenerator: true,
            voiceGenerated: !!generatedVoice,
            voiceDetails: generatedVoice
          };
        } catch (error) {
          return {
            hasDynamicVoiceGenerator: true,
            voiceGenerated: false,
            error: error.message
          };
        }
      }
      
      return { hasDynamicVoiceGenerator: false };
    });
    
    console.log('📊 Dynamic Voice Generation Test Results:');
    console.log(`   Dynamic Voice Generator: ${dynamicVoiceTest.hasDynamicVoiceGenerator ? '✅' : '❌'}`);
    if (dynamicVoiceTest.hasDynamicVoiceGenerator) {
      console.log(`   Voice Generated: ${dynamicVoiceTest.voiceGenerated ? '✅' : '❌'}`);
      if (dynamicVoiceTest.voiceGenerated) {
        console.log(`   Voice Details:`, dynamicVoiceTest.voiceDetails);
      }
      if (dynamicVoiceTest.error) {
        console.log(`   Error: ${dynamicVoiceTest.error}`);
      }
    }
    
    // Test 7: Test microphone permissions
    console.log('🔍 Test 7: Testing microphone permissions...');
    
    const microphoneTest = await page.evaluate(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const hasAudio = stream.getAudioTracks().length > 0;
        stream.getTracks().forEach(track => track.stop());
        return { hasPermission: true, hasAudio };
      } catch (error) {
        return { hasPermission: false, error: error.message };
      }
    });
    
    console.log('📊 Microphone Test Results:');
    console.log(`   Microphone Permission: ${microphoneTest.hasPermission ? '✅' : '❌'}`);
    if (microphoneTest.hasPermission) {
      console.log(`   Audio Tracks Available: ${microphoneTest.hasAudio ? '✅' : '❌'}`);
    } else {
      console.log(`   Error: ${microphoneTest.error}`);
    }
    
    // Take final screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ path: 'debug-stt-tts-final.png', fullPage: true });
    
    // Summary
    console.log('\n📋 STT/TTS Test Summary:');
    console.log('================================');
    console.log(`Voice Controls Present: ${voiceControls ? '✅' : '❌'}`);
    console.log(`Speech Recognition: ${voiceServiceTest.hasSpeechRecognition ? '✅' : '❌'}`);
    console.log(`Speech Synthesis: ${voiceServiceTest.hasSpeechSynthesis ? '✅' : '❌'}`);
    console.log(`Media Recording: ${voiceServiceTest.hasMediaRecorder ? '✅' : '❌'}`);
    console.log(`Microphone Access: ${microphoneTest.hasPermission ? '✅' : '❌'}`);
    console.log(`Dynamic Voice Gen: ${dynamicVoiceTest.hasDynamicVoiceGenerator ? '✅' : '❌'}`);
    console.log(`Available Voices: ${voiceServiceTest.availableVoices}`);
    
  } catch (error) {
    console.error('❌ Error during STT/TTS testing:', error);
    await page.screenshot({ path: 'debug-stt-tts-error.png', fullPage: true });
  } finally {
    console.log('🎭 Closing browser...');
    await browser.close();
  }
}

debugSTTTTSSystems().catch(console.error);

