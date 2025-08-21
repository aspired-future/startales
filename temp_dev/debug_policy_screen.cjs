const playwright = require('playwright');

async function debugPolicyScreen() {
    console.log('🔍 DEBUGGING POLICY SCREEN...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ CONSOLE ERROR:', msg.text());
        } else if (msg.type() === 'warn') {
            console.log('⚠️ CONSOLE WARN:', msg.text());
        }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
        console.log('❌ PAGE ERROR:', error.message);
    });
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO POLICY SCREEN...');
        
        // Navigate to Policy screen
        await page.click('.accordion-header:has(.accordion-title:has-text("GOVERNMENT"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Policies")');
        await page.waitForTimeout(3000);
        
        // Check if policy screen loaded
        const policyScreenVisible = await page.isVisible('.policy-screen');
        console.log(`Policy screen container: ${policyScreenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        // Check what's actually in the screen
        const screenContent = await page.evaluate(() => {
            const screen = document.querySelector('.policy-screen');
            if (!screen) return 'No policy screen found';
            
            const tabs = document.querySelectorAll('.view-tabs .tab');
            const tabContent = document.querySelector('.tab-content');
            const loading = document.querySelector('.loading');
            const error = document.querySelector('.error');
            
            return {
                hasScreen: !!screen,
                tabCount: tabs.length,
                tabTexts: Array.from(tabs).map(t => t.textContent.trim()),
                hasTabContent: !!tabContent,
                tabContentHTML: tabContent ? tabContent.innerHTML.substring(0, 200) : 'No tab content',
                hasLoading: !!loading,
                hasError: !!error,
                errorText: error ? error.textContent : null
            };
        });
        
        console.log('2️⃣ SCREEN CONTENT ANALYSIS:');
        console.log(`   Screen exists: ${screenContent.hasScreen}`);
        console.log(`   Tab count: ${screenContent.tabCount}`);
        console.log(`   Tab texts: ${screenContent.tabTexts.join(', ')}`);
        console.log(`   Has tab content: ${screenContent.hasTabContent}`);
        console.log(`   Has loading: ${screenContent.hasLoading}`);
        console.log(`   Has error: ${screenContent.hasError}`);
        if (screenContent.errorText) console.log(`   Error text: ${screenContent.errorText}`);
        console.log(`   Tab content preview: ${screenContent.tabContentHTML}`);
        
        // Check React component state
        const reactState = await page.evaluate(() => {
            const screen = document.querySelector('.policy-screen');
            if (!screen) return 'No screen';
            
            // Try to access React fiber to see component state
            const reactKey = Object.keys(screen).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber'));
            if (reactKey) {
                const fiber = screen[reactKey];
                return {
                    hasReactFiber: true,
                    componentName: fiber.type?.name || 'Unknown'
                };
            }
            return { hasReactFiber: false };
        });
        
        console.log('3️⃣ REACT STATE:');
        console.log(`   React fiber: ${reactState.hasReactFiber ? 'YES' : 'NO'}`);
        if (reactState.componentName) console.log(`   Component: ${reactState.componentName}`);
        
        // Check if BaseScreen is working
        const baseScreenElements = await page.evaluate(() => {
            return {
                hasScreenHeader: !!document.querySelector('.screen-header'),
                hasScreenTitle: !!document.querySelector('.screen-title'),
                hasApiInfo: !!document.querySelector('.api-info'),
                hasRefreshBtn: !!document.querySelector('.refresh-btn')
            };
        });
        
        console.log('4️⃣ BASE SCREEN ELEMENTS:');
        console.log(`   Screen header: ${baseScreenElements.hasScreenHeader ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Screen title: ${baseScreenElements.hasScreenTitle ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API info: ${baseScreenElements.hasApiInfo ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Refresh button: ${baseScreenElements.hasRefreshBtn ? 'YES ✅' : 'NO ❌'}`);
        
        // Try clicking refresh to see if that helps
        if (baseScreenElements.hasRefreshBtn) {
            console.log('5️⃣ TRYING REFRESH...');
            await page.click('.refresh-btn');
            await page.waitForTimeout(2000);
            
            const afterRefresh = await page.evaluate(() => {
                const tabContent = document.querySelector('.tab-content');
                const loading = document.querySelector('.loading');
                const error = document.querySelector('.error');
                const policiesView = document.querySelector('.policies-view');
                
                return {
                    hasTabContent: !!tabContent,
                    hasLoading: !!loading,
                    hasError: !!error,
                    hasPoliciesView: !!policiesView,
                    tabContentHTML: tabContent ? tabContent.innerHTML.substring(0, 200) : 'No content'
                };
            });
            
            console.log(`   After refresh - has content: ${afterRefresh.hasTabContent}`);
            console.log(`   After refresh - has loading: ${afterRefresh.hasLoading}`);
            console.log(`   After refresh - has error: ${afterRefresh.hasError}`);
            console.log(`   After refresh - has policies view: ${afterRefresh.hasPoliciesView}`);
            console.log(`   Content preview: ${afterRefresh.tabContentHTML}`);
        }
        
        // Take screenshot for debugging
        await page.screenshot({ path: 'temp_dev/policy_screen_debug.png', fullPage: false });
        console.log('\n📸 Debug screenshot saved to temp_dev/policy_screen_debug.png');
        
        console.log('\n🔍 KEEPING BROWSER OPEN FOR MANUAL INSPECTION...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugPolicyScreen().catch(console.error);
