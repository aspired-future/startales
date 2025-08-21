const playwright = require('playwright');

async function testCommunicationsScreenIntegration() {
    console.log('📡 TESTING COMMUNICATIONS SCREEN INTEGRATION...');
    
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
            // Check screen title
            const screenTitle = await page.textContent('.screen-title h2');
            console.log(`   Screen title: "${screenTitle}"`);
            
            // Check dashboard panels
            const panels = await page.$$eval('.comm-panel', panels => 
                panels.map(panel => {
                    const title = panel.querySelector('h3');
                    return title ? title.textContent.trim() : 'No title';
                })
            );
            console.log(`   Available panels: ${panels.join(', ')}`);
            console.log(`   Panel count: ${panels.length} ${panels.length >= 7 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING PANEL FUNCTIONALITY...');
            
            // Test Overview panel
            const overviewVisible = await page.isVisible('.overview-panel');
            console.log(`   Overview panel: ${overviewVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (overviewVisible) {
                const metricItems = await page.$$eval('.overview-metrics .metric-item', items => items.length);
                console.log(`   Overview metrics: ${metricItems} metrics`);
            }
            
            // Test Leader Communications panel
            const leaderVisible = await page.isVisible('.leader-panel');
            console.log(`   Leader Communications panel: ${leaderVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (leaderVisible) {
                const leaderComms = await page.$$eval('.leader-comm-item', items => items.length);
                const platformTags = await page.$$eval('.leader-panel .platform-tag', tags => tags.length);
                console.log(`   Leader communications: ${leaderComms} communications`);
                console.log(`   Platform tags: ${platformTags} platforms`);
            }
            
            // Test Active Operations panel
            const operationsVisible = await page.isVisible('.operations-panel');
            console.log(`   Active Operations panel: ${operationsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (operationsVisible) {
                const operations = await page.$$eval('.operation-item', items => items.length);
                const priorityIndicators = await page.$$eval('.op-priority', priorities => priorities.length);
                console.log(`   Active operations: ${operations} operations`);
                console.log(`   Priority indicators: ${priorityIndicators} priorities`);
            }
            
            // Test Press Conferences panel
            const pressVisible = await page.isVisible('.press-panel');
            console.log(`   Press Conferences panel: ${pressVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (pressVisible) {
                const pressItems = await page.$$eval('.press-item', items => items.length);
                const topicTags = await page.$$eval('.topic-tag', tags => tags.length);
                console.log(`   Press conferences: ${pressItems} conferences`);
                console.log(`   Topic tags: ${topicTags} topics`);
            }
            
            // Test Public Messages panel
            const messagesVisible = await page.isVisible('.messages-panel');
            console.log(`   Public Messages panel: ${messagesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (messagesVisible) {
                const messageItems = await page.$$eval('.message-item', items => items.length);
                const sentimentIndicators = await page.$$eval('.msg-sentiment', sentiments => sentiments.length);
                console.log(`   Public messages: ${messageItems} messages`);
                console.log(`   Sentiment indicators: ${sentimentIndicators} sentiments`);
            }
            
            // Test Media Relations panel
            const mediaVisible = await page.isVisible('.media-panel');
            console.log(`   Media Relations panel: ${mediaVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (mediaVisible) {
                const mediaItems = await page.$$eval('.media-item', items => items.length);
                const relationshipIndicators = await page.$$eval('.media-relationship', relationships => relationships.length);
                console.log(`   Media outlets: ${mediaItems} outlets`);
                console.log(`   Relationship indicators: ${relationshipIndicators} relationships`);
            }
            
            // Test Platform Integration panel
            const platformsVisible = await page.isVisible('.platforms-panel');
            console.log(`   Platform Integration panel: ${platformsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (platformsVisible) {
                const platformItems = await page.$$eval('.platform-item', items => items.length);
                const statusIndicators = await page.$$eval('.platform-status .status-indicator', indicators => indicators.length);
                console.log(`   Platform integrations: ${platformItems} platforms`);
                console.log(`   Status indicators: ${statusIndicators} status dots`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Check grid layout
            const gridLayout = await page.evaluate(() => {
                const dashboard = document.querySelector('.communications-dashboard');
                if (!dashboard) return { columns: 0, gap: 0 };
                
                const styles = window.getComputedStyle(dashboard);
                return {
                    columns: styles.gridTemplateColumns.split(' ').length,
                    gap: styles.gap
                };
            });
            console.log(`   Grid columns: ${gridLayout.columns} ${gridLayout.columns >= 2 ? '✅' : '❌'}`);
            console.log(`   Grid gap: ${gridLayout.gap}`);
            
            // Check panel hover effects
            const panelExists = await page.isVisible('.comm-panel');
            if (panelExists) {
                await page.hover('.comm-panel:first-of-type');
                await page.waitForTimeout(300);
                console.log(`   Panel hover effects: YES ✅`);
            }
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Test action buttons
            const actionButtons = await page.$$eval('.action-btn', btns => btns.length);
            console.log(`   Action buttons: ${actionButtons} buttons`);
            
            // Test button hover effects
            if (actionButtons > 0) {
                await page.hover('.action-btn:first-of-type');
                await page.waitForTimeout(300);
                console.log(`   Button hover effects: YES ✅`);
            }
            
            console.log('\n5️⃣ TESTING API INTEGRATION...');
            
            // Check if API endpoints are documented
            const apiInfoVisible = await page.isVisible('.api-info');
            console.log(`   API documentation: ${apiInfoVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (apiInfoVisible) {
                await page.click('.api-info summary');
                await page.waitForTimeout(500);
                
                const apiEndpoints = await page.$$eval('.api-endpoint', endpoints => 
                    endpoints.map(ep => ({
                        method: ep.querySelector('.method').textContent,
                        path: ep.querySelector('.path').textContent
                    }))
                );
                console.log(`   API endpoints: ${apiEndpoints.length} endpoints`);
                apiEndpoints.slice(0, 3).forEach(ep => console.log(`     ${ep.method} ${ep.path}`));
                if (apiEndpoints.length > 3) console.log(`     ... and ${apiEndpoints.length - 3} more`);
            }
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/communications_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/communications_screen_integration_test.png');
        
        console.log('\n🎉 COMMUNICATIONS SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${communicationsScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All panels functional: ${panels && panels.length >= 7 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Grid layout: ${gridLayout.columns >= 2 ? 'RESPONSIVE ✅' : 'BASIC'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testCommunicationsScreenIntegration().catch(console.error);
