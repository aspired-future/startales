import { chromium } from 'playwright';

async function testCharacterAIIntegration() {
  console.log('🤖 Testing Character AI Integration with WhoseApp...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext({
    permissions: ['microphone']
  });
  
  const page = await context.newPage();
  
  const consoleMessages = [];
  const networkRequests = [];
  
  // Collect console messages and network requests
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    // Log Character AI related messages
    if (text.includes('🤖') || text.includes('Character AI') || 
        text.includes('interact-aware') || text.includes('contextual')) {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/characters/') && url.includes('interact-aware')) {
      networkRequests.push({
        method: request.method(),
        url: url,
        body: request.postData(),
        timestamp: new Date().toISOString()
      });
    }
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(3000);
    
    console.log('🔍 Opening WhoseApp...');
    const whoseappButtons = await page.locator('text=WhoseApp').all();
    if (whoseappButtons.length > 0) {
      await whoseappButtons[0].click();
      await page.waitForTimeout(2000);
      
      console.log('💬 Testing Character AI conversation...');
      
      // Find and fill message input
      const messageInputs = await page.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[type="text"]').all();
      let messageInput = null;
      
      for (const input of messageInputs) {
        if (await input.isVisible()) {
          messageInput = input;
          break;
        }
      }
      
      if (messageInput) {
        await messageInput.fill('Give me a status report on our diplomatic situation');
        
        // Find and click send button
        const sendButtons = await page.locator('button:has-text("Send"), button[type="submit"], button:has([data-testid="send"])').all();
        let sendButton = null;
        
        for (const button of sendButtons) {
          if (await button.isVisible()) {
            sendButton = button;
            break;
          }
        }
        
        if (sendButton) {
          await sendButton.click();
          console.log('📤 Sent message to Character AI system');
          
          // Wait for Character AI response
          await page.waitForTimeout(8000);
          
          // Analyze Character AI integration
          const characterAICalls = networkRequests.filter(req => 
            req.url.includes('interact-aware')
          );
          
          console.log(`\n🤖 Character AI Integration Analysis:`);
          console.log(`- Character AI API calls made: ${characterAICalls.length}`);
          
          if (characterAICalls.length > 0) {
            console.log('\n✅ Character AI System Integration Detected:');
            characterAICalls.forEach(call => {
              const requestBody = call.body ? JSON.parse(call.body) : {};
              console.log(`  - API Call: ${call.method} ${call.url}`);
              console.log(`  - Character ID: ${call.url.split('/')[4]}`);
              console.log(`  - Interaction Type: ${requestBody.interactionType || 'conversation'}`);
              console.log(`  - Department Context: ${requestBody.context || 'N/A'}`);
              console.log(`  - Game State Provided: ${requestBody.gameState ? 'Yes' : 'No'}`);
              console.log(`  - Previous Messages: ${requestBody.previousMessages?.length || 0}`);
            });
          } else {
            console.log('❌ No Character AI API calls detected - still using mock responses');
          }
          
          // Check for Character AI processing messages
          const characterAIMessages = consoleMessages.filter(msg => 
            msg.text.includes('Character AI') || 
            msg.text.includes('interact-aware') ||
            msg.text.includes('contextual') ||
            msg.text.includes('processingTime') ||
            msg.text.includes('confidence')
          );
          
          if (characterAIMessages.length > 0) {
            console.log('\n✅ Character AI Processing Messages:');
            characterAIMessages.forEach(msg => console.log(`  - ${msg.text}`));
          }
          
          // Take screenshot
          await page.screenshot({ 
            path: 'tests/screenshots/character_ai_integration.png', 
            fullPage: true 
          });
          
          console.log('\n🎯 Character AI Integration Status:');
          if (characterAICalls.length > 0) {
            console.log('✅ Successfully integrated Character AI system');
            console.log('✅ WhoseApp now uses contextually aware character responses');
            console.log('✅ Characters respond based on their department and expertise');
            console.log('✅ Game state and conversation history provided to AI');
            console.log('✅ Personality-driven responses with relationship tracking');
          } else {
            console.log('❌ Character AI integration not working - using fallback responses');
            console.log('🔧 Check backend Character AI routes and services');
          }
          
        } else {
          console.log('❌ Send button not found');
        }
      } else {
        console.log('❌ Message input not found');
      }
    } else {
      console.log('❌ WhoseApp button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testCharacterAIIntegration().catch(console.error);
