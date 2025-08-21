const playwright = require('playwright');

async function testAccordionDesign() {
    console.log('🪗 TESTING ACCORDION DESIGN...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Accordion Structure...');
        
        // Check accordion sections
        const accordionSections = await page.$$('.accordion-section');
        const accordionHeaders = await page.$$('.accordion-header');
        
        console.log(`   Accordion sections: ${accordionSections.length}`);
        console.log(`   Accordion headers: ${accordionHeaders.length}`);
        
        // Get accordion titles
        const accordionTitles = await page.$$eval('.accordion-title', 
            elements => elements.map(el => el.textContent?.trim())
        );
        
        console.log(`   Accordion titles: ${accordionTitles.join(', ')}`);
        
        console.log('\n2️⃣ Testing Accordion Functionality...');
        
        // Test clicking different accordions
        const testAccordions = ['QUICK ACTIONS', 'GOVERNMENT', 'ECONOMY'];
        
        for (const title of testAccordions) {
            console.log(`   Testing ${title} accordion...`);
            
            // Click the accordion header
            await page.click(`.accordion-header:has(.accordion-title:text("${title}"))`);
            await page.waitForTimeout(500);
            
            // Check if content is visible
            const isExpanded = await page.isVisible(`.accordion-header:has(.accordion-title:text("${title}")).expanded`);
            const hasContent = await page.isVisible(`.accordion-section:has(.accordion-title:text("${title}")) .accordion-content`);
            
            console.log(`     Expanded: ${isExpanded ? 'YES' : 'NO'}`);
            console.log(`     Content visible: ${hasContent ? 'YES' : 'NO'}`);
            
            if (hasContent) {
                const navItems = await page.$$eval(
                    `.accordion-section:has(.accordion-title:text("${title}")) .nav-item`,
                    elements => elements.length
                );
                console.log(`     Nav items: ${navItems}`);
            }
        }
        
        console.log('\n3️⃣ Testing Left Panel Height...');
        
        const leftPanelInfo = await page.evaluate(() => {
            const leftPanel = document.querySelector('.left-panel');
            if (!leftPanel) return 'No left panel found';
            
            return {
                scrollable: leftPanel.scrollHeight > leftPanel.clientHeight,
                scrollHeight: leftPanel.scrollHeight,
                clientHeight: leftPanel.clientHeight,
                ratio: (leftPanel.scrollHeight / leftPanel.clientHeight).toFixed(2)
            };
        });
        
        console.log('   Left panel dimensions:', leftPanelInfo);
        
        console.log('\n4️⃣ Testing Accordion Collapse/Expand...');
        
        // Test that only one accordion can be open at a time
        await page.click('.accordion-header:has(.accordion-title:text("QUICK ACTIONS"))');
        await page.waitForTimeout(300);
        await page.click('.accordion-header:has(.accordion-title:text("GOVERNMENT"))');
        await page.waitForTimeout(300);
        
        const expandedAccordions = await page.$$eval('.accordion-header.expanded', 
            elements => elements.map(el => el.querySelector('.accordion-title')?.textContent?.trim())
        );
        
        console.log(`   Expanded accordions: ${expandedAccordions.join(', ')}`);
        console.log(`   Only one expanded: ${expandedAccordions.length === 1 ? 'YES ✅' : 'NO ❌'}`);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/accordion_design_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/accordion_design_test.png');
        
        console.log('\n✅ ACCORDION TEST RESULTS:');
        console.log(`   Accordion sections created: ${accordionSections.length >= 8 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Accordion functionality: ${expandedAccordions.length === 1 ? 'WORKING ✅' : 'BROKEN ❌'}`);
        console.log(`   Left panel fits screen: ${leftPanelInfo.scrollable ? 'NEEDS MORE WORK ⚠️' : 'FITS ✅'}`);
        console.log(`   Height ratio: ${leftPanelInfo.ratio} (should be close to 1.0)`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testAccordionDesign().catch(console.error);
