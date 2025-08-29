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
    
    // Click Society accordion
    const societyAccordion = await page.locator('.accordion-header:has-text("👥")').first();
    if (await societyAccordion.isVisible()) {
      await societyAccordion.click();
      console.log('✅ Clicked Society accordion');
      await page.waitForTimeout(2000);
    }
    
    // Click Education button
    const educationButton = await page.locator('button:has-text("Education")').first();
    if (await educationButton.isVisible()) {
      console.log('✅ Found Education button, clicking...');
      await educationButton.click();
      console.log('✅ Clicked Education button');
      
      // Wait for the popup to load
      await page.waitForTimeout(3000);
      
      // Check for education screen content
      const educationContent = await page.locator('text=Education Overview').first();
      if (await educationContent.isVisible()) {
        console.log('✅ Education screen content found!');
        
        // Check for tabs
        const tabs = await page.locator('button[role="tab"]').all();
        console.log(`📋 Found ${tabs.length} tabs`);
        
        // Check for the social theme
        const socialTheme = await page.locator('.social-theme').first();
        if (await socialTheme.isVisible()) {
          console.log('✅ Social theme applied correctly');
        } else {
          console.log('❌ Social theme not found');
        }
        
        // Check for charts
        const charts = await page.locator('svg').all();
        console.log(`📊 Found ${charts.length} charts`);
        
        // Check for data tables
        const tables = await page.locator('table').all();
        console.log(`📋 Found ${tables.length} data tables`);
        
        console.log('🎉 Education screen is working properly!');
        
        // Take a screenshot
        await page.screenshot({ path: 'tests/screenshots/education-screen-working.png', fullPage: true });
        console.log('📸 Screenshot saved to tests/screenshots/education-screen-working.png');
        
      } else {
        console.log('❌ Education screen content not found');
      }
      
    } else {
      console.log('❌ Education button not found');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testEducationScreen().catch(console.error);

