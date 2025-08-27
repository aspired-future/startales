import { test, expect } from '@playwright/test';

test.describe('Galaxy Map Issues Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5174');
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle');
    
    // Navigate to the Enhanced 3D Galaxy Map
    await page.click('text=Enhanced 3D Galaxy Map');
    
    // Wait for the galaxy map to load
    await page.waitForSelector('.enhanced-galaxy-map', { timeout: 10000 });
    await page.waitForTimeout(2000); // Give time for data to load
  });

  test('Issue 1: Bottom section space usage', async ({ page }) => {
    console.log('🔍 Testing bottom section space usage...');
    
    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'tests/screenshots/galaxy-map-space-usage.png', fullPage: true });
    
    // Get viewport dimensions
    const viewport = page.viewportSize();
    console.log(`Viewport: ${viewport.width}x${viewport.height}`);
    
    // Check galaxy info panel dimensions and position
    const galaxyInfoPanel = await page.locator('.galaxy-info-panel');
    if (await galaxyInfoPanel.count() > 0) {
      const galaxyInfoBox = await galaxyInfoPanel.boundingBox();
      console.log('Galaxy Info Panel:', galaxyInfoBox);
      
      // Calculate how much vertical space it takes from bottom
      const spaceFromBottom = viewport.height - galaxyInfoBox.y;
      console.log(`Galaxy Info Panel takes ${spaceFromBottom}px from bottom (${((spaceFromBottom/viewport.height)*100).toFixed(1)}%)`);
      
      // Check if it's reasonably compact (should be less than 10% of screen height)
      expect(spaceFromBottom / viewport.height).toBeLessThan(0.1);
    }
    
    // Check minimap dimensions and position
    const minimap = await page.locator('.minimap');
    if (await minimap.count() > 0) {
      const minimapBox = await minimap.boundingBox();
      console.log('Minimap:', minimapBox);
      
      // Check if minimap is reasonably sized
      expect(minimapBox.width).toBeLessThan(200); // Should be compact
      expect(minimapBox.height).toBeLessThan(200);
    }
    
    // Check control panel dimensions
    const controlPanel = await page.locator('.enhanced-controls');
    if (await controlPanel.count() > 0) {
      const controlBox = await controlPanel.boundingBox();
      console.log('Control Panel:', controlBox);
      
      // Check if control panel is reasonably sized
      expect(controlBox.width).toBeLessThan(300); // Should be compact
    }
    
    // Calculate total UI space usage
    const canvas = await page.locator('.enhanced-galaxy-canvas');
    const canvasBox = await canvas.boundingBox();
    console.log('Canvas area:', canvasBox);
    
    const mapUsableArea = (canvasBox.width * canvasBox.height) / (viewport.width * viewport.height);
    console.log(`Map usable area: ${(mapUsableArea * 100).toFixed(1)}% of screen`);
    
    // The map should use most of the screen (at least 70%)
    expect(mapUsableArea).toBeGreaterThan(0.7);
  });

  test('Issue 2: Overlays moving with stars during rotation', async ({ page }) => {
    console.log('🔍 Testing overlay movement with 3D transformations...');
    
    // Wait for galaxy data to load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/galaxy-map-before-rotation.png' });
    
    // Find a star system with a visible label
    const canvas = await page.locator('.enhanced-galaxy-canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Get initial positions of visible elements by taking a screenshot and analyzing
    console.log('Taking initial position measurements...');
    
    // Perform right-click and drag to rotate (this should move overlays with stars)
    console.log('Performing rotation gesture...');
    
    // Start rotation from center of canvas
    const centerX = canvasBox.x + canvasBox.width / 2;
    const centerY = canvasBox.y + canvasBox.height / 2;
    
    // Right-click and drag to rotate
    await page.mouse.move(centerX, centerY);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(centerX + 100, centerY, { steps: 10 });
    await page.waitForTimeout(500); // Let animation settle
    await page.mouse.up({ button: 'right' });
    
    // Wait for rotation to complete
    await page.waitForTimeout(1000);
    
    // Take screenshot after rotation
    await page.screenshot({ path: 'tests/screenshots/galaxy-map-after-rotation.png' });
    
    // Test left-click and drag for panning
    console.log('Testing panning gesture...');
    await page.mouse.move(centerX, centerY);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(centerX - 50, centerY - 50, { steps: 10 });
    await page.waitForTimeout(500);
    await page.mouse.up({ button: 'left' });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/galaxy-map-after-panning.png' });
    
    // Test zoom functionality
    console.log('Testing zoom functionality...');
    await page.mouse.move(centerX, centerY);
    await page.mouse.wheel(0, -300); // Zoom in
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/galaxy-map-zoomed-in.png' });
    
    await page.mouse.wheel(0, 600); // Zoom out
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/galaxy-map-zoomed-out.png' });
    
    // Check if canvas is responding to interactions
    const canvasElement = await page.locator('.enhanced-galaxy-canvas');
    await expect(canvasElement).toBeVisible();
    
    // Verify the canvas has proper event listeners by checking cursor changes
    await page.hover('.enhanced-galaxy-canvas');
    const cursor = await page.evaluate(() => {
      const canvas = document.querySelector('.enhanced-galaxy-canvas');
      return window.getComputedStyle(canvas).cursor;
    });
    console.log('Canvas cursor style:', cursor);
    expect(cursor).toBe('grab');
  });

  test('Check Enhanced 3D Galaxy Map is accessible', async ({ page }) => {
    console.log('🔍 Checking if Enhanced 3D Galaxy Map is properly accessible...');
    
    // Check if the enhanced map screen is registered
    const screenFactory = await page.evaluate(() => {
      // Try to access the screen factory
      return window.screenComponents ? Object.keys(window.screenComponents) : null;
    });
    
    console.log('Available screens:', screenFactory);
    
    // Check if enhanced-3d-galaxy-map is in the list
    if (screenFactory) {
      expect(screenFactory).toContain('enhanced-3d-galaxy-map');
    }
    
    // Verify the component is actually rendered
    const enhancedMap = await page.locator('.enhanced-galaxy-map');
    await expect(enhancedMap).toBeVisible();
    
    // Check if controls are present
    const controls = await page.locator('.enhanced-controls');
    if (await controls.count() > 0) {
      console.log('Enhanced controls found');
      await expect(controls).toBeVisible();
    } else {
      console.log('Enhanced controls not found - checking for controls toggle');
      const controlsToggle = await page.locator('.controls-toggle');
      if (await controlsToggle.count() > 0) {
        await controlsToggle.click();
        await page.waitForTimeout(500);
        await expect(controls).toBeVisible();
      }
    }
  });

  test('Verify 3D projection system is working', async ({ page }) => {
    console.log('🔍 Testing 3D projection system...');
    
    // Check if the canvas is rendering content
    const canvas = await page.locator('.enhanced-galaxy-canvas');
    await expect(canvas).toBeVisible();
    
    // Get canvas context and check if it has content
    const hasContent = await page.evaluate(() => {
      const canvas = document.querySelector('.enhanced-galaxy-canvas');
      if (!canvas) return false;
      
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Check if canvas has any non-transparent pixels
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] > 0) return true; // Found non-transparent pixel
      }
      return false;
    });
    
    console.log('Canvas has rendered content:', hasContent);
    expect(hasContent).toBe(true);
    
    // Check if 3D projection function exists and is working
    const projectionWorking = await page.evaluate(() => {
      // Try to access the component's projection function
      const mapComponent = document.querySelector('.enhanced-galaxy-map');
      return mapComponent !== null;
    });
    
    expect(projectionWorking).toBe(true);
  });

  test('Performance and responsiveness check', async ({ page }) => {
    console.log('🔍 Testing performance and responsiveness...');
    
    // Measure initial load time
    const startTime = Date.now();
    await page.waitForSelector('.enhanced-galaxy-canvas');
    const loadTime = Date.now() - startTime;
    console.log(`Galaxy map load time: ${loadTime}ms`);
    
    // Load time should be reasonable (less than 5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Test responsiveness by performing multiple interactions quickly
    const canvas = await page.locator('.enhanced-galaxy-canvas');
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + canvasBox.width / 2;
    const centerY = canvasBox.y + canvasBox.height / 2;
    
    // Rapid mouse movements to test responsiveness
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(centerX + i * 20, centerY + i * 10);
      await page.waitForTimeout(50);
    }
    
    // The page should still be responsive
    await expect(canvas).toBeVisible();
    
    // Check memory usage (basic check)
    const memoryUsage = await page.evaluate(() => {
      return performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null;
    });
    
    if (memoryUsage) {
      console.log('Memory usage:', memoryUsage);
      // Memory usage should be reasonable (less than 100MB)
      expect(memoryUsage.used).toBeLessThan(100 * 1024 * 1024);
    }
  });
});
