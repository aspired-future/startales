const { chromium } = require('playwright');

async function testProfessionsScreenIntegration() {
  console.log('🚀 Testing Professions Screen Integration...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Navigate to the HUD
    console.log('📍 Navigating to HUD...');
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(3000);
    
    // Click on Population accordion
    console.log('🔍 Opening Population accordion...');
    await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
    await page.waitForTimeout(1000);
    
    // Click on Professions & Careers
    console.log('💼 Clicking on Professions & Careers...');
    await page.click('.nav-item:has-text("Professions")');
    await page.waitForTimeout(3000);
    
    // Check if Professions screen loaded
    const professionsScreen = await page.locator('.professions-screen').count();
    console.log(`✅ Professions screen found: ${professionsScreen > 0}`);
    
    // Check tabs
    const tabs = await page.locator('.view-tabs .tab').count();
    console.log(`📋 Number of tabs found: ${tabs}`);
    
    const tabTexts = await page.locator('.view-tabs .tab').allTextContents();
    console.log('📝 Tab names:', tabTexts);
    
    // Test Overview tab (default)
    console.log('📊 Testing Overview tab...');
    const overviewTab = await page.locator('.overview-tab').count();
    console.log(`✅ Overview tab content loaded: ${overviewTab > 0}`);
    
    const overviewMetrics = await page.locator('.overview-metrics .metric-card').count();
    console.log(`📈 Overview metrics found: ${overviewMetrics}`);
    
    const sectorCards = await page.locator('.sector-card').count();
    console.log(`🏭 Sector cards found: ${sectorCards}`);
    
    // Test Professions tab
    console.log('🔍 Testing Professions tab...');
    await page.click('.tab:has-text("Professions")');
    await page.waitForTimeout(2000);
    
    const professionsTab = await page.locator('.professions-tab').count();
    console.log(`✅ Professions tab content loaded: ${professionsTab > 0}`);
    
    const professionCards = await page.locator('.profession-card').count();
    console.log(`💼 Profession cards found: ${professionCards}`);
    
    // Test category filter
    const categorySelect = await page.locator('.category-select').count();
    console.log(`🔽 Category filter found: ${categorySelect > 0}`);
    
    // Test Unemployment tab
    console.log('📉 Testing Unemployment tab...');
    await page.click('.tab:has-text("Unemployment")');
    await page.waitForTimeout(2000);
    
    const unemploymentTab = await page.locator('.unemployment-tab').count();
    console.log(`✅ Unemployment tab content loaded: ${unemploymentTab > 0}`);
    
    const unemploymentMetrics = await page.locator('.unemployment-metrics .metric-card').count();
    console.log(`📊 Unemployment metrics found: ${unemploymentMetrics}`);
    
    const breakdownSections = await page.locator('.breakdown-section').count();
    console.log(`📋 Breakdown sections found: ${breakdownSections}`);
    
    // Test Careers tab
    console.log('🚀 Testing Careers tab...');
    await page.click('.tab:has-text("Careers")');
    await page.waitForTimeout(2000);
    
    const careersTab = await page.locator('.careers-tab').count();
    console.log(`✅ Careers tab content loaded: ${careersTab > 0}`);
    
    const scenarioCards = await page.locator('.scenario-card').count();
    console.log(`🎯 Career scenario cards found: ${scenarioCards}`);
    
    const recommendations = await page.locator('.recommendation-item').count();
    console.log(`💡 Career recommendations found: ${recommendations}`);
    
    // Test Analytics tab
    console.log('📈 Testing Analytics tab...');
    await page.click('.tab:has-text("Analytics")');
    await page.waitForTimeout(2000);
    
    const analyticsTab = await page.locator('.analytics-tab').count();
    console.log(`✅ Analytics tab content loaded: ${analyticsTab > 0}`);
    
    const skillCards = await page.locator('.skill-card').count();
    console.log(`🎯 Skills analysis cards found: ${skillCards}`);
    
    const trendItems = await page.locator('.trend-item').count();
    console.log(`📈 Market trend items found: ${trendItems}`);
    
    // Check for action buttons
    const actionButtons = await page.locator('.tab-actions .action-btn').count();
    console.log(`🎯 Action buttons found: ${actionButtons}`);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'temp_dev/professions_screen_test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as professions_screen_test.png');
    
    console.log('✅ Professions Screen Integration Test completed successfully!');
    console.log('🎯 Summary:');
    console.log(`   - Professions screen loaded: ${professionsScreen > 0}`);
    console.log(`   - Tabs available: ${tabs}`);
    console.log(`   - Overview metrics: ${overviewMetrics}`);
    console.log(`   - Sector cards: ${sectorCards}`);
    console.log(`   - Profession cards: ${professionCards}`);
    console.log(`   - Unemployment metrics: ${unemploymentMetrics}`);
    console.log(`   - Breakdown sections: ${breakdownSections}`);
    console.log(`   - Career scenarios: ${scenarioCards}`);
    console.log(`   - Career recommendations: ${recommendations}`);
    console.log(`   - Skills analysis cards: ${skillCards}`);
    console.log(`   - Market trend items: ${trendItems}`);
    console.log(`   - Action buttons: ${actionButtons}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testProfessionsScreenIntegration().catch(console.error);
