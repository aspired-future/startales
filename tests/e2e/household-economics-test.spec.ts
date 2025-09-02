import { test, expect } from '@playwright/test';

test.describe('Household Economics Screen Tests', () => {
  test('Household Economics screen should load and display content', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Look for the Population accordion and expand it
    const populationAccordion = page.locator('text=👥POPULATION▶');
    await expect(populationAccordion).toBeVisible();

    // Click to expand the Population accordion
    await populationAccordion.click();
    await page.waitForTimeout(1000);

    // Look for the Households button and click it
    const householdsButton = page.locator('.nav-item:has-text("🏠 Households")');
    await expect(householdsButton).toBeVisible();
    await householdsButton.click();

    // Wait for the Household Economics screen to load
    await page.waitForTimeout(2000);

    // Check that the screen title is visible
    const screenTitle = page.locator('h2:has-text("Household Economics")');
    await expect(screenTitle).toBeVisible();

    // Check that tabs are visible
    const tabs = page.locator('.base-screen-tabs');
    await expect(tabs).toBeVisible();

    // Check that the Overview tab is active by default
    const overviewTab = page.locator('.base-screen-tab.active:has-text("Overview")');
    await expect(overviewTab).toBeVisible();

    // Check that content is displayed
    const content = page.locator('.standard-screen-container');
    await expect(content).toBeVisible();

    // Check for key metrics (more flexible)
    const totalPopulation = page.locator('text=150,000').first();
    await expect(totalPopulation).toBeVisible();

    // Check for population distribution
    const poorTier = page.locator('text=60,000').first();
    await expect(poorTier).toBeVisible();

    const medianTier = page.locator('text=75,000').first();
    await expect(medianTier).toBeVisible();

    const richTier = page.locator('text=15,000').first();
    await expect(richTier).toBeVisible();

    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/household-economics-overview.png', fullPage: true });
  });

  test('Household Economics screen tabs should work', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Expand Population accordion and click Households
    const populationAccordion = page.locator('text=👥POPULATION▶');
    await populationAccordion.click();
    await page.waitForTimeout(1000);

    const householdsButton = page.locator('.nav-item:has-text("🏠 Households")');
    await householdsButton.click();

    // Wait for the Household Economics screen to load
    await page.waitForTimeout(2000);

    // Check that all tabs are visible
    const overviewTab = page.locator('.base-screen-tab:has-text("Overview")');
    const demandTab = page.locator('.base-screen-tab:has-text("Demand")');
    const mobilityTab = page.locator('.base-screen-tab:has-text("Mobility")');
    const wellbeingTab = page.locator('.base-screen-tab:has-text("Wellbeing")');
    const analyticsTab = page.locator('.base-screen-tab:has-text("Analytics")');

    await expect(overviewTab).toBeVisible();
    await expect(demandTab).toBeVisible();
    await expect(mobilityTab).toBeVisible();
    await expect(wellbeingTab).toBeVisible();
    await expect(analyticsTab).toBeVisible();

    // Test Demand tab
    await demandTab.click();
    await page.waitForTimeout(1000);

    // Check that demand content is displayed
    const demandTable = page.locator('.standard-data-table');
    await expect(demandTable).toBeVisible();

    // Check for demand data (more flexible)
    const foodDemand = page.locator('text=FOOD').first();
    await expect(foodDemand).toBeVisible();

    const luxuryGoods = page.locator('text=LUXURY GOODS').first();
    await expect(luxuryGoods).toBeVisible();

    const housingDemand = page.locator('text=HOUSING').first();
    await expect(housingDemand).toBeVisible();

    // Test Mobility tab
    await mobilityTab.click();
    await page.waitForTimeout(1000);

    // Check that mobility content is displayed
    const mobilityStats = page.locator('text=Social Mobility Statistics');
    await expect(mobilityStats).toBeVisible();

    const opportunities = page.locator('text=Mobility Opportunities').first();
    await expect(opportunities).toBeVisible();

    // Check for mobility data (more flexible)
    const educationInvestment = page.locator('text=EDUCATION INVESTMENT').first();
    await expect(educationInvestment).toBeVisible();

    const businessStartup = page.locator('text=BUSINESS STARTUP').first();
    await expect(businessStartup).toBeVisible();

    // Test Wellbeing tab
    await wellbeingTab.click();
    await page.waitForTimeout(1000);

    // Check that wellbeing content is displayed
    const wellbeingOverview = page.locator('text=Wellbeing Overview');
    await expect(wellbeingOverview).toBeVisible();

    const housingMetrics = page.locator('text=Housing Metrics');
    await expect(housingMetrics).toBeVisible();

    const familyCommunity = page.locator('text=Family & Community');
    await expect(familyCommunity).toBeVisible();

    // Test Analytics tab
    await analyticsTab.click();
    await page.waitForTimeout(1000);

    // Check that analytics content is displayed
    const householdAnalytics = page.locator('text=Household Analytics');
    await expect(householdAnalytics).toBeVisible();

    const recentEvents = page.locator('text=Recent Mobility Events');
    await expect(recentEvents).toBeVisible();

    // Check for analytics data (more flexible)
    const totalPopulationAnalytics = page.locator('text=150,000').first();
    await expect(totalPopulationAnalytics).toBeVisible();

    const incomeInequality = page.locator('text=42.0%').first();
    await expect(incomeInequality).toBeVisible();

    // Return to Overview tab
    await overviewTab.click();
    await page.waitForTimeout(1000);

    // Verify we're back to overview
    const economicOverview = page.locator('text=Economic Overview');
    await expect(economicOverview).toBeVisible();

    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/household-economics-tabs.png', fullPage: true });
  });
});
