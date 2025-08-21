const { chromium } = require('playwright');

async function testProfessionsSimple() {
  console.log('🔍 Simple Professions Screen Test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Listen for all console messages
    page.on('console', msg => {
      console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
    });
    
    // Listen for network errors
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`❌ Network Error: ${response.status()} ${response.url()}`);
      }
    });
    
    console.log('📍 Navigating to HUD...');
    await page.goto('http://localhost:5174');
    
    // Wait longer for the page to load
    await page.waitForTimeout(5000);
    
    // Check if we can see any content at all
    const bodyContent = await page.locator('body').textContent();
    console.log(`📄 Page has content: ${bodyContent && bodyContent.length > 100}`);
    
    // Check for any React error boundaries
    const errorBoundary = await page.locator('[data-testid="error-boundary"], .error-boundary, .react-error').count();
    console.log(`❌ Error boundaries found: ${errorBoundary}`);
    
    // Check if the main app div exists
    const appDiv = await page.locator('#root, .app, .comprehensive-hud').count();
    console.log(`🎮 App container found: ${appDiv > 0}`);
    
    // Take a screenshot to see what's actually displayed
    await page.screenshot({ 
      path: 'temp_dev/professions_simple_test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as professions_simple_test.png');
    
    // Wait for manual inspection
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testProfessionsSimple().catch(console.error);
