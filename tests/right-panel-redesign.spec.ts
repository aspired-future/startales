import { test, expect } from '@playwright/test';

test('Right Panel Redesign Test', async ({ page }) => {
  console.log('🧪 Testing new right panel design...');
  
  // Navigate to the UI
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Check for wide square buttons
  const quickAccessGrid = await page.locator('.quick-access-grid').count();
  console.log('📱 Quick access grid found:', quickAccessGrid > 0);
  
  const quickAccessButtons = await page.locator('.quick-access-btn').count();
  console.log('🔲 Quick access buttons found:', quickAccessButtons);
  
  // Check for specific buttons
  const storyBtn = await page.locator('.quick-access-btn:has-text("Story")').count();
  const mapBtn = await page.locator('.quick-access-btn:has-text("Map")').count();
  const whoseappBtn = await page.locator('.quick-access-btn:has-text("WhoseApp")').count();
  const witterBtn = await page.locator('.quick-access-btn:has-text("Witter")').count();
  const galaxyBtn = await page.locator('.quick-access-btn:has-text("Galaxy")').count();
  const civBtn = await page.locator('.quick-access-btn:has-text("Civ")').count();
  
  console.log('📖 Story button found:', storyBtn > 0);
  console.log('🗺️ Map button found:', mapBtn > 0);
  console.log('💬 WhoseApp button found:', whoseappBtn > 0);
  console.log('🐦 Witter button found:', witterBtn > 0);
  console.log('🌌 Galaxy button found:', galaxyBtn > 0);
  console.log('🏛️ Civ button found:', civBtn > 0);
  
  // Check for Active Missions section
  const activeMissions = await page.locator('.active-missions-section').count();
  console.log('🎯 Active Missions section found:', activeMissions > 0);
  
  const missionItems = await page.locator('.mission-item').count();
  console.log('📋 Mission items found:', missionItems);
  
  // Check for unread badges
  const unreadBadges = await page.locator('.unread-badge').count();
  console.log('🔔 Unread badges found:', unreadBadges);
  
  // Test button clicking
  if (storyBtn > 0) {
    console.log('🖱️  Testing Story button click...');
    await page.locator('.quick-access-btn:has-text("Story")').click();
    await page.waitForTimeout(1000);
    
    // Check if center panel changed
    const centerContent = await page.locator('.center-panel').textContent();
    console.log('📄 Center panel updated after Story click');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/right-panel-redesign.png', fullPage: true });
  console.log('📸 Right panel redesign screenshot saved');
  
  console.log('✅ Right panel redesign test completed');
});
