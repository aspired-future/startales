import { test, expect } from '@playwright/test';

test('Debug Galaxy Issue', async ({ page }) => {
  console.log('🔍 Debugging Galaxy tab issue...');

  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000); // Give React time to render

  // Ensure the main HUD container is present
  await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });

  // Take initial screenshot
  await page.screenshot({ path: 'tests/screenshots/debug-initial.png', fullPage: true });
  console.log('📸 Initial screenshot saved');

  // Check what's currently visible
  const storyVisible = await page.locator('.panel-screen').isVisible();
  console.log('📖 Story panel visible:', storyVisible);

  // Click Galaxy button
  console.log('🌌 Clicking Galaxy button...');
  await page.click('.quick-access-btn:has-text("Galaxy")');
  await page.waitForTimeout(5000);

  // Take screenshot after clicking Galaxy
  await page.screenshot({ path: 'tests/screenshots/debug-after-galaxy-click.png', fullPage: true });
  console.log('📸 After Galaxy click screenshot saved');

  // Check what happened
  const panelScreens = await page.locator('.panel-screen').count();
  console.log('📊 Panel screens found:', panelScreens);

  const galaxyDataScreens = await page.locator('.galaxy-data-screen').count();
  console.log('🌌 Galaxy data screens found:', galaxyDataScreens);

  const loadingContainers = await page.locator('.loading-container').count();
  console.log('⏳ Loading containers found:', loadingContainers);

  const errorMessages = await page.locator('.error-message').count();
  console.log('❌ Error messages found:', errorMessages);

  // Check console logs
  const logs = [];
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
  
  // Wait a bit more and check again
  await page.waitForTimeout(3000);
  
  console.log('📝 Console logs:', logs);

  // Check if any elements are present but hidden
  const allElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('.galaxy-data-screen, .loading-container, .panel-screen');
    return Array.from(elements).map(el => ({
      className: el.className,
      visible: el.offsetParent !== null,
      display: window.getComputedStyle(el).display,
      innerHTML: el.innerHTML.substring(0, 100) + '...'
    }));
  });
  
  console.log('🔍 All relevant elements:', JSON.stringify(allElements, null, 2));

  console.log('🔍 Debug complete - check screenshots for visual state');
});
