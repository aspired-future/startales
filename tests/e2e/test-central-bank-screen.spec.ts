import { test, expect } from '@playwright/test';

test.describe('Central Bank Screen - New Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
  });

  test('should load central bank screen with new design', async ({ page }) => {
    // Navigate to Central Bank screen
    await page.click('text=💰 Economy');
    await page.click('text=Central Bank');
    
    // Check screen title and theme
    await expect(page.locator('h1')).toContainText('Central Bank');
    await expect(page.locator('.economic-theme')).toBeVisible();
    
    // Check overview content
    await expect(page.locator('text=🏦 Central Bank Overview')).toBeVisible();
    await expect(page.locator('text=Policy Rate')).toBeVisible();
    await expect(page.locator('text=Independence Score')).toBeVisible();
    await expect(page.locator('text=Market Confidence')).toBeVisible();
    
    // Check metrics are displayed
    await expect(page.locator('.standard-metric-value')).toHaveCount(6);
    
    // Check action buttons
    await expect(page.locator('button:has-text("Policy Meeting")')).toBeVisible();
    await expect(page.locator('button:has-text("Market Operations")')).toBeVisible();
    
    // Check charts are present
    await expect(page.locator('text=📈 Macroeconomic Indicators (%)')).toBeVisible();
    await expect(page.locator('text=🏛️ Independence Metrics')).toBeVisible();
  });

  test('should display policy settings data', async ({ page }) => {
    // Navigate to Central Bank screen
    await page.click('text=💰 Economy');
    await page.click('text=Central Bank');
    
    // Click on Policies tab
    await page.click('text=Policies');
    
    // Check policy settings table
    await expect(page.locator('text=⚙️ Policy Settings & Recommendations')).toBeVisible();
    await expect(page.locator('text=Interest Rate')).toBeVisible();
    await expect(page.locator('text=Reserve Requirements')).toBeVisible();
    await expect(page.locator('text=QE Program')).toBeVisible();
    
    // Check policy recommendations
    await expect(page.locator('text=Policy Recommendations')).toBeVisible();
    await expect(page.locator('text=Increase Policy Rate by 25bps')).toBeVisible();
    await expect(page.locator('text=Enhance Macroprudential Measures')).toBeVisible();
  });

  test('should display stability monitoring data', async ({ page }) => {
    // Navigate to Central Bank screen
    await page.click('text=💰 Economy');
    await page.click('text=Central Bank');
    
    // Click on Stability tab
    await page.click('text=Stability');
    
    // Check stability content
    await expect(page.locator('text=🛡️ Financial Stability Monitoring')).toBeVisible();
    await expect(page.locator('text=Banking System Health')).toBeVisible();
    await expect(page.locator('text=Market Stability')).toBeVisible();
    await expect(page.locator('text=Active Warnings')).toBeVisible();
    
    // Check metrics
    await expect(page.locator('text=Capital Adequacy')).toBeVisible();
    await expect(page.locator('text=Liquidity Ratio')).toBeVisible();
    await expect(page.locator('text=Volatility Index')).toBeVisible();
  });

  test('should display research data', async ({ page }) => {
    // Navigate to Central Bank screen
    await page.click('text=💰 Economy');
    await page.click('text=Central Bank');
    
    // Click on Research tab
    await page.click('text=Research');
    
    // Check research content
    await expect(page.locator('text=📊 Research & Analysis')).toBeVisible();
    await expect(page.locator('text=Current Research Projects')).toBeVisible();
    await expect(page.locator('text=Recent Publications')).toBeVisible();
    
    // Check research projects
    await expect(page.locator('text=Climate Risk Assessment Framework')).toBeVisible();
    await expect(page.locator('text=Digital Currency Feasibility Study')).toBeVisible();
    
    // Check publications
    await expect(page.locator('text=Monetary Policy Transmission in Digital Era')).toBeVisible();
    await expect(page.locator('text=Financial Stability Report Q4 2023')).toBeVisible();
  });

  test('should display analytics data', async ({ page }) => {
    // Navigate to Central Bank screen
    await page.click('text=💰 Economy');
    await page.click('text=Central Bank');
    
    // Click on Analytics tab
    await page.click('text=Analytics');
    
    // Check analytics content
    await expect(page.locator('text=📈 Central Bank Analytics')).toBeVisible();
    await expect(page.locator('text=Independence Metrics')).toBeVisible();
    await expect(page.locator('text=Communication Effectiveness')).toBeVisible();
    await expect(page.locator('text=Governor Profile')).toBeVisible();
    
    // Check metrics
    await expect(page.locator('text=Legal Framework')).toBeVisible();
    await expect(page.locator('text=Operational Autonomy')).toBeVisible();
    await expect(page.locator('text=Transparency')).toBeVisible();
    await expect(page.locator('text=Market Credibility')).toBeVisible();
  });

  test('should have proper scrolling and layout', async ({ page }) => {
    // Navigate to Central Bank screen
    await page.click('text=💰 Economy');
    await page.click('text=Central Bank');
    
    // Check dashboard layout
    await expect(page.locator('.standard-dashboard')).toBeVisible();
    await expect(page.locator('.standard-table-container')).toBeVisible();
    
    // Check number of panels
    const panels = await page.locator('.standard-panel').count();
    expect(panels).toBeGreaterThan(0);
    
    // Check full panel width
    await expect(page.locator('.table-panel')).toBeVisible();
  });

  test('should have consistent economic theme styling', async ({ page }) => {
    // Navigate to Central Bank screen
    await page.click('text=💰 Economy');
    await page.click('text=Central Bank');
    
    // Check economic theme container
    await expect(page.locator('.economic-theme')).toBeVisible();
    
    // Check header color (gold/yellow theme)
    const header = page.locator('h3').first();
    await expect(header).toHaveCSS('color', 'rgb(251, 191, 36)');
    
    // Check economic theme buttons
    await expect(page.locator('.economic-theme')).toBeVisible();
  });
});

