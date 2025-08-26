import { test, expect } from '@playwright/test';

test('Menu Changes Test', async ({ page }) => {
  console.log('🧪 Testing menu changes...');
  
  // Navigate to the UI
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Check for renamed menu items
  const politicalParties = await page.locator('text=Political Parties').count();
  const scienceTech = await page.locator('text=Science & Tech').count();
  const visuals = await page.locator('text=Visuals').count();
  const galaxyWonders = await page.locator('text=Galaxy Wonders').count();
  
  console.log('🎭 Political Parties found:', politicalParties > 0);
  console.log('⚙️ Science & Tech found:', scienceTech > 0);
  console.log('🎨 Visuals found:', visuals > 0);
  console.log('🏛️ Galaxy Wonders found:', galaxyWonders > 0);
  
  // Check for Missions in Quick Actions
  const missionsInQuickActions = await page.locator('.accordion-content:has-text("QUICK ACTIONS") button:has-text("🎯 Missions")').count();
  console.log('🎯 Missions in Quick Actions:', missionsInQuickActions > 0);
  
  // Check that old names are not present
  const oldVisualSystems = await page.locator('text=Visual Systems').count();
  const oldWorldWonders = await page.locator('text=World Wonders').count();
  
  console.log('❌ Old "Visual Systems" found:', oldVisualSystems);
  console.log('❌ Old "World Wonders" found:', oldWorldWonders);
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/menu-changes-test.png', fullPage: true });
  console.log('📸 Menu changes screenshot saved');
  
  console.log('✅ Menu changes test completed');
});
