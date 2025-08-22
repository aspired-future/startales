import { chromium } from 'playwright';

async function testGalaxyDataNavigationFix() {
  console.log('🌌 Testing Galaxy Data Navigation Fix...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Navigate to Galaxy Data
    console.log('\\n🌌 Opening Galaxy accordion...');
    await page.click('text=GALAXY');
    await page.waitForTimeout(1000);
    
    console.log('📊 Clicking Galaxy Data...');
    await page.click('text=🌌 Galaxy Data');
    await page.waitForTimeout(3000);
    
    // Check what's displayed
    const screenCheck = await page.evaluate(() => {
      // Check if it's the generic popup (bad)
      const genericPopup = document.querySelector('.panel-section');
      const underDevelopment = document.body.textContent && document.body.textContent.includes('under development');
      
      // Check if it's the proper Galaxy Data screen (good)
      const galaxyDataScreen = document.querySelector('.galaxy-data-screen');
      const tabNavigation = document.querySelector('.tab-navigation');
      const overviewTab = document.querySelector('.overview-tab');
      const statsGrid = document.querySelector('.stats-grid');
      
      // Get page content for debugging
      const pageText = document.body.textContent || '';
      
      return {
        genericPopup: !!genericPopup,
        underDevelopment: pageText.includes('under development'),
        galaxyDataScreen: !!galaxyDataScreen,
        tabNavigation: !!tabNavigation,
        overviewTab: !!overviewTab,
        statsGrid: !!statsGrid,
        pageTextPreview: pageText.substring(0, 300)
      };
    });
    
    console.log('\\n📊 Screen Check Results:');
    console.log('Generic popup (bad):', screenCheck.genericPopup);
    console.log('Under development (bad):', screenCheck.underDevelopment);
    console.log('Galaxy Data Screen (good):', screenCheck.galaxyDataScreen);
    console.log('Tab navigation (good):', screenCheck.tabNavigation);
    console.log('Overview tab (good):', screenCheck.overviewTab);
    console.log('Stats grid (good):', screenCheck.statsGrid);
    console.log('Page text preview:', screenCheck.pageTextPreview);
    
    if (screenCheck.galaxyDataScreen && screenCheck.tabNavigation) {
      console.log('\\n🎉 SUCCESS! Galaxy Data screen is now properly displayed!');
      
      // Test data loading
      const dataCheck = await page.evaluate(() => {
        const statCards = document.querySelectorAll('.stat-card');
        const statValues = Array.from(statCards).map(card => {
          const value = card.querySelector('.stat-value')?.textContent || '0';
          const label = card.querySelector('.stat-label')?.textContent || 'Unknown';
          return { label, value };
        });
        
        return {
          statCount: statCards.length,
          stats: statValues
        };
      });
      
      console.log('\\n📈 Data Check:');
      console.log('Stat cards found:', dataCheck.statCount);
      console.log('Stats:', dataCheck.stats);
      
      if (dataCheck.statCount > 0) {
        console.log('✅ Data is loading properly!');
      }
      
    } else if (screenCheck.underDevelopment) {
      console.log('\\n❌ Still showing under development message');
    } else {
      console.log('\\n❓ Unknown state - check screenshot');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_data_navigation_fix.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testGalaxyDataNavigationFix().catch(console.error);
