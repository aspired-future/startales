import { chromium } from 'playwright';

async function debugGalaxyAccordion() {
  console.log('🔍 Debugging Galaxy Accordion...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Check all accordion sections
    console.log('\\n📋 Checking all accordion sections...');
    const accordionSections = await page.locator('.accordion-section').count();
    console.log('Total accordion sections:', accordionSections);
    
    for (let i = 0; i < accordionSections; i++) {
      const section = page.locator('.accordion-section').nth(i);
      const headerText = await section.locator('.accordion-title').textContent().catch(() => 'N/A');
      console.log(`Section ${i}: ${headerText}`);
    }
    
    // Click Galaxy accordion
    console.log('\\n🌌 Clicking GALAXY accordion...');
    await page.click('text=GALAXY');
    await page.waitForTimeout(2000);
    
    // Check if accordion expanded
    const expandedAccordion = await page.locator('.accordion-section .accordion-content').isVisible().catch(() => false);
    console.log('Accordion content visible:', expandedAccordion);
    
    // List all nav items in galaxy section
    console.log('\\n📝 Checking nav items in galaxy section...');
    const navItems = await page.locator('.accordion-content .nav-item').count().catch(() => 0);
    console.log('Nav items found:', navItems);
    
    for (let i = 0; i < navItems; i++) {
      const item = page.locator('.accordion-content .nav-item').nth(i);
      const itemText = await item.textContent().catch(() => 'N/A');
      console.log(`Nav item ${i}: "${itemText}"`);
    }
    
    // Check if Galaxy Data specifically exists
    const galaxyDataExists = await page.locator('text=Galaxy Data').isVisible().catch(() => false);
    console.log('\\n🌌 Galaxy Data text found:', galaxyDataExists);
    
    const galaxyDataIcon = await page.locator('text=🌌 Galaxy Data').isVisible().catch(() => false);
    console.log('Galaxy Data with icon found:', galaxyDataIcon);
    
    // Try clicking Galaxy Data if found
    if (galaxyDataExists || galaxyDataIcon) {
      console.log('\\n📊 Attempting to click Galaxy Data...');
      try {
        if (galaxyDataIcon) {
          await page.click('text=🌌 Galaxy Data');
        } else {
          await page.click('text=Galaxy Data');
        }
        await page.waitForTimeout(3000);
        
        // Check what screen is now displayed
        const screenContent = await page.locator('.panel-screen').textContent().catch(() => '');
        console.log('Screen content preview:', screenContent.substring(0, 200) + '...');
        
        const underDev = screenContent.includes('under development');
        console.log('Contains "under development":', underDev);
        
        const galaxyDataScreen = await page.locator('.galaxy-data-screen').isVisible().catch(() => false);
        console.log('Galaxy Data Screen component visible:', galaxyDataScreen);
        
      } catch (error) {
        console.log('❌ Failed to click Galaxy Data:', error.message);
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_accordion_debug.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugGalaxyAccordion().catch(console.error);
