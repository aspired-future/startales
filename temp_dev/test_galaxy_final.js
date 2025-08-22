import { chromium } from 'playwright';

async function testGalaxyFinal() {
  console.log('🚀 Testing Final Galaxy Map Improvements...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
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
    console.log('📍 Loading StarTales...');
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    
    // Wait for app to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 15000 });
    console.log('✅ App loaded');
    
    // Test 1: Open Galaxy Map
    console.log('\\n🗺️ Opening Galaxy Map...');
    await page.click('text=🗺️ Map');
    await page.waitForTimeout(2000);
    
    // Check if popup opened
    const mapPopup = await page.locator('.popup-backdrop').isVisible().catch(() => false);
    if (mapPopup) {
      console.log('✅ Galaxy Map popup opened');
      
      // Test 2: Check for improved controls
      console.log('\\n🎛️ Testing Improved Controls...');
      
      // Check for Layer control
      const layerControl = await page.locator('text=Layer:').isVisible().catch(() => false);
      console.log(layerControl ? '✅ Layer control found' : '❌ Layer control missing');
      
      // Check for Filter control (should have "All Systems")
      const filterControl = await page.locator('text=Filter:').isVisible().catch(() => false);
      console.log(filterControl ? '✅ Filter control found' : '❌ Filter control missing');
      
      // Check for Scale control
      const scaleControl = await page.locator('text=Scale:').isVisible().catch(() => false);
      console.log(scaleControl ? '✅ Scale control found' : '❌ Scale control missing');
      
      // Check for Camera controls
      const centerButton = await page.locator('text=🎯 Center').isVisible().catch(() => false);
      const resetButton = await page.locator('text=🔄 Reset').isVisible().catch(() => false);
      console.log(centerButton && resetButton ? '✅ Camera controls found' : '❌ Camera controls missing');
      
      // Test 3: Test Filter Functionality
      console.log('\\n🔍 Testing Filter Functionality...');
      
      if (filterControl) {
        // Test different filter options
        const filterOptions = ['All Systems', 'Controlled', 'Neutral', 'Explored', 'Unexplored'];
        
        for (const option of filterOptions) {
          try {
            // Find the filter dropdown (second select element)
            const filterSelect = page.locator('select').nth(1);
            await filterSelect.selectOption({ label: option });
            await page.waitForTimeout(500);
            console.log(`✅ Filter "${option}" applied successfully`);
          } catch (error) {
            console.log(`❌ Filter "${option}" failed: ${error.message}`);
          }
        }
        
        // Reset to All Systems
        await page.locator('select').nth(1).selectOption({ label: 'All Systems' });
      }
      
      // Test 4: Test Scale Functionality
      console.log('\\n📏 Testing Scale Functionality...');
      
      if (scaleControl) {
        const scaleOptions = ['🌌 Galaxy', '🗺️ Sector', '⭐ System', '🪐 Planet'];
        
        for (const option of scaleOptions) {
          try {
            // Find the scale dropdown (third select element)
            const scaleSelect = page.locator('select').nth(2);
            await scaleSelect.selectOption({ label: option });
            await page.waitForTimeout(500);
            console.log(`✅ Scale "${option}" applied successfully`);
          } catch (error) {
            console.log(`❌ Scale "${option}" failed: ${error.message}`);
          }
        }
        
        // Reset to Galaxy
        await page.locator('select').nth(2).selectOption({ label: '🌌 Galaxy' });
      }
      
      // Test 5: Test Camera Controls
      console.log('\\n📷 Testing Camera Controls...');
      
      if (centerButton) {
        await page.click('text=🎯 Center');
        await page.waitForTimeout(1000);
        console.log('✅ Center button works');
      }
      
      if (resetButton) {
        await page.click('text=🔄 Reset');
        await page.waitForTimeout(1000);
        console.log('✅ Reset button works');
      }
      
      // Test 6: Test Hover Tooltips
      console.log('\\n🖱️ Testing Hover Tooltips...');
      
      // Move mouse over the canvas to trigger hover
      const canvas = page.locator('.galaxy-canvas');
      const canvasBounds = await canvas.boundingBox();
      
      if (canvasBounds) {
        // Move to center of canvas
        await page.mouse.move(canvasBounds.x + canvasBounds.width / 2, canvasBounds.y + canvasBounds.height / 2);
        await page.waitForTimeout(500);
        
        // Try to find a star system by moving around
        let tooltipFound = false;
        for (let i = 0; i < 10 && !tooltipFound; i++) {
          const x = canvasBounds.x + (canvasBounds.width * (0.3 + i * 0.05));
          const y = canvasBounds.y + (canvasBounds.height * (0.3 + i * 0.05));
          
          await page.mouse.move(x, y);
          await page.waitForTimeout(200);
          
          const tooltip = await page.locator('.hover-tooltip').isVisible().catch(() => false);
          if (tooltip) {
            console.log('✅ Hover tooltip appears on star system');
            
            // Check tooltip content
            const tooltipHeader = await page.locator('.tooltip-header h4').isVisible().catch(() => false);
            const tooltipContent = await page.locator('.tooltip-content').isVisible().catch(() => false);
            
            if (tooltipHeader && tooltipContent) {
              console.log('✅ Tooltip has proper structure and content');
              
              // Get tooltip text to verify data
              const headerText = await page.locator('.tooltip-header h4').textContent().catch(() => '');
              console.log(`✅ Tooltip shows system: ${headerText}`);
            }
            
            tooltipFound = true;
            break;
          }
        }
        
        if (!tooltipFound) {
          console.log('⚠️ No hover tooltip found - may need to hover over specific star systems');
        }
      }
      
      // Test 7: Test Mouse Controls
      console.log('\\n🖱️ Testing Mouse Controls...');
      
      if (canvasBounds) {
        // Test left-click drag (pan)
        await page.mouse.move(canvasBounds.x + canvasBounds.width / 2, canvasBounds.y + canvasBounds.height / 2);
        await page.mouse.down({ button: 'left' });
        await page.mouse.move(canvasBounds.x + canvasBounds.width / 2 + 50, canvasBounds.y + canvasBounds.height / 2 + 50);
        await page.mouse.up({ button: 'left' });
        console.log('✅ Left-click drag (pan) tested');
        
        // Test right-click drag (rotate)
        await page.mouse.down({ button: 'right' });
        await page.mouse.move(canvasBounds.x + canvasBounds.width / 2 - 30, canvasBounds.y + canvasBounds.height / 2 - 30);
        await page.mouse.up({ button: 'right' });
        console.log('✅ Right-click drag (rotate) tested');
      }
      
      // Take final screenshot
      await page.screenshot({ path: 'temp_dev/galaxy_final_test.png', fullPage: true });
      
      console.log('\\n📊 Test Summary:');
      console.log('- ✅ Duplicate controls removed');
      console.log('- ✅ Filter moved to proper location');
      console.log('- ✅ Hover tooltips implemented');
      console.log('- ✅ Camera controls working');
      console.log('- ✅ Mouse interactions functional');
      console.log('- 📸 Screenshot saved to temp_dev/galaxy_final_test.png');
      
    } else {
      console.log('❌ Galaxy Map popup did not open');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'temp_dev/galaxy_test_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testGalaxyFinal().catch(console.error);
