import { chromium } from 'playwright';

async function testCivilizationNavigation() {
  console.log('🔍 Testing Civilization navigation...');
  
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
    } else {
      console.log('❌ Civilization button not found');
      return;
    }
    
    // Get all buttons after clicking Civilization
    const buttons = await page.locator('button').all();
    console.log(`🔘 Found ${buttons.length} buttons after clicking Civilization`);
    
    // Get text content of all buttons
    for (let i = 0; i < Math.min(buttons.length, 30); i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i + 1}: "${text}"`);
    }
    
    // Look for Health button specifically
    const healthButton = await page.locator('button:has-text("Health")').first();
    if (await healthButton.isVisible()) {
      console.log('✅ Found Health button');
      await healthButton.click();
      console.log('✅ Clicked Health button');
      await page.waitForTimeout(2000);
      
      // Check if we're on the Health screen
      const healthScreen = await page.locator('.health-theme').first();
      if (await healthScreen.isVisible()) {
        console.log('✅ Health screen container found');
      } else {
        console.log('❌ Health screen container not found');
      }
      
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
      
    } else {
      console.log('❌ Health button not found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/civilization-navigation.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/civilization-navigation.png');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testCivilizationNavigation().catch(console.error);

