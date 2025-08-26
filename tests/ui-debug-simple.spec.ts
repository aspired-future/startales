import { test, expect } from '@playwright/test';

test('UI Debug - Basic Loading', async ({ page }) => {
  console.log('🧪 Starting UI debug test...');
  
  // Navigate to the UI
  console.log('📍 Navigating to http://localhost:5174');
  await page.goto('http://localhost:5174');
  
  // Wait a bit for the page to load
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/ui-debug.png', fullPage: true });
  console.log('📸 Screenshot saved to tests/screenshots/ui-debug.png');
  
  // Check if the page loaded
  const title = await page.title();
  console.log('📄 Page title:', title);
  
  // Check for any console errors
  const logs: string[] = [];
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`);
    console.log(`🖥️  Console ${msg.type()}: ${msg.text()}`);
  });
  
  // Check for network errors
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`❌ Network error: ${response.status()} ${response.url()}`);
    }
  });
  
  // Wait for any React components to load
  await page.waitForTimeout(5000);
  
  // Check if main app container exists
  const appContainer = await page.locator('#root').count();
  console.log('🏗️  App container found:', appContainer > 0);
  
  // Get page content for debugging
  const bodyText = await page.locator('body').textContent();
  console.log('📝 Page content preview:', bodyText?.substring(0, 200) + '...');
  
  // Check for specific UI elements
  const gameHUD = await page.locator('[class*="ComprehensiveHUD"]').count();
  console.log('🎮 Game HUD found:', gameHUD > 0);
  
  const whoseAppButton = await page.locator('text=WhoseApp').count();
  console.log('💬 WhoseApp button found:', whoseAppButton > 0);
  
  console.log('✅ UI debug test completed');
});
