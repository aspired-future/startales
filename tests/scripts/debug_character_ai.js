import { chromium } from 'playwright';

async function debugCharacterAI() {
  console.log('🔍 Debugging Character AI Integration...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  const networkRequests = [];
  const networkResponses = [];
  
  // Collect all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    console.log(`[${type.toUpperCase()}] ${text}`);
  });
  
  // Collect all network requests and responses
  page.on('request', request => {
    const url = request.url();
    networkRequests.push({
      method: request.method(),
      url: url,
      timestamp: new Date().toISOString()
    });
    
    if (url.includes('/api/characters/') || url.includes('/api/whoseapp/')) {
      console.log(`📤 REQUEST: ${request.method()} ${url}`);
    }
  });
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/characters/') || url.includes('/api/whoseapp/')) {
      networkResponses.push({
        status: response.status(),
        url: url,
        timestamp: new Date().toISOString()
      });
      console.log(`📥 RESPONSE: ${response.status()} ${url}`);
    }
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(3000);
    
    console.log('🔍 Opening WhoseApp...');
    const whoseAppButtons = await page.locator('text=WhoseApp').all();
    if (whoseAppButtons.length > 0) {
      await whoseAppButtons[0].click();
      await page.waitForTimeout(3000);
      
      console.log('💬 Testing direct message send...');
      
      // Find message input and send a test message
      const messageInput = await page.locator('input[placeholder*="Message"], textarea[placeholder*="Message"]').first();
      if (await messageInput.isVisible()) {
        console.log('✅ Message input found');
        
        await messageInput.fill('Hello, what is the current status of our civilization?');
        
        // Find and click send button
        const sendButtons = await page.locator('text=Send, button:has-text("Send")').all();
        if (sendButtons.length > 0) {
          console.log('✅ Send button found, clicking...');
          await sendButtons[0].click();
          
          console.log('⏳ Waiting for Character AI response...');
          await page.waitForTimeout(10000); // Wait 10 seconds for response
          
          // Analyze network activity
          const characterAIRequests = networkRequests.filter(req => 
            req.url.includes('interact-aware') || req.url.includes('/api/characters/')
          );
          
          const characterAIResponses = networkResponses.filter(res => 
            res.url.includes('interact-aware') || res.url.includes('/api/characters/')
          );
          
          console.log(`\n🤖 Character AI Network Analysis:`);
          console.log(`- Character AI requests: ${characterAIRequests.length}`);
          console.log(`- Character AI responses: ${characterAIResponses.length}`);
          
          if (characterAIRequests.length > 0) {
            console.log('\n📤 Character AI Requests:');
            characterAIRequests.forEach(req => {
              console.log(`  - ${req.method} ${req.url}`);
            });
          }
          
          if (characterAIResponses.length > 0) {
            console.log('\n📥 Character AI Responses:');
            characterAIResponses.forEach(res => {
              console.log(`  - ${res.status} ${res.url}`);
            });
          }
          
          // Check for error messages
          const errorMessages = consoleMessages.filter(msg => 
            msg.type === 'error' || msg.text.includes('Failed') || msg.text.includes('Error')
          );
          
          if (errorMessages.length > 0) {
            console.log('\n❌ Error Messages:');
            errorMessages.forEach(msg => {
              console.log(`  - [${msg.type}] ${msg.text}`);
            });
          }
          
          // Check for Character AI specific messages
          const characterAIMessages = consoleMessages.filter(msg => 
            msg.text.includes('Character AI') || 
            msg.text.includes('interact-aware') ||
            msg.text.includes('generateConversationalResponse')
          );
          
          if (characterAIMessages.length > 0) {
            console.log('\n🤖 Character AI Messages:');
            characterAIMessages.forEach(msg => {
              console.log(`  - [${msg.type}] ${msg.text}`);
            });
          }
          
          // Check for messages in the conversation
          await page.waitForTimeout(2000);
          const messageElements = await page.locator('[class*="message"], [class*="chat"], .witt-item').all();
          console.log(`\n💬 Messages in conversation: ${messageElements.length}`);
          
          if (messageElements.length >= 2) {
            console.log('✅ Conversation flow detected (user + AI response)');
          } else {
            console.log('❌ No AI response detected in conversation');
          }
          
        } else {
          console.log('❌ Send button not found');
        }
      } else {
        console.log('❌ Message input not found');
      }
      
      // Take screenshot for debugging
      await page.screenshot({ 
        path: 'tests/screenshots/character_ai_debug.png', 
        fullPage: true 
      });
      
    } else {
      console.log('❌ WhoseApp button not found');
    }
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugCharacterAI().catch(console.error);
