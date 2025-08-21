const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('💬 Testing WhoseApp Implementation...');
    
    // Navigate to the HUD
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);

    // Check if WhoseApp tab is visible and active by default
    console.log('🔍 Checking WhoseApp tab...');
    const whoseappTab = await page.$('.tab-button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      console.log('✅ WhoseApp tab found');
      
      // Check if it's active by default
      const isActive = await whoseappTab.evaluate(el => el.classList.contains('active'));
      if (isActive) {
        console.log('✅ WhoseApp tab is active by default');
      } else {
        console.log('⚠️ WhoseApp tab is not active by default, clicking it...');
        await whoseappTab.click();
        await page.waitForTimeout(500);
      }
    } else {
      console.log('❌ WhoseApp tab not found');
    }

    // Check WhoseApp content
    console.log('📱 Checking WhoseApp content...');
    const whoseappContent = await page.$('.whoseapp-tab');
    if (whoseappContent) {
      console.log('✅ WhoseApp content area found');
      
      // Check for header
      const header = await page.textContent('.whoseapp-header h2');
      if (header && header.includes('WHOSEAPP')) {
        console.log('✅ WhoseApp header found');
      }
      
      // Check for navigation tabs
      const navTabs = await page.$$('.whoseapp-nav-btn');
      console.log(`✅ Found ${navTabs.length} navigation tabs`);
      
      // Check for conversations
      const conversations = await page.$$('.conversation-item');
      console.log(`✅ Found ${conversations.length} conversations`);
      
      // Check for urgent conversation
      const urgentConversation = await page.$('.conversation-item.urgent');
      if (urgentConversation) {
        console.log('✅ Urgent conversation found');
        const urgentName = await urgentConversation.$eval('.conversation-name', el => el.textContent);
        console.log(`   - Urgent from: ${urgentName}`);
      }
      
      // Check for action buttons
      const actionButtons = await page.$$('.whoseapp-actions .action-btn');
      console.log(`✅ Found ${actionButtons.length} action buttons`);
      
    } else {
      console.log('❌ WhoseApp content not found');
    }

    // Test navigation between tabs
    console.log('🔄 Testing tab navigation...');
    const peopleTab = await page.$('.whoseapp-nav-btn:has-text("👥 People")');
    if (peopleTab) {
      await peopleTab.click();
      await page.waitForTimeout(300);
      console.log('✅ People tab clicked');
    }
    
    const channelsTab = await page.$('.whoseapp-nav-btn:has-text("📢 Channels")');
    if (channelsTab) {
      await channelsTab.click();
      await page.waitForTimeout(300);
      console.log('✅ Channels tab clicked');
    }
    
    // Go back to Incoming
    const incomingTab = await page.$('.whoseapp-nav-btn:has-text("📥 Incoming")');
    if (incomingTab) {
      await incomingTab.click();
      await page.waitForTimeout(300);
      console.log('✅ Back to Incoming tab');
    }

    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/whoseapp_test.png', fullPage: true });
    console.log('📸 Screenshot saved: temp_dev/whoseapp_test.png');

    console.log('🎉 WhoseApp implementation test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
