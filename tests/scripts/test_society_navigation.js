import { chromium } from 'playwright';

async function testSocietyNavigation() {
  console.log('🔍 Testing Society navigation...');
  
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
    
    // Click the Society button
    const societyButton = await page.locator('button:has-text("👥 Society")').first();
    if (await societyButton.isVisible()) {
      await societyButton.click();
      console.log('✅ Clicked Society button');
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Society button not found');
      return;
    }
    
    // Get all buttons after clicking Society
    const buttons = await page.locator('button').all();
    console.log(`🔘 Found ${buttons.length} buttons after clicking Society`);
    
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
      
      // Check for loading state
      const loadingText = await page.locator('text=Loading health data').first();
      if (await loadingText.isVisible()) {
        console.log('⚠️ Still showing loading state');
      } else {
        console.log('✅ Not in loading state');
      }
      
    } else {
      console.log('❌ Health button not found');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/society-navigation.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/society-navigation.png');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testSocietyNavigation().catch(console.error);

