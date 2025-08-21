const playwright = require('playwright');

async function testDemographicsIntegration() {
    console.log('📊 TESTING DEMOGRAPHICS SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO DEMOGRAPHICS SCREEN...');
        
        // Open Population category
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(1000);
        
        // Click Demographics
        await page.click('.nav-item:has-text("Demographics")');
        await page.waitForTimeout(3000);
        
        const demographicsScreenVisible = await page.isVisible('.demographics-screen');
        console.log(`   Demographics screen loaded: ${demographicsScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (demographicsScreenVisible) {
            console.log('\n2️⃣ TESTING DEMOGRAPHICS FEATURES...');
            
            // Test city selector
            const citySelector = await page.isVisible('.city-selector select');
            console.log(`   City selector present: ${citySelector ? 'YES ✅' : 'NO ❌'}`);
            
            // Test tab navigation
            const tabs = await page.$$('.tab-navigation .tab');
            console.log(`   Tab navigation present: ${tabs.length} tabs`);
            
            const expectedTabs = ['Overview', 'Trends', 'Social Mobility', 'Projections', 'Comparative'];
            for (const tabName of expectedTabs) {
                const tabExists = await page.isVisible(`.tab:has-text("${tabName}")`);
                console.log(`     ${tabName} tab: ${tabExists ? 'YES ✅' : 'NO ❌'}`);
            }
            
            // Test overview content
            const statsGrid = await page.isVisible('.stats-grid');
            const demographicsDetails = await page.isVisible('.demographics-details');
            console.log(`   Stats grid present: ${statsGrid ? 'YES ✅' : 'NO ❌'}`);
            console.log(`   Demographics details present: ${demographicsDetails ? 'YES ✅' : 'NO ❌'}`);
            
            if (statsGrid) {
                const statCards = await page.$$('.stat-card');
                console.log(`     Stat cards loaded: ${statCards.length} cards`);
            }
            
            console.log('\n3️⃣ TESTING TAB SWITCHING...');
            
            // Test switching to Trends tab
            await page.click('.tab:has-text("Trends")');
            await page.waitForTimeout(1000);
            
            const trendsVisible = await page.isVisible('.demographics-trends');
            console.log(`   Trends tab content: ${trendsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (trendsVisible) {
                const trendCards = await page.$$('.trend-card');
                console.log(`     Trend cards loaded: ${trendCards.length} cards`);
            }
            
            // Test switching to Social Mobility tab
            await page.click('.tab:has-text("Social Mobility")');
            await page.waitForTimeout(1000);
            
            const mobilityVisible = await page.isVisible('.social-mobility');
            console.log(`   Social Mobility tab content: ${mobilityVisible ? 'YES ✅' : 'NO ❌'}`);
            
            // Test switching to Projections tab
            await page.click('.tab:has-text("Projections")');
            await page.waitForTimeout(1000);
            
            const projectionsVisible = await page.isVisible('.demographics-projections');
            console.log(`   Projections tab content: ${projectionsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            // Test switching to Comparative tab
            await page.click('.tab:has-text("Comparative")');
            await page.waitForTimeout(1000);
            
            const comparativeVisible = await page.isVisible('.comparative-analysis');
            console.log(`   Comparative tab content: ${comparativeVisible ? 'YES ✅' : 'NO ❌'}`);
            
            console.log('\n4️⃣ TESTING CITY SELECTION...');
            
            // Go back to Overview tab
            await page.click('.tab:has-text("Overview")');
            await page.waitForTimeout(1000);
            
            // Test city selection
            const cityOptions = await page.$$eval('.city-selector select option', options => 
                options.map(option => option.textContent)
            );
            console.log(`   City options available: ${cityOptions.length} cities`);
            console.log(`     Cities: ${cityOptions.join(', ')}`);
            
            if (cityOptions.length > 2) {
                // Select second city
                await page.selectOption('.city-selector select', { index: 1 });
                await page.waitForTimeout(1000);
                
                const cityChanged = await page.isVisible('.demographics-details');
                console.log(`   City selection working: ${cityChanged ? 'YES ✅' : 'NO ❌'}`);
            }
            
            console.log('\n5️⃣ TESTING INTERACTIVE ELEMENTS...');
            
            // Test simulate button
            const simulateBtn = await page.isVisible('.btn:has-text("Simulate")');
            console.log(`   Simulate button present: ${simulateBtn ? 'YES ✅' : 'NO ❌'}`);
            
            if (simulateBtn) {
                await page.click('.btn:has-text("Simulate")');
                await page.waitForTimeout(1000);
                console.log(`   Simulate button clickable: YES ✅`);
            }
            
            // Test progress bars
            const progressBars = await page.$$('.progress-bar');
            console.log(`   Progress bars present: ${progressBars.length} bars`);
            
            // Test distribution charts
            const chartItems = await page.$$('.chart-item');
            console.log(`   Chart items present: ${chartItems.length} items`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/demographics_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/demographics_integration_test.png');
        
        console.log('\n🎉 DEMOGRAPHICS INTEGRATION TEST SUMMARY:');
        console.log(`   Screen loaded: ${demographicsScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Tab navigation: ${tabs.length >= 5 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   City selector: ${citySelector ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive elements: ${simulateBtn ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testDemographicsIntegration().catch(console.error);
