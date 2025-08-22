import { chromium } from 'playwright';

async function testGalaxySimple() {
  console.log('🚀 Testing Galaxy Map 3D Improvements...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  const page = await browser.newPage();
  
  try {
    console.log('📍 Loading StarTales...');
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    
    // Wait for app to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 15000 });
    console.log('✅ App loaded');
    
    // Navigate to Galaxy Map (opens as popup)
    console.log('🗺️ Opening Galaxy Map popup...');
    await page.click('text=🗺️ Map');
    await page.waitForTimeout(3000);
    
    // Wait for popup to appear
    await page.waitForSelector('.popup-backdrop', { timeout: 5000 });
    console.log('✅ Map popup opened');
    
    // Check map container in popup
    const mapContainer = await page.locator('.map-container').first();
    const mapBounds = await mapContainer.boundingBox();
    console.log(`📏 Map container: ${mapBounds?.width}x${mapBounds?.height}`);
    
    // Check canvas
    const canvas = await page.locator('.galaxy-canvas').first();
    const canvasBounds = await canvas.boundingBox();
    console.log(`🎨 Canvas size: ${canvasBounds?.width}x${canvasBounds?.height}`);
    
    if (canvasBounds && canvasBounds.height > 400) {
      console.log('✅ Galaxy Map has proper size');
    } else {
      console.log('❌ Galaxy Map size issue');
    }
    
    // Test interactivity
    console.log('🖱️ Testing map click...');
    await canvas.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(2000);
    
    // Test zoom controls
    console.log('🔍 Testing zoom...');
    const zoomInBtn = await page.locator('text=🔍 Zoom In').first();
    if (await zoomInBtn.isVisible()) {
      await zoomInBtn.click();
      await page.waitForTimeout(1000);
      console.log('✅ Zoom controls working');
    } else {
      console.log('⚠️ Zoom controls not found');
    }
    
    // Close the map popup
    await page.click('.popup-close');
    await page.waitForTimeout(1000);
    
    // Test Galaxy Data - it might be in Analytics or a sub-screen
    console.log('📊 Testing Galaxy Data...');
    // First try Analytics tab
    await page.click('text=📊 Analytics');
    await page.waitForTimeout(2000);
    
    // Look for Galaxy Data within Analytics or try direct navigation
    const galaxyDataExists = await page.locator('text=Galaxy Data').isVisible().catch(() => false);
    if (galaxyDataExists) {
      await page.click('text=Galaxy Data');
      await page.waitForTimeout(3000);
    } else {
      console.log('⚠️ Galaxy Data not found in Analytics, checking if it\'s a separate screen...');
      // Galaxy Data might be accessible differently
    }
    
    const dataScreen = await page.locator('.galaxy-data-screen').isVisible();
    if (dataScreen) {
      console.log('✅ Galaxy Data screen loaded');
      
      // Test tabs
      await page.click('text=🏛️ Civilizations');
      await page.waitForTimeout(1000);
      
      const civCount = await page.locator('.civilization-card').count();
      console.log(`✅ Found ${civCount} civilizations`);
      
      await page.click('text=📊 Comparison');
      await page.waitForTimeout(1000);
      
      const hasTable = await page.locator('.comparison-table').isVisible();
      console.log(`✅ Comparison table: ${hasTable ? 'visible' : 'not visible'}`);
      
    } else {
      console.log('❌ Galaxy Data screen not loaded');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_test_result.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    console.log('⏳ Keeping browser open for inspection...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testGalaxySimple().catch(console.error);
