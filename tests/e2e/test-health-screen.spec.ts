import { test, expect } from '@playwright/test';

test('Test Health Screen Tabs and Data', async ({ page }) => {
  console.log('🏥 Testing Health Screen...');
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('📱 Console:', msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  // Look for Health navigation
  const healthButton = page.locator('text=Health');
  if (await healthButton.count() > 0) {
    console.log('✅ Found Health button');
    await healthButton.click();
    await page.waitForTimeout(2000);
    
    // Check if we're on the Health screen
    const healthTitle = page.locator('text=Health');
    if (await healthTitle.count() > 0) {
      console.log('✅ Health screen loaded');
      
      // Check each tab
      const tabs = ['Overview', 'Leadership', 'Diseases', 'Infrastructure', 'Operations'];
      
      for (const tab of tabs) {
        console.log(`\n--- Testing ${tab} tab ---`);
        
        try {
          const tabButton = page.locator(`text=${tab}`);
          if (await tabButton.count() > 0) {
            await tabButton.click();
            await page.waitForTimeout(1000);
            
            // Check for content based on tab
            if (tab === 'Overview') {
              const metrics = page.locator('.standard-metric');
              const count = await metrics.count();
              console.log(`📊 ${tab} metrics found: ${count}`);
            } else if (tab === 'Leadership') {
              const leadershipContent = page.locator('text=Health Secretary, text=Surgeon General');
              const count = await leadershipContent.count();
              console.log(`👥 ${tab} content found: ${count}`);
            } else if (tab === 'Diseases') {
              const diseaseTable = page.locator('table');
              const count = await diseaseTable.count();
              console.log(`🦠 ${tab} tables found: ${count}`);
            } else if (tab === 'Infrastructure') {
              const facilityTable = page.locator('table');
              const count = await facilityTable.count();
              console.log(`🏥 ${tab} tables found: ${count}`);
            } else if (tab === 'Operations') {
              const policyTable = page.locator('table');
              const count = await policyTable.count();
              console.log(`⚙️ ${tab} tables found: ${count}`);
            }
          } else {
            console.log(`❌ ${tab} tab not found`);
          }
        } catch (error) {
          console.log(`❌ Error testing ${tab} tab:`, error.message);
        }
      }
    } else {
      console.log('❌ Health screen title not found');
    }
  } else {
    console.log('❌ Health button not found');
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/health-screen-test.png' });
  console.log('🏥 Health screen test complete - check screenshot at tests/screenshots/health-screen-test.png');
});

