import { chromium } from 'playwright';

async function testWhoseAppSimple() {
  console.log('🧪 Simple WhoseApp Test...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main frontend
    console.log('🌐 Navigating to frontend...');
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Look for WhoseApp button and click it
    const whoseAppButton = await page.$('button:has-text("WhoseApp")');
    if (whoseAppButton) {
      console.log('✅ Found WhoseApp button, clicking...');
      await whoseAppButton.click();
      await page.waitForTimeout(3000);
    } else {
      console.log('❌ WhoseApp button not found');
      return;
    }
    
    // Listen for all console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });
    
    // Wait for any async operations
    await page.waitForTimeout(5000);
    
    // Check for any React-related messages
    const reactMessages = consoleMessages.filter(msg => 
      msg.text.includes('React') || 
      msg.text.includes('useEffect') ||
      msg.text.includes('component') ||
      msg.text.includes('render')
    );
    
    console.log(`📋 Found ${reactMessages.length} React-related messages:`);
    reactMessages.forEach(msg => {
      console.log(`  [${msg.type.toUpperCase()}] ${msg.text}`);
    });
    
    // Check for any initialization messages
    const initMessages = consoleMessages.filter(msg => 
      msg.text.includes('init') || 
      msg.text.includes('load') ||
      msg.text.includes('start') ||
      msg.text.includes('mount')
    );
    
    console.log(`📋 Found ${initMessages.length} initialization messages:`);
    initMessages.forEach(msg => {
      console.log(`  [${msg.type.toUpperCase()}] ${msg.text}`);
    });
    
    // Check for any error messages
    const errorMessages = consoleMessages.filter(msg => msg.type === 'error');
    console.log(`❌ Found ${errorMessages.length} error messages:`);
    errorMessages.forEach(msg => {
      console.log(`  [ERROR] ${msg.text}`);
    });
    
    // Take a screenshot
    await page.screenshot({ path: 'whoseapp-simple.png' });
    console.log('📸 Screenshot saved as whoseapp-simple.png');
    
    // Summary
    console.log('\n📊 SIMPLE TEST SUMMARY:');
    console.log(`✅ Total console messages: ${consoleMessages.length}`);
    console.log(`✅ React-related messages: ${reactMessages.length}`);
    console.log(`✅ Initialization messages: ${initMessages.length}`);
    console.log(`❌ Error messages: ${errorMessages.length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWhoseAppSimple();
