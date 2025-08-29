import { chromium } from 'playwright';

async function checkAvailableButtons() {
  console.log('🔍 Checking available buttons...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Get all buttons
    const buttons = await page.locator('button').all();
    console.log(`🔘 Found ${buttons.length} buttons total`);
    
    // Get text content of all buttons
    for (let i = 0; i < Math.min(buttons.length, 20); i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i + 1}: "${text}"`);
    }
    
    // Look for specific categories
    const categories = ['Population', 'Government', 'Science', 'Economy', 'Security', 'Communications'];
    for (const category of categories) {
      const button = await page.locator(`button:has-text("${category}")`).first();
      if (await button.isVisible()) {
        console.log(`✅ Found ${category} button`);
      } else {
        console.log(`❌ ${category} button not found`);
      }
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/available-buttons.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/screenshots/available-buttons.png');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

checkAvailableButtons().catch(console.error);

