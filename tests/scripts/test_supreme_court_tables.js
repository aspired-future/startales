import { chromium } from 'playwright';

async function testSupremeCourtTables() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to the application...');
    await page.goto('http://localhost:5175');
    
    // Wait for the app to load
    await page.waitForTimeout(2000);
    
    // Look for Supreme Court button/link
    console.log('Looking for Supreme Court screen access...');
    
    // Try different selectors for Supreme Court
    const supremeCourtSelectors = [
      'text=Supreme Court',
      '[data-testid="supreme-court"]',
      'button:has-text("Supreme Court")',
      '.supreme-court-button',
      '[title*="Supreme Court"]'
    ];
    
    let supremeCourtElement = null;
    for (const selector of supremeCourtSelectors) {
      try {
        supremeCourtElement = await page.waitForSelector(selector, { timeout: 2000 });
        if (supremeCourtElement) {
          console.log(`Found Supreme Court element with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }
    
    if (supremeCourtElement) {
      console.log('Clicking Supreme Court button...');
      await supremeCourtElement.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('Supreme Court button not found, taking screenshot of current page...');
    }
    
    // Take screenshot of the current state
    await page.screenshot({ 
      path: 'tests/screenshots/supreme-court-tables.png',
      fullPage: true 
    });
    console.log('Screenshot saved as supreme-court-tables.png');
    
    // Check for table elements
    const tables = await page.$$('.data-table');
    console.log(`Found ${tables.length} data tables on the page`);
    
    // Check for tabs
    const tabs = await page.$$('.base-screen-tab, .tab');
    console.log(`Found ${tabs.length} tabs on the page`);
    
    // Test clicking through tabs if they exist
    if (tabs.length > 0) {
      console.log('Testing tab navigation...');
      for (let i = 0; i < Math.min(tabs.length, 5); i++) {
        try {
          await tabs[i].click();
          await page.waitForTimeout(500);
          console.log(`Clicked tab ${i + 1}`);
          
          // Take screenshot of each tab
          await page.screenshot({ 
            path: `tests/screenshots/supreme-court-tab-${i + 1}.png`,
            fullPage: true 
          });
        } catch (e) {
          console.log(`Error clicking tab ${i + 1}:`, e.message);
        }
      }
    }
    
    console.log('Supreme Court table test completed successfully!');
    
  } catch (error) {
    console.error('Error during Supreme Court table test:', error);
    await page.screenshot({ 
      path: 'tests/screenshots/supreme-court-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testSupremeCourtTables();

