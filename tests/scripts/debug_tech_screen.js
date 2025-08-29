import { chromium } from 'playwright';

async function debugTechScreen() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Debugging Technology Screen...');
    
    // Listen for all console messages
    page.on('console', msg => {
      console.log(`[${msg.type()}] ${msg.text()}`);
    });

    // Listen for errors
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
    });

    // Navigate to the application
    await page.goto('http://localhost:5175');
    await page.waitForTimeout(3000);

    console.log('✅ Page loaded');

    // Click on Science & Tech category
    const scienceButton = await page.$('button:has-text("🔬SCIENCE & TECH")');
    if (scienceButton) {
      await scienceButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Clicked Science & Tech category');
    } else {
      console.log('❌ Science & Tech button not found');
    }

    // Click on Technology button
    const technologyButton = await page.$('button:has-text("Technology")');
    if (technologyButton) {
      await technologyButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Clicked Technology button');
    } else {
      console.log('❌ Technology button not found');
    }

    // Wait for any errors to appear
    await page.waitForTimeout(3000);

    // Check if screen loaded
    const screenContainer = await page.$('.standard-screen-container');
    if (screenContainer) {
      console.log('✅ Standard screen container found');
    } else {
      console.log('❌ Standard screen container not found');
    }

    // Check for any error messages on the page
    const errorElements = await page.$$('.error-message, [data-error], .error');
    if (errorElements.length > 0) {
      console.log(`❌ Found ${errorElements.length} error elements`);
      for (let i = 0; i < errorElements.length; i++) {
        const text = await errorElements[i].textContent();
        console.log(`Error ${i + 1}: ${text}`);
      }
    }

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/debug-tech-screen.png',
      fullPage: true
    });

    console.log('✅ Debug completed');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('Browser will stay open for manual inspection. Close it when done.');
  }
}

debugTechScreen().catch(console.error);

