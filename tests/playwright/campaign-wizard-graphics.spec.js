import { test, expect } from '@playwright/test';

test.describe('Campaign Wizard Graphics Generation', () => {
  test('should generate graphics options in step 3', async ({ page }) => {
    console.log('🎮 Testing Campaign Wizard Graphics Generation...');

    // Navigate to the application
    await page.goto('http://localhost:5175');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/01-initial-load.png' });

    // Look for settings button
    console.log('🔍 Looking for settings button...');
    const settingsButton = page.locator('button[title="Settings"], .settings-btn, button:has-text("⚙️")');
    await expect(settingsButton).toBeVisible({ timeout: 10000 });
    await settingsButton.click();

    await page.screenshot({ path: 'tests/screenshots/02-settings-opened.png' });

    // Look for Game tab in settings
    console.log('🎯 Looking for Game tab...');
    const gameTab = page.locator('button:has-text("Game")');
    await expect(gameTab).toBeVisible({ timeout: 5000 });
    await gameTab.click();

    await page.screenshot({ path: 'tests/screenshots/03-game-tab-selected.png' });

    // Look for Start New Game button
    console.log('🚀 Looking for Start New Game button...');
    const newGameButton = page.locator('button:has-text("Start New Game"), button:has-text("Game Setup Wizard")');
    await expect(newGameButton).toBeVisible({ timeout: 5000 });
    await newGameButton.click();

    await page.screenshot({ path: 'tests/screenshots/04-campaign-wizard-opened.png' });

    // Wait for Campaign Wizard to load
    console.log('📋 Waiting for Campaign Wizard to load...');
    await expect(page.locator('h1:has-text("Campaign Setup Wizard")')).toBeVisible({ timeout: 10000 });

    // Fill in basic info (Step 1)
    console.log('📝 Filling basic campaign info...');
    const nameInput = page.locator('input[placeholder*="campaign name"], input[name="name"], input[type="text"]:first');
    await nameInput.fill('Test Campaign');

    const descriptionInput = page.locator('textarea[placeholder*="description"], textarea[name="description"]');
    if (await descriptionInput.isVisible()) {
      await descriptionInput.fill('Test campaign for graphics generation');
    }

    await page.screenshot({ path: 'tests/screenshots/05-basic-info-filled.png' });

    // Click Next to go to Step 2 (Scenario Selection)
    console.log('➡️ Moving to Scenario Selection...');
    const nextButton1 = page.locator('button:has-text("Next"), button:has-text("Continue")');
    await nextButton1.click();

    await page.screenshot({ path: 'tests/screenshots/06-scenario-selection.png' });

    // Select a scenario (any scenario to proceed)
    console.log('🎭 Selecting a scenario...');
    const scenarioOption = page.locator('.scenario-card, .option-card, button[data-scenario], .scenario-option').first();
    if (await scenarioOption.isVisible()) {
      await scenarioOption.click();
    } else {
      // Try alternative selectors
      const altScenario = page.locator('input[type="radio"], .radio-option, button:has-text("Default")').first();
      if (await altScenario.isVisible()) {
        await altScenario.click();
      }
    }

    await page.screenshot({ path: 'tests/screenshots/07-scenario-selected.png' });

    // Click Next to go to Step 3 (Graphics & Theme)
    console.log('➡️ Moving to Graphics & Theme step...');
    const nextButton2 = page.locator('button:has-text("Next"), button:has-text("Continue")');
    await nextButton2.click();

    await page.screenshot({ path: 'tests/screenshots/08-graphics-step.png' });

    // Wait for Graphics & Theme step to load
    console.log('🎨 Waiting for Graphics & Theme step...');
    await expect(page.locator('h2:has-text("Graphics"), h2:has-text("Theme")')).toBeVisible({ timeout: 5000 });

    // Look for Generate Graphics button
    console.log('🔍 Looking for Generate Graphics button...');
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Graphics Options")');
    
    if (await generateButton.isVisible()) {
      console.log('✅ Generate Graphics button found, clicking...');
      
      // Monitor network requests
      const responsePromise = page.waitForResponse(response => 
        response.url().includes('/api/campaign/generate-graphics') && response.status() === 200
      );

      await generateButton.click();
      
      await page.screenshot({ path: 'tests/screenshots/09-generate-clicked.png' });

      try {
        // Wait for API response
        console.log('⏳ Waiting for graphics generation API response...');
        const response = await responsePromise;
        console.log('📡 API Response Status:', response.status());
        
        const responseData = await response.json();
        console.log('📊 API Response Data:', JSON.stringify(responseData, null, 2));

        // Wait for graphics options to appear
        console.log('🖼️ Waiting for graphics options to appear...');
        await expect(page.locator('.graphics-card, .graphics-option, .option-card')).toBeVisible({ timeout: 10000 });
        
        await page.screenshot({ path: 'tests/screenshots/10-graphics-generated.png' });

        // Count graphics options
        const graphicsOptions = page.locator('.graphics-card, .graphics-option, .option-card');
        const optionCount = await graphicsOptions.count();
        console.log(`🎯 Found ${optionCount} graphics options`);

        // Verify we have multiple options
        expect(optionCount).toBeGreaterThan(0);

        // Try to select a graphics option
        if (optionCount > 0) {
          console.log('🎨 Selecting first graphics option...');
          await graphicsOptions.first().click();
          await page.screenshot({ path: 'tests/screenshots/11-graphics-selected.png' });
        }

        console.log('✅ Graphics generation test completed successfully!');

      } catch (error) {
        console.error('❌ Graphics generation failed:', error);
        
        // Check for error messages on page
        const errorMessage = page.locator('.error-message, .alert-danger, [class*="error"]');
        if (await errorMessage.isVisible()) {
          const errorText = await errorMessage.textContent();
          console.log('🚨 Error message on page:', errorText);
        }

        // Check console errors
        page.on('console', msg => {
          if (msg.type() === 'error') {
            console.log('🔴 Browser console error:', msg.text());
          }
        });

        await page.screenshot({ path: 'tests/screenshots/12-graphics-error.png' });
        throw error;
      }

    } else {
      console.log('❌ Generate Graphics button not found');
      
      // Check what's actually on the page
      const pageContent = await page.content();
      console.log('📄 Page content preview:', pageContent.substring(0, 1000));
      
      await page.screenshot({ path: 'tests/screenshots/09-no-generate-button.png' });
      
      throw new Error('Generate Graphics button not found on Graphics & Theme step');
    }
  });

  test('should handle graphics generation API errors gracefully', async ({ page }) => {
    console.log('🧪 Testing graphics generation error handling...');

    // Mock API to return error
    await page.route('**/api/campaign/generate-graphics', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error for graphics generation' })
      });
    });

    // Follow same steps as above but expect error handling
    await page.goto('http://localhost:5175');
    
    // Navigate to graphics step (abbreviated)
    const settingsButton = page.locator('button[title="Settings"], .settings-btn, button:has-text("⚙️")');
    await settingsButton.click();
    
    const gameTab = page.locator('button:has-text("Game")');
    await gameTab.click();
    
    const newGameButton = page.locator('button:has-text("Start New Game"), button:has-text("Game Setup Wizard")');
    await newGameButton.click();
    
    // Fill basic info and navigate to graphics step
    const nameInput = page.locator('input[type="text"]:first');
    await nameInput.fill('Error Test Campaign');
    
    // Navigate through steps quickly
    await page.locator('button:has-text("Next")').click(); // To scenario
    await page.locator('.scenario-card, button:has-text("Default")').first().click(); // Select scenario
    await page.locator('button:has-text("Next")').click(); // To graphics
    
    // Try to generate graphics (should fail)
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Verify error handling
    await expect(page.locator('.error-message, .alert-danger')).toBeVisible({ timeout: 5000 });
    
    await page.screenshot({ path: 'tests/screenshots/13-error-handling.png' });
    
    console.log('✅ Error handling test completed!');
  });
});
