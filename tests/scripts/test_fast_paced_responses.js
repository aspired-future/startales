import { chromium } from 'playwright';

async function testFastPacedResponses() {
  console.log('⚡ Testing Fast-Paced Character Responses...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  const networkRequests = [];
  
  // Collect console messages and network requests
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    // Log relevant messages
    if (text.includes('Character AI') || text.includes('response') || 
        text.includes('fallback') || text.includes('Speaking AI')) {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/characters/') && url.includes('interact-aware')) {
      networkRequests.push({
        method: request.method(),
        url: url,
        timestamp: new Date().toISOString()
      });
      console.log(`📤 Character AI Request: ${request.method()} ${url}`);
    }
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(4000);
    
    console.log('🔍 Opening WhoseApp...');
    const whoseAppButtons = await page.locator('text=WhoseApp').all();
    if (whoseAppButtons.length > 0) {
      await whoseAppButtons[0].click();
      await page.waitForTimeout(3000);
      
      console.log('💬 Testing fast-paced conversation...');
      
      // Find message input
      const messageInput = await page.locator('input[placeholder*="Message"], textarea[placeholder*="Message"]').first();
      if (await messageInput.isVisible()) {
        console.log('✅ Message input found');
        
        // Test with a question that should get a direct, actionable response
        const testMessage = 'what do you think of the latest civilization developments?';
        await messageInput.fill(testMessage);
        
        // Find and click send button
        const sendButtons = await page.locator('text=Send, button:has-text("Send")').all();
        if (sendButtons.length > 0) {
          console.log('📤 Sending test message...');
          await sendButtons[0].click();
          
          console.log('⏳ Waiting for response...');
          await page.waitForTimeout(8000);
          
          // Check for Character AI calls
          const characterAICalls = networkRequests.filter(req => 
            req.url.includes('interact-aware')
          );
          
          console.log(`\n🤖 Character AI Analysis:`);
          console.log(`- API calls made: ${characterAICalls.length}`);
          
          // Check for fallback responses (should be fast-paced now)
          const fallbackMessages = consoleMessages.filter(msg => 
            msg.text.includes('Character AI failed, using enhanced fallback')
          );
          
          if (fallbackMessages.length > 0) {
            console.log('✅ Using enhanced fast-paced fallback responses');
          }
          
          // Look for messages in the conversation area
          await page.waitForTimeout(2000);
          const messageElements = await page.locator('[class*="message"], .chat-message, .conversation-message').all();
          console.log(`\n💬 Messages in conversation: ${messageElements.length}`);
          
          if (messageElements.length >= 2) {
            console.log('✅ Conversation flow working');
            
            // Try to extract the AI response text to verify it's fast-paced
            try {
              const lastMessage = messageElements[messageElements.length - 1];
              const responseText = await lastMessage.textContent();
              
              console.log(`\n📝 AI Response Preview:`);
              console.log(`"${responseText?.substring(0, 200)}..."`);
              
              // Check if response is fast-paced (no role reminders, no "let me share")
              const isFastPaced = responseText && 
                !responseText.includes('As your') && 
                !responseText.includes('let me share') && 
                !responseText.includes('I\'m here to help') &&
                !responseText.includes('Could you provide more details');
              
              if (isFastPaced) {
                console.log('✅ Response is fast-paced and direct');
              } else {
                console.log('❌ Response still contains fluff/role reminders');
              }
              
            } catch (error) {
              console.log('⚠️ Could not extract response text for analysis');
            }
          } else {
            console.log('❌ No AI response detected');
          }
          
          // Take screenshot
          await page.screenshot({ 
            path: 'tests/screenshots/fast_paced_responses.png', 
            fullPage: true 
          });
          
          console.log(`\n⚡ Fast-Paced Response Test Summary:`);
          if (characterAICalls.length > 0) {
            console.log('✅ Character AI integration attempted');
          } else {
            console.log('❌ No Character AI calls detected');
          }
          
          if (fallbackMessages.length > 0) {
            console.log('✅ Enhanced fallback responses active');
          } else {
            console.log('⚠️ No fallback messages detected');
          }
          
          if (messageElements.length >= 2) {
            console.log('✅ Conversation system working');
          } else {
            console.log('❌ Conversation system not responding');
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

testFastPacedResponses().catch(console.error);
