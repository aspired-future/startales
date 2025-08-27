const { chromium } = require('playwright');

async function debugCharacterClicking() {
  console.log('🎭 Starting Playwright debug for character clicking...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    devtools: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs from the browser
  page.on('console', msg => {
    console.log(`🌐 Browser Console [${msg.type()}]:`, msg.text());
  });
  
  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log(`📡 API Request: ${request.method()} ${request.url()}`);
    }
  });
  
  // Listen for network responses
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`📡 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('🌐 Navigating to game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    console.log('📱 Looking for WhoseApp communications button...');
    await page.waitForSelector('[title*="Communications"], [aria-label*="Communications"], .communications-button, .whoseapp-button', { timeout: 10000 });
    
    // Try multiple selectors for the communications button
    const communicationsSelectors = [
      '[title*="Communications"]',
      '[aria-label*="Communications"]', 
      '.communications-button',
      '.whoseapp-button',
      'button:has-text("Communications")',
      'button:has-text("WhoseApp")',
      '[data-testid="communications"]',
      '.side-panel button:nth-child(3)', // Often the 3rd button
      'button[title="Communications"]'
    ];
    
    let communicationsButton = null;
    for (const selector of communicationsSelectors) {
      try {
        communicationsButton = await page.$(selector);
        if (communicationsButton) {
          console.log(`✅ Found communications button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!communicationsButton) {
      console.log('❌ Could not find communications button, taking screenshot...');
      await page.screenshot({ path: 'debug-no-communications-button.png', fullPage: true });
      
      // List all buttons to help debug
      const buttons = await page.$$eval('button', buttons => 
        buttons.map(btn => ({
          text: btn.textContent?.trim(),
          title: btn.title,
          className: btn.className,
          id: btn.id
        }))
      );
      console.log('🔍 All buttons found:', buttons);
      return;
    }
    
    console.log('🖱️ Clicking communications button...');
    await communicationsButton.click();
    await page.waitForTimeout(2000);
    
    console.log('📱 Looking for WhoseApp...');
    await page.waitForSelector('.whoseapp-main, .whoseapp-container, [data-testid="whoseapp"]', { timeout: 5000 });
    
    console.log('👥 Looking for Characters tab...');
    const charactersTab = await page.waitForSelector('button:has-text("Characters"), .characters-tab, [data-tab="characters"]', { timeout: 5000 });
    
    console.log('🖱️ Clicking Characters tab...');
    await charactersTab.click();
    await page.waitForTimeout(2000);
    
    console.log('👤 Looking for character items...');
    await page.waitForSelector('.character-item, .character-card, [data-testid="character"]', { timeout: 10000 });
    
    // Get all character elements
    const characterElements = await page.$$('.character-item, .character-card, [data-testid="character"]');
    console.log(`✅ Found ${characterElements.length} character elements`);
    
    if (characterElements.length === 0) {
      console.log('❌ No character elements found, taking screenshot...');
      await page.screenshot({ path: 'debug-no-characters.png', fullPage: true });
      return;
    }
    
    // Try clicking the first character
    console.log('🖱️ Attempting to click first character...');
    const firstCharacter = characterElements[0];
    
    // Check if character has clickable elements
    const clickableElements = await firstCharacter.$$('img, .avatar, .character-name, button');
    console.log(`🔍 Found ${clickableElements.length} clickable elements in first character`);
    
    // Try clicking the avatar/image first
    const avatar = await firstCharacter.$('img, .avatar');
    if (avatar) {
      console.log('🖱️ Clicking character avatar...');
      await avatar.click();
      await page.waitForTimeout(2000);
      
      // Check if profile modal opened
      const profileModal = await page.$('.character-profile-modal, .profile-modal, [data-testid="profile-modal"]');
      if (profileModal) {
        console.log('✅ SUCCESS: Character profile modal opened!');
        await page.screenshot({ path: 'debug-profile-modal-success.png', fullPage: true });
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
      const profileModal = await page.$('.character-profile-modal, .profile-modal, [data-testid="profile-modal"]');
      if (profileModal) {
        console.log('✅ SUCCESS: Character profile modal opened after clicking name!');
        await page.screenshot({ path: 'debug-profile-modal-name-success.png', fullPage: true });
      } else {
        console.log('❌ Profile modal did not open after clicking name');
      }
    }
    
    // Try clicking any buttons in the character item
    const characterButtons = await firstCharacter.$$('button');
    for (let i = 0; i < characterButtons.length; i++) {
      const button = characterButtons[i];
      const buttonText = await button.textContent();
      console.log(`🖱️ Clicking character button ${i + 1}: "${buttonText?.trim()}"`);
      
      await button.click();
      await page.waitForTimeout(2000);
      
      // Check if profile modal opened
      const profileModal = await page.$('.character-profile-modal, .profile-modal, [data-testid="profile-modal"]');
      if (profileModal) {
        console.log(`✅ SUCCESS: Character profile modal opened after clicking button "${buttonText?.trim()}"!`);
        await page.screenshot({ path: `debug-profile-modal-button-${i}-success.png`, fullPage: true });
        break;
      }
    }
    
    // Take final screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ path: 'debug-character-clicking-final.png', fullPage: true });
    
    // Check browser console for any errors
    console.log('🔍 Checking for JavaScript errors...');
    const errors = await page.evaluate(() => {
      return window.console.errors || [];
    });
    
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:', errors);
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
  } finally {
    console.log('🎭 Closing browser...');
    await browser.close();
  }
}

debugCharacterClicking().catch(console.error);

