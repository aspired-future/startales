import { chromium } from 'playwright';

async function testTechnologyDesign() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Testing Technology Screen Design...');
    
    // Navigate to the application
    await page.goto('http://localhost:5175');
    await page.waitForTimeout(3000);

    // Click on Science & Tech category first
    const scienceButton = await page.$('button:has-text("🔬SCIENCE & TECH")');
    if (scienceButton) {
      await scienceButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Clicked Science & Tech category');
    } else {
      console.log('❌ Science & Tech button not found');
    }

    // Look for Technology button
    const technologyButton = await page.$('button:has-text("Technology")');
    if (technologyButton) {
      await technologyButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Clicked Technology button');
    } else {
      console.log('❌ Technology button not found');
    }

    // Check if the screen loaded
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

    // Check for tables
    const tables = await page.$$('.standard-data-table');
    console.log(`✅ Found ${tables.length} data tables`);

    // Take screenshots
    await page.screenshot({
      path: 'tests/screenshots/technology-screen-overview.png',
      fullPage: true
    });

    // Test different tabs
    const tabLabels = ['Overview', 'Technologies', 'Research', 'Cyber Ops', 'Transfers', 'Analytics'];
    
    for (const tabLabel of tabLabels) {
      const tab = await page.$(`button:has-text("${tabLabel}")`);
      if (tab) {
        await tab.click();
        await page.waitForTimeout(1000);
        console.log(`✅ Clicked ${tabLabel} tab`);
        
        // Take screenshot of each tab
        await page.screenshot({
          path: `tests/screenshots/technology-screen-${tabLabel.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true
        });
      } else {
        console.log(`❌ ${tabLabel} tab not found`);
      }
    }

    console.log('🎉 Technology Screen test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testTechnologyDesign().catch(console.error);
