import { chromium } from 'playwright';

async function testAccordionFix() {
  console.log('🔧 Testing Accordion Fix...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('🔍 BROWSER:', msg.text());
  });
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    console.log('\\n🌌 Clicking GALAXY accordion...');
    await page.click('text=GALAXY');
    await page.waitForTimeout(2000);
    
    // Check if accordion expanded
    const galaxyExpanded = await page.evaluate(() => {
      const accordionSections = document.querySelectorAll('.accordion-section');
      for (let section of accordionSections) {
        const title = section.querySelector('.accordion-title');
        if (title && title.textContent === 'GALAXY') {
          const header = section.querySelector('.accordion-header');
          const content = section.querySelector('.accordion-content');
          return {
            headerExpanded: header ? header.classList.contains('expanded') : false,
            contentExists: !!content,
            contentVisible: content ? (content.offsetParent !== null) : false
          };
        }
      }
      return { error: 'Galaxy section not found' };
    });
    
    console.log('Galaxy accordion state:', galaxyExpanded);
    
    if (galaxyExpanded.contentVisible) {
      console.log('\\n✅ Galaxy accordion expanded! Looking for Galaxy Data...');
      
      const galaxyDataVisible = await page.locator('text=🌌 Galaxy Data').isVisible().catch(() => false);
      console.log('Galaxy Data button visible:', galaxyDataVisible);
      
      if (galaxyDataVisible) {
        console.log('\\n📊 Clicking Galaxy Data...');
        await page.click('text=🌌 Galaxy Data');
        await page.waitForTimeout(3000);
        
        // Check if Galaxy Data screen loaded
        const galaxyDataScreen = await page.locator('.galaxy-data-screen').isVisible().catch(() => false);
        const underDevelopment = await page.locator('text=under development').isVisible().catch(() => false);
        
        console.log('Galaxy Data Screen visible:', galaxyDataScreen);
        console.log('Under development message:', underDevelopment);
        
        if (galaxyDataScreen) {
          console.log('\\n🎉 SUCCESS! Galaxy Data screen is working!');
          
          // Test tabs
          const overviewTab = await page.locator('text=🌌 Galaxy Overview').isVisible().catch(() => false);
          const civilizationsTab = await page.locator('text=🏛️ Civilizations').isVisible().catch(() => false);
          
          console.log('Overview tab visible:', overviewTab);
          console.log('Civilizations tab visible:', civilizationsTab);
          
          if (civilizationsTab) {
            await page.click('text=🏛️ Civilizations');
            await page.waitForTimeout(1000);
            
            const civGrid = await page.locator('.civilizations-grid').isVisible().catch(() => false);
            console.log('Civilizations grid visible:', civGrid);
          }
          
        } else if (underDevelopment) {
          console.log('\\n❌ Still showing under development');
        }
      }
    } else {
      console.log('\\n❌ Galaxy accordion still not expanding');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/accordion_fix_test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testAccordionFix().catch(console.error);
