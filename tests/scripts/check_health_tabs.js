import { chromium } from 'playwright';

async function checkHealthTabs() {
  console.log('🔍 Checking Health screen tabs for content...');
  
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
      await page.waitForTimeout(3000);
      
      // Check each tab
      const tabs = ['Overview', 'Leadership', 'Diseases', 'Infrastructure', 'Operations'];
      
      for (const tabName of tabs) {
        console.log(`\n📋 Checking ${tabName} tab...`);
        
        // Click the tab
        const tabButton = await page.locator(`button:has-text("${tabName}")`).first();
        if (await tabButton.isVisible()) {
          await tabButton.click();
          console.log(`✅ Clicked ${tabName} tab`);
          await page.waitForTimeout(2000);
          
          // Check for content
          const tables = await page.locator('table').all();
          const cards = await page.locator('.standard-panel').all();
          const charts = await page.locator('svg').all();
          const metrics = await page.locator('.standard-metric').all();
          
          console.log(`   📊 Found: ${tables.length} tables, ${cards.length} cards, ${charts.length} charts, ${metrics.length} metrics`);
          
          // Check for specific content based on tab
          if (tabName === 'Overview') {
            const overviewContent = await page.locator('text=Health Overview').first();
            console.log(`   📋 Overview content: ${await overviewContent.isVisible() ? '✅ Found' : '❌ Missing'}`);
          } else if (tabName === 'Leadership') {
            const leadershipContent = await page.locator('text=Health Secretary').first();
            console.log(`   👥 Leadership content: ${await leadershipContent.isVisible() ? '✅ Found' : '❌ Missing'}`);
          } else if (tabName === 'Diseases') {
            const diseasesContent = await page.locator('text=Cardiovascular Disease').first();
            console.log(`   🦠 Diseases content: ${await diseasesContent.isVisible() ? '✅ Found' : '❌ Missing'}`);
          } else if (tabName === 'Infrastructure') {
            const infrastructureContent = await page.locator('text=Central Medical Center').first();
            console.log(`   🏥 Infrastructure content: ${await infrastructureContent.isVisible() ? '✅ Found' : '❌ Missing'}`);
          } else if (tabName === 'Operations') {
            const operationsContent = await page.locator('text=Universal Healthcare Coverage').first();
            console.log(`   ⚙️ Operations content: ${await operationsContent.isVisible() ? '✅ Found' : '❌ Missing'}`);
          }
          
        } else {
          console.log(`❌ ${tabName} tab not found`);
        }
      }
      
    } else {
      console.log('❌ Health button not found');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

checkHealthTabs().catch(console.error);

