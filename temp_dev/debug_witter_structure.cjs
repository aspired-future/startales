const playwright = require('playwright');

async function debugWitterStructure() {
    console.log('🔍 DEBUGGING WITTER STRUCTURE IN DETAIL...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Get the exact DOM structure of Witter elements
        const witterStructure = await page.evaluate(() => {
            const findWitterElements = (element, depth = 0, maxDepth = 5) => {
                if (depth > maxDepth) return [];
                
                let results = [];
                const className = element.className || '';
                const id = element.id || '';
                
                // Check if this element is Witter-related
                if (className.includes('witter') || className.includes('Witter') || id.includes('witter')) {
                    results.push({
                        tagName: element.tagName,
                        className: className,
                        id: id,
                        depth: depth,
                        textPreview: element.textContent?.substring(0, 100) || '',
                        childrenCount: element.children.length,
                        path: getElementPath(element)
                    });
                }
                
                // Recursively check children
                for (const child of element.children) {
                    results = results.concat(findWitterElements(child, depth + 1, maxDepth));
                }
                
                return results;
            };
            
            const getElementPath = (element) => {
                const path = [];
                let current = element;
                while (current && current !== document.body) {
                    let selector = current.tagName.toLowerCase();
                    if (current.id) selector += `#${current.id}`;
                    if (current.className) selector += `.${current.className.split(' ')[0]}`;
                    path.unshift(selector);
                    current = current.parentElement;
                }
                return path.join(' > ');
            };
            
            return findWitterElements(document.body);
        });
        
        console.log('🏗️ WITTER DOM STRUCTURE:');
        witterStructure.forEach((element, index) => {
            const indent = '  '.repeat(element.depth);
            console.log(`${index + 1}. ${indent}<${element.tagName.toLowerCase()}> class="${element.className}" id="${element.id}"`);
            console.log(`${indent}   Path: ${element.path}`);
            console.log(`${indent}   Children: ${element.childrenCount}, Text: "${element.textPreview}..."`);
            console.log('');
        });
        
        // Count specific types
        const feedCount = witterStructure.filter(el => el.className.includes('witter-feed')).length;
        const headerCount = witterStructure.filter(el => el.className.includes('witter-header')).length;
        const contentCount = witterStructure.filter(el => el.className.includes('witter-content')).length;
        const listCount = witterStructure.filter(el => el.className.includes('witter-list')).length;
        
        console.log('📊 ELEMENT COUNTS:');
        console.log(`   Witter Feeds: ${feedCount}`);
        console.log(`   Witter Headers: ${headerCount}`);
        console.log(`   Witter Content: ${contentCount}`);
        console.log(`   Witter Lists: ${listCount}`);
        
        // Check for React component instances
        const reactInfo = await page.evaluate(() => {
            // Try to find React fiber nodes
            const root = document.getElementById('root');
            if (root && root._reactInternalFiber) {
                return { hasReactFiber: true };
            } else if (root && root._reactInternalInstance) {
                return { hasReactInstance: true };
            }
            return { noReactInfo: true };
        });
        
        console.log('');
        console.log('⚛️ REACT COMPONENT INFO:');
        console.log(JSON.stringify(reactInfo, null, 2));
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugWitterStructure().catch(console.error);
