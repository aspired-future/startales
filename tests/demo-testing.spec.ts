import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:4000';
const UI_URL = 'http://localhost:5173';

// List of all expected demos
const DEMOS = [
  'hud',
  'policies', 
  'speech',
  'cabinet',
  'trade',
  'simulation',
  'population',
  'professions',
  'businesses'
];

test.describe('Startales Demo Testing', () => {
  
  test.beforeAll(async () => {
    // Ensure services are running
    console.log('Testing against:', BASE_URL);
  });

  test('API Health Check', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/witter/feed?limit=1`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.posts).toBeDefined();
  });

  test('UI Health Check', async ({ page }) => {
    await page.goto(UI_URL);
    await expect(page).toHaveTitle(/Startales/);
    
    // Check if Witter feed loads
    await expect(page.locator('.witter-feed, .posts-container')).toBeVisible({ timeout: 10000 });
  });

  test('Demo HUD - Main Landing Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/demo/hud`);
    
    // Check page loads
    await expect(page).toHaveTitle(/Startales Comprehensive Demo HUD/);
    
    // Check main sections are present
    await expect(page.locator('h1')).toContainText('Startales Comprehensive Demo HUD');
    
    // Check demo categories are present
    await expect(page.locator('.category')).toHaveCount(4); // Should have 4 categories
    
    // Check for demo cards
    const demoCards = page.locator('.demo-card');
    await expect(demoCards).toHaveCountGreaterThan(5);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/demo-hud.png', fullPage: true });
  });

  // Test each individual demo
  for (const demo of DEMOS) {
    if (demo === 'hud') continue; // Already tested above
    
    test(`Demo: ${demo}`, async ({ page }) => {
      const url = `${BASE_URL}/demo/${demo}`;
      console.log(`Testing demo: ${url}`);
      
      const response = await page.goto(url);
      
      // Check if page loads without 404
      expect(response?.status()).not.toBe(404);
      
      if (response?.status() === 200) {
        // Page loaded successfully
        await page.waitForLoadState('networkidle');
        
        // Check it's not a generic error page
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('Cannot GET');
        expect(bodyText).not.toContain('Error');
        
        // Check for basic HTML structure
        await expect(page.locator('html')).toBeVisible();
        await expect(page.locator('body')).toBeVisible();
        
        // Take screenshot
        await page.screenshot({ 
          path: `tests/screenshots/demo-${demo}.png`, 
          fullPage: true 
        });
        
        // Test basic interactivity if buttons are present
        const buttons = page.locator('button');
        const buttonCount = await buttons.count();
        
        if (buttonCount > 0) {
          console.log(`Found ${buttonCount} buttons in ${demo} demo`);
          
          // Try clicking the first button to see if it responds
          const firstButton = buttons.first();
          const buttonText = await firstButton.textContent();
          console.log(`First button text: ${buttonText}`);
          
          // Click and wait for any response
          await firstButton.click();
          await page.waitForTimeout(1000); // Wait for any async operations
        }
        
        // Test API endpoints if they exist
        if (demo === 'policies') {
          await testPoliciesAPI(page);
        } else if (demo === 'trade') {
          await testTradeAPI(page);
        } else if (demo === 'simulation') {
          await testSimulationAPI(page);
        }
        
      } else {
        console.log(`Demo ${demo} returned status: ${response?.status()}`);
        
        // Take screenshot of error for debugging
        await page.screenshot({ 
          path: `tests/screenshots/demo-${demo}-error.png`, 
          fullPage: true 
        });
        
        // This demo needs to be implemented
        test.fail(true, `Demo ${demo} is not implemented (status: ${response?.status()})`);
      }
    });
  }
});

async function testPoliciesAPI(page: Page) {
  console.log('Testing Policies API functionality...');
  
  // Try to create a policy
  const titleInput = page.locator('#title');
  const bodyInput = page.locator('#body');
  const createButton = page.locator('#create');
  
  if (await titleInput.isVisible()) {
    await titleInput.fill('Test Policy');
    await bodyInput.fill('This is a test policy for research funding');
    await createButton.click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check if output appears
    const output = page.locator('#out');
    const outputText = await output.textContent();
    console.log('Policy creation output:', outputText?.substring(0, 100));
  }
}

async function testTradeAPI(page: Page) {
  console.log('Testing Trade API functionality...');
  
  // Try to load prices
  const loadPricesButton = page.locator('#loadPrices');
  
  if (await loadPricesButton.isVisible()) {
    await loadPricesButton.click();
    await page.waitForTimeout(2000);
    
    // Check if prices appear
    const pricesOutput = page.locator('#prices');
    const pricesText = await pricesOutput.textContent();
    console.log('Prices output:', pricesText?.substring(0, 100));
  }
}

async function testSimulationAPI(page: Page) {
  console.log('Testing Simulation API functionality...');
  
  // Try to run simulation step
  const runButton = page.locator('button:has-text("Run Simulation")');
  
  if (await runButton.isVisible()) {
    await runButton.click();
    await page.waitForTimeout(3000);
    
    // Check if results appear
    const logDiv = page.locator('#log');
    const logText = await logDiv.textContent();
    console.log('Simulation output:', logText?.substring(0, 100));
  }
}
