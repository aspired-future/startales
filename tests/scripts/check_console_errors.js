import { chromium } from 'playwright';

async function checkConsoleErrors() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Checking console errors...');
    
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('❌ Page Error:', error.message);
    });

    // Navigate to the application
    await page.goto('http://localhost:5175');
    await page.waitForTimeout(3000);

    // Click on Science & Tech category
    const scienceButton = await page.$('button:has-text("🔬SCIENCE & TECH")');
    if (scienceButton) {
      await scienceButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Clicked Science & Tech category');
    }

    // Click on Technology button
    const technologyButton = await page.$('button:has-text("Technology")');
    if (technologyButton) {
      await technologyButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Clicked Technology button');
    }

    // Wait a bit more for any errors to appear
    await page.waitForTimeout(2000);

    // Check if screen loaded
    const screenContainer = await page.$('.standard-screen-container');
    if (screenContainer) {
      console.log('✅ Standard screen container found');
    } else {
      console.log('❌ Standard screen container not found');
    }

    // Check for any React errors
    const reactError = await page.$('[data-react-error]');
    if (reactError) {
      console.log('❌ React error detected');
    }

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/console-errors-check.png',
      fullPage: true
    });

    console.log(`📊 Total errors found: ${errors.length}`);
    if (errors.length === 0) {
      console.log('✅ No console errors detected');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

checkConsoleErrors().catch(console.error);
