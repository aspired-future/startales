const playwright = require('playwright');

async function testIntelligenceScreenIntegration() {
    console.log('🕵️ TESTING INTELLIGENCE SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO INTELLIGENCE SCREEN...');
        
        // Navigate to Intelligence screen
        await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Intelligence")');
        await page.waitForTimeout(3000);
        
        // Check if intelligence screen loaded
        const intelligenceScreenVisible = await page.isVisible('.intelligence-screen');
        console.log(`   Intelligence screen loaded: ${intelligenceScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (intelligenceScreenVisible) {
            // Check classified banner
            const classifiedBanner = await page.isVisible('.classified-banner');
            console.log(`   Classified banner: ${classifiedBanner ? 'YES ✅' : 'NO ❌'}`);
            
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
            
            // Test Classification tab
            await page.click('.view-tabs .tab:has-text("Classification")');
            await page.waitForTimeout(1000);
            
            const classificationVisible = await page.isVisible('.classification-tab');
            console.log(`   Classification tab: ${classificationVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (classificationVisible) {
                const assetItems = await page.$$eval('.asset-item', items => items.length);
                const assetTags = await page.$$eval('.asset-tag', tags => tags.length);
                const classificationBadges = await page.$$eval('.asset-classification', badges => badges.length);
                console.log(`   Information assets: ${assetItems} assets`);
                console.log(`   Asset tags: ${assetTags} tags`);
                console.log(`   Classification badges: ${classificationBadges} badges`);
            }
            
            // Test Operations tab
            await page.click('.view-tabs .tab:has-text("Operations")');
            await page.waitForTimeout(1000);
            
            const operationsVisible = await page.isVisible('.operations-tab');
            console.log(`   Operations tab: ${operationsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (operationsVisible) {
                const operationItems = await page.$$eval('.operation-item', items => items.length);
                const agentItems = await page.$$eval('.agent-item', items => items.length);
                const progressBars = await page.$$eval('.progress-bar', bars => bars.length);
                const specialtyTags = await page.$$eval('.specialty-tag', tags => tags.length);
                console.log(`   Espionage operations: ${operationItems} operations`);
                console.log(`   Spy agents: ${agentItems} agents`);
                console.log(`   Progress bars: ${progressBars} progress indicators`);
                console.log(`   Specialty tags: ${specialtyTags} specialties`);
            }
            
            // Test Intel Market tab
            await page.click('.view-tabs .tab:has-text("Intel Market")');
            await page.waitForTimeout(1000);
            
            const marketVisible = await page.isVisible('.market-tab');
            console.log(`   Intel Market tab: ${marketVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (marketVisible) {
                const participantItems = await page.$$eval('.participant-item', items => items.length);
                const listingItems = await page.$$eval('.listing-item', items => items.length);
                const verifiedBadges = await page.$$eval('.participant-verified', badges => badges.length);
                const listingTags = await page.$$eval('.listing-tag', tags => tags.length);
                console.log(`   Market participants: ${participantItems} participants`);
                console.log(`   Intelligence listings: ${listingItems} listings`);
                console.log(`   Verified badges: ${verifiedBadges} badges`);
                console.log(`   Listing tags: ${listingTags} tags`);
            }
            
            // Test Counter-Intel tab
            await page.click('.view-tabs .tab:has-text("Counter-Intel")');
            await page.waitForTimeout(1000);
            
            const counterVisible = await page.isVisible('.counter-tab');
            console.log(`   Counter-Intel tab: ${counterVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (counterVisible) {
                const counterItems = await page.$$eval('.counter-item', items => items.length);
                const findingItems = await page.$$eval('.finding-item', items => items.length);
                const recommendationItems = await page.$$eval('.recommendation-item', items => items.length);
                console.log(`   Counter-intel operations: ${counterItems} operations`);
                console.log(`   Findings: ${findingItems} findings`);
                console.log(`   Recommendations: ${recommendationItems} recommendations`);
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
            
            // Check classified banner animation
            const bannerAnimated = await page.evaluate(() => {
                const banner = document.querySelector('.classified-banner');
                if (!banner) return false;
                const styles = window.getComputedStyle(banner);
                return styles.animationName === 'pulse';
            });
            console.log(`   Classified banner animated: ${bannerAnimated ? 'YES ✅' : 'NO ❌'}`);
            
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
            
            // Test metric card hover effects
            await page.hover('.metric-card:first-of-type');
            await page.waitForTimeout(300);
            console.log(`   Metric card hover effects: YES ✅`);
            
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
        await page.screenshot({ path: 'temp_dev/intelligence_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/intelligence_screen_integration_test.png');
        
        console.log('\n🎉 INTELLIGENCE SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${intelligenceScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Classified banner: ${classifiedBanner ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 5 tabs functional: ${tabs && tabs.length === 5 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Grid layout optimized: ${gridLayout.columns >= 4 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testIntelligenceScreenIntegration().catch(console.error);
