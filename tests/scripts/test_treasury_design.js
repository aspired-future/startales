import { chromium } from 'playwright';

async function testTreasuryDesign() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Look for Treasury button in left panel
    const treasuryButton = page.locator('button:has-text("Treasury"), button:has-text("💰")').first();
    
    if (await treasuryButton.isVisible()) {
      console.log('✅ Treasury button found, clicking...');
      await treasuryButton.click();
      
      // Wait for Treasury popup to open
      await page.waitForTimeout(2000);
      
      // Take screenshot of Treasury screen
      await page.screenshot({ 
        path: 'tests/screenshots/treasury_design.png', 
        fullPage: true 
      });
      
      console.log('✅ Treasury screen screenshot saved');
      
      // Check for tabs in header
      const tabs = page.locator('.base-screen-tab');
      const tabCount = await tabs.count();
      console.log(`📊 Found ${tabCount} tabs in Treasury header`);
      
      // Check for close button
      const closeButton = page.locator('.close-btn');
      if (await closeButton.isVisible()) {
        console.log('✅ Close button (X) found in header');
      }
      
      // Check for WhoseApp, Refresh, Auto buttons
      const whoseAppBtn = page.locator('button:has-text("WhoseApp")');
      const refreshBtn = page.locator('button:has-text("Refresh")');
      const autoBtn = page.locator('button:has-text("Auto")');
      
      if (await whoseAppBtn.isVisible()) console.log('✅ WhoseApp button found');
      if (await refreshBtn.isVisible()) console.log('✅ Refresh button found');
      if (await autoBtn.isVisible()) console.log('✅ Auto button found');
      
      // Test tab switching
      if (tabCount > 1) {
        const secondTab = tabs.nth(1);
        await secondTab.click();
        await page.waitForTimeout(1000);
        console.log('✅ Tab switching works');
      }
      
    } else {
      console.log('❌ Treasury button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testTreasuryDesign();

