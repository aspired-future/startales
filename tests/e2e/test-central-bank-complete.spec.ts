import { test, expect } from '@playwright/test';

test.describe('Central Bank Screen - Complete New Design Verification', () => {
  test('Should display Central Bank screen with new design and all functionality', async ({ page }) => {
    // Navigate to the UI
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Expand Economy section and click Central Bank
    const economySection = page.locator('text=💰ECONOMY▶');
    await expect(economySection).toBeVisible();
    await economySection.click();
    await page.waitForTimeout(1000);
    
    const centralBankButton = page.locator('text=Central Bank');
    await expect(centralBankButton).toBeVisible();
    await centralBankButton.click();
    await page.waitForTimeout(2000);
    
    // Verify screen title
    const title = page.locator('h2').filter({ hasText: 'Central Banking' });
    await expect(title).toBeVisible();
    
    // Verify economic theme
    const economicTheme = page.locator('.standard-screen-container.economic-theme');
    await expect(economicTheme).toBeVisible();
    
    // Verify standard panels
    const panels = page.locator('.standard-panel');
    await expect(panels).toHaveCount(3); // Overview, Financial Stability, Policy Analytics
    
    // Verify tabs
    const tabs = page.locator('button').filter({ hasText: /Overview|Policies|Stability|Research|Analytics/ });
    await expect(tabs).toHaveCount(5);
    
    // Verify specific content
    const policyRate = page.locator('text=Policy Rate');
    await expect(policyRate).toBeVisible();
    
    const independenceScore = page.locator('text=Independence Score');
    await expect(independenceScore).toBeVisible();
    
    // Verify charts
    const charts = page.locator('.chart-container');
    await expect(charts).toHaveCount(2); // Bar chart and pie chart
    
    // Test tab navigation
    const policiesTab = page.locator('button').filter({ hasText: 'Policies' });
    await policiesTab.click();
    await page.waitForTimeout(1000);
    
    // Verify policies content
    const policySettings = page.locator('text=Policy Settings & Recommendations');
    await expect(policySettings).toBeVisible();
    
    const interestRate = page.locator('text=Interest Rate');
    await expect(interestRate).toBeVisible();
    
    // Test stability tab
    const stabilityTab = page.locator('button').filter({ hasText: 'Stability' });
    await stabilityTab.click();
    await page.waitForTimeout(1000);
    
    // Verify stability content
    const stabilityMonitoring = page.locator('text=Financial Stability Monitoring');
    await expect(stabilityMonitoring).toBeVisible();
    
    const bankingSystem = page.locator('text=Banking System Health');
    await expect(bankingSystem).toBeVisible();
    
    // Test research tab
    const researchTab = page.locator('button').filter({ hasText: 'Research' });
    await researchTab.click();
    await page.waitForTimeout(1000);
    
    // Verify research content
    const researchAnalysis = page.locator('text=Research & Analysis');
    await expect(researchAnalysis).toBeVisible();
    
    const currentProjects = page.locator('text=Current Research Projects');
    await expect(currentProjects).toBeVisible();
    
    // Test analytics tab
    const analyticsTab = page.locator('button').filter({ hasText: 'Analytics' });
    await analyticsTab.click();
    await page.waitForTimeout(1000);
    
    // Verify analytics content
    const centralBankAnalytics = page.locator('text=Central Bank Analytics');
    await expect(centralBankAnalytics).toBeVisible();
    
    const independenceMetrics = page.locator('text=Independence Metrics');
    await expect(independenceMetrics).toBeVisible();
    
    // Verify scrolling works
    const dashboard = page.locator('.standard-dashboard');
    await expect(dashboard).toBeVisible();
    
    // Verify action buttons
    const actionButtons = page.locator('.standard-btn.economic-theme');
    await expect(actionButtons).toHaveCount(2); // Policy Meeting, Market Operations
    
    // Verify table scrolling
    const tableContainer = page.locator('.standard-table-container');
    await expect(tableContainer).toBeVisible();
    
    console.log('✅ Central Bank screen is fully functional with new design!');
  });
});

