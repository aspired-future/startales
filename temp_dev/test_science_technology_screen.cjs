const { chromium } = require('playwright');

async function testScienceTechnologyScreen() {
  console.log('🧪 Testing Science & Technology Screen...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the HUD
    console.log('📱 Navigating to HUD...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Look for Science navigation in left panel
    console.log('🔍 Looking for Science navigation...');
    const scienceAccordion = await page.$('text=Science');
    if (scienceAccordion) {
      console.log('✅ Found Science accordion');
      await scienceAccordion.click();
      await page.waitForTimeout(1000);
      
      // Click on Research & Development
      const researchLink = await page.$('text=Research & Development');
      if (researchLink) {
        console.log('✅ Found Research & Development link');
        await researchLink.click();
        await page.waitForTimeout(2000);
        
        // Check if the Science & Technology screen loaded
        const screenTitle = await page.$('h1:has-text("Science & Technology Research")');
        if (screenTitle) {
          console.log('✅ Science & Technology screen loaded successfully');
          
          // Test the tabs
          console.log('🔍 Testing screen tabs...');
          const tabs = [
            'Overview', 'Research Tree', 'Active Projects', 'Innovations', 
            'Collaboration', 'Analysis', 'Breakthroughs', 'Ethics', 'Applications'
          ];
          
          let tabsFound = 0;
          for (const tabName of tabs) {
            const tab = await page.$(`button:has-text("${tabName}")`);
            if (tab) {
              tabsFound++;
              console.log(`✅ Found ${tabName} tab`);
              
              // Click the tab to test it
              await tab.click();
              await page.waitForTimeout(500);
            } else {
              console.log(`❌ Missing ${tabName} tab`);
            }
          }
          
          console.log(`📊 Found ${tabsFound}/${tabs.length} tabs`);
          
          // Test Overview tab content
          console.log('🔍 Testing Overview tab content...');
          const overviewTab = await page.$('button:has-text("Overview")');
          if (overviewTab) {
            await overviewTab.click();
            await page.waitForTimeout(1000);
            
            // Check for research stats
            const statsCards = await page.$$('.stat-card');
            console.log(`📊 Found ${statsCards.length} stat cards`);
            
            // Check for action buttons
            const allocateBtn = await page.$('button:has-text("Allocate Research Points")');
            const rushBtn = await page.$('button:has-text("Rush Current Research")');
            
            if (allocateBtn) console.log('✅ Found Allocate Research Points button');
            if (rushBtn) console.log('✅ Found Rush Current Research button');
            
            // Test clicking allocate button
            if (allocateBtn) {
              await allocateBtn.click();
              console.log('✅ Clicked Allocate Research Points button');
              await page.waitForTimeout(1000);
            }
          }
          
          // Test Research Tree tab
          console.log('🔍 Testing Research Tree tab...');
          const researchTreeTab = await page.$('button:has-text("Research Tree")');
          if (researchTreeTab) {
            await researchTreeTab.click();
            await page.waitForTimeout(1000);
            
            const techCards = await page.$$('.tech-card');
            console.log(`🔬 Found ${techCards.length} technology cards`);
            
            if (techCards.length > 0) {
              // Click on the first tech card
              await techCards[0].click();
              console.log('✅ Clicked on first technology card');
              await page.waitForTimeout(1000);
            }
          }
          
          // Test Active Projects tab
          console.log('🔍 Testing Active Projects tab...');
          const projectsTab = await page.$('button:has-text("Active Projects")');
          if (projectsTab) {
            await projectsTab.click();
            await page.waitForTimeout(1000);
            
            const projectCards = await page.$$('.project-card');
            console.log(`📋 Found ${projectCards.length} active project cards`);
          }
          
        } else {
          console.log('❌ Science & Technology screen title not found');
        }
        
      } else {
        console.log('❌ Research & Development link not found');
      }
    } else {
      console.log('❌ Science accordion not found');
    }
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/science_technology_screen.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/science_technology_screen.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testScienceTechnologyScreen();
