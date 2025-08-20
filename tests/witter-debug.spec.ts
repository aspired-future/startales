import { test, expect } from '@playwright/test';

test.describe('Witter UI Debug', () => {
  test('should load Witter UI and check for errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // Navigate to Witter UI
    console.log('Navigating to Witter UI...');
    await page.goto('http://localhost:5174');

    // Wait for the page to load
    await page.waitForTimeout(3000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-witter-initial.png' });

    // Check if root element exists (handle multiple roots)
    const rootElements = await page.locator('#root').all();
    console.log('Number of root elements found:', rootElements.length);
    
    let rootContent = '';
    if (rootElements.length > 0) {
      rootContent = await rootElements[0].innerHTML();
    }
    console.log('Root element content length:', rootContent.length);
    console.log('Root element content preview:', rootContent.substring(0, 200));

    // Check for React app elements
    const appElements = await page.locator('div').count();
    console.log('Total div elements found:', appElements);

    // Look for specific Witter elements
    const witterElements = await page.locator('[class*="witter"], [class*="Witter"]').count();
    console.log('Witter-related elements found:', witterElements);

    // Check for loading states
    const loadingElements = await page.locator('text=loading', { timeout: 1000 }).count().catch(() => 0);
    console.log('Loading elements found:', loadingElements);

    // Log any errors found
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (pageErrors.length > 0) {
      console.log('Page errors found:');
      pageErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Check network requests
    const responses: string[] = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        responses.push(`${response.status()} ${response.url()}`);
      }
    });

    // Wait a bit more for any async operations
    await page.waitForTimeout(2000);

    // Final screenshot
    await page.screenshot({ path: 'debug-witter-final.png' });

    // Log failed network requests
    if (responses.length > 0) {
      console.log('Failed network requests:');
      responses.forEach((response, index) => {
        console.log(`${index + 1}. ${response}`);
      });
    }

    // The test should pass even if there are issues - we're just debugging
    console.log('Debug test completed');
  });

  test('should test API endpoints directly', async ({ request }) => {
    console.log('Testing API endpoints...');

    // Test Witter feed API
    try {
      const feedResponse = await request.get('http://localhost:4000/api/witter/feed?limit=1');
      console.log('Feed API status:', feedResponse.status());
      if (feedResponse.ok()) {
        const feedData = await feedResponse.json();
        console.log('Feed API working, posts count:', feedData.posts?.length || 0);
      } else {
        console.log('Feed API failed:', await feedResponse.text());
      }
    } catch (error) {
      console.log('Feed API error:', error);
    }

    // Test filters API
    try {
      const filtersResponse = await request.get('http://localhost:4000/api/witter/filters');
      console.log('Filters API status:', filtersResponse.status());
      if (filtersResponse.ok()) {
        const filtersData = await filtersResponse.json();
        console.log('Filters API working, civilizations count:', filtersData.civilizations?.length || 0);
      } else {
        console.log('Filters API failed:', await filtersResponse.text());
      }
    } catch (error) {
      console.log('Filters API error:', error);
    }
  });
});
