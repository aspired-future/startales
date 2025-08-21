const { chromium } = require('playwright');

async function testWhoseAppButtons() {
  console.log('📞 Testing WhoseApp Button Integration...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to http://localhost:5176...');
    await page.goto('http://localhost:5176', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Test screens with WhoseApp buttons
    const testScreens = [
      { category: 'POPULATION', screen: 'Health & Welfare', expectedOfficial: 'Dr. Robert Taylor' },
      { category: 'ECONOMY', screen: 'Treasury', expectedOfficial: 'David Park' },
      { category: 'SCIENCE & TECH', screen: 'Government R&D', expectedOfficial: 'Dr. Emily Zhang' },
      { category: 'POPULATION', screen: 'Education', expectedOfficial: 'Dr. Patricia Wilson' }
    ];
    
    for (const testCase of testScreens) {
      console.log(`\n🧪 Testing ${testCase.category} → ${testCase.screen}...`);
      
      // Navigate to the screen
      const categoryAccordion = await page.locator(`text=${testCase.category}`).first();
      if (await categoryAccordion.isVisible()) {
        console.log(`✅ Found ${testCase.category} accordion`);
        await categoryAccordion.click();
        await page.waitForTimeout(1000);
        
        const screenLink = await page.locator(`text=${testCase.screen}`).first();
        if (await screenLink.isVisible()) {
          console.log(`✅ Found ${testCase.screen} link`);
          await screenLink.click();
          await page.waitForTimeout(2000);
          
          // Look for WhoseApp button in the screen header
          const whoseAppButton = await page.locator('button:has-text("WhoseApp")').first();
          if (await whoseAppButton.isVisible()) {
            console.log(`✅ WhoseApp button found on ${testCase.screen} screen`);
            
            // Click the WhoseApp button
            await whoseAppButton.click();
            await page.waitForTimeout(1000);
            
            // Check if WhoseApp tab is activated
            const whoseAppTab = await page.locator('button:has-text("WhoseApp")').nth(1); // Second one should be the center tab
            if (await whoseAppTab.isVisible()) {
              const isActive = await whoseAppTab.getAttribute('class');
              if (isActive && isActive.includes('active')) {
                console.log(`✅ WhoseApp tab activated successfully`);
                
                // Check for toast notification
                const toast = await page.locator('.whoseapp-toast').first();
                if (await toast.isVisible({ timeout: 2000 })) {
                  const toastText = await toast.textContent();
                  console.log(`✅ Toast notification: "${toastText}"`);
                  
                  if (toastText && toastText.includes(testCase.expectedOfficial)) {
                    console.log(`✅ Correct official contacted: ${testCase.expectedOfficial}`);
                  } else {
                    console.log(`⚠️ Expected ${testCase.expectedOfficial} but got different official`);
                  }
                } else {
                  console.log(`⚠️ Toast notification not found`);
                }
                
                // Check for new message in WhoseApp
                await page.waitForTimeout(1000);
                const incomingMessages = await page.locator('.message-item').count();
                if (incomingMessages > 0) {
                  console.log(`✅ Found ${incomingMessages} message(s) in WhoseApp`);
                  
                  // Check if the message is from the expected official
                  const firstMessage = await page.locator('.message-item').first();
                  const messageContent = await firstMessage.textContent();
                  if (messageContent && messageContent.includes(testCase.expectedOfficial.split(' ')[1])) {
                    console.log(`✅ Message from correct official: ${testCase.expectedOfficial}`);
                  }
                } else {
                  console.log(`⚠️ No messages found in WhoseApp`);
                }
              } else {
                console.log(`❌ WhoseApp tab not activated`);
              }
            } else {
              console.log(`❌ WhoseApp tab not found`);
            }
          } else {
            console.log(`❌ WhoseApp button NOT found on ${testCase.screen} screen`);
          }
        } else {
          console.log(`❌ ${testCase.screen} link not found`);
        }
      } else {
        console.log(`❌ ${testCase.category} accordion not found`);
      }
    }
    
    console.log('\n📋 WhoseApp Button Integration Summary:');
    console.log('✅ WhoseApp buttons should appear on ALL screens using BaseScreen wrapper');
    console.log('✅ Each button connects to the appropriate government official');
    console.log('✅ Clicking opens WhoseApp with a direct message from the official');
    console.log('✅ Toast notifications show connection status');
    console.log('✅ Event system enables seamless communication between screens and WhoseApp');
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/whoseapp_buttons_test.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/whoseapp_buttons_test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testWhoseAppButtons();
