import { test, expect } from '@playwright/test';

test.describe('Real Galaxy Map Issues Testing', () => {
  test('Navigate to Galaxy Map and Test Issues', async ({ page }) => {
    console.log('🔍 Testing Real Galaxy Map Issues...');
    
    // Navigate to the application
    await page.goto('http://localhost:5174');
    
    // Wait for the page to load (don't wait for network idle, just DOM)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Give it time to render
    
    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/real-test-initial.png', fullPage: true });
    
    // Click on the Galaxy button
    console.log('Clicking on Galaxy button...');
    await page.click('button:has-text("🌌 Galaxy")');
    
    // Wait for navigation/content to load
    await page.waitForTimeout(2000);
    
    // Take screenshot after clicking Galaxy
    await page.screenshot({ path: 'tests/screenshots/real-test-galaxy-page.png', fullPage: true });
    
    // Look for any galaxy map elements
    const galaxyMapElements = await page.locator('.enhanced-galaxy-map, .galaxy-map').count();
    console.log('Galaxy map elements found:', galaxyMapElements);
    
    if (galaxyMapElements === 0) {
      // Maybe we need to click on a specific map option
      console.log('No direct galaxy map found, looking for map options...');
      
      // Look for Enhanced 3D Galaxy Map or similar
      const enhancedMapButton = page.locator('button, a').filter({ hasText: /enhanced.*3d.*galaxy.*map/i });
      const enhancedMapCount = await enhancedMapButton.count();
      console.log('Enhanced 3D Galaxy Map buttons found:', enhancedMapCount);
      
      if (enhancedMapCount > 0) {
        console.log('Clicking Enhanced 3D Galaxy Map...');
        await enhancedMapButton.first().click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'tests/screenshots/real-test-enhanced-map.png', fullPage: true });
      } else {
        // Look for any map-related buttons
        const mapButtons = page.locator('button, a').filter({ hasText: /map/i });
        const mapButtonCount = await mapButtons.count();
        console.log('Map-related buttons found:', mapButtonCount);
        
        if (mapButtonCount > 0) {
          const firstMapButton = mapButtons.first();
          const buttonText = await firstMapButton.textContent();
          console.log('Clicking first map button:', buttonText);
          await firstMapButton.click();
          await page.waitForTimeout(3000);
          await page.screenshot({ path: 'tests/screenshots/real-test-map-clicked.png', fullPage: true });
        }
      }
    }
    
    // Now test for the actual issues
    console.log('Testing Issue 1: Bottom section space usage...');
    
    // Get viewport dimensions
    const viewport = page.viewportSize();
    console.log(`Viewport: ${viewport.width}x${viewport.height}`);
    
    // Look for bottom panels
    const bottomPanels = await page.locator('.galaxy-info-panel, .minimap, [class*="bottom"], [class*="info"]').all();
    console.log('Bottom panel elements found:', bottomPanels.length);
    
    let totalBottomSpace = 0;
    for (const panel of bottomPanels) {
      const box = await panel.boundingBox();
      if (box) {
        const spaceFromBottom = viewport.height - box.y;
        console.log(`Panel at y=${box.y}, takes ${spaceFromBottom}px from bottom`);
        totalBottomSpace = Math.max(totalBottomSpace, spaceFromBottom);
      }
    }
    
    console.log(`Total bottom space used: ${totalBottomSpace}px (${((totalBottomSpace/viewport.height)*100).toFixed(1)}%)`);
    
    // Test Issue 2: Check if we have a canvas for 3D rendering
    console.log('Testing Issue 2: 3D rendering and overlays...');
    
    const canvas = await page.locator('canvas').count();
    console.log('Canvas elements found:', canvas);
    
    if (canvas > 0) {
      console.log('Found canvas, testing interactions...');
      
      const canvasElement = page.locator('canvas').first();
      const canvasBox = await canvasElement.boundingBox();
      
      if (canvasBox) {
        const centerX = canvasBox.x + canvasBox.width / 2;
        const centerY = canvasBox.y + canvasBox.height / 2;
        
        // Take screenshot before interaction
        await page.screenshot({ path: 'tests/screenshots/real-test-before-interaction.png' });
        
        // Test right-click drag (rotation)
        console.log('Testing right-click drag for rotation...');
        await page.mouse.move(centerX, centerY);
        await page.mouse.down({ button: 'right' });
        await page.mouse.move(centerX + 50, centerY, { steps: 5 });
        await page.waitForTimeout(500);
        await page.mouse.up({ button: 'right' });
        
        // Take screenshot after rotation
        await page.screenshot({ path: 'tests/screenshots/real-test-after-rotation.png' });
        
        // Test left-click drag (panning)
        console.log('Testing left-click drag for panning...');
        await page.mouse.move(centerX, centerY);
        await page.mouse.down({ button: 'left' });
        await page.mouse.move(centerX - 30, centerY - 30, { steps: 5 });
        await page.waitForTimeout(500);
        await page.mouse.up({ button: 'left' });
        
        // Take screenshot after panning
        await page.screenshot({ path: 'tests/screenshots/real-test-after-panning.png' });
        
        // Test zoom
        console.log('Testing zoom...');
        await page.mouse.move(centerX, centerY);
        await page.mouse.wheel(0, -200); // Zoom in
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'tests/screenshots/real-test-after-zoom.png' });
      }
    }
    
    // Final comprehensive screenshot
    await page.screenshot({ path: 'tests/screenshots/real-test-final.png', fullPage: true });
    
    // Summary
    console.log('=== TEST SUMMARY ===');
    console.log(`Bottom space usage: ${((totalBottomSpace/viewport.height)*100).toFixed(1)}% of screen height`);
    console.log(`Canvas elements: ${canvas}`);
    console.log('Screenshots saved for manual inspection');
    
    // Basic assertions
    expect(canvas).toBeGreaterThan(0); // Should have at least one canvas
    expect(totalBottomSpace / viewport.height).toBeLessThan(0.3); // Bottom should use less than 30% of screen
  });
});
