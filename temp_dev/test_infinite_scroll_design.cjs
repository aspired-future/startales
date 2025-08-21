const playwright = require('playwright');

async function testInfiniteScrollDesign() {
    console.log('♾️ TESTING INFINITE SCROLL DESIGN...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Galaxy Map iframe...');
        const galaxyIframe = await page.isVisible('.galaxy-iframe');
        console.log(`   Galaxy iframe visible: ${galaxyIframe}`);
        
        if (galaxyIframe) {
            // Test if iframe loads the demo server content
            await page.waitForTimeout(3000);
            const iframeSrc = await page.getAttribute('.galaxy-iframe', 'src');
            console.log(`   Iframe source: ${iframeSrc}`);
        }
        
        console.log('');
        console.log('2️⃣ Testing Panel Scrolling...');
        
        // Check for page-level scrolling (should not exist)
        const bodyOverflow = await page.evaluate(() => {
            const body = document.body;
            const html = document.documentElement;
            return {
                bodyOverflowY: window.getComputedStyle(body).overflowY,
                bodyOverflowX: window.getComputedStyle(body).overflowX,
                htmlOverflowY: window.getComputedStyle(html).overflowY,
                htmlOverflowX: window.getComputedStyle(html).overflowX,
                bodyScrollHeight: body.scrollHeight,
                bodyClientHeight: body.clientHeight,
                windowHeight: window.innerHeight
            };
        });
        
        console.log(`   Page-level vertical scroll: ${bodyOverflow.bodyScrollHeight > bodyOverflow.bodyClientHeight ? 'YES (BAD)' : 'NO (GOOD)'}`);
        console.log(`   Body overflow-x: ${bodyOverflow.bodyOverflowX}`);
        console.log(`   Body overflow-y: ${bodyOverflow.bodyOverflowY}`);
        
        // Test individual panel scrolling
        const panelScrolling = await page.evaluate(() => {
            const leftPanel = document.querySelector('.left-panel');
            const centerPanel = document.querySelector('.center-panel');
            const rightPanel = document.querySelector('.right-panel');
            
            return {
                left: leftPanel ? {
                    scrollable: leftPanel.scrollHeight > leftPanel.clientHeight,
                    overflowY: window.getComputedStyle(leftPanel).overflowY,
                    overflowX: window.getComputedStyle(leftPanel).overflowX
                } : null,
                center: centerPanel ? {
                    scrollable: centerPanel.scrollHeight > centerPanel.clientHeight,
                    overflowY: window.getComputedStyle(centerPanel).overflowY,
                    overflowX: window.getComputedStyle(centerPanel).overflowX
                } : null,
                right: rightPanel ? {
                    scrollable: rightPanel.scrollHeight > rightPanel.clientHeight,
                    overflowY: window.getComputedStyle(rightPanel).overflowY,
                    overflowX: window.getComputedStyle(rightPanel).overflowX
                } : null
            };
        });
        
        console.log(`   Left panel scrollable: ${panelScrolling.left?.scrollable} (overflow: ${panelScrolling.left?.overflowY})`);
        console.log(`   Center panel scrollable: ${panelScrolling.center?.scrollable} (overflow: ${panelScrolling.center?.overflowY})`);
        console.log(`   Right panel scrollable: ${panelScrolling.right?.scrollable} (overflow: ${panelScrolling.right?.overflowY})`);
        
        console.log('');
        console.log('3️⃣ Testing Witter Infinite Scroll...');
        
        const wittContent = await page.locator('.embedded-witter .witter-content');
        const initialWittCount = await page.$$eval('.witt-item-container', items => items.length);
        console.log(`   Initial Witter items: ${initialWittCount}`);
        
        // Test infinite scroll by scrolling to bottom of Witter content
        if (await wittContent.isVisible()) {
            console.log('   Testing infinite scroll trigger...');
            
            // Scroll to bottom of witter content
            await wittContent.evaluate(el => {
                el.scrollTop = el.scrollHeight - el.clientHeight - 100; // Scroll near bottom
            });
            
            await page.waitForTimeout(2000); // Wait for loading
            
            const newWittCount = await page.$$eval('.witt-item-container', items => items.length);
            console.log(`   Witter items after scroll: ${newWittCount}`);
            console.log(`   Infinite scroll working: ${newWittCount > initialWittCount ? 'YES' : 'NO'}`);
            
            // Check for loading indicator
            const loadingMore = await page.isVisible('.loading-more');
            console.log(`   Loading indicator visible: ${loadingMore}`);
        }
        
        console.log('');
        console.log('4️⃣ Testing Horizontal Scrolling...');
        
        const horizontalScroll = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const horizontalScrollers = [];
            
            for (const el of elements) {
                const style = window.getComputedStyle(el);
                if (el.scrollWidth > el.clientWidth && 
                    (style.overflowX === 'auto' || style.overflowX === 'scroll')) {
                    horizontalScrollers.push({
                        tagName: el.tagName,
                        className: el.className,
                        scrollWidth: el.scrollWidth,
                        clientWidth: el.clientWidth
                    });
                }
            }
            
            return horizontalScrollers;
        });
        
        console.log(`   Horizontal scrolling elements: ${horizontalScroll.length}`);
        if (horizontalScroll.length > 0) {
            horizontalScroll.forEach((el, i) => {
                console.log(`     ${i+1}. <${el.tagName.toLowerCase()}> class="${el.className}"`);
            });
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/infinite_scroll_test.png', fullPage: false });
        console.log('');
        console.log('📸 Screenshot saved to temp_dev/infinite_scroll_test.png');
        
        console.log('');
        console.log('✅ INFINITE SCROLL TEST RESULTS:');
        console.log(`   Galaxy Map: ${galaxyIframe ? 'VISIBLE' : 'MISSING'}`);
        console.log(`   Page-level scrolling: ${bodyOverflow.bodyScrollHeight > bodyOverflow.bodyClientHeight ? 'PRESENT (BAD)' : 'NONE (GOOD)'}`);
        console.log(`   Panel scrolling: ${panelScrolling.left?.scrollable || panelScrolling.center?.scrollable || panelScrolling.right?.scrollable ? 'WORKING' : 'NOT WORKING'}`);
        console.log(`   Witter infinite scroll: ${newWittCount > initialWittCount ? 'WORKING' : 'NOT WORKING'}`);
        console.log(`   Horizontal scrolling: ${horizontalScroll.length === 0 ? 'NONE (GOOD)' : 'PRESENT (BAD)'}`);
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testInfiniteScrollDesign().catch(console.error);
