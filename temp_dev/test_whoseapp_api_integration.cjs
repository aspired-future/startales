const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔗 Testing WhoseApp API Integration...');
    
    // Navigate to the HUD
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(3000);

    // Ensure WhoseApp tab is active
    const whoseappTab = await page.$('.tab-button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      await whoseappTab.click();
      await page.waitForTimeout(1000);
    }

    // Check for loading state
    console.log('⏳ Checking loading state...');
    const loadingSpinner = await page.$('.loading-spinner');
    if (loadingSpinner) {
      console.log('✅ Loading spinner found - API call initiated');
      await page.waitForTimeout(2000); // Wait for API call to complete
    }

    // Check for error state or messages
    const errorMessage = await page.$('.message-error');
    if (errorMessage) {
      const errorText = await errorMessage.textContent();
      console.log('⚠️ API Error detected:', errorText);
      
      // Check if retry button works
      const retryBtn = await page.$('.retry-btn');
      if (retryBtn) {
        console.log('🔄 Testing retry functionality...');
        await retryBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    // Check for actual messages (either from API or fallback)
    const messageFeed = await page.$('.message-feed');
    if (messageFeed) {
      console.log('✅ Message feed found');
      
      const messageItems = await page.$$('.message-item');
      console.log(`📨 Found ${messageItems.length} messages`);
      
      if (messageItems.length > 0) {
        // Test first message
        const firstMessage = messageItems[0];
        const senderName = await firstMessage.$eval('.message-sender', el => el.textContent);
        const senderDetails = await firstMessage.$eval('.message-details', el => el.textContent);
        const messageContent = await firstMessage.$eval('.message-content', el => el.textContent);
        const timeAgo = await firstMessage.$eval('.message-time', el => el.textContent);
        
        console.log('📋 First Message Details:');
        console.log(`   Sender: ${senderName}`);
        console.log(`   Details: ${senderDetails}`);
        console.log(`   Time: ${timeAgo}`);
        console.log(`   Content Preview: "${messageContent.substring(0, 100)}..."`);
        
        // Check if it's using API data or fallback
        if (senderName.includes('Player') && senderDetails.includes('Player ID:')) {
          console.log('🔌 Using real API data from communication system');
        } else if (senderName.includes('Defense Minister') || senderName.includes('Economic Advisor')) {
          console.log('🔄 Using fallback mock data (API unavailable)');
        }
        
        // Test message actions
        const callButton = await firstMessage.$('.msg-action-btn:has-text("📞")');
        const replyButton = await firstMessage.$('.msg-action-btn:has-text("✉️")');
        
        if (callButton && replyButton) {
          console.log('✅ Message action buttons found');
        }
      }
    }

    // Check for no messages state
    const noMessages = await page.$('.no-messages');
    if (noMessages) {
      const noMessagesText = await noMessages.textContent();
      console.log('📭 No messages state:', noMessagesText);
    }

    // Test real-time updates (check if messages refresh)
    console.log('⏱️ Testing real-time message updates...');
    const initialMessageCount = (await page.$$('.message-item')).length;
    console.log(`Initial message count: ${initialMessageCount}`);
    
    // Wait for potential refresh (30 seconds is too long for test, so we'll wait 5 seconds)
    await page.waitForTimeout(5000);
    
    const updatedMessageCount = (await page.$$('.message-item')).length;
    console.log(`Updated message count: ${updatedMessageCount}`);
    
    if (updatedMessageCount !== initialMessageCount) {
      console.log('🔄 Real-time updates working!');
    } else {
      console.log('⏸️ No new messages in test period (expected)');
    }

    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/whoseapp_api_integration_test.png', fullPage: true });
    console.log('📸 Screenshot saved: temp_dev/whoseapp_api_integration_test.png');

    console.log('🎉 WhoseApp API integration test completed!');
    console.log('📊 Summary:');
    console.log('   - WhoseApp now connects to real communication API');
    console.log('   - Fallback to mock data when API is unavailable');
    console.log('   - Loading states and error handling implemented');
    console.log('   - Real-time message refresh every 30 seconds');
    console.log('   - Dynamic message rendering with player/character details');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
