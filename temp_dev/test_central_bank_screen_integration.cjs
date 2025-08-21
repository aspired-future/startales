const playwright = require('playwright');

async function testCentralBankScreenIntegration() {
    console.log('🏦 TESTING CENTRAL BANK SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO CENTRAL BANK SCREEN...');
        
        // Navigate to Central Bank screen
        await page.click('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Central Banking")');
        await page.waitForTimeout(3000);
        
        // Check if central bank screen loaded
        const screenVisible = await page.isVisible('.central-bank-screen');
        console.log(`   Central Bank screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (screenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 7 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Overview tab (default)
            const overviewVisible = await page.isVisible('.overview-tab');
            console.log(`   Overview tab content: ${overviewVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (overviewVisible) {
                const metricCards = await page.$$eval('.metric-card', cards => cards.length);
                const progressBars = await page.$$eval('.progress-bar', bars => bars.length);
                const detailSections = await page.$$eval('.detail-section', sections => sections.length);
                const mandateItems = await page.$$eval('.mandate-item', items => items.length);
                console.log(`   Metric cards: ${metricCards} key metrics`);
                console.log(`   Progress bars: ${progressBars} progress indicators`);
                console.log(`   Detail sections: ${detailSections} information sections`);
                console.log(`   Mandate items: ${mandateItems} central bank mandates`);
            }
            
            // Test Policy Recommendations tab
            await page.click('.view-tabs .tab:has-text("Policy")');
            await page.waitForTimeout(1000);
            
            const recommendationsVisible = await page.isVisible('.recommendations-tab');
            console.log(`   Policy Recommendations tab: ${recommendationsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (recommendationsVisible) {
                const pendingCount = await page.isVisible('.pending-count');
                const recommendationCards = await page.$$eval('.recommendation-card', cards => cards.length);
                const statusIndicators = await page.$$eval('.status-indicator', indicators => indicators.length);
                const recPriorities = await page.$$eval('.rec-priority', priorities => priorities.length);
                console.log(`   Pending count display: ${pendingCount ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Recommendation cards: ${recommendationCards} policy recommendations`);
                console.log(`   Status indicators: ${statusIndicators} status markers`);
                console.log(`   Priority indicators: ${recPriorities} priority levels`);
            }
            
            // Test Financial Stability tab
            await page.click('.view-tabs .tab:has-text("Stability")');
            await page.waitForTimeout(1000);
            
            const stabilityVisible = await page.isVisible('.stability-tab');
            console.log(`   Financial Stability tab: ${stabilityVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (stabilityVisible) {
                const stabilityScore = await page.isVisible('.stability-score');
                const stabilitySections = await page.$$eval('.stability-section', sections => sections.length);
                const metricItems = await page.$$eval('.metric-item', items => items.length);
                const warningsSection = await page.isVisible('.warnings-section');
                console.log(`   Stability scoring: ${stabilityScore ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Stability sections: ${stabilitySections} analysis categories`);
                console.log(`   Metric items: ${metricItems} stability metrics`);
                console.log(`   Warnings section: ${warningsSection ? 'YES ✅' : 'NO ❌'}`);
            }
            
            // Test Policy Settings tab
            await page.click('.view-tabs .tab:has-text("Settings")');
            await page.waitForTimeout(1000);
            
            const settingsVisible = await page.isVisible('.settings-tab');
            console.log(`   Policy Settings tab: ${settingsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (settingsVisible) {
                const settingsSections = await page.$$eval('.settings-section', sections => sections.length);
                const settingItems = await page.$$eval('.setting-item', items => items.length);
                const guidanceContent = await page.isVisible('.guidance-content');
                console.log(`   Settings sections: ${settingsSections} policy categories`);
                console.log(`   Setting items: ${settingItems} policy parameters`);
                console.log(`   Forward guidance: ${guidanceContent ? 'YES ✅' : 'NO ❌'}`);
            }
            
            // Test Economic Research tab
            await page.click('.view-tabs .tab:has-text("Research")');
            await page.waitForTimeout(1000);
            
            const researchVisible = await page.isVisible('.research-tab');
            console.log(`   Economic Research tab: ${researchVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (researchVisible) {
                const projectCards = await page.$$eval('.project-card', cards => cards.length);
                const publicationItems = await page.$$eval('.publication-item', items => items.length);
                const analysisItems = await page.$$eval('.analysis-item', items => items.length);
                const forecastItems = await page.$$eval('.forecast-item', items => items.length);
                console.log(`   Research projects: ${projectCards} active projects`);
                console.log(`   Publications: ${publicationItems} recent publications`);
                console.log(`   Analysis sections: ${analysisItems} data analysis areas`);
                console.log(`   Forecast items: ${forecastItems} economic forecasts`);
            }
            
            // Test Crisis Management tab
            await page.click('.view-tabs .tab:has-text("Crisis")');
            await page.waitForTimeout(1000);
            
            const crisisVisible = await page.isVisible('.crisis-tab');
            console.log(`   Crisis Management tab: ${crisisVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (crisisVisible) {
                const threatLevel = await page.isVisible('.threat-level');
                const noCrises = await page.isVisible('.no-crises');
                const contingencyPlans = await page.isVisible('.contingency-plans');
                const emergencyTools = await page.isVisible('.emergency-tools');
                const toolItems = await page.$$eval('.tool-item', items => items.length);
                console.log(`   Threat level display: ${threatLevel ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   No active crises: ${noCrises ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Contingency plans: ${contingencyPlans ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Emergency tools: ${emergencyTools ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Available tools: ${toolItems} emergency tools`);
            }
            
            // Test Central Bank Authority tab
            await page.click('.view-tabs .tab:has-text("Authority")');
            await page.waitForTimeout(1000);
            
            const authorityVisible = await page.isVisible('.authority-tab');
            console.log(`   Central Bank Authority tab: ${authorityVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (authorityVisible) {
                const independenceMetrics = await page.isVisible('.independence-metrics');
                const politicalPressure = await page.isVisible('.political-pressure');
                const communicationMetrics = await page.isVisible('.communication-metrics');
                const governorProfile = await page.isVisible('.governor-profile');
                const metricBars = await page.$$eval('.metric-bar', bars => bars.length);
                console.log(`   Independence metrics: ${independenceMetrics ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Political pressure tracking: ${politicalPressure ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Communication metrics: ${communicationMetrics ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Governor profile: ${governorProfile ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Metric visualization bars: ${metricBars} progress bars`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Overview tab to test layout
            await page.click('.view-tabs .tab:has-text("Overview")');
            await page.waitForTimeout(1000);
            
            // Check gold central banking theme
            const themeColor = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('255, 215, 0') || styles.borderBottomColor.includes('255, 215, 0');
            });
            console.log(`   Gold central banking theme: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
            
            // Test independence score visualization
            const independenceCard = await page.isVisible('.metric-card.independence');
            console.log(`   Independence score card: ${independenceCard ? 'YES ✅' : 'NO ❌'}`);
            
            // Test policy stance color coding
            const policyStance = await page.isVisible('.stance');
            console.log(`   Policy stance indicator: ${policyStance ? 'YES ✅' : 'NO ❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Test action buttons
            const actionButtons = await page.$$eval('.action-btn', btns => btns.length);
            console.log(`   Action buttons: ${actionButtons} buttons`);
            
            // Test run assessment button
            const runAssessmentBtn = await page.isVisible('.action-btn:has-text("Run Assessment")');
            console.log(`   Run assessment button: ${runAssessmentBtn ? 'YES ✅' : 'NO ❌'}`);
            
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
            
            console.log('\n6️⃣ TESTING CENTRAL BANKING-SPECIFIC FEATURES...');
            
            // Test monetary policy metrics
            const policyRate = await page.isVisible('.metric-value');
            console.log(`   Policy rate display: ${policyRate ? 'YES ✅' : 'NO ❌'}`);
            
            // Test financial stability scoring
            const stabilityScoring = await page.isVisible('.score-value');
            console.log(`   Financial stability scoring: ${stabilityScoring ? 'YES ✅' : 'NO ❌'}`);
            
            // Test independence measurement
            const independenceScoring = await page.evaluate(() => {
                const scoreElement = document.querySelector('.metric-card.independence .metric-value');
                return scoreElement && scoreElement.textContent.includes('/100');
            });
            console.log(`   Independence measurement: ${independenceScoring ? 'YES ✅' : 'NO ❌'}`);
            
            // Test crisis management tools
            const crisisTools = await page.$$eval('.tool-status', statuses => statuses.length);
            console.log(`   Crisis management tools: ${crisisTools} emergency tools`);
            
            // Test governor profile information
            const profileItems = await page.$$eval('.profile-item', items => items.length);
            console.log(`   Governor profile details: ${profileItems} profile attributes`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/central_bank_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/central_bank_screen_integration_test.png');
        
        console.log('\n🎉 CENTRAL BANK SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 7 tabs functional: ${tabs && tabs.length === 7 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Gold banking theme applied: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        console.log(`   Central banking features: ${policyRate && independenceScoring ? 'YES ✅' : 'PARTIAL'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testCentralBankScreenIntegration().catch(console.error);
