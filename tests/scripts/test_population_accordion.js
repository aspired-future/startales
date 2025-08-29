import { chromium } from 'playwright';

async function testPopulationAccordion() {
  console.log('🔍 Testing Population accordion...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Look for the population accordion header (👥)
    const populationAccordion = await page.locator('.accordion-header:has-text("👥")').first();
    if (await populationAccordion.isVisible()) {
      await populationAccordion.click();
      console.log('✅ Clicked Population accordion header');
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Population accordion header not found');
      return;
    }
    
    // Look for Health & Welfare button in the expanded accordion
    const healthButton = await page.locator('button:has-text("Health")').first();
    if (await healthButton.isVisible()) {
      console.log('✅ Found Health & Welfare button');
      await healthButton.click();
      console.log('✅ Clicked Health & Welfare button');
      await page.waitForTimeout(2000);
      
      // Check if we're on the Health screen
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
        
        // Check for loading state
        const loadingText = await page.locator('text=Loading health data').first();
        if (await loadingText.isVisible()) {
          console.log('⚠️ Still showing loading state');
        } else {
          console.log('✅ Not in loading state');
        }
        
        // Take a screenshot
        await page.screenshot({ path: 'tests/screenshots/health-screen-working.png', fullPage: true });
        console.log('📸 Screenshot saved to tests/screenshots/health-screen-working.png');
        return;
      } else {
        console.log('❌ Health screen container not found after clicking Health button');
      }
    } else {
      console.log('❌ Health & Welfare button not found in population accordion');
      
      // List all buttons in the accordion content
      const accordionButtons = await page.locator('.accordion-content button').all();
      console.log(`🔘 Found ${accordionButtons.length} buttons in population accordion`);
      
      for (let i = 0; i < accordionButtons.length; i++) {
        const text = await accordionButtons[i].textContent();
        console.log(`  Button ${i + 1}: "${text}"`);
      }
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/population-accordion.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/population-accordion.png');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testPopulationAccordion().catch(console.error);

