import { test, expect } from '@playwright/test';

test.describe('Science Technology Screen - New Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Should display Science Technology screen with new design and all functionality', async ({ page }) => {
    // Navigate to Science Technology screen
    await page.waitForTimeout(1000);
    
    // Click on Science & Tech section to expand it
    const scienceSection = page.locator('text=🔬SCIENCE & TECH▶');
    await expect(scienceSection).toBeVisible();
    await scienceSection.click();
    await page.waitForTimeout(1000);
    
    // Click on Government R&D
    const governmentResearchButton = page.locator('button').filter({ hasText: 'Government R&D' });
    await expect(governmentResearchButton).toBeVisible();
    await governmentResearchButton.click();
    await page.waitForTimeout(2000);
    
    // Verify screen title
    const screenTitle = page.locator('h2').filter({ hasText: 'Government Research' });
    await expect(screenTitle).toBeVisible();
    
    // Verify technology theme
    const themeContainer = page.locator('.standard-screen-container.technology-theme');
    await expect(themeContainer).toBeVisible();
    
    // Verify panels in overview tab
    const panels = page.locator('.standard-panel.technology-theme');
    await expect(panels).toHaveCount(3); // Research & Development Overview, Active Research Projects, Research Analytics
    
    // Verify tabs (use more specific selectors to avoid conflicts with navigation)
    const overviewTab = page.locator('.base-screen-tab').filter({ hasText: 'Overview' });
    const researchTab = page.locator('.base-screen-tab').filter({ hasText: 'Research' });
    const projectsTab = page.locator('.base-screen-tab').filter({ hasText: 'Projects' });
    const innovationsTab = page.locator('.base-screen-tab').filter({ hasText: 'Innovations' });
    const collaborationTab = page.locator('.base-screen-tab').filter({ hasText: 'Collaboration' });
    
    await expect(overviewTab).toBeVisible();
    await expect(researchTab).toBeVisible();
    await expect(projectsTab).toBeVisible();
    await expect(innovationsTab).toBeVisible();
    await expect(collaborationTab).toBeVisible();
    
    // Verify specific content in overview tab
    const totalFunding = page.locator('.standard-metric').filter({ hasText: 'Total Funding' });
    const researchEfficiency = page.locator('.standard-metric').filter({ hasText: 'Research Efficiency' });
    const breakthroughRate = page.locator('.standard-metric').filter({ hasText: 'Breakthrough Rate' });
    await expect(totalFunding).toBeVisible();
    await expect(researchEfficiency).toBeVisible();
    await expect(breakthroughRate).toBeVisible();
    
    // Verify charts in overview
    const charts = page.locator('.chart-container');
    await expect(charts).toHaveCount(2);
    
    // Test tab navigation - Research
    await researchTab.click();
    await page.waitForTimeout(1000);
    const technologyResearch = page.locator('text=Technology Research');
    await expect(technologyResearch).toBeVisible();
    
    // Test tab navigation - Projects
    await projectsTab.click();
    await page.waitForTimeout(1000);
    const researchProjects = page.locator('text=Research Projects');
    await expect(researchProjects).toBeVisible();
    
    // Test tab navigation - Innovations
    await innovationsTab.click();
    await page.waitForTimeout(1000);
    const innovationsDiscoveries = page.locator('text=Innovations & Discoveries');
    await expect(innovationsDiscoveries).toBeVisible();
    
    // Test tab navigation - Collaboration
    await collaborationTab.click();
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
