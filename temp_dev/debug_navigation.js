import { chromium } from 'playwright';

async function debugNavigation() {
  console.log('🔍 Debugging Navigation Elements...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 15000 });
    
    // Get all clickable text elements
    const clickableElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a, [role="button"], .tab-btn, .screen-btn'));
      return elements.map(el => ({
        text: el.textContent?.trim(),
        className: el.className,
        tagName: el.tagName
      })).filter(el => el.text && el.text.length > 0);
    });
    
    console.log('🔍 Found clickable elements:');
    clickableElements.forEach((el, i) => {
      console.log(`${i + 1}. "${el.text}" (${el.tagName}.${el.className})`);
    });
    
    // Look for screen navigation specifically
    const screenElements = await page.evaluate(() => {
      const screens = Array.from(document.querySelectorAll('[class*="screen"], [class*="tab"], [class*="nav"]'));
      return screens.map(el => ({
        text: el.textContent?.trim(),
        className: el.className,
        id: el.id
      })).filter(el => el.text && el.text.length > 0);
    });
    
    console.log('\n🖥️ Screen/Tab elements:');
    screenElements.forEach((el, i) => {
      console.log(`${i + 1}. "${el.text}" (${el.className})`);
    });
    
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugNavigation().catch(console.error);
