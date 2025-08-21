const { chromium } = require('playwright');

async function testBusinessScreenIntegration() {
  console.log('🚀 Testing Business Screen Integration...');
  
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
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Click on Economy accordion
    console.log('🔍 Opening Economy accordion...');
    await page.click('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
    await page.waitForTimeout(1000);
    
    // Click on Business Management
    console.log('🏢 Clicking on Business Management...');
    await page.click('.nav-item:has-text("Business")');
    await page.waitForTimeout(3000);
    
    // Check if Business screen loaded
    const businessScreen = await page.locator('.business-screen').count();
    console.log(`✅ Business screen found: ${businessScreen > 0}`);
    
    // Check tabs
    const tabs = await page.locator('.view-tabs .tab').count();
    console.log(`📋 Number of tabs found: ${tabs}`);
    
    const tabTexts = await page.locator('.view-tabs .tab').allTextContents();
    console.log('📝 Tab names:', tabTexts);
    
    // Test Small Business tab
    console.log('🏪 Testing Small Business tab...');
    await page.click('.tab:has-text("Small Business")');
    await page.waitForTimeout(2000);
    
    const smallBusinessTab = await page.locator('.small-business-tab').count();
    console.log(`✅ Small Business tab content loaded: ${smallBusinessTab > 0}`);
    
    // Check for small business programs
    const programs = await page.locator('.program-card').count();
    console.log(`🎯 Small business programs found: ${programs}`);
    
    // Test Corporate tab
    console.log('🏢 Testing Corporate tab...');
    await page.click('.tab:has-text("Corporate")');
    await page.waitForTimeout(2000);
    
    const corporateTab = await page.locator('.corporate-tab').count();
    console.log(`✅ Corporate tab content loaded: ${corporateTab > 0}`);
    
    // Check for governance panels
    const governancePanels = await page.locator('.governance-panel').count();
    console.log(`⚖️ Corporate governance panels found: ${governancePanels}`);
    
    // Test Opportunities tab
    console.log('💡 Testing Opportunities tab...');
    await page.click('.tab:has-text("Opportunities")');
    await page.waitForTimeout(2000);
    
    const opportunitiesTab = await page.locator('.opportunities-tab').count();
    console.log(`✅ Opportunities tab content loaded: ${opportunitiesTab > 0}`);
    
    const opportunities = await page.locator('.opportunity-card').count();
    console.log(`💡 Business opportunities found: ${opportunities}`);
    
    // Test Creation tab
    console.log('🚀 Testing Creation tab...');
    await page.click('.tab:has-text("Creation")');
    await page.waitForTimeout(2000);
    
    const creationTab = await page.locator('.creation-tab').count();
    console.log(`✅ Creation tab content loaded: ${creationTab > 0}`);
    
    const wizardSteps = await page.locator('.wizard-steps .step-item').count();
    console.log(`🧙 Creation wizard steps found: ${wizardSteps}`);
    
    // Test Analytics tab
    console.log('📈 Testing Analytics tab...');
    await page.click('.tab:has-text("Analytics")');
    await page.waitForTimeout(2000);
    
    const analyticsTab = await page.locator('.analytics-tab').count();
    console.log(`✅ Analytics tab content loaded: ${analyticsTab > 0}`);
    
    const analyticsSections = await page.locator('.analytics-section').count();
    console.log(`📊 Analytics sections found: ${analyticsSections}`);
    
    // Test Overview tab (back to start)
    console.log('📊 Testing Overview tab...');
    await page.click('.tab:has-text("Overview")');
    await page.waitForTimeout(2000);
    
    const overviewTab = await page.locator('.overview-tab').count();
    console.log(`✅ Overview tab content loaded: ${overviewTab > 0}`);
    
    const overviewMetrics = await page.locator('.overview-metrics .metric-card').count();
    console.log(`📈 Overview metrics found: ${overviewMetrics}`);
    
    const industryCards = await page.locator('.industry-card').count();
    console.log(`🏭 Industry breakdown cards found: ${industryCards}`);
    
    // Check for action buttons
    const actionButtons = await page.locator('.tab-actions .action-btn').count();
    console.log(`🎯 Action buttons found: ${actionButtons}`);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'temp_dev/business_screen_test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as business_screen_test.png');
    
    console.log('✅ Business Screen Integration Test completed successfully!');
    console.log('🎯 Summary:');
    console.log(`   - Business screen loaded: ${businessScreen > 0}`);
    console.log(`   - Tabs available: ${tabs}`);
    console.log(`   - Small business programs: ${programs}`);
    console.log(`   - Corporate governance panels: ${governancePanels}`);
    console.log(`   - Business opportunities: ${opportunities}`);
    console.log(`   - Creation wizard steps: ${wizardSteps}`);
    console.log(`   - Analytics sections: ${analyticsSections}`);
    console.log(`   - Overview metrics: ${overviewMetrics}`);
    console.log(`   - Industry cards: ${industryCards}`);
    console.log(`   - Action buttons: ${actionButtons}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testBusinessScreenIntegration().catch(console.error);
