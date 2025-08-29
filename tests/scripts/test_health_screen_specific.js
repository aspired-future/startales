import { chromium } from 'playwright';

async function testHealthScreen() {
  console.log('🔍 Testing HealthScreen specifically...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded');
    
    // Wait for the page to fully load
    await page.waitForTimeout(2000);
    
    // Look for the Government button and click it
    const governmentButton = await page.locator('button:has-text("🏛️ Civilization")').first();
    if (await governmentButton.isVisible()) {
      await governmentButton.click();
      console.log('✅ Clicked Civilization button');
      await page.waitForTimeout(1000);
    } else {
      console.log('❌ Civilization button not found');
    }
    
    // Look for the Health button and click it
    const healthButton = await page.locator('button:has-text("Health")').first();
    if (await healthButton.isVisible()) {
      await healthButton.click();
      console.log('✅ Clicked Health button');
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Health button not found');
    }
    
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
    
    // Check for error state
    const errorText = await page.locator('text=Error:').first();
    if (await errorText.isVisible()) {
      console.log('❌ Error state detected');
    } else {
      console.log('✅ No error state');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/health-screen-test.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/health-screen-test.png');
    
    // Get console logs
    page.on('console', msg => {
      console.log(`📝 Console: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Wait a bit more to see any console output
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testHealthScreen().catch(console.error);
