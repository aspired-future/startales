import { chromium } from 'playwright';

async function testGalaxyData() {
  console.log('🌌 Testing Galaxy Data Screen...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  // Listen for console messages and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ BROWSER ERROR:', msg.text());
    }
  });
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Navigate to Galaxy Data
    console.log('\\n🌌 Opening Galaxy accordion...');
    await page.click('text=GALAXY');
    await page.waitForTimeout(1000);
    
    // Look for Galaxy Data option
    const galaxyDataVisible = await page.locator('text=🌌 Galaxy Data').isVisible().catch(() => false);
    console.log('Galaxy Data button visible:', galaxyDataVisible);
    
    if (galaxyDataVisible) {
      console.log('\\n📊 Clicking Galaxy Data...');
      await page.click('text=🌌 Galaxy Data');
      await page.waitForTimeout(3000);
      
      // Check what content is actually displayed
      const underDevelopment = await page.locator('text=under development').isVisible().catch(() => false);
      console.log('Shows "under development":', underDevelopment);
      
      const galaxyDataScreen = await page.locator('.galaxy-data-screen').isVisible().catch(() => false);
      console.log('Galaxy Data Screen component visible:', galaxyDataScreen);
      
      const tabNavigation = await page.locator('.tab-navigation').isVisible().catch(() => false);
      console.log('Tab navigation visible:', tabNavigation);
      
      const overviewTab = await page.locator('text=🌌 Galaxy Overview').isVisible().catch(() => false);
      console.log('Overview tab visible:', overviewTab);
      
      if (galaxyDataScreen) {
        console.log('\\n✅ Galaxy Data Screen is working!');
        
        // Test tab switching
        const civilizationsTab = await page.locator('text=🏛️ Civilizations').isVisible().catch(() => false);
        if (civilizationsTab) {
          await page.click('text=🏛️ Civilizations');
          await page.waitForTimeout(1000);
          
          const civGrid = await page.locator('.civilizations-grid').isVisible().catch(() => false);
          console.log('Civilizations grid visible:', civGrid);
        }
        
        // Test comparison tab
        const comparisonTab = await page.locator('text=📊 Comparison').isVisible().catch(() => false);
        if (comparisonTab) {
          await page.click('text=📊 Comparison');
          await page.waitForTimeout(1000);
          
          const comparisonTable = await page.locator('.comparison-table').isVisible().catch(() => false);
          console.log('Comparison table visible:', comparisonTable);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/galaxy_data_working.png', fullPage: true });
        console.log('📸 Screenshot saved');
        
      } else if (underDevelopment) {
        console.log('\\n❌ Still showing under development message');
        
        // Take screenshot of the issue
        await page.screenshot({ path: 'temp_dev/galaxy_data_under_dev.png', fullPage: true });
        
        // Check what component is actually being rendered
        const pageContent = await page.content();
        console.log('\\nPage contains:');
        console.log('- PlaceholderScreen:', pageContent.includes('PlaceholderScreen'));
        console.log('- GalaxyDataScreen:', pageContent.includes('galaxy-data-screen'));
        console.log('- Under development text:', pageContent.includes('under development'));
      }
    } else {
      console.log('❌ Galaxy Data button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'temp_dev/galaxy_data_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testGalaxyData().catch(console.error);
