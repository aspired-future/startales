import { chromium } from 'playwright';

async function testTreasuryCards() {
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
      
      // Check for Supreme Court style panels
      const panels = page.locator('.panel');
      const panelCount = await panels.count();
      console.log(`📊 Found ${panelCount} Supreme Court style panels`);
      
      // Check for metrics in panels
      const metrics = page.locator('.metric');
      const metricCount = await metrics.count();
      console.log(`📈 Found ${metricCount} metrics in panels`);
      
      // Check for action buttons
      const actionButtons = page.locator('.action-buttons .btn');
      const buttonCount = await actionButtons.count();
      console.log(`🔘 Found ${buttonCount} action buttons`);
      
      // Take screenshot of Treasury dashboard
      await page.screenshot({ 
        path: 'tests/screenshots/treasury_cards_dashboard.png', 
        fullPage: true 
      });
      
      console.log('✅ Treasury dashboard screenshot saved');
      
      // Test Revenue tab
      const revenueTab = page.locator('.base-screen-tab:has-text("Revenue")');
      if (await revenueTab.isVisible()) {
        await revenueTab.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot of Revenue tab
        await page.screenshot({ 
          path: 'tests/screenshots/treasury_cards_revenue.png', 
          fullPage: true 
        });
        
        console.log('✅ Treasury revenue tab screenshot saved');
        
        // Check for panels in revenue tab
        const revenuePanels = page.locator('.panel');
        const revenuePanelCount = await revenuePanels.count();
        console.log(`💰 Found ${revenuePanelCount} panels in Revenue tab`);
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

testTreasuryCards();

