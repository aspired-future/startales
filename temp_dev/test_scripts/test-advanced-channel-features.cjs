const { chromium } = require('playwright');

async function testAdvancedChannelFeatures() {
  console.log('🚀 Testing advanced channel features: messaging, summits, and dynamic voices...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to the game...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    // Wait for the game to load
    await page.waitForTimeout(3000);
    
    console.log('📱 Opening WhoseApp...');
    
    // Navigate to WhoseApp
    const whoseappTab = await page.$('button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      await whoseappTab.click();
      await page.waitForTimeout(2000);
      
      console.log('📺 Testing Channels tab...');
      const channelsTab = await page.$('button:has-text("📺 Channels")');
      if (channelsTab) {
        await channelsTab.click();
        await page.waitForTimeout(2000);
        
        // Test channel selection and messaging
        console.log('🔍 Looking for channels...');
        const channelItems = await page.$$('.channel-item');
        console.log(`📺 Found ${channelItems.length} channels`);
        
        if (channelItems.length > 0) {
          console.log('🖱️ Clicking on first channel...');
          await channelItems[0].click();
          await page.waitForTimeout(3000);
          
          // Test channel participants component
          console.log('👥 Testing channel participants...');
          const participantsComponent = await page.$('.channel-participants');
          
          if (participantsComponent) {
            console.log('✅ Channel participants component found!');
            
            // Test voice controls
            const voiceToggles = await page.$$('.voice-toggle');
            console.log(`🎛️ Found ${voiceToggles.length} voice toggle buttons`);
            
            // Test "Enable All" voices
            const enableAllButton = await page.$('button:has-text("Enable All"), button:has-text("🔊 Enable All")');
            if (enableAllButton) {
              console.log('🔊 Testing enable all voices...');
              await enableAllButton.click();
              await page.waitForTimeout(1000);
            }
            
            // Test channel messaging
            console.log('💬 Testing channel messaging...');
            const messageInput = await page.$('textarea[placeholder*="#"]');
            if (messageInput) {
              console.log('📝 Sending test message to channel...');
              await messageInput.fill('Hello everyone! This is a test message for character responses.');
              
              const sendButton = await page.$('button:has-text("Send")');
              if (sendButton && await sendButton.isEnabled()) {
                await sendButton.click();
                await page.waitForTimeout(2000);
                console.log('✅ Message sent to channel');
                
                // Wait for potential character responses
                console.log('⏳ Waiting for character responses...');
                await page.waitForTimeout(8000);
                
                // Check for new messages
                const messages = await page.$$('.message');
                console.log(`💬 Total messages in channel: ${messages.length}`);
                
                // Look for character responses
                const characterMessages = await page.$$('.message:not(.sent)');
                console.log(`🤖 Character responses: ${characterMessages.length}`);
              }
            }
            
            // Test summit scheduling
            console.log('📅 Testing summit scheduling...');
            
            // Look for summit/schedule button (we'll need to add this to the UI)
            const scheduleButton = await page.$('button:has-text("Schedule"), button:has-text("Summit"), .new-channel-btn');
            if (scheduleButton) {
              console.log('🖱️ Opening summit scheduler...');
              await scheduleButton.click();
              await page.waitForTimeout(2000);
              
              // Check if summit scheduler opened
              const summitScheduler = await page.$('.summit-scheduler');
              if (summitScheduler) {
                console.log('✅ Summit scheduler opened!');
                
                // Test step navigation
                const stepIndicator = await page.$('.step-indicator');
                if (stepIndicator) {
                  console.log('📋 Step indicator found');
                  
                  // Fill in summit details
                  const titleInput = await page.$('input[placeholder*="summit title"], .summit-input');
                  if (titleInput) {
                    await titleInput.fill('Test Strategic Summit');
                    console.log('📝 Summit title entered');
                  }
                  
                  // Test next button
                  const nextButton = await page.$('button:has-text("Next")');
                  if (nextButton && await nextButton.isEnabled()) {
                    await nextButton.click();
                    await page.waitForTimeout(1000);
                    console.log('➡️ Moved to participants step');
                    
                    // Test participant selection
                    const participantCards = await page.$$('.participant-card');
                    console.log(`👥 Found ${participantCards.length} available participants`);
                    
                    if (participantCards.length > 0) {
                      // Select first few participants
                      for (let i = 0; i < Math.min(3, participantCards.length); i++) {
                        await participantCards[i].click();
                        await page.waitForTimeout(300);
                      }
                      console.log('✅ Participants selected');
                      
                      // Continue to timing step
                      const nextButton2 = await page.$('button:has-text("Next")');
                      if (nextButton2 && await nextButton2.isEnabled()) {
                        await nextButton2.click();
                        await page.waitForTimeout(1000);
                        console.log('⏰ Moved to timing step');
                        
                        // Set date/time
                        const dateTimeInput = await page.$('input[type="datetime-local"]');
                        if (dateTimeInput) {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          tomorrow.setHours(14, 0, 0, 0);
                          const dateTimeString = tomorrow.toISOString().slice(0, 16);
                          
                          await dateTimeInput.fill(dateTimeString);
                          console.log('📅 Summit date/time set');
                          
                          // Continue to review
                          const nextButton3 = await page.$('button:has-text("Next")');
                          if (nextButton3 && await nextButton3.isEnabled()) {
                            await nextButton3.click();
                            await page.waitForTimeout(1000);
                            console.log('📋 Moved to review step');
                            
                            // Check review content
                            const reviewSections = await page.$$('.review-section');
                            console.log(`📄 Review sections: ${reviewSections.length}`);
                            
                            // Test schedule button
                            const scheduleSubmitButton = await page.$('button:has-text("Schedule Summit")');
                            if (scheduleSubmitButton) {
                              console.log('✅ Summit ready to schedule!');
                              // Don't actually schedule to avoid cluttering test data
                            }
                          }
                        }
                      }
                    }
                  }
                }
                
                // Close summit scheduler
                const closeButton = await page.$('.close-btn, button:has-text("✕")');
                if (closeButton) {
                  await closeButton.click();
                  await page.waitForTimeout(1000);
                  console.log('❌ Summit scheduler closed');
                }
              } else {
                console.log('❌ Summit scheduler did not open');
              }
            } else {
              console.log('⚠️ No schedule/summit button found (expected - needs UI integration)');
            }
            
          } else {
            console.log('❌ Channel participants component not found');
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
    
    // Test dynamic voice generation
    console.log('🎭 Testing dynamic voice generation...');
    const voiceGenerationTest = await page.evaluate(() => {
      // Test if dynamic voice generator is available
      if (window.dynamicVoiceGenerator || window.voiceService) {
        const testCharacterTraits = {
          id: 'test_char_001',
          name: 'Test Character',
          gender: 'female',
          age: 35,
          personality: ['diplomatic', 'calm', 'authoritative'],
          background: 'Former ambassador with extensive negotiation experience',
          role: 'diplomat',
          department: 'Foreign Affairs',
          nationality: 'american'
        };
        
        try {
          // Test voice generation (if available globally)
          if (window.voiceService && window.voiceService.generateCharacterVoice) {
            const generatedVoice = window.voiceService.generateCharacterVoice(testCharacterTraits);
            return {
              available: true,
              voiceGenerated: !!generatedVoice,
              voiceProfile: generatedVoice,
              previewText: window.voiceService.getDynamicPreviewText ? 
                window.voiceService.getDynamicPreviewText(testCharacterTraits) : null
            };
          }
          
          return { available: false, reason: 'Voice service not globally available' };
        } catch (error) {
          return { available: false, error: error.message };
        }
      }
      
      return { available: false, reason: 'Dynamic voice generator not found' };
    });
    
    if (voiceGenerationTest.available) {
      console.log('✅ Dynamic voice generation is working!');
      console.log(`🎤 Voice generated: ${voiceGenerationTest.voiceGenerated}`);
      if (voiceGenerationTest.voiceProfile) {
        console.log(`🔊 Voice profile: Rate=${voiceGenerationTest.voiceProfile.rate}, Pitch=${voiceGenerationTest.voiceProfile.pitch}`);
      }
      if (voiceGenerationTest.previewText) {
        console.log(`💬 Preview text: "${voiceGenerationTest.previewText.substring(0, 50)}..."`);
      }
    } else {
      console.log(`⚠️ Dynamic voice generation: ${voiceGenerationTest.reason || voiceGenerationTest.error}`);
    }
    
    // Test channel messaging service
    console.log('🤖 Testing channel messaging service...');
    const messagingTest = await page.evaluate(() => {
      // Test if channel messaging service is available
      if (window.channelMessagingService) {
        try {
          // Test message sending
          const testMessage = window.channelMessagingService.sendMessage(
            'test_channel_001',
            'player_001',
            'This is a test message for AI responses'
          );
          
          return {
            available: true,
            messageSent: !!testMessage,
            serviceActive: true
          };
        } catch (error) {
          return { available: false, error: error.message };
        }
      }
      
      return { available: false, reason: 'Channel messaging service not globally available' };
    });
    
    if (messagingTest.available) {
      console.log('✅ Channel messaging service is working!');
      console.log(`📤 Message sent: ${messagingTest.messageSent}`);
    } else {
      console.log(`⚠️ Channel messaging service: ${messagingTest.reason || messagingTest.error}`);
    }
    
    // Test voice controls in channel context
    console.log('🎤 Testing voice controls in channel...');
    const voiceModeToggle = await page.$('button[title*="voice mode"]');
    if (voiceModeToggle) {
      console.log('🔄 Enabling voice mode in channel...');
      await voiceModeToggle.click();
      await page.waitForTimeout(1000);
      
      // Check if voice controls appeared
      const voiceControls = await page.$('.voice-controls-container');
      if (voiceControls) {
        console.log('✅ Voice controls appeared in channel!');
        
        // Test voice control buttons
        const sttButton = await page.$('button:has-text("STT")');
        const recordButton = await page.$('button:has-text("Record")');
        
        console.log(`🗣️ STT Button: ${sttButton ? 'Found' : 'Not found'}`);
        console.log(`🎙️ Record Button: ${recordButton ? 'Found' : 'Not found'}`);
      }
    }
    
    // Take a screenshot of the final state
    await page.screenshot({ path: 'advanced-channel-features-test.png', fullPage: true });
    console.log('📸 Screenshot saved as advanced-channel-features-test.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 Advanced channel features test complete');
  }
}

testAdvancedChannelFeatures();

