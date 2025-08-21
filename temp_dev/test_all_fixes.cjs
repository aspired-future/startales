const playwright = require('playwright');

async function testAllFixes() {
    console.log('🔍 TESTING ALL COMPREHENSIVE HUD FIXES...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Galaxy Map...');
        const galaxyMap = await page.isVisible('.galaxy-map-content');
        const starSystems = await page.$$('.star-system');
        console.log(`   Galaxy Map visible: ${galaxyMap}`);
        console.log(`   Star systems count: ${starSystems.length}`);
        
        console.log('');
        console.log('2️⃣ Testing Witter Dropdowns...');
        const filterDropdown = await page.isVisible('.filter-dropdown');
        const civilizationDropdown = await page.isVisible('.civilization-dropdown');
        console.log(`   Filter dropdown visible: ${filterDropdown}`);
        console.log(`   Civilization dropdown visible: ${civilizationDropdown}`);
        
        if (filterDropdown) {
            const filterOptions = await page.$$eval('.filter-dropdown option', options => 
                options.map(opt => opt.textContent)
            );
            console.log(`   Filter options: ${filterOptions.join(', ')}`);
        }
        
        if (civilizationDropdown) {
            const civOptions = await page.$$eval('.civilization-dropdown option', options => 
                options.map(opt => opt.textContent)
            );
            console.log(`   Civilization options: ${civOptions.join(', ')}`);
        }
        
        console.log('');
        console.log('3️⃣ Testing Panel Structure...');
        const leftPanel = await page.isVisible('.left-panel');
        const centerPanel = await page.isVisible('.center-panel');
        const rightPanel = await page.isVisible('.right-panel');
        console.log(`   Left panel: ${leftPanel}`);
        console.log(`   Center panel: ${centerPanel}`);
        console.log(`   Right panel: ${rightPanel}`);
        
        console.log('');
        console.log('4️⃣ Testing Right Panel Content...');
        const liveMetrics = await page.isVisible('.live-metrics');
        const activeMissions = await page.isVisible('.active-missions');
        const liveAlerts = await page.isVisible('.live-alerts');
        console.log(`   Live metrics: ${liveMetrics}`);
        console.log(`   Active missions: ${activeMissions}`);
        console.log(`   Live alerts: ${liveAlerts}`);
        
        console.log('');
        console.log('5️⃣ Testing Scrolling...');
        const scrollableElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const scrollable = [];
            
            for (const el of elements) {
                const style = window.getComputedStyle(el);
                if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                    scrollable.push({
                        className: el.className,
                        tagName: el.tagName,
                        scrollHeight: el.scrollHeight,
                        clientHeight: el.clientHeight,
                        hasScroll: el.scrollHeight > el.clientHeight
                    });
                }
            }
            return scrollable;
        });
        
        console.log(`   Scrollable elements found: ${scrollableElements.length}`);
        scrollableElements.forEach((el, index) => {
            console.log(`   ${index + 1}. <${el.tagName.toLowerCase()}> class="${el.className}" hasScroll=${el.hasScroll}`);
        });
        
        console.log('');
        console.log('6️⃣ Testing Witter Content...');
        const wittItems = await page.$$('.witt-item');
        console.log(`   Witt items visible: ${wittItems.length}`);
        
        // Test dropdown functionality
        if (filterDropdown) {
            console.log('');
            console.log('7️⃣ Testing Dropdown Functionality...');
            await page.selectOption('.filter-dropdown', 'MILITARY');
            await page.waitForTimeout(1000);
            const militaryWitts = await page.$$('.witt-item');
            console.log(`   Military filter applied, items: ${militaryWitts.length}`);
            
            await page.selectOption('.civilization-dropdown', 'terran');
            await page.waitForTimeout(1000);
            const terranWitts = await page.$$('.witt-item');
            console.log(`   Terran filter applied, items: ${terranWitts.length}`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/all_fixes_screenshot.png', fullPage: true });
        console.log('');
        console.log('📸 Screenshot saved to temp_dev/all_fixes_screenshot.png');
        
        console.log('');
        console.log('✅ COMPREHENSIVE TEST RESULTS:');
        console.log(`   Galaxy Map: ${galaxyMap ? 'WORKING' : 'BROKEN'}`);
        console.log(`   Dropdowns: ${filterDropdown && civilizationDropdown ? 'WORKING' : 'BROKEN'}`);
        console.log(`   Panel Layout: ${leftPanel && centerPanel && rightPanel ? 'WORKING' : 'BROKEN'}`);
        console.log(`   Right Panel Content: ${liveMetrics && activeMissions && liveAlerts ? 'WORKING' : 'BROKEN'}`);
        console.log(`   Witter Content: ${wittItems.length > 0 ? 'WORKING' : 'BROKEN'}`);
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testAllFixes().catch(console.error);
