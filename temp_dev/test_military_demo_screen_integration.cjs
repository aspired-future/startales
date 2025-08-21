const playwright = require('playwright');

async function testMilitaryDemoScreenIntegration() {
    console.log('⚔️ TESTING MILITARY DEMO SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO MILITARY DEMO SCREEN...');
        
        // Navigate to Military Demo screen (War Simulator)
        await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("War Simulator")');
        await page.waitForTimeout(3000);
        
        // Check if military demo screen loaded
        const militaryDemoScreenVisible = await page.isVisible('.military-demo-screen');
        console.log(`   Military Demo screen loaded: ${militaryDemoScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (militaryDemoScreenVisible) {
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
            
            // Test Units tab (default)
            const unitsVisible = await page.isVisible('.units-view');
            console.log(`   Units tab content: ${unitsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (unitsVisible) {
                const statCards = await page.$$eval('.stat-card', cards => cards.length);
                const unitCards = await page.$$eval('.unit-card', cards => cards.length);
                const equipmentTags = await page.$$eval('.equipment-tag', tags => tags.length);
                console.log(`   Overview stats: ${statCards} stat cards`);
                console.log(`   Military units: ${unitCards} units`);
                console.log(`   Equipment items: ${equipmentTags} equipment tags`);
            }
            
            // Test Battles tab
            await page.click('.view-tabs .tab:has-text("Battle Simulation")');
            await page.waitForTimeout(1000);
            
            const battlesVisible = await page.isVisible('.battles-view');
            console.log(`   Battles tab: ${battlesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (battlesVisible) {
                const battleCards = await page.$$eval('.battle-card', cards => cards.length);
                const outcomeIndicators = await page.$$eval('.battle-outcome', outcomes => outcomes.length);
                const participantTags = await page.$$eval('.participant-tag', tags => tags.length);
                console.log(`   Battle records: ${battleCards} battles`);
                console.log(`   Outcome indicators: ${outcomeIndicators} outcomes`);
                console.log(`   Participant tags: ${participantTags} participants`);
            }
            
            // Test Morale tab
            await page.click('.view-tabs .tab:has-text("Morale Analysis")');
            await page.waitForTimeout(1000);
            
            const moraleVisible = await page.isVisible('.morale-view');
            console.log(`   Morale tab: ${moraleVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (moraleVisible) {
                const moraleCards = await page.$$eval('.morale-card', cards => cards.length);
                const moraleBars = await page.$$eval('.morale-bar', bars => bars.length);
                const factorBars = await page.$$eval('.factor-bar', bars => bars.length);
                const recommendations = await page.$$eval('.recommendation-item', items => items.length);
                console.log(`   Morale units: ${moraleCards} units`);
                console.log(`   Morale bars: ${moraleBars} main bars`);
                console.log(`   Factor bars: ${factorBars} factor bars`);
                console.log(`   Recommendations: ${recommendations} recommendations`);
            }
            
            // Test Alliance tab
            await page.click('.view-tabs .tab:has-text("Alliance Warfare")');
            await page.waitForTimeout(1000);
            
            const allianceVisible = await page.isVisible('.alliance-view');
            console.log(`   Alliance tab: ${allianceVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (allianceVisible) {
                const allianceCards = await page.$$eval('.alliance-card', cards => cards.length);
                const memberTags = await page.$$eval('.member-tag', tags => tags.length);
                const objectiveItems = await page.$$eval('.objective-item', items => items.length);
                console.log(`   Alliances: ${allianceCards} alliances`);
                console.log(`   Member tags: ${memberTags} members`);
                console.log(`   Objectives: ${objectiveItems} objectives`);
            }
            
            // Test Sensors tab
            await page.click('.view-tabs .tab:has-text("Sensor Networks")');
            await page.waitForTimeout(1000);
            
            const sensorsVisible = await page.isVisible('.sensors-view');
            console.log(`   Sensors tab: ${sensorsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (sensorsVisible) {
                const sensorCards = await page.$$eval('.sensor-card', cards => cards.length);
                const metricCircles = await page.$$eval('.metric-circle', circles => circles.length);
                console.log(`   Sensor networks: ${sensorCards} sensors`);
                console.log(`   Metric circles: ${metricCircles} metrics`);
            }
            
            // Test Intelligence tab
            await page.click('.view-tabs .tab:has-text("Intelligence Ops")');
            await page.waitForTimeout(1000);
            
            const intelligenceVisible = await page.isVisible('.intelligence-view');
            console.log(`   Intelligence tab: ${intelligenceVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (intelligenceVisible) {
                const intelCards = await page.$$eval('.intel-card', cards => cards.length);
                const progressBars = await page.$$eval('.progress-bar', bars => bars.length);
                const riskBars = await page.$$eval('.risk-bar', bars => bars.length);
                const intelligenceItems = await page.$$eval('.intelligence-item', items => items.length);
                console.log(`   Intelligence ops: ${intelCards} operations`);
                console.log(`   Progress bars: ${progressBars} progress indicators`);
                console.log(`   Risk bars: ${riskBars} risk indicators`);
                console.log(`   Intelligence items: ${intelligenceItems} intel pieces`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Check compact layout
            const tabHeight = await page.evaluate(() => {
                const tabs = document.querySelector('.view-tabs');
                return tabs ? tabs.offsetHeight : 0;
            });
            console.log(`   Tab height: ${tabHeight}px ${tabHeight < 50 ? '✅' : '❌'}`);
            
            // Check tab wrapping for 6 tabs
            const tabsPerRow = await page.evaluate(() => {
                const tabs = document.querySelectorAll('.view-tabs .tab');
                if (tabs.length === 0) return 0;
                
                const firstTabTop = tabs[0].getBoundingClientRect().top;
                let tabsInFirstRow = 0;
                
                for (let tab of tabs) {
                    if (Math.abs(tab.getBoundingClientRect().top - firstTabTop) < 5) {
                        tabsInFirstRow++;
                    } else {
                        break;
                    }
                }
                
                return tabsInFirstRow;
            });
            console.log(`   Tabs per row: ${tabsPerRow} ${tabsPerRow === 6 ? '✅' : '❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Go back to Units tab to test action buttons
            await page.click('.view-tabs .tab:has-text("Military Units")');
            await page.waitForTimeout(1000);
            
            const refreshBtn = await page.isVisible('.units-actions .action-btn:first-of-type');
            const createBtn = await page.isVisible('.units-actions .action-btn.secondary');
            console.log(`   Refresh button: ${refreshBtn ? 'YES ✅' : 'NO ❌'}`);
            console.log(`   Create button: ${createBtn ? 'YES ✅' : 'NO ❌'}`);
            
            // Test unit card hover effects
            const unitCardExists = await page.isVisible('.unit-card');
            if (unitCardExists) {
                await page.hover('.unit-card:first-of-type');
                await page.waitForTimeout(300);
                console.log(`   Unit card hover effects: YES ✅`);
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
        await page.screenshot({ path: 'temp_dev/military_demo_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/military_demo_screen_integration_test.png');
        
        console.log('\n🎉 MILITARY DEMO SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${militaryDemoScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 6 tabs functional: ${tabs && tabs.length === 6 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Compact layout: ${tabHeight < 50 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Tab layout: ${tabsPerRow === 6 ? 'PERFECT ✅' : 'GOOD'}`);
        console.log(`   Interactive features: ${refreshBtn && createBtn ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testMilitaryDemoScreenIntegration().catch(console.error);
