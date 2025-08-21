const playwright = require('playwright');

async function testFinalComprehensiveFixes() {
    console.log('🔧 TESTING FINAL COMPREHENSIVE FIXES...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Enable console logging for debugging
        page.on('console', msg => {
            if (msg.type() === 'log' && (msg.text().includes('API') || msg.text().includes('Witter'))) {
                console.log('   🖥️ Browser:', msg.text());
            }
        });
        
        console.log('1️⃣ TESTING WITTER API CONNECTION...');
        
        // Go to Witter tab
        await page.click('.tab-button:has-text("Witter")');
        await page.waitForTimeout(3000);
        
        // Check for real API content vs sample content
        const witterAnalysis = await page.evaluate(() => {
            const witterItems = document.querySelectorAll('.witt-item');
            const sampleContent = [];
            let hasSampleContent = false;
            let hasRealContent = false;
            
            witterItems.forEach((item, index) => {
                if (index < 5) {
                    const content = item.querySelector('.witt-content')?.textContent?.trim();
                    const author = item.querySelector('.witt-author')?.textContent?.trim();
                    
                    // Check for sample content indicators
                    if (content && (content.includes('Fleet deployment to Kepler') || 
                                   content.includes('Breakthrough in quantum computing') ||
                                   author.includes('Admiral Chen') ||
                                   author.includes('Dr. Sarah Martinez'))) {
                        hasSampleContent = true;
                    }
                    
                    // Check for real API content indicators
                    if (content && !content.includes('Fleet deployment to Kepler') && 
                        !content.includes('Breakthrough in quantum computing') &&
                        content.length > 20) {
                        hasRealContent = true;
                    }
                    
                    sampleContent.push({ 
                        author: author?.substring(0, 30) + '...', 
                        content: content?.substring(0, 50) + '...' 
                    });
                }
            });
            
            return {
                totalPosts: witterItems.length,
                sampleContent,
                hasSampleContent,
                hasRealContent
            };
        });
        
        console.log('   Witter content analysis:', witterAnalysis);
        console.log(`   Using real API content: ${!witterAnalysis.hasSampleContent && witterAnalysis.hasRealContent ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n2️⃣ TESTING WITTER FILTERS...');
        
        // Test category filter
        const initialPostCount = await page.$$eval('.witt-item', items => items.length);
        console.log(`   Initial posts: ${initialPostCount}`);
        
        await page.selectOption('.filter-dropdown', 'CITIZENS');
        await page.waitForTimeout(2000);
        
        const filteredPostCount = await page.$$eval('.witt-item', items => items.length);
        console.log(`   After Citizens filter: ${filteredPostCount}`);
        
        // Test civilization filter
        await page.selectOption('.civilization-dropdown', 'terran');
        await page.waitForTimeout(2000);
        
        const civFilteredCount = await page.$$eval('.witt-item', items => items.length);
        console.log(`   After Terran filter: ${civFilteredCount}`);
        
        const filtersWorking = filteredPostCount !== initialPostCount || civFilteredCount !== filteredPostCount;
        console.log(`   Filters working: ${filtersWorking ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n3️⃣ TESTING SCROLLBAR CONSISTENCY...');
        
        const scrollbarAnalysis = await page.evaluate(() => {
            const leftPanel = document.querySelector('.left-panel');
            const centerPanel = document.querySelector('.tab-content');
            const rightPanel = document.querySelector('.right-panel');
            
            const getScrollbarWidth = (element) => {
                if (!element) return 'N/A';
                const style = window.getComputedStyle(element, '::-webkit-scrollbar');
                return style.width || 'default';
            };
            
            return {
                leftScrollbarWidth: getScrollbarWidth(leftPanel),
                centerScrollbarWidth: getScrollbarWidth(centerPanel),
                rightScrollbarWidth: getScrollbarWidth(rightPanel),
                leftOverflow: leftPanel ? window.getComputedStyle(leftPanel).overflowY : 'N/A',
                centerOverflow: centerPanel ? window.getComputedStyle(centerPanel).overflowY : 'N/A',
                rightOverflow: rightPanel ? window.getComputedStyle(rightPanel).overflowY : 'N/A'
            };
        });
        
        console.log('   Scrollbar analysis:', scrollbarAnalysis);
        
        console.log('\n4️⃣ TESTING BORDER CONSISTENCY...');
        
        const borderAnalysis = await page.evaluate(() => {
            const hudMain = document.querySelector('.hud-main');
            const leftPanel = document.querySelector('.left-panel');
            const rightPanel = document.querySelector('.right-panel');
            
            return {
                hudBorder: hudMain ? window.getComputedStyle(hudMain).border : 'N/A',
                leftBorderRight: leftPanel ? window.getComputedStyle(leftPanel).borderRight : 'N/A',
                rightBorderLeft: rightPanel ? window.getComputedStyle(rightPanel).borderLeft : 'N/A'
            };
        });
        
        console.log('   Border analysis:', borderAnalysis);
        
        console.log('\n5️⃣ TESTING GALAXY MAP IMPROVEMENTS...');
        
        // Go to Map tab
        await page.click('.tab-button:has-text("Map")');
        await page.waitForTimeout(2000);
        
        const mapAnalysis = await page.evaluate(() => {
            const canvas = document.querySelector('.galaxy-canvas');
            const layerControls = document.querySelector('.layer-controls');
            const zoomControls = document.querySelector('.zoom-controls');
            const galaxyInfo = document.querySelector('.galaxy-info');
            
            const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
            const layerRect = layerControls ? layerControls.getBoundingClientRect() : null;
            const zoomRect = zoomControls ? zoomControls.getBoundingClientRect() : null;
            
            // Check if controls are covering the canvas
            const controlsCoveringCanvas = layerRect && canvasRect && 
                (layerRect.bottom > canvasRect.top + 100 || layerRect.right > canvasRect.right - 100);
            
            return {
                hasCanvas: !!canvas,
                hasLayerControls: !!layerControls,
                hasZoomControls: !!zoomControls,
                hasGalaxyInfo: !!galaxyInfo,
                canvasSize: canvasRect ? { width: canvasRect.width, height: canvasRect.height } : null,
                controlsCoveringCanvas,
                layerPosition: layerRect ? { top: layerRect.top, left: layerRect.left } : null,
                zoomPosition: zoomRect ? { top: zoomRect.top, right: window.innerWidth - zoomRect.right } : null
            };
        });
        
        console.log('   Map analysis:', mapAnalysis);
        console.log(`   Controls positioned properly: ${!mapAnalysis.controlsCoveringCanvas ? 'YES ✅' : 'NO ❌'}`);
        
        // Test map interaction
        const canvas = await page.$('.galaxy-canvas');
        if (canvas) {
            const canvasBox = await canvas.boundingBox();
            if (canvasBox) {
                // Click in center of canvas
                await page.click('.galaxy-canvas', {
                    position: { x: canvasBox.width / 2, y: canvasBox.height / 2 }
                });
                await page.waitForTimeout(1000);
                
                const systemInfoPanel = await page.$('.system-info-panel');
                console.log(`   Map interaction working: ${systemInfoPanel ? 'YES ✅' : 'NO ❌'}`);
            }
        }
        
        // Take final screenshot
        await page.screenshot({ path: 'temp_dev/final_comprehensive_fixes.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/final_comprehensive_fixes.png');
        
        console.log('\n🎉 FINAL COMPREHENSIVE FIXES SUMMARY:');
        console.log(`   Real Witter API content: ${!witterAnalysis.hasSampleContent && witterAnalysis.hasRealContent ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Witter filters working: ${filtersWorking ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Scrollbar consistency: ${scrollbarAnalysis.leftScrollbarWidth === scrollbarAnalysis.centerScrollbarWidth ? 'YES ✅' : 'PARTIAL ⚠️'}`);
        console.log(`   Border consistency: ${borderAnalysis.leftBorderRight.includes('2px') && borderAnalysis.rightBorderLeft.includes('2px') ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Map controls positioned: ${!mapAnalysis.controlsCoveringCanvas ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Map interaction: ${systemInfoPanel ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testFinalComprehensiveFixes().catch(console.error);
