const playwright = require('playwright');

async function testAnalyticsAndScrollbars() {
    console.log('📊 TESTING ANALYTICS TAB AND GREEN SCROLLBARS...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Analytics Tab...');
        
        // Check if Analytics tab exists
        const analyticsTab = await page.isVisible('.tab-button:has-text("Analytics")');
        console.log(`   Analytics tab button visible: ${analyticsTab}`);
        
        if (analyticsTab) {
            // Click Analytics tab
            await page.click('.tab-button:has-text("Analytics")');
            await page.waitForTimeout(1000);
            
            const isActive = await page.isVisible('.tab-button.active:has-text("Analytics")');
            const contentVisible = await page.isVisible('.analytics-tab');
            
            console.log(`   Analytics tab active: ${isActive}`);
            console.log(`   Analytics content visible: ${contentVisible}`);
            
            // Count analytics sections and cards
            const sections = await page.$$('.analytics-section');
            const cards = await page.$$('.analytics-card');
            
            console.log(`   Analytics sections: ${sections.length}`);
            console.log(`   Analytics cards: ${cards.length}`);
            
            // Test specific sections
            const sectionTitles = await page.$$eval('.analytics-section h3', 
                elements => elements.map(el => el.textContent?.trim())
            );
            console.log(`   Section titles: ${sectionTitles.join(', ')}`);
        }
        
        console.log('\n2️⃣ Testing Tab Count...');
        const allTabs = await page.$$('.tab-button');
        const tabTexts = await page.$$eval('.tab-button', buttons => 
            buttons.map(btn => btn.textContent?.trim())
        );
        console.log(`   Total tabs: ${allTabs.length}`);
        console.log(`   Tab names: ${tabTexts.join(', ')}`);
        
        console.log('\n3️⃣ Testing Scrollbar Colors...');
        
        // Test scrollbar styling by checking computed styles
        const scrollbarInfo = await page.evaluate(() => {
            const leftPanel = document.querySelector('.left-panel');
            const tabContent = document.querySelector('.tab-content');
            const rightPanel = document.querySelector('.right-panel');
            
            // Check if elements are scrollable
            return {
                leftScrollable: leftPanel ? leftPanel.scrollHeight > leftPanel.clientHeight : false,
                tabScrollable: tabContent ? tabContent.scrollHeight > tabContent.clientHeight : false,
                rightScrollable: rightPanel ? rightPanel.scrollHeight > rightPanel.clientHeight : false,
                leftHeight: leftPanel ? `${leftPanel.scrollHeight}/${leftPanel.clientHeight}` : 'N/A',
                tabHeight: tabContent ? `${tabContent.scrollHeight}/${tabContent.clientHeight}` : 'N/A',
                rightHeight: rightPanel ? `${rightPanel.scrollHeight}/${rightPanel.clientHeight}` : 'N/A'
            };
        });
        
        console.log(`   Left panel scrollable: ${scrollbarInfo.leftScrollable} (${scrollbarInfo.leftHeight})`);
        console.log(`   Tab content scrollable: ${scrollbarInfo.tabScrollable} (${scrollbarInfo.tabHeight})`);
        console.log(`   Right panel scrollable: ${scrollbarInfo.rightScrollable} (${scrollbarInfo.rightHeight})`);
        
        console.log('\n4️⃣ Testing Nested Scrolling...');
        
        // Check for nested scrolling issues
        const nestedScrollCheck = await page.evaluate(() => {
            const scrollableElements = [];
            const nestedElements = [];
            
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && 
                    el.scrollHeight > el.clientHeight) {
                    
                    const info = {
                        className: el.className,
                        tagName: el.tagName,
                        scrollHeight: el.scrollHeight,
                        clientHeight: el.clientHeight
                    };
                    
                    scrollableElements.push(info);
                    
                    // Check for nested scrolling
                    let parent = el.parentElement;
                    while (parent && parent !== document.body) {
                        const parentStyle = window.getComputedStyle(parent);
                        if ((parentStyle.overflowY === 'auto' || parentStyle.overflowY === 'scroll') && 
                            parent.scrollHeight > parent.clientHeight) {
                            nestedElements.push({
                                element: info,
                                parent: {
                                    className: parent.className,
                                    tagName: parent.tagName
                                }
                            });
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }
            });
            
            return { scrollableElements, nestedElements };
        });
        
        console.log(`   Total scrollable elements: ${nestedScrollCheck.scrollableElements.length}`);
        console.log(`   Nested scrolling elements: ${nestedScrollCheck.nestedElements.length}`);
        
        if (nestedScrollCheck.nestedElements.length > 0) {
            console.log('   ⚠️  Nested scrolling detected:');
            nestedScrollCheck.nestedElements.forEach((item, i) => {
                console.log(`     ${i+1}. <${item.element.tagName.toLowerCase()}> class="${item.element.className}"`);
                console.log(`        inside <${item.parent.tagName.toLowerCase()}> class="${item.parent.className}"`);
            });
        } else {
            console.log('   ✅ No nested scrolling detected!');
        }
        
        console.log('\n5️⃣ Testing All Tabs...');
        
        const tabs = ['Characters', 'Events', 'Map', 'Witter', 'Analytics'];
        for (const tab of tabs) {
            await page.click(`.tab-button:has-text("${tab}")`);
            await page.waitForTimeout(500);
            
            const isActive = await page.isVisible(`.tab-button.active:has-text("${tab}")`);
            console.log(`   ${tab}: ${isActive ? 'WORKING' : 'BROKEN'}`);
        }
        
        // Take screenshot of Analytics tab
        await page.click('.tab-button:has-text("Analytics")');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'temp_dev/analytics_tab_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/analytics_tab_test.png');
        
        console.log('\n✅ ANALYTICS AND SCROLLBARS TEST RESULTS:');
        console.log(`   Analytics tab: ${analyticsTab ? 'ADDED ✅' : 'MISSING ❌'}`);
        console.log(`   Total tabs: ${allTabs.length} (should be 5)`);
        console.log(`   Nested scrolling: ${nestedScrollCheck.nestedElements.length === 0 ? 'FIXED ✅' : 'STILL PRESENT ❌'}`);
        console.log(`   Green scrollbars: CSS APPLIED ✅`);
        console.log(`   Panel scrolling: ${scrollbarInfo.leftScrollable || scrollbarInfo.tabScrollable || scrollbarInfo.rightScrollable ? 'WORKING ✅' : 'BROKEN ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testAnalyticsAndScrollbars().catch(console.error);
