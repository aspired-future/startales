const { chromium } = require('playwright');

async function debugProfessionsDetailed() {
  console.log('🔍 Detailed Professions Screen Debug...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
    });
    
    console.log('📍 Navigating to HUD...');
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(5000);
    
    // Check if HUD loaded
    const hudLoaded = await page.locator('.comprehensive-hud').count();
    console.log(`🎮 HUD loaded: ${hudLoaded > 0}`);
    
    if (hudLoaded > 0) {
      // Check accordion structure
      const accordions = await page.locator('.accordion-header').count();
      console.log(`📂 Accordion headers: ${accordions}`);
      
      // Get all accordion titles
      const accordionTitles = await page.locator('.accordion-title').allTextContents();
      console.log('📋 Accordion titles:', accordionTitles);
      
      // Try to find and click Population accordion
      const populationAccordion = await page.locator('.accordion-header:has(.accordion-title:has-text("POPULATION"))').count();
      console.log(`👥 Population accordion found: ${populationAccordion > 0}`);
      
      if (populationAccordion > 0) {
        console.log('🔍 Clicking Population accordion...');
        await page.click('.accordion-header:has(.accordion-title:has-text("POPULATION"))');
        await page.waitForTimeout(2000);
        
        // Check nav items
        const navItems = await page.locator('.nav-item').count();
        console.log(`📋 Nav items after clicking: ${navItems}`);
        
        if (navItems > 0) {
          const navTexts = await page.locator('.nav-item').allTextContents();
          console.log('📝 Nav item texts:', navTexts);
          
          // Look for Professions specifically
          const professionsNav = await page.locator('.nav-item:has-text("Professions")').count();
          console.log(`💼 Professions nav item found: ${professionsNav > 0}`);
          
          if (professionsNav > 0) {
            console.log('🔍 Clicking Professions nav item...');
            await page.click('.nav-item:has-text("Professions")');
            await page.waitForTimeout(3000);
            
            // Check if screen loaded
            const screenLoaded = await page.locator('.professions-screen').count();
            console.log(`💼 Professions screen loaded: ${screenLoaded > 0}`);
            
            // Check for any error messages
            const errorMessages = await page.locator('.error, .loading, .screen-loading').allTextContents();
            console.log('❌ Error/Loading messages:', errorMessages);
            
            // Check for tabs
            const tabs = await page.locator('.view-tabs .tab').count();
            console.log(`📋 Tabs found: ${tabs}`);
            
            if (tabs > 0) {
              const tabTexts = await page.locator('.view-tabs .tab').allTextContents();
              console.log('📝 Tab texts:', tabTexts);
            }
            
            // Check for any content
            const screenContent = await page.locator('.professions-screen').textContent();
            console.log(`📄 Screen has content: ${screenContent && screenContent.length > 100}`);
            
            // Take screenshot of the professions screen
            await page.screenshot({ 
              path: 'temp_dev/professions_screen_debug.png',
              fullPage: true 
            });
            console.log('📸 Professions screen screenshot saved');
            
          } else {
            console.log('❌ Professions nav item not found');
          }
        } else {
          console.log('❌ No nav items found after clicking Population');
        }
      } else {
        console.log('❌ Population accordion not found');
      }
    } else {
      console.log('❌ HUD not loaded');
    }
    
    // Wait for manual inspection
    console.log('⏳ Waiting 15 seconds for manual inspection...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the debug
debugProfessionsDetailed().catch(console.error);
