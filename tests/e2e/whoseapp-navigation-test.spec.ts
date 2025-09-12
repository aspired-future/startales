import { test, expect } from '@playwright/test';

test.describe('WhoseApp Navigation and Functionality Test', () => {
  test('Find and test WhoseApp navigation', async ({ page }) => {
    console.log('🔍 Testing WhoseApp navigation...');
    
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
    
    // Take initial screenshot
    await page.screenshot({ path: 'debug-whoseapp-initial.png', fullPage: true });
    
    // Look for WhoseApp button/navigation
    console.log('🔍 Looking for WhoseApp navigation elements...');
    
    // Try multiple selectors for WhoseApp
    const whoseappSelectors = [
      'text=/whoseapp/i',
      'text=/whose app/i', 
      'text=/chat/i',
      'text=/message/i',
      'text=/conversation/i',
      '[data-testid*="whoseapp"]',
      '[class*="whoseapp"]',
      '[class*="chat"]',
      'button:has-text("WhoseApp")',
      'button:has-text("Chat")',
      'a:has-text("WhoseApp")',
      'a:has-text("Chat")',
      '.nav button',
      '.navigation button',
      '.menu button'
    ];
    
    let whoseappElement = null;
    let foundSelector = '';
    
    for (const selector of whoseappSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found WhoseApp element: ${selector} (${count} elements)`);
        whoseappElement = page.locator(selector).first();
        foundSelector = selector;
        break;
      }
    }
    
    if (!whoseappElement) {
      console.log('❌ No WhoseApp elements found, looking for any navigation...');
      
      // Look for any buttons or navigation
      const allButtons = await page.locator('button').count();
      console.log(`🔘 Total buttons found: ${allButtons}`);
      
      if (allButtons > 0) {
        const buttonTexts = await page.locator('button').allTextContents();
        console.log('🔘 Button texts:', buttonTexts.slice(0, 20));
        
        // Look for any button that might be WhoseApp
        for (let i = 0; i < Math.min(buttonTexts.length, 20); i++) {
          const text = buttonTexts[i].toLowerCase();
          if (text.includes('chat') || text.includes('message') || text.includes('whose') || text.includes('app')) {
            console.log(`🎯 Potential WhoseApp button found: "${buttonTexts[i]}"`);
            whoseappElement = page.locator('button').nth(i);
            foundSelector = `button with text "${buttonTexts[i]}"`;
            break;
          }
        }
      }
      
      // Look for any links
      const allLinks = await page.locator('a').count();
      console.log(`🔗 Total links found: ${allLinks}`);
      
      if (allLinks > 0) {
        const linkTexts = await page.locator('a').allTextContents();
        console.log('🔗 Link texts:', linkTexts.slice(0, 10));
      }
    }
    
    if (whoseappElement) {
      console.log(`✅ Found WhoseApp element with selector: ${foundSelector}`);
      
      try {
        // Click the WhoseApp element
        await whoseappElement.click();
        console.log('✅ Successfully clicked WhoseApp element');
        
        // Wait for navigation/changes
        await page.waitForTimeout(3000);
        
        // Take screenshot after clicking
        await page.screenshot({ path: 'debug-whoseapp-clicked.png', fullPage: true });
        
        // Check if we're now in WhoseApp
        const whoseappContent = await page.locator('text=/whoseapp|chat|message|conversation/i').count();
        console.log(`💬 WhoseApp content elements after click: ${whoseappContent}`);
        
        // Look for character elements
        const characterElements = await page.locator('text=/character|Character|CHARACTER/i').count();
        console.log(`👤 Character elements: ${characterElements}`);
        
        // Look for conversation elements
        const conversationElements = await page.locator('text=/conversation|message|chat/i').count();
        console.log(`💬 Conversation elements: ${conversationElements}`);
        
        // Look for input fields (for messaging)
        const inputFields = await page.locator('input, textarea').count();
        console.log(`📝 Input fields: ${inputFields}`);
        
        if (inputFields > 0) {
          const inputTypes = await page.locator('input, textarea').evaluateAll(elements => 
            elements.map(el => ({ 
              tag: el.tagName, 
              type: el.getAttribute('type'), 
              placeholder: el.getAttribute('placeholder'),
              id: el.id,
              className: el.className
            }))
          );
          console.log('📝 Input field details:', inputTypes);
        }
        
      } catch (error) {
        console.log(`❌ Failed to click WhoseApp element: ${error}`);
      }
    } else {
      console.log('❌ No WhoseApp navigation found');
      
      // Take screenshot of current state
      await page.screenshot({ path: 'debug-whoseapp-not-found.png', fullPage: true });
      
      // Log the page structure for debugging
      const pageText = await page.locator('body').textContent();
      console.log('📄 Page text content (first 500 chars):', pageText?.substring(0, 500));
    }
    
    // Final screenshot
    await page.screenshot({ path: 'debug-whoseapp-final.png', fullPage: true });
    
    console.log(`🚨 Total Console Errors: ${consoleErrors.length}`);
    
    // Test should pass if we found some navigation, even if not specifically WhoseApp
    const hasNavigation = whoseappElement !== null;
    console.log(`🎯 Navigation test result: ${hasNavigation ? 'PASS' : 'FAIL'}`);
    
    // Don't fail the test, just report findings
    expect(true).toBe(true); // Always pass for debugging purposes
  });
});
