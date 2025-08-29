import { chromium } from 'playwright';

async function testFrontendScreenshot() {
  console.log('📸 Taking frontend screenshot...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the frontend
    console.log('🌐 Navigating to frontend...');
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForTimeout(5000);
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'frontend-screenshot.png', fullPage: true });
    console.log('✅ Screenshot saved as frontend-screenshot.png');
    
    // Get page content to see what's available
    console.log('📄 Page content:');
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    
    // Look for any text content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    
    // Look for any React components or navigation
    const allElements = await page.locator('*').all();
    console.log(`Total elements on page: ${allElements.length}`);
    
    // Look for specific elements
    const navElements = await page.locator('nav, .nav, .navigation, .menu').all();
    console.log(`Navigation elements found: ${navElements.length}`);
    
    const buttonElements = await page.locator('button, .btn, [role="button"]').all();
    console.log(`Button elements found: ${buttonElements.length}`);
    
    // List all text content
    const textElements = await page.locator('h1, h2, h3, h4, h5, h6, p, span, div, a').all();
    console.log('📋 Text elements found:');
    for (let i = 0; i < Math.min(textElements.length, 20); i++) {
      const text = await textElements[i].textContent();
      if (text && text.trim().length > 0) {
        console.log(`  ${i + 1}. "${text.trim()}"`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testFrontendScreenshot();
