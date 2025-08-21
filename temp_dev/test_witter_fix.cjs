const playwright = require('playwright');

async function testWitterFix() {
    console.log('🔍 TESTING WITTER DUPLICATION FIX...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Count visible Witter headers
        const visibleHeaders = await page.$$eval('.witter-header', headers => 
            headers.filter(h => {
                const style = window.getComputedStyle(h);
                return style.display !== 'none' && style.visibility !== 'hidden';
            }).length
        );
        
        // Count all Witter sections
        const witterSections = await page.$$('.witter-section');
        const witterFeeds = await page.$$('.witter-feed');
        
        // Count specific UI elements that were duplicated
        const exploreButtons = await page.$$eval('button', buttons => 
            buttons.filter(b => b.textContent?.includes('Explore')).length
        );
        
        const populationButtons = await page.$$eval('button', buttons => 
            buttons.filter(b => b.textContent?.includes('Population')).length
        );
        
        const witterTitles = await page.$$eval('h1, h2, h3', headers => 
            headers.filter(h => h.textContent?.toLowerCase().includes('witter')).length
        );
        
        console.log('📊 WITTER ELEMENT COUNT AFTER FIX:');
        console.log(`   Visible Witter Headers: ${visibleHeaders}`);
        console.log(`   Witter Sections: ${witterSections.length}`);
        console.log(`   Witter Feeds: ${witterFeeds.length}`);
        console.log(`   Explore Buttons: ${exploreButtons}`);
        console.log(`   Population Buttons: ${populationButtons}`);
        console.log(`   Witter Titles: ${witterTitles}`);
        
        // Check for error messages
        const errorElements = await page.$$('.witter-error');
        console.log(`   Error Messages: ${errorElements.length}`);
        
        if (errorElements.length > 0) {
            const errorText = await page.$eval('.witter-error', el => el.textContent);
            console.log(`   Error Text: "${errorText}"`);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/witter_fix_screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved to temp_dev/witter_fix_screenshot.png');
        
        // Determine if fix was successful
        console.log('');
        if (visibleHeaders <= 1 && witterSections.length === 1 && witterTitles <= 2) {
            console.log('✅ SUCCESS: Witter duplication appears to be fixed!');
            console.log('   - Only 1 or fewer visible headers');
            console.log('   - Only 1 Witter section');
            console.log('   - Minimal title duplication');
        } else {
            console.log('❌ ISSUE: Witter duplication still exists');
            console.log('   - Multiple headers or sections detected');
        }
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testWitterFix().catch(console.error);
