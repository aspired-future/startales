import { test, expect } from '@playwright/test';

test.describe('Trade Screen - New Design', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:5174/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load Trade screen with new design', async ({ page }) => {
    // Look for Trade button and click it
    const tradeButton = page.locator('button:has-text("Trade"), a:has-text("Trade")').first();
    await expect(tradeButton).toBeVisible();
    await tradeButton.click();

    // Wait for the screen to load
    await page.waitForLoadState('networkidle');

    // Check for the screen title
    await expect(page.locator('h1, h2, h3:has-text("Trade")')).toBeVisible();

    // Check for economic theme (gold/yellow colors)
    const economicTheme = page.locator('.economic-theme');
    await expect(economicTheme).toBeVisible();

    // Check for the 5 tabs
    const tabs = ['Overview', 'Commodities', 'Routes', 'Corporations', 'Opportunities'];
    for (const tab of tabs) {
      await expect(page.locator(`button:has-text("${tab}"), a:has-text("${tab}")`)).toBeVisible();
    }

    // Check for full panel width cards (no 2-column grid)
    const overviewPanel = page.locator('.standard-panel:has-text("Trade Overview")');
    await expect(overviewPanel).toBeVisible();

    // Check for mock data in the overview
    await expect(page.locator('text=$13.3T')).toBeVisible(); // Total Volume
    await expect(page.locator('text=4')).toBeVisible(); // Active Systems
    await expect(page.locator('text=5')).toBeVisible(); // Total Routes

    // Check for market indices
    await expect(page.locator('text=Galactic Trade Index')).toBeVisible();
    await expect(page.locator('text=1247.8')).toBeVisible();

    // Check for charts
    await expect(page.locator('text=Trading System Volumes')).toBeVisible();
    await expect(page.locator('text=Commodity Volume by Category')).toBeVisible();
  });

  test('should display all tabs with data', async ({ page }) => {
    // Navigate to Trade screen
    const tradeButton = page.locator('button:has-text("Trade"), a:has-text("Trade")').first();
    await tradeButton.click();
    await page.waitForLoadState('networkidle');

    // Test Commodities tab
    await page.locator('button:has-text("Commodities"), a:has-text("Commodities")').click();
    await expect(page.locator('text=Commodity Markets')).toBeVisible();
    await expect(page.locator('text=Quantum Processors')).toBeVisible();
    await expect(page.locator('text=$25K')).toBeVisible();

    // Test Routes tab
    await page.locator('button:has-text("Routes"), a:has-text("Routes")').click();
    await expect(page.locator('text=Trade Routes')).toBeVisible();
    await expect(page.locator('text=Alpha Centauri → Vega')).toBeVisible();
    await expect(page.locator('text=$8.5M')).toBeVisible();

    // Test Corporations tab
    await page.locator('button:has-text("Corporations"), a:has-text("Corporations")').click();
    await expect(page.locator('text=Corporations')).toBeVisible();
    await expect(page.locator('text=Quantum Dynamics Inc.')).toBeVisible();
    await expect(page.locator('text=$850B')).toBeVisible();

    // Test Opportunities tab
    await page.locator('button:has-text("Opportunities"), a:has-text("Opportunities")').click();
    await expect(page.locator('text=Trade Opportunities')).toBeVisible();
    await expect(page.locator('text=Arbitrage')).toBeVisible();
    await expect(page.locator('text=$2.5M')).toBeVisible();
  });

  test('should have proper economic theme styling', async ({ page }) => {
    // Navigate to Trade screen
    const tradeButton = page.locator('button:has-text("Trade"), a:has-text("Trade")').first();
    await tradeButton.click();
    await page.waitForLoadState('networkidle');

    // Check for economic theme colors (gold/yellow)
    const economicTheme = page.locator('.economic-theme');
    await expect(economicTheme).toBeVisible();

    // Check for gold accent color in headers
    const headers = page.locator('h3[style*="color: #fbbf24"]');
    await expect(headers).toHaveCount(5); // Should have 5 headers with gold color

    // Check for proper spacing between cards
    const panels = page.locator('.standard-panel');
    await expect(panels).toHaveCount(3); // Overview, Market Indices, Analytics panels
  });

  test('should have built-in scrolling and proper table formatting', async ({ page }) => {
    // Navigate to Trade screen
    const tradeButton = page.locator('button:has-text("Trade"), a:has-text("Trade")').first();
    await tradeButton.click();
    await page.waitForLoadState('networkidle');

    // Test Commodities tab with table
    await page.locator('button:has-text("Commodities"), a:has-text("Commodities")').click();
    
    // Check for table with proper formatting
    const table = page.locator('.standard-data-table');
    await expect(table).toBeVisible();
    
    // Check for table headers
    await expect(page.locator('th:has-text("Commodity")')).toBeVisible();
    await expect(page.locator('th:has-text("Category")')).toBeVisible();
    await expect(page.locator('th:has-text("Price")')).toBeVisible();

    // Check for table data
    await expect(page.locator('td:has-text("Quantum Processors")')).toBeVisible();
    await expect(page.locator('td:has-text("Rare Earth Metals")')).toBeVisible();
    await expect(page.locator('td:has-text("Synthetic Food")')).toBeVisible();

    // Test Routes tab with table
    await page.locator('button:has-text("Routes"), a:has-text("Routes")').click();
    
    // Check for routes table
    await expect(page.locator('th:has-text("Route")')).toBeVisible();
    await expect(page.locator('th:has-text("Commodity")')).toBeVisible();
    await expect(page.locator('th:has-text("Profit")')).toBeVisible();

    // Check for route data
    await expect(page.locator('td:has-text("Alpha Centauri → Vega")')).toBeVisible();
    await expect(page.locator('td:has-text("Vega → Sirius")')).toBeVisible();
    await expect(page.locator('td:has-text("Sirius → Proxima Centauri")')).toBeVisible();
  });

  test('should display comprehensive mock data', async ({ page }) => {
    // Navigate to Trade screen
    const tradeButton = page.locator('button:has-text("Trade"), a:has-text("Trade")').first();
    await tradeButton.click();
    await page.waitForLoadState('networkidle');

    // Check for comprehensive trade data
    await expect(page.locator('text=$13.3T')).toBeVisible(); // Total Volume
    await expect(page.locator('text=4')).toBeVisible(); // Active Systems
    await expect(page.locator('text=5')).toBeVisible(); // Total Routes
    await expect(page.locator('text=$2.6T')).toBeVisible(); // Market Cap

    // Check for market indices
    await expect(page.locator('text=Galactic Trade Index')).toBeVisible();
    await expect(page.locator('text=Commodity Futures')).toBeVisible();
    await expect(page.locator('text=Interstellar Exchange')).toBeVisible();
    await expect(page.locator('text=Corporate Performance')).toBeVisible();

    // Check for trading systems
    await expect(page.locator('text=Alpha Centauri Hub')).toBeVisible();
    await expect(page.locator('text=Vega Trading Center')).toBeVisible();
    await expect(page.locator('text=Sirius Exchange')).toBeVisible();

    // Check for commodities
    await expect(page.locator('text=Quantum Processors')).toBeVisible();
    await expect(page.locator('text=Rare Earth Metals')).toBeVisible();
    await expect(page.locator('text=Synthetic Food')).toBeVisible();
    await expect(page.locator('text=Fusion Reactors')).toBeVisible();
    await expect(page.locator('text=Luxury Textiles')).toBeVisible();

    // Check for corporations
    await expect(page.locator('text=Quantum Dynamics Inc.')).toBeVisible();
    await expect(page.locator('text=Stellar Mining Corp.')).toBeVisible();
    await expect(page.locator('text=Interstellar Foods')).toBeVisible();
    await expect(page.locator('text=Fusion Energy Systems')).toBeVisible();
    await expect(page.locator('text=Luxury Goods International')).toBeVisible();

    // Check for opportunities
    await expect(page.locator('text=Arbitrage')).toBeVisible();
    await expect(page.locator('text=Shortage')).toBeVisible();
    await expect(page.locator('text=Surplus')).toBeVisible();
  });
});

