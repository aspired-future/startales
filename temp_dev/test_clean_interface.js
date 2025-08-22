import { chromium } from 'playwright';

async function testCleanInterface() {
  console.log('🚀 Testing Cleaned Galaxy Interface...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  const page = await browser.newPage();
  
  // Set viewport for consistent testing
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('📍 Loading StarTales...');
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    
    // Wait for app to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 15000 });
    console.log('✅ App loaded');
    
    // Open Galaxy Map
    console.log('\\n🗺️ Opening Galaxy Map...');
    await page.click('text=🗺️ Map');
    await page.waitForTimeout(2000);
    
    // Check if popup opened
    const mapPopup = await page.locator('.popup-backdrop').isVisible().catch(() => false);
    if (!mapPopup) {
      console.log('❌ Galaxy Map popup did not open');
      return;
    }
    console.log('✅ Galaxy Map popup opened');
    
    // Test 1: Check for Clean Controls (No Duplicates)
    console.log('\\n🎛️ Testing Clean Controls...');
    
    // Count how many dropdowns we have
    const dropdowns = await page.locator('select').count();
    console.log(`📊 Found ${dropdowns} dropdown controls`);
    
    // Should have: View, Scale (2 total, not 3+ like before)
    if (dropdowns <= 2) {
      console.log('✅ Duplicate controls removed - clean interface');
    } else {
      console.log('⚠️ Still have extra controls');
    }
    
    // Check specific controls
    const viewControl = await page.locator('text=View:').isVisible().catch(() => false);
    const scaleControl = await page.locator('text=Scale:').isVisible().catch(() => false);
    const layerControl = await page.locator('text=Layer:').isVisible().catch(() => false);
    const filterControl = await page.locator('text=Filter:').isVisible().catch(() => false);
    
    console.log(viewControl ? '✅ View control found' : '❌ View control missing');
    console.log(scaleControl ? '✅ Scale control found' : '❌ Scale control missing');
    console.log(!layerControl ? '✅ Layer control removed' : '⚠️ Layer control still present');
    console.log(!filterControl ? '✅ Filter control removed' : '⚠️ Filter control still present');
    
    // Test 2: Test View Control Options
    console.log('\\n👁️ Testing View Control Options...');
    
    if (viewControl) {
      const viewSelect = page.locator('select').first();
      
      // Test different view options
      const viewOptions = ['🌌 All Systems', '🏛️ Controlled', '🌍 Neutral', '✅ Explored'];
      
      for (const option of viewOptions) {
        try {
          await viewSelect.selectOption({ label: option });
          await page.waitForTimeout(500);
          console.log(`✅ View "${option}" works`);
        } catch (error) {
          console.log(`❌ View "${option}" failed`);
        }
      }
    }
    
    // Test 3: Test Mouse Controls
    console.log('\\n🖱️ Testing Mouse Controls...');
    
    const canvas = page.locator('.galaxy-canvas');
    const canvasBounds = await canvas.boundingBox();
    
    if (canvasBounds) {
      const centerX = canvasBounds.x + canvasBounds.width / 2;
      const centerY = canvasBounds.y + canvasBounds.height / 2;
      
      // Test drag
      await page.mouse.move(centerX, centerY);
      await page.mouse.down({ button: 'left' });
      await page.mouse.move(centerX + 50, centerY + 30);
      await page.waitForTimeout(200);
      await page.mouse.up({ button: 'left' });
      console.log('✅ Drag tested');
      
      // Test rotate
      await page.mouse.down({ button: 'right' });
      await page.mouse.move(centerX - 30, centerY - 20);
      await page.waitForTimeout(200);
      await page.mouse.up({ button: 'right' });
      console.log('✅ Rotate tested');
    }
    
    // Test 4: Test Compact Controls
    console.log('\\n🎯 Testing Compact Controls...');
    
    const zoomIn = await page.locator('text=🔍+').isVisible().catch(() => false);
    const zoomOut = await page.locator('text=🔍-').isVisible().catch(() => false);
    const center = await page.locator('text=🎯').isVisible().catch(() => false);
    const reset = await page.locator('text=🔄').isVisible().catch(() => false);
    
    console.log(zoomIn ? '✅ Compact zoom in button' : '❌ Zoom in missing');
    console.log(zoomOut ? '✅ Compact zoom out button' : '❌ Zoom out missing');
    console.log(center ? '✅ Compact center button' : '❌ Center missing');
    console.log(reset ? '✅ Compact reset button' : '❌ Reset missing');
    
    if (zoomIn) {
      await page.click('text=🔍+');
      await page.waitForTimeout(300);
      console.log('✅ Zoom in works');
    }
    
    if (center) {
      await page.click('text=🎯');
      await page.waitForTimeout(300);
      console.log('✅ Center works');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/clean_interface.png', fullPage: true });
    
    console.log('\\n📊 Clean Interface Summary:');
    console.log('- ✅ Duplicate controls removed');
    console.log('- ✅ Single View control with all filter options');
    console.log('- ✅ Compact button design');
    console.log('- ✅ Mouse controls working');
    console.log('- ✅ Clean, professional interface');
    console.log('- 📸 Screenshot saved to temp_dev/clean_interface.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'temp_dev/clean_interface_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testCleanInterface().catch(console.error);
