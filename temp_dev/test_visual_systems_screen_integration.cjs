const playwright = require('playwright');

async function testVisualSystemsScreenIntegration() {
    console.log('🎨 TESTING VISUAL SYSTEMS SCREEN INTEGRATION...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ NAVIGATING TO VISUAL SYSTEMS SCREEN...');
        
        // Navigate to Visual Systems screen
        await page.click('.accordion-header:has(.accordion-title:has-text("SCIENCE"))');
        await page.waitForTimeout(1000);
        await page.click('.nav-item:has-text("Visual Systems")');
        await page.waitForTimeout(3000);
        
        // Check if visual systems screen loaded
        const screenVisible = await page.isVisible('.visual-systems-screen');
        console.log(`   Visual Systems screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        
        if (screenVisible) {
            // Check tabs
            const tabs = await page.$$eval('.view-tabs .tab', tabs => 
                tabs.map(tab => tab.textContent.trim())
            );
            console.log(`   Available tabs: ${tabs.join(', ')}`);
            console.log(`   Tab count: ${tabs.length} ${tabs.length === 8 ? '✅' : '❌'}`);
            
            console.log('\n2️⃣ TESTING TAB FUNCTIONALITY...');
            
            // Test Generation tab (default)
            const generationVisible = await page.isVisible('.generation-tab');
            console.log(`   Generation tab content: ${generationVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (generationVisible) {
                const formControls = await page.$$eval('.form-control', controls => controls.length);
                const generationItems = await page.$$eval('.generation-item', items => items.length);
                const assetPlaceholders = await page.$$eval('.asset-placeholder', placeholders => placeholders.length);
                console.log(`   Form controls: ${formControls} input fields`);
                console.log(`   Recent generations: ${generationItems} generation items`);
                console.log(`   Asset placeholders: ${assetPlaceholders} visual previews`);
            }
            
            // Test Characters tab
            await page.click('.view-tabs .tab:has-text("Characters")');
            await page.waitForTimeout(1000);
            
            const charactersVisible = await page.isVisible('.characters-tab');
            console.log(`   Characters tab: ${charactersVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (charactersVisible) {
                const characterItems = await page.$$eval('.character-item', items => items.length);
                const traitTags = await page.$$eval('.trait-tag', tags => tags.length);
                const colorSwatches = await page.$$eval('.color-swatch', swatches => swatches.length);
                console.log(`   Character profiles: ${characterItems} characters`);
                console.log(`   Trait tags: ${traitTags} personality/appearance traits`);
                console.log(`   Color swatches: ${colorSwatches} design consistency indicators`);
            }
            
            // Test Species tab
            await page.click('.view-tabs .tab:has-text("Species")');
            await page.waitForTimeout(1000);
            
            const speciesVisible = await page.isVisible('.species-tab');
            console.log(`   Species tab: ${speciesVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (speciesVisible) {
                const speciesItems = await page.$$eval('.species-item', items => items.length);
                const characteristicItems = await page.$$eval('.characteristic-item', items => items.length);
                const motifTags = await page.$$eval('.motif-tag', tags => tags.length);
                console.log(`   Species designs: ${speciesItems} species`);
                console.log(`   Characteristics: ${characteristicItems} species traits`);
                console.log(`   Visual motifs: ${motifTags} design elements`);
            }
            
            // Test Environments tab
            await page.click('.view-tabs .tab:has-text("Environments")');
            await page.waitForTimeout(1000);
            
            const environmentsVisible = await page.isVisible('.environments-tab');
            console.log(`   Environments tab: ${environmentsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (environmentsVisible) {
                const environmentItems = await page.$$eval('.environment-item', items => items.length);
                const featureTags = await page.$$eval('.feature-tag', tags => tags.length);
                console.log(`   Environment designs: ${environmentItems} environments`);
                console.log(`   Feature tags: ${featureTags} environmental features`);
            }
            
            // Test Videos tab
            await page.click('.view-tabs .tab:has-text("Videos")');
            await page.waitForTimeout(1000);
            
            const videosVisible = await page.isVisible('.videos-tab');
            console.log(`   Videos tab: ${videosVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (videosVisible) {
                const videoItems = await page.$$eval('.video-item', items => items.length);
                const sceneItems = await page.$$eval('.scene-item', items => items.length);
                console.log(`   Video assets: ${videoItems} videos`);
                console.log(`   Video scenes: ${sceneItems} scene breakdowns`);
            }
            
            // Test Assets tab
            await page.click('.view-tabs .tab:has-text("Assets")');
            await page.waitForTimeout(1000);
            
            const assetsVisible = await page.isVisible('.assets-tab');
            console.log(`   Assets tab: ${assetsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (assetsVisible) {
                const assetItems = await page.$$eval('.asset-item', items => items.length);
                const assetTags = await page.$$eval('.asset-tag', tags => tags.length);
                const libraryStats = await page.$$eval('.stat-item', stats => stats.length);
                console.log(`   Asset library: ${assetItems} assets`);
                console.log(`   Asset tags: ${assetTags} categorization tags`);
                console.log(`   Library statistics: ${libraryStats} stat metrics`);
            }
            
            // Test Consistency tab
            await page.click('.view-tabs .tab:has-text("Consistency")');
            await page.waitForTimeout(1000);
            
            const consistencyVisible = await page.isVisible('.consistency-tab');
            console.log(`   Consistency tab: ${consistencyVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (consistencyVisible) {
                const scoreItems = await page.$$eval('.score-item', items => items.length);
                const issueItems = await page.$$eval('.issue-item', items => items.length);
                console.log(`   Consistency scores: ${scoreItems} quality metrics`);
                console.log(`   Consistency issues: ${issueItems} identified issues`);
            }
            
            // Test Analytics tab
            await page.click('.view-tabs .tab:has-text("Analytics")');
            await page.waitForTimeout(1000);
            
            const analyticsVisible = await page.isVisible('.analytics-tab');
            console.log(`   Analytics tab: ${analyticsVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (analyticsVisible) {
                const statMetrics = await page.$$eval('.stat-metric', metrics => metrics.length);
                const perfMetrics = await page.$$eval('.perf-metric', metrics => metrics.length);
                const storageBar = await page.isVisible('.storage-bar');
                console.log(`   Generation statistics: ${statMetrics} stat metrics`);
                console.log(`   Performance metrics: ${perfMetrics} performance indicators`);
                console.log(`   Storage usage indicator: ${storageBar ? 'YES ✅' : 'NO ❌'}`);
            }
            
            console.log('\n3️⃣ TESTING LAYOUT AND STYLING...');
            
            // Go back to Generation tab to test layout
            await page.click('.view-tabs .tab:has-text("Generation")');
            await page.waitForTimeout(1000);
            
            // Check purple/blue creative theme
            const themeColor = await page.evaluate(() => {
                const tab = document.querySelector('.view-tabs .tab.active');
                if (!tab) return false;
                const styles = window.getComputedStyle(tab);
                return styles.color.includes('102, 126, 234') || styles.borderBottomColor.includes('102, 126, 234');
            });
            console.log(`   Purple/blue creative theme: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
            
            console.log('\n4️⃣ TESTING INTERACTIVE FEATURES...');
            
            // Test action buttons
            const actionButtons = await page.$$eval('.action-btn', btns => btns.length);
            console.log(`   Action buttons: ${actionButtons} buttons`);
            
            // Test form controls
            const formInputs = await page.$$eval('.form-control', inputs => inputs.length);
            console.log(`   Form controls: ${formInputs} interactive inputs`);
            
            console.log('\n5️⃣ TESTING API INTEGRATION...');
            
            // Check if API endpoints are documented
            const apiInfoVisible = await page.isVisible('.api-info');
            console.log(`   API documentation: ${apiInfoVisible ? 'YES ✅' : 'NO ❌'}`);
            
            if (apiInfoVisible) {
                await page.click('.api-info summary');
                await page.waitForTimeout(500);
                
                const apiEndpoints = await page.$$eval('.api-endpoint', endpoints => 
                    endpoints.map(ep => ({
                        method: ep.querySelector('.method').textContent,
                        path: ep.querySelector('.path').textContent
                    }))
                );
                console.log(`   API endpoints: ${apiEndpoints.length} endpoints`);
                apiEndpoints.slice(0, 3).forEach(ep => console.log(`     ${ep.method} ${ep.path}`));
                if (apiEndpoints.length > 3) console.log(`     ... and ${apiEndpoints.length - 3} more`);
            }
        }
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/visual_systems_screen_integration_test.png', fullPage: false });
        console.log('\n📸 Screenshot saved to temp_dev/visual_systems_screen_integration_test.png');
        
        console.log('\n🎉 VISUAL SYSTEMS SCREEN INTEGRATION SUMMARY:');
        console.log(`   Screen loaded: ${screenVisible ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   All 8 tabs functional: ${tabs && tabs.length === 8 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Creative theme applied: ${themeColor ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   Interactive features: ${actionButtons > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`   API integration: ${apiInfoVisible ? 'DOCUMENTED ✅' : 'BASIC'}`);
        
        console.log('\n💡 Browser will stay open for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testVisualSystemsScreenIntegration().catch(console.error);
