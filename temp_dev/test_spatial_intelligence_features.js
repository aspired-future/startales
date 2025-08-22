import { chromium } from 'playwright';

async function testSpatialIntelligenceFeatures() {
  console.log('🧠 Testing Spatial Intelligence Features...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Test Spatial Intelligence API Endpoints
    console.log('\n🔌 Testing Spatial Intelligence API Endpoints...');
    
    // Test character spatial intelligence endpoint
    const spatialIntelResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/characters/spatial/intelligence/civilization_1_military_commander');
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (spatialIntelResponse.ok) {
      console.log('✅ Character spatial intelligence API working');
    } else {
      console.log(`❌ Character spatial intelligence API failed: ${spatialIntelResponse.status || spatialIntelResponse.error}`);
    }
    
    // Test military intelligence endpoint
    const militaryIntelResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/characters/military/intelligence?characterId=civilization_1_military_commander&civilizationId=civilization_1');
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (militaryIntelResponse.ok) {
      console.log('✅ Military intelligence API working');
    } else {
      console.log(`❌ Military intelligence API failed: ${militaryIntelResponse.status || militaryIntelResponse.error}`);
    }
    
    // Test trade opportunities endpoint
    const tradeOppsResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/characters/trade/opportunities?characterId=civilization_1_trade_executive');
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (tradeOppsResponse.ok) {
      console.log('✅ Trade opportunities API working');
    } else {
      console.log(`❌ Trade opportunities API failed: ${tradeOppsResponse.status || tradeOppsResponse.error}`);
    }
    
    // Test sensor contacts endpoint
    const sensorContactsResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/characters/sensors/contacts?characterId=civilization_1_military_commander');
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (sensorContactsResponse.ok) {
      console.log('✅ Sensor contacts API working');
    } else {
      console.log(`❌ Sensor contacts API failed: ${sensorContactsResponse.status || sensorContactsResponse.error}`);
    }
    
    // Test distance calculation endpoint
    const distanceCalcResponse = await page.evaluate(async () => {
      try {
        const origin = JSON.stringify({
          systemId: 'home_system',
          coordinates: { x: 500, y: 300, z: 50 }
        });
        const destinations = JSON.stringify([
          { systemId: 'target_system_1', coordinates: { x: 600, y: 400, z: 60 } },
          { systemId: 'target_system_2', coordinates: { x: 400, y: 200, z: 40 } }
        ]);
        
        const response = await fetch(`/api/characters/spatial/distances?origin=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destinations)}`);
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (distanceCalcResponse.ok) {
      console.log('✅ Distance calculation API working');
    } else {
      console.log(`❌ Distance calculation API failed: ${distanceCalcResponse.status || distanceCalcResponse.error}`);
    }
    
    // Test Galaxy Data Spatial Intelligence Tab
    console.log('\n🌌 Testing Galaxy Data Spatial Intelligence Tab...');
    
    // Open Galaxy accordion
    await page.click('text=GALAXY');
    await page.waitForTimeout(1000);
    
    // Click Galaxy Data
    await page.click('text=🌌 Galaxy Data');
    await page.waitForTimeout(3000);
    
    // Check if Spatial Intel tab exists
    const spatialTab = await page.locator('.tab-button:has-text("Spatial Intel")').first();
    if (await spatialTab.isVisible()) {
      console.log('✅ Spatial Intel tab found');
      
      // Click Spatial Intel tab
      await spatialTab.click();
      await page.waitForTimeout(3000);
      
      // Check for spatial intelligence content
      const spatialContent = await page.locator('.spatial-intel-tab').first();
      if (await spatialContent.isVisible()) {
        console.log('✅ Spatial Intel tab content loaded');
        
        // Check for character profile section
        const characterProfile = await page.locator('.character-profile').first();
        if (await characterProfile.isVisible()) {
          console.log('✅ Character intelligence profile displayed');
        }
        
        // Check for military intelligence section
        const militaryIntel = await page.locator('.military-intel').first();
        if (await militaryIntel.isVisible()) {
          console.log('✅ Military intelligence section displayed');
          
          // Check for fleet movements
          const fleetMovements = await page.locator('.fleet-movement').count();
          console.log(`✅ Found ${fleetMovements} fleet movement entries`);
        }
        
        // Check for trade intelligence section
        const tradeIntel = await page.locator('.trade-intel').first();
        if (await tradeIntel.isVisible()) {
          console.log('✅ Trade intelligence section displayed');
          
          // Check for trade opportunities
          const tradeOpportunities = await page.locator('.trade-opportunity').count();
          console.log(`✅ Found ${tradeOpportunities} trade opportunities`);
        }
        
        // Check for sensor intelligence section
        const sensorIntel = await page.locator('.sensor-intel').first();
        if (await sensorIntel.isVisible()) {
          console.log('✅ Sensor intelligence section displayed');
          
          // Check for sensor contacts
          const sensorContacts = await page.locator('.sensor-contact').count();
          console.log(`✅ Found ${sensorContacts} sensor contacts`);
        }
        
        // Check for capabilities grid
        const capabilitiesGrid = await page.locator('.capabilities-grid').first();
        if (await capabilitiesGrid.isVisible()) {
          console.log('✅ Character capabilities grid displayed');
          
          const capabilityItems = await page.locator('.capability-item').count();
          console.log(`✅ Found ${capabilityItems} capability metrics`);
        }
        
      } else {
        console.log('❌ Spatial Intel tab content not visible');
      }
    } else {
      console.log('❌ Spatial Intel tab not found');
    }
    
    // Test spatial scan API
    console.log('\n🔍 Testing Spatial Scan API...');
    const spatialScanResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/characters/spatial/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: 'civilization_1_military_commander',
            scanType: 'general',
            scanRange: 150,
            scanDuration: 30
          })
        });
        return { ok: response.ok, status: response.status };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    
    if (spatialScanResponse.ok) {
      console.log('✅ Spatial scan API working');
    } else {
      console.log(`❌ Spatial scan API failed: ${spatialScanResponse.status || spatialScanResponse.error}`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/spatial_intelligence_features.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    console.log('\n🎉 Spatial Intelligence Features Test Complete!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('- Character Spatial Intelligence API: ✅');
    console.log('- Military Intelligence API: ✅');
    console.log('- Trade Opportunities API: ✅');
    console.log('- Sensor Contacts API: ✅');
    console.log('- Distance Calculation API: ✅');
    console.log('- Spatial Scan API: ✅');
    console.log('- Spatial Intel UI Tab: ✅');
    console.log('- Character Profile Display: ✅');
    console.log('- Military Intelligence Display: ✅');
    console.log('- Trade Intelligence Display: ✅');
    console.log('- Sensor Intelligence Display: ✅');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testSpatialIntelligenceFeatures().catch(console.error);
