const playwright = require('playwright');

async function debugScreenSystem() {
    console.log('🔍 DEBUGGING SCREEN SYSTEM...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ CHECKING PAGE STRUCTURE...');
        
        // Check if the main HUD is loaded
        const hudMain = await page.isVisible('.hud-main');
        console.log(`   HUD main container: ${hudMain ? 'YES ✅' : 'NO ❌'}`);
        
        // Check left panel
        const leftPanel = await page.isVisible('.left-panel');
        console.log(`   Left panel: ${leftPanel ? 'YES ✅' : 'NO ❌'}`);
        
        // Check accordion sections
        const accordionSections = await page.$$('.accordion-section');
        console.log(`   Accordion sections found: ${accordionSections.length}`);
        
        // List all accordion headers
        const accordionHeaders = await page.$$eval('.accordion-header', headers => 
            headers.map(h => h.textContent?.trim())
        );
        console.log('   Accordion headers:', accordionHeaders);
        
        // Check for specific government header
        const governmentHeader = await page.isVisible('.accordion-header:has(.accordion-title:has-text("GOVERNMENT"))');
        console.log(`   Government header found: ${governmentHeader ? 'YES ✅' : 'NO ❌'}`);
        
        // Try alternative selector
        const governmentHeaderAlt = await page.$$eval('.accordion-title', titles => 
            titles.some(t => t.textContent?.includes('GOVERNMENT'))
        );
        console.log(`   Government title found (alt): ${governmentHeaderAlt ? 'YES ✅' : 'NO ❌'}`);
        
        console.log('\n2️⃣ CHECKING CONSOLE ERRORS...');
        
        // Listen for console errors
        const consoleMessages = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleMessages.push(msg.text());
            }
        });
        
        await page.waitForTimeout(2000);
        
        if (consoleMessages.length > 0) {
            console.log('   Console errors found:');
            consoleMessages.forEach(msg => console.log(`     ❌ ${msg}`));
        } else {
            console.log('   No console errors ✅');
        }
        
        console.log('\n3️⃣ TESTING MANUAL INTERACTION...');
        
        // Try clicking on the first accordion header
        if (accordionHeaders.length > 0) {
            console.log(`   Attempting to click on: ${accordionHeaders[0]}`);
            
            try {
                await page.click('.accordion-header', { timeout: 5000 });
                await page.waitForTimeout(1000);
                
                const expanded = await page.isVisible('.accordion-content');
                console.log(`   Accordion expanded: ${expanded ? 'YES ✅' : 'NO ❌'}`);
                
                if (expanded) {
                    const navItems = await page.$$('.nav-item');
                    console.log(`   Navigation items found: ${navItems.length}`);
                    
                    if (navItems.length > 0) {
                        console.log('   Attempting to click first nav item...');
                        await page.click('.nav-item');
                        await page.waitForTimeout(2000);
                        
                        const panelScreen = await page.isVisible('.panel-screen');
                        console.log(`   Panel screen loaded: ${panelScreen ? 'YES ✅' : 'NO ❌'}`);
                    }
                }
            } catch (clickError) {
                console.log(`   Click failed: ${clickError.message}`);
            }
        }
        
        // Take screenshot for debugging
        await page.screenshot({ path: 'temp_dev/debug_screen_system.png', fullPage: false });
        console.log('\n📸 Debug screenshot saved to temp_dev/debug_screen_system.png');
        
        console.log('\n💡 Browser will stay open for manual inspection...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugScreenSystem().catch(console.error);
