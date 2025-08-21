const playwright = require('playwright');

async function checkRightPanel() {
    console.log('🔍 CHECKING RIGHT PANEL STATUS...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Check for right panel
        const rightPanel = await page.$('.right-panel');
        const rightPanelVisible = await page.isVisible('.right-panel').catch(() => false);
        const rightPanelContent = rightPanel ? await rightPanel.textContent() : 'NOT FOUND';
        
        console.log('📊 RIGHT PANEL STATUS:');
        console.log(`   Exists: ${rightPanel ? 'YES' : 'NO'}`);
        console.log(`   Visible: ${rightPanelVisible}`);
        console.log(`   Content Length: ${rightPanelContent.length}`);
        console.log(`   Content Preview: "${rightPanelContent.substring(0, 200)}..."`);
        
        // Check main layout structure
        const hudMain = await page.$('.hud-main');
        const hudMainChildren = hudMain ? await hudMain.$$('> *') : [];
        
        console.log('');
        console.log('🏗️ HUD MAIN STRUCTURE:');
        console.log(`   HUD Main exists: ${hudMain ? 'YES' : 'NO'}`);
        console.log(`   Direct children: ${hudMainChildren.length}`);
        
        for (let i = 0; i < hudMainChildren.length; i++) {
            const child = hudMainChildren[i];
            const className = await child.getAttribute('class');
            const tagName = await child.evaluate(el => el.tagName);
            console.log(`   ${i + 1}. <${tagName.toLowerCase()}> class="${className}"`);
        }
        
        // Check if there are any CSS issues
        if (rightPanel) {
            const styles = await page.evaluate(() => {
                const panel = document.querySelector('.right-panel');
                if (!panel) return null;
                const computed = window.getComputedStyle(panel);
                return {
                    display: computed.display,
                    visibility: computed.visibility,
                    width: computed.width,
                    height: computed.height,
                    position: computed.position,
                    right: computed.right,
                    zIndex: computed.zIndex
                };
            });
            
            console.log('');
            console.log('🎨 RIGHT PANEL CSS:');
            console.log(JSON.stringify(styles, null, 2));
        }
        
        // Check for any JavaScript errors
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.waitForTimeout(2000);
        
        if (errors.length > 0) {
            console.log('');
            console.log('❌ JAVASCRIPT ERRORS:');
            errors.forEach(error => console.log(`   ${error}`));
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/right_panel_check.png', fullPage: true });
        console.log('');
        console.log('📸 Screenshot saved to temp_dev/right_panel_check.png');
        
        console.log('');
        console.log('💡 Browser will stay open for inspection...');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        console.error('❌ Check failed:', error.message);
    }
    
    await browser.close();
}

checkRightPanel().catch(console.error);
