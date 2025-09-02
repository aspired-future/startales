import { test, expect } from '@playwright/test';

test('Test Health Screen via Civilization Navigation', async ({ page }) => {
  console.log('🏥 Testing Health Screen via Civilization...');
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  // Look for Civilization button
  const civilizationButton = page.locator('text=🏛️ Civilization');
  if (await civilizationButton.count() > 0) {
    console.log('✅ Found Civilization button');
    await civilizationButton.click();
    await page.waitForTimeout(2000);
    
    // Look for Population section
    const populationSection = page.locator('text=Population, text=POPULATION');
    if (await populationSection.count() > 0) {
      console.log('✅ Found Population section');
      await populationSection.first().click();
      await page.waitForTimeout(1000);
      
      // Look for Health button
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
        console.log('❌ Health button not found in Population section');
        
        // List all available buttons in Population section
        const allButtons = page.locator('button');
        const buttonCount = await allButtons.count();
        console.log('🔘 Total buttons found:', buttonCount);
        
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          const button = allButtons.nth(i);
          const text = await button.textContent();
          if (text && text.trim()) {
            console.log(`🔘 Button ${i}: "${text.trim()}"`);
          }
        }
      }
    } else {
      console.log('❌ Population section not found');
    }
  } else {
    console.log('❌ Civilization button not found');
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/health-via-civilization.png' });
  console.log('🏥 Health via Civilization test complete - check screenshot at tests/screenshots/health-via-civilization.png');
});

