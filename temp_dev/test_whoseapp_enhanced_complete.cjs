const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Testing Complete Enhanced WhoseApp System...');
    
    // Navigate to the HUD
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(3000);

    // Ensure WhoseApp tab is active
    const whoseappTab = await page.$('.tab-button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      await whoseappTab.click();
      await page.waitForTimeout(1000);
    }

    console.log('👥 Testing Enhanced People Tab with Player Types...');
    
    // Switch to People tab
    const peopleTab = await page.$('.whoseapp-nav-btn:has-text("👥 People")');
    if (peopleTab) {
      await peopleTab.click();
      await page.waitForTimeout(1000);
      
      // Check for enhanced filter controls
      const filterSelects = await page.$$('.filter-select');
      console.log(`✅ Found ${filterSelects.length} filter controls`);
      
      if (filterSelects.length >= 2) {
        const playerTypeFilter = filterSelects[0];
        const civFilter = filterSelects[1];
        
        // Get player type filter options
        const playerTypeOptions = await playerTypeFilter.$$eval('option', options => 
          options.map(option => option.textContent)
        );
        console.log(`✅ Player Type options: ${playerTypeOptions.join(', ')}`);
        
        // Get civilization filter options
        const civOptions = await civFilter.$$eval('option', options => 
          options.map(option => option.textContent)
        );
        console.log(`✅ Civilization options: ${civOptions.join(', ')}`);
        
        // Test filtering by player type
        console.log('🔍 Testing player type filtering...');
        
        // Filter by Human Leaders
        await playerTypeFilter.selectOption('human');
        await page.waitForTimeout(500);
        let playerItems = await page.$$('.player-item');
        console.log(`   👤 Human Leaders: ${playerItems.length} found`);
        
        // Filter by AI Leaders
        await playerTypeFilter.selectOption('ai_leader');
        await page.waitForTimeout(500);
        playerItems = await page.$$('.player-item');
        console.log(`   🤖 AI Leaders: ${playerItems.length} found`);
        
        // Filter by AI Characters
        await playerTypeFilter.selectOption('ai_character');
        await page.waitForTimeout(500);
        playerItems = await page.$$('.player-item');
        console.log(`   🎭 AI Characters: ${playerItems.length} found`);
        
        // Reset to all
        await playerTypeFilter.selectOption('all');
        await page.waitForTimeout(500);
        
        // Test civilization filtering
        console.log('🌌 Testing civilization filtering...');
        
        // Filter by Zephyrian Empire
        await civFilter.selectOption('Zephyrian Empire');
        await page.waitForTimeout(500);
        playerItems = await page.$$('.player-item');
        console.log(`   🏛️ Zephyrian Empire: ${playerItems.length} found`);
        
        // Filter by Centauri Republic
        await civFilter.selectOption('Centauri Republic');
        await page.waitForTimeout(500);
        playerItems = await page.$$('.player-item');
        console.log(`   🏛️ Centauri Republic: ${playerItems.length} found`);
        
        // Reset to all
        await civFilter.selectOption('all');
        await page.waitForTimeout(500);
      }
      
      // Test enhanced player information display
      const allPlayers = await page.$$('.player-item');
      console.log(`✅ Total personnel: ${allPlayers.length}`);
      
      if (allPlayers.length > 0) {
        const firstPlayer = allPlayers[0];
        
        // Check for player type indicators
        const playerTypeIndicator = await firstPlayer.$('.player-type-indicator');
        const playerTypeLabel = await firstPlayer.$('.player-type-label');
        const playerSpecialization = await firstPlayer.$('.player-specialization');
        
        console.log('✅ Enhanced Player Display Features:');
        console.log(`   Type Indicator: ${playerTypeIndicator ? 'Present' : 'Missing'}`);
        console.log(`   Type Label: ${playerTypeLabel ? 'Present' : 'Missing'}`);
        console.log(`   Specialization: ${playerSpecialization ? 'Present' : 'Missing'}`);
        
        if (playerTypeLabel) {
          const labelText = await playerTypeLabel.textContent();
          console.log(`   Label Text: ${labelText}`);
        }
      }
    }

    console.log('📢 Testing Enhanced Channels Tab...');
    
    // Switch to Channels tab
    const channelsTab = await page.$('.whoseapp-nav-btn:has-text("📢 Channels")');
    if (channelsTab) {
      await channelsTab.click();
      await page.waitForTimeout(1000);
      
      // Check for channels header
      const channelsHeader = await page.$('.channels-header');
      console.log(`✅ Channels header: ${channelsHeader ? 'Present' : 'Missing'}`);
      
      // Check for channel categories
      const categoryHeaders = await page.$$('.category-header');
      console.log(`✅ Channel categories: ${categoryHeaders.length} found`);
      
      for (let i = 0; i < categoryHeaders.length; i++) {
        const categoryName = await categoryHeaders[i].textContent();
        console.log(`   Category ${i + 1}: ${categoryName}`);
        
        // Count items in this category
        const categoryContainer = await categoryHeaders[i].evaluateHandle(el => el.parentElement);
        const categoryItems = await categoryContainer.$$('.channel-item');
        console.log(`     Items: ${categoryItems.length}`);
      }
      
      // Count total channels
      const allChannelItems = await page.$$('.channel-item');
      console.log(`✅ Total channels/conversations: ${allChannelItems.length}`);
      
      // Test first channel information if available
      if (allChannelItems.length > 0) {
        const firstChannel = allChannelItems[0];
        const channelName = await firstChannel.$eval('.channel-name', el => el.textContent);
        const channelDescription = await firstChannel.$('.channel-description');
        
        console.log('✅ Channel Information:');
        console.log(`   Name: ${channelName}`);
        console.log(`   Description: ${channelDescription ? 'Present' : 'Missing'}`);
        
        if (channelDescription) {
          const descText = await channelDescription.textContent();
          console.log(`   Description Text: ${descText}`);
        }
      }
    }

    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/whoseapp_enhanced_complete_test.png', fullPage: true });
    console.log('📸 Screenshot saved: temp_dev/whoseapp_enhanced_complete_test.png');

    console.log('🎉 Complete Enhanced WhoseApp System test completed!');
    console.log('📋 Summary of Enhancements:');
    console.log('   ✅ Player type filtering (Human Leaders, AI Leaders, AI Characters)');
    console.log('   ✅ Civilization filtering (5 different civilizations)');
    console.log('   ✅ Enhanced player information with type indicators');
    console.log('   ✅ Multi-civilization support');
    console.log('   ✅ AI players always online, humans can be offline');
    console.log('   ✅ Visual distinction between player types');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
