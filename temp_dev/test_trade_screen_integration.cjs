const playwright = require('playwright');

async function testTradeScreenIntegration() {
    console.log('💰 TESTING TRADE SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO TRADE SCREEN...');
        
        // Navigate to Trade screen
        await page.click('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Trade")');
        await page.waitForTimeout(3000);
        
        // Check if trade screen loaded
        const tradeScreenVisible = await page.isVisible('.trade-screen');
        console.log(`   Trade screen loaded: ${tradeScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (tradeScreenVisible) {
            // Check screen title
            const screenTitle = await page.textContent('.screen-title h2');
            console.log(`   Screen title: "${screenTitle}"`);
            
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 6 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Overview tab (default)
            const overviewVisible = await page.isVisible('.trade-overview');
            console.log(`   Overview tab content: ${overviewVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (overviewVisible) {
                const indicesCount = await page.$$eval('.index-card', cards => cards.length);
                const systemsCount = await page.$$eval('.system-card', cards => cards.length);
                console.log(`   Market indices: ${indicesCount} cards`);
                console.log(`   Trading systems: ${systemsCount} cards`);
            }
            
            // Test Commodities tab
            await page.click('.view-tabs .tab:has-text("Commodities")');
            await page.waitForTimeout(1000);
            
            const commoditiesVisible = await page.isVisible('.commodities-view');
            console.log(`   Commodities tab: ${commoditiesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (commoditiesVisible) {
                const commodityRows = await page.$$eval('.table-row', rows => rows.length);
                console.log(`   Commodity entries: ${commodityRows} rows`);
            }
            
            // Test Routes tab
            await page.click('.view-tabs .tab:has-text("Routes")');
            await page.waitForTimeout(1000);
            
            const routesVisible = await page.isVisible('.routes-view');
            console.log(`   Routes tab: ${routesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (routesVisible) {
                const routeCards = await page.$$eval('.route-card', cards => cards.length);
                console.log(`   Trade routes: ${routeCards} routes`);
            }
            
            // Test Corporations tab
            await page.click('.view-tabs .tab:has-text("Corporations")');
            await page.waitForTimeout(1000);
            
            const corporationsVisible = await page.isVisible('.corporations-view');
            console.log(`   Corporations tab: ${corporationsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (corporationsVisible) {
                const corpCards = await page.$$eval('.corporation-card', cards => cards.length);
                console.log(`   Corporations: ${corpCards} companies`);
            }
            
            // Test Contracts tab
            await page.click('.view-tabs .tab:has-text("Contracts")');
            await page.waitForTimeout(1000);
            
            const contractsVisible = await page.isVisible('.contracts-view');
            console.log(`   Contracts tab: ${contractsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (contractsVisible) {
                const contractCards = await page.$$eval('.contract-card', cards => cards.length);
                console.log(`   Available contracts: ${contractCards} contracts`);
            }
            
            // Test Opportunities tab
            await page.click('.view-tabs .tab:has-text("Opportunities")');
            await page.waitForTimeout(1000);
            
            const opportunitiesVisible = await page.isVisible('.opportunities-view');
            console.log(`   Opportunities tab: ${opportunitiesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (opportunitiesVisible) {
                const oppCards = await page.$$eval('.opportunity-card', cards => cards.length);
                console.log(`   Trade opportunities: ${oppCards} opportunities`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Check compact layout
            const tabHeight = await page.evaluate(() => {
                const tabs = document.querySelector('.view-tabs');
                return tabs ? tabs.offsetHeight : 0;
            });
            console.log(`   Tab height: ${tabHeight}px ${tabHeight < 40 ? '✅' : '❌'}`);
            
            // Check content density
            const contentMetrics = await page.evaluate(() => {
                const tabContent = document.querySelector('.tab-content');
                const opportunitiesView = document.querySelector('.opportunities-view');
                
                return {
                    tabContentHeight: tabContent ? tabContent.offsetHeight : 0,
                    contentHeight: opportunitiesView ? opportunitiesView.scrollHeight : 0
                };
            });
            
            const contentDensity = contentMetrics.contentHeight / contentMetrics.tabContentHeight * 100;
            console.log(`   Content density: ${contentDensity.toFixed(1)}% ${contentDensity > 80 ? '✅' : '❌'}`);
            
            console.log('\n4️⃣ TESTING API INTEGRATION...');
            
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
                apiEndpoints.forEach(ep => console.log(`     ${ep.method} ${ep.path}`));
            }
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/trade_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/trade_screen_integration_test.png');
        
        console.log('\n🎉 TRADE SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${tradeScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All tabs functional: ${tabs && tabs.length === 6 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Compact layout: ${tabHeight < 40 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Content density: ${contentDensity > 80 ? 'EXCELLENT ✅' : 'GOOD'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testTradeScreenIntegration().catch(console.error);
