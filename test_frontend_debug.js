import { chromium } from 'playwright';

async function testFrontendDebug() {
  console.log('🔍 Debugging Frontend Conversation Loading...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main frontend
    console.log('🌐 Navigating to frontend...');
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Look for WhoseApp and click it
    const whoseAppText = await page.$('text=WhoseApp');
    if (whoseAppText) {
      console.log('✅ Found WhoseApp text, clicking...');
      await whoseAppText.click();
      await page.waitForTimeout(3000);
    } else {
      console.log('❌ WhoseApp text not found');
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
    
    // Check for specific console messages related to conversation loading
    const conversationMessages = consoleMessages.filter(msg => 
      msg.text.includes('conversation') || 
      msg.text.includes('character') || 
      msg.text.includes('load') ||
      msg.text.includes('fetch')
    );
    
    console.log(`📋 Found ${conversationMessages.length} conversation-related console messages:`);
    conversationMessages.forEach(msg => {
      console.log(`  [${msg.type.toUpperCase()}] ${msg.text}`);
    });
    
    // Check for any fetch errors
    const fetchErrors = consoleMessages.filter(msg => 
      msg.text.includes('Failed to fetch') || 
      msg.text.includes('ERR_CONNECTION_REFUSED') ||
      msg.text.includes('500') ||
      msg.text.includes('404')
    );
    
    console.log(`❌ Found ${fetchErrors.length} fetch errors:`);
    fetchErrors.forEach(msg => {
      console.log(`  [${msg.type.toUpperCase()}] ${msg.text}`);
    });
    
    // Check for any warnings about falling back to mock data
    const mockDataWarnings = consoleMessages.filter(msg => 
      msg.text.includes('mock') || 
      msg.text.includes('fallback') ||
      msg.text.includes('API failed')
    );
    
    console.log(`⚠️ Found ${mockDataWarnings.length} mock data warnings:`);
    mockDataWarnings.forEach(msg => {
      console.log(`  [${msg.type.toUpperCase()}] ${msg.text}`);
    });
    
    // Take a screenshot
    await page.screenshot({ path: 'frontend-debug.png' });
    console.log('📸 Screenshot saved as frontend-debug.png');
    
    // Summary
    console.log('\n📊 DEBUG SUMMARY:');
    console.log(`✅ Total console messages: ${consoleMessages.length}`);
    console.log(`✅ Conversation-related messages: ${conversationMessages.length}`);
    console.log(`❌ Fetch errors: ${fetchErrors.length}`);
    console.log(`⚠️ Mock data warnings: ${mockDataWarnings.length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testFrontendDebug();
