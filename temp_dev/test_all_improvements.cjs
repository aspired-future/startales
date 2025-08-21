const playwright = require('playwright');

async function testAllImprovements() {
    console.log('🔧 TESTING ALL HUD IMPROVEMENTS...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Border and Scrollbar Improvements...');
        
        // Check for the main border
        const mainBorder = await page.evaluate(() => {
            const hudMain = document.querySelector('.hud-main');
            if (!hudMain) return 'No .hud-main found';
            
            const style = window.getComputedStyle(hudMain);
            return {
                border: style.border,
                borderColor: style.borderColor,
                borderWidth: style.borderWidth
            };
        });
        
        console.log(`   Main HUD border: ${JSON.stringify(mainBorder)}`);
        
        // Test scrollbar colors
        const scrollbarTest = await page.evaluate(() => {
            const panels = ['.left-panel', '.tab-content', '.right-panel'];
            const results = {};
            
            panels.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    results[selector] = {
                        scrollable: element.scrollHeight > element.clientHeight,
                        height: `${element.scrollHeight}/${element.clientHeight}`
                    };
                }
            });
            
            return results;
        });
        
        console.log('   Scrollbar test results:', scrollbarTest);
        
        console.log('\n2️⃣ Testing Witter Improvements...');
        
        // Click Witter tab
        await page.click('.tab-button:has-text("Witter")');
        await page.waitForTimeout(1000);
        
        // Check filter dropdown styling
        const filterStyling = await page.evaluate(() => {
            const dropdown = document.querySelector('.filter-dropdown');
            if (!dropdown) return 'No filter dropdown found';
            
            const style = window.getComputedStyle(dropdown);
            return {
                backgroundColor: style.backgroundColor,
                color: style.color,
                border: style.border
            };
        });
        
        console.log(`   Filter dropdown styling: ${JSON.stringify(filterStyling)}`);
        
        // Check new category options
        const categoryOptions = await page.$$eval('.filter-dropdown option', options => 
            options.map(opt => opt.textContent?.trim())
        );
        
        console.log(`   Category options: ${categoryOptions.join(', ')}`);
        
        // Test if it has the new witty categories
        const hasWittyCategories = categoryOptions.some(opt => 
            opt?.includes('Citizens') || opt?.includes('Gossip') || opt?.includes('Memes')
        );
        
        console.log(`   Has witty categories: ${hasWittyCategories ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n3️⃣ Testing Analytics Tab...');
        
        // Click Analytics tab
        await page.click('.tab-button:has-text("Analytics")');
        await page.waitForTimeout(1000);
        
        const analyticsCards = await page.$$('.analytics-card');
        const analyticsSections = await page.$$('.analytics-section');
        
        console.log(`   Analytics sections: ${analyticsSections.length}`);
        console.log(`   Analytics cards: ${analyticsCards.length}`);
        
        console.log('\n4️⃣ Testing Galaxy Map...');
        
        // Click Map tab
        await page.click('.tab-button:has-text("Map")');
        await page.waitForTimeout(1000);
        
        const mapElements = await page.evaluate(() => {
            return {
                hasContainer: !!document.querySelector('.galaxy-map-container'),
                hasStarSystems: document.querySelectorAll('.star-system').length,
                hasControls: !!document.querySelector('.galaxy-controls'),
                hasStarField: !!document.querySelector('.star-field'),
                hasTradeRoutes: !!document.querySelector('.trade-routes')
            };
        });
        
        console.log('   Galaxy map elements:', mapElements);
        
        console.log('\n5️⃣ Testing Left Panel...');
        
        const leftPanelInfo = await page.evaluate(() => {
            const leftPanel = document.querySelector('.left-panel');
            if (!leftPanel) return 'No left panel found';
            
            return {
                scrollable: leftPanel.scrollHeight > leftPanel.clientHeight,
                height: `${leftPanel.scrollHeight}px / ${leftPanel.clientHeight}px`,
                sections: document.querySelectorAll('.left-panel > div').length,
                quickActions: !!document.querySelector('.quick-actions')
            };
        });
        
        console.log('   Left panel info:', leftPanelInfo);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/all_improvements_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/all_improvements_test.png');
        
        console.log('\n✅ IMPROVEMENT TEST RESULTS:');
        console.log(`   Border around HUD: ${mainBorder.border ? 'ADDED ✅' : 'MISSING ❌'}`);
        console.log(`   Filter styling fixed: ${filterStyling.backgroundColor?.includes('26, 26, 46') ? 'FIXED ✅' : 'NEEDS WORK ❌'}`);
        console.log(`   Witty categories: ${hasWittyCategories ? 'ADDED ✅' : 'MISSING ❌'}`);
        console.log(`   Analytics tab: ${analyticsSections.length >= 6 ? 'WORKING ✅' : 'INCOMPLETE ❌'}`);
        console.log(`   Galaxy map: ${mapElements.hasStarSystems > 0 ? 'EMBEDDED ✅' : 'MISSING ❌'}`);
        console.log(`   Left panel scrolling: ${leftPanelInfo.scrollable ? 'NEEDS ACCORDION ⚠️' : 'FITS SCREEN ✅'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testAllImprovements().catch(console.error);
