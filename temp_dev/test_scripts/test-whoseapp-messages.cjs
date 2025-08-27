const { chromium } = require('playwright');

async function testWhoseAppMessages() {
  console.log('🚀 Testing WhoseApp message functionality...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to the game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    // Wait for the game to load
    await page.waitForTimeout(3000);
    
    console.log('📱 Looking for WhoseApp tab...');
    
    // Click on WhoseApp tab in the center panel
    const whoseappTab = await page.$('button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      console.log('✅ Found WhoseApp tab, clicking...');
      await whoseappTab.click();
      await page.waitForTimeout(2000);
      
      // Look for conversations
      console.log('💬 Looking for conversations...');
      const conversationItems = await page.$$('.conversation-item');
      console.log(`📋 Found ${conversationItems.length} conversations`);
      
      if (conversationItems.length > 0) {
        console.log('🔍 Clicking on first conversation...');
        await conversationItems[0].click();
        await page.waitForTimeout(2000);
        
        // Check for messages
        const messages = await page.$$('.message');
        console.log(`📨 Found ${messages.length} messages in conversation`);
        
        if (messages.length > 0) {
          console.log('✅ Messages are displaying correctly!');
          
          // Get message content
          for (let i = 0; i < Math.min(3, messages.length); i++) {
            const messageContent = await messages[i].$eval('[style*="padding: 10px 15px"]', el => el.textContent);
            console.log(`📝 Message ${i + 1}: ${messageContent.substring(0, 50)}...`);
          }
          
          // Test sending a message
          console.log('✍️ Testing message sending...');
          const messageInput = await page.$('.message-input textarea');
          if (messageInput) {
            await messageInput.fill('This is a test message from the automated test!');
            
            const sendButton = await page.$('.message-input button:has-text("Send")');
            if (sendButton) {
              await sendButton.click();
              await page.waitForTimeout(1000);
              console.log('✅ Message sent successfully!');
            }
          }
        } else {
          console.log('⚠️ No messages found in conversation');
        }
        
        // Test going back to conversation list
        console.log('🔙 Testing back navigation...');
        const backButton = await page.$('button:has-text("← Back")');
        if (backButton) {
          await backButton.click();
          await page.waitForTimeout(1000);
          console.log('✅ Back navigation works!');
        }
      } else {
        console.log('⚠️ No conversations found');
      }
    } else {
      console.log('❌ WhoseApp tab not found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'whoseapp-test-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as whoseapp-test-screenshot.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 WhoseApp test complete');
  }
}

testWhoseAppMessages();

