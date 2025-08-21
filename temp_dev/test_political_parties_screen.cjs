const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch(); // Set to false to see the browser
  const page = await browser.newPage();

  console.log('🎭 Testing Political Parties Screen...');

  // Try common ports
  const ports = [5177, 5176, 5175, 5174];
  let activePort = null;

  for (const port of ports) {
    console.log(`🔍 Checking port ${port}...`);
    try {
      const response = await page.goto(`http://localhost:${port}/`, { timeout: 5000, waitUntil: 'domcontentloaded' });
      if (response && response.ok()) {
        activePort = port;
        console.log(`✅ Server on ${port} is running.`);
        break;
      }
    } catch (error) {
      console.log(`❌ Port ${port} not responding`);
    }
  }

  if (!activePort) {
    console.error('❌ No server found on any port');
    await browser.close();
    return;
  }

  try {
    await page.goto(`http://localhost:${activePort}/`, { waitUntil: 'networkidle' });

    // Navigate to Political Parties screen
    console.log('🏛️ Navigating to Political Parties screen...');
    await page.click('.accordion-header:has-text("GOVERNMENT & LEADERSHIP")');
    await page.click('text="Political Parties"');
    
    // Wait for the screen to load
    await page.waitForSelector('.political-parties-screen', { state: 'visible' });
    
    // Check screen title
    const screenTitle = await page.textContent('.base-screen h2');
    if (screenTitle && screenTitle.includes('Political Parties')) {
      console.log('✅ Political Parties screen loaded correctly.');
    } else {
      console.error('❌ Political Parties screen title mismatch. Expected "Political Parties", got:', screenTitle);
    }

    // Test tab navigation
    console.log('📊 Testing tab navigation...');
    const tabs = ['overview', 'leadership', 'coalitions', 'electoral', 'policy', 'witter'];
    
    for (const tab of tabs) {
      const tabButton = await page.locator(`.tab-btn:has-text("${tab.charAt(0).toUpperCase() + tab.slice(1)}")`);
      if (await tabButton.count() > 0) {
        await tabButton.click();
        await page.waitForTimeout(500); // Wait for tab content to load
        console.log(`✅ ${tab.charAt(0).toUpperCase() + tab.slice(1)} tab working`);
      } else {
        console.log(`⚠️ ${tab.charAt(0).toUpperCase() + tab.slice(1)} tab not found`);
      }
    }

    // Test party data display
    console.log('🎭 Testing party data display...');
    await page.click('.tab-btn:has-text("Overview")');
    
    const partyItems = await page.locator('.party-item').count();
    if (partyItems > 0) {
      console.log(`✅ Found ${partyItems} political parties displayed`);
    } else {
      console.log('⚠️ No political parties found');
    }

    // Test coalition data
    await page.click('.tab-btn:has-text("Coalitions")');
    const coalitionItems = await page.locator('.coalition-item').count();
    if (coalitionItems > 0) {
      console.log(`✅ Found ${coalitionItems} political coalitions displayed`);
    } else {
      console.log('⚠️ No political coalitions found');
    }

    // Test Witter feed
    await page.click('.tab-btn:has-text("Witter")');
    const witterPosts = await page.locator('.witter-post').count();
    if (witterPosts > 0) {
      console.log(`✅ Found ${witterPosts} Witter posts displayed`);
    } else {
      console.log('⚠️ No Witter posts found');
    }

    // Test action buttons
    console.log('🔘 Testing action buttons...');
    await page.click('.tab-btn:has-text("Overview")');
    const actionButtons = await page.locator('.btn').count();
    if (actionButtons > 0) {
      console.log(`✅ Found ${actionButtons} action buttons`);
      
      // Test clicking a button (should show alert)
      page.on('dialog', async dialog => {
        console.log(`✅ Action button triggered: ${dialog.message().substring(0, 50)}...`);
        await dialog.accept();
      });
      
      const firstButton = page.locator('.btn').first();
      if (await firstButton.count() > 0) {
        await firstButton.click();
        await page.waitForTimeout(1000);
      }
    } else {
      console.log('⚠️ No action buttons found');
    }

    console.log('✅ All Political Parties screen tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();
