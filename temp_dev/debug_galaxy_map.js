import { chromium } from 'playwright';

async function debugGalaxyMap() {
  console.log('🔍 Debugging Galaxy Map Blank Page...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  const page = await browser.newPage();
  
  // Set viewport for consistent testing
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Listen for all console messages
  page.on('console', msg => {
    console.log(`🖥️  BROWSER ${msg.type().toUpperCase()}:`, msg.text());
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  // Listen for network requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/galaxy') || url.includes('galaxy') || url.includes('GalaxyMap')) {
      console.log(`📡 GALAXY REQUEST: ${request.method()} ${url}`);
    }
  });
  
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (url.includes('/api/galaxy') || url.includes('galaxy')) {
      if (status >= 400) {
        console.log(`❌ GALAXY API FAILED: ${status} ${url}`);
      } else {
        console.log(`✅ GALAXY API SUCCESS: ${status} ${url}`);
      }
    }
  });
  
  try {
    console.log('📍 Loading StarTales...');
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    
    // Wait for app to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 15000 });
    console.log('✅ Main app loaded');
    
    // Test 1: Open Galaxy Map
    console.log('\\n🗺️ Opening Galaxy Map...');
    await page.click('text=🗺️ Map');
    await page.waitForTimeout(3000);
    
    // Check if popup opened
    const mapPopup = await page.locator('.popup-backdrop').isVisible().catch(() => false);
    if (!mapPopup) {
      console.log('❌ Galaxy Map popup did not open');
      
      // Check if Map button exists
      const mapButton = await page.locator('text=🗺️ Map').isVisible().catch(() => false);
      console.log('Map button visible:', mapButton);
      
      // Try alternative selectors
      const mapButtons = await page.locator('button').filter({ hasText: 'Map' }).count();
      console.log('Map buttons found:', mapButtons);
      
      return;
    }
    console.log('✅ Galaxy Map popup opened');
    
    // Test 2: Check Galaxy Map Component Loading
    console.log('\\n🌌 Checking Galaxy Map Component...');
    
    // Check for galaxy map component
    const galaxyMapComponent = await page.locator('.galaxy-map-component').isVisible().catch(() => false);
    console.log('Galaxy map component visible:', galaxyMapComponent);
    
    // Check for canvas
    const galaxyCanvas = await page.locator('.galaxy-canvas').isVisible().catch(() => false);
    console.log('Galaxy canvas visible:', galaxyCanvas);
    
    // Check for controls
    const galaxyControls = await page.locator('.galaxy-controls').isVisible().catch(() => false);
    console.log('Galaxy controls visible:', galaxyControls);
    
    // Check for loading state
    const loadingSpinner = await page.locator('.galaxy-map-loading').isVisible().catch(() => false);
    console.log('Loading spinner visible:', loadingSpinner);
    
    // Check for error state
    const errorMessage = await page.locator('.galaxy-map-error').isVisible().catch(() => false);
    console.log('Error message visible:', errorMessage);
    
    if (errorMessage) {
      const errorText = await page.locator('.galaxy-map-error').textContent().catch(() => 'Could not get error text');
      console.log('Error message:', errorText);
    }
    
    // Test 3: Check API Calls
    console.log('\\n📡 Testing Galaxy API Calls...');
    
    // Test galaxy API directly
    const galaxyApiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/galaxy/territories?campaignId=1');
        return {
          ok: response.ok,
          status: response.status,
          data: response.ok ? await response.json() : await response.text()
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    });
    
    console.log('Galaxy territories API test:', galaxyApiTest);
    
    // Test galaxy systems API
    const systemsApiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/galaxy/systems?campaignId=1');
        return {
          ok: response.ok,
          status: response.status,
          data: response.ok ? await response.json() : await response.text()
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    });
    
    console.log('Galaxy systems API test:', systemsApiTest);
    
    // Test 4: Check Component State
    console.log('\\n🔍 Checking Component State...');
    
    const componentState = await page.evaluate(() => {
      const component = document.querySelector('.galaxy-map-component');
      if (!component) return { exists: false };
      
      return {
        exists: true,
        innerHTML: component.innerHTML.substring(0, 500),
        classes: component.className,
        children: component.children.length,
        canvas: !!component.querySelector('.galaxy-canvas'),
        controls: !!component.querySelector('.galaxy-controls'),
        hasContent: component.innerHTML.length > 100
      };
    });
    
    console.log('Component state:', componentState);
    
    // Test 5: Check Canvas State
    if (galaxyCanvas) {
      console.log('\\n🎨 Checking Canvas State...');
      
      const canvasState = await page.evaluate(() => {
        const canvas = document.querySelector('.galaxy-canvas');
        if (!canvas) return { exists: false };
        
        return {
          exists: true,
          width: canvas.width,
          height: canvas.height,
          style: canvas.style.cssText,
          context: !!canvas.getContext('2d')
        };
      });
      
      console.log('Canvas state:', canvasState);
    }
    
    // Test 6: Wait and Recheck
    console.log('\\n⏳ Waiting 10 seconds for any delayed loading...');
    await page.waitForTimeout(10000);
    
    const finalCheck = {
      component: await page.locator('.galaxy-map-component').isVisible().catch(() => false),
      canvas: await page.locator('.galaxy-canvas').isVisible().catch(() => false),
      controls: await page.locator('.galaxy-controls').isVisible().catch(() => false),
      loading: await page.locator('.galaxy-map-loading').isVisible().catch(() => false),
      error: await page.locator('.galaxy-map-error').isVisible().catch(() => false)
    };
    
    console.log('Final state check:', finalCheck);
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_map_debug.png', fullPage: true });
    console.log('\\n📸 Screenshot saved to temp_dev/galaxy_map_debug.png');
    
    // Summary
    console.log('\\n📊 Galaxy Map Debug Summary:');
    console.log('- Popup opens:', mapPopup);
    console.log('- Component visible:', galaxyMapComponent);
    console.log('- Canvas visible:', galaxyCanvas);
    console.log('- Controls visible:', galaxyControls);
    console.log('- Loading state:', loadingSpinner);
    console.log('- Error state:', errorMessage);
    console.log('- API connectivity:', galaxyApiTest.ok && systemsApiTest.ok);
    
    if (!galaxyMapComponent || !galaxyCanvas) {
      console.log('\\n❌ ISSUE IDENTIFIED: Galaxy map component or canvas not rendering');
    } else if (loadingSpinner) {
      console.log('\\n⏳ ISSUE IDENTIFIED: Galaxy map stuck in loading state');
    } else if (errorMessage) {
      console.log('\\n❌ ISSUE IDENTIFIED: Galaxy map showing error state');
    } else if (!galaxyApiTest.ok || !systemsApiTest.ok) {
      console.log('\\n❌ ISSUE IDENTIFIED: Galaxy API not responding');
    } else {
      console.log('\\n✅ Galaxy map appears to be working - may be a visual rendering issue');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    await page.screenshot({ path: 'temp_dev/galaxy_debug_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

debugGalaxyMap().catch(console.error);
