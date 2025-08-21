const playwright = require('playwright');

async function checkMultipleRoots() {
    console.log('🔍 CHECKING FOR MULTIPLE REACT ROOTS...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Check for multiple root elements
        const rootElements = await page.evaluate(() => {
            const roots = document.querySelectorAll('#root, [id*="root"], [class*="root"]');
            return Array.from(roots).map(el => ({
                id: el.id,
                className: el.className,
                tagName: el.tagName,
                childCount: el.children.length,
                textLength: el.textContent?.length || 0
            }));
        });
        
        console.log('📋 ROOT ELEMENTS FOUND:');
        rootElements.forEach((root, index) => {
            console.log(`   ${index + 1}. <${root.tagName.toLowerCase()}> id="${root.id}" class="${root.className}" children=${root.childCount} textLength=${root.textLength}`);
        });
        
        // Check for multiple React components at the top level
        const topLevelComponents = await page.evaluate(() => {
            const root = document.getElementById('root');
            if (!root) return [];
            
            return Array.from(root.children).map(child => ({
                tagName: child.tagName,
                className: child.className,
                id: child.id,
                textContent: child.textContent?.substring(0, 100) || ''
            }));
        });
        
        console.log('');
        console.log('🏗️ TOP-LEVEL COMPONENTS IN ROOT:');
        topLevelComponents.forEach((comp, index) => {
            console.log(`   ${index + 1}. <${comp.tagName.toLowerCase()}> class="${comp.className}" id="${comp.id}"`);
            console.log(`      Text: "${comp.textContent}..."`);
        });
        
        // Check for multiple WitterFeed instances specifically
        const witterFeedInstances = await page.evaluate(() => {
            // Look for elements that might be WitterFeed instances
            const possibleFeeds = document.querySelectorAll('[class*="witter"], [class*="Witter"], .witter-feed');
            return Array.from(possibleFeeds).map(el => ({
                className: el.className,
                tagName: el.tagName,
                parentClassName: el.parentElement?.className || '',
                textPreview: el.textContent?.substring(0, 50) || ''
            }));
        });
        
        console.log('');
        console.log('🐦 WITTER FEED INSTANCES:');
        witterFeedInstances.forEach((feed, index) => {
            console.log(`   ${index + 1}. <${feed.tagName.toLowerCase()}> class="${feed.className}"`);
            console.log(`      Parent: "${feed.parentClassName}"`);
            console.log(`      Text: "${feed.textPreview}..."`);
        });
        
        // Check React DevTools info if available
        const reactInfo = await page.evaluate(() => {
            // Check if React DevTools are available
            if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
                return {
                    hasReactDevTools: true,
                    fiberRoots: hook.getFiberRoots ? hook.getFiberRoots().size : 'unknown'
                };
            }
            return { hasReactDevTools: false };
        });
        
        console.log('');
        console.log('⚛️ REACT INFO:');
        console.log(`   React DevTools: ${reactInfo.hasReactDevTools ? 'Available' : 'Not Available'}`);
        if (reactInfo.hasReactDevTools) {
            console.log(`   Fiber Roots: ${reactInfo.fiberRoots}`);
        }
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        console.error('❌ Check failed:', error.message);
    }
    
    await browser.close();
}

checkMultipleRoots().catch(console.error);
