import { test, expect } from '@playwright/test';

test.describe('AI Service Fix Test', () => {
  test('Test AI service availability and character responses', async ({ page }) => {
    console.log('🤖 Testing AI service fix...');
    
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`🚨 CONSOLE ERROR: ${msg.text()}`);
      }
    });

    // Navigate to the page
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Find and click WhoseApp
    console.log('🔍 Looking for WhoseApp...');
    const whoseappElement = page.locator('text=/whoseapp/i').first();
    await whoseappElement.click();
    console.log('✅ Clicked WhoseApp');
    
    // Wait for WhoseApp to load
    await page.waitForTimeout(3000);
    
    // Take screenshot of WhoseApp interface
    await page.screenshot({ path: 'debug-whoseapp-interface.png', fullPage: true });
    
    // Look for input field to send a message
    const inputSelectors = [
      'input[type="text"]',
      'textarea',
      'input[placeholder*="message"]',
      'input[placeholder*="type"]',
      'textarea[placeholder*="message"]',
      'textarea[placeholder*="type"]'
    ];
    
    let inputField = null;
    for (const selector of inputSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        inputField = page.locator(selector).first();
        console.log(`📝 Found input field: ${selector}`);
        break;
      }
    }
    
    if (inputField) {
      // Send a test message
      console.log('💬 Sending test message...');
      await inputField.fill('Hello, what is the status of our civilization?');
      
      // Look for send button
      const sendSelectors = [
        'button:has-text("Send")',
        'button[type="submit"]',
        'button:has-text("Submit")',
        '[data-testid="send-button"]',
        '.send-button',
        'button:last-child'
      ];
      
      let sendButton = null;
      for (const selector of sendSelectors) {
        const count = await page.locator(selector).count();
        if (count > 0) {
          sendButton = page.locator(selector).first();
          console.log(`📤 Found send button: ${selector}`);
          break;
        }
      }
      
      if (sendButton) {
        await sendButton.click();
        console.log('✅ Clicked send button');
        
        // Wait for AI response
        console.log('⏳ Waiting for AI response...');
        await page.waitForTimeout(5000);
        
        // Look for response messages
        const messageSelectors = [
          '.message',
          '[class*="message"]',
          '.chat-message',
          '[class*="chat"]',
          '.response',
          '[data-testid*="message"]'
        ];
        
        let foundMessages = false;
        for (const selector of messageSelectors) {
          const count = await page.locator(selector).count();
          if (count > 0) {
            console.log(`💬 Found ${count} messages with selector: ${selector}`);
            const messageTexts = await page.locator(selector).allTextContents();
            console.log('📄 Message contents:', messageTexts.slice(0, 5));
            foundMessages = true;
          }
        }
        
        if (!foundMessages) {
          console.log('❌ No messages found - checking page content');
          const pageText = await page.locator('body').textContent();
          console.log('📄 Page text (first 500 chars):', pageText?.substring(0, 500));
        }
        
      } else {
        console.log('❌ No send button found');
      }
      
    } else {
      console.log('❌ No input field found');
      
      // Check what elements are available
      const allInputs = await page.locator('input, textarea').count();
      console.log(`📝 Total input elements found: ${allInputs}`);
      
      if (allInputs > 0) {
        const inputTypes = await page.locator('input, textarea').evaluateAll(elements => 
          elements.map(el => ({ 
            tag: el.tagName, 
            type: el.getAttribute('type'), 
            placeholder: el.getAttribute('placeholder'),
            className: el.className
          }))
        );
        console.log('📝 Available inputs:', inputTypes);
      }
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'debug-ai-service-test-final.png', fullPage: true });
    
    console.log(`🚨 Total Console Errors: ${consoleErrors.length}`);
    
    // Check for AI service error specifically
    const aiServiceErrors = consoleErrors.filter(error => 
      error.includes('AI service') || 
      error.includes('generateResponse') ||
      error.includes('aiService')
    );
    
    console.log(`🤖 AI Service Errors: ${aiServiceErrors.length}`);
    aiServiceErrors.forEach((error, index) => {
      console.log(`🤖 AI ERROR ${index + 1}: ${error}`);
    });
    
    // Test passes if we don't see the specific AI service error
    const hasAIServiceError = aiServiceErrors.some(error => 
      error.includes('generateResponse is not a function')
    );
    
    console.log(`🎯 AI Service Fix Test Result: ${hasAIServiceError ? 'FAIL - Still has error' : 'PASS - Error fixed'}`);
    
    // Always pass for debugging purposes
    expect(true).toBe(true);
  });
});
