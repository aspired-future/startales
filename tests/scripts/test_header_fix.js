import { chromium } from 'playwright';

async function testHeaderFix() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Testing header fix...');
    
    // Navigate to the application
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(3000);
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'temp_dev/header_fix_initial.png', fullPage: true });
    
    // Look for Supreme Court screen
    console.log('Looking for Supreme Court screen...');
    
    // Try different selectors to find Supreme Court
    let supremeCourtButton = null;
    
    // Try text selector
    supremeCourtButton = await page.locator('text=Supreme Court').first();
    if (!(await supremeCourtButton.isVisible())) {
      // Try button selector
      supremeCourtButton = await page.locator('button:has-text("Supreme Court")').first();
    }
    if (!(await supremeCourtButton.isVisible())) {
      // Try div selector
      supremeCourtButton = await page.locator('div:has-text("Supreme Court")').first();
    }
    if (!(await supremeCourtButton.isVisible())) {
      // Try any clickable element
      supremeCourtButton = await page.locator('[role="button"]:has-text("Supreme Court"), .clickable:has-text("Supreme Court"), .screen-button:has-text("Supreme Court")').first();
    }
    
    if (await supremeCourtButton.isVisible()) {
      console.log('Found Supreme Court button, clicking...');
      await supremeCourtButton.click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'temp_dev/supreme_court_after_fix.png', fullPage: true });
      
      // Count headers containing "Supreme Court"
      const headerElements = await page.locator('*:has-text("Supreme Court")').all();
      console.log(`Found ${headerElements.length} elements containing "Supreme Court"`);
      
      // Check specifically for header elements
      const h1Headers = await page.locator('h1:has-text("Supreme Court")').count();
      const h2Headers = await page.locator('h2:has-text("Supreme Court")').count();
      const h3Headers = await page.locator('h3:has-text("Supreme Court")').count();
      
      console.log(`H1 headers: ${h1Headers}`);
      console.log(`H2 headers: ${h2Headers}`);
      console.log(`H3 headers: ${h3Headers}`);
      
      // Check for the new BaseScreen header class
      const baseScreenHeaders = await page.locator('.base-screen-header').count();
      console.log(`BaseScreen headers: ${baseScreenHeaders}`);
      
      // Check for old screen-header class (should be 0 or from other components)
      const oldScreenHeaders = await page.locator('.screen-header').count();
      console.log(`Old screen-header elements: ${oldScreenHeaders}`);
      
      // Highlight the BaseScreen header
      await page.locator('.base-screen-header').first().evaluate(el => {
        el.style.border = '3px solid lime';
        el.style.backgroundColor = 'rgba(0,255,0,0.2)';
      });
      
      // Take final screenshot with highlighting
      await page.screenshot({ path: 'temp_dev/supreme_court_highlighted.png', fullPage: true });
      
      console.log('\\n=== HEADER FIX TEST RESULTS ===');
      console.log(`✅ BaseScreen headers found: ${baseScreenHeaders}`);
      console.log(`⚠️  Old screen-header elements: ${oldScreenHeaders}`);
      console.log(`📊 Total H2 headers with "Supreme Court": ${h2Headers}`);
      
      if (h2Headers <= 1 && baseScreenHeaders === 1) {
        console.log('🎉 SUCCESS: Double header issue appears to be FIXED!');
      } else {
        console.log('❌ ISSUE: Still seeing multiple headers');
      }
      
    } else {
      console.log('❌ Supreme Court button not found');
      
      // List all visible text elements to help debug
      const allText = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*')).filter(el => 
          el.textContent && el.textContent.trim().length > 0 && el.children.length === 0
        );
        return elements.slice(0, 20).map(el => el.textContent.trim());
      });
      
      console.log('Visible text elements:', allText);
      await page.screenshot({ path: 'temp_dev/no_supreme_court_found.png', fullPage: true });
    }
    
    // Test Legislative screen too
    console.log('\\nTesting Legislative screen...');
    const legislativeButton = await page.locator('text=Legislative').first();
    if (await legislativeButton.isVisible()) {
      await legislativeButton.click();
      await page.waitForTimeout(2000);
      
      const legH2Headers = await page.locator('h2:has-text("Legislative")').count();
      console.log(`Legislative H2 headers: ${legH2Headers}`);
      
      await page.screenshot({ path: 'temp_dev/legislative_after_fix.png', fullPage: true });
    }
    
    // Wait for manual inspection
    console.log('\\nWaiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('Error during testing:', error);
    await page.screenshot({ path: 'temp_dev/test_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testHeaderFix().catch(console.error);

