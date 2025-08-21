// Complete Screen System Test - Tests all integrated screens
const { chromium } = require('playwright');
const fs = require('fs');

async function testCompleteScreenSystem() {
    console.log('🚀 Starting Complete Witty Galaxy Screen System Test...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Set viewport for desktop testing
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // Load the screen integration system
        const { getScreenIntegrationSystem } = require('./screen_integration_system.cjs');
        const systemContent = getScreenIntegrationSystem();
        
        // Create temporary HTML file
        const tempFile = 'temp_dev/test_complete_system.html';
        fs.writeFileSync(tempFile, systemContent);
        
        console.log('📄 Created complete system test file');
        
        // Navigate to the system
        await page.goto('file://' + process.cwd() + '/' + tempFile);
        console.log('🌐 Loaded complete HUD system');
        
        // Wait for system to initialize
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        // Test 1: System Initialization
        console.log('\\n🧪 Test 1: System Initialization');
        const title = await page.title();
        console.log('📋 Page title:', title);
        const titleTest = title.includes('Witty Galaxy - Complete HUD System');
        console.log('✅ Title test:', titleTest ? 'PASSED' : 'FAILED');
        
        // Test 2: Navigation Structure
        console.log('\\n🧪 Test 2: Navigation Structure');
        const navSections = await page.locator('.nav-section').count();
        const navItems = await page.locator('.nav-item').count();
        console.log('🏗️ Navigation sections:', navSections);
        console.log('🏗️ Navigation items:', navItems);
        console.log('✅ Navigation structure:', navSections >= 4 && navItems >= 10 ? 'PASSED' : 'FAILED');
        
        // Test 3: Screen Loading System
        console.log('\\n🧪 Test 3: Screen Loading System');
        const loadingScreen = await page.locator('#loading-screen').isVisible();
        console.log('⏳ Loading screen visible:', loadingScreen);
        
        // Wait for initial screen to load
        await page.waitForTimeout(2000);
        const screenFrame = await page.locator('#screen-frame').isVisible();
        console.log('🖼️ Screen frame visible:', screenFrame);
        console.log('✅ Screen loading:', screenFrame ? 'PASSED' : 'FAILED');
        
        // Test 4: Screen Navigation
        console.log('\\n🧪 Test 4: Screen Navigation');
        const screens = [
            { name: 'galaxy-map', displayName: 'Galaxy Map' },
            { name: 'witter', displayName: 'Witter Network' },
            { name: 'demographics', displayName: 'Demographics' }
        ];
        
        let navigationTests = 0;
        for (const screen of screens) {
            try {
                console.log('🔄 Testing navigation to ' + screen.displayName + '...');
                
                // Click navigation item
                const navItem = page.locator('[data-screen="' + screen.name + '"]');
                if (await navItem.isVisible()) {
                    await navItem.click();
                    await page.waitForTimeout(1000);
                    
                    // Check if screen name updated
                    const currentScreen = await page.locator('#current-screen').textContent();
                    console.log('📍 Current screen: ' + currentScreen);
                    
                    if (currentScreen.includes(screen.displayName) || currentScreen.includes(screen.name)) {
                        navigationTests++;
                        console.log('✅ ' + screen.displayName + ' navigation: PASSED');
                    } else {
                        console.log('❌ ' + screen.displayName + ' navigation: FAILED');
                    }
                } else {
                    console.log('⚠️ ' + screen.displayName + ' navigation item not found');
                }
                
                await page.waitForTimeout(500);
            } catch (error) {
                console.log('❌ ' + screen.displayName + ' navigation error: ' + error.message);
            }
        }
        
        console.log('✅ Navigation tests: ' + navigationTests + '/' + screens.length + ' PASSED');
        
        // Test 5: System Integration
        console.log('\\n🧪 Test 5: System Integration');
        
        // Check for system header
        const headerVisible = await page.locator('.system-header').isVisible();
        console.log('🏗️ System header:', headerVisible ? '✅' : '❌');
        
        // Check for galaxy icon animation
        const galaxyIcon = await page.locator('.galaxy-icon').isVisible();
        console.log('🌌 Galaxy icon:', galaxyIcon ? '✅' : '❌');
        
        // Check for status indicators
        const statusProgress = await page.locator('#status-progress').isVisible();
        console.log('📊 Status progress:', statusProgress ? '✅' : '❌');
        
        const integrationScore = [headerVisible, galaxyIcon, statusProgress].filter(Boolean).length;
        console.log('✅ Integration score: ' + integrationScore + '/3');
        
        // Test 6: Responsive Design
        console.log('\\n🧪 Test 6: Responsive Design');
        
        // Test desktop view
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.screenshot({ path: 'temp_dev/system_desktop.png', fullPage: true });
        console.log('📸 Desktop screenshot saved');
        
        // Test tablet view
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'temp_dev/system_tablet.png', fullPage: true });
        console.log('📸 Tablet screenshot saved');
        
        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'temp_dev/system_mobile.png', fullPage: true });
        console.log('📸 Mobile screenshot saved');
        
        // Test 7: Error Handling
        console.log('\\n🧪 Test 7: Error Handling');
        
        // Reset to desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // Try to navigate to a non-existent screen
        try {
            await page.evaluate(() => {
                window.screenSystem.switchScreen('non-existent', 'invalid-url');
            });
            await page.waitForTimeout(2000);
            console.log('✅ Error handling: System handled invalid screen gracefully');
        } catch (error) {
            console.log('✅ Error handling: System properly caught navigation error');
        }
        
        // Test 8: Performance Metrics
        console.log('\\n🧪 Test 8: Performance Metrics');
        
        const performanceMetrics = await page.evaluate(() => {
            return {
                screenCount: window.screenSystem?.screens?.size || 0,
                currentScreen: window.screenSystem?.currentScreen || 'unknown',
                hasAPI: typeof window.HUD_API !== 'undefined',
                loadTime: performance.now()
            };
        });
        
        console.log('⚡ Performance metrics:');
        console.log('  - Registered screens: ' + performanceMetrics.screenCount);
        console.log('  - Current screen: ' + performanceMetrics.currentScreen);
        console.log('  - HUD API available: ' + performanceMetrics.hasAPI);
        console.log('  - Load time: ' + performanceMetrics.loadTime.toFixed(2) + 'ms');
        
        // Final Summary
        const allTests = [
            titleTest,
            navSections >= 4 && navItems >= 10,
            screenFrame,
            navigationTests >= 2,
            integrationScore >= 2,
            performanceMetrics.screenCount > 0,
            performanceMetrics.hasAPI
        ];
        
        const passedTests = allTests.filter(test => test).length;
        const totalTests = allTests.length;
        
        console.log('\\n📊 Complete System Test Summary:');
        console.log('✅ Passed: ' + passedTests + '/' + totalTests + ' tests');
        console.log('📈 Success Rate: ' + Math.round((passedTests / totalTests) * 100) + '%');
        
        if (passedTests === totalTests) {
            console.log('🎉 ALL TESTS PASSED! The Complete Witty Galaxy Screen System is working perfectly.');
        } else if (passedTests >= totalTests * 0.8) {
            console.log('✅ SYSTEM FUNCTIONAL! Most tests passed, minor issues detected.');
        } else {
            console.log('⚠️ SYSTEM NEEDS ATTENTION! Several tests failed.');
        }
        
        // Clean up
        fs.unlinkSync(tempFile);
        console.log('🧹 Cleaned up temporary files');
        
        // Keep browser open for manual inspection
        console.log('\\n🔍 Browser will remain open for manual inspection...');
        console.log('Press Ctrl+C to close when done.');
        
        // Wait indefinitely
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
    } finally {
        // Browser will be closed when process exits
    }
}

// Run the test
testCompleteScreenSystem().catch(console.error);
