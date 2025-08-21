const playwright = require('playwright');

async function checkReactConsole() {
    console.log('🔍 CHECKING REACT CONSOLE FOR ERRORS...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location()
        });
    });
    
    // Capture page errors
    const pageErrors = [];
    page.on('pageerror', error => {
        pageErrors.push(error.message);
    });
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for React to load
        await page.waitForTimeout(3000);
        
        console.log('');
        console.log('📋 CONSOLE MESSAGES:');
        consoleMessages.forEach(msg => {
            console.log(`${msg.type.toUpperCase()}: ${msg.text}`);
        });
        
        console.log('');
        console.log('❌ PAGE ERRORS:');
        if (pageErrors.length === 0) {
            console.log('✅ No page errors detected');
        } else {
            pageErrors.forEach(error => {
                console.log(`ERROR: ${error}`);
            });
        }
        
        // Check what's actually in the DOM
        const bodyContent = await page.textContent('body');
        console.log('');
        console.log('📄 BODY CONTENT (first 500 chars):');
        console.log(bodyContent.substring(0, 500));
        
        // Check if React root exists
        const rootExists = await page.isVisible('#root');
        console.log('');
        console.log(`🎯 React root element exists: ${rootExists}`);
        
        if (rootExists) {
            const rootContent = await page.textContent('#root');
            console.log('📦 Root content (first 200 chars):');
            console.log(rootContent.substring(0, 200));
        }
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    await browser.close();
}

checkReactConsole().catch(console.error);
