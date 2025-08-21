const playwright = require('playwright');

async function testCommunicationsTabbedScreen() {
    console.log('📡 TESTING COMMUNICATIONS TABBED SCREEN...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO COMMUNICATIONS SCREEN...');
        
        // Navigate to Communications screen
        await page.click('.accordion-header:has(.accordion-title:has-text("COMMUNICATIONS"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Comm Hub")');
        await page.waitForTimeout(3000);
        
        // Check if communications screen loaded
        const communicationsScreenVisible = await page.isVisible('.communications-screen');
        console.log(`   Communications screen loaded: ${communicationsScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (communicationsScreenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 5 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Overview tab (default)
            const overviewVisible = await page.isVisible('.overview-tab');
            console.log(`   Overview tab content: ${overviewVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (overviewVisible) {
                const metricCards = await page.$$eval('.metric-card', cards => cards.length);
                console.log(`   Overview metrics: ${metricCards} metric cards`);
            }
            
            // Test Leader Communications tab
            await page.click('.view-tabs .tab:has-text("Leader Comms")');
            await page.waitForTimeout(1000);
            
            const leaderVisible = await page.isVisible('.leader-tab');
            console.log(`   Leader Communications tab: ${leaderVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (leaderVisible) {
                const leaderComms = await page.$$eval('.leader-comm-item', items => items.length);
                const platformTags = await page.$$eval('.leader-tab .platform-tag', tags => tags.length);
                const tabActions = await page.$$eval('.leader-tab .tab-actions .action-btn', btns => btns.length);
                console.log(`   Leader communications: ${leaderComms} communications`);
                console.log(`   Platform tags: ${platformTags} platforms`);
                console.log(`   Tab actions: ${tabActions} buttons`);
            }
            
            // Test Operations tab
            await page.click('.view-tabs .tab:has-text("Operations")');
            await page.waitForTimeout(1000);
            
            const operationsVisible = await page.isVisible('.operations-tab');
            console.log(`   Operations tab: ${operationsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (operationsVisible) {
                const operations = await page.$$eval('.operation-item', items => items.length);
                const priorityIndicators = await page.$$eval('.op-priority', priorities => priorities.length);
                console.log(`   Active operations: ${operations} operations`);
                console.log(`   Priority indicators: ${priorityIndicators} priorities`);
            }
            
            // Test Media & Press tab
            await page.click('.view-tabs .tab:has-text("Media & Press")');
            await page.waitForTimeout(1000);
            
            const mediaVisible = await page.isVisible('.media-tab');
            console.log(`   Media & Press tab: ${mediaVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (mediaVisible) {
                const mediaSections = await page.$$eval('.media-section', sections => sections.length);
                const pressItems = await page.$$eval('.press-item', items => items.length);
                const messageItems = await page.$$eval('.message-item', items => items.length);
                const mediaItems = await page.$$eval('.media-item', items => items.length);
                console.log(`   Media sections: ${mediaSections} sections`);
                console.log(`   Press conferences: ${pressItems} conferences`);
                console.log(`   Public messages: ${messageItems} messages`);
                console.log(`   Media outlets: ${mediaItems} outlets`);
            }
            
            // Test Platforms tab
            await page.click('.view-tabs .tab:has-text("Platforms")');
            await page.waitForTimeout(1000);
            
            const platformsVisible = await page.isVisible('.platforms-tab');
            console.log(`   Platforms tab: ${platformsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (platformsVisible) {
                const platformItems = await page.$$eval('.platform-item', items => items.length);
                const statusIndicators = await page.$$eval('.platform-status .status-indicator', indicators => indicators.length);
                console.log(`   Platform integrations: ${platformItems} platforms`);
                console.log(`   Status indicators: ${statusIndicators} status dots`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Overview tab to test grid layout
            await page.click('.view-tabs .tab:has-text("Overview")');
            await page.waitForTimeout(1000);
            
            const gridLayout = await page.evaluate(() => {
                const metrics = document.querySelector('.overview-metrics');
                if (!metrics) return { columns: 0, gap: 0 };
                
                const styles = window.getComputedStyle(metrics);
                return {
                    columns: styles.gridTemplateColumns.split(' ').length,
                    gap: styles.gap
                };
            });
            console.log(`   Overview grid columns: ${gridLayout.columns} ${gridLayout.columns >= 4 ? '✅' : '❌'}`);
            console.log(`   Overview grid gap: ${gridLayout.gap}`);
            
            // Check tab height
            const tabHeight = await page.evaluate(() => {
                const tabs = document.querySelector('.view-tabs');
                return tabs ? tabs.offsetHeight : 0;
            });
            console.log(`   Tab height: ${tabHeight}px ${tabHeight < 50 ? '✅' : '❌'}`);
            
            console.log('\n4️⃣ TESTING NO SCROLLING ISSUES...');
            
            // Check if there's no giant scroll by measuring content height vs container
            const scrollInfo = await page.evaluate(() => {
                const tabContent = document.querySelector('.tab-content');
                const overviewTab = document.querySelector('.overview-tab');
                
                if (!tabContent || !overviewTab) return { hasScroll: false, ratio: 0 };
                
                return {
                    hasScroll: tabContent.scrollHeight > tabContent.clientHeight,
                    contentHeight: overviewTab.scrollHeight,
                    containerHeight: tabContent.clientHeight,
                    ratio: overviewTab.scrollHeight / tabContent.clientHeight
                };
            });
            
            console.log(`   Content fits in view: ${scrollInfo.ratio < 1.2 ? 'YES ✅' : 'NO ❌'}`);
            console.log(`   Content ratio: ${scrollInfo.ratio.toFixed(2)} ${scrollInfo.ratio < 1.5 ? '✅' : '❌'}`);
            console.log(`   Scroll needed: ${scrollInfo.hasScroll ? 'YES' : 'NO'}`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/communications_tabbed_screen_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/communications_tabbed_screen_test.png');
        
        console.log('\n🎉 COMMUNICATIONS TABBED SCREEN SUMMARY:');
        console.log(`   Screen loaded: ${communicationsScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 5 tabs functional: ${tabs && tabs.length === 5 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Grid layout optimized: ${gridLayout.columns >= 4 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Compact tab design: ${tabHeight < 50 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   No giant scroll: ${scrollInfo.ratio < 1.5 ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testCommunicationsTabbedScreen().catch(console.error);
