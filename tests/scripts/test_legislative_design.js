import { chromium } from 'playwright';

async function testLegislativeDesign() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🏛️ Testing Legislative Screen Design Upgrade...');
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Look for Legislative screen
    console.log('🔍 Looking for Legislative screen...');
    const legislativeSelectors = [
      'text=Legislative',
      'text=Legislature',
      '[data-testid="legislative"]',
      'button:has-text("Legislative")',
      'button:has-text("Legislature")',
      '.legislative-button',
      '[title*="Legislative"]'
    ];
    
    let found = false;
    for (const selector of legislativeSelectors) {
      try {
        const element = await page.waitForSelector(selector, { timeout: 2000 });
        if (element) {
          console.log(`✅ Found Legislative with selector: ${selector}`);
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
      console.log('⚠️ Legislative button not found, checking current page content...');
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
            path: `tests/screenshots/legislative-design-tab-${i + 1}.png`,
            fullPage: true 
          });
        } catch (e) {
          console.log(`❌ Error clicking tab ${i + 1}:`, e.message);
        }
      }
    }
    
    // Check for specific content
    const proposalsContent = await page.$('text=Legislative Proposals');
    if (proposalsContent) {
      console.log('✅ Legislative Proposals content found');
    } else {
      console.log('❌ Legislative Proposals content not found');
    }
    
    const partiesContent = await page.$('text=Political Parties');
    if (partiesContent) {
      console.log('✅ Political Parties content found');
    } else {
      console.log('❌ Political Parties content not found');
    }
    
    const committeesContent = await page.$('text=Legislative Committees');
    if (committeesContent) {
      console.log('✅ Legislative Committees content found');
    } else {
      console.log('❌ Legislative Committees content not found');
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
      path: 'tests/screenshots/legislative-design-final.png',
      fullPage: true 
    });
    console.log('📸 Final screenshot taken');
    
    console.log('✅ Legislative design test completed!');
    console.log('🏛️ Design elements verified:');
    console.log(`   - ${standardPanels.length} standardized panels`);
    console.log(`   - ${standardTables.length} data tables`);
    console.log(`   - ${tabs.length} tabs in header`);
    console.log(`   - WhoseApp button: ${whoseAppBtn ? 'Present' : 'Missing'}`);
    console.log(`   - Popup toggle: ${popupToggle ? 'Present' : 'Missing'}`);
    console.log(`   - Government theme: ${governmentTheme ? 'Applied' : 'Missing'}`);
    
  } catch (error) {
    console.error('❌ Error during legislative design test:', error);
    await page.screenshot({ 
      path: 'tests/screenshots/legislative-design-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testLegislativeDesign();
