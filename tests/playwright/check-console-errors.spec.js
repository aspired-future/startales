import { test, expect } from '@playwright/test';

test('Check console for errors and UI loading', async ({ page }) => {
  const consoleMessages = [];
  const errors = [];

  // Capture console messages
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
    
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    console.log('🔍 Navigating to UI...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
    
    console.log('✅ Page loaded successfully');
    
    // Wait a bit for any async loading
    await page.waitForTimeout(3000);
    
    // Check if main UI elements are present
    const title = await page.textContent('title');
    console.log(`📄 Page title: ${title}`);
    
    // Look for any React/UI elements
    const bodyContent = await page.textContent('body');
    const hasReactContent = bodyContent.includes('StarTales') || bodyContent.includes('Galaxy') || bodyContent.includes('Command');
    
    console.log(`🎯 Has UI content: ${hasReactContent}`);
    
    // Log console messages
    console.log('\n📋 CONSOLE MESSAGES:');
    consoleMessages.forEach((msg, index) => {
      console.log(`${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      if (msg.location && msg.location.url) {
        console.log(`   📍 ${msg.location.url}:${msg.location.lineNumber}`);
      }
    });
    
    // Log errors specifically
    if (errors.length > 0) {
      console.log('\n❌ ERRORS FOUND:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ No console errors found');
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests/playwright/screenshots/ui-debug.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/playwright/screenshots/ui-debug.png');
    
  } catch (error) {
    console.log(`❌ Failed to load UI: ${error.message}`);
    
    // Still log any console messages we captured
    if (consoleMessages.length > 0) {
      console.log('\n📋 CONSOLE MESSAGES (before failure):');
      consoleMessages.forEach((msg, index) => {
        console.log(`${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
      });
    }
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORS FOUND:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  }
});
