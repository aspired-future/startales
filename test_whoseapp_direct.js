import { chromium } from 'playwright';

async function testWhoseAppDirect() {
  console.log('🧪 Testing WhoseApp Direct Access...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main frontend
    console.log('🌐 Navigating to frontend...');
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Check if the page loaded
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Look for any navigation or menu elements
    const navElements = await page.$$('[class*="nav"], [class*="menu"], [class*="sidebar"]');
    console.log(`🔍 Found ${navElements.length} navigation elements`);
    
    // Look for any buttons or links
    const buttons = await page.$$('button, a, [role="button"]');
    console.log(`🔘 Found ${buttons.length} buttons/links`);
    
    // Try to find WhoseApp by looking for text content
    const whoseAppText = await page.$('text=WhoseApp');
    if (whoseAppText) {
      console.log('✅ Found WhoseApp text, clicking...');
      await whoseAppText.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ WhoseApp text not found');
    }
    
    // Look for any conversation-related elements
    const conversationElements = await page.$$('[class*="conversation"], [class*="chat"], [class*="message"]');
    console.log(`💬 Found ${conversationElements.length} conversation elements`);
    
    // Check for any error messages
    const errors = await page.$$('[class*="error"], [class*="alert"]');
    console.log(`❌ Found ${errors.length} error elements`);
    
    // Get page content
    const content = await page.textContent('body');
    console.log(`📄 Page content length: ${content?.length || 0}`);
    console.log(`📄 First 500 chars: ${content?.substring(0, 500)}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'whoseapp-test.png' });
    console.log('📸 Screenshot saved as whoseapp-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWhoseAppDirect();
