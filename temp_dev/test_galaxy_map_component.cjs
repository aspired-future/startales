const playwright = require('playwright');

async function testGalaxyMapComponent() {
    console.log('🌌 TESTING GALAXY MAP COMPONENT...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Map Tab Access...');
        
        // Click Map tab
        await page.click('.tab-button:has-text("Map")');
        await page.waitForTimeout(2000);
        
        // Check if new galaxy map component is loaded
        const galaxyMapComponent = await page.$('.galaxy-map-component');
        const hasNewComponent = !!galaxyMapComponent;
        
        console.log(`   New Galaxy Map Component: ${hasNewComponent ? 'LOADED ✅' : 'MISSING ❌'}`);
        
        if (hasNewComponent) {
            console.log('\n2️⃣ Testing Galaxy Map Features...');
            
            // Check for controls
            const controls = await page.evaluate(() => {
                return {
                    hasLayerControls: !!document.querySelector('.layer-controls'),
                    hasZoomControls: !!document.querySelector('.zoom-controls'),
                    hasCanvas: !!document.querySelector('.galaxy-canvas'),
                    hasGalaxyInfo: !!document.querySelector('.galaxy-info')
                };
            });
            
            console.log('   Controls check:', controls);
            
            // Test layer switching
            console.log('\n3️⃣ Testing Layer Controls...');
            
            const layerSelect = await page.$('.layer-select');
            if (layerSelect) {
                // Get available options
                const layerOptions = await page.$$eval('.layer-select option', 
                    options => options.map(opt => opt.textContent?.trim())
                );
                console.log(`   Available layers: ${layerOptions.join(', ')}`);
                
                // Test switching to Economic layer
                await page.selectOption('.layer-select', 'economic');
                await page.waitForTimeout(1000);
                
                const selectedLayer = await page.$eval('.layer-select', el => el.value);
                console.log(`   Selected layer: ${selectedLayer}`);
            }
            
            // Test zoom controls
            console.log('\n4️⃣ Testing Zoom Controls...');
            
            const initialZoom = await page.$eval('.zoom-level', el => el.textContent);
            console.log(`   Initial zoom: ${initialZoom}`);
            
            // Click zoom in
            await page.click('.zoom-btn:has-text("Zoom In")');
            await page.waitForTimeout(500);
            
            const newZoom = await page.$eval('.zoom-level', el => el.textContent);
            console.log(`   After zoom in: ${newZoom}`);
            
            const zoomChanged = initialZoom !== newZoom;
            console.log(`   Zoom functionality: ${zoomChanged ? 'WORKING ✅' : 'NOT WORKING ❌'}`);
            
            // Test canvas interaction
            console.log('\n5️⃣ Testing Canvas Interaction...');
            
            const canvas = await page.$('.galaxy-canvas');
            if (canvas) {
                const canvasBox = await canvas.boundingBox();
                if (canvasBox) {
                    // Click on canvas to test system selection
                    await page.click('.galaxy-canvas', {
                        position: { x: canvasBox.width / 2, y: canvasBox.height / 2 }
                    });
                    await page.waitForTimeout(1000);
                    
                    // Check if system info panel appeared
                    const systemInfoPanel = await page.$('.system-info-panel');
                    const hasSystemInfo = !!systemInfoPanel;
                    
                    console.log(`   System selection: ${hasSystemInfo ? 'WORKING ✅' : 'NO SYSTEM FOUND ⚠️'}`);
                    
                    if (hasSystemInfo) {
                        const systemName = await page.$eval('.system-info-header h3', el => el.textContent);
                        console.log(`   Selected system: ${systemName}`);
                    }
                }
            }
            
            // Test API connectivity
            console.log('\n6️⃣ Testing API Connectivity...');
            
            // Check if component shows loading or error states
            const loadingState = await page.$('.galaxy-map-loading');
            const errorState = await page.$('.galaxy-map-error');
            
            console.log(`   Loading state: ${loadingState ? 'SHOWN' : 'NOT SHOWN'}`);
            console.log(`   Error state: ${errorState ? 'SHOWN ⚠️' : 'NOT SHOWN'}`);
            
            // Check galaxy info
            const galaxyInfo = await page.evaluate(() => {
                const infoElement = document.querySelector('.galaxy-info');
                if (!infoElement) return null;
                
                return {
                    title: infoElement.querySelector('h4')?.textContent,
                    systems: infoElement.querySelector('p')?.textContent,
                    hasCurrentLocation: infoElement.textContent?.includes('Current Location')
                };
            });
            
            console.log('   Galaxy info:', galaxyInfo);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/galaxy_map_component_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/galaxy_map_component_test.png');
        
        console.log('\n✅ GALAXY MAP COMPONENT TEST RESULTS:');
        console.log(`   Component loaded: ${hasNewComponent ? 'YES ✅' : 'NO ❌'}`);
        
        if (hasNewComponent) {
            console.log(`   Controls present: ${controls.hasLayerControls && controls.hasZoomControls ? 'YES ✅' : 'PARTIAL ⚠️'}`);
            console.log(`   Canvas rendered: ${controls.hasCanvas ? 'YES ✅' : 'NO ❌'}`);
            console.log(`   Galaxy info shown: ${controls.hasGalaxyInfo ? 'YES ✅' : 'NO ❌'}`);
        }
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testGalaxyMapComponent().catch(console.error);
