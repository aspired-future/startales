import { chromium } from 'playwright';

async function debugWhoseAppUI() {
  console.log('🔍 Debugging WhoseApp UI...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ path: 'tests/screenshots/debug_initial.png', fullPage: true });
    
    // Find and click WhoseApp
    const whoseappButtons = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseappButtons.length} WhoseApp buttons`);
    
    if (whoseappButtons.length > 0) {
      console.log('✅ Clicking WhoseApp...');
      await whoseappButtons[0].click();
      
      // Wait for WhoseApp to load
      await page.waitForTimeout(3000);
      
      console.log('📸 Taking WhoseApp opened screenshot...');
      await page.screenshot({ path: 'tests/screenshots/debug_whoseapp_opened.png', fullPage: true });
      
      // Debug: Look for all buttons in WhoseApp
      console.log('🔍 Searching for all buttons in WhoseApp...');
      const allButtons = await page.locator('button').all();
      console.log(`Found ${allButtons.length} total buttons`);
      
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        try {
          const buttonText = await allButtons[i].textContent();
          const isVisible = await allButtons[i].isVisible();
          console.log(`Button ${i + 1}: "${buttonText}" (visible: ${isVisible})`);
        } catch (error) {
          console.log(`Button ${i + 1}: Error reading - ${error.message}`);
        }
      }
      
      // Look for specific emoji buttons
      console.log('🔍 Looking for emoji buttons...');
      const emojiButtons = ['🎤', '⌨️', '📤', '🔊', '🔇'];
      for (const emoji of emojiButtons) {
        const emojiButton = await page.locator(`button:has-text("${emoji}")`).count();
        console.log(`${emoji} button count: ${emojiButton}`);
      }
      
      // Look for voice mode buttons specifically
      console.log('🔍 Looking for voice mode buttons...');
      const voiceOnButton = await page.locator('button:has-text("🔊 Voice On")').count();
      const voiceOffButton = await page.locator('button:has-text("🔇 Voice Off")').count();
      console.log(`"🔊 Voice On" button count: ${voiceOnButton}`);
      console.log(`"🔇 Voice Off" button count: ${voiceOffButton}`);
      
      // Look for buttons containing specific text
      console.log('🔍 Looking for buttons with voice-related text...');
      const voiceTexts = ['voice', 'mic', 'speak', 'listen'];
      for (const text of voiceTexts) {
        const textButton = await page.locator(`button:has-text("${text}")`).count();
        console.log(`"${text}" button count: ${textButton}`);
      }
      
      // Try to find the message input area
      console.log('🔍 Looking for message input area...');
      const messageInputs = await page.locator('input[type="text"], textarea').all();
      console.log(`Found ${messageInputs.length} text inputs`);
      
      // Look for any button near the input
      if (messageInputs.length > 0) {
        console.log('🔍 Looking for buttons near message input...');
        const nearbyButtons = await page.locator('input[type="text"] ~ button, textarea ~ button').all();
        console.log(`Found ${nearbyButtons.length} buttons near inputs`);
        
        for (let i = 0; i < nearbyButtons.length; i++) {
          try {
            const buttonText = await nearbyButtons[i].textContent();
            console.log(`Nearby button ${i + 1}: "${buttonText}"`);
          } catch (error) {
            console.log(`Nearby button ${i + 1}: Error reading`);
          }
        }
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

debugWhoseAppUI().catch(console.error);
