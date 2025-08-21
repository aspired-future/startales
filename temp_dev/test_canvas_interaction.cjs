const playwright = require('playwright');

async function testCanvasInteraction() {
    console.log('🎯 TESTING CANVAS INTERACTION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Go to Map tab
        await page.click('.tab-button:has-text("Map")');
        await page.waitForTimeout(2000);
        
        console.log('1️⃣ Testing Canvas Setup...');
        
        const canvasInfo = await page.evaluate(() => {
            const canvas = document.querySelector('.galaxy-canvas');
            if (!canvas) return null;
            
            const rect = canvas.getBoundingClientRect();
            return {
                width: canvas.width,
                height: canvas.height,
                clientWidth: canvas.clientWidth,
                clientHeight: canvas.clientHeight,
                rectWidth: rect.width,
                rectHeight: rect.height,
                hasClickHandler: !!canvas.onclick || canvas.getAttribute('onclick') !== null
            };
        });
        
        console.log('   Canvas info:', canvasInfo);
        
        // Enable console logging
        page.on('console', msg => {
            if (msg.type() === 'log') {
                console.log('   🖥️ Browser:', msg.text());
            }
        });
        
        console.log('\n2️⃣ Testing Canvas Clicks...');
        
        // Try clicking different areas of the canvas
        const testPositions = [
            { x: 100, y: 100, name: 'Top-left area' },
            { x: 300, y: 150, name: 'Center-left area' },
            { x: 500, y: 200, name: 'Center-right area' },
            { x: 200, y: 250, name: 'Bottom-left area' }
        ];
        
        for (const pos of testPositions) {
            console.log(`   Testing click at ${pos.name} (${pos.x}, ${pos.y})...`);
            
            await page.click('.galaxy-canvas', {
                position: { x: pos.x, y: pos.y }
            });
            await page.waitForTimeout(1000);
            
            const systemInfoPanel = await page.$('.system-info-panel');
            if (systemInfoPanel) {
                const systemName = await page.$eval('.system-info-header h3', el => el.textContent);
                console.log(`   ✅ Found system: ${systemName}`);
                
                // Close the panel
                await page.click('.close-btn');
                await page.waitForTimeout(500);
                break;
            } else {
                console.log(`   ❌ No system found at ${pos.name}`);
            }
        }
        
        console.log('\n3️⃣ Testing Zoom and Click...');
        
        // Zoom in and try again
        await page.click('.zoom-btn:has-text("Zoom In")');
        await page.waitForTimeout(500);
        await page.click('.zoom-btn:has-text("Zoom In")');
        await page.waitForTimeout(500);
        
        const zoomLevel = await page.$eval('.zoom-level', el => el.textContent);
        console.log(`   Current zoom: ${zoomLevel}`);
        
        // Try center click after zoom
        await page.click('.galaxy-canvas', {
            position: { x: 300, y: 150 }
        });
        await page.waitForTimeout(1000);
        
        const systemInfoAfterZoom = await page.$('.system-info-panel');
        console.log(`   System found after zoom: ${systemInfoAfterZoom ? 'YES ✅' : 'NO ❌'}`);
        
        if (systemInfoAfterZoom) {
            const systemName = await page.$eval('.system-info-header h3', el => el.textContent);
            console.log(`   Selected system: ${systemName}`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/canvas_interaction_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/canvas_interaction_test.png');
        
        console.log('\n💡 Browser will stay open for manual testing...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testCanvasInteraction().catch(console.error);
