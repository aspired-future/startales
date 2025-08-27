const { chromium } = require('playwright');

async function checkUI() {
  console.log('🚀 Starting Playwright UI check...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`📝 Console [${type}]: ${text}`);
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    console.log('🌐 Navigating to http://localhost:5174/...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    
    // Check if the page loaded
    const title = await page.title();
    console.log(`📄 Page Title: ${title}`);
    
    // Check if root div exists
    const rootDiv = await page.$('#root');
    console.log(`🎯 Root div found: ${!!rootDiv}`);
    
    // Check if there's any content in root
    const rootContent = await page.$eval('#root', el => el.innerHTML.length);
    console.log(`📏 Root content length: ${rootContent} characters`);
    
    // Check for specific UI elements
    const hudElement = await page.$('[class*="hud"], [class*="HUD"], [class*="game"]');
    console.log(`🎮 HUD element found: ${!!hudElement}`);
    
    // Get any visible text
    const bodyText = await page.$eval('body', el => el.innerText.substring(0, 200));
    console.log(`📝 Visible text: ${bodyText || 'No visible text'}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'ui-debug-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as ui-debug-screenshot.png');
    
    // Check network requests
    const responses = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        responses.push(`❌ ${response.status()} ${response.url()}`);
      }
    });
    
    // Reload to catch network issues
    await page.reload({ waitUntil: 'networkidle' });
    
    if (responses.length > 0) {
      console.log('🚨 Failed network requests:');
      responses.forEach(resp => console.log(resp));
    } else {
      console.log('✅ All network requests successful');
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('🏁 Playwright check complete');
  }
}

checkUI();
