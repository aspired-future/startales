import { chromium } from 'playwright';

async function testEducationScreen() {
  console.log('🔍 Testing Education Screen Design...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Click Civilization button
    const civilizationButton = await page.locator('button:has-text("🏛️ Civilization")').first();
    if (await civilizationButton.isVisible()) {
      await civilizationButton.click();
      console.log('✅ Clicked Civilization button');
      await page.waitForTimeout(2000);
    }
    
    // Click Population accordion
    const populationButton = await page.locator('button:has-text("👥")').first();
    if (await populationButton.isVisible()) {
      await populationButton.click();
      console.log('✅ Clicked Population accordion');
      await page.waitForTimeout(2000);
    }
    
    // Click Education button
    const educationButton = await page.locator('button:has-text("Education")').first();
    if (await educationButton.isVisible()) {
      await educationButton.click();
      console.log('✅ Clicked Education button');
      await page.waitForTimeout(3000);
    }
    
    // Check if the Education screen is loaded
    const educationContainer = await page.locator('.social-theme').first();
    if (await educationContainer.isVisible()) {
      console.log('✅ Education screen loaded with new design');
    } else {
      console.log('❌ Education screen not found');
    }
    
    // Check for tabs
    const tabs = await page.locator('.standard-tab').count();
    console.log(`📋 Found ${tabs} tabs`);
    
    // Check for content in each tab
    const tabLabels = ['Overview', 'Institutions', 'Curriculum', 'Teachers', 'Analytics'];
    for (const label of tabLabels) {
      const tab = await page.locator(`button:has-text("${label}")`).first();
      if (await tab.isVisible()) {
        console.log(`✅ Tab "${label}" found`);
      } else {
        console.log(`❌ Tab "${label}" not found`);
      }
    }
    
    // Check for metrics and content
    const metrics = await page.locator('.standard-metric').count();
    console.log(`📊 Found ${metrics} metrics`);
    
    // Check for charts
    const charts = await page.locator('.chart-container').count();
    console.log(`📈 Found ${charts} charts`);
    
    // Take a screenshot
    await page.screenshot({ path: 'education_screen_final.png', fullPage: true });
    console.log('📸 Screenshot saved as education_screen_final.png');
    
    console.log('✅ Education Screen test completed successfully!');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testEducationScreen();
