const { chromium } = require('playwright');

async function testMigrationScreenIntegration() {
  console.log('🚀 Testing Migration Screen Integration...');
  
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
    
    // Click on Population accordion
    console.log('🔍 Opening Population accordion...');
    await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
    await page.waitForTimeout(1000);
    
    // Click on Migration Management
    console.log('🚶 Clicking on Migration Management...');
    await page.click('.nav-item:has-text("Migration")');
    await page.waitForTimeout(2000);
    
    // Check if Migration screen loaded
    const migrationScreen = await page.locator('.migration-screen').count();
    console.log(`✅ Migration screen found: ${migrationScreen > 0}`);
    
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
    
    // Test Flows tab
    console.log('🌊 Testing Flows tab...');
    await page.click('.tab:has-text("Flows")');
    await page.waitForTimeout(1000);
    
    const flowsContent = await page.locator('.flows-tab').count();
    console.log(`✅ Flows tab content loaded: ${flowsContent > 0}`);
    
    if (flowsContent > 0) {
      const flowCards = await page.locator('.flows-grid .flow-card').count();
      console.log(`🌊 Flow cards found: ${flowCards}`);
      
      const flowControls = await page.locator('.flow-controls select').count();
      console.log(`🎛️ Flow controls found: ${flowControls}`);
    }
    
    // Test Policies tab
    console.log('📋 Testing Policies tab...');
    await page.click('.tab:has-text("Policies")');
    await page.waitForTimeout(1000);
    
    const policiesContent = await page.locator('.policies-tab').count();
    console.log(`✅ Policies tab content loaded: ${policiesContent > 0}`);
    
    if (policiesContent > 0) {
      const policyCards = await page.locator('.policies-grid .policy-card').count();
      console.log(`📋 Policy cards found: ${policyCards}`);
      
      const progressBars = await page.locator('.policy-progress .progress-bar').count();
      console.log(`📊 Progress bars found: ${progressBars}`);
    }
    
    // Test Integration tab
    console.log('🤝 Testing Integration tab...');
    await page.click('.tab:has-text("Integration")');
    await page.waitForTimeout(1000);
    
    const integrationContent = await page.locator('.integration-tab').count();
    console.log(`✅ Integration tab content loaded: ${integrationContent > 0}`);
    
    if (integrationContent > 0) {
      const integrationCards = await page.locator('.integration-grid .integration-card').count();
      console.log(`🤝 Integration cards found: ${integrationCards}`);
      
      const programTags = await page.locator('.program-tags .program-tag').count();
      console.log(`🏷️ Program tags found: ${programTags}`);
    }
    
    // Test Analytics tab
    console.log('📈 Testing Analytics tab...');
    await page.click('.tab:has-text("Analytics")');
    await page.waitForTimeout(1000);
    
    const analyticsContent = await page.locator('.analytics-tab').count();
    console.log(`✅ Analytics tab content loaded: ${analyticsContent > 0}`);
    
    if (analyticsContent > 0) {
      const analyticsCards = await page.locator('.analytics-grid .analytics-card').count();
      console.log(`📊 Analytics cards found: ${analyticsCards}`);
      
      const challengeCards = await page.locator('.analytics-card.challenge').count();
      console.log(`⚠️ Challenge cards found: ${challengeCards}`);
    }
    
    // Test Simulation tab
    console.log('🎯 Testing Simulation tab...');
    await page.click('.tab:has-text("Simulation")');
    await page.waitForTimeout(1000);
    
    const simulationContent = await page.locator('.simulation-tab').count();
    console.log(`✅ Simulation tab content loaded: ${simulationContent > 0}`);
    
    if (simulationContent > 0) {
      const simulationCards = await page.locator('.simulations-grid .simulation-card').count();
      console.log(`🎯 Simulation cards found: ${simulationCards}`);
      
      const projectionItems = await page.locator('.projection-grid .projection-item').count();
      console.log(`📊 Projection items found: ${projectionItems}`);
    }
    
    // Test action buttons
    const actionButtons = await page.locator('.action-btn').count();
    console.log(`🎯 Action buttons found: ${actionButtons}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'temp_dev/migration_screen_test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as migration_screen_test.png');
    
    console.log('✅ Migration Screen Integration Test completed successfully!');
    
    // Summary
    console.log('🎯 Summary:');
    console.log(`   - Migration screen loaded: ${migrationScreen > 0}`);
    console.log(`   - Tabs available: ${tabs}`);
    console.log(`   - Overview metrics: ${overviewMetrics || 0}`);
    console.log(`   - Flow cards: ${flowCards || 0}`);
    console.log(`   - Policy cards: ${policyCards || 0}`);
    console.log(`   - Integration cards: ${integrationCards || 0}`);
    console.log(`   - Analytics cards: ${analyticsCards || 0}`);
    console.log(`   - Simulation cards: ${simulationCards || 0}`);
    console.log(`   - Action buttons: ${actionButtons}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testMigrationScreenIntegration().catch(console.error);
