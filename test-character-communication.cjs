const { chromium } = require('playwright');

async function testCharacterCommunication() {
  console.log('🚀 Testing character communication functionality...');
  
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
      
      console.log('👥 Switching to Characters tab...');
      const charactersTab = await page.$('button:has-text("👥 Characters")');
      if (charactersTab) {
        await charactersTab.click();
        await page.waitForTimeout(2000);
        
        console.log('🔍 Looking for character communication buttons...');
        
        // Look for text buttons
        const textButtons = await page.$$('button:has-text("💬 Text")');
        console.log(`📝 Found ${textButtons.length} text buttons`);
        
        // Look for call buttons  
        const callButtons = await page.$$('button:has-text("📞 Call")');
        console.log(`📞 Found ${callButtons.length} call buttons`);
        
        if (textButtons.length > 0) {
          console.log('💬 Testing text functionality...');
          
          // Click on first text button
          await textButtons[0].click();
          await page.waitForTimeout(2000);
          
          // Check if we switched to conversations tab
          const conversationsContent = await page.$('.conversation-messages');
          if (conversationsContent) {
            console.log('✅ Text conversation created successfully!');
            
            // Check for welcome message
            const messages = await page.$$('.message-item');
            console.log(`📨 Found ${messages.length} messages in new conversation`);
            
            // Try sending a message
            const messageInput = await page.$('input[placeholder*="message"], textarea[placeholder*="message"]');
            if (messageInput) {
              console.log('⌨️ Sending test message...');
              await messageInput.fill('Hello! This is a test message.');
              
              // Look for send button
              const sendButton = await page.$('button:has-text("Send"), button[title*="Send"]');
              if (sendButton) {
                await sendButton.click();
                await page.waitForTimeout(1000);
                
                const messagesAfterSend = await page.$$('.message-item');
                console.log(`📨 Messages after sending: ${messagesAfterSend.length}`);
                
                if (messagesAfterSend.length > messages.length) {
                  console.log('✅ Message sent successfully!');
                } else {
                  console.log('⚠️ Message may not have been sent');
                }
              } else {
                console.log('❌ Send button not found');
              }
            } else {
              console.log('❌ Message input not found');
            }
          } else {
            console.log('❌ Conversation view not opened');
          }
          
          // Go back to characters tab for call test
          console.log('🔄 Returning to Characters tab...');
          const charactersTabAgain = await page.$('button:has-text("👥 Characters")');
          if (charactersTabAgain) {
            await charactersTabAgain.click();
            await page.waitForTimeout(1000);
          }
        }
        
        if (callButtons.length > 0) {
          console.log('📞 Testing call functionality...');
          
          // Click on first call button
          await callButtons[0].click();
          await page.waitForTimeout(3000);
          
          // Check if call conversation was created
          const callMessages = await page.$$('.message-item');
          console.log(`📞 Found ${callMessages.length} messages in call conversation`);
          
          // Look for system messages indicating call
          const systemMessages = await page.$$eval('.message-item', messages => 
            messages.filter(msg => msg.textContent.includes('Call initiated') || msg.textContent.includes('Call connected')).length
          );
          console.log(`📞 Found ${systemMessages} call-related system messages`);
          
          if (systemMessages > 0) {
            console.log('✅ Call initiated successfully!');
          } else {
            console.log('⚠️ Call system messages not found');
          }
        }
        
        // Test character profile access from characters tab
        console.log('👤 Testing character profile access...');
        const characterAvatars = await page.$$('img[alt*="Ambassador"], img[alt*="Dr."], img[alt*="Marcus"]');
        if (characterAvatars.length > 0) {
          console.log('🖱️ Clicking on character avatar for profile...');
          await characterAvatars[0].click();
          await page.waitForTimeout(2000);
          
          const profileModal = await page.$('.character-profile-modal');
          if (profileModal) {
            console.log('✅ Character profile opened from characters tab!');
            
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
        
      } else {
        console.log('❌ Characters tab not found');
      }
    } else {
      console.log('❌ WhoseApp tab not found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'character-communication-test.png', fullPage: true });
    console.log('📸 Screenshot saved as character-communication-test.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 Character communication test complete');
  }
}

testCharacterCommunication();

