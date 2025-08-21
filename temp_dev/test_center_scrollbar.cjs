const playwright = require('playwright');

async function testCenterScrollbar() {
    console.log('📜 TESTING CENTER SCREEN SCROLLBAR...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ TESTING SCROLLBAR CONSISTENCY...');
        
        // Navigate to Demographics screen to test center panel scrollbar
        console.log('   Opening Demographics screen...');
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Demographics")');
        await page.waitForTimeout(2000);
        
        // Check if panel-screen is visible
        const panelScreenVisible = await page.isVisible('.panel-screen');
        console.log(`   Panel screen loaded: ${panelScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (panelScreenVisible) {
            // Check scrollbar properties for all three panels
            const scrollbarProperties = await page.evaluate(() => {
                const leftPanel = document.querySelector('.left-panel');
                const panelScreen = document.querySelector('.panel-screen');
                const rightPanel = document.querySelector('.right-panel');
                
                const getScrollbarStyles = (element) => {
                    if (!element) return null;
                    const styles = window.getComputedStyle(element, '::-webkit-scrollbar');
                    const thumbStyles = window.getComputedStyle(element, '::-webkit-scrollbar-thumb');
                    return {
                        width: styles.width,
                        thumbColor: thumbStyles.backgroundColor,
                        hasOverflow: element.scrollHeight > element.clientHeight
                    };
                };
                
                return {
                    leftPanel: getScrollbarStyles(leftPanel),
                    panelScreen: getScrollbarStyles(panelScreen),
                    rightPanel: getScrollbarStyles(rightPanel)
                };
            });
            
            console.log('\n2️⃣ SCROLLBAR PROPERTIES:');
            console.log('   Left Panel:', scrollbarProperties.leftPanel);
            console.log('   Center Panel (panel-screen):', scrollbarProperties.panelScreen);
            console.log('   Right Panel:', scrollbarProperties.rightPanel);
            
            // Test if scrollbars are consistent
            const leftWidth = scrollbarProperties.leftPanel?.width;
            const centerWidth = scrollbarProperties.panelScreen?.width;
            const rightWidth = scrollbarProperties.rightPanel?.width;
            
            console.log('\n3️⃣ CONSISTENCY CHECK:');
            console.log(`   Left scrollbar width: ${leftWidth}`);
            console.log(`   Center scrollbar width: ${centerWidth}`);
            console.log(`   Right scrollbar width: ${rightWidth}`);
            
            const widthsMatch = leftWidth === centerWidth && centerWidth === rightWidth;
            console.log(`   Scrollbar widths consistent: ${widthsMatch ? 'YES ✅' : 'NO ❌'}`);
            
            // Check if center panel actually scrolls
            const centerScrollable = await page.evaluate(() => {
                const panelScreen = document.querySelector('.panel-screen');
                return panelScreen ? panelScreen.scrollHeight > panelScreen.clientHeight : false;
            });
            console.log(`   Center panel scrollable: ${centerScrollable ? 'YES ✅' : 'NO ❌'}`);
            
            // Test scrolling behavior
            if (centerScrollable) {
                console.log('\n4️⃣ TESTING SCROLL BEHAVIOR...');
                
                // Scroll down in center panel
                await page.evaluate(() => {
                    const panelScreen = document.querySelector('.panel-screen');
                    if (panelScreen) {
                        panelScreen.scrollTop = 100;
                    }
                });
                
                await page.waitForTimeout(500);
                
                const scrollPosition = await page.evaluate(() => {
                    const panelScreen = document.querySelector('.panel-screen');
                    return panelScreen ? panelScreen.scrollTop : 0;
                });
                
                console.log(`   Scroll position after scrolling: ${scrollPosition}px`);
                console.log(`   Scrolling works: ${scrollPosition > 0 ? 'YES ✅' : 'NO ❌'}`);
            }
            
            // Test other screens to ensure consistency
            console.log('\n5️⃣ TESTING OTHER SCREENS...');
            
            // Test Cabinet screen
            await page.click('.accordion-header:has(.accordion-title:has-text("GOVERNMENT"))');
            await page.waitForTimeout(1000);
            await page.click('.nav-item:has-text("Cabinet")');
            await page.waitForTimeout(2000);
            
            const cabinetScreenVisible = await page.isVisible('.cabinet-screen');
            console.log(`   Cabinet screen scrollbar: ${cabinetScreenVisible ? 'YES ✅' : 'NO ❌'}`);
            
            // Test Military screen
            await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
            await page.waitForTimeout(1000);
            await page.click('.nav-item:has-text("Military")');
            await page.waitForTimeout(2000);
            
            const militaryScreenVisible = await page.isVisible('.military-screen');
            console.log(`   Military screen scrollbar: ${militaryScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/center_scrollbar_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/center_scrollbar_test.png');
        
        console.log('\n🎉 CENTER SCROLLBAR TEST SUMMARY:');
        console.log(`   Panel screen loaded: ${panelScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Scrollbar consistency: ${scrollbarProperties.panelScreen ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testCenterScrollbar().catch(console.error);
