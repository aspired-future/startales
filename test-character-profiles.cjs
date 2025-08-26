const { chromium } = require('playwright');

async function testCharacterProfiles() {
  console.log('🚀 Testing character profile functionality...');
  
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
      
      // Look for conversations and click on one
      console.log('💬 Looking for conversations...');
      const conversationItems = await page.$$('.conversation-item');
      
      if (conversationItems.length > 0) {
        console.log('🔍 Clicking on first conversation...');
        await conversationItems[0].click();
        await page.waitForTimeout(2000);
        
        // Look for character avatars in messages
        console.log('👤 Looking for character avatars...');
        const avatars = await page.$$('div[title*="View"][title*="profile"]');
        console.log(`📋 Found ${avatars.length} clickable avatars`);
        
        if (avatars.length > 0) {
          console.log('🖱️ Clicking on first character avatar...');
          await avatars[0].click();
          await page.waitForTimeout(2000);
          
          // Check if character profile modal opened
          const profileModal = await page.$('.character-profile-modal');
          if (profileModal) {
            console.log('✅ Character profile modal opened successfully!');
            
            // Check modal content
            const characterName = await page.$eval('.character-info h2', el => el.textContent);
            console.log(`👤 Character Name: ${characterName}`);
            
            const characterTitle = await page.$eval('.character-title', el => el.textContent);
            console.log(`💼 Character Title: ${characterTitle}`);
            
            // Test tab navigation
            console.log('🔄 Testing tab navigation...');
            const tabs = await page.$$('.tab-button');
            console.log(`📋 Found ${tabs.length} tabs`);
            
            if (tabs.length > 1) {
              console.log('🧠 Clicking on Personality tab...');
              const personalityTab = await page.$('button:has-text("🧠 Personality")');
              if (personalityTab) {
                await personalityTab.click();
                await page.waitForTimeout(1000);
                
                const traits = await page.$$('.trait-tag');
                console.log(`🎯 Found ${traits.length} personality traits`);
              }
              
              console.log('📚 Clicking on Background tab...');
              const backgroundTab = await page.$('button:has-text("📚 Background")');
              if (backgroundTab) {
                await backgroundTab.click();
                await page.waitForTimeout(1000);
                
                const achievements = await page.$$('.background-section li');
                console.log(`🏆 Found ${achievements.length} background items`);
              }
              
              console.log('💭 Clicking on Opinions tab...');
              const opinionsTab = await page.$('button:has-text("💭 Opinions")');
              if (opinionsTab) {
                await opinionsTab.click();
                await page.waitForTimeout(1000);
                
                const opinions = await page.$$('.opinion-item');
                console.log(`🗳️ Found ${opinions.length} opinion items`);
              }
            }
            
            // Test closing the modal
            console.log('❌ Testing modal close...');
            const closeButton = await page.$('.close-button');
            if (closeButton) {
              await closeButton.click();
              await page.waitForTimeout(1000);
              
              const modalAfterClose = await page.$('.character-profile-modal');
              if (!modalAfterClose) {
                console.log('✅ Modal closed successfully!');
              } else {
                console.log('⚠️ Modal did not close properly');
              }
            }
            
          } else {
            console.log('❌ Character profile modal did not open');
          }
          
        } else {
          console.log('❌ No clickable avatars found');
        }
        
        // Test clicking on character names
        console.log('🔤 Testing character name clicks...');
        const characterNames = await page.$$('span[title*="View"][title*="profile"]');
        console.log(`📝 Found ${characterNames.length} clickable character names`);
        
        if (characterNames.length > 0) {
          console.log('🖱️ Clicking on character name...');
          await characterNames[0].click();
          await page.waitForTimeout(1000);
          
          const profileModal2 = await page.$('.character-profile-modal');
          if (profileModal2) {
            console.log('✅ Character profile opened via name click!');
            
            // Close it
            const closeButton2 = await page.$('.close-button');
            if (closeButton2) {
              await closeButton2.click();
              await page.waitForTimeout(500);
            }
          }
        }
        
      } else {
        console.log('❌ No conversations found');
      }
    } else {
      console.log('❌ WhoseApp tab not found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'character-profiles-test.png', fullPage: true });
    console.log('📸 Screenshot saved as character-profiles-test.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 Character profile test complete');
  }
}

testCharacterProfiles();

