import { chromium } from 'playwright';

async function testCommunicationsDesign() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📺 Testing Communications Screen Design Upgrade...');
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Look for Communications screen
    console.log('🔍 Looking for Communications screen...');
    const communicationsSelectors = [
      'text=Communications',
      'text=Media',
      '[data-testid="communications"]',
      'button:has-text("Communications")',
      'button:has-text("Media")',
      '.communications-button',
      '[title*="Communications"]'
    ];
    
    let found = false;
    for (const selector of communicationsSelectors) {
      try {
        const element = await page.waitForSelector(selector, { timeout: 2000 });
        if (element) {
          console.log(`✅ Found Communications with selector: ${selector}`);
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
      console.log('⚠️ Communications button not found, checking current page content...');
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
            path: `tests/screenshots/communications-design-tab-${i + 1}.png`,
            fullPage: true 
          });
          console.log(`📸 Screenshot saved for tab ${i + 1}`);
        } catch (e) {
          console.log(`❌ Error testing tab ${i + 1}:`, e.message);
        }
      }
    }
    
    // Check for specific Communications content
    const overviewContent = await page.$('text=Total Messages');
    if (overviewContent) {
      console.log('✅ Communications Overview content found');
    } else {
      console.log('❌ Communications Overview content not found');
    }
    
    const leaderContent = await page.$('text=Leader Communications');
    if (leaderContent) {
      console.log('✅ Leader Communications content found');
    } else {
      console.log('❌ Leader Communications content not found');
    }
    
    const operationsContent = await page.$('text=Active Communications Operations');
    if (operationsContent) {
      console.log('✅ Operations content found');
    } else {
      console.log('❌ Operations content not found');
    }
    
    const mediaContent = await page.$('text=Media Relations');
    if (mediaContent) {
      console.log('✅ Media Relations content found');
    } else {
      console.log('❌ Media Relations content not found');
    }
    
    const platformsContent = await page.$('text=Platform Integrations');
    if (platformsContent) {
      console.log('✅ Platform Integrations content found');
    } else {
      console.log('❌ Platform Integrations content not found');
    }
    
    // Test hover effects
    console.log('🔍 Testing hover effects...');
    const buttons = await page.$$('.standard-btn');
    if (buttons.length > 0) {
      await buttons[0].hover();
      await page.waitForTimeout(500);
      console.log('✅ Hover effect tested');
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/communications-design-final.png',
      fullPage: true 
    });
    console.log('📸 Final screenshot taken');
    
    console.log('✅ Communications design test completed!');
    console.log('📺 Design elements verified:');
    console.log(`   - ${standardPanels.length} standardized panels`);
    console.log(`   - ${standardTables.length} data tables`);
    console.log(`   - ${tabs.length} tabs in header`);
    console.log(`   - WhoseApp button: ${whoseAppBtn ? 'Found' : 'Missing'}`);
    console.log(`   - Popup toggle: ${popupToggle ? 'Found' : 'Missing'}`);
    console.log(`   - Government theme: ${governmentTheme ? 'Applied' : 'Missing'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testCommunicationsDesign();
