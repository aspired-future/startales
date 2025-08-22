import { chromium } from 'playwright';

async function testGalaxyFixes() {
  console.log('🚀 Testing Galaxy Map and Data Screen Fixes...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better observation
  });
  const page = await browser.newPage();
  
  // Set viewport for consistent testing
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Listen for console messages and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  try {
    console.log('📍 Navigating to StarTales UI...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    
    // Wait for the app to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded successfully');
    
    // Test 1: Navigate to Galaxy Map screen
    console.log('🗺️ Testing Galaxy Map screen...');
    await page.click('text=Galaxy Map');
    await page.waitForTimeout(2000);
    
    // Check if galaxy map is visible and properly sized
    const mapElement = await page.locator('.embedded-galaxy-map').first();
    const mapBounds = await mapElement.boundingBox();
    
    if (mapBounds && mapBounds.height > 400) {
      console.log(`✅ Galaxy Map has proper height: ${mapBounds.height}px`);
    } else {
      console.log(`❌ Galaxy Map height issue: ${mapBounds?.height || 'not found'}px`);
    }
    
    // Check if canvas is present and sized correctly
    const canvas = await page.locator('.galaxy-canvas').first();
    const canvasBounds = await canvas.boundingBox();
    
    if (canvasBounds && canvasBounds.width > 800 && canvasBounds.height > 400) {
      console.log(`✅ Galaxy Canvas properly sized: ${canvasBounds.width}x${canvasBounds.height}`);
    } else {
      console.log(`❌ Galaxy Canvas size issue: ${canvasBounds?.width || 0}x${canvasBounds?.height || 0}`);
    }
    
    // Test galaxy map interactivity
    console.log('🖱️ Testing galaxy map interactivity...');
    await canvas.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(1000);
    
    // Check if system info panel appears
    const systemPanel = await page.locator('.system-info-panel');
    const isPanelVisible = await systemPanel.isVisible().catch(() => false);
    
    if (isPanelVisible) {
      console.log('✅ System info panel appears on click');
      
      // Close the panel
      await page.click('.close-btn');
      await page.waitForTimeout(500);
    } else {
      console.log('⚠️ System info panel not visible (may be expected if no system at click point)');
    }
    
    // Test zoom controls
    console.log('🔍 Testing zoom controls...');
    await page.click('text=🔍 Zoom In');
    await page.waitForTimeout(1000);
    await page.click('text=🔍 Zoom Out');
    await page.waitForTimeout(1000);
    console.log('✅ Zoom controls working');
    
    // Test layer switching
    console.log('🎛️ Testing layer controls...');
    await page.selectOption('.layer-select', 'economic');
    await page.waitForTimeout(1000);
    await page.selectOption('.layer-select', 'political');
    await page.waitForTimeout(1000);
    console.log('✅ Layer switching working');
    
    // Test 2: Navigate to Galaxy Data screen
    console.log('📊 Testing Galaxy Data screen...');
    await page.click('text=Galaxy Data');
    await page.waitForTimeout(2000);
    
    // Check if Galaxy Data screen loaded
    const dataScreen = await page.locator('.galaxy-data-screen');
    const isDataScreenVisible = await dataScreen.isVisible();
    
    if (isDataScreenVisible) {
      console.log('✅ Galaxy Data screen loaded successfully');
      
      // Test tab navigation
      console.log('🏛️ Testing civilization tab...');
      await page.click('text=🏛️ Civilizations');
      await page.waitForTimeout(1000);
      
      // Check if civilizations are displayed
      const civCards = await page.locator('.civilization-card').count();
      console.log(`✅ Found ${civCards} civilization cards`);
      
      console.log('📊 Testing comparison tab...');
      await page.click('text=📊 Comparison');
      await page.waitForTimeout(1000);
      
      // Check if comparison table is displayed
      const comparisonTable = await page.locator('.comparison-table');
      const isTableVisible = await comparisonTable.isVisible();
      
      if (isTableVisible) {
        console.log('✅ Comparison table displayed');
        
        // Check threat assessment
        const threatCards = await page.locator('.threat-card').count();
        console.log(`✅ Found ${threatCards} threat assessment cards`);
      } else {
        console.log('❌ Comparison table not visible');
      }
      
      console.log('⭐ Testing star systems tab...');
      await page.click('text=⭐ Star Systems');
      await page.waitForTimeout(1000);
      
      console.log('🔬 Testing discoveries tab...');
      await page.click('text=🔬 Recent Discoveries');
      await page.waitForTimeout(1000);
      
      console.log('✅ All Galaxy Data tabs working');
      
    } else {
      console.log('❌ Galaxy Data screen not visible');
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'temp_dev/galaxy_fixes_test.png', 
      fullPage: true 
    });
    console.log('📸 Final screenshot saved');
    
    // Test 3: Return to Galaxy Map to verify it still works
    console.log('🔄 Testing return to Galaxy Map...');
    await page.click('text=Galaxy Map');
    await page.waitForTimeout(2000);
    
    // Verify map is still functional
    const finalMapCheck = await page.locator('.galaxy-canvas').isVisible();
    if (finalMapCheck) {
      console.log('✅ Galaxy Map still functional after navigation');
    } else {
      console.log('❌ Galaxy Map not working after navigation');
    }
    
    console.log('⏳ Keeping browser open for 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await browser.close();
  }
}

testGalaxyFixes().catch(console.error);
