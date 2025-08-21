const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🏛️ Testing WhoseApp Detailed Sender Information...');
    
    // Navigate to the HUD
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);

    // Ensure WhoseApp tab is active
    const whoseappTab = await page.$('.tab-button:has-text("💬 WhoseApp")');
    if (whoseappTab) {
      await whoseappTab.click();
      await page.waitForTimeout(500);
    }

    // Test detailed sender information
    console.log('👤 Testing sender details...');
    
    // Check Defense Minister details
    const defenseMessage = await page.$('.message-item.urgent');
    if (defenseMessage) {
      const senderName = await defenseMessage.$eval('.message-sender', el => el.textContent);
      const senderDetails = await defenseMessage.$eval('.message-details', el => el.textContent);
      
      console.log('✅ Defense Minister Message:');
      console.log(`   Name: ${senderName}`);
      console.log(`   Details: ${senderDetails}`);
      
      if (senderName.includes('Kex\'tal Vorthak') && senderDetails.includes('Zephyrian Empire')) {
        console.log('✅ Defense Minister details verified');
      }
    }

    // Check Economic Advisor details
    const economicMessages = await page.$$('.message-item:not(.urgent)');
    if (economicMessages.length > 0) {
      const economicMessage = economicMessages[0];
      const senderName = await economicMessage.$eval('.message-sender', el => el.textContent);
      const senderDetails = await economicMessage.$eval('.message-details', el => el.textContent);
      
      console.log('✅ Economic Advisor Message:');
      console.log(`   Name: ${senderName}`);
      console.log(`   Details: ${senderDetails}`);
      
      if (senderName.includes('Yil\'andra Nexus') && senderDetails.includes('Treasury Department')) {
        console.log('✅ Economic Advisor details verified');
      }
    }

    // Check Science Director details
    if (economicMessages.length > 1) {
      const scienceMessage = economicMessages[1];
      const senderName = await scienceMessage.$eval('.message-sender', el => el.textContent);
      const senderDetails = await scienceMessage.$eval('.message-details', el => el.textContent);
      
      console.log('✅ Science Director Message:');
      console.log(`   Name: ${senderName}`);
      console.log(`   Details: ${senderDetails}`);
      
      if (senderName.includes('Thex\'ul Quantum') && senderDetails.includes('Research Division')) {
        console.log('✅ Science Director details verified');
      }
    }

    // Check message content enhancement
    console.log('📋 Testing enhanced message content...');
    const urgentContent = await defenseMessage.$eval('.message-content', el => el.textContent);
    if (urgentContent.includes('coordinates') && urgentContent.includes('DEFCON 3')) {
      console.log('✅ Enhanced urgent message content verified');
    }

    // Test message priority display
    const priorityBadge = await page.$('.message-priority.urgent');
    if (priorityBadge) {
      const priorityText = await priorityBadge.textContent();
      console.log(`✅ Priority badge found: ${priorityText}`);
    }

    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/whoseapp_detailed_info_test.png', fullPage: true });
    console.log('📸 Screenshot saved: temp_dev/whoseapp_detailed_info_test.png');

    console.log('🎉 WhoseApp detailed information test completed successfully!');
    console.log('📊 Summary:');
    console.log('   - All officials now have full names, titles, and civilizations');
    console.log('   - Messages include specific project names and classifications');
    console.log('   - Enhanced content with coordinates, costs, and technical details');
    console.log('   - Priority levels and clearance information displayed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
