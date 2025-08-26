import { test, expect } from '@playwright/test';

test('WhoseApp Functionality Test', async ({ page }) => {
  console.log('🧪 Testing WhoseApp functionality...');
  
  // Navigate to the UI
  await page.goto('http://localhost:5174');
  await page.waitForTimeout(3000);
  
  // Check if the main UI loaded
  const gameTitle = await page.locator('text=LIVELYGALAXY.COM').count();
  console.log('🌌 Game title found:', gameTitle > 0);
  
  // Look for WhoseApp button in the side panel
  const whoseAppButton = await page.locator('text=WhoseApp').first();
  const whoseAppExists = await whoseAppButton.count();
  console.log('💬 WhoseApp button found:', whoseAppExists > 0);
  
  if (whoseAppExists > 0) {
    // Click WhoseApp button
    console.log('🖱️  Clicking WhoseApp button...');
    await whoseAppButton.click();
    await page.waitForTimeout(2000);
    
    // Check if WhoseApp interface opened
    const whoseAppInterface = await page.locator('[class*="whoseapp"]').count();
    console.log('📱 WhoseApp interface opened:', whoseAppInterface > 0);
    
    // Look for conversation elements
    const conversations = await page.locator('[class*="conversation"], [class*="channel"]').count();
    console.log('💬 Conversations/Channels found:', conversations);
    
    // Look for character profiles
    const characterElements = await page.locator('[class*="character"], [class*="participant"]').count();
    console.log('👥 Character elements found:', characterElements);
    
    // Look for voice controls
    const voiceControls = await page.locator('[class*="voice"], button[class*="voice"]').count();
    console.log('🎤 Voice controls found:', voiceControls);
    
    // Take screenshot of WhoseApp
    await page.screenshot({ path: 'tests/screenshots/whoseapp-functionality.png', fullPage: true });
    console.log('📸 WhoseApp screenshot saved');
  }
  
  // Test character clicking functionality
  const clickableCharacters = await page.locator('[class*="character"]:not([disabled]), [class*="participant"]:not([disabled])').count();
  console.log('🖱️  Clickable characters found:', clickableCharacters);
  
  if (clickableCharacters > 0) {
    console.log('🖱️  Testing character click...');
    await page.locator('[class*="character"]:not([disabled]), [class*="participant"]:not([disabled])').first().click();
    await page.waitForTimeout(1000);
    
    // Check for character profile modal
    const profileModal = await page.locator('[class*="modal"], [class*="profile"]').count();
    console.log('👤 Character profile modal opened:', profileModal > 0);
  }
  
  console.log('✅ WhoseApp functionality test completed');
});
