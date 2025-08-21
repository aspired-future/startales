const { chromium } = require('playwright');

async function debugScienceMenu() {
  console.log('🔍 Debugging Science Menu Navigation...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the HUD
    console.log('📱 Navigating to HUD...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Look for all accordion headers
    console.log('🔍 Finding all accordion categories...');
    const accordionHeaders = await page.$$('.accordion-header');
    
    for (let i = 0; i < accordionHeaders.length; i++) {
      const header = accordionHeaders[i];
      const titleElement = await header.$('.accordion-title');
      if (titleElement) {
        const titleText = await titleElement.textContent();
        console.log(`📂 Found accordion: "${titleText}"`);
        
        // If this is Science or Science & Tech, expand it
        if (titleText.includes('SCIENCE')) {
          console.log('🔬 Expanding Science accordion...');
          await header.click();
          await page.waitForTimeout(1000);
          
          // Find all navigation items in this accordion
          const navItems = await page.$$('.accordion-content .nav-item');
          console.log(`📋 Found ${navItems.length} items in Science accordion:`);
          
          for (let j = 0; j < navItems.length; j++) {
            const navItem = navItems[j];
            const itemText = await navItem.textContent();
            console.log(`  - ${itemText}`);
            
            // If this is Research & Development, click it
            if (itemText.includes('Government R&D') || itemText.includes('Research')) {
              console.log(`🎯 Clicking on: ${itemText}`);
              await navItem.click();
              await page.waitForTimeout(2000);
              
              // Check what screen loaded
              const screenTitle = await page.$('h1');
              if (screenTitle) {
                const titleText = await screenTitle.textContent();
                console.log(`📺 Screen loaded: "${titleText}"`);
              } else {
                console.log('❌ No screen title found');
              }
              
              // Check if it's a placeholder screen
              const placeholderText = await page.$('text=This screen is under development');
              if (placeholderText) {
                console.log('⚠️ This is a placeholder screen');
              } else {
                console.log('✅ This is a functional screen');
              }
              
              break;
            }
          }
          
          break;
        }
      }
    }
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/science_menu_debug.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/science_menu_debug.png');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugScienceMenu();
