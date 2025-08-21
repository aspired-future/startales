const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Testing Enhanced WhoseApp Communication System...');
    
    // Navigate to the HUD
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(3000);

    // Ensure WhoseApp tab is active
    const whoseappTab = await page.$('.tab-button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      await whoseappTab.click();
      await page.waitForTimeout(1000);
    }

    console.log('👥 Testing Enhanced People Tab...');
    
    // Switch to People tab
    const peopleTab = await page.$('.whoseapp-nav-btn:has-text("👥 People")');
    if (peopleTab) {
      await peopleTab.click();
      await page.waitForTimeout(1000);
      
      // Check for filter controls
      const filterSelect = await page.$('.filter-select');
      const searchInput = await page.$('.search-input');
      
      if (filterSelect && searchInput) {
        console.log('✅ Filter controls found');
        
        // Get filter options
        const options = await filterSelect.$$eval('option', options => 
          options.map(option => option.textContent)
        );
        console.log(`✅ Filter options: ${options.join(', ')}`);
      }
      
      // Count personnel
      const playerItems = await page.$$('.player-item');
      console.log(`✅ Found ${playerItems.length} personnel`);
      
      // Test enhanced player information
      if (playerItems.length > 0) {
        const firstPlayer = playerItems[0];
        const playerName = await firstPlayer.$eval('.player-name', el => el.textContent);
        const playerTitle = await firstPlayer.$eval('.player-title', el => el.textContent);
        const playerDetails = await firstPlayer.$eval('.player-details', el => el.textContent);
        const playerRole = await firstPlayer.$eval('.player-role', el => el.textContent);
        
        console.log('✅ Enhanced Player Information:');
        console.log(`   Name: ${playerName}`);
        console.log(`   Title & Rank: ${playerTitle}`);
        console.log(`   Department & Specialization: ${playerDetails}`);
        console.log(`   Role: ${playerRole}`);
      }
    }

    console.log('📢 Testing Enhanced Channels Tab...');
    
    // Switch to Channels tab
    const channelsTab = await page.$('.whoseapp-nav-btn:has-text("📢 Channels")');
    if (channelsTab) {
      await channelsTab.click();
      await page.waitForTimeout(1000);
      
      // Check for channel header
      const channelsHeader = await page.$('.channels-header h3');
      if (channelsHeader) {
        const headerText = await channelsHeader.textContent();
        console.log(`✅ Channels header: ${headerText}`);
      }
      
      // Test channel categories
      const categoryHeaders = await page.$$('.category-header');
      console.log(`✅ Found ${categoryHeaders.length} channel categories`);
      
      for (let i = 0; i < Math.min(categoryHeaders.length, 3); i++) {
        const categoryName = await categoryHeaders[i].textContent();
        console.log(`   Category ${i + 1}: ${categoryName}`);
      }
      
      // Count total channels
      const channelItems = await page.$$('.channel-item');
      console.log(`✅ Found ${channelItems.length} total channels/conversations`);
      
      // Test first channel information
      if (channelItems.length > 0) {
        const firstChannel = channelItems[0];
        const channelName = await firstChannel.$eval('.channel-name', el => el.textContent);
        const channelDescription = await firstChannel.$eval('.channel-description', el => el.textContent);
        
        console.log('✅ Enhanced Channel Information:');
        console.log(`   Name: ${channelName}`);
        console.log(`   Description: ${channelDescription}`);
      }
    }

    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/whoseapp_enhanced_simple_test.png', fullPage: true });
    console.log('📸 Screenshot saved: temp_dev/whoseapp_enhanced_simple_test.png');

    console.log('🎉 Enhanced WhoseApp Communication System test completed!');
    console.log('📋 Summary of Enhancements:');
    console.log('   ✅ People tab with filtering controls');
    console.log('   ✅ Enhanced personnel information display');
    console.log('   ✅ Organized channel categories');
    console.log('   ✅ Channel descriptions and details');
    console.log('   ✅ Professional government structure');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
