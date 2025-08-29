import { chromium } from 'playwright';

async function testDesignUpgrade() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🎨 Testing Design Upgrade Implementation...');
    await page.goto('http://localhost:5175');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/design-upgrade-initial.png',
      fullPage: true 
    });
    console.log('📸 Initial screenshot taken');
    
    // Look for Treasury screen
    console.log('🔍 Looking for Treasury screen...');
    const treasurySelectors = [
      'text=Treasury',
      '[data-testid="treasury"]',
      'button:has-text("Treasury")',
      '.treasury-button',
      '[title*="Treasury"]'
    ];
    
    let found = false;
    for (const selector of treasurySelectors) {
      try {
        const element = await page.waitForSelector(selector, { timeout: 2000 });
        if (element) {
          console.log(`✅ Found Treasury with selector: ${selector}`);
          await element.click();
          await page.waitForTimeout(1500);
          found = true;
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found`);
      }
    }
    
    if (!found) {
      console.log('⚠️ Treasury button not found, checking current page content...');
    }
    
    // Check for standardized design elements
    console.log('🔍 Checking for standardized design elements...');
    
    // Check for standard panels
    const standardPanels = await page.$$('.standard-panel');
    console.log(`📦 Found ${standardPanels.length} standard panels`);
    
    // Check for standard data tables
    const standardTables = await page.$$('.standard-data-table');
    console.log(`📊 Found ${standardTables.length} standard data tables`);
    
    // Check for WhoseApp button
    const whoseAppBtn = await page.$('.whoseapp-btn');
    if (whoseAppBtn) {
      console.log('✅ WhoseApp button found');
    } else {
      console.log('❌ WhoseApp button not found');
    }
    
    // Check for popup toggle
    const popupToggle = await page.$('.popup-toggle-container');
    if (popupToggle) {
      console.log('✅ Popup toggle found');
    } else {
      console.log('❌ Popup toggle not found');
    }
    
    // Test tabs if they exist
    const tabs = await page.$$('.base-screen-tab');
    console.log(`📑 Found ${tabs.length} tabs`);
    
    if (tabs.length > 0) {
      console.log('🔍 Testing tab navigation...');
      for (let i = 0; i < Math.min(tabs.length, 3); i++) {
        try {
          await tabs[i].click();
          await page.waitForTimeout(1000);
          console.log(`✅ Clicked tab ${i + 1}`);
          
          // Take screenshot of each tab
          await page.screenshot({ 
            path: `tests/screenshots/design-upgrade-tab-${i + 1}.png`,
            fullPage: true 
          });
        } catch (e) {
          console.log(`❌ Error clicking tab ${i + 1}:`, e.message);
        }
      }
    }
    
    // Check for economic theme
    const economicTheme = await page.$('.economic-theme');
    if (economicTheme) {
      console.log('✅ Economic theme applied');
    } else {
      console.log('❌ Economic theme not found');
    }
    
    // Test hover effects on buttons
    console.log('🔍 Testing hover effects...');
    const standardBtns = await page.$$('.standard-btn');
    if (standardBtns.length > 0) {
      await standardBtns[0].hover();
      await page.waitForTimeout(500);
      console.log('✅ Button hover effect tested');
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/design-upgrade-final.png',
      fullPage: true 
    });
    console.log('📸 Final screenshot taken');
    
    console.log('✅ Design upgrade test completed!');
    console.log('🎨 Design elements verified:');
    console.log(`   - ${standardPanels.length} standardized panels`);
    console.log(`   - ${standardTables.length} data tables`);
    console.log(`   - ${tabs.length} tabs in header`);
    console.log(`   - WhoseApp button: ${whoseAppBtn ? 'Present' : 'Missing'}`);
    console.log(`   - Popup toggle: ${popupToggle ? 'Present' : 'Missing'}`);
    console.log(`   - Economic theme: ${economicTheme ? 'Applied' : 'Missing'}`);
    
  } catch (error) {
    console.error('❌ Error during design upgrade test:', error);
    await page.screenshot({ 
      path: 'tests/screenshots/design-upgrade-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testDesignUpgrade();

