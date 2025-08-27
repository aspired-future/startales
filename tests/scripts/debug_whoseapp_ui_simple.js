import { chromium } from 'playwright';

async function debugWhoseAppUI() {
  console.log('🔍 Debugging WhoseApp UI...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(5000);
    
    console.log('🔍 Looking for WhoseApp...');
    const whoseAppButtons = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseAppButtons.length} WhoseApp buttons`);
    
    if (whoseAppButtons.length > 0) {
      console.log('✅ Clicking WhoseApp...');
      await whoseAppButtons[0].click();
      await page.waitForTimeout(5000);
      
      // Take screenshot after opening WhoseApp
      await page.screenshot({ 
        path: 'tests/screenshots/whoseapp_opened.png', 
        fullPage: true 
      });
      
      console.log('🔍 Looking for message inputs...');
      
      // Try different selectors for message input
      const inputSelectors = [
        'input[placeholder*="Message"]',
        'textarea[placeholder*="Message"]',
        'input[type="text"]',
        'textarea',
        '.message-input',
        '[class*="input"]'
      ];
      
      for (const selector of inputSelectors) {
        const inputs = await page.locator(selector).all();
        console.log(`- ${selector}: ${inputs.length} found`);
        
        if (inputs.length > 0) {
          for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const isVisible = await input.isVisible();
            const placeholder = await input.getAttribute('placeholder');
            console.log(`  Input ${i}: visible=${isVisible}, placeholder="${placeholder}"`);
          }
        }
      }
      
      console.log('🔍 Looking for send buttons...');
      const sendSelectors = [
        'text=Send',
        'button:has-text("Send")',
        '[class*="send"]',
        'button[type="submit"]'
      ];
      
      for (const selector of sendSelectors) {
        const buttons = await page.locator(selector).all();
        console.log(`- ${selector}: ${buttons.length} found`);
      }
      
      console.log('🔍 Looking for conversation elements...');
      const conversationSelectors = [
        '.conversation',
        '.messages',
        '.chat',
        '[class*="message"]',
        '[class*="conversation"]'
      ];
      
      for (const selector of conversationSelectors) {
        const elements = await page.locator(selector).all();
        console.log(`- ${selector}: ${elements.length} found`);
      }
      
    } else {
      console.log('❌ WhoseApp button not found');
      
      // Take screenshot of main screen
      await page.screenshot({ 
        path: 'tests/screenshots/main_screen.png', 
        fullPage: true 
      });
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugWhoseAppUI().catch(console.error);
