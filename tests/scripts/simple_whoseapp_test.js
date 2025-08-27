import { chromium } from 'playwright';

async function simpleWhoseAppTest() {
  console.log('🚀 Simple WhoseApp Test...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'tests/screenshots/whoseapp_current_state.png', fullPage: true });
    
    // Look for any buttons with "WhoseApp" text
    const whoseappButtons = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseappButtons.length} WhoseApp buttons`);
    
    if (whoseappButtons.length > 0) {
      console.log('✅ WhoseApp button found, clicking...');
      await whoseappButtons[0].click();
      
      // Wait for WhoseApp to load
      await page.waitForTimeout(2000);
      
      // Take another screenshot
      await page.screenshot({ path: 'tests/screenshots/whoseapp_opened.png', fullPage: true });
      
      // Look for voice toggle button (shows ⌨️ when not in voice mode, 🎤 when in voice mode)
      const voiceButton = await page.locator('button:has-text("⌨️")').first();
      if (await voiceButton.isVisible()) {
        console.log('✅ Voice toggle button found (⌨️)!');
        console.log('🎤 Testing voice button click to enable voice mode...');
        await voiceButton.click();
        
        await page.waitForTimeout(1000);
        
        // Now check if it changed to mic mode
        const micButton = await page.locator('button:has-text("🎤")').first();
        if (await micButton.isVisible()) {
          console.log('✅ Voice mode activated - mic button (🎤) now visible!');
          console.log('🔇 Clicking again to disable voice mode...');
          await micButton.click();
          await page.waitForTimeout(500);
          console.log('✅ Voice mode test completed successfully!');
        } else {
          console.log('⚠️ Voice mode may not have activated properly');
        }
      } else {
        console.log('❌ Voice toggle button not found');
      }
    } else {
      console.log('❌ No WhoseApp buttons found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

simpleWhoseAppTest().catch(console.error);
