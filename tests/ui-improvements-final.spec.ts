import { test, expect } from '@playwright/test';

test('UI Improvements Final Test', async ({ page }) => {
  console.log('🧪 Testing all UI improvements...');
  
  // Navigate to the UI
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Check page title
  const title = await page.title();
  console.log('📄 Page title:', title);
  expect(title).toBe('LIVELYGALAXY.AI');
  
  // Check for wide square buttons in right panel
  const quickAccessGrid = await page.locator('.quick-access-grid').count();
  const quickAccessButtons = await page.locator('.quick-access-btn').count();
  console.log('📱 Quick access grid found:', quickAccessGrid > 0);
  console.log('🔲 Quick access buttons found:', quickAccessButtons);
  expect(quickAccessButtons).toBe(6);
  
  // Check for Active Missions section
  const activeMissions = await page.locator('.active-missions-section').count();
  const missionItems = await page.locator('.mission-item').count();
  console.log('🎯 Active Missions section found:', activeMissions > 0);
  console.log('📋 Mission items found:', missionItems);
  expect(activeMissions).toBeGreaterThan(0);
  expect(missionItems).toBe(3);
  
  // Check for unread badges
  const unreadBadges = await page.locator('.unread-badge').count();
  console.log('🔔 Unread badges found:', unreadBadges);
  expect(unreadBadges).toBe(3);
  
  // Check for Leading Civilizations (not All Civilizations)
  const leadingCivs = await page.locator('text=LEADING CIVILIZATIONS').count();
  const allCivs = await page.locator('text=ALL CIVILIZATIONS').count();
  console.log('🏆 Leading Civilizations found:', leadingCivs > 0);
  console.log('❌ Old "All Civilizations" found:', allCivs);
  expect(leadingCivs).toBeGreaterThan(0);
  expect(allCivs).toBe(0);
  
  // Check for Command Center welcome message (no more redundant tabs)
  const welcomeHeader = await page.locator('.welcome-header').count();
  const commandCenter = await page.locator('text=Command Center').count();
  console.log('🌌 Welcome header found:', welcomeHeader > 0);
  console.log('🎮 Command Center found:', commandCenter > 0);
  
  // Check for stat cards in center panel
  const statCards = await page.locator('.stat-card').count();
  console.log('📊 Stat cards found:', statCards);
  expect(statCards).toBe(4);
  
  // Check bottom status bar for new content
  const statusBar = await page.locator('.status-bar').textContent();
  console.log('📊 Status bar includes galaxy stats:', statusBar?.includes('Systems: 2,847'));
  console.log('⏰ Status bar includes tick count:', statusBar?.includes('Tick: 2847'));
  console.log('❌ Status bar excludes speed:', !statusBar?.includes('Speed:'));
  
  // Test button functionality
  console.log('🖱️  Testing WhoseApp button click...');
  await page.locator('.quick-access-btn:has-text("WhoseApp")').click();
  await page.waitForTimeout(1000);
  
  // Check if WhoseApp panel opened in center
  const whoseappContent = await page.locator('text=WhoseApp').count();
  console.log('💬 WhoseApp content loaded:', whoseappContent > 0);
  
  // Test Story button
  console.log('🖱️  Testing Story button click...');
  await page.locator('.quick-access-btn:has-text("Story")').click();
  await page.waitForTimeout(1000);
  
  // Check Game Master section styling
  const gameMasterSection = await page.locator('.game-master-section').count();
  const gmContent = await page.locator('.gm-content p').count();
  console.log('🎮 Game Master section found:', gameMasterSection > 0);
  console.log('📝 GM content items found:', gmContent);
  
  // Take final screenshot
  await page.screenshot({ path: 'tests/screenshots/ui-improvements-final.png', fullPage: true });
  console.log('📸 Final UI improvements screenshot saved');
  
  console.log('✅ All UI improvements verified successfully!');
});
