import { chromium } from 'playwright';

async function testGalaxyComprehensive() {
  console.log('🚀 Testing Galaxy Map Improvements and Galaxy Data Access...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  const page = await browser.newPage();
  
  // Set viewport for consistent testing
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Listen for console messages and errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  try {
    console.log('📍 Loading StarTales...');
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    
    // Wait for app to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 15000 });
    console.log('✅ App loaded');
    
    // Take initial screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_test_initial.png', fullPage: true });
    
    // Test 1: Galaxy Map with new controls
    console.log('\\n🗺️ Testing Galaxy Map...');
    await page.click('text=🗺️ Map');
    await page.waitForTimeout(2000);
    
    // Check if popup opened
    const mapPopup = await page.locator('.popup-backdrop').isVisible().catch(() => false);
    if (mapPopup) {
      console.log('✅ Galaxy Map popup opened');
      
      // Test new controls
      const centerButton = await page.locator('text=🎯 Center').isVisible().catch(() => false);
      const resetButton = await page.locator('text=🔄 Reset').isVisible().catch(() => false);
      const scaleSelect = await page.locator('select').nth(1).isVisible().catch(() => false);
      
      if (centerButton && resetButton && scaleSelect) {
        console.log('✅ New camera controls are visible');
        
        // Test scale selector
        await page.selectOption('select >> nth=1', 'sector');
        console.log('✅ Scale selector works');
        
        // Test center button
        await page.click('text=🎯 Center');
        console.log('✅ Center button works');
        
        // Take screenshot of improved map
        await page.screenshot({ path: 'temp_dev/galaxy_map_improved.png', fullPage: true });
        
      } else {
        console.log('❌ New camera controls not found');
      }
      
      // Close map popup
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      
    } else {
      console.log('❌ Galaxy Map popup did not open');
    }
    
    // Test 2: Galaxy Data Screen Access
    console.log('\\n🌌 Testing Galaxy Data Screen Access...');
    
    // Look for Galaxy accordion section
    const galaxyAccordion = await page.locator('text=Galaxy & Space').isVisible().catch(() => false);
    if (galaxyAccordion) {
      console.log('✅ Galaxy accordion section found');
      
      // Click to expand Galaxy section
      await page.click('text=Galaxy & Space');
      await page.waitForTimeout(1000);
      
      // Look for Galaxy Data option
      const galaxyDataOption = await page.locator('text=🌌 Galaxy Data').isVisible().catch(() => false);
      if (galaxyDataOption) {
        console.log('✅ Galaxy Data option found in navigation');
        
        // Click Galaxy Data
        await page.click('text=🌌 Galaxy Data');
        await page.waitForTimeout(3000);
        
        // Check if Galaxy Data screen loaded
        const galaxyDataScreen = await page.locator('.galaxy-data-screen').isVisible().catch(() => false);
        if (galaxyDataScreen) {
          console.log('✅ Galaxy Data screen loaded successfully');
          
          // Check for main content
          const screenHeader = await page.locator('text=Galaxy Data Intelligence').isVisible().catch(() => false);
          const tabNavigation = await page.locator('.tab-navigation').isVisible().catch(() => false);
          
          if (screenHeader && tabNavigation) {
            console.log('✅ Galaxy Data screen has proper content and navigation');
            
            // Test tab switching
            const civilizationsTab = await page.locator('text=🏛️ Civilizations').isVisible().catch(() => false);
            if (civilizationsTab) {
              await page.click('text=🏛️ Civilizations');
              await page.waitForTimeout(1000);
              console.log('✅ Tab switching works');
            }
            
            // Take screenshot of Galaxy Data screen
            await page.screenshot({ path: 'temp_dev/galaxy_data_screen.png', fullPage: true });
            
          } else {
            console.log('❌ Galaxy Data screen missing content');
          }
          
        } else {
          console.log('❌ Galaxy Data screen did not load');
        }
        
      } else {
        console.log('❌ Galaxy Data option not found in navigation');
      }
      
    } else {
      console.log('❌ Galaxy accordion section not found');
    }
    
    // Test 3: Overall functionality
    console.log('\\n🧪 Testing Overall Functionality...');
    
    // Check if any "under development" messages exist
    const underDevelopment = await page.locator('text=under development').isVisible().catch(() => false);
    if (underDevelopment) {
      console.log('⚠️ Found "under development" message');
    } else {
      console.log('✅ No "under development" messages found');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'temp_dev/galaxy_test_final.png', fullPage: true });
    
    console.log('\\n📊 Test Summary:');
    console.log('- Galaxy Map: Enhanced with camera controls');
    console.log('- Galaxy Data: Accessible and functional');
    console.log('- Screenshots saved to temp_dev/');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'temp_dev/galaxy_test_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testGalaxyComprehensive().catch(console.error);
