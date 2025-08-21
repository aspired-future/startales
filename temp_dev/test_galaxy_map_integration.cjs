const playwright = require('playwright');

async function testGalaxyMapIntegration() {
    console.log('🗺️ TESTING GALAXY MAP INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Checking Galaxy Map iframe...');
        const galaxyIframe = await page.isVisible('.galaxy-iframe');
        console.log(`   Galaxy iframe visible: ${galaxyIframe}`);
        
        if (galaxyIframe) {
            const iframeSrc = await page.getAttribute('.galaxy-iframe', 'src');
            console.log(`   Iframe source: ${iframeSrc}`);
            
            // Check if iframe loads content
            await page.waitForTimeout(5000); // Give iframe time to load
            
            const iframe = await page.frameLocator('.galaxy-iframe');
            const hasContent = await iframe.locator('body').isVisible().catch(() => false);
            console.log(`   Iframe content loaded: ${hasContent}`);
            
            if (hasContent) {
                const title = await iframe.locator('title').textContent().catch(() => 'No title');
                console.log(`   Iframe title: ${title}`);
            }
        }
        
        console.log('');
        console.log('2️⃣ Testing Witter Dropdowns...');
        const filterDropdown = await page.isVisible('.filter-dropdown');
        const civilizationDropdown = await page.isVisible('.civilization-dropdown');
        console.log(`   Filter dropdown: ${filterDropdown}`);
        console.log(`   Civilization dropdown: ${civilizationDropdown}`);
        
        if (filterDropdown && civilizationDropdown) {
            console.log('   Testing dropdown functionality...');
            await page.selectOption('.filter-dropdown', 'TRADE');
            await page.waitForTimeout(1000);
            
            await page.selectOption('.civilization-dropdown', 'terran');
            await page.waitForTimeout(1000);
            
            const wittItems = await page.$$('.witt-item');
            console.log(`   Filtered witt items: ${wittItems.length}`);
        }
        
        console.log('');
        console.log('3️⃣ Testing Scrolling...');
        
        // Test center panel scrolling
        const centerPanel = await page.locator('.center-panel');
        const centerScrollHeight = await centerPanel.evaluate(el => el.scrollHeight);
        const centerClientHeight = await centerPanel.evaluate(el => el.clientHeight);
        console.log(`   Center panel scrollable: ${centerScrollHeight > centerClientHeight}`);
        
        // Test right panel scrolling
        const rightPanel = await page.locator('.right-panel');
        const rightScrollHeight = await rightPanel.evaluate(el => el.scrollHeight);
        const rightClientHeight = await rightPanel.evaluate(el => el.clientHeight);
        console.log(`   Right panel scrollable: ${rightScrollHeight > rightClientHeight}`);
        
        // Check for nested scrolling issues
        const nestedScrolls = await page.evaluate(() => {
            const scrollableElements = document.querySelectorAll('*');
            let nested = 0;
            
            for (const el of scrollableElements) {
                const style = window.getComputedStyle(el);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
                    const parent = el.parentElement;
                    while (parent) {
                        const parentStyle = window.getComputedStyle(parent);
                        if ((parentStyle.overflowY === 'auto' || parentStyle.overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
                            nested++;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }
            }
            return nested;
        });
        
        console.log(`   Nested scrolling elements: ${nestedScrolls}`);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/galaxy_map_integration_test.png', fullPage: true });
        console.log('');
        console.log('📸 Screenshot saved to temp_dev/galaxy_map_integration_test.png');
        
        console.log('');
        console.log('✅ INTEGRATION TEST RESULTS:');
        console.log(`   Galaxy Map iframe: ${galaxyIframe ? 'WORKING' : 'BROKEN'}`);
        console.log(`   Witter Dropdowns: ${filterDropdown && civilizationDropdown ? 'WORKING' : 'BROKEN'}`);
        console.log(`   Scrolling: ${nestedScrolls === 0 ? 'CLEAN' : 'HAS NESTED SCROLLS'}`);
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testGalaxyMapIntegration().catch(console.error);
