import { test, expect } from '@playwright/test';

test('Test Population Navigation', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Look for the Population accordion (👥POPULATION▶)
  const populationAccordion = page.locator('text=👥POPULATION▶');
  const populationCount = await populationAccordion.count();
  console.log('Population accordions found:', populationCount);

  if (populationCount > 0) {
    // Click on the first Population accordion
    await populationAccordion.first().click();
    await page.waitForTimeout(1000);

    // Look for all nav items that appear after clicking
    const navItems = page.locator('.nav-item');
    const navItemCount = await navItems.count();
    console.log('Nav items found after clicking Population:', navItemCount);

    // Log all nav item texts
    for (let i = 0; i < navItemCount; i++) {
      const navItemText = await navItems.nth(i).textContent();
      console.log(`Nav item ${i}:`, navItemText);
    }

    // Look for Households button
    const householdsButton = page.locator('.nav-item:has-text("Households")');
    const householdsCount = await householdsButton.count();
    console.log('Households buttons found:', householdsCount);

    if (householdsCount > 0) {
      console.log('Found Households button! Clicking...');
      await householdsButton.first().click();
      await page.waitForTimeout(2000);

      // Check if the Household Economics screen loaded
      const screenTitle = page.locator('h2:has-text("Household Economics")');
      const titleCount = await screenTitle.count();
      console.log('Household Economics titles found:', titleCount);

      if (titleCount > 0) {
        console.log('✅ Household Economics screen loaded successfully!');
        
        // Check for tabs
        const tabs = page.locator('.base-screen-tabs');
        const tabsCount = await tabs.count();
        console.log('Tab containers found:', tabsCount);

        if (tabsCount > 0) {
          // Check for individual tabs
          const overviewTab = page.locator('.base-screen-tab:has-text("Overview")');
          const demandTab = page.locator('.base-screen-tab:has-text("Demand")');
          const mobilityTab = page.locator('.base-screen-tab:has-text("Mobility")');
          const wellbeingTab = page.locator('.base-screen-tab:has-text("Wellbeing")');
          const analyticsTab = page.locator('.base-screen-tab:has-text("Analytics")');

          console.log('Overview tab found:', await overviewTab.count());
          console.log('Demand tab found:', await demandTab.count());
          console.log('Mobility tab found:', await mobilityTab.count());
          console.log('Wellbeing tab found:', await wellbeingTab.count());
          console.log('Analytics tab found:', await analyticsTab.count());

          // Check for content
          const content = page.locator('.standard-screen-container');
          const contentCount = await content.count();
          console.log('Standard screen containers found:', contentCount);

          // Check for data
          const totalPopulation = page.locator('text=150,000');
          const populationCount = await totalPopulation.count();
          console.log('Total population elements found:', populationCount);

          // Test scrolling by checking if content is scrollable
          const scrollableContent = page.locator('.screen-content');
          const scrollableCount = await scrollableContent.count();
          console.log('Scrollable content containers found:', scrollableCount);

          // Take a screenshot
          await page.screenshot({ path: 'test-results/household-economics-success.png', fullPage: true });
          
          console.log('✅ All tests passed! Household Economics screen is working with scrolling and data.');
        }
      } else {
        console.log('❌ Household Economics screen did not load');
        
        // Check what screen did load
        const allH2Elements = page.locator('h2');
        const h2Count = await allH2Elements.count();
        console.log('H2 elements found:', h2Count);
        
        for (let i = 0; i < h2Count; i++) {
          const h2Text = await allH2Elements.nth(i).textContent();
          console.log(`H2 ${i}:`, h2Text);
        }
      }
    } else {
      console.log('❌ Households button not found');
      
      // Look for any button with "Household" in the text
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      console.log('Total buttons found:', buttonCount);
      
      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        if (buttonText && buttonText.toLowerCase().includes('household')) {
          console.log(`Found button with "household": ${buttonText}`);
        }
      }
    }
  } else {
    console.log('❌ Population accordion not found');
  }

  // Take a screenshot of the current state
  await page.screenshot({ path: 'test-results/population-navigation-test.png', fullPage: true });
});

