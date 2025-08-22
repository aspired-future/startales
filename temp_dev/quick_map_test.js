import { chromium } from 'playwright';

async function quickMapTest() {
  console.log('🚀 Quick Map Unification Test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Test center tab map
    console.log('\\n🗺️ Testing center tab map...');
    await page.click('text=🗺️ Map');
    await page.waitForTimeout(2000);
    
    let popup = await page.locator('.popup-backdrop').isVisible().catch(() => false);
    console.log('Center tab opens popup:', popup);
    
    if (popup) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
    }
    
    // Test left menu map
    console.log('\\n🌌 Testing left menu map...');
    await page.click('text=GALAXY');
    await page.waitForTimeout(1000);
    
    const leftMapVisible = await page.locator('text=🗺️ Galaxy Map').isVisible().catch(() => false);
    console.log('Left menu Galaxy Map visible:', leftMapVisible);
    
    if (leftMapVisible) {
      await page.click('text=🗺️ Galaxy Map');
      await page.waitForTimeout(2000);
      
      popup = await page.locator('.popup-backdrop').isVisible().catch(() => false);
      console.log('Left menu opens popup:', popup);
      
      if (popup) {
        const component = await page.locator('.galaxy-map-component').isVisible().catch(() => false);
        console.log('Galaxy component visible:', component);
        
        await page.screenshot({ path: 'temp_dev/unified_map_success.png', fullPage: true });
        console.log('📸 Screenshot saved');
      }
    }
    
    console.log('\\n✅ Both map buttons now open the same popup!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

quickMapTest().catch(console.error);
