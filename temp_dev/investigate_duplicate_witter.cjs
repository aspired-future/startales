const playwright = require('playwright');

async function investigateDuplicateWitter() {
    console.log('🔍 INVESTIGATING DUPLICATE WITTER FEEDS...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('1️⃣ Loading page...');
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Count all Witter-related elements
        console.log('2️⃣ Counting Witter elements...');
        
        const witterFeeds = await page.$$('.witter-feed, [class*="witter"], [class*="Witter"]');
        const wittItems = await page.$$('.witt-item, [class*="witt-item"]');
        const witterHeaders = await page.$$('.witter-header, [class*="witter-header"]');
        const witterSections = await page.$$('.witter-section, [class*="witter-section"]');
        
        console.log(`📊 WITTER ELEMENT COUNT:`);
        console.log(`   Witter Feeds: ${witterFeeds.length}`);
        console.log(`   Witt Items: ${wittItems.length}`);
        console.log(`   Witter Headers: ${witterHeaders.length}`);
        console.log(`   Witter Sections: ${witterSections.length}`);
        
        // Get text content of each Witter section
        console.log('');
        console.log('3️⃣ Analyzing Witter section content...');
        
        for (let i = 0; i < witterSections.length; i++) {
            const sectionText = await witterSections[i].textContent();
            console.log(`Section ${i + 1}: ${sectionText.substring(0, 100)}...`);
        }
        
        // Check for duplicate headers
        console.log('');
        console.log('4️⃣ Checking for duplicate headers...');
        
        const allHeaders = await page.$$('h1, h2, h3');
        const headerTexts = [];
        
        for (const header of allHeaders) {
            const text = await header.textContent();
            if (text.toLowerCase().includes('witter') || text.toLowerCase().includes('social')) {
                headerTexts.push(text);
            }
        }
        
        console.log('Witter-related headers found:');
        headerTexts.forEach((text, index) => {
            console.log(`   ${index + 1}. "${text}"`);
        });
        
        // Check DOM structure
        console.log('');
        console.log('5️⃣ Checking DOM structure...');
        
        const bodyHTML = await page.evaluate(() => {
            // Get a simplified view of the structure
            const body = document.body;
            const getStructure = (element, depth = 0) => {
                if (depth > 3) return '';
                const indent = '  '.repeat(depth);
                let result = `${indent}<${element.tagName.toLowerCase()}`;
                if (element.className) result += ` class="${element.className}"`;
                if (element.id) result += ` id="${element.id}"`;
                result += '>\n';
                
                // Only show first few children to avoid too much output
                const children = Array.from(element.children).slice(0, 5);
                for (const child of children) {
                    if (child.className && (child.className.includes('witter') || child.className.includes('Witter'))) {
                        result += getStructure(child, depth + 1);
                    }
                }
                return result;
            };
            return getStructure(body);
        });
        
        console.log('DOM structure (Witter-related elements):');
        console.log(bodyHTML);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/duplicate_witter_screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved to temp_dev/duplicate_witter_screenshot.png');
        
        console.log('');
        console.log('💡 Browser will stay open for manual inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Investigation failed:', error.message);
    }
    
    await browser.close();
}

investigateDuplicateWitter().catch(console.error);
