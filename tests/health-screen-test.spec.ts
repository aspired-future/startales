import { test, expect } from '@playwright/test';

test.describe('Health Screen Tests', () => {
  test('Health screen should load and display content', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Look for the Population accordion and expand it
    const populationAccordion = page.locator('.nav-accordion:has-text("POPULATION")');
    await expect(populationAccordion).toBeVisible();
    
    // Click to expand the Population accordion
    await populationAccordion.click();
    
    // Wait for the accordion to expand
    await page.waitForTimeout(1000);
    
    // Look for the Health button
    const healthButton = page.locator('.nav-item:has-text("Health")');
    await expect(healthButton).toBeVisible();
    
    // Click the Health button
    await healthButton.click();
    
    // Wait for the panel to load
    await page.waitForTimeout(2000);
    
    // Check that the Health panel is visible
    const healthPanel = page.locator('.popup-base:has-text("Health")');
    await expect(healthPanel).toBeVisible();
    
    // Check that the title is correct
    const title = page.locator('h2:has-text("Health")');
    await expect(title).toBeVisible();
    
    // Check that tabs are present
    const overviewTab = page.locator('.tab-button:has-text("Overview")');
    await expect(overviewTab).toBeVisible();
    
    const facilitiesTab = page.locator('.tab-button:has-text("Facilities")');
    await expect(facilitiesTab).toBeVisible();
    
    const programsTab = page.locator('.tab-button:has-text("Programs")');
    await expect(programsTab).toBeVisible();
    
    const analyticsTab = page.locator('.tab-button:has-text("Analytics")');
    await expect(analyticsTab).toBeVisible();
    
    // Check that some health data is displayed
    const totalFacilities = page.locator('text=3,456');
    await expect(totalFacilities).toBeVisible();
    
    const totalStaff = page.locator('text=123,456');
    await expect(totalStaff).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'tests/screenshots/health-screen-loaded.png' });
    
    console.log('✅ Health screen loaded successfully');
  });
  
  test('Health screen tabs should work', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Expand Population accordion and click Health
    const populationAccordion = page.locator('.nav-accordion:has-text("POPULATION")');
    await populationAccordion.click();
    await page.waitForTimeout(1000);
    
    const healthButton = page.locator('.nav-item:has-text("Health")');
    await healthButton.click();
    await page.waitForTimeout(2000);
    
    // Test Facilities tab
    const facilitiesTab = page.locator('.tab-button:has-text("Facilities")');
    await facilitiesTab.click();
    await page.waitForTimeout(1000);
    
    // Check that facilities data is displayed
    const capitalHospital = page.locator('text=Capital General Hospital');
    await expect(capitalHospital).toBeVisible();
    
    // Test Programs tab
    const programsTab = page.locator('.tab-button:has-text("Programs")');
    await programsTab.click();
    await page.waitForTimeout(1000);
    
    // Check that programs data is displayed
    const preventiveCare = page.locator('text=Preventive Care');
    await expect(preventiveCare).toBeVisible();
    
    // Test Analytics tab
    const analyticsTab = page.locator('.tab-button:has-text("Analytics")');
    await analyticsTab.click();
    await page.waitForTimeout(1000);
    
    // Check that analytics data is displayed
    const performanceMetrics = page.locator('text=Performance Metrics');
    await expect(performanceMetrics).toBeVisible();
    
    console.log('✅ All Health screen tabs working correctly');
  });
});

