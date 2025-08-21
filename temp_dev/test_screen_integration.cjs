const playwright = require('playwright');

async function testScreenIntegration() {
    console.log('🖥️ TESTING SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ TESTING LEFT PANEL NAVIGATION...');
        
        // Test Government category
        console.log('   Testing Government category...');
        await page.click('.accordion-header:has-text("GOVERNMENT")');
        await page.waitForTimeout(1000);
        
        // Test Cabinet screen
        console.log('   Testing Cabinet screen...');
        await page.click('.nav-item:has-text("Cabinet")');
        await page.waitForTimeout(2000);
        
        const cabinetScreenVisible = await page.isVisible('.cabinet-screen');
        console.log(`   Cabinet screen loaded: ${cabinetScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (cabinetScreenVisible) {
            // Test cabinet tabs
            const overviewTab = await page.isVisible('.tab:has-text("Overview")');
            const membersTab = await page.isVisible('.tab:has-text("Members")');
            const tasksTab = await page.isVisible('.tab:has-text("Tasks")');
            
            console.log(`   Cabinet tabs present: ${overviewTab && membersTab && tasksTab ? 'YES ✅' : 'NO ❌'}`);
            
            // Test switching tabs
            await page.click('.tab:has-text("Members")');
            await page.waitForTimeout(1000);
            
            const memberCards = await page.$$('.member-card');
            console.log(`   Member cards loaded: ${memberCards.length} cards`);
        }
        
        console.log('\n2️⃣ TESTING SECURITY CATEGORY...');
        
        // Test Security category
        await page.click('.accordion-header:has-text("SECURITY")');
        await page.waitForTimeout(1000);
        
        // Test Military screen
        console.log('   Testing Military screen...');
        await page.click('.nav-item:has-text("Military")');
        await page.waitForTimeout(2000);
        
        const militaryScreenVisible = await page.isVisible('.military-screen');
        console.log(`   Military screen loaded: ${militaryScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (militaryScreenVisible) {
            // Test military tabs
            const overviewTab = await page.isVisible('.tab:has-text("Overview")');
            const fleetsTab = await page.isVisible('.tab:has-text("Fleets")');
            const basesTab = await page.isVisible('.tab:has-text("Bases")');
            const threatsTab = await page.isVisible('.tab:has-text("Threats")');
            
            console.log(`   Military tabs present: ${overviewTab && fleetsTab && basesTab && threatsTab ? 'YES ✅' : 'NO ❌'}`);
            
            // Test switching to fleets tab
            await page.click('.tab:has-text("Fleets")');
            await page.waitForTimeout(1000);
            
            const fleetCards = await page.$$('.fleet-card');
            console.log(`   Fleet cards loaded: ${fleetCards.length} cards`);
        }
        
        console.log('\n3️⃣ TESTING PLACEHOLDER SCREENS...');
        
        // Test Economy category with placeholder screens
        await page.click('.accordion-header:has-text("ECONOMY")');
        await page.waitForTimeout(1000);
        
        await page.click('.nav-item:has-text("Treasury")');
        await page.waitForTimeout(2000);
        
        const placeholderVisible = await page.isVisible('div:has-text("Treasury Management")');
        const apiInfoVisible = await page.isVisible('div:has-text("Planned API Integration")');
        
        console.log(`   Placeholder screen loaded: ${placeholderVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration info shown: ${apiInfoVisible ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n4️⃣ TESTING SCREEN NAVIGATION...');
        
        // Test navigation between different screens
        const testScreens = [
            { category: 'GOVERNMENT', screen: 'Policies' },
            { category: 'ECONOMY', screen: 'Trade' },
            { category: 'POPULATION', screen: 'Demographics' },
            { category: 'SCIENCE', screen: 'Science' }
        ];
        
        for (const test of testScreens) {
            console.log(`   Testing ${test.category} -> ${test.screen}...`);
            
            await page.click(`.accordion-header:has-text("${test.category}")`);
            await page.waitForTimeout(500);
            
            await page.click(`.nav-item:has-text("${test.screen}")`);
            await page.waitForTimeout(1000);
            
            const screenLoaded = await page.isVisible('.panel-screen');
            console.log(`     Screen loaded: ${screenLoaded ? 'YES ✅' : 'NO ❌'}`);
        }
        
        console.log('\n5️⃣ TESTING RETURN TO COMMAND CENTER...');
        
        // Test returning to command center
        await page.click('.nav-item:has-text("Crisis Mode")');
        await page.waitForTimeout(1000);
        
        const commandCenterVisible = await page.isVisible('.tab-navigation');
        console.log(`   Command center restored: ${commandCenterVisible ? 'YES ✅' : 'NO ❌'}`);
        
        // Take final screenshot
        await page.screenshot({ path: 'temp_dev/screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/screen_integration_test.png');
        
        console.log('\n🎉 SCREEN INTEGRATION TEST SUMMARY:');
        console.log(`   Cabinet screen: ${cabinetScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Military screen: ${militaryScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Placeholder screens: ${placeholderVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Navigation working: ${commandCenterVisible ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testScreenIntegration().catch(console.error);
