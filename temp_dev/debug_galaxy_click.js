import { chromium } from 'playwright';

async function debugGalaxyClick() {
  console.log('🔍 Debugging Galaxy Click Handler...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500
  });
  const page = await browser.newPage();
  
  // Capture all console messages and errors
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    if (msg.type() === 'error') {
      console.log('❌ BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Add a click listener to debug what's happening
    await page.evaluate(() => {
      // Add debug logging to the galaxy accordion
      const accordionSections = document.querySelectorAll('.accordion-section');
      let galaxySection = null;
      
      accordionSections.forEach((section, index) => {
        const title = section.querySelector('.accordion-title');
        if (title && title.textContent === 'GALAXY') {
          galaxySection = section;
          const header = section.querySelector('.accordion-header');
          
          if (header) {
            // Add our own click listener to debug
            header.addEventListener('click', (e) => {
              console.log('🌌 Galaxy accordion clicked!', e);
              console.log('Current target:', e.target);
              console.log('Current target classes:', e.target.className);
            });
            
            console.log('✅ Added debug click listener to galaxy accordion');
          }
        }
      });
      
      if (!galaxySection) {
        console.log('❌ Galaxy section not found for debug listener');
      }
    });
    
    console.log('\\n🌌 Clicking GALAXY accordion with debug...');
    
    // Try different click approaches
    console.log('\\n1️⃣ Trying to click by text "GALAXY"...');
    try {
      await page.click('text=GALAXY');
      await page.waitForTimeout(1000);
      console.log('✅ Text click completed');
    } catch (error) {
      console.log('❌ Text click failed:', error.message);
    }
    
    console.log('\\n2️⃣ Trying to click galaxy accordion header directly...');
    try {
      const galaxyHeader = await page.locator('.accordion-section').filter({ hasText: 'GALAXY' }).locator('.accordion-header');
      await galaxyHeader.click();
      await page.waitForTimeout(1000);
      console.log('✅ Direct header click completed');
    } catch (error) {
      console.log('❌ Direct header click failed:', error.message);
    }
    
    console.log('\\n3️⃣ Trying to click with force...');
    try {
      await page.click('text=GALAXY', { force: true });
      await page.waitForTimeout(1000);
      console.log('✅ Force click completed');
    } catch (error) {
      console.log('❌ Force click failed:', error.message);
    }
    
    // Check final state
    const finalState = await page.evaluate(() => {
      const accordionSections = document.querySelectorAll('.accordion-section');
      let galaxySection = null;
      
      for (let section of accordionSections) {
        const title = section.querySelector('.accordion-title');
        if (title && title.textContent === 'GALAXY') {
          galaxySection = section;
          break;
        }
      }
      
      if (!galaxySection) return { error: 'Galaxy section not found' };
      
      const header = galaxySection.querySelector('.accordion-header');
      const content = galaxySection.querySelector('.accordion-content');
      
      return {
        headerExpanded: header ? header.classList.contains('expanded') : false,
        contentExists: !!content,
        contentVisible: content ? (content.offsetParent !== null) : false,
        headerHTML: header ? header.outerHTML.substring(0, 200) : 'N/A'
      };
    });
    
    console.log('\\n📊 Final State:');
    console.log('Header expanded:', finalState.headerExpanded);
    console.log('Content exists:', finalState.contentExists);
    console.log('Content visible:', finalState.contentVisible);
    console.log('Header HTML preview:', finalState.headerHTML);
    
    // Show recent console messages
    console.log('\\n📝 Recent console messages:');
    consoleMessages.slice(-10).forEach(msg => console.log('  ', msg));
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_click_debug.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugGalaxyClick().catch(console.error);
