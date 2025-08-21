const playwright = require('playwright');

async function testSpaceOptimization() {
    console.log('📏 TESTING SPACE OPTIMIZATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ MEASURING HEADER HEIGHTS...');
        
        // Measure command header height
        const commandHeaderHeight = await page.evaluate(() => {
            const header = document.querySelector('.command-header');
            return header ? header.offsetHeight : 0;
        });
        console.log(`   Command header height: ${commandHeaderHeight}px`);
        
        // Navigate to a screen to test screen header
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Demographics")');
        await page.waitForTimeout(2000);
        
        const screenHeaderHeight = await page.evaluate(() => {
            const header = document.querySelector('.screen-header');
            return header ? header.offsetHeight : 0;
        });
        console.log(`   Screen header height: ${screenHeaderHeight}px`);
        
        console.log('\n2️⃣ MEASURING CONTENT AREA...');
        
        // Measure available content space
        const spaceMetrics = await page.evaluate(() => {
            const hudMain = document.querySelector('.hud-main');
            const centerPanel = document.querySelector('.center-panel');
            const panelScreen = document.querySelector('.panel-screen');
            const screenContent = document.querySelector('.screen-content');
            
            return {
                hudMainHeight: hudMain ? hudMain.offsetHeight : 0,
                centerPanelHeight: centerPanel ? centerPanel.offsetHeight : 0,
                panelScreenHeight: panelScreen ? panelScreen.offsetHeight : 0,
                screenContentHeight: screenContent ? screenContent.offsetHeight : 0,
                viewportHeight: window.innerHeight
            };
        });
        
        console.log(`   Viewport height: ${spaceMetrics.viewportHeight}px`);
        console.log(`   HUD main height: ${spaceMetrics.hudMainHeight}px`);
        console.log(`   Center panel height: ${spaceMetrics.centerPanelHeight}px`);
        console.log(`   Panel screen height: ${spaceMetrics.panelScreenHeight}px`);
        console.log(`   Screen content height: ${spaceMetrics.screenContentHeight}px`);
        
        const totalHeaderSpace = commandHeaderHeight + screenHeaderHeight;
        const availableContentSpace = spaceMetrics.viewportHeight - totalHeaderSpace;
        const contentPercentage = (availableContentSpace / spaceMetrics.viewportHeight) * 100;
        
        console.log('\n3️⃣ SPACE ANALYSIS:');
        console.log(`   Total header space: ${totalHeaderSpace}px`);
        console.log(`   Available content space: ${availableContentSpace}px`);
        console.log(`   Content area percentage: ${contentPercentage.toFixed(1)}%`);
        
        // Test different screens to see space usage
        console.log('\n4️⃣ TESTING DIFFERENT SCREENS...');
        
        // Test Cabinet screen
        await page.click('.accordion-header:has(.accordion-title:has-text("GOVERNMENT"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Cabinet")');
        await page.waitForTimeout(2000);
        
        const cabinetContentHeight = await page.evaluate(() => {
            const content = document.querySelector('.screen-content');
            return content ? content.offsetHeight : 0;
        });
        console.log(`   Cabinet screen content height: ${cabinetContentHeight}px`);
        
        // Test Military screen
        await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Military")');
        await page.waitForTimeout(2000);
        
        const militaryContentHeight = await page.evaluate(() => {
            const content = document.querySelector('.screen-content');
            return content ? content.offsetHeight : 0;
        });
        console.log(`   Military screen content height: ${militaryContentHeight}px`);
        
        console.log('\n5️⃣ TESTING SCROLLABLE CONTENT...');
        
        // Check if content actually needs scrolling
        const scrollMetrics = await page.evaluate(() => {
            const panelScreen = document.querySelector('.panel-screen');
            const screenContent = document.querySelector('.screen-content');
            
            return {
                panelScreenScrollable: panelScreen ? panelScreen.scrollHeight > panelScreen.clientHeight : false,
                screenContentScrollable: screenContent ? screenContent.scrollHeight > screenContent.clientHeight : false,
                panelScreenScrollHeight: panelScreen ? panelScreen.scrollHeight : 0,
                panelScreenClientHeight: panelScreen ? panelScreen.clientHeight : 0
            };
        });
        
        console.log(`   Panel screen scrollable: ${scrollMetrics.panelScreenScrollable ? 'YES' : 'NO'}`);
        console.log(`   Screen content scrollable: ${scrollMetrics.screenContentScrollable ? 'YES' : 'NO'}`);
        console.log(`   Panel scroll height: ${scrollMetrics.panelScreenScrollHeight}px`);
        console.log(`   Panel client height: ${scrollMetrics.panelScreenClientHeight}px`);
        
        // Take before/after screenshots
        await page.screenshot({ path: 'temp_dev/space_optimization_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/space_optimization_test.png');
        
        console.log('\n🎉 SPACE OPTIMIZATION SUMMARY:');
        console.log(`   Command header: ${commandHeaderHeight}px (reduced from 80px)`);
        console.log(`   Screen header: ${screenHeaderHeight}px (reduced from 60px)`);
        console.log(`   Content area: ${contentPercentage.toFixed(1)}% of viewport`);
        console.log(`   Space optimization: ${contentPercentage > 80 ? 'EXCELLENT ✅' : contentPercentage > 70 ? 'GOOD ✅' : 'NEEDS MORE WORK ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testSpaceOptimization().catch(console.error);
