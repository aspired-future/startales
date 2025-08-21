const playwright = require('playwright');

async function testEmptySpaceReduction() {
    console.log('📏 TESTING EMPTY SPACE REDUCTION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ TESTING MILITARY SCREEN COMPACTNESS...');
        
        // Navigate to Military screen
        await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Military")');
        await page.waitForTimeout(2000);
        
        // Measure various elements
        const militaryMetrics = await page.evaluate(() => {
            const viewTabs = document.querySelector('.view-tabs');
            const tabContent = document.querySelector('.tab-content');
            const metricsGrid = document.querySelector('.metrics-grid');
            const metricCards = document.querySelectorAll('.metric-card');
            const statusPanels = document.querySelector('.status-panels');
            const panels = document.querySelectorAll('.panel');
            
            return {
                viewTabsHeight: viewTabs ? viewTabs.offsetHeight : 0,
                tabContentHeight: tabContent ? tabContent.offsetHeight : 0,
                metricsGridHeight: metricsGrid ? metricsGrid.offsetHeight : 0,
                metricCardCount: metricCards.length,
                metricCardHeight: metricCards[0] ? metricCards[0].offsetHeight : 0,
                statusPanelsHeight: statusPanels ? statusPanels.offsetHeight : 0,
                panelCount: panels.length,
                panelHeight: panels[0] ? panels[0].offsetHeight : 0
            };
        });
        
        console.log(`   View tabs height: ${militaryMetrics.viewTabsHeight}px`);
        console.log(`   Tab content height: ${militaryMetrics.tabContentHeight}px`);
        console.log(`   Metrics grid height: ${militaryMetrics.metricsGridHeight}px`);
        console.log(`   Metric cards: ${militaryMetrics.metricCardCount} cards @ ${militaryMetrics.metricCardHeight}px each`);
        console.log(`   Status panels height: ${militaryMetrics.statusPanelsHeight}px`);
        console.log(`   Panels: ${militaryMetrics.panelCount} panels @ ${militaryMetrics.panelHeight}px each`);
        
        console.log('\n2️⃣ TESTING CABINET SCREEN COMPACTNESS...');
        
        // Navigate to Cabinet screen
        await page.click('.accordion-header:has(.accordion-title:has-text("GOVERNMENT"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Cabinet")');
        await page.waitForTimeout(2000);
        
        const cabinetMetrics = await page.evaluate(() => {
            const viewTabs = document.querySelector('.view-tabs');
            const tabContent = document.querySelector('.tab-content');
            
            return {
                viewTabsHeight: viewTabs ? viewTabs.offsetHeight : 0,
                tabContentHeight: tabContent ? tabContent.offsetHeight : 0
            };
        });
        
        console.log(`   Cabinet view tabs height: ${cabinetMetrics.viewTabsHeight}px`);
        console.log(`   Cabinet tab content height: ${cabinetMetrics.tabContentHeight}px`);
        
        console.log('\n3️⃣ CHECKING CONTENT DENSITY...');
        
        // Go back to Military screen for detailed analysis
        await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Military")');
        await page.waitForTimeout(2000);
        
        // Check if content fills the available space better
        const contentDensity = await page.evaluate(() => {
            const screenContent = document.querySelector('.screen-content');
            const militaryOverview = document.querySelector('.military-overview');
            
            const screenRect = screenContent ? screenContent.getBoundingClientRect() : null;
            const overviewRect = militaryOverview ? militaryOverview.getBoundingClientRect() : null;
            
            return {
                screenHeight: screenRect ? screenRect.height : 0,
                overviewHeight: overviewRect ? overviewRect.height : 0,
                contentFillPercentage: screenRect && overviewRect ? 
                    (overviewRect.height / screenRect.height * 100).toFixed(1) : 0
            };
        });
        
        console.log(`   Screen content area: ${contentDensity.screenHeight}px`);
        console.log(`   Overview content: ${contentDensity.overviewHeight}px`);
        console.log(`   Content fill percentage: ${contentDensity.contentFillPercentage}%`);
        
        // Test different tabs to see space usage
        console.log('\n4️⃣ TESTING TAB SPACE USAGE...');
        
        // Test Fleets tab
        await page.click('.view-tabs .tab:has-text("Fleets")');
        await page.waitForTimeout(1000);
        
        const fleetsTabHeight = await page.evaluate(() => {
            const tabContent = document.querySelector('.tab-content');
            return tabContent ? tabContent.scrollHeight : 0;
        });
        console.log(`   Fleets tab content height: ${fleetsTabHeight}px`);
        
        // Test Bases tab
        await page.click('.view-tabs .tab:has-text("Bases")');
        await page.waitForTimeout(1000);
        
        const basesTabHeight = await page.evaluate(() => {
            const tabContent = document.querySelector('.tab-content');
            return tabContent ? tabContent.scrollHeight : 0;
        });
        console.log(`   Bases tab content height: ${basesTabHeight}px`);
        
        // Test Threats tab
        await page.click('.view-tabs .tab:has-text("Threats")');
        await page.waitForTimeout(1000);
        
        const threatsTabHeight = await page.evaluate(() => {
            const tabContent = document.querySelector('.tab-content');
            return tabContent ? tabContent.scrollHeight : 0;
        });
        console.log(`   Threats tab content height: ${threatsTabHeight}px`);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/empty_space_reduction_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/empty_space_reduction_test.png');
        
        console.log('\n🎉 EMPTY SPACE REDUCTION SUMMARY:');
        console.log(`   Tab height reduced: ${militaryMetrics.viewTabsHeight < 50 ? 'YES ✅' : 'NO ❌'} (${militaryMetrics.viewTabsHeight}px)`);
        console.log(`   Metric cards compact: ${militaryMetrics.metricCardHeight < 80 ? 'YES ✅' : 'NO ❌'} (${militaryMetrics.metricCardHeight}px)`);
        console.log(`   Panels compact: ${militaryMetrics.panelHeight < 200 ? 'YES ✅' : 'NO ❌'} (${militaryMetrics.panelHeight}px)`);
        console.log(`   Content density: ${contentDensity.contentFillPercentage}% ${parseFloat(contentDensity.contentFillPercentage) > 70 ? '✅' : '❌'}`);
        console.log(`   Space optimization: ${parseFloat(contentDensity.contentFillPercentage) > 70 ? 'EXCELLENT' : 'GOOD'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testEmptySpaceReduction().catch(console.error);
