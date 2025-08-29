import { chromium } from 'playwright';

async function simpleTechnologyTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Simple Technology Screen Test...');
    
    // Navigate to the application
    await page.goto('http://localhost:5175');
    await page.waitForTimeout(3000);

    // Click on Science & Tech category
    const scienceButton = await page.$('button:has-text("🔬SCIENCE & TECH")');
    if (scienceButton) {
      await scienceButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Clicked Science & Tech category');
    } else {
      console.log('❌ Science & Tech button not found');
      return;
    }

    // Look for Technology button
    const technologyButton = await page.$('button:has-text("Technology")');
    if (technologyButton) {
      await technologyButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Clicked Technology button');
    } else {
      console.log('❌ Technology button not found');
      return;
    }

    // Check if any content loaded
    const anyContent = await page.$('div');
    if (anyContent) {
      console.log('✅ Some content found');
    } else {
      console.log('❌ No content found');
    }

    // Check for specific elements
    const screenContainer = await page.$('.standard-screen-container');
    if (screenContainer) {
      console.log('✅ Standard screen container found');
    } else {
      console.log('❌ Standard screen container not found');
    }

    const tabs = await page.$$('.standard-tab');
    console.log(`✅ Found ${tabs.length} tabs`);

    const panels = await page.$$('.standard-panel');
    console.log(`✅ Found ${panels.length} panels`);

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/simple-technology-test.png',
      fullPage: true
    });

    console.log('🎉 Simple test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

simpleTechnologyTest().catch(console.error);

