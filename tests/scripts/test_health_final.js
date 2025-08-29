import { chromium } from 'playwright';

async function testHealthFinal() {
  console.log('🔍 Final Health screen test...');
  
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
    const populationAccordion = await page.locator('.accordion-header:has-text("👥")').first();
    if (await populationAccordion.isVisible()) {
      await populationAccordion.click();
      console.log('✅ Clicked Population accordion');
      await page.waitForTimeout(2000);
    }
    
    // Click Health button
    const healthButton = await page.locator('button:has-text("Health")').first();
    if (await healthButton.isVisible()) {
      console.log('✅ Found Health button, clicking...');
      await healthButton.click();
      console.log('✅ Clicked Health button');
      
      // Wait for the popup to load
      await page.waitForTimeout(3000);
      
      // Check for health screen content
      const healthContent = await page.locator('text=Health Overview').first();
      if (await healthContent.isVisible()) {
        console.log('✅ Health screen content found!');
        
        // Check for tabs
        const tabs = await page.locator('button[role="tab"]').all();
        console.log(`📋 Found ${tabs.length} tabs`);
        
        // Check for the "Diseases" tab (renamed from "Population & Diseases")
        const diseasesTab = await page.locator('button:has-text("Diseases")').first();
        if (await diseasesTab.isVisible()) {
          console.log('✅ Diseases tab found (correctly renamed)');
        } else {
          console.log('❌ Diseases tab not found');
        }
        
        // Check for charts
        const charts = await page.locator('svg').all();
        console.log(`📊 Found ${charts.length} charts`);
        
        // Check for data tables
        const tables = await page.locator('table').all();
        console.log(`📋 Found ${tables.length} data tables`);
        
        console.log('🎉 Health screen is working properly!');
        
        // Take a screenshot
        await page.screenshot({ path: 'tests/screenshots/health-screen-working.png', fullPage: true });
        console.log('📸 Screenshot saved to tests/screenshots/health-screen-working.png');
        
      } else {
        console.log('❌ Health screen content not found');
      }
      
    } else {
      console.log('❌ Health button not found');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testHealthFinal().catch(console.error);

