import { test, expect } from '@playwright/test';

test('UI Debug - Detailed Analysis', async ({ page }) => {
  console.log('🧪 Starting detailed UI debug test...');
  
  // Capture console logs and errors
  const logs: string[] = [];
  const errors: string[] = [];
  
  page.on('console', msg => {
    const logMessage = `${msg.type()}: ${msg.text()}`;
    logs.push(logMessage);
    console.log(`🖥️  Console ${logMessage}`);
  });
  
  page.on('pageerror', error => {
    const errorMessage = `Page Error: ${error.message}`;
    errors.push(errorMessage);
    console.log(`❌ ${errorMessage}`);
  });
  
  // Capture network requests
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`🌐 Network error: ${response.status()} ${response.url()}`);
    } else if (response.url().includes('.js') || response.url().includes('.css')) {
      console.log(`✅ Loaded: ${response.status()} ${response.url()}`);
    }
  });
  
  // Navigate to the UI
  console.log('📍 Navigating to http://localhost:5174');
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  } catch (error) {
    console.log('❌ Navigation error:', error);
  }
  
  // Wait for React to potentially load
  await page.waitForTimeout(5000);
  
  // Check page structure
  const html = await page.content();
  console.log('📄 HTML length:', html.length);
  
  // Look for specific elements
  const rootElement = await page.locator('#root');
  const rootContent = await rootElement.innerHTML().catch(() => 'ERROR');
  console.log('🏗️  Root element content length:', rootContent.length);
  console.log('🏗️  Root element preview:', rootContent.substring(0, 500));
  
  // Check for React
  const reactElements = await page.locator('[data-reactroot], [data-react-helmet]').count();
  console.log('⚛️  React elements found:', reactElements);
  
  // Check for our main components
  const appElements = await page.locator('[class*="App"], [class*="HUD"], [class*="Game"]').count();
  console.log('🎮 App/Game elements found:', appElements);
  
  // Check for any visible text
  const bodyText = await page.locator('body').textContent();
  console.log('📝 Body text length:', bodyText?.length || 0);
  console.log('📝 Body text preview:', bodyText?.substring(0, 200) || 'EMPTY');
  
  // Check for script tags
  const scripts = await page.locator('script').count();
  console.log('📜 Script tags found:', scripts);
  
  // Check for CSS
  const stylesheets = await page.locator('link[rel="stylesheet"], style').count();
  console.log('🎨 Stylesheets found:', stylesheets);
  
  // Take final screenshot
  await page.screenshot({ path: 'tests/screenshots/ui-debug-detailed.png', fullPage: true });
  console.log('📸 Detailed screenshot saved');
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log(`   - Console logs: ${logs.length}`);
  console.log(`   - Errors: ${errors.length}`);
  console.log(`   - Page loaded: ${html.length > 1000 ? 'YES' : 'NO'}`);
  console.log(`   - React detected: ${reactElements > 0 ? 'YES' : 'NO'}`);
  console.log(`   - Game components: ${appElements > 0 ? 'YES' : 'NO'}`);
  
  if (errors.length > 0) {
    console.log('❌ ERRORS FOUND:');
    errors.forEach(error => console.log(`   - ${error}`));
  }
  
  console.log('✅ Detailed UI debug test completed');
});
