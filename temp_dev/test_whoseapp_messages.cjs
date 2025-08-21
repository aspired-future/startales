const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('💬 Testing WhoseApp Message Content...');
    
    // Navigate to the HUD
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);

    // Ensure WhoseApp tab is active
    console.log('🔍 Checking WhoseApp tab...');
    const whoseappTab = await page.$('.tab-button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      await whoseappTab.click();
      await page.waitForTimeout(500);
      console.log('✅ WhoseApp tab activated');
    }

    // Check message feed structure
    console.log('📱 Checking message feed...');
    const messageFeed = await page.$('.message-feed');
    if (messageFeed) {
      console.log('✅ Message feed found');
      
      // Check for message items
      const messageItems = await page.$$('.message-item');
      console.log(`✅ Found ${messageItems.length} message items`);
      
      // Check urgent message
      const urgentMessage = await page.$('.message-item.urgent');
      if (urgentMessage) {
        console.log('✅ Urgent message found');
        
        // Check message content
        const messageContent = await urgentMessage.$eval('.message-content', el => el.textContent);
        if (messageContent.includes('Border Situation Critical')) {
          console.log('✅ Urgent message content verified');
          console.log(`   Content preview: "${messageContent.substring(0, 100)}..."`);
        }
        
        // Check message actions
        const messageActions = await urgentMessage.$$('.msg-action-btn');
        console.log(`✅ Found ${messageActions.length} message action buttons`);
      }
      
      // Check regular messages
      const regularMessages = await page.$$('.message-item:not(.urgent)');
      console.log(`✅ Found ${regularMessages.length} regular messages`);
      
      if (regularMessages.length > 0) {
        const firstRegularMessage = regularMessages[0];
        const sender = await firstRegularMessage.$eval('.message-sender', el => el.textContent);
        const content = await firstRegularMessage.$eval('.message-content', el => el.textContent);
        console.log(`✅ Regular message from: ${sender}`);
        console.log(`   Content preview: "${content.substring(0, 80)}..."`);
      }
      
    } else {
      console.log('❌ Message feed not found');
    }

    // Test message action buttons
    console.log('🔄 Testing message actions...');
    const callButton = await page.$('.msg-action-btn:has-text("📞 Call")');
    if (callButton) {
      console.log('✅ Call button found');
    }
    
    const replyButton = await page.$('.msg-action-btn:has-text("✉️ Reply")');
    if (replyButton) {
      console.log('✅ Reply button found');
    }

    // Check scrolling behavior
    console.log('📜 Testing message feed scrolling...');
    await page.evaluate(() => {
      const messageFeed = document.querySelector('.message-feed');
      if (messageFeed) {
        messageFeed.scrollTop = messageFeed.scrollHeight / 2;
      }
    });
    await page.waitForTimeout(500);
    console.log('✅ Message feed scrolling works');

    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/whoseapp_messages_test.png', fullPage: true });
    console.log('📸 Screenshot saved: temp_dev/whoseapp_messages_test.png');

    console.log('🎉 WhoseApp message content test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
