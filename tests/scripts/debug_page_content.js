import { chromium } from 'playwright';

async function debugPageContent() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging page content...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Get all text content
    const text = await page.textContent('body');
    console.log('Page content (first 1000 chars):', text.substring(0, 1000));
    
    // Get all buttons
    const buttons = await page.$$eval('button', els => els.map(el => el.textContent));
    console.log('Buttons found:', buttons);
    
    // Get all links
    const links = await page.$$eval('a', els => els.map(el => el.textContent));
    console.log('Links found:', links);
    
    // Get all divs with text
    const divs = await page.$$eval('div', els => els.map(el => el.textContent).filter(text => text && text.trim().length > 0));
    console.log('Divs with text (first 10):', divs.slice(0, 10));
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/debug-page-content.png',
      fullPage: true 
    });
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugPageContent().catch(console.error);

