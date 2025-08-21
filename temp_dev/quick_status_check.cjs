const playwright = require('playwright');

async function quickStatusCheck() {
    console.log('🔍 QUICK STATUS CHECK...');
    
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Check API connectivity
        const apiTest = await page.evaluate(async () => {
            try {
                const response = await fetch('/api/witter/feed?limit=3');
                const data = await response.json();
                return {
                    status: response.status,
                    ok: response.ok,
                    hasData: !!(data.posts && data.posts.length > 0),
                    dataStructure: data
                };
            } catch (error) {
                return {
                    error: error.message,
                    status: 'failed'
                };
            }
        });
        
        console.log('API Test Result:', apiTest);
        
        // Go to Witter tab and check content
        await page.click('.tab-button:has-text("Witter")');
        await page.waitForTimeout(2000);
        
        const witterStatus = await page.evaluate(() => {
            const posts = document.querySelectorAll('.witt-item');
            const loadingElement = document.querySelector('.witter-loading');
            const errorElement = document.querySelector('.error');
            
            return {
                postCount: posts.length,
                isLoading: !!loadingElement,
                hasError: !!errorElement,
                firstPostContent: posts[0]?.querySelector('.witt-content')?.textContent?.substring(0, 100)
            };
        });
        
        console.log('Witter Status:', witterStatus);
        
        // Check if demo server is needed
        console.log('\n📋 DIAGNOSIS:');
        if (apiTest.error || apiTest.status === 'failed') {
            console.log('❌ API Connection Failed - Demo server may not be running');
            console.log('💡 Solution: Start the demo server with: npm run demo');
        } else if (!apiTest.hasData) {
            console.log('⚠️  API Connected but no data returned');
            console.log('💡 Solution: Check API data generation');
        } else {
            console.log('✅ API Connected and returning data');
        }
        
        if (witterStatus.postCount === 0) {
            console.log('❌ No Witter posts displayed');
            console.log('💡 Solution: Check SimpleWitterFeed component API integration');
        } else {
            console.log(`✅ ${witterStatus.postCount} Witter posts displayed`);
        }
        
        await page.screenshot({ path: 'temp_dev/quick_status.png' });
        console.log('\n📸 Screenshot saved to temp_dev/quick_status.png');
        
        console.log('\n💡 Browser will stay open for 10 seconds...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Status check failed:', error.message);
    }
    
    await browser.close();
}

quickStatusCheck().catch(console.error);
