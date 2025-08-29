import { chromium } from 'playwright';

async function debugTechnologyScreen() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Debugging Technology Screen...');
    
    // Navigate to the application
    await page.goto('http://localhost:5175');
    await page.waitForTimeout(3000);

    // Get all text content
    const text = await page.textContent('body');
    console.log('Page content (first 1000 chars):', text.substring(0, 1000));

    // Get all buttons
    const buttons = await page.$$eval('button', els => els.map(el => el.textContent));
    console.log('Buttons found:', buttons);

    // Look for Science & Tech button
    const scienceButton = await page.$('button:has-text("🔬SCIENCE & TECH")');
    if (scienceButton) {
      await scienceButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Clicked Science & Tech category');
      
      // Look for Technology button
      const technologyButton = await page.$('button:has-text("Technology")');
      if (technologyButton) {
        await technologyButton.click();
        await page.waitForTimeout(2000);
        console.log('✅ Clicked Technology button');
        
        // Check for errors in console
        const errors = await page.evaluate(() => {
          return window.consoleErrors || [];
        });
        console.log('Console errors:', errors);
        
        // Check if screen loaded
        const screenContainer = await page.$('.standard-screen-container');
        if (screenContainer) {
          console.log('✅ Standard screen container found');
        } else {
          console.log('❌ Standard screen container not found');
        }
        
        // Take screenshot
        await page.screenshot({
          path: 'tests/screenshots/debug-technology-screen.png',
          fullPage: true
        });
      } else {
        console.log('❌ Technology button not found');
      }
    } else {
      console.log('❌ Science & Tech button not found');
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugTechnologyScreen().catch(console.error);

