import { chromium } from 'playwright';

async function findHealthScreen() {
  console.log('🔍 Finding Health screen...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Click the Civilization button
    const civilizationButton = await page.locator('button:has-text("🏛️ Civilization")').first();
    if (await civilizationButton.isVisible()) {
      await civilizationButton.click();
      console.log('✅ Clicked Civilization button');
      await page.waitForTimeout(2000);
    }
    
    // Try clicking different category buttons to find Health
    const categories = [
      '👥 Society',
      '💰 Economy', 
      '⚔️ Military',
      '🔬 Technology',
      '🌌 Galaxy'
    ];
    
    for (const category of categories) {
      console.log(`\n🔍 Trying category: ${category}`);
      
      const categoryButton = await page.locator(`button:has-text("${category}")`).first();
      if (await categoryButton.isVisible()) {
        await categoryButton.click();
        console.log(`✅ Clicked ${category} button`);
        await page.waitForTimeout(2000);
        
        // Get all buttons after clicking this category
        const buttons = await page.locator('button').all();
        console.log(`🔘 Found ${buttons.length} buttons in ${category}`);
        
        // Look for health-related buttons
        const healthKeywords = ['Health', 'Welfare', 'Medical', 'Hospital', '🏥', '💊'];
        for (const keyword of healthKeywords) {
          const healthButton = await page.locator(`button:has-text("${keyword}")`).first();
          if (await healthButton.isVisible()) {
            console.log(`✅ Found health-related button: ${keyword}`);
            await healthButton.click();
            console.log(`✅ Clicked ${keyword} button`);
            await page.waitForTimeout(2000);
            
            // Check if we're on a health screen
            const healthScreen = await page.locator('.health-theme').first();
            if (await healthScreen.isVisible()) {
              console.log('✅ Health screen container found!');
              
              // Check for tabs
              const tabs = await page.locator('button[role="tab"]').all();
              console.log(`📋 Found ${tabs.length} tabs`);
              
              // Check for content
              const overviewContent = await page.locator('text=Health Overview').first();
              if (await overviewContent.isVisible()) {
                console.log('✅ Overview content found');
              } else {
                console.log('❌ Overview content not found');
              }
              
              // Take a screenshot
              await page.screenshot({ path: 'tests/screenshots/health-screen-found.png', fullPage: true });
              console.log('📸 Screenshot saved to tests/screenshots/health-screen-found.png');
              return;
            }
          }
        }
        
        // If no health button found, go back to Civilization
        const backButton = await page.locator('button:has-text("🏛️ Civilization")').first();
        if (await backButton.isVisible()) {
          await backButton.click();
          console.log('↩️ Back to Civilization');
          await page.waitForTimeout(1000);
        }
      }
    }
    
    console.log('❌ Health screen not found in any category');
    
    // Take a final screenshot
    await page.screenshot({ path: 'tests/screenshots/health-screen-not-found.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/health-screen-not-found.png');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

findHealthScreen().catch(console.error);

