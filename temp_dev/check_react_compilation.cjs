const playwright = require('playwright');

async function checkReactCompilation() {
    console.log('🔍 CHECKING REACT COMPILATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Listen for all console messages
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            
            if (type === 'error') {
                console.log(`   🔴 ERROR: ${text}`);
            } else if (type === 'warning') {
                console.log(`   🟡 WARNING: ${text}`);
            } else if (text.includes('React') || text.includes('Vite') || text.includes('HUD')) {
                console.log(`   ℹ️  INFO: ${text}`);
            }
        });
        
        // Listen for page errors
        page.on('pageerror', error => {
            console.log(`   💥 PAGE ERROR: ${error.message}`);
        });
        
        console.log('   Navigating to React app...');
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);
        
        // Check what's actually rendered
        const bodyContent = await page.evaluate(() => {
            const body = document.body;
            const root = document.getElementById('root');
            
            return {
                bodyHtml: body.innerHTML.substring(0, 500) + '...',
                rootExists: !!root,
                rootContent: root ? root.innerHTML.substring(0, 500) + '...' : 'No root element',
                title: document.title,
                url: window.location.href
            };
        });
        
        console.log('\n📄 PAGE CONTENT:');
        console.log(`   Title: ${bodyContent.title}`);
        console.log(`   URL: ${bodyContent.url}`);
        console.log(`   Root exists: ${bodyContent.rootExists ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Root content: ${bodyContent.rootContent}`);
        
        // Check for specific React components
        const componentCheck = await page.evaluate(() => {
            return {
                hasComprehensiveHUD: !!document.querySelector('.comprehensive-hud'),
                hasHudMain: !!document.querySelector('.hud-main'),
                hasCommandHeader: !!document.querySelector('.command-header'),
                hasLeftPanel: !!document.querySelector('.left-panel'),
                hasCenterPanel: !!document.querySelector('.center-panel'),
                hasRightPanel: !!document.querySelector('.right-panel'),
                hasAnyContent: document.body.children.length > 1
            };
        });
        
        console.log('\n🧩 COMPONENT CHECK:');
        Object.entries(componentCheck).forEach(([key, value]) => {
            console.log(`   ${key}: ${value ? 'YES ✅' : 'NO ❌'}`);
        });
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/react_compilation_check.png', fullPage: true });
        console.log('\n📸 Screenshot saved to temp_dev/react_compilation_check.png');
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Check failed:', error.message);
    }
    
    await browser.close();
}

checkReactCompilation().catch(console.error);
