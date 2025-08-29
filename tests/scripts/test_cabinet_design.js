import { chromium } from 'playwright';

async function testCabinetDesign() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🏛️ Testing Cabinet Screen Design Upgrade...');
    await page.goto('http://localhost:5175');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Look for Cabinet screen
    console.log('🔍 Looking for Cabinet screen...');
    const cabinetSelectors = [
      'text=Cabinet',
      '[data-testid="cabinet"]',
      'button:has-text("Cabinet")',
      '.cabinet-button',
      '[title*="Cabinet"]'
    ];
    
    let found = false;
    for (const selector of cabinetSelectors) {
      try {
        const element = await page.waitForSelector(selector, { timeout: 2000 });
        if (element) {
          console.log(`✅ Found Cabinet with selector: ${selector}`);
          await element.click();
          await page.waitForTimeout(2000);
          found = true;
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found`);
      }
    }
    
    if (!found) {
      console.log('⚠️ Cabinet button not found, checking current page content...');
    }
    
    // Check for standardized design elements
    console.log('🔍 Checking for standardized design elements...');
    
    // Check for standard panels
    const standardPanels = await page.$$('.standard-panel');
    console.log(`📦 Found ${standardPanels.length} standard panels`);
    
    // Check for government theme
    const governmentTheme = await page.$('.government-theme');
    if (governmentTheme) {
      console.log('✅ Government theme applied');
    } else {
      console.log('❌ Government theme not found');
    }
    
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
      for (let i = 0; i < Math.min(tabs.length, 5); i++) {
        try {
          await tabs[i].click();
          await page.waitForTimeout(1000);
          console.log(`✅ Clicked tab ${i + 1}`);
          
          // Check for tables in this tab
          const tablesInTab = await page.$$('.standard-data-table');
          console.log(`📊 Tab ${i + 1} has ${tablesInTab.length} data tables`);
          
          // Take screenshot of each tab
          await page.screenshot({ 
            path: `tests/screenshots/cabinet-design-tab-${i + 1}.png`,
            fullPage: true 
          });
        } catch (e) {
          console.log(`❌ Error clicking tab ${i + 1}:`, e.message);
        }
      }
    }
    
    // Check for specific content
    const cabinetMembersContent = await page.$('text=Cabinet Members');
    if (cabinetMembersContent) {
      console.log('✅ Cabinet Members content found');
    } else {
      console.log('❌ Cabinet Members content not found');
    }
    
    const tasksContent = await page.$('text=All Cabinet Tasks');
    if (tasksContent) {
      console.log('✅ Cabinet Tasks content found');
    } else {
      console.log('❌ Cabinet Tasks content not found');
    }
    
    const delegationContent = await page.$('text=Delegation');
    if (delegationContent) {
      console.log('✅ Delegation content found');
    } else {
      console.log('❌ Delegation content not found');
    }
    
    // Test hover effects on buttons
    console.log('🔍 Testing hover effects...');
    const standardBtns = await page.$$('.standard-btn');
    if (standardBtns.length > 0) {
      await standardBtns[0].hover();
      await page.waitForTimeout(500);
      console.log('✅ Button hover effect tested');
    }
    
    // Test member details functionality
    console.log('🔍 Testing member details...');
    const detailBtns = await page.$$('text=Details');
    if (detailBtns.length > 0) {
      await detailBtns[0].click();
      await page.waitForTimeout(1000);
      console.log('✅ Member details functionality tested');
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/cabinet-design-final.png',
      fullPage: true 
    });
    console.log('📸 Final screenshot taken');
    
    console.log('✅ Cabinet design test completed!');
    console.log('🏛️ Design elements verified:');
    console.log(`   - ${standardPanels.length} standardized panels`);
    console.log(`   - ${standardTables.length} data tables`);
    console.log(`   - ${tabs.length} tabs in header`);
    console.log(`   - WhoseApp button: ${whoseAppBtn ? 'Present' : 'Missing'}`);
    console.log(`   - Popup toggle: ${popupToggle ? 'Present' : 'Missing'}`);
    console.log(`   - Government theme: ${governmentTheme ? 'Applied' : 'Missing'}`);
    
  } catch (error) {
    console.error('❌ Error during cabinet design test:', error);
    await page.screenshot({ 
      path: 'tests/screenshots/cabinet-design-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testCabinetDesign();

