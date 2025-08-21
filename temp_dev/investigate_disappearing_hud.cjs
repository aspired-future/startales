const playwright = require('playwright');

async function investigateDisappearingHUD() {
    console.log('🔍 INVESTIGATING DISAPPEARING HUD ISSUE...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Capture all console messages with timestamps
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            timestamp: new Date().toISOString(),
            type: msg.type(),
            text: msg.text()
        });
    });
    
    // Capture page errors with timestamps
    const pageErrors = [];
    page.on('pageerror', error => {
        pageErrors.push({
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack
        });
    });
    
    try {
        console.log('1️⃣ Loading page...');
        await page.goto('http://localhost:5174');
        
        console.log('2️⃣ Waiting for initial load...');
        await page.waitForLoadState('domcontentloaded');
        
        // Check if HUD appears initially
        console.log('3️⃣ Checking initial HUD visibility...');
        await page.waitForTimeout(1000);
        
        const initialHudVisible = await page.isVisible('.comprehensive-hud').catch(() => false);
        const initialTitleVisible = await page.isVisible('.game-title').catch(() => false);
        
        console.log(`📋 Initial HUD visible: ${initialHudVisible}`);
        console.log(`🌌 Initial title visible: ${initialTitleVisible}`);
        
        // Monitor for 10 seconds to see when it disappears
        console.log('4️⃣ Monitoring HUD visibility over time...');
        
        for (let i = 0; i < 10; i++) {
            await page.waitForTimeout(1000);
            
            const hudVisible = await page.isVisible('.comprehensive-hud').catch(() => false);
            const titleVisible = await page.isVisible('.game-title').catch(() => false);
            const rootContent = await page.textContent('#root').catch(() => 'ERROR');
            
            console.log(`⏰ ${i+1}s: HUD=${hudVisible}, Title=${titleVisible}, Root=${rootContent.length > 0 ? 'HAS_CONTENT' : 'EMPTY'}`);
            
            if (!hudVisible && initialHudVisible) {
                console.log(`❌ HUD DISAPPEARED at ${i+1} seconds!`);
                break;
            }
        }
        
        // Check what's actually in the DOM now
        const finalRootContent = await page.textContent('#root').catch(() => 'ERROR');
        const finalBodyContent = await page.textContent('body').catch(() => 'ERROR');
        
        console.log('');
        console.log('📄 FINAL DOM STATE:');
        console.log(`Root content length: ${finalRootContent.length}`);
        console.log(`Root content preview: ${finalRootContent.substring(0, 200)}`);
        
        // Show recent console messages
        console.log('');
        console.log('📋 RECENT CONSOLE MESSAGES:');
        consoleMessages.slice(-10).forEach(msg => {
            console.log(`${msg.timestamp} [${msg.type.toUpperCase()}]: ${msg.text}`);
        });
        
        // Show page errors
        console.log('');
        console.log('❌ PAGE ERRORS:');
        if (pageErrors.length === 0) {
            console.log('✅ No page errors detected');
        } else {
            pageErrors.forEach(error => {
                console.log(`${error.timestamp}: ${error.message}`);
                if (error.stack) {
                    console.log(`Stack: ${error.stack.substring(0, 200)}...`);
                }
            });
        }
        
        // Take a screenshot of current state
        await page.screenshot({ path: 'temp_dev/disappearing_hud_screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved to temp_dev/disappearing_hud_screenshot.png');
        
        console.log('');
        console.log('💡 Browser will stay open for manual inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Investigation failed:', error.message);
    }
    
    await browser.close();
}

investigateDisappearingHUD().catch(console.error);
