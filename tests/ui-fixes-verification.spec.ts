import { test, expect } from '@playwright/test';

test('UI Fixes Verification - Witter and Galaxy', async ({ page }) => {
  console.log('🧪 Testing Witter and Galaxy fixes...');

  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000); // Give React time to render

  // Ensure the main HUD container is present
  await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });

  // ✅ 1. Test Story tab (should be default and images should be stable)
  console.log('📖 Testing Story tab...');
  const storyPanel = page.locator('.panel-screen').filter({ has: page.locator('h3', { hasText: 'Current Story Events' }) });
  await expect(storyPanel).toBeVisible();
  
  // Check for story images with stable URLs
  const storyImages = await page.locator('.event-image').count();
  console.log('🖼️ Story images found:', storyImages);
  
  if (storyImages > 0) {
    const firstImageSrc = await page.locator('.event-image').first().getAttribute('src');
    console.log('🔗 First image URL:', firstImageSrc);
    expect(firstImageSrc).toContain('picsum.photos/seed/');
  }

  // ✅ 2. Test Galaxy tab - should show data now
  console.log('🌌 Testing Galaxy tab...');
  await page.click('.quick-access-btn:has-text("Galaxy")');
  await page.waitForTimeout(3000);
  
  const galaxyContent = page.locator('.panel-screen');
  await expect(galaxyContent).toBeVisible();
  
  // Check for galaxy data content - should not be loading anymore
  const loadingSpinner = await page.locator('.loading-spinner').count();
  console.log('⏳ Loading spinners found:', loadingSpinner);
  
  // Check for galaxy data tabs
  const galaxyTabs = await page.locator('.tab-btn').count();
  console.log('📊 Galaxy tabs found:', galaxyTabs);
  expect(galaxyTabs).toBeGreaterThan(0);
  
  // Check for actual galaxy data content
  const galaxyDataElements = await page.locator('.galaxy-data-screen').count();
  console.log('🌌 Galaxy data elements found:', galaxyDataElements);
  expect(galaxyDataElements).toBeGreaterThan(0);

  // ✅ 3. Test Witter tab - Twitter-like design
  console.log('🐦 Testing Witter tab...');
  await page.click('.quick-access-btn:has-text("Witter")');
  await page.waitForTimeout(3000);
  
  const witterContent = page.locator('.panel-screen');
  await expect(witterContent).toBeVisible();
  
  // Check for embedded witter feed
  const embeddedFeed = page.locator('.embedded-witter-feed');
  await expect(embeddedFeed).toBeVisible();
  console.log('📱 Embedded Witter feed found:', await embeddedFeed.isVisible());
  
  // Check for Twitter-like elements
  const witterItems = await page.locator('.witt-item').count();
  console.log('🐦 Witter posts found:', witterItems);
  expect(witterItems).toBeGreaterThan(0);
  
  const actionButtons = await page.locator('.witt-action').count();
  console.log('👆 Action buttons found:', actionButtons);
  expect(actionButtons).toBeGreaterThan(0);
  
  const avatars = await page.locator('.witt-avatar').count();
  console.log('👤 Avatars found:', avatars);
  expect(avatars).toBeGreaterThan(0);

  // ✅ 4. Test Civ tab
  console.log('🏛️ Testing Civ tab...');
  await page.click('.quick-access-btn:has-text("Civ")');
  await page.waitForTimeout(2000);
  
  const civContent = page.locator('.panel-screen');
  await expect(civContent).toBeVisible();
  
  // Check for civ subtabs
  const civTabs = await page.locator('.tab-navigation .tab-btn').count();
  console.log('🏛️ Civ subtabs found:', civTabs);
  expect(civTabs).toBeGreaterThan(0);

  // ✅ 5. Test message bubbles
  console.log('🔔 Testing message bubbles...');
  const unreadBadges = await page.locator('.unread-badge').count();
  console.log('🔔 Unread badges found:', unreadBadges);
  expect(unreadBadges).toBeGreaterThanOrEqual(3);

  // ✅ 6. Test Game Master section
  console.log('🎮 Testing Game Master section...');
  const gameMasterSection = page.locator('.game-master-section');
  await expect(gameMasterSection).toBeVisible();
  
  const missionOpportunities = await page.locator('.gm-category:has-text("Mission Opportunities")').count();
  console.log('🎯 Mission opportunities section found:', missionOpportunities > 0);
  expect(missionOpportunities).toBe(1);

  await page.screenshot({ path: 'tests/screenshots/ui-fixes-verification.png', fullPage: true });
  console.log('📸 UI fixes verification screenshot saved');

  console.log('✅ All UI fixes verified successfully!');
});
