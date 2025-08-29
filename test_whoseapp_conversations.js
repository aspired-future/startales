import { chromium } from 'playwright';

async function testWhoseAppConversations() {
  console.log('🧪 Testing WhoseApp Conversation Loading...');
  
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
    
    // Look for conversation elements
    const conversationElements = await page.$$('[class*="conversation"], [class*="chat"], [class*="message"]');
    console.log(`💬 Found ${conversationElements.length} conversation elements`);
    
    // Look for specific conversation content
    const conversationText = await page.textContent('body');
    console.log(`📄 Full page content length: ${conversationText?.length || 0}`);
    
    // Check for specific conversation indicators
    const hasDiplomat = conversationText?.includes('Diplomatic Officer') || false;
    const hasCommander = conversationText?.includes('Military Strategist') || false;
    const hasScientist = conversationText?.includes('Research Director') || false;
    
    console.log(`👤 Diplomatic Officer found: ${hasDiplomat}`);
    console.log(`👤 Military Strategist found: ${hasCommander}`);
    console.log(`👤 Research Director found: ${hasScientist}`);
    
    // Look for conversation list or chat interface
    const chatInterface = await page.$$('[class*="chat"], [class*="conversation"], [class*="message"]');
    console.log(`💬 Chat interface elements: ${chatInterface.length}`);
    
    // Check for any loading states
    const loadingElements = await page.$$('[class*="loading"], [class*="spinner"]');
    console.log(`⏳ Loading elements: ${loadingElements.length}`);
    
    // Look for error messages
    const errorElements = await page.$$('[class*="error"], [class*="alert"]');
    console.log(`❌ Error elements: ${errorElements.length}`);
    
    // Check console for any messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    // Wait a bit more for any async loading
    await page.waitForTimeout(3000);
    
    // Filter for conversation-related messages
    const conversationMessages = consoleMessages.filter(msg => 
      msg.text.includes('conversation') || 
      msg.text.includes('character') || 
      msg.text.includes('load') ||
      msg.text.includes('fetch') ||
      msg.text.includes('API') ||
      msg.text.includes('mock')
    );
    
    console.log(`🔍 Console messages: ${consoleMessages.length}`);
    console.log(`📋 All console messages:`, consoleMessages);
    console.log(`📋 Conversation-related messages: ${conversationMessages.length}`);
    if (conversationMessages.length > 0) {
      console.log('📋 Conversation messages:', conversationMessages.slice(0, 10));
    }
    
    // Check for errors
    const consoleErrors = consoleMessages.filter(msg => msg.type === 'error');
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('📋 Console errors:', consoleErrors.slice(0, 5));
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'whoseapp-conversations.png' });
    console.log('📸 Screenshot saved as whoseapp-conversations.png');
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`✅ WhoseApp accessible: Yes`);
    console.log(`✅ Conversation elements found: ${conversationElements.length}`);
    console.log(`✅ Diplomatic Officer conversation: ${hasDiplomat}`);
    console.log(`✅ Military Strategist conversation: ${hasCommander}`);
    console.log(`✅ Research Director conversation: ${hasScientist}`);
    console.log(`✅ Backend conversations loaded: ${hasDiplomat || hasCommander || hasScientist ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWhoseAppConversations();
