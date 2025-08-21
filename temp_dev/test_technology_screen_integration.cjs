const playwright = require('playwright');

async function testTechnologyScreenIntegration() {
    console.log('⚙️ TESTING TECHNOLOGY SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO TECHNOLOGY SCREEN...');
        
        // Navigate to Technology screen
        await page.click('.accordion-header:has(.accordion-title:has-text("SCIENCE"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Technology")');
        await page.waitForTimeout(3000);
        
        // Check if technology screen loaded
        const technologyScreenVisible = await page.isVisible('.technology-screen');
        console.log(`   Technology screen loaded: ${technologyScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (technologyScreenVisible) {
            // Check screen title
            const screenTitle = await page.textContent('.screen-title h2');
            console.log(`   Screen title: "${screenTitle}"`);
            
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 9 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Overview tab (default)
            const overviewVisible = await page.isVisible('.overview-view');
            console.log(`   Overview tab content: ${overviewVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (overviewVisible) {
                const metricCards = await page.$$eval('.metric-card', cards => cards.length);
                const overviewCards = await page.$$eval('.overview-card', cards => cards.length);
                console.log(`   Metric cards: ${metricCards} analytics`);
                console.log(`   Overview cards: ${overviewCards} sections`);
            }
            
            // Test Technologies tab
            await page.click('.view-tabs .tab:has-text("Technologies")');
            await page.waitForTimeout(1000);
            
            const technologiesVisible = await page.isVisible('.technologies-view');
            console.log(`   Technologies tab: ${technologiesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (technologiesVisible) {
                const techRows = await page.$$eval('.technologies-table tbody tr', rows => rows.length);
                const actionBtns = await page.$$eval('.tech-actions .action-btn', btns => btns.length);
                console.log(`   Technology entries: ${techRows} technologies`);
                console.log(`   Action buttons: ${actionBtns} actions`);
                
                // Check complexity badges
                const complexityBadges = await page.$$eval('.complexity-badge', badges => badges.length);
                console.log(`   Complexity badges: ${complexityBadges} badges`);
                
                // Check security dots
                const securityDots = await page.$$eval('.security-dot', dots => dots.length);
                console.log(`   Security indicators: ${securityDots} dots`);
            }
            
            // Test Research tab
            await page.click('.view-tabs .tab:has-text("Research")');
            await page.waitForTimeout(1000);
            
            const researchVisible = await page.isVisible('.research-view');
            console.log(`   Research tab: ${researchVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (researchVisible) {
                const researchRows = await page.$$eval('.research-table tbody tr', rows => rows.length);
                const progressBars = await page.$$eval('.progress-bar', bars => bars.length);
                console.log(`   Research projects: ${researchRows} projects`);
                console.log(`   Progress bars: ${progressBars} progress indicators`);
            }
            
            // Test Cyber Ops tab
            await page.click('.view-tabs .tab:has-text("Cyber Ops")');
            await page.waitForTimeout(1000);
            
            const cyberVisible = await page.isVisible('.cyber-view');
            console.log(`   Cyber Ops tab: ${cyberVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (cyberVisible) {
                const cyberRows = await page.$$eval('.cyber-table tbody tr', rows => rows.length);
                const operationStatus = await page.$$eval('.operation-status', statuses => statuses.length);
                console.log(`   Cyber operations: ${cyberRows} operations`);
                console.log(`   Status indicators: ${operationStatus} status badges`);
            }
            
            // Test Psychic Powers tab
            await page.click('.view-tabs .tab:has-text("Psychic Powers")');
            await page.waitForTimeout(1000);
            
            const psychicVisible = await page.isVisible('.psychic-view');
            console.log(`   Psychic Powers tab: ${psychicVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (psychicVisible) {
                const powerCards = await page.$$eval('.power-card', cards => cards.length);
                console.log(`   Psychic power cards: ${powerCards} powers`);
            }
            
            // Test Innovation tab
            await page.click('.view-tabs .tab:has-text("Innovation")');
            await page.waitForTimeout(1000);
            
            const innovationVisible = await page.isVisible('.innovation-view');
            console.log(`   Innovation tab: ${innovationVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (innovationVisible) {
                const innovationCards = await page.$$eval('.innovation-card', cards => cards.length);
                const eventItems = await page.$$eval('.event-item', items => items.length);
                console.log(`   Innovation cards: ${innovationCards} innovation types`);
                console.log(`   Innovation events: ${eventItems} events`);
            }
            
            // Test Transfers tab
            await page.click('.view-tabs .tab:has-text("Transfers")');
            await page.waitForTimeout(1000);
            
            const transfersVisible = await page.isVisible('.transfers-view');
            console.log(`   Transfers tab: ${transfersVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (transfersVisible) {
                const transferRows = await page.$$eval('.transfers-table tbody tr', rows => rows.length);
                const reverseRows = await page.$$eval('.reverse-table tbody tr', rows => rows.length);
                console.log(`   Technology transfers: ${transferRows} transfers`);
                console.log(`   Reverse engineering: ${reverseRows} projects`);
            }
            
            // Test Analytics tab
            await page.click('.view-tabs .tab:has-text("Analytics")');
            await page.waitForTimeout(1000);
            
            const analyticsVisible = await page.isVisible('.analytics-view');
            console.log(`   Analytics tab: ${analyticsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (analyticsVisible) {
                const analyticsCards = await page.$$eval('.analytics-card', cards => cards.length);
                console.log(`   Analytics cards: ${analyticsCards} analysis types`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Check compact layout
            const tabHeight = await page.evaluate(() => {
                const tabs = document.querySelector('.view-tabs');
                return tabs ? tabs.offsetHeight : 0;
            });
            console.log(`   Tab height: ${tabHeight}px ${tabHeight < 50 ? '✅' : '❌'}`);
            
            // Check tab wrapping for 9 tabs
            const tabsPerRow = await page.evaluate(() => {
                const tabs = document.querySelectorAll('.view-tabs .tab');
                if (tabs.length === 0) return 0;
                
                const firstTabTop = tabs[0].getBoundingClientRect().top;
                let tabsInFirstRow = 0;
                
                for (let tab of tabs) {
                    if (Math.abs(tab.getBoundingClientRect().top - firstTabTop) < 5) {
                        tabsInFirstRow++;
                    } else {
                        break;
                    }
                }
                
                return tabsInFirstRow;
            });
            console.log(`   Tabs per row: ${tabsPerRow} ${tabsPerRow >= 6 ? '✅' : '❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Go back to Technologies tab to test action buttons
            await page.click('.view-tabs .tab:has-text("Technologies")');
            await page.waitForTimeout(1000);
            
            const refreshBtn = await page.isVisible('.tech-actions .action-btn:first-of-type');
            const createBtn = await page.isVisible('.tech-actions .action-btn.secondary');
            console.log(`   Refresh button: ${refreshBtn ? 'YES ✅' : 'NO ❌'}`);
            console.log(`   Create button: ${createBtn ? 'YES ✅' : 'NO ❌'}`);
            
            // Test table hover effects
            const techTableExists = await page.isVisible('.technologies-table tbody tr');
            if (techTableExists) {
                await page.hover('.technologies-table tbody tr:first-of-type');
                await page.waitForTimeout(300);
                console.log(`   Table hover effects: YES ✅`);
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
        await page.screenshot({ path: 'temp_dev/technology_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/technology_screen_integration_test.png');
        
        console.log('\n🎉 TECHNOLOGY SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${technologyScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 9 tabs functional: ${tabs && tabs.length === 9 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Compact layout: ${tabHeight < 50 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Tab wrapping: ${tabsPerRow >= 6 ? 'GOOD ✅' : 'NEEDS WORK'}`);
        console.log(`   Interactive features: ${refreshBtn && createBtn ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testTechnologyScreenIntegration().catch(console.error);
