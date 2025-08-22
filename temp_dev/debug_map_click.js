import { chromium } from 'playwright';

async function debugMapClick() {
  console.log('🔍 Debugging Map Button Click...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('🖥️  BROWSER:', msg.type(), msg.text());
  });
  
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 15000 });
    
    console.log('✅ App loaded, checking Map button...');
    
    // Check if Map button exists and is clickable
    const mapButton = await page.locator('text=🗺️ Map');
    const isVisible = await mapButton.isVisible();
    const isEnabled = await mapButton.isEnabled();
    
    console.log(`🗺️ Map button - Visible: ${isVisible}, Enabled: ${isEnabled}`);
    
    if (isVisible && isEnabled) {
      console.log('🖱️ Clicking Map button...');
      await mapButton.click();
      
      // Wait and check what elements appear
      await page.waitForTimeout(3000);
      
      // Check for various popup selectors
      const selectors = [
        '.popup-backdrop',
        '.popup-screen',
        '.map-popup-content',
        '.map-container',
        '.galaxy-map-component'
      ];
      
      for (const selector of selectors) {
        const exists = await page.locator(selector).isVisible().catch(() => false);
        console.log(`${exists ? '✅' : '❌'} ${selector}: ${exists ? 'visible' : 'not found'}`);
      }
      
      // Get all elements with 'popup' in their class
      const popupElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements
          .filter(el => el.className && el.className.includes('popup'))
          .map(el => ({
            tagName: el.tagName,
            className: el.className,
            visible: el.offsetParent !== null
          }));
      });
      
      console.log('\n🔍 Elements with "popup" in class:');
      popupElements.forEach(el => {
        console.log(`- ${el.tagName}.${el.className} (visible: ${el.visible})`);
      });
      
    } else {
      console.log('❌ Map button not clickable');
    }
    
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugMapClick().catch(console.error);
