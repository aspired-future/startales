const { chromium } = require('playwright');

async function testWhoseAppNavigation() {
  console.log('🚀 Testing WhoseApp navigation from Communications panel...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to the game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    // Wait for the game to load
    await page.waitForTimeout(3000);
    
    console.log('📡 Looking for Communications accordion...');
    
    // Find and click the Communications accordion
    const communicationsAccordion = await page.$('div.accordion-header:has-text("COMMUNICATIONS")');
    if (communicationsAccordion) {
      console.log('✅ Found Communications accordion, clicking...');
      await communicationsAccordion.click();
      await page.waitForTimeout(1000);
      
      // Look for WhoseApp button
      console.log('📱 Looking for WhoseApp button...');
      const whoseappButton = await page.$('button.nav-item:has-text("📱 WhoseApp")');
      if (whoseappButton) {
        console.log('✅ Found WhoseApp button, clicking...');
        await whoseappButton.click();
        await page.waitForTimeout(2000);
        
        // Check if we're now in the center panel WhoseApp tab
        console.log('🔍 Checking if WhoseApp tab is active...');
        const activeWhoseAppTab = await page.$('button:has-text("💬 WhoseApp").active, button[style*="rgba(78, 205, 196, 0.2)"]:has-text("💬 WhoseApp")');
        
        if (activeWhoseAppTab) {
          console.log('✅ WhoseApp tab is now active in center panel!');
          
          // Check if conversations are visible
          const conversations = await page.$$('.conversation-item');
          console.log(`💬 Found ${conversations.length} conversations visible`);
          
          if (conversations.length > 0) {
            console.log('✅ Conversations are visible - navigation successful!');
            
            // Test clicking on a conversation
            console.log('🔍 Testing conversation selection...');
            await conversations[0].click();
            await page.waitForTimeout(1000);
            
            const messages = await page.$$('.message');
            console.log(`📨 Found ${messages.length} messages in conversation`);
            
            if (messages.length > 0) {
              console.log('✅ Messages are displaying - full WhoseApp functionality working!');
            }
          }
        } else {
          console.log('❌ WhoseApp tab is not active - navigation may have failed');
        }
        
      } else {
        console.log('❌ WhoseApp button not found in Communications panel');
      }
    } else {
      console.log('❌ Communications accordion not found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'whoseapp-navigation-test.png', fullPage: true });
    console.log('📸 Screenshot saved as whoseapp-navigation-test.png');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 WhoseApp navigation test complete');
  }
}

testWhoseAppNavigation();

