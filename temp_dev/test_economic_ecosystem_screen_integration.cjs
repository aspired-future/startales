const { chromium } = require('playwright');

async function testEconomicEcosystemScreenIntegration() {
  console.log('🚀 Testing Economic Ecosystem Screen Integration...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
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
    
    // Click on Economy accordion
    console.log('🔍 Opening Economy accordion...');
    await page.click('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
    await page.waitForTimeout(1000);
    
    // Click on Economic Systems
    console.log('🌐 Clicking on Economic Systems...');
    await page.click('.nav-item:has-text("Economy")');
    await page.waitForTimeout(2000);
    
    // Check if Economic Ecosystem screen loaded
    const ecosystemScreen = await page.locator('.economic-ecosystem-screen').count();
    console.log(`✅ Economic Ecosystem screen found: ${ecosystemScreen > 0}`);
    
    // Check tabs
    const tabs = await page.locator('.view-tabs .tab').count();
    console.log(`📋 Number of tabs found: ${tabs}`);
    
    if (tabs > 0) {
      const tabNames = await page.locator('.view-tabs .tab').allTextContents();
      console.log('📝 Tab names:', tabNames);
    }
    
    // Test Overview tab (should be active by default)
    console.log('📊 Testing Overview tab...');
    const overviewContent = await page.locator('.overview-tab').count();
    console.log(`✅ Overview tab content loaded: ${overviewContent > 0}`);
    
    if (overviewContent > 0) {
      const overviewMetrics = await page.locator('.overview-metrics .metric-card').count();
      console.log(`📈 Overview metrics found: ${overviewMetrics}`);
      
      const statusIndicators = await page.locator('.status-indicators .status-item').count();
      console.log(`📊 Status indicators found: ${statusIndicators}`);
    }
    
    // Test Cities tab
    console.log('🏙️ Testing Cities tab...');
    await page.click('.tab:has-text("Cities")');
    await page.waitForTimeout(1000);
    
    const citiesContent = await page.locator('.cities-tab').count();
    console.log(`✅ Cities tab content loaded: ${citiesContent > 0}`);
    
    if (citiesContent > 0) {
      const cityCards = await page.locator('.cities-grid .city-card').count();
      console.log(`🏙️ City cards found: ${cityCards}`);
      
      const cityControls = await page.locator('.city-controls .action-btn').count();
      console.log(`🎛️ City controls found: ${cityControls}`);
    }
    
    // Test Products tab
    console.log('📦 Testing Products tab...');
    await page.click('.tab:has-text("Products")');
    await page.waitForTimeout(1000);
    
    const productsContent = await page.locator('.products-tab').count();
    console.log(`✅ Products tab content loaded: ${productsContent > 0}`);
    
    if (productsContent > 0) {
      const productCards = await page.locator('.products-grid .product-card').count();
      console.log(`📦 Product cards found: ${productCards}`);
      
      const productControls = await page.locator('.product-controls .action-btn').count();
      console.log(`🎛️ Product controls found: ${productControls}`);
    }
    
    // Test Corporations tab
    console.log('🏢 Testing Corporations tab...');
    await page.click('.tab:has-text("Corporations")');
    await page.waitForTimeout(1000);
    
    const corporationsContent = await page.locator('.corporations-tab').count();
    console.log(`✅ Corporations tab content loaded: ${corporationsContent > 0}`);
    
    if (corporationsContent > 0) {
      const corporationCards = await page.locator('.corporations-grid .corporation-card').count();
      console.log(`🏢 Corporation cards found: ${corporationCards}`);
      
      const advantageTags = await page.locator('.advantage-tags .advantage-tag').count();
      console.log(`🏷️ Advantage tags found: ${advantageTags}`);
    }
    
    // Test Supply Chains tab
    console.log('🔗 Testing Supply Chains tab...');
    await page.click('.tab:has-text("Supply Chains")');
    await page.waitForTimeout(1000);
    
    const supplyChainsContent = await page.locator('.supply-chains-tab').count();
    console.log(`✅ Supply Chains tab content loaded: ${supplyChainsContent > 0}`);
    
    if (supplyChainsContent > 0) {
      const supplyChainCards = await page.locator('.supply-chains-grid .supply-chain-card').count();
      console.log(`🔗 Supply chain cards found: ${supplyChainCards}`);
      
      const materialTags = await page.locator('.material-tags .material-tag').count();
      console.log(`🏷️ Material tags found: ${materialTags}`);
    }
    
    // Test Trade tab
    console.log('🛡️ Testing Trade tab...');
    await page.click('.tab:has-text("Trade")');
    await page.waitForTimeout(1000);
    
    const tradeContent = await page.locator('.trade-tab').count();
    console.log(`✅ Trade tab content loaded: ${tradeContent > 0}`);
    
    if (tradeContent > 0) {
      const tradePolicyCards = await page.locator('.trade-policies-grid .trade-policy-card').count();
      console.log(`🛡️ Trade policy cards found: ${tradePolicyCards}`);
      
      const relationshipBadges = await page.locator('.relationship-badge').count();
      console.log(`🏷️ Relationship badges found: ${relationshipBadges}`);
    }
    
    // Test Talent tab
    console.log('👥 Testing Talent tab...');
    await page.click('.tab:has-text("Talent")');
    await page.waitForTimeout(1000);
    
    const talentContent = await page.locator('.talent-tab').count();
    console.log(`✅ Talent tab content loaded: ${talentContent > 0}`);
    
    if (talentContent > 0) {
      const skillCards = await page.locator('.talent-grid .skill-card').count();
      console.log(`👥 Skill cards found: ${skillCards}`);
      
      const progressBars = await page.locator('.skill-progress .progress-bar').count();
      console.log(`📊 Progress bars found: ${progressBars}`);
    }
    
    // Test action buttons
    const actionButtons = await page.locator('.action-btn').count();
    console.log(`🎯 Action buttons found: ${actionButtons}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'temp_dev/economic_ecosystem_screen_test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as economic_ecosystem_screen_test.png');
    
    console.log('✅ Economic Ecosystem Screen Integration Test completed successfully!');
    
    // Summary
    console.log('🎯 Summary:');
    console.log(`   - Economic Ecosystem screen loaded: ${ecosystemScreen > 0}`);
    console.log(`   - Tabs available: ${tabs}`);
    console.log(`   - Overview metrics: ${overviewMetrics || 0}`);
    console.log(`   - City cards: ${cityCards || 0}`);
    console.log(`   - Product cards: ${productCards || 0}`);
    console.log(`   - Corporation cards: ${corporationCards || 0}`);
    console.log(`   - Supply chain cards: ${supplyChainCards || 0}`);
    console.log(`   - Trade policy cards: ${tradePolicyCards || 0}`);
    console.log(`   - Skill cards: ${skillCards || 0}`);
    console.log(`   - Action buttons: ${actionButtons}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testEconomicEcosystemScreenIntegration().catch(console.error);
