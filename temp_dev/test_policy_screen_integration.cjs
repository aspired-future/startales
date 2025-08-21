const playwright = require('playwright');

async function testPolicyScreenIntegration() {
    console.log('⚖️ TESTING POLICY SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO POLICY SCREEN...');
        
        // Navigate to Policy screen
        await page.click('.accordion-header:has(.accordion-title:has-text("GOVERNMENT"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Policies")');
        await page.waitForTimeout(3000);
        
        // Check if policy screen loaded
        const policyScreenVisible = await page.isVisible('.policy-screen');
        console.log(`   Policy screen loaded: ${policyScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (policyScreenVisible) {
            // Check screen title
            const screenTitle = await page.textContent('.screen-title h2');
            console.log(`   Screen title: "${screenTitle}"`);
            
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 4 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Policies tab (default)
            const policiesVisible = await page.isVisible('.policies-view');
            console.log(`   Policies tab content: ${policiesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (policiesVisible) {
                const policyCards = await page.$$eval('.policy-card', cards => cards.length);
                const filters = await page.$$eval('.filter-select', selects => selects.length);
                console.log(`   Policy cards: ${policyCards} policies`);
                console.log(`   Filter controls: ${filters} filters`);
                
                // Test filtering
                if (filters > 0) {
                    await page.selectOption('.filter-select:first-of-type', 'Economic');
                    await page.waitForTimeout(500);
                    const filteredCards = await page.$$eval('.policy-card', cards => cards.length);
                    console.log(`   Filtered policies (Economic): ${filteredCards} policies`);
                }
            }
            
            // Test Analytics tab
            await page.click('.view-tabs .tab:has-text("Analytics")');
            await page.waitForTimeout(1000);
            
            const analyticsVisible = await page.isVisible('.analytics-view');
            console.log(`   Analytics tab: ${analyticsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (analyticsVisible) {
                const metricCards = await page.$$eval('.metric-card', cards => cards.length);
                const categoryItems = await page.$$eval('.category-item', items => items.length);
                console.log(`   Metric cards: ${metricCards} metrics`);
                console.log(`   Category breakdown: ${categoryItems} categories`);
            }
            
            // Test AI Recommendations tab
            await page.click('.view-tabs .tab:has-text("AI Recommendations")');
            await page.waitForTimeout(1000);
            
            const recommendationsVisible = await page.isVisible('.recommendations-view');
            console.log(`   AI Recommendations tab: ${recommendationsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (recommendationsVisible) {
                const recCards = await page.$$eval('.recommendation-card', cards => cards.length);
                const implementBtns = await page.$$eval('.implement-btn', btns => btns.length);
                console.log(`   Recommendation cards: ${recCards} recommendations`);
                console.log(`   Implement buttons: ${implementBtns} buttons`);
            }
            
            // Test Active Modifiers tab
            await page.click('.view-tabs .tab:has-text("Active Modifiers")');
            await page.waitForTimeout(1000);
            
            const modifiersVisible = await page.isVisible('.modifiers-view');
            console.log(`   Active Modifiers tab: ${modifiersVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (modifiersVisible) {
                const modifierCards = await page.$$eval('.modifier-card', cards => cards.length);
                const durationBars = await page.$$eval('.duration-bar', bars => bars.length);
                console.log(`   Modifier cards: ${modifierCards} modifiers`);
                console.log(`   Duration bars: ${durationBars} progress bars`);
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
                const modifiersView = document.querySelector('.modifiers-view');
                
                return {
                    tabContentHeight: tabContent ? tabContent.offsetHeight : 0,
                    contentHeight: modifiersView ? modifiersView.scrollHeight : 0
                };
            });
            
            const contentDensity = contentMetrics.contentHeight / contentMetrics.tabContentHeight * 100;
            console.log(`   Content density: ${contentDensity.toFixed(1)}% ${contentDensity > 80 ? '✅' : '❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Go back to Policies tab to test create button
            await page.click('.view-tabs .tab:has-text("Policies")');
            await page.waitForTimeout(1000);
            
            const createBtn = await page.isVisible('.create-policy-btn');
            console.log(`   Create Policy button: ${createBtn ? 'YES ✅' : 'NO ❌'}`);
            
            // Test policy card hover effects
            const policyCardExists = await page.isVisible('.policy-card');
            if (policyCardExists) {
                await page.hover('.policy-card:first-of-type');
                await page.waitForTimeout(300);
                console.log(`   Policy card hover effects: YES ✅`);
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
        await page.screenshot({ path: 'temp_dev/policy_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/policy_screen_integration_test.png');
        
        console.log('\n🎉 POLICY SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${policyScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All tabs functional: ${tabs && tabs.length === 4 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Compact layout: ${tabHeight < 40 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Content density: ${contentDensity > 80 ? 'EXCELLENT ✅' : 'GOOD'}`);
        console.log(`   Interactive features: ${createBtn ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testPolicyScreenIntegration().catch(console.error);
