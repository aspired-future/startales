const { test, expect } = require('@playwright/test');

test.describe('Joint Chiefs Screen Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main application
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForSelector('.game-hud', { timeout: 10000 });
    
    // Navigate to Joint Chiefs screen
    await page.click('text=Joint Chiefs');
    await page.waitForTimeout(2000);
  });

  test('should display standardized design elements', async ({ page }) => {
    // Check for standard screen container
    const screenContainer = await page.locator('.standard-screen-container');
    await expect(screenContainer).toBeVisible();
    
    // Check for government theme
    const governmentTheme = await page.locator('.government-theme');
    await expect(governmentTheme).toBeVisible();
    
    // Check for standard dashboard
    const dashboard = await page.locator('.standard-dashboard');
    await expect(dashboard).toBeVisible();
  });

  test('should display military-specific content', async ({ page }) => {
    // Check for military readiness overview
    const readinessOverview = await page.locator('text=Military Readiness Overview');
    await expect(readinessOverview).toBeVisible();
    
    // Check for command structure
    const commandStructure = await page.locator('text=Command Structure');
    await expect(commandStructure).toBeVisible();
    
    // Check for military metrics
    const metrics = await page.locator('.standard-metric');
    await expect(metrics).toHaveCount(6); // 4 in overview + 2 in command structure
  });

  test('should have proper tab navigation', async ({ page }) => {
    // Check for tab navigation in header
    const tabs = await page.locator('.tab-navigation button');
    await expect(tabs).toHaveCount(5); // Overview, Military Leadership, Operations, Strategic, Recommendations
    
    // Check tab labels
    const tabLabels = ['Overview', 'Military Leadership', 'Operations', 'Strategic', 'Recommendations'];
    for (const label of tabLabels) {
      const tab = await page.locator(`text=${label}`);
      await expect(tab).toBeVisible();
    }
  });

  test('should display Military Leadership tab content', async ({ page }) => {
    // Click on Military Leadership tab
    await page.click('text=Military Leadership');
    await page.waitForTimeout(1000);
    
    // Check for Joint Chiefs table
    const chiefsTable = await page.locator('.standard-data-table');
    await expect(chiefsTable).toBeVisible();
    
    // Check for chief information
    const chiefName = await page.locator('text=General Marcus Sterling');
    await expect(chiefName).toBeVisible();
    
    // Check for position information
    const position = await page.locator('text=Chairman of Joint Chiefs');
    await expect(position).toBeVisible();
    
    // Check for Military Services table (second table)
    const servicesTables = await page.locator('.standard-data-table');
    await expect(servicesTables).toHaveCount(2);
    
    // Check for service information
    const armyService = await page.locator('text=Army');
    await expect(armyService).toBeVisible();
    
    // Check for Cyber Force
    const cyberForce = await page.locator('text=Cyber Force');
    await expect(cyberForce).toBeVisible();
    
    // Check for readiness indicators
    const readinessBadges = await page.locator('[style*="background-color: #51cf66"]');
    await expect(readinessBadges).toBeVisible();
  });

  test('should display Operations tab content', async ({ page }) => {
    // Click on Operations tab
    await page.click('text=Operations');
    await page.waitForTimeout(1000);
    
    // Check for Joint Operations table
    const operationsTable = await page.locator('.standard-data-table');
    await expect(operationsTable).toBeVisible();
    
    // Check for operation information
    const operation = await page.locator('text=Exercise Thunder Strike');
    await expect(operation).toBeVisible();
    
    // Check for status indicators
    const statusBadges = await page.locator('[style*="background-color: #51cf66"]');
    await expect(statusBadges).toBeVisible();
  });

  test('should display Strategic tab content', async ({ page }) => {
    // Click on Strategic tab
    await page.click('text=Strategic');
    await page.waitForTimeout(1000);
    
    // Check for Strategic Plans table
    const plansTable = await page.locator('.standard-data-table');
    await expect(plansTable).toBeVisible();
    
    // Check for plan information
    const plan = await page.locator('text=Operation Stellar Shield');
    await expect(plan).toBeVisible();
    
    // Check for priority indicators
    const priorityBadges = await page.locator('[style*="background-color: #ff6b6b"]');
    await expect(priorityBadges).toBeVisible();
  });

  test('should display Recommendations tab content', async ({ page }) => {
    // Click on Recommendations tab
    await page.click('text=Recommendations');
    await page.waitForTimeout(1000);
    
    // Check for Command Recommendations table
    const recommendationsTable = await page.locator('.standard-data-table');
    await expect(recommendationsTable).toBeVisible();
    
    // Check for recommendation information
    const recommendation = await page.locator('text=Enhanced Cyber Defense Initiative');
    await expect(recommendation).toBeVisible();
    
    // Check for urgency indicators
    const urgencyBadges = await page.locator('[style*="background-color: #ff922b"]');
    await expect(urgencyBadges).toBeVisible();
  });

  test('should have proper hover effects', async ({ page }) => {
    // Check for hover effects on buttons
    const buttons = await page.locator('.standard-btn');
    await expect(buttons.first()).toBeVisible();
    
    // Hover over first button
    await buttons.first().hover();
    await page.waitForTimeout(500);
  });

  test('should have WhoseApp button and popup toggle', async ({ page }) => {
    // Check for WhoseApp button
    const whoseAppButton = await page.locator('text=📞 WhoseApp');
    await expect(whoseAppButton).toBeVisible();
    
    // Check for popup toggle
    const popupToggle = await page.locator('.popup-toggle');
    await expect(popupToggle).toBeVisible();
  });

  test('should display proper table structure', async ({ page }) => {
    // Click on Joint Chiefs tab to see table
    await page.click('text=Joint Chiefs');
    await page.waitForTimeout(1000);
    
    // Check for table container
    const tableContainer = await page.locator('.standard-table-container');
    await expect(tableContainer).toBeVisible();
    
    // Check for table headers
    const headers = await page.locator('.standard-data-table th');
    await expect(headers).toHaveCount(6); // Chief, Position, Service, Years, Specializations, Actions
    
    // Check for table rows
    const rows = await page.locator('.standard-data-table tbody tr');
    await expect(rows).toHaveCount(5); // 5 chiefs
  });

  test('should display military-specific styling', async ({ page }) => {
    // Check for military-themed colors
    const militaryColors = await page.locator('[style*="background-color: #4facfe"]');
    await expect(militaryColors).toBeVisible();
    
    // Check for military-specific badges
    const serviceBadges = await page.locator('[style*="background-color: #2a5298"]');
    await expect(serviceBadges).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Check for loading overlay (if present)
    const loadingOverlay = await page.locator('.loading-overlay');
    if (await loadingOverlay.isVisible()) {
      await expect(loadingOverlay).toContainText('Loading Joint Chiefs data');
    }
  });

  test('should display error states properly', async ({ page }) => {
    // Check for error message (if present)
    const errorMessage = await page.locator('.error-message');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText('Error:');
    }
  });

  test('should have proper action buttons', async ({ page }) => {
    // Check for action buttons in overview
    const actionButtons = await page.locator('.standard-action-buttons .standard-btn');
    await expect(actionButtons).toHaveCount(2); // Generate Report, View Analytics
    
    // Check for table action buttons
    await page.click('text=Joint Chiefs');
    await page.waitForTimeout(1000);
    
    const tableButtons = await page.locator('.standard-data-table .standard-btn');
    await expect(tableButtons).toBeVisible();
  });

  test('should display proper metrics', async ({ page }) => {
    // Check for metric values
    const metricValues = await page.locator('.standard-metric-value');
    await expect(metricValues).toHaveCount(6);
    
    // Check for specific metrics
    const readinessMetric = await page.locator('text=3.2');
    await expect(readinessMetric).toBeVisible();
    
    const personnelMetric = await page.locator('text=520K');
    await expect(personnelMetric).toBeVisible();
    
    const budgetMetric = await page.locator('text=$110B');
    await expect(budgetMetric).toBeVisible();
  });

  test('should have proper responsive design', async ({ page }) => {
    // Test responsive design by changing viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(1000);
    
    // Check that content is still visible
    const dashboard = await page.locator('.standard-dashboard');
    await expect(dashboard).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    // Check that content is still accessible
    const tabs = await page.locator('.tab-navigation button');
    await expect(tabs).toBeVisible();
  });
});
