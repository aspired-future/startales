import { test, expect } from '@playwright/test';

test.describe('Business Screen - New Design', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:5173/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load Business screen with new design', async ({ page }) => {
    // Look for Business button and click it
    const businessButton = page.locator('button:has-text("Business"), a:has-text("Business")').first();
    await expect(businessButton).toBeVisible();
    await businessButton.click();

    // Wait for the screen to load
    await page.waitForLoadState('networkidle');

    // Check for the screen title
    await expect(page.locator('h1, h2, h3:has-text("Business")')).toBeVisible();

    // Check for economic theme elements
    await expect(page.locator('.standard-screen-container.economic-theme')).toBeVisible();

    // Check for overview tab content
    await expect(page.locator('text=Business Ecosystem Overview')).toBeVisible();
    await expect(page.locator('text=Total Businesses')).toBeVisible();
    await expect(page.locator('text=Active Businesses')).toBeVisible();

    // Check for metric values
    await expect(page.locator('.standard-metric-value')).toHaveCount(6);

    // Check for action buttons
    await expect(page.locator('button:has-text("Generate Report")')).toBeVisible();
    await expect(page.locator('button:has-text("Market Analysis")')).toBeVisible();

    // Check for industry breakdown
    await expect(page.locator('text=Industry Breakdown')).toBeVisible();

    // Check for charts
    await expect(page.locator('text=Industry Revenue (Millions)')).toBeVisible();
    await expect(page.locator('text=Business Size Distribution')).toBeVisible();
  });

  test('should display business data in tables', async ({ page }) => {
    // Navigate to Business screen
    const businessButton = page.locator('button:has-text("Business"), a:has-text("Business")').first();
    await businessButton.click();
    await page.waitForLoadState('networkidle');

    // Click on Businesses tab
    const businessesTab = page.locator('button:has-text("Businesses")');
    await expect(businessesTab).toBeVisible();
    await businessesTab.click();

    // Check for business table
    await expect(page.locator('text=Active Businesses')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // Check for business data
    await expect(page.locator('text=QuantumCafe Solutions')).toBeVisible();
    await expect(page.locator('text=Stellar Manufacturing Corp')).toBeVisible();
    await expect(page.locator('text=NovaTech Innovations')).toBeVisible();

    // Check for table headers
    await expect(page.locator('th:has-text("Business")')).toBeVisible();
    await expect(page.locator('th:has-text("Industry")')).toBeVisible();
    await expect(page.locator('th:has-text("Type")')).toBeVisible();
    await expect(page.locator('th:has-text("Employees")')).toBeVisible();
    await expect(page.locator('th:has-text("Revenue")')).toBeVisible();
  });

  test('should display opportunities data', async ({ page }) => {
    // Navigate to Business screen
    const businessButton = page.locator('button:has-text("Business"), a:has-text("Business")').first();
    await businessButton.click();
    await page.waitForLoadState('networkidle');

    // Click on Opportunities tab
    const opportunitiesTab = page.locator('button:has-text("Opportunities")');
    await expect(opportunitiesTab).toBeVisible();
    await opportunitiesTab.click();

    // Check for opportunities table
    await expect(page.locator('text=Business Opportunities')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // Check for opportunity data
    await expect(page.locator('text=Sustainable Energy Solutions')).toBeVisible();
    await expect(page.locator('text=AI-Powered Healthcare Diagnostics')).toBeVisible();
    await expect(page.locator('text=Space Tourism Services')).toBeVisible();

    // Check for table headers
    await expect(page.locator('th:has-text("Opportunity")')).toBeVisible();
    await expect(page.locator('th:has-text("Industry")')).toBeVisible();
    await expect(page.locator('th:has-text("Market Size")')).toBeVisible();
    await expect(page.locator('th:has-text("Competition")')).toBeVisible();
  });

  test('should display business creation options', async ({ page }) => {
    // Navigate to Business screen
    const businessButton = page.locator('button:has-text("Business"), a:has-text("Business")').first();
    await businessButton.click();
    await page.waitForLoadState('networkidle');

    // Click on Creation tab
    const creationTab = page.locator('button:has-text("Creation")');
    await expect(creationTab).toBeVisible();
    await creationTab.click();

    // Check for creation content
    await expect(page.locator('text=Business Creation')).toBeVisible();
    await expect(page.locator('text=Quick Start Options')).toBeVisible();
    await expect(page.locator('text=Market Insights')).toBeVisible();

    // Check for quick start options
    await expect(page.locator('text=Startup Wizard')).toBeVisible();
    await expect(page.locator('text=Manufacturing')).toBeVisible();
    await expect(page.locator('text=Food Service')).toBeVisible();
    await expect(page.locator('text=Technology')).toBeVisible();

    // Check for market insights
    await expect(page.locator('text=Top Growing Industries')).toBeVisible();
    await expect(page.locator('text=Technology: +18.5% growth')).toBeVisible();
  });

  test('should display analytics data', async ({ page }) => {
    // Navigate to Business screen
    const businessButton = page.locator('button:has-text("Business"), a:has-text("Business")').first();
    await businessButton.click();
    await page.waitForLoadState('networkidle');

    // Click on Analytics tab
    const analyticsTab = page.locator('button:has-text("Analytics")');
    await expect(analyticsTab).toBeVisible();
    await analyticsTab.click();

    // Check for analytics content
    await expect(page.locator('text=Business Analytics')).toBeVisible();
    await expect(page.locator('text=Market Analysis')).toBeVisible();
    await expect(page.locator('text=Key Trends')).toBeVisible();

    // Check for market analysis metrics
    await expect(page.locator('text=Competitiveness')).toBeVisible();
    await expect(page.locator('text=Innovation')).toBeVisible();
    await expect(page.locator('text=Sustainability')).toBeVisible();
    await expect(page.locator('text=Digital Adoption')).toBeVisible();

    // Check for trends
    await expect(page.locator('text=AI/ML Integration')).toBeVisible();
    await expect(page.locator('text=Green Business Practices')).toBeVisible();
    await expect(page.locator('text=Remote Work Adoption')).toBeVisible();
  });

  test('should have proper scrolling and layout', async ({ page }) => {
    // Navigate to Business screen
    const businessButton = page.locator('button:has-text("Business"), a:has-text("Business")').first();
    await businessButton.click();
    await page.waitForLoadState('networkidle');

    // Check for vertical scrolling
    const dashboard = page.locator('.standard-dashboard');
    await expect(dashboard).toBeVisible();

    // Check for horizontal table scrolling
    const tableContainer = page.locator('.standard-table-container');
    await expect(tableContainer).toBeVisible();

    // Verify the layout is responsive
    await expect(page.locator('.standard-panel')).toHaveCount(3); // Overview, Industry Breakdown, Analytics
  });

  test('should have consistent economic theme styling', async ({ page }) => {
    // Navigate to Business screen
    const businessButton = page.locator('button:has-text("Business"), a:has-text("Business")').first();
    await businessButton.click();
    await page.waitForLoadState('networkidle');

    // Check for economic theme colors
    const themeContainer = page.locator('.standard-screen-container.economic-theme');
    await expect(themeContainer).toBeVisible();

    // Check for gold/yellow theme color in headers
    const headers = page.locator('h3');
    await expect(headers.first()).toHaveCSS('color', 'rgb(251, 191, 36)'); // #fbbf24

    // Check for economic theme buttons
    const buttons = page.locator('.standard-btn.economic-theme');
    await expect(buttons).toHaveCount(2); // Generate Report and Market Analysis buttons
  });
});

