import { chromium } from 'playwright';

async function debugAccordionState() {
  console.log('🔍 Debugging Accordion State...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // First, check the initial state
    console.log('\\n📋 Initial accordion state...');
    const initialState = await page.evaluate(() => {
      const accordionSections = document.querySelectorAll('.accordion-section');
      const results = [];
      
      accordionSections.forEach((section, index) => {
        const header = section.querySelector('.accordion-header');
        const title = section.querySelector('.accordion-title');
        const content = section.querySelector('.accordion-content');
        const chevron = section.querySelector('.accordion-chevron');
        
        results.push({
          index,
          title: title ? title.textContent : 'N/A',
          headerExpanded: header ? header.classList.contains('expanded') : false,
          contentExists: !!content,
          contentVisible: content ? (content.offsetParent !== null) : false,
          chevron: chevron ? chevron.textContent : 'N/A'
        });
      });
      
      return results;
    });
    
    initialState.forEach(state => {
      console.log(`Section ${state.index} (${state.title}): expanded=${state.headerExpanded}, content=${state.contentExists}, visible=${state.contentVisible}, chevron=${state.chevron}`);
    });
    
    // Now click the GALAXY accordion
    console.log('\\n🌌 Clicking GALAXY accordion...');
    await page.click('text=GALAXY');
    await page.waitForTimeout(2000);
    
    // Check state after clicking
    console.log('\\n📋 State after clicking GALAXY...');
    const afterClickState = await page.evaluate(() => {
      const accordionSections = document.querySelectorAll('.accordion-section');
      const results = [];
      
      accordionSections.forEach((section, index) => {
        const header = section.querySelector('.accordion-header');
        const title = section.querySelector('.accordion-title');
        const content = section.querySelector('.accordion-content');
        const chevron = section.querySelector('.accordion-chevron');
        
        results.push({
          index,
          title: title ? title.textContent : 'N/A',
          headerExpanded: header ? header.classList.contains('expanded') : false,
          contentExists: !!content,
          contentVisible: content ? (content.offsetParent !== null) : false,
          contentDisplay: content ? window.getComputedStyle(content).display : 'N/A',
          chevron: chevron ? chevron.textContent : 'N/A'
        });
      });
      
      return results;
    });
    
    afterClickState.forEach(state => {
      console.log(`Section ${state.index} (${state.title}): expanded=${state.headerExpanded}, content=${state.contentExists}, visible=${state.contentVisible}, display=${state.contentDisplay}, chevron=${state.chevron}`);
    });
    
    // Specifically check the galaxy section content
    console.log('\\n🔍 Detailed galaxy section analysis...');
    const galaxyDetails = await page.evaluate(() => {
      const accordionSections = document.querySelectorAll('.accordion-section');
      let galaxySection = null;
      
      // Find the galaxy section
      for (let i = 0; i < accordionSections.length; i++) {
        const title = accordionSections[i].querySelector('.accordion-title');
        if (title && title.textContent === 'GALAXY') {
          galaxySection = accordionSections[i];
          break;
        }
      }
      
      if (!galaxySection) return { error: 'Galaxy section not found' };
      
      const content = galaxySection.querySelector('.accordion-content');
      if (!content) return { error: 'Galaxy accordion content not found' };
      
      const navItems = content.querySelectorAll('.nav-item');
      const itemDetails = Array.from(navItems).map((item, index) => ({
        index,
        text: item.textContent,
        visible: item.offsetParent !== null,
        display: window.getComputedStyle(item).display,
        className: item.className
      }));
      
      return {
        contentHTML: content.innerHTML.substring(0, 500),
        itemCount: navItems.length,
        items: itemDetails
      };
    });
    
    if (galaxyDetails.error) {
      console.log('❌ Error:', galaxyDetails.error);
    } else {
      console.log('Galaxy content HTML preview:', galaxyDetails.contentHTML);
      console.log('Galaxy nav items:', galaxyDetails.itemCount);
      galaxyDetails.items.forEach(item => {
        console.log(`  Item ${item.index}: "${item.text}" (visible: ${item.visible}, display: ${item.display})`);
      });
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/accordion_state_debug.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugAccordionState().catch(console.error);
