import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:4000';

test.describe('Debug Demos Recursively', () => {
  
  test('Debug Speech Demo - Full Functionality', async ({ page }) => {
    console.log('🔍 Testing Speech Demo...');
    
    await page.goto(`${BASE_URL}/demo/speech`);
    
    // Check page loads
    await expect(page).toHaveTitle(/Speech Demo/);
    console.log('✅ Speech demo page loads');
    
    // Check UI elements exist
    const audienceSelect = page.locator('#aud');
    const textArea = page.locator('#text');
    const speakButton = page.locator('#send');
    const output = page.locator('#out');
    
    await expect(audienceSelect).toBeVisible();
    await expect(textArea).toBeVisible();
    await expect(speakButton).toBeVisible();
    await expect(output).toBeVisible();
    console.log('✅ All UI elements present');
    
    // Test functionality
    await audienceSelect.selectOption('workers');
    await textArea.fill('We must increase production and support our workers with better conditions');
    await speakButton.click();
    
    // Wait for API response
    await page.waitForTimeout(2000);
    
    const outputText = await output.textContent();
    console.log('Speech API Response:', outputText?.substring(0, 200));
    
    // Verify response contains expected fields
    expect(outputText).toContain('audience');
    expect(outputText).toContain('workers');
    expect(outputText).toContain('opinions');
    
    await page.screenshot({ path: 'tests/screenshots/speech-demo-working.png' });
    console.log('✅ Speech demo fully functional');
  });

  test('Debug Cabinet Demo - Full Functionality', async ({ page }) => {
    console.log('🔍 Testing Cabinet Demo...');
    
    await page.goto(`${BASE_URL}/demo/cabinet`);
    
    // Check page loads
    await expect(page).toHaveTitle(/Cabinet Meeting Demo/);
    console.log('✅ Cabinet demo page loads');
    
    // Check UI elements
    const textarea = page.locator('#tx');
    const processButton = page.locator('#run');
    const output = page.locator('#out');
    
    await expect(textarea).toBeVisible();
    await expect(processButton).toBeVisible();
    await expect(output).toBeVisible();
    console.log('✅ All UI elements present');
    
    // Test functionality
    await processButton.click();
    await page.waitForTimeout(2000);
    
    const outputText = await output.textContent();
    console.log('Cabinet API Response:', outputText?.substring(0, 200));
    
    // Verify response
    expect(outputText).toContain('transcriptHash');
    expect(outputText).toContain('parsedModifiers');
    
    await page.screenshot({ path: 'tests/screenshots/cabinet-demo-working.png' });
    console.log('✅ Cabinet demo fully functional');
  });

  test('Debug Trade Demo - Check Current State', async ({ page }) => {
    console.log('🔍 Testing Trade Demo...');
    
    await page.goto(`${BASE_URL}/demo/trade`);
    
    const bodyText = await page.textContent('body');
    console.log('Trade demo content:', bodyText);
    
    if (bodyText?.includes('Coming soon!')) {
      console.log('❌ Trade demo is just a placeholder');
      test.fail(true, 'Trade demo needs full implementation');
    } else {
      console.log('✅ Trade demo has content');
    }
    
    await page.screenshot({ path: 'tests/screenshots/trade-demo-current.png' });
  });

  test('Debug Simulation Demo - Check Current State', async ({ page }) => {
    console.log('🔍 Testing Simulation Demo...');
    
    await page.goto(`${BASE_URL}/demo/simulation`);
    
    const bodyText = await page.textContent('body');
    console.log('Simulation demo content:', bodyText);
    
    if (bodyText?.includes('Coming soon!')) {
      console.log('❌ Simulation demo is just a placeholder');
      test.fail(true, 'Simulation demo needs full implementation');
    } else {
      console.log('✅ Simulation demo has content');
    }
    
    await page.screenshot({ path: 'tests/screenshots/simulation-demo-current.png' });
  });

  test('Debug Population Demo - Check Current State', async ({ page }) => {
    console.log('🔍 Testing Population Demo...');
    
    await page.goto(`${BASE_URL}/demo/population`);
    
    const bodyText = await page.textContent('body');
    console.log('Population demo content:', bodyText);
    
    if (bodyText?.includes('Coming soon!')) {
      console.log('❌ Population demo is just a placeholder');
      test.fail(true, 'Population demo needs full implementation');
    } else {
      console.log('✅ Population demo has content');
    }
    
    await page.screenshot({ path: 'tests/screenshots/population-demo-current.png' });
  });

  test('Debug Professions Demo - Check Current State', async ({ page }) => {
    console.log('🔍 Testing Professions Demo...');
    
    await page.goto(`${BASE_URL}/demo/professions`);
    
    const bodyText = await page.textContent('body');
    console.log('Professions demo content:', bodyText);
    
    if (bodyText?.includes('Coming soon!')) {
      console.log('❌ Professions demo is just a placeholder');
      test.fail(true, 'Professions demo needs full implementation');
    } else {
      console.log('✅ Professions demo has content');
    }
    
    await page.screenshot({ path: 'tests/screenshots/professions-demo-current.png' });
  });

  test('Debug Businesses Demo - Check Current State', async ({ page }) => {
    console.log('🔍 Testing Businesses Demo...');
    
    await page.goto(`${BASE_URL}/demo/businesses`);
    
    const bodyText = await page.textContent('body');
    console.log('Businesses demo content:', bodyText);
    
    if (bodyText?.includes('Coming soon!')) {
      console.log('❌ Businesses demo is just a placeholder');
      test.fail(true, 'Businesses demo needs full implementation');
    } else {
      console.log('✅ Businesses demo has content');
    }
    
    await page.screenshot({ path: 'tests/screenshots/businesses-demo-current.png' });
  });

  test('Debug API Endpoints - Test All Demo APIs', async ({ request }) => {
    console.log('🔍 Testing Demo API Endpoints...');
    
    // Test Speech API
    const speechResponse = await request.post(`${BASE_URL}/api/comms/speech`, {
      data: { audience: 'workers', text: 'Test speech' }
    });
    expect(speechResponse.ok()).toBeTruthy();
    const speechData = await speechResponse.json();
    console.log('✅ Speech API working:', Object.keys(speechData));
    
    // Test Cabinet API
    const cabinetResponse = await request.post(`${BASE_URL}/api/gov/cabinet/meeting`, {
      data: { segments: [{ speaker: 'PM', text: 'Test meeting' }] }
    });
    expect(cabinetResponse.ok()).toBeTruthy();
    const cabinetData = await cabinetResponse.json();
    console.log('✅ Cabinet API working:', Object.keys(cabinetData));
    
    // Test Trade APIs
    const pricesResponse = await request.get(`${BASE_URL}/api/trade/prices`);
    expect(pricesResponse.ok()).toBeTruthy();
    const pricesData = await pricesResponse.json();
    console.log('✅ Trade Prices API working:', Object.keys(pricesData));
    
    // Test Simulation API
    const simResponse = await request.post(`${BASE_URL}/api/sim/step`, {
      data: { campaignId: 1, seed: 'test-seed' }
    });
    expect(simResponse.ok()).toBeTruthy();
    const simData = await simResponse.json();
    console.log('✅ Simulation API working:', Object.keys(simData));
    
    // Test Population API
    const popResponse = await request.get(`${BASE_URL}/api/population/stats`);
    expect(popResponse.ok()).toBeTruthy();
    const popData = await popResponse.json();
    console.log('✅ Population API working:', Object.keys(popData));
    
    // Test Professions API
    const profResponse = await request.get(`${BASE_URL}/api/professions/list`);
    expect(profResponse.ok()).toBeTruthy();
    const profData = await profResponse.json();
    console.log('✅ Professions API working:', Object.keys(profData));
    
    // Test Businesses API
    const bizResponse = await request.get(`${BASE_URL}/api/businesses/list`);
    expect(bizResponse.ok()).toBeTruthy();
    const bizData = await bizResponse.json();
    console.log('✅ Businesses API working:', Object.keys(bizData));
  });

  test('Debug Witter UI - Find Missing Elements', async ({ page }) => {
    console.log('🔍 Testing Witter UI...');
    
    await page.goto('http://localhost:5173');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check what elements actually exist
    const allElements = await page.locator('*').all();
    console.log(`Found ${allElements.length} total elements`);
    
    // Look for various possible selectors
    const possibleSelectors = [
      '.witter-feed',
      '.posts-container', 
      '.feed-container',
      '.modern-witter-feed',
      '.post',
      '.posts',
      '[class*="witter"]',
      '[class*="feed"]',
      '[class*="post"]'
    ];
    
    for (const selector of possibleSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found ${count} elements with selector: ${selector}`);
      } else {
        console.log(`❌ No elements found with selector: ${selector}`);
      }
    }
    
    // Check page title and content
    const title = await page.title();
    const bodyText = await page.textContent('body');
    console.log('Page title:', title);
    console.log('Body text preview:', bodyText?.substring(0, 200));
    
    await page.screenshot({ path: 'tests/screenshots/witter-ui-debug.png', fullPage: true });
  });
});
