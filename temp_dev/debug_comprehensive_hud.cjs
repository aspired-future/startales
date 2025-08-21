const playwright = require('playwright');

async function debugComprehensiveHUD() {
    console.log('🔍 DEBUGGING COMPREHENSIVE WITTY GALAXY HUD...');
    console.log('');
    
    try {
        // First, check if the React UI is responding
        console.log('1️⃣ Checking React UI server...');
        const response = await fetch('http://localhost:5174');
        if (!response.ok) {
            throw new Error(`React UI server not responding: ${response.status}`);
        }
        console.log('✅ React UI server is running on port 5174');
        
        // Launch browser
        console.log('');
        console.log('2️⃣ Launching browser...');
        const browser = await playwright.chromium.launch({ 
            headless: false,
            args: ['--start-maximized']
        });
        
        const page = await browser.newPage();
        
        // Navigate to the React UI
        console.log('3️⃣ Loading Comprehensive HUD...');
        await page.goto('http://localhost:5174');
        
        // Wait for the page to load
        await page.waitForLoadState('domcontentloaded');
        
        // Check if the ComprehensiveHUD is actually rendered
        console.log('4️⃣ Checking if ComprehensiveHUD is rendered...');
        
        // Look for the main HUD elements
        const hudTitle = await page.textContent('.game-title').catch(() => null);
        const leftPanel = await page.isVisible('.left-panel').catch(() => false);
        const centerPanel = await page.isVisible('.center-panel').catch(() => false);
        const rightPanel = await page.isVisible('.right-panel').catch(() => false);
        
        console.log('');
        console.log('🔍 DIAGNOSTIC RESULTS:');
        console.log(`📋 HUD Title: ${hudTitle || 'NOT FOUND'}`);
        console.log(`🏛️ Left Panel: ${leftPanel ? 'VISIBLE' : 'NOT VISIBLE'}`);
        console.log(`🎭 Center Panel: ${centerPanel ? 'VISIBLE' : 'NOT VISIBLE'}`);
        console.log(`📊 Right Panel: ${rightPanel ? 'VISIBLE' : 'NOT VISIBLE'}`);
        
        // Check for any React errors
        const pageErrors = [];
        page.on('pageerror', error => {
            pageErrors.push(error.message);
        });
        
        // Wait a moment to catch any errors
        await page.waitForTimeout(2000);
        
        if (pageErrors.length > 0) {
            console.log('');
            console.log('❌ JAVASCRIPT ERRORS DETECTED:');
            pageErrors.forEach(error => console.log(`   ${error}`));
        } else {
            console.log('✅ No JavaScript errors detected');
        }
        
        // Take a screenshot
        await page.screenshot({ path: 'temp_dev/debug_screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved to temp_dev/debug_screenshot.png');
        
        console.log('');
        console.log('🎮 COMPREHENSIVE HUD STATUS:');
        if (hudTitle && leftPanel && centerPanel && rightPanel) {
            console.log('✅ COMPREHENSIVE HUD IS WORKING!');
            console.log('🌟 All main panels are visible and functional');
            console.log('🎯 You should see:');
            console.log('   🌌 Witty Galaxy Command Center header');
            console.log('   🏛️ Left navigation panel with all systems');
            console.log('   🎭 Center panel with character communications');
            console.log('   📊 Right panel with live metrics');
        } else {
            console.log('❌ COMPREHENSIVE HUD HAS ISSUES');
            console.log('🔧 Some panels are not rendering correctly');
        }
        
        console.log('');
        console.log('💡 Browser window will stay open for 60 seconds for inspection');
        console.log('🔍 You can interact with the HUD and test all features');
        console.log('⏰ Press Ctrl+C to close early');
        
        // Keep the browser open for inspection
        await page.waitForTimeout(60000);
        
        await browser.close();
        
    } catch (error) {
        console.error('❌ DEBUG FAILED:', error.message);
        console.log('');
        console.log('🔧 TROUBLESHOOTING STEPS:');
        console.log('1. Make sure React UI is running: npm run ui');
        console.log('2. Check if port 5174 is accessible');
        console.log('3. Look for compilation errors in the terminal');
        process.exit(1);
    }
}

debugComprehensiveHUD().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
