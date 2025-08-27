const { chromium } = require('playwright');

async function testChannelVoiceFeatures() {
  console.log('🚀 Testing channel voice features with multiple characters...');
  
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
      
      console.log('📺 Switching to Channels tab...');
      const channelsTab = await page.$('button:has-text("📺 Channels")');
      if (channelsTab) {
        await channelsTab.click();
        await page.waitForTimeout(2000);
        
        console.log('🔍 Looking for channels...');
        const channelItems = await page.$$('.channel-item');
        console.log(`📺 Found ${channelItems.length} channels`);
        
        if (channelItems.length > 0) {
          console.log('🖱️ Clicking on first channel...');
          await channelItems[0].click();
          await page.waitForTimeout(3000);
          
          // Check if channel participants component appeared
          console.log('👥 Checking for channel participants...');
          const participantsComponent = await page.$('.channel-participants');
          
          if (participantsComponent) {
            console.log('✅ Channel participants component found!');
            
            // Check participants grid
            const participantCards = await page.$$('.participant-card');
            console.log(`👤 Found ${participantCards.length} participant cards`);
            
            // Check for player participants
            const playerCards = await page.$$('.participant-card.player');
            console.log(`🎮 Found ${playerCards.length} player participants`);
            
            // Check for character participants
            const characterCards = await page.$$('.participant-card:not(.player)');
            console.log(`🎭 Found ${characterCards.length} character participants`);
            
            // Test voice controls on participants
            console.log('🔊 Testing participant voice controls...');
            const voiceToggles = await page.$$('.voice-toggle');
            console.log(`🎛️ Found ${voiceToggles.length} voice toggle buttons`);
            
            if (voiceToggles.length > 0) {
              console.log('🖱️ Testing voice toggle...');
              await voiceToggles[0].click();
              await page.waitForTimeout(1000);
              
              // Check if toggle state changed
              const toggleState = await voiceToggles[0].getAttribute('class');
              console.log(`🔊 Voice toggle state: ${toggleState}`);
            }
            
            // Test "Enable All" / "Mute All" button
            const toggleAllButton = await page.$('button:has-text("Enable All"), button:has-text("Mute All")');
            if (toggleAllButton) {
              console.log('🔊 Testing toggle all voices...');
              const buttonText = await toggleAllButton.textContent();
              console.log(`📢 Toggle all button: ${buttonText}`);
              
              await toggleAllButton.click();
              await page.waitForTimeout(1000);
              
              const newButtonText = await toggleAllButton.textContent();
              console.log(`📢 After click: ${newButtonText}`);
            }
            
            // Test participant profile clicks
            console.log('👤 Testing participant profile clicks...');
            const participantAvatars = await page.$$('.participant-avatar');
            if (participantAvatars.length > 0) {
              console.log('🖱️ Clicking on participant avatar...');
              await participantAvatars[0].click();
              await page.waitForTimeout(2000);
              
              // Check if character profile modal opened
              const profileModal = await page.$('.character-profile-modal');
              if (profileModal) {
                console.log('✅ Character profile opened from channel participant!');
                
                // Close the modal
                const closeButton = await page.$('.close-button');
                if (closeButton) {
                  await closeButton.click();
                  await page.waitForTimeout(500);
                }
              } else {
                console.log('❌ Character profile did not open');
              }
            }
            
            // Test channel voice mode
            console.log('🎤 Testing channel voice mode...');
            const voiceModeToggle = await page.$('button[title*="voice mode"]');
            if (voiceModeToggle) {
              console.log('🔄 Enabling voice mode in channel...');
              await voiceModeToggle.click();
              await page.waitForTimeout(1000);
              
              // Check if voice controls appeared
              const channelVoiceControls = await page.$('.voice-controls');
              if (channelVoiceControls) {
                console.log('✅ Channel voice controls appeared!');
                
                // Test voice controls in channel context
                const channelSTTButton = await page.$('button:has-text("Speak")');
                const channelRecordButton = await page.$('button:has-text("Record")');
                
                console.log(`🗣️ Channel STT Button: ${channelSTTButton ? 'Found' : 'Not found'}`);
                console.log(`🎤 Channel Record Button: ${channelRecordButton ? 'Found' : 'Not found'}`);
              } else {
                console.log('❌ Channel voice controls did not appear');
              }
            }
            
            // Test message TTS with speaking indicators
            console.log('🔊 Testing message TTS with speaking indicators...');
            const messageTTSButtons = await page.$$('button[title*="Read aloud"], button[title*="TTS"]');
            console.log(`🔊 Found ${messageTTSButtons.length} message TTS buttons`);
            
            if (messageTTSButtons.length > 0) {
              console.log('🖱️ Testing TTS with speaking indicator...');
              await messageTTSButtons[0].click();
              await page.waitForTimeout(2000);
              
              // Check for speaking indicators
              const speakingCards = await page.$$('.participant-card.speaking');
              console.log(`🗣️ Found ${speakingCards.length} participants with speaking indicator`);
              
              const speakingRings = await page.$$('.speaking-ring');
              console.log(`💫 Found ${speakingRings.length} speaking animation rings`);
              
              const soundWaves = await page.$$('.sound-waves');
              console.log(`🌊 Found ${soundWaves.length} sound wave animations`);
              
              // Wait for speaking to finish
              await page.waitForTimeout(3000);
            }
            
            // Test voice status display
            console.log('📊 Checking voice status display...');
            const voiceStats = await page.$('.voice-stats');
            if (voiceStats) {
              const statsText = await voiceStats.textContent();
              console.log(`📊 Voice stats: ${statsText}`);
            }
            
            // Test channel message input
            console.log('💬 Testing channel message input...');
            const channelMessageInput = await page.$('textarea[placeholder*="#"]');
            if (channelMessageInput) {
              const placeholder = await channelMessageInput.getAttribute('placeholder');
              console.log(`📝 Channel message placeholder: ${placeholder}`);
              
              // Test sending a message in channel
              await channelMessageInput.fill('Testing channel voice message!');
              
              const channelSendButton = await page.$('button:has-text("Send")');
              if (channelSendButton) {
                const isEnabled = await channelSendButton.isEnabled();
                console.log(`📤 Channel send button enabled: ${isEnabled}`);
                
                if (isEnabled) {
                  await channelSendButton.click();
                  await page.waitForTimeout(1000);
                  console.log('✅ Message sent in channel');
                }
              }
            }
            
          } else {
            console.log('❌ Channel participants component not found');
          }
          
          // Test back to channels navigation
          console.log('🔙 Testing back to channels navigation...');
          const backButton = await page.$('button:has-text("← Back to Channels")');
          if (backButton) {
            await backButton.click();
            await page.waitForTimeout(1000);
            
            const channelsList = await page.$('.channels-list');
            if (channelsList) {
              console.log('✅ Successfully navigated back to channels list');
            }
          }
          
        } else {
          console.log('❌ No channels found');
        }
      } else {
        console.log('❌ Channels tab not found');
      }
    } else {
      console.log('❌ WhoseApp tab not found');
    }
    
    // Test voice service character assignments
    console.log('🎭 Testing voice service character assignments...');
    const voiceServiceTest = await page.evaluate(() => {
      // Test if voice service is available globally
      if (window.voiceService) {
        const testCharacters = ['char_diplomat_001', 'char_economist_001', 'char_commander_001'];
        const results = {};
        
        testCharacters.forEach(charId => {
          results[charId] = {
            hasVoice: window.voiceService.hasCharacterVoice(charId),
            voice: window.voiceService.getCharacterVoice(charId),
            previewText: window.voiceService.getVoicePreviewText(charId)
          };
        });
        
        return {
          available: true,
          characters: results,
          supportedFeatures: {
            stt: window.voiceService.isSTTSupported(),
            tts: window.voiceService.isTTSSupported(),
            recording: window.voiceService.isRecordingSupported()
          }
        };
      }
      return { available: false };
    });
    
    if (voiceServiceTest.available) {
      console.log('✅ Voice service is available');
      console.log(`🎤 STT Supported: ${voiceServiceTest.supportedFeatures.stt}`);
      console.log(`🔊 TTS Supported: ${voiceServiceTest.supportedFeatures.tts}`);
      console.log(`🎙️ Recording Supported: ${voiceServiceTest.supportedFeatures.recording}`);
      
      Object.entries(voiceServiceTest.characters).forEach(([charId, data]) => {
        console.log(`🎭 ${charId}: Voice=${data.hasVoice}, Preview="${data.previewText?.substring(0, 50)}..."`);
      });
    } else {
      console.log('⚠️ Voice service not globally available (expected in module system)');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'channel-voice-features-test.png', fullPage: true });
    console.log('📸 Screenshot saved as channel-voice-features-test.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 Channel voice features test complete');
  }
}

testChannelVoiceFeatures();

