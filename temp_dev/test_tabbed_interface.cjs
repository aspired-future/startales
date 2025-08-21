const playwright = require('playwright');

async function testTabbedInterface() {
    console.log('📑 TESTING TABBED INTERFACE...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Testing Tab Navigation...');
        const tabButtons = await page.$$('.tab-button');
        console.log(`   Tab buttons found: ${tabButtons.length}`);
        
        const tabTexts = await page.$$eval('.tab-button', buttons => 
            buttons.map(btn => btn.textContent?.trim())
        );
        console.log(`   Tab labels: ${tabTexts.join(', ')}`);
        
        // Test each tab
        const tabs = ['characters', 'events', 'map', 'witter'];
        for (const tab of tabs) {
            console.log(`\n2️⃣ Testing ${tab.toUpperCase()} Tab...`);
            
            // Click the tab
            await page.click(`.tab-button:has-text("${tab.charAt(0).toUpperCase() + tab.slice(1)}")`);
            await page.waitForTimeout(1000);
            
            // Check if tab is active
            const isActive = await page.isVisible(`.tab-button.active:has-text("${tab.charAt(0).toUpperCase() + tab.slice(1)}")`);
            console.log(`   Tab active state: ${isActive}`);
            
            // Check tab content visibility
            const tabContent = await page.isVisible(`.${tab}-tab`);
            console.log(`   Tab content visible: ${tabContent}`);
            
            // Tab-specific tests
            if (tab === 'characters') {
                const characterMessages = await page.$$('.character-message');
                console.log(`   Character messages: ${characterMessages.length}`);
            } else if (tab === 'events') {
                const gameMasterEvents = await page.$$('.gamemaster-event');
                console.log(`   Game master events: ${gameMasterEvents.length}`);
            } else if (tab === 'map') {
                const galaxyIframe = await page.isVisible('.galaxy-iframe');
                console.log(`   Galaxy map iframe: ${galaxyIframe}`);
            } else if (tab === 'witter') {
                const wittItems = await page.$$('.witt-item-container');
                console.log(`   Witter items: ${wittItems.length}`);
                
                // Test infinite scroll in Witter tab
                const wittContent = await page.locator('.witter-tab .embedded-witter .witter-content');
                if (await wittContent.isVisible()) {
                    const initialCount = wittItems.length;
                    await wittContent.evaluate(el => {
                        el.scrollTop = el.scrollHeight - el.clientHeight - 100;
                    });
                    await page.waitForTimeout(2000);
                    
                    const newWittItems = await page.$$('.witt-item-container');
                    console.log(`   Infinite scroll working: ${newWittItems.length > initialCount}`);
                }
            }
        }
        
        console.log('\n3️⃣ Testing Scrolling Issues...');
        
        // Check for nested scrolling
        const scrollingElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const scrollable = [];
            
            for (const el of elements) {
                const style = window.getComputedStyle(el);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && 
                    el.scrollHeight > el.clientHeight) {
                    
                    // Check if this element is inside another scrollable element
                    let parent = el.parentElement;
                    let hasScrollableParent = false;
                    
                    while (parent && parent !== document.body) {
                        const parentStyle = window.getComputedStyle(parent);
                        if ((parentStyle.overflowY === 'auto' || parentStyle.overflowY === 'scroll') && 
                            parent.scrollHeight > parent.clientHeight) {
                            hasScrollableParent = true;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    
                    scrollable.push({
                        className: el.className,
                        tagName: el.tagName,
                        hasScrollableParent,
                        isNested: hasScrollableParent
                    });
                }
            }
            
            return scrollable;
        });
        
        const nestedScrolls = scrollingElements.filter(el => el.isNested);
        console.log(`   Total scrollable elements: ${scrollingElements.length}`);
        console.log(`   Nested scrolling elements: ${nestedScrolls.length}`);
        
        if (nestedScrolls.length > 0) {
            console.log('   ⚠️  Nested scrolling detected:');
            nestedScrolls.forEach((el, i) => {
                console.log(`     ${i+1}. <${el.tagName.toLowerCase()}> class="${el.className}"`);
            });
        } else {
            console.log('   ✅ No nested scrolling detected!');
        }
        
        // Test panel-level scrolling
        const panelScrolling = await page.evaluate(() => {
            const leftPanel = document.querySelector('.left-panel');
            const centerPanel = document.querySelector('.center-panel');
            const rightPanel = document.querySelector('.right-panel');
            const tabContent = document.querySelector('.tab-content');
            
            return {
                leftPanel: leftPanel ? leftPanel.scrollHeight > leftPanel.clientHeight : false,
                centerPanel: centerPanel ? centerPanel.scrollHeight > centerPanel.clientHeight : false,
                rightPanel: rightPanel ? rightPanel.scrollHeight > rightPanel.clientHeight : false,
                tabContent: tabContent ? tabContent.scrollHeight > tabContent.clientHeight : false
            };
        });
        
        console.log(`   Left panel scrollable: ${panelScrolling.leftPanel}`);
        console.log(`   Center panel scrollable: ${panelScrolling.centerPanel}`);
        console.log(`   Right panel scrollable: ${panelScrolling.rightPanel}`);
        console.log(`   Tab content scrollable: ${panelScrolling.tabContent}`);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/tabbed_interface_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/tabbed_interface_test.png');
        
        console.log('\n✅ TABBED INTERFACE TEST RESULTS:');
        console.log(`   Tab buttons: ${tabButtons.length === 4 ? 'WORKING' : 'MISSING'}`);
        console.log(`   Tab switching: ${tabTexts.length === 4 ? 'WORKING' : 'BROKEN'}`);
        console.log(`   Nested scrolling: ${nestedScrolls.length === 0 ? 'FIXED' : 'STILL PRESENT'}`);
        console.log(`   Panel scrolling: ${panelScrolling.tabContent ? 'WORKING' : 'BROKEN'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testTabbedInterface().catch(console.error);
