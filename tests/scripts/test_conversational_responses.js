import { chromium } from 'playwright';

async function testConversationalResponses() {
  console.log('💬 Testing Conversational Character Responses...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  
  // Collect console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    // Log relevant messages
    if (text.includes('Character AI') || text.includes('fallback') || 
        text.includes('response') || text.includes('Speaking AI')) {
      console.log(`[${type.toUpperCase()}] ${text}`);
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
      
      // Take screenshot to see the interface
      await page.screenshot({ 
        path: 'tests/screenshots/whoseapp_interface.png', 
        fullPage: true 
      });
      
      console.log('💬 Testing conversational flow...');
      
      // Look for any clickable conversation or character elements
      const conversationElements = await page.locator('[class*="conversation"], [class*="character"], .conversation-item, .character-item').all();
      console.log(`Found ${conversationElements.length} conversation/character elements`);
      
      if (conversationElements.length > 0) {
        console.log('✅ Clicking first conversation/character element...');
        await conversationElements[0].click();
        await page.waitForTimeout(2000);
        
        // Now look for message input after selecting conversation
        const messageInputs = await page.locator('input, textarea').all();
        console.log(`Found ${messageInputs.length} input elements after selecting conversation`);
        
        for (let i = 0; i < messageInputs.length; i++) {
          const input = messageInputs[i];
          const isVisible = await input.isVisible();
          const placeholder = await input.getAttribute('placeholder');
          const type = await input.getAttribute('type');
          console.log(`  Input ${i}: visible=${isVisible}, placeholder="${placeholder}", type="${type}"`);
          
          if (isVisible && (placeholder?.includes('Message') || placeholder?.includes('message') || type === 'text')) {
            console.log('✅ Found suitable message input, testing conversation...');
            
            await input.fill('What is the current status of our civilization?');
            
            // Look for send button
            const sendButtons = await page.locator('button').filter({ hasText: /Send|send/ }).all();
            if (sendButtons.length > 0) {
              console.log('📤 Sending message...');
              await sendButtons[0].click();
              
              console.log('⏳ Waiting for conversational response...');
              await page.waitForTimeout(8000);
              
              // Check for fallback responses (which should now be conversational)
              const fallbackMessages = consoleMessages.filter(msg => 
                msg.text.includes('Character AI failed, using enhanced fallback')
              );
              
              if (fallbackMessages.length > 0) {
                console.log('✅ Using enhanced conversational fallback responses');
              }
              
              // Look for the response in the conversation
              const messageElements = await page.locator('[class*="message"], .chat-message, .conversation-message').all();
              console.log(`\n💬 Total messages in conversation: ${messageElements.length}`);
              
              if (messageElements.length >= 2) {
                console.log('✅ Conversation flow working');
                
                // Try to extract and analyze the AI response
                try {
                  const lastMessage = messageElements[messageElements.length - 1];
                  const responseText = await lastMessage.textContent();
                  
                  console.log(`\n📝 AI Response Analysis:`);
                  console.log(`"${responseText?.substring(0, 300)}..."`);
                  
                  // Check if response uses complete sentences and sounds conversational
                  const isConversational = responseText && 
                    responseText.includes('.') && // Has periods (complete sentences)
                    responseText.length > 50 && // Substantial response
                    !responseText.includes('•') && // No bullet points
                    !responseText.includes('Recommend:') && // No telegram-style recommendations
                    (responseText.includes('we') || responseText.includes('I') || responseText.includes('our')); // Personal pronouns
                  
                  if (isConversational) {
                    console.log('✅ Response uses complete sentences and sounds conversational');
                  } else {
                    console.log('❌ Response still sounds like bullet points or telegrams');
                  }
                  
                  // Check for natural conversation flow
                  const hasNaturalFlow = responseText && 
                    (responseText.includes('which') || responseText.includes('though') || 
                     responseText.includes('however') || responseText.includes('meanwhile') ||
                     responseText.includes('but') || responseText.includes('and'));
                  
                  if (hasNaturalFlow) {
                    console.log('✅ Response has natural conversational flow');
                  } else {
                    console.log('⚠️ Response could use more natural conversational connectors');
                  }
                  
                } catch (error) {
                  console.log('⚠️ Could not extract response text for analysis');
                }
              } else {
                console.log('❌ No AI response detected');
              }
              
              break; // Found working input, exit loop
            } else {
              console.log('❌ No send button found');
            }
          }
        }
      } else {
        console.log('⚠️ No conversation elements found, interface may be different');
      }
      
      // Take final screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/conversational_test_result.png', 
        fullPage: true 
      });
      
    } else {
      console.log('❌ WhoseApp button not found');
    }
    
    console.log(`\n💬 Conversational Response Test Summary:`);
    const fallbackMessages = consoleMessages.filter(msg => 
      msg.text.includes('Character AI failed, using enhanced fallback')
    );
    
    if (fallbackMessages.length > 0) {
      console.log('✅ Enhanced conversational fallback responses active');
    } else {
      console.log('⚠️ No fallback messages detected - may be using Character AI or no responses triggered');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testConversationalResponses().catch(console.error);
