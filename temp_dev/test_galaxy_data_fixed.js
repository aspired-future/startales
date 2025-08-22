import { chromium } from 'playwright';

async function testGalaxyDataFixed() {
  console.log('🌌 Testing Galaxy Data Screen (Fixed)...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  // Listen for console messages
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
    
    console.log('📊 Clicking Galaxy Data...');
    await page.click('text=🌌 Galaxy Data');
    await page.waitForTimeout(5000); // Wait for data loading
    
    // Check if data is displayed
    const dataCheck = await page.evaluate(() => {
      const galaxyDataScreen = document.querySelector('.galaxy-data-screen');
      if (!galaxyDataScreen) return { error: 'Galaxy Data Screen not found' };
      
      // Check loading state
      const loading = document.querySelector('.loading-container');
      if (loading && loading.offsetParent !== null) {
        return { status: 'loading' };
      }
      
      // Check error state
      const errorContainer = document.querySelector('.error-container');
      if (errorContainer && errorContainer.offsetParent !== null) {
        return { 
          status: 'error', 
          errorText: errorContainer.textContent 
        };
      }
      
      // Check overview tab data
      const overviewTab = document.querySelector('.overview-tab');
      const statsGrid = document.querySelector('.stats-grid');
      const statCards = document.querySelectorAll('.stat-card');
      const statValues = Array.from(statCards).map(card => {
        const value = card.querySelector('.stat-value')?.textContent || '0';
        const label = card.querySelector('.stat-label')?.textContent || 'Unknown';
        return { label, value };
      });
      
      // Check civilizations data
      const civCards = document.querySelectorAll('.civilization-card');
      const civilizations = Array.from(civCards).map(card => {
        const name = card.querySelector('h4')?.textContent || 'Unknown';
        const status = card.querySelector('.diplomatic-status')?.textContent || 'Unknown';
        return { name, status };
      });
      
      return {
        status: 'loaded',
        overviewVisible: !!overviewTab,
        statsVisible: !!statsGrid,
        statCount: statCards.length,
        stats: statValues,
        civilizationCount: civCards.length,
        civilizations: civilizations
      };
    });
    
    console.log('\\n📊 Galaxy Data Status:', dataCheck.status);
    
    if (dataCheck.status === 'loading') {
      console.log('⏳ Still loading, waiting longer...');
      await page.waitForTimeout(3000);
      // Re-check after waiting
      const recheckData = await page.evaluate(() => {
        const loading = document.querySelector('.loading-container');
        return { stillLoading: loading && loading.offsetParent !== null };
      });
      console.log('Still loading after wait:', recheckData.stillLoading);
      
    } else if (dataCheck.status === 'error') {
      console.log('❌ Error state:', dataCheck.errorText);
      
    } else if (dataCheck.status === 'loaded') {
      console.log('✅ Data loaded successfully!');
      console.log('Overview visible:', dataCheck.overviewVisible);
      console.log('Stats visible:', dataCheck.statsVisible);
      console.log('Stat count:', dataCheck.statCount);
      console.log('Stats:', dataCheck.stats);
      console.log('Civilization count:', dataCheck.civilizationCount);
      console.log('Civilizations:', dataCheck.civilizations);
      
      // Test tab switching
      console.log('\\n🏛️ Testing Civilizations tab...');
      await page.click('text=🏛️ Civilizations');
      await page.waitForTimeout(2000);
      
      const civTabCheck = await page.evaluate(() => {
        const civTab = document.querySelector('.civilizations-tab');
        const civGrid = document.querySelector('.civilizations-grid');
        const civCards = document.querySelectorAll('.civilization-card');
        
        return {
          tabVisible: !!civTab,
          gridVisible: !!civGrid,
          cardCount: civCards.length
        };
      });
      
      console.log('Civilizations tab visible:', civTabCheck.tabVisible);
      console.log('Civilizations grid visible:', civTabCheck.gridVisible);
      console.log('Civilization cards:', civTabCheck.cardCount);
      
      // Test comparison tab
      console.log('\\n📊 Testing Comparison tab...');
      await page.click('text=📊 Comparison');
      await page.waitForTimeout(2000);
      
      const comparisonCheck = await page.evaluate(() => {
        const comparisonTab = document.querySelector('.comparison-tab');
        const comparisonTable = document.querySelector('.comparison-table');
        const tableRows = document.querySelectorAll('.comparison-table tbody tr');
        
        return {
          tabVisible: !!comparisonTab,
          tableVisible: !!comparisonTable,
          rowCount: tableRows.length
        };
      });
      
      console.log('Comparison tab visible:', comparisonCheck.tabVisible);
      console.log('Comparison table visible:', comparisonCheck.tableVisible);
      console.log('Table rows:', comparisonCheck.rowCount);
      
      if (comparisonCheck.tableVisible && comparisonCheck.rowCount > 0) {
        console.log('🎉 SUCCESS! Galaxy Data screen is fully functional!');
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_data_fixed_test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testGalaxyDataFixed().catch(console.error);
