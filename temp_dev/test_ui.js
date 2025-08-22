import { chromium } from 'playwright';

async function testUI() {
  console.log('🚀 Testing StarTales UI...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the UI
    console.log('📍 Navigating to http://localhost:5174');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    
    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/ui_test_screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/ui_test_screenshot.png');
    
    // Check if the page loaded
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check for the main app content
    const appContent = await page.textContent('body');
    if (appContent.includes('StarTales')) {
      console.log('✅ App content loaded successfully');
    } else {
      console.log('❌ App content not found');
    }
    
    // Check for API connectivity
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/health');
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    });
    
    console.log('🔌 API Health Check:', response);
    
    // Wait a bit to see the UI
    console.log('⏳ Waiting 10 seconds for you to see the UI...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error testing UI:', error);
  } finally {
    await browser.close();
  }
}

testUI().catch(console.error);
