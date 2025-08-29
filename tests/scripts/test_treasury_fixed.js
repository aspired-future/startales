import { chromium } from 'playwright';

async function testTreasuryFixed() {
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
      
      // Check for proper card layout (not full width)
      const panels = page.locator('.panel');
      const panelCount = await panels.count();
      console.log(`📊 Found ${panelCount} panels`);
      
      if (panelCount > 0) {
        // Check panel width - should not be full screen
        const firstPanel = panels.first();
        const panelBox = await firstPanel.boundingBox();
        const viewportWidth = page.viewportSize().width;
        
        if (panelBox && panelBox.width < viewportWidth * 0.8) {
          console.log('✅ Panels are properly sized (not full width)');
        } else {
          console.log('❌ Panels appear to be full width');
        }
      }
      
      // Check for scroll containers
      const scrollContainers = await page.locator('[style*="overflow-y: auto"], [style*="overflow: auto"]').count();
      console.log(`📜 Found ${scrollContainers} scroll containers`);
      
      // Check font sizes
      const metrics = page.locator('.metric');
      if (await metrics.count() > 0) {
        const fontSize = await metrics.first().evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });
        console.log(`📝 Metric font size: ${fontSize}`);
      }
      
      const metricValues = page.locator('.metric-value');
      if (await metricValues.count() > 0) {
        const valueFontSize = await metricValues.first().evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });
        console.log(`💰 Metric value font size: ${valueFontSize}`);
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/treasury_fixed.png', 
        fullPage: true 
      });
      
      console.log('✅ Treasury fixed design screenshot saved');
      
      // Test Revenue tab
      const revenueTab = page.locator('.base-screen-tab:has-text("Revenue")');
      if (await revenueTab.isVisible()) {
        await revenueTab.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot of Revenue tab
        await page.screenshot({ 
          path: 'tests/screenshots/treasury_revenue_fixed.png', 
          fullPage: true 
        });
        
        console.log('✅ Treasury revenue fixed screenshot saved');
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

testTreasuryFixed();

