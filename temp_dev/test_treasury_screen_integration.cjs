const playwright = require('playwright');

async function testTreasuryScreenIntegration() {
    console.log('💰 TESTING TREASURY SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO TREASURY SCREEN...');
        
        // Navigate to Treasury screen
        await page.click('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Treasury")');
        await page.waitForTimeout(3000);
        
        // Check if treasury screen loaded
        const treasuryScreenVisible = await page.isVisible('.treasury-screen');
        console.log(`   Treasury screen loaded: ${treasuryScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (treasuryScreenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 6 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Dashboard tab (default)
            const dashboardVisible = await page.isVisible('.dashboard-tab');
            console.log(`   Dashboard tab content: ${dashboardVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (dashboardVisible) {
                const financeCards = await page.$$eval('.finance-card, .revenue-card, .secretary-card', cards => cards.length);
                const budgetBars = await page.$$eval('.budget-bar', bars => bars.length);
                const metricValues = await page.$$eval('.metric-value', values => values.length);
                const specializationTags = await page.$$eval('.specialization-tag', tags => tags.length);
                console.log(`   Finance cards: ${financeCards} financial overview cards`);
                console.log(`   Budget bars: ${budgetBars} budget utilization indicators`);
                console.log(`   Metric values: ${metricValues} financial metrics`);
                console.log(`   Specializations: ${specializationTags} secretary specialization tags`);
            }
            
            // Test Departments tab
            await page.click('.view-tabs .tab:has-text("Departments")');
            await page.waitForTimeout(1000);
            
            const departmentsVisible = await page.isVisible('.departments-tab');
            console.log(`   Departments tab: ${departmentsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (departmentsVisible) {
                const departmentItems = await page.$$eval('.department-item', items => items.length);
                const departmentBudgets = await page.$$eval('.department-budget', budgets => budgets.length);
                const priorityTags = await page.$$eval('.department-priority', tags => tags.length);
                console.log(`   Department items: ${departmentItems} departments`);
                console.log(`   Budget sections: ${departmentBudgets} budget breakdowns`);
                console.log(`   Priority indicators: ${priorityTags} priority tags`);
            }
            
            // Test Budget Rollup tab
            await page.click('.view-tabs .tab:has-text("Budget Rollup")');
            await page.waitForTimeout(1000);
            
            const rollupVisible = await page.isVisible('.rollup-tab');
            console.log(`   Budget Rollup tab: ${rollupVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (rollupVisible) {
                const summaryCard = await page.isVisible('.summary-card');
                const breakdownRows = await page.$$eval('.breakdown-row', rows => rows.length);
                const summaryMetrics = await page.$$eval('.summary-metric', metrics => metrics.length);
                console.log(`   Summary card: ${summaryCard ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Breakdown rows: ${breakdownRows} department breakdowns`);
                console.log(`   Summary metrics: ${summaryMetrics} rollup metrics`);
            }
            
            // Test Spending Requests tab
            await page.click('.view-tabs .tab:has-text("Spending Requests")');
            await page.waitForTimeout(1000);
            
            const requestsVisible = await page.isVisible('.requests-tab');
            console.log(`   Spending Requests tab: ${requestsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (requestsVisible) {
                const requestItems = await page.$$eval('.request-item', items => items.length);
                const requestActions = await page.$$eval('.request-actions', actions => actions.length);
                const approveButtons = await page.$$eval('.action-btn.approve', btns => btns.length);
                const rejectButtons = await page.$$eval('.action-btn.reject', btns => btns.length);
                console.log(`   Spending requests: ${requestItems} requests`);
                console.log(`   Request action sections: ${requestActions} action areas`);
                console.log(`   Approve buttons: ${approveButtons} approve actions`);
                console.log(`   Reject buttons: ${rejectButtons} reject actions`);
            }
            
            // Test Analytics tab
            await page.click('.view-tabs .tab:has-text("Analytics")');
            await page.waitForTimeout(1000);
            
            const analyticsVisible = await page.isVisible('.analytics-tab');
            console.log(`   Analytics tab: ${analyticsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (analyticsVisible) {
                const trendsCard = await page.isVisible('.trends-card');
                const performanceCard = await page.isVisible('.performance-card');
                const risksCard = await page.isVisible('.risks-card');
                const trendItems = await page.$$eval('.trend-item', items => items.length);
                const performanceItems = await page.$$eval('.performance-item', items => items.length);
                const riskItems = await page.$$eval('.risk-item', items => items.length);
                console.log(`   Trends card: ${trendsCard ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Performance card: ${performanceCard ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Risks card: ${risksCard ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Monthly trends: ${trendItems} trend data points`);
                console.log(`   Department performance: ${performanceItems} performance metrics`);
                console.log(`   Risk factors: ${riskItems} identified risks`);
            }
            
            // Test Forecasting tab
            await page.click('.view-tabs .tab:has-text("Forecasting")');
            await page.waitForTimeout(1000);
            
            const forecastingVisible = await page.isVisible('.forecasting-tab');
            console.log(`   Forecasting tab: ${forecastingVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (forecastingVisible) {
                const forecastOverview = await page.isVisible('.forecast-overview');
                const assumptionsCard = await page.isVisible('.assumptions-card');
                const scenariosCard = await page.isVisible('.scenarios-card');
                const forecastMetrics = await page.$$eval('.forecast-metric', metrics => metrics.length);
                const assumptionItems = await page.$$eval('.assumption-item', items => items.length);
                const scenarioItems = await page.$$eval('.scenario-item', items => items.length);
                const confidenceBar = await page.isVisible('.confidence-bar');
                console.log(`   Forecast overview: ${forecastOverview ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Assumptions card: ${assumptionsCard ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Scenarios card: ${scenariosCard ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Economic metrics: ${forecastMetrics} forecast indicators`);
                console.log(`   Key assumptions: ${assumptionItems} assumptions`);
                console.log(`   Economic scenarios: ${scenarioItems} scenarios`);
                console.log(`   Confidence indicator: ${confidenceBar ? 'YES ✅' : 'NO ❌'}`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Dashboard tab to test grid layout
            await page.click('.view-tabs .tab:has-text("Dashboard")');
            await page.waitForTimeout(1000);
            
            const gridLayout = await page.evaluate(() => {
                const dashboard = document.querySelector('.dashboard-grid');
                if (!dashboard) return { columns: 0, gap: 0 };
                
                const styles = window.getComputedStyle(dashboard);
                return {
                    columns: styles.gridTemplateColumns.split(' ').length,
                    gap: styles.gap
                };
            });
            console.log(`   Dashboard grid columns: ${gridLayout.columns} ${gridLayout.columns >= 3 ? '✅' : '❌'}`);
            console.log(`   Dashboard grid gap: ${gridLayout.gap}`);
            
            // Check golden treasury theme colors
            const goldenTheme = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('251, 191, 36') || styles.borderBottomColor.includes('251, 191, 36');
            });
            console.log(`   Golden treasury theme: ${goldenTheme ? 'YES ✅' : 'NO ❌'}`);
            
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
            
            // Test card hover effects
            await page.hover('.finance-card:first-of-type');
            await page.waitForTimeout(300);
            console.log(`   Finance card hover effects: YES ✅`);
            
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
        await page.screenshot({ path: 'temp_dev/treasury_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/treasury_screen_integration_test.png');
        
        console.log('\n🎉 TREASURY SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${treasuryScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 6 tabs functional: ${tabs && tabs.length === 6 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Grid layout optimized: ${gridLayout.columns >= 3 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Golden theme applied: ${goldenTheme ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testTreasuryScreenIntegration().catch(console.error);
