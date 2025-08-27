import { chromium } from 'playwright';

async function checkConsoleErrors() {
  console.log('🔍 Checking for console errors...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const consoleMessages = [];
  const errors = [];
  
  // Collect console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text, timestamp: new Date().toISOString() });
    if (type === 'error') {
      console.log(`❌ Console Error: ${text}`);
    } else if (type === 'warning') {
      console.log(`⚠️ Console Warning: ${text}`);
    }
  });
  
  // Collect JavaScript errors
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error('❌ JavaScript Error:', error.message);
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    
    console.log('🔍 Looking for WhoseApp button...');
    const whoseappButtons = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseappButtons.length} WhoseApp buttons`);
    
    if (whoseappButtons.length > 0) {
      console.log('✅ Clicking WhoseApp...');
      await whoseappButtons[0].click();
      
      // Wait for WhoseApp to load and check for errors
      await page.waitForTimeout(5000);
      
      console.log('🔍 Checking WhoseApp content...');
      
      // Check if the main WhoseApp container exists
      const whoseappMain = await page.locator('.whoseapp-main').count();
      console.log(`WhoseApp main container count: ${whoseappMain}`);
      
      // Check if header exists
      const whoseappHeader = await page.locator('.whoseapp-header').count();
      console.log(`WhoseApp header count: ${whoseappHeader}`);
      
      // Check for any div with WhoseApp content
      const whoseappDivs = await page.locator('div:has-text("💬 WhoseApp")').count();
      console.log(`Divs containing "💬 WhoseApp": ${whoseappDivs}`);
      
      // Get the HTML content of the WhoseApp area
      try {
        const whoseappContent = await page.locator('.whoseapp-main').innerHTML();
        console.log('📄 WhoseApp HTML content length:', whoseappContent.length);
        if (whoseappContent.length < 100) {
          console.log('📄 WhoseApp HTML content:', whoseappContent);
        }
      } catch (error) {
        console.log('❌ Could not get WhoseApp HTML content:', error.message);
      }
      
    } else {
      console.log('❌ No WhoseApp buttons found');
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Console messages: ${consoleMessages.length}`);
    console.log(`- JavaScript errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ JavaScript Errors:');
      errors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

checkConsoleErrors().catch(console.error);
