import { test, expect } from '@playwright/test';

test.describe('WhoseApp BaseScreen Template', () => {
  test('should use BaseScreen template with proper header and tabs', async ({ page }) => {
    console.log('=== Testing WhoseApp BaseScreen Template ===');
    
    // Navigate to the app
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    
    // Click on WhoseApp button in quick access area
    await page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' }).click();
    await page.waitForTimeout(1000);
    
    // Verify BaseScreen structure is present
    console.log('Checking for BaseScreen structure...');
    
    // Check for base-screen container
    const baseScreen = page.locator('.base-screen');
    await expect(baseScreen).toBeVisible();
    console.log('✅ BaseScreen container found');
    
    // Check for base-screen-header
    const header = page.locator('.base-screen-header');
    await expect(header).toBeVisible();
    console.log('✅ BaseScreen header found');
    
    // Check for title with icon
    const title = page.locator('.base-screen-title h2');
    await expect(title).toContainText('WhoseApp');
    console.log('✅ BaseScreen title found');
    
    const icon = page.locator('.base-screen-icon');
    await expect(icon).toBeVisible();
    console.log('✅ BaseScreen icon found');
    
    // Check for tabs in the header (same bar as title)
    const tabs = page.locator('.base-screen-tabs');
    await expect(tabs).toBeVisible();
    console.log('✅ BaseScreen tabs found in header');
    
    // Verify all expected tabs are present
    const expectedTabs = ['Conversations', 'Channels', 'Characters', 'Actions'];
    for (const tabName of expectedTabs) {
      const tab = page.locator('.base-screen-tab').filter({ hasText: tabName });
      await expect(tab).toBeVisible();
      console.log(`✅ Tab "${tabName}" found`);
    }
    
    // Check for screen controls (refresh, WhoseApp button, etc.)
    const controls = page.locator('.screen-controls');
    await expect(controls).toBeVisible();
    console.log('✅ Screen controls found');
    
    // Check for refresh button in BaseScreen controls
    const refreshBtn = page.locator('.base-screen .refresh-btn');
    await expect(refreshBtn.first()).toBeVisible();
    console.log('✅ Refresh button found');
    
    // Check for WhoseApp button (should be present in BaseScreen controls)
    const whoseappBtn = page.locator('.whoseapp-btn');
    await expect(whoseappBtn).toBeVisible();
    console.log('✅ WhoseApp button found in controls');
    
    // Check for screen content area
    const content = page.locator('.screen-content');
    await expect(content).toBeVisible();
    console.log('✅ Screen content area found');
    
    // Test tab switching functionality
    console.log('Testing tab switching...');
    
    // Click on Characters tab
    await page.click('.base-screen-tab:has-text("Characters")');
    await page.waitForTimeout(500);
    
    // Verify Characters tab is active
    const activeTab = page.locator('.base-screen-tab.active');
    await expect(activeTab).toContainText('Characters');
    console.log('✅ Characters tab activated successfully');
    
    // Verify Characters content is displayed
    const charactersContent = page.locator('.standard-data-table');
    await expect(charactersContent).toBeVisible();
    console.log('✅ Characters table content displayed');
    
    // Click on Channels tab
    await page.click('.base-screen-tab:has-text("Channels")');
    await page.waitForTimeout(500);
    
    // Verify Channels tab is active
    const channelsActiveTab = page.locator('.base-screen-tab.active');
    await expect(channelsActiveTab).toContainText('Channels');
    console.log('✅ Channels tab activated successfully');
    
    // Click on Actions tab
    await page.click('.base-screen-tab:has-text("Actions")');
    await page.waitForTimeout(500);
    
    // Verify Actions tab is active
    const actionsActiveTab = page.locator('.base-screen-tab.active');
    await expect(actionsActiveTab).toContainText('Actions');
    console.log('✅ Actions tab activated successfully');
    
    // Return to Conversations tab
    await page.click('.base-screen-tab:has-text("Conversations")');
    await page.waitForTimeout(500);
    
    // Verify Conversations tab is active
    const conversationsActiveTab = page.locator('.base-screen-tab.active');
    await expect(conversationsActiveTab).toContainText('Conversations');
    console.log('✅ Conversations tab activated successfully');
    
    // Verify standard design elements are used
    console.log('Checking for standard design elements...');
    
    // Check for standard panels
    const standardPanel = page.locator('.standard-panel');
    await expect(standardPanel.first()).toBeVisible();
    console.log('✅ Standard panels found');
    
    // Check for standard data table
    const standardTable = page.locator('.standard-data-table');
    await expect(standardTable.first()).toBeVisible();
    console.log('✅ Standard data table found');
    
    // Check for standard buttons
    const standardBtn = page.locator('.standard-btn');
    await expect(standardBtn.first()).toBeVisible();
    console.log('✅ Standard buttons found');
    
    console.log('=== WhoseApp BaseScreen Template Test Complete ===');
  });
  
  test('should have proper header layout with title, tabs, and controls', async ({ page }) => {
    console.log('=== Testing WhoseApp Header Layout ===');
    
    await page.goto('http://localhost:5173');
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    
    // Navigate to WhoseApp
    await page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' }).click();
    await page.waitForTimeout(1000);
    
    // Verify header layout structure
    const header = page.locator('.base-screen-header');
    await expect(header).toBeVisible();
    
    // Check that header contains all three sections: title, tabs, controls
    const titleSection = header.locator('.base-screen-title');
    const tabsSection = header.locator('.base-screen-tabs');
    const controlsSection = header.locator('.screen-controls');
    
    await expect(titleSection).toBeVisible();
    await expect(tabsSection).toBeVisible();
    await expect(controlsSection).toBeVisible();
    
    console.log('✅ Header has all three sections: title, tabs, controls');
    
    // Verify tabs are in the center between title and controls
    const headerBox = await header.boundingBox();
    const titleBox = await titleSection.boundingBox();
    const tabsBox = await tabsSection.boundingBox();
    const controlsBox = await controlsSection.boundingBox();
    
    if (headerBox && titleBox && tabsBox && controlsBox) {
      // Tabs should be positioned between title and controls
      expect(tabsBox.x).toBeGreaterThan(titleBox.x + titleBox.width);
      expect(tabsBox.x + tabsBox.width).toBeLessThan(controlsBox.x);
      console.log('✅ Tabs are positioned between title and controls');
    }
    
    console.log('=== WhoseApp Header Layout Test Complete ===');
  });
});
