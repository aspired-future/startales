const { chromium } = require('playwright');

async function testVoiceConversations() {
  console.log('🎭 Testing Voice Conversations...');
  
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
    if (text.includes('Voice') || text.includes('STT') || text.includes('TTS') || 
        text.includes('🎤') || text.includes('🔊') || text.includes('Recording') ||
        text.includes('transcript') || text.includes('speech')) {
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
      
      // Check if voice mode toggle is available
      console.log('🔍 Looking for voice mode toggle...');
      const voiceModeButton = await page.$('button[title*="voice mode"], button:has-text("⌨️"), button:has-text("🎤")');
      
      if (voiceModeButton) {
        console.log('✅ Voice mode toggle found');
        
        // Get current mode
        const buttonText = await voiceModeButton.textContent();
        console.log(`📊 Current mode: ${buttonText === '⌨️' ? 'Text' : 'Voice'}`);
        
        // Toggle to voice mode if not already
        if (buttonText === '⌨️') {
          console.log('🖱️ Switching to voice mode...');
          await voiceModeButton.click();
          await page.waitForTimeout(1000);
        }
        
        // Check if VoiceControls appeared
        console.log('🔍 Looking for VoiceControls...');
        const voiceControls = await page.$('.voice-controls, [data-testid="voice-controls"]');
        
        if (voiceControls) {
          console.log('✅ VoiceControls component found');
          
          // Look for STT button
          const sttButton = await page.$('button:has-text("🎤"), .stt-button, [title*="record"], [aria-label*="record"]');
          if (sttButton) {
            console.log('✅ STT button found');
            
            console.log('🖱️ Testing voice recording...');
            await sttButton.click();
            await page.waitForTimeout(1000);
            
            // Check if recording started
            const isRecording = await page.evaluate(() => {
              return document.querySelector('.recording, [data-recording="true"], .voice-recording') !== null;
            });
            
            if (isRecording) {
              console.log('✅ Voice recording started');
              
              // Simulate speaking for 2 seconds
              await page.waitForTimeout(2000);
              
              // Try to stop recording
              const stopButton = await page.$('button:has-text("⏹️"), button:has-text("Stop"), .stop-recording');
              if (stopButton) {
                await stopButton.click();
                console.log('✅ Voice recording stopped');
                await page.waitForTimeout(1000);
              }
            } else {
              console.log('❌ Voice recording did not start');
            }
          } else {
            console.log('❌ STT button not found');
          }
          
          // Look for TTS controls
          const ttsControls = await page.$$('button:has-text("🔊"), .tts-button, [title*="speak"], [aria-label*="speak"]');
          console.log(`📊 Found ${ttsControls.length} TTS controls in voice interface`);
          
        } else {
          console.log('❌ VoiceControls component not found');
        }
        
      } else {
        console.log('❌ Voice mode toggle not found');
      }
      
      // Test message TTS buttons
      console.log('🔍 Looking for message TTS buttons...');
      const messageTTSButtons = await page.$$('.message-item button:has-text("🔊"), .message button[title*="speak"]');
      console.log(`📊 Found ${messageTTSButtons.length} message TTS buttons`);
      
      if (messageTTSButtons.length > 0) {
        console.log('🖱️ Testing message TTS...');
        await messageTTSButtons[0].click();
        await page.waitForTimeout(2000);
      }
      
    } else {
      console.log('❌ No text buttons found to start conversation');
    }
    
    // Test channel voice features
    console.log('🔍 Testing channel voice features...');
    
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
        
        // Check for voice mode in channel
        const channelVoiceButton = await page.$('button[title*="voice mode"], button:has-text("⌨️"), button:has-text("🎤")');
        if (channelVoiceButton) {
          console.log('✅ Channel voice mode available');
          
          // Toggle to voice mode
          const buttonText = await channelVoiceButton.textContent();
          if (buttonText === '⌨️') {
            console.log('🖱️ Enabling voice mode in channel...');
            await channelVoiceButton.click();
            await page.waitForTimeout(1000);
          }
          
          // Look for channel participants with voice indicators
          const participants = await page.$$('.channel-participants .participant, .voice-participants .participant');
          console.log(`📊 Found ${participants.length} channel participants`);
          
        } else {
          console.log('❌ Channel voice mode not available');
        }
      }
    }
    
    // Test voice service functionality
    console.log('🔍 Testing voice service integration...');
    
    const voiceServiceStatus = await page.evaluate(() => {
      return {
        voiceServiceAvailable: typeof window.voiceService !== 'undefined',
        dynamicVoiceGenerator: typeof window.dynamicVoiceGenerator !== 'undefined',
        sttSupported: window.voiceService ? window.voiceService.isSTTSupported() : false,
        ttsSupported: window.voiceService ? window.voiceService.isTTSSupported() : false,
        recordingSupported: window.voiceService ? window.voiceService.isRecordingSupported() : false
      };
    });
    
    console.log('📊 Voice Service Status:');
    Object.entries(voiceServiceStatus).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? '✅' : '❌'}`);
    });
    
    // Take screenshot
    await page.screenshot({ path: 'debug-voice-conversations.png', fullPage: true });
    
    console.log('✅ Voice conversation test completed');
    
  } catch (error) {
    console.error('❌ Error during voice conversation testing:', error);
    await page.screenshot({ path: 'debug-voice-conversations-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testVoiceConversations().catch(console.error);
