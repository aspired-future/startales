const playwright = require('playwright');

async function debugCommunicationsNavigation() {
    console.log('🔍 DEBUGGING COMMUNICATIONS NAVIGATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ CHECKING COMMUNICATIONS SECTION...');
        
        // Open Communications accordion
        await page.click('.accordion-header:has(.accordion-title:has-text("COMMUNICATIONS"))');
        await page.waitForTimeout(1000);
        
        // Get all navigation items in Communications section
        const navItems = await page.$$eval('.accordion-content:has(.accordion-title:has-text("COMMUNICATIONS")) .nav-item', items => 
            items.map(item => item.textContent.trim())
        );
        
        console.log(`   Available nav items: ${navItems.join(', ')}`);
        console.log(`   Nav item count: ${navItems.length}`);
        
        // Check if "Communications Hub" exists
        const commHubExists = navItems.some(item => item.includes('Communications Hub'));
        console.log(`   "Communications Hub" exists: ${commHubExists ? 'YES ✅' : 'NO ❌'}`);
        
        // Check if "Communications" exists (without Hub)
        const commExists = navItems.some(item => item === 'Communications' || item.includes('Communications'));
        console.log(`   "Communications" exists: ${commExists ? 'YES ✅' : 'NO ❌'}`);
        
        // Try clicking the first communications-related item
        if (navItems.length > 0) {
            const firstCommItem = navItems.find(item => item.toLowerCase().includes('comm'));
            if (firstCommItem) {
                console.log(`   Trying to click: "${firstCommItem}"`);
                await page.click(`.nav-item:has-text("${firstCommItem}")`);
                await page.waitForTimeout(3000);
                
                // Check what screen loaded
                const screenContent = await page.evaluate(() => {
                    const screen = document.querySelector('.panel-screen');
                    if (!screen) return 'No screen loaded';
                    
                    const commScreen = document.querySelector('.communications-screen');
                    const placeholder = document.querySelector('.placeholder-screen');
                    
                    return {
                        hasCommScreen: !!commScreen,
                        hasPlaceholder: !!placeholder,
                        innerHTML: screen.innerHTML.substring(0, 200)
                    };
                });
                
                console.log(`   Communications screen loaded: ${screenContent.hasCommScreen ? 'YES ✅' : 'NO ❌'}`);
                console.log(`   Placeholder screen: ${screenContent.hasPlaceholder ? 'YES' : 'NO'}`);
                console.log(`   Screen content preview: ${screenContent.innerHTML}`);
            }
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/communications_navigation_debug.png', fullPage: false });
        console.log('\n📸 Debug screenshot saved to temp_dev/communications_navigation_debug.png');
        
        console.log('\n🔍 KEEPING BROWSER OPEN FOR MANUAL INSPECTION...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugCommunicationsNavigation().catch(console.error);
