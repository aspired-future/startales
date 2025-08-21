const playwright = require('playwright');

async function testHeaderOptimization() {
    console.log('📏 TESTING HEADER OPTIMIZATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ CHECKING MAIN HEADER...');
        
        // Check main header title
        const mainTitle = await page.textContent('.game-title');
        console.log(`   Main title: "${mainTitle}"`);
        console.log(`   Title shortened: ${mainTitle.includes('WITTY GALAXY') && !mainTitle.includes('COMMAND CENTER') ? 'YES ✅' : 'NO ❌'}`);
        
        // Measure main header height
        const commandHeaderHeight = await page.evaluate(() => {
            const header = document.querySelector('.command-header');
            return header ? header.offsetHeight : 0;
        });
        console.log(`   Command header height: ${commandHeaderHeight}px`);
        
        console.log('\n2️⃣ CHECKING SCREEN HEADERS...');
        
        // Navigate to Military screen to test screen header
        await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Military")');
        await page.waitForTimeout(2000);
        
        // Check screen header title
        const screenTitle = await page.textContent('.screen-title h2');
        console.log(`   Screen title: "${screenTitle}"`);
        console.log(`   Military title correct: ${screenTitle === 'Military Command' ? 'YES ✅' : 'NO ❌'}`);
        
        // Measure screen header height
        const screenHeaderHeight = await page.evaluate(() => {
            const header = document.querySelector('.screen-header');
            return header ? header.offsetHeight : 0;
        });
        console.log(`   Screen header height: ${screenHeaderHeight}px`);
        
        console.log('\n3️⃣ MEASURING TOTAL SPACE USAGE...');
        
        const spaceMetrics = await page.evaluate(() => {
            const viewport = window.innerHeight;
            const hudMain = document.querySelector('.hud-main');
            const centerPanel = document.querySelector('.center-panel');
            const panelScreen = document.querySelector('.panel-screen');
            
            return {
                viewportHeight: viewport,
                hudMainHeight: hudMain ? hudMain.offsetHeight : 0,
                centerPanelHeight: centerPanel ? centerPanel.offsetHeight : 0,
                panelScreenHeight: panelScreen ? panelScreen.offsetHeight : 0
            };
        });
        
        const totalHeaderSpace = commandHeaderHeight + screenHeaderHeight;
        const availableContentSpace = spaceMetrics.viewportHeight - totalHeaderSpace;
        const contentPercentage = (availableContentSpace / spaceMetrics.viewportHeight) * 100;
        
        console.log(`   Viewport height: ${spaceMetrics.viewportHeight}px`);
        console.log(`   Total header space: ${totalHeaderSpace}px`);
        console.log(`   Available content space: ${availableContentSpace}px`);
        console.log(`   Content percentage: ${contentPercentage.toFixed(1)}%`);
        
        console.log('\n4️⃣ TESTING OTHER SCREENS...');
        
        // Test Cabinet screen
        await page.click('.accordion-header:has(.accordion-title:has-text("GOVERNMENT"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Cabinet")');
        await page.waitForTimeout(2000);
        
        const cabinetTitle = await page.textContent('.screen-title h2');
        console.log(`   Cabinet title: "${cabinetTitle}"`);
        
        // Test Demographics screen
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Demographics")');
        await page.waitForTimeout(2000);
        
        const demographicsTitle = await page.textContent('.screen-title h2');
        console.log(`   Demographics title: "${demographicsTitle}"`);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/header_optimization_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/header_optimization_test.png');
        
        console.log('\n🎉 HEADER OPTIMIZATION SUMMARY:');
        console.log(`   Main title shortened: ${mainTitle.includes('WITTY GALAXY') && !mainTitle.includes('COMMAND CENTER') ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Command header: ${commandHeaderHeight}px`);
        console.log(`   Screen header: ${screenHeaderHeight}px`);
        console.log(`   Content area: ${contentPercentage.toFixed(1)}% of viewport`);
        console.log(`   Space efficiency: ${contentPercentage > 85 ? 'EXCELLENT ✅' : contentPercentage > 75 ? 'GOOD ✅' : 'NEEDS WORK ❌'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testHeaderOptimization().catch(console.error);
