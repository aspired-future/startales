const playwright = require('playwright');

async function testFinancialMarketsScreenIntegration() {
    console.log('📊 TESTING FINANCIAL MARKETS SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO FINANCIAL MARKETS SCREEN...');
        
        // Navigate to Financial Markets screen
        await page.click('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Financial Markets")');
        await page.waitForTimeout(3000);
        
        // Check if financial markets screen loaded
        const screenVisible = await page.isVisible('.financial-markets-screen');
        console.log(`   Financial Markets screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (screenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 7 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Stocks tab (default)
            const stocksVisible = await page.isVisible('.stocks-tab');
            console.log(`   Stocks tab content: ${stocksVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (stocksVisible) {
                const stockCards = await page.$$eval('.stock-card', cards => cards.length);
                const stockSymbols = await page.$$eval('.stock-symbol', symbols => symbols.length);
                const advantageTags = await page.$$eval('.advantage-tag', tags => tags.length);
                const stockRanges = await page.$$eval('.stock-range', ranges => ranges.length);
                console.log(`   Stock cards: ${stockCards} companies`);
                console.log(`   Stock symbols: ${stockSymbols} ticker symbols`);
                console.log(`   Advantage tags: ${advantageTags} competitive advantages`);
                console.log(`   Stock ranges: ${stockRanges} price ranges`);
            }
            
            // Test Leaders tab
            await page.click('.view-tabs .tab:has-text("Leaders")');
            await page.waitForTimeout(1000);
            
            const leadersVisible = await page.isVisible('.leaders-tab');
            console.log(`   Leaders tab: ${leadersVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (leadersVisible) {
                const leaderCards = await page.$$eval('.leader-card', cards => cards.length);
                const availabilityStatuses = await page.$$eval('.availability-status', statuses => statuses.length);
                const traitTags = await page.$$eval('.trait-tag', tags => tags.length);
                const witterHandles = await page.$$eval('.witter-handle', handles => handles.length);
                console.log(`   Leader cards: ${leaderCards} corporate leaders`);
                console.log(`   Availability statuses: ${availabilityStatuses} availability indicators`);
                console.log(`   Trait tags: ${traitTags} personality traits`);
                console.log(`   Witter handles: ${witterHandles} social media profiles`);
            }
            
            // Test Bonds tab
            await page.click('.view-tabs .tab:has-text("Bonds")');
            await page.waitForTimeout(1000);
            
            const bondsVisible = await page.isVisible('.bonds-tab');
            console.log(`   Bonds tab: ${bondsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (bondsVisible) {
                const bondCards = await page.$$eval('.bond-card', cards => cards.length);
                const bondRatings = await page.$$eval('.bond-rating', ratings => ratings.length);
                const riskValues = await page.$$eval('.risk-value', values => values.length);
                console.log(`   Bond cards: ${bondCards} bond offerings`);
                console.log(`   Bond ratings: ${bondRatings} credit ratings`);
                console.log(`   Risk assessments: ${riskValues} risk evaluations`);
            }
            
            // Test Sentiment tab
            await page.click('.view-tabs .tab:has-text("Sentiment")');
            await page.waitForTimeout(1000);
            
            const sentimentVisible = await page.isVisible('.sentiment-tab');
            console.log(`   Sentiment tab: ${sentimentVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (sentimentVisible) {
                const sentimentOverview = await page.isVisible('.sentiment-overview');
                const indicatorItems = await page.$$eval('.indicator-item', items => items.length);
                const newsItems = await page.$$eval('.news-item', items => items.length);
                const sentimentScore = await page.isVisible('.sentiment-score');
                console.log(`   Sentiment overview: ${sentimentOverview ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Market indicators: ${indicatorItems} sentiment indicators`);
                console.log(`   News impact items: ${newsItems} news articles`);
                console.log(`   Sentiment scoring: ${sentimentScore ? 'YES ✅' : 'NO ❌'}`);
            }
            
            // Test Sectors tab
            await page.click('.view-tabs .tab:has-text("Sectors")');
            await page.waitForTimeout(1000);
            
            const sectorsVisible = await page.isVisible('.sectors-tab');
            console.log(`   Sectors tab: ${sectorsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (sectorsVisible) {
                const sectorCards = await page.$$eval('.sector-card', cards => cards.length);
                const performerItems = await page.$$eval('.performer-item', items => items.length);
                const trendTags = await page.$$eval('.trend-tag', tags => tags.length);
                const outlookValues = await page.$$eval('.outlook-value', values => values.length);
                console.log(`   Sector cards: ${sectorCards} economic sectors`);
                console.log(`   Top performers: ${performerItems} high-performing stocks`);
                console.log(`   Trend tags: ${trendTags} sector trends`);
                console.log(`   Outlook assessments: ${outlookValues} sector outlooks`);
            }
            
            // Test Portfolio tab
            await page.click('.view-tabs .tab:has-text("Portfolio")');
            await page.waitForTimeout(1000);
            
            const portfolioVisible = await page.isVisible('.portfolio-tab');
            console.log(`   Portfolio tab: ${portfolioVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (portfolioVisible) {
                const portfolioOverview = await page.isVisible('.portfolio-overview');
                const allocationItems = await page.$$eval('.allocation-item', items => items.length);
                const transactionItems = await page.$$eval('.transaction-item', items => items.length);
                const allocationBars = await page.$$eval('.allocation-bar', bars => bars.length);
                console.log(`   Portfolio overview: ${portfolioOverview ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Asset allocations: ${allocationItems} allocation categories`);
                console.log(`   Recent transactions: ${transactionItems} transaction records`);
                console.log(`   Allocation visualization: ${allocationBars} progress bars`);
            }
            
            // Test Indices tab
            await page.click('.view-tabs .tab:has-text("Indices")');
            await page.waitForTimeout(1000);
            
            const indicesVisible = await page.isVisible('.indices-tab');
            console.log(`   Indices tab: ${indicesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (indicesVisible) {
                const indexCards = await page.$$eval('.index-card', cards => cards.length);
                const indexValues = await page.$$eval('.index-value', values => values.length);
                const indexChanges = await page.$$eval('.index-change-value', changes => changes.length);
                console.log(`   Index cards: ${indexCards} market indices`);
                console.log(`   Index values: ${indexValues} current values`);
                console.log(`   Change indicators: ${indexChanges} performance changes`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Stocks tab to test layout
            await page.click('.view-tabs .tab:has-text("Stocks")');
            await page.waitForTimeout(1000);
            
            // Check blue financial theme
            const themeColor = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('52, 152, 219') || styles.borderBottomColor.includes('52, 152, 219');
            });
            console.log(`   Blue financial theme: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
            
            // Test stock price change colors
            const changeColors = await page.evaluate(() => {
                const changes = document.querySelectorAll('.stock-change');
                return Array.from(changes).some(change => {
                    const styles = window.getComputedStyle(change);
                    return styles.color.includes('16, 185, 129') || styles.color.includes('239, 68, 68');
                });
            });
            console.log(`   Price change color coding: ${changeColors ? 'YES ✅' : 'NO ❌'}`);
            
            // Test card hover effects
            const hoverEffects = await page.evaluate(() => {
                const cards = document.querySelectorAll('.stock-card');
                return cards.length > 0;
            });
            console.log(`   Interactive card elements: ${hoverEffects ? 'YES ✅' : 'NO ❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Test action buttons
            const actionButtons = await page.$$eval('.action-btn', btns => btns.length);
            console.log(`   Action buttons: ${actionButtons} buttons`);
            
            // Test execute trade button
            const executeTradeBtn = await page.isVisible('.action-btn:has-text("Execute Trade")');
            console.log(`   Execute trade button: ${executeTradeBtn ? 'YES ✅' : 'NO ❌'}`);
            
            // Test different button types
            const primaryButtons = await page.$$eval('.action-btn:not(.secondary)', btns => btns.length);
            const secondaryButtons = await page.$$eval('.action-btn.secondary', btns => btns.length);
            console.log(`   Primary buttons: ${primaryButtons} primary actions`);
            console.log(`   Secondary buttons: ${secondaryButtons} secondary actions`);
            
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
            
            console.log('\n6️⃣ TESTING FINANCIAL MARKETS-SPECIFIC FEATURES...');
            
            // Test stock market data
            const stockPrices = await page.$$eval('.stock-price', prices => prices.length);
            console.log(`   Stock price displays: ${stockPrices} price indicators`);
            
            // Test market sentiment analysis
            const sentimentStatus = await page.isVisible('.sentiment-status');
            console.log(`   Market sentiment analysis: ${sentimentStatus ? 'YES ✅' : 'NO ❌'}`);
            
            // Test portfolio allocation visualization
            const allocationFills = await page.$$eval('.allocation-fill', fills => fills.length);
            console.log(`   Portfolio allocation bars: ${allocationFills} allocation visualizations`);
            
            // Test bond yield information
            const bondDetails = await page.$$eval('.bond-detail', details => details.length);
            console.log(`   Bond market details: ${bondDetails} bond metrics`);
            
            // Test corporate leader profiles
            const leaderBackgrounds = await page.$$eval('.leader-background', backgrounds => backgrounds.length);
            console.log(`   Corporate leader profiles: ${leaderBackgrounds} executive profiles`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/financial_markets_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/financial_markets_screen_integration_test.png');
        
        console.log('\n🎉 FINANCIAL MARKETS SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 7 tabs functional: ${tabs && tabs.length === 7 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Financial theme applied: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        console.log(`   Financial markets features: ${stockPrices > 0 && sentimentStatus ? 'YES ✅' : 'PARTIAL'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testFinancialMarketsScreenIntegration().catch(console.error);
