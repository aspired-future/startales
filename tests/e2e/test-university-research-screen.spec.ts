import { test, expect } from '@playwright/test';

test.describe('University Research Screen - New Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Should display University Research screen with new design and all functionality', async ({ page }) => {
    // Navigate to University Research screen
    await page.waitForTimeout(1000);
    
    // Click on Science & Tech section to expand it
    const scienceSection = page.locator('text=🔬SCIENCE & TECH▶');
    await expect(scienceSection).toBeVisible();
    await scienceSection.click();
    await page.waitForTimeout(1000);
    
    // Click on University Research
    const universityResearchButton = page.locator('button').filter({ hasText: 'University Research' });
    await expect(universityResearchButton).toBeVisible();
    await universityResearchButton.click();
    await page.waitForTimeout(2000);
    
    // Verify screen title
    const screenTitle = page.locator('h2').filter({ hasText: 'University Research' });
    await expect(screenTitle).toBeVisible();
    
    // Verify technology theme
    const themeContainer = page.locator('.standard-screen-container.technology-theme');
    await expect(themeContainer).toBeVisible();
    
    // Verify panels in overview tab
    const panels = page.locator('.standard-panel.technology-theme');
    await expect(panels).toHaveCount(3); // Academic Research Overview, Active Research Projects, Research Analytics
    
    // Verify tabs (use more specific selectors to avoid conflicts with navigation)
    const overviewTab = page.locator('.base-screen-tab').filter({ hasText: 'Overview' });
    const projectsTab = page.locator('.base-screen-tab').filter({ hasText: 'Projects' });
    const universitiesTab = page.locator('.base-screen-tab').filter({ hasText: 'Universities' });
    const collaborationsTab = page.locator('.base-screen-tab').filter({ hasText: 'Collaborations' });
    
    await expect(overviewTab).toBeVisible();
    await expect(projectsTab).toBeVisible();
    await expect(universitiesTab).toBeVisible();
    await expect(collaborationsTab).toBeVisible();
    
    // Verify specific content in overview tab
    const totalFunding = page.locator('.standard-metric').filter({ hasText: 'Total Funding' });
    const activeProjects = page.locator('.standard-metric').filter({ hasText: 'Active Projects' });
    const publications = page.locator('.standard-metric').filter({ hasText: 'Publications' });
    await expect(totalFunding).toBeVisible();
    await expect(activeProjects).toBeVisible();
    await expect(publications).toBeVisible();
    
    // Verify charts in overview
    const charts = page.locator('.chart-container');
    await expect(charts).toHaveCount(2);
    
    // Test tab navigation - Projects
    await projectsTab.click();
    await page.waitForTimeout(1000);
    const researchProjects = page.locator('text=Research Projects');
    await expect(researchProjects).toBeVisible();
    
    // Test tab navigation - Universities
    await universitiesTab.click();
    await page.waitForTimeout(1000);
    const researchUniversities = page.locator('text=Research Universities');
    await expect(researchUniversities).toBeVisible();
    
    // Test tab navigation - Collaborations
    await collaborationsTab.click();
    await page.waitForTimeout(1000);
    const researchCollaborations = page.locator('text=Research Collaborations');
    await expect(researchCollaborations).toBeVisible();
    
    // Verify scrolling and layout
    const dashboard = page.locator('.standard-dashboard');
    await expect(dashboard).toBeVisible();
    
    const tableContainers = page.locator('.standard-table-container');
    await expect(tableContainers).toBeVisible();
    
    // Verify technology theme styling (check for at least one technology button)
    const technologyButtons = page.locator('.standard-btn.technology-theme');
    await expect(technologyButtons.first()).toBeVisible();
    
    // Verify action buttons
    const actionButtons = page.locator('.standard-action-buttons');
    await expect(actionButtons).toBeVisible();
  });
});

