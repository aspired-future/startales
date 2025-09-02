import { test, expect } from '@playwright/test';

test.describe('Treasury Screen - New Design', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:5173/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load Treasury screen with new design', async ({ page }) => {
    // Look for Treasury button and click it
    const treasuryButton = page.locator('button:has-text("Treasury"), a:has-text("Treasury")').first();
    await expect(treasuryButton).toBeVisible();
    await treasuryButton.click();

    // Wait for the screen to load
    await page.waitForLoadState('networkidle');

    // Check for the screen title
    await expect(page.locator('h1, h2, h3:has-text("Treasury")')).toBeVisible();

    // Check for economic theme (gold/yellow colors)
    const economicTheme = page.locator('.economic-theme');
    await expect(economicTheme).toBeVisible();

    // Check for the 5 tabs
    const tabs = ['Overview', 'Revenue', 'Budgets', 'Requests', 'Analytics'];
    for (const tab of tabs) {
      await expect(page.locator(`button:has-text("${tab}"), a:has-text("${tab}")`)).toBeVisible();
    }

    // Check for full panel width cards (no 2-column grid)
    const overviewPanel = page.locator('.standard-panel:has-text("Treasury Overview")');
    await expect(overviewPanel).toBeVisible();

    // Check for mock data in the overview
    await expect(page.locator('text=$8.5T')).toBeVisible(); // Total Budget
    await expect(page.locator('text=$7.2T')).toBeVisible(); // Total Spent
    await expect(page.locator('text=84.7%')).toBeVisible(); // Utilization

    // Check for revenue data
    await expect(page.locator('text=$4.2T')).toBeVisible(); // Tax Revenue
    await expect(page.locator('text=94.2%')).toBeVisible(); // Collection Efficiency

    // Check for charts
    await expect(page.locator('text=Department Budgets')).toBeVisible();
    await expect(page.locator('text=Budget Allocation')).toBeVisible();
  });

  test('should display all tabs with data', async ({ page }) => {
    // Navigate to Treasury screen
    const treasuryButton = page.locator('button:has-text("Treasury"), a:has-text("Treasury")').first();
    await treasuryButton.click();
    await page.waitForLoadState('networkidle');

    // Test Revenue tab
    await page.locator('button:has-text("Revenue"), a:has-text("Revenue")').click();
    await expect(page.locator('text=Revenue Management')).toBeVisible();
    await expect(page.locator('text=Individual Income Tax')).toBeVisible();
    await expect(page.locator('text=$2.1T')).toBeVisible();

    // Test Budgets tab
    await page.locator('button:has-text("Budgets"), a:has-text("Budgets")').click();
    await expect(page.locator('text=Department Budgets')).toBeVisible();
    await expect(page.locator('text=Defense Department')).toBeVisible();
    await expect(page.locator('text=$850B')).toBeVisible();

    // Test Requests tab
    await page.locator('button:has-text("Requests"), a:has-text("Requests")').click();
    await expect(page.locator('text=Spending Requests')).toBeVisible();
    await expect(page.locator('text=Advanced AI Defense Systems')).toBeVisible();
    await expect(page.locator('text=$25B')).toBeVisible();

    // Test Analytics tab
    await page.locator('button:has-text("Analytics"), a:has-text("Analytics")').click();
    await expect(page.locator('text=Financial Analytics')).toBeVisible();
    await expect(page.locator('text=Budget Allocations')).toBeVisible();
    await expect(page.locator('text=Defense & Security')).toBeVisible();
  });

  test('should have proper economic theme styling', async ({ page }) => {
    // Navigate to Treasury screen
    const treasuryButton = page.locator('button:has-text("Treasury"), a:has-text("Treasury")').first();
    await treasuryButton.click();
    await page.waitForLoadState('networkidle');

    // Check for economic theme colors (gold/yellow)
    const economicTheme = page.locator('.economic-theme');
    await expect(economicTheme).toBeVisible();

    // Check for gold accent color in headers
    const headers = page.locator('h3[style*="color: #fbbf24"]');
    await expect(headers).toHaveCount(5); // Should have 5 headers with gold color

    // Check for proper spacing between cards
    const panels = page.locator('.standard-panel');
    await expect(panels).toHaveCount(3); // Overview, Revenue, Analytics panels
  });

  test('should have built-in scrolling and proper table formatting', async ({ page }) => {
    // Navigate to Treasury screen
    const treasuryButton = page.locator('button:has-text("Treasury"), a:has-text("Treasury")').first();
    await treasuryButton.click();
    await page.waitForLoadState('networkidle');

    // Test Revenue tab with table
    await page.locator('button:has-text("Revenue"), a:has-text("Revenue")').click();
    
    // Check for table with proper formatting
    const table = page.locator('.standard-data-table');
    await expect(table).toBeVisible();
    
    // Check for table headers
    await expect(page.locator('th:has-text("Tax Category")')).toBeVisible();
    await expect(page.locator('th:has-text("Total Amount")')).toBeVisible();
    await expect(page.locator('th:has-text("Collection Efficiency")')).toBeVisible();

    // Check for table data
    await expect(page.locator('td:has-text("Individual Income Tax")')).toBeVisible();
    await expect(page.locator('td:has-text("Corporate Tax")')).toBeVisible();
    await expect(page.locator('td:has-text("Sales & Excise Tax")')).toBeVisible();

    // Test Budgets tab with table
    await page.locator('button:has-text("Budgets"), a:has-text("Budgets")').click();
    
    // Check for department table
    await expect(page.locator('th:has-text("Department")')).toBeVisible();
    await expect(page.locator('th:has-text("Allocated")')).toBeVisible();
    await expect(page.locator('th:has-text("Spent")')).toBeVisible();
    await expect(page.locator('th:has-text("Remaining")')).toBeVisible();

    // Check for department data
    await expect(page.locator('td:has-text("Defense Department")')).toBeVisible();
    await expect(page.locator('td:has-text("Health & Human Services")')).toBeVisible();
    await expect(page.locator('td:has-text("Education Department")')).toBeVisible();
  });

  test('should display comprehensive mock data', async ({ page }) => {
    // Navigate to Treasury screen
    const treasuryButton = page.locator('button:has-text("Treasury"), a:has-text("Treasury")').first();
    await treasuryButton.click();
    await page.waitForLoadState('networkidle');

    // Check for Treasury Secretary data
    await expect(page.locator('text=Dr. Elizabeth Rodriguez')).toBeVisible();

    // Check for comprehensive financial data
    await expect(page.locator('text=$8.5T')).toBeVisible(); // Total Budget
    await expect(page.locator('text=$7.2T')).toBeVisible(); // Total Spent
    await expect(page.locator('text=$1.3T')).toBeVisible(); // Remaining
    await expect(page.locator('text=84.7%')).toBeVisible(); // Utilization

    // Check for revenue data
    await expect(page.locator('text=$4.2T')).toBeVisible(); // Tax Revenue
    await expect(page.locator('text=94.2%')).toBeVisible(); // Collection Efficiency
    await expect(page.locator('text=$1.2T')).toBeVisible(); // Corporate Tax
    await expect(page.locator('text=$2.1T')).toBeVisible(); // Individual Tax

    // Check for department budgets
    await expect(page.locator('text=Defense Department')).toBeVisible();
    await expect(page.locator('text=Health & Human Services')).toBeVisible();
    await expect(page.locator('text=Education Department')).toBeVisible();
    await expect(page.locator('text=Transportation Department')).toBeVisible();
    await expect(page.locator('text=Energy Department')).toBeVisible();

    // Check for spending requests
    await expect(page.locator('text=Advanced AI Defense Systems')).toBeVisible();
    await expect(page.locator('text=Universal Healthcare Expansion')).toBeVisible();
    await expect(page.locator('text=Digital Learning Infrastructure')).toBeVisible();
    await expect(page.locator('text=High-Speed Rail Network')).toBeVisible();
    await expect(page.locator('text=Renewable Energy Research')).toBeVisible();
  });
});

