const { chromium } = require('playwright');

async function testVoiceFeatures() {
  console.log('🚀 Testing STT/TTS voice features in WhoseApp...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to the game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    // Wait for the game to load
    await page.waitForTimeout(3000);
    
    console.log('📱 Opening WhoseApp...');
    
    // Click on WhoseApp tab in the center panel
    const whoseappTab = await page.$('button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      await whoseappTab.click();
      await page.waitForTimeout(2000);
      
      console.log('💬 Looking for conversations...');
      const conversationItems = await page.$$('.conversation-item');
      
      if (conversationItems.length > 0) {
        console.log('🔍 Clicking on first conversation...');
        await conversationItems[0].click();
        await page.waitForTimeout(2000);
        
        // Look for voice mode toggle
        console.log('🎤 Looking for voice mode toggle...');
        const voiceModeToggle = await page.$('button[title*="voice mode"]');
        
        if (voiceModeToggle) {
          console.log('✅ Voice mode toggle found!');
          
          // Click to enable voice mode
          console.log('🔄 Enabling voice mode...');
          await voiceModeToggle.click();
          await page.waitForTimeout(1000);
          
          // Check if voice controls appeared
          const voiceControls = await page.$('.voice-controls');
          if (voiceControls) {
            console.log('✅ Voice controls panel appeared!');
            
            // Check for STT support
            const sttButton = await page.$('button:has-text("Speak")');
            console.log(`🗣️ STT Button found: ${sttButton ? 'Yes' : 'No'}`);
            
            // Check for recording support
            const recordButton = await page.$('button:has-text("Record")');
            console.log(`🎤 Record Button found: ${recordButton ? 'Yes' : 'No'}`);
            
            // Check for TTS support
            const ttsButton = await page.$('button:has-text("Speak")');
            console.log(`🔊 TTS Button found: ${ttsButton ? 'Yes' : 'No'}`);
            
            // Test permission request (if needed)
            const permissionRequest = await page.$('.permission-request');
            if (permissionRequest) {
              console.log('🔐 Microphone permission required');
              const grantButton = await page.$('button:has-text("Grant Permission")');
              if (grantButton) {
                console.log('🖱️ Clicking grant permission...');
                await grantButton.click();
                await page.waitForTimeout(2000);
              }
            } else {
              console.log('✅ No permission request needed');
            }
            
            // Test voice controls visibility
            const voiceButtons = await page.$$('.voice-button');
            console.log(`🎛️ Found ${voiceButtons.length} voice control buttons`);
            
            // Test voice mode toggle back to text
            console.log('⌨️ Switching back to text mode...');
            await voiceModeToggle.click();
            await page.waitForTimeout(1000);
            
            const voiceControlsAfterToggle = await page.$('.voice-controls');
            if (!voiceControlsAfterToggle) {
              console.log('✅ Voice controls hidden when switching to text mode');
            } else {
              console.log('⚠️ Voice controls still visible after toggle');
            }
            
          } else {
            console.log('❌ Voice controls panel did not appear');
          }
          
        } else {
          console.log('❌ Voice mode toggle not found');
        }
        
        // Test TTS buttons on messages
        console.log('🔊 Testing TTS buttons on messages...');
        const ttsMessageButtons = await page.$$('button[title*="Read aloud"], button[title*="TTS"]');
        console.log(`🔊 Found ${ttsMessageButtons.length} TTS buttons on messages`);
        
        if (ttsMessageButtons.length > 0) {
          console.log('🖱️ Testing TTS button click...');
          await ttsMessageButtons[0].click();
          await page.waitForTimeout(1000);
          console.log('✅ TTS button clicked (audio may be playing)');
        }
        
        // Test main TTS button for last character message
        const mainTTSButton = await page.$('button[title*="Speak last character message"]');
        if (mainTTSButton) {
          console.log('🔊 Testing main TTS button...');
          await mainTTSButton.click();
          await page.waitForTimeout(1000);
          console.log('✅ Main TTS button clicked');
        } else {
          console.log('❌ Main TTS button not found');
        }
        
        // Test message input with voice features
        console.log('📝 Testing message input with voice features...');
        const messageInput = await page.$('textarea[placeholder*="Message"]');
        if (messageInput) {
          await messageInput.fill('This is a test message for TTS functionality!');
          
          // Test send button state
          const sendButton = await page.$('button:has-text("Send")');
          if (sendButton) {
            const isEnabled = await sendButton.isEnabled();
            console.log(`📤 Send button enabled with text: ${isEnabled}`);
          }
        }
        
      } else {
        console.log('❌ No conversations found');
      }
    } else {
      console.log('❌ WhoseApp tab not found');
    }
    
    // Check browser support for voice features
    console.log('🔍 Checking browser voice feature support...');
    const voiceSupport = await page.evaluate(() => {
      return {
        speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
        speechSynthesis: 'speechSynthesis' in window,
        mediaRecorder: 'MediaRecorder' in window,
        getUserMedia: navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      };
    });
    
    console.log('🎤 Browser Support:');
    console.log(`  - Speech Recognition (STT): ${voiceSupport.speechRecognition ? '✅' : '❌'}`);
    console.log(`  - Speech Synthesis (TTS): ${voiceSupport.speechSynthesis ? '✅' : '❌'}`);
    console.log(`  - Media Recorder: ${voiceSupport.mediaRecorder ? '✅' : '❌'}`);
    console.log(`  - getUserMedia: ${voiceSupport.getUserMedia ? '✅' : '❌'}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'voice-features-test.png', fullPage: true });
    console.log('📸 Screenshot saved as voice-features-test.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 Voice features test complete');
  }
}

testVoiceFeatures();

