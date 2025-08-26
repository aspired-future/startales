import { test, expect } from '@playwright/test';

test('UI Layout Test - New Right Panel Tabs', async ({ page }) => {
  console.log('🧪 Testing new UI layout...');
  
  // Navigate to the UI with shorter timeout
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Check if the page title changed
  const title = await page.title();
  console.log('📄 Page title:', title);
  expect(title).toBe('LIVELYGALAXY.AI');
  
  // Check if the main UI loaded
  const gameTitle = await page.locator('text=LIVELYGALAXY.AI').count();
  console.log('🌌 Game title found:', gameTitle > 0);
  
  // Check for right panel tabs
  const storyTab = await page.locator('button:has-text("📖 Story")').count();
  const mapTab = await page.locator('button:has-text("🗺️ Map")').count();
  const whoseappTab = await page.locator('button:has-text("💬 WhoseApp")').count();
  const witterTab = await page.locator('button:has-text("🐦 Witter")').count();
  const galaxyTab = await page.locator('button:has-text("🌌 Galaxy")').count();
  const civTab = await page.locator('button:has-text("🏛️ Civ")').count();
  
  console.log('📖 Story tab found:', storyTab > 0);
  console.log('🗺️ Map tab found:', mapTab > 0);
  console.log('💬 WhoseApp tab found:', whoseappTab > 0);
  console.log('🐦 Witter tab found:', witterTab > 0);
  console.log('🌌 Galaxy tab found:', galaxyTab > 0);
  console.log('🏛️ Civ tab found:', civTab > 0);
  
  // Check for unread badges
  const unreadBadges = await page.locator('.unread-badge').count();
  console.log('🔔 Unread badges found:', unreadBadges);
  
  // Check for refresh buttons
  const refreshButtons = await page.locator('.refresh-btn').count();
  console.log('🔄 Refresh buttons found:', refreshButtons);
  
  // Check for Leading Civilizations instead of All Civilizations
  const leadingCivs = await page.locator('text=LEADING CIVILIZATIONS').count();
  console.log('🏆 Leading Civilizations section found:', leadingCivs > 0);
  
  // Check bottom status bar for new content
  const statusBar = await page.locator('.status-bar').textContent();
  console.log('📊 Status bar content:', statusBar?.substring(0, 100) + '...');
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/ui-layout-test.png', fullPage: true });
  console.log('📸 Layout screenshot saved');
  
  console.log('✅ UI layout test completed');
});
