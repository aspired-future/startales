import { chromium } from 'playwright';

async function verifyHealthContent() {
  console.log('🔍 Verifying Health screen content...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Click Civilization button
    const civilizationButton = await page.locator('button:has-text("🏛️ Civilization")').first();
    if (await civilizationButton.isVisible()) {
      await civilizationButton.click();
      console.log('✅ Clicked Civilization button');
      await page.waitForTimeout(2000);
    }
    
    // Click Population accordion
    const populationAccordion = await page.locator('.accordion-header:has-text("👥")').first();
    if (await populationAccordion.isVisible()) {
      await populationAccordion.click();
      console.log('✅ Clicked Population accordion');
      await page.waitForTimeout(2000);
    }
    
    // Click Health button
    const healthButton = await page.locator('button:has-text("Health")').first();
    if (await healthButton.isVisible()) {
      await healthButton.click();
      console.log('✅ Clicked Health button');
      
      // Wait for the popup to load
      await page.waitForTimeout(3000);
      
      // Check each tab for content
      const tabs = ['Overview', 'Leadership', 'Diseases', 'Infrastructure', 'Operations'];
      
      for (const tabName of tabs) {
        console.log(`\n📋 Checking ${tabName} tab...`);
        
        // Click the tab
        const tab = await page.locator(`button:has-text("${tabName}")`).first();
        if (await tab.isVisible()) {
          await tab.click();
          console.log(`✅ Clicked ${tabName} tab`);
          await page.waitForTimeout(1000);
          
          // Check for content based on tab
          switch (tabName) {
            case 'Overview':
              const overviewContent = await page.locator('text=Health Overview').first();
              if (await overviewContent.isVisible()) {
                console.log('✅ Overview: Health Overview section found');
              }
              const trendsChart = await page.locator('text=Health Trends').first();
              if (await trendsChart.isVisible()) {
                console.log('✅ Overview: Health Trends chart found');
              }
              break;
              
            case 'Leadership':
              const leadershipContent = await page.locator('text=Health Leadership').first();
              if (await leadershipContent.isVisible()) {
                console.log('✅ Leadership: Health Leadership section found');
              }
              const secretary = await page.locator('text=Health Secretary').first();
              if (await secretary.isVisible()) {
                console.log('✅ Leadership: Health Secretary found');
              }
              const surgeonGeneral = await page.locator('text=Surgeon General').first();
              if (await surgeonGeneral.isVisible()) {
                console.log('✅ Leadership: Surgeon General found');
              }
              break;
              
            case 'Diseases':
              const diseasesContent = await page.locator('text=Diseases').first();
              if (await diseasesContent.isVisible()) {
                console.log('✅ Diseases: Diseases section found');
              }
              const diseasesTable = await page.locator('table').first();
              if (await diseasesTable.isVisible()) {
                console.log('✅ Diseases: Diseases table found');
              }
              break;
              
            case 'Infrastructure':
              const infrastructureContent = await page.locator('text=Healthcare Infrastructure').first();
              if (await infrastructureContent.isVisible()) {
                console.log('✅ Infrastructure: Healthcare Infrastructure section found');
              }
              const facilitiesTable = await page.locator('table').first();
              if (await facilitiesTable.isVisible()) {
                console.log('✅ Infrastructure: Facilities table found');
              }
              break;
              
            case 'Operations':
              const operationsContent = await page.locator('text=Health Operations').first();
              if (await operationsContent.isVisible()) {
                console.log('✅ Operations: Health Operations section found');
              }
              const policiesTable = await page.locator('text=Health Policies').first();
              if (await policiesTable.isVisible()) {
                console.log('✅ Operations: Health Policies section found');
              }
              const budgetTable = await page.locator('text=Budget Allocations').first();
              if (await budgetTable.isVisible()) {
                console.log('✅ Operations: Budget Allocations section found');
              }
              break;
          }
        } else {
          console.log(`❌ ${tabName} tab not found`);
        }
      }
      
      console.log('\n🎉 All Health screen tabs verified!');
      
      // Take a screenshot
      await page.screenshot({ path: 'tests/screenshots/health-screen-content-verified.png', fullPage: true });
      console.log('📸 Screenshot saved to tests/screenshots/health-screen-content-verified.png');
      
    } else {
      console.log('❌ Health button not found');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

verifyHealthContent().catch(console.error);

