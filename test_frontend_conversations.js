import { chromium } from 'playwright';

async function testFrontendConversations() {
  console.log('🧪 Testing Frontend Conversation Loading...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the WhoseApp interface
    console.log('🌐 Navigating to WhoseApp...');
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Look for WhoseApp in the navigation
    console.log('🔍 Looking for WhoseApp navigation...');
    
    // Try to find WhoseApp in the left menu or navigation
    const whoseAppLink = await page.locator('text=WhoseApp').first();
    
    if (await whoseAppLink.isVisible()) {
      console.log('✅ Found WhoseApp link');
      await whoseAppLink.click();
      
      // Wait for WhoseApp to load
      await page.waitForTimeout(3000);
      
      // Check if conversations are loaded
      console.log('📱 Checking for conversations...');
      
      // Look for conversation elements
      const conversations = await page.locator('[data-testid="conversation-item"], .conversation-item, .chat-item').all();
      
      if (conversations.length > 0) {
        console.log(`✅ Found ${conversations.length} conversations in WhoseApp`);
        
        // Click on the first conversation to see if it loads
        await conversations[0].click();
        await page.waitForTimeout(2000);
        
        // Check if messages are displayed
        const messages = await page.locator('[data-testid="message"], .message, .chat-message').all();
        console.log(`✅ Found ${messages.length} messages in the conversation`);
        
      } else {
        console.log('⚠️ No conversations found in WhoseApp');
        
        // Check if there's a loading state or empty state
        const loadingState = await page.locator('text=Loading, text=No conversations, .empty-state').first();
        if (await loadingState.isVisible()) {
          console.log('ℹ️ WhoseApp is in loading/empty state');
        }
      }
      
    } else {
      console.log('❌ WhoseApp link not found');
      
      // List all available navigation items
      const navItems = await page.locator('nav a, .nav-item, .menu-item').all();
      console.log('📋 Available navigation items:');
      for (const item of navItems) {
        const text = await item.textContent();
        if (text) {
          console.log(`  - ${text.trim()}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testFrontendConversations();
