const playwright = require('playwright');

async function debugTradeScreen() {
    console.log('🔍 DEBUGGING TRADE SCREEN...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            console.log(`❌ Console Error: ${text}`);
        } else if (type === 'warning') {
            console.log(`⚠️ Console Warning: ${text}`);
        } else if (text.includes('Trade') || text.includes('trade')) {
            console.log(`📝 Console: ${text}`);
        }
    });
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ CHECKING INITIAL STATE...');
        
        // Check if HUD loaded
        const hudVisible = await page.isVisible('.comprehensive-hud');
        console.log(`   HUD loaded: ${hudVisible ? 'YES ✅' : 'NO ❌'}`);
        
        // Check if Economy section exists
        const economySection = await page.isVisible('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
        console.log(`   Economy section: ${economySection ? 'YES ✅' : 'NO ❌'}`);
        
        if (economySection) {
            // Open Economy section
            await page.click('.accordion-header:has(.accordion-title:has-text("ECONOMY"))');
            await page.waitForTimeout(1000);
            
            // Check if Trade option exists
            const tradeOption = await page.isVisible('.nav-item:has-text("Trade")');
            console.log(`   Trade option: ${tradeOption ? 'YES ✅' : 'NO ❌'}`);
            
            if (tradeOption) {
                console.log('\n2️⃣ ATTEMPTING TO LOAD TRADE SCREEN...');
                
                // Click Trade option
                await page.click('.nav-item:has-text("Trade")');
                await page.waitForTimeout(3000);
                
                // Check what actually loaded
                const panelScreen = await page.isVisible('.panel-screen');
                console.log(`   Panel screen: ${panelScreen ? 'YES ✅' : 'NO ❌'}`);
                
                const tradeScreen = await page.isVisible('.trade-screen');
                console.log(`   Trade screen: ${tradeScreen ? 'YES ✅' : 'NO ❌'}`);
                
                const placeholderScreen = await page.isVisible('.placeholder-screen');
                console.log(`   Placeholder screen: ${placeholderScreen ? 'YES ✅' : 'NO ❌'}`);
                
                // Check screen content
                const screenContent = await page.evaluate(() => {
                    const panelScreen = document.querySelector('.panel-screen');
                    if (panelScreen) {
                        return {
                            innerHTML: panelScreen.innerHTML.substring(0, 200) + '...',
                            className: panelScreen.className,
                            childCount: panelScreen.children.length
                        };
                    }
                    return null;
                });
                
                if (screenContent) {
                    console.log(`   Panel screen content: ${screenContent.childCount} children`);
                    console.log(`   Panel screen classes: ${screenContent.className}`);
                } else {
                    console.log(`   No panel screen content found`);
                }
                
                // Check for any error messages
                const errorMessages = await page.$$eval('[class*="error"], .error', elements => 
                    elements.map(el => el.textContent)
                );
                
                if (errorMessages.length > 0) {
                    console.log(`   Error messages: ${errorMessages.join(', ')}`);
                }
            }
        }
        
        console.log('\n3️⃣ CHECKING SCREEN FACTORY...');
        
        // Check if screen factory is working
        const screenFactoryTest = await page.evaluate(() => {
            // Try to access the screen registry
            return {
                hasCreateScreen: typeof window.createScreen !== 'undefined',
                currentPanel: document.querySelector('.center-panel')?.getAttribute('data-active-panel') || 'unknown'
            };
        });
        
        console.log(`   Screen factory available: ${screenFactoryTest.hasCreateScreen ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Current panel: ${screenFactoryTest.currentPanel}`);
        
        // Take screenshot for debugging
        await page.screenshot({ path: 'temp_dev/trade_screen_debug.png', fullPage: false });
        console.log('\n📸 Debug screenshot saved to temp_dev/trade_screen_debug.png');
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugTradeScreen().catch(console.error);
