import { chromium } from 'playwright';

async function testHealthNavigation() {
  console.log('🔍 Testing HealthScreen navigation...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`📝 Console: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Look for the Population category button (Health is under Population)
    const populationButton = await page.locator('button:has-text("Population")').first();
    if (await populationButton.isVisible()) {
      await populationButton.click();
      console.log('✅ Clicked Population button');
      await page.waitForTimeout(1000);
    } else {
      console.log('❌ Population button not found');
    }
    
    // Look for the Health button
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
    await page.screenshot({ path: 'tests/screenshots/health-navigation-test.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/health-navigation-test.png');
    
    // Wait a bit more to see any console output
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testHealthNavigation().catch(console.error);

