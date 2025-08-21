const { chromium } = require('playwright');

async function testEnhancedWhoseAppChannels() {
  console.log('🧪 Testing Enhanced WhoseApp Channels in Browser...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the HUD
    console.log('📱 Navigating to HUD...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Click on WhoseApp tab
    console.log('📡 Clicking WhoseApp tab...');
    await page.click('[data-tab="whoseapp"]');
    await page.waitForTimeout(2000);
    
    // Click on Channels tab within WhoseApp
    console.log('📺 Clicking Channels tab...');
    await page.click('.whoseapp-tabs button:has-text("Channels")');
    await page.waitForTimeout(3000);
    
    // Check for enhanced channels
    console.log('🔍 Checking for enhanced channels...');
    
    const channelElements = await page.$$('.channel-item');
    console.log(`📊 Found ${channelElements.length} channels`);
    
    if (channelElements.length === 0) {
      console.log('❌ No channels found - checking for loading or error states...');
      
      const loadingElement = await page.$('.loading');
      if (loadingElement) {
        console.log('⏳ Channels are still loading...');
        await page.waitForTimeout(5000);
        const retryChannels = await page.$$('.channel-item');
        console.log(`📊 After waiting: Found ${retryChannels.length} channels`);
      }
      
      const errorElement = await page.$('.error');
      if (errorElement) {
        const errorText = await errorElement.textContent();
        console.log('❌ Error loading channels:', errorText);
      }
    }
    
    // Look for specific enhanced channels
    const expectedChannels = [
      'Imperial Cabinet',
      'Security Council', 
      'Galactic Council',
      'Alliance Command',
      'Trade Federation',
      'Research Network',
      'Emergency Response'
    ];
    
    let foundChannels = [];
    for (const expectedChannel of expectedChannels) {
      const channelElement = await page.$(`text=${expectedChannel}`);
      if (channelElement) {
        foundChannels.push(expectedChannel);
        console.log(`✅ Found channel: ${expectedChannel}`);
      } else {
        console.log(`❌ Missing channel: ${expectedChannel}`);
      }
    }
    
    console.log(`\n📈 Results: Found ${foundChannels.length}/${expectedChannels.length} expected channels`);
    
    if (foundChannels.length > 0) {
      console.log('🎉 SUCCESS: Enhanced channels are visible in WhoseApp!');
      
      // Test channel descriptions
      console.log('\n🔍 Testing channel descriptions...');
      const firstChannel = await page.$('.channel-item');
      if (firstChannel) {
        const description = await firstChannel.$('.channel-description');
        if (description) {
          const descText = await description.textContent();
          console.log(`📝 Sample description: "${descText}"`);
        }
      }
      
      // Test Create Channel button
      console.log('\n🔍 Testing Create Channel functionality...');
      const createChannelBtn = await page.$('button:has-text("Create Channel")');
      if (createChannelBtn) {
        console.log('✅ Create Channel button found');
        await createChannelBtn.click();
        await page.waitForTimeout(1000);
        
        const modal = await page.$('.modal-overlay');
        if (modal) {
          console.log('✅ Create Channel modal opened successfully');
          
          // Close modal
          const closeBtn = await page.$('.modal-close');
          if (closeBtn) {
            await closeBtn.click();
            console.log('✅ Modal closed successfully');
          }
        }
      }
      
      // Test Schedule Summit button
      console.log('\n🔍 Testing Schedule Summit functionality...');
      const summitBtn = await page.$('button:has-text("Schedule Summit")');
      if (summitBtn) {
        console.log('✅ Schedule Summit button found');
        await summitBtn.click();
        await page.waitForTimeout(1000);
        
        const summitModal = await page.$('.modal-overlay');
        if (summitModal) {
          console.log('✅ Schedule Summit modal opened successfully');
          
          // Close modal
          const closeBtn = await page.$('.modal-close');
          if (closeBtn) {
            await closeBtn.click();
            console.log('✅ Summit modal closed successfully');
          }
        }
      }
      
    } else {
      console.log('❌ FAILED: No enhanced channels found in WhoseApp');
    }
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/whoseapp_enhanced_channels.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/whoseapp_enhanced_channels.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testEnhancedWhoseAppChannels();
