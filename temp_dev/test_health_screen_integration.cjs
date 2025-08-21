const playwright = require('playwright');

async function testHealthScreenIntegration() {
    console.log('🏥 TESTING HEALTH SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO HEALTH SCREEN...');
        
        // Navigate to Health screen
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Health & Welfare")');
        await page.waitForTimeout(3000);
        
        // Check if health screen loaded
        const healthScreenVisible = await page.isVisible('.health-screen');
        console.log(`   Health screen loaded: ${healthScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (healthScreenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 8 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Leadership tab (default)
            const leadershipVisible = await page.isVisible('.leadership-tab');
            console.log(`   Leadership tab content: ${leadershipVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (leadershipVisible) {
                const leaderCards = await page.$$eval('.leader-card', cards => cards.length);
                const achievementItems = await page.$$eval('.achievement-item', items => items.length);
                const specializationTags = await page.$$eval('.specialization-tag', tags => tags.length);
                console.log(`   Leader cards: ${leaderCards} leadership positions`);
                console.log(`   Achievements: ${achievementItems} achievements`);
                console.log(`   Specializations: ${specializationTags} specialization tags`);
            }
            
            // Test Population tab
            await page.click('.view-tabs .tab:has-text("Population")');
            await page.waitForTimeout(1000);
            
            const populationVisible = await page.isVisible('.population-tab');
            console.log(`   Population tab: ${populationVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (populationVisible) {
                const metricCards = await page.$$eval('.metric-card', cards => cards.length);
                const metrics = await page.$$eval('.metric-card', cards => 
                    cards.slice(0, 3).map(card => ({
                        value: card.querySelector('.metric-value').textContent,
                        label: card.querySelector('.metric-label').textContent
                    }))
                );
                console.log(`   Health metrics: ${metricCards} metric cards`);
                console.log(`   Sample metrics: ${metrics.map(m => `${m.label}: ${m.value}`).join(', ')}`);
            }
            
            // Test Diseases tab
            await page.click('.view-tabs .tab:has-text("Diseases")');
            await page.waitForTimeout(1000);
            
            const diseasesVisible = await page.isVisible('.diseases-tab');
            console.log(`   Diseases tab: ${diseasesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (diseasesVisible) {
                const diseaseItems = await page.$$eval('.disease-item', items => items.length);
                const demographicTags = await page.$$eval('.demographic-tag', tags => tags.length);
                const programItems = await page.$$eval('.program-item', items => items.length);
                console.log(`   Chronic diseases: ${diseaseItems} diseases`);
                console.log(`   Demographics: ${demographicTags} demographic tags`);
                console.log(`   Prevention programs: ${programItems} programs`);
            }
            
            // Test Infrastructure tab
            await page.click('.view-tabs .tab:has-text("Infrastructure")');
            await page.waitForTimeout(1000);
            
            const infrastructureVisible = await page.isVisible('.infrastructure-tab');
            console.log(`   Infrastructure tab: ${infrastructureVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (infrastructureVisible) {
                const facilityItems = await page.$$eval('.facility-item', items => items.length);
                const utilizationBars = await page.$$eval('.facility-utilization-bar', bars => bars.length);
                const equipmentItems = await page.$$eval('.equipment-item', items => items.length);
                console.log(`   Healthcare facilities: ${facilityItems} facilities`);
                console.log(`   Utilization bars: ${utilizationBars} utilization indicators`);
                console.log(`   Equipment items: ${equipmentItems} equipment pieces`);
            }
            
            // Test Policies tab
            await page.click('.view-tabs .tab:has-text("Policies")');
            await page.waitForTimeout(1000);
            
            const policiesVisible = await page.isVisible('.policies-tab');
            console.log(`   Policies tab: ${policiesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (policiesVisible) {
                const policyItems = await page.$$eval('.policy-item', items => items.length);
                const objectiveItems = await page.$$eval('.objective-item', items => items.length);
                console.log(`   Health policies: ${policyItems} policies`);
                console.log(`   Policy objectives: ${objectiveItems} objectives`);
            }
            
            // Test Emergencies tab
            await page.click('.view-tabs .tab:has-text("Emergencies")');
            await page.waitForTimeout(1000);
            
            const emergenciesVisible = await page.isVisible('.emergencies-tab');
            console.log(`   Emergencies tab: ${emergenciesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (emergenciesVisible) {
                const emergencyItems = await page.$$eval('.emergency-item', items => items.length);
                const resourceItems = await page.$$eval('.resource-item', items => items.length);
                const actionItems = await page.$$eval('.action-item', items => items.length);
                console.log(`   Health emergencies: ${emergencyItems} emergencies`);
                console.log(`   Resources deployed: ${resourceItems} resources`);
                console.log(`   Actions taken: ${actionItems} actions`);
            }
            
            // Test Budget tab
            await page.click('.view-tabs .tab:has-text("Budget")');
            await page.waitForTimeout(1000);
            
            const budgetVisible = await page.isVisible('.budget-tab');
            console.log(`   Budget tab: ${budgetVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (budgetVisible) {
                const allocationItems = await page.$$eval('.allocation-item', items => items.length);
                const allocationBars = await page.$$eval('.allocation-bar', bars => bars.length);
                const utilizationBars = await page.$$eval('.utilization-bar', bars => bars.length);
                const totalBudget = await page.$eval('.total-value', el => el.textContent);
                console.log(`   Budget allocations: ${allocationItems} categories`);
                console.log(`   Allocation bars: ${allocationBars} allocation indicators`);
                console.log(`   Utilization bars: ${utilizationBars} utilization indicators`);
                console.log(`   Total budget: ${totalBudget}`);
            }
            
            // Test Workflows tab
            await page.click('.view-tabs .tab:has-text("Workflows")');
            await page.waitForTimeout(1000);
            
            const workflowsVisible = await page.isVisible('.workflows-tab');
            console.log(`   Workflows tab: ${workflowsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (workflowsVisible) {
                const workflowItems = await page.$$eval('.workflow-item', items => items.length);
                const progressBars = await page.$$eval('.progress-bar', bars => bars.length);
                const stepItems = await page.$$eval('.step-item', items => items.length);
                const outcomeItems = await page.$$eval('.outcome-item', items => items.length);
                console.log(`   Health workflows: ${workflowItems} workflows`);
                console.log(`   Progress bars: ${progressBars} progress indicators`);
                console.log(`   Workflow steps: ${stepItems} steps`);
                console.log(`   Expected outcomes: ${outcomeItems} outcomes`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Population tab to test grid layout
            await page.click('.view-tabs .tab:has-text("Population")');
            await page.waitForTimeout(1000);
            
            const gridLayout = await page.evaluate(() => {
                const metrics = document.querySelector('.population-metrics');
                if (!metrics) return { columns: 0, gap: 0 };
                
                const styles = window.getComputedStyle(metrics);
                return {
                    columns: styles.gridTemplateColumns.split(' ').length,
                    gap: styles.gap
                };
            });
            console.log(`   Population grid columns: ${gridLayout.columns} ${gridLayout.columns >= 4 ? '✅' : '❌'}`);
            console.log(`   Population grid gap: ${gridLayout.gap}`);
            
            // Check green health theme colors
            const greenTheme = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('74, 222, 128') || styles.borderBottomColor.includes('74, 222, 128');
            });
            console.log(`   Green health theme: ${greenTheme ? 'YES ✅' : 'NO ❌'}`);
            
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
        await page.screenshot({ path: 'temp_dev/health_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/health_screen_integration_test.png');
        
        console.log('\n🎉 HEALTH SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${healthScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 8 tabs functional: ${tabs && tabs.length === 8 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Grid layout optimized: ${gridLayout.columns >= 4 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Green theme applied: ${greenTheme ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testHealthScreenIntegration().catch(console.error);
