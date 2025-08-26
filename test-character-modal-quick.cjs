const { chromium } = require('playwright');

async function testCharacterModal() {
  console.log('🎭 Quick test for character profile modal...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
    if (msg.text().includes('Character') || msg.text().includes('profile')) {
      console.log(`🌐 Browser:`, msg.text());
    }
  });
  
  try {
    console.log('🌐 Loading game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    console.log('📱 Clicking WhoseApp tab...');
    await page.click('button:has-text("WhoseApp")');
    await page.waitForTimeout(1000);
    
    console.log('👥 Clicking Characters tab...');
    await page.click('button:has-text("Characters")');
    await page.waitForTimeout(2000);
    
    console.log('👤 Clicking first character avatar...');
    await page.click('.character-item img, .character-item .avatar');
    await page.waitForTimeout(2000);
    
    // Check if modal appeared
    const modal = await page.$('.character-profile-modal, .profile-modal, .modal');
    if (modal) {
      console.log('✅ SUCCESS: Character profile modal is now visible!');
      await page.screenshot({ path: 'debug-modal-success.png', fullPage: true });
    } else {
      console.log('❌ Modal still not visible');
      await page.screenshot({ path: 'debug-modal-failed.png', fullPage: true });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

testCharacterModal().catch(console.error);

