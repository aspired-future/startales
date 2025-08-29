import { chromium } from 'playwright';

async function simpleTechTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Simple Technology Screen Test...');
    
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

    // Check if screen loaded
    const screenContainer = await page.$('.standard-screen-container');
    if (screenContainer) {
      console.log('✅ Standard screen container found');
    } else {
      console.log('❌ Standard screen container not found');
    }

    // Check for tabs
    const tabs = await page.$$('.standard-tab');
    console.log(`✅ Found ${tabs.length} tabs`);

    // Check for content
    const panels = await page.$$('.standard-panel');
    console.log(`✅ Found ${panels.length} panels`);

    // Check for metrics
    const metrics = await page.$$('.standard-metric');
    console.log(`✅ Found ${metrics.length} metrics`);

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/simple-tech-test.png',
      fullPage: true
    });

    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

simpleTechTest().catch(console.error);

