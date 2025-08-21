const playwright = require('playwright');

async function testNewsScreenIntegration() {
    console.log('📰 TESTING NEWS SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO NEWS SCREEN...');
        
        // Navigate to News screen
        await page.click('.accordion-header:has(.accordion-title:has-text("COMMUNICATIONS"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("News")');
        await page.waitForTimeout(3000);
        
        // Check if news screen loaded
        const screenVisible = await page.isVisible('.news-screen');
        console.log(`   News screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (screenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 4 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Generation tab (default)
            const generationVisible = await page.isVisible('.generation-tab');
            console.log(`   Generation tab content: ${generationVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (generationVisible) {
                const formControls = await page.$$eval('.form-control', controls => controls.length);
                const checkboxes = await page.$$eval('.checkbox-item', items => items.length);
                const articleItems = await page.$$eval('.article-item', items => items.length);
                console.log(`   Form controls: ${formControls} input fields`);
                console.log(`   Checkbox options: ${checkboxes} scope/category options`);
                console.log(`   Recent articles: ${articleItems} news articles`);
            }
            
            // Test Outlets tab
            await page.click('.view-tabs .tab:has-text("Outlets")');
            await page.waitForTimeout(1000);
            
            const outletsVisible = await page.isVisible('.outlets-tab');
            console.log(`   Outlets tab: ${outletsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (outletsVisible) {
                const outletItems = await page.$$eval('.outlet-item', items => items.length);
                const metricItems = await page.$$eval('.metric-item', items => items.length);
                const specialtyTags = await page.$$eval('.specialty-tag', tags => tags.length);
                console.log(`   News outlets: ${outletItems} media organizations`);
                console.log(`   Outlet metrics: ${metricItems} performance indicators`);
                console.log(`   Specialty tags: ${specialtyTags} specialization areas`);
            }
            
            // Test Analytics tab
            await page.click('.view-tabs .tab:has-text("Analytics")');
            await page.waitForTimeout(1000);
            
            const analyticsVisible = await page.isVisible('.analytics-tab');
            console.log(`   Analytics tab: ${analyticsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (analyticsVisible) {
                const overviewMetrics = await page.$$eval('.overview-metric', metrics => metrics.length);
                const distributionCards = await page.$$eval('.distribution-card', cards => cards.length);
                const distributionItems = await page.$$eval('.distribution-item', items => items.length);
                const performanceItems = await page.$$eval('.performance-item', items => items.length);
                console.log(`   Overview metrics: ${overviewMetrics} key statistics`);
                console.log(`   Distribution cards: ${distributionCards} analysis categories`);
                console.log(`   Distribution items: ${distributionItems} breakdown items`);
                console.log(`   Top performing articles: ${performanceItems} high-engagement articles`);
            }
            
            // Test Trending tab
            await page.click('.view-tabs .tab:has-text("Trending")');
            await page.waitForTimeout(1000);
            
            const trendingVisible = await page.isVisible('.trending-tab');
            console.log(`   Trending tab: ${trendingVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (trendingVisible) {
                const trendingItems = await page.$$eval('.trending-item', items => items.length);
                const phraseTags = await page.$$eval('.phrase-tag', tags => tags.length);
                const regionTags = await page.$$eval('.region-tag', tags => tags.length);
                const influencerItems = await page.$$eval('.influencer-item', items => items.length);
                console.log(`   Trending topics: ${trendingItems} hot topics`);
                console.log(`   Key phrases: ${phraseTags} trending phrases`);
                console.log(`   Geographic regions: ${regionTags} affected areas`);
                console.log(`   Top influencers: ${influencerItems} key opinion leaders`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Generation tab to test layout
            await page.click('.view-tabs .tab:has-text("Generation")');
            await page.waitForTimeout(1000);
            
            // Check blue news/media theme
            const themeColor = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('59, 130, 246') || styles.borderBottomColor.includes('59, 130, 246');
            });
            console.log(`   Blue news/media theme: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
            
            // Test article engagement metrics
            const engagementItems = await page.$$eval('.engagement-item', items => items.length);
            console.log(`   Article engagement metrics: ${engagementItems} engagement indicators`);
            
            // Test bias color coding
            const biasElements = await page.$$eval('.article-bias', elements => 
                elements.map(el => window.getComputedStyle(el).color).filter(color => 
                    color.includes('59, 130, 246') || color.includes('239, 68, 68') || color.includes('16, 185, 129')
                ).length
            );
            console.log(`   Bias color coding: ${biasElements > 0 ? 'YES ✅' : 'NO ❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Test action buttons
            const actionButtons = await page.$$eval('.action-btn', btns => btns.length);
            console.log(`   Action buttons: ${actionButtons} buttons`);
            
            // Test form controls and checkboxes
            const formInputs = await page.$$eval('.form-control', inputs => inputs.length);
            const checkboxInputs = await page.$$eval('input[type="checkbox"]', inputs => inputs.length);
            console.log(`   Form controls: ${formInputs} input fields`);
            console.log(`   Checkbox controls: ${checkboxInputs} selection options`);
            
            // Test generation form functionality
            const generateBtn = await page.isVisible('.action-btn:has-text("Generate Articles")');
            console.log(`   Generate articles button: ${generateBtn ? 'YES ✅' : 'NO ❌'}`);
            
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
            
            console.log('\n6️⃣ TESTING NEWS-SPECIFIC FEATURES...');
            
            // Test category color coding
            const categoryElements = await page.$$eval('.article-category', elements => 
                elements.map(el => window.getComputedStyle(el).backgroundColor).filter(bg => 
                    bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
                ).length
            );
            console.log(`   Category color coding: ${categoryElements > 0 ? 'YES ✅' : 'NO ❌'}`);
            
            // Test sentiment indicators
            const sentimentElements = await page.$$eval('.trending-sentiment', elements => elements.length);
            console.log(`   Sentiment indicators: ${sentimentElements} sentiment markers`);
            
            // Test credibility scores
            const credibilityScores = await page.$$eval('.engagement-value', elements => 
                elements.filter(el => el.textContent.includes('%')).length
            );
            console.log(`   Credibility scores: ${credibilityScores > 0 ? 'YES ✅' : 'NO ❌'}`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/news_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/news_screen_integration_test.png');
        
        console.log('\n🎉 NEWS SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 4 tabs functional: ${tabs && tabs.length === 4 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   News/media theme applied: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        console.log(`   News-specific features: ${categoryElements > 0 && sentimentElements > 0 ? 'YES ✅' : 'PARTIAL'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testNewsScreenIntegration().catch(console.error);
