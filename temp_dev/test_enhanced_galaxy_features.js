import { chromium } from 'playwright';

async function testEnhancedGalaxyFeatures() {
  console.log('🌌 Testing Enhanced Galaxy Features...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Test Galaxy Map Enhanced Controls
    console.log('\n🗺️ Testing Galaxy Map Enhanced Controls...');
    
    // Open Galaxy accordion
    await page.click('text=GALAXY');
    await page.waitForTimeout(1000);
    
    // Click Galaxy Map
    await page.click('text=🗺️ Map');
    await page.waitForTimeout(3000);
    
    // Check if Enhanced Controls toggle exists
    const enhancedToggle = await page.locator('.enhanced-controls-toggle .toggle-btn').first();
    if (await enhancedToggle.isVisible()) {
      console.log('✅ Enhanced Controls toggle found');
      
      // Click to open enhanced controls
      await enhancedToggle.click();
      await page.waitForTimeout(2000);
      
      // Check for enhanced controls panel
      const enhancedPanel = await page.locator('.enhanced-controls-panel').first();
      if (await enhancedPanel.isVisible()) {
        console.log('✅ Enhanced Controls panel opened');
        
        // Check for simulation status
        const simStatus = await page.locator('.control-section h4:has-text("Simulation Status")').first();
        if (await simStatus.isVisible()) {
          console.log('✅ Simulation Status section found');
        }
        
        // Check for AI recommendations
        const aiRecs = await page.locator('.control-section h4:has-text("AI Recommendations")').first();
        if (await aiRecs.isVisible()) {
          console.log('✅ AI Recommendations section found');
        }
        
        // Check for performance analytics
        const perfAnalytics = await page.locator('.control-section h4:has-text("Performance Analytics")').first();
        if (await perfAnalytics.isVisible()) {
          console.log('✅ Performance Analytics section found');
        }
      } else {
        console.log('❌ Enhanced Controls panel not visible');
      }
    } else {
      console.log('❌ Enhanced Controls toggle not found');
    }
    
    // Close map popup
    const closeBtn = await page.locator('.popup-close').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Test Galaxy Data Enhanced Tab
    console.log('\n📊 Testing Galaxy Data Enhanced Tab...');
    
    // Click Galaxy Data
    await page.click('text=🌌 Galaxy Data');
    await page.waitForTimeout(3000);
    
    // Check if Enhanced tab exists
    const enhancedTab = await page.locator('.tab-button:has-text("Enhanced")').first();
    if (await enhancedTab.isVisible()) {
      console.log('✅ Enhanced tab found');
      
      // Click Enhanced tab
      await enhancedTab.click();
      await page.waitForTimeout(2000);
      
      // Check for enhanced content
      const enhancedContent = await page.locator('.enhanced-tab').first();
      if (await enhancedContent.isVisible()) {
        console.log('✅ Enhanced tab content loaded');
        
        // Check for simulation status cards
        const statusCards = await page.locator('.status-cards .status-card').count();
        console.log(`✅ Found ${statusCards} status cards`);
        
        // Check for recommendations grid
        const recCards = await page.locator('.recommendations-grid .recommendation-card').count();
        console.log(`✅ Found ${recCards} recommendation cards`);
        
        // Check for analytics dashboard
        const analyticsCategories = await page.locator('.analytics-dashboard .analytics-category').count();
        console.log(`✅ Found ${analyticsCategories} analytics categories`);
        
        // Check for trends summary
        const trendItems = await page.locator('.trends-grid .trend-item').count();
        console.log(`✅ Found ${trendItems} trend items`);
      } else {
        console.log('❌ Enhanced tab content not visible');
      }
    } else {
      console.log('❌ Enhanced tab not found');
    }
    
    // Test API endpoints
    console.log('\n🔌 Testing Enhanced API Endpoints...');
    
    // Test simulation status endpoint
    const simStatusResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/galaxy/simulation/status?campaignId=1&civilizationId=civilization_1');
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (simStatusResponse.ok) {
      console.log('✅ Simulation status API working');
    } else {
      console.log(`❌ Simulation status API failed: ${simStatusResponse.status || simStatusResponse.error}`);
    }
    
    // Test AI recommendations endpoint
    const aiRecsResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/galaxy/ai/recommendations?campaignId=1&civilizationId=civilization_1');
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (aiRecsResponse.ok) {
      console.log('✅ AI recommendations API working');
    } else {
      console.log(`❌ AI recommendations API failed: ${aiRecsResponse.status || aiRecsResponse.error}`);
    }
    
    // Test performance analytics endpoint
    const perfResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/galaxy/analytics/performance?campaignId=1&civilizationId=civilization_1');
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (perfResponse.ok) {
      console.log('✅ Performance analytics API working');
    } else {
      console.log(`❌ Performance analytics API failed: ${perfResponse.status || perfResponse.error}`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/enhanced_galaxy_features.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    console.log('\n🎉 Enhanced Galaxy Features Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testEnhancedGalaxyFeatures().catch(console.error);
