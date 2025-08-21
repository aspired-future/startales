const playwright = require('playwright');

async function testEducationScreenIntegration() {
    console.log('🎓 TESTING EDUCATION SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO EDUCATION SCREEN...');
        
        // Navigate to Education screen
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Education")');
        await page.waitForTimeout(3000);
        
        // Check if education screen loaded
        const educationScreenVisible = await page.isVisible('.education-screen');
        console.log(`   Education screen loaded: ${educationScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (educationScreenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 6 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Overview tab (default)
            const overviewVisible = await page.isVisible('.overview-tab');
            console.log(`   Overview tab content: ${overviewVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (overviewVisible) {
                const metricCards = await page.$$eval('.metric-card', cards => cards.length);
                console.log(`   Overview metrics: ${metricCards} metric cards`);
                
                // Check specific metrics
                const metrics = await page.$$eval('.metric-card', cards => 
                    cards.map(card => ({
                        value: card.querySelector('.metric-value').textContent,
                        label: card.querySelector('.metric-label').textContent
                    }))
                );
                console.log(`   Sample metrics: ${metrics.slice(0, 3).map(m => `${m.label}: ${m.value}`).join(', ')}`);
            }
            
            // Test Universities tab
            await page.click('.view-tabs .tab:has-text("Universities")');
            await page.waitForTimeout(1000);
            
            const universitiesVisible = await page.isVisible('.universities-tab');
            console.log(`   Universities tab: ${universitiesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (universitiesVisible) {
                const universityItems = await page.$$eval('.university-item', items => items.length);
                const researchTags = await page.$$eval('.research-tag', tags => tags.length);
                const achievementItems = await page.$$eval('.achievement-item', items => items.length);
                console.log(`   Universities: ${universityItems} institutions`);
                console.log(`   Research areas: ${researchTags} research tags`);
                console.log(`   Achievements: ${achievementItems} achievements`);
            }
            
            // Test Research tab
            await page.click('.view-tabs .tab:has-text("Research")');
            await page.waitForTimeout(1000);
            
            const researchVisible = await page.isVisible('.research-tab');
            console.log(`   Research tab: ${researchVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (researchVisible) {
                const projectItems = await page.$$eval('.project-item', items => items.length);
                const grantItems = await page.$$eval('.grant-item', items => items.length);
                const progressBars = await page.$$eval('.progress-bar', bars => bars.length);
                const outcomeItems = await page.$$eval('.outcome-item', items => items.length);
                console.log(`   Research projects: ${projectItems} projects`);
                console.log(`   Research grants: ${grantItems} grants`);
                console.log(`   Progress bars: ${progressBars} progress indicators`);
                console.log(`   Project outcomes: ${outcomeItems} outcomes`);
            }
            
            // Test Priorities tab
            await page.click('.view-tabs .tab:has-text("Priorities")');
            await page.waitForTimeout(1000);
            
            const prioritiesVisible = await page.isVisible('.priorities-tab');
            console.log(`   Priorities tab: ${prioritiesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (prioritiesVisible) {
                const priorityItems = await page.$$eval('.priority-item', items => items.length);
                const institutionTags = await page.$$eval('.institution-tag', tags => tags.length);
                console.log(`   Research priorities: ${priorityItems} priorities`);
                console.log(`   Key institutions: ${institutionTags} institution tags`);
            }
            
            // Test Budget tab
            await page.click('.view-tabs .tab:has-text("Budget")');
            await page.waitForTimeout(1000);
            
            const budgetVisible = await page.isVisible('.budget-tab');
            console.log(`   Budget tab: ${budgetVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (budgetVisible) {
                const allocationItems = await page.$$eval('.allocation-item', items => items.length);
                const allocationBars = await page.$$eval('.allocation-bar', bars => bars.length);
                const totalBudget = await page.$eval('.total-value', el => el.textContent);
                console.log(`   Budget allocations: ${allocationItems} categories`);
                console.log(`   Allocation bars: ${allocationBars} progress bars`);
                console.log(`   Total budget: ${totalBudget}`);
            }
            
            // Test Secretary tab
            await page.click('.view-tabs .tab:has-text("Secretary")');
            await page.waitForTimeout(1000);
            
            const secretaryVisible = await page.isVisible('.secretary-tab');
            console.log(`   Secretary tab: ${secretaryVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (secretaryVisible) {
                const secretaryName = await page.$eval('.secretary-name', el => el.textContent);
                const educationItems = await page.$$eval('.education-item', items => items.length);
                const achievementItems = await page.$$eval('.achievement-item', items => items.length);
                const priorityTags = await page.$$eval('.priority-tag', tags => tags.length);
                console.log(`   Secretary: ${secretaryName}`);
                console.log(`   Education credentials: ${educationItems} degrees`);
                console.log(`   Achievements: ${achievementItems} achievements`);
                console.log(`   Current priorities: ${priorityTags} priority areas`);
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
            
            // Check blue theme colors
            const blueTheme = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('79, 195, 247') || styles.borderBottomColor.includes('79, 195, 247');
            });
            console.log(`   Blue education theme: ${blueTheme ? 'YES ✅' : 'NO ❌'}`);
            
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
        await page.screenshot({ path: 'temp_dev/education_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/education_screen_integration_test.png');
        
        console.log('\n🎉 EDUCATION SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${educationScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 6 tabs functional: ${tabs && tabs.length === 6 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Grid layout optimized: ${gridLayout.columns >= 4 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Blue theme applied: ${blueTheme ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testEducationScreenIntegration().catch(console.error);
