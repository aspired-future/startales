const { chromium } = require('playwright');

async function debugCharacterClickingFixed() {
  console.log('🎭 Starting Playwright debug for character clicking (FIXED)...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    devtools: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs from the browser
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`🔴 Browser Error:`, msg.text());
    } else if (msg.text().includes('Character') || msg.text().includes('WhoseApp')) {
      console.log(`🌐 Browser Log [${msg.type()}]:`, msg.text());
    }
  });
  
  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('/api/characters') || request.url().includes('/api/whoseapp')) {
      console.log(`📡 API Request: ${request.method()} ${request.url()}`);
    }
  });
  
  // Listen for network responses
  page.on('response', response => {
    if (response.url().includes('/api/characters') || response.url().includes('/api/whoseapp')) {
      console.log(`📡 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('🌐 Navigating to game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    console.log('⏳ Waiting for app to load...');
    await page.waitForTimeout(3000);
    
    console.log('🎯 Looking for center panel tabs...');
    await page.waitForSelector('.tab-button, .center-panel .tabs button', { timeout: 10000 });
    
    console.log('📱 Looking for WhoseApp tab in center panel...');
    const whoseAppTab = await page.waitForSelector('button:has-text("WhoseApp"), .tab-button:has-text("WhoseApp")', { timeout: 5000 });
    
    console.log('🖱️ Clicking WhoseApp tab...');
    await whoseAppTab.click();
    await page.waitForTimeout(2000);
    
    console.log('📱 Waiting for WhoseApp to load...');
    await page.waitForSelector('.whoseapp-main, .whoseapp-container', { timeout: 10000 });
    
    console.log('👥 Looking for Characters tab within WhoseApp...');
    const charactersTab = await page.waitForSelector('button:has-text("Characters")', { timeout: 5000 });
    
    console.log('🖱️ Clicking Characters tab...');
    await charactersTab.click();
    await page.waitForTimeout(2000);
    
    console.log('👤 Waiting for character items to load...');
    await page.waitForSelector('.character-item', { timeout: 10000 });
    
    // Get all character elements
    const characterElements = await page.$$('.character-item');
    console.log(`✅ Found ${characterElements.length} character elements`);
    
    if (characterElements.length === 0) {
      console.log('❌ No character elements found, taking screenshot...');
      await page.screenshot({ path: 'debug-no-characters-fixed.png', fullPage: true });
      return;
    }
    
    // Try clicking the first character's avatar
    console.log('🖱️ Attempting to click first character avatar...');
    const firstCharacter = characterElements[0];
    
    // Look for clickable avatar
    const avatar = await firstCharacter.$('img, .character-avatar, .avatar');
    if (avatar) {
      console.log('🖱️ Clicking character avatar...');
      await avatar.click();
      await page.waitForTimeout(2000);
      
      // Check if profile modal opened
      const profileModal = await page.$('.character-profile-modal, .profile-modal, [data-testid="profile-modal"], .modal');
      if (profileModal) {
        console.log('✅ SUCCESS: Character profile modal opened!');
        await page.screenshot({ path: 'debug-profile-modal-success-fixed.png', fullPage: true });
        
        // Close modal and try next character
        const closeButton = await profileModal.$('button:has-text("Close"), .close-button, .modal-close');
        if (closeButton) {
          await closeButton.click();
          await page.waitForTimeout(1000);
        }
      } else {
        console.log('❌ Profile modal did not open after clicking avatar');
      }
    }
    
    // Try clicking the character name
    const characterName = await firstCharacter.$('.character-name, .name, h3, h4');
    if (characterName) {
      console.log('🖱️ Clicking character name...');
      await characterName.click();
      await page.waitForTimeout(2000);
      
      // Check if profile modal opened
      const profileModal = await page.$('.character-profile-modal, .profile-modal, [data-testid="profile-modal"], .modal');
      if (profileModal) {
        console.log('✅ SUCCESS: Character profile modal opened after clicking name!');
        await page.screenshot({ path: 'debug-profile-modal-name-success-fixed.png', fullPage: true });
      } else {
        console.log('❌ Profile modal did not open after clicking name');
      }
    }
    
    // Try clicking any buttons in the character item
    const characterButtons = await firstCharacter.$$('button');
    console.log(`🔍 Found ${characterButtons.length} buttons in first character`);
    
    for (let i = 0; i < characterButtons.length; i++) {
      const button = characterButtons[i];
      const buttonText = await button.textContent();
      console.log(`🖱️ Clicking character button ${i + 1}: "${buttonText?.trim()}"`);
      
      await button.click();
      await page.waitForTimeout(2000);
      
      // Check if profile modal opened
      const profileModal = await page.$('.character-profile-modal, .profile-modal, [data-testid="profile-modal"], .modal');
      if (profileModal) {
        console.log(`✅ SUCCESS: Character profile modal opened after clicking button "${buttonText?.trim()}"!`);
        await page.screenshot({ path: `debug-profile-modal-button-${i}-success-fixed.png`, fullPage: true });
        break;
      }
    }
    
    // If no modal opened, check what's actually in the character item
    console.log('🔍 Analyzing character item structure...');
    const characterHTML = await firstCharacter.innerHTML();
    console.log('📋 First character HTML:', characterHTML.substring(0, 500) + '...');
    
    // Check if there are any click handlers
    const clickableElements = await firstCharacter.$$('[onclick], [data-testid*="click"], .clickable');
    console.log(`🔍 Found ${clickableElements.length} elements with click handlers`);
    
    // Take final screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ path: 'debug-character-clicking-final-fixed.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
    await page.screenshot({ path: 'debug-error-fixed.png', fullPage: true });
  } finally {
    console.log('🎭 Closing browser...');
    await browser.close();
  }
}

debugCharacterClickingFixed().catch(console.error);

