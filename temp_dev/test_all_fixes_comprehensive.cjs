const playwright = require('playwright');

async function testAllFixesComprehensive() {
    console.log('🔧 TESTING ALL COMPREHENSIVE FIXES...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Outer Scrolls Removal...');
        
        // Check for outer scrollbars
        const bodyScrolls = await page.evaluate(() => {
            const body = document.body;
            const html = document.documentElement;
            
            return {
                bodyOverflowX: window.getComputedStyle(body).overflowX,
                bodyOverflowY: window.getComputedStyle(body).overflowY,
                htmlOverflowX: window.getComputedStyle(html).overflowX,
                htmlOverflowY: window.getComputedStyle(html).overflowY,
                bodyScrollWidth: body.scrollWidth,
                bodyClientWidth: body.clientWidth,
                bodyScrollHeight: body.scrollHeight,
                bodyClientHeight: body.clientHeight
            };
        });
        
        console.log('   Body/HTML overflow settings:', bodyScrolls);
        
        const hasOuterScrolls = bodyScrolls.bodyScrollWidth > bodyScrolls.bodyClientWidth || 
                               bodyScrolls.bodyScrollHeight > bodyScrolls.bodyClientHeight;
        
        console.log(`   Outer scrolls present: ${hasOuterScrolls ? 'YES ❌' : 'NO ✅'}`);
        
        console.log('\n2️⃣ Testing Right Border...');
        
        // Check HUD border
        const hudBorder = await page.evaluate(() => {
            const hudMain = document.querySelector('.hud-main');
            if (!hudMain) return 'No .hud-main found';
            
            const style = window.getComputedStyle(hudMain);
            const rect = hudMain.getBoundingClientRect();
            
            return {
                border: style.border,
                borderRight: style.borderRight,
                width: rect.width,
                right: rect.right,
                windowWidth: window.innerWidth
            };
        });
        
        console.log('   HUD border info:', hudBorder);
        
        const rightBorderPresent = hudBorder.borderRight && hudBorder.borderRight !== 'none';
        console.log(`   Right border present: ${rightBorderPresent ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n3️⃣ Testing Witter Feed Content...');
        
        // Click Witter tab
        await page.click('.tab-button:has-text("Witter")');
        await page.waitForTimeout(2000);
        
        // Check Witter content
        const witterContent = await page.evaluate(() => {
            const witterItems = document.querySelectorAll('.witt-item');
            const sampleContent = [];
            
            witterItems.forEach((item, index) => {
                if (index < 3) { // Get first 3 posts
                    const content = item.querySelector('.witt-content')?.textContent?.trim();
                    const author = item.querySelector('.witt-author')?.textContent?.trim();
                    sampleContent.push({ author, content: content?.substring(0, 100) + '...' });
                }
            });
            
            return {
                totalPosts: witterItems.length,
                sampleContent,
                hasAPIContent: sampleContent.some(post => 
                    post.content && !post.content.includes('Fleet deployment to Kepler')
                )
            };
        });
        
        console.log('   Witter content analysis:', witterContent);
        console.log(`   Using real API content: ${witterContent.hasAPIContent ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n4️⃣ Testing Character Tab vs Witter Separation...');
        
        // Click Characters tab
        await page.click('.tab-button:has-text("Characters")');
        await page.waitForTimeout(1000);
        
        const characterContent = await page.evaluate(() => {
            const characterMessages = document.querySelectorAll('.character-message, .message-item');
            return {
                hasCharacterMessages: characterMessages.length > 0,
                messageCount: characterMessages.length,
                sampleMessage: characterMessages[0]?.textContent?.trim().substring(0, 100)
            };
        });
        
        console.log('   Character tab content:', characterContent);
        
        // Go back to Witter
        await page.click('.tab-button:has-text("Witter")');
        await page.waitForTimeout(1000);
        
        const contentSeparation = characterContent.hasCharacterMessages && witterContent.totalPosts > 0;
        console.log(`   Content properly separated: ${contentSeparation ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n5️⃣ Testing Galaxy Map Functionality...');
        
        // Click Map tab
        await page.click('.tab-button:has-text("Map")');
        await page.waitForTimeout(2000);
        
        // Test map controls
        const mapControls = await page.evaluate(() => {
            return {
                hasLayerSelect: !!document.querySelector('.layer-select'),
                hasZoomControls: !!document.querySelector('.zoom-controls'),
                hasCanvas: !!document.querySelector('.galaxy-canvas'),
                canvasSize: (() => {
                    const canvas = document.querySelector('.galaxy-canvas');
                    return canvas ? {
                        width: canvas.width,
                        height: canvas.height,
                        clientWidth: canvas.clientWidth,
                        clientHeight: canvas.clientHeight
                    } : null;
                })()
            };
        });
        
        console.log('   Map controls:', mapControls);
        
        // Test zoom functionality
        const initialZoom = await page.$eval('.zoom-level', el => el.textContent);
        await page.click('.zoom-btn:has-text("Zoom In")');
        await page.waitForTimeout(500);
        const newZoom = await page.$eval('.zoom-level', el => el.textContent);
        
        const zoomWorking = initialZoom !== newZoom;
        console.log(`   Zoom controls working: ${zoomWorking ? 'YES ✅' : 'NO ❌'}`);
        
        // Test layer switching
        await page.selectOption('.layer-select', 'economic');
        await page.waitForTimeout(500);
        const selectedLayer = await page.$eval('.layer-select', el => el.value);
        
        const layerSwitching = selectedLayer === 'economic';
        console.log(`   Layer switching working: ${layerSwitching ? 'YES ✅' : 'NO ❌'}`);
        
        // Test canvas interaction
        const canvas = await page.$('.galaxy-canvas');
        if (canvas) {
            const canvasBox = await canvas.boundingBox();
            if (canvasBox) {
                // Click on canvas center
                await page.click('.galaxy-canvas', {
                    position: { x: canvasBox.width / 2, y: canvasBox.height / 2 }
                });
                await page.waitForTimeout(1000);
                
                const systemInfoPanel = await page.$('.system-info-panel');
                const canvasInteraction = !!systemInfoPanel;
                
                console.log(`   Canvas interaction working: ${canvasInteraction ? 'YES ✅' : 'NO ❌'}`);
                
                if (systemInfoPanel) {
                    const systemName = await page.$eval('.system-info-header h3', el => el.textContent);
                    console.log(`   Selected system: ${systemName}`);
                } else {
                    console.log('   No system info panel appeared after canvas click');
                }
            }
        }
        
        console.log('\n6️⃣ Testing Panel Scrolling...');
        
        const panelScrolling = await page.evaluate(() => {
            const leftPanel = document.querySelector('.left-panel');
            const centerPanel = document.querySelector('.tab-content');
            const rightPanel = document.querySelector('.right-panel');
            
            return {
                leftScrollable: leftPanel ? leftPanel.scrollHeight > leftPanel.clientHeight : false,
                centerScrollable: centerPanel ? centerPanel.scrollHeight > centerPanel.clientHeight : false,
                rightScrollable: rightPanel ? rightPanel.scrollHeight > rightPanel.clientHeight : false,
                leftOverflow: leftPanel ? window.getComputedStyle(leftPanel).overflowY : 'none',
                centerOverflow: centerPanel ? window.getComputedStyle(centerPanel).overflowY : 'none',
                rightOverflow: rightPanel ? window.getComputedStyle(rightPanel).overflowY : 'none'
            };
        });
        
        console.log('   Panel scrolling info:', panelScrolling);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/comprehensive_fixes_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/comprehensive_fixes_test.png');
        
        // Get canvas interaction result
        let canvasInteraction = false;
        const canvasElement = await page.$('.galaxy-canvas');
        if (canvasElement) {
            const canvasBox = await canvasElement.boundingBox();
            if (canvasBox) {
                await page.click('.galaxy-canvas', {
                    position: { x: canvasBox.width / 2, y: canvasBox.height / 2 }
                });
                await page.waitForTimeout(1000);
                
                const systemInfoPanel = await page.$('.system-info-panel');
                canvasInteraction = !!systemInfoPanel;
            }
        }

        console.log('\n✅ COMPREHENSIVE FIXES TEST RESULTS:');
        console.log(`   Outer scrolls removed: ${!hasOuterScrolls ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Right border present: ${rightBorderPresent ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Witter using real API: ${witterContent.hasAPIContent ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Content separation: ${contentSeparation ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Galaxy map zoom: ${zoomWorking ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Galaxy map layers: ${layerSwitching ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Canvas interaction: ${canvasInteraction ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testAllFixesComprehensive().catch(console.error);
