import { chromium } from 'playwright';

async function testGalaxyDataLoading() {
  console.log('🌌 Testing Galaxy Data Loading...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  // Listen for network requests
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('/api/galaxy')) {
      requests.push({
        url: request.url(),
        method: request.method()
      });
      console.log('🌐 API Request:', request.method(), request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/galaxy')) {
      console.log('📡 API Response:', response.status(), response.url());
    }
  });
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ BROWSER ERROR:', msg.text());
    } else if (msg.text().includes('galaxy') || msg.text().includes('Galaxy')) {
      console.log('🔍 BROWSER LOG:', msg.text());
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
    await page.waitForTimeout(5000); // Wait longer for data loading
    
    // Check what's displayed
    const screenState = await page.evaluate(() => {
      const galaxyDataScreen = document.querySelector('.galaxy-data-screen');
      if (!galaxyDataScreen) return { error: 'Galaxy Data Screen not found' };
      
      const loading = document.querySelector('.loading-container');
      const error = document.querySelector('.error-container');
      const tabNavigation = document.querySelector('.tab-navigation');
      const overviewTab = document.querySelector('.overview-tab');
      const statsGrid = document.querySelector('.stats-grid');
      
      // Get stats values
      const statCards = document.querySelectorAll('.stat-card .stat-value');
      const statValues = Array.from(statCards).map(card => card.textContent);
      
      // Get civilizations data
      const civCards = document.querySelectorAll('.civilization-card');
      const civilizations = Array.from(civCards).map(card => {
        const name = card.querySelector('h4')?.textContent || 'N/A';
        const species = card.querySelector('.detail-row span:nth-child(2)')?.textContent || 'N/A';
        return { name, species };
      });
      
      return {
        screenExists: !!galaxyDataScreen,
        loading: !!loading,
        error: !!error,
        errorText: error?.textContent || null,
        tabNavigation: !!tabNavigation,
        overviewTab: !!overviewTab,
        statsGrid: !!statsGrid,
        statValues: statValues,
        civilizationCount: civCards.length,
        civilizations: civilizations
      };
    });
    
    console.log('\\n📊 Galaxy Data Screen State:');
    console.log('Screen exists:', screenState.screenExists);
    console.log('Loading:', screenState.loading);
    console.log('Error:', screenState.error);
    if (screenState.errorText) {
      console.log('Error text:', screenState.errorText);
    }
    console.log('Tab navigation:', screenState.tabNavigation);
    console.log('Overview tab:', screenState.overviewTab);
    console.log('Stats grid:', screenState.statsGrid);
    console.log('Stat values:', screenState.statValues);
    console.log('Civilization count:', screenState.civilizationCount);
    console.log('Civilizations:', screenState.civilizations);
    
    // Test tab switching
    if (screenState.tabNavigation) {
      console.log('\\n🏛️ Testing Civilizations tab...');
      await page.click('text=🏛️ Civilizations');
      await page.waitForTimeout(2000);
      
      const civTabState = await page.evaluate(() => {
        const civTab = document.querySelector('.civilizations-tab');
        const civGrid = document.querySelector('.civilizations-grid');
        const civCards = document.querySelectorAll('.civilization-card');
        
        return {
          civTab: !!civTab,
          civGrid: !!civGrid,
          civCardCount: civCards.length
        };
      });
      
      console.log('Civilizations tab visible:', civTabState.civTab);
      console.log('Civilizations grid visible:', civTabState.civGrid);
      console.log('Civilization cards:', civTabState.civCardCount);
    }
    
    // Check API requests made
    console.log('\\n🌐 API Requests Summary:');
    console.log('Total galaxy API requests:', requests.length);
    requests.forEach(req => {
      console.log(`  ${req.method} ${req.url}`);
    });
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_data_loading_test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testGalaxyDataLoading().catch(console.error);
