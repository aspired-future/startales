const playwright = require('playwright');

async function testCitiesScreenIntegration() {
    console.log('🏙️ TESTING CITIES SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO CITIES SCREEN...');
        
        // Navigate to Cities screen
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Cities")');
        await page.waitForTimeout(3000);
        
        // Check if cities screen loaded
        const screenVisible = await page.isVisible('.cities-screen');
        console.log(`   Cities screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (screenVisible) {
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
                const citySelector = await page.isVisible('.city-selector');
                const cityHeader = await page.isVisible('.city-header');
                const cityStats = await page.$$eval('.stat-card', cards => cards.length);
                const detailSections = await page.$$eval('.detail-section', sections => sections.length);
                console.log(`   City selector: ${citySelector ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   City header: ${cityHeader ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   City statistics: ${cityStats} stat cards`);
                console.log(`   Detail sections: ${detailSections} information sections`);
                
                // Test city selection
                const cityOptions = await page.$$eval('.city-select option', options => 
                    options.filter(opt => opt.value).length
                );
                console.log(`   Available cities: ${cityOptions} cities to select from`);
            }
            
            // Test Specializations tab
            await page.click('.view-tabs .tab:has-text("Specializations")');
            await page.waitForTimeout(1000);
            
            const specializationsVisible = await page.isVisible('.specializations-tab');
            console.log(`   Specializations tab: ${specializationsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (specializationsVisible) {
                const specializationCards = await page.$$eval('.specialization-card', cards => cards.length);
                const specMetrics = await page.$$eval('.spec-metric', metrics => metrics.length);
                const requirementTags = await page.$$eval('.requirement-tag', tags => tags.length);
                const benefitTags = await page.$$eval('.benefit-tag', tags => tags.length);
                console.log(`   Specialization cards: ${specializationCards} specializations`);
                console.log(`   Specialization metrics: ${specMetrics} performance indicators`);
                console.log(`   Requirement tags: ${requirementTags} requirements`);
                console.log(`   Benefit tags: ${benefitTags} benefits`);
            }
            
            // Test Infrastructure tab
            await page.click('.view-tabs .tab:has-text("Infrastructure")');
            await page.waitForTimeout(1000);
            
            const infrastructureVisible = await page.isVisible('.infrastructure-tab');
            console.log(`   Infrastructure tab: ${infrastructureVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (infrastructureVisible) {
                const infraSections = await page.$$eval('.infra-section', sections => sections.length);
                const infraItems = await page.$$eval('.infra-item', items => items.length);
                const infraMetrics = await page.$$eval('.infra-metric', metrics => metrics.length);
                console.log(`   Infrastructure sections: ${infraSections} categories`);
                console.log(`   Infrastructure items: ${infraItems} infrastructure types`);
                console.log(`   Infrastructure metrics: ${infraMetrics} performance metrics`);
            }
            
            // Test Analytics tab
            await page.click('.view-tabs .tab:has-text("Analytics")');
            await page.waitForTimeout(1000);
            
            const analyticsVisible = await page.isVisible('.analytics-tab');
            console.log(`   Analytics tab: ${analyticsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (analyticsVisible) {
                const overviewMetrics = await page.$$eval('.overview-metric', metrics => metrics.length);
                const analyticsSections = await page.$$eval('.analytics-section', sections => sections.length);
                const topCityItems = await page.$$eval('.top-city-item', items => items.length);
                const distributionItems = await page.$$eval('.distribution-item', items => items.length);
                const challengeItems = await page.$$eval('.challenge-item', items => items.length);
                console.log(`   Overview metrics: ${overviewMetrics} key statistics`);
                console.log(`   Analytics sections: ${analyticsSections} analysis categories`);
                console.log(`   Top performing cities: ${topCityItems} high-performing cities`);
                console.log(`   Distribution items: ${distributionItems} specialization breakdown`);
                console.log(`   Challenge items: ${challengeItems} identified challenges`);
            }
            
            // Test Comparison tab
            await page.click('.view-tabs .tab:has-text("Comparison")');
            await page.waitForTimeout(1000);
            
            const comparisonVisible = await page.isVisible('.comparison-tab');
            console.log(`   Comparison tab: ${comparisonVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (comparisonVisible) {
                const comparisonSelector = await page.isVisible('.comparison-selector');
                const comparisonPlaceholder = await page.isVisible('.comparison-placeholder');
                const featureItems = await page.$$eval('.feature-item', items => items.length);
                console.log(`   Comparison selector: ${comparisonSelector ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Comparison placeholder: ${comparisonPlaceholder ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Comparison features: ${featureItems} comparison categories`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Overview tab to test layout
            await page.click('.view-tabs .tab:has-text("Overview")');
            await page.waitForTimeout(1000);
            
            // Check green urban planning theme
            const themeColor = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('16, 185, 129') || styles.borderBottomColor.includes('16, 185, 129');
            });
            console.log(`   Green urban planning theme: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
            
            // Test quality metrics visualization
            const qualityBars = await page.$$eval('.quality-bar', bars => bars.length);
            console.log(`   Quality metric bars: ${qualityBars} quality indicators`);
            
            // Test specialization color coding
            const specTypeElements = await page.$$eval('.spec-type', elements => 
                elements.map(el => window.getComputedStyle(el).backgroundColor).filter(bg => 
                    bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
                ).length
            );
            console.log(`   Specialization color coding: ${specTypeElements > 0 ? 'YES ✅' : 'NO ❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Test action buttons
            const actionButtons = await page.$$eval('.action-btn', btns => btns.length);
            console.log(`   Action buttons: ${actionButtons} buttons`);
            
            // Test city selector functionality
            const citySelectOptions = await page.$$eval('.city-select option', options => options.length);
            console.log(`   City selector options: ${citySelectOptions} selection options`);
            
            // Test simulate city button
            const simulateBtn = await page.isVisible('.action-btn:has-text("Simulate Month")');
            console.log(`   Simulate city button: ${simulateBtn ? 'YES ✅' : 'NO ❌'}`);
            
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
            
            console.log('\n6️⃣ TESTING CITIES-SPECIFIC FEATURES...');
            
            // Test city quality scoring
            const qualityScore = await page.isVisible('.quality-score');
            console.log(`   City quality scoring: ${qualityScore ? 'YES ✅' : 'NO ❌'}`);
            
            // Test economic metrics
            const economyMetrics = await page.$$eval('.economy-metric', metrics => metrics.length);
            console.log(`   Economic metrics: ${economyMetrics} economic indicators`);
            
            // Test sector breakdown
            const sectorItems = await page.$$eval('.sector-item', items => items.length);
            console.log(`   Economic sectors: ${sectorItems} sector breakdowns`);
            
            // Test infrastructure categories
            const infraCategories = await page.$$eval('.infra-section h4', headers => headers.length);
            console.log(`   Infrastructure categories: ${infraCategories} infrastructure types`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/cities_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/cities_screen_integration_test.png');
        
        console.log('\n🎉 CITIES SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 5 tabs functional: ${tabs && tabs.length === 5 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Urban planning theme applied: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        console.log(`   Cities-specific features: ${qualityScore && economyMetrics > 0 ? 'YES ✅' : 'PARTIAL'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testCitiesScreenIntegration().catch(console.error);
