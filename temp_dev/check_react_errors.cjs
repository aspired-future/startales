const playwright = require('playwright');

async function checkReactErrors() {
    console.log('🔍 CHECKING FOR REACT ERRORS...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
        });
    });
    
    // Capture page errors
    const pageErrors = [];
    page.on('pageerror', error => {
        pageErrors.push({
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    });
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);
        
        // Check what's actually in the root
        const rootContent = await page.evaluate(() => {
            const root = document.getElementById('root');
            if (!root) return 'NO ROOT ELEMENT';
            
            return {
                hasChildren: root.children.length > 0,
                childrenCount: root.children.length,
                innerHTML: root.innerHTML.substring(0, 500),
                textContent: root.textContent?.substring(0, 200) || ''
            };
        });
        
        console.log('📋 ROOT ELEMENT STATUS:');
        console.log(`   Has Children: ${rootContent.hasChildren}`);
        console.log(`   Children Count: ${rootContent.childrenCount}`);
        console.log(`   Text Content: "${rootContent.textContent}"`);
        console.log(`   HTML Preview: "${rootContent.innerHTML}"`);
        
        // Show recent console messages
        console.log('');
        console.log('📋 CONSOLE MESSAGES (last 10):');
        consoleMessages.slice(-10).forEach(msg => {
            console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
        });
        
        // Show page errors
        console.log('');
        console.log('❌ PAGE ERRORS:');
        if (pageErrors.length === 0) {
            console.log('   No page errors detected');
        } else {
            pageErrors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.message}`);
                if (error.stack) {
                    console.log(`   Stack: ${error.stack.substring(0, 200)}...`);
                }
            });
        }
        
        // Check for specific React error patterns
        const reactErrors = consoleMessages.filter(msg => 
            msg.text.includes('React') || 
            msg.text.includes('Component') || 
            msg.text.includes('render') ||
            msg.text.includes('SimpleWitterFeed')
        );
        
        console.log('');
        console.log('⚛️ REACT-RELATED MESSAGES:');
        if (reactErrors.length === 0) {
            console.log('   No React-specific errors found');
        } else {
            reactErrors.forEach(error => {
                console.log(`[${error.type.toUpperCase()}] ${error.text}`);
            });
        }
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        console.error('❌ Check failed:', error.message);
    }
    
    await browser.close();
}

checkReactErrors().catch(console.error);
